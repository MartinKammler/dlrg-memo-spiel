'use strict';

/* ================= Konfiguration ================= */

// Raster mit gerader Kartenzahl (a ≤ b), Maximum 5×6. Im Querformat werden sie gedreht.
const RASTER = [[3, 4], [4, 4], [4, 5], [5, 6]];
const SPIELER_FARBEN = ['#e30613', '#0069b4', '#2e9e44', '#f39200'];
const ZURUECKDREHEN_MS = 1500;
const SPEICHER_KEY = 'dlrg-memory-settings-v1';

/* ================= Hilfsfunktionen ================= */

const $ = (sel) => document.querySelector(sel);

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

// Gespeichertes Set ist evtl. nicht mehr freigeschaltet
if (!CARD_SETS.some((s) => s.id === settings.set)) settings.set = CARD_SETS[0].id;

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

  // Modus: Bild + Bild oder Bild + Text (nur bei Sets mit Texten)
  const set = aktuellesSet();
  const textMoeglich = !!set.textModus;
  const modeRow = $('#modeRow');
  const textBtn = modeRow.querySelector('[data-mode=text]');
  textBtn.innerHTML = 'Bild&nbsp;+&nbsp;' + escapeHtml(set.textLabel || 'Text');
  textBtn.disabled = !textMoeglich;
  const modusAktiv = textMoeglich ? settings.modus : 'bild';
  modeRow.querySelectorAll('.chip').forEach((b) => {
    b.classList.toggle('selected', b.dataset.mode === modusAktiv);
    b.onclick = () => { settings.modus = b.dataset.mode; renderSetup(); };
  });
  $('#modeHint').textContent = !textMoeglich
    ? 'Bild + Text gibt es bei: ' + CARD_SETS.filter((s) => s.textModus).map((s) => s.name).join(', ') + '.'
    : modusAktiv === 'text'
      ? 'Zu jedem Bild gehört eine Karte mit ' + (set.textLabel === 'Name' ? 'Namen und Erklärung.' : 'dem Regeltext.')
      : 'Zwei gleiche Bilder bilden ein Paar.';

  // Raster
  const motive = aktuellesSet().motive.length;
  const gridChoice = $('#gridChoice');
  gridChoice.innerHTML = '';
  let auswahlGueltig = false;
  let groessteGueltige = null;
  for (const [a, b] of RASTER) {
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

  const naechstes = RASTER.find(([a, b]) => (a * b) / 2 > motive);
  $('#gridHint').textContent = naechstes
    ? naechstes[0] + '×' + naechstes[1] + ' braucht ' + (naechstes[0] * naechstes[1]) / 2 + ' Motive – dieses Set hat ' + motive + '.'
    : '';

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
    vorschau: [],       // Karten, die groß in der Vorschau stehen
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

function faceHtml(k) {
  if (k.art === 'text') {
    return '<div class="face text"><span>' + (k.motiv.titel ? '<strong class="titel">' + escapeHtml(k.motiv.titel) + '</strong>' : '') + escapeHtml(k.motiv.text) + '</span></div>';
  }
  // Lernsets im Bild-Modus: Bezeichnung unter das Bild schreiben
  if (k.motiv.titel && !spiel.textModus) {
    return '<div class="face captioned"><img src="' + k.motiv.img + '" alt="" draggable="false"><span class="caption">' + escapeHtml(k.motiv.titel) + '</span></div>';
  }
  return '<div class="face"><img src="' + k.motiv.img + '" alt="" draggable="false"></div>';
}

function baueBrett() {
  const board = $('#board');
  board.innerHTML = '';
  spiel.karten.forEach((k, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'card';
    el.setAttribute('aria-label', 'Karte ' + (i + 1) + ', verdeckt');
    el.innerHTML = '<div class="inner"><div class="back" aria-hidden="true"></div>' + faceHtml(k) + '</div>';
    el.addEventListener('click', () => karteGeklickt(i));
    k.el = el;
    board.appendChild(el);
  });
}

// Spielfeld + Vorschau der aufgedeckten Karten.
// Hochformat: Vorschau unter dem Feld, jede Karte halb so breit wie das Feld.
// Querformat: Vorschau rechts daneben, jede Karte halb so hoch wie das Feld.
function layout() {
  if (!spiel) return;
  const wrap = $('#boardWrap');
  const W = wrap.clientWidth - 16;
  const H = wrap.clientHeight - 8;
  const quer = W > H * 1.15;
  wrap.classList.toggle('quer', quer);
  const cols = quer ? spiel.b : spiel.a;
  const rows = quer ? spiel.a : spiel.b;
  const gap = Math.max(4, Math.min(10, Math.floor(Math.min(W, H) / 60)));
  let size;
  if (quer) {
    // Breite: cols*s + (cols-1)g + 2g + Vorschau (rows*s + (rows-2)g)/2
    const sW = (W - (cols - 1) * gap - 2 * gap - ((rows - 2) * gap) / 2) / (cols + rows / 2);
    const sH = (H - (rows - 1) * gap) / rows;
    size = Math.min(sW, sH);
  } else {
    // Höhe: rows*s + (rows-1)g + 2g + Vorschau (cols*s + (cols-2)g)/2
    const sW = (W - (cols - 1) * gap) / cols;
    const sH = (H - (rows - 1) * gap - 2 * gap - ((cols - 2) * gap) / 2) / (rows + cols / 2);
    size = Math.min(sW, sH);
  }
  size = Math.max(20, Math.floor(size));
  const board = $('#board');
  board.style.setProperty('--cols', cols);
  board.style.setProperty('--card', size + 'px');
  board.style.setProperty('--gap', gap + 'px');
  const brett = quer ? rows * size + (rows - 1) * gap : cols * size + (cols - 1) * gap;
  const pv = Math.floor((brett - gap) / 2);
  const preview = $('#preview');
  preview.style.setProperty('--card', pv + 'px');
  preview.style.setProperty('--gap', gap + 'px');
  for (const k of spiel.karten) passeAn(k.el, size);
  zeigeVorschau();
}

// Schrift auf Text- und beschrifteten Karten an die Kartengröße anpassen
function passeAn(el, size) {
  const cap = el.querySelector('.caption');
  if (cap) {
    // Beschriftung: höchstens zwei Zeilen, sonst Schrift verkleinern
    let fs = size * 0.11;
    cap.style.fontSize = fs + 'px';
    const cs = getComputedStyle(cap);
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    while (fs > 6 && (cap.scrollHeight > pad + fs * 1.1 * 2 + 2 || cap.scrollWidth > cap.clientWidth + 1)) {
      fs -= 0.5;
      cap.style.fontSize = fs + 'px';
    }
    return;
  }
  const face = el.querySelector('.face.text');
  if (!face) return;
  let fs = size * 0.17;
  face.style.fontSize = fs + 'px';
  while (fs > 6 && (face.scrollHeight > face.clientHeight + 1 || face.scrollWidth > face.clientWidth + 1)) {
    fs -= 0.5;
    face.style.fontSize = fs + 'px';
  }
}

// Die aufgedeckten Karten groß in der Vorschau zeigen
function zeigeVorschau() {
  if (!spiel) return;
  const slots = document.querySelectorAll('#preview .pv-slot');
  const size = parseFloat($('#preview').style.getPropertyValue('--card')) || 100;
  slots.forEach((slot, n) => {
    const i = spiel.vorschau[n];
    slot.innerHTML = '';
    slot.classList.toggle('leer', i === undefined);
    if (i === undefined) return;
    const k = spiel.karten[i];
    const el = document.createElement('div');
    el.className = 'card open' + (k.gefunden ? ' matched' : '');
    if (k.gefunden) el.style.setProperty('--mc', k.el.style.getPropertyValue('--mc'));
    el.innerHTML = '<div class="inner">' + faceHtml(k) + '</div>';
    slot.appendChild(el);
    passeAn(el, size);
  });
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
  // Feste Schildgröße: Schrift verkleinern, bis der Text hineinpasst
  let fs = 17;
  st.style.fontSize = fs + 'px';
  while (fs > 10 && st.scrollHeight > st.clientHeight + 1) {
    fs -= 0.5;
    st.style.fontSize = fs + 'px';
  }
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
  if (spiel.offen.length === 0) spiel.vorschau = [];
  spiel.vorschau.push(i);
  k.el.setAttribute('aria-label', 'Karte ' + (i + 1) + ', ' + (k.art === 'text' ? infoText(k.motiv) : k.motiv.name || 'Bild ' + k.key));
  spiel.offen.push(i);
  zeigeVorschau();

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
    zeigeVorschau();
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
  spiel.vorschau = [];
  zeigeVorschau();
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
