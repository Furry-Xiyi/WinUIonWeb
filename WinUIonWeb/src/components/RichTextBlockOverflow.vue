<template>
  <div ref="element" v-bind="forwardedAttrs" class="win-rich-text-overflow" :style="[attrs.style,style]" />
</template>
<script setup lang="ts">
import { computed, getCurrentInstance, ref, useAttrs } from 'vue';
import { alignment, cssLength, xamlThickness } from './layout';
import { resolveXamlValue } from './xamlRuntime';
defineOptions({ inheritAttrs:false });
const props = defineProps({ OverflowContentTarget: { type: [String,Object], default: null }, Margin: { type: [String,Number], default: '' }, Padding: { type: [String,Number], default: '' }, Width: { type: [String,Number], default: '' }, Height: { type: [String,Number], default: '' }, MinWidth: { type:[String,Number],default:0 }, MinHeight: { type:[String,Number],default:0 }, MaxWidth: { type:[String,Number],default:'' }, MaxHeight: { type:[String,Number],default:'' }, HorizontalAlignment: { type:String,default:'Stretch' }, VerticalAlignment: { type:String,default:'Stretch' }, Visibility: { type:String,default:'Visible' }, Opacity: { type:[String,Number],default:1 } });
const instance = getCurrentInstance();
const attrs = useAttrs();
const element = ref<HTMLElement | null>(null);
const resolve = (name: keyof typeof props) => resolveXamlValue(props[name],instance);
const forwardedAttrs = computed(() => ({ ...Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'style' && name !== 'AutomationProperties.Name')), 'aria-label': resolveXamlValue(attrs['AutomationProperties.Name'],instance) as string | undefined }));
const style = computed<import('vue').CSSProperties>(() => ({ margin:xamlThickness(resolve('Margin')), padding:xamlThickness(resolve('Padding')), width:cssLength(resolve('Width')), height:cssLength(resolve('Height')), minWidth:cssLength(resolve('MinWidth')), minHeight:cssLength(resolve('MinHeight')), maxWidth:cssLength(resolve('MaxWidth')), maxHeight:cssLength(resolve('MaxHeight')), justifySelf:alignment(resolve('HorizontalAlignment'),'horizontal'), alignSelf:alignment(resolve('VerticalAlignment'),'vertical'), opacity:resolve('Opacity') as import('vue').CSSProperties['opacity'], ...(resolve('Visibility') === 'Collapsed' ? { display:'none' } : {}) }));
defineExpose({ Element: element, get OverflowContentTarget() { return resolveXamlValue(props.OverflowContentTarget,instance); } });
</script>
<style>
.win-rich-text-overflow { box-sizing: border-box; min-width: 0; min-height: 0; overflow: hidden; color: var(--TextFillColorPrimaryBrush,var(--text-primary)); font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable Text', 'Segoe UI', sans-serif); font-size: 14px; line-height: 20px; user-select: text; }
.win-rich-text-overflow p { margin: 0; }
.win-rich-text-overflow::selection, .win-rich-text-overflow *::selection { background: var(--rich-text-selection, Highlight); color: HighlightText; }
</style>
