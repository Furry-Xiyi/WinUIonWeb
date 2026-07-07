<template>
  <div class="win-split-button" :class="attrs.class" :style="rootStyle" ref="wrap">
    <WinButton class="win-split-main-button" :IsEnabled="!isDisabled" @Click="onClick"><slot>{{ Content }}</slot></WinButton>
    <div class="win-btn-separator"></div>
    <button class="win-btn win-btn-chevron"
            :disabled="isDisabled"
            @click="toggleFlyout"
            @mousedown="onChevronDown"
            @mouseup="onChevronUp"
            @mouseleave="onChevronLeave">
      <span class="icon chevron-animate"
            :class="chevronClass"
            @animationend="onChevronAnimEnd"></span>
    </button>
    <WinMenuFlyout :Open="isOpen" :AnchorRect="anchorRect" :Items="flyoutItems" :Placement="flyoutPlacement" :Theme="Theme" @Close="isOpen = false" @Select="onSelect">
      <slot name="flyout" :close="closeFlyout"></slot>
    </WinMenuFlyout>
  </div>
</template>
<script setup>
import { ref, computed, useAttrs } from 'vue';
import WinButton from './WinButton.vue';
import WinMenuFlyout from './WinMenuFlyout.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  Flyout: { type: [Object, Array], default: () => ({ Items: [] }) },
  IsEnabled: { type: Boolean, default: true },
  Options: { type: Array, default: () => [] },
  Theme: { type: String, default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  Padding: { type: String, default: '' },
  Margin: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});
const emit = defineEmits(['Click', 'Select', 'click', 'select']);
const attrs = useAttrs();
const wrap = ref(null);
const isOpen = ref(false);
const anchorRect = ref(null);
const chevronClass = ref('');
let chevronPressed = false;
let chevronPressDone = false;

const isDisabled = computed(() => props.IsEnabled === false);
const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
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
const sourceItems = computed(() => flyoutDefinition.value.Items?.length ? flyoutDefinition.value.Items : props.Options);
const flyoutItems = computed(() => sourceItems.value.map((item) => {
  if (typeof item === 'string') return { Text: item, Value: item };
  return { ...item, Text: item.Text ?? item.Content ?? item.label ?? String(item) };
}));
const rootStyle = computed(() => {
  const style = {};
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MinHeight !== '') style.minHeight = cssLength(props.MinHeight);
  if (props.Padding) style['--SplitButtonPadding'] = xamlThickness(props.Padding);
  if (props.Margin) style.margin = xamlThickness(props.Margin);
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
  chevronPressed = false;
  if (chevronPressDone) chevronClass.value = 'releasing';
};
const onChevronLeave = () => { chevronPressed = false; };
const onChevronAnimEnd = () => {
  if (chevronClass.value === 'pressing') {
    chevronPressDone = true;
    if (!chevronPressed) chevronClass.value = 'releasing';
  } else if (chevronClass.value === 'releasing') {
    chevronClass.value = '';
    chevronPressDone = false;
  }
};

const toggleFlyout = () => {
  if (isDisabled.value) return;
  if (isOpen.value) { isOpen.value = false; return; }
  const r = wrap.value.getBoundingClientRect();
  anchorRect.value = { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
  isOpen.value = true;
};
const closeFlyout = () => { isOpen.value = false; };
const onClick = (event) => {
  if (isDisabled.value) return;
  emit('Click', event);
  emit('click', event);
};
const onSelect = (item) => {
  emit('Select', item);
  emit('select', item.Value ?? item);
  isOpen.value = false;
};
</script>
<style>
  .win-split-button {
    position: relative;
    display: inline-flex;
    border-radius: 4px;
    overflow: hidden;
    border: none;
    height: 32px;
    background: transparent;
    --ButtonBorderBrush: var(--ctrl-border);
    --ButtonBorderBrushPointerOver: var(--ctrl-border);
    --ButtonBorderBrushPressed: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
    --ButtonBorderBrushBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPointerOverBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPressedBottom: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
    --SplitButtonBorderBrush: var(--ButtonBorderBrush);
    --SplitButtonBorderBrushBottom: var(--ButtonBorderBrushBottom);
  }

    .win-split-button::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 4px;
      border: 1px solid var(--SplitButtonBorderBrush);
      border-bottom-color: var(--SplitButtonBorderBrushBottom);
      pointer-events: none;
    }

    .win-split-button .win-btn {
      border: none;
      border-radius: 0;
      background: var(--ButtonBackground);
      height: 100%;
      position: static;
      padding: var(--SplitButtonPadding, 5px 11px 6px);
      --ButtonBackground: var(--ctrl-fill-default);
      --ButtonBackgroundPointerOver: var(--ctrl-fill-secondary);
      --ButtonBackgroundPressed: var(--ctrl-fill-tertiary);
      --ButtonBorderBrush: transparent;
      --ButtonBorderBrushBottom: transparent;
      --ButtonBorderBrushPointerOver: transparent;
      --ButtonBorderBrushPointerOverBottom: transparent;
    }

    .win-split-button .win-split-main-button {
      min-width: 0;
    }

      .win-split-button .win-btn::after {
        border-color: transparent;
      }

      .win-split-button .win-btn:hover {
        background: var(--ButtonBackgroundPointerOver);
        color: var(--ButtonForeground);
      }

      .win-split-button .win-btn:active {
        background: var(--ButtonBackgroundPressed);
        color: var(--ButtonForegroundPressed);
      }

      .win-split-button .win-btn:active::after {
        border-color: transparent;
      }

    .win-split-button .win-btn-separator {
      width: 1px;
      background: var(--ctrl-border);
      margin: 0;
    }

    .win-split-button .win-btn-chevron {
      padding: 0 8px;
    }

      .win-split-button .win-btn-chevron .icon {
        font-size: 12px;
        display: inline-block;
      }

      .win-split-button .win-btn-chevron:active .icon {
        transform: translateY(1px);
      }

  .win-split-button:has(.win-btn:hover)::after {
    border-color: var(--ButtonBorderBrushPointerOver);
    border-bottom-color: var(--ButtonBorderBrushPointerOverBottom);
  }

  .win-split-button:has(.win-btn:active)::after {
    border-color: var(--ButtonBorderBrushPressed);
    border-bottom-color: var(--ButtonBorderBrushPressedBottom);
  }

  html.theme-dark .win-split-button,
  .example-theme-wrapper.theme-dark .win-split-button {
    --ButtonBorderBrush: rgba(255, 255, 255, 0.05);
    --ButtonBorderBrushPointerOver: rgba(255, 255, 255, 0.05);
    --ButtonBorderBrushBottom: rgba(255, 255, 255, 0.0075);
    --ButtonBorderBrushPointerOverBottom: rgba(255, 255, 255, 0.0075);
  }

  html.theme-dark .win-split-button:has(.win-btn:active),
  .example-theme-wrapper.theme-dark .win-split-button:has(.win-btn:active) {
    --ButtonBorderBrushPressedBottom: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
  }

  html.theme-dark .win-split-button::after,
  .example-theme-wrapper.theme-dark .win-split-button::after {
    border-color: var(--SplitButtonBorderBrush);
    border-bottom-color: var(--SplitButtonBorderBrushBottom);
  }

  @media (prefers-color-scheme: dark) {
    html:not(.theme-light) .win-split-button {
      --ButtonBorderBrush: rgba(255, 255, 255, 0.05);
      --ButtonBorderBrushPointerOver: rgba(255, 255, 255, 0.05);
      --ButtonBorderBrushBottom: rgba(255, 255, 255, 0.0075);
      --ButtonBorderBrushPointerOverBottom: rgba(255, 255, 255, 0.0075);
    }

    html:not(.theme-light) .win-split-button:has(.win-btn:active) {
      --ButtonBorderBrushPressedBottom: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
    }

    html:not(.theme-light) .win-split-button::after {
      border-color: var(--SplitButtonBorderBrush);
      border-bottom-color: var(--SplitButtonBorderBrushBottom);
    }
  }
</style>
