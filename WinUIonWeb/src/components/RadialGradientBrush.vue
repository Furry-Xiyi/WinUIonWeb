<script lang="ts">
import { defineComponent, Fragment, markRaw, reactive, shallowRef, watch, type ComponentInternalInstance, type VNode } from 'vue'
import { clampOpacity, colorString } from './brushCore'
import { resolveXamlValue, updateXamlBinding, xamlNameScopeKey } from './xamlRuntime'

export interface GradientPoint { X: number; Y: number }
export interface GradientStopValue { Color: string; Offset: number }
type VectorChangedArgs = { CollectionChange: 'Reset' | 'ItemInserted' | 'ItemRemoved' | 'ItemChanged'; Index: number }
type VectorChangedHandler = (sender: GradientStopCollection, args: VectorChangedArgs) => void
const finite = (value: unknown, fallback: number) => Number.isFinite(Number(value)) ? Number(value) : fallback
export const gradientPoint = (value: unknown, fallback: GradientPoint = { X: .5, Y: .5 }): GradientPoint => {
  if (value && typeof value === 'object' && 'X' in value && 'Y' in value) {
    return { X: finite(value.X, fallback.X), Y: finite(value.Y, fallback.Y) }
  }
  const parts = String(value ?? '').trim().split(/[\s,]+/)
  return parts.length === 2 ? { X: finite(parts[0], fallback.X), Y: finite(parts[1], fallback.Y) } : { ...fallback }
}
export const createGradientStop = (values: Partial<GradientStopValue> = {}): GradientStopValue => reactive(new Proxy({
  Color: colorString(values.Color ?? 'Transparent'), Offset: finite(values.Offset ?? 0, 0)
}, {
  set(target, property, value, receiver) {
    return Reflect.set(target, property, property === 'Color' ? colorString(value)
      : property === 'Offset' ? finite(value, 0) : value, receiver)
  }
}))

// RadialGradientBrush.idl exposes an observable vector that remains live
// when the collection is changed after the owning shape has connected.
export class GradientStopCollection implements Iterable<GradientStopValue> {
  #entries = reactive<GradientStopValue[]>([])
  #handlers = new Set<VectorChangedHandler>()
  constructor() { markRaw(this) }
  get Size() { return this.#entries.length }
  get Count() { return this.Size }
  GetAt(index: number) { this.#checkIndex(index); return this.#entries[index]! }
  SetAt(index: number, value: GradientStopValue) {
    this.#checkIndex(index); this.#entries[index] = this.#entry(value); this.#notify('ItemChanged', index)
  }
  InsertAt(index: number, value: GradientStopValue) {
    this.#checkIndex(index, true); this.#entries.splice(index, 0, this.#entry(value)); this.#notify('ItemInserted', index)
  }
  Append(value: GradientStopValue) { this.InsertAt(this.Size, value) }
  RemoveAt(index: number) { this.#checkIndex(index); this.#entries.splice(index, 1); this.#notify('ItemRemoved', index) }
  RemoveAtEnd() { this.RemoveAt(this.Size - 1) }
  Clear() { this.ReplaceAll([]) }
  ReplaceAll(values: Iterable<GradientStopValue>) {
    const entries = Array.from(values, value => this.#entry(value))
    this.#entries.splice(0, this.Size, ...entries); this.#notify('Reset', 0)
  }
  IndexOf(value: GradientStopValue) {
    const index = this.#entries.indexOf(value)
    return { found: index >= 0, index: Math.max(0, index) }
  }
  GetView(): ReadonlyArray<GradientStopValue> { return Object.freeze([...this.#entries]) }
  VectorChanged(handler: VectorChangedHandler) { this.#handlers.add(handler); return () => this.#handlers.delete(handler) }
  [Symbol.iterator]() { return this.#entries[Symbol.iterator]() }
  #entry(value: GradientStopValue) {
    if (!value || typeof value !== 'object' || !('Color' in value) || !('Offset' in value)) {
      throw new TypeError('GradientStops must contain GradientStop values.')
    }
    return reactive(value)
  }
  #checkIndex(index: number, allowEnd = false) {
    if (!Number.isInteger(index) || index < 0 || index >= this.Size + Number(allowEnd)) throw new RangeError('GradientStops index is out of bounds.')
  }
  #notify(CollectionChange: VectorChangedArgs['CollectionChange'], Index: number) {
    for (const handler of this.#handlers) handler(this, { CollectionChange, Index })
  }
}

export interface RadialGradientBrushValue {
  readonly __radialGradient: true
  Center: GradientPoint
  GradientOrigin: GradientPoint
  RadiusX: number
  RadiusY: number
  MappingMode: 'RelativeToBoundingBox' | 'Absolute'
  SpreadMethod: 'Pad' | 'Reflect' | 'Repeat'
  InterpolationSpace: string
  Opacity: number
  FallbackColor: string
  readonly GradientStops: GradientStopCollection
}
export const createRadialGradientBrush = (): RadialGradientBrushValue => {
  const stops = new GradientStopCollection()
  return reactive(new Proxy({
    __radialGradient: true as const, Center: { X: .5, Y: .5 }, GradientOrigin: { X: .5, Y: .5 },
    RadiusX: .5, RadiusY: .5, MappingMode: 'RelativeToBoundingBox' as const,
    SpreadMethod: 'Pad' as const, InterpolationSpace: 'Auto', Opacity: 1, FallbackColor: colorString('Transparent'),
    get GradientStops() { return stops }
  }, {
    set(target, property, input, receiver) {
      let value = input
      if (property === 'Center' || property === 'GradientOrigin') value = gradientPoint(input)
      else if (property === 'RadiusX' || property === 'RadiusY') value = finite(input, .5)
      else if (property === 'Opacity') value = clampOpacity(input)
      else if (property === 'FallbackColor') value = colorString(input)
      else if (property === 'MappingMode') value = input === 'Absolute' ? 'Absolute' : 'RelativeToBoundingBox'
      else if (property === 'SpreadMethod') value = input === 'Repeat' || input === 'Reflect' ? input : 'Pad'
      return Reflect.set(target, property, value, receiver)
    }
  })) as RadialGradientBrushValue
}

export const GradientStop = defineComponent({ name: 'GradientStop', __xamlReactive: true,
  props: { Color: { type: String, default: 'Transparent' }, Offset: { type: [String, Number], default: 0 } }, setup: () => () => null })
export const RadialGradientStops = defineComponent({ name: 'RadialGradientBrush.GradientStops', setup: () => () => null })
const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[]
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []
type ResourceContext = { Dispose: (stop: () => void) => void; Node?: () => VNode; instance?: ComponentInternalInstance | null }
const createResource = (read: (name: string) => unknown, context: ResourceContext) => {
  const brush = createRadialGradientBrush()
  const resolve = (value: unknown) => resolveXamlValue(value, context.instance ?? null)
  for (const name of ['Center', 'GradientOrigin', 'RadiusX', 'RadiusY', 'MappingMode', 'SpreadMethod', 'InterpolationSpace', 'Opacity', 'FallbackColor'] as const) {
    context.Dispose(watch(() => resolve(read(name)), input => {
      if (input === undefined || input === null) return
      if (name === 'Center' || name === 'GradientOrigin') {
        const point = gradientPoint(input)
        if (brush[name].X === point.X && brush[name].Y === point.Y) return
      }
      Reflect.set(brush, name, input)
    }, { immediate: true, deep: true }))
    context.Dispose(watch(() => brush[name], value => {
      const binding = context.Node?.().props?.[name]
      if (name === 'Center' || name === 'GradientOrigin') {
        const current = resolve(binding)
        const point = value as GradientPoint
        if (current && typeof current === 'object' && 'X' in current && 'Y' in current
          && current.X === point.X && current.Y === point.Y) return
      }
      updateXamlBinding(binding, value, context.instance ?? null)
    }, { deep: true }))
  }
  const names = context.instance?.provides[xamlNameScopeKey] as Record<string, unknown> | undefined
  type StopDeclaration = { node: ReturnType<typeof shallowRef<VNode>>; stop: GradientStopValue; dispose: () => void; name?: string }
  let stopDeclarations: StopDeclaration[] = []
  const declarations = () => {
    const result: VNode[] = []
    const visit = (nodes: VNode[]) => {
      for (const node of nodes) {
        if (node.type === Fragment || node.type === RadialGradientStops) visit(childrenOf(node))
        else if ((node.type as { name?: string }).name === 'GradientStop') result.push(node)
      }
    }
    const node = context.Node?.()
    if (node) visit(childrenOf(node))
    return result
  }
  const declarationName = (node: VNode) => node.props?.['x:Name'] ?? node.props?.['data-xaml-ref']
  const makeDeclaration = (node: VNode): StopDeclaration => {
    const source = shallowRef(node)
    const stop = createGradientStop()
    const disposers: (() => void)[] = []
    for (const property of ['Color', 'Offset'] as const) {
      disposers.push(watch(() => resolve(source.value.props?.[property]), input => {
        if (property === 'Color') stop.Color = colorString(input ?? 'Transparent')
        else stop.Offset = finite(input ?? 0, 0)
      }, { immediate: true }))
      disposers.push(watch(() => stop[property], value => {
        updateXamlBinding(source.value.props?.[property], value, context.instance ?? null)
      }))
    }
    return { node: source, stop, dispose: () => disposers.forEach(dispose => dispose()) }
  }
  const unpublish = (declaration: StopDeclaration) => {
    if (declaration.name && names?.[declaration.name] === declaration.stop) delete names[declaration.name]
    declaration.name = undefined
  }
  // XAML bindings update the existing GradientStop dependency properties.
  // They must not replace the observable vector or discard code-added stops.
  context.Dispose(watch(declarations, nodes => {
    const available = [...stopDeclarations]
    const next = nodes.map((node, index) => {
      const name = declarationName(node)
      const key = node.key ?? name
      const oldIndex = key === undefined ? available.indexOf(stopDeclarations[index]!)
        : available.findIndex(entry => entry.node.value && (entry.node.value.key ?? declarationName(entry.node.value)) === key)
      const declaration = oldIndex >= 0 ? available.splice(oldIndex, 1)[0]! : makeDeclaration(node)
      declaration.node.value = node
      if (declaration.name !== name) unpublish(declaration)
      if (typeof name === 'string' && names) { names[name] = declaration.stop; declaration.name = name }
      return declaration
    })
    const changed = next.length !== stopDeclarations.length || next.some((entry, index) => entry !== stopDeclarations[index])
    for (const declaration of available) { unpublish(declaration); declaration.dispose() }
    stopDeclarations = next
    if (changed) brush.GradientStops.ReplaceAll(next.map(entry => entry.stop))
  }, { immediate: true }))
  context.Dispose(() => {
    for (const declaration of stopDeclarations) { unpublish(declaration); declaration.dispose() }
    stopDeclarations = []
  })
  return brush
}

export default defineComponent({
  name: 'RadialGradientBrush', __xamlBrush: true, __xamlReactive: true,
  __createXamlResource: createResource, GradientStops: RadialGradientStops,
  props: {
    Center: { type: [String, Object], default: '0.5,0.5' }, GradientOrigin: { type: [String, Object], default: '0.5,0.5' },
    RadiusX: { type: [String, Number], default: .5 }, RadiusY: { type: [String, Number], default: .5 },
    MappingMode: { type: String, default: 'RelativeToBoundingBox' }, SpreadMethod: { type: String, default: 'Pad' },
    InterpolationSpace: { type: String, default: 'Auto' }, Opacity: { type: [String, Number], default: 1 },
    FallbackColor: { type: String, default: 'Transparent' }
  }, setup: () => () => null
})
</script>
