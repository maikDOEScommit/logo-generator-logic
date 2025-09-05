// lib/suggestionEngine.ts
import { fontCategories, colorPalettes, layouts, FontCategory, ColorPalette, FontInfo } from './data';
import { IconData, FontData, PaletteData } from './types';
import { 
  Heart, Star, Shield, Zap, Leaf, Coffee, Camera, Music, Gamepad2, Palette, Code, Target, Lightbulb, Rocket,
  Circle, Square, Triangle, Diamond, Hexagon, Pentagon, Minus, Plus, X, Check, ArrowRight, ArrowUp,
  Sun, Moon, Cloud, Flame, Droplets, Mountain, TreePine, Flower2, Building, 
  Car, Plane, Ship, Bike, Train, Globe, Map, Compass, Phone, Mail, Wifi,
  Battery, Settings, Search, Volume2, Play, Pause,
  ThumbsUp, ThumbsDown, Smile, AlertCircle, CheckCircle, Info, HelpCircle, Bell,
  ShoppingCart, CreditCard, DollarSign, TrendingUp, TrendingDown, BarChart, PieChart,
  Bookmark, Users, User, UserPlus, MessageCircle, Send,
  Edit, Trash2, Copy, Download, Upload, Share, Link, RefreshCw,
  ArrowLeft, ArrowDown, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Archive, Folder, File, Image,
  Power, Plug, Smartphone, Laptop, Monitor, Expand, Minimize2,
  Square as StopIcon
} from 'lucide-react';

// 100 Best Icons Collection - Choose your favorites!
export const availableIcons: IconData[] = [
  // === BASIC SHAPES & SYMBOLS (10) ===
  { id: 'circle', component: Circle, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'square', component: Square, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'triangle', component: Triangle, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'diamond', component: Diamond, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'hexagon', component: Hexagon, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'pentagon', component: Pentagon, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'star', component: Star, tags: ['quality', 'premium', 'excellence', 'rating'] },
  { id: 'heart', component: Heart, tags: ['love', 'health', 'care', 'wellness'] },
  { id: 'plus', component: Plus, tags: ['symbol', 'universal', 'simple', 'clean', 'minimalist'] },
  { id: 'minus', component: Minus, tags: ['symbol', 'universal', 'simple', 'clean', 'minimalist'] },

  // === NATURE & WEATHER (10) ===
  { id: 'sun', component: Sun, tags: ['nature', 'weather', 'energy', 'bright', 'summer'] },
  { id: 'moon', component: Moon, tags: ['nature', 'weather', 'night', 'calm', 'serene'] },
  { id: 'cloud', component: Cloud, tags: ['nature', 'weather', 'soft', 'tech', 'storage'] },
  { id: 'flame', component: Flame, tags: ['nature', 'energy', 'passion', 'hot', 'dynamic'] },
  { id: 'droplets', component: Droplets, tags: ['nature', 'water', 'clean', 'pure', 'fresh'] },
  { id: 'leaf', component: Leaf, tags: ['nature', 'eco', 'organic', 'green', 'sustainable'] },
  { id: 'tree', component: TreePine, tags: ['nature', 'growth', 'stability', 'eco', 'life'] },
  { id: 'flower', component: Flower2, tags: ['nature', 'beauty', 'delicate', 'spring', 'organic'] },
  { id: 'mountain', component: Mountain, tags: ['nature', 'strength', 'stability', 'adventure', 'outdoor'] },
  { id: 'zap', component: Zap, tags: ['energy', 'power', 'electric', 'fast', 'dynamic'] },

  // === BUSINESS & FINANCE (10) ===
  { id: 'dollar-sign', component: DollarSign, tags: ['business', 'finance', 'money', 'profit', 'success'] },
  { id: 'trending-up', component: TrendingUp, tags: ['business', 'growth', 'success', 'progress', 'analytics'] },
  { id: 'trending-down', component: TrendingDown, tags: ['business', 'analytics', 'decline', 'data'] },
  { id: 'bar-chart', component: BarChart, tags: ['business', 'analytics', 'data', 'statistics', 'reporting'] },
  { id: 'pie-chart', component: PieChart, tags: ['business', 'analytics', 'data', 'statistics', 'distribution'] },
  { id: 'shopping-cart', component: ShoppingCart, tags: ['business', 'ecommerce', 'retail', 'shopping', 'commerce'] },
  { id: 'credit-card', component: CreditCard, tags: ['business', 'finance', 'payment', 'transaction', 'money'] },
  { id: 'building', component: Building, tags: ['business', 'corporate', 'office', 'company', 'professional'] },
  { id: 'briefcase', component: Target, tags: ['business', 'professional', 'work', 'career', 'corporate'] },
  { id: 'handshake', component: Users, tags: ['business', 'partnership', 'collaboration', 'trust', 'agreement'] },

  // === TECHNOLOGY & DIGITAL (15) ===
  { id: 'code', component: Code, tags: ['tech', 'development', 'programming', 'digital', 'software'] },
  { id: 'smartphone', component: Smartphone, tags: ['tech', 'mobile', 'communication', 'modern', 'digital'] },
  { id: 'laptop', component: Laptop, tags: ['tech', 'computer', 'work', 'digital', 'productivity'] },
  { id: 'monitor', component: Monitor, tags: ['tech', 'computer', 'display', 'screen', 'digital'] },
  { id: 'wifi', component: Wifi, tags: ['tech', 'internet', 'connection', 'wireless', 'communication'] },
  { id: 'battery', component: Battery, tags: ['tech', 'power', 'energy', 'mobile', 'device'] },
  { id: 'settings', component: Settings, tags: ['tech', 'configuration', 'tools', 'control', 'system'] },
  { id: 'search', component: Search, tags: ['tech', 'find', 'discover', 'explore', 'magnify'] },
  { id: 'globe', component: Globe, tags: ['tech', 'world', 'global', 'internet', 'universal'] },
  { id: 'lightbulb', component: Lightbulb, tags: ['tech', 'idea', 'innovation', 'creativity', 'solution'] },
  { id: 'gamepad-2', component: Gamepad2, tags: ['tech', 'gaming', 'entertainment', 'play', 'interactive'] },
  { id: 'coffee', component: Coffee, tags: ['beverage', 'energy', 'cafe', 'break', 'social'] },
  { id: 'plug', component: Plug, tags: ['tech', 'power', 'connection', 'energy', 'electric'] },

  // === TRANSPORTATION (8) ===
  { id: 'car', component: Car, tags: ['transport', 'vehicle', 'automotive', 'travel', 'mobility'] },
  { id: 'plane', component: Plane, tags: ['transport', 'travel', 'aviation', 'flight', 'journey'] },
  { id: 'ship', component: Ship, tags: ['transport', 'maritime', 'shipping', 'cargo', 'ocean'] },
  { id: 'bicycle', component: Bike, tags: ['transport', 'eco', 'healthy', 'sport', 'sustainable'] },
  { id: 'train', component: Train, tags: ['transport', 'railway', 'travel', 'commute', 'transit'] },
  { id: 'rocket', component: Rocket, tags: ['startup', 'growth', 'speed', 'innovation', 'launch'] },
  { id: 'compass', component: Compass, tags: ['navigation', 'direction', 'travel', 'adventure', 'guidance'] },
  { id: 'map', component: Map, tags: ['navigation', 'location', 'travel', 'geography', 'direction'] },

  // === COMMUNICATION & SOCIAL (8) ===
  { id: 'phone', component: Phone, tags: ['communication', 'contact', 'call', 'support', 'service'] },
  { id: 'mail', component: Mail, tags: ['communication', 'email', 'message', 'contact', 'correspondence'] },
  { id: 'message-circle', component: MessageCircle, tags: ['communication', 'chat', 'conversation', 'support', 'social'] },
  { id: 'send', component: Send, tags: ['communication', 'deliver', 'message', 'transmit', 'share'] },
  { id: 'users', component: Users, tags: ['social', 'team', 'community', 'group', 'collaboration'] },
  { id: 'user', component: User, tags: ['personal', 'profile', 'individual', 'account', 'identity'] },
  { id: 'user-plus', component: UserPlus, tags: ['social', 'add', 'invite', 'join', 'community'] },
  { id: 'bell', component: Bell, tags: ['notification', 'alert', 'reminder', 'announcement', 'attention'] },

  // === CREATIVE & MEDIA (8) ===
  { id: 'palette', component: Palette, tags: ['design', 'creative', 'art', 'color', 'artistic'] },
  { id: 'camera', component: Camera, tags: ['photography', 'media', 'creative', 'visual', 'capture'] },
  { id: 'music', component: Music, tags: ['audio', 'entertainment', 'creative', 'sound', 'artistic'] },
  { id: 'play', component: Play, tags: ['media', 'video', 'audio', 'entertainment', 'start'] },
  { id: 'pause', component: Pause, tags: ['media', 'video', 'audio', 'control', 'stop'] },
  { id: 'stop', component: StopIcon, tags: ['media', 'video', 'audio', 'control', 'end'] },
  { id: 'volume-2', component: Volume2, tags: ['media', 'audio', 'sound', 'speaker', 'music'] },
  { id: 'image', component: Image, tags: ['media', 'photo', 'picture', 'visual', 'graphic'] },

  // === ACTIONS & INTERFACE (12) ===
  { id: 'edit', component: Edit, tags: ['action', 'modify', 'change', 'update', 'create'] },
  { id: 'trash', component: Trash2, tags: ['action', 'remove', 'trash', 'eliminate', 'clear'] },
  { id: 'copy', component: Copy, tags: ['action', 'duplicate', 'clone', 'reproduce', 'backup'] },
  { id: 'download', component: Download, tags: ['action', 'save', 'get', 'retrieve', 'transfer'] },
  { id: 'upload', component: Upload, tags: ['action', 'send', 'transfer', 'share', 'submit'] },
  { id: 'share', component: Share, tags: ['action', 'distribute', 'spread', 'social', 'network'] },
  { id: 'link', component: Link, tags: ['connection', 'url', 'reference', 'relate', 'join'] },
  { id: 'refresh-cw', component: RefreshCw, tags: ['action', 'reload', 'update', 'sync', 'renew'] },
  { id: 'expand', component: Expand, tags: ['action', 'expand', 'fullscreen', 'enlarge', 'grow'] },
  { id: 'minimize', component: Minimize2, tags: ['action', 'shrink', 'collapse', 'reduce', 'compress'] },
  { id: 'power', component: Power, tags: ['control', 'on-off', 'start', 'shutdown', 'energy'] },
  { id: 'x', component: X, tags: ['close', 'cancel', 'remove', 'delete', 'exit'] },

  // === ARROWS & DIRECTION (8) ===
  { id: 'arrow-up', component: ArrowUp, tags: ['direction', 'navigation', 'up', 'top', 'ascend'] },
  { id: 'arrow-down', component: ArrowDown, tags: ['direction', 'navigation', 'down', 'bottom', 'descend'] },
  { id: 'arrow-left', component: ArrowLeft, tags: ['direction', 'navigation', 'left', 'back', 'previous'] },
  { id: 'arrow-right', component: ArrowRight, tags: ['direction', 'navigation', 'right', 'forward', 'next'] },
  { id: 'chevron-up', component: ChevronUp, tags: ['direction', 'navigation', 'up', 'expand', 'show'] },
  { id: 'chevron-down', component: ChevronDown, tags: ['direction', 'navigation', 'down', 'collapse', 'hide'] },
  { id: 'chevron-left', component: ChevronLeft, tags: ['direction', 'navigation', 'left', 'back', 'previous'] },
  { id: 'chevron-right', component: ChevronRight, tags: ['direction', 'navigation', 'right', 'forward', 'next'] },

  // === STATUS & FEEDBACK (7) ===
  { id: 'check-circle', component: CheckCircle, tags: ['success', 'complete', 'done', 'verified', 'approved'] },
  { id: 'alert-circle', component: AlertCircle, tags: ['warning', 'attention', 'caution', 'important', 'notice'] },
  { id: 'info', component: Info, tags: ['information', 'help', 'details', 'explain', 'guide'] },
  { id: 'help-circle', component: HelpCircle, tags: ['support', 'question', 'assistance', 'help', 'guide'] },
  { id: 'thumbs-up', component: ThumbsUp, tags: ['positive', 'like', 'approve', 'good', 'success'] },
  { id: 'thumbs-down', component: ThumbsDown, tags: ['negative', 'dislike', 'disapprove', 'bad', 'reject'] },
  { id: 'smile', component: Smile, tags: ['happy', 'positive', 'emotion', 'good', 'satisfied'] },

  // === ORGANIZATION & FILES (4) ===
  { id: 'folder', component: Folder, tags: ['organization', 'storage', 'files', 'directory', 'structure'] },
  { id: 'file', component: File, tags: ['document', 'data', 'storage', 'information', 'content'] },
  { id: 'bookmark', component: Bookmark, tags: ['save', 'favorite', 'mark', 'remember', 'important'] },
  { id: 'archive', component: Archive, tags: ['storage', 'backup', 'preserve', 'organize', 'history'] }
];

// Convert original color palettes + intensive colors to PaletteData format
const intensiveColors: PaletteData[] = [
  { id: 'red', name: 'Intensiv Rot', colors: ['#E53E3E', '#FC8181', '#FFFFFF'], tags: ['red', 'intense'] },
  { id: 'orange', name: 'Intensiv Orange', colors: ['#FF8C00', '#FFA500', '#FFFFFF'], tags: ['orange', 'intense'] },
  { id: 'yellow', name: 'Intensiv Gelb', colors: ['#FFD700', '#FFED4E', '#000000'], tags: ['yellow', 'intense'] },
  { id: 'green', name: 'Intensiv Grün', colors: ['#38A169', '#68D391', '#FFFFFF'], tags: ['green', 'intense'] },
  { id: 'teal', name: 'Intensiv Türkis', colors: ['#319795', '#4FD1C7', '#FFFFFF'], tags: ['teal', 'intense'] },
  { id: 'blue', name: 'Intensiv Blau', colors: ['#3182CE', '#63B3ED', '#FFFFFF'], tags: ['blue', 'intense'] },
  { id: 'cyan', name: 'Intensiv Cyan', colors: ['#00B5D8', '#00E5FF', '#FFFFFF'], tags: ['cyan', 'intense'] },
  { id: 'purple', name: 'Intensiv Lila', colors: ['#805AD5', '#B794F6', '#FFFFFF'], tags: ['purple', 'intense'] },
  { id: 'pink', name: 'Intensiv Pink', colors: ['#D53F8C', '#F687B3', '#FFFFFF'], tags: ['pink', 'intense'] },
  { id: 'indigo', name: 'Intensiv Indigo', colors: ['#4C51BF', '#7C3AED', '#FFFFFF'], tags: ['indigo', 'intense'] },
  { id: 'gray', name: 'Intensiv Grau', colors: ['#4A5568', '#A0AEC0', '#FFFFFF'], tags: ['gray', 'intense'] },
  { id: 'black', name: 'Intensiv Schwarz', colors: ['#1A202C', '#4A5568', '#FFFFFF'], tags: ['black', 'intense'] },
  { id: 'brown', name: 'Intensiv Braun', colors: ['#8B4513', '#D2691E', '#FFFFFF'], tags: ['brown', 'intense'] },
  { id: 'lime', name: 'Intensiv Limette', colors: ['#84CC16', '#A3E635', '#000000'], tags: ['lime', 'intense'] }
];

// Convert original colorPalettes to PaletteData format
export const suggestionPalettes: PaletteData[] = [
  // Original rule-based palettes
  ...colorPalettes.map((palette, index) => ({
    id: `palette-${index}`,
    name: palette.name,
    colors: [palette.colors[0], palette.colors[1], palette.colors[3]] as [string, string, string],
    tags: palette.name.includes('Seriös') ? ['corporate', 'trust'] :
          palette.name.includes('Modern') ? ['tech', 'modern'] :
          palette.name.includes('Natürlich') ? ['nature', 'eco'] :
          palette.name.includes('Elegant') ? ['luxury', 'elegant'] :
          palette.name.includes('Dynamisch') ? ['energy', 'bold'] :
          ['friendly', 'soft']
  })),
  // Add intensive colors
  ...intensiveColors
];

export interface Suggestions {
  suggestedIcons: IconData[];
  suggestedFonts: FontData[];
  suggestedPalettes: PaletteData[];
}

export function getInitialSuggestions(industry: string, keywords: string[]): Suggestions {
  let suggestedFontCategory: FontCategory = fontCategories[0]; // Standard: Modern
  let suggestedPalette: ColorPalette = colorPalettes[0]; // Standard: Seriös

  // ----- Hier beginnt dein Expertensystem (Regelwerk) -----

  // Regel 1: Kreativ-Branchen (Design, Kunst, Fotografie)
  if (['design', 'art', 'photography', 'mode'].includes(industry) || keywords.includes('kreativ')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Elegant')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Luxuriös'))!;
  }

  // Regel 2: Tech- & Finanz-Branchen
  if (['tech', 'finance', 'consulting'].includes(industry) || keywords.includes('zukunft')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Modern')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Technisch'))!;
  }

  // Regel 3: Natur- & Gesundheits-Branchen
  if (['health', 'wellness', 'food'].includes(industry) || keywords.includes('natur')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Heritage')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Natürlich'))!;
  }

  // Regel 4: Starke, laute Branchen (Sport, Events)
  if (['sports', 'events', 'gaming'].includes(industry) || keywords.includes('energie')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Bold')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Dynamisch'))!;
  }

  // Show exactly 28 icons - fixed selection
  const suggestedIcons = availableIcons.slice(0, 28);

  // Convert font categories to FontData format
  const suggestedFonts: FontData[] = [];
  fontCategories.forEach(category => {
    category.fonts.forEach(font => {
      suggestedFonts.push({
        name: font.name,
        family: font.cssName,
        url: `https://fonts.googleapis.com/css2?family=${font.name.replace(/\s+/g, '+')}:wght@${font.editorWeights.join(';')}&display=swap`,
        weights: font.editorWeights,
        category: category.name
      });
    });
  });

  return {
    suggestedIcons,
    suggestedFonts: suggestedFonts.slice(0, 8),
    suggestedPalettes: suggestionPalettes.slice(0, 20) // Include all color options
  };
}

// =================================================================
// COMPATIBILITY LAYER - Old getSuggestions function for existing components
// =================================================================
export function getSuggestions(industry: string | null, selectedPersonalities: string[], currentConfig: any) {
  // Convert new FontInfo to old FontData format
  const convertedFonts = fontCategories.flatMap(cat => 
    cat.fonts.map(font => ({
      name: font.name,
      family: 'sans-serif', // Default fallback
      url: font.name.replace(/\s+/g, '+'),
      weights: font.editorWeights,
      category: cat.name
    }))
  );

  // Convert new ColorPalette to old PaletteData format  
  const convertedPalettes = colorPalettes.map(palette => ({
    id: palette.name.toLowerCase().replace(/\s+/g, '-'),
    name: palette.name,
    colors: [palette.colors[3], palette.colors[0], palette.colors[2]] as [string, string, string], // [background, primary, text]
    tags: []
  }));

  return {
    suggestedIcons: availableIcons.slice(0, 28),
    suggestedFonts: convertedFonts,
    suggestedPalettes: convertedPalettes,
  };
}