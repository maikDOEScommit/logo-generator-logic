import { useMemo } from 'react';
import { LogoConfig, PaletteData } from '@/lib/types';
import { evaluateLogoDesign, suggestImprovements } from '@/lib/designRules';
import { Download, Save } from 'lucide-react';
import LogoCanvas from './LogoCanvas';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { fontCategories } from '@/lib/data';

const LogoPreview = ({ config, selectedFontCategory }: { config: LogoConfig; selectedFontCategory: string | null }) => {
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

  const evaluation = useMemo(() => evaluateLogoDesign(config), [config]);
  const suggestions = useMemo(() => suggestImprovements(config), [config]);

  const handleSave = () => {
    // Placeholder for database save logic
    alert('Save functionality coming soon!');
    console.log('Saving logo config:', config);
  };

  // Get the fonts for the selected category
  const fontsInSelectedCategory = selectedFontCategory ? fontCategories[selectedFontCategory] : null;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-primary">Design Quality</h3>
          <span className={`text-2xl font-bold ${evaluation.overallScore >= 80 ? 'text-green-400' : evaluation.overallScore >= 60 ? 'text-white' : 'text-red-400'}`}>
            {evaluation.overallScore}/100
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${evaluation.overallScore >= 80 ? 'bg-green-400' : evaluation.overallScore >= 60 ? 'bg-white' : 'bg-red-400'}`}
            style={{ width: `${evaluation.overallScore}%` }}
          />
        </div>
        {suggestions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-semibold text-primary mb-2">Improvement suggestions:</h4>
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

      {fontsInSelectedCategory ? (
        <div className="space-y-6">
          <h3 className="font-bold mb-4 text-primary">Logo Variations: {fontsInSelectedCategory[0].category}</h3>
          {fontsInSelectedCategory.map((font, index) => {
            const variationConfig = { ...config, font: font };
            const monochromeVariationConfig = { ...variationConfig, palette: monochromePalette };
            
            return (
              <div key={font.name} className="space-y-4 pb-6 border-b border-white/10 last:border-b-0">
                <h4 className="text-lg font-semibold text-white">{font.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2 text-primary text-sm">Color Version</h5>
                    <div className="bg-white/10 rounded-lg p-4">
                      <LogoCanvas config={variationConfig} idSuffix={`-color-${index}`} />
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2 text-primary text-sm">Monochrome</h5>
                    <div className="bg-black border border-white/20 rounded-lg p-4">
                      <LogoCanvas config={monochromeVariationConfig} idSuffix={`-mono-${index}`} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-white/50">
          <p>Choose a typography style to see logo variations.</p>
        </div>
      )}
      {/* === SAVE/DOWNLOAD ACTION AREA === */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <SignedIn>
          <button onClick={handleSave} disabled={!config.text} className="w-full bg-white/10 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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

        <button onClick={handleDownload} disabled={!config.text} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
          <Download size={18} /> Download SVG
        </button>
      </div>
    </div>
  );
};
export default LogoPreview;