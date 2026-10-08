<template>
  <div ref="rootRef" v-bind="rootAttrs" class="win-date-time-picker time-picker" :class="[rootClasses, attrs.class]" :style="rootStyle">
    <Grid class="picker-layout-root">
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto" />
        <RowDefinition Height="*" />
      </Grid.RowDefinitions>
      <ContentPresenter v-if="hasHeader" class="picker-header" Grid.Row="0"><HeaderContent /></ContentPresenter>
      <Button ref="buttonRef" class="picker-button" Grid.Row="1" Style="{StaticResource TimePickerFlyoutButtonStyle}" Padding="0" MinHeight="{ThemeResource TextControlThemeMinHeight}" MinWidth="0" BorderThickness="{x:Bind PickerBorderThickness}" CornerRadius="{x:Bind PickerCornerRadius}" HorizontalAlignment="Stretch" VerticalAlignment="Top" HorizontalContentAlignment="Stretch" VerticalContentAlignment="Stretch" IsEnabled="{x:Bind PickerEnabled}" AutomationProperties.Name="{x:Bind PickerAutomationName}" Click="OnFlyoutButtonClick">
        <Grid class="picker-button-grid" :style="columnStyle">
          <Grid.ColumnDefinitions>
            <ColumnDefinition Width="*" />
            <ColumnDefinition Width="Auto" />
            <ColumnDefinition Width="*" />
            <ColumnDefinition Width="Auto" />
            <ColumnDefinition Width="*" />
          </Grid.ColumnDefinitions>
          <Border v-if="fields.length > 0" class="picker-host" Grid.Column="0"><TextBlock class="picker-host-text" Text="{x:Bind FirstText}" :style="firstStyle" TextTrimming="CharacterEllipsis" /></Border>
          <Rectangle v-if="fields.length > 1" class="picker-host-divider" Grid.Column="1" Width="1" Fill="{ThemeResource TimePickerSpacerFill}" />
          <Border v-if="fields.length > 1" class="picker-host" Grid.Column="2"><TextBlock class="picker-host-text" Text="{x:Bind SecondText}" :style="secondStyle" TextTrimming="CharacterEllipsis" /></Border>
          <Rectangle v-if="fields.length > 2" class="picker-host-divider" Grid.Column="3" Width="1" Fill="{ThemeResource TimePickerSpacerFill}" />
          <Border v-if="fields.length > 2" class="picker-host" Grid.Column="4"><TextBlock class="picker-host-text" Text="{x:Bind ThirdText}" :style="thirdStyle" TextTrimming="CharacterEllipsis" /></Border>
        </Grid>
      </Button>
    </Grid>
    <DateTimePickerFlyout ref="flyoutRef" Kind="TimePicker" Columns="{x:Bind PickerColumns}" RequestedTheme="{x:Bind PickerTheme}" LightDismissOverlayMode="{x:Bind PickerOverlayMode}" Closed="OnFlyoutClosed" SelectionChanged="OnFlyoutSelectionChanged" />
  </div>
</template>

<script lang="ts">
import { defineComponent, Fragment, h } from 'vue'

const property = (name: string) => defineComponent({
  name: `TimePicker.${name}`,
  __timePickerProperty: name,
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

export default { Header: property('Header'), HeaderTemplate: property('HeaderTemplate') }

</script>

<script setup lang="ts">

import { computed, getCurrentInstance, inject, isVNode, nextTick, onBeforeUnmount, provide, ref, unref, useAttrs, useSlots, watch, type VNode } from 'vue'
import Border from './Border.vue'
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
import { useI18n } from './i18n/index'
import { alignment, cssLength, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey, xamlTemplateComponent } from './xamlRuntime'

type TimeValue = number | string | null | undefined

interface TimePickerField {
  key: 'hour' | 'minute' | 'period'
  items: string[]
  index: number
  loop: boolean
  weight: number
  align: 'Left' | 'Center'
  label: string
}

defineOptions({ inheritAttrs: false })
const props = defineProps({
  ClockIdentifier: { type: String, default: undefined },
  Header: { type: null, default: null }, HeaderTemplate: { type: null, default: null }, HeaderPlacement: { type: String, default: 'Top' },
  IsEnabled: { type: [Boolean, String], default: true }, Language: { type: String, default: '' },
  LightDismissOverlayMode: { type: String, default: 'Auto' }, MinuteIncrement: { type: [Number, String], default: 1 },
  SelectedTime: { type: [Number, String], default: undefined }, Time: { type: [Number, String], default: undefined },
  RequestedTheme: { type: String, default: 'Default' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }, Padding: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Center' },
  Visibility: { type: String, default: 'Visible' }, FontSize: { type: [String, Number], default: '' },
  FontFamily: { type: String, default: '' }, FontWeight: { type: [String, Number], default: 'Normal' },
  Background: { type: String, default: '{ThemeResource TimePickerButtonBackground}' },
  Foreground: { type: String, default: '{ThemeResource TimePickerButtonForeground}' },
  BorderBrush: { type: String, default: '{ThemeResource TimePickerButtonBorderBrush}' },
  BorderThickness: { type: [String, Number], default: 1 }, CornerRadius: { type: [String, Number], default: '{ThemeResource ControlCornerRadius}' }
})
const emit = defineEmits(['TimeChanged', 'SelectedTimeChanged', 'update:Time', 'update:SelectedTime'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const { t, locale } = useI18n()
const inheritedTheme = inject('winuiTheme', null)
const resources = inject<Record<string, VNode> | null>(xamlResourceDictionaryKey, null)
const rootRef = ref<HTMLElement | null>(null)
const buttonRef = ref<any>(null)
const flyoutRef = ref<any>(null)
const localTime = ref<number | null>(null)
const draft = ref(0)
const representation = ref<'number' | 'string'>('number')
const minuteIncrement = ref(1)
const clockIdentifier = ref('')
const value = (input: unknown) => resolveXamlValue(input, instance)
const enabled = computed(() => ![false, 'False', 'false'].includes(value(props.IsEnabled) as any))
const language = computed(() => String(value(props.Language) || locale))
const DAY = 86400000
const HOUR = 3600000
const MINUTE = 60000

const parseTime = (input: unknown): { milliseconds: number; kind: 'number' | 'string' } | null => {
  if (input === null || input === undefined || input === '') return null
  if (typeof input === 'number') {
    if (input === -1) return null
    if (input < 0) throw new RangeError('Time must be non-negative or the -1 null sentinel.')
    return Number.isFinite(input) ? { milliseconds: input, kind: 'number' } : null
  }
  if (typeof input !== 'string') return null
  const source = input.trim()
  if (source.startsWith('-')) throw new RangeError('Time must be non-negative or the -1 null sentinel.')
  const match = source.match(/^(\d+):([0-5]\d):([0-5]\d)(?:\.(\d{1,7}))?$/)
  if (!match) return null
  const fraction = match[4] ? Number(`0.${match[4].slice(0, 3).padEnd(3, '0')}`) * 1000 : 0
  const milliseconds = Number(match[1]) * HOUR + Number(match[2]) * MINUTE + Number(match[3]) * 1000 + fraction
  return Number.isFinite(milliseconds) ? { milliseconds, kind: 'string' } : null
}
const validateMinuteIncrement = (input: unknown) => {
  if (input === null || input === undefined || input === '') return 1
  const next = Number(input)
  if (!Number.isInteger(next) || next < 0 || next > 59) throw new RangeError('MinuteIncrement must be an integer from 0 through 59.')
  return next
}
const validateClockIdentifier = (input: unknown) => {
  if (input === null || input === undefined) return ''
  const next = String(input)
  if (next !== '12HourClock' && next !== '24HourClock') throw new RangeError('ClockIdentifier must be 12HourClock or 24HourClock.')
  return next
}
const normalizedIncrement = computed(() => minuteIncrement.value)
const adjustedIncrement = computed(() => normalizedIncrement.value === 0 ? 60 : normalizedIncrement.value)
const coerceMilliseconds = (input: unknown) => {
  const parsed = parseTime(input)
  if (!parsed) return null
  const dayValue = ((Math.trunc(parsed.milliseconds) % DAY) + DAY) % DAY
  const hour = Math.floor(dayValue / HOUR)
  const minute = Math.floor((dayValue % HOUR) / MINUTE)
  return hour * HOUR + (minute - minute % adjustedIncrement.value) * MINUTE
}
const formatTimeSpan = (milliseconds: number) => {
  const dayValue = ((Math.trunc(milliseconds) % DAY) + DAY) % DAY
  return `${String(Math.floor(dayValue / HOUR)).padStart(2, '0')}:${String(Math.floor(dayValue % HOUR / MINUTE)).padStart(2, '0')}:00`
}
const encodeSelectedTime = (milliseconds: number | null, kind = representation.value): TimeValue => milliseconds === null ? null : kind === 'string' ? formatTimeSpan(milliseconds) : milliseconds
const encodeTime = (milliseconds: number | null, kind = representation.value): TimeValue => milliseconds === null ? -1 : encodeSelectedTime(milliseconds, kind)
const effectiveClock = computed<'12HourClock' | '24HourClock'>(() => {
  const requested = clockIdentifier.value
  if (requested === '12HourClock' || requested === '24HourClock') return requested
  const cycle = new Intl.DateTimeFormat(language.value, { hour: 'numeric' }).resolvedOptions().hourCycle
  return cycle === 'h11' || cycle === 'h12' ? '12HourClock' : '24HourClock'
})
const hourValues = computed(() => effectiveClock.value === '12HourClock' ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : Array.from({ length: 24 }, (_, index) => index))
const minutes = computed(() => Array.from({ length: Math.ceil(60 / adjustedIncrement.value) }, (_, index) => index * adjustedIncrement.value).filter(item => item < 60))
const formatter = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(language.value, { ...options, timeZone: 'UTC' })
const clockCycle = computed<Intl.DateTimeFormatOptions['hourCycle']>(() => effectiveClock.value === '12HourClock' ? 'h12' : 'h23')
const formatPart = (hour: number, options: Intl.DateTimeFormatOptions, type: string) => formatter({ ...options, hourCycle: clockCycle.value })
  .formatToParts(new globalThis.Date(Date.UTC(2024, 0, 1, hour))).find(part => part.type === type)?.value || ''
const hourItems = computed(() => hourValues.value.map(hour => formatPart(effectiveClock.value === '12HourClock' && hour === 12 ? 0 : hour, { hour: 'numeric' }, 'hour')))
const minuteItems = computed(() => minutes.value.map(minute => formatter({ hour: 'numeric', minute: '2-digit', hourCycle: 'h23' })
  .formatToParts(new globalThis.Date(Date.UTC(2024, 0, 1, 0, minute))).find(part => part.type === 'minute')?.value || String(minute).padStart(2, '0')))
const periodItems = computed(() => [formatPart(9, { hour: 'numeric' }, 'dayPeriod') || t('timePicker.am'), formatPart(15, { hour: 'numeric' }, 'dayPeriod') || t('timePicker.pm')])
const currentDate = (milliseconds: number) => new globalThis.Date(((Math.trunc(milliseconds) % DAY) + DAY) % DAY)
const order = computed<Array<'hour' | 'minute' | 'period'>>(() => {
  const found = formatter({ hour: 'numeric', minute: '2-digit', hourCycle: clockCycle.value })
    .formatToParts(new globalThis.Date(Date.UTC(2024, 0, 1, 13, 5)))
    .filter(part => part.type === 'hour' || part.type === 'minute' || part.type === 'dayPeriod')
    .map(part => part.type === 'dayPeriod' ? 'period' as const : part.type as 'hour' | 'minute')
  const unique = found.filter((item, index) => found.indexOf(item) === index)
  if (!unique.includes('hour')) unique.push('hour')
  if (!unique.includes('minute')) unique.push('minute')
  if (effectiveClock.value === '12HourClock' && !unique.includes('period')) unique.push('period')
  return unique.slice(0, effectiveClock.value === '12HourClock' ? 3 : 2)
})
const fields = computed<TimePickerField[]>(() => order.value.map(key => {
  const date = currentDate(draft.value)
  const hour12 = date.getUTCHours() % 12 || 12
  const index = key === 'hour' ? hourValues.value.indexOf(effectiveClock.value === '12HourClock' ? hour12 : date.getUTCHours())
    : key === 'minute' ? minutes.value.indexOf(date.getUTCMinutes()) : date.getUTCHours() >= 12 ? 1 : 0
  const items = key === 'hour' ? hourItems.value : key === 'minute' ? minuteItems.value : periodItems.value
  return { key, items, index: Math.max(0, index), loop: key === 'hour' || key === 'minute' && normalizedIncrement.value !== 0, weight: 1, align: 'Center', label: t(`timePicker.${key}`) }
}))
const textFor = (key?: 'hour' | 'minute' | 'period') => {
  if (!key) return ''
  if (localTime.value === null) return key === 'hour' ? t('timePicker.hour') : key === 'minute' ? t('timePicker.minute') : periodItems.value[0]
  const date = currentDate(localTime.value)
  if (key === 'hour') return hourItems.value[hourValues.value.indexOf(effectiveClock.value === '12HourClock' ? date.getUTCHours() % 12 || 12 : date.getUTCHours())] ?? ''
  if (key === 'minute') return minuteItems.value[minutes.value.indexOf(date.getUTCMinutes())] ?? String(date.getUTCMinutes()).padStart(2, '0')
  return periodItems.value[date.getUTCHours() >= 12 ? 1 : 0]
}
const columnStyle = computed(() => ({ gridTemplateColumns: fields.value.flatMap((_field, index) => [index ? '1px' : '', 'minmax(0, 1fr)']).filter(Boolean).join(' ') }))
const firstStyle = computed(() => ({ textAlign: 'center' })); const secondStyle = computed(() => ({ textAlign: 'center' })); const thirdStyle = computed(() => ({ textAlign: 'center' }))
const theme = computed(() => {
  const requested = String(value(props.RequestedTheme)).toLowerCase()
  return requested === 'dark' || requested === 'light' ? requested : String(unref(inheritedTheme) || 'Default').toLowerCase()
})
const propertyNodes = (name: string): VNode[] => {
  const collect = (nodes: VNode[]): VNode[] => nodes.flatMap(node => {
    if (node.type === Fragment && Array.isArray(node.children)) return collect(node.children as VNode[])
    return (node.type as { __timePickerProperty?: string })?.__timePickerProperty === name ? getVNodeChildren(node) : []
  })
  return collect(slots.default?.() ?? [])
}
const header = computed(() => value(props.Header))
const hasHeader = computed(() => header.value !== null && header.value !== undefined && header.value !== '' || propertyNodes('Header').length > 0 || propertyNodes('HeaderTemplate').length > 0 || !!props.HeaderTemplate)
const HeaderContent = defineComponent({ setup() { return () => {
  const template = propertyNodes('HeaderTemplate'); const content = propertyNodes('Header')
  const key = typeof props.HeaderTemplate === 'string' ? props.HeaderTemplate.match(/^\{StaticResource\s+([^\s}]+)\}$/)?.[1] : null
  if (template.length) return xamlTemplateComponent(template, header.value, instance)
  if (key && resources?.[key]) return xamlTemplateComponent(getVNodeChildren(resources[key]), header.value, instance)
  if (content.length) return h(Fragment, normalizeXamlNodes(content, instance))
  const explicit = value(props.HeaderTemplate)
  if (isVNode(explicit)) return xamlTemplateComponent([explicit], header.value, instance)
  return isVNode(header.value) ? header.value : String(header.value ?? '')
} } })
const rootClasses = computed(() => ({ 'win-time-picker': true, 'has-no-time': localTime.value === null, 'is-disabled': !enabled.value, 'header-left': String(value(props.HeaderPlacement)) === 'Left', 'win-theme-scope': ['dark', 'light'].includes(theme.value), 'theme-dark': theme.value === 'dark', 'theme-light': theme.value === 'light' }))
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !['class', 'style', 'TimeChanged', 'SelectedTimeChanged'].includes(key))))
const rootStyle = computed(() => {
  const style: Record<string, unknown> = {
    '--picker-background': value(props.Background), '--picker-foreground': value(props.Foreground), '--picker-border': value(props.BorderBrush),
    '--picker-border-thickness': xamlThickness(value(props.BorderThickness)), '--picker-radius': cssLength(value(props.CornerRadius)), margin: xamlThickness(value(props.Margin)), padding: xamlThickness(value(props.Padding)),
    alignSelf: alignment(value(props.VerticalAlignment), 'vertical'), justifySelf: alignment(value(props.HorizontalAlignment), 'horizontal'), fontSize: cssLength(value(props.FontSize)), fontFamily: value(props.FontFamily) || undefined, fontWeight: value(props.FontWeight) === 'Normal' ? 400 : value(props.FontWeight)
  }
  for (const name of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) if (value(props[name]) !== '') style[name[0].toLowerCase() + name.slice(1)] = cssLength(value(props[name]))
  if (value(props.Visibility) === 'Collapsed') style.display = 'none'
  if (value(props.Visibility) === 'Hidden') style.visibility = 'hidden'
  return [attrs.style, style as import('vue').CSSProperties]
})
const raise = (name: 'TimeChanged' | 'SelectedTimeChanged', args: unknown) => { emit(name, publicApi, args); resolveXamlHandler(attrs[name], instance)?.(publicApi, args) }
const setTime = (input: unknown, notify = true, kind?: 'number' | 'string') => {
  const parsed = parseTime(input); const next = parsed ? coerceMilliseconds(input) : null; const nextKind = kind ?? parsed?.kind ?? representation.value
  const previous = localTime.value; const previousKind = representation.value; representation.value = nextKind
  if (previous === next) return
  localTime.value = next
  const oldTime = encodeTime(previous, previousKind); const newTime = encodeTime(next, nextKind)
  const oldSelectedTime = encodeSelectedTime(previous, previousKind); const newSelectedTime = encodeSelectedTime(next, nextKind)
  updateXamlBinding(props.Time, newTime, instance); updateXamlBinding(props.SelectedTime, newSelectedTime, instance)
  emit('update:Time', newTime); emit('update:SelectedTime', newSelectedTime)
  if (notify) { raise('TimeChanged', { OldTime: oldTime, NewTime: newTime }); raise('SelectedTimeChanged', { OldTime: oldSelectedTime, NewTime: newSelectedTime }) }
}
const OnFlyoutButtonClick = async () => {
  if (!enabled.value) return
  if (flyoutRef.value?.IsOpen) { void flyoutRef.value.Hide(); return }
  const now = new globalThis.Date()
  draft.value = localTime.value ?? coerceMilliseconds(now.getHours() * HOUR + now.getMinutes() * MINUTE) ?? 0
  await nextTick()
  const target = rootRef.value?.querySelector<HTMLButtonElement>('.picker-button')
  if (target) void flyoutRef.value?.ShowAt(target)
}
const OnFlyoutSelectionChanged = (_sender: unknown, args: { Key?: string; SelectedIndex?: number; Indices?: Record<string, number> }) => {
  if (args.Indices) {
    const date = currentDate(draft.value)
    const hour = args.Indices.hour === undefined
      ? effectiveClock.value === '12HourClock' ? date.getUTCHours() % 12 || 12 : date.getUTCHours()
      : hourValues.value[args.Indices.hour]
    const minute = args.Indices.minute === undefined ? date.getUTCMinutes() : minutes.value[args.Indices.minute]
    const period = args.Indices.period === undefined ? (date.getUTCHours() >= 12 ? 1 : 0) : args.Indices.period
    if (hour === undefined || minute === undefined) return
    const normalizedHour = effectiveClock.value === '12HourClock' ? hour % 12 + (period === 1 ? 12 : 0) : hour
    draft.value = normalizedHour * HOUR + minute * MINUTE
    return
  }
  if (args.Key === undefined || args.SelectedIndex === undefined) return
  if (!fields.value.some(field => field.key === args.Key)) return
  const date = currentDate(draft.value)
  if (args.Key === 'hour') {
    const selected = hourValues.value[args.SelectedIndex] ?? hourValues.value[0]
    const period = effectiveClock.value === '12HourClock' && date.getUTCHours() >= 12 ? 12 : 0
    date.setUTCHours(effectiveClock.value === '12HourClock' ? selected % 12 + period : selected)
  } else if (args.Key === 'minute') date.setUTCMinutes(minutes.value[args.SelectedIndex] ?? 0)
  else date.setUTCHours(date.getUTCHours() % 12 + (args.SelectedIndex === 1 ? 12 : 0))
  draft.value = date.getUTCHours() * HOUR + date.getUTCMinutes() * MINUTE
}
const OnFlyoutClosed = (_sender: unknown, args: { Accepted: boolean }) => { if (args.Accepted) setTime(draft.value, true, representation.value) }
const publicApi = {
  Time: computed<TimeValue>({ get: () => encodeTime(localTime.value), set: next => setTime(next) }),
  SelectedTime: computed<TimeValue>({ get: () => encodeSelectedTime(localTime.value), set: next => setTime(next) }),
  Focus: () => rootRef.value?.querySelector<HTMLButtonElement>('.picker-button')?.focus()
}
provide(xamlScopeKey, {
  PickerEnabled: enabled, PickerColumns: fields, PickerTheme: theme, PickerOverlayMode: computed(() => value(props.LightDismissOverlayMode)),
  PickerBorderThickness: computed(() => value(props.BorderThickness)), PickerCornerRadius: computed(() => value(props.CornerRadius)),
  PickerAutomationName: computed(() => [String(header.value || t('timePicker.name')), fields.value.map(field => textFor(field.key)).join(' ')].filter(Boolean).join(' ')),
  FirstText: computed(() => textFor(fields.value[0]?.key)), SecondText: computed(() => textFor(fields.value[1]?.key)), ThirdText: computed(() => textFor(fields.value[2]?.key)),
  OnFlyoutButtonClick, OnFlyoutSelectionChanged, OnFlyoutClosed
})
watch(() => value(props.MinuteIncrement), input => { minuteIncrement.value = validateMinuteIncrement(input) }, { immediate: true })
watch(() => value(props.ClockIdentifier), input => { clockIdentifier.value = validateClockIdentifier(input) }, { immediate: true })
watch([() => value(props.SelectedTime), () => value(props.Time)], ([selected, time], previous) => {
  const source = previous?.length ? selected !== previous[0] ? selected : time : selected !== undefined ? selected : time
  const parsed = parseTime(source)
  setTime(source, (previous?.length ?? 0) > 0, parsed?.kind)
}, { immediate: true })
watch(adjustedIncrement, () => {
  if (localTime.value !== null) setTime(localTime.value, true, representation.value)
  if (flyoutRef.value?.IsOpen) draft.value = coerceMilliseconds(draft.value) ?? 0
})
watch(enabled, next => { if (!next) void flyoutRef.value?.Hide() })
onBeforeUnmount(() => { void flyoutRef.value?.Hide() })
defineExpose(publicApi)
</script>

<style scoped>
.win-time-picker.win-time-picker { display: inline-grid; flex: 0 0 auto; box-sizing: border-box; width: 242px; min-width: min(242px, 100%); max-width: min(456px, 100%); vertical-align: middle; color: var(--picker-foreground); font-size: var(--ControlContentThemeFontSize, 14px); line-height: 20px; --TimePickerButtonBorderBrush: var(--ButtonControlElevationBorderBrush); --TimePickerButtonBorderBrushPointerOver: var(--ButtonControlElevationBorderBrush); }
.win-time-picker :deep(.picker-layout-root) { width: 100%; min-width: 0; }
.win-time-picker :deep(.picker-header) { margin: 0 0 4px; min-width: 0; max-width: 456px; overflow-wrap: anywhere; color: var(--TimePickerHeaderForeground); }
.win-time-picker :deep(.picker-button) {
  display: flex; width: 100%; min-height: var(--TextControlThemeMinHeight, 32px); max-width: 456px; box-sizing: border-box; padding: 0; gap: 0;
  border: 0; border-radius: var(--ButtonCornerRadius); color: var(--ButtonForegroundCurrent); background: transparent; font: inherit;
  --ButtonBackground: var(--picker-background);
  --ButtonBackgroundPointerOver: var(--TimePickerButtonBackgroundPointerOver);
  --ButtonBackgroundPressed: var(--TimePickerButtonBackgroundPressed);
  --ButtonBackgroundDisabled: var(--TimePickerButtonBackgroundDisabled);
  --ButtonForeground: var(--picker-foreground);
  --ButtonForegroundPointerOver: var(--TimePickerButtonForegroundPointerOver);
  --ButtonForegroundPressed: var(--TimePickerButtonForegroundPressed);
  --ButtonForegroundDisabled: var(--TimePickerButtonForegroundDisabled);
  --ButtonBorderBrush: var(--picker-border);
  --ButtonBorderBrushPointerOver: var(--TimePickerButtonBorderBrushPointerOver);
  --ButtonBorderBrushPressed: var(--TimePickerButtonBorderBrushPressed);
  --ButtonBorderBrushDisabled: var(--TimePickerButtonBorderBrushDisabled);
}
/* A minimum-height host has no definite height for the presenter's 100%. */
.win-time-picker :deep(.picker-button > .win-button-content-presenter) { min-height: inherit !important; }
.win-time-picker :deep(.picker-button-grid) { width: 100%; min-width: 0; }
.win-time-picker :deep(.picker-host) { min-width: 0; overflow: hidden; }
.win-time-picker :deep(.picker-host-text) { box-sizing: border-box; min-width: 0; width: 100%; font-size: inherit; line-height: normal; padding: var(--TimePickerHostPadding, 3px 0 6px); color: inherit; text-align: center; overflow: hidden; white-space: nowrap; }
.win-time-picker :deep(.picker-host-divider) { height: 100%; }
.win-time-picker.has-no-time :deep(.picker-button) { --ButtonForeground: var(--TimePickerButtonForegroundDefault); }
.win-time-picker.is-disabled :deep(.picker-header) { color: var(--TimePickerHeaderForegroundDisabled); }
.win-time-picker.is-disabled :deep(.picker-host-divider) { background: var(--TimePickerSpacerFillDisabled); }
.win-time-picker :deep(.picker-button:focus-visible) { outline: 2px solid var(--TextFillColorPrimaryBrush); outline-offset: 1px; }
.win-time-picker.header-left :deep(.picker-layout-root) { grid-template-columns: auto minmax(0, 1fr); grid-template-rows: auto; }
.win-time-picker.header-left :deep(.picker-header) { grid-row: 1; grid-column: 1; margin: 5px 20px 0 0; align-self: start; }
.win-time-picker.header-left :deep(.picker-button) { grid-row: 1; grid-column: 2; }
@media (forced-colors: active) {
  .win-time-picker.win-time-picker { --TimePickerButtonBorderBrush: ButtonText; --TimePickerButtonBorderBrushPointerOver: ButtonText; }
}
</style>
