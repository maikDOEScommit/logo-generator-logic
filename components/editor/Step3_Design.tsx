import { motion } from 'framer-motion';
import { LogoConfig, IconData, FontData, LayoutData, PaletteData } from '@/lib/types';
import Section from '@/components/ui/Section';
import SelectionCard from '@/components/ui/SelectionCard';
import { layouts, fontCategories } from '@/lib/data';
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
}

const Step3_Design = ({ config, updateConfig, suggestions, selectedFontCategory, setSelectedFontCategory }: Props) => {
  const { suggestedIcons, suggestedPalettes } = suggestions;

  return (
    <motion.div key="step3" className="space-y-12 animate-fade-in">
      <Section title="Wählen Sie ein Symbol" helpText="Regel 2: Einprägsamkeit - Einfache Symbole bleiben besser im Gedächtnis">
        {suggestedIcons.map(icon => (
          <SelectionCard key={icon.id} isSelected={config.icon?.id === icon.id} onClick={() => updateConfig({ icon })}>
            <icon.component className="w-12 h-12 mx-auto" color={config.palette ? config.palette.colors[1] : 'white'} />
          </SelectionCard>
        ))}
      </Section>

      <Section title="Wählen Sie einen Typografie-Stil" helpText="Regel 3: Zeitlosigkeit - Klassische Schriften überdauern Trends">
        {Object.entries(fontCategories).map(([categoryKey, fonts]) => (
          <SelectionCard 
            key={categoryKey} 
            isSelected={selectedFontCategory === categoryKey} 
            onClick={() => setSelectedFontCategory(categoryKey)}
          >
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">{fonts[0].category}</p>
              <div className="text-sm text-white/70 space-y-1">
                {fonts.map(font => (
                  <div key={font.name} style={{ fontFamily: font.name }}>
                    {font.name}
                  </div>
                ))}
              </div>
            </div>
          </SelectionCard>
        ))}
      </Section>

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

      {/* Create Button */}
      <div className="flex justify-center pt-8">
        <button
          onClick={() => {
            // This will trigger the preview to show properly
            updateConfig({});
          }}
          disabled={!config.icon || !selectedFontCategory || !config.layout || !config.palette || !config.text}
          className="bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-400 text-white px-12 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Create Logo
        </button>
      </div>
    </motion.div>
  );
};
export default Step3_Design;