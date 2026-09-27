import {
  createBrowserTitleBarWindowHost,
  registerTitleBarWindowHost,
  type TitleBarWindowHost,
} from '../components/titleBarHostAdapter'

/** Reserve the actual caption band without changing the official control height. */
export function connectWindowTitleBarFrame(content: HTMLElement, nativeHost?: TitleBarWindowHost, reserveBand = true): () => void {
  const owner = content.ownerDocument.defaultView
  if (!owner) return () => {}
  const source = nativeHost ?? createBrowserTitleBarWindowHost(owner)
  const ownerBar = (): HTMLElement | null => {
    const directBar = content.querySelector<HTMLElement>(':scope > .win-titlebar')
    if (directBar) return directBar
    const root = content.firstElementChild
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
    ...(source.SetDragRegions ? { SetDragRegions: regions => source.SetDragRegions!(regions) } : {}),
    ...(source.ClearDragRegions ? { ClearDragRegions: () => source.ClearDragRegions!() } : {}),
  }
  const unregister = registerTitleBarWindowHost(content, host)
  const originalPadding = content.style.paddingTop
  const basePadding = Number.parseFloat(owner.getComputedStyle(content).paddingTop) || 0
  let appliedPadding: string | undefined
  let frame: number | undefined
  let disposed = false
  let observedBar: HTMLElement | null = null
  const update = () => {
    frame = undefined
    if (disposed) return
    const bar = ownerBar()
    if (bar !== observedBar) {
      if (observedBar) resize?.unobserve(observedBar)
      observedBar = bar
      if (bar) resize?.observe(bar)
    }
    const area = source.GetTitleBarInsets?.()?.TitleBarArea
    const validArea = area && [area.X, area.Y, area.Width, area.Height].every(Number.isFinite) && area.Width > 0 && area.Height > 0
    const extra = reserveBand && validArea && bar
      ? Math.max(0, area.Y + area.Height - content.getBoundingClientRect().top - basePadding - bar.getBoundingClientRect().height)
      : 0
    const padding = extra > 0 ? `${basePadding + extra}px` : originalPadding
    if (content.style.paddingTop !== padding) content.style.paddingTop = padding
    appliedPadding = padding
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
    if (content.style.paddingTop === appliedPadding) content.style.paddingTop = originalPadding
    unregister()
  }
}
