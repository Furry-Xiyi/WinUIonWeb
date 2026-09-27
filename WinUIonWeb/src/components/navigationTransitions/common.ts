import { attachedElements, exponentialIn, exponentialOut, page, planeProjection, sampled, tween,
  type NavigationStoryboardPair, type NavigationStoryboardTarget, type NavigationTransitionStoryboard } from './shared'

const origin = '50% 50% 0px'
const turnstile = (value: number) =>
  `${planeProjection} translate3d(-60%, 0, -100px) rotateY(${value}deg) translate3d(60%, 0, 100px)`

/** CommonNavigationTransitionInfo::CreateStoryboards, ThemeTransitions.cpp:557. */
export const createCommonStoryboards = (backward: boolean): NavigationStoryboardPair => {
  // PlaneProjection and CSS rotateY use opposite rotation directions.
  const incomingAngle = backward ? -50 : 80
  const outgoingAngle = backward ? 80 : -50
  return {
    Entrance: page([sampled('transform', incomingAngle, 0, 428, exponentialOut(6), turnstile, 128),
      tween('opacity', 0, 0, 128), tween('opacity', 0, 1, 1, 'linear', 128)],
    { opacity: 0, transform: turnstile(incomingAngle) }, origin),
    Exit: page([sampled('transform', 0, outgoingAngle, 128, exponentialIn(6), turnstile),
      tween('opacity', 1, 1, 128), tween('opacity', 1, 0, 1, 'linear', 128)], {}, origin)
  }
}

export const resolveCommonStoryboards = (storyboard: NavigationTransitionStoryboard,
  root: HTMLElement, incoming: boolean): NavigationStoryboardTarget[] => {
  const source = incoming ? storyboard.Entrance : storyboard.Exit
  if (storyboard.Info.IsStaggeringEnabled !== true && storyboard.Info.IsStaggeringEnabled !== 'True') {
    return [{ Element: root, Storyboard: source }]
  }
  const bounds = root.getBoundingClientRect()
  const targets = attachedElements(root, 'CommonNavigationTransitionInfo.IsStaggerElement').filter(element => {
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0 && rect.left <= bounds.right && rect.right >= bounds.left && rect.top <= bounds.bottom && rect.bottom >= bounds.top
  })
  if (!targets.length) return [{ Element: root, Storyboard: source }]
  const incomingAngle = storyboard.IsBack ? -50 : 80
  const outgoingAngle = storyboard.IsBack ? 80 : -50
  const rootOpacity = source.Tracks.filter(track => 'opacity' in track.Keyframes[0]!)
  return [{ Element: root, Storyboard: page(rootOpacity, {}) }, ...targets.map((element, index) => {
    const start = incoming ? 64 + index * 33 : index * 33
    const end = incoming ? 278 + index * 33 : 64 + index * 33
    return { Element: element, Storyboard: page([
      // The official backward stagger entrance and forward stagger exit use
      // the unassigned outer easing pointer and therefore interpolate linearly.
      sampled('transform', incoming ? incomingAngle : 0, incoming ? 0 : outgoingAngle, end - start,
        incoming ? storyboard.IsBack ? value => value : exponentialOut(6)
          : storyboard.IsBack ? exponentialIn(6) : value => value, turnstile, start),
      tween('opacity', incoming ? 0 : 1, incoming ? 0 : 1, incoming ? start : end),
      tween('opacity', incoming ? 0 : 1, incoming ? 1 : 0, 1, 'linear', incoming ? start : end)
    ], {}, origin) }
  })]
}
