/**
 * Writes archive/cursor-ignored/rules.md §12–§14 tables from card-definitions.md.
 * Rows are sorted A→Z by keyword only in the rulebook — order in card-definitions.md is unchanged.
 * Run: node scripts/sync-rules-from-definitions.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const defPath = path.join(root, 'card-definitions.md');
const rulesPath = path.join(root, 'archive', 'cursor-ignored', 'rules.md');

const MARK_ACT_START = '<!-- AUTO:SYNC:activation-keywords -->';
const MARK_ACT_END = '<!-- /AUTO:SYNC:activation-keywords -->';
const MARK_UNI_START = '<!-- AUTO:SYNC:universal-effects -->';
const MARK_UNI_END = '<!-- /AUTO:SYNC:universal-effects -->';
const MARK_EFF_START = '<!-- AUTO:SYNC:card-effects -->';
const MARK_EFF_END = '<!-- /AUTO:SYNC:card-effects -->';

function stripDefKeyword(k) {
  const s = String(k || '').trim();
  const m = s.match(/^\*\*([\s\S]*?)\*\*$/);
  return m ? m[1].trim() : s;
}

function sortByKeyword(rows) {
  return [...rows].sort((a, b) =>
    a[0].localeCompare(b[0], undefined, { sensitivity: 'base', numeric: true })
  );
}

/** Remove leading *(Tool)* / *(Challenge)* / *(Mixed)* from definition (kind is shown under the keyword in rules). */
function stripEffectKindTag(val) {
  return String(val)
    .replace(/^\*\([^)]+\)\*\s*/g, '')
    .trim();
}

/** Subsection under ## Effects → rulebook label under effect name (Tool / Mixed / Challenge). */
const EFF_SUB = {
  tools: 'Tool',
  mixed: 'Mixed',
  challenges: 'Challenge'
};

/** Activation, Universal, and Effects (## Tools / ## Mixed / ## Challenges set effect type). */
function parseDefSections(text) {
  const activations = [];
  const universal = [];
  const effects = [];
  let mode = 'none';
  let effType = 'Mixed';
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (/^##\s+Activation\s+Keywords\b/i.test(t)) {
      mode = 'act';
      continue;
    }
    if (/^##\s+Universal\s+Effects\b/i.test(t)) {
      mode = 'uni';
      continue;
    }
    if (/^##\s+Effects\b/i.test(t)) {
      mode = 'eff';
      effType = 'Mixed';
      continue;
    }
    if (/^##\s+/m.test(t)) {
      if (mode === 'eff') {
        const sub = t.match(/^##\s+(Tools|Mixed|Challenges)\b/i);
        if (sub) {
          const k = sub[1].toLowerCase();
          effType = EFF_SUB[k] || 'Mixed';
          continue;
        }
      }
      mode = 'none';
      continue;
    }
    if (mode !== 'act' && mode !== 'uni' && mode !== 'eff') continue;
    if (!t || t.startsWith('#')) continue;
    const bar = t.indexOf('|');
    if (bar < 0) continue;
    const key = stripDefKeyword(t.slice(0, bar).trim());
    const val = t.slice(bar + 1).trim();
    if (!key) continue;
    if (mode === 'act') activations.push([key, val]);
    if (mode === 'uni') universal.push([key, val]);
    if (mode === 'eff') effects.push([key, val, effType]);
  }
  return {
    activations: sortByKeyword(activations),
    universal: sortByKeyword(universal),
    effects: sortByKeyword(effects)
  };
}

function escapeCell(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function keywordColActivation(k) {
  if (k === '[X+]') return '**`[X+]`**';
  return '**' + escapeCell(k) + '**';
}

function buildActivationTable(rows) {
  const lines = [
    '| Keyword | Description |',
    '|---------|-------------|',
    ...rows.map(([k, d]) => '| ' + keywordColActivation(k) + ' | ' + escapeCell(d) + ' |')
  ];
  return lines.join('\n');
}

function buildUniversalTable(rows) {
  const lines = [
    '| Effect | Description |',
    '|--------|-------------|',
    ...rows.map(([k, d]) => '| **' + escapeCell(k) + '** | ' + escapeCell(d) + ' |')
  ];
  return lines.join('\n');
}

function effectKindLine(typ) {
  const t = typ || 'Mixed';
  if (t === 'Tool') return '*(Tool)*';
  if (t === 'Challenge') return '*(Challenge)*';
  return '*(Mixed)*';
}

function buildCardEffectsTable(rows) {
  const lines = [
    '| Effect | Description |',
    '|--------|-------------|',
    ...rows.map(([k, d, typ]) => {
      const kw = escapeCell(k);
      const kind = effectKindLine(typ);
      const effectCell =
        '<span class="effect-keyword"><strong>' +
        escapeHtml(kw) +
        '</strong></span><br>' +
        kind;
      const desc = escapeCell(stripEffectKindTag(d));
      return '| ' + effectCell + ' | ' + desc + ' |';
    })
  ];
  return lines.join('\n');
}

function replaceBetween(text, startMark, endMark, newInner) {
  const i = text.indexOf(startMark);
  const j = text.indexOf(endMark);
  if (i < 0 || j < 0 || j <= i) {
    throw new Error('Missing markers: ' + startMark + ' … ' + endMark);
  }
  const before = text.slice(0, i + startMark.length);
  const after = text.slice(j);
  return before + '\n\n' + newInner + '\n\n' + after;
}

const defText = fs.readFileSync(defPath, 'utf8');
const { activations, universal, effects } = parseDefSections(defText);

if (!activations.length) {
  console.error('No rows under ## Activation Keywords in card-definitions.md');
  process.exit(1);
}
if (!universal.length) {
  console.error('No rows under ## Universal Effects in card-definitions.md');
  process.exit(1);
}
if (!effects.length) {
  console.error('No rows under ## Effects in card-definitions.md');
  process.exit(1);
}

let rules = fs.readFileSync(rulesPath, 'utf8');
rules = replaceBetween(rules, MARK_ACT_START, MARK_ACT_END, buildActivationTable(activations));
rules = replaceBetween(rules, MARK_UNI_START, MARK_UNI_END, buildUniversalTable(universal));
rules = replaceBetween(rules, MARK_EFF_START, MARK_EFF_END, buildCardEffectsTable(effects));
fs.writeFileSync(rulesPath, rules, 'utf8');
console.log(
  'Updated archive/cursor-ignored/rules.md §12–§14 from card-definitions.md (' +
    activations.length +
    ' activations, ' +
    universal.length +
    ' universal, ' +
    effects.length +
    ' card effects, sorted A–Z).'
);
