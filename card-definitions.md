# Card text definitions

**Order:** Put rows in any order you like under each heading. Only **rules.md** is sorted alphabetically when you sync.

**Sync rulebook (§12–§14):** `node scripts/sync-rules-from-definitions.mjs` — copies **Activation Keywords**, **Universal Effects**, and **Effects** (card text) into the rules, **A→Z by keyword**. Same file also drives **cards.html** expansion.

**Bold** = keyword (for **cards.md** / activations). After **`|`** = explanation. *Universal Effects* = rulebook reference; **Effects** = card expansion text. Under **Effects**, `## Tools` / `## Mixed` / `## Challenges` set the rulebook **Type** column; optional `*(Tool)*`, `*(Mixed)*`, `*(Challenge)*` at the start of a row labels that line in **cards.html** expansions.

---

## Activation Keywords

**Approach**  |  Effect only activates when you choose that specific Approach (Fight, Work, Traverse, Awareness).
**On Reveal**  |  Activates only once, when this Challenge is revealed.
**Ongoing**  |  Active as long as the Challenge is revealed.
**Last Challenge**  |  Only activates when there is only one revealed Challenge left.
**On Use**  |  Activates when a Tool card is used.
**Close**  |  Can only activate for the first Challenge in Reveal Order.
**Ranged**  |  Can only activate for the secound Challenge in Reveal Order or higher.
**Charging**  |  Only activates after the first player Action, after revealing Challenges.
**Grouping**  |  Only activates when there is at least one other revealed card with the same Name; name specific versions on cards as needed (e.g. Grouping [Wolf] in prose).
**[X+]**  |  When X or more Exhaustion is suffered on the related line, the Effect activates (see bracket notation on cards).

## Universal Effects

**Progress X**  |  Gain X Progress, required for Travel.
**Find FX**  |  You find a Discovery (see rules §9).
**Exhaust X**  |  Gain X Exhaustion for your Character.
**Rations X**  |  Gain X **Rations**  — you **spend** them when you **Rest** to Recover.
**Recover X**  |  Remove X Exhaustion from your Character **immediately** when the outcome resolves.



## Effects
    ## Tools
**Area X**  |  *(Tool)* The Tool’s Power can be used in full against X adjacent challenges, using one Approach.
**Penetration**  |  *(Tool)* Any Power that exceeds a target’s Difficulty carries over to the next challenge.
**Speed X**  |  *(Tool)* This Tool may be used up to X times before it is discarded at the next Stop.

    ## Mixed
**Power X**  |  *(Mixed)* +X Power/Difficulty.
**Scout X**  |  *(Mixed)* Look at the top X cards of the Zone Deck. Put them back in the same order.
**Reveal X**  |  *(Mixed)* Reveal X cards from the Zone Deck, which you need to overcome before reaching a Stop.

    ## Challenges
**Blocking X**  |  *(Challenge)* X challenges behind this one in Reveal Order cannot be Overcome.
**Grouping X**  |  *(Challenge)* +X Difficulty for other Wolfs.
**Obstacle X**  |  *(Challenge)* All Other revealed challenges have +X Difficulty.
**Covering X**  |  *(Challenge)* the next challenge in Reveal Order has +X Difficulty.
**Dread X**  |  *(Challenge)* All Awareness approaches of all currently revealed challenges have +X Difficulty.








