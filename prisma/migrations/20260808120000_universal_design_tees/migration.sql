-- 실측 사이즈표 컬럼 추가
ALTER TABLE "Product" ADD COLUMN "sizeChart" JSONB NOT NULL DEFAULT '[]';

-- 판매 품목을 유니버셜디자인 티셔츠 2종으로 정리한다.
DELETE FROM "Product"
WHERE "slug" NOT IN ('braille-patch-tee-black', 'braille-patch-tee-white');

UPDATE "Product"
SET
  "slug" = 'universal-design-tee-black',
  "name" = '허니펀치 유니버셜디자인 티셔츠 블랙',
  "sizes" = ARRAY['M', 'L', 'XL'],
  "colors" = '[{"name":"블랙","hex":"#242427"},{"name":"화이트","hex":"#f2f0ea"}]'::jsonb,
  "sizeChart" = '[
    {"label":"어깨","values":["47","49","50"]},
    {"label":"가슴","values":["55","57","59"]},
    {"label":"밑단","values":["55","57","59"]},
    {"label":"총장","values":["67","71","72"]},
    {"label":"암홀","values":["25","26","27"]},
    {"label":"팔길이","values":["23","24","24"]}
  ]'::jsonb,
  "sortOrder" = 0
WHERE "slug" = 'braille-patch-tee-black';

UPDATE "Product"
SET
  "slug" = 'universal-design-tee-white',
  "name" = '허니펀치 유니버셜디자인 티셔츠 화이트',
  "sizes" = ARRAY['M', 'L', 'XL'],
  "colors" = '[{"name":"블랙","hex":"#242427"},{"name":"화이트","hex":"#f2f0ea"}]'::jsonb,
  "sizeChart" = '[
    {"label":"어깨","values":["47","49","50"]},
    {"label":"가슴","values":["55","57","59"]},
    {"label":"밑단","values":["55","57","59"]},
    {"label":"총장","values":["67","71","72"]},
    {"label":"암홀","values":["25","26","27"]},
    {"label":"팔길이","values":["23","24","24"]}
  ]'::jsonb,
  "sortOrder" = 1
WHERE "slug" = 'braille-patch-tee-white';
