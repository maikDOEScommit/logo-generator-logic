import { LogoConfig } from '@/lib/types';
import Head from 'next/head';

const LogoCanvas = ({ config, idSuffix = '', backgroundColor = 'white' }: { config: LogoConfig, idSuffix?: string, backgroundColor?: 'white' | 'black' | 'gradient-black-text' | 'gradient-white-text' }) => {
  const { icon, font, layout, palette, text, slogan, enclosingShape } = config;
  if (!layout || !palette) return null;

  const IconComponent = icon?.component;
  const [bgColor, primaryColor, textColor] = palette.colors;
  
  // Set background based on version type (not part of the logo colors)
  const getLogoBackground = () => {
    if (backgroundColor === 'black') return '#000000';
    if (backgroundColor === 'white') return '#FFFFFF';
    if (backgroundColor === 'gradient-black-text') {
      // Light gradient for black text readability
      return `linear-gradient(135deg, ${bgColor || '#F8FAFC'}, ${primaryColor}30)`;
    }
    if (backgroundColor === 'gradient-white-text') {
      // Dark gradient for white text readability  
      return `linear-gradient(135deg, ${primaryColor}, ${textColor || '#1F2937'})`;
    }
    return '#FFFFFF';
  };
  
  const logoBackgroundColor = getLogoBackground();
  
  // Color priority differs between light and dark backgrounds
  const getBrandColor = () => {
    if (backgroundColor === 'black') {
      // Dark version: Brand gets the primary color (prominent on dark)
      return primaryColor;
    } else if (backgroundColor === 'white') {
      // Light version: Brand gets darker/stronger color (textColor is more prominent on white)
      return textColor || primaryColor;
    } else {
      // Gradient versions: Use specified text color
      return backgroundColor === 'gradient-black-text' ? '#000000' : '#FFFFFF';
    }
  };
  
  const getIconColor = () => {
    if (backgroundColor === 'black') {
      // Dark version: Icon gets secondary color
      if (textColor && textColor !== primaryColor) {
        return textColor;
      }
      return textColor || '#FFFFFF';
    } else if (backgroundColor === 'white') {
      // Light version: Icon gets the primary color (reversed from dark)
      return primaryColor;
    } else {
      // Gradient versions: Icon uses palette color that contrasts with text
      if (backgroundColor === 'gradient-black-text') {
        // With black text, icon uses primary or lighter color
        return primaryColor;
      } else {
        // With white text, icon uses darker color
        return textColor || primaryColor;
      }
    }
  };
  
  // NEUE REGEL: Brandname und Icon müssen unterschiedliche Farben haben
  const iconColor = getIconColor();
  const brandNameColor = getBrandColor();

  const fontUrl = font ? `https://fonts.googleapis.com/css2?family=${font.url.replace(/ /g, '+')}:wght@${font.weights.join(';')}&display=swap` : '';

  const renderContent = () => {
    const textLength = text.length || 10;
    const baseFontSize = 28;
    const fontSize = Math.max(14, baseFontSize - textLength * 0.5);
    const sloganFontSize = fontSize * 0.5;

    if (layout.arrangement === 'icon-top') {
      // Zentriere das gesamte Logo vertikal im 200x200 Container
      const totalHeight = 50 + 20 + fontSize + (slogan ? sloganFontSize + 10 : 0); // Icon + Gap + Text + Slogan
      const startY = (200 - totalHeight) / 2;
      
      return (
        <g>
          {IconComponent && <IconComponent x={75} y={startY} width={50} height={50} color={iconColor} />}
          <text x="100" y={startY + 50 + 25} fontSize={fontSize} fontWeight={config.fontWeight || 700} textAnchor="middle" dominantBaseline="middle" fill={brandNameColor}>{text || "Markenname"}</text>
          {slogan && <text x="100" y={startY + 50 + 25 + fontSize * 0.6 + 10} fontSize={sloganFontSize} textAnchor="middle" dominantBaseline="middle" fill={textColor}>{slogan}</text>}
        </g>
      );
    }
    if (layout.arrangement === 'icon-left') {
      const iconSize = 40;
      // Zentriere das gesamte Logo vertikal im Container
      const logoStartY = (200 - iconSize) / 2;
      const iconCenterY = logoStartY + iconSize / 2;
      
      return(
        <g transform="translate(20, 0)">
          {IconComponent && <IconComponent x={0} y={logoStartY} width={iconSize} height={iconSize} color={iconColor} />}
          <text x={iconSize + 15} y={iconCenterY} fontSize={fontSize * 0.8} fontWeight={config.fontWeight || 700} textAnchor="start" dominantBaseline="middle" fill={brandNameColor}>{text || "Markenname"}</text>
          {slogan && <text x={iconSize + 15} y={iconCenterY + fontSize * 0.6} fontSize={sloganFontSize * 0.9} textAnchor="start" dominantBaseline="middle" fill={textColor}>{slogan}</text>}
        </g>
      );
    }
    if (layout.arrangement === 'text-left') {
      const iconSize = 40;
      const textWidth = (text || "Markenname").length * fontSize * 0.4; // Estimate text width
      const totalWidth = textWidth + 20 + iconSize; // text + gap + icon
      const startX = (200 - totalWidth) / 2; // Center the entire logo horizontally
      
      // Center vertically considering both text and icon
      const logoStartY = (200 - iconSize) / 2;
      const textCenterY = logoStartY + iconSize / 2;
      
      return(
        <g>
          <text x={startX} y={textCenterY} fontSize={fontSize * 0.8} fontWeight={config.fontWeight || 700} textAnchor="start" dominantBaseline="middle" fill={brandNameColor}>{text || "Markenname"}</text>
          {slogan && <text x={startX} y={textCenterY + fontSize * 0.6} fontSize={sloganFontSize * 0.9} textAnchor="start" dominantBaseline="middle" fill={textColor}>{slogan}</text>}
          {icon && IconComponent && <IconComponent x={startX + textWidth + 20} y={logoStartY} width={iconSize} height={iconSize} color={iconColor} />}
        </g>
      );
    }
    if (layout.arrangement === 'text-top') {
      // Text über Icon - Brand Name oben, Icon unten
      const totalHeight = fontSize + 20 + 50 + (slogan ? sloganFontSize + 10 : 0); // Text + Gap + Icon + Slogan
      const startY = (200 - totalHeight) / 2;
      
      return (
        <g>
          <text x="100" y={startY + fontSize / 2} fontSize={fontSize} fontWeight={config.fontWeight || 700} textAnchor="middle" dominantBaseline="middle" fill={brandNameColor}>{text || "Markenname"}</text>
          {slogan && <text x="100" y={startY + fontSize + 10} fontSize={sloganFontSize} textAnchor="middle" dominantBaseline="middle" fill={textColor}>{slogan}</text>}
          {IconComponent && <IconComponent x={75} y={startY + fontSize + (slogan ? sloganFontSize + 10 : 0) + 20} width={50} height={50} color={iconColor} />}
        </g>
      );
    }
    return null;
  };

  const renderShape = () => {
    if (layout.type !== 'enclosed' || !enclosingShape) return null;
    const EnclosingShapeComponent = enclosingShape.component;
    return <EnclosingShapeComponent x={10} y={10} width={180} height={180} color={primaryColor} fill="none" stroke={primaryColor} strokeWidth="3" />;
  };

  const svgId = `logo-svg-${palette.id}${idSuffix}`;
  const gradientId = `gradient-${svgId}`;

  const renderBackground = () => {
    if (backgroundColor === 'gradient-black-text') {
      return (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={bgColor || '#F8FAFC'} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="200" height="200" fill={`url(#${gradientId})`} />
        </>
      );
    }
    if (backgroundColor === 'gradient-white-text') {
      return (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={textColor || '#1F2937'} />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="200" height="200" fill={`url(#${gradientId})`} />
        </>
      );
    }
    return <rect x="0" y="0" width="200" height="200" fill={logoBackgroundColor} />;
  };

  return (
    <>
      {font && <Head><link rel="stylesheet" href={fontUrl} /></Head>}
      <svg id={svgId} width="100%" height="auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {font && <style>{`#${svgId} text { font-family: '${font.name}', ${font.family}; }`}</style>}
        {renderBackground()}
        {renderShape()}
        {renderContent()}
      </svg>
    </>
  );
};
export default LogoCanvas;