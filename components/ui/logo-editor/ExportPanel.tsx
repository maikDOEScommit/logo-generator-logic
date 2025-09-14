import { Download, Save, ShoppingCart, FileImage } from 'lucide-react';

interface ExportPanelProps {
  onSave: () => void;
  onPurchase: () => void;
  onDownloadPNG?: () => void;
  onDownloadSVG?: () => void;
  onDownloadJPG?: () => void;
  showPurchaseButton?: boolean;
  showDownloadOptions?: boolean;
  isProcessing?: boolean;
}

export const ExportPanel = ({
  onSave,
  onPurchase,
  onDownloadPNG,
  onDownloadSVG,
  onDownloadJPG,
  showPurchaseButton = true,
  showDownloadOptions = false,
  isProcessing = false
}: ExportPanelProps) => {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
      <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <Download size={20} className="text-green-400" />
        Export & Save
      </h4>

      <div className="space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-3">
          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <Save size={18} />
            {isProcessing ? 'Saving...' : 'Save Changes'}
          </button>

          {/* Purchase Button */}
          {showPurchaseButton && (
            <button
              onClick={onPurchase}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              <ShoppingCart size={18} />
              Get High-Quality Files
            </button>
          )}
        </div>

        {/* Download Options */}
        {showDownloadOptions && (
          <div className="pt-4 border-t border-white/20">
            <h5 className="text-white/80 text-sm mb-3">Quick Downloads</h5>
            <div className="grid grid-cols-1 gap-2">
              {/* PNG Download */}
              {onDownloadPNG && (
                <button
                  onClick={onDownloadPNG}
                  disabled={isProcessing}
                  className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600/50 text-white rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileImage size={16} />
                    <span className="text-sm font-medium">PNG</span>
                  </div>
                  <span className="text-xs text-white/60">High-res raster</span>
                </button>
              )}

              {/* SVG Download */}
              {onDownloadSVG && (
                <button
                  onClick={onDownloadSVG}
                  disabled={isProcessing}
                  className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600/50 text-white rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileImage size={16} />
                    <span className="text-sm font-medium">SVG</span>
                  </div>
                  <span className="text-xs text-white/60">Vector format</span>
                </button>
              )}

              {/* JPG Download */}
              {onDownloadJPG && (
                <button
                  onClick={onDownloadJPG}
                  disabled={isProcessing}
                  className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600/50 text-white rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileImage size={16} />
                    <span className="text-sm font-medium">JPG</span>
                  </div>
                  <span className="text-xs text-white/60">Compressed raster</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Export Info */}
        <div className="p-3 bg-blue-600/10 rounded-lg border border-blue-400/20">
          <h6 className="text-blue-300 text-sm font-medium mb-2">Export Options</h6>
          <ul className="text-blue-200 text-xs space-y-1">
            <li>• Save: Keeps your work for later editing</li>
            {showPurchaseButton && <li>• Purchase: Get professional file formats</li>}
            {showDownloadOptions && <li>• Downloads: Quick export in common formats</li>}
          </ul>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center p-3 bg-yellow-600/10 rounded-lg border border-yellow-400/20">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-yellow-300 text-sm">Processing...</span>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/60 text-xs">
            💡 Tip: Save frequently to avoid losing your work. Use purchase for commercial-quality files.
          </p>
        </div>
      </div>
    </div>
  );
};