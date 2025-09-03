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
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform ${selectedPersonalities.includes(p.id) ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-400 text-white shadow-lg shadow-purple-500/25 scale-105' : 'bg-white/10 hover:bg-white/20 hover:scale-105'}`} >
          {p.name}
        </button>
      )}</div>
      <div className="text-xs text-white/50 mt-2">
        Regel 6: Relevanz - Diese Eigenschaften helfen bei der passenden Symbolauswahl
      </div>
    </div>
    <button onClick={onNext} disabled={!config.text} className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-400 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
      Weiter zur Gestaltung
    </button>
  </motion.div>
);
export default Step2_Branding;