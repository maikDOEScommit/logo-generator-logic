// lib/iconSets.ts
import { IconData } from './types';
import { availableIcons } from './suggestionEngine';

// React Icons imports
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as CgIcons from 'react-icons/cg';
import * as FaIcons from 'react-icons/fa';
import * as FcIcons from 'react-icons/fc';
import * as FiIcons from 'react-icons/fi';
import * as GoIcons from 'react-icons/go';
import * as GrIcons from 'react-icons/gr';
import * as HiIcons from 'react-icons/hi';
import * as ImIcons from 'react-icons/im';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import * as TiIcons from 'react-icons/ti';
import * as VscIcons from 'react-icons/vsc';
import * as WiIcons from 'react-icons/wi';

export interface IconSet {
  id: string;
  name: string;
  description: string;
  iconCount: number;
  style: string;
  icons: IconData[];
}

// Helper function to convert React Icons to IconData format
const convertReactIconsToIconData = (iconLibrary: any, prefix: string, sampleSize: number = 120): IconData[] => {
  const iconEntries = Object.entries(iconLibrary);
  const selectedIcons = iconEntries.slice(0, Math.min(sampleSize, iconEntries.length));

  return selectedIcons.map(([iconName, IconComponent]) => ({
    id: `${prefix}-${iconName.toLowerCase()}`,
    component: IconComponent as any,
    tags: ['react-icons', prefix.toLowerCase()]
  }));
};

export const iconSets: IconSet[] = [
  {
    id: 'lucide',
    name: 'Lucide Icons',
    description: 'Clean, customizable and consistent SVG icon library',
    iconCount: 120,
    style: 'Outline',
    icons: availableIcons
  },
  {
    id: 'ant-design',
    name: 'Ant Design Icons',
    description: 'Enterprise-class UI design language icons',
    iconCount: 120,
    style: 'Outline & Filled',
    icons: convertReactIconsToIconData(AiIcons, 'ai', 120)
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap Icons',
    description: 'Free, high quality, open source icon library',
    iconCount: 120,
    style: 'Outline & Filled',
    icons: convertReactIconsToIconData(BiIcons, 'bi', 120)
  },
  {
    id: 'bootstrap-icons',
    name: 'Bootstrap Icons v2',
    description: 'Official Bootstrap icon library',
    iconCount: 120,
    style: 'Outline',
    icons: convertReactIconsToIconData(BsIcons, 'bs', 120)
  },
  {
    id: 'css-gg',
    name: 'CSS.gg',
    description: '700+ Pure CSS, SVG & Figma UI Icons',
    iconCount: 120,
    style: 'Minimalist',
    icons: convertReactIconsToIconData(CgIcons, 'cg', 120)
  },
  {
    id: 'font-awesome',
    name: 'Font Awesome',
    description: 'The world\'s most popular icon library',
    iconCount: 120,
    style: 'Solid',
    icons: convertReactIconsToIconData(FaIcons, 'fa', 120)
  },
  {
    id: 'flat-color',
    name: 'Flat Color Icons',
    description: 'Beautiful flat design icons with colors',
    iconCount: 120,
    style: 'Flat Color',
    icons: convertReactIconsToIconData(FcIcons, 'fc', 120)
  },
  {
    id: 'feather',
    name: 'Feather Icons',
    description: 'Simply beautiful open source icons',
    iconCount: 120,
    style: 'Outline',
    icons: convertReactIconsToIconData(FiIcons, 'fi', 120)
  },
  {
    id: 'github-octicons',
    name: 'GitHub Octicons',
    description: 'GitHub\'s icon library',
    iconCount: 120,
    style: 'Outline',
    icons: convertReactIconsToIconData(GoIcons, 'go', 120)
  },
  {
    id: 'grommet',
    name: 'Grommet Icons',
    description: 'React-based framework icon library',
    iconCount: 120,
    style: 'Outline',
    icons: convertReactIconsToIconData(GrIcons, 'gr', 120)
  },
  {
    id: 'heroicons',
    name: 'Heroicons',
    description: 'Beautiful hand-crafted SVG icons by Tailwind CSS',
    iconCount: 120,
    style: 'Outline & Solid',
    icons: convertReactIconsToIconData(HiIcons, 'hi', 120)
  },
  {
    id: 'icomoon',
    name: 'IcoMoon Free',
    description: 'Free vector icons in SVG, PSD, PNG, AI and Icon font formats',
    iconCount: 120,
    style: 'Outline',
    icons: convertReactIconsToIconData(ImIcons, 'im', 120)
  },
  {
    id: 'ionicons4',
    name: 'Ionicons v4',
    description: 'Premium designed icons for use in web, iOS, Android',
    iconCount: 120,
    style: 'Outline & Filled',
    icons: convertReactIconsToIconData(IoIcons, 'io', 120)
  },
  {
    id: 'material-design',
    name: 'Material Design Icons',
    description: 'Google\'s Material Design icon library',
    iconCount: 120,
    style: 'Filled',
    icons: convertReactIconsToIconData(MdIcons, 'md', 120)
  },
  {
    id: 'remix',
    name: 'Remix Icons',
    description: 'Open-source neutral-style icon system',
    iconCount: 120,
    style: 'Outline & Filled',
    icons: convertReactIconsToIconData(RiIcons, 'ri', 120)
  },
  {
    id: 'simple-icons',
    name: 'Simple Icons',
    description: 'Free SVG icons for popular brands',
    iconCount: 120,
    style: 'Brand',
    icons: convertReactIconsToIconData(SiIcons, 'si', 120)
  },
  {
    id: 'typicons',
    name: 'Typicons',
    description: '336 pixel perfect, all-purpose vector icons',
    iconCount: 120,
    style: 'Outline',
    icons: convertReactIconsToIconData(TiIcons, 'ti', 120)
  },
  {
    id: 'vs-code',
    name: 'VS Code Icons',
    description: 'Icons used in Visual Studio Code',
    iconCount: 120,
    style: 'Outline',
    icons: convertReactIconsToIconData(VscIcons, 'vsc', 120)
  },
  {
    id: 'weather',
    name: 'Weather Icons',
    description: '222 weather themed icons inspired by Font Awesome',
    iconCount: 120,
    style: 'Outline',
    icons: convertReactIconsToIconData(WiIcons, 'wi', 120)
  }
];

// Get icon set by ID
export const getIconSetById = (id: string): IconSet | undefined => {
  return iconSets.find(set => set.id === id);
};

// Get all icon set names and IDs
export const getIconSetList = (): Array<{id: string, name: string, description: string, iconCount: number, style: string}> => {
  return iconSets.map(set => ({
    id: set.id,
    name: set.name,
    description: set.description,
    iconCount: set.iconCount,
    style: set.style
  }));
};