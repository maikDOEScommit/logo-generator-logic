import { Star, Pipette } from 'lucide-react';

interface IconPalettePanelProps {
  localConfig: any;
  updateLocalConfig: (updates: any) => void;
  availableIcons: any[];
  availablePalettes: any[];
  iconColor: string;
  setIconColor: (color: string) => void;
  setLocalConfig: React.Dispatch<React.SetStateAction<any>>;
  setForceRender: React.Dispatch<React.SetStateAction<number>>;
  setBrandNameColor: (color: string) => void;
  setSloganColor: (color: string) => void;
  drawingTool: string;
  sampledColor: string | null;
  setBrushColor: (color: string) => void;
  hslColor: { h: number; s: number; l: number };
  setHslColor: (color: { h: number; s: number; l: number }) => void;
  hslToHex: (h: number, s: number, l: number) => string;
  hexToHsl: (hex: string) => { h: number; s: number; l: number };
}

export const IconPalettePanel = ({
  localConfig,
  updateLocalConfig,
  availableIcons,
  availablePalettes,
  iconColor,
  setIconColor,
  setLocalConfig,
  setForceRender,
  setBrandNameColor,
  setSloganColor,
  drawingTool,
  sampledColor,
  setBrushColor,
  hslColor,
  setHslColor,
  hslToHex,
  hexToHsl
}: IconPalettePanelProps) => {
  return (
    <>
      {/* Icon Section */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
        <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Star size={20} className="text-yellow-400" />
          Icon
        </h4>
        <div className="grid grid-cols-6 gap-2 mb-3">
          <button
            onClick={() => updateLocalConfig({ icon: null })}
            className={`p-2 rounded border transition-colors ${
              !localConfig.icon ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
            }`}
          >
            <span className="text-white/60 text-xs">None</span>
          </button>
          {availableIcons.slice(0, 17).map(icon => (
            <button
              key={icon.id}
              onClick={() => updateLocalConfig({ icon })}
              className={`p-2 rounded border transition-colors ${
                localConfig.icon?.id === icon.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <icon.component size={20} color="white" className="mx-auto" />
            </button>
          ))}
        </div>
        <div>
          <label className="block text-white/60 text-xs mb-1">Icon Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={iconColor}
              onChange={(e) => {
                const newIconColor = e.target.value;
                setIconColor(newIconColor);
                setLocalConfig((prev: any) => ({
                  ...prev,
                  iconColor: newIconColor
                }));
                setForceRender(prev => prev + 1);
              }}
              className="w-8 h-6 rounded border border-white/20 cursor-pointer"
            />
            <span className="text-white/50 text-xs">{iconColor}</span>
          </div>
        </div>
      </div>

      {/* Advanced Eyedropper Section */}
      {drawingTool === 'eyedropper' && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm mb-6">
          <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Pipette size={20} className="text-teal-400" />
            Color Picker
          </h4>

          <div className="space-y-4">
            {/* Instructions */}
            <div className="bg-teal-600/10 rounded-lg p-3 border border-teal-400/20">
              <p className="text-teal-300 text-sm">
                🎨 Klicke auf beliebige Elemente im Logo um deren Farbe zu sampeln
              </p>
            </div>

            {/* Sampled Color Display */}
            {sampledColor && (
              <div className="space-y-3">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Gesampelte Farbe</label>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-white/20 shadow-lg"
                      style={{ backgroundColor: sampledColor }}
                    ></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-white/10 rounded px-3 py-2 border border-white/20">
                        <code className="text-white font-mono text-sm">{sampledColor}</code>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(sampledColor)}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => setBrushColor(sampledColor)}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                        >
                          → Brush
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Color Controls */}
                <div>
                  <label className="block text-white/80 text-sm mb-2">Fine-tune Color</label>
                  <div className="space-y-3">
                    {/* Hue */}
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Hue: {Math.round(hslColor.h)}°</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={hslColor.h}
                        onChange={(e) => {
                          const newH = parseInt(e.target.value);
                          const newHsl = { ...hslColor, h: newH };
                          setHslColor(newHsl);
                          const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
                          setBrushColor(newHex);
                        }}
                        className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Saturation */}
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Saturation: {Math.round(hslColor.s * 100)}%</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={hslColor.s}
                        onChange={(e) => {
                          const newS = parseFloat(e.target.value);
                          const newHsl = { ...hslColor, s: newS };
                          setHslColor(newHsl);
                          const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
                          setBrushColor(newHex);
                        }}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Lightness */}
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Lightness: {Math.round(hslColor.l * 100)}%</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={hslColor.l}
                        onChange={(e) => {
                          const newL = parseFloat(e.target.value);
                          const newHsl = { ...hslColor, l: newL };
                          setHslColor(newHsl);
                          const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
                          setBrushColor(newHex);
                        }}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Color Palettes */}
            <div className="mb-4">
              <h5 className="text-white/80 text-sm mb-2">Predefined Palettes</h5>
              <div className="grid grid-cols-3 gap-2">
                {availablePalettes.slice(0, 12).map(palette => (
                  <button
                    key={palette.id}
                    onClick={() => {
                      updateLocalConfig({ palette });
                      if (palette.colors.length > 0) {
                        setBrandNameColor(palette.colors[0]);
                        if (palette.colors.length > 1) {
                          setIconColor(palette.colors[1]);
                          setSloganColor(palette.colors[1]);
                        }
                      }
                      setForceRender(prev => prev + 1);
                    }}
                    className={`p-2 rounded border transition-colors ${
                      localConfig.palette?.id === palette.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex gap-1 h-4 mb-1">
                      {palette.colors.map((color: string, i: number) => (
                        <div key={i} className="flex-1 rounded-sm" style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                    <span className="text-white/80 text-xs truncate block">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};