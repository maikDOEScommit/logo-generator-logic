import { LogoConfig } from '@/lib/types';
import LogoCanvas from './LogoCanvas';

const MockupPreview = ({ config }: { config: LogoConfig }) => {
  if(!config.palette) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-lg aspect-[10/6] w-full flex items-center">
        <div className="w-1/3"><div style={{ transform: 'scale(0.5)' }}><LogoCanvas config={config} idSuffix="-bc" /></div></div>
        <div className="w-2/3 border-l-2 border-gray-200 pl-4">
          <p className="text-black font-bold text-xl">{config.text || "Dein Name"}</p><p className="text-gray-500 text-sm">Deine Position</p>
          <div className="mt-4 space-y-1 text-xs text-gray-700"><p>+49 123 456 7890</p><p>hallo@deinemarke.de</p></div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg w-full flex items-center justify-between">
        <div className="w-1/4"><div style={{ transform: 'scale(0.3)', transformOrigin: 'left center' }}><LogoCanvas config={config} idSuffix="-web" /></div></div>
        <div className="flex items-center gap-4 text-sm text-gray-300"><p>Produkte</p><p>Über Uns</p><p>Kontakt</p></div>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg w-full">
        <p className="text-center font-bold text-white mb-4">App Icon</p>
        <div className="flex justify-center items-center gap-6">
          <div className="w-20 h-20 bg-black rounded-3xl overflow-hidden"><LogoCanvas config={config} idSuffix="-app-dark" /></div>
          <div className="w-20 h-20 bg-white rounded-3xl overflow-hidden"><LogoCanvas config={{...config, palette: {...config.palette, colors: [config.palette.colors[0], config.palette.colors[2], config.palette.colors[2]]}}} idSuffix="-app-light" /></div>
        </div>
      </div>
    </div>
  );
};
export default MockupPreview;