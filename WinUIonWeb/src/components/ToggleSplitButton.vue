<template>
  <SplitButton ref="split" v-bind="splitAttrs" class="win-toggle-split-button" :aria-pressed="IsChecked"
    IsEnabled="{x:Bind IsEnabled}" Content="{x:Bind Content}" ContentTemplate="{x:Bind ContentTemplate}" ContentTransitions="{x:Bind ContentTransitions}" Flyout="{x:Bind Flyout}" RequestedTheme="{x:Bind RequestedTheme}" Click="OnSplitClick">
    <slot v-if="hasContent" />
  </SplitButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { buttonContentProperty } from './buttonContentRuntime'
export const ToggleSplitButtonFlyout = defineComponent({ name: 'ToggleSplitButton.Flyout', __splitButtonProperty: 'flyout', setup() { return () => null } })
export const ToggleSplitButtonContent = defineComponent({ name: 'ToggleSplitButton.Content', __splitButtonProperty: 'content', setup() { return () => null } })
export default { Flyout: ToggleSplitButtonFlyout, Content: ToggleSplitButtonContent, ContentTemplate: buttonContentProperty('ToggleSplitButton', 'ContentTemplate'), ContentTransitions: buttonContentProperty('ToggleSplitButton', 'ContentTransitions'), Resources: buttonContentProperty('ToggleSplitButton', 'Resources') }
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, provide, proxyRefs, ref, useAttrs, useSlots, watch } from 'vue'
import SplitButton from './SplitButton.vue'
import { boolValue } from './layout'
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'
import { useUICommand } from './uiCommandRuntime'
import { useButtonContent } from './buttonContentRuntime'

defineOptions({ name: 'ToggleSplitButton', inheritAttrs: false })
const props = defineProps({ Content: { type: null, default: '' }, ContentTemplate: { type: null, default: undefined }, ContentTransitions: { type: null, default: undefined }, Flyout: { type: null, default: undefined }, IsChecked: { type: [Boolean, String], default: false }, IsEnabled: { type: [Boolean, String], default: true }, RequestedTheme: { type: String, default: 'Default' } })
const emit = defineEmits(['Click', 'IsCheckedChanged'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const split = ref<any>(null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const { ContentTemplate, ContentTransitions } = useButtonContent(props, () => slots.default?.() ?? [], instance)
const Command = useUICommand(() => resolve(attrs.Command))
const CommandParameter = computed(() => resolve(attrs.CommandParameter))
const Content = computed(() => resolve(props.Content))
const sourceRequestedTheme = computed(() => String(resolve(props.RequestedTheme)))
const localRequestedTheme = ref<string | undefined>()
watch(sourceRequestedTheme, () => { localRequestedTheme.value = undefined })
const RequestedTheme = computed({ get: () => localRequestedTheme.value ?? sourceRequestedTheme.value, set: value => { localRequestedTheme.value = value; updateXamlBinding(props.RequestedTheme, value, instance) } })
const Flyout = computed(() => resolve(props.Flyout))
const sourceChecked = computed(() => boolValue(resolve(props.IsChecked)))
const localChecked = ref<boolean | undefined>()
const IsChecked = computed({ get: () => localChecked.value ?? sourceChecked.value, set: value => setChecked(boolValue(value)) })
const sourceEnabled = computed(() => boolValue(resolve(props.IsEnabled)))
const localEnabled = ref<boolean | undefined>()
const IsEnabled = computed({ get: () => (localEnabled.value ?? sourceEnabled.value) && (Command.value?.CanExecute?.(CommandParameter.value) ?? true), set: value => { localEnabled.value = boolValue(value); updateXamlBinding(props.IsEnabled, localEnabled.value, instance) } })
const splitAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !['Click', 'onClick', 'IsCheckedChanged', 'onIsCheckedChanged'].includes(key))))
const hasContent = computed(() => Boolean(slots.default))
const api = proxyRefs({ IsChecked, IsEnabled, RequestedTheme, ContentTemplate, ContentTransitions, Name: computed(() => attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''), Content: computed({ get: () => split.value?.Content ?? Content.value, set: value => { if (split.value) split.value.Content = value; updateXamlBinding(props.Content, value, instance) } }), Flyout: computed({ get: () => split.value?.Flyout, set: value => { if (split.value) split.value.Flyout = value; updateXamlBinding(props.Flyout, value, instance) } }), Element: computed(() => split.value?.Element), Focus: () => split.value?.Focus?.() })
defineExpose(api)
function raiseChanged(event?: Event) {
  const args = { OriginalSource: api, OriginalEvent: event }
  emit('IsCheckedChanged', api, args)
  resolveXamlHandler(attrs.IsCheckedChanged, instance)?.(api, args)
}
function setChecked(value: boolean, event?: Event) {
  if (value === IsChecked.value) return
  localChecked.value = value
  updateXamlBinding(props.IsChecked, value, instance)
  raiseChanged(event)
}
function onSplitClick(_sender: unknown, args: { OriginalEvent?: Event }) {
  const eventArgs = { OriginalSource: api, OriginalEvent: args?.OriginalEvent }
  emit('Click', api, eventArgs)
  resolveXamlHandler(attrs.Click, instance)?.(api, eventArgs)
}
watch(sourceChecked, (value, previous) => { const alreadyRaised = localChecked.value !== undefined && localChecked.value === value; localChecked.value = undefined; if (!alreadyRaised && value !== previous) raiseChanged() })
watch(sourceEnabled, () => { localEnabled.value = undefined })
provide('toggleSplitButtonState', { IsChecked, Invoke: (event?: Event) => setChecked(!IsChecked.value, event) })
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), IsEnabled, Content, ContentTemplate, ContentTransitions, Flyout, RequestedTheme, OnSplitClick: onSplitClick })
</script>
