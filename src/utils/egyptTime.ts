// Egypt Timezone Utilities (Africa/Cairo - EET/EEST)

export const getEgyptNow = (): Date => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(new Date());
    const partMap: Record<string, number> = {};
    parts.forEach(p => {
      if (p.type !== 'literal') {
        partMap[p.type] = parseInt(p.value, 10);
      }
    });

    const hour = partMap.hour === 24 ? 0 : partMap.hour;
    return new Date(
      partMap.year,
      partMap.month - 1,
      partMap.day,
      hour,
      partMap.minute,
      partMap.second
    );
  } catch {
    // Fallback: Cairo is UTC+2
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000 * 2);
  }
};

export const formatEgyptDateTimeArabic = (date: Date): { dateStr: string; timeStr: string } => {
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const monthName = arabicMonths[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  // In Egyptian colloquial & cultural usage, 12 after midnight is referred to as "مساءً"
  const isNightOrPm = hours >= 12 || hours < 4;
  const ampm = isNightOrPm ? 'مساءً' : 'صباحاً';
  hours = hours % 12 || 12;

  return {
    dateStr: `${dayName}، ${day} ${monthName} ${year}`,
    timeStr: `${hours}:${minutes}:${seconds} ${ampm}`
  };
};

export const formatArabicDateString = (dateStr: string): string => {
  if (!dateStr) return '';
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    const monthName = arabicMonths[m - 1] || '';
    return `${d} ${monthName} ${y}`;
  } catch {
    return dateStr;
  }
};
