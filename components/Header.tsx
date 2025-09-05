import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export const Header = () => {
  return (
    <>
      <style jsx>{`
        .glow-border {
          box-shadow: 
            0 0 20px rgba(59, 130, 246, 0.15),
            0 0 40px rgba(147, 51, 234, 0.1),
            0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.025));
        }
        .glow-border:hover {
          box-shadow: 
            0 0 30px rgba(59, 130, 246, 0.25),
            0 0 60px rgba(147, 51, 234, 0.15),
            0 12px 40px rgba(0, 0, 0, 0.4);
          transition: all 0.3s ease-in-out;
        }
      `}</style>
      <header className="absolute top-0 left-0 w-full p-4 z-10">
      <div className="max-w-7xl mx-auto bg-white/1 backdrop-blur-sm rounded-xl shadow-2xl shadow-blue-500/20 border border-white/5 px-6 py-3 flex justify-between items-center glow-border">
      <Link href="/" className="font-bold text-xl">
        Lola Gen 2.0
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
        
        <SignedIn>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Meine Logos
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="text-sm font-medium hover:text-primary transition-colors">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95">Sign Up</button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
      </div>
    </header>
    </>
  );
};