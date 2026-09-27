import { Fragment, isVNode, type ComponentInternalInstance, type VNode } from 'vue'
import { resolveXamlResourceObject, resolveXamlValue } from './xamlRuntime'

type GeometryResult = { path: string; fillRule: 'evenodd' | 'nonzero' }
const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children)
  ? node.children.filter(isVNode) : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []

/** Consume the same Geometry object elements declared in Shapes.ts. */
export const resolveIconGeometry = (input: unknown, instance: ComponentInternalInstance | null): GeometryResult => {
  const value = (input: unknown) => resolveXamlValue(input, instance)
  const number = (input: unknown) => Number(value(input)) || 0
  const pair = (input: unknown): [number, number] => {
    const resolved = value(input)
    if (resolved && typeof resolved === 'object') return [number((resolved as Record<string, unknown>).X), number((resolved as Record<string, unknown>).Y)]
    const parts = String(resolved ?? '').split(/[\s,]+/).map(Number)
    return [parts[0] || 0, parts[1] || 0]
  }
  const stringPath = (text: string): GeometryResult => {
    const data = text.trim()
    const resource = data.match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}$/)?.[1] ?? data.match(/^var\(--([^,)]+)\)$/)?.[1]
    if (resource) {
      const resolved = resolveXamlResourceObject(resource, instance)
      return resolved && resolved !== input ? resolveIconGeometry(resolved, instance) : { path: '', fillRule: 'evenodd' }
    }
    const prefix = data.match(/^F([01])\s*/i)
    return { path: prefix ? data.slice(prefix[0].length) : data, fillRule: prefix?.[1] === '1' ? 'nonzero' : 'evenodd' }
  }
  if (typeof input === 'string') {
    const resolved = value(input)
    return resolved && typeof resolved === 'object' ? resolveIconGeometry(resolved, instance) : stringPath(String(resolved ?? ''))
  }
  if (!input || typeof input !== 'object') return { path: '', fillRule: 'evenodd' }
  if (Array.isArray(input)) {
    const geometries = input.map(item => resolveIconGeometry(item, instance))
    return { path: geometries.map(item => item.path).filter(Boolean).join(' '), fillRule: geometries.find(item => item.path)?.fillRule ?? 'evenodd' }
  }
  if (isVNode(input) && input.type === Fragment) return resolveIconGeometry(childrenOf(input), instance)
  const node = isVNode(input) ? input : null
  const type = node?.type as { __geometryKind?: string; __iconGeometryProperty?: boolean; __geometryProperty?: boolean; name?: string } | undefined
  const properties = node?.props ?? input as Record<string, unknown>
  const kind = type?.__geometryKind ?? type?.name ?? String(properties.__geometryKind ?? properties.Kind
    ?? ('Rect' in properties ? 'RectangleGeometry' : 'RadiusX' in properties || 'RadiusY' in properties ? 'EllipseGeometry'
      : 'StartPoint' in properties || 'EndPoint' in properties ? 'LineGeometry' : 'Children' in properties ? 'GeometryGroup' : ''))
  const fillRule = value(properties.FillRule) === 'Nonzero' ? 'nonzero' : 'evenodd'
  if (type?.__iconGeometryProperty || type?.__geometryProperty || kind === 'GeometryGroup') {
    const geometries = node ? childrenOf(node) : properties.Children
    const result = resolveIconGeometry(geometries, instance)
    return { path: result.path, fillRule: kind === 'GeometryGroup' ? fillRule : result.fillRule }
  }
  if (kind === 'LineGeometry') {
    const start = pair(properties.StartPoint), end = pair(properties.EndPoint)
    return { path: `M ${start.join(',')} L ${end.join(',')}`, fillRule }
  }
  if (kind === 'EllipseGeometry') {
    const [x, y] = pair(properties.Center), rx = Math.max(0, number(properties.RadiusX)), ry = Math.max(0, number(properties.RadiusY))
    return { path: rx && ry ? `M ${x - rx},${y} A ${rx},${ry} 0 1 0 ${x + rx},${y} A ${rx},${ry} 0 1 0 ${x - rx},${y} Z` : '', fillRule }
  }
  if (kind === 'RectangleGeometry') {
    const rectangle = value(properties.Rect)
    const [x, y, width, height] = rectangle && typeof rectangle === 'object'
      ? ['X', 'Y', 'Width', 'Height'].map(key => number((rectangle as Record<string, unknown>)[key]))
      : String(rectangle ?? '').split(/[\s,]+/).map(Number)
    return { path: width > 0 && height > 0 ? `M ${x || 0},${y || 0} h ${width} v ${height} h ${-width} Z` : '', fillRule }
  }
  return typeof properties.Data === 'string' ? stringPath(String(value(properties.Data) ?? '')) : { path: '', fillRule }
}
