/**
 * 최초 배포 시 DB가 비어 있으면 넣을 기본 상품.
 * instrumentation.ts에서 한 번만 실행되며, 이후에는 관리자 페이지로 관리한다.
 */
export type SeedProduct = {
  slug: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  sizeChart: { label: string; values: string[] }[];
  description: string[];
  stock?: number;
  soldOut?: boolean;
  campaignStory?: boolean;
};

const COLORS = [
  { name: "블랙", hex: "#242427" },
  { name: "화이트", hex: "#f2f0ea" },
];

const SIZES = ["M", "L", "XL"];

/** 실측 치수(cm). 열 순서는 SIZES와 같다. */
const SIZE_CHART = [
  { label: "어깨", values: ["47", "49", "50"] },
  { label: "가슴", values: ["55", "57", "59"] },
  { label: "밑단", values: ["55", "57", "59"] },
  { label: "총장", values: ["67", "71", "72"] },
  { label: "암홀", values: ["25", "26", "27"] },
  { label: "팔길이", values: ["23", "24", "24"] },
];

const DESCRIPTION = [
  "왼쪽 소매 끝, 손끝으로 색을 읽는 실리콘 점자 패치 티셔츠",
  "식물성 친환경 원단 / 판매 수익의 일부는 시각장애인 단체에 기부됩니다",
];

export const seedProducts: SeedProduct[] = [
  {
    slug: "universal-design-tee-black",
    name: "허니펀치 유니버셜디자인 티셔츠 블랙",
    sku: "HP2609TS501UBB",
    price: 45000,
    originalPrice: 58000,
    category: "top",
    image: "/products/braille-tee-black.png",
    colors: COLORS,
    sizes: SIZES,
    sizeChart: SIZE_CHART,
    description: DESCRIPTION,
    stock: 50,
    campaignStory: true,
  },
  {
    slug: "universal-design-tee-white",
    name: "허니펀치 유니버셜디자인 티셔츠 화이트",
    sku: "HP2609TS501UWH",
    price: 45000,
    originalPrice: 58000,
    category: "top",
    image: "/products/braille-tee-white.png",
    colors: COLORS,
    sizes: SIZES,
    sizeChart: SIZE_CHART,
    description: DESCRIPTION,
    stock: 50,
    campaignStory: true,
  },
];
