<template>
  <div ref="rootRef" v-bind="forwardedAttrs" class="win-pips-pager" :class="[orientationClass, { 'is-disabled': !isEnabled }]" :style="rootStyle" :dir="flowDirection" role="group" :aria-label="pagerLabel" :aria-disabled="!isEnabled" @pointerenter="OnPointerEntered" @pointerleave="OnPointerExited" @pointercancel="OnPointerCanceled" @pointerdown="OnPointerPressed" @focusin="OnGotFocus" @focusout="OnLostFocus" @keydown="OnKeyDown">
    <StackPanel class="pips-root-panel" Orientation="{x:Bind orientation, Mode=OneWay}">
      <Button class="navigation-button previous-page-button" Visibility="{x:Bind previousVisibility, Mode=OneWay}" IsEnabled="{x:Bind previousEnabled, Mode=OneWay}" Width="{x:Bind previousStyle.Width, Mode=OneWay}" Height="{x:Bind previousStyle.Height, Mode=OneWay}" Padding="0" MinWidth="0" MinHeight="0" HorizontalAlignment="Center" VerticalAlignment="Center" Background="{x:Bind previousStyle.Background, Mode=OneWay}" Foreground="{x:Bind previousStyle.Foreground, Mode=OneWay}" BorderBrush="{x:Bind previousStyle.BorderBrush, Mode=OneWay}" BorderThickness="{x:Bind previousStyle.BorderThickness, Mode=OneWay}" CornerRadius="{x:Bind previousStyle.CornerRadius, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind previousLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind previousLabel, Mode=OneWay}" Click="OnPreviousButtonClicked" :class="{ hidden: !previousVisible }" aria-hidden="{x:Bind previousHidden, Mode=OneWay}">
        <Border class="navigation-scale-host"><FontIcon class="navigation-glyph" Glyph="{x:Bind previousStyle.Content, Mode=OneWay}" FontFamily="{x:Bind previousStyle.FontFamily, Mode=OneWay}" FontSize="{x:Bind previousStyle.FontSize, Mode=OneWay}" /></Border>
      </Button>
      <ScrollViewer ref="scrollViewerRef" class="pips-viewport" Width="{x:Bind viewportWidth, Mode=OneWay}" Height="{x:Bind viewportHeight, Mode=OneWay}" VerticalScrollBarVisibility="Hidden" VerticalScrollMode="Disabled" HorizontalScrollBarVisibility="Hidden" HorizontalScrollMode="Disabled" IsHorizontalScrollChainingEnabled="False" IsVerticalScrollChainingEnabled="False" ZoomMode="Disabled" IsTabStop="False" HorizontalAlignment="Center" VerticalAlignment="Center">
        <ItemsRepeater ref="repeaterRef" class="pips-repeater" ItemsSource="{x:Bind pipItems, Mode=OneWay}" HorizontalCacheLength="1" VerticalCacheLength="1">
          <ItemsRepeater.Layout><StackLayout Orientation="{x:Bind orientation, Mode=OneWay}" /></ItemsRepeater.Layout>
          <ItemsRepeater.ItemTemplate>
            <DataTemplate>
              <Button class="pip-button" Width="{x:Bind Width}" Height="{x:Bind Height}" Padding="0" MinWidth="0" MinHeight="0" IsEnabled="{x:Bind IsEnabled}" Background="{x:Bind Background}" Foreground="{x:Bind Foreground}" BorderBrush="{x:Bind BorderBrush}" BorderThickness="{x:Bind BorderThickness}" CornerRadius="{x:Bind CornerRadius}" AutomationProperties.Name="{x:Bind Name}" data-page-index="{x:Bind Index}" aria-pressed="{x:Bind IsSelected}" aria-posinset="{x:Bind PositionInSet}" aria-setsize="{x:Bind SizeOfSet}" tabindex="{x:Bind TabIndex}" Click="OnPipClicked">
                <FontIcon class="pip-glyph" Glyph="{x:Bind Content}" FontFamily="{x:Bind FontFamily}" FontSize="{x:Bind FontSize}" />
              </Button>
            </DataTemplate>
          </ItemsRepeater.ItemTemplate>
        </ItemsRepeater>
      </ScrollViewer>
      <Button class="navigation-button next-page-button" Visibility="{x:Bind nextVisibility, Mode=OneWay}" IsEnabled="{x:Bind nextEnabled, Mode=OneWay}" Width="{x:Bind nextStyle.Width, Mode=OneWay}" Height="{x:Bind nextStyle.Height, Mode=OneWay}" Padding="0" MinWidth="0" MinHeight="0" HorizontalAlignment="Center" VerticalAlignment="Center" Background="{x:Bind nextStyle.Background, Mode=OneWay}" Foreground="{x:Bind nextStyle.Foreground, Mode=OneWay}" BorderBrush="{x:Bind nextStyle.BorderBrush, Mode=OneWay}" BorderThickness="{x:Bind nextStyle.BorderThickness, Mode=OneWay}" CornerRadius="{x:Bind nextStyle.CornerRadius, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind nextLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind nextLabel, Mode=OneWay}" Click="OnNextButtonClicked" :class="{ hidden: !nextVisible }" aria-hidden="{x:Bind nextHidden, Mode=OneWay}">
        <Border class="navigation-scale-host"><FontIcon class="navigation-glyph" Glyph="{x:Bind nextStyle.Content, Mode=OneWay}" FontFamily="{x:Bind nextStyle.FontFamily, Mode=OneWay}" FontSize="{x:Bind nextStyle.FontSize, Mode=OneWay}" /></Border>
      </Button>
    </StackPanel>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, provide, proxyRefs, ref, shallowRef, useAttrs, watch, type CSSProperties } from 'vue'
import Border from './Border.vue'
import ButtonControl from './Button.vue'
import FontIcon from './FontIcon.vue'
import ItemsRepeater from './ItemsRepeater.vue'
import ScrollViewer from './ScrollViewer.vue'
import StackPanel from './StackPanel.vue'
import { DataTemplate, StackLayout, getVNodeChildren } from './CollectionProperties'
import { xamlResourceDictionaryKey } from './Page.vue'
import { useI18n } from './i18n/index'
import { normalizeXamlVNode, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'

// A template owns the current values of its TemplateBindings. Materialize
// those values before passing them to the shared Button implementation.
const Button = defineComponent({
  name: 'PipsPagerTemplateButton', inheritAttrs: false,
  setup(_, { attrs: templateAttrs, slots: templateSlots }) {
    const templateInstance = getCurrentInstance()
    return () => {
      const values = Object.fromEntries(Object.entries(templateAttrs).map(([name, input]) => [name,
        typeof input === 'string' && input.startsWith('{') ? resolveXamlValue(input, templateInstance) : input]))
      return normalizeXamlVNode(h(ButtonControl, values, templateSlots), templateInstance)
    }
  }
})

defineOptions({ inheritAttrs: false })
const props = defineProps({
  NumberOfPages: { type: [Number, String], default: -1 },
  SelectedPageIndex: { type: [Number, String], default: 0 },
  MaxVisiblePips: { type: [Number, String], default: 5 },
  Orientation: { type: String, default: 'Horizontal' },
  PreviousButtonVisibility: { type: String, default: 'Collapsed' },
  NextButtonVisibility: { type: String, default: 'Collapsed' },
  PreviousButtonStyle: { type: [String, Object], default: '{StaticResource PipsPagerPreviousPageButtonStyle}' },
  NextButtonStyle: { type: [String, Object], default: '{StaticResource PipsPagerNextPageButtonStyle}' },
  SelectedPipStyle: { type: [String, Object], default: '{StaticResource PipsPagerSelectedPipButtonStyle}' },
  NormalPipStyle: { type: [String, Object], default: '{StaticResource PipsPagerNormalPipButtonStyle}' },
  WrapMode: { type: String, default: 'None' },
  IsEnabled: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: false },
  Background: { type: String, default: 'Transparent' },
  Width: { type: [Number, String], default: '' }, Height: { type: [Number, String], default: '' },
  MinWidth: { type: [Number, String], default: '' }, MinHeight: { type: [Number, String], default: '' },
  MaxWidth: { type: [Number, String], default: '' }, MaxHeight: { type: [Number, String], default: '' },
  Margin: { type: [Number, String], default: '' },
  HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Top' },
  FlowDirection: { type: String, default: 'LeftToRight' }
})
const emit = defineEmits(['SelectedIndexChanged', 'update:SelectedPageIndex'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const { t } = useI18n()
const resources = inject<Record<string, any> | null>(xamlResourceDictionaryKey, null)
const overrides = shallowRef<Record<string, unknown>>({})
const value = (name: keyof typeof props) => resolveXamlValue(name in overrides.value ? overrides.value[name] : props[name], instance)
const integer = (name: keyof typeof props, fallback: number) => {
  const number = Number(value(name))
  return Number.isFinite(number) ? Math.trunc(number) : fallback
}
const numberOfPages = computed(() => integer('NumberOfPages', -1))
const maxVisiblePips = computed(() => Math.max(0, integer('MaxVisiblePips', 5)))
const orientation = computed(() => value('Orientation') === 'Vertical' ? 'Vertical' : 'Horizontal')
const orientationClass = computed(() => `orientation-${orientation.value.toLowerCase()}`)
const isEnabled = computed(() => value('IsEnabled') !== false && String(value('IsEnabled')).toLowerCase() !== 'false')
const flowDirection = computed(() => value('FlowDirection') === 'RightToLeft' ? 'rtl' : 'ltr')
const previousVisibility = computed(() => String(value('PreviousButtonVisibility')))
const nextVisibility = computed(() => String(value('NextButtonVisibility')))
const canWrap = computed(() => value('WrapMode') === 'Wrap' && numberOfPages.value > 1)
const rootRef = ref<HTMLElement | null>(null)
const scrollViewerRef = ref<any>(null)
const repeaterRef = ref<any>(null)
const currentIndex = ref(Math.max(0, integer('SelectedPageIndex', 0)))
const selectedIndex = computed(() => numberOfPages.value > 0 ? Math.min(currentIndex.value, numberOfPages.value - 1) : currentIndex.value)
const infiniteItemCount = ref(Math.max(maxVisiblePips.value, currentIndex.value + 1))
const pageCount = computed(() => numberOfPages.value === 0 || maxVisiblePips.value === 0 ? 0 : numberOfPages.value > 0 ? numberOfPages.value : infiniteItemCount.value)
const visibleCount = computed(() => Math.min(pageCount.value, maxVisiblePips.value))
const isPointerOver = ref(false)
const isFocused = ref(false)
let pointerFocus = false
let resizeObserver: ResizeObserver | undefined
let scrollRevision = 0
const canGoPrevious = computed(() => pageCount.value > 0 && (selectedIndex.value > 0 || canWrap.value))
const canGoNext = computed(() => pageCount.value > 0 && (numberOfPages.value < 0 || selectedIndex.value < numberOfPages.value - 1 || canWrap.value))
const previousEnabled = computed(() => isEnabled.value && canGoPrevious.value)
const nextEnabled = computed(() => isEnabled.value && canGoNext.value)
const pointerVisibilityActive = computed(() => isPointerOver.value || isFocused.value)
const previousVisible = computed(() => canGoPrevious.value && (previousVisibility.value === 'Visible' || (previousVisibility.value === 'VisibleOnPointerOver' && pointerVisibilityActive.value)))
const nextVisible = computed(() => canGoNext.value && (nextVisibility.value === 'Visible' || (nextVisibility.value === 'VisibleOnPointerOver' && pointerVisibilityActive.value)))
const previousHidden = computed(() => !previousVisible.value)
const nextHidden = computed(() => !nextVisible.value)
const pagerLabel = computed(() => String(resolveXamlValue(attrs['AutomationProperties.Name'], instance) || t('PipsPagerNameText')))
const previousLabel = computed(() => t('PipsPagerPreviousPageButtonText'))
const nextLabel = computed(() => t('PipsPagerNextPageButtonText'))
const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => !['SelectedIndexChanged', 'AutomationProperties.Name'].includes(name))))

// These values are the styles from PipsPager_themeresources.xaml. Styles are
// XAML objects: read their Setter elements, including BasedOn, rather than
// passing a resource expression or object through to the browser style attr.
const resourceKey = (source: unknown) => typeof source === 'string' ? source.match(/^\{\s*(?:StaticResource|ThemeResource)\s+([^\s}]+)\s*\}$/)?.[1] : undefined
const styleDefaults = (kind: string): Record<string, any> => {
  const navigation = kind === 'previous' || kind === 'next'
  return {
    Width: navigation ? 24 : orientation.value === 'Horizontal' ? 12 : 24,
    Height: navigation ? 24 : orientation.value === 'Horizontal' ? 24 : 12,
    Background: 'Transparent', BorderBrush: 'Transparent', BorderThickness: 1, CornerRadius: 4,
    Foreground: `var(--PipsPager${navigation ? 'NavigationButton' : 'SelectionIndicator'}Foreground${kind === 'selected' ? 'Selected' : ''}, var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill)))`,
    Content: kind === 'previous' ? '\uEDDB' : kind === 'next' ? '\uEDDC' : '\uEA3B',
    FontSize: navigation ? 8 : kind === 'selected' ? 6 : 4,
    FontFamily: 'var(--SymbolThemeFontFamily, \"Segoe Fluent Icons\")'
  }
}
const styleProperties = (source: unknown, kind: string, visited = new Set<string>()): Record<string, any> => {
  const key = resourceKey(source)
  const node = key ? resources?.[key] : source && typeof source === 'object' ? source : undefined
  const result = styleDefaults(kind)
  if (!node || (key && visited.has(key))) return result
  if (key) visited.add(key)
  if (node.props?.BasedOn) Object.assign(result, styleProperties(node.props.BasedOn, kind, visited))
  for (const setter of getVNodeChildren(node)) {
    const property = setter.props?.Property
    if (typeof property === 'string') result[property] = resolveXamlValue(setter.props?.Value, instance)
  }
  return result
}
const styleSource = (name: 'NormalPipStyle' | 'SelectedPipStyle' | 'PreviousButtonStyle' | 'NextButtonStyle') => {
  const source = name in overrides.value ? overrides.value[name] : props[name]
  return typeof source === 'string' && /^\{\s*(?:x:Bind|Binding)\b/.test(source) ? resolveXamlValue(source, instance) : source
}
const normalStyle = computed(() => styleProperties(styleSource('NormalPipStyle'), 'normal'))
const selectedStyle = computed(() => styleProperties(styleSource('SelectedPipStyle'), 'selected'))
const previousStyle = computed(() => styleProperties(styleSource('PreviousButtonStyle'), 'previous'))
const nextStyle = computed(() => styleProperties(styleSource('NextButtonStyle'), 'next'))
const dimension = (style: Record<string, any>, name: string, fallback: number) => {
  const number = Number(style[name])
  return Number.isFinite(number) && number >= 0 ? number : fallback
}
const normalMainSize = computed(() => dimension(normalStyle.value, orientation.value === 'Horizontal' ? 'Width' : 'Height', 12))
const selectedMainSize = computed(() => dimension(selectedStyle.value, orientation.value === 'Horizontal' ? 'Width' : 'Height', 12))
const viewportMainSize = computed(() => visibleCount.value === 0 ? 0 : normalMainSize.value * (visibleCount.value - 1) + selectedMainSize.value)
const viewportCrossSize = computed(() => pageCount.value === 0 ? 0 : Math.max(dimension(normalStyle.value, orientation.value === 'Horizontal' ? 'Height' : 'Width', 24), dimension(selectedStyle.value, orientation.value === 'Horizontal' ? 'Height' : 'Width', 24)))
const viewportWidth = computed(() => orientation.value === 'Horizontal' ? viewportMainSize.value : viewportCrossSize.value)
const viewportHeight = computed(() => orientation.value === 'Horizontal' ? viewportCrossSize.value : viewportMainSize.value)
const pipItems = computed(() => Array.from({ length: pageCount.value }, (_, index) => {
  const item: Record<string, any> = {
    Index: index,
    get IsSelected() { return index === selectedIndex.value },
    get IsEnabled() { return isEnabled.value },
    get Name() { return t('PipsPagerPageText', { page: index + 1 }) },
    PositionInSet: index + 1,
    get SizeOfSet() { return numberOfPages.value > 0 ? numberOfPages.value : undefined },
    get TabIndex() { return index === selectedIndex.value && isEnabled.value ? 0 : -1 }
  }
  for (const property of ['Width', 'Height', 'Background', 'Foreground', 'BorderBrush', 'BorderThickness', 'CornerRadius', 'Content', 'FontSize', 'FontFamily']) {
    Object.defineProperty(item, property, { enumerable: true, get: () => (index === selectedIndex.value ? selectedStyle.value : normalStyle.value)[property] })
  }
  return item
}))
const cssLength = (source: unknown) => {
  if (source === undefined || source === null || source === '' || source === 'Auto') return undefined
  return typeof source === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(source)) ? `${source}px` : String(source)
}
const thickness = (source: unknown) => {
  if (source === undefined || source === null || source === '') return undefined
  const parts = String(source).split(',').map(part => cssLength(part.trim()))
  return parts.length === 2 ? `${parts[1]} ${parts[0]}` : parts.length === 4 ? `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}` : parts[0]
}
const rootStyle = computed<CSSProperties>(() => ({
  flex: '0 0 auto',
  width: cssLength(value('Width')), height: cssLength(value('Height')),
  minWidth: cssLength(value('MinWidth')), minHeight: cssLength(value('MinHeight')),
  maxWidth: cssLength(value('MaxWidth')), maxHeight: cssLength(value('MaxHeight')),
  margin: thickness(value('Margin')), background: String(value('Background') || 'transparent'),
  justifySelf: ({ Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' } as Record<string, string>)[String(value('HorizontalAlignment'))],
  // A vertical StackPanel uses align-self for the horizontal slot. Its
  // layout adapter reads the public alignment attrs when the axis changes.
  alignSelf: ({ Left: 'flex-start', Center: 'center', Right: 'flex-end', Stretch: 'stretch' } as Record<string, string>)[String(value('HorizontalAlignment'))]
}))
const ScrollToSelectedPip = async (animate = true) => {
  const revision = ++scrollRevision
  await nextTick()
  if (revision !== scrollRevision || !pageCount.value) return
  const offset = Math.max(0, selectedIndex.value * normalMainSize.value + selectedMainSize.value / 2 - viewportMainSize.value / 2)
  const viewer = scrollViewerRef.value
  const maximum = orientation.value === 'Horizontal' ? Math.max(0, viewer?.ScrollableWidth ?? 0) : Math.max(0, viewer?.ScrollableHeight ?? 0)
  const bounded = Math.min(offset, maximum)
  viewer?.ChangeView?.(orientation.value === 'Horizontal' ? bounded : 0, orientation.value === 'Vertical' ? bounded : 0, null, !animate)
}
const growInfiniteItems = () => {
  if (numberOfPages.value >= 0 || maxVisiblePips.value === 0) return
  const minimum = Math.max(selectedIndex.value + 1, maxVisiblePips.value)
  if (minimum > infiniteItemCount.value) infiniteItemCount.value = minimum
  else if (selectedIndex.value === infiniteItemCount.value - 1) infiniteItemCount.value += 1
}
const SetSelectedPageIndex = (index: unknown, userInitiated = false) => {
  if (userInitiated && (!isEnabled.value || !pageCount.value)) return
  const parsed = Number(index)
  if (!Number.isFinite(parsed)) return
  const bounded = numberOfPages.value > 0 ? Math.min(Math.max(0, Math.trunc(parsed)), numberOfPages.value - 1) : Math.max(0, Math.trunc(parsed))
  if (bounded === currentIndex.value) return
  currentIndex.value = bounded
  growInfiniteItems()
  updateXamlBinding(props.SelectedPageIndex, bounded, instance)
  emit('update:SelectedPageIndex', bounded)
  const args = Object.freeze({})
  emit('SelectedIndexChanged', sender, args)
  if (!attrs.onSelectedIndexChanged) resolveXamlHandler(attrs.SelectedIndexChanged, instance)?.(sender, args)
  void ScrollToSelectedPip()
}
const OnPreviousButtonClicked = () => {
  if (previousEnabled.value) SetSelectedPageIndex(canWrap.value && selectedIndex.value === 0 ? numberOfPages.value - 1 : selectedIndex.value - 1, true)
}
const OnNextButtonClicked = () => {
  if (nextEnabled.value) SetSelectedPageIndex(canWrap.value && selectedIndex.value === numberOfPages.value - 1 ? 0 : selectedIndex.value + 1, true)
}
const OnPipClicked = (button: { Element?: HTMLElement }, args: { OriginalEvent?: MouseEvent }) => {
  const element = button.Element ?? args.OriginalEvent?.currentTarget as HTMLElement | undefined
  SetSelectedPageIndex(element?.dataset.pageIndex, true)
}
const OnPointerEntered = () => { isPointerOver.value = true }
const OnPointerExited = (event: PointerEvent) => {
  const rect = rootRef.value?.getBoundingClientRect()
  if (!rect || event.clientX <= rect.left + 1 || event.clientX >= rect.right - 1 || event.clientY <= rect.top + 1 || event.clientY >= rect.bottom - 1) isPointerOver.value = false
}
const OnPointerCanceled = () => { isPointerOver.value = false; pointerFocus = false }
const OnPointerPressed = () => { pointerFocus = true; isFocused.value = false }
const OnGotFocus = () => { isFocused.value = !pointerFocus; pointerFocus = false }
const OnLostFocus = (event: FocusEvent) => { if (!rootRef.value?.contains(event.relatedTarget as Node)) isFocused.value = false }
const OnKeyDown = (event: KeyboardEvent) => {
  if (!isEnabled.value || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
  const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1
  const logicalDirection = orientation.value === 'Horizontal' && flowDirection.value === 'rtl' ? -direction : direction
  const current = (event.target as HTMLElement)?.closest<HTMLElement>('[data-page-index]')
  const targetIndex = Math.max(0, Math.min(pageCount.value - 1, Number(current?.dataset.pageIndex ?? selectedIndex.value) + logicalDirection))
  event.preventDefault()
  pointerFocus = false
  isFocused.value = true
  // WinUI arrow keys move focus; activation through Space/Enter selects.
  const element = repeaterRef.value?.GetOrCreateElement?.(targetIndex)
  const button = element?.matches?.('button') ? element : element?.querySelector?.('button')
  button?.focus({ preventScroll: true })
}
provide(xamlScopeKey, { orientation, previousVisibility, nextVisibility, previousHidden, nextHidden, previousEnabled, nextEnabled, previousLabel, nextLabel, previousStyle, nextStyle, viewportWidth, viewportHeight, pipItems, OnPreviousButtonClicked, OnNextButtonClicked, OnPipClicked })
watch(() => integer('SelectedPageIndex', 0), index => SetSelectedPageIndex(index))
watch([numberOfPages, maxVisiblePips], () => {
  if (numberOfPages.value >= 0 && currentIndex.value >= numberOfPages.value) SetSelectedPageIndex(Math.max(0, numberOfPages.value - 1))
  growInfiniteItems()
  void ScrollToSelectedPip(false)
})
watch([orientation, normalMainSize, selectedMainSize, visibleCount], () => { void ScrollToSelectedPip(false) })
const dependencyProperty = (name: keyof typeof props) => computed({ get: () => value(name), set: next => { overrides.value = { ...overrides.value, [name]: next } } })
const exposed = {
  NumberOfPages: dependencyProperty('NumberOfPages'),
  SelectedPageIndex: computed({ get: () => selectedIndex.value, set: next => SetSelectedPageIndex(next) }),
  MaxVisiblePips: dependencyProperty('MaxVisiblePips'), Orientation: dependencyProperty('Orientation'),
  PreviousButtonVisibility: dependencyProperty('PreviousButtonVisibility'), NextButtonVisibility: dependencyProperty('NextButtonVisibility'),
  PreviousButtonStyle: dependencyProperty('PreviousButtonStyle'), NextButtonStyle: dependencyProperty('NextButtonStyle'),
  SelectedPipStyle: dependencyProperty('SelectedPipStyle'), NormalPipStyle: dependencyProperty('NormalPipStyle'),
  WrapMode: dependencyProperty('WrapMode'), IsEnabled: dependencyProperty('IsEnabled'),
  TemplateSettings: computed(() => ({ PipsPagerItems: Array.from({ length: pageCount.value }, (_, index) => index + 1) }))
}
const sender = proxyRefs(exposed)
defineExpose(exposed)
onMounted(() => {
  growInfiniteItems()
  void ScrollToSelectedPip(false)
  resizeObserver = new ResizeObserver(() => { void ScrollToSelectedPip(false) })
  if (rootRef.value) resizeObserver.observe(rootRef.value)
})
onBeforeUnmount(() => { ++scrollRevision; resizeObserver?.disconnect() })
</script>

<style scoped>
.win-pips-pager { display: inline-flex; width: fit-content; max-width: 100%; box-sizing: border-box; min-width: 0; min-height: 0; user-select: none; }
.win-pips-pager :deep(.pips-root-panel) { width: max-content; max-width: 100%; align-items: center !important; min-width: 0; min-height: 0; }
.win-pips-pager :deep(.pips-viewport) { flex: 0 0 auto; overflow: hidden; }
.win-pips-pager :deep(.pips-viewport .scroll-content) { min-width: 0; min-height: 0; }
.win-pips-pager :deep(.pips-repeater) { flex: 0 0 auto; }
.win-pips-pager :deep(.navigation-button), .win-pips-pager :deep(.pip-button) { flex: 0 0 auto; margin: 0; padding: 0; box-sizing: border-box; cursor: default; box-shadow: none; outline-offset: -2px; transition: none; --ButtonBackground: transparent; --ButtonBackgroundPointerOver: var(--PipsPagerNavigationButtonBackgroundPointerOver, transparent); --ButtonBackgroundPressed: var(--PipsPagerNavigationButtonBackgroundPressed, transparent); --ButtonBackgroundDisabled: var(--PipsPagerNavigationButtonBackgroundDisabled, transparent); --ButtonForegroundPointerOver: var(--PipsPagerNavigationButtonForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary))); --ButtonForegroundPressed: var(--PipsPagerNavigationButtonForegroundPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary))); --ButtonForegroundDisabled: var(--PipsPagerNavigationButtonForegroundDisabled, var(--ControlStrongFillColorDisabledBrush, var(--ctrl-strong-fill-disabled))); --ButtonBorderBrushPointerOver: transparent; --ButtonBorderBrushPointerOverTop: transparent; --ButtonBorderBrushPressed: transparent; --ButtonBorderBrushPressedTop: transparent; --ButtonBorderBrushDisabled: transparent; --ButtonBorderBrushDisabledTop: transparent; --ButtonBorderBrushPointerOverBottom: transparent; --ButtonBorderBrushPressedBottom: transparent; --ButtonBorderBrushDisabledBottom: transparent; }
.win-pips-pager :deep(.navigation-button::after), .win-pips-pager :deep(.pip-button::after) { display: none; }
.win-pips-pager :deep(.navigation-button) { width: 24px; height: 24px; }
.win-pips-pager.orientation-horizontal :deep(.navigation-button) { transform: rotate(-90deg); }
.win-pips-pager :deep(.navigation-button.hidden) { opacity: 0; pointer-events: none; }
.win-pips-pager :deep(.navigation-glyph), .win-pips-pager :deep(.pip-glyph) { color: inherit; }
.win-pips-pager :deep(.navigation-scale-host) { display: grid; place-items: center; transform-origin: center; }
.win-pips-pager :deep(.navigation-button:active:not(:disabled) .navigation-scale-host) { animation: pips-navigation-pressed 16ms step-end forwards; }
@keyframes pips-navigation-pressed { to { transform: scale(.875); } }
.win-pips-pager :deep(.pip-button) { width: 12px; height: 24px; --ButtonBackgroundPointerOver: var(--PipsPagerSelectionIndicatorBackgroundPointerOver, transparent); --ButtonBackgroundPressed: var(--PipsPagerSelectionIndicatorBackgroundPressed, transparent); --ButtonBackgroundDisabled: var(--PipsPagerSelectionIndicatorBackgroundDisabled, transparent); --ButtonForegroundPointerOver: var(--PipsPagerSelectionIndicatorForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary))); --ButtonForegroundPressed: var(--PipsPagerSelectionIndicatorForegroundPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary))); --ButtonForegroundDisabled: var(--PipsPagerSelectionIndicatorForegroundDisabled, var(--ControlStrongFillColorDisabledBrush, var(--ctrl-strong-fill-disabled))); }
.win-pips-pager.orientation-vertical :deep(.pip-button) { width: 24px; height: 12px; }
.win-pips-pager :deep(.pip-button:hover:not(:disabled) .pip-glyph) { font-size: 6px !important; }
.win-pips-pager :deep(.pip-button:active:not(:disabled) .pip-glyph) { font-size: 4px !important; }
.win-pips-pager :deep(.navigation-button:focus-visible), .win-pips-pager :deep(.pip-button:focus-visible) { outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary)); outline-offset: -2px; }
@media (prefers-reduced-motion: reduce) { .win-pips-pager :deep(.navigation-button:active:not(:disabled) .navigation-scale-host) { animation: none; transform: scale(.875); } }
@media (forced-colors: active) { .win-pips-pager :deep(.navigation-button), .win-pips-pager :deep(.pip-button) { background: ButtonFace !important; color: ButtonText !important; border-color: ButtonFace !important; } .win-pips-pager :deep(.pip-button[aria-pressed=true]), .win-pips-pager :deep(.pip-button:hover:not(:disabled)), .win-pips-pager :deep(.pip-button:active:not(:disabled)) { color: HighlightText !important; background: Highlight !important; border-color: Highlight !important; } .win-pips-pager :deep(.navigation-button:disabled), .win-pips-pager :deep(.pip-button:disabled) { color: GrayText !important; } .win-pips-pager :deep(.navigation-button:focus-visible), .win-pips-pager :deep(.pip-button:focus-visible) { outline-color: Highlight; } }
</style>
