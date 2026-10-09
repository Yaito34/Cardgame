/**
 * Looping zone background music + volume.
 * Old Forest → JuliusH - Forest Walk Epic Ballad.
 * Ruined Castle / Sunken Keep → Kaden Cook - Epic Dungeon Beat.
 */
(function (global) {
  var STORAGE_VOL = 'ruined-wold-music-volume';
  var STORAGE_PAUSED = 'ruined-wold-music-paused';
  var DEFAULT_VOL = 0.32;
  var FOREST_SRC = 'assets/Audio/JuliusH - Forest Walk Epic Ballad.mp3';
  var CASTLE_SRC = 'assets/Audio/Kaden Cook - Epic Dungeon Beat.mp3';

  var audio = null;
  var currentSrc = '';
  var wantedSrc = '';
  var volume = readNum(STORAGE_VOL, DEFAULT_VOL);
  var userPaused = readBool(STORAGE_PAUSED, false);
  var blocked = false;
  var gestureBound = false;

  function readNum(key, fallback) {
    try {
      var n = parseFloat(global.localStorage.getItem(key));
      if (Number.isFinite(n)) return Math.max(0, Math.min(1, n));
    } catch (e) {}
    return fallback;
  }

  function readBool(key, fallback) {
    try {
      var v = global.localStorage.getItem(key);
      if (v === '1') return true;
      if (v === '0') return false;
    } catch (e) {}
    return fallback;
  }

  function write(key, value) {
    try {
      global.localStorage.setItem(key, value);
    } catch (e) {}
  }

  function normZone(name) {
    return String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function isForestZone(name) {
    var s = normZone(name);
    if (!s || s === 'all') return false;
    if (s === 'ruined castle') return false;
    if (s.indexOf('ruined castle') !== -1 && s.indexOf('wood') === -1) return false;
    if (s.indexOf('sunken keep') !== -1) return false;
    return (
      s.indexOf('old forest') !== -1 ||
      s.indexOf('forest clearing') !== -1 ||
      s.indexOf('forestclearing') !== -1 ||
      s.indexOf('mouten') !== -1 ||
      s === 'forest' ||
      /\bforest\b/.test(s)
    );
  }

  function isCastleZone(name) {
    var s = normZone(name);
    if (!s) return false;
    if (s.indexOf('wood') !== -1) return false;
    return (
      s === 'ruined castle' ||
      s.indexOf('ruined castle') !== -1 ||
      s.indexOf('sunken keep') !== -1
    );
  }

  function trackForZone(name) {
    if (isCastleZone(name)) return CASTLE_SRC;
    if (isForestZone(name)) return FOREST_SRC;
    return '';
  }

  function ensureAudio() {
    if (audio) return audio;
    audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;
    audio.addEventListener('playing', function () {
      blocked = false;
      syncUi();
    });
    audio.addEventListener('pause', function () {
      syncUi();
    });
    return audio;
  }

  function srcUrl(rel) {
    return encodeURI(rel);
  }

  function isPlaying() {
    return !!(audio && !audio.paused && wantedSrc);
  }

  function tryPlay() {
    if (!wantedSrc || userPaused || volume <= 0) {
      if (audio) audio.pause();
      syncUi();
      return;
    }
    var a = ensureAudio();
    if (currentSrc !== wantedSrc) {
      a.src = srcUrl(wantedSrc);
      currentSrc = wantedSrc;
    }
    a.volume = volume;
    var p = a.play();
    if (p && typeof p.then === 'function') {
      p.then(function () {
        blocked = false;
        syncUi();
      }).catch(function () {
        blocked = true;
        syncUi();
      });
    }
    syncUi();
  }

  function setZone(name) {
    wantedSrc = trackForZone(name);
    if (!wantedSrc) {
      if (audio) audio.pause();
      currentSrc = '';
      syncUi();
      return;
    }
    tryPlay();
  }

  function setVolume(n) {
    volume = Math.max(0, Math.min(1, Number(n) || 0));
    write(STORAGE_VOL, String(volume));
    if (audio) audio.volume = volume;
    if (volume <= 0) {
      if (audio) audio.pause();
    } else if (wantedSrc && !userPaused) {
      tryPlay();
    }
    syncUi();
  }

  function setPaused(paused) {
    userPaused = !!paused;
    write(STORAGE_PAUSED, userPaused ? '1' : '0');
    if (userPaused) {
      if (audio) audio.pause();
    } else {
      tryPlay();
    }
    syncUi();
  }

  function togglePause() {
    if (!wantedSrc) return;
    if (volume <= 0) {
      setVolume(DEFAULT_VOL);
      setPaused(false);
      return;
    }
    setPaused(isPlaying());
  }

  function bindGestureUnlock() {
    if (gestureBound) return;
    gestureBound = true;
    function unlock() {
      if (wantedSrc && !userPaused && volume > 0) tryPlay();
    }
    document.addEventListener('pointerdown', unlock, { passive: true });
    document.addEventListener('keydown', unlock);
  }

  function pct() {
    return Math.round(volume * 100);
  }

  function syncUi() {
    var slider = document.getElementById('music-volume');
    var label = document.getElementById('music-volume-label');
    var toggle = document.getElementById('music-toggle');
    var host = document.querySelector('.music-control');
    if (slider && String(slider.value) !== String(pct())) slider.value = String(pct());
    if (label) label.textContent = pct() + '%';
    if (host) {
      host.classList.toggle('is-active', !!wantedSrc);
      host.classList.toggle('is-playing', isPlaying());
      host.classList.toggle('is-blocked', blocked && !!wantedSrc && !userPaused);
    }
    if (toggle) {
      var canPlay = !!wantedSrc;
      toggle.disabled = !canPlay;
      if (!canPlay) toggle.textContent = '♪';
      else if (userPaused || !isPlaying()) toggle.textContent = '▶';
      else toggle.textContent = '❚❚';
      toggle.title = !canPlay
        ? 'No music for this zone'
        : blocked && !userPaused
          ? 'Click to start zone music'
          : userPaused || !isPlaying()
            ? 'Play zone music'
            : 'Pause zone music';
      toggle.setAttribute('aria-label', toggle.title);
    }
  }

  function bindControls() {
    var slider = document.getElementById('music-volume');
    var toggle = document.getElementById('music-toggle');
    if (slider) {
      slider.value = String(pct());
      slider.addEventListener('input', function () {
        setVolume(Number(slider.value) / 100);
      });
    }
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        if (!wantedSrc) return;
        if (blocked || (!isPlaying() && !userPaused)) {
          userPaused = false;
          write(STORAGE_PAUSED, '0');
          tryPlay();
          return;
        }
        togglePause();
      });
    }
    bindGestureUnlock();
    syncUi();
  }

  global.ZoneMusic = {
    setZone: setZone,
    setVolume: setVolume,
    getVolume: function () {
      return volume;
    },
    bindControls: bindControls,
    isForestZone: isForestZone,
    isCastleZone: isCastleZone
  };
})(window);
