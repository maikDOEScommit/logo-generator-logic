import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Typewriter component with smart delete:
 * - Computes the longest common prefix between the current and next phrase
 * - Deletes only the differing tail, then types the new tail
 * - Supports configurable speeds, pauses, loop, and cursor
 */
export default function TypewriterDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 p-6">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight"> 
          {/* The animated line */}
          <Typewriter
            phrases={[
              "Develop Faster",
              "Develop Apps",
              "Develop Agents",
              "Develop Better",
            ]}
            typingSpeed={60}
            deletingSpeed={42}
            holdBeforeDelete={1100}
            holdBeforeType={220}
            cursor
          />
        </h1>
        <p className="text-sm md:text-base text-gray-400">Smart Typewriter Wrapper · deletes only what changes · Tailwind-ready</p>
      </div>
    </div>
  );
}

/** Hook: computes the longest common prefix length of two strings */
function useCommonPrefixLen(a: string, b: string) {
  return useMemo(() => {
    const min = Math.min(a.length, b.length);
    let i = 0;
    while (i < min && a[i] === b[i]) i++;
    return i;
  }, [a, b]);
}

/**
 * Core Typewriter component
 */
export function Typewriter({
  phrases,
  typingSpeed = 65,
  deletingSpeed = 45,
  holdBeforeDelete = 900,
  holdBeforeType = 150,
  loop = true,
  cursor = true,
  className = "",
}: {
  phrases: string[];
  typingSpeed?: number; // ms per char when typing
  deletingSpeed?: number; // ms per char when deleting
  holdBeforeDelete?: number; // ms to hold after finishing typing
  holdBeforeType?: number; // ms to wait after deletion before typing the next
  loop?: boolean;
  cursor?: boolean;
  className?: string;
}) {
  const [idx, setIdx] = useState(0); // phrase index
  const current = phrases[idx] ?? "";
  const next = phrases[(idx + 1) % phrases.length] ?? "";

  // Smart boundary: delete only the part that differs
  const keepLen = useCommonPrefixLen(current, next);

  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<
    | "typing"
    | "holding"
    | "deletingToKeep"
    | "typingRemainder"
    | "idle"
  >("typing");

  const timerRef = useRef<number | null>(null);

  // Clear timers on unmount
  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  // Initialize with empty and start typing current phrase
  useEffect(() => {
    setDisplay("");
    setPhase("typing");
  }, [idx]);

  // Main animation state machine
  useEffect(() => {
    if (!phrases.length) return;

    const clear = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };

    const type = () => {
      if (display.length < current.length) {
        timerRef.current = window.setTimeout(() => {
          setDisplay(current.slice(0, display.length + 1));
        }, typingSpeed);
      } else {
        // whole phrase typed, hold before delete
        timerRef.current = window.setTimeout(() => setPhase("deletingToKeep"), holdBeforeDelete);
      }
    };

    const deleteToKeep = () => {
      if (display.length > keepLen) {
        timerRef.current = window.setTimeout(() => {
          setDisplay(display.slice(0, -1));
        }, deletingSpeed);
      } else {
        // reached boundary, brief pause, then type remainder of next
        timerRef.current = window.setTimeout(() => setPhase("typingRemainder"), holdBeforeType);
      }
    };

    const typeRemainder = () => {
      const remainder = next.slice(keepLen);
      const have = display.slice(keepLen);
      if (have.length < remainder.length) {
        timerRef.current = window.setTimeout(() => {
          setDisplay(display + remainder[have.length]);
        }, typingSpeed);
      } else {
        // finished next
        if (!loop && idx === phrases.length - 1) {
          setPhase("idle");
        } else {
          setPhase("holding");
          timerRef.current = window.setTimeout(() => setIdx((i) => (i + 1) % phrases.length), holdBeforeType);
        }
      }
    };

    clear();
    switch (phase) {
      case "typing":
        type();
        break;
      case "deletingToKeep":
        deleteToKeep();
        break;
      case "typingRemainder":
        typeRemainder();
        break;
      case "holding":
      case "idle":
      default:
        break;
    }

    return () => clear();
  }, [phase, display, current, next, keepLen, typingSpeed, deletingSpeed, holdBeforeDelete, holdBeforeType, phrases.length, loop, idx]);

  // When we reach the fully-typed `current`, phase will switch to delete
  useEffect(() => {
    if (phase === "typing" && display === current) {
      // handled in main effect via the type() branch
    }
  }, [phase, display, current]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="whitespace-pre">{display}</span>
      {cursor && <Caret />}
    </span>
  );
}

function Caret() {
  // Accessible blinking caret using Tailwind utilities
  return (
    <span
      aria-hidden
      className="ml-1 inline-block w-[1ch] h-[1.2em] translate-y-0.5 bg-gray-100 opacity-80 animate-pulse"
      style={{ maskImage: "linear-gradient(transparent 0, black 0)" }}
    />
  );
}
