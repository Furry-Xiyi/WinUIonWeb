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

export const applyGridChildren = (root: HTMLElement) => {
  Array.from(root.children).forEach((child) => {
    const element = child as HTMLElement
    applyFrameworkChildStyles(element)

    const row = attachedValue(element, 'Grid.Row')
    const column = attachedValue(element, 'Grid.Column')
    const rowSpan = attachedValue(element, 'Grid.RowSpan')
    const columnSpan = attachedValue(element, 'Grid.ColumnSpan')
    if (row !== undefined || rowSpan !== undefined) {
      setOrClear(element, 'gridRow', `${integerValue(element, 'Grid.Row', 0) + 1} / span ${positiveIntegerValue(element, 'Grid.RowSpan')}`)
    }
    if (column !== undefined || columnSpan !== undefined) {
      setOrClear(element, 'gridColumn', `${integerValue(element, 'Grid.Column', 0) + 1} / span ${positiveIntegerValue(element, 'Grid.ColumnSpan')}`)
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
    applyFrameworkChildStyles(element)
    const crossAxis = attachedValue(element, horizontal ? 'VerticalAlignment' : 'HorizontalAlignment')
    if (crossAxis !== undefined) setOrClear(element, 'alignSelf', alignment(crossAxis, horizontal ? 'vertical' : 'horizontal'))
  })
}

export const applyCanvasChildren = (root: HTMLElement) => {
  Array.from(root.children).forEach((child) => {
    const element = child as HTMLElement
    applyFrameworkChildStyles(element)
    element.style.position = 'absolute'
    const left = attachedValue(element, 'Canvas.Left')
    const top = attachedValue(element, 'Canvas.Top')
    const zIndex = attachedValue(element, 'Canvas.ZIndex')
    if (left !== undefined) setOrClear(element, 'left', cssLength(left))
    if (top !== undefined) setOrClear(element, 'top', cssLength(top))
    if (zIndex !== undefined) setOrClear(element, 'zIndex', Number(zIndex) || 0)
  })
}

const elementName = (element: Element): string | undefined =>
  attachedValue(element, 'x:Name') ?? attachedValue(element, 'Name')

/** Resolve the commonly used RelativePanel relations after every DOM/layout update. */
export const applyRelativeChildren = (root: HTMLElement) => {
  const children = Array.from(root.children).map((child) => child as HTMLElement)
  const named = new Map<string, HTMLElement>()
  children.forEach((child) => {
    const name = elementName(child)
    if (name) named.set(name, child)
  })
  const panelWidth = root.clientWidth
  const panelHeight = root.clientHeight

  children.forEach((element) => {
    applyFrameworkChildStyles(element)
    element.style.position = 'absolute'
    const hasRelation = ['LeftOf', 'RightOf', 'Above', 'Below', 'AlignHorizontalCenterWith', 'AlignVerticalCenterWith', 'AlignLeftWith', 'AlignTopWith', 'AlignRightWith', 'AlignBottomWith', 'AlignLeftWithPanel', 'AlignTopWithPanel', 'AlignRightWithPanel', 'AlignBottomWithPanel', 'AlignHorizontalCenterWithPanel', 'AlignVerticalCenterWithPanel']
      .some((name) => attachedValue(element, `RelativePanel.${name}`) !== undefined)
    if (!hasRelation) return

    const margin = (attachedValue(element, 'Margin') ?? '').split(',').map(Number).map((part) => Number.isFinite(part) ? part : 0)
    const leftMargin = margin[0] ?? 0
    const topMargin = margin[1] ?? leftMargin
    const rightMargin = margin[2] ?? leftMargin
    const bottomMargin = margin[3] ?? topMargin
    const width = element.offsetWidth
    const height = element.offsetHeight
    let left = element.offsetLeft
    let top = element.offsetTop
    const target = (relation: string) => named.get(attachedValue(element, `RelativePanel.${relation}`) ?? '')

    if (boolValue(attachedValue(element, 'RelativePanel.AlignLeftWithPanel'))) left = leftMargin
    if (boolValue(attachedValue(element, 'RelativePanel.AlignRightWithPanel'))) left = panelWidth - width - rightMargin
    if (boolValue(attachedValue(element, 'RelativePanel.AlignHorizontalCenterWithPanel'))) left = (panelWidth - width) / 2 + (leftMargin - rightMargin) / 2
    if (boolValue(attachedValue(element, 'RelativePanel.AlignTopWithPanel'))) top = topMargin
    if (boolValue(attachedValue(element, 'RelativePanel.AlignBottomWithPanel'))) top = panelHeight - height - bottomMargin
    if (boolValue(attachedValue(element, 'RelativePanel.AlignVerticalCenterWithPanel'))) top = (panelHeight - height) / 2 + (topMargin - bottomMargin) / 2

    const rightOf = target('RightOf')
    const leftOf = target('LeftOf')
    const below = target('Below')
    const above = target('Above')
    if (rightOf) left = rightOf.offsetLeft + rightOf.offsetWidth + leftMargin
    if (leftOf) left = leftOf.offsetLeft - width - rightMargin
    if (below) top = below.offsetTop + below.offsetHeight + topMargin
    if (above) top = above.offsetTop - height - bottomMargin

    const horizontal = target('AlignHorizontalCenterWith')
    const vertical = target('AlignVerticalCenterWith')
    if (horizontal) left = horizontal.offsetLeft + (horizontal.offsetWidth - width) / 2 + (leftMargin - rightMargin) / 2
    if (vertical) top = vertical.offsetTop + (vertical.offsetHeight - height) / 2 + (topMargin - bottomMargin) / 2
    const alignLeft = target('AlignLeftWith')
    const alignRight = target('AlignRightWith')
    const alignTop = target('AlignTopWith')
    const alignBottom = target('AlignBottomWith')
    if (alignLeft) left = alignLeft.offsetLeft + leftMargin
    if (alignRight) left = alignRight.offsetLeft + alignRight.offsetWidth - width - rightMargin
    if (alignTop) top = alignTop.offsetTop + topMargin
    if (alignBottom) top = alignBottom.offsetTop + alignBottom.offsetHeight - height - bottomMargin

    setOrClear(element, 'left', `${left}px`)
    setOrClear(element, 'top', `${top}px`)
  })
}

export const applyVariableSizedChildren = (root: HTMLElement) => {
  Array.from(root.children).forEach((child) => {
    const element = child as HTMLElement
    applyFrameworkChildStyles(element)
    const rowSpan = attachedValue(element, 'VariableSizedWrapGrid.RowSpan')
    const columnSpan = attachedValue(element, 'VariableSizedWrapGrid.ColumnSpan')
    if (rowSpan !== undefined) setOrClear(element, 'gridRow', `span ${positiveIntegerValue(element, 'VariableSizedWrapGrid.RowSpan')}`)
    if (columnSpan !== undefined) setOrClear(element, 'gridColumn', `span ${positiveIntegerValue(element, 'VariableSizedWrapGrid.ColumnSpan')}`)
  })
}

export const useLayoutObserver = (root: Ref<HTMLElement | null>, apply: () => void) => {
  let observer: MutationObserver | undefined
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
      'HorizontalAlignment', 'VerticalAlignment', 'Width', 'Height', 'Margin', 'Padding'
    ] })
  })
  onUpdated(update)
  onBeforeUnmount(() => observer?.disconnect())
}
