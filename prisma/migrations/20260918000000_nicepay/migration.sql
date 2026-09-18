-- 나이스페이먼츠 결제 연동: 거래 식별자와 승인 정보 컬럼
ALTER TABLE "Order" ADD COLUMN "pgTid" TEXT;
ALTER TABLE "Order" ADD COLUMN "pgPayMethod" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "pgCardName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "pgCancelledTid" TEXT NOT NULL DEFAULT '';

CREATE UNIQUE INDEX "Order_pgTid_key" ON "Order"("pgTid");
