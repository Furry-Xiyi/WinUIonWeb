<template>
  <Button ref="button" v-bind="buttonAttrs" class="win-repeat-button"
    Content="{x:Bind Content, Mode=OneWay}" IsEnabled="{x:Bind IsEnabled, Mode=OneWay}"
    ContentTemplate="{x:Bind ContentTemplate}" ContentTransitions="{x:Bind ContentTransitions}"
    RequestedTheme="{x:Bind RequestedTheme}"
    ClickMode="{x:Bind ClickMode}" Click="OnRepeatClick"
    PointerPressed="OnPointerPressed" PointerReleased="OnPointerReleased" PointerMoved="OnPointerMoved"
    PointerCanceled="OnPointerCanceled" PointerCaptureLost="OnPointerCanceled"
    PointerExited="OnPointerExited" PointerEntered="OnPointerEntered">
    <slot v-if="hasContent" />
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { buttonContentProperty } from './buttonContentRuntime'
export const RepeatButtonContent = defineComponent({ name: 'RepeatButton.Content', __buttonProperty: 'content', setup() { return () => null } })
export default { Content: RepeatButtonContent, ContentTemplate: buttonContentProperty('RepeatButton', 'ContentTemplate'), ContentTransitions: buttonContentProperty('RepeatButton', 'ContentTransitions'), Resources: buttonContentProperty('RepeatButton', 'Resources') }
</script>
<style>
.win-repeat-button {
  --ButtonBackground: var(--RepeatButtonBackground);
  --ButtonBackgroundPointerOver: var(--RepeatButtonBackgroundPointerOver);
  --ButtonBackgroundPressed: var(--RepeatButtonBackgroundPressed);
  --ButtonBackgroundDisabled: var(--RepeatButtonBackgroundDisabled);
  --ButtonForeground: var(--RepeatButtonForeground);
  --ButtonForegroundPointerOver: var(--RepeatButtonForegroundPointerOver);
  --ButtonForegroundPressed: var(--RepeatButtonForegroundPressed);
  --ButtonForegroundDisabled: var(--RepeatButtonForegroundDisabled);
  --ButtonBorderBrush: var(--RepeatButtonBorderBrush);
  --ButtonBorderBrushPointerOver: var(--RepeatButtonBorderBrushPointerOver);
  --ButtonBorderBrushPressed: var(--RepeatButtonBorderBrushPressed);
  --ButtonBorderBrushDisabled: var(--RepeatButtonBorderBrushDisabled);
}
</style>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, proxyRefs, ref, useAttrs, useSlots, watch } from 'vue'
import Button from './Button.vue'
import { boolValue } from './layout'
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'
import { useUICommand } from './uiCommandRuntime'
import { useButtonContent } from './buttonContentRuntime'

defineOptions({ name: 'RepeatButton', inheritAttrs: false })
const props = defineProps({
  Content: { type: null, default: '' }, IsEnabled: { type: [Boolean, String], default: true },
  ContentTemplate: { type: null, default: undefined }, ContentTransitions: { type: null, default: undefined },
  RequestedTheme: { type: String, default: 'Default' },
  Delay: { type: [Number, String], default: 500 }, Interval: { type: [Number, String], default: 33 }, ClickMode: { type: String, default: 'Press' }
})
const emit = defineEmits(['Click'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const button = ref<any>(null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const { ContentTemplate, ContentTransitions } = useButtonContent(props, () => slots.default?.() ?? [], instance)
const Command = useUICommand(() => resolve(attrs.Command))
const CommandParameter = computed(() => resolve(attrs.CommandParameter))
const Content = computed(() => resolve(props.Content))
const sourceRequestedTheme = computed(() => String(resolve(props.RequestedTheme)))
const localRequestedTheme = ref<string | undefined>()
watch(sourceRequestedTheme, () => { localRequestedTheme.value = undefined })
const RequestedTheme = computed({ get: () => localRequestedTheme.value ?? sourceRequestedTheme.value, set: value => { localRequestedTheme.value = value; updateXamlBinding(props.RequestedTheme, value, instance) } })
const sourceIsEnabled = computed(() => boolValue(resolve(props.IsEnabled)))
const localIsEnabled = ref<boolean | undefined>()
const IsEnabled = computed({ get: () => (localIsEnabled.value ?? sourceIsEnabled.value) && (Command.value?.CanExecute?.(CommandParameter.value) ?? true), set: value => { localIsEnabled.value = boolValue(value); updateXamlBinding(props.IsEnabled, localIsEnabled.value, instance) } })
watch(sourceIsEnabled, () => { localIsEnabled.value = undefined })
const sourceDelay = computed(() => Number(resolve(props.Delay)))
const sourceInterval = computed(() => Number(resolve(props.Interval)))
const localDelay = ref<number | undefined>()
const localInterval = ref<number | undefined>()
const Delay = computed({ get: () => localDelay.value ?? sourceDelay.value, set: value => { if (!Number.isFinite(value) || value < 0) throw new RangeError('RepeatButton.Delay must be non-negative'); localDelay.value = value; updateXamlBinding(props.Delay, value, instance) } })
const Interval = computed({ get: () => localInterval.value ?? sourceInterval.value, set: value => { if (!Number.isFinite(value) || value <= 0) throw new RangeError('RepeatButton.Interval must be positive'); localInterval.value = value; updateXamlBinding(props.Interval, value, instance) } })
watch(sourceDelay, () => { localDelay.value = undefined })
watch(sourceInterval, () => { localInterval.value = undefined })
const ClickMode = computed(() => String(resolve(props.ClickMode)))
const buttonAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !['Click', 'onClick', 'ClickMode', 'PointerPressed', 'PointerReleased', 'PointerCanceled', 'PointerCaptureLost', 'PointerEntered', 'PointerExited'].includes(key))))
const hasContent = computed(() => Boolean(slots.default))
const api = proxyRefs({ Content: computed({ get: () => button.value?.Content ?? Content.value, set: value => { if (button.value) button.value.Content = value; updateXamlBinding(props.Content, value, instance) } }), ContentTemplate, ContentTransitions, IsEnabled, Delay, Interval, RequestedTheme, Command, CommandParameter, Name: computed(() => attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''), Element: computed(() => button.value?.Element), IsPressed: computed(() => button.value?.IsPressed ?? false), Focus: () => button.value?.Focus?.() })
defineExpose(api)

let timer: ReturnType<typeof setTimeout> | null = null
let activePointer: number | null = null
let activeKey = ''
let pointerInside = false
let lastEvent: Event | undefined
function raiseClick(_sender?: unknown, args?: { OriginalEvent?: Event }) {
  if (!IsEnabled.value) return
  if (args?.OriginalEvent) lastEvent = args.OriginalEvent
  const eventArgs = { OriginalSource: api, OriginalEvent: lastEvent, Handled: false }
  emit('Click', api, eventArgs)
  resolveXamlHandler(attrs.Click, instance)?.(api, eventArgs)
  if (!args && (Command.value?.CanExecute?.(CommandParameter.value) ?? true)) Command.value?.Execute(CommandParameter.value)
}
function stopTimer() { if (timer !== null) clearTimeout(timer); timer = null }
function stop() { stopTimer(); activePointer = null; activeKey = ''; pointerInside = false; lastEvent = undefined }
function tick() {
  timer = null
  if (!IsEnabled.value || ClickMode.value !== 'Hover' && !button.value?.IsPressed || !activeKey && (!pointerInside || activePointer === null && ClickMode.value !== 'Hover')) return
  raiseClick()
  if (IsEnabled.value && (activeKey || pointerInside && (activePointer !== null || ClickMode.value === 'Hover'))) timer = setTimeout(tick, Interval.value)
}
function schedule() { stopTimer(); timer = setTimeout(tick, Delay.value) }
function onPointerPressed(_sender: unknown, args: { OriginalEvent: PointerEvent }) {
  const event = args.OriginalEvent
  if (!IsEnabled.value || ClickMode.value === 'Hover' || event.button !== 0 || activePointer !== null) return
  activePointer = event.pointerId; pointerInside = true; lastEvent = event; schedule()
}
function onPointerReleased() { if (ClickMode.value !== 'Hover') stop() }
function onPointerCanceled() { stop() }
function onPointerExited() { pointerInside = false; stopTimer() }
function onPointerEntered() { pointerInside = true; if (activePointer !== null || ClickMode.value === 'Hover') schedule() }
function onPointerMoved(sender: { IsPressed: boolean }) {
  if (activePointer === null || ClickMode.value === 'Hover') return
  const inside = sender.IsPressed
  if (inside === pointerInside) return
  pointerInside = inside
  if (inside) schedule(); else stopTimer()
}
function keyDown(event: KeyboardEvent) {
  if (!IsEnabled.value || ClickMode.value === 'Hover' || event.repeat || activeKey || event.key !== ' ') return
  activeKey = event.key; lastEvent = event; schedule()
}
function keyUp(event: KeyboardEvent) { if (event.key === activeKey) stop() }
let element: HTMLElement | null = null
onMounted(() => {
  element = button.value?.Element ?? null
  element?.addEventListener('keydown', keyDown)
  element?.addEventListener('keyup', keyUp)
  element?.addEventListener('blur', stop)
  window.addEventListener('blur', stop)
})
onBeforeUnmount(() => {
  stop(); element?.removeEventListener('keydown', keyDown); element?.removeEventListener('keyup', keyUp); element?.removeEventListener('blur', stop); window.removeEventListener('blur', stop)
})
watch(IsEnabled, enabled => { if (!enabled) stop() })
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), Content, ContentTemplate, ContentTransitions, IsEnabled, ClickMode, RequestedTheme, OnRepeatClick: raiseClick, OnPointerPressed: onPointerPressed, OnPointerReleased: onPointerReleased, OnPointerCanceled: onPointerCanceled, OnPointerExited: onPointerExited, OnPointerEntered: onPointerEntered, OnPointerMoved: onPointerMoved })
</script>
