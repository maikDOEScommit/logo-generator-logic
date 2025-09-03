// --- lib/data.ts ---
import { IconData, FontData, LayoutData, PaletteData, PersonalityData } from './types';

// Import the icon components from their new, separate files
import GrowthIcon from '@/components/icons/GrowthIcon';
import SecurityIcon from '@/components/icons/SecurityIcon';
import ConnectionIcon from '@/components/icons/ConnectionIcon';
import LeafIcon from '@/components/icons/LeafIcon';
import BoltIcon from '@/components/icons/BoltIcon';

// --- 1. Curated Icon Library ---
export const icons: IconData[] = [
  { id: 'growth', component: GrowthIcon, tags: ['finance', 'eco', 'consulting', 'modern', 'growth', 'minimalist', 'iconic', 'timeless'] },
  { id: 'security', component: SecurityIcon, tags: ['finance', 'tech', 'serious', 'security', 'corporate', 'minimalist', 'iconic', 'timeless'] },
  { id: 'connection', component: ConnectionIcon, tags: ['tech', 'community', 'modern', 'consulting', 'connection', 'elegant', 'unique', 'minimalist'] },
  { id: 'leaf', component: LeafIcon, tags: ['eco', 'wellness', 'nature', 'organic', 'minimalist', 'iconic', 'timeless', 'unique'] },
  { id: 'bolt', component: BoltIcon, tags: ['tech', 'energy', 'speed', 'modern', 'playful', 'unique', 'minimalist'] },
];

// --- 2. Curated Font Categories ---
export const fontCategories = {
  'modern-klar': [
    { name: 'Poppins', family: 'sans-serif', url: 'Poppins', weights: [400, 600], category: 'Modern & Klar' },
    { name: 'Montserrat', family: 'sans-serif', url: 'Montserrat', weights: [400, 700], category: 'Modern & Klar' },
    { name: 'Lato', family: 'sans-serif', url: 'Lato', weights: [400, 700], category: 'Modern & Klar' }
  ],
  'elegant-klassisch': [
    { name: 'Playfair Display', family: 'serif', url: 'Playfair+Display', weights: [400, 700], category: 'Elegant & Klassisch' },
    { name: 'Lora', family: 'serif', url: 'Lora', weights: [400, 700], category: 'Elegant & Klassisch' },
    { name: 'Cormorant Garamond', family: 'serif', url: 'Cormorant+Garamond', weights: [400, 700], category: 'Elegant & Klassisch' }
  ],
  'serioes-stark': [
    { name: 'Merriweather', family: 'serif', url: 'Merriweather', weights: [400, 700], category: 'Seriös & Stark' },
    { name: 'Libre Baskerville', family: 'serif', url: 'Libre+Baskerville', weights: [400, 700], category: 'Seriös & Stark' },
    { name: 'PT Serif', family: 'serif', url: 'PT+Serif', weights: [400, 700], category: 'Seriös & Stark' }
  ],
  'technisch-strukturiert': [
    { name: 'Roboto Mono', family: 'monospace', url: 'Roboto+Mono', weights: [400, 700], category: 'Technisch & Strukturiert' },
    { name: 'Source Code Pro', family: 'monospace', url: 'Source+Code+Pro', weights: [400, 700], category: 'Technisch & Strukturiert' },
    { name: 'Inconsolata', family: 'monospace', url: 'Inconsolata', weights: [400, 700], category: 'Technisch & Strukturiert' }
  ]
};

// --- 3. Pre-defined, Balanced Layouts ---
export const layouts: LayoutData[] = [
  { id: 'standard-top', name: 'Standard (Oben)', type: 'standard', arrangement: 'icon-top' },
  { id: 'standard-left', name: 'Standard (Links)', type: 'standard', arrangement: 'icon-left' },
  { id: 'enclosed-circle-top', name: 'Im Kreis (Oben)', type: 'enclosed', shape: 'circle', arrangement: 'icon-top' },
  { id: 'enclosed-shield-top', name: 'Im Schild (Oben)', type: 'enclosed', shape: 'shield', arrangement: 'icon-top' },
];

// --- 4. Professional Color Palettes (Optimiert für 11 goldene Farb-Regeln) ---
export const palettes: PaletteData[] = [
  // Regel 1: Begrenzte Farbpalette (max 3 Farben) ✓
  // Regel 2: Schwarz/Weiß Kompatibilität ✓
  // Regel 3: Hoher Kontrast ✓
  { id: 'trust-blue', name: 'Vertrauen & Stabilität', colors: ['#FFFFFF', '#2563EB', '#1E3A8A'], tags: ['corporate', 'tech', 'finance', 'serious', 'timeless', 'professional', 'trust'] },
  
  { id: 'eco-green', name: 'Natur & Wachstum', colors: ['#F7FEF7', '#22C55E', '#15803D'], tags: ['eco', 'wellness', 'organic', 'nature', 'timeless', 'professional', 'growth'] },
  
  { id: 'modern-tech', name: 'Innovation & Tech', colors: ['#F8FAFC', '#8B5CF6', '#5B21B6'], tags: ['tech', 'modern', 'creative', 'innovative', 'professional', 'energy'] },
  
  // Regel 6: Luxus = Schwarz/Gold Kombination
  { id: 'luxury-gold', name: 'Luxus & Exklusivität', colors: ['#FFFBEB', '#F59E0B', '#1F2937'], tags: ['luxury', 'elegant', 'corporate', 'timeless', 'classic', 'professional'] },
  
  // Regel 6: Kreativität = Gelb/Orange Optimismus  
  { id: 'creative-energy', name: 'Kreativität & Optimismus', colors: ['#FFFBEB', '#F97316', '#C2410C'], tags: ['creative', 'playful', 'energy', 'modern', 'memorable', 'optimism'] },
  
  // Professionelle Monochrom-Option
  { id: 'professional-mono', name: 'Professionell & Zeitlos', colors: ['#F8FAFC', '#64748B', '#1E293B'], tags: ['corporate', 'serious', 'timeless', 'classic', 'professional', 'versatile'] },
  
  // Wellness/Gesundheit in beruhigendem Blau-Grün
  { id: 'health-calm', name: 'Gesundheit & Vertrauen', colors: ['#F0FDFA', '#14B8A6', '#0F766E'], tags: ['wellness', 'tech', 'corporate', 'trust', 'professional', 'harmonious'] },
  
  // Warme, einladende Palette für Dienstleistungen
  { id: 'warm-service', name: 'Herzlich & Einladend', colors: ['#FEF7FF', '#C084FC', '#7C3AED'], tags: ['creative', 'elegant', 'modern', 'memorable', 'professional', 'approachable'] },
];

// --- 5. Definitions for the "AI" Logic ---
export const industries = {
  'tech': { tags: ['tech'], name: 'Technologie' },
  'finance': { tags: ['finance'], name: 'Finanzen' },
  'eco': { tags: ['eco', 'wellness'], name: 'Ökologie & Wellness' },
  'consulting': { tags: ['consulting', 'corporate'], name: 'Beratung' }
};

export const personalities: PersonalityData[] = [
  { id: 'modern', name: 'Modern & Innovativ', tags: ['modern', 'tech', 'minimalist'] },
  { id: 'elegant', name: 'Elegant & Luxuriös', tags: ['elegant', 'luxury'] },
  { id: 'serious', name: 'Seriös & Vertrauenswürdig', tags: ['serious', 'corporate'] },
  { id: 'playful', name: 'Verspielt & Kreativ', tags: ['playful', 'creative', 'vibrant'] },
  { id: 'organic', name: 'Natürlich & Organisch', tags: ['organic', 'nature', 'eco'] },
];