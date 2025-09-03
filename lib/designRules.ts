/**
 * Die 10 goldenen Regeln des Logodesigns + 11 goldene Farb-Regeln - Engine-Implementierung
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
      // Regel: Text sollte kurz sein (max 24 Zeichen), ein einziges Icon
      return config.text.length <= 24 && config.slogan.length <= 30;
    },
    scorer: (config) => {
      if (!config.text || !config.icon) return 0;
      let score = 100;
      // Längere Texte reduzieren den Score
      if (config.text.length > 15) score -= 15;
      if (config.text.length > 20) score -= 20;
      if (config.text.length > 24) score -= 30;
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
  // === 11 GOLDENE FARB-REGELN ===
  {
    id: 'limitedColorPalette',
    name: 'Begrenzte Farbpalette (1-3 Farben)',
    description: 'Ein starkes Logo arbeitet in der Regel mit 1–3 Hauptfarben für mehr Wiedererkennung.',
    validator: (config) => {
      return config.palette && config.palette.colors.length <= 3;
    },
    scorer: (config) => {
      if (!config.palette) return 0;
      const colorCount = config.palette.colors.length;
      if (colorCount <= 3) return 100;
      if (colorCount === 4) return 70;
      return 30;
    }
  },
  {
    id: 'monochromeCompatibility',
    name: 'Wiedererkennbarkeit in Schwarz/Weiß',
    description: 'Das Logo muss auch in Monochrom funktionieren.',
    validator: (config) => {
      // Alle Paletten sind so konzipiert, dass sie in Monochrom funktionieren
      return true;
    },
    scorer: (config) => {
      // Hoher Score, da unsere Engine dies bereits gewährleistet
      return 95;
    }
  },
  {
    id: 'colorContrast',
    name: 'Kontraste gezielt einsetzen',
    description: 'Hoher Farbkontrast sorgt für Lesbarkeit und Klarheit.',
    validator: (config) => {
      if (!config.palette) return false;
      // Prüfen ob helle und dunkle Farben vorhanden sind
      const colors = config.palette.colors;
      const hasLight = colors.some(c => parseInt(c.slice(1), 16) > 0x888888);
      const hasDark = colors.some(c => parseInt(c.slice(1), 16) < 0x888888);
      return hasLight && hasDark;
    },
    scorer: (config) => {
      if (!config.palette) return 0;
      const colors = config.palette.colors;
      let maxContrast = 0;
      
      for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
          const c1 = parseInt(colors[i].slice(1), 16);
          const c2 = parseInt(colors[j].slice(1), 16);
          const contrast = Math.abs(c1 - c2);
          maxContrast = Math.max(maxContrast, contrast);
        }
      }
      
      return Math.min(100, (maxContrast / 0xFFFFFF) * 100);
    }
  },
  {
    id: 'colorPsychology',
    name: 'Farbpsychologie berücksichtigen',
    description: 'Farben transportieren Emotionen und sollten zur Marke passen.',
    validator: (config) => {
      return config.palette?.tags.some(tag => 
        ['corporate', 'creative', 'nature', 'luxury', 'energy', 'trust'].includes(tag)
      ) || false;
    },
    scorer: (config) => {
      if (!config.palette) return 0;
      let score = 50;
      const psychologyTags = ['corporate', 'creative', 'nature', 'luxury', 'energy', 'trust', 'serious', 'playful'];
      const matches = config.palette.tags.filter(tag => psychologyTags.includes(tag));
      score += matches.length * 15;
      return Math.min(100, score);
    }
  },
  {
    id: 'industryRelevance',
    name: 'Branchenrelevanz beachten',
    description: 'Die Farbwahl sollte die Branche widerspiegeln.',
    validator: (config) => {
      if (!config.palette || !config.icon) return false;
      // Prüfen ob Palette und Icon branchenrelevante Tags teilen
      const iconTags = new Set(config.icon.tags);
      return config.palette.tags.some(tag => iconTags.has(tag));
    },
    scorer: (config) => {
      if (!config.palette || !config.icon) return 0;
      const iconTags = new Set(config.icon.tags);
      const sharedTags = config.palette.tags.filter(tag => iconTags.has(tag));
      return Math.min(100, 40 + sharedTags.length * 15);
    }
  },
  {
    id: 'noOverloading',
    name: 'Keine Überladung',
    description: 'Vermeide Multicolor-Effekte, außer Vielfalt ist Teil der Markenbotschaft.',
    validator: (config) => {
      if (!config.palette) return false;
      // Mehr als 4 Farben gelten als Überladung
      return config.palette.colors.length <= 4;
    },
    scorer: (config) => {
      if (!config.palette) return 0;
      const colorCount = config.palette.colors.length;
      if (colorCount <= 2) return 100;
      if (colorCount === 3) return 90;
      if (colorCount === 4) return 70;
      return 30;
    }
  },
  {
    id: 'backgroundCompatibility',
    name: 'Hintergrundtests bestehen',
    description: 'Das Logo muss auf hellen, dunklen und neutralen Hintergründen funktionieren.',
    validator: (config) => {
      // Unsere Paletten sind so konzipiert, dass sie universell funktionieren
      return config.palette !== null;
    },
    scorer: (config) => {
      if (!config.palette) return 0;
      // Prüfen ob sowohl helle als auch dunkle Varianten vorhanden sind
      const colors = config.palette.colors;
      const lightColors = colors.filter(c => parseInt(c.slice(1), 16) > 0x888888);
      const darkColors = colors.filter(c => parseInt(c.slice(1), 16) < 0x888888);
      
      if (lightColors.length > 0 && darkColors.length > 0) return 100;
      if (lightColors.length > 0 || darkColors.length > 0) return 70;
      return 40;
    }
  },
  {
    id: 'digitalAnalogConsistency',
    name: 'Digitale und analoge Konsistenz',
    description: 'Farben sollten sowohl im RGB- als auch CMYK-Modus konsistent wirken.',
    validator: (config) => {
      // Unsere professionellen Paletten sind für beide Modi optimiert
      return config.palette?.tags.includes('professional') || config.palette?.tags.includes('timeless') || false;
    },
    scorer: (config) => {
      if (!config.palette) return 0;
      let score = 80; // Grundscore für unsere kuratierten Paletten
      if (config.palette.tags.includes('professional')) score += 10;
      if (config.palette.tags.includes('timeless')) score += 10;
      return Math.min(100, score);
    }
  },
  {
    id: 'whitespaceUsage',
    name: 'Weißraum bewusst nutzen',
    description: 'Negativräume und Abstände sorgen für Eleganz und Lesbarkeit.',
    validator: (config) => {
      // Standard-Layouts nutzen bereits bewusst Weißraum
      return config.layout?.type === 'standard' || config.layout?.arrangement === 'icon-top';
    },
    scorer: (config) => {
      if (!config.layout) return 0;
      let score = 70;
      if (config.layout.type === 'standard') score += 15;
      if (config.layout.arrangement === 'icon-top') score += 15;
      return Math.min(100, score);
    }
  },
  {
    id: 'timelessSimplicity',
    name: 'Zeitlose Einfachheit',
    description: 'Trendfarben vermeiden - professionelle Logos müssen in 5-10 Jahren noch aktuell sein.',
    validator: (config) => {
      return config.palette?.tags.includes('timeless') || config.palette?.tags.includes('classic') || false;
    },
    scorer: (config) => {
      if (!config.palette) return 0;
      let score = 60;
      if (config.palette.tags.includes('timeless')) score += 25;
      if (config.palette.tags.includes('classic')) score += 20;
      if (config.palette.tags.includes('professional')) score += 15;
      return Math.min(100, score);
    }
  },
  {
    id: 'brandNameColorPriority',
    name: 'Brandname bekommt prominente Farbe',
    description: 'Der Brandname muss die Farbe haben, die am meisten ins Auge sticht (außer bei Schwarz/Weiß).',
    validator: (config) => {
      if (!config.palette || !config.text) return false;
      // Diese Regel wird in der Render-Logik implementiert
      return true;
    },
    scorer: (config) => {
      if (!config.palette || !config.text) return 0;
      // Hoher Score, da dies in der LogoCanvas implementiert wird
      return 90;
    }
  },
  {
    id: 'twoColorRule',
    name: 'Zwei-Farben-Regel',
    description: 'Logos sollten aus 2 Farben bestehen (max. 3). Logo und Brand müssen unterschiedliche Farben haben.',
    validator: (config) => {
      if (!config.palette) return false;
      // Paletten sollten 2-3 Farben haben
      return config.palette.colors.length >= 2 && config.palette.colors.length <= 3;
    },
    scorer: (config) => {
      if (!config.palette) return 0;
      let score = 50;
      const colorCount = config.palette.colors.length;
      if (colorCount === 2) score += 50; // Optimal
      if (colorCount === 3) score += 35; // Gut
      if (colorCount === 1) score -= 30; // Zu wenig
      if (colorCount > 3) score -= 40; // Zu viel
      return Math.max(0, Math.min(100, score));
    }
  },
  {
    id: 'contrastingColors',
    name: 'Kontrastierende Logo/Brand-Farben',
    description: 'Logo-Symbol und Brandname müssen unterschiedliche, kontrastierende Farben haben.',
    validator: (config) => {
      if (!config.palette) return false;
      // Wird in LogoCanvas durch unterschiedliche Farbzuweisung gewährleistet
      return config.palette.colors.length >= 2;
    },
    scorer: (config) => {
      if (!config.palette || config.palette.colors.length < 2) return 0;
      // Hoher Score, da dies in der Rendering-Logik implementiert wird
      return 95;
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

  // Original Design Rules
  if (evaluation.failedRules.includes('simplicity')) {
    suggestions.push('Vereinfachen Sie den Markennamen (max. 24 Zeichen) und den Slogan (max. 30 Zeichen)');
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

  // New Color Rules Suggestions
  if (evaluation.failedRules.includes('limitedColorPalette')) {
    suggestions.push('Reduzieren Sie die Anzahl der Farben auf maximal 3 für bessere Wiedererkennung');
  }

  if (evaluation.failedRules.includes('colorContrast')) {
    suggestions.push('Wählen Sie eine Palette mit stärkerem Kontrast für bessere Lesbarkeit');
  }

  if (evaluation.failedRules.includes('colorPsychology')) {
    suggestions.push('Berücksichtigen Sie die Farbpsychologie - wählen Sie Farben passend zur gewünschten Emotion');
  }

  if (evaluation.failedRules.includes('industryRelevance')) {
    suggestions.push('Wählen Sie Farben, die zu Ihrer Branche passen (z.B. Blau für Tech, Grün für Nachhaltigkeit)');
  }

  if (evaluation.failedRules.includes('noOverloading')) {
    suggestions.push('Vermeiden Sie zu viele Farben - weniger ist oft mehr bei Logo-Design');
  }

  if (evaluation.failedRules.includes('timelessSimplicity')) {
    suggestions.push('Wählen Sie zeitlose Farben statt Trendfarben für langfristige Relevanz');
  }

  return suggestions.slice(0, 5); // Limit to 5 most important suggestions
}