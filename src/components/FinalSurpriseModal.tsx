import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw, X, Crown, Music } from 'lucide-react';
import { AppData } from '../types';

interface FinalSurpriseModalProps {
  data: AppData;
  onClose: () => void;
}

export const FinalSurpriseModal: React.FC<FinalSurpriseModalProps> = ({ data, onClose }) => {
  const [phase, setPhase] = useState<'blackout' | 'stars' | 'message' | 'celebration'>('blackout');

  const runCelebrationFlow = () => {
    setPhase('blackout');

    // Step 1: After 800ms, bring starry aurora
    setTimeout(() => {
      setPhase('stars');
    }, 800);

    // Step 2: After 2000ms, bring message
    setTimeout(() => {
      setPhase('message');
    }, 2200);

    // Step 3: After 4000ms, fire celebration confetti and full reveal
    setTimeout(() => {
      setPhase('celebration');
      // Confetti burst
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#f43f5e', '#fbbf24', '#f472b6', '#a855f7', '#ffffff']
        });

        setTimeout(() => {
          confetti({
            particleCount: 90,
            angle: 60,
            spread: 70,
            origin: { x: 0.1, y: 0.7 },
            colors: ['#fda4af', '#f59e0b', '#e11d48']
          });
          confetti({
            particleCount: 90,
            angle: 120,
            spread: 70,
            origin: { x: 0.9, y: 0.7 },
            colors: ['#fda4af', '#f59e0b', '#e11d48']
          });
        }, 500);
      } catch (e) {
        console.error(e);
      }
    }, 4200);
  };

  useEffect(() => {
    runCelebrationFlow();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 select-none overflow-hidden text-center">
      {/* Moving Cosmic Lights & Aurora (visible during stars and later) */}
      {phase !== 'blackout' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-rose-600/25 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-purple-600/25 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        </div>
      )}

      {/* Close button in top corner */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-50 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main Container */}
      <div className="relative z-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto px-4 py-8 space-y-6">
        
        {/* Crown & Intro */}
        {phase !== 'blackout' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center mx-auto text-amber-300 shadow-xl shadow-amber-900/40 animate-bounce">
              <Crown className="w-9 h-9" />
            </div>

            <span className="text-xs font-mono text-amber-300 uppercase tracking-widest block">
              The Climax • The Final Surprise
            </span>

            <h1 className="font-display italic text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300 leading-tight">
              To The Queen of My Universe ❤️
            </h1>
          </div>
        )}

        {/* Gradual Message Card */}
        {(phase === 'message' || phase === 'celebration') && (
          <div className="bg-[#120716]/90 border border-amber-400/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 animate-scaleIn backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-rose-400">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
              <span className="font-amiri text-lg text-rose-200 font-bold">
                رسالة من أعماق القلب إلى {data.herName}
              </span>
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
            </div>

            <div className="font-amiri text-lg sm:text-xl text-rose-100/95 leading-loose whitespace-pre-line text-right pr-2">
              {data.finalSurpriseMessage}
            </div>

            {/* Birthday Date Seal */}
            <div className="pt-4 border-t border-rose-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
              <span className="text-rose-300">9 نوفمبر • كل عام وأنتِ بقلبي</span>
              <span className="font-display italic text-amber-300 text-sm">Forever and Always Yours ✨</span>
            </div>
          </div>
        )}

        {/* Replay and Close Actions */}
        {phase === 'celebration' && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fadeIn">
            <button
              onClick={runCelebrationFlow}
              className="px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-amber-400/40 text-amber-200 text-sm font-medium transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>إعادة مشاهدة المفاجأة 💫</span>
            </button>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-bold shadow-lg shadow-rose-950 hover:scale-105 active:scale-95 transition-transform"
            >
              العودة إلى عالمنا ❤️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
