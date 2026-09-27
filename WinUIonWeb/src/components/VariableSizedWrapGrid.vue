<template>
  <div ref="root" class="win-variable-sized-wrap-grid" :style="rootStyle" :HorizontalAlignment="resolve(props.HorizontalAlignment)" :VerticalAlignment="resolve(props.VerticalAlignment)">
    <XamlChildren />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export const VariableSizedWrapGridResources = defineComponent({
  name: 'VariableSizedWrapGrid.Resources',
  setup() { return () => null }
})

export default { Resources: VariableSizedWrapGridResources }
</script>

<script setup lang="ts">
import { cloneVNode, computed, Fragment, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch, type VNode } from 'vue'
import { alignment, attachedValue, cssLength, useLayoutObserver, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding } from './xamlRuntime'

const props = defineProps({
  Orientation: { type: String, default: 'Vertical' },
  ItemWidth: { type: [String, Number], default: Number.NaN },
  ItemHeight: { type: [String, Number], default: Number.NaN },
  MaximumRowsOrColumns: { type: [String, Number], default: -1 },
  HorizontalChildrenAlignment: { type: String, default: 'Left' },
  VerticalChildrenAlignment: { type: String, default: 'Top' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 },
  MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Background: { type: [String, Object], default: '' },
  Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' }
})

const instance = getCurrentInstance()
const emit = defineEmits(['update:Orientation'])
const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const orientationOverride = ref<string | null>(null)
const Orientation = computed({
  get: () => orientationOverride.value ?? String(resolve(props.Orientation) ?? 'Vertical'),
  set: (value: string) => {
    if (value !== 'Vertical' && value !== 'Horizontal') return
    orientationOverride.value = value
    updateXamlBinding(props.Orientation, value, instance)
    emit('update:Orientation', value)
  }
})
watch(() => resolve(props.Orientation), () => { orientationOverride.value = null })
defineExpose({ Orientation })

const nodeName = (node: VNode) => {
  const type = node.type as { name?: string; __name?: string } | string
  return typeof type === 'string' ? type : type?.name ?? type?.__name ?? ''
}
const childrenOf = (node: VNode): VNode[] => {
  if (Array.isArray(node.children)) return node.children as VNode[]
  const children = node.children as { default?: () => VNode[] } | null
  return children?.default?.() ?? []
}
const flatten = (nodes: VNode[]): VNode[] => nodes.flatMap(node => node.type === Fragment ? flatten(childrenOf(node)) : [node])
const XamlChildren = () => {
  const nodes = flatten(slots.default?.() ?? [])
  const styles: Record<string, Record<string, unknown>> = {}
  for (const resource of nodes.filter(node => nodeName(node) === 'VariableSizedWrapGrid.Resources')) {
    for (const style of flatten(childrenOf(resource))) {
      if (nodeName(style) !== 'Style' || style.props?.['x:Key']) continue
      const target = String(style.props?.TargetType ?? '').split(':').pop() ?? ''
      const defaults: Record<string, unknown> = {}
      for (const setter of flatten(childrenOf(style))) {
        if (nodeName(setter) === 'Setter' && typeof setter.props?.Property === 'string') defaults[setter.props.Property] = resolve(setter.props.Value)
      }
      styles[target] = defaults
    }
  }
  const applyStyles = (node: VNode): VNode => {
    const clone = cloneVNode(node, { ...styles[nodeName(node)], ...node.props })
    if (Array.isArray(node.children)) clone.children = (node.children as VNode[]).map(child => child && typeof child === 'object' && 'type' in child ? applyStyles(child) : child)
    else if (node.children && typeof node.children === 'object') {
      const children = { ...node.children } as Record<string, unknown>
      for (const [name, slot] of Object.entries(children)) {
        if (typeof slot === 'function') children[name] = (...args: unknown[]) => (slot as (...args: unknown[]) => VNode[])(...args).map(applyStyles)
      }
      clone.children = children as VNode['children']
    }
    return clone
  }
  return normalizeXamlNodes(nodes.filter(node => nodeName(node) !== 'VariableSizedWrapGrid.Resources').map(applyStyles), instance)
}
const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  for (const [name, value] of Object.entries({
    Width: props.Width, Height: props.Height, MinWidth: props.MinWidth,
    MinHeight: props.MinHeight, MaxWidth: props.MaxWidth, MaxHeight: props.MaxHeight
  })) {
    const resolved = resolve(value)
    if (resolved !== '' && resolved != null && !Number.isNaN(Number(resolved))) {
      style[name[0].toLowerCase() + name.slice(1)] = cssLength(resolved)
    }
  }
  const background = resolve(props.Background)
  if (background) style.background = String(background)
  const margin = resolve(props.Margin)
  if (margin !== '' && margin != null) style.margin = xamlThickness(margin)
  style.justifySelf = alignment(resolve(props.HorizontalAlignment), 'horizontal')
  style.alignSelf = alignment(resolve(props.VerticalAlignment), 'vertical')
  return style
})

type Tile = { element: HTMLElement; rowSpan: number; columnSpan: number }
type Placement = { tile: Tile; row: number; column: number; rows: number; columns: number }
type LayoutMap = { placements: Placement[]; usedRows: number; usedColumns: number }
const observedChildren = new Set<HTMLElement>()
let childResizeObserver: ResizeObserver | undefined

const span = (element: HTMLElement, name: string) => {
  const value = Number(attachedValue(element, `VariableSizedWrapGrid.${name}`))
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1
}
const dimension = (value: unknown) => {
  const resolved = resolve(value)
  if (resolved === '' || resolved == null) return Number.NaN
  const number = Number(resolved)
  return Number.isFinite(number) ? Math.max(0, number) : Number.NaN
}

// OccupancyMap keeps its cursor between items. Earlier gaps are intentionally
// not revisited; the map truncates spans at its finite growing boundary.
const createOccupancyMap = (tiles: Tile[], maximumRows: number, maximumColumns: number, horizontal: boolean): LayoutMap => {
  const occupied = new Set<string>()
  const placements: Placement[] = []
  let row = 0
  let column = 0
  let usedRows = 0
  let usedColumns = 0
  for (const tile of tiles) {
    const rows = Math.min(horizontal ? tile.columnSpan : tile.rowSpan, maximumRows)
    let columns = Math.min(horizontal ? tile.rowSpan : tile.columnSpan, maximumColumns)
    let found = false
    while (column < maximumColumns) {
      if (row === maximumRows) { row = 0; column += 1 }
      let isOccupied = true
      for (let x = 0; x < columns; x += 1) {
        if (column + x >= maximumColumns) {
          columns = maximumColumns - column
          break
        }
        for (let y = 0; y < rows; y += 1) {
          isOccupied = row + y >= maximumRows || occupied.has(`${row + y}:${column + x}`)
          if (isOccupied) break
        }
        if (isOccupied) break
      }
      if (!isOccupied) { found = true; break }
      row += 1
      if (row === maximumRows || row + rows > maximumRows) { row = 0; column += 1 }
    }
    if (!found || column >= maximumColumns) break
    for (let x = 0; x < columns; x += 1) {
      for (let y = 0; y < rows; y += 1) occupied.add(`${row + y}:${column + x}`)
    }
    placements.push({ tile, row, column, rows, columns })
    usedRows = Math.max(usedRows, row + rows)
    usedColumns = Math.max(usedColumns, column + columns)
  }
  return { placements, usedRows, usedColumns }
}

const alignmentOffsets = (name: unknown, available: number, used: number, count: number) => {
  const extra = Number.isFinite(available) ? Math.max(0, available - used) : 0
  if (name === 'Center') return { start: extra / 2, gap: 0 }
  if (name === 'Right' || name === 'Bottom') return { start: extra, gap: 0 }
  if (name === 'Stretch') return { start: 0, gap: extra / (count + 1) }
  return { start: 0, gap: 0 }
}

const firstDesiredSize = (element: HTMLElement, fixedWidth: number, fixedHeight: number) => {
  const previous = { position: element.style.position, width: element.style.width, height: element.style.height }
  element.style.position = 'absolute'
  if (!previous.width || previous.width === 'auto') element.style.width = Number.isNaN(fixedWidth) ? 'max-content' : `${fixedWidth}px`
  if (!previous.height || previous.height === 'auto') element.style.height = Number.isNaN(fixedHeight) ? 'max-content' : `${fixedHeight}px`
  const bounds = element.getBoundingClientRect()
  const style = getComputedStyle(element)
  const width = bounds.width + (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0)
  const height = bounds.height + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0)
  Object.assign(element.style, previous)
  return { width, height }
}

const setStyle = (element: HTMLElement, property: string, value: string) => {
  const style = element.style as unknown as Record<string, string>
  if (style[property] !== value) style[property] = value
}

const measureAvailableWidth = (panel: HTMLElement) => {
  // A shrink-to-fit presenter must measure before its content sets its width.
  // Ordinary panels already have their allocated parent layout width.
  if (!getComputedStyle(panel).getPropertyValue('--flyout-available-width').trim()) return panel.clientWidth
  let inset = 0
  for (let element: HTMLElement | null = panel; element; element = element.parentElement) {
    const style = getComputedStyle(element)
    const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0)
    const border = (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.borderRightWidth) || 0)
    const maximum = style.maxWidth.endsWith('px') ? parseFloat(style.maxWidth) : Number.NaN
    const explicit = element.style.width
    if (element !== panel && explicit.endsWith('px')) {
      return Math.max(0, element.clientWidth - padding - inset)
    }
    if (Number.isFinite(maximum)) return Math.max(0, maximum - padding - border - inset)
    inset += padding + border
      + (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0)
  }
  return panel.clientWidth
}

const arrangeChildren = () => {
  const panel = root.value
  if (!panel) return
  const children = new Set(Array.from(panel.children) as HTMLElement[])
  for (const element of observedChildren) {
    if (!children.has(element)) {
      childResizeObserver?.unobserve(element)
      observedChildren.delete(element)
    }
  }
  const tiles: Tile[] = Array.from(panel.children).map((child) => {
    const element = child as HTMLElement
    if (!observedChildren.has(element) && childResizeObserver) {
      childResizeObserver.observe(element)
      observedChildren.add(element)
    }
    element.removeAttribute('data-vsg-unarranged')
    return { element, rowSpan: span(element, 'RowSpan'), columnSpan: span(element, 'ColumnSpan') }
  })
  if (!tiles.length) {
    setStyle(panel, 'gridTemplateRows', 'none')
    setStyle(panel, 'gridTemplateColumns', 'none')
    return
  }

  const horizontal = Orientation.value === 'Horizontal'
  const specifiedWidth = dimension(props.ItemWidth)
  const specifiedHeight = dimension(props.ItemHeight)
  const desired = firstDesiredSize(tiles[0].element, specifiedWidth * tiles[0].columnSpan, specifiedHeight * tiles[0].rowSpan)
  const itemWidth = Number.isNaN(specifiedWidth) ? desired.width : specifiedWidth
  const itemHeight = Number.isNaN(specifiedHeight) ? desired.height : specifiedHeight
  const width = dimension(props.Width)
  const height = dimension(props.Height)
  const maximumWidth = dimension(props.MaxWidth)
  const maximumHeight = dimension(props.MaxHeight)
  const availableWidth = Math.min(Number.isNaN(width) ? measureAvailableWidth(panel) : width, Number.isNaN(maximumWidth) ? Infinity : maximumWidth)
  const availableHeight = Math.min(Number.isNaN(height) ? Infinity : height, Number.isNaN(maximumHeight) ? Infinity : maximumHeight)
  const directAvailable = horizontal ? availableWidth : availableHeight
  const indirectAvailable = horizontal ? availableHeight : availableWidth
  const directItem = horizontal ? itemWidth : itemHeight
  const indirectItem = horizontal ? itemHeight : itemWidth
  const directTiles = tiles.reduce((total, tile) => total + (horizontal ? tile.columnSpan : tile.rowSpan), 0)
  const indirectTiles = tiles.reduce((total, tile) => total + (horizontal ? tile.rowSpan : tile.columnSpan), 0)
  const maximum = dimension(props.MaximumRowsOrColumns)
  let rows = Math.max(1, Number.isFinite(directAvailable) && directItem > 0 ? Math.floor(directAvailable / directItem) : directTiles)
  if (maximum > 0) rows = Math.min(rows, Math.floor(maximum))
  const columns = Math.max(1, Number.isFinite(indirectAvailable) && indirectItem > 0 ? Math.min(Math.floor(indirectAvailable / indirectItem), indirectTiles) : indirectTiles)
  const map = createOccupancyMap(tiles, rows, columns, horizontal)
  const columnCount = horizontal ? map.usedRows : map.usedColumns
  const rowCount = horizontal ? map.usedColumns : map.usedRows
  const actualWidth = columnCount * itemWidth
  const actualHeight = rowCount * itemHeight
  setStyle(panel, 'gridTemplateColumns', columnCount ? `repeat(${columnCount}, ${itemWidth}px)` : 'none')
  setStyle(panel, 'gridTemplateRows', rowCount ? `repeat(${rowCount}, ${itemHeight}px)` : 'none')
  const horizontalOffsets = alignmentOffsets(resolve(props.HorizontalChildrenAlignment), availableWidth, actualWidth, columnCount)
  const verticalOffsets = alignmentOffsets(resolve(props.VerticalChildrenAlignment), availableHeight, actualHeight, rowCount)
  const arranged = new Set<HTMLElement>()
  for (const [index, placement] of map.placements.entries()) {
    const element = placement.tile.element
    arranged.add(element)
    const physicalRow = horizontal ? placement.column : placement.row
    const physicalColumn = horizontal ? placement.row : placement.column
    const rowSpan = horizontal ? placement.columns : placement.rows
    const columnSpan = horizontal ? placement.rows : placement.columns
    setStyle(element, 'gridRow', `${physicalRow + 1} / span ${rowSpan}`)
    setStyle(element, 'gridColumn', `${physicalColumn + 1} / span ${columnSpan}`)
    // ArrangeOverride restores a leading oversized span without changing the
    // occupancy map or the panel's measured row/column count.
    const arrangedWidth = horizontal && physicalColumn === 0 && placement.tile.columnSpan >= map.usedRows
      ? Math.max(columnSpan * itemWidth, Math.min(placement.tile.columnSpan * itemWidth, availableWidth))
      : columnSpan * itemWidth
    const arrangedHeight = !horizontal && physicalRow === 0 && placement.tile.rowSpan >= map.usedRows
      ? Math.max(rowSpan * itemHeight, Math.min(placement.tile.rowSpan * itemHeight, availableHeight))
      : rowSpan * itemHeight
    const childHorizontal = attachedValue(element, 'HorizontalAlignment')
    const childVertical = attachedValue(element, 'VerticalAlignment')
    const hasWidth = Boolean(element.style.width && element.style.width !== 'auto')
    const hasHeight = Boolean(element.style.height && element.style.height !== 'auto')
    const horizontalAlignment = childHorizontal && childHorizontal !== 'Stretch' ? alignment(childHorizontal, 'horizontal') : hasWidth ? 'center' : 'stretch'
    const verticalAlignment = childVertical && childVertical !== 'Stretch' ? alignment(childVertical, 'vertical') : hasHeight ? 'center' : 'stretch'
    setStyle(element, 'justifySelf', horizontalAlignment)
    setStyle(element, 'alignSelf', verticalAlignment)
    const extraWidth = arrangedWidth - columnSpan * itemWidth
    const extraHeight = arrangedHeight - rowSpan * itemHeight
    element.toggleAttribute('data-vsg-expanded-width', horizontalAlignment === 'stretch' && extraWidth > 0)
    element.toggleAttribute('data-vsg-expanded-height', verticalAlignment === 'stretch' && extraHeight > 0)
    element.style.setProperty('--vsg-arranged-min-width', `${arrangedWidth}px`)
    element.style.setProperty('--vsg-arranged-min-height', `${arrangedHeight}px`)
    const childX = horizontalAlignment === 'center' ? extraWidth / 2 : horizontalAlignment === 'end' ? extraWidth : 0
    const childY = verticalAlignment === 'center' ? extraHeight / 2 : verticalAlignment === 'end' ? extraHeight : 0
    const x = horizontalOffsets.start + horizontalOffsets.gap * (horizontal ? index % map.usedRows + 1 : Math.floor(index / map.usedRows) + 1) + childX
    const y = verticalOffsets.start + verticalOffsets.gap * (horizontal ? Math.floor(index / map.usedRows) + 1 : index % map.usedRows + 1) + childY
    setStyle(element, 'position', 'relative')
    setStyle(element, 'left', `${x}px`)
    setStyle(element, 'top', `${y}px`)
  }
  for (const tile of tiles) {
    if (!arranged.has(tile.element)) tile.element.setAttribute('data-vsg-unarranged', '')
  }
}

useLayoutObserver(root, arrangeChildren)
watch(() => [Orientation.value, ...[
  props.ItemWidth, props.ItemHeight, props.MaximumRowsOrColumns,
  props.HorizontalChildrenAlignment, props.VerticalChildrenAlignment,
  props.Width, props.Height, props.MinWidth, props.MinHeight, props.MaxWidth, props.MaxHeight
].map(resolve)], () => { void nextTick(arrangeChildren) })
onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') childResizeObserver = new ResizeObserver(() => { void nextTick(arrangeChildren) })
  arrangeChildren()
})
onBeforeUnmount(() => { childResizeObserver?.disconnect() })
</script>

<style scoped>
.win-variable-sized-wrap-grid {
  display: grid;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  align-content: start;
  justify-content: start;
  grid-auto-columns: 0;
  grid-auto-rows: 0;
}
.win-variable-sized-wrap-grid :deep(> [data-vsg-unarranged]) { display: none !important; }
.win-variable-sized-wrap-grid :deep(> [data-vsg-expanded-width]) { min-width: var(--vsg-arranged-min-width); }
.win-variable-sized-wrap-grid :deep(> [data-vsg-expanded-height]) { min-height: var(--vsg-arranged-min-height); }
</style>
