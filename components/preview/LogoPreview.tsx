import { useMemo, useState } from 'react';
import { LogoConfig, PaletteData } from '@/lib/types';
import { Download, Save, Edit3, Eye } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useLogoStore } from '@/lib/state';
import { fontCategories } from '@/lib/data';
import { generateLogoVariations, determineColorRule, LogoVariation } from '@/lib/logoGeneration';
import LogoEditor from '@/components/ui/LogoEditor';
import AdvancedLogoEditor from '@/components/editor/AdvancedLogoEditor';

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

  // State for advanced editor
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);

  // State for current font per variation
  const [currentFontIndex, setCurrentFontIndex] = useState<{[key: string]: number}>({});
  
  // Helper to get individual logo config or fallback to main config
  const getLogoConfig = (logoId: string): LogoConfig => {
    const individualConfig = logoConfigs[logoId];
    if (individualConfig) {
      return individualConfig;
    }
    // Return a complete config with all required properties
    return {
      ...config,
      text: config.text || 'Your Logo',
      slogan: config.slogan || '',
      font: config.font || null,
      fontWeight: config.fontWeight || 400,
      icon: config.icon,
      layout: config.layout,
      palette: config.palette,
      enclosingShape: config.enclosingShape
    };
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

  // Generate logo variations based on color rules
  const logoVariations = useMemo(() => {
    const colorRule = determineColorRule(config.palette, config.baseColor, config.selectedColorOption);
    return generateLogoVariations(config, config.baseColor || '#0A3D62', colorRule);
  }, [config]);
  
  // Helper function to calculate dynamic font size based on text length
  const getDynamicFontSize = (textLength: number, isCircleLayout: boolean = false) => {
    const baseSize = isCircleLayout ? 1.5 : 2.25; // rem units
    if (textLength <= 8) return `${baseSize}rem`;
    if (textLength <= 12) return `${baseSize * 0.85}rem`;
    if (textLength <= 16) return `${baseSize * 0.7}rem`;
    if (textLength <= 20) return `${baseSize * 0.6}rem`;
    return `${baseSize * 0.5}rem`;
  };

  // Helper functions for font switching
  const getCurrentFont = (variationId: string) => {
    const fontIndex = currentFontIndex[variationId] || 0;
    return fontsToDisplay[fontIndex] || fontsToDisplay[0];
  };

  const switchFont = (variationId: string, direction: 'prev' | 'next') => {
    const currentIndex = currentFontIndex[variationId] || 0;
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % fontsToDisplay.length;
    } else {
      newIndex = currentIndex === 0 ? fontsToDisplay.length - 1 : currentIndex - 1;
    }

    setCurrentFontIndex(prev => ({
      ...prev,
      [variationId]: newIndex
    }));
  };

  // Helper function to render logo variations with new color logic
  const renderLogoVariation = (variation: LogoVariation, font: any, logoConfig: LogoConfig) => {
    const dynamicFontSize = getDynamicFontSize(logoConfig.text.length, logoConfig.layout?.type === 'enclosed');
    
    // Handle gradient colors
    const brandNameStyle: React.CSSProperties = {
      fontSize: dynamicFontSize,
      fontFamily: font.cssName,
      fontWeight: logoConfig.fontWeight || font.generationWeights[0],
      ...(variation.hasGradient && variation.brandNameColor.includes('linear-gradient') 
        ? { backgroundImage: variation.brandNameColor, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
        : { color: variation.brandNameColor })
    };

    // Icons können keine CSS-Gradients verwenden, daher Fallback auf base color
    const iconColor = variation.hasGradient && variation.iconColor.includes('linear-gradient') 
      ? config.baseColor || '#0A3D62' // Verwende die baseColor als Fallback für Icons mit Gradients
      : variation.iconColor;

    const sloganStyle: React.CSSProperties = {
      fontSize: '0.75rem',
      fontWeight: 300,
      ...(variation.hasGradient && variation.sloganColor.includes('linear-gradient') 
        ? { backgroundImage: variation.sloganColor, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
        : { color: variation.sloganColor })
    };

    return (
      <div className="w-full h-full flex items-center justify-center">
        {logoConfig.layout?.arrangement === 'text-left' ? (
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-center break-words" style={brandNameStyle}>
                {logoConfig.text}
              </span>
              {logoConfig.slogan && (
                <span className="opacity-80 mt-1 text-center break-words" style={sloganStyle}>
                  {logoConfig.slogan}
                </span>
              )}
            </div>
            {logoConfig.icon && (
              <logoConfig.icon.component size={32} color={iconColor} className="flex-shrink-0" />
            )}
          </div>
        ) : logoConfig.layout?.arrangement === 'icon-left' ? (
          <div className="flex items-center justify-center gap-3">
            {logoConfig.icon && (
              <logoConfig.icon.component size={32} color={iconColor} className="flex-shrink-0" />
            )}
            <div className="flex flex-col items-center">
              <span className="text-center break-words" style={brandNameStyle}>
                {logoConfig.text}
              </span>
              {logoConfig.slogan && (
                <span className="opacity-80 mt-1 text-center break-words" style={sloganStyle}>
                  {logoConfig.slogan}
                </span>
              )}
            </div>
          </div>
        ) : logoConfig.layout?.arrangement === 'text-top' ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center mb-2">
              <span className="text-center break-words" style={brandNameStyle}>
                {logoConfig.text}
              </span>
              {logoConfig.slogan && (
                <span className="opacity-80 mt-1 text-center break-words" style={sloganStyle}>
                  {logoConfig.slogan}
                </span>
              )}
            </div>
            {logoConfig.icon && (
              <logoConfig.icon.component size={28} color={iconColor} className="flex-shrink-0" />
            )}
          </div>
        ) : (
          // icon-top
          <div className="flex flex-col items-center justify-center text-center">
            {logoConfig.icon && (
              <logoConfig.icon.component size={28} color={iconColor} className="flex-shrink-0 mb-2" />
            )}
            <div className="flex flex-col items-center">
              <span className="text-center break-words" style={brandNameStyle}>
                {logoConfig.text}
              </span>
              {logoConfig.slogan && (
                <span className="opacity-80 mt-1 text-center break-words" style={sloganStyle}>
                  {logoConfig.slogan}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper function to render logo content based on layout type
  const renderLogoContent = (textColor: string, backgroundColor: string, font: any, logoConfig: LogoConfig) => {
    const isCircleLayout = logoConfig.layout?.type === 'enclosed';
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
          <div className="relative z-10 flex items-center justify-center w-full h-full px-8">
            {/* Use the same arrangement logic as standard layouts but within circle */}
            {logoConfig.layout?.arrangement === 'text-left' ? (
              <div className="flex items-center justify-center gap-2 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-center break-words text-sm" style={{ 
                    fontSize: `${parseFloat(dynamicFontSize) * 0.8}rem`,
                    fontFamily: font.cssName,
                    fontWeight: logoConfig.fontWeight || font.generationWeights[0],
                    color: textColor
                  }}>
                    {logoConfig.text}
                  </span>
                  {logoConfig.slogan && (
                    <span className="text-xs font-normal opacity-80 mt-1 text-center break-words" style={{ 
                      fontWeight: 300,
                      color: textColor
                    }}>
                      {logoConfig.slogan}
                    </span>
                  )}
                </div>
                {logoConfig.icon && (
                  <logoConfig.icon.component size={24} color={textColor} className="flex-shrink-0" />
                )}
              </div>
            ) : logoConfig.layout?.arrangement === 'icon-left' ? (
              <div className="flex items-center justify-center gap-2 text-center">
                {logoConfig.icon && (
                  <logoConfig.icon.component size={24} color={textColor} className="flex-shrink-0" />
                )}
                <div className="flex flex-col items-center">
                  <span className="text-center break-words text-sm" style={{ 
                    fontSize: `${parseFloat(dynamicFontSize) * 0.8}rem`,
                    fontFamily: font.cssName,
                    fontWeight: logoConfig.fontWeight || font.generationWeights[0],
                    color: textColor
                  }}>
                    {logoConfig.text}
                  </span>
                  {logoConfig.slogan && (
                    <span className="text-xs font-normal opacity-80 mt-1 text-center break-words" style={{ 
                      fontWeight: 300,
                      color: textColor
                    }}>
                      {logoConfig.slogan}
                    </span>
                  )}
                </div>
              </div>
            ) : logoConfig.layout?.arrangement === 'text-top' ? (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center mb-1">
                  <span className="text-center break-words text-sm" style={{ 
                    fontSize: `${parseFloat(dynamicFontSize) * 0.8}rem`,
                    fontFamily: font.cssName,
                    fontWeight: logoConfig.fontWeight || font.generationWeights[0],
                    color: textColor
                  }}>
                    {logoConfig.text}
                  </span>
                  {logoConfig.slogan && (
                    <span className="text-xs font-normal opacity-80 mt-1 text-center break-words" style={{ 
                      fontWeight: 300,
                      color: textColor
                    }}>
                      {logoConfig.slogan}
                    </span>
                  )}
                </div>
                {logoConfig.icon && (
                  <logoConfig.icon.component size={24} color={textColor} />
                )}
              </div>
            ) : (
              // Default: icon-top
              <div className="flex flex-col items-center justify-center text-center">
                {logoConfig.icon && (
                  <logoConfig.icon.component size={24} color={textColor} className="mb-1" />
                )}
                <div className="flex flex-col items-center">
                  <span className="text-center break-words text-sm" style={{ 
                    fontSize: `${parseFloat(dynamicFontSize) * 0.8}rem`,
                    fontFamily: font.cssName,
                    fontWeight: logoConfig.fontWeight || font.generationWeights[0],
                    color: textColor
                  }}>
                    {logoConfig.text}
                  </span>
                  {logoConfig.slogan && (
                    <span className="text-xs font-normal opacity-80 mt-1 text-center break-words" style={{ 
                      fontWeight: 300,
                      color: textColor
                    }}>
                      {logoConfig.slogan}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Standard layout: check arrangement type
      const isHorizontalLayout = logoConfig.layout?.arrangement === 'icon-left' || logoConfig.layout?.arrangement === 'text-left';
      
      if (isHorizontalLayout) {
        // Horizontal layout: different arrangements
        const isTextFirst = logoConfig.layout?.arrangement === 'text-left';
        
        return (
          <div className="flex items-center justify-center gap-4">
            {/* Text first (text-left) or Icon first (icon-left) */}
            {isTextFirst ? (
              <>
                <div className="flex flex-col items-center text-center justify-center">
                  <span className="text-center break-words" style={{ 
                    fontSize: dynamicFontSize,
                    fontFamily: font.cssName,
                    fontWeight: config.fontWeight || font.generationWeights[0],
                    color: textColor
                  }}>
                    {logoConfig.text}
                  </span>
                  {logoConfig.slogan && (
                    <span className="text-base font-normal opacity-80 mt-1 text-center break-words" style={{ 
                      fontWeight: 300,
                      color: textColor
                    }}>
                      {logoConfig.slogan}
                    </span>
                  )}
                </div>
                {logoConfig.icon && (
                  <logoConfig.icon.component size={48} color={textColor} className="flex-shrink-0" />
                )}
              </>
            ) : (
              <>
                {logoConfig.icon && (
                  <logoConfig.icon.component size={48} color={textColor} className="flex-shrink-0" />
                )}
                <div className="flex flex-col items-center text-center justify-center">
                  <span className="text-center break-words" style={{ 
                    fontSize: dynamicFontSize,
                    fontFamily: font.cssName,
                    fontWeight: config.fontWeight || font.generationWeights[0],
                    color: textColor
                  }}>
                    {logoConfig.text}
                  </span>
                  {logoConfig.slogan && (
                    <span className="text-base font-normal opacity-80 mt-1 text-center break-words" style={{ 
                      fontWeight: 300,
                      color: textColor
                    }}>
                      {logoConfig.slogan}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        );
      } else {
        // Vertical layout: icon top or text top
        const isTextTop = logoConfig.layout?.arrangement === 'text-top';
        
        if (isTextTop) {
          // Text oben, Icon unten - "Text + Icon (vertikal)"
          return (
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center text-center w-full px-4 mb-2">
                <span className="text-center break-words" style={{ 
                  fontSize: dynamicFontSize,
                  fontFamily: font.cssName,
                  fontWeight: logoConfig.fontWeight || font.generationWeights[0],
                  color: textColor
                }}>
                  {logoConfig.text}
                </span>
                {logoConfig.slogan && (
                  <span className="text-base font-normal opacity-80 mt-1 text-center break-words" style={{ 
                    fontWeight: 300,
                    color: textColor
                  }}>
                    {logoConfig.slogan}
                  </span>
                )}
              </div>
              {logoConfig.icon && (
                <logoConfig.icon.component size={48} color={textColor} />
              )}
            </div>
          );
        } else {
          // Icon oben, Text unten - "Icon + Text (vertikal)"
          return (
            <div className="flex flex-col items-center">
              {logoConfig.icon && (
                <logoConfig.icon.component size={48} color={textColor} className="mb-2" />
              )}
              <div className="flex flex-col items-center text-center w-full px-4">
                <span className="text-center break-words" style={{ 
                  fontSize: dynamicFontSize,
                  fontFamily: font.cssName,
                  fontWeight: logoConfig.fontWeight || font.generationWeights[0],
                  color: textColor
                }}>
                  {logoConfig.text}
                </span>
                {logoConfig.slogan && (
                  <span className="text-base font-normal opacity-80 mt-1 text-center break-words" style={{ 
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

  // Show advanced editor as full-screen modal if enabled
  if (showAdvancedEditor) {
    return (
      <>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-white">Generated Logos: {selectedFontCategory} Category</h3>
            <button
              onClick={() => setShowAdvancedEditor(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Advanced Editor
            </button>
          </div>

          {/* Show variations with font switchers */}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
            {logoVariations.map((variation, variationIndex) => {
              const currentFont = getCurrentFont(variation.id);
              const logoConfigKey = `${currentFont.name}-${variation.id}`;

              return (
                <div key={variation.id} className="flex flex-col">
                  <h5 className="font-medium mb-2 text-white text-sm h-10 flex items-center">{variation.name}</h5>
                  <div
                    className="border border-white/20 rounded-lg group relative w-full flex-1"
                    style={{
                      ...(variation.backgroundColor.includes('linear-gradient')
                        ? { backgroundImage: variation.backgroundColor }
                        : { backgroundColor: variation.backgroundColor })
                    }}
                  >
                    <div
                      key={`${currentFont.name}-${variation.id}-${getLogoConfig(logoConfigKey).fontWeight || 400}-${getLogoConfig(logoConfigKey).text || 'default'}`}
                      id={`logo-${currentFont.name.replace(/\s+/g, '-')}-${variation.id}-${variationIndex}`}
                      className="text-4xl text-center p-6 rounded flex items-center justify-center gap-2 w-full min-h-[140px]"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'visible',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div className="flex items-center justify-center w-full" style={{ overflow: 'visible' }}>
                        {renderLogoVariation(variation, currentFont, getLogoConfig(logoConfigKey))}
                      </div>
                    </div>
                    <LogoEditor
                      config={{
                        ...getLogoConfig(logoConfigKey),
                        font: currentFont,
                        fontWeight: currentFont.generationWeights[0] || 400,
                      }}
                      variation={variation}
                      onConfigUpdate={(newConfig) => updateLogoConfig(logoConfigKey, newConfig)}
                      availableIcons={availableIcons}
                      availablePalettes={availablePalettes}
                    />
                  </div>

                  {/* Font Switcher */}
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <button
                      onClick={() => switchFont(variation.id, 'prev')}
                      className="flex items-center justify-center w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                      disabled={fontsToDisplay.length <= 1}
                    >
                      <span className="text-sm">‹</span>
                    </button>
                    <div className="text-center min-w-[120px]">
                      <div className="text-white text-xs font-medium">{currentFont.name}</div>
                      <div className="text-white/60 text-xs">
                        {(currentFontIndex[variation.id] || 0) + 1} / {fontsToDisplay.length}
                      </div>
                    </div>
                    <button
                      onClick={() => switchFont(variation.id, 'next')}
                      className="flex items-center justify-center w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                      disabled={fontsToDisplay.length <= 1}
                    >
                      <span className="text-sm">›</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full-screen Advanced Editor Modal */}
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
          <div className="h-full w-full">
            <AdvancedLogoEditor
              config={config}
              onConfigUpdate={(newConfig) => {
                // Update the main config when changes are made in advanced editor
                console.log('Advanced editor config update:', newConfig);
              }}
              onExport={(svg, format) => {
                console.log(`Exported ${format}:`, svg.substring(0, 100) + '...');
              }}
            />
            {/* Close button */}
            <button
              onClick={() => setShowAdvancedEditor(false)}
              className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700 text-white rounded-lg transition-colors backdrop-blur-sm"
            >
              <Eye className="w-4 h-4" />
              Back to Preview
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl text-white">Generated Logos: {selectedFontCategory} Category</h3>
        <button
          onClick={() => setShowAdvancedEditor(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Advanced Editor
        </button>
      </div>
      
      {/* Show variations with font switchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
        {logoVariations.map((variation, variationIndex) => {
          const currentFont = getCurrentFont(variation.id);
          const logoConfigKey = `${currentFont.name}-${variation.id}`;

          return (
            <div key={variation.id} className="flex flex-col">
              <h5 className="font-medium mb-2 text-white text-sm h-10 flex items-center">{variation.name}</h5>
              <div
                className="border border-white/20 rounded-lg group relative w-full flex-1"
                style={{
                  ...(variation.backgroundColor.includes('linear-gradient')
                    ? { backgroundImage: variation.backgroundColor }
                    : { backgroundColor: variation.backgroundColor })
                }}
              >
                <div
                  key={`${currentFont.name}-${variation.id}-${getLogoConfig(logoConfigKey).fontWeight || 400}-${getLogoConfig(logoConfigKey).text || 'default'}`}
                  id={`logo-${currentFont.name.replace(/\s+/g, '-')}-${variation.id}-${variationIndex}`}
                  className="text-4xl text-center p-6 rounded flex items-center justify-center gap-2 w-full min-h-[140px]"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'visible',
                    boxSizing: 'border-box'
                  }}
                >
                  <div className="flex items-center justify-center w-full" style={{ overflow: 'visible' }}>
                    {renderLogoVariation(variation, currentFont, getLogoConfig(logoConfigKey))}
                  </div>
                </div>
                <LogoEditor
                  config={{
                    ...getLogoConfig(logoConfigKey),
                    font: currentFont,
                    fontWeight: currentFont.generationWeights[0] || 400,
                  }}
                  variation={variation}
                  onConfigUpdate={(newConfig) => updateLogoConfig(logoConfigKey, newConfig)}
                  availableIcons={availableIcons}
                  availablePalettes={availablePalettes}
                />
              </div>

              {/* Font Switcher */}
              <div className="flex items-center justify-center gap-3 mt-2">
                <button
                  onClick={() => switchFont(variation.id, 'prev')}
                  className="flex items-center justify-center w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  disabled={fontsToDisplay.length <= 1}
                >
                  <span className="text-sm">‹</span>
                </button>
                <div className="text-center min-w-[120px]">
                  <div className="text-white text-xs font-medium">{currentFont.name}</div>
                  <div className="text-white/60 text-xs">
                    {(currentFontIndex[variation.id] || 0) + 1} / {fontsToDisplay.length}
                  </div>
                </div>
                <button
                  onClick={() => switchFont(variation.id, 'next')}
                  className="flex items-center justify-center w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  disabled={fontsToDisplay.length <= 1}
                >
                  <span className="text-sm">›</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default LogoPreview;