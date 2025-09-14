import { Palette } from 'lucide-react';

interface EditLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'background' | 'original' | 'logo' | 'custom' | 'elements';
  strokes: any[];
  backgroundColor?: string;
  elements?: any[];
  order: number;
}

interface ColorPaletteProps {
  editLayers: EditLayer[];
  activeLayer: string;
  onUpdateLayerBackgroundColor: (layerId: string, color: string) => void;
}

export const ColorPalette = ({
  editLayers,
  activeLayer,
  onUpdateLayerBackgroundColor
}: ColorPaletteProps) => {
  const currentLayer = editLayers.find(l => l.id === activeLayer);

  if (!currentLayer || (currentLayer.type !== 'background' && currentLayer.type !== 'original')) {
    return null;
  }

  const currentBg = currentLayer.backgroundColor || '#ffffff';
  const isGradient = currentBg.includes('linear-gradient');

  // Extract colors and direction from gradient if present
  let gradientColor1 = '#ff6b6b';
  let gradientColor2 = '#4ecdc4';
  let gradientColor3 = '#a855f7';
  let gradientDirection = 135;
  let use3Colors = false;
  let solidColor = '#ffffff';

  if (isGradient) {
    // Extract direction
    const directionMatch = currentBg.match(/linear-gradient\((\d+)deg/);
    if (directionMatch) {
      gradientDirection = parseInt(directionMatch[1]);
    }

    // Extract colors
    const matches = currentBg.match(/#[0-9a-f]{6}/gi);
    if (matches) {
      if (matches.length >= 2) {
        gradientColor1 = matches[0];
        gradientColor2 = matches[1];
      }
      if (matches.length >= 3) {
        gradientColor3 = matches[2];
        use3Colors = true;
      }
    }
  } else {
    solidColor = currentBg;
  }

  const updateGradient = (color1: string, color2: string, color3?: string, direction?: number) => {
    const dir = direction || gradientDirection;
    const gradientStr = color3 && use3Colors
      ? `linear-gradient(${dir}deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`
      : `linear-gradient(${dir}deg, ${color1} 0%, ${color2} 100%)`;
    onUpdateLayerBackgroundColor(activeLayer, gradientStr);
  };

  const toggleColorMode = () => {
    if (isGradient) {
      onUpdateLayerBackgroundColor(activeLayer, solidColor);
    } else {
      updateGradient(gradientColor1, gradientColor2, use3Colors ? gradientColor3 : undefined);
    }
  };

  const toggle3Colors = () => {
    const newUse3Colors = !use3Colors;
    const gradientStr = newUse3Colors
      ? `linear-gradient(${gradientDirection}deg, ${gradientColor1} 0%, ${gradientColor2} 50%, ${gradientColor3} 100%)`
      : `linear-gradient(${gradientDirection}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`;
    onUpdateLayerBackgroundColor(activeLayer, gradientStr);
  };

  return (
    <div className="bg-white/5 rounded-xl mb-6 overflow-hidden border border-white/10">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <Palette className="w-4 h-4 text-white" />
        <span className="font-semibold text-white">Background Color</span>
      </div>
      <div className="p-4">
        {/* Background Type Selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={toggleColorMode}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              !isGradient
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Solid Color
          </button>
          <button
            onClick={toggleColorMode}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              isGradient
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Gradient
          </button>
        </div>

        {/* Gradient Controls */}
        {isGradient ? (
          <div className="space-y-4">
            {/* Gradient Direction */}
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm w-20">Direction:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={gradientDirection}
                onChange={(e) => updateGradient(gradientColor1, gradientColor2, use3Colors ? gradientColor3 : undefined, parseInt(e.target.value))}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white/70 text-sm w-12">{gradientDirection}°</span>
            </div>

            {/* 3-Color Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm w-20">Colors:</span>
              <button
                onClick={toggle3Colors}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  use3Colors
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {use3Colors ? '3 Colors' : '2 Colors'}
              </button>
            </div>

            {/* Color Controls */}
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm w-20">Color 1:</span>
              <input
                type="color"
                value={gradientColor1}
                onChange={(e) => updateGradient(e.target.value, gradientColor2, use3Colors ? gradientColor3 : undefined)}
                className="flex-1 h-10 rounded border border-white/20 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm w-20">Color 2:</span>
              <input
                type="color"
                value={gradientColor2}
                onChange={(e) => updateGradient(gradientColor1, e.target.value, use3Colors ? gradientColor3 : undefined)}
                className="flex-1 h-10 rounded border border-white/20 bg-transparent"
              />
            </div>
            {use3Colors && (
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm w-20">Color 3:</span>
                <input
                  type="color"
                  value={gradientColor3}
                  onChange={(e) => updateGradient(gradientColor1, gradientColor2, e.target.value)}
                  className="flex-1 h-10 rounded border border-white/20 bg-transparent"
                />
              </div>
            )}

            {/* Gradient Presets */}
            <div>
              <span className="text-white/70 text-sm block mb-2">Gradient Presets:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                ].map((gradient, i) => (
                  <button
                    key={i}
                    onClick={() => onUpdateLayerBackgroundColor(activeLayer, gradient)}
                    className="w-full h-8 rounded border border-white/20 hover:border-white/40 transition-colors"
                    style={{ backgroundImage: gradient }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Solid Color Picker */}
            <input
              type="color"
              value={solidColor}
              onChange={(e) => onUpdateLayerBackgroundColor(activeLayer, e.target.value)}
              className="w-full h-12 rounded-lg border border-white/20 bg-transparent"
            />
            <div className="mt-3 grid grid-cols-6 gap-2">
              {['#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#111827', '#000000'].map(color => (
                <button
                  key={color}
                  onClick={() => onUpdateLayerBackgroundColor(activeLayer, color)}
                  className="w-8 h-8 rounded border-2 border-white/20 hover:border-white/40 transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Transparent Option */}
        <button
          onClick={() => onUpdateLayerBackgroundColor(activeLayer, 'transparent')}
          className="w-full mt-3 px-3 py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded text-sm transition-colors border border-white/20"
        >
          Transparent Background
        </button>
      </div>
    </div>
  );
};