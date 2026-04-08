import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const CARDS_JSON = path.join(ROOT, "cards.json");
const OUT_DIR = path.join(ROOT, "dist", "tts");
const OUT_OBJECTS = path.join(OUT_DIR, "objects");
const OUT_IMAGES = path.join(OUT_DIR, "images");
const TEMPLATE_IMG = path.join(ROOT, "Cardtemplate.png");
/** Per-card pixel size on the spritesheet. Higher = sharper in TTS (larger PNG files). */
const CARD_W = 880;
const CARD_H = 630;
const SHEET_COLS = 10;
/** Layout was authored at this reference size; overlay scales with CARD_W/H. */
const LAYOUT_REF_W = 440;
const LAYOUT_REF_H = 315;

function normalizeBaseUrl(u) {
  return String(u || "").trim().replace(/\/+$/, "");
}

function assetUrl(base, relativePath) {
  const b = normalizeBaseUrl(base);
  const rel = String(relativePath)
    .replace(/^\/+/, "")
    .replace(/\\/g, "/");
  return `${b}/${rel}`;
}

const BASE_URL = normalizeBaseUrl(process.env.TTS_ASSET_BASE_URL || "https://example.invalid/tts");

function slug(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cardDescription(card) {
  const lines = [];
  if (card.fieldEffect) lines.push(`Effect: ${card.fieldEffect}`);
  if (Array.isArray(card.approaches)) {
    for (const a of card.approaches) {
      const cond = a.condition ? ` (${a.condition})` : "";
      lines.push(`${a.type} ${a.difficulty}${cond}: ${a.outcomes || ""}`);
      if (a.subEffect) lines.push(`  ${a.subEffect}`);
    }
  }
  if (Array.isArray(card.uses)) {
    for (const u of card.uses) {
      const fx = Array.isArray(u.effects) && u.effects.length ? ` · ${u.effects.join(", ")}` : "";
      const act = u.activation ? `${u.activation} · ` : "";
      lines.push(`${act}${u.approach} ${u.power}${fx}`);
    }
  }
  return lines.join("\n");
}

function xmlEsc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function wrapLines(lines, maxChars) {
  const out = [];
  for (const line of lines) {
    const words = String(line).split(/\s+/).filter(Boolean);
    if (!words.length) {
      out.push("");
      continue;
    }
    let cur = words[0];
    for (let i = 1; i < words.length; i++) {
      const w = words[i];
      if ((cur + " " + w).length > maxChars) {
        out.push(cur);
        cur = w;
      } else cur += " " + w;
    }
    out.push(cur);
  }
  return out;
}

function cardTextLines(card) {
  const lines = [];
  if (card.fieldEffect) lines.push(card.fieldEffect);
  lines.push("");
  if (Array.isArray(card.approaches)) {
    for (const a of card.approaches) {
      const cond = a.condition ? ` (${a.condition})` : "";
      lines.push(`${a.type} ${a.difficulty}${cond}: ${a.outcomes || ""}`);
      if (a.subEffect) lines.push(`· ${a.subEffect}`);
    }
  } else if (Array.isArray(card.uses)) {
    for (const u of card.uses) {
      const fx = Array.isArray(u.effects) && u.effects.length ? ` · ${u.effects.join(", ")}` : "";
      const act = u.activation ? `${u.activation} · ` : "";
      lines.push(`${act}${u.approach} ${u.power}${fx}`);
    }
  }
  return wrapLines(lines, 54).slice(0, 12);
}

function overlaySvg(card) {
  const x = n => Math.round((n * CARD_W) / LAYOUT_REF_W);
  const y = n => Math.round((n * CARD_H) / LAYOUT_REF_H);
  const title = xmlEsc(card.name);
  const bodyLines = cardTextLines(card)
    .map((l, i) => {
      const lineY = y(120) + i * y(15);
      return `<text x="${x(32)}" y="${lineY}" font-size="${x(14)}" fill="#1a0d04">${xmlEsc(l)}</text>`;
    })
    .join("");
  const bannerFill = card.type === "tool" ? "rgba(2,52,160,0.5)" : "rgba(157,1,1,0.5)";
  return `
<svg width="${CARD_W}" height="${CARD_H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="${x(8)}" y="${y(13)}" width="${x(424)}" height="${y(62)}" rx="${x(4)}" fill="${bannerFill}" />
  <text x="${CARD_W / 2}" y="${y(51)}" text-anchor="middle" font-size="${x(28)}" font-weight="700" fill="#fff8e8">${title}</text>
  ${bodyLines}
</svg>`;
}

async function renderCardImage(card) {
  const base = sharp(TEMPLATE_IMG).resize(CARD_W, CARD_H);
  const svg = Buffer.from(overlaySvg(card));
  return base.composite([{ input: svg }]).png().toBuffer();
}

async function makeSpriteSheet(deck) {
  const n = deck.cards.length;
  const rows = Math.max(1, Math.ceil(n / SHEET_COLS));
  const canvas = sharp({
    create: {
      width: CARD_W * SHEET_COLS,
      height: CARD_H * rows,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });
  const composites = [];
  for (let i = 0; i < n; i++) {
    const card = deck.cards[i];
    const input = await renderCardImage(card);
    const col = i % SHEET_COLS;
    const row = Math.floor(i / SHEET_COLS);
    composites.push({ input, left: col * CARD_W, top: row * CARD_H });
  }
  return canvas.composite(composites).png();
}

async function ensureBackImage() {
  const out = path.join(OUT_IMAGES, "common-back.png");
  const t = Math.max(2, Math.round((3 * CARD_W) / LAYOUT_REF_W));
  const inset = Math.round((10 * CARD_W) / LAYOUT_REF_W);
  const labelFs = Math.round((34 * CARD_W) / LAYOUT_REF_W);
  const svg = Buffer.from(`
<svg width="${CARD_W}" height="${CARD_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CARD_W}" height="${CARD_H}" fill="#2b2018" />
  <rect x="${inset}" y="${inset}" width="${CARD_W - 2 * inset}" height="${CARD_H - 2 * inset}" fill="none" stroke="#b58a46" stroke-width="${t}" />
  <text x="${CARD_W / 2}" y="${CARD_H / 2}" text-anchor="middle" font-size="${labelFs}" fill="#e8d39f">RUINED WOLD</text>
</svg>`);
  await sharp(svg).png().toFile(out);
  return "images/common-back.png";
}

function makeDeckObject(deck, deckNumber, faceURL, backURL, rows) {
  const contained = deck.cards.map((card, i) => {
    const cardID = deckNumber * 100 + (i + 1);
    return {
      Name: "Card",
      Nickname: card.name,
      Description: cardDescription(card),
      CardID: cardID,
      CustomDeck: {
        [deckNumber]: {
          FaceURL: faceURL,
          BackURL: backURL,
          NumWidth: SHEET_COLS,
          NumHeight: rows,
          BackIsHidden: true,
          UniqueBack: false,
          Type: 0
        }
      }
    };
  });

  return {
    Name: "DeckCustom",
    Nickname: deck.name,
    Description: `Generated from cards.json deck id: ${deck.id}`,
    Transform: {
      posX: 0,
      posY: 1,
      posZ: 0,
      rotX: 0,
      rotY: 180,
      rotZ: 180,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1
    },
    DeckIDs: contained.map(c => c.CardID),
    CustomDeck: {
      [deckNumber]: {
        FaceURL: faceURL,
        BackURL: backURL,
        NumWidth: SHEET_COLS,
        NumHeight: rows,
        BackIsHidden: true,
        UniqueBack: false,
        Type: 0
      }
    },
    ContainedObjects: contained
  };
}

async function main() {
  const raw = await readFile(CARDS_JSON, "utf8");
  const data = JSON.parse(raw);
  if (!data || !Array.isArray(data.decks)) {
    throw new Error("cards.json: expected { decks: [] }");
  }

  await mkdir(OUT_OBJECTS, { recursive: true });
  await mkdir(OUT_IMAGES, { recursive: true });
  const backRel = await ensureBackImage();
  const backURL = assetUrl(BASE_URL, backRel);

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: "cards.json",
    cardRenderPixels: { width: CARD_W, height: CARD_H },
    notes: [
      "Generated object JSON + local spritesheets.",
      "Set TTS_ASSET_BASE_URL to hosted image base URL before final import."
    ],
    decks: []
  };

  let deckNumber = 1;
  for (const deck of data.decks) {
    if (!Array.isArray(deck.cards) || deck.cards.length === 0) continue;
    const rows = Math.max(1, Math.ceil(deck.cards.length / SHEET_COLS));
    const imageFile = `${slug(deck.id || deck.name || `deck-${deckNumber}`)}-fronts.png`;
    const imageRel = `images/${imageFile}`;
    const imagePath = path.join(OUT_IMAGES, imageFile);
    const sheet = await makeSpriteSheet(deck);
    await sheet.toFile(imagePath);
    const faceURL = assetUrl(BASE_URL, imageRel);
    const obj = makeDeckObject(deck, deckNumber, faceURL, backURL, rows);
    const fileName = `${slug(deck.id || deck.name || `deck-${deckNumber}`)}.json`;
    const outPath = path.join(OUT_OBJECTS, fileName);
    await writeFile(outPath, JSON.stringify(obj, null, 2), "utf8");

    manifest.decks.push({
      id: deck.id,
      name: deck.name,
      type: deck.type,
      cardCount: deck.cards.length,
      objectFile: `objects/${fileName}`,
      imageFile: imageRel,
      faceURL,
      backURL,
      rows,
      cols: SHEET_COLS
    });
    deckNumber += 1;
  }

  await writeFile(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(`TTS pipeline output written to: ${path.relative(ROOT, OUT_DIR)}`);
  console.log(`Asset base URL: ${BASE_URL}`);
  console.log("Generated deck object files + images:");
  for (const d of manifest.decks) {
    console.log(`- ${d.objectFile} (${d.cardCount} cards), ${d.imageFile}`);
  }
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
