# DLRG Memo-Spiel

Memory-Spiel im Browser mit den DLRG-Enten (klassisches Memory), den Baderegeln, den Rettungsgeräten und der Wasserwelt.
Läuft als PWA auf PC, Tablet und Smartphone – auch offline.

## Spielregeln
- 1–4 Spieler, reihum
- Zwei Karten aufdecken: gleiches Motiv = 1 Punkt, Karten bleiben liegen und der Spieler ist **nochmal dran**
- Kein Paar: Karten drehen sich nach 1,5 s zurück (oder sofort per Tipp), der nächste Spieler ist dran
- Baderegeln wahlweise als **Bild + Bild** oder **Bild + Regeltext**; bei jedem gefundenen Paar wird die Regel eingeblendet
- Spielfelder 3×4, 4×4, 4×5 und 5×6 (nur gerade Kartenzahlen); ein Feld ist nur wählbar, wenn das Set genug Motive hat
- Die aufgedeckten Karten werden zusätzlich groß unter dem Spielfeld angezeigt (im Querformat daneben)

## Kartensets freischalten
Aktuell sind nur **Baderegeln** und **Rettungsgeräte** auswählbar. Klassisch, Wasserwelt und Gemischt sind vorhanden, aber ausgeblendet – freischalten über `AKTIVE_SETS` am Ende von `cards.js`.

## Neue Motive hinzufügen
1. Bild (quadratisch, ca. 480 px, WebP) nach `img/<set>/` legen
2. Eintrag in `cards.js` ergänzen
3. Dateiliste in `sw.js` ergänzen und `VERSION` hochzählen (sonst sehen installierte Apps die Änderung nicht)

## Lokal testen
```
python3 -m http.server 8000
```
→ http://localhost:8000

## Hinweis zu den Bildern
Die Illustrationen sind Material der DLRG. Vor einer öffentlichen Veröffentlichung Nutzungsrechte klären.
Die aktuellen Bilder sind aus Screenshots geschnitten (klassische Kacheln nur 126 px) – Originaldateien ersetzen sie 1:1.
Die Baderegel-Texte in `cards.js` sind Entwürfe und sollten mit dem offiziellen Wortlaut abgeglichen werden.

## Lizenz
Der **Programmcode** (HTML, CSS, JavaScript) steht unter der [MIT-Lizenz](LICENSE).

Die **Bilder** in `img/` und `icons/` sind davon ausdrücklich **ausgenommen**: Sie sind
Material der DLRG bzw. aus Screenshots abgeleitet und **nicht** unter MIT lizenziert.
Für deren Nutzung, Weitergabe oder Veröffentlichung sind die Rechte separat bei der DLRG
zu klären.
