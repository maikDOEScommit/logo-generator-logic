// lib/state.ts
import { create } from 'zustand';
import { colorPalettes, fontCategories, ColorPalette, FontInfo } from './data';

// =================================================================
// CENTRAL STATE MANAGEMENT
// Single source of truth for the logo being designed
// =================================================================

export interface LogoState {
  text: string;
  fontInfo: FontInfo;
  fontWeight: number;
  colorPalette: ColorPalette;
}

export interface LogoActions {
  setText: (text: string) => void;
  setFont: (fontInfo: FontInfo, initialWeight?: number) => void;
  setFontWeight: (fontWeight: number) => void;
  setColorPalette: (palette: ColorPalette) => void;
}

// Safe default values from data.ts
const initialFont = fontCategories[0].fonts[0]; // Montserrat from Modern category
const initialPalette = colorPalettes[0]; // "Seriös & Vertrauensvoll"

export const useLogoStore = create<LogoState & LogoActions>((set) => ({
  // Initial state
  text: "DeinLogo",
  fontInfo: initialFont,
  fontWeight: initialFont.editorWeights[0], // First weight from editorWeights
  colorPalette: initialPalette,

  // Actions
  setText: (text) => set({ text }),

  setFont: (fontInfo, initialWeight) => set({
    fontInfo: fontInfo,
    // Reset fontWeight to sensible default when new font is selected
    fontWeight: initialWeight || fontInfo.editorWeights[0]
  }),

  setFontWeight: (fontWeight) => set({ fontWeight }),
  setColorPalette: (palette) => set({ colorPalette: palette }),
}));