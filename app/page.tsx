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

// === EXAMPLE BORDER BUTTON COMPONENT ===
const ExampleBorderButton = () => {
  const [showTopBorder, setShowTopBorder] = useState(false);
  const [showLeftBorder, setShowLeftBorder] = useState(false);
  const [showRightBorder, setShowRightBorder] = useState(false);
  const [showBottomBorder, setShowBottomBorder] = useState(false);

  const handleClick = () => {
    // Reset animations
    setShowTopBorder(false);
    setShowLeftBorder(false);
    setShowRightBorder(false);
    setShowBottomBorder(false);
    
    // Start top border and right border simultaneously
    setTimeout(() => {
      setShowTopBorder(true);
      setShowRightBorder(true);
      
      // Start left border and bottom border simultaneously after top/right borders complete
      setTimeout(() => {
        setShowLeftBorder(true);
        setShowBottomBorder(true);
      }, 900); // Wait for top/right border animations to complete
    }, 100);
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleClick}
        className="relative bg-white/5 border border-white/20 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 overflow-hidden"
      >
        {/* Horizontal Border-Top Animation - fills right to left */}
        {showTopBorder && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute top-0 right-0 h-1 bg-gradient-to-l from-cyan-400 via-purple-600 to-blue-500 rounded-t-lg"
          />
        )}
        
        {/* Vertical Border-Left Animation - starts after horizontal border completes */}
        {showLeftBorder && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute left-0 top-0 w-1 bg-gradient-to-b from-blue-500 via-purple-600 to-cyan-400 rounded-l-lg"
          />
        )}
        
        {/* Vertical Border-Right Animation - starts simultaneously with top border */}
        {showRightBorder && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute right-0 top-0 w-1 bg-gradient-to-b from-blue-500 via-purple-600 to-cyan-400 rounded-r-lg"
          />
        )}
        
        {/* Horizontal Border-Bottom Animation - starts simultaneously with left border */}
        {showBottomBorder && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute bottom-0 right-0 h-1 bg-gradient-to-l from-cyan-400 via-purple-600 to-blue-500 rounded-b-lg"
          />
        )}
        
        <span className="relative z-10">Example Border Animation</span>
      </button>
    </div>
  );
};

// === MAIN PAGE COMPONENT ===
export default function LogoGeneratorPage() {
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState<string | null>(null);
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);
  const [previewTab, setPreviewTab] = useState<'preview' | 'mockups'>('preview');
  const [visibleSections, setVisibleSections] = useState<number[]>([0]); // Start with hero section visible
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
          }, 700); // Reduced wait time since border-top starts earlier
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
          color: rgba(255, 255, 255, 0.8) !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        .typography-style-button:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
        }
        
        .typography-style-button:active {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        .typography-style-button:focus {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-bold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
                >
                  Create Brand!
                </button>
                
                {/* Example Border Animation Button */}
                <ExampleBorderButton />
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
                    <button onClick={handleUndo} disabled={true} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"><Undo2 size={16}/> Undo</button>
                    <button onClick={handleRedo} disabled={true} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"><Redo2 size={16}/> Redo</button>
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
                          className="typography-style-button w-full p-3 rounded-lg border-2 border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/80 transition-all duration-300 transform hover:scale-105"
                          style={{
                            textDecoration: 'none'
                          }}
                        >
                          <div className="text-left">
                            <div className="font-semibold text-sm mb-1">{category.name}</div>
                            <div className="text-xs text-white/60">
                              {category.name === 'Modern' && 'Clean, minimalist fonts for tech companies'}
                              {category.name === 'Elegant' && 'Sophisticated script fonts for luxury brands'}
                              {category.name === 'Bold' && 'Strong, impactful fonts for dynamic companies'}
                              {category.name === 'Heritage' && 'Classic serif fonts for traditional businesses'}
                            </div>
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
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute top-0 right-0 h-2 bg-gradient-to-l from-cyan-400 via-purple-600 to-blue-500 overflow-hidden rounded-[14px]"
            />
          )}
          
          {/* Vertical Border-Left Animation - starts after horizontal border completes */}
          {showLeftBorder && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100vh' }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute left-0 top-0 w-2 bg-gradient-to-b from-blue-500 via-purple-600 to-cyan-400 overflow-hidden rounded-t-[14px]"
            />
          )}
          
          {/* Final Border-Left Animation - triggered after Create Logo click */}
          {showFinalBorder && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100vh' }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute left-0 top-0 w-2 bg-gradient-to-b from-cyan-400 via-purple-600 to-blue-500 overflow-hidden rounded-t-[14px]"
            />
          )}
          {/* Original Animated Border - only show after first scroll trigger (replaces the new border) */}
          {visibleSections.includes(1) && showStartedText && !showLeftBorder && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100vh' }}
              transition={{ duration: 0.45, delay: 0.1125, ease: "easeOut" }}
              className="absolute left-0 top-0 w-2 bg-gradient-to-b from-blue-500 via-purple-600 to-cyan-400 overflow-hidden rounded-t-[14px]"
            />
          )}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: showStartedText ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full h-2 bg-white/10 rounded-full mb-4"
          >
            <motion.div 
              className="h-2 rounded-full bg-white/90"
              animate={{ width: `${progress}%` }} 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: showStartedText ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex border-b border-white/20 mb-6"
          >
            <button onClick={() => setPreviewTab('preview')} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'preview' ? 'text-white/90 border-b-2 border-white/90' : 'text-white/50 hover:text-white/90'}`}>Preview</button>
            <button onClick={() => setPreviewTab('mockups')} disabled={!(isLogoConfigComplete && showLogoPreview)} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'mockups' ? 'text-white/90 border-b-2 border-white/90' : 'text-white/50 hover:text-white/90'} disabled:text-white/20 disabled:cursor-not-allowed`}>Mockups</button>
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
                                className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent my-6"
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
                                className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent my-4"
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
                                className="block bg-gradient-to-r from-cyan-400 via-purple-600 to-blue-500 bg-clip-text text-transparent animate-pulse"
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
                  <button onClick={() => setPreviewTab('preview')} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'preview' ? 'text-white/90 border-b-2 border-white/90' : 'text-white/50 hover:text-white/90'}`}>Preview</button>
                  <button onClick={() => setPreviewTab('mockups')} disabled={!(isLogoConfigComplete && showLogoPreview)} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'mockups' ? 'text-white/90 border-b-2 border-white/90' : 'text-white/50 hover:text-white/90'} disabled:text-white/20 disabled:cursor-not-allowed`}>Mockups</button>
                </motion.div>

                <div className="flex-grow overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {previewTab === 'preview' && (
                      <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {isLogoConfigComplete && showLogoPreview ? <LogoPreview config={config} selectedFontCategory={selectedFontCategory} /> : 
                          <div className="h-full flex items-center justify-center"><p className="text-white/50">Loading logos...</p></div>
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