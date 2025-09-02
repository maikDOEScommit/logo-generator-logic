import { HistoryState, Action, LogoConfig } from './types';

// Der initiale leere Zustand für ein neues Logo
export const initialLogoConfig: LogoConfig = {
  icon: null,
  font: null,
  layout: null,
  palette: null,
  text: '',
  slogan: '',
};

// Der initiale Zustand für unseren Reducer, inklusive der Historie
export const initialState: HistoryState = {
  past: [],
  present: initialLogoConfig,
  future: [],
};

// Die Reducer-Funktion, die die gesamte Zustandslogik kapselt
export function logoReducer(state: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case 'SET_CONFIG': {
      const newPresent = { ...state.present, ...action.payload };
      // Verhindert das Hinzufügen zur Historie bei reinen Text-Updates,
      // um die Undo/Redo-Experience flüssiger zu machen.
      const isTextChangeOnly = Object.keys(action.payload).every(k => ['text', 'slogan'].includes(k));
      if (JSON.stringify(newPresent) === JSON.stringify(state.present)) {
        return state;
      }

      // Nur zur Historie hinzufügen, wenn es sich nicht *nur* um eine Textänderung handelt.
      // So wird die Historie nicht mit jedem Tastenanschlag überflutet.
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