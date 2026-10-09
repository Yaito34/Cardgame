/**
 * Parse TravelBook.md into { spreads: [...] }.
 * Browser: window.TravelBookParse.parseTravelBook(text)
 * Node: import { parseTravelBook } from './travel-book-parse.js'
 */
function parseYamlBlock(block) {
    var o = {};
    var lines = String(block || '').split('\n');
    for (var i = 0; i < lines.length; i++) {
      var t = lines[i].trim();
      if (!t) continue;
      var c = t.indexOf(':');
      if (c === -1) continue;
      o[t.slice(0, c).trim()] = t.slice(c + 1).trim();
    }
    return o;
  }

  function parseListSection(rest) {
    var items = [];
    var lines = String(rest || '').split(/\r?\n/);
    for (var i = 0; i < lines.length; i++) {
      var m = lines[i].match(/^\s*[-*]\s+(.+)$/);
      if (m) items.push(m[1].trim());
    }
    return items;
  }

  function bodyToParts(body) {
    var t = String(body || '').trim();
    var sectionRe =
      /^###\s+(Location Effects|On this Path|On this Area|In this Area|Optional|While you stay|Available Actions|Forced|You must|Exits|Paths|Leads to|Passages|Discoveries|Sees|Looks to|Can see)\s*$/gim;
    var markers = [];
    var m;
    while ((m = sectionRe.exec(t)) !== null) {
      markers.push({
        name: m[1].toLowerCase(),
        index: m.index,
        end: m.index + m[0].length
      });
    }

    if (markers.length === 0) {
      return {
        flavor: t,
        locationEffects: [],
        optional: [],
        forced: [],
        exits: [],
        paths: [],
        leadsTo: [],
        passages: [],
        discoveries: [],
        sees: []
      };
    }

    var flavor = t.slice(0, markers[0].index).trim();
    var locationEffects = [];
    var optional = [];
    var forced = [];
    var exits = [];
    var paths = [];
    var leadsTo = [];
    var passages = [];
    var discoveries = [];
    var sees = [];

    for (var i = 0; i < markers.length; i++) {
      var start = markers[i].end;
      var end = i + 1 < markers.length ? markers[i + 1].index : t.length;
      var items = parseListSection(t.slice(start, end));
      var name = markers[i].name;
      if (
        name === 'location effects' ||
        name === 'on this path' ||
        name === 'on this area' ||
        name === 'in this area'
      )
        locationEffects.push.apply(locationEffects, items);
      else if (name === 'optional' || name === 'while you stay' || name === 'available actions')
        optional.push.apply(optional, items);
      else if (name === 'forced' || name === 'you must') forced.push.apply(forced, items);
      else if (name === 'leads to') leadsTo.push.apply(leadsTo, items);
      else if (name === 'passages') passages.push.apply(passages, items);
      else if (name === 'exits') exits.push.apply(exits, items);
      else if (name === 'paths') paths.push.apply(paths, items);
      else if (name === 'discoveries') discoveries.push.apply(discoveries, items);
      else if (name === 'sees' || name === 'looks to' || name === 'can see')
        sees.push.apply(sees, items);
    }

    return {
      flavor: flavor,
      locationEffects: locationEffects,
      optional: optional,
      forced: forced,
      exits: exits,
      paths: paths,
      leadsTo: leadsTo,
      passages: passages,
      discoveries: discoveries,
      sees: sees
    };
  }

  function splitSpreads(text) {
    var parts = String(text || '')
      .split(/^\s*\+{3}\s*$/m)
      .map(function (p) {
        return p.trim();
      });
    var spreads = [];
    for (var i = 1; i < parts.length; i += 2) {
      var meta = parts[i];
      var body = parts[i + 1] || '';
      if (!meta) continue;
      var y = parseYamlBlock(meta);
      if (y.id || y.name || y.left_title) spreads.push({ meta: y, body: body });
    }
    return spreads;
  }

  function parseMapCoord(v) {
    if (v == null || v === '') return null;
    var n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function normalizeKind(k) {
    var kind = (k || 'area').toLowerCase();
    if (kind === 'map') return 'map';
    if (
      kind === 'crossing' ||
      kind === 'landmark' ||
      kind === 'path' ||
      kind === 'area'
    ) {
      return 'area';
    }
    return kind;
  }

  function toData(spreads) {
    return spreads.map(function (s) {
      var m = s.meta;
      var parts = bodyToParts(s.body);
      var kind = normalizeKind(m.kind);
      var leadsTo = parts.leadsTo || [];
      var passages = parts.passages || [];
      var seenExits = {};
      var exitList = [];
      var all = (parts.paths || []).concat(parts.exits || [], leadsTo, passages);
      for (var i = 0; i < all.length; i++) {
        var line = all[i];
        if (!line || seenExits[line]) continue;
        seenExits[line] = true;
        exitList.push(line);
      }
      var rawName = m.name || m.left_title || 'Untitled';
      var section = (m.section || m.area || '').trim();
      var locationName = rawName;
      if (section) {
        locationName = rawName;
      } else if (/\s*·\s*/.test(rawName)) {
        var nameParts = rawName
          .split(/\s*·\s*/)
          .map(function (p) {
            return p.trim();
          })
          .filter(Boolean);
        section = nameParts[0] || '';
        locationName = nameParts.slice(1).join(' · ') || rawName;
      }
      return {
        id: m.id != null ? String(m.id) : '',
        kind: kind,
        name: locationName,
        section: section || '',
        area: section || '',
        zone: m.zone || '',
        page: m.page || m.footer || '',
        mapX: parseMapCoord(m.map_x),
        mapY: parseMapCoord(m.map_y),
        title: locationName,
        leftTitle: locationName,
        rightTitle: m.right_title || '',
        footer: m.page || m.footer || '',
        onArrival: m.on_arrival || '',
        recovery: m.recovery || '',
        travel: m.travel || '',
        difficulty: m.difficulty || '',
        setting: (m.setting || 'indoor').toLowerCase(),
        tag: (m.tag || '').trim(),
        flavor: parts.flavor,
        locationEffects: parts.locationEffects,
        optional: parts.optional,
        forced: parts.forced,
        leadsTo: leadsTo,
        passages: passages,
        exits: exitList,
        paths: exitList,
        discoveries: parts.discoveries,
        sees: parts.sees || []
      };
    });
  }

  function parseTravelBook(text) {
    var spreads = splitSpreads(text);
    return { spreads: toData(spreads) };
  }

  if (typeof window !== 'undefined') {
    window.TravelBookParse = { parseTravelBook: parseTravelBook };
  }

  export { parseTravelBook };
