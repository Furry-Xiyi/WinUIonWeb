import type { InjectionKey } from 'vue'

// Browser hit testing can dispatch boundary events when PopupThemeTransition
// moves a flyout beneath a stationary mouse. This remains an implementation
// detail of the popup rather than a new Flyout dependency property.
export interface FlyoutInputContext {
  allowsHover(event: PointerEvent): boolean
}

export const flyoutInputContextKey: InjectionKey<FlyoutInputContext> = Symbol('FlyoutInputContext')

export interface FlyoutInputRegion {
  readonly Owner: unknown
  readonly IsOpen: boolean
  readonly Target: HTMLElement | null
  readonly Presenter: HTMLElement | null
  readonly DismissLayer: HTMLElement | null
  Hide(restoreFocus?: boolean): void
}

// A teleported selection menu remains a logical child of its placement target's flyout.
const regions = new Set<FlyoutInputRegion>()
const parentRegion = (region: FlyoutInputRegion) => [...regions].find(candidate =>
  candidate !== region && candidate.IsOpen && region.Target && candidate.Presenter?.contains(region.Target))
const isDescendant = (region: FlyoutInputRegion, ancestor: FlyoutInputRegion) => {
  const visited = new Set<FlyoutInputRegion>()
  for (let parent = parentRegion(region); parent && !visited.has(parent); parent = parentRegion(parent)) {
    if (parent === ancestor) return true
    visited.add(parent)
  }
  return false
}

export const registerFlyoutInputRegion = (region: FlyoutInputRegion) => {
  regions.add(region)
  return () => { regions.delete(region) }
}
export const isDescendantFlyoutOpening = (owner: unknown, ancestor: FlyoutInputRegion) =>
  [...regions].some(region => region.Owner === owner && isDescendant(region, ancestor))
export const hasOpenDescendantFlyout = (ancestor: FlyoutInputRegion) =>
  [...regions].some(region => region.IsOpen && isDescendant(region, ancestor))
export const flyoutContainsNode = (ancestor: FlyoutInputRegion, node: Node | null) => !!node && (
  ancestor.Presenter?.contains(node) || [...regions].some(region => region.IsOpen && isDescendant(region, ancestor)
    && (region.Presenter?.contains(node) || region.DismissLayer?.contains(node))))
export const hideDescendantFlyouts = (ancestor: FlyoutInputRegion) => {
  for (const region of regions) if (region.IsOpen && isDescendant(region, ancestor)) region.Hide(false)
}
export const nestedFlyoutLayers = (region: FlyoutInputRegion) => {
  const parent = parentRegion(region)
  if (!parent?.Presenter) return null
  const parentLayer = Number(getComputedStyle(parent.Presenter).zIndex) || 0
  const overlay = Math.min(2147483647, parentLayer + 1)
  return { overlay, presenter: Math.min(2147483647, overlay + 1) }
}
