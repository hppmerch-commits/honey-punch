// 점자 패치 티셔츠 캠페인 비주얼 생성 — node scripts/gen-campaign-images.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PUB = join(process.cwd(), "public");
const OUT = join(PUB, "products");
mkdirSync(OUT, { recursive: true });

// 점자 셀(2×3) 도트 — dots: 채울 점 번호 배열 (1,2,3 = 왼쪽 위→아래 / 4,5,6 = 오른쪽 위→아래)
const brailleCell = (cx, cy, dots, r, gap, fill, emptyFill = "none") => {
  const pos = {
    1: [-gap / 2, -gap],
    2: [-gap / 2, 0],
    3: [-gap / 2, gap],
    4: [gap / 2, -gap],
    5: [gap / 2, 0],
    6: [gap / 2, gap],
  };
  return [1, 2, 3, 4, 5, 6]
    .map(
      (n) =>
        `<circle cx="${cx + pos[n][0]}" cy="${cy + pos[n][1]}" r="${r}" fill="${
          dots.includes(n) ? fill : emptyFill
        }"/>`
    )
    .join("");
};

// ── 티셔츠 + 왼쪽 소매(착용자 기준) 실리콘 패치 ─────────────────
// 뷰어 기준 오른쪽 소매가 착용자의 왼쪽 소매
const teeWithPatch = (name, tee, dark, patch, dotFill) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${tee}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <radialGradient id="bg" cx="0.5" cy="0.35" r="0.9">
      <stop offset="0" stop-color="#f7f6f4"/>
      <stop offset="1" stop-color="#edecea"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <ellipse cx="400" cy="830" rx="230" ry="26" fill="#000" opacity="0.05"/>
  <path d="M400,230 C360,230 335,242 325,255 L235,295 C205,310 195,335 205,360 L240,432 C247,447 265,454 280,447 L308,434 L308,750 C308,775 323,790 348,790 L452,790 C477,790 492,775 492,750 L492,434 L520,447 C535,454 553,447 560,432 L595,360 C605,335 595,310 565,295 L475,255 C465,242 440,230 400,230 Z" fill="url(#g)"/>
  <path d="M348,244 C362,268 438,268 452,244" stroke="${dark}" stroke-width="6" fill="none" opacity="0.6"/>
  <!-- 소매 끝 실리콘 점자 패치 -->
  <rect x="524" y="404" width="46" height="28" rx="6" fill="${patch}"/>
  ${brailleCell(538, 418, [1, 2], 3, 8, dotFill)}
  ${brailleCell(556, 418, [1, 3, 5], 3, 8, dotFill)}
  <circle cx="547" cy="418" r="44" fill="none" stroke="#b9b6b0" stroke-width="2" stroke-dasharray="4 6"/>
  <text x="400" y="945" text-anchor="middle" font-family="Georgia, serif" font-size="22" letter-spacing="6" fill="#b9b6b0">HONEY PUNCH</text>
</svg>`;

writeFileSync(
  join(OUT, "braille-tee-black.svg"),
  teeWithPatch("black", "#242427", "#121214", "#39393d", "#8f8f95")
);
writeFileSync(
  join(OUT, "braille-tee-white.svg"),
  teeWithPatch("white", "#f2f0ea", "#d8d5cd", "#e6e3db", "#b5b1a6")
);

// ── 캠페인 히어로 (와이드) ─────────────────────────────────────
writeFileSync(
  join(PUB, "campaign-hero.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 1400">
  <defs>
    <linearGradient id="h" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="#f4ecdb"/>
      <stop offset="0.55" stop-color="#eadbb9"/>
      <stop offset="1" stop-color="#d9b96f"/>
    </linearGradient>
  </defs>
  <rect width="2400" height="1400" fill="url(#h)"/>
  <ellipse cx="1750" cy="420" rx="640" ry="460" fill="#f0b429" opacity="0.16"/>
  <ellipse cx="480" cy="1120" rx="520" ry="380" fill="#ffffff" opacity="0.22"/>
  ${brailleCell(2020, 1080, [1, 2], 26, 74, "#a8842e", "#c9ab6a")}
  ${brailleCell(2190, 1080, [1, 3, 5], 26, 74, "#a8842e", "#c9ab6a")}
</svg>`
);

// ── 소매 클로즈업 (풀폭) ──────────────────────────────────────
writeFileSync(
  join(PUB, "campaign-sleeve.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 1000">
  <defs>
    <linearGradient id="cloth" x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0" stop-color="#2a2a2e"/>
      <stop offset="1" stop-color="#161618"/>
    </linearGradient>
  </defs>
  <rect width="2400" height="1000" fill="url(#cloth)"/>
  <!-- 원단 결 -->
  <g stroke="#3a3a3f" stroke-width="2" opacity="0.5">
    <path d="M0,180 C700,140 1500,240 2400,190"/>
    <path d="M0,420 C800,380 1600,470 2400,430"/>
    <path d="M0,660 C700,620 1500,710 2400,670"/>
    <path d="M0,880 C800,840 1600,930 2400,890"/>
  </g>
  <!-- 소매 시접선 -->
  <path d="M1560,0 C1520,340 1530,700 1580,1000" stroke="#46464c" stroke-width="5" fill="none"/>
  <path d="M1600,0 C1560,340 1570,700 1620,1000" stroke="#46464c" stroke-width="3" fill="none" stroke-dasharray="12 10"/>
  <!-- 실리콘 패치 -->
  <rect x="1740" y="380" width="300" height="180" rx="28" fill="#3c3c42"/>
  <rect x="1740" y="380" width="300" height="180" rx="28" fill="none" stroke="#525158" stroke-width="3"/>
  ${brailleCell(1836, 470, [1, 2], 16, 46, "#9c9ca4")}
  ${brailleCell(1948, 470, [1, 3, 5], 16, 46, "#9c9ca4")}
</svg>`
);

// ── 패치 마크로 (세로) ────────────────────────────────────────
writeFileSync(
  join(PUB, "campaign-patch.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <defs>
    <radialGradient id="m" cx="0.4" cy="0.35" r="1">
      <stop offset="0" stop-color="#efece4"/>
      <stop offset="1" stop-color="#dcd8cc"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#m)"/>
  <g stroke="#d0ccc0" stroke-width="2" opacity="0.7">
    <path d="M0,220 C260,200 540,240 800,215"/>
    <path d="M0,520 C260,500 540,540 800,515"/>
    <path d="M0,820 C260,800 540,840 800,815"/>
  </g>
  <rect x="190" y="360" width="420" height="260" rx="36" fill="#e7e3d8"/>
  <rect x="190" y="360" width="420" height="260" rx="36" fill="none" stroke="#cfcabb" stroke-width="4"/>
  ${brailleCell(330, 490, [1, 2], 22, 64, "#b0aa98")}
  ${brailleCell(478, 490, [1, 3, 5], 22, 64, "#b0aa98")}
  <text x="400" y="945" text-anchor="middle" font-family="Georgia, serif" font-size="22" letter-spacing="6" fill="#b3ae9f">SILICONE BRAILLE PATCH</text>
</svg>`
);

// ── 친환경 원단 (세로) ────────────────────────────────────────
writeFileSync(
  join(PUB, "campaign-fabric.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="f" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e9e7dd"/>
      <stop offset="1" stop-color="#cfd2c0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#f)"/>
  <!-- 접힌 원단 더미 -->
  <g>
    <rect x="150" y="620" width="500" height="120" rx="18" fill="#8f9a7e"/>
    <rect x="170" y="500" width="460" height="120" rx="18" fill="#f2f0ea"/>
    <rect x="160" y="380" width="480" height="120" rx="18" fill="#242427"/>
    <rect x="180" y="260" width="440" height="120" rx="18" fill="#d9d7d2"/>
  </g>
  <!-- 잎 모티프 -->
  <path d="M620,180 C560,120 560,60 620,20 C680,60 680,120 620,180 Z" fill="#a3af8d" opacity="0.85"/>
  <path d="M620,175 L620,30" stroke="#8f9a7e" stroke-width="4"/>
</svg>`
);

console.log("generated campaign visuals: hero, sleeve, patch, fabric, braille-tee x2");
