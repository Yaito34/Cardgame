/**
 * Journey sim: Required Progress 15, Stamina 15, Vision 2 (Old Forest).
 * Deck + tools aligned to cards.md Zone Deck 1 + Starting Tools.
 *
 * Run:
 *   node scripts/sim-journey-15-15.mjs
 *   node scripts/sim-journey-15-15.mjs --trace 42
 *   node scripts/sim-journey-15-15.mjs --find-fail
 *
 * Limits (see stdout footer): greedy policy, Scout/Find ignored, simplified Area/Lasts/Charging; no Range second-target, no On Use Scout/Sight.
 */

const REQUIRED = 15;
const STAMINA = 15;
const VISION = 2;

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** @typedef {{ type: string, diff: number, progress?: number, recovery?: number, scout?: number, rations?: number, find?: string, danger1Plus?: number }} Approach */

/** @typedef {{ key: string, obstacle?: number, treacherous?: number, rough?: number, dreadAware?: number, covering?: number, blocking?: boolean, grouping?: number, charging?: number, chargingBonus?: number, approaches: Approach[] }} Template */

/** Zone Deck 1 templates (difficulties + main outcomes). */
const TEMPLATES = /** @type {Record<string, Template>} */ ({
  Wolf: {
    key: 'Wolf',
    grouping: 2,
    approaches: [
      { type: 'Fight', diff: 6, rations: 2 },
      { type: 'Work', diff: 5, scout: 1 },
      { type: 'Traverse', diff: 2, progress: 1 },
      { type: 'Awareness', diff: 4, progress: 2 },
    ],
  },
  LoneWolf: {
    key: 'LoneWolf',
    approaches: [
      { type: 'Fight', diff: 7, progress: 2 },
      { type: 'Traverse', diff: 2, progress: 1, lastsGuidance2: true },
      { type: 'Awareness', diff: 4, progress: 2 },
    ],
  },
  WildBoar: {
    key: 'WildBoar',
    charging: 1,
    chargingBonus: 2,
    approaches: [
      { type: 'Fight', diff: 8, progress: 3 },
      { type: 'Work', diff: 6, recovery: 1 },
      { type: 'Traverse', diff: 3, scout: 2 },
    ],
  },
  Snake: {
    key: 'Snake',
    approaches: [
      { type: 'Fight', diff: 3, progress: 2, danger1Plus: 3 },
      { type: 'Work', diff: 3, scout: 1 },
      { type: 'Awareness', diff: 2, scout: 1 },
      { type: 'Traverse', diff: 5, lastsGuidance2: true },
    ],
  },
  Crow: {
    key: 'Crow',
    dreadAware: 1,
    approaches: [
      { type: 'Fight', diff: 5, progress: 1 },
      { type: 'Awareness', diff: 2, progress: 1, dreadRider: 2 },
      { type: 'Awareness', diff: 4, find: 'F3' },
      { type: 'Traverse', diff: 3, scout: 1 },
    ],
  },
  Thicket: {
    key: 'Thicket',
    blocking: true,
    approaches: [
      { type: 'Fight', diff: 6, recovery: 1 },
      { type: 'Work', diff: 3, progress: 2 },
      { type: 'Traverse', diff: 5, scout: 1 },
    ],
  },
  Dense: {
    key: 'Dense',
    obstacle: 1,
    approaches: [
      { type: 'Fight', diff: 7, progress: 1 },
      { type: 'Work', diff: 5, find: 'F4' },
      { type: 'Traverse', diff: 4, progress: 1 },
    ],
  },
  FallenTree: {
    key: 'FallenTree',
    approaches: [
      { type: 'Fight', diff: 5, scout: 1 },
      { type: 'Work', diff: 4, rations: 1 },
      { type: 'Traverse', diff: 2, progress: 1 },
      { type: 'Awareness', diff: 3, recovery: 1 },
    ],
  },
  RockySlope: {
    key: 'RockySlope',
    approaches: [
      { type: 'Traverse', diff: 2, progress: 1 },
      { type: 'Traverse', diff: 6, find: 'F1' },
      { type: 'Work', diff: 5, progress: 1 },
      { type: 'Awareness', diff: 3, recovery: 1 },
    ],
  },
  Stream: {
    key: 'Stream',
    approaches: [
      { type: 'Fight', diff: 5, rations: 1 },
      { type: 'Traverse', diff: 3, progress: 2 },
      { type: 'Traverse', diff: 4, recovery: 2 },
      { type: 'Work', diff: 4, scout: 1 },
    ],
  },
  Muddy: {
    key: 'Muddy',
    treacherous: 1,
    approaches: [
      { type: 'Work', diff: 3, progress: 2 },
      { type: 'Traverse', diff: 3, recovery: 1 },
    ],
  },
  Fog: {
    key: 'Fog',
    covering: 2,
    approaches: [
      { type: 'Awareness', diff: 4, recovery: 2 },
      { type: 'Work', diff: 5, scout: 1 },
      { type: 'Traverse', diff: 6, progress: 1 },
    ],
  },
  Ravine: {
    key: 'Ravine',
    approaches: [
      { type: 'Fight', diff: 7, recovery: 1 },
      { type: 'Traverse', diff: 8, progress: 3 },
      { type: 'Work', diff: 5, progress: 2 },
      { type: 'Awareness', diff: 3, recovery: 1 },
    ],
  },
  AncientTree: {
    key: 'AncientTree',
    approaches: [
      { type: 'Work', diff: 5, scout: 2 },
      { type: 'Traverse', diff: 3, progress: 2, lastsGuidance2: true },
      { type: 'Awareness', diff: 4, recovery: 4 },
    ],
  },
  Berry: {
    key: 'Berry',
    approaches: [
      { type: 'Fight', diff: 3, recovery: 1 },
      { type: 'Awareness', diff: 3, rations: 2 },
      { type: 'Work', diff: 2, rations: 1 },
      { type: 'Traverse', diff: 4, rations: 1 },
    ],
  },
  Tracks: {
    key: 'Tracks',
    dreadAware: 1,
    approaches: [
      { type: 'Fight', diff: 5, scout: 1 },
      { type: 'Awareness', diff: 3, scout: 1 },
      { type: 'Awareness', diff: 5, progress: 2 },
      { type: 'Traverse', diff: 4, progress: 1 },
    ],
  },
  StoneMarker: {
    key: 'StoneMarker',
    approaches: [
      { type: 'Awareness', diff: 4, find: 'F2' },
      { type: 'Awareness', diff: 5, rations: 1 },
      { type: 'Traverse', diff: 5, progress: 1 },
      { type: 'Work', diff: 6, rations: 1 },
    ],
  },
  Hollow: {
    key: 'Hollow',
    approaches: [
      { type: 'Awareness', diff: 2, recovery: 3 },
      { type: 'Work', diff: 4, scout: 1 },
      { type: 'Traverse', diff: 3, progress: 2, lastsPrepare2: true },
    ],
  },
  TallTree: {
    key: 'TallTree',
    approaches: [
      { type: 'Work', diff: 5, recovery: 2 },
      { type: 'Traverse', diff: 4, scout: 2, lastsGuidance1: true },
      { type: 'Awareness', diff: 4, progress: 2 },
    ],
  },
  Overgrown: {
    key: 'Overgrown',
    rough: 1,
    approaches: [
      { type: 'Work', diff: 4, progress: 2 },
      { type: 'Traverse', diff: 3, rations: 1 },
    ],
  },
  ClearingEdge: {
    key: 'ClearingEdge',
    approaches: [
      { type: 'Fight', diff: 6, rations: 1 },
      { type: 'Awareness', diff: 3, scout: 1 },
      { type: 'Awareness', diff: 5, progress: 2 },
      { type: 'Traverse', diff: 4, progress: 1 },
    ],
  },
});

function buildDeck() {
  const list = [];
  const add = (name, n) => {
    const t = TEMPLATES[name];
    if (!t) throw new Error(`missing template ${name}`);
    for (let i = 0; i < n; i++) list.push(structuredClone(t));
  };
  add('Wolf', 2);
  add('LoneWolf', 1);
  add('WildBoar', 2);
  add('Snake', 1);
  add('Crow', 1);
  add('Thicket', 1);
  add('Dense', 1);
  add('FallenTree', 1);
  add('RockySlope', 1);
  add('Stream', 1);
  add('Muddy', 1);
  add('Fog', 1);
  add('Ravine', 1);
  add('AncientTree', 1);
  add('Berry', 1);
  add('Tracks', 1);
  add('StoneMarker', 1);
  add('Hollow', 1);
  add('TallTree', 1);
  add('Overgrown', 1);
  add('ClearingEdge', 1);
  return list;
}

function countWolves(row) {
  return row.filter((c) => c.key === 'Wolf').length;
}

function obstacleModFor(card, row) {
  let s = 0;
  for (const o of row) {
    if (o === card) continue;
    s += o.obstacle || 0;
  }
  return s;
}

function coveringMod(card, row) {
  const idx = row.indexOf(card);
  if (idx <= 0) return 0;
  const left = row[idx - 1];
  return left?.covering || 0;
}

function difficultyOf(card, row, ap, globalActions, traversePowerBonus) {
  let d = ap.diff + obstacleModFor(card, row) + coveringMod(card, row);
  if (card.key === 'Wolf' && card.grouping && countWolves(row) >= 2) d += card.grouping;
  if (card.dreadAware && ap.type === 'Awareness') d += card.dreadAware;
  if (ap.dreadRider && ap.type === 'Awareness') d += ap.dreadRider;
  if (card.charging != null && card.revealedAt != null && globalActions >= card.revealedAt + card.charging) {
    d += card.chargingBonus || 0;
  }
  if (card.treacherous && ap.type === 'Traverse') d += card.treacherous;
  if (card.rough && ap.type === 'Work') d += card.rough;
  if (ap.type === 'Traverse') d = Math.max(0, d - traversePowerBonus);
  return d;
}

function cloneTools() {
  // Approximates cards.md # Starting Tools (Camp Knife, Hand Axe, Trail Rope, Warded Charm).
  // Not modeled: Range second-slot target, Area chaining, On Use Scout, Sight +1, backpack tools.
  return [
    { id: 'knife_f2', approach: 'Fight', power: 2, left: 3 },
    { id: 'axe', approach: 'Work', power: 4, left: 2 },
    { id: 'rope_t', approach: 'Traverse', power: 4, left: 2 },
    { id: 'rope_w', approach: 'Work', power: 3, left: 2 },
    { id: 'charm', approach: 'Awareness', power: 4, left: 2 },
  ];
}

function pickTool(approach, tools) {
  const candidates = tools.filter((t) => t.approach === approach && t.left > 0);
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.power - a.power);
  return candidates[0];
}

function spendTool(tool) {
  if (!tool || tool.left >= 999) return;
  tool.left -= 1;
}

function scoreChoice(progress, recovery, exh, exhaustion, needProg) {
  const need = Math.max(0, REQUIRED - needProg);
  const progW = need > 0 ? progress * 2.8 : progress * 0.9;
  const exhW = exh * 1.2;
  const panic = exhaustion + exh >= STAMINA ? 8 : 0;
  const recoverW = recovery * (exhaustion >= STAMINA - 4 ? 1.2 : 0.35);
  return progW + recoverW - exhW - panic;
}

function runOnce(rng, opts = {}) {
  const trace = opts.trace === true;
  const traceLines = [];

  let deck = shuffle(buildDeck(), rng);
  let row = [];
  let progress = 0;
  let exhaustion = 0;
  const tools = cloneTools();
  let globalActions = 0;
  /** Guidance: reduces effective Traverse difficulty on the next Approach only. */
  let nextTraverseBonus = 0;
  /** Prepare: +Power for the next Approach (any type), one shot. */
  let nextPowerBonus = 0;
  let steps = 0;
  const maxSteps = 500;

  const refill = () => {
    while (row.length < VISION && deck.length) {
      const c = deck.pop();
      c.revealedAt = globalActions;
      row.push(c);
    }
  };

  refill();

  while (progress < REQUIRED && exhaustion < STAMINA && steps++ < maxSteps) {
    if (row.length === 0) {
      refill();
      if (row.length === 0) break;
    }

    const front = row[0];
    const traverseBuffThisStep = nextTraverseBonus;
    const powerBuffThisStep = nextPowerBonus;

    let best = null;
    let bestScore = -1e9;

    for (const ap of front.approaches) {
      const d = difficultyOf(front, row, ap, globalActions, nextTraverseBonus);
      const tool = pickTool(ap.type, tools);
      const power = (tool ? tool.power : 0) + nextPowerBonus;
      let baseExh = Math.max(0, d - power);
      let danger = 0;
      if (ap.danger1Plus && baseExh >= 1) danger = ap.danger1Plus;
      const prog = ap.progress || 0;
      const recover = ap.recovery || 0;
      const sc = scoreChoice(prog, recover, baseExh + danger, exhaustion, progress);
      if (sc > bestScore) {
        bestScore = sc;
        best = { ap, d, tool, baseExh, danger, prog, recover };
      }
    }

    if (!best) {
      exhaustion = STAMINA;
      break;
    }

    spendTool(best.tool);
    let delta = best.baseExh + best.danger;
    exhaustion += delta;
    exhaustion -= best.recover;
    exhaustion = Math.max(0, exhaustion);
    progress += best.prog;

    nextTraverseBonus = 0;
    nextPowerBonus = 0;
    if (best.ap.lastsGuidance2 && best.ap.type === 'Traverse') nextTraverseBonus = 2;
    if (best.ap.lastsGuidance1 && best.ap.type === 'Traverse') nextTraverseBonus = 1;
    if (best.ap.lastsPrepare2 && best.ap.type === 'Traverse') nextPowerBonus = 2;

    if (trace) {
      traceLines.push({
        step: steps,
        card: front.key,
        approach: best.ap.type,
        diff: best.d,
        tool: best.tool?.id ?? 'none',
        traverseBuffThisStep,
        powerBuffThisStep,
        exh: best.baseExh,
        danger: best.danger,
        recover: best.recover,
        progress: best.prog,
        totalProgress: progress,
        exhaustion,
        row: row.map((c) => c.key),
      });
    }

    globalActions += 1;
    row.shift();
    refill();
  }

  return {
    win: progress >= REQUIRED && exhaustion < STAMINA,
    progress,
    exhaustion,
    steps,
    traceLines,
  };
}

function batch(runs, seedBase) {
  let wins = 0;
  let sumExh = 0;
  let sumSteps = 0;
  let failExh = 0;
  let failProg = 0;
  let failN = 0;
  for (let i = 0; i < runs; i++) {
    const r = runOnce(mulberry32(seedBase + i), {});
    if (r.win) {
      wins++;
      sumExh += r.exhaustion;
      sumSteps += r.steps;
    } else {
      failN++;
      failExh += r.exhaustion;
      failProg += r.progress;
    }
  }
  return {
    runs,
    winRate: wins / runs,
    avgExhaustionOnWin: wins ? sumExh / wins : 0,
    avgStepsOnWin: wins ? sumSteps / wins : 0,
    avgExhaustionOnFail: failN ? failExh / failN : 0,
    avgProgressOnFail: failN ? failProg / failN : 0,
  };
}

const args = process.argv.slice(2);
const traceIdx = args.indexOf('--trace');
const seed = traceIdx >= 0 ? Number(args[traceIdx + 1]) || 0 : 0;

if (args.includes('--find-fail')) {
  for (let i = 0; i < 50000; i++) {
    const r = runOnce(mulberry32(9001 + i), {});
    if (!r.win) {
      console.log(JSON.stringify({ firstFailingSeed: i, ...r }, null, 2));
      process.exit(0);
    }
  }
  console.log(JSON.stringify({ firstFailingSeed: null, tried: 50000 }));
  process.exit(0);
}

if (traceIdx >= 0) {
  const r = runOnce(mulberry32(9001 + seed), { trace: true });
  console.log(
    JSON.stringify(
      {
        scenario: 'single greedy run with trace',
        requiredProgress: REQUIRED,
        stamina: STAMINA,
        vision: VISION,
        win: r.win,
        finalProgress: r.progress,
        finalExhaustion: r.exhaustion,
        steps: r.steps,
        log: r.traceLines,
      },
      null,
      2,
    ),
  );
} else {
  const b = batch(4000, 9001);
  console.log(
    JSON.stringify(
      {
        requiredProgress: REQUIRED,
        stamina: STAMINA,
        vision: VISION,
        greedyMonteCarlo4000: {
          winRate: Number(b.winRate.toFixed(4)),
          avgExhaustionOnWin: Number(b.avgExhaustionOnWin.toFixed(2)),
          avgStepsOnWin: Number(b.avgStepsOnWin.toFixed(2)),
          avgExhaustionOnFail: Number(b.avgExhaustionOnFail.toFixed(2)),
          avgProgressOnFail: Number(b.avgProgressOnFail.toFixed(2)),
        },
        methodology: [
          'Greedy scoring: prefers Progress when behind, trades Recovery more when Exhaustion is high.',
          'Not modeled: Scout reordering, Find discoveries, Maintain Tools, Rest, Rations spend, multi-column reveals, Blocking order traps, exact Area tool semantics.',
          'Partially modeled: Obstacle, Treacherous (local Traverse +X), Rough (local Work +X), Covering (from left neighbour), Wolf Grouping, Crow/Tracks Dread, Snake Danger on 1+ exh from line, Wild Boar Charging, Lasts Guidance/Prepare as one-shot next-approach power.',
        ],
      },
      null,
      2,
    ),
  );
}
