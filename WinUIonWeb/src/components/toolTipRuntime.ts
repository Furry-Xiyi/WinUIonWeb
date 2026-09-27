import type { InjectionKey, Ref } from 'vue'

export type ToolTipInputMode = 'keyboard' | 'mouse' | 'touch' | 'none'
export type ToolTipPoint = { x: number; y: number }
export type ToolTipController = {
  Open: (mode: ToolTipInputMode, point?: ToolTipPoint) => void
  Close: () => void
  IsOpen: () => boolean
  IsEnabled: () => boolean
  Element: () => HTMLElement | null
  UpdatePosition: () => Promise<void>
}
export type ToolTipOwnerContext = {
  owner: Ref<HTMLElement | null>
  inputMode: Ref<ToolTipInputMode>
  point: Ref<ToolTipPoint | null>
  theme: Ref<string>
  attached?: boolean
}

// Attached ToolTip object properties never add a layout wrapper to the owner.
export const toolTipOwnerContextKey: InjectionKey<ToolTipOwnerContext> = Symbol('winui-tool-tip-owner')
const toolTips = new WeakMap<HTMLElement, ToolTipController>()
export const registerToolTip = (owner: HTMLElement, controller: ToolTipController) => {
  const hadAttribute = owner.hasAttribute('tooltipservice.tooltip')
  if (!hadAttribute) owner.setAttribute('tooltipservice.tooltip', '')
  toolTips.set(owner, controller)
  return () => {
    if (toolTips.get(owner) !== controller) return
    toolTips.delete(owner)
    if (!hadAttribute) owner.removeAttribute('tooltipservice.tooltip')
  }
}
export const registeredToolTip = (owner: HTMLElement) => toolTips.get(owner)

/** WinUI keeps a ToolTip open inside the convex hull of owner and popup. */
export const isInToolTipSafeZone = (point: ToolTipPoint, owner: DOMRect, tip: DOMRect) => {
  const points = [owner, tip].flatMap(rect => [
    { x: rect.left, y: rect.top }, { x: rect.right, y: rect.top },
    { x: rect.right, y: rect.bottom }, { x: rect.left, y: rect.bottom }
  ]).sort((left, right) => left.x - right.x || left.y - right.y)
  const cross = (a: ToolTipPoint, b: ToolTipPoint, c: ToolTipPoint) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  const half = (input: ToolTipPoint[]) => {
    const result: ToolTipPoint[] = []
    for (const candidate of input) {
      while (result.length >= 2 && cross(result[result.length - 2], result[result.length - 1], candidate) <= 0) result.pop()
      result.push(candidate)
    }
    return result
  }
  const hull = [...half(points).slice(0, -1), ...half([...points].reverse()).slice(0, -1)]
  return hull.length >= 3 && hull.every((vertex, index) => cross(vertex, hull[(index + 1) % hull.length], point) >= -0.5)
}
