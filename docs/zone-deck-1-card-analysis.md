# Zone Deck 1 — Card analysis (Forest Clearing)

*Generated from `cards.json` (deck `zone-deck-1`) and `docs/zone-deck-1-balance-rubric.json` at 2026-04-26T16:44:00Z. Re-run: `npm run analyze:zd1`.*

---

## 1. Point-balance system (rubric)

This is a **design aid**, not a proof of play balance. The script copies numbers from `docs/zone-deck-1-balance-rubric.json` into this document; **edit the JSON** to retune, then run `npm run analyze:zd1`.

### Difficulty

| Item | Cost / weight |
| --- | ---: |
| Each point of row **Difficulty** | 1 |

### Outcome rewards

| Token | Points (regex on outcome + sub-effect line) |
| --- | ---: |
| `Progress X` | 3 × X |
| `Find FX` | 7 + 0×X |
| `Vision +X` | 2 × X |
| `Recovery X` | 2.5 × X |
| `Rations X` | 2 × X |
| `Scout X` | 3 × X |
| `Reveal +X` | 2 × X |
| `Ongoing N` (band marker) | 2 each |
| `Guidance X` | 1.5 × X |
| `Prepare X` | 1.5 × X |
| `Power +X` (excludes “…for the next”) | 2 × X |
| `+…Power for the next Approach` | 2 × amount |
| `Traverse Power +X` | 1 × X |

### Outcome costs (negative payout)

| Token | Points |
| --- | ---: |
| `Exhaust X` | -2 × X |
| `Use Rations X` | -1.5 × X |
| `Dread X` (in outcomes or sub-line) | -1.5 × X |

### Row modifiers

| Situation | Points |
| --- | ---: |
| Row has a **condition** (e.g. only when alone) | -0.5 |
| Row has a **subEffect** line | 0.5 |

### Field keywords (hazard, subtracts from card total)

Only text on the **field / While Revealed** block. Total hazard is multiplied by **1.5** and **subtracted** from the card’s line sum.

| Keyword | Weight per rank (into hazard) |
| --- | ---: |
| **Dread** | 1 |
| **Obstacle** | 1 |
| **Covering** | 0.75 |
| **Blocking** | 1 |
| **Grouping** | 0.5 |
| **Charging** | 0.25 |
| **Difficulty_to_self** | 0.5 |

### How to read the per-card table

- **Line sum / avg** — for each row: *payout + outcome costs − difficulty* (plus row modifiers); summed for the card.
- **Field adj** — negative when the **revealed** field line carries global keywords (Dread, Obstacle, etc.).
- **Total** — line sum + field adj. **Z** = how many **σ** this card is above/below the deck mean on *Total*.
- **Band** — `lo` = below about mean−0.6σ; `hi` = above about mean+0.6σ (tunable in JSON `interpretation`).

---

## 2. Approach use (per approach row)

Unique challenge cards: **23**. Counts are **rows** (a card with 3 approaches → 3).

| Approach | Row count | Share |
| --- | ---: | ---: |
| Fight | 6 | 10.7% |
| Work | 8 | 14.3% |
| Traverse | 22 | 39.3% |
| Awareness | 20 | 35.7% |
| other | 0 | 0.0% |
| **Total** | **56** | **100%** |

---

## 3. Effect and keyword frequency

Matches in **outcomes**, **subEffect**, and **fieldEffect** for Zone Deck 1 challenge cards. Some tokens appear in more than one of those, so this is a **content frequency** count, not “per card without double-counting”.

| Token / keyword | Count |
| --- | ---: |
| Progress 2 | 14 |
| Ongoing (band) | 8 |
| Progress 1 | 8 |
| Progress 3 | 6 |
| Vision +1 | 6 |
| Rations 1 | 5 |
| Recovery 1 | 5 |
| Guidance 2 | 4 |
| Charging 1 | 3 |
| Grouping 2 | 3 |
| Obstacle 1 | 3 |
| Vision +2 | 3 |
| Dread 1 | 2 |
| Guidance 1 | 2 |
| Prepare 2 | 2 |
| Recovery 2 | 2 |
| Blocking 1 | 1 |
| Covering 2 | 1 |
| Dread 2 | 1 |
| Exhaust 3 | 1 |
| Find F1 | 1 |
| Find F2 | 1 |
| Find F3 | 1 |
| Find F4 | 1 |
| Rations 2 | 1 |
| Recovery 3 | 1 |
| Recovery 4 | 1 |

---

## 4. Per-challenge card economy (balance pass)

| ID | Name | #rows | Line sum | Line avg | Field hazard | Field adj | **Total** | Z | Band |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| ZD1_ANCIENT_TREE | Ancient Tree | 2 | 20.00 | 10.00 | 0.00 | 0.00 | **20.00** | 2.99 | hi |
| ZD1_BERRY_BUSHES | Berry Bushes | 3 | -1.00 | -0.33 | 0.00 | 0.00 | **-1.00** | -0.58 | mid |
| ZD1_CLEARINGS_EDGE | Clearing's Edge | 2 | 0.00 | 0.00 | 0.00 | 0.00 | **0.00** | -0.41 | mid |
| ZD1_CROW_FLOCK | Crow Flock | 3 | 0.50 | 0.17 | 1.50 | -2.25 | **-1.75** | -0.70 | lo |
| ZD1_DENSE_UNDERGROWTH | Dense Undergrowth | 2 | 1.00 | 0.50 | 1.00 | -1.50 | **-0.50** | -0.49 | mid |
| ZD1_FALLEN_TREE | Fallen Tree | 3 | -1.50 | -0.50 | 0.00 | 0.00 | **-1.50** | -0.66 | lo |
| ZD1_FOG_PATCH | Fog Patch | 2 | -2.00 | -1.00 | 1.50 | -2.25 | **-4.25** | -1.13 | lo |
| ZD1_HIDDEN_HOLLOW | Hidden Hollow | 2 | 17.50 | 8.75 | 0.00 | 0.00 | **17.50** | 2.57 | hi |
| ZD1_MUDDY_GROUND | Muddy Ground | 2 | 1.50 | 0.75 | 1.00 | -1.50 | **0.00** | -0.41 | mid |
| ZD1_OVERGROWN_PATH | Overgrown Path | 2 | 1.00 | 0.50 | 1.00 | -1.50 | **-0.50** | -0.49 | mid |
| ZD1_ROCKY_SLOPE | Rocky Slope | 3 | 1.50 | 0.50 | 0.00 | 0.00 | **1.50** | -0.15 | mid |
| ZD1_RUSHING_STREAM | Rushing Stream | 3 | 2.00 | 0.67 | 0.00 | 0.00 | **2.00** | -0.07 | mid |
| ZD1_STEEP_RAVINE | Steep Ravine | 3 | 1.50 | 0.50 | 0.00 | 0.00 | **1.50** | -0.15 | mid |
| ZD1_STONE_MARKER | Stone Marker | 2 | 0.00 | 0.00 | 0.00 | 0.00 | **0.00** | -0.41 | mid |
| ZD1_STRANGE_TRACKS | Strange Tracks | 2 | 0.00 | 0.00 | 1.50 | -2.25 | **-2.25** | -0.79 | lo |
| ZD1_TALL_TREE | Tall Tree | 2 | 8.50 | 4.25 | 0.00 | 0.00 | **8.50** | 1.04 | hi |
| ZD1_THORNY_THICKET | Thorny Thicket | 2 | 0.00 | 0.00 | 1.00 | -1.50 | **-1.50** | -0.66 | lo |
| ZD1_VENOMOUS_SNAKE | Venomous Snake | 3 | 5.50 | 1.83 | 0.25 | -0.38 | **5.13** | 0.46 | mid |
| ZD1_WILD_BOAR_1 | Wild Boar | 2 | 2.00 | 1.00 | 1.25 | -1.88 | **0.13** | -0.39 | mid |
| ZD1_WILD_BOAR_2 | Wild Boar | 2 | 2.00 | 1.00 | 1.25 | -1.88 | **0.13** | -0.39 | mid |
| ZD1_WOLF_1 | Wolf | 3 | 5.50 | 1.83 | 1.00 | -1.50 | **4.00** | 0.27 | mid |
| ZD1_WOLF_2 | Wolf | 3 | 5.50 | 1.83 | 1.00 | -1.50 | **4.00** | 0.27 | mid |
| ZD1_WOLF_3 | Wolf | 3 | 5.50 | 1.83 | 1.00 | -1.50 | **4.00** | 0.27 | mid |

**Deck mean (Total):** 2.397 · **σ:** 5.883

---

## 5. Notes

- **Band** is a coarse label from this model; use it to spot outliers, not as a final play verdict.
- **Flavor** is not scored. Ongoing on the field line still contributes via keyword matches in §3, while §1 scoring uses the rubric in JSON.
- New outcome phrases: extend `parseOutcomePayouts` / `parseOutcomeCosts` in `scripts/zone-deck-1-analysis.mjs` and add weights to the rubric file.
