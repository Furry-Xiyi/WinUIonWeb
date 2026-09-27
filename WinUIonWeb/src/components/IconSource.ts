import { defineComponent, effectScope, Fragment, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, reactive, useSlots, watch, watchEffect, type ComponentInternalInstance, type InjectionKey, type VNode } from 'vue'
import FontIcon from './FontIcon.vue'
import SymbolIcon from './SymbolIcon.vue'
import BitmapIcon from './BitmapIcon.vue'
import PathIcon from './PathIcon.vue'
import ImageIcon from './ImageIcon.vue'
import { createImageSourceModel, imageBoolean, imageNumber, imageUri, type ImageSourceModel } from './imageSource'
import { resolveXamlValue, updateXamlBinding } from './xamlRuntime'
import type { XamlResourceFactoryContext } from './UICommandProperties'

export type IconSourceKind = 'FontIcon' | 'SymbolIcon' | 'BitmapIcon' | 'PathIcon' | 'ImageIcon'
export type IconSourceModel = Record<string, unknown> & {
  readonly __iconSourceKind: IconSourceKind
  Foreground: unknown
  CreateIconElement: () => VNode | null
}

const sourceDefaults: Record<IconSourceKind, Record<string, unknown>> = {
  FontIcon: { Glyph: '', FontFamily: 'Segoe Fluent Icons,Segoe MDL2 Assets', FontSize: 20, FontWeight: 'Normal', FontStyle: 'Normal', IsTextScaleFactorEnabled: true, MirroredWhenRightToLeft: false },
  SymbolIcon: { Symbol: 'Emoji' },
  BitmapIcon: { UriSource: null, ShowAsMonochrome: true },
  PathIcon: { Data: null },
  ImageIcon: { ImageSource: null }
}

export const iconSourceContextKey: InjectionKey<(source: IconSourceModel | null) => void> = Symbol('WinUI.IconSource')

const propertyElement = (owner: string, property: string) => defineComponent({
  name: `${owner}.${property}`,
  __iconSourceProperty: property,
  setup: (_, { slots }) => () => h(Fragment, slots.default?.())
})

export const IconSourceProperty = propertyElement('IconSourceElement', 'IconSource')
export const ImageIconSourceProperty = propertyElement('ImageIconSource', 'ImageSource')

const nodeChildren = (node: VNode): VNode[] => Array.isArray(node.children)
  ? node.children.filter(isVNode) as VNode[]
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []
const flatten = (nodes: VNode[]): VNode[] => nodes.flatMap(node => node.type === Fragment ? flatten(nodeChildren(node)) : [node])
const nodeName = (node: VNode) => typeof node.type === 'string' ? node.type : (node.type as { name?: string; __name?: string }).name ?? (node.type as { __name?: string }).__name ?? ''

export const iconSourceKind = (node: VNode) =>
  (node.type as { __iconSourceKind?: IconSourceKind } | undefined)?.__iconSourceKind

export const iconSourceObjectKind = (source: Record<string, unknown>): IconSourceKind | undefined => {
  const kind = source.__iconSourceKind
  if (typeof kind === 'string' && Object.hasOwn(sourceDefaults, kind)) return kind as IconSourceKind
  if ('Glyph' in source) return 'FontIcon'
  if ('Symbol' in source) return 'SymbolIcon'
  if ('UriSource' in source) return 'BitmapIcon'
  if ('Data' in source) return 'PathIcon'
  if ('ImageSource' in source) return 'ImageIcon'
  return undefined
}

/** IconSource properties map to the corresponding IconElement dependency properties. */
export const createIconSourceElementVNode = (source: Record<string, unknown>): VNode | null => {
  const kind = iconSourceObjectKind(source)
  if (!kind) return null
  const values: Record<string, unknown> = {}
  for (const name of Object.keys(sourceDefaults[kind])) {
    const value = source[name]
    if (value !== undefined) values[kind === 'ImageIcon' && name === 'ImageSource' ? 'Source' : name] = value
  }
  if (source.Foreground !== undefined && source.Foreground !== null && source.Foreground !== '') values.Foreground = source.Foreground
  const types = { FontIcon, SymbolIcon, BitmapIcon, PathIcon, ImageIcon }
  return h(types[kind], values)
}

export const createIconSourceModel = (kind: IconSourceKind): IconSourceModel => {
  const model = reactive({ ...sourceDefaults[kind], Foreground: undefined }) as IconSourceModel
  Object.defineProperty(model, '__iconSourceKind', { value: kind })
  const element = defineComponent({ name: `${kind}FromIconSource`, setup: () => () => createIconSourceElementVNode(model) })
  Object.defineProperty(model, 'CreateIconElement', { value: () => h(element) })
  return model
}

const setSourceValues = (model: IconSourceModel, read: (name: string) => unknown, has: (name: string) => boolean) => {
  for (const [name, fallback] of Object.entries({ ...sourceDefaults[model.__iconSourceKind], Foreground: undefined })) model[name] = has(name) ? read(name) : fallback
}

const imageSourceDeclaration = (nodes: VNode[]) => {
  const children = flatten(nodes)
  const property = children.find(node => (node.type as { __iconSourceProperty?: string }).__iconSourceProperty === 'ImageSource' || nodeName(node) === 'ImageIconSource.ImageSource')
  return flatten(property ? nodeChildren(property) : children).find(node => ['BitmapImage', 'SvgImageSource'].includes(nodeName(node)))
}

const syncImageSource = (model: ImageSourceModel, node: VNode, instance: ComponentInternalInstance | null) => {
  const value = (name: string) => resolveXamlValue(node.props?.[name], instance)
  model.__kind = nodeName(node) === 'SvgImageSource' ? 'SvgImageSource' : 'BitmapImage'
  model.UriSource = imageUri(node.props?.UriSource, instance)
  model.AutoPlay = node.props?.AutoPlay === undefined ? true : imageBoolean(value('AutoPlay'))
  model.DecodePixelWidth = imageNumber(value('DecodePixelWidth'))
  model.DecodePixelHeight = imageNumber(value('DecodePixelHeight'))
  model.DecodePixelType = value('DecodePixelType') === 'Logical' ? 'Logical' : 'Physical'
  model.RasterizePixelWidth = imageNumber(value('RasterizePixelWidth'))
  model.RasterizePixelHeight = imageNumber(value('RasterizePixelHeight'))
}

const createIconSource = (kind: IconSourceKind) => {
  const name = `${kind}Source`
  const defaults = { ...sourceDefaults[kind], Foreground: undefined }
  const source = defineComponent({
    name,
    __iconSourceKind: kind,
    inheritAttrs: false,
    props: Object.fromEntries(Object.keys(defaults).map(property => [property, { default: undefined }])),
    setup(props, { expose }) {
      const instance = getCurrentInstance()
      const slots = useSlots()
      const register = inject(iconSourceContextKey, null)
      const model = createIconSourceModel(kind)
      const imageModel = createImageSourceModel()
      const overrides = reactive<Record<string, unknown>>({})
      const read = (property: string) => property in overrides ? overrides[property] : resolveXamlValue(props[property], instance)
      for (const property of Object.keys(defaults)) watch(() => resolveXamlValue(props[property], instance), () => { delete overrides[property] })
      watchEffect(() => setSourceValues(model, read, property => property in overrides || props[property] !== undefined))
      const api: Record<string, unknown> = { CreateIconElement: model.CreateIconElement }
      Object.defineProperty(api, '__iconSourceKind', { value: kind })
      for (const property of Object.keys(defaults)) Object.defineProperty(api, property, {
        enumerable: true, get: () => model[property],
        set: (value: unknown) => { overrides[property] = value; model[property] = value; updateXamlBinding(props[property], value, instance) }
      })
      expose(api)
      register?.(api as IconSourceModel)
      onBeforeUnmount(() => register?.(null))
      return () => {
        if (kind === 'ImageIcon') {
          const node = imageSourceDeclaration(slots.default?.() ?? [])
          if (node && !('ImageSource' in overrides) && props.ImageSource === undefined) { syncImageSource(imageModel, node, instance); model.ImageSource = imageModel }
        }
        return null
      }
    },
    __createXamlResource: (read: (name: string) => unknown, context: XamlResourceFactoryContext) => {
      const model = createIconSourceModel(kind)
      const imageModel = createImageSourceModel()
      const scope = effectScope(true)
      context.Dispose(() => scope.stop())
      scope.run(() => watchEffect(() => {
        const node = context.Node()
        setSourceValues(model, read, property => node.props?.[property] !== undefined)
        if (kind === 'ImageIcon') {
          const imageNode = imageSourceDeclaration(nodeChildren(node))
          if (imageNode) { syncImageSource(imageModel, imageNode, context.instance); model.ImageSource = imageModel }
        }
      }))
      return model
    }
  })
  return kind === 'ImageIcon' ? Object.assign(source, { ImageSource: ImageIconSourceProperty }) : source
}

export const FontIconSource = createIconSource('FontIcon')
export const SymbolIconSource = createIconSource('SymbolIcon')
export const BitmapIconSource = createIconSource('BitmapIcon')
export const PathIconSource = createIconSource('PathIcon')
export const ImageIconSource = createIconSource('ImageIcon')
