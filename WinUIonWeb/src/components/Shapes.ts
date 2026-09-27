import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, onBeforeUnmount, onMounted, onUpdated, reactive, ref, unref, watch, type VNode } from 'vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { isSolidColorBrush } from './brushCore'
import { brushProperty, isBrushProperty, useBrushProperty } from './brushProperties'
import { isRadialGradientBrush, radialGradientPaint, type RadialGradientPaintBounds } from './RadialGradientVisual'
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding, xamlColor, xamlNameScopeKey } from './xamlRuntime'

type Point = [number, number]
const finiteNumber = (value: unknown, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback
const coordinates = (value: unknown): number[] => Array.isArray(value)
  ? value.flatMap(point => typeof point === 'object' && point !== null ? [finiteNumber(point.X), finiteNumber(point.Y)] : [finiteNumber(point)])
  : String(value ?? '').trim().split(/[\s,]+/).filter(Boolean).map(value => finiteNumber(value))
const point = (value: unknown): Point => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return [finiteNumber((value as { X?: number }).X), finiteNumber((value as { Y?: number }).Y)]
  const values = coordinates(value)
  return [values[0] ?? 0, values[1] ?? 0]
}
const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[]
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []

const geometryProperty = (name: string) => defineComponent({
  name, __geometryProperty: true,
  setup(_props, { slots }) { return () => h(Fragment, slots.default?.() ?? []) }
})
const GeometryChildren = geometryProperty('GeometryGroup.Children')
const geometry = (name: string, defaults: Record<string, unknown>) => defineComponent({
  name, __geometryKind: name, inheritAttrs: false,
  props: Object.fromEntries(Object.entries(defaults).map(([property, value]) => [property, { type: [String, Number, Object, Array], default: value }])),
  setup(props, { slots, expose, emit }) {
    const instance = getCurrentInstance()
    const local = reactive<Record<string, unknown>>({})
    const properties = Object.fromEntries(Object.keys(defaults).map(property => [property, computed({
      get: () => property in local ? local[property] : resolveXamlValue(props[property], instance),
      set: value => {
        local[property] = value
        updateXamlBinding(props[property], value, instance)
        emit(`update:${property}`, value)
      }
    })]))
    for (const property of Object.keys(defaults)) watch(() => resolveXamlValue(props[property], instance), () => { delete local[property] })
    expose(properties)
    return () => h(Fragment, normalizeXamlNodes(slots.default?.() ?? [], instance))
  }
})
export const GeometryGroup = Object.assign(geometry('GeometryGroup', { FillRule: 'EvenOdd' }), { Children: GeometryChildren })
export const LineGeometry = geometry('LineGeometry', { StartPoint: '0,0', EndPoint: '0,0' })
export const EllipseGeometry = geometry('EllipseGeometry', { Center: '0,0', RadiusX: 0, RadiusY: 0 })
export const RectangleGeometry = geometry('RectangleGeometry', { Rect: '0,0,0,0' })
export const PathData = geometryProperty('Path.Data')

const shape = (name: 'Line' | 'Polyline' | 'Path', geometryDefaults: Record<string, unknown>) => {
  const defaults = {
    ...geometryDefaults,
    Stroke: '', Fill: '', StrokeThickness: 1, Stretch: 'None',
    Width: '', Height: '', MinWidth: 0, MinHeight: 0, MaxWidth: '', MaxHeight: '', Margin: 0,
    HorizontalAlignment: 'Stretch', VerticalAlignment: 'Stretch', Visibility: 'Visible', Opacity: 1, IsHitTestVisible: true,
    StrokeStartLineCap: 'Flat', StrokeEndLineCap: 'Flat', StrokeDashCap: 'Flat', StrokeLineJoin: 'Miter', StrokeMiterLimit: 10,
    StrokeDashArray: '', StrokeDashOffset: 0
  }
  return defineComponent({
    name, inheritAttrs: false,
    props: Object.fromEntries(Object.entries(defaults).map(([property, value]) => [property, {
      type: [String, Number, Boolean, Object, Array], default: value
    }])),
    setup(props, { attrs, slots, expose, emit }) {
      const instance = getCurrentInstance()
      const names = inject(xamlNameScopeKey, null) as Record<string, Record<string, unknown>> | null
      const root = ref<SVGSVGElement | null>(null)
      const outline = ref<SVGPathElement | null>(null)
      const bounds = ref({ x: 0, y: 0, width: 0, height: 0 })
      const arranged = ref({ width: 0, height: 0 })
      const hasArrangedSize = ref(false)
      const local = reactive<Record<string, unknown>>({})
      const resolve = (value: unknown) => resolveXamlValue(value, instance)
      const brushes = {
        Fill: useBrushProperty('Fill', () => props.Fill, () => slots.default?.() ?? [], instance),
        Stroke: useBrushProperty('Stroke', () => props.Stroke, () => slots.default?.() ?? [], instance)
      }
      const value = (property: string): unknown => property in local ? local[property]
        : property === 'Fill' || property === 'Stroke' ? unref(brushes[property].value.value) : resolve(props[property])
      const numeric = (property: string) => finiteNumber(value(property))
      const properties = Object.fromEntries(Object.keys(defaults).map(property => [property, computed({
        get: () => value(property),
        set: next => {
          local[property] = next
          updateXamlBinding(props[property], next, instance)
          emit(`update:${property}`, next)
        }
      })]))
      for (const property of Object.keys(defaults)) watch(() => resolve(props[property]), () => { delete local[property] })
      const geometryValue = (node: VNode, property: string) => {
        const named = String(node.props?.['x:Name'] ?? node.props?.['data-xaml-ref'] ?? '')
        return named && names?.[named] ? names[named][property] : resolve(node.props?.[property])
      }
      const geometryPath = (nodes: VNode[]): string => nodes.map(node => {
        if (!node || node.type === Fragment) return node ? geometryPath(childrenOf(node)) : ''
        const type = node.type as { __geometryKind?: string; __geometryProperty?: boolean }
        if (type.__geometryKind === 'GeometryGroup' || type.__geometryProperty) return geometryPath(childrenOf(node))
        if (type.__geometryKind === 'LineGeometry') {
          return `M ${point(geometryValue(node, 'StartPoint')).join(',')} L ${point(geometryValue(node, 'EndPoint')).join(',')}`
        }
        if (type.__geometryKind === 'EllipseGeometry') {
          const [x, y] = point(geometryValue(node, 'Center'))
          const rx = Math.max(0, finiteNumber(geometryValue(node, 'RadiusX'))), ry = Math.max(0, finiteNumber(geometryValue(node, 'RadiusY')))
          return `M ${x - rx},${y} A ${rx},${ry} 0 1 0 ${x + rx},${y} A ${rx},${ry} 0 1 0 ${x - rx},${y} Z`
        }
        if (type.__geometryKind === 'RectangleGeometry') {
          const [x = 0, y = 0, width = 0, height = 0] = coordinates(geometryValue(node, 'Rect'))
          return `M ${x},${y} h ${Math.max(0, width)} v ${Math.max(0, height)} h ${-Math.max(0, width)} Z`
        }
        return ''
      }).filter(Boolean).join(' ')
      const data = computed(() => {
        if (name === 'Line') return `M ${numeric('X1')},${numeric('Y1')} L ${numeric('X2')},${numeric('Y2')}`
        if (name === 'Polyline') {
          const points = coordinates(value('Points'))
          if (points.length < 4 || points.length % 2 !== 0) return ''
          return points.reduce((path, current, index) => index % 2 === 0 ? path + `${index ? ' L' : 'M'} ${current},${points[index + 1]}` : path, '')
        }
        return value('Data') ? String(value('Data')).replace(/^\s*F[01]\s*/i, '') : geometryPath(slots.default?.() ?? [])
      })
      const fillRule = computed(() => {
        if (name === 'Polyline') return value('FillRule') === 'Nonzero' ? 'nonzero' : 'evenodd'
        if (/^\s*F1\b/i.test(String(value('Data') ?? ''))) return 'nonzero'
        const search = (nodes: VNode[]): string => {
          for (const node of nodes) {
            if ((node.type as { __geometryKind?: string }).__geometryKind === 'GeometryGroup') return String(geometryValue(node, 'FillRule') ?? 'EvenOdd')
            const nested = search(childrenOf(node))
            if (nested) return nested
          }
          return ''
        }
        return search(slots.default?.() ?? []) === 'Nonzero' ? 'nonzero' : 'evenodd'
      })
      const paint = (property: string) => {
        const brush = value(property)
        return isRadialGradientBrush(brush) ? radialGradientPaint(brush, `win-shape-${instance?.uid}-${property}`).paint
          : isSolidColorBrush(brush) ? xamlColor(brush.Color) : typeof brush === 'string' ? xamlColor(brush) || 'none' : 'none'
      }
      const strokeThickness = computed(() => paint('Stroke') === 'none' ? 0 : Math.abs(numeric('StrokeThickness')))
      const naturalSize = computed(() => ({
        width: Math.max(0, bounds.value.x + bounds.value.width + strokeThickness.value / 2),
        height: Math.max(0, bounds.value.y + bounds.value.height + strokeThickness.value / 2)
      }))
      const extent = (property: string, natural: number) => {
        const input = value(property)
        return input === '' || input === null || input === undefined || input === 'Auto' ? natural : Math.max(0, finiteNumber(input))
      }
      const stretchMatrix = computed(() => {
        const stretch = value('Stretch')
        if (stretch === 'None') return undefined
        // CShape::GetStretchTransform uses ActualWidth/ActualHeight, including layout
        // constraints. CGeometry::ComputeStretchMatrix treats a zero natural axis as 1.
        const width = hasArrangedSize.value ? arranged.value.width : extent('Width', naturalSize.value.width)
        const height = hasArrangedSize.value ? arranged.value.height : extent('Height', naturalSize.value.height)
        const stroke = strokeThickness.value
        let renderWidth = Math.max(0, width - stroke)
        let renderHeight = Math.max(0, height - stroke)
        if (renderWidth <= 1e-5) renderWidth = renderWidth > 0 ? renderWidth : stroke
        if (renderHeight <= 1e-5) renderHeight = renderHeight > 0 ? renderHeight : stroke
        if (renderWidth <= 0 || renderHeight <= 0) return undefined
        const naturalWidth = bounds.value.width > 0 ? bounds.value.width : 1
        const naturalHeight = bounds.value.height > 0 ? bounds.value.height : 1
        let x = renderWidth / naturalWidth
        let y = renderHeight / naturalHeight
        let offsetX = 0, offsetY = 0
        if (stretch === 'Uniform') {
          if (x > y) {
            x = y
            offsetX = (renderWidth - naturalWidth * x) / 2
          } else {
            y = x
            offsetY = (renderHeight - naturalHeight * y) / 2
          }
        } else if (stretch === 'UniformToFill') {
          x = y = Math.max(x, y)
        }
        return { x, y, offsetX: stroke / 2 + offsetX, offsetY: stroke / 2 + offsetY }
      })
      const transform = computed(() => {
        const matrix = stretchMatrix.value
        return matrix ? `translate(${matrix.offsetX},${matrix.offsetY}) scale(${matrix.x},${matrix.y}) translate(${-bounds.value.x},${-bounds.value.y})` : undefined
      })
      const linePoints = computed(() => {
        const matrix = stretchMatrix.value
        const project = (x: number, y: number): Point => matrix
          ? [(x - bounds.value.x) * matrix.x + matrix.offsetX, (y - bounds.value.y) * matrix.y + matrix.offsetY]
          : [x, y]
        return [project(numeric('X1'), numeric('Y1')), project(numeric('X2'), numeric('Y2'))]
      })
      const measure = () => {
        if (!outline.value || typeof outline.value.getBBox !== 'function') return
        // WinUI measures the natural geometry's right/bottom plus half of an active stroke.
        const next = name === 'Line' ? {
          x: Math.min(numeric('X1'), numeric('X2')), y: Math.min(numeric('Y1'), numeric('Y2')),
          width: Math.abs(numeric('X2') - numeric('X1')), height: Math.abs(numeric('Y2') - numeric('Y1'))
        } : outline.value.getBBox()
        if ([next.x, next.y, next.width, next.height].some(number => !Number.isFinite(number))) return
        if (bounds.value.x !== next.x || bounds.value.y !== next.y || bounds.value.width !== next.width || bounds.value.height !== next.height) {
          bounds.value = { x: next.x, y: next.y, width: next.width, height: next.height }
        }
      }
      let observer: ResizeObserver | undefined
      onMounted(() => {
        measure()
        if (root.value && typeof ResizeObserver !== 'undefined') {
          observer = new ResizeObserver(entries => {
            const size = entries[0]?.contentRect
            if (size) {
              if (arranged.value.width !== size.width || arranged.value.height !== size.height) arranged.value = { width: size.width, height: size.height }
              hasArrangedSize.value = true
            }
          })
          observer.observe(root.value)
        }
      })
      onUpdated(measure)
      onBeforeUnmount(() => observer?.disconnect())
      expose({ ...properties, Element: root, ActualWidth: computed(() => arranged.value.width), ActualHeight: computed(() => arranged.value.height) })
      const markerId = (end: string) => `win-shape-${instance?.uid}-${end}`
      const capMarker = (property: string, end: string) => {
        const cap = value(property)
        if (cap === 'Flat') return null
        // Caps extend beyond the flat stroke endpoint. Their inner half must not
        // overlap the stroke body or a translucent brush would be composited twice.
        const graphic = cap === 'Round' ? h('path', { d: 'M 0,-.5 A .5,.5 0 0 1 0,.5 Z' })
          : cap === 'Square' ? h('rect', { x: 0, y: -.5, width: .5, height: 1 })
          : h('polygon', { points: '0,-.5 .5,0 0,.5' })
        const brush = value('Stroke')
        return h('marker', { id: markerId(end), markerUnits: 'strokeWidth', markerWidth: 1, markerHeight: 1, refX: 0, refY: 0, viewBox: '-.5 -.5 1 1', orient: 'auto-start-reverse', overflow: 'visible', fill: paint('Stroke'), opacity: name !== 'Line' && (isSolidColorBrush(brush) || isRadialGradientBrush(brush)) ? brush.Opacity : undefined }, [graphic])
      }
      const lineCap = (kind: unknown, location: Point, direction: Point) => {
        if (kind === 'Flat') return null
        const half = strokeThickness.value / 2
        const normal: Point = [-direction[1], direction[0]]
        const at = (forward: number, side: number): Point => [location[0] + direction[0] * forward + normal[0] * side, location[1] + direction[1] * forward + normal[1] * side]
        const d = kind === 'Round' ? `M ${at(0, -half).join(',')} A ${half},${half} 0 0 1 ${at(0, half).join(',')} Z`
          : kind === 'Square' ? `M ${at(0, -half).join(',')} L ${at(half, -half).join(',')} L ${at(half, half).join(',')} L ${at(0, half).join(',')} Z`
          : `M ${at(0, -half).join(',')} L ${at(half, 0).join(',')} L ${at(0, half).join(',')} Z`
        // Root coordinates preserve non-scaling stroke caps and give radial
        // brushes one shared coordinate space for the body and every cap.
        return d
      }
      type LineInterval = { first: number; last: number; startCap: unknown; endCap: unknown }
      const lineStrokeBounds = (intervals?: LineInterval[]): RadialGradientPaintBounds => {
        const [start, end] = linePoints.value
        const length = Math.hypot(end[0] - start[0], end[1] - start[1])
        const direction: Point = length ? [(end[0] - start[0]) / length, (end[1] - start[1]) / length] : [1, 0]
        const normal: Point = [-direction[1], direction[0]], half = strokeThickness.value / 2
        const at = (distance: number, side = 0): Point => [start[0] + direction[0] * distance + normal[0] * side, start[1] + direction[1] * distance + normal[1] * side]
        const parts = intervals ?? [{ first: 0, last: length, startCap: value('StrokeStartLineCap'), endCap: value('StrokeEndLineCap') }]
        const points: Point[] = []
        const addCap = (kind: unknown, distance: number, outward: number) => {
          const location = at(distance)
          if (kind === 'Square') points.push(at(distance + outward * half, -half), at(distance + outward * half, half))
          else if (kind === 'Triangle') points.push(at(distance + outward * half))
          else if (kind === 'Round') for (const axis of [[half, 0], [-half, 0], [0, half], [0, -half]] as Point[]) {
            if ((axis[0] * direction[0] + axis[1] * direction[1]) * outward >= -1e-8) points.push([location[0] + axis[0], location[1] + axis[1]])
          }
        }
        for (const part of parts) {
          points.push(at(part.first, -half), at(part.first, half), at(part.last, -half), at(part.last, half))
          addCap(part.startCap, part.first, -1); addCap(part.endCap, part.last, 1)
        }
        if (!points.length) return { X: start[0], Y: start[1], Width: 0, Height: 0 }
        const x = points.map(point => point[0]), y = points.map(point => point[1])
        const X = Math.min(...x), Y = Math.min(...y)
        return { X, Y, Width: Math.max(...x) - X, Height: Math.max(...y) - Y }
      }
      const dashedLine = (dash: number[]) => {
        const [start, end] = linePoints.value
        const length = Math.hypot(end[0] - start[0], end[1] - start[1])
        const pattern = dash.length % 2 ? [...dash, ...dash] : dash
        const cycle = pattern.reduce((total, value) => total + value, 0)
        if (!length || !cycle) return null
        const at = (distance: number): Point => [start[0] + (end[0] - start[0]) * distance / length, start[1] + (end[1] - start[1]) * distance / length]
        const direction: Point = [(end[0] - start[0]) / length, (end[1] - start[1]) / length]
        let phase = ((numeric('StrokeDashOffset') * strokeThickness.value % cycle) + cycle) % cycle
        let index = 0
        while (phase >= pattern[index] && index < pattern.length - 1) { phase -= pattern[index]; index++ }
        let distance = -phase
        const caps: (string | null)[] = []
        const segments: string[] = []
        const intervals: LineInterval[] = []
        // Each interval consumes one entry, including zero-length entries. A finite
        // cycle guarantees progress and preserves dot dashes with Round/Square caps.
        while (distance < length) {
          const next = distance + pattern[index]
          if (index % 2 === 0 && next >= 0) {
            const first = Math.max(0, distance), last = Math.min(length, next)
            segments.push(`M ${at(first).join(',')} L ${at(last).join(',')}`)
            const startCap = first === 0 ? value('StrokeStartLineCap') : value('StrokeDashCap')
            const endCap = last === length ? value('StrokeEndLineCap') : value('StrokeDashCap')
            intervals.push({ first, last, startCap, endCap })
            caps.push(lineCap(startCap, at(first), [-direction[0], -direction[1]]), lineCap(endCap, at(last), direction))
          }
          distance = next
          index = (index + 1) % pattern.length
        }
        return { data: segments.join(' '), caps, intervals }
      }
      return () => {
        const dash = coordinates(value('StrokeDashArray')).map(length => Math.max(0, length) * strokeThickness.value)
        const brushOpacity = (property: string) => {
          const brush = value(property)
          return isSolidColorBrush(brush) || isRadialGradientBrush(brush) ? brush.Opacity : undefined
        }
        const lineDash = name === 'Line' && dash.length ? dashedLine(dash) : null
        const strokeBounds = name === 'Line' ? lineStrokeBounds(lineDash?.intervals) : undefined
        const brushDefinitions = ['Fill', 'Stroke'].flatMap(property => {
          const brush = value(property)
          return isRadialGradientBrush(brush) ? [radialGradientPaint(brush, `win-shape-${instance?.uid}-${property}`, property === 'Stroke' ? strokeBounds : undefined).definition] : []
        })
        const renderData = name === 'Line' ? lineDash?.data ?? `M ${linePoints.value[0].join(',')} L ${linePoints.value[1].join(',')}` : data.value
        const caps = lineDash?.caps ?? (name === 'Line' ? (() => {
          const [start, end] = linePoints.value
          const length = Math.hypot(end[0] - start[0], end[1] - start[1])
          const direction: Point = length ? [(end[0] - start[0]) / length, (end[1] - start[1]) / length] : [1, 0]
          return [lineCap(value('StrokeStartLineCap'), start, [-direction[0], -direction[1]]), lineCap(value('StrokeEndLineCap'), end, direction)]
        })() : [])
        const lineOutline = name === 'Line' ? (() => {
          const [start, end] = linePoints.value
          const length = Math.hypot(end[0] - start[0], end[1] - start[1])
          const direction: Point = length ? [(end[0] - start[0]) / length, (end[1] - start[1]) / length] : [1, 0]
          const half = strokeThickness.value / 2
          const at = (distance: number, side: number): Point => [start[0] + direction[0] * distance - direction[1] * side, start[1] + direction[1] * distance + direction[0] * side]
          const intervals = lineDash?.intervals ?? [{ first: 0, last: length }]
          // Every contour has the same winding direction. A single fill paints
          // their union once, including Color/GradientStop alpha at overlapping caps.
          const bodies = intervals.map(part => `M ${at(part.first, -half).join(',')} L ${at(part.last, -half).join(',')} L ${at(part.last, half).join(',')} L ${at(part.first, half).join(',')} Z`)
          return [...bodies, ...caps.filter(Boolean)].join(' ')
        })() : ''
        // A Line has one stroke brush and no filled region. Composite the whole
        // stroke once so overlapping dash caps preserve the brush's opacity.
        const lineOpacity = name === 'Line' ? { opacity: finiteNumber(value('Opacity'), 1) * (brushOpacity('Stroke') ?? 1) } : {}
        return h('svg', {
          ...attrs, ref: root, class: [attrs.class, `win-shape win-${name.toLowerCase()}`],
          'data-stack-panel-width': value('Width') === '' ? 'Auto' : String(value('Width')),
          'data-stack-panel-horizontal-alignment': value('HorizontalAlignment'),
          width: extent('Width', naturalSize.value.width), height: extent('Height', naturalSize.value.height),
          style: [attrs.style, { display: 'block', flex: '0 0 auto', overflow: 'visible', ...frameworkLayoutStyle(Object.fromEntries(Object.keys(defaults).map(property => [property, value(property)])), instance), ...lineOpacity, ...(value('Visibility') === false ? { display: 'none' } : {}), ...(value('IsHitTestVisible') === false || value('IsHitTestVisible') === 'False' ? { pointerEvents: 'none' } : {}), ...(value('Stretch') === 'UniformToFill' || (value('Width') !== '' && value('Height') !== '') ? { overflow: 'hidden' } : {}) }],
          'aria-hidden': true
        }, [
          h('defs', null, [...(name === 'Line' ? [h('path', { ref: outline, class: 'win-shape-centerline', d: renderData })] : [capMarker('StrokeStartLineCap', 'start'), capMarker('StrokeEndLineCap', 'end')]), ...brushDefinitions, ...normalizeXamlNodes((slots.default?.() ?? []).filter(node => !isBrushProperty(node)), instance)]),
          h('path', {
            ref: name === 'Line' ? undefined : outline, class: 'win-shape-paint', d: name === 'Line' ? lineOutline : renderData, transform: name === 'Line' ? undefined : transform.value,
            stroke: name === 'Line' ? 'none' : paint('Stroke'), fill: name === 'Line' ? paint('Stroke') : paint('Fill'), 'stroke-width': strokeThickness.value,
            'stroke-opacity': name === 'Line' ? undefined : brushOpacity('Stroke'), 'fill-opacity': name === 'Line' ? undefined : brushOpacity('Fill'),
            'stroke-linejoin': String(value('StrokeLineJoin')).toLowerCase(), 'stroke-miterlimit': numeric('StrokeMiterLimit'),
            'stroke-linecap': dash.length && !lineDash ? ({ Round: 'round', Square: 'square' } as Record<string, string>)[String(value('StrokeDashCap'))] ?? 'butt' : 'butt',
            'stroke-dasharray': dash.length && !lineDash ? dash.join(' ') : undefined, 'stroke-dashoffset': numeric('StrokeDashOffset') * strokeThickness.value,
            'marker-start': name === 'Line' || value('StrokeStartLineCap') === 'Flat' ? undefined : `url(#${markerId('start')})`,
            'marker-end': name === 'Line' || value('StrokeEndLineCap') === 'Flat' ? undefined : `url(#${markerId('end')})`,
            'vector-effect': 'non-scaling-stroke', 'fill-rule': name === 'Line' ? 'nonzero' : fillRule.value
          })
        ])
      }
    }
  })
}

export const Line = Object.assign(shape('Line', { X1: 0, X2: 0, Y1: 0, Y2: 0 }), { Fill: brushProperty('Line', 'Fill'), Stroke: brushProperty('Line', 'Stroke') })
export const Polyline = Object.assign(shape('Polyline', { Points: '', FillRule: 'EvenOdd' }), { Fill: brushProperty('Polyline', 'Fill'), Stroke: brushProperty('Polyline', 'Stroke') })
export const Path = Object.assign(shape('Path', { Data: '' }), { Data: PathData, Fill: brushProperty('Path', 'Fill'), Stroke: brushProperty('Path', 'Stroke') })
