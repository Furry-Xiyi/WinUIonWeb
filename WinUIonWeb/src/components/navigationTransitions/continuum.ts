import { attachedElements, circleOut, exponentialIn, exponentialInOut, exponentialOut, page, planeProjection,
  quadraticOut, sampled, scale, transitionElement, translateY, tween,
  type NavigationPageStoryboard, type NavigationStoryboardPair, type NavigationStoryboardTarget,
  type NavigationTransitionStoryboard } from './shared'

/** ContinuumNavigationTransitionInfo::CreateStoryboards, ThemeTransitions.cpp:1826. */
export const createContinuumStoryboards = (backward: boolean): NavigationStoryboardPair => backward ? {
  Entrance: page([sampled('opacity', 0, 1, 350, circleOut, undefined, 267)], { opacity: 0 }),
  Exit: page([sampled('transform', 0, 200, 250, exponentialIn(6), translateY),
    tween('opacity', 1, 1, 240), tween('opacity', 1, 0, 10, 'linear', 240)], {})
} : {
  Entrance: page([sampled('transform', 0.9, 1, 350, circleOut, scale, 267),
    tween('opacity', 0, 0, 266), tween('opacity', 0, 1, 1, 'linear', 266)],
  { opacity: 0, transform: scale(0.9) }, '50% 50%'),
  Exit: page([tween('opacity', 1, 1, 120), sampled('opacity', 1, 0, 130, circleOut, undefined, 120)], {})
}

const targetStoryboard = (backward: boolean, incoming: boolean): NavigationPageStoryboard | null => {
  if (!incoming && backward) return null
  // PlaneProjection acts before the TransitionTarget scale and translation.
  // Center the camera independently, then rotate around the official pivot.
  // CSS individual scale/translate run after this projection, just as WinUI does.
  if (backward) return page([
    sampled('transform', 90, 0, 200, exponentialOut(4), value =>
      `translate(50%, 50%) ${planeProjection} translate(-50%, -50%) rotateX(${value}deg)`, 267),
    sampled('translate', -20, 0, 200, exponentialOut(4), value => `0 ${value}px`, 267),
    tween('opacity', 0, 0, 266), tween('opacity', 0, 1, 1, 'linear', 266)
  ], {}, '0% 0%')
  if (!incoming) return page([
    sampled('transform', 0, -80, 120, exponentialIn(2), value =>
      `translate(50%, -50%) ${planeProjection} translate(-50%, 50%) rotateX(${value}deg)`),
    sampled('translate', 0, 200, 120, exponentialIn(6), value => `0 ${value}px`),
    sampled('scale', 1, 1.5, 120, exponentialIn(6), value => String(value)),
    tween('opacity', 1, 1, 100), tween('opacity', 1, 0, 20, 'linear', 100)
  ], {}, '0% 100%')
  return page([
    sampled('transform', 50, 0, 350, quadraticOut, value =>
      `translate(50%, 50%) ${planeProjection} translate(-50%, 50%) rotateX(${value}deg) translateY(-100%)`, 267),
    sampled('translate', 200, -40, 100, exponentialOut(8), value => `0 ${value}px`, 267),
    sampled('translate', -40, 0, 250, exponentialInOut, value => `0 ${value}px`, 367),
    sampled('scale', 1.5, 1, 350, quadraticOut, value => String(value), 267),
    sampled('opacity', 0, 1, 167, exponentialOut(6), undefined, 267)
  ], {}, '0% 0%')
}

export const resolveContinuumStoryboards = (storyboard: NavigationTransitionStoryboard,
  root: HTMLElement, incoming: boolean): NavigationStoryboardTarget[] => {
  const result = [{ Element: root, Storyboard: incoming ? storyboard.Entrance : storyboard.Exit }]
  const target = incoming && !storyboard.IsBack
    ? attachedElements(root, 'ContinuumNavigationTransitionInfo.IsEntranceElement')[0]
    : transitionElement(storyboard.Info.ExitElement, root)
  const animation = targetStoryboard(storyboard.IsBack, incoming)
  if (target && animation) result.push({ Element: target, Storyboard: animation })
  return result
}
