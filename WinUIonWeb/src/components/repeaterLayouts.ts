// Layout algorithms for ItemsRepeater.
//
// Each function is a direct port of the matching WinUI implementation so that
// item geometry, spacing and extent match the official control rather than an
// approximation.  Sources (WinUI-Reference/controls/dev/Repeater):
//   StackLayout       -> StackLayout.cpp, FlowLayoutAlgorithm.cpp
//   UniformGridLayout -> UniformGridLayout.cpp, UniformGridLayoutState.cpp
//   ActivityFeedLayout / VariedImageSizeLayout -> WinUI-Gallery/Layouts
//
// A `naturals[i]` entry of `null` means the item is outside the realization
// window and has not been measured, in which case the layout estimates it from
// the average measured size — the same estimate StackLayout::GetAverageElementSize
// uses for the items it virtualizes.

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
  /**
   * Natural (unconstrained) size of each item, measured at the layout's measure
   * size.  `null` means the item has not been measured yet, in which case the
   * layout falls back to the average of the measured items — the same estimate
   * StackLayout::GetAverageElementSize uses while it virtualizes.
   */
  naturals: (Size | null)[]
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
  /**
   * The uniform item box this layout derived, when it has one.  Grid and flow
   * layouts give every item the same box and must measure items against it
   * rather than against their own content, so the control feeds this back as
   * the next measure pass's constraint.
   */
  itemSize?: Size
}

export type LayoutKind = 'StackLayout' | 'UniformGridLayout' | 'ActivityFeedLayout' | 'VariedImageSizeLayout' | 'LinedFlowLayout'

const num = (value: unknown, fallback: number): number => {
  if (value === undefined || value === null || value === '') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

/**
 * A layout's own size cannot exceed what CSS can express.  Chromium clamps
 * element sizes near 2^25px and behaves badly beyond it, so a layout that is
 * handed a degenerate available size (a zero-width panel, an unbounded minor
 * axis) is bounded here rather than allowed to emit astronomically large rects.
 */
const MAX_EXTENT = 1_000_000

const clampExtent = (value: number) => {
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.min(value, MAX_EXTENT)
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

/**
 * The size an unmeasured item is assumed to have.  Only items inside the
 * realized window are ever measured, so a layout has to estimate the rest;
 * StackLayout::GetAverageElementSize averages the measured items for exactly
 * this purpose, and the estimate is only used to place items that are not on
 * screen yet.
 */
const estimateSize = (naturals: (Size | null)[], axis: 'width' | 'height'): number => {
  let total = 0
  let measured = 0
  for (const size of naturals) {
    if (!size) continue
    total += axis === 'width' ? size.width : size.height
    measured += 1
  }
  return measured > 0 ? total / measured : 0
}

const sizeOf = (size: Size | null, axis: 'width' | 'height', fallback: number): number => {
  if (!size) return fallback
  const value = axis === 'width' ? size.width : size.height
  return Number.isFinite(value) && value >= 0 ? value : fallback
}

/** C++ integer division truncates toward zero; JavaScript's % keeps the sign. */
const truncDiv = (left: number, right: number) => Math.trunc(left / right)

/**
 * StackLayout.MeasureOverride delegates to FlowLayoutAlgorithm with
 * isWrapping=false and ShouldBreakLine always true, so every item owns a line
 * along the major axis.  GetExtent reports MaxArrangeBounds on the minor axis
 * (the largest arranged item), and because the layout does not wrap,
 * PerformLineAlignment stretches every item's minor size to
 * max(MinorSize(bounds), Minor(finalSize)).  The panel's arranged minor size is
 * its available size when the parent gives it one, and its content extent when
 * it does not (for example inside a ScrollViewer that scrolls that axis).
 */
const stackLayout = (input: LayoutInput): LayoutOutput => {
  const horizontal = String(input.props.Orientation ?? 'Vertical').toLowerCase() === 'horizontal'
  const spacing = num(input.props.Spacing, 0)

  let extentMinor = 0
  let major = 0
  const rects: Rect[] = []
  const estimatedMajor = estimateSize(input.naturals, horizontal ? 'width' : 'height')
  const estimatedMinor = estimateSize(input.naturals, horizontal ? 'height' : 'width')
  for (let index = 0; index < input.count; index += 1) {
    const natural = input.naturals[index]
    const majorSize = sizeOf(natural, horizontal ? 'width' : 'height', estimatedMajor)
    const naturalMinor = sizeOf(natural, horizontal ? 'height' : 'width', estimatedMinor)
    extentMinor = Math.max(extentMinor, naturalMinor)
    rects.push(horizontal
      ? { x: major, y: 0, width: majorSize, height: naturalMinor }
      : { x: 0, y: major, width: naturalMinor, height: majorSize })
    major += majorSize + spacing
  }

  const availableMinor = horizontal ? input.available.height : input.available.width
  const stretchTarget = Number.isFinite(availableMinor) && availableMinor > 0
    ? Math.max(extentMinor, availableMinor)
    : extentMinor
  for (const rect of rects) {
    if (horizontal) rect.height = Math.max(rect.height, stretchTarget)
    else rect.width = Math.max(rect.width, stretchTarget)
  }

  const extentMajor = input.count > 0 ? major - spacing : 0
  return {
    rects,
    extent: horizontal
      ? { width: extentMajor, height: stretchTarget }
      : { width: stretchTarget, height: extentMajor },
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
  // item's desired size is used (UniformGridLayoutState::SetSize).  A first
  // item outside the realized window falls back to the average measured size.
  const requestedWidth = input.props.MinItemWidth === undefined || input.props.MinItemWidth === null || input.props.MinItemWidth === ''
    ? Number.NaN
    : num(input.props.MinItemWidth, Number.NaN)
  const requestedHeight = input.props.MinItemHeight === undefined || input.props.MinItemHeight === null || input.props.MinItemHeight === ''
    ? Number.NaN
    : num(input.props.MinItemHeight, Number.NaN)
  const first = input.naturals[0]
  let itemWidth = Number.isFinite(requestedWidth) ? requestedWidth : sizeOf(first, 'width', estimateSize(input.naturals, 'width'))
  let itemHeight = Number.isFinite(requestedHeight) ? requestedHeight : sizeOf(first, 'height', estimateSize(input.naturals, 'height'))

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
    const itemsPerColumn = Math.min(maxItemsPerLine, Math.max(1, Math.trunc(minorAvailable / (itemSizeMinor + minItemSpacing))))
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
    horizontal: !scrollVertical,
    itemSize: { width: itemWidth, height: itemHeight }
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
  const first = input.naturals[0]
  // MinItemSize defaults to Size.Empty, in which case the layout measures the
  // first item with an infinite constraint (MeasureOverride).  An unmeasured
  // first item falls back to the average measured size.
  const itemWidth = declared?.width || sizeOf(first, 'width', estimateSize(input.naturals, 'width')) || 0
  const itemHeight = declared?.height || sizeOf(first, 'height', estimateSize(input.naturals, 'height')) || 0

  // The Gallery layout divides the available width into four tracks.  An
  // unbounded width (a horizontally scrolling host) leaves nothing to divide,
  // so the declared MinItemSize becomes the item width, as WinUI's own fallback
  // does when it measures the first item unconstrained.
  const availableWidth = Number.isFinite(input.available.width) && input.available.width > 0
    ? input.available.width
    : itemWidth * 4 + columnSpacing * 3
  const desiredItemWidth = Math.max(itemWidth, (availableWidth - columnSpacing * 3) / 4)
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
    horizontal: false,
    itemSize: { width: desiredItemWidth, height: itemHeight }
  }
}

/**
 * WinUIGallery.Layouts.VariedImageSizeLayout: items keep the declared column
 * width and are packed into the shortest column.
 */
const variedImageSizeLayout = (input: LayoutInput): LayoutOutput => {
  const width = num(input.props.Width, 150)
  // An unbounded width would make the column count infinite; the column count
  // is what the layout is for, so fall back to a single column in that case.
  const available = Number.isFinite(input.available.width) && input.available.width > 0
    ? input.available.width
    : width
  const numColumns = Math.max(1, Math.min(64, truncDiv(available, width)))
  const columnOffsets = new Array<number>(numColumns).fill(0)

  const rects: Rect[] = []
  const estimatedHeight = estimateSize(input.naturals, 'height')
  for (let index = 0; index < input.count; index += 1) {
    const natural = input.naturals[index]
    const itemHeightValue = sizeOf(natural, 'height', estimatedHeight)
    let column = 0
    for (let candidate = 1; candidate < numColumns; candidate += 1) {
      if (columnOffsets[candidate] < columnOffsets[column]) column = candidate
    }
    const y = columnOffsets[column]
    rects.push({ x: column * width, y, width, height: itemHeightValue })
    columnOffsets[column] = y + itemHeightValue
  }

  const tallest = columnOffsets.reduce((max, value) => Math.max(max, value), 0)
  return {
    rects,
    extent: { width: numColumns * width, height: tallest },
    horizontal: false
  }
}

export const computeRepeaterLayout = (input: LayoutInput): LayoutOutput => {
  const output = (() => {
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
  })()
  // Bound every rect and extent once, centrally, so no layout branch can emit a
  // value the browser cannot lay out.
  return {
    ...output,
    rects: output.rects.map((rect) => ({
      x: clampExtent(rect.x),
      y: clampExtent(rect.y),
      width: clampExtent(rect.width),
      height: clampExtent(rect.height)
    })),
    extent: { width: clampExtent(output.extent.width), height: clampExtent(output.extent.height) }
  }
}

/**
 * The box a layout measures one item in, before the layout has been run.
 * `null` means "size to content".  This mirrors each layout's own MeasureOverride:
 *
 * - StackLayout hands the item the available size on the minor axis and lets it
 *   size to content on the major axis.  Inside a ScrollViewer that scrolls an
 *   axis, that axis is infinite, so the item is unconstrained there.
 * - UniformGridLayout / ActivityFeedLayout measure the first item unconstrained
 *   to learn its desired size, then hand every item the derived item box.  Once
 *   that size is known it is the only constraint an item ever sees.
 * - VariedImageSizeLayout measures each item at its fixed column width.
 */
export const measureBoxFor = (
  kind: LayoutKind,
  props: Record<string, unknown>,
  available: Size,
  knownItemSize: Size | null
): Size | null => {
  const finite = (value: number) => (Number.isFinite(value) && value > 0 ? value : null)
  switch (kind) {
    case 'VariedImageSizeLayout': {
      return { width: num(props.Width, 150), height: Number.NaN }
    }
    case 'UniformGridLayout':
    case 'ActivityFeedLayout':
    case 'LinedFlowLayout':
      // WinUI measures the first element with the available size to derive the
      // item box and only then constrains every item to it.  Until that box is
      // known — which is exactly when it is still degenerate — items must be
      // measured unconstrained so a natural size can be observed at all.
      if (!knownItemSize || (!finite(knownItemSize.width) && !finite(knownItemSize.height))) {
        return { width: Number.NaN, height: Number.NaN }
      }
      return knownItemSize
    default: {
      const horizontal = String(props.Orientation ?? 'Vertical').toLowerCase() === 'horizontal'
      return horizontal
        ? { width: Number.NaN, height: finite(available.height) ?? Number.NaN }
        : { width: finite(available.width) ?? Number.NaN, height: Number.NaN }
    }
  }
}

export const normalizeLayoutKind = normalizeType
