// Kartensets – neue Motive einfach hier ergänzen.
// Jedes Motiv: id (eindeutig), img (Pfad), optional text (für Bild–Text-Modus und Hinweis bei Treffer),
// optional gleichWie (id eines anderen Motivs mit demselben Bild → im Set "Gemischt" nur einmal).
// Baderegel-Texte: offizieller Wortlaut (DLRG-Plakat Baderegeln 2024). Kurztitel selbst formuliert.

// Klassische Kacheln, die es auch als Baderegel gibt (gleiches Bild, andere Größe).
const GLEICHES_MOTIV = {
  k02: 'b06', k03: 'b05', k05: 'b03', k06: 'b09', k07: 'b07', k08: 'b10',
  k11: 'e07', k12: 'e03', k13: 'e09', k14: 'e04', k15: 'e06', k16: 'e10',
};

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
      { id: 'b01', img: 'img/baderegeln/b01.webp', titel: 'Wohlfühlen', text: 'Ich gehe nur baden, wenn ich mich gut fühle.' },
      { id: 'b02', img: 'img/baderegeln/b02.webp', titel: 'Mit Aufsicht baden', text: 'Ich gehe nur baden, wenn mir bei Problemen jemand helfen kann.' },
      { id: 'b03', img: 'img/baderegeln/b03.webp', titel: 'Um Hilfe rufen', text: 'Wenn ich Probleme im Wasser habe, dann rufe ich laut um Hilfe und winke mit den Armen. Ich helfe Anderen, wenn sie im Wasser Probleme haben. Ich rufe nie „Hilfe“, wenn alles in Ordnung ist.' },
      { id: 'b04', img: 'img/baderegeln/b04.webp', titel: 'Bescheid sagen', text: 'Ich sage Bescheid, wenn ich ins Wasser gehe.' },
      { id: 'b05', img: 'img/baderegeln/b05.webp', titel: 'Nicht hungrig, nicht satt', text: 'Ich gehe weder hungrig noch direkt nach dem Essen ins Wasser.' },
      { id: 'b06', img: 'img/baderegeln/b06.webp', titel: 'Erst abkühlen', text: 'Ich kühle mich ab, bevor ich ins Wasser gehe.' },
      { id: 'b07', img: 'img/baderegeln/b07.webp', titel: 'Erst prüfen, dann springen', text: 'Ich gehe nur da baden, wo es erlaubt ist. Ich springe nur da ins Wasser, wo das Wasser tief und frei ist.' },
      { id: 'b08', img: 'img/baderegeln/b08.webp', titel: 'Rücksicht nehmen', text: 'Ich nehme Rücksicht! Ich renne nicht, schubse nicht und drücke niemanden unter Wasser.' },
      { id: 'b09', img: 'img/baderegeln/b09.webp', titel: 'Schwimmtiere sind keine Hilfe', text: 'Schwimmflügel, Schwimmtiere und Luftmatratze sind nicht sicher und schützen mich nicht vor dem Ertrinken.' },
      { id: 'b10', img: 'img/baderegeln/b10.webp', titel: 'Bei Gewitter raus', text: 'Wenn ich draußen bade, gehe ich sofort aus dem Wasser, wenn es blitzt, donnert oder stark regnet. Baden bei Gewitter ist lebensgefährlich.' },
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
    id: 'eisregeln',
    name: 'Eisregeln',
    beschreibung: 'Wann darf ich aufs Eis?',
    textModus: true,
    textLabel: 'Regeltext',
    motive: [
      ['Nicht zu früh aufs Eis', 'Gehe nicht gleich an den ersten kalten Tagen aufs Eis!'],
      ['Anderen helfen', 'Hilf anderen, wenn sie Hilfe brauchen.'],
      ['Auf Warnungen achten', 'Achte auf Warnungen im Radio und in der Zeitung.'],
      ['Flach hinlegen', 'Lege dich flach aufs Eis und bewege dich auf dem gleichen Weg zurück Richtung Ufer, wenn du einzubrechen drohst.'],
      ['Eisdicke prüfen', 'Betritt einen See erst, wenn das Eis 15 cm dick ist. Ein fließendes Gewässer erst, wenn das Eis 20 cm stark ist.'],
      ['Knackt es: runter!', 'Verlasse das Eis sofort, wenn es knistert und knackt!'],
      ['Nie alleine', 'Gehe nie alleine aufs Eis!'],
      ['Kein falscher Alarm', 'Rufe nie um Hilfe, wenn du nicht wirklich in Gefahr bist, aber hilf anderen, wenn sie Hilfe brauchen.'],
      ['Gewicht verteilen', 'Um das Gewicht zu verteilen, rette andere mit einem Brett, einer Leiter oder einem umgedrehten Schlitten.'],
      ['Aufwärmen', 'Wärme den Geretteten mit Decken und trockenen Kleidern wieder auf.'],
      ['Notarzt rufen', 'Rufe nach der Rettung einen Notarzt. Eine Unterkühlung kann lebensbedrohlich sein.'],
      ['Beim Amt erkundigen', 'Erkundige dich beim zuständigen Amt, ob das Eis schon trägt!'],
    ].map(([titel, text], i) => {
      const id = 'e' + String(i + 1).padStart(2, '0');
      return { id, name: titel, titel, text, img: 'img/eisregeln/' + id + '.webp' };
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

// Welche Sets im Spiel auswählbar sind. Die übrigen Motive bleiben erhalten
// und können hier einfach wieder freigeschaltet werden,
// z. B. ['baderegeln', 'rettungsgeraete', 'klassisch', 'wasserwelt', 'gemischt'].
const AKTIVE_SETS = ['baderegeln', 'eisregeln', 'rettungsgeraete'];
window.ALLE_CARD_SETS = window.CARD_SETS;
window.CARD_SETS = AKTIVE_SETS.map((id) => window.ALLE_CARD_SETS.find((s) => s.id === id)).filter(Boolean);
