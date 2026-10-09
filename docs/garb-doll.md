# Garb doll (playtest)

Layered clothing as its own kit, not a second Tool board. Stamina is a **number** (the maximum set in the character creator, shown on the character card) — no boxes on the doll at all; empty holes print nothing. Equipped pieces give **Exhaustion reduction** like tools (**S** universal, **F/C/T/A** matching). The live fail rule in **`CurrentRulesDesign.md`**: subtract garb reduction, spend Stamina from the pool, then **Damage** chosen garb on overflow (red cross); no undamaged garb left is Forced Retreat. Prototype: **`GarbSystem.html`**. Catalog: **`garb.md`**.

Everyday zones, 3-layer body/legs, 2-layer head: **`docs/garb-slot-jobs.md`**. That sketch is not the live hole list.

Pieces are small tokens on a paper doll. Recipe / finished-garb cards hold names and rare verbs. Close is Power → Stamina Values → garb reduction → spend Stamina from the pool.

---

## Zones and holes

**Torso is torso-and-thighs.** Padding, mail, and plate are one coverage stack, not a second Legs column. **Feet** is everything below the knee (boots vs greaves).

| Code | Zone | Holes |
|---|---|---|
| **H** | Head | H1 Inner, H2 Outer |
| **N** | Neck | N |
| **T** | Torso | T1 Cloak, T2 Tabard, T3 Outer, T4 Middle, T5 Inner |
| **B** | Belt | B |
| **F** | Feet | F |

T3–T5 are the armor layers (inner cloth, padding/gambeson, outer mail/leather). T1–T2 are over-clothes. Head, neck, belt, and feet are unlike the torso stack so filling holes stays interesting.

Challenges may **target a location**. Only that zone’s pieces may soak that hit.

---

## Layers (spend order)

In a hit zone, **outer peels first** only if a challenge **targets a location**. You cannot spend a lower layer’s boxes on that hit until the higher piece in that zone is already Damaged, Worn, or empty.

That is what gives Inner / Middle / Outer different play: mail takes the Fight boxes before the gambeson does. Cloak (T1) sits above the armor stack when the hit is a torso soak.

For ordinary Exhaustion (no location target), subtract garb reduction, then spend Stamina from the pool.

Do **not** total reduction onto one outfit card. Each token carries its own pips. When the pool is maxed, Damage a piece (see **`CurrentRulesDesign.md`** Stamina). If the chosen part’s printed reduction is equal to or greater than the overflow, only that part takes the red cross.

---

## What lives on the token

The strip must answer the table without opening a recipe pile.

- Hole code (H1, T3, F, …)
- Name
- **Action pips** (Fight / Work / Traverse / universal **S**) — reduction values, not stamina; stamina is the numeric pool on the character card
- At most one **glance tag** (colour + small symbol): **Warm**, **Cool**, and later **Loud** / **Quiet** if a Traverse line asks

**Do not sum tags.** Any Warm means you are Warm; any Cool means you are Cool; both showing **cancel** (mixed / neutral). Catalog: only a few pieces get a climate glyph (cloak, hood, boots, maybe padded middle). Most mail and shirts stay unmarked.

Optional tighter read: only the **outer climate piece** counts (cloak / hood / boots). Same glance, even less stacking.

Rare named verbs stay on the **crafting / garb card**. They must never be values you add across pieces. Forgetting a bonus only costs a gift (no hidden penalties on that card).

---

## Heat and Cold (Area + garb)

**Heat** and **Cold** are **In this Area** effects, not Zone-Deck weather and not a new damage type. Party-scale rain still does not belong on challenge faces; a hot forge or high pass can sit on the Travel Book page.

Garb climate is bipolar:

| Token | Cold Area | Heat Area |
|---|---|---|
| **Warm** | Protects | Worsens |
| **Cool** | Worsens | Protects |
| Unmarked | No change | No change |

The Area prints the tax (extra Exhaustion, or ignore it). You look at the doll for orange vs blue. You do not count +2 Warm from two layers.

Authoring templates live in **`docs/travel-book-design.md`** (Area effect library).

---

## Noise and sneaking

**Sneak / noise is a Traverse challenge action**, not a separate noise meter and not a second garb track.

Examples: slip past a patrol, quiet the yard, creep the ridge. Those lines are `[T] Traverse` with sneak fiction. Tools and Body already fight those Power numbers.

If a line should care about clothing, it **asks a token tag** the same way Heat asks Warm/Cool (`Loud` mail, `Quiet` hood). Still a glance, never a summed noise stat. Default: most Traverse sneak lines do not need a garb tag.

---

## Repair, Heal, and identity

Tools do not wear out and have no Maintain action. Gathering should fund **new** crafts, not tool repair.

**Repair is the settlement bill:** **2 Spirit** or **4 Materials** (Spare Parts 1:1) fixes one **Damaged** Garb from overflow. Settlement only. Do not turn Repair into a second recipe list.

**First Aid** (Bandage) recovers up to half your maximum Stamina on the trail; it does not Repair Damaged garb.

**Identity:** anonymous layers carry reduction pips you will upgrade. A few named finds (Alguron’s plate) keep a tag or a once-only verb so the name stays after better mail exists. Situational tags (Warm on a foundry route) do not go obsolete the way a Fight-reduction robe does.

---

## What not to add yet

- Heat/cold/noise numbers that exist only on the recipe face
- Slash / pierce / blunt on top of Fight / Work / Traverse / Awareness
- A full Legs Inner/Middle/Outer column (everyday-zone sketch: **`docs/garb-slot-jobs.md`**)
- Per-stitch repair at camp as the main Materials sink
