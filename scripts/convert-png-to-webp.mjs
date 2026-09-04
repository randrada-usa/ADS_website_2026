import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { join, basename } from "node:path";

const SRC = join(import.meta.dirname, "..", "assets", "departmental_logos_png");
const OUT = join(import.meta.dirname, "..", "public", "brand");
const CANVAS = 400;
const PAD_PERCENT = 15;

const SLUG_MAP = {
  Communications: "communications",
  FInance: "finance",
  Legal: "legal",
  Operations: "operations",
  Technology: "technology",
};

const files = (await readdir(SRC)).filter(
  (f) => f.endsWith(".png") && !f.includes("_Tilted"),
);

if (!files.length) {
  console.error("No department PNG files found in", SRC);
  process.exit(1);
}

for (const file of files) {
  const name = basename(file, ".png");
  const slug = SLUG_MAP[name];
  if (!slug) {
    console.warn(`Skipping unknown file: ${file}`);
    continue;
  }

  const srcPath = join(SRC, file);
  const { width: srcW, height: srcH } = await sharp(srcPath).metadata();

  const maxSize = Math.round(CANVAS * (1 - PAD_PERCENT / 100));
  const trimmed = await sharp(srcPath).trim().toBuffer();
  const { width: tw, height: th } = await sharp(trimmed).metadata();
  const scale = Math.min(maxSize / tw, maxSize / th);
  const fitW = Math.round(tw * scale);
  const fitH = Math.round(th * scale);

  const outPath = join(OUT, `${slug}.webp`);
  const resized = await sharp(trimmed)
    .resize(fitW, fitH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: Math.round((maxSize - fitH) / 2),
      bottom: maxSize - fitH - Math.round((maxSize - fitH) / 2),
      left: Math.round((maxSize - fitW) / 2),
      right: maxSize - fitW - Math.round((maxSize - fitW) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{
      input: resized,
      gravity: "centre",
    }])
    .webp({ quality: 90 })
    .toFile(outPath);
  console.log(`${file} → ${slug}.webp (${tw}×${th} trimmed → ${fitW}×${fitH} fit → ${maxSize}×${maxSize} square → ${CANVAS}×${CANVAS})`);
}

console.log(`\nConverted ${files.length} logos to WebP in ${OUT}`);
