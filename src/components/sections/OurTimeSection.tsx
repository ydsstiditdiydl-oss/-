import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, Sparkles } from 'lucide-react';
import { AppData } from '../../types';
import { getEgyptNow, formatEgyptDateTimeArabic } from '../../utils/egyptTime';

interface OurTimeSectionProps {
  data: AppData;
}

export const OurTimeSection: React.FC<OurTimeSectionProps> = ({ data }) => {
  const [now, setNow] = useState<Date>(getEgyptNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(getEgyptNow());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Birth dates difference
  // My birth: 2010-04-22
  // Her birth: 2010-11-09
  const [myYear, myMonth, myDay] = data.myBirthDate.split('-').map(Number);
  const [herYear, herMonth, herDay] = data.herBirthDate.split('-').map(Number);
  const myBirth = new Date(myYear, myMonth - 1, myDay, 0, 0, 0);
  const herBirth = new Date(herYear, herMonth - 1, herDay, 0, 0, 0);
  const birthDiffMs = herBirth.getTime() - myBirth.getTime();
  const birthDiffDays = Math.floor(birthDiffMs / (1000 * 60 * 60 * 24)); // 201 days
  const birthDiffHours = birthDiffDays * 24;

  // Exact months and days difference
  // From 22 April 2010 to 22 October 2010 = 6 months
  // From 22 October 2010 to 9 November 2010: October has 31 days -> 9 days in Oct + 9 days in Nov = 18 days
  const birthDiffMonths = 6;
  const birthDiffRemainingDays = 18;

  // 2. Meeting date: 2026-09-26
  const [meetYear, meetMonth, meetDay] = (data.meetingDate || '2026-09-26').split('-').map(Number);
  const meetingDate = new Date(meetYear, meetMonth - 1, meetDay, 0, 0, 0);
  const englishMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const meetingDateFormatted = `${meetDay} ${englishMonths[meetMonth - 1] || 'September'} ${meetYear}`;

  const meetingDiffMs = now.getTime() - meetingDate.getTime();
  const isPastMeeting = meetingDiffMs >= 0;
  const absMeetingDiffMs = Math.abs(meetingDiffMs);

  const meetingDays = Math.floor(absMeetingDiffMs / (1000 * 60 * 60 * 24));
  const meetingHours = Math.floor((absMeetingDiffMs / (1000 * 60 * 60)) % 24);
  const meetingMinutes = Math.floor((absMeetingDiffMs / (1000 * 60)) % 60);
  const meetingSeconds = Math.floor((absMeetingDiffMs / 1000) % 60);

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto px-4 animate-fadeIn">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-rose-400" />
          <span>سجل الزمن والقدر</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400">
          Our Time ❤️
        </h1>
        <p className="font-amiri text-lg text-rose-200/80 max-w-xl mx-auto">
          اللحظات التي صنعت فارقاً في حياتي، وحساب الأيام التي جمعت أرواحنا.
        </p>
      </div>

      {/* Hero Banner: 19 July 2026 */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-center bg-gradient-to-br from-rose-950/70 via-purple-950/60 to-neutral-950 border border-rose-500/30 shadow-2xl glow-rose">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-300 animate-float">
            <Heart className="w-7 h-7 fill-rose-500/40 text-rose-400" />
          </div>

          <div className="space-y-1" dir="ltr">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-widest text-rose-200 block">
              {meetingDateFormatted}
            </span>
            <h2 className="font-display italic text-3xl sm:text-4xl md:text-5xl font-black text-white text-glow-rose">
              The Best Day of My Life ❤️
            </h2>
            <p className="font-amiri text-lg sm:text-xl text-rose-200/90 pt-1" dir="rtl">
              في هذا اليوم تأكدت اني احبك وشعرت حينئذ اني لا يجب ان افقدك ابدا
            </p>
          </div>

          {/* Live Counter for Meeting Date */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="text-xs text-rose-300/80 mb-3 font-medium flex items-center justify-center gap-1.5">
              <span>{isPastMeeting ? 'مرّ على لقائنا الأغلى حتى هذه اللحظة:' : 'العد التنازلي لموعد لقائنا الأغلى:'}</span>
              <span className="text-[11px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30">
                🇪🇬 بتوقيت مصر
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center" dir="ltr">
              <div className="glass-panel rounded-2xl p-3 sm:p-4">
                <span className="font-mono text-2xl sm:text-4xl font-extrabold text-white tabular-nums">
                  {meetingDays}
                </span>
                <span className="block text-xs text-rose-300/70 mt-1">Days (أيام)</span>
              </div>

              <div className="glass-panel rounded-2xl p-3 sm:p-4">
                <span className="font-mono text-2xl sm:text-4xl font-extrabold text-rose-200 tabular-nums">
                  {meetingHours}
                </span>
                <span className="block text-xs text-rose-300/70 mt-1">Hours (ساعات)</span>
              </div>

              <div className="glass-panel rounded-2xl p-3 sm:p-4">
                <span className="font-mono text-2xl sm:text-4xl font-extrabold text-rose-300 tabular-nums">
                  {meetingMinutes}
                </span>
                <span className="block text-xs text-rose-300/70 mt-1">Minutes (دقائق)</span>
              </div>

              <div className="glass-panel rounded-2xl p-3 sm:p-4">
                <span className="font-mono text-2xl sm:text-4xl font-extrabold text-pink-400 tabular-nums">
                  {meetingSeconds}
                </span>
                <span className="block text-xs text-rose-300/70 mt-1">Seconds (ثواني)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Birthday Age Difference Comparison */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-rose-950/60 pb-4">
          <Calendar className="w-5 h-5 text-rose-400" />
          <h3 className="text-xl font-bold text-white">الفرق الحقيقي بين تاريخي ميلادنا</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My Birthday */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider block">تاريخ ميلادي</span>
            <div className="text-2xl font-bold text-white font-mono">22 أبريل 2010</div>
            <p className="text-xs text-neutral-400">اليوم الذي أتيتُ فيه إلى هذا العالم لأنتظر قدومكِ ❤️</p>
          </div>

          {/* Her Birthday */}
          <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-pink-400 font-semibold uppercase tracking-wider block">تاريخ ميلادها</span>
            <div className="text-2xl font-bold text-white font-mono">9 نوفمبر 2010</div>
            <p className="text-xs text-rose-300/80">اليوم الذي اكتملت فيه بهجة الكون بنور وجودكِ ✨</p>
          </div>
        </div>

        {/* Calculated Difference Box */}
        <div className="bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-rose-950/40 border border-rose-500/30 rounded-2xl p-6 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs text-rose-300 font-medium">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>حساب الفارق الزمني بدقة</span>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-pink-300">
            {birthDiffMonths} أشهر و {birthDiffRemainingDays} يوماً
          </div>

          <p className="text-sm text-neutral-300 max-w-lg mx-auto font-amiri leading-relaxed">
            ما يعادل بالتحديد <span className="font-mono font-bold text-rose-300">{birthDiffDays}</span> يوماً ({birthDiffHours.toLocaleString()} ساعة).
            كنتُ قد سبقتكِ إلى هذه الدنيا بمئتي يوم لأستعد لاستقبال أجمل ما فيها!
          </p>
        </div>
      </div>
    </div>
  );
};
