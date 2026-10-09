import { mkdir, readdir, rm, stat, copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "dist", "tts");
const DEFAULT_DEST = path.join(ROOT, "docs", "tts");

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const hit = process.argv.find(a => a.startsWith(prefix));
  if (!hit) return fallback;
  return hit.slice(prefix.length);
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function copyRecursive(src, dest) {
  const st = await stat(src);
  if (st.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);
    for (const e of entries) {
      await copyRecursive(path.join(src, e), path.join(dest, e));
    }
    return;
  }
  await mkdir(path.dirname(dest), { recursive: true });
  await copyFile(src, dest);
}

async function main() {
  const baseUrlArg = getArg("base-url", process.env.TTS_ASSET_BASE_URL || "");
  const destArg = getArg("dest", DEFAULT_DEST);
  const baseUrl = String(baseUrlArg || "").trim();
  const dest = path.isAbsolute(destArg) ? destArg : path.join(ROOT, destArg);

  if (!baseUrl) {
    console.error("Missing base URL. Use --base-url=https://... or set TTS_ASSET_BASE_URL.");
    process.exit(1);
  }

  console.log(`Building TTS with base URL: ${baseUrl}`);
  const build = spawnSync(
    process.execPath,
    [path.join(ROOT, "scripts", "build-tts.mjs")],
    {
      stdio: "inherit",
      env: { ...process.env, TTS_ASSET_BASE_URL: baseUrl }
    }
  );
  if (build.status !== 0) process.exit(build.status || 1);

  if (!(await exists(SRC))) {
    console.error("Build output not found at dist/tts.");
    process.exit(1);
  }

  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });
  await copyRecursive(SRC, dest);

  const note = [
    "# TTS Publish Output",
    "",
    `Published from: dist/tts`,
    `Published to: ${dest}`,
    `Base URL baked into JSON: ${baseUrl}`,
    "",
    "Files in this folder are static-host ready."
  ].join("\n");
  await writeFile(path.join(dest, "README-tts.txt"), note, "utf8");

  console.log("");
  console.log(`Published static TTS bundle to: ${dest}`);
  console.log("Import deck objects from:");
  console.log(`- ${path.join(dest, "objects")}`);
}

main().catch(err => {
  console.error(err?.message || err);
  process.exit(1);
});
