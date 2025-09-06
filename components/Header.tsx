import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export const Header = () => {
  return (
    <>
      <style jsx>{`
        .navbar-glass {
          background: rgba(255, 255, 255, 0.05);
        }
        .navbar-glass:hover {
          background: rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease-in-out;
        }
      `}</style>
      <header className="absolute top-0 left-0 w-full p-4 z-10">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-[1px] rounded-xl border border-white/10 px-6 py-3 flex justify-between items-center navbar-glass">
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