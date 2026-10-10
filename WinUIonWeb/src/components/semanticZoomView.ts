import { computed, ref, shallowRef, toRaw, type Ref } from 'vue'
export interface Location { Item: unknown; Bounds: { X: number; Y: number; Width: number; Height: number }; ZoomPoint?: { X: number; Y: number } }
export interface Owner { ToggleActiveView: (request?: { Item?: unknown; OriginalSource?: HTMLElement }) => void; HasFocus?: () => boolean }
const same = (a: unknown, b: unknown) => toRaw(a) === toRaw(b)
const groupOf = (item: unknown) => (item as { Group?: unknown } | null)?.Group ?? item
const itemsOf = (group: unknown): unknown[] => (group as { Items?: unknown[]; GroupItems?: unknown[] } | null)?.Items ?? (group as { GroupItems?: unknown[] } | null)?.GroupItems ?? []
export const createSemanticZoomView = (root: Ref<HTMLElement | undefined>, items: () => unknown[], groups: () => unknown[], zoomedIn: boolean) => {
  const owner = shallowRef<Owner | null>(null), active = ref(true), inView = ref(zoomedIn)
  const rows = () => Array.from(root.value?.querySelectorAll<HTMLElement>(inView.value ? '[role="gridcell"]' : '.win-list-item') ?? [])
  let lastFocusedIndex = 0
  const current = (point?: Location['ZoomPoint']) => {
    const elements = rows(), viewport = root.value?.querySelector('.win-scroll-viewer-viewport')?.getBoundingClientRect()
    if (point) {
      let closest = -1, distance = Infinity
      elements.forEach((element, index) => {
        const bounds = element.getBoundingClientRect()
        if (viewport && (bounds.bottom <= viewport.top || bounds.top >= viewport.bottom || bounds.right <= viewport.left || bounds.left >= viewport.right)) return
        const dx = Math.max(bounds.left - point.X, 0, point.X - bounds.right)
        const dy = Math.max(bounds.top - point.Y, 0, point.Y - bounds.bottom)
        if (dx * dx + dy * dy < distance) { closest = index; distance = dx * dx + dy * dy }
      })
      if (closest >= 0) return items()[closest]
    }
    const focusIndex = elements.findIndex(element => element.contains(document.activeElement))
    const visibleIndex = elements.findIndex(element => { const bounds = element.getBoundingClientRect(); return !viewport || bounds.bottom > viewport.top && bounds.top < viewport.bottom })
    if (focusIndex >= 0) lastFocusedIndex = focusIndex
    return items()[focusIndex >= 0 ? focusIndex : Math.max(0, visibleIndex)]
  }
  const mapGroup = (item: unknown) => groups().find(group => same(groupOf(group), groupOf(item)) || itemsOf(group).some(candidate => same(candidate, item))) ?? groupOf(item)
  const itemIndex = (item: unknown) => items().findIndex(candidate => same(candidate, item) || same(groupOf(candidate), groupOf(item)))
  const makeVisible = (location: Location) => {
    const index = itemIndex(location.Item)
    const element = rows()[Math.max(0, index)], viewport = root.value?.querySelector<HTMLElement>('.win-scroll-viewer-viewport')
    if (!element || !viewport) return
    // Scroll a grouped destination to its leading boundary. Aligning only
    // the item puts its first row underneath the sticky group header.
    const leading = inView.value ? element.closest<HTMLElement>('.win-grid-group') ?? element : element
    const bounds = leading.getBoundingClientRect(), port = viewport.getBoundingClientRect()
    const scale = port.height / Math.max(1, viewport.clientHeight)
    viewport.scrollTop = Math.max(0, Math.min(viewport.scrollHeight - viewport.clientHeight, viewport.scrollTop + (bounds.top - port.top) / Math.max(.001, scale)))
    const visible = element.getBoundingClientRect()
    location.Bounds = { X: (visible.left - port.left) / scale, Y: (visible.top - port.top) / scale, Width: visible.width / scale, Height: visible.height / scale }
  }
  return {
    SemanticZoomOwner: owner, IsActiveView: active, IsZoomedInView: inView,
    InitializeViewChange() { root.value?.classList.add('semantic-zoom-view-changing'); current() },
    StartViewChangeFrom(source: Location, destination: Location) {
      source.Item ??= current(source.ZoomPoint) ?? null
      destination.Item = inView.value ? mapGroup(source.Item) : itemsOf(groupOf(source.Item))[0] ?? groupOf(source.Item)
      const element = rows()[itemIndex(source.Item)], bounds = element?.getBoundingClientRect(), port = root.value?.getBoundingClientRect()
      if (bounds && port) source.Bounds = { X: bounds.left - port.left, Y: bounds.top - port.top, Width: bounds.width, Height: bounds.height }
    },
    StartViewChangeTo(source: Location, destination: Location) {
      destination.Item = inView.value
        ? itemsOf(mapGroup(source.Item))[0] ?? destination.Item
        : items().find(item => same(groupOf(item), groupOf(destination.Item))) ?? destination.Item
    },
    MakeVisible: makeVisible,
    CompleteViewChangeFrom(_source: Location, _destination: Location) {},
    CompleteViewChangeTo(_source: Location, destination: Location) {
      if (owner.value?.HasFocus?.() === false) return
      let index = itemIndex(destination.Item)
      if (index < 0 && inView.value) index = itemIndex(itemsOf(mapGroup(destination.Item))[0])
      const element = rows()[index < 0 ? lastFocusedIndex : index] ?? rows()[0] ?? root.value
      element?.focus({ preventScroll: true })
      if (index >= 0) lastFocusedIndex = index
    },
    CompleteViewChange() { root.value?.classList.remove('semantic-zoom-view-changing') },
    CanHorizontallyScroll: computed(() => { const port = root.value?.querySelector('.win-scroll-viewer-viewport'); return !!port && port.scrollWidth > port.clientWidth }),
    CanVerticallyScroll: computed(() => { const port = root.value?.querySelector('.win-scroll-viewer-viewport'); return !!port && port.scrollHeight > port.clientHeight })
  }
}
