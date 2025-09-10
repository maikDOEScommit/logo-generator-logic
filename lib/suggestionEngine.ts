// lib/suggestionEngine.ts
import { fontCategories, colorPalettes, layouts, FontCategory, ColorPalette, FontInfo } from './data';
import { IconData, FontData, PaletteData } from './types';
import { 
  // BASIC SHAPES & SYMBOLS (9)
  Circle, Square, Triangle, Diamond, Hexagon, Pentagon, Star, Heart, Plus,
  // NATURE & WEATHER (10)  
  Sun, Cloud, Flame, Droplets, Leaf, TreePine, Flower2, Mountain, Zap,
  // BUSINESS & FINANCE (10)
  DollarSign, TrendingUp, BarChart, PieChart, ShoppingCart, CreditCard, Building, Target as Briefcase, Users as Handshake,
  // TECHNOLOGY & DIGITAL (13)
  Code, Smartphone, Laptop, Monitor, Wifi, Battery, Settings, Search, Globe, Lightbulb, Gamepad2, Coffee, Plug,
  // TRANSPORTATION (8)
  Car, Plane, Ship, Bike, Train, Rocket, Compass, Map,
  // COMMUNICATION & SOCIAL (8)
  Phone, Mail, MessageCircle, Send, Users, User, UserPlus, Bell,
  // CREATIVE & MEDIA (8)
  Palette, Camera, Music, Play, Pause, Square as StopIcon, Volume2, Image,
  // ACTIONS & INTERFACE (12)
  Edit, Trash2, Copy, Download, Upload, Share, Link, RefreshCw, Expand, Minimize2, Power, X,
  // ARROWS & DIRECTION (8)
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  // STATUS & FEEDBACK (7)
  CheckCircle, AlertCircle, Info, HelpCircle, ThumbsUp, ThumbsDown, Smile,
  // ORGANIZATION & FILES (4)
  Folder, File, Bookmark, Archive,
  // PREMIUM & ACHIEVEMENT (4)
  Crown, Award, Trophy, Gift,
  // FOOD & LIFESTYLE (6)
  Cake, Pizza, Home, School, Hospital, Store,
  // SECURITY & ACCESS (4)
  Lock, Unlock, Key, Shield,
  // VISIBILITY & AWARENESS (2)
  Eye, EyeOff,
  // TIME & SCHEDULING (4)
  Clock, Calendar, Timer, Watch,
  // TOOLS & CRAFTSMANSHIP (4)
  Wrench, Hammer, Scissors, PaintBucket,
  // AUDIO & ENTERTAINMENT (1)
  Headphones
} from 'lucide-react';

// 120 Curated Icons Collection - Fixed Order
export const availableIcons: IconData[] = [
  // === BASIC SHAPES & SYMBOLS (9) ===
  { id: 'circle', component: Circle, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'square', component: Square, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'triangle', component: Triangle, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'diamond', component: Diamond, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'hexagon', component: Hexagon, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'pentagon', component: Pentagon, tags: ['shape', 'universal', 'simple', 'clean', 'geometric'] },
  { id: 'star', component: Star, tags: ['quality', 'premium', 'excellence', 'rating'] },
  { id: 'heart', component: Heart, tags: ['love', 'health', 'care', 'wellness', 'beauty', 'nonprofit', 'social'] },
  { id: 'plus', component: Plus, tags: ['symbol', 'universal', 'simple', 'clean', 'minimalist'] },

  // === NATURE & WEATHER (9) ===
  { id: 'sun', component: Sun, tags: ['nature', 'weather', 'energy', 'bright', 'summer'] },
  { id: 'cloud', component: Cloud, tags: ['nature', 'weather', 'soft', 'tech', 'storage'] },
  { id: 'flame', component: Flame, tags: ['nature', 'energy', 'passion', 'hot', 'dynamic'] },
  { id: 'droplets', component: Droplets, tags: ['nature', 'water', 'clean', 'pure', 'fresh'] },
  { id: 'leaf', component: Leaf, tags: ['nature', 'eco', 'organic', 'green', 'sustainable'] },
  { id: 'tree', component: TreePine, tags: ['nature', 'growth', 'stability', 'eco', 'life'] },
  { id: 'flower', component: Flower2, tags: ['nature', 'beauty', 'delicate', 'spring', 'organic'] },
  { id: 'mountain', component: Mountain, tags: ['nature', 'strength', 'stability', 'adventure', 'outdoor'] },
  { id: 'zap', component: Zap, tags: ['energy', 'power', 'electric', 'fast', 'dynamic'] },

  // === BUSINESS & FINANCE (9) ===
  { id: 'dollar-sign', component: DollarSign, tags: ['business', 'finance', 'money', 'profit', 'success'] },
  { id: 'trending-up', component: TrendingUp, tags: ['business', 'growth', 'success', 'progress', 'analytics'] },
  { id: 'bar-chart', component: BarChart, tags: ['business', 'analytics', 'data', 'statistics', 'reporting'] },
  { id: 'pie-chart', component: PieChart, tags: ['business', 'analytics', 'data', 'statistics', 'distribution'] },
  { id: 'shopping-cart', component: ShoppingCart, tags: ['business', 'ecommerce', 'retail', 'shopping', 'commerce'] },
  { id: 'credit-card', component: CreditCard, tags: ['business', 'finance', 'payment', 'transaction', 'money'] },
  { id: 'building', component: Building, tags: ['business', 'corporate', 'office', 'company', 'professional'] },
  { id: 'briefcase', component: Briefcase, tags: ['business', 'professional', 'work', 'career', 'corporate'] },
  { id: 'handshake', component: Handshake, tags: ['business', 'partnership', 'collaboration', 'trust', 'agreement', 'nonprofit', 'social'] },

  // === TECHNOLOGY & DIGITAL (13) ===
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
  { id: 'plane', component: Plane, tags: ['transport', 'travel', 'aviation', 'flight', 'journey', 'tourism'] },
  { id: 'ship', component: Ship, tags: ['transport', 'maritime', 'shipping', 'cargo', 'ocean'] },
  { id: 'bicycle', component: Bike, tags: ['transport', 'eco', 'healthy', 'sport', 'sustainable'] },
  { id: 'train', component: Train, tags: ['transport', 'railway', 'travel', 'commute', 'transit'] },
  { id: 'rocket', component: Rocket, tags: ['startup', 'growth', 'speed', 'innovation', 'launch'] },
  { id: 'compass', component: Compass, tags: ['navigation', 'direction', 'travel', 'adventure', 'guidance', 'tourism'] },
  { id: 'map', component: Map, tags: ['navigation', 'location', 'travel', 'geography', 'direction', 'tourism'] },

  // === COMMUNICATION & SOCIAL (8) ===
  { id: 'phone', component: Phone, tags: ['communication', 'contact', 'call', 'support', 'service'] },
  { id: 'mail', component: Mail, tags: ['communication', 'email', 'message', 'contact', 'correspondence'] },
  { id: 'message-circle', component: MessageCircle, tags: ['communication', 'chat', 'conversation', 'support', 'social'] },
  { id: 'send', component: Send, tags: ['communication', 'deliver', 'message', 'transmit', 'share'] },
  { id: 'users', component: Users, tags: ['social', 'team', 'community', 'group', 'collaboration', 'nonprofit'] },
  { id: 'user', component: User, tags: ['personal', 'profile', 'individual', 'account', 'identity'] },
  { id: 'user-plus', component: UserPlus, tags: ['social', 'add', 'invite', 'join', 'community'] },
  { id: 'bell', component: Bell, tags: ['notification', 'alert', 'reminder', 'announcement', 'attention'] },

  // === CREATIVE & MEDIA (8) ===
  { id: 'palette', component: Palette, tags: ['design', 'creative', 'art', 'color', 'artistic', 'beauty', 'fashion'] },
  { id: 'camera', component: Camera, tags: ['photography', 'media', 'creative', 'visual', 'capture', 'beauty', 'fashion'] },
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
  { id: 'smile', component: Smile, tags: ['happy', 'positive', 'emotion', 'good', 'satisfied', 'nonprofit', 'social'] },

  // === ORGANIZATION & FILES (4) ===
  { id: 'folder', component: Folder, tags: ['organization', 'storage', 'files', 'directory', 'structure'] },
  { id: 'file', component: File, tags: ['document', 'data', 'storage', 'information', 'content', 'legal', 'law'] },
  { id: 'bookmark', component: Bookmark, tags: ['save', 'favorite', 'mark', 'remember', 'important'] },
  { id: 'archive', component: Archive, tags: ['storage', 'backup', 'preserve', 'organize', 'history'] },

  // === PREMIUM & ACHIEVEMENT (4) ===
  { id: 'crown', component: Crown, tags: ['premium', 'luxury', 'royal', 'elite', 'exclusive'] },
  { id: 'award', component: Award, tags: ['achievement', 'recognition', 'success', 'excellence', 'honor'] },
  { id: 'trophy', component: Trophy, tags: ['victory', 'achievement', 'winner', 'champion', 'success'] },
  { id: 'gift', component: Gift, tags: ['present', 'celebration', 'bonus', 'reward', 'surprise'] },

  // === FOOD & LIFESTYLE (6) ===
  { id: 'cake', component: Cake, tags: ['food', 'celebration', 'bakery', 'sweet', 'party'] },
  { id: 'pizza', component: Pizza, tags: ['food', 'restaurant', 'italian', 'casual', 'delivery'] },
  { id: 'home', component: Home, tags: ['house', 'residential', 'family', 'comfort', 'domestic', 'hospitality', 'tourism'] },
  { id: 'school', component: School, tags: ['education', 'learning', 'academic', 'knowledge', 'teaching'] },
  { id: 'hospital', component: Hospital, tags: ['healthcare', 'medical', 'health', 'treatment', 'care'] },
  { id: 'store', component: Store, tags: ['retail', 'shop', 'commerce', 'business', 'marketplace'] },

  // === SECURITY & ACCESS (4) ===
  { id: 'lock', component: Lock, tags: ['security', 'protection', 'private', 'safe', 'secure'] },
  { id: 'unlock', component: Unlock, tags: ['access', 'open', 'available', 'unlocked', 'free'] },
  { id: 'key', component: Key, tags: ['access', 'security', 'unlock', 'password', 'entry'] },
  { id: 'shield', component: Shield, tags: ['protection', 'security', 'defense', 'safe', 'guard', 'legal', 'law'] },

  // === VISIBILITY & AWARENESS (2) ===
  { id: 'eye', component: Eye, tags: ['vision', 'see', 'watch', 'observe', 'visible'] },
  { id: 'eye-off', component: EyeOff, tags: ['hidden', 'invisible', 'private', 'unseen', 'blind'] },

  // === TIME & SCHEDULING (4) ===
  { id: 'clock', component: Clock, tags: ['time', 'schedule', 'timing', 'appointment', 'punctual'] },
  { id: 'calendar', component: Calendar, tags: ['schedule', 'date', 'event', 'planning', 'organization'] },
  { id: 'timer', component: Timer, tags: ['countdown', 'time', 'deadline', 'duration', 'stopwatch'] },
  { id: 'watch', component: Watch, tags: ['time', 'timepiece', 'schedule', 'punctual', 'fashion'] },

  // === TOOLS & CRAFTSMANSHIP (4) ===
  { id: 'wrench', component: Wrench, tags: ['tools', 'repair', 'maintenance', 'mechanic', 'fix'] },
  { id: 'hammer', component: Hammer, tags: ['tools', 'construction', 'build', 'craft', 'repair'] },
  { id: 'scissors', component: Scissors, tags: ['tools', 'cut', 'trim', 'craft', 'precise', 'beauty', 'fashion'] },
  { id: 'paint-bucket', component: PaintBucket, tags: ['design', 'color', 'paint', 'creative', 'fill'] },

  // === AUDIO & ENTERTAINMENT (1) ===
  { id: 'headphones', component: Headphones, tags: ['audio', 'music', 'sound', 'entertainment', 'listening'] }
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

// Knallige Neon-Versionen der 14 Grundfarben
const neonColors: PaletteData[] = [
  { id: 'neon-red', name: 'Neon Rot', colors: ['#FF0040', '#FF4081', '#000000'], tags: ['red', 'neon', 'intense'] },
  { id: 'neon-orange', name: 'Neon Orange', colors: ['#FF4500', '#FF6B35', '#000000'], tags: ['orange', 'neon', 'intense'] },
  { id: 'neon-yellow', name: 'Neon Gelb', colors: ['#FFFF00', '#FFF700', '#000000'], tags: ['yellow', 'neon', 'intense'] },
  { id: 'neon-green', name: 'Neon Grün', colors: ['#00FF41', '#39FF14', '#000000'], tags: ['green', 'neon', 'intense'] },
  { id: 'neon-teal', name: 'Neon Türkis', colors: ['#00FFFF', '#1DE9B6', '#000000'], tags: ['teal', 'neon', 'intense'] },
  { id: 'neon-blue', name: 'Neon Blau', colors: ['#0080FF', '#00D4FF', '#000000'], tags: ['blue', 'neon', 'intense'] },
  { id: 'neon-cyan', name: 'Neon Cyan', colors: ['#00E5FF', '#18FFFF', '#000000'], tags: ['cyan', 'neon', 'intense'] },
  { id: 'neon-purple', name: 'Neon Lila', colors: ['#8A2BE2', '#BF40BF', '#000000'], tags: ['purple', 'neon', 'intense'] },
  { id: 'neon-pink', name: 'Neon Pink', colors: ['#FF10F0', '#FF1493', '#000000'], tags: ['pink', 'neon', 'intense'] },
  { id: 'neon-indigo', name: 'Neon Indigo', colors: ['#4B0082', '#6A0DAD', '#FFFFFF'], tags: ['indigo', 'neon', 'intense'] },
  { id: 'neon-gray', name: 'Neon Grau', colors: ['#C0C0C0', '#E5E5E5', '#000000'], tags: ['gray', 'neon', 'intense'] },
  { id: 'neon-black', name: 'Neon Schwarz', colors: ['#000000', '#333333', '#00FF00'], tags: ['black', 'neon', 'intense'] },
  { id: 'neon-brown', name: 'Neon Braun', colors: ['#D2691E', '#FF8C00', '#000000'], tags: ['brown', 'neon', 'intense'] },
  { id: 'neon-lime', name: 'Neon Limette', colors: ['#32CD32', '#7FFF00', '#000000'], tags: ['lime', 'neon', 'intense'] }
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
  ...intensiveColors,
  // Add neon colors
  ...neonColors
];

export interface Suggestions {
  suggestedIcons: IconData[];
  suggestedEnclosingShapes: IconData[];
  suggestedFonts: FontData[];
  suggestedPalettes: PaletteData[];
}

export function getInitialSuggestions(industry: string, keywords: string[]): Suggestions {
  let suggestedFontCategory: FontCategory = fontCategories[0]; // Standard: Modern
  let suggestedPalette: ColorPalette = colorPalettes[0]; // Standard: Seriös

  // ----- Hier beginnt dein Expertensystem (Regelwerk) -----

  // Regel 1: Kreativ-Branchen (Design, Kunst, Entertainment)
  if (['design', 'art', 'photography', 'mode', 'entertainment'].includes(industry) || keywords.includes('kreativ')) {
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

  // Regel 4: Starke, laute Branchen (Sport, Events, Automotive)
  if (['sports', 'events', 'gaming', 'automotive'].includes(industry) || keywords.includes('energie')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Bold')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Dynamisch'))!;
  }

  // Regel 5: Bildung & Beratung (Vertrauenswürdig)
  if (['education', 'consulting'].includes(industry) || keywords.includes('vertrauen')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Heritage')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Seriös'))!;
  }

  // Regel 6: Handel & Einzelhandel (Freundlich & Einladend)
  if (['retail', 'commerce'].includes(industry) || keywords.includes('freundlich')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Modern')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Freundlich'))!;
  }

  // Regel 7: Bau & Immobilien (Stabil & Vertrauenswürdig)
  if (['construction', 'building'].includes(industry) || keywords.includes('stabil')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Bold')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Seriös'))!;
  }

  // Regel 8: Legal & Law (Professional & Trustworthy)
  if (['legal', 'law'].includes(industry) || keywords.includes('professional')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Heritage')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Seriös'))!;
  }

  // Regel 9: Travel & Tourism (Friendly & Adventurous)
  if (['travel', 'tourism', 'hospitality'].includes(industry) || keywords.includes('adventure')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Modern')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Ocean'))!;
  }

  // Regel 10: Beauty & Fashion (Elegant & Luxurious)
  if (['beauty', 'fashion', 'lifestyle'].includes(industry) || keywords.includes('elegant')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Elegant')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Luxuriös'))!;
  }

  // Regel 11: Non-Profit & Social (Friendly & Trustworthy)
  if (['nonprofit', 'social', 'charity'].includes(industry) || keywords.includes('social')) {
    suggestedFontCategory = fontCategories.find(c => c.name === 'Modern')!;
    suggestedPalette = colorPalettes.find(p => p.name.includes('Freundlich'))!;
  }

  // FIXED SET OF EXACTLY 24 REGULAR ICONS - SINGLE SOURCE OF TRUTH
  const fixed24RegularIconIds = [
    'star', 'heart', 'shield', 'zap', 'leaf', 'coffee', 'camera', 'music', 
    'gamepad-2', 'palette', 'code', 'briefcase', 'lightbulb', 'rocket', 
    'sun', 'moon', 'cloud', 'flame', 'droplets', 'mountain', 
    'tree', 'flower', 'building', 'handshake', 'phone'
  ];
  
  // Return ALL 120 icons in their defined order
  const suggestedIcons = availableIcons;

  // SAFETY CHECK: Ensure we have all 120 icons
  if (suggestedIcons.length !== 120) {
    console.error(`ERROR: Expected 120 icons but got ${suggestedIcons.length}.`);
  }

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

  // FIXED SET OF 17 ENCLOSING SHAPES - SINGLE SOURCE OF TRUTH
  const fixed17EnclosingShapeIds = [
    'circle', 'square', 'triangle', 'diamond', 'hexagon', 'pentagon', 
    'star', 'heart', 'shield', 'sun', 'moon', 'zap', 'leaf', 'flame', 
    'droplets', 'check-circle', 'lightbulb'
  ];
  
  const suggestedEnclosingShapes = availableIcons.filter(icon => 
    fixed17EnclosingShapeIds.includes(icon.id)
  ).sort((a, b) => 
    fixed17EnclosingShapeIds.indexOf(a.id) - fixed17EnclosingShapeIds.indexOf(b.id)
  );

  return {
    suggestedIcons,
    suggestedEnclosingShapes,
    suggestedFonts: suggestedFonts.slice(0, 8),
    suggestedPalettes: suggestionPalettes // Include ALL color options (regular + intensive + neon)
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