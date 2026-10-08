import type { ComponentInternalInstance, CSSProperties } from 'vue'
import { alignment, cssLength, xamlThickness } from './layout'
import { resolveXamlValue } from './xamlRuntime'
import { resolveBrushStyle } from './AcrylicBrush'

export const frameworkLayoutStyle = (props: Record<string, unknown>, instance: ComponentInternalInstance | null): CSSProperties => {
  const resolve = (value: unknown) => resolveXamlValue(value, instance)
  const style: CSSProperties = {}
  const lengths = { Width: 'width', Height: 'height', MinWidth: 'minWidth', MinHeight: 'minHeight', MaxWidth: 'maxWidth', MaxHeight: 'maxHeight' } as const
  for (const property of Object.keys(lengths) as (keyof typeof lengths)[]) {
    const value = resolve(props[property])
    if (value === undefined || value === null || value === '' || value === 'Auto' || Number.isNaN(value)) continue
    style[lengths[property]] = cssLength(value)
    if (property === 'Width') style.flex = '0 0 auto'
  }
  const thicknesses = { Margin: 'margin', Padding: 'padding', BorderThickness: 'borderWidth' } as const
  for (const property of Object.keys(thicknesses) as (keyof typeof thicknesses)[]) {
    const value = resolve(props[property])
    if (value !== undefined && value !== null && value !== '') {
      style[thicknesses[property]] = xamlThickness(value)
    }
  }
  for (const [property, cssProperty] of [['Background', 'background'], ['BorderBrush', 'borderColor']] as const) {
    const value = resolve(props[property])
    if (value !== undefined && value !== null && value !== '') {
      if (property === 'Background') Object.assign(style, resolveBrushStyle(value, instance))
      else style[cssProperty] = String(value)
    }
  }
  const corners = resolve(props.CornerRadius)
  if (corners !== undefined && corners !== null && corners !== '') {
    style.borderRadius = String(corners).split(',').map((value) => cssLength(value.trim())).join(' ')
  }
  const horizontal = resolve(props.HorizontalAlignment)
  const vertical = resolve(props.VerticalAlignment)
  if (horizontal) style.justifySelf = alignment(horizontal, 'horizontal')
  if (vertical) style.alignSelf = alignment(vertical, 'vertical')
  if (resolve(props.Visibility) === 'Collapsed') style.display = 'none'
  if (resolve(props.IsHitTestVisible) === false) style.pointerEvents = 'none'
  const opacity = resolve(props.Opacity)
  if (opacity !== undefined && opacity !== '') style.opacity = String(opacity)
  if (resolve(props.BackgroundSizing) === 'InnerBorderEdge') style.backgroundClip = 'padding-box'
  return style
}
