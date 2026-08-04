<template>
  <div class="win-dropdown-btn-wrap" ref="wrap">
    <button
      v-bind="buttonAttrs"
      class="win-btn DefaultButtonStyle win-dropdown-btn"
      :class="attrs.class"
      :style="buttonStyle"
      :disabled="isDisabled"
      @click="toggle"
      @mousedown="onChevronDown"
      @mouseup="onChevronUp"
      @mouseleave="onChevronLeave">
      <span class="win-dropdown-content"><slot>{{ Content }}</slot></span>
      <span class="icon win-dd-chevron chevron-animate"
            :class="[chevronClass, { open: isOpen }]"
            aria-hidden="true"
            @animationend="onChevronAnimEnd"></span>
    </button>
    <WinMenuFlyout
      :Open="isOpen"
      :AnchorRect="anchorRect"
      :Items="flyoutItems"
      :Placement="flyoutPlacement"
      @Close="isOpen = false"
      @Select="onSelect" />
  </div>
</template>
<script setup>
import { computed, ref, useAttrs } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  Flyout: { type: [Object, Array], default: () => ({ Items: [] }) },
  IsEnabled: { type: Boolean, default: true },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: String, default: '' },
  Padding: { type: String, default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const emit = defineEmits(['Click', 'Select']);
const attrs = useAttrs();
const wrap = ref(null);
const isOpen = ref(false);
const anchorRect = ref(null);
const chevronClass = ref('');
let chevronPressed = false;
let chevronPressDone = false;

const buttonAttrs = computed(() => {
  const { class: _class, style: _style, disabled: _disabled, ...rest } = attrs;
  return rest;
});

const isDisabled = computed(() => props.IsEnabled === false);

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (!value) return '';
  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return value;
};

const flyoutDefinition = computed(() => Array.isArray(props.Flyout) ? { Items: props.Flyout } : props.Flyout || { Items: [] });
const flyoutPlacement = computed(() => flyoutDefinition.value.Placement || 'Bottom');
const flyoutItems = computed(() => (flyoutDefinition.value.Items || []).map((item) => {
  if (typeof item === 'string') return { Text: item, Value: item };
  return { ...item, Text: item.Text ?? item.Content ?? item.label ?? String(item) };
}));

const buttonStyle = computed(() => {
  const style = {};
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MinHeight !== '') style.minHeight = cssLength(props.MinHeight);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.MaxHeight !== '') style.maxHeight = cssLength(props.MaxHeight);
  if (props.Margin) style.margin = xamlThickness(props.Margin);
  if (props.Padding) style.padding = xamlThickness(props.Padding);
  if (props.HorizontalAlignment) style.justifySelf = props.HorizontalAlignment.toLowerCase();
  if (props.VerticalAlignment) style.alignSelf = props.VerticalAlignment.toLowerCase();
  return [attrs.style, style];
});

const onChevronDown = () => {
  chevronPressed = true;
  chevronPressDone = false;
  chevronClass.value = 'pressing';
};
const onChevronUp = () => {
  if (!chevronPressed) return;
  releaseChevron();
};
const releaseChevron = () => {
  if (chevronClass.value === '') return;
  chevronPressed = false;
  if (chevronPressDone) chevronClass.value = 'releasing';
};
const onChevronLeave = releaseChevron;
const onChevronAnimEnd = (event) => {
  if (chevronClass.value === 'pressing' && event.animationName === 'chevron-press') {
    chevronPressDone = true;
    if (!chevronPressed) chevronClass.value = 'releasing';
  } else if (chevronClass.value === 'releasing' && event.animationName === 'chevron-release') {
    chevronClass.value = '';
    chevronPressDone = false;
  }
};

const toggle = () => {
  if (isDisabled.value) return;
  emit('Click');
  if (isOpen.value) { isOpen.value = false; return; }
  const r = wrap.value.getBoundingClientRect();
  anchorRect.value = { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
  isOpen.value = true;
};
const onSelect = (item) => { emit('Select', item); isOpen.value = false; };
</script>
<style>
  .win-dd-chevron {
    font-size: 0;
  }

  .win-dropdown-btn-wrap {
    position: relative;
    display: inline-flex;
  }

  .win-dropdown-btn {
    gap: 8px;
  }

  .win-dropdown-content {
    display: inline-flex;
    align-items: center;
    min-width: 0;
  }
</style>
