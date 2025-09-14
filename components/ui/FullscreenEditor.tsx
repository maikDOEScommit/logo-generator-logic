import { ReactNode } from 'react';
import { X, Expand } from 'lucide-react';

interface FullscreenEditorProps {
  isOpen: boolean;
  isTrueFullscreen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
  onExitFullscreen: () => void;
  children: ReactNode;
  canvasArea: ReactNode;
}

export const FullscreenEditor = ({
  isOpen,
  isTrueFullscreen,
  onClose,
  onToggleFullscreen,
  onExitFullscreen,
  children,
  canvasArea
}: FullscreenEditorProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-gray-900 w-full h-full flex ${
        isTrueFullscreen ? 'rounded-none max-w-none max-h-none' : 'rounded-lg max-w-6xl max-h-[90vh]'
      }`}>
        {/* Logo Preview Side with Drawing Canvas */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center border-r border-white/20">
          {/* Zoom and Fullscreen Controls */}
          <div className="absolute top-4 left-4 z-50 flex gap-2">
            <button
              onClick={isTrueFullscreen ? onExitFullscreen : onToggleFullscreen}
              className="px-3 py-2 rounded text-sm font-medium transition-colors bg-white/10 hover:bg-white/20 text-white/80"
            >
              {isTrueFullscreen ? (
                <>
                  <X size={16} /> Exit FS
                </>
              ) : (
                <>
                  <Expand size={16} /> Fullscreen
                </>
              )}
            </button>
            {!isTrueFullscreen && (
              <button
                onClick={onClose}
                className="px-3 py-2 rounded text-sm font-medium transition-colors bg-red-500/20 hover:bg-red-500/30 text-white/80 border border-red-400/30"
              >
                <X size={16} /> Close
              </button>
            )}
          </div>

          {/* Canvas Area */}
          {canvasArea}
        </div>

        {/* Editor Controls Side */}
        {children}
      </div>
    </div>
  );
};