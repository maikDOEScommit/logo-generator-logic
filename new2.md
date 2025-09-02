Refactoring Task: Polish the User Experience & Prepare for Backend Integration
Hello Claude. You will now act as a senior full-stack developer with a keen eye for user experience. Our application is architecturally sound, but we need to refine the user interface and prepare it for the upcoming backend integration (user accounts and saving logos).

Please follow these steps precisely to implement the required changes.

Step 1: Re-implement the Authentication-Aware Header
Goal: Provide users with a clear way to sign in, sign up, and manage their profile.

Explanation:
The current Header.tsx is static. We need to replace it with the authentication-aware version that uses Clerk components. This is a critical step for preparing our app for user accounts.

File to Modify: components/Header.tsx

Instructions:
Replace the entire content of components/Header.tsx with the following code. It uses <SignedIn> and <SignedOut> from Clerk to dynamically display the correct buttons.

// components/Header.tsx
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

Step 2: Enhance the Main Page (page.tsx) with a Hero Section
Goal: Improve the first impression of the application and create a more engaging entry point for the user.

Explanation:
We will integrate the Typewriter component into a new "Hero Section" at the top of the editor panel. This will immediately communicate the tool's purpose and value. We will also introduce a clear Call-to-Action (CTA) button to start the process, which smoothly scrolls the user to the first step.

File to Modify: app/page.tsx

Instructions:
Update the main return statement of the LogoGeneratorPage component in app/page.tsx. You will add the new Hero Section and wrap the existing steps in a separate container.

// app/page.tsx

// ... (imports and component logic remain the same)

export default function LogoGeneratorPage() {
// ... (all existing hooks and handlers remain the same)

const isLogoConfigComplete = !!(config.icon && config.font && config.layout && config.palette && config.text);

// Helper function to scroll to the editor
const scrollToEditor = () => {
document.getElementById('editor-steps')?.scrollIntoView({ behavior: 'smooth' });
};

return (
<>
<Header />
<main className="min-h-screen w-full grid md:grid-cols-2 pt-20">
<div className="p-8 md:p-12 overflow-y-auto max-h-[calc(100vh-5rem)]">

          {/* === NEW HERO SECTION === */}
          <div className="text-center min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              <Typewriter
                phrases={[
                  "Create Brands.",
                  "Create Logos.",
                  "Create Identity.",
                ]}
                typingSpeed={60}
                deletingSpeed={40}
                holdBeforeDelete={1200}
                holdBeforeType={300}
                cursor
                loop={true}
                className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
              />
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Unser intelligenter Assistent führt Sie durch die goldenen Regeln des Designs, um ein perfektes, zeitloses Logo für Ihre Marke zu erstellen.
            </p>
            <button
              onClick={scrollToEditor}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all transform hover:scale-105"
            >
              Jetzt starten
            </button>
          </div>

          {/* === EDITOR STEPS CONTAINER === */}
          <div id="editor-steps" className="pt-20">
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </div>

        </div>
        <div className="bg-black/50 p-8 md:p-12 h-screen sticky top-0 flex flex-col">
          {/* ... (The preview panel remains exactly the same) ... */}
          <div className="w-full h-2 bg-white/10 rounded-full mb-4">
            <motion.div className="h-2 bg-primary rounded-full" animate={{ width: `${isLogoConfigComplete ? 100 : (step -1) * 33.33}%` }} />
          </div>

          <div className="flex border-b border-white/20 mb-6">
              <button onClick={() => setPreviewTab('preview')} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'}`}>Vorschau</button>
              <button onClick={() => setPreviewTab('mockups')} disabled={!isLogoConfigComplete} className={`px-4 py-2 font-bold transition-colors ${previewTab === 'mockups' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'} disabled:text-white/20 disabled:cursor-not-allowed`}>Mockups</button>
          </div>

          <div className="flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
              {previewTab === 'preview' && (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isLogoConfigComplete ? <LogoPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Beginnen Sie den Prozess, um die Vorschau zu sehen.</p></div>}
                </motion.div>
              )}
              {previewTab === 'mockups' && (
                <motion.div key="mockups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isLogoConfigComplete ? <MockupPreview config={config} /> : <div className="h-full flex items-center justify-center text-white/50"><p>Vervollständigen Sie Ihr Logo, um die Mockups zu sehen.</p></div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>

);
}

Step 3: Prepare the UI for Saving Logos
Goal: Add a "Save Logo" button to the UI that is only visible and active for logged-in users.

Explanation:
This is a preparatory step for our full backend integration. We will add a "Save" button to the LogoPreview component. We'll use Clerk's <SignedIn> component to ensure it only appears for authenticated users. The button's onClick handler will be a placeholder for now, but its presence makes the benefit of signing in immediately clear to the user.

File to Modify: components/preview/LogoPreview.tsx

Instructions:
Wrap the existing "Download" button and the new "Save" button in a container. Use Clerk's <SignedIn> and <SignedOut> components to conditionally render the save button or a prompt to log in.

// components/preview/LogoPreview.tsx
import { useMemo } from 'react';
import { LogoConfig, PaletteData } from '@/lib/types';
import { evaluateLogoDesign, suggestImprovements } from '@/lib/designRules';
import { Download, Save } from 'lucide-react';
import LogoCanvas from './LogoCanvas';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

const LogoPreview = ({ config }: { config: LogoConfig }) => {
// ... (handleDownload, monochromePalette, evaluation, and suggestions logic remains the same)

const handleSave = () => {
// Placeholder for database save logic
alert('Save functionality coming soon!');
console.log('Saving logo config:', config);
};

return (
<div className="space-y-6">
{/_ ... (Design-Qualität Scorecard remains the same) ... _/}

      <div>
        <h3 className="font-bold mb-2 text-primary">Farbversion</h3>
        <div className="bg-white/10 rounded-lg p-4"><LogoCanvas config={config} /></div>
      </div>
      <div>
        <h3 className="font-bold mb-2 text-primary">Monochrome Version</h3>
        <div className="bg-black border border-white/20 rounded-lg p-4"><LogoCanvas config={monochromeConfig} idSuffix="-mono" /></div>
      </div>

      {/* === NEW SAVE/DOWNLOAD ACTION AREA === */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <SignedIn>
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
        </SignedOut>

        <button onClick={handleDownload} disabled={!config.text} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          <Download size={18} /> Download SVG
        </button>
      </div>

    </div>

);
};
export default LogoPreview;
