import { discreteOpacity, entranceSpline, exitSpline, exponentialIn, exponentialOut, page, sampled, translateY, tween,
  type NavigationStoryboardPair } from './shared'

/** SlideNavigationTransitionInfo::CreateStoryboards, ThemeTransitions.cpp:1515. */
export const createSlideStoryboards = (backward: boolean, info: Record<string, unknown>): NavigationStoryboardPair => {
  if (info.Effect === 'FromLeft' || info.Effect === 'FromRight') {
    const factor = info.Effect === 'FromLeft' ? 1 : -1
    const incomingOffset = (backward ? 150 : -200) * factor
    const outgoingOffset = (backward ? -200 : 150) * factor
    const transform = (value: number) => `translateX(${value}px)`
    return {
      Entrance: page([tween('transform', transform(incomingOffset), transform(0), 300, entranceSpline, 150),
        discreteOpacity(0, 1, 150)], { opacity: 0, transform: transform(incomingOffset) }),
      Exit: page([tween('transform', transform(0), transform(outgoingOffset), 150, exitSpline), discreteOpacity(1, 0, 150)], {})
    }
  }
  return backward ? {
    Entrance: page([discreteOpacity(0, 1, 250)], { opacity: 0 }),
    Exit: page([sampled('transform', 0, 200, 600, exponentialIn(6), translateY), discreteOpacity(1, 0, 250)], {})
  } : {
    Entrance: page([sampled('transform', 200, 0, 350, exponentialOut(6), translateY, 250),
      discreteOpacity(0, 1, 250)], { opacity: 0, transform: translateY(200) }),
    Exit: page([discreteOpacity(1, 0, 250)], {})
  }
}
