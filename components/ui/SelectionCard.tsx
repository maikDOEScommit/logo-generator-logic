import { Check } from 'lucide-react';

const SelectionCard = ({ children, isSelected, onClick, disabled = false }: { children: React.ReactNode, isSelected: boolean, onClick: () => void, disabled?: boolean }) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`relative p-4 rounded-lg min-h-24 flex items-center justify-center text-center transition-all duration-[800ms] ease-out group overflow-hidden ${
      disabled 
        ? 'bg-white/5 opacity-50 cursor-not-allowed' 
        : isSelected 
          ? 'bg-white/5 scale-105 shadow-[0_10px_40px_rgba(139,92,246,0.25)] cursor-pointer' 
          : 'bg-white/5 hover:bg-transparent shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:shadow-none cursor-pointer border border-white/20 hover:border-transparent'
    }`}
  >
    {/* Complete colored border frame for selected state - like Example Button end state */}
    {isSelected && !disabled && (
      <>
        {/* Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-cyan-400 via-purple-600 to-blue-500" />
        {/* Right Border */}
        <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-600 to-cyan-400" />
        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-cyan-400 via-purple-600 to-blue-500" />
        {/* Left Border */}
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-600 to-cyan-400" />
      </>
    )}
    
    <div className="relative z-10 transition-transform duration-[800ms] ease-out group-hover:scale-[1.15]">
      {children}
    </div>
    
    {isSelected && (
      <div className="absolute top-2 right-2 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-full p-1 z-20">
        <Check size={12} />
      </div>
    )}
  </div>
);
export default SelectionCard;