import { Check } from 'lucide-react';

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
export default SelectionCard;