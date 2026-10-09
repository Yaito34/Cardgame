#!/usr/bin/env node
/**
 * Copy html2canvas exports from TTS PNGS/ → docs/tts/images/ using the SAME basenames
 * as in TTS PNGS where possible (zone: tts-sheet-01.png …). Intro uses intro-tts-sheet-01.png
 * in docs because the exporter always writes tts-sheet-01.png and would overwrite zone.
 *
 * --mirror-all: copy every *.png from TTS PNGS/ → docs/tts/images/ (same names), remove
 * any other .png in docs/tts/images/ except common-back.png and intro-tts-sheet-01.png
 * (so file count/names match TTS PNGS + those keeps), then refresh JSON FaceURLs.
 *
 * Usage:
 *   node scripts/publish-tts-from-viewer-export.mjs --deck=zone-deck-1
 *   node scripts/publish-tts-from-viewer-export.mjs --deck=intro-tools
 *   node scripts/publish-tts-from-viewer-export.mjs --mirror-all
 *   npm run sync:tts-images
 *   node scripts/publish-tts-from-viewer-export.mjs --migrate-legacy
 *
 * Workflow: serve-cards → export → sync:tts-images or --deck=… → git push docs/tts.
 */
import { copyFile, mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(path.join(__dirname, ".."));
const TTS_PNGS = path.join(ROOT, "TTS PNGS");
const DOCS_TTS = path.join(ROOT, "docs", "tts");
const DOCS_IMAGES = path.join(DOCS_TTS, "images");
const DOCS_OBJECTS = path.join(DOCS_TTS, "objects");
const MANIFEST_PATH = path.join(DOCS_TTS, "manifest.json");

const VALID_DECKS = new Set(["zone-deck-1", "intro-tools"]);

const INTRO_DOC_BASENAME = "intro-tts-sheet-01.png";

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  if (!hit) return fallback;
  return hit.slice(prefix.length);
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function normalizeBaseUrl(u) {
  return String(u || "")
    .trim()
    .replace(/\/+$/, "");
}

function sheetIndexFromFilename(name) {
  const m = /^tts-sheet-(\d+)\.png$/i.exec(String(name));
  if (!m) return null;
  return parseInt(m[1], 10);
}

function zoneSheetBasename(k) {
  return "tts-sheet-" + (k < 10 ? "0" + k : String(k)) + ".png";
}

async function listTtsSheets() {
  let names;
  try {
    names = await readdir(TTS_PNGS);
  } catch {
    return [];
  }
  return names
    .filter((n) => /^tts-sheet-\d+\.png$/i.test(n))
    .map((n) => ({ name: n, index: sheetIndexFromFilename(n) }))
    .filter((x) => x.index != null && x.index >= 1)
    .sort((a, b) => a.index - b.index);
}

function expectedSheetCountFromObject(obj) {
  const n = Array.isArray(obj.DeckIDs) ? obj.DeckIDs.length : 0;
  if (n < 1) return 0;
  return Math.ceil(n / 6);
}

async function readJson(p) {
  const raw = await readFile(p, "utf8");
  return JSON.parse(raw);
}

async function writeJson(p, data) {
  await writeFile(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/** FaceURL paths: zone uses tts-sheet-NN.png; intro uses intro-tts-sheet-01.png */
function rewriteFaceUrlsForDeckTree(node, imageBase, deckId) {
  if (node == null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const x of node) rewriteFaceUrlsForDeckTree(x, imageBase, deckId);
    return;
  }
  if (node.CustomDeck && typeof node.CustomDeck === "object") {
    for (const [k, v] of Object.entries(node.CustomDeck)) {
      if (!v || typeof v !== "object") continue;
      if (deckId === "zone-deck-1") {
        const i = parseInt(k, 10);
        if (Number.isFinite(i) && i >= 1) {
          v.FaceURL = `${imageBase}/${zoneSheetBasename(i)}`;
        }
      } else if (deckId === "intro-tools") {
        v.FaceURL = `${imageBase}/${INTRO_DOC_BASENAME}`;
      }
    }
  }
  for (const v of Object.values(node)) rewriteFaceUrlsForDeckTree(v, imageBase, deckId);
}

/** Rewrite all deck objects + manifest faceURLs / imageFiles (mirrored names). */
async function syncAllMirrorFaceUrls(manifest, baseUrl) {
  const imageBase = `${normalizeBaseUrl(baseUrl)}/images`;
  const bu = normalizeBaseUrl(baseUrl);

  for (const d of manifest.decks || []) {
    const objPath = path.join(DOCS_TTS, d.objectFile);
    const obj = await readJson(objPath);
    const sheets = expectedSheetCountFromObject(obj);
    rewriteFaceUrlsForDeckTree(obj, imageBase, d.id);
    await writeJson(objPath, obj);

    const imageFiles = [];
    const faceURLs = [];
    if (d.id === "zone-deck-1") {
      for (let j = 1; j <= sheets; j++) {
        const base = zoneSheetBasename(j);
        const rel = `images/${base}`;
        imageFiles.push(rel);
        faceURLs.push(`${bu}/${rel}`);
      }
    } else if (d.id === "intro-tools") {
      const rel = `images/${INTRO_DOC_BASENAME}`;
      imageFiles.push(rel);
      faceURLs.push(`${bu}/${rel}`);
    } else {
      for (let j = 0; j < sheets; j++) {
        const rel = `images/tts-sheet-${String(j + 1).padStart(2, "0")}.png`;
        imageFiles.push(rel);
        faceURLs.push(`${bu}/${rel}`);
      }
    }
    d.imageFiles = imageFiles;
    d.faceURLs = faceURLs;
    d.sheetCount = sheets;
    d.cardCount = Array.isArray(obj.DeckIDs) ? obj.DeckIDs.length : d.cardCount;
  }

  manifest.generatedAt = new Date().toISOString();
  manifest.source = "cards.md → cards.html export + publish-tts-from-viewer-export.mjs";
  await writeJson(MANIFEST_PATH, manifest);
}

/** Copy every *.png from TTS PNGS → docs/tts/images/ (same basename). Returns lowercase basenames copied. */
async function mirrorAllPngsFromTtsFolder() {
  let names;
  try {
    names = await readdir(TTS_PNGS);
  } catch {
    console.error(`Cannot read: ${TTS_PNGS}`);
    process.exit(1);
  }
  const pngs = names.filter((n) => /\.png$/i.test(n));
  if (!pngs.length) {
    console.error(`No .png files in ${TTS_PNGS}`);
    process.exit(1);
  }
  await mkdir(DOCS_IMAGES, { recursive: true });
  const copiedLc = new Set();
  for (const n of pngs) {
    const src = path.join(TTS_PNGS, n);
    const dest = path.join(DOCS_IMAGES, n);
    await copyFile(src, dest);
    copiedLc.add(n.toLowerCase());
    console.log(`Mirrored ${path.relative(ROOT, dest)}`);
  }
  return copiedLc;
}

/** Remove docs/tts/images/*.png not present in TTS PNGS (after mirror), except protected assets. */
async function pruneDocsImagesToMatchTts(ttsPngNamesLc) {
  const protectedLc = new Set([
    "common-back.png",
    INTRO_DOC_BASENAME.toLowerCase()
  ]);
  let docNames;
  try {
    docNames = await readdir(DOCS_IMAGES);
  } catch {
    return;
  }
  for (const f of docNames) {
    if (!/\.png$/i.test(f)) continue;
    const lc = f.toLowerCase();
    if (protectedLc.has(lc)) continue;
    if (ttsPngNamesLc.has(lc)) continue;
    await safeUnlink(path.join(DOCS_IMAGES, f));
    console.log(`Removed (not in TTS PNGS): ${f}`);
  }
}

async function migrateLegacySheets() {
  await mkdir(DOCS_IMAGES, { recursive: true });
  const zoneObj = await readJson(path.join(DOCS_TTS, "objects", "zone-deck-1.json"));
  const zoneSheets = expectedSheetCountFromObject(zoneObj);

  for (let i = 0; i < zoneSheets; i++) {
    const base = zoneSheetBasename(i + 1);
    const target = path.join(DOCS_IMAGES, base);
    try {
      await readFile(target);
      continue;
    } catch {
      /* need fill */
    }
    const fromNum = path.join(DOCS_IMAGES, `${i + 1}.png`);
    const legacy = path.join(DOCS_IMAGES, `zone-deck-1-fronts-${i + 1}.png`);
    for (const src of [fromNum, legacy]) {
      try {
        await copyFile(src, target);
        console.log(`Migrated ${path.relative(ROOT, src)} → ${path.relative(ROOT, target)}`);
        break;
      } catch {
        /* try next */
      }
    }
  }

  const introTarget = path.join(DOCS_IMAGES, INTRO_DOC_BASENAME);
  try {
    await readFile(introTarget);
  } catch {
    const from5 = path.join(DOCS_IMAGES, "5.png");
    const legacyIntro = path.join(DOCS_IMAGES, "intro-tools-fronts.png");
    for (const src of [from5, legacyIntro]) {
      try {
        await copyFile(src, introTarget);
        console.log(`Migrated ${path.relative(ROOT, src)} → ${path.relative(ROOT, introTarget)}`);
        break;
      } catch {
        /* */
      }
    }
  }
}

async function safeUnlink(p) {
  try {
    await unlink(p);
    console.log(`Removed legacy ${path.relative(ROOT, p)}`);
  } catch {
    /* ignore */
  }
}

async function removeLegacyIfCanonicalExists() {
  const zone1 = path.join(DOCS_IMAGES, zoneSheetBasename(1));
  const intro1 = path.join(DOCS_IMAGES, INTRO_DOC_BASENAME);
  let hasZone = false;
  let hasIntro = false;
  try {
    await readFile(zone1);
    hasZone = true;
  } catch {
    /* */
  }
  try {
    await readFile(intro1);
    hasIntro = true;
  } catch {
    /* */
  }
  if (hasZone) {
    for (const name of [
      "1.png",
      "2.png",
      "3.png",
      "4.png",
      "zone-deck-1-fronts-1.png",
      "zone-deck-1-fronts-2.png",
      "zone-deck-1-fronts-3.png",
      "zone-deck-1-fronts-4.png",
      "zone-deck-1-fronts.png"
    ]) {
      await safeUnlink(path.join(DOCS_IMAGES, name));
    }
  }
  if (hasIntro) {
    await safeUnlink(path.join(DOCS_IMAGES, "5.png"));
    await safeUnlink(path.join(DOCS_IMAGES, "intro-tools-fronts.png"));
  }
}

async function resolveBaseUrl(deckId) {
  let baseUrl = String(getArg("base-url", process.env.TTS_ASSET_BASE_URL || "")).trim();
  if (!baseUrl) {
    try {
      const man = await readJson(MANIFEST_PATH);
      const entry = man.decks?.find((d) => d.id === deckId) || man.decks?.[0];
      const first = entry?.faceURLs?.[0];
      if (first) {
        const u = new URL(first);
        const prefix = u.pathname.replace(/\/images\/[^/]+$/, "");
        baseUrl = `${u.origin}${prefix}`.replace(/\/+$/, "");
      }
    } catch {
      /* fall through */
    }
  }
  return baseUrl;
}

async function main() {
  if (hasFlag("migrate-legacy")) {
    let baseUrl = String(getArg("base-url", process.env.TTS_ASSET_BASE_URL || "")).trim();
    if (!baseUrl) baseUrl = await resolveBaseUrl("zone-deck-1");
    if (!baseUrl) {
      console.error("Set --base-url= or TTS_ASSET_BASE_URL for FaceURL rewrite.");
      process.exit(1);
    }
    await migrateLegacySheets();
    const m2 = await readJson(MANIFEST_PATH);
    await syncAllMirrorFaceUrls(m2, baseUrl);
    await removeLegacyIfCanonicalExists();
    console.log("\nMigrated to tts-sheet-*.png / intro-tts-sheet-01.png. Next: git add docs/tts && git commit && git push.");
    return;
  }

  if (hasFlag("mirror-all")) {
    let baseUrl = String(getArg("base-url", process.env.TTS_ASSET_BASE_URL || "")).trim();
    if (!baseUrl) baseUrl = await resolveBaseUrl("zone-deck-1");
    if (!baseUrl) {
      console.error("Set --base-url= or TTS_ASSET_BASE_URL for FaceURL rewrite.");
      process.exit(1);
    }
    const copied = await mirrorAllPngsFromTtsFolder();
    await pruneDocsImagesToMatchTts(copied);
    const m2 = await readJson(MANIFEST_PATH);
    await syncAllMirrorFaceUrls(m2, baseUrl);
    await removeLegacyIfCanonicalExists();
    console.log(
      "\nSynced TTS PNGS → docs/tts/images (same names; extras in docs removed except common-back / intro-tts-sheet-01). JSON updated."
    );
    return;
  }

  const deckId = getArg("deck", "");
  if (!deckId || !VALID_DECKS.has(deckId)) {
    console.error(
      "Use --deck=zone-deck-1 or --deck=intro-tools, or --mirror-all, or --migrate-legacy."
    );
    process.exit(1);
  }

  let baseUrl = await resolveBaseUrl(deckId);
  if (!baseUrl) {
    console.error(
      "Set --base-url=https://.../tts (no trailing slash) or TTS_ASSET_BASE_URL."
    );
    process.exit(1);
  }

  const objectPath = path.join(
    DOCS_OBJECTS,
    deckId === "zone-deck-1" ? "zone-deck-1.json" : "intro-tools.json"
  );

  let ttsObject;
  try {
    ttsObject = await readJson(objectPath);
  } catch (e) {
    console.error(`Cannot read ${objectPath}:`, e.message || e);
    process.exit(1);
  }

  const expected = expectedSheetCountFromObject(ttsObject);
  if (expected < 1) {
    console.error("Object JSON has no DeckIDs; cannot derive sheet count.");
    process.exit(1);
  }

  const sheets = await listTtsSheets();

  await mkdir(DOCS_IMAGES, { recursive: true });

  if (deckId === "zone-deck-1") {
    if (!sheets.length) {
      console.error(`No tts-sheet-*.png files in: ${TTS_PNGS}`);
      process.exit(1);
    }
    if (sheets.length < expected) {
      console.error(
        `Need at least ${expected} tts-sheet-*.png (DeckIDs, 6 faces/sheet), found ${sheets.length}.`
      );
      process.exit(1);
    }
    const used = sheets.slice(0, expected);
    if (sheets.length > expected) {
      const rest = sheets.slice(expected).map((s) => s.name);
      console.warn(
        `Using first ${expected} sheet(s); ignoring: ${rest.join(", ")} (clean TTS PNGS to avoid this).`
      );
    }
    for (let i = 0; i < used.length; i++) {
      const seq = i + 1;
      if (used[i].index !== seq) {
        console.error(
          `Missing tts-sheet-${String(seq).padStart(2, "0")}.png (need contiguous 01.. among used sheets).`
        );
        process.exit(1);
      }
    }
    for (let i = 0; i < used.length; i++) {
      const src = path.join(TTS_PNGS, used[i].name);
      const dest = path.join(DOCS_IMAGES, used[i].name);
      await copyFile(src, dest);
      console.log(`Wrote ${path.relative(ROOT, dest)} (same name as in TTS PNGS)`);
    }
  } else {
    const introSrcNamed = path.join(TTS_PNGS, INTRO_DOC_BASENAME);
    try {
      await readFile(introSrcNamed);
      const dest = path.join(DOCS_IMAGES, INTRO_DOC_BASENAME);
      await copyFile(introSrcNamed, dest);
      console.log(`Wrote ${path.relative(ROOT, dest)} (from TTS PNGS/${INTRO_DOC_BASENAME})`);
    } catch {
      if (!sheets.length) {
        console.error(
          `No intro sheet: add ${INTRO_DOC_BASENAME} or tts-sheet-01.png (after intro export) in: ${TTS_PNGS}`
        );
        process.exit(1);
      }
      if (sheets.length < expected) {
        console.error(
          `Need at least ${expected} tts-sheet-*.png (DeckIDs, 6 faces/sheet), found ${sheets.length}.`
        );
        process.exit(1);
      }
      const used = sheets.slice(0, expected);
      if (sheets.length > expected) {
        const rest = sheets.slice(expected).map((s) => s.name);
        console.warn(`Using first sheet only; ignoring: ${rest.join(", ")}`);
      }
      if (used[0].index !== 1) {
        console.error("Missing tts-sheet-01.png for intro export.");
        process.exit(1);
      }
      const src = path.join(TTS_PNGS, used[0].name);
      const dest = path.join(DOCS_IMAGES, INTRO_DOC_BASENAME);
      await copyFile(src, dest);
      console.log(
        `Wrote ${path.relative(ROOT, dest)} (from TTS PNGS/${used[0].name} → ${INTRO_DOC_BASENAME} in docs so zone tts-sheet-01.png is not overwritten)`
      );
    }
  }

  const m2 = await readJson(MANIFEST_PATH);
  await syncAllMirrorFaceUrls(m2, baseUrl);
  await removeLegacyIfCanonicalExists();

  console.log("");
  console.log("Synced FaceURLs + manifest. Next: git add docs/tts && git commit && git push.");
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
