import { onBeforeUnmount } from 'vue'
import { AnimatedIcon } from './animatedIconRuntime'

interface HostState {
  hovered: boolean
  pressed: boolean
  keyboardPressed: boolean
  pointerId?: number
}

// ButtonBase and NavigationViewItem set the attached state on the icon host.
// Keep pointer cleanup at window scope so release outside the host still runs.
export const useAnimatedIconInput = (_selectedStates = false, stateMapper: (state: string, element: HTMLElement) => string = state => state === 'Disabled' ? 'Normal' : state) => {
  const hosts = new Map<HTMLElement, HostState>()
  const stateFor = (element: HTMLElement) => {
    let state = hosts.get(element)
    if (!state) {
      state = { hovered: false, pressed: false, keyboardPressed: false }
      hosts.set(element, state)
    }
    return state
  }
  const update = (element: HTMLElement) => {
    const state = stateFor(element)
    const disabled = (element as HTMLButtonElement).disabled || element.getAttribute('aria-disabled') === 'true'
    const base = disabled ? 'Disabled' : state.pressed || state.keyboardPressed ? 'Pressed' : state.hovered ? 'PointerOver' : 'Normal'
    AnimatedIcon.SetState(element, stateMapper(base, element))
  }
  const Attach = (element: unknown) => {
    if (!(element instanceof HTMLElement)) return
    if (!hosts.has(element)) update(element)
  }
  const target = (event: Event) => event.currentTarget instanceof HTMLElement ? event.currentTarget : null
  const PointerEntered = (event: PointerEvent) => {
    const element = target(event)
    if (!element) return
    stateFor(element).hovered = event.pointerType !== 'touch'
    update(element)
  }
  const PointerExited = (event: PointerEvent) => {
    const element = target(event)
    if (!element) return
    const state = stateFor(element)
    state.hovered = false
    state.pressed = false
    update(element)
  }
  const PointerPressed = (event: PointerEvent) => {
    const element = target(event)
    if (!element || event.button > 0) return
    const state = stateFor(element)
    state.pressed = true
    state.pointerId = event.pointerId
    update(element)
  }
  const PointerReleased = (event: PointerEvent) => {
    const element = target(event)
    if (!element) return
    stateFor(element).pressed = false
    update(element)
  }
  const KeyDown = (event: KeyboardEvent) => {
    if (event.repeat || ![' ', 'Enter'].includes(event.key)) return
    const element = target(event)
    if (!element) return
    stateFor(element).keyboardPressed = true
    update(element)
  }
  const KeyUp = (event: KeyboardEvent) => {
    if (![' ', 'Enter'].includes(event.key)) return
    const element = target(event)
    if (!element) return
    stateFor(element).keyboardPressed = false
    update(element)
  }
  const LostFocus = (event: FocusEvent) => {
    const element = target(event)
    if (!element) return
    stateFor(element).keyboardPressed = false
    update(element)
  }
  const release = (event?: PointerEvent) => {
    for (const [element, state] of hosts) {
      if (!element.isConnected) { hosts.delete(element); continue }
      if (event && state.pointerId !== event.pointerId) continue
      state.pressed = false
      if (!event) { state.keyboardPressed = false; state.hovered = false }
      update(element)
    }
  }
  const releasePointer = (event: PointerEvent) => release(event)
  const Reset = () => release()
  const Refresh = () => { for (const element of hosts.keys()) update(element) }
  window.addEventListener('pointerup', releasePointer, true)
  window.addEventListener('pointercancel', releasePointer, true)
  window.addEventListener('blur', Reset)
  onBeforeUnmount(() => {
    window.removeEventListener('pointerup', releasePointer, true)
    window.removeEventListener('pointercancel', releasePointer, true)
    window.removeEventListener('blur', Reset)
    hosts.clear()
  })
  return { Attach, PointerEntered, PointerExited, PointerPressed, PointerReleased, KeyDown, KeyUp, LostFocus, Reset, Refresh }
}
