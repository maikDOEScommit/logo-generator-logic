// lib/suggestionEngine.ts
import { fontCategories, colorPalettes, layouts, FontCategory, ColorPalette, FontInfo } from './data';
import { IconData, FontData, PaletteData } from './types';
import { 
  Heart, Star, Shield, Zap, Leaf, Coffee, Camera, Music, Gamepad2, Palette, Code, Target, Lightbulb, Rocket,
  Circle, Square, Triangle, Diamond, Hexagon, Pentagon, Minus, Plus, X, Check, ArrowRight, ArrowUp
} from 'lucide-react';

// Icons collection
export const availableIcons: IconData[] = [
  // Thematic icons
  { id: 'heart', component: Heart, tags: ['love', 'health', 'care', 'wellness'] },
  { id: 'star', component: Star, tags: ['quality', 'premium', 'excellence', 'rating'] },
  { id: 'shield', component: Shield, tags: ['security', 'protection', 'safety', 'trust'] },
  { id: 'zap', component: Zap, tags: ['energy', 'power', 'electric', 'fast'] },
  { id: 'leaf', component: Leaf, tags: ['nature', 'eco', 'organic', 'green'] },
  { id: 'coffee', component: Coffee, tags: ['food', 'drink', 'cafe', 'energy'] },
  { id: 'camera', component: Camera, tags: ['photography', 'media', 'creative', 'art'] },
  { id: 'music', component: Music, tags: ['audio', 'entertainment', 'creative', 'art'] },
  { id: 'gamepad', component: Gamepad2, tags: ['gaming', 'entertainment', 'tech', 'fun'] },
  { id: 'palette', component: Palette, tags: ['design', 'creative', 'art', 'color'] },
  { id: 'code', component: Code, tags: ['tech', 'development', 'programming', 'digital'] },
  { id: 'target', component: Target, tags: ['precision', 'focus', 'goal', 'accuracy'] },
  { id: 'lightbulb', component: Lightbulb, tags: ['idea', 'innovation', 'creative', 'bright'] },
  { id: 'rocket', component: Rocket, tags: ['startup', 'growth', 'speed', 'innovation'] },
  
  // Standard geometric shapes - universal for any logo
  { id: 'circle', component: Circle, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'square', component: Square, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'triangle', component: Triangle, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'diamond', component: Diamond, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'hexagon', component: Hexagon, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'pentagon', component: Pentagon, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  
  // Simple symbols
  { id: 'minus', component: Minus, tags: ['symbol', 'universal', 'simple', 'clean', 'minimalist'] },
  { id: 'plus', component: Plus, tags: ['symbol', 'universal', 'simple', 'clean', 'minimalist'] },
  { id: 'x', component: X, tags: ['symbol', 'universal', 'simple', 'clean', 'minimalist'] },
  { id: 'check', component: Check, tags: ['symbol', 'universal', 'simple', 'clean', 'minimalist'] },
  { id: 'arrow-right', component: ArrowRight, tags: ['symbol', 'universal', 'simple', 'clean', 'direction'] },
  { id: 'arrow-up', component: ArrowUp, tags: ['symbol', 'universal', 'simple', 'clean', 'direction'] }
];

// Convert original color palettes + intensive colors to PaletteData format
const intensiveColors: PaletteData[] = [
  { id: 'red', name: 'Intensiv Rot', colors: ['#E53E3E', '#FC8181', '#FFFFFF'], tags: ['red', 'intense'] },
  { id: 'orange', name: 'Intensiv Orange', colors: ['#FF8C00', '#FFA500', '#FFFFFF'], tags: ['orange', 'intense'] },
  { id: 'yellow', name: 'Intensiv Gelb', colors: ['#FFD700', '#FFED4E', '#000000'], tags: ['yellow', 'intense'] },
  { id: 'green', name: 'Intensiv Grün', colors: ['#38A169', '#68D391', '#FFFFFF'], tags: ['green', 'intense'] },
  { id: 'teal', name: 'Intensiv Türkis', colors: ['#319795', '#4FD1C7', '#FFFFFF'], tags: ['teal', 'intense'] },
  { id: 'blue', name: 'Intensiv Blau', colors: ['#3182CE', '#63B3ED', '#FFFFFF'], tags: ['blue', 'intense'] },
  { id: 'cyan', name: 'Intensiv Cyan', colors: ['#00B5D8', '#00E5FF', '#FFFFFF'], tags: ['cyan', 'intense'] },
  { id: 'purple', name: 'Intensiv Lila', colors: ['#805AD5', '#B794F6', '#FFFFFF'], tags: ['purple', 'intense'] },
  { id: 'pink', name: 'Intensiv Pink', colors: ['#D53F8C', '#F687B3', '#FFFFFF'], tags: ['pink', 'intense'] },
  { id: 'indigo', name: 'Intensiv Indigo', colors: ['#4C51BF', '#7C3AED', '#FFFFFF'], tags: ['indigo', 'intense'] },
  { id: 'gray', name: 'Intensiv Grau', colors: ['#4A5568', '#A0AEC0', '#FFFFFF'], tags: ['gray', 'intense'] },
  { id: 'black', name: 'Intensiv Schwarz', colors: ['#1A202C', '#4A5568', '#FFFFFF'], tags: ['black', 'intense'] },
  { id: 'brown', name: 'Intensiv Braun', colors: ['#8B4513', '#D2691E', '#FFFFFF'], tags: ['brown', 'intense'] },
  { id: 'lime', name: 'Intensiv Limette', colors: ['#84CC16', '#A3E635', '#000000'], tags: ['lime', 'intense'] }
];

// Convert original colorPalettes to PaletteData format
export const suggestionPalettes: PaletteData[] = [
  // Original rule-based palettes
  ...colorPalettes.map((palette, index) => ({
    id: `palette-${index}`,
    name: palette.name,
    colors: [palette.colors[0], palette.colors[1], palette.colors[3]] as [string, string, string],
    tags: palette.name.includes('Seriös') ? ['corporate', 'trust'] :
          palette.name.includes('Modern') ? ['tech', 'modern'] :
          palette.name.includes('Natürlich') ? ['nature', 'eco'] :
          palette.name.includes('Elegant') ? ['luxury', 'elegant'] :
          palette.name.includes('Dynamisch') ? ['energy', 'bold'] :
          ['friendly', 'soft']
  })),
  // Add intensive colors
  ...intensiveColors
];

export interface Suggestions {
  suggestedIcons: IconData[];
  suggestedFonts: FontData[];
  suggestedPalettes: PaletteData[];
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

  // Get relevant icons based on industry/keywords
  let suggestedIcons = availableIcons.filter(icon => 
    icon.tags.some(tag => 
      keywords.some(keyword => keyword.toLowerCase().includes(tag.toLowerCase())) ||
      tag.includes(industry.toLowerCase())
    )
  );

  // If no matches, include universal shapes and some thematic icons
  if (suggestedIcons.length < 6) {
    const universalIcons = availableIcons.filter(icon => 
      icon.tags.includes('universal') || icon.tags.includes('shape') || icon.tags.includes('symbol')
    );
    const thematicIcons = availableIcons.filter(icon => 
      !icon.tags.includes('universal') && !icon.tags.includes('shape') && !icon.tags.includes('symbol')
    );
    
    // Combine matched icons with universal ones, then add some thematic ones
    suggestedIcons = [
      ...suggestedIcons,
      ...universalIcons,
      ...thematicIcons.slice(0, Math.max(0, 12 - suggestedIcons.length - universalIcons.length))
    ].slice(0, 12);
  }

  // Convert font categories to FontData format
  const suggestedFonts: FontData[] = [];
  fontCategories.forEach(category => {
    category.fonts.forEach(font => {
      suggestedFonts.push({
        name: font.name,
        family: font.cssName,
        url: `https://fonts.googleapis.com/css2?family=${font.name.replace(/\s+/g, '+')}:wght@${font.editorWeights.join(';')}&display=swap`,
        weights: font.editorWeights,
        category: category.name
      });
    });
  });

  return {
    suggestedIcons,
    suggestedFonts: suggestedFonts.slice(0, 8),
    suggestedPalettes: suggestionPalettes.slice(0, 20) // Include all color options
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
    suggestedIcons: availableIcons.slice(0, 6),
    suggestedFonts: convertedFonts,
    suggestedPalettes: convertedPalettes,
  };
}