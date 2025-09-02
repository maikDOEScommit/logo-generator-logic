Hallo Claude. Du übernimmst die Rolle eines leitenden Software-Architekten für ein anspruchsvolles Next.js-Projekt. Deine Aufgabe ist es, ein bestehendes, funktionierendes Projekt zu analysieren und es anschließend in eine saubere, skalierbare und professionelle Code-Struktur zu überführen (Refactoring).
Bitte folge den Anweisungen exakt und führe die Phasen nacheinander aus.
Phase 1: Umfassende Projekt-Analyse (Deine "Lese- und Verstehens-Phase")

Bevor du eine einzige Zeile Code schreibst, musst du das Projekt in seiner Gesamtheit verstehen. Deine erste Aufgabe ist es, die folgenden Informationen zu analysieren und zu verinnerlichen.

1. Das übergeordnete Ziel des Projekts: Wir bauen einen intelligenten Logo-Generator. Das Kernprinzip ist "Geführte Kreation statt unbegrenzter Freiheit". Anstatt dem Benutzer ein leeres Blatt zu geben, führen wir ihn durch einen strategischen Prozess, der auf den "10 goldenen Regeln des Designs" basiert. Jedes Ergebnis muss garantiert professionell und ästhetisch ansprechend sein. Die gesamte Logik läuft clientseitig im Browser, um maximale Performance und minimale Serverkosten zu gewährleisten.
2. Der aktuelle Zustand des Codes: Das Projekt ist derzeit ein funktionierender Prototyp. Die gesamte Anwendungslogik und alle UI-Komponenten sind aus didaktischen Gründen in einer einzigen, monolithischen Datei (app/page.tsx) zusammengefasst. Das ist nicht skalierbar und muss geändert werden.
3. Analyse des bestehenden Codes: Studiere nun den folgenden Code, um die Kernfunktionen zu verstehen. Achte darauf, wie die Schritte, die Zustandsverwaltung (mit useReducer für Undo/Redo) und die Vorschau-Logik miteinander verbunden sind.
   Aktuelle monolithische Hauptkomponente (app/page.tsx):
   • Verwaltet den aktuellen Schritt des Generators (Branche, Markeninfo, Design).
   • Beinhaltet die gesamte UI für alle Schritte.
   • Enthält die Logik für die Vorschau-Tabs (Preview & Mockups).
   • Enthält die LogoCanvas- und MockupPreview-Komponenten.
   • Initialisiert den useReducer für den Logo-Zustand.
   Aktuelle Daten- und Typen-Dateien (lib/):
   • lib/data.ts: Enthält das "Wissen" der Engine – kuratierte Icons, Schriften, Layouts und Farbpaletten mit intelligenten Metadaten (Tags).
   • lib/types.ts: Definiert alle TypeScript-Typen für die Datenstrukturen.
   • lib/state.ts: Enthält die logoReducer-Logik und die initialen Zustände.
   Bestätige, dass du den Zweck, die Philosophie und die aktuelle monolithische Struktur des Projekts verstanden hast, bevor du mit Phase 2 fortfährst.

Phase 2: Die Refactoring-Ausführung (Deine "Schreib-Phase")
Nachdem du den Kontext vollständig verstanden hast, ist deine Aufgabe nun, das Projekt in eine saubere, professionelle und skalierbare Architektur zu überführen.
Dein Ziel ist es, die folgende Dateistruktur zu erstellen (den Inhalt der einzelnen Dateien kriegst du anschliessend fuer alle files!!!!):

logo-generator-pro/
├── app/
│ ├── globals.css # Globale CSS-Stile, die in der gesamten Anwendung gelten.
│ ├── layout.tsx # Das Root-Layout, das jede Seite umgibt. Hier sind ClerkProvider und die Haupt-Schriftart integriert.
│ └── page.tsx # Die zentrale Komponente für die Hauptseite des Logo-Generators. Enthält die gesamte UI und Logik für den Erstellungsprozess.
│
├── components/
│ └── Header.tsx # Die wiederverwendbare Header-Komponente, die den Markennamen und die dynamischen Login/Profil-Buttons anzeigt.
│
├── lib/
│ ├── data.ts # Das "Gehirn" der Anwendung. Enthält alle kuratierten Daten: Icons, Schriften, Layouts und Farbpaletten mit ihren Metadaten.
│ ├── state.ts # Die Logik für die Zustandsverwaltung. Enthält den useReducer für die Undo/Redo-Funktionalität.
│ └── types.ts # Definiert alle TypeScript-Typen für das Projekt, um Typsicherheit und Code-Qualität zu gewährleisten.
│
├── .env.local.example # Eine Vorlage für die notwendigen Umgebungsvariablen (API-Schlüssel für Clerk und später die Datenbank).
├── .gitignore # Standard-Git-Datei, um unwichtige Dateien (wie node_modules) von der Versionskontrolle auszuschließen.
├── middleware.ts # Die Clerk-Middleware. Sie fängt Anfragen ab und schützt Routen, um sicherzustellen, dass nur eingeloggte Benutzer auf geschützte Bereiche zugreifen können.
├── next.config.mjs # Die Hauptkonfigurationsdatei für Next.js.
├── package.json # Definiert alle Projektabhängigkeiten (wie Next.js, React, Clerk, Tailwind CSS) und die verfügbaren Skripte (dev, build, start).
├── postcss.config.js # Konfigurationsdatei für PostCSS, wird von Tailwind CSS benötigt.
├── tailwind.config.ts # Konfigurationsdatei für das Tailwind CSS-Framework, hier werden Farben, Animationen etc. definiert.
├── tsconfig.json # Die Hauptkonfigurationsdatei für den TypeScript-Compiler.
└── weg.md # Unsere strategische Roadmap. Dokumentiert die Architektur, die getroffenen Entscheidungen und den Fortschritt des Projekts.
