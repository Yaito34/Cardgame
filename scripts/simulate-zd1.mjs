/**
 * Monte Carlo on Zone Deck 1: random 2- and 3-card batches.
 * Metrics (no tools, ignoring field effects — lower bound / rough spread):
 *   - minEx: sum of lowest Difficulty per card (cheapest way through if outcomes ignored)
 *   - maxProg: sum of highest Progress number found in any approach outcome string
 *
 * Run: node scripts/simulate-zd1.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'cards.json'), 'utf8'));
const deck = data.decks.find((d) => d.id === 'zone-deck-1').cards;

function progressFromOutcome(s) {
  const m = String(s || '').match(/Progress\s+(\d+)/gi);
  if (!m) return 0;
  return Math.max(...m.map((x) => parseInt(x.replace(/Progress\s+/i, ''), 10)));
}

function cardStats(card) {
  let minD = 99;
  let maxP = 0;
  for (const a of card.approaches || []) {
    const d = a.difficulty;
    if (d < minD) minD = d;
    maxP = Math.max(maxP, progressFromOutcome(a.outcomes));
  }
  return { minD, maxP, name: card.name };
}

const stats = deck.map(cardStats);

function shufflePick(n, rng) {
  const ix = [...Array(stats.length).keys()];
  for (let i = ix.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [ix[i], ix[j]] = [ix[j], ix[i]];
  }
  return ix.slice(0, n).map((i) => stats[i]);
}

function run(samples, k, rng) {
  const sumsE = [];
  const sumsP = [];
  let over = 0;
  for (let s = 0; s < samples; s++) {
    const pick = shufflePick(k, rng);
    const E = pick.reduce((a, c) => a + c.minD, 0);
    const P = pick.reduce((a, c) => a + c.maxP, 0);
    sumsE.push(E);
    sumsP.push(P);
    if (E > 15) over++;
  }
  sumsE.sort((a, b) => a - b);
  sumsP.sort((a, b) => a - b);
  const q = (arr, p) => arr[Math.floor((p / 100) * (arr.length - 1))];
  return {
    k,
    medianE: q(sumsE, 50),
    p90E: q(sumsE, 90),
    maxE: sumsE[sumsE.length - 1],
    minE: sumsE[0],
    fracOver15: over / samples,
    medianMaxProg: q(sumsP, 50),
    p10MaxProg: q(sumsP, 10),
  };
}

const rng = () => Math.random();
const N = 8000;
console.log('ZD1 challenge count:', stats.length);
console.log('Samples per k:', N);
for (const k of [2, 3]) {
  const r = run(N, k, rng);
  console.log(JSON.stringify(r, null, 2));
}
console.log(
  '\nNote: minE ignores tools, Obstacle, Wild Charge, Grouping, etc. Real play is usually higher E for the same Progress.'
);
