// lib/data.ts
import { LayoutData } from './types';

// =================================================================
// DATEN-ARCHITEKTUR
// Dies ist die "Single Source of Truth" für alle Design-Optionen.
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
  'entertainment': { tags: ['entertainment', 'media'], name: 'Entertainment & Media' }
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
  { id: 'circle-enclosed', name: 'Kreis', type: 'enclosed', shape: 'circle', arrangement: 'icon-top' },
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
    description: 'Verwendet nur die ausgewählte Grundfarbe',
    generates: 1,
    variants: [
      {
        name: 'Monochrom',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      }
    ]
  },
  {
    id: 'add-white',
    name: 'Grundfarbe + Weiß',
    description: 'Generiert 2 Variationen: eine mit weißem Brand-Namen, eine mit weißem Icon',
    generates: 2,
    variants: [
      {
        name: 'Weißer Brand-Name',
        brandNameColor: () => '#FFFFFF',
        iconColor: (baseColor) => baseColor,
        backgroundColor: (baseColor) => baseColor,
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Weißes Icon',
        brandNameColor: (baseColor) => baseColor,
        iconColor: () => '#FFFFFF',
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      }
    ]
  },
  {
    id: 'add-black',
    name: 'Grundfarbe + Schwarz',
    description: 'Generiert 2 Variationen: eine mit schwarzem Brand-Namen, eine mit schwarzem Icon',
    generates: 2,
    variants: [
      {
        name: 'Schwarzer Brand-Name',
        brandNameColor: () => '#000000',
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: () => '#000000'
      },
      {
        name: 'Schwarzes Icon',
        brandNameColor: (baseColor) => baseColor,
        iconColor: () => '#000000',
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      }
    ]
  },
  {
    id: 'add-black-white',
    name: 'Grundfarbe + Schwarz & Weiß',
    description: 'Generiert 4 Variationen mit verschiedenen Schwarz-Weiß-Grundfarbe-Kombinationen',
    generates: 4,
    variants: [
      {
        name: 'Grundfarbe dominiert',
        brandNameColor: (baseColor) => baseColor,
        iconColor: () => '#FFFFFF',
        backgroundColor: () => '#000000',
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Schwarz dominiert',
        brandNameColor: () => '#FFFFFF',
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#000000',
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Weiß dominiert',
        brandNameColor: () => '#000000',
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: () => '#000000'
      },
      {
        name: 'Kontrastreich',
        brandNameColor: (baseColor) => baseColor,
        iconColor: () => '#000000',
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      }
    ]
  }
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
  {
    id: 'add-black-white',
    name: '+ Schwarz & Weiß',
    description: 'Erstellt mehrere Variationen mit Schwarz, Weiß und der Grundfarbe',
    applies_rule: 'add-black-white',
    visual_indicator: {
      colors: ['baseColor', '#FFFFFF', '#000000'],
      layout: 'grid'
    }
  }
];