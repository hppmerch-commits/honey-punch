import "server-only";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { shipping } from "@/lib/site";
import type { OrderItemInput } from "@/lib/order-types";
import { cancelPayment, NicepayError } from "@/lib/nicepay";

/** 헷갈리는 글자(0/O, 1/I/L)를 뺀 주문번호용 문자셋 */
const CODE_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function randomCode(len: number) {
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += CODE_CHARS[bytes[i] % CODE_CHARS.length];
  return out;
}

/** 예: HP-20260818-3F7K */
function newOrderNumber(now = new Date()) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const ymd = kst.toISOString().slice(0, 10).replace(/-/g, "");
  return `HP-${ymd}-${randomCode(4)}`;
}

export class OrderError extends Error {}

/**
 * 주문 생성 — 가격은 클라이언트 값을 믿지 않고 DB에서 다시 계산한다.
 * 재고는 조건부 차감(재고 >= 수량)으로 동시 주문 경쟁을 막는다.
 */
export type PaymentMethod = "BANK_TRANSFER" | "CARD";

export async function createOrder(input: {
  items: OrderItemInput[];
  paymentMethod?: PaymentMethod;
  customerName: string;
  phone: string;
  email: string;
  postcode: string;
  address1: string;
  address2: string;
  memo: string;
}) {
  const items = input.items.filter((i) => Number.isInteger(i.qty) && i.qty > 0);
  if (items.length === 0) throw new OrderError("주문할 상품이 없습니다.");
  if (items.length > 50) throw new OrderError("한 번에 주문할 수 있는 항목 수를 넘었습니다.");

  const slugs = [...new Set(items.map((i) => i.slug))];
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, published: true },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  for (const item of items) {
    const p = bySlug.get(item.slug);
    if (!p || p.soldOut || p.stock <= 0) {
      throw new OrderError(
        `품절되었거나 판매가 종료된 상품이 있습니다: ${p?.name ?? item.slug}`
      );
    }
    if (item.size && !p.sizes.includes(item.size)) {
      throw new OrderError(`선택한 사이즈가 유효하지 않습니다: ${p.name}`);
    }
  }

  const subtotal = items.reduce(
    (n, i) => n + bySlug.get(i.slug)!.price * i.qty,
    0
  );
  const shippingFee = subtotal >= shipping.freeFrom ? 0 : shipping.fee;
  const total = subtotal + shippingFee;

  // 같은 상품이 여러 줄(사이즈/컬러)로 담겨도 재고는 slug 단위로 합산 차감한다.
  const qtyBySlug = new Map<string, number>();
  for (const i of items) {
    qtyBySlug.set(i.slug, (qtyBySlug.get(i.slug) ?? 0) + i.qty);
  }

  return prisma.$transaction(async (tx) => {
    for (const [slug, qty] of qtyBySlug) {
      const res = await tx.product.updateMany({
        where: { slug, stock: { gte: qty } },
        data: { stock: { decrement: qty } },
      });
      if (res.count === 0) {
        throw new OrderError(
          `재고가 부족합니다: ${bySlug.get(slug)!.name} (남은 수량을 확인해 주세요)`
        );
      }
    }

    // 주문번호 충돌은 사실상 없지만, 만에 하나를 위해 한 번 재시도한다.
    for (let attempt = 0; ; attempt++) {
      try {
        return await tx.order.create({
          data: {
            orderNumber: newOrderNumber(),
            paymentMethod: input.paymentMethod ?? "BANK_TRANSFER",
            customerName: input.customerName,
            phone: input.phone,
            email: input.email,
            postcode: input.postcode,
            address1: input.address1,
            address2: input.address2,
            memo: input.memo,
            subtotal,
            shippingFee,
            total,
            items: {
              create: items.map((i) => {
                const p = bySlug.get(i.slug)!;
                return {
                  productId: p.id,
                  slug: p.slug,
                  name: p.name,
                  image: p.image,
                  size: i.size,
                  color: i.color,
                  unitPrice: p.price,
                  qty: i.qty,
                };
              }),
            },
          },
          include: { items: true },
        });
      } catch (e) {
        const unique =
          typeof e === "object" && e !== null && "code" in e && e.code === "P2002";
        if (!unique || attempt >= 1) throw e;
      }
    }
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

/** 숫자만 남겨 비교한다 — 010-1234-5678 / 01012345678 를 같은 값으로 본다. */
const digits = (s: string) => s.replace(/\D/g, "");

/**
 * 비회원 주문조회 — 주문번호와 연락처가 모두 맞아야 돌려준다.
 * 둘 중 무엇이 틀렸는지 알려주지 않는다(주문번호 존재 여부 노출 방지).
 */
export async function findOrderForLookup(orderNumber: string, phone: string) {
  const no = orderNumber.trim().toUpperCase();
  const tel = digits(phone);
  if (!no || tel.length < 9) return null;

  const order = await prisma.order.findUnique({
    where: { orderNumber: no },
    include: { items: true },
  });
  if (!order || digits(order.phone) !== tel) return null;
  return order;
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export const ORDERS_PAGE_SIZE = 20;

/** 관리자 주문 목록 — 상태 필터 + 페이지네이션 */
export async function listOrdersForAdmin({
  status,
  page = 1,
}: {
  status?: string;
  page?: number;
} = {}) {
  const where = status ? { status } : {};
  const [rows, total, pendingCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: true },
      skip: (page - 1) * ORDERS_PAGE_SIZE,
      take: ORDERS_PAGE_SIZE,
    }),
    prisma.order.count({ where }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);
  return {
    orders: rows,
    total,
    pendingCount,
    page,
    totalPages: Math.max(1, Math.ceil(total / ORDERS_PAGE_SIZE)),
  };
}

/**
 * 취소 — 차감했던 재고를 되돌린다. 카드로 결제 완료된 주문은
 * 나이스페이먼츠 전액 취소(환불)가 성공해야만 취소 상태로 바꾼다.
 */
export async function cancelOrder(id: string, reason = "판매자 취소") {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) throw new OrderError("주문을 찾을 수 없습니다.");
  if (order.status === "CANCELLED") return order;
  if (order.status === "SHIPPED" || order.status === "DONE") {
    throw new OrderError("배송이 시작된 주문은 취소할 수 없습니다.");
  }

  // 환불이 먼저다 — PG 취소가 실패하면 주문 상태를 건드리지 않는다.
  let cancelledTid = "";
  if (order.paymentMethod === "CARD" && order.status === "PAID" && order.pgTid) {
    try {
      const r = await cancelPayment(order.pgTid, order.orderNumber, reason);
      cancelledTid = r.cancelledTid ?? "";
    } catch (e) {
      const msg = e instanceof NicepayError ? e.message : "환불 요청에 실패했습니다.";
      throw new OrderError(`카드 환불 실패: ${msg}`);
    }
  }

  return prisma.$transaction(async (tx) => {
    // 상태 전이를 조건부로 먼저 걸어, 동시에 두 번 취소돼도 재고가 두 번 복원되지 않게 한다.
    const flipped = await tx.order.updateMany({
      where: { id, status: order.status },
      data: { status: "CANCELLED", pgCancelledTid: cancelledTid },
    });
    if (flipped.count === 0) {
      return tx.order.findUniqueOrThrow({ where: { id }, include: { items: true } });
    }
    for (const item of order.items) {
      if (!item.productId) continue;
      await tx.product.updateMany({
        where: { id: item.productId },
        data: { stock: { increment: item.qty } },
      });
    }
    return tx.order.findUniqueOrThrow({ where: { id }, include: { items: true } });
  });
}

/**
 * PG 승인 성공을 주문에 반영한다. 이미 결제된 주문이면 그대로 둔다(중복 콜백 대비).
 */
export async function markOrderPaidByPg(
  orderNumber: string,
  pg: { tid: string; payMethod: string; cardName: string; paidAt: Date }
) {
  const res = await prisma.order.updateMany({
    where: { orderNumber, status: "PENDING", paymentMethod: "CARD" },
    data: {
      status: "PAID",
      paidAt: pg.paidAt,
      pgTid: pg.tid,
      pgPayMethod: pg.payMethod,
      pgCardName: pg.cardName,
    },
  });
  return res.count > 0;
}

/**
 * PG 쪽에서 이미 취소(환불)된 것을 웹훅으로 통보받았을 때 — 나이스페이 취소 API를
 * 다시 부르지 않고 주문 상태와 재고만 맞춘다. 이미 취소된 주문이면 아무것도 하지 않는다.
 */
export async function markOrderCancelledByPg(orderNumber: string, cancelledTid: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order || order.paymentMethod !== "CARD") return false;

  return prisma.$transaction(async (tx) => {
    const flipped = await tx.order.updateMany({
      where: { orderNumber, status: { in: ["PENDING", "PAID"] } },
      data: { status: "CANCELLED", pgCancelledTid: cancelledTid },
    });
    if (flipped.count === 0) return false;
    for (const item of order.items) {
      if (!item.productId) continue;
      await tx.product.updateMany({
        where: { id: item.productId },
        data: { stock: { increment: item.qty } },
      });
    }
    return true;
  });
}
