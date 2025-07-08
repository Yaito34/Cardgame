window.paragraphSlots = [
  {
    id: 'grave',
    show: false,
    html: `
      <div class="line">
        <span class="feature">Grave</span>
      </div>
      In the center of the clearing a solemn grave stands. The earth beneath the
      <span class="i-item item" data-tooltip="Examine"
        onclick="openModal('The grave stone is small but the carvings and material is remarkable forming a real image of a Leaf, with a bright and darker half.')">
        well crafted
      </span>
      stone is dug up. Nothing was left or ever there beneath the earth.<br><br>
    `
  },
  {
    id: 'gear',
    show: false,
    html: `
      <div class="line">
        <span class="feature">Scattered Gear.</span>
      </div>
      In the grass lays 
      <span class="i-item item"
        data-tooltip="Examine"
        onclick="openModal('You gain Air Gear, this is sadly not solid enough to be useful.')">
        garb</span>,
      <span class="i-item item"
        data-tooltip="Examine"
        onclick="openModal('You gain Air Gear, this is sadly not solid enough to be useful.')">
        tools</span> and some weapons and armore, most looks broken. ( If you want to pick it up touch it.)<br><br>
    `
  },
   {
    id: 'tree',
    show: false,
    html: `
      <div class="line">
        <span class="feature">Tree</span>
      </div>
      In the grass lays 
      <span class="i-item item"
        data-tooltip="Examine"
        onclick="openModal('You gain Air Gear, this is sadly not solid enough to be useful.')">
        garb</span>,
      <span class="i-item item"
        data-tooltip="Examine"
        onclick="openModal('You gain Air Gear, this is sadly not solid enough to be useful.')">
        tools</span> and some weapons and armore, most looks broken. ( If you want to pick it up touch it.)<br><br>
    `
  },
  // Add more slots as needed
];