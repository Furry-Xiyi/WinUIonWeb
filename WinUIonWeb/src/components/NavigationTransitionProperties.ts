import { defineComponent, Fragment, type ComponentInternalInstance, type VNode } from 'vue'
import { resolveXamlValue } from './xamlRuntime'

const structural = (name: string, marker?: string) => defineComponent({
  name,
  __frameProperty: marker,
  setup() { return () => null }
})

export const FrameContentTransitions = structural('Frame.ContentTransitions', 'contentTransitions')
export const TransitionCollection = structural('TransitionCollection')
const NavigationThemeTransitionInfo = structural('NavigationThemeTransition.DefaultNavigationTransitionInfo')
export const NavigationThemeTransition = Object.assign(structural('NavigationThemeTransition'), {
  DefaultNavigationTransitionInfo: NavigationThemeTransitionInfo
})
export const EntranceNavigationTransitionInfo = structural('EntranceNavigationTransitionInfo')
export const DrillInNavigationTransitionInfo = structural('DrillInNavigationTransitionInfo')
export const SuppressNavigationTransitionInfo = structural('SuppressNavigationTransitionInfo')
export const SlideNavigationTransitionInfo = structural('SlideNavigationTransitionInfo')
export const CommonNavigationTransitionInfo = structural('CommonNavigationTransitionInfo')
export const ContinuumNavigationTransitionInfo = structural('ContinuumNavigationTransitionInfo')

const typeName = (node: VNode) => typeof node.type === 'string' ? node.type
  : (node.type as { name?: string; __name?: string }).name ?? (node.type as { __name?: string }).__name ?? ''
const children = (node: VNode): VNode[] => {
  if (Array.isArray(node.children)) return node.children as VNode[]
  const slot = node.children && typeof node.children === 'object'
    ? (node.children as { default?: () => VNode[] }).default : undefined
  return slot?.() ?? []
}
const flatten = (nodes: VNode[]): VNode[] => nodes.flatMap(node => node.type === Fragment ? flatten(children(node)) : [node])

export const getFrameProperty = (node: VNode): 'contentTransitions' | undefined =>
  (node.type as { __frameProperty?: string }).__frameProperty === 'contentTransitions'
    || typeName(node) === 'Frame.ContentTransitions' ? 'contentTransitions' : undefined

const transitionDescriptor = (node: VNode, instance: ComponentInternalInstance | null): unknown => {
  const Type = typeName(node)
  if (!Type.endsWith('NavigationTransitionInfo')) return null
  const descriptor: Record<string, unknown> = { Type }
  const properties = Type === 'SlideNavigationTransitionInfo' ? ['Effect']
    : Type === 'CommonNavigationTransitionInfo' ? ['IsStaggeringEnabled']
      : Type === 'ContinuumNavigationTransitionInfo' ? ['ExitElement'] : []
  for (const name of properties) {
    const value = resolveXamlValue(node.props?.[name], instance)
    if (value !== undefined) descriptor[name] = value
  }
  if (Type === 'SlideNavigationTransitionInfo' && descriptor.Effect === undefined) descriptor.Effect = 'FromBottom'
  return descriptor
}

/** Read structural XAML objects without realizing them as Frame content. */
export const readFrameNavigationTransition = (
  nodes: VNode[], instance: ComponentInternalInstance | null, value?: unknown
): { Enabled: boolean; DefaultNavigationTransitionInfo: unknown } => {
  const property = flatten(nodes).find(node => getFrameProperty(node) === 'contentTransitions')
  const objectNodes = property ? flatten(children(property)) : []
  const transitions = objectNodes.flatMap(node => typeName(node) === 'TransitionCollection' ? flatten(children(node)) : [node])
  const theme = transitions.find(node => typeName(node) === 'NavigationThemeTransition')
  if (theme) {
    const infoProperty = flatten(children(theme)).find(node => typeName(node) === 'NavigationThemeTransition.DefaultNavigationTransitionInfo')
    const infoNode = infoProperty ? flatten(children(infoProperty))[0] : undefined
    return { Enabled: true, DefaultNavigationTransitionInfo: infoNode
      ? transitionDescriptor(infoNode, instance) : resolveXamlValue(theme.props?.DefaultNavigationTransitionInfo, instance) ?? null }
  }
  const resolved = resolveXamlValue(value, instance)
  const objects = Array.isArray(resolved) ? resolved : resolved ? [resolved] : []
  const descriptor = objects.find(item => item && typeof item === 'object'
    && (item as { Type?: string }).Type === 'NavigationThemeTransition') as { DefaultNavigationTransitionInfo?: unknown } | undefined
  return { Enabled: Boolean(descriptor), DefaultNavigationTransitionInfo: descriptor?.DefaultNavigationTransitionInfo ?? null }
}
