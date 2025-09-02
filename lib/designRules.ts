/**
 * Die 10 goldenen Regeln des Logodesigns - Engine-Implementierung
 * Diese Regeln sind das Fundament unserer Logo-Generator-Engine und stellen sicher,
 * dass jedes erstellte Logo professionell, effektiv und ästhetisch ansprechend ist.
 */

import { LogoConfig, PaletteData, LayoutData, IconData, FontData } from './types';

export interface DesignRule {
  id: string;
  name: string;
  description: string;
  validator: (config: LogoConfig) => boolean;
  scorer: (config: LogoConfig) => number; // 0-100 Score
}

export const DESIGN_RULES: DesignRule[] = [
  {
    id: 'simplicity',
    name: 'Einfachheit (Simplicity)',
    description: 'Ein Logo muss auf den ersten Blick verständlich und wiedererkennbar sein.',
    validator: (config) => {
      if (!config.text || !config.icon) return false;
      // Regel: Text sollte kurz sein (max 15 Zeichen), ein einziges Icon
      return config.text.length <= 15 && config.slogan.length <= 30;
    },
    scorer: (config) => {
      if (!config.text || !config.icon) return 0;
      let score = 100;
      // Längere Texte reduzieren den Score
      if (config.text.length > 10) score -= 20;
      if (config.text.length > 15) score -= 30;
      if (config.slogan.length > 20) score -= 15;
      return Math.max(0, score);
    }
  },
  {
    id: 'memorability',
    name: 'Einprägsamkeit (Memorability)',
    description: 'Ein gutes Logo hinterlässt einen bleibenden Eindruck durch einzigartige Form.',
    validator: (config) => {
      // Icons mit hoher Wiedererkennbarkeit bevorzugen
      return config.icon?.tags.includes('minimalist') || config.icon?.tags.includes('iconic') || false;
    },
    scorer: (config) => {
      if (!config.icon) return 0;
      let score = 50;
      if (config.icon.tags.includes('minimalist')) score += 25;
      if (config.icon.tags.includes('iconic')) score += 25;
      if (config.icon.tags.includes('unique')) score += 20;
      return Math.min(100, score);
    }
  },
  {
    id: 'timelessness',
    name: 'Zeitlosigkeit (Timelessness)',
    description: 'Ein starkes Logo überdauert kurzlebige Trends und bleibt relevant.',
    validator: (config) => {
      if (!config.font) return false;
      // Klassische Schriftarten bevorzugen, keine zu trendigen Farben
      return config.font.category.includes('Klassisch') || config.font.category.includes('Modern');
    },
    scorer: (config) => {
      if (!config.font || !config.palette) return 0;
      let score = 60;
      if (config.font.category.includes('Klassisch')) score += 25;
      if (config.font.category.includes('Modern')) score += 20;
      // Neutrale, professionelle Farben bevorzugen
      if (config.palette.tags.includes('corporate') || config.palette.tags.includes('serious')) score += 15;
      return Math.min(100, score);
    }
  },
  {
    id: 'versatility',
    name: 'Vielseitigkeit & Skalierbarkeit',
    description: 'Das Logo muss in jeder Größe und auch in Schwarz-Weiß funktionieren.',
    validator: (config) => {
      // Layouts mit guter Skalierbarkeit bevorzugen
      return config.layout?.type === 'standard' || config.layout?.type === 'enclosed';
    },
    scorer: (config) => {
      if (!config.layout || !config.icon) return 0;
      let score = 70;
      if (config.layout.type === 'standard') score += 20;
      if (config.layout.arrangement === 'icon-left') score += 10; // Bessere Lesbarkeit
      return Math.min(100, score);
    }
  },
  {
    id: 'appropriateness',
    name: 'Angemessenheit (Appropriateness)',
    description: 'Das Design muss zur Branche und Zielgruppe passen.',
    validator: (config) => {
      // Wird durch die Filterlogik basierend auf Branche gewährleistet
      return true;
    },
    scorer: (config) => {
      // Score basiert auf der Übereinstimmung der Tags zwischen Icon, Palette und Branche
      if (!config.icon || !config.palette) return 0;
      const iconTags = new Set(config.icon.tags);
      const paletteTags = new Set(config.palette.tags);
      const intersection = Array.from(iconTags).filter(tag => paletteTags.has(tag));
      return Math.min(100, 50 + intersection.length * 10);
    }
  },
  {
    id: 'relevance',
    name: 'Relevanz (Relevance)',
    description: 'Das Logo transportiert die Kernidee der Marke, ohne wortwörtlich zu sein.',
    validator: (config) => {
      return config.icon?.tags ? config.icon.tags.length > 2 : false; // Icons mit mehreren semantischen Tags
    },
    scorer: (config) => {
      if (!config.icon) return 0;
      let score = 40;
      // Je mehr Tags, desto relevanter (aber nicht zu spezifisch)
      const tagCount = config.icon.tags.length;
      if (tagCount >= 3) score += 30;
      if (tagCount >= 4) score += 20;
      if (tagCount >= 6) score += 10;
      return Math.min(100, score);
    }
  },
  {
    id: 'uniqueness',
    name: 'Einzigartigkeit (Uniqueness)',
    description: 'Das Logo muss sich klar von der Konkurrenz abheben.',
    validator: (config) => {
      // Unique Tags oder ungewöhnliche Kombinationen bevorzugen
      return config.icon?.tags.includes('unique') || 
             config.palette?.tags.includes('creative') ||
             config.palette?.tags.includes('vibrant') || false;
    },
    scorer: (config) => {
      if (!config.icon || !config.palette) return 0;
      let score = 50;
      if (config.icon.tags.includes('unique')) score += 25;
      if (config.palette.tags.includes('creative')) score += 15;
      if (config.palette.tags.includes('vibrant')) score += 10;
      return Math.min(100, score);
    }
  },
  {
    id: 'balance',
    name: 'Ausgewogenheit & Proportion',
    description: 'Visuelle Elemente sind harmonisch und ausbalanciert angeordnet.',
    validator: (config) => {
      // Layouts gewährleisten bereits gute Balance
      return config.layout !== null;
    },
    scorer: (config) => {
      if (!config.layout) return 0;
      let score = 80; // Layouts sind bereits ausgewogen
      if (config.layout.arrangement === 'icon-top') score += 10; // Symmetrische Anordnung
      if (config.layout.type === 'enclosed') score += 10; // Rahmen sorgt für Balance
      return Math.min(100, score);
    }
  },
  {
    id: 'colorChoice',
    name: 'Intelligente Farbwahl',
    description: 'Farben wecken gezielt Emotionen und unterstützen die Markenbotschaft.',
    validator: (config) => {
      return config.palette?.tags ? config.palette.tags.length > 1 : false; // Paletten mit klaren Assoziationen
    },
    scorer: (config) => {
      if (!config.palette) return 0;
      let score = 60;
      // Je mehr semantische Tags, desto intelligenter die Farbwahl
      score += config.palette.tags.length * 8;
      return Math.min(100, score);
    }
  },
  {
    id: 'concept',
    name: 'Konzeptstärke (Strong Concept)',
    description: 'Starke, strategische Idee basierend auf Markenidentität.',
    validator: (config) => {
      // Vollständige Konfiguration mit durchdachter Kombination
      return !!(config.icon && config.font && config.layout && config.palette && config.text);
    },
    scorer: (config) => {
      if (!config.icon || !config.font || !config.layout || !config.palette || !config.text) return 0;
      let score = 70;
      
      // Bonus für kohärente Tag-Übereinstimmungen
      const allTags = [
        ...(config.icon?.tags || []),
        ...(config.palette?.tags || [])
      ];
      const tagFrequency = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const repeatedTags = Object.values(tagFrequency).filter(count => count > 1).length;
      score += repeatedTags * 5; // Bonus für kohärente Themen
      
      return Math.min(100, score);
    }
  }
];

/**
 * Bewertet eine Logo-Konfiguration basierend auf den 10 goldenen Regeln
 */
export function evaluateLogoDesign(config: LogoConfig): {
  overallScore: number;
  ruleScores: Record<string, number>;
  passedRules: string[];
  failedRules: string[];
} {
  const ruleScores: Record<string, number> = {};
  const passedRules: string[] = [];
  const failedRules: string[] = [];

  for (const rule of DESIGN_RULES) {
    const score = rule.scorer(config);
    const passed = rule.validator(config);
    
    ruleScores[rule.id] = score;
    
    if (passed && score >= 70) {
      passedRules.push(rule.id);
    } else {
      failedRules.push(rule.id);
    }
  }

  const overallScore = Math.round(
    Object.values(ruleScores).reduce((sum, score) => sum + score, 0) / DESIGN_RULES.length
  );

  return {
    overallScore,
    ruleScores,
    passedRules,
    failedRules
  };
}

/**
 * Schlägt Verbesserungen basierend auf den Design-Regeln vor
 */
export function suggestImprovements(config: LogoConfig): string[] {
  const evaluation = evaluateLogoDesign(config);
  const suggestions: string[] = [];

  if (evaluation.failedRules.includes('simplicity')) {
    suggestions.push('Vereinfachen Sie den Markennamen (max. 15 Zeichen) und den Slogan (max. 30 Zeichen)');
  }

  if (evaluation.failedRules.includes('timelessness')) {
    suggestions.push('Wählen Sie eine klassische Schriftart und professionelle Farben für mehr Zeitlosigkeit');
  }

  if (evaluation.failedRules.includes('versatility')) {
    suggestions.push('Ein Standard-Layout mit Icon links verbessert die Skalierbarkeit');
  }

  if (evaluation.failedRules.includes('uniqueness')) {
    suggestions.push('Wählen Sie eine kreativere Farbpalette oder ein einzigartigeres Symbol');
  }

  if (evaluation.failedRules.includes('concept')) {
    suggestions.push('Vervollständigen Sie alle Elemente für ein starkes Gesamtkonzept');
  }

  return suggestions;
}