import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Cake, Sparkles, RefreshCw, Heart, Flame } from 'lucide-react';
import { AppData } from '../../types';

interface MakeAWishSectionProps {
  data: AppData;
}

export const MakeAWishSection: React.FC<MakeAWishSectionProps> = ({ data }) => {
  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [isBlowing, setIsBlowing] = useState<boolean>(false);
  const [wishMade, setWishMade] = useState<boolean>(false);

  const handleMakeWish = () => {
    if (!candlesLit || isBlowing) return;
    setIsBlowing(true);

    // After a brief wind/blow animation, extinguish candles and launch confetti
    setTimeout(() => {
      setCandlesLit(false);
      setIsBlowing(false);
      setWishMade(true);

      // Grand celebration confetti blast!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#fbbf24', '#f472b6', '#ffffff']
        });

        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#fb7185', '#e11d48', '#f59e0b']
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#fda4af', '#be123c', '#d97706']
          });
        }, 300);
      } catch (err) {
        console.error('Confetti error:', err);
      }
    }, 900);
  };

  const handleRelight = () => {
    setCandlesLit(true);
    setWishMade(false);
  };

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto px-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Cake className="w-3.5 h-3.5 text-rose-400" />
          <span>لحظة تمني الأمنيات</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400">
          Make a Wish ❤️
        </h1>
        <p className="font-amiri text-lg text-rose-200/80 max-w-xl mx-auto">
          أغمضي عينيكِ، تمني أمنية جميلة من أعماق قلبكِ، ثم اضغطي لإطفاء الشموع!
        </p>
      </div>

      {/* Birthday Cake Interactive Scene */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-rose-500/30 glow-rose max-w-2xl mx-auto flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
        
        {/* Cake Visual Construct */}
        <div className="relative pt-24 pb-8 flex flex-col items-center select-none">
          
          {/* Candle Flames & Candles (Tiers Top) */}
          <div className="absolute top-6 flex items-center justify-center gap-5 sm:gap-7 z-20">
            {[1, 2, 3, 4, 5].map((candleNum) => (
              <div key={candleNum} className="flex flex-col items-center relative">
                {/* Flame */}
                {candlesLit && (
                  <div
                    className={`w-3.5 h-6 rounded-full bg-gradient-to-t from-rose-600 via-amber-400 to-yellow-200 animate-flame transition-opacity duration-500 ${
                      isBlowing ? 'scale-75 opacity-50 -translate-y-1' : ''
                    }`}
                  />
                )}
                {/* Smoke when blown */}
                {!candlesLit && (
                  <div className="w-1.5 h-4 bg-neutral-400/40 rounded-full blur-[1px] animate-pulse -translate-y-1" />
                )}
                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-neutral-700" />
                {/* Candle Body */}
                <div className="w-3 h-14 bg-gradient-to-b from-rose-300 via-pink-400 to-rose-500 rounded-sm shadow-md border-t border-rose-200" />
              </div>
            ))}
          </div>

          {/* Cake Tier 1 (Top Layer) */}
          <div className="w-48 sm:w-56 h-16 bg-gradient-to-b from-pink-300 via-rose-300 to-rose-400 rounded-t-2xl shadow-xl relative border-t-2 border-white/40 flex items-center justify-around px-2 z-10">
            {/* Frosting Drips */}
            <div className="absolute top-0 inset-x-0 h-4 bg-white/70 rounded-b-xl shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-rose-500/60" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-rose-600/60" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-rose-500/60" />
          </div>

          {/* Cake Tier 2 (Middle Layer) */}
          <div className="w-64 sm:w-72 h-18 bg-gradient-to-b from-rose-400 via-pink-500 to-rose-600 shadow-xl relative border-t-2 border-white/30 flex items-center justify-around px-4 z-10">
            <div className="absolute top-0 inset-x-0 h-4 bg-white/60 rounded-b-xl shadow-xs" />
            <Heart className="w-3.5 h-3.5 text-white/80 fill-white/80" />
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <Heart className="w-3.5 h-3.5 text-white/80 fill-white/80" />
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <Heart className="w-3.5 h-3.5 text-white/80 fill-white/80" />
          </div>

          {/* Cake Tier 3 (Bottom Layer) */}
          <div className="w-80 sm:w-96 h-20 bg-gradient-to-b from-rose-700 via-purple-900 to-neutral-950 rounded-b-2xl shadow-2xl relative border-t-2 border-white/20 flex items-center justify-center px-4 z-10 text-center">
            <span className="font-amiri text-lg sm:text-xl font-bold text-rose-100 flex items-center gap-2">
              <span>عيد ميلاد سعيد يا</span>
              <span className="text-pink-300 font-extrabold">{data.herName}</span>
              <span>❤️</span>
            </span>
          </div>

          {/* Golden Stand Plate */}
          <div className="w-96 sm:w-[420px] h-4 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 rounded-full shadow-2xl mt-1 border-t border-amber-200" />
          <div className="w-36 h-4 bg-amber-800 rounded-b-xl shadow-inner mx-auto" />
        </div>

        {/* Action Controls */}
        <div className="flex flex-col items-center gap-4 w-full">
          {candlesLit ? (
            <button
              onClick={handleMakeWish}
              disabled={isBlowing}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-bold text-lg shadow-xl shadow-rose-900/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 disabled:opacity-50"
            >
              <Flame className="w-6 h-6 text-amber-300" />
              <span>{isBlowing ? 'جارِ إطفاء الشموع...' : 'تمني أمنية واطفئي الشموع ✨'}</span>
            </button>
          ) : (
            <button
              onClick={handleRelight}
              className="px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-rose-500/40 text-rose-300 text-sm font-medium transition-all duration-300 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-rose-400" />
              <span>إعادة إشعال الشموع وتمني أمنية جديدة</span>
            </button>
          )}

          <p className="text-xs text-neutral-400 font-amiri text-center">
            {candlesLit ? 'اضغطي على الزر أعلاه لإطفاء الشموع والاحتفال 🎉' : 'انطفأت الشموع وبدأت أمنياتكِ طريقها للتحقق بإذن الله! ❤️'}
          </p>
        </div>

        {/* Wish Granted Celebration Card */}
        {wishMade && (
          <div className="w-full bg-gradient-to-br from-rose-950/80 via-purple-950/60 to-neutral-950 border border-rose-500/50 rounded-2xl p-6 text-center space-y-3 animate-scaleIn shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-300">
              <Sparkles className="w-6 h-6 text-rose-400" />
            </div>

            <h3 className="font-display italic text-2xl font-bold text-white text-glow-rose">
              Happy Birthday, My Love! 🎉
            </h3>

            <p className="font-amiri text-lg text-rose-100/90 leading-relaxed max-w-lg mx-auto">
              أتمنى من كل قلبي أن تتحقق أمنيتكِ اليوم، وأن تكون هذه السنة من عمركِ الأجمل والأكثر بهجة وتوفيقاً يا أميرتي الغالية ❤️
            </p>

            <span className="text-xs font-mono text-rose-400/80 block">
              9 نوفمبر • يوم مبارك أهداني وجودكِ
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
