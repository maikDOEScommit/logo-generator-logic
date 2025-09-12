Hallo! Du bist ein Experte für KI-gestütztes Design und Programmierung. Deine Aufgabe ist es, ein in sich geschlossenes HTML-Dokument zu erstellen, das JavaScript und CSS enthält, um ein komplexes Problem der Markenvisualisierung zu lösen.

Das Ziel:
Das Skript soll den Prozess der Auswahl der besten Farbkombinationen für ein Logo automatisieren, basierend auf fest vordefinierten Farbpaletten mit je drei Farben. Anstatt manuell Hunderte von Varianten zu testen, soll das Skript die Kombinationen für eine gegebene Palette intelligent bewerten (hauptsächlich nach Lesbarkeit und Kontrast) und nur die 12 besten, vielfältigsten Optionen rendern. Das Ergebnis soll eine kuratierte Auswahl sein, die sofort für Design-Präsentationen verwendet werden kann.

Teil 1: Theoretische Grundlagen und alle möglichen Kombinationen
Um den Umfang zu verstehen, müssen wir zuerst alle denkbaren Kombinationen auflisten. Unser Logo besteht aus drei Elementen: Brandname (Text), Icon und Hintergrund.

Die Farbpalette besteht aus drei Farben: Farbe A, Farbe B, Farbe C.

Die Hintergründe können sein:

Einfarbig Weiß

Einfarbig Schwarz

Einfarbig Farbe A, B oder C

Ein linearer Farbverlauf, der aus den Palettenfarben erstellt wird (z. B. von A nach B, von B nach C usw.)

Mögliche Kombinationen (als Referenz für dich):

Auf weißem/schwarzem Hintergrund:

Brandname und Icon können jede der 3 Farben haben. Das ergibt 3x3 = 9 Kombinationen pro Hintergrundfarbe (Weiß/Schwarz).

Total: 18 Kombinationen

Auf farbigem Hintergrund (Farbe A, B oder C):

Für jeden der 3 farbigen Hintergründe können Brandname und Icon wieder jeweils 3 Farben annehmen.

Das ergibt 3 (Hintergründe) _ 3 (Brandname-Farben) _ 3 (Icon-Farben) = 27 Kombinationen.

Total: 27 Kombinationen

Auf Gradient-Hintergrund:

Wir können mindestens 6 grundlegende Verläufe definieren (A→B, B→A, A→C, C→A, B→C, C→B).

Für jeden dieser Verläufe gibt es wieder 9 Kombinationen für Brandname und Icon.

Total: 6 \* 9 = 54 Kombinationen

Insgesamt gibt es also fast 100 mögliche Varianten pro Palette, aus denen wir die besten auswählen müssen.

Teil 2: Deine Programmier-Aufgabe – Die Implementierung
Erstelle eine einzelne HTML-Datei (logo_evaluator.html), die alles Notwendige enthält (HTML-Struktur, CSS für das Styling und JavaScript für die gesamte Logik).

1. Setup & Eingabedaten (im JavaScript):

Definiere hier deine festen, existierenden Farbpaletten. Das Skript soll diese Paletten evaluieren, nicht neue erfinden. Strukturiere sie als Array von Objekten:

const predefinedPalettes = [
{
name: "Corporate Blue",
colors: { colorA: '#0D3B66', colorB: '#FAF0CA', colorC: '#F4D35E' }
},
{
name: "Natural Earth",
colors: { colorA: '#4A442D', colorB: '#A2A569', colorC: '#E9E7DA' }
},
{
name: "Vibrant Sunset",
colors: { colorA: '#F46036', colorB: '#2E294E', colorC: '#EAD2AC' }
}
];

Definiere Platzhalter für den Markennamen (z. B. "BrandName") und ein Icon (verwende ein inline-SVG für ein einfaches geometrisches Symbol, z. B. ein Kreis oder Quadrat, damit keine externen Abhängigkeiten nötig sind).

2. Generierung aller Kombinationen:

Schreibe eine Funktion, die programmatisch ein Array von Objekten generiert, das alle oben beschriebenen Kombinationen für eine gegebene Palette repräsentiert. Jedes Objekt sollte die Struktur haben:

{
id: 'combo_1',
background: { type: 'solid', value: '#FFFFFF' },
brandnameColor: '#0D3B66',
iconColor: '#F4D35E',
score: 0 // initialer Score
}
// oder für einen Gradient:
{
id: 'combo_28',
background: { type: 'gradient', value: 'linear-gradient(to right, #0D3B66, #F4D35E)',- startColor: '#0D3B66', endColor: '#F4D35E' },
brandnameColor: '#FAF0CA',
iconColor: '#FAF0CA',
score: 0
}

Wichtig: Beim Gradient-Objekt die Start- und Endfarben separat speichern, um die Kontrastberechnung zu vereinfachen.

3. Das Evaluierungs- und Scoring-System (Herzstück des Skripts):

Dies ist der wichtigste Teil. Wir bewerten jede Kombination mit einem Score. Ein höherer Score bedeutet eine bessere Kombination. Der Score basiert hauptsächlich auf dem Kontrast.

Implementiere einen Kontrast-Checker:

Schreibe eine Hilfsfunktion, die einen Hex-Farbcode in RGB umwandelt.

Schreibe eine Funktion, die die relative Leuchtdichte einer RGB-Farbe berechnet. Verwende die Standard-WCAG-Formel: L = 0.2126 _ R + 0.7152 _ G + 0.0722 \* B. (Die RGB-Werte müssen zuerst auf einer Skala von 0-1 normalisiert werden).

Schreibe eine Funktion, die das Kontrastverhältnis zwischen zwei Leuchtdichten berechnet: (L1 + 0.05) / (L2 + 0.05).

Implementiere die Haupt-Scoring-Funktion calculateScore(combination):

Diese Funktion nimmt ein Kombinationsobjekt entgegen und gibt einen Score zurück.

Für solide Hintergründe:

Berechne den Kontrast contrast_brandname zwischen brandnameColor und background.value.

Berechne den Kontrast contrast_icon zwischen iconColor und background.value.

Der Basis-Score der Kombination ist der niedrigere der beiden Werte (Math.min(contrast_brandname, contrast_icon)). Dadurch stellen wir sicher, dass beide Elemente lesbar sind.

Für Gradient-Hintergründe (die Herausforderung):

Berechne den Kontrast des brandnameColor sowohl gegen background.startColor als auch gegen background.endColor. Nimm den niedrigeren Wert.

Wiederhole dies für das iconColor.

Der finale Basis-Score für die Gradient-Kombination ist wiederum der allgemeine Minimalwert dieser beiden Ergebnisse. Das ist eine robuste Methode, um "unsichere" Gradient-Kombinationen auszuschließen.

Bonus/Malus-Punkte (Fein-Tuning):

Hierarchie-Malus: Wenn brandnameColor, iconColor und background.value (bei soliden Hintergründen) die exakt gleiche Farbe sind, setze den Score auf 0.

Harmonie-Bonus: Gib einen kleinen Bonus (z. B. score \* 1.1), wenn brandnameColor und iconColor unterschiedlich sind. Das fördert visuell interessantere Kombinationen.

4. Auswahl der besten Kombinationen:

Nachdem alle Kombinationen einen Score haben, führe die finale Auswahl durch:

Filtere die Kombinationen in vier separate Arrays: whiteBg, blackBg, solidColorBg, gradientBg.

Sortiere jedes dieser Arrays absteigend nach dem score.

Wähle die Top-Ergebnisse aus jedem Array aus:

Die besten 2 aus whiteBg.

Die besten 2 aus blackBg.

Die besten 4 aus solidColorBg.

Die besten 4 aus gradientBg.

Fasse diese 12 ausgewählten Kombinationen in einem finalen results-Array zusammen.

5. Rendering des Outputs:

Füge am Anfang der Seite eine UI hinzu (z. B. Buttons oder ein Dropdown-Menü), um zwischen den predefinedPalettes wechseln zu können. Bei einem Wechsel soll die gesamte Auswertung und das Rendering für die neu ausgewählte Palette erneut ausgeführt werden.

Verwende JavaScript, um den <body> der HTML-Datei dynamisch mit den Ergebnissen zu füllen.

Erstelle ein CSS-Grid-Layout, um die 12 ausgewählten Logos ansprechend darzustellen.

Für jede der 12 Kombinationen im results-Array:

Erstelle ein div-Element als Container.

Setze den Hintergrund des Containers entsprechend dem background-Objekt.

Füge innerhalb des Containers das Icon (SVG) mit der iconColor und den Markennamen (in einem p oder h2 Tag) mit der brandnameColor hinzu.

Zeige optional den berechneten Score dezent in einer Ecke an, um die Entscheidung des Skripts nachvollziehbar zu machen.

Styling (CSS): Sorge für ein sauberes, professionelles Aussehen. Verwende Flexbox oder Grid für das Layout der Karten und innerhalb der Karten. Füge box-shadow, border-radius und anständige Schriftarten hinzu, um die Präsentation aufzuwerten.

Das finale Produkt sollte eine Webseite sein, die, sobald sie geladen wird, diesen gesamten Prozess für die erste Palette durchläuft und eine elegante Übersicht der 12 optimalen Logo-Varianten anzeigt, mit der Möglichkeit, die Analyse für andere vordefinierte Paletten neu zu starten. Der gesamte Code muss in einer einzigen Datei enthalten sein.
