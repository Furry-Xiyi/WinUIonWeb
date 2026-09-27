import { shallowRef, watchEffect, type Directive } from 'vue'
import { createThemeShadow, getThemeShadowRecipe, isThemeShadow, shadowCornerRadius, themeShadowVisualStyle, type ThemeShadowValue } from './themeShadowRuntime'
import './themeShadowVisual.css'

export interface ThemeShadowVisualOptions {
  Shadow?: ThemeShadowValue | null
  Translation: number | string | { X?: number; Y?: number; Z?: number }
  Theme?: unknown
  CornerRadius?: number | string
  Enabled?: boolean
  Caster?: HTMLElement
}

type CasterState = { options: ReturnType<typeof shallowRef<ThemeShadowVisualOptions>>; dispose: () => void }
type CasterOwner = object | symbol
type CasterHost = { owners: Map<CasterOwner, CasterState>; previousPosition: string; appliedPosition: boolean }
const directiveOwner = Symbol('ThemeShadow directive')
const casters = new WeakMap<HTMLElement, CasterHost>()
const depthOf = (value: ThemeShadowVisualOptions['Translation']) => typeof value === 'number' ? value
  : typeof value === 'string' ? Number(value.split(',')[2] ?? 0) : Number(value?.Z ?? 0)
const themeOf = (element: HTMLElement, theme: unknown) => {
  if (typeof theme === 'string' && /\bdark\b/i.test(theme)) return 'dark'
  if (typeof theme === 'string' && /\blight\b/i.test(theme)) return 'light'
  let current: HTMLElement | null = element
  while (current) {
    if (current.classList.contains('theme-dark') || current.dataset.theme === 'dark') return 'dark'
    if (current.classList.contains('theme-light') || current.dataset.theme === 'light') return 'light'
    current = current.parentElement
  }
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const clearThemeShadowVisual = (element: HTMLElement, owner: CasterOwner = directiveOwner) => {
  const host = casters.get(element)
  if (!host) return
  host.owners.get(owner)?.dispose()
  host.owners.delete(owner)
  if (host.owners.size) return
  if (host.appliedPosition && element.style.position === 'relative') element.style.position = host.previousPosition
  casters.delete(element)
}

// Popup delegates its Shadow to Child without taking ownership of Child's own
// Shadow. Each caller must remove only the visual it attached to that element.
export const setThemeShadowVisual = (element: HTMLElement, options: ThemeShadowVisualOptions | null | undefined, owner: CasterOwner = directiveOwner) => {
  let host = casters.get(element)
  const previous = host?.owners.get(owner)
  if (!options || options.Enabled === false || ('Shadow' in options && !isThemeShadow(options.Shadow))) {
    clearThemeShadowVisual(element, owner)
    return
  }
  if (previous) { previous.options.value = options; return }
  if (!host) {
    host = { owners: new Map(), previousPosition: element.style.position, appliedPosition: false }
    casters.set(element, host)
  }
  const casterHost = host
  const input = shallowRef(options)
  const revision = shallowRef(0)
  let generatedShadow: ThemeShadowValue | null = null
  let activeShadow: ThemeShadowValue | null = null
  let activeCaster: HTMLElement | null = null
  let detach: (() => void) | undefined
  const visual = document.createElement('div')
  visual.className = 'win-theme-shadow-visual'
  visual.setAttribute('aria-hidden', 'true')
  element.prepend(visual)
  const observer = new MutationObserver(() => { revision.value++ })
  // Teleported presenters inherit theme from their copied scope classes.
  for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
    observer.observe(ancestor, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  }
  const media = matchMedia('(prefers-color-scheme: dark)')
  const onThemeChange = () => { revision.value++ }
  media.addEventListener('change', onThemeChange)
  const stop = watchEffect(() => {
    revision.value
    const value = input.value
    const explicit = 'Shadow' in value
    if (!explicit && !generatedShadow) generatedShadow = createThemeShadow()
    const shadow = explicit ? value.Shadow ?? null : generatedShadow
    const caster = value.Caster ?? element
    if (shadow !== activeShadow || caster !== activeCaster) {
      detach?.()
      detach = undefined
      activeShadow = shadow
      activeCaster = caster
      if (shadow && !shadow.IsDisposed) detach = shadow.AttachCaster(caster)
    }
    if (explicit && generatedShadow) { generatedShadow.Dispose(); generatedShadow = null }
    if (!shadow || shadow.IsDisposed) { visual.style.display = 'none'; return }
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
      casterHost.appliedPosition = true
    }
    const style = getComputedStyle(element)
    const radius = value.CornerRadius === undefined
      ? Math.max(...[style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius].map(part => Number.parseFloat(part) || 0))
      : shadowCornerRadius(value.CornerRadius)
    const depth = depthOf(value.Translation)
    visual.style.cssText = ''
    Object.assign(visual.style, themeShadowVisualStyle(getThemeShadowRecipe(depth, themeOf(element, value.Theme)), radius))
    visual.dataset.translationZ = String(depth)
  })
  casterHost.owners.set(owner, { options: input, dispose: () => {
    stop()
    observer.disconnect()
    media.removeEventListener('change', onThemeChange)
    detach?.()
    generatedShadow?.Dispose()
    visual.remove()
  } })
}

// The official controls apply UIElement.Shadow in code-behind to template parts.
export const vThemeShadow: Directive<HTMLElement, ThemeShadowVisualOptions | null | undefined> = {
  mounted: (element, binding) => setThemeShadowVisual(element, binding.value),
  updated: (element, binding) => setThemeShadowVisual(element, binding.value),
  beforeUnmount: element => clearThemeShadowVisual(element)
}
