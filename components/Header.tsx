import Link from 'next/link';

export const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
      <Link href="/" className="font-bold text-xl">
        LogoGen Pro
      </Link>
      <div className="flex items-center gap-4">
        <div className="text-sm text-white/60">
          Intelligenter Logo-Generator basierend auf den 10 goldenen Regeln des Designs
        </div>
      </div>
    </header>
  );
};