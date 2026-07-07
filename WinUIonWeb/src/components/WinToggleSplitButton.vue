<template>
  <div class="win-split-button" :class="[{ 'toggled-on': checkedState }, attrs.class]" :style="attrs.style" ref="wrap">
    <WinButton class="win-tsb-main" :class="{ 'toggled-on': checkedState }" :IsEnabled="!isDisabled" @Click="toggle">
      <slot>{{ Content }}</slot>
    </WinButton>
    <div class="win-btn-separator"></div>
    <button class="win-btn win-btn-chevron" :class="{ 'toggled-on': checkedState }"
            :disabled="isDisabled"
            @click="toggleFlyout"
            @mousedown="onChevronDown"
            @mouseup="onChevronUp"
            @mouseleave="onChevronLeave">
      <span class="icon chevron-animate"
            :class="chevronClass"
            @animationend="onChevronAnimEnd"></span>
    </button>
    <WinMenuFlyout :Open="isOpen" :AnchorRect="anchorRect" :Items="flyoutItems" :Placement="flyoutPlacement" @Close="isOpen = false" @Select="onSelect">
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
  IsChecked: { type: Boolean, default: undefined },
  Flyout: { type: [Object, Array], default: () => ({ Items: [] }) },
  IsEnabled: { type: Boolean, default: true },
  modelValue: { type: Boolean, default: false },
  options: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue', 'update:IsChecked', 'Click', 'IsCheckedChanged', 'Select', 'click', 'optionClick']);
const attrs = useAttrs();

const wrap = ref(null);
const isOpen = ref(false);
const anchorRect = ref(null);
const chevronClass = ref('');
let chevronPressed = false;
let chevronPressDone = false;

const checkedState = computed(() => props.IsChecked ?? props.modelValue);
const isDisabled = computed(() => props.IsEnabled === false);
const flyoutDefinition = computed(() => Array.isArray(props.Flyout) ? { Items: props.Flyout } : props.Flyout || { Items: [] });
const flyoutPlacement = computed(() => flyoutDefinition.value.Placement || 'Bottom');
const sourceItems = computed(() => flyoutDefinition.value.Items?.length ? flyoutDefinition.value.Items : props.options);
const flyoutItems = computed(() => sourceItems.value.map((item, idx) => {
  if (typeof item === 'string') return { Text: item, Value: idx };
  return { ...item, Text: item.Text ?? item.Content ?? item.label ?? String(item), Value: item.Value ?? idx };
}));

const toggle = () => {
  if (isDisabled.value) return;
  const next = !checkedState.value;
  emit('update:modelValue', next);
  emit('update:IsChecked', next);
  emit('Click');
  emit('click');
  emit('IsCheckedChanged', { IsChecked: next });
};

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

const onSelect = (item) => {
  emit('Select', item);
  emit('optionClick', item.Value);
  isOpen.value = false;
};
</script>

<style scoped>
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

  :global(html.theme-dark) .win-split-button,
  :global(.example-theme-wrapper.theme-dark) .win-split-button {
    --ButtonBorderBrush: rgba(255, 255, 255, 0.05);
    --ButtonBorderBrushPointerOver: rgba(255, 255, 255, 0.05);
    --ButtonBorderBrushBottom: rgba(255, 255, 255, 0.0075);
    --ButtonBorderBrushPointerOverBottom: rgba(255, 255, 255, 0.0075);
  }

  :global(html.theme-dark) .win-split-button:has(.win-btn:active),
  :global(.example-theme-wrapper.theme-dark) .win-split-button:has(.win-btn:active) {
    --ButtonBorderBrushPressedBottom: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
  }

  @media (prefers-color-scheme: dark) {
    :global(html:not(.theme-light)) .win-split-button {
      --ButtonBorderBrush: rgba(255, 255, 255, 0.05);
      --ButtonBorderBrushPointerOver: rgba(255, 255, 255, 0.05);
      --ButtonBorderBrushBottom: rgba(255, 255, 255, 0.0075);
      --ButtonBorderBrushPointerOverBottom: rgba(255, 255, 255, 0.0075);
    }

    :global(html:not(.theme-light)) .win-split-button:has(.win-btn:active) {
      --ButtonBorderBrushPressedBottom: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
    }
  }

  .win-split-button.toggled-on {
    background: var(--accent-base);
    --ButtonBorderBrush: var(--accent-border);
    --ButtonBorderBrushPointerOver: var(--accent-border);
    --ButtonBorderBrushPressed: transparent;
    --ButtonBorderBrushBottom: var(--accent-border-accent);
    --ButtonBorderBrushPointerOverBottom: var(--accent-border-accent);
    --ButtonBorderBrushPressedBottom: transparent;
  }

    .win-split-button.toggled-on::after {
      border-color: var(--SplitButtonBorderBrush);
      border-bottom-color: var(--SplitButtonBorderBrushBottom);
    }

  .win-tsb-main.toggled-on,
  .win-btn-chevron.toggled-on {
    color: var(--accent-text);
    --ButtonBackground: transparent;
    --ButtonBackgroundPointerOver: rgba(255, 255, 255, 0.08);
    --ButtonBackgroundPressed: rgba(255, 255, 255, 0.04);
    --ButtonForegroundPressed: var(--accent-text-secondary);
  }

    .win-tsb-main.toggled-on:hover,
    .win-btn-chevron.toggled-on:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .win-tsb-main.toggled-on:active,
    .win-btn-chevron.toggled-on:active {
      background: rgba(255, 255, 255, 0.04);
      color: var(--accent-text-secondary);
    }

  .win-split-button.toggled-on .win-btn-separator {
    background: var(--accent-text-secondary);
  }
</style>
