import { IconProps, IconData, FontData, LayoutData, PaletteData, PersonalityData } from './types';
import { FC } from 'react';

// --- 1. Kuratierte Icon-Bibliothek ---
const GrowthIcon: FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3L21 7L15 13L11 9L3 17" stroke={props.color || 'currentColor'} />
    <polyline points="14 3 17 3 17 6" stroke={props.color || 'currentColor'} />
  </svg>
);

const SecurityIcon: FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={props.color || 'currentColor'}/>
  </svg>
);

const ConnectionIcon: FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 00-5-5H3M14 7a5 5 0 005-5V0M3 21h2a5 5 0 005-5v-1M14 17v1a5 5 0 005 5h2" stroke={props.color || 'currentColor'} />
  </svg>
);

const LeafIcon: FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={props.color || 'currentColor'}/>
    <path d="M12 2a10 10 0 00-2 19.8" stroke={props.color || 'currentColor'}/>
  </svg>
);

const BoltIcon: FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke={props.color || 'currentColor'}/>
  </svg>
);

export const icons: IconData[] = [
  { id: 'growth', component: GrowthIcon, tags: ['finance', 'eco', 'consulting', 'modern', 'growth', 'minimalist', 'iconic', 'timeless'] },
  { id: 'security', component: SecurityIcon, tags: ['finance', 'tech', 'serious', 'security', 'corporate', 'minimalist', 'iconic', 'timeless'] },
  { id: 'connection', component: ConnectionIcon, tags: ['tech', 'community', 'modern', 'consulting', 'connection', 'elegant', 'unique', 'minimalist'] },
  { id: 'leaf', component: LeafIcon, tags: ['eco', 'wellness', 'nature', 'organic', 'minimalist', 'iconic', 'timeless', 'unique'] },
  { id: 'bolt', component: BoltIcon, tags: ['tech', 'energy', 'speed', 'modern', 'playful', 'unique', 'minimalist'] },
];

// --- 2. Kuratierte Schriftarten ---
export const fonts: FontData[] = [
  { name: 'Montserrat', family: 'sans-serif', url: 'Montserrat', weights: [400, 700], category: 'Sans-Serif - Modern' },
  { name: 'Poppins', family: 'sans-serif', url: 'Poppins', weights: [400, 600], category: 'Sans-Serif - Modern' },
  { name: 'Lato', family: 'sans-serif', url: 'Lato', weights: [400, 700], category: 'Sans-Serif - Modern' },
  { name: 'Merriweather', family: 'serif', url: 'Merriweather', weights: [400, 700], category: 'Serif - Klassisch' },
  { name: 'Playfair Display', family: 'serif', url: 'Playfair+Display', weights: [400, 700], category: 'Serif - Elegant' },
  { name: 'Roboto Slab', family: 'serif', url: 'Roboto+Slab', weights: [400, 700], category: 'Serif - Modern' },
];

// --- 3. Vordefinierte, ausgewogene Layouts ---
export const layouts: LayoutData[] = [
  { id: 'standard-top', name: 'Standard (Oben)', type: 'standard', arrangement: 'icon-top' },
  { id: 'standard-left', name: 'Standard (Links)', type: 'standard', arrangement: 'icon-left' },
  { id: 'enclosed-circle-top', name: 'Im Kreis (Oben)', type: 'enclosed', shape: 'circle', arrangement: 'icon-top' },
  { id: 'enclosed-shield-top', name: 'Im Schild (Oben)', type: 'enclosed', shape: 'shield', arrangement: 'icon-top' },
];

// --- 4. Professionelle Farbpaletten ---
export const palettes: PaletteData[] = [
  { id: 'trust-blue', name: 'Vertrauen & Stabilität', colors: ['#E0EFFF', '#6AACFF', '#0A2A4E'], tags: ['corporate', 'tech', 'finance', 'serious', 'timeless', 'professional'] },
  { id: 'eco-green', name: 'Natur & Wachstum', colors: ['#E6F5E3', '#77C66B', '#1E4620'], tags: ['eco', 'wellness', 'organic', 'nature', 'timeless', 'harmonious'] },
  { id: 'modern-tech', name: 'Innovation & Tech', colors: ['#E8E5FF', '#9378FF', '#2D2063'], tags: ['tech', 'modern', 'vibrant', 'creative', 'innovative', 'unique'] },
  { id: 'finance-gold', name: 'Seriosität & Finanzen', colors: ['#F5F5F5', '#C0C0C0', '#333333'], tags: ['finance', 'serious', 'corporate', 'luxury', 'timeless', 'classic'] },
  { id: 'vibrant-creative', name: 'Kreativität & Energie', colors: ['#FFF0E5', '#FF8C42', '#D94A00'], tags: ['creative', 'playful', 'energy', 'modern', 'vibrant', 'unique', 'memorable'] },
  { id: 'luxury-black', name: 'Eleganz & Luxus', colors: ['#EAEAEA', '#A8A8A8', '#1A1A1A'], tags: ['luxury', 'elegant', 'serious', 'modern', 'timeless', 'sophisticated'] },
];

// --- 5. Definitionen für die "KI"-Logik ---
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