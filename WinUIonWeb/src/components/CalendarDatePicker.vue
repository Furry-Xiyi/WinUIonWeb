<template>
  <div ref="rootRef" class="win-calendar-date-picker" v-bind="rootAttrs" :class="[rootClasses, attrs.class]" :style="rootStyle">
    <Grid class="calendar-picker-root">
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto" />
        <RowDefinition Height="*" />
        <RowDefinition Height="Auto" />
      </Grid.RowDefinitions>
      <Grid.ColumnDefinitions>
        <ColumnDefinition Width="Auto" />
        <ColumnDefinition Width="*" />
        <ColumnDefinition Width="32" MaxWidth="32" />
      </Grid.ColumnDefinitions>
      <ContentPresenter v-if="hasHeader" class="picker-header" Grid.Row="0" Grid.Column="1" Grid.ColumnSpan="2">
        <HeaderContent />
      </ContentPresenter>
      <Border class="picker-background" Grid.Row="1" Grid.Column="1" Grid.ColumnSpan="2" MinHeight="32" />
      <TextBlock class="picker-date-text" Grid.Row="1" Grid.Column="1" Text="{x:Bind PickerText}" Padding="12,0,0,2" VerticalAlignment="Center" />
      <FontIcon class="picker-calendar-glyph" Grid.Row="1" Grid.Column="2" Glyph="&#xE787;" FontSize="12" />
      <button ref="buttonRef" class="picker-hit-target" type="button" Grid.Row="1" Grid.Column="1" Grid.ColumnSpan="2" />
      <ContentPresenter v-if="hasDescription" class="picker-description" Grid.Row="2" Grid.Column="1" Grid.ColumnSpan="2">
        <DescriptionContent />
      </ContentPresenter>
      <Flyout Placement="Bottom" ShouldConstrainToRootBounds="False">
        <CalendarView
          ref="calendarRef"
          Style="{x:Bind PickerCalendarViewStyle}"
          CalendarIdentifier="{x:Bind PickerCalendarIdentifier}"
          DayOfWeekFormat="{x:Bind PickerDayOfWeekFormat}"
          DisplayMode="{x:Bind PickerDisplayMode}"
          FirstDayOfWeek="{x:Bind PickerFirstDayOfWeek}"
          IsEnabled="{x:Bind PickerEnabled}"
          IsGroupLabelVisible="{x:Bind PickerGroupLabelVisible}"
          IsOutOfScopeEnabled="{x:Bind PickerOutOfScopeEnabled}"
          IsTodayHighlighted="{x:Bind PickerTodayHighlighted}"
          MinDate="{x:Bind PickerMinDate}"
          MaxDate="{x:Bind PickerMaxDate}"
          SelectedDates="{x:Bind PickerSelectedDates}"
          Language="{x:Bind PickerLanguage}"
          SelectionMode="Single"
          CornerRadius="{ThemeResource OverlayCornerRadius}"
          SelectedDatesChanged="OnSelectedDatesChanged"
          CalendarViewDayItemChanging="OnCalendarViewDayItemChanging" />
      </Flyout>
    </Grid>
  </div>
</template>

<script lang="ts">
import { defineComponent, Fragment, h } from 'vue'
const property = (name: string) => defineComponent({
  name: `CalendarDatePicker.${name}`,
  __calendarPickerProperty: name,
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})
export default { Header: property('Header'), HeaderTemplate: property('HeaderTemplate'), Description: property('Description') }
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, ref, Teleport, unref, useAttrs, useSlots, watch, withDirectives, type VNode } from 'vue'
import Border from './Border.vue'
import CalendarView from './CalendarView.vue'
import ColumnDefinition from './ColumnDefinition.vue'
import ContentPresenter from './ContentPresenter.vue'
import FontIcon from './FontIcon.vue'
import Grid from './Grid.vue'
import RowDefinition from './RowDefinition.vue'
import TextBlock from './TextBlock.vue'
import { useI18n } from './i18n/index'
import { calendarDateSerial, createCalendarModel } from './calendarEngine'
import { getVNodeChildren } from './CollectionProperties'
import { xamlResourceDictionaryKey } from './Page.vue'
import { alignment, cssLength, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey, xamlTemplateComponent } from './xamlRuntime'
import { vThemeShadow } from './themeShadowVisual'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  CalendarIdentifier: { type: String, default: 'GregorianCalendar' },
  CalendarViewStyle: { type: [String, Object], default: null },
  Date: { type: [globalThis.Date, String], default: undefined },
  DateFormat: { type: String, default: 'shortdate' },
  DayOfWeekFormat: { type: String, default: '{dayofweek.abbreviated(2)}' },
  Description: { type: null, default: '' },
  DisplayMode: { type: String, default: 'Month' },
  FirstDayOfWeek: { type: String, default: 'Sunday' },
  Header: { type: null, default: '' },
  HeaderPlacement: { type: String, default: 'Top' },
  HeaderTemplate: { type: null, default: null },
  IsEnabled: { type: [Boolean, String], default: true },
  IsCalendarOpen: { type: [Boolean, String], default: undefined },
  IsGroupLabelVisible: { type: [Boolean, String], default: false },
  IsOutOfScopeEnabled: { type: [Boolean, String], default: true },
  IsTodayHighlighted: { type: [Boolean, String], default: true },
  LightDismissOverlayMode: { type: String, default: 'Auto' },
  MaxDate: { type: [globalThis.Date, String], default: () => new globalThis.Date(new globalThis.Date().getFullYear() + 100, 11, 31) },
  MinDate: { type: [globalThis.Date, String], default: () => new globalThis.Date(new globalThis.Date().getFullYear() - 100, 0, 1) },
  PlaceholderText: { type: String, default: '' },
  Language: { type: String, default: '' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }, Visibility: { type: String, default: 'Visible' },
  HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Center' },
  Background: { type: String, default: '{ThemeResource CalendarDatePickerBackground}' },
  Foreground: { type: String, default: '{ThemeResource CalendarDatePickerTextForeground}' },
  BorderBrush: { type: String, default: '{ThemeResource CalendarDatePickerBorderBrush}' },
  BorderThickness: { type: [String, Number], default: 1 },
  CornerRadius: { type: [String, Number], default: '{ThemeResource ControlCornerRadius}' },
  RequestedTheme: { type: String, default: 'Default' }
})
const emit = defineEmits(['update:Date', 'update:IsCalendarOpen', 'DateChanged', 'Opened', 'Closed', 'CalendarViewDayItemChanging'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const { t, locale } = useI18n()
const inheritedTheme = inject('winuiTheme', null)
const resources = inject<Record<string, VNode> | null>(xamlResourceDictionaryKey, null)
const rootRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLButtonElement | null>(null)
const flyoutRef = ref<HTMLElement | null>(null)
const calendarRef = ref<any>(null)
const value = (input: unknown) => resolveXamlValue(input, instance)
const enabled = computed(() => value(props.IsEnabled) !== false)
const localDate = ref<globalThis.Date | null>(null)
const open = ref(false)
const visible = ref(false)
const positioned = ref(false)
const closing = ref(false)
const flyoutPosition = ref({ top: 0, left: 0, up: false })
const inheritedThemeName = ref('')
const requestedDisplayDate = ref<globalThis.Date | null>(null)
let displayDimensions: [number, number] | null = null
let animation: Animation | null = null
let transitionVersion = 0
let disposed = false
let resizeObserver: ResizeObserver | null = null
let themeObserver: MutationObserver | null = null
const asDate = (input: unknown): globalThis.Date | null => {
  if (input === null || input === undefined || input === '') return null
  const date = input instanceof globalThis.Date ? input : new globalThis.Date(String(input))
  return Number.isFinite(date.getTime()) ? new globalThis.Date(date) : null
}
const minDate = computed(() => asDate(value(props.MinDate)) ?? new globalThis.Date(new globalThis.Date().getFullYear() - 100, 0, 1))
const maxDate = computed(() => asDate(value(props.MaxDate)) ?? new globalThis.Date(new globalThis.Date().getFullYear() + 100, 11, 31))
const coerceDate = (input: unknown) => {
  const date = asDate(input)
  if (!date) return null
  return new globalThis.Date(Math.min(maxDate.value.getTime(), Math.max(minDate.value.getTime(), date.getTime())))
}
const sameDate = (left: globalThis.Date | null, right: globalThis.Date | null) => left?.getTime() === right?.getTime()
const language = computed(() => String(value(props.Language) || locale))
const dateText = computed(() => {
  if (!localDate.value) return String(value(props.PlaceholderText) || t('calendarDatePicker.placeholder'))
  const format = String(value(props.DateFormat))
  const options: Intl.DateTimeFormatOptions = format === 'longdate' ? { dateStyle: 'long' } : { year: 'numeric', month: 'numeric', day: 'numeric' }
  if (format !== 'shortdate' && format !== 'longdate') {
    delete options.dateStyle
    if (/year/.test(format)) options.year = 'numeric'
    if (/month/.test(format)) options.month = /month\.full/.test(format) ? 'long' : /month\.abbreviated/.test(format) ? 'short' : 'numeric'
    if (/dayofweek/.test(format)) options.weekday = /dayofweek\.full/.test(format) ? 'long' : 'short'
    if (/\bday\b/.test(format)) options.day = 'numeric'
  }
  try {
    const serial = calendarDateSerial(localDate.value)
    return createCalendarModel(String(value(props.CalendarIdentifier)), language.value, serial, serial).formatSelectedDate(serial, options)
  }
  catch { return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(localDate.value) }
})
const propertyNodes = (name: string): VNode[] => {
  const collect = (nodes: VNode[]): VNode[] => nodes.flatMap(node => {
    if (node.type === Fragment && Array.isArray(node.children)) return collect(node.children as VNode[])
    const kind = (node.type as { __calendarPickerProperty?: string })?.__calendarPickerProperty
    if (kind !== name) return []
    return Array.isArray(node.children) ? node.children as VNode[] : (node.children as { default?: () => VNode[] })?.default?.() ?? []
  })
  return collect(slots.default?.() ?? [])
}
const header = computed(() => value(props.Header))
const description = computed(() => value(props.Description))
const hasHeader = computed(() => Boolean(header.value || props.HeaderTemplate || propertyNodes('Header').length || propertyNodes('HeaderTemplate').length))
const hasDescription = computed(() => Boolean(description.value || propertyNodes('Description').length))
const HeaderContent = defineComponent({ setup() { return () => {
  const template = propertyNodes('HeaderTemplate')
  const content = propertyNodes('Header')
  const explicitTemplate = value(props.HeaderTemplate)
  if (template.length) return xamlTemplateComponent(template, header.value, instance)
  const resourceKey = typeof props.HeaderTemplate === 'string' ? props.HeaderTemplate.match(/^\{StaticResource\s+([^\s}]+)\}$/)?.[1] : null
  if (resourceKey && resources?.[resourceKey]) return xamlTemplateComponent(getVNodeChildren(resources[resourceKey]), header.value, instance)
  if (isVNode(explicitTemplate)) return xamlTemplateComponent([explicitTemplate], header.value, instance)
  if (content.length) return h(Fragment, normalizeXamlNodes(content, instance))
  return isVNode(header.value) ? header.value : String(header.value ?? '')
} } })
const DescriptionContent = defineComponent({ setup() { return () => {
  const nodes = propertyNodes('Description')
  return nodes.length ? h(Fragment, normalizeXamlNodes(nodes, instance)) : isVNode(description.value) ? description.value : String(description.value ?? '')
} } })
const theme = computed(() => {
  const requested = String(value(props.RequestedTheme)).toLowerCase()
  const inherited = String(unref(inheritedTheme) || inheritedThemeName.value).toLowerCase()
  return requested === 'dark' || requested === 'light' ? requested : inherited
})
const rootClasses = computed(() => ({ 'is-disabled': !enabled.value, 'has-date': !!localDate.value, 'header-left': value(props.HeaderPlacement) === 'Left', 'theme-light': theme.value === 'light', 'theme-dark': theme.value === 'dark', 'win-theme-scope': theme.value === 'light' || theme.value === 'dark' }))
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !['DateChanged', 'Opened', 'Closed', 'CalendarViewDayItemChanging', 'class', 'style'].includes(key))))
const rootStyle = computed(() => {
  const style: Record<string, any> = {
    '--picker-background': value(props.Background), '--picker-foreground': value(props.Foreground),
    '--picker-border': value(props.BorderBrush), '--picker-border-thickness': xamlThickness(value(props.BorderThickness)),
    '--picker-corner-radius': cssLength(value(props.CornerRadius)),
    margin: xamlThickness(value(props.Margin)), justifySelf: alignment(value(props.HorizontalAlignment), 'horizontal'), alignSelf: alignment(value(props.VerticalAlignment), 'vertical')
  }
  for (const key of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) {
    const length = cssLength(value(props[key]))
    if (length) style[key[0].toLowerCase() + key.slice(1)] = length
  }
  if (value(props.Visibility) === 'Collapsed') style.display = 'none'
  if (value(props.Visibility) === 'Hidden') style.visibility = 'hidden'
  return [attrs.style, style]
})
const raise = (name: string, args: unknown = {}) => {
  emit(name as any, publicApi, args)
  resolveXamlHandler(attrs[name], instance)?.(publicApi, args)
}
const setDate = (input: unknown) => {
  const date = coerceDate(input)
  if (sameDate(localDate.value, date)) return
  const oldDate = localDate.value
  localDate.value = date
  updateXamlBinding(props.Date, date, instance)
  emit('update:Date', date)
  raise('DateChanged', { OldDate: oldDate, NewDate: date })
}
const syncOpen = (next: boolean) => {
  open.value = next
  updateXamlBinding(props.IsCalendarOpen, next, instance)
  emit('update:IsCalendarOpen', next)
}
const cancelAnimation = () => { animation?.cancel(); animation = null }
const updatePosition = () => {
  if (!visible.value || !rootRef.value || !flyoutRef.value) return
  const anchor = rootRef.value.getBoundingClientRect()
  const width = flyoutRef.value.offsetWidth
  const height = flyoutRef.value.offsetHeight
  const viewport = window.visualViewport
  const leftEdge = (viewport?.offsetLeft ?? 0) + 4
  const topEdge = (viewport?.offsetTop ?? 0) + 4
  const rightEdge = leftEdge + (viewport?.width ?? window.innerWidth) - 8
  const bottomEdge = topEdge + (viewport?.height ?? window.innerHeight) - 8
  const up = anchor.bottom + 4 + height > bottomEdge && anchor.top - topEdge > bottomEdge - anchor.bottom
  flyoutPosition.value = {
    left: Math.max(leftEdge, Math.min(rightEdge - width, anchor.left + (anchor.width - width) / 2)),
    top: Math.max(topEdge, Math.min(bottomEdge - height, up ? anchor.top - 4 - height : anchor.bottom + 4)), up
  }
  positioned.value = true
}
const closeCalendar = async (restoreFocus = true) => {
  if (!open.value || closing.value) return
  const version = ++transitionVersion
  syncOpen(false)
  closing.value = true
  cancelAnimation()
  const surface = flyoutRef.value
  if (surface && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof surface.animate === 'function') {
    animation = surface.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100, fill: 'forwards' })
    try { await animation.finished } catch { /* Reopening cancels the pending close. */ }
  }
  if (disposed || version !== transitionVersion) return
  cancelAnimation()
  visible.value = false
  closing.value = false
  positioned.value = false
  await nextTick()
  if (disposed || version !== transitionVersion) return
  raise('Closed')
  if (restoreFocus && enabled.value) buttonRef.value?.focus({ preventScroll: true })
}
const showCalendar = async () => {
  if (!enabled.value || (open.value && !closing.value)) return
  window.dispatchEvent(new Event('winui-flyout-hide'))
  const version = ++transitionVersion
  cancelAnimation()
  closing.value = false
  positioned.value = false
  syncOpen(true)
  visible.value = true
  await nextTick()
  if (disposed || version !== transitionVersion || !open.value) return
  if (displayDimensions) calendarRef.value?.SetYearDecadeDisplayDimensions(...displayDimensions)
  calendarRef.value?.SetDisplayDate(requestedDisplayDate.value ?? localDate.value ?? new globalThis.Date())
  await nextTick()
  if (disposed || version !== transitionVersion || !open.value) return
  updatePosition()
  const surface = flyoutRef.value
  if (surface && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof surface.animate === 'function') {
    const direction = flyoutPosition.value.up ? 50 : -50
    animation = surface.animate([{ opacity: 0, transform: `translateY(${direction}px)` }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'cubic-bezier(0.1,0.9,0.2,1)' })
    animation.finished.then(() => { if (version === transitionVersion) animation = null }).catch(() => {})
  }
  raise('Opened')
  calendarRef.value?.FocusDate?.(requestedDisplayDate.value ?? localDate.value ?? new globalThis.Date())
}
const onSelectedDatesChanged = (sender: { SelectionMode?: string }, args: { AddedDates: globalThis.Date[]; RemovedDates: globalThis.Date[] }) => {
  if (sender.SelectionMode && sender.SelectionMode !== 'Single') return
  if (args.AddedDates.length) {
    // Date synchronization and a newly mounted CalendarView raise the same
    // event as a click. Only a new user choice closes the picker.
    if (sameDate(localDate.value, asDate(args.AddedDates[0]))) return
    void closeCalendar()
    setDate(args.AddedDates[0])
  } else if (args.RemovedDates.some(date => sameDate(localDate.value, asDate(date)))) setDate(null)
}
const onDayItemChanging = (_sender: unknown, args: unknown) => raise('CalendarViewDayItemChanging', args)
provide(xamlScopeKey, {
  PickerText: dateText, PickerEnabled: enabled, PickerLanguage: language, PickerCalendarViewStyle: computed(() => value(props.CalendarViewStyle)), PickerSelectedDates: computed(() => localDate.value ? [localDate.value] : []),
  PickerCalendarIdentifier: computed(() => value(props.CalendarIdentifier)), PickerDayOfWeekFormat: computed(() => value(props.DayOfWeekFormat)),
  PickerDisplayMode: computed(() => value(props.DisplayMode)), PickerFirstDayOfWeek: computed(() => value(props.FirstDayOfWeek)),
  PickerGroupLabelVisible: computed(() => value(props.IsGroupLabelVisible)), PickerOutOfScopeEnabled: computed(() => value(props.IsOutOfScopeEnabled)),
  PickerTodayHighlighted: computed(() => value(props.IsTodayHighlighted)), PickerMinDate: minDate, PickerMaxDate: maxDate,
  OnSelectedDatesChanged: onSelectedDatesChanged, OnCalendarViewDayItemChanging: onDayItemChanging
})
// The official template uses a bare flyout ContentPresenter without padding,
// an additional border, or an additional scrolling container.
const Flyout = defineComponent({
  name: 'CalendarDatePicker.Flyout', inheritAttrs: false,
  props: { Placement: String, ShouldConstrainToRootBounds: String },
  setup(_, { slots: flyoutSlots }) {
    const flyoutInstance = getCurrentInstance()
    return () => visible.value ? h(Teleport, { to: 'body' }, [
      h('div', { class: ['calendar-picker-dismiss-layer', { 'overlay-on': value(props.LightDismissOverlayMode) === 'On' }], onPointerdown: () => { void closeCalendar() } }),
      withDirectives(h('div', {
        ref: flyoutRef, role: 'dialog', 'aria-modal': 'true', 'aria-label': String(header.value || t('calendarDatePicker.calendar')),
        class: ['calendar-picker-flyout', 'win-theme-scope', theme.value ? `theme-${theme.value}` : '', { 'is-closing': closing.value }],
        style: { top: `${flyoutPosition.value.top}px`, left: `${flyoutPosition.value.left}px`, visibility: positioned.value ? 'visible' : 'hidden' },
        onKeydown: onFlyoutKeyDown
      }, normalizeXamlNodes(flyoutSlots.default?.() ?? [], flyoutInstance)), [[vThemeShadow, { Translation: 32 }]])
    ]) : null
  }
})
const onFlyoutKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); void closeCalendar() }
  if (event.key !== 'Tab') return
  const focusable = Array.from(flyoutRef.value?.querySelectorAll<HTMLElement>('button:not(:disabled):not([tabindex="-1"]),[tabindex="0"]') ?? []).filter(node => node.getClientRects().length)
  if (!focusable.length) return
  const current = focusable.indexOf(document.activeElement as HTMLElement)
  const next = (current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length
  event.preventDefault()
  focusable[next]?.focus({ preventScroll: true })
}
const onButtonClick = () => { if (open.value) void closeCalendar(); else void showCalendar() }
const onWindowBlur = () => { void closeCalendar(false) }
const onGlobalDismiss = () => { void closeCalendar(false) }
const onButtonKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && open.value) { event.preventDefault(); void closeCalendar() }
  if (event.key === 'ArrowDown' && event.altKey) { event.preventDefault(); void showCalendar() }
}
const syncButton = () => {
  if (!buttonRef.value) return
  buttonRef.value.disabled = !enabled.value
  buttonRef.value.setAttribute('aria-haspopup', 'dialog')
  buttonRef.value.setAttribute('aria-expanded', String(open.value))
  buttonRef.value.setAttribute('aria-label', [String(header.value ?? ''), dateText.value].filter(Boolean).join(': '))
}
const updateInheritedTheme = () => {
  const scope = rootRef.value?.parentElement?.closest('.theme-light,.theme-dark,[data-theme]')
  inheritedThemeName.value = scope?.getAttribute('data-theme') || (scope?.classList.contains('theme-dark') ? 'dark' : scope?.classList.contains('theme-light') ? 'light' : document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light')
}
watch(() => value(props.Date), next => setDate(next))
watch([minDate, maxDate], () => setDate(localDate.value))
watch(() => value(props.IsCalendarOpen), next => {
  if (next === undefined) return
  if (next === true) void showCalendar(); else void closeCalendar()
})
watch(enabled, next => { if (!next) void closeCalendar(false) })
watch([enabled, open, dateText, header], syncButton, { flush: 'post' })
const publicApi = {
  get Date() { return localDate.value }, set Date(next: globalThis.Date | null) { setDate(next) },
  get IsCalendarOpen() { return open.value }, set IsCalendarOpen(next: boolean) { if (next) void showCalendar(); else void closeCalendar() },
  SetDisplayDate(input: globalThis.Date | string) { requestedDisplayDate.value = coerceDate(input); if (requestedDisplayDate.value) calendarRef.value?.SetDisplayDate(requestedDisplayDate.value) },
  SetYearDecadeDisplayDimensions(columns: number, rows: number) { displayDimensions = [columns, rows]; calendarRef.value?.SetYearDecadeDisplayDimensions(columns, rows) },
  Focus: () => { buttonRef.value?.focus({ preventScroll: true }); return enabled.value }
}
defineExpose(publicApi)
onMounted(() => {
  localDate.value = coerceDate(value(props.Date))
  if (!sameDate(asDate(value(props.Date)), localDate.value)) { updateXamlBinding(props.Date, localDate.value, instance); emit('update:Date', localDate.value) }
  syncButton()
  updateInheritedTheme()
  buttonRef.value?.addEventListener('click', onButtonClick)
  buttonRef.value?.addEventListener('keydown', onButtonKeyDown)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('blur', onWindowBlur)
  window.addEventListener('winui-flyout-hide', onGlobalDismiss)
  window.addEventListener('scroll', updatePosition, true)
  window.visualViewport?.addEventListener('resize', updatePosition)
  window.visualViewport?.addEventListener('scroll', updatePosition)
  resizeObserver = new ResizeObserver(updatePosition)
  if (rootRef.value) resizeObserver.observe(rootRef.value)
  themeObserver = new MutationObserver(updateInheritedTheme)
  for (let cursor = rootRef.value?.parentElement; cursor; cursor = cursor.parentElement) themeObserver.observe(cursor, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  if (value(props.IsCalendarOpen) === true) void showCalendar()
})
onBeforeUnmount(() => {
  disposed = true
  transitionVersion++
  cancelAnimation()
  resizeObserver?.disconnect()
  themeObserver?.disconnect()
  buttonRef.value?.removeEventListener('click', onButtonClick)
  buttonRef.value?.removeEventListener('keydown', onButtonKeyDown)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('blur', onWindowBlur)
  window.removeEventListener('winui-flyout-hide', onGlobalDismiss)
  window.removeEventListener('scroll', updatePosition, true)
  window.visualViewport?.removeEventListener('resize', updatePosition)
  window.visualViewport?.removeEventListener('scroll', updatePosition)
})
</script>

<style scoped>
.win-calendar-date-picker.win-calendar-date-picker { display: inline-grid; flex: 0 0 auto; width: max-content; position: relative; box-sizing: border-box; max-width: 100%; min-width: 0; font-size: 14px; line-height: 20px; }
.calendar-picker-root { min-width: 0; grid-template-columns: auto minmax(0,1fr) 32px; }
.picker-header { min-width: 0; margin-bottom: 8px; color: var(--CalendarDatePickerHeaderForeground); overflow-wrap: anywhere; }
.header-left .picker-header { grid-row: 2 !important; grid-column: 1 !important; max-width: var(--CalendarDatePickerLeftHeaderMaxWidth, 296px); margin: 5px 32px 0 0; align-self: start; }
.picker-background { border: var(--picker-border-thickness) solid transparent; border-radius: var(--picker-corner-radius); background: var(--picker-background); position: relative; min-width: 0; }
.picker-background::after { content: ''; position: absolute; inset: calc(-1 * var(--picker-border-thickness)); border: var(--picker-border-thickness) solid transparent; border-radius: inherit; background: var(--picker-border) border-box; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude; pointer-events: none; }
.picker-date-text { color: var(--picker-foreground); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; pointer-events: none; min-width: 0; }
.picker-calendar-glyph { color: var(--CalendarDatePickerCalendarGlyphForeground); pointer-events: none; justify-self: center; align-self: center; }
.picker-hit-target { align-self: stretch; width: 100%; min-width: 0; min-height: 32px; padding: 0; border: 0; background: transparent; border-radius: var(--picker-corner-radius); cursor: default; z-index: 1; outline: none; }
.picker-description { margin-top: 0; color: var(--text-secondary); min-width: 0; overflow-wrap: anywhere; }
.calendar-picker-root:has(.picker-hit-target:hover:not(:disabled)) .picker-background { background: var(--CalendarDatePickerBackgroundPointerOver); }
.calendar-picker-root:has(.picker-hit-target:active:not(:disabled)) .picker-background { background: var(--CalendarDatePickerBackgroundPressed); --picker-border: var(--CalendarDatePickerBorderBrushPressed); }
.calendar-picker-root:has(.picker-hit-target:active:not(:disabled)) .picker-date-text { color: var(--CalendarDatePickerTextForegroundPressed); }
.picker-hit-target:focus-visible { outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary)); outline-offset: 3px; }
.is-disabled .picker-background { background: var(--CalendarDatePickerBackgroundDisabled); --picker-border: var(--CalendarDatePickerBorderBrushDisabled); }
.is-disabled .picker-header { color: var(--CalendarDatePickerHeaderForegroundDisabled); }
.is-disabled .picker-date-text { color: var(--CalendarDatePickerTextForegroundDisabled); }
.is-disabled .picker-calendar-glyph { color: var(--CalendarDatePickerCalendarGlyphForegroundDisabled); }
</style>

<style>
.calendar-picker-dismiss-layer { position: fixed; inset: 0; z-index: 10000; background: transparent; }
.calendar-picker-dismiss-layer.overlay-on { background: var(--CalendarDatePickerLightDismissOverlayBackground, rgba(0,0,0,.2)); }
.calendar-picker-flyout { position: fixed; z-index: 10001; padding: 0; border: 0; border-radius: var(--OverlayCornerRadius, 8px); max-width: calc(100vw - 8px); overflow: visible; }
.calendar-picker-flyout :deep(.win-calendar-view) { overflow: hidden; border-radius: inherit; }
.calendar-picker-flyout.is-closing { pointer-events: none; }
</style>
