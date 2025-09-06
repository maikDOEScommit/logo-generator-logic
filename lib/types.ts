import { FC } from 'react';

// === KERN-TYPEN FÜR DIE DATEN-ENGINE ===

export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  [key: string]: any;
}

export interface IconData {
  id: string;
  component: FC<IconProps>;
  tags: string[];
}

export interface FontData {
  name: string;
  family: string;
  url: string;
  weights: number[];
  category: string;
}

export interface LayoutData {
  id: string;
  name: string;
  type: 'standard' | 'enclosed';
  shape?: 'circle' | 'shield';
  arrangement: 'icon-top' | 'icon-left' | 'text-left';
}

export interface PaletteData {
  id: string;
  name: string;
  colors: [string, string, string] | [string, string, string, string]; // [background, primary, text] or [background, primary, secondary, accent]
  tags: string[];
}

export interface PersonalityData {
  id: string;
  name: string;
  tags: string[];
}

// === ZUSTANDS-TYPEN FÜR DIE ANWENDUNG & REDUCER ===

export interface LogoConfig {
  icon: IconData | null;
  font: FontData | null;
  layout: LayoutData | null;
  palette: PaletteData | null;
  text: string;
  slogan: string;
  enclosingShape: IconData | null; // Shape that encloses the entire logo (circle, shield, etc.)
  customColor?: string;
  selectedColorOption?: string; // Referenz auf colorOptions.id (base-only, add-white, add-black, add-black-white)
  baseColor?: string; // Die ursprünglich gewählte Grundfarbe
}

// === FARB-GENERATIONS-TYPEN ===

export interface ColorVariation {
  name: string;
  brandNameColor: string;
  iconColor: string;
  backgroundColor: string;
  sloganColor: string;
}

export interface GeneratedLogoVariation extends LogoConfig {
  variationName: string;
  colorVariation: ColorVariation;
}

export interface HistoryState {
  past: LogoConfig[];
  present: LogoConfig;
  future: LogoConfig[];
}

export type Action =
  | { type: 'SET_CONFIG'; payload: Partial<LogoConfig> }
  | { type: 'UNDO' }
  | { type: 'REDO' };