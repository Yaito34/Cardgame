/**
 * Renders discovery pages from window.DISCOVERY_BOOK_DATA (not generated).
 */
(function () {
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderPath(sp) {
    var text = sp.pathText || '';
    var disc = sp.discoveryNumber || '';
    var left = (sp.leftNote || '').trim();
    var leftHtml = left
      ? '<p class="db-left-note">' + esc(left) + '</p>'
      : '';
    return (
      '\n  <section class="db-spread" data-id="' +
      esc(sp.id) +
      '" data-kind="path" aria-label="Discovery ' +
      esc(disc) +
      '">\n' +
      '    <div class="db-surface">\n' +
      '      <div class="db-page db-page--left">' +
      leftHtml +
      '</div>\n' +
      '      <div class="db-page db-page--right">\n' +
      '        <div class="db-right-inner">\n' +
      '          <p class="db-path-kicker">Path:</p>\n' +
      '          <p class="db-path-body">' +
      esc(text) +
      '</p>\n' +
      (disc
        ? '          <p class="db-discovery-num">Discovery ' + esc(disc) + '</p>\n'
        : '') +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </section>'
    );
  }

  function renderTransition(sp) {
    var disc = sp.discoveryNumber || '';
    var zone = (sp.zone || '').trim();
    var fromArea = (sp.fromArea || '').trim();
    var fromPage = (sp.fromPage || '').trim();
    var fromLine = [fromPage, fromArea].filter(Boolean).join(' ');
    var zoneLine = zone ? '[' + zone + ']' : '';
    var diff = (sp.discoverDifficulty || '').trim();
    var left = (sp.leftNote || '').trim();
    var leftBits = [];
    if (zoneLine) {
      leftBits.push('<p class="db-from-zone">' + esc(zoneLine) + '</p>');
    }
    if (fromLine) {
      leftBits.push('<h1 class="db-from-area">' + esc(fromLine) + '</h1>');
    }
    if (diff) {
      leftBits.push(
        '<p class="db-discover-diff">Discover Difficulty ' + esc(diff) + '</p>'
      );
    }
    if (left) {
      leftBits.push('<p class="db-left-note">' + esc(left) + '</p>');
    }
    var toPage = (sp.toPage || '').trim();
    var toArea = (sp.toArea || '').trim();
    var toLine = [toPage, toArea].filter(Boolean).join(' ');
    return (
      '\n  <section class="db-spread" data-id="' +
      esc(sp.id) +
      '" data-kind="transition" aria-label="Discovery ' +
      esc(disc) +
      '">\n' +
      '    <div class="db-surface">\n' +
      '      <div class="db-page db-page--left">' +
      leftBits.join('') +
      '</div>\n' +
      '      <div class="db-page db-page--right">\n' +
      '        <div class="db-right-inner">\n' +
      '          <p class="db-path-kicker">Transition:</p>\n' +
      '          <p class="db-path-body">' +
      esc(sp.transitionName || '') +
      '</p>\n' +
      '          <p class="db-path-kicker">Leads to:</p>\n' +
      '          <p class="db-path-body">' +
      esc(toLine) +
      '</p>\n' +
      '          <p class="db-path-kicker">There it is named:</p>\n' +
      '          <p class="db-path-body">' +
      esc(sp.thereName || '') +
      '</p>\n' +
      (disc
        ? '          <p class="db-discovery-num">Discovery ' + esc(disc) + '</p>\n'
        : '') +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </section>'
    );
  }

  function renderUnknown(sp) {
    return (
      '\n  <section class="db-spread" data-id="' +
      esc(sp.id) +
      '"><div class="db-surface"><div class="db-page" style="grid-column:1/-1"><p class="db-unknown">Unknown kind: ' +
      esc(sp.kind) +
      '</p></div></div></section>'
    );
  }

  function renderPage(sp) {
    var k = (sp.kind || 'path').toLowerCase();
    if (k === 'transition') {
      return renderTransition(sp);
    }
    if (k === 'path') {
      return renderPath(sp);
    }
    return renderUnknown(sp);
  }

  function run() {
    var data = window.DISCOVERY_BOOK_DATA;
    if (!data || !Array.isArray(data.spreads)) {
      return;
    }
    var el = document.getElementById('db-wrap');
    if (!el) {
      return;
    }
    var html = data.spreads.map(renderPage).join('\n');
    el.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
