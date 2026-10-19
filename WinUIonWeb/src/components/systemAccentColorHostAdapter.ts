/** Current Windows/UI accent palette supplied by a WebView host. */
export interface SystemAccentColorPalette {
  AccentColor: string
  LightThemeAccentColor?: string
  DarkThemeAccentColor?: string
  LightThemeTextColor?: string
  DarkThemeTextColor?: string
  AccentColorLight1?: string
  AccentColorLight2?: string
  AccentColorLight3?: string
  AccentColorDark1?: string
  AccentColorDark2?: string
  AccentColorDark3?: string
}

/** Framework-neutral native/browser bridge for a live system accent color. */
export interface SystemAccentColorHostAdapter {
  Read(): SystemAccentColorPalette | null
  Subscribe(listener: (palette: SystemAccentColorPalette | null) => void): () => void
}

export type SystemAccentColorHostTarget = HTMLElement

const paletteVariables: ReadonlyArray<readonly [keyof SystemAccentColorPalette, string]> = [
  ['AccentColor', '--winui-system-accent-color'],
  ['LightThemeAccentColor', '--winui-system-accent-color-light'],
  ['DarkThemeAccentColor', '--winui-system-accent-color-dark'],
  ['LightThemeTextColor', '--winui-system-accent-text-light'],
  ['DarkThemeTextColor', '--winui-system-accent-text-dark'],
  ['AccentColorLight1', '--winui-system-accent-light-1'],
  ['AccentColorLight2', '--winui-system-accent-light-2'],
  ['AccentColorLight3', '--winui-system-accent-light-3'],
  ['AccentColorDark1', '--winui-system-accent-dark-1'],
  ['AccentColorDark2', '--winui-system-accent-dark-2'],
  ['AccentColorDark3', '--winui-system-accent-dark-3'],
]
const derivedCssVariables = [
  '--winui-system-accent-hover-light', '--winui-system-accent-pressed-light',
  '--winui-system-accent-hover-dark', '--winui-system-accent-pressed-dark',
  '--winui-system-accent-text-secondary-light', '--winui-system-accent-text-secondary-dark',
] as const
const cssVariables = [...paletteVariables.map(([, property]) => property), ...derivedCssVariables]
const activeConnections = new WeakMap<HTMLElement, () => void>()

function parseRgb(color: string): [number, number, number] | undefined {
  const hex = color.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1]
  if (hex) {
    const full = hex.length === 3 ? [...hex].map(channel => channel + channel).join('') : hex
    return [0, 2, 4].map(index => Number.parseInt(full.slice(index, index + 2), 16)) as [number, number, number]
  }
  const rgb = color.trim().match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*[\d.]+)?\s*\)$/i)
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : undefined
}

function resolveRgb(color: string, target: HTMLElement): [number, number, number] | undefined {
  const existing = parseRgb(color)
  if (existing) return existing
  const document = target.ownerDocument
  const view = document.defaultView
  if (!view) return undefined
  const probe = document.createElement('span')
  probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none'
  probe.style.color = color
  document.documentElement.appendChild(probe)
  const computed = view.getComputedStyle(probe).color
  probe.remove()
  return parseRgb(computed)
}

function alphaColor(color: string, alpha: number, target: HTMLElement): string | undefined {
  const rgb = resolveRgb(color, target)
  return rgb ? `rgba(${rgb.join(', ')}, ${alpha})` : undefined
}

function mixColor(color: string, targetColor: readonly [number, number, number], amount: number, target: HTMLElement): string | undefined {
  const rgb = resolveRgb(color, target)
  if (!rgb) return undefined
  const mixed = rgb.map((channel, index) => Math.round(channel * (1 - amount) + targetColor[index] * amount))
  return `rgb(${mixed.join(', ')})`
}

function contrastingText(color: string): string | undefined {
  const rgb = parseRgb(color)
  if (!rgb) return undefined
  const luminance = rgb.map(channel => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
  const whiteContrast = 1.05 / (luminance + 0.05)
  const blackContrast = (luminance + 0.05) / 0.05
  return whiteContrast >= blackContrast ? '#FFFFFF' : '#000000'
}

function isCssColor(value: string, target: HTMLElement): boolean {
  const css = target.ownerDocument.defaultView?.CSS
  return css?.supports ? css.supports('color', value) : value.trim().length > 0
}

/** Read the browser's live CSS AccentColor system color when available. */
export function createBrowserSystemAccentColorHostAdapter(owner?: Window): SystemAccentColorHostAdapter {
  const browserWindow = owner ?? (typeof window === 'undefined' ? undefined : window)
  if (!browserWindow) return { Read: () => null, Subscribe: () => () => undefined }

  const readAccentColor = (): string | undefined => {
    const document = browserWindow.document
    const css = (browserWindow as Window & { CSS?: { supports: (property: string, value: string) => boolean } }).CSS
    if (!css?.supports?.('color', 'AccentColor')) return undefined
    const probe = document.createElement('span')
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;color:AccentColor'
    ;(document.body ?? document.documentElement).appendChild(probe)
    const color = browserWindow.getComputedStyle(probe).color.trim()
    probe.remove()
    return color && isCssColor(color, document.documentElement) ? color : undefined
  }

  let lastColor = readAccentColor()
  let poll: number | undefined
  const listeners = new Set<(palette: SystemAccentColorPalette | null) => void>()
  const publishIfChanged = () => {
    const next = readAccentColor()
    if (next === lastColor) return
    lastColor = next
    const palette = next ? { AccentColor: next } : null
    for (const listener of [...listeners]) listener(palette)
  }
  const stopPolling = () => {
    if (poll !== undefined) browserWindow.clearInterval(poll)
    poll = undefined
    browserWindow.document.removeEventListener('visibilitychange', publishIfChanged)
    browserWindow.removeEventListener('focus', publishIfChanged)
    browserWindow.removeEventListener('pageshow', publishIfChanged)
  }

  return {
    Read: () => {
      lastColor = readAccentColor()
      return lastColor ? { AccentColor: lastColor } : null
    },
    Subscribe(listener) {
      listeners.add(listener)
      if (poll === undefined) {
        browserWindow.document.addEventListener('visibilitychange', publishIfChanged)
        browserWindow.addEventListener('focus', publishIfChanged)
        browserWindow.addEventListener('pageshow', publishIfChanged)
        poll = browserWindow.setInterval(() => {
          if (browserWindow.document.visibilityState !== 'hidden') publishIfChanged()
        }, 1500)
      }
      return () => {
        listeners.delete(listener)
        if (!listeners.size) stopPolling()
      }
    },
  }
}

/** Connect a native or browser host to the package's theme CSS. */
export function connectSystemAccentColorHost(
  adapter: SystemAccentColorHostAdapter,
  target: SystemAccentColorHostTarget = document.documentElement,
): () => void {
  activeConnections.get(target)?.()
  const original = new Map(cssVariables.map(property => {
    const value = target.style.getPropertyValue(property)
    const priority = target.style.getPropertyPriority(property)
    return [property, { value, priority }] as const
  }))
  let disposed = false

  const publish = (palette: SystemAccentColorPalette | null) => {
    if (disposed) return
    for (const property of cssVariables) target.style.removeProperty(property)
    if (!palette) return

    const accent = palette.AccentColor?.trim()
    if (!accent || !isCssColor(accent, target)) return
    const requestedLight = palette.LightThemeAccentColor?.trim()
    const requestedDark = palette.DarkThemeAccentColor?.trim()
    const lightAccent = requestedLight && isCssColor(requestedLight, target) ? requestedLight : accent
    const darkAccent = requestedDark && isCssColor(requestedDark, target)
      ? requestedDark
      : undefined
    target.style.setProperty('--winui-system-accent-color', accent)
    target.style.setProperty('--winui-system-accent-color-light', lightAccent)
    if (darkAccent) target.style.setProperty('--winui-system-accent-color-dark', darkAccent)

    const toRgbString = (value: string) => {
      const rgb = resolveRgb(value, target)
      return rgb ? `rgb(${rgb.join(', ')})` : value
    }
    const lightText = palette.LightThemeTextColor?.trim() || contrastingText(toRgbString(lightAccent))
    const darkText = palette.DarkThemeTextColor?.trim() || (darkAccent ? contrastingText(toRgbString(darkAccent)) : undefined)
    if (lightText && isCssColor(lightText, target)) target.style.setProperty('--winui-system-accent-text-light', lightText)
    if (darkText && isCssColor(darkText, target)) target.style.setProperty('--winui-system-accent-text-dark', darkText)

    const derivedColors: ReadonlyArray<readonly [string, string | undefined]> = [
      // WinUI's AccentFillColorSecondary/TertiaryBrush keep the theme's
      // default accent shade and apply 0.9/0.8 opacity. Compositing that
      // color over a light surface makes the states lighter; over a dark
      // surface it makes them darker. They are not separate palette shades.
      ['--winui-system-accent-hover-light', alphaColor(lightAccent, 0.9, target)],
      ['--winui-system-accent-pressed-light', alphaColor(lightAccent, 0.8, target)],
      ['--winui-system-accent-hover-dark', darkAccent ? alphaColor(darkAccent, 0.9, target) : undefined],
      ['--winui-system-accent-pressed-dark', darkAccent ? alphaColor(darkAccent, 0.8, target) : undefined],
      ['--winui-system-accent-text-secondary-light', alphaColor(lightText ?? '#FFFFFF', 0.7, target)],
      ['--winui-system-accent-text-secondary-dark', alphaColor(darkText ?? '#000000', 0.7, target)],
      ['--winui-system-accent-light-1', palette.AccentColorLight1?.trim() || mixColor(accent, [255, 255, 255], 0.2, target)],
      ['--winui-system-accent-light-2', palette.AccentColorLight2?.trim() || mixColor(accent, [255, 255, 255], 0.4, target)],
      ['--winui-system-accent-light-3', palette.AccentColorLight3?.trim() || mixColor(accent, [255, 255, 255], 0.6, target)],
      ['--winui-system-accent-dark-1', palette.AccentColorDark1?.trim() || mixColor(accent, [0, 0, 0], 0.14, target)],
      ['--winui-system-accent-dark-2', palette.AccentColorDark2?.trim() || mixColor(accent, [0, 0, 0], 0.32, target)],
      ['--winui-system-accent-dark-3', palette.AccentColorDark3?.trim() || mixColor(accent, [0, 0, 0], 0.5, target)],
    ]
    for (const [property, value] of derivedColors) {
      if (value && isCssColor(value, target)) target.style.setProperty(property, value)
    }
  }

  publish(adapter.Read())
  const unsubscribe = adapter.Subscribe(publish)
  const disconnect = () => {
    if (disposed) return
    disposed = true
    unsubscribe()
    for (const property of cssVariables) {
      target.style.removeProperty(property)
      const previous = original.get(property)
      if (previous?.value) target.style.setProperty(property, previous.value, previous.priority)
    }
    if (activeConnections.get(target) === disconnect) activeConnections.delete(target)
  }
  activeConnections.set(target, disconnect)
  return disconnect
}
