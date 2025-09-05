import { motion } from 'framer-motion';
import { personalities } from '@/lib/data';
import { LogoConfig } from '@/lib/types';
import { useLogoStore } from '@/lib/state';

interface Props {
  config: LogoConfig;
  updateConfig: (newConfig: Partial<LogoConfig>) => void;
  selectedPersonalities: string[];
  onTogglePersonality: (id: string) => void;
  onNext: () => void;
}

const Step2_Branding = ({ config, updateConfig, selectedPersonalities, onTogglePersonality, onNext }: Props) => {
  return (
    <motion.div key="step2" className="space-y-8 animate-fade-in">
      {/* Brand Name Input */}
      <div>
        <label htmlFor="text" className="block text-xl font-bold mb-2 text-white">What's your brand called?</label>
        <input
          type="text"
          id="text"
          value={config.text || ''}
          onChange={(e) => updateConfig({ text: e.target.value })}
          className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="e.g. Quantum Leap"
          maxLength={24}
        />
        <div className="text-xs text-white/50 mt-1 flex justify-between">
          <span>Rule 1: Simplicity - Short names are more memorable</span>
          <span className="text-white/50">
            {(config.text || '').length}/24
          </span>
        </div>
      </div>

      {/* Slogan Input */}
      <div>
        <label htmlFor="slogan" className="block text-xl font-bold mb-2 text-white">Need a slogan?</label>
        <input
          type="text"
          id="slogan"
          value={config.slogan || ''}
          onChange={(e) => updateConfig({ slogan: e.target.value })}
          className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="e.g. Innovation at its finest"
          maxLength={50}
        />
        <div className="text-xs text-white/50 mt-1 flex justify-between">
          <span>Displayed centered under your brand name</span>
          <span className="text-white/50">
            {(config.slogan || '').length}/50
          </span>
        </div>
      </div>

      <button onClick={onNext} disabled={!config.text} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
        Continue to Design
      </button>
    </motion.div>
  );
};
export default Step2_Branding;