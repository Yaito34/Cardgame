/**
 * Regenerates docs/zone-deck-1-card-analysis.md from cards.json and
 * docs/zone-deck-1-balance-rubric.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CARDS = path.join(ROOT, "cards.json");
const RUBRIC = path.join(ROOT, "docs", "zone-deck-1-balance-rubric.json");
const OUT = path.join(ROOT, "docs", "zone-deck-1-card-analysis.md");

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function mean(a) {
  if (!a.length) return 0;
  return a.reduce((s, x) => s + x, 0) / a.length;
}

function stdev(a) {
  if (a.length < 2) return 0;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1));
}

function z(x, m, s) {
  if (!s) return 0;
  return (x - m) / s;
}

function norm(s) {
  return (s || "").replace(/\r/g, "\n");
}

function forEachMatch(blob, re, onMatch) {
  const g = new RegExp(re, "g");
  let m;
  while ((m = g.exec(blob)) !== null) onMatch(m);
}

function parseOutcomePayouts(blob, rub) {
  const o = rub.outcome_payouts;
  let p = 0;
  forEachMatch(blob, /Progress (\d+)/g, (m) => {
    p += o.Progress * +m[1];
  });
  forEachMatch(blob, /Find F(\d+)/g, (m) => {
    p += o.FindF_base + o.FindF_per_tier * +m[1];
  });
  forEachMatch(blob, /Vision \+(\d+)/g, (m) => {
    p += o.Vision * +m[1];
  });
  forEachMatch(blob, /Recovery (\d+)/g, (m) => {
    p += o.Recovery * +m[1];
  });
  forEachMatch(blob, /Rations (\d+)/g, (m) => {
    p += o.Rations * +m[1];
  });
  forEachMatch(blob, /Scout (\d+)/g, (m) => {
    p += o.Scout * +m[1];
  });
  forEachMatch(blob, /Reveal \+(\d+)/g, (m) => {
    p += o.RevealPlus * +m[1];
  });
  forEachMatch(blob, /Ongoing (\d+)/g, () => {
    p += o.Ongoing;
  });
  forEachMatch(blob, /Guidance (\d+)/g, (m) => {
    p += o.Guidance * +m[1];
  });
  forEachMatch(blob, /Prepare (\d+)/g, (m) => {
    p += o.Prepare * +m[1];
  });
  forEachMatch(blob, /Power \+(\d+)(?!\s*for the next)/g, (m) => {
    p += o.Power_on_next * +m[1];
  });
  forEachMatch(
    blob,
    /(\+2 Power for the next Approach|\+2 Power for the next|Power \+(\d+) for the next)/g,
    (m) => {
      const n = m[2] != null ? +m[2] : 2;
      p += o.Power_on_next * n;
    }
  );
  forEachMatch(blob, /Traverse Power \+(\d+)/g, (m) => {
    p += o.Traverse_power * +m[1];
  });
  return p;
}

function parseOutcomeCosts(blob, rub) {
  const c = rub.outcome_costs;
  let p = 0;
  forEachMatch(blob, /\[1\+\]\s*Exhaust (\d+)|Exhaust (\d+)/g, (m) => {
    const n = +(m[1] || m[2]);
    p += c.Exhaust * n;
  });
  forEachMatch(blob, /Use Rations (\d+)/g, (m) => {
    p += c.UseRations * +m[1];
  });
  forEachMatch(blob, /Dread (\d+)/g, (m) => {
    p += c.Dread_token * +m[1];
  });
  return p;
}

/** Keyword hazard from While Revealed / field only (not row outcomes). */
function fieldHazardScore(fieldBlob, rub) {
  if (!fieldBlob) return 0;
  const t = fieldBlob;
  const fk = rub.field_keywords;
  let h = 0;
  forEachMatch(t, /Dread (\d+)/g, (m) => {
    h += +m[1] * fk.Dread.per_rank_toward_player_hazard;
  });
  forEachMatch(t, /Obstacle (\d+)/g, (m) => {
    h += +m[1] * fk.Obstacle.per_rank_global_penalty;
  });
  forEachMatch(t, /Covering (\d+)/g, (m) => {
    h += +m[1] * fk.Covering.per_rank_toward_next;
  });
  forEachMatch(t, /Blocking (\d+)/g, (m) => {
    h += +m[1] * fk.Blocking.per_rank;
  });
  forEachMatch(t, /Grouping (\d+)/g, (m) => {
    h += +m[1] * fk.Grouping.per_rank;
  });
  forEachMatch(t, /Charging (\d+)/g, (m) => {
    h += +m[1] * fk.Charging.per_stack;
  });
  forEachMatch(t, /Difficulty \+(\d+)/g, (m) => {
    h += +m[1] * fk.Difficulty_to_self.per_plus;
  });
  return h;
}

function lineEconomy(approach, rub) {
  const diff = +approach.difficulty || 0;
  const out = norm(approach.outcomes || "");
  const sub = norm(approach.subEffect || "");
  const full = [out, sub].filter(Boolean).join(" | ");
  const pay = parseOutcomePayouts(full, rub);
  const cost = parseOutcomeCosts(full, rub);
  const D = rub.difficulty.per_point_cost_to_player;
  let e = pay + cost - diff * D;
  if (approach.condition) e += rub.modifiers.row_has_condition;
  if (sub.trim()) e += rub.modifiers.subeffect_line_present;
  return { e, pay, cost, diff, full };
}

function cardEconomy(ch, rub) {
  const field = ch.fieldEffect ? norm(ch.fieldEffect) : "";
  const lines = (ch.approaches || []).map((a) => lineEconomy(a, rub));
  const lineSum = lines.reduce((s, x) => s + x.e, 0);
  const lineAvg = lines.length ? lineSum / lines.length : 0;
  const fieldH = fieldHazardScore(field, rub);
  const fieldAdj = -fieldH * (rub.modifiers.field_effect_hazard_per_rank ?? 1.5);
  const total = lineSum + fieldAdj;
  return {
    lineSum,
    lineAvg,
    nLines: lines.length,
    lineRows: lines,
    fieldH,
    fieldAdj,
    total,
  };
}

function countApproach(deck) {
  const c = { Fight: 0, Craft: 0, Traverse: 0, Awareness: 0, other: 0 };
  for (const ch of deck.cards) {
    if (ch.type !== "challenge") continue;
    for (const a of ch.approaches || []) {
      const t = a.type;
      if (c[t] != null) c[t]++;
      else c.other++;
    }
  }
  return c;
}

function countTokens(deck) {
  const m = new Map();
  const add = (k, n = 1) => m.set(k, (m.get(k) || 0) + n);

  const collect = (blob) => {
    const t = norm(blob);
    forEachMatch(t, /Progress (\d+)/g, (r) => add(`Progress ${r[1]}`));
    forEachMatch(t, /Find F(\d+)/g, (r) => add(`Find F${r[1]}`));
    forEachMatch(t, /Vision \+(\d+)/g, (r) => add(`Vision +${r[1]}`));
    forEachMatch(t, /Recovery (\d+)/g, (r) => add(`Recovery ${r[1]}`));
    forEachMatch(t, /Rations (\d+)/g, (r) => add(`Rations ${r[1]}`));
    forEachMatch(t, /Exhaust (\d+)/g, (r) => add(`Exhaust ${r[1]}`));
    forEachMatch(t, /Scout (\d+)/g, (r) => add(`Scout ${r[1]}`));
    forEachMatch(t, /Dread (\d+)/g, (r) => add(`Dread ${r[1]}`));
    forEachMatch(t, /Obstacle (\d+)/g, (r) => add(`Obstacle ${r[1]}`));
    forEachMatch(t, /Covering (\d+)/g, (r) => add(`Covering ${r[1]}`));
    forEachMatch(t, /Blocking (\d+)/g, (r) => add(`Blocking ${r[1]}`));
    forEachMatch(t, /Grouping (\d+)/g, (r) => add(`Grouping ${r[1]}`));
    forEachMatch(t, /Charging (\d+)/g, (r) => add(`Charging ${r[1]}`));
    forEachMatch(t, /Guidance (\d+)/g, (r) => add(`Guidance ${r[1]}`));
    forEachMatch(t, /Prepare (\d+)/g, (r) => add(`Prepare ${r[1]}`));
    forEachMatch(t, /Ongoing (\d+)/g, () => add(`Ongoing (band)`));
  };

  for (const ch of deck.cards) {
    if (ch.type !== "challenge") continue;
    for (const a of ch.approaches || []) {
      collect(a.outcomes);
      collect(a.subEffect);
    }
    if (ch.fieldEffect) collect(ch.fieldEffect);
  }
  return m;
}

function formatMapSorted(m) {
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([k, v]) => `| ${k} | ${v} |`);
}

function nowIso() {
  return new Date().toISOString().slice(0, 19) + "Z";
}

function buildRubricSection(rub) {
  const s = [];
  s.push(`## 1. Point-balance system (rubric)`);
  s.push(``);
  s.push(
    `This is a **design aid**, not a proof of play balance. The script copies numbers from \`docs/zone-deck-1-balance-rubric.json\` into this document; **edit the JSON** to retune, then run \`npm run analyze:zd1\`.`
  );
  s.push(``);
  s.push(`### Difficulty`, ``);
  s.push(`| Item | Cost / weight |`);
  s.push(`| --- | ---: |`);
  s.push(
    `| Each point of row **Difficulty** | ${rub.difficulty.per_point_cost_to_player} |`
  );
  s.push(``);
  s.push(`### Outcome rewards`, ``);
  s.push(
    `| Token | Points (regex on outcome + sub-effect line) |`
  );
  s.push(`| --- | ---: |`);
  s.push(
    `| \`Progress X\` | ${rub.outcome_payouts.Progress} × X |`
  );
  s.push(
    `| \`Find FX\` | ${rub.outcome_payouts.FindF_base} + ${rub.outcome_payouts.FindF_per_tier}×X |`
  );
  s.push(
    `| \`Vision +X\` | ${rub.outcome_payouts.Vision} × X |`
  );
  s.push(
    `| \`Recovery X\` | ${rub.outcome_payouts.Recovery} × X |`
  );
  s.push(
    `| \`Rations X\` | ${rub.outcome_payouts.Rations} × X |`
  );
  s.push(
    `| \`Scout X\` | ${rub.outcome_payouts.Scout} × X |`
  );
  s.push(
    `| \`Reveal +X\` | ${rub.outcome_payouts.RevealPlus} × X |`
  );
  s.push(
    `| \`Ongoing N\` (band marker) | ${rub.outcome_payouts.Ongoing} each |`
  );
  s.push(
    `| \`Guidance X\` | ${rub.outcome_payouts.Guidance} × X |`
  );
  s.push(
    `| \`Prepare X\` | ${rub.outcome_payouts.Prepare} × X |`
  );
  s.push(
    `| \`Power +X\` (excludes “…for the next”) | ${rub.outcome_payouts.Power_on_next} × X |`
  );
  s.push(
    `| \`+…Power for the next Approach\` | ${rub.outcome_payouts.Power_on_next} × amount |`
  );
  s.push(
    `| \`Traverse Power +X\` | ${rub.outcome_payouts.Traverse_power} × X |`
  );
  s.push(``);
  s.push(`### Outcome costs (negative payout)`, ``);
  s.push(`| Token | Points |`);
  s.push(`| --- | ---: |`);
  s.push(
    `| \`Exhaust X\` | ${rub.outcome_costs.Exhaust} × X |`
  );
  s.push(
    `| \`Use Rations X\` | ${rub.outcome_costs.UseRations} × X |`
  );
  s.push(
    `| \`Dread X\` (in outcomes or sub-line) | ${rub.outcome_costs.Dread_token} × X |`
  );
  s.push(``);
  s.push(`### Row modifiers`, ``);
  s.push(`| Situation | Points |`);
  s.push(`| --- | ---: |`);
  s.push(
    `| Row has a **condition** (e.g. only when alone) | ${rub.modifiers.row_has_condition} |`
  );
  s.push(
    `| Row has a **subEffect** line | ${rub.modifiers.subeffect_line_present} |`
  );
  s.push(``);
  s.push(`### Field keywords (hazard, subtracts from card total)`, ``);
  s.push(
    `Only text on the **field / While Revealed** block. Total hazard is multiplied by **${rub.modifiers.field_effect_hazard_per_rank}** and **subtracted** from the card’s line sum.`
  );
  s.push(``);
  s.push(`| Keyword | Weight per rank (into hazard) |`);
  s.push(`| --- | ---: |`);
  for (const [kw, o] of Object.entries(rub.field_keywords)) {
    const w = o[Object.keys(o)[0]];
    s.push(`| **${kw}** | ${w} |`);
  }
  s.push(``);
  s.push(`### How to read the per-card table`, ``);
  s.push(
    `- **Line sum / avg** — for each row: *payout + outcome costs − difficulty* (plus row modifiers); summed for the card.`
  );
  s.push(
    `- **Field adj** — negative when the **revealed** field line carries global keywords (Dread, Obstacle, etc.).`
  );
  s.push(
    `- **Total** — line sum + field adj. **Z** = how many **σ** this card is above/below the deck mean on *Total*.`
  );
  s.push(
    `- **Band** — \`lo\` = below about mean−0.6σ; \`hi\` = above about mean+0.6σ (tunable in JSON \`interpretation\`).`
  );
  s.push(``);
  s.push(`---`);
  s.push(``);
  return s;
}

function main() {
  const data = loadJson(CARDS);
  const rub = loadJson(RUBRIC);
  const deck = data.decks.find((d) => d.id === "zone-deck-1");
  if (!deck) {
    console.error("zone-deck-1 not found in cards.json");
    process.exit(1);
  }

  const appr = countApproach(deck);
  const totAppr = Object.values(appr).reduce((s, n) => s + n, 0);
  const effectCounts = countTokens(deck);

  const rows = [];
  for (const ch of deck.cards) {
    if (ch.type !== "challenge") continue;
    rows.push({ ch, ec: cardEconomy(ch, rub) });
  }
  const totals = rows.map((r) => r.ec.total);
  const mu = mean(totals);
  const sig = stdev(totals);

  const out = [];
  out.push(`# Zone Deck 1 — Card analysis (Forest Clearing)`);
  out.push(``);
  out.push(
    `*Generated from \`cards.json\` (deck \`zone-deck-1\`) and \`docs/zone-deck-1-balance-rubric.json\` at ${nowIso()}. Re-run: \`npm run analyze:zd1\`.*`
  );
  out.push(``);
  out.push(`---`);
  out.push(``);
  out.push(...buildRubricSection(rub));

  out.push(`## 2. Approach use (per approach row)`);
  out.push(``);
  out.push(
    `Unique challenge cards: **${deck.cards.filter((c) => c.type === "challenge").length}**. Counts are **rows** (a card with 3 approaches → 3).`
  );
  out.push(``);
  out.push(`| Approach | Row count | Share |`);
  out.push(`| --- | ---: | ---: |`);
  for (const k of ["Fight", "Craft", "Traverse", "Awareness", "other"]) {
    const n = appr[k];
    out.push(
      `| ${k} | ${n} | ${totAppr ? ((100 * n) / totAppr).toFixed(1) : "0.0"}% |`
    );
  }
  out.push(
    `| **Total** | **${totAppr}** | **100%** |`,
    ``,
    `---`,
    ``
  );

  out.push(`## 3. Effect and keyword frequency`);
  out.push(``);
  out.push(
    `Matches in **outcomes**, **subEffect**, and **fieldEffect** for Zone Deck 1 challenge cards. Some tokens appear in more than one of those, so this is a **content frequency** count, not “per card without double-counting”.`
  );
  out.push(``);
  out.push(`| Token / keyword | Count |`);
  out.push(`| --- | ---: |`);
  out.push(...formatMapSorted(effectCounts));
  out.push(``);
  out.push(`---`);
  out.push(``);
  out.push(`## 4. Per-challenge card economy (balance pass)`);
  out.push(``);
  out.push(
    `| ID | Name | #rows | Line sum | Line avg | Field hazard | Field adj | **Total** | Z | Band |`
  );
  out.push(
    `| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |`
  );
  for (const { ch, ec } of rows.sort((a, b) => a.ch.id.localeCompare(b.ch.id))) {
    const zv = z(ec.total, mu, sig);
    let band = "mid";
    if (zv < -0.6) band = "lo";
    if (zv > 0.6) band = "hi";
    out.push(
      `| ${ch.id} | ${ch.name} | ${ec.nLines} | ${ec.lineSum.toFixed(2)} | ${ec.lineAvg.toFixed(2)} | ${ec.fieldH.toFixed(2)} | ${ec.fieldAdj.toFixed(2)} | **${ec.total.toFixed(2)}** | ${zv.toFixed(2)} | ${band} |`
    );
  }
  out.push(``);
  out.push(`**Deck mean (Total):** ${mu.toFixed(3)} · **σ:** ${sig.toFixed(3)}`);
  out.push(``);
  out.push(`---`);
  out.push(``);
  out.push(`## 5. Notes`, ``);
  out.push(
    `- **Band** is a coarse label from this model; use it to spot outliers, not as a final play verdict.`
  );
  out.push(
    `- **Flavor** is not scored. Ongoing on the field line still contributes via keyword matches in §3, while §1 scoring uses the rubric in JSON.`
  );
  out.push(
    `- New outcome phrases: extend \`parseOutcomePayouts\` / \`parseOutcomeCosts\` in \`scripts/zone-deck-1-analysis.mjs\` and add weights to the rubric file.`
  );
  out.push(``);

  fs.writeFileSync(OUT, out.join("\n"), "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUT)}`);
}

main();
