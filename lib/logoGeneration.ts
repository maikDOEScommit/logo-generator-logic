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

// Color utility functions for evaluation
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const normalize = (c: number) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  
  const r = normalize(rgb.r);
  const g = normalize(rgb.g);
  const b = normalize(rgb.b);
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Generate all possible combinations and evaluate them
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

  const colors = [palette.colors[0], palette.colors[1], palette.colors[2]];
  const combinations: Array<{
    id: string;
    background: { type: string; value: string; startColor?: string; endColor?: string; name: string };
    brandnameColor: string;
    iconColor: string;
    score: number;
  }> = [];

  // Create solid backgrounds
  const backgrounds = [
    { type: 'solid', value: '#FFFFFF', name: 'White' },
    { type: 'solid', value: '#000000', name: 'Black' },
    { type: 'solid', value: colors[0], name: 'Color A' },
    { type: 'solid', value: colors[1], name: 'Color B' },
    { type: 'solid', value: colors[2], name: 'Color C' }
  ];

  // Create gradients
  const gradients = [
    { type: 'gradient', value: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, 
      startColor: colors[0], endColor: colors[1], name: 'A→B' },
    { type: 'gradient', value: `linear-gradient(135deg, ${colors[1]}, ${colors[0]})`, 
      startColor: colors[1], endColor: colors[0], name: 'B→A' },
    { type: 'gradient', value: `linear-gradient(135deg, ${colors[0]}, ${colors[2]})`, 
      startColor: colors[0], endColor: colors[2], name: 'A→C' },
    { type: 'gradient', value: `linear-gradient(135deg, ${colors[2]}, ${colors[0]})`, 
      startColor: colors[2], endColor: colors[0], name: 'C→A' },
    { type: 'gradient', value: `linear-gradient(135deg, ${colors[1]}, ${colors[2]})`, 
      startColor: colors[1], endColor: colors[2], name: 'B→C' },
    { type: 'gradient', value: `linear-gradient(135deg, ${colors[2]}, ${colors[1]})`, 
      startColor: colors[2], endColor: colors[1], name: 'C→B' }
  ];

  let id = 1;

  // Generate all combinations
  [...backgrounds, ...gradients].forEach(bg => {
    colors.forEach(brandColor => {
      colors.forEach(iconColor => {
        combinations.push({
          id: `combo_${id++}`,
          background: bg,
          brandnameColor: brandColor,
          iconColor: iconColor,
          score: 0
        });
      });
    });
  });

  // Calculate scores
  combinations.forEach(combo => {
    let brandContrast, iconContrast;

    if (combo.background.type === 'solid') {
      brandContrast = getContrastRatio(combo.brandnameColor, combo.background.value);
      iconContrast = getContrastRatio(combo.iconColor, combo.background.value);
    } else if (combo.background.type === 'gradient') {
      const brandContrastStart = getContrastRatio(combo.brandnameColor, combo.background.startColor!);
      const brandContrastEnd = getContrastRatio(combo.brandnameColor, combo.background.endColor!);
      brandContrast = Math.min(brandContrastStart, brandContrastEnd);

      const iconContrastStart = getContrastRatio(combo.iconColor, combo.background.startColor!);
      const iconContrastEnd = getContrastRatio(combo.iconColor, combo.background.endColor!);
      iconContrast = Math.min(iconContrastStart, iconContrastEnd);
    }

    let score = Math.min(brandContrast || 0, iconContrast || 0);

    // Hierarchy malus - same colors
    if (combo.brandnameColor === combo.iconColor && 
        combo.brandnameColor === combo.background.value) {
      score = 0;
    }

    // Harmony bonus - different colors for brand and icon
    if (combo.brandnameColor !== combo.iconColor) {
      score *= 1.1;
    }

    // Penalize very low contrast
    if (score < 2) {
      score *= 0.5;
    }

    combo.score = Math.round(score * 100) / 100;
  });

  // Filter into categories and select best
  const whiteBg = combinations.filter(c => c.background.value === '#FFFFFF').sort((a, b) => b.score - a.score);
  const blackBg = combinations.filter(c => c.background.value === '#000000').sort((a, b) => b.score - a.score);
  const solidColorBg = combinations.filter(c => 
    c.background.type === 'solid' && 
    c.background.value !== '#FFFFFF' && 
    c.background.value !== '#000000'
  ).sort((a, b) => b.score - a.score);
  const gradientBg = combinations.filter(c => c.background.type === 'gradient').sort((a, b) => b.score - a.score);

  // Select top results: 2 white, 2 black, 4 solid color, 4 gradient
  const bestCombinations = [
    ...whiteBg.slice(0, 2),
    ...blackBg.slice(0, 2),
    ...solidColorBg.slice(0, 4),
    ...gradientBg.slice(0, 4)
  ].sort((a, b) => b.score - a.score);

  // Convert to LogoVariation format
  return bestCombinations.map((combo, index) => ({
    id: combo.id,
    name: `${combo.background.name} (Score: ${combo.score})`,
    brandNameColor: combo.brandnameColor,
    iconColor: combo.iconColor,
    backgroundColor: combo.background.value,
    sloganColor: combo.brandnameColor, // Use same as brand name for consistency
    hasGradient: combo.background.type === 'gradient'
  }));
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