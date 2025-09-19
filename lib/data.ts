// lib/data.ts
import { LayoutData } from './types';

// =================================================================
// HILFSFUNKTIONEN
// =================================================================

// Hilfsfunktion zur Helligkeitsanpassung von Farben für Gradients
function adjustColorBrightness(color: string, amount: number): string {
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  
  const num = parseInt(col, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  
  return (usePound ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Verbesserte Gradient-Erstellung mit größerem Farbbereich
function createGradient(baseColor: string): string {
  // Erstelle einen Gradient mit einem helleren und einem dunkleren Ton für mehr Sichtbarkeit
  const lighterColor = adjustColorBrightness(baseColor, 80); // Noch heller für bessere Sichtbarkeit
  const darkerColor = adjustColorBrightness(baseColor, -80); // Noch dunkler für bessere Sichtbarkeit
  return `linear-gradient(135deg, ${lighterColor} 0%, ${baseColor} 50%, ${darkerColor} 100%)`;
}

// Silberner Gradient für spezielle Variationen
function createSilverGradient(): string {
  return `linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 25%, #FFFFFF 50%, #E8E8E8 75%, #C0C0C0 100%)`;
}

// =================================================================
// DATEN-ARCHITEKTUR
// Dies ist die "Single Source of Truth" für alle Design-Optionen.
//
// WICHTIGE REGEL:
// - generationWeights: Nur für die initiale Logo-Generierung (meist 400 als Standard)
// - editorWeights: Alle verfügbaren Gewichte für die Editoren - User sollen im Editor
//   keine Blockaden haben und individuell alle verfügbaren font-weights der variable fonts nutzen können
// =================================================================

// 1. FARBPALETTEN
export type ColorPalette = {
  name: string;
  colors: [string, string, string]; // [Hauptfarbe/Background, Textfarbe, Akzentfarbe] - Max 3 Farben
};

export const colorPalettes: ColorPalette[] = [
  // Originale 8 reguläre Farbpaletten - reduziert auf 3 Farben
  { name: "Seriös & Vertrauensvoll", colors: ["#FFFFFF", "#0A3D62", "#CEDEEB"] },
  { name: "Modern & Technisch", colors: ["#F5F8FA", "#2C3A47", "#00D2D3"] },
  { name: "Natürlich & Nachhaltig", colors: ["#FDFBF5", "#587448", "#E5D9B8"] },
  { name: "Elegant & Luxuriös", colors: ["#FFFFF0", "#1E2022", "#D4AF37"] },
  { name: "Dynamisch & Energiegeladen", colors: ["#FFFFFF", "#000000", "#D92027"] },
  { name: "Freundlich & Sanft", colors: ["#FFFFFF", "#FAD3E7", "#BEE3F8"] },
  { name: "Ocean & Sunset", colors: ["#FFF8E1", "#FF6B6B", "#4ECDC4"] },
  { name: "Cosmic & Deep", colors: ["#F8F9FA", "#667EEA", "#764BA2"] },

  // Erste 40 Farbpaletten aus colors-new.json - reduziert auf 3 Farben
  { name: "Sanft Monochromatisch", colors: ["#f6f7f8", "#336699", "#5799db"] },
  { name: "Kräftig Monochromatisch", colors: ["#e7f2fe", "#2e3138", "#5ea6ed"] },
  { name: "Gedeckt Monochromatisch", colors: ["#f5f3f0", "#2d4053", "#598cc0"] },
  { name: "Ruhig Analog", colors: ["#f1f2f4", "#3380cc", "#6161d1"] },
  { name: "Warm Analog", colors: ["#352e27", "#4d99e5", "#5eede1"] },
  { name: "Frisch Analog", colors: ["#ffffff", "#1f66ad", "#5336e2"] },
  { name: "Klassisch Komplementär", colors: ["#e8f2fc", "#1f1f1f", "#e5994d"] },
  { name: "Geteilt Komplementär", colors: ["#f6f4f4", "#1173d4", "#bf4040"] },
  { name: "Sanft Komplementär", colors: ["#e0e6eb", "#4d5e80", "#e0b385"] },
  { name: "Doppel-Komplementär", colors: ["#fafafa", "#1259a1", "#5252e0"] },
  { name: "Lebhafte Triade", colors: ["#fafafa", "#1980e6", "#c32273"] },
  { name: "Dunkle Triade", colors: ["#22222a", "#7db3e8", "#a6e06c"] },
  { name: "Pastell-Triade", colors: ["#faf7f4", "#6699cc", "#cc6699"] },
  { name: "Gedeckte Triade", colors: ["#455454", "#cbd9e6", "#c982a6"] },
  { name: "Neutral mit Akzent", colors: ["#f5f5f5", "#1a1a1a", "#258cf4"] },
  { name: "Natur & Erde", colors: ["#f4f0eb", "#593960", "#404abf"] },
  { name: "Königlich", colors: ["#221b32", "#e46767", "#c9cccf"] },
  { name: "Art Deco", colors: ["#e8e7ef", "#1a1a1a", "#a36629"] },
  { name: "Edelstein", colors: ["#e3e6e8", "#1f4733", "#dddd3c"] },
  { name: "Mitternachtsgold", colors: ["#d3d9de", "#2d3953", "#dbaf57"] },
  { name: "70er Jahre Vibe", colors: ["#e7ebe0", "#366354", "#30e8ab"] },
  { name: "Pastell 50er", colors: ["#edf7f2", "#dfd49f", "#dbf5d6"] },
  { name: "Verwaschene Nostalgie", colors: ["#bfccd9", "#c27070", "#998866"] },
  { name: "Senf & Petrol", colors: ["#f4f3f0", "#0044cc", "#7d3636"] },
  { name: "Cyberpunk", colors: ["#111117", "#ff8000", "#33ff99"] },
  { name: "Synthwave", colors: ["#18122b", "#fa3869", "#8c25f4"] },
  { name: "Digital Glitch", colors: ["#262626", "#ff0080", "#fafafa"] },
  { name: "Plasma-Anzeige", colors: ["#1b141f", "#55a6f6", "#2beead"] },
  { name: "Meeresbrise", colors: ["#f4f2eb", "#cd98ae", "#67dae4"] },
  { name: "Blütenpracht", colors: ["#fbf9fa", "#adcceb", "#a6d9bf"] },
  { name: "Waldlichtung", colors: ["#eaeee8", "#3e7450", "#e8c9de"] },
  { name: "Sonnenaufgang", colors: ["#3d475c", "#f2d08c", "#ec9f79"] },
  { name: "Modern & Minimal", colors: ["#f9fafa", "#171a1c", "#4799eb"] },
  { name: "Warm & Einladend", colors: ["#fbf7f4", "#294756", "#3c57dd"] },
  { name: "Technisch & Präzise", colors: ["#e9e9e2", "#252b37", "#f5993d"] },
  { name: "Dramatisch & Selbstbewusst", colors: ["#ffffff", "#141414", "#00aaff"] },
  { name: "Natürlich & Beruhigend", colors: ["#f4f6f4", "#402633", "#b3acd2"] },
  { name: "Kreativ & Verspielt", colors: ["#fffbe5", "#b8a12e", "#55c1f6"] },
  { name: "Premium & Dezent", colors: ["#dcdce5", "#38332e", "#a37d75"] },
  { name: "Optimistisch & Hell", colors: ["#f4fafb", "#3d5cf5", "#d9d926"] },
];

// BASE COLOR PALETTES (Grundfarben für Logo-Generation)
export type BaseColorPalette = {
  name: string;
  color: string;
  description?: string;
};

export const baseColorPalettes: BaseColorPalette[] = [
  // Primärfarben
  { name: "Rot", color: "#E74C3C", description: "Kraftvoll und energiegeladen" },
  { name: "Blau", color: "#3498DB", description: "Vertrauenswürdig und professionell" },
  { name: "Gelb", color: "#F1C40F", description: "Optimistisch und aufmerksamkeitsstark" },

  // Sekundärfarben
  { name: "Grün", color: "#27AE60", description: "Natürlich und harmonisch" },
  { name: "Orange", color: "#E67E22", description: "Warm und einladend" },
  { name: "Violett", color: "#9B59B6", description: "Kreativ und luxuriös" },

  // Erweiterte Farbpalette
  { name: "Türkis", color: "#1ABC9C", description: "Frisch und modern" },
  { name: "Marineblau", color: "#2C3E50", description: "Elegant und seriös" },
  { name: "Rosa", color: "#E91E63", description: "Verspielt und feminin" },
  { name: "Lime", color: "#8BC34A", description: "Lebendig und natürlich" },
  { name: "Bernstein", color: "#FF9800", description: "Warm und freundlich" },
  { name: "Cyan", color: "#00BCD4", description: "Klar und technisch" },
  { name: "Indigo", color: "#3F51B5", description: "Tiefgreifend und weise" },
  { name: "Teal", color: "#009688", description: "Beruhigend und ausgewogen" },
  { name: "Koralle", color: "#FF5722", description: "Lebendig und warm" },

  // Neutrale Farben
  { name: "Grau", color: "#95A5A6", description: "Neutral und vielseitig" },
  { name: "Dunkelgrau", color: "#34495E", description: "Stabil und zuverlässig" },
  { name: "Hellgrau", color: "#BDC3C7", description: "Subtil und zurückhaltend" },
  { name: "Schwarz", color: "#2C3E50", description: "Kraftvoll und elegant" },
  { name: "Weiß", color: "#ECF0F1", description: "Rein und minimalistisch" },
  { name: "Beige", color: "#D4C5B9", description: "Warm und einladend" },

  // Grundfarben-Paletten (41-52) aus colors-new.json
  { name: "Dunkel auf Hell", color: "#265926", description: "Klassischer Kontrast" },
  { name: "Hell auf Dunkel", color: "#c2f0c2", description: "Moderner Kontrast" },
  { name: "Komplementärer Kontrast", color: "#1fad1f", description: "Dynamischer Gegensatz" },
  { name: "Elegantes Analog", color: "#bddbbd", description: "Harmonische Eleganz" },
  { name: "Monochromatisch Tech", color: "#99f53d", description: "Technische Präzision" },
  { name: "Monochromatisch Natur", color: "#4d6732", description: "Natürliche Ruhe" },
  { name: "Sanft & Modern", color: "#527a52", description: "Zeitgemäße Sanftheit" },
  { name: "Frisch & Lebhaft", color: "#53c68c", description: "Lebendige Frische" },
  { name: "Luxuriös & Kräftig", color: "#e8d67d", description: "Kraftvolle Eleganz" },
  { name: "Minimalistisch & Klar", color: "#14b814", description: "Klare Einfachheit" },
  { name: "Subtiles Analog", color: "#367d36", description: "Dezente Harmonie" },
  { name: "Umgekehrter Kontrast", color: "#bef4be", description: "Überraschender Kontrast" },
];

// 2. SCHRIFTARTEN
export type FontInfo = {
  name: string;
  cssName: string;
  isVariable: boolean;
  generationWeights: [number, number]; // Nur für die initiale Generierung
  editorWeights: number[]; // Alle Optionen für den Editor
};

export type FontCategory = {
  name: string;
  fonts: FontInfo[];
};

export const fontCategories: FontCategory[] = [
  {
    name: "Bold",
    fonts: [
      { name: "Alfa Slab One", cssName: "'Alfa Slab One'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Anton", cssName: "'Anton'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Archivo Black", cssName: "'Archivo Black'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Black Ops One", cssName: "'Black Ops One'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Bungee", cssName: "'Bungee'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Chango", cssName: "'Chango'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Contrail One", cssName: "'Contrail One'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "New Amsterdam", cssName: "'New Amsterdam'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Peralta", cssName: "'Peralta'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Plaster", cssName: "'Plaster'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Rubik Mono One", cssName: "'Rubik Mono One'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Yeseva One", cssName: "'Yeseva One'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
    ]
  },
  {
    name: "Elegant",
    fonts: [
      { name: "Caveat", cssName: "'Caveat'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Dancing Script", cssName: "'Dancing Script'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Grechen Fuemen", cssName: "'Grechen Fuemen'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Kaushan Script", cssName: "'Kaushan Script'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Lobster Two", cssName: "'Lobster Two'", isVariable: false, generationWeights: [400, 700], editorWeights: [400, 700] },
      { name: "Merienda", cssName: "'Merienda'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Over the Rainbow", cssName: "'Over the Rainbow'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Sacramento", cssName: "'Sacramento'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Sansita Swashed", cssName: "'Sansita Swashed'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Story Script", cssName: "'Story Script'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Style Script", cssName: "'Style Script'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "The Girl Next Door", cssName: "'The Girl Next Door'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
    ]
  },
  {
    name: "Modern",
    fonts: [
      { name: "Bebas Neue", cssName: "'Bebas Neue'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Bentham", cssName: "'Bentham'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Coiny", cssName: "'Coiny'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Comfortaa", cssName: "'Comfortaa'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Fuzzy Bubbles", cssName: "'Fuzzy Bubbles'", isVariable: false, generationWeights: [400, 700], editorWeights: [400, 700] },
      { name: "Genos", cssName: "'Genos'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Montserrat", cssName: "'Montserrat'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Plus Jakarta Sans", cssName: "'Plus Jakarta Sans'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Quicksand", cssName: "'Quicksand'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Stick No Bills", cssName: "'Stick No Bills'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "SUSE", cssName: "'SUSE'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Unbounded", cssName: "'Unbounded'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
    ]
  },
  {
    name: "Playful",
    fonts: [
      { name: "Chicle", cssName: "'Chicle'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Emilys Candy", cssName: "'Emilys Candy'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Fontdiner Swanky", cssName: "'Fontdiner Swanky'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Gloria Hallelujah", cssName: "'Gloria Hallelujah'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Pacifico", cssName: "'Pacifico'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Passion One", cssName: "'Passion One'", isVariable: false, generationWeights: [400, 700], editorWeights: [400, 700] },
      { name: "Permanent Marker", cssName: "'Permanent Marker'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Princess Sofia", cssName: "'Princess Sofia'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Redressed", cssName: "'Redressed'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Rock Salt", cssName: "'Rock Salt'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Sedgwick Ave", cssName: "'Sedgwick Ave'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Truculenta", cssName: "'Truculenta'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
    ]
  },
  {
    name: "Tech",
    fonts: [
      { name: "Atomic Age", cssName: "'Atomic Age'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Audiowide", cssName: "'Audiowide'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Bruno Ace", cssName: "'Bruno Ace'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Bruno Ace SC", cssName: "'Bruno Ace SC'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Michroma", cssName: "'Michroma'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Orbitron", cssName: "'Orbitron'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Prosto One", cssName: "'Prosto One'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Revalia", cssName: "'Revalia'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Righteous", cssName: "'Righteous'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Syncopate", cssName: "'Syncopate'", isVariable: false, generationWeights: [400, 700], editorWeights: [400, 700] },
      { name: "Tektur", cssName: "'Tektur'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Zen Dots", cssName: "'Zen Dots'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
    ]
  },
  {
    name: "Timeless",
    fonts: [
      { name: "Aboreto", cssName: "'Aboreto'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Amatic SC", cssName: "'Amatic SC'", isVariable: false, generationWeights: [400, 700], editorWeights: [400, 700] },
      { name: "Annie Use Your Telescope", cssName: "'Annie Use Your Telescope'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Baskervville SC", cssName: "'Baskervville SC'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Cinzel", cssName: "'Cinzel'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Ephesis", cssName: "'Ephesis'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Geo", cssName: "'Geo'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Girassol", cssName: "'Girassol'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Limelight", cssName: "'Limelight'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Megrim", cssName: "'Megrim'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
      { name: "Merriweather", cssName: "'Merriweather'", isVariable: true, generationWeights: [400, 600], editorWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
      { name: "Quintessential", cssName: "'Quintessential'", isVariable: false, generationWeights: [400, 400], editorWeights: [400] },
    ]
  },
];

// =================================================================
// COMPATIBILITY LAYER - Simple industry/personality definitions
// =================================================================

export const industries = {
  'tech': { tags: ['tech'], name: 'Technology' },
  'finance': { tags: ['finance'], name: 'Finance' },
  'health': { tags: ['health', 'wellness'], name: 'Health & Wellness' },
  'sports': { tags: ['sports'], name: 'Sports & Fitness' },
  'design': { tags: ['design'], name: 'Design & Creative' },
  'food': { tags: ['food'], name: 'Food & Gastronomy' },
  'education': { tags: ['education', 'learning'], name: 'Education & Learning' },
  'retail': { tags: ['retail', 'commerce'], name: 'Retail & Commerce' },
  'construction': { tags: ['construction', 'building'], name: 'Construction & Real Estate' },
  'automotive': { tags: ['automotive', 'transport'], name: 'Automotive & Transport' },
  'consulting': { tags: ['consulting', 'business'], name: 'Consulting & Services' },
  'entertainment': { tags: ['entertainment', 'media'], name: 'Entertainment & Media' },
  'legal': { tags: ['legal', 'law', 'professional'], name: 'Legal & Law' },
  'travel': { tags: ['travel', 'tourism', 'hospitality'], name: 'Travel & Tourism' },
  'beauty': { tags: ['beauty', 'fashion', 'lifestyle'], name: 'Beauty & Fashion' },
  'nonprofit': { tags: ['nonprofit', 'social', 'charity'], name: 'Non-Profit & Social' }
};

export const personalities = [
  { id: 'modern', name: 'Modern & Innovativ', tags: ['modern', 'tech', 'minimalist'] },
  { id: 'elegant', name: 'Elegant & Luxuriös', tags: ['elegant', 'luxury'] },
  { id: 'serious', name: 'Seriös & Vertrauenswürdig', tags: ['serious', 'corporate'] },
  { id: 'playful', name: 'Verspielt & Kreativ', tags: ['playful', 'creative'] },
  { id: 'organic', name: 'Natürlich & Organisch', tags: ['organic', 'nature', 'eco'] },
];

export const layouts: LayoutData[] = [
  { id: 'text-icon-horizontal', name: 'Text + Icon (horizontal)', type: 'standard', arrangement: 'text-left' },
  { id: 'icon-text-horizontal', name: 'Icon + Text (horizontal)', type: 'standard', arrangement: 'icon-left' },
  { id: 'icon-text-vertical', name: 'Icon + Text (vertikal)', type: 'standard', arrangement: 'icon-top' },
  { id: 'text-icon-vertical', name: 'Text + Icon (vertikal)', type: 'standard', arrangement: 'text-top' },
  { id: 'text-icon-horizontal-circle', name: 'Text + Icon (horizontal) + Kreis', type: 'enclosed', shape: 'circle', arrangement: 'text-left' },
  { id: 'icon-text-horizontal-circle', name: 'Icon + Text (horizontal) + Kreis', type: 'enclosed', shape: 'circle', arrangement: 'icon-left' },
  { id: 'icon-text-vertical-circle', name: 'Icon + Text (vertikal) + Kreis', type: 'enclosed', shape: 'circle', arrangement: 'icon-top' },
  { id: 'text-icon-vertical-circle', name: 'Text + Icon (vertikal) + Kreis', type: 'enclosed', shape: 'circle', arrangement: 'text-top' },
];

// =================================================================
// FARB-GENERATIONS-REGELN
// Definiert wie aus Grundfarben + Zusatzoptionen Logos generiert werden
// =================================================================

export type ColorGenerationRule = {
  id: string;
  name: string;
  description: string;
  generates: number; // Anzahl der generierten Variationen
  variants: {
    name: string;
    brandNameColor: (baseColor: string) => string;
    iconColor: (baseColor: string) => string;
    backgroundColor: (baseColor: string) => string;
    sloganColor: (baseColor: string) => string;
  }[];
};

export const colorGenerationRules: ColorGenerationRule[] = [
  {
    id: 'base-only',
    name: 'Nur Grundfarbe',
    description: 'Verwendet nur die ausgewählte Grundfarbe - 4 Variationen',
    generates: 4,
    variants: [
      {
        name: 'Auf Weiß - Einfarbig',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Auf Schwarz - Einfarbig',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Auf Weiß - Gradient',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Auf Schwarz - Gradient',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => createGradient(baseColor)
      }
    ]
  },
  {
    id: 'add-white',
    name: 'Grundfarbe + Weiß',
    description: 'Generiert 12 Variationen mit Weiß-Kombinationen',
    generates: 12,
    variants: [
      {
        name: 'Weiß: Base Solid - Brandname und Icon in Grundfarbe',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Weiß: Brandname und Icon in einem linear-gradient',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Weiß: Base Gradient - Brandname Grundfarbe, Icon mit Gradient',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Weiß: Brandname Gradient, Icon Grundfarbe',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Schwarz: Text Weiß, Icon Base - Brandname weiß, Icon in Grundfarbe',
        brandNameColor: () => '#FFFFFF',
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#000000',
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Schwarz: Text Base, Icon Weiß - Brandname in Grundfarbe, Icon weiß',
        brandNameColor: (baseColor) => baseColor,
        iconColor: () => '#FFFFFF',
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Schwarz: Text Gradient, Icon Weiß - Brandname als Gradient, Icon weiß',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: () => '#FFFFFF',
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Schwarz: Text Weiß, Icon Gradient - Brandname weiß, Icon mit Gradient',
        brandNameColor: () => '#FFFFFF',
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#000000',
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Grundfarbe Background: Text & Icon Weiß',
        brandNameColor: () => '#FFFFFF',
        iconColor: () => '#FFFFFF',
        backgroundColor: (baseColor) => baseColor,
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Gradient Background: Text & Icon Weiß',
        brandNameColor: () => '#FFFFFF',
        iconColor: () => '#FFFFFF',
        backgroundColor: (baseColor) => createGradient(baseColor),
        sloganColor: () => '#FFFFFF'
      },
      {
        name: 'Grundfarbe Background: Text & Icon Silber-Gradient',
        brandNameColor: () => createSilverGradient(),
        iconColor: () => '#000000', // Icons können keinen Gradient, daher schwarz
        backgroundColor: (baseColor) => baseColor,
        sloganColor: () => createSilverGradient()
      },
      {
        name: 'Gradient Background: Text & Icon Silber-Gradient',
        brandNameColor: () => createSilverGradient(),
        iconColor: () => '#000000', // Icons können keinen Gradient, daher schwarz
        backgroundColor: (baseColor) => createGradient(baseColor),
        sloganColor: () => createSilverGradient()
      }
    ]
  },
  {
    id: 'add-black',
    name: 'Grundfarbe + Schwarz',
    description: 'Generiert 12 Variationen mit Schwarz-Kombinationen',
    generates: 12,
    variants: [
      {
        name: 'Weiß: Text Base, Icon Schwarz - Brandname in Grundfarbe, Icon schwarz',
        brandNameColor: (baseColor) => baseColor,
        iconColor: () => '#000000',
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Weiß: Text Schwarz, Icon Base - Brandname schwarz, Icon in Grundfarbe',
        brandNameColor: () => '#000000',
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#FFFFFF',
        sloganColor: () => '#000000'
      },
      {
        name: 'Weiß: Text Gradient, Icon Schwarz - Brandname als Gradient, Icon schwarz',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: () => '#000000',
        backgroundColor: () => '#FFFFFF',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Weiß: Text Schwarz, Icon Gradient - Brandname schwarz, Icon mit Gradient',
        brandNameColor: () => '#000000',
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#FFFFFF',
        sloganColor: () => '#000000'
      },
      {
        name: 'Schwarz: Beide Base - Brandname und Icon in Grundfarbe',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Schwarz: Beide Gradient - Brandname und Icon mit Gradient',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Schwarz: Brandname Grundfarbe, Icon Gradient',
        brandNameColor: (baseColor) => baseColor,
        iconColor: (baseColor) => createGradient(baseColor),
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => baseColor
      },
      {
        name: 'Schwarz: Icon Grundfarbe, Brandname Gradient',
        brandNameColor: (baseColor) => createGradient(baseColor),
        iconColor: (baseColor) => baseColor,
        backgroundColor: () => '#000000',
        sloganColor: (baseColor) => createGradient(baseColor)
      },
      {
        name: 'Grundfarbe Background: Text & Icon Schwarz',
        brandNameColor: () => '#000000',
        iconColor: () => '#000000',
        backgroundColor: (baseColor) => baseColor,
        sloganColor: () => '#000000'
      },
      {
        name: 'Gradient Background: Text & Icon Schwarz',
        brandNameColor: () => '#000000',
        iconColor: () => '#000000',
        backgroundColor: (baseColor) => createGradient(baseColor),
        sloganColor: () => '#000000'
      },
      {
        name: 'Grundfarbe Background: Text & Icon Silber-Gradient',
        brandNameColor: () => createSilverGradient(),
        iconColor: () => '#FFFFFF', // Icon weiß für Kontrast auf dunklem Grund
        backgroundColor: (baseColor) => baseColor,
        sloganColor: () => createSilverGradient()
      },
      {
        name: 'Gradient Background: Text & Icon Silber-Gradient',
        brandNameColor: () => createSilverGradient(),
        iconColor: () => '#FFFFFF', // Icon weiß für Kontrast auf dunklem Grund
        backgroundColor: (baseColor) => createGradient(baseColor),
        sloganColor: () => createSilverGradient()
      }
    ]
  },
];

// =================================================================
// FARB-AUSWAHL-OPTIONEN
// Definiert die verfügbaren Zusatzoptionen für Grundfarben
// =================================================================

export type ColorOption = {
  id: string;
  name: string;
  description: string;
  applies_rule: string; // Referenz auf ColorGenerationRule.id
  visual_indicator: {
    colors: string[];
    layout: 'horizontal' | 'grid';
  };
};

export const colorOptions: ColorOption[] = [
  {
    id: 'base-only',
    name: 'Nur diese Farbe',
    description: 'Verwendet nur die ausgewählte Grundfarbe für alle Logo-Elemente',
    applies_rule: 'base-only',
    visual_indicator: {
      colors: ['baseColor'], // wird dynamisch ersetzt
      layout: 'horizontal'
    }
  },
  {
    id: 'add-white',
    name: '+ Weiß',
    description: 'Erstellt zusätzliche Variationen mit Weiß',
    applies_rule: 'add-white',
    visual_indicator: {
      colors: ['baseColor', '#FFFFFF'],
      layout: 'horizontal'
    }
  },
  {
    id: 'add-black',
    name: '+ Schwarz',
    description: 'Erstellt zusätzliche Variationen mit Schwarz',
    applies_rule: 'add-black',
    visual_indicator: {
      colors: ['baseColor', '#000000'],
      layout: 'horizontal'
    }
  },
];