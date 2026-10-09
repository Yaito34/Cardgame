# Standard effect symbols [symbols]

Glyphs are **viewer-only**: [cards.html](cards.html) uses **`[symbols]`** so outcomes **with** a non-empty icon render as **icon · value · keyword** (e.g. 🍞 +3 Rations). **Author those value-first** in **`cards.md`** (**`+3 Rations`**, **`F4 Find`**, **`2 Vision`**, …). **Keywords with no icon** (blank **`[symbols]`** cell or phrases like **Use Rations X**) keep **keyword · value** in the file and on the card (**`Use Rations 2`**, **`Power +3`** when Power has no symbol). **Remove a row** or **leave the symbol cell blank** to turn that keyword’s icon **off** (no hidden default). **If your file has no `# … [symbols]` block at all**, the viewer uses one-time **built-in defaults** for common effects so plain `cards.md` still renders. **Put `+` / `-` yourself in `cards.md`** when you mean a change (e.g. **`+1 Vision`** on a modifier); **base counts stay unsigned** only where you truly mean an unsigned baseline (usually **`N Keyword`** like **`2 Vision`**). **Scout X** / peek counts use **`N Scout`**. **Per-card fiction + stat:** Zone deck uses **`- [F] 6 Fight : …`** (single-letter inside brackets; viewer prints **`[F] 6`**). **Compound Traverse Power:** write **`Traverse · +2 Power`** (middle dot splits clusters). **Tools and discoveries** use the same **`- [F] 2 Fight : …`** approach rows as challenges. In **field / Lasts** explanations after `Name :`, use plain prose (`+2 Challenge Power when…`) or an embedded token like **`+2 Power`** only when you want **Power** styled as an outcome.

| Keyword | Symbol |
|---------|--------|
| Find | 🔍 |
| Scout | 🔭 |
| Exhaustion | 🪫 |
| Dynamic | ⚡ |
| Recover | 🔋 |
| Rations | 🍞 |
| Materials | 🪵 |
| Spirit | 🪬 |
| Vision | 🌄 |
| Reveal | 👁️ |
| Power |  |   
| Return | ↩️ |
| Detour | ↪️ |
| Skip |  | ⏩
| Stay | 🔁 |
| Overcome | 🏞 | 
| Pass | ➡️ |
| Remove | ❎ | ✅
| All Bypass |  |✳️
| Hand Off | 🙏 |  🤜🤛 
| United |  | 👥
| Lasts |  |5
| While Revealed |  |
| On Reveal |  |
| Charging |  |
| Together | 𐀪𐀪 |
| Range | 🏹 |
| Wear | ⚔️ |
| Tools | 🛠️ |
| Challenge | 👺 |


Keep this as the **first** `# … [symbols]` block at the top of the file so the parser can remove it before loading decks.

# Zone Deck 1 ▸ Forest Clearing [challenge]

## Old Forest [ZD1]
- Zone -
---
2 Vision
---


## Wolf [ZD1_WOLF]
Count: **2**
- Animal -
While Revealed ▸ Danger
On Reveal ▸ Charge
---
- [F] 5 :
- [T] 3 :
---


## Bear [ZD1_Bear]
Count: **2**
- Animal -
While Close ▸ Danger
---
- [F] 8 :
- [T] 2 :
---


## Foolin [ZD1_CROW_FLOCK]
Count: **2**
- Spirit -
Prepare 1 > Exhaust 1
---
- [T] 1 :
- [C] 4 :
- [A] 6 :
---


## Rocky Slope [ZD1_STONY_SLOPE]
- Terrain -
---
- [C] 5 :
- [T] 3 :
- [A] 5 :
---


## Thorny Thicket [ZD1_THORNY_THICKET]
- Terrain -
---
- [C] 4 :
- [T] 1 :
---



## Wide Spread Undergrowth [ZD1_DENSE_UNDERGROWTH]
- Terrain -
---
- [C] 4 :
- [T] 2 :
---


## Tall Wísere Tree [ZD1_LARGE_TREE]
- Terrain -
---
- [T] 4 :
- [A] 7 :
---
Detour


## Venomous Snake [ZD1_SNAKE]
- Animal -
Prepare 1 > Exhaust 2
---
- [F] 3 :
- [A] 4 :
---
Detour on Traverse


## Wild Boar [ZD1_WILD_BOAR_1]
Count: **2**
- Animal -
While Close ▸ Danger
On Reveal ▸ Charge
---
- [F] 7 :
- [T] 3 :
---


## Rushing Stream [ZD1_RUSHING_STREAM]
- Terrain -
---
- [T] 2 :
- [A] 4 :
- [C] 6 :
---
Overcome with Awareness ▸ Recover 2


## Muddy Ground [ZD1_MUDDY_GROUND]
- Terrain -
---
- [T] 2 :
- [A] 5 :
- [C] 6 :
---
Overcome with Traverse ▸ Exhaust 1


## Berry Bushes [ZD1_BERRY_BUSHES]
- Forage -
---
- [C] 4 :
---
Detour


## Damaged Protection Stone [ZD1_DAMAGED_PROTECTION_STONE]
- Terrain -
---
- [C] 5 :
---
Detour


## Abandoned Hut [ZD1_ABANDONED_HUT]
- Finding -
---
- [A] 5 :
- [C] 4 :
---
Detour


## Broken Tool Parts [ZD1_BROKEN_TOOL_PARTS]
Count: **1**
- Finding -
---
- [C] 3 :
- [A] 6 :
---
Detour
Overcome with Awareness ▸ Find 1


# Search [search]

## Broken Tool Parts [ZD1_BROKEN_TOOL_PARTS_SEARCH]
- Search -
Discovery : Wood Axe
---


# Discoveries [discovery]

## Wood Axe [ZD1_HAND_AXE]
- Small Toll -
Weight 1, Spirit 3
---
- [C] 4 :
- [F] 3 :
---
Gathering 1: While this tool is Active, when gaining Materials from challenges, gain 1 more.

# Garb [garb]

Doll-slot pieces live in **`garb.md`**. The simulator and card viewer load them as hole-sized cards (same size as a Body Doll slot).








# Characters [character]

Standee tokens: figure plus a transparent lantern halo. Not a card — drag over a landscape face to place them in the scene.

## Mossfern [CHAR_MOSSFERN]
Picture: CardPictures/Mossfern-token.png
---

# Tools [tool]



## Heavy 2-Hand Axe [TOOL]
- Large Spirit Weapon, Wisdom, Warrior -
---
Weight: 3, Spirit: 3
- [F] 9 -2 :
- [C] 9 -2 :
- [T] 2 :
- [A] 2 :
---


## Clawed Gloves [TOOL]
- Small Claw Weapon, Agility, Warrior -
---
Weight: 1, Spirit: 3
- [F] 2 :
- [C] 2 :
- [T] 2 :
- [A] 2 :
---

## Longsword [TOOL]
- Large Defensive Weapon, Intelligence, Warrior -
---
Weight: 2, Spirit: 3
- [F] 6 -1 :
- [C] 6 -1 :
- [T] 2 :
- [A] 3 :
---
Block 2: While this tool is Active, reduce Exhaustion from a Fight action by 2.

## Ornamented Sword [TOOL]
- Large Heavy Weapon, Strength, Warrior -
---
Weight: 2, Spirit: 3
- [F] 6 -1 :
- [C] 6 -1 :
- [T] 2 :
- [A] 4 :
---

## Hound Whistle  [TOOL]
- Small Volk Ranger Tool, Agility, Explorer -
---
Weight: 1, Spirit: 3
- [F] 2 :
- [C] 2 :
- [T] 1 :
- [A] 4 :
---
Animal Handling Training:
Fight Help +1 : -1 Diff. for [F]ight Help Actions.
Traverse Help +2 : -2 Diff. for [F]ight Help Actions.
Awerness Help +1 : -1 Diff. for [F]ight Help Actions.

!! End of Updated Tools !!

## Knife [TOOL_CAMP_KNIFE]
- Small Tool, Agility, Explorer -
---
Weight: 1, Spirit: 3
- [F] 2 :
- [C] 2 :
- [T] 8 -2 :
- [A] 2 :
---
Foraging 1: While this tool is Active, when gaining Rations from challenges, gain 1 more.

## Small Wood Axe [TOOL_HAND_AXE]
- Small Tool, Agility, Crafter -
---
Weight: 1, Spirit: 3
- [F] 3 :
- [C] 4 :
- [T] 3 :
- [A] 2 :
---
Gathering 1: While this tool is Active, when gaining Materials from challenges, gain 1 more.

## Small Sickel [TOOL_SMALL_SICKEL]
- Small Tool, Agility, Crafter -
---
Weight: 1, Spirit: 3
- [F] 2 :
- [C] 2 :
- [T] 3 :
- [A] 2 :
---
Harvest 2: While this tool is Active, when gaining Rations from challenges, gain 2 more.


## Rope [TOOL_ROPE]
- Small Tool, Agility, Explorer -
---
Weight: 2, Spirit: 3
- [F] 2 :
- [C] 3 :
- [T] 7 -1 :
- [A] 2 :
---
Traverse Help 2 : While Equipped, give +2 Stamina to [T] Actions of any character.
Build Help 2 : While Equipped, give +2 Stamina to Build Actions of any character.

## Warded Charm [TOOL_CHARM]
- Small Tool, Wisdom, Sage -
---
Weight: 1, Spirit: 3
- [F] 2 :
- [C] 2 :
- [T] 3 :
- [A] 6 -1 :
---
Courage: While this tool is Active, you may remove Dread effects.
Self Protection 1: While this tool is Active, when gaining Exhaustion, gain 1 less Exhaustion.

## Wayfinders Staff  [TOOL_WAYFINDING]
- Large Tool, Intelligence, Explorer -
---
Weight: 2, Spirit: 3
- [F] 2 :
- [C] 2 :
- [T] 4 :
- [A] 4 :
---
Traverse Help 2: While Equipped, give +2 Stamina to [T] Actions of any character.

## Hunting Spear [TOOL_HUNTING_SPEAR]
- Large Hunting Weapon, Intelligence, Explorer -
---
Weight: 2, Spirit: 3
- [F] 4 :
- [C] 2 :
- [T] 4 :
- [A] 3 :
---
Range 1-2 · Fight
Fight Help 2 : While Equipped, give +2 Stamina to close [F] Actions of any character.

## Animal Traps [TOOL_ANIMAL_TRAP]
- Large Tool, Intelligence, Explorer -
---
Weight: 2, Spirit: 3
- [F] 2 :
- [C] 3 :
- [T] 2 :
- [A] 4 :
---
Hunting 2: While this tool is Active, gain +2 Rations when in a zone with Animals.
Delay 1 ▸ Fight Help 2: While Equipped, give +2 Stamina to close [F] Actions of any character.

## Hunting Bow [TOOL_SHORT_BOW]
- Large Hunting Weapon, Intelligence, Explorer -
---
Weight: 2, Spirit: 3
- [F] 5 :
- [C] 2 :
- [T] 2 :
- [A] 4 :
---
Fight Range

## Large Hammer [TOOL_LARGE_HAMMER]
- Large Tool, Strength, Crafter -
---
Weight: 3, Spirit: 3
- [F] 8 -2 :
- [C] 8 -2 :
- [T] 2 :
- [A] 2 :
---
Limited to Build Actions!

## Ember Looking Glass [TOOL_EMBER_LENS]
- Small Tool, Agility, Sage -
---
Weight: 1, Spirit: 3
- [F] 2 :
- [C] 2 :
- [T] 3 :
- [A] 6 -1 :
---
Range 2+ · Awareness
Scout 2: When you Awareness with this tool, Scout 2.

# Skills [ability]

Loadout skills. Equip up to **8** in the simulator ability bar (click an empty slot;
right-click an equipped skill to unequip). **Actives** print `Cost N` — spend N Stamina
to use them (keys 1–8 while a challenge is on the track). **Passives** print no Cost —
they never need activation:

- `Passive: base +X <Kind>` — adds +X Power on top of the Active Tool's matching line
  (Kind = Fight / Craft / Traverse / Awareness). **At most one approach per skill** —
  a skill never modifies two approaches, and there is no `All`.
- `When <Tag> overcome : <outcomes>` — fires automatically when you overcome a
  challenge matching the tag (subtitle like Animal / Terrain / Forage, or the
  approach kind used, or the card name).

## Scout [SKILL_SCOUT]
- Active -
Cost 1
---
See the next 2 challenges that are out of sight.
---

## Guard [SKILL_GUARD]
- Active -
Cost 2
---
Fight +4 until your next overcome.
---

## Bash [SKILL_BASH]
- Active -
Cost 2
---
Ignore the Danger of the Close challenge.
---

## Mobility [SKILL_MOBILITY]
- Active -
Cost 2
---
Switch the first and second revealed challenge.
---

## Ambush [SKILL_AMBUSH]
- Active -
Cost 2
---
Pull every revealed challenge that has an open slot ahead of it one step toward Close.
---

## Halt [SKILL_HALT]
- Active -
Cost 2
---
Charge and Prepare threats do not fire until your next overcome.
---

## Skinning Knife [SKILL_SKINNING_KNIFE]
- Passive -
When Animal overcome : +1 Rations
---

## Wanderer [SKILL_WANDERER]
- Passive -
Passive: base +1 Traverse
---

## Keen Eye [SKILL_KEEN_EYE]
- Passive -
Passive: base +1 Awareness
---

## Forager [SKILL_FORAGER]
- Passive -
When Forage overcome : +1 Rations
---

## Salvager [SKILL_SALVAGER]
- Passive -
When Terrain overcome : +1 Materials
---

## Wayfinder [SKILL_WAYFINDER]
- Passive -
Passive: base +1 Traverse
When Terrain overcome : Scout 1
---

## Honed Edge [SKILL_HONED_EDGE]
- Passive -
Passive: base +1 Fight
---

## Field Tinker [SKILL_FIELD_TINKER]
- Passive -
Passive: base +1 Craft
---

## Tracker [SKILL_TRACKER]
- Passive -
Passive: base +1 Awareness
When Animal overcome : Scout 1
---

# Writable Tools [writabletool]

## Blank Tool [TOOL_WRITABLE]
- Writable -
---
Weight: ___, Spirit: ___
- [F] ___ Fight :
- [C] ___ Craft :
- [T] ___ Traverse :
- [A] ___ Awareness :
---
Extra effect / notes:


# Allys [ally]

## Gorg the Woodcutter [ALLY_WOODCUTTER]
- Ally -
Stamina 12, Health 17
---
- [F] 5 : 3 Uses
- [C] 6 -1 : 4 Uses
- [T] 2 : 2 Uses
- [A] 3 : 2 Uses
---
3 Uses
Take Over: You take a shared challenge into your Queue.

## Anders the Hunter [ALLY_WOODCUTTER]
- Ally -
Stamina 17, Health 13
---
- [F] 3 : 2 Uses
- [C] 2 : 2 Uses
- [T] 2 : 4 Uses
- [A] 5 : 3 Uses
---
3 Uses
Pathfinder 2: Stamina +2 for any characters Traverse Actions. 

# Kit Containers [reference]

Extra supply containers. **Weight 0** — every supply token inside is **Weight 1**. Equip up to **2** Kit containers (playtest). Base Rations and Materials use always-available base containers (no Kit slot). Balance effects with Spend N, effect size/timing, and buy cost — not token Weight. See CurrentRulesDesign.md ▸ Special Supplies & Containers.

## Potion Belt [KIT_POTION_BELT]
- Kit Container -
- **Weight**: 0
- **Spirit**: 2
- **Kit Slot**: 1 while Equipped
- **Unlock**: Stamina Potions, Lantern Oil
- **Carry Cap**: 3 total (Potions + Oil share this cap)
- **While Equipped**: You may carry and spend Stamina Potions and Lantern Oil up to the carry cap.
- **Stamina Potion** (Weight 1, buy 1 Spirit): After a Close action resolves Exhaustion, Spend 1 → recover 2 Stamina (once per action; legal while not Clear). Spend 2 → recover 4 instead.
- **Lantern Oil** (Weight 1, buy 2 for 1 Spirit): When leaving at Night, Spend 1 → ignore one printed Night penalty on the next path.

## Mess Kit [KIT_MESS_KIT]
- Kit Container -
- **Weight**: 0
- **Spirit**: 2
- **Kit Slot**: 1 while Equipped
- **Unlock**: Hearty Meals
- **Carry Cap**: 4
- **While Equipped**: You may carry and spend Hearty Meals up to the carry cap.
- **Hearty Meal** (Weight 1, buy 2 for 1 Spirit): Camp only. Spend 2 → recover 8 Stamina. Cannot spend 1 for a partial effect. Not usable on Trail or Short stop.

## Medicine Box [KIT_MEDICINE_BOX]
- Kit Container -
- **Weight**: 0
- **Spirit**: 2
- **Kit Slot**: 1 while Equipped
- **Unlock**: Bandages
- **Carry Cap**: 3
- **While Equipped**: You may carry and spend Bandages up to the carry cap.
- **Bandage** (Weight 1, buy 2 for 3 Spirit): During exploration unless Danger is revealed, or at a Landmark. Spend 1 → First Aid (recover spent Stamina, up to half your maximum, rounded down). Spend 2 → First Aid twice.

## Repair Box [KIT_REPAIR_BOX]
- Kit Container -
- **Weight**: 0
- **Spirit**: 2
- **Kit Slot**: 1 while Equipped
- **Unlock**: Spare Parts
- **Carry Cap**: 3
- **While Equipped**: You may carry and spend Spare Parts up to the carry cap.
- **Spare Parts** (Weight 1, buy 2 for 1 Spirit): Settlement. Spend 1 → count as 1 Material toward Repairing one Damaged Garb. Repair costs 4 Materials (or Spare Parts) total per piece, or 2 Spirit instead.

# Reference Cards [reference]

## Stamina [REF_STAMINA]
- Resource -
- **Where**: A **number** — the maximum set in the character creator, shown on the character card (current / max). No boxes anywhere on the doll; empty garb slots print nothing.
- **Spend**: Exhaustion from any challenge Action spends Stamina from the pool. Worn garb reduces it first: **S** on garb reduces every action, **F / C / T / A** reduce only their matching action.
- **Overflow**: If Stamina is maxed, choose equipped Garb to Damage (red cross). Each Damaged piece reduces leftover Exhaustion by **all** of its reduction values. If that is equal or greater, only that piece is Damaged. If overflow remains, choose more pieces until it is 0. Damaged garb is unusable until Repaired at a settlement. No undamaged garb left → Forced Retreat.
- **Forced Retreat**: If leftover Exhaustion cannot be paid, Forced Retreat. Lose all Spirit you are carrying.

## Exhaustion [REF_EXHAUSTION]
- Resource -
- **Effect**: Each Exhaustion spends 1 Stamina from the pool (after garb reduction). Recovery restores that many. Overflow Damages chosen garb.

## Strength [REF_STRENGTH]
- Resource -
- **Default**: 20. Each Supply token occupies **1** Strength (always Weight 1). Every Tool's printed Weight uses Strength. **Kit containers are Weight 0**.
- **Over limit**: Strength never goes below 0. Do not take the item, or drop Supplies or Tools until you have enough Strength to carry it.

## Rations [REF_RATIONS]
- Resource -
- **Supply**: This counts as Supply, when you gain 1 Supply you lose 1 Strength, and when you lose 1 Supply you regain 1 Strength.
- **Trail**: Spend 1 Ration to recover 2 Stamina. Legal with a challenge in Close. Blocked only by revealed **Danger**. Pay committed Exhaustion first.
- **Short stop**: Spend 1 Ration to recover 2 Stamina.
- **Camp**: Spend 1 Ration to recover 4 Stamina, plus Landmark bonuses.


## Materials [REF_MATERIALS]
- Resource -
- **Supply**: This counts as Supply, when you gain 1 Supply you lose 1 strength, and when you lose 1 Supply you regain 1 strength.
- **Repair** : Settlement only. Spend 2 Spirit or 4 Materials to Repair one Damaged Garb.

## Spirit [REF_SPIRIT]
- Resource -
- **Currency**: Main trade measure (glyph 🪬). Not a Supply — no Weight, does not occupy Strength.
- **Carried**: Spirit found on an expedition is carried until you deposit it. Track as tokens on the board.
- **Settlement**: Trade (buy / sell) and store or withdraw Spirit only at a settlement. Stored Spirit stays there and is safe.
- **Forced Retreat**: Leftover Exhaustion that cannot be paid. Lose **all Spirit you are carrying**. Stored Spirit is not lost.

## Tools & Treasure [REF_MATERIALS]
- Resource -
- **Tool Weight**: Every Tool costs its printed Weight in Strength, whether Equipped or in your Backpack.
- **Equped Tool** : You can Equip up to 4 Tools. One Equipped Tool is **Active**. Close uses that tool. Using it does not spend a resource.
- **Kit Containers** : Weight 0. Equip up to 2 extra Kits (playtest). Only Equipped Kits unlock their special supply family; every supply token inside occupies **1** Strength.
- **Damaged** : Overflow Damages Garb, not Tools and not body slots. Damaged Garb needs Repair at a settlement (2 Spirit or 4 Materials).
- **Repack Tools** : Pay 1 Stamina to exchange one Equipped Tool with one Backpack Tool. Blocked only by revealed **Danger**.
- **Switch Active** : Mark a different Equipped Tool as Active. Free. Blocked only by revealed **Danger**.

## Garb [REF_GARB]
- Resource -
- **Reduction**: Equipped Garb reduces Exhaustion like a tool: **S** reduces every action, **F / C / T / A** reduce only their matching action. It replaces the hole’s empty **S** boxes — it does not add fillable boxes.
- **Weather**: **W** Warm and **R** Rain resistance values.
- **Overflow**: If S boxes are full, you may Damage this piece (red cross); it absorbs overflow equal to its reduction values and becomes unusable until Repaired at a settlement.

## When Exploring [REF_WHEN_EXPLORING]
- **Move** : Not a separate action. An approach on the first revealed challenge Moves until that challenge is in Close, then resolves. Overcoming a challenge does this automatically.
- **Commit** : Choose an Approach on the Close challenge. Use the Active Tool, or Body if that tool has no matching line. An action without Range may be taken on the first revealed challenge; if it is not in Close, Move until it is, then resolve. A ranged line may be used while you are in **Danger**. Options you cannot target are out of reach. Switch Active first unless **Danger** blocks it.
- **Help** : Use an Equipped Tool approach to reduce another player's pending Exhaustion by 2. No resource cost.
- **Resolve** : Apply Exhaustion (garb reduction first, then fill S boxes; overflow Damages chosen garb), resolve outcomes, and clear the challenge. Then Move automatically.
- **Trail actions** : Use Rations, First Aid, Switch Active, Repack, and Retreat even with a challenge in Close. **Danger** is the only block. Repair waits for a settlement.
- **Repack Tools** : Pay 1 Stamina to exchange one Equipped Tool with one Backpack Tool. Blocked only by revealed **Danger**.
- **First Aid** : Spend 1 Bandage to recover spent Stamina, up to half your maximum (rounded down). Blocked only by revealed **Danger**.
- **Progress** : A path’s **Required Challenges** is how many overcomes count. Each overcome counts as 1. A line that prints **Detour** does not count. When the count is reached, you arrive.
- **Travel** : When progress reaches the path’s Required Challenges, you arrive automatically. The character card shows **Back to** the previous Area until you start a path.
- **Retreat** : Return to the last Landmark. Blocked only by revealed **Danger**.



## Exploration Steps[REF_EXPLORATION]

1. **Move** : If Close is empty, move challenges up to current Movement. Stop when a challenge reaches Close; reveal one challenge for each movement taken. After an overcome, this Move is automatic.
2. **Commit** : Choose a Close-challenge Approach, or the first revealed challenge if the action has no Range. If that challenge is not in Close, Move until it is, then resolve. Options you cannot target are out of reach. Use the Active Tool, or Body if that tool has no matching line. Switch Active first unless **Danger** blocks it.
3. **Exhaustion** : Gain unmet Challenge Power, then apply signed Stamina Values, then subtract garb reduction; fill S doll boxes. Overflow Damages chosen garb or empty body slots.
4. **Help**: Use an Equipped Tool approach to reduce another player's pending Exhaustion by 2. No resource cost.
5. **Resolve**: Apply Exhaustion, resolve outcomes, and clear the challenge. Then Move automatically.
6. **Trail actions**: Use Rations, First Aid, Switch Active, Repack, or Retreat even with a challenge in Close. **Danger** is the only block. Repair waits for a settlement.

- **Stamina Values**: Add the signed values on the Challenge and chosen Tool or Body. A negative result adds Exhaustion; a positive result is ignored. Positive Tool/Body values only cancel a negative Challenge value.

## At Landmarks [REF_AT_LANDMARKS]
- **Arrival** : Resolve arrival effects, then choose Short stop or Camp.
- **Short stop** : Advance 1 quarter-day; Repack freely; Rations recover 2 Stamina each.
- **Camp** : Advance 2 quarter-days; Repack freely; Rations recover 4 Stamina each. Repair waits for a settlement.
- **Quarter-day** : If the token is off the current Day/Night side, place it. If it is on, remove it and flip Day ↔ Night.
- **Leave** : Choose a Path, deal its Required Challenges from the Zone Deck as a face-down Challenge Deck, and begin with empty challenge slots.



## Activation & Discarding Effects [REF_ACTIVATION_DISACRDING_EFFECTS]

- **On Reveal** : Effect activates once when challenge is revealed.
- **On Use** : Effect activates once when the Active Tool is used on Close. This is a trigger, not a spend.
- **In Queue / While Revealed** : Effect is active while the Challenge remains revealed.
- **Charging X** : Effect activates once after **X** Actions.
- **Range X–Y** : Only activates on or against Challenges in slots X–Y.
- **[X+]**: Effect activates when receiving X+ Exhaustion.
- **Resource < N / Resource 0** : If you have fewer than N (or none) of that resource when this line resolves, apply the printed effect. **Stamina** counts remaining stamina (max minus spent). Check by hand; the rest of the line still happens.
- **Return** : Returns to the bottom of the current Challenge Deck instead of discarding.
- **Lasts X** : When cleared, it remains in play for X further actions.

## Standard Effects [REF_STANDARD_EFFECTS]
- **Exhaust X** : Gain X Exhaustion.
- **Recovery X** : Remove X Exhaustion.
- **Rations X** : Gain X Rations.
- **Spirit X** : Gain X Spirit (carried currency; glyph 🪬).
- **Find FX** : Find the Discovery matched to FX at the current Landmark.
- **Scout X** : Look at **X** Zone Deck cards.
- **Reveal +X** : For the next Move, Vision increases by X and you reveal X additional Challenges.
- **Power +X** : +X Power for the next Approach.
- **Challenge Power +X** : +X Power to the affected Challenge approaches.


## Tool Effects [REF_Tools_TOOL]

- Tools are a **mode**. Using a Tool does not spend Uses or any other tool resource.
- **Range X–Y**: This Tool line can target only Challenges in slots X–Y, and only when you are not in **Danger**.



# Forest Face Tests [challenge]

Test faces: full forest picture on a dark-brown mat with a soft frame. Name and effects overlay the art. Each card also has a back: the same picture with the zone name (Old Forest) instead of the card name. Not part of a zone deal.

## Test Wolf [TEST_FOREST_WOLF]
- Animal -
Face: forest
Picture: CardPictures/Old Forest.jpg
---
- [F] 3 :
- [T] 3 :
- [A] 9 :
---
Overcome with Fight ▸ Remove, +1 Rations
Grouping 2 : +2 Exhaustion when overcoming other Wolves.

## Test Thicket [TEST_FOREST_THICKET]
- Terrain -
Face: forest
Picture: CardPictures/Old Forest.jpg
---
- [C] 4 :
- [T] 1 :
---
Overcome with Craft ▸ Remove
In Qeue ▸ Blocking 1 : 1 challenge behind this one cannot be Overcome.

## Test Stream [TEST_FOREST_STREAM]
- Terrain -
Face: forest
Picture: CardPictures/Old Forest.jpg
---
- [T] 5 :
- [C] 4 :
- [A] 5 :
---
Overcome with Craft ▸ Remove, Materials +1
Overcome with Awareness ▸ +1 Reveal
---

## Test Woods [TEST_FOREST_WOODS]
- Terrain -
Face: forest
Picture: CardPictures/Old Forest.jpg
---
- [T] 4 :
- [A] 3 :
- [C] 5 :
---
Overcome with Awareness ▸ +1 Reveal
Overcome with Craft ▸ Remove
---

## Test Stags [TEST_FOREST_STAGS]
- Spirit -
Face: forest
Picture: CardPictures/Spirit Forest.png
---
- [A] 6 :
- [T] 3 :
- [F] 7 :
---
Overcome with Awareness ▸ Remove
---

# Play Aids [playaid]

Table sheets. **Picture**, **Tools**, and **Size** are the source of truth for **simulator.html** and **GarbSystem.html** — edit here, then refresh those pages. Zone / Path / Discard are name bars (count + click). The track is the Close / In Vision row.

## Body Doll [PLAY_BODY_DOLL]
- Play Aid -
Picture: CardPictures/bodydool.png
Size: 2x2
---

## Backpack [PLAY_BACKPACK]
- Play Aid -
Picture: CardPictures/backpack-open.png
Size: 1x2
Tools: CardPictures/backpack-tools.jpg
---

## Zone Deck [PLAY_FIELD_ZONE]
- Play Aid -
Size: 1x1
---

## Path Deck [PLAY_FIELD_CHALLENGE]
- Play Aid -
Size: 1x1
---

## Close [PLAY_FIELD_TRACK]
- Play Aid -
Size: 3x1
---

## Discard [PLAY_FIELD_DISCARD]
- Play Aid -
Size: 1x1
---

# Card layout  — use this when writing cards (not a card)

Use **`prototype-rules-reference.md`** for keyword definitions and **Lasts effects**. **`cards.html`** (card viewer) parses this file: keep structure predictable so layout and the viewer stay in sync.

### Viewer notes (optional)

- **Banner subtitle** — Optional line **`- Label -`** (hyphen–space–label–space–hyphen) before the first **`- [`** approach row prints **small caps under the title** (e.g. **Animal**, **Terrain**, **Finding**, **Search**, **Discovery**). **`Count:`** may appear above it. Subtitles **Finding**, **Search**, and **Discovery** also set the **banner colour** (amber / teal / violet) when the card lives in a mixed deck; dedicated decks use **`# … [finding]`**, **`# … [search]`**, **`# … [discovery]`** section headers instead.
- **Approach rows** (**`- [F] 6 Fight …`** — letter code in brackets, space, Power, space, flavour name) print **type colours** on the chip + flavour; **effect keywords** (Vision, Scout, Dread, …) print **black bold**; text after **`Keyword :`** prints as **italic** (comic) where the viewer formats it.
- **Approach outcomes** (`+1 Vision`, `+1 Rations`, `1 Scout` on tools, …) — **Standard effects** stay **keyword-only** on the card; **`[symbols]`** adds **icons only** (no rule text). **Card effects** (from **`card-definitions.md` → ## Effects**) can get a viewer-appended **` : ` + short gloss** on an outcome token when it matches a row (e.g. **Guidance** on an approach row).
- **Card effects** on field / Lasts lines (**`Challenge Power +X`**, **`Power +X`**, Grouping, Dread, Hinderance, …) use **`Name … : prototype-aligned explanation`** in **`cards.md`** (the viewer does not invent those lines). **Activation triggers** (`On Reveal`, `While Revealed`, **`Charging X`**, `[X+]`, …) stay **keyword-only** in the file; **`[symbols]`** may still assign **optional** icons (see *Icons: what to glyph* below).
- **Center-aligned field text** — A **whole line** **`>Phrase<`** (opening **`>`**, closing **`<`**, angle brackets **do not** print). Normal **`Keyword : …`** and token rules still apply **inside** the fence; **`[symbols]`** / outcomes behave as elsewhere.
- **Tool** cards — Put **only** what should print: preamble (**`On Use · …`**, **`Range … · Fight …`**, **`Continuous`**, **`Alternative`**, …) **above** **`---`**, then each **`- [F] N Fight : …`** approach row (**see §8**: **`---`** before the first **`- [`** row when there is preamble). Skip extra flavor paragraphs here; fiction and coaching notes belong in **`docs/challenge-design-guide.md`** (or another doc), not on the tight card face. **`cards.html`** does **not** append **`card-definitions.md` → ## Effects** gloss on tool decks (challenge cards still can), so special tool keywords stay keyword-only unless you add your own **`:`** explanation in the file.

### `+` / `−` in card copy (what gets a sign)

The viewer **does not insert** signs; you write them here so the file stays the single source of truth and is easy to tweak.

- **Use `+` or `−`** when the number is a **change** from the current situation: gains or spends on **Rations**, **Exhaust**, temporary **Power**, or **Challenge Power** modifiers (on approaches as `+2 Rations`; in explanations write `+1 Challenge Power` — that is not auto-iconised). The sign signals “this outcome or rule pushes a track or stat up/down,” not “this is the card’s fixed rating.”
- **Leave values unsigned** when they state a **baseline, capacity, or count that is not framed as a delta**: title **Vision** (the furthest slot for newly revealed challenges — write **`2 Vision`** style), **Scout X** / **Find FX** (how many cards or which discovery slot — **`4 Scout`**, **`F4 Find`**), **Recover X** / **Lasts X** / **Charging N** (ticks or charges — **`2 Recover`**, **`Lasts 1`**), and the approach **Power** in the bracket (`[F] 6 Fight : …`). Use **`Reveal +X`** for a temporary Vision increase on the next Move. Those read as “how hard this row is” or “+6 to something.”

If you are unsure, ask: *is this number “you gain or lose this much”* → sign; *is this “the stat or count **is** this on the card”* → usually no sign.

### Icons: what to glyph (advice)

- **Default priority** — Treat glyphs as **quick reads for things that move meters or need arithmetic**: Rations, Exhaust, Recover, Power, Vision / Scout counts, etc. That keeps the card face readable and aligned with what players actually track.
- **Activation lines** (**While Revealed**, **On Reveal**, **`Charging X`**, …) are **timing and attention cues**, not meters. **`Charging X`** delays linked **card effects** until **X** approach actions after this challenge was revealed (see **`prototype-rules-reference.md` → Activation Effects**). Icons there are **optional**: they help scanning but can feel noisy if every line has a sigil.
- **Practical rule** — If you add activation rows to **`[symbols]`**, use **distinct** shapes from standard effects (see **While Revealed** / **On Reveal** / **Charging** in the table above); omit those rows from `cards.md` if you prefer **text-only** triggers and icons **only** on standard outcomes.
- **Viewer behaviour** — [cards.html](cards.html) glyphs **approach outcomes** (standard keywords), **tokens** after **`:`** on field / Lasts lines when written as keywords (plain explanation words like `+2 Challenge Power when…` stay comic text). **`▸` in your file is plain text** (a visual connector you choose); it is **not** the same as the parser’s **`·`** (middle dot, U+00B7), which still splits a few pipeline steps when you use it. Glyphs apply only for keywords that have a **non-empty** symbol in **`[symbols]`**; **empty symbol cells** still keep **bold** outcome styling for that keyword. Card-only names (**Dread**, **Hinderance**, **Blocking**, …) stay bold without a table row unless you add them to **`[symbols]`**.

### Top-to-bottom in `cards.md` → on the printed / viewer card

1. **`## Title [ID]`** — Card name and id.
2. **`- Label -` (optional)** — Banner subtitle only: hyphen–space–text–space–hyphen on its own line **before** the first `- [` approach row; omit on cards that do not need a category line.
3. **`Count: **N**** (optional)** — Copy count for print/export.
4. **Whole-card field lines** — Everything **above** the first **`---`** that begins the “**middle**” block (**`- [`** approach rows). Write **`---`** on its own line **between** top field and that block, and **`---`** again after the last approach row **before** any **Lasts** / heads-down line (or as an explicit **empty tail** section when unused—**[cards.html](cards.html)** ignores a trailing **`---`** at end of card). **Finding** layouts add a **third **`---`** before the heads-tail row (§8). Lines here are **not** attached to an approach (see §6). Put **activations** first (**`While Revealed`**, **`On Reveal`**, **`Charging X`**, …, or tool **`On Use · …`**, **`Range … · Fight …`). Use **`Charging X ▸ …`** to delay linked **card effects** (**`Challenge Power +X`**, **`Power +X`**, Grouping, Dread, Hinderance, …) until **X** approach actions after reveal. Put each **card effect** as **`EffectName … : explanation`** on one line **or** end with **`:`** and put the explanation on the **next** line — **`cards.html`** merges and draws a **line break after the colon** (same for the **Lasts** band below `---`). Example: `Charging 1 ▸ Challenge Power +2 :` then `+2 Power to this challenge's approaches.` Do **not** merge `While Revealed` with an explanation without **`Name :`** — use separate lines, e.g.:  
   `While Revealed`  
   `Hinderance 1 : All other revealed challenges have +1 Challenge Power.`  
   Multiline example:  
   `While Revealed ▸ Grouping 2 :`  
   `+2 Challenge Power when this is not the only challenge with this name.`  
   These render in the **top band** under the title, not mixed into the approach block.
5. **Approach rows** — Each starts with `-` and bracketed stat + flavour name + outcomes, e.g.:  
   `- [F] 8 Fight : +3 Rations`  

   **Separators (layout reference)**  

   - **Pipe (spaced)** — Write a spaced **pipe** between tokens as **space-pipe-space** (same idea as `+2 Rations` **pipe** `[1+] Exhaust`). Means **independent outcomes** on the same approach — different effects, one row.  
   - **`▸` (U+25B8)** — Typed in the file between keywords you want read as **one connected phrase** (e.g. **`Lasts 1 ▸ Guidance 2 : …`**). It is **plain text**, not an auto-inserted symbol from `[symbols]`.  
   - **Middle dot `·` (U+00B7)** — Still used by the viewer for some **legacy cluster splits** if you write it; **`▸`** is the recommended separator for new card copy.  

   **Examples**  

   `- [F] 3 Fight : +2 Rations | [1+] Exhaust +3` — two outcomes on one approach.  

   `- [T] 5 Traverse :`  
   `Lasts 1 ▸ Guidance 2 : Traverse · +2 Power.` — **continuation line** after an approach that ends with **`:`** and has **no** text on that same line is attached as a **sub-line under that approach** (same layout as **`[1+] …`** riders under Fight). The top row shows **`[T] 5 Traverse :`** only; your line break in the file is preserved in the layout. Same wording can repeat under **`---`** for the Lasts band.  

   Do **not** concatenate unrelated tokens with no separator (e.g. `+2 Rations` jammed against `Lasts 1`).  

   **Order in the file:** you may list approaches in any order; **`cards.html`** sorts challenge approaches for display as **Fight → Craft → Traverse → Awareness** (stable order within the same type).
6. **Effect + explanation tied to the approach above** (Crow pattern) — To pin a line to the **immediately preceding** approach row, put it on the **next** line **without** `-` or `▸`, with **`Keyword : explanation`**:  
   `- [A] 2 Awareness : +1 Vision`  
   `Dread 2 : Awareness Challenge Power +2.`  
   The viewer attaches this to that approach and prints it **under** that row (not in the top field band). Do **not** put a blank line between that approach and this line if you want it to stay attached.
7. **Toolbelt-style `▸` sublines** — A line starting with **`▸`** immediately after an approach attaches to that approach the same way (optional gloss from **`card-definitions.md` → ## Effects** when the `▸` phrase matches a row; **not** used for standard effects).
8. **`---`** horizontal rule in **`cards.md`** (full line, exactly **`---`**). **[cards.html](cards.html)** uses it for ruled bands between card zones. By deck type:  
    - Tool deck (**`[tool]`**) — **`---`** between preamble (**`Weight`**, **`Range`**, …) **and** the **first `- [` approach row**, and **`---`** after the **last `- [` row** (third “tail” band in the file—usually empty except the divider). Omit the **first** **`---`** only if the body is **`- [`** rows with **no** preamble.  
    - Garb deck (**`[garb]`**) — hole-sized Body Doll slot cards from **`garb.md`**, not full-size tool layout.
    - **Challenge: Lasts / heads-down prose** — **`---`** followed only by **non-`-`** lines → **§9** (Lasts band, rotated).  
    - **Challenge: Finding sandwich** — **`---`**, **only** `- [` approach rows, **`---`** again, **only** heads-tail `- [` rows (e.g. **Search** **Find**) → rows **between** the two **`---`** use the **finding middle band**; rows **after** the second **`---`** use the rotated strip. Optional `- [` rows **before** the first **`---`** stay in the normal centre block; viewer expects **≥1** approach **before** the final **`---`** of the tails block.
9. **Below the final `---`** (optional) — **Approach-only tail** (`[A]` **Search**…) or **Lasts band** prose (or **both**: not supported in one strip — prefer **either** prose **or** extra rows after the splitter). When using **Lasts**, put **`Lasts X`** on the approach that keeps the card, and **duplicate the full Lasts sentence** on the approach (after **` ▸ `**) and again in this band so both orientations stay readable, e.g. **`Lasts 1 ▸ Guidance 2 : Traverse · +2 Power.`** (same wording as on the row). A line break after **`Guidance X :`** is allowed on approach rows (next line stays attached under that approach; see §5). You may prefix the band with **`Charging X ▸`** when those Lasts / guidance lines should also wait **X** actions after reveal. **Guidance** / **Prepare** lines need the **`:`** form. Not a one-shot **Recover X** on the band (put **Recover** on an **approach** as **`N Recover`** if it happens once when overcome). Physical card: bottom-up when used for heads-up approaches or Lasts text.

### Quick checklist

- [ ] Global triggers and field text sit **above** the first `-` approach row; anything with **`PrevApproach` + `Keyword : …` on the next line** sits **under** that approach (see §6).
- [ ] Every **card effect** (field, under an approach, or in the **Lasts** band) has **`Name : explanation`** in **`cards.md`** where it applies; **standard** outcome tokens stay keyword-only (icons only from **`[symbols]`**); **card-effect** tokens in outcomes may get gloss from **`card-definitions.md` → ## Effects** only.
- [ ] No orphan **`Keyword :`** line in the middle of the file without a preceding `-` approach unless it is intentionally a **top** field line.
- [ ] Approaches use **`- [F] N Fight : outcomes`** (or Craft / Traverse / Awareness — letter in brackets, space, Power, space, flavour); write standard outcomes **value-first** (`+2 Rations`, `+1 Vision`, `1 Scout` on tools, …). Use **` | `** between **independent** outcomes on the same approach; use **` ▸ `** between **connected** keywords in one cluster (e.g. `Lasts 1 ▸ Guidance 2 : …`). For outcomes that start on the **next** line after `- [T] 5 Traverse :`, end the approach line with **`:`** and put the rest on the following line (merged + line break in the viewer).
- [ ] **`---`** separates tool preamble from **`- [`** approach rows when there **is** preamble (§8); on challenges, **`---`** separates **Lasts** / heads-down lines and drives **finding** sandwiches (**Search**, … — §8 §9).
- [ ] **Lasts** behaviour matches **`prototype-rules-reference.md` → Lasts effects** and **Outcome** step 2.
