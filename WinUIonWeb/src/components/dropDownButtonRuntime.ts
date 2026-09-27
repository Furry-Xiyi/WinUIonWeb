import { onBeforeUnmount, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'

type GlyphInput = Record<string, (...args: any[]) => void>
export const useDropDownButtonInput = (element: Ref<HTMLButtonElement | null>, enabled: ComputedRef<boolean>, clickMode: ComputedRef<string>, invoke: (event: Event) => void,
  raise: (name: string, event: Event, extra?: Record<string, unknown>) => boolean, glyph: GlyphInput) => {
  const IsPressed = ref(false), IsPointerOver = ref(false)
  let activePointer: number | null = null, activeKey = '', suppressClick = false
  const clearPressed = () => {
    const pointer = activePointer
    activePointer = null; activeKey = ''; IsPressed.value = false
    if (pointer !== null && element.value?.hasPointerCapture?.(pointer)) { try { element.value.releasePointerCapture(pointer) } catch { } }
  }
  const inside = (event: PointerEvent) => {
    const bounds = element.value?.getBoundingClientRect()
    return Boolean(bounds && event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom)
  }
  const pointer = (name: string, event: PointerEvent) => raise(name, event, {
    Pointer: { PointerId: event.pointerId, PointerDeviceType: ({ mouse: 'Mouse', touch: 'Touch', pen: 'Pen' })[event.pointerType] ?? 'Mouse' },
    GetCurrentPoint: (relativeTo?: HTMLElement | { Element?: HTMLElement }) => {
      const target = relativeTo instanceof HTMLElement ? relativeTo : relativeTo?.Element, bounds = target?.getBoundingClientRect()
      return { Position: { X: event.clientX - (bounds?.left ?? 0), Y: event.clientY - (bounds?.top ?? 0) }, IsInContact: event.buttons > 0 }
    }
  })
  const onPointerEntered = (event: PointerEvent) => {
    IsPointerOver.value = true
    if (activePointer === event.pointerId && event.buttons > 0) IsPressed.value = true
    glyph.PointerEntered(event); pointer('PointerEntered', event)
    if (enabled.value && clickMode.value === 'Hover') invoke(event)
  }
  const onPointerExited = (event: PointerEvent) => { IsPointerOver.value = false; if (!activeKey) IsPressed.value = false; glyph.PointerExited(event); pointer('PointerExited', event) }
  const onPointerPressed = (event: PointerEvent) => {
    if (enabled.value && event.button === 0 && clickMode.value !== 'Hover' && activePointer === null) {
      suppressClick = false; activePointer = event.pointerId; IsPressed.value = true
      try { element.value?.setPointerCapture(event.pointerId) } catch { }
      if (clickMode.value === 'Press') { invoke(event); suppressClick = true }
    }
    glyph.PointerPressed(event); pointer('PointerPressed', event)
  }
  const onPointerMoved = (event: PointerEvent) => { if (activePointer === event.pointerId) { IsPressed.value = inside(event); IsPointerOver.value = IsPressed.value } pointer('PointerMoved', event) }
  const onPointerReleased = (event: PointerEvent) => { if (activePointer === event.pointerId && !inside(event)) suppressClick = true; clearPressed(); glyph.PointerReleased(event); pointer('PointerReleased', event) }
  const onPointerCanceled = (event: PointerEvent) => { suppressClick = true; clearPressed(); glyph.PointerExited(event); pointer('PointerCanceled', event) }
  const onPointerCaptureLost = (event: PointerEvent) => { if (activePointer !== null) suppressClick = true; clearPressed(); glyph.PointerExited(event); pointer('PointerCaptureLost', event) }
  const key = (name: string, event: KeyboardEvent) => raise(name, event, { Key: ({ ' ': 'Space', ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right' })[event.key] ?? event.key })
  const onKeyDown = (event: KeyboardEvent) => {
    glyph.KeyDown(event)
    if (key('KeyDown', event) || !enabled.value || clickMode.value === 'Hover') return
    if (event.key !== ' ' && event.key !== 'Enter') { activeKey = ''; IsPressed.value = false; return }
    event.preventDefault()
    if (event.repeat || activeKey || activePointer !== null) return
    activeKey = event.key; IsPressed.value = true
    if (clickMode.value === 'Press') invoke(event)
  }
  const onKeyUp = (event: KeyboardEvent) => {
    glyph.KeyUp(event)
    if (key('KeyUp', event)) { clearPressed(); return }
    if (!enabled.value || clickMode.value === 'Hover' || event.key !== ' ' && event.key !== 'Enter') return
    event.preventDefault()
    const shouldInvoke = activeKey === event.key && IsPressed.value
    clearPressed()
    if (shouldInvoke && clickMode.value === 'Release') invoke(event)
  }
  const onNativeClick = (event: MouseEvent) => {
    if (!enabled.value) return
    if (suppressClick) { suppressClick = false; event.preventDefault(); return }
    if (clickMode.value !== 'Hover') invoke(event)
  }
  const blur = () => { clearPressed(); suppressClick = false; glyph.Refresh() }
  watch(enabled, blur)
  onMounted(() => window.addEventListener('blur', blur))
  onBeforeUnmount(() => { window.removeEventListener('blur', blur); clearPressed() })
  return { IsPressed, IsPointerOver, clearPressed, onPointerEntered, onPointerExited, onPointerPressed, onPointerMoved, onPointerReleased, onPointerCanceled, onPointerCaptureLost, onKeyDown, onKeyUp, onNativeClick }
}
