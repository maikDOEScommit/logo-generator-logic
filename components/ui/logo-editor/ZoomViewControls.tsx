import { X, Expand, Maximize } from 'lucide-react';

interface ZoomViewControlsProps {
  isZoomed: boolean;
  setIsZoomed: (zoomed: boolean) => void;
  isTrueFullscreen: boolean;
  handleTrueFullscreen: () => void;
  handleExitFullscreen: () => void;
  onCloseEditor?: () => void;
  showCloseButton?: boolean;
}

export const ZoomViewControls = ({
  isZoomed,
  setIsZoomed,
  isTrueFullscreen,
  handleTrueFullscreen,
  handleExitFullscreen,
  onCloseEditor,
  showCloseButton = true
}: ZoomViewControlsProps) => {
  return (
    <div className="absolute top-4 left-4 z-50 flex gap-2">
      {/* Zoom Toggle */}
      <button
        onClick={() => setIsZoomed(!isZoomed)}
        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
          isZoomed
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-white/10 hover:bg-white/20 text-white/80'
        }`}
        title={isZoomed ? 'Reset zoom to 1x' : 'Zoom to 2x'}
      >
        {isZoomed ? '1x' : '2x'} Zoom
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={isTrueFullscreen ? handleExitFullscreen : handleTrueFullscreen}
        className="px-3 py-2 rounded text-sm font-medium transition-colors bg-white/10 hover:bg-white/20 text-white/80"
        title={isTrueFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'}
      >
        {isTrueFullscreen ? (
          <>
            <X size={16} className="inline mr-1" /> Exit FS
          </>
        ) : (
          <>
            <Expand size={16} className="inline mr-1" /> Fullscreen
          </>
        )}
      </button>

      {/* Close Editor Button */}
      {!isTrueFullscreen && showCloseButton && onCloseEditor && (
        <button
          onClick={onCloseEditor}
          className="px-3 py-2 rounded text-sm font-medium transition-colors bg-red-500/20 hover:bg-red-500/30 text-white/80 border border-red-400/30"
          title="Close editor"
        >
          <X size={16} className="inline mr-1" /> Close
        </button>
      )}
    </div>
  );
};