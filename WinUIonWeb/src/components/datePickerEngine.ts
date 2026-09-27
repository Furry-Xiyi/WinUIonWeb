import { calendarDateFromSerial, calendarDateSerial, createCalendarModel, parseCalendarDate } from './calendarEngine'

export const createDatePickerModel = (identifier: string, language: string, minYear: Date, maxYear: Date) => {
  const minimumDate = calendarDateSerial(minYear)
  const maximumDate = calendarDateSerial(maxYear)
  const calendar = createCalendarModel(identifier, language, Math.min(minimumDate, maximumDate) - 400, Math.max(minimumDate, maximumDate) + 400)
  const minimum = calendar.yearAt(minimumDate).start
  const maximum = calendar.yearAt(maximumDate).end
  const years = minYear.getTime() <= maxYear.getTime() ? calendar.years.filter(year => year.end >= minimum && year.start <= maximum) : []
  const coerce = (input: unknown): Date | null => {
    const date = parseCalendarDate(input)
    if (!date || !years.length) return null
    const clamped = calendarDateFromSerial(Math.max(minimum, Math.min(maximum, calendarDateSerial(date))))
    clamped.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())
    return clamped
  }
  const number = (value: number, digits = 1) => new Intl.NumberFormat(language, { useGrouping: false, minimumIntegerDigits: digits }).format(value)
  const format = (serial: number, pattern: string, field: 'day' | 'month' | 'year') => {
    const token = (source: string): string => {
      const digits = Number(source.match(/\((\d+)\)/)?.[1] ?? 1)
      if (source.startsWith('dayofweek.')) return calendar.weekdayText(serial, source)
      if (source.startsWith('day.')) return number(calendar.day(serial), digits)
      if (source.startsWith('month.integer')) {
        const month = calendar.monthAt(serial)
        const numericMonth = Number(month.month)
        return number(Number.isFinite(numericMonth) ? numericMonth : month.index - calendar.yearAt(serial).firstMonth + 1, digits)
      }
      if (source.startsWith('month.')) return calendar.formatSelectedDate(serial, { month: source.includes('abbreviated') ? 'short' : 'long' })
      if (source.startsWith('year.')) {
        const year = calendar.displayYear(calendar.yearAt(serial))
        return number(source.includes('abbreviated') ? year % 100 : year, source.includes('abbreviated') ? 2 : digits)
      }
      return source
    }
    const source = pattern.replace(/^\{\}/, '')
    if (source.includes('{')) return source.replace(/\{([^}]+)\}/g, (_, expression: string) => token(expression))
    if (/^(dayofweek|day|month|year)\./.test(source)) return token(source)
    return token(`${field}.${field === 'day' ? 'integer' : 'full'}`)
  }
  const order = new Intl.DateTimeFormat(language, { year: 'numeric', month: 'long', day: 'numeric' })
    .formatToParts(new Date(2026, 9, 4)).filter(part => ['year', 'month', 'day'].includes(part.type)).map(part => part.type as 'year' | 'month' | 'day')
  return { calendar, minimum, maximum, years, coerce, format, order }
}
