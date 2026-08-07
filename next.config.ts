import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 로컬 SVG 플레이스홀더 이미지 사용을 위한 설정 (실사진 교체 시 제거 가능)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
