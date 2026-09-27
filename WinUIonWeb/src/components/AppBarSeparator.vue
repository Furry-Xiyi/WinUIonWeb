<template>
  <div v-if="visible" ref="rootRef" v-bind="attrs" class="win-appbar-separator" :class="{ 'is-compact': compact, 'is-overflow': inOverflow }"
    :style="separatorStyle" role="separator" :aria-orientation="inOverflow ? 'horizontal' : 'vertical'" :tabindex="isTabStop ? 0 : undefined"
    :data-application-view-state="inOverflow ? 'Overflow' : compact ? 'Compact' : 'FullSize'">
    <span class="appbar-separator-rectangle" aria-hidden="true"></span>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, ref, shallowReactive, useAttrs, watch, type CSSProperties } from 'vue'
import { appBarBoolean, commandBarContextKey } from './appBarRuntime'
import { frameworkLayoutStyle } from './frameworkLayout'
import { cssLength, xamlThickness } from './layout'
import { resolveXamlValue, updateXamlBinding } from './xamlRuntime'
import './appBarStyles.css'

defineOptions({ name: 'AppBarSeparator', inheritAttrs: false })
const props = defineProps({
  IsCompact: { type: [Boolean, String], default: undefined }, DynamicOverflowOrder: { type: [Number, String], default: 0 },
  IsTabStop: { type: [Boolean, String], default: false }, Visibility: { type: String, default: 'Visible' }, IsEnabled: { type: [Boolean, String], default: true },
  Foreground: { default: undefined }, Padding: { type: [String, Number], default: undefined }, Margin: { type: [String, Number], default: undefined },
  Width: { type: [String, Number], default: undefined }, Height: { type: [String, Number], default: undefined },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: undefined }, MaxHeight: { type: [String, Number], default: undefined },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' }
})
const emit = defineEmits(['update:IsCompact', 'update:DynamicOverflowOrder', 'update:IsTabStop', 'update:Visibility', 'update:IsEnabled', 'update:Foreground', 'update:Padding', 'update:Margin', 'update:Width', 'update:Height', 'update:MinWidth', 'update:MinHeight', 'update:MaxWidth', 'update:MaxHeight', 'update:HorizontalAlignment', 'update:VerticalAlignment'])
const attrs = useAttrs()
const instance = getCurrentInstance()
const barContext = inject(commandBarContextKey, null)
const rootRef = ref<HTMLElement | null>(null)
const overrides = shallowReactive<Record<string, unknown>>({})
const resolve = (input: unknown) => resolveXamlValue(input, instance)
const value = (name: keyof typeof props) => name in overrides ? overrides[name] : resolve(props[name])
const inOverflow = computed(() => barContext?.isInOverflow.value ?? false)
const compact = computed(() => value('IsCompact') === undefined ? barContext?.compact.value ?? false : appBarBoolean(value('IsCompact')))
const visible = computed(() => value('Visibility') !== 'Collapsed')
const isTabStop = computed(() => appBarBoolean(value('IsTabStop')))
for (const name of Object.keys(props) as (keyof typeof props)[]) watch(() => resolve(props[name]), () => { delete overrides[name] })
const separatorStyle = computed<CSSProperties>(() => ({
  ...frameworkLayoutStyle(props, instance), margin: xamlThickness(value('Margin')) || undefined,
  width: cssLength(value('Width')) || undefined, height: cssLength(value('Height')) || undefined,
  minWidth: cssLength(value('MinWidth')) || undefined, minHeight: cssLength(value('MinHeight')) || undefined,
  maxWidth: cssLength(value('MaxWidth')) || undefined, maxHeight: cssLength(value('MaxHeight')) || undefined,
  '--AppBarSeparatorForeground': value('Foreground') || undefined,
  '--AppBarSeparatorPadding': xamlThickness(value('Padding')) || undefined
} as CSSProperties))
const dependencies = Object.fromEntries((Object.keys(props) as (keyof typeof props)[]).map(name => [name, computed({ get: () => value(name), set: next => { overrides[name] = next; updateXamlBinding(props[name], next, instance); emit(`update:${name}` as 'update:IsCompact', next) } })]))
defineExpose({ ...dependencies, Name: computed(() => String(resolve(attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''))), IsInOverflow: inOverflow, $el: rootRef })
</script>
