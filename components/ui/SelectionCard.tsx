import { Check } from 'lucide-react';

const SelectionCard = ({ children, isSelected, onClick }: { children: React.ReactNode, isSelected: boolean, onClick: () => void }) => (
  <div
    onClick={onClick}
    className={`relative p-4 border rounded-lg cursor-pointer h-24 flex items-center justify-center text-center transition-all duration-300 ease-in-out ${
      isSelected 
        ? 'border-primary ring-2 ring-primary bg-primary/10 scale-105 shadow-[0_10px_40px_rgba(139,92,246,0.25)]' 
        : 'border-white/20 bg-white/5 hover:border-white/50 shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:scale-105 hover:shadow-[0_10px_40px_rgba(255,255,255,0.25)]'
    }`}
  >
    {children}
    {isSelected && <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 z-10"><Check size={12} /></div>}
  </div>
);
export default SelectionCard;