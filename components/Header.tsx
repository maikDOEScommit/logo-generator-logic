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