import { Palette } from 'lucide-react';

interface BackgroundSettingsPanelProps {
  editLayers: any[];
  updateLayerBackgroundColor: (layerId: string, color: string) => void;
  variation?: {
    backgroundColor?: string;
    hasGradient?: boolean;
  };
  availablePalettes: any[];
  onConfigUpdate: (updates: any) => void;
}

export const BackgroundSettingsPanel = ({
  editLayers,
  updateLayerBackgroundColor,
  variation,
  availablePalettes,
  onConfigUpdate
}: BackgroundSettingsPanelProps) => {
  const backgroundLayer = editLayers.find(l => l.type === 'background');
  const originalLayer = editLayers.find(l => l.type === 'original');

  const gradientPresets = [
    { name: 'Sunset', value: 'linear-gradient(135deg, #ff7e5f, #feb47b)' },
    { name: 'Ocean', value: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #11998e, #38ef7d)' },
    { name: 'Purple', value: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { name: 'Pink', value: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { name: 'Blue', value: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { name: 'Orange', value: 'linear-gradient(135deg, #fa709a, #fee140)' },
    { name: 'Green', value: 'linear-gradient(135deg, #a8edea, #fed6e3)' }
  ];

  const solidColors = [
    '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db',
    '#6b7280', '#374151', '#1f2937', '#000000',
    '#fef2f2', '#fee2e2', '#fecaca', '#f87171',
    '#eff6ff', '#dbeafe', '#bfdbfe', '#60a5fa',
    '#f0fdf4', '#dcfce7', '#bbf7d0', '#4ade80',
    '#fffbeb', '#fef3c7', '#fde68a', '#f59e0b'
  ];

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
      <h4 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
        <Palette size={16} className="text-pink-400" />
        Background
      </h4>

      <div className="space-y-3">
        {/* Current Background Info */}
        <div className="p-2 bg-white/10 rounded-lg border border-white/20">
          <p className="text-white/80 text-xs mb-1.5">Current Background:</p>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border border-white/20"
              style={{
                background: variation?.backgroundColor ||
                           backgroundLayer?.backgroundColor ||
                           originalLayer?.backgroundColor ||
                           'transparent'
              }}
            />
            <span className="text-white/60 text-xs">
              {variation?.hasGradient ? 'Gradient' :
               (variation?.backgroundColor && !variation?.backgroundColor.includes('gradient')) ? 'Solid Color' :
               'Transparent'}
            </span>
          </div>
        </div>

        {/* Solid Colors */}
        <div>
          <label className="block text-white/80 text-xs mb-1.5">Solid Colors</label>
          <div className="grid grid-cols-8 gap-1.5">
            {solidColors.map((color, index) => (
              <button
                key={index}
                onClick={() => {
                  if (backgroundLayer) {
                    updateLayerBackgroundColor(backgroundLayer.id, color);
                  }
                  onConfigUpdate({ backgroundColor: color });
                }}
                className="w-6 h-6 rounded border-2 border-white/20 hover:border-white/50 transition-colors"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div>
          <label className="block text-white/80 text-xs mb-1.5">Custom Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              onChange={(e) => {
                if (backgroundLayer) {
                  updateLayerBackgroundColor(backgroundLayer.id, e.target.value);
                }
                onConfigUpdate({ backgroundColor: e.target.value });
              }}
              className="w-10 h-6 rounded border border-white/20 cursor-pointer"
              title="Pick custom background color"
            />
            <span className="text-white/60 text-xs">Pick any color</span>
          </div>
        </div>

        {/* Gradient Presets */}
        <div>
          <label className="block text-white/80 text-xs mb-1.5">Gradient Backgrounds</label>
          <div className="grid grid-cols-2 gap-1.5">
            {gradientPresets.map((gradient, index) => (
              <button
                key={index}
                onClick={() => {
                  if (backgroundLayer) {
                    updateLayerBackgroundColor(backgroundLayer.id, gradient.value);
                  }
                  onConfigUpdate({ backgroundColor: gradient.value });
                }}
                className="relative h-8 rounded border-2 border-white/20 hover:border-white/50 transition-colors overflow-hidden"
                style={{ background: gradient.value }}
                title={gradient.name}
              >
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="text-white text-[10px] font-medium">{gradient.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Palette Integration */}
        <div>
          <label className="block text-white/80 text-xs mb-1.5">From Color Palettes</label>
          <div className="grid grid-cols-2 gap-1.5">
            {availablePalettes.slice(0, 6).map((palette) => (
              <button
                key={palette.id}
                onClick={() => {
                  const bgColor = palette.colors[0] || '#000000';
                  if (backgroundLayer) {
                    updateLayerBackgroundColor(backgroundLayer.id, bgColor);
                  }
                  onConfigUpdate({ backgroundColor: bgColor });
                }}
                className="p-2 rounded border border-white/20 hover:border-white/40 transition-colors"
              >
                <div className="flex gap-1 h-4 mb-1">
                  {palette.colors.slice(0, 3).map((color: string, i: number) => (
                    <div key={i} className="flex-1 rounded-sm" style={{ backgroundColor: color }}></div>
                  ))}
                </div>
                <span className="text-white/80 text-xs">{palette.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reset to Transparent */}
        <button
          onClick={() => {
            if (backgroundLayer) {
              updateLayerBackgroundColor(backgroundLayer.id, 'transparent');
            }
            onConfigUpdate({ backgroundColor: 'transparent' });
          }}
          className="w-full px-3 py-2 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded text-sm transition-colors"
        >
          Reset to Transparent
        </button>

        {/* Tips */}
        <div className="p-3 bg-blue-600/10 rounded-lg border border-blue-400/20">
          <p className="text-blue-300 text-xs">
            💡 Background changes affect all layers. Use layer controls for more specific adjustments.
          </p>
        </div>
      </div>
    </div>
  );
};