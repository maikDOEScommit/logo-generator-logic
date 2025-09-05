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

// =================================================================
// COMPATIBILITY LAYER - Old getSuggestions function for existing components
// =================================================================
export function getSuggestions(industry: string | null, selectedPersonalities: string[], currentConfig: any) {
  // Convert new FontInfo to old FontData format
  const convertedFonts = fontCategories.flatMap(cat => 
    cat.fonts.map(font => ({
      name: font.name,
      family: 'sans-serif', // Default fallback
      url: font.name.replace(/\s+/g, '+'),
      weights: font.editorWeights,
      category: cat.name
    }))
  );

  // Convert new ColorPalette to old PaletteData format  
  const convertedPalettes = colorPalettes.map(palette => ({
    id: palette.name.toLowerCase().replace(/\s+/g, '-'),
    name: palette.name,
    colors: [palette.colors[3], palette.colors[0], palette.colors[2]] as [string, string, string], // [background, primary, text]
    tags: []
  }));

  return {
    suggestedIcons: [],
    suggestedFonts: convertedFonts,
    suggestedPalettes: convertedPalettes,
  };
}