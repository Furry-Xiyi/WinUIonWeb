<template>
  <Border
    v-bind="$attrs"
    class="win-content-presenter"
    :style="contentStyle">
    <slot>{{ resolvedContent }}</slot>
  </Border>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import Border from './Border.vue'
import { alignment } from './layout'
import { resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })

// Border supplies the shared XAML sizing, padding, brush and corner properties.
const props = defineProps({
  Content: { type: [String, Number], default: '' },
  HorizontalContentAlignment: { type: String, default: 'Left' },
  VerticalContentAlignment: { type: String, default: 'Top' }
})

const instance = getCurrentInstance()
const resolvedContent = computed(() => resolveXamlValue(props.Content, instance))
const contentStyle = computed(() => ({
  justifyItems: alignment(resolveXamlValue(props.HorizontalContentAlignment, instance), 'horizontal'),
  alignItems: alignment(resolveXamlValue(props.VerticalContentAlignment, instance), 'vertical')
}))
</script>

<style scoped>
.win-content-presenter {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
</style>
