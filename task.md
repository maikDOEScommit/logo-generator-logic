Der finale Prompt für Claude
ROLE: You are an expert senior Next.js developer specializing in building clean, scalable, and data-driven applications with TypeScript and Zustand for state management.

CONTEXT: I am building an intelligent logo generator. The core technical foundation is now complete: I have a Next.js project, and all necessary self-hosted fonts are correctly placed in the project structure and are ready to be defined in CSS.

SOURCE OF TRUTH:
The single source of truth for the entire font library is the following folder structure. You must use ONLY the fonts found in these folders. Ignore any previous lists or assumptions.

.../public/assets/fonts/modern/ (contains 6 font families)

.../public/assets/fonts/elegant/ (contains 6 font families)

.../public/assets/fonts/bold/ (contains 6 font families)

.../public/assets/fonts/heritage/ (contains 6 font families)

My goal is to implement the central logic that powers the logo creation process. This involves three key files: lib/data.ts (the single source of truth for design assets), lib/state.ts (the central Zustand store for the logo's current state), and lib/suggestionEngine.ts (a rule-based engine for generating initial smart suggestions).

TASK: Your task is to generate the complete, production-ready code for the three core logic files (data.ts, state.ts, suggestionEngine.ts) and provide clear examples of how to integrate them into the React components.

Step 1: Create the Data Architecture File (lib/data.ts)
Create the file lib/data.ts. This file must reflect the exact font library located in the public/assets/fonts/ directory.

Requirements:

Color Palettes: Define a colorPalettes array with 6 predefined color schemes (e.g., "Seriös & Vertrauensvoll", "Modern & Technisch", etc.).

Font Library: Define fontCategories with the 4 categories based on the folder names: "Modern", "Elegant", "Bold", "Heritage".

Detailed Font Info: For each of the 6 fonts within each category folder, provide the following details:

name: User-facing name (e.g., "Montserrat").

cssName: The exact name for the CSS font-family property (e.g., 'Montserrat').

isVariable: A boolean indicating if the font is variable (you can determine this if the filename contains variablefont).

generationWeights: An array of exactly two numbers. Use the following expert rules for these weights:

For Modern fonts: [400, 600]

For Elegant fonts: [400, 700] (if variable), [400, 400] (if static)

For Bold fonts: [500, 700] (if variable), [400, 400] (if static)

For Heritage fonts: [400, 700]

editorWeights: An array of all sensible weights for the user to choose from in the editor (e.g., [300, 400, 500, 600, 700]). For static fonts, this will be [400].

Step 2: Create the Central State Management File (lib/state.ts)
Create the file lib/state.ts using the zustand library. This store will manage the entire state of the logo being designed.

Requirements:

Define the LogoState interface, which should include text, fontInfo (the full object from data.ts), fontWeight, and colorPalette.

Define the LogoActions interface with functions to update the state (setText, setFont, setFontWeight, setColorPalette).

Initialize the store with safe default values taken from the data.ts file.

The setFont action should intelligently reset the fontWeight to a sensible default when a new font is selected.

Step 3: Create the Suggestion Engine File (lib/suggestionEngine.ts)
Create the file lib/suggestionEngine.ts. This module will contain the logic for generating intelligent starting points for the user.

Requirements:

Create a function getInitialSuggestions(industry: string, keywords: string[]): Suggestions.

The function should return an object containing a suggested fontInfo, fontWeight, and colorPalette.

Implement a simple rule-based system:

If industry is 'tech' or 'finance', suggest "Modern" fonts and the "Modern & Technisch" palette.

If industry is 'wellness' or a keyword is 'natur', suggest "Heritage" fonts and the "Natürlich & Nachhaltig" palette.

If industry is 'sports' or a keyword is 'energie', suggest "Bold" fonts and the "Dynamisch & Energiegeladen" palette.

If industry is 'design' or 'mode', suggest "Elegant" fonts and the "Elegant & Luxuriös" palette.

The function must randomly select a font from the suggested category.

Crucially, it must randomly select one of the two generationWeights specified for that font in data.ts.

Step 4: Provide Component Integration Examples
Finally, provide clear, concise code snippets demonstrating how to use these three files in the React components.

Suggestion Trigger (e.g., in Step2_Branding.tsx): Show the handleNextStep function that calls getInitialSuggestions and uses the store's actions to update the global state with the results.

Editor Component (e.g., in Step3_Design.tsx): Show how the component reads the fontCategories from data.ts to render the selection UI, and how the onClick handlers call the store's actions (setFont, setFontWeight) to update the logo. Also, show how the editorWeights from the currently selected fontInfo object are used to render the weight selection options.

Preview Component (e.g., in LogoCanvas.tsx): Show how the component subscribes to the useLogoStore and uses the state (fontInfo.cssName, fontWeight, colorPalette.colors[0]) to apply dynamic inline styles to the logo text element.

Please provide the complete code for each of the three lib/ files. Ensure all TypeScript types are correct and the logic is robust.

HERE ARE THE NEW CODE SNIPPETS and some explanations:

Absolut. Fantastisch, dass das Fundament steht! Deine Idee, die anfängliche Generierung auf wenige, passende Schriftstärken zu beschränken, ist goldrichtig – das ist der Unterschied zwischen einem Tool und einem Expertensystem.

Wir gehen das jetzt Schritt für Schritt durch. Jeder Schritt ist ein Baustein, der auf dem vorherigen aufbaut. Ich gebe dir für jeden Schritt die genaue Vorgehensweise und den vollständigen Code.

✅ Schritt 1: Die Daten-Architektur finalisieren (Der größte Hebel)
Alles in deiner App hängt von einer sauberen, klar definierten Datenstruktur ab. Wir erweitern jetzt deine Daten, um die neuen Regeln für die Schriftstärken abzubilden.

Deine Aufgabe: Ersetze den gesamten Inhalt deiner lib/data.ts-Datei mit dem folgenden Code.

Was der Code tut:

Er definiert klare TypeScript-Typen (ColorPalette, FontInfo, FontCategory).

Der FontInfo-Typ enthält jetzt:

generationWeights: Ein Array mit genau den zwei Schriftstärken, die bei der initialen Generierung für diese Schriftart verwendet werden sollen.

editorWeights: Ein Array mit allen Stärken, die der Nutzer im Editor auswählen kann.

Ich habe die generationWeights basierend auf deiner Idee und typografischen Best Practices für jede Kategorie sorgfältig ausgewählt.

Vollständiger Code für lib/data.ts:

TypeScript

// lib/data.ts

// =================================================================
// DATEN-ARCHITEKTUR
// Dies ist die "Single Source of Truth" für alle Design-Optionen.
// =================================================================

// 1. FARBPALETTEN
export type ColorPalette = {
name: string;
colors: [string, string, string, string]; // [Haupt, Neben, Akzent, Neutral]
};

export const colorPalettes: ColorPalette[] = [
{ name: "Seriös & Vertrauensvoll", colors: ["#0A3D62", "#CEDEEB", "#AAB8C2", "#FFFFFF"] },
{ name: "Modern & Technisch", colors: ["#00D2D3", "#2C3A47", "#FF9F43", "#F5F8FA"] },
{ name: "Natürlich & Nachhaltig", colors: ["#587448", "#E5D9B8", "#C86B52", "#FDFBF5"] },
{ name: "Elegant & Luxuriös", colors: ["#1E2022", "#D4AF37", "#800020", "#FFFFF0"] },
{ name: "Dynamisch & Energiegeladen", colors: ["#D92027", "#FFD93D", "#000000", "#FFFFFF"] },
{ name: "Freundlich & Sanft", colors: ["#FAD3E7", "#BEE3F8", "#B2F5EA", "#FFFFFF"] },
];

// 2. SCHRIFTARTEN
export type FontInfo = {
name: string;
cssName: string;
isVariable: boolean;
generationWeights: [number, number]; // Nur für die initiale Generierung
editorWeights: number[]; // Alle Optionen für den Editor
};

export type FontCategory = {
name: string;
fonts: FontInfo[];
};

export const fontCategories: FontCategory[] = [
{
name: "Modern",
fonts: [
{ name: "Montserrat", cssName: "'Montserrat'", isVariable: true, generationWeights: [400, 600], editorWeights: [300, 400, 500, 600, 700] },
{ name: "Nunito", cssName: "'Nunito'", isVariable: true, generationWeights: [400, 700], editorWeights: [300, 400, 600, 700, 800] },
{ name: "Open Sans", cssName: "'Open Sans'", isVariable: true, generationWeights: [400, 600], editorWeights: [300, 400, 600, 700] },
{ name: "Plus Jakarta Sans", cssName: "'Plus Jakarta Sans'", isVariable: true, generationWeights: [400, 700], editorWeights: [300, 400, 500, 600, 700] },
{ name: "Raleway", cssName: "'Raleway'", isVariable: true, generationWeights: [400, 600], editorWeights: [300, 400, 500, 600, 700, 800] },
{ name: "Rubik", cssName: "'Rubik'", isVariable: true, generationWeights: [400, 600], editorWeights: [300, 400, 500, 600, 700] },
]
},
{
name: "Elegant",
fonts: [
{ name: "Alex Brush", cssName: "'Alex Brush'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Dancing Script", cssName: "'Dancing Script'", isVariable: true, generationWeights: [400, 700], editorWeights: [400, 500, 600, 700] },
{ name: "Great Vibes", cssName: "'Great Vibes'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Kaushan Script", cssName: "'Kaushan Script'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Sacramento", cssName: "'Sacramento'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Satisfy", cssName: "'Satisfy'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
]
},
{
name: "Bold",
fonts: [
{ name: "Anton", cssName: "'Anton'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Archivo Black", cssName: "'Archivo Black'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Bebas Neue", cssName: "'Bebas Neue'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Bungee", cssName: "'Bungee'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Fjalla One", cssName: "'Fjalla One'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Oswald", cssName: "'Oswald'", isVariable: true, generationWeights: [500, 700], editorWeights: [400, 500, 600, 700] },
]
},
{
name: "Heritage",
fonts: [
{ name: "Abril Fatface", cssName: "'Abril Fatface'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Alfa Slab One", cssName: "'Alfa Slab One'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
{ name: "Cinzel", cssName: "'Cinzel'", isVariable: true, generationWeights: [400, 700], editorWeights: [400, 500, 600, 700, 800, 900] },
{ name: "Merriweather", cssName: "'Merriweather'", isVariable: true, generationWeights: [400, 700], editorWeights: [300, 400, 700, 900] },
{ name: "Petrona", cssName: "'Petrona'", isVariable: true, generationWeights: [400, 600], editorWeights: [300, 400, 500, 600, 700] },
{ name: "Playfair Display", cssName: "'Playfair Display'", isVariable: true, generationWeights: [400, 700], editorWeights: [400, 500, 600, 700, 800, 900] },
]
},
];
✅ Schritt 2: Den zentralen Zustand aufbauen
Jetzt, wo die Daten bereitstehen, definieren wir den zentralen Zustandsspeicher für das Logo. Das stellt sicher, dass alle Komponenten immer auf die gleichen, aktuellen Informationen zugreifen.

Deine Aufgabe: Ersetze den Inhalt deiner lib/state.ts-Datei mit diesem Code.

Was der Code tut:

Erstellt einen Zustand-Store, der alle Eigenschaften des aktuellen Logos enthält (text, fontFamily, fontWeight, etc.).

Stellt Actions bereit (setFontFamily, setFontWeight, etc.), mit denen deine UI-Komponenten den Zustand sicher verändern können.

Setzt sinnvolle Startwerte, die auf unseren Daten aus Schritt 1 basieren.

Vollständiger Code für lib/state.ts:

TypeScript

// lib/state.ts
import { create } from 'zustand';
import { colorPalettes, fontCategories, ColorPalette, FontInfo } from './data';

// =================================================================
// ZENTRALER ZUSTAND (STORE)
// Die "Single Source of Truth" für das zu erstellende Logo.
// =================================================================

export interface LogoState {
text: string;
fontInfo: FontInfo;
fontWeight: number;
colorPalette: ColorPalette;
}

export interface LogoActions {
setText: (text: string) => void;
setFont: (fontInfo: FontInfo, initialWeight?: number) => void;
setFontWeight: (fontWeight: number) => void;
setColorPalette: (palette: ColorPalette) => void;
}

const initialFont = fontCategories[0].fonts[0]; // Sicherer Startwert: Montserrat

export const useLogoStore = create<LogoState & LogoActions>((set) => ({
// Anfangszustand
text: "DeinLogo",
fontInfo: initialFont,
fontWeight: initialFont.generationWeights[0], // Nimm den ersten Generations-Wert
colorPalette: colorPalettes[0], // Sicherer Startwert: Seriös

// Aktionen zum Ändern des Zustands
setText: (text) => set({ text }),

setFont: (fontInfo, initialWeight) => set({
fontInfo: fontInfo,
// Wenn eine neue Schriftart gewählt wird, setze das Gewicht auf einen sinnvollen
// Startwert zurück: entweder den übergebenen oder den ersten Editor-Wert.
fontWeight: initialWeight || fontInfo.editorWeights[0]
}),

setFontWeight: (fontWeight) => set({ fontWeight }),
setColorPalette: (palette) => set({ colorPalette: palette }),
}));
✅ Schritt 3: Die Intelligenz für Vorschläge entwickeln
Jetzt kommt der "magische" Teil. Wir bauen die Logik, die basierend auf den ersten Nutzer-Eingaben intelligente Startvorschläge generiert.

Deine Aufgabe: Erstelle eine neue Datei lib/suggestionEngine.ts und füge den folgenden Code ein.

Was der Code tut:

Definiert eine Funktion getInitialSuggestions, die die Auswahl aus Schritt 1 (Branche) und 2 (Keywords) entgegennimmt.

Anhand einfacher, aber wirkungsvoller Regeln wählt sie eine passende Schrift-Kategorie und Farbpalette aus.

Wichtig: Sie wählt dann zufällig eine der beiden in generationWeights definierten Schriftstärken aus.

Vollständiger Code für lib/suggestionEngine.ts:

TypeScript

// lib/suggestionEngine.ts
import { fontCategories, colorPalettes, FontCategory, ColorPalette, FontInfo } from './data';

// =================================================================
// SUGGESTION ENGINE
// Generiert intelligente Startvorschläge basierend auf Nutzer-Input.
// =================================================================

export interface Suggestions {
fontInfo: FontInfo;
fontWeight: number;
colorPalette: ColorPalette;
}

export function getInitialSuggestions(industry: string, keywords: string[]): Suggestions {
let suggestedFontCategory: FontCategory = fontCategories[0]; // Standard: Modern
let suggestedPalette: ColorPalette = colorPalettes[0]; // Standard: Seriös

// ----- Hier beginnt dein Expertensystem (Regelwerk) -----

// Regel 1: Kreativ-Branchen (Design, Kunst, Fotografie)
if (['design', 'art', 'photography', 'mode'].includes(industry) || keywords.includes('kreativ')) {
suggestedFontCategory = fontCategories.find(c => c.name === 'Elegant')!;
suggestedPalette = colorPalettes.find(p => p.name.includes('Luxuriös'))!;
}

// Regel 2: Tech- & Finanz-Branchen
if (['tech', 'finance', 'consulting'].includes(industry) || keywords.includes('zukunft')) {
suggestedFontCategory = fontCategories.find(c => c.name === 'Modern')!;
suggestedPalette = colorPalettes.find(p => p.name.includes('Technisch'))!;
}

// Regel 3: Natur- & Gesundheits-Branchen
if (['health', 'wellness', 'food'].includes(industry) || keywords.includes('natur')) {
suggestedFontCategory = fontCategories.find(c => c.name === 'Heritage')!;
suggestedPalette = colorPalettes.find(p => p.name.includes('Natürlich'))!;
}

// Regel 4: Starke, laute Branchen (Sport, Events)
if (['sports', 'events', 'gaming'].includes(industry) || keywords.includes('energie')) {
suggestedFontCategory = fontCategories.find(c => c.name === 'Bold')!;
suggestedPalette = colorPalettes.find(p => p.name.includes('Dynamisch'))!;
}

// ----- Auswahl der spezifischen Assets -----

// Wähle einen zufälligen Font aus der vorgeschlagenen Kategorie
const randomFont = suggestedFontCategory.fonts[Math.floor(Math.random() * suggestedFontCategory.fonts.length)];

// Wähle zufällig eine der beiden "Generation Weights" für diesen Font
const randomWeight = randomFont.generationWeights[Math.floor(Math.random() * randomFont.generationWeights.length)];

return {
fontInfo: randomFont,
fontWeight: randomWeight,
colorPalette: suggestedPalette,
};
}
✅ Schritt 4: Alles verbinden (Der Kern-Loop)
Jetzt, wo alles vorbereitet ist, verbinden wir die Teile.

Deine Aufgabe: Implementiere die Logik in deinen Komponenten.

1. Vorschläge generieren und anwenden (z.B. in Step2_Branding.tsx)
   Wenn der Nutzer auf "Weiter" klickt, rufe die Engine auf und aktualisiere den Zustand.

TypeScript

// In der Komponente, die den Übergang zu Schritt 3 auslöst

import { getInitialSuggestions } from '@/lib/suggestionEngine';
import { useLogoStore } from '@/lib/state';

// ...

const handleNextStep = () => {
const industry = "tech"; // Holt diesen Wert aus dem Zustand von Schritt 1
const keywords = ["zukunft"]; // Holt diesen Wert aus dem Zustand von Schritt 2

// Hol die Vorschläge
const suggestions = getInitialSuggestions(industry, keywords);

// Aktualisiere den globalen Zustand mit den Vorschlägen
useLogoStore.getState().setFont(suggestions.fontInfo, suggestions.fontWeight);
useLogoStore.getState().setColorPalette(suggestions.colorPalette);

// Navigiere zu Schritt 3...
}; 2. Editor (Step3_Design.tsx)
Baue die UI, die die Daten liest und den Zustand ändert.

TypeScript

// components/editor/Step3_Design.tsx
import { fontCategories } from '@/lib/data';
import { useLogoStore } from '@/lib/state';

export function DesignEditor() {
const { fontInfo, fontWeight, setFont, setFontWeight } = useLogoStore();

return (

<div>
{/_ Beispiel für Font-Auswahl _/}
{fontCategories.map(category => (
<div key={category.name}>
<h3>{category.name}</h3>
{category.fonts.map(font => (
<button key={font.name} onClick={() => setFont(font)}>
{font.name}
</button>
))}
</div>
))}

      {/* Beispiel für Weight-Auswahl (im Editor alle Optionen zeigen) */}
      <div className="mt-4">
        <h4>Schriftstärke</h4>
        {fontInfo.editorWeights.map(weight => (
          <button key={weight} onClick={() => setFontWeight(weight)}>
            {weight}
          </button>
        ))}
      </div>
    </div>

);
} 3. Vorschau (LogoCanvas.tsx)
Lies den Zustand und wende ihn an.

TypeScript

// components/preview/LogoCanvas.tsx
import { useLogoStore } from '@/lib/state';

export function LogoCanvas() {
const { text, fontInfo, fontWeight, colorPalette } = useLogoStore();

return (

<div
style={{
        fontFamily: fontInfo.cssName,
        fontWeight: fontWeight,
        color: colorPalette.colors[0] // Hauptfarbe
      }}
className="text-6xl" // Beispiel-Styling >
{text}
</div>
);
}
