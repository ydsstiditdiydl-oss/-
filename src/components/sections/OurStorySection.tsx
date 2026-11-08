import React from 'react';
import { BookHeart, Calendar, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { AppData, TimelineEvent } from '../../types';
import { formatArabicDateString } from '../../utils/egyptTime';

interface OurStorySectionProps {
  data: AppData;
  onAddEvent?: (newEvent: TimelineEvent) => void;
}

export const OurStorySection: React.FC<OurStorySectionProps> = ({ data }) => {
  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto px-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <BookHeart className="w-3.5 h-3.5 text-rose-400" />
          <span>خط زمني يروي بدايتنا</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400">
          Our Story
        </h1>
        <p className="font-amiri text-lg text-rose-200/80 max-w-xl mx-auto">
          كل قصة حب جميلة، لكن قصتنا هي الأحب إلى قلبي.
        </p>
      </div>

      {/* Timeline Tree */}
      <div className="relative border-r-2 border-rose-500/30 mr-4 md:mr-8 pr-6 md:pr-8 space-y-10">
        {data.timelineEvents.map((item, idx) => (
          <div key={item.id} className="relative group">
            {/* Timeline Node Dot */}
            <div className="absolute -right-[33px] md:-right-[41px] top-1.5 w-6 h-6 rounded-full bg-neutral-950 border-2 border-rose-500 flex items-center justify-center shadow-lg shadow-rose-900/50 group-hover:scale-125 transition-transform duration-300">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
            </div>

            {/* Event Card */}
            <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-950/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300">
                    {idx === 0 ? 'نقطة الانطلاق 🚀' : `المحطة ${idx + 1}`}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-rose-200 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2" dir="rtl">
                  <div className="flex items-center gap-1.5 text-xs text-rose-300/90">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-medium text-rose-200">{formatArabicDateString(item.date)}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-sans">
                    <span>✓</span>
                    <span>محفوظة</span>
                  </span>
                </div>
              </div>

              <p className="font-amiri text-base sm:text-lg text-neutral-200 leading-relaxed">
                {item.description}
              </p>

              {item.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-rose-950 max-h-72">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {item.personalMessage && (
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs text-rose-400 font-semibold block">همسة شخصية</span>
                    <p className="font-amiri text-sm text-rose-200/90 leading-relaxed">
                      {item.personalMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
