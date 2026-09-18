// 나이스페이먼츠 은행코드 — 현금성 결제(가상계좌·계좌이체) 환불계좌 입력에 쓴다.
// 출처: nicepay-manual/common/code.md 은행코드 표. 클라이언트/서버 공용.

export const BANKS = [
  { code: "088", name: "신한은행" },
  { code: "004", name: "국민은행" },
  { code: "020", name: "우리은행" },
  { code: "081", name: "하나은행" },
  { code: "003", name: "기업은행" },
  { code: "011", name: "농협은행" },
  { code: "090", name: "카카오뱅크" },
  { code: "089", name: "케이뱅크" },
  { code: "071", name: "우체국" },
  { code: "007", name: "수협은행" },
  { code: "045", name: "새마을금고" },
  { code: "048", name: "신협" },
  { code: "050", name: "상호저축은행" },
  { code: "031", name: "대구은행" },
  { code: "032", name: "부산은행" },
  { code: "034", name: "광주은행" },
  { code: "035", name: "제주은행" },
  { code: "037", name: "전북은행" },
  { code: "039", name: "경남은행" },
  { code: "023", name: "SC제일은행" },
  { code: "027", name: "한국씨티은행" },
] as const;

export const isBankCode = (c: string) => BANKS.some((b) => b.code === c);

export const bankName = (c: string) => BANKS.find((b) => b.code === c)?.name ?? c;
