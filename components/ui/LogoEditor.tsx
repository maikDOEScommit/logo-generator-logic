import { useState } from 'react';
import { LogoConfig, IconData, PaletteData } from '@/lib/types';
import { Edit3, Type, Palette, Star } from 'lucide-react';

interface LogoEditorProps {
  config: LogoConfig;
  onConfigUpdate: (newConfig: Partial<LogoConfig>) => void;
  availableIcons: IconData[];
  availablePalettes: PaletteData[];
}

const LogoEditor = ({ config, onConfigUpdate, availableIcons, availablePalettes }: LogoEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'icon' | 'colors'>('text');

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        title="Edit Logo"
      >
        <Edit3 size={16} />
      </button>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg p-4 z-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">Edit Logo</h3>
        <button
          onClick={() => setIsEditing(false)}
          className="text-white/60 hover:text-white text-xl"
        >
          ×
        </button>
      </div>

      {/* Editor Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
            activeTab === 'text' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70'
          }`}
        >
          <Type size={14} /> Text
        </button>
        <button
          onClick={() => setActiveTab('icon')}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
            activeTab === 'icon' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70'
          }`}
        >
          <Star size={14} /> Icon
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
            activeTab === 'colors' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70'
          }`}
        >
          <Palette size={14} /> Colors
        </button>
      </div>

      {/* Editor Content */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div>
              <label className="block text-white/80 text-sm mb-1">Brand Name</label>
              <input
                type="text"
                value={config.text}
                onChange={(e) => onConfigUpdate({ text: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                placeholder="Enter brand name"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Slogan (optional)</label>
              <input
                type="text"
                value={config.slogan}
                onChange={(e) => onConfigUpdate({ slogan: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                placeholder="Enter slogan"
              />
            </div>
          </div>
        )}

        {activeTab === 'icon' && (
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onConfigUpdate({ icon: null })}
              className={`p-2 rounded border transition-colors ${
                !config.icon ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <span className="text-white/60 text-xs">None</span>
            </button>
            {availableIcons.slice(0, 15).map(icon => (
              <button
                key={icon.id}
                onClick={() => onConfigUpdate({ icon })}
                className={`p-2 rounded border transition-colors ${
                  config.icon?.id === icon.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                }`}
              >
                <icon.component size={16} color="white" className="mx-auto" />
              </button>
            ))}
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="grid grid-cols-3 gap-2">
            {availablePalettes.slice(0, 12).map(palette => (
              <button
                key={palette.id}
                onClick={() => onConfigUpdate({ palette })}
                className={`p-2 rounded border transition-colors ${
                  config.palette?.id === palette.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className="flex gap-1 h-4 mb-1">
                  {palette.colors.map((color, i) => (
                    <div key={i} className="flex-1 rounded" style={{ backgroundColor: color }}></div>
                  ))}
                </div>
                <span className="text-white/80 text-xs truncate block">{palette.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoEditor;