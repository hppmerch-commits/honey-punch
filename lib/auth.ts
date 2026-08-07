import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "hp_admin";
const MAX_AGE = 60 * 60 * 12; // 12시간

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET 환경변수가 설정되지 않았습니다.");
  return s;
}

/** 길이가 달라도 타이밍 정보를 흘리지 않는 문자열 비교 */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // 길이가 다르면 timingSafeEqual이 던지므로, 같은 길이로 해시해서 비교한다.
  const ha = createHmac("sha256", secret()).update(ab).digest();
  const hb = createHmac("sha256", secret()).update(bb).digest();
  return timingSafeEqual(ha, hb);
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

/** "만료시각.서명" 형태의 세션 토큰 */
function createToken() {
  const expires = Date.now() + MAX_AGE * 1000;
  const nonce = randomBytes(8).toString("hex");
  const payload = `${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expires, nonce, sig] = parts;
  if (sign(`${expires}.${nonce}`) !== sig) return false;
  return Number(expires) > Date.now();
}

/** 비밀번호가 맞으면 세션 쿠키를 심는다. */
export async function login(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.");
  if (!password || !safeEqual(password, expected)) return false;

  const store = await cookies();
  store.set(COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}

/**
 * 관리자 전용 작업 앞에 반드시 호출한다.
 * Server Action은 UI를 거치지 않고 직접 POST될 수 있으므로 매번 검사해야 한다.
 */
export async function requireAdmin() {
  if (!(await isAuthenticated())) {
    throw new Error("권한이 없습니다. 다시 로그인해 주세요.");
  }
}
