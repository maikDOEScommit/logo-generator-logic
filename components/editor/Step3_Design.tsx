import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LogoConfig, IconData, FontData, LayoutData, PaletteData } from '@/lib/types';
import Section from '@/components/ui/Section';
import SelectionCard from '@/components/ui/SelectionCard';
import { layouts, fontCategories, personalities } from '@/lib/data';
import { Circle } from 'lucide-react';
import { ColorOption } from '@/lib/colorLogic';

const LayoutSelectionCard = ({ layout, isSelected, onClick }: { layout: LayoutData, isSelected: boolean, onClick: () => void }) => (
  <SelectionCard isSelected={isSelected} onClick={onClick}>
    <div className="flex flex-col items-center justify-center gap-2 text-xs">
      {layout.type === 'enclosed' ? (
        // Kreis-Layouts: Zeige die Anordnung innerhalb eines Kreises
        <div className="relative">
          <Circle size={32} className="text-white/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            {layout.arrangement === 'icon-top' ? 
              <div className="space-y-0.5 scale-50"><div className="w-2 h-2 bg-white/70 rounded-sm mx-auto"></div><div className="w-4 h-1 bg-white/70 rounded-sm"></div></div> : 
            layout.arrangement === 'text-top' ? 
              <div className="space-y-0.5 scale-50"><div className="w-4 h-1 bg-white/70 rounded-sm"></div><div className="w-2 h-2 bg-white/70 rounded-sm mx-auto"></div></div> : 
            layout.arrangement === 'icon-left' ?
              <div className="flex gap-0.5 items-center scale-50"><div className="w-2 h-2 bg-white/70 rounded-sm"></div><div className="w-4 h-1 bg-white/70 rounded-sm"></div></div> :
            layout.arrangement === 'text-left' ?
              <div className="flex gap-0.5 items-center scale-50"><div className="w-4 h-1 bg-white/70 rounded-sm"></div><div className="w-2 h-2 bg-white/70 rounded-sm"></div></div> :
              <div className="flex gap-0.5 items-center scale-50"><div className="w-2 h-2 bg-white/70 rounded-sm"></div><div className="w-4 h-1 bg-white/70 rounded-sm"></div></div>
            }
          </div>
        </div>
      ) : (
        // Standard-Layouts: Zeige die Anordnung ohne Umrandung
        layout.arrangement === 'icon-top' ? 
          <div className="space-y-1"><div className="w-4 h-4 bg-white/50 rounded-sm mx-auto"></div><div className="w-8 h-2 bg-white/50 rounded-sm"></div></div> : 
        layout.arrangement === 'text-top' ? 
          <div className="space-y-1"><div className="w-8 h-2 bg-white/50 rounded-sm"></div><div className="w-4 h-4 bg-white/50 rounded-sm mx-auto"></div></div> : 
        layout.arrangement === 'icon-left' ?
          <div className="flex gap-1 items-center"><div className="w-4 h-4 bg-white/50 rounded-sm"></div><div className="w-8 h-2 bg-white/50 rounded-sm"></div></div> :
        layout.arrangement === 'text-left' ?
          <div className="flex gap-1 items-center"><div className="w-8 h-2 bg-white/50 rounded-sm"></div><div className="w-4 h-4 bg-white/50 rounded-sm"></div></div> :
          <div className="flex gap-1 items-center"><div className="w-4 h-4 bg-white/50 rounded-sm"></div><div className="w-8 h-2 bg-white/50 rounded-sm"></div></div>
      )}
      <p className="mt-1 text-center text-xs">{layout.name}</p>
    </div>
  </SelectionCard>
);

interface Props {
  config: LogoConfig;
  updateConfig: (newConfig: Partial<LogoConfig>) => void;
  suggestions: {
    suggestedIcons: IconData[];
    suggestedEnclosingShapes: IconData[];
    suggestedFonts: FontData[];
    suggestedPalettes: PaletteData[];
  };
  selectedFontCategory: string | null;
  setSelectedFontCategory: (category: string | null) => void;
  selectedPersonalities: string[];
  onTogglePersonality: (id: string) => void;
  onLogoCreate?: () => void;
  onDesignProgress?: (progressKey: string) => void;
}

const Step3_Design = ({ config, updateConfig, suggestions, selectedFontCategory, setSelectedFontCategory, selectedPersonalities, onTogglePersonality, onLogoCreate, onDesignProgress }: Props) => {
  const { suggestedIcons, suggestedEnclosingShapes, suggestedPalettes } = suggestions;
  const [selectedLayoutType, setSelectedLayoutType] = useState<string | null>(null);
  const [wantsIcon, setWantsIcon] = useState<boolean | null>(null);
  const [neonMode, setNeonMode] = useState<boolean>(false);
  const [selectedColorCombo, setSelectedColorCombo] = useState<string | null>(null);
  const [visibleIconCount, setVisibleIconCount] = useState<number>(24);
  const [selectedBaseColor, setSelectedBaseColor] = useState<string | null>(null);
  const [selectedColorOption, setSelectedColorOption] = useState<ColorOption | null>(null);
  
  // Reset color combination selection when palette changes to a base color
  useEffect(() => {
    if (config.palette && (config.palette.tags?.includes('intense') || config.palette.tags?.includes('neon')) && !config.palette.tags?.includes('combo')) {
      setSelectedColorCombo(null);
    }
  }, [config.palette?.id]);
  
  // Use enclosing shapes directly from suggestionEngine (Single Source of Truth)
  // These are already the fixed 16 enclosing shapes defined in suggestionEngine.ts
  const enclosingShapes = suggestedEnclosingShapes;
  
  // Use icons directly from suggestionEngine (Single Source of Truth)
  // These are already the fixed 24 icons defined in suggestionEngine.ts
  const regularIcons = suggestedIcons;

  // Filter colors based on neon mode
  const getDisplayedColors = () => {
    if (neonMode) {
      // Show only neon colors (14 bright neon versions)
      return suggestedPalettes.filter(palette => palette.tags?.includes('neon'));
    } else {
      // Show only intensive colors (original 14 base colors)
      return suggestedPalettes.filter(palette => palette.tags?.includes('intense') && !palette.tags?.includes('neon'));
    }
  };

  // Neue Funktion: Ausführung der Grundfarben-Auswahl
  const handleBaseColorSelection = (baseColor: string) => {
    setSelectedBaseColor(baseColor);
    // Clear any existing palette to show selection options
    updateConfig({ palette: null });
    console.log('🎨 Grundfarbe ausgewählt:', baseColor);
  };

  // Neue Funktion: Option-Änderung
  const handleColorOptionChange = (option: ColorOption) => {
    setSelectedColorOption(option);
    if (selectedBaseColor) {
      // Direkt eine Palette basierend auf der ColorLogic setzen, keine Variationen-Auswahl
      let palette: PaletteData;
      
      switch (option) {
        case 'color-only':
          palette = {
            id: `${selectedBaseColor.replace('#', '')}-only`,
            name: `Nur ${selectedBaseColor}`,
            colors: [selectedBaseColor] as [string, string, string],
            tags: ['generated', 'smart-color', 'final']
          };
          break;
        case 'add-white':
          palette = {
            id: `${selectedBaseColor.replace('#', '')}-white`,
            name: `${selectedBaseColor} + Weiß`,
            colors: [selectedBaseColor, '#FFFFFF'] as [string, string, string],
            tags: ['generated', 'smart-color', 'final']
          };
          break;
        case 'add-black':
          palette = {
            id: `${selectedBaseColor.replace('#', '')}-black`,
            name: `${selectedBaseColor} + Schwarz`,
            colors: [selectedBaseColor, '#000000'] as [string, string, string],
            tags: ['generated', 'smart-color', 'final']
          };
          break;
        default:
          return;
      }
      
      updateConfig({ palette });
      
      // Trigger background progression when colors are selected
      if (onDesignProgress) {
        onDesignProgress('colors-selected');
      }
      
      // Auto-scroll to Create Logo button
      setTimeout(() => {
        const createButton = document.querySelector('[data-create-logo]');
        if (createButton) {
          createButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      
      console.log('🎯 Finale Palette gesetzt:', palette);
    }
  };

  return (
    <motion.div key="step3" className="space-y-12 animate-fade-in">
      {/* Icon Decision Section - Always visible first */}
      {wantsIcon === null && (
        <div className="h-screen flex items-center justify-center -mt-36">
          <div className="w-full max-w-2xl text-center">
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-8 text-white">Do you want an icon for your logo?</h2>
              <div className="flex w-full justify-between gap-4 mb-6">
                <button 
                  onClick={() => {
                    setWantsIcon(true);
                  }}
                  className="flex-1 bg-black text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-black/25 active:scale-95"
                >
                  Yes, show me icons
                </button>
                <button 
                  onClick={() => {
                    setWantsIcon(false);
                    updateConfig({ icon: null });
                    // Scroll to typography section after decision
                    setTimeout(() => {
                      const element = document.querySelector('[data-section="typography"]');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  No, text only
                </button>
              </div>
              <div className="text-xs text-white/60">Rule 2: Memorability - Simple symbols are remembered better</div>
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Icon Selection Section - Only shown when user wants icons */}
      {wantsIcon === true && (
        <div className="min-h-screen flex items-start justify-center py-8 pt-4">
          <div className="w-full max-w-2xl">
            <Section title="Choose a Symbol" helpText="Rule 2: Memorability - Simple symbols are remembered better">
              <div className="col-span-full space-y-4">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => {
                      setWantsIcon(null);
                      // Scroll back to top
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-2"
                  >
                    ← Back to decision
                  </button>
                  <button 
                    onClick={() => {
                      // Continue without selecting an icon
                      setTimeout(() => {
                        const element = document.querySelector('[data-section="typography"]');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className="text-white/60 hover:text-white text-sm"
                  >
                    Continue without icon →
                  </button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {regularIcons.slice(0, visibleIconCount).map(icon => (
                    <SelectionCard 
                      key={icon.id} 
                      isSelected={config.icon?.id === icon.id} 
                      onClick={() => {
                        updateConfig({ icon });
                        // Trigger background progression when icon is selected
                        if (onDesignProgress) {
                          onDesignProgress('icon-selected');
                        }
                        // Auto-scroll to typography after selecting an icon
                        setTimeout(() => {
                          const element = document.querySelector('[data-section="typography"]');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                      }}
                    >
                      <icon.component className="w-12 h-12 mx-auto" color={config.palette ? config.palette.colors[1] : 'white'} />
                    </SelectionCard>
                  ))}
                </div>
                
                {/* Show More/Less Buttons */}
                {regularIcons.length > visibleIconCount && (
                  <div className="mt-4 text-center space-y-2">
                    <button
                      onClick={() => setVisibleIconCount(prev => Math.min(prev + 24, regularIcons.length))}
                      className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 mx-auto bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/20"
                    >
                      Show Next 24 Icons
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {visibleIconCount > 24 && (
                      <button
                        onClick={() => setVisibleIconCount(24)}
                        className="text-white/60 hover:text-white text-xs font-medium transition-colors flex items-center gap-2 mx-auto"
                      >
                        <svg className="w-3 h-3 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Reset to first 24
                      </button>
                    )}
                    <div className="text-xs text-white/40">
                      Showing {visibleIconCount} of {regularIcons.length} icons
                    </div>
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* All remaining sections - Only shown after icon decision is made */}
      {wantsIcon !== null && (
        <>
          <div data-section="typography" className="h-screen flex items-center justify-center -mt-36">
            <div className="w-full max-w-2xl text-center">
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h2 className="text-xl font-bold mb-8 text-white">Choose your Typography Style</h2>
                <div className="space-y-4 mb-6">
                  {fontCategories.map((category) => (
                    <div key={category.name} className="flex items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className={`glowing-typography-container ${selectedFontCategory === category.name ? 'selected' : ''}`}>
                          <button
                            className="glowing-typography-btn"
                            onClick={() => {
                              setSelectedFontCategory(category.name);
                              // Trigger background progression
                              if (onDesignProgress) {
                                onDesignProgress('typography-selected');
                              }
                              // Auto-scroll to layout section after selection
                              setTimeout(() => {
                                const element = document.querySelector('[data-section="layout"]');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }, 100);
                            }}
                          >
                            <span className="glowing-txt">
                              {category.name.split('').map((letter, index) => (
                                <span key={index} className={index === 1 ? 'faulty-letter' : ''}>{letter}</span>
                              ))}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white/80">
                          <div className="text-sm leading-relaxed mb-2">
                            {category.name === 'Modern' && 'Clean, minimalist fonts perfect for tech companies and contemporary brands. Highly readable across all devices.'}
                            {category.name === 'Elegant' && 'Sophisticated script fonts that convey luxury and refinement. Ideal for premium brands and creative agencies.'}
                            {category.name === 'Bold' && 'Strong, impactful fonts that demand attention. Perfect for sports brands, events, and dynamic companies.'}
                            {category.name === 'Heritage' && 'Classic serif fonts with timeless appeal. Excellent for traditional businesses, education, and established brands.'}
                          </div>
                          <div className="text-xs text-white/50 space-y-1">
                            {category.fonts.slice(0, 3).map(font => (
                              <span key={font.name} className="inline-block mr-3" style={{ fontFamily: font.cssName }}>
                                {font.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-white/60">Rule 3: Timelessness - Classic fonts outlast trends</div>
              </motion.div>
            </div>
          </div>

          <div data-section="layout" className="h-screen flex items-center justify-center -mt-36">
            <div className="w-full max-w-2xl text-center">
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h2 className="text-xl font-bold mb-8 text-white">Choose a Layout</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {layouts.map(layout => (
                    <LayoutSelectionCard 
                      key={layout.id} 
                      layout={layout} 
                      isSelected={selectedLayoutType === layout.id} 
                      onClick={() => {
                        setSelectedLayoutType(layout.id);
                        // Trigger background progression when layout is selected
                        if (onDesignProgress) {
                          onDesignProgress('layout-selected');
                        }
                        if (layout.type !== 'enclosed') {
                          // For non-circle layouts, set immediately and scroll to color section
                          updateConfig({ layout });
                          setTimeout(() => {
                            const element = document.querySelector('[data-section="color"]');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 100);
                        }
                        // For circle layouts, keep them in the layout selection state to show enclosing shapes
                      }} 
                    />
                  ))}
                </div>
                
                {/* Show enclosing shapes when any circle layout is selected */}
                {selectedLayoutType && layouts.find(l => l.id === selectedLayoutType)?.type === 'enclosed' && (
                  <div className="mt-6 mb-6">
                    <h3 className="text-lg font-bold mb-3 text-white">Wähle die Form für die Umrandung:</h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {enclosingShapes.map(shape => (
                        <SelectionCard 
                          key={shape.id} 
                          isSelected={config.enclosingShape?.id === shape.id} 
                          onClick={() => {
                            const selectedLayout = layouts.find(l => l.id === selectedLayoutType);
                            updateConfig({ enclosingShape: shape, layout: selectedLayout });
                            // Auto-scroll to color section after shape selection
                            setTimeout(() => {
                              const element = document.querySelector('[data-section="color"]');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          }}
                        >
                          <div className="flex flex-col items-center gap-2 p-2">
                            <shape.component size={24} color="white" />
                            <span className="text-xs text-center">{shape.id}</span>
                          </div>
                        </SelectionCard>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-white/60">Rule 4: Scalability - Standard layouts work at any size</div>
              </motion.div>
            </div>
          </div>

          <div data-section="color" className="min-h-screen flex items-center justify-center py-20">
            <div className="w-full max-w-2xl">
              <Section title="Choose a Color Palette" helpText="Rule 9: Smart Color Choice - Colors convey emotions and brand values">
        {/* Brand Personality Selection */}
        <div className="col-span-full mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <label className="block text-lg font-bold mb-3 text-white">Brand Personality (max. 2)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {personalities.map(p => (
              <div
                key={p.id}
                className={`brand-personality-container ${
                  selectedPersonalities.includes(p.id) ? 'selected' : ''
                }`}
              >
                <button
                  onClick={() => onTogglePersonality(p.id)}
                  className="brand-personality-btn"
                >
                  {p.name}
                </button>
              </div>
            ))}
          </div>
          <div className="text-xs text-white/50">
            Rule 6: Relevance - These traits influence color palette suggestions
          </div>
        </div>
        
        {/* Regular Color Palettes (non-intense) - Clickable to switch from base color mode */}
        {suggestedPalettes.filter(palette => !palette.tags?.includes('intense')).map(palette => (
          <SelectionCard 
            key={palette.id} 
            isSelected={config.palette?.id === palette.id && !selectedBaseColor} 
            onClick={() => {
              setSelectedBaseColor(null); // Clear base color when palette is selected
              updateConfig({ palette });
              // Trigger background progression when colors are selected
              if (onDesignProgress) {
                onDesignProgress('colors-selected');
              }
              // Auto-scroll to Create Logo button
              setTimeout(() => {
                const createButton = document.querySelector('[data-create-logo]');
                if (createButton) {
                  createButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 300);
            }}>
            <div className={`flex flex-col items-center gap-2 h-full transition-opacity ${selectedBaseColor ? 'opacity-80' : 'opacity-100'}`}>
              <div className="flex gap-1 w-full h-12">
                {palette.colors.map(c => <div key={c} style={{backgroundColor: c}} className="flex-1 h-full rounded"></div>)}
              </div>
              <span className="text-xs text-center text-white/80 px-2">{palette.name}</span>
            </div>
          </SelectionCard>
        ))}
        
        {/* Solid Color Bar - 14 intensive colors in horizontal layout */}
        <div className="col-span-full mt-6">
          <div className="flex items-center justify-between mb-3">
            <div></div>
            <button
              onClick={() => setNeonMode(!neonMode)}
              className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
                neonMode 
                  ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-black shadow-lg shadow-pink-500/50 animate-pulse' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
              }`}
            >
              {neonMode ? '✨ NEON!' : 'Neon!'}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-3 mb-4">
            {getDisplayedColors().map(palette => (
              <button
                key={palette.id}
                onClick={() => {
                  // Clear regular palette selection when base color is selected
                  updateConfig({ palette: null });
                  handleBaseColorSelection(palette.colors[0]);
                }}
                className={`relative group h-16 rounded-xl border-3 transition-all duration-300 transform hover:scale-110 ${
                  selectedBaseColor === palette.colors[0] 
                    ? `border-white shadow-2xl scale-110 ${neonMode ? 'shadow-white/70 animate-pulse' : 'shadow-white/30'}` 
                    : 'border-white/30 hover:border-white/60'
                } ${neonMode ? 'hover:shadow-glow' : ''}`}
                style={{
                  backgroundColor: palette.colors[0],
                  boxShadow: neonMode ? `0 0 30px ${palette.colors[0]}60, inset 0 0 20px rgba(255,255,255,0.1)` : 'inset 0 0 20px rgba(255,255,255,0.1)',
                  background: neonMode 
                    ? `linear-gradient(135deg, ${palette.colors[0]} 0%, ${palette.colors[0]}CC 50%, ${palette.colors[0]} 100%)`
                    : `linear-gradient(135deg, ${palette.colors[0]} 0%, ${palette.colors[0]}DD 100%)`
                }}
                title={palette.name}
              >
                {/* Modern glass effect overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                
                {/* Selection indicator */}
                {selectedBaseColor === palette.colors[0] && (
                  <div className="absolute inset-0 rounded-xl border-2 border-white/80 bg-white/10 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
                  </div>
                )}
                
                
                {/* Mode switch indicator overlay when regular palette is active */}
                {config.palette && !selectedBaseColor && (
                  <div className="absolute inset-0 rounded-xl bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Zu Grundfarbe</span>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          
          {/* Intelligente Farbkombinations-Optionen - Nur zeigen wenn eine Grundfarbe gewählt wurde */}
          {selectedBaseColor && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-bold text-white mb-3">Zusatzfarbe wählen (optional):</h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleColorOptionChange('color-only')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedColorOption === 'color-only' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-4 rounded-sm" style={{ backgroundColor: selectedBaseColor }}></div>
                    <span>Nur Grundfarbe</span>
                    <span className="text-xs opacity-75">(ohne Zusatz)</span>
                  </div>
                </button>
                <button
                  onClick={() => handleColorOptionChange('add-white')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedColorOption === 'add-white' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-3 h-4 rounded-sm" style={{ backgroundColor: selectedBaseColor }}></div>
                      <div className="w-3 h-4 rounded-sm bg-white"></div>
                    </div>
                    <span>+ Weiß</span>
                    <span className="text-xs opacity-75">(2 Varianten)</span>
                  </div>
                </button>
                <button
                  onClick={() => handleColorOptionChange('add-black')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedColorOption === 'add-black' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-3 h-4 rounded-sm" style={{ backgroundColor: selectedBaseColor }}></div>
                      <div className="w-3 h-4 rounded-sm bg-black"></div>
                    </div>
                    <span>+ Schwarz</span>
                    <span className="text-xs opacity-75">(2 Varianten)</span>
                  </div>
                </button>
              </div>
            </div>
          )}

                </div>
              </Section>
            </div>
          </div>

          {/* Create Button */}
          <div className="flex justify-center pt-8">
            <button
              data-create-logo
              onClick={() => {
                // This will trigger the preview to show properly
                updateConfig({});
                // Trigger text animation if callback provided
                if (onLogoCreate) onLogoCreate();
              }}
              disabled={!config.layout || !config.palette || (config.layout?.type === 'enclosed' && !config.enclosingShape)}
              className="w-full bg-black text-white font-bold py-2.5 px-6 rounded-xl shadow-xl shadow-black/30 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-black/40 hover:rotate-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group border border-white/20"
            >
              <span className="relative z-10">Create Logo</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%] group-hover:transition-transform group-hover:duration-700"></div>
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};
export default Step3_Design;