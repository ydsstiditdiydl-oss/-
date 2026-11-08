import React, { useState } from 'react';
import { Mail, Heart, Sparkles } from 'lucide-react';
import { AppData } from '../../types';

interface SecretLetterSectionProps {
  data: AppData;
  onUpdateLetter?: (content: string) => void;
}

export const SecretLetterSection: React.FC<SecretLetterSectionProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto px-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Mail className="w-3.5 h-3.5 text-rose-400" />
          <span>رسالة كُتبت من أعماق الفؤاد</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400">
          Secret Letter
        </h1>
        <p className="font-amiri text-lg text-rose-200/80 max-w-xl mx-auto">
          اضغطي على الظرف لفتحه وقراءة ما خطّه قلبي لأجلكِ.
        </p>
      </div>

      {/* Envelope Interactive Box */}
      <div className="flex flex-col items-center justify-center min-h-[420px] relative py-6">
        {!isOpen ? (
          /* Sealed Envelope Graphic */
          <div
            onClick={() => setIsOpen(true)}
            className="group cursor-pointer w-full max-w-md bg-gradient-to-b from-rose-950/80 to-purple-950/90 border-2 border-rose-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl hover:shadow-rose-900/60 hover:scale-105 transition-all duration-500 relative flex flex-col items-center text-center space-y-6 glow-rose"
          >
            {/* Wax Seal */}
            <div className="w-16 h-16 rounded-full bg-rose-600 border-2 border-rose-300 shadow-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>

            <div className="space-y-2">
              <span className="font-display italic text-2xl font-bold text-rose-100 block">
                For My Precious Girl
              </span>
              <p className="font-amiri text-sm text-rose-300/80">
                مغلق بختم الحب والوفاء • اضغطي للفتح
              </p>
            </div>

            <div className="pt-2">
              <span className="px-5 py-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-medium inline-flex items-center gap-1.5 group-hover:bg-rose-500/40 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                <span>افتحي الرسالة الآن</span>
              </span>
            </div>
          </div>
        ) : (
          /* Open Letter Scroll / Parchment Card */
          <div className="w-full max-w-2xl bg-[#140b17] border border-rose-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative animate-scaleIn space-y-6">
            {/* Actions Bar */}
            <div className="flex items-center justify-between border-b border-rose-950/60 pb-4">
              <div className="flex items-center gap-2 text-rose-300 text-sm font-medium">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>رسالة عيد ميلادكِ</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs transition-colors"
                >
                  إعادة إغلاق
                </button>
              </div>
            </div>

            {/* Letter Body */}
            <div className="font-amiri text-lg sm:text-xl text-rose-100/90 leading-loose whitespace-pre-line text-right pr-2">
              {data.secretLetterContent}
            </div>

            {/* Signature */}
            <div className="pt-6 border-t border-rose-950/60 flex items-center justify-between text-xs text-rose-300/70 font-mono">
              <span>9 نوفمبر 2010 • ميلاد أغلى إنسانة</span>
              <span className="font-display italic text-rose-300 text-sm">Forever & Always ❤️</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
