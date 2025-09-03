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

// --- 4. Professional Color Palettes ---
export const palettes: PaletteData[] = [
  { id: 'trust-blue', name: 'Vertrauen & Stabilität', colors: ['#E0EFFF', '#6AACFF', '#0A2A4E'], tags: ['corporate', 'tech', 'finance', 'serious', 'timeless', 'professional'] },
  { id: 'eco-green', name: 'Natur & Wachstum', colors: ['#E6F5E3', '#77C66B', '#1E4620'], tags: ['eco', 'wellness', 'organic', 'nature', 'timeless', 'harmonious'] },
  { id: 'modern-tech', name: 'Innovation & Tech', colors: ['#E8E5FF', '#9378FF', '#2D2063'], tags: ['tech', 'modern', 'vibrant', 'creative', 'innovative', 'unique'] },
  { id: 'finance-gold', name: 'Seriosität & Finanzen', colors: ['#F5F5F5', '#C0C0C0', '#333333'], tags: ['finance', 'serious', 'corporate', 'luxury', 'timeless', 'classic'] },
  { id: 'vibrant-creative', name: 'Kreativität & Energie', colors: ['#FFF0E5', '#FF8C42', '#D94A00'], tags: ['creative', 'playful', 'energy', 'modern', 'vibrant', 'unique', 'memorable'] },
  { id: 'luxury-black', name: 'Eleganz & Luxus', colors: ['#EAEAEA', '#A8A8A8', '#1A1A1A'], tags: ['luxury', 'elegant', 'serious', 'modern', 'timeless', 'sophisticated'] },
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