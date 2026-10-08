import { normalizeStyle, type Directive, type StyleValue } from 'vue'

interface BrushVisual {
  root: HTMLDivElement
  acrylic: HTMLDivElement
  blur: HTMLDivElement
  luminosity: HTMLDivElement
  tint: HTMLDivElement
  noise: HTMLDivElement
  fallback: HTMLDivElement
  timer?: ReturnType<typeof setTimeout>
  fallbackActive: boolean
  position: string
  isolation: string
  hostBackdrop: boolean
  noBackdrop: boolean
  backdropFilter: string
  webkitBackdropFilter: string
  syncViewport: () => void
}
const visuals = new WeakMap<HTMLElement, BrushVisual>()
const layer = (name: string) => {
  const element = document.createElement('div')
  element.className = `win-acrylic-${name}`
  Object.assign(element.style, { position: 'absolute', inset: '0', pointerEvents: 'none' })
  return element
}
const remove = (host: HTMLElement) => {
  const visual = visuals.get(host)
  if (!visual) return
  clearTimeout(visual.timer)
  host.removeEventListener('scroll', visual.syncViewport)
  visual.root.remove()
  if (host.style.position === 'relative' && !visual.position) host.style.position = ''
  if (host.style.isolation === 'isolate') host.style.isolation = visual.isolation
  if (visual.hostBackdrop) {
    host.style.backdropFilter = visual.backdropFilter
    host.style.setProperty('-webkit-backdrop-filter', visual.webkitBackdropFilter)
  }
  visuals.delete(host)
}
const update = (host: HTMLElement, input: StyleValue, hostBackdrop = false, noBackdrop = false) => {
  const style = normalizeStyle(input) as Record<string, string> | undefined
  if (!style?.['--acrylic-tint']) { remove(host); return }
  let visual = visuals.get(host)
  if (visual && (visual.hostBackdrop !== hostBackdrop || visual.noBackdrop !== noBackdrop)) {
    remove(host)
    visual = undefined
  }
  const first = !visual
  if (!visual) {
    const root = layer('visual')
    root.setAttribute('aria-hidden', 'true')
    Object.assign(root.style, { zIndex: '-1', borderRadius: 'inherit', overflow: 'hidden', isolation: hostBackdrop || noBackdrop ? 'auto' : 'isolate' })
    // A XAML background stays in its host's viewport while the content scrolls.
    const syncViewport = () => { root.style.transform = `translate(${host.scrollLeft}px, ${host.scrollTop}px)` }
    visual = { root, acrylic: layer('effects'), blur: layer('backdrop'), luminosity: layer('luminosity'), tint: layer('tint'),
      noise: layer('noise'), fallback: layer('fallback'), fallbackActive: false,
      position: host.style.position, isolation: host.style.isolation, hostBackdrop, noBackdrop,
      backdropFilter: host.style.backdropFilter, webkitBackdropFilter: host.style.getPropertyValue('-webkit-backdrop-filter'), syncViewport }
    visual.acrylic.append(visual.blur, visual.luminosity, visual.tint, visual.noise)
    root.append(visual.acrylic, visual.fallback)
    visuals.set(host, visual)
    host.addEventListener('scroll', syncViewport, { passive: true })
  }
  if (visual.root.parentElement !== host) host.appendChild(visual.root)
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative'
  host.style.isolation = 'isolate'
  visual.syncViewport()
  const fallbackActive = style['--acrylic-fallback-opacity'] === '1'
  const opaque = style['--acrylic-opaque'] === '1'
  const tintDuration = style['--acrylic-tint-duration'] ?? '500ms'
  const fallbackDuration = style['--acrylic-fallback-duration'] ?? '167ms'
  const colorTransition = first ? 'none' : `background-color ${tintDuration} linear`
  visual.root.style.opacity = style['--acrylic-brush-opacity'] ?? '1'
  visual.acrylic.style.transition = first ? 'none' : `opacity ${fallbackDuration} cubic-bezier(.5, 0, 0, .9)`
  visual.acrylic.style.opacity = fallbackActive ? '0' : '1'
  visual.luminosity.style.mixBlendMode = 'luminosity'
  visual.luminosity.style.transition = colorTransition
  visual.luminosity.style.backgroundColor = style['--acrylic-luminosity']!
  visual.tint.style.mixBlendMode = opaque ? 'normal' : 'color'
  visual.tint.style.transition = colorTransition
  visual.tint.style.backgroundColor = style['--acrylic-tint']!
  visual.noise.style.backgroundImage = style['--acrylic-noise'] ?? 'none'
  visual.noise.style.backgroundRepeat = 'repeat'
  visual.noise.style.backgroundSize = '256px 256px'
  visual.noise.style.opacity = '.02'
  visual.fallback.style.transition = first ? 'none'
    : `opacity ${fallbackDuration} cubic-bezier(.5, 0, 0, .9), background-color ${tintDuration} linear`
  visual.fallback.style.backgroundColor = style['--acrylic-fallback']!
  visual.fallback.style.opacity = fallbackActive ? '1' : '0'
  const setBlur = (enabled: boolean) => {
    if (visual!.noBackdrop) return
    // A clipped pane is a backdrop root. Sample on that host so the material
    // can see behind it, then blend the brush layers over the blurred surface.
    const sampler = visual!.hostBackdrop ? host : visual!.root
    sampler.style.backdropFilter = enabled && !opaque ? 'blur(30px)' : 'none'
    sampler.style.setProperty('-webkit-backdrop-filter', enabled && !opaque ? 'blur(30px)' : 'none')
  }
  if (!fallbackActive) { clearTimeout(visual.timer); visual.timer = undefined; setBlur(true) }
  else if (first || visual.fallbackActive) { if (visual.timer === undefined) setBlur(false) }
  else visual.timer = setTimeout(() => { setBlur(false); visual.timer = undefined }, Number.parseFloat(fallbackDuration))
  visual.fallbackActive = fallbackActive
}

// Composition effects occupy their own paint layer. Brush opacity and
// cross-fades never change the host's content, layout, or hit-testing region.
export const vAcrylicBrush: Directive<HTMLElement, StyleValue> = {
  mounted: (host, binding) => update(host, binding.value, !!binding.modifiers['host-backdrop'], !!binding.modifiers['no-backdrop']),
  updated: (host, binding) => update(host, binding.value, !!binding.modifiers['host-backdrop'], !!binding.modifiers['no-backdrop']),
  beforeUnmount: remove
}

interface BackdropSampler {
  backdropFilter: string
  webkitBackdropFilter: string
  fallbackActive: boolean
  timer?: ReturnType<typeof setTimeout>
}
const samplers = new WeakMap<HTMLElement, BackdropSampler>()
const removeBackdrop = (host: HTMLElement) => {
  const sampler = samplers.get(host)
  if (!sampler) return
  clearTimeout(sampler.timer)
  host.style.backdropFilter = sampler.backdropFilter
  host.style.setProperty('-webkit-backdrop-filter', sampler.webkitBackdropFilter)
  samplers.delete(host)
}
const updateBackdrop = (host: HTMLElement, input: StyleValue) => {
  const styles = (Array.isArray(input) ? input : [input]).map(style => normalizeStyle(style) as Record<string, string> | undefined)
  const brushes = styles.filter(style => style?.['--acrylic-tint'])
  if (!brushes.length) { removeBackdrop(host); return }
  let sampler = samplers.get(host)
  const first = !sampler
  if (!sampler) {
    sampler = { backdropFilter: host.style.backdropFilter, webkitBackdropFilter: host.style.getPropertyValue('-webkit-backdrop-filter'), fallbackActive: false }
    samplers.set(host, sampler)
  }
  const active = brushes.some(style => style!['--acrylic-fallback-opacity'] !== '1' && style!['--acrylic-opaque'] !== '1')
  const setBlur = () => {
    host.style.backdropFilter = active ? 'blur(30px)' : 'none'
    host.style.setProperty('-webkit-backdrop-filter', active ? 'blur(30px)' : 'none')
  }
  if (active) { clearTimeout(sampler.timer); sampler.timer = undefined; setBlur() }
  else if (first || sampler.fallbackActive) { if (sampler.timer === undefined) setBlur() }
  else sampler.timer = setTimeout(() => { setBlur(); sampler!.timer = undefined }, Math.max(...brushes.map(style => Number.parseFloat(style!['--acrylic-fallback-duration'] ?? '167ms'))))
  sampler.fallbackActive = !active
}

// Opacity and clip-path make a popup animation host a CSS backdrop root. Its
// material children cannot sample the page through that boundary. Sample on
// the host, then compose the official brush layers with no-backdrop children.
export const vAcrylicBackdrop: Directive<HTMLElement, StyleValue> = {
  mounted: (host, binding) => updateBackdrop(host, binding.value),
  updated: (host, binding) => updateBackdrop(host, binding.value),
  beforeUnmount: removeBackdrop
}
