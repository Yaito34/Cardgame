/**
 * Reads discovery-book.md → discovery-book-data.js (content only; HTML/CSS are hand-edited).
 * Run: node scripts/build-discovery-book.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'discovery-book.md');
const dataOut = path.join(root, 'discovery-book-data.js');

function parseYamlBlock(block) {
  const o = {};
  for (const line of block.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    const i = t.indexOf(':');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    o[k] = t.slice(i + 1).trim();
  }
  return o;
}

function splitSpreads(text) {
  const parts = text.split(/^\s*\+{3}\s*$/m).map((p) => p.trim());
  const spreads = [];
  for (let i = 1; i < parts.length; i += 2) {
    const meta = parts[i];
    const body = parts[i + 1] || '';
    if (!meta) continue;
    const y = parseYamlBlock(meta);
    if (y.id || y.kind) spreads.push({ meta: y, body });
  }
  return spreads;
}

function toData(spreads) {
  return spreads.map((s) => {
    const m = s.meta;
    const kind = (m.kind || 'path').toLowerCase();
    const body = (s.body || '').trim();
    const base = {
      id: m.id != null ? String(m.id) : '',
      kind,
      discoveryNumber: m.discovery_number != null ? String(m.discovery_number) : String(m.discovery || ''),
      leftNote: m.left_note || ''
    };
    if (kind === 'transition') {
      return {
        ...base,
        zone: m.zone || '',
        fromArea: m.from_area || '',
        fromPage: m.from_page || '',
        discoverDifficulty: m.discover_difficulty || '',
        transitionName: m.transition_name || '',
        toPage: m.to_page || '',
        toArea: m.to_area || '',
        thereName: m.there_name || '',
        body
      };
    }
    if (kind === 'path') {
      const pathText = m.path_text || body || '';
      return { ...base, pathText };
    }
    return { ...base, body };
  });
}

const raw = fs.readFileSync(srcPath, 'utf8');
const spreads = splitSpreads(raw);
if (spreads.length === 0) {
  console.error('No spreads in discovery-book.md (use +++ / YAML / +++ blocks).');
  process.exit(1);
}

const payload = { spreads: toData(spreads) };
const out =
  '/* Generated from discovery-book.md — do not edit. Run: npm run build:discovery */\n' +
  'window.DISCOVERY_BOOK_DATA = ' +
  JSON.stringify(payload, null, 2) +
  ';\n';

fs.writeFileSync(dataOut, out, 'utf8');
console.log('Wrote', dataOut, '(' + payload.spreads.length + ' page(s))');
