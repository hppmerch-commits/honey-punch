import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join, normalize, extname } from "node:path";
import { Readable } from "node:stream";
import { UPLOAD_DIR } from "@/lib/uploads";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

/** 볼륨에 저장된 업로드 이미지를 서빙한다. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  // 경로 탈출(../) 차단 — 반드시 UPLOAD_DIR 안이어야 한다.
  const target = normalize(join(UPLOAD_DIR, ...path));
  if (!target.startsWith(normalize(UPLOAD_DIR))) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const info = await stat(target);
    if (!info.isFile()) return new Response("Not found", { status: 404 });

    const stream = Readable.toWeb(
      createReadStream(target)
    ) as unknown as ReadableStream;

    return new Response(stream, {
      headers: {
        "Content-Type": MIME[extname(target).toLowerCase()] ?? "application/octet-stream",
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
