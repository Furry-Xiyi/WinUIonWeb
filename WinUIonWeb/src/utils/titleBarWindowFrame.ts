import {
  createBrowserTitleBarWindowHost,
  registerTitleBarWindowHost,
  type TitleBarRegion,
  type TitleBarWindowHost,
} from '../components/titleBarHostAdapter'

/** Reserve the actual caption band without changing the official control height. */
export function connectWindowTitleBarFrame(content: HTMLElement, nativeHost?: TitleBarWindowHost, reserveBand = true): () => void {
  const owner = content.ownerDocument.defaultView
  if (!owner) return () => {}
  const source = nativeHost ?? createBrowserTitleBarWindowHost(owner)
  let captionRegion: HTMLElement | undefined
  let captionBounds: TitleBarRegion | undefined
  let ownsNativeCaption = false
  const removeCaptionRegion = (clearNative = true) => {
    captionRegion?.remove()
    captionRegion = undefined
    captionBounds = undefined
    if (ownsNativeCaption && clearNative) source.ClearDragRegions?.()
    ownsNativeCaption = false
  }
  const ownerBar = (): HTMLElement | null => {
    const directBar = content.querySelector<HTMLElement>(':scope > .win-titlebar')
    if (directBar) return directBar
    const root = [...content.children].find(element => element !== captionRegion)
    if (!(root instanceof owner.HTMLElement)) return null
    return root.classList.contains('win-titlebar') ? root : root.querySelector<HTMLElement>(':scope > .win-titlebar')
  }
  const host: TitleBarWindowHost = {
    GetTitle: () => source.GetTitle(),
    SetTitle: title => source.SetTitle(title),
    IsTitleBarOwner: element => element === ownerBar() && (source.IsTitleBarOwner?.(element) ?? true),
    ...(source.IsInputActive ? { IsInputActive: () => source.IsInputActive!() } : {}),
    ...(source.SubscribeActivation ? { SubscribeActivation: listener => source.SubscribeActivation!(listener) } : {}),
    ...(source.GetTitleBarInsets ? { GetTitleBarInsets: () => source.GetTitleBarInsets!() } : {}),
    ...(source.SubscribeTitleBarInsets ? { SubscribeTitleBarInsets: listener => source.SubscribeTitleBarInsets!(listener) } : {}),
    ...(source.SetExtendsContentIntoTitleBar ? { SetExtendsContentIntoTitleBar: value => source.SetExtendsContentIntoTitleBar!(value) } : {}),
    ...(source.SetPreferredHeightOption ? { SetPreferredHeightOption: value => source.SetPreferredHeightOption!(value) } : {}),
    ...(source.SetDragRegions ? { SetDragRegions: regions => { removeCaptionRegion(false); source.SetDragRegions!(regions) } } : {}),
    ...(source.ClearDragRegions ? { ClearDragRegions: () => source.ClearDragRegions!() } : {}),
  }
  const unregister = registerTitleBarWindowHost(content, host)
  const originalPadding = content.style.paddingTop
  const basePadding = Number.parseFloat(owner.getComputedStyle(content).paddingTop) || 0
  let appliedPadding: string | undefined
  let frame: number | undefined
  let disposed = false
  let observedBar: HTMLElement | null = null
  const geometryProperties = new Map(['--WindowTitleBarY', '--WindowCaptionBandBottom'].map(name => [name, {
    original: content.style.getPropertyValue(name), priority: content.style.getPropertyPriority(name),
    applied: undefined as string | undefined, overridden: false,
  }]))
  const setGeometryProperty = (name: string, value?: number) => {
    const saved = geometryProperties.get(name)!
    if (saved.applied !== undefined && content.style.getPropertyValue(name) !== saved.applied) saved.overridden = true
    if (saved.overridden) return
    const next = value === undefined ? saved.original : `${value}px`
    if (next) content.style.setProperty(name, next, value === undefined ? saved.priority : '')
    else content.style.removeProperty(name)
    saved.applied = next
  }
  const update = () => {
    frame = undefined
    if (disposed) return
    const bar = ownerBar()
    if (bar !== observedBar) {
      if (observedBar) resize?.unobserve(observedBar)
      observedBar = bar
      if (bar) resize?.observe(bar)
    }
    const insets = source.GetTitleBarInsets?.()
    const area = insets?.TitleBarArea
    const validArea = area && [area.X, area.Y, area.Width, area.Height].every(Number.isFinite) && area.Width > 0 && area.Height > 0
    if (!reserveBand) {
      setGeometryProperty('--WindowTitleBarY', validArea ? area.Y : undefined)
      setGeometryProperty('--WindowCaptionBandBottom', validArea ? area.Y + area.Height : undefined)
    }
    const extra = reserveBand && validArea
      ? Math.max(0, area.Y + area.Height - content.getBoundingClientRect().top - basePadding - (bar?.getBoundingClientRect().height ?? 0))
      : 0
    const padding = extra > 0 ? `${basePadding + extra}px` : originalPadding
    if (content.style.paddingTop !== padding) content.style.paddingTop = padding
    appliedPadding = padding
    // Page-only windows still need a caption; TitleBar owns its own regions.
    if (reserveBand && validArea && !bar) {
      const bounds = content.getBoundingClientRect()
      const left = Math.max(0, bounds.left, area.X, insets?.LeftInset ?? 0)
      const right = Math.min(owner.innerWidth, bounds.right, area.X + area.Width, owner.innerWidth - Math.max(0, insets?.RightInset ?? 0))
      const top = Math.max(0, bounds.top, area.Y)
      const bottom = Math.min(owner.innerHeight, bounds.bottom, area.Y + area.Height)
      if (right > left && bottom > top) {
        const next = { X: left, Y: top, Width: right - left, Height: bottom - top }
        if (!captionRegion) {
          captionRegion = content.ownerDocument.createElement('div')
          captionRegion.className = 'win-window-caption-drag-region'
          captionRegion.setAttribute('aria-hidden', 'true')
          Object.assign(captionRegion.style, { position: 'fixed', zIndex: '1000', background: 'transparent', pointerEvents: 'auto' })
          captionRegion.style.setProperty('app-region', 'drag')
          captionRegion.style.setProperty('-webkit-app-region', 'drag')
          content.appendChild(captionRegion)
        }
        Object.assign(captionRegion.style, { left: `${left}px`, top: `${top}px`, width: `${next.Width}px`, height: `${next.Height}px` })
        if (!captionBounds || Object.keys(next).some(key => next[key as keyof TitleBarRegion] !== captionBounds![key as keyof TitleBarRegion])) {
          captionBounds = next
          if (source.SetDragRegions) {
            source.SetDragRegions({ Caption: next, Passthrough: [], Icon: null })
            ownsNativeCaption = true
          }
        }
      } else removeCaptionRegion()
    } else removeCaptionRegion(!bar)
  }
  const schedule = () => { if (!disposed && frame === undefined) frame = owner.requestAnimationFrame(update) }
  const resize = owner.ResizeObserver ? new owner.ResizeObserver(schedule) : undefined
  resize?.observe(content)
  const mutations = new owner.MutationObserver(schedule)
  mutations.observe(content, { childList: true })
  const stopInsets = source.SubscribeTitleBarInsets?.(schedule)
  owner.addEventListener('resize', schedule)
  schedule()
  return () => {
    disposed = true
    if (frame !== undefined) owner.cancelAnimationFrame(frame)
    stopInsets?.()
    owner.removeEventListener('resize', schedule)
    resize?.disconnect()
    mutations.disconnect()
    removeCaptionRegion()
    if (content.style.paddingTop === appliedPadding) content.style.paddingTop = originalPadding
    for (const [name, saved] of geometryProperties) {
      if (saved.applied === undefined || content.style.getPropertyValue(name) !== saved.applied) continue
      if (saved.original) content.style.setProperty(name, saved.original, saved.priority)
      else content.style.removeProperty(name)
    }
    unregister()
  }
}
