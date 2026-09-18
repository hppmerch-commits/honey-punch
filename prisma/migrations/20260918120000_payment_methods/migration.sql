-- 결제수단 확장: 계좌이체·가상계좌·휴대폰 결제 추가
-- paymentMethod 값에 BANK / VBANK / CELLPHONE 이 더해진다 (문자열 컬럼이라 스키마 변경 없음).

-- 계좌이체 은행명 (카드의 pgCardName에 대응)
ALTER TABLE "Order" ADD COLUMN "pgBankName" TEXT NOT NULL DEFAULT '';

-- 가상계좌 발급 정보 — 입금 전까지 고객에게 보여줄 계좌
ALTER TABLE "Order" ADD COLUMN "pgVbankName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "pgVbankNumber" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "pgVbankHolder" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "pgVbankExpAt" TIMESTAMP(3);
