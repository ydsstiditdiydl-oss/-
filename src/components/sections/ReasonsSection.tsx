import React, { useState } from 'react';
import { Heart, Search, Sparkles, X } from 'lucide-react';
import { AppData } from '../../types';

interface ReasonsSectionProps {
  data: AppData;
  onUpdateReason?: (index: number, newText: string) => void;
}

export const ReasonsSection: React.FC<ReasonsSectionProps> = ({ data }) => {
  const [openedCards, setOpenedCards] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalReason, setActiveModalReason] = useState<{ index: number; text: string } | null>(null);

  const toggleCard = (index: number) => {
    setOpenedCards(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
    // Open in modal for convenient reading
    setActiveModalReason({ index, text: data.reasons100[index] });
  };

  const handleOpenAll = () => {
    const all = new Set<number>();
    data.reasons100.forEach((_, i) => all.add(i));
    setOpenedCards(all);
  };

  const handleCloseAll = () => {
    setOpenedCards(new Set());
  };

  const filteredReasons = data.reasons100
    .map((text, idx) => ({ text, index: idx }))
    .filter(item => {
      if (!searchQuery.trim()) return true;
      const numMatch = (item.index + 1).toString().includes(searchQuery.trim());
      const textMatch = item.text.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return numMatch || textMatch;
    });

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto px-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>مائة سبب تجعلكِ استثنائية في عيني</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400" dir="ltr">
          100 Reasons Why I Love You
        </h1>
        <p className="font-amiri text-lg text-rose-200/80 max-w-xl mx-auto">
          اضغطي على أي بطاقة لكشف السبب المكتوب بداخلها ❤️
        </p>
      </div>

      {/* Control Bar: Search & Batch actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث برقم البطاقة أو الكلمة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pr-9 pl-4 py-2 text-white text-xs focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-end">
          <span className="text-rose-300/70 font-mono">
            المفتوح: {openedCards.size} من 100
          </span>
          <button
            onClick={handleOpenAll}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
          >
            فتح الكل
          </button>
          <button
            onClick={handleCloseAll}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 transition-colors"
          >
            إغلاق الكل
          </button>
        </div>
      </div>

      {/* 100 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredReasons.map(({ text, index }) => {
          const isOpened = openedCards.has(index);
          return (
            <button
              key={index}
              onClick={() => toggleCard(index)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-between min-h-[110px] sm:min-h-[125px] relative group ${
                isOpened
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-100 shadow-md shadow-rose-950'
                  : 'bg-neutral-950/60 border-neutral-800 hover:border-rose-500/30 text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold text-rose-400/80">
                  #{index + 1}
                </span>
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    isOpened ? 'text-rose-400 fill-rose-400' : 'text-neutral-600 group-hover:text-rose-400/50'
                  }`}
                />
              </div>

              {isOpened ? (
                <p className="font-amiri text-xs text-rose-200 line-clamp-3 leading-relaxed mt-1">
                  {text}
                </p>
              ) : (
                <div className="space-y-1 my-auto">
                  <span className="text-xl">💌</span>
                  <span className="block text-[10px] text-neutral-400 group-hover:text-rose-300">
                    اضغطي للكشف
                  </span>
                </div>
              )}

              <span className="text-[9px] text-neutral-500 font-mono">
                {isOpened ? 'تم الكشف' : 'مغلق'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reason Detail Modal */}
      {activeModalReason && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-scaleIn text-center">
            <button
              onClick={() => setActiveModalReason(null)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-300">
              <Heart className="w-7 h-7 text-rose-400 fill-rose-400" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-rose-400 uppercase tracking-widest">
                سبب رقم #{activeModalReason.index + 1}
              </span>
              <h3 className="font-display italic text-2xl font-bold text-white">
                Reason #{activeModalReason.index + 1}
              </h3>
            </div>

            <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-rose-100 font-amiri text-xl leading-relaxed">
              {activeModalReason.text}
            </div>

            <button
              onClick={() => setActiveModalReason(null)}
              className="px-6 py-2 rounded-full bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 text-xs font-medium transition-colors"
            >
              متابعة قراءة بقية الأسباب ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
