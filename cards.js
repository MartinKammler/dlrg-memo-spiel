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
    textLabel: 'Regeltext',
    motive: [
      { id: 'b01', img: 'img/baderegeln/b01.webp', titel: 'Wohlfühlen', text: 'Geh nur baden, wenn du dich wohlfühlst.' },
      { id: 'b02', img: 'img/baderegeln/b02.webp', titel: 'Mit Aufsicht baden', text: 'Bade am besten dort, wo Rettungsschwimmer aufpassen.' },
      { id: 'b03', img: 'img/baderegeln/b03.webp', titel: 'Anderen helfen', text: 'Ruf nur um Hilfe, wenn du in Gefahr bist – und hilf anderen, wenn sie Hilfe brauchen.' },
      { id: 'b04', img: 'img/baderegeln/b04.webp', titel: 'Bescheid sagen', text: 'Sag einem Erwachsenen Bescheid, bevor du ins Wasser gehst.' },
      { id: 'b05', img: 'img/baderegeln/b05.webp', titel: 'Nicht mit vollem Bauch', text: 'Geh nicht mit vollem Bauch ins Wasser.' },
      { id: 'b06', img: 'img/baderegeln/b06.webp', titel: 'Erst abkühlen', text: 'Kühl dich ab, bevor du ins Wasser gehst.' },
      { id: 'b07', img: 'img/baderegeln/b07.webp', titel: 'Erst prüfen, dann springen', text: 'Spring nur ins Wasser, wenn es frei und tief genug ist.' },
      { id: 'b08', img: 'img/baderegeln/b08.webp', titel: 'Rücksicht nehmen', text: 'Habt zusammen Spaß – aber nicht rennen, schubsen oder untertauchen!' },
      { id: 'b09', img: 'img/baderegeln/b09.webp', titel: 'Schwimmtiere sind keine Hilfe', text: 'Luftmatratzen und Schwimmtiere sind keine Schwimmhilfe.' },
      { id: 'b10', img: 'img/baderegeln/b10.webp', titel: 'Bei Gewitter raus', text: 'Bei Gewitter sofort raus aus dem Wasser!' },
    ],
  },
  {
    id: 'rettungsgeraete',
    name: 'Rettungsgeräte',
    beschreibung: 'Rettungsgeräte kennenlernen',
    textModus: true,
    textLabel: 'Name',
    // Erklärungen sind Entwürfe – bitte fachlich prüfen.
    motive: [
      ['Wurfsack', 'Die Leine liegt im Sack. Man wirft ihn der Person im Wasser zu und zieht sie an Land.'],
      ['Rettungsbrett', 'Damit paddelt man schnell zur Person und bringt sie darauf liegend an Land.'],
      ['Rettungsball mit Wurfleine', 'Der Ball wird der Person mit der Leine zugeworfen.'],
      ['Fernglas', 'Damit behält man die Wasserfläche im Blick und erkennt Gefahren früh.'],
      ['Rettungsring', 'Wird der Person zugeworfen – sie hält sich daran fest.'],
      ['Rettungsleine', 'Rettungsgurt mit Leine: Der Retter trägt den Gurt und wird vom Ufer aus gesichert und zurückgezogen.'],
      ['Rettungsboje', 'Fester Auftriebskörper mit Griffen – der Retter schwimmt ihn zur Person.'],
      ['Gurtretter', 'Weicher Auftriebskörper, wird um die Person gelegt und verschlossen.'],
    ].map(([titel, text], i) => {
      const id = 'r' + String(i + 1).padStart(2, '0');
      return { id, name: titel, titel, text, img: 'img/rettungsgeraete/' + id + '.webp' };
    }),
  },
  {
    id: 'wasserwelt',
    name: 'Wasserwelt',
    beschreibung: 'Tiere und Schätze aus dem Meer',
    // Nummern bleiben fest an den Bilddateien; entfernte Motive (ähnlich zu anderen): w10, w11
    motive: [
      [1, 'Wal'], [2, 'Krake'], [3, 'Robbe'], [4, 'Makrele'], [5, 'Papageifisch'], [6, 'Falterfisch'],
      [7, 'Fischschwarm'], [8, 'Roter Streifenfisch'], [9, 'Pinker Fisch'], [12, 'Seepferdchen'],
      [13, 'Schatztruhe'], [14, 'Kugelfisch'], [15, 'Anglerfisch'], [16, 'Krabbe'], [17, 'Qualle'],
      [18, 'Muschel mit Perle'], [19, 'DLRG-Schildkröte'],
    ].map(([n, name]) => {
      const id = 'w' + String(n).padStart(2, '0');
      return { id, name, img: 'img/wasserwelt/' + id + '.webp' };
    }),
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
