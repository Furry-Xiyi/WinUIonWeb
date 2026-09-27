export interface PopupBounds {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

export interface PopupSize { width: number; height: number }

export const resolvePopupElement = (value: unknown): HTMLElement | null => {
  if (value instanceof HTMLElement) return value
  if (!value || typeof value !== 'object') return null
  const source = value as { $el?: unknown; value?: unknown; Element?: unknown }
  const element = source.$el ?? source.Element ?? source.value
  return element instanceof HTMLElement ? element : null
}

const bounds = (left: number, top: number, right: number, bottom: number): PopupBounds => ({
  left, top, right: Math.max(left, right), bottom: Math.max(top, bottom),
  width: Math.max(0, right - left), height: Math.max(0, bottom - top)
})

// Popup surfaces belong to XamlRoot, outside the layout that declares them.
// A Gallery example is content within that root, never a popup boundary.
export const popupBoundsFor = (element: Element | null, shouldConstrainToRootBounds = true): PopupBounds => {
  const visualViewport = window.visualViewport
  const left = visualViewport?.offsetLeft ?? 0
  const top = visualViewport?.offsetTop ?? 0
  const viewport = bounds(left, top, left + (visualViewport?.width ?? window.innerWidth), top + (visualViewport?.height ?? window.innerHeight))
  // A fullscreen element becomes the visible XAML root; its old Gallery
  // ancestors no longer describe the space available to its popups.
  const fullscreenRoot = document.fullscreenElement
  const root = fullscreenRoot && element && fullscreenRoot.contains(element)
    ? fullscreenRoot
    : shouldConstrainToRootBounds ? element?.closest('[data-xaml-root]') : null
  if (!root) return viewport
  const rect = root.getBoundingClientRect()
  return bounds(Math.max(viewport.left, rect.left), Math.max(viewport.top, rect.top), Math.min(viewport.right, rect.right), Math.min(viewport.bottom, rect.bottom))
}

export const fitPopupPosition = (position: { left: number; top: number }, size: PopupSize, available: PopupBounds) => ({
  left: Math.max(available.left, Math.min(position.left, available.right - size.width)),
  top: Math.max(available.top, Math.min(position.top, available.bottom - size.height))
})

const placementSide = (placement: string) => placement.startsWith('Top') ? 'Top'
  : placement.startsWith('Bottom') ? 'Bottom' : placement.startsWith('Left') ? 'Left'
    : placement.startsWith('Right') ? 'Right' : 'Auto'
const oppositePlacement = (placement: string) => {
  const opposite: Record<string, string> = { Top: 'Bottom', Bottom: 'Top', Left: 'Right', Right: 'Left' }
  const side = placementSide(placement)
  return `${opposite[side] ?? 'Bottom'}${placement.slice(side.length)}`
}
const positionFor = (target: PopupBounds | DOMRect, size: PopupSize, placement: string, gap: number) => {
  const side = placementSide(placement)
  const result = { left: target.left + (target.width - size.width) / 2, top: target.top + (target.height - size.height) / 2 }
  if (side === 'Top') result.top = target.top - size.height - gap
  if (side === 'Bottom') result.top = target.bottom + gap
  if (side === 'Left') result.left = target.left - size.width - gap
  if (side === 'Right') result.left = target.right + gap
  if (side === 'Top' || side === 'Bottom') {
    if (placement.endsWith('Left')) result.left = target.left
    if (placement.endsWith('Right')) result.left = target.right - size.width
  } else if (side === 'Left' || side === 'Right') {
    if (placement.endsWith('Top')) result.top = target.top
    if (placement.endsWith('Bottom')) result.top = target.bottom - size.height
  }
  return result
}

export const popupPlacementPosition = (
  target: PopupBounds | DOMRect, size: PopupSize, desiredPlacement: string,
  available: PopupBounds, gap = 0, rtl = false
) => {
  let placement = desiredPlacement === 'Auto' ? 'Bottom' : desiredPlacement
  if (placement === 'Full') return { left: available.left, top: available.top, placement }
  if (rtl) placement = placement.replace(/Left|Right/g, (part) => part === 'Left' ? 'Right' : 'Left')
  const side = placementSide(placement)
  // WinUI keeps the requested side when there is room on that axis and only
  // clamps the perpendicular coordinate.  Choosing by visible area alone can
  // incorrectly move a Top flyout to Right when its centered X would extend
  // beyond a narrow mobile edge.
  const requested = positionFor(target, size, placement, gap)
  const axisFits = side === 'Top' || side === 'Bottom'
    ? requested.top >= available.top && requested.top + size.height <= available.bottom
    : requested.left >= available.left && requested.left + size.width <= available.right
  if (axisFits && size.width <= available.width && size.height <= available.height) {
    return { ...fitPopupPosition(requested, size, available), placement }
  }
  const alternatives = side === 'Top' || side === 'Bottom' ? ['Left', 'Right'] : ['Top', 'Bottom']
  const candidates = [...new Set([placement, oppositePlacement(placement), ...alternatives])]
  let best = { ...positionFor(target, size, placement, gap), placement }
  let bestArea = -1
  for (const candidate of candidates) {
    const position = positionFor(target, size, candidate, gap)
    const visibleWidth = Math.max(0, Math.min(position.left + size.width, available.right) - Math.max(position.left, available.left))
    const visibleHeight = Math.max(0, Math.min(position.top + size.height, available.bottom) - Math.max(position.top, available.top))
    const area = visibleWidth * visibleHeight
    if (area > bestArea) { best = { ...position, placement: candidate }; bestArea = area }
    if (visibleWidth >= size.width && visibleHeight >= size.height) break
  }
  return { ...fitPopupPosition(best, size, available), placement: best.placement }
}
