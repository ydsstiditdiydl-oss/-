import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Gift, 
  Mail, 
  Heart, 
  Sparkles, 
  Calendar, 
  RotateCcw, 
  X, 
  Check, 
  Crown,
  Star
} from 'lucide-react';
import { AppData } from '../../types';

interface FiveGiftsSectionProps {
  data: AppData;
  onOpenFinalSurprise: () => void;
}

export const FiveGiftsSection: React.FC<FiveGiftsSectionProps> = ({
  data,
  onOpenFinalSurprise,
}) => {
  const [openedGift, setOpenedGift] = useState<number | null>(null);

  // Gift 4: Wish Jar state
  const [remainingWishes, setRemainingWishes] = useState<string[]>([...data.wishJarItems]);
  const [currentPulledWish, setCurrentPulledWish] = useState<string | null>(null);

  const pullRandomWish = () => {
    let pool = remainingWishes;
    if (pool.length === 0) {
      pool = [...data.wishJarItems];
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    const newRemaining = pool.filter((_, i) => i !== randomIndex);
    setRemainingWishes(newRemaining);
    setCurrentPulledWish(chosen);
  };

  const handleOpenGiftBox = (boxIndex: number) => {
    if (boxIndex === 5) {
      // Climax Gift 5: Launch full-screen cinematic surprise!
      onOpenFinalSurprise();
      return;
    }
    setOpenedGift(boxIndex);
    if (boxIndex === 4 && !currentPulledWish) {
      pullRandomWish();
    }
  };

  const giftDefinitions = [
    {
      id: 1,
      title: 'A Message For You',
      subtitle: 'ظرف رقيق يحمل كلمات خاصة',
      tag: 'الهدية الأولى',
      color: 'from-rose-900/40 to-pink-950/60',
      borderColor: 'border-rose-500/40',
      icon: Mail,
    },
    {
      id: 2,
      title: '100 Little Things',
      subtitle: 'صفات ولمسات ساحرة تميزكِ',
      tag: 'الهدية الثانية',
      color: 'from-purple-900/40 to-rose-950/60',
      borderColor: 'border-purple-500/40',
      icon: Heart,
    },
    {
      id: 3,
      title: 'A Memory',
      subtitle: '26 September 2026 • اليوم الأغلى',
      tag: 'الهدية الثالثة',
      color: 'from-amber-900/40 to-rose-950/60',
      borderColor: 'border-amber-500/40',
      icon: Calendar,
    },
    {
      id: 4,
      title: 'Your Wishes',
      subtitle: 'برطمان الأمنيات السحري للعام الجديد',
      tag: 'الهدية الرابعة',
      color: 'from-pink-900/40 to-purple-950/60',
      borderColor: 'border-pink-500/40',
      icon: Sparkles,
    },
    {
      id: 5,
      title: 'The Final Surprise',
      subtitle: 'المفاجأة الكبرى السينمائية ❤️',
      tag: 'الهدية الخامسة • الكبرى',
      color: 'from-rose-950 via-burgundy-900 to-amber-950',
      borderColor: 'border-amber-400/60',
      icon: Crown,
      isSpecial: true,
    },
  ];

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto px-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Gift className="w-3.5 h-3.5 text-rose-400" />
          <span>خمسة صناديق مفاجآت</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400">
          The Five Gifts
        </h1>
        <p className="font-amiri text-lg text-rose-200/80 max-w-xl mx-auto">
          كل صندوق هنا يخفي مفاجأة استثنائية صُممت لترسم الابتسامة على وجهكِ.
        </p>
      </div>

      {/* Gifts 5-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {giftDefinitions.map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.id}
              onClick={() => handleOpenGiftBox(g.id)}
              className={`group cursor-pointer rounded-3xl p-6 sm:p-7 border transition-all duration-500 hover:scale-103 hover:shadow-2xl relative flex flex-col justify-between min-h-[250px] ${
                g.isSpecial
                  ? 'sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-rose-950/90 via-purple-950/80 to-amber-950/70 border-amber-400/50 glow-gold'
                  : `bg-gradient-to-br ${g.color} ${g.borderColor} hover:border-rose-400/60`
              }`}
            >
              {/* Ribbon Decorative Vector */}
              <div className="absolute top-0 right-8 w-6 h-12 bg-rose-500/80 rounded-b-md shadow-md border-x border-b border-rose-300/40" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    g.isSpecial ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                    g.isSpecial
                      ? 'bg-amber-950/80 text-amber-300 border-amber-400/40'
                      : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                  }`}>
                    {g.tag}
                  </span>
                </div>

                <h3 className={`font-display text-2xl font-bold mb-1 group-hover:text-rose-200 transition-colors text-right ${
                  g.isSpecial ? 'text-amber-200 text-glow-rose text-3xl' : 'text-white'
                }`} dir="ltr">
                  {g.title}
                </h3>

                <p className="font-amiri text-sm text-neutral-300 leading-relaxed">
                  {g.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className={`font-medium ${g.isSpecial ? 'text-amber-300' : 'text-rose-300'}`}>
                  {g.isSpecial ? 'افتحي المفاجأة الكبرى السينمائية ✨' : 'اضغطي لفتح الهدية 🎁'}
                </span>
                <span className="text-rose-400 group-hover:translate-x-1 transition-transform">←</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Gift 1: A Message For You */}
      {openedGift === 1 && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#140b17] border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative animate-scaleIn text-right">
            <button
              onClick={() => setOpenedGift(null)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-rose-950/60 pb-3">
              <Mail className="w-5 h-5 text-rose-400" />
              <h3 className="text-xl font-bold text-white">Gift 1: A Message For You</h3>
            </div>

            <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-rose-100 font-amiri text-lg leading-loose whitespace-pre-line">
              {data.secretLetterContent}
            </div>

            <button
              onClick={() => setOpenedGift(null)}
              className="w-full py-2.5 rounded-xl bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/30 text-rose-200 text-xs font-medium"
            >
              إغلاق الهدية
            </button>
          </div>
        </div>
      )}

      {/* Modal for Gift 2: 100 Little Things */}
      {openedGift === 2 && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#140b17] border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl relative animate-scaleIn text-right max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setOpenedGift(null)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-rose-950/60 pb-3">
              <Heart className="w-5 h-5 text-rose-400" />
              <h3 className="text-xl font-bold text-white">Gift 2: 100 Little Things</h3>
            </div>

            <p className="text-xs text-neutral-300 font-amiri">
              مئة تفصيلة ومجاملة صادقة تجعلكِ مميزة وفريدة في هذا العالم:
            </p>

            <div className="space-y-2.5">
              {data.reasons100.slice(0, 15).map((r, i) => (
                <div key={i} className="p-3 bg-neutral-900/60 border border-rose-950/50 rounded-xl flex items-start gap-3">
                  <span className="font-mono text-xs text-rose-400 font-bold shrink-0 mt-0.5">#{i + 1}</span>
                  <p className="font-amiri text-sm text-rose-200">{r}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setOpenedGift(null)}
              className="w-full py-2.5 rounded-xl bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/30 text-rose-200 text-xs font-medium"
            >
              إغلاق الهدية (يمكنك تصفح جميع الـ 100 من قسم 100 سبب)
            </button>
          </div>
        </div>
      )}

      {/* Modal for Gift 3: A Memory */}
      {openedGift === 3 && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#140b17] border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative animate-scaleIn text-center">
            <button
              onClick={() => setOpenedGift(null)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300">
              <Calendar className="w-7 h-7 text-amber-400" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-400">26 September 2026</span>
              <h3 className="font-display italic text-2xl font-bold text-white">
                The Day Our Story Began
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-rose-100 font-amiri text-lg leading-relaxed text-right">
              في هذا اليوم تأكدت أنني أحبك وشعرت حينئذ أنني لا يجب أن أفقدك أبداً ❤️
            </div>

            <button
              onClick={() => setOpenedGift(null)}
              className="px-6 py-2 rounded-full bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/30 text-rose-200 text-xs font-medium"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Modal for Gift 4: Your Wishes (Magic Jar) */}
      {openedGift === 4 && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#140b17] border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-scaleIn text-center">
            <button
              onClick={() => setOpenedGift(null)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Magic Jar Graphic */}
            <div className="relative w-24 h-32 mx-auto rounded-3xl border-2 border-pink-400/60 bg-gradient-to-b from-pink-500/20 to-purple-950/80 shadow-2xl flex flex-col items-center justify-between py-2 glow-rose">
              <div className="w-16 h-3 bg-pink-300 rounded-full border border-pink-100 shadow-sm" />
              <div className="flex items-center gap-1">
                <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
                <Star className="w-4 h-4 text-pink-300 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-pink-200">Magic Jar</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-pink-300">
                المتبقي في البرطمان: {remainingWishes.length} من {data.wishJarItems.length}
              </span>
              <h3 className="font-display italic text-2xl font-bold text-white">
                برطمان أمنيات العام الجديد
              </h3>
            </div>

            {/* Current Drawn Wish */}
            {currentPulledWish && (
              <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-100 font-amiri text-lg leading-relaxed shadow-inner">
                {currentPulledWish}
              </div>
            )}

            <button
              onClick={pullRandomWish}
              className="w-full py-3 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-medium text-sm shadow-lg shadow-rose-950 hover:scale-103 transition-transform flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>سحب أمنية جديدة عشوائياً (دون تكرار)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
