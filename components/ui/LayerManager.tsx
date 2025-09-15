import { Layers, Eye, EyeOff, ArrowUp, ArrowDown, Trash2, Plus, Check, X } from 'lucide-react';
import { useState } from 'react';

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

interface LayerManagerProps {
  editLayers: EditLayer[];
  activeLayer: string;
  onActiveLayerChange: (layerId: string) => void;
  onLayersChange: (layers: EditLayer[]) => void;
  onMoveLayerUp: (layerId: string) => void;
  onMoveLayerDown: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  onAddCustomLayer: (name: string) => void;
}

export const LayerManager = ({
  editLayers,
  activeLayer,
  onActiveLayerChange,
  onLayersChange,
  onMoveLayerUp,
  onMoveLayerDown,
  onDeleteLayer,
  onAddCustomLayer
}: LayerManagerProps) => {
  const [showLayerInput, setShowLayerInput] = useState(false);
  const [newLayerName, setNewLayerName] = useState('');

  const toggleLayerVisibility = (layerId: string) => {
    const updatedLayers = editLayers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    );
    onLayersChange(updatedLayers);
  };

  const handleAddLayer = () => {
    onAddCustomLayer(newLayerName || 'New Layer');
    setNewLayerName('');
    setShowLayerInput(false);
  };

  const handleCancelAdd = () => {
    setNewLayerName('');
    setShowLayerInput(false);
  };

  return (
    <div className="bg-white/5 rounded-lg mb-4 overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-white" />
          <span className="font-semibold text-white">Layers</span>
        </div>
      </div>

      <div className="p-2 space-y-1.5">
        {editLayers
          .sort((a, b) => b.order - a.order)
          .map((layer) => (
          <div
            key={layer.id}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border cursor-pointer transition-all ${
              activeLayer === layer.id
                ? "bg-gray-700 border-blue-500"
                : "bg-gray-700/50 border-transparent hover:bg-gray-700"
            }`}
            onClick={() => onActiveLayerChange(layer.id)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerVisibility(layer.id);
              }}
            >
              {layer.visible ? (
                <Eye className="w-4 h-4 text-white" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <span className="flex-1 text-xs text-white">{layer.name}</span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveLayerUp(layer.id);
                }}
                className="p-1 hover:bg-gray-600 rounded"
              >
                <ArrowUp className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveLayerDown(layer.id);
                }}
                className="p-1 hover:bg-gray-600 rounded"
              >
                <ArrowDown className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLayer(layer.id);
                }}
                className="p-1 hover:bg-gray-600 rounded text-red-400"
                disabled={editLayers.length === 1}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {!showLayerInput ? (
          <div className="px-3 pb-2">
            <button
              onClick={() => setShowLayerInput(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Layer
            </button>
          </div>
        ) : (
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newLayerName}
                onChange={(e) => setNewLayerName(e.target.value)}
                placeholder="Layer name"
                className="flex-1 px-2 py-1 text-sm bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddLayer();
                  } else if (e.key === 'Escape') {
                    handleCancelAdd();
                  }
                }}
              />
              <button
                onClick={handleAddLayer}
                className="p-1 text-green-400 hover:text-green-300 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelAdd}
                className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};