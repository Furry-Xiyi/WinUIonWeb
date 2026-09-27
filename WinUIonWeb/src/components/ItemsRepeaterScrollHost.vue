<template>
  <div class="win-items-repeater-scroll-host" :style="hostStyle" v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// ItemsRepeaterScrollHost is a thin coordination layer.  Its only job in WinUI
// is to give an ItemsRepeater the ScrollViewer it lives in so the repeater can
// seed its anchor from the current scroll position; it renders no extra visual
// and adds no layout of its own.  Being a ContentControl with the default
// Stretch alignment, it fills the cell it is placed in, so the wrapper here is
// stretched to its parent rather than being sized by the ScrollViewer inside —
// otherwise a percentage-sized ScrollViewer would measure against an
// indefinite wrapper and collapse.
import { computed, getCurrentInstance } from 'vue'
import { alignment, cssLength, xamlThickness } from './layout'
import { resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  HorizontalAnchorRatio: { type: [String, Number], default: Number.NaN },
  VerticalAnchorRatio: { type: [String, Number], default: Number.NaN },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' },
  Visibility: { type: String, default: 'Visible' }
})
const instance = getCurrentInstance()
const hostStyle = computed(() => {
  const width = cssLength(resolveXamlValue(props.Width, instance))
  const height = cssLength(resolveXamlValue(props.Height, instance))
  const style: Record<string, string | undefined> = {
    minWidth: '0',
    minHeight: '0',
    boxSizing: 'border-box',
    width: width || undefined,
    height: height || undefined,
    margin: xamlThickness(resolveXamlValue(props.Margin, instance)) || undefined
  }
  const horizontal = resolveXamlValue(props.HorizontalAlignment, instance) ?? props.HorizontalAlignment
  const vertical = resolveXamlValue(props.VerticalAlignment, instance) ?? props.VerticalAlignment
  if (horizontal) style.justifySelf = alignment(horizontal, 'horizontal')
  if (vertical) style.alignSelf = alignment(vertical, 'vertical')
  // Stretch on the flex main axis needs the grow/shrink pair, since
  // align-self only fills the cross axis.
  if (horizontal === 'Stretch' && !width) {
    style.flexGrow = '1'
    style.flexShrink = '1'
    style.flexBasis = '0%'
  }
  const visibility = resolveXamlValue(props.Visibility, instance) ?? props.Visibility
  if (visibility === 'Collapsed') style.display = 'none'
  else if (visibility === 'Hidden') style.visibility = 'hidden'
  return style
})
</script>

<style scoped>
.win-items-repeater-scroll-host {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
}

.win-items-repeater-scroll-host > :deep(*) {
  min-width: 0;
  min-height: 0;
}
</style>
