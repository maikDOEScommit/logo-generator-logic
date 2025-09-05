import { useMemo, useState } from 'react';
import { LogoConfig, PaletteData } from '@/lib/types';
import { Download, Save } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useLogoStore } from '@/lib/state';
import { fontCategories } from '@/lib/data';
import LogoEditor from '@/components/ui/LogoEditor';

const LogoPreview = ({ config, selectedFontCategory, availableIcons = [], availablePalettes = [] }: { 
  config: LogoConfig; 
  selectedFontCategory: string | null;
  availableIcons?: any[];
  availablePalettes?: any[];
}) => {
  // Use config from props instead of old store
  const { text = 'Your Logo', slogan = '', icon, layout, palette, enclosingShape } = config;
  
  // State for individual logo editing
  const [logoConfigs, setLogoConfigs] = useState<{ [key: string]: LogoConfig }>({});
  
  // Helper to get individual logo config or fallback to main config
  const getLogoConfig = (logoId: string): LogoConfig => {
    return logoConfigs[logoId] || config;
  };
  
  // Helper to update individual logo config
  const updateLogoConfig = (logoId: string, newConfig: Partial<LogoConfig>) => {
    setLogoConfigs(prev => ({
      ...prev,
      [logoId]: { ...getLogoConfig(logoId), ...newConfig }
    }));
  };
  
  // Debug logging
  console.log('LogoPreview config:', { 
    text, 
    slogan, 
    icon: icon ? icon.id : 'NO ICON', 
    layout: layout ? layout.id : 'NO LAYOUT', 
    palette: palette ? palette.name : 'NO PALETTE',
    enclosingShape: enclosingShape ? enclosingShape.id : 'NO ENCLOSING_SHAPE'
  });
  
  // Get all fonts from the selected category
  const selectedCategoryFonts = selectedFontCategory ? 
    fontCategories.find(cat => cat.name === selectedFontCategory)?.fonts || [] : [];
    
  // If no fonts selected, use all fonts from the first category
  const fontsToDisplay = selectedCategoryFonts.length > 0 ? selectedCategoryFonts : fontCategories[0].fonts;
  
  // Helper function to calculate dynamic font size based on text length
  const getDynamicFontSize = (textLength: number, isCircleLayout: boolean = false) => {
    const baseSize = isCircleLayout ? 1.5 : 2.25; // rem units
    if (textLength <= 8) return `${baseSize}rem`;
    if (textLength <= 12) return `${baseSize * 0.85}rem`;
    if (textLength <= 16) return `${baseSize * 0.7}rem`;
    if (textLength <= 20) return `${baseSize * 0.6}rem`;
    return `${baseSize * 0.5}rem`;
  };

  // Helper function to render logo content based on layout type
  const renderLogoContent = (textColor: string, backgroundColor: string, font: any, logoConfig: LogoConfig) => {
    const isCircleLayout = logoConfig.layout?.id === 'circle-enclosed';
    const dynamicFontSize = getDynamicFontSize(logoConfig.text.length, isCircleLayout);
    
    if (isCircleLayout && logoConfig.enclosingShape) {
      // For circle layouts: show enclosing shape as background with content inside
      return (
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Enclosing shape as background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <logoConfig.enclosingShape.component 
              size={120} 
              color={textColor}
              className="w-full h-full" 
              style={{ fill: textColor }}
            />
          </div>
          {/* Content in center */}
          <div className="relative z-10 flex flex-col items-center">
            {logoConfig.icon && (
              <logoConfig.icon.component size={32} color={textColor} className="mb-2" />
            )}
            <div className="flex flex-col items-center text-center max-w-full px-4">
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full font-bold" style={{ 
                fontSize: dynamicFontSize,
                fontFamily: font.cssName,
                fontWeight: font.generationWeights[0],
                color: textColor
              }}>
                {logoConfig.text}
              </span>
              {logoConfig.slogan && (
                <span className="text-sm font-normal opacity-80 mt-1 max-w-full truncate" style={{ 
                  fontWeight: 300,
                  color: textColor
                }}>
                  {logoConfig.slogan}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      // Standard layout: check arrangement type
      const isHorizontalLayout = logoConfig.layout?.arrangement === 'icon-left';
      
      if (isHorizontalLayout) {
        // Horizontal layout: icon left, text right
        return (
          <div className="flex items-center justify-center gap-4">
            {logoConfig.icon && (
              <logoConfig.icon.component size={48} color={textColor} className="flex-shrink-0" />
            )}
            <div className="flex flex-col items-center text-center justify-center">
              <span className="whitespace-nowrap overflow-hidden text-ellipsis font-bold" style={{ 
                fontSize: dynamicFontSize,
                fontFamily: font.cssName,
                fontWeight: font.generationWeights[0],
                color: textColor
              }}>
                {logoConfig.text}
              </span>
              {logoConfig.slogan && (
                <span className="text-base font-normal opacity-80 mt-1 truncate" style={{ 
                  fontWeight: 300,
                  color: textColor
                }}>
                  {logoConfig.slogan}
                </span>
              )}
            </div>
          </div>
        );
      } else {
        // Vertical layout: icon top, text below
        return (
          <div className="flex flex-col items-center">
            {logoConfig.icon && (
              <logoConfig.icon.component size={48} color={textColor} className="mb-2" />
            )}
            <div className="flex flex-col items-center text-center w-full max-w-full px-4">
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full font-bold" style={{ 
                fontSize: dynamicFontSize,
                fontFamily: font.cssName,
                fontWeight: font.generationWeights[0],
                color: textColor
              }}>
                {logoConfig.text}
              </span>
              {logoConfig.slogan && (
                <span className="text-base font-normal opacity-80 mt-1 max-w-full truncate" style={{ 
                  fontWeight: 300,
                  color: textColor
                }}>
                  {logoConfig.slogan}
                </span>
              )}
            </div>
          </div>
        );
      }
    }
  };
  
  const handleDownload = () => {
    const svgElement = document.getElementById(`logo-svg-generated-light`);
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${text.replace(/ /g, '_')}_logo.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    alert('Save functionality coming soon!');
    console.log('Saving logo config:', { text, icon, layout, palette });
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-white">Generated Logos: {selectedFontCategory} Category</h3>
      
      {/* Show all fonts from the selected category */}
      {fontsToDisplay.map((font, fontIndex) => (
        <div key={font.name} className="space-y-4 pb-8 border-b border-white/10 last:border-b-0">
          <h4 className="text-xl font-semibold text-white">{font.name}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light Version */}
            <div>
              <h5 className="font-medium mb-2 text-white text-sm">Light Version</h5>
              <div className="bg-white/10 border border-white rounded-lg p-4 max-w-full overflow-hidden group relative">
                <div 
                  id={`logo-${font.name.replace(/\s+/g, '-')}-light-${fontIndex}`}
                  className="text-4xl font-bold text-center p-6 rounded flex items-center justify-center gap-4 w-full max-w-full overflow-hidden"
                  style={{ 
                    fontFamily: font.cssName,
                    fontWeight: font.generationWeights[0],
                    color: getLogoConfig(`${font.name}-light`).palette?.colors[1] || (palette ? palette.colors[1] : '#0A3D62'),
                    backgroundColor: getLogoConfig(`${font.name}-light`).palette?.colors[0] || (palette ? palette.colors[0] : '#FFFFFF')
                  }}
                >
                  {renderLogoContent(
                    getLogoConfig(`${font.name}-light`).palette?.colors[1] || (palette ? palette.colors[1] : '#0A3D62'),
                    getLogoConfig(`${font.name}-light`).palette?.colors[0] || (palette ? palette.colors[0] : '#FFFFFF'),
                    font,
                    getLogoConfig(`${font.name}-light`)
                  )}
                </div>
                <LogoEditor
                  config={getLogoConfig(`${font.name}-light`)}
                  onConfigUpdate={(newConfig) => updateLogoConfig(`${font.name}-light`, newConfig)}
                  availableIcons={availableIcons}
                  availablePalettes={availablePalettes}
                />
              </div>
            </div>

            {/* Dark Version */}
            <div>
              <h5 className="font-medium mb-2 text-white text-sm">Dark Version</h5>
              <div className="bg-black border border-white/20 rounded-lg p-4 max-w-full overflow-hidden group relative">
                <div 
                  className="text-4xl font-bold text-center p-6 rounded flex items-center justify-center gap-4 w-full max-w-full overflow-hidden"
                  style={{ 
                    fontFamily: font.cssName,
                    fontWeight: font.generationWeights[1] || font.generationWeights[0],
                    color: getLogoConfig(`${font.name}-dark`).palette?.colors[2] || (palette ? palette.colors[2] : '#FFFFFF'),
                    backgroundColor: '#000000'
                  }}
                >
                  {renderLogoContent(
                    getLogoConfig(`${font.name}-dark`).palette?.colors[2] || (palette ? palette.colors[2] : '#FFFFFF'),
                    '#000000',
                    font,
                    getLogoConfig(`${font.name}-dark`)
                  )}
                </div>
                <LogoEditor
                  config={getLogoConfig(`${font.name}-dark`)}
                  onConfigUpdate={(newConfig) => updateLogoConfig(`${font.name}-dark`, newConfig)}
                  availableIcons={availableIcons}
                  availablePalettes={availablePalettes}
                />
              </div>
            </div>

            {/* Accent Version */}
            <div>
              <h5 className="font-medium mb-2 text-white text-sm">Accent Version</h5>
              <div className="bg-white/10 border border-white rounded-lg p-4 max-w-full overflow-hidden group relative">
                <div 
                  className="text-4xl font-bold text-center p-6 rounded flex items-center justify-center gap-4 w-full max-w-full overflow-hidden"
                  style={{ 
                    fontFamily: font.cssName,
                    fontWeight: font.generationWeights[0],
                    color: getLogoConfig(`${font.name}-accent`).palette?.colors[0] || (palette ? palette.colors[0] : '#0A3D62'),
                    backgroundColor: getLogoConfig(`${font.name}-accent`).palette?.colors[2] || (palette ? palette.colors[2] : '#CEDEEB')
                  }}
                >
                  {renderLogoContent(
                    getLogoConfig(`${font.name}-accent`).palette?.colors[0] || (palette ? palette.colors[0] : '#0A3D62'),
                    getLogoConfig(`${font.name}-accent`).palette?.colors[2] || (palette ? palette.colors[2] : '#CEDEEB'),
                    font,
                    getLogoConfig(`${font.name}-accent`)
                  )}
                </div>
                <LogoEditor
                  config={getLogoConfig(`${font.name}-accent`)}
                  onConfigUpdate={(newConfig) => updateLogoConfig(`${font.name}-accent`, newConfig)}
                  availableIcons={availableIcons}
                  availablePalettes={availablePalettes}
                />
              </div>
            </div>

            {/* Secondary Version */}
            <div>
              <h5 className="font-medium mb-2 text-white text-sm">Secondary Version</h5>
              <div className="bg-white/10 border border-white rounded-lg p-4 max-w-full overflow-hidden group relative">
                <div 
                  className="text-4xl font-bold text-center p-6 rounded flex items-center justify-center gap-4 w-full max-w-full overflow-hidden"
                  style={{ 
                    fontFamily: font.cssName,
                    fontWeight: font.generationWeights[1] || font.generationWeights[0],
                    color: getLogoConfig(`${font.name}-secondary`).palette?.colors[2] || (palette ? palette.colors[2] : '#FFFFFF'),
                    backgroundColor: getLogoConfig(`${font.name}-secondary`).palette?.colors[0] || (palette ? palette.colors[0] : '#0A3D62')
                  }}
                >
                  {renderLogoContent(
                    getLogoConfig(`${font.name}-secondary`).palette?.colors[2] || (palette ? palette.colors[2] : '#FFFFFF'),
                    getLogoConfig(`${font.name}-secondary`).palette?.colors[0] || (palette ? palette.colors[0] : '#0A3D62'),
                    font,
                    getLogoConfig(`${font.name}-secondary`)
                  )}
                </div>
                <LogoEditor
                  config={getLogoConfig(`${font.name}-secondary`)}
                  onConfigUpdate={(newConfig) => updateLogoConfig(`${font.name}-secondary`, newConfig)}
                  availableIcons={availableIcons}
                  availablePalettes={availablePalettes}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <SignedIn>
          <button onClick={handleSave} disabled={!text} className="w-full bg-white/10 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Save size={18} /> Save
          </button>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full bg-white/10 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
              <Save size={18} /> Sign in to Save
            </button>
          </SignInButton>
        </SignedOut>

        <button onClick={handleDownload} disabled={!text} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
          <Download size={18} /> Download SVG
        </button>
      </div>
    </div>
  );
};

export default LogoPreview;