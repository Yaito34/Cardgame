# Travel Book Design Guide

Guideline for designing **Travel Book pages**. Visit / Camp rules still live in **`CurrentRulesDesign.md`** where they apply. Zone challenge design: **`docs/challenge-design-guide.md`**.

**Source of printed content:** edit **`TravelBook.md`**. Preview the book at **`TravelBook.html`** and the cluster map at **`TravelMap.html`** (`npm run serve:travel`, then refresh). Fallback: `npm run build:travel` writes `TravelBook-data.js`.

This file is for **design structure and notes** — keep finished page text in `TravelBook.md`. Top-level aims: **`docs/design-goals.md`**.

---

## World model

### Hierarchy (names)

| Layer | What it is | Example |
|---|---|---|
| **Zone** | Biggest frame; defines which **challenge deck** you use | Ruined Castle |
| **Section** | Optional grouping of Areas inside a Zone | Great Hall, Cellars |
| **Area** | A Travel Book **page** (every Location is an Area) | Main Entrance, Ground Floor, Ruined Castle Woods |

```text
Zone
 └── Section (optional)
      ├── Area — Main Entrance   (stay options; low Difficulty onto floors)
      ├── Area — Ground Floor    (Area exploration; Difficulty to leave)
      └── Area — Cellar
```

A **cluster** is not a printed page. It is how you group Areas on the world map (see World structure).

### World structure

The overworld is **clusters of challenge Areas**, not a long spine with a settlement only at one end.

- A **cluster** is a connected group of challenge Areas you enter and leave through **gates** (Paths to a settlement, woods, or another cluster). It may mix **more than one Zone Deck** (keep + wrapping woods, two wilderness Zones that share a town).
- Each cluster **connects to one or more settlements**. From every Area in the cluster, the Difficulty to reach *a* settlement stays in a **similar band** (hops and `Ch.` to a printed gate, or to a death-end Discovery sized as extraction). Do not build “walked far in, must pay that whole distance back.”
- **Some** variation in that band is intended: harder gates and farther towns are **pockets** (optional richer / farther routes), not the only way the world opens. Equal `Ch.` on every door is not the goal — a bounded extraction cost is. An easy path network should still let you see most of the cluster without that kit.

Settlements sit on the **rim** (heal, storage, buy, start/end a run). In-zone Camps are fuel only. After gates are known, a run is often **enter by one passage, leave by another** (same settlement or the next). There-and-back is a choice.

Playtest keep: **Mouten Village** and **Chapel Cellar** are the rim settlements. **Old Forest** (woods) + **Ruined Castle** (keep) are one cluster on one map.

### One page kind: Area

Every Location page is an **Area**. An Area may combine any of:

| Feature | Source / print | Notes |
|---|---|---|
| **Stay options** | `### Available Actions` / `### You must` | Camp, activities, **Area exploration** on large Areas |
| **Area effects** | `### In this Area` | Challenge / travel modifiers while here |
| **Paths** | `### Paths` / `### Leads to` / `### Exits` | Known / discovered exits — one list |
| **Difficulty** | `difficulty: N` or per-exit `Difficulty N` | Cost to **use** a known exit. Omit or `0` = free |
| **Undiscovered transitions** | Discovery Book (not the Travel Book) | Search this Area; copy names into **Leads to** when found |
| **Sees** | `### Sees` | Places named in flavor that you can look at but **not** walk to from here — including Areas in **another Zone**. Map: dotted line. Skip if a Path already exists. Flavor only; not a Zone crossing. |

**Safe Areas** (no challenges / special rest) will be defined later — not a separate page kind.

### Carving Areas (distance)

Draw the fiction map first, then split into gameplay Areas so **exit Difficulties inside one Area stay honest**:

- Square-ish blob → similar Difficulty on all exits  
- Long road → higher Difficulty along the road, lower into roadside Areas  
- Cluster of close doors → small Area so those exits stay low / 0  
- Coarse zoom (whole floor) is fine for keeps; fine zoom (door-to-door) only when that choice matters  

### Semi-permanent meaning (next layer, then done)

Revisit to **master the next difficulty layer** in the same Area. The first visit should not clear the place. When the top layer is cleared, that Area’s unique rewards are done. One-shot *finds* are fine. A cleared page may remain a **camp** or a **connector**. It must not remain an unfinished prize, and it must not be a better **EXP** grind than any other road (`docs/design-goals.md`).

**Why you still pay this Path:**

| Reason | While it is true |
|---|---|
| **Next layer** | A harder difficulty in this same Area is still uncleared. This is the main reason to come back. The higher layer is a new problem, not extra Count on the easy one |
| **Camp / settlement** | Rest, trade, store Spirit, Heal / Repair, start/end a run. Stays after the unique rewards are done |
| **Route / connector** | It is on the way to a layer, camp, settlement, or Zone gate. Stays after the clear |
| **Peak** | The top layer: strong challenge, rare one-time wreck. After you clear it, you are done |

Optional **EXP** is gained on every road, including cleared ones. It is not a leftover job and not a reason this Path is special.

A hub (Courtyard, woods around a keep) is a connector that is a little bit of a destination: many doors, a lower layer, not the place you stay to grind.

**Major Paths** (named arms from a hub: the hall, the ranges, the walk, the cellar) each end in a **payload** worth planning a run around — camp, a higher layer, peak, shortcut, key that opens elsewhere, tool that matters in another Area, lore that names a place, or a Zone passage. Empty “more of the same castle” is not a major path.

**Connectors should be less attractive as places to stay.** Their job *is* the connection. Do not also give them a richer unique table or a better EXP rate, or players stop in the hallway. Give them shorter/easier `Ch.` than the layer they serve, and a clear identity. Less attractive ≠ miserable: in this game the road *is* a challenge deck.

**One-shots sit on a layer you will clear.** Put a key on a layer, a camp, or a room that becomes a shortcut — not on a spur with no layer, no camp, and no route. After the top layers are cleared, the rest of the cluster stays as roads and camps. That is expected.

**Leaks** (optional, sparse): a find in A that changes B — a shortcut that hugs a camp or settlement, a key that opens another wing, a **Recipe/Tool whose remaining box is a challenge that only lives in another Area or Zone**. That is how order of discovery stays meaningful on later visits. Do not leak from every room.

**Cross-zone recipes:** print the **challenge name** (`Fallen Tree`), never the map (`Old Forest A8`). Players learn *where* when they discover that Area and see the card. Mix:

| Recipe span | Role |
|---|---|
| **This Zone only** | A layer prize in this Zone. Once that layer is cleared, it does not stay as a farm |
| **This Zone + one leak** | Payload on a major Path / reason to enter the next Zone |
| **Two Zones as the prize** | Rare. A card you carry until the world opens |

If most wrecks need three Zones, early play is a dead card. If none leak, a new Zone is only a reskin of the same fetch. Unique **source names** per wing (Archers on the Wall Walk, Bone Piles in the Chapel Cellar, Wooden Debris in the ranges) make the next door exciting. Interchangeable “any skeleton” does not.

**Build identity:** the same Area can be *my next layer* for one packed wreck and *only a connector or a finished road* for another. That is a feature. Shared economy (Spirit, EXP, the next Zone) must still be reachable for every build — identity is which layer you still mean to clear, not a personal farm.

**Check:** if a higher layer is still open, would anyone pay this Path’s `Ch.` to attempt it? If the top layer is already cleared, the only reasons left are camp, connector, or optional EXP — and EXP must not pay better here than on any other road. If none of those are true, it should not be a major path.

### Exits — one list: Paths

Everything **known** goes under **`Paths:`**. Print an exit only when it is **visible from this Area**, **expected architecture** (a cellar has a way up), or **already discovered** (copied from the Discovery Book).

(`### Leads to` / `### Exits` in source also print as **Paths:**.)

**Playtest (Ruined Castle):** treat every transition as already discovered. Write clear names on both ends — the names the Discovery Book would have given you. Prefer **at most 4** printed **Paths** on an Area (group volumes or split the Area if the list grows).

**Full game:** undiscovered openings are **not** on the Travel Book. The Area’s Discovery Book pages hold **Discover Difficulty** (challenges to search this Area). When that deck is empty, open the page: it names this end, the destination `[A#]` / Area, and the name on the far side. Copy both ends into **Paths**. Zone cards are **encounters**; Recipe/Tool **Treasure** is a per-Zone packet from Search, not a map unlock.

```text
[Old Forest]
Ruined Castle Woods                                    A8

Paths:
- Ch.: 5 > D4 Breached Gate leads to [A3] Courtyard
- Ch.: 8 > D11 Ground Hole leads to [A5] Cellar
```

Print as two lines, like a note copied onto the page:

```text
Ch.: 5 > D4
Breached Gate leads to > Courtyard <
```

**Ch.:** challenges to search (Discovery) / to use the exit (Travel). Same number for now. **D#** is the Discovery Book page. The sentence is what you copy from that page. `[A#]` is for the viewer only — the handwritten line is the way + destination name.

**`(hidden)`** (source only): the map edge is thinner (same brown as other lines). Strip it from the printed Path.

**Action gate** (rare): extra check **after** paying Ch. as usual. Trailing `([T] Climb 3)` (or `[F]` / `[W]` / `[A]` + name + power). Printed under the Path sentence; the map puts the same chip **on that travel line**. Not a fourth stroke type. Never on Sees. Unique climbs stay in the Travel Book — do not put them on zone cards.

```text
- Ch.: 6 > D14 Ground Hole leads to [A8] Ruined Castle Woods (hidden) ([T] Climb 3)
```

Print:

```text
Ch.: 6 > D14
Ground Hole leads to > Ruined Castle Woods <
[T] Climb 3
```

Page-level `difficulty:` applies to every exit that does not print its own **Difficulty N**. Coarse floors often use **per-exit** numbers (hall door vs flooded cellar stair).

### Sees (look from afar)

**Sees** is not a Path. It marks a place named in this Area’s flavor that you can **look at** but **cannot walk to from here** (blocked door, look down from a tower, a landmark in another Zone on the horizon).

Source only — **do not print** on the Area page. The zone map draws it as a **straight dotted brown** line when that Area has a mark on this map. Aliases: `### Looks to` / `### Can see`.

```text
### Sees
- [A3] Courtyard
- [A8] Ruined Castle Woods
- [A14] Watch Tower
```

**Rules**

1. The destination must already be named honestly in this Area’s flavor (or a Watch line). Do not invent a view the walker could not have.
2. **No Path between these two Areas** — if a travel edge exists (visible or `(hidden)`), omit Sees; the map already has a travel line.
3. One line per destination: **`[A#] Name`**. The map treats Sees as undirected (one dotted line).
4. Seeing ≠ reaching. Gate House looks into the yard; the yard door is blocked — that is Sees, not a Path.
5. Underground / windowless Areas usually have no Sees.
6. **Other Zones are allowed.** Sees may point at a real Area in a different Zone (a tower in the woods seen from the castle drum). That is **flavor and map only** — it does not create a Path, does not change Zone decks, and does not let you travel there. To actually go, the player still needs a printed or discovered Path (often via the woods / another Zone’s own graph).
7. If the far Area is not on this chapter’s `map_x` / `map_y` grid, still author the Sees line for the flavor contract; the dotted line appears when both marks share a map.

Playtest keep: Gate House → yard + woods; Wall Walk → yard + woods; Courtyard → Wall Walk + Intact Tower; Intact Tower → Gate House + woods; Woods → Gate House, Wall Walk, Intact Tower. Later: a woods Watch Tower that the Intact Tower **Sees** but does not Path to.

### Hard rules

1. Every Location page is **`kind: area`** (aliases: `crossing`, `landmark`, `path` → area).
2. An Area may have **any number** of exits under **Paths**. **Prefer at most 4.** If a list would grow past that, group volumes (Castle Buildings) or split the Area.
3. **Difficulty** is optional. Hubs use **0** (or omit) so visible exits are free to step onto; large Areas put **5–10** on exits (per-exit when they differ).
4. Stay options and In this Area may both appear on the same page. Large Areas may add **Area exploration** under **Available Actions**.
5. Exit lines are **`Ch.: N > D# Way leads to [A#] Destination`**. **Ch.** is the challenge count. **D#** is the Discovery page. The printed sentence is **`Way leads to > Destination <`**. Destination is the **Area** by default; use the **Zone** when the exit leaves this Zone. **Playtest:** every line is already written in.
6. Section is optional — wilderness may show only `[Zone]` + Area name.
7. Do **not** put unique stairs, gates, or zone-to-zone forks on challenge cards. Those are Travel Book exits or Discovery Book transitions. Do **not** print recipe checklists on Area pages — those live on Recipe/Tool cards. Area pages **place** the named sources (`+1 Resistance on Skeleton Archers`) so an open layer and its leaks are readable. That placement is the one-time layer, not a farm to keep.
8. **Return path:** going back to the Area you just left, on the same connection, is Difficulty **at most 2**. Use the printed number when it is **0**, **1**, or **2**. The printed number on that exit still applies when you did *not* just come from there (finding the mural stair from the wall-walk is still 5 unless you just climbed it).
9. **Sees** is look-from-afar only (see above). Never a Path. May name an Area in **another Zone** (flavor / dotted map only — not a Zone crossing). Omit if those Areas already share a travel edge.
10. **Action gates** (e.g. `[T] Climb`) are extra on a Path, not instead of Ch. Map: badge on the travel line. Do not invent a fourth line style. Do not put unique climbs on zone cards.

### Title print

```text
{Section} [{Zone}]
{Area name}
```

Or without Section: `[Old Forest]` / `Ruined Castle Woods`.  
YAML: `section: Great Hall` + `name: Main Entrance`, or `name: Great Hall · Left Wing`.

---

## Scale, grouping, and naming

### Areas (scale / zoom)

| Zoom | Use | Example |
|---|---|---|
| **Fine** | Door distances matter | Split a hall into Near Doors + Far Hall + Ladder niche |
| **Coarse** | Building as atmosphere + challenges *(default for keeps)* | Wall Walk / Castle Buildings / Cellar as Areas; chapel and kitchen as stay lines |

### Sections

Optional shared prefix so players know they are in the same part of the Zone.

Examples:

- Great Hall · Main Entrance *(Area, hub, stay options)*  
- Ground Floor *(Area, Area exploration, per-exit Difficulty)*  
- Ruined Castle Woods *(Area in Old Forest, no Section — **Forest** = Zone, **Woods** = Area)*  

Left / Right / Front / Back are fine **indoors** when the Section has a clear front (e.g. Main Entrance).

### Wilderness (level-design choice)

Outdoors has **no hard Left/Right rule**. The guideline is: **describe affinity in the name when it is clearly perceivable from that Area; if not, do not put it in the name.**

| Situation | Naming |
|---|---|
| **Deep / closed cover** (dense wood, fog, no landmark sticking out) | Vague trail titles (`Black Forest · Old Track`, `Hollow Way`). Do **not** name a lake, tower, or clearing the walker cannot sense yet. **Exit lines** follow the same rule: way + `[A#]` or a non-spoiling trail label — never the hidden destination’s true name. |
| **Flanking feature visible** (high mountain, open lake shore, cliff) | Shared place + side affinity: `Black Forest · Mountain Side`, `Black Forest · Lake Side` — only if that feature is fair to perceive from the Area. |
| **Open terrain** (valley, downs) | Divide large space with recognizable distant features: hills, waterways, ridges, smoke, a lone tree line — whatever can be seen from far away. |
| **Huge place as anchor** (Mount X, the Lake, a tower) | Local Left/Right relative to that feature is OK: `Left of Mount X`, `Mount X · Lake Side`. Prefer this over compass directions for now. |

**Spoilers:** a name like `… · Lake Side` implies a lake. Use it only when that is honest from the Area’s fiction. Reaching the water can still be its own Area (`Stillwater Shore`) once you are there.

**Playtest note:** do **not** rely on compass labels (North/South/East/West) for wilderness until Left/Right-of-feature and perceivable-affinity naming have been tried. Compass may be revisited later if orientation still feels weak.

**Rule of thumb:** architecture → shared building names + Front/Back/Left/Right. Wilderness → name what you can see or flank; stay silent when you cannot; optional Left/Right of a huge place (mountain, lake); no compass for now.

**Forest / Woods:** **Forest** is the **Zone** word; **Woods** is the **Area** word. Example: Zone **Old Forest**, Area **Ruined Castle Woods**. Do not print Forest in an Area title or Woods in a Zone title.

---

## Page layout (what players see)

```text
┌─────────────────────────────┬─────────────────────────────┐
│      Area [Zone]            │                      A#     │
│ Main Entrance               │                             │
│                             │ Paths:                   │
│ Available Actions / You must │ - Mural Stair leads to [A2] │
│ (flavor)                    │   Ground Floor              │
│                             │ - Inner Door leads to [A3]  │
│                             │   Upper Floor               │
│                             │                             │
└─────────────────────────────┴─────────────────────────────┘
```

Outdoor wilderness uses the same layout; `setting: outdoor` only changes Zone framing (no Section required).

| Spot | Content |
|---|---|
| **Section + zone** | Centered top left: `{Section} [{Zone}]` (e.g. `Great Hall [Sunken Keep]`). Or `[Zone]` alone. Zone never mid-word wraps. |
| **Area name** | Left-aligned headline (`Main Entrance`, `Left Wing`) |
| **Top right** | Area number **`A#`** (Area 1 prints **A1**) |
| **Effects (any combo)** | **Available Actions** / **You must** and/or **In this Area** |
| **Exits** | **`Paths:`**; **Ch.: N > D#** then **`Way leads to > Destination <`**. Omit the underline on the last path. |

### Title grammar

`section:` + `name:`, or `name: Section · Area`:

```text
Great Hall [Sunken Keep]
Main Entrance
```

```text
Great Hall [Sunken Keep]
Left Wing
```

No Section:

```text
[Old Forest]
Ruined Castle Woods
```

### Exit line grammar

Every printed exit is **`Ch.: N > D# Way leads to [A#] Destination`**. The viewer shows:

```text
Ch.: 5 > D4
Breached Gate leads to > Courtyard <
```

**Ch.:** challenge count (discover / travel — same number for now). **`>`** then **D#** is the Discovery Book page you open after those challenges. The second line is the sentence you copy onto the Travel Book. The **way** names the opening. The **destination** is the Area’s printed name (heavier ink), with **the**. `[A#]` stays in source for the viewer; it is not part of the handwritten sentence.

**Difficulty 0 / omitted** (threshold-style Area — free to step onto exits that have no per-exit number):

```text
### Paths
- Mural Stair leads to [A2] Ground Floor    Difficulty 5
- Upper Stair leads to [A3] Upper Floor    Difficulty 5
- Main Door leads to [A5] Outside
```

**Page-level Difficulty** (same on every exit that has no number of its own):

```yaml
difficulty: 7
### Paths
- Gate Door leads to [A1] Main Entrance
- Stairs lead to [A3] Upper Floor
```

**Per-exit Difficulty** (coarse floors — hall vs cellar stair). Omit page-level `difficulty` and put **Difficulty N** on each line:

```text
- Gate Door leads to [A1] Main Entrance Difficulty 7
- Stairs lead to [A3] Upper Floor Difficulty 7
- Stairs lead to [A4] Cellar Difficulty 9
```

Viewer prints **Ch.: N > D#** above the copied sentence. The destination is marked by hand as **`> Courtyard <`**. `[A#]` is not shown on the handwritten line. The last path has no underline.

That number is the deal to **use a known exit**. **Area exploration** (an Available Action on large Areas) does not use it and does not leave the Area. **Discover Difficulty** (unmapped search) is **the same number** as that exit’s Travel Difficulty for now.

Asymmetric ends (flooded climb out of a cellar) are allowed when fiction demands it.

| Token | Meaning |
|---|---|
| **Way** | The opening you can see. Ruin openings need a picture (**Breached Gate**, **Wall Break**, **Ground Hole**). Indoor: add a picture-word only when it is not already the destination (**Mural Stair**, **Inner Arch**). If the way would just echo the place, use **Stairs** / **Door** / **Arch**. |
| **`[A#]`** | Destination Area number (always required). Area 1 prints **A1**. |
| **Destination** | Usually that Area’s printed name. When the exit **leaves this Zone**, or the Area title is a local label that does not read from here, print the **Zone** instead. `[A#]` is still the Area page you land on. |
| **`difficulty` / `N`** | Deal to **use** a known exit; `0` / omit = free; per-exit wins over page-level |
| **Discover Difficulty** | Same as that exit’s Travel Difficulty (for now); paid to *find* it the first time |
| **`(…)`** | Optional exception / cost / lock on an exit |

### Exit names

Always keep **`[A#]`**. Print **`Way leads to [A#] Destination`** (or **`leads into the`** when the destination is a Zone). The way names the opening; the destination names the place.

**Default destination = Area name.** Use the **Zone** as the printed destination when that is what you actually see or choose — most often a **zone border**. `[A#]` still points at the Area page.

```text
Breached Gate leads into the [A8] Old Forest
```

You arrive on **Ruined Castle Woods** (A8). From inside the keep the honest name can be the **Zone** (Old Forest) when you are leaving the castle; from the woods themselves print the **Area**.

**Do not** swap Area for Zone when several exits from this page enter the **same** Zone at **different** Areas. From the woods, Breached Gate and Ground Hole must stay **Courtyard** and **Cellar** — not two lines of Ruined Castle.

Do **not** write *leading inside / outside* on the line. Which Area you stand in already says the direction.

| Situation | Exit label | Example |
|---|---|---|
| **Playtest / discovered** | Named opening + destination Area | `Stairs lead to [A4] Cellar` · `Breached Gate leads to [A3] Courtyard` |
| You can **clearly see / recognize** the Area | Same form; add a picture-word only when it is not the destination | `Inner Door leads to [A2] Ground Floor` · `Mural Stair leads to [A2] Wall Walk` |
| Exit **leaves this Zone** (or Area title is a local label) | Opening + **Zone** name; `[A#]` is still the landing Area | `Ground Hole leads into the [A8] Old Forest` |
| Ruin opening (hole, breach, break) | Name the opening | `Breached Gate leads to [A3] Courtyard` · `Ground Hole leads to [A5] Cellar` |
| Door / stair **not yet discovered** | Do not print it on the Travel Book | Discovery Book page instead |
| Wilderness, far place **not** visible | Cue as the way; omit or delay the true name | `Old Track leads to [A6] Sound of water` |

**Way names the opening.** *Gate* alone is not enough — say **Breached Gate**. *Hole* alone is not enough — say **Ground Hole**. *Break* alone is not enough — say **Wall Break**. Do **not** repeat the destination in the way: **Stairs lead to Chapel**, not Chapel Stair leads to Chapel. Keep a picture-word when it is *not* the destination (**Mural Stair**, **Inner Arch**, **Yard Door**).

**Do not** use player-relative **ahead / behind / left of you / behind you**.

**Do not** invent synonyms for a visible Area (`portcullis` vs `Main Entrance`).

#### Examples (playtest — all discovered)

From **Ground Floor**:

```text
Paths:
- Gate Door leads to [A1] Main Entrance    Difficulty 7
- Stairs lead to [A3] Upper Floor    Difficulty 7
- Stairs lead to [A4] Cellar    Difficulty 9
```

From **Main Entrance**:

```text
Paths:
- Floor Stair leads to [A2] Ground Floor    Difficulty 5
- Upper Stair leads to [A3] Upper Floor    Difficulty 5
- Main Door leads to [A5] Outside
```

---

### Difficulty band (reach another Area)

**Difficulty N** is the deal to leave this Area for another via its exits. It is not clock time, and it is not used during **Area exploration** (draw as many challenges as you wish — that never leaves the Area). Challenge-card Difficulty (`[F] 8`) is a separate number.

| Stretch | Difficulty (both ways) |
|---|---|
| Threshold / hub (old Crossing) | **0** (or omit) |
| Short connector | 5–6 |
| Normal Area | **6–8** (default home) |
| Hard / long / flooded | 8–10 |
| Asymmetric exception | different per direction only when fiction demands it |

- Prefer **symmetric** Difficulty on a given edge; cellar climbs and similar may differ per end.
- **Return path (always):** when you retrace the connection you just used, pay **at most 2** (or the printed number if lower). Print the “first approach” Difficulty on each end as usual; do not rewrite a 6 as a 2 on the page just because it can be a return.
- Coarse floors should use **per-exit** numbers when openings are not the same deal (door vs flooded stair).
- Align loosely with challenge length (higher Difficulty ↔ harder/longer deck), no rigid 1:1 formula yet.
- **B26** (On Reveal … +1 travel time) is a special Area line, not a wilderness default. Keep the printed `difficulty:` number; do not also apply **B23** on the same Area.

---

## Effects on an Area

### Stay options

Split into two lists only:

| Section | Meaning |
|---|---|
| **Available Actions** | Things you *may* do here (**Camp**, **Area exploration**, Watch / Work lines, …) |
| **You must** | Things you *must* choose among if you stay/Camp (pick exactly one line unless the page says otherwise). Omit the section if empty. |

Pass through / leaving without staying skips both lists (including Area exploration).

**Area exploration** (large Areas only — a whole floor, a wood, a yard). Printed under **Available Actions**. Draw as many Zone Deck challenges as you wish; that never leaves the Area and does not spend exit Difficulty. Safe rooms omit this line and keep only Camp / activity options.

```text
Area exploration
```

Keep other lines short. Prefer Action lines for activities:

```text
[A] 4 Offer a Quiet Watch : Recovery 1
[W] 5 Dig the Rubble Shelf : Materials 2
```

Rest recovery uses one printed keyword only: **Camp**. Do **not** print Resting Place as a separate tag — bake better/worse rates into the number.

```text
Camp: Recover 4 Stamina per Ration spent
Camp: Recover 5 Stamina per Ration spent   # nicer site
Camp: Recover 3 Stamina per Ration spent   # uneasy site
```

Default when staying is **4**. Put the Camp line under **Available Actions**. Pass through skips Camp.

**Dangerous Camp X** (uneasy sites only). Printed under **Available Actions** next to **Camp**. This is a Camp tax, not an **In this Area** line and not Area exploration.

```text
Camp: Recover 4 Stamina per Ration spent
Dangerous Camp 1
```

When you **choose Camp** here:

1. Draw **X** cards from the Zone Deck. This is not a path: no exit Difficulty, no Vision row, ignore **On Reveal**.
2. Overcome **every drawn card that has ! Danger**, one after another in Close, using normal challenge rules (Stamina boxes, overflow Damage). Cards **without** ! Danger are not fought.
3. Return **all** drawn cards to the Zone Deck when the check ends (cleared Danger, unused cards, and any still in Close if you abandon).
4. If you are still here, **Camp as normal** (Rest, upkeep, activity).
5. If you **Forced Retreat** during the check (unpaid overflow), there is no Camp.

**Pass through** never draws. **Stay longer** does not draw again — one check per Camp.

The extra clears are the cost: more challenges than the map asked for, extra Stamina, and a real overflow-Damage cliff **before** Rest. If you survive, Rations can pay back boxes you just filled.

**X = 1** is the default (roaming already have ! Danger). **X = 2** only on a farm or connector that should feel unsafe at night. Do **not** print Dangerous Camp on leftover-job safe camps (Chapel, Intact Tower). Do not stack it with **Camp: Recover 3** unless both are mild.

### In this Area

Single list: **`### In this Area`** in source (aliases `### On this Path` / `### On this Area`). Pick **single** effects from the library (bad, good, or neutral). Prefer **2–3** lines. Same Zone Deck feels different when Areas use different picks.

An Area may have **both** stay options and In this Area.

---

## Area effect library

Universal single effects for **In this Area**. Compose by mixing picks. Many lines are **universal templates** that you specialize per zone (topic, keyword, or card set).

### Symbol

| Print | Meaning |
|---|---|
| **! Danger** | Danger (red **!** in front; word **Danger** in normal ink) |

In the Travel Book always write **`! Danger`** (red exclamation, then the word). The viewer styles only the **!** in red; a bare `❗` in source becomes `! Danger` when shown.

### Defaults (! Danger)

| Challenge kind | Default | Area may… |
|---|---|---|
| **Roaming** (animals, skeletons, patrols, …) | **! Danger on** | **Remove** ! Danger on special quiet / warded / pilgrim Areas |
| **Environment** (obstacles, decay, rubble, …) | **! Danger off** | **Add** ! Danger on special lethal-ground Areas (e.g. all Decaying have ! Danger) |

Do **not** print “roaming have ! Danger” on normal Areas — that is baseline. Only print ! Danger changes when you **override** the default.

### Balance (when composing)

- Net harder → net richer (Finds / supplies / Scout / Prepare).
- Net easier → net poorer (less loot / Finds).
- Removing roaming ! Danger usually costs barren supplies or weaker Finds.
- Giving environment ! Danger usually pays with Materials or richer Finds.

### Specialization (zone-specific)

Write the universal effect, then name the zone set:

| Universal | Zone examples |
|---|---|
| +1 Difficulty to [topic] | vs Skeletons · vs Animals · vs Decaying |
| [set] have ! Danger | all Decaying · all Obstacles · all Animals |
| −! Danger on [set] | −! Danger on Skeletons · −! Danger on Animals |
| +1 Materials from [Work kind] | Blocked Path Work · debris Work · forage Work |
| Finds use [map] | Collapse Chamber map · richer drowned table |
| +N Resistance on [set] | +1 Resistance on Skeleton Archers · +1 Resistance on Skeletons · +1 Resistance on Falling Stone |
| +1 Challenge Power on [set] | +1 Challenge Power on all challenges · Skeletons gain +1 Challenge Power |
| On Reveal [challenge / topic]: +1 travel time | On Reveal Fog Patch : +1 travel time · On Reveal Animals : +1 travel time |
| **Heat** / **Cold** | Hot forge, ash waste, high pass, cellar chill — garb **Warm** / **Cool** on the doll (see **`docs/garb-doll.md`**). Print the tax; do not sum garb numbers. |

### Challenge Resistance (tokens)

**Challenge Resistance** is how many successful Actions a challenge absorbs. Each Action **reduces Resistance by 1**. At **0** the challenge is **overcome**. Fiction may be **more of them** (a pack) **or** **one much stronger** (a captain who will not stay down). Same tokens either way.

Default is **1**. Cards may print **`Resistance: 2`**, but keep that uncommon. **Travel Book Areas are the main layer** — they raise named challenges or topics while you are here.

Play rules (full): **`CurrentRulesDesign.md`** · Challenge Resistance.

| Rule | How it plays |
|---|---|
| **Base** | Printed `Resistance:` (missing = **1**) |
| **Area bonus** | Add the Area’s `+N Resistance on …` when that challenge is revealed here |
| **Tokens** | Place that many tokens (printed 1 + Area `+1 Resistance on Skeleton Archers` → **2**) |
| **Action** | A successful challenge Action removes **1** token |
| **Rewards** | **Each** token removed pays that Action’s **open rewards** (Materials, Spirit, recipe ticks, spend costs, …) |
| **Overcome** | Last token gone → card leaves Close. **Search / Find Discovery** claims **once** on that last chip if the Action was Search |

Example: **`+1 Resistance on Skeleton Knight`** — two Actions (and two Fight payoffs if you Fight twice). **`+1 Resistance on Skeletons`** — every skeleton here takes one extra Action and pays one extra matching reward.

Do **not** raise Resistance on Side Branch Detours unless you mean two paid Searches (the wreck still claims once). Prefer +Resistance on a **higher layer** (Archers, debris, decaying) as that layer’s one-time packet — not as a farm you keep after the clear.

### Triggered travel time

A special Area may grow longer when a matching challenge appears. This is **not** a wilderness default — use it only when this stretch’s fiction is “this card can cost you extra time.”

| Rule | How it plays |
|---|---|
| **Printed Difficulty** | Leave `difficulty: N` as written. Do **not** also take **B23** / rewrite the signpost note on the same Area |
| **Trigger** | When a matching challenge is **revealed**, add **1** to this Area’s Difficulty to leave |
| **Play length** | That extra point is **+1 Area Length** (draw 1 from the Zone Deck onto the bottom of the Challenge Deck) |
| **Repeat** | Each matching reveal adds another Difficulty / Area Length |

Example Area line: **`On Reveal Fog Patch : +1 travel time`** — printed `difficulty: 7` stays; each Fog Patch revealed here makes the crossing 8, then 9, …

---

### Bad (pressure)

| ID | Effect |
|---|---|
| B01 | +1 Difficulty to Traverse challenges |
| B02 | +2 Difficulty to Traverse challenges |
| B03 | +1 Difficulty to Fight challenges |
| B04 | +1 Difficulty to Work challenges |
| B05 | +1 Difficulty to Awareness challenges |
| B06 | +1 Difficulty to [topic] challenges |
| B07 | [environment set] have ! Danger |
| B08 | On Reveal Exhaust on environment challenges |
| B09 | On Reveal Exhaust on environment even if Scouted |
| B10 | Covering 1 on environment while revealed |
| B11 | Blocking more common / Blocking +1 while here |
| B12 | −1 Scout (Scout outcomes weakened) |
| B13 | −1 Materials found |
| B14 | −1 Rations found |
| B15 | −1 Spirit found |
| B16 | −1 Finds / barren Discovery table |
| B17 | Fight restricted (Exhaust if you choose Fight) |
| B18 | Retreat harder (or ! Danger locks Retreat longer) |
| B19 | Detours lean into +Path Length |
| B20 | Traverse miss: +1 Exhaust |
| B21 | Trail Use Rations: −1 Stamina gained |
| B22 | Recovery outcomes −1 |
| B23 | Higher Difficulty (`difficulty:` 9–10) — static printed band only |
| B24 | +1 Resistance on [challenge / topic] (extra Action — extra open rewards / ticks; pack **or** one tougher foe) |
| B25 | +2 Resistance on [challenge / topic] |
| B26 | On Reveal [challenge / topic]: +1 travel time (leave printed Difficulty unchanged) |
| B27 | +1 Challenge Power on [set] (all challenges, or a topic) |
| B28 | **Dangerous Camp X** — stay option (see Stay options), not an In this Area line |
| B29 | **Heat** — extra Exhaustion here; **Warm** garb worsens it, **Cool** garb protects (glance tags, do not stack) |
| B30 | **Cold** — extra Exhaustion here; **Cool** garb worsens it, **Warm** garb protects (glance tags, do not stack) |

Name the card in Area text, e.g. `+1 Resistance on Skeleton Archers`, `+1 Challenge Power on all challenges`, `On Reveal Fog Patch : +1 travel time`, `Heat`, `Cold`. Print **Dangerous Camp 1** under **Available Actions**.
---

### Good (payoff)

| ID | Effect |
|---|---|
| G01 | −1 Difficulty to Traverse challenges |
| G02 | −1 Difficulty to Fight challenges |
| G03 | −1 Difficulty to Work challenges |
| G04 | −1 Difficulty to Awareness challenges |
| G05 | −1 Difficulty to [topic] challenges |
| G06 | −! Danger on roaming challenges |
| G07 | −! Danger on [environment set] (if something granted it) |
| G08 | +1 Materials found |
| G09 | +1 Materials from Blocked Path / debris Work |
| G10 | +1 Rations found |
| G11 | +1 Spirit found |
| G12 | +1 Spirit or Materials from Fight vs [topic] |
| G13 | +1 Find on Awareness outcomes |
| G14 | Finds use a richer Discovery map / table (always a result — better rows, not a loot die) |
| G15 | +1 Scout from successful Awareness |
| G16 | Scout outcomes +1 |
| G17 | Prepare Traverse outcomes stronger |
| G18 | Prepare Fight outcomes stronger |
| G19 | +1 Recovery on Awareness outcomes |
| G20 | Detour Rest easier / Secure softer |
| G21 | −1 Path Length once |
| G22 | Lower Difficulty (`difficulty:` 5–6) |

---

### Neutral (neither clearly good nor bad)

These change how the Area plays without a fixed “reward” or “tax” label. Pair them with bad/good lines for balance.

| ID | Effect | Why neutral |
|---|---|---|
| N01 | +1 Vision | See more — also more On Reveal / row pressure |
| N02 | −1 Vision | See less — fewer early reveals, more surprises |
| N03 | Vision +1 for the next Move only after Scout | Timing shift, not flat power |
| N04 | Reveal order / placement bias (e.g. environment before roaming) | Changes pacing |
| N05 | Swap Find table / Discovery map (different, not strictly richer) | Different story, same EV if tuned |
| N06 | Topic weight bias (draw feel: more environment / more roaming) | Only if you have a legal way to bias |
| N07 | Day/Night side locked or favored | Campaign time fiction |
| N08 | Cleared-Path travel still free but Hours count for time | Time fiction only |
| N09 | Rename / aura tag only (Flooded, Den Territory, Unstable, Hot, Frozen) | Reminder; add real B/G lines for mechanics |
| N10 | Forced Activity flavor at arrival Area (pointer) | stay-option rules, not Area travel math |

**Vision (N01 / N02):** higher Vision is informative and can trigger bad On Reveal earlier; lower Vision hides threats and hides opportunities. Treat as neutral unless another line makes the intent clear.

---

### How to build an Area effect list

1. Pick fiction.
2. Leave roaming ! Danger alone unless this Area is specially safe (**G06**).
3. Add environment ! Danger (**B07**) only for lethal ground (e.g. all Decaying have ! Danger).
4. Add 1–2 bad and 1–2 good (and optional neutral).
5. Check net pressure vs net payoff.

**Compose examples**

```text
# Clear road
- G01 (−1 Traverse)
- B13 (−1 Materials)

# Climbing ridge
- B01 (+1 Traverse)
- G15 (+1 Scout from Awareness)
- N01 (+1 Vision)          # optional neutral

# Quiet chapel (overrides roaming default)
- G06 (−! Danger on roaming)
- B13 (−1 Materials)
- G19 (+1 Recovery on Awareness)

# Archer gallery (extra Resistance — pack or one hard marksman; Fight pays twice)
- B24 (+1 Resistance on Skeleton Archers)
- G12 (+1 Spirit or Materials from Fight vs Skeletons)
- B03 (+1 Fight Difficulty)

# Decay-haunted corridor (environment ! Danger special case)
- B07 (all Decaying have ! Danger)
- G09 (+1 Materials from debris Work)
- B01 (+1 Traverse)

# Flooded
- B02 (+2 Traverse)
- B09 (Exhaust even if Scouted)
- G14 (richer Find map)

# Mist (Vision neutral + trade)
- N02 (−1 Vision)
- B05 (+1 Awareness Difficulty)
- G13 (+1 Find on Awareness)

# Hot forge / ash (garb Warm hurts, Cool helps — docs/garb-doll.md)
- B29 (Heat)
- G09 (+1 Materials from debris Work)

# High pass / cellar chill
- B30 (Cold)
- G01 (−1 Traverse)          # only if the fiction is a known road, not the tax itself

# Lost trail (triggered extra time; printed Difficulty stays)
- B26 (On Reveal Fog Patch : +1 travel time)
- G13 (+1 Find on Awareness)

# Uneasy woods / wall-walk (can sleep, not a safe camp)
- Dangerous Camp 1          # Available Actions, with Camp
- G10 (+1 Rations found)    # or other payoff so the tax has a reason
```

---

## Fields in `TravelBook.md`

**Area (threshold / hub — stay options, per-exit Difficulty):**

```yaml
+++
id: 1
kind: area
name: Main Entrance
zone: Ruined Castle
page: A1
difficulty: 0
+++

Optional flavor…

### Available Actions
- Camp: Recover 4 Stamina per Ration spent
- [A] 3 Study the Gate Carvings : Scout 1

### Paths
- Floor Stair leads to [A2] Ground Floor Difficulty 5
- Upper Stair leads to [A3] Upper Floor Difficulty 5
- Main Door leads to [A5] Outside
```

**Area (large floor — Area exploration, per-exit Difficulty):**

```yaml
+++
id: 2
kind: area
name: Ground Floor
zone: Ruined Castle
page: A2
+++

### Available Actions
- Area exploration
- Camp: Recover 3 Stamina per Ration spent

### In this Area
- +1 Difficulty to Traverse challenges

### Paths
- Gate Door leads to [A1] Main Entrance Difficulty 7
- Stairs lead to [A3] Upper Floor Difficulty 7
- Stairs lead to [A4] Cellar Difficulty 9
```

| Field | Meaning |
|---|---|
| `id` | Stable id for UI / `game.html` |
| `kind` | Always `area` (aliases: `crossing`, `landmark`, `path` → area). `map` for chapter maps |
| `name` | Area name, or `Section · Name` |
| `section` | Optional Section (also from `name` before `·`) |
| `zone` | Zone Deck name in title brackets |
| `page` | Printed **`A#`** (Area number; Area 1 is **A1**) |
| `difficulty` | Default deal to use exits → **(Difficulty N)** on the path line; `0` / omit = free. A line may override with its own `Difficulty N`. |
| `setting` | `indoor` (default) or `outdoor` |
| `tag` | Optional map label: `Settlement`, `Camp`, `Dangerous Camp` |
| `map_x` / `map_y` | World map cell |
| `### Available Actions` / `### You must` | Action lists (aliases: `While you stay`; omit You must if empty) |
| `### In this Area` | Area modifiers (aliases: On this Path / On this Area) |
| `### Paths` / `### Leads to` / `### Exits` | Exit lines (`Way leads to [A#] Destination`); optional `(hidden)` and `([T] Climb N)`; legacy `### Passages` merges into Paths |
| `### Sees` | Look-from-afar (`[A#] Name`). May be another **Zone**. Map only (dotted). Do not print on the Area page. Not a Path. |

---

## Design process

### 0. Sketch the graph first

Draw the fiction map, carve into **Areas** so exit Difficulties stay honest (see World model). Group them into **clusters** with settlements on the rim. Assign **`A#`** to every Area. Mark each Area’s **return reason** (next layer / camp or settlement / connector / peak) and each major Path’s **payload**. One-shots go on a layer, a camp, or a shortcut.

### 1. Fill each Area

- Title: `section:` + `name:`, or `name: Section · Area`
- Stay options and/or **In this Area** as needed
- `difficulty: 0` (or omit) for free exits; **5–10** (prefer **6–8**) when travel costs; **per-exit** when openings differ
- Exits under **Paths** (or **Leads to** / **Exits**) — playtest: discovered names already filled in

### 2. Consistency pass

- [ ] Every `[A#]` on an exit exists as a page
- [ ] Stay options use **Available Actions** / **You must** only
- [ ] Exit lines are `Way leads to [A#] Destination`; the way names the opening (Breached Gate, not Gate)
- [ ] **Paths** has **at most 4** exits (or the Area is split / grouped)
- [ ] Difficulty is **symmetric** unless an asymmetric climb-style exception; coarse floors may use **per-exit** numbers
- [ ] **Return path** on each edge is **at most 2** when retracing (printed number may be higher for first approach)
- [ ] Challenge Areas sit in **5–10** (prefer **6–8**); hubs use **0** / low on visible doors
- [ ] Each **In this Area** list uses library singles and stays balanced
- [ ] Roaming ! Danger is default (only special Areas remove it); environment ! Danger only if the Area adds it
- [ ] Large Areas may print **Area exploration**; safe rooms use only Camp / activity options (no **Dangerous Camp**)
- [ ] **Dangerous Camp X** only on uneasy camps along a road, never on safe settlement rooms; Pass through skips it
- [ ] Unique stairs / gates / forks are Travel Book or Discovery Book — not zone cards
- [ ] Each Area you mean to master has a **next layer** the first visit cannot finish; after the top layer, the page is a camp, a connector, or done
- [ ] An open layer names **which challenge types** live here so Recipe/Tool ticks have a map. Repeating a cleared layer does not keep paying those ticks
- [ ] Each **major Path** ends in a payload (not an empty spur); connectors are not a richer prize than the layer they serve
- [ ] One-shot finds sit on a layer, a camp, or a shortcut
- [ ] Sparse **leaks**: at most a few Recipe/Tool boxes whose source is another Area or Zone; print challenge names, not map codes
- [ ] Challenge Areas sit in **clusters** with **one or more** settlement gates; hops/`Ch.` to a settlement stay in a similar band from every Area (harder gates are pockets / optional next-town routes, not the only way onward)
- [ ] **Sees** only for flavor views with **no** Path; `[A#]` exists; other Zones allowed (dotted / flavor only, not travel); not printed on the Area page

---

## Blank worksheet

```markdown
### Area · A___ · ___
### [___]   # Zone; optional Section above

**Difficulty:** ___ (0 = free exits; else 5–10, prefer 6–8)

**Return reason:** next layer / camp / settlement / connector / peak

**Available Actions** (omit if none)
- Camp: Recover 4 Stamina per Ration spent
- Dangerous Camp ___   # omit on safe camps
-

**You must** (omit if none)
-

**In this Area** (omit if none)
-

**Paths:**
- ___ leads to [A__] ___

**Sees** (omit if none; map dotted only; no Path to that Area)
- [A__] ___
```

---

## Example network (Mouten cluster)

Prototype pages in **`TravelBook.md`**. **Playtest: all transitions discovered.** Two rim settlements: **Mouten Village** (Forest) and **Chapel Cellar** (conscious skeletons — heal and trade). **Old Forest** = woods; **Ruined Castle** = keep. **Gate House** = Skeleton Knight boss. **Courtyard** = skeleton farm. Chapel wing = better wrecks; **Ground Hole** woods ↔ **Cellar · Great Hall** = short Climb (hidden). **Intact Tower** = Camp. **Ruined Castle Woods** = Dangerous Camp. Woods I / II leftover jobs still open.

**Return path:** retracing the connection you just used is Difficulty **at most 2**.

| A# | Zone | Role |
|---|---|---|
| A12 | Old Forest | Mouten Village · Settlement |
| A13 | Old Forest | Wooded Mouten · forest gate (4) |
| A14 | Old Forest | Woods I |
| A15 | Old Forest | Woods II |
| A8 | Old Forest | Ruined Castle Woods · Dangerous Camp |
| A1 | Ruined Castle | Gate House · Skeleton Knight boss |
| A2 | Ruined Castle | Wall Walk |
| A6 | Ruined Castle | Intact Castle Tower · Camp |
| A3 | Ruined Castle | Courtyard · farm |
| A4 | Ruined Castle | Castle Buildings |
| A5 | Ruined Castle | Cellar · Buildings |
| A7 | Ruined Castle | Great Hall · chapel-wing wrecks |
| A9 | Ruined Castle | Chapel · better cost/reward |
| A16 | Ruined Castle | Cellar · Great Hall · Climb leak |
| A10 | Ruined Castle | Chapel Cellar · Settlement |

---

## Zone chapter map (`kind: map`)

The cluster map is a **separate page**: **`TravelMap.html`**. Area pages live in **`TravelBook.html`**. Zone names in the book (`[Old Forest]`) open the map. Map marks open the matching book page (`TravelBook.html?page=A12`).

Keep a **map** spread in **`TravelBook.md`** before the Area pages so the map has a title. One cluster may share **one map** (Forest + Castle). Marks show the printed **number**, **`A#`**, name, and **[Settlement] / [Camp] / [Dangerous Camp]** when tagged. Slight **zone tint** on each mark; a **legend** sits beside the grid.

Travel edges are **brown**: **thick** if visible on first visit, **thinner** if `(hidden)`. **Dotted brown** lines are **Sees**. An **action gate** is a text chip on a travel line (`[T] Climb 3`). Marks are clickable.

```yaml
+++
id: 0
kind: map
name: Mouten
zone: Mouten
+++
```

---

## World map coordinates

Assign each page a cell with `map_x` / `map_y` (x → right, y → down). Front of the place toward the top of the map.

**Mouten playtest map** is the **whole cluster** (village, woods, keep, cellar town) on one grid — not one architectural floor.

Other books may still use **one chapter map = one layer** and omit `map_x` / `map_y` on other floors.

Exit **signposts** compare this page to the destination:

| Dominant move | Sign points |
|---|---|
| Left (lower `map_x`) | **left** |
| Right (higher `map_x`) | **right** |
| Up (lower `map_y`) | **left** |
| Down (higher `map_y`) | **right** |

Example (Mouten cluster — village at the top, Chapel Cellar settlement at the bottom):

```text
                         (2,0) Mouten Village
                         (2,1) Wooded Mouten
            (1,2) Woods I                (3,2) Woods II
                         (2,3) Ruined Castle Woods
            (1,4) Gate House
(0,5) Intact Tower  (1,5) Wall Walk  (2,5) Courtyard  (3,5) Great Hall  (4,5) Cellar · Great Hall
                    (1,6) Castle Buildings            (3,6) Chapel
                    (1,7) Cellar · Buildings  (2,7) Chapel Cellar
```

---

## Transitions and the Discovery Book

**Travel Difficulty** = deal to *use* a known exit (Travel Book).  
**Discover Difficulty** = deal to *find* an unmapped transition (Discovery Book). **For now they are the same number** as that exit’s Travel Difficulty.

### When an opening is printed vs hidden

Print it on **Paths** when any of these is true:

1. You can **see** the opening from this Area (gate, hall, stair in the niche).  
2. This kind of place **always has one** (cellar vs a way up, keep vs a door outside).  
3. It has **already been discovered**.

Hide it (Discovery Book only) when there is **no honest cue** from this Area, it is not expected architecture, and missing it must not soft-lock the run. Secrets only — not the main stair of the keep.

Do **not** put those hidden openings in the challenge deck. Encounters stay repeatable types. Recipe/Tool **Treasure** is a per-Zone Search packet (see `CurrentRulesDesign.md`). The map lives in the books.

### How discovery play works (full game)

1. You are in an Area that still has unmapped transitions.  
2. Choose a Discovery Book page for this Area; its **Discover Difficulty** is the challenge-deck size.  
3. Explore (same loop as travel). When the deck is empty, **open that Discovery page**.  
4. It tells you: **this end’s name**, **destination `[A#]` / Area**, **the name printed on the far side**.  
5. Copy **both** ends into the Travel Book **Paths** lists. One note unlocks the edge both ways.

You may then use the exit at its **Travel** Difficulty (the same number; playtest: already written, so skip 2–5).

### Playtest

The Mouten cluster treats every transition as discovered. Travel Book names are the Discovery Book names. Use the Discovery Book as reference for what a find would have said.

---

## Working notes

Safe Areas (no challenges / special rest) — define later; not a separate page kind.

**Semi-permanent meaning** (see World model): revisit to master the next difficulty layer in the same Area. The first visit does not finish the place. After the top layer, unique rewards are done; the page may remain a camp or a connector. Named challenge types on an open layer are component **sources** for Recipe/Tool cards. Cross-zone recipe boxes are **leaks**. Connectors stay relevant as roads. **EXP** is gained everywhere and is not a reason one road is better. Challenge Areas group into **clusters** with settlements on the rim (see World structure).

**Dangerous Camp X** (see Stay options): choose Camp → draw X → overcome drawn ! Danger → then Rest. Extra clears / overflow Damage are the tax. Safe leftover-job camps omit it.

---

## Related files

| File | Role |
|---|---|
| `TravelBook.md` | Authoritative page content |
| `TravelBook.html` | Flip / print viewer for Area pages |
| `TravelMap.html` | Cluster map (same source; marks open the book) |
| `docs/design-goals.md` | Top-level aims (solo core, fast Help co-op, hop-in, horizontal pockets, layers-then-done, EXP anywhere) |
| `CurrentRulesDesign.md` | Camp / Pass through / activities / Search pile / Recipe/Tool Treasure |
| `docs/challenge-design-guide.md` | Zone cards (named sources, Search lines, not map forks) |
| `discovery-book.md` | Transition finds (Discover Difficulty + names both ends) |
| `discoveries.md` | Find linking notes |
