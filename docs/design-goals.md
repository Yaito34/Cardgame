# Design Goals

Top-level aims for the game. **How** a rule works lives in **`CurrentRulesDesign.md`**. This file is **why** those rules exist — keep it short.

Authoring: **`docs/challenge-design-guide.md`**, **`docs/travel-book-design.md`**, **`docs/garb-doll.md`**.

---

## Top-level

**Solo core, all content, different play.** The game is built for one player. Every character can do every kind of content (Fight, Work, Traverse, Awareness; any Zone). Classes differ in **playstyle** and where player skill is hardest — not in which jobs they are allowed to have. An awkward job stays legal without setup (costlier, cheaper line, or Body); setup is a puzzle the player can cause, not a deck lottery or a hard lock.

**Fast co-op from the solo core.** Multiplayer is the same personal-track loop, in parallel. Cooperation is a **fast, simple Help layer** after Commit (use an Equipped Tool, cut pending Exhaustion, no spend) — not a shared encounter, not a planning minigame. Discussion stays short so a turn-based game still feels quick.

**Easy hop in and out.** No required group roles. No power progression that a late joiner must catch up on before they can play. Three of the same class is fine. Help may soften a spike; it must not erase a bad loadout or invent a missing role.

**Horizontal world, pockets of hard.** Always a choice of where to go. Progression is **horizontal** (kit, map knowledge, recipes) and is only **required** for harder **pockets**. Easy path networks let you explore a Zone almost fully without that kit — free travel independent of progress — while every Zone still holds interesting challenges on those harder pockets and paying lines.

**Layers, then done.** This is a Ragnarok-like open world, but a place is finished by clearing its **difficulty layers**, not by camping it. The first visit can beat the easy layer and still leave the harder ones, so the Area is not cleared the first time you see it. You return to master the next layer. When the top layer is cleared, that Area’s unique rewards are done. The upgrade over a spawn-tile grind is better choices inside the layer you are on — not heavier classes or action combat.

**EXP anywhere, so the grind is a choice.** A little **EXP** is gained wherever you play, including Areas you have already cleared (`docs/class-progression.md`). It pays Trainings. The rate is not better in a special camp than on any other road, so staying to gather it is optional. Unique prizes stay on uncleared layers and do not come from that grind.

**Fun before skills.** Printed challenge lines must already be a game: pay for the treasure line, take the cheap clear, or ignore an optional (tree, hut, forage) and spend nothing — that ignore prints **Detour** and does not count toward progress. Resource checks (`Stamina < 3 : Exhaust 2`) make cheap lines worse when you are already empty. **Masteries, Trainings, and special skill verbs come after.** If the cards are dull without them, the skills will not save the loop.

**Tools are a mode, not a rotation.** One of four Equipped Tools is **Active**. Close uses that tool. Using it does **not** cost Uses or any other tool resource. **Switch Active** is free and legal with a challenge in Close. A revealed **Danger** is the only lock. You can change jobs before the next Commit; you cannot change them while Danger is showing.

---

## Loot & crafting

**Identity.** Specific things come from specific places. A recipe names a **challenge + Action**, never a map page. A higher **layer** in that place is where the richer or remaining part sits. Learning the world is learning which layer you have not cleared yet.

**Variation inside a place.** While a layer is still open, the Zone Deck decides which cards appear. A Search source may use a **small find table** (common wreck, Materials, rare jackpot). The next layer is a harder problem in the same Area — new pressure, not the same job with a bigger Count. Do not finish an Area by repeating the easy layer.

**Long catalog.** Players should play a long time without seeing or finishing everything. Rarity is **many named sources**, **sparse leaks** into other Zones, **peak-only wrecks**, and **already-assembled / Lore** rows — not a miss after you already paid.

**No extra loot roll.** Paying Search **gets** that source’s packet card (if still unclaimed). Matching a packed recipe **ticks**. Open rewards (Materials, Spirit, Rations) are immediate. Randomness is the **deck**, **which Area you chose**, and **which table row** — not a second fail on a known T-code.

**Two steps.** Recipe (what you are building, public) then **fetch** from a layer you have not cleared. A higher layer can pay a larger one-time packet. Repeating a layer you have already cleared does not keep paying unique components.

**Search vs repeat.** Search **gets the wreck** for the layer you cleared. Ordinary Fight / Work / Traverse / Awareness may **tick** a packed recipe during that attempt. Do not randomize ticks. After the layer is cleared, the repeatable yield is **EXP**, and EXP is not limited to one Area or to Search.

---

## Discovery & exploration

**Choices that result in different play.** Where you go changes all layers of the game (Zones, Areas, challenges, rewards…).

**Different rewards create different long-term changes to the gameplay.** A new way to play: new tools, a higher layer worth attempting, new **pockets**. Rewards should not be the only key that makes a Zone or Area legal to enter, and they should not open a farm you must keep.

---

## World (open, like Ragnarok Online)

**Go anywhere, gated by challenge.** You can aim at any place at any time. No story door or level number. Hardness belongs on **pockets** and paying lines — not on “you may not enter this Zone yet.”

**Easy networks, hard pockets.** Each Zone should stay mostly reachable on easier paths so exploration does not wait on kit. Horizontal progression (better Tools, garb, recipes, knowledge) opens the **next layer** — a peak, an awkward line — not the right to enter the Zone, and not a camp you are meant to stay in.

**Always at least three live options.** At every character / kit stage, at least three paths stay worth taking. Missing Tools or fuel may make a **higher layer** expensive; it should not collapse the map to a single corridor or lock the Zone. A cleared Area is not one of those required options.

**Return until the top layer.** The first prize does not finish the Area. Later layers are why you come back, and they should not be beatable on the first visit. Not every connector needs its own stack — depth belongs on Areas you are meant to master. After the top layer, the page can remain a road or a camp. Its unique rewards do not.

**Places feel different.** Area effects, challenge mix, theme, and rewards are not a reskin of the last layer.

**Finds in A change pockets in B.** The right Tool, player skill, or resources proved in one Area make a higher layer elsewhere **efficient or newly worth paying** — a peak, a cheaper awkward line. They do not make another Area exist, and they do not replace the easy path into that place.

**New Tools invite experiment.** A permanent change to **how** you do jobs you already have, whose full use is not obvious on pickup. Discovery includes learning the kit, not only the map. Tools must not unlock a missing Action type.

---

## Expedition (one layer is a run)

**Shared theme, different paths.** Multiple routes with different properties, still the same Zone identity — shared challenges and some shared properties.

**Loot, fight, or pass.** Stay for this layer’s Search, engage, or push through. That choice is the in-Area game. Staying after the layer is cleared is only for the road, or for **EXP** you could also have taken somewhere else.

**Deeper costs more and pays more.** On **this run**, the layer’s one-time reward rises with commitment; so does fail risk (fuel, Damaged holes, Forced Retreat). That is expedition depth, not a character level, and not a loop you are meant to keep after the clear.

**Deeper reveals.** New challenges, rewards, and Paths as you commit further on the stretch.

**Getting out is play.** Deciding *when* to leave, then still executing it: known Areas still take a Challenge Deck (easier than the way in, not a skip). Danger can still lock you.

**Prep is the other half.** Bringing the right Tools and supplies matters on **paying lines and pockets**. Empty bags and the wrong kit should hurt there. Starter kit and the easy path network must still let you travel and see the Zone.

---

## Exploration & the map

**The road is a deck.** A path is a finite Challenge Deck from the Zone. Arrival is empty deck + nothing Close. The Zone Deck **reshuffles full** after each stretch so an uncleared layer can be attempted again, and so a cleared road can still be walked. Encounters stay a stable pool, not a depleting dungeon. A cleared layer is not a prize you still need.

**Knowledge lives on pages.** **Travel Book** = known Areas, which layer is still open, camps and roads. **Discovery Book** = unmapped stairs and doors. Zone cards are **repeatable hazards**, not unique rooms or forks.

**Return for the next layer.** You revisit because a harder layer in the same Area is still open, so the first visit does not finish the place. Master it, clear it, and that unique reward is done. One-shot *finds* are fine. A cleared Area may stay on the map as a **connector** or **camp**. It is not an unfinished prize, and it is not a better place to grind **EXP** than anywhere else.

**Forks are travel choices.** Real “which way?” is an exit. Short greed pockets are **Side Branches** (Pass vs pay). Crossing into a new Zone is a real commitment, with a short **turn-back** window.

**Known return is still a road.** The way back is easier and known, not a teleport. Soft exit unless **Danger** locks you in.

---

## Conflict (overcoming challenges)

**Loadout vs the card.** Four Actions (Fight, Work, Traverse, Awareness). The **Active Tool** beats Body on efficiency when it matches; Body / Power 0 is the unlimited fallback when the mode is wrong. Wrong kit should still have a **cheap line**, not a hard lock. Optional ignores stay Power 0 and print **Detour**, so the skip does not count toward progress.

**One resolution.** Compare **Power**, then **Stamina Values**, then spend Stamina from the numeric pool. Help uses an Equipped Tool and does not spend a resource. No extra combat minigame, no loot die inside Close. Overcoming a challenge **Moves** immediately into the next position.

**Readable pressure.** A small keyword list (Danger, Blocking, Covering, Grouping, On Reveal, Count, Detour). Variety is **combinations** and **named types**, not new keywords each card.

**Count is a harder layer, once.** Extra tokens can mean a tougher pack or a larger one-time packet on a layer you have not cleared. They are not an infinite component drip after that layer is done.

**Hold the mode when Danger is showing.** A filled Close does not lock Switch Active. A revealed Danger card does. Seeing Danger ahead and still being on the wrong tool is the tax. That tax must be interesting even if you never fire a Mastery.

---

## Risk, failure, retreat

**Stamina is the clock.** One number — the Stamina maximum from the character creator, shown on the character card — is the pool. Exhaustion from any challenge Action, minus **garb reduction** (S universal, F/C/T/A matching — like tools), spends Stamina. Leftover Exhaustion **Damages** chosen garb (red cross; one piece if its reduction values cover the overflow, more if not). **Repair** (garb) at a settlement is the only fix. If no undamaged garb remains, the expedition ends (**Forced Retreat**): lose **carried Spirit**; stored Spirit stays.

**Soft gates first.** Rations on the trail vs Camp, **First Aid** (Stamina recovery), Retreat when you are not in Danger, packing Strength. The cliff is for empty fuel, Danger lock, or pushing the S pool too far.

**Danger means committed.** **While Revealed ▸ Danger** locks you as soon as that challenge is showing. **While Close ▸ Danger** locks you only once it is in Close. Print the timing that fits the threat. While that Danger is active you cannot Use Rations, First Aid, Switch Active, Repack, or Retreat. A Fight, including a ranged line, stays legal. Free return to the previous Area exists only after you arrive, and ends when you start a path.

---

## Campaign between runs

**Settlement is the run bookend.** Start and end there. Mapped transitions stay in the Travel Book. **Claimed** Recipe/Tool cards stay with the group; **unclaimed** packet cards return for later expeditions. A player who hops in without that catalog still plays: starter kit + easy paths. Shared wrecks are extra efficiency, not an entry ticket.

**Master, then move on.** Better kit and map knowledge change which **layer** you can clear — not a farm to improve, not a one-way story dungeon, and not a power ladder a late joiner must climb before they can explore. **EXP** from anywhere can buy a Training. It must stay a side yield, or the safest road becomes the real prize.

**Spirit is the town currency.** Carry vs store; Forced Retreat taxes what you did not bank. Buy/sell gap so a **found** tool beats a bought one.

---

## Table feel

**Keep Close fast.** Search **queues** the packet card until stretch end (look at recipes then, not mid-row). Strength is **1:1** tokens. Effects should be trackable without a journal. Switch Active is one mark, blocked only by revealed Danger — not a planning board.

**Solo-honest.** Every challenge must make sense on **one** player’s track. Party-scale weather and unique set-piece rooms do not belong in the Zone Deck.

**Help is the whole co-op layer.** After everyone has committed, players may use an Equipped Tool to cut another’s pending Exhaustion. That is the multiplayer addition — not role coverage, not a second resolution, not a long talk. Help does not change your Active Tool and does not spend a resource.

---

## Character & kit

**Volk + Role + two Masteries** define what you can Equip and what you are especially good at. **Role** here is a **tool family** (Warrior tools, Sage tools), not a party job the table must fill. Four Equip slots; **one Active**; Weight always counts. Garb is **Exhaustion reduction on the character card** (S universal, F/C/T/A matching — exactly like tools), not another Tool and not a second stamina pool. Layered doll (zones, Warm/Cool, sneak as Traverse): **`docs/garb-doll.md`**.

**Playstyle, not missing verbs.** Every character can take every Action and clear every content type. Identity is how the job feels (native job straightforward; awkward job a higher skill ceiling you can set up). Do not gate jobs behind class or party composition. Do not use skills to paper over a challenge face that has no real choice.

**Special supplies** need Kit containers (slots, not Weight). Base Rations / Materials stay the everyday fuel.

---

## What not to chase

- A second random check to “see if the Search counted”
- Recipe checklists copied onto Area pages or challenge faces
- Unique named rooms in the Zone Deck
- Map forks printed as challenge cards
- Growing a large keyword list instead of combining a small one
- Heavier classes or action combat as the “upgrade” over an open world of layers
- A required return to a layer you have already cleared, for its unique prize
- An EXP rate that is better in one camp than everywhere else (that recreates a mandatory farm)
- Required group roles, or classes that cannot do some Actions / content
- Vertical power progression that a late joiner must catch up on, or that gates a whole Zone / Area instead of a pocket
- A named Tool as the only way another Area becomes playable (finds change pockets, not map legality)
- Shared party encounters as the default Close (personal tracks + Help stay the multiplayer model)
- Static farm tiles with no in-Area game (no loot / fight / pass, no extraction)
- Finishing an Area by repeating its easy layer (a higher layer has to be a new problem)
- Picking a new Equipped Tool every Close (rotations, cooldowns, “which button this card”)
- Skills, Masteries, or Trainings as the only interesting decision — the printed challenge lines have to work first
