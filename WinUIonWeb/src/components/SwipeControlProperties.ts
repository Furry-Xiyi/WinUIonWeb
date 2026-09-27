import { Comment, defineComponent, Fragment, reactive, Text, type ComponentInternalInstance, type VNode } from 'vue'
import { iconSourceKind } from './IconSource'
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime'
import { SwipeItemsCollection } from './SwipeItemsCollection'
import type { SwipeItem as SwipeItemValue, SwipeItems as SwipeItemsValue, SwipeSide } from './SwipeControl.types'

const marker = (name: string, property?: string) => defineComponent({
  name,
  __swipeProperty: property,
  setup() { return () => null }
})

export const SwipeItems = marker('SwipeItems')
export const SwipeItemIconSource = marker('SwipeItem.IconSource', 'IconSource')
export const SwipeItemBackground = marker('SwipeItem.Background', 'Background')
export const SwipeItemForeground = marker('SwipeItem.Foreground', 'Foreground')
export const SwipeItem = Object.assign(marker('SwipeItem'), {
  IconSource: SwipeItemIconSource, Background: SwipeItemBackground, Foreground: SwipeItemForeground
})
export const GradientStop = marker('GradientStop')
export const LinearGradientBrush = marker('LinearGradientBrush')

export const swipeBrush = (value: unknown, instance: ComponentInternalInstance | null): string | undefined => {
  const resolved = resolveXamlValue(value, instance)
  if (typeof resolved === 'string') return resolved
  if (!resolved || typeof resolved !== 'object') return undefined
  const node = resolved as VNode
  if (swipeNodeName(node) !== 'LinearGradientBrush') {
    return 'Color' in resolved ? String(resolveXamlValue(resolved.Color, instance)) : undefined
  }
  const point = (name: string, fallback: string) => String(node.props?.[name] ?? fallback).split(',').map(Number)
  const [startX, startY] = point('StartPoint', '0,0')
  const [endX, endY] = point('EndPoint', '1,1')
  const angle = Math.atan2(endX - startX, startY - endY) * 180 / Math.PI
  const stops = swipeChildren(node).filter(child => swipeNodeName(child) === 'GradientStop').map(child => {
    const color = resolveXamlValue(child.props?.Color, instance)
    return `${String(color ?? 'transparent')} ${Number(child.props?.Offset ?? 0) * 100}%`
  })
  return stops.length ? `linear-gradient(${angle}deg, ${stops.join(', ')})` : undefined
}
export const swipeControlProperties = Object.fromEntries(
  ['LeftItems', 'RightItems', 'TopItems', 'BottomItems', 'Content', 'ContentTemplate'].map(name => [name, marker(`SwipeControl.${name}`, name)])
)

export const swipeNodes = (nodes: VNode[]): VNode[] => nodes.flatMap(node => {
  if (node.type === Comment || (node.type === Text && !String(node.children ?? '').trim())) return []
  if (node.type === Fragment && Array.isArray(node.children)) return swipeNodes(node.children as VNode[])
  return [node]
})

export const swipeChildren = (node: VNode): VNode[] => {
  if (Array.isArray(node.children)) return swipeNodes(node.children as VNode[])
  return swipeNodes((node.children as { default?: () => VNode[] } | null)?.default?.() ?? [])
}

export const swipeProperty = (node: VNode): string | undefined =>
  (node.type as { __swipeProperty?: string })?.__swipeProperty

export const swipeNodeName = (node: VNode) => {
  const type = node.type as { name?: string; __name?: string } | string
  return typeof type === 'string' ? type : type?.name ?? type?.__name ?? ''
}

export const createSwipeItemReader = (instance: ComponentInternalInstance | null) => {
  const cache = new Map<string, SwipeItemValue>()
  const sources = new Map<string, Record<string, unknown>>()
  return (node: VNode, identity: string): SwipeItemValue => {
    let item = cache.get(identity)
    if (!item) { item = reactive<SwipeItemValue>({}); cache.set(identity, item) }
    const values = node.props ?? {}
    const previous = sources.get(identity) ?? {}
    const next: Record<string, unknown> = {}
    for (const key of ['Text', 'Background', 'Foreground', 'BehaviorOnInvoked', 'Command', 'CommandParameter'] as const) {
      const value = resolveXamlValue(values[key], instance)
      next[key] = value
      if (!Object.is(previous[key], value)) Object.assign(item, { [key]: value })
    }
    for (const key of ['Background', 'Foreground'] as const) {
      const property = swipeChildren(node).find(child => swipeProperty(child) === key)
      const brush = property && swipeChildren(property)[0]
      if (!brush) continue
      const value = swipeBrush(brush, instance)
      next[`${key}Brush`] = value
      if (previous[`${key}Brush`] !== value) item[key] = value
    }
    if (values.IconSource !== undefined) {
      next.IconSource = resolveXamlValue(values.IconSource, instance)
      if (!Object.is(previous.IconSource, next.IconSource)) item.IconSource = next.IconSource as SwipeItemValue['IconSource']
    }
    const iconProperty = swipeChildren(node).find(child => swipeProperty(child) === 'IconSource')
    const icon = iconProperty && swipeChildren(iconProperty)[0]
    if (icon && iconSourceKind(icon)) {
      const iconValue = Object.fromEntries(Object.entries(icon.props ?? {})
        .filter(([key]) => !key.startsWith('x:'))
        .map(([key, value]) => [key, resolveXamlValue(value, instance)]))
      next.IconProperties = JSON.stringify(iconValue)
      if (previous.IconProperties !== next.IconProperties) item.IconSource = iconValue
    }
    next.Invoked = values.Invoked ?? values.onInvoked
    if (previous.Invoked !== next.Invoked) item.Invoked = resolveXamlHandler(next.Invoked, instance) as SwipeItemValue['Invoked']
    sources.set(identity, next)
    return item
  }
}

const collectionSources = new WeakMap<Function, Map<SwipeSide, {
  collection: SwipeItemsCollection; mode: SwipeItemsValue['Mode']; items: SwipeItemValue[]
}>>()

export const readSwipeItems = (
  node: VNode, side: SwipeSide, instance: ComponentInternalInstance | null,
  readItem: ReturnType<typeof createSwipeItemReader>
): SwipeItemsCollection => {
  const mode = resolveXamlValue(node.props?.Mode, instance) as SwipeItemsValue['Mode'] ?? 'Reveal'
  const items = swipeChildren(node).filter(child => swipeNodeName(child) === 'SwipeItem')
    .map((child, index) => readItem(child, `${side}:${String(child.key ?? index)}`))
  let sources = collectionSources.get(readItem)
  if (!sources) {
    sources = new Map()
    collectionSources.set(readItem, sources)
  }
  let source = sources.get(side)
  if (!source) {
    const collection = new SwipeItemsCollection()
    collection.Mode = mode
    collection.ReplaceAll(items)
    source = { collection, mode, items }
    sources.set(side, source)
    return collection
  }

  const replacedItems = items.length !== source.items.length
    || items.some((item, index) => item !== source.items[index])
  if (mode === 'Execute' && items.length > 1) {
    throw new RangeError('SwipeItems in Execute mode cannot contain more than one SwipeItem.')
  }
  if (mode !== source.mode && mode === 'Reveal') source.collection.Mode = mode
  if (replacedItems) source.collection.ReplaceAll(items)
  if (mode !== source.mode && mode === 'Execute') source.collection.Mode = mode
  source.mode = mode
  source.items = items
  return source.collection
}
