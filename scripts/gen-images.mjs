// 더미 상품 이미지(SVG) 생성 스크립트 — node scripts/gen-images.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "products");
mkdirSync(OUT, { recursive: true });

const SILHOUETTES = {
  windbreaker: (c, d) => `
    <path d="M400,180 C330,180 290,230 290,290 L250,320 C190,360 160,420 150,520 L150,680 C150,700 165,710 185,705 L250,682 L250,760 C250,790 270,800 300,800 L500,800 C530,800 550,790 550,760 L550,682 L615,705 C635,710 650,700 650,680 L650,520 C640,420 610,360 550,320 L510,290 C510,230 470,180 400,180 Z" fill="url(#g)"/>
    <ellipse cx="400" cy="258" rx="72" ry="58" fill="${d}"/>
    <rect x="397" y="318" width="5" height="470" rx="2" fill="${d}" opacity="0.55"/>
    <path d="M290,300 L250,330 M510,300 L550,330" stroke="${d}" stroke-width="3" opacity="0.4"/>`,
  tee: (c, d) => `
    <path d="M400,230 C360,230 335,242 325,255 L235,295 C205,310 195,335 205,360 L240,432 C247,447 265,454 280,447 L308,434 L308,750 C308,775 323,790 348,790 L452,790 C477,790 492,775 492,750 L492,434 L520,447 C535,454 553,447 560,432 L595,360 C605,335 595,310 565,295 L475,255 C465,242 440,230 400,230 Z" fill="url(#g)"/>
    <path d="M348,244 C362,268 438,268 452,244" stroke="${d}" stroke-width="6" fill="none" opacity="0.6"/>`,
  shorts: (c, d) => `
    <path d="M285,380 L515,380 C528,380 535,388 536,400 L556,660 C558,682 544,695 522,695 L448,695 C430,695 418,684 415,666 L400,510 L385,666 C382,684 370,695 352,695 L278,695 C256,695 242,682 244,660 L264,400 C265,388 272,380 285,380 Z" fill="url(#g)"/>
    <rect x="285" y="380" width="230" height="16" fill="${d}" opacity="0.45"/>
    <path d="M400,396 L400,470" stroke="${d}" stroke-width="3" opacity="0.4"/>`,
  bag: (c, d) => `
    <path d="M305,375 C305,352 495,352 495,375 L538,715 C543,757 517,780 476,780 L324,780 C283,780 257,757 262,715 Z" fill="url(#g)"/>
    <path d="M312,380 C300,300 340,260 400,260 C460,260 500,300 488,380" stroke="${d}" stroke-width="7" fill="none"/>
    <path d="M318,420 C330,412 470,412 482,420" stroke="${d}" stroke-width="4" opacity="0.5" fill="none"/>`,
  cap: (c, d) => `
    <path d="M268,540 C268,435 328,368 400,368 C472,368 532,435 532,540 L532,556 L268,556 Z" fill="url(#g)"/>
    <path d="M268,556 L532,556 C585,556 618,576 606,598 C560,622 330,624 262,586 C248,574 252,556 268,556 Z" fill="${d}"/>
    <path d="M400,368 L400,540" stroke="${d}" stroke-width="3" opacity="0.4"/>
    <path d="M330,395 C360,378 440,378 470,395" stroke="${d}" stroke-width="3" opacity="0.35" fill="none"/>`,
};

// [파일명, 실루엣, 메인컬러, 어두운 디테일컬러]
const IMAGES = [
  ["windbreaker-black", "windbreaker", "#26262a", "#141416"],
  ["windbreaker-grey", "windbreaker", "#d9d7d2", "#b4b1ab"],
  ["halfzip-charcoal", "windbreaker", "#4a4a4e", "#2e2e31"],
  ["top-ivory", "tee", "#efece4", "#cdc9be"],
  ["top-grey", "tee", "#c9c7c2", "#a6a49f"],
  ["top-black", "tee", "#2b2b2e", "#161618"],
  ["shorts-black", "shorts", "#2b2b2e", "#161618"],
  ["shorts-grey", "shorts", "#d5d3ce", "#b0ada7"],
  ["bag-grey", "bag", "#d9d7d2", "#a8a5a0"],
  ["bag-honey", "bag", "#f0b429", "#c98d0d"],
  ["cap-black", "cap", "#26262a", "#101012"],
  ["cap-cream", "cap", "#ece7db", "#c7c0af"],
];

const svg = (name, kind, color, dark) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${color}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <radialGradient id="bg" cx="0.5" cy="0.35" r="0.9">
      <stop offset="0" stop-color="#f7f6f4"/>
      <stop offset="1" stop-color="#edecea"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <ellipse cx="400" cy="830" rx="230" ry="26" fill="#000" opacity="0.05"/>
  ${SILHOUETTES[kind](color, dark)}
  <text x="400" y="945" text-anchor="middle" font-family="Georgia, serif" font-size="22" letter-spacing="6" fill="#b9b6b0">HONEY PUNCH</text>
</svg>`;

for (const [name, kind, color, dark] of IMAGES) {
  writeFileSync(join(OUT, `${name}.svg`), svg(name, kind, color, dark));
}

// 게이트웨이 캠페인 비주얼 2종
const campaign = (id, stops, accents) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 2000">
  <defs>
    <linearGradient id="c${id}" x1="0" y1="0" x2="0.6" y2="1">
      ${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}
    </linearGradient>
  </defs>
  <rect width="1600" height="2000" fill="url(#c${id})"/>
  ${accents}
</svg>`;

writeFileSync(
  join(process.cwd(), "public", "campaign-1.svg"),
  campaign(1, [["0", "#9aa08f"], ["0.55", "#6f7566"], ["1", "#3f4239"]],
    `<ellipse cx="1100" cy="420" rx="520" ry="360" fill="#c4c8b8" opacity="0.25"/>
     <rect x="0" y="1500" width="1600" height="500" fill="#2e3129" opacity="0.5"/>
     <ellipse cx="420" cy="1250" rx="340" ry="620" fill="#565b4d" opacity="0.45"/>`)
);
writeFileSync(
  join(process.cwd(), "public", "campaign-2.svg"),
  campaign(2, [["0", "#d8d5cf"], ["0.5", "#b8b4ac"], ["1", "#8e8a81"]],
    `<rect x="950" y="200" width="420" height="280" rx="24" fill="#7f9b6e" opacity="0.5"/>
     <rect x="1000" y="540" width="360" height="900" rx="12" fill="#a5a29a" opacity="0.6"/>
     <ellipse cx="1180" cy="1050" rx="260" ry="420" fill="#efece4" opacity="0.5"/>`)
);

console.log(`generated ${IMAGES.length} product images + 2 campaign visuals`);
