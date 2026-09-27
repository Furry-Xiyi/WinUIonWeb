import { attachedValue, boolValue, cssLength, xamlThickness } from './layout'

type Axis = 0 | 1
type Relation = 'LeftOf' | 'Above' | 'RightOf' | 'Below' | 'AlignLeftWith' | 'AlignTopWith' | 'AlignRightWith' | 'AlignBottomWith' | 'AlignHorizontalCenterWith' | 'AlignVerticalCenterWith'
type PanelRelation = 'AlignLeftWithPanel' | 'AlignTopWithPanel' | 'AlignRightWithPanel' | 'AlignBottomWithPanel' | 'AlignHorizontalCenterWithPanel' | 'AlignVerticalCenterWithPanel'
type AxisRect = { start: number; size: number }
export type RelativePanelItem = {
  name?: string
  desiredSize: [number, number]
  relations?: Partial<Record<Relation, string>>
  panelRelations?: Partial<Record<PanelRelation, boolean>>
}
type Node = RelativePanelItem & {
  targets: Partial<Record<Relation, Node>>
  rect: [AxisRect, AxisRect]
  state: 'unresolved' | 'pending' | 'measured'
}
const axes = [
  { start: 'AlignLeftWith', end: 'AlignRightWith', center: 'AlignHorizontalCenterWith', after: 'RightOf', before: 'LeftOf', startPanel: 'AlignLeftWithPanel', endPanel: 'AlignRightWithPanel', centerPanel: 'AlignHorizontalCenterWithPanel' },
  { start: 'AlignTopWith', end: 'AlignBottomWith', center: 'AlignVerticalCenterWith', after: 'Below', before: 'Above', startPanel: 'AlignTopWithPanel', endPanel: 'AlignBottomWithPanel', centerPanel: 'AlignVerticalCenterWithPanel' }
] as const
const relations: Relation[] = ['LeftOf', 'Above', 'RightOf', 'Below', 'AlignLeftWith', 'AlignTopWith', 'AlignRightWith', 'AlignBottomWith', 'AlignHorizontalCenterWith', 'AlignVerticalCenterWith']
const panelRelations: PanelRelation[] = ['AlignLeftWithPanel', 'AlignTopWithPanel', 'AlignRightWithPanel', 'AlignBottomWithPanel', 'AlignHorizontalCenterWithPanel', 'AlignVerticalCenterWithPanel']
const anchorFlags = (node: Node, axis: Axis) => {
  const keys = axes[axis]
  const target = node.targets
  const panel = node.panelRelations ?? {}
  const start = Boolean(panel[keys.startPanel] || target[keys.start] || (target[keys.after] && !target[keys.center]))
  const end = Boolean(panel[keys.endPanel] || target[keys.end] || (target[keys.before] && !target[keys.center]))
  const center = Boolean((panel[keys.centerPanel] && !panel[keys.startPanel] && !panel[keys.endPanel] && !target[keys.start] && !target[keys.end] && !target[keys.before] && !target[keys.after]) || (target[keys.center] && !panel[keys.startPanel] && !panel[keys.endPanel] && !target[keys.start] && !target[keys.end]))
  return { start, end, center }
}

// These constraints and their precedence follow RPGraph::CalculateMeasureRect.
const measureRect = (node: Node, axis: Axis, available: number): AxisRect => {
  if (!Number.isFinite(available)) return { start: 0, size: available }
  const keys = axes[axis]
  const target = node.targets
  const panel = node.panelRelations ?? {}
  let start = 0
  let end = available
  let centerFromStart = false
  let centerFromEnd = false
  if (!panel[keys.startPanel]) {
    const align = target[keys.start]
    const after = target[keys.after]
    if (align) start = align.rect[axis].start
    else if (target[keys.center]) centerFromStart = true
    else if (after) start = after.rect[axis].start + after.rect[axis].size
  }
  if (!panel[keys.endPanel]) {
    const align = target[keys.end]
    const before = target[keys.before]
    if (align) end = align.rect[axis].start + align.rect[axis].size
    else if (target[keys.center]) centerFromEnd = true
    else if (before) end = before.rect[axis].start
  }
  if (centerFromStart && centerFromEnd) {
    const neighbor = target[keys.center]!.rect[axis]
    const center = neighbor.start + neighbor.size / 2
    const size = Math.min(center, available - center) * 2
    return { start: center - size / 2, size }
  }
  return { start, size: end - start }
}
const arrangeRect = (node: Node, axis: Axis, available: number) => {
  const measure = measureRect(node, axis, available)
  const desired = Math.min(measure.size, node.desiredSize[axis])
  const anchor = anchorFlags(node, axis)
  let start = measure.start
  let size = desired
  if (anchor.start && anchor.end) size = measure.size
  else if (!anchor.start && anchor.end) start += measure.size - desired
  else if (!anchor.start && anchor.center) start += (measure.size - desired) / 2
  node.rect[axis] = { start, size }
}

// RPGraph calculates desired size by walking effective constraints from leaves.
// Measuring a right/bottom/center anchored child against the panel's current
// size would otherwise incorrectly make an automatic panel depend on that size.
const desiredAxisSize = (nodes: Node[], axis: Axis) => {
  const keys = axes[axis]
  const leaves = new Set(nodes)
  for (const node of nodes) {
    const target = node.targets
    const panel = node.panelRelations ?? {}
    let centerFromStart = false
    let centerFromEnd = false
    if (!panel[keys.startPanel]) {
      if (target[keys.start]) leaves.delete(target[keys.start]!)
      else if (target[keys.center]) centerFromStart = true
      else if (target[keys.after]) leaves.delete(target[keys.after]!)
    }
    if (!panel[keys.endPanel]) {
      if (target[keys.end]) leaves.delete(target[keys.end]!)
      else if (target[keys.center]) centerFromEnd = true
      else if (target[keys.before]) leaves.delete(target[keys.before]!)
    }
    if (centerFromStart && centerFromEnd) leaves.delete(target[keys.center]!)
  }
  let desired = 0
  for (const leaf of leaves) {
    let min = 0
    let max = 0
    let minCapped = false
    let maxCapped = false
    const accumulate = (node: Node, cursor: number, positive: boolean) => {
      const initial = cursor
      const size = node.desiredSize[axis]
      const target = node.targets
      const panel = node.panelRelations ?? {}
      let centerFromStart = false
      let centerFromEnd = false
      cursor += positive ? size : -size
      if (positive) max = Math.max(max, cursor)
      else min = Math.min(min, cursor)
      const firstPanel = positive ? keys.startPanel : keys.endPanel
      const firstAlign = positive ? keys.start : keys.end
      const secondAlign = positive ? keys.end : keys.start
      const firstSibling = positive ? keys.after : keys.before
      const secondSibling = positive ? keys.before : keys.after
      if (panel[firstPanel]) {
        if (positive && !maxCapped) { max = cursor; maxCapped = true }
        else if (!positive && !minCapped) { min = cursor; minCapped = true }
      } else if (target[firstAlign]) {
        if (target[firstAlign] !== target[secondAlign]) accumulate(target[firstAlign]!, cursor, !positive)
      } else if (target[keys.center]) centerFromStart = true
      else if (target[firstSibling]) accumulate(target[firstSibling]!, cursor, positive)
      const secondPanel = positive ? keys.endPanel : keys.startPanel
      if (panel[secondPanel]) {
        if (positive) { min = minCapped ? Math.min(min, initial) : initial; minCapped = true }
        else { max = maxCapped ? Math.max(max, initial) : initial; maxCapped = true }
      } else if (target[secondAlign]) accumulate(target[secondAlign]!, initial, positive)
      else if (target[keys.center]) centerFromEnd = true
      else if (target[secondSibling]) accumulate(target[secondSibling]!, initial, !positive)
      if (centerFromStart && centerFromEnd) {
        const neighbor = target[keys.center]!
        const center = cursor + (positive ? -size : size) / 2
        const edge = center + (positive ? -neighbor.desiredSize[axis] : neighbor.desiredSize[axis]) / 2
        if (positive) min = Math.min(min, edge)
        else max = Math.max(max, edge)
        accumulate(neighbor, edge, positive)
      } else if (anchorFlags(node, axis).center) {
        const center = cursor + (positive ? -size : size) / 2
        max = Math.max(max - center, center - min) * 2
        min = 0
      }
    }
    accumulate(leaf, 0, true)
    desired = Math.max(desired, max - min)
  }
  return desired
}

export const resolveRelativePanelLayout = (
  items: RelativePanelItem[],
  availableSize: [number, number],
  finalSize?: [number, number],
  measure?: (index: number, available: [number, number]) => [number, number]
) => {
  const nodes: Node[] = items.map((item) => ({ ...item, desiredSize: [...item.desiredSize], targets: {}, rect: [{ start: 0, size: 0 }, { start: 0, size: 0 }], state: 'unresolved' }))
  const named = new Map(nodes.filter((node) => node.name).map((node) => [node.name!, node]))
  for (const node of nodes) {
    for (const relation of relations) {
      const name = node.relations?.[relation]
      if (!name) continue
      const target = named.get(name)
      if (!target) throw new Error(`RelativePanel: no child named '${name}' was found.`)
      node.targets[relation] = target
    }
  }
  const visit = (node: Node) => {
    if (node.state === 'pending') throw new Error('RelativePanel: circular dependency detected.')
    if (node.state === 'measured') return
    node.state = 'pending'
    for (const relation of relations) if (node.targets[relation]) visit(node.targets[relation]!)
    const constrained: [number, number] = [Math.max(0, measureRect(node, 0, availableSize[0]).size), Math.max(0, measureRect(node, 1, availableSize[1]).size)]
    if (measure) node.desiredSize = measure(nodes.indexOf(node), constrained)
    node.desiredSize = node.desiredSize.map((size, axis) => Math.max(0, Math.min(size, constrained[axis]!))) as [number, number]
    node.state = 'measured'
    for (const axis of [0, 1] as const) if (Number.isFinite(availableSize[axis])) arrangeRect(node, axis, availableSize[axis])
  }
  nodes.forEach(visit)
  const desiredSize: [number, number] = [desiredAxisSize(nodes, 0), desiredAxisSize(nodes, 1)]
  const final: [number, number] = finalSize ?? availableSize.map((size, axis) => Number.isFinite(size) ? size : desiredSize[axis]!) as [number, number]
  for (const axis of [0, 1] as const) {
    const arranged = new Set<Node>()
    const arrange = (node: Node) => {
      if (arranged.has(node)) return
      for (const relation of relations) if (node.targets[relation]) arrange(node.targets[relation]!)
      arrangeRect(node, axis, final[axis])
      arranged.add(node)
    }
    nodes.forEach(arrange)
  }
  return { desiredSize, measuredSizes: nodes.map((node) => node.desiredSize), rectangles: nodes.map((node) => ({ x: Math.max(0, node.rect[0].start), y: Math.max(0, node.rect[1].start), width: Math.max(0, node.rect[0].size), height: Math.max(0, node.rect[1].size) })) }
}

const managedProperties = ['position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'margin', 'maxWidth', 'maxHeight', 'boxSizing', 'display'] as const
type ManagedProperty = typeof managedProperties[number]
type StyleSnapshot = Record<ManagedProperty, string>
const childStyles = new WeakMap<HTMLElement, { input: StyleSnapshot; output: StyleSnapshot; outputCssText: string }>()
const number = (value: string) => Number.parseFloat(value) || 0
const snapshot = (element: HTMLElement): StyleSnapshot => Object.fromEntries(managedProperties.map((key) => [key, element.style[key]])) as StyleSnapshot
export const relativePanelStyleChanged = (element: HTMLElement) => {
  const previous = childStyles.get(element)
  return !previous || element.style.cssText !== previous.outputCssText
}
const restoreInputStyles = (element: HTMLElement) => {
  const previous = childStyles.get(element)
  const current = snapshot(element)
  const input = { ...current }
  if (previous) for (const key of managedProperties) if (current[key] === previous.output[key]) input[key] = previous.input[key]
  for (const key of managedProperties) element.style[key] = input[key]
  return input
}
const sizeAttribute = (element: HTMLElement, property: string, fallback: number) => {
  const value = attachedValue(element, property)
  return value !== undefined && Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : fallback
}
const clampSize = (size: number, minimum: string, maximum: string) => Math.max(number(minimum), maximum === 'none' ? size : Math.min(size, number(maximum)))

export const arrangeRelativePanel = (root: HTMLElement, options: { autoWidth: boolean; autoHeight: boolean; minimumHeight?: number }) => {
  const rootStyle = getComputedStyle(root)
  const padding: [number, number, number, number] = [number(rootStyle.paddingLeft), number(rootStyle.paddingTop), number(rootStyle.paddingRight), number(rootStyle.paddingBottom)]
  const chrome: [number, number] = [padding[0] + padding[2] + number(rootStyle.borderLeftWidth) + number(rootStyle.borderRightWidth), padding[1] + padding[3] + number(rootStyle.borderTopWidth) + number(rootStyle.borderBottomWidth)]
  const children = Array.from(root.children).filter((child): child is HTMLElement => child instanceof HTMLElement && !child.classList.contains('win-acrylic-visual'))
  const inputs = children.map((child) => {
    restoreInputStyles(child)
    for (const property of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) {
      const value = attachedValue(child, property)
      const cssProperty = ({ Width: 'width', Height: 'height', MinWidth: 'minWidth', MinHeight: 'minHeight', MaxWidth: 'maxWidth', MaxHeight: 'maxHeight' } as const)[property]
      if (value !== undefined) child.style[cssProperty] = cssLength(value)
    }
    const margin = attachedValue(child, 'Margin')
    const padding = attachedValue(child, 'Padding')
    const visibility = attachedValue(child, 'Visibility')
    if (margin !== undefined) child.style.margin = xamlThickness(margin)
    if (padding !== undefined) child.style.padding = xamlThickness(padding)
    if (visibility === 'Collapsed') child.style.display = 'none'
    else if (visibility === 'Visible') child.style.display = ''
    return snapshot(child)
  })
  const maximums = children.map((child) => {
    const style = getComputedStyle(child)
    return [style.maxWidth === 'none' ? Infinity : number(style.maxWidth), style.maxHeight === 'none' ? Infinity : number(style.maxHeight)] as const
  })
  const margins = children.map((child) => {
    const style = getComputedStyle(child)
    return [number(style.marginLeft), number(style.marginTop), number(style.marginRight), number(style.marginBottom)] as const
  })
  const naturalSizes = children.map((child) => {
    child.style.position = 'absolute'
    child.style.left = '0px'
    child.style.top = '0px'
    child.style.right = 'auto'
    child.style.bottom = 'auto'
    const style = getComputedStyle(child)
    return style.display === 'none' || attachedValue(child, 'Visibility') === 'Collapsed' ? [0, 0] as const : [child.offsetWidth, child.offsetHeight] as const
  })
  const items: RelativePanelItem[] = children.map((child, index) => ({
    name: attachedValue(child, 'data-xaml-ref') ?? attachedValue(child, 'x:Name') ?? attachedValue(child, 'Name'),
    desiredSize: [naturalSizes[index]![0], naturalSizes[index]![1]],
    relations: Object.fromEntries(relations.map((relation) => [relation, attachedValue(child, `RelativePanel.${relation}`)])),
    panelRelations: Object.fromEntries(panelRelations.map((relation) => [relation, boolValue(attachedValue(child, `RelativePanel.${relation}`))]))
  }))
  const available: [number, number] = [options.autoWidth ? Infinity : Math.max(0, root.clientWidth - padding[0] - padding[2]), options.autoHeight ? Infinity : Math.max(0, root.clientHeight - padding[1] - padding[3])]
  const measure = (index: number, constrained: [number, number]): [number, number] => {
    const child = children[index]!
    const margin = margins[index]!
    if (naturalSizes[index]![0] === 0 && naturalSizes[index]![1] === 0 && (getComputedStyle(child).display === 'none' || attachedValue(child, 'Visibility') === 'Collapsed')) return [0, 0]
    if (Number.isFinite(constrained[0])) child.style.maxWidth = `${Math.max(0, Math.min(maximums[index]![0], constrained[0] - margin[0] - margin[2]))}px`
    if (Number.isFinite(constrained[1])) child.style.maxHeight = `${Math.max(0, Math.min(maximums[index]![1], constrained[1] - margin[1] - margin[3]))}px`
    return [Math.max(0, child.offsetWidth + margin[0] + margin[2]), Math.max(0, child.offsetHeight + margin[1] + margin[3])]
  }
  const measured = resolveRelativePanelLayout(items, available, undefined, measure)
  const outerWidth = options.autoWidth ? clampSize(measured.desiredSize[0] + chrome[0], rootStyle.minWidth, rootStyle.maxWidth) : root.offsetWidth
  const desiredHeight = clampSize(measured.desiredSize[1] + chrome[1], `${options.minimumHeight ?? 0}px`, rootStyle.maxHeight)
  const outerHeight = options.autoHeight ? Math.max(desiredHeight, root.offsetHeight) : root.offsetHeight
  const final: [number, number] = [Math.max(0, outerWidth - chrome[0]), Math.max(0, outerHeight - chrome[1])]
  const arranged = resolveRelativePanelLayout(items.map((item, index) => ({ ...item, desiredSize: measured.measuredSizes[index]! })), available, final)
  children.forEach((child, index) => {
    const rect = arranged.rectangles[index]!
    const margin = margins[index]!
    const input = inputs[index]!
    const horizontal = attachedValue(child, 'HorizontalAlignment') ?? 'Stretch'
    const vertical = attachedValue(child, 'VerticalAlignment') ?? 'Stretch'
    const slotWidth = Math.max(0, rect.width - margin[0] - margin[2])
    const slotHeight = Math.max(0, rect.height - margin[1] - margin[3])
    const fixedWidth = input.width !== '' && input.width !== 'auto'
    const fixedHeight = input.height !== '' && input.height !== 'auto'
    const width = horizontal === 'Stretch' && !fixedWidth ? slotWidth : Math.min(slotWidth, sizeAttribute(child, 'Width', naturalSizes[index]![0]))
    const height = vertical === 'Stretch' && !fixedHeight ? slotHeight : Math.min(slotHeight, sizeAttribute(child, 'Height', naturalSizes[index]![1]))
    const xOffset = horizontal === 'Right' ? slotWidth - width : horizontal === 'Center' || (horizontal === 'Stretch' && fixedWidth) ? (slotWidth - width) / 2 : 0
    const yOffset = vertical === 'Bottom' ? slotHeight - height : vertical === 'Center' || (vertical === 'Stretch' && fixedHeight) ? (slotHeight - height) / 2 : 0
    child.style.margin = '0px'
    child.style.boxSizing = 'border-box'
    child.style.left = `${padding[0] + rect.x + margin[0] + xOffset}px`
    child.style.top = `${padding[1] + rect.y + margin[1] + yOffset}px`
    child.style.width = `${width}px`
    child.style.height = `${height}px`
    child.style.maxWidth = input.maxWidth
    child.style.maxHeight = input.maxHeight
    childStyles.set(child, { input, output: snapshot(child), outputCssText: child.style.cssText })
  })
  return { width: outerWidth, height: options.autoHeight ? desiredHeight : outerHeight }
}
