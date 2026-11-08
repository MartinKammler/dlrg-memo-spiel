# DLRG Memo-Spiel

> **Programmiert von Martin Kammler, Mitglied der DLRG.**
>
> Dieses Spiel ist privat entstanden und wird der DLRG **kostenlos** zur Verfügung gestellt –
> zur freien Verwendung in der **DLRG-Jugendarbeit und in der Ausbildung**, in allen
> Gliederungen, ohne Lizenzgebühren.
>
> Der **Programmcode** stammt von Martin Kammler und steht unter der [MIT-Lizenz](LICENSE).
> Die **Bilder, Illustrationen, Regeltexte und das Logo** sind Material der DLRG (© DLRG)
> und sind von der MIT-Lizenz ausgenommen.

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
Aktuell sind nur **Baderegeln**, **Eisregeln** und **Rettungsgeräte** auswählbar. Klassisch, Wasserwelt und Gemischt sind vorhanden, aber ausgeblendet – freischalten über `AKTIVE_SETS` am Ende von `cards.js`.

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
Die Illustrationen sind Material der DLRG (siehe Urheberrecht und Lizenz unten). Für eine Weitergabe oder Veröffentlichung außerhalb der DLRG-Arbeit sind die Nutzungsrechte mit der DLRG zu klären.
Die aktuellen Bilder sind aus Screenshots geschnitten (klassische Kacheln nur 126 px) – Originaldateien ersetzen sie 1:1.
Die Baderegel-Texte entsprechen dem offiziellen DLRG-Plakat „Baderegeln“ (2024).

## Urheberrecht und Lizenz

**Programmcode** (HTML, CSS, JavaScript) – Autor: **Martin Kammler**, 2026.
Lizenziert unter der [MIT-Lizenz](LICENSE).

**Bilder, Illustrationen, Baderegel-/Eisregel-Texte und das DLRG-Logo** in `img/` und `icons/`:
© Deutsche Lebens-Rettungs-Gesellschaft (DLRG). Diese Inhalte sind von der MIT-Lizenz
**ausdrücklich ausgenommen** und werden hier nur zur Nutzung im Rahmen der DLRG-Ausbildungs-
und Öffentlichkeitsarbeit eingebunden. Eine Weitergabe, Veränderung oder anderweitige
Veröffentlichung ist nur mit Genehmigung der DLRG zulässig; die Rechte sind separat
bei der DLRG zu klären.

Das DLRG-Logo ist eine geschützte Marke der DLRG. Dieses Projekt ist ein privates
Hilfsmittel und kein offizielles Angebot der DLRG.
