import { useState } from 'react';
import { LogoConfig, IconData, PaletteData } from '@/lib/types';
import { Edit3, Type, Palette, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoEditorProps {
  config: LogoConfig;
  onConfigUpdate: (newConfig: Partial<LogoConfig>) => void;
  availableIcons: IconData[];
  availablePalettes: PaletteData[];
}

const LogoEditor = ({ config, onConfigUpdate, availableIcons, availablePalettes }: LogoEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'icon' | 'colors'>('text');

  return (
    <>
      {/* Edit Button - always visible on hover */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-20"
        title="Edit Logo"
      >
        <Edit3 size={16} />
      </button>

      {/* Editor Panel - slides up from bottom */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              opacity: { duration: 0.2 }
            }}
            className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/20 rounded-t-lg p-4 z-10 shadow-xl"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-bold text-sm">Edit Logo</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-white/60 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Editor Tabs */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${
                  activeTab === 'text' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70'
                }`}
              >
                <Type size={12} /> Text
              </button>
              <button
                onClick={() => setActiveTab('icon')}
                className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${
                  activeTab === 'icon' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70'
                }`}
              >
                <Star size={12} /> Icon
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${
                  activeTab === 'colors' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70'
                }`}
              >
                <Palette size={12} /> Colors
              </button>
            </div>

            {/* Editor Content */}
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 max-h-40 overflow-y-auto"
            >
              {activeTab === 'text' && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-white/80 text-xs mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={config.text}
                      onChange={(e) => onConfigUpdate({ text: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-xs"
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-xs mb-1">Slogan (optional)</label>
                    <input
                      type="text"
                      value={config.slogan}
                      onChange={(e) => onConfigUpdate({ slogan: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-xs"
                      placeholder="Enter slogan"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'icon' && (
                <div className="grid grid-cols-6 gap-1.5">
                  <button
                    onClick={() => onConfigUpdate({ icon: null })}
                    className={`p-1.5 rounded border transition-colors ${
                      !config.icon ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <span className="text-white/60 text-xs">None</span>
                  </button>
                  {availableIcons.slice(0, 17).map(icon => (
                    <button
                      key={icon.id}
                      onClick={() => onConfigUpdate({ icon })}
                      className={`p-1.5 rounded border transition-colors ${
                        config.icon?.id === icon.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <icon.component size={14} color="white" className="mx-auto" />
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="grid grid-cols-4 gap-1.5">
                  {availablePalettes.slice(0, 12).map(palette => (
                    <button
                      key={palette.id}
                      onClick={() => onConfigUpdate({ palette })}
                      className={`p-1.5 rounded border transition-colors ${
                        config.palette?.id === palette.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="flex gap-0.5 h-3 mb-1">
                        {palette.colors.map((color, i) => (
                          <div key={i} className="flex-1 rounded-sm" style={{ backgroundColor: color }}></div>
                        ))}
                      </div>
                      <span className="text-white/80 text-xs truncate block leading-tight">{palette.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LogoEditor;