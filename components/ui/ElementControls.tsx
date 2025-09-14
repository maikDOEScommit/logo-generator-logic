interface TextElement {
  id: string;
  type: 'brand' | 'slogan';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  selected: boolean;
  permanent: boolean;
  rotation: number;
  textAlign: 'left' | 'center' | 'right';
  opacity: number;
}

interface IconElement {
  id: string;
  type: 'icon';
  icon: any;
  x: number;
  y: number;
  size: number;
  color: string;
  selected: boolean;
  permanent: boolean;
  rotation: number;
  opacity: number;
}

interface LogoElements {
  brand: TextElement | null;
  slogan: TextElement | null;
  icon: IconElement | null;
}

interface ElementControlsProps {
  selectedElement: string | null;
  logoElements: LogoElements;
  onLogoElementsChange: (elements: LogoElements) => void;
  onCenterElements: () => void;
}

export const ElementControls = ({
  selectedElement,
  logoElements,
  onLogoElementsChange,
  onCenterElements
}: ElementControlsProps) => {
  if (!selectedElement || !logoElements[selectedElement as keyof typeof logoElements]) {
    return null;
  }

  const currentElement = logoElements[selectedElement as keyof typeof logoElements];

  const updateElement = (updates: any) => {
    onLogoElementsChange({
      ...logoElements,
      [selectedElement]: currentElement ? { ...currentElement, ...updates } : currentElement
    });
  };

  return (
    <div className="border-t border-white/20 pt-3 mt-3">
      <label className="block text-white/80 text-sm mb-3">Element Controls</label>

      {/* Icon Controls */}
      {selectedElement === 'icon' && logoElements.icon && (
        <>
          <div>
            <label className="block text-white/80 text-sm mb-1">Icon Size: {logoElements.icon.size}px</label>
            <input
              type="range"
              min="16"
              max="120"
              value={logoElements.icon.size}
              onChange={(e) => updateElement({ size: parseInt(e.target.value) })}
              className="w-full slider"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Icon Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={logoElements.icon.color}
                onChange={(e) => updateElement({ color: e.target.value })}
                className="w-10 h-8 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/60 text-sm">{logoElements.icon.color}</span>
            </div>
          </div>
        </>
      )}

      {/* Text Controls */}
      {(selectedElement === 'brand' || selectedElement === 'slogan') && currentElement && (
        <>
          <div>
            <label className="block text-white/80 text-sm mb-1">Font Size: {(currentElement as TextElement).fontSize}px</label>
            <input
              type="range"
              min="8"
              max="72"
              value={(currentElement as TextElement).fontSize}
              onChange={(e) => updateElement({ fontSize: parseInt(e.target.value) })}
              className="w-full slider"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={(currentElement as TextElement).color}
                onChange={(e) => updateElement({ color: e.target.value })}
                className="w-10 h-8 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/60 text-sm">{(currentElement as TextElement).color}</span>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Text Alignment</label>
            <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded p-2">
              <button
                onClick={() => updateElement({ textAlign: 'left' })}
                className={`flex-1 px-3 py-1 rounded text-xs transition-colors ${
                  (currentElement as TextElement).textAlign === 'left'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Links
              </button>
              <button
                onClick={() => updateElement({ textAlign: 'center' })}
                className={`flex-1 px-3 py-1 rounded text-xs transition-colors ${
                  (currentElement as TextElement).textAlign === 'center'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Mitte
              </button>
              <button
                onClick={() => updateElement({ textAlign: 'right' })}
                className={`flex-1 px-3 py-1 rounded text-xs transition-colors ${
                  (currentElement as TextElement).textAlign === 'right'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Rechts
              </button>
            </div>
          </div>
        </>
      )}

      {/* Common Controls - Rotation and Opacity */}
      <div>
        <label className="block text-white/80 text-sm mb-1">Rotation: {Math.round((currentElement as any)?.rotation || 0)}°</label>
        <input
          type="range"
          min="-180"
          max="180"
          value={(currentElement as any)?.rotation || 0}
          onChange={(e) => updateElement({ rotation: parseInt(e.target.value) })}
          className="w-full slider"
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm mb-1">Opacity: {Math.round(((currentElement as any)?.opacity || 1) * 100)}%</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={(currentElement as any)?.opacity || 1}
          onChange={(e) => updateElement({ opacity: parseFloat(e.target.value) })}
          className="w-full slider"
        />
      </div>

      <button
        onClick={onCenterElements}
        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors mt-3"
      >
        Center All Elements
      </button>
    </div>
  );
};