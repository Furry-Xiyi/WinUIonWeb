export const animatedIconStateChangedEvent = 'winui-animated-icon-state-changed'

export interface AnimatedIconStateChange {
  Target: object
  State: string
}

const states = new WeakMap<object, string>()
const objectListeners = new WeakMap<object, Set<(change: AnimatedIconStateChange) => void>>()

export const resolveAnimatedIconElement = (target: unknown): Element | null => {
  if (!target || typeof target !== 'object') return null
  if (typeof Element !== 'undefined' && target instanceof Element) return target
  const object = target as Record<string, unknown>
  for (const key of ['$el', 'Element', 'element', 'RootElement', 'rootElement', 'value']) {
    let candidate: unknown
    try { candidate = object[key] } catch { continue }
    if (!candidate || candidate === target) continue
    if (typeof Element !== 'undefined' && candidate instanceof Element) return candidate
    if (typeof candidate === 'object' && 'value' in candidate) {
      const element = (candidate as { value?: unknown }).value
      if (typeof Element !== 'undefined' && element instanceof Element) return element
    }
  }
  return null
}

export const GetState = (target: unknown): string => {
  if (!target || typeof target !== 'object') return ''
  const element = resolveAnimatedIconElement(target)
  const value = states.get(element ?? target)
  if (value !== undefined) return value
  if (element) return element.getAttribute('AnimatedIcon.State') ?? ''
  return states.get(target) ?? ''
}

export const SetState = (target: unknown, value: unknown): void => {
  if (!target || typeof target !== 'object') return
  const element = resolveAnimatedIconElement(target)
  const key = element ?? target
  const state = String(value ?? '')
  if (GetState(key) === state) return
  states.set(key, state)
  const change: AnimatedIconStateChange = { Target: key, State: state }
  objectListeners.get(key)?.forEach(listener => listener(change))
  if (element) {
    const EventType = element.ownerDocument.defaultView?.CustomEvent
    if (EventType) element.dispatchEvent(new EventType(animatedIconStateChangedEvent, { bubbles: true, detail: change }))
  }
}

export const findAnimatedIconStateAncestor = (target: unknown): Element | null => {
  let ancestor = resolveAnimatedIconElement(target)?.parentElement ?? null
  while (ancestor) {
    if (GetState(ancestor)) return ancestor
    ancestor = ancestor.parentElement
  }
  return null
}

export const subscribeAnimatedIconState = (target: unknown, listener: (change: AnimatedIconStateChange) => void): (() => void) => {
  if (!target || typeof target !== 'object') return () => undefined
  const element = resolveAnimatedIconElement(target)
  if (element) {
    const onChanged = (event: Event) => {
      const change = (event as CustomEvent<AnimatedIconStateChange>).detail
      if (change?.Target === element || resolveAnimatedIconElement(change?.Target)?.contains(element)) listener(change)
    }
    element.ownerDocument.addEventListener(animatedIconStateChangedEvent, onChanged, true)
    return () => element.ownerDocument.removeEventListener(animatedIconStateChangedEvent, onChanged, true)
  }
  let listeners = objectListeners.get(target)
  if (!listeners) {
    listeners = new Set()
    objectListeners.set(target, listeners)
  }
  listeners.add(listener)
  return () => listeners?.delete(listener)
}

export const AnimatedIcon = Object.freeze({ SetState, GetState })
export const AnimatedIconAPI = AnimatedIcon
