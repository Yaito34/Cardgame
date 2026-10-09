# Challenge Design Guide

Guideline for designing **challenge cards** and whole **zone decks** for the current playtest. Rules and effect meanings live in **`CurrentRulesDesign.md`**. Top-level aims: **`docs/design-goals.md`**. This file is design advice only.

**Defaults to assume**

- Each player has their **own challenge track**. Effects apply to **that player and that track** unless card text says otherwise.
- Path length is a finite Challenge Deck. Every card must be overcome.
- Pressure is **Stamina boxes → overflow Damage (garb or body slot)**. Soft gates are **Rations**, **First Aid**, **Retreat**, and **Danger**. **Repair** and **Heal** wait for a settlement. Damaged garb/slots are not lost. Tools are a mode and do not spend Uses.
- Use **Action** (not Approach): Fight, Work, Traverse, Awareness.
- **Repeatable obstacles only:** Zone challenges must be things you can stumble into **more than once**. The path is a random draw, so names should work as recurring hazard types (Broken Floor, Rotting Arch, Rubble Block) — not unique set-piece rooms you would only ever meet once (“the Mirror Maze,” “the King’s Crypt”). Unique places belong in the **Travel Book** / **Discovery Book**, not the zone deck.
- **Easy names:** Challenge titles should be **easy to picture in one glance** — plain words like Broken Floor, Falling Stone, Jammed Door. Prefer `[What broke] + [Where]`. Save fancy architecture words (vault ribs, keystone, gallery) for optional flavor text, not the card name. If a non-native speaker needs the title explained, rename it.
- **Solo-facing fiction:** Every challenge must make sense when **one player** faces it on their own track. Do not use party-scale weather or table-wide scenes as normal zone cards (e.g. Rain, a siege of the whole keep, “the group camps together”). Those need a different system. Prefer obstacles and foes one explorer can meet alone. **Heat / Cold** belong on Travel Book **In this Area** lines (garb **Warm** / **Cool**). **Sneak / noise** is a **Traverse** challenge action, not a weather or noise meter. Doll notes: **`docs/garb-doll.md`**.

---

## Design process (zone → cards)

Work in this order. Do not invent many unique cards before the zone identity and base templates are solid.

### 0. Overall zone overview

Before picking topics, write a short **zone brief**:

| Field | Fill in |
|---|---|
| **Fantasy one-liner** | e.g. “Sunken keep: undead wardens + crumbling stone + lost expedition leftovers.” |
| **Highlights (strong / common)** | What this zone *is known for* — effects and rewards players will see often |
| **Weak effects (scarce / rare)** | What this zone *does not* give freely — so other zones can own that fantasy later |
| **Main pressure** | How the zone hurts (On Reveal Exhaust, Danger, Blocking, pack Grouping, …) |
| **Main payoff** | What you come here for (Materials, Search / Recipe-Tools, Scout, Recovery, Spirit, …) |

**Example sketch**

- **Highlights:** Blocking / Covering, On Reveal Exhaust, Materials, Scout, Danger on undead  
- **Weak / scarce:** Rations, easy Recovery, forage-style Work payouts  

This brief drives every later choice. If a card wants lots of Rations in a “scarce Rations” zone, cut or move that reward.

---

### 1. Define 2–3 main topics

Pick **two or three** topics that carry the zone (not a kitchen-sink list).

Examples: Skeletons · Treacherous dungeon environment (Broken Floor, Rotting Arch, Rubble Block, …)  

For each topic note:

- Fiction role in the zone  
- Which Actions it naturally owns  
- Whether it typically carries **Danger**, **Blocking**, packs, traps, etc.
- That every card under the topic is a **repeatable type**, not a one-off named room  
- That a single explorer can face it alone on their track  

---

### 2. Design a base challenge per topic

Build one **base card** that all variants of that topic can grow from.

```markdown
## Skeleton [BASE]
While Revealed ▸ Danger
---
- [F] Fight : Materials / Spirit — and a **named source** other recipes may tick (`Skeleton Archers`)
- [T] Outmaneuver : Reveal (empty clear is fine on weak variants)
- [A] Release Contract : Buffs / Scout / Recovery / Rations / Spirit / sometimes **Search** (`Find Discovery T0X`)
---
```

See **`dungeon-cards.md`** Topic · Skeletons for the full Sunken Keep base + variant power spread.

**Danger timing** follows the fiction. Print **While Revealed ▸ Danger** when the threat is already on you from any slot (wolf, archer, guard, captain). The card shows **Danger !**. Print **While Close ▸ Danger** when it only matters in reach (bear, spearman). The card shows **Close Danger !**. Danger blocks rations, First Aid, Switch Active, Repack, and Retreat. It does not block a Fight, including a ranged line.

**Charge** (`On Reveal ▸ Charge`) is for something that closes an open gap: a wolf, a boar. On reveal, if the space ahead is empty, it steps one space forward. **Prepare 1 > Exhaust X** is for a strike you can only stop with range: a snake, crows, an archer. After you overcome one challenge, if it is still one space out, it Exhausts. A ranged tool used on that challenge prevents it. The card prints `Prepare 1 > Exhaust X !`.

### Environment bases (under one Environment topic)

A zone’s Environment topic may use **one or more** of these subtypes. Each subtype is its own base Action family (shared [W]/[T]/[A]; Power and outcomes vary by card). **Sunken Keep uses Obstacle, Blocked Path, and Natural Decay Trap** (all three), with **natural decay traps only** (no man-made traps) — see **`dungeon-cards.md`** Topic · Environment. Add **Side Branch** when the zone wants optional dead-end pockets (cracks, alcoves, forage spurs); it is optional, not required for every zone.

**Materials polarity:** Obstacle and Decay Trap [W] often **spend** Materials (build / stabilize). Blocked Path [W] often **gains** Materials (break debris). Keep that contrast sharp. Side Branch Detour lines chase **Search** (`Find Discovery T0X` → Search pile, **claim at stretch end, no roll**), not Materials economy.

#### Base · Obstacle (gap / shaft / failing arch)

```markdown
## Obstacle [BASE]
---
- [W] Build Path : spend Materials / prepare crossing
- [T] Climb :
- [A] Find Easy Path : Scout / Reveal / Prepare Traverse
---
```

Fiction check: Work tools shore or bridge; Traverse crosses the gap; Awareness finds an easier line. Fight usually does not belong.

#### Base · Blocked Path (rubble, boards, decay seal)

```markdown
## Blocked Path [BASE]
---
- [W] Clear Block : +Materials (debris)
- [T] Go Around : empty or Reveal +X (long detour)
- [A] Find Opening : Scout / Reveal / Find / Prepare
---
```

Fiction check: Work breaks or forces the block; Traverse squeezes or detours; Awareness finds a gap or what lies past it.

#### Base · Natural Decay Trap (unstable floor/ceiling, grit, spores)

```markdown
## Natural Decay Trap [BASE]
---
- [W] Stabilize : spend Materials
- [T] Move Through : risky / empty or soft negative
- [A] Find Safe Path : Scout / Prepare / Recovery / small loot
---
```

Fiction check: Work shores the hazard; Traverse pushes through risk; Awareness picks a safer route. Prefer On Reveal / While Close Exhaust and Covering. Leave **Danger** mostly to creature topics unless collapse truly locks retreat. Do **not** use man-made traps (arrow slits, deliberate spike pits) in a decay-themed dungeon like Sunken Keep.

#### Base · Side Branch (optional detour / dead end)

**Map branching** (choose which Area to travel toward next) belongs in the **Travel Book / Discovery Book**, not on zone cards.

Use a **Side Branch** challenge only for a **short dead-end spur** off the current path. The structure is the same in every zone (dungeon, forest, ruins, …) — only the fiction changes.

**Shared for all Side Branches**

- **Continue Past** prints **Detour**. That overcome does not count toward progress. The enter / search line does not print Detour, so it counts.
- **Pass:** Power **0** free clear (Body; no tool) — walk on, no spur benefit.
- **Exactly two main options** by default (Pass + one spur line). Do **not** stack Find + Rest on the same card at first.
- Repeatable **type**, not a unique named room. Solo-facing fiction.

Pick **one** spur family per card:

| Family | Spur line | Player question |
|---|---|---|
| **Find Detour** | Pay to **Search** (`Find Discovery T0X`) | Skip vs greed |
| **Rest Detour** | Pay (Action / risk) to unlock mid-path **Camp-rate Rest** | Skip vs heal |

---

##### Find Detour

| Option | What the player knows | What happens |
|---|---|---|
| **1. Pass** | Stay on the main path | Power **0** free clear |
| **2. Detour** | Enter the spur you can see | Costlier Action — **Find Discovery T0X** (challenge goes to **Search pile**; claim at stretch end, **no roll**) |

**Visible vs hidden:** Place is visible. You do **not** take the Recipe/Tool during the path. At stretch end you **claim** the packet card if unclaimed (**no roll**). The recipe face is public **after** that claim; the finished Tool face stays hidden until assembled.

```markdown
## Find Detour [BASE]
---
- [—] 0 Continue Past : Detour
- [W] / [A] Enter the Spur : Find Discovery T0X
---
```

**Detour Search** overcomes onto the Search pile (the spur is cleared). **Continue Past** discards with no Search.

| Fiction | Pass | Detour |
|---|---|---|
| Crack → small chamber | Continue Past (0) | Force the Crack : Find Discovery T01 |
| Rubble alcove | Continue Past (0) | Search the Piles : Find Discovery T02 |
| Sealed niche | Continue Past (0) | Break the Seal : Find Discovery T03 |

---

##### Rest Detour (on-path rest)

Mid-path you normally only spend Rations at the **trail** rate (+2). A revealed **Danger** blocks that spend. A Rest Detour lets you spend Rations at the **Camp** rate (**+4 Stamina** each) — but only after you pay a fiction-fitting cost to make the spot safe enough to rest.

| Option | Advantage | Disadvantage |
|---|---|---|
| **Pass** | Free clear; no skill needed | No Camp-rate Rest |
| **Secure / Rest** | May spend Rations at **+4 Stamina** each, then clear | Must meet the printed Action (Power / Exhaustion / spend) — climb, barricade, keep watch, etc. |

**Rest outcome (standard):** After successfully resolving the Secure line, the player may spend any number of Rations at **+4 Stamina** each (Landmark Camp rate; Rest modifiers on Landmarks do not apply unless the card says so). That Action **overcomes** the challenge (spur used as a rest stop).

**Cost fiction varies by card** — pick the Action that makes the rest feel earned:

| Fiction | Secure / Rest line (examples) |
|---|---|
| Quiet hollow / overlook | `[A] 4 Keep Watch : Rest (Rations +4 each)` |
| Tall tree / ridge | `[T] 5 Climb to a Safe Limb : Rest (Rations +4 each)` |
| Ruin chamber | `[W] 5 Barricade the Door : Rest (Rations +4 each)` |
| Beast country | `[F] 6 Drive Off Scavengers : Rest (Rations +4 each)` — rare; prefer A/T/W |

```markdown
## Rest Detour [BASE]
---
- [—] 0 Continue Past : Detour
- [A] / [T] / [W] N Secure the Spot : Rest (Rations +4 each)
---
```

**Design checks**

- Pass stays Power **0** — walking on never needs “rest gear.”
- Secure Power should hurt a little (typical **3–6**); if Rest is free after a trivial line, everyone always Rests.
- Optional sting: if the Secure line deals Exhaustion from Power miss, you may still Rest, or print “Rest only if this line dealt no Exhaustion” for stricter cards.
- Do **not** also print Find Discovery on the same Rest Detour until Find Detours are proven scarce and clear.
- **Zone mix:** Rest Detours even scarcer than Find Detours (**~0–1 per zone**). Landmark Camp stays the real rest hub; this is an emergency / lucky spur.

**Theme examples**

| Card idea | Pass | Secure / Rest |
|---|---|---|
| Quiet Hollow | Continue Past | Keep Watch (Awareness) : Rest +4 |
| Climbable Oak | Continue Past | Climb to a Safe Limb (Traverse) : Rest +4 |
| Side Chamber | Continue Past | Barricade the Door (Work) : Rest +4 |

---

**Zone mix (Side Branches overall):** Keep all Detours **scarce** (~1–3 Find + at most one Rest per zone). The free Pass prints **Detour**, so it does not count toward progress.

#### Action fiction check (required)

Every Action on the base card must fit the challenge idea so that **tools used for that Action make sense** against this fiction.

Ask for each line:

- Why does a Fight tool work here?  
- Why does Traverse / Outmaneuver work?  
- Why does Awareness / Release Contract work?  
- Would a Work tool feel silly or wrong? If yes, don’t print Work on this base.

If an Action only works for one weird variant, it does **not** belong on the shared base — add it only on that variant later.

#### Theme-typical effects

List effects that fit **all** (or most) challenges of this topic — the family language.

| Topic example | Typical effects |
|---|---|
| Skeletons | Danger (often), Grouping / Grouping Power, Fight hard / Awareness mid |
| Environment · Obstacle | Covering, inverted Traverse, Materials spend on Work |
| Environment · Blocked Path | Blocking, Materials gain on Work, Reveal on long detours |
| Environment · Decay Trap | On Reveal / While Close Exhaust, Materials spend to stabilize |
| Environment · Side Branch (Find) | Pass prints Detour; Find Discovery T0X counts |
| Environment · Side Branch (Rest) | Pass prints Detour; Secure line → Rest (Rations +4 each) counts |
| Expedition leftovers | Scout, **Search**, ± Rations or Materials, fewer Danger locks |

#### Split into variants

From the base, make variants with different **strengths and weaknesses** by shifting Power (and sometimes outcomes), not by rewriting the whole Action set.

| Variant | Example shift |
|---|---|
| Skeleton Knight | Highest **[F]** Fight Power |
| Skeleton Mage | Highest **[A]** Release Contract Power |
| Skeleton Archer | Mid Fight + a fitting special (e.g. reach / On Reveal arrow tax) |

**Specific challenges** then get **one** fantasy-fitting special effect (Ranged-feel for an archer, Shield Wall / Blocking for a guard, Charging-style spike as prose if needed). Prefer effects from the playtest vocabulary in **`CurrentRulesDesign.md`**.

Keep shared Action **verbs** stable across variants so the family stays readable. Only rename a line if the fiction of that variant truly breaks the base verb.

---

### 3. General zone improvements & checks

After bases and a first set of variants exist, step back and tune the **whole zone** — not one card at a time.

#### Zone economy (strengths & weaknesses)

Confirm and refine the step-0 brief:

- Little / many **Rations**  
- Little / many **Materials**  
- Little / many **Spirit** / Discoveries / Find  
- Recovery common or scarce  
- Scout / Reveal +X common or scarce  

Every reward line on a card should respect this distribution.

#### Interesting effects that hit now or hit the row

Make sure the zone has enough **non-plain** cards — not every challenge should be Power + outcome only. Focus on effects that fit the topics (you do **not** need every keyword):

- Instant / timing: **On Reveal** Exhaust, supply loss (− Rations), similar surprise taxes  
- Row / other challenges: **Blocking**, **Covering**, **Grouping Power**, **Danger**  
- Setup / info: **Prepare**, **Scout**, **Reveal +X**, **Find** (as the zone allows)

Include enough **Blocking / Covering / Danger / pack** cards that **Scout** and **Range** tools feel worth packing — not one-off curios.

#### Enough Danger

Check **Danger** frequency across the deck:

- Too little → Retreat solves most overcommits  
- Too much → constant forced commits and overflow Damage  
- Target: Retreat is **sometimes** blocked, especially on the zone’s threat topic (e.g. undead / animals), not on every terrain card  

#### Challenge scale (easy ↔ hard)

The zone needs a **spread of difficulty**, not a flat mid-band.

| Band | Role in the zone |
|---|---|
| **Easier challenges** | Teach, recover pacing, low Power, light or no field effect |
| **Mid challenges** | Normal path texture |
| **Hard challenges** | Spikes, set pieces, better rewards, heavier field effects |

**Hard challenges should still offer one easy Action for little or no benefit** most of the time (cheap clear / Outmaneuver / slip past). That keeps wrong-tool players moving and preserves choice: pay for the reward line, or clear cheap and walk away empty-handed.

#### Effect contribution overview

Build a simple **census** of the whole zone (table or tally):

| Effect / outcome | Count or share | Notes |
|---|---|---|
| Danger | | |
| On Reveal Exhaust | | |
| Blocking / Covering | | |
| Grouping | | |
| + Rations / − Rations | | |
| + Materials | | |
| Recovery | | |
| Scout / Find | | |
| Plain (no field effect) | | |

Use this to rebalance: cut duplicates, fill gaps that the zone brief promised, remove effects that fight the “weak” list.

Also sanity-check **path math**: typical overcomes × ~2–3 Exhaustion after tools ≈ Stamina + planned Rations for this zone’s length.

---

### 4. Final pass — each card again

After the zone theme and effect distribution feel right, re-check **every individual challenge**:

- [ ] Actions still fit the fiction; tools for those Actions still make sense  
- [ ] Card is a **repeatable** hazard/foe type (not a unique room)  
- [ ] Fiction works for **one player alone** on their track  
- [ ] Special effects fit *this* card’s fantasy (not a leftover from another variant)  
- [ ] Power / rewards match easy–mid–hard role in the zone  
- [ ] Hard card still has an easy low-reward (or no-reward) Action when intended  
- [ ] Side Branch: exactly two main options (Pass / Detour); place is readable; Search goes to the pile (no Recipe/Tool in Close)  
- [ ] Card respects zone highlights / scarce rewards  
- [ ] No stacked unreadability (e.g. Blocking + Covering + Danger + Grouping all at once)  
- [ ] Keywords from the current playtest list (or deliberate one-off prose)

---

## Supporting reference

### Card shape

```markdown
## Card Name [ID]
- Subtitle -
On Reveal ▸ Name : effect.
While Revealed ▸ Name : effect.
---
- [F] 6 Fight : +1 Rations
- [T] 3 Outmaneuver :
- [A] 5 Read Signs : Scout 2
---
```

| Band | Put here |
|---|---|
| **Above `---`** | Activations and field effects players must see before Commit |
| **Action rows** | Power, optional Stamina Value, flavour name, outcomes |

**Typical Action count:** 2–3 lines — including, on hard cards, one easy low-benefit clear.

### Bake Power vs separate field effect

If an effect only says “+1 Challenge Power to **this** card” and nothing else ever reads that keyword, **bake it into the printed Action Power** (Fight 6 instead of Fight 5 + a +1 rider). Players see one number at Commit.

Keep a **separate** field effect when at least one of these is true:

| Situation | Why keep it separate |
|---|---|
| **Other cards** change (Covering on the next card, Grouping Power for packs) | Relational — not a property of one line alone |
| **Time** (On Reveal, While Revealed, While Close) | Pressure appears, stays, or hits only in a slot |
| **Stacking / visibility** | Players should see *why* the math jumped without reprinting the card |

Don’t invent typed taxes (old Dread / Rough / Treacherous style) for a single card’s own line — raise that Action’s Power instead.

### “Why this line?” / player compares

When writing or reviewing Action rows, answer two short questions per line:

1. **Why does this line exist?** (which tool fantasy / payoff)  
2. **What does the player compare it to?** (the other lines on this card)

If two lines share the **same job and the same kind of outcome**, cut or rewrite one.

**Weak (same job twice)**

```markdown
- [A] 4 Study : Scout 2
- [A] 6 Study Harder : Scout 2
```

Most groups always take the cheaper line.

**Stronger (different jobs)**

```markdown
- [T] 3 Slip Past :
- [A] 4 Study : Scout 2
- [A] 6 Decipher : Find F2
```

Cheap clear vs information vs discovery — different costs, different payoffs.

### Numbers (first-zone ranges)

| Piece | First-zone range | Notes |
|---|---|---|
| Action Power | 0–8 (spikes to 9 rare) | Body ~3–6; tools ~2–9 |
| Stamina Value on challenge | 0 to −2 (−3 rare) | Extra cost on that line |
| Exhaust on field effects | 1–2 | On Reveal / While Close surprises |
| Temporary Power mods | ±1 (±2 rare set-piece) | Covering, Grouping Power |
| Target Exhaustion after tools/help | ~2–3 per overcome | Path length × this ≈ Stamina + Rations |

### Allowed effect vocabulary (prototype)

Only combine from **`CurrentRulesDesign.md` → Special Effects Overview** unless you intentionally write one-off card text.

**Activations:** On Reveal · While Revealed · While Close · Grouping  

**Outcomes:** Exhaust X · Recovery X · ±X Rations · Scout X · Reveal +X · Find FX · Return · Prepare X · (+ Materials / treasure when fiction fits)  

**Row / field:** Danger · Blocking X · Covering X · Grouping Power X  

Avoid **While Ranged X** and **On Move** on early zone cards unless clearly needed.

### Good combinations (recipes)

| Recipe | Pattern | Feels like |
|---|---|---|
| Trap | On Reveal ▸ Exhaust 1–2 | Arrow, spores, alarm |
| Gate | While Revealed ▸ Blocking 1 | Portcullis, shield wall |
| Neighbour tax | While Revealed ▸ Covering 1 | Loose stones |
| Ambush now | While Close ▸ Exhaust 1 | Falling rocks at Close |
| Pack | Grouping + Grouping Power | Wolves, skeletons |
| Locked fight | Danger + hard Fight + soft easy clear | Beast / warden |
| Easy info / hard loot | Low Power → Scout; high → Rations / Find | Read vs take |
| Setup | Easy line → Prepare | Mark route, brace |
| Steal | On Reveal ▸ −1 Rations | Thief, spoiled cache |

**Rule of thumb:** one activation family + at most one row effect + 2–3 Action lines.

### Action-line roles

| Role | Typical Power | Typical outcome |
|---|---|---|
| **Cheap clear** | Low | Nothing or tiny Scout — especially on hard cards **and** Side Branches |
| **Fair clear** | Mid | Recovery 1 or Scout |
| **Paying clear** | High | + Rations / Materials / **Search** |
| **Detour Search** (Side Branch) | Paying | `Find Discovery T0X` — card to **Search pile**; never print the Recipe/Tool on the challenge face |

### First-zone mix (starting target)

| Slot | Share | Notes |
|---|---|---|
| Plain pressure | ~40% | Power + outcomes only |
| Timing tax | ~25% | On Reveal / While Close Exhaust |
| Row shapers | ~20% | Blocking, Covering, Danger |
| Pack / set piece | ~10% | Grouping or named duo |
| Find / story / Side Branch | ~5% | Find Discovery / Search / optional detours |

### Discoveries (Search → Recipe/Tool)

Treat **Find Discovery T0X** as a short face line. That Action **overcomes** onto the **Search pile**. At stretch end, **claim** this **Zone’s** packet card if unclaimed (**no roll**). New stairs, doors, and Areas are **Discovery Book** pages, not Treasure.

**Recipe/Tool packet cards** (design):

- Per Zone, not a game-wide pile. Many wrecks in the packet; pack only a few incomplete ones per run.
- **Recipe face** (public after Search is claimed): each line is **item — specific Challenge + specific Action × N**. Players may guess the Tool; do not print finished Power/Weight/Spirit on this face.
- **Tool face** (hidden until assembled): the usable Tool. Cards may enter **assembled**, **parts missing**, or **fully broken**.
- Crafting is a fetch list. Coolness is **many distinct wrecks** and **many named sources** so a new Area or challenge type is exciting — players should not finish the catalog quickly.
- One challenge type may feed **several** recipes. Several recipes may share a source. Do not make six wrecks all tick the same one name.
- **Search** gets the wreck (always, if unclaimed). Ordinary Fight/Work/… lines **tick** packed recipes while that layer is still open. **+Count** on a higher layer is a larger one-time packet, not a loot die and not a drip after the clear. Prefer ticks on different Actions. Search should be a real paying clear (not cheaper than Fight unless Search is the only payoff).
- Harder layers: **+Count** on the named source, and/or a **richer find table** on Search — never a second miss chance on a known T-code, and never a reason to repeat the layer once it is cleared.
- Print **challenge names**, not Travel Book locations. Cross-zone boxes are Travel Book **leaks** (sparse).

| On the challenge | In the Zone packet |
|---|---|
| `Find Discovery T03` | Recipe/Tool T03 (broken / missing / assembled) |

Keep the challenge readable. Add a small immediate cherry on the same row (`Find Discovery T03, Recovery 1`) only when the face stays clear. Do **not** print the recipe checklist on the challenge.

**Named sources (required for the item loop):**

When you add a challenge type, ask: is this **title** on at least one Recipe/Tool in this Zone (or as a leak from another Zone)? Is it the only source, or the source that sits on a **higher layer**, for at least one part? If not, discovering this card will not feel like an item find. A cleared layer does not keep paying that part.

Spread sources across the Zone’s topics (Archers vs Bone Piles vs Wooden Debris). Generic “any skeleton” kills the map.

### Anti-patterns

| Avoid | Why |
|---|---|
| Skipping the zone brief | Rewards and pressure drift off-theme |
| Unique one-shot rooms in the zone deck | Breaks random draw (“I already cleared the Mirror Maze”) |
| Real path forks as zone challenges | Next-Area choices belong in the Travel Book / Discovery Book; use Side Branch only for short dead ends |
| Party-only fiction (Rain, group camp, siege of everyone) | Personal tracks; one player faces the card alone |
| Side Branch with printed Recipe/Tool on the Detour line | Place may be visible; packet card comes **at stretch end** (claim, no roll) |
| Side Branch with no Pass line | Soft-locks players who decline the spur |
| Side Branch that spoils the pocket in flavor (“a finished warbow”) | Same as printing the Tool face |
| Every Search/recipe ticking the same one challenge name | New Areas are not exciting; the fetch list has no map |
| Recipe that prints a Travel Book location | Spoils the leak; print the **challenge name** only |
| Extra die on Search or on ticks | Paid Search already rare via the deck; a higher layer’s Count is a one-time packet — a miss after payment is a tax |
| Variants that rewrite all Actions | Family becomes unreadable |
| Actions that don’t fit tools/fiction | Immersion and loadout choices break |
| Two Actions with the same outcome kind at different Power | Collapses to “always take the cheaper line” |
| Flat difficulty (all mid) | No pacing; no “push or cheap-clear” moments |
| Hard card with only hard lines | Soft-locks wrong tools; no graceful fail-forward |
| Separate +1 Power keyword that only affects this card’s own line | Bake into printed Power instead |
| Too little Danger | Retreat trivializes risk |
| Too much Danger | Constant forced overflow Damage |
| Effect soup on one card | Unreadable math |
| Ignoring the effect census | Accidental Ration fountain or Exhaust spam |

### Tiny examples

**Gate**

```markdown
## Fallen Portcullis [EX_PORTCULLIS]
While Revealed ▸ Blocking 1 : 1 challenge behind this one cannot be Overcome.
---
- [W] 5 Lift the Gate : +1 Materials
- [T] 2 Slip Through :
- [A] 4 Find the Winch : Scout 2
---
```

**Hard threat with easy low-reward line**

```markdown
## Skeleton Knight [EX_KNIGHT]
While Revealed ▸ Danger
While Revealed ▸ Old Captain : All other Skeleton challenges gain +1 Challenge Power.
---
- [F] 9 Fight : +2 Materials, +1 Spirit
- [T] 5 Outmaneuver : Reveal +1
- [A] 7 Release Contract : Scout 2, +1 Spirit
---
```

**Side Branch (two options; Search pile; Pass is a Detour)**

```markdown
## Broken Wall [DK_BROKEN_WALL]
---
- [—] 0 Continue Past : Detour
- [W] 5 Force the Crack : Find Discovery T01
---
```

You can tell there is a chamber beyond the crack. **Force the Crack** puts this card on the **Search pile** and counts toward progress. At stretch end, claim this Zone’s T01 Recipe/Tool if unclaimed (**no roll**). **Continue Past** prints **Detour**: it skips the find and does not count toward progress.

**Rest Detour (on-path Camp-rate rest)**

```markdown
## Quiet Hollow [EX_REST_HOLLOW]
---
- [—] 0 Continue Past : Detour
- [A] 4 Keep Watch : Rest (Rations +4 each)
---
```

Climb / barricade variants swap the Secure line (`[T] Climb to a Safe Limb`, `[W] Barricade the Door`) — same Pass vs paid Rest choice.

---

> **Design intent:** Lock zone identity first, then shared topic bases with honest Action fiction, then variants and a zone-wide effect/Danger/difficulty check, then a final per-card fiction pass. Variety comes from combining a small effect list — not from growing keywords. Real forks live on Travel Book / Discovery Book pages; short dead ends are Side Branches: Pass or paid spur (Search **or** Rest). Search is a paying clear onto a pile; the Recipe/Tool is **claimed** at stretch end (no loot roll). Named challenge titles are component sources — **Count** on a higher layer is a larger one-time packet, then that layer is done. Spread sources so new cards and layers matter. See **`docs/design-goals.md`**.
