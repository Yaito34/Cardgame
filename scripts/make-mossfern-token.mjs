import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "CardPictures", "Mossfern-cutout.jpg");
const OUT = path.join(ROOT, "CardPictures", "Mossfern-token.png");

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({
  resolveWithObject: true
});
const w = info.width;
const h = info.height;

let minX = w;
let minY = h;
let maxX = 0;
let maxY = 0;
const cut = new Uint8Array(data.length);

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const lum = r + g + b;
  let a;
  if (lum < 22) a = 0;
  else if (lum < 70) a = Math.round((255 * (lum - 22)) / 48);
  else a = 255;
  cut[i] = r;
  cut[i + 1] = g;
  cut[i + 2] = b;
  cut[i + 3] = a;
  if (a > 40) {
    const p = i / 4;
    const x = p % w;
    const y = Math.floor(p / w);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

// Head is the right-hand silhouette top (hair), not the book spine.
let headY = h;
for (let y = minY; y < minY + Math.floor((maxY - minY) * 0.28); y++) {
  for (let x = Math.floor(w * 0.52); x < w; x++) {
    if (cut[(y * w + x) * 4 + 3] > 40 && y < headY) headY = y;
  }
}

let bodyX = 0;
let bodyN = 0;
const bodyCutX = minX + (maxX - minX) * 0.38;
for (let y = minY; y <= maxY; y++) {
  for (let x = Math.floor(bodyCutX); x <= maxX; x++) {
    if (cut[(y * w + x) * 4 + 3] > 40) {
      bodyX += x;
      bodyN++;
    }
  }
}

const feetY = maxY;
const bodyCX = bodyN ? bodyX / bodyN : (minX + maxX) / 2;
const bodyH = feetY - headY;
// Chest/lantern centre so the circle sits high and its bottom lands at the feet.
const cyFig = headY + Math.round(bodyH * 0.34);
const fadeR = (feetY - cyFig) * 1.08;
const sigmaCore = fadeR * 0.40;
const sigmaWash = fadeR * 0.82;
const twoCore = 2 * sigmaCore * sigmaCore;
const twoWash = 2 * sigmaWash * sigmaWash;
const peak = 168;

const oy = Math.max(8, Math.ceil(fadeR - cyFig + 12));
const outW = Math.max(w, Math.ceil(2 * fadeR + 32));
const outH = Math.max(h + oy, Math.ceil(cyFig + oy + fadeR + 16));
const ox = Math.round((outW - w) / 2);
const cx = bodyCX + ox;
const cy = cyFig + oy;

const halo = Buffer.alloc(outW * outH * 4);
for (let y = 0; y < outH; y++) {
  for (let x = 0; x < outW; x++) {
    const dx = x - cx;
    const dy = y - cy;
    const r2 = dx * dx + dy * dy;
    const r = Math.sqrt(r2);
    if (r >= fadeR) continue;
    const core = 155 * Math.exp(-r2 / twoCore);
    const wash = 88 * Math.exp(-r2 / twoWash);
    let edge = 1;
    const edgeStart = fadeR * 0.68;
    if (r >= edgeStart) {
      const t = (r - edgeStart) / (fadeR - edgeStart);
      const s = t * t * (3 - 2 * t);
      edge = 1 - s;
    }
    const fade = Math.min(1, (core + wash) / peak) * edge;
    const i = (y * outW + x) * 4;
    halo[i] = 255;
    halo[i + 1] = 246;
    halo[i + 2] = 214;
    halo[i + 3] = Math.round(peak * fade);
  }
}

const figure = await sharp(Buffer.from(cut), {
  raw: { width: w, height: h, channels: 4 }
})
  .png()
  .toBuffer();

const haloPng = await sharp(halo, {
  raw: { width: outW, height: outH, channels: 4 }
})
  .png()
  .toBuffer();

await mkdir(path.dirname(OUT), { recursive: true });
await sharp({
  create: {
    width: outW,
    height: outH,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
})
  .composite([
    { input: haloPng, blend: "over" },
    { input: figure, left: ox, top: oy, blend: "over" }
  ])
  .png()
  .toFile(OUT);

console.log(
  JSON.stringify(
    {
      out: OUT,
      outW,
      outH,
      ox,
      oy,
      headY,
      feetY,
      cyFig,
      fadeR,
      cx,
      cy,
      peak
    },
    null,
    2
  )
);
