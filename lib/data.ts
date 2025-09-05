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
  'tech': { tags: ['tech'], name: 'Technologie' },
  'finance': { tags: ['finance'], name: 'Finanzen' },
  'health': { tags: ['health', 'wellness'], name: 'Gesundheit & Wellness' },
  'sports': { tags: ['sports'], name: 'Sport & Fitness' },
  'design': { tags: ['design'], name: 'Design & Kreativ' },
  'food': { tags: ['food'], name: 'Food & Gastronomie' }
};

export const personalities = [
  { id: 'modern', name: 'Modern & Innovativ', tags: ['modern', 'tech', 'minimalist'] },
  { id: 'elegant', name: 'Elegant & Luxuriös', tags: ['elegant', 'luxury'] },
  { id: 'serious', name: 'Seriös & Vertrauenswürdig', tags: ['serious', 'corporate'] },
  { id: 'playful', name: 'Verspielt & Kreativ', tags: ['playful', 'creative'] },
  { id: 'organic', name: 'Natürlich & Organisch', tags: ['organic', 'nature', 'eco'] },
];

export const layouts: LayoutData[] = [
  { id: 'text-only', name: 'Nur Text', type: 'standard', arrangement: 'icon-top' },
  { id: 'icon-text-horizontal', name: 'Icon + Text (horizontal)', type: 'standard', arrangement: 'icon-left' },
  { id: 'icon-text-vertical', name: 'Icon + Text (vertikal)', type: 'standard', arrangement: 'icon-top' },
  { id: 'circle-enclosed', name: 'Kreis', type: 'enclosed', shape: 'circle', arrangement: 'icon-top' },
];