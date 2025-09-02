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