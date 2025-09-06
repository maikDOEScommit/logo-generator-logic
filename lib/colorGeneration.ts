// lib/colorGeneration.ts
// Logo-Generierung basierend auf Grundfarben und Zusatzoptionen

import { LogoConfig, GeneratedLogoVariation, ColorVariation } from './types';
import { colorGenerationRules, colorOptions, ColorGenerationRule } from './data';

/**
 * Generiert Logo-Variationen basierend auf der ausgewählten Grundfarbe und den Zusatzoptionen
 */
export function generateLogoVariations(
  baseConfig: LogoConfig,
  baseColor: string,
  selectedColorOption: string
): GeneratedLogoVariation[] {
  // Finde die entsprechende Farboption
  const colorOption = colorOptions.find(option => option.id === selectedColorOption);
  if (!colorOption) {
    console.warn(`Color option ${selectedColorOption} not found, using base-only`);
    return generateBaseOnlyVariation(baseConfig, baseColor);
  }

  // Finde die entsprechende Generierungsregel
  const generationRule = colorGenerationRules.find(rule => rule.id === colorOption.applies_rule);
  if (!generationRule) {
    console.warn(`Generation rule ${colorOption.applies_rule} not found, using base-only`);
    return generateBaseOnlyVariation(baseConfig, baseColor);
  }

  // Generiere die Variationen basierend auf der Regel
  const variations: GeneratedLogoVariation[] = [];

  generationRule.variants.forEach((variant, index) => {
    const colorVariation: ColorVariation = {
      name: variant.name,
      brandNameColor: variant.brandNameColor(baseColor),
      iconColor: variant.iconColor(baseColor),
      backgroundColor: variant.backgroundColor(baseColor),
      sloganColor: variant.sloganColor(baseColor)
    };

    const logoVariation: GeneratedLogoVariation = {
      ...baseConfig,
      variationName: `${generationRule.name} - ${variant.name}`,
      colorVariation,
      baseColor,
      selectedColorOption,
      // Aktualisiere die Palette mit den generierten Farben
      palette: {
        id: `generated-${selectedColorOption}-${index}`,
        name: `${variant.name}`,
        colors: [
          colorVariation.backgroundColor,
          colorVariation.brandNameColor,
          colorVariation.iconColor
        ] as [string, string, string],
        tags: ['generated', selectedColorOption]
      }
    };

    variations.push(logoVariation);
  });

  return variations;
}

/**
 * Fallback-Funktion für die Basis-Variante (nur Grundfarbe)
 */
function generateBaseOnlyVariation(
  baseConfig: LogoConfig,
  baseColor: string
): GeneratedLogoVariation[] {
  const colorVariation: ColorVariation = {
    name: 'Monochrom',
    brandNameColor: baseColor,
    iconColor: baseColor,
    backgroundColor: '#FFFFFF',
    sloganColor: baseColor
  };

  return [{
    ...baseConfig,
    variationName: 'Nur Grundfarbe - Monochrom',
    colorVariation,
    baseColor,
    selectedColorOption: 'base-only',
    palette: {
      id: 'generated-base-only-0',
      name: 'Monochrom',
      colors: [colorVariation.backgroundColor, colorVariation.brandNameColor, colorVariation.iconColor] as [string, string, string],
      tags: ['generated', 'base-only']
    }
  }];
}

/**
 * Hilfsfunktion: Konvertiert eine Hex-Farbe zu RGB für weitere Manipulationen
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Hilfsfunktion: Konvertiert RGB zu Hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Hilfsfunktion: Erstellt eine hellere oder dunklere Variante einer Farbe
 */
export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjust = (color: number) => {
    const adjusted = Math.round(color * (100 + percent) / 100);
    return Math.max(0, Math.min(255, adjusted));
  };

  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
}

/**
 * Hilfsfunktion: Prüft ob eine Farbe hell oder dunkel ist (für Kontrast-Entscheidungen)
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  
  // Verwende die relative Luminanz-Formel
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}