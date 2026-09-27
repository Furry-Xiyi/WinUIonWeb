import type { PopupBounds } from './popupRuntime'

export type TeachingTipPlacement = 'Top' | 'Bottom' | 'Left' | 'Right' | 'TopRight' | 'TopLeft' | 'BottomRight' | 'BottomLeft' | 'LeftTop' | 'LeftBottom' | 'RightTop' | 'RightBottom' | 'Center'
interface Thickness { left: number; top: number; right: number; bottom: number }
interface Size { width: number; height: number }
const placements: TeachingTipPlacement[] = ['Top', 'Bottom', 'Left', 'Right', 'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight', 'LeftTop', 'LeftBottom', 'RightTop', 'RightBottom', 'Center']
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export function teachingTipThickness(value: unknown): Thickness {
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>
    return { left: Number(source.Left ?? source.left) || 0, top: Number(source.Top ?? source.top) || 0, right: Number(source.Right ?? source.right) || 0, bottom: Number(source.Bottom ?? source.bottom) || 0 }
  }
  const parts = String(value ?? 0).split(',').map(Number)
  if (parts.length === 1) return { left: parts[0], top: parts[0], right: parts[0], bottom: parts[0] }
  if (parts.length === 2) return { left: parts[0], top: parts[1], right: parts[0], bottom: parts[1] }
  return { left: parts[0] || 0, top: parts[1] || 0, right: parts[2] || 0, bottom: parts[3] || 0 }
}

export function teachingTipTailSide(placement: TeachingTipPlacement): 'top' | 'bottom' | 'left' | 'right' {
  if (['Bottom', 'BottomLeft', 'BottomRight'].includes(placement)) return 'top'
  if (['Left', 'LeftTop', 'LeftBottom'].includes(placement)) return 'right'
  if (['Right', 'RightTop', 'RightBottom'].includes(placement)) return 'left'
  return 'bottom'
}

export function teachingTipPlacement(target: DOMRect | null, size: Size, bounds: PopupBounds, preferred: string, margin: Thickness, heroPlacement: string, hasHero: boolean, rtl = false) {
  const adjusted = rtl ? preferred.replace(/Left|Right/g, value => value === 'Left' ? 'Right' : 'Left') : preferred
  const placement = placements.includes(adjusted as TeachingTipPlacement) ? adjusted as TeachingTipPlacement : target ? 'Top' : 'Bottom'
  if (!target) {
    const nearX = bounds.left + 24 + margin.left
    const farX = bounds.right - size.width - 24 - margin.right
    const nearY = bounds.top + 24 + margin.top
    const farY = bounds.bottom - size.height - 24 - margin.bottom
    const centerX = bounds.left + (bounds.width - size.width) / 2 + margin.left - margin.right
    const centerY = bounds.top + (bounds.height - size.height) / 2 + margin.top - margin.bottom
    const left = ['Left', 'TopLeft', 'BottomLeft', 'LeftTop', 'LeftBottom'].includes(placement) ? nearX : ['Right', 'TopRight', 'BottomRight', 'RightTop', 'RightBottom'].includes(placement) ? farX : centerX
    const top = ['Top', 'TopLeft', 'TopRight', 'LeftTop', 'RightTop'].includes(placement) ? nearY : ['Bottom', 'BottomLeft', 'BottomRight', 'LeftBottom', 'RightBottom'].includes(placement) ? farY : centerY
    return { left, top, placement }
  }
  const centerX = target.left + target.width / 2
  const centerY = target.top + target.height / 2
  const edgeToTail = 28
  const candidate = (mode: TeachingTipPlacement) => {
    let left = centerX - size.width / 2
    let top = target.top - size.height - margin.top
    if (['Bottom', 'BottomLeft', 'BottomRight'].includes(mode)) top = target.bottom + margin.bottom
    if (['TopLeft', 'BottomLeft'].includes(mode)) left = centerX - size.width + edgeToTail
    if (['TopRight', 'BottomRight'].includes(mode)) left = centerX - edgeToTail
    if (['Left', 'LeftTop', 'LeftBottom'].includes(mode)) left = target.left - size.width - margin.left
    if (['Right', 'RightTop', 'RightBottom'].includes(mode)) left = target.right + margin.right
    if (mode === 'Left' || mode === 'Right') top = centerY - size.height / 2
    if (mode === 'LeftTop' || mode === 'RightTop') top = centerY - size.height + edgeToTail
    if (mode === 'LeftBottom' || mode === 'RightBottom') top = centerY - edgeToTail
    if (mode === 'Center') top = centerY - size.height - margin.top
    return { left, top, placement: mode }
  }
  const order = [...placements]
  const swap = (first: number, second: number) => { [order[first], order[second]] = [order[second], order[first]] }
  if (placement.startsWith('Bottom')) { swap(0, 1); swap(4, 6); swap(5, 7) }
  else if (placement.startsWith('Left') || placement.startsWith('Right')) {
    swap(0, 2); swap(1, 3); swap(4, 8); swap(5, 9); swap(6, 10); swap(7, 11)
    if (placement.startsWith('Right')) { swap(0, 1); swap(4, 6); swap(5, 7) }
  }
  order.splice(order.indexOf(placement), 1)
  order.unshift(placement)
  const available = (mode: TeachingTipPlacement) => {
    if (hasHero && heroPlacement === 'Top' && ['Bottom', 'BottomLeft', 'BottomRight', 'LeftBottom', 'RightBottom'].includes(mode)) return false
    if (hasHero && heroPlacement === 'Bottom' && ['Top', 'TopLeft', 'TopRight', 'LeftTop', 'RightTop', 'Center'].includes(mode)) return false
    const point = candidate(mode)
    return point.left >= bounds.left && point.top >= bounds.top && point.left + size.width <= bounds.right && point.top + size.height <= bounds.bottom
  }
  const selected = order.find(available)
  if (selected) return candidate(selected)
  const fallback = candidate(placement)
  return { ...fallback, left: clamp(fallback.left, bounds.left, bounds.right - size.width), top: clamp(fallback.top, bounds.top, bounds.bottom - size.height) }
}
