# Garb

Catalog for **`GarbSystem.html`**. Add a piece under its doll slot, save, and refresh the page.

Serve the folder so the page can load this file (`npm run serve:cards` or `npm run serve:travel`). Fallback: `npm run build:garb`.

**Slots** must match a doll hole exactly: Head Under, Head Over, Neck, Coat / tabard, Body Inner, Body Middle, Body Outer, Legs Inner, Legs Middle, Legs Outer, Feet, Hands.

**Stats** sit on one line under the name. Skip a stat if it is 0.

Garb gives **Stamina, Durability, and Weather Resistance** — worn pieces simply add each stat to one pool. **S** adds to your Stamina pool; **Dur** adds to your Durability pool (exhaustion overflow drains it); **WR** reduces Exhaustion from weather effects like Cold and Wet.

**Empty slots give Stamina** — uncovered skin breathes: an empty **Inner** slot (Head Under, Body Inner, Legs Inner) gives **S 2**, any other empty slot **S 1**. Filling a slot replaces that base with the piece's own S, so light garb (S 1) beats padding on freedom of movement, while heavy padded garb trades Stamina for Durability and weather protection.

S Stamina · Dur Durability · WR Weather Resistance

```
### Piece name
S 2 · Dur 2 · WR 1

Short note.
```

Optional stable id: `### Piece name [my-id]`

---

## Head Under

### Linen skull cap
S 1 · WR 1

Against the skull. Wind under a hood.

### Padded linen coif
Dur 1

Padding for a helmet, still a winter cap.

## Head Over

### Wool hood
WR 1 · Dur 1

The outer you see on the road.

### Embroidered wool hood
WR 1 · Dur 1

Fashion on the Over piece.

### Felt hat

Good fashion in town.

### Iron helmet
Dur 2

Plain. Fight only.

### Rune-etched helmet
Dur 2

Marks on the visor and brow.

## Neck

### Wool scarf
WR 1

Third weather piece.

### Marked wool scarf
WR 1

Woven signs. Neck is the outer of that hole.

### Iron gorget
Dur 2

Stiff collar. Not a cloak.

### Engraved gorget
Dur 2

Runes on the collar.

## Coat / tabard

### Linen coat
WR 3 · Dur 1

Open weather shell. Wind and a little rain.

### Waxed linen coat
WR 2 · Dur 1

Rain. Closed coat hides Awareness on Body Outer.

### Wool cloak
WR 2 · Dur 1

A cloak counts as the coat in this hole.

### Fine wool cloak
WR 1 · Dur 1

Cut and colour as fashion.

### Linen tabard

Colours. Same hole as a coat — one or the other.

### Fine linen tabard

Hall fashion.

### Rune tabard

Signs sewn on the face.

## Body Inner

### Linen jacket
S 2 · WR 1

Light Inner. Not underwear.

### Padded linen jacket
S 1 · Dur 1

Live-in padding.

## Body Middle

### Wool jacket
S 1 · Dur 1

Cloth stack. Warm.

### Leather jack
Dur 2

Craft and a little Fight.

### Mail
Dur 3

Ringed shirt.

## Body Outer

### Heavy wool
Dur 1

Cloth Outer when you skip plate.

### Dyed heavy wool
Dur 1

Fashion on the Outer.

### Iron plate (chest, shoulders, and arms)
Dur 3

Plain harness.

### Etched iron plate
Dur 3

Runes on the breast and arms.

## Legs Inner

### Linen trousers
S 2 · WR 1

Everyday Inner.

### Padded linen trousers
S 1 · Dur 1

Same idea as the padded jacket.

## Legs Middle

### Wool over-trousers
S 1 · Dur 1

Winter stack.

### Mail trousers
Dur 3

Fight.

## Legs Outer

### Waxed over-trousers
WR 1 · Dur 1

Mud and rain.

### Iron thigh plates
Dur 3

Body plate for the thighs.

### Etched thigh plates
Dur 3

Runes on the thighs.

## Feet

### Leather shoes
Dur 1

Quiet road.

### Leather boots
WR 1 · Dur 2

Walk and fords.

### Fine leather boots
WR 1 · Dur 2

Cut as fashion. Feet are the outer of that hole.

### Iron boots
WR 1 · Dur 2

Greaves included.

## Hands

### Wool gloves
Dur 1

Craft.

### Leather gloves
Dur 1

Open Craft.

### Embroidered gloves
Dur 1

Fashion on the hands.

### Iron gauntlets
Dur 2

Fight.

### Etched gauntlets
Dur 2

Runes on the cuffs.

# Trinkets

Item cards, like Tools. They are not doll holes and they have no S / Dur / WR values.

## Belt

### Leather belt

Holds the trousers. Pouches are Kit, not this card.

### Sword-belt

Same family as Tools: carry it, do not park it on the doll.

## Wrists

### Wool wrist bands

Not gauntlets. No token squares.

### Leather wrist bands

Arm rings and cloth bands live here.

### Bead wrist bands

Colour and marks are the name, not Awareness slots.

## Earrings

### Copper earrings

Worn, not a Head hole.

### Rune earrings

Signs on jewellery, still not a doll slot.

## Ring

### Plain iron ring

Same idea as a Tool card: item, not garb layer.

## Brooch

### Cloak brooch

Pins the wrap. The wrap stays on the doll; this card does not.
