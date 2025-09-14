import { Download, Check, X, Crown, Zap, Star, Award, Globe, Briefcase, TrendingUp, Users } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  flippedCards: Record<string, boolean>;
  toggleCardFlip: (cardId: string) => void;
  handlePurchaseOption: (option: string) => void;
}

export const PurchaseModal = ({
  isOpen,
  onClose,
  flippedCards,
  toggleCardFlip,
  handlePurchaseOption
}: PurchaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Your Package</h2>
              <p className="text-white/70 mt-1">Get your logo in the format you need</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Flip Cards */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

            {/* Basic Package - Flip Card */}
            <div
              className="relative w-full h-96 cursor-pointer group overflow-hidden"
              onClick={() => toggleCardFlip('basic')}
            >
              <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                flippedCards['basic'] ? 'rotate-y-180' : ''
              }`}>

                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden border-2 border-white/20 rounded-lg p-4 sm:p-6 hover:border-blue-400 transition-colors bg-white/5 flex flex-col">
                  <div className="text-center flex-grow">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Download className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
                    <div className="text-3xl font-bold text-white mb-1">$29</div>
                    <p className="text-white/70 text-sm mb-6">Perfect for getting started</p>

                    <ul className="text-left space-y-3 mb-6">
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={16} />
                        High-resolution PNG (3000x3000px)
                      </li>
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={16} />
                        Transparent background version
                      </li>
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={16} />
                        RGB color format
                      </li>
                      <li className="flex items-center text-sm text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={16} />
                        Personal use license
                      </li>
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 text-center">
                    <p className="text-xs text-white/50 mb-2">Click to see more details</p>
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-2 border-blue-400 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/30 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Star className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">Why Choose Basic?</h3>

                      <div className="space-y-4">
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Users className="text-blue-400 mr-2" size={16} />
                            <h4 className="font-semibold text-white text-sm">Perfect For</h4>
                          </div>
                          <p className="text-xs text-white/80">Startups, personal projects, small businesses just getting started</p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="text-blue-400 mr-2" size={16} />
                            <h4 className="font-semibold text-white text-sm">Key Benefit</h4>
                          </div>
                          <p className="text-xs text-white/80">High-quality logo files ready for digital use at an affordable price</p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Globe className="text-blue-400 mr-2" size={16} />
                            <h4 className="font-semibold text-white text-sm">Use Cases</h4>
                          </div>
                          <p className="text-xs text-white/80">Websites, social media, digital marketing, email signatures</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-gradient-to-t from-blue-600/30 to-transparent p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchaseOption('basic');
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                    >
                      Get Basic Package
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Package - Flip Card - Most Popular */}
            <div
              className="relative w-full h-96 cursor-pointer group overflow-hidden"
              onClick={() => toggleCardFlip('professional')}
            >
              <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                flippedCards['professional'] ? 'rotate-y-180' : ''
              }`}>

                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden border-2 border-blue-500 rounded-lg p-4 sm:p-6 relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex flex-col">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium">Most Popular</span>
                  </div>
                  <div className="text-center flex-grow">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Zap className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                    <div className="text-3xl font-bold text-white mb-1">$59</div>
                    <p className="text-white/70 text-sm mb-6">Everything you need for business</p>

                    <ul className="text-left space-y-2 mb-6 text-sm">
                      <li className="flex items-center text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Everything in Basic
                      </li>
                      <li className="flex items-center text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Vector SVG file (infinitely scalable)
                      </li>
                      <li className="flex items-center text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        CMYK version for printing
                      </li>
                      <li className="flex items-center text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Commercial use license
                      </li>
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 text-center">
                    <p className="text-xs text-white/50 mb-2">Click to see more details</p>
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-2 border-purple-500 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-600/30 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Award className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">Professional Excellence</h3>

                      <div className="space-y-3">
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Briefcase className="text-purple-400 mr-2" size={16} />
                            <h4 className="font-semibold text-white text-sm">Perfect For</h4>
                          </div>
                          <p className="text-xs text-white/80">Growing businesses, agencies, professional services, e-commerce</p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Star className="text-purple-400 mr-2" size={16} />
                            <h4 className="font-semibold text-white text-sm">Key Benefit</h4>
                          </div>
                          <p className="text-xs text-white/80">Complete logo package with vector files for unlimited scaling and professional printing</p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Globe className="text-purple-400 mr-2" size={16} />
                            <h4 className="font-semibold text-white text-sm">Bonus</h4>
                          </div>
                          <p className="text-xs text-white/80">Social media kit included - optimized sizes for all platforms</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-gradient-to-t from-purple-600/30 to-transparent p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchaseOption('professional');
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                    >
                      Get Professional Package
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Package - Flip Card */}
            <div
              className="relative w-full h-96 cursor-pointer group overflow-hidden"
              onClick={() => toggleCardFlip('premium')}
            >
              <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                flippedCards['premium'] ? 'rotate-y-180' : ''
              }`}>

                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden border-2 border-white/20 rounded-lg p-4 sm:p-6 hover:border-purple-400 transition-colors bg-white/5 flex flex-col">
                  <div className="text-center flex-grow">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Crown className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
                    <div className="text-3xl font-bold text-white mb-1">$99</div>
                    <p className="text-white/70 text-sm mb-6">Complete branding solution</p>

                    <ul className="text-left space-y-2 mb-6 text-sm">
                      <li className="flex items-center text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Everything in Professional
                      </li>
                      <li className="flex items-center text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Adobe Illustrator AI file
                      </li>
                      <li className="flex items-center text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Brand guidelines PDF
                      </li>
                      <li className="flex items-center text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Business card templates
                      </li>
                      <li className="flex items-center text-white/80">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={14} />
                        Extended commercial license
                      </li>
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 text-center">
                    <p className="text-xs text-white/50 mb-2">Click to see more details</p>
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-2 border-purple-400 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-800/30 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Crown className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">Premium Excellence</h3>

                      <div className="space-y-3">
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Crown className="text-purple-400 mr-2" size={16} />
                            <h4 className="font-semibold text-white text-sm">Perfect For</h4>
                          </div>
                          <p className="text-xs text-white/80">Established businesses, corporations, luxury brands, complete rebrand</p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Award className="text-purple-400 mr-2" size={16} />
                            <h4 className="font-semibold text-white text-sm">Key Benefit</h4>
                          </div>
                          <p className="text-xs text-white/80">Complete brand identity system with professional guidelines and templates</p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Briefcase className="text-purple-400 mr-2" size={16} />
                            <h4 className="font-semibold text-white text-sm">Exclusive</h4>
                          </div>
                          <p className="text-xs text-white/80">Business card designs, letterhead templates, and comprehensive brand guide</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-gradient-to-t from-purple-800/30 to-transparent p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchaseOption('premium');
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                    >
                      Get Premium Package
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm text-white/70">
              <div className="flex items-center">
                <Check className="text-green-400 mr-2" size={16} />
                Instant download
              </div>
              <div className="flex items-center">
                <Check className="text-green-400 mr-2" size={16} />
                Money-back guarantee
              </div>
              <div className="flex items-center">
                <Check className="text-green-400 mr-2" size={16} />
                Secure payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};