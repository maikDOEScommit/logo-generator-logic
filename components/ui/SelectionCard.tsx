import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const SelectionCard = ({ children, isSelected, onClick, disabled = false, noAnimation = false }: { children: React.ReactNode, isSelected: boolean, onClick: () => void, disabled?: boolean, noAnimation?: boolean }) => {
  const [showTopBorder, setShowTopBorder] = useState(false);
  const [showLeftBorder, setShowLeftBorder] = useState(false);
  const [showRightBorder, setShowRightBorder] = useState(false);
  const [showBottomBorder, setShowBottomBorder] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Reset animations when isSelected becomes false
  useEffect(() => {
    if (!isSelected) {
      // Start reverse animation sequence for deselection
      setShowBottomBorder(false);
      setShowLeftBorder(false);
      
      setTimeout(() => {
        setShowRightBorder(false);
        setShowTopBorder(false);
        setAnimationComplete(false);
      }, 225);
    }
  }, [isSelected]);

  const handleClick = () => {
    if (disabled) return;
    
    if (noAnimation) {
      // Skip animation if noAnimation prop is true
      onClick();
      return;
    }
    
    // Reset animations
    setShowTopBorder(false);
    setShowLeftBorder(false);
    setShowRightBorder(false);
    setShowBottomBorder(false);
    setAnimationComplete(false);
    
    // Start border animation sequence
    setTimeout(() => {
      setShowTopBorder(true);
      setShowRightBorder(true);
      
      setTimeout(() => {
        setShowLeftBorder(true);
        setShowBottomBorder(true);
        
        setTimeout(() => {
          setAnimationComplete(true);
          onClick(); // Call the actual onClick after animation completes
        }, 225);
      }, 450);
    }, 50);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative p-4 rounded-lg min-h-24 flex items-center justify-center text-center transition-all duration-[800ms] ease-out group overflow-hidden ${
        disabled 
          ? 'bg-white/5 opacity-50 cursor-not-allowed' 
          : noAnimation
            ? isSelected
              ? 'bg-white/10 border-2 border-white/30 shadow-lg shadow-white/10 cursor-pointer'
              : 'bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 cursor-pointer'
            : isSelected 
              ? 'bg-white/5 scale-105 shadow-[0_10px_40px_rgba(139,92,246,0.25)] cursor-pointer' 
              : 'bg-white/5 hover:bg-transparent shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:shadow-none cursor-pointer border border-white/20 hover:border-transparent'
      }`}
    >
      {/* Animated borders for selection animation - only show if animation is enabled */}
      {!noAnimation && (
        <>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: showTopBorder ? '100%' : 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute top-0 right-0 h-1 bg-gradient-to-l from-cyan-400 via-purple-600 to-blue-500"
          />
          
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: showRightBorder ? '100%' : 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute right-0 top-0 w-1 bg-gradient-to-b from-blue-500 via-purple-600 to-cyan-400"
          />
          
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: showLeftBorder ? '100%' : 0 }}
            transition={{ duration: 0.225, ease: "easeOut" }}
            className="absolute left-0 top-0 w-1 bg-gradient-to-b from-blue-500 via-purple-600 to-cyan-400"
          />
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: showBottomBorder ? '100%' : 0 }}
            transition={{ duration: 0.225, ease: "easeOut" }}
            className="absolute bottom-0 right-0 h-1 bg-gradient-to-l from-cyan-400 via-purple-600 to-blue-500"
          />
        </>
      )}

      {/* Static colored border frame for already selected state - only show if animation is enabled */}
      {!noAnimation && isSelected && !showTopBorder && !disabled && (
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
        <div 
          className="absolute top-2 right-2 text-white rounded-full p-1 z-20" 
          style={{ 
            transform: 'scale(0.88)',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 20%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.6) 80%, transparent 100%)'
          }}
        >
          <Check size={12} />
        </div>
      )}
    </div>
  );
};
export default SelectionCard;