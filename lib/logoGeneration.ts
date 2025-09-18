// lib/logoGeneration.ts
import { LogoConfig, IconData } from './types';
import { colorGenerationRules, ColorGenerationRule } from './data';
import { getIconsByIndustry } from './industryIcons';

export type LogoVariation = {
  id: string;
  name: string;
  brandNameColor: string;
  iconColor: string;
  backgroundColor: string;
  sloganColor: string;
  hasGradient: boolean;
  icon?: IconData; // Add icon to variation
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

// Helper function to get random icons from same category/industry
function getRandomIconsForVariations(baseConfig: LogoConfig, variationsCount: number): IconData[] {
  console.log('🔍🔍🔍 CRITICAL: getRandomIconsForVariations called with:', {
    industry: baseConfig.industry,
    userIcon: baseConfig.icon?.id,
    variationsCount
  });

  const icons: IconData[] = [];

  // Add user's chosen icon as first variation
  if (baseConfig.icon) {
    icons.push(baseConfig.icon);
    console.log('🎯 Variation 1: User icon', baseConfig.icon.id);
  }

  // Get more icons from same category - try to get from industry first
  let availableIcons: IconData[] = [];

  // Try to find icons from the same industry first
  if (baseConfig.industry) {
    availableIcons = getIconsByIndustry(baseConfig.industry);
    console.log(`🎲 Found ${availableIcons.length} icons for industry: ${baseConfig.industry}`);
  }

  // If not enough icons or no industry, we'll need to add fallback logic
  // For now, use the industry icons and repeat if needed
  if (availableIcons.length === 0 && baseConfig.icon) {
    availableIcons = [baseConfig.icon];
  }

  // Fill remaining variations with RANDOM icons from available pool (excluding user's choice)
  for (let i = 1; i < variationsCount; i++) {
    if (availableIcons.length > 0) {
      // Create a pool excluding the user's chosen icon to ensure variety
      const excludeUserIcon = baseConfig.icon;
      const filteredIcons = excludeUserIcon
        ? availableIcons.filter(icon => icon.id !== excludeUserIcon.id)
        : availableIcons;

      // If we have other icons available, use them, otherwise fall back to full pool
      const iconPool = filteredIcons.length > 0 ? filteredIcons : availableIcons;

      // Pick a truly random icon from the available pool
      const randomIndex = Math.floor(Math.random() * iconPool.length);
      const selectedIcon = iconPool[randomIndex];
      icons.push(selectedIcon);
      console.log(`🎲 Variation ${i + 1}: Selected icon ${selectedIcon.id} (index ${randomIndex}/${iconPool.length}, excluded user icon: ${excludeUserIcon?.id || 'none'})`);
    } else {
      // Fallback to user's icon if no icons available
      icons.push(baseConfig.icon || icons[0]);
      console.log(`🎲 Variation ${i + 1}: Fallback to user icon (no available icons)`);
    }
  }

  return icons;
}

// Generiert Logo-Variationen basierend auf den neuen Regeln
export function generateLogoVariations(
  baseConfig: LogoConfig,
  baseColor: string,
  colorRule: 'base-only' | 'add-white' | 'add-black' | null = null,
  industry?: string
): LogoVariation[] {
  // Fallback auf reguläre Palette wenn keine Grundfarbe-Regel angewendet wird
  if (!colorRule || !baseColor) {
    return generateRegularPaletteVariations(baseConfig);
  }

  const rule = colorGenerationRules.find(r => r.id === colorRule);
  if (!rule) {
    return generateRegularPaletteVariations(baseConfig, industry);
  }

  // Get different icons for each variation
  const variationIcons = getRandomIconsForVariations({ ...baseConfig, industry }, rule.variants.length);

  return rule.variants.map((variant, index) => {
    const variation = {
      id: `${rule.id}-variant-${index + 1}`,
      name: variant.name,
      brandNameColor: variant.brandNameColor(baseColor),
      iconColor: variant.iconColor(baseColor),
      backgroundColor: variant.backgroundColor(baseColor),
      sloganColor: variant.sloganColor(baseColor),
      hasGradient: isGradient(variant.brandNameColor(baseColor)) || isGradient(variant.iconColor(baseColor)),
      icon: variationIcons[index] // Add different icon for each variation
    };
    console.log(`🎨 Generated variation ${index + 1}:`, variation.id, 'icon:', variation.icon?.id);
    return variation;
  });
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

// Helper function to get user-friendly color names
function getColorName(color: string, paletteColors: string[]): string {
  if (color === '#FFFFFF') return 'Weiß';
  if (color === '#000000') return 'Schwarz';

  const index = paletteColors.indexOf(color);
  if (index === 0) return 'Grundfarbe';
  if (index === 1) return 'Akzent';
  if (index === 2) return 'Text';

  return 'Farbe';
}

// Generate all possible combinations and evaluate them
function generateRegularPaletteVariations(config: LogoConfig, industry?: string): LogoVariation[] {
  const palette = config.palette;
  if (!palette || !palette.colors) {
    // Fallback Farben wenn keine Palette vorhanden
    const fallbackIcons = getRandomIconsForVariations({ ...config, industry }, 1);
    return [
      {
        id: 'regular-light',
        name: 'Light Version',
        brandNameColor: '#000000',
        iconColor: '#000000',
        backgroundColor: '#FFFFFF',
        sloganColor: '#000000',
        hasGradient: false,
        icon: fallbackIcons[0]
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

  // Get different icons for each variation
  const variationIcons = getRandomIconsForVariations({ ...config, industry }, bestCombinations.length);

  // Convert to LogoVariation format with consistent naming
  return bestCombinations.map((combo, index) => {
    let displayName = '';

    // Generate consistent names based on background type
    if (combo.background.value === '#FFFFFF') {
      displayName = combo.brandnameColor === combo.iconColor
        ? `Weiß: Beide ${getColorName(combo.brandnameColor, colors)}`
        : `Weiß: ${getColorName(combo.brandnameColor, colors)} + ${getColorName(combo.iconColor, colors)}`;
    } else if (combo.background.value === '#000000') {
      displayName = combo.brandnameColor === combo.iconColor
        ? `Schwarz: Beide ${getColorName(combo.brandnameColor, colors)}`
        : `Schwarz: ${getColorName(combo.brandnameColor, colors)} + ${getColorName(combo.iconColor, colors)}`;
    } else if (combo.background.type === 'gradient') {
      displayName = combo.brandnameColor === combo.iconColor
        ? `${combo.background.name} Gradient: Beide ${getColorName(combo.brandnameColor, colors)}`
        : `${combo.background.name} Gradient: ${getColorName(combo.brandnameColor, colors)} + ${getColorName(combo.iconColor, colors)}`;
    } else {
      displayName = combo.brandnameColor === combo.iconColor
        ? `${getColorName(combo.background.value, colors)}: Beide ${getColorName(combo.brandnameColor, colors)}`
        : `${getColorName(combo.background.value, colors)}: ${getColorName(combo.brandnameColor, colors)} + ${getColorName(combo.iconColor, colors)}`;
    }

    const variation = {
      id: combo.id,
      name: displayName,
      brandNameColor: combo.brandnameColor,
      iconColor: combo.iconColor,
      backgroundColor: combo.background.value,
      sloganColor: combo.brandnameColor, // Use same as brand name for consistency
      hasGradient: combo.background.type === 'gradient',
      icon: variationIcons[index] // Add different icon for each variation
    };
    console.log(`🎨 Generated regular variation ${index + 1}:`, variation.id, 'icon:', variation.icon?.id);
    return variation;
  });
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