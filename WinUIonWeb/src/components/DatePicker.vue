<template>
  <div ref="rootRef" v-bind="rootAttrs" class="win-date-picker" :class="[rootClasses, attrs.class]" :style="rootStyle">
    <Grid class="picker-layout-root">
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto" />
        <RowDefinition Height="*" />
      </Grid.RowDefinitions>
      <ContentPresenter v-if="hasHeader" class="picker-header" Grid.Row="0"><HeaderContent /></ContentPresenter>
      <Button ref="buttonRef" class="picker-button" Grid.Row="1" Style="{StaticResource DatePickerFlyoutButtonStyle}" Padding="0" MinHeight="{ThemeResource TextControlThemeMinHeight}" MinWidth="0" BorderThickness="{x:Bind PickerBorderThickness}" CornerRadius="{x:Bind PickerCornerRadius}" HorizontalAlignment="Stretch" VerticalAlignment="Top" HorizontalContentAlignment="Stretch" VerticalContentAlignment="Stretch" IsEnabled="{x:Bind PickerEnabled}" AutomationProperties.Name="{x:Bind PickerAutomationName}" Click="OnFlyoutButtonClick">
        <Grid class="picker-button-content" :style="columnStyle">
          <Grid.ColumnDefinitions>
            <ColumnDefinition Width="78*" />
            <ColumnDefinition Width="Auto" />
            <ColumnDefinition Width="132*" />
            <ColumnDefinition Width="Auto" />
            <ColumnDefinition Width="78*" />
          </Grid.ColumnDefinitions>
          <TextBlock v-if="fields.length" class="picker-host-text" Grid.Column="0" Text="{x:Bind FirstText}" :style="firstStyle" TextTrimming="CharacterEllipsis" />
          <Rectangle v-if="fields.length > 1" class="picker-host-divider" Grid.Column="1" Width="1" Fill="{ThemeResource DatePickerSpacerFill}" />
          <TextBlock v-if="fields.length > 1" class="picker-host-text" Grid.Column="2" Text="{x:Bind SecondText}" :style="secondStyle" TextTrimming="CharacterEllipsis" />
          <Rectangle v-if="fields.length > 2" class="picker-host-divider" Grid.Column="3" Width="1" Fill="{ThemeResource DatePickerSpacerFill}" />
          <TextBlock v-if="fields.length > 2" class="picker-host-text" Grid.Column="4" Text="{x:Bind ThirdText}" :style="thirdStyle" TextTrimming="CharacterEllipsis" />
        </Grid>
      </Button>
    </Grid>
    <DateTimePickerFlyout ref="flyoutRef" Kind="DatePicker" Columns="{x:Bind PickerColumns}" RequestedTheme="{x:Bind PickerTheme}" LightDismissOverlayMode="{x:Bind PickerOverlayMode}" SelectionChanged="OnFlyoutSelectionChanged" Closed="OnFlyoutClosed" />
  </div>
</template>

<script lang="ts">
import { defineComponent, Fragment, h } from 'vue'
const property = (name: string) => defineComponent({ name: `DatePicker.${name}`, __datePickerProperty: name, setup(_, { slots }) { return () => h(Fragment, slots.default?.()) } })
export default { Header: property('Header'), HeaderTemplate: property('HeaderTemplate') }

</script>

<script setup lang="ts">

import { computed, getCurrentInstance, inject, isVNode, nextTick, onBeforeUnmount, provide, ref, unref, useAttrs, useSlots, watch, type VNode } from 'vue'
import Button from './Button.vue'
import ColumnDefinition from './ColumnDefinition.vue'
import ContentPresenter from './ContentPresenter.vue'
import DateTimePickerFlyout from './DateTimePickerFlyout.vue'
import Grid from './Grid.vue'
import Rectangle from './Rectangle.vue'
import RowDefinition from './RowDefinition.vue'
import TextBlock from './TextBlock.vue'
import { getVNodeChildren } from './CollectionProperties'
import { xamlResourceDictionaryKey } from './Page.vue'
import { calendarDateFromSerial, calendarDateSerial, parseCalendarDate } from './calendarEngine'
import { createDatePickerModel } from './datePickerEngine'
import { useI18n } from './i18n/index'
import { alignment, cssLength, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey, xamlTemplateComponent } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  CalendarIdentifier: { type: String, default: 'GregorianCalendar' },
  Date: { type: [globalThis.Date, String], default: undefined },
  SelectedDate: { type: [globalThis.Date, String], default: undefined },
  DayFormat: { type: String, default: 'day.integer' }, DayVisible: { type: [Boolean, String], default: true },
  MonthFormat: { type: String, default: 'month.full' }, MonthVisible: { type: [Boolean, String], default: true },
  YearFormat: { type: String, default: 'year.full' }, YearVisible: { type: [Boolean, String], default: true },
  MinYear: { type: [globalThis.Date, String], default: () => new globalThis.Date(new globalThis.Date().getFullYear() - 100, 0, 1) },
  MaxYear: { type: [globalThis.Date, String], default: () => new globalThis.Date(new globalThis.Date().getFullYear() + 100, 11, 31) },
  Header: { type: null, default: null }, HeaderTemplate: { type: null, default: null },
  Orientation: { type: String, default: 'Horizontal' },
  IsEnabled: { type: [Boolean, String], default: true }, Language: { type: String, default: '' },
  LightDismissOverlayMode: { type: String, default: 'Auto' }, RequestedTheme: { type: String, default: 'Default' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }, Padding: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Center' },
  Visibility: { type: String, default: 'Visible' }, FontSize: { type: [String, Number], default: '' },
  FontFamily: { type: String, default: '' }, FontWeight: { type: [String, Number], default: 'Normal' },
  Background: { type: String, default: '{ThemeResource DatePickerButtonBackground}' },
  Foreground: { type: String, default: '{ThemeResource DatePickerButtonForeground}' },
  BorderBrush: { type: String, default: '{ThemeResource DatePickerButtonBorderBrush}' },
  BorderThickness: { type: [String, Number], default: 1 }, CornerRadius: { type: [String, Number], default: '{ThemeResource ControlCornerRadius}' }
})
const emit = defineEmits(['DateChanged', 'SelectedDateChanged', 'update:Date', 'update:SelectedDate'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const { t, locale } = useI18n()
const inheritedTheme = inject('winuiTheme', null)
const resources = inject<Record<string, VNode> | null>(xamlResourceDictionaryKey, null)
const rootRef = ref<HTMLElement | null>(null)
const buttonRef = ref<any>(null)
const flyoutRef = ref<any>(null)
const localDate = ref<globalThis.Date | null>(null)
const nullDate = () => new globalThis.Date(-11644473600000)
const draft = ref(calendarDateSerial(new globalThis.Date()))
const draftBaseDate = ref(new globalThis.Date())
const value = (input: unknown) => resolveXamlValue(input, instance)
const enabled = computed(() => value(props.IsEnabled) !== false)
const language = computed(() => String(value(props.Language) || locale))
const asDate = (input: unknown, fallback: globalThis.Date) => {
  const date = input instanceof globalThis.Date ? input : new globalThis.Date(String(input))
  return Number.isFinite(date.getTime()) ? date : fallback
}
const model = computed(() => createDatePickerModel(String(value(props.CalendarIdentifier)), language.value,
  asDate(value(props.MinYear), new globalThis.Date(new globalThis.Date().getFullYear() - 100, 0, 1)),
  asDate(value(props.MaxYear), new globalThis.Date(new globalThis.Date().getFullYear() + 100, 11, 31))))
const formats = computed(() => ({ day: String(value(props.DayFormat)), month: String(value(props.MonthFormat)), year: String(value(props.YearFormat)) }))
const fields = computed(() => model.value.order.filter(field => value(props[field === 'day' ? 'DayVisible' : field === 'month' ? 'MonthVisible' : 'YearVisible']) !== false))
const currentYear = computed(() => model.value.calendar.yearAt(draft.value))
const months = computed(() => model.value.calendar.months.slice(currentYear.value.firstMonth, currentYear.value.lastMonth + 1))
const currentMonth = computed(() => model.value.calendar.monthAt(draft.value))
const days = computed(() => Array.from({ length: currentMonth.value.end - currentMonth.value.start + 1 }, (_, index) => currentMonth.value.start + index))
const fieldItems = computed(() => ({
  year: model.value.years.map(year => model.value.format(year.start, formats.value.year, 'year')),
  month: months.value.map(month => model.value.format(month.start, formats.value.month, 'month')),
  day: days.value.map(day => model.value.format(day, formats.value.day, 'day'))
}))
const fieldIndices = computed(() => ({ year: model.value.years.findIndex(year => year.index === currentYear.value.index), month: months.value.findIndex(month => month.index === currentMonth.value.index), day: draft.value - currentMonth.value.start }))
const columns = computed(() => fields.value.map(key => ({ key, items: fieldItems.value[key], index: fieldIndices.value[key], loop: key !== 'year', weight: key === 'month' ? 132 : 78, align: key === 'month' ? 'Left' as const : 'Center' as const, label: t(`datePicker.${key}`) })))
const textFor = (field?: 'day' | 'month' | 'year') => !field ? '' : localDate.value ? model.value.format(calendarDateSerial(localDate.value), formats.value[field], field) : t(`datePicker.${field}`)
const columnStyle = computed(() => ({ gridTemplateColumns: columns.value.flatMap((column, index) => [index ? '1px' : '', `minmax(0, ${column.weight}fr)`]).filter(Boolean).join(' ') }))
const fieldStyle = (index: number) => ({ textAlign: fields.value[index] === 'month' ? 'left' : 'center', padding: fields.value[index] === 'month' ? 'var(--DatePickerHostMonthPadding, 3px 0 6px 9px)' : 'var(--DatePickerHostPadding, 3px 0 6px)', marginLeft: fields.value[index] === 'month' ? '1px' : '0' })
const firstStyle = computed(() => fieldStyle(0)); const secondStyle = computed(() => fieldStyle(1)); const thirdStyle = computed(() => fieldStyle(2))
const theme = computed(() => {
  const requested = String(value(props.RequestedTheme)).toLowerCase()
  return requested === 'dark' || requested === 'light' ? requested : String(unref(inheritedTheme) || 'Default').toLowerCase()
})
const propertyNodes = (name: string): VNode[] => {
  const collect = (nodes: VNode[]): VNode[] => nodes.flatMap(node => {
    if (node.type === Fragment && Array.isArray(node.children)) return collect(node.children as VNode[])
    return (node.type as { __datePickerProperty?: string })?.__datePickerProperty === name ? getVNodeChildren(node) : []
  })
  return collect(slots.default?.() ?? [])
}
const header = computed(() => value(props.Header))
const hasHeader = computed(() => header.value !== null && header.value !== undefined && header.value !== '' || propertyNodes('Header').length > 0 || propertyNodes('HeaderTemplate').length > 0 || !!props.HeaderTemplate)
const HeaderContent = defineComponent({ setup() { return () => {
  const template = propertyNodes('HeaderTemplate')
  const content = propertyNodes('Header')
  const key = typeof props.HeaderTemplate === 'string' ? props.HeaderTemplate.match(/^\{StaticResource\s+([^\s}]+)\}$/)?.[1] : null
  if (template.length) return xamlTemplateComponent(template, header.value, instance)
  if (key && resources?.[key]) return xamlTemplateComponent(getVNodeChildren(resources[key]), header.value, instance)
  if (content.length) return h(Fragment, normalizeXamlNodes(content, instance))
  const explicit = value(props.HeaderTemplate)
  if (isVNode(explicit)) return xamlTemplateComponent([explicit], header.value, instance)
  return isVNode(header.value) ? header.value : String(header.value ?? '')
} } })
const rootClasses = computed(() => ({ 'has-no-date': !localDate.value, 'is-disabled': !enabled.value, 'win-theme-scope': ['dark', 'light'].includes(theme.value), 'theme-dark': theme.value === 'dark', 'theme-light': theme.value === 'light' }))
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !['class', 'style', 'DateChanged', 'SelectedDateChanged'].includes(key))))
const rootStyle = computed(() => {
  const style: Record<string, unknown> = {
    '--picker-background': value(props.Background), '--picker-foreground': value(props.Foreground), '--picker-border': value(props.BorderBrush),
    '--picker-border-thickness': xamlThickness(value(props.BorderThickness)), '--picker-radius': cssLength(value(props.CornerRadius)),
    margin: xamlThickness(value(props.Margin)), padding: xamlThickness(value(props.Padding)),
    alignSelf: alignment(value(props.VerticalAlignment), 'vertical'), justifySelf: alignment(value(props.HorizontalAlignment), 'horizontal'),
    fontSize: cssLength(value(props.FontSize)), fontFamily: value(props.FontFamily) || undefined, fontWeight: value(props.FontWeight) === 'Normal' ? 400 : value(props.FontWeight)
  }
  for (const name of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) {
    if (value(props[name]) !== '') style[name[0].toLowerCase() + name.slice(1)] = cssLength(value(props[name]))
  }
  if (value(props.Visibility) === 'Collapsed') style.display = 'none'
  if (value(props.Visibility) === 'Hidden') style.visibility = 'hidden'
  return [attrs.style, style]
})
const raise = (name: 'DateChanged' | 'SelectedDateChanged', args: unknown) => {
  emit(name, publicApi, args)
  resolveXamlHandler(attrs[name], instance)?.(publicApi, args)
}
const setDate = (input: unknown, notify = true) => {
  const parsed = parseCalendarDate(input)
  const next = parsed?.getTime() === nullDate().getTime() ? null : model.value.coerce(parsed)
  const previous = localDate.value
  if (next?.getTime() === previous?.getTime()) return
  localDate.value = next
  updateXamlBinding(props.Date, next ?? nullDate(), instance)
  updateXamlBinding(props.SelectedDate, next, instance)
  emit('update:Date', next ?? nullDate()); emit('update:SelectedDate', next)
  if (notify) { raise('DateChanged', { OldDate: previous ?? nullDate(), NewDate: next ?? nullDate() }); raise('SelectedDateChanged', { OldDate: previous, NewDate: next }) }
}
const OnFlyoutButtonClick = async () => {
  if (!enabled.value || !model.value.years.length) return
  if (flyoutRef.value?.IsOpen) { void flyoutRef.value.Hide(); return }
  draftBaseDate.value = model.value.coerce(localDate.value ?? new globalThis.Date())!
  draft.value = calendarDateSerial(draftBaseDate.value)
  await nextTick()
  const target = rootRef.value?.querySelector<HTMLButtonElement>('.picker-button')
  if (target && enabled.value) void flyoutRef.value?.ShowAt(target)
}
const OnFlyoutSelectionChanged = (_sender: unknown, args: { Key: string; SelectedIndex: number; Indices?: Record<string, number> }) => {
  if (args.Indices) {
    const indices = args.Indices
    const year = indices.year === undefined ? currentYear.value : model.value.years[indices.year] ?? currentYear.value
    const targetMonths = model.value.calendar.months.slice(year.firstMonth, year.lastMonth + 1)
    const requestedMonth = indices.month === undefined ? currentMonth.value : months.value[indices.month] ?? currentMonth.value
    const offset = requestedMonth.index - currentYear.value.firstMonth
    const month = targetMonths.find(candidate => candidate.month === requestedMonth.month) ?? targetMonths[Math.min(offset, targetMonths.length - 1)]!
    const day = indices.day === undefined ? model.value.calendar.day(draft.value) : model.value.calendar.day(days.value[indices.day] ?? draft.value)
    draft.value = Math.min(month.end, month.start + Math.max(0, day - model.value.calendar.day(month.start)))
    return
  }
  const index = args.SelectedIndex
  if (args.Key === 'day') { draft.value = days.value[index] ?? draft.value; return }
  const day = model.value.calendar.day(draft.value)
  let month = currentMonth.value
  if (args.Key === 'month') month = months.value[index] ?? month
  if (args.Key === 'year') {
    const year = model.value.years[index]
    if (!year) return
    const offset = currentMonth.value.index - currentYear.value.firstMonth
    const candidates = model.value.calendar.months.slice(year.firstMonth, year.lastMonth + 1)
    month = candidates.find(candidate => candidate.month === currentMonth.value.month) ?? candidates[Math.min(offset, candidates.length - 1)]!
  }
  draft.value = Math.min(month.end, month.start + day - model.value.calendar.day(month.start))
}
const OnFlyoutClosed = (_sender: unknown, args: { Accepted: boolean }) => {
  if (!args.Accepted) return
  const next = calendarDateFromSerial(draft.value)
  const previous = draftBaseDate.value
  next.setHours(previous.getHours(), previous.getMinutes(), previous.getSeconds(), previous.getMilliseconds())
  setDate(next)
}
provide(xamlScopeKey, {
  PickerEnabled: enabled, PickerColumns: columns, PickerTheme: theme, PickerOverlayMode: computed(() => value(props.LightDismissOverlayMode)),
  PickerBorderThickness: computed(() => value(props.BorderThickness)), PickerCornerRadius: computed(() => value(props.CornerRadius)),
  PickerAutomationName: computed(() => String(header.value || t('datePicker.name')) + ' ' + fields.value.map(textFor).join(' ')),
  FirstText: computed(() => textFor(fields.value[0])), SecondText: computed(() => textFor(fields.value[1])), ThirdText: computed(() => textFor(fields.value[2])),
  OnFlyoutButtonClick, OnFlyoutSelectionChanged, OnFlyoutClosed
})
const publicApi = { Date: computed({ get: () => localDate.value ?? nullDate(), set: input => setDate(input) }), SelectedDate: computed({ get: () => localDate.value, set: input => setDate(input) }), Focus: () => rootRef.value?.querySelector<HTMLButtonElement>('.picker-button')?.focus() }
watch([() => value(props.Date), () => value(props.SelectedDate)], ([date, selected], previous) => {
  const source = previous.length ? selected !== previous[1] ? selected : date : selected !== undefined ? selected : date
  setDate(source, previous.length > 0)
}, { immediate: true })
watch(model, () => { setDate(localDate.value); if (flyoutRef.value?.IsOpen) draft.value = Math.max(model.value.minimum, Math.min(model.value.maximum, draft.value)) })
watch(enabled, next => { if (!next) void flyoutRef.value?.Hide() })
onBeforeUnmount(() => { void flyoutRef.value?.Hide() })
defineExpose(publicApi)
</script>

<style scoped>
.win-date-picker.win-date-picker { display: inline-grid; flex: 0 0 auto; box-sizing: border-box; width: 296px; min-width: min(296px, 100%); max-width: min(456px, 100%); vertical-align: middle; color: var(--picker-foreground); font-size: var(--ControlContentThemeFontSize, 14px); --DatePickerButtonBorderBrush: var(--ButtonControlElevationBorderBrush); --DatePickerButtonBorderBrushPointerOver: var(--ButtonControlElevationBorderBrush); }
.picker-layout-root { width: 100%; min-width: 0; }
.picker-header { margin: 0 0 4px; min-width: 0; max-width: 456px; overflow-wrap: anywhere; color: var(--DatePickerHeaderForeground); }
.win-date-picker :deep(.picker-button) {
  display: flex; width: 100%; min-height: var(--TextControlThemeMinHeight, 32px); max-width: 456px; box-sizing: border-box; padding: 0; gap: 0;
  border: 0; border-radius: var(--ButtonCornerRadius); color: var(--ButtonForegroundCurrent); background: transparent; font: inherit;
  --ButtonBackground: var(--picker-background);
  --ButtonBackgroundPointerOver: var(--DatePickerButtonBackgroundPointerOver);
  --ButtonBackgroundPressed: var(--DatePickerButtonBackgroundPressed);
  --ButtonBackgroundDisabled: var(--DatePickerButtonBackgroundDisabled);
  --ButtonForeground: var(--picker-foreground);
  --ButtonForegroundPointerOver: var(--DatePickerButtonForegroundPointerOver);
  --ButtonForegroundPressed: var(--DatePickerButtonForegroundPressed);
  --ButtonForegroundDisabled: var(--DatePickerButtonForegroundDisabled);
  --ButtonBorderBrush: var(--picker-border);
  --ButtonBorderBrushPointerOver: var(--DatePickerButtonBorderBrushPointerOver);
  --ButtonBorderBrushPressed: var(--DatePickerButtonBorderBrushPressed);
  --ButtonBorderBrushDisabled: var(--DatePickerButtonBorderBrushDisabled);
}
/* A minimum-height host has no definite height for the presenter's 100%. */
.win-date-picker :deep(.picker-button > .win-button-content-presenter) { min-height: inherit !important; }
.picker-button-content { width: 100%; min-width: 0; }
.win-date-picker :deep(.picker-host-text) { box-sizing: border-box; min-width: 0; font-size: inherit; line-height: normal; color: inherit; overflow: hidden; white-space: nowrap; }
.picker-host-divider { height: 100%; }
.has-no-date :deep(.picker-button) { --ButtonForeground: var(--DatePickerButtonForegroundDefault); }
.is-disabled .picker-header { color: var(--DatePickerHeaderForegroundDisabled); }
.is-disabled .picker-host-divider { background: var(--DatePickerSpacerFillDisabled); }
.win-date-picker :deep(.picker-button:focus-visible) { outline: 2px solid var(--TextFillColorPrimaryBrush); outline-offset: 1px; }
@media (forced-colors: active) {
  .win-date-picker.win-date-picker { --DatePickerButtonBorderBrush: ButtonText; --DatePickerButtonBorderBrushPointerOver: ButtonText; }
}
</style>
