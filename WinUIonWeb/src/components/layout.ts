import { nextTick, onBeforeUnmount, onMounted, onUpdated, type Ref } from 'vue'

export type GridDefinition = Record<string, unknown>
export const gridDefinitionContextKey = Symbol('winui-grid-definitions')
export const gridDefinitionTargetKey = Symbol('winui-grid-definition-target')

export const cssLength = (value: unknown): string => {
  if (value === '' || value === undefined || value === null) return ''
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}px`
  const text = String(value).trim()
  if (!text) return ''
  return Number.isFinite(Number(text)) ? `${Number(text)}px` : text
}

/** XAML Thickness is ordered left,top,right,bottom; CSS is top,right,bottom,left. */
export const xamlThickness = (value: unknown): string => {
  if (value === '' || value === undefined || value === null) return ''
  const parts = String(value).split(',').map((part) => cssLength(part.trim()))
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`
  return String(value)
}

export const alignment = (value: unknown, axis: 'horizontal' | 'vertical'): string => {
  const name = String(value ?? '')
  if (axis === 'horizontal') {
    return ({ Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' } as Record<string, string>)[name] ?? ''
  }
  return ({ Top: 'start', Center: 'center', Bottom: 'end', Stretch: 'stretch' } as Record<string, string>)[name] ?? ''
}

export const boolValue = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value
  return /^(true|1|yes)$/i.test(String(value ?? '').trim())
}

const attributeName = (element: Element, name: string): string | undefined => {
  const expected = name.toLowerCase()
  return element.getAttributeNames().find((candidate) => candidate.toLowerCase() === expected)
}

export const attachedValue = (element: Element, name: string): string | undefined => {
  const actual = attributeName(element, name)
  return actual === undefined ? undefined : element.getAttribute(actual) ?? ''
}

const integerValue = (element: Element, name: string, fallback: number): number => {
  const value = Number(attachedValue(element, name))
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : fallback
}

const positiveIntegerValue = (element: Element, name: string, fallback = 1): number =>
  Math.max(1, integerValue(element, name, fallback))

const setOrClear = (element: HTMLElement, property: string, value: string | number | null) => {
  ;(element.style as unknown as Record<string, string>)[property] = value === null || value === '' ? '' : String(value)
}

const applyFrameworkChildStyles = (element: HTMLElement) => {
  const width = attachedValue(element, 'Width')
  const height = attachedValue(element, 'Height')
  const minWidth = attachedValue(element, 'MinWidth')
  const maxWidth = attachedValue(element, 'MaxWidth')
  const minHeight = attachedValue(element, 'MinHeight')
  const maxHeight = attachedValue(element, 'MaxHeight')
  const margin = attachedValue(element, 'Margin')
  const padding = attachedValue(element, 'Padding')

  if (width !== undefined) setOrClear(element, 'width', cssLength(width))
  if (height !== undefined) setOrClear(element, 'height', cssLength(height))
  if (minWidth !== undefined) setOrClear(element, 'minWidth', cssLength(minWidth))
  if (maxWidth !== undefined) setOrClear(element, 'maxWidth', cssLength(maxWidth))
  if (minHeight !== undefined) setOrClear(element, 'minHeight', cssLength(minHeight))
  if (maxHeight !== undefined) setOrClear(element, 'maxHeight', cssLength(maxHeight))
  if (margin !== undefined) setOrClear(element, 'margin', xamlThickness(margin))
  if (padding !== undefined) setOrClear(element, 'padding', xamlThickness(padding))
}

const gridZIndices = new WeakMap<HTMLElement, { previousInline: string; lastApplied: string }>()

type ContentPresenterStyleProperty = 'width' | 'height' | 'justifySelf' | 'alignSelf'
type ContentPresenterStyles = Partial<Record<ContentPresenterStyleProperty, { previous: string; applied: string }>>
const contentPresenterStyles = new WeakMap<HTMLElement, ContentPresenterStyles>()

/** ContentPresenter arranges its sole UIElement inside the content alignment slot. */
export const applyContentPresenterChildren = (root: HTMLElement, horizontalContentAlignment: unknown, verticalContentAlignment: unknown) => {
  for (const child of Array.from(root.children)) {
    const element = child as HTMLElement
    if (element.classList.contains('win-acrylic-visual') || element.classList.contains('win-radial-gradient-background') || element.classList.contains('win-theme-shadow-visual')) continue
    const saved = contentPresenterStyles.get(element)
    for (const property of Object.keys(saved ?? {}) as ContentPresenterStyleProperty[]) {
      const value = saved?.[property]
      if (value && element.style[property] === value.applied) element.style[property] = value.previous
    }
    const changes: ContentPresenterStyles = {}
    const arrange = (property: ContentPresenterStyleProperty, value: string) => {
      changes[property] = { previous: element.style[property], applied: value }
      element.style[property] = value
    }
    applyFrameworkChildStyles(element)
    for (const [axis, contentAlignment, alignmentProperty, sizeProperty, maxProperty] of [
      ['horizontal', horizontalContentAlignment, 'justifySelf', 'width', 'MaxWidth'],
      ['vertical', verticalContentAlignment, 'alignSelf', 'height', 'MaxHeight']
    ] as const) {
      const childAlignment = attachedValue(element, axis === 'horizontal' ? 'HorizontalAlignment' : 'VerticalAlignment')
      const ownAlignment = childAlignment ? alignment(childAlignment, axis) : element.style[alignmentProperty] || 'stretch'
      const content = alignment(contentAlignment, axis)
      arrange(alignmentProperty, content === 'stretch' ? ownAlignment : content)
      // WinUI centers a Stretch element when an explicit or maximum size limits
      // its arrange rectangle. CSS grid otherwise pins that constrained item to start.
      if (content === 'stretch' && ownAlignment === 'stretch') {
        const size = element.style[sizeProperty]
        const max = attachedValue(element, maxProperty) ?? element.style[axis === 'horizontal' ? 'maxWidth' : 'maxHeight']
        if (size && size !== '100%' && size !== 'auto') arrange(alignmentProperty, 'center')
        else if (max && max !== 'none' && max !== '100%' && max !== 'Infinity') {
          arrange(sizeProperty, '100%')
          arrange(alignmentProperty, 'center')
        }
      }
    }
    contentPresenterStyles.set(element, changes)
  }
}

export const applyGridChildren = (root: HTMLElement) => {
  Array.from(root.children).forEach((child) => {
    const element = child as HTMLElement
    if (element.classList.contains('win-acrylic-visual') || element.classList.contains('win-radial-gradient-background') || element.classList.contains('win-theme-shadow-visual')) return
    applyFrameworkChildStyles(element)

    const zIndex = attachedValue(element, 'Canvas.ZIndex')
    const savedZIndex = gridZIndices.get(element)
    if (zIndex !== undefined) {
      const value = Number(zIndex)
      const next = String(Number.isFinite(value) ? Math.trunc(value) : 0)
      gridZIndices.set(element, { previousInline: savedZIndex?.previousInline ?? element.style.zIndex, lastApplied: next })
      if (element.style.zIndex !== next) element.style.zIndex = next
    } else if (savedZIndex) {
      if (element.style.zIndex === savedZIndex.lastApplied) element.style.zIndex = savedZIndex.previousInline
      gridZIndices.delete(element)
    }

    const row = attachedValue(element, 'Grid.Row')
    const column = attachedValue(element, 'Grid.Column')
    const rowSpan = attachedValue(element, 'Grid.RowSpan')
    const columnSpan = attachedValue(element, 'Grid.ColumnSpan')
    if (row !== undefined || rowSpan !== undefined) {
      setOrClear(element, 'gridRow', `${integerValue(element, 'Grid.Row', 0) + 1} / span ${positiveIntegerValue(element, 'Grid.RowSpan')}`)
    } else {
      // WinUI Grid places children without an attached row in the first
      // cell. They are layered there (for example an Image with a caption
      // Border), rather than auto-flowing into separate CSS grid rows.
      setOrClear(element, 'gridRow', `1 / span ${positiveIntegerValue(element, 'Grid.RowSpan')}`)
    }
    if (column !== undefined || columnSpan !== undefined) {
      setOrClear(element, 'gridColumn', `${integerValue(element, 'Grid.Column', 0) + 1} / span ${positiveIntegerValue(element, 'Grid.ColumnSpan')}`)
    } else {
      setOrClear(element, 'gridColumn', `1 / span ${positiveIntegerValue(element, 'Grid.ColumnSpan')}`)
    }

    const horizontal = attachedValue(element, 'HorizontalAlignment')
    const vertical = attachedValue(element, 'VerticalAlignment')
    if (horizontal !== undefined) setOrClear(element, 'justifySelf', alignment(horizontal, 'horizontal'))
    if (vertical !== undefined) setOrClear(element, 'alignSelf', alignment(vertical, 'vertical'))
  })
}

export const applyStackChildren = (root: HTMLElement, orientation: string) => {
  const horizontal = orientation === 'Horizontal'
  Array.from(root.children).forEach((child) => {
    const element = child as HTMLElement
    if (element.classList.contains('win-acrylic-visual') || element.classList.contains('win-radial-gradient-background') || element.classList.contains('win-theme-shadow-visual')) return
    applyFrameworkChildStyles(element)
    const crossAxis = attachedValue(element, horizontal ? 'data-stack-panel-vertical-alignment' : 'data-stack-panel-horizontal-alignment')
      ?? attachedValue(element, horizontal ? 'VerticalAlignment' : 'HorizontalAlignment')
    if (crossAxis === undefined) {
      element.removeAttribute('data-stack-panel-cross-alignment')
      return
    }
    const crossSize = attachedValue(element, horizontal ? 'data-stack-panel-height' : 'data-stack-panel-width')
      ?? attachedValue(element, horizontal ? 'Height' : 'Width')
    const renderedCrossSize = horizontal ? element.style.height : element.style.width
    const hasCrossSize = crossSize !== undefined && crossSize !== ''
      ? !/^(Auto|NaN|Infinity)$/i.test(crossSize)
      : /^\d+(?:\.\d+)?px$/.test(renderedCrossSize)
    const crossAlignment = crossAxis === 'Stretch' && hasCrossSize
      ? 'center'
      : alignment(crossAxis, horizontal ? 'vertical' : 'horizontal')
    setOrClear(element, 'alignSelf', crossAlignment)
    // The parent owns the cross-axis arrange slot even when a control
    // updates its own inline alignment during an input state change.
    element.setAttribute('data-stack-panel-cross-alignment', crossAlignment)
  })
}

export const applyVariableSizedChildren = (root: HTMLElement) => {
  Array.from(root.children).forEach((child) => {
    const element = child as HTMLElement
    if (element.classList.contains('win-acrylic-visual') || element.classList.contains('win-radial-gradient-background') || element.classList.contains('win-theme-shadow-visual')) return
    applyFrameworkChildStyles(element)
    const rowSpan = attachedValue(element, 'VariableSizedWrapGrid.RowSpan')
    const columnSpan = attachedValue(element, 'VariableSizedWrapGrid.ColumnSpan')
    if (rowSpan !== undefined) setOrClear(element, 'gridRow', `span ${positiveIntegerValue(element, 'VariableSizedWrapGrid.RowSpan')}`)
    if (columnSpan !== undefined) setOrClear(element, 'gridColumn', `span ${positiveIntegerValue(element, 'VariableSizedWrapGrid.ColumnSpan')}`)
  })
}

export const useLayoutObserver = (root: Ref<HTMLElement | null>, apply: () => void) => {
  let observer: MutationObserver | undefined
  let resizeObserver: ResizeObserver | undefined
  const update = () => void nextTick(apply)
  onMounted(() => {
    update()
    if (!root.value) return
    observer = new MutationObserver(update)
    observer.observe(root.value, { childList: true, subtree: true, attributes: true, attributeFilter: [
      'Grid.Row', 'Grid.Column', 'Grid.RowSpan', 'Grid.ColumnSpan', 'Canvas.Left', 'Canvas.Top', 'Canvas.ZIndex',
      'VariableSizedWrapGrid.RowSpan', 'VariableSizedWrapGrid.ColumnSpan', 'RelativePanel.LeftOf', 'RelativePanel.RightOf',
      'RelativePanel.Above', 'RelativePanel.Below', 'RelativePanel.AlignHorizontalCenterWith', 'RelativePanel.AlignVerticalCenterWith',
      'RelativePanel.AlignLeftWith', 'RelativePanel.AlignTopWith', 'RelativePanel.AlignRightWith', 'RelativePanel.AlignBottomWith',
      'RelativePanel.AlignLeftWithPanel', 'RelativePanel.AlignTopWithPanel', 'RelativePanel.AlignRightWithPanel',
      'RelativePanel.AlignBottomWithPanel', 'RelativePanel.AlignHorizontalCenterWithPanel', 'RelativePanel.AlignVerticalCenterWithPanel',
      'HorizontalAlignment', 'VerticalAlignment', 'Width', 'Height', 'MinWidth', 'MaxWidth', 'MinHeight', 'MaxHeight', 'Margin', 'Padding',
      'data-stack-panel-horizontal-alignment', 'data-stack-panel-vertical-alignment',
      'data-stack-panel-width', 'data-stack-panel-height',
      'data-xaml-ref', 'x:name', 'x:Name'
    ].flatMap((name) => [name, name.toLowerCase()]) })
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(update)
      resizeObserver.observe(root.value)
    }
  })
  onUpdated(update)
  onBeforeUnmount(() => {
    observer?.disconnect()
    resizeObserver?.disconnect()
  })
}
