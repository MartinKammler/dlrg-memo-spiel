// Kartensets – neue Motive einfach hier ergänzen.
// Jedes Motiv: id (eindeutig), img (Pfad), optional text (für Bild–Text-Modus und Hinweis bei Treffer),
// optional gleichWie (id eines anderen Motivs mit demselben Bild → im Set "Gemischt" nur einmal).
// Die Baderegel-Texte sind Entwürfe – bitte mit den offiziellen DLRG-Baderegeln abgleichen.

// Klassische Kacheln, die es auch als Baderegel gibt (gleiches Bild, andere Größe).
const GLEICHES_MOTIV = { k02: 'b06', k03: 'b05', k05: 'b03', k06: 'b09', k07: 'b07', k08: 'b10' };

window.CARD_SETS = [
  {
    id: 'klassisch',
    name: 'Klassisch',
    beschreibung: 'Das klassische DLRG-Memory',
    motive: Array.from({ length: 16 }, (_, i) => {
      const id = 'k' + String(i + 1).padStart(2, '0');
      return { id, img: 'img/klassisch/' + id + '.webp', gleichWie: GLEICHES_MOTIV[id] };
    }),
  },
  {
    id: 'baderegeln',
    name: 'Baderegeln',
    beschreibung: 'Die aktuellen Baderegeln',
    textModus: true,
    motive: [
      { id: 'b01', img: 'img/baderegeln/b01.webp', text: 'Geh nur baden, wenn du dich wohlfühlst.' },
      { id: 'b02', img: 'img/baderegeln/b02.webp', text: 'Bade am besten dort, wo Rettungsschwimmer aufpassen.' },
      { id: 'b03', img: 'img/baderegeln/b03.webp', text: 'Ruf nur um Hilfe, wenn du in Gefahr bist – und hilf anderen, wenn sie Hilfe brauchen.' },
      { id: 'b04', img: 'img/baderegeln/b04.webp', text: 'Sag einem Erwachsenen Bescheid, bevor du ins Wasser gehst.' },
      { id: 'b05', img: 'img/baderegeln/b05.webp', text: 'Geh nicht mit vollem Bauch ins Wasser.' },
      { id: 'b06', img: 'img/baderegeln/b06.webp', text: 'Kühl dich ab, bevor du ins Wasser gehst.' },
      { id: 'b07', img: 'img/baderegeln/b07.webp', text: 'Spring nur ins Wasser, wenn es frei und tief genug ist.' },
      { id: 'b08', img: 'img/baderegeln/b08.webp', text: 'Habt zusammen Spaß – aber nicht rennen, schubsen oder untertauchen!' },
      { id: 'b09', img: 'img/baderegeln/b09.webp', text: 'Luftmatratzen und Schwimmtiere sind keine Schwimmhilfe.' },
      { id: 'b10', img: 'img/baderegeln/b10.webp', text: 'Bei Gewitter sofort raus aus dem Wasser!' },
    ],
  },
];

// "Gemischt" wird automatisch aus allen Sets gebildet – ohne doppelte Motive.
{
  const alle = window.CARD_SETS.flatMap((s) => s.motive);
  const ids = new Set(alle.map((m) => m.id));
  window.CARD_SETS.push({
    id: 'gemischt',
    name: 'Gemischt',
    beschreibung: 'Alle Motive zusammen',
    motive: alle.filter((m) => !(m.gleichWie && ids.has(m.gleichWie))),
  });
}
