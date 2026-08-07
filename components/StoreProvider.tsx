"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
};

type StoreValue = {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: CartItem) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;

  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  inWishlist: (slug: string) => boolean;

  /** localStorage를 읽기 전에는 서버 렌더 결과와 맞추기 위해 비어 있는 상태로 둔다 */
  ready: boolean;
};

const CART_KEY = "hp_cart";
const WISH_KEY = "hp_wishlist";

/** 같은 상품이라도 사이즈·컬러가 다르면 다른 줄로 취급한다. */
export const itemKey = (i: Pick<CartItem, "slug" | "size" | "color">) =>
  `${i.slug}__${i.size}__${i.color}`;

const StoreContext = createContext<StoreValue | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // 최초 마운트 시에만 localStorage에서 복원 (SSR 불일치 방지)
  useEffect(() => {
    setCart(read<CartItem[]>(CART_KEY, []));
    setWishlist(read<string[]>(WISH_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const value = useMemo<StoreValue>(() => {
    return {
      cart,
      cartCount: cart.reduce((n, i) => n + i.qty, 0),
      cartTotal: cart.reduce((n, i) => n + i.price * i.qty, 0),

      addToCart: (item) =>
        setCart((prev) => {
          const key = itemKey(item);
          const found = prev.find((i) => itemKey(i) === key);
          if (found) {
            return prev.map((i) =>
              itemKey(i) === key ? { ...i, qty: i.qty + item.qty } : i
            );
          }
          return [...prev, item];
        }),

      updateQty: (key, qty) =>
        setCart((prev) =>
          qty <= 0
            ? prev.filter((i) => itemKey(i) !== key)
            : prev.map((i) => (itemKey(i) === key ? { ...i, qty } : i))
        ),

      removeFromCart: (key) =>
        setCart((prev) => prev.filter((i) => itemKey(i) !== key)),

      clearCart: () => setCart([]),

      wishlist,
      toggleWishlist: (slug) =>
        setWishlist((prev) =>
          prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        ),
      inWishlist: (slug) => wishlist.includes(slug),

      ready,
    };
  }, [cart, wishlist, ready]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore는 StoreProvider 안에서만 사용할 수 있습니다.");
  return ctx;
}
