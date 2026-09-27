import { entranceSpline, opacitySpline, page, scale, tween, type NavigationStoryboardPair } from './shared'

/** DrillInNavigationTransitionInfo::CreateStoryboards, ThemeTransitions.cpp:2830. */
export const createDrillInStoryboards = (backward: boolean): NavigationStoryboardPair => {
  const incomingScale = backward ? 1.06 : 0.94
  const incomingDuration = backward ? 333 : 783
  const incomingSpline = backward ? 'cubic-bezier(0.12, 0, 0, 1)' : entranceSpline
  return {
    Entrance: page([tween('transform', scale(incomingScale), scale(1), incomingDuration, incomingSpline),
      tween('opacity', 0, 1, 333, opacitySpline)], { opacity: 0, transform: scale(incomingScale) }, '50% 50%'),
    Exit: page([tween('transform', scale(1), scale(backward ? 0.96 : 1.04), 100, entranceSpline),
      tween('opacity', 1, 0, 100, opacitySpline)], {}, '50% 50%')
  }
}
