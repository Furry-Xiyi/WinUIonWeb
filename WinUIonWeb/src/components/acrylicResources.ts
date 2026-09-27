import { createAcrylicBrush, createSolidColorBrush } from './brushCore'

const defaultAliases = ['ToolTipBackgroundBrush', 'FlyoutPresenterBackground', 'ComboBoxDropDownBackground',
  'NavigationViewDefaultPaneBackground', 'TeachingTipTransientBackground', 'CommandBarBackgroundOpen',
  'CommandBarOverflowPresenterBackground', 'MediaTransportControlsPanelBackground',
  'FlipViewNextPreviousButtonBackground', 'FlipViewNextPreviousButtonBackgroundPointerOver', 'FlipViewNextPreviousButtonBackgroundPressed',
  'ScrollBarTrackFill', 'ScrollBarTrackFillPointerOver', 'ScrollBarTrackFillPressed', 'ScrollBarTrackFillDisabled',
  'ScrollBarTrackStroke', 'ScrollBarTrackStrokePointerOver', 'ScrollBarTrackStrokePressed', 'ScrollBarTrackStrokeDisabled']
const backgroundAliases = ['AutoSuggestBoxSuggestionsListBackground', 'DatePickerFlyoutPresenterBackground',
  'TimePickerFlyoutPresenterBackground', 'LoopingSelectorUpDownButtonBackground', 'NumberBoxPopupBackground',
  'BreadcrumbBarEllipsisFlyoutPresenterBackground', 'MediaTransportControlsFlyoutBackground',
  'AcrylicBackgroundFillColorDefaultBackdrop', 'MenuFlyoutSystemBackdrop', 'CommandBarFlyoutSystemBackdrop']
const transparentAliases = ['MenuFlyoutPresenterBackground', 'CommandBarFlyoutBackground']
export const acrylicResourceAliases: Readonly<Record<string, string>> = Object.freeze({
  ...Object.fromEntries(defaultAliases.map(name => [name, 'AcrylicInAppFillColorDefaultBrush'])),
  ...Object.fromEntries(backgroundAliases.map(name => [name, 'AcrylicBackgroundFillColorDefaultBrush'])),
  ...Object.fromEntries(transparentAliases.map(name => [name, 'DesktopAcrylicTransparentBrush']))
})
const definitions = {
  Default: { dark: ['#2C2C2C', .15, .96, '#2C2C2C'], light: ['#FCFCFC', 0, .85, '#F9F9F9'] },
  Base: { dark: ['#202020', .5, .96, '#1C1C1C'], light: ['#F3F3F3', 0, .9, '#EEEEEE'] }
} as const
export type AccentPalette = { SystemAccentColorDark1: string; SystemAccentColorDark2: string; SystemAccentColorLight3: string }
const defaultAccentPalette: AccentPalette = { SystemAccentColorDark1: '#005A9E', SystemAccentColorDark2: '#004578', SystemAccentColorLight3: '#A6D8FF' }
export const acrylicThemeResources = (theme: 'light' | 'dark', accent: string | AccentPalette = defaultAccentPalette, highContrast = false) => {
  const resources: Record<string, unknown> = { DesktopAcrylicTransparentBrush: createSolidColorBrush('Transparent') }
  const add = (name: string, values: readonly [string, number, number, string]) => {
    resources[name] = highContrast ? createSolidColorBrush(name.includes('Inverse') ? 'CanvasText' : 'Canvas') : createAcrylicBrush({
      TintColor: values[0], TintOpacity: values[1], TintLuminosityOpacity: values[2], FallbackColor: values[3]
    })
  }
  for (const source of ['Background', 'InApp']) {
    for (const level of ['Default', 'Base'] as const) {
      add(`Acrylic${source}FillColor${level}Brush`, definitions[level][theme])
      if (level === 'Default') add(`Acrylic${source}FillColorDefaultInverseBrush`, definitions.Default[theme === 'dark' ? 'light' : 'dark'])
      const palette = typeof accent === 'string' ? { SystemAccentColorDark1: accent, SystemAccentColorDark2: accent, SystemAccentColorLight3: accent } : accent
      const color = palette[theme === 'light' ? 'SystemAccentColorLight3' : level === 'Default' ? 'SystemAccentColorDark1' : 'SystemAccentColorDark2']
      add(`AccentAcrylic${source}FillColor${level}Brush`, [color, .8, theme === 'dark' ? .8 : .9, color])
    }
  }
  for (const [name, target] of Object.entries(acrylicResourceAliases)) resources[name] = resources[target]
  if (highContrast) for (const name of transparentAliases) resources[name] = createSolidColorBrush('Canvas')
  return resources
}
const cache = new Map<string, Record<string, unknown>>()
export const acrylicResource = (name: string, theme: 'light' | 'dark' = 'light', accent: string | AccentPalette = defaultAccentPalette, highContrast = false) => {
  const key = `${theme}:${JSON.stringify(accent)}:${highContrast}`
  if (!cache.has(key)) cache.set(key, acrylicThemeResources(theme, accent, highContrast))
  return cache.get(key)?.[name]
}
export const isAcrylicResource = (name: string) => Boolean(acrylicResourceAliases[name])
  || /^(?:Accent)?Acrylic(?:Background|InApp)FillColor(?:Default|DefaultInverse|Base)Brush$/.test(name)
  || name === 'DesktopAcrylicTransparentBrush'
