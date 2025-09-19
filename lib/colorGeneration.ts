// lib/colorGeneration.ts
// Logo-Generierung basierend auf Grundfarben und Zusatzoptionen

import { LogoConfig, GeneratedLogoVariation, ColorVariation } from './types';
import { colorGenerationRules, colorOptions, ColorGenerationRule, baseColorPalettes } from './data';

/**
 * Generiert Logo-Variationen basierend auf der ausgewählten Grundfarbe und den Zusatzoptionen
 * Wendet Hue-Rotation an, wenn eine Basisfarbe verwendet wird
 * Generiert zusätzlich 12 erweiterte Farbpaletten-Variationen wenn eine Grundfarbe gewählt ist
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

  // Generiere die regulären Variationen basierend auf der Regel
  const variations: GeneratedLogoVariation[] = [];

  generationRule.variants.forEach((variant, index) => {
    // Wende die ursprünglichen Farbgenerierungsregeln an
    const originalBrandNameColor = variant.brandNameColor(baseColor);
    const originalIconColor = variant.iconColor(baseColor);
    const originalBackgroundColor = variant.backgroundColor(baseColor);
    const originalSloganColor = variant.sloganColor(baseColor);

    // Wenn eine Basisfarbe verwendet wird, wende Hue-Rotation an
    let brandNameColor = originalBrandNameColor;
    let iconColor = originalIconColor;
    let backgroundColor = originalBackgroundColor;
    let sloganColor = originalSloganColor;

    // Nur auf einfarbige Farben (keine Gradients) anwenden
    if (baseConfig.baseColor && typeof originalBrandNameColor === 'string' && !originalBrandNameColor.includes('gradient')) {
      // Verwende die erste Farbe aus dem baseColorPalettes Array als Referenz (z.B. Rot #E74C3C)
      const referenceColor = '#E74C3C'; // Referenzfarbe für Hue-Rotation

      if (originalBrandNameColor !== '#FFFFFF' && originalBrandNameColor !== '#000000') {
        brandNameColor = rotateHue(originalBrandNameColor, getHueDifference(referenceColor, baseColor));
      }
      if (originalIconColor !== '#FFFFFF' && originalIconColor !== '#000000') {
        iconColor = rotateHue(originalIconColor, getHueDifference(referenceColor, baseColor));
      }
      if (originalBackgroundColor !== '#FFFFFF' && originalBackgroundColor !== '#000000') {
        backgroundColor = rotateHue(originalBackgroundColor, getHueDifference(referenceColor, baseColor));
      }
      if (originalSloganColor !== '#FFFFFF' && originalSloganColor !== '#000000') {
        sloganColor = rotateHue(originalSloganColor, getHueDifference(referenceColor, baseColor));
      }
    }

    const colorVariation: ColorVariation = {
      name: variant.name,
      brandNameColor,
      iconColor,
      backgroundColor,
      sloganColor
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
        tags: ['generated', selectedColorOption, 'hue-rotated']
      }
    };

    variations.push(logoVariation);
  });

  // Wenn eine Grundfarbe gewählt wurde, generiere zusätzlich 12 erweiterte Farbpaletten-Variationen
  if (baseConfig.baseColor) {
    const extendedVariations = generateExtendedPaletteVariations(baseConfig, baseColor, selectedColorOption);
    variations.push(...extendedVariations);
  }

  return variations;
}

/**
 * Fallback-Funktion für die Basis-Variante (nur Grundfarbe)
 * Wendet auch Hue-Rotation an, wenn eine Basisfarbe verwendet wird
 * Generiert zusätzlich erweiterte Farbpaletten-Variationen wenn eine Grundfarbe gewählt ist
 */
function generateBaseOnlyVariation(
  baseConfig: LogoConfig,
  baseColor: string
): GeneratedLogoVariation[] {
  // Wende Hue-Rotation an, falls eine Basisfarbe verwendet wird
  let finalBaseColor = baseColor;

  if (baseConfig.baseColor) {
    const referenceColor = '#E74C3C'; // Referenzfarbe für Hue-Rotation
    finalBaseColor = rotateHue(baseColor, getHueDifference(referenceColor, baseConfig.baseColor));
  }

  const colorVariation: ColorVariation = {
    name: 'Monochrom',
    brandNameColor: finalBaseColor,
    iconColor: finalBaseColor,
    backgroundColor: '#FFFFFF',
    sloganColor: finalBaseColor
  };

  const variations: GeneratedLogoVariation[] = [{
    ...baseConfig,
    variationName: 'Nur Grundfarbe - Monochrom',
    colorVariation,
    baseColor,
    selectedColorOption: 'base-only',
    palette: {
      id: 'generated-base-only-0',
      name: 'Monochrom',
      colors: [colorVariation.backgroundColor, colorVariation.brandNameColor, colorVariation.iconColor] as [string, string, string],
      tags: ['generated', 'base-only', baseConfig.baseColor ? 'hue-rotated' : 'original']
    }
  }];

  // Wenn eine Grundfarbe gewählt wurde, generiere zusätzlich 12 erweiterte Farbpaletten-Variationen
  if (baseConfig.baseColor) {
    const extendedVariations = generateExtendedPaletteVariations(baseConfig, baseColor, 'base-only');
    variations.push(...extendedVariations);
  }

  return variations;
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

/**
 * Hilfsfunktion: Konvertiert RGB zu HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Hilfsfunktion: Konvertiert HSL zu RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Hilfsfunktion: Rotiert den Hue einer Farbe um einen bestimmten Betrag
 */
export function rotateHue(hex: string, degrees: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = (hsl.h + degrees) % 360;
  if (hsl.h < 0) hsl.h += 360;

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Berechnet die Hue-Differenz zwischen zwei Farben
 */
export function getHueDifference(baseColor: string, targetColor: string): number {
  const baseRgb = hexToRgb(baseColor);
  const targetRgb = hexToRgb(targetColor);

  if (!baseRgb || !targetRgb) return 0;

  const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
  const targetHsl = rgbToHsl(targetRgb.r, targetRgb.g, targetRgb.b);

  let diff = targetHsl.h - baseHsl.h;

  // Normalisiere auf den kleinsten Winkel (-180 bis +180)
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return diff;
}

/**
 * Wendet Hue-Rotation auf alle Farben einer Palette basierend auf der Basisfarbe an
 */
export function applyBaseColorRotation(paletteColors: string[], baseColor: string, referenceColor: string): string[] {
  // Berechne die Hue-Differenz zwischen der Referenzfarbe und der Basisfarbe
  const hueDifference = getHueDifference(referenceColor, baseColor);

  // Rotiere alle Farben der Palette um diese Differenz
  return paletteColors.map(color => rotateHue(color, hueDifference));
}

/**
 * Generiert 12 zusätzliche Logo-Variationen basierend auf den erweiterten Farbpaletten
 * Für jede der 12 erweiterten Paletten wird eine Variation erstellt, bei der
 * alle Farben der Palette entsprechend der gewählten Grundfarbe rotiert werden
 */
function generateExtendedPaletteVariations(
  baseConfig: LogoConfig,
  selectedBaseColor: string,
  selectedColorOption: string
): GeneratedLogoVariation[] {
  const variations: GeneratedLogoVariation[] = [];

  // Die erweiterten Farbpaletten (ab Index 21 aus baseColorPalettes)
  const extendedPalettes = baseColorPalettes.slice(21);

  extendedPalettes.forEach((extendedPalette, paletteIndex) => {
    // Berechne die Hue-Differenz zwischen der Referenzfarbe der erweiterten Palette und der gewählten Grundfarbe
    const referenceColor = extendedPalette.color; // Dies ist die main.hOffset der erweiterten Palette
    const hueDifference = getHueDifference(referenceColor, selectedBaseColor);

    // Rotiere die Hauptfarbe der erweiterten Palette zur gewählten Grundfarbe
    const rotatedMainColor = selectedBaseColor; // Die Hauptfarbe wird zur gewählten Grundfarbe

    // Erstelle eine rotierte Palette mit zusätzlichen Harmoniefarben
    // Basierend auf der ursprünglichen Palette, aber mit rotiertem Hue
    const harmonicColors = generateHarmonicColors(selectedBaseColor, extendedPalette.name);

    // Verwende die erste Generierungsregel für die erweiterte Palette
    const generationRule = colorGenerationRules.find(rule => rule.id === selectedColorOption) || colorGenerationRules[0];

    // Erstelle eine Variation für diese erweiterte Palette
    const colorVariation: ColorVariation = {
      name: `${extendedPalette.name} - Erweitert`,
      brandNameColor: rotatedMainColor,
      iconColor: harmonicColors.accent,
      backgroundColor: harmonicColors.background,
      sloganColor: harmonicColors.secondary
    };

    const logoVariation: GeneratedLogoVariation = {
      ...baseConfig,
      variationName: `Erweiterte Palette - ${extendedPalette.name}`,
      colorVariation,
      baseColor: selectedBaseColor,
      selectedColorOption,
      palette: {
        id: `extended-${extendedPalette.name.toLowerCase().replace(/\s+/g, '-')}-${paletteIndex}`,
        name: `${extendedPalette.name} (Erweitert)`,
        colors: [harmonicColors.background, rotatedMainColor, harmonicColors.accent] as [string, string, string],
        tags: ['generated', 'extended', selectedColorOption, 'hue-rotated']
      }
    };

    variations.push(logoVariation);
  });

  return variations;
}

/**
 * Generiert harmonische Farben basierend auf einer Grundfarbe für erweiterte Paletten
 */
function generateHarmonicColors(baseColor: string, paletteName: string): {
  accent: string;
  background: string;
  secondary: string;
} {
  // Verschiedene harmonische Beziehungen basierend auf dem Palettennamen
  let accentHueShift = 0;
  let backgroundHueShift = 0;
  let secondaryHueShift = 0;
  let backgroundLightness = 0;

  // Bestimme die harmonischen Verschiebungen basierend auf dem Palettentyp
  switch (true) {
    case paletteName.includes('Kontrast'):
      accentHueShift = 180; // Komplementärfarbe
      backgroundHueShift = 0;
      secondaryHueShift = 120; // Triadisch
      backgroundLightness = 90;
      break;
    case paletteName.includes('Analog'):
      accentHueShift = 30; // Benachbarte Farbe
      backgroundHueShift = -30;
      secondaryHueShift = 60;
      backgroundLightness = 85;
      break;
    case paletteName.includes('Komplementär'):
      accentHueShift = 180; // Komplementärfarbe
      backgroundHueShift = 0;
      secondaryHueShift = 150;
      backgroundLightness = 92;
      break;
    case paletteName.includes('Monochromatisch'):
      accentHueShift = 0; // Gleicher Hue
      backgroundHueShift = 0;
      secondaryHueShift = 0;
      backgroundLightness = 88;
      break;
    default:
      // Standard harmonische Beziehung
      accentHueShift = 120; // Triadisch
      backgroundHueShift = 0;
      secondaryHueShift = 240;
      backgroundLightness = 87;
  }

  return {
    accent: rotateHue(baseColor, accentHueShift),
    background: adjustColorForBackground(baseColor, backgroundHueShift, backgroundLightness),
    secondary: rotateHue(baseColor, secondaryHueShift)
  };
}

/**
 * Passt eine Farbe für die Verwendung als Hintergrund an
 */
function adjustColorForBackground(color: string, hueShift: number, targetLightness: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return '#FFFFFF';

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Passe Hue und Lightness an
  hsl.h = (hsl.h + hueShift) % 360;
  if (hsl.h < 0) hsl.h += 360;
  hsl.l = targetLightness;
  hsl.s = Math.min(hsl.s, 30); // Reduziere Sättigung für Hintergründe

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}