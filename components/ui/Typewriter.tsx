import React, { useEffect, useRef, useState } from "react";

export function Typewriter({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  holdBeforeDelete = 1000,
  holdBeforeType = 200,
  loop = true,
  cursor = true,
  className = "",
}: {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  holdBeforeDelete?: number;
  holdBeforeType?: number;
  loop?: boolean;
  cursor?: boolean;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!phrases.length) return;

    const currentPhrase = phrases[currentIndex];

    const animate = () => {
      if (isDeleting) {
        // DELETING MODE
        const nextPhrase = phrases[(currentIndex + 1) % phrases.length];
        const shouldDeleteAll = !nextPhrase.startsWith("Create");
        
        if (displayText === "" || (!shouldDeleteAll && displayText === "Create ")) {
          // Finished deleting, move to next phrase
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % phrases.length);
          timeoutRef.current = setTimeout(animate, holdBeforeType);
        } else {
          // Continue deleting
          setDisplayText((prev) => prev.slice(0, -1));
          console.log(`DELETING: "${displayText}" with ${deletingSpeed}ms delay (shouldDeleteAll: ${shouldDeleteAll})`);
          timeoutRef.current = setTimeout(animate, deletingSpeed);
        }
      } else {
        // TYPING MODE
        if (displayText === currentPhrase) {
          // Finished typing, start deleting after pause
          console.log(`FINISHED TYPING: "${displayText}". Waiting ${holdBeforeDelete}ms before deleting`);
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
            animate();
          }, holdBeforeDelete);
        } else {
          // Continue typing
          const nextChar = currentPhrase[displayText.length];
          setDisplayText((prev) => prev + nextChar);
          console.log(`TYPING: "${displayText + nextChar}" with ${typingSpeed}ms delay`);
          timeoutRef.current = setTimeout(animate, typingSpeed);
        }
      }
    };

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start animation
    timeoutRef.current = setTimeout(animate, 100);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, currentIndex, isDeleting, phrases, typingSpeed, deletingSpeed, holdBeforeDelete, holdBeforeType]);

  // Find longest phrase for layout stability
  const longestPhrase = phrases.reduce((longest, current) => 
    current.length > longest.length ? current : longest, ""
  );

  // Render text with gradients for specific words
  const renderTextWithGradient = (text: string) => {
    const gradientWords = ['Brands', 'Logos', 'Vibes', 'seconds!'];
    
    // Check if text ends with any gradient word
    const gradientWord = gradientWords.find(word => text.endsWith(word));
    
    if (gradientWord) {
      const beforeGradient = text.slice(0, -gradientWord.length);
      return (
        <>
          {beforeGradient}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            {gradientWord}
          </span>
        </>
      );
    }
    
    return text;
  };

  return (
    <span className={`inline-flex items-center relative ${className}`}>
      {/* Invisible placeholder for consistent width */}
      <span className="opacity-0 pointer-events-none whitespace-pre" aria-hidden="true">
        {longestPhrase}
      </span>
      {/* Actual visible text */}
      <span className="absolute left-0 whitespace-pre inline-flex items-center">
        {renderTextWithGradient(displayText)}
        {cursor && <Caret />}
      </span>
    </span>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-1 inline-block w-[1ch] h-[1.2em] bg-gray-100 opacity-80 animate-pulse align-baseline"
      style={{ maskImage: "linear-gradient(transparent 0, black 0)" }}
    />
  );
}