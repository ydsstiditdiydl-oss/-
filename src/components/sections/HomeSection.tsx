import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, Gift, Heart, ArrowLeft, Cake, Stars, MapPin } from 'lucide-react';
import { AppData, ActiveSection } from '../../types';
import { getEgyptNow, formatEgyptDateTimeArabic } from '../../utils/egyptTime';

interface HomeSectionProps {
  data: AppData;
  onNavigate: (section: ActiveSection) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ data, onNavigate }) => {
  // Synchronized strictly to Egypt Time (Africa/Cairo)
  const [now, setNow] = useState<Date>(getEgyptNow());
  const egyptFormatted = formatEgyptDateTimeArabic(now);

  // Update clock every second based on Egypt current time
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(getEgyptNow());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Parse her birth date (YYYY-MM-DD) explicitly to prevent UTC timezone shifts
  const [bYear, bMonth, bDay] = data.herBirthDate.split('-').map(Number);
  const birthDate = new Date(bYear, bMonth - 1, bDay, 0, 0, 0);

  // Precise age calculation from birth date (2010-11-09)
  const diffMs = Math.max(0, now.getTime() - birthDate.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalSeconds = Math.floor(diffMs / 1000);

  // Exact age in Years, Months, Days
  let years = now.getFullYear() - bYear;
  let months = now.getMonth() - (bMonth - 1);
  let days = now.getDate() - bDay;

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Next Birthday countdown in Egypt Time
  // Her birthday is strictly: Month = bMonth - 1 (Nov = 10), Day = bDay (9)
  let nextBirthdayYear = now.getFullYear();
  let nextBirthday = new Date(nextBirthdayYear, bMonth - 1, bDay, 0, 0, 0);

  // Check if today is her birthday
  const isTodayBirthday = now.getMonth() === bMonth - 1 && now.getDate() === bDay;

  // Only advance to next year if November 9 has completely passed for this year
  if (!isTodayBirthday && now.getTime() > nextBirthday.getTime() + 86400000) {
    nextBirthdayYear += 1;
    nextBirthday = new Date(nextBirthdayYear, bMonth - 1, bDay, 0, 0, 0);
  }

  const diffNextMs = Math.max(0, nextBirthday.getTime() - now.getTime());
  const nextDays = Math.floor(diffNextMs / (1000 * 60 * 60 * 24));
  const nextHours = Math.floor((diffNextMs / (1000 * 60 * 60)) % 24);
  const nextMins = Math.floor((diffNextMs / (1000 * 60)) % 60);
  const nextSecs = Math.floor((diffNextMs / 1000) % 60);

  return (
    <div className="space-y-10 py-6 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative text-center space-y-4 max-w-3xl mx-auto px-4">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-600/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>عالم صُنع خصيصاً لأجلكِ</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-rose-400 tracking-tight leading-tight">
          Happy Birthday ❤️
        </h1>

        <p className="font-amiri text-xl sm:text-2xl text-rose-200/90 leading-relaxed max-w-xl mx-auto">
          كل عام وأنتِ يا <span className="text-rose-300 font-bold underline decoration-rose-500/50 underline-offset-4">{data.herName}</span> أجمل وأغلى ما في الكون.
        </p>

        {/* Live Egypt Time Indicator */}
        <div className="flex items-center justify-center gap-2 pt-1 text-xs text-rose-300/80">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/50 border border-rose-500/30 shadow-sm">
            <span className="text-sm">🇪🇬</span>
            <span className="text-rose-300 font-medium">توقيت مصر الآن:</span>
            <span className="font-mono font-bold text-rose-100">{egyptFormatted.dateStr}</span>
            <span className="text-rose-500">•</span>
            <span className="font-mono font-bold text-pink-300">{egyptFormatted.timeStr}</span>
          </div>
        </div>

        {isTodayBirthday && (
          <div className="p-3 bg-gradient-to-r from-rose-950/80 via-pink-950/60 to-rose-950/80 border border-rose-500/50 rounded-2xl glow-rose max-w-md mx-auto">
            <span className="text-rose-200 font-medium text-sm">🎉 اليوم هو يوم ميلادكِ السعيد! كل لحظة وأنتِ بألف خير وسعادة يا روحي 🎉</span>
          </div>
        )}
      </div>

      {/* Real-Time Birthday Metrics (Age & Live Ticking Tracker) */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-950/50 pb-5">
            <div>
              <div className="flex items-center gap-2 text-rose-300 text-sm font-medium">
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>تاريخ الميلاد: 9 نوفمبر 2010</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">رحلة وجودكِ في هذه الدنيا</h2>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-rose-950/50 border border-rose-500/20 text-rose-200 text-sm font-semibold">
              {years} سنة و {months} شهر و {days} يوم
            </div>
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-neutral-900/60 border border-rose-950/40 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-[11px] sm:text-xs text-rose-300/70 block mb-1">عدد الأيام منذ ولادتكِ</span>
              <span className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-white tabular-nums tracking-tight">
                {totalDays.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-[11px] text-neutral-400 block mt-1">يوماً من الجمال</span>
            </div>

            <div className="bg-neutral-900/60 border border-rose-950/40 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-[11px] sm:text-xs text-rose-300/70 block mb-1">عدد الساعات</span>
              <span className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-rose-200 tabular-nums tracking-tight">
                {totalHours.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-[11px] text-neutral-400 block mt-1">ساعة أضاءت الأرض</span>
            </div>

            <div className="bg-neutral-900/60 border border-rose-950/40 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-[11px] sm:text-xs text-rose-300/70 block mb-1">عدد الدقائق</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl font-bold text-rose-300 tabular-nums tracking-tight">
                {totalMinutes.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-[11px] text-neutral-400 block mt-1">دقيقة تنبض بالحياة</span>
            </div>

            <div className="bg-neutral-900/60 border border-rose-950/40 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-[11px] sm:text-xs text-rose-300/70 block mb-1">عدد الثواني (حي)</span>
              <span className="font-mono text-base sm:text-lg md:text-xl font-bold text-pink-300 tabular-nums tracking-tight truncate block">
                {totalSeconds.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-[11px] text-neutral-400 block mt-1">ثانية تتجدد كل لحظة</span>
            </div>
          </div>

          {/* Next Birthday Countdown */}
          <div className="bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-rose-950/40 border border-rose-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">العد التنازلي لعيد ميلادكِ القادم</h3>
                  {nextDays === 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold animate-pulse">
                      أقل من 24 ساعة! ⏳
                    </span>
                  )}
                </div>
                <p className="text-xs text-rose-300/80">9 نوفمبر {nextBirthdayYear}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-center" dir="ltr">
              <div className="bg-neutral-950/80 border border-rose-950/60 rounded-xl px-3 py-2 min-w-[55px]">
                <span className="font-mono text-xl font-bold text-white tabular-nums">{nextDays}</span>
                <span className="block text-[10px] text-rose-300/70">أيام</span>
              </div>
              <span className="text-rose-400 font-bold">:</span>
              <div className="bg-neutral-950/80 border border-rose-950/60 rounded-xl px-3 py-2 min-w-[55px]">
                <span className="font-mono text-xl font-bold text-white tabular-nums">{String(nextHours).padStart(2, '0')}</span>
                <span className="block text-[10px] text-rose-300/70">ساعة</span>
              </div>
              <span className="text-rose-400 font-bold">:</span>
              <div className="bg-neutral-950/80 border border-rose-950/60 rounded-xl px-3 py-2 min-w-[55px]">
                <span className="font-mono text-xl font-bold text-white tabular-nums">{String(nextMins).padStart(2, '0')}</span>
                <span className="block text-[10px] text-rose-300/70">دقيقة</span>
              </div>
              <span className="text-rose-400 font-bold">:</span>
              <div className="bg-neutral-950/80 border border-rose-950/60 rounded-xl px-3 py-2 min-w-[55px]">
                <span className="font-mono text-xl font-bold text-rose-400 tabular-nums">{String(nextSecs).padStart(2, '0')}</span>
                <span className="block text-[10px] text-rose-300/70">ثانية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Portals to Special Sections */}
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-lg font-bold text-rose-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>محطات في عالمكِ</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('make-a-wish')}
            className="group glass-card p-5 rounded-2xl text-right hover:border-rose-500/40 hover:bg-rose-950/20 transition-all duration-300 flex items-start justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-3 group-hover:scale-110 transition-transform">
                <Cake className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white group-hover:text-rose-300 transition-colors">تورتة عيد ميلادكِ</h4>
              <p className="text-xs text-neutral-400 mt-1">تمني أمنية واطفئي الشموع الآن ✨</p>
            </div>
            <ArrowLeft className="w-4 h-4 text-neutral-500 group-hover:text-rose-400 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('five-gifts')}
            className="group glass-card p-5 rounded-2xl text-right hover:border-rose-500/40 hover:bg-rose-950/20 transition-all duration-300 flex items-start justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 transition-transform">
                <Gift className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white group-hover:text-rose-300 transition-colors">الهدايا الخمس</h4>
              <p className="text-xs text-neutral-400 mt-1">صناديق مفاجآت صُممت لأجلكِ 🎁</p>
            </div>
            <ArrowLeft className="w-4 h-4 text-neutral-500 group-hover:text-rose-400 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('our-time')}
            className="group glass-card p-5 rounded-2xl text-right hover:border-rose-500/40 hover:bg-rose-950/20 transition-all duration-300 flex items-start justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white group-hover:text-rose-300 transition-colors">قسم Our Time</h4>
              <p className="text-xs text-neutral-400 mt-1">عداد حكايتنا ويوم 26 سبتمبر 2026 ❤️</p>
            </div>
            <ArrowLeft className="w-4 h-4 text-neutral-500 group-hover:text-rose-400 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
