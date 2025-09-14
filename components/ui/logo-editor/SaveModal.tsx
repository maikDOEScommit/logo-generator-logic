import { Download, Check, X, User, FileImage } from 'lucide-react';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSaveOption: (option: string) => void;
}

export const SaveModal = ({
  isOpen,
  onClose,
  handleSaveOption
}: SaveModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Save Your Logo</h2>
              <p className="text-white/70 mt-1">Choose how you want to save your logo</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Save Options */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Save to Profile */}
            <div className="border-2 border-white/20 rounded-lg p-4 hover:border-blue-400 transition-colors bg-white/5 flex flex-col h-full">
              <div className="text-center flex-grow">
                <div className="w-16 h-16 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <User className="text-blue-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Save to Profile</h3>
                <p className="text-white/70 text-sm mb-4">Save to your account for easy access later</p>

                <ul className="text-left space-y-2 mb-4">
                  <li className="flex items-center text-sm text-white/80">
                    <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                    Access from any device
                  </li>
                  <li className="flex items-center text-sm text-white/80">
                    <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                    Edit anytime
                  </li>
                  <li className="flex items-center text-sm text-white/80">
                    <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                    Share with team
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-4">
                <button
                  onClick={() => handleSaveOption('profile')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                >
                  Save to Profile
                </button>
              </div>
            </div>

            {/* Download SVG */}
            <div className="border-2 border-white/20 rounded-lg p-4 hover:border-purple-400 transition-colors bg-white/5 flex flex-col h-full">
              <div className="text-center flex-grow">
                <div className="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="text-purple-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Download SVG</h3>
                <p className="text-white/70 text-sm mb-4">Vector format, perfect for scaling</p>

                <ul className="text-left space-y-2 mb-4">
                  <li className="flex items-center text-sm text-white/80">
                    <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                    Infinitely scalable
                  </li>
                  <li className="flex items-center text-sm text-white/80">
                    <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                    Small file size
                  </li>
                  <li className="flex items-center text-sm text-white/80">
                    <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                    Web optimized
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-4">
                <button
                  onClick={() => handleSaveOption('svg')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                >
                  Download SVG
                </button>
              </div>
            </div>

            {/* Download PNG */}
            <div className="border-2 border-white/20 rounded-lg p-4 hover:border-green-400 transition-colors bg-white/5 flex flex-col h-full">
              <div className="text-center flex-grow">
                <div className="w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileImage className="text-green-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Download PNG</h3>
                <p className="text-white/70 text-sm mb-4">High-resolution raster format</p>

                <ul className="text-left space-y-2 mb-4">
                  <li className="flex items-center text-sm text-white/80">
                    <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                    3000x3000px resolution
                  </li>
                  <li className="flex items-center text-sm text-white/80">
                    <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                    Transparent background
                  </li>
                  <li className="flex items-center text-sm text-white/80">
                    <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                    Print ready
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-4">
                <button
                  onClick={() => handleSaveOption('png')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                >
                  Download PNG
                </button>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex justify-center items-center text-sm text-white/70">
              <div className="flex items-center">
                <Check className="text-green-400 mr-2" size={16} />
                Free downloads • No watermark • Commercial use allowed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};