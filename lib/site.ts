// 사업자 정보 — 푸터, 이용약관, 개인정보처리방침에서 공통으로 참조
export const business = {
  /** 상호 (사업자등록증 기준) */
  name: "허니펀치",
  /** 대표자 — 개인사업자이므로 '대표이사'가 아닌 '대표자' */
  ceo: "양동준",
  registrationNumber: "370-13-02305",
  address: "광주광역시 동구 동계천로 151, 4층(동명동)",
  privacyOfficer: "양동준",

  // 아래 항목은 확정 후 채우면 자동으로 푸터에 노출됩니다. 빈 값이면 렌더링되지 않습니다.
  /** 통신판매업 신고번호 — 신고 완료 후 입력 (예: "2026-광주동구-0000") */
  mailOrderNumber: "",
  /** 고객센터 대표전화 */
  phone: "",
  /** 비즈니스 문의 이메일 */
  email: "",
} as const;

// 배송 정책 — 장바구니·체크아웃·주문 생성에서 공통으로 참조
export const shipping = {
  /**
   * 이 금액 이상이면 무료배송 (원).
   * 지금은 9월까지 무료배송 이벤트 중이라 0 (전 주문 무료).
   * 이벤트 종료 시 70000으로 되돌리면 "7만원 이상 무료"로 복귀.
   */
  freeFrom: 0,
  /** 기본 배송비 (원) */
  fee: 3000,
} as const;

/**
 * 무통장입금 계좌 — 채우면 주문 완료 페이지와 관리자 상세에 노출됩니다.
 * 빈 값이면 "주문 확인 연락 시 안내" 문구로 대체됩니다.
 * 예: bank: "카카오뱅크", account: "3333-00-0000000", holder: "양동준(허니펀치)"
 */
export const bankTransfer = {
  bank: "기업은행",
  account: "298-109704-01-011",
  holder: "양동준(허니펀치)",
} as const;

export const hasBankInfo = () =>
  Boolean(bankTransfer.bank && bankTransfer.account);
