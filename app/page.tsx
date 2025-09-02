'use client';

import React, { useState, useMemo, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { icons, fonts, layouts, palettes, industries, personalities } from '@/lib/data';
import { LogoConfig, PaletteData, LayoutData } from '@/lib/types';
import { logoReducer, initialState } from '@/lib/state';
import { evaluateLogoDesign, suggestImprovements } from '@/lib/designRules';
import { Download, Check, Circle, Shield, Undo2, Redo2 } from 'lucide-react';
import { Header } from '@/components/Header';

// === HELPER & UTILITY COMPONENTS ===
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <motion.div
    className="w-full"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.4 }}
  >
    <h2 className="text-xl font-bold mb-4 text-primary">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {children}
    </div>
  </motion.div>
);

const SelectionCard = ({ children, isSelected, onClick }: { children: React.ReactNode, isSelected: boolean, onClick: () => void }) => (
  <div
    onClick={onClick}
    className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 h-24 flex items-center justify-center text-center ${
      isSelected ? 'border-primary ring-2 ring-primary bg-primary/10' : 'border-white/20 hover:border-white/50 bg-white/5'
    }`}
  >
    {children}
    {isSelected && <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1"><Check size={12} /></div>}
  </div>
);

// === LOGO CANVAS & PREVIEW COMPONENTS ===
const LogoCanvas = ({ config }: { config: LogoConfig }) => {
  const { icon, font, layout, palette, text, slogan } = config;
  if (!icon || !font || !layout || !palette) return null;

  const IconComponent = icon.component;
  const [bgColor, primaryColor, textColor] = palette.colors;

  const fontUrl = `https://fonts.googleapis.com/css2?family=${font.url.replace(/ /g, '+')}:wght@${font.weights.join(';')}&display=swap`;

  const renderContent = () => {
    const textLength = text.length || 10;
    const baseFontSize = 28;
    const fontSize = Math.max(14, baseFontSize - textLength * 0.5);
    const sloganFontSize = fontSize * 0.5;

    if (layout.arrangement === 'icon-top') {
      return (
        <g>
          <IconComponent x={75} y={30} width={50} height={50} color={primaryColor} />
          <text x="100" y={110} fontSize={fontSize} fontWeight="bold" textAnchor="middle" fill={textColor}>{text || "Markenname"}</text>
          {slogan && <text x="100" y={110 + sloganFontSize + 5} fontSize={sloganFontSize} textAnchor="middle" fill={primaryColor}>{slogan}</text>}
        </g>
      );
    }
    if (layout.arrangement === 'icon-left') {
      const iconSize = 40;
      return(
        <g transform="translate(20, 0)">
          <IconComponent x={0} y={55} width={iconSize} height={iconSize} color={primaryColor} />
          <text x={iconSize + 15} y={75} fontSize={fontSize * 0.8} fontWeight="bold" textAnchor="start" fill={textColor}>{text || "Markenname"}</text>
          {slogan && <text x={iconSize + 15} y={75 + sloganFontSize} fontSize={sloganFontSize * 0.9} textAnchor="start" fill={primaryColor}>{slogan}</text>}
        </g>
      );
    }
    return null;
  };

  const renderShape = () => {
    if (layout.type !== 'enclosed') return null;
    if (layout.shape === 'circle') return <circle cx="100" cy="100" r="95" fill="none" stroke={primaryColor} strokeWidth="4" />
    if (layout.shape === 'shield') return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" transform="scale(8.4) translate(-1.5, -1.5)" fill="none" stroke={primaryColor} strokeWidth="0.5" />
    return null;
  };

  return (
    <svg id={`logo-svg-${palette.id}`} width="100%" height="auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <Head><link rel="stylesheet" href={fontUrl} /></Head>
      <style>{`#logo-svg-${palette.id} text { font-family: '${font.name}', ${font.family}; }`}</style>
      {layout.type === 'enclosed' && <rect x="0" y="0" width="200" height="200" fill={bgColor} rx={layout.shape === 'circle' ? 100 : 20}/>}
      {renderShape()}
      {renderContent()}
    </svg>
  );
};

const LogoPreview = ({ config }: { config: LogoConfig }) => {
  const handleDownload = () => {
    const svgElement = document.getElementById(`logo-svg-${config.palette?.id}`);
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.text.replace(/ /g, '_')}_logo.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const monochromePalette: PaletteData = { id: 'mono', name: 'mono', colors: ['#000000', '#FFFFFF', '#FFFFFF'], tags: [] };
  const monochromeConfig = { ...config, palette: monochromePalette };
  
  // Design-Qualitäts-Bewertung basierend auf den 10 goldenen Regeln
  const evaluation = useMemo(() => evaluateLogoDesign(config), [config]);
  const suggestions = useMemo(() => suggestImprovements(config), [config]);

  return (
    <div className="space-y-6">
      {/* Design-Qualitäts-Score */}
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-primary">Design-Qualität</h3>
          <span className={`text-2xl font-bold ${evaluation.overallScore >= 80 ? 'text-green-400' : evaluation.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            {evaluation.overallScore}/100
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full mb-3">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${evaluation.overallScore >= 80 ? 'bg-green-400' : evaluation.overallScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${evaluation.overallScore}%` }}
          />
        </div>
        <div className="text-xs text-white/60">
          Basierend auf den 10 goldenen Regeln des Logodesigns
        </div>
        
        {/* Verbesserungsvorschläge */}
        {suggestions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-semibold text-primary mb-2">Verbesserungsvorschläge:</h4>
            <ul className="text-xs text-white/70 space-y-1">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-bold mb-2 text-primary">Farbversion</h3>
        <div className="bg-white/10 rounded-lg p-4"><LogoCanvas config={config} /></div>
      </div>
      <div>
        <h3 className="font-bold mb-2 text-primary">Monochrome Version</h3>
        <div className="bg-black border border-white/20 rounded-lg p-4"><LogoCanvas config={monochromeConfig} /></div>
      </div>
      <button onClick={handleDownload} disabled={!config.text} className="w-full mt-4 bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
        <Download size={18} />SVG Herunterladen</button>
    </div>
  );
};

const MockupPreview = ({ config }: { config: LogoConfig }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-lg aspect-[10/6] w-full flex items-center">
        <div className="w-1/3"><div style={{ transform: 'scale(0.5)' }}><LogoCanvas config={config} /></div></div>
        <div className="w-2/3 border-l-2 border-gray-200 pl-4">
          <p className="text-black font-bold text-xl">{config.text || "Dein Name"}</p><p className="text-gray-500 text-sm">Deine Position</p>
          <div className="mt-4 space-y-1 text-xs text-gray-700"><p>+49 123 456 7890</p><p>hallo@deinemarke.de</p></div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg w-full flex items-center justify-between">
        <div className="w-1/4"><div style={{ transform: 'scale(0.3)', transformOrigin: 'left center' }}><LogoCanvas config={config} /></div></div>
        <div className="flex items-center gap-4 text-sm text-gray-300"><p>Produkte</p><p>Über Uns</p><p>Kontakt</p></div>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg w-full">
        <p className="text-center font-bold text-white mb-4">App Icon</p>
        <div className="flex justify-center items-center gap-6">
          <div className="w-20 h-20 bg-black rounded-3xl overflow-hidden"><LogoCanvas config={config} /></div>
          <div className="w-20 h-20 bg-white rounded-3xl overflow-hidden"><LogoCanvas config={{...config, palette: {...config.palette, colors: ['#000000', '#000000', '#000000']} as any}}/></div>
        </div>
      </div>
    </div>
  );
};

const LayoutSelectionCard = ({ layout, isSelected, onClick }: { layout: LayoutData, isSelected: boolean, onClick: () => void }) => {
  return (
    <SelectionCard isSelected={isSelected} onClick={onClick}>
      <div className="flex flex-col items-center justify-center gap-2 text-xs">
        {layout.shape === 'circle' && <Circle size={24}/>}
        {layout.shape === 'shield' && <Shield size={24}/>}
        {!layout.shape && (layout.arrangement === 'icon-top' ? <div className="space-y-1"><div className="w-4 h-4 bg-white/50 rounded-sm mx-auto"></div><div className="w-8 h-2 bg-white/50 rounded-sm"></div></div> : <div className="flex gap-1 items-center"><div className="w-4 h-4 bg-white/50 rounded-sm"></div><div className="w-8 h-2 bg-white/50 rounded-sm"></div></div>)}
        <p className="mt-1">{layout.name}</p>
      </div>
    </SelectionCard>
  );
};

// === MAIN PAGE COMPONENT ===
export default function LogoGeneratorPage() {
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState<string | null>(null);
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);
  const [previewTab, setPreviewTab] = useState<'preview' | 'mockups'>('preview');

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

  const { filteredIcons, filteredFonts, filteredPalettes } = useMemo(() => {
    if (!industry) return { filteredIcons: icons, filteredFonts: fonts, filteredPalettes: palettes };

    const industryTags = industries[industry as keyof typeof industries].tags;
    const personalityTags = personalities.filter(p => selectedPersonalities.includes(p.id)).flatMap(p => p.tags);
    const activeTags = new Set([...industryTags, ...personalityTags]);

    // Erweiterte Bewertungslogik basierend auf Design-Regeln
    const getScore = (itemTags: string[]) => {
      let score = itemTags.reduce((score, tag) => activeTags.has(tag) ? score + 1 : score, 0);
      
      // Bonus für Design-Regel-Compliance
      if (itemTags.includes('timeless')) score += 3;
      if (itemTags.includes('minimalist')) score += 2;
      if (itemTags.includes('iconic')) score += 2;
      if (itemTags.includes('unique')) score += 1;
      if (itemTags.includes('professional')) score += 2;
      
      return score;
    };

    const filteredIcons = [...icons].sort((a, b) => getScore(b.tags) - getScore(a.tags));
    const filteredPalettes = [...palettes].sort((a, b) => getScore(b.tags) - getScore(a.tags));

    // Schriftarten nach Zeitlosigkeit und Professionalität sortieren
    const filteredFonts = [...fonts].sort((a, b) => {
      const aScore = a.category.includes('Klassisch') ? 3 : a.category.includes('Modern') ? 2 : 1;
      const bScore = b.category.includes('Klassisch') ? 3 : b.category.includes('Modern') ? 2 : 1;
      return bScore - aScore;
    });

    return { filteredIcons, filteredFonts, filteredPalettes };
  }, [industry, selectedPersonalities]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold">Erzählen Sie uns von Ihrer Marke</h1>
            <Section title="In welcher Branche sind Sie tätig?">
              {Object.entries(industries).map(([key, value]) => (
                <SelectionCard key={key} isSelected={industry === key} onClick={() => setIndustry(key)}>
                  <p className="font-bold">{value.name}</p>
                </SelectionCard>
              ))}
            </Section>
            <button onClick={() => setStep(2)} disabled={!industry} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Weiter</button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" className="space-y-8 animate-fade-in">
            <div>
              <label htmlFor="text" className="block text-xl font-bold mb-2 text-primary">Markenname</label>
              <input 
                type="text" 
                id="text" 
                value={config.text} 
                onChange={(e) => updateConfig({ text: e.target.value })} 
                className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary focus:outline-none" 
                placeholder="z.B. Quantum Leap"
                maxLength={15}
              />
              <div className="text-xs text-white/50 mt-1 flex justify-between">
                <span>Regel 1: Einfachheit - Kurze Namen prägen sich besser ein</span>
                <span className={config.text.length > 10 ? 'text-yellow-400' : 'text-green-400'}>
                  {config.text.length}/15
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xl font-bold mb-2 text-primary">Markenpersönlichkeit (max. 2)</label>
              <div className="flex flex-wrap gap-2">{personalities.map(p => <button key={p.id} onClick={() => handlePersonalityToggle(p.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedPersonalities.includes(p.id) ? 'bg-primary text-primary-foreground' : 'bg-white/10 hover:bg-white/20'}`}>{p.name}</button>)}</div>
              <div className="text-xs text-white/50 mt-2">
                Regel 6: Relevanz - Diese Eigenschaften helfen bei der passenden Symbolauswahl
              </div>
            </div>
            <button onClick={() => setStep(3)} disabled={!config.text} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Weiter zur Gestaltung</button>
          </motion.div>
        );
      case 3:
        const fontCategories = Array.from(new Set(filteredFonts.map(f => f.category)));
        return (
          <motion.div key="step3" className="space-y-12 animate-fade-in">
            <div className="flex items-center gap-2">
              <button onClick={handleUndo} disabled={past.length === 0} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"><Undo2 size={16}/> Rückgängig</button>
              <button onClick={handleRedo} disabled={future.length === 0} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"><Redo2 size={16}/> Wiederholen</button>
            </div>

            <Section title="Wählen Sie ein Symbol">{filteredIcons.map(icon => (<SelectionCard key={icon.id} isSelected={config.icon?.id === icon.id} onClick={() => updateConfig({ icon })}><icon.component className="w-12 h-12 mx-auto" color={config.palette ? config.palette.colors[1] : 'white'} /></SelectionCard>))}</Section>
            <div className="text-xs text-white/60 -mt-8 mb-4">
              Regel 2: Einprägsamkeit - Einfache Symbole bleiben besser im Gedächtnis
            </div>

            {fontCategories.map(category => (<Section key={category} title={`Schriftart: ${category}`}>
                {filteredFonts.filter(f => f.category === category).map(font => (<SelectionCard key={font.name} isSelected={config.font?.name === font.name} onClick={() => updateConfig({ font })}><p style={{ fontFamily: font.name }} className="text-2xl text-center">{font.name}</p></SelectionCard>))}
            </Section>))}
            <div className="text-xs text-white/60 -mt-8 mb-4">
              Regel 3: Zeitlosigkeit - Klassische Schriften überdauern Trends
            </div>

            <Section title="Wählen Sie ein Layout">{layouts.map(layout => (<LayoutSelectionCard key={layout.id} layout={layout} isSelected={config.layout?.id === layout.id} onClick={() => updateConfig({ layout })} />))}</Section>
            <div className="text-xs text-white/60 -mt-8 mb-4">
              Regel 4: Skalierbarkeit - Standard-Layouts funktionieren in jeder Größe
            </div>

            <Section title="Wählen Sie eine Farbpalette">{filteredPalettes.map(palette => (<SelectionCard key={palette.id} isSelected={config.palette?.id === palette.id} onClick={() => updateConfig({ palette })}>
                <div className="flex gap-2 w-full h-full">{palette.colors.map(c => <div key={c} style={{backgroundColor: c}} className="w-1/3 h-full rounded"></div>)}</div>
            </SelectionCard>))}</Section>
            <div className="text-xs text-white/60 -mt-8 mb-4">
              Regel 9: Intelligente Farbwahl - Farben transportieren Emotionen und Markenwerte
            </div>
          </motion.div>
        );
      default: return <div>Ungültiger Schritt</div>;
    }
  };

  const progress = (step / 3) * 100;
  const isLogoConfigComplete = config.icon && config.font && config.layout && config.palette && config.text;

  return (
    <>
      <Header />
      <main className="min-h-screen w-full grid md:grid-cols-2 pt-20">
        <div className="p-8 md:p-12 overflow-y-auto max-h-[calc(100vh-5rem)]">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>
        <div className="bg-black/50 p-8 md:p-12 h-screen sticky top-0 flex flex-col">
          <div className="w-full h-2 bg-white/10 rounded-full mb-4"><motion.div className="h-2 bg-primary rounded-full" animate={{ width: `${progress}%` }} /></div>

          <div className="flex border-b border-white/20 mb-6">
              <button onClick={() => setPreviewTab('preview')} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'}`}>Vorschau</button>
              <button onClick={() => setPreviewTab('mockups')} disabled={!isLogoConfigComplete} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'mockups' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'} disabled:text-white/20 disabled:cursor-not-allowed`}>Mockups</button>
          </div>

          <div className="flex-grow overflow-y-auto">
               <AnimatePresence mode="wait">
                  {previewTab === 'preview' && (
                      <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {isLogoConfigComplete ? <LogoPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Treffen Sie eine Auswahl, um die Vorschau zu sehen.</p></div>}
                      </motion.div>
                  )}
                   {previewTab === 'mockups' && (
                      <motion.div key="mockups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {isLogoConfigComplete? <MockupPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Vervollständigen Sie Ihr Logo, um die Mockups zu sehen.</p></div>}
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
}