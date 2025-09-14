import { Brush, Eraser, Square, Pipette, Move } from 'lucide-react';

type DrawingTool = 'brush' | 'eraser' | 'box' | 'line' | 'eyedropper' | 'move' | 'place';

interface DrawingToolbarProps {
  drawingTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
}

export const DrawingToolbar = ({ drawingTool, onToolChange }: DrawingToolbarProps) => {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
      <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <Brush size={20} className="text-blue-400" />
        Drawing Tools
      </h4>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => onToolChange('brush')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'brush' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Brush size={16} />
          Brush
        </button>
        <button
          onClick={() => onToolChange('eraser')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'eraser' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Eraser size={16} />
          Eraser
        </button>
        <button
          onClick={() => onToolChange('box')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'box' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Square size={16} />
          Box
        </button>
        <button
          onClick={() => onToolChange('line')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'line' ? 'bg-orange-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          📏 Line
        </button>
        <button
          onClick={() => onToolChange('eyedropper')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'eyedropper' ? 'bg-teal-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Pipette size={16} />
        </button>
        <button
          onClick={() => onToolChange('move')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'move' ? 'bg-green-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Move size={16} />
          Move
        </button>
        <button
          onClick={() => onToolChange('place')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            drawingTool === 'place' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          📍 Place
        </button>
      </div>
    </div>
  );
};