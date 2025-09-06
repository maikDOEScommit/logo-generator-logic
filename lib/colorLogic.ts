// lib/colorLogic.ts
// Intelligente Farblogik für Logo-Generator

export type ColorOption = 'base-only' | 'add-white' | 'add-black' | 'add-both';

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  scenario: ColorOption;
}

export interface LogoVariation {
  id: string;
  name: string;
  backgroundColor: string;
  iconColor: string;
  textColor: string;
  description: string;
}

export interface ColorAnalysis {
  palette: ColorPalette;
  variations: LogoVariation[];
}

// Hilfsfunktion: Helligkeit einer Farbe berechnen (0-1, wobei 0 = schwarz, 1 = weiß)
export function getLuminance(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Relative luminance calculation (WCAG standard)
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

// Hilfsfunktion: Kontrast zwischen zwei Farben berechnen (1-21, wobei 21 = maximaler Kontrast)
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Hilfsfunktion: Prüft ob Kontrast WCAG AA Standard erfüllt (mindestens 4.5:1)
export function hasGoodContrast(foregroundColor: string, backgroundColor: string): boolean {
  return getContrastRatio(foregroundColor, backgroundColor) >= 4.5;
}

// Hilfsfunktion: Bestimmt ob eine Farbe als "hell" oder "dunkel" gilt
export function isLightColor(hexColor: string): boolean {
  return getLuminance(hexColor) > 0.5;
}

// Teil 1: Erstellung der Farbpalette basierend auf Nutzer-Auswahl
export function createColorPalette(
  baseColor: string, 
  option: ColorOption = 'base-only'
): ColorPalette {
  let colors: string[];
  let name: string;
  let id: string;

  switch (option) {
    case 'base-only':
      // Szenario 1: Automatisch neutrale Farbe hinzufügen
      const isLight = isLightColor(baseColor);
      const neutralColor = isLight ? '#000000' : '#FFFFFF';
      colors = [baseColor, neutralColor];
      name = `${baseColor} + Auto (${isLight ? 'Schwarz' : 'Weiß'})`;
      id = `${baseColor.replace('#', '')}-auto`;
      break;

    case 'add-white':
      // Szenario 2: Hauptfarbe + Weiß
      colors = [baseColor, '#FFFFFF'];
      name = `${baseColor} + Weiß`;
      id = `${baseColor.replace('#', '')}-white`;
      break;

    case 'add-black':
      // Szenario 3: Hauptfarbe + Schwarz
      colors = [baseColor, '#000000'];
      name = `${baseColor} + Schwarz`;
      id = `${baseColor.replace('#', '')}-black`;
      break;

    case 'add-both':
      // Szenario 4: Hauptfarbe + Weiß + Schwarz
      colors = [baseColor, '#FFFFFF', '#000000'];
      name = `${baseColor} + Weiß & Schwarz`;
      id = `${baseColor.replace('#', '')}-both`;
      break;

    default:
      throw new Error(`Unbekannte Farboption: ${option}`);
  }

  return {
    id,
    name,
    colors,
    scenario: option
  };
}

// Teil 2: Generierung der Logo-Variationen mit Qualitätskontrolle
export function generateLogoVariations(palette: ColorPalette): LogoVariation[] {
  const { colors } = palette;
  const baseColor = colors[0];
  const hasWhite = colors.includes('#FFFFFF');
  const hasBlack = colors.includes('#000000');

  const variations: LogoVariation[] = [];

  // Variation 1: Standard-Ansicht (heller Grund)
  const standardVariation: LogoVariation = {
    id: `${palette.id}-standard`,
    name: 'Standard (heller Grund)',
    backgroundColor: '#FFFFFF',
    iconColor: baseColor,
    textColor: hasBlack ? '#000000' : baseColor,
    description: 'Klassische Darstellung auf weißem Hintergrund'
  };

  // Qualitätskontrolle für Standard-Variation
  if (hasGoodContrast(standardVariation.iconColor, standardVariation.backgroundColor) &&
      hasGoodContrast(standardVariation.textColor, standardVariation.backgroundColor)) {
    variations.push(standardVariation);
  }

  // Variation 2: Invertierte Ansicht (dunkler Grund) - nur wenn Schwarz verfügbar
  if (hasBlack) {
    const invertedVariation: LogoVariation = {
      id: `${palette.id}-inverted`,
      name: 'Invertiert (dunkler Grund)',
      backgroundColor: '#000000',
      iconColor: baseColor,
      textColor: '#FFFFFF',
      description: 'Elegante Darstellung auf schwarzem Hintergrund'
    };

    // Qualitätskontrolle für Invertierte Variation
    if (hasGoodContrast(invertedVariation.iconColor, invertedVariation.backgroundColor) &&
        hasGoodContrast(invertedVariation.textColor, invertedVariation.backgroundColor)) {
      variations.push(invertedVariation);
    }
  }

  // Variation 3: Farbige Marken-Ansicht - nur wenn Weiß verfügbar
  if (hasWhite) {
    const coloredBrandVariation: LogoVariation = {
      id: `${palette.id}-colored-brand`,
      name: 'Farbige Marke',
      backgroundColor: baseColor,
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF',
      description: 'Markante Darstellung mit farbigem Hintergrund'
    };

    // Qualitätskontrolle für Farbige Marken-Ansicht
    if (hasGoodContrast(coloredBrandVariation.iconColor, coloredBrandVariation.backgroundColor) &&
        hasGoodContrast(coloredBrandVariation.textColor, coloredBrandVariation.backgroundColor)) {
      variations.push(coloredBrandVariation);
    }
  }

  // Variation 4: Monochromatische Ansicht (Bonus) - nur wenn Schwarz verfügbar
  if (hasBlack) {
    const monochromaticVariation: LogoVariation = {
      id: `${palette.id}-monochromatic`,
      name: 'Monochrom',
      backgroundColor: '#FFFFFF',
      iconColor: '#000000',
      textColor: '#000000',
      description: 'Zeitlose schwarze Darstellung'
    };

    // Qualitätskontrolle (Schwarz auf Weiß hat immer guten Kontrast)
    variations.push(monochromaticVariation);
  }

  return variations;
}

// Hauptfunktion: Komplette Farbanalyse durchführen
export function analyzeColorChoice(
  baseColor: string, 
  option: ColorOption = 'base-only'
): ColorAnalysis {
  // Schritt 1: Palette erstellen
  const palette = createColorPalette(baseColor, option);
  
  // Schritt 2: Variationen generieren mit Qualitätskontrolle
  const variations = generateLogoVariations(palette);
  
  return {
    palette,
    variations
  };
}

// Debug-Hilfsfunktion: Detaillierte Kontrast-Information
export function debugContrastInfo(variation: LogoVariation): void {
  console.log(`\n=== Debug: ${variation.name} ===`);
  console.log(`Hintergrund: ${variation.backgroundColor}`);
  console.log(`Icon: ${variation.iconColor}`);
  console.log(`Text: ${variation.textColor}`);
  console.log(`Icon-Kontrast: ${getContrastRatio(variation.iconColor, variation.backgroundColor).toFixed(2)}:1`);
  console.log(`Text-Kontrast: ${getContrastRatio(variation.textColor, variation.backgroundColor).toFixed(2)}:1`);
  console.log(`Icon-Qualität: ${hasGoodContrast(variation.iconColor, variation.backgroundColor) ? '✅ Gut' : '❌ Schlecht'}`);
  console.log(`Text-Qualität: ${hasGoodContrast(variation.textColor, variation.backgroundColor) ? '✅ Gut' : '❌ Schlecht'}`);
}

// Export für einfachere Nutzung
export const ColorLogic = {
  analyzeColorChoice,
  createColorPalette,
  generateLogoVariations,
  getLuminance,
  getContrastRatio,
  hasGoodContrast,
  isLightColor,
  debugContrastInfo
};

export default ColorLogic;