// Kartensets – neue Motive einfach hier ergänzen.
// Jedes Motiv: id (eindeutig), img (Pfad), optional text (für Bild–Text-Modus und Hinweis bei Treffer).
// Die Baderegel-Texte sind Entwürfe – bitte mit den offiziellen DLRG-Baderegeln abgleichen.
window.CARD_SETS = [
  {
    id: 'klassisch',
    name: 'Klassisch',
    beschreibung: 'Das klassische DLRG-Memory',
    motive: Array.from({ length: 16 }, (_, i) => {
      const n = String(i + 1).padStart(2, '0');
      return { id: 'k' + n, img: 'img/klassisch/k' + n + '.webp' };
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

// "Gemischt" wird automatisch aus allen Sets gebildet.
window.CARD_SETS.push({
  id: 'gemischt',
  name: 'Gemischt',
  beschreibung: 'Alle Motive zusammen',
  motive: window.CARD_SETS.flatMap((s) => s.motive),
});
