// --- app/page.tsx ---
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogoStore } from '@/lib/state';
import { getInitialSuggestions } from '@/lib/suggestionEngine';
import { LogoConfig } from '@/lib/types';
import { Undo2, Redo2 } from 'lucide-react';

// Import newly created components
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Typewriter } from '@/components/ui/Typewriter';
import Step1_Industry from '@/components/editor/Step1_Industry';
import Step2_Branding from '@/components/editor/Step2_Branding';
import Step3_Design from '@/components/editor/Step3_Design';
import LogoPreview from '@/components/preview/LogoPreview';
import MockupPreview from '@/components/preview/MockupPreview';
import { fontCategories } from '@/lib/data';


// === MAIN PAGE COMPONENT ===
export default function LogoGeneratorPage() {
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState<string | null>(null);
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);
  const [previewTab, setPreviewTab] = useState<'preview' | 'mockups'>('preview');
  const [visibleSections, setVisibleSections] = useState<(number | string)[]>([0]); // Start with hero section visible
  const [showPreviewPanel, setShowPreviewPanel] = useState(false); // Control preview panel visibility
  const [showStartedText, setShowStartedText] = useState(false); // Control "Let's get started" text visibility
  const [hideStartedText, setHideStartedText] = useState(false); // Control hiding "Let's get started" text
  const [selectedFontCategory, setSelectedFontCategory] = useState<string | null>(null);
  
  // New states for enhanced UX animations
  const [showTopBorder, setShowTopBorder] = useState(false); // Control horizontal border-top animation
  const [showLeftBorder, setShowLeftBorder] = useState(false); // Control vertical border-left animation
  const [showFinalBorder, setShowFinalBorder] = useState(false); // Control final border animation after Create Logo
  
  // New states for text animations
  const [exitStartedText, setExitStartedText] = useState(false); // Control exit animation for "Let's get started"
  const [showSecondText, setShowSecondText] = useState(false); // Control "just 50 seconds away" text
  const [exitSecondText, setExitSecondText] = useState(false); // Control exit animation for second text
  const [showThirdText, setShowThirdText] = useState(false); // Control "hold on, we're right there!" text
  const [exitThirdText, setExitThirdText] = useState(false); // Control exit animation for third text
  const [showLoadingScreen, setShowLoadingScreen] = useState(false); // Control loading screen visibility
  const [exitHeroSection, setExitHeroSection] = useState(false); // Control hero section exit animation
  const [showLogoPreview, setShowLogoPreview] = useState(false); // Control when to show logo preview after Create Logo click
  const [expandPreviewPanel, setExpandPreviewPanel] = useState(false); // Control full-width expansion of preview panel
  const [morphFromPosition, setMorphFromPosition] = useState({ top: 80, right: 0, width: '50vw', height: 'calc(100vh - 80px)' }); // Store current position for morph

  // Logo configuration state
  const [config, setConfig] = useState<LogoConfig>({ 
    text: '', 
    icon: null, 
    font: null, 
    layout: null, 
    palette: null, 
    slogan: '', 
    enclosingShape: null 
  });

  const updateConfig = (newConfig: Partial<LogoConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleUndo = () => {
    // Undo functionality can be added later to Zustand store
  };

  const handleRedo = () => {
    // Redo functionality can be added later to Zustand store
  };

  const handlePersonalityToggle = (id: string) => {
    const newSelection = selectedPersonalities.includes(id)
      ? selectedPersonalities.filter(p => p !== id)
      : [...selectedPersonalities, id].slice(0, 2);
    setSelectedPersonalities(newSelection);
  };

  // Get suggestions based on industry and personalities
  const suggestions = useMemo(() => {
    // Always provide suggestions, fallback to 'tech' if no industry selected
    return getInitialSuggestions(industry || 'tech', selectedPersonalities);
  }, [industry, selectedPersonalities]);

  // Update background position based on visible sections
  useEffect(() => {
    const body = document.body;
    // Remove all existing background section classes
    body.classList.remove('bg-section-0', 'bg-section-1', 'bg-section-2', 'bg-section-3', 'bg-section-3-05', 'bg-section-3-1', 'bg-section-3-2', 'bg-section-3-3', 'bg-section-4');
    
    // Get the highest section number (most progressed section)
    // Handle both regular sections (numbers) and subsections (strings like '3-1')
    const maxSection = visibleSections.reduce((max, current) => {
      // Convert both max and current to numeric values for comparison
      const getNumericValue = (section: number | string): number => {
        if (typeof section === 'number') return section;
        if (typeof section === 'string') {
          const parts = section.split('-');
          const majorSection = parseInt(parts[0]);
          const minorSection = parts[1] ? parseFloat(`0.${parts[1]}`) : 0;
          return majorSection + minorSection;
        }
        return 0;
      };
      
      const maxValue = getNumericValue(max);
      const currentValue = getNumericValue(current);
      
      return currentValue > maxValue ? current : max;
    }, 0 as number | string);
    
    // Add the corresponding background class
    body.classList.add(`bg-section-${maxSection}`);
  }, [visibleSections]);

  // Calculate progress based on visible sections (scroll triggers)
  const getProgress = () => {
    // visibleSections starts with [0] (hero), then adds 1, 2, 3, 4 as user scrolls
    // We want: 0% -> 25% -> 50% -> 75% -> 100%
    const sectionCount = visibleSections.length;
    if (sectionCount <= 1) return 0; // Just hero section
    if (sectionCount === 2) return 25; // Hero + Step 1 (Industry)
    if (sectionCount === 3) return 50; // Hero + Step 1 + Step 2 (Branding)  
    if (sectionCount === 4) return 75; // Hero + Step 1 + Step 2 + Step 3 (Design)
    if (sectionCount >= 5) return 100; // All sections including results
    return (sectionCount / 5) * 100;
  };

  const progress = getProgress();
  // Simplified condition: just need industry for the new generation system
  const isLogoConfigComplete = !!industry;

  // Helper function to scroll to a specific section
  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };


  // Handle next button clicks - reveal next section and scroll to it
  const handleSectionNext = (currentSection: number) => {
    // Check if we're on mobile (screen width < 768px)
    const isMobile = window.innerWidth < 768;
    
    // Show preview panel when starting the process
    if (currentSection === 0 && !showPreviewPanel) {
      // Start hero exit animation first
      setExitHeroSection(true);
      
      if (isMobile) {
        // On mobile: Skip preview panel animations, go directly to next section
        setTimeout(() => {
          const nextSection = currentSection + 1;
          if (!visibleSections.includes(nextSection)) {
            setVisibleSections([...visibleSections, nextSection]);
          }
          scrollToSection(`section-${nextSection}`);
        }, 800); // Wait only for hero exit animation
      } else {
        // On desktop: Full animation sequence
        // Start horizontal border-top animation immediately with hero exit
        setTimeout(() => {
          setShowTopBorder(true);
        }, 200); // Start early, almost with hero exit
        
        setTimeout(() => {
          setShowPreviewPanel(true);
          
          // Start vertical border-left animation after horizontal border completes
          setTimeout(() => {
            setShowLeftBorder(true);
            
            // Scroll to next section after all border animations start
            setTimeout(() => {
              const nextSection = currentSection + 1;
              if (!visibleSections.includes(nextSection)) {
                setVisibleSections([...visibleSections, nextSection]);
              }
              scrollToSection(`section-${nextSection}`);
              
              // Show the "Let's get started" text after scrolling + vertical border completes
              setTimeout(() => {
                setShowStartedText(true);
              }, 800); // Faster: Wait for scroll (500ms) + reduced delay for border animation
            }, 100); // Small delay after starting vertical border
          }, 1100); // Wait for border-top animation to complete (1.3s - 200ms start delay)
        }, 800); // Wait for hero exit animation
      }
    } else if (currentSection === 1) {
      // First continue click: animate out "Let's get started" text
      setExitStartedText(true);
      
      setTimeout(() => {
        const nextSection = currentSection + 1;
        if (!visibleSections.includes(nextSection)) {
          setVisibleSections([...visibleSections, nextSection]);
        }
        scrollToSection(`section-${nextSection}`);
        
        // Show second text after scroll
        setTimeout(() => {
          setShowSecondText(true);
        }, 800);
      }, 1000); // Wait for exit animation
    } else if (currentSection === 2) {
      // Second continue click: animate out second text
      setExitSecondText(true);
      
      setTimeout(() => {
        const nextSection = currentSection + 1;
        if (!visibleSections.includes(nextSection)) {
          setVisibleSections([...visibleSections, nextSection]);
        }
        scrollToSection(`section-${nextSection}`);
        
        // Show third text after scroll
        setTimeout(() => {
          setShowThirdText(true);
        }, 800);
      }, 1000); // Wait for exit animation
    } else {
      const nextSection = currentSection + 1;
      if (!visibleSections.includes(nextSection)) {
        setVisibleSections([...visibleSections, nextSection]);
      }
      scrollToSection(`section-${nextSection}`);
    }
  };

  // Handle step navigation within the design process
  const handleStepNavigation = (nextStep: number) => {
    setStep(nextStep);
    if (nextStep === 2 && !visibleSections.includes(2)) {
      setVisibleSections([...visibleSections, 2]);
      scrollToSection('section-2');
    } else if (nextStep === 3 && !visibleSections.includes(3)) {
      setVisibleSections([...visibleSections, 3]);
      scrollToSection('section-3');
    }
  };
  
  // Handle fullscreen expansion animation
  const handleFullscreenExpansion = () => {
    // Step 1: Scroll to bottom of the page
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    });
    
    // Step 2: Calculate current position after scroll and start morph
    setTimeout(() => {
      // Calculate the current visible position of the right panel after scroll
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const headerHeight = 80;
      
      // The right panel is sticky, so it's always at the top of the viewport
      const currentTop = headerHeight;
      const currentHeight = viewportHeight - headerHeight;
      
      setMorphFromPosition({
        top: currentTop,
        right: 0,
        width: '50vw',
        height: `${currentHeight}px`
      });
      
      // Start the morph animation
      setExpandPreviewPanel(true);
    }, 1000); // Wait for scroll to complete
  };

  // Handle design progress - triggered when user progresses through Step3_Design
  const handleDesignProgress = (progressKey: string) => {
    const sectionMap: Record<string, string> = {
      'icon-selected': '3-05',
      'typography-selected': '3-1',
      'layout-selected': '3-2', 
      'colors-selected': '3-3'
    };
    
    const newSection = sectionMap[progressKey];
    if (newSection && !visibleSections.includes(newSection)) {
      setVisibleSections([...visibleSections, newSection]);
    }
  };

  // Handle final logo creation - use new suggestion engine and generate logo
  const handleLogoCreation = () => {
    // Logo creation is now triggered when user has selected all required elements
    // The config state already contains the selected icon, layout, and palette
    console.log('Creating logo with config:', config);
    
    setExitThirdText(true);
    
    setTimeout(() => {
      // Show loading screen after third text exits
      setShowLoadingScreen(true);
      
      setTimeout(() => {
        // Hide loading screen and show results after 3 seconds
        setShowLoadingScreen(false);
        
        // Create the new results section (section 4)
        const nextSection = 4;
        if (!visibleSections.includes(nextSection)) {
          setVisibleSections([...visibleSections, nextSection]);
        }
        
        // Show logo preview
        setShowLogoPreview(true);
        setHideStartedText(true);
        
        // Scroll to the new results section
        scrollToSection(`section-${nextSection}`);
      }, 3000); // 3 second loading screen
    }, 1000); // Wait for text exit animation
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradient-pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        
        .typography-style-button,
        .typography-style-button:hover,
        .typography-style-button:focus,
        .typography-style-button:active,
        .typography-style-button:visited,
        .typography-style-button:focus-visible {
          text-decoration: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
      <Header />
      <main className={`relative w-full grid grid-cols-1 ${expandPreviewPanel ? 'md:grid-cols-1' : (showPreviewPanel && !visibleSections.includes(4)) ? 'md:grid-cols-2' : 'md:grid-cols-1'} pt-20 transition-all duration-500`} style={{ minHeight: '100vh' }}>
        <div className={`p-4 md:p-8 lg:p-12 overflow-y-auto ${expandPreviewPanel ? 'hidden' : (showPreviewPanel && !visibleSections.includes(4)) ? '' : 'md:col-span-1'} transition-all duration-500`}>

          {/* === HERO SECTION === */}
          <AnimatePresence mode="wait">
            {!exitHeroSection && (
              <motion.div 
                key="hero-section"
                id="section-0" 
                initial={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-center min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center"
              >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 overflow-visible" style={{ lineHeight: "1.4" }}>
                  <Typewriter
                    phrases={[
                      "Create Brands",
                      "Create Logos", 
                      "Create Vibes",
                      "..in seconds!"
                    ]}
                    typingSpeed={30000}
                    deletingSpeed={20000}
                    holdBeforeDelete={1100}
                    holdBeforeType={220}
                    cursor
                    loop={true}
                  />
                </h1>
                <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-4 font-medium">
                  Your vision. Your logo. Designed to fit you perfectly.
                </p>
                <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto mb-8">
                  We turn your ideas into a logo that speaks your brand&apos;s language.
                </p>
                <button
                  onClick={() => handleSectionNext(0)}
                  className="bg-black text-white font-bold px-8 py-4 rounded-lg shadow-xl shadow-black/30 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-black/40 hover:rotate-1 active:scale-95 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    Create Brand!
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%] group-hover:transition-transform group-hover:duration-700"></div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* === PROGRESSIVE SECTIONS === */}
          
          {/* Section 1: Industry Selection */}
          {visibleSections.includes(1) && (
            <motion.div
              id="section-1"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex items-center justify-center py-20"
            >
              <div className="w-full max-w-2xl">
                <Step1_Industry
                  industry={industry}
                  setIndustry={setIndustry}
                  onNext={() => handleSectionNext(1)}
                />
              </div>
            </motion.div>
          )}

          {/* Section 2: Branding */}
          {visibleSections.includes(2) && (
            <motion.div
              id="section-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex items-start justify-center py-20 pt-32"
            >
              <div className="w-full max-w-2xl">
                <Step2_Branding
                  config={config}
                  updateConfig={updateConfig}
                  selectedPersonalities={selectedPersonalities}
                  onTogglePersonality={handlePersonalityToggle}
                  onNext={() => handleSectionNext(2)}
                />
              </div>
            </motion.div>
          )}

          {/* Section 3: Design */}
          {visibleSections.includes(3) && (
            <motion.div
              id="section-3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex items-center justify-center py-20"
            >
              <div className="w-full max-w-2xl">
                <div className="space-y-12">
                  <div className="flex items-center gap-2">
                    <button onClick={handleUndo} disabled={true} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500/30 transition-colors border border-emerald-300/30"><Undo2 size={16}/> Undo</button>
                    <button onClick={handleRedo} disabled={true} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500/30 transition-colors border border-emerald-300/30"><Redo2 size={16}/> Redo</button>
                  </div>
                  <Step3_Design
                    config={config}
                    updateConfig={updateConfig}
                    suggestions={suggestions}
                    selectedFontCategory={selectedFontCategory}
                    setSelectedFontCategory={setSelectedFontCategory}
                    selectedPersonalities={selectedPersonalities}
                    onTogglePersonality={handlePersonalityToggle}
                    onLogoCreate={handleLogoCreation}
                    onDesignProgress={handleDesignProgress}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Section 4: Logo Results */}
          {visibleSections.includes(4) && (
            <motion.div
              id="section-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen grid grid-cols-1 md:grid-cols-3 gap-8 p-4 md:p-8 lg:p-12 items-start"
            >
              {/* Left Column: Info & Design Quality */}
              <div className="flex flex-col space-y-8 pt-8">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-4">Your Logo is Ready!</h2>
                  <p className="text-xl text-white/70 mb-6">Here are your generated logo variations</p>
                </div>

                {/* Design Quality */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-primary">Design Quality</h3>
                      <span className="text-2xl font-bold text-white">82/100</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full mb-3">
                      <div
                        className="h-2 rounded-full bg-white transition-all duration-500"
                        style={{ width: "82%" }}
                      />
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-primary mb-2">Improvement suggestions:</h4>
                      <ul className="text-xs text-white/70 space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          Wählen Sie eine klassische Schriftart und professionelle Farben für mehr Zeitlosigkeit
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          Vervollständigen Sie alle Elemente für ein starkes Gesamtkonzept
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          Wählen Sie Farben, die zu Ihrer Branche passen (z.B. Blau für Tech, Grün für Nachhaltigkeit)
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Typography Style Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-bold text-primary mb-4">Typography Style</h3>
                    <div className="space-y-3">
                      {fontCategories.map((category) => (
                        <button
                          key={category.name}
                          onClick={() => setSelectedFontCategory(category.name)}
                          className={`w-full p-4 rounded-lg border text-left transition-all duration-300 transform hover:scale-[1.02] ${
                            selectedFontCategory === category.name
                              ? 'bg-white/10 border-white/30 text-white shadow-lg shadow-white/10'
                              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/8 hover:border-white/20'
                          }`}
                        >
                          <div className="font-semibold text-sm mb-2">{category.name}</div>
                          <div className="text-xs text-white/60 leading-relaxed">
                            {category.name === 'Modern' && 'Clean, minimalist fonts for tech companies'}
                            {category.name === 'Elegant' && 'Sophisticated script fonts for luxury brands'}
                            {category.name === 'Bold' && 'Strong, impactful fonts for dynamic companies'}
                            {category.name === 'Heritage' && 'Classic serif fonts for traditional businesses'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Logo Variations */}
              <div className="md:col-span-2 flex flex-col pt-8">
                <motion.div 
                  initial={{ opacity: 0, x: 50 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <LogoPreview 
                    config={config} 
                    selectedFontCategory={selectedFontCategory}
                    availableIcons={suggestions.suggestedIcons}
                    availablePalettes={suggestions.suggestedPalettes}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Mobile Logo Preview Section */}
          {isLogoConfigComplete && showLogoPreview && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mobile-logo-section md:hidden min-h-screen flex flex-col justify-center py-20"
            >
              <div className="w-full max-w-2xl mx-auto px-4">
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Your Logo is Ready!</h2>
                    <p className="text-white/70">Here are your generated logo variations</p>
                  </div>
                  
                  {/* Mobile Tabs */}
                  <div className="flex border-b border-white/20 mb-6">
                    <button 
                      onClick={() => setPreviewTab('preview')} 
                      className={`px-4 py-2 font-bold transition-colors ${previewTab === 'preview' ? 'text-white/90 border-b-2 border-white/90' : 'text-white/50 hover:text-white/90'}`}
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => setPreviewTab('mockups')} 
                      disabled={!(isLogoConfigComplete && showLogoPreview)} 
                      className={`px-4 py-2 font-bold transition-colors ${previewTab === 'mockups' ? 'text-white/90 border-b-2 border-white/90' : 'text-white/50 hover:text-white/90'} disabled:text-white/20 disabled:cursor-not-allowed`}
                    >
                      Mockups
                    </button>
                  </div>

                  {/* Mobile Content */}
                  <div className="space-y-6">
                    <AnimatePresence mode="wait">
                      {previewTab === 'preview' && (
                        <motion.div key="mobile-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <LogoPreview 
                    config={config} 
                    selectedFontCategory={selectedFontCategory}
                    availableIcons={suggestions.suggestedIcons}
                    availablePalettes={suggestions.suggestedPalettes}
                  />
                        </motion.div>
                      )}
                      {previewTab === 'mockups' && (
                        <motion.div key="mobile-mockups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <MockupPreview config={config} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ 
            x: showPreviewPanel ? 0 : '100%'
          }}
          transition={{ 
            type: 'spring', 
            damping: 20, 
            stiffness: 100
          }}
          className={`p-8 md:p-12 sticky top-0 flex flex-col ${visibleSections.includes(4) ? 'hidden' : 'md:block hidden'} relative ${expandPreviewPanel ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          style={{
            background: `linear-gradient(to right, rgba(8, 12, 20, 0.02), rgba(8, 12, 20, 0.1875))`,
            height: '100vh',
            minHeight: '100vh'
          }}
        >
          {/* Horizontal Border-Top Animation - starts after panel slides in, fills right to left */}
          {showTopBorder && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.3, ease: "easeIn" }}
              className="absolute top-0 right-0 h-2 overflow-hidden rounded-[14px]"
              style={{
                background: 'linear-gradient(90deg, rgb(254, 240, 138) 0%, rgb(189, 183, 107) 25%, rgb(110, 231, 183) 50%, rgb(255, 255, 255) 100%)'
              }}
            />
          )}
          
          {/* Vertical Border-Left Animation - starts after horizontal border completes */}
          {showLeftBorder && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100vh' }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute left-0 top-0 w-2 overflow-hidden rounded-t-[14px]"
              style={{
                background: 'linear-gradient(180deg, rgb(254, 240, 138) 0%, rgb(189, 183, 107) 25%, rgb(110, 231, 183) 50%, rgb(255, 255, 255) 100%)'
              }}
            />
          )}
          
          {/* Final Border-Left Animation - triggered after Create Logo click */}
          {showFinalBorder && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100vh' }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute left-0 top-0 w-2 overflow-hidden rounded-t-[14px]"
              style={{
                background: 'linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(110, 231, 183) 25%, rgb(189, 183, 107) 50%, rgb(254, 240, 138) 100%)'
              }}
            />
          )}
          {/* Original Animated Border - only show after first scroll trigger (replaces the new border) */}
          {visibleSections.includes(1) && showStartedText && !showLeftBorder && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100vh' }}
              transition={{ duration: 0.45, delay: 0.1125, ease: "easeOut" }}
              className="absolute left-0 top-0 w-2 overflow-hidden rounded-t-[14px]"
              style={{
                background: 'linear-gradient(180deg, rgb(254, 240, 138) 0%, rgb(189, 183, 107) 25%, rgb(110, 231, 183) 50%, rgb(255, 255, 255) 100%)'
              }}
            />
          )}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: showStartedText ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full h-2 bg-gradient-to-r from-yellow-100/20 via-stone-100/20 to-amber-50/20 rounded-full mb-4"
          >
            <motion.div 
              className="h-2 rounded-full bg-gradient-to-r from-yellow-200 via-stone-200 to-amber-50"
              animate={{ width: `${progress}%` }} 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: showStartedText ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex border-b border-yellow-200/30 mb-6"
          >
            <button onClick={() => setPreviewTab('preview')} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'preview' ? 'text-yellow-100 border-b-2 border-yellow-300' : 'text-yellow-200/70 hover:text-yellow-100'}`}>Preview</button>
            <button onClick={() => setPreviewTab('mockups')} disabled={!(isLogoConfigComplete && showLogoPreview)} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'mockups' ? 'text-yellow-100 border-b-2 border-yellow-300' : 'text-yellow-200/70 hover:text-yellow-100'} disabled:text-yellow-200/30 disabled:cursor-not-allowed`}>Mockups</button>
          </motion.div>

          <div className="flex-grow overflow-y-auto overflow-x-visible pb-20">
            <AnimatePresence mode="wait">
              {previewTab === 'preview' && (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isLogoConfigComplete && showLogoPreview ? <LogoPreview config={config} selectedFontCategory={selectedFontCategory} /> : 
                    <div className="h-full flex items-center justify-center pt-32 overflow-x-visible">
                      <div className="text-center w-full">
                        <AnimatePresence mode="wait">
                          {/* First Text: "Let's get started!" */}
                          {showStartedText && !exitStartedText && (
                            <motion.div
                              key="started-text"
                              initial={{ x: '100%', opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: '100%', opacity: 0 }}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                              className="text-5xl md:text-6xl lg:text-7xl font-black"
                              style={{ lineHeight: 1.1 }}
                            >
                              <motion.span 
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0 }}
                                className="block text-white"
                              >
                                Let&apos;s
                              </motion.span>
                              <motion.span 
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="block text-black my-6"
                              >
                                get
                              </motion.span>
                              <motion.span 
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="block text-white"
                              >
                                started!
                              </motion.span>
                            </motion.div>
                          )}

                          {/* Second Text: "just 50 seconds away.." */}
                          {showSecondText && !exitSecondText && (
                            <motion.div
                              key="seconds-text"
                              initial={{ x: '100%', opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: '100%', opacity: 0 }}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                              className="text-4xl md:text-5xl lg:text-6xl font-black"
                              style={{ lineHeight: 1.1 }}
                            >
                              <motion.span 
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0 }}
                                className="block text-white"
                              >
                                just
                              </motion.span>
                              <motion.span 
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="block text-black my-4"
                              >
                                50 seconds
                              </motion.span>
                              <motion.span 
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="block text-white"
                              >
                                away..
                              </motion.span>
                            </motion.div>
                          )}

                          {/* Third Text: "hold on, we're right there!" */}
                          {showThirdText && !exitThirdText && (
                            <motion.div
                              key="third-text"
                              initial={{ x: '100%', opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: '100%', opacity: 0 }}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                              className="text-4xl md:text-5xl lg:text-6xl font-black"
                              style={{ lineHeight: 1.1 }}
                            >
                              <motion.span 
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0 }}
                                className="block text-white"
                              >
                                hold on,
                              </motion.span>
                              <motion.span 
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="block text-white/70 my-4"
                              >
                                we&apos;re right
                              </motion.span>
                              <motion.span 
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="block text-black animate-pulse"
                                style={{
                                  animation: 'gradient-pulse 2s ease-in-out infinite alternate'
                                }}
                              >
                                there!
                              </motion.span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  }
                </motion.div>
              )}
              {previewTab === 'mockups' && (
                <motion.div key="mockups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isLogoConfigComplete && showLogoPreview ? <MockupPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Complete your logo to see mockups.</p></div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Fullscreen Morph Overlay */}
        <AnimatePresence>
          {expandPreviewPanel && (
            <motion.div
              initial={{ 
                position: 'fixed',
                top: morphFromPosition.top,
                right: morphFromPosition.right,
                width: morphFromPosition.width,
                height: morphFromPosition.height,
                zIndex: 40,
                borderRadius: '0px'
              }}
              animate={{ 
                top: 0,
                right: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 50,
                borderRadius: '0px'
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                transition: { duration: 0.6 }
              }}
              transition={{ 
                duration: 1.2, 
                ease: [0.23, 1, 0.32, 1], // Custom easing for smooth morph
                layout: { duration: 1.2 },
                borderRadius: { duration: 0.8, ease: "easeInOut" }
              }}
              className="fixed bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 md:p-12 overflow-y-auto"
              style={{
                background: `radial-gradient(circle at top left, #111827 0%, #111827 70%, #0F0F0F 85%, #000000 95%)`
              }}
            >
              {/* Fullscreen Content */}
              <div className="w-full h-full flex flex-col">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: showStartedText ? 1 : 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex border-b border-white/20 mb-6"
                >
                  <button onClick={() => setPreviewTab('preview')} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'preview' ? 'text-yellow-100 border-b-2 border-yellow-300' : 'text-yellow-200/70 hover:text-yellow-100'}`}>Preview</button>
                  <button onClick={() => setPreviewTab('mockups')} disabled={!(isLogoConfigComplete && showLogoPreview)} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'mockups' ? 'text-yellow-100 border-b-2 border-yellow-300' : 'text-yellow-200/70 hover:text-yellow-100'} disabled:text-yellow-200/30 disabled:cursor-not-allowed`}>Mockups</button>
                </motion.div>

                <div className="flex-grow overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {previewTab === 'preview' && (
                      <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {isLogoConfigComplete && showLogoPreview ? <LogoPreview config={config} selectedFontCategory={selectedFontCategory} /> : 
                          <div className="h-full flex items-center justify-center relative">
                            <div 
                              className="absolute top-0 left-0 right-0 h-1 rounded-t"
                              style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 20%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.6) 80%, transparent 100%)'
                              }}
                            />
                            <p className="text-white/50">Loading logos...</p>
                          </div>
                        }
                      </motion.div>
                    )}
                    {previewTab === 'mockups' && (
                      <motion.div key="mockups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {isLogoConfigComplete && showLogoPreview ? <MockupPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Complete your logo to see mockups.</p></div>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
      <LoadingScreen isVisible={showLoadingScreen} />
    </>
  );
}