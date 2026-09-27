export type NavigationAnimationTrack = {
  Keyframes: Keyframe[]
  Duration: number
  Delay?: number
  Easing?: string
  Fill?: FillMode
}
export type NavigationPageStoryboard = {
  Tracks: NavigationAnimationTrack[]
  InitialStyle: Record<string, string | number>
  TransformOrigin?: string
}
export type NavigationTransitionStoryboard = {
  Type: string
  Entrance: NavigationPageStoryboard
  Exit: NavigationPageStoryboard
  Info: Record<string, unknown>
  IsBack: boolean
  DisableHitTesting: boolean
}
export type NavigationStoryboardPair = {
  Entrance: NavigationPageStoryboard
  Exit: NavigationPageStoryboard
}
export type NavigationStoryboardTarget = {
  Element: HTMLElement
  Storyboard: NavigationPageStoryboard
}

export const entranceSpline = 'cubic-bezier(0.1, 0.9, 0.2, 1)'
export const exitSpline = 'cubic-bezier(0.7, 0, 1, 0.5)'
export const opacitySpline = 'cubic-bezier(0.17, 0.17, 0, 1)'
export const exponentialIn = (exponent: number) => (progress: number) => Math.expm1(exponent * progress) / Math.expm1(exponent)
export const exponentialOut = (exponent: number) => (progress: number) => 1 - exponentialIn(exponent)(1 - progress)
export const exponentialInOut = (progress: number) => progress < 0.5
  ? exponentialIn(0.75)(progress * 2) / 2 : 1 - exponentialIn(0.75)((1 - progress) * 2) / 2
export const circleOut = (progress: number) => Math.sqrt(1 - (progress - 1) ** 2)
export const quadraticOut = (progress: number) => 1 - (1 - progress) ** 2

export const tween = (property: string, from: string | number, to: string | number, duration: number,
  easing = 'linear', delay = 0): NavigationAnimationTrack => ({
  Keyframes: [{ [property]: from }, { [property]: to }], Duration: duration, Delay: delay, Easing: easing
})
export const sampled = (property: string, from: number, to: number, duration: number,
  curve: (progress: number) => number, format: (value: number) => string | number = value => value,
  delay = 0, intervals = Math.max(1, Math.ceil(duration))): NavigationAnimationTrack => ({
  // Sample WinUI easing functions at one millisecond intervals, including
  // projection rotations that CSS cubic beziers cannot represent.
  Keyframes: Array.from({ length: intervals + 1 }, (_, index) => {
    const progress = index / intervals
    return { offset: progress, [property]: format(from + (to - from) * curve(progress)) }
  }), Duration: duration, Delay: delay, Easing: 'linear'
})
export const discreteOpacity = (from: number, to: number, time: number) => tween('opacity', from, to, time, 'steps(1, end)')
export const page = (tracks: NavigationAnimationTrack[], initialStyle: Record<string, string | number>,
  origin?: string): NavigationPageStoryboard => {
  const properties = new Set<string>()
  for (const track of tracks) {
    const property = Object.keys(track.Keyframes[0] ?? {}).find(key => key !== 'offset')
    if (property && properties.has(property)) track.Fill = 'forwards'
    if (property) properties.add(property)
  }
  return { Tracks: tracks, InitialStyle: initialStyle, TransformOrigin: origin }
}
export const scale = (value: number) => `scale(${value})`
export const translateY = (value: number) => `translateY(${value}px)`

// PlaneProjection's camera is centered independently of its rotation pivot.
// Native near/far planes are 1/1001, with camera Z -999. Keeping Z invertible
// lets CSS interpolate the rotations while flat composition preserves XY.
export const planeProjection =
  `matrix3d(${1000 / 999}, 0, 0, 0, 0, ${1000 / 999}, 0, 0, 0, 0, 1, ${-1 / 999}, 0, 0, 0, 1)`

const boolAttribute = (element: Element, name: string) => ['true', 'True'].includes(element.getAttribute(name) ?? '')
export const attachedElements = (root: HTMLElement, property: string) => Array.from(root.querySelectorAll<HTMLElement>('*'))
  .filter(element => boolAttribute(element, property))
export const transitionElement = (value: unknown, root: HTMLElement): HTMLElement | null => {
  const candidate = value instanceof HTMLElement ? value
    : value && typeof value === 'object' ? (value as { $el?: HTMLElement; Element?: HTMLElement }).$el
      ?? (value as { Element?: HTMLElement }).Element : null
  return candidate instanceof HTMLElement && root.contains(candidate) ? candidate : null
}
