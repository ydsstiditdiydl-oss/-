import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Flame, 
  Clock, 
  Smile, 
  ShieldCheck, 
  Mail, 
  X, 
  Heart
} from 'lucide-react';
import { AppData, OpenWhenItem } from '../../types';

interface OpenWhenSectionProps {
  data: AppData;
  onUpdateOpenWhen?: (id: string, newMessage: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  HeartHandshake,
  Sparkles,
  Flame,
  Clock,
  Smile,
  ShieldCheck,
  Mail
};

export const OpenWhenSection: React.FC<OpenWhenSectionProps> = ({ data }) => {
  const [activeEnvelope, setActiveEnvelope] = useState<OpenWhenItem | null>(null);

  const handleOpenEnvelope = (item: OpenWhenItem) => {
    setActiveEnvelope(item);
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto px-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>رسائل لأوقاتكِ المختلفة</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400">
          Open When...
        </h1>
        <p className="font-amiri text-lg text-rose-200/80 max-w-xl mx-auto">
          ظروف مغلقة تفتحين كل واحد منها في اللحظة المناسبة لتجدي كلماتي ترافق قلبكِ.
        </p>
      </div>

      {/* Envelopes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.openWhenItems.map((item) => {
          const Icon = ICON_MAP[item.iconName] || Mail;
          return (
            <div
              key={item.id}
              onClick={() => handleOpenEnvelope(item)}
              className="group cursor-pointer glass-card hover:bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/50 rounded-3xl p-6 transition-all duration-300 hover:scale-102 hover:shadow-xl hover:shadow-rose-950/40 relative flex flex-col justify-between min-h-[220px]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-rose-400" />
                  </div>
                  <span className="text-[11px] font-mono text-rose-300/60 bg-rose-950/50 px-2.5 py-1 rounded-full border border-rose-950">
                    ظرف مغلق 💌
                  </span>
                </div>

                <div className="space-y-1.5 text-right">
                  <h3 className="text-xl font-bold text-white group-hover:text-rose-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-amiri leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-rose-950/40 flex items-center justify-between text-xs text-rose-300/80">
                <span className="font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>افتحي الرسالة الآن</span>
                  <span className="text-rose-400">←</span>
                </span>
                <Heart className="w-3.5 h-3.5 text-rose-500/50 group-hover:text-rose-500 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Envelope Modal Detail */}
      {activeEnvelope && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#120716] border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-rose-950/60 pb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-rose-400" />
                <h3 className="text-xl font-bold text-white">
                  {activeEnvelope.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveEnvelope(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Letter Content */}
            <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-rose-100 font-amiri text-lg leading-loose whitespace-pre-line text-right">
              {activeEnvelope.message}
            </div>

            <div className="flex items-center justify-between text-xs text-rose-300/70 pt-2 border-t border-rose-950/60 font-amiri">
              <span>أنا معكِ دائماً في كل لحظة ❤️</span>
              <button
                onClick={() => setActiveEnvelope(null)}
                className="px-4 py-1.5 rounded-full bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/30 text-rose-200 transition-colors"
              >
                إغلاق الظرف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
