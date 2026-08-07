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
  description: string[];
  stock?: number;
  soldOut?: boolean;
  campaignStory?: boolean;
};

export const seedProducts: SeedProduct[] = [
  {
    slug: "braille-patch-tee-black",
    name: "BRAILLE PATCH TEE IN BLACK",
    sku: "HP2609TS501UBB",
    price: 58000,
    category: "top",
    image: "/products/braille-tee-black.png",
    colors: [
      { name: "BLACK", hex: "#242427" },
      { name: "WHITE", hex: "#f2f0ea" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description: [
      "왼쪽 소매 끝, 손끝으로 색을 읽는 실리콘 점자 패치 티셔츠",
      "식물성 친환경 원단 / 판매 수익의 일부는 시각장애인 단체에 기부됩니다",
    ],
    stock: 50,
    campaignStory: true,
  },
  {
    slug: "braille-patch-tee-white",
    name: "BRAILLE PATCH TEE IN WHITE",
    sku: "HP2609TS501UWH",
    price: 58000,
    category: "top",
    image: "/products/braille-tee-white.png",
    colors: [
      { name: "BLACK", hex: "#242427" },
      { name: "WHITE", hex: "#f2f0ea" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description: [
      "왼쪽 소매 끝, 손끝으로 색을 읽는 실리콘 점자 패치 티셔츠",
      "식물성 친환경 원단 / 판매 수익의 일부는 시각장애인 단체에 기부됩니다",
    ],
    stock: 50,
    campaignStory: true,
  },
  {
    slug: "honey-glow-windbreaker-black",
    name: "HONEY GLOW REFLECTIVE WINDBREAKER IN BLACK",
    sku: "HP2601JP101UBB",
    price: 160200,
    originalPrice: 178000,
    category: "outer",
    image: "/products/windbreaker-black.svg",
    colors: [
      { name: "BLACK", hex: "#26262a" },
      { name: "LIGHT GREY", hex: "#d9d7d2" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description: [
      "자연스러운 그라데이션 패턴의 초경량 윈드브레이커",
      "허니 로고와 후드, 등판 리플렉티브 프린트가 포인트",
    ],
    stock: 20,
  },
  {
    slug: "honey-glow-windbreaker-grey",
    name: "HONEY GLOW REFLECTIVE WINDBREAKER IN LIGHT GREY",
    sku: "HP2601JP101UBG",
    price: 160200,
    originalPrice: 178000,
    category: "outer",
    image: "/products/windbreaker-grey.svg",
    colors: [
      { name: "BLACK", hex: "#26262a" },
      { name: "LIGHT GREY", hex: "#d9d7d2" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description: [
      "자연스러운 그라데이션 패턴의 초경량 윈드브레이커",
      "허니 로고와 후드, 등판 리플렉티브 프린트가 포인트",
    ],
    stock: 20,
  },
  {
    slug: "punch-logo-half-zip-charcoal",
    name: "PUNCH LOGO HALF ZIP TOP IN CHARCOAL",
    sku: "HP2602TS201UCH",
    price: 142200,
    originalPrice: 158000,
    category: "top",
    image: "/products/halfzip-charcoal.svg",
    colors: [{ name: "CHARCOAL", hex: "#4a4a4e" }],
    sizes: ["S", "M", "L"],
    description: ["탄탄한 조직감의 하프집 스웻 톱", "가슴 펀치 로고 자수 디테일"],
    stock: 15,
  },
  {
    slug: "honey-graffiti-top-ivory",
    name: "HONEY GRAFFITI COVERED TOP IN IVORY",
    sku: "HP2603TS301UIV",
    price: 97200,
    originalPrice: 108000,
    category: "top",
    image: "/products/top-ivory.svg",
    colors: [
      { name: "IVORY", hex: "#efece4" },
      { name: "GREY", hex: "#c9c7c2" },
    ],
    sizes: ["S", "M", "L"],
    description: ["전판 그래피티 프린트의 오버핏 반팔 톱", "두께감 있는 코튼 저지 소재"],
    stock: 30,
  },
  {
    slug: "honey-graffiti-top-grey",
    name: "HONEY GRAFFITI COVERED TOP IN GREY",
    sku: "HP2603TS301UGR",
    price: 97200,
    originalPrice: 108000,
    category: "top",
    image: "/products/top-grey.svg",
    colors: [
      { name: "IVORY", hex: "#efece4" },
      { name: "GREY", hex: "#c9c7c2" },
    ],
    sizes: ["S", "M", "L"],
    description: ["전판 그래피티 프린트의 오버핏 반팔 톱", "두께감 있는 코튼 저지 소재"],
    stock: 30,
  },
  {
    slug: "punch-vortex-top-black",
    name: "PUNCH VORTEX GRAFFITI TOP IN BLACK",
    sku: "HP2604TS401UBB",
    price: 70200,
    originalPrice: 78000,
    category: "top",
    image: "/products/top-black.svg",
    colors: [{ name: "BLACK", hex: "#2b2b2e" }],
    sizes: ["S", "M", "L"],
    description: ["볼텍스 그래피티 아트웍의 세미 오버핏 톱", "부드러운 터치의 수피마 코튼"],
    stock: 25,
  },
  {
    slug: "honey-motion-shorts-black",
    name: "HONEY MOTION SHORTS IN BLACK",
    sku: "HP2605PT101UBB",
    price: 106200,
    originalPrice: 118000,
    category: "bottom",
    image: "/products/shorts-black.svg",
    colors: [
      { name: "BLACK", hex: "#2b2b2e" },
      { name: "LIGHT GREY", hex: "#d5d3ce" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description: ["경량 나일론 소재의 모션 쇼츠", "이너 팬츠 일체형, 사이드 지퍼 포켓"],
    stock: 18,
  },
  {
    slug: "honey-motion-shorts-grey",
    name: "HONEY MOTION SHORTS IN LIGHT GREY",
    sku: "HP2605PT101UBG",
    price: 106200,
    originalPrice: 118000,
    category: "bottom",
    image: "/products/shorts-grey.svg",
    colors: [
      { name: "BLACK", hex: "#2b2b2e" },
      { name: "LIGHT GREY", hex: "#d5d3ce" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description: ["경량 나일론 소재의 모션 쇼츠", "이너 팬츠 일체형, 사이드 지퍼 포켓"],
    stock: 18,
  },
  {
    slug: "honey-string-bag-grey",
    name: "HONEY STRING BAG IN LIGHT GREY",
    sku: "HP2606BG101UGR",
    price: 79200,
    originalPrice: 88000,
    category: "acc",
    image: "/products/bag-grey.svg",
    colors: [{ name: "LIGHT GREY", hex: "#d9d7d2" }],
    sizes: ["FREE"],
    description: ["타이다이 패턴의 스트링 백", "가벼운 립스탑 나일론 소재"],
    stock: 12,
  },
  {
    slug: "punch-pocket-bag-honey",
    name: "PUNCH PACKABLE POCKET BAG IN HONEY",
    sku: "HP2607BG201UHY",
    price: 52200,
    originalPrice: 58000,
    category: "acc",
    image: "/products/bag-honey.svg",
    colors: [{ name: "HONEY", hex: "#f0b429" }],
    sizes: ["FREE"],
    description: ["시그니처 허니 컬러의 패커블 백", "포켓 사이즈로 접어 휴대 가능"],
    stock: 12,
  },
  {
    slug: "honey-bold-cap-black",
    name: "HONEY BOLD BALL CAP IN BLACK",
    sku: "HP2608AC101UBB",
    price: 58000,
    category: "acc",
    image: "/products/cap-black.svg",
    colors: [
      { name: "BLACK", hex: "#26262a" },
      { name: "CREAM", hex: "#ece7db" },
    ],
    sizes: ["FREE"],
    description: ["볼드 로고 자수의 6패널 볼캡", "워싱 코튼 트윌 소재"],
    stock: 0,
    soldOut: true,
  },
  {
    slug: "honey-bold-cap-cream",
    name: "HONEY BOLD BALL CAP IN CREAM",
    sku: "HP2608AC101UCR",
    price: 58000,
    category: "acc",
    image: "/products/cap-cream.svg",
    colors: [
      { name: "BLACK", hex: "#26262a" },
      { name: "CREAM", hex: "#ece7db" },
    ],
    sizes: ["FREE"],
    description: ["볼드 로고 자수의 6패널 볼캡", "워싱 코튼 트윌 소재"],
    stock: 10,
  },
];
