# Current Rules Design

Short reference for the current system design. Not a full rulebook — focuses on structure and key decisions.

**Why these rules:** **`docs/design-goals.md`**. Character growth: **`docs/class-progression.md`**.

**Current playtest target**: Tools are a **mode**, not a per-card menu and not a spend. Equip 4 Tools; **one** is **Active**. Close uses that tool’s matching Action line. Using a Tool does **not** cost Uses, Stamina, or any other tool resource — it only switches which printed Power / Stamina Values apply. **Switch Active**, **Repack**, **Use Rations**, and **First Aid** are legal during exploration, including while a challenge is in Close. A revealed **Danger** blocks them. Overcoming a challenge **automatically Moves** to the next position. Challenge lines must already be interesting with only Body + Active Tool — Masteries are extras, not the source of fun.

**Skills redesign (in progress)**: challenges are moving to the **plain four-Action format** — Action lines carry Power + outcomes only (plus **Detour** / **Rest Detour**); approach-conditional rewards and field effects (Ration/Material payoffs per line, typed Difficulty taxes) move to the **skill layer**. Challenge identity comes from approach-independent, position/timing effects (**Danger**, **Charge**, **Prepare 1 > Exhaust X**, **Blocking**, **Covering**, **Grouping**) — the track itself is the tactical surface, and skills (Bash, Mobility, Ambush, Halt, …) manipulate it. Characters equip up to **8 Skills** from a catalog (`cards.md → # Skills`): **Actives** cost Stamina and are clicked in the ability bar; **Passives** never need activation — they add Power on top of the Active Tool line (`Passive: base +X <Kind>`) or fire rewards on an overcome trigger (`When Animal overcome : +1 Rations`). Tool values stay the base of every Action line; skills stack on top.

Stamina is a **number** — the creator's maximum **plus Stamina from worn Garb and empty slots** — shown on the character card. Worn Garb pools three stats: **S** (adds Stamina), **Dur** (Durability — overflow drains it), and **WR** (reduces weather Exhaustion from Cold/Wet). **Empty doll slots give Stamina too** — uncovered skin breathes: an empty **Inner** slot gives **S 2**, any other empty slot **S 1**. Filling a slot replaces that base with the piece's own S. If Stamina is already maxed, leftover Exhaustion **drains Durability point for point** and stops the journey at the last crossing — at **0 Durability** it is Forced Retreat to the last settlement, where rest restores the pool. **First Aid** recovers up to half your maximum on the trail.

> **Vitality is an optional module and is currently inactive.** Do not use Vitality, Heal supplies, Vitality loss, or Body-action Vitality costs in the current playtest. The inactive module is retained below for later testing.

---

## Resources Overview

| Resource | Type | Tracked By |
|---|---|---|
| Stamina | Number: creator max + worn Garb S + empty-slot S (current / max on the card) | Character card |
| Durability | Pool: sum of worn Garb Dur (overflow drains it) | Character card |
| Weather Resistance (WR) | Value: sum of worn Garb WR (reduces Cold/Wet Exhaustion) | Character card |
| Backpack Capacity | Token field | Tokens on board |
| Rations | Supply (token field) | Tokens on board |
| Materials | Supply (token field) | Tokens on board |
| Hearty Meals / Potions / Bandages / Spare Parts / Lantern Oil | Special supply (token field, when Kit Equipped) | Tokens on board |
| Spirit | Currency (token field; 🪬) | Carried tokens on board; stored at a settlement |

**Base Supplies** (Rations, Materials) are always legal — treat them as living in always-available **base containers** (no Kit slot). Gaining 1 Supply moves **1** Strength from the Strength field onto that supply’s card/field; spending or losing 1 Supply returns it. At 0 Strength you cannot carry anything additional, but may drop carried Supplies or Tools to free Strength.

**Special Supplies** (Hearty Meals, Stamina Potions, Bandages, Spare Parts, Lantern Oil) are only tracked while you have their **Kit container Equipped** in a Kit slot. See Special Supplies & Containers.

**Containers are weightless.** Only supply tokens (and Tools / carryable **Discoveries**) occupy Strength — never the container card itself.

**Supply Weight constraint:** every Supply token is **Weight 1**. Do not print fractional or multi-Weight supply tokens — Strength tokens on a supply card must read 1:1 as “how many you carry.” Scale stronger effects by **Spend N** (use several tokens at once), effect size/timing, and buy cost — not by token Weight.

**Spirit** (glyph **`🪬`**) is the main currency, not a Supply. Carried Spirit does **not** occupy Strength (no Weight) for now. You may **trade** and **store** Spirit at settlements. Stored Spirit is safe if you Forced Retreat.

> **Removed from this draft**: shared Time track, hunger intervals, camping-by-hour rules, **Progress track**, **Retreat Pile / Pass vs Remove**, numbered Stamina track, **Wounds**, Breakdown tool-loss, and **Tool Uses / Worn / Maintain**. Journey length is the finite challenge deck dealt for the current path. Day/Night is a **Landmark** state tracked in quarter-days, not updated after each challenge. Overflow Exhaustion **Damages** garb and body slots (see Stamina). Tools are a free mode; they do not wear out.

---

## Strength & Carrying

- Default: 20. Can be modified by effects and character traits.
- **Every Supply token occupies 1 Strength** (Rations, Materials, Hearty Meals, Potions, Bandages, Spare Parts, Lantern Oil — all Weight 1).
- Every Tool costs its printed **Weight** in Strength, whether Equipped or in your Backpack.
- **Kit containers have Weight 0.** They never occupy Strength. Only an **Equipped** Kit unlocks its supply family (see Kit slots); the supplies inside still weigh 1 each.
- Strength never goes below 0. When you would gain or carry something that needs more Strength than you have, either do not take it or drop any carried Supplies or Tools until you have enough Strength.
- Reaching 0 Strength has no additional penalty. It simply prevents you from carrying anything more until you spend, sell, or drop something.

> **Design intent**: Strength tokens on a supply card are a clear 1:1 count. Containers only unlock *which* families you may carry. Balance bigger effects with **Spend 2+**, narrower timing, and higher Spirit cost — never with Weight-2 tokens.

---

## Stamina

Stamina is a **number**: the maximum set in the character creator, **plus Stamina from worn, undamaged Garb and empty slots**, shown on the character card (current / max). There are **no stamina boxes on the doll** — nothing to mark. Prototype holes: **`GarbSystem.html`**. Catalog: **`garb.md`**. Doll notes: **`docs/garb-doll.md`**.

**Empty slots breathe** — uncovered skin moves freely: an empty **Inner** slot (Head Under, Body Inner, Legs Inner) gives **S 2**, every other empty slot **S 1**. Filling a slot replaces this base with the piece's own S, so:

- **Light garb (S 1) on non-Inner slots** breaks even with staying empty — wear it for its Dur/WR, not for Stamina.
- **Padding (S 1–2) on Inner slots** buys Stamina only if S 2; padded Inner (S 1) is a net Stamina loss taken for Dur.
- **Not filling all slots is a valid Stamina build** — a character in light garb on torso, legs, feet, and hands with empty slots elsewhere out-staminas a heavily padded one, at the price of Durability and weather protection.

| Mark | Name | Used by |
|---|---|---|
| **S** | Stamina (number) | Every action |
| **Dur** | Durability (pool from Garb) | Overflow |
| **WR** | Weather Resistance | Weather exhaustion (Cold / Wet) |

- Gaining **X Exhaustion** from a challenge Action spends **X** Stamina from the pool. Worn Garb **adds Stamina** to the pool — it does not reduce Exhaustion directly.
- **WR** reduces Exhaustion from **weather effects** (Cold, Wet) exactly like an approach resistance: subtract WR before paying.
- **Rations** and other Recovery give stamina back (never above your maximum).
- Stamina does **not** refill for free at Landmarks. Recovery is paid with Rations (better rates at Landmarks) or **First Aid**.

You cannot Use Rations to avoid Exhaustion already committed — pay that Exhaustion first. Trail Rations are otherwise legal while a challenge is in Close, unless a revealed challenge has **Danger**. Committing with Stamina already at maximum is accepting overflow for that challenge.

### Overflow (Stamina is maxed)

If your Stamina is already at maximum and you would still gain Exhaustion, that leftover is **overflow**. Overflow **drains Durability point for point** — the exhaustion that does not fit into Stamina is carried fully into the Durability pool (capped at what remains).

1. Stamina resets to 0 used (you collapsed — the effort is spent).
2. Drain **Durability equal to the overflow** (e.g. 1 Stamina left + 6 Exhaustion → 5 Durability lost).
3. The journey stops at the **last crossing** (see Forced Retreat).

### Forced Retreat

When a collapse drains the **last** Durability (pool at 0), the expedition is over. **Forced Retreat** happens immediately and overrides Danger for this exit only. Lose **all Spirit you are currently carrying**. Spirit stored at a settlement is not lost. Retreat all the way to the **last settlement visited**.

**Settlement rest**: reaching a settlement restores all drained **Durability** and refills Stamina.

> **Design intent**: One number — the creator's Stamina value plus worn Garb — is the whole track, shown on the character card. **Durability** is the injury reserve that replaces per-piece garb damage: clothing as a whole absorbs your failures, and at 0 you are sent home to the settlement. **WR** makes weather gear matter — without it, Cold and Wet bite straight into Stamina. Banking Spirit still matters.

### First Aid

**First Aid** recovers spent Stamina — never above your maximum.

Recover up to **half of your maximum Stamina, rounded down**. You cannot recover more than is currently spent.

- **When:** During exploration unless a revealed challenge has **Danger**, or at a Landmark. Default: **spend 1 Bandage**. Camp may print a free First Aid; otherwise the trail needs a Bandage.
- Example: maximum 8, spent 5 → First Aid recovers up to **4**.

### Rest (settlement)

At a **settlement**, resting restores all drained **Durability** for free (see Stamina / Overflow).

| Service | Restores | Playtest cost | Notes |
|---|---|---|---|
| **Rest** | All **Durability** | Free (settlement rest) | Pool returns to its Garb + empty-slot sum. |

---


## Optional Module: Vitality *(inactive)*

- **Do not use this module in the current playtest.** When enabled, add Vitality and Heal to the Resources Overview; both occupy 1 Strength as Supplies.
- Character Vitality is in the **6–8** range. **Default: 7.** The maximum is printed on the character's Body card.
- Each Body action spends **1 Vitality**. Specific injury effects, such as Venom or Bleeding, may also cause Vitality loss.
### Wounded (Vitality reaches 0)

> Not used in the current playtest. This section applies only if the Vitality module is enabled.

At **0 Vitality**, you cannot choose Body actions or pay a Vitality cost. If a Vitality loss would take you below 0, reduce Vitality to 0 and gain **1 Exhaustion for each Vitality not lost** instead.

### Heal

**Heal** is a Supply. Spend **1 Heal** to restore **1 Vitality** (not above your maximum). Heal may be spent during exploration unless a revealed challenge has **Danger**, or at a Landmark, never while Exhaustion from the current Action is still unpaid.

> **Design intent**: Vitality is the injury reserve and the cost of relying on your Body instead of equipment. Stamina represents immediate effort; Vitality represents how much punishment and self-reliance the character can still absorb.

---

## Garb

> **Playtest change (garb pools):** worn Garb gives three pooled stats — **Stamina (S)**, **Durability (Dur)**, and **Weather Resistance (WR)** — summed across every worn, undamaged piece, **plus Stamina from empty slots** (Inner S 2, others S 1 — see Stamina). **S** adds to the Stamina pool (it no longer reduces Exhaustion directly); **Dur** is the pool that exhaustion overflow drains; **WR** reduces Exhaustion from **weather effects** (Cold / Wet) like an approach resistance. The **character card** shows the three totals below the tool line: Stamina pool (current/max), Durability pool (current/max), and the WR value. There are **no stamina boxes anywhere on the doll**; empty slots show their ghost **S** chip on the doll.

Garb is clothing on the **doll**, not a second Tool board. Each hole is either empty (grants its empty-slot Stamina) or filled with a piece that adds to the three pools. Close is Power → Stamina Values → spend Stamina from the pool; overflow drains Durability (see Stamina).

Layered doll (zones, Heat/Cold tags, sneak as Traverse): **`docs/garb-doll.md`**. Prototype: **`GarbSystem.html`**. Catalog: **`garb.md`**.

- Garb does not prevent losing Supplies, challenge cards, or other non-Exhaustion effects.
- Removing a worn piece lowers its pool contributions immediately (Stamina pool can shrink below what is already spent).
- Weather exhaustion (Cold / Wet) is reduced by **WR** before it is paid.

---

## Challenge Deck & Travel

Distance to the next Landmark is printed as its **Required Challenges** in the Landmark Atlas.

**Starting a path:** Shuffle the full listed Zone Deck, then draw that many cards and place them face down as the path's Challenge Deck. Leftover Zone Deck cards stay out of this stretch (they are not part of the Challenge Deck). Starting a path ends any free return to the previous Area.

- **Progress** is the number of challenges you **overcome** on this stretch. **Required Challenges** is the number you need. Each overcome counts as **1**, unless the Action that reduced Resistance to **0** prints **Detour** — that clear does not count. When progress reaches Required Challenges, you **arrive**, even if cards remain. Leftover cards return to the Zone Deck with the rest of the stretch.
- If a **Detour** leaves you short of that number and the Challenge Deck has run out, draw the missing challenges from the Zone Deck and continue.
- Each challenge you **overcome** (Resistance reaches **0**) is set aside for this path (path discard), unless the Action that reduced it to 0 was a **Search** — then it goes to the **Search pile** instead (see Discovery).
- **Challenge Resistance** is how many successful Actions a challenge absorbs before it is overcome (see Exploring). Default **1**. Printed **2** is allowed but uncommon. Travel Book Areas are the main layer (`+N Resistance on …`). **Open rewards fire each time Resistance is reduced**, not only when the card leaves play.

**Ending a path (arrive or abandon):** Resolve the **Search pile** first (take each unclaimed Recipe/Tool from those Searches — **no roll**), then return **all** challenges from this stretch — remaining Challenge Deck, revealed unresolved cards, path discard, and Search pile — to the Zone Deck. The Zone Deck does **not** deplete across the expedition; the next uncleared path shuffles the full Zone Deck again and deals a fresh Challenge Deck.

### Travel

When progress reaches that path’s **Required Challenges**, you **arrive** at that destination automatically.

### Cleared Paths

When you Travel and **arrive** at a Landmark, note the path you just completed as **Cleared** (e.g. connect the Landmark page numbers or ids for that stretch), resolve the **Search pile**, and return all of this stretch's challenges to the Zone Deck (see Ending a path).

- A path becomes Cleared only on successful arrival. An unfinished stretch (Retreat mid-path) is not Cleared.
- Each Cleared path this expedition increases **Paths Cleared** by 1. This is path clears, not a separate “landmarks reached” counter. It does **not** modify loot.
- For the rest of this expedition, travel along a Cleared path draws **no** Challenge Deck and has **no** cost (no Stamina, Rations, or Exhaustion tax).
- Cleared paths last until the expedition ends at a **settlement** (voluntary return or Forced Retreat all the way home). Starting a new run from a settlement begins with no Cleared paths and **Paths Cleared = 0**.

> **Design intent**: Printed Required Challenges is the progress you must earn. A Detour is a clear that does not earn it, so the stretch continues until the count is met. Cleared routes are the free return line home. The Zone Deck stays a stable encounter pool — reshuffle full after each stretch.

---

## Day / Night (Landmark time) (inactive)

Day and Night make the **same path** play differently depending on when you leave. There is no clock and **no Day/Night update after each challenge**.

**Components:** one double-sided **Day/Night card**, plus one **quarter-day token** placed on that card.

## State during a path (inactive)

- When you leave a Landmark, the current Day/Night side (and whether the quarter-day token is on the card) is locked for the whole path.
- Challenges may print **Day:** / **Night:** lines; only the matching side applies. Cards with neither line ignore the cycle.
- Rare effects (**Night Falls**, **Dawn**) may still flip mid-path — the card is the reminder — but the normal cycle never advances during a path.

Landmarks are chosen by distance (Required Challenges) and sight/Atlas knowledge. Time of day is *when* you travel the next stretch, not a separate path picker.

## At the Landmark (inactive)

> **Active visit rules** (Camp / Pass through, forced & bonus activities, Stay longer) live under **Landmarks** below. This subsection is only the old Day/Night time-cost framing.

When you Travel and arrive at a Landmark, resolve arrival effects and choose one of these options. There is no separate automatic time advance: the option's time cost includes reaching and stopping at the Landmark.

| Choice | Time cost | Benefits |
|---|---|---|
| **Short stop** | Advance **1 quarter-day** | Repack Tools freely; spend Rations for **+2 Stamina** each. |
| **Camp** | Advance **2 quarter-days** (half a day) | Repack Tools freely; spend Rations for **+4 Stamina** each; Landmark bonuses may add more. |

To advance one quarter-day: if the quarter-day token is off the card, place it on the current Day/Night side. If it is already on the card, remove it and flip Day ↔ Night. Advancing twice always flips the Day/Night side and leaves the token off.

This gives a group near nightfall a direct choice: make a Short stop and leave at Night, or Camp to leave in Daylight with more recovery.

## Starting the game (inactive)

Begin at the first Landmark on **Day**, quarter-day token **off** (or as the Landmark page says).

> **Design intent**: Same Zone Deck, different Day/Night modifiers. Tracking happens only at Landmarks. Choosing Short stop or Camp determines both recovery and how far the Day/Night state advances.

---

## Rations (Recovery)

Rations are the primary **Stamina recovery** supply — **one resource** for trail and Landmark. They occupy Strength while carried; spending them frees Strength. Trail spend and Landmark spend draw from the same pile (eating on the path shortens camp recovery and later soft gates).

### Use Rations

Spend **1 Ration** to recover Stamina (cannot recover above your maximum):

| Where | Recovery | When |
|---|---|---|
| **Trail (exploration)** | 2 boxes | Any time during exploration, unless a revealed challenge has **Danger**. Pay committed Exhaustion first |
| **Camp** (Landmark) | 4 boxes | Choose **Camp** at a Landmark (plus any printed Rest modifier) |

**Pass through** a Landmark does not use the Camp Ration rate (no Landmark Rest). Day/Night **Short stop** rates in the inactive time module are separate.

Landmark pages may print Rest modifiers (e.g. **Resting Place +1** → +5 per Ration while Camping there; uneasy sites may print **−1**).

There is **no hunger timer**. Rations are also spent when a challenge Action requires them or a card effect says so.

**Trail finds**: Zone cards (forage, berry bushes, caches, etc.) may grant Rations mid-path. Those refill the **same** pile — partial top-ups so early trail spending does not strand the run, without removing the need to pack for multi-Landmark journeys.

> **Design intent**: Soft gate before overflow Damage. +2 on the trail preserves supplies; +4 while Camping (plus place modifiers) rewards stopping. Pass through skips Rest and forced activities. Strength already taxes packing enough fuel vs Materials and loot.

---

## Materials

- Supply item. Gained by finding in the Zone Deck or through Landmark-specific options, or bought at settlements.
- Used for specific challenge actions (e.g. Building). Building spends stay on Materials unless a card prints Spare Parts.
- Materials do **not** restore Tools. Tools have no Uses and do not become Worn.

---

## Special Supplies & Containers

Playtest draft. Base Rations and Materials stay the efficient staples. Specials are spike timing/job supplies: container-gated with a carry cap.

| Layer | Role |
|---|---|
| **Base** (Rations, Materials) | Always legal via base containers, best everyday efficiency |
| **Special** | Spike timing / job, needs an extra Kit Equipped + carry cap |

**One weight model (do not mix):** containers are **weightless**; **every supply token is Weight 1**. Base and extra containers work the same way — only difference is base containers are always available, extras need Kit slots.

**Balance levers for supply effects** (Weight is not a lever):

1. **Spend N** — how many tokens the effect costs (usually 1; multi-spend for chunkier effects)
2. **Effect size and timing** — how strong, and when it is legal
3. **Acquire cost** — settlement Spirit, find rate, Kit slot, carry cap

**Vitality Heal** stays inactive. Bandages interact with **First Aid** (Stamina recovery) only.

### Kit containers

Containers are **Kit** cards — not Tools. **Weight 0**, no action row, do **not** use the 4 Tool Equip slots. They use a separate **Kit slot** track. Example cards live in [cards.md](cards.md) under Kit Containers.

**Kit slots (playtest): 2.** Equip up to **2** extra Kit containers at a time. Extra containers may be stowed (still Weight 0) but do **not** unlock their supply family until Equipped. Swap Kit during exploration unless a revealed challenge has **Danger**, or freely at a Landmark — same timing as Tool Repack, but no Stamina cost for Kit swaps in this draft.

Empty Equipped containers cost **1 Kit slot** only (no Strength) — that is the specialty commitment.

| Container | Weight | Unlock | Carry cap |
|---|---|---|---|
| Potion Belt | 0 | Stamina Potions and Lantern Oil (shared cap) | 3 total |
| Mess Kit | 0 | Hearty Meals | 4 |
| Medicine Box | 0 | Bandages | 3 |
| Repair Box | 0 | Spare Parts | 3 |

Without the matching container **Equipped**, you cannot carry that special supply (see Loot without the right container). If you unequip or stow a Kit while its supplies are still carried, immediately resolve those tokens as denied loot (Spirit or leave) unless another Equipped Kit of the same type remains (normally only one of each type).

### Special supply list

All special tokens are **Weight 1**. Settlement **buy** examples relative to base Rations (~0.25 Spirit each; 4 Rations for 1 Spirit). Sell specials at **0.5× buy** when sold as goods.

**Camp baseline:** 2 Rations → recover **8** filled boxes for **0.5 Spirit** and 2 Strength, and those Rations could have been used on Trail/Short stop instead. Specials that match that Stamina total should be worse on Spirit cost, flexibility, or both.

#### Hearty Meal
- **Effect**: Camp only. **Spend 2** Meals → recover **8** Stamina. Not usable on Trail or Short stop. You cannot spend 1 Meal alone for a partial effect.
- **Weight**: **1** per token
- **Cost**: **2 Meals for 1 Spirit** (0.5 Spirit each) — same Camp Stamina as 2 Rations, but **2×** the Spirit cost, Camp-only, needs Mess Kit
- **Container**: Mess Kit (cap 4 → up to two feasts)
- Packs as clear Weight-1 tokens; the chunkier meal is the **Spend 2** requirement.

#### Stamina Potion
- **Effect**: After a Close-challenge action resolves Exhaustion, **Spend 1** Potion → recover **2** Stamina. Once per action. This spends after the hit is paid, which Trail Rations cannot undo.
- **Weight**: **1**
- **Cost**: **1 Spirit** each (≈ 4 Rations) — same Stamina as one Trail Ration, priced as a panic spend after the hit is already paid
- **Container**: Potion Belt (shares cap 3 with Lantern Oil)
- Optional spike (same belt): **Spend 2** Potions after one action → recover **4** Stamina instead (still once per action).

#### Bandage
- **Effect**: During exploration unless a revealed challenge has **Danger**, or at a Landmark. **Spend 1** Bandage → **First Aid** (recover spent Stamina, up to half your maximum, rounded down). Spend 2 → First Aid twice in one spend.
- **Weight**: **1**
- **Cost**: **2 for 3 Spirit** (1.5 Spirit each) — field Stamina recovery only
- **Container**: Medicine Box (cap 3)

#### Spare Parts
- **Effect**: At a **settlement**. **Spend 1** Spare Part → count as **1 Material** toward **Building** and other Material spends. (Spare Parts are now purely Building/Material fuel — Durability restores free at settlement rest.)
- **Weight**: **1**
- **Cost**: **2 for 1 Spirit** (0.5 Spirit each) — treat as ~**2×** a future Material buy price; Materials stay the bulk/found Building fuel
- **Container**: Repair Box (cap 3)

#### Lantern Oil
- **Effect**: When leaving a Landmark at Night, **Spend 1** Oil → ignore **one** printed Night penalty on the next path (or reduce the first Night Exhaustion tax by 2 — match the active Night modifier).
- **Weight**: **1**
- **Cost**: **2 for 1 Spirit** (0.5 Spirit each)
- **Container**: Potion Belt (shares cap 3 with Stamina Potions)

### Playtest balance snapshot

| Supply | Spend | Effect | Strength freed | Buy (Spirit) | vs base |
|---|---|---|---|---|---|
| Ration @ Camp | 1 | 4 boxes | 1 | 0.25 | staple |
| Hearty Meal | 2 | 8 boxes Camp only | 2 | 1.0 total | same Stam as 2 Rations; 2× Spirit; no Trail |
| Stamina Potion | 1 (or 2) | 2 (or 4) boxes after Close | 1 (or 2) | 1 each | timing spike, poor Spirit/Stam |
| Bandage | 1 (or 2) | First Aid once (or twice) | 1 (or 2) | 1.5 each | Stamina recovery; needs kit |
| Spare Parts | 1 | 1 toward Building / Material spends | 1 | 0.5 | generic Material filler; gated |
| Lantern Oil | 1 | Ignore 1 Night tax | 1 | 0.5 | Night-only |

### Loot without the right container

When a Zone or Landmark would grant a special supply you cannot carry (matching Kit not Equipped, at cap, or not enough Strength):

1. Gain **1 Spirit** per **2** specials denied (rounded down), or
2. Leave them.

Do **not** auto-convert into Rations or Materials. Choice-loot cards may still offer alternatives (e.g. "2 Rations **or** 1 Potion if you have a Potion Belt Equipped").

> **Design intent**: Weight-1 tokens keep the Strength field readable. Multi-spend is how chunky effects pay for Strength. Containers unlock families and cost Kit slots only. Specials win on spikes, not as better everyday bread.

---

## Body Card

Each character has a **Body card** determined by their Volk. It is not a tool — it has no Weight and is never equipped or swapped.

- In the current playtest, a Body card prints **Strength** and Body action lines (Power and signed Stamina Value). **Stamina is a number on the character card** (maximum from the creator). Body actions have no separate resource cost beyond their printed Stamina Values.
- Body actions have a **Power** value and signed **Stamina Value**. They are always less efficient than comparable tools: a Body action costs at least **1 more Stamina** than a tool with comparable Power.
- The inactive Vitality module adds a Vitality value and makes each Body action cost 1 Vitality.

> **Design intent**: Body is an unlimited fallback when the right tool is unavailable, but it costs more Stamina than a comparable tool. Tools remain the efficient choice through their lower Stamina cost, higher Power, and specialist effects.

---

## Tools

- Equip 4 Tools. Remaining Tools are in your Backpack.
- **One Equipped Tool is Active.** Close uses that tool. The other three stay Equipped (Weight, Help, later Switch) but do not pay Close.
- All Tools cost their printed Weight in Strength, whether Equipped or in your Backpack. Equipping a Tool makes it available to Switch onto.
- **Tools are a mode, not a spend.** Using a Tool does not cost Uses, Stamina, or any other tool resource. There is no Uses track. Tools do not become Worn. There is no **Maintain** action. Close with the Active Tool applies that tool’s printed Power and Stamina Values only — it does not consume the tool.
- Each Tool has a **Weight** (Strength cost) and a printed **Spirit** price (sell/buy baseline).
- A tool action may have a signed **Stamina Value** after its Power. For example, `[F] 8 -2 Fight` has Fight Power 8 and Stamina Value −2. That value is part of **challenge resolution** (compared with the challenge line), not a cost for owning or switching the tool. A positive Stamina Value provides Relief against a negative Stamina Value on the chosen Challenge.

### Active Tool (mode)

**Close with the Active Tool**

- If the Active Tool has a printed line for the Action you take on Close, use that line: compare Power, apply Stamina Values. Do **not** spend a tool resource.
- If it has **no** matching line, you may still take a printed **Power 0** / Body line on the challenge. Switch Active first if you want a different Equipped Tool for this Close.

**Switch Active:** Mark a different Equipped Tool as Active. Free — no Stamina, no other cost. Legal while a challenge is in Close. Illegal only while a revealed, unresolved challenge has **Danger**.

You can change jobs with the next card already in Close. **Danger** locks the current Active Tool when that challenge’s timing is active: a **While Revealed** threat as soon as you see it, a **While Close** threat only once it is in Close.

> **Design intent**: Seeing a Danger card coming, then still being on the wrong tool, is the decision. Skills and Masteries ask *when* a verb is good. They must not be required to make the stretch playable.

### Tool Power / Stamina Value Scale

| Tool Power | Typical printed Stamina Value | Intended role |
|---|---|---|
| 1–5 | none | Light or ordinary tool; efficient on routine challenges |
| 6–7 | `−1` | Strong or specialist tool; pays a small cost for its broader capability |
| 8–9 | `−2` | Heavy or exceptional tool; solves hard challenges but is tiring every use |

Positive Stamina Values are not generic recovery. Use them only on fitting specialist tools (such as a walking staff or climbing rope) to reduce a matching negative Stamina Value on a Challenge.

Printed Weight is a separate balance lever and applies even while a Tool is Equipped. Small items may remain Weight 1 despite high Power; bulky equipment should normally be Weight 2–4.

### Tool Profile Overview

| Tool type | Power / Stamina Value | Weight |
|---|---|---:|
| Light | 2–4, `0` or `+1` Relief | 1 |
| Standard | 4–5, usually `0` | 1–2 |
| Heavy | 6–7, usually `−1` Cost | 2–3 |
| Giant | 8–9, usually `−2` Cost | 3–4 |
| Charged / magical | often Power 6 with `+1` Relief | 1 |
| Consumable / setup | no normal Power line | 1–2 |

Weight and printed Stamina Values are the loadout levers. Durability is not — the Active Tool stays available for as long as it is Equipped.

### Recipe / incomplete Tools

Some Tools enter play as **zone Treasure** (see Discovery): a dual-face card with the **recipe** on the public face and the **finished Tool** on the hidden face.

- You cannot Equip or use the Tool until every printed component box is ticked (or the card was gained **already assembled**).
- Incomplete cards still occupy their printed **Weight** while carried. Pack only a few per expedition (playtest dial).
- Ticking a box is not a second mini-game and is **not** rolled: when you reduce a challenge’s **Resistance** using the **named Challenge + Action** on a packed recipe, tick one matching empty box. Extra Resistance (printed or from the Area) is extra ticks. The card is discarded / piled only when Resistance reaches **0**.
- When the last box is ticked, flip to the Tool face and use it as a normal Tool (Equip / Backpack / Strength as usual).

Cross-zone boxes are allowed: the recipe prints a **challenge name**, not a Travel Book location. Finding that challenge in another Zone is the leak.

### Switch Active vs Repack

**Switch Active** (mode): change which Equipped Tool is Active. Free. Blocked only by revealed **Danger**. See **Active Tool** above.

**Repack** (loadout): pay **1 Stamina** to exchange **one** Equipped Tool with **one** Backpack Tool. Blocked only by revealed **Danger**. A challenge in Close does not block it.

### Durability, Rest

**Durability** is the pool that exhaustion overflow drains (see Stamina). Tools are not Damaged by overflow and do not wear out.

**Restoring Durability:** at a settlement, rest restores all drained Durability for free. The pool returns to its Garb sum.

- **When:** Settlement rest only — the pool never recovers on the trail.
- Wearing different Garb changes the pool max immediately (sum of worn pieces' Dur).

> **Design intent**: Switch Active, Repack, trail Rations, and First Aid wait only on **Danger**. A challenge in Close does not lock them. Durability is the settlement bill for surviving overflow — one pooled reserve instead of wrecking individual pieces.

---

## Exploring

### Movement, Vision & Reveal

- **Movement 1** is the default. Effects may change Movement.
- **Vision** is printed on the Zone Deck title card. A path begins with **Close empty**. Only the **last Vision slot** starts revealed; nearer slots stay empty until you **Move**.

**Move X:** While Close is **empty**, slide every revealed challenge **X** slots toward Close (default **X = 1**). Then fill the empty trailing Vision slot from the Path Deck. If nothing is revealed, place one challenge in the last Vision slot (not into Close). **Do not** slide or fill Close while a challenge is still Close. When a challenge is **overcome**, this Move happens immediately — do not leave Close empty for a separate Move.

**Vision X:** The maximum number of revealed challenge slots is X (printed on the Zone title). Newly revealed challenges fill the farthest empty slot that has no later card beyond it.

**Reveal +X:** For the next Move only, increase Vision by X and reveal X additional new challenges beyond the normal fill. This is extra **vision**, not extra path length.

**Detour:** This overcome does not count toward progress. Print it on an optional ignore (walk past a tree, hut, or forage, or continue past a side branch). A mandatory cheap clear (wolf slip, thicket around) does **not** print Detour — it still counts.

**+X Path Length:** Draw that many cards from the Zone Deck onto the **bottom** of the Challenge Deck. This adds encounters. It does not change Required Challenges. 

### After an overcome

When a challenge is overcome, **Move immediately** (slide toward Close, then fill Vision). There is no pause with Close left empty.

**Use Rations**, **First Aid**, **Switch Active**, **Repack**, Kit swaps, and **Retreat** are legal during exploration, including while a challenge is in Close. They are blocked only by **Danger** (see Retreat & Danger for when a printed Danger is active). Fighting a challenge, including with a ranged line, is not blocked by Danger. Pay Exhaustion already committed before using Rations. Durability restoration waits for a settlement.

There is no separate **Move** action. While Close is empty, choose an approach on the first revealed challenge. That Moves until the challenge is in Close, then the action resolves. Overcoming a challenge still Moves automatically.

### Challenge Resistance

**Resistance** is how many successful challenge Actions it takes to overcome the card. Tokens on the card show remaining Resistance.

| Rule | How it plays |
|---|---|
| **Default** | **1**. Missing printed Resistance = 1 |
| **Printed** | A card may print **`Resistance: 2`**. Keep printed 2 uncommon — most cards stay at 1 |
| **Area** | Add the Area’s `+N Resistance on [name / topic]` when the challenge is revealed here. This is the **main** way Resistance goes above 1 |
| **Action** | A successful Commit / Resolve **reduces Resistance by 1** |
| **Rewards** | **Each** time Resistance is reduced, resolve that Action’s **open rewards** (Materials, Spirit, Rations, Recovery, Scout, spend costs, recipe ticks, …) |
| **Overcome** | When Resistance reaches **0**, the challenge is overcome: path discard, or **Search pile** if that Action was Search |

Fiction may be a pack **or** one tougher foe. Same tokens either way.

**Search / Find Discovery** is an **overcome** payoff: the card goes to the Search pile **once**, when Resistance hits 0 and that Action was Search. Do not claim the packet card once per chip.

A line that prints **does not reduce Resistance** (rare) still costs Exhaustion as written, but the card stays.

> **Design intent**: Harder Areas pay more because each chip is a full Action (Exhaustion) **and** a full open reward. Travel Book `+Resistance` is the farm dial. Printed 2 is a card exception, not the default.

### Exploration Steps

Each round all players act together in the following sequence:

1. **Move**: Not a separate action. A path begins with Close empty. An approach on the first revealed challenge Moves until that challenge is in Close, then resolves. On Reveal effects resolve for every newly revealed challenge. After an overcome, this Move is automatic (see Resolve).
2. **Commit**: Each player takes one printed Action on their **Close** challenge using their **Active Tool** (matching line) or, if that tool has no matching line, a printed Power 0 / Body line. An action **without Range** may instead be taken on the **first** revealed challenge. If that challenge is not in Close yet, **Move** until it is, then resolve. A **ranged** line may be taken on the closest challenge you can reach, including while you are in **Danger**. Options on challenges you cannot target are **out of reach**. Switch Active before this step if you want a different Equipped Tool, unless **Danger** blocks the switch. Calculate pending Exhaustion and place a die showing that value. Do not apply Exhaustion yet.

   Resolve pending Exhaustion in three steps:

   1. **Compare Power**: If Challenge Power is higher than Tool/Body Power, gain Exhaustion equal to the difference. Otherwise gain none from Power.
   2. **Apply Stamina Values**: Add the signed Stamina Values on the chosen Challenge and Tool/Body line. If the result is negative, gain Exhaustion equal to its absolute value. If the result is 0 or positive, it does nothing — it never restores Stamina.
   3. **Fill boxes**: Subtract **garb reduction** (S universal + matching typed value). Fill that many **S** boxes. If S boxes run out, **Damage** chosen Garb for the rest (see Stamina).

   Both the challenge and the chosen tool or body action print a **Power** value. Extra Power never creates Exhaustion. A negative Stamina Value is a **Stamina Cost**; a positive Tool/Body Stamina Value is **Relief**. Relief only cancels a negative Stamina Value on the chosen Challenge. It never reduces Exhaustion from insufficient Power, and excess Relief is ignored.

   *Example: Challenge `[T] 5 -2 Long March` vs. Tool `[T] 4 +1 Walking Staff` → 1 Exhaustion from Power, then 1 from Stamina Values (`−2 + 1`), for 2 total Exhaustion, minus 1 if worn garb gives T reduction, filled as **S** boxes.*

   **Power and Stamina Value reference ranges:**

   | Card type | Power | Additional value |
   |---|---|---|
   | Challenge action | 0–9 | Stamina Value 0 to −3 |
   | Tool action | 2–9 | Stamina Value −2 to +2 |
   | Body action | Fixed per Volk (3–6) | Stamina Value −2 to 0 |

   Future Power effects should stay in the ±1 to ±2 range to preserve headroom. Average Exhaustion **per Resistance reduced** should land near **2–3** after tools/help, paid into doll boxes.

3. **Help**: Players discuss and may help each other reduce pending Exhaustion. All help is resolved before Exhaustion is applied. See **Help Actions** below.
4. **Resolve**: Apply final Exhaustion (garb reduction first, then spend Stamina, then overflow Damage). **Reduce the Close challenge’s Resistance by 1.** Resolve that Action’s open rewards (including a recipe tick if the name + Action match, and **Path Length** if printed). If Resistance is now **0**, the challenge is overcome: **path discard**, or **Search pile** if this Action was a **Search** (see Discovery). If that Action prints **Detour**, progress does not increase. Otherwise progress increases by 1. Then **Move automatically**. If Resistance remains, the card stays in Close — next round Commit again. You may Switch Active before that Commit unless **Danger** blocks it. (Do **not** advance Day/Night here.) If leftover Exhaustion cannot be paid, resolve **Forced Retreat** before continuing.

### Help Actions

During the Help step, any player may help one other player reduce their pending Exhaustion. A player may receive help from multiple helpers in the same round.

**How help works**: Choose an action on any Equipped Tool (it need not be Active). Reduce the target's pending Exhaustion by **2** (minimum 0). This does not spend a resource and does not change your Active Tool.

**Limit**: Body actions cannot Help. You must have an Equipped Tool with a printed action to Help.

> **Design intent**: Help is loadout, not a spend. Having the right Tool Equipped is the cost. Body actions are excluded — help remains an equipment-based support action.

---

### Actions (during exploration)

**Use Rations**, **First Aid**, **Switch Active**, **Repack**, and **Retreat** are legal during exploration, including with a challenge in Close. **Danger** is the only block. Durability restoration is settlement-only.

- **Switch Active**: Mark a different Equipped Tool as Active. Free. Blocked only by **Danger**.
- **First Aid**: Spend **1 Bandage** to recover spent Stamina, up to half your maximum (rounded down). Blocked only by **Danger**.
- **Repack Tools**: Pay 1 Stamina to exchange one Equipped Tool with one Backpack Tool. Blocked only by **Danger**.
- **Use Rations (trail)**: Spend 1 Ration → recover **2** Stamina. Blocked only by **Danger**. Pay committed Exhaustion first.
- **Move**: Not a separate action. An approach on the first revealed challenge slides the track until that challenge is in Close, then resolves. Overcoming a challenge does the same slide and Vision fill automatically. Do not slide while a challenge is still in Close.
- **Travel**: When the last challenge before a destination is overcome and nothing unresolved remains, you arrive there automatically.
- **Retreat**: Abandon the current stretch and return via **Cleared Paths** to the settlement (see Retreat & Danger). Blocked only by **Danger**. No extra challenge or pile tax.

---

## Discovery

Two different things share the word **Discovery**:

1. **Transition pages** in the **Discovery Book** — how you find unmapped Travel Book exits (stairs, hidden doors, trails). Not cards.
2. **Zone Treasure** — Recipe/Tool cards (and rare **Lore** / sellable goods) from **Search** actions. **Path / Landmark unlocks are not** Treasure (those belong in the Discovery Book). There is **no write-in discovery journal**; owned Recipe/Tool cards are the record.

### Transitions (Discovery Book)

When an Area still has openings you have not mapped, that search is a Discovery Book page, not a zone card.

- **Discover Difficulty** is **the same number** as that exit’s Travel Difficulty (for now). Pay it to search this Area; when the deck is empty, open the page.
- When the deck is empty, open the page. It names **this end’s transition**, the destination **`P#` / Area**, and **the name on the far side**.
- Copy **both** ends into the Travel Book **Leads to** lists. The edge is then a normal exit (Travel Difficulty is the same number you just used to find it).
- One find unlocks both directions. Do not hide the way you came or expected architecture; only true secrets start unmapped.

**Playtest (Ruined Castle):** treat every transition as already discovered. The Travel Book already has the names. Zone Treasure still uses the Search pile (claim at stretch end, **no roll**).

**Return path:** when you go back to the Area you just left on the same connection, Travel Difficulty is **at most 2** (use the printed number if it is lower). The printed Difficulty still applies when you approach that exit from another direction.

**Back to the previous Area:** When you arrive at a new Area, you may go back to the Area you just left **for free**. The character card shows **Back to [that Area]**. This stays available until you start a path. Starting a path removes it. You cannot change Areas for free once a path has started. Retreat from a path is separate and is still blocked by **Danger**.

> **Design intent**: Arrival is the moment you can still step back. The next path is the commitment. There is no free walk-back after you have started that path.

### Zone Treasure (Recipe / Tool cards)

Each Zone has its **own** small Treasure packet (`T01`, `T02`, …) — not a game-wide pile. Do **not** shuffle these into the Challenge Deck as encounters. A challenge Action prints `Find Discovery T0X` / **Search**; that T-code is a card in **this** Zone’s packet.

**Recipe/Tool cards** are dual-face:

- **Recipe face** (public once gained): what you are assembling, and each component as **item to gain — specific Challenge + specific Action × how many**. You see what is needed and can guess the Tool; you do not see the finished stats.
- **Tool face** (hidden until assembled): the usable Tool (Power, Weight, Spirit).

A card in the packet may be **already assembled**, **parts missing** (some boxes pre-ticked), or **fully broken** (all boxes empty). That condition is printed on the card.

Rare cards may still be **Lore** or sellable goods with no recipe. Those are not Tools.

In the card files / simulator: Search/T-code fronts live in a **[search]** deck and link to the Recipe/Tool (or Lore) card. Open rewards on challenge lines (Materials, Spirit, Rations) stay immediate; Treasure is the delayed packet find.

A Search source may print a **find table** (or an Area may say finds use a richer table). You still **always** get a result from that Search — Materials, a common wreck, or a rare row — never “the chest was empty.” Harder Areas use **richer tables** and **+Resistance** (extra open rewards and ticks), not a loot die.

### Search pile (claim at stretch end)

Do **not** stop the path to read recipes. Search is only a pile until the stretch is about to shuffle back. There is **no Flip When / loot roll**.

**Procedure**

1. Take a **Search** Action (`Find Discovery T0X` or printed **Search**). Reduce Resistance by 1 and pay that line’s other open rewards as usual.
2. When Resistance reaches **0** from a Search Action: place the challenge on the **Search pile** (not the path discard). If Resistance remains, the card stays in Close.
3. Keep exploring. No book, no recipe yet.
4. **Before** shuffling this stretch’s challenges back into the Zone Deck (arrive, abandon, or retreat), resolve **each** Search-pile card: take the connected Recipe/Tool (or Lore) from **this Zone’s** packet if it is still **unclaimed**. Recipe face up. If it is already assembled, you may use it as a Tool immediately. If it is broken or missing parts, carry it and tick boxes later. If that packet card is already claimed, the Search still counted as a paying clear — no second copy.
5. Shuffle **all** challenges from the stretch (deck leftovers, revealed, path discard, Search pile) back into the Zone Deck as usual.

You may Search that T-code again on a later stretch only if the packet card is still unclaimed (you skipped that spur, or you have not claimed it this campaign).

### Paths Cleared

**Paths Cleared** is the number of path stretches you have successfully completed this expedition (you Travelled and arrived, and noted the path as Cleared). It is **not** “Landmarks reached” as a separate counter — each successful path clear increments the count by 1. It does **not** modify Search or crafting.

- Starting a run from a settlement: **Paths Cleared = 0**
- Each time you clear a path and arrive: **Paths Cleared +1**
- Cleared-path free travel home does not add further clears
- The count resets when the expedition ends at a settlement

### Ticking components (after you have the card)

Crafting is a fetch list on purpose. The Recipe face **is** the list — do not copy it into a journal. Ticks are **guaranteed** — no die.

When you **reduce Resistance** on a challenge with the **exact Challenge name and Action** printed on a packed incomplete Recipe/Tool, tick **one** matching empty box. **Each chip** is its own reward, so **+Resistance in harder Areas grants extra components**. Extra matching chips after those boxes are full grant the Action’s open rewards only (Materials, Spirit, …).

When every box is ticked, flip to the Tool face. You can now Equip and use it.

### Detours

**Detour** is an outcome on a line. When that line overcomes the challenge, the clear does **not** count toward progress. The card still leaves (path discard, or the Search pile if that same line was a Search).

- **Continue Past** and other optional ignores (walk past, pass by) print **Detour**. Power **0** is usual. No Search.
- **Enter / Search / Force…** does not print Detour. It counts as progress. Outcome is often **Find Discovery T0X**, and that challenge goes to the **Search pile**. Claim at end of stretch as above (**no roll**).

### After the expedition

When the run ends at a settlement, return **unclaimed** Zone packet cards so future runs can find those wrecks again. **Claimed** Recipe/Tool cards (complete or incomplete) stay with the group subject to Strength, kits, and settlement storage. **Mapped transitions stay in the Travel Book** for that group.

> **Design intent**: Open Action rewards are copper and fuel — they pay **per Resistance reduced**. Search is a paying clear that **queues** the packet card once when the challenge is overcome — exploration stays token-speed; you look at the recipe at stretch end, not in Close. Paid Search always claims if unclaimed. The recipe is the fetch list; **Challenge Resistance** (mostly from Areas) is the harder-area reward bonus; the hidden Tool face is the prize. New ways between Areas are Discovery Book pages, not Treasure backs. No salvage journal. See **`docs/design-goals.md`**.

---

## Retreat & Danger

### Retreat

When you **Retreat** (voluntary or **Forced Retreat** from unpaid overflow):

1. If this is **Forced Retreat** (leftover Exhaustion could not be paid): lose **all Spirit you are carrying**. Stored Spirit is not lost. Voluntary Retreat does not lose Spirit.
2. Abandon the current path stretch if you are mid-travel (resolve the **Search pile**, then return its Challenge Deck, revealed challenges, path discard, and Search pile to the Zone Deck — that stretch is not Cleared).
3. You are at the **last Landmark** you successfully occupied (the Landmark you left from, or arrived at if you were already there).
4. From there, freely follow any chain of **Cleared Paths** back to the **settlement** that started this expedition. No Challenge Decks, no travel cost.

The real cost of a **voluntary** Retreat is what you already spent to get this far (Stamina, Rations, missed loot) — not a second fight home. **Forced Retreat** also takes carried Spirit (see Spirit).

Retreat is blocked only by **Danger**. **Forced Retreat** from unpaid overflow happens immediately and overrides Danger.

If you have **no Cleared Paths** yet (you have not arrived at any Landmark beyond the settlement on this run), Retreat simply returns you to that settlement.

### Danger

**Danger** is a printed effect with a timing that should match the threat.

- **Danger !** (`While Revealed ▸ Danger`) — universal. You are in Danger as soon as this challenge is revealed, in any position. Use this when the fiction is already on you: a wolf that has your scent, an archer loosing from down the hall, a guard or captain whose presence fills the stretch.
- **Close Danger !** (`While Close ▸ Danger`) — you are in Danger only while this challenge is in Close. Use this when the fiction is reach: a bear that has not stepped in, a spearman whose point matters once you are in front of it.

You are **in Danger** while any revealed, unresolved challenge has an **active** Danger timing. **Danger !** is active in any slot. **Close Danger !** is active only in Close. A challenge in Close does not put you in Danger by itself. A Close Danger card further along the path does not lock you until it reaches Close.

**Charge** (`On Reveal ▸ Charge`): when that challenge is revealed, if the space one step toward Close is empty, it moves into that space. One space, and only on reveal. A wolf or a boar steps into an open gap. If something is already in that space, it stays where it was revealed.

**Prepare 1 > Exhaust X**: after you overcome one challenge, if this challenge is at distance 1 (the slot just beyond Close), you gain that Exhaustion. Using a ranged tool on that challenge prevents the activation. Any other action does not. A snake’s strike or an archer’s volley is the shape of this. On the card it prints `Prepare 1 > Exhaust X !`. Other effects on the same line are separated by a double space.

While you are in Danger, these are illegal:

- **Use Rations**
- **First Aid**
- **Switch Active** and **Repack** (keep the current Active Tool and Equipped set)
- **Retreat**

Fighting a challenge is still legal, including a ranged line on a challenge one slot away.

Leave Danger by overcoming the challenges whose Danger is currently active. A While Close card that is not in Close is not locking you yet.

- Scout and similar effects matter: reading Danger before you overcommit is part of the skill.
- Individual cards may print extras (e.g. fleeing extends Danger for another round). That is card text, not a global rule.

> **Design intent**: You step straight into the next challenge when you overcome one. Eating, changing tools, and walking away stay available with an ordinary challenge in Close. An active Danger locks those actions until that Danger is no longer active. It does not lock a Fight, ranged or not. While Revealed threats lock rations and tool changes the moment you see them. While Close threats lock those only in reach. Durability drain is the sharp personal fail when the S pool is full. Forced Retreat is the hard stop when the Durability pool is empty — carried Spirit is lost, stored Spirit is kept, Cleared Paths make the walk home free. No corpse-run objective and no Retreat-pile minigame.


---

## Landmarks

Landmarks are navigation points **and** short camp scenes. Each Landmark Atlas page shows:

- **Paths** out (destination, Required Challenges, Zone Deck, and any path auras)
- Optional **Rest modifiers**, **forced activity** options, and **bonus activity** options
- Optional tags (e.g. Resting Place, Work Place) folded into Rest / activities as printed

### On arrival

1. Note the path you just Travelled as **Cleared** (see Cleared Paths).
2. Resolve the **Search pile**, then return all challenges from this stretch to the Zone Deck (remaining deck, revealed cards, path discard, and Search pile). The next path will shuffle the full Zone Deck again.
3. Resolve any immediate on-arrival text on the Landmark page.
4. Choose **Camp** or **Pass through**.

Solo and multiplayer use the same visit rules. Activity choices are **shared** (the group picks together).

### Pass through

Skip Rest and **all** Landmark activities (including forced ones). You may still Repack Tools / swap Kits freely, then leave on a path (or begin Location Exploration if allowed).

Use Pass through to avoid forced activities, save Rations, or push on without camping.

### Camp

When you Camp:

1. **Rest** — spend Rations at the Landmark Camp rate (default **4 boxes** per Ration), modified by any printed Rest modifier (e.g. Resting Place **+1**, uneasy site **−1**). Rest modifiers apply only when you Camp.
2. Free upkeep: Repack Tools / Kit swaps. Durability restoration waits for a settlement.
3. **Activity** — at most **one** activity this Camp (see Forced and Bonus below).
4. Optionally **Stay longer** (see below).
5. Choose a path and leave (or Location Exploration).

### Activities

Landmark activities are optional or required **Action lines** using the same Action types as challenges (Fight, Work, Traverse, Awareness). Each line has a cost (Power to meet, Exhaust, spend supply, etc.) and an outcome (Scout, Find Discovery, Materials, prep for the next path, …).

Print a short menu when fiction supports it (typically **2–4** lines). Prefer including one cheaper line so declining a juicy option is still a clear pick.

#### Forced options

If the Landmark prints **forced** activity options and you **Camp**, you **must** choose **exactly one** line from that forced list. That choice **is** your activity for this Camp (you do not also take a separate bonus activity unless Stay longer allows one).

Pass through skips the forced list entirely.

#### Bonus options

If the Landmark prints **bonus** activity options and has **no** forced list, you **may** choose **exactly one** bonus line — or take none.

If both forced and bonus lists appear on one page, the forced list is the Camp activity menu (must pick one). Bonus lines are only available via **Stay longer**, unless the page explicitly says otherwise.

### Stay longer

After your normal Camp activity step, the group may **Stay longer**: spend **1 Ration** (once for the party) to take **one** additional activity from the Landmark’s **bonus** list.

- Stay longer never grants a second **forced** pick.
- Default cap: **+1** bonus activity this way per Camp (unless a Landmark prints a higher limit).

### Paths vs visit options

- **Paths** = exits (length, zone, path auras such as Den Territory). Auras apply when you travel that path.
- **Camp activities** = what you do while here. They are not path auras.

> **Design intent:** Camp is always Rest ± place modifier, then one activity. Forced menus make sleeping at dangerous places costly; Pass through keeps “don’t camp at the Den” meaningful. Stay longer (1 Ration) is the light rule for one extra bonus activity. Same structure for one player or a group.

---

## Character: Volk, Role & Tool Mastery

Characters are defined by two choices: a **Volk** (Strong, Small, Tall, Wise) and a **Role** (Warrior, Ranger, Crafter, Sage). Volk and Role determine which tools a character may use, while Masteries identify the tools they know especially well.

### Tool Ownership

Every tool belongs to one Volk and one Role.

- Your **Volk tools** are always available to you.
- Your **Role** grants access to that Role's tools from every Volk. For example, a Warrior can use Warrior tools from all Volks.
- You cannot use tools outside both your Volk and Role access.

Choose **two Masteries**:

1. One Mastery for a tool shared by your Volk and Role.
2. One Mastery for another tool of your Volk.

You gain the printed Mastery Ability only for your chosen Mastery tools.

> **Design intent**: Volk defines the cultural and physical tool set you always carry. Role adds a cross-Volk specialist **tool family** — not a party job the table must fill. Every character still has lines for all four Actions; classes differ in playstyle and where skill is hardest. The two Masteries give each character one signature Volk/Role tool and one additional Volk-focused specialty. **Masteries are extras.** A stretch of challenges with only Body + Active Tool must already be a real choice (pay vs cheap, ignore vs progress, hold this mode vs wait). See **`docs/design-goals.md`**.

---

## Tool Design: Base Trade-Off + Mastery Ability

### Base Tool: Built-In Trade-Off

Each tool has a trade-off baked into its base design — a strength that comes with a cost that applies to everyone who uses it, owner or not. This makes every tool a genuine choice at loadout time rather than a straightforward upgrade.

A good base trade-off has:
- A **clear upside** that makes the tool desirable
- A **clear downside** that creates a real cost or constraint
- Tension that stays relevant throughout a run, not just at one moment

### Mastery Ability: Conditional Power-Up

A character gains the printed Mastery Ability on each chosen Mastery tool. This is an optional effect that provides a meaningful power-up — but only when used at the right moment. Using it at the wrong moment provides no benefit or wastes the opportunity.

**A good Mastery mini-game:**
- Has a specific **condition** the player can read and plan around (revealed challenges, current Strength, Stamina level, remaining Challenge Deck)
- Has an **optimal use case** where the ability is clearly better than not using it
- Has **suboptimal use cases** where triggering it gains little or nothing — not because it punishes you directly, but because the opportunity is wasted
- Comes up **regularly** enough to feel like a core part of playing the tool, not a rare edge case
- Requires **judgment**, not just tracking: the player must decide whether now is the right moment

The threshold for the condition is the primary balance dial. If the ability feels too strong, tighten the condition. If it feels irrelevant, loosen it — no redesign needed.

> **Design intent**: Mastery Abilities are a net power-up for attentive play and neutral or slightly negative for careless play. Opportunity cost is enough downside when the payoff is not too strong.

---

## Mastery Examples

### Spirit Weapons — Wise Volk Warrior

**Base trade-off**: Spirit Weapons cover all four action types (Fight, Work, Traverse, Awareness) in one tool — exceptional versatility. Cost: lower specialist Power, or a printed Stamina Value, compared with a single-action tool of the same Weight.

**Mastery Ability — Invoke**: Consecutive Closes with this Spirit Weapon after the first gain **+2 Power**. Using Body or Switching Active breaks the streak.

**The mini-game**: The bonus is only worth it if you hold this mode through a stretch of matching challenges. Invoking the idea of “just one more card” is cheap when the next Close does not match. Reading what is revealed — and whether to stay in this versatile mode — is the core skill.

**Balance dial**: If Invoke is too powerful, reduce the bonus to +1 Power, or require three consecutive Closes.

---

### Giant Weapons — Strong Volk Warrior

**Base trade-off**: Giant Weapons reduce Exhaustion on difficult Fight actions more than comparable tools. Their high Power carries a Stamina Cost, and their Weight consumes more Strength than lighter equipment.

**Mastery Ability — Full Strength**: When you use a Giant Weapon while your current Strength is X or above, gain +X Power on this action.

**The mini-game**: At full Strength the bonus is active. As loot fills the pack and Rations are still carried, Strength drops and the bonus weakens. Eating Rations frees Strength and can re-enable the mastery — trading future recovery for combat power now.

**Balance dial**: Adjust the Strength threshold X during playtesting.

---

## Spirit (Currency)

**Spirit** (glyph **`🪬`**) is the universal trade measure — residual energy of places, relics, and living work, counted as one pool.

- On challenge outcomes, write gains as **Spirit**: **`+2 Spirit`** (glyph **`🪬+2`**). That adds 2 to the Spirit you are **carrying**. Do not invent the specific object on the card.
- Tools and **Recipe/Tool** Treasure print a **Spirit** price (e.g. `Spirit: 3`). At settlements you **pay** / **gain** that many Spirit when buying or selling. Lore Discoveries usually have no sell Spirit. Travel Book transitions have no Spirit.
- Carried Spirit does **not** have Weight and does **not** occupy Strength **for now**.

**Carried vs stored:** Spirit found on an expedition is **carried** until you deposit it. At a settlement you may **trade** (buy and sell) and **store** or withdraw Spirit. Stored Spirit stays at that settlement.

**Forced Retreat:** leftover Exhaustion that cannot be paid (no undamaged worn Garb left to Damage) is losing all life for this expedition. Lose **all Spirit you are currently carrying**. Stored Spirit is not lost. (Playtest dial: half of carried, rounded up, if all-carried is too harsh.)

Tools and sellable Recipe/Tool (or relic) Treasure print **Spirit** as their settlement buy/sell price in this same pool.

---

## Settlements & Economy

Settlements (Landmarks with a trade option) allow buying and selling using **carried** Spirit, and **storing** Spirit you do not take on the next run. An exploration run **starts** at a settlement; returning there (including via Retreat along Cleared Paths) **ends** the expedition and clears the Cleared Path list.

Each Tool and sellable **Treasure** Discovery has **Spirit** printed on it. Buy and sell rates at a settlement are multiples of this number.

**Default settlement rates:**
- **Buy a Tool**: 2× Spirit
- **Sell a Tool**: 0.5× Spirit
- **Sell Recipe/Tool Treasure**: 1× Spirit (full price) — incomplete wrecks sell as the printed Spirit too unless the card says otherwise
- **Buy Rations**: fixed prices set per settlement
- **Rest**: restores all drained **Durability** for free

You may buy, sell, or rest as much as you like in one settlement visit.

Nothing can be bought for a fraction of a Material. Example Ration pricing:

| Item | Example Price |
|---|---|
| 4 Rations | 1 Spirit (0.25 Spirit/Ration) |

Heal supplies (the Vitality module item) are only used when the optional Vitality module is enabled. **Rest** (Durability) is the settlement service as above — that is the active playtest rule.

> Both buy and sell multipliers can vary per settlement. The card's printed Spirit is fixed; only the multipliers change.

### Spirit storage

You may **deposit** carried Spirit into storage at a settlement, or **withdraw** stored Spirit into what you carry. Deposit and withdraw only at a settlement (the one that started this run, unless a later rule names another).

- **Stored Spirit** stays at that settlement. It is not lost on Forced Retreat.
- **Carried Spirit** is what you take on an expedition. While at a settlement, buy / sell / heal spends from carried Spirit — deposit first if you want that amount stored and safe.

Track stored Spirit as a number on that settlement (or a shared town sheet). Capacity is unlimited for now.

### Tool Storage

Tools not carried on a run are stored at a settlement. Storage is limited (capacity to be set during playtesting).

When storage is full and you want to add a new tool:
- **Sell** a stored tool (receive 0.5× its printed Spirit)
- **Carry** a stored tool out on the next run (freeing the slot, but adding Weight)
- **Leave** the new tool behind (only if found in the zone deck)

> **Design intent**: Limited storage prevents hoarding. The buy/sell gap makes acquiring a tool a real commitment. Finding a tool in the zone deck is strictly better than buying one.

---

## Open Questions

The Active-Tool mode, automatic Move on overcome, and “fun before skills” on challenge faces are the current playtest — not open. Trail Rations, First Aid, Switch Active, Repack, and Retreat are blocked only by revealed **Danger**.

Threat and non-Treasure reward curves by depth can still be tuned in play. **Search is not rolled** — paid Search claims the unclaimed packet card (or a printed find table) when the challenge is overcome. Harder Areas use **+Resistance** (open rewards and ticks **per chip**) and **richer find tables**. Recipe/Tool Treasure is the current item system. See **`docs/design-goals.md`**.

---

## Special Effects Overview

Playtest glossary. **Standard** = shared keywords. **Special** = shared optional keywords. **Card text** = named lines printed on one card (not shared keywords). Fiction names may vary; the rule text is what matters.

### Tool Effects

#### Standard

| Effect | Meaning |
|---|---|
| **Active** | The Equipped Tool that pays Close. Switch unless a revealed challenge has **Danger**. Using it does not spend a resource. |
| **Help** | Choose an action on an **Equipped** tool (need not be Active) to reduce another player’s pending Exhaustion by **2**. No resource cost. Body cannot Help. |
| **Power** / **Stamina Value** | Printed on each action line. Compared and combined with the challenge line during Commit (see Exploring). |
| **Range X–Y** | This line can target only challenge positions X to Y in Reveal Order (position 1 = Close). Illegal while you are in **Danger**. |




### Challenge Effects

#### Activation (when the effect fires)

| Keyword | Meaning |
|---|---|
| **On Reveal** | Resolves once when this challenge is revealed. |
| **While revealed** | Actives for the  as long as this challenge is in a challenge track revealed. |
| **While Close** | Is active while this challenge is in the first chellenge slot. |
| **While Ranged X** | Is active while this challenge is in the Slot X. |
| **On Move** | Activets when the player moves. |
| **Grouping** | Only when at least one other revealed card shares this name. |

#### Standard outcomes

| Effect | Meaning |
|---|---|
| **Exhaust X** | Lose X Stamina. |
| **Recovery X** | Regain X Stamina. |
| **+/-X Rations** | Gain/Lose X Rations. |
| **+/-X Spirit** / **🪬+X** | Gain/Lose X Spirit (adds to / spends from **carried** Spirit; no Strength cost for now). |
| **Scout X** | Look at the next X challenge cards from the current path deck, place back in the same order. |
| **Reveal +X** | For the next Move only, increase Vision by X and reveal X additional new challenges. |
| **Find FX** | Legacy book key (prefer **Find Discovery XY**). |
| **Find Discovery T0X** / **Find Discovery XY** | **Search**: when this Action reduces Resistance to **0**, put the challenge on the **Search pile**. Before the stretch shuffles back, **claim** this Zone’s connected Recipe/Tool (or Lore) if unclaimed. **No roll.** Does not claim per leftover chip. |
| **Search** | Same as Find Discovery when a T-code is named; otherwise follow printed text. Always claims if unclaimed — no Flip When. |
| **Challenge Resistance** | Tokens left on the card. Default **1**. A successful Action **−1**. At **0** the challenge is overcome. Area `+N Resistance on …` is the main raise. Open rewards and recipe ticks fire **each** −1. |
| **+X Path Length** | Draw X cards from the Zone Deck; put them face down on the **bottom** of the current Challenge Deck. Does not change Required Challenges. |
| **Detour** | This overcome does not count toward progress. Print on optional ignores. A mandatory cheap clear still counts. |
| **−X Path Length** | Return X facedown cards from the **bottom** of the Challenge Deck to the Zone Deck (if fewer remain, return all). |
| **+1 travel time** | Area line: when the named challenge or topic is revealed, this stretch’s Difficulty to reach a Crossing increases by 1. Leave the printed `difficulty:` number unchanged. Resolve each extra point as **+1 Path Length**. |
| **Return** | This challenge goes to the bottom of the current Challenge Deck instead of being discarded. |
| **Prepare X** | +X Power for the next Action. |
| **Prepare Action X** | +X Power for the next specific Action. |


#### Effects effecting other challenges

| Effect | Meaning |
|---|---|
| **Danger** | **State:** **While Revealed ▸ Danger** is active in any revealed position. **While Close ▸ Danger** is active only in Close. Print the timing that fits the threat. While that Danger is active, **Use Rations**, **First Aid**, **Switch Active**, **Repack**, and **Retreat** are blocked. A Fight, including a ranged line, is not. |
| **Blocking X** | X challenges behind this one in Reveal Order cannot be Overcome. |
| **Covering X** | The next challenge in Reveal Order has +X Challenge Power. |
| **Grouping Power X** | +X Challenge Power when another challenge with the same name is revealed. |






