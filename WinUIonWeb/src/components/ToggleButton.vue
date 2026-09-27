<template>
  <Button ref="button" v-bind="buttonAttrs" class="win-toggle-button"
    :class="{ 'is-checked': IsChecked === true, 'is-indeterminate': IsChecked === null }"
    :aria-pressed="IsChecked === null ? 'mixed' : IsChecked"
    Content="{x:Bind Content, Mode=OneWay}" ContentTemplate="{x:Bind ContentTemplate}" ContentTransitions="{x:Bind ContentTransitions}" IsEnabled="{x:Bind IsEnabled, Mode=OneWay}" RequestedTheme="{x:Bind RequestedTheme}" Click="OnButtonClick">
    <slot v-if="hasContent" />
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { buttonContentProperty } from './buttonContentRuntime'
export const ToggleButtonContent = defineComponent({ name: 'ToggleButton.Content', __buttonProperty: 'content', setup() { return () => null } })
export default { Content: ToggleButtonContent, ContentTemplate: buttonContentProperty('ToggleButton', 'ContentTemplate'), ContentTransitions: buttonContentProperty('ToggleButton', 'ContentTransitions'), Resources: buttonContentProperty('ToggleButton', 'Resources') }
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, provide, proxyRefs, ref, useAttrs, useSlots, watch } from 'vue'
import Button from './Button.vue'
import { boolValue } from './layout'
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'
import { useUICommand } from './uiCommandRuntime'
import { useButtonContent } from './buttonContentRuntime'

defineOptions({ name: 'ToggleButton', inheritAttrs: false })
type CheckedState = boolean | null
const props = defineProps({ Content: { type: null, default: '' }, ContentTemplate: { type: null, default: undefined }, ContentTransitions: { type: null, default: undefined }, IsChecked: { type: [Boolean, String], default: false }, IsThreeState: { type: [Boolean, String], default: false }, IsEnabled: { type: [Boolean, String], default: true }, RequestedTheme: { type: String, default: 'Default' } })
const emit = defineEmits(['Click', 'Checked', 'Unchecked', 'Indeterminate'])
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
const checkedValue = (value: unknown): CheckedState => value === null || value === '{x:Null}' ? null : boolValue(value)
const sourceChecked = computed(() => checkedValue(resolve(props.IsChecked)))
const localChecked = ref<CheckedState | undefined>()
const IsChecked = computed({ get: () => localChecked.value === undefined ? sourceChecked.value : localChecked.value, set: value => setChecked(checkedValue(value)) })
const sourceIsEnabled = computed(() => boolValue(resolve(props.IsEnabled)))
const localIsEnabled = ref<boolean | undefined>()
const IsEnabled = computed({ get: () => (localIsEnabled.value ?? sourceIsEnabled.value) && (Command.value?.CanExecute?.(CommandParameter.value) ?? true), set: value => { localIsEnabled.value = boolValue(value); updateXamlBinding(props.IsEnabled, localIsEnabled.value, instance) } })
const IsThreeState = computed(() => boolValue(resolve(props.IsThreeState)))
const buttonAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !['Click', 'onClick', 'Checked', 'onChecked', 'Unchecked', 'onUnchecked', 'Indeterminate', 'onIndeterminate'].includes(key))))
const hasContent = computed(() => Boolean(slots.default))
const api = proxyRefs({ IsChecked, IsEnabled, IsThreeState, RequestedTheme, Command, CommandParameter, ContentTemplate, ContentTransitions, Name: computed(() => attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''), Content: computed({ get: () => button.value?.Content ?? Content.value, set: value => { if (button.value) button.value.Content = value; updateXamlBinding(props.Content, value, instance) } }), Element: computed(() => button.value?.Element), IsPressed: computed(() => button.value?.IsPressed ?? false), Focus: () => button.value?.Focus?.() })
defineExpose(api)
function raise(name: 'Click' | 'Checked' | 'Unchecked' | 'Indeterminate', event?: Event) {
  const args = { OriginalSource: api, OriginalEvent: event, Handled: false }
  emit(name, api, args)
  resolveXamlHandler(attrs[name], instance)?.(api, args)
}
function setChecked(value: CheckedState, event?: Event) {
  if (value === IsChecked.value) return
  localChecked.value = value
  updateXamlBinding(props.IsChecked, value, instance)
  raise(value === true ? 'Checked' : value === false ? 'Unchecked' : 'Indeterminate', event)
}
function onClick(_sender: unknown, args: { OriginalEvent?: Event }) {
  if (!IsEnabled.value) return
  const next = IsChecked.value === true ? IsThreeState.value ? null : false : IsChecked.value === false ? true : false
  setChecked(next, args?.OriginalEvent)
  raise('Click', args?.OriginalEvent)
}
watch(sourceChecked, (value, previous) => { const alreadyRaised = localChecked.value !== undefined && localChecked.value === value; localChecked.value = undefined; if (!alreadyRaised && value !== previous) raise(value === true ? 'Checked' : value === false ? 'Unchecked' : 'Indeterminate') })
watch(sourceIsEnabled, () => { localIsEnabled.value = undefined })
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), Content, ContentTemplate, ContentTransitions, IsEnabled, RequestedTheme, OnButtonClick: onClick })
</script>

<style>
.win-toggle-button {
  --ButtonBackground: var(--ToggleButtonBackground);
  --ButtonBackgroundPointerOver: var(--ToggleButtonBackgroundPointerOver);
  --ButtonBackgroundPressed: var(--ToggleButtonBackgroundPressed);
  --ButtonBackgroundDisabled: var(--ToggleButtonBackgroundDisabled);
  --ButtonForeground: var(--ToggleButtonForeground);
  --ButtonForegroundPointerOver: var(--ToggleButtonForegroundPointerOver);
  --ButtonForegroundPressed: var(--ToggleButtonForegroundPressed);
  --ButtonForegroundDisabled: var(--ToggleButtonForegroundDisabled);
  --ButtonBorderBrush: var(--ToggleButtonBorderBrush);
  --ButtonBorderBrushPointerOver: var(--ToggleButtonBorderBrushPointerOver);
  --ButtonBorderBrushPressed: var(--ToggleButtonBorderBrushPressed);
  --ButtonBorderBrushDisabled: var(--ToggleButtonBorderBrushDisabled);
}
.win-toggle-button.is-checked {
  background-clip: border-box;
  --ButtonBackground: var(--ToggleButtonBackgroundChecked);
  --ButtonBackgroundPointerOver: var(--ToggleButtonBackgroundCheckedPointerOver);
  --ButtonBackgroundPressed: var(--ToggleButtonBackgroundCheckedPressed);
  --ButtonBackgroundDisabled: var(--ToggleButtonBackgroundCheckedDisabled);
  --ButtonForeground: var(--ToggleButtonForegroundChecked);
  --ButtonForegroundPointerOver: var(--ToggleButtonForegroundCheckedPointerOver);
  --ButtonForegroundPressed: var(--ToggleButtonForegroundCheckedPressed);
  --ButtonForegroundDisabled: var(--ToggleButtonForegroundCheckedDisabled);
  --ButtonBorderBrush: var(--ToggleButtonBorderBrushChecked);
  --ButtonBorderBrushPointerOver: var(--ToggleButtonBorderBrushCheckedPointerOver);
  --ButtonBorderBrushTop: var(--ButtonBorderBrush);
  --ButtonBorderBrushBottom: var(--AccentButtonBorderBrushDefaultBottom, var(--accent-border-accent));
  --ButtonBorderBrushPressed: var(--ToggleButtonBorderBrushCheckedPressed);
  --ButtonBorderBrushDisabled: var(--ToggleButtonBorderBrushCheckedDisabled);
}
.win-toggle-button.is-checked .win-button-content-presenter { background-clip: border-box !important; }
.win-toggle-button.is-indeterminate {
  --ButtonBackground: var(--ToggleButtonBackgroundIndeterminate);
  --ButtonBackgroundPointerOver: var(--ToggleButtonBackgroundIndeterminatePointerOver);
  --ButtonBackgroundPressed: var(--ToggleButtonBackgroundIndeterminatePressed);
  --ButtonBackgroundDisabled: var(--ToggleButtonBackgroundIndeterminateDisabled);
  --ButtonForeground: var(--ToggleButtonForegroundIndeterminate);
  --ButtonForegroundPointerOver: var(--ToggleButtonForegroundIndeterminatePointerOver);
  --ButtonForegroundPressed: var(--ToggleButtonForegroundIndeterminatePressed);
  --ButtonForegroundDisabled: var(--ToggleButtonForegroundIndeterminateDisabled);
  --ButtonBorderBrush: var(--ToggleButtonBorderBrushIndeterminate);
  --ButtonBorderBrushPointerOver: var(--ToggleButtonBorderBrushIndeterminatePointerOver);
  --ButtonBorderBrushPressed: var(--ToggleButtonBorderBrushIndeterminatePressed);
  --ButtonBorderBrushDisabled: var(--ToggleButtonBorderBrushIndeterminateDisabled);
}
</style>
