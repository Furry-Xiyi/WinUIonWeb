<script lang="ts">
import { ImageSourceProperty } from './imageSource'
export default { Source: ImageSourceProperty }
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, onUpdated, ref, useAttrs, watch } from 'vue'
import Image from './Image.vue'
import { iconElementProps, useIconElement } from './iconElementRuntime'
import { updateXamlBinding } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({ ...iconElementProps, Source: { type: [String, Object], default: '' } })
const attrs = useAttrs()
const instance = getCurrentInstance()
const icon = useIconElement(props, attrs, instance)
const sourceOverride = ref<unknown>()
watch(() => icon.resolve(props.Source), () => { sourceOverride.value = undefined })
const imageRef = ref<{ Source: unknown; ActualWidth: number; ActualHeight: number; $el?: HTMLElement } | null>(null)
const imageProps = computed(() => ({
  ...icon.rootAttrs.value,
  ...Object.fromEntries(Object.keys(iconElementProps).filter(name => !['Foreground', 'FlowDirection', 'RequestedTheme'].includes(name)).map(name => [name, icon.read(name)])),
  Source: sourceOverride.value === undefined ? props.Source : sourceOverride.value
}))
const bindElement = () => { icon.Element.value = imageRef.value?.$el ?? instance?.subTree.el ?? null }
onMounted(bindElement)
onUpdated(bindElement)
Object.defineProperty(icon.api, 'Source', {
  enumerable: true, configurable: true,
  get: () => imageRef.value?.Source ?? sourceOverride.value ?? icon.resolve(props.Source),
  set: (value: unknown) => {
    sourceOverride.value = value
    if (imageRef.value) imageRef.value.Source = value
    updateXamlBinding(props.Source, value, instance)
  }
})
defineExpose(icon.api)
</script>

<template>
  <Image ref="imageRef" v-bind="imageProps" class="win-icon-element win-image-icon" :class="attrs.class" :style="[attrs.style, icon.layoutStyle.value]">
    <slot v-if="sourceOverride === undefined" />
  </Image>
</template>
