import { User } from 'lucide-react';
import { LogoConfig } from '@/lib/types';
import { fontCategories } from '@/lib/data';

interface TextSettingsPanelProps {
  localConfig: LogoConfig;
  updateLocalConfig: (updates: Partial<LogoConfig>) => void;
  onConfigUpdate: (updates: Partial<LogoConfig>) => void;
  brandNameColor: string;
  setBrandNameColor: (color: string) => void;
  sloganColor: string;
  setSloganColor: (color: string) => void;
  setLocalConfig: React.Dispatch<React.SetStateAction<LogoConfig>>;
  fontWeight: number;
  setFontWeight: (weight: number) => void;
}

export const TextSettingsPanel = ({
  localConfig,
  updateLocalConfig,
  onConfigUpdate,
  brandNameColor,
  setBrandNameColor,
  sloganColor,
  setSloganColor,
  setLocalConfig,
  fontWeight,
  setFontWeight
}: TextSettingsPanelProps) => {
  const getAvailableWeights = () => {
    let availableWeights = [400];

    if (localConfig.font?.editorWeights && localConfig.font.editorWeights.length > 0) {
      availableWeights = localConfig.font.editorWeights;
    } else {
      const currentFont = fontCategories
        .flatMap(cat => cat.fonts)
        .find(font => font.name === localConfig.font?.name);

      if (currentFont?.weights && currentFont.weights.length > 0) {
        availableWeights = currentFont.weights;
      }
    }

    return availableWeights;
  };

  const getWeightName = (weight: number) => {
    const weightNames: { [key: number]: string } = {
      100: 'Thin',
      200: 'ExtraLight',
      300: 'Light',
      400: 'Regular',
      500: 'Medium',
      600: 'SemiBold',
      700: 'Bold',
      800: 'ExtraBold',
      900: 'Black'
    };
    return weightNames[weight] || weight.toString();
  };

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
      <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <User size={20} className="text-purple-400" />
        Text
      </h4>
      <div className="space-y-3">
        <div>
          <label className="block text-white/80 text-sm mb-1">Brand Name</label>
          <input
            type="text"
            value={localConfig.text}
            onChange={(e) => updateLocalConfig({ text: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
            placeholder="Enter brand name"
          />
          <div className="mt-2">
            <label className="block text-white/60 text-xs mb-1">Brand Name Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandNameColor}
                onChange={(e) => setBrandNameColor(e.target.value)}
                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/50 text-xs">{brandNameColor}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-white/80 text-sm mb-1">Slogan</label>
          <input
            type="text"
            value={localConfig.slogan}
            onChange={(e) => updateLocalConfig({ slogan: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
            placeholder="Enter slogan"
          />
          <div className="mt-2">
            <label className="block text-white/60 text-xs mb-1">Slogan Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={sloganColor}
                onChange={(e) => setSloganColor(e.target.value)}
                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/50 text-xs">{sloganColor}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-white/80 text-sm mb-1">Font Family</label>
          <select
            value={localConfig.font?.name || 'Inter'}
            onChange={(e) => {
              const selectedFont = fontCategories
                .flatMap(cat => cat.fonts)
                .find(font => font.name === e.target.value);
              if (selectedFont) {
                const newFont = { ...selectedFont };
                setLocalConfig(prev => ({
                  ...prev,
                  font: newFont
                }));
                onConfigUpdate({ font: newFont });
              }
            }}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm mb-3"
          >
            {fontCategories.map(category => (
              <optgroup key={category.name} label={category.name}>
                {category.fonts.map(font => (
                  <option key={font.name} value={font.name}>
                    {font.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <label className="block text-white/80 text-sm mb-1">Font Weight</label>
          <div className="space-y-2">
            {getAvailableWeights().map(weight => (
              <button
                key={weight}
                onClick={() => {
                  setFontWeight(weight);
                  const updatedFont = { ...localConfig.font!, fontWeight: weight };
                  setLocalConfig(prev => ({ ...prev, font: updatedFont }));
                  onConfigUpdate({ font: updatedFont });
                }}
                className={`w-full px-3 py-2 rounded text-sm text-left transition-colors ${
                  fontWeight === weight
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
                style={{ fontWeight: weight }}
              >
                {getWeightName(weight)} ({weight})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};