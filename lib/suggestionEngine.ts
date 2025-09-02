// --- lib/suggestionEngine.ts ---
// This is the new "brain" of our application.
// It proactively suggests the best options based on user input and design rules.

import { LogoConfig, IconData, PaletteData, FontData } from './types';
import { icons, fonts, palettes, industries, personalities } from './data';
import { DESIGN_RULES } from './designRules';

export function getSuggestions(
  industry: string | null,
  selectedPersonalities: string[],
  currentConfig: LogoConfig
) {
  if (!industry) {
    return { suggestedIcons: icons, suggestedFonts: fonts, suggestedPalettes: palettes };
  }

  const industryTags = industries[industry as keyof typeof industries]?.tags || [];
  const personalityTags = personalities
    .filter(p => selectedPersonalities.includes(p.id))
    .flatMap(p => p.tags);
  const activeTags = new Set([...industryTags, ...personalityTags]);

  // --- Intelligent Scoring Function ---
  // This is the core improvement. We score items not just on tag matches,
  // but on how well they adhere to our golden rules.
  const getScore = (item: IconData | PaletteData) => {
    let score = 0;
    // 1. Context Score (Relevance & Appropriateness) - High weight
    score += item.tags.reduce((s, tag) => activeTags.has(tag) ? s + 10 : s, 0);

    // 2. Design Rule Score (Timelessness, Memorability, etc.) - Medium weight
    // We create a temporary config to pass to the rule scorers
    const tempConfig = {
      ...currentConfig,
      icon: 'component' in item ? item : currentConfig.icon,
      palette: 'colors' in item ? item : currentConfig.palette,
    };

    const timelessnessScore = DESIGN_RULES.find(r => r.id === 'timelessness')?.scorer(tempConfig) || 0;
    const memorabilityScore = DESIGN_RULES.find(r => r.id === 'memorability')?.scorer(tempConfig) || 0;
    const uniquenessScore = DESIGN_RULES.find(r => r.id === 'uniqueness')?.scorer(tempConfig) || 0;

    score += (timelessnessScore + memorabilityScore + uniquenessScore) / 15; // Weighted score from rules
    return score;
  };

  const suggestedIcons = [...icons].sort((a, b) => getScore(b) - getScore(a));
  const suggestedPalettes = [...palettes].sort((a, b) => getScore(b) - getScore(a));

  // Fonts are sorted by pre-defined categories (a simpler, but effective rule)
  const suggestedFonts = [...fonts].sort((a, b) => {
    const aScore = a.category.includes('Klassisch') ? 3 : a.category.includes('Modern') ? 2 : 1;
    const bScore = b.category.includes('Klassisch') ? 3 : b.category.includes('Modern') ? 2 : 1;
    return bScore - aScore;
  });

  return { suggestedIcons, suggestedFonts, suggestedPalettes };
}