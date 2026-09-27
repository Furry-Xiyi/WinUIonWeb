import { reactive, type UnwrapNestedRefs } from 'vue'

// Runtime contract shared by RefreshContainer and RefreshVisualizer.
//
// The official control set splits PullToRefresh across three collaborating
// objects, and this module keeps the same ownership on the web:
//
//   RefreshContainer            adapts a scroller into an IRefreshInfoProvider
//                               and re-raises the visualizer's RefreshRequested
//   IRefreshInfoProvider        publishes an interaction ratio plus an
//                               "interacting for refresh" flag and owns
//                               ExecutionRatio (RefreshInfoProviderImpl)
//   RefreshVisualizer           owns the RefreshVisualizerState machine and the
//                               three component-level animations
//
// The container publishes through RefreshContext; the visualizer registers a
// handle for it and, in the other direction, raises its own RefreshRequested so
// the container can take a deferral and re-raise it. That nesting is what keeps
// the indicator spinning for the whole of the user-supplied work.

export const refreshContextKey = Symbol('WinUIonWeb.refreshContext')

export type RefreshPullDirection = 'LeftToRight' | 'TopToBottom' | 'RightToLeft' | 'BottomToTop'

export type RefreshVisualizerOrientation =
  | 'Auto' | 'Normal' | 'Rotate90DegreesCounterclockwise' | 'Rotate270DegreesCounterclockwise'

export type RefreshVisualizerState = 'Idle' | 'Peeking' | 'Interacting' | 'Pending' | 'Refreshing'

export interface RefreshRequestedEventArgs {
  GetDeferral: () => { Complete: () => void }
}

export interface RefreshStateChangedEventArgs {
  OldState: RefreshVisualizerState
  NewState: RefreshVisualizerState
}

// RefreshInfoProviderImpl.h: DEFAULT_EXECUTION_RATIO.
export const DEFAULT_EXECUTION_RATIO = 0.8

// RefreshVisualizer.cpp: no info provider means nothing has told the visualizer
// where the execution threshold sits, so it falls back to 1.0.
export const FALLBACK_EXECUTION_RATIO = 1.0

// RefreshContainer.cpp: DEFAULT_PULL_DIMENSION_SIZE. The default visualizer is
// given this dimension along the pull axis, and the adapter normalises the
// interaction ratio by it.
export const DEFAULT_PULL_DIMENSION_SIZE = 100

// ScrollViewerIRefreshInfoProviderAdapter.cpp: INITIAL_OFFSET_THRESHOLD. A pull
// only starts while the scroller is still parked at the edge it refreshes from.
export const INITIAL_OFFSET_THRESHOLD = 1.0

// ScrollViewerIRefreshInfoProviderDefaultAnimationHandler.cpp:
// REFRESH_ANIMATION_DURATION and REFRESH_VISUALIZER_OVERPAN_RATIO.
export const REFRESH_ANIMATION_DURATION = 100
export const REFRESH_VISUALIZER_OVERPAN_RATIO = 0.4

export const isVerticalPull = (direction: RefreshPullDirection) =>
  direction === 'TopToBottom' || direction === 'BottomToTop'

/** Pull directions whose content travels along the negative axis. */
export const isFarPull = (direction: RefreshPullDirection) =>
  direction === 'BottomToTop' || direction === 'RightToLeft'

export const isVerticalOrientation = (orientation: RefreshVisualizerOrientation, direction: RefreshPullDirection) => {
  if (orientation === 'Normal') return true
  if (orientation === 'Rotate90DegreesCounterclockwise' || orientation === 'Rotate270DegreesCounterclockwise') return false
  return isVerticalPull(direction)
}

/**
 * Raise a RefreshRequested event with the official deferral accounting.
 *
 * RefreshVisualizer::RaiseRefreshRequested and
 * RefreshContainer::RaiseRefreshRequested both wrap a single Deferral in a
 * RefreshRequestedEventArgs that counts the deferrals handlers take. They
 * increment the count before dispatching and decrement it afterwards, so a
 * handler that never asks for a deferral lets the refresh finish as soon as the
 * event returns, while any handler holding one keeps the refresh running until
 * every deferral is released. Each deferral can only be released once.
 */
export const raiseRefreshRequested = (
  dispatch: (args: RefreshRequestedEventArgs) => void,
  onCompleted: () => void
) => {
  let deferralCount = 1
  let completed = false

  const release = () => {
    deferralCount -= 1
    if (deferralCount > 0 || completed) return
    completed = true
    onCompleted()
  }

  const args: RefreshRequestedEventArgs = {
    GetDeferral: () => {
      deferralCount += 1
      let released = false
      return {
        Complete: () => {
          if (released) return
          released = true
          release()
        }
      }
    }
  }

  try {
    dispatch(args)
  } finally {
    release()
  }
}

export interface RefreshVisualizerHandle {
  readonly publicInstance: unknown
  /** IRefreshInfoProvider.InteractionRatioChanged. */
  setInteractionRatio: (ratio: number) => void
  /** IRefreshInfoProvider.IsInteractingForRefreshChanged. */
  setIsInteractingForRefresh: (value: boolean) => void
  /** IRefreshVisualizerPrivate.SetInternalPullDirection. */
  setInternalPullDirection: (direction: RefreshPullDirection) => void
  RequestRefresh: () => void
}

export interface RefreshContext extends UnwrapNestedRefs<{
  pullDirection: RefreshPullDirection
  /** RefreshVisualizer.State; the container reads it to place its presenter. */
  state: RefreshVisualizerState
  /** IRefreshInfoProvider.ExecutionRatio; the container is the provider. */
  executionRatio: number
  /** Size of the visualizer along the pull axis, in pixels. */
  visualizerSize: number
  /** Size of the visualizer's root, used by the icon's parallax translation. */
  visualizerRootSize: number
  /** Registered by the mounted visualizer; null while it is absent. */
  visualizerHandle: RefreshVisualizerHandle | null
}> {
  /** IRefreshInfoProvider.InteractionRatioChanged. */
  publishInteractionRatio: (ratio: number) => void
  /** IRefreshInfoProvider.IsInteractingForRefreshChanged. */
  publishIsInteractingForRefresh: (value: boolean) => void
  /**
   * RefreshContainer::OnVisualizerRefreshRequested. The visualizer raises its
   * own RefreshRequested and the container, having subscribed, takes a deferral
   * on it before re-raising to its own handlers.
   */
  containerRefreshRequested: ((args: RefreshRequestedEventArgs) => void) | null
  /** Notifies the container that the visualizer's state changed. */
  containerStateChanged: ((oldState: RefreshVisualizerState, newState: RefreshVisualizerState) => void) | null
}

export const createRefreshContext = (
  options: { pullDirection?: RefreshPullDirection; executionRatio?: number } = {}
): RefreshContext => {
  const context = reactive({
    pullDirection: options.pullDirection ?? 'TopToBottom',
    state: 'Idle' as RefreshVisualizerState,
    executionRatio: options.executionRatio ?? FALLBACK_EXECUTION_RATIO,
    visualizerSize: DEFAULT_PULL_DIMENSION_SIZE,
    visualizerRootSize: DEFAULT_PULL_DIMENSION_SIZE,
    visualizerHandle: null as RefreshVisualizerHandle | null
  }) as RefreshContext

  context.publishInteractionRatio = (ratio) => {
    context.visualizerHandle?.setInteractionRatio(ratio)
  }
  context.publishIsInteractingForRefresh = (value) => {
    context.visualizerHandle?.setIsInteractingForRefresh(value)
  }
  context.containerRefreshRequested = null
  context.containerStateChanged = null

  return context
}

export const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum)
