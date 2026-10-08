<template>
  <span ref="rootRef" v-bind="badgeAttrs" class="win-infobadge win-theme-scope" :HorizontalAlignment="value(props.HorizontalAlignment)" :VerticalAlignment="value(props.VerticalAlignment)" :class="[displayKindClass, themeClass, attrs.class]" :style="badgeStyle" :aria-label="automationName">
    <Grid x:Name="RootGrid" class="win-infobadge-root-grid" Background="{x:Bind BadgeBackground, Mode=OneWay}" CornerRadius="{x:Bind TemplateSettings.InfoBadgeCornerRadius, Mode=OneWay}" Padding="{x:Bind BadgePadding, Mode=OneWay}">
      <TextBlock x:Name="ValueTextBlock" class="win-infobadge-value-text" Text="{x:Bind BadgeValue, Mode=OneWay}" Foreground="{x:Bind BadgeForeground, Mode=OneWay}" FontSize="{ThemeResource InfoBadgeValueFontSize}" Visibility="{x:Bind ValueVisibility, Mode=OneWay}" Margin="{x:Bind ValueMargin, Mode=OneWay}" HorizontalAlignment="Center" VerticalAlignment="Center" />
      <Viewbox x:Name="IconPresenter" class="win-infobadge-icon-presenter" Width="{x:Bind IconViewportWidth, Mode=OneWay}" Height="{x:Bind IconViewportHeight, Mode=OneWay}" Visibility="{x:Bind IconVisibility, Mode=OneWay}" Margin="{x:Bind IconMargin, Mode=OneWay}" HorizontalAlignment="Center" VerticalAlignment="Stretch">
        <ContentPresenter><IconElementPresenter /></ContentPresenter>
      </Viewbox>
    </Grid>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export const InfoBadgeIconSourceProperty = defineComponent({
  name: 'InfoBadge.IconSource',
  __infoBadgeIconSourceProperty: true,
  setup() { return () => null }
})
export default { IconSource: InfoBadgeIconSourceProperty }
</script>

<script setup lang="ts">
import { computed, Fragment, getCurrentInstance, h, isVNode, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowReactive, shallowRef, useAttrs, useSlots, watch, type VNode } from 'vue'
import ContentPresenter from './ContentPresenter.vue'
import FontIcon from './FontIcon.vue'
import Grid from './Grid.vue'
import Image from './Image.vue'
import SymbolIcon from './SymbolIcon.vue'
import TextBlock from './TextBlock.vue'
import Viewbox from './Viewbox.vue'
import { useI18n } from './i18n/index'
import { frameworkLayoutStyle } from './frameworkLayout'
import { cssLength } from './layout'
import { iconSourceKind } from './IconSource'
import { resolveXamlValue, updateXamlBinding, xamlNameScopeKey, xamlScopeKey } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Value: { type: [Number, String], default: -1 },
  IconSource: { type: [Object, String], default: null },
  Style: { type: [Object, String], default: '' },
  Background: { type: String, default: '' }, Foreground: { type: String, default: '' },
  IsEnabled: { type: [Boolean, String], default: true }, IsTabStop: { type: [Boolean, String], default: false },
  Visibility: { type: String, default: 'Visible' }, Opacity: { type: [Number, String], default: 1 },
  RequestedTheme: { type: String, default: 'Default' },
  Padding: { type: [String, Number], default: '' }, CornerRadius: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }
})
const emit = defineEmits(['update:Value', 'update:IconSource', 'update:Style', 'update:RequestedTheme'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
provide(xamlNameScopeKey, shallowReactive<Record<string, unknown>>({}))
const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
const actualHeight = ref(0)
const localValue = ref<number | undefined>()
const localStyle = shallowRef<unknown>()
const localIconSource = shallowRef<unknown>()
const localRequestedTheme = ref<string | undefined>()
const value = (input: unknown) => resolveXamlValue(input, instance)
const sourceValue = computed(() => value(props.Value))
const sourceStyle = computed(() => value(props.Style))
const sourceIconSource = computed(() => value(props.IconSource))
const sourceRequestedTheme = computed(() => String(value(props.RequestedTheme) ?? 'Default'))
watch(sourceValue, () => { localValue.value = undefined })
watch(sourceStyle, () => { localStyle.value = undefined })
watch(sourceIconSource, () => { localIconSource.value = undefined })
watch(sourceRequestedTheme, () => { localRequestedTheme.value = undefined })
const RequestedTheme = computed({
  get: () => localRequestedTheme.value ?? sourceRequestedTheme.value,
  set: (next: string) => {
    const requested = ['Light', 'Dark'].includes(next) ? next : 'Default'
    localRequestedTheme.value = requested
    updateXamlBinding(props.RequestedTheme, requested, instance)
    emit('update:RequestedTheme', requested)
  }
})
const themeClass = computed(() => ['Light', 'Dark'].includes(RequestedTheme.value) ? `theme-${RequestedTheme.value.toLowerCase()}` : '')
const validateValue = (input: unknown) => {
  const number = Number(input)
  const integer = Number.isFinite(number) ? Math.trunc(number) : -1
  if (integer < -1 || integer > 2147483647) throw new RangeError('InfoBadge.Value must be an Int32 equal to or greater than -1.')
  return integer
}
const BadgeValue = computed(() => localValue.value ?? validateValue(sourceValue.value))
const styleName = computed(() => {
  const style = localStyle.value !== undefined ? localStyle.value : sourceStyle.value
  if (typeof style !== 'string') return ''
  return style.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] ?? style.match(/^var\(--([^,)]+)\)$/)?.[1] ?? style
})
const styleMatch = computed(() => styleName.value.match(/^(Attention|Informational|Success|Caution|Critical)(Dot|Value|Icon)InfoBadgeStyle$/))
const styleSeverity = computed(() => styleMatch.value?.[1] ?? '')
const styleIcon = computed(() => {
  if (styleMatch.value?.[2] !== 'Icon') return null
  const sources: Record<string, Record<string, unknown>> = {
    Attention: { Kind: 'FontIcon', Glyph: '\uEA38' }, Informational: { Kind: 'FontIcon', Glyph: '\uF13F' },
    Success: { Kind: 'SymbolIcon', Symbol: 'Accept' }, Caution: { Kind: 'SymbolIcon', Symbol: 'Important' }, Critical: { Kind: 'SymbolIcon', Symbol: 'Cancel' }
  }
  return sources[styleSeverity.value] ?? null
})
const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[] : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []
const structuralIconSource = computed(() => {
  const find = (nodes: VNode[]): VNode | undefined => {
    for (const node of nodes) {
      if (node.type === Fragment) { const found = find(childrenOf(node)); if (found) return found }
      if ((node.type as { __infoBadgeIconSourceProperty?: boolean })?.__infoBadgeIconSourceProperty) return childrenOf(node).find(child => iconSourceKind(child))
    }
  }
  const node = find(slots.default?.() ?? [])
  return node ? { Kind: iconSourceKind(node), ...node.props } : null
})
const IconElement = computed<Record<string, unknown> | null>(() => {
  const hasIconSourceProperty = Object.keys(instance?.vnode.props ?? {}).some(key => key.replace(/-/g, '').toLowerCase() === 'iconsource')
  const source = localIconSource.value !== undefined ? localIconSource.value
    : hasIconSourceProperty ? sourceIconSource.value
      : structuralIconSource.value ?? styleIcon.value
  if (!source || typeof source !== 'object') return null
  if (isVNode(source)) return { Kind: iconSourceKind(source), ...source.props }
  return Object.fromEntries(Object.entries(source).map(([key, input]) => [key, value(input)]))
})
const iconKind = computed(() => String(IconElement.value?.Kind ?? (IconElement.value?.Glyph !== undefined ? 'FontIcon' : IconElement.value?.Symbol !== undefined ? 'SymbolIcon' : IconElement.value?.Data !== undefined ? 'PathIcon' : IconElement.value?.UriSource !== undefined ? 'BitmapIcon' : 'ImageIcon')))
const displayKind = computed(() => BadgeValue.value >= 0 ? 'Value' : IconElement.value ? iconKind.value === 'FontIcon' ? 'FontIcon' : 'Icon' : 'Dot')
const displayKindClass = computed(() => `win-infobadge-${displayKind.value.toLowerCase()}`)
const ValueVisibility = computed(() => displayKind.value === 'Value' ? 'Visible' : 'Collapsed')
const IconVisibility = computed(() => ['Icon', 'FontIcon'].includes(displayKind.value) ? 'Visible' : 'Collapsed')
const ValueMargin = computed(() => ValueVisibility.value === 'Visible' ? '4,0,4,2' : '0')
const IconMargin = computed(() => displayKind.value === 'FontIcon' ? '4,0,4,2' : displayKind.value === 'Icon' ? '4' : '0')
const BadgePadding = computed(() => value(props.Padding) !== '' ? value(props.Padding) : styleMatch.value?.[2] === 'Icon' && ['Attention', 'Informational'].includes(styleSeverity.value) ? '0,4,0,2' : '0')
const BadgeBackground = computed(() => value(props.Background) || ({ Attention: 'var(--SystemFillColorAttentionBrush)', Informational: 'var(--SystemFillColorSolidNeutralBrush)', Success: 'var(--SystemFillColorSuccessBrush)', Caution: 'var(--SystemFillColorCautionBrush)', Critical: 'var(--SystemFillColorCriticalBrush)' } as Record<string, string>)[styleSeverity.value] || 'var(--InfoBadgeBackground, var(--AccentFillColorDefaultBrush))')
const BadgeForeground = computed(() => value(props.Foreground) || 'var(--InfoBadgeForeground, var(--TextOnAccentFillColorPrimaryBrush))')
const thickness = (input: unknown): number[] => {
  const parts = String(input ?? '0').split(',').map(Number)
  return parts.length === 1 ? [parts[0], parts[0], parts[0], parts[0]] : parts.length === 2 ? [parts[0], parts[1], parts[0], parts[1]] : parts
}
const numeric = (input: unknown, fallback: number) => {
  const resolved = value(input)
  if (resolved === '' || resolved === undefined || resolved === 'Auto') return fallback
  const number = Number(resolved)
  return Number.isFinite(number) ? number : fallback
}
const desiredHeight = computed(() => {
  const padding = thickness(BadgePadding.value)
  const contentHeight = displayKind.value === 'Dot' ? 0 : displayKind.value === 'Value' ? 16 : numeric(IconElement.value?.FontSize, 20) + (displayKind.value === 'FontIcon' ? 2 : 8)
  return numeric(props.Height, Math.max(numeric(props.MinHeight, 4), Math.min(numeric(props.MaxHeight, 16), contentHeight + (padding[1] || 0) + (padding[3] || 0))))
})
const IconViewportHeight = computed(() => {
  const padding = thickness(BadgePadding.value)
  return Math.max(0, desiredHeight.value - (padding[1] || 0) - (padding[3] || 0) - (displayKind.value === 'FontIcon' ? 2 : 8))
})
const IconViewportWidth = computed(() => IconViewportHeight.value)
const TemplateSettings = computed(() => ({ InfoBadgeCornerRadius: value(props.CornerRadius) !== '' ? value(props.CornerRadius) : (actualHeight.value || desiredHeight.value) / 2, IconElement: IconElement.value }))
const decodeGlyph = (input: unknown) => {
  const glyph = String(input ?? '')
  const match = glyph.match(/^(?:\\u|&#x|0x)([\da-f]+);?$/i)
  return match ? String.fromCodePoint(parseInt(match[1], 16)) : glyph
}
const IconElementPresenter = defineComponent({
  name: 'InfoBadgeIconElementPresenter',
  setup() {
    return () => {
      const source = IconElement.value as (Record<string, unknown> & {
        FontFamily?: string; FontSize?: string | number; Symbol?: string | number
        Foreground?: InstanceType<typeof FontIcon>['$props']['Foreground']
        Width?: string | number; Height?: string | number
      }) | null
      if (!source) return null
      const foreground = (source.Foreground || BadgeForeground.value) as InstanceType<typeof FontIcon>['$props']['Foreground']
      if (iconKind.value === 'FontIcon') return h(FontIcon, { Glyph: decodeGlyph(source.Glyph), FontFamily: source.FontFamily || 'var(--SymbolThemeFontFamily)', FontSize: source.FontSize ?? 20, Foreground: foreground })
      if (iconKind.value === 'SymbolIcon') return h(SymbolIcon, { Symbol: source.Symbol, Foreground: foreground, FontSize: source.FontSize ?? 20 })
      if (iconKind.value === 'PathIcon') return h('svg', { viewBox: '0 0 20 20', width: 20, height: 20, 'aria-hidden': 'true', style: { fill: foreground } }, [h('path', { d: source.Data })])
      return h(Image, { Source: source.ImageSource ?? source.UriSource, Stretch: 'Uniform', Width: source.Width ?? 20, Height: source.Height ?? 20 })
    }
  }
})
const badgeAttrs = computed(() => { const { class: _class, style: _style, ...rest } = attrs; return { ...rest, tabindex: value(props.IsTabStop) === true ? 0 : undefined } })
const badgeStyle = computed(() => {
  const style = frameworkLayoutStyle(props, instance)
  // WinUI MeasureOverride ensures the desired width is at least the desired height.
  style.minWidth = cssLength(Math.max(numeric(props.MinWidth, 4), desiredHeight.value))
  style.height = cssLength(desiredHeight.value)
  style.color = String(BadgeForeground.value)
  style.background = ''; style.padding = ''; style.borderRadius = ''
  return [attrs.style, style]
})
const automationName = computed(() => String(value(attrs['AutomationProperties.Name']) || (displayKind.value === 'Value' ? t('control.infobadge.value', { value: BadgeValue.value }) : t(`control.infobadge.${displayKind.value === 'Dot' ? 'dot' : 'icon'}`))))
const Value = computed({ get: () => BadgeValue.value, set: (input: unknown) => { const next = validateValue(input); localValue.value = next; updateXamlBinding(props.Value, next, instance); emit('update:Value', next) } })
const Style = computed({ get: () => localStyle.value !== undefined ? localStyle.value : sourceStyle.value, set: (next: unknown) => { localStyle.value = next; updateXamlBinding(props.Style, next, instance); emit('update:Style', next) } })
const IconSource = computed({ get: () => IconElement.value, set: (next: unknown) => { localIconSource.value = next; updateXamlBinding(props.IconSource, next, instance); emit('update:IconSource', next) } })
defineExpose({ Value, Style, IconSource, RequestedTheme, TemplateSettings, Element: rootRef })
provide(xamlScopeKey, { RequestedTheme, BadgeValue, BadgeBackground, BadgeForeground, BadgePadding, TemplateSettings, ValueVisibility, IconVisibility, ValueMargin, IconMargin, IconViewportWidth, IconViewportHeight })
let resizeObserver: ResizeObserver | undefined
const measure = () => { if (rootRef.value) actualHeight.value = rootRef.value.offsetHeight }
onMounted(() => { measure(); if (typeof ResizeObserver !== 'undefined' && rootRef.value) { resizeObserver = new ResizeObserver(measure); resizeObserver.observe(rootRef.value) } })
watch(desiredHeight, () => nextTick(measure))
onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<style scoped>
.win-infobadge { box-sizing: border-box; display: inline-grid; width: max-content; min-width: var(--InfoBadgeMinWidth, 4px); min-height: var(--InfoBadgeMinHeight, 4px); max-height: var(--InfoBadgeMaxHeight, 16px); flex: 0 0 auto; vertical-align: middle; font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif); }
.win-infobadge :deep(.win-infobadge-root-grid) { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); min-width: 0; min-height: 0; width: 100%; height: 100%; overflow: hidden; }
.win-infobadge :deep(.win-infobadge-value-text) { line-height: 14px !important; font-weight: 400; text-align: center; white-space: nowrap; }
.win-infobadge :deep(.win-infobadge-icon-presenter), .win-infobadge :deep(.win-content-presenter) { min-width: 0; min-height: 0; }
@media (forced-colors: active) {
  .win-infobadge :deep(.win-infobadge-root-grid) { background: Highlight !important; forced-color-adjust: none; }
  .win-infobadge :deep(.win-infobadge-value-text), .win-infobadge :deep(.win-font-icon), .win-infobadge :deep(.win-symbol-icon) { color: HighlightText !important; }
}
</style>
