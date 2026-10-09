/**
 * Monte Carlo exploration sim: matches prototype in cards.md (12 progress, 15 stamina, Vision 2).
 * Greedy player: pick approach+tool minimizing exhaustion for outcome, preferring Progress.
 *
 * Run: node scripts/sim-explore-15.mjs
 */

const REQUIRED = 12;
const STAMINA = 15;
const VISION = 2;

// Tool lines: { id, approach, power, uses } — uses Infinity = no tracker on card
const TOOL_LINES = [
  { id: 'knife_fight', approach: 'Fight', power: 2, uses: 3 },
  { id: 'blade_fight', approach: 'Fight', power: 7, uses: Infinity },
  { id: 'axe_work', approach: 'Work', power: 4, uses: 3 },
  { id: 'axe_fight', approach: 'Fight', power: 4, uses: 2 },
  { id: 'rope_trav', approach: 'Traverse', power: 4, uses: Infinity },
  { id: 'rope_work', approach: 'Work', power: 3, uses: 2 },
  { id: 'rope_aware', approach: 'Awareness', power: 3, uses: Infinity },
  { id: 'charm_aware', approach: 'Awareness', power: 4, uses: 2 },
  { id: 'charm_work', approach: 'Work', power: 3, uses: 2 },
];

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Card templates: approaches with base difficulty, outcomes parsed simply */
const CARDS = {
  Wolf: {
    key: 'Wolf',
    grouping: 2,
    approaches: [
      { t: 'Fight', d: 6, prog: 2 },
      { t: 'Work', d: 5, prog: 2 },
      { t: 'Traverse', d: 4, prog: 1 },
      { t: 'Awareness', d: 3, prog: 0, scout: 1, alone: true },
    ],
  },
  WildBoar: {
    key: 'WildBoar',
    approaches: [
      { t: 'Fight', d: 8, prog: 2 },
      { t: 'Work', d: 6, prog: 2 },
      { t: 'Traverse', d: 5, prog: 1 },
    ],
  },
  Snake: {
    key: 'Snake',
    approaches: [
      { t: 'Fight', d: 3, prog: 2, exhaustOnHit: 3 },
      { t: 'Awareness', d: 2, prog: 0, scout: 1 },
      { t: 'Traverse', d: 5, prog: 0, recover: 1 },
      { t: 'Work', d: 4, prog: 1 },
    ],
  },
  Crow: {
    key: 'Crow',
    approaches: [
      { t: 'Fight', d: 4, prog: 1 },
      { t: 'Awareness', d: 5, prog: 0, finding: true },
      { t: 'Traverse', d: 5, prog: 1 },
    ],
  },
  Thicket: {
    key: 'Thicket',
    approaches: [
      { t: 'Work', d: 3, prog: 2 },
      { t: 'Traverse', d: 5, prog: 1 },
      { t: 'Fight', d: 6, prog: 0, recover: 1 },
    ],
  },
  Undergrowth: {
    key: 'Undergrowth',
    approaches: [
      { t: 'Work', d: 5, prog: 0, finding: true },
      { t: 'Traverse', d: 5, prog: 1 },
      { t: 'Fight', d: 5, prog: 1 },
    ],
  },
  FallenTree: {
    key: 'FallenTree',
    approaches: [
      { t: 'Work', d: 4, prog: 0, rations: 1 },
      { t: 'Traverse', d: 3, prog: 1 },
      { t: 'Fight', d: 5, prog: 2 },
    ],
  },
  RockySlope: {
    key: 'RockySlope',
    approaches: [
      { t: 'Traverse', d: 3, prog: 1 },
      { t: 'Traverse', d: 6, prog: 0, finding: true },
      { t: 'Work', d: 5, prog: 1 },
    ],
  },
  Stream: {
    key: 'Stream',
    approaches: [
      { t: 'Traverse', d: 4, prog: 1 },
      { t: 'Work', d: 5, prog: 0, recover: 1 },
      { t: 'Fight', d: 5, prog: 1 },
    ],
  },
  Muddy: {
    key: 'Muddy',
    approaches: [
      { t: 'Work', d: 4, prog: 2 },
      { t: 'Traverse', d: 5, prog: 0, recover: 1 },
      { t: 'Fight', d: 5, prog: 1 },
    ],
  },
  Fog: {
    key: 'Fog',
    approaches: [
      { t: 'Awareness', d: 4, prog: 0, recover: 2 },
      { t: 'Traverse', d: 5, prog: 1 },
      { t: 'Work', d: 4, prog: 1 },
    ],
  },
  Ravine: {
    key: 'Ravine',
    approaches: [
      { t: 'Traverse', d: 8, prog: 2 },
      { t: 'Work', d: 6, prog: 2 },
      { t: 'Awareness', d: 4, prog: 0, scout: 2 },
      { t: 'Fight', d: 7, prog: 0, recover: 1 },
    ],
  },
  AncientTree: {
    key: 'AncientTree',
    approaches: [
      { t: 'Traverse', d: 4, prog: 2 },
      { t: 'Awareness', d: 4, prog: 0, recover: 2 },
      { t: 'Work', d: 4, prog: 1 },
    ],
  },
  Berry: {
    key: 'Berry',
    approaches: [
      { t: 'Awareness', d: 3, prog: 0, rations: 2 },
      { t: 'Work', d: 2, prog: 0, rations: 1 },
      { t: 'Traverse', d: 4, prog: 0, rations: 1 },
      { t: 'Fight', d: 4, prog: 1 },
    ],
  },
  Tracks: {
    key: 'Tracks',
    approaches: [
      { t: 'Awareness', d: 4, prog: 0, scout: 2 },
      { t: 'Traverse', d: 5, prog: 1 },
      { t: 'Fight', d: 6, prog: 1 },
    ],
  },
  StoneMarker: {
    key: 'StoneMarker',
    approaches: [
      { t: 'Awareness', d: 5, prog: 0, finding: true },
      { t: 'Work', d: 4, prog: 1 },
      { t: 'Traverse', d: 5, prog: 1 },
    ],
  },
  Hollow: {
    key: 'Hollow',
    approaches: [
      { t: 'Awareness', d: 3, prog: 0, recover: 1 },
      { t: 'Traverse', d: 4, prog: 2 },
      { t: 'Work', d: 4, prog: 1 },
    ],
  },
  TallTree: {
    key: 'TallTree',
    approaches: [
      { t: 'Traverse', d: 4, prog: 0, scout: 2 },
      { t: 'Work', d: 4, prog: 1 },
      { t: 'Awareness', d: 3, prog: 0, recover: 1 },
    ],
  },
  Overgrown: {
    key: 'Overgrown',
    approaches: [
      { t: 'Work', d: 5, prog: 2 },
      { t: 'Fight', d: 5, prog: 0, rations: 1 },
      { t: 'Traverse', d: 4, prog: 1 },
    ],
  },
  ClearingEdge: {
    key: 'ClearingEdge',
    approaches: [
      { t: 'Awareness', d: 4, prog: 0, scout: 1 },
      { t: 'Traverse', d: 5, prog: 1 },
      { t: 'Work', d: 4, prog: 0, recover: 1 },
    ],
  },
};

function buildDeck() {
  const list = [];
  const add = (name, n) => {
    const c = CARDS[name];
    for (let i = 0; i < n; i++) list.push(structuredClone(c));
  };
  add('Wolf', 3);
  add('WildBoar', 2);
  add('Snake', 1);
  add('Crow', 1);
  add('Thicket', 1);
  add('Undergrowth', 1);
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

function countName(row, key) {
  return row.filter((x) => x.key === key).length;
}

function difficultyWithMods(card, row, approachType) {
  let d = null;
  const base = card.approaches.find((a) => a.t === approachType);
  if (!base) return null;
  d = base.d;

  const others = row.filter((c) => c !== card);
  let obs = 0;
  for (const o of others) {
    if (o.obstacle) obs += o.obstacle;
  }
  d += obs;

  if (card.key === 'Wolf' && card.grouping) {
    const w = countName(row, 'Wolf');
    if (w >= 2) d += card.grouping;
  }

  if (base.alone && countName(row, 'Wolf') !== 1) return null;

  return d;
}

function cloneTools() {
  return TOOL_LINES.map((t) => ({ ...t, left: t.uses === Infinity ? Infinity : t.uses }));
}

function pickTool(approach, tools) {
  const candidates = tools.filter((t) => t.approach === approach && t.left > 0);
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.power - a.power);
  return candidates[0];
}

function scoreChoice(prog, recover, exh, needProg) {
  const p = prog + recover * 0.35;
  const need = Math.max(0, REQUIRED - needProg);
  const bonus = need > 0 && prog > 0 ? prog * 2.2 : prog * 0.8;
  return bonus + recover * 0.4 - exh * 1.15 - (need > 3 && prog === 0 && recover === 0 ? 1.5 : 0);
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function batch(runs, toolFilter) {
  let wins = 0;
  let sumExh = 0;
  let sumSteps = 0;
  let failProg = 0;
  let failCount = 0;
  for (let i = 0; i < runs; i++) {
    const r = runOnce(mulberry32(12345 + i), toolFilter);
    if (r.win) {
      wins++;
      sumExh += r.exhaustion;
      sumSteps += r.steps;
    } else {
      failCount++;
      failProg += r.progress;
    }
  }
  return {
    runs,
    winRate: wins / runs,
    avgExhaustionOnWin: wins ? sumExh / wins : 0,
    avgStepsOnWin: wins ? sumSteps / wins : 0,
    avgProgressOnFail: failCount ? failProg / failCount : 0,
  };
}

function runOnce(rng, toolFilter) {
  let deck = shuffle(buildDeck(), rng);
  let row = [];
  let progress = 0;
  let exhaustion = 0;
  const tools = cloneTools().filter((t) => (toolFilter ? toolFilter(t) : true));
  let steps = 0;
  const maxSteps = 400;

  const refill = () => {
    while (row.length < VISION && deck.length) {
      row.push(deck.pop());
    }
  };

  refill();

  while (progress < REQUIRED && exhaustion < STAMINA && steps++ < maxSteps) {
    if (row.length === 0) {
      refill();
      if (row.length === 0) break;
    }

    const front = row[0];

    let best = null;
    let bestScore = -1e9;

    for (const ap of front.approaches) {
      const d = difficultyWithMods(front, row, ap.t);
      if (d === null) continue;
      const tool = pickTool(ap.t, tools);
      const power = tool ? tool.power : 0;
      let exh = Math.max(0, d - power);
      if (ap.exhaustOnHit && exh >= 1) exh += ap.exhaustOnHit;
      const prog = ap.prog || 0;
      const recover = ap.recover || 0;
      const sc = scoreChoice(prog, recover, exh, progress);
      if (sc > bestScore) {
        bestScore = sc;
        best = { ap, d, tool, exh, prog, recover };
      }
    }

    if (!best) {
      exhaustion = STAMINA;
      break;
    }

    if (best.tool && best.tool.left !== Infinity) best.tool.left -= 1;

    exhaustion += best.exh;
    exhaustion = Math.max(0, exhaustion - best.recover);
    progress += best.prog;
    row.shift();
    refill();
  }

  return {
    win: progress >= REQUIRED && exhaustion < STAMINA,
    progress,
    exhaustion,
    steps,
  };
}

const RUNS = 8000;
const main = batch(RUNS, null);
const noWarBlade = batch(RUNS, (t) => t.id !== 'blade_fight');

function fmt(b) {
  return {
    runs: b.runs,
    requiredProgress: REQUIRED,
    stamina: STAMINA,
    vision: VISION,
    winRate: Number(b.winRate.toFixed(4)),
    avgExhaustionOnWin: Number(b.avgExhaustionOnWin.toFixed(2)),
    avgStepsOnWin: Number(b.avgStepsOnWin.toFixed(2)),
    avgProgressOnFail: Number(b.avgProgressOnFail.toFixed(2)),
  };
}

console.log(
  JSON.stringify(
    {
      allTools: fmt(main),
      withoutWarBlade: fmt(noWarBlade),
      note: 'Greedy sim; Scout/Find ignored for progress; Penetration not modeled; Rope Traverse unlimited uses.',
    },
    null,
    2,
  ),
);
