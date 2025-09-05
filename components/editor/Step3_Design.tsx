import { motion } from 'framer-motion';
import { LogoConfig, IconData, FontData, LayoutData, PaletteData } from '@/lib/types';
import Section from '@/components/ui/Section';
import SelectionCard from '@/components/ui/SelectionCard';
import { layouts, fontCategories, personalities } from '@/lib/data';
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
  selectedFontCategory: string | null;
  setSelectedFontCategory: (category: string | null) => void;
  selectedPersonalities: string[];
  onTogglePersonality: (id: string) => void;
  onLogoCreate?: () => void;
}

const Step3_Design = ({ config, updateConfig, suggestions, selectedFontCategory, setSelectedFontCategory, selectedPersonalities, onTogglePersonality, onLogoCreate }: Props) => {
  const { suggestedIcons, suggestedPalettes } = suggestions;

  return (
    <motion.div key="step3" className="space-y-12 animate-fade-in">
      <Section title="Choose a Symbol" helpText="Rule 2: Memorability - Simple symbols are remembered better">
        {suggestedIcons.map(icon => (
          <SelectionCard key={icon.id} isSelected={config.icon?.id === icon.id} onClick={() => updateConfig({ icon })}>
            <icon.component className="w-12 h-12 mx-auto" color={config.palette ? config.palette.colors[1] : 'white'} />
          </SelectionCard>
        ))}
      </Section>

      <Section title="Choose your Typography Style" helpText="Rule 3: Timelessness - Classic fonts outlast trends">
        {fontCategories.map((category) => (
          <SelectionCard 
            key={category.name} 
            isSelected={selectedFontCategory === category.name} 
            onClick={() => setSelectedFontCategory(category.name)}
          >
            <div className="text-center p-4 h-full flex flex-col justify-center">
              <p className="text-base font-semibold mb-3 text-white">{category.name}</p>
              <div className="text-xs text-white/60 space-y-1 overflow-hidden">
                {category.fonts.map(font => (
                  <div key={font.name} className="truncate" style={{ fontFamily: font.cssName }}>
                    {font.name}
                  </div>
                ))}
              </div>
            </div>
          </SelectionCard>
        ))}
      </Section>

      <Section title="Choose a Layout" helpText="Rule 4: Scalability - Standard layouts work at any size">
        {layouts.map(layout => (
          <LayoutSelectionCard key={layout.id} layout={layout} isSelected={config.layout?.id === layout.id} onClick={() => updateConfig({ layout })} />
        ))}
      </Section>

      <Section title="Choose a Color Palette" helpText="Rule 9: Smart Color Choice - Colors convey emotions and brand values">
        {/* Brand Personality Selection */}
        <div className="col-span-full mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <label className="block text-lg font-bold mb-3 text-primary">Brand Personality (max. 2)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {personalities.map(p => (
              <button
                key={p.id}
                onClick={() => onTogglePersonality(p.id)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all transform ${selectedPersonalities.includes(p.id) ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105' : 'bg-white/10 hover:bg-white/20 hover:scale-105'}`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="text-xs text-white/50">
            Rule 6: Relevance - These traits influence color palette suggestions
          </div>
        </div>
        
        {/* Regular Color Palettes (non-intense) */}
        {suggestedPalettes.filter(palette => !palette.tags?.includes('intense')).map(palette => (
          <SelectionCard key={palette.id} isSelected={config.palette?.id === palette.id} onClick={() => updateConfig({ palette })}>
            <div className="flex flex-col items-center gap-2 h-full">
              <div className="flex gap-1 w-full h-12">
                {palette.colors.map(c => <div key={c} style={{backgroundColor: c}} className="flex-1 h-full rounded"></div>)}
              </div>
              <span className="text-xs text-center text-white/80 px-2">{palette.name}</span>
            </div>
          </SelectionCard>
        ))}
        
        {/* Solid Color Bar - 14 intensive colors in horizontal layout */}
        <div className="col-span-full mt-6">
          <h3 className="text-lg font-bold mb-3 text-primary">Oder wähle eine Grundfarbe:</h3>
          <div className="grid grid-cols-7 gap-2">
            {suggestedPalettes.filter(palette => palette.tags?.includes('intense')).map(palette => (
              <button
                key={palette.id}
                onClick={() => updateConfig({ palette })}
                className={`h-12 rounded-lg border-2 transition-all transform hover:scale-105 ${
                  config.palette?.id === palette.id 
                    ? 'border-white shadow-lg shadow-white/25 scale-105' 
                    : 'border-white/20 hover:border-white/40'
                }`}
                style={{backgroundColor: palette.colors[0]}}
                title={palette.name}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Create Button */}
      <div className="flex justify-center pt-8">
        <button
          onClick={() => {
            // This will trigger the preview to show properly
            updateConfig({});
            // Trigger text animation if callback provided
            if (onLogoCreate) onLogoCreate();
          }}
          disabled={!config.icon || !config.layout || !config.palette}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Create Logo
        </button>
      </div>
    </motion.div>
  );
};
export default Step3_Design;