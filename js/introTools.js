// Intro Tools — programmatic mirror of cards.md (# Starting Tools, # Backpack Tools).
// Card face copy lives only in cards.md (no separate flavor/help on the printed tool).

/** Four tools recommended for a first exploration (ids match `cards.md` → # Starting Tools). */
export const introTools = [
  {
    id: "TOOL_CAMP_KNIFE",
    name: "Camp Knife",
    uses: [{ approach: "Fight", power: 2 }],
    effect: {
      keyword: "Mode",
      description: "Fight 2 while Active. Tools are a mode — no Uses cost (see cards.md).",
    },
  },
  {
    id: "TOOL_HAND_AXE",
    name: "Hand Axe",
    uses: [{ approach: "Craft", power: 4 }],
    effect: {
      keyword: "On Use",
      description:
        "Craft 4 while Active. On Use · Scout 1 when you Close with this tool (see prototype Standard Tool Effects).",
    },
  },
  {
    id: "TOOL_ROPE",
    name: "Trail Rope",
    uses: [
      { approach: "Traverse", power: 4, outcomes: "Scout 1" },
      { approach: "Craft", power: 3 },
    ],
    effect: {
      keyword: "Scout",
      description: "Traverse includes Scout 1 as on the card.",
    },
  },
  {
    id: "TOOL_CHARM",
    name: "Warded Charm",
    uses: [
      { approach: "Awareness", power: 4 },
      { approach: "Awareness", power: 2, outcomes: "Vision +1" },
    ],
    effect: {
      keyword: "Vision",
      description: "Two Awareness lines; lighter line is Vision +1 for next Reveal Step.",
    },
  },
];

/** Swap in from Backpack during Repack (ids match `cards.md` → # Backpack Tools). */
export const reserveTools = [
  {
    id: "TOOL_HUNTING_SPEAR",
    name: "Hunting Spear",
    uses: [{ approach: "Fight", power: 6, range: "1-2" }],
    effect: {
      keyword: "Range",
      description: "Range 1-2 · Fight 6 (see prototype Overcome for Range target).",
    },
  },
  {
    id: "TOOL_SHORT_BOW",
    name: "Short Bow",
    uses: [{ approach: "Fight", power: 5, outcomes: "Scout 1" }],
    effect: {
      keyword: "Fight Range",
      description: "Fight Range",
    },
  },
  {
    id: "TOOL_DRIVING_MAUL",
    name: "Driving Maul",
    uses: [{ approach: "Craft", power: 6 }],
    effect: {
      keyword: "Mode",
      description: "Craft 6 while Active.",
    },
  },
  {
    id: "TOOL_EMBER_LENS",
    name: "Emberglass Lens",
    uses: [{ approach: "Awareness", power: 4, outcomes: "Recovery 1" }],
    effect: {
      keyword: "Recovery",
      description: "Awareness 4 : Recovery 1.",
    },
  },
];
