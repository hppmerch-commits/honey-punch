/**
 * 외부에서 보이는 사이트 주소.
 * Railway 컨테이너 안에서는 req.url이 http://localhost:8080 이라 그대로 쓰면 안 되고,
 * 프록시가 붙여주는 x-forwarded-* 헤더나 SITE_URL을 기준으로 삼아야 한다.
 */
export function publicOrigin(h: Headers) {
  const fixed = process.env.SITE_URL?.trim().replace(/\/$/, "");
  if (fixed) return fixed;
  const proto = h.get("x-forwarded-proto")?.split(",")[0].trim() || "https";
  const host =
    h.get("x-forwarded-host")?.split(",")[0].trim() || h.get("host") || "";
  return `${proto}://${host}`;
}
