// Layout algorithms for ItemsRepeater.
//
// Each function is a direct port of the matching WinUI implementation so that
// item geometry, spacing and extent match the official control rather than an
// approximation.  Sources (WinUI-Reference/controls/dev/Repeater):
//   StackLayout       -> StackLayout.cpp, FlowLayoutAlgorithm.cpp
//   UniformGridLayout -> UniformGridLayout.cpp, UniformGridLayoutState.cpp
//   ActivityFeedLayout / VariedImageSizeLayout -> WinUI-Gallery/Layouts
//
// The port is non-virtualizing: every item is realized, so the extents below
// are the exact realized bounds instead of the estimate WinUI derives from the
// average element size while a window of items is realized.

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface Size {
  width: number
  height: number
}

export interface LayoutInput {
  count: number
  /** Natural (unconstrained) size of each item, measured at the layout's measure size. */
  naturals: Size[]
  /** Size offered to the layout: the panel's content box. */
  available: Size
  props: Record<string, unknown>
}

export interface LayoutOutput {
  rects: Rect[]
  /** Content size the layout reports; the panel scrolls to it on the major axis. */
  extent: Size
  /** True when the major (growing) axis is horizontal. */
  horizontal: boolean
}

export type LayoutKind = 'StackLayout' | 'UniformGridLayout' | 'ActivityFeedLayout' | 'VariedImageSizeLayout' | 'LinedFlowLayout'

const num = (value: unknown, fallback: number): number => {
  if (value === undefined || value === null || value === '') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

/** XAML "Width,Height" (Windows.Foundation.Size) value. */
const parseSize = (value: unknown): Size | null => {
  if (typeof value !== 'string') return null
  const parts = value.split(',').map((part) => Number(part.trim()))
  if (parts.length < 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return null
  return { width: parts[0], height: parts[1] }
}

const normalizeType = (value: unknown): LayoutKind => {
  const name = String(value ?? '').trim()
  if (/uniformgrid/i.test(name)) return 'UniformGridLayout'
  if (/activityfeed/i.test(name)) return 'ActivityFeedLayout'
  if (/variedimagesize/i.test(name)) return 'VariedImageSizeLayout'
  if (/linedflow/i.test(name)) return 'LinedFlowLayout'
  return 'StackLayout'
}

/** C++ integer division truncates toward zero; JavaScript's % keeps the sign. */
const truncDiv = (left: number, right: number) => Math.trunc(left / right)

/**
 * StackLayout.MeasureOverride delegates to FlowLayoutAlgorithm with
 * isWrapping=false and ShouldBreakLine always true, so every item owns a line
 * along the major axis.  ArrangeOverride stretches each item's minor size to
 * the final size (FlowLayoutAlgorithm::PerformLineAlignment with !isWrapping).
 */
const stackLayout = (input: LayoutInput): LayoutOutput => {
  const horizontal = String(input.props.Orientation ?? 'Vertical').toLowerCase() === 'horizontal'
  const spacing = num(input.props.Spacing, 0)
  const minorAvailable = horizontal ? input.available.height : input.available.width

  const rects: Rect[] = []
  let major = 0
  let extentMinor = 0
  for (let index = 0; index < input.count; index += 1) {
    const natural = input.naturals[index] ?? { width: 0, height: 0 }
    const majorSize = horizontal ? natural.width : natural.height
    const naturalMinor = horizontal ? natural.height : natural.width
    const minorSize = Number.isFinite(minorAvailable)
      ? Math.max(naturalMinor, minorAvailable)
      : naturalMinor
    extentMinor = Math.max(extentMinor, minorSize)
    rects.push(horizontal
      ? { x: major, y: 0, width: majorSize, height: minorSize }
      : { x: 0, y: major, width: minorSize, height: majorSize })
    major += majorSize + spacing
  }

  const extentMajor = input.count > 0 ? major - spacing : 0
  return {
    rects,
    extent: horizontal ? { width: extentMajor, height: extentMinor } : { width: extentMinor, height: extentMajor },
    horizontal
  }
}

/**
 * UniformGridLayout.MeasureOverride -> EnsureElementSize then a wrapping
 * FlowLayoutAlgorithm pass.  Vertical orientation inverts the scroll
 * orientation (UniformGridLayout.cpp OnPropertyChanged).
 */
const uniformGridLayout = (input: LayoutInput): LayoutOutput => {
  // Orientation defaults to Horizontal; the scroll axis is the inverse.
  const orientation = String(input.props.Orientation ?? 'Horizontal').toLowerCase() === 'vertical' ? 'Vertical' : 'Horizontal'
  const scrollVertical = orientation === 'Horizontal'

  const minRowSpacing = num(input.props.MinRowSpacing, 0)
  const minColumnSpacing = num(input.props.MinColumnSpacing, 0)
  const minItemSpacing = orientation === 'Horizontal' ? minColumnSpacing : minRowSpacing
  const lineSpacing = orientation === 'Horizontal' ? minRowSpacing : minColumnSpacing

  const minorAvailable = orientation === 'Horizontal' ? input.available.width : input.available.height

  // MinItemWidth/MinItemHeight are NaN until set, in which case the first
  // item's desired size is used (UniformGridLayoutState::SetSize).
  const requestedWidth = input.props.MinItemWidth === undefined || input.props.MinItemWidth === null || input.props.MinItemWidth === ''
    ? Number.NaN
    : num(input.props.MinItemWidth, Number.NaN)
  const requestedHeight = input.props.MinItemHeight === undefined || input.props.MinItemHeight === null || input.props.MinItemHeight === ''
    ? Number.NaN
    : num(input.props.MinItemHeight, Number.NaN)
  const first = input.naturals[0] ?? { width: 0, height: 0 }
  let itemWidth = Number.isFinite(requestedWidth) ? requestedWidth : first.width
  let itemHeight = Number.isFinite(requestedHeight) ? requestedHeight : first.height

  const declaredMaximum = num(input.props.MaximumRowsOrColumns, -1)
  const maxItemsPerLine = Math.max(1, declaredMaximum < 0 ? Number.POSITIVE_INFINITY : declaredMaximum)

  const minorStride = (orientation === 'Horizontal' ? itemWidth : itemHeight) + minItemSpacing
  // UniformGridLayout::GetItemsPerLine clamps to at least one item so a panel
  // narrower than a single stride never divides by zero.
  const itemsPerLine = Number.isFinite(minorAvailable) && minorStride > 0
    ? Math.min(Math.max(1, Math.floor((minorAvailable + minItemSpacing) / minorStride)), maxItemsPerLine)
    : Math.min(Math.max(1, input.count), maxItemsPerLine)

  // UniformGridLayoutState::CalculateExtraPixelsInLine / SetSize.
  const stretch = String(input.props.ItemsStretch ?? 'None')
  const itemSizeMinor = orientation === 'Horizontal' ? itemWidth : itemHeight
  let extraMinorPerItem = 0
  if (Number.isFinite(minorAvailable) && itemSizeMinor > 0) {
    const itemsPerColumn = Math.min(maxItemsPerLine, Math.max(1, minorAvailable / (itemSizeMinor + minItemSpacing)))
    const usedSpace = itemsPerColumn * (itemSizeMinor + minItemSpacing) - minItemSpacing
    extraMinorPerItem = truncDiv(truncDiv(minorAvailable - usedSpace, 1), itemsPerColumn)
  }
  if (stretch === 'Fill') {
    if (orientation === 'Horizontal') itemWidth += extraMinorPerItem
    else itemHeight += extraMinorPerItem
  } else if (stretch === 'Uniform' && itemSizeMinor > 0) {
    const itemSizeMajor = orientation === 'Horizontal' ? itemHeight : itemWidth
    const extraMajorPerItem = itemSizeMajor * (extraMinorPerItem / itemSizeMinor)
    if (orientation === 'Horizontal') {
      itemWidth += extraMinorPerItem
      itemHeight += extraMajorPerItem
    } else {
      itemHeight += extraMinorPerItem
      itemWidth += extraMajorPerItem
    }
  }

  const minorStrideFinal = (orientation === 'Horizontal' ? itemWidth : itemHeight) + minItemSpacing
  const majorStride = (orientation === 'Horizontal' ? itemHeight : itemWidth) + lineSpacing
  const lines = input.count > 0 ? Math.ceil(input.count / itemsPerLine) : 0

  const rects: Rect[] = []
  for (let index = 0; index < input.count; index += 1) {
    const line = truncDiv(index, itemsPerLine)
    const indexInLine = index - line * itemsPerLine
    rects.push(scrollVertical
      ? { x: indexInLine * minorStrideFinal, y: line * majorStride, width: itemWidth, height: itemHeight }
      : { x: line * majorStride, y: indexInLine * minorStrideFinal, width: itemWidth, height: itemHeight })
  }

  // ItemsJustification distributes the leading/trailing space of the panel's
  // minor axis, exactly as FlowLayoutAlgorithm::PerformLineAlignment does.
  const justification = String(input.props.ItemsJustification ?? 'Start')
  const panelMinor = orientation === 'Horizontal' ? input.available.width : input.available.height
  if (justification !== 'Start' && Number.isFinite(panelMinor) && rects.length) {
    for (let line = 0; line < lines; line += 1) {
      const start = line * itemsPerLine
      const end = Math.min(start + itemsPerLine, rects.length)
      if (end - start < 1) continue
      const firstRect = rects[start]
      const lastRect = rects[end - 1]
      const minorStart = (rect: Rect) => (scrollVertical ? rect.x : rect.y)
      const minorSize = (rect: Rect) => (scrollVertical ? rect.width : rect.height)
      const spaceAtLineStart = minorStart(firstRect)
      const spaceAtLineEnd = panelMinor - minorStart(lastRect) - minorSize(lastRect)
      if (spaceAtLineStart === 0 && spaceAtLineEnd === 0) continue
      const totalSpace = spaceAtLineStart + spaceAtLineEnd
      const count = end - start
      for (let offset = 0; offset < count; offset += 1) {
        const rect = rects[start + offset]
        let shift = -spaceAtLineStart
        if (justification === 'End') shift += spaceAtLineEnd
        else if (justification === 'Center') shift += totalSpace / 2
        else if (justification === 'SpaceAround') shift += (totalSpace / (count * 2)) * ((offset + 1) * 2 - 1)
        else if (justification === 'SpaceBetween') shift += (count > 1 ? totalSpace / (count - 1) : 0) * offset
        else if (justification === 'SpaceEvenly') shift += (totalSpace / (count + 1)) * (offset + 1)
        if (scrollVertical) rect.x += shift
        else rect.y += shift
      }
    }
  }

  const majorSize = lines > 0 ? lines * majorStride - lineSpacing : 0
  // Only Fill makes the extent consume the whole minor axis; None and Uniform
  // size it to the items that were placed.
  const minorSize = Number.isFinite(minorAvailable) && stretch === 'Fill'
    ? minorAvailable
    : Math.max(0, itemsPerLine * minorStrideFinal - minItemSpacing)

  return {
    rects,
    extent: scrollVertical ? { width: minorSize, height: majorSize } : { width: majorSize, height: minorSize },
    horizontal: !scrollVertical
  }
}

/**
 * WinUIGallery.Layouts.ActivityFeedLayout: three items per row in a four
 * column track, alternating "narrow, narrow, wide" and "wide, narrow, narrow".
 */
const activityFeedLayout = (input: LayoutInput): LayoutOutput => {
  const rowSpacing = num(input.props.RowSpacing, 0)
  const columnSpacing = num(input.props.ColumnSpacing, 0)
  const declared = parseSize(input.props.MinItemSize)
  const first = input.naturals[0] ?? { width: 0, height: 0 }
  // MinItemSize defaults to Size.Empty, in which case the layout measures the
  // first item with an infinite constraint (MeasureOverride).
  const itemWidth = declared?.width || first.width || 0
  const itemHeight = declared?.height || first.height || 0

  const desiredItemWidth = Math.max(itemWidth, (input.available.width - columnSpacing * 3) / 4)
  const wideWidth = desiredItemWidth * 2 + columnSpacing

  const rects: Rect[] = []
  for (let index = 0; index < input.count; index += 1) {
    const row = truncDiv(index, 3)
    const column = index - row * 3
    const y = row * (itemHeight + rowSpacing)
    let x: number
    let width: number
    if (row % 2 === 0) {
      // Left tile (narrow), middle tile (narrow), right tile (wide).
      if (column === 0) { x = 0; width = desiredItemWidth }
      else if (column === 1) { x = desiredItemWidth + columnSpacing; width = desiredItemWidth }
      else { x = desiredItemWidth * 2 + columnSpacing * 2; width = wideWidth }
    } else {
      // Left tile (wide), middle tile (narrow), right tile (narrow).
      if (column === 0) { x = 0; width = wideWidth }
      else if (column === 1) { x = wideWidth + columnSpacing; width = desiredItemWidth }
      else { x = wideWidth + columnSpacing * 2 + desiredItemWidth; width = desiredItemWidth }
    }
    rects.push({ x, y, width, height: itemHeight })
  }

  const rows = Math.ceil(input.count / 3)
  // The extent covers every realized row; GetExtentSize in the Gallery layout
  // stops one row early when the count is not a multiple of three.
  const extentHeight = rows > 0 ? rows * (itemHeight + rowSpacing) - rowSpacing : 0
  return {
    rects,
    extent: { width: desiredItemWidth * 4 + columnSpacing * 2, height: extentHeight },
    horizontal: false
  }
}

/**
 * WinUIGallery.Layouts.VariedImageSizeLayout: items keep the declared column
 * width and are packed into the shortest column.
 */
const variedImageSizeLayout = (input: LayoutInput): LayoutOutput => {
  const width = num(input.props.Width, 150)
  const numColumns = Math.max(1, truncDiv(input.available.width, width))
  const columnOffsets = new Array<number>(numColumns).fill(0)

  const rects: Rect[] = []
  for (let index = 0; index < input.count; index += 1) {
    const natural = input.naturals[index] ?? { width, height: 0 }
    let column = 0
    for (let candidate = 1; candidate < numColumns; candidate += 1) {
      if (columnOffsets[candidate] < columnOffsets[column]) column = candidate
    }
    const y = columnOffsets[column]
    rects.push({ x: column * width, y, width, height: natural.height })
    columnOffsets[column] = y + natural.height
  }

  const tallest = columnOffsets.length ? Math.max(...columnOffsets) : 0
  return { rects, extent: { width: input.available.width, height: tallest }, horizontal: false }
}

export const computeRepeaterLayout = (input: LayoutInput): LayoutOutput => {
  switch (normalizeType(input.props.Type)) {
    case 'UniformGridLayout':
      return uniformGridLayout(input)
    case 'ActivityFeedLayout':
      return activityFeedLayout(input)
    case 'VariedImageSizeLayout':
      return variedImageSizeLayout(input)
    default:
      return stackLayout(input)
  }
}

/**
 * Constraints each item is measured with before the layout runs.  Mirrors
 * Layout::Algorithm_GetMeasureSize plus the layout's own MeasureOverride:
 * StackLayout measures with the full available size, VariedImageSizeLayout
 * measures with its fixed column width, and the grid layouts hand each item
 * the exact box it will be arranged into.
 */
export const measureConstraintFor = (
  kind: LayoutKind,
  props: Record<string, unknown>,
  available: Size
): { axis: 'width' | 'height' | 'none'; value: number } => {
  switch (kind) {
    case 'VariedImageSizeLayout':
      return { axis: 'width', value: num(props.Width, 150) }
    case 'UniformGridLayout':
    case 'ActivityFeedLayout':
      return { axis: 'none', value: 0 }
    default: {
      const horizontal = String(props.Orientation ?? 'Vertical').toLowerCase() === 'horizontal'
      // A horizontal StackLayout stacks along the major (horizontal) axis, so
      // items are constrained by the available height and keep a natural width.
      return horizontal
        ? { axis: 'height', value: available.height }
        : { axis: 'width', value: available.width }
    }
  }
}

export const normalizeLayoutKind = normalizeType
