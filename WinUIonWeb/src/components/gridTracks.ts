export interface GridTrack {
  unit: 'auto' | 'pixel' | 'star'
  value: number
  min: number
  max: number
}

const finiteNumber = (value: unknown, fallback: number) => {
  if (value === '' || value === null || value === undefined) return fallback
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(0, number) : fallback
}

export const parseGridTracks = (value: unknown, dimension: 'Width' | 'Height'): GridTrack[] => {
  const entries = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? [value]
      : String(value ?? '').split(/[,;]/).map((entry) => entry.trim()).filter(Boolean)
  return (entries.length ? entries : ['*']).map((entry) => {
    const definition = typeof entry === 'object' && entry !== null ? entry as Record<string, unknown> : undefined
    const length = definition?.[dimension]
    const text = String(definition ? length === undefined || length === null || length === '' ? '*' : length : entry ?? '*').trim()
    const min = finiteNumber(definition?.[`Min${dimension}`], 0)
    const max = Math.max(min, finiteNumber(definition?.[`Max${dimension}`], Infinity))
    if (/^auto$/i.test(text)) return { unit: 'auto', value: 0, min, max }
    const star = text.match(/^(\d+(?:\.\d+)?)?\s*\*$/)
    if (star) return { unit: 'star', value: star[1] === undefined ? 1 : Number(star[1]), min, max }
    return { unit: 'pixel', value: Math.max(min, Math.min(max, finiteNumber(text, 0))), min, max }
  })
}

export const gridTrackCss = (track: GridTrack): string => {
  if (track.unit === 'pixel') return `${track.value}px`
  if (track.unit === 'auto') return `minmax(${track.min}px, max-content)`
  return `minmax(${track.min}px, ${track.value}fr)`
}

/** Redistribute remaining star space after a definition reaches its min/max. */
export const constrainedStarSizes = (tracks: GridTrack[], available: number, measured: number[]): number[] => {
  const sizes = tracks.map((track, index) => track.unit === 'pixel'
    ? track.value
    : track.unit === 'auto' ? Math.max(track.min, Math.min(track.max, measured[index] ?? track.min)) : 0)
  let remaining = available - sizes.reduce((total, size) => total + size, 0)
  let active = tracks.map((track, index) => ({ track, index })).filter(({ track }) => track.unit === 'star')
  while (active.length) {
    const weight = active.reduce((total, { track }) => total + track.value, 0)
    const belowMinimum = active.filter(({ track }) => {
      const size = weight ? Math.max(0, remaining) * track.value / weight : 0
      return size < track.min || track.value === 0
    })
    const constrained = belowMinimum.length ? belowMinimum : active.filter(({ track }) => Math.max(0, remaining) * track.value / weight > track.max)
    if (!constrained.length) {
      for (const { track, index } of active) sizes[index] = Math.max(0, remaining) * track.value / weight
      break
    }
    for (const { track, index } of constrained) {
      const size = weight ? Math.max(0, remaining) * track.value / weight : 0
      sizes[index] = Math.max(track.min, Math.min(track.max, size))
      remaining -= sizes[index]
    }
    const resolved = new Set(constrained.map(({ index }) => index))
    active = active.filter(({ index }) => !resolved.has(index))
  }
  return sizes
}
