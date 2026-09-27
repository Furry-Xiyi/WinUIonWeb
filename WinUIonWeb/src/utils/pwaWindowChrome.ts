export type PwaWindowTheme = 'light' | 'dark' | 'system'

const pendingFrames = new WeakMap<Document, number>()
const stopTransition = (owner: Window) => {
  const pending = pendingFrames.get(owner.document)
  if (pending !== undefined) owner.cancelAnimationFrame(pending)
  pendingFrames.delete(owner.document)
}

const pageBackground = (owner: Window, content?: HTMLElement): { color?: string; transitioning: boolean } => {
  const canvas = owner.document.createElement('canvas')
  canvas.width = canvas.height = 1
  const context = canvas.getContext('2d')
  if (!context) return { transitioning: false }
  const layers: HTMLElement[] = []
  let element = (content?.firstElementChild as HTMLElement | null) ?? content ?? owner.document.documentElement
  while (element) { layers.push(element); element = element.parentElement }
  // Read the page's rendered layers, including an exact native fallback on
  // the content host. This never changes or imitates the material surface.
  for (const layer of layers.reverse()) {
    const color = owner.getComputedStyle(layer).backgroundColor
    if (!color) continue
    context.fillStyle = color
    context.fillRect(0, 0, 1, 1)
  }
  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data
  return {
    ...(alpha === 255 ? { color: '#' + [red!, green!, blue!].map(value => value.toString(16).padStart(2, '0')).join('') } : {}),
    transitioning: layers.some(layer => layer.getAnimations().some(animation => animation.playState === 'running')),
  }
}

/** The browser uses theme-color and color-scheme for the PWA caption area. */
export function syncPwaWindowChrome(owner: Window, requestedTheme?: PwaWindowTheme, content?: HTMLElement): string {
  stopTransition(owner)
  const root = owner.document.documentElement
  const resolvedTheme = requestedTheme ?? (root.classList.contains('theme-dark') ? 'dark' : root.classList.contains('theme-light') ? 'light' : 'system')
  const dark = resolvedTheme === 'dark' || resolvedTheme === 'system' && owner.matchMedia('(prefers-color-scheme: dark)').matches
  const background = pageBackground(owner, content)
  const fallback = owner.getComputedStyle(root).getPropertyValue('--app-bg').trim()
  const color = background.color ?? (fallback && !fallback.includes('var(') ? fallback : undefined)
  let meta = owner.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) {
    meta = owner.document.createElement('meta')
    meta.name = 'theme-color'
    owner.document.head.appendChild(meta)
  }
  meta.removeAttribute('media')
  for (const duplicate of owner.document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    if (duplicate !== meta) duplicate.remove()
  }
  if (color && meta.content !== color) meta.content = color
  root.style.colorScheme = dark ? 'dark' : 'light'
  if (background.transitioning) {
    pendingFrames.set(owner.document, owner.requestAnimationFrame(() => { syncPwaWindowChrome(owner, requestedTheme, content) }))
  }
  return meta.content
}

/** Follow explicit and system theme changes in separately mounted sample windows. */
export function observePwaWindowChrome(owner: Window, content?: HTMLElement): () => void {
  const host = content ?? owner.document.getElementById('app') ?? undefined
  const refresh = () => { syncPwaWindowChrome(owner, undefined, host) }
  const observer = new MutationObserver(refresh)
  observer.observe(owner.document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  if (host) observer.observe(host, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
  if (host?.firstElementChild) observer.observe(host.firstElementChild, { attributes: true, attributeFilter: ['class', 'style'] })
  const systemTheme = owner.matchMedia('(prefers-color-scheme: dark)')
  systemTheme.addEventListener('change', refresh)
  owner.addEventListener('pageshow', refresh)
  refresh()
  return () => {
    stopTransition(owner)
    observer.disconnect()
    systemTheme.removeEventListener('change', refresh)
    owner.removeEventListener('pageshow', refresh)
  }
}
