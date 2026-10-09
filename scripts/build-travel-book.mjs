/**
 * Reads TravelBook.md → TravelBook-data.js.
 * Run: node scripts/build-travel-book.mjs
 * Watch: node scripts/build-travel-book.mjs --watch
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseTravelBook } from '../travel-book-parse.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'TravelBook.md');
const dataOut = path.join(root, 'TravelBook-data.js');

function build() {
  if (!fs.existsSync(src)) {
    console.error('Missing', src);
    process.exit(1);
  }
  const raw = fs.readFileSync(src, 'utf8');
  const payload = parseTravelBook(raw);
  if (!payload.spreads.length) {
    console.error('No spreads found. Use +++ / YAML / +++ blocks in TravelBook.md');
    process.exit(1);
  }
  const out =
    '/* Generated from TravelBook.md — do not edit. Preview loads the .md directly. Fallback: npm run build:travel */\n' +
    'window.TRAVEL_BOOK_DATA = ' +
    JSON.stringify(payload, null, 2) +
    ';\n';
  fs.writeFileSync(dataOut, out, 'utf8');
  console.log('Wrote', dataOut, '(' + payload.spreads.length + ' spread(s))');
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
  console.log('Watching TravelBook.md');
}
