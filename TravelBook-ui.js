/**
 * Travel Book render + flip API.
 * Data: window.TRAVEL_BOOK_DATA from TravelBook-data.js (built from TravelBook.md).
 * Pages: TravelBook.html  Map: TravelMap.html (mount with { mode: 'map' }).
 *
 * Simulator embed: TravelBook.html?embed=1&page=A12
 *   Paths / Area exploration postMessage { type: 'tb-sim', action: 'explore-path'|'explore-area'|'close' }
 *
 * Standalone:
 *   TravelBook.mount(container, { pageId: '1', onChange(page) {} });
 *   TravelBook.goTo('2'); TravelBook.next(); TravelBook.prev();
 *   TravelBook.getSpread('1'); TravelBook.destroy();
 */
(function (global) {
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function inlineBold(text) {
    return esc(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  /** Escape + bold; bare ❗ becomes red ! before Danger (word stays normal ink). */
  function bookInline(text) {
    var raw = String(text || '');
    raw = raw.replace(/(?:Danger\s*)?❗|❗\s*Danger/gi, '\u0000');
    raw = raw.replace(/\u0000/g, '! Danger');
    return inlineBold(raw).replace(
      /!\s*Danger/g,
      '<span class="tb-danger-mark" aria-label="Danger">!</span> Danger'
    );
  }

  function eyeSvg() {
    return (
      '<svg class="tb-ico ico-eye" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.8" fill="currentColor" stroke="none"/></svg>'
    );
  }

  function heartSvg() {
    return (
      '<svg class="tb-ico ico-heart" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 20.5l-1.1-1C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.5 2.5C12.09 5 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.9 10.9L12 20.5z"/></svg>'
    );
  }

  function areaRefFromText(text) {
    var m = String(text || '').match(/\[((?:A|P)\d+)\]/i) || String(text || '').match(/\b((?:A|P)\d+)\b/i);
    return m ? m[1].toUpperCase() : null;
  }

  function linkPageRefs(html) {
    return String(html || '').replace(/\[((?:A|P)\d+)\]|\b((?:A|P)\d+)\b/gi, function (m, bracket, bare) {
      var page = String(bracket || bare || m.replace(/[\[\]]/g, '')).toUpperCase();
      return (
        '<button type="button" class="tb-page-link tb-page-link--inline" data-tb-page="' +
        page +
        '">[' +
        page +
        ']</button>'
      );
    });
  }

  function listHtml(items, emptyLabel) {
    if (!items || items.length === 0) {
      return '<p class="tb-empty">' + esc(emptyLabel || '—') + '</p>';
    }
    return (
      '<ul class="tb-list">' +
      items
        .map(function (d) {
          var text = String(d);
          if (/^\s*area\s*exploration\s*$/i.test(text)) return '';
          return '<li>' + linkPageRefs(bookInline(d)) + '</li>';
        })
        .filter(Boolean)
        .join('') +
      '</ul>'
    );
  }

  function catalogSpreads() {
    return state.catalog && state.catalog.length ? state.catalog : state.spreads;
  }

  function mapPageForZone(zoneName) {
    var maps = [];
    var list = catalogSpreads();
    for (var i = 0; i < list.length; i++) {
      if ((list[i].kind || '').toLowerCase() === 'map') maps.push(list[i]);
    }
    if (maps.length === 1) return maps[0];
    var zone = String(zoneName || '');
    if (!zone) return maps[0] || null;
    for (var j = 0; j < maps.length; j++) {
      if (String(maps[j].zone || maps[j].name || '') === zone) return maps[j];
    }
    return null;
  }

  function pageByRef(ref) {
    var key = areaRefFromText(ref) || String(ref || '').toUpperCase();
    if (!key) return null;
    var list = catalogSpreads();
    for (var i = 0; i < list.length; i++) {
      var sp = list[i];
      if (String(sp.page || sp.footer || '').toUpperCase() === key) return sp;
    }
    return null;
  }

  /** Section + location name (from `section:` / `area:` or `Section · Name`). */
  function splitPlaceName(name, sectionField) {
    if (sectionField) {
      return {
        section: String(sectionField).trim(),
        location: String(name || '').trim() || 'Untitled'
      };
    }
    var raw = String(name || '').trim();
    var parts = raw.split(/\s*·\s*/).map(function (p) {
      return p.trim();
    }).filter(Boolean);
    if (parts.length >= 2) {
      return { section: parts[0], location: parts.slice(1).join(' · ') };
    }
    return { section: '', location: raw || 'Untitled' };
  }

  function zoneBracketHtml(zone) {
    var z = String(zone || '');
    if (!z) return '';
    if (state.mode === 'map' || state.embed) return '[' + esc(z) + ']';
    var inner =
      '<a class="tb-zone-link" href="' +
      esc(state.mapHref || 'TravelMap.html') +
      '">' +
      esc(z) +
      '</a>';
    return '[' + inner + ']';
  }

  /** Section [Zone] / Location name */
  function titleHtml(sp) {
    var split = splitPlaceName(
      sp.name || sp.title || sp.leftTitle || 'Untitled',
      sp.section || sp.area
    );
    var zone = String(sp.zone || '');
    var sectionLine = '';
    if (split.section && zone) {
      sectionLine = esc(split.section) + ' ' + zoneBracketHtml(zone);
    } else if (split.section) {
      sectionLine = esc(split.section);
    } else if (zone) {
      sectionLine = zoneBracketHtml(zone);
    }
    return (
      '<header class="tb-page-head">' +
      (sectionLine ? '<p class="tb-area-zone">' + sectionLine + '</p>' : '') +
      '<h1 class="tb-h1">' +
      inlineBold(split.location) +
      '</h1></header>'
    );
  }

  /** Deal to leave this Area via exits (0 / omit = free; free explore does not use this). */
  function areaDifficulty(sp) {
    var raw =
      sp && sp.difficulty != null && String(sp.difficulty).trim() !== ''
        ? String(sp.difficulty)
        : String((sp && sp.travel) || '');
    var m = raw.match(/(\d+)/);
    if (!m) return '';
    var n = Number(m[1]);
    return n > 0 ? String(n) : '';
  }

  function parseExitLine(line) {
    var raw = String(line || '').trim();
    var hidden = false;
    var gate = null;
    var tail = true;
    while (tail) {
      var hid = raw.match(/\(\s*hidden\s*\)\s*$/i);
      if (hid) {
        hidden = true;
        raw = raw.slice(0, -hid[0].length).trim();
        continue;
      }
      var g = raw.match(/\(\s*\[([FWTA])\]\s+([A-Za-z][A-Za-z -]*?)\s+(\d+)\s*\)\s*$/i);
      if (g) {
        gate = { code: g[1].toUpperCase(), name: g[2].trim(), power: Number(g[3]) };
        raw = raw.slice(0, -g[0].length).trim();
        continue;
      }
      tail = false;
    }
    var ch = '';
    var disc = '';
    var cue = raw.match(/^Ch\.?:?\s*(\d+)\s*>\s*D(\d+)\s+/i);
    if (cue) {
      ch = cue[1];
      disc = cue[2];
      raw = raw.slice(cue[0].length).trim();
    }
    var lineDiff = ch;
    var diffMatch = raw.match(/^(.*?)(?:\s+Difficulty\s+(\d+)\s*|\s+\(D(\d+)\)\s*)$/i);
    if (diffMatch) {
      raw = (diffMatch[1] || '').trim();
      if (!lineDiff) lineDiff = diffMatch[2] || diffMatch[3] || '';
    }
    var wayLine = raw.match(
      /^(.*?)\s+(leads?\s+into(?:\s+the)?|leads?\s+to|into(?:\s+the)?|to|leads?)\s+\[((?:A|P)\d+)\]\s+(.+)$/i
    );
    if (!wayLine) {
      wayLine = raw.match(/^(.*?)\s+\[((?:A|P)\d+)\]\s+(.+)$/i);
      if (wayLine) {
        return {
          way: wayLine[1].trim(),
          connector: '',
          pageRef: wayLine[2].toUpperCase(),
          dest: wayLine[3].trim(),
          lineDiff: lineDiff,
          disc: disc,
          hidden: hidden,
          gate: gate
        };
      }
    }
    if (wayLine) {
      return {
        way: wayLine[1].trim(),
        connector: wayLine[2].toLowerCase().replace(/\s+/g, ' '),
        pageRef: wayLine[3].toUpperCase(),
        dest: wayLine[4].trim(),
        lineDiff: lineDiff,
        disc: disc,
        hidden: hidden,
        gate: gate
      };
    }
    var legacy = raw.match(/^\[?((?:A|P)\d+)\]?\s*(.*)$/i);
    if (legacy) {
      return {
        way: '',
        connector: 'to',
        pageRef: legacy[1].toUpperCase(),
        dest: (legacy[2] || '').trim(),
        lineDiff: lineDiff,
        disc: disc,
        hidden: hidden,
        gate: gate
      };
    }
    return null;
  }

  function exitLineHtml(line, fromSp, opts) {
    opts = opts || {};
    var parsed = parseExitLine(line);
    if (!parsed || !parsed.pageRef) return '<li>' + bookInline(line) + '</li>';
    var pageRef = parsed.pageRef;
    var dest = parsed.dest;
    var way = parsed.way;
    var connector = parsed.connector != null ? parsed.connector : 'to';
    var wayPhrase = way
      ? way + (connector ? ' ' + connector : '')
      : '';
    var label = dest
      ? (wayPhrase ? wayPhrase + ' ' + dest : dest)
      : wayPhrase || pageRef;
    var shownDiff = parsed.lineDiff || opts.difficulty || '';
    var disc = parsed.disc || '';
    var inner = '';
    if (shownDiff !== '' || disc) {
      inner += '<span class="tb-exit-cue">';
      if (shownDiff !== '') {
        inner += '<span class="tb-exit-ch">Ch.: ' + esc(String(shownDiff)) + '</span>';
      }
      if (shownDiff !== '' && disc) {
        inner += '<span class="tb-exit-cue-sep">></span>';
      }
      if (disc) {
        inner += '<span class="tb-exit-d">D' + esc(disc) + '</span>';
      }
      inner += '</span>';
    }
    inner += '<span class="tb-exit-sentence">';
    if (way) {
      inner +=
        '<span class="tb-exit-way">' +
        esc(way) +
        (connector ? ' ' + esc(connector) : '') +
        '</span> ';
    }
    inner += '<span class="tb-exit-dest">';
    inner += '<span class="tb-exit-mark">&gt;</span> ';
    if (dest) {
      inner += '<span class="tb-exit-dest-name">' + esc(dest) + '</span>';
    } else {
      inner += '<span class="tb-exit-ref">[' + esc(pageRef) + ']</span>';
    }
    inner += ' <span class="tb-exit-mark">&lt;</span>';
    inner += '</span>';
    inner += '</span>';
    if (parsed.gate && parsed.gate.code) {
      inner +=
        '<span class="tb-exit-gate">[' +
        esc(parsed.gate.code) +
        '] ' +
        esc(parsed.gate.name) +
        ' ' +
        esc(String(parsed.gate.power)) +
        '</span>';
    }
    var destSp = pageByRef(pageRef);
    var destZone = destSp && destSp.zone ? destSp.zone : '';
    var pathLabel = way || dest || pageRef;
    return (
      '<li class="tb-exit-line"><button type="button" class="tb-exit-link" data-tb-page="' +
      esc(pageRef) +
      '" data-tb-explore="path" data-tb-ch="' +
      esc(String(shownDiff)) +
      '" data-tb-path="' +
      esc(pathLabel) +
      '" data-tb-dest="' +
      esc(dest) +
      '" data-tb-zone="' +
      esc(destZone) +
      '" aria-label="Go to ' +
      esc(label) +
      '">' +
      inner +
      '</button></li>'
    );
  }

  var FOUND_EXITS_KEY = 'tb-found-exits';
  var foundExits = {};

  function loadFoundExits() {
    foundExits = {};
    try {
      var raw = localStorage.getItem(FOUND_EXITS_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]) foundExits[String(arr[i])] = true;
      }
    } catch (err) {}
  }

  function saveFoundExits() {
    try {
      localStorage.setItem(FOUND_EXITS_KEY, JSON.stringify(Object.keys(foundExits)));
    } catch (err) {}
  }

  function exitFindKey(fromPage, parsed) {
    var page = String(fromPage || '').toUpperCase();
    if (!parsed) return page;
    if (parsed.disc) return page + '|D' + parsed.disc;
    return (
      page +
      '|' +
      String(parsed.pageRef || '') +
      '|' +
      String(parsed.lineDiff || '') +
      '|' +
      String(parsed.dest || '')
    );
  }

  function isExitFound(fromPage, parsed) {
    if (!parsed || !parsed.hidden) return true;
    return !!foundExits[exitFindKey(fromPage, parsed)];
  }

  function hiddenExitBits(items, fromPage) {
    var bits = [];
    for (var i = 0; i < (items || []).length; i++) {
      var parsed = parseExitLine(items[i]);
      if (!parsed || !parsed.hidden) continue;
      bits.push({ line: items[i], parsed: parsed, key: exitFindKey(fromPage, parsed) });
    }
    return bits;
  }

  function hiddenGoalsForSpread(sp) {
    var fromPage = (sp && (sp.page || sp.footer)) || '';
    return hiddenExitBits(allExitLines(sp), fromPage).map(function (bit) {
      var ch = bit.parsed.lineDiff;
      if (ch === '' || ch == null) ch = '0';
      return {
        key: bit.key,
        ch: String(ch),
        disc: bit.parsed.disc || '',
        dest: bit.parsed.dest || '',
        found: !!foundExits[bit.key]
      };
    });
  }

  function unexploredExitHtml(parsed) {
    var ch = parsed.lineDiff;
    if (ch === '' || ch == null) ch = '0';
    var disc = parsed.disc || '';
    var inner = '<span class="tb-exit-cue">';
    inner += '<span class="tb-exit-ch">Ch.: ' + esc(String(ch)) + '</span>';
    if (disc) {
      inner += '<span class="tb-exit-cue-sep">></span>';
      inner += '<span class="tb-exit-d">D' + esc(disc) + '</span>';
    }
    inner += '</span>';
    inner +=
      '<span class="tb-exit-sentence">' +
      '<span class="tb-exit-dest">' +
      '<span class="tb-exit-mark">&gt;</span> ' +
      '<span class="tb-exit-dest-name">Explore</span>' +
      ' <span class="tb-exit-mark">&lt;</span>' +
      '</span></span>';
    return (
      '<li class="tb-exit-line tb-exit-line--unexplored">' +
      '<button type="button" class="tb-exit-link" data-tb-explore="area" aria-label="Area exploration">' +
      inner +
      '</button></li>'
    );
  }

  function spreadPageId(sp) {
    return String((sp && (sp.page || sp.footer)) || '').toUpperCase();
  }

  function hasFreeReturnOn(sp) {
    return !!(state.returnPage && spreadPageId(sp) === String(state.returnAt || '').toUpperCase());
  }

  function freeReturnLineHtml(fromSp) {
    var returnPage = String(state.returnPage || '').toUpperCase();
    if (!returnPage) return '';
    var destSp = pageByRef(returnPage);
    var destName = (destSp && (destSp.name || destSp.title || destSp.leftTitle)) || returnPage;
    var html = exitLineHtml('Return leads to [' + returnPage + '] ' + destName, fromSp, {
      difficulty: '0'
    });
    return html.replace('class="tb-exit-line"', 'class="tb-exit-line tb-exit-line--return"');
  }

  function exitsListHtml(items, fromSp, emptyLabel, opts) {
    var fromPage = (fromSp && (fromSp.page || fromSp.footer)) || '';
    var rows = [];
    for (var i = 0; i < (items || []).length; i++) {
      var parsed = parseExitLine(items[i]);
      if (parsed && parsed.hidden && !foundExits[exitFindKey(fromPage, parsed)]) {
        rows.push(unexploredExitHtml(parsed));
      } else {
        rows.push(exitLineHtml(items[i], fromSp, opts));
      }
    }
    if (hasFreeReturnOn(fromSp)) {
      rows.push(freeReturnLineHtml(fromSp));
    }
    if (!rows.length) {
      return '<p class="tb-empty">' + esc(emptyLabel || '—') + '</p>';
    }
    return '<ul class="tb-list tb-list--exits">' + rows.join('') + '</ul>';
  }

  function sectionBlock(title, items, emptyLabel) {
    return (
      '<h3 class="tb-section-title">' +
      esc(title) +
      '</h3>\n        ' +
      listHtml(items, emptyLabel)
    );
  }

  function exitsSection(title, items, fromSp, opts) {
    return (
      '<h3 class="tb-section-title">' +
      esc(title) +
      '</h3>\n        ' +
      exitsListHtml(items, fromSp, undefined, opts)
    );
  }

  function mapDifficulty(sp) {
    var raw =
      sp && sp.difficulty != null && String(sp.difficulty).trim() !== ''
        ? String(sp.difficulty)
        : '';
    var m = raw.match(/(\d+)/);
    return m ? m[1] : '';
  }

  function zoneTintClass(zone) {
    var z = String(zone || '').toLowerCase();
    if (z.indexOf('forest') !== -1) return 'tb-map-mark--forest';
    if (z.indexOf('castle') !== -1) return 'tb-map-mark--castle';
    return '';
  }

  function mapNameHtml(placeName) {
    var parts = String(placeName || '')
      .split(/\s*·\s*/)
      .map(function (p) {
        return p.trim();
      })
      .filter(Boolean);
    if (!parts.length) return '<span class="tb-map-mark-name"></span>';
    return (
      '<span class="tb-map-mark-name">' +
      parts
        .map(function (p) {
          return '<span class="tb-map-mark-line">' + esc(p) + '</span>';
        })
        .join('') +
      '</span>'
    );
  }

  function exitPageRef(line) {
    return areaRefFromText(line);
  }

  function zoneMapEdges(marks) {
    var byPage = {};
    for (var i = 0; i < marks.length; i++) {
      byPage[String(marks[i].page).toUpperCase()] = marks[i];
    }
    var seen = {};
    var edges = [];
    for (var m = 0; m < marks.length; m++) {
      var sp = marks[m];
      var from = String(sp.page).toUpperCase();
      var exits = allExitLines(sp);
      for (var e = 0; e < exits.length; e++) {
        var parsed = parseExitLine(exits[e]);
        var to = parsed && parsed.pageRef ? parsed.pageRef : exitPageRef(exits[e]);
        if (!to || !byPage[to]) continue;
        var key = from < to ? from + '|' + to : to + '|' + from;
        var isHidden = !!(parsed && parsed.hidden) && !isExitFound(from, parsed);
        var gate = parsed && parsed.gate ? parsed.gate : null;
        if (seen[key] != null) {
          var ed = edges[seen[key]];
          if (!isHidden) ed.hidden = false;
          if (gate) ed.gate = gate;
          continue;
        }
        seen[key] = edges.length;
        edges.push({ from: from, to: to, hidden: isHidden, kind: 'travel', gate: gate, looks: false });
      }
    }
    function travelKey(a, b) {
      return a < b ? a + '|' + b : b + '|' + a;
    }
    var travelKeys = {};
    for (var t = 0; t < edges.length; t++) {
      travelKeys[travelKey(edges[t].from, edges[t].to)] = edges[t];
    }
    var seenSee = {};
    for (var s = 0; s < marks.length; s++) {
      var spSee = marks[s];
      var fromSee = String(spSee.page).toUpperCase();
      var looks = (spSee && spSee.sees) || [];
      for (var v = 0; v < looks.length; v++) {
        var toSee = exitPageRef(looks[v]);
        if (!toSee || !byPage[toSee] || toSee === fromSee) continue;
        var vkey = travelKey(fromSee, toSee);
        var existing = travelKeys[vkey];
        if (existing) {
          if (existing.hidden) existing.looks = true;
          continue;
        }
        if (seenSee[vkey]) continue;
        seenSee[vkey] = true;
        edges.push({ from: fromSee, to: toSee, kind: 'vision' });
      }
    }
    return edges.filter(function (edge) {
      if (edge.kind !== 'vision') return true;
      var t = travelKeys[travelKey(edge.from, edge.to)];
      return !(t && !t.hidden);
    });
  }

  function mapEdgePoint(cx, cy, halfW, halfH, tx, ty) {
    var dx = tx - cx;
    var dy = ty - cy;
    if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return { x: cx, y: cy };
    var sx = Math.abs(dx) > 0.001 ? halfW / Math.abs(dx) : Infinity;
    var sy = Math.abs(dy) > 0.001 ? halfH / Math.abs(dy) : Infinity;
    var t = Math.min(sx, sy);
    return { x: cx + dx * t, y: cy + dy * t };
  }

  function pointInBox(x, y, box) {
    return x >= box.x - box.hw && x <= box.x + box.hw && y >= box.y - box.hh && y <= box.y + box.hh;
  }

  function polylineMid(pts) {
    if (!pts || !pts.length) return { x: 0, y: 0 };
    if (pts.length === 1) return { x: pts[0].x, y: pts[0].y };
    var total = 0;
    var segs = [];
    for (var i = 1; i < pts.length; i++) {
      var dx = pts[i].x - pts[i - 1].x;
      var dy = pts[i].y - pts[i - 1].y;
      var len = Math.sqrt(dx * dx + dy * dy);
      segs.push(len);
      total += len;
    }
    if (total < 0.5) return { x: pts[0].x, y: pts[0].y };
    var half = total / 2;
    var acc = 0;
    for (var s = 0; s < segs.length; s++) {
      if (acc + segs[s] >= half || s === segs.length - 1) {
        var t = segs[s] < 0.01 ? 0 : (half - acc) / segs[s];
        if (t < 0) t = 0;
        if (t > 1) t = 1;
        return {
          x: pts[s].x + (pts[s + 1].x - pts[s].x) * t,
          y: pts[s].y + (pts[s + 1].y - pts[s].y) * t
        };
      }
      acc += segs[s];
    }
    return { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y };
  }

  function gateLabelSvg(pts, gate, hidden) {
    if (!gate || !gate.code) return '';
    var mid = polylineMid(pts);
    var label = '[' + gate.code + '] ' + gate.name + ' ' + gate.power;
    return (
      '<text class="tb-map-gate' +
      (hidden ? ' tb-map-gate--hidden' : '') +
      '" x="' +
      mid.x.toFixed(1) +
      '" y="' +
      mid.y.toFixed(1) +
      '" dy="-0.35em" text-anchor="middle">' +
      esc(label) +
      '</text>'
    );
  }

  function svgPoints(pts, cls) {
    var parts = [];
    for (var i = 0; i < pts.length; i++) {
      parts.push(pts[i].x.toFixed(1) + ',' + pts[i].y.toFixed(1));
    }
    var ptsAttr = parts.join(' ');
    return '<polyline class="' + cls + '" fill="none" points="' + ptsAttr + '" />';
  }

  function pointHitsBox(x, y, box, pad) {
    pad = pad || 0;
    return (
      x >= box.x - box.hw - pad &&
      x <= box.x + box.hw + pad &&
      y >= box.y - box.hh - pad &&
      y <= box.y + box.hh + pad
    );
  }

  function segHitsBox(p, q, box, pad) {
    var steps = 20;
    for (var i = 1; i < steps; i++) {
      var t = i / steps;
      if (pointHitsBox(p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t, box, pad)) return true;
    }
    return false;
  }

  function uniqSorted(vals) {
    var s = vals.slice().sort(function (a, b) {
      return a - b;
    });
    var out = [];
    for (var i = 0; i < s.length; i++) {
      if (!out.length || s[i] - out[out.length - 1] > 1.5) out.push(s[i]);
      else out[out.length - 1] = (out[out.length - 1] + s[i]) / 2;
    }
    return out;
  }

  function simplifyOrtho(pts) {
    if (!pts || pts.length < 3) return pts || [];
    var out = [pts[0]];
    for (var i = 1; i < pts.length - 1; i++) {
      var a = out[out.length - 1];
      var b = pts[i];
      var c = pts[i + 1];
      var colX = Math.abs(a.x - b.x) < 1.2 && Math.abs(b.x - c.x) < 1.2;
      var colY = Math.abs(a.y - b.y) < 1.2 && Math.abs(b.y - c.y) < 1.2;
      if (!colX && !colY) out.push(b);
    }
    out.push(pts[pts.length - 1]);
    var clean = [out[0]];
    for (var j = 1; j < out.length; j++) {
      var dx = out[j].x - clean[clean.length - 1].x;
      var dy = out[j].y - clean[clean.length - 1].y;
      if (dx * dx + dy * dy > 2) clean.push(out[j]);
    }
    return clean;
  }

  function sideAnchor(box, dir) {
    if (dir === 'n') return { x: box.x, y: box.y - box.hh };
    if (dir === 's') return { x: box.x, y: box.y + box.hh };
    if (dir === 'e') return { x: box.x + box.hw, y: box.y };
    return { x: box.x - box.hw, y: box.y };
  }

  function straightClear(a, b, boxes, fromId, toId, pad) {
    var pages = Object.keys(boxes);
    for (var i = 0; i < pages.length; i++) {
      var id = pages[i];
      if (id === fromId || id === toId) continue;
      if (segHitsBox(a, b, boxes[id], pad)) return false;
    }
    return true;
  }

  function orthoHitsBox(p, q, box, pad) {
    var minX = Math.min(p.x, q.x);
    var maxX = Math.max(p.x, q.x);
    var minY = Math.min(p.y, q.y);
    var maxY = Math.max(p.y, q.y);
    var bx0 = box.x - box.hw - pad;
    var bx1 = box.x + box.hw + pad;
    var by0 = box.y - box.hh - pad;
    var by1 = box.y + box.hh + pad;
    return minX < bx1 - 0.2 && maxX > bx0 + 0.2 && minY < by1 - 0.2 && maxY > by0 + 0.2;
  }

  /** Orthogonal A* through the gutters between area boxes. */
  function routeGutterPath(boxA, boxB, boxes, fromId, toId, opts) {
    var gapX = Math.max(8, (opts && opts.gapX) || 16);
    var gapY = Math.max(8, (opts && opts.gapY) || 16);
    var padX = gapX * 0.5;
    var padY = gapY * 0.5;
    var width = (opts && opts.width) || 4000;
    var height = (opts && opts.height) || 4000;
    var pages = Object.keys(boxes);
    var xs = [4, width - 4];
    var ys = [4, height - 4];
    var colX = [];
    var rowY = [];
    for (var i = 0; i < pages.length; i++) {
      var b = boxes[pages[i]];
      colX.push(b.x);
      rowY.push(b.y);
      xs.push(b.x, b.x - b.hw - padX, b.x + b.hw + padX);
      ys.push(b.y, b.y - b.hh - padY, b.y + b.hh + padY);
    }
    colX = uniqSorted(colX);
    rowY = uniqSorted(rowY);
    for (var c = 0; c < colX.length - 1; c++) xs.push((colX[c] + colX[c + 1]) / 2);
    for (var r = 0; r < rowY.length - 1; r++) ys.push((rowY[r] + rowY[r + 1]) / 2);
    xs = uniqSorted(xs).filter(function (x) {
      return x >= 3 && x <= width - 3;
    });
    ys = uniqSorted(ys).filter(function (y) {
      return y >= 3 && y <= height - 3;
    });

    function pointBlocked(x, y) {
      for (var p = 0; p < pages.length; p++) {
        if (pointHitsBox(x, y, boxes[pages[p]], 0.6)) return true;
      }
      return false;
    }

    function segBlocked(p, q) {
      for (var pgi = 0; pgi < pages.length; pgi++) {
        if (orthoHitsBox(p, q, boxes[pages[pgi]], 0.6)) return true;
      }
      return false;
    }

    var walk = {};
    for (var ix = 0; ix < xs.length; ix++) {
      for (var iy = 0; iy < ys.length; iy++) {
        if (!pointBlocked(xs[ix], ys[iy])) walk[ix + ',' + iy] = true;
      }
    }

    function portPoint(box, dir) {
      var p = sideAnchor(box, dir);
      if (dir === 'n') p.y -= padY;
      else if (dir === 's') p.y += padY;
      else if (dir === 'e') p.x += padX;
      else p.x -= padX;
      p.x = Math.min(width - 3, Math.max(3, p.x));
      p.y = Math.min(height - 3, Math.max(3, p.y));
      return p;
    }

    function nearestWalkable(p) {
      var best = null;
      var bestD = 1e12;
      for (var nix = 0; nix < xs.length; nix++) {
        for (var niy = 0; niy < ys.length; niy++) {
          if (!walk[nix + ',' + niy]) continue;
          var dx = xs[nix] - p.x;
          var dy = ys[niy] - p.y;
          var d = dx * dx + dy * dy;
          if (d < bestD) {
            bestD = d;
            best = { ix: nix, iy: niy, x: xs[nix], y: ys[niy] };
          }
        }
      }
      return best;
    }

    var dirs = ['n', 'e', 's', 'w'];
    var starts = [];
    var goals = [];
    var goalDir = {};
    var startDirOf = {};
    for (var d = 0; d < 4; d++) {
      var sp = nearestWalkable(portPoint(boxA, dirs[d]));
      var gp = nearestWalkable(portPoint(boxB, dirs[d]));
      if (sp) {
        starts.push({ dir: dirs[d], node: sp });
        startDirOf[sp.ix + ',' + sp.iy] = dirs[d];
      }
      if (gp) {
        goals.push({ dir: dirs[d], node: gp });
        goalDir[gp.ix + ',' + gp.iy] = dirs[d];
      }
    }
    if (!starts.length || !goals.length) return null;

    var inf = 1e15;
    var dist = {};
    var prev = {};
    var axisOf = {};
    var pq = [];
    function pushNode(ix, iy, cost, parent, axis) {
      var k = ix + ',' + iy;
      if (cost >= (dist[k] != null ? dist[k] : inf)) return;
      dist[k] = cost;
      prev[k] = parent;
      axisOf[k] = axis;
      var h = inf;
      for (var g = 0; g < goals.length; g++) {
        var hh =
          Math.abs(xs[ix] - goals[g].node.x) + Math.abs(ys[iy] - goals[g].node.y);
        if (hh < h) h = hh;
      }
      pq.push({ ix: ix, iy: iy, k: k, c: cost, f: cost + h });
    }

    for (var s = 0; s < starts.length; s++) {
      pushNode(starts[s].node.ix, starts[s].node.iy, 0, null, -1);
    }

    var stepN = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    var found = null;
    while (pq.length) {
      var mi = 0;
      for (var qi = 1; qi < pq.length; qi++) if (pq[qi].f < pq[mi].f) mi = qi;
      var cur = pq.splice(mi, 1)[0];
      if (cur.c !== dist[cur.k]) continue;
      if (goalDir[cur.k] != null) {
        found = cur;
        break;
      }
      for (var n = 0; n < 4; n++) {
        var nix2 = cur.ix + stepN[n][0];
        var niy2 = cur.iy + stepN[n][1];
        if (nix2 < 0 || niy2 < 0 || nix2 >= xs.length || niy2 >= ys.length) continue;
        var nk = nix2 + ',' + niy2;
        if (!walk[nk]) continue;
        var p = { x: xs[cur.ix], y: ys[cur.iy] };
        var q = { x: xs[nix2], y: ys[niy2] };
        if (segBlocked(p, q)) continue;
        var axis = stepN[n][0] !== 0 ? 0 : 1;
        var step = Math.abs(q.x - p.x) + Math.abs(q.y - p.y);
        var turn = axisOf[cur.k] >= 0 && axisOf[cur.k] !== axis ? 22 : 0;
        pushNode(nix2, niy2, cur.c + step + turn, cur.k, axis);
      }
    }
    if (!found) return null;

    var pts = [];
    var keys = [];
    var walkKey = found.k;
    while (walkKey) {
      keys.push(walkKey);
      var bits = walkKey.split(',');
      pts.push({ x: xs[+bits[0]], y: ys[+bits[1]] });
      walkKey = prev[walkKey];
    }
    pts.reverse();
    keys.reverse();
    var startDir = startDirOf[keys[0]] || 's';
    pts.unshift(sideAnchor(boxA, startDir));
    pts.push(sideAnchor(boxB, goalDir[found.k] || 'n'));
    return simplifyOrtho(pts);
  }

  function visionLineSvg(boxA, boxB) {
    return svgPoints(
      [
        { x: boxA.x, y: boxA.y },
        { x: boxB.x, y: boxB.y }
      ],
      'tb-map-edge--vision'
    );
  }

  function routeAllMapEdges(edges, boxes, opts) {
    var ordered = edges.filter(function (pair) {
      var a = pair.from || pair[0];
      var b = pair.to || pair[1];
      return boxes[a] && boxes[b];
    });
    var lines = [];
    var labels = [];
    for (var e = 0; e < ordered.length; e++) {
      var edge = ordered[e];
      var fromId = edge.from || edge[0];
      var toId = edge.to || edge[1];
      var boxA = boxes[fromId];
      var boxB = boxes[toId];
      if (edge.kind === 'vision') {
        lines.push(visionLineSvg(boxA, boxB));
        continue;
      }
      var aCenter = { x: boxA.x, y: boxA.y };
      var bCenter = { x: boxB.x, y: boxB.y };
      var pts;
      if (straightClear(aCenter, bCenter, boxes, fromId, toId, 4)) {
        pts = [aCenter, bCenter];
      } else {
        pts = routeGutterPath(boxA, boxB, boxes, fromId, toId, opts) || [aCenter, bCenter];
        if (pts.length) {
          pts = pts.slice();
          pts[0] = aCenter;
          pts[pts.length - 1] = bCenter;
        }
      }
      if (edge.hidden) {
        lines.push(svgPoints(pts, 'tb-map-edge--hidden'));
        if (edge.gate) labels.push(gateLabelSvg(pts, edge.gate, true));
        continue;
      }
      lines.push(svgPoints(pts, 'tb-map-edge--visible'));
      if (edge.gate) labels.push(gateLabelSvg(pts, edge.gate, false));
    }
    return { lines: lines, labels: labels };
  }

  function layoutZoneMapLines(root) {
    var scope = root || state.el;
    if (!scope) return;
    var wraps = scope.querySelectorAll('.tb-zone-map-wrap');
    var pad = 3;
    for (var w = 0; w < wraps.length; w++) {
      var wrap = wraps[w];
      var svg = wrap.querySelector('.tb-zone-map-lines');
      if (!svg) continue;
      var edges = [];
      try {
        edges = JSON.parse(wrap.getAttribute('data-tb-edges') || '[]');
      } catch (err) {
        edges = [];
      }
      var wrapRect = wrap.getBoundingClientRect();
      var width = Math.max(1, wrapRect.width);
      var height = Math.max(1, wrapRect.height);
      svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      svg.setAttribute('width', String(width));
      svg.setAttribute('height', String(height));
      var gridEl = wrap.querySelector('.tb-zone-map');
      var gcs = gridEl ? window.getComputedStyle(gridEl) : null;
      var gapX = (gcs && parseFloat(gcs.columnGap)) || 16;
      var gapY = (gcs && parseFloat(gcs.rowGap)) || 16;

      var boxes = {};
      var marks = wrap.querySelectorAll('.tb-map-mark[data-tb-page]');
      for (var i = 0; i < marks.length; i++) {
        var mark = marks[i];
        var page = String(mark.getAttribute('data-tb-page') || '').toUpperCase();
        var label = mark.querySelector('.tb-map-mark-label') || mark;
        var r = label.getBoundingClientRect();
        var cx = r.left - wrapRect.left + r.width / 2;
        var cy = r.top - wrapRect.top + r.height / 2;
        boxes[page] = {
          x: cx,
          y: cy,
          hw: r.width / 2 + pad,
          hh: r.height / 2 + pad
        };
      }

      var routed = routeAllMapEdges(edges, boxes, {
        gapX: gapX,
        gapY: gapY,
        width: width,
        height: height
      });
      var lines = routed.lines || [];
      var labels = routed.labels || [];
      svg.innerHTML = lines.join('') + labels.join('');
    }
  }

  function sizeMapToPage(root) {
    var scope = root || state.el;
    if (!scope) return;
    var stages = scope.querySelectorAll('.tb-map-stage');
    for (var s = 0; s < stages.length; s++) {
      var stage = stages[s];
      var grid = stage.querySelector('.tb-zone-map');
      if (!grid) continue;
      var banner = stage.querySelector('.tb-map-banner');
      var cs = window.getComputedStyle(grid);
      var em = parseFloat(cs.fontSize) || 15;
      var cols = parseInt(cs.getPropertyValue('--tb-map-cols'), 10) || 1;
      var rows = parseInt(cs.getPropertyValue('--tb-map-rows'), 10) || 1;
      var markW = 6.5 * em;
      var markH = 2.35 * em;
      var minGapX = 0.85 * em;
      var minGapY = 1.05 * em;
      var availW = Math.max(0, stage.clientWidth * 0.98);
      var availH = Math.max(
        0,
        stage.clientHeight - (banner ? banner.offsetHeight + 4 : 8) - 4
      );
      var fullGapX = cols > 1 ? (availW - cols * markW) / (cols - 1) : minGapX;
      var fullGapY = rows > 1 ? (availH - rows * markH) / (rows - 1) : minGapY;
      var fullGap = Math.min(fullGapX, fullGapY);
      var gap = Math.max(Math.max(minGapX, minGapY), fullGap * 0.9);
      if (fullGap < Math.max(minGapX, minGapY)) gap = Math.max(8, fullGap);
      grid.style.setProperty('--tb-mark-w', markW.toFixed(1) + 'px');
      grid.style.setProperty('--tb-mark-h', markH.toFixed(1) + 'px');
      grid.style.setProperty('--tb-gap-x', gap.toFixed(1) + 'px');
      grid.style.setProperty('--tb-gap-y', gap.toFixed(1) + 'px');
    }
  }

  function fitMapMarkLabels(root) {
    var scope = root || state.el;
    if (!scope) return;
    var marks = scope.querySelectorAll('.tb-map-mark');
    for (var i = 0; i < marks.length; i++) {
      var mark = marks[i];
      var maxW = Math.max(8, mark.clientWidth - 4);
      var bits = mark.querySelectorAll('.tb-map-mark-page, .tb-map-mark-name, .tb-map-mark-tag');
      for (var b = 0; b < bits.length; b++) {
        var el = bits[b];
        el.style.fontSize = '';
        var size = parseFloat(window.getComputedStyle(el).fontSize) || 10;
        var min = el.classList.contains('tb-map-mark-tag') ? 6 : 7;
        while (el.scrollWidth > maxW && size > min) {
          size -= 0.4;
          el.style.fontSize = size.toFixed(1) + 'px';
        }
      }
    }
  }

  function scheduleZoneMapLines() {
    requestAnimationFrame(function () {
      sizeMapToPage();
      fitMapMarkLabels();
      layoutZoneMapLines();
      requestAnimationFrame(function () {
        sizeMapToPage();
        fitMapMarkLabels();
        layoutZoneMapLines();
      });
    });
  }

  function zoneMapMarks() {
    var marks = [];
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;
    var list = catalogSpreads();
    for (var i = 0; i < list.length; i++) {
      var sp = list[i];
      var kind = (sp.kind || '').toLowerCase();
      if (kind === 'map') continue;
      if (sp.mapX == null || sp.mapY == null) continue;
      if (!sp.page) continue;
      marks.push(sp);
      if (sp.mapX < minX) minX = sp.mapX;
      if (sp.mapY < minY) minY = sp.mapY;
      if (sp.mapX > maxX) maxX = sp.mapX;
      if (sp.mapY > maxY) maxY = sp.mapY;
    }
    if (!marks.length) {
      return { html: '<p class="tb-empty">—</p>', cols: 1, rows: 1 };
    }
    var cols = maxX - minX + 1;
    var rows = maxY - minY + 1;
    var edges = zoneMapEdges(marks);
    var occupied = {};
    for (var m = 0; m < marks.length; m++) {
      occupied[marks[m].mapX + ',' + marks[m].mapY] = true;
    }
    var spacers = [];
    for (var gy = minY; gy <= maxY; gy++) {
      for (var gx = minX; gx <= maxX; gx++) {
        if (occupied[gx + ',' + gy]) continue;
        spacers.push(
          '<span class="tb-map-spacer" style="grid-column:' +
            (gx - minX + 1) +
            ';grid-row:' +
            (gy - minY + 1) +
            '" aria-hidden="true"></span>'
        );
      }
    }
    var cells = marks
      .map(function (sp) {
        var col = sp.mapX - minX + 1;
        var row = sp.mapY - minY + 1;
        var page = String(sp.page);
        var placeName = String(sp.name || page);
        var section = sp.section || sp.area;
        if (section) placeName = String(section) + ' · ' + placeName;
        var kindClass = 'tb-map-mark--area';
        var tint = zoneTintClass(sp.zone);
        if (tint) kindClass += ' ' + tint;
        var kindLabel = 'Area';
        var tag = String(sp.tag || '').trim();
        var tagHtml = tag
          ? '<span class="tb-map-mark-tag">' + esc(tag) + '</span>'
          : '';
        var href = state.bookHref || 'TravelBook.html';
        if (state.embed) {
          href += '?embed=1&page=' + encodeURIComponent(page);
        } else {
          href += '?page=' + encodeURIComponent(page);
        }
        return (
          '<a class="tb-map-mark ' +
          kindClass +
          '" style="grid-column:' +
          col +
          ';grid-row:' +
          row +
          '" href="' +
          esc(href) +
          '" data-tb-page="' +
          esc(page) +
          '" aria-label="Open Travel Book ' +
          esc(kindLabel) +
          ' ' +
          esc(page) +
          ' ' +
          esc(placeName) +
          '">' +
          '<span class="tb-map-mark-label">' +
          '<span class="tb-map-mark-name">' +
          esc(placeName) +
          '</span>' +
          tagHtml +
          '</span>' +
          '</a>'
        );
      })
      .join('') + spacers.join('');
    var html =
      '<div class="tb-map-layout">' +
      '<div class="tb-zone-map-wrap" data-tb-edges="' +
      esc(JSON.stringify(edges)) +
      '">' +
      '<svg class="tb-zone-map-lines" aria-hidden="true"></svg>' +
      '<div class="tb-zone-map" style="--tb-map-cols:' +
      cols +
      ';--tb-map-rows:' +
      rows +
      '" role="group" aria-label="Zone map">' +
      cells +
      '</div>' +
      '<aside class="tb-map-legend" aria-label="Map legend">' +
      '<p class="tb-map-legend-title">Zones</p>' +
      '<p class="tb-map-legend-row"><span class="tb-map-legend-swatch tb-map-legend-swatch--forest"></span> Old Forest</p>' +
      '<p class="tb-map-legend-row"><span class="tb-map-legend-swatch tb-map-legend-swatch--castle"></span> Ruined Castle</p>' +
      '<p class="tb-map-legend-title">Lines</p>' +
      '<p class="tb-map-legend-row"><span class="tb-map-legend-stroke"></span> Always visible</p>' +
      '<p class="tb-map-legend-row"><span class="tb-map-legend-stroke tb-map-legend-stroke--hidden"></span> Need discovery</p>' +
      '<p class="tb-map-legend-row"><span class="tb-map-legend-stroke tb-map-legend-stroke--sees"></span> In view</p>' +
      '</aside></div></div>';
    return { html: html, cols: cols, rows: rows };
  }

  function renderMapSpread(sp) {
    var title = sp.title || sp.name || sp.zone || 'Map';
    var map = zoneMapMarks();

    return (
      '\n  <section class="book-spread book-spread--map" data-page-id="' +
      esc(String(sp.id || '')) +
      '" data-kind="map" aria-label="' +
      esc(title) +
      '">\n    <div class="book-surface book-surface--map">\n      <div class="tb-map-stage">\n        <header class="tb-map-banner">\n          <h1 class="tb-h1 tb-h1--chapter">' +
      inlineBold(title) +
      '</h1>\n        </header>\n        ' +
      map.html +
      '\n      </div>\n    </div>\n  </section>'
    );
    }

  function allExitLines(sp) {
    // Paths / Exits / Leads to / Passages are aliases of one list.
    // Generated data used to copy the same lines into both `exits` and `paths`.
    var lists = [
      (sp && sp.paths) || [],
      (sp && sp.exits) || [],
      (sp && sp.leadsTo) || [],
      (sp && sp.passages) || []
    ];
    var seen = {};
    var out = [];
    for (var i = 0; i < lists.length; i++) {
      var list = lists[i];
      for (var j = 0; j < list.length; j++) {
        var line = list[j];
        var key = String(line);
        if (!key || seen[key]) continue;
        seen[key] = true;
        out.push(line);
      }
    }
    return out;
  }

  function renderSpread(sp) {
    var kind = (sp.kind || 'area').toLowerCase();
    if (kind === 'map') return renderMapSpread(sp);
    // Legacy aliases → area
    if (kind === 'crossing' || kind === 'landmark' || kind === 'path') kind = 'area';

    var title = sp.title || sp.leftTitle || sp.name || 'Untitled';
    var page = sp.page || sp.footer || '';
    var flavor = sp.flavor || '';
    var effects = sp.locationEffects || [];
    var optional = (sp.optional || []).filter(function (line) {
      return !/^\s*area\s*exploration\s*$/i.test(String(line));
    });
    var forced = sp.forced || [];
    var exits = allExitLines(sp);
    var discoveries = sp.discoveries || [];
    var onArrival = sp.onArrival || '';
    var recovery = sp.recovery || '';
    var difficulty = areaDifficulty(sp);
    var exitOpts = difficulty ? { difficulty: difficulty } : {};

    var flavorHtml = flavor
      .split(/\n{2,}/)
      .filter(Boolean)
      .map(function (p) {
        return '<p class="tb-flavor">' + bookInline(p).replace(/\n/g, ' ') + '</p>';
      })
      .join('');

    var legacyHtml = '';
    if (onArrival) {
      legacyHtml +=
        '<div class="tb-row tb-on-arrival">' +
        eyeSvg() +
        '<p><span class="tb-kicker">On Arrival:</span> ' +
        bookInline(onArrival) +
        '</p></div>';
    }
    if (recovery) {
      legacyHtml +=
        '<div class="tb-row tb-recovery">' +
        heartSvg() +
        '<p><span class="tb-kicker">Recovery</span> <span class="tb-recovery-val">' +
        esc(recovery) +
        '</span></p></div>';
    }

    var effectsHtml = '';
    if (optional.length > 0) {
      effectsHtml += sectionBlock('Available Actions:', optional);
    }
    if (forced.length > 0) {
      if (effectsHtml) effectsHtml += '\n        ';
      effectsHtml += sectionBlock('You must:', forced);
    }
    if (effects.length > 0) {
      if (effectsHtml) effectsHtml += '\n        ';
      effectsHtml += sectionBlock('In this Area:', effects);
    }

    var exitsBlock = '';
    if (exits.length || hasFreeReturnOn(sp)) {
      exitsBlock = exitsSection('Paths:', exits, sp, exitOpts);
    }
    var discBlock =
      discoveries.length > 0 ? sectionBlock('Discoveries:', discoveries) : '';

    return (
      '\n  <section class="book-spread" data-page-id="' +
      esc(String(sp.id || '')) +
      '" data-kind="' +
      esc(kind) +
      '" aria-label="' +
      esc(title) +
      '">\n    <div class="book-surface">\n      <div class="book-page book-page--left">\n        ' +
      titleHtml(sp) +
      '\n        <div class="tb-left-body">\n          ' +
      flavorHtml +
      '\n          ' +
      legacyHtml +
      '\n          ' +
      effectsHtml +
      '\n        </div>\n      </div>\n      <div class="book-page book-page--right">\n        ' +
      (page ? '<p class="tb-page-num">' + esc(page) + '</p>\n        ' : '') +
      exitsBlock +
      '\n        ' +
      discBlock +
      '\n      </div>\n    </div>\n  </section>'
    );
  }

  var FLIP_MS = 380;
  var ANIM_CLASSES = [
    'is-leaving-next',
    'is-leaving-prev',
    'is-entering-next',
    'is-entering-prev'
  ];

  var state = {
    el: null,
    chrome: null,
    catalog: [],
    spreads: [],
    mode: 'book',
    embed: false,
    bookHref: 'TravelBook.html',
    mapHref: 'TravelMap.html',
    index: 0,
    onChange: null,
    keyHandler: null,
    clickHandler: null,
    resizeHandler: null,
    animating: false,
    flipTimer: null,
    returnPage: '',
    returnAt: ''
  };

  function prefersReducedMotion() {
    return (
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function clearAnimClasses(node) {
    if (!node) return;
    for (var i = 0; i < ANIM_CLASSES.length; i++) {
      node.classList.remove(ANIM_CLASSES[i]);
    }
  }

  function clearFlipTimer() {
    if (state.flipTimer) {
      clearTimeout(state.flipTimer);
      state.flipTimer = null;
    }
  }

  function applyInstant(nodes, next) {
    for (var k = 0; k < nodes.length; k++) {
      clearAnimClasses(nodes[k]);
      if (k === next) nodes[k].classList.add('is-active');
      else nodes[k].classList.remove('is-active');
    }
    scheduleZoneMapLines();
  }

  function visibleSpreads(mode, all) {
    var list = all || [];
    if (mode === 'map') {
      var maps = [];
      for (var i = 0; i < list.length; i++) {
        if ((list[i].kind || '').toLowerCase() === 'map') maps.push(list[i]);
      }
      if (maps.length) return maps;
      return [{ id: 'map', kind: 'map', name: 'Map', title: 'Map', zone: '' }];
    }
    var pages = [];
    for (var j = 0; j < list.length; j++) {
      if ((list[j].kind || '').toLowerCase() !== 'map') pages.push(list[j]);
    }
    return pages;
  }

  function queryParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name) || '';
    } catch (e) {
      return '';
    }
  }

  function pageIdFromQuery() {
    return queryParam('page') || queryParam('id') || '';
  }

  function getData(options) {
    if (options && options.data && Array.isArray(options.data.spreads)) {
      return options.data;
    }
    var data = global.TRAVEL_BOOK_DATA;
    if (!data || !Array.isArray(data.spreads)) return null;
    return data;
  }

  function parseMarkdown(text) {
    var parse = global.TravelBookParse && global.TravelBookParse.parseTravelBook;
    if (!parse) return null;
    var data = parse(text);
    if (!data || !Array.isArray(data.spreads) || !data.spreads.length) return null;
    return data;
  }

  function loadSource(sourceUrl, done) {
    if (!sourceUrl || typeof fetch !== 'function') {
      done(null);
      return;
    }
    var url = sourceUrl + (sourceUrl.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
    fetch(url, { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then(function (text) {
        done(parseMarkdown(text));
      })
      .catch(function () {
        done(null);
      });
  }

  function findIndex(pageId) {
    if (pageId == null || pageId === '') return 0;
    var id = String(pageId).trim();
    var i;
    for (i = 0; i < state.spreads.length; i++) {
      if (String(state.spreads[i].id) === id) return i;
    }
    var pageKey = id.toUpperCase();
    for (i = 0; i < state.spreads.length; i++) {
      var sp = state.spreads[i];
      var page = String(sp.page || sp.footer || '').toUpperCase();
      if (page && page === pageKey) return i;
    }
    return 0;
  }

  function currentSpread() {
    return state.spreads[state.index] || null;
  }

  function updateChrome() {
    var chrome = state.chrome;
    if (!chrome) return;
    var n = state.spreads.length;
    var i = state.index;
    var sp = currentSpread();
    if (chrome.status) {
      chrome.status.textContent =
        n === 0
          ? 'No pages'
          : 'Page ' +
            (i + 1) +
            ' / ' +
            n +
            (sp && (sp.page || sp.footer) ? ' · ' + (sp.page || sp.footer) : '');
    }
    if (chrome.prev) chrome.prev.disabled = i <= 0;
    if (chrome.next) chrome.next.disabled = i >= n - 1;
  }

  function finishFlip(nodes, from, next, opts) {
    clearFlipTimer();
    for (var k = 0; k < nodes.length; k++) {
      clearAnimClasses(nodes[k]);
      if (k === next) nodes[k].classList.add('is-active');
      else nodes[k].classList.remove('is-active');
    }
    state.animating = false;
    updateChrome();
    scheduleZoneMapLines();
    if (!opts.silent && typeof state.onChange === 'function') {
      state.onChange(currentSpread(), state.index);
    }
  }

  function showIndex(i, opts) {
    opts = opts || {};
    if (!state.el || state.spreads.length === 0) return;
    if (state.animating) return;

    var next = Math.max(0, Math.min(state.spreads.length - 1, i));
    var from = state.index;
    var nodes = state.el.querySelectorAll('.book-spread');
    if (!nodes.length) return;

    if (next === from || opts.silent || prefersReducedMotion()) {
      state.index = next;
      applyInstant(nodes, next);
      updateChrome();
      if (!opts.silent && typeof state.onChange === 'function') {
        state.onChange(currentSpread(), state.index);
      }
      return;
    }

    var goingNext = next > from;
    var leaving = nodes[from];
    var entering = nodes[next];
    if (!leaving || !entering) {
      state.index = next;
      applyInstant(nodes, next);
      updateChrome();
      return;
    }

    state.animating = true;
    state.index = next;
    updateChrome();

    clearAnimClasses(leaving);
    clearAnimClasses(entering);
    leaving.classList.add('is-active', goingNext ? 'is-leaving-next' : 'is-leaving-prev');
    entering.classList.add('is-active', goingNext ? 'is-entering-next' : 'is-entering-prev');

    var done = false;
    function onEnd(e) {
      if (done) return;
      if (e && e.target !== entering) return;
      done = true;
      entering.removeEventListener('animationend', onEnd);
      finishFlip(nodes, from, next, opts);
    }

    entering.addEventListener('animationend', onEnd);
    clearFlipTimer();
    state.flipTimer = setTimeout(function () {
      onEnd(null);
    }, FLIP_MS + 40);
  }

  function bindChrome() {
    var chrome = state.chrome;
    if (!chrome) return;
    if (chrome.prev) {
      chrome.prev.onclick = function () {
        TravelBook.prev();
      };
    }
    if (chrome.next) {
      chrome.next.onclick = function () {
        TravelBook.next();
      };
    }
  }

  function bindKeys() {
    if (state.keyHandler) {
      document.removeEventListener('keydown', state.keyHandler);
      state.keyHandler = null;
    }
    if (state.mode === 'map') {
      if (!state.embed) return;
      state.keyHandler = function (e) {
        if (e.defaultPrevented) return;
        var t = e.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          postSim({ action: 'close' });
        }
      };
      document.addEventListener('keydown', state.keyHandler);
      return;
    }
    state.keyHandler = function (e) {
      if (e.defaultPrevented) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'Escape' && state.embed) {
        e.preventDefault();
        postSim({ action: 'close' });
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        TravelBook.prev();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        TravelBook.next();
      } else if (e.key === 'Home') {
        e.preventDefault();
        showIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        showIndex(state.spreads.length - 1);
      }
    };
    document.addEventListener('keydown', state.keyHandler);
  }

  function postSim(extra) {
    var msg = { type: 'tb-sim' };
    var k;
    for (k in extra) {
      if (Object.prototype.hasOwnProperty.call(extra, k)) msg[k] = extra[k];
    }
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(msg, '*');
    }
  }

  function notifySimulatorExplore(el) {
    var kind = el.getAttribute('data-tb-explore');
    var sp = currentSpread();
    var fromPage = sp && (sp.page || sp.footer || '') || '';
    var fromName = sp && (sp.name || sp.title || '') || '';
    var fromZone = sp && (sp.zone || '') || '';
    var msg = {
      action: kind === 'area' ? 'explore-area' : 'explore-path',
      fromPage: fromPage,
      fromName: fromName,
      fromZone: fromZone
    };
    if (kind === 'area') {
      msg.toPage = fromPage;
      msg.destName = fromName;
      msg.destZone = fromZone;
      msg.path = 'Area exploration';
      msg.ch = '';
      msg.hiddenGoals = hiddenGoalsForSpread(sp);
      msg.locationEffects = (sp && sp.locationEffects) ? sp.locationEffects.slice() : [];
    } else {
      msg.toPage = el.getAttribute('data-tb-page') || '';
      msg.destName = el.getAttribute('data-tb-dest') || '';
      msg.destZone = el.getAttribute('data-tb-zone') || fromZone;
      msg.path = el.getAttribute('data-tb-path') || '';
      msg.ch = el.getAttribute('data-tb-ch') || '';
      var destSp = pageByRef(msg.toPage);
      var fxSrc = destSp || sp;
      msg.locationEffects = (fxSrc && fxSrc.locationEffects) ? fxSrc.locationEffects.slice() : [];
    }
    postSim(msg);
  }

  function refreshBookHtml() {
    if (!state.el || !state.spreads.length) return;
    var idx = state.index;
    state.el.innerHTML = state.spreads.map(renderSpread).join('\n');
    var nodes = state.el.querySelectorAll('.book-spread');
    applyInstant(nodes, idx);
  }

  function markExitFound(key) {
    if (!key || foundExits[key]) return false;
    foundExits[key] = true;
    saveFoundExits();
    refreshBookHtml();
    return true;
  }
  function bindPageLinks() {
    if (state.el && state.clickHandler) {
      state.el.removeEventListener('click', state.clickHandler);
    }
    state.clickHandler = function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var findBtn = t.closest('[data-tb-find-exit]');
      if (findBtn && state.el && state.el.contains(findBtn)) {
        e.preventDefault();
        e.stopPropagation();
        markExitFound(findBtn.getAttribute('data-tb-find-exit'));
        return;
      }
      if (state.embed) {
        var explore = t.closest('[data-tb-explore]');
        if (explore && state.el && state.el.contains(explore)) {
          e.preventDefault();
          notifySimulatorExplore(explore);
          return;
        }
      }
      var btn = t.closest('[data-tb-page], [data-tb-id]');
      if (!btn || !state.el || !state.el.contains(btn)) return;
      if (btn.tagName === 'A' && btn.getAttribute('href')) {
        if (state.mode === 'map') {
          e.preventDefault();
          if (state.embed) {
            postSim({
              action: 'select-area',
              page: btn.getAttribute('data-tb-page') || ''
            });
          } else {
            window.location.href = btn.href;
          }
        }
        return;
      }
      e.preventDefault();
      var target = btn.getAttribute('data-tb-page') || btn.getAttribute('data-tb-id');
      TravelBook.goTo(target);
    };
    if (state.el) state.el.addEventListener('click', state.clickHandler);
  }

  var TravelBook = {
    mount: function (container, options) {
      options = options || {};
      if (!container) return null;
      var source = options.source || container.getAttribute('data-tb-source') || '';
      if (source && !options._loadedSource) {
        loadSource(source, function (fromMd) {
          var next = {};
          var k;
          for (k in options) {
            if (Object.prototype.hasOwnProperty.call(options, k)) next[k] = options[k];
          }
          next._loadedSource = true;
          if (fromMd) next.data = fromMd;
          TravelBook.mount(container, next);
        });
        return TravelBook;
      }
      var data = getData(options);
      state.el = container;
      state.chrome = options.chrome || null;
      state.onChange = options.onChange || null;
      state.embed = !!options.embed;
      if (!state.embed && typeof location !== 'undefined') {
        try {
          var qe = new URLSearchParams(location.search).get('embed');
          state.embed = qe === '1' || qe === 'true';
        } catch (eEmbed) {}
      }
      state.mode = String(options.mode || 'book').toLowerCase() === 'map' ? 'map' : 'book';
      state.bookHref = options.bookHref || 'TravelBook.html';
      state.mapHref = options.mapHref || 'TravelMap.html';
      state.returnPage = String(options.returnPage || queryParam('returnPage') || '').toUpperCase();
      state.returnAt = String(options.returnAt || queryParam('returnAt') || '').toUpperCase();
      if (state.returnPage && !state.returnAt) state.returnAt = String(pageIdFromQuery() || '').toUpperCase();
      if (!state.returnPage) state.returnAt = '';
      state.catalog = data ? data.spreads.slice() : [];
      state.spreads = visibleSpreads(state.mode, state.catalog);
      loadFoundExits();

      if (!data || state.spreads.length === 0) {
        container.className = (container.className || '').replace(/\btb-wrap--flip\b/g, '').replace(/\btb-wrap--map-only\b/g, '').trim();
        container.innerHTML =
          '<p class="tb-error">No Travel Book data. Open this page through a local server so it can load the <code>.md</code> file, or run <code>npm run build:travel</code>.</p>';
        updateChrome();
        return TravelBook;
      }

      container.classList.add('tb-wrap--flip');
      if (state.mode === 'map') container.classList.add('tb-wrap--map-only');
      else container.classList.remove('tb-wrap--map-only');
      container.innerHTML = state.spreads.map(renderSpread).join('\n');
      bindChrome();
      bindKeys();
      bindPageLinks();
      if (state.resizeHandler) {
        window.removeEventListener('resize', state.resizeHandler);
      }
      state.resizeHandler = function () {
        scheduleZoneMapLines();
      };
      window.addEventListener('resize', state.resizeHandler);
      showIndex(findIndex(options.pageId || (state.mode === 'book' ? pageIdFromQuery() : '')), { silent: true });
      if (typeof options.onReady === 'function') options.onReady(TravelBook);
      return TravelBook;
    },

    destroy: function () {
      clearFlipTimer();
      state.animating = false;
      if (state.keyHandler) {
        document.removeEventListener('keydown', state.keyHandler);
        state.keyHandler = null;
      }
      if (state.resizeHandler) {
        window.removeEventListener('resize', state.resizeHandler);
        state.resizeHandler = null;
      }
      if (state.el && state.clickHandler) {
        state.el.removeEventListener('click', state.clickHandler);
        state.clickHandler = null;
      }
      if (state.el) {
        state.el.innerHTML = '';
        state.el.classList.remove('tb-wrap--flip');
        state.el.classList.remove('tb-wrap--map-only');
      }
      state.el = null;
      state.chrome = null;
      state.catalog = [];
      state.spreads = [];
      state.index = 0;
      state.onChange = null;
    },

    goTo: function (pageId) {
      showIndex(findIndex(pageId));
      return currentSpread();
    },

    next: function () {
      showIndex(state.index + 1);
      return currentSpread();
    },

    prev: function () {
      showIndex(state.index - 1);
      return currentSpread();
    },

    getSpread: function (pageId) {
      if (pageId == null) return currentSpread();
      var idx = findIndex(pageId);
      // findIndex returns 0 for unknown ids — verify match
      var id = String(pageId).trim();
      var sp = state.spreads[idx];
      if (!sp) return null;
      if (String(sp.id) === id) return sp;
      if (String(sp.page || sp.footer || '').toUpperCase() === id.toUpperCase()) return sp;
      return null;
    },

    getIndex: function () {
      return state.index;
    },

    getSpreads: function () {
      return state.spreads.slice();
    },

    /** Render all spreads (no flip) — useful for print-only mounts or static embeds. */
    renderAll: function (container, options) {
      var data = getData(options);
      if (!container || !data) return;
      container.classList.remove('tb-wrap--flip');
      container.innerHTML = data.spreads.map(renderSpread).join('\n');
      scheduleZoneMapLines();
    }
  };

  global.TravelBook = TravelBook;
})(typeof window !== 'undefined' ? window : globalThis);
