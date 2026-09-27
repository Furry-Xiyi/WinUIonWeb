import { attachedElements, discreteOpacity, entranceSpline, exitSpline, page, translateY, tween,
  type NavigationStoryboardPair, type NavigationStoryboardTarget, type NavigationTransitionStoryboard } from './shared'

/** EntranceNavigationTransitionInfo::CreateStoryboards, ThemeTransitions.cpp:3141. */
export const createEntranceStoryboards = (backward: boolean): NavigationStoryboardPair => backward ? {
  Entrance: page([tween('opacity', 0, 1, 300, entranceSpline, 150)], { opacity: 0 }),
  Exit: page([tween('transform', translateY(0), translateY(140), 150, exitSpline), discreteOpacity(1, 0, 150)], {})
} : {
  Entrance: page([tween('transform', translateY(140), translateY(0), 300, entranceSpline, 150),
    discreteOpacity(0, 1, 150)], { opacity: 0, transform: translateY(140) }),
  Exit: page([tween('opacity', 1, 0, 150, exitSpline)], {})
}

export const resolveEntranceStoryboards = (storyboard: NavigationTransitionStoryboard,
  root: HTMLElement, incoming: boolean): NavigationStoryboardTarget[] => [{
  Element: attachedElements(root, 'EntranceNavigationTransitionInfo.IsTargetElement')[0] ?? root,
  Storyboard: incoming ? storyboard.Entrance : storyboard.Exit
}]
