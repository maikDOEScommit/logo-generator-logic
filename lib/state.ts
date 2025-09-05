// lib/state.ts
import { create } from 'zustand';
import { colorPalettes, fontCategories, ColorPalette, FontInfo } from './data';

// =================================================================
// ZENTRALER ZUSTAND (STORE)
// Die "Single Source of Truth" für das zu erstellende Logo.
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

const initialFont = fontCategories[0].fonts[0]; // Sicherer Startwert: Montserrat

export const useLogoStore = create<LogoState & LogoActions>((set) => ({
  // Anfangszustand
  text: "DeinLogo",
  fontInfo: initialFont,
  fontWeight: initialFont.generationWeights[0], // Nimm den ersten Generations-Wert
  colorPalette: colorPalettes[0], // Sicherer Startwert: Seriös

  // Aktionen zum Ändern des Zustands
  setText: (text) => set({ text }),

  setFont: (fontInfo, initialWeight) => set({
    fontInfo: fontInfo,
    // Wenn eine neue Schriftart gewählt wird, setze das Gewicht auf einen sinnvollen
    // Startwert zurück: entweder den übergebenen oder den ersten Editor-Wert.
    fontWeight: initialWeight || fontInfo.editorWeights[0]
  }),

  setFontWeight: (fontWeight) => set({ fontWeight }),
  setColorPalette: (palette) => set({ colorPalette: palette }),
}));

// =================================================================
// COMPATIBILITY LAYER - Old reducer pattern for existing components
// =================================================================
export interface LogoConfig {
  icon: any;
  font: any;
  layout: any;
  palette: any;
  text: string;
  slogan: string;
}

export interface HistoryState {
  past: LogoConfig[];
  present: LogoConfig;
  future: LogoConfig[];
}

export interface Action {
  type: 'SET_CONFIG' | 'UNDO' | 'REDO';
  payload?: Partial<LogoConfig>;
}

const initialLogoConfig: LogoConfig = {
  icon: null,
  font: null,
  layout: null,
  palette: null,
  text: '',
  slogan: '',
};

export const initialState: HistoryState = {
  past: [],
  present: initialLogoConfig,
  future: [],
};

export function logoReducer(state: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case 'SET_CONFIG': {
      const newPresent = { ...state.present, ...action.payload };
      if (JSON.stringify(newPresent) === JSON.stringify(state.present)) {
        return state;
      }

      const isTextChangeOnly = Object.keys(action.payload || {}).every(k => ['text', 'slogan'].includes(k));
      
      if (isTextChangeOnly) {
        return { ...state, present: newPresent };
      }

      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [],
      };
    }
    case 'UNDO': {
      if (state.past.length === 0) {
        return state;
      }
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) {
        return state;
      }
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }
    default: {
      return state;
    }
  }
}