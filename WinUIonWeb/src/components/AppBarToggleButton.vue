<template>
  <ButtonPresenter />
</template>

<script lang="ts">
import { appBarProperty } from './appBarRuntime'
export const AppBarToggleButtonIcon = appBarProperty('AppBarToggleButton', 'Icon')
export const AppBarToggleButtonContent = appBarProperty('AppBarToggleButton', 'Content')
export const AppBarToggleButtonKeyboardAccelerators = appBarProperty('AppBarToggleButton', 'KeyboardAccelerators')
export default { Icon: AppBarToggleButtonIcon, Content: AppBarToggleButtonContent, KeyboardAccelerators: AppBarToggleButtonKeyboardAccelerators }
</script>

<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, h, inject, provide, ref, unref, useAttrs, useSlots, watch } from 'vue'
import AppBarButton from './AppBarButton.vue'
import { appBarBoolean, appBarToggleContextKey } from './appBarRuntime'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlControlIdentityKey, xamlScopeKey } from './xamlRuntime'

defineOptions({ name: 'AppBarToggleButton', inheritAttrs: false })
type CheckedValue = boolean | null
const props = defineProps({ IsChecked: { type: [Boolean, String], default: false }, IsThreeState: { type: [Boolean, String], default: false } })
const emit = defineEmits(['Click', 'Checked', 'Unchecked', 'Indeterminate', 'update:IsChecked', 'update:IsThreeState'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const buttonRef = ref<Record<string, any> | null>(null)
const normalizeChecked = (input: unknown): CheckedValue => input === null || input === '{x:Null}' ? null : appBarBoolean(input)
const resolve = (input: unknown) => resolveXamlValue(input, instance)
const checkedValue = ref<CheckedValue>(normalizeChecked(resolve(props.IsChecked)))
const threeStateOverride = ref<unknown>(undefined)
const isThreeState = computed({ get: () => threeStateOverride.value === undefined ? appBarBoolean(resolve(props.IsThreeState)) : appBarBoolean(threeStateOverride.value), set: next => { threeStateOverride.value = next; updateXamlBinding(props.IsThreeState, next, instance); emit('update:IsThreeState', next) } })
const buttonAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !/^(Click|Checked|Unchecked|Indeterminate)$/.test(key))))
const forwardedProperties = ['Label', 'Icon', 'Content', 'Command', 'CommandParameter', 'IsCompact', 'LabelPosition', 'DynamicOverflowOrder', 'IsEnabled', 'IsTabStop', 'Visibility', 'AllowFocusOnInteraction', 'AllowFocusWhenDisabled', 'KeyboardAccelerators', 'KeyboardAcceleratorTextOverride', 'KeyboardAcceleratorPlacementMode', 'Background', 'Foreground', 'BorderBrush', 'BorderThickness', 'CornerRadius', 'Padding', 'Margin', 'Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight', 'FontFamily', 'FontWeight', 'FontSize', 'HorizontalAlignment', 'VerticalAlignment', 'HorizontalContentAlignment', 'VerticalContentAlignment', 'FlowDirection', 'Style', 'AutomationProperties.Name', 'ToolTipService.ToolTip']
const forwarded = Object.fromEntries(forwardedProperties.map(name => [name, computed({ get: () => buttonRef.value?.[name] ?? resolve(attrs[name]), set: next => { if (buttonRef.value) buttonRef.value[name] = next } })]))
const publicProperties: Record<PropertyKey, any> = { ...forwarded, [xamlControlIdentityKey]: true }
const eventSender = new Proxy(publicProperties, {
  get: (target, key) => unref(Reflect.get(target, key)),
  set: (target, key, next) => { const property = Reflect.get(target, key); if (property && typeof property === 'object' && 'value' in property) property.value = next; return true }
})
const sender = () => eventSender
const dispatch = (name: 'Click' | 'Checked' | 'Unchecked' | 'Indeterminate', args: unknown) => {
  emit(name, sender(), args)
  if (attrs[name] !== undefined && !instance?.vnode.props?.[`on${name}`]) resolveXamlHandler(attrs[name], instance)?.(sender(), args)
}
const setChecked = (next: CheckedValue, originalEvent?: Event, writeBinding = true) => {
  if (checkedValue.value === next) return
  checkedValue.value = next
  if (writeBinding) { updateXamlBinding(props.IsChecked, next, instance); emit('update:IsChecked', next) }
  dispatch(next === true ? 'Checked' : next === false ? 'Unchecked' : 'Indeterminate', { OriginalSource: sender(), Handled: false, OriginalEvent: originalEvent })
}
const isChecked = computed({ get: () => checkedValue.value, set: next => setChecked(normalizeChecked(next)) })
watch(() => resolve(props.IsChecked), next => setChecked(normalizeChecked(next), undefined, false))
watch(() => resolve(props.IsThreeState), () => { threeStateOverride.value = undefined })
const toggle = (event: MouseEvent) => {
  const next = checkedValue.value === true ? (isThreeState.value ? null : false) : checkedValue.value === null ? false : true
  setChecked(next, event)
}
const onButtonClick = (_sender: unknown, args: unknown) => dispatch('Click', args)
provide(appBarToggleContextKey, { checked: isChecked, toggle, sender })
provide(xamlScopeKey, { ...inject<Record<string, unknown>>(xamlScopeKey, {}), OnAppBarButtonClick: onButtonClick })
const ButtonPresenter = defineComponent({ name: 'AppBarToggleButtonTemplate', setup() {
  const owner = getCurrentInstance()
  const register = (control: unknown) => { buttonRef.value = control as Record<string, any> | null }
  return () => normalizeXamlNodes([h(AppBarButton, { ...buttonAttrs.value, Click: 'OnAppBarButtonClick', ref: register }, { default: () => slots.default?.() ?? [] })], owner)[0] ?? null
} })
Object.assign(publicProperties, { IsChecked: isChecked, IsThreeState: isThreeState,
  Name: computed(() => String(resolve(attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''))),
  IsInOverflow: computed(() => buttonRef.value?.IsInOverflow ?? false),
  ActualWidth: computed(() => buttonRef.value?.ActualWidth ?? 0), ActualHeight: computed(() => buttonRef.value?.ActualHeight ?? 0),
  Focus: (state?: unknown) => buttonRef.value?.Focus?.(state) ?? false, $el: computed(() => buttonRef.value?.$el) })
defineExpose(eventSender)
</script>
