import { Layers, Eye, EyeOff, Plus, ArrowUp, ArrowDown, Trash2, Palette } from 'lucide-react';

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

interface LayerManagementPanelProps {
  editLayers: EditLayer[];
  activeLayer: string;
  setActiveLayer: (layerId: string) => void;
  setEditLayers: React.Dispatch<React.SetStateAction<EditLayer[]>>;
  addCustomLayer: (name?: string) => void;
  deleteLayer: (layerId: string) => void;
  moveLayerUp: (layerId: string) => void;
  moveLayerDown: (layerId: string) => void;
  updateLayerBackgroundColor: (layerId: string, color: string) => void;
  showLayerInput: boolean;
  setShowLayerInput: (show: boolean) => void;
  newLayerName: string;
  setNewLayerName: (name: string) => void;
}

export const LayerManagementPanel = ({
  editLayers,
  activeLayer,
  setActiveLayer,
  setEditLayers,
  addCustomLayer,
  deleteLayer,
  moveLayerUp,
  moveLayerDown,
  updateLayerBackgroundColor,
  showLayerInput,
  setShowLayerInput,
  newLayerName,
  setNewLayerName
}: LayerManagementPanelProps) => {
  const toggleLayerVisibility = (layerId: string) => {
    setEditLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const handleAddLayer = () => {
    if (showLayerInput) {
      if (newLayerName.trim()) {
        addCustomLayer(newLayerName.trim());
        setNewLayerName('');
      }
      setShowLayerInput(false);
    } else {
      setShowLayerInput(true);
      setNewLayerName('');
    }
  };

  // Sort layers by order for display (highest order first)
  const sortedLayers = [...editLayers].sort((a, b) => b.order - a.order);

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-semibold text-lg flex items-center gap-2">
          <Layers size={20} className="text-indigo-400" />
          Layers
        </h4>
        <button
          onClick={handleAddLayer}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          title="Add new layer"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Add layer input */}
      {showLayerInput && (
        <div className="mb-4 p-3 bg-white/10 rounded-lg border border-white/20">
          <input
            type="text"
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddLayer();
              } else if (e.key === 'Escape') {
                setShowLayerInput(false);
                setNewLayerName('');
              }
            }}
            placeholder="Enter layer name"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddLayer}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowLayerInput(false);
                setNewLayerName('');
              }}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Layers list */}
      <div className="space-y-2">
        {sortedLayers.map((layer) => (
          <div
            key={layer.id}
            className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
              activeLayer === layer.id
                ? 'border-indigo-500 bg-indigo-500/20'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            {/* Layer visibility toggle */}
            <button
              onClick={() => toggleLayerVisibility(layer.id)}
              className={`p-1 rounded transition-colors ${
                layer.visible ? 'text-white hover:text-blue-400' : 'text-white/40 hover:text-white/60'
              }`}
              title={layer.visible ? 'Hide layer' : 'Show layer'}
            >
              {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            {/* Layer name and info */}
            <div
              className="flex-1 cursor-pointer"
              onClick={() => setActiveLayer(layer.id)}
            >
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  activeLayer === layer.id ? 'text-white' : 'text-white/80'
                }`}>
                  {layer.name}
                </span>
                <span className="text-xs text-white/50">
                  {layer.type === 'background' && '🎨'}
                  {layer.type === 'original' && '📄'}
                  {layer.type === 'logo' && '🎯'}
                  {layer.type === 'custom' && '✨'}
                  {layer.type === 'elements' && '🔧'}
                </span>
              </div>
              <div className="text-xs text-white/50">
                {layer.strokes?.length || 0} strokes
                {layer.elements && ` • ${layer.elements.length} elements`}
              </div>
            </div>

            {/* Background color picker for background layers */}
            {(layer.type === 'background' || layer.type === 'original') && (
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={layer.backgroundColor || '#000000'}
                  onChange={(e) => updateLayerBackgroundColor(layer.id, e.target.value)}
                  className="w-6 h-6 rounded border border-white/20 cursor-pointer"
                  title="Layer background color"
                />
              </div>
            )}

            {/* Layer controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveLayerUp(layer.id)}
                className="p-1 text-white/60 hover:text-white hover:bg-white/20 rounded transition-colors"
                title="Move layer up"
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={() => moveLayerDown(layer.id)}
                className="p-1 text-white/60 hover:text-white hover:bg-white/20 rounded transition-colors"
                title="Move layer down"
              >
                <ArrowDown size={14} />
              </button>
              {layer.type === 'custom' && (
                <button
                  onClick={() => deleteLayer(layer.id)}
                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                  title="Delete layer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Layer info */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs text-white/60 mb-2">Active Layer: {editLayers.find(l => l.id === activeLayer)?.name}</p>
        <p className="text-xs text-white/50">
          💡 Tip: All drawing operations affect the active layer
        </p>
      </div>
    </div>
  );
};