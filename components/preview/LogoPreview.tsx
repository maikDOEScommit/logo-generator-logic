import { useMemo } from 'react';
import { LogoConfig, PaletteData } from '@/lib/types';
import { evaluateLogoDesign, suggestImprovements } from '@/lib/designRules';
import { Download, Save } from 'lucide-react';
import LogoCanvas from './LogoCanvas';

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

  const evaluation = useMemo(() => evaluateLogoDesign(config), [config]);
  const suggestions = useMemo(() => suggestImprovements(config), [config]);

  const handleSave = () => {
    // Placeholder for database save logic
    alert('Save functionality coming soon!');
    console.log('Saving logo config:', config);
  };

  return (
    <div className="space-y-6">
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
        <div className="bg-black border border-white/20 rounded-lg p-4"><LogoCanvas config={monochromeConfig} idSuffix="-mono" /></div>
      </div>
      {/* === SAVE/DOWNLOAD ACTION AREA === */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
        {/* Clerk authentication temporarily disabled - uncomment when Clerk is configured */}
        {/* <SignedIn>
          <button onClick={handleSave} disabled={!config.text} className="w-full bg-white/10 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Save size={18} /> Speichern
          </button>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full bg-white/10 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
              <Save size={18} /> Anmelden zum Speichern
            </button>
          </SignInButton>
        </SignedOut> */}
        
        <button onClick={handleSave} disabled={!config.text} className="w-full bg-white/10 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <Save size={18} /> Speichern
        </button>

        <button onClick={handleDownload} disabled={!config.text} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          <Download size={18} /> Download SVG
        </button>
      </div>
    </div>
  );
};
export default LogoPreview;