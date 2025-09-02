// --- app/page.tsx ---
'use client';

import React, { useState, useMemo, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoReducer, initialState } from '@/lib/state';
import { getSuggestions } from '@/lib/suggestionEngine';
import { LogoConfig } from '@/lib/types';
import { Undo2, Redo2 } from 'lucide-react';

// Import newly created components
import { Header } from '@/components/Header';
import { Typewriter } from '@/components/ui/Typewriter';
import Step1_Industry from '@/components/editor/Step1_Industry';
import Step2_Branding from '@/components/editor/Step2_Branding';
import Step3_Design from '@/components/editor/Step3_Design';
import LogoPreview from '@/components/preview/LogoPreview';
import MockupPreview from '@/components/preview/MockupPreview';

// === MAIN PAGE COMPONENT ===
export default function LogoGeneratorPage() {
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState<string | null>(null);
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);
  const [previewTab, setPreviewTab] = useState<'preview' | 'mockups'>('preview');
  const [visibleSections, setVisibleSections] = useState<number[]>([0]); // Start with hero section visible
  const [showPreviewPanel, setShowPreviewPanel] = useState(false); // Control preview panel visibility

  const [state, dispatch] = useReducer(logoReducer, initialState);
  const { present: config, past, future } = state;

  const updateConfig = (newConfig: Partial<LogoConfig>) => {
    dispatch({ type: 'SET_CONFIG', payload: newConfig });
  };

  const handleUndo = () => dispatch({ type: 'UNDO' });
  const handleRedo = () => dispatch({ type: 'REDO' });

  const handlePersonalityToggle = (id: string) => {
    const newSelection = selectedPersonalities.includes(id)
      ? selectedPersonalities.filter(p => p !== id)
      : [...selectedPersonalities, id].slice(0, 2);
    setSelectedPersonalities(newSelection);
  };

  const suggestions = useMemo(
    () => getSuggestions(industry, selectedPersonalities, config),
    [industry, selectedPersonalities, config]
  );


  const progress = (step / 3) * 100;
  const isLogoConfigComplete = !!(config.icon && config.font && config.layout && config.palette && config.text);

  // Helper function to scroll to a specific section
  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle next button clicks - reveal next section and scroll to it
  const handleSectionNext = (currentSection: number) => {
    const nextSection = currentSection + 1;
    if (!visibleSections.includes(nextSection)) {
      setVisibleSections([...visibleSections, nextSection]);
    }
    scrollToSection(`section-${nextSection}`);
    
    // Show preview panel when starting the process
    if (currentSection === 0 && !showPreviewPanel) {
      setShowPreviewPanel(true);
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

  return (
    <>
      <Header />
      <main className={`min-h-screen w-full grid ${showPreviewPanel ? 'md:grid-cols-2' : 'md:grid-cols-1'} pt-20 transition-all duration-500`}>
        <div className={`p-8 md:p-12 overflow-y-auto max-h-[calc(100vh-5rem)] ${showPreviewPanel ? '' : 'md:col-span-1'} transition-all duration-500`}>

          {/* === HERO SECTION === */}
          <div id="section-0" className="text-center min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
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
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Unser intelligenter Assistent führt Sie durch die goldenen Regeln des Designs, um ein perfektes, zeitloses Logo für Ihre Marke zu erstellen.
            </p>
            <button
              onClick={() => handleSectionNext(0)}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all transform hover:scale-105"
            >
              Jetzt starten
            </button>
          </div>

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
              className="min-h-screen flex items-center justify-center py-20"
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
                    <button onClick={handleUndo} disabled={past.length === 0} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"><Undo2 size={16}/> Rückgängig</button>
                    <button onClick={handleRedo} disabled={future.length === 0} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"><Redo2 size={16}/> Wiederholen</button>
                  </div>
                  <Step3_Design
                    config={config}
                    updateConfig={updateConfig}
                    suggestions={suggestions}
                  />
                </div>
              </div>
            </motion.div>
          )}

        </div>
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: showPreviewPanel ? 0 : '100%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="bg-black/50 p-8 md:p-12 h-screen sticky top-0 flex flex-col md:block hidden">
          <div className="w-full h-2 bg-white/10 rounded-full mb-4">
            <motion.div className="h-2 bg-primary rounded-full" animate={{ width: `${isLogoConfigComplete ? 100 : (visibleSections.length - 1) * 33.33}%` }} />
          </div>

          <div className="flex border-b border-white/20 mb-6">
            <button onClick={() => setPreviewTab('preview')} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'}`}>Vorschau</button>
            <button onClick={() => setPreviewTab('mockups')} disabled={!isLogoConfigComplete} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'mockups' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'} disabled:text-white/20 disabled:cursor-not-allowed`}>Mockups</button>
          </div>

          <div className="flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
              {previewTab === 'preview' && (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isLogoConfigComplete ? <LogoPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Beginnen Sie den Prozess, um die Vorschau zu sehen.</p></div>}
                </motion.div>
              )}
              {previewTab === 'mockups' && (
                <motion.div key="mockups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isLogoConfigComplete ? <MockupPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Vervollständigen Sie Ihr Logo, um die Mockups zu sehen.</p></div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </>
  );
}