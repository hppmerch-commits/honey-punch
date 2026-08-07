import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomBytes } from "node:crypto";

/**
 * 업로드 이미지 저장 위치.
 * Railway에서는 볼륨이 /app/uploads에 마운트돼 재배포해도 파일이 남는다.
 * 로컬에서는 프로젝트 안의 .uploads 폴더를 쓴다.
 */
export const UPLOAD_DIR =
  process.env.RAILWAY_VOLUME_MOUNT_PATH ?? join(process.cwd(), ".uploads");

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
  ["image/svg+xml", ".svg"],
]);

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

/** 업로드된 파일을 저장하고, 화면에서 쓸 경로(/uploads/xxx)를 돌려준다. */
export async function saveUpload(file: File): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error("이미지 용량은 8MB를 넘을 수 없습니다.");
  }
  const ext = ALLOWED.get(file.type) ?? extname(file.name).toLowerCase();
  if (!ALLOWED.has(file.type)) {
    throw new Error(
      `지원하지 않는 이미지 형식입니다 (${file.type || "알 수 없음"}). JPG, PNG, WEBP, AVIF, SVG만 가능합니다.`
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}
