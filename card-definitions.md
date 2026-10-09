# Card text definitions

**Order:** Put rows in any order you like under each heading. Only **archive/cursor-ignored/rules.md** is sorted alphabetically when you sync.

**Sync rulebook (§12–§14):** `node scripts/sync-rules-from-definitions.mjs` — copies **Activation Keywords**, **Universal Effects**, and **Effects** (card text) into the rules, **A→Z by keyword**. **`cards.html`** outcome gloss uses **## Effects** rows only, not Universal Effects.

**Bold** = keyword (for **cards.md** / activations). After **`|`** = explanation. *Universal Effects* = rulebook reference only (synced to rules); they are **not** auto-appended on cards in **`cards.html`**. **Effects** (`## Tools` / `## Mixed` / `## Challenges`) drive **viewer** gloss on outcomes and field-style lines when the phrase matches a row. Optional `*(Tool)*`, `*(Mixed)*`, `*(Challenge)*` tag the rulebook **Type** column.

---

## Activation Keywords

**Approach**  |  Effect only activates when you choose that specific Approach (Fight, Craft, Traverse, Awareness).
**Once**  |  Activates only once after the Challenge is overcome.
**Change**  |  Activates after the Challenge is overcome and remains as a changed state on that card.
**On Reveal**  |  Activates once when this Challenge is revealed.
**While Revealed**  |  Active as long as this Challenge remains revealed.
**Last Challenge**  |  Activates only when one revealed Challenge is left.
**On Use**  |  Activates when the Active Tool is used on Close. This is a trigger, not a spend.
**Close**  |  Can only activate for the first Challenge in Reveal Order.
**Ranged**  |  Can activate for non-close targets (second position or higher), as allowed by card text.
**Charging X**  |  Waits **X** approach actions after this challenge was revealed; then the linked **card effects** on this card (see **Card Effects** in the prototype) apply or resolve as written.
**Grouping**  |  Activates only when at least one other revealed card has the same Name.
**[X+]**  |  Activates when X or more Exhaustion is suffered on the related line.
**Lasts X**  |  After this Challenge is overcome, keep it in play for X further actions; its Lasts effect remains active/visible.

## Universal Effects

**Find FX**  |  You find a Discovery (see rules §9).
**Exhaust X**  |  Gain X Exhaustion for your Character.
**Rations X**  |  Gain X **Rations** — spend them at Rest to recover Exhaustion.
**Recovery X**  |  Immediately remove X Exhaustion from your Character.
**Reveal +X**  |  *(Challenge)* For the next Move, increase Vision by X and reveal X additional new Challenges beyond the normal reveals from moving. Then Vision returns to normal.
**Return**  |  This Challenge is returned to the bottom of the current Challenge Deck instead of being discarded.
**Scout X**  |  Look at X zone cards; each: reveal or bottom.

## Effects
    ## Tools
**Area · Penetration**  |  *(Tool)* Reduce this line’s remaining Power by the Power of each Challenge overcome with it.
**Range X-Y**  |  *(Tool)* This line can target only positions X to Y in Reveal Order (position 1 = first revealed challenge).
**On Use · Scout X**  |  *(Tool)* When this Active Tool is used for an Overcome, you may resolve **Scout X** (standard Scout) as printed on the tool card.

    ## Mixed

**Move Close X**  |  *(Mixed)* Move the Challenge up in Reveal Order by X.
**Confusion**  |  *(Mixed)* Shuffle the Zone Deck.

    ## Challenges

**Charge**  |  *(Challenge)* When this challenge is revealed, if the space ahead toward Close is empty, it moves 1 space forward.
**Prepare 1 > Exhaust X**  |  *(Challenge)* After you overcome one challenge, if this challenge is at distance 1, gain X Exhaustion. Only a ranged tool used on this challenge prevents that activation.
**Blocking X**  |  *(Challenge)* X challenges behind this one in Reveal Order cannot be Overcome.
**Covering X**  |  *(Challenge)* The next challenge in Reveal Order has +X Challenge Power.
**Cramped X**  |  *(Challenge)* Fight Challenge Power +X.
**Challenge Power +X**  |  *(Challenge)* +X Power to this challenge's approaches.
**Dread X**  |  *(Challenge)* Awareness Challenge Power +X.
**Grouping X**  |  *(Challenge)* +X Challenge Power when another challenge with the same name is revealed.
**Guidance X**  |  *(Challenge)* Traverse Power +X.
**Obstacle X**  |  *(Challenge)* All other revealed challenges have +X Challenge Power.
**Power +X**  |  *(Challenge)* +X Power for your next Approach Action.
**Prepare X**  |  *(Challenge)* +X Power for the next Approach.
**Rough X**  |  *(Challenge)* Craft Challenge Power +X.
**Treacherous X**  |  *(Challenge)* Traverse Challenge Power +X.
**Use Rations X**  |  *(Challenge)* Spend **X** Rations **or** suffer **X** additional Exhaustion (see prototype **Card Effects**).








