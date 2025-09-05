import { useState } from 'react';
import { LogoConfig, IconData, PaletteData } from '@/lib/types';
import { Edit, Save, ShoppingCart } from 'lucide-react';

interface LogoEditorProps {
  config: LogoConfig;
  onConfigUpdate: (newConfig: Partial<LogoConfig>) => void;
  availableIcons: IconData[];
  availablePalettes: PaletteData[];
}

const LogoEditor = ({ config, onConfigUpdate, availableIcons, availablePalettes }: LogoEditorProps) => {
  const [showFullscreenEditor, setShowFullscreenEditor] = useState(false);

  const handleEdit = () => {
    setShowFullscreenEditor(true);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving logo...', config);
  };

  const handlePurchase = () => {
    // TODO: Implement purchase functionality
    console.log('Purchasing logo...', config);
  };

  return (
    <>
      {/* Menu Panel - slides up from bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/20 rounded-b-lg p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-10 shadow-xl">
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
          >
            <Save size={14} /> Save
          </button>
          <button
            onClick={handlePurchase}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
          >
            <ShoppingCart size={14} /> Purchase
          </button>
        </div>
      </div>

      {/* Fullscreen Editor Modal */}
      {showFullscreenEditor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex">
            {/* Logo Preview Side */}
            <div className="flex-1 p-8 flex items-center justify-center border-r border-white/20">
              <div className="bg-white rounded-lg p-12 max-w-md w-full aspect-square flex items-center justify-center">
                {/* TODO: Render large logo preview here */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-black">{config.text || 'Your Logo'}</h2>
                  {config.slogan && (
                    <p className="text-gray-600 mt-2">{config.slogan}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Editor Controls Side */}
            <div className="w-80 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-lg">Edit Logo</h3>
                <button
                  onClick={() => setShowFullscreenEditor(false)}
                  className="text-white/60 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Text Section */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Text</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={config.text}
                        onChange={(e) => onConfigUpdate({ text: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                        placeholder="Enter brand name"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Slogan</label>
                      <input
                        type="text"
                        value={config.slogan}
                        onChange={(e) => onConfigUpdate({ slogan: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                        placeholder="Enter slogan"
                      />
                    </div>
                  </div>
                </div>

                {/* Icon Section */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Icon</h4>
                  <div className="grid grid-cols-6 gap-2">
                    <button
                      onClick={() => onConfigUpdate({ icon: null })}
                      className={`p-2 rounded border transition-colors ${
                        !config.icon ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <span className="text-white/60 text-xs">None</span>
                    </button>
                    {availableIcons.slice(0, 17).map(icon => (
                      <button
                        key={icon.id}
                        onClick={() => onConfigUpdate({ icon })}
                        className={`p-2 rounded border transition-colors ${
                          config.icon?.id === icon.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <icon.component size={20} color="white" className="mx-auto" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors Section */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Colors</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {availablePalettes.slice(0, 12).map(palette => (
                      <button
                        key={palette.id}
                        onClick={() => onConfigUpdate({ palette })}
                        className={`p-2 rounded border transition-colors ${
                          config.palette?.id === palette.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="flex gap-1 h-4 mb-1">
                          {palette.colors.map((color, i) => (
                            <div key={i} className="flex-1 rounded-sm" style={{ backgroundColor: color }}></div>
                          ))}
                        </div>
                        <span className="text-white/80 text-xs truncate block">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-8 pt-6 border-t border-white/20">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handlePurchase}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoEditor;