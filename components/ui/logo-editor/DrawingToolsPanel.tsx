import { Brush, Square, Eraser, Pipette, Move, RotateCcw } from 'lucide-react';

interface DrawingToolsPanelProps {
  drawingTool: 'brush' | 'eraser' | 'box' | 'line' | 'eyedropper' | 'move' | 'place';
  setDrawingTool: (tool: 'brush' | 'eraser' | 'box' | 'line' | 'eyedropper' | 'move' | 'place') => void;
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
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
      <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <Brush size={20} className="text-blue-400" />
        Drawing Tools
      </h4>

      {/* Tool Selection */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => setDrawingTool('brush')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'brush' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Brush size={16} />
          Brush
        </button>
        <button
          onClick={() => setDrawingTool('eraser')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'eraser' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Eraser size={16} />
          Eraser
        </button>
        <button
          onClick={() => setDrawingTool('box')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'box' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Square size={16} />
          Box
        </button>
        <button
          onClick={() => setDrawingTool('line')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'line' ? 'bg-orange-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          📏 Line
        </button>
        <button
          onClick={() => setDrawingTool('eyedropper')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'eyedropper' ? 'bg-teal-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Pipette size={16} />
        </button>
        <button
          onClick={() => setDrawingTool('move')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'move' ? 'bg-green-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Move size={16} />
        </button>
        <button
          onClick={() => setDrawingTool('place')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'place' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          📍 Place
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onUndoLastStroke}
          disabled={!canUndo}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600/80 hover:bg-yellow-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
        >
          <RotateCcw size={16} />
          Undo
        </button>
        <button
          onClick={onClearAllStrokes}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded text-sm transition-colors"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};