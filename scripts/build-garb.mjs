/**
 * Reads garb.md → garb-data.js for file:// fallback.
 * Run: node scripts/build-garb.mjs
 * Watch: node scripts/build-garb.mjs --watch
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import '../garb-parse.js';

const parseGarb = globalThis.GarbParse.parseGarb;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'garb.md');
const out = path.join(root, 'garb-data.js');

function build() {
  if (!fs.existsSync(src)) {
    console.error('Missing', src);
    process.exit(1);
  }
  const raw = fs.readFileSync(src, 'utf8');
  const payload = parseGarb(raw);
  if (!payload.items.length) {
    console.error('No garb pieces found in garb.md');
    process.exit(1);
  }
  const text =
    '/* Generated from garb.md — do not edit. Preview loads the .md directly. Fallback: npm run build:garb */\n' +
    'window.GARB_DATA = ' +
    JSON.stringify(payload, null, 2) +
    ';\n';
  fs.writeFileSync(out, text, 'utf8');
  console.log(
    'Wrote',
    out,
    '(' + payload.items.length + ' piece(s), ' + payload.trinkets.length + ' trinket(s))'
  );
}

build();

if (process.argv.includes('--watch')) {
  let timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      try {
        build();
      } catch (err) {
        console.error(err);
      }
    }, 150);
  }
  fs.watch(src, schedule);
  console.log('Watching garb.md');
}
