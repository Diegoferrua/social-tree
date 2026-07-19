import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "No disponible en producción" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Falta el archivo" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return Response.json({ error: "Formato no soportado (usá jpg, png o webp)" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "La imagen pesa más de 5MB" }, { status: 400 });
  }

  const publicDir = path.join(process.cwd(), "public");
  const existing = await fs.readdir(publicDir);
  await Promise.all(
    existing
      .filter((name) => name.startsWith("avatar."))
      .map((name) => fs.unlink(path.join(publicDir, name)))
  );

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(publicDir, `avatar.${ext}`), buffer);

  return Response.json({ avatarUrl: `/avatar.${ext}` });
}
