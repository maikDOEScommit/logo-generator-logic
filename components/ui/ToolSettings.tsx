type DrawingTool = 'brush' | 'eraser' | 'box' | 'line' | 'eyedropper' | 'move' | 'place';

interface ToolSettingsProps {
  drawingTool: DrawingTool;

  // Brush/Eraser settings
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
  eraserOpacity: number;
  brushLineCap: 'round' | 'square';
  onBrushColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onBrushOpacityChange: (opacity: number) => void;
  onEraserOpacityChange: (opacity: number) => void;
  onBrushLineCapChange: (lineCap: 'round' | 'square') => void;

  // Box settings
  boxStrokeColor: string;
  boxFillColor: string;
  boxOpacity: number;
  selectedBox: string | null;
  onBoxStrokeColorChange: (color: string) => void;
  onBoxFillColorChange: (color: string) => void;
  onBoxOpacityChange: (opacity: number) => void;
  onBoxUpdate: (boxId: string, updates: any) => void;

  // Line settings
  lineColor: string;
  lineWidth: number;
  lineCap: 'round' | 'square';
  onLineColorChange: (color: string) => void;
  onLineWidthChange: (width: number) => void;
  onLineCapChange: (lineCap: 'round' | 'square') => void;
}

export const ToolSettings = ({
  drawingTool,
  brushColor,
  brushSize,
  brushOpacity,
  eraserOpacity,
  brushLineCap,
  onBrushColorChange,
  onBrushSizeChange,
  onBrushOpacityChange,
  onEraserOpacityChange,
  onBrushLineCapChange,
  boxStrokeColor,
  boxFillColor,
  boxOpacity,
  selectedBox,
  onBoxStrokeColorChange,
  onBoxFillColorChange,
  onBoxOpacityChange,
  onBoxUpdate,
  lineColor,
  lineWidth,
  lineCap,
  onLineColorChange,
  onLineWidthChange,
  onLineCapChange
}: ToolSettingsProps) => {

  const handleBoxStrokeColorChange = (color: string) => {
    onBoxStrokeColorChange(color);
    if (selectedBox) {
      onBoxUpdate(selectedBox, { strokeColor: color });
    }
  };

  const handleBoxFillColorChange = (color: string) => {
    onBoxFillColorChange(color);
    if (selectedBox) {
      onBoxUpdate(selectedBox, { fillColor: color });
    }
  };

  const handleBoxOpacityChange = (opacity: number) => {
    onBoxOpacityChange(opacity);
    if (selectedBox) {
      onBoxUpdate(selectedBox, { opacity: opacity / 10 });
    }
  };

  return (
    <div className="space-y-3">
      {/* Brush and Eraser Settings */}
      {(drawingTool === 'brush' || drawingTool === 'eraser') && (
        <>
          {drawingTool === 'brush' && (
            <div>
              <label className="block text-white/80 text-sm mb-1">Brush Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => onBrushColorChange(e.target.value)}
                  className="w-10 h-8 rounded border border-white/20 cursor-pointer"
                />
                <span className="text-white/60 text-sm">{brushColor}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-white/80 text-sm mb-1">Brush/Eraser Size: {brushSize}px</label>
            <input
              type="range"
              min="2"
              max="50"
              value={brushSize}
              onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
              className="w-full slider"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">
              {drawingTool === 'brush' ? 'Brush' : 'Eraser'} Opacity: {drawingTool === 'brush' ? brushOpacity : eraserOpacity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={drawingTool === 'brush' ? brushOpacity : eraserOpacity}
              onChange={(e) => {
                if (drawingTool === 'brush') {
                  onBrushOpacityChange(parseInt(e.target.value));
                } else {
                  onEraserOpacityChange(parseInt(e.target.value));
                }
              }}
              className="w-full slider"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">
              {drawingTool === 'brush' ? 'Pinselende' : 'Radiererenden'}
            </label>
            <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded p-2 w-[58.5%]">
              <button
                onClick={() => onBrushLineCapChange('round')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  brushLineCap === 'round'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                ● Rund
              </button>
              <button
                onClick={() => onBrushLineCapChange('square')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  brushLineCap === 'square'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                ■ Quadratisch
              </button>
            </div>
          </div>
        </>
      )}

      {/* Box Settings */}
      {drawingTool === 'box' && (
        <>
          <div>
            <label className="block text-white/80 text-sm mb-1">Box Stroke Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={boxStrokeColor}
                onChange={(e) => handleBoxStrokeColorChange(e.target.value)}
                className="w-10 h-8 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/60 text-sm">{boxStrokeColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Box Fill Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={boxFillColor}
                onChange={(e) => handleBoxFillColorChange(e.target.value)}
                className="w-10 h-8 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/60 text-sm">{boxFillColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Box Opacity: {boxOpacity}/10</label>
            <input
              type="range"
              min="1"
              max="10"
              value={boxOpacity}
              onChange={(e) => handleBoxOpacityChange(parseInt(e.target.value))}
              className="w-full slider"
            />
          </div>
        </>
      )}

      {/* Line Settings */}
      {drawingTool === 'line' && (
        <>
          <div>
            <label className="block text-white/80 text-sm mb-1">Line Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lineColor}
                onChange={(e) => onLineColorChange(e.target.value)}
                className="w-10 h-8 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-white/60 text-sm">{lineColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Line Width: {lineWidth}px</label>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => onLineWidthChange(parseInt(e.target.value))}
              className="w-full slider"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Linienende</label>
            <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded p-2">
              <button
                onClick={() => onLineCapChange('round')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  lineCap === 'round'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                ● Rund
              </button>
              <button
                onClick={() => onLineCapChange('square')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  lineCap === 'square'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                ■ Quadratisch
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};