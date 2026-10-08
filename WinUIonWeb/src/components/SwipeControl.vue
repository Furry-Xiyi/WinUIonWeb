<template>
  <div
    ref="root"
    v-bind="attrs"
    class="win-swipe-control"
    data-part="RootGrid"
    :class="{ interacting, open, 'threshold-reached': thresholdReached }"
    :style="rootStyle"
    :aria-label="automationName || undefined"
    :aria-disabled="!enabled || undefined"
    :tabindex="tabStop ? 0 : -1"
    @pointerdown="pointerDown"
    @pointermove="pointerMove"
    @pointerup="pointerUp"
    @pointercancel="pointerCancel"
    @lostpointercapture="captureLost"
    @click.capture="suppressClick"
    @contextmenu="contextRequested"
    @pointerenter="emit('PointerEntered', exposed, $event)"
    @pointerleave="emit('PointerExited', exposed, $event)">
    <div class="swipe-content-root" data-part="SwipeContentRoot" :style="underlayStyle"
      :class="[`side-${side?.toLowerCase()}`, `mode-${mode.toLowerCase()}`]">
      <div ref="panel" class="swipe-items-panel" data-part="SwipeContentStackPanel" :style="panelStyle">
        <button v-for="(item, index) in currentItems" :key="index" class="swipe-item"
          data-control="AppBarButton" data-style="SwipeItemStyle" data-part="Root"
          type="button" :style="itemStyle(item)" :disabled="!itemEnabled(item)"
          :tabindex="open ? 0 : -1" :aria-label="itemLabel(item) || undefined"
          :tooltipservice.tooltip="itemDescription(item) || undefined"
          @pointerdown.stop="itemPointerDown" @pointermove="itemPointerMove" @pointerup="itemPointerUp"
          @pointercancel="itemPointerCancel" @lostpointercapture="itemPointerCaptureLost"
          @click.stop="itemClicked(item, $event)">
          <div class="swipe-item-content" data-part="ContentRoot">
            <div class="swipe-item-viewbox">
              <span v-if="iconUri(item)" class="swipe-item-bitmap" :style="bitmapStyle(item)" aria-hidden="true" />
              <span v-else-if="iconGlyph(item)" class="swipe-item-icon" :style="iconStyle(item)" aria-hidden="true">{{ iconGlyph(item) }}</span>
            </div>
            <span class="swipe-item-text" data-part="TextLabel">{{ itemLabel(item) }}</span>
          </div>
        </button>
      </div>
    </div>
    <div ref="contentRoot" class="swipe-control-content" data-part="ContentRoot" :style="contentTransform">
      <div class="swipe-content-presenter" data-part="ContentPresenter" :style="presenterStyle"
        :inert="!enabled"><ContentOutlet /></div>
      <div class="swipe-input-eater" data-part="InputEater" :style="inputEaterStyle" aria-hidden="true"
        @click.stop="dismiss" />
    </div>
  </div>
</template>

<script lang="ts">
import { swipeControlProperties } from './SwipeControlProperties'
export default { ...swipeControlProperties }
</script>

<script setup lang="ts">
import {
  cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode,
  nextTick, onBeforeUnmount, onMounted, provide, ref, toRaw, unref, useAttrs, useSlots, watch,
  type CSSProperties, type VNode
} from 'vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { cssLength, xamlThickness } from './layout'
import { xamlResourceDictionaryKey } from './Page.vue'
import {
  materializeXamlVNode, normalizeXamlNodes, resolveXamlResourceObject, resolveXamlValue,
  xamlControlIdentityKey, xamlItemContextKey
} from './xamlRuntime'
import {
  createSwipeItemReader, readSwipeItems, swipeBrush, swipeChildren, swipeNodeName,
  swipeNodes, swipeProperty
} from './SwipeControlProperties'
import { BrowserSwipeInteractionTracker, type SwipeTrackerBounds } from './swipeInteractionTracker'
import { observeSwipeItemsChanging, SwipeItemsCollection } from './SwipeItemsCollection'
import { swipeControlResources } from './swipeControlResources'
import { symbolGlyphs } from './symbolGlyphs'
import type { SwipeControlApi, SwipeItem, SwipeItems, SwipeSide } from './SwipeControl.types'
import type { UICommandMetadata } from './uiCommandRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  LeftItems: { type: [Object, String], default: undefined },
  RightItems: { type: [Object, String], default: undefined },
  TopItems: { type: [Object, String], default: undefined },
  BottomItems: { type: [Object, String], default: undefined },
  Content: { default: undefined },
  ContentTemplate: { default: undefined },
  DataContext: { default: undefined },
  Background: { type: [Object, String], default: 'Transparent' },
  BorderBrush: { type: [Object, String], default: 'Transparent' },
  BorderThickness: { type: [Number, String], default: 0 },
  CornerRadius: { type: [Number, String], default: 0 },
  Padding: { type: [Number, String], default: 0 },
  Margin: { type: [Number, String], default: 0 },
  Width: { type: [Number, String], default: '' },
  Height: { type: [Number, String], default: '' },
  MinWidth: { type: [Number, String], default: 88 },
  MinHeight: { type: [Number, String], default: 40 },
  MaxWidth: { type: [Number, String], default: '' },
  MaxHeight: { type: [Number, String], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' },
  IsEnabled: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: false },
  Visibility: { type: String, default: 'Visible' },
  'AutomationProperties.Name': { type: String, default: '' }
})
const emit = defineEmits(['PointerEntered', 'PointerExited', 'ContextRequested'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const dictionary = inject<Record<string, VNode>>(xamlResourceDictionaryKey, {})
const itemContext = inject<unknown>(xamlItemContextKey, undefined)
const assignments = new Map<string, unknown>()
const revision = ref(0)
const commandRevision = ref(0)
const dataContext = computed(() => {
  revision.value
  if (assignments.has('DataContext')) return assignments.get('DataContext')
  const value = resolveXamlValue(props.DataContext, instance)
  return value === undefined ? unref(itemContext) : value
})
const bindingScope = () => {
  const context = dataContext.value
  return {
    ...(context && typeof context === 'object' ? context : {}),
    item: context,
    Item: context,
    DataContext: context
  }
}
const resolve = (value: unknown) => resolveXamlValue(value, instance, bindingScope())
const readProperty = (name: keyof typeof props): unknown => {
  revision.value
  return assignments.has(name) ? assignments.get(name) : resolve(props[name])
}
const isTrue = (value: unknown) => value === true || String(value).toLowerCase() === 'true'
const enabled = computed(() => isTrue(readProperty('IsEnabled')))
const tabStop = computed(() => isTrue(readProperty('IsTabStop')))
const automationName = computed(() => readProperty('AutomationProperties.Name') as string | undefined)
const nodes = computed(() => swipeNodes(slots.default?.() ?? []))
const contentNodes = computed(() => {
  const property = nodes.value.find(node => swipeProperty(node) === 'Content')
  return property ? swipeChildren(property) : nodes.value.filter(node => !swipeProperty(node))
})
const contentText = ref<string>()
const contentTemplate = computed(() => {
  const property = nodes.value.find(node => swipeProperty(node) === 'ContentTemplate')
  if (property && !assignments.has('ContentTemplate') && props.ContentTemplate === undefined) {
    return swipeChildren(property)[0]
  }
  const source = assignments.has('ContentTemplate')
    ? assignments.get('ContentTemplate') : props.ContentTemplate
  const key = staticResourceKey(source)
  return key ? dictionary[key] ?? resolveXamlResourceObject(key, instance) : resolve(source)
})
const contentApi = {
  get Text() {
    return contentText.value ?? resolve(contentNodes.value[0]?.props?.Text)
  },
  set Text(value: unknown) {
    contentText.value = String(value ?? '')
  },
  get Element() {
    return contentRoot.value?.querySelector('[data-part="ContentPresenter"]')?.firstElementChild
  }
}
const ContentOutlet = defineComponent({
  name: 'SwipeControlContentPresenter',
  setup() {
    const outletInstance = getCurrentInstance()
    const templateContext = computed(() => {
      const value = readProperty('Content')
      return value === undefined ? dataContext.value : value
    })
    provide(xamlItemContextKey, templateContext)

    return () => {
      const value = readProperty('Content')
      const template = contentTemplate.value
      if (isVNode(template) && swipeNodeName(template) === 'DataTemplate') {
        const children = materializeXamlVNode(swipeChildren(template), templateContext.value, instance) as VNode[]
        return h(Fragment, normalizeXamlNodes(children, outletInstance))
      }
      if (value !== undefined) {
        if (isVNode(value)) return normalizeXamlNodes([cloneVNode(value)], outletInstance)
        if (value === null || typeof value === 'object') return ''
        return String(value)
      }

      const children = contentNodes.value.map((node, index) => {
        const clone = cloneVNode(node)
        if (contentText.value !== undefined && index === 0) {
          clone.props = { ...clone.props, Text: contentText.value }
        }
        return clone
      })
      const context = dataContext.value
      const materialized = context === undefined ? children
        : materializeXamlVNode(children, context, instance) as VNode[]
      return normalizeXamlNodes(materialized, outletInstance)
    }
  }
})
const readItem = createSwipeItemReader(instance)
const resourceItemSources = new Map<string, string>()
const scopedItemNode = (node: VNode): VNode => {
  const clone = cloneVNode(node)
  clone.props = Object.fromEntries(Object.entries(node.props ?? {}).map(([name, value]) => [
    name,
    typeof value === 'string' && /^\{\s*(x:Bind|Binding)\b/.test(value) ? resolve(value) : value
  ]))
  const children = swipeChildren(node).map(scopedItemNode)
  if (children.length) clone.children = { default: () => children }
  return clone
}
function staticResourceKey(value: unknown) {
  return typeof value === 'string'
    ? value.match(/^\{\s*StaticResource\s+([^}]+)\}$/)?.[1]?.trim() : undefined
}
const materializedResourceItem = (node: VNode, identity: string) => {
  const item = readItem(dataContext.value === undefined ? node : scopedItemNode(node), identity)
  const key = staticResourceKey(node.props?.IconSource)
  const iconNode = key && dictionary[key]
  if (iconNode) {
    const iconValue = Object.fromEntries(Object.entries(iconNode.props ?? {})
      .filter(([name]) => !name.startsWith('x:'))
      .map(([name, value]) => [name, resolve(value)]))
    const signature = JSON.stringify([key, iconValue])
    const sourceKey = `${identity}:IconSource`
    if (resourceItemSources.get(sourceKey) !== signature) {
      item.IconSource = iconValue
      resourceItemSources.set(sourceKey, signature)
    }
  }
  for (const name of ['Background', 'Foreground'] as const) {
    const brushKey = staticResourceKey(node.props?.[name])
    const brushNode = brushKey && dictionary[brushKey]
    if (!brushNode) continue
    const value = swipeBrush(brushNode, instance)
    const signature = JSON.stringify([brushKey, value])
    const sourceKey = `${identity}:${name}`
    if (resourceItemSources.get(sourceKey) !== signature) {
      item[name] = value
      resourceItemSources.set(sourceKey, signature)
    }
  }
  return item
}
const collections = computed(() => {
  const result: Partial<Record<SwipeSide, SwipeItems>> = {}
  for (const side of ['Left', 'Right', 'Top', 'Bottom'] as const) {
    const name = `${side}Items` as keyof typeof props
    const property = nodes.value.find(node => swipeProperty(node) === name)
    const raw = assignments.has(name) ? assignments.get(name) : props[name]
    const resourceKey = staticResourceKey(raw)
    const resource = resourceKey ? dictionary[resourceKey] : undefined
    const objectNode = assignments.has(name) || raw !== undefined
      ? resource : property ? swipeChildren(property)[0] : undefined
    const collection = objectNode && swipeNodeName(objectNode) === 'SwipeItems'
      ? readSwipeItems(objectNode, side, instance, materializedResourceItem)
      : (resourceKey ? resolveXamlResourceObject(resourceKey, instance) : readProperty(name)) as SwipeItems | undefined
    if (collection === null || collection === undefined) continue
    if (!(collection instanceof SwipeItemsCollection)) {
      throw new TypeError('SwipeControl item properties require a SwipeItems collection.')
    }
    result[side] = collection
  }
  if ((result.Left?.Size || result.Right?.Size) && (result.Top?.Size || result.Bottom?.Size)) {
    throw new Error('SwipeControl cannot mix horizontal and vertical SwipeItems.')
  }
  return result
})
const root = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const contentRoot = ref<HTMLElement>()
const width = ref(0)
const height = ref(0)
const panelExtent = ref(0)
const side = ref<SwipeSide>()
const offset = ref(0)
const open = ref(false)
const interacting = ref(false)
const phase = ref<'idle' | 'opening' | 'closing'>('idle')
const activeCollection = computed(() => side.value ? collections.value[side.value] : undefined)
const mode = computed(() => activeCollection.value?.Mode ?? 'Reveal')
const currentItems = computed(() => activeCollection.value ? Array.from(activeCollection.value) : [])
const horizontal = computed(() => !collections.value.Top?.Size && !collections.value.Bottom?.Size)
const extent = computed(() => {
  if (mode.value === 'Execute') return horizontal.value ? width.value : height.value
  return panelExtent.value
})
const thresholdReached = computed(() => Math.abs(offset.value) > Math.min(Math.max(0, extent.value - 1), 100))
const sign = () => side.value === 'Left' || side.value === 'Top' ? 1 : -1
const rootStyle = computed<CSSProperties>(() => {
  const layoutProps = Object.fromEntries((Object.keys(props) as (keyof typeof props)[])
    .map(name => [name, readProperty(name)]))
  const stretchWidth = layoutProps.HorizontalAlignment === 'Stretch'
    && (layoutProps.Width === '' || layoutProps.Width === undefined || layoutProps.Width === null || layoutProps.Width === 'Auto')
  const margin = String(layoutProps.Margin ?? 0).split(',').map(value => cssLength(value.trim()))
  const leftMargin = margin[0] || '0px'
  const rightMargin = margin.length === 4 ? margin[2] || '0px' : leftMargin
  return {
    ...frameworkLayoutStyle({
      ...layoutProps,
      Background: undefined,
      BorderBrush: undefined,
      BorderThickness: undefined,
      Padding: undefined,
      CornerRadius: undefined
    }, instance),
    // Horizontal Stretch must also arrange against flex content presenters.
    ...(stretchWidth ? { width: `calc(100% - ${leftMargin} - ${rightMargin})` } : {}),
    touchAction: !enabled.value ? 'auto' : horizontal.value ? 'pan-y' : 'pan-x'
  }
})
const brush = (name: 'Background' | 'BorderBrush') => {
  const raw = assignments.has(name) ? assignments.get(name) : props[name]
  const key = staticResourceKey(raw)
  return swipeBrush(key && dictionary[key] ? dictionary[key] : readProperty(name), instance)
}
const presenterStyle = computed<CSSProperties>(() => ({
  background: brush('Background'),
  borderColor: brush('BorderBrush'),
  borderWidth: xamlThickness(readProperty('BorderThickness')),
  padding: xamlThickness(readProperty('Padding')),
  borderRadius: String(readProperty('CornerRadius')).split(',').map(value => cssLength(value.trim())).join(' '),
  pointerEvents: enabled.value ? undefined : 'none'
}))
const contentTransform = computed(() => ({
  transform: horizontal.value
    ? `translate3d(${offset.value}px,0,0)` : `translate3d(0,${offset.value}px,0)`
}))
const inputEaterStyle = computed<CSSProperties>(() => {
  const active = open.value || interacting.value || phase.value !== 'idle'
  return {
    visibility: active ? 'visible' : 'hidden',
    pointerEvents: active ? 'auto' : 'none'
  }
})
const resource = (name: string) => swipeControlResources[name]
const underlayStyle = computed<CSSProperties>(() => {
  const horizontalInset = Math.max(0, width.value - Math.abs(offset.value))
  const verticalInset = Math.max(0, height.value - Math.abs(offset.value))
  const edgeItem = side.value === 'Left' || side.value === 'Top'
    ? currentItems.value.at(-1) : currentItems.value[0]
  const clips = {
    Left: `inset(0 ${horizontalInset}px 0 0)`,
    Right: `inset(0 0 0 ${horizontalInset}px)`,
    Top: `inset(0 0 ${verticalInset}px 0)`,
    Bottom: `inset(${verticalInset}px 0 0 0)`
  }
  return {
    background: side.value && mode.value === 'Reveal'
      ? edgeItem?.Background ?? resource('SwipeItemBackground') : undefined,
    clipPath: side.value ? clips[side.value] : undefined,
    visibility: side.value ? 'visible' : 'hidden'
  }
})
const panelStyle = computed<CSSProperties>(() => {
  const execute = mode.value === 'Execute'
  const backgroundResource = thresholdReached.value
    ? 'SwipeItemPostThresholdExecuteBackground' : 'SwipeItemPreThresholdExecuteBackground'
  return {
    flexDirection: horizontal.value ? 'row' : 'column',
    width: execute || !horizontal.value ? '100%' : 'max-content',
    height: execute || horizontal.value ? '100%' : 'max-content',
    background: execute ? currentItems.value[0]?.Background ?? resource(backgroundResource) : undefined,
    transform: !execute ? undefined : horizontal.value
      ? `translate3d(${(offset.value - sign() * width.value) / 2}px,0,0)`
      : `translate3d(0,${(offset.value - sign() * height.value) / 2}px,0)`
  }
})
const itemStyle = (item: SwipeItem): CSSProperties => {
  const foregroundResource = mode.value !== 'Execute' ? 'SwipeItemForeground'
    : thresholdReached.value ? 'SwipeItemPostThresholdExecuteForeground' : 'SwipeItemPreThresholdExecuteForeground'
  return {
    background: mode.value === 'Execute' ? 'transparent' : item.Background ?? resource('SwipeItemBackground'),
    color: item.Foreground ?? resource(foregroundResource)
  }
}
const itemCommand = (item: SwipeItem) => {
  void commandRevision.value
  return toRaw(item.Command) as UICommandMetadata | undefined
}
const itemLabel = (item: SwipeItem) => item.Text ?? itemCommand(item)?.Label ?? ''
const itemDescription = (item: SwipeItem) => itemCommand(item)?.Description
// SwipeItem raises Invoked even when its command cannot execute. The command
// gate applies only to Execute, while SwipeControl.IsEnabled gates the item.
const itemEnabled = (_item: SwipeItem) => enabled.value
const icon = (item: SwipeItem) => item.IconSource ?? itemCommand(item)?.IconSource
const iconUri = (item: SwipeItem) => {
  const source = icon(item)
  if (typeof source === 'object') return source?.UriSource
  return typeof source === 'string' && /^(https?:|data:)/.test(source) ? source : undefined
}
const iconGlyph = (item: SwipeItem) => {
  const source = icon(item)
  if (typeof source !== 'object') return iconUri(item) ? undefined : source
  const codepoint = symbolGlyphs[source?.Symbol ?? '']?.[1]
  return source?.Glyph ?? (codepoint !== undefined ? String.fromCodePoint(codepoint) : undefined)
}
const iconStyle = (item: SwipeItem) => {
  const source = icon(item)
  return typeof source === 'object' ? { fontFamily: source?.FontFamily as CSSProperties['fontFamily'] } : {}
}
const bitmapStyle = (item: SwipeItem) => ({ '--swipe-item-bitmap-source': `url(\"${iconUri(item)}\")` } as CSSProperties)
const remainOpen = () => mode.value === 'Execute' && currentItems.value[0]?.BehaviorOnInvoked === 'RemainOpen' && open.value
let itemPointer: { id: number, x: number, y: number, element: HTMLElement, moved: boolean } | undefined
const ignoredItemClicks = new WeakSet<HTMLElement>()
const itemPointerDown = (event: PointerEvent) => {
  if (!enabled.value || !event.isPrimary || event.button !== 0) return
  const element = event.currentTarget as HTMLElement
  ignoredItemClicks.delete(element)
  itemPointer = { id: event.pointerId, x: event.clientX, y: event.clientY, element, moved: false }
  element.setPointerCapture(event.pointerId)
}
const itemPointerMove = (event: PointerEvent) => {
  if (itemPointer?.id !== event.pointerId) return
  if (Math.hypot(event.clientX - itemPointer.x, event.clientY - itemPointer.y) >= 5) itemPointer.moved = true
}
const releaseItemPointer = (cancelled = false) => {
  const session = itemPointer
  itemPointer = undefined
  if (!session) return
  if (cancelled || session.moved) ignoredItemClicks.add(session.element)
  if (session.element.hasPointerCapture(session.id)) session.element.releasePointerCapture(session.id)
}
const itemPointerUp = (event: PointerEvent) => {
  if (itemPointer?.id !== event.pointerId) return
  itemPointerMove(event)
  releaseItemPointer()
}
const itemPointerCancel = (event: PointerEvent) => {
  if (itemPointer?.id === event.pointerId) releaseItemPointer(true)
}
const itemPointerCaptureLost = (event: PointerEvent) => {
  if (itemPointer?.id === event.pointerId) releaseItemPointer(true)
}
const itemClicked = (item: SwipeItem, event: MouseEvent) => {
  const element = event.currentTarget as HTMLElement
  // Reference invokes from Tapped; a browser click can also follow a drag.
  if (event.detail !== 0 && ignoredItemClicks.has(element)) {
    ignoredItemClicks.delete(element)
    return
  }
  invoke(item)
}
interface SwipePointer {
  id: number
  x: number
  y: number
  offset: number
  requestedOffset: number
  opened: boolean
  last: number
  position: number
  velocity: number
}
let pointer: SwipePointer | undefined
let operation = 0
let suppressDragClick = false
let invoking = false
let disposed = false
let resizeObserver: ResizeObserver | undefined
const tracker = new BrowserSwipeInteractionTracker(() => offset.value, value => { offset.value = value })
const bounds = (): SwipeTrackerBounds => sign() > 0
  ? { minimum: 0, maximum: extent.value } : { minimum: -extent.value, maximum: 0 }
const measure = () => {
  width.value = root.value?.clientWidth ?? 0
  height.value = root.value?.clientHeight ?? 0
  panelExtent.value = horizontal.value ? panel.value?.scrollWidth ?? 0 : panel.value?.scrollHeight ?? 0
}
const stopAnimation = () => {
  tracker.Cancel()
  phase.value = 'idle'
}
const animateTo = async (target: number, state: 'opening' | 'closing', velocity = 0) => {
  const version = operation
  phase.value = state
  const completed = await tracker.Settle(target, velocity, bounds())
  if (completed && version === operation && !disposed) phase.value = 'idle'
  return completed && version === operation && !disposed
}
const release = () => {
  const id = pointer?.id
  pointer = undefined
  interacting.value = false
  if (id !== undefined && root.value?.hasPointerCapture(id)) root.value.releasePointerCapture(id)
}
function Close() {
  const version = ++operation
  releaseItemPointer(true)
  release()
  stopAnimation()
  open.value = false
  if (!side.value || offset.value === 0) {
    side.value = undefined
    offset.value = 0
    return
  }
  void animateTo(0, 'closing').then(completed => {
    if (completed && version === operation && !pointer && !open.value) side.value = undefined
  })
}
const closeWithoutAnimation = () => {
  operation += 1
  releaseItemPointer(true)
  release()
  stopAnimation()
  open.value = false
  offset.value = 0
  side.value = undefined
}
const dismiss = () => {
  if (!remainOpen()) Close()
}
const coordinate = (event: PointerEvent) => horizontal.value ? event.clientX : event.clientY
const pointerDown = (event: PointerEvent) => {
  if (!enabled.value || event.button !== 0 || pointer || !event.isPrimary || invoking || remainOpen()) return
  if (event.target instanceof Element && event.target.closest('.swipe-item')) return
  operation += 1
  stopAnimation()
  pointer = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    offset: offset.value,
    requestedOffset: offset.value,
    opened: open.value,
    last: event.timeStamp,
    position: coordinate(event),
    velocity: 0
  }
}
const pointerMove = (event: PointerEvent) => {
  const session = pointer
  if (!session || session.id !== event.pointerId) return
  const deltaX = event.clientX - session.x
  const deltaY = event.clientY - session.y
  const delta = horizontal.value ? deltaX : deltaY

  if (!interacting.value) {
    if (Math.abs(delta) < 5) return
    if (Math.abs(horizontal.value ? deltaY : deltaX) > Math.abs(delta)) {
      release()
      return
    }
    const candidate: SwipeSide = horizontal.value
      ? delta > 0 ? 'Left' : 'Right' : delta > 0 ? 'Top' : 'Bottom'
    if (!side.value) {
      if (!collections.value[candidate]?.Size) {
        release()
        return
      }
      side.value = candidate
    }
    interacting.value = true
    root.value?.setPointerCapture(event.pointerId)
    document.dispatchEvent(new CustomEvent('winui-swipe-interaction', { detail: exposed }))
    measure()
  }

  session.requestedOffset = session.offset + delta
  if (!session.opened && session.requestedOffset * sign() < 0) {
    const opposite: SwipeSide = horizontal.value
      ? session.requestedOffset > 0 ? 'Left' : 'Right'
      : session.requestedOffset > 0 ? 'Top' : 'Bottom'
    if (collections.value[opposite]?.Size) side.value = opposite
  }
  tracker.TryUpdatePosition(session.requestedOffset, bounds())
  void nextTick(() => {
    if (pointer !== session || !interacting.value || disposed) return
    measure()
    tracker.TryUpdatePosition(session.requestedOffset, bounds())
  })
  const elapsed = event.timeStamp - session.last
  if (elapsed > 0) session.velocity = (coordinate(event) - session.position) / elapsed
  session.position = coordinate(event)
  session.last = event.timeStamp
  event.preventDefault()
}
const pointerUp = async (event: PointerEvent) => {
  const session = pointer
  if (!session || session.id !== event.pointerId) return
  const version = operation
  const wasDragging = interacting.value
  const velocity = event.timeStamp - session.last < 100 ? session.velocity : 0
  if (wasDragging) {
    session.requestedOffset = session.offset + (horizontal.value ? event.clientX - session.x : event.clientY - session.y)
  }
  release()
  if (!wasDragging) {
    if (session.opened) dismiss()
    return
  }
  suppressDragClick = true

  // A single move can create SwipeItems and release before Vue lays them out.
  // Retain its raw position until the new panel has a measurable extent.
  await nextTick()
  if (version !== operation || disposed || !enabled.value || !side.value) return
  measure()
  tracker.TryUpdatePosition(session.requestedOffset, bounds())
  const restingPosition = tracker.NaturalRestingPosition(velocity)
  const projected = restingPosition * sign()
  const threshold = session.opened ? extent.value : Math.min(extent.value, 100)
  const shouldOpen = extent.value > 0 && projected >= threshold
  if (restingPosition * offset.value < 0) {
    closeWithoutAnimation()
    return
  }
  if (!shouldOpen) {
    Close()
    return
  }

  const item = currentItems.value[0]
  const executedMode = mode.value === 'Execute'
  open.value = true
  const completed = await animateTo(sign() * extent.value, 'opening', velocity)
  if (!completed || version !== operation || disposed || !enabled.value || !open.value) return
  if (executedMode && item && currentItems.value.includes(item)) invoke(item)
}
const pointerCancel = (event: PointerEvent) => {
  if (pointer?.id === event.pointerId) Close()
}
const captureLost = (event: PointerEvent) => {
  if (pointer?.id === event.pointerId) Close()
}
const suppressClick = (event: MouseEvent) => {
  if (!enabled.value || (event.detail !== 0 && suppressDragClick)) {
    suppressDragClick = false
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}
function invoke(item: SwipeItem) {
  if (invoking || !itemEnabled(item) || phase.value !== 'idle' || !currentItems.value.includes(item)) return
  invoking = true
  try {
    item.Invoked?.(item, { SwipeControl: exposed })
    const command = itemCommand(item)
    if (command?.CanExecute?.(item.CommandParameter) ?? true) {
      command?.Execute(item.CommandParameter)
    }
    if ((item.BehaviorOnInvoked ?? 'Auto') !== 'RemainOpen') Close()
  } finally {
    invoking = false
  }
}
const assignProperty = (name: keyof typeof props, value: unknown) => {
  assignments.set(name, value)
  revision.value += 1
}
const exposed = {
  Close,
  get Content() {
    const value = readProperty('Content')
    return value === undefined ? contentApi : value
  },
  set Content(value: unknown) {
    contentText.value = undefined
    assignProperty('Content', value)
  },
  get ContentTemplate() { return contentTemplate.value },
  set ContentTemplate(value: unknown) { assignProperty('ContentTemplate', value) },
  get DataContext() { return dataContext.value },
  set DataContext(value: unknown) { assignProperty('DataContext', value) },
  get Element() { return root.value }
} as SwipeControlApi & Record<string, unknown>
Object.defineProperty(exposed, xamlControlIdentityKey, { value: true })
for (const name of Object.keys(props) as (keyof typeof props)[]) {
  if (name in exposed) continue
  Object.defineProperty(exposed, name, {
    enumerable: true,
    get: () => {
      if (name.endsWith('Items')) return collections.value[name.replace('Items', '') as SwipeSide] ?? null
      if (name === 'IsEnabled') return enabled.value
      if (name === 'IsTabStop') return tabStop.value
      return readProperty(name)
    },
    set: value => {
      if (name.endsWith('Items') && value !== null && value !== undefined
        && !(value instanceof SwipeItemsCollection)) {
        throw new TypeError('SwipeControl item properties require a SwipeItems collection.')
      }
      if (name.endsWith('Items') && value instanceof SwipeItemsCollection) {
        const sideName = name.replace('Items', '') as SwipeSide
        const nextCollections = { ...collections.value, [sideName]: value }
        if ((nextCollections.Left?.Size || nextCollections.Right?.Size)
          && (nextCollections.Top?.Size || nextCollections.Bottom?.Size)) {
          throw new TypeError('SwipeControl cannot mix horizontal and vertical SwipeItems.')
        }
      }
      assignProperty(name, value)
      if (name.endsWith('Items') || name === 'IsEnabled') Close()
    }
  })
}
defineExpose(exposed)
const outsidePointer = (event: PointerEvent) => {
  suppressDragClick = false
  if (mode.value === 'Reveal' && (open.value || phase.value === 'opening')
    && !root.value?.contains(event.target as Node)) dismiss()
}
const outsidePointerMove = (event: PointerEvent) => {
  if (pointer && !root.value?.contains(event.target as Node)) pointerMove(event)
}
const otherInteraction = (event: Event) => {
  if ((event as CustomEvent).detail !== exposed && (open.value || phase.value === 'opening')) dismiss()
}
const keyDown = () => {
  if (mode.value === 'Reveal' && (open.value || phase.value === 'opening')) dismiss()
}
const cancelInteraction = () => {
  releaseItemPointer(true)
  if (pointer) Close()
  else if (mode.value === 'Reveal' && (open.value || phase.value === 'opening')) dismiss()
}
const visibilityChanged = () => {
  if (document.hidden) cancelInteraction()
}
const contextRequested = (event: MouseEvent) => {
  if (!enabled.value) return
  const args = {
    OriginalSource: event.target,
    Position: { X: event.clientX, Y: event.clientY },
    Handled: false,
    TryGetPosition(relativeTo?: { Element?: HTMLElement } | HTMLElement) {
      const element = relativeTo instanceof HTMLElement ? relativeTo : relativeTo?.Element
      const rectangle = element?.getBoundingClientRect()
      return { X: event.clientX - (rectangle?.left ?? 0), Y: event.clientY - (rectangle?.top ?? 0) }
    }
  }
  emit('ContextRequested', exposed, args)
  if (args.Handled) event.preventDefault()
}
watch(enabled, value => {
  if (!value) Close()
})
const collectionOwner = {}
let observedCollections: Partial<Record<SwipeSide, SwipeItems>> = {}
let collectionSubscriptions: (() => void)[] = []
let commandSubscriptions: (() => void)[] = []
watch(() => Object.values(collections.value).flatMap(collection =>
  Array.from(collection, item => toRaw(item.Command) as UICommandMetadata | undefined)), commands => {
  for (const unsubscribe of commandSubscriptions) unsubscribe()
  commandSubscriptions = []
  for (const command of new Set(commands.filter(Boolean))) {
    const invalidate = () => { commandRevision.value += 1 }
    command?.addEventListener?.('CanExecuteChanged', invalidate)
    command?.addEventListener?.('PropertyChanged', invalidate)
    commandSubscriptions.push(() => {
      command?.removeEventListener?.('CanExecuteChanged', invalidate)
      command?.removeEventListener?.('PropertyChanged', invalidate)
    })
  }
  commandRevision.value += 1
}, { immediate: true, flush: 'sync' })
watch(() => ({
  collections: collections.value,
  vectors: Object.values(collections.value).map(collection => ({
    Mode: collection.Mode, items: Array.from(collection)
  }))
}), ({ collections: value }) => {
  for (const unsubscribe of collectionSubscriptions) unsubscribe()
  collectionSubscriptions = []
  observedCollections = value
  for (const collection of new Set(Object.values(value))) {
    if (!(collection instanceof SwipeItemsCollection)) continue
    collectionSubscriptions.push(observeSwipeItemsChanging(collection, collectionOwner, size => {
      const count = (sideName: SwipeSide) => {
        const candidate = observedCollections[sideName]
        return candidate === collection ? size : candidate?.Size ?? 0
      }
      if ((count('Left') || count('Right')) && (count('Top') || count('Bottom'))) {
        throw new TypeError('SwipeControl cannot mix horizontal and vertical SwipeItems.')
      }
    }))
  }
  if (side.value && !value[side.value]?.Size) closeWithoutAnimation()
  void nextTick(() => {
    if (disposed) return
    measure()
    if (pointer && interacting.value) tracker.TryUpdatePosition(pointer.requestedOffset, bounds())
    else if (open.value && phase.value === 'idle') offset.value = sign() * extent.value
  })
}, { deep: true, immediate: true, flush: 'sync' })
for (const name of Object.keys(props) as (keyof typeof props)[]) {
  watch(() => props[name], () => {
    assignments.delete(name)
    if (name === 'Content') contentText.value = undefined
    revision.value += 1
  })
}
onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    measure()
    if (pointer && interacting.value) tracker.TryUpdatePosition(pointer.requestedOffset, bounds())
    else if (open.value && phase.value === 'idle') offset.value = sign() * extent.value
  })
  if (root.value) resizeObserver.observe(root.value)
  if (panel.value) resizeObserver.observe(panel.value)
  measure()
  document.addEventListener('pointerdown', outsidePointer, true)
  document.addEventListener('keydown', keyDown, true)
  document.addEventListener('winui-swipe-interaction', otherInteraction)
  document.addEventListener('visibilitychange', visibilityChanged)
  window.addEventListener('pointerup', pointerUp)
  window.addEventListener('pointermove', outsidePointerMove)
  window.addEventListener('pointercancel', pointerCancel)
  window.addEventListener('blur', cancelInteraction)
})
onBeforeUnmount(() => {
  disposed = true
  operation += 1
  releaseItemPointer(true)
  release()
  stopAnimation()
  resizeObserver?.disconnect()
  for (const unsubscribe of collectionSubscriptions) unsubscribe()
  for (const unsubscribe of commandSubscriptions) unsubscribe()
  document.removeEventListener('pointerdown', outsidePointer, true)
  document.removeEventListener('keydown', keyDown, true)
  document.removeEventListener('winui-swipe-interaction', otherInteraction)
  document.removeEventListener('visibilitychange', visibilityChanged)
  window.removeEventListener('pointerup', pointerUp)
  window.removeEventListener('pointermove', outsidePointerMove)
  window.removeEventListener('pointercancel', pointerCancel)
  window.removeEventListener('blur', cancelInteraction)
})
</script>

<style scoped>
.win-swipe-control {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  box-sizing: border-box;
  min-width: 88px;
  min-height: 40px;
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
  font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
  user-select: none;
}

.swipe-content-root {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.swipe-items-panel {
  position: absolute;
  display: flex;
}

.side-left .swipe-items-panel { inset: 0 auto 0 0; }
.side-right .swipe-items-panel { inset: 0 0 0 auto; }
.side-top .swipe-items-panel { inset: 0 0 auto 0; }
.side-bottom .swipe-items-panel { inset: auto 0 0 0; }

.swipe-item {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  min-width: 68px;
  min-height: 40px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  font: inherit;
  box-sizing: border-box;
  pointer-events: auto;
  cursor: default;
}

.side-left .swipe-item,
.side-right .swipe-item { height: 100%; }

.side-top .swipe-item,
.side-bottom .swipe-item { width: 100%; }

.mode-execute .swipe-item {
  width: 100%;
  height: 100%;
}

.swipe-item:active {
  background: var(--SwipeItemBackgroundPressed, var(--ControlAltFillColorQuarternaryBrush)) !important;
}

.swipe-item:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -2px;
}

.swipe-item-content {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  justify-items: center;
  align-content: center;
  margin: 4px 4px 2px;
}

.swipe-item-viewbox {
  display: grid;
  justify-items: center;
  min-width: 16px;
  max-height: 16px;
}

.swipe-item-icon,
.swipe-item-bitmap {
  display: block;
  width: 16px;
  height: 16px;
  margin-bottom: 2px;
  font-family: 'WinUIOnWebFontIcons', 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif;
  font-size: 16px;
  line-height: 16px;
}

.swipe-item-bitmap {
  background: currentColor;
  mask: var(--swipe-item-bitmap-source) center / contain no-repeat;
}

.swipe-item-text {
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
}

.swipe-control-content {
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  min-height: inherit;
  min-width: 0;
  z-index: 1;
}

.swipe-content-presenter {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
  min-height: inherit;
  border-style: solid;
  box-sizing: border-box;
  overflow: hidden;
}

.swipe-input-eater {
  position: absolute;
  inset: 0;
}
</style>
