import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface CinematicIntroProps {
  onFinish: () => void;
}

const INTRO_MESSAGES = [
  'كل سنة وانتي طيبة ❤️',
  'يا أجمل ما رأت عيني...',
  'ويا أروع شخص في حياتي.',
  'أتمنى السنة الجديدة من عمرك تكون مليانة فرحة ونجاح وسعادة.',
  'وجودك في حياتي من أجمل الحاجات اللي حصلتلي.',
  'وأخيراً... Happy Birthday, My Favorite Person ❤️'
];

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [fadeState, setFadeState] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Typewriter effect & progression
  useEffect(() => {
    if (isFinished) return;

    if (currentStep >= INTRO_MESSAGES.length) {
      setIsFinished(true);
      return;
    }

    const fullText = INTRO_MESSAGES[currentStep];
    setFadeState('entering');
    setDisplayedText('');

    let charIndex = 0;
    // Typewriter interval
    const typeInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setFadeState('visible');

        // Hold visible for ~2 seconds then transition to next
        const holdTimer = setTimeout(() => {
          setFadeState('exiting');
          const exitTimer = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
          }, 600); // 600ms exit fade
          return () => clearTimeout(exitTimer);
        }, 2200);

        return () => clearTimeout(holdTimer);
      }
    }, 45); // Typing speed

    return () => clearInterval(typeInterval);
  }, [currentStep, isFinished]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Soft floating dust/particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-950/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-950/20 rounded-full blur-[110px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Skip button in corner */}
      <button
        onClick={onFinish}
        className="absolute top-6 left-6 text-xs text-neutral-500 hover:text-rose-300 transition-colors px-3 py-1.5 rounded-full border border-neutral-800 hover:border-rose-900/50 flex items-center gap-1.5"
      >
        <span>تخطي</span>
        <ArrowLeft className="w-3.5 h-3.5" />
      </button>

      {/* Message Container */}
      {!isFinished ? (
        <div className="max-w-xl mx-auto px-4 min-h-[160px] flex items-center justify-center">
          <p
            className={`font-amiri text-2xl md:text-4xl text-rose-100 leading-relaxed transition-all duration-700 ${
              fadeState === 'entering'
                ? 'opacity-80 scale-98 translate-y-1'
                : fadeState === 'visible'
                ? 'opacity-100 scale-100 translate-y-0 text-glow-rose'
                : 'opacity-0 scale-102 -translate-y-2'
            }`}
          >
            {displayedText}
            {fadeState === 'entering' && (
              <span className="inline-block w-1.5 h-6 bg-rose-400 ml-1 animate-pulse align-middle" />
            )}
          </p>
        </div>
      ) : (
        /* Final Reveal: "Your little universe is waiting..." + Enter button */
        <div className="max-w-md mx-auto flex flex-col items-center gap-6 animate-fadeIn transition-all duration-1000">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2 animate-bounce">
            <Sparkles className="w-6 h-6 text-rose-400" />
          </div>

          <h2 className="font-display italic text-2xl md:text-3xl text-rose-200 tracking-wide">
            Your little universe is waiting...
          </h2>

          <p className="font-amiri text-lg text-rose-300/80 -mt-2">
            عالمكِ الخاص ينتظر حضوركِ الساحر
          </p>

          <button
            onClick={onFinish}
            className="mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-medium text-lg tracking-wider shadow-lg shadow-rose-900/50 hover:shadow-rose-600/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <span>Enter</span>
            <span className="text-sm font-amiri">(دخول)</span>
          </button>
        </div>
      )}

      {/* Subtle indicator dots */}
      {!isFinished && (
        <div className="absolute bottom-10 flex items-center gap-1.5 opacity-30">
          {INTRO_MESSAGES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentStep ? 'w-5 bg-rose-400' : 'w-1.5 bg-neutral-700'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
