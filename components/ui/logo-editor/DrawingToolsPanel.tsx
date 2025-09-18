import { Brush, Square, Eraser, Pipette, Move, RotateCcw } from 'lucide-react';

interface DrawingToolsPanelProps {
  drawingTool: 'brush' | 'eraser' | 'box' | 'box-eraser' | 'line' | 'eyedropper' | 'move' | 'place';
  setDrawingTool: (tool: 'brush' | 'eraser' | 'box' | 'box-eraser' | 'line' | 'eyedropper' | 'move' | 'place') => void;
  onClearAllStrokes: () => void;
  onUndoLastStroke: () => void;
  canUndo: boolean;
}

export const DrawingToolsPanel = ({
  drawingTool,
  setDrawingTool,
  onClearAllStrokes,
  onUndoLastStroke,
  canUndo
}: DrawingToolsPanelProps) => {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm w-full max-w-full">
      <h4 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
        <Brush size={16} className="text-blue-400" />
        Drawing Tools
      </h4>

      {/* Tool Selection */}
      <div className="space-y-1.5 mb-3">
        {/* First row: Drawing tools */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => setDrawingTool('brush')}
            className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
              drawingTool === 'brush' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Brush size={14} />
          </button>
          <button
            onClick={() => setDrawingTool('eraser')}
            className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
              drawingTool === 'eraser' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Eraser size={14} />
          </button>
          <button
            onClick={() => setDrawingTool('box')}
            className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
              drawingTool === 'box' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Square size={14} />
          </button>
          <button
            onClick={() => setDrawingTool('box-eraser')}
            className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
              drawingTool === 'box-eraser' ? 'bg-red-700 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <div className="relative">
              <Square size={14} />
              <Eraser size={8} className="absolute -top-1 -right-1" />
            </div>
          </button>
        </div>
        {/* Second row: Other tools */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setDrawingTool('line')}
            className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
              drawingTool === 'line' ? 'bg-orange-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            📏
          </button>
          <button
            onClick={() => setDrawingTool('eyedropper')}
            className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
              drawingTool === 'eyedropper' ? 'bg-teal-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Pipette size={14} />
          </button>
          <button
            onClick={() => setDrawingTool('move')}
            className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
              drawingTool === 'move' ? 'bg-green-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Move size={14} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1.5">
        <button
          onClick={onUndoLastStroke}
          disabled={!canUndo}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-yellow-600/80 hover:bg-yellow-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded text-xs transition-colors"
        >
          <RotateCcw size={14} />
          Undo
        </button>
        <button
          onClick={onClearAllStrokes}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded text-xs transition-colors"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};