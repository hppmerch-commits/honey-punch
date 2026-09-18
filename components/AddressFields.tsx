"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fieldInput, fieldLabel, fieldHint } from "@/lib/ui";

/**
 * 배송지 주소 — 다음 우편번호 서비스로 찾고, 상세 주소만 직접 입력한다.
 * 스크립트를 못 불러오면(광고 차단·망 문제) 직접 입력으로 열어 주문은 계속할 수 있게 한다.
 */

const SDK_URL = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

type PostcodeData = {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  userSelectedType: "R" | "J";
  bname: string;
  buildingName: string;
};

type PostcodeCtor = new (opts: {
  oncomplete: (data: PostcodeData) => void;
  onresize?: (size: { height: number }) => void;
  onclose?: (state: string) => void;
  width?: string;
  height?: string;
}) => { embed: (el: HTMLElement, opts?: { autoClose?: boolean }) => void };

declare global {
  interface Window {
    daum?: { Postcode: PostcodeCtor };
  }
}

let loading: Promise<PostcodeCtor> | null = null;

function loadPostcode(): Promise<PostcodeCtor> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.daum?.Postcode) return Promise.resolve(window.daum.Postcode);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SDK_URL;
    s.async = true;
    s.onload = () =>
      window.daum?.Postcode
        ? resolve(window.daum.Postcode)
        : reject(new Error("주소 검색을 불러오지 못했습니다."));
    s.onerror = () => {
      loading = null;
      reject(new Error("주소 검색을 불러오지 못했습니다."));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/** 도로명 주소에 동·건물명을 괄호로 덧붙인다 (다음 권장 표기). */
function composeAddress(d: PostcodeData) {
  if (d.userSelectedType === "J") return d.jibunAddress;
  const parts: string[] = [];
  if (d.bname && /[동로가]$/.test(d.bname)) parts.push(d.bname);
  if (d.buildingName) parts.push(d.buildingName);
  return parts.length ? `${d.roadAddress} (${parts.join(", ")})` : d.roadAddress;
}

export default function AddressFields() {
  const [postcode, setPostcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  /** 다음 위젯이 알려주는 선호 높이 */
  const [panelHeight, setPanelHeight] = useState(444);
  /** 화면 높이 — 낮은 화면에서 패널이 뷰포트를 넘어 닫기 버튼이 가려지지 않게 한다 */
  const [viewport, setViewport] = useState(0);

  useEffect(() => {
    const update = () => setViewport(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 머리말(h-14 = 56px)과 여백을 뺀 나머지가 패널이 쓸 수 있는 최대 높이다.
  const boxHeight = viewport
    ? Math.max(180, Math.min(panelHeight, viewport - 80))
    : panelHeight;

  const boxRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLInputElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  /** 주소를 고르고 닫혔는가 — 그때는 초점이 상세 주소로 가야 한다 */
  const pickedRef = useRef(false);

  const search = useCallback(async () => {
    setBusy(true);
    let Postcode: PostcodeCtor;
    try {
      Postcode = await loadPostcode();
    } catch {
      // 검색을 못 쓰면 직접 입력으로 전환한다 — 주문이 막히면 안 된다.
      setFailed(true);
      setBusy(false);
      return;
    }
    setOpen(true);
    setBusy(false);
    // 패널이 그려진 뒤에 붙인다
    requestAnimationFrame(() => {
      const el = boxRef.current;
      if (!el) return;
      el.innerHTML = "";
      new Postcode({
        width: "100%",
        height: "100%",
        onresize: (size) => setPanelHeight(Math.min(size.height, 560)),
        oncomplete: (data) => {
          setPostcode(data.zonecode);
          setAddress1(composeAddress(data));
          // 다음 할 일은 상세 주소 입력이다 — 초점을 검색 버튼으로 되돌리지 않는다
          pickedRef.current = true;
          setOpen(false);
          requestAnimationFrame(() => detailRef.current?.focus());
        },
        onclose: () => setOpen(false),
      }).embed(el, { autoClose: true });
    });
  }, []);

  // 닫을 때 원래 버튼으로 초점을 돌려준다
  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    pickedRef.current = false;
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (!pickedRef.current) opener?.focus();
    };
  }, [open]);

  const readOnly = !failed;

  return (
    <>
      <div className="flex items-end gap-3">
        <label className="block w-[128px] shrink-0">
          <span className={fieldLabel}>우편번호</span>
          <input
            name="postcode"
            inputMode="numeric"
            autoComplete="postal-code"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            readOnly={readOnly}
            placeholder={readOnly ? "자동 입력" : ""}
            className={`${fieldInput} ${readOnly ? "cursor-default" : ""}`}
          />
        </label>
        {/* btnOutline은 w-full·h-14라 옆에 세울 수 없다 — 입력칸 높이에 맞춰 따로 둔다 */}
        <button
          ref={openerRef}
          type="button"
          onClick={search}
          disabled={busy}
          className="flex h-11 shrink-0 items-center justify-center border border-[#1e1e1e] bg-white px-5 text-[12px] text-[#1e1e1e] transition-colors hover:bg-[#1e1e1e] hover:text-white disabled:cursor-wait disabled:opacity-50"
        >
          {busy ? "여는 중…" : "주소 찾기"}
        </button>
      </div>

      <label className="block">
        <span className={fieldLabel}>주소 *</span>
        <input
          name="address1"
          required
          autoComplete="street-address"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          readOnly={readOnly}
          placeholder={readOnly ? "주소 찾기를 눌러주세요" : ""}
          className={`${fieldInput} ${readOnly ? "cursor-default" : ""}`}
        />
      </label>

      {failed && (
        <p role="alert" className="text-[12px] leading-relaxed text-red-600">
          주소 검색을 불러오지 못했습니다. 우편번호와 주소를 직접 입력해 주세요.
        </p>
      )}

      <label className="block">
        <span className={fieldLabel}>상세 주소</span>
        <input
          ref={detailRef}
          name="address2"
          maxLength={100}
          placeholder="동·호수 등 나머지 주소"
          className={fieldInput}
        />
        <span className={fieldHint}>동·호수까지 적어주시면 배송이 빨라집니다.</span>
      </label>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          {/* 화면이 낮아도 머리말(닫기 버튼)은 늘 보이도록, 검색 패널만 줄어들게 한다 */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="주소 검색"
            className="flex w-full max-w-[480px] flex-col bg-white"
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-5">
              <span className="text-[13px] tracking-[0.08em]">주소 검색</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="주소 검색 닫기"
                className="-mr-2 flex h-10 w-10 items-center justify-center text-[20px] leading-none text-neutral-400 hover:text-black"
              >
                ×
              </button>
            </div>
            <div ref={boxRef} style={{ height: boxHeight }} className="overflow-hidden" />
          </div>
        </div>
      )}
    </>
  );
}
