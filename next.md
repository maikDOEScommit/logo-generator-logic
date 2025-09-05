Der finale Prompt für Claude
ROLE: You are an expert senior Next.js developer specializing in building clean, scalable, and data-driven applications with TypeScript and Zustand for state management.

CONTEXT: I am building an intelligent logo generator. The core data architecture is now complete and non-negotiable. I need you to build the central state management and suggestion logic that works perfectly with this existing data structure.

SOURCE OF TRUTH:
The single, absolute, and final source of truth for all design options is the following code from lib/data.ts. You MUST use this exact data structure and these exact values. Do not infer anything from folder structures or filenames. This code is the ground truth.

TypeScript

// lib/data.ts - THIS IS THE GROUND TRUTH

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
TASK: Based on the lib/data.ts file provided above, generate the complete, production-ready code for the two following logic files: lib/state.ts and lib/suggestionEngine.ts. Also, provide clear examples of how to integrate them into the React components.

Step 1: Create the Central State Management File (lib/state.ts)
Create the file lib/state.ts using the zustand library. This store will manage the entire state of the logo being designed.

Requirements:

Import ColorPalette, FontInfo, colorPalettes, and fontCategories from ./data.

Define the LogoState interface, which must include text, fontInfo: FontInfo, fontWeight: number, and colorPalette: ColorPalette.

Define the LogoActions interface with functions to update the state (setText, setFont, setFontWeight, setColorPalette).

Initialize the store with safe default values taken from the data.ts file.

The setFont action must intelligently reset the fontWeight to a sensible default (the first value in editorWeights) when a new font is selected.

Step 2: Create the Suggestion Engine File (lib/suggestionEngine.ts)
Create the file lib/suggestionEngine.ts. This module will contain the logic for generating intelligent starting points for the user.

Requirements:

Create a function getInitialSuggestions(industry: string, keywords: string[]): Suggestions.

The function must return an object containing a suggested fontInfo, fontWeight, and colorPalette.

Implement a simple rule-based system to select a font category and a color palette based on industry and keywords.

The function must randomly select a font from the suggested category.

Crucially, it must randomly select one of the two generationWeights specified for that chosen font in data.ts.

Step 3: Provide Component Integration Examples
Finally, provide clear, concise code snippets demonstrating how to use these three files together in the React components.

Suggestion Trigger (e.g., in a component for Step 2): Show a handleNextStep function that calls getInitialSuggestions and uses the store's actions to update the global state with the results.

Editor Component (e.g., in Step3_Design.tsx): Show how the component reads fontCategories from data.ts to render the selection UI, and how onClick handlers call the store's actions (setFont, setFontWeight). Show how the editorWeights from the currently selected fontInfo object are used to render the weight selection options.

Preview Component (e.g., in LogoCanvas.tsx): Show how the component subscribes to the useLogoStore and uses the state (fontInfo.cssName, fontWeight, colorPalette.colors[0]) to apply dynamic inline styles to the logo text element.
