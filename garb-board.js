/**
 * Shared Body Doll + Backpack play-aids.
 * Art paths come from cards.md (`Picture:` / `Tools:` / `Size:`).
 * GarbSystem.html and simulator.html both load this file so a card edit
 * updates both pages on refresh.
 */
(function (global) {
  var DEFAULT_ART = {
    bodyDoll: 'CardPictures/bodydool.png',
    backpack: 'CardPictures/backpack-open.png',
    backpackTools: 'CardPictures/backpack-tools.jpg'
  };
  var DEFAULT_SIZES = {
    bodyDoll: '2x2',
    backpack: '1x2'
  };

  var art = {
    bodyDoll: DEFAULT_ART.bodyDoll,
    backpack: DEFAULT_ART.backpack,
    backpackTools: DEFAULT_ART.backpackTools
  };
  var sizes = {
    bodyDoll: DEFAULT_SIZES.bodyDoll,
    backpack: DEFAULT_SIZES.backpack
  };

  var COLS = [
    { key: 'st', label: 'S' },
    { key: 'dur', label: 'Dur' },
    { key: 'wr', label: 'WR' }
  ];

  var HOLES = [
    { id: 'body-outer', label: 'Body Outer', side: 'left', icon: 'body', layer: 'III' },
    { id: 'body-middle', label: 'Body Middle', side: 'left', icon: 'body', layer: 'II' },
    { id: 'body-inner', label: 'Body Inner', side: 'left', icon: 'body', layer: 'I' },
    { id: 'legs-outer', label: 'Legs Outer', side: 'left', icon: 'legs', layer: 'III' },
    { id: 'legs-middle', label: 'Legs Middle', side: 'left', icon: 'legs', layer: 'II' },
    { id: 'legs-inner', label: 'Legs Inner', side: 'left', icon: 'legs', layer: 'I' },
    { id: 'head-over', label: 'Head Over', side: 'right', icon: 'hat', layer: 'II' },
    { id: 'head-under', label: 'Head Under', side: 'right', icon: 'hat', layer: 'I' },
    { id: 'neck', label: 'Neck', side: 'right', icon: 'neck', layer: '' },
    { id: 'wrap', label: 'Coat / tabard', side: 'right', icon: 'coat', layer: '' },
    { id: 'hands', label: 'Hands', side: 'right', icon: 'hands', layer: '' },
    { id: 'feet', label: 'Feet', side: 'right', icon: 'feet', layer: '' }
  ];

  var SLOT_TILE = 'M3.1 7.2 6.8 2.6 13.2 3.8 19.8 2.2 26.4 3.6 29.8 8.2 28.9 14.1 30.4 20.2 27.6 26.6 21.4 30 13.8 28.8 6.6 30.4 2.2 25.2 1.6 17.6 2.8 10.8Z';
  var SLOT_TILE_WIDE = 'M2.8 7.4 6.6 2.8 13.2 3.6 21 2.4 29.2 3.4 35.4 4.6 38.2 8.6 37.4 14.2 38.8 20.4 36 26.8 29.6 30 18.8 28.8 8.8 30.2 3.2 25.4 2 17.6 3.2 10.8Z';
  var SLOT_GLYPH = {
    hat: '<path fill="#efe4c8" d="M10.2 16.4c0-2.8 2.4-5.2 5.8-5.2s5.8 2.4 5.8 5.2v1.2H10.2zm-4 1h19.6c.7 0 1.2.4 1.2 1s-.5 1-1.2 1H6.2c-.7 0-1.2-.4-1.2-1s.5-1 1.2-1z"/>',
    body: '<path fill="#efe4c8" d="M16 7.2c3.4 0 6.2 2.4 6.8 5.6l2.4 10.4h-3.2l-1.2-5.2c-.2 2.2-2.2 3.8-4.8 3.8s-4.6-1.6-4.8-3.8l-1.2 5.2H7l2.4-10.4C10 9.6 12.6 7.2 16 7.2z"/>',
    legs: '<path fill="#efe4c8" d="M11.2 8.2h9.6v3.2H11.2zm0 3.2h3.4v12.8h-3.4zm6.2 0h3.4v12.8h-3.4z"/>',
    neck: '<path fill="#efe4c8" d="M16 9.2c3.8 0 6.8 2.2 6.8 5.2 0 1.4-.8 2.6-2 3.4v1.6c1.8-1 3-2.8 3-4.9 0-4-3.5-7.2-7.8-7.2S8.2 9.5 8.2 13.5c0 2.1 1.2 3.9 3 4.9v-1.6c-1.2-.8-2-2-2-3.4 0-3 3-5.2 6.8-5.2z"/><path fill="#efe4c8" d="M12.4 18.2h7.2v2.4c0 1.2-1.6 2.2-3.6 2.2s-3.6-1-3.6-2.2z"/>',
    coat: '<path fill="#efe4c8" d="M10.6 10.4q0-2.8 2.6-2.8h5.6q2.6 0 2.6 2.8v13.6q-5.4-2.6-10.8 0z"/>',
    hands: '<path fill="#efe4c8" d="M16 21.2h-1.4V10.4q0-2.6 2.4-2.6h4.4q2.4 0 2.4 2.6v10.8h-1.6v4.2H16z"/><path fill="#efe4c8" d="M14.6 12.2c-3.6-.8-5.4 1.2-5.2 3.4.3 2.2 3 2.8 5.2 1.4z"/>',
    feet: '<path fill="#efe4c8" d="M10.4 12.2h6.2v7.2h6.8c1.2 0 2.2.8 2.2 1.9v1.5H10.4V12.2zm1.8-3.4h3.2v3.4h-3.2z"/>'
  };

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function normalizePic(value) {
    var v = String(value || '').trim().replace(/^<|>$/g, '');
    if (!v) return v;
    if (/^https?:/i.test(v) || v.indexOf('data:') === 0) return v;
    v = v.replace(/\\/g, '/');
    if (v.indexOf('/') === -1) v = 'CardPictures/' + v;
    return v;
  }

  function cacheBust(url) {
    if (!url || /^data:/i.test(url)) return url;
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
  }

  function parseSize(value, fallback) {
    var m = String(value || fallback || '1x1').match(/(\d+)\s*[x×]\s*(\d+)/i);
    return {
      cols: m ? Math.max(1, parseInt(m[1], 10) || 1) : 1,
      rows: m ? Math.max(1, parseInt(m[2], 10) || 1) : 1,
      raw: m ? m[1] + 'x' + m[2] : String(fallback || '1x1')
    };
  }

  function isDollCard(card) {
    if (!card) return false;
    var id = String(card.id || '').toUpperCase();
    var name = String(card.name || '').trim().toLowerCase();
    return id === 'PLAY_BODY_DOLL' || name === 'body doll' || name === 'body dool';
  }

  function isPackCard(card) {
    if (!card) return false;
    var id = String(card.id || '').toUpperCase();
    var name = String(card.name || '').trim().toLowerCase();
    return id === 'PLAY_BACKPACK' || name === 'backpack';
  }

  function fieldId(card) {
    return String((card && card.id) || '').toUpperCase().replace(/__\d+$/, '');
  }

  function fieldRole(card) {
    if (!card) return '';
    var id = fieldId(card);
    if (id === 'PLAY_FIELD_ZONE') return 'zone';
    if (id === 'PLAY_FIELD_CHALLENGE') return 'challenge';
    if (id === 'PLAY_FIELD_REVEAL') return 'reveal';
    if (id === 'PLAY_FIELD_TRACK') return 'track';
    if (id === 'PLAY_FIELD_DISCARD') return 'discard';
    var name = String(card.name || '').trim().toLowerCase();
    if (name === 'zone deck' || name === 'zone deck field') return 'zone';
    if (name === 'challenge deck' || name === 'path deck' || name === 'challenge deck field') return 'challenge';
    if (name === 'reveal' || name === 'reveal field') return 'reveal';
    if (name === 'challenge track' || name === 'track' || name === 'close') return 'track';
    if (name === 'discard' || name === 'discard pile') return 'discard';
    return '';
  }

  function isFieldCard(card) {
    if (!card) return false;
    if (fieldRole(card)) return true;
    return /^PLAY_FIELD_/.test(fieldId(card));
  }

  function fieldHtml(card) {
    var name = (card && card.name) || 'Field';
    var role = fieldRole(card);
    var extraFace = '';
    if (role === 'track') {
      extraFace =
        '<div class="field-slot-track">' +
        [0, 1, 2]
          .map(function (i) {
            var kind = i === 0 ? 'close' : 'vision';
            return '<div class="field-slot-cell field-slot-cell--' + kind + '"></div>';
          })
          .join('') +
        '</div>';
    } else {
      extraFace = '<div class="field-slot-body"></div>';
    }
    return (
      '<div class="card garb-playaid garb-playaid--field" data-type="playaid" data-field-role="' +
      escapeHtml(role) +
      '" data-card-name="' +
      escapeHtml(name) +
      '">' +
      '<div class="field-slot-face' +
      (role === 'track' ? ' field-slot-face--track' : '') +
      '">' +
      extraFace +
      '</div></div>'
    );
  }

  function applyMeta(target, picture, size, tools) {
    if (target === 'doll') {
      if (picture) art.bodyDoll = normalizePic(picture);
      if (size) sizes.bodyDoll = size;
    } else if (target === 'pack') {
      if (picture) art.backpack = normalizePic(picture);
      if (tools) art.backpackTools = normalizePic(tools);
      if (size) sizes.backpack = size;
    }
  }

  function applyCard(card) {
    if (!card) return;
    var picture = card.picture || card.art;
    var tools = card.toolsArt || card.tools;
    if (isDollCard(card)) applyMeta('doll', picture, card.size, tools);
    else if (isPackCard(card)) applyMeta('pack', picture, card.size, tools);
  }

  function applyFromDecks(decks) {
    if (!decks || !decks.length) return;
    decks.forEach(function (deck) {
      (deck.cards || []).forEach(applyCard);
    });
  }

  function applyFromMarkdown(text) {
    String(text || '')
      .split(/\n(?=## )/)
      .forEach(function (block) {
        var lines = block.split(/\r?\n/);
        var header = String(lines[0] || '')
          .replace(/^##\s+/, '')
          .trim();
        if (!header) return;
        var idMatch = header.match(/\[([^\]]+)\]\s*$/);
        var name = (idMatch ? header.replace(/\[[^\]]+\]\s*$/, '') : header).trim();
        var picture = '';
        var size = '';
        var tools = '';
        lines.forEach(function (line) {
          var t = String(line || '').trim();
          var m = t.match(/^(Picture|Art|Size|Tools)\s*:\s*(.+)$/i);
          if (!m) return;
          var key = m[1].toLowerCase();
          var val = m[2].trim();
          if (key === 'picture' || key === 'art') picture = val;
          else if (key === 'size') size = val;
          else if (key === 'tools') tools = val;
        });
        applyCard({ id: idMatch ? idMatch[1] : '', name: name, picture: picture, size: size, toolsArt: tools });
      });
  }

  function consumeMetaLine(line, bag) {
    var t = String(line || '').trim();
    var m = t.match(/^(Picture|Art|Size|Tools)\s*:\s*(.+)$/i);
    if (!m) return false;
    var key = m[1].toLowerCase();
    var val = m[2].trim();
    if (key === 'picture' || key === 'art') bag.picture = val;
    else if (key === 'size') bag.size = val;
    else if (key === 'tools') bag.toolsArt = val;
    return true;
  }

  function slotIconSvg(kind, layer) {
    var wide = !!layer;
    var vb = wide ? '0 0 40 32' : '0 0 32 32';
    var tile = wide ? SLOT_TILE_WIDE : SLOT_TILE;
    var glyph = SLOT_GLYPH[kind] || '';
    var shifted = '<g transform="translate(' + (wide ? '2.4' : '1.2') + ',0)">' + glyph + '</g>';
    var num = wide
      ? '<text x="29.6" y="20.6" text-anchor="middle" font-size="9" font-weight="700" font-family="Georgia,\'Times New Roman\',serif" fill="#efe4c8">' +
        escapeHtml(layer) +
        '</text>'
      : '';
    var cls = 'slot-icon' + (wide ? ' is-layered' : '');
    return '<svg class="' + cls + '" viewBox="' + vb + '" aria-hidden="true"><path fill="#7a5334" d="' + tile + '"/>' + shifted + num + '</svg>';
  }

  function holeHeadHtml(hole, name, extra) {
    var mark = hole
      ? '<span class="slot-mark">' + slotIconSvg(hole.icon, hole.layer) + '</span>'
      : '';
    return (
      '<div class="hole-top">' +
      mark +
      '<div class="hole-copy">' +
      '<div class="hole-name-row">' +
      '<h3 class="hole-name">' +
      escapeHtml(name) +
      '</h3>' +
      (extra || '') +
      '</div>' +
      '<span class="hole-slot">' +
      escapeHtml(hole && hole.label ? hole.label : '') +
      '</span>' +
      '</div></div>'
    );
  }

  function nOf(item, key) {
    var v = item && item[key];
    return v == null ? 0 : v;
  }

  function holeById(id) {
    var key = String(id || '');
    for (var i = 0; i < HOLES.length; i++) {
      if (HOLES[i].id === key) return HOLES[i];
    }
    return null;
  }

  function holeForSlot(slot) {
    var label = String(slot || '');
    for (var i = 0; i < HOLES.length; i++) {
      if (HOLES[i].label === label) return HOLES[i];
    }
    return null;
  }

  function tokensHtml(item) {
    var bits = [];
    for (var ci = 0; ci < COLS.length; ci++) {
      var col = COLS[ci];
      var n = nOf(item, col.key);
      if (!n || n < 0) continue;
      var squares = '';
      for (var i = 0; i < n; i++) {
        squares += '<span class="tok ' + col.key + '">' + escapeHtml(col.label) + '</span>';
      }
      bits.push(squares);
    }
    return bits.length
      ? '<div class="res"><div class="res-row">' + bits.join('') + '</div></div>'
      : '<div class="acc-note">No resource slots</div>';
  }

  function emptyTokensHtml(hole) {
    // Empty slots still give Stamina — uncovered skin breathes. Inner
    // slots (layer I) give 2, every other slot 1. Shown as a plain chip
    // so the player sees what staying empty grants.
    if (!hole) return '';
    var n = hole.layer === 'I' ? 2 : 1;
    return '<div class="res"><div class="res-row"><span class="tok st is-empty-s">S ' + n + '</span></div></div>';
  }

  function mixHasPips(mix) {
    if (!mix) return false;
    for (var ci = 0; ci < COLS.length; ci++) {
      if (nOf(mix, COLS[ci].key) > 0) return true;
    }
    return false;
  }

  function bodyCoreHtml(mix) {
    var has = mixHasPips(mix);
    if (!has) return '';
    return (
      '<div class="body-core" data-body-core="1">' +
      '<div class="body-core-label">Body</div>' +
      tokensHtml(mix) +
      '</div>'
    );
  }

  function paintBodyCore(root, mix) {
    var scope = root || document;
    var cores = scope.querySelectorAll('.body-core');
    if (!cores.length) return;
    var html = bodyCoreHtml(mix);
    cores.forEach(function (el) {
      var wrap = el.parentNode;
      if (!wrap) return;
      if (!html) {
        wrap.removeChild(el);
        return;
      }
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      wrap.replaceChild(tmp.firstChild, el);
    });
  }

  function setDollFigureSrc(root, src) {
    var url = cacheBust(normalizePic(src || art.bodyDoll));
    (root || document).querySelectorAll('.js-body-doll-art').forEach(function (img) {
      img.src = url;
      img.alt = src ? 'Character' : 'Body doll';
    });
  }

  function isGarbPiece(card) {
    if (!card) return false;
    if (card.garbPiece) return true;
    return (card.type === 'garb' || card.type === 'garb-piece') && !!card.slot;
  }

  function pieceFromCard(card) {
    if (!card) return null;
    if (card.garbItem) return card.garbItem;
    return {
      id: card.id,
      name: card.name,
      slot: card.slot,
      zone: card.zone,
      note: card.note,
      st: card.st,
      dur: card.dur,
      wr: card.wr
    };
  }

  function pieceFaceHtml(item) {
    var hole = holeForSlot(item && item.slot);
    if (!hole) return '';
    return '<article class="garb-face">' + holeHeadHtml(hole, item.name) + tokensHtml(item) + '</article>';
  }

  function pieceHtml(card) {
    var item = pieceFromCard(card);
    var name = (item && item.name) || (card && card.name) || 'Garb';
    return (
      '<div class="card garb-playaid garb-playaid--piece" data-type="garb" data-card-name="' +
      escapeHtml(name) +
      '">' +
      pieceFaceHtml(item) +
      '</div>'
    );
  }

  function catalogItemToCard(item) {
    if (!item) return null;
    return {
      id: 'GARB_' + String(item.id || '').replace(/-/g, '_').toUpperCase(),
      name: item.name,
      type: 'garb',
      slot: item.slot,
      zone: item.zone,
      garbPiece: true,
      garbItem: item,
      note: item.note,
      st: item.st,
      dur: item.dur,
      wr: item.wr
    };
  }

  function cardsFromCatalog(data) {
    var items = (data && data.items) || [];
    var out = [];
    for (var i = 0; i < items.length; i++) {
      var card = catalogItemToCard(items[i]);
      if (card) out.push(card);
    }
    return out;
  }

  function mergeGarbDeck(decks, data) {
    var list = decks || [];
    var cards = cardsFromCatalog(data);
    if (!cards.length) return list;
    var found = false;
    for (var i = 0; i < list.length; i++) {
      var t = String(list[i].type || '').toLowerCase();
      var id = String(list[i].id || '').toLowerCase();
      if (t === 'garb' || id === 'garb') {
        list[i].cards = cards;
        found = true;
        break;
      }
    }
    if (!found) {
      var insertAt = list.length;
      for (var j = 0; j < list.length; j++) {
        var t2 = String(list[j].type || '').toLowerCase();
        var n2 = String(list[j].name || '').toLowerCase();
        if (t2 === 'ability' || n2.indexOf('abilit') === 0) {
          insertAt = j;
          break;
        }
      }
      list.splice(insertAt, 0, { id: 'garb', name: 'Garb', type: 'garb', cards: cards });
    }
    return list;
  }

  function loadCatalog() {
    var fallback =
      typeof global.GARB_DATA !== 'undefined' && global.GARB_DATA
        ? global.GARB_DATA
        : null;
    var parseGarb = global.GarbParse && typeof global.GarbParse.parseGarb === 'function'
      ? global.GarbParse.parseGarb
      : null;
    return fetch('garb.md?t=' + Date.now(), { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) {
        if (!parseGarb) throw new Error('parser missing');
        var parsed = parseGarb(text);
        if (!parsed || !parsed.items || !parsed.items.length) throw new Error('empty catalog');
        return parsed;
      })
      .catch(function () {
        return fallback;
      });
  }

  function pieceTableSize() {
    var holeW = 315;
    var holeH = (630 - 15 - 4 - 20) / 6;
    return {
      w: Math.round(holeW * 0.6),
      h: Math.round(holeH * 0.6),
      innerW: holeW,
      innerH: holeH
    };
  }

  function emptyHoleHtml(hole) {
    return (
      '<article class="hole is-empty" data-hole="' +
      escapeHtml(hole.id) +
      '">' +
      holeHeadHtml(hole, 'Empty') +
      emptyTokensHtml(hole) +
      '</article>'
    );
  }

  function wornHoleHtml(hole, item) {
    if (!hole) return '';
    return (
      '<article class="garb-face" data-hole="' +
      escapeHtml(hole.id) +
      '">' +
      holeHeadHtml(hole, item && item.name ? item.name : 'Garb') +
      tokensHtml(item) +
      '</article>'
    );
  }

  function dollBoardHtml(opts) {
    opts = opts || {};
    var src = cacheBust(opts.figureSrc || art.bodyDoll);
    var left = HOLES.filter(function (h) {
      return h.side === 'left';
    })
      .map(emptyHoleHtml)
      .join('');
    var right = HOLES.filter(function (h) {
      return h.side === 'right';
    })
      .map(emptyHoleHtml)
      .join('');
    return (
      '<div class="board" aria-label="Garb doll">' +
      '<div class="board-col">' +
      left +
      '</div>' +
      '<div class="figure-wrap">' +
      '<img class="js-body-doll-art" src="' +
      escapeHtml(src) +
      '" alt="Body doll" />' +
      // Stamina is a number on the character card — no boxes on the doll.
      bodyCoreHtml(null) +
      '</div>' +
      '<div class="board-col">' +
      right +
      '</div>' +
      '</div>'
    );
  }

  function packHtml(opts) {
    opts = opts || {};
    var packSrc = cacheBust(opts.packSrc || art.backpack);
    var toolsSrc = cacheBust(opts.toolsSrc || art.backpackTools);
    var idAttr = opts.clickable ? ' id="weight-card"' : '';
    return (
      '<article class="pack-card"' +
      idAttr +
      '>' +
      '<img class="pack-draw js-backpack-art" src="' +
      escapeHtml(packSrc) +
      '" alt="">' +
      '<span class="weight-caption">Backpack Capacity</span>' +
      '<div class="pack-tool-frame">' +
      '<img class="pack-tool-art js-backpack-tools-art" src="' +
      escapeHtml(toolsSrc) +
      '" alt="">' +
      '<span class="hole-slot">Backpack Tools</span>' +
      '</div></article>'
    );
  }

  function playAidSize(card) {
    if (isDollCard(card)) return parseSize(card && card.size ? card.size : sizes.bodyDoll, sizes.bodyDoll);
    if (isPackCard(card)) return parseSize(card && card.size ? card.size : sizes.backpack, sizes.backpack);
    return parseSize(card && card.size, '1x1');
  }

  function playAidHtml(card) {
    applyCard(card);
    var name = (card && card.name) || 'Play aid';
    if (isPackCard(card)) {
      return (
        '<div class="card garb-playaid garb-playaid--pack" data-type="playaid" data-card-name="' +
        escapeHtml(name) +
        '">' +
        packHtml() +
        '</div>'
      );
    }
    if (isDollCard(card)) {
      return (
        '<div class="card garb-playaid garb-playaid--doll" data-type="playaid" data-card-name="' +
        escapeHtml(name) +
        '">' +
        '<div class="doll-sheet">' +
        dollBoardHtml({
          figureSrc: card && (card.picture || card.art),
          bodyStamina: card && card.bodyStamina
        }) +
        '</div></div>'
      );
    }
    return fieldHtml(card);
  }

  function syncDom(root) {
    var scope = root || document;
    scope.querySelectorAll('.js-body-doll-art').forEach(function (img) {
      img.src = cacheBust(art.bodyDoll);
    });
    scope.querySelectorAll('.js-backpack-art').forEach(function (img) {
      img.src = cacheBust(art.backpack);
    });
    scope.querySelectorAll('.js-backpack-tools-art').forEach(function (img) {
      img.src = cacheBust(art.backpackTools);
    });
  }

  function loadFromCardsMd() {
    return fetch('cards.md?t=' + Date.now(), { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) {
        applyFromMarkdown(text);
        syncDom();
        return true;
      })
      .catch(function () {
        return false;
      });
  }

  global.GarbBoard = {
    DEFAULT_ART: DEFAULT_ART,
    DEFAULT_SIZES: DEFAULT_SIZES,
    art: art,
    sizes: sizes,
    COLS: COLS,
    HOLES: HOLES,
    normalizePic: normalizePic,
    parseSize: parseSize,
    isDollCard: isDollCard,
    isPackCard: isPackCard,
    isFieldCard: isFieldCard,
    fieldRole: fieldRole,
    fieldHtml: fieldHtml,
    applyCard: applyCard,
    applyFromDecks: applyFromDecks,
    applyFromMarkdown: applyFromMarkdown,
    consumeMetaLine: consumeMetaLine,
    slotIconSvg: slotIconSvg,
    holeHeadHtml: holeHeadHtml,
    tokensHtml: tokensHtml,
    holeById: holeById,
    holeForSlot: holeForSlot,
    emptyHoleHtml: emptyHoleHtml,
    wornHoleHtml: wornHoleHtml,
    pieceFromCard: pieceFromCard,
    isGarbPiece: isGarbPiece,
    pieceHtml: pieceHtml,
    pieceTableSize: pieceTableSize,
    cardsFromCatalog: cardsFromCatalog,
    mergeGarbDeck: mergeGarbDeck,
    loadCatalog: loadCatalog,
    dollBoardHtml: dollBoardHtml,
    bodyCoreHtml: bodyCoreHtml,
    paintBodyCore: paintBodyCore,
    setDollFigureSrc: setDollFigureSrc,
    mixHasPips: mixHasPips,
    packHtml: packHtml,
    playAidSize: playAidSize,
    playAidHtml: playAidHtml,
    syncDom: syncDom,
    loadFromCardsMd: loadFromCardsMd
  };
})(typeof window !== 'undefined' ? window : globalThis);
