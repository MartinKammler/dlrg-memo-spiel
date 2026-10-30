# DLRG Memory

Memory-Spiel im Browser mit den DLRG-Enten (klassisches Memory), den Baderegeln, den Rettungsgeräten und der Wasserwelt.
Läuft als PWA auf PC, Tablet und Smartphone – auch offline.

## Spielregeln
- 1–4 Spieler, reihum
- Zwei Karten aufdecken: gleiches Motiv = 1 Punkt, Karten bleiben liegen und der Spieler ist **nochmal dran**
- Kein Paar: Karten drehen sich nach 1,5 s zurück (oder sofort per Tipp), der nächste Spieler ist dran
- Baderegeln wahlweise als **Bild + Bild** oder **Bild + Regeltext**; bei jedem gefundenen Paar wird die Regel eingeblendet
- Nur Raster mit gerader Kartenzahl (3×4 bis 16×16); auf dem Handy max. 6×6
- Größere Raster werden automatisch freigeschaltet, sobald genug Motive vorhanden sind

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
