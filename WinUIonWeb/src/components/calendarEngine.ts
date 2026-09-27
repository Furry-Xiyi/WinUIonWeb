export const calendarDayMilliseconds = 86400000;

export const calendarDateSerial = (date: Date): number => {
  const utc = new Date(0);
  utc.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  utc.setUTCHours(0, 0, 0, 0);
  return Math.floor(utc.getTime() / calendarDayMilliseconds);
};

export const calendarDateFromSerial = (serial: number): Date => {
  const utc = new Date(serial * calendarDayMilliseconds);
  const date = new Date(0);
  date.setFullYear(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
  date.setHours(0, 0, 0, 0);
  return date;
};

export const parseCalendarDate = (value: unknown): Date | null => {
  if (value === undefined || value === null || value === '') return null;
  const date = value instanceof Date ? new Date(value) : typeof value === 'number' ? new Date(value) : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

export interface CalendarMonth {
  index: number;
  start: number;
  end: number;
  year: number;
  yearIndex: number;
  month: string;
  text: string;
  label: string;
}

export interface CalendarYear {
  index: number;
  start: number;
  end: number;
  number: number;
  firstMonth: number;
  lastMonth: number;
  text: string;
}

const calendarIdentifiers: Record<string, string> = {
  GregorianCalendar: 'gregory', HebrewCalendar: 'hebrew', HijriCalendar: 'islamic-civil',
  JapaneseCalendar: 'japanese', JulianCalendar: 'gregory', KoreanCalendar: 'gregory',
  PersianCalendar: 'persian', TaiwanCalendar: 'roc', ThaiCalendar: 'buddhist',
  UmAlQuraCalendar: 'islamic-umalqura'
};

const julianParts = (serial: number) => {
  const c = serial + 2440588 + 32082;
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    year: d - 4800 + Math.floor(m / 10),
    month: m + 3 - 12 * Math.floor(m / 10),
    day: e - Math.floor((153 * m + 2) / 5) + 1
  };
};

const upperBoundaryIndex = <T extends { start: number }>(items: T[], serial: number): number => {
  let low = 0;
  let high = items.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (items[middle]!.start <= serial) low = middle + 1;
    else high = middle;
  }
  return Math.max(0, Math.min(items.length - 1, low - 1));
};

/** Calendar boundaries come from the browser's ICU calendar implementation. */
export const createCalendarModel = (identifier: string, language: string, minimum: number, maximum: number) => {
  const calendar = calendarIdentifiers[identifier] ?? 'gregory';
  let locale = language;
  try { new Intl.DateTimeFormat(locale).format(); }
  catch { locale = 'en-US'; }
  const formatter = (options: Intl.DateTimeFormatOptions, numeric = false) => new Intl.DateTimeFormat(
    numeric ? 'en-US' : locale,
    { calendar, timeZone: 'UTC', ...(numeric ? { numberingSystem: 'latn' } : {}), ...options }
  );
  const partsFormatter = formatter({ day: 'numeric', month: 'numeric', year: 'numeric' }, true);
  const monthFormatter = formatter({ month: 'short' });
  const yearFormatter = formatter({ year: 'numeric', ...(calendar === 'japanese' ? { era: 'short' } : {}) });
  const eraYearFormatter = formatter({ era: 'short', year: 'numeric' }, true);
  const headerFormatter = formatter({ month: 'long', year: 'numeric', ...(calendar === 'japanese' ? { era: 'short' } : {}) });
  const dateFormatter = formatter({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const weekdayFormatter = formatter({ weekday: 'long' });
  const weekdayFormats = new Map<string, Intl.DateTimeFormat>();
  const numberFormatter = new Intl.NumberFormat(locale, { useGrouping: false });
  const isJulian = identifier === 'JulianCalendar';
  const isKorean = identifier === 'KoreanCalendar';
  const isGregorianBoundary = ['gregory', 'japanese', 'roc', 'buddhist'].includes(calendar) && !isJulian;
  const fieldsCache = new Map<number, { year: number; month: string; day: number }>();
  const fields = (serial: number) => {
    const cached = fieldsCache.get(serial);
    if (cached) return cached;
    let value: { year: number; month: string; day: number };
    if (isJulian) {
      const julian = julianParts(serial);
      value = { year: julian.year, month: String(julian.month), day: julian.day };
    } else if (isGregorianBoundary) {
      const date = new Date(serial * calendarDayMilliseconds);
      value = { year: date.getUTCFullYear(), month: String(date.getUTCMonth() + 1), day: date.getUTCDate() };
    } else {
      const parts = partsFormatter.formatToParts(new Date(serial * calendarDayMilliseconds));
      const get = (type: string) => parts.find(part => part.type === type)?.value ?? '';
      value = { year: Number.parseInt(get('year') || get('relatedYear')), month: get('month'), day: Number.parseInt(get('day')) };
    }
    fieldsCache.set(serial, value);
    return value;
  };
  const formatDate = (serial: number) => {
    if (!isJulian) return new Date(serial * calendarDayMilliseconds);
    const julian = julianParts(serial);
    const date = new Date(0);
    date.setUTCFullYear(julian.year, julian.month - 1, julian.day);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  };
  const yearText = (serial: number) => isKorean
    ? numberFormatter.format(fields(serial).year + 2333)
    : yearFormatter.format(formatDate(serial));
  const monthText = (serial: number) => monthFormatter.format(formatDate(serial));
  const headerText = (serial: number) => {
    if (!isKorean) return headerFormatter.format(formatDate(serial));
    return headerFormatter.formatToParts(formatDate(serial))
      .map(part => part.type === 'year' ? numberFormatter.format(fields(serial).year + 2333) : part.value).join('');
  };
  const formatSelectedDate = (serial: number, options: Intl.DateTimeFormatOptions): string => {
    const selectedFormatter = formatter(options);
    if (!isKorean && !isJulian) return selectedFormatter.format(formatDate(serial));
    const actualWeekday = options.weekday ? formatter({ weekday: options.weekday }).format(new Date(serial * calendarDayMilliseconds)) : '';
    return selectedFormatter.formatToParts(formatDate(serial))
      .map(part => part.type === 'year' && isKorean ? numberFormatter.format(fields(serial).year + 2333)
        : part.type === 'weekday' && isJulian ? actualWeekday : part.value).join('');
  };
  const months: CalendarMonth[] = [];
  const years: CalendarYear[] = [];
  let previousYearKey = '';
  let cursor = minimum - fields(minimum).day + 1;
  while (cursor <= maximum) {
    const current = fields(cursor);
    const probe = cursor + 35;
    let next = probe - fields(probe).day + 1;
    if (next <= cursor) throw new RangeError('The calendar does not provide increasing month boundaries.');
    const yearKey = calendar === 'japanese' ? eraYearFormatter.format(new Date(cursor * calendarDayMilliseconds)) : String(current.year);
    if (calendar === 'japanese' && yearKey !== eraYearFormatter.format(new Date((next - 1) * calendarDayMilliseconds))) {
      // Japanese era changes may divide a month, as Showa began on December 25.
      let low = cursor + 1;
      let high = next - 1;
      while (low < high) {
        const middle = Math.floor((low + high) / 2);
        if (eraYearFormatter.format(new Date(middle * calendarDayMilliseconds)) === yearKey) low = middle + 1;
        else high = middle;
      }
      next = low;
    }
    let year = years[years.length - 1];
    if (!year || previousYearKey !== yearKey) {
      year = { index: years.length, start: cursor, end: next - 1, number: current.year, firstMonth: months.length, lastMonth: months.length, text: yearText(cursor) };
      years.push(year);
      previousYearKey = yearKey;
    }
    const month: CalendarMonth = {
      index: months.length, start: cursor, end: next - 1, year: current.year, yearIndex: year.index,
      month: current.month, text: monthText(cursor), label: yearText(cursor)
    };
    months.push(month);
    year.lastMonth = month.index;
    year.end = month.end;
    cursor = next;
  }
  return {
    identifier, language: locale, minimum, maximum, months, years,
    monthAt: (serial: number) => months[upperBoundaryIndex(months, serial)]!,
    yearAt: (serial: number) => years[upperBoundaryIndex(years, serial)]!,
    dayNumber: (serial: number) => numberFormatter.format(fields(serial).day),
    day: (serial: number) => fields(serial).day,
    headerText, yearText, monthText, formatSelectedDate,
    fullDateText: (serial: number) => {
      const actualWeekday = weekdayFormatter.format(new Date(serial * calendarDayMilliseconds));
      return dateFormatter.formatToParts(formatDate(serial)).map(part => part.type === 'weekday' ? actualWeekday
        : part.type === 'year' && isKorean ? numberFormatter.format(fields(serial).year + 2333) : part.value).join('');
    },
    weekdayText: (serial: number, format: string) => {
      const match = format.match(/abbreviated\((\d+)\)/i);
      const abbreviated = /abbreviated/i.test(format);
      const key = abbreviated ? 'short' : 'long';
      let selectedFormatter = weekdayFormats.get(key);
      if (!selectedFormatter) { selectedFormatter = formatter({ weekday: key }); weekdayFormats.set(key, selectedFormatter); }
      const text = selectedFormatter.format(new Date(serial * calendarDayMilliseconds));
      return match ? [...text].slice(0, Number(match[1])).join('') : text;
    },
    displayYear: (year: CalendarYear) => isKorean ? year.number + 2333
      : calendar === 'buddhist' ? year.number + 543
      : calendar === 'roc' ? year.number - 1911
      : Number.parseInt(partsFormatter.formatToParts(new Date(year.start * calendarDayMilliseconds)).find(part => part.type === 'year')?.value ?? String(year.number)),
    formatNumber: (number: number) => numberFormatter.format(number)
  };
};

export type CalendarModel = ReturnType<typeof createCalendarModel>;
