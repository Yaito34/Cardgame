/**
 * Parse garb.md into { items, trinkets }.
 * Browser: window.GarbParse.parseGarb(text) via <script src="garb-parse.js">
 * Node: import '../garb-parse.js' then globalThis.GarbParse.parseGarb
 */

const SLOT_ZONE = {
  'Head Under': 'Head',
  'Head Over': 'Head',
  Neck: 'Neck',
  'Coat / tabard': 'Coat / tabard',
  'Body Inner': 'Body',
  'Body Middle': 'Body',
  'Body Outer': 'Body',
  'Legs Inner': 'Legs',
  'Legs Middle': 'Legs',
  'Legs Outer': 'Legs',
  Feet: 'Feet',
  Hands: 'Hands'
};

const STAT_KEY = {
  st: 'st',
  stamina: 'st',
  s: 'st',
  f: 'f',
  fight: 'f',
  c: 'c',
  craft: 'c',
  work: 'c',
  t: 't',
  traverse: 't',
  a: 's',
  awareness: 's',
  awerness: 's',
  spirit: 's',
  w: 'wr',
  wr: 'wr',
  warm: 'wr',
  cold: 'wr',
  wet: 'wr',
  r: 'wr',
  rain: 'wr',
  wp: 'wr',
  waterproof: 'wr',
  water: 'wr',
  du: 'dur',
  dur: 'dur',
  durability: 'dur'
};

function slugify(name) {
  const s = String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'piece';
}

function uniqueId(base, used) {
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = base + '-' + n;
    n += 1;
  }
  used.add(id);
  return id;
}

function isStatsLine(line) {
  const t = String(line || '').trim();
  if (!t || !/-?\d/.test(t)) return false;
  return /^(?:-?\s*)?(?:St|Stamina|S|F|Fight|C|Craft|Work|T|Traverse|Awareness|Awerness|A|Spirit|Wr|W|Warm|Cold|Wet|Wp|Waterproof|Water|Rain|R|Dur|Durability|Du)\b/i.test(t);
}

function parseStats(line) {
  const stats = {};
  const parts = String(line || '').split(/[·|,;]+/);
  for (let i = 0; i < parts.length; i++) {
    const raw = parts[i].trim();
    if (!raw) continue;
    let m = raw.match(/^([A-Za-z]+)\s*(-?\d+)$/);
    if (!m) m = raw.match(/^-([A-Za-z]+)\s*(\d+)$/);
    if (!m) continue;
    const key = STAT_KEY[m[1].toLowerCase()];
    if (!key) continue;
    const n = parseInt(m[2], 10);
    if (!Number.isFinite(n) || n <= 0) continue;
    stats[key] = n;
  }
  return stats;
}

function headingLevel(line) {
  const m = String(line || '').match(/^(#{1,3})\s+(.+?)\s*$/);
  if (!m) return null;
  return { level: m[1].length, title: m[2].trim() };
}

function parseNameHeading(title) {
  const m = String(title || '').match(/^(.+?)\s*\[([^\]]+)\]\s*$/);
  if (m) return { name: m[1].trim(), id: slugify(m[2]) };
  return { name: title, id: slugify(title) };
}

function flushItem(cur, items, usedIds) {
  if (!cur || !cur.name || !cur.slot) return;
  if (!SLOT_ZONE[cur.slot]) return;
  const item = Object.assign(
    {
      id: uniqueId(cur.id || slugify(cur.name), usedIds),
      zone: SLOT_ZONE[cur.slot] || cur.zone || cur.slot,
      slot: cur.slot,
      name: cur.name,
      note: (cur.noteLines || []).join(' ').trim()
    },
    cur.stats || {}
  );
  items.push(item);
}

function flushTrinket(cur, trinkets) {
  if (!cur || !cur.name) return;
  trinkets.push({
    kind: cur.kind || 'Trinket',
    name: cur.name,
    note: (cur.noteLines || []).join(' ').trim()
  });
}

function parseGarb(text) {
  const items = [];
  const trinkets = [];
  const usedIds = new Set();
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');

  let mode = 'garb';
  let slot = '';
  let kind = '';
  let cur = null;
  let inFence = false;

  function endCurrent() {
    if (!cur) return;
    if (mode === 'trinkets') flushTrinket(cur, trinkets);
    else flushItem(cur, items, usedIds);
    cur = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const h = headingLevel(line);
    if (h && h.level === 1) {
      endCurrent();
      const title = h.title.toLowerCase();
      mode = title.indexOf('trinket') !== -1 ? 'trinkets' : 'garb';
      slot = '';
      kind = '';
      continue;
    }
    if (h && h.level === 2) {
      endCurrent();
      if (mode === 'trinkets') kind = h.title;
      else slot = h.title;
      continue;
    }
    if (h && h.level === 3) {
      endCurrent();
      const parsed = parseNameHeading(h.title);
      cur =
        mode === 'trinkets'
          ? { kind: kind, name: parsed.name, noteLines: [] }
          : { slot: slot, name: parsed.name, id: parsed.id, stats: {}, noteLines: [] };
      continue;
    }
    if (!cur) continue;
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (mode !== 'trinkets' && !cur.noteLines.length && isStatsLine(trimmed)) {
      cur.stats = parseStats(trimmed);
      continue;
    }
    cur.noteLines.push(trimmed);
  }
  endCurrent();

  return { items: items, trinkets: trinkets };
}

if (typeof globalThis !== 'undefined') {
  globalThis.GarbParse = { parseGarb: parseGarb, SLOT_ZONE: SLOT_ZONE };
}
