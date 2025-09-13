import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  
  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-gray-900 text-white';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-white text-gray-900';
    }
  }, [isDarkMode]);

  return (
    <>
      <style jsx>{`
        .navbar-glass {
          background: rgba(255, 255, 255, 0.05);
          position: relative;
        }
        .navbar-glass:hover {
          background: rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease-in-out;
        }
        .navbar-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          padding: 1px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.1) 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.1) 75%,
            rgba(255, 255, 255, 0.3) 100%
          );
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask-composite: xor;
          pointer-events: none;
        }
        .navbar-glass::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%,
            rgba(255, 255, 255, 0.6) 20%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0.6) 80%,
            transparent 100%
          );
          border-radius: 12px 12px 0 0;
          pointer-events: none;
        }
      `}</style>
      <header className="absolute top-0 left-0 w-full p-4 z-10">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-[1px] rounded-xl border border-white/10 px-6 py-3 flex justify-between items-center navbar-glass">
      <Link href="/" className="font-bold text-xl relative">
        <span className="bg-gradient-to-r from-yellow-200 via-yellow-600 to-emerald-300 bg-clip-text text-transparent relative z-10">
          Lola Gen 2.0
        </span>
        <div className={`absolute -inset-y-2 -inset-x-4 rounded-lg pointer-events-none border-[0.6px] border-solid ${
          isDarkMode
            ? 'bg-black/90 border-white'
            : 'bg-white/90 border-gray-300'
        }`}></div>
      </Link>
      <div className="flex items-center gap-4">
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/examples" className="text-sm font-medium hover:text-primary transition-colors">
            Examples
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
        </div>
        
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors border border-emerald-300/30"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <Sun size={16} className="text-white" />
          ) : (
            <Moon size={16} className="text-gray-900" />
          )}
        </button>
        
        <SignedIn>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Meine Logos
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className={`signin-btn text-sm font-medium transition-all duration-300 ${!isDarkMode ? 'hover:scale-110' : 'hover:text-primary'}`}>Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                className="signup-btn bg-black px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-[1.15] active:scale-95 border border-black hover:bg-transparent hover:text-black"
                style={{
                  color: 'white',
                  backgroundColor: 'black',
                  borderColor: 'black'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'black';
                  e.target.style.backgroundColor = 'transparent';
                  const span = e.target.querySelector('span');
                  if (span) {
                    // In light mode: black text on hover, in dark mode: white text on hover
                    span.style.color = isDarkMode ? 'white' : 'black';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'white';
                  e.target.style.backgroundColor = 'black';
                  const span = e.target.querySelector('span');
                  if (span) span.style.color = 'white';
                }}
              >
                <span className="signup-text" style={{ color: 'white', textShadow: 'none' }}>Sign Up</span>
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
      </div>
    </header>
    </>
  );
};