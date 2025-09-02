Vollständiger Projektcode: Logo Generator (Unrefactored State)
Dies ist der komplette Code-Stand des Next.js Logo-Generator-Projekts vor der Implementierung der Datenbank- und Backend-Funktionalität. Dieser Stand dient als Ausgangspunkt für das Refactoring zur Integration von Prisma, Vercel Postgres und der Speicherfunktion.

weg.md (Projekt-Roadmap)

# Wegweiser: Architektur für den intelligenten Logo-Generator

Dieses Dokument beschreibt die Architektur und den Implementierungsplan für einen intelligenten, clientseitigen Logo-Generator, der auf den 10 goldenen Regeln des Designs basiert. Das Ziel ist es, ein "Expert System" zu schaffen, das im Browser des Benutzers läuft, um eine herausragende Performance, niedrige Kosten und garantierte Designqualität zu gewährleisten.

## Grundprinzip: Geführte Kreation statt unbegrenzter Freiheit

Wir entziehen dem Benutzer die Möglichkeit, schlechte Design-Entscheidungen zu treffen. Das System agiert als Experte, der den Benutzer durch einen strategischen Prozess führt und sicherstellt, dass jedes Ergebnis professionell und ästhetisch ansprechend ist. Die "Intelligenz" liegt nicht in einer rechenintensiven Cloud-KI, sondern in **kuratierten Daten und festen Regelwerken**, die als JavaScript-Skript ausgeführt werden.

---

## Fortschritt - Phase 4 (Update 1)

- **Beginn von Phase 4: Monetarisierung & Business-Features.**
- **Schritt 1: Implementierung der Authentifizierung:**
  - Die `package.json` wurde um `@clerk/nextjs` erweitert.
  - Eine `middleware.ts` wurde im Root-Verzeichnis erstellt, um die Anwendung zu schützen und den Authentifizierungsstatus zu verwalten. Öffentlich zugängliche Routen sind definiert.
  - Das Root-Layout (`app/layout.tsx`) wurde mit dem `<ClerkProvider>` umschlossen, um den Auth-Kontext in der gesamten App verfügbar zu machen.
  - Ein neuer `Header` wurde erstellt, der dynamisch Login/Registrierungs-Buttons oder ein Benutzerprofil-Icon anzeigt, je nach Anmeldestatus.
  - Umgebungsvariablen für Clerk (`.env.local.example`) wurden hinzugefügt.

## Fortschritt - Phase 2 (Abgeschlossen)

- **Implementierung einer Undo/Redo-Funktion:**
  - Die Zustandsverwaltung wurde von `useState` auf einen `useReducer` umgestellt. Dies ermöglicht die Verwaltung einer Änderungshistorie.
  - Eine neue Datei `/lib/state.ts` kapselt die komplette Logik des Reducers.
  - Im UI wurden Buttons für "Rückgängig" und "Wiederholen" hinzugefügt.
- **Implementierung von Real-World-Mockups:**
  - Ein "Mockups"-Tab wurde zur Vorschau hinzugefügt, der das Logo auf Visitenkarten, Websites und als App-Icon zeigt.

.env.local.example (Umgebungsvariablen-Vorlage)

# Clerk Authentication

# Erstellen Sie ein Konto auf clerk.com und fügen Sie hier Ihre Schlüssel ein.

# Benennen Sie diese Datei in .env.local um.

NEXT*PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test*...
CLERK*SECRET_KEY=sk_test*...

# Dies wird im nächsten Schritt für die Datenbank benötigt

# POSTGRES_URL=

.gitignore

# See [https://help.github.com/articles/ignoring-files/](https://help.github.com/articles/ignoring-files/) for more about ignoring files.

# dependencies

/node_modules
/.pnp
.pnp.js

# testing

/coverage

# next.js

/.next/
/out/

# production

/build

# misc

.DS_Store
\*.pem

# debug

npm-debug.log*
yarn-debug.log*
yarn-error.log\*

# local env files

.env\*.local

# vercel

.vercel

# typescript

\*.tsbuildinfo

package.json
{
"name": "logo-generator-pro",
"version": "0.1.0",
"private": true,
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint"
},
"dependencies": {
"@clerk/nextjs": "^5.1.3",
"framer-motion": "^11.2.10",
"lucide-react": "^0.395.0",
"next": "14.2.3",
"react": "^18",
"react-dom": "^18"
},
"devDependencies": {
"@types/node": "^20",
"@types/react": "^18",
"@types/react-dom": "^18",
"eslint": "^8",
"eslint-config-next": "14.2.3",
"postcss": "^8",
"tailwindcss": "^3.4.1",
"typescript": "^5"
}
}

tsconfig.json
{
"compilerOptions": {
"lib": ["dom", "dom.iterable", "esnext"],
"allowJs": true,
"skipLibCheck": true,
"strict": true,
"noEmit": true,
"esModuleInterop": true,
"module": "esnext",
"moduleResolution": "bundler",
"resolveJsonModule": true,
"isolatedModules": true,
"jsx": "preserve",
"incremental": true,
"plugins": [
{
"name": "next"
}
],
"paths": {
"@/_": ["./_"]
}
},
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
"exclude": ["node_modules"]
}

next.config.mjs
/\*_ @type {import('next').NextConfig} _/
const nextConfig = {
reactStrictMode: true,
};

export default nextConfig;

tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
content: [
"./pages/**/*.{js,ts,jsx,tsx,mdx}",
"./components/**/*.{js,ts,jsx,tsx,mdx}",
"./app/**/*.{js,ts,jsx,tsx,mdx}",
"./lib/**/*.{js,ts,jsx,tsx,mdx}",
],
theme: {
extend: {
colors: {
primary: {
DEFAULT: "hsl(262, 83%, 58%)",
foreground: "hsl(0, 0%, 100%)",
},
},
animation: {
'fade-in': 'fadeIn 0.5s ease-in-out',
},
keyframes: {
fadeIn: {
'0%': { opacity: '0' },
'100%': { opacity: '1' },
},
},
},
},
plugins: [],
};
export default config;

postcss.config.js
module.exports = {
plugins: {
tailwindcss: {},
autoprefixer: {},
},
}

middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Diese Routen sind öffentlich zugänglich und erfordern keine Anmeldung.
const isPublicRoute = createRouteMatcher(['/']);

export default clerkMiddleware((auth, request) => {
// Schütze alle Routen, die nicht explizit als öffentlich markiert sind.
if (!isPublicRoute(request)) {
auth().protect();
}
});

export const config = {
matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { deDE } from "@clerk/localizations";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
title: "Intelligenter Logo Generator",
description: "Erstellen Sie professionelle Logos mit einem KI-gestützten Expertensystem.",
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<ClerkProvider localization={deDE}>
<html lang="de">
<body className={`${inter.className} bg-gray-900 text-white`}>{children}</body>
</html>
</ClerkProvider>
);
}

app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
-ms-overflow-style: none; /_ IE and Edge _/
scrollbar-width: none; /_ Firefox _/
}
body::-webkit-scrollbar {
display: none; /_ Chrome, Safari and Opera _/
}

components/Header.tsx
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export const Header = () => {
return (
<header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
<Link href="/" className="font-bold text-xl">
LogoGen Pro
</Link>
<div className="flex items-center gap-4">
<SignedIn>
<Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
Meine Logos
</Link>
<UserButton afterSignOutUrl="/" />
</SignedIn>
<SignedOut>
<div className="flex items-center gap-2">
<SignInButton mode="modal">
<button className="text-sm font-medium hover:text-primary transition-colors">Anmelden</button>
</SignInButton>
<SignUpButton mode="modal">
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">Registrieren</button>
</SignUpButton>
</div>
</SignedOut>
</div>
</header>
);
};

lib/types.ts
import { FC } from 'react';

// === KERN-TYPEN FÜR DIE DATEN-ENGINE ===

export interface IconProps {
x?: number;
y?: number;
width?: number;
height?: number;
color?: string;
[key: string]: any;
}

export interface IconData {
id: string;
component: FC<IconProps>;
tags: string[];
}

export interface FontData {
name: string;
family: string;
url: string;
weights: number[];
category: string;
}

export interface LayoutData {
id: string;
name: string;
type: 'standard' | 'enclosed';
shape?: 'circle' | 'shield';
arrangement: 'icon-top' | 'icon-left';
}

export interface PaletteData {
id: string;
name: string;
colors: [string, string, string]; // [background, primary, text]
tags: string[];
}

export interface PersonalityData {
id: string;
name: string;
tags: string[];
}

// === ZUSTANDS-TYPEN FÜR DIE ANWENDUNG & REDUCER ===

export interface LogoConfig {
icon: IconData | null;
font: FontData | null;
layout: LayoutData | null;
palette: PaletteData | null;
text: string;
slogan: string;
}

export interface HistoryState {
past: LogoConfig[];
present: LogoConfig;
future: LogoConfig[];
}

export type Action =
| { type: 'SET_CONFIG'; payload: Partial<LogoConfig> }
| { type: 'UNDO' }
| { type: 'REDO' };

lib/data.ts
import { IconProps, IconData, FontData, LayoutData, PaletteData, PersonalityData } from './types';
import React from 'react';

// --- 1. Kuratierte Icon-Bibliothek ---
const GrowthIcon: React.FC<IconProps> = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
<path d="M17 3L21 7L15 13L11 9L3 17" stroke={props.color || 'currentColor'} /><polyline points="14 3 17 3 17 6" stroke={props.color || 'currentColor'} />
</svg>
);
const SecurityIcon: React.FC<IconProps> = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={props.color || 'currentColor'}/>
</svg>
);
const ConnectionIcon: React.FC<IconProps> = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
<path d="M10 13a5 5 0 00-5-5H3M14 7a5 5 0 005-5V0M3 21h2a5 5 0 005-5v-1M14 17v1a5 5 0 005 5h2" stroke={props.color || 'currentColor'} />
</svg>
);
const LeafIcon: React.FC<IconProps> = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={props.color || 'currentColor'}/><path d="M12 2a10 10 0 00-2 19.8" stroke={props.color || 'currentColor'}/>
</svg>
);
const BoltIcon: React.FC<IconProps> = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke={props.color || 'currentColor'}/>
</svg>
);

export const icons: IconData[] = [
{ id: 'growth', component: GrowthIcon, tags: ['finance', 'eco', 'consulting', 'modern', 'growth', 'minimalist'] },
{ id: 'security', component: SecurityIcon, tags: ['finance', 'tech', 'serious', 'security', 'corporate'] },
{ id: 'connection', component: ConnectionIcon, tags: ['tech', 'community', 'modern', 'consulting', 'connection', 'elegant'] },
{ id: 'leaf', component: LeafIcon, tags: ['eco', 'wellness', 'nature', 'organic', 'minimalist'] },
{ id: 'bolt', component: BoltIcon, tags: ['tech', 'energy', 'speed', 'modern', 'playful'] },
];

// --- 2. Kuratierte Schriftarten ---
export const fonts: FontData[] = [
{ name: 'Montserrat', family: 'sans-serif', url: 'Montserrat', weights: [400, 700], category: 'Sans-Serif - Modern' },
{ name: 'Poppins', family: 'sans-serif', url: 'Poppins', weights: [400, 600], category: 'Sans-Serif - Modern' },
{ name: 'Lato', family: 'sans-serif', url: 'Lato', weights: [400, 700], category: 'Sans-Serif - Modern' },
{ name: 'Merriweather', family: 'serif', url: 'Merriweather', weights: [400, 700], category: 'Serif - Klassisch' },
{ name: 'Playfair Display', family: 'serif', url: 'Playfair+Display', weights: [400, 700], category: 'Serif - Elegant' },
{ name: 'Roboto Slab', family: 'serif', url: 'Roboto+Slab', weights: [400, 700], category: 'Serif - Modern' },
];

// --- 3. Vordefinierte, ausgewogene Layouts ---
export const layouts: LayoutData[] = [
{ id: 'standard-top', name: 'Standard (Oben)', type: 'standard', arrangement: 'icon-top' },
{ id: 'standard-left', name: 'Standard (Links)', type: 'standard', arrangement: 'icon-left' },
{ id: 'enclosed-circle-top', name: 'Im Kreis (Oben)', type: 'enclosed', shape: 'circle', arrangement: 'icon-top' },
{ id: 'enclosed-shield-top', name: 'Im Schild (Oben)', type: 'enclosed', shape: 'shield', arrangement: 'icon-top' },
];

// --- 4. Professionelle Farbpaletten ---
export const palettes: PaletteData[] = [
{ id: 'trust-blue', name: 'Vertrauen & Stabilität', colors: ['#E0EFFF', '#6AACFF', '#0A2A4E'], tags: ['corporate', 'tech', 'finance', 'serious'] },
{ id: 'eco-green', name: 'Natur & Wachstum', colors: ['#E6F5E3', '#77C66B', '#1E4620'], tags: ['eco', 'wellness', 'organic', 'nature'] },
{ id: 'modern-tech', name: 'Innovation & Tech', colors: ['#E8E5FF', '#9378FF', '#2D2063'], tags: ['tech', 'modern', 'vibrant', 'creative'] },
{ id: 'finance-gold', name: 'Seriosität & Finanzen', colors: ['#F5F5F5', '#C0C0C0', '#333333'], tags: ['finance', 'serious', 'corporate', 'luxury'] },
{ id: 'vibrant-creative', name: 'Kreativität & Energie', colors: ['#FFF0E5', '#FF8C42', '#D94A00'], tags: ['creative', 'playful', 'energy', 'modern'] },
{ id: 'luxury-black', name: 'Eleganz & Luxus', colors: ['#EAEAEA', '#A8A8A8', '#1A1A1A'], tags: ['luxury', 'elegant', 'serious', 'modern'] },
];

// --- 5. Definitionen für die "KI"-Logik ---
export const industries = {
'tech': { tags: ['tech'], name: 'Technologie' },
'finance': { tags: ['finance'], name: 'Finanzen' },
'eco': { tags: ['eco', 'wellness'], name: 'Ökologie & Wellness' },
'consulting': { tags: ['consulting', 'corporate'], name: 'Beratung' }
};

export const personalities: PersonalityData[] = [
{ id: 'modern', name: 'Modern & Innovativ', tags: ['modern', 'tech', 'minimalist'] },
{ id: 'elegant', name: 'Elegant & Luxuriös', tags: ['elegant', 'luxury'] },
{ id: 'serious', name: 'Seriös & Vertrauenswürdig', tags: ['serious', 'corporate'] },
{ id: 'playful', name: 'Verspielt & Kreativ', tags: ['playful', 'creative', 'vibrant'] },
{ id: 'organic', name: 'Natürlich & Organisch', tags: ['organic', 'nature', 'eco'] },
];

lib/state.ts
import { HistoryState, Action, LogoConfig } from './types';

// Der initiale leere Zustand für ein neues Logo
export const initialLogoConfig: LogoConfig = {
icon: null,
font: null,
layout: null,
palette: null,
text: '',
slogan: '',
};

// Der initiale Zustand für unseren Reducer, inklusive der Historie
export const initialState: HistoryState = {
past: [],
present: initialLogoConfig,
future: [],
};

// Die Reducer-Funktion, die die gesamte Zustandslogik kapselt
export function logoReducer(state: HistoryState, action: Action): HistoryState {
switch (action.type) {
case 'SET_CONFIG': {
const newPresent = { ...state.present, ...action.payload };
// Verhindert das Hinzufügen zur Historie bei reinen Text-Updates,
// um die Undo/Redo-Experience flüssiger zu machen.
const isTextChangeOnly = Object.keys(action.payload).every(k => ['text', 'slogan'].includes(k));
if (JSON.stringify(newPresent) === JSON.stringify(state.present)) {
return state;
}

      // Nur zur Historie hinzufügen, wenn es sich nicht *nur* um eine Textänderung handelt.
      // So wird die Historie nicht mit jedem Tastenanschlag überflutet.
      if (isTextChangeOnly) {
         return { ...state, present: newPresent };
      }

      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [],
      };
    }
    case 'UNDO': {
      if (state.past.length === 0) {
        return state;
      }
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) {
        return state;
      }
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }
    default: {
      return state;
    }

}
}

app/page.tsx
'use client';

import React, { useState, useMemo, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { icons, fonts, layouts, palettes, industries, personalities } from '@/lib/data';
import { LogoConfig, PaletteData, LayoutData } from '@/lib/types';
import { logoReducer, initialState } from '@/lib/state';
import { Download, Check, Circle, Shield, Undo2, Redo2 } from 'lucide-react';
import { Header } from '@/components/Header';

// === HELPER & UTILITY COMPONENTS ===
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
<motion.div
className="w-full"
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1, duration: 0.4 }}

>

    <h2 className="text-xl font-bold mb-4 text-primary">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {children}
    </div>

</motion.div>
);

const SelectionCard = ({ children, isSelected, onClick }: { children: React.ReactNode, isSelected: boolean, onClick: () => void }) => (

  <div
    onClick={onClick}
    className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 h-24 flex items-center justify-center text-center ${
      isSelected ? 'border-primary ring-2 ring-primary bg-primary/10' : 'border-white/20 hover:border-white/50 bg-white/5'
    }`}
  >
    {children}
    {isSelected && <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1"><Check size={12} /></div>}
  </div>
);

// === LOGO CANVAS & PREVIEW COMPONENTS ===
const LogoCanvas = ({ config }: { config: LogoConfig }) => {
const { icon, font, layout, palette, text, slogan } = config;
if (!icon || !font || !layout || !palette) return null;

const IconComponent = icon.component;
const [bgColor, primaryColor, textColor] = palette.colors;

const fontUrl = `https://fonts.googleapis.com/css2?family=${font.url.replace(/ /g, '+')}:wght@${font.weights.join(';')}&display=swap`;

const renderContent = () => {
const textLength = text.length || 10;
const baseFontSize = 28;
const fontSize = Math.max(14, baseFontSize - textLength _ 0.5);
const sloganFontSize = fontSize _ 0.5;

    if (layout.arrangement === 'icon-top') {
      return (
        <g>
          <IconComponent x={75} y={30} width={50} height={50} color={primaryColor} />
          <text x="100" y={110} fontSize={fontSize} fontWeight="bold" textAnchor="middle" fill={textColor}>{text || "Markenname"}</text>
          {slogan && <text x="100" y={110 + sloganFontSize + 5} fontSize={sloganFontSize} textAnchor="middle" fill={primaryColor}>{slogan}</text>}
        </g>
      );
    }
    if (layout.arrangement === 'icon-left') {
      const iconSize = 40;
      return(
        <g transform="translate(20, 0)">
          <IconComponent x={0} y={55} width={iconSize} height={iconSize} color={primaryColor} />
          <text x={iconSize + 15} y={75} fontSize={fontSize * 0.8} fontWeight="bold" textAnchor="start" fill={textColor}>{text || "Markenname"}</text>
          {slogan && <text x={iconSize + 15} y={75 + sloganFontSize} fontSize={sloganFontSize * 0.9} textAnchor="start" fill={primaryColor}>{slogan}</text>}
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

return (
<svg id={`logo-svg-${palette.id}`} width="100%" height="auto" viewBox="0 0 200 200" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
<Head><link rel="stylesheet" href={fontUrl} /></Head>
<style>{`#logo-svg-${palette.id} text { font-family: '${font.name}', ${font.family}; }`}</style>
{layout.type === 'enclosed' && <rect x="0" y="0" width="200" height="200" fill={bgColor} rx={layout.shape === 'circle' ? 100 : 20}/>}
{renderShape()}
{renderContent()}
</svg>
);
};

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

return (
<div className="space-y-8">
<div>
<h3 className="font-bold mb-2 text-primary">Farbversion</h3>
<div className="bg-white/10 rounded-lg p-4"><LogoCanvas config={config} /></div>
</div>
<div>
<h3 className="font-bold mb-2 text-primary">Monochrome Version</h3>
<div className="bg-black border border-white/20 rounded-lg p-4"><LogoCanvas config={monochromeConfig} /></div>
</div>
<button onClick={handleDownload} disabled={!config.text} className="w-full mt-4 bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
<Download size={18} />SVG Herunterladen</button>
</div>
);
};

const MockupPreview = ({ config }: { config: LogoConfig }) => {
return (
<div className="space-y-6">
<div className="bg-white rounded-lg p-6 shadow-lg aspect-[10/6] w-full flex items-center">
<div className="w-1/3"><div style={{ transform: 'scale(0.5)' }}><LogoCanvas config={config} /></div></div>
<div className="w-2/3 border-l-2 border-gray-200 pl-4">
<p className="text-black font-bold text-xl">{config.text || "Dein Name"}</p><p className="text-gray-500 text-sm">Deine Position</p>
<div className="mt-4 space-y-1 text-xs text-gray-700"><p>+49 123 456 7890</p><p>hallo@deinemarke.de</p></div>
</div>
</div>
<div className="bg-gray-800 rounded-lg p-4 shadow-lg w-full flex items-center justify-between">
<div className="w-1/4"><div style={{ transform: 'scale(0.3)', transformOrigin: 'left center' }}><LogoCanvas config={config} /></div></div>
<div className="flex items-center gap-4 text-sm text-gray-300"><p>Produkte</p><p>Über Uns</p><p>Kontakt</p></div>
</div>
<div className="bg-gray-900 p-6 rounded-lg w-full">
<p className="text-center font-bold text-white mb-4">App Icon</p>
<div className="flex justify-center items-center gap-6">
<div className="w-20 h-20 bg-black rounded-3xl overflow-hidden"><LogoCanvas config={config} /></div>
<div className="w-20 h-20 bg-white rounded-3xl overflow-hidden"><LogoCanvas config={{...config, palette: {...config.palette, colors: ['#000000', '#000000', '#000000']} as any}}/></div>
</div>
</div>
</div>
);
};

const LayoutSelectionCard = ({ layout, isSelected, onClick }: { layout: LayoutData, isSelected: boolean, onClick: () => void }) => {
return (
<SelectionCard isSelected={isSelected} onClick={onClick}>
<div className="flex flex-col items-center justify-center gap-2 text-xs">
{layout.shape === 'circle' && <Circle size={24}/>}
{layout.shape === 'shield' && <Shield size={24}/>}
{!layout.shape && (layout.arrangement === 'icon-top' ? <div className="space-y-1"><div className="w-4 h-4 bg-white/50 rounded-sm mx-auto"></div><div className="w-8 h-2 bg-white/50 rounded-sm"></div></div> : <div className="flex gap-1 items-center"><div className="w-4 h-4 bg-white/50 rounded-sm"></div><div className="w-8 h-2 bg-white/50 rounded-sm"></div></div>)}
<p className="mt-1">{layout.name}</p>
</div>
</SelectionCard>
);
};

// === MAIN PAGE COMPONENT ===
export default function LogoGeneratorPage() {
const [step, setStep] = useState(1);
const [industry, setIndustry] = useState<string | null>(null);
const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);
const [previewTab, setPreviewTab] = useState<'preview' | 'mockups'>('preview');

const [state, dispatch] = useReducer(logoReducer, initialState);
const { present: config, past, future } = state;

const updateConfig = (newConfig: Partial<LogoConfig>) => {
dispatch({ type: 'SET_CONFIG', payload: newConfig });
};

const handleUndo = () => dispatch({ type: 'UNDO' });
const handleRedo = () => dispatch({ type: 'REDO' });

const handlePersonalityToggle = (id: string) => {
const newSelection = selectedPersonalities.includes(id)
? selectedPersonalities.filter(p => p !== id)
: [...selectedPersonalities, id].slice(0, 2);
setSelectedPersonalities(newSelection);
};

const { filteredIcons, filteredFonts, filteredPalettes } = useMemo(() => {
if (!industry) return { filteredIcons: icons, filteredFonts: fonts, filteredPalettes: palettes };

    const industryTags = industries[industry as keyof typeof industries].tags;
    const personalityTags = personalities.filter(p => selectedPersonalities.includes(p.id)).flatMap(p => p.tags);
    const activeTags = new Set([...industryTags, ...personalityTags]);

    const getScore = (itemTags: string[]) => itemTags.reduce((score, tag) => activeTags.has(tag) ? score + 1 : score, 0);

    const filteredIcons = [...icons].sort((a, b) => getScore(b.tags) - getScore(a.tags));
    const filteredPalettes = [...palettes].sort((a, b) => getScore(b.tags) - getScore(a.tags));

    return { filteredIcons, filteredFonts: fonts, filteredPalettes };

}, [industry, selectedPersonalities]);

const renderStep = () => {
switch (step) {
case 1:
return (
<motion.div key="step1" className="space-y-8 animate-fade-in">
<h1 className="text-4xl font-bold">Erzählen Sie uns von Ihrer Marke</h1>
<Section title="In welcher Branche sind Sie tätig?">
{Object.entries(industries).map(([key, value]) => (
<SelectionCard key={key} isSelected={industry === key} onClick={() => setIndustry(key)}>
<p className="font-bold">{value.name}</p>
</SelectionCard>
))}
</Section>
<button onClick={() => setStep(2)} disabled={!industry} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Weiter</button>
</motion.div>
);
case 2:
return (
<motion.div key="step2" className="space-y-8 animate-fade-in">
<div>
<label htmlFor="text" className="block text-xl font-bold mb-2 text-primary">Markenname</label>
<input type="text" id="text" value={config.text} onChange={(e) => updateConfig({ text: e.target.value })} className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="z.B. Quantum Leap"/>
</div>
<div>
<label className="block text-xl font-bold mb-2 text-primary">Markenpersönlichkeit (max. 2)</label>
<div className="flex flex-wrap gap-2">{personalities.map(p => <button key={p.id} onClick={() => handlePersonalityToggle(p.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedPersonalities.includes(p.id) ? 'bg-primary text-primary-foreground' : 'bg-white/10 hover:bg-white/20'}`}>{p.name}</button>)}</div>
</div>
<button onClick={() => setStep(3)} disabled={!config.text} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Weiter zur Gestaltung</button>
</motion.div>
);
case 3:
const fontCategories = [...new Set(filteredFonts.map(f => f.category))];
return (
<motion.div key="step3" className="space-y-12 animate-fade-in">
<div className="flex items-center gap-2">
<button onClick={handleUndo} disabled={past.length === 0} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"><Undo2 size={16}/> Rückgängig</button>
<button onClick={handleRedo} disabled={future.length === 0} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"><Redo2 size={16}/> Wiederholen</button>
</div>

            <Section title="Wählen Sie ein Symbol">{filteredIcons.map(icon => (<SelectionCard key={icon.id} isSelected={config.icon?.id === icon.id} onClick={() => updateConfig({ icon })}><icon.component className="w-12 h-12 mx-auto" color={config.palette ? config.palette.colors[1] : 'white'} /></SelectionCard>))}</Section>

            {fontCategories.map(category => (<Section key={category} title={`Schriftart: ${category}`}>
                {filteredFonts.filter(f => f.category === category).map(font => (<SelectionCard key={font.name} isSelected={config.font?.name === font.name} onClick={() => updateConfig({ font })}><p style={{ fontFamily: font.name }} className="text-2xl text-center">{font.name}</p></SelectionCard>))}
            </Section>))}

            <Section title="Wählen Sie ein Layout">{layouts.map(layout => (<LayoutSelectionCard key={layout.id} layout={layout} isSelected={config.layout?.id === layout.id} onClick={() => updateConfig({ layout })} />))}</Section>

            <Section title="Wählen Sie eine Farbpalette">{filteredPalettes.map(palette => (<SelectionCard key={palette.id} isSelected={config.palette?.id === palette.id} onClick={() => updateConfig({ palette })}>
                <div className="flex gap-2 w-full h-full">{palette.colors.map(c => <div key={c} style={{backgroundColor: c}} className="w-1/3 h-full rounded"></div>)}</div>
            </SelectionCard>))}</Section>
          </motion.div>
        );
      default: return <div>Ungültiger Schritt</div>;
    }

};

const progress = (step / 3) \* 100;
const isLogoConfigComplete = config.icon && config.font && config.layout && config.palette && config.text;

return (
<>
<Header />
<main className="min-h-screen w-full grid md:grid-cols-2 pt-20">
<div className="p-8 md:p-12 overflow-y-auto max-h-[calc(100vh-5rem)]">
<AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
</div>
<div className="bg-black/50 p-8 md:p-12 h-screen sticky top-0 flex flex-col">
<div className="w-full h-2 bg-white/10 rounded-full mb-4"><motion.div className="h-2 bg-primary rounded-full" animate={{ width: `${progress}%` }} /></div>

          <div className="flex border-b border-white/20 mb-6">
              <button onClick={() => setPreviewTab('preview')} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'}`}>Vorschau</button>
              <button onClick={() => setPreviewTab('mockups')} disabled={!isLogoConfigComplete} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'mockups' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'} disabled:text-white/20 disabled:cursor-not-allowed`}>Mockups</button>
          </div>

          <div className="flex-grow overflow-y-auto">
               <AnimatePresence mode="wait">
                  {previewTab === 'preview' && (
                      <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {isLogoConfigComplete ? <LogoPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Treffen Sie eine Auswahl, um die Vorschau zu sehen.</p></div>}
                      </motion.div>
                  )}
                   {previewTab === 'mockups' && (
                      <motion.div key="mockups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {isLogoConfigComplete? <MockupPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Vervollständigen Sie Ihr Logo, um die Mockups zu sehen.</p></div>}
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
        </div>
      </main>
    </>

);
}
