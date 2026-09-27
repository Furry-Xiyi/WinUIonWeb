<template>
  <Teleport to="body">
    <div v-if="visible" class="date-time-picker-overlay" :class="themeClasses" :style="overlayStyle" @pointerdown="OnLightDismiss" />
    <div v-if="visible" ref="presenterRef" class="date-time-picker-presenter" :class="themeClasses" :style="presenterStyle" v-acrylic-brush.host-backdrop="presenterBackgroundStyle" v-theme-shadow="{ Translation: 32 }" role="dialog" aria-modal="true" :aria-label="dialogLabel" @keydown="OnKeyDown">
      <Grid class="picker-content-panel">
        <Grid.RowDefinitions>
          <RowDefinition Height="*" />
          <RowDefinition Height="Auto" />
        </Grid.RowDefinitions>
        <Grid class="picker-host-grid" :style="columnStyle">
          <Grid.ColumnDefinitions>
            <ColumnDefinition Width="*" />
            <ColumnDefinition Width="Auto" />
            <ColumnDefinition Width="*" />
            <ColumnDefinition Width="Auto" />
            <ColumnDefinition Width="*" />
          </Grid.ColumnDefinitions>
          <div class="picker-highlight" aria-hidden="true" />
          <PickerColumn v-if="columns.length" ref="firstRef" :key="columns[0]?.key" Grid.Column="0" Items="{x:Bind FirstItems}" SelectedIndex="{x:Bind FirstIndex}" ShouldLoop="{x:Bind FirstLoop}" AutomationName="{x:Bind FirstLabel}" :style="firstStyle" SelectionChanged="OnFirstSelectionChanged" />
          <Rectangle v-if="columns.length > 1" class="picker-flyout-divider" Grid.Column="1" Width="1" Fill="{x:Bind SpacerFill}" />
          <PickerColumn v-if="columns.length > 1" ref="secondRef" :key="columns[1]?.key" Grid.Column="2" Items="{x:Bind SecondItems}" SelectedIndex="{x:Bind SecondIndex}" ShouldLoop="{x:Bind SecondLoop}" AutomationName="{x:Bind SecondLabel}" :style="secondStyle" SelectionChanged="OnSecondSelectionChanged" />
          <Rectangle v-if="columns.length > 2" class="picker-flyout-divider" Grid.Column="3" Width="1" Fill="{x:Bind SpacerFill}" />
          <PickerColumn v-if="columns.length > 2" ref="thirdRef" :key="columns[2]?.key" Grid.Column="4" Items="{x:Bind ThirdItems}" SelectedIndex="{x:Bind ThirdIndex}" ShouldLoop="{x:Bind ThirdLoop}" AutomationName="{x:Bind ThirdLabel}" :style="thirdStyle" SelectionChanged="OnThirdSelectionChanged" />
        </Grid>
        <Grid class="picker-accept-dismiss-grid" Grid.Row="1" Height="41">
          <Grid.ColumnDefinitions>
            <ColumnDefinition Width="*" />
            <ColumnDefinition Width="*" />
          </Grid.ColumnDefinitions>
          <Rectangle Grid.ColumnSpan="2" Height="1" VerticalAlignment="Top" Fill="{x:Bind SpacerFill}" />
          <Button class="picker-accept" Grid.Column="0" Margin="4,4,2,4" Padding="4" BorderThickness="{ThemeResource DateTimeFlyoutButtonBorderThickness}" MinWidth="0" MinHeight="0" HorizontalAlignment="Stretch" VerticalAlignment="Stretch" Style="{StaticResource SubtleButtonStyle}" AutomationProperties.Name="{x:Bind AcceptLabel}" ToolTipService.ToolTip="{x:Bind AcceptLabel}" Click="OnAccept">
            <FontIcon Glyph="&#xE8FB;" FontSize="16" />
          </Button>
          <Button class="picker-dismiss" Grid.Column="1" Margin="2,4,4,4" Padding="4" BorderThickness="{ThemeResource DateTimeFlyoutButtonBorderThickness}" MinWidth="0" MinHeight="0" HorizontalAlignment="Stretch" VerticalAlignment="Stretch" Style="{StaticResource SubtleButtonStyle}" AutomationProperties.Name="{x:Bind DismissLabel}" ToolTipService.ToolTip="{x:Bind DismissLabel}" Click="OnDismiss">
            <FontIcon Glyph="&#xE711;" FontSize="16" />
          </Button>
        </Grid>
      </Grid>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue'
import Button from './Button.vue'
import ColumnDefinition from './ColumnDefinition.vue'
import FontIcon from './FontIcon.vue'
import Grid from './Grid.vue'
import PickerColumn from './PickerColumn.vue'
import Rectangle from './Rectangle.vue'
import RowDefinition from './RowDefinition.vue'
import { useI18n } from './i18n/index'
import { resolveXamlHandler, resolveXamlValue, xamlScopeKey } from './xamlRuntime'
import { useAcrylicBrushStyle } from './AcrylicBrush'
import { vAcrylicBrush } from './acrylicBrushVisual'
import { vThemeShadow } from './themeShadowVisual'
import { xamlThemeKey } from './brushCore'

interface PickerField {
  key: string
  items: string[]
  index: number
  loop: boolean
  weight: number
  align: 'Left' | 'Center'
  label: string
}
defineOptions({ inheritAttrs: false })
const props = defineProps({
  Kind: { type: String, default: 'DatePicker' },
  Columns: { type: [Array, String], default: () => [] },
  RequestedTheme: { type: String, default: 'Default' },
  LightDismissOverlayMode: { type: String, default: 'Auto' }
})
const emit = defineEmits(['Closed', 'SelectionChanged'])
const instance = getCurrentInstance()
const { t } = useI18n()
const presenterRef = ref<HTMLElement | null>(null)
const firstRef = ref<any>(null)
const secondRef = ref<any>(null)
const thirdRef = ref<any>(null)
const visible = ref(false)
const isOpen = ref(false)
const position = ref({ left: 0, top: 0, width: 296, height: 322 })
const inheritedTheme = ref('')
const resourceOverrides = ref<Record<string, string>>({})
let anchor: HTMLElement | null = null
let animation: Animation | null = null
let fadeAnimation: Animation | null = null
let observer: MutationObserver | null = null
let resizeObserver: ResizeObserver | null = null
let revision = 0
let disposed = false
let committing = false
const value = (input: unknown) => resolveXamlValue(input, instance)
const columns = computed(() => (value(props.Columns) ?? []) as PickerField[])
const kind = computed(() => String(value(props.Kind)))
const theme = computed(() => {
  const requested = String(value(props.RequestedTheme)).toLowerCase()
  return requested === 'dark' || requested === 'light' ? requested : inheritedTheme.value
})
provide(xamlThemeKey, theme)
const themeClasses = computed(() => ({ 'win-theme-scope': true, 'theme-dark': theme.value === 'dark', 'theme-light': theme.value === 'light' }))
const overlayStyle = computed(() => ({ background: value(props.LightDismissOverlayMode) === 'On' ? `var(--${kind.value}LightDismissOverlayBackground)` : 'transparent' }))
const presenterBackgroundStyle = useAcrylicBrushStyle(() => `{ThemeResource ${kind.value}FlyoutPresenterBackground}`, instance)
const presenterStyle = computed(() => ({
  ...resourceOverrides.value,
  ...presenterBackgroundStyle.value,
  '--presenter-border': `var(--${kind.value}FlyoutPresenterBorderBrush)`,
  '--presenter-highlight': `var(--${kind.value}FlyoutPresenterHighlightFill)`,
  '--picker-selected-foreground': `var(--${kind.value}FlyoutPresenterHighlightForegroundColor)`,
  left: `${position.value.left}px`, top: `${position.value.top}px`, width: `${position.value.width}px`,
  '--picker-columns-height': `${position.value.height - 43}px`
}))
const columnStyle = computed(() => ({ gridTemplateColumns: columns.value.flatMap((field, index) => [index ? '1px' : '', `minmax(0, ${field.weight}fr)`]).filter(Boolean).join(' ') }))
const fieldStyle = (index: number) => ({ '--picker-item-justify': columns.value[index]?.align === 'Left' ? 'flex-start' : 'center', '--picker-item-padding-left': columns.value[index]?.key === 'month' ? '9px' : '0px' })
const firstStyle = computed(() => fieldStyle(0))
const secondStyle = computed(() => fieldStyle(1))
const thirdStyle = computed(() => fieldStyle(2))
const dialogLabel = computed(() => t(kind.value === 'DatePicker' ? 'datePicker.name' : 'timePicker.name'))
const raise = (name: 'Closed' | 'SelectionChanged', args: unknown) => {
  emit(name, publicApi, args)
  resolveXamlHandler(instance?.attrs[name], instance)?.(publicApi, args)
}
const changed = (index: number, _sender: unknown, args: { SelectedIndex: number }) => {
  const field = columns.value[index]
  if (field && isOpen.value && !committing) raise('SelectionChanged', { Key: field.key, SelectedIndex: args.SelectedIndex })
}
const OnFirstSelectionChanged = (sender: unknown, args: { SelectedIndex: number }) => changed(0, sender, args)
const OnSecondSelectionChanged = (sender: unknown, args: { SelectedIndex: number }) => changed(1, sender, args)
const OnThirdSelectionChanged = (sender: unknown, args: { SelectedIndex: number }) => changed(2, sender, args)
const Flush = () => {
  // Snapshot every column before calendar changes regenerate another column.
  const refs = [firstRef.value, secondRef.value, thirdRef.value]
  const indices: Record<string, number> = {}
  for (const [index, field] of columns.value.entries()) indices[field.key] = refs[index]?.GetPendingIndex() ?? field.index
  committing = true
  try { for (const selector of refs) selector?.Flush() }
  finally { committing = false }
  raise('SelectionChanged', { Indices: indices })
}
const syncTheme = () => {
  if (!anchor) return
  const scope = anchor.closest('.theme-light, .theme-dark')
  inheritedTheme.value = scope?.classList.contains('theme-dark') ? 'dark' : 'light'
  const style = getComputedStyle(anchor)
  const overrides: Record<string, string> = {}
  for (let index = 0; index < style.length; index += 1) {
    const name = style[index]!
    if (name.startsWith('--')) overrides[name] = style.getPropertyValue(name)
  }
  resourceOverrides.value = overrides
}
const reposition = () => {
  if (!anchor || !visible.value) return
  if (!anchor.isConnected) { void close(false, false); return }
  const rect = anchor.getBoundingClientRect()
  if (rect.bottom < 0 || rect.top > window.innerHeight) { void close(false, false); return }
  const width = Math.min(kind.value === 'DatePicker' ? 296 : 242, Math.max(0, window.innerWidth - 16))
  const height = Math.min(398, Math.max(83, window.innerHeight - 16))
  // The selected row is aligned with the flyout button, excluding the header.
  const selectedCenter = 1 + (height - 43) / 2
  position.value = {
    width, height,
    left: Math.max(8, Math.min(rect.left + (rect.width - width) / 2, window.innerWidth - width - 8)),
    top: Math.max(8, Math.min(rect.top + rect.height / 2 - selectedCenter, window.innerHeight - height - 8))
  }
}
const stopAnimation = () => { animation?.cancel(); fadeAnimation?.cancel(); animation = null; fadeAnimation = null }
const disconnect = () => {
  observer?.disconnect(); observer = null
  resizeObserver?.disconnect(); resizeObserver = null
  window.removeEventListener('resize', reposition)
  window.removeEventListener('scroll', reposition, true)
  window.removeEventListener('blur', OnWindowBlur)
  window.visualViewport?.removeEventListener('resize', reposition)
  window.visualViewport?.removeEventListener('scroll', reposition)
}
const close = async (accepted: boolean, restoreFocus = true) => {
  if (!isOpen.value) return
  if (accepted) Flush()
  isOpen.value = false
  const token = ++revision
  disconnect()
  stopAnimation()
  raise('Closed', { Accepted: accepted })
  const presenter = presenterRef.value
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (presenter?.animate && !reducedMotion) {
    const height = position.value.height
    animation = presenter.animate([{ clipPath: 'inset(0)' }, { clipPath: `inset(${height * .425}px 0)` }], { duration: 167, easing: 'cubic-bezier(0,0,0,1)', fill: 'forwards' })
    fadeAnimation = presenter.animate([{ opacity: 1 }, { opacity: 0 }], { delay: 84, duration: 83, easing: 'linear', fill: 'forwards' })
    await animation.finished.catch(() => {})
  }
  if (disposed || token !== revision) return
  stopAnimation()
  visible.value = false
  if (restoreFocus && anchor?.isConnected && !anchor.hasAttribute('disabled')) anchor.focus({ preventScroll: true })
}
const Hide = () => close(false)
const OnAccept = () => close(true)
const OnDismiss = () => close(false)
const OnLightDismiss = () => close(false)
const OnWindowBlur = () => close(false, false)
const OnKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' || event.key === 'Enter') {
    event.preventDefault(); event.stopPropagation(); void close(event.key === 'Enter'); return
  }
  const refs = [firstRef.value, secondRef.value, thirdRef.value].filter(Boolean)
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    const current = refs.findIndex(column => column.ContainsFocus?.())
    if (current >= 0) {
      event.preventDefault()
      const direction = (event.key === 'ArrowRight' ? 1 : -1) * (getComputedStyle(presenterRef.value!).direction === 'rtl' ? -1 : 1)
      refs[Math.max(0, Math.min(refs.length - 1, current + direction))]?.Focus()
    }
  }
  if (event.key === 'Tab') {
    const focusable = Array.from(presenterRef.value!.querySelectorAll<HTMLElement>('[tabindex="0"],button:not([disabled])')).filter(element => element.getClientRects().length && element.tabIndex >= 0)
    const first = focusable[0]; const last = focusable.at(-1)
    if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault(); (event.shiftKey ? last : first)?.focus({ preventScroll: true })
    }
  }
}
const ShowAt = async (target: HTMLElement) => {
  if (disposed || isOpen.value) return
  const token = ++revision
  anchor = target
  visible.value = true
  isOpen.value = true
  syncTheme()
  reposition()
  await nextTick()
  if (disposed || token !== revision || !isOpen.value) return
  const presenter = presenterRef.value!
  stopAnimation()
  if (presenter.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const height = position.value.height
    animation = presenter.animate([
      { clipPath: `inset(${height * .25}px 0)` },
      { clipPath: 'inset(-16px)' }
    ], { duration: 250, easing: 'cubic-bezier(0,0,0,1)' })
    const current = animation
    void current.finished.catch(() => {}).then(() => { if (animation === current) animation = null })
  }
  if (firstRef.value) firstRef.value.Focus()
  else presenter.querySelector<HTMLButtonElement>('.picker-accept')?.focus({ preventScroll: true })
  observer = new MutationObserver(syncTheme)
  for (let element: HTMLElement | null = target; element; element = element.parentElement) observer.observe(element, { attributes: true, attributeFilter: ['class', 'style'] })
  resizeObserver = new ResizeObserver(reposition)
  resizeObserver.observe(target)
  window.addEventListener('resize', reposition)
  window.addEventListener('scroll', reposition, true)
  window.addEventListener('blur', OnWindowBlur)
  window.visualViewport?.addEventListener('resize', reposition)
  window.visualViewport?.addEventListener('scroll', reposition)
}
const scope: Record<string, unknown> = { OnAccept, OnDismiss, OnFirstSelectionChanged, OnSecondSelectionChanged, OnThirdSelectionChanged, SpacerFill: computed(() => `var(--${kind.value}FlyoutPresenterSpacerFill)`), AcceptLabel: t('text.accept'), DismissLabel: t('text.cancel') }
for (const [prefix, index] of [['First', 0], ['Second', 1], ['Third', 2]] as const) {
  for (const [suffix, key, fallback] of [['Items', 'items', []], ['Index', 'index', 0], ['Loop', 'loop', true], ['Label', 'label', '']] as const) {
    scope[prefix + suffix] = computed(() => columns.value[index]?.[key] ?? fallback)
  }
}
provide(xamlScopeKey, scope)
watch(() => value(props.RequestedTheme), () => { if (isOpen.value) syncTheme() })
onBeforeUnmount(() => { disposed = true; revision += 1; disconnect(); stopAnimation() })
const publicApi = { ShowAt, Hide, Flush, IsOpen: isOpen }
defineExpose(publicApi)
</script>

<style scoped>
.date-time-picker-overlay { position: fixed; inset: 0; z-index: 10000; }
.date-time-picker-presenter { position: fixed; z-index: 10001; box-sizing: border-box; max-height: 398px; border: 1px solid var(--presenter-border); border-radius: var(--ControlCornerRadius, 4px); overflow: visible; color: var(--TextFillColorPrimaryBrush); }
.picker-content-panel { grid-template-rows: minmax(0, 1fr) 41px !important; overflow: hidden; border-radius: inherit; }
.picker-host-grid { height: var(--picker-columns-height); overflow: hidden; position: relative; }
.picker-highlight { position: absolute; grid-column: 1 / -1 !important; left: 4px; right: 4px; top: calc(50% - 20px); height: 40px; border-radius: var(--ControlCornerRadius, 4px); background: var(--presenter-highlight); pointer-events: none; }
.picker-flyout-divider { height: 100%; z-index: 2; mask-image: linear-gradient(to bottom, black calc(50% - 20px), transparent calc(50% - 20px), transparent calc(50% + 20px), black calc(50% + 20px)); }
.picker-accept-dismiss-grid { min-width: 0; }
.date-time-picker-presenter :deep(.picker-accept), .date-time-picker-presenter :deep(.picker-dismiss) {
  --ButtonForegroundPointerOver: var(--DateTimePickerFlyoutButtonForegroundPointerOver);
  --ButtonForegroundPressed: var(--DateTimePickerFlyoutButtonForegroundPressed);
  --ButtonBorderBrush: var(--DateTimePickerFlyoutButtonBorderBrush);
  --ButtonBorderBrushPointerOver: var(--DateTimePickerFlyoutButtonBorderBrushPointerOver);
  --ButtonBorderBrushPressed: var(--DateTimePickerFlyoutButtonBorderBrushPressed);
  border-radius: var(--ControlCornerRadius, 4px);
}
</style>
