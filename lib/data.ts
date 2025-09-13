// lib/data.ts
import { LayoutData } from './types';

// =================================================================
// HILFSFUNKTIONEN
// =================================================================

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

// Verbesserte Gradient-Erstellung mit größerem Farbbereich
function createGradient(baseColor: string): string {
  // Erstelle einen Gradient mit einem helleren und einem dunkleren Ton für mehr Sichtbarkeit
  const lighterColor = adjustColorBrightness(baseColor, 80); // Noch heller für bessere Sichtbarkeit
  const darkerColor = adjustColorBrightness(baseColor, -80); // Noch dunkler für bessere Sichtbarkeit
  return `linear-gradient(135deg, ${lighterColor} 0%, ${baseColor} 50%, ${darkerColor} 100%)`;
}

// Silberner Gradient für spezielle Variationen
function createSilverGradient(): string {
  return `linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 25%, #FFFFFF 50%, #E8E8E8 75%, #C0C0C0 100%)`;
}

// =================================================================
// DATEN-ARCHITEKTUR
// Dies ist die "Single Source of Truth" für alle Design-Optionen.
//
// WICHTIGE REGEL:
// - generationWeights: Nur für die initiale Logo-Generierung (meist 400 als Standard)
// - editorWeights: Alle verfügbaren Gewichte für die Editoren - User sollen im Editor
//   keine Blockaden haben und individuell alle verfügbaren font-weights der variable fonts nutzen können
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
  { name: "Ocean & Sunset", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFF8E1"] },
  { name: "Cosmic & Deep", colors: ["#667EEA", "#764BA2", "#F093FB", "#F8F9FA"] },
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
      { name: "Montserrat", cssName: "'Montserrat'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Nunito", cssName: "'Nunito'", isVariable: true, generationWeights: [400, 700], editorWeights: [200, 300, 400, 500, 600, 700, 800, 900, 1000] },
      { name: "Open Sans", cssName: "'Open Sans'", isVariable: true, generationWeights: [400, 600], editorWeights: [300, 400, 500, 600, 700, 800] },
      { name: "Plus Jakarta Sans", cssName: "'Plus Jakarta Sans'", isVariable: true, generationWeights: [400, 700], editorWeights: [200, 300, 400, 500, 600, 700, 800] },
      { name: "Raleway", cssName: "'Raleway'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Rubik", cssName: "'Rubik'", isVariable: true, generationWeights: [400, 600], editorWeights: [300, 400, 500, 600, 700, 800, 900] },
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
      { name: "Satisfy", cssName: "'Satisfy'", isVariable: true, generationWeights: [400, 700], editorWeights: [400, 500, 600, 700] },
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
      { name: "Oswald", cssName: "'Oswald'", isVariable: true, generationWeights: [400, 700], editorWeights: [200, 300, 400, 500, 600, 700] },
    ]
  },
  {
    name: "Heritage",
    fonts: [
      { name: "Abril Fatface", cssName: "'Abril Fatface'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Alfa Slab One", cssName: "'Alfa Slab One'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Cinzel", cssName: "'Cinzel'", isVariable: true, generationWeights: [400, 700], editorWeights: [400, 500, 600, 700, 800, 900] },
      { name: "Merriweather", cssName: "'Merriweather'", isVariable: true, generationWeights: [400, 700], editorWeights: [300, 400, 500, 600, 700, 800, 900] },
      { name: "Petrona", cssName: "'Petrona'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Playfair Display", cssName: "'Playfair Display'", isVariable: true, generationWeights: [400, 700], editorWeights: [400, 500, 600, 700, 800, 900] },
    ]
  },
];

// =================================================================
// COMPATIBILITY LAYER - Simple industry/personality definitions
// =================================================================

export const industries = {
  'tech': { tags: ['tech'], name: 'Technology' },
  'finance': { tags: ['finance'], name: 'Finance' },
  'health': { tags: ['health', 'wellness'], name: 'Health & Wellness' },
  'sports': { tags: ['sports'], name: 'Sports & Fitness' },
  'design': { tags: ['design'], name: 'Design & Creative' },
  'food': { tags: ['food'], name: 'Food & Gastronomy' },
  'education': { tags: ['education', 'learning'], name: 'Education & Learning' },
  'retail': { tags: ['retail', 'commerce'], name: 'Retail & Commerce' },
  'construction': { tags: ['construction', 'building'], name: 'Construction & Real Estate' },
  'automotive': { tags: ['automotive', 'transport'], name: 'Automotive & Transport' },
  'consulting': { tags: ['consulting', 'business'], name: 'Consulting & Services' },
  'entertainment': { tags: ['entertainment', 'media'], name: 'Entertainment & Media' },
  'legal': { tags: ['legal', 'law', 'professional'], name: 'Legal & Law' },
  'travel': { tags: ['travel', 'tourism', 'hospitality'], name: 'Travel & Tourism' },
  'beauty': { tags: ['beauty', 'fashion', 'lifestyle'], name: 'Beauty & Fashion' },
  'nonprofit': { tags: ['nonprofit', 'social', 'charity'], name: 'Non-Profit & Social' }
};

export const personalities = [
  { id: 'modern', name: 'Modern & Innovativ', tags: ['modern', 'tech', 'minimalist'] },
  { id: 'elegant', name: 'Elegant & Luxuriös', tags: ['elegant', 'luxury'] },
  { id: 'serious', name: 'Seriös & Vertrauenswürdig', tags: ['serious', 'corporate'] },
  { id: 'playful', name: 'Verspielt & Kreativ', tags: ['playful', 'creative'] },
  { id: 'organic', name: 'Natürlich & Organisch', tags: ['organic', 'nature', 'eco'] },
];

export const layouts: LayoutData[] = [
  { id: 'text-icon-horizontal', name: 'Text + Icon (horizontal)', type: 'standard', arrangement: 'text-left' },
  { id: 'icon-text-horizontal', name: 'Icon + Text (horizontal)', type: 'standard', arrangement: 'icon-left' },
  { id: 'icon-text-vertical', name: 'Icon + Text (vertikal)', type: 'standard', arrangement: 'icon-top' },
  { id: 'text-icon-vertical', name: 'Text + Icon (vertikal)', type: 'standard', arrangement: 'text-top' },
  { id: 'text-icon-horizontal-circle', name: 'Text + Icon (horizontal) + Kreis', type: 'enclosed', shape: 'circle', arrangement: 'text-left' },
  { id: 'icon-text-horizontal-circle', name: 'Icon + Text (horizontal) + Kreis', type: 'enclosed', shape: 'circle', arrangement: 'icon-left' },
  { id: 'icon-text-vertical-circle', name: 'Icon + Text (vertikal) + Kreis', type: 'enclosed', shape: 'circle', arrangement: 'icon-top' },
  { id: 'text-icon-vertical-circle', name: 'Text + Icon (vertikal) + Kreis', type: 'enclosed', shape: 'circle', arrangement: 'text-top' },
];

// =================================================================
// FARB-GENERATIONS-REGELN
// Definiert wie aus Grundfarben + Zusatzoptionen Logos generiert werden
// =================================================================

export type ColorGenerationRule = {
  id: string;
  name: string;
  description: string;
  generates: number; // Anzahl der generierten Variationen
  variants: {
    name: string;
    brandNameColor: (baseColor: string) => string;
    iconColor: (baseColor: string) => string;
    backgroundColor: (baseColor: string) => string;
    sloganColor: (baseColor: string) => string;
  }[];
};

export const colorGenerationRules: ColorGenerationRule[] = [
  {
    id: 'base-only',
    name: 'Nur Grundfarbe',
    description: 'Verwendet nur die ausgewählte Grundfarbe - 4 Variationen',
    generates: 4,
    variants: [
      {
        name: 'Auf Weiß - Einfarbig',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Auf Schwarz - Einfarbig',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Auf Weiß - Gradient',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Auf Schwarz - Gradient',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => createGradient(baseColor)
      }
    ]
  },
  {
    id: 'add-white',
    name: 'Grundfarbe + Weiß',
    description: 'Generiert 12 Variationen mit Weiß-Kombinationen',
    generates: 12,
    variants: [
      {
        name: 'Weiß: Base Solid - Brandname und Icon in Grundfarbe',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Weiß: Brandname und Icon in einem linear-gradient',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Weiß: Base Gradient - Brandname Grundfarbe, Icon mit Gradient',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Weiß: Brandname Gradient, Icon Grundfarbe',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Schwarz: Text Weiß, Icon Base - Brandname weiß, Icon in Grundfarbe',
        brandNameColor: () => '#FFFFFF',
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#000000',
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Schwarz: Text Base, Icon Weiß - Brandname in Grundfarbe, Icon weiß',
        brandNameColor: (baseColor) => baseColor,
        iconColor: () => '#FFFFFF',
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Schwarz: Text Gradient, Icon Weiß - Brandname als Gradient, Icon weiß',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: () => '#FFFFFF',
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Schwarz: Text Weiß, Icon Gradient - Brandname weiß, Icon mit Gradient',
        brandNameColor: () => '#FFFFFF',
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#000000',
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Grundfarbe Background: Text & Icon Weiß',
        brandNameColor: () => '#FFFFFF',
        iconColor: () => '#FFFFFF',
        backgroundColor: (baseColor) => baseColor,
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Gradient Background: Text & Icon Weiß',
        brandNameColor: () => '#FFFFFF',
        iconColor: () => '#FFFFFF',
        backgroundColor: (baseColor) => createGradient(baseColor),
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Grundfarbe Background: Text & Icon Silber-Gradient',
        brandNameColor: () => createSilverGradient(),
        iconColor: () => '#000000', // Icons können keinen Gradient, daher schwarz
        backgroundColor: (baseColor) => baseColor,
        sloganColor: () => createSilverGradient()
      },
      {
        name: 'Gradient Background: Text & Icon Silber-Gradient',
        brandNameColor: () => createSilverGradient(),
        iconColor: () => '#000000', // Icons können keinen Gradient, daher schwarz
        backgroundColor: (baseColor) => createGradient(baseColor),
        sloganColor: () => createSilverGradient()
      }
    ]
  },
  {
    id: 'add-black',
    name: 'Grundfarbe + Schwarz',
    description: 'Generiert 12 Variationen mit Schwarz-Kombinationen',
    generates: 12,
    variants: [
      {
        name: 'Weiß: Text Base, Icon Schwarz - Brandname in Grundfarbe, Icon schwarz',
        brandNameColor: (baseColor) => baseColor,
        iconColor: () => '#000000',
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Weiß: Text Schwarz, Icon Base - Brandname schwarz, Icon in Grundfarbe',
        brandNameColor: () => '#000000',
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: () => '#000000'
      },
      {
        name: 'Weiß: Text Gradient, Icon Schwarz - Brandname als Gradient, Icon schwarz',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: () => '#000000',
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Weiß: Text Schwarz, Icon Gradient - Brandname schwarz, Icon mit Gradient',
        brandNameColor: () => '#000000',
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#FFFFFF',
        sloganColor: () => '#000000'
      },
      {
        name: 'Schwarz: Beide Base - Brandname und Icon in Grundfarbe',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Schwarz: Beide Gradient - Brandname und Icon mit Gradient',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Schwarz: Brandname Grundfarbe, Icon Gradient',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Schwarz: Icon Grundfarbe, Brandname Gradient',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Grundfarbe Background: Text & Icon Schwarz',
        brandNameColor: () => '#000000',
        iconColor: () => '#000000',
        backgroundColor: (baseColor) => baseColor,
        sloganColor: () => '#000000'
      },
      {
        name: 'Gradient Background: Text & Icon Schwarz',
        brandNameColor: () => '#000000',
        iconColor: () => '#000000',
        backgroundColor: (baseColor) => createGradient(baseColor),
        sloganColor: () => '#000000'
      },
      {
        name: 'Grundfarbe Background: Text & Icon Silber-Gradient',
        brandNameColor: () => createSilverGradient(),
        iconColor: () => '#FFFFFF', // Icon weiß für Kontrast auf dunklem Grund
        backgroundColor: (baseColor) => baseColor,
        sloganColor: () => createSilverGradient()
      },
      {
        name: 'Gradient Background: Text & Icon Silber-Gradient',
        brandNameColor: () => createSilverGradient(),
        iconColor: () => '#FFFFFF', // Icon weiß für Kontrast auf dunklem Grund
        backgroundColor: (baseColor) => createGradient(baseColor),
        sloganColor: () => createSilverGradient()
      }
    ]
  },
];

// =================================================================
// FARB-AUSWAHL-OPTIONEN
// Definiert die verfügbaren Zusatzoptionen für Grundfarben
// =================================================================

export type ColorOption = {
  id: string;
  name: string;
  description: string;
  applies_rule: string; // Referenz auf ColorGenerationRule.id
  visual_indicator: {
    colors: string[];
    layout: 'horizontal' | 'grid';
  };
};

export const colorOptions: ColorOption[] = [
  {
    id: 'base-only',
    name: 'Nur diese Farbe',
    description: 'Verwendet nur die ausgewählte Grundfarbe für alle Logo-Elemente',
    applies_rule: 'base-only',
    visual_indicator: {
      colors: ['baseColor'], // wird dynamisch ersetzt
      layout: 'horizontal'
    }
  },
  {
    id: 'add-white',
    name: '+ Weiß',
    description: 'Erstellt zusätzliche Variationen mit Weiß',
    applies_rule: 'add-white',
    visual_indicator: {
      colors: ['baseColor', '#FFFFFF'],
      layout: 'horizontal'
    }
  },
  {
    id: 'add-black',
    name: '+ Schwarz',
    description: 'Erstellt zusätzliche Variationen mit Schwarz',
    applies_rule: 'add-black',
    visual_indicator: {
      colors: ['baseColor', '#000000'],
      layout: 'horizontal'
    }
  },
];