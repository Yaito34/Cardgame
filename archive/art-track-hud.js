/*
  Play-HUD art track shifts. Saved with archive/art-track-hud.css.

  Each path card is 315px wide in card space. The picture repeats on x.
  Slot 0 (the character column) shows the picture at 0. Each card to the
  right is shifted one card-width so the slices read as one track.

  Call applyHudForestArtShifts() at the end of refreshPlayHud, and
  applyHudForestArtShift(heroSlot, 0) from paintHudActiveTool.
  Also set, when the track is painted:
    document.documentElement.style.setProperty('--path-art-count', String(1 + shown));
  where shown is the number of #hud-path-track .hud-path-slot that are
  not .is-path-blank.
*/

function applyHudForestArtShift(slotEl, index) {
  if (!slotEl) return;
  slotEl.querySelectorAll('.card[data-face-art="forest"], .card[data-face-art="castle"]').forEach(function(card) {
    card.style.setProperty('--card-art-shift', (-index * 315) + 'px');
  });
}

function applyHudForestArtShifts() {
  applyHudForestArtShift(document.getElementById('hud-path-hero-slot'), 0);
  var i = 1;
  document.querySelectorAll('#hud-path-track .hud-path-slot').forEach(function(slot) {
    applyHudForestArtShift(slot, i);
    i += 1;
  });
}
