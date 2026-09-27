<template>
  <div v-bind="attrs" ref="frameElement" class="win-frame" :style="[attrs.style, frameStyle]"><ContentOutlet /></div>
</template>

<script lang="ts">
import { FrameContentTransitions } from './NavigationTransitionProperties'
export default { ContentTransitions: FrameContentTransitions }
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, isVNode, markRaw, nextTick, onBeforeUnmount, onErrorCaptured, provide, ref, shallowReactive, shallowRef, Suspense, useAttrs, useSlots, watch, type Component, type PropType, type VNode } from 'vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { beginNavigationCommit, type FrameNavigationMode, type NavigationCommit } from './frameNavigationRuntime'
import { getNavigationTransitionStoryboard, resolveNavigationPageStoryboards, type NavigationTransitionStoryboard } from './navigationTransitionRuntime'
import { getFrameProperty, readFrameNavigationTransition } from './NavigationTransitionProperties'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, xamlNameScopeKey } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Content: { type: [String, Number, Object], default: null },
  ContentTransitions: { type: [String, Object, Array], default: null },
  IsNavigationStackEnabled: { type: [Boolean, String], default: true },
  Background: { type: [String, Object], default: '' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  Visibility: { type: String, default: 'Visible' }, Opacity: { type: [String, Number], default: 1 }
})
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
// Every navigated Page has its own XAML namescope. Repeated SourceElement
// names in different Frames must never overwrite the Gallery's controls.
provide(xamlNameScopeKey, shallowReactive<Record<string, unknown>>({}))
const emit = defineEmits(['update:Content', 'Navigating', 'Navigated', 'NavigationFailed', 'NavigationStopped'])
type NavigationEntry = { SourcePageType: Component; Parameter: unknown; NavigationTransitionInfo: unknown }
type NavigationLayer = { Entry: NavigationEntry; Version: number }
const currentEntry = shallowRef<NavigationEntry | null>(null)
const frameElement = ref<HTMLElement | null>(null)
const currentLayer = shallowRef<NavigationLayer | null>(null)
const outgoingLayer = shallowRef<NavigationLayer | null>(null)
const activeTimeline = shallowRef<NavigationTransitionStoryboard | null>(null)
const navigationAnimating = ref(false)
const navigationPreparing = ref(false)
const navigationAnimationStarted = ref(false)
const layerElements = new Map<number, HTMLElement>()
const layerPages = shallowReactive(new Map<number, unknown>())
let navigationAnimations: Animation[] = []
let navigationStyleRestorers: (() => void)[] = []
let transitionGeneration = 0
type PendingNavigationCommit = {
  Commit: NavigationCommit
  Version: number
  Args: { SourcePageType: Component; Parameter: unknown; NavigationTransitionInfo: unknown; NavigationMode: FrameNavigationMode; Cancel: boolean }
  DefaultNavigationTransitionInfoToStore: unknown
  Ready: boolean
  Previous: {
    Entry: NavigationEntry | null; Layer: NavigationLayer | null; Content: unknown
    BackStack: NavigationEntry[]; ForwardStack: NavigationEntry[]
  }
}
let pendingNavigationCommit: PendingNavigationCommit | null = null
let navigatedRedirectCapture: { Commit: NavigationCommit | null } | null = null
let frameUnmounted = false
let navigationCommitFrame = 0
const backStack = shallowRef<NavigationEntry[]>([])
const forwardStack = shallowRef<NavigationEntry[]>([])
const navigationVersion = ref(0)
const localContent = shallowRef<unknown>(resolveXamlValue(props.Content, instance))
const localNavigationStackEnabled = ref<boolean | undefined>(undefined)
const navigationStackEnabled = computed({
  get: () => localNavigationStackEnabled.value ?? resolveXamlValue(props.IsNavigationStackEnabled, instance) !== false,
  set: value => { localNavigationStackEnabled.value = value }
})
watch(() => resolveXamlValue(props.Content, instance), value => { localContent.value = value })
const content = computed({
  get: () => currentLayer.value ? layerPages.get(currentLayer.value.Version) ?? null : localContent.value,
  set: value => {
    clearNavigationTransition()
    currentEntry.value = null
    currentLayer.value = null
    localContent.value = value
    emit('update:Content', value)
  }
})
const canGoBack = computed(() => backStack.value.length > 0)
const canGoForward = computed(() => forwardStack.value.length > 0)
const frameStyle = computed(() => frameworkLayoutStyle(props, instance))
const navigationEvent = (name: 'Navigating' | 'Navigated' | 'NavigationFailed' | 'NavigationStopped', args: unknown) => {
  emit(name, publicApi, args)
  if (!instance?.vnode.props?.[`on${name}`]) resolveXamlHandler(attrs[name], instance)?.(publicApi, args)
}
const clearNavigationTransition = () => {
  if (navigationCommitFrame) cancelAnimationFrame(navigationCommitFrame)
  navigationCommitFrame = 0
  pendingNavigationCommit?.Commit.complete(false)
  pendingNavigationCommit = null
  transitionGeneration += 1
  for (const animation of navigationAnimations) animation.cancel()
  navigationAnimations = []
  for (const restore of navigationStyleRestorers) restore()
  navigationStyleRestorers = []
  outgoingLayer.value = null
  activeTimeline.value = null
  navigationAnimating.value = false
  navigationPreparing.value = false
  navigationAnimationStarted.value = false
}

const beginNavigationTransition = (generation: number, timeline: NavigationTransitionStoryboard) => {
  if (generation !== transitionGeneration || !currentLayer.value) return
  const incoming = layerElements.get(currentLayer.value.Version)
  const outgoing = outgoingLayer.value ? layerElements.get(outgoingLayer.value.Version) : null
  if (!incoming || typeof incoming.animate !== 'function') { clearNavigationTransition(); return }
  navigationAnimationStarted.value = true
  // Preparation is hidden. Clear its transform before measuring marked
  // target elements; the storyboards take over in this same animation frame.
  incoming.style.removeProperty('transform')
  incoming.style.removeProperty('opacity')
  const startPage = (element: HTMLElement, isIncoming: boolean) => {
    const pageAnimations: Animation[] = []
    for (const target of resolveNavigationPageStoryboards(timeline, element, isIncoming)) {
      if (target.Storyboard.TransformOrigin) {
        const previous = target.Element.style.transformOrigin
        target.Element.style.transformOrigin = target.Storyboard.TransformOrigin
        navigationStyleRestorers.push(() => { target.Element.style.transformOrigin = previous })
      }
      for (const track of target.Storyboard.Tracks) {
        const animation = target.Element.animate(track.Keyframes, { duration: track.Duration,
          delay: track.Delay ?? 0, easing: track.Easing ?? 'linear', fill: track.Fill ?? 'both' })
        pageAnimations.push(animation)
        navigationAnimations.push(animation)
      }
    }
    return pageAnimations
  }
  const entranceAnimations = startPage(incoming, true)
  const exitAnimations = outgoing ? startPage(outgoing, false) : []
  if (outgoing) void Promise.all(exitAnimations.map(animation => animation.finished)).then(() => {
    if (generation === transitionGeneration) outgoingLayer.value = null
  }, () => {})
  void Promise.all([...entranceAnimations, ...exitAnimations].map(animation => animation.finished)).then(() => {
    if (generation === transitionGeneration) clearNavigationTransition()
  }, () => {
    if (generation === transitionGeneration) clearNavigationTransition()
  })
}

const commitNavigation = (entry: NavigationEntry, mode: FrameNavigationMode, stackEnabled = navigationStackEnabled.value,
  transitionInfo = entry.NavigationTransitionInfo): boolean => {
  const args = { SourcePageType: entry.SourcePageType, Parameter: entry.Parameter,
    NavigationTransitionInfo: entry.NavigationTransitionInfo, NavigationMode: mode, Cancel: false }
  const commit = beginNavigationCommit(frameElement.value)
  const previousRedirectCommit = navigatedRedirectCapture?.Commit ?? null
  if (navigatedRedirectCapture) navigatedRedirectCapture.Commit = commit
  try {
    navigationEvent('Navigating', args)
    if (args.Cancel) {
      if (navigatedRedirectCapture?.Commit === commit) navigatedRedirectCapture.Commit = previousRedirectCommit
      navigationEvent('NavigationStopped', args)
      commit.complete(false)
      return false
    }
    const previous = currentEntry.value
    const previousLayer = currentLayer.value
    const previousState = { Entry: previous, Layer: previousLayer, Content: localContent.value,
      BackStack: backStack.value, ForwardStack: forwardStack.value }
    clearNavigationTransition()
    if (mode === 'New') {
      if (previous && stackEnabled) backStack.value = [...backStack.value, previous]
      forwardStack.value = []
    } else if (mode === 'Back') {
      backStack.value = backStack.value.slice(0, -1)
      if (previous) forwardStack.value = [...forwardStack.value, previous]
    } else {
      forwardStack.value = forwardStack.value.slice(0, -1)
      if (previous) backStack.value = [...backStack.value, previous]
    }
    currentEntry.value = entry
    localContent.value = entry.SourcePageType
    navigationVersion.value += 1
    currentLayer.value = { Entry: entry, Version: navigationVersion.value }
    const configured = readFrameNavigationTransition(slots.default?.() ?? [], instance, props.ContentTransitions)
    pendingNavigationCommit = { Commit: commit, Version: navigationVersion.value, Args: args, Ready: false, Previous: previousState,
      DefaultNavigationTransitionInfoToStore: transitionInfo == null ? configured.DefaultNavigationTransitionInfo : null }
    navigationPreparing.value = true
    outgoingLayer.value = previousLayer
    // Native Page navigation supplies an implicit NavigationThemeTransition
    // even with empty/non-navigation Frame.ContentTransitions. Its default
    // Entrance runs after the first history entry, or on Back; an explicit
    // NavigationThemeTransition or info override may also animate first load.
    const defaultTransitionEnabled = configured.Enabled || backStack.value.length > 0 || mode === 'Back'
    const timeline = getNavigationTransitionStoryboard(transitionInfo ?? configured.DefaultNavigationTransitionInfo,
      mode, defaultTransitionEnabled)
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (timeline && !reducedMotion) {
      activeTimeline.value = timeline
      navigationAnimating.value = true
    }
    emit('update:Content', entry.SourcePageType)
    return true
  } catch (error) {
    if (navigatedRedirectCapture?.Commit === commit) navigatedRedirectCapture.Commit = previousRedirectCommit
    commit.complete(false)
    const pending = pendingNavigationCommit
    if (pending?.Commit === commit) {
      clearNavigationTransition()
      currentEntry.value = pending.Previous.Entry
      currentLayer.value = pending.Previous.Layer
      localContent.value = pending.Previous.Content
      backStack.value = pending.Previous.BackStack
      forwardStack.value = pending.Previous.ForwardStack
      emit('update:Content', localContent.value)
    }
    navigationEvent('NavigationFailed', { SourcePageType: entry.SourcePageType, Exception: error, Handled: false })
    return false
  }
}
const navigationPageReady = (version: number) => {
  const pending = pendingNavigationCommit
  if (!pending || pending.Version !== version || pending.Ready) return
  pending.Ready = true
  void nextTick(() => {
    if (pendingNavigationCommit !== pending) return
    navigationPreparing.value = false
    if (!activeTimeline.value) outgoingLayer.value = null
    navigationCommitFrame = requestAnimationFrame(() => {
      navigationCommitFrame = 0
      if (pendingNavigationCommit !== pending || currentLayer.value?.Version !== version) return
      pendingNavigationCommit = null
      // Native NavigationThemeTransition stores its configured default on the
      // committed destination, so later Back uses that page's original motion.
      // Keep navigation event args as the caller's original override value.
      if (pending.DefaultNavigationTransitionInfoToStore != null && currentEntry.value) {
        currentEntry.value.NavigationTransitionInfo = pending.DefaultNavigationTransitionInfoToStore
      }
      try {
        if (activeTimeline.value) beginNavigationTransition(transitionGeneration, activeTimeline.value)
      } catch {
        clearNavigationTransition()
      }
      // Native Frame.Navigated runs after Page creation. Vue also needs its DOM
      // commit before NavigationView can measure and start its composition.
      const redirectCapture = { Commit: null as NavigationCommit | null }
      const previousCapture = navigatedRedirectCapture
      navigatedRedirectCapture = redirectCapture
      try {
        navigationEvent('Navigated', { ...pending.Args, Content: content.value })
      } finally {
        navigatedRedirectCapture = previousCapture
        // A synchronous Navigated redirect keeps the original selection transaction pending.
        if (redirectCapture.Commit) {
          void redirectCapture.Commit.completion.then(completed => {
            const retainedOriginalPage = currentEntry.value?.SourcePageType === pending.Args.SourcePageType &&
              Object.is(currentEntry.value?.Parameter, pending.Args.Parameter)
            pending.Commit.complete(!frameUnmounted && (completed || retainedOriginalPage))
          })
        } else {
          pending.Commit.complete(!frameUnmounted)
        }
      }
    })
  })
}
const navigate = (sourcePageType: Component, parameter: unknown = null, transitionInfo: unknown = null): boolean => {
  if (!sourcePageType || !['object', 'function'].includes(typeof sourcePageType)) return false
  return commitNavigation({ SourcePageType: markRaw(sourcePageType), Parameter: parameter,
    NavigationTransitionInfo: transitionInfo }, 'New')
}
const goBack = (transitionInfo?: unknown) => {
  const entry = backStack.value.at(-1)
  if (entry && transitionInfo != null && currentEntry.value) {
    currentEntry.value = { ...currentEntry.value, NavigationTransitionInfo: transitionInfo }
  }
  return entry ? commitNavigation(entry, 'Back', navigationStackEnabled.value,
    transitionInfo ?? currentEntry.value?.NavigationTransitionInfo ?? null) : false
}
const goForward = () => {
  const entry = forwardStack.value.at(-1)
  return entry ? commitNavigation(entry, 'Forward') : false
}
const navigateToType = (sourcePageType: Component, parameter: unknown = null,
  options: { TransitionInfoOverride?: unknown; IsNavigationStackEnabled?: boolean } = {}): boolean => {
  if (!sourcePageType || !['object', 'function'].includes(typeof sourcePageType)) return false
  return commitNavigation({ SourcePageType: markRaw(sourcePageType), Parameter: parameter,
    NavigationTransitionInfo: options.TransitionInfoOverride ?? null }, 'New',
    options.IsNavigationStackEnabled ?? navigationStackEnabled.value)
}
const publicApi = {
  get Content() { return content.value }, set Content(value: unknown) { content.value = value },
  get CanGoBack() { return canGoBack.value }, get CanGoForward() { return canGoForward.value },
  get BackStack() { return backStack.value }, get ForwardStack() { return forwardStack.value },
  get BackStackDepth() { return backStack.value.length },
  get CurrentSourcePageType() { return currentEntry.value?.SourcePageType ?? null },
  get IsNavigationStackEnabled() { return navigationStackEnabled.value },
  set IsNavigationStackEnabled(value: boolean) { navigationStackEnabled.value = value },
  Navigate: navigate, NavigateToType: navigateToType, GoBack: goBack, GoForward: goForward
}
// Each retained Page owns its namescope. Both pages are alive during the exit,
// so shared names such as SourceElement must not register into the same scope.
const NavigationPage = defineComponent({
  name: 'FrameNavigationPage',
  __scopeId: (instance?.type as { __scopeId?: string } | undefined)?.__scopeId,
  props: {
    Layer: { type: Object as PropType<NavigationLayer>, required: true },
    IsLeaving: { type: Boolean, default: false },
    IsAnimating: { type: Boolean, default: false },
    IsPreparing: { type: Boolean, default: false },
    Timeline: { type: Object as PropType<NavigationTransitionStoryboard | null>, default: null },
    IsStarted: { type: Boolean, default: false }
  },
  setup(layerProps) {
    provide(xamlNameScopeKey, shallowReactive<Record<string, unknown>>({}))
    const setPage = (page: unknown) => {
      if (page) layerPages.set(layerProps.Layer.Version, page)
      else layerPages.delete(layerProps.Layer.Version)
    }
    return () => {
      const layer = layerProps.Layer
      const pendingEntrance = layerProps.IsAnimating && !layerProps.IsLeaving && !layerProps.IsStarted && layerProps.Timeline
      const disablesHitTesting = layerProps.IsLeaving || (layerProps.IsAnimating && layerProps.Timeline?.DisableHitTesting)
      return h('div', {
        ref: (element: unknown) => {
          if (element instanceof HTMLElement) layerElements.set(layer.Version, element)
          else layerElements.delete(layer.Version)
        },
        class: ['win-frame-navigation-page', { 'is-leaving': layerProps.IsLeaving }],
        'aria-hidden': layerProps.IsLeaving || undefined,
        inert: disablesHitTesting || undefined,
        style: {
          pointerEvents: disablesHitTesting ? 'none' : undefined,
          ...(pendingEntrance ? layerProps.Timeline!.Entrance.InitialStyle : {}),
          ...(layerProps.IsPreparing ? { opacity: 0 } : {})
        }
      }, [h(Suspense, { onResolve: () => navigationPageReady(layer.Version) }, {
        default: () => h(layer.Entry.SourcePageType, {
          ref: setPage,
          Parameter: layer.Entry.Parameter,
          NavigationTransitionInfo: layer.Entry.NavigationTransitionInfo,
          NavigationVersion: layer.Version
        })
      })])
    }
  }
})
const ContentOutlet = defineComponent({
  setup() {
    return () => {
      if (currentLayer.value) {
        const layers = outgoingLayer.value ? [outgoingLayer.value, currentLayer.value] : [currentLayer.value]
        return h(Fragment, layers.map(layer => h(NavigationPage, {
          key: layer.Version, Layer: layer, IsLeaving: layer === outgoingLayer.value,
          IsAnimating: navigationAnimating.value, Timeline: activeTimeline.value,
          IsPreparing: navigationPreparing.value && layer === currentLayer.value,
          IsStarted: navigationAnimationStarted.value
        })))
      }
      const nodes = slots.default?.().filter(node => !getFrameProperty(node))
      if (nodes?.length) return h(Fragment, normalizeXamlNodes(nodes, instance))
      if (content.value === null || content.value === undefined) return null
      if (isVNode(content.value)) return normalizeXamlNodes([content.value as VNode], instance)
      return typeof content.value === 'object'
        ? h(content.value as Parameters<typeof h>[0])
        : String(content.value)
    }
  }
})
onBeforeUnmount(() => {
  frameUnmounted = true
  clearNavigationTransition()
  layerPages.clear()
})
onErrorCaptured(error => {
  const pending = pendingNavigationCommit
  if (!pending) return
  clearNavigationTransition()
  currentEntry.value = pending.Previous.Entry
  currentLayer.value = pending.Previous.Layer
  localContent.value = pending.Previous.Content
  backStack.value = pending.Previous.BackStack
  forwardStack.value = pending.Previous.ForwardStack
  emit('update:Content', localContent.value)
  const args = { SourcePageType: pending.Args.SourcePageType, Exception: error, Handled: false }
  navigationEvent('NavigationFailed', args)
  return args.Handled ? false : undefined
})
defineExpose(publicApi)
</script>

<style scoped>
.win-frame {
  position: relative;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  overflow: hidden;
}
.win-frame-navigation-page {
  min-width: 0;
  min-height: 0;
  grid-area: 1 / 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
}
.win-frame-navigation-page.is-leaving {
  position: absolute;
  inset: 0;
  z-index: 1;
}
</style>
