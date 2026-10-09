// ── CARD DATA — cards.md + optional card-definitions.md (shorthand → rule text) ─

// ── SIGIL SVG ────────────────────────────────────────────────────────────────
const sigilSVG = `<svg class="card-sigil" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="27" stroke="#4a2e10" stroke-width="1.2" fill="none"/>
  <circle cx="30" cy="30" r="18" stroke="#4a2e10" stroke-width="0.8" fill="none"/>
  <polygon points="30,4 54,48 6,48" stroke="#4a2e10" stroke-width="1.1" fill="none"/>
  <line x1="30" y1="4"  x2="30" y2="56" stroke="#4a2e10" stroke-width="0.5"/>
  <line x1="3"  y1="30" x2="57" y2="30" stroke="#4a2e10" stroke-width="0.5"/>
  <circle cx="30" cy="30" r="3" stroke="#4a2e10" stroke-width="0.8" fill="none"/>
</svg>`;

// ── RENDER ───────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function banner(name, type, subtitle, icon) {
  var stripClass = 'card-scroll-strip' + (subtitle ? ' card-scroll-strip--with-subtitle' : '');
  var subHtml = subtitle
    ? '<span class="card-subtitle">' + escapeHtml(subtitle) + '</span>'
    : '';
  var nameInner = icon
    ? '<span class="card-banner-icon" aria-hidden="true">' + escapeHtml(icon) + '</span>' +
      '<span class="card-name-text">' + escapeHtml(name) + '</span>'
    : escapeHtml(name);
  var nameClass = 'card-name' + (icon ? ' card-name--with-icon' : '');
  return `<div class="card-top">
    <div class="card-banner banner-${type}">
      <div class="${stripClass}">
        <span class="${nameClass}">${nameInner}</span>
        ${subHtml}
      </div>
    </div>
  </div>`;
}

/** Default glyphs if cards.md has no `[symbols]` section (merged with parsed table). */
const DEFAULT_EFFECT_SYMBOLS = {
  find: '🧭',
  exhaust: '🌫️',
  recovery: '🌿',
  rations: '🍞',
  sight: '🕯️',
  vision: '🔭',
  power: '⚒️',
  difficulty: '⛰️',
  return: '🌀',
  ongoing: '⏳',
  lasts: '⏳',
  scout: '🔎',
  spirit: '🪬',
  /** Activation / timing (effect bands only in practice; glyphs optional via [symbols]). */
  'while revealed': '🔄',
  'on reveal': '◉',
  charging: '🔋'
};

/** Set during buildGrid while rendering: either defaults-only or `[symbols]` table only (no silent fallbacks). */
var currentEffectSymbolMap = null;

/** Rebuilt when merged symbol map changes (keys drive outcome glyph matching). */
var outcomeGlyphPatternCache = { mapJson: '', re: null };
/** All [symbols] keys (including empty symbol = no glyph but still bold outcome layout). */
var outcomeKeywordPatternCache = { mapJson: '', re: null };

function normalizeEffectSymbolKey(kw) {
  return String(kw || '').toLowerCase().trim();
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mergedEffectSymbolMap() {
  var ov = currentEffectSymbolMap || {};
  return Object.assign({}, ov);
}

/** Copy Exhaustion glyph to Exhaust so short outcomes (`Exhaust +2`) match [symbols]. */
function applyEffectSymbolAliases(map) {
  if (!map || typeof map !== 'object') return map;
  var exFull = map.exhaustion;
  if (exFull != null && String(exFull).trim() !== '') {
    if (map.exhaust == null || String(map.exhaust).trim() === '') {
      map.exhaust = String(exFull).trim();
    }
  }
  var spiritGlyph = map.spirit;
  if (spiritGlyph != null && String(spiritGlyph).trim() !== '') {
    var g = String(spiritGlyph).trim();
    if (map.valuables == null || String(map.valuables).trim() === '') map.valuables = g;
    if (map.value == null || String(map.value).trim() === '') map.value = g;
  }
  return map;
}

/**
 * After a leading [symbols] keyword, rest must be a single meter token (not prose).
 */
function outcomeKeywordRestIsValid(rest) {
  var valPart = String(rest || '').trim();
  if (!valPart) return true;
  if (/^Power\s+[+-]?\d+\s*$/i.test(valPart)) return true;
  if (/^([+-]?\d+|[A-Za-z]\d{1,2}|\d+\s*[-\u2013]\s*\d+)\s*$/.test(valPart)) return true;
  return false;
}

/**
 * Bare capitalized single word (e.g. "Discard", "Clear", "Bypass") counts as a valid outcome chunk
 * even if it has no value and is not listed in [symbols].
 */
function looksLikeOutcomeChunk(s) {
  var t = String(s || '').trim();
  if (!t) return false;
  if (outcomeHasGlyphPrefix(t)) return true;
  if (/^[A-Za-z][A-Za-z0-9 \-]*\s*:\s*.+$/.test(t)) return true;
  return /^[A-Z][a-zA-Z]+$/.test(t);
}

/** `Rations -2, Exhaustion +2` → separate glyph tokens; skip if any chunk is not outcome-shaped. */
function splitCommaSeparatedOutcomeTokens(seg) {
  var s = String(seg || '').trim();
  if (!s || !/,/.test(s)) return [s];
  var chunks = s.split(/\s*,\s*/).map(function(x) {
    return String(x || '').trim();
  }).filter(Boolean);
  if (chunks.length < 2) return [s];
  var ok = chunks.every(function(chunk) {
    return looksLikeOutcomeChunk(chunk);
  });
  return ok ? chunks : [s];
}

/** Keep ", " after the preceding outcome so the comma does not wrap to the next line alone. */
function joinCommaOutcomeHTML(renderedParts) {
  if (!renderedParts || !renderedParts.length) return '';
  if (renderedParts.length === 1) return renderedParts[0];
  var h = '';
  for (var ji = 0; ji < renderedParts.length - 1; ji++) {
    h +=
      '<span class="kw-outcome-comma-tail">' +
      renderedParts[ji] +
      '<span class="kw-outcome-sep">, </span></span>';
  }
  h += renderedParts[renderedParts.length - 1];
  return h;
}

/** Regex: longest keyword first, `\b` after keyword so `Vision` does not match inside `Visionary`. */
function getOutcomeGlyphRegex() {
  var map = mergedEffectSymbolMap();
  var mj = JSON.stringify(map);
  if (outcomeGlyphPatternCache.mapJson === mj && outcomeGlyphPatternCache.re) return outcomeGlyphPatternCache.re;
  var keys = Object.keys(map).filter(function(k) {
    return map[k] != null && String(map[k]).trim() !== '';
  });
  keys.sort(function(a, b) {
    return b.length - a.length;
  });
  outcomeGlyphPatternCache.mapJson = mj;
  outcomeGlyphPatternCache.re =
    keys.length > 0
      ? new RegExp('^(' + keys.map(escapeRegExp).join('|') + ')\\b(.*)$', 'i')
      : null;
  return outcomeGlyphPatternCache.re;
}

/** Same keyword ordering as glyphs, but includes rows with an empty symbol cell (styling only). */
function getOutcomeKeywordRegex() {
  var map = mergedEffectSymbolMap();
  var mj = JSON.stringify(map);
  if (outcomeKeywordPatternCache.mapJson === mj && outcomeKeywordPatternCache.re) {
    return outcomeKeywordPatternCache.re;
  }
  var keys = Object.keys(map).filter(function(k) {
    return k != null && String(k).trim() !== '';
  });
  keys.sort(function(a, b) {
    return b.length - a.length;
  });
  outcomeKeywordPatternCache.mapJson = mj;
  outcomeKeywordPatternCache.re =
    keys.length > 0
      ? new RegExp('^(' + keys.map(escapeRegExp).join('|') + ')\\b(.*)$', 'i')
      : null;
  return outcomeKeywordPatternCache.re;
}

/** Insert spaces at lower→upper boundaries so `UseRations`-style tokens match spaced definition keys (e.g. `Use Rations X`). */
function normalizeCamelCaseWords(s) {
  return String(s || '').replace(/([a-z])([A-Z])/g, '$1 $2');
}

/** Outcome value token: plain number, signed delta, Find-style letter+digits (e.g. F2), or Range span (e.g. 1-2). */
function isLooseOutcomeValueToken(val) {
  var v = String(val || '').trim();
  if (!v) return false;
  if (/^[+-]?\d+$/.test(v)) return true;
  if (/^[A-Za-z]\d{1,2}$/.test(v)) return true;
  if (/^\d+\s*[-\u2013]\s*\d+$/.test(v)) return true;
  return false;
}

/**
 * Any new `Keyword 2` / `Use Rations 2` / `Move Close 1` outcome token without listing it in [symbols].
 * Rejects values like `Power` so `Traverse Power +2` does not match as one fake keyword.
 */
function looseOutcomeTokenMatch(seg) {
  var s = String(seg || '').trim();
  if (!s) return null;
  var m = s.match(
    /^((?:[A-Z][a-z]+)(?:\s+[A-Z][a-z]+)*|[A-Z][a-z]*(?:[A-Z][a-z]*)+)\s+(\S+)(.*)$/
  );
  if (!m) return null;
  var kw = m[1];
  var val = m[2];
  var rest = m[3] || '';
  if (
    /^(The|When|Then|If|And|Or|This|Each|Spend|Suffer|Round|Optional)\b/i.test(kw)
  ) {
    return null;
  }
  if (!isLooseOutcomeValueToken(val)) return null;
  return { keyword: kw, value: val, rest: rest };
}

/** `+2 Rations`, `F4 Find`, `2 Scout` — value token first, then a [symbols] keyword (longest match). */
function valueFirstOutcomeTokenMatch(seg) {
  var s = String(seg || '').trim();
  var kwRe = getOutcomeKeywordRegex();
  if (!kwRe) return null;
  var vm = s.match(/^(\S+)\s+([\s\S]+)$/);
  if (!vm) return null;
  var val = vm[1];
  if (!isLooseOutcomeValueToken(val)) return null;
  var after = String(vm[2] || '').trim();
  var km = after.match(kwRe);
  if (!km) return null;
  return {
    keyword: km[1],
    value: val,
    rest: String(km[2] || '').trim()
  };
}

function outcomeHasGlyphPrefix(s) {
  var t = String(s || '').trim();
  var re = getOutcomeKeywordRegex();
  if (re && re.test(t)) return true;
  if (looseOutcomeTokenMatch(t)) return true;
  return !!valueFirstOutcomeTokenMatch(t);
}

function symbolForOutcomeKeywordCanon(kw) {
  var sym = symbolForGlyphKeyword(kw);
  if (sym) return sym;
  var split = normalizeCamelCaseWords(kw);
  if (split !== kw) sym = symbolForGlyphKeyword(split);
  return sym || '';
}

/** Non-breaking space before +N so lines like `Traverse Power +2` do not wrap as `…Power` / `+2.` (not an author newline in cards.md). */
function glueNumericDeltaBreaks(s) {
  return String(s || '').replace(/([A-Za-z])\s+([+-]?\d+)/g, '$1\u00a0$2');
}

/**
 * Comic / explanation fragments after `:` on field and ongoing lines: `<…>` tokens
 * (legacy) and plain keyword tokens become glyph outcomes where matched. Plain prose
 * (e.g. "+2 Difficulty when…") is not scanned for embedded keywords so explanations are
 * not mistaken for outcome tokens.
 */
/** Comic / explanation body: optional `<…>` tokens + plain text; newlines become `<br />`. */
function richEffectBandInlineHTML(body) {
  var raw = String(body || '').replace(/\s+$/, '');
  if (!raw.trim()) return '';
  return raw
    .split(/\n/)
    .map(function(line) {
      var L = String(line || '');
      if (!L.trim()) return '';
      var parts = L.split(/(<[^>]+>)/g);
      var out = '';
      var pi;
      for (pi = 0; pi < parts.length; pi++) {
        var part = parts[pi];
        if (!part) continue;
        if (part.charAt(0) === '<' && part.length > 2 && part.charAt(part.length - 1) === '>') {
          out += htmlForStandardOutcomeInner(part.slice(1, -1).trim());
        } else {
          out += escapeHtml(glueNumericDeltaBreaks(part));
        }
      }
      return out;
    })
    .filter(Boolean)
    .join('<br />');
}

function renderEffectBandBodyHTML(body) {
  return '<span class="text-comic">' + richEffectBandInlineHTML(String(body || '').trim()) + '</span>';
}

/**
 * Body after `:` on field / preamble / ongoing lines (`isSub` / `isBottom`): run the same outcome
 * comma / · pipeline as approach rows when the text is outcome-shaped; keep comic italic for prose.
 */
function outcomeFragmentLooksShaped(seg) {
  var s = String(seg || '').trim();
  if (!s) return false;
  return !!(
    outcomeHasGlyphPrefix(s) ||
    valueFirstOutcomeTokenMatch(s) ||
    looseOutcomeTokenMatch(s)
  );
}

/** `-2 Power, until healed` → shaped lead + prose tail (for .text-comic), without treating the whole line as one bold token. */
/** Plain-language tails after the last comma (e.g. "until healed") — force comic even if lexer matches a short keyword. */
function looksLikeProseOutcomeTail(t) {
  var s = String(t || '').trim();
  if (!s || !/\s/.test(s)) return false;
  if (/^[\[+]/.test(s) || /^-?\d/.test(s)) return false;
  if (/^(?:Ongoing|Lasts|Power|Rations|Return|Skip)\b/i.test(s) && !/\b(to|for|when|until|while)\b/i.test(s)) return false;
  return /^[a-z]/.test(s) || /\b(to all|until|when|while|stacking|heal)\b/i.test(s);
}

function splitOutcomeLeadAndProseTail(b) {
  var s = String(b || '').trim();
  var lastComma = s.lastIndexOf(',');
  if (lastComma <= 0) return null;
  var left = s.slice(0, lastComma).trim();
  var right = s.slice(lastComma + 1).trim();
  if (!left || !right) return null;
  if (!outcomeFragmentLooksShaped(left)) return null;
  if (looksLikeProseOutcomeTail(right)) return { lead: left, tail: right };
  if (outcomeFragmentLooksShaped(right)) return null;
  return { lead: left, tail: right };
}

/** Body after the outer `:` on a field/sub line — always italic explanation text, no heuristics. */
function renderFieldColonedBodyHTML(body) {
  return renderEffectBandBodyHTML(body);
}

/** Parse markdown table or `Keyword: glyph` lines from the [symbols] deck body. */
function parseSymbolMapSection(section) {
  var map = {};
  String(section || '')
    .split(/\r?\n/)
    .forEach(function(line) {
      var t = line.trim();
      if (!t || /^#/.test(t)) return;
      if (/^\|/.test(t)) {
        if (/^[\|\s\-:]+$/.test(t)) return;
        var rawParts = t.split('|').map(function(c) {
          return c.replace(/\*+/g, '').trim();
        });
        if (rawParts.length < 3) return;
        var keyRaw = rawParts[1];
        var symRaw = rawParts.length > 2 ? rawParts[2] : '';
        if (/^keyword$/i.test(keyRaw) && /^symbol$/i.test(symRaw)) return;
        if (!keyRaw || /^[\-:]+$/.test(keyRaw)) return;
        var key = normalizeEffectSymbolKey(keyRaw);
        if (!key) return;
        map[key] = String(symRaw || '').trim();
        return;
      }
      var cm = t.match(/^([^:#]+):\s*(.*)$/);
      if (cm) {
        map[normalizeEffectSymbolKey(cm[1])] = String(cm[2] || '').trim();
      }
    });
  return map;
}

/** Remove leading `# … [symbols]` block; return remaining markdown + parsed map. */
function stripLeadingSymbolSection(raw) {
  var text = String(raw || '');
  var head = text.match(/^#\s+[^\n]*\[\s*symbols\s*\]\s*\r?\n/i);
  if (!head) return { body: text, map: {}, hadSymbolSection: false };
  var rest = text.slice(head[0].length);
  var nextHash = rest.search(/^\#\s+/m);
  var section = nextHash === -1 ? rest : rest.slice(0, nextHash);
  var body = nextHash === -1 ? '' : rest.slice(nextHash);
  var map = parseSymbolMapSection(section);
  if (!body.trim()) return { body: text, map: map, hadSymbolSection: true };
  return { body: body.replace(/^\s+/, ''), map: map, hadSymbolSection: true };
}

/**
 * `### …` blocks are author notes in the .md only. Strip them before card parse
 * (from a ### heading until the next ## card or # deck heading).
 */
function stripMarkdownNoteSections(raw) {
  var lines = String(raw || '').split(/\r?\n/);
  var out = [];
  var inNote = false;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var t = String(line || '').trim();
    if (/^###/.test(t)) {
      inNote = true;
      continue;
    }
    if (inNote) {
      if (/^##\s/.test(t) || /^#\s/.test(t)) {
        inNote = false;
        out.push(line);
      }
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

/** HTML comment blocks in .md are author-only (never card text). */
function stripHtmlComments(raw) {
  return String(raw || '').replace(/<!--[\s\S]*?-->/g, '\n');
}

function prepareMarkdownForCards(raw) {
  return stripMarkdownNoteSections(stripHtmlComments(raw));
}

function symbolForGlyphKeyword(matchedKeyword) {
  var map = mergedEffectSymbolMap();
  var k = normalizeEffectSymbolKey(matchedKeyword);
  return map[k] != null && String(map[k]).trim() !== '' ? String(map[k]).trim() : '';
}

/**
 * Text after a loose `Keyword value` prefix (e.g. `▸ +2 Rations`, `| 1 Scout`).
 * Uses the same outcome / `·` / `|` pipeline as approach rows — not `.text-comic` (that is for prose after `Keyword :` only).
 */
function appendLooseOutcomeKeywordTailHTML(restRaw) {
  var rest = String(restRaw || '').trim();
  if (!rest) return '';
  var hadArrow = /^[\u25b8\u25ba]/u.test(rest);
  var afterArrow = hadArrow ? rest.replace(/^[\u25b8\u25ba]\s*/u, '').trim() : rest;
  var sep = '';
  if (hadArrow) {
    sep = '<span class="kw-mid-dot">' + escapeHtml(rest.charAt(0)) + '</span> ';
  }
  if (!afterArrow) {
    return sep ? ' ' + sep : '';
  }
  var bodyHtml = /\|/.test(afterArrow)
    ? renderApproachOutcomeBody(afterArrow)
    : renderOutcomeClusterPartsHTML(afterArrow);
  return ' ' + sep + bodyHtml;
}

/**
 * One parsed outcome token as HTML: **glyph · value · keyword** when `[symbols]` gives a glyph;
 * without a glyph use **keyword · value** (e.g. Use Rations 2, Power +3) even if the MD token was value-first.
 */
function htmlEffectOutcomeGlyphToken(sym, kw, valPart) {
  var escKw = escapeHtml(kw);
  var escVal = valPart ? escapeHtml(glueNumericDeltaBreaks(String(valPart).trim())) : '';
  var hasSym = sym != null && String(sym).trim() !== '';
  var chip = '';
  if (hasSym) {
    chip =
      '<span class="effect-outcome-chip">' +
      '<span class="effect-outcome-glyph" aria-hidden="true">' +
      escapeHtml(String(sym).trim()) +
      '</span>' +
      (escVal ? '<span class="outcome-val"> ' + escVal + '</span>' : '') +
      '</span>';
    return (
      '<span class="effect-outcome-wrap"><strong class="text-kw-outcome">' +
      chip +
      '<span class="outcome-kw"> ' +
      escKw +
      '</span></strong></span>'
    );
  }
  var valChip = escVal
    ? '<span class="effect-outcome-chip"><span class="outcome-val">' + escVal + '</span></span>'
    : '';
  return (
    '<span class="effect-outcome-wrap"><strong class="text-kw-outcome">' +
    '<span class="outcome-kw">' +
    escKw +
    '</span>' +
    (valChip ? ' ' + valChip : '') +
    '</strong></span>'
  );
}

/** Inner text of one outcome token; glyph if first word(s) match a row in cards.md [symbols] table. */
function htmlForStandardOutcomeInner(inner) {
  var raw = String(inner || '').trim();
  var cmp = raw.match(/^([A-Za-z][A-Za-z ]*?)\s*([<>]=?)\s*(\d+)\s*:\s*(.+)$/);
  if (cmp) {
    var condKw = cmp[1].trim();
    var condSym = symbolForOutcomeKeywordCanon(condKw) || symbolForGlyphKeyword(condKw);
    return (
      htmlEffectOutcomeGlyphToken(condSym, condKw, cmp[2] + cmp[3]) +
      htmlForStandardOutcomeInner(cmp[4].trim())
    );
  }
  var glossIdx = raw.indexOf(' : ');
  var core = glossIdx >= 0 ? raw.slice(0, glossIdx).trim() : raw;
  var glossHtml =
    glossIdx >= 0
      ? ': <span class="text-comic">' + escapeHtml(glueNumericDeltaBreaks(raw.slice(glossIdx + 3).trim())) + '</span>'
      : '';
  if (glossIdx < 0) {
    var ccCore = splitCommaSeparatedOutcomeTokens(core);
    if (ccCore.length > 1) {
      return joinCommaOutcomeHTML(
        ccCore.map(function(c) {
          return htmlForStandardOutcomeInner(c);
        })
      );
    }
  }
  var kwRe = getOutcomeKeywordRegex();
  if (!kwRe) {
    var loose0 = looseOutcomeTokenMatch(core);
    if (loose0) {
      var sym0 = symbolForOutcomeKeywordCanon(loose0.keyword);
      var parts0 = htmlEffectOutcomeGlyphToken(sym0, loose0.keyword, loose0.value);
      var tail0 = String(loose0.rest || '').trim();
      if (tail0) parts0 += appendLooseOutcomeKeywordTailHTML(tail0);
      return parts0 + glossHtml;
    }
    var vf0 = valueFirstOutcomeTokenMatch(core);
    if (vf0) {
      var symV = symbolForOutcomeKeywordCanon(vf0.keyword);
      var partsV = htmlEffectOutcomeGlyphToken(symV, vf0.keyword, vf0.value);
      var tailV = String(vf0.rest || '').trim();
      if (tailV) partsV += appendLooseOutcomeKeywordTailHTML(tailV);
      return partsV + glossHtml;
    }
    return `<strong class="text-kw-outcome">${escapeHtml(glueNumericDeltaBreaks(core))}</strong>` + glossHtml;
  }
  var m = core.match(kwRe);
  var kw;
  var valPart;
  var sym;
  var looseRest = '';
  if (m) {
    kw = m[1];
    valPart = String(m[2] || '').trim();
    if (!outcomeKeywordRestIsValid(valPart)) {
      return `<strong class="text-kw-outcome">${escapeHtml(glueNumericDeltaBreaks(core))}</strong>` + glossHtml;
    }
    sym = symbolForGlyphKeyword(kw);
  } else {
    var loose = looseOutcomeTokenMatch(core);
    if (loose) {
      kw = loose.keyword;
      valPart = loose.value;
      sym = symbolForOutcomeKeywordCanon(kw);
      looseRest = String(loose.rest || '').trim();
    } else {
      var vf = valueFirstOutcomeTokenMatch(core);
      if (!vf) {
        return `<strong class="text-kw-outcome">${escapeHtml(glueNumericDeltaBreaks(core))}</strong>` + glossHtml;
      }
      kw = vf.keyword;
      valPart = vf.value;
      sym = symbolForOutcomeKeywordCanon(vf.keyword);
      looseRest = String(vf.rest || '').trim();
    }
  }
  var parts = htmlEffectOutcomeGlyphToken(sym, kw, valPart);
  if (looseRest) {
    parts += appendLooseOutcomeKeywordTailHTML(looseRest);
  }
  return parts + glossHtml;
}

/** Bracket codes: two-letter first so CR/WA/WO/FI/TR/AW win over C/W/F/T/A. */
var RE_APPROACH_STAT_CODE = 'FI|WO|CR|TR|AW|WA|F|C|W|T|A';
var RE_GARB_APPROACH_NAME = 'Fight|Work|Traverse|Awareness|Awerness|Craft|Warm|Cold';

/** Canonical type → single capital letter on flavored approach chips (`[F]`, `[C]`, `[W]`, …). */
function statLetterForApproachType(canonical) {
  const map = {
    Fight: 'F',
    Craft: 'C',
    Work: 'C',
    Traverse: 'T',
    Awareness: 'A',
    Warm: 'W',
    Cold: 'W',
    Special: 'S'
  };
  if (map[canonical]) return map[canonical];
  const s = String(canonical || '').trim();
  return s ? s.charAt(0).toUpperCase() : '?';
}

/** Canonical type → two-letter code (tools, legacy text). */
function statCodeForApproachType(canonical) {
  const map = {
    Fight: 'FI',
    Craft: 'CR',
    Work: 'CR',
    Traverse: 'TR',
    Awareness: 'AW',
    Warm: 'WA',
    Special: 'Special'
  };
  return map[canonical] || canonical || '';
}

/** Fight / Work / Craft / Warm / Cold / … → canonical type name. */
function normalizeApproachTypeName(name) {
  const w = String(name || '').trim().toLowerCase();
  const map = {
    fight: 'Fight',
    work: 'Craft',
    craft: 'Craft',
    traverse: 'Traverse',
    awareness: 'Awareness',
    awerness: 'Awareness',
    warm: 'Warm',
    cold: 'Warm',
    special: 'Special'
  };
  return map[w] || String(name || '').trim();
}

/**
 * FI / CR / WO / TR / AW / WA, or F / C / W / T / A.
 * [W] is Warm when the flavour is Warm/Cold; otherwise legacy Work → Craft.
 */
function canonicalApproachTypeFromStatCode(code, flavorHint) {
  const c = String(code || '').trim().toUpperCase();
  const flavor = String(flavorHint || '').trim().toLowerCase();
  const two = { FI: 'Fight', WO: 'Craft', CR: 'Craft', TR: 'Traverse', AW: 'Awareness', WA: 'Warm' };
  if (two[c]) return two[c];
  if (c === 'C') return 'Craft';
  if (c === 'W') {
    if (/^(warm|cold)$/.test(flavor)) return 'Warm';
    return 'Craft';
  }
  const one = { F: 'Fight', T: 'Traverse', A: 'Awareness' };
  return one[c] || null;
}

var APPROACH_TYPE_ICON_SRC = {
  Fight: 'assets/icons/fight.png?v=raw',
  Craft: 'assets/icons/craft.png?v=raw',
  Work: 'assets/icons/craft.png?v=raw',
  Traverse: 'assets/icons/traverse.png?v=green',
  Awareness: 'assets/icons/awareness.png?v=eye'
};

function approachStatChipTagHTML(typeName, glyphInstead) {
  var canonical = normalizeApproachTypeName(typeName);
  if (glyphInstead) {
    return (
      '<span class="approach-stat-chip__tag approach-stat-chip__tag--icon approach-stat-chip__tag--glyph" aria-label="' +
      escapeHtml(canonical) +
      '">' +
      escapeHtml(glyphInstead) +
      '</span>'
    );
  }
  var src = APPROACH_TYPE_ICON_SRC[canonical];
  if (src) {
    return (
      '<span class="approach-stat-chip__tag approach-stat-chip__tag--icon" aria-label="' +
      escapeHtml(canonical) +
      '">' +
      '<img class="approach-type-icon" src="' +
      escapeHtml(src) +
      '" alt="">' +
      '</span>'
    );
  }
  var code = statLetterForApproachType(canonical || typeName);
  return '<span class="approach-stat-chip__tag">' + escapeHtml('[' + code + ']') + '</span>';
}

/** CSS class suffix: approach-kind-fight | craft | traverse | awareness | warm | special | default */
function approachKindClass(typeName) {
  const w = String(typeName || '')
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();
  const map = {
    fight: 'fight',
    fi: 'fight',
    craft: 'craft',
    cr: 'craft',
    work: 'craft',
    wo: 'craft',
    c: 'craft',
    traverse: 'traverse',
    tr: 'traverse',
    awareness: 'awareness',
    aw: 'awareness',
    f: 'fight',
    t: 'traverse',
    a: 'awareness',
    warm: 'warm',
    wa: 'warm',
    cold: 'warm',
    wet: 'warm',
    weather: 'warm',
    special: 'special',
    feel: 'awareness',
    analyse: 'awareness',
    analyze: 'awareness',
    climb: 'traverse'
  };
  return 'approach-kind-' + (map[w] || 'default');
}

function approachKindClassFromLabel(label) {
  const s = String(label).trim();
  var statRe = new RegExp('^\\[\\s*(' + RE_APPROACH_STAT_CODE + ')\\s+\\d+\\s*\\]', 'i');
  var statHead = s.match(statRe);
  if (!statHead) statHead = s.match(new RegExp('^\\[\\s*(' + RE_APPROACH_STAT_CODE + ')\\s*\\]\\s*\\d+', 'i'));
  if (statHead) {
    const canon = canonicalApproachTypeFromStatCode(statHead[1], s);
    if (canon) return approachKindClass(canon);
  }
  const statTail = s.match(new RegExp('\\s+(' + RE_APPROACH_STAT_CODE + ')\\s*(\\d+)\\s*$', 'i'));
  if (statTail) {
    const canon = canonicalApproachTypeFromStatCode(statTail[1], s);
    if (canon) return approachKindClass(canon);
  }
  const m = s.match(/^(\w+)/);
  return approachKindClass(m ? m[1] : '');
}

/** Core formatter; **`>…<`** whole-line fences are stripped in **`formatTextLine`** before recursing once (centered wrapper). */
function _formatTextLineCore(text, isSub, isBottom) {
  var rawText = String(text || '');
  /* `Label ▸ outcomes` (U+25B8 / U+25BA): same outcome pipeline as after `:`, for field / sub / bottom lines. */
  if (isSub || isBottom) {
    var arrowM = rawText.match(/^(.+?)\s*([\u25b8\u25ba])\s+([\s\S]+)$/u);
    if (arrowM) {
      var kwArrow = arrowM[1].trim();
      var arrowCh = arrowM[2];
      var tailArrow = arrowM[3].trim();
      return (
        renderOutcomeClusterPartsHTML(kwArrow) +
        '<span class="kw-mid-dot">' +
        escapeHtml(arrowCh) +
        '</span> ' +
        (tailArrow.indexOf(':') > 0
          ? renderProseFieldLineHTML(tailArrow)
          : renderOutcomeClusterPartsHTML(tailArrow))
      );
    }
    var arrowAsc = rawText.match(/^(.+?)\s+->\s+([\s\S]+)$/);
    if (arrowAsc) {
      var kwAsc = arrowAsc[1].trim();
      var tailAsc = arrowAsc[2].trim();
      return (
        renderOutcomeClusterPartsHTML(kwAsc) +
        '<span class="kw-mid-dot">→</span> ' +
        (tailAsc.indexOf(':') > 0
          ? renderProseFieldLineHTML(tailAsc)
          : renderOutcomeClusterPartsHTML(tailAsc))
      );
    }
  }
  if (isBottom && /,/.test(rawText)) {
    var commaEarly = splitCommaSeparatedOutcomeTokens(rawText.trim());
    if (commaEarly.length > 1) {
      return joinCommaOutcomeHTML(
        commaEarly.map(function(c) {
          return renderOutcomeSegmentHTML(c);
        })
      );
    }
  }
  const ci = text.indexOf(':');
  if (ci > 0) {
    const keyword = text.slice(0, ci);
    let body = text.slice(ci + 1);
    if (!isSub && !isBottom) {
      const trimBody = body.trim();
      let outcomeHTML = '';
      if (trimBody) {
        if (/<[^>]+>/.test(trimBody)) {
          outcomeHTML =
            ' ' + trimBody.replace(/<([^>]+)>/g, (_, t) => htmlForStandardOutcomeInner(t.trim()));
        } else {
          outcomeHTML = ' ' + renderOutcomeSegmentHTML(trimBody);
        }
      }
      const kc = approachKindClassFromLabel(keyword);
      return `<strong class="text-kw-approach ${kc}">${keyword}</strong>:${outcomeHTML}`;
    }
    const needsBrAfterColon = /^\s*\n/.test(body);
    if (needsBrAfterColon) {
      body = body.replace(/^\s*\n+/, '');
    }
    return (
      renderOutcomeClusterPartsHTML(keyword.trim()) +
      ':' +
      (needsBrAfterColon ? '<br />' : ' ') +
      renderFieldColonedBodyHTML(body)
    );
  }
  const trimWhole = String(text || '').trim();
  if (outcomeHasGlyphPrefix(trimWhole)) {
    return htmlForStandardOutcomeInner(trimWhole);
  }
  const base = isSub || isBottom ? 'text-kw-effect' : 'text-kw-approach';
  const kc = !isSub && !isBottom ? ` ${approachKindClassFromLabel(text)}` : '';
  return `<strong class="${base}${kc}">${escapeHtml(text)}</strong>`;
}

/** Field / approach-sub lines where the whole sentence is explanatory copy (not colon + glyphed outcomes). */
function textLineShouldRenderAsProseFieldLine(t) {
  var s = String(t || '').trim();
  var ci = s.indexOf(':');
  if (ci <= 0) return false;
  var head = s.slice(0, ci);
  var tail = s.slice(ci + 1).trim();
  var nBracket = 0;
  for (var hi = 0; hi < head.length; hi++) {
    if (head.charAt(hi) === '[') nBracket++;
  }
  if (nBracket >= 2) return true;
  /* `Hinderence 4: -4 Power for Traverse and … Actions, for 1 Action` — headline + metre, not Keyword: <effects>. */
  if (/^[A-Za-z]+\s+\d+$/.test(head.trim())) {
    if (
      /Power\s+[+-]?\d+\s+for\s+/i.test(tail) ||
      /[+-]?\d+\s+Power\s+for\b/i.test(tail) ||
      /Actions\s*,\s*for\s+/i.test(tail)
    )
      return true;
  }
  return false;
}

/** Whole line is prose-oriented field copy — bold label before `:`, comic explanation after (matches top-band field lines). */
function renderProseFieldLineHTML(full) {
  var s = String(full || '').trim();
  var ci = s.indexOf(':');
  if (ci <= 0) return renderEffectBandBodyHTML(s);
  var hk = s.slice(0, ci).trim();
  var tb = s.slice(ci + 1).trim();
  var lead =
    '<strong class="text-kw-effect">' + escapeHtml(glueNumericDeltaBreaks(hk)) + '</strong>';
  if (!tb) return lead;
  return lead + ': ' + renderEffectBandBodyHTML(tb);
}

function formatTextLine(text, isSub, isBottom) {
  const trimmedAll = String(text || '').trim();
  const cen = trimmedAll.match(/^>([\s\S]+)<$/);
  if (cen) {
    const inner = String(cen[1] || '').trim();
    if (inner) {
      if (textLineShouldRenderAsProseFieldLine(inner)) {
        return '<span class="card-text-centered">' + renderProseFieldLineHTML(inner) + '</span>';
      }
      return '<span class="card-text-centered">' + _formatTextLineCore(inner, isSub, isBottom) + '</span>';
    }
  }
  if (textLineShouldRenderAsProseFieldLine(trimmedAll)) {
    return renderProseFieldLineHTML(trimmedAll);
  }
  return _formatTextLineCore(String(text || ''), isSub, isBottom);
}

/** Effect token on outcome row — black bold; approach labels stay coloured separately. */
function renderOutcomeSegmentHTML(segment) {
  const seg = String(segment || '').trim();
  if (!seg) return '';
  if (/\n/.test(seg)) {
    return seg
      .split(/\n+/)
      .map(function (ln) {
        return renderOutcomeSegmentHTML(String(ln || '').trim());
      })
      .filter(Boolean)
      .join('<br />');
  }
  const gi = seg.indexOf(' : ');
  if (gi > 0 && !seg.startsWith('<')) {
    const condHead = seg.slice(0, gi).trim();
    if (!/^[A-Za-z][A-Za-z ]*\s*[<>]=?\s*\d+$/.test(condHead)) {
      const rawBody = seg.slice(gi + 3);
      const leadBr = /^\s*\n/.test(rawBody);
      const body = String(rawBody || '').trim();
      const sep = leadBr ? ':<br />' : ': ';
      return (
        renderOutcomeSegmentHTML(condHead) +
        sep +
        '<span class="text-comic">' +
        richEffectBandInlineHTML(body) +
        '</span>'
      );
    }
  }
  if (!seg.startsWith('<')) {
    const gnl = seg.match(/^(.+?)\s*:\s*\n([\s\S]+)$/);
    if (gnl) {
      const head = gnl[1].trim();
      const tail = gnl[2].replace(/^\s+/, '');
      if (head && tail) {
        return (
          renderOutcomeSegmentHTML(head) +
          ':<br />' +
          '<span class="text-comic">' +
          richEffectBandInlineHTML(tail) +
          '</span>'
        );
      }
    }
  }
  // "Offer 3-1: text" — keyword-style colon without leading space, e.g. on same line as an approach.
  // Head must start with a capital letter and contain only word chars, spaces, and hyphens.
  if (!seg.startsWith('<')) {
    const kwm = seg.match(/^([A-Za-z][A-Za-z0-9 \-]*)\s*:\s+([\s\S]+)$/);
    if (kwm) {
      return (
        renderOutcomeSegmentHTML(kwm[1].trim()) +
        ': ' +
        '<span class="text-comic">' + richEffectBandInlineHTML(kwm[2].trim()) + '</span>'
      );
    }
  }
  const angleOnly = seg.match(/^<([^>]+)>$/);
  if (angleOnly) {
    return htmlForStandardOutcomeInner(angleOnly[1].trim());
  }
  if (/<[^>]+>/.test(seg)) {
    return seg.replace(/<([^>]+)>/g, function (_, inner) {
      return htmlForStandardOutcomeInner(String(inner).trim());
    });
  }
  if (!seg.startsWith('<') && / & /.test(seg)) {
    var ampChunks = seg.split(/ & /).map(function(x) { return String(x || '').trim(); }).filter(Boolean);
    if (ampChunks.length > 1 && ampChunks.every(looksLikeOutcomeChunk)) {
      var ampParts = ampChunks.map(renderOutcomeSegmentHTML);
      var ampH = '';
      for (var ai = 0; ai < ampParts.length - 1; ai++) {
        ampH += '<span class="kw-outcome-comma-tail">' + ampParts[ai] + '<span class="kw-outcome-sep"> & </span></span>';
      }
      ampH += ampParts[ampParts.length - 1];
      return ampH;
    }
  }
  if (!seg.startsWith('<')) {
    var commaChunks = splitCommaSeparatedOutcomeTokens(seg);
    if (commaChunks.length > 1) {
      return joinCommaOutcomeHTML(
        commaChunks.map(function(c) {
          return renderOutcomeSegmentHTML(c);
        })
      );
    }
  }
  if (!seg.startsWith('<')) {
    var arrowSeg = seg.match(/^(.+?)\s*([\u25b8\u25ba])\s+([\s\S]+)$/u);
    if (arrowSeg) {
      var arrowLabel = arrowSeg[1].trim();
      var arrowChar = arrowSeg[2];
      var arrowTail = arrowSeg[3].trim();
      return (
        htmlForStandardOutcomeInner(arrowLabel) +
        '<span class="kw-mid-dot">' + escapeHtml(arrowChar) + '</span> ' +
        renderOutcomeSegmentHTML(arrowTail)
      );
    }
  }
  if (outcomeHasGlyphPrefix(seg)) return htmlForStandardOutcomeInner(seg);
  if (/^\[[0-9]+\+\]/.test(seg)) {
    return `<strong class="text-kw-outcome">${escapeHtml(seg)}</strong>`;
  }
  return htmlForStandardOutcomeInner(seg);
}

/** One outcome cluster: `Ongoing 1 · Guidance 2 : Traverse …` (middle dots bind tighter than `|`). */
function renderOutcomeClusterPartsHTML(clusterString) {
  const parts = String(clusterString || '')
    .trim()
    .split(/\s*·\s*/)
    .map(renderOutcomeSegmentHTML)
    .filter(Boolean);
  return parts.join('<span class="kw-mid-dot">·</span>');
}

/** Pipe / · clusters only (no leading `: `). Author newlines in outcomes (after `,` continuation) become `<br />`. */
function renderApproachOutcomeBody(outcomes) {
  const raw = String(outcomes || '');
  if (!String(raw).trim()) return '';
  return raw
    .split(/\r?\n/)
    .map(function (ln) {
      return String(ln || '').trim();
    })
    .filter(function (ln) {
      return ln.length > 0;
    })
    .map(function (lineSeg) {
      return lineSeg
        .split(/\s*\|\s*/)
        .map(renderOutcomeClusterPartsHTML)
        .filter(Boolean)
        .join('<span class="kw-outcome-sep"> | </span>');
    })
    .join('<br />');
}

/** Outcomes after `:` — split on `|` between separate outcomes, then on `·` inside a cluster. */
function renderApproachOutcomeHTML(outcomes) {
  const body = renderApproachOutcomeBody(outcomes);
  if (!body) return '';
  return ': ' + body;
}

/** Text line that duplicates a Lasts / Ongoing row (plain or legacy `<…>` before first `·`). */
function isOutcomeClusterLine(rawT) {
  const first = String(rawT || '')
    .trim()
    .split(/\s*·\s*/)[0]
    .trim();
  return (
    /^<\s*(?:Ongoing|Lasts)\b/i.test(first) ||
    /^(?:Ongoing|Lasts)\s+\d+/i.test(first)
  );
}

/** Legacy tool line: `- Fight -> Power 5` */
function legacyToolOutcomePlain(outcomes) {
  const s = String(outcomes || '').trim();
  const m = s.match(/^Power\s+(\d+)$/i);
  return m ? m[1] : s.replace(/^Power\s+/i, '').trim() || s;
}

/** '' | 'revealed' (Danger !) | 'close' (Close Danger !). Bare Danger counts as while revealed. */
function dangerPrint(text) {
  var s = String(text || '').replace(/\s+/g, ' ').trim();
  if (/while\s+close\s*[\u25b8\u25ba]\s*danger\b/i.test(s) || /^\s*close\s+danger\s*!?\s*$/i.test(s)) return 'close';
  if (/while\s+revealed\s*[\u25b8\u25ba]\s*danger\b/i.test(s) || /^\s*danger\s*!?\s*$/i.test(s)) return 'revealed';
  return '';
}

function isDangerLine(text) {
  return !!dangerPrint(text);
}

function keywordHoverHTML(label, tip) {
  var safeLabel = escapeHtml(label);
  var safeTip = escapeHtml(tip || label);
  return '<div class="card-text card-danger-mark kw-hover" data-tip="' + safeTip + '" aria-label="' + safeLabel + '">' +
    '<span class="danger-mark">' + safeLabel + '</span></div>';
}

/** Field line with a written explanation: show the keyword, keep the sentence for hover. */
function effectKeywordHoverFromLine(text) {
  var s = String(text || '').replace(/\s+/g, ' ').trim();
  if (!s || isDangerLine(s) || isMoveLine(s) || distanceExhaustAmount(s)) return '';
  var arrow = s.match(/^(.+?)\s*[\u25b8\u25ba]\s+([\s\S]+)$/);
  var head = arrow ? arrow[2].trim() : s;
  var ci = head.indexOf(':');
  if (ci <= 0) {
    if (head.length > 48) return keywordHoverHTML(head.split(/\s+/).slice(0, 2).join(' '), head);
    return '';
  }
  var keyword = head.slice(0, ci).trim();
  var tip = head.slice(ci + 1).trim();
  if (!keyword || !tip) return '';
  return keywordHoverHTML(keyword, tip);
}

function renderDangerMarkHTML(when) {
  var close = when === 'close';
  var label = close ? 'Close Danger !' : 'Danger !';
  var tip = close
    ? 'Locks rations, First Aid, switching tools, repack, and retreat only while this challenge is in Close.'
    : 'Locks rations, First Aid, switching tools, repack, and retreat while this challenge is revealed.';
  return keywordHoverHTML(label, tip);
}

/** On Reveal ▸ Charge — step one space toward Close if that space is empty. */
function isMoveLine(text) {
  var s = String(text || '').replace(/\s+/g, ' ').trim();
  return /\bon\s+reveal\b/i.test(s) && /\bcharge\b/i.test(s);
}

/** Prepare 1 > Exhaust N — after one overcome, Exhaust N (distance 1; a ranged tool prevents it). */
function distanceExhaustAmount(text) {
  var s = String(text || '').replace(/\s+/g, ' ').trim();
  var timed = /prepare\s*1/i.test(s) || /distance\s*1/i.test(s) || /after\s*1/i.test(s);
  if (!timed || !/exhaust/i.test(s)) return 0;
  var m = s.match(/exhaust\s*(\d+)/i);
  return m ? (parseInt(m[1], 10) || 1) : 1;
}

function renderMoveMarkHTML() {
  return keywordHoverHTML('Charge !', 'When revealed, if the space ahead is empty, charge 1 space forward.');
}

function renderDistanceMarkHTML(n) {
  return keywordHoverHTML(
    'Prepare 1 > Exhaust ' + n + ' !',
    'After you overcome one challenge, if this is at distance 1, Exhaust ' + n + '. Only a ranged tool prevents this.'
  );
}

/** Challenge approach bars stay icon-only; drop leftover prose (next-card taxes, path-long flags). */
function bypassAmountFromText(text) {
  var total = 0;
  var re = /(?:([+\u2212\-])\s*(\d+)\s*Bypass\b|\bBypass\s*([+\u2212\-])?\s*(\d+))/gi;
  String(text || '').replace(re, function(_, signA, nA, signB, nB) {
    var n = parseInt(nA || nB, 10) || 0;
    var sign = signA || signB || '+';
    total += (sign === '-' || sign === '\u2212') ? -n : n;
    return '';
  });
  return total;
}

function challengePrintedBypass(card) {
  var max = 0;
  ((card && card.content) || []).forEach(function(item) {
    if (!item || item.kind !== 'approach') return;
    var n = bypassAmountFromText(item.outcomes);
    if (n > max) max = n;
  });
  return max;
}

function stripBypassFromOutcomes(outcomes) {
  var raw = String(outcomes || '').trim();
  if (!raw) return '';
  return raw
    .split(/\s*\|\s*/)
    .map(function(chunk) {
      return String(chunk || '')
        .split(/\s*;\s*/)
        .map(function(bit) { return String(bit || '').trim(); })
        .filter(function(bit) {
          if (!bit) return false;
          if (/^[+\u2212\-]?\s*\d*\s*Bypass\b/i.test(bit)) return false;
          if (/^Bypass\s*[+\u2212\-]?\s*\d*$/i.test(bit)) return false;
          return true;
        })
        .join(' ; ');
    })
    .filter(Boolean)
    .join(' | ');
}

function challengeApproachOutcomesForDisplay(outcomes) {
  return approachOutcomesKeepIconTokens(stripBypassFromOutcomes(outcomes));
}

function approachOutcomesKeepIconTokens(outcomes) {
  var raw = String(outcomes || '').trim();
  if (!raw) return '';
  return raw
    .split(/\s*\|\s*/)
    .map(function (chunk) {
      return String(chunk || '')
        .split(/\s*;\s*/)
        .map(function (bit) {
          return String(bit || '').trim();
        })
        .filter(function (bit) {
          if (!bit) return false;
          if (/\bnext\b|\bgain[s]?\b|\bcosts\b|rest of this path|for the rest/i.test(bit)) return false;
          return true;
        })
        .join(' | ');
    })
    .filter(Boolean)
    .join(' | ');
}

function renderItem(item, isBottom, isTool) {
  if (isTool === undefined) isTool = false;
  if (item.kind === 'text' && isDangerLine(item.text)) {
    return renderDangerMarkHTML(dangerPrint(item.text));
  }
  if (item.kind === 'text' && isMoveLine(item.text)) {
    return renderMoveMarkHTML();
  }
  if (item.kind === 'text' && distanceExhaustAmount(item.text)) {
    return renderDistanceMarkHTML(distanceExhaustAmount(item.text));
  }
  if (!isTool && item.kind === 'text') {
    var keywordHover = effectKeywordHoverFromLine(item.text);
    if (keywordHover) return keywordHover;
  }
  if (item.kind === 'approach') {
    const pathPrefix =
      item.pathStepNumber != null
        ? `<span class="path-step-num">${escapeHtml(String(item.pathStepNumber))}.</span>`
        : '';
    const cond    = item.condition ? `<span class="approach-condition">(${item.condition})</span>` : '';
    let typeStr;
    if (item.flavorLabel && item.difficulty !== null && item.difficulty !== undefined) {
      const code = statLetterForApproachType(item.type);
      typeStr = `${item.flavorLabel} ${code}${item.difficulty}`;
    } else {
      typeStr = item.difficulty !== null ? `${item.type} ${item.difficulty}` : item.type;
    }
    const kindClass = approachKindClass(item.type);
    const typeCls = (isTool ? 'approach-type approach-type-tool ' : 'approach-type ') + kindClass;
    var outcomesBodyHtml = '';
    if (
      isTool &&
      (item.difficulty === null || item.difficulty === undefined) &&
      !item.noPower
    ) {
      outcomesBodyHtml = escapeHtml(legacyToolOutcomePlain(item.outcomes));
    } else if (item.emptyApproachColon && !String(item.outcomes || '').trim()) {
      outcomesBodyHtml = '';
    } else {
      outcomesBodyHtml = renderApproachOutcomeBody(item.outcomes);
    }
    const outcomeClass = 'approach-outcome';
    const useSplitIconBar =
      !(isTool && item.activation) &&
      (item.garbApproachRow ||
        (!!item.statChipOnly && item.difficulty !== null && item.difficulty !== undefined) ||
        (item.difficulty !== null &&
          item.difficulty !== undefined &&
          (item.flavorLabel ||
            (isTool && !item.activation && !item.noPower && item.type))));
    if (useSplitIconBar && !isTool && !item.garbApproachRow) {
      outcomesBodyHtml = renderApproachOutcomeBody(challengeApproachOutcomesForDisplay(item.outcomes));
    } else if (!isTool && !item.garbApproachRow) {
      outcomesBodyHtml = renderApproachOutcomeBody(stripBypassFromOutcomes(item.outcomes));
    }
    /* Chip parts, shared by the flavorless chip row and the split row below. */
    const chipNumStr =
      item.garbApproachRow || item.difficulty === null || item.difficulty === undefined
        ? ''
        : String(item.difficulty);
    const chipIconHTML = approachStatChipTagHTML(item.type);
    const chipNumHTML = chipNumStr
      ? `<span class="approach-stat-chip__num">${escapeHtml(chipNumStr)}</span>`
      : '';
    const chipSharedHTML =
      `<span class="approach-stat-chip${item.garbApproachRow ? ' approach-stat-chip--no-num' : ''}">` +
      chipIconHTML +
      chipNumHTML +
      `</span>`;
    let row;
    if (item.flavorless && !isTool && !item.garbApproachRow) {
      /* New challenge format: bare icon+number chip, no flavor name and no
         trailing outcome text — Detour-style effects live in the challenge's
         special effect text instead (see renderChallengeCard chip-line branch).
         Ally "3 Uses" markers still carry outcomes on their rows and keep them. */
      const chipEffectsHTML = outcomesBodyHtml
        ? `<span class="approach-icon-bar__effects ${outcomeClass}">${outcomesBodyHtml}</span>`
        : '';
      row = `<div class="approach-row approach-row--split approach-row--chip ${kindClass}${item.offApproach ? ' is-off-approach' : ''}">
      <span class="approach-icon-bar">${chipSharedHTML}${chipEffectsHTML}${cond}</span>
    </div>`;
    } else if (useSplitIconBar) {
      let flavorLabel = '';
      if (!item.statChipOnly) {
        flavorLabel =
          item.flavorLabel && String(item.flavorLabel).trim() !== ''
            ? item.flavorLabel
            : String(item.type || '');
      }
      const flavorHTML = flavorLabel
        ? `<span class="approach-flavor-label">${escapeHtml(flavorLabel)}</span>`
        : '';
      const effectsHTML = outcomesBodyHtml
        ? `<span class="approach-icon-bar__effects ${outcomeClass}">${outcomesBodyHtml}</span>`
        : '';
      const challengeIconByName = !isTool && !item.garbApproachRow;
      const challengeBar = effectsHTML + cond;
      row = challengeIconByName
        ? `<div class="approach-row approach-row--split ${kindClass}">
      <span class="approach-row__lead">${pathPrefix}${chipIconHTML}${chipNumHTML}${flavorHTML}</span>
      <span class="approach-icon-bar">${challengeBar}</span>
    </div>`
        : `<div class="approach-row approach-row--split ${kindClass}">
      <span class="approach-row__lead">${pathPrefix}${flavorHTML}</span>
      <span class="approach-icon-bar">${chipSharedHTML}${effectsHTML}${cond}</span>
    </div>`;
    } else {
      let approachLabelHTML;
      if (isTool && item.activation) {
        approachLabelHTML = `<span class="${typeCls}">${escapeHtml(item.activation)}<span class="kw-mid-dot--tool-approach"> · </span>${escapeHtml(typeStr)}</span>`;
      } else {
        approachLabelHTML = `<span class="${typeCls}">${escapeHtml(typeStr)}</span>`;
      }
      var outcomesBlock =
        outcomesBodyHtml !== ''
          /* NBSP binds label to first outcome segment (avoid break after “: ” that isn’t in cards.md). */
          ? `\u00A0<span class="approach-row__outcomes ${outcomeClass}">${outcomesBodyHtml}</span>`
          : '';
      const colonHtml = '<span class="approach-row__colon">:</span>';
      row = `<div class="approach-row ${kindClass}">
      <span class="approach-row__lead">${pathPrefix}${approachLabelHTML}${colonHtml}</span>${outcomesBlock}${cond}
    </div>`;
    }
    const subs = (item.subLines || [])
      .map(function (sl) {
        return `<div class="approach-sub"><div class="card-text card-text-sub">${formatTextLine(sl, true, isBottom)}</div></div>`;
      })
      .join('');
    return `<div class="approach-wrap">${row}${subs}</div>`;
  }
  if (item.kind === 'text' && isToolStatsLine(item.text)) {
    return renderToolStatsLineHTML(item.text);
  }
  const isSub = item.text.trimStart().startsWith('\u00b7');
  var cls   = isSub ? 'card-text card-text-sub' : 'card-text';
  const rawT = String(item.text || '').trim();
  if (!isSub && isOutcomeClusterLine(rawT)) {
    return `<div class="${cls}">${renderOutcomeClusterPartsHTML(rawT)}</div>`;
  }
  if (!isSub && rawT.indexOf(':') < 0 && /\s·\s/.test(rawT)) {
    const chunks = rawT.split(/\s*·\s*/).map(function (c) { return c.trim(); }).filter(Boolean);
    if (chunks.length >= 2) {
      const html = chunks.map(function (c) { return renderOutcomeSegmentHTML(c); }).join('<span class="kw-mid-dot">·</span>');
      return `<div class="${cls}">${html}</div>`;
    }
  }
  return `<div class="${cls}">${formatTextLine(item.text, isSub, isBottom)}</div>`;
}

/** Split challenge `content` on `---` rules; each band keeps author order (mix text + approaches).
 * `---` inside a paired `Tool>` … `Tool>` fence is `{ kind: 'rule', toolInner: true }` and does not start a new band. */
function splitChallengeIntoBands(card) {
  var c = (card && card.content) ? card.content : [];
  var bands = [];
  var cur = [];
  for (var i = 0; i < c.length; i++) {
    if (c[i].kind === 'rule' && c[i].toolInner) {
      cur.push({ item: c[i], idx: i });
    } else if (c[i].kind === 'rule') {
      bands.push(cur);
      cur = [];
    } else {
      cur.push({ item: c[i], idx: i });
    }
  }
  bands.push(cur);
  return bands.filter(function(b) {
    return b.length > 0;
  });
}

/** First matching open/close `toolFence` indices in band entry list (each entry `{ item, idx }`). */
function findToolFenceRange(entries) {
  var open = -1;
  for (var i = 0; i < entries.length; i++) {
    var it = entries[i].item;
    if (it.kind !== 'toolFence') continue;
    if (it.open) {
      open = i;
    } else if (open >= 0) {
      return { open: open, close: i };
    }
  }
  return null;
}

/** Consecutive approaches sorted; text lines; skips `toolFence`; inner `---` → brown rule inside tool box. */
function renderChallengeBandChunk(entries, asToolStrip) {
  if (asToolStrip === undefined) asToolStrip = false;
  var parts = [];
  var i = 0;
  while (i < entries.length) {
    var it = entries[i].item;
    if (it.kind === 'toolFence') {
      i++;
      continue;
    }
    if (it.kind === 'rule') {
      if (it.toolInner) {
        parts.push('<div class="card-challenge-tool-inner-divider" aria-hidden="true"></div>');
      }
      i++;
      continue;
    }
    if (it.kind === 'approach') {
      var run = [];
      while (i < entries.length && entries[i].item.kind === 'approach') {
        run.push(entries[i].item);
        i++;
      }
      var sorted = sortApproachesInChallengeTop(run);
      for (var j = 0; j < sorted.length; j++) {
        parts.push(renderItem(sorted[j], false, asToolStrip));
      }
    } else {
      parts.push(renderItem(it, true, asToolStrip));
      i++;
    }
  }
  return parts.join('');
}

/** Paired `Tool>` … `Tool>`: content between markers is wrapped in blue box (tool strip styling). */
function renderChallengeBandInner(entries) {
  var fr = findToolFenceRange(entries);
  if (fr) {
    var before = entries.slice(0, fr.open);
    var inside = entries.slice(fr.open + 1, fr.close);
    var after = entries.slice(fr.close + 1);
    return (
      renderChallengeBandChunk(before, false) +
      '<div class="card-challenge-tool-strip">' +
      renderChallengeBandChunk(inside, true) +
      '</div>' +
      renderChallengeBandChunk(after, false)
    );
  }
  return renderChallengeBandChunk(entries, false);
}

/** `Weight: 1, Spirit: 3` or writable `Weight: ___, Spirit: ___` (optional leftover `Uses` prefix is ignored). */
function isToolStatsLine(text) {
  var s = String(text || '').trim().replace(/^Uses\s*:?\s*(?:\d+|_+)\s*,?\s*/i, '');
  return /\bWeight\b/i.test(s) && (/\bSpirit\b/i.test(s) || /\bValue\b/i.test(s));
}

function parseToolStatsLine(text) {
  var s = String(text || '').trim();
  s = s.replace(/^Uses\s*:?\s*(?:\d+|_+)\s*,?\s*/i, '').trim();
  s = s.replace(/,\s*/g, ' · ');
  return { rest: s };
}

function renderToolStatsLineHTML(text) {
  var parsed = parseToolStatsLine(text);
  if (!parsed.rest) {
    return '<div class="card-text">' + formatTextLine(text, false, false) + '</div>';
  }
  return (
    '<div class="tool-stats-line">' +
    '<span class="tool-stats-rest">' + escapeHtml(parsed.rest) + '</span>' +
    '</div>'
  );
}

/** Garb / ability: unchanged band split (not tool 3-zone layout). */
function splitGarbAbilityZones(card) {
  const c = (card && card.content) ? card.content : [];
  const effectsTop = [];
  const middle = [];
  const effectsBottom = [];
  const firstApproachIdx = c.findIndex(function(i) { return i.kind === 'approach'; });
  let lastApproachIdx = -1;
  c.forEach(function(i, idx) {
    if (i.kind === 'approach') lastApproachIdx = idx;
  });
  const firstRuleIdx = c.findIndex(function(i) { return i.kind === 'rule' && !i.toolInner; });
  const middleStartIdx = firstRuleIdx >= 0 ? firstRuleIdx + 1 : 0;

  c.forEach(function(i, idx) {
    if (i.kind === 'rule') return;
    if (i.kind !== 'text' && i.kind !== 'approach') return;
    if (i.kind === 'text' && !String(i.text || '').trim()) return;

    if (firstApproachIdx < 0) {
      if (idx < middleStartIdx) effectsTop.push(i);
      else effectsBottom.push(i);
      return;
    }
    if (idx < middleStartIdx && i.kind === 'text') {
      effectsTop.push(i);
    } else if (idx >= middleStartIdx && idx <= lastApproachIdx) {
      middle.push({ item: i, idx: idx });
    } else if (idx > lastApproachIdx && i.kind === 'text') {
      effectsBottom.push(i);
    }
  });

  return { effectsTop: effectsTop, middle: middle, effectsBottom: effectsBottom };
}

/** Story, tool stats, or body-ability stats — top field only (not bottom). */
function isCardTopFieldLine(text) {
  return (
    isChallengeFlavorPreamble(text) ||
    isToolStatsLine(text) ||
    isAbilityStatsLine(text)
  );
}

/** Text lines after the approach `---` block, in cards.md order. */
function collectPostApproachBottomText(bands, approachBandIdx) {
  var out = [];
  for (var bi = approachBandIdx + 1; bi < bands.length; bi++) {
    bands[bi].forEach(function(entry) {
      if (entry.item.kind === 'text') out.push(entry.item);
    });
  }
  return out;
}

/** Tool cards: `---` stats+approaches `---` special effects; stats → top, approaches → middle, effects → bottom. */
function splitToolZones(card) {
  var bands = splitChallengeIntoBands(card);
  var effectsTop = [];
  var middle = [];
  var effectsBottom = [];
  var approachBandIdx = -1;

  for (var bi = 0; bi < bands.length; bi++) {
    if (bands[bi].some(function(e) { return e.item.kind === 'approach'; })) {
      approachBandIdx = bi;
    }
  }

  if (approachBandIdx >= 0) {
    for (var bi = 0; bi < approachBandIdx; bi++) {
      bands[bi].forEach(function(entry) {
        if (entry.item.kind === 'text' && isToolStatsLine(entry.item.text)) {
          effectsTop.push(entry.item);
        }
      });
    }
    bands[approachBandIdx].forEach(function(entry) {
      if (entry.item.kind === 'text' && isToolStatsLine(entry.item.text)) {
        effectsTop.push(entry.item);
      } else {
        middle.push(entry);
      }
    });
    effectsBottom = collectPostApproachBottomText(bands, approachBandIdx);
  } else {
    bands.forEach(function(band) {
      band.forEach(function(entry) {
        if (entry.item.kind === 'text') {
          if (isToolStatsLine(entry.item.text)) effectsTop.push(entry.item);
          else effectsBottom.push(entry.item);
        }
      });
    });
  }

  return { effectsTop: effectsTop, middle: middle, effectsBottom: effectsBottom };
}

var TOOL_STAT_TYPES = ['Fight', 'Craft', 'Traverse', 'Awareness'];

function toolStatTypeKey(type) {
  var n = normalizeApproachTypeName(type);
  if (n === 'Work') return 'Craft';
  return TOOL_STAT_TYPES.indexOf(n) >= 0 ? n : '';
}

function collectToolStatApproaches(middle) {
  var byType = {};
  var extraText = [];
  (middle || []).forEach(function (entry) {
    var it = entry && entry.item ? entry.item : entry;
    if (!it) return;
    if (it.kind === 'approach') {
      var key = toolStatTypeKey(it.type);
      if (key && !byType[key]) byType[key] = it;
      var out = String(it.outcomes || '').trim();
      if (out) extraText.push({ kind: 'text', text: out });
    } else if (it.kind === 'text' && String(it.text || '').trim()) {
      extraText.push(it);
    }
  });
  return { byType: byType, extraText: extraText };
}

function inferMissingToolPower(type, topItems) {
  var weight = null;
  (topItems || []).forEach(function (it) {
    var wm = String((it && it.text) || '').match(/Weight:\s*(\d+)/i);
    if (wm) weight = parseInt(wm[1], 10);
  });
  var light = weight != null && weight <= 1;
  if (type === 'Traverse') return light ? 3 : 2;
  return 2;
}

function completeToolStatMap(byType, topItems) {
  var out = {};
  TOOL_STAT_TYPES.forEach(function (type) {
    if (byType[type]) {
      out[type] = byType[type];
      return;
    }
    out[type] = {
      kind: 'approach',
      type: type,
      difficulty: inferMissingToolPower(type, topItems),
      outcomes: '',
      emptyApproachColon: true
    };
  });
  return out;
}

/** `Range 2-2 · Fight` binds that span to one approach. A bare `Range 2-2` is not bound. */
function parseToolRangeBinding(text) {
  var s = String(text || '').trim();
  var m = s.match(/^Range\s+(\d+\s*[-–]\s*\d+|\d+\s*\+)\s*(?:[·•]\s*([A-Za-z]+))?\s*$/i);
  if (!m) return null;
  var span = m[1].replace(/\s+/g, '').replace('–', '-');
  var word = String(m[2] || '').toLowerCase();
  var type = '';
  if (word === 'fight' || word === 'combat' || word === 'f') type = 'Fight';
  else if (word === 'craft' || word === 'work' || word === 'c') type = 'Craft';
  else if (word === 'traverse' || word === 't') type = 'Traverse';
  else if (word === 'awareness' || word === 'a') type = 'Awareness';
  return { span: span, type: type, label: 'Range ' + span };
}

function takeToolRangeBindings(items) {
  var byType = {};
  var rest = [];
  (items || []).forEach(function (it) {
    var parsed = parseToolRangeBinding(it && it.text);
    if (parsed && parsed.type && !byType[parsed.type]) byType[parsed.type] = parsed.span;
    else rest.push(it);
  });
  return { byType: byType, rest: rest };
}

function toolApproachRangeMap(card) {
  var map = {};
  ((card && card.content) || []).forEach(function (item) {
    var parsed = parseToolRangeBinding(item && (item.text || item.outcomes || ''));
    if (parsed && parsed.type && !map[parsed.type]) map[parsed.type] = parsed.span;
  });
  return map;
}

function toolApproachHasRange(card, kind) {
  var key = toolStatTypeKey(kind);
  if (!key) return false;
  return !!toolApproachRangeMap(card)[key];
}

function toolRangeMarkHTML(span) {
  var sym = typeof symbolForGlyphKeyword === 'function' ? symbolForGlyphKeyword('Range') : '';
  if (!sym) sym = '\uD83C\uDFF9';
  return (
    '<span class="tool-range-mark" title="' +
    escapeHtml('Range ' + span) +
    '">' +
    escapeHtml(sym) +
    '</span>'
  );
}

function renderToolStatChip(item, rangeSpan) {
  var kindClass = approachKindClass(item.type);
  var rangedFight = !!(rangeSpan && normalizeApproachTypeName(item.type) === 'Fight');
  var fightGlyph = '';
  if (rangedFight) {
    fightGlyph = (typeof symbolForGlyphKeyword === 'function' && symbolForGlyphKeyword('Range')) || '\uD83C\uDFF9';
  }
  var numStr =
    item.difficulty !== null && item.difficulty !== undefined
      ? String(item.difficulty).replace(/\s+/g, '')
      : '';
  var chipHTML =
    '<span class="approach-stat-chip">' +
    approachStatChipTagHTML(item.type, fightGlyph) +
    (numStr ? '<span class="approach-stat-chip__num">' + escapeHtml(numStr) + '</span>' : '') +
    '</span>';
  return (
    '<div class="approach-wrap">' +
      '<div class="approach-row approach-row--split approach-row--tool-line ' + kindClass + '">' +
        '<span class="approach-icon-bar">' +
          chipHTML +
          (rangeSpan && !rangedFight ? toolRangeMarkHTML(rangeSpan) : '') +
        '</span>' +
      '</div>' +
    '</div>'
  );
}

function renderToolApproachList(byType, rangeByType) {
  var chips = TOOL_STAT_TYPES.map(function (type) {
    return renderToolStatChip(byType[type], rangeByType && rangeByType[type]);
  }).join('');
  return '<div class="tool-approach-list">' + chips + '</div>';
}

function renderToolCardBody(zones, useStatRow) {
  var bodyInner = '';
  var extraBottom = [];
  var middleHtml = '';

  var rangeByType = {};
  if (useStatRow) {
    var collected = collectToolStatApproaches(zones.middle);
    var rangedExtra = takeToolRangeBindings(collected.extraText);
    var rangedBottom = takeToolRangeBindings(zones.effectsBottom);
    rangeByType = Object.assign({}, rangedBottom.byType, rangedExtra.byType);
    extraBottom = rangedExtra.rest;
    zones = {
      effectsTop: zones.effectsTop,
      middle: zones.middle,
      effectsBottom: rangedBottom.rest
    };
    middleHtml = renderToolApproachList(completeToolStatMap(collected.byType, zones.effectsTop), rangeByType);
  } else {
    middleHtml = zones.middle.length ? renderChallengeBandChunk(zones.middle, true) : '';
  }

  if (zones.effectsTop.length) {
    bodyInner +=
      '<div class="card-challenge-band card-tool-band--top">' +
      zones.effectsTop.map(function(i) { return renderItem(i, true); }).join('') +
      '</div>';
  }

  if (middleHtml) {
    bodyInner +=
      '<div class="card-challenge-band card-challenge-band--fill card-tool-band--middle">' +
      middleHtml +
      '</div>';
  } else if (zones.effectsTop.length && (zones.effectsBottom.length || extraBottom.length)) {
    bodyInner += '<div class="card-challenge-band card-challenge-band--fill card-tool-band--middle" aria-hidden="true"></div>';
  }

  var bottomItems = (zones.effectsBottom || []).concat(extraBottom);
  if (bottomItems.length) {
    bodyInner +=
      '<div class="card-challenge-band card-challenge-band--bottom">' +
      bottomItems.map(function(i) { return renderItem(i, true); }).join('') +
      '</div>';
  }

  return bodyInner;
}

/** Challenge / tool rows: Fight → Craft → Traverse → Awareness → Warm → Special (stable within same type). */
var APPROACH_ORDER = ['Fight', 'Craft', 'Traverse', 'Awareness', 'Warm', 'Special'];
function sortApproachesInChallengeTop(items) {
  if (!items || !items.length) return items;
  return items
    .map(function (item, i) { return { item: item, i: i }; })
    .sort(function (a, b) {
      var aPath = a.item.kind === 'approach' && a.item.pathStepNumber != null ? a.item.pathStepNumber : null;
      var bPath = b.item.kind === 'approach' && b.item.pathStepNumber != null ? b.item.pathStepNumber : null;
      if (aPath != null && bPath != null && aPath !== bPath) return aPath - bPath;
      if (aPath != null && bPath == null) return -1;
      if (aPath == null && bPath != null) return 1;
      var aAp = a.item.kind === 'approach';
      var bAp = b.item.kind === 'approach';
      if (aAp && bAp) {
        var ia = APPROACH_ORDER.indexOf(normalizeApproachTypeName(a.item.type));
        var ib = APPROACH_ORDER.indexOf(normalizeApproachTypeName(b.item.type));
        var ra = ia === -1 ? 999 : ia;
        var rb = ib === -1 ? 999 : ib;
        if (ra !== rb) return ra - rb;
        return a.i - b.i;
      }
      return a.i - b.i;
    })
    .map(function (x) { return x.item; });
}

/** `Uses 3, Staimina 12, Strength 21` — body ability stat line (Staimina/Stamina typo-tolerant). */
function isAbilityStatsLine(text) {
  var s = String(text || '').trim();
  if (!/^Uses\s+\d+/i.test(s)) return false;
  return /\bStrength\b/i.test(s);
}

/** Body abilities: stats before first `---` → top; approaches → middle; special effects after second `---` → bottom. */
function splitAbilityZones(card) {
  var bands = splitChallengeIntoBands(card);
  var effectsTop = [];
  var middle = [];
  var effectsBottom = [];
  var approachBandIdx = -1;

  for (var bi = 0; bi < bands.length; bi++) {
    if (bands[bi].some(function(e) { return e.item.kind === 'approach'; })) {
      approachBandIdx = bi;
    }
  }

  if (approachBandIdx >= 0) {
    for (var bi = 0; bi < approachBandIdx; bi++) {
      bands[bi].forEach(function(entry) {
        if (entry.item.kind === 'text' && isAbilityStatsLine(entry.item.text)) {
          effectsTop.push(entry.item);
        }
      });
    }
    bands[approachBandIdx].forEach(function(entry) {
      if (entry.item.kind === 'text' && isAbilityStatsLine(entry.item.text)) {
        effectsTop.push(entry.item);
      } else {
        middle.push(entry);
      }
    });
    effectsBottom = collectPostApproachBottomText(bands, approachBandIdx);
  } else {
    bands.forEach(function(band) {
      band.forEach(function(entry) {
        if (entry.item.kind === 'text') {
          if (isAbilityStatsLine(entry.item.text)) effectsTop.push(entry.item);
          else effectsBottom.push(entry.item);
        }
      });
    });
  }

  return { effectsTop: effectsTop, middle: middle, effectsBottom: effectsBottom };
}

/** Story / flavor preamble stays above approaches. */
function isChallengeFlavorPreamble(text) {
  return /^Story:/i.test(String(text || '').trim());
}

function isChallengeStackCard(card) {
  var t = String(card && card.type || '').toLowerCase();
  return t === 'challenge' || t === 'finding' || t === 'search' || !!(card && card.walkScene);
}

function walkSceneTokenHTML(card) {
  if (!card || !card.walkScene || card.hideToken) return '';
  return (
    '<div class="card-art-token">' +
    renderCharacterCard({
      name: card.tokenName || 'Mossfern',
      type: 'character',
      picture: 'CardPictures/Mossfern-token.png'
    }) +
    '</div>'
  );
}

function challengeArtNameHTML(card) {
  if (!card || card.walkScene) return '';
  return '<div class="card-art-name"><span class="card-name">' + escapeHtml(card.name) + '</span></div>';
}

function renderChallengeCard(card) {
  var bands = splitChallengeIntoBands(card);
  var approachBandIdx = -1;
  for (var bi = 0; bi < bands.length; bi++) {
    if (bands[bi].some(function(e) { return e.item.kind === 'approach'; })) {
      approachBandIdx = bi;
    }
  }

  var bodyInner = '';

  if (approachBandIdx >= 0) {
    var approachEntries = [];
    var extraEntries = [];
    for (var bi = 0; bi < bands.length; bi++) {
      bands[bi].forEach(function(entry) {
        var kind = entry && entry.item ? entry.item.kind : '';
        if (kind === 'approach') approachEntries.push(entry);
        else if (kind && kind !== 'rule') extraEntries.push(entry);
      });
    }

    /* New format: flavorless `- [F] 5 :` rows render as ONE horizontal line
       of all four approach chips under the name. Missing approaches were
       already baked into the data by bakeChallengeApproachFallbacks
       (maxListed + 2, offApproach: true) so simulator + TTS see the same
       numbers — this branch only fills in if it somehow missed (idempotent). */
    var flavorlessRows = approachEntries.filter(function(e) { return e.item && e.item.flavorless; });
    if (flavorlessRows.length && flavorlessRows.length === approachEntries.length) {
      var listed = {};
      flavorlessRows.forEach(function(e) {
        var key = toolStatTypeKey(e.item.type);
        if (key && !listed[key]) listed[key] = e.item;
      });
      var maxListed = 0;
      Object.keys(listed).forEach(function(k) {
        var d = parseInt(approachPowerOf(listed[k]), 10);
        if (isFinite(d) && d > maxListed) maxListed = d;
      });
      var chipBand = '';
      TOOL_STAT_TYPES.forEach(function(type) {
        var it = listed[type];
        if (!it) {
          it = {
            kind: 'approach',
            type: type,
            difficulty: maxListed + 2,
            outcomes: '',
            flavorless: true,
            offApproach: true
          };
        }
        chipBand += renderItem(it, false, false);
      });
      bodyInner +=
        '<div class="card-challenge-band card-challenge-band--fill card-challenge-band--middle card-approach-chip-line">' +
        chipBand +
        '</div>';
      /* Field effects and special text (Danger !, Charge !, Detour, Recover…)
         still print — below the chip line. */
      var chipBottomHtml = extraEntries.length ? renderChallengeBandInner(extraEntries) : '';
      if (chipBottomHtml) {
        bodyInner +=
          '<div class="card-challenge-band card-challenge-band--bottom">' +
          chipBottomHtml +
          '</div>';
      }
    } else {
    var middleHtml = renderChallengeBandInner(approachEntries);
    if (middleHtml) {
      bodyInner +=
        '<div class="card-challenge-band card-challenge-band--fill card-challenge-band--middle">' +
        middleHtml +
        '</div>';
    }

    var bottomHtml = extraEntries.length ? renderChallengeBandInner(extraEntries) : '';
    if (bottomHtml) {
      bodyInner +=
        '<div class="card-challenge-band card-challenge-band--bottom">' +
        bottomHtml +
        '</div>';
    }
    }
  } else {
    var rendered = [];
    for (var bi = 0; bi < bands.length; bi++) {
      var inner = renderChallengeBandInner(bands[bi]);
      if (inner) rendered.push({ html: inner, entries: bands[bi] });
    }
    var n = rendered.length;
    var fillIdx = n - 1;
    for (var ri = 0; ri < n; ri++) {
      var hasApproach = rendered[ri].entries.some(function(e) { return e.item.kind === 'approach'; });
      if (hasApproach) fillIdx = ri;
    }
    var bottomIdx = fillIdx < n - 1 ? n - 1 : -1;
    for (var ri = 0; ri < n; ri++) {
      var cls = 'card-challenge-band';
      if (ri === fillIdx) cls += ' card-challenge-band--fill';
      if (ri === bottomIdx) cls += ' card-challenge-band--bottom';
      bodyInner += '<div class="' + cls + '">' + rendered[ri].html + '</div>';
    }
  }

  var faceType = card.type || 'challenge';
  if (isChallengeStackCard(card)) {
    /* Card type tag (Animal / Terrain / Finding …) sits directly under the
       challenge name, before the approach chip line and effect bands. */
    var typeHtml = card.subtitle
      ? '<div class="card-stack-type">' + escapeHtml(card.subtitle) + '</div>'
      : '';
    return `<div class="card card-challenge-stack${card.walkScene ? ' card-walk-scene' : ''}" data-type="${faceType}" data-card-name="${escapeHtml(card.name)}"${cardFaceDataAttrs(card)}>
      <div class="card-art">
        <div class="card-art-pic" aria-hidden="true"></div>
        ${challengeArtNameHTML(card)}
        ${walkSceneTokenHTML(card)}
      </div>
      <div class="card-effect-box">
        ${typeHtml}
        <div class="card-body card-stack-body">
          ${bodyInner}
        </div>
      </div>
    </div>`;
  }
  return `<div class="card" data-type="${faceType}" data-card-name="${escapeHtml(card.name)}"${cardFaceDataAttrs(card)}>
    ${banner(card.name, faceType, card.subtitle)}
    <div class="card-body">
      ${bodyInner}
      ${sigilSVG}
    </div>
  </div>`;
}

function forestZoneName(card) {
  var z = card && card.zoneName ? String(card.zoneName).trim() : '';
  if (z) return z;
  var a = String(card && card.faceArt || '').toLowerCase();
  if (a === 'dungeon' || a === 'dark' || a === 'castle') return 'Ruined Castle';
  return 'Old Forest';
}

function renderForestCardBack(card) {
  var zone = forestZoneName(card);
  var style = isArtFaceStyle(card && card.faceArt) ? String(card.faceArt).toLowerCase() : 'forest';
  var back = {
    picture: card && card.picture,
    faceArt: style
  };
  if (isChallengeStackCard(card)) {
    return (
      '<div class="card card-forest-back card-challenge-stack" data-type="challenge" data-card-name="' +
      escapeHtml(zone) +
      '" data-card-back="1"' +
      cardFaceDataAttrs(back) +
      '>' +
        '<div class="card-art">' +
          '<div class="card-art-pic" aria-hidden="true"></div>' +
        '</div>' +
        '<div class="card-effect-box">' +
          '<div class="card-body card-stack-body"></div>' +
          '<div class="card-stack-type">challenge</div>' +
        '</div>' +
      '</div>'
    );
  }
  return (
    '<div class="card card-forest-back" data-type="challenge" data-card-name="' +
    escapeHtml(zone) +
    '" data-card-back="1"' +
    cardFaceDataAttrs(back) +
    '>' +
      banner(zone, 'zone') +
      '<div class="card-body"></div>' +
    '</div>'
  );
}

function renderCharacterCard(card) {
  return (
    '<div class="card card-character" data-type="character" data-card-name="' +
    escapeHtml(card.name) +
    '"' +
    cardFaceDataAttrs(card) +
    '>' +
      '<div class="character-art" aria-hidden="true"></div>' +
    '</div>'
  );
}

function renderWritableToolCard(card) {
  var zones = splitToolZones(card);
  return `<div class="card card-writable-tool" data-type="writable-tool" data-card-name="${escapeHtml(card.name)}">
    <div class="card-top">
      <div class="card-banner banner-blank">
        <div class="card-scroll-strip">
          <span class="card-name writable-banner-empty"> </span>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-effect-box card-tool-effect">
        ${renderToolCardBody(zones, true)}
        <div class="card-stack-type">${escapeHtml(card.name || '')}</div>
      </div>
      ${sigilSVG}
    </div>
  </div>`;
}

function renderToolCard(card) {
  const faceType =
    card.type === 'ability' ? 'ability' : card.type === 'garb' ? 'garb' : 'tool';

  if (card.type === 'tool' || card.type === 'ability') {
    const zones =
      card.type === 'tool' ? splitToolZones(card) : splitAbilityZones(card);
    const bodyInner = renderToolCardBody(zones, card.type === 'tool');
    if (card.type === 'tool') {
      var typeHtml = '<div class="card-stack-type">Tool</div>';
      return `<div class="card card-tool-face" data-type="tool" data-card-name="${escapeHtml(card.name)}">
        <div class="card-body">
          <div class="card-effect-box card-tool-effect">
            <div class="card-tool-name"><span class="card-name">${escapeHtml(card.name || '')}</span></div>
            ${bodyInner}
            ${typeHtml}
          </div>
          ${sigilSVG}
        </div>
      </div>`;
    }
    return `<div class="card" data-type="${faceType}" data-card-name="${escapeHtml(card.name)}">
      ${banner(card.name, faceType, card.subtitle)}
      <div class="card-body">
        ${bodyInner}
        ${sigilSVG}
      </div>
    </div>`;
  }

  const zones = splitGarbAbilityZones(card);
  let bodyInner = '';
  if (zones.effectsTop.length) {
    bodyInner += `<div class="card-challenge-band">${zones.effectsTop.map(i => renderItem(i, true)).join('')}</div>`;
  }
  const approachesFill = !zones.effectsBottom.length;
  const approachesCls = 'card-challenge-band' + (approachesFill ? ' card-challenge-band--fill' : '');
  const middleHtml = zones.middle.length ? renderChallengeBandChunk(zones.middle, true) : '';
  if (middleHtml) {
    bodyInner += `<div class="${approachesCls}">${middleHtml}</div>`;
  }
  if (zones.effectsBottom.length) {
    bodyInner += `<div class="card-challenge-band card-challenge-band--bottom">${zones.effectsBottom.map(i => renderItem(i, true)).join('')}</div>`;
  }
  return `<div class="card" data-type="${faceType}" data-card-name="${escapeHtml(card.name)}">
    ${banner(card.name, faceType, card.subtitle)}
    <div class="card-body">
      ${bodyInner}
      ${sigilSVG}
    </div>
  </div>`;
}

/** Printable template only — no title line, body text, or sigil. */
function boldifyReferenceLine(s) {
  return escapeHtml(String(s || '')).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** Emoji before the title on resource tracker cards — pulls from cards.md [symbols] when possible. */
function referenceBannerIcon(card) {
  var name = String((card && card.name) || '').toLowerCase();
  var map = mergedEffectSymbolMap();
  function lookupSymbol(keyword) {
    var v = map[normalizeEffectSymbolKey(keyword)];
    return v != null && String(v).trim() !== '' ? String(v).trim() : '';
  }
  var keywordForCard = {
    stamina: 'recover',
    exhaustion: 'exhaustion',
    wounds: 'wounds',
    rations: 'rations',
    materials: 'materials',
    'tools & tressures': 'tools'
  };
  if (keywordForCard[name]) {
    var fromMap = lookupSymbol(keywordForCard[name]);
    if (fromMap) return fromMap;
  }
  var fallbacks = { strength: '💪', heal: '✚' };
  return fallbacks[name] || '';
}

/** Resource reference cards share grey by default; vitality / strength-track get distinct banners. */
function referenceBannerType(card) {
  var id = String((card && card.id) || '');
  var name = String((card && card.name) || '').toLowerCase();
  if (id === 'REF_STAMINA' || (id === 'REF_EXHAUSTION' && name === 'exhaustion')) return 'vitality';
  if (id === 'REF_STRENGTH' || id === 'REF_WOUNDS' || id === 'REF_RATIONS' || id === 'REF_MATERIALS') return 'strength';
  if (name === 'heal') return 'strength';
  return 'reference';
}

function renderReferenceCard(card) {
  var parts = [];
  (card.content || []).forEach(function(item) {
    if (item.kind === 'text') {
      parts.push('<div class="ref-line">' + boldifyReferenceLine(item.text) + '</div>');
    } else if (item.kind === 'rule') {
      parts.push('<hr class="ref-sep" />');
    }
  });
  var bannerType = referenceBannerType(card);
  return `<div class="card card-reference" data-type="reference" data-card-id="${escapeHtml(card.id || '')}">
    ${banner(card.name, bannerType, null, referenceBannerIcon(card))}
    <div class="card-body">
      <div class="card-challenge-band card-challenge-band--fill card-challenge-band--reference">
        <div class="card-reference-scroll">${parts.join('')}</div>
      </div>
    </div>
  </div>`;
}

function renderPlayAidCard(card) {
  if (typeof GarbBoard !== 'undefined' && GarbBoard.playAidHtml) return GarbBoard.playAidHtml(card);
  var src = card && card.picture ? card.picture : '';
  return `<div class="card garb-playaid" data-type="playaid" data-card-name="${escapeHtml(card.name || '')}">
    ${src ? '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(card.name || '') + '" style="width:100%;height:100%;object-fit:contain">' : ''}
  </div>`;
}

function renderBlankCard() {
  return `<div class="card card-blank" data-type="blank">
    <div class="card-top">
      <div class="card-banner banner-blank">
        <div class="card-scroll-strip">
          <span class="card-name"> </span>
        </div>
      </div>
    </div>
    <div class="card-body card-body-blank"></div>
  </div>`;
}

var cardPreviewBackdropEl = null;

function getCardPreviewBackdrop() {
  if (cardPreviewBackdropEl) return cardPreviewBackdropEl;
  cardPreviewBackdropEl = document.createElement('div');
  cardPreviewBackdropEl.className = 'card-preview-backdrop';
  cardPreviewBackdropEl.setAttribute('aria-hidden', 'true');
  cardPreviewBackdropEl.addEventListener('click', function() {
    clearCardPreviewZoom();
  });
  document.body.appendChild(cardPreviewBackdropEl);
  return cardPreviewBackdropEl;
}

function showCardPreviewBackdrop() {
  getCardPreviewBackdrop().classList.add('is-visible');
}

function hideCardPreviewBackdrop() {
  if (cardPreviewBackdropEl) cardPreviewBackdropEl.classList.remove('is-visible');
}

/** Remove preview without animating back through .card's transform transition. */
function stripPreviewInstant(nodes) {
  var list = Array.prototype.slice.call(nodes.length !== undefined ? nodes : [nodes]).filter(function(c) {
    return c && c.classList.contains('card--preview-active');
  });
  if (!list.length) return;
  list.forEach(function(c) {
    c.style.setProperty('transition', 'none');
    c.classList.remove('card--preview-active');
  });
  requestAnimationFrame(function() {
    list.forEach(function(c) {
      c.style.removeProperty('transition');
    });
  });
}

/** Enter preview without .card's transform transition easing into enlarged state. */
function activatePreviewInstant(card) {
  card.style.setProperty('transition', 'none');
  card.classList.add('card--preview-active');
  requestAnimationFrame(function() {
    card.style.removeProperty('transition');
  });
}

function clearCardPreviewZoom() {
  stripPreviewInstant(document.querySelectorAll('.card.card--preview-active'));
  hideCardPreviewBackdrop();
}

/** Click to enlarge (centered); click same card again or backdrop to close. Escape closes. */
function attachCardPreviewListeners() {
  getCardPreviewBackdrop();
  if (!window.__cardPreviewEscapeBound) {
    window.__cardPreviewEscapeBound = true;
    document.addEventListener('keydown', function(ev) {
      if (ev.key === 'Escape') clearCardPreviewZoom();
    });
  }
  var grid = document.getElementById('card-grid');
  if (!grid) return;
  grid.querySelectorAll('.card:not(.card-character)').forEach(function(card) {
    card.addEventListener('click', function(ev) {
      ev.stopPropagation();
      if (card.classList.contains('card--preview-active')) {
        clearCardPreviewZoom();
        return;
      }
      var others = Array.prototype.slice.call(grid.querySelectorAll('.card.card--preview-active')).filter(function(c) {
        return c !== card;
      });
      stripPreviewInstant(others);
      showCardPreviewBackdrop();
      activatePreviewInstant(card);
    });
  });
}

/** Drag character standees over landscape cards (transparent halo composites in place). */
function bindCharacterTokenDrag(root) {
  var scope = root || document;
  scope.querySelectorAll('.card.card-character').forEach(function(el) {
    el.addEventListener('pointerdown', function(ev) {
      if (ev.button !== 0) return;
      ev.preventDefault();
      ev.stopPropagation();
      var startX = ev.clientX;
      var startY = ev.clientY;
      var origLeft = parseFloat(el.style.left) || 0;
      var origTop = parseFloat(el.style.top) || 0;
      el.style.position = 'relative';
      el.classList.add('card-character--dragging');
      try { el.setPointerCapture(ev.pointerId); } catch (err) {}
      function move(e) {
        el.style.left = origLeft + (e.clientX - startX) + 'px';
        el.style.top = origTop + (e.clientY - startY) + 'px';
      }
      function up() {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        el.classList.remove('card-character--dragging');
      }
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  });
}

/** Optional backgrounds: `CardPictures/<exact card name>.png` (try .png, .jpg, …). */
var CARD_PICTURES_BASE = 'CardPictures';
var CARD_PICTURE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

function applyCardPictureBackgrounds(root) {
  var scope = root || document;
  function paint(targetEl, card, artClass) {
    targetEl.classList.remove(artClass);
    targetEl.style.removeProperty('--card-art-url');
    targetEl.style.removeProperty('--character-mat-color');
    if (!card) return;
    var name = card.getAttribute('data-card-name');
    var picture = card.getAttribute('data-card-picture');
    var faceArt = String(card.getAttribute('data-face-art') || '').toLowerCase();
    if ((faceArt === 'forest' || faceArt === 'dark' || faceArt === 'dungeon' || faceArt === 'castle') && !picture) {
      picture = faceArt === 'forest'
        ? FOREST_FACE_PICTURE
        : (faceArt === 'castle' ? CASTLE_FACE_PICTURE : DUNGEON_FACE_PICTURE);
    }
    function applyUrl(url) {
      targetEl.style.setProperty('--card-art-url', 'url(' + JSON.stringify(url) + ')');
      targetEl.classList.add(artClass);
    }
    function tryByCardName() {
      if (!name || !String(name).trim()) return;
      var base = CARD_PICTURES_BASE.replace(/\/?$/, '/') + encodeURIComponent(name) + '.';
      var extIdx = 0;
      function tryNextExt() {
        if (extIdx >= CARD_PICTURE_EXTENSIONS.length) return;
        var url = base + CARD_PICTURE_EXTENSIONS[extIdx];
        var img = new Image();
        img.onload = function() { applyUrl(url); };
        img.onerror = function() {
          extIdx++;
          tryNextExt();
        };
        img.src = url;
      }
      tryNextExt();
    }
    if (picture && String(picture).trim()) {
      var direct = resolveCardPictureUrl(picture);
      var imgDirect = new Image();
      imgDirect.onload = function() { applyUrl(direct); };
      imgDirect.onerror = function() { tryByCardName(); };
      imgDirect.src = direct;
      return;
    }
    tryByCardName();
  }
  scope.querySelectorAll('.card.card-challenge-stack[data-card-name]').forEach(function(card) {
    paint(card, card, 'card--has-stack-art');
  });
  scope.querySelectorAll('.card[data-card-name] .card-body').forEach(function(body) {
    var cardEl = body.closest('.card');
    if (cardEl && cardEl.classList.contains('card-challenge-stack')) return;
    if (cardEl && isArtFaceStyle(cardEl.getAttribute('data-face-art'))) return;
    paint(body, cardEl, 'card-body--has-art');
  });
  scope.querySelectorAll('.card[data-face-art][data-card-name]').forEach(function(card) {
    if (card.classList.contains('card-challenge-stack')) return;
    if (!isArtFaceStyle(card.getAttribute('data-face-art'))) return;
    paint(card, card, 'card--has-face-art');
  });
  scope.querySelectorAll('.card.card-character[data-card-name]').forEach(function(card) {
    paint(card, card, 'card--has-portrait-art');
  });
}

function buildGrid(data) {
  const grid = document.getElementById('card-grid');
  let html = '';

  data.decks.forEach(deck => {
    // Paired discovery backs are only for Search/Discovery flip — hide from the print grid
    // so browsing the sheet does not spoil Find rewards.
    var cards = (deck.cards || []).filter(function(card) {
      return !(card.type === 'discovery' && card.pairedSearch);
    });
    if (!cards.length) return;
    html += `<div class="section-label" data-type="${deck.type}">— ${deck.name} —</div>`;
    cards.forEach(card => {
      // Challenge / ally: band layout. Tool / ability / garb: preamble + approach strip.
      // Reference keeps its rule-list layout.
      if (card.type === 'playaid') html += renderPlayAidCard(card);
      else if (typeof GarbBoard !== 'undefined' && GarbBoard.isGarbPiece && GarbBoard.isGarbPiece(card) && GarbBoard.pieceHtml) html += GarbBoard.pieceHtml(card);
      else if (card.type === 'reference') html += renderReferenceCard(card);
      else if (card.type === 'writable-tool') html += renderWritableToolCard(card);
      else if (card.type === 'character') html += renderCharacterCard(card);
      else if (card.type === 'tool' || card.type === 'ability' || card.type === 'garb') html += renderToolCard(card);
      else html += renderChallengeCard(card);
      if (isArtFaceStyle(card.faceArt)) html += renderForestCardBack(card);
    });
  });

  html += '<div class="section-label" data-type="blank">— Blank cards —</div>';
  for (let i = 0; i < 9; i++) html += renderBlankCard();

  grid.innerHTML = html;
  applyCardPictureBackgrounds(grid);
  fitAllReferenceCards(grid);
  attachCardPreviewListeners();
  bindCharacterTokenDrag(grid);
  var syncBtn = document.querySelector('.filter-bar .filter-btn.active');
  if (syncBtn && syncBtn.dataset.filter) filter(syncBtn.dataset.filter, syncBtn);
}

/**
 * Grow reference card text to fill the available band height.
 * Binary-searches for the largest font-size (rem) where the content
 * still fits without overflowing. The search range is generous (3× the
 * proportional headroom, capped at 5 rem) so sparse cards can grow large
 * while cards with wrapping content are naturally capped by overflow.
 */
function fitReferenceCardText(containerEl) {
  var scroll = containerEl.querySelector('.card-reference-scroll');
  var band   = containerEl.querySelector('.card-challenge-band--reference');
  if (!scroll || !band) return;

  scroll.style.fontSize = '';

  var availH = band.clientHeight;
  if (availH < 10) return;

  var prevOverflow = band.style.overflowY;
  band.style.overflowY = 'hidden';

  var baseH = scroll.scrollHeight;
  if (baseH <= 0 || baseH >= availH) {
    band.style.overflowY = prevOverflow;
    return;
  }

  /* Wide range: 3× headroom so short/simple cards can grow large. */
  var lo = 0.78;
  var hi = Math.min(5.0, 0.78 * (availH / baseH) * 3.0);
  for (var i = 0; i < 16; i++) {
    var mid = (lo + hi) / 2;
    scroll.style.fontSize = mid + 'rem';
    if (scroll.scrollHeight <= availH) lo = mid;
    else hi = mid;
  }
  scroll.style.fontSize = (Math.floor(lo * 100) / 100) + 'rem';
  band.style.overflowY = prevOverflow;
}

/** Run fitReferenceCardText on every reference card inside a root element.
 *  Uses rAF so layout is fully computed before we measure. */
function fitAllReferenceCards(root) {
  requestAnimationFrame(function() {
    (root || document).querySelectorAll('.card-reference').forEach(function(c) {
      fitReferenceCardText(c);
    });
  });
}

function filter(type, btn) {
  clearCardPreviewZoom();
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const typeNorm = String(type || '').toLowerCase();
  const deckTypesInAll = new Set(['challenge', 'zone', 'finding', 'search', 'discovery', 'tool', 'garb', 'ability', 'reference', 'ally', 'writable-tool', 'playaid', 'character']);
  document.querySelectorAll('.card').forEach(card => {
    const cardType = String(card.dataset.type || '').toLowerCase();
    let hide;
    if (typeNorm === 'blank') hide = cardType !== 'blank';
    else if (typeNorm === 'all') hide = cardType === 'blank';
    else if (typeNorm === 'challenge') hide = cardType !== 'challenge' && cardType !== 'finding';
    else hide = cardType !== typeNorm;
    card.classList.toggle('hidden', hide);
  });

  document.querySelectorAll('.section-label').forEach(label => {
    const lt = String(label.dataset.type || '').toLowerCase();
    let show;
    if (typeNorm === 'blank') show = lt === 'blank';
    else if (typeNorm === 'all') show = deckTypesInAll.has(lt);
    else show = lt === typeNorm;
    label.style.display = show ? '' : 'none';
  });
}

// ── DEFINITIONS (card-definitions.md:  KEY | text after colon on card) ─────────
// KEY may use whole-word X, Y, Z as number placeholders; card line supplies digits.

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildTemplateRule(key, template) {
  var reTok = /\b([XYZ])\b/g;
  var last = 0;
  var pieces = [];
  var letters = [];
  var m;
  while ((m = reTok.exec(key)) !== null) {
    pieces.push(escapeRegex(key.slice(last, m.index)));
    pieces.push('(\\d+)');
    letters.push(m[1]);
    last = m.index + m[0].length;
  }
  pieces.push(escapeRegex(key.slice(last)));
  try {
    return { regex: new RegExp('^' + pieces.join('') + '$'), letters: letters, template: template };
  } catch (e) {
    return null;
  }
}

function substituteTemplate(template, letters, captures) {
  var val = { X: '', Y: '', Z: '' };
  for (var i = 0; i < letters.length; i++) {
    if (letters[i] === 'X') val.X = captures[i] || '';
    else if (letters[i] === 'Y') val.Y = captures[i] || '';
    else if (letters[i] === 'Z') val.Z = captures[i] || '';
  }
  return template
    .replace(/\bX\b/g, val.X)
    .replace(/\bY\b/g, val.Y)
    .replace(/\bZ\b/g, val.Z);
}

/** Strip outer **markdown bold** from definition keys (editorial only; cards.md uses plain keywords). */
function stripDefKeyword(k) {
  var s = String(k || '').trim();
  var m = s.match(/^\*\*([\s\S]*?)\*\*$/);
  return m ? m[1].trim() : s;
}

function parseEffectLine(key, val, exact, templateRules) {
  key = stripDefKeyword(key);
  if (!key) return;
  if (/\b[XYZ]\b/.test(key)) {
    var rule = buildTemplateRule(key, val);
    if (rule) templateRules.push(rule);
  } else {
    exact[key] = val;
  }
}

/** Sections: ## Activation Keywords · ## Universal Effects (rulebook/sync only, not outcome gloss) · ## Effects (viewer outcome gloss + card text). Legacy: no ## Effects → parse all | lines as effect keys. */
function parseDefinitions(text) {
  var activations = [];
  var effectExact = {};
  var effectTemplateRules = [];
  if (!text) {
    return { activations: activations, effectExact: effectExact, effectTemplateRules: effectTemplateRules };
  }

  var hasEffectsSection = /^##\s+Effects\b/im.test(text);
  var mode = 'none';

  text.split('\n').forEach(function(line) {
    var t = line.trim();
    if (/^##\s+Activation\s+Keywords\b/i.test(t)) {
      mode = 'act';
      return;
    }
    if (/^##\s+Universal\s+Effects\b/i.test(t)) {
      mode = 'uni';
      return;
    }
    if (/^##\s+Effects\b/i.test(t)) {
      mode = 'eff';
      return;
    }
    if (/^##\s+/m.test(t)) {
      if (mode === 'eff' && /^##\s+(Tools|Mixed|Challenges)\b/i.test(t)) {
        return;
      }
      mode = 'none';
      return;
    }

    if (mode === 'uni') {
      return;
    }

    if (mode === 'act') {
      if (!t || t === '---' || t.startsWith('#')) return;
      t = t.replace(/^[-*]\s+/, '').trim();
      if (!t) return;
      var bar = t.indexOf('|');
      if (bar >= 0) t = t.slice(0, bar).trim();
      t = stripDefKeyword(t);
      if (t) activations.push(t);
      return;
    }

    if (mode === 'eff') {
      if (!t || t === '---' || t.startsWith('#')) return;
      var sep = t.indexOf('|');
      if (sep < 0) return;
      var key = stripDefKeyword(t.slice(0, sep).trim());
      var val = t.slice(sep + 1).trim();
      parseEffectLine(key, val, effectExact, effectTemplateRules);
    }
  });

  if (!hasEffectsSection) {
    text.split('\n').forEach(function(line) {
      var t = line.trim();
      if (!t || t.startsWith('#') || t === '---') return;
      var sep = t.indexOf('|');
      if (sep < 0) return;
      var key = stripDefKeyword(t.slice(0, sep).trim());
      var val = t.slice(sep + 1).trim();
      if (!key) return;
      parseEffectLine(key, val, effectExact, effectTemplateRules);
    });
  }

  activations.sort(function(a, b) { return b.length - a.length; });
  var seen = {};
  activations = activations.filter(function(a) {
    if (seen[a]) return false;
    seen[a] = true;
    return true;
  });

  return {
    activations: activations,
    effectExact: effectExact,
    effectTemplateRules: effectTemplateRules
  };
}

function matchEffectPhrase(rest, defs) {
  if (!defs) return null;
  var r0 = String(rest || '').trim();
  var candidates = [r0];
  var splitCamel = normalizeCamelCaseWords(r0);
  if (splitCamel !== r0) candidates.push(splitCamel);
  var ci;
  for (ci = 0; ci < candidates.length; ci++) {
    var r = candidates[ci];
    if (defs.effectExact && defs.effectExact[r]) return defs.effectExact[r];
    if (defs.effectTemplateRules) {
      for (var i = 0; i < defs.effectTemplateRules.length; i++) {
        var rule = defs.effectTemplateRules[i];
        var match = r.match(rule.regex);
        if (match) {
          var caps = match.slice(1);
          return substituteTemplate(rule.template, rule.letters, caps);
        }
      }
    }
  }
  return null;
}

/** Hide editorial *(Tool)* / *(Challenge)* / *(Mixed)* tags from printed cards (they stay in definitions for the rulebook). */
function stripEffectKindMarker(s) {
  return String(s || '').replace(/^\*\([^)]+\)\*\s*/g, '').trim();
}

function expandPhrase(phrase, defs) {
  if (!defs || phrase === undefined || phrase === null) return phrase;
  var p = String(phrase).trim();
  if (!p || p.indexOf(':') >= 0) return phrase;

  var body = matchEffectPhrase(p, defs);
  if (body) return p + ' : ' + stripEffectKindMarker(body);

  var acts = defs.activations || [];
  for (var ai = 0; ai < acts.length; ai++) {
    var prefix = acts[ai] + ' · ';
    if (p.startsWith(prefix)) {
      var rest = p.slice(prefix.length).trim();
      body = matchEffectPhrase(rest, defs);
      if (body) return p + ' : ' + stripEffectKindMarker(body);
    }
  }

  return phrase;
}

/** Apply card-definitions gloss to each outcome token; ` | ` splits separate outcomes, ` · ` binds clusters; `\n` kept between lines. */
function expandOutcomeString(outcomes, defs) {
  if (!defs || outcomes === undefined || outcomes === null) return outcomes;
  return String(outcomes)
    .split(/\r?\n/)
    .map(function (outLine) {
      return String(outLine || '')
        .split(/\s*\|\s*/)
        .map(function(pipeTok) {
          return pipeTok
            .split(/\s*·\s*/)
            .map(function(tok) {
              var t = String(tok || '').trim();
              if (!t) return t;
              if (/\n/.test(t)) {
                return t
                  .split(/\n+/)
                  .map(function(line) {
                    var u = String(line || '').trim();
                    if (!u) return u;
                    var am2 = u.match(/^<([^>]+)>$/);
                    if (am2) {
                      var inner2 = am2[1].trim();
                      var exp2 = expandPhrase(inner2, defs);
                      return '<' + exp2 + '>';
                    }
                    return expandPhrase(u, defs);
                  })
                  .filter(Boolean)
                  .join('\n');
              }
              var am = t.match(/^<([^>]+)>$/);
              if (am) {
                var inner = am[1].trim();
                var exp = expandPhrase(inner, defs);
                return '<' + exp + '>';
              }
              return expandPhrase(t, defs);
            })
            .filter(Boolean)
            .join(' · ');
        })
        .filter(Boolean)
        .join(' | ');
    })
    .filter(Boolean)
    .join('\n');
}

function expandCardTextLine(line, defs) {
  if (!line || !defs) return line;
  var t = line.trim();
  if (t.indexOf(':') >= 0) return line;
  if (/^[·\u00b7]/.test(t)) {
    var inner = t.replace(/^[·\u00b7]\s*/, '').trim();
    return '· ' + expandPhrase(inner, defs);
  }
  return expandPhrase(t, defs);
}

function expandCardContent(content, defs, deckType) {
  if (!defs) return;
  /** Tool / ability cards: show only what is written in cards.md (keywords + [symbols]); do not append ## Effects gloss from card-definitions.md. */
  if (deckType === 'tool' || deckType === 'ability' || deckType === 'garb' || deckType === 'discovery') return;
  content.forEach(function(item) {
    if (item.kind === 'text') item.text = expandCardTextLine(item.text, defs);
    if (item.kind === 'approach') {
      if (item.outcomes != null && String(item.outcomes).trim() !== '') {
        item.outcomes = expandOutcomeString(item.outcomes, defs);
      }
      if (item.subLines) {
        item.subLines = item.subLines.map(function(sl) { return expandPhrase(sl, defs); });
      }
    }
  });
}

// ── MARKDOWN PARSER ──────────────────────────────────────────────────────────
function pushCardTextContent(content, text) {
  content.push({ kind: 'text', text: text });
}

/** Approach difficulty: a single number (e.g. `5`) or a two-value form with `-` or `+` like `3-4`, `6+1`, `3 -2`. The two-value form is kept exactly as written (operator + spacing preserved) so the card shows what you typed; single values stay numeric. Non-numeric placeholders (`___`, `6 __`) are kept as strings. */
function parseDifficultyToken(tok) {
  var s = String(tok == null ? '' : tok).trim();
  if (/^\d+\s*[-+]\s*\d+$/.test(s)) return s;
  if (/^\d+\s+\S+$/.test(s)) return s;
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  return s;
}

function consumeCardFaceMeta(line, bag) {
  var t = String(line || '').trim();
  var pic = t.match(/^Picture\s*:\s*(.+)$/i);
  if (pic) {
    bag.picture = pic[1].trim();
    return true;
  }
  var face = t.match(/^Face\s*:\s*(.+)$/i);
  if (face) {
    bag.faceArt = face[1].trim().toLowerCase();
    return true;
  }
  var zone = t.match(/^Zone\s*:\s*(.+)$/i);
  if (zone) {
    bag.zoneName = zone[1].trim();
    return true;
  }
  return false;
}

var FOREST_FACE_PICTURE = 'CardPictures/Old Forest.jpg';
var CASTLE_FACE_PICTURE = 'CardPictures/Ruined Castle.jpg';
var DUNGEON_FACE_PICTURE = 'CardPictures/dungeon-hall.jpg';

function isArtFaceStyle(faceArt) {
  var a = String(faceArt || '').toLowerCase();
  return a === 'forest' || a === 'dungeon' || a === 'dark' || a === 'castle';
}

function defaultFaceArtForDeck(deckName, cardType) {
  if (cardType !== 'challenge' && cardType !== 'zone' && cardType !== 'finding') return null;
  var n = String(deckName || '').toLowerCase();
  if (/zone deck\s*2|sunken keep/.test(n) || (/ruined castle/.test(n) && !/wood/.test(n))) {
    return { faceArt: 'castle', zoneName: 'Ruined Castle', picture: CASTLE_FACE_PICTURE };
  }
  if (/forest|thicket|zone deck\s*1/.test(n)) {
    return { faceArt: 'forest', zoneName: 'Old Forest', picture: FOREST_FACE_PICTURE };
  }
  return null;
}

function applyDefaultFaceArt(cardOut, deckName) {
  var spec = defaultFaceArtForDeck(deckName, cardOut && cardOut.type);
  if (spec) {
    if (!cardOut.faceArt) cardOut.faceArt = spec.faceArt;
    if (!cardOut.zoneName) cardOut.zoneName = spec.zoneName;
    if (!cardOut.picture && isArtFaceStyle(cardOut.faceArt)) cardOut.picture = spec.picture;
  }
  if (cardOut.faceArt === 'forest' && !cardOut.zoneName) cardOut.zoneName = 'Old Forest';
  if ((cardOut.faceArt === 'dungeon' || cardOut.faceArt === 'dark' || cardOut.faceArt === 'castle') && !cardOut.zoneName) {
    cardOut.zoneName = 'Ruined Castle';
  }
  if (!cardOut.picture && cardOut.faceArt === 'forest') cardOut.picture = FOREST_FACE_PICTURE;
  if (!cardOut.picture && cardOut.faceArt === 'castle') cardOut.picture = CASTLE_FACE_PICTURE;
  if (!cardOut.picture && (cardOut.faceArt === 'dungeon' || cardOut.faceArt === 'dark')) {
    cardOut.picture = DUNGEON_FACE_PICTURE;
  }
}

function cardFaceDataAttrs(card) {
  var extra = '';
  if (card && card.picture) extra += ' data-card-picture="' + escapeHtml(card.picture) + '"';
  if (card && card.faceArt) extra += ' data-face-art="' + escapeHtml(card.faceArt) + '"';
  return extra;
}

function resolveCardPictureUrl(raw) {
  var url = String(raw || '').trim().replace(/^<|>$/g, '');
  if (!url) return '';
  if (typeof GarbBoard !== 'undefined' && GarbBoard.normalizePic) url = GarbBoard.normalizePic(url);
  else {
    url = url.replace(/\\/g, '/');
    if (url.indexOf('/') === -1) url = CARD_PICTURES_BASE.replace(/\/?$/, '/') + url;
  }
  if (/^https?:/i.test(url) || url.indexOf('data:') === 0) return url;
  return encodeURI(url);
}

/** After `]` and before flavor: numeric (`6`, `6 +1`, `4-1`), number + blank (`6 __`), or a placeholder (`___`, `TBD`). */
var RE_APPROACH_DIFF_AFTER_BRACKET =
  '(\\d+\\s*[-+]\\s*\\d+|\\d+(?:\\s+_+)(?=\\s|$)|\\d+|___+|TBD)';

function parseMarkdownCards(text, defs) {
  var decks = [];
  // Split into deck sections on lines starting with "# " (h1)
  var deckBlocks = text.split(/\n(?=# )/);
  deckBlocks.forEach(function(block) {
    var lines = block.split('\n');
    var headerLine = lines[0].replace(/^# /, '').trim();

    // "Deck Name [challenge]" or "Deck Name [tool]"
    var typeMatch = headerLine.match(/\[(\w+)\]\s*$/);
    if (!typeMatch) return;
    var deckType = typeMatch[1].toLowerCase();
    var deckName = headerLine.replace(/\[\w+\]\s*$/, '').trim();
    var deckId   = deckName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Split remaining text into card sections on lines starting with "## "
    var rest = prepareMarkdownForCards(lines.slice(1).join('\n'));
    // ## card titles only — do not split on ### topic / brief notes
    var cardBlocks = rest.split(/\n(?=## (?!#))/);
    var cards = [];

    cardBlocks.forEach(function(cb) {
      var clines = cb.split(/\r?\n/).filter(function(l) { return l.trim() !== ''; });
      if (!clines.length) return;
      // Skip deck preamble / ### notes before the first real ## card
      if (!/^##\s/.test(clines[0]) || /^###/.test(clines[0])) return;

      var cardHeader = clines[0].replace(/^## /, '').trim();
      // "Name [ID]" or just "Name" — [ABILITY] is a type tag, not a unique id
      var idMatch  = cardHeader.match(/\[([^\]]+)\]\s*$/);
      var cardName = idMatch ? cardHeader.replace(/\[[^\]]+\]\s*$/, '').trim() : cardHeader;
      var cardType = deckType;
      var cardId   = idMatch ? idMatch[1] : (deckId.toUpperCase() + '_' + cardName.toUpperCase().replace(/[^A-Z0-9]+/g, '_'));
      if (deckType === 'writabletool') cardType = 'writable-tool';
      if (deckType === 'playaid' || deckType === 'play-aid') cardType = 'playaid';
      if (idMatch && String(idMatch[1]).toUpperCase() === 'ABILITY') {
        cardType = 'ability';
        cardId = 'ABILITY_' + cardName.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
      }
      if (idMatch && String(idMatch[1]).toUpperCase() === 'ZONE') {
        cardType = 'zone';
        cardId = 'ZONE_' + cardName.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
      }
      var idUpper = idMatch ? String(idMatch[1]).toUpperCase() : '';
      if (deckType === 'ally' || idUpper === 'ALLY' || idUpper.indexOf('ALLY_') === 0) {
        cardType = 'ally';
      }
      // Unified card system: every play card (challenge / tool / ability / ally) parses
      // and renders through the challenge layout; only the banner colour differs by type.
      // Reference cards keep their dedicated rule-list layout. Legacy `_ X N` tool rows are
      // still accepted under challenge parsing for backward compatibility.
      var parseAs = (cardType === 'reference') ? 'reference' : 'challenge';

      var bodySlice = clines.slice(1);
      var subtitle = null;
      var subtitleSkip = -1;
      for (var si = 0; si < bodySlice.length; si++) {
        var lineTry = bodySlice[si].trim();
        if (parseAs === 'challenge' && /^-\s*\[/.test(lineTry)) break;
        if (lineTry.startsWith('_ ')) break;
        var subMatch = lineTry.match(/^- (.+) -$/);
        if (subMatch) {
          subtitle = String(subMatch[1] || '').trim();
          subtitleSkip = si;
          break;
        }
      }
      // Banner subtitle sets card type inside mixed decks (e.g. "- Zone -" in [challenge], "- Search -" in [search]).
      if (parseAs === 'challenge' && subtitle) {
        var subLower = String(subtitle).toLowerCase();
        if (subLower === 'zone') cardType = 'zone';
        else if (subLower === 'finding') cardType = 'finding';
        else if (subLower === 'search') cardType = 'search';
        else if (subLower === 'discovery') cardType = 'discovery';
        else if (subLower === 'garb') cardType = 'garb';
      }
      if (parseAs === 'challenge' && (deckType === 'finding' || deckType === 'search' || deckType === 'discovery')) {
        cardType = deckType;
      }
      var body =
        subtitleSkip >= 0
          ? bodySlice.filter(function(_, idx) {
              return idx !== subtitleSkip;
            })
          : bodySlice;
      // Drop trailing ### note blocks (and everything after) — notes stay in the .md only
      var noteCut = -1;
      for (var ni = 0; ni < body.length; ni++) {
        if (/^###/.test(String(body[ni] || '').trim())) {
          noteCut = ni;
          break;
        }
      }
      if (noteCut >= 0) body = body.slice(0, noteCut);
      var copies = 1;
      var discoveryLinkName = null;
      var playAidMeta = {};

      // Both challenge and tool: build a mixed content array in document order.
      // - lines starting with "- " are parsed as approach/use rows.
      // - "---" becomes a horizontal rule (inside `Tool>` … `Tool>`: inner divider only, does not split bands).
      // - everything else appears verbatim as a text line.
      var content = [];
      var inToolFence = false;
      var skipNoteTail = false;
      body.forEach(function(line) {
        var t = line.trim();
        if (!t) return;
        // Once a ### note heading appears, drop it and the rest of this card body
        if (/^###/.test(t)) {
          skipNoteTail = true;
          return;
        }
        if (skipNoteTail) return;
        if ((cardType === 'playaid' || cardType === 'play-aid') && typeof GarbBoard !== 'undefined' && GarbBoard.consumeMetaLine && GarbBoard.consumeMetaLine(t, playAidMeta)) return;
        if (consumeCardFaceMeta(t, playAidMeta)) return;
        if (cardType === 'search') {
          var discLinkName = parseSearchDiscoveryLinkLine(t);
          if (discLinkName) {
            discoveryLinkName = discLinkName;
            return;
          }
          if (parseSearchLinkedNoteLine(t)) return;
        }
        var countMatch = t.match(/^Count\s*:\s*\**\s*(\d+)\s*\**\s*$/i);
        if (countMatch) {
          copies = Math.max(1, parseInt(countMatch[1], 10) || 1);
        } else if (t === '---') {
          content.push({
            kind: 'rule',
            toolInner: !!(parseAs === 'challenge' && inToolFence)
          });
        } else if (parseAs === 'challenge' && /^Tool>\s*$/i.test(t)) {
          content.push({ kind: 'toolFence', open: !inToolFence });
          inToolFence = !inToolFence;
        } else if (/^[·\u00b7]/.test(t)) {
          var bulletText = t.replace(/^[·\u00b7]\s*/, '').trim();
          var prev = content.length && content[content.length - 1];
          if (prev && prev.kind === 'approach') {
            prev.subLines = prev.subLines || [];
            prev.subLines.push(bulletText);
          } else {
            content.push({ kind: 'text', text: t });
          }
        } else if (t.startsWith('_ ')) {
          // "_ Fight 7" → Power 7. Optional: "_ Fight 5 : …", "_ Range 2-3 · Fight 4 : …", "_ Special : Scout 1" (no power; also " - " legacy; `<Power 5>` still accepted)
          var rawT = t.slice(2).trim();
          var condT = rawT.match(/\(([^)]+)\)\s*$/);
          var conditionT = condT ? condT[1] : undefined;
          var cleanT = conditionT ? rawT.replace(/\([^)]+\)\s*$/, '').trim() : rawT;
          var um = null;
          var sp = null;
          var activation = null;
          var actSep = cleanT.indexOf(' \u00b7 ');
          var actSepLen = 3;
          if (actSep < 0) {
            actSep = cleanT.indexOf(' - ');
          }
          if (actSep > 0) {
            activation = cleanT.slice(0, actSep).trim();
            var restAct = cleanT.slice(actSep + actSepLen).trim();
            sp = restAct.match(/^Special\s*:\s*(.*)$/i);
            if (!sp) {
              um = restAct.match(/^(\w+)\s+(\d+)\s*:\s*(.+)$/);
              if (!um) um = restAct.match(/^(\w+)\s+(\d+)\s*$/);
            }
          }
          if (!um && !sp) {
            sp = cleanT.match(/^Special\s*:\s*(.*)$/i);
          }
          if (!um && !sp) {
            um = cleanT.match(/^(\w+)\s+(\d+)\s*:\s*(.+)$/);
          }
          if (!um && !sp) {
            um = cleanT.match(/^(\w+)\s+(\d+)\s*$/);
          }
          if (sp) {
            var outSpecial = String(sp[1] != null ? sp[1] : '').trim();
            var aptSp = {
              kind: 'approach',
              type: 'Special',
              difficulty: null,
              outcomes: outSpecial,
              noPower: true
            };
            if (conditionT) aptSp.condition = conditionT;
            if (activation) aptSp.activation = activation;
            content.push(aptSp);
          } else if (um) {
            var outTool = um[3] !== undefined ? String(um[3]).trim() : '';
            var apt2 = { kind: 'approach', type: normalizeApproachTypeName(um[1]), difficulty: parseInt(um[2], 10), outcomes: outTool };
            if (conditionT) apt2.condition = conditionT;
            if (activation) apt2.activation = activation;
            content.push(apt2);
          } else {
            content.push({ kind: 'text', text: t });
          }
        } else if (t.startsWith('- ')) {
          if (parseAs === 'challenge') {
            var raw = t.slice(2);
            var condMatch = raw.match(/\(([^)]+)\)\s*$/);
            var condition = condMatch ? condMatch[1] : undefined;
            var clean = condition ? raw.replace(/\([^)]+\)\s*$/, '').trim() : raw;
            var pathStepNum = null;
            var pathNumSeg = clean.match(/^(\d+)\.\s+(\S.*)$/);
            if (pathNumSeg && /^\[/.test(pathNumSeg[2])) {
              pathStepNum = parseInt(pathNumSeg[1], 10);
              clean = pathNumSeg[2].trim();
            }
            var garbApproachMatch = null;
            garbApproachMatch = clean.match(
              new RegExp(
                '^\\[\\s*(' + RE_APPROACH_STAT_CODE + ')\\s*\\]\\s+(' + RE_GARB_APPROACH_NAME + ')\\s*:\\s*(.*)$',
                'i'
              )
            );
            if (!garbApproachMatch) {
              var garbNoColon = clean.match(
                new RegExp(
                  '^\\[\\s*(' + RE_APPROACH_STAT_CODE + ')\\s*\\]\\s+(' + RE_GARB_APPROACH_NAME + ')\\s*$',
                  'i'
                )
              );
              if (garbNoColon) {
                garbApproachMatch = [garbNoColon[0], garbNoColon[1], garbNoColon[2], ''];
              }
            }
            if (!garbApproachMatch) {
              var garbLegacyUses = clean.match(
                new RegExp(
                  '^\\[\\s*(' + RE_APPROACH_STAT_CODE + ')\\s*\\]\\s+(' + RE_GARB_APPROACH_NAME + ')\\s+Uses\\s+(\\d+)\\s*$',
                  'i'
                )
              );
              if (garbLegacyUses) {
                garbApproachMatch = [
                  garbLegacyUses[0],
                  garbLegacyUses[1],
                  garbLegacyUses[2],
                  'Uses ' + garbLegacyUses[3]
                ];
              }
            }
            var apPath = null;
            var ap = null;
            if (garbApproachMatch) {
              var flavorGarb = String(garbApproachMatch[2] || '').trim();
              var canonGarb =
                canonicalApproachTypeFromStatCode(garbApproachMatch[1], flavorGarb) ||
                normalizeApproachTypeName(flavorGarb);
              if (canonGarb) {
                ap = {
                  kind: 'approach',
                  type: canonGarb,
                  difficulty: null,
                  outcomes: String(garbApproachMatch[3] != null ? garbApproachMatch[3] : '').trim(),
                  flavorLabel: normalizeApproachTypeName(flavorGarb) || flavorGarb,
                  garbApproachRow: true
                };
                if (condition) ap.condition = condition;
              }
            }
            var pathBracket = clean.match(
              /^\[\s*(FI|WO|CR|TR|AW|WA|F|C|W|T|A)\s*\]\s*(\d+(?:\s*[-+]\s*\d+)?)\s*:\s*(.*)$/i
            );
            if (pathBracket && pathStepNum != null) {
              var canonPath = canonicalApproachTypeFromStatCode(pathBracket[1]);
              if (canonPath) {
                var outPath = String(pathBracket[3] != null ? pathBracket[3] : '').trim();
                apPath = {
                  kind: 'approach',
                  type: canonPath,
                  difficulty: parseDifficultyToken(pathBracket[2]),
                  outcomes: outPath,
                  statChipOnly: true,
                  pathStepNumber: pathStepNum
                };
                if (outPath === '' && /:\s*$/.test(clean.replace(/\s+$/, ''))) {
                  apPath.outcomeLineContinues = true;
                }
                if (condition) apPath.condition = condition;
              }
            }
            /* Bracket stat first (either `- [AW 5] …` or `- [A] 5 …` — same chip as viewer `[A] 5`). */
            var bracketArr = null;
            if (!ap && !apPath) {
              bracketArr = clean.match(
                /^\[\s*(FI|WO|CR|TR|AW|WA|F|C|W|T|A)\s+(\d+(?:\s*[-+]\s*\d+)?)\s*\]\s*(.+?)\s*(?:->|:)\s*(.*)$/i
              );
              if (!bracketArr) {
                var bracketNoOut = clean.match(/^\[\s*(FI|WO|CR|TR|AW|WA|F|C|W|T|A)\s+(\d+(?:\s*[-+]\s*\d+)?)\s*\]\s*(.+?)\s*:\s*$/i);
                if (bracketNoOut) {
                  bracketArr = [
                    bracketNoOut[0],
                    bracketNoOut[1],
                    bracketNoOut[2],
                    bracketNoOut[3],
                    ''
                  ];
                }
              }
              if (!bracketArr) {
                bracketArr = clean.match(
                  new RegExp(
                    '^\\[\\s*(FI|WO|CR|TR|AW|WA|F|C|W|T|A)\\s*\\]\\s*' +
                      RE_APPROACH_DIFF_AFTER_BRACKET +
                      '\\s+(.+?)\\s*(?:->|:)\\s*(.*)$',
                    'i'
                  )
                );
              }
              if (!bracketArr) {
                bracketNoOut = clean.match(
                  new RegExp(
                    '^\\[\\s*(FI|WO|CR|TR|AW|WA|F|C|W|T|A)\\s*\\]\\s*' +
                      RE_APPROACH_DIFF_AFTER_BRACKET +
                      '\\s+(.+?)\\s*:\\s*$',
                    'i'
                  )
                );
                if (bracketNoOut) {
                  bracketArr = [
                    bracketNoOut[0],
                    bracketNoOut[1],
                    bracketNoOut[2],
                    bracketNoOut[3],
                    ''
                  ];
                }
              }
            }
            var flavorArr = null;
            if (!ap) ap = apPath;
            if (bracketArr && !ap) {
              var flavorBr = String(bracketArr[3] || '').trim();
              var canonBr = canonicalApproachTypeFromStatCode(bracketArr[1], flavorBr);
              if (canonBr) {
                var outBr = String(bracketArr[4] != null ? bracketArr[4] : '').trim();
                ap = {
                  kind: 'approach',
                  type: canonBr,
                  difficulty: parseDifficultyToken(bracketArr[2]),
                  outcomes: outBr,
                  flavorLabel: normalizeApproachTypeName(flavorBr) || flavorBr
                };
                if (outBr === '' && /:\s*$/.test(clean.replace(/\s+$/, ''))) {
                  ap.outcomeLineContinues = true;
                }
                if (condition) ap.condition = condition;
              }
            }
            if (!ap) {
              flavorArr = clean.match(/^(.+?)\s+(FI|WO|CR|TR|AW|WA|F|C|W|T|A)\s*(\d+(?:\s*[-+]\s*\d+)?)\s*(?:->|:)\s*(.*)$/i);
              if (!flavorArr) {
                var flavorNoColon = clean.match(/^(.+?)\s+(FI|WO|CR|TR|AW|WA|F|C|W|T|A)\s*(\d+(?:\s*[-+]\s*\d+)?)\s*$/i);
                if (flavorNoColon) {
                  flavorArr = [
                    flavorNoColon[0],
                    flavorNoColon[1],
                    flavorNoColon[2],
                    flavorNoColon[3],
                    ''
                  ];
                }
              }
              if (flavorArr) {
                var flavorFl = String(flavorArr[1] || '').trim();
                var canonType = canonicalApproachTypeFromStatCode(flavorArr[2], flavorFl);
                if (canonType) {
                  var outFl = String(flavorArr[4] != null ? flavorArr[4] : '').trim();
                  ap = {
                    kind: 'approach',
                    type: canonType,
                    difficulty: parseDifficultyToken(flavorArr[3]),
                    outcomes: outFl,
                    flavorLabel: normalizeApproachTypeName(flavorFl) || flavorFl
                  };
                  if (outFl === '' && /:\s*$/.test(clean.replace(/\s+$/, ''))) {
                    ap.outcomeLineContinues = true;
                  }
                  if (condition) ap.condition = condition;
                }
              }
            }
            var arr = null;
            if (!ap) {
              /* Flavorless approach row: `- [F] 5 :` (new format — one chip
                 of all four approaches under the challenge name; the row
                 name/verb moved into skills). */
              var bare = clean.match(/^\[\s*(FI|WO|CR|TR|AW|WA|F|C|W|T|A)\s*\]\s*(\d+(?:\s*[-+]\s*\d+)?)\s*:\s*(.*)$/i);
              if (bare) {
                var canonBare = canonicalApproachTypeFromStatCode(bare[1]);
                if (canonBare) {
                  var outBare = String(bare[3] != null ? bare[3] : '').trim();
                  ap = {
                    kind: 'approach',
                    type: canonBare,
                    difficulty: parseDifficultyToken(bare[2]),
                    outcomes: outBare,
                    flavorless: true
                  };
                  if (outBare === '' && /:\s*$/.test(clean.replace(/\s+$/, ''))) {
                    ap.outcomeLineContinues = true;
                  }
                  if (condition) ap.condition = condition;
                }
              }
            }
            if (!ap) {
              arr = clean.match(/^(\w+)\s+(\d+(?:\s*[-+]\s*\d+)?)\s*(?:->|:)\s*(.*)$/);
              if (!arr) {
                arr = clean.match(/^(\w+)\s+(\d+(?:\s*[-+]\s*\d+)?)\s*$/);
                if (arr) arr = [arr[0], arr[1], arr[2], ''];
              }
            }
            if (ap) {
              content.push(ap);
            } else if (arr) {
              var outParsed = String(arr[3] || '').trim();
              ap = { kind: 'approach', type: normalizeApproachTypeName(arr[1]), difficulty: parseDifficultyToken(arr[2]), outcomes: outParsed };
              if (outParsed === '' && /:\s*$/.test(clean.replace(/\s+$/, ''))) {
                ap.outcomeLineContinues = true;
              }
              if (condition) ap.condition = condition;
              content.push(ap);
            } else {
              content.push({ kind: 'text', text: t.slice(2) });
            }
          } else {
            var u = t.slice(2).match(/^(.+?)\s*->\s*Power\s+(\d+)\s*$/i);
            if (u) {
              content.push({ kind: 'approach', type: u[1].trim(), difficulty: null, outcomes: 'Power ' + parseInt(u[2], 10) });
            } else {
              content.push({ kind: 'text', text: t.slice(2) });
            }
          }
        } else {
          var prevTok = content.length && content[content.length - 1];
          var colPos = t.indexOf(':');
          var kwLeft = colPos > 0 ? t.slice(0, colPos).trim() : '';
          var crowMatch =
            parseAs === 'challenge' &&
            prevTok &&
            prevTok.kind === 'approach' &&
            colPos > 0 &&
            kwLeft.length > 0 &&
            kwLeft.length <= 56 &&
            t.indexOf('://') < 0 &&
            /^[A-Za-z\[]/.test(t.trim());
          var mergeGuards =
            !t.startsWith('- ') &&
            t !== '---' &&
            !/^## /.test(t) &&
            !/^Count\s*:/i.test(t) &&
            !t.startsWith('_ ');
          var outTrimMerge = prevTok && prevTok.kind === 'approach' ? String(prevTok.outcomes || '').trim() : '';
          /* `- Approach : … ,` then next line → merge as `\n` so layout matches cards.md (see Foolin Walk Past). */
          var outEndsWithCommaCont = outTrimMerge.length > 0 && /,\s*$/.test(outTrimMerge);
          var mergeIntoApproachOutcomes =
            parseAs === 'challenge' &&
            prevTok &&
            prevTok.kind === 'approach' &&
            mergeGuards &&
            (/:\s*$/.test(outTrimMerge) ||
              (prevTok.outcomeLineContinues === true && outTrimMerge === '') ||
              outEndsWithCommaCont);
          if (mergeIntoApproachOutcomes) {
            var wasEmptyLineContinuation =
              prevTok.outcomeLineContinues === true && !String(prevTok.outcomes || '').trim();
            if (wasEmptyLineContinuation) {
              /* `- Approach N :` then next line → same layout as `[1+]` sub-lines (formatTextLine isSub), not merged outcome row. */
              prevTok.subLines = prevTok.subLines || [];
              prevTok.subLines.push(t.trim());
              prevTok.outcomeLineContinues = false;
              prevTok.emptyApproachColon = true;
            } else {
              var pOut = String(prevTok.outcomes || '').replace(/\s+$/, '');
              prevTok.outcomes = pOut ? pOut + '\n' + t.trim() : t.trim();
              prevTok.outcomeLineContinues = false;
            }
          } else if (
            parseAs === 'challenge' &&
            prevTok &&
            prevTok.kind === 'approach' &&
            prevTok.subLines &&
            prevTok.subLines.length &&
            /:\s*$/.test(String(prevTok.subLines[prevTok.subLines.length - 1]).trim()) &&
            mergeGuards
          ) {
            var slMerge = prevTok.subLines;
            var li = slMerge.length - 1;
            slMerge[li] = String(slMerge[li] || '').replace(/\s+$/, '') + '\n' + t.trim();
          } else if (crowMatch) {
            prevTok.subLines = prevTok.subLines || [];
            prevTok.subLines.push(t);
          } else {
            var prevTextMerge = content.length && content[content.length - 1];
            if (
              prevTextMerge &&
              prevTextMerge.kind === 'text' &&
              /:\s*$/.test(String(prevTextMerge.text || '').trim()) &&
              !t.startsWith('- ') &&
              t !== '---' &&
              !/^## /.test(t) &&
              !/^Count\s*:/i.test(t) &&
              !t.startsWith('_ ')
            ) {
              prevTextMerge.text =
                String(prevTextMerge.text || '').replace(/\s+$/, '') + '\n' + t.trim();
            } else {
              pushCardTextContent(content, t);
            }
          }
        }
      });
      expandCardContent(content, defs, cardType);
      for (var ci = 0; ci < copies; ci++) {
        var copyId = copies > 1 ? (cardId + '__' + (ci + 1)) : cardId;
        var cardOut = {
          id: copyId,
          name: cardName,
          type: cardType,
          content: content,
          subtitle: subtitle || undefined,
          discoveryLink: discoveryLinkName || undefined
        };
        if (playAidMeta.picture) cardOut.picture = playAidMeta.picture;
        if (playAidMeta.size) cardOut.size = playAidMeta.size;
        if (playAidMeta.toolsArt) cardOut.toolsArt = playAidMeta.toolsArt;
        if (playAidMeta.faceArt) cardOut.faceArt = playAidMeta.faceArt;
        if (playAidMeta.zoneName) cardOut.zoneName = playAidMeta.zoneName;
        applyDefaultFaceArt(cardOut, deckName);
        cards.push(cardOut);
      }
    });

    if (cards.length) {
      var deckTypeOut = deckType === 'writabletool' ? 'writable-tool' : (deckType === 'play-aid' ? 'playaid' : deckType);
      decks.push({ id: deckId, name: deckName, type: deckTypeOut, cards: cards });
    }
  });
  linkSearchDiscoveryPairs(decks);
  if (typeof GarbBoard !== 'undefined' && GarbBoard.applyFromDecks) GarbBoard.applyFromDecks(decks);
  if (typeof GarbBoard !== 'undefined' && GarbBoard.mergeGarbDeck && typeof GARB_DATA !== 'undefined') {
    GarbBoard.mergeGarbDeck(decks, GARB_DATA);
  }
  return { decks: decks };
}

/** `Discovery : Wood Axe` on search cards — metadata only, not printed on the face. */
function parseSearchDiscoveryLinkLine(text) {
  var m = String(text || '').trim().match(/^Discovery\s+:\s+(.+)$/i);
  return m ? String(m[1] || '').trim() : null;
}

/** `Linked: …` on search/discovery faces — author notes only, never printed. */
function parseSearchLinkedNoteLine(text) {
  return /^Linked\s*:/i.test(String(text || '').trim());
}

/** Search (front) flips to linked discovery card (back) via `Discovery : …` in cards.md. */
function linkSearchDiscoveryPairs(decks) {
  var discoveries = {};
  (decks || []).forEach(function(deck) {
    (deck.cards || []).forEach(function(card) {
      if (card.type !== 'discovery') return;
      var key = String(card.name || '').trim().toLowerCase();
      if (key) discoveries[key] = card;
    });
  });
  (decks || []).forEach(function(deck) {
    (deck.cards || []).forEach(function(card) {
      if (card.type !== 'search' || !card.discoveryLink) return;
      var key = String(card.discoveryLink).trim().toLowerCase();
      var disc = discoveries[key];
      if (!disc) return;
      card.pairedDiscovery = disc;
      disc.pairedSearch = card;
    });
  });
}

// ── LOAD ─────────────────────────────────────────────────────────────────────
/** New challenge format: every challenge shows all four Action chips in one
 *  line under the name. Approaches the author did not list are harder
 *  fallbacks — max listed Power + 2 (same rule the chip-line renderer uses in
 *  renderChallengeCard). Baked into the parsed data here so the simulator,
 *  the viewer, and TTS text exports all agree with the printed card face.
 *  Fiction becomes part of the approach mix: a Fight tool used to climb, a
 *  Craft tool used to fight — unlisted Actions just cost more Exhaustion.
 *  Tool / ability / garb cards keep their own missing-line inference. */
function bakeChallengeApproachFallbacks(decks) {
  (decks || []).forEach(function(deck) {
    (deck.cards || []).forEach(function(card) {
      var t = String(card && card.type || '').toLowerCase();
      if (t !== 'challenge' && t !== 'finding' && t !== 'search' && t !== 'discovery' && t !== 'ally') return;
      var content = card && card.content;
      if (!content || !content.length) return;
      var approaches = content.filter(function(it) { return it && it.kind === 'approach'; });
      if (!approaches.length) return;
      /* Only cards authored fully in the flavorless chip format (`- [F] 5 :`)
         get the four-chip treatment — mixed/named cards render the old way. */
      var allFlavorless = approaches.every(function(it) { return it.flavorless; });
      if (!allFlavorless) return;
      var maxListed = 0;
      approaches.forEach(function(it) {
        var m = String(it.difficulty == null ? '' : it.difficulty).match(/-?\d+/);
        var d = m ? parseInt(m[0], 10) : NaN;
        if (isFinite(d) && d > maxListed) maxListed = d;
      });
      if (!isFinite(maxListed) || maxListed <= 0) return;
      var have = {};
      approaches.forEach(function(it) {
        var key = toolStatTypeKey(it.type);
        if (key && !have[key]) have[key] = it;
      });
      TOOL_STAT_TYPES.forEach(function(type) {
        if (have[type]) return;
        var fb = {
          kind: 'approach',
          type: type,
          difficulty: maxListed + 2,
          outcomes: '',
          flavorless: true,
          offApproach: true
        };
        /* Keep family order readable: insert before the first printed
           approach of a later kind (Fight → Craft → Traverse → Awareness). */
        var insertAt = content.length;
        var fbIdx = APPROACH_ORDER.indexOf(type);
        for (var i = 0; i < content.length; i++) {
          var it = content[i];
          if (it && it.kind === 'approach') {
            var idx = APPROACH_ORDER.indexOf(normalizeApproachTypeName(it.type));
            if (idx !== -1 && fbIdx !== -1 && idx > fbIdx) { insertAt = i; break; }
          }
        }
        content.splice(insertAt, 0, fb);
      });
    });
  });
}

Promise.all([
  fetch('cards.md').then(function(r) {
    if (!r.ok) throw new Error(r.status);
    return r.text();
  }),
  fetch('dungeon-cards.md').then(function(r) {
    if (!r.ok) throw new Error(r.status);
    return r.text();
  }),
  fetch('card-definitions.md').then(function(r) { return r.ok ? r.text() : ''; }).catch(function() { return ''; })
])
  .then(function(parts) {
    var defs = parseDefinitions(parts[2]);
    var sym = stripLeadingSymbolSection(parts[0]);
    var dungeon = stripLeadingSymbolSection(parts[1]);
    currentEffectSymbolMap = applyEffectSymbolAliases(
      sym.hadSymbolSection ? Object.assign({}, sym.map) : Object.assign({}, DEFAULT_EFFECT_SYMBOLS)
    );
    outcomeGlyphPatternCache.mapJson = '';
    outcomeGlyphPatternCache.re = null;
    outcomeKeywordPatternCache.mapJson = '';
    outcomeKeywordPatternCache.re = null;
    var merged = sym.body + '\n\n' + dungeon.body;
    merged = prepareMarkdownForCards(merged);
    var parsedDecks = parseMarkdownCards(merged, defs);
    bakeChallengeApproachFallbacks(parsedDecks.decks);
    buildGrid(parsedDecks);
    currentEffectSymbolMap = null;
    outcomeGlyphPatternCache.mapJson = '';
    outcomeGlyphPatternCache.re = null;
    outcomeKeywordPatternCache.mapJson = '';
    outcomeKeywordPatternCache.re = null;
  })
  .catch(function() {
    document.getElementById('card-grid').innerHTML =
      '<p style="color:#e8d5a0;text-align:center;margin-top:3rem;font-size:1.1rem;">' +
      '⚠ Could not load cards.md<br><br>' +
      'Open this page via a local server — double-click <strong>serve.bat</strong> ' +
      'then visit <strong>http://localhost:8080</strong></p>';
  });

function setGap(val) {
  const mm = parseFloat(val);
  document.documentElement.style.setProperty('--print-gap', mm + 'mm');
  document.getElementById('gap-value').textContent = mm + ' mm';
}

// ── PRINT ────────────────────────────────────────────────────────────────────
// Instead of window.print() (which breaks cross-page centering in CSS),
// we open a new window where each A4 page is an explicit fixed-size div.
// Centering inside a known-size box is always reliable.

function stripPrintMedia(css) {
  // Remove @media print { ... } so it doesn't interfere with the print window
  const start = css.indexOf('@media print');
  if (start === -1) return css;
  let depth = 0, i = css.indexOf('{', start);
  while (i < css.length) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') { if (--depth === 0) return css.slice(0, start) + css.slice(i + 1); }
    i++;
  }
  return css;
}

function printCards() {
  clearCardPreviewZoom();
  var gap      = parseFloat(document.getElementById('gap-slider').value);
  var allCards = document.querySelectorAll('.card:not(.hidden)');
  var PER_PAGE = 9;

  // Split visible cards into pages of 9
  var pages = [];
  var page  = [];
  for (var ci = 0; ci < allCards.length; ci++) {
    page.push(allCards[ci]);
    if (page.length === PER_PAGE) { pages.push(page); page = []; }
  }
  if (page.length) pages.push(page);

  // Card styles (strip the @media print block so it doesn't interfere)
  var styles = stripPrintMedia(
    Array.from(document.querySelectorAll('style')).map(function(s) { return s.textContent; }).join('\n')
  );

  // Resolve base path so relative URLs (Cardtemplate.png) work in the new window
  var base = location.href.replace(/[^\/\\]*$/, '');

  // Build pages HTML using string concatenation — avoids nested template-literal issues
  var pagesHTML = '';
  for (var pi = 0; pi < pages.length; pi++) {
    pagesHTML += '<div class="print-page">';
    for (var ki = 0; ki < pages[pi].length; ki++) {
      pagesHTML += pages[pi][ki].outerHTML;
    }
    pagesHTML += '</div>\n';
  }

  // 440px * 0.756 = 332.6px ≈ 88mm per card; 3 per row in 297mm page
  var printStyle =
    '@page{size:A4 landscape;margin:0}' +
    '*,*::before,*::after{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
    'body{margin:0;padding:0;background:#fff}' +
    '.card{zoom:0.756;transition:none!important}' +
    '.card:hover{transform:none!important}' +
    '.print-page{width:297mm;height:210mm;display:flex;flex-wrap:wrap;' +
      'justify-content:center;align-content:center;gap:' + gap + 'mm;' +
      'page-break-after:always;break-after:page;box-sizing:border-box;overflow:hidden}' +
    '.print-page:last-child{page-break-after:auto;break-after:auto}';

  var html =
    '<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8">' +
    '<base href="' + base + '">' +
    '<link href="https://fonts.googleapis.com/css2?family=Macondo&family=Macondo+Swash+Caps&display=swap" rel="stylesheet">' +
    '<style>' + styles + printStyle + '<\/style>' +
    '<\/head><body>' +
    pagesHTML +
    '<\/body><\/html>';

  var win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.addEventListener('load', function() {
    setTimeout(function() { win.focus(); win.print(); }, 500);
  });
}

// ── TTS PNG export (3×2 grid, no gaps — POST to local card-viewer server) ─────
var TTS_COLS = 3;
var TTS_ROWS = 2;
var TTS_PER_SHEET = TTS_COLS * TTS_ROWS;
var TTS_CARD_W = 440;
var TTS_CARD_H = 315;
var TTS_SCALE = 2;

function setTtsExportStatus(msg) {
  var el = document.getElementById('tts-export-status');
  if (el) el.textContent = msg || '';
}

function ttsCardNativeSize(el) {
  if (el && el.classList.contains('card-challenge-stack')) return { w: 315, h: 440 };
  return { w: TTS_CARD_W, h: TTS_CARD_H };
}

async function exportTtsSheets() {
  var btn = document.getElementById('btn-tts-export');
  if (typeof html2canvas !== 'function') {
    alert('Could not load html2canvas (CDN). Check your network and reload the page.');
    return;
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('.card:not(.hidden):not(.garb-playaid):not(.card-character)'));
  if (!cards.length) {
    alert('No visible cards to export. Change the filter or reload cards.');
    return;
  }

  var health;
  try {
    health = await fetch('/api/tts-health').then(function(r) { return r.json(); });
  } catch (e) {
    health = null;
  }
  if (!health || !health.ok) {
    alert('TTS export only works when this page is opened via the local server (serve-cards.bat / npm run serve:cards), not file://.');
    return;
  }

  if (btn) btn.disabled = true;
  setTtsExportStatus('');
  await document.fonts.ready;

  var groups = [
    cards.filter(function(el) { return el.classList.contains('card-challenge-stack'); }),
    cards.filter(function(el) { return !el.classList.contains('card-challenge-stack'); })
  ].filter(function(g) { return g.length; });
  var files = [];
  var sheetNum = 0;

  try {
    for (var gi = 0; gi < groups.length; gi++) {
      var group = groups[gi];
      var sz = ttsCardNativeSize(group[0]);
      var cellW = sz.w * TTS_SCALE;
      var cellH = sz.h * TTS_SCALE;
      var sheetW = TTS_COLS * cellW;
      var sheetH = TTS_ROWS * cellH;
      var numSheets = Math.ceil(group.length / TTS_PER_SHEET);
      for (var si = 0; si < numSheets; si++) {
        sheetNum++;
        setTtsExportStatus('Exporting… sheet ' + sheetNum);
        var canvas = document.createElement('canvas');
        canvas.width = sheetW;
        canvas.height = sheetH;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, sheetW, sheetH);

        for (var j = 0; j < TTS_PER_SHEET; j++) {
          var idx = si * TTS_PER_SHEET + j;
          if (idx >= group.length) break;
          var cardEl = group[idx];
          var wrap = document.createElement('div');
          wrap.style.cssText =
            'position:fixed;left:-12000px;top:0;width:' + sz.w + 'px;height:' + sz.h + 'px;overflow:hidden;pointer-events:none';
          var clone = cardEl.cloneNode(true);
          clone.classList.remove('card--preview-active');
          clone.style.boxShadow = 'none';
          clone.style.transform = 'none';
          clone.style.transition = 'none';
          wrap.appendChild(clone);
          document.body.appendChild(wrap);

          try {
            var shot = await html2canvas(clone, {
              scale: TTS_SCALE,
              backgroundColor: null,
              logging: false,
              useCORS: true,
              width: sz.w,
              height: sz.h,
              windowWidth: sz.w,
              windowHeight: sz.h
            });
            var col = j % TTS_COLS;
            var row = Math.floor(j / TTS_COLS);
            ctx.drawImage(shot, col * cellW, row * cellH);
          } finally {
            document.body.removeChild(wrap);
          }
        }

        var dataUrl = canvas.toDataURL('image/png');
        var b64 = dataUrl.indexOf(',') >= 0 ? dataUrl.split(',')[1] : dataUrl;
        var n = sheetNum;
        var filename = 'tts-sheet-' + (n < 10 ? '0' + n : String(n)) + '.png';
        files.push({ filename: filename, data: b64 });
      }
    }

    setTtsExportStatus('Uploading…');
    var res = await fetch('/api/tts-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ files: files })
    });
    var text = await res.text();
    var json = null;
    try {
      json = JSON.parse(text);
    } catch (e) {}

    if (!res.ok) {
      throw new Error((json && json.message) || text || ('HTTP ' + res.status));
    }

    setTtsExportStatus('Saved ' + files.length + ' sheet(s) → TTS PNGS');
    setTimeout(function() { setTtsExportStatus(''); }, 6000);
  } catch (err) {
    console.error(err);
    alert('TTS export failed: ' + (err && err.message ? err.message : String(err)));
    setTtsExportStatus('');
  } finally {
    if (btn) btn.disabled = false;
  }
}

function bindKeywordHover() {
  if (window.__kwHoverBound) return;
  window.__kwHoverBound = true;
  var pop = document.createElement('div');
  pop.className = 'kw-hover-pop';
  pop.hidden = true;
  document.body.appendChild(pop);
  function place(el) {
    var tip = el.getAttribute('data-tip');
    if (!tip) { pop.hidden = true; return; }
    pop.textContent = tip;
    pop.hidden = false;
    var r = el.getBoundingClientRect();
    var w = Math.min(260, window.innerWidth - 16);
    pop.style.maxWidth = w + 'px';
    var left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
    var top = r.bottom + 6;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    if (pop.getBoundingClientRect().bottom > window.innerHeight - 8) {
      pop.style.top = Math.max(8, r.top - pop.offsetHeight - 6) + 'px';
    }
  }
  document.addEventListener('mouseover', function(e) {
    var el = e.target.closest && e.target.closest('[data-tip]');
    if (!el) return;
    place(el);
  });
  document.addEventListener('mouseout', function(e) {
    var el = e.target.closest && e.target.closest('[data-tip]');
    if (!el || el.contains(e.relatedTarget)) return;
    pop.hidden = true;
  });
}
bindKeywordHover();
