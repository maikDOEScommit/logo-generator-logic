import { LogoConfig } from '@/lib/types';
import Head from 'next/head';

const LogoCanvas = ({ config, idSuffix = '' }: { config: LogoConfig, idSuffix?: string }) => {
  const { icon, font, layout, palette, text, slogan } = config;
  if (!icon || !font || !layout || !palette) return null;

  const IconComponent = icon.component;
  const [bgColor, primaryColor, textColor] = palette.colors;
  
  // NEUE REGEL 11: Brandname bekommt die prominenteste Farbe (außer bei Schwarz/Weiß)
  const getMostProminentColor = () => {
    // Wenn primaryColor schwarz oder weiß ist, verwende textColor für den Brandname
    const isBlackOrWhite = (color: string) => {
      const hex = color.toLowerCase();
      return hex === '#ffffff' || hex === '#000000' || hex === '#fff' || hex === '#000' ||
             hex === '#f8fafc' || hex === '#1e293b' || hex === '#1f2937'; // Sehr helle/dunkle Grautöne
    };
    
    if (isBlackOrWhite(primaryColor)) {
      return textColor; // Verwende textColor als prominente Farbe
    }
    return primaryColor; // Verwende die Hauptfarbe der Palette
  };
  
  const brandNameColor = getMostProminentColor();

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
          <text x="100" y={110} fontSize={fontSize} fontWeight="bold" textAnchor="middle" fill={brandNameColor}>{text || "Markenname"}</text>
          {slogan && <text x="100" y={110 + sloganFontSize + 5} fontSize={sloganFontSize} textAnchor="middle" fill={textColor}>{slogan}</text>}
        </g>
      );
    }
    if (layout.arrangement === 'icon-left') {
      const iconSize = 40;
      const iconCenterY = 55 + iconSize / 2; // Icon-Mitte bei Y=75
      return(
        <g transform="translate(20, 0)">
          <IconComponent x={0} y={55} width={iconSize} height={iconSize} color={primaryColor} />
          <text x={iconSize + 15} y={iconCenterY + (fontSize * 0.8 * 0.35)} fontSize={fontSize * 0.8} fontWeight="bold" textAnchor="start" dominantBaseline="middle" fill={brandNameColor}>{text || "Markenname"}</text>
          {slogan && <text x={iconSize + 15} y={iconCenterY + (fontSize * 0.8 * 0.35) + sloganFontSize} fontSize={sloganFontSize * 0.9} textAnchor="start" fill={textColor}>{slogan}</text>}
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

  const svgId = `logo-svg-${palette.id}${idSuffix}`;

  return (
    <>
      <Head><link rel="stylesheet" href={fontUrl} /></Head>
      <svg id={svgId} width="100%" height="auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <style>{`#${svgId} text { font-family: '${font.name}', ${font.family}; }`}</style>
        {layout.type === 'enclosed' && <rect x="0" y="0" width="200" height="200" fill={bgColor} rx={layout.shape === 'circle' ? 100 : 20}/>}
        {renderShape()}
        {renderContent()}
      </svg>
    </>
  );
};
export default LogoCanvas;