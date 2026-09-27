/**
 * SlideNavigationTransitionInfo::CreateStoryboards in
 * WinUI-Reference/dxaml/phone/lib/ThemeTransitions.cpp. The opacity keyframes
 * are discrete; only the translation interpolates. The incoming storyboard
 * starts with the outgoing storyboard and holds for its first 150 ms.
 */
import { shallowRef } from 'vue'

export type FrameNavigationMode = 'New' | 'Back' | 'Forward'

export const navigationInputFrozen = shallowRef(false)

type NavigationInputRoot = { Element: HTMLElement; WasInert: boolean; Busy: string | null; Count: number }
const inputRoots = new Map<HTMLElement, NavigationInputRoot>()
const inputEvents = ['pointerdown', 'pointerup', 'pointermove', 'mousedown', 'mouseup', 'mousemove', 'click', 'dblclick', 'contextmenu',
  'keydown', 'keyup', 'wheel', 'touchstart', 'touchmove', 'dragstart', 'dragover', 'drop']
let inputLockCount = 0
const blockNavigationInput = (event: Event) => {
  if (event.cancelable) event.preventDefault()
  event.stopImmediatePropagation()
}

export const acquireNavigationInputLock = (element?: HTMLElement | null): (() => void) => {
  if (typeof document === 'undefined') return () => {}
  const application = document.getElementById('app') ?? element ?? document.body
  if (!application) return () => {}
  let root = inputRoots.get(application)
  if (!root) {
    root = { Element: application, WasInert: application.hasAttribute('inert'), Busy: application.getAttribute('aria-busy'), Count: 0 }
    inputRoots.set(application, root)
  }
  root.Count += 1
  application.setAttribute('inert', '')
  application.setAttribute('aria-busy', 'true')
  if (inputLockCount++ === 0) {
    for (const type of inputEvents) window.addEventListener(type, blockNavigationInput, { capture: true, passive: false })
    navigationInputFrozen.value = true
  }
  let released = false
  return () => {
    if (released) return
    released = true
    root!.Count -= 1
    if (!root!.Count) {
      application.toggleAttribute('inert', root!.WasInert)
      if (root!.Busy === null) application.removeAttribute('aria-busy')
      else application.setAttribute('aria-busy', root!.Busy)
      inputRoots.delete(application)
    }
    if (--inputLockCount === 0) {
      for (const type of inputEvents) window.removeEventListener(type, blockNavigationInput, true)
      navigationInputFrozen.value = false
    }
  }
}

export type NavigationCommit = { kind: 'Frame' | 'Route'; completion: Promise<boolean>; complete: (navigated: boolean) => void }
const commitCaptures: Array<NavigationCommit[]> = []
const pendingCommits = new Set<NavigationCommit>()
export const pendingNavigationCompletion = (): Promise<boolean> => Promise.all(
  [...pendingCommits].map(commit => commit.completion)
).then(results => results.every(Boolean))

export const pendingRouteNavigationCompletion = (): Promise<boolean> => Promise.all(
  [...pendingCommits].filter(commit => commit.kind === 'Route').map(commit => commit.completion)
).then(results => results.every(Boolean))

export const hasPendingRouteNavigation = (): boolean => [...pendingCommits].some(commit => commit.kind === 'Route')

export const beginNavigationCommit = (element?: HTMLElement | null, kind: NavigationCommit['kind'] = 'Frame'): NavigationCommit => {
  const release = acquireNavigationInputLock(element)
  let resolveCompletion!: (navigated: boolean) => void
  let completed = false
  const commit: NavigationCommit = {
    kind,
    completion: new Promise<boolean>(resolve => { resolveCompletion = resolve }),
    complete: navigated => {
      if (completed) return
      completed = true
      pendingCommits.delete(commit)
      resolveCompletion(navigated)
      release()
    }
  }
  pendingCommits.add(commit)
  for (const capture of commitCaptures) capture.push(commit)
  return commit
}

// Capture synchronous Frame.Navigate/Router calls without adding a public XAML API.
export const captureFrameNavigationCommit = <T>(action: () => T): {
  result: T; hasRouteNavigation: boolean; completion: Promise<boolean>; release: () => void
} => {
  const captured: NavigationCommit[] = []
  const release = acquireNavigationInputLock()
  commitCaptures.push(captured)
  try {
    const result = action()
    return { result, hasRouteNavigation: captured.some(commit => commit.kind === 'Route'),
      completion: Promise.all(captured.map(commit => commit.completion)).then(results => results.every(Boolean)), release }
  } catch (error) {
    release()
    throw error
  } finally {
    commitCaptures.pop()
  }
}

export interface SlideNavigationTimeline {
  Axis: 'X' | 'Y'
  ExitOffset: number
  EntranceOffset: number
  ExitDuration: number
  EntranceDelay: number
  EntranceDuration: number
  ExitEasing: string
  EntranceEasing: string
}

export const getSlideNavigationTimeline = (info: unknown, mode: FrameNavigationMode): SlideNavigationTimeline | null => {
  if (!info || typeof info !== 'object') return null
  const transition = info as { Type?: string; Effect?: string }
  if (transition.Type !== 'SlideNavigationTransitionInfo') return null
  if (transition.Effect !== 'FromLeft' && transition.Effect !== 'FromRight') return null
  const factor = transition.Effect === 'FromLeft' ? 1 : -1
  const backward = mode === 'Back'
  return {
    Axis: 'X',
    ExitOffset: (backward ? -200 : 150) * factor,
    EntranceOffset: (backward ? 150 : -200) * factor,
    ExitDuration: 150,
    EntranceDelay: 150,
    EntranceDuration: 300,
    ExitEasing: 'cubic-bezier(0.7, 0, 1, 0.5)',
    EntranceEasing: 'cubic-bezier(0.1, 0.9, 0.2, 1)'
  }
}
