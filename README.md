# DLRG Memo-Spiel

> **Programmiert von Martin Kammler, Mitglied der DLRG.**
>
> Dieses Spiel ist privat entstanden und wird der DLRG **kostenlos** zur Verfügung gestellt –
> zur freien Verwendung in der **DLRG-Jugendarbeit und in der Ausbildung**, in allen
> Gliederungen, ohne Lizenzgebühren.
>
> Der **Programmcode** stammt von Martin Kammler und steht unter der [MIT-Lizenz](LICENSE).
> Die **Bilder, Regeltexte und das Logo** sind von der MIT-Lizenz ausgenommen: Bade- und
> Eisregeln stammen aus DLRG-Material (© DLRG), die Rettungsgeräte sind KI-generierte
> Darstellungen, die eng an die DLRG-Originale angelehnt sind.

Memory-Spiel im Browser mit drei Kartensets: **Baderegeln**, **Eisregeln** und **Rettungsgeräte**.
Läuft als PWA auf PC, Tablet und Smartphone – auch offline.

## Spielregeln
- 1–4 Spieler, reihum
- Zwei Karten aufdecken: gleiches Motiv = 1 Punkt, Karten bleiben liegen und der Spieler ist **nochmal dran**
- Kein Paar: Karten drehen sich nach 1,5 s zurück (oder sofort per Tipp), der nächste Spieler ist dran
- Baderegeln wahlweise als **Bild + Bild** oder **Bild + Regeltext**; bei jedem gefundenen Paar wird die Regel eingeblendet
- Spielfelder 3×4, 4×4, 4×5 und 5×6 (nur gerade Kartenzahlen); ein Feld ist nur wählbar, wenn das Set genug Motive hat
- Die aufgedeckten Karten werden zusätzlich groß unter dem Spielfeld angezeigt (im Querformat daneben)

## Kartensets
Im Spiel auswählbar sind **Baderegeln** (10 Motive), **Eisregeln** (12) und **Rettungsgeräte** (8).

Welche Sets angezeigt werden, steht in `AKTIVE_SETS` am Ende von `cards.js`. Das automatisch gebildete Set *Gemischt* (alle Motive zusammen) lässt sich dort freischalten.

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
- **Baderegeln und Eisregeln:** aus DLRG-Material übernommen, teils aus Screenshots der offiziellen Plakate geschnitten – Originaldateien ersetzen sie 1:1. Die Regeltexte entsprechen dem offiziellen DLRG-Plakat „Baderegeln“ (2024) bzw. den Eisregeln.
- **Rettungsgeräte:** mit KI erzeugte Darstellungen, bewusst nah an den DLRG-Originalen gehalten. Keine Fotos, keine DLRG-Dateien.
- **DLRG-Logo:** geschützte Marke der DLRG.

Für eine Weitergabe oder Veröffentlichung außerhalb der DLRG-Arbeit sind die Nutzungsrechte mit der DLRG zu klären.

## Urheberrecht und Lizenz

**Programmcode** (HTML, CSS, JavaScript) – Autor: **Martin Kammler**, 2026.
Lizenziert unter der [MIT-Lizenz](LICENSE).

**Bilder, Regeltexte und das DLRG-Logo** in `img/` und `icons/` sind von der MIT-Lizenz
**ausdrücklich ausgenommen**:

- Bade- und Eisregel-Bilder und -Texte sowie das Logo: © Deutsche Lebens-Rettungs-Gesellschaft
  (DLRG). Eingebunden zur Nutzung im Rahmen der DLRG-Ausbildungs- und Öffentlichkeitsarbeit.
  Weitergabe, Veränderung oder anderweitige Veröffentlichung nur mit Genehmigung der DLRG.
- Rettungsgeräte-Motive: KI-generierte Darstellungen nach dem Vorbild der DLRG-Originale.
  Sie sind keine DLRG-Dateien, bilden das Material aber bewusst nah ab – für eine Nutzung
  außerhalb der DLRG-Arbeit daher ebenfalls vorher mit der DLRG abstimmen.

Das DLRG-Logo ist eine geschützte Marke der DLRG. Dieses Projekt ist ein privates
Hilfsmittel und kein offizielles Angebot der DLRG.
