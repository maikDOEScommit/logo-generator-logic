import { useMemo } from 'react';
import { LogoConfig, PaletteData } from '@/lib/types';
import { Download, Save } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useLogoStore } from '@/lib/state';
import { fontCategories } from '@/lib/data';

const LogoPreview = ({ config, selectedFontCategory }: { config: LogoConfig; selectedFontCategory: string | null }) => {
  // Get the current logo state from the new store
  const { text, fontInfo, fontWeight, colorPalette } = useLogoStore();
  
  // Get all fonts from the selected category
  const selectedCategoryFonts = selectedFontCategory ? 
    fontCategories.find(cat => cat.name === selectedFontCategory)?.fonts || [] : [];
  
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
    console.log('Saving logo config:', { text, fontInfo, fontWeight, colorPalette });
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-primary">Generated Logos: {selectedFontCategory} Category</h3>
      
      {/* Show all fonts from the selected category */}
      {selectedCategoryFonts.map((font, fontIndex) => (
        <div key={font.name} className="space-y-4 pb-8 border-b border-white/10 last:border-b-0">
          <h4 className="text-xl font-semibold text-white">{font.name}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light Version */}
            <div>
              <h5 className="font-medium mb-2 text-primary text-sm">Light Version</h5>
              <div className="bg-white/10 border border-white rounded-lg p-4">
                <div 
                  id={`logo-${font.name.replace(/\s+/g, '-')}-light-${fontIndex}`}
                  className="text-4xl font-bold text-center p-6 rounded"
                  style={{ 
                    fontFamily: font.cssName,
                    fontWeight: font.generationWeights[0],
                    color: colorPalette.colors[0],
                    backgroundColor: colorPalette.colors[3]
                  }}
                >
                  {text}
                </div>
              </div>
            </div>

            {/* Dark Version */}
            <div>
              <h5 className="font-medium mb-2 text-primary text-sm">Dark Version</h5>
              <div className="bg-black border border-white/20 rounded-lg p-4">
                <div 
                  className="text-4xl font-bold text-center p-6 rounded"
                  style={{ 
                    fontFamily: font.cssName,
                    fontWeight: font.generationWeights[1] || font.generationWeights[0],
                    color: colorPalette.colors[3],
                    backgroundColor: colorPalette.colors[0]
                  }}
                >
                  {text}
                </div>
              </div>
            </div>

            {/* Accent Version */}
            <div>
              <h5 className="font-medium mb-2 text-primary text-sm">Accent Version</h5>
              <div className="bg-white/10 border border-white rounded-lg p-4">
                <div 
                  className="text-4xl font-bold text-center p-6 rounded"
                  style={{ 
                    fontFamily: font.cssName,
                    fontWeight: font.generationWeights[0],
                    color: colorPalette.colors[2],
                    backgroundColor: colorPalette.colors[3]
                  }}
                >
                  {text}
                </div>
              </div>
            </div>

            {/* Secondary Version */}
            <div>
              <h5 className="font-medium mb-2 text-primary text-sm">Secondary Version</h5>
              <div className="bg-white/10 border border-white rounded-lg p-4">
                <div 
                  className="text-4xl font-bold text-center p-6 rounded"
                  style={{ 
                    fontFamily: font.cssName,
                    fontWeight: font.generationWeights[1] || font.generationWeights[0],
                    color: colorPalette.colors[1],
                    backgroundColor: colorPalette.colors[3]
                  }}
                >
                  {text}
                </div>
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