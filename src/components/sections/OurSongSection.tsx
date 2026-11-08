import React, { useRef } from 'react';
import { Play, Pause, Disc, Upload, Volume2, Music, Sparkles, RotateCcw, ExternalLink } from 'lucide-react';
import { AppData } from '../../types';

interface OurSongSectionProps {
  data: AppData;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  onUploadSong: (file: File) => void;
  onUpdateCover: (url: string) => void;
}

export const OurSongSection: React.FC<OurSongSectionProps> = ({
  data,
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  onSeek,
  onUploadSong,
  onUpdateCover,
}) => {
  const songFileInputRef = useRef<HTMLInputElement | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec) || timeInSec < 0) return '00:00';
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSongUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadSong(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onUpdateCover(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto px-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Music className="w-3.5 h-3.5 text-rose-400" />
          <span>المقطوعة الخاصة بعالمنا</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400">
          Our Song
        </h1>
        <p className="font-amiri text-lg text-rose-200/80 max-w-xl mx-auto">
          الموسيقى التي تتردد في هذا الكون الصغير كلما تذكرتكِ.
        </p>
      </div>

      {/* Main Music Player Stage */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-rose-500/20 glow-rose max-w-2xl mx-auto space-y-8">
        
        {/* Vinyl / Cover Art Container */}
        <div className="relative flex items-center justify-center py-4">
          {/* Vinyl Record Behind Cover */}
          <div
            className={`w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-neutral-900 border-4 border-neutral-800 shadow-2xl flex items-center justify-center transition-transform duration-700 ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '8s' }}
          >
            <div className="w-20 h-20 rounded-full border-2 border-neutral-700 flex items-center justify-center bg-rose-950/60">
              <Disc className="w-10 h-10 text-rose-400/80" />
            </div>
          </div>

          {/* Album Cover Card Overlaid */}
          <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl border-2 border-rose-500/30 group">
            <img
              src={data.songCoverUrl}
              alt={data.songTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => coverFileInputRef.current?.click()}
              title="تغيير صورة الغلاف"
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-xs font-medium backdrop-blur-xs"
            >
              <Upload className="w-5 h-5 text-rose-400" />
              <span>تغيير صورة الغلاف</span>
            </button>
            <input
              ref={coverFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Song Info & Synchronized Audio Visualizer */}
        <div className="text-center space-y-3">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide">
            {data.songTitle}
          </h2>
          <p className="text-sm text-rose-300/80 font-medium">{data.songArtist}</p>

          {/* Visualizer reactive soundwave bars */}
          <div className="flex items-center justify-center gap-1.5 h-10 pt-2">
            {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 65, 35, 75, 55, 85, 40].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isPlaying
                    ? 'bg-gradient-to-t from-rose-600 to-pink-300'
                    : 'bg-neutral-800'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (h * Math.sin((i + currentTime * 5) % 10)) + 30)}%` : '20%',
                  opacity: isPlaying ? 0.9 : 0.4
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar & Timing */}
        <div className="space-y-2" dir="ltr">
          <div className="relative w-full h-2 bg-neutral-900 rounded-full overflow-hidden cursor-pointer">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-rose-400 to-pink-300 rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex justify-between text-xs text-neutral-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls Bar & Auto-Loop Status */}
        <div className="flex flex-col items-center justify-center gap-4 pt-2">
          {/* Main Play / Pause Button */}
          <button
            onClick={onTogglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-rose-900/50 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-white fill-white" />
            ) : (
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            )}
          </button>

          {/* Badges: Auto-Loop active & YouTube Video Link */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium">
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>إعادة التشغيل التلقائي مفعلة (Loop)</span>
            </div>

            {data.youtubeUrl && (
              <a
                href={data.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 text-xs font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                <span>مشاهدة الكليب الأصلي على YouTube</span>
              </a>
            )}
          </div>
        </div>

        {/* Upload Custom Audio File Box */}
        <div className="border border-rose-950/60 bg-neutral-950/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">رفع أغنيتكِ المفضلة</span>
              <span className="text-xs text-neutral-400 block">
                {data.customAudioUrl ? 'تم رفع ملف صوتي مخصص بنجاح ✅' : 'يمكنك رفع ملف MP3/صوت مباشرة من هاتفك أو حاسوبك'}
              </span>
            </div>
          </div>

          <button
            onClick={() => songFileInputRef.current?.click()}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 text-xs font-medium transition-colors"
          >
            اختر ملف صوتي (MP3)
          </button>
          <input
            ref={songFileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleSongUpload}
            className="hidden"
          />
        </div>

        <div className="text-center text-xs text-neutral-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>تستمر الموسيقى في العمل تلقائياً أثناء تصفحكِ لجميع أقسام التطبيق</span>
        </div>
      </div>
    </div>
  );
};
