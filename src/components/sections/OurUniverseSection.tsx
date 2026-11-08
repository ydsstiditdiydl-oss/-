import React, { useState } from 'react';
import { Compass, Sparkles, X, Heart, Star as StarIcon } from 'lucide-react';
import { AppData, StarSecret } from '../../types';

interface OurUniverseSectionProps {
  data: AppData;
  onUpdateStarSecret?: (id: number, message: string) => void;
}

export const OurUniverseSection: React.FC<OurUniverseSectionProps> = ({ data }) => {
  const [selectedStar, setSelectedStar] = useState<StarSecret | null>(null);

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto px-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Compass className="w-3.5 h-3.5 text-rose-400" />
          <span>كوكبات السماء وأسرار النجوم</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400">
          Our Universe
        </h1>
        <p className="font-amiri text-lg text-rose-200/80 max-w-xl mx-auto">
          اضغطي على أي نجمة في هذه السماء الفسيحة لتكتشفي السر والرسالة المخبأة خلف بريقها.
        </p>
      </div>

      {/* Interactive Sky Box */}
      <div className="relative w-full aspect-[16/10] min-h-[460px] rounded-3xl overflow-hidden border border-rose-500/30 shadow-2xl bg-radial from-[#1e0724] via-[#09020f] to-[#010003] select-none">
        
        {/* Constellation Connecting SVG Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {/* Constellation line 1 */}
          <line x1="20%" y1="25%" x2="45%" y2="18%" stroke="rgba(244, 114, 182, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="45%" y1="18%" x2="75%" y2="30%" stroke="rgba(244, 114, 182, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Constellation line 2 */}
          <line x1="30%" y1="65%" x2="60%" y2="70%" stroke="rgba(244, 114, 182, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60%" y1="70%" x2="82%" y2="75%" stroke="rgba(244, 114, 182, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Diagonal connection */}
          <line x1="20%" y1="25%" x2="15%" y2="80%" stroke="rgba(192, 132, 252, 0.3)" strokeWidth="1" strokeDasharray="2 4" />
        </svg>

        {/* Glowing Nebulae Blobs */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Clickable Stars */}
        {data.starSecrets.map((star) => (
          <button
            key={star.id}
            onClick={() => setSelectedStar(star)}
            style={{
              top: `${star.y}%`,
              left: `${star.x}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none p-3 z-10"
          >
            {/* Halo pulse */}
            <span className="absolute inset-0 rounded-full bg-rose-400/20 group-hover:bg-rose-400/50 scale-125 group-hover:scale-175 transition-all duration-300 animate-pulse" />
            
            {/* Core star dot */}
            <div
              className="relative rounded-full bg-white group-hover:bg-rose-200 shadow-lg shadow-white/80 group-hover:shadow-rose-400/90 transition-all flex items-center justify-center"
              style={{
                width: `${star.size * 3}px`,
                height: `${star.size * 3}px`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80" />
            </div>

            {/* Label Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <span className="text-[11px] font-amiri font-bold text-rose-200 bg-neutral-950/90 border border-rose-500/40 px-2 py-0.5 rounded-full shadow-lg">
                ✨ {star.title}
              </span>
            </div>
          </button>
        ))}

        {/* Bottom hint label */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span className="text-xs text-rose-300/60 font-amiri bg-black/60 px-4 py-1 rounded-full border border-rose-950">
            انقري على أي نجمة متلألئة لاكتشاف رسالتها ✨
          </span>
        </div>
      </div>

      {/* Star Modal Popup */}
      {selectedStar && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative animate-scaleIn text-center">
            <button
              onClick={() => setSelectedStar(null)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-300">
              <StarIcon className="w-7 h-7 text-rose-400 fill-rose-400 animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-rose-400">
                {selectedStar.constellation || 'كوكبة الحب'}
              </span>
              <h3 className="text-2xl font-bold text-white font-amiri">
                {selectedStar.title}
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-rose-100 font-amiri text-lg leading-relaxed">
              {selectedStar.message}
            </div>

            <button
              onClick={() => setSelectedStar(null)}
              className="px-6 py-2 rounded-full bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 text-xs font-medium transition-colors"
            >
              إغلاق ومتابعة استكشاف النجوم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
