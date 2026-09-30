import { useEffect, useState } from "react";

export function GlobalLoader({ onComplete }: { onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    // Start progress bar animation right away (slight delay ensures CSS transition applies)
    const progressTimer = setTimeout(() => setProgress(true), 50);
    
    // Fade out after 1.2 seconds
    const fadeTimer = setTimeout(() => setIsFading(true), 1200);
    
    // Remove component after 1.6 seconds (giving time for fade transition)
    const removeTimer = setTimeout(onComplete, 1600);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary transition-opacity duration-300 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        <h1 className="font-['Gloock',Georgia,serif] text-[clamp(48px,8vw,72px)] text-white tracking-wide animate-pulse motion-reduce:animate-none m-0">
          Convivo
        </h1>
        <div className="relative mt-10 h-[2px] w-64 bg-white/10 rounded-full" aria-hidden="true">
          <div 
            className={`relative h-full bg-gradient-to-r from-white/5 via-white/60 to-white rounded-full transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              progress ? "w-full" : "w-0"
            }`} 
          >
            {/* Glowing tip (spark) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[2px] w-[20px] bg-white shadow-[0_0_14px_4px_rgba(255,255,255,1)] rounded-full blur-[1px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
