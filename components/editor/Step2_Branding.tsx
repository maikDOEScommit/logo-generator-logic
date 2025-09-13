import { motion } from 'framer-motion';
import { useState } from 'react';
import { personalities } from '@/lib/data';
import { LogoConfig } from '@/lib/types';
import { useLogoStore } from '@/lib/state';
import AnimatedWaves from '@/components/ui/AnimatedWaves';

interface Props {
  config: LogoConfig;
  updateConfig: (newConfig: Partial<LogoConfig>) => void;
  selectedPersonalities: string[];
  onTogglePersonality: (id: string) => void;
  onNext: () => void;
}

const Step2_Branding = ({ config, updateConfig, selectedPersonalities, onTogglePersonality, onNext }: Props) => {
  const [showRestOfForm, setShowRestOfForm] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    updateConfig({ text: newText });
    
    // Show rest of form when user starts typing
    if (newText.length > 0 && !showRestOfForm) {
      setShowRestOfForm(true);
    }
  };

  return (
    <motion.div key="step2" className="animate-fade-in mt-4">
      {/* Brand Name Input */}
      <div className="text-left">
        <label htmlFor="text" className="block text-xl font-bold mb-2 text-white">What&apos;s your brand called?</label>
        <input
          type="text"
          id="text"
          value={config.text || ''}
          onChange={handleTextChange}
          className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-transparent focus:border-transparent relative text-white placeholder:text-white"
          style={{
            background: 'rgba(255, 255, 255, 0.05)'
          }}
          onFocus={(e) => {
            e.target.style.borderImage = 'linear-gradient(to right, #15803d, #a7f3d0, #ffffff) 1';
            e.target.style.borderImageSlice = '1';
          }}
          onBlur={(e) => {
            e.target.style.borderImage = 'none';
            e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
          }}
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

      {/* Rest of form - appears with slide animation when user starts typing */}
      {showRestOfForm && (
        <>
          {/* Animated Waves Divider */}
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 4.2, ease: "easeOut", type: "spring", stiffness: 50 }}
            className="flex items-center justify-center py-8 mt-4"
          >
            <motion.div 
              initial={{ 
                opacity: 0, 
                scale: 0.95,
                clipPath: "inset(0 100% 0 0)"
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                clipPath: "inset(0 0% 0 0)"
              }}
              transition={{ 
                duration: 1.0, 
                delay: 0.6,
                clipPath: { duration: 1.5, ease: "easeOut" }
              }}
              className="w-screen -mx-4 md:-mx-8 lg:-mx-12 xl:-mx-24 2xl:-mx-32"
            >
              <AnimatedWaves />
            </motion.div>
          </motion.div>

          {/* Slogan Input */}
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2.1, ease: "easeOut", type: "spring", stiffness: 50, delay: 0.8 }}
            className="text-center mt-8"
          >
            <label htmlFor="slogan" className="block text-xl font-bold mb-2 text-white">Need a slogan?</label>
            <input
              type="text"
              id="slogan"
              value={config.slogan || ''}
              onChange={(e) => updateConfig({ slogan: e.target.value })}
              className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-transparent focus:border-transparent relative text-white placeholder:text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderImage = 'linear-gradient(to right, #15803d, #a7f3d0, #ffffff) 1';
                e.target.style.borderImageSlice = '1';
              }}
              onBlur={(e) => {
                e.target.style.borderImage = 'none';
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              }}
              placeholder="e.g. Innovation at its finest"
              maxLength={50}
            />
            <div className="text-xs text-white/50 mt-1 flex justify-between">
              <span>Displayed centered under your brand name</span>
              <span className="text-white/50">
                {(config.slogan || '').length}/50
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2.1, ease: "easeOut", type: "spring", stiffness: 50, delay: 1.0 }}
            className="mt-16 mb-8"
          >
            <button onClick={onNext} disabled={!config.text} className="w-full bg-black !text-white font-bold py-2.5 px-6 rounded-xl shadow-xl shadow-black/30 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-black/40 hover:rotate-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group border border-white/20">
              <span className="relative z-10">Continue to Design</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%] group-hover:transition-transform group-hover:duration-700"></div>
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};
export default Step2_Branding;