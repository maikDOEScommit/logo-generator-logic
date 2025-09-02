Full Refactoring Plan: From Reactive Critic to Proactive Art Director
Hello Claude. You will act as a senior software architect. Your mission is to refactor our existing Next.js logo generator application into a more professional, scalable, and intelligent system.

The Core Goal: Transform the application from a "passive critic" (evaluating user choices after the fact) into a "proactive art director" (intelligently guiding user choices from the start). We will achieve this by deeply integrating our designRules into a new suggestionEngine and by restructuring the entire frontend into a clean, component-based architecture.

Please follow this guide precisely. You will be creating, deleting, and modifying several files. The final code for each file is provided.

Step 1: Create the Proactive SuggestionEngine
Goal: Centralize the application's "brain" into a single, powerful module.

Action: Create a new file lib/suggestionEngine.ts. This engine will be responsible for filtering and, most importantly, intelligently scoring and sorting all suggestions (icons, palettes, fonts) based on the user's input and our established design rules.

File to Create: lib/suggestionEngine.ts

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

Step 2: Restructure the Data Layer for Scalability
Goal: Decouple the SVG icon components from the main data configuration file.

Action:

Create a new directory components/icons.

Create a separate .tsx file for each icon component.

Update the lib/data.ts file to import these components. The file extension of lib/data.tsx should be changed to lib/data.ts.

Files to Create:

components/icons/GrowthIcon.tsx

import { IconProps } from '@/lib/types';
import { FC } from 'react';

const GrowthIcon: FC<IconProps> = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M17 3L21 7L15 13L11 9L3 17" stroke={props.color || 'currentColor'} />
<polyline points="14 3 17 3 17 6" stroke={props.color || 'currentColor'} />
</svg>
);
export default GrowthIcon;

components/icons/SecurityIcon.tsx

import { IconProps } from '@/lib/types';
import { FC } from 'react';

const SecurityIcon: FC<IconProps> = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={props.color || 'currentColor'}/>
</svg>
);
export default SecurityIcon;

components/icons/ConnectionIcon.tsx

import { IconProps } from '@/lib/types';
import { FC } from 'react';

const ConnectionIcon: FC<IconProps> = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M10 13a5 5 0 00-5-5H3M14 7a5 5 0 005-5V0M3 21h2a5 5 0 005-5v-1M14 17v1a5 5 0 005 5h2" stroke={props.color || 'currentColor'} />
</svg>
);
export default ConnectionIcon;

components/icons/LeafIcon.tsx

import { IconProps } from '@/lib/types';
import { FC } from 'react';

const LeafIcon: FC<IconProps> = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={props.color || 'currentColor'}/>
<path d="M12 2a10 10 0 00-2 19.8" stroke={props.color || 'currentColor'}/>
</svg>
);
export default LeafIcon;

components/icons/BoltIcon.tsx

import { IconProps } from '@/lib/types';
import { FC } from 'react';

const BoltIcon: FC<IconProps> = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke={props.color || 'currentColor'}/>
</svg>
);
export default BoltIcon;

File to Modify: lib/data.ts (rename from data.tsx)

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

// --- 2. Curated Fonts ---
export const fonts: FontData[] = [
{ name: 'Montserrat', family: 'sans-serif', url: 'Montserrat', weights: [400, 700], category: 'Sans-Serif - Modern' },
{ name: 'Poppins', family: 'sans-serif', url: 'Poppins', weights: [400, 600], category: 'Sans-Serif - Modern' },
{ name: 'Lato', family: 'sans-serif', url: 'Lato', weights: [400, 700], category: 'Sans-Serif - Modern' },
{ name: 'Merriweather', family: 'serif', url: 'Merriweather', weights: [400, 700], category: 'Serif - Klassisch' },
{ name: 'Playfair Display', family: 'serif', url: 'Playfair+Display', weights: [400, 700], category: 'Serif - Elegant' },
{ name: 'Roboto Slab', family: 'serif', url: 'Roboto+Slab', weights: [400, 700], category: 'Serif - Modern' },
];

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

Step 3: Deconstruct the Monolith into a Clean Component Architecture
Goal: Transform the single app/page.tsx into a well-structured set of smaller, reusable components.

Action:

Create new directories: components/ui, components/editor, components/preview.

Create new component files inside these directories.

Move the relevant logic and JSX from the old page.tsx into these new, focused components.

Files to Create:

components/ui/Section.tsx

import { motion } from 'framer-motion';

const Section = ({ title, children, helpText }: { title: string, children: React.ReactNode, helpText?: string }) => (
<motion.div
className="w-full"
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1, duration: 0.4 }}

>

    <h2 className="text-xl font-bold mb-4 text-primary">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {children}
    </div>
    {helpText && <div className="text-xs text-white/60 mt-4">{helpText}</div>}

</motion.div>
);
export default Section;

components/ui/SelectionCard.tsx

import { Check } from 'lucide-react';

const SelectionCard = ({ children, isSelected, onClick }: { children: React.ReactNode, isSelected: boolean, onClick: () => void }) => (

  <div
    onClick={onClick}
    className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 h-24 flex items-center justify-center text-center ${
      isSelected ? 'border-primary ring-2 ring-primary bg-primary/10' : 'border-white/20 hover:border-white/50 bg-white/5'
    }`}
  >
    {children}
    {isSelected && <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1"><Check size={12} /></div>}
  </div>
);
export default SelectionCard;

components/editor/Step1_Industry.tsx

import { motion } from 'framer-motion';
import { industries } from '@/lib/data';
import Section from '@/components/ui/Section';
import SelectionCard from '@/components/ui/SelectionCard';

interface Props {
industry: string | null;
setIndustry: (industry: string) => void;
onNext: () => void;
}

const Step1_Industry = ({ industry, setIndustry, onNext }: Props) => (
<motion.div key="step1" className="space-y-8 animate-fade-in">
<h1 className="text-4xl font-bold">Erzählen Sie uns von Ihrer Marke</h1>
<Section title="In welcher Branche sind Sie tätig?">
{Object.entries(industries).map(([key, value]) => (
<SelectionCard key={key} isSelected={industry === key} onClick={() => setIndustry(key)}>
<p className="font-bold">{value.name}</p>
</SelectionCard>
))}
</Section>
<button onClick={onNext} disabled={!industry} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
Weiter
</button>
</motion.div>
);
export default Step1_Industry;

components/editor/Step2_Branding.tsx

import { motion } from 'framer-motion';
import { personalities } from '@/lib/data';
import { LogoConfig } from '@/lib/types';

interface Props {
config: LogoConfig;
updateConfig: (newConfig: Partial<LogoConfig>) => void;
selectedPersonalities: string[];
onTogglePersonality: (id: string) => void;
onNext: () => void;
}

const Step2_Branding = ({ config, updateConfig, selectedPersonalities, onTogglePersonality, onNext }: Props) => (
<motion.div key="step2" className="space-y-8 animate-fade-in">
<div>
<label htmlFor="text" className="block text-xl font-bold mb-2 text-primary">Markenname</label>
<input
type="text"
id="text"
value={config.text}
onChange={(e) => updateConfig({ text: e.target.value })}
className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary focus:outline-none"
placeholder="z.B. Quantum Leap"
maxLength={15}
/>
<div className="text-xs text-white/50 mt-1 flex justify-between">
<span>Regel 1: Einfachheit - Kurze Namen prägen sich besser ein</span>
<span className={config.text.length > 10 ? 'text-yellow-400' : 'text-green-400'}>
{config.text.length}/15
</span>
</div>
</div>
<div>
<label className="block text-xl font-bold mb-2 text-primary">Markenpersönlichkeit (max. 2)</label>
<div className="flex flex-wrap gap-2">{personalities.map(p =>
<button
key={p.id}
onClick={() => onTogglePersonality(p.id)}
className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedPersonalities.includes(p.id) ? 'bg-primary text-primary-foreground' : 'bg-white/10 hover:bg-white/20'}`} >
{p.name}
</button>
)}</div>
<div className="text-xs text-white/50 mt-2">
Regel 6: Relevanz - Diese Eigenschaften helfen bei der passenden Symbolauswahl
</div>
</div>
<button onClick={onNext} disabled={!config.text} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
Weiter zur Gestaltung
</button>
</motion.div>
);
export default Step2_Branding;

components/editor/Step3_Design.tsx

import { motion } from 'framer-motion';
import { LogoConfig, IconData, FontData, LayoutData, PaletteData } from '@/lib/types';
import Section from '@/components/ui/Section';
import SelectionCard from '@/components/ui/SelectionCard';
import { layouts } from '@/lib/data';
import { Circle, Shield } from 'lucide-react';

const LayoutSelectionCard = ({ layout, isSelected, onClick }: { layout: LayoutData, isSelected: boolean, onClick: () => void }) => (
<SelectionCard isSelected={isSelected} onClick={onClick}>
<div className="flex flex-col items-center justify-center gap-2 text-xs">
{layout.shape === 'circle' && <Circle size={24}/>}
{layout.shape === 'shield' && <Shield size={24}/>}
{!layout.shape && (layout.arrangement === 'icon-top' ? <div className="space-y-1"><div className="w-4 h-4 bg-white/50 rounded-sm mx-auto"></div><div className="w-8 h-2 bg-white/50 rounded-sm"></div></div> : <div className="flex gap-1 items-center"><div className="w-4 h-4 bg-white/50 rounded-sm"></div><div className="w-8 h-2 bg-white/50 rounded-sm"></div></div>)}
<p className="mt-1">{layout.name}</p>
</div>
</SelectionCard>
);

interface Props {
config: LogoConfig;
updateConfig: (newConfig: Partial<LogoConfig>) => void;
suggestions: {
suggestedIcons: IconData[];
suggestedFonts: FontData[];
suggestedPalettes: PaletteData[];
};
}

const Step3_Design = ({ config, updateConfig, suggestions }: Props) => {
const { suggestedIcons, suggestedFonts, suggestedPalettes } = suggestions;
const fontCategories = Array.from(new Set(suggestedFonts.map(f => f.category)));

    return (
        <motion.div key="step3" className="space-y-12 animate-fade-in">
            <Section title="Wählen Sie ein Symbol" helpText="Regel 2: Einprägsamkeit - Einfache Symbole bleiben besser im Gedächtnis">
                {suggestedIcons.map(icon => (
                    <SelectionCard key={icon.id} isSelected={config.icon?.id === icon.id} onClick={() => updateConfig({ icon })}>
                        <icon.component className="w-12 h-12 mx-auto" color={config.palette ? config.palette.colors[1] : 'white'} />
                    </SelectionCard>
                ))}
            </Section>

            {fontCategories.map(category => (
                <Section key={category} title={`Schriftart: ${category}`}>
                    {suggestedFonts.filter(f => f.category === category).map(font => (
                        <SelectionCard key={font.name} isSelected={config.font?.name === font.name} onClick={() => updateConfig({ font })}>
                            <p style={{ fontFamily: font.name,
                                 // A little trick to pre-load the font by creating an invisible element
                                 position: 'absolute', opacity: 0, pointerEvents: 'none'
                                }}
                            >
                                {font.name}
                            </p>
                            <p style={{ fontFamily: font.name }} className="text-2xl text-center">{font.name}</p>
                        </SelectionCard>
                    ))}
                </Section>
            ))}
            <div className="text-xs text-white/60 -mt-8">Regel 3: Zeitlosigkeit - Klassische Schriften überdauern Trends</div>


            <Section title="Wählen Sie ein Layout" helpText="Regel 4: Skalierbarkeit - Standard-Layouts funktionieren in jeder Größe">
                {layouts.map(layout => (
                    <LayoutSelectionCard key={layout.id} layout={layout} isSelected={config.layout?.id === layout.id} onClick={() => updateConfig({ layout })} />
                ))}
            </Section>

            <Section title="Wählen Sie eine Farbpalette" helpText="Regel 9: Intelligente Farbwahl - Farben transportieren Emotionen und Markenwerte">
                {suggestedPalettes.map(palette => (
                    <SelectionCard key={palette.id} isSelected={config.palette?.id === palette.id} onClick={() => updateConfig({ palette })}>
                        <div className="flex gap-2 w-full h-full">
                            {palette.colors.map(c => <div key={c} style={{backgroundColor: c}} className="w-1/3 h-full rounded"></div>)}
                        </div>
                    </SelectionCard>
                ))}
            </Section>
        </motion.div>
    );

};
export default Step3_Design;

components/preview/LogoCanvas.tsx

import { LogoConfig } from '@/lib/types';
import Head from 'next/head';

const LogoCanvas = ({ config, idSuffix = '' }: { config: LogoConfig, idSuffix?: string }) => {
const { icon, font, layout, palette, text, slogan } = config;
if (!icon || !font || !layout || !palette) return null;

const IconComponent = icon.component;
const [bgColor, primaryColor, textColor] = palette.colors;

const fontUrl = `https://fonts.googleapis.com/css2?family=${font.url.replace(/ /g, '+')}:wght@${font.weights.join(';')}&display=swap`;

const renderContent = () => {
const textLength = text.length || 10;
const baseFontSize = 28;
const fontSize = Math.max(14, baseFontSize - textLength _ 0.5);
const sloganFontSize = fontSize _ 0.5;

    if (layout.arrangement === 'icon-top') {
      return (
        <g>
          <IconComponent x={75} y={30} width={50} height={50} color={primaryColor} />
          <text x="100" y={110} fontSize={fontSize} fontWeight="bold" textAnchor="middle" fill={textColor}>{text || "Markenname"}</text>
          {slogan && <text x="100" y={110 + sloganFontSize + 5} fontSize={sloganFontSize} textAnchor="middle" fill={primaryColor}>{slogan}</text>}
        </g>
      );
    }
    if (layout.arrangement === 'icon-left') {
      const iconSize = 40;
      return(
        <g transform="translate(20, 0)">
          <IconComponent x={0} y={55} width={iconSize} height={iconSize} color={primaryColor} />
          <text x={iconSize + 15} y={75} fontSize={fontSize * 0.8} fontWeight="bold" textAnchor="start" fill={textColor}>{text || "Markenname"}</text>
          {slogan && <text x={iconSize + 15} y={75 + sloganFontSize} fontSize={sloganFontSize * 0.9} textAnchor="start" fill={primaryColor}>{slogan}</text>}
        </g>
      );
    }
    return null;

};

const renderShape = () => {
if (layout.type !== 'enclosed') return null;
if (layout.shape === 'circle') return <circle cx="100" cy="100" r="95" fill="none" stroke={primaryColor} strokeWidth="4" />
if (layout.shape === 'shield') return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" transform="scale(8.4) translate(-1.5, -1.5)" fill="none" stroke={primaryColor} strokeWidth="0.5" />
return null;
};

const svgId = `logo-svg-${palette.id}${idSuffix}`;

return (
<>
<Head><link rel="stylesheet" href={fontUrl} /></Head>
<svg id={svgId} width="100%" height="auto" viewBox="0 0 200 200" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
<style>{`#${svgId} text { font-family: '${font.name}', ${font.family}; }`}</style>
{layout.type === 'enclosed' && <rect x="0" y="0" width="200" height="200" fill={bgColor} rx={layout.shape === 'circle' ? 100 : 20}/>}
{renderShape()}
{renderContent()}
</svg>
</>
);
};
export default LogoCanvas;

components/preview/LogoPreview.tsx

import { useMemo } from 'react';
import { LogoConfig, PaletteData } from '@/lib/types';
import { evaluateLogoDesign, suggestImprovements } from '@/lib/designRules';
import { Download } from 'lucide-react';
import LogoCanvas from './LogoCanvas';

const LogoPreview = ({ config }: { config: LogoConfig }) => {
const handleDownload = () => {
const svgElement = document.getElementById(`logo-svg-${config.palette?.id}`);
if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.text.replace(/ /g, '_')}_logo.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

};

const monochromePalette: PaletteData = { id: 'mono', name: 'mono', colors: ['#000000', '#FFFFFF', '#FFFFFF'], tags: [] };
const monochromeConfig = { ...config, palette: monochromePalette };

const evaluation = useMemo(() => evaluateLogoDesign(config), [config]);
const suggestions = useMemo(() => suggestImprovements(config), [config]);

return (
<div className="space-y-6">
<div className="bg-white/5 rounded-lg p-4">
<div className="flex items-center justify-between mb-2">
<h3 className="font-bold text-primary">Design-Qualität</h3>
<span className={`text-2xl font-bold ${evaluation.overallScore >= 80 ? 'text-green-400' : evaluation.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
{evaluation.overallScore}/100
</span>
</div>
<div className="w-full h-2 bg-white/10 rounded-full mb-3">
<div
className={`h-2 rounded-full transition-all duration-500 ${evaluation.overallScore >= 80 ? 'bg-green-400' : evaluation.overallScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
style={{ width: `${evaluation.overallScore}%` }}
/>
</div>
{suggestions.length > 0 && (
<div className="mt-4 pt-4 border-t border-white/10">
<h4 className="text-sm font-semibold text-primary mb-2">Verbesserungsvorschläge:</h4>
<ul className="text-xs text-white/70 space-y-1">
{suggestions.slice(0, 3).map((suggestion, index) => (
<li key={index} className="flex items-start gap-2">
<span className="text-primary mt-0.5">•</span>
{suggestion}
</li>
))}
</ul>
</div>
)}
</div>

      <div>
        <h3 className="font-bold mb-2 text-primary">Farbversion</h3>
        <div className="bg-white/10 rounded-lg p-4"><LogoCanvas config={config} /></div>
      </div>
      <div>
        <h3 className="font-bold mb-2 text-primary">Monochrome Version</h3>
        <div className="bg-black border border-white/20 rounded-lg p-4"><LogoCanvas config={monochromeConfig} idSuffix="-mono" /></div>
      </div>
      <button onClick={handleDownload} disabled={!config.text} className="w-full mt-4 bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
        <Download size={18} />SVG Herunterladen
      </button>
    </div>

);
};
export default LogoPreview;

components/preview/MockupPreview.tsx

import { LogoConfig } from '@/lib/types';
import LogoCanvas from './LogoCanvas';

const MockupPreview = ({ config }: { config: LogoConfig }) => {
if(!config.palette) return null;

return (
<div className="space-y-6">
<div className="bg-white rounded-lg p-6 shadow-lg aspect-[10/6] w-full flex items-center">
<div className="w-1/3"><div style={{ transform: 'scale(0.5)' }}><LogoCanvas config={config} idSuffix="-bc" /></div></div>
<div className="w-2/3 border-l-2 border-gray-200 pl-4">
<p className="text-black font-bold text-xl">{config.text || "Dein Name"}</p><p className="text-gray-500 text-sm">Deine Position</p>
<div className="mt-4 space-y-1 text-xs text-gray-700"><p>+49 123 456 7890</p><p>hallo@deinemarke.de</p></div>
</div>
</div>
<div className="bg-gray-800 rounded-lg p-4 shadow-lg w-full flex items-center justify-between">
<div className="w-1/4"><div style={{ transform: 'scale(0.3)', transformOrigin: 'left center' }}><LogoCanvas config={config} idSuffix="-web" /></div></div>
<div className="flex items-center gap-4 text-sm text-gray-300"><p>Produkte</p><p>Über Uns</p><p>Kontakt</p></div>
</div>
<div className="bg-gray-900 p-6 rounded-lg w-full">
<p className="text-center font-bold text-white mb-4">App Icon</p>
<div className="flex justify-center items-center gap-6">
<div className="w-20 h-20 bg-black rounded-3xl overflow-hidden"><LogoCanvas config={config} idSuffix="-app-dark" /></div>
<div className="w-20 h-20 bg-white rounded-3xl overflow-hidden"><LogoCanvas config={{...config, palette: {...config.palette, colors: [config.palette.colors[0], config.palette.colors[2], config.palette.colors[2]]}}} idSuffix="-app-light" /></div>
</div>
</div>
</div>
);
};
export default MockupPreview;

Step 4: Orchestrate Everything in the New page.tsx
Goal: Create the new, lean app/page.tsx that acts as the central controller for the application.

Action: Replace the entire content of app/page.tsx with this new, cleaner version. It imports the new components and uses the suggestionEngine.

File to Modify: app/page.tsx

// --- app/page.tsx ---
'use client';

import React, { useState, useMemo, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoReducer, initialState } from '@/lib/state';
import { getSuggestions } from '@/lib/suggestionEngine';
import { LogoConfig } from '@/lib/types';
import { Undo2, Redo2 } from 'lucide-react';

// Import newly created components
import { Header } from '@/components/Header';
import Step1_Industry from '@/components/editor/Step1_Industry';
import Step2_Branding from '@/components/editor/Step2_Branding';
import Step3_Design from '@/components/editor/Step3_Design';
import LogoPreview from '@/components/preview/LogoPreview';
import MockupPreview from '@/components/preview/MockupPreview';

// === MAIN PAGE COMPONENT ===
export default function LogoGeneratorPage() {
const [step, setStep] = useState(1);
const [industry, setIndustry] = useState<string | null>(null);
const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);
const [previewTab, setPreviewTab] = useState<'preview' | 'mockups'>('preview');

const [state, dispatch] = useReducer(logoReducer, initialState);
const { present: config, past, future } = state;

const updateConfig = (newConfig: Partial<LogoConfig>) => {
dispatch({ type: 'SET_CONFIG', payload: newConfig });
};

const handleUndo = () => dispatch({ type: 'UNDO' });
const handleRedo = () => dispatch({ type: 'REDO' });

const handlePersonalityToggle = (id: string) => {
const newSelection = selectedPersonalities.includes(id)
? selectedPersonalities.filter(p => p !== id)
: [...selectedPersonalities, id].slice(0, 2);
setSelectedPersonalities(newSelection);
};

const suggestions = useMemo(
() => getSuggestions(industry, selectedPersonalities, config),
[industry, selectedPersonalities, config]
);

const renderStep = () => {
switch (step) {
case 1:
return (
<Step1_Industry
industry={industry}
setIndustry={setIndustry}
onNext={() => setStep(2)}
/>
);
case 2:
return (
<Step2_Branding
config={config}
updateConfig={updateConfig}
selectedPersonalities={selectedPersonalities}
onTogglePersonality={handlePersonalityToggle}
onNext={() => setStep(3)}
/>
);
case 3:
return (
<motion.div key="step3" className="space-y-12 animate-fade-in">
<div className="flex items-center gap-2">
<button onClick={handleUndo} disabled={past.length === 0} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"><Undo2 size={16}/> Rückgängig</button>
<button onClick={handleRedo} disabled={future.length === 0} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"><Redo2 size={16}/> Wiederholen</button>
</div>
<Step3_Design
config={config}
updateConfig={updateConfig}
suggestions={suggestions}
/>
</motion.div>
);
default: return <div>Ungültiger Schritt</div>;
}
};

const progress = (step / 3) \* 100;
const isLogoConfigComplete = !!(config.icon && config.font && config.layout && config.palette && config.text);

return (
<>
<Header />
<main className="min-h-screen w-full grid md:grid-cols-2 pt-20">
<div className="p-8 md:p-12 overflow-y-auto max-h-[calc(100vh-5rem)]">
<AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
</div>
<div className="bg-black/50 p-8 md:p-12 h-screen sticky top-0 flex flex-col">
<div className="w-full h-2 bg-white/10 rounded-full mb-4">
<motion.div className="h-2 bg-primary rounded-full" animate={{ width: `${progress}%` }} />
</div>

          <div className="flex border-b border-white/20 mb-6">
              <button onClick={() => setPreviewTab('preview')} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'}`}>Vorschau</button>
              <button onClick={() => setPreviewTab('mockups')} disabled={!isLogoConfigComplete} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'mockups' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'} disabled:text-white/20 disabled:cursor-not-allowed`}>Mockups</button>
          </div>

          <div className="flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
              {previewTab === 'preview' && (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isLogoConfigComplete ? <LogoPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Treffen Sie eine Auswahl, um die Vorschau zu sehen.</p></div>}
                </motion.div>
              )}
              {previewTab === 'mockups' && (
                <motion.div key="mockups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isLogoConfigComplete ? <MockupPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Vervollständigen Sie Ihr Logo, um die Mockups zu sehen.</p></div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>

);
}
