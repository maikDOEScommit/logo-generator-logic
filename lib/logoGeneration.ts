// lib/logoGeneration.ts
import { LogoConfig } from './types';
import { colorGenerationRules, ColorGenerationRule } from './data';

export type LogoVariation = {
  id: string;
  name: string;
  brandNameColor: string;
  iconColor: string;
  backgroundColor: string;
  sloganColor: string;
  hasGradient: boolean;
};

// Hilfsfunktion zur Helligkeitsanpassung von Farben für Gradients
function adjustColorBrightness(color: string, amount: number): string {
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  
  const num = parseInt(col, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  
  return (usePound ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Überprüft ob eine Farbe ein Gradient ist
function isGradient(color: string): boolean {
  return color.includes('linear-gradient');
}

// Generiert Logo-Variationen basierend auf den neuen Regeln
export function generateLogoVariations(
  baseConfig: LogoConfig, 
  baseColor: string, 
  colorRule: 'base-only' | 'add-white' | 'add-black' | null = null
): LogoVariation[] {
  // Fallback auf reguläre Palette wenn keine Grundfarbe-Regel angewendet wird
  if (!colorRule || !baseColor) {
    return generateRegularPaletteVariations(baseConfig);
  }

  const rule = colorGenerationRules.find(r => r.id === colorRule);
  if (!rule) {
    return generateRegularPaletteVariations(baseConfig);
  }

  return rule.variants.map((variant, index) => ({
    id: `${rule.id}-variant-${index + 1}`,
    name: variant.name,
    brandNameColor: variant.brandNameColor(baseColor),
    iconColor: variant.iconColor(baseColor),
    backgroundColor: variant.backgroundColor(baseColor),
    sloganColor: variant.sloganColor(baseColor),
    hasGradient: isGradient(variant.brandNameColor(baseColor)) || isGradient(variant.iconColor(baseColor))
  }));
}

// Generiert die ursprünglichen 4 Variationen für reguläre Paletten
function generateRegularPaletteVariations(config: LogoConfig): LogoVariation[] {
  const palette = config.palette;
  if (!palette || !palette.colors) {
    // Fallback Farben wenn keine Palette vorhanden
    return [
      {
        id: 'regular-light',
        name: 'Light Version',
        brandNameColor: '#000000',
        iconColor: '#000000',
        backgroundColor: '#FFFFFF',
        sloganColor: '#000000',
        hasGradient: false
      }
    ];
  }

  return [
    {
      id: 'regular-light',
      name: 'Light Version',
      brandNameColor: palette.colors[0],
      iconColor: palette.colors[0],
      backgroundColor: '#FFFFFF',
      sloganColor: palette.colors[0],
      hasGradient: false
    },
    {
      id: 'regular-dark',
      name: 'Dark Version',
      brandNameColor: palette.colors[2],
      iconColor: palette.colors[2],
      backgroundColor: '#000000',
      sloganColor: palette.colors[2],
      hasGradient: false
    },
    {
      id: 'regular-accent',
      name: 'Accent Version',
      brandNameColor: palette.colors[0],
      iconColor: palette.colors[0],
      backgroundColor: palette.colors[2],
      sloganColor: palette.colors[0],
      hasGradient: false
    },
    {
      id: 'regular-secondary',
      name: 'Secondary Version',
      brandNameColor: palette.colors[2],
      iconColor: palette.colors[2],
      backgroundColor: palette.colors[0],
      sloganColor: palette.colors[2],
      hasGradient: false
    }
  ];
}

// Bestimmt die anzuwendende Farbregel basierend auf der Auswahl
export function determineColorRule(selectedPalette: any, selectedBaseColor?: string, selectedColorOption?: string): 'base-only' | 'add-white' | 'add-black' | null {
  // Wenn eine reguläre Palette ausgewählt wurde, keine spezielle Regel anwenden
  if (selectedPalette && selectedPalette.colors && Array.isArray(selectedPalette.colors) && !selectedPalette.tags?.includes('generated')) {
    return null;
  }

  // Wenn eine Grundfarbe ausgewählt wurde
  if (selectedBaseColor) {
    // Verwende die selectedColorOption direkt wenn verfügbar
    if (selectedColorOption === 'add-white' || selectedColorOption === 'add-black' || selectedColorOption === 'base-only') {
      return selectedColorOption as 'base-only' | 'add-white' | 'add-black';
    }
    
    // Fallback auf base-only wenn keine Option gewählt wurde
    return 'base-only';
  }

  return null;
}