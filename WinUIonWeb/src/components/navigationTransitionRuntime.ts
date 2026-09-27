import type { FrameNavigationMode } from './frameNavigationRuntime'
import { createCommonStoryboards, resolveCommonStoryboards } from './navigationTransitions/common'
import { createContinuumStoryboards, resolveContinuumStoryboards } from './navigationTransitions/continuum'
import { createDrillInStoryboards } from './navigationTransitions/drillIn'
import { createEntranceStoryboards, resolveEntranceStoryboards } from './navigationTransitions/entrance'
import { createSlideStoryboards } from './navigationTransitions/slide'
import { createSuppressStoryboards } from './navigationTransitions/suppress'
import type { NavigationPageStoryboard, NavigationStoryboardPair, NavigationStoryboardTarget,
  NavigationTransitionStoryboard } from './navigationTransitions/shared'

export type { NavigationAnimationTrack, NavigationPageStoryboard, NavigationTransitionStoryboard } from './navigationTransitions/shared'

/** Each official NavigationTransitionInfo owns its own independent storyboards. */
export const getNavigationTransitionStoryboard = (value: unknown, mode: FrameNavigationMode,
  enabled = false): NavigationTransitionStoryboard | null => {
  const info = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const type = String(info.Type ?? (enabled ? 'EntranceNavigationTransitionInfo' : ''))
  const backward = mode === 'Back'
  let storyboards: NavigationStoryboardPair
  switch (type) {
    case 'SuppressNavigationTransitionInfo': return createSuppressStoryboards()
    case 'EntranceNavigationTransitionInfo': storyboards = createEntranceStoryboards(backward); break
    case 'SlideNavigationTransitionInfo': storyboards = createSlideStoryboards(backward, info); break
    case 'DrillInNavigationTransitionInfo': storyboards = createDrillInStoryboards(backward); break
    case 'CommonNavigationTransitionInfo': storyboards = createCommonStoryboards(backward); break
    case 'ContinuumNavigationTransitionInfo': storyboards = createContinuumStoryboards(backward); break
    default: return null
  }
  return { Type: type, ...storyboards, Info: info, IsBack: backward,
    DisableHitTesting: type === 'CommonNavigationTransitionInfo' || type === 'SlideNavigationTransitionInfo' || type === 'ContinuumNavigationTransitionInfo' }
}

/** Resolve official attached target properties after the new Page has mounted. */
export const resolveNavigationPageStoryboards = (storyboard: NavigationTransitionStoryboard,
  root: HTMLElement, incoming: boolean): NavigationStoryboardTarget[] => {
  switch (storyboard.Type) {
    case 'EntranceNavigationTransitionInfo': return resolveEntranceStoryboards(storyboard, root, incoming)
    case 'CommonNavigationTransitionInfo': return resolveCommonStoryboards(storyboard, root, incoming)
    case 'ContinuumNavigationTransitionInfo': return resolveContinuumStoryboards(storyboard, root, incoming)
    default: return [{ Element: root, Storyboard: incoming ? storyboard.Entrance : storyboard.Exit }]
  }
}

export const navigationStoryboardDuration = (source: NavigationPageStoryboard) => Math.max(0,
  ...source.Tracks.map(track => (track.Delay ?? 0) + track.Duration))
