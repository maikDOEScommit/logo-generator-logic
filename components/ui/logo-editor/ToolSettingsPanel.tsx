interface ToolSettingsPanelProps {
  drawingTool: 'brush' | 'eraser' | 'box' | 'line' | 'eyedropper' | 'move' | 'place';
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushOpacity: number;
  setBrushOpacity: (opacity: number) => void;
  eraserOpacity: number;
  setEraserOpacity: (opacity: number) => void;
  lineColor: string;
  setLineColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  boxFillColor: string;
  setBoxFillColor: (color: string) => void;
  boxStrokeColor: string;
  setBoxStrokeColor: (color: string) => void;
  sampledColor: string | null;
  selectedElementToPlace: string;
  setSelectedElementToPlace: (element: string) => void;
  logoElements: {
    brand: any;
    slogan: any;
    icon: any;
  };
  boxes: any[];
  selectedBox: string;
  setSelectedBox: (id: string) => void;
}

export const ToolSettingsPanel = ({
  drawingTool,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  brushOpacity,
  setBrushOpacity,
  eraserOpacity,
  setEraserOpacity,
  lineColor,
  setLineColor,
  lineWidth,
  setLineWidth,
  boxFillColor,
  setBoxFillColor,
  boxStrokeColor,
  setBoxStrokeColor,
  sampledColor,
  selectedElementToPlace,
  setSelectedElementToPlace,
  logoElements,
  boxes,
  selectedBox,
  setSelectedBox
}: ToolSettingsPanelProps) => {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
      <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <span className="text-gray-400">🛠️</span>
        Tool Settings
      </h4>

      {/* Tool-specific settings */}
      {(drawingTool === 'brush' || drawingTool === 'eraser') && (
        <div className="space-y-3">
          <div>
            <label className="block text-white/80 text-sm mb-1">
              {drawingTool === 'brush' ? 'Brush Color' : 'Eraser Color'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/50 text-xs">{brushColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">
              Size: {brushSize}px
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">
              Opacity: {drawingTool === 'brush' ? brushOpacity : eraserOpacity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={drawingTool === 'brush' ? brushOpacity : eraserOpacity}
              onChange={(e) => {
                if (drawingTool === 'brush') {
                  setBrushOpacity(parseInt(e.target.value));
                } else {
                  setEraserOpacity(parseInt(e.target.value));
                }
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {drawingTool === 'line' && (
        <div className="space-y-3">
          <div>
            <label className="block text-white/80 text-sm mb-1">Line Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/50 text-xs">{lineColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Width: {lineWidth}px</label>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {drawingTool === 'box' && (
        <div className="space-y-3">
          <div>
            <label className="block text-white/80 text-sm mb-1">Fill Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={boxFillColor}
                onChange={(e) => setBoxFillColor(e.target.value)}
                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/50 text-xs">{boxFillColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Stroke Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={boxStrokeColor}
                onChange={(e) => setBoxStrokeColor(e.target.value)}
                className="w-8 h-6 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/50 text-xs">{boxStrokeColor}</span>
            </div>
          </div>
        </div>
      )}

      {drawingTool === 'place' && (
        <div className="space-y-3">
          <label className="block text-white/80 text-sm mb-2">Select Element to Place</label>
          <div className="grid grid-cols-2 gap-2">
            {logoElements.brand && (
              <button
                onClick={() => setSelectedElementToPlace('brand')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedElementToPlace === 'brand'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                📝 Brand
              </button>
            )}
            {logoElements.slogan && (
              <button
                onClick={() => setSelectedElementToPlace('slogan')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedElementToPlace === 'slogan'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                💬 Slogan
              </button>
            )}
            {logoElements.icon && (
              <button
                onClick={() => setSelectedElementToPlace('icon')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedElementToPlace === 'icon'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                🎯 Icon
              </button>
            )}
            {boxes.length > 0 && boxes.map((box, index) => (
              <button
                key={box.id}
                onClick={() => {
                  setSelectedElementToPlace('box');
                  setSelectedBox(box.id);
                }}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedElementToPlace === 'box' && selectedBox === box.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                ⬜ Box {index + 1}
              </button>
            ))}
          </div>
          {selectedElementToPlace && (
            <p className="text-indigo-300 text-xs mt-2">
              📍 Click in logo to place {selectedElementToPlace}
            </p>
          )}
        </div>
      )}

      {drawingTool === 'eyedropper' && sampledColor && (
        <div className="space-y-3">
          <div>
            <label className="block text-white/80 text-sm mb-2">Sampled Color</label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border border-white/20"
                style={{ backgroundColor: sampledColor }}
              />
              <div className="flex-1">
                <code className="text-white text-sm">{sampledColor}</code>
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={() => navigator.clipboard.writeText(sampledColor)}
                    className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => setBrushColor(sampledColor)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                  >
                    Use
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};