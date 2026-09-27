import { computed, defineComponent, getCurrentInstance, inject, isRef, onBeforeUnmount, onMounted, ref, watch, type ComponentInternalInstance, type CSSProperties } from 'vue'
import { acrylicColors, clampOpacity, colorChannels, colorString, createAcrylicBrush, cssColor, isAcrylicBrush, isSolidColorBrush, xamlBrushResourceKey, xamlThemeKey, type AcrylicBrushValue } from './brushCore'
import { acrylicResource, acrylicResourceAliases, isAcrylicResource, type AccentPalette } from './acrylicResources'
import { resolveXamlValue } from './xamlRuntime'
import { uiSettings } from './uiSettings'
import { acrylicNoise } from './acrylicNoise'

type ResourceContext = { Dispose: (callback: () => void) => void }
const propertyNames = ['TintColor', 'TintOpacity', 'TintLuminosityOpacity', 'TintTransitionDuration', 'AlwaysUseFallback', 'FallbackColor', 'Opacity'] as const
const duration = (value: unknown) => {
  if (typeof value === 'number') return Math.max(0, value)
  const time = String(value ?? '').split(':').map(Number)
  const number = Number(value)
  return time.length === 3 ? Math.max(0, ((time[0]! * 60 + time[1]!) * 60 + time[2]!) * 1000) : Math.max(0, Number.isFinite(number) ? number : 500)
}
export const createAcrylicResource = (read: (name: string) => unknown, context?: ResourceContext): AcrylicBrushValue => {
  const brush = createAcrylicBrush()
  const stops = propertyNames.map(name => watch(() => read(name), value => {
    if (value === undefined || value === '') return
    if (name === 'TintColor' || name === 'FallbackColor') brush[name] = colorString(value)
    else if (name === 'TintLuminosityOpacity') brush[name] = value === null ? null : clampOpacity(value)
    else if (name === 'TintTransitionDuration') brush[name] = duration(value)
    else if (name === 'AlwaysUseFallback') brush[name] = value === true || value === 'True'
    else brush[name] = clampOpacity(value)
  }, { immediate: true }))
  context?.Dispose(() => stops.forEach(stop => stop()))
  return brush
}
export const AcrylicBrush = defineComponent({
  name: 'AcrylicBrush', __xamlBrush: true, __createXamlResource: createAcrylicResource,
  inheritAttrs: false,
  props: {
    TintColor: { type: String, default: '#CCFFFFFF' }, TintOpacity: { type: [String, Number], default: 1 },
    TintLuminosityOpacity: { type: [String, Number], default: null }, TintTransitionDuration: { type: [String, Number], default: 500 },
    AlwaysUseFallback: { type: [String, Boolean], default: false }, FallbackColor: { type: String, default: '#00FFFFFF' },
    Opacity: { type: [String, Number], default: 1 }
  },
  setup(props, { expose }) {
    const instance = getCurrentInstance()
    expose(createAcrylicResource(name => resolveXamlValue(props[name as keyof typeof props], instance)))
    return () => null
  }
})
export default AcrylicBrush

const hostTheme = ref<'light' | 'dark'>('light')
const reducedTransparency = ref(false)
const forcedColors = ref(false)
const reducedMotion = ref(false)
let users = 0
let stopHost: (() => void) | undefined
const connectHost = () => {
  if (++users !== 1 || typeof window === 'undefined') return
  const media = ['(prefers-color-scheme: dark)', '(prefers-reduced-transparency: reduce)', '(forced-colors: active)', '(prefers-reduced-motion: reduce)'].map(query => window.matchMedia(query))
  const update = () => {
    const root = document.documentElement
    const explicitTheme = root.dataset.theme
    hostTheme.value = explicitTheme === 'dark' || explicitTheme === 'light' ? explicitTheme
      : root.classList.contains('theme-dark') || root.classList.contains('dark') ? 'dark'
        : root.classList.contains('theme-light') || root.classList.contains('light') ? 'light'
          : media[0]!.matches ? 'dark' : 'light'
    reducedTransparency.value = media[1]!.matches
    forcedColors.value = media[2]!.matches
    reducedMotion.value = media[3]!.matches
  }
  const observer = new MutationObserver(update)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  media.forEach(query => query.addEventListener('change', update))
  update()
  stopHost = () => { observer.disconnect(); media.forEach(query => query.removeEventListener('change', update)) }
}
const disconnectHost = () => { if (--users === 0) { stopHost?.(); stopHost = undefined } }
const themeFor = (instance: ComponentInternalInstance | null): 'light' | 'dark' => {
  const requested = instance?.props.RequestedTheme
  if (requested === 'Dark' || requested === 'dark') return 'dark'
  if (requested === 'Light' || requested === 'light') return 'light'
  const provided = instance?.provides?.[xamlThemeKey]
  const value = isRef(provided) ? provided.value : provided
  return value === 'dark' || value === 'Dark' ? 'dark' : value === 'light' || value === 'Light' ? 'light' : hostTheme.value
}
export const resolveAcrylicResource = (name: string, instance: ComponentInternalInstance | null) => {
  const scope = instance?.provides?.[xamlBrushResourceKey]
  const resources = (isRef(scope) ? scope.value : scope) as Record<string, unknown> | undefined
  const value = resources?.[name] ?? resources?.[acrylicResourceAliases[name] ?? name]
  if (value && typeof value === 'object' && '__xamlThemeResource' in value) {
    const variants = value as Record<string, unknown>
    return variants[forcedColors.value || uiSettings.IsHighContrast ? 'HighContrast' : themeFor(instance) === 'light' ? 'Light' : 'Dark'] ?? variants.Default
  }
  let palette: AccentPalette | undefined
  if (name.startsWith('AccentAcrylic') && typeof document !== 'undefined') {
    const styles = getComputedStyle(document.documentElement)
    palette = {
      SystemAccentColorDark1: styles.getPropertyValue('--SystemAccentColorDark1').trim() || '#005A9E',
      SystemAccentColorDark2: styles.getPropertyValue('--SystemAccentColorDark2').trim() || '#004578',
      SystemAccentColorLight3: styles.getPropertyValue('--SystemAccentColorLight3').trim() || '#A6D8FF'
    }
  }
  return value ?? acrylicResource(name, themeFor(instance), palette, forcedColors.value || uiSettings.IsHighContrast)
}
export const resolveBrushStyle = (input: unknown, instance: ComponentInternalInstance | null = null): CSSProperties => {
  const resourceName = typeof input === 'string' ? input.trim().match(/^\{(?:ThemeResource|StaticResource)\s+([^}]+)\}$|^var\(--([\w]+)\)$/)?.slice(1).find(Boolean) : undefined
  const brush = resourceName && isAcrylicResource(resourceName) ? resolveAcrylicResource(resourceName, instance) : resolveXamlValue(input, instance)
  if (isSolidColorBrush(brush)) return { background: brush.Opacity === 1 ? cssColor(brush.Color)
    : `color-mix(in srgb, ${cssColor(brush.Color)} ${clampOpacity(brush.Opacity) * 100}%, transparent)` }
  if (brush && typeof brush === 'object' && '__radialGradient' in brush) return { background: 'transparent' }
  if (!isAcrylicBrush(brush)) return { background: brush === null || brush === undefined ? undefined : String(brush) }
  // Reference MaterialHelper disables Acrylic for energy saver, slow effects
  // and AdvancedEffectsEnabled. In-app Acrylic does not fall back on window
  // deactivation; the desktop material controller owns that separate policy.
  const fallback = brush.AlwaysUseFallback || !uiSettings.AdvancedEffectsEnabled || !uiSettings.AreEffectsFast || uiSettings.EnergySaverStatus
    || reducedTransparency.value || forcedColors.value || uiSettings.IsHighContrast
    || typeof CSS !== 'undefined' && !CSS.supports('backdrop-filter', 'blur(1px)') && !CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
  const colors = acrylicColors(brush)
  const fallbackChannels = colorChannels(brush.FallbackColor)
  return {
    background: 'transparent',
    '--acrylic-tint': colors.tint, '--acrylic-luminosity': colors.luminosity,
    '--acrylic-opaque-fallback': `rgb(${fallbackChannels.r}, ${fallbackChannels.g}, ${fallbackChannels.b})`,
    '--acrylic-brush-opacity': String(clampOpacity(brush.Opacity)), '--acrylic-opaque': colors.opaque ? '1' : '0',
    '--acrylic-fallback': cssColor(brush.FallbackColor), '--acrylic-noise': `url("${acrylicNoise}")`, '--acrylic-noise-opacity': fallback ? '0' : '.02',
    '--acrylic-fallback-opacity': fallback ? '1' : '0',
    '--acrylic-tint-duration': `${reducedMotion.value ? 1 : duration(brush.TintTransitionDuration)}ms`,
    '--acrylic-fallback-duration': `${reducedMotion.value ? 1 : 167}ms`
  } as CSSProperties
}
export const useAcrylicBrushStyle = (value: unknown | (() => unknown), instance: ComponentInternalInstance | null = getCurrentInstance()) => {
  // All material hosts share one policy observer and release it with their visual tree.
  onMounted(connectHost)
  onBeforeUnmount(disconnectHost)
  const inherited = inject(xamlThemeKey, null) ?? inject('winuiTheme', null)
  if (inherited && instance && !instance.provides[xamlThemeKey]) instance.provides[xamlThemeKey] = inherited
  return computed(() => resolveBrushStyle(typeof value === 'function' ? value() : value, instance))
}
