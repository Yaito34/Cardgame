// features.js

// Define constants
export const FEATURE_GRASS_FIELD = 'Grass Field';
export const FEATURE_GRAVE_STONE = 'Grave Stone';
export const FEATURE_GRASS_FIELD_GEAR = 'Grass Field-Gear';
export const FEATURE_WILD_PATH = 'Wild Path';
export const FEATURE_FOREST_PATH = 'Forest Path';

// Group all in a single object (optional but helpful)
export const FEATURES = {
  FEATURE_GRASS_FIELD,
  FEATURE_GRAVE_STONE,
  FEATURE_GRASS_FIELD_GEAR,
  FEATURE_WILD_PATH,
  FEATURE_FOREST_PATH
};

// Define allSpots using constants
export const allSpots = [
  {
    id: FEATURE_GRASS_FIELD,
    show: true,
    html: `
      <div class="spot-frame">
        <div class="spot-banner"><span class="feature"><b>Grass Field</b></span></div>
        Tall grass fills a clearing in the middle of a forest.
      </div>`
  },
  {
    id: FEATURE_GRAVE_STONE,
    show: true,
    html: `
      <div class="spot-frame">
        <div class="spot-banner"><span class="feature">Grave Stone</span></div>
        In the center of the clearing a solemn grave stands. The earth beneath the
        <span class="i-item item" data-tooltip="Examine"
          onclick="openModal('The grave stone is small but the carvings and material is remarkable forming a real image of a Leaf, with a bright and darker half.')">
          well crafted
        </span>
        stone is dug up. Nothing was left or ever there beneath the earth.
      </div>`
  },
  {
    id: FEATURE_GRASS_FIELD_GEAR,
    show: true,
    html: `
      <div class="spot-frame">
        <div class="spot-banner"><span class="feature">Grass Field</span></div>
        Tall grass fills a clearing in the middle of a forest. Some spots
        <span class="i-item item" data-tooltip="Examine"
          onclick="openModal('In the grass lays scattered gear, would it exist you would gain it')">
          don't have grass.
        </span>
      </div>`
  },
  {
    id: FEATURE_WILD_PATH,
    show: true,
    html: `
      <div class="spot-frame">
        <div class="spot-banner">
          🢄 &nbsp;<span class="feature">Wild Path</span> &nbsp;
          <span class="e-item item" data-tooltip="Go Through" onclick="goTo('Location5')">[ ᑎ ]</span>
        </div>
        Between the trees a small path through the bushes can be seen.
      </div>`
  },
  {
    id: FEATURE_FOREST_PATH,
    show: true,
    html: `
      <div class="spot-frame">
        <div class="spot-banner">
          🢁 &nbsp;<span class="feature">Forest Path</span> &nbsp;
          <span class="e-item item" data-tooltip="Go Through" onclick="goTo('Location4')">[ ᑎ ]</span>
        </div>
        A partially overgrown but still usable path goes into the forest.
      </div>`
  }
];
