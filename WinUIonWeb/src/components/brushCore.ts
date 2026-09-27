import { reactive } from 'vue'

export interface AcrylicBrushValue {
  readonly __xamlBrush: 'AcrylicBrush'
  TintColor: string
  TintOpacity: number
  TintLuminosityOpacity: number | null
  TintTransitionDuration: number
  AlwaysUseFallback: boolean
  FallbackColor: string
  Opacity: number
}
export interface SolidColorBrushValue {
  readonly __xamlBrush: 'SolidColorBrush'
  Color: string
  Opacity: number
}
export type XamlBrushValue = AcrylicBrushValue | SolidColorBrushValue
export const xamlBrushResourceKey = Symbol.for('WinUIonWeb.Xaml.BrushResources')
export const xamlThemeKey = Symbol.for('WinUIonWeb.Xaml.Theme')

const namedColors: Record<string, string> = {
  aliceblue: '#FFF0F8FF', antiquewhite: '#FFFAEBD7', aqua: '#FF00FFFF', aquamarine: '#FF7FFFD4',
  azure: '#FFF0FFFF', beige: '#FFF5F5DC', bisque: '#FFFFE4C4', black: '#FF000000',
  blanchedalmond: '#FFFFEBCD', blue: '#FF0000FF', blueviolet: '#FF8A2BE2', brown: '#FFA52A2A',
  burlywood: '#FFDEB887', cadetblue: '#FF5F9EA0', chartreuse: '#FF7FFF00', chocolate: '#FFD2691E',
  coral: '#FFFF7F50', cornflowerblue: '#FF6495ED', cornsilk: '#FFFFF8DC', crimson: '#FFDC143C',
  cyan: '#FF00FFFF', darkblue: '#FF00008B', darkcyan: '#FF008B8B', darkgoldenrod: '#FFB8860B',
  darkgray: '#FFA9A9A9', darkgreen: '#FF006400', darkkhaki: '#FFBDB76B', darkmagenta: '#FF8B008B',
  darkolivegreen: '#FF556B2F', darkorange: '#FFFF8C00', darkorchid: '#FF9932CC', darkred: '#FF8B0000',
  darksalmon: '#FFE9967A', darkseagreen: '#FF8FBC8F', darkslateblue: '#FF483D8B', darkslategray: '#FF2F4F4F',
  darkturquoise: '#FF00CED1', darkviolet: '#FF9400D3', deeppink: '#FFFF1493', deepskyblue: '#FF00BFFF',
  dimgray: '#FF696969', dodgerblue: '#FF1E90FF', firebrick: '#FFB22222', floralwhite: '#FFFFFAF0',
  forestgreen: '#FF228B22', fuchsia: '#FFFF00FF', gainsboro: '#FFDCDCDC', ghostwhite: '#FFF8F8FF',
  gold: '#FFFFD700', goldenrod: '#FFDAA520', gray: '#FF808080', green: '#FF008000',
  greenyellow: '#FFADFF2F', honeydew: '#FFF0FFF0', hotpink: '#FFFF69B4', indianred: '#FFCD5C5C',
  indigo: '#FF4B0082', ivory: '#FFFFFFF0', khaki: '#FFF0E68C', lavender: '#FFE6E6FA',
  lavenderblush: '#FFFFF0F5', lawngreen: '#FF7CFC00', lemonchiffon: '#FFFFFACD', lightblue: '#FFADD8E6',
  lightcoral: '#FFF08080', lightcyan: '#FFE0FFFF', lightgoldenrodyellow: '#FFFAFAD2', lightgreen: '#FF90EE90',
  lightgray: '#FFD3D3D3', lightpink: '#FFFFB6C1', lightsalmon: '#FFFFA07A', lightseagreen: '#FF20B2AA',
  lightskyblue: '#FF87CEFA', lightslategray: '#FF778899', lightsteelblue: '#FFB0C4DE', lightyellow: '#FFFFFFE0',
  lime: '#FF00FF00', limegreen: '#FF32CD32', linen: '#FFFAF0E6', magenta: '#FFFF00FF',
  maroon: '#FF800000', mediumaquamarine: '#FF66CDAA', mediumblue: '#FF0000CD', mediumorchid: '#FFBA55D3',
  mediumpurple: '#FF9370DB', mediumseagreen: '#FF3CB371', mediumslateblue: '#FF7B68EE', mediumspringgreen: '#FF00FA9A',
  mediumturquoise: '#FF48D1CC', mediumvioletred: '#FFC71585', midnightblue: '#FF191970', mintcream: '#FFF5FFFA',
  mistyrose: '#FFFFE4E1', moccasin: '#FFFFE4B5', navajowhite: '#FFFFDEAD', navy: '#FF000080',
  oldlace: '#FFFDF5E6', olive: '#FF808000', olivedrab: '#FF6B8E23', orange: '#FFFFA500',
  orangered: '#FFFF4500', orchid: '#FFDA70D6', palegoldenrod: '#FFEEE8AA', palegreen: '#FF98FB98',
  paleturquoise: '#FFAFEEEE', palevioletred: '#FFDB7093', papayawhip: '#FFFFEFD5', peachpuff: '#FFFFDAB9',
  peru: '#FFCD853F', pink: '#FFFFC0CB', plum: '#FFDDA0DD', powderblue: '#FFB0E0E6',
  purple: '#FF800080', red: '#FFFF0000', rosybrown: '#FFBC8F8F', royalblue: '#FF4169E1',
  saddlebrown: '#FF8B4513', salmon: '#FFFA8072', sandybrown: '#FFF4A460', seagreen: '#FF2E8B57',
  seashell: '#FFFFF5EE', sienna: '#FFA0522D', silver: '#FFC0C0C0', skyblue: '#FF87CEEB',
  slateblue: '#FF6A5ACD', slategray: '#FF708090', snow: '#FFFFFAFA', springgreen: '#FF00FF7F',
  steelblue: '#FF4682B4', tan: '#FFD2B48C', teal: '#FF008080', thistle: '#FFD8BFD8',
  tomato: '#FFFF6347', transparent: '#00FFFFFF', turquoise: '#FF40E0D0', violet: '#FFEE82EE',
  wheat: '#FFF5DEB3', white: '#FFFFFFFF', whitesmoke: '#FFF5F5F5', yellow: '#FFFFFF00',
  yellowgreen: '#FF9ACD32'
}
export const colorString = (value: unknown): string => {
  const text = String(value ?? 'Transparent').trim()
  if (namedColors[text.toLowerCase()]) return namedColors[text.toLowerCase()]!
  if (/^#[\da-f]{6}$/i.test(text)) return `#FF${text.slice(1).toUpperCase()}`
  if (/^#[\da-f]{8}$/i.test(text)) return text.toUpperCase()
  if (/^#[\da-f]{3}$/i.test(text)) return '#FF' + text.slice(1).split('').map(digit => digit + digit).join('').toUpperCase()
  const rgb = text.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i)
  if (rgb) return '#' + [Math.round(Number(rgb[4] ?? 1) * 255), ...rgb.slice(1, 4).map(Number)]
    .map(channel => Math.max(0, Math.min(255, channel)).toString(16).padStart(2, '0')).join('').toUpperCase()
  return text
}
export const colorChannels = (value: unknown) => {
  const color = colorString(value)
  if (!/^#[\da-f]{8}$/i.test(color)) return { r: 255, g: 255, b: 255, a: 1 }
  return { a: parseInt(color.slice(1, 3), 16) / 255, r: parseInt(color.slice(3, 5), 16), g: parseInt(color.slice(5, 7), 16), b: parseInt(color.slice(7, 9), 16) }
}
export const cssColor = (value: unknown) => {
  const color = colorString(value)
  if (!/^#[\da-f]{8}$/i.test(color)) return color
  const { r, g, b, a } = colorChannels(color)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
export const clampOpacity = (value: unknown, fallback = 1) => {
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(0, Math.min(1, number)) : fallback
}
export const createSolidColorBrush = (color: unknown = 'Transparent', opacity: unknown = 1): SolidColorBrushValue => reactive({
  __xamlBrush: 'SolidColorBrush' as const, Color: colorString(color), Opacity: clampOpacity(opacity)
})
export const createAcrylicBrush = (values: Partial<Omit<AcrylicBrushValue, '__xamlBrush'>> = {}): AcrylicBrushValue => {
  const brush = reactive(new Proxy({
    __xamlBrush: 'AcrylicBrush' as const, TintColor: '#CCFFFFFF', TintOpacity: 1,
    TintLuminosityOpacity: null as number | null, TintTransitionDuration: 500, AlwaysUseFallback: false,
    FallbackColor: '#00FFFFFF', Opacity: 1
  }, {
    set(target, property, input, receiver) {
      let value = input
      if (property === 'TintColor' || property === 'FallbackColor') value = colorString(input)
      else if (property === 'Opacity' || property === 'TintOpacity') value = clampOpacity(input)
      else if (property === 'TintLuminosityOpacity') value = input === null ? null : clampOpacity(input)
      else if (property === 'AlwaysUseFallback') value = input === true || input === 'True'
      else if (property === 'TintTransitionDuration') value = Math.max(0, Number(input) || 0)
      return Reflect.set(target, property, value, receiver)
    }
  }))
  Object.assign(brush, values)
  return brush
}
export const isAcrylicBrush = (value: unknown): value is AcrylicBrushValue => Boolean(value && typeof value === 'object' && (value as XamlBrushValue).__xamlBrush === 'AcrylicBrush')
export const isSolidColorBrush = (value: unknown): value is SolidColorBrushValue => Boolean(value && typeof value === 'object' && (value as XamlBrushValue).__xamlBrush === 'SolidColorBrush')

// AcrylicBrush.cpp GetEffectiveTintColor/GetEffectiveLuminosityColor.
export const acrylicColors = (brush: AcrylicBrushValue) => {
  const { r, g, b, a } = colorChannels(brush.TintColor)
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  const saturation = max === 0 ? 0 : (max - min) / max
  const alpha = a * clampOpacity(brush.TintOpacity)
  const explicitLuminosity = brush.TintLuminosityOpacity !== null && brush.TintLuminosityOpacity !== undefined
  const suppression = max > .5 ? .45 * (max - .5) / .5 : .05 * (.5 - max) / .5
  const tintAlpha = Math.round(255 * alpha * (explicitLuminosity ? 1 : .9 - suppression * Math.max(1 - 2 * saturation, 0))) / 255
  const luminosityValue = Math.max(.125, Math.min(.965, max))
  const scale = max === 0 ? 0 : luminosityValue / max
  const luminosityRgb = explicitLuminosity ? [r, g, b] : max === 0
    ? [luminosityValue * 255, luminosityValue * 255, luminosityValue * 255]
    : [r * scale, g * scale, b * scale]
  const luminosityAlpha = explicitLuminosity ? Math.round(255 * clampOpacity(brush.TintLuminosityOpacity)) / 255
    : Math.round(255 * Math.min(Math.round(alpha * 255) / 255 * .88 + .15, 1)) / 255
  return {
    tint: `rgba(${r}, ${g}, ${b}, ${tintAlpha})`,
    luminosity: `rgba(${luminosityRgb.map(Math.round).join(', ')}, ${luminosityAlpha})`,
    opaque: tintAlpha >= 1
  }
}
