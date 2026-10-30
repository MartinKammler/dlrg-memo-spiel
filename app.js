'use strict';

/* ================= Konfiguration ================= */

// Alle Raster mit gerader Kartenzahl (a ≤ b). Im Querformat werden sie gedreht.
const RASTER = [
  [3, 4], [4, 4], [4, 5], [5, 6], [6, 6], [6, 8], [8, 8], [8, 10],
  [10, 10], [10, 12], [12, 12], [12, 14], [14, 14], [14, 16], [16, 16],
];
const MAX_KARTEN_HANDY = 36;          // 6×6
const SPIELER_FARBEN = ['#e30613', '#0069b4', '#2e9e44', '#f39200'];
const ZURUECKDREHEN_MS = 1500;
const SPEICHER_KEY = 'dlrg-memory-settings-v1';

/* ================= Hilfsfunktionen ================= */

const $ = (sel) => document.querySelector(sel);
const istHandy = () => Math.min(screen.width, screen.height) < 600;

function mischen(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function laden() {
  try { return JSON.parse(localStorage.getItem(SPEICHER_KEY)) || {}; } catch { return {}; }
}
function speichern(s) {
  try { localStorage.setItem(SPEICHER_KEY, JSON.stringify(s)); } catch { /* egal */ }
}

function zeitFormat(ms) {
  const s = Math.round(ms / 1000);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

const infoText = (m) => (m.titel ? m.titel + ': ' : '') + m.text;

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ================= Einstellungen / Startbildschirm ================= */

const gespeichert = laden();
const settings = {
  set: gespeichert.set || 'klassisch',
  modus: gespeichert.modus || 'bild',
  raster: gespeichert.raster || '4x4',
  spieler: gespeichert.spieler || 2,
  namen: gespeichert.namen || ['Spieler 1', 'Spieler 2', 'Spieler 3', 'Spieler 4'],
};

const aktuellesSet = () => CARD_SETS.find((s) => s.id === settings.set) || CARD_SETS[0];
const textModusAktiv = () => !!aktuellesSet().textModus && settings.modus === 'text';

function renderSetup() {
  // Kartensets
  const setChoice = $('#setChoice');
  setChoice.innerHTML = '';
  for (const s of CARD_SETS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (s.id === settings.set ? ' selected' : '');
    b.innerHTML = escapeHtml(s.name) + '<small>' + s.motive.length + ' Motive</small>';
    b.onclick = () => { settings.set = s.id; renderSetup(); };
    setChoice.appendChild(b);
  }

  // Bild/Text-Modus nur bei Sets mit Texten
  const modeRow = $('#modeRow');
  modeRow.classList.toggle('hidden', !aktuellesSet().textModus);
  modeRow.querySelector('[data-mode=text]').innerHTML = 'Bild&nbsp;+&nbsp;' + escapeHtml(aktuellesSet().textLabel || 'Regeltext');
  modeRow.querySelectorAll('.chip').forEach((b) => {
    b.classList.toggle('selected', b.dataset.mode === settings.modus);
    b.onclick = () => { settings.modus = b.dataset.mode; renderSetup(); };
  });

  // Raster
  const motive = aktuellesSet().motive.length;
  const maxKarten = istHandy() ? MAX_KARTEN_HANDY : Infinity;
  const gridChoice = $('#gridChoice');
  gridChoice.innerHTML = '';
  let auswahlGueltig = false;
  let groessteGueltige = null;
  for (const [a, b] of RASTER) {
    if (a * b > maxKarten) continue;
    const key = a + 'x' + b;
    const paare = (a * b) / 2;
    const ok = paare <= motive;
    if (ok) groessteGueltige = key;
    if (ok && key === settings.raster) auswahlGueltig = true;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip grid-chip';
    btn.dataset.key = key;
    btn.disabled = !ok;
    btn.innerHTML = a + '×' + b + '<small>' + paare + ' Paare</small>';
    btn.title = ok ? '' : 'Braucht ' + paare + ' Motive – vorhanden: ' + motive;
    btn.onclick = () => { settings.raster = key; renderSetup(); };
    gridChoice.appendChild(btn);
  }
  if (!auswahlGueltig) settings.raster = groessteGueltige;
  gridChoice.querySelectorAll('.chip').forEach((b) => b.classList.toggle('selected', b.dataset.key === settings.raster));

  const naechstes = RASTER.find(([a, b]) => (a * b) / 2 > motive && a * b <= maxKarten);
  $('#gridHint').textContent = naechstes
    ? 'Größere Felder werden frei, sobald mehr Motive da sind (' + naechstes[0] + '×' + naechstes[1] + ' braucht ' + (naechstes[0] * naechstes[1]) / 2 + ').'
    : (istHandy() ? 'Auf dem Handy ist 6×6 das größte Feld.' : '');

  // Spieler
  $('#playerCount').querySelectorAll('.chip').forEach((b) => {
    b.classList.toggle('selected', Number(b.dataset.n) === settings.spieler);
    b.onclick = () => { settings.spieler = Number(b.dataset.n); renderSetup(); };
  });
  const names = $('#playerNames');
  names.innerHTML = '';
  for (let i = 0; i < settings.spieler; i++) {
    const row = document.createElement('label');
    row.className = 'player-row';
    row.innerHTML = '<span class="player-dot" style="background:' + SPIELER_FARBEN[i] + '"></span>';
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.maxLength = 16;
    inp.value = settings.namen[i];
    inp.setAttribute('aria-label', 'Name Spieler ' + (i + 1));
    inp.onfocus = () => inp.select();
    inp.oninput = () => { settings.namen[i] = inp.value; };
    row.appendChild(inp);
    names.appendChild(row);
  }
}

/* ================= Spiel ================= */

let spiel = null;

function neuesSpiel() {
  settings.namen = settings.namen.map((n, i) => n.trim() || 'Spieler ' + (i + 1));
  speichern(settings);

  const [a, b] = settings.raster.split('x').map(Number);
  const set = aktuellesSet();
  const paare = (a * b) / 2;
  const textModus = textModusAktiv();
  const motive = mischen([...set.motive]).slice(0, paare);

  const karten = [];
  for (const m of motive) {
    karten.push({ key: m.id, motiv: m, art: 'bild' });
    karten.push({ key: m.id, motiv: m, art: textModus ? 'text' : 'bild' });
  }
  mischen(karten);

  spiel = {
    a, b, karten, textModus,
    spieler: Array.from({ length: settings.spieler }, (_, i) => ({
      name: settings.namen[i], farbe: SPIELER_FARBEN[i], punkte: 0, zuege: 0,
    })),
    dran: 0,
    offen: [],          // Indizes der aktuell aufgedeckten Karten
    gesperrt: false,
    timer: null,
    gefunden: 0,
    paare,
    start: Date.now(),
  };

  baueBrett();
  zeigeScreen('game');
  layout();
  renderScores();
  setStatus(spiel.spieler.length > 1 ? spiel.spieler[0].name + ' fängt an!' : 'Viel Spaß!');
}

function baueBrett() {
  const board = $('#board');
  board.innerHTML = '';
  spiel.karten.forEach((k, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'card';
    el.setAttribute('aria-label', 'Karte ' + (i + 1) + ', verdeckt');
    const face = k.art === 'text'
      ? '<div class="face text"><span>' + (k.motiv.titel ? '<strong class="titel">' + escapeHtml(k.motiv.titel) + '</strong>' : '') + escapeHtml(k.motiv.text) + '</span></div>'
      : (k.motiv.titel && !spiel.textModus)
        // Lernsets im Bild-Modus: Bezeichnung unter das Bild schreiben
        ? '<div class="face captioned"><img src="' + k.motiv.img + '" alt="" draggable="false"><span class="caption">' + escapeHtml(k.motiv.titel) + '</span></div>'
        : '<div class="face"><img src="' + k.motiv.img + '" alt="" draggable="false"></div>';
    el.innerHTML = '<div class="inner"><div class="back" aria-hidden="true">?</div>' + face + '</div>';
    el.addEventListener('click', () => karteGeklickt(i));
    k.el = el;
    board.appendChild(el);
  });
}

function layout() {
  if (!spiel) return;
  const wrap = $('#boardWrap');
  const W = wrap.clientWidth - 16;
  const H = wrap.clientHeight - 8;
  // Feld so drehen, dass es zum Bildschirm passt
  const quer = W > H;
  const cols = quer ? spiel.b : spiel.a;
  const rows = quer ? spiel.a : spiel.b;
  const gap = Math.max(3, Math.min(10, Math.floor(Math.min(W / cols, H / rows) * 0.07)));
  const size = Math.floor(Math.min((W - gap * (cols - 1)) / cols, (H - gap * (rows - 1)) / rows));
  const board = $('#board');
  board.style.setProperty('--cols', cols);
  board.style.setProperty('--card', Math.max(size, 20) + 'px');
  board.style.setProperty('--gap', gap + 'px');
  passeTexteAn();
}

// Textkarten: Schriftgröße verkleinern, bis der Text in die Karte passt
function passeTexteAn() {
  const size = parseFloat($('#board').style.getPropertyValue('--card'));
  for (const k of spiel.karten) {
    const cap = k.el.querySelector('.caption');
    if (cap) {
      // Beschriftung: höchstens zwei Zeilen, sonst Schrift verkleinern
      let fs = size * 0.11;
      cap.style.fontSize = fs + 'px';
      const cs = getComputedStyle(cap);
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      while (fs > 6 && cap.scrollHeight > pad + fs * 1.1 * 2 + 2) {
        fs -= 0.5;
        cap.style.fontSize = fs + 'px';
      }
      continue;
    }
    if (k.art !== 'text') continue;
    const face = k.el.querySelector('.face');
    let fs = size * 0.17;
    face.style.fontSize = fs + 'px';
    while (fs > 6 && (face.scrollHeight > face.clientHeight + 1 || face.scrollWidth > face.clientWidth + 1)) {
      fs -= 0.5;
      face.style.fontSize = fs + 'px';
    }
  }
}

function renderScores() {
  const box = $('#scores');
  box.innerHTML = '';
  spiel.spieler.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'score' + (i === spiel.dran ? ' active' : '');
    d.style.setProperty('--pc', s.farbe);
    d.innerHTML = '<span class="name" style="color:' + s.farbe + '">' + escapeHtml(s.name) + '</span><span class="pts">' + s.punkte + '</span>';
    box.appendChild(d);
  });
  document.documentElement.style.setProperty('--player', spiel.spieler[spiel.dran].farbe);
}

function setStatus(text, regel = false) {
  const st = $('#status');
  st.classList.remove('rule');
  void st.offsetWidth; // Animation neu starten
  st.classList.toggle('rule', regel);
  st.textContent = text;
}

function karteGeklickt(i) {
  if (!spiel) return;
  const k = spiel.karten[i];

  // Zwei falsche Karten offen? Tippen dreht sofort zurück.
  if (spiel.gesperrt) {
    if (spiel.timer) { clearTimeout(spiel.timer); zurueckdrehen(); }
    return;
  }
  if (k.gefunden || spiel.offen.includes(i)) return;

  k.el.classList.add('open');
  k.el.setAttribute('aria-label', 'Karte ' + (i + 1) + ', ' + (k.art === 'text' ? infoText(k.motiv) : k.motiv.name || 'Bild ' + k.key));
  spiel.offen.push(i);

  // Regeltext gut lesbar oben anzeigen, wenn eine Textkarte aufgedeckt wird
  if (k.art === 'text') setStatus(infoText(k.motiv), true);

  if (spiel.offen.length < 2) return;

  const s = spiel.spieler[spiel.dran];
  s.zuege++;
  const [x, y] = spiel.offen.map((j) => spiel.karten[j]);

  if (x.key === y.key) {
    // Treffer: Punkt, Karten bleiben offen, Spieler ist nochmal dran
    s.punkte++;
    spiel.gefunden++;
    for (const j of spiel.offen) {
      const kk = spiel.karten[j];
      kk.gefunden = true;
      kk.el.classList.remove('open');
      kk.el.classList.add('matched', 'just-matched');
      kk.el.style.setProperty('--mc', s.farbe);
      kk.el.insertAdjacentHTML('beforeend', '<span class="badge"></span>');
      kk.el.setAttribute('aria-disabled', 'true');
      setTimeout(() => kk.el.classList.remove('just-matched'), 1000);
    }
    spiel.offen = [];
    navigator.vibrate?.(40);
    renderScores();
    if (x.motiv.text) setStatus(infoText(x.motiv), true);
    else setStatus(spiel.spieler.length > 1 ? 'Paar gefunden! ' + s.name + ' ist nochmal dran.' : 'Paar gefunden!');
    if (spiel.gefunden === spiel.paare) setTimeout(spielEnde, 900);
  } else {
    // Kein Paar: kurz zeigen, dann zurückdrehen und nächster Spieler
    spiel.gesperrt = true;
    for (const j of spiel.offen) spiel.karten[j].el.classList.add('miss');
    spiel.timer = setTimeout(zurueckdrehen, ZURUECKDREHEN_MS);
  }
}

function zurueckdrehen() {
  spiel.timer = null;
  for (const j of spiel.offen) {
    const el = spiel.karten[j].el;
    el.classList.remove('open', 'miss');
    el.setAttribute('aria-label', 'Karte ' + (j + 1) + ', verdeckt');
  }
  spiel.offen = [];
  spiel.gesperrt = false;
  if (spiel.spieler.length > 1) {
    spiel.dran = (spiel.dran + 1) % spiel.spieler.length;
    setStatus(spiel.spieler[spiel.dran].name + ' ist dran.');
  } else {
    setStatus('Weiter geht\'s!');
  }
  renderScores();
}

function spielEnde() {
  const dauer = Date.now() - spiel.start;
  const liste = $('#ranking');
  liste.innerHTML = '';

  if (spiel.spieler.length === 1) {
    const s = spiel.spieler[0];
    $('#resultTitle').textContent = 'Geschafft, ' + s.name + '!';
    liste.innerHTML =
      '<li style="--pc:' + s.farbe + '"><span>Züge</span><span class="stat">' + s.zuege + ' (ideal: ' + spiel.paare + ')</span></li>' +
      '<li style="--pc:' + s.farbe + '"><span>Zeit</span><span class="stat">' + zeitFormat(dauer) + '</span></li>';
  } else {
    const sortiert = [...spiel.spieler].sort((p, q) => q.punkte - p.punkte);
    const best = sortiert[0].punkte;
    const sieger = sortiert.filter((s) => s.punkte === best);
    $('#resultTitle').textContent = sieger.length > 1
      ? 'Unentschieden!'
      : sieger[0].name + ' gewinnt!';
    let platz = 0, vorher = null;
    sortiert.forEach((s, i) => {
      if (s.punkte !== vorher) { platz = i + 1; vorher = s.punkte; }
      const li = document.createElement('li');
      li.style.setProperty('--pc', s.farbe);
      if (s.punkte === best) li.classList.add('winner');
      li.innerHTML = '<span>' + platz + '. ' + escapeHtml(s.name) + '</span><span>' + s.punkte + (s.punkte === 1 ? ' Paar' : ' Paare') + '</span>';
      liste.appendChild(li);
    });
  }
  $('#result').classList.remove('hidden');
  $('#againBtn').focus();
}

function zeigeScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
}

function zumMenue() {
  if (spiel?.timer) clearTimeout(spiel.timer);
  spiel = null;
  $('#result').classList.add('hidden');
  $('#confirm').classList.add('hidden');
  renderSetup();
  zeigeScreen('setup');
}

/* ================= Events ================= */

$('#startBtn').onclick = neuesSpiel;
$('#againBtn').onclick = () => { $('#result').classList.add('hidden'); neuesSpiel(); };
$('#setupBtn').onclick = zumMenue;
$('#menuBtn').onclick = () => {
  if (!spiel || spiel.gefunden === 0) return zumMenue();
  $('#confirm').classList.remove('hidden');
};
$('#confirmYes').onclick = zumMenue;
$('#confirmNo').onclick = () => $('#confirm').classList.add('hidden');

let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(layout, 80); });

renderSetup();

// Offline-Fähigkeit
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
