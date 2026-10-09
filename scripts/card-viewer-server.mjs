#!/usr/bin/env node
/**
 * Local static host for cards + server-side TTS PNG export into project/TTS PNGS.
 * Binds 127.0.0.1 only. Dev use — no authentication.
 */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(path.join(__dirname, ".."));
const TTS_PNGS = path.join(ROOT, "TTS PNGS");
const REQUESTED_PORT = Number(process.env.CARD_VIEWER_PORT || "8765");
const PORT_FALLBACK_ATTEMPTS = 20;
const MAX_BODY_BYTES = 200 * 1024 * 1024;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".mp3": "audio/mpeg",
};

function isSafeStaticFile(rel) {
  const resolved = path.resolve(path.join(ROOT, rel));
  const relToRoot = path.relative(ROOT, resolved);
  if (relToRoot.startsWith("..") || path.isAbsolute(relToRoot)) return null;
  return resolved;
}

function isAllowedTtsName(name) {
  const s = String(name || "").trim();
  const m = /^tts-sheet-(\d+)\.png$/i.exec(s);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (n < 1 || !Number.isFinite(n)) return null;
  return "tts-sheet-" + (n < 10 ? "0" + n : String(n)) + ".png";
}

async function readRequestBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) {
      const e = new Error("Payload too large");
      e.code = "PAYLOAD_TOO_LARGE";
      throw e;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function handleApi(req, res, url) {
  if (url.pathname === "/api/tts-health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: true, ttsDir: TTS_PNGS }));
    return true;
  }

  if (url.pathname === "/api/tts-sheets" && req.method === "POST") {
    let raw;
    try {
      raw = await readRequestBody(req);
    } catch (e) {
      if (e.code === "PAYLOAD_TOO_LARGE") {
        res.writeHead(413, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Payload too large");
        return true;
      }
      throw e;
    }

    let json;
    try {
      json = JSON.parse(raw.toString("utf8"));
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Invalid JSON");
      return true;
    }

    const files = json.files;
    if (!Array.isArray(files) || files.length === 0) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Expected non-empty files array");
      return true;
    }

    await fs.mkdir(TTS_PNGS, { recursive: true });
    const written = [];

    for (const f of files) {
      const safeName = isAllowedTtsName(f.filename || f.name);
      if (!safeName) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Invalid filename (use tts-sheet-NN.png)");
        return true;
      }
      const b64 = String(f.data || "");
      const buf = Buffer.from(b64, "base64");
      if (!buf.length) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Empty or invalid base64 for " + safeName);
        return true;
      }
      const dest = path.join(TTS_PNGS, safeName);
      await fs.writeFile(dest, buf);
      written.push(safeName);
    }

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: true, written, dir: TTS_PNGS }));
    return true;
  }

  return false;
}

async function serveStatic(req, res, url) {
  let rel = url.pathname === "/" ? "cards.html" : url.pathname.replace(/^\/+/, "");
  try {
    rel = decodeURIComponent(rel);
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }
  rel = path.normalize(rel);
  if (rel.includes("..")) {
    res.writeHead(403);
    res.end();
    return;
  }

  const filePath = isSafeStaticFile(rel);
  if (!filePath) {
    res.writeHead(403);
    res.end();
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) {
      res.writeHead(404);
      res.end();
      return;
    }
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const headers = { "Content-Type": MIME[ext] || "application/octet-stream" };
    if (ext === ".html" || ext === ".md" || ext === ".js" || ext === ".css") {
      headers["Cache-Control"] = "no-store";
    }
    res.writeHead(200, headers);
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const addr = server.address();
    const fallbackPort = typeof addr === "object" && addr && addr.port != null ? addr.port : REQUESTED_PORT;
    const host = req.headers.host || `127.0.0.1:${fallbackPort}`;
    const url = new URL(req.url || "/", `http://${host}`);

    if (await handleApi(req, res, url)) return;
    await serveStatic(req, res, url);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(String(e && e.message ? e.message : e));
    }
  }
});

function listenOnePort(port, host) {
  return new Promise(function (resolve, reject) {
    function onError(err) {
      server.off("error", onError);
      reject(err);
    }
    server.once("error", onError);
    server.listen(port, host, function () {
      server.off("error", onError);
      resolve(port);
    });
  });
}

async function startWithPortFallback() {
  const host = "127.0.0.1";
  let lastErr;
  for (var i = 0; i < PORT_FALLBACK_ATTEMPTS; i++) {
    var port = REQUESTED_PORT + i;
    try {
      await listenOnePort(port, host);
      if (i > 0) {
        console.warn("Port " + REQUESTED_PORT + " was in use (EADDRINUSE); using " + port + " instead.");
      }
      console.log("Card viewer: http://" + host + ":" + port + "/cards.html");
      console.log("Garb system: http://" + host + ":" + port + "/GarbSystem.html");
      console.log("TTS export writes to: " + TTS_PNGS);
      return;
    } catch (err) {
      lastErr = err;
      if (err && err.code !== "EADDRINUSE") {
        console.error(err);
        process.exit(1);
      }
    }
  }
  console.error("Could not bind a port after " + PORT_FALLBACK_ATTEMPTS + " attempts from " + REQUESTED_PORT + ".");
  if (lastErr) console.error(lastErr);
  process.exit(1);
}

startWithPortFallback();
