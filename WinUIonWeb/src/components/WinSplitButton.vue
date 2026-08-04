<template>
  <div class="win-split-button" :class="[attrs.class, { 'is-open': isOpen }]" :style="rootStyle" ref="wrap">
    <slot name="main" :isDisabled="isDisabled" :onClick="onClick">
      <WinButton class="win-split-main-button" :IsEnabled="!isDisabled" @Click="onClick"><slot>{{ Content }}</slot></WinButton>
    </slot>
    <div class="win-btn-separator"></div>
    <WinButton class="win-btn-chevron"
            :IsEnabled="!isDisabled"
            Width="35"
            MinWidth="35"
            Padding="0,0,12,0"
            @Click="toggleFlyout"
            @mousedown="onChevronDown"
            @mouseup="onChevronUp"
            @mouseleave="releaseChevron"
            @pointercancel="releaseChevron"
            @lostpointercapture="releaseChevron"
            @blur="releaseChevron">
      <span class="icon chevron-animate"
            :class="chevronClass"
            @animationend="onChevronAnimEnd"></span>
    </WinButton>
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
  releaseChevron();
};
const releaseChevron = () => {
  if (!chevronPressed && chevronClass.value !== 'pressing') return;
  chevronPressed = false;
  if (chevronPressDone) {
    chevronClass.value = 'releasing';
  }
};
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
    min-height: 32px;
    height: auto;
    background: transparent;
    --SplitButtonPadding: 6px 11px 7px;
    --ButtonBorderBrush: var(--ctrl-border);
    --ButtonBorderBrushTop: var(--ButtonBorderBrush);
    --ButtonBorderBrushPointerOver: var(--ctrl-border);
    --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushPointerOver);
    --ButtonBorderBrushPressed: var(--ctrl-border);
    --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushDisabled: var(--ctrl-border);
    --ButtonBorderBrushDisabledTop: var(--ButtonBorderBrushDisabled);
    --ButtonBorderBrushBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPointerOverBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPressedBottom: var(--ctrl-border);
    --ButtonBorderBrushDisabledBottom: var(--ctrl-border);
    --SplitButtonBorderBrush: var(--ButtonBorderBrush);
    --SplitButtonBorderBrushTop: var(--ButtonBorderBrushTop);
    --SplitButtonBorderBrushBottom: var(--ButtonBorderBrushBottom);
    --SplitButtonBorderBrushDivider: var(--ctrl-border);
    --SplitButtonBorderBrushCheckedDivider: rgba(0, 0, 0, 0.2157);
  }

  .win-split-button.is-checked {
    --ButtonBorderBrush: var(--accent-border);
    --ButtonBorderBrushTop: var(--accent-border);
    --ButtonBorderBrushPointerOver: var(--accent-border);
    --ButtonBorderBrushPointerOverTop: var(--accent-border);
    --ButtonBorderBrushPressed: transparent;
    --ButtonBorderBrushPressedTop: transparent;
    --ButtonBorderBrushBottom: var(--accent-border-accent);
    --ButtonBorderBrushPointerOverBottom: var(--accent-border-accent);
    --ButtonBorderBrushPressedBottom: transparent;
    --SplitButtonBorderBrushDivider: var(--SplitButtonBorderBrushCheckedDivider);
  }

  .win-split-button.is-checked .win-btn:not(.win-toggle-button) {
    --ButtonBackground: var(--accent-base);
    --ButtonBackgroundPointerOver: var(--accent-hover);
    --ButtonBackgroundPressed: var(--accent-pressed);
    --ButtonForeground: var(--accent-text);
    --ButtonForegroundPointerOver: var(--accent-text);
    --ButtonForegroundPressed: var(--accent-text-secondary);
  }

    .win-split-button::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 4px;
      border: 1px solid var(--SplitButtonBorderBrush);
      border-top-color: var(--SplitButtonBorderBrushTop);
      border-bottom-color: var(--SplitButtonBorderBrushBottom);
      pointer-events: none;
    }

    .win-split-button .win-btn {
      border: none;
      border-radius: 0;
      min-height: 32px;
      position: static;
      padding: var(--SplitButtonPadding);
    }

    .win-split-button .win-btn:not(.win-toggle-button) {
      --ButtonBackground: var(--ctrl-fill-default);
      --ButtonBackgroundPointerOver: var(--ctrl-fill-secondary);
      --ButtonBackgroundPressed: var(--ctrl-fill-tertiary);
    }

    .win-split-button .win-btn:not(.win-toggle-button) {
      --ButtonBorderBrush: transparent;
      --ButtonBorderBrushTop: transparent;
      --ButtonBorderBrushBottom: transparent;
      --ButtonBorderBrushPointerOver: transparent;
      --ButtonBorderBrushPointerOverTop: transparent;
      --ButtonBorderBrushPointerOverBottom: transparent;
      --ButtonBorderBrushPressed: transparent;
      --ButtonBorderBrushPressedTop: transparent;
      --ButtonBorderBrushPressedBottom: transparent;
    }

    .win-split-button .win-split-main-button {
      min-width: 35px;
    }

      .win-split-button .win-btn::after {
        border-color: transparent;
        border-top-color: transparent;
        border-bottom-color: transparent;
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
      background: var(--SplitButtonBorderBrushDivider);
      margin: 0;
    }

    .win-split-button .win-btn-chevron {
      flex: 0 0 35px;
      width: 35px;
      min-width: 35px;
      padding: 0 12px 0 0;
      justify-content: flex-end;
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
    border-top-color: var(--ButtonBorderBrushPointerOverTop);
    border-bottom-color: var(--ButtonBorderBrushPointerOverBottom);
  }

  .win-split-button:has(.win-btn:active)::after {
    border-color: var(--ButtonBorderBrushPressed);
    border-top-color: var(--ButtonBorderBrushPressedTop);
    border-bottom-color: var(--ButtonBorderBrushPressedBottom);
  }

  .win-split-button.is-open::after {
    border-color: var(--ButtonBorderBrushPressed);
    border-top-color: var(--ButtonBorderBrushPressedTop);
    border-bottom-color: var(--ButtonBorderBrushPressedBottom);
  }

  .win-split-button.is-open .win-btn:not(.win-toggle-button) {
    --ButtonBackground: var(--ctrl-fill-tertiary);
    --ButtonBackgroundPointerOver: var(--ctrl-fill-tertiary);
    --ButtonForeground: var(--text-secondary);
    --ButtonForegroundPointerOver: var(--text-secondary);
  }

  .win-split-button.is-checked.is-open {
    --ButtonBorderBrush: transparent;
    --ButtonBorderBrushTop: transparent;
    --ButtonBorderBrushBottom: transparent;
    --ButtonBorderBrushPointerOver: transparent;
    --ButtonBorderBrushPointerOverTop: transparent;
    --ButtonBorderBrushPointerOverBottom: transparent;
  }

  .win-split-button.is-checked.is-open .win-btn:not(.win-toggle-button) {
    --ButtonBackground: var(--accent-pressed);
    --ButtonBackgroundPointerOver: var(--accent-pressed);
    --ButtonForeground: var(--accent-text-secondary);
    --ButtonForegroundPointerOver: var(--accent-text-secondary);
  }

  @media (prefers-color-scheme: dark) {
    html:not(.theme-light) .win-split-button {
      --ButtonBorderBrush: var(--ctrl-elevation-bottom);
      --ButtonBorderBrushTop: var(--ctrl-elevation-top);
      --ButtonBorderBrushPointerOver: var(--ctrl-elevation-bottom);
      --ButtonBorderBrushPointerOverTop: var(--ctrl-elevation-top);
      --ButtonBorderBrushPressed: var(--ctrl-elevation-bottom);
      --ButtonBorderBrushPressedTop: var(--ctrl-elevation-top);
      --ButtonBorderBrushDisabled: var(--ctrl-elevation-bottom);
      --ButtonBorderBrushDisabledTop: var(--ctrl-elevation-top);
      --ButtonBorderBrushBottom: var(--ctrl-elevation-bottom);
      --ButtonBorderBrushPointerOverBottom: var(--ctrl-elevation-bottom);
      --ButtonBorderBrushPressedBottom: var(--ctrl-elevation-bottom);
      --ButtonBorderBrushDisabledBottom: var(--ctrl-elevation-bottom);
    }

    html:not(.theme-light) .win-split-button.is-checked {
      --ButtonBorderBrushTop: var(--accent-border-accent);
      --ButtonBorderBrushPointerOverTop: var(--accent-border-accent);
      --ButtonBorderBrushBottom: var(--accent-border);
      --ButtonBorderBrushPointerOverBottom: var(--accent-border);
    }
  }

  html.theme-dark .win-split-button,
  .example-theme-wrapper.theme-dark .win-split-button,
  .win-theme-scope.theme-dark .win-split-button {
    --ButtonBorderBrush: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushTop: var(--ctrl-elevation-top);
    --ButtonBorderBrushPointerOver: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPointerOverTop: var(--ctrl-elevation-top);
    --ButtonBorderBrushPressed: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPressedTop: var(--ctrl-elevation-top);
    --ButtonBorderBrushDisabled: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushDisabledTop: var(--ctrl-elevation-top);
    --ButtonBorderBrushBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPointerOverBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPressedBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushDisabledBottom: var(--ctrl-elevation-bottom);
  }

  html.theme-dark .win-split-button.is-checked,
  .example-theme-wrapper.theme-dark .win-split-button.is-checked,
  .win-theme-scope.theme-dark .win-split-button.is-checked {
    --ButtonBorderBrushTop: var(--accent-border-accent);
    --ButtonBorderBrushPointerOverTop: var(--accent-border-accent);
    --ButtonBorderBrushBottom: var(--accent-border);
    --ButtonBorderBrushPointerOverBottom: var(--accent-border);
  }

  .example-theme-wrapper.theme-light .win-split-button,
  .win-theme-scope.theme-light .win-split-button {
    --ButtonBorderBrush: var(--ctrl-border);
    --ButtonBorderBrushTop: var(--ButtonBorderBrush);
    --ButtonBorderBrushPointerOver: var(--ctrl-border);
    --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushPointerOver);
    --ButtonBorderBrushPressed: var(--ctrl-border);
    --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushDisabled: var(--ctrl-border);
    --ButtonBorderBrushDisabledTop: var(--ButtonBorderBrushDisabled);
    --ButtonBorderBrushBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPointerOverBottom: var(--ctrl-elevation-bottom);
    --ButtonBorderBrushPressedBottom: var(--ctrl-border);
    --ButtonBorderBrushDisabledBottom: var(--ctrl-border);
  }

  .example-theme-wrapper.theme-light .win-split-button.is-checked,
  .win-theme-scope.theme-light .win-split-button.is-checked {
    --ButtonBorderBrushTop: var(--accent-border);
    --ButtonBorderBrushPointerOverTop: var(--accent-border);
    --ButtonBorderBrushBottom: var(--accent-border-accent);
    --ButtonBorderBrushPointerOverBottom: var(--accent-border-accent);
  }

  .example-theme-wrapper.theme-dark .win-split-button::after {
    border-color: var(--SplitButtonBorderBrush);
    border-top-color: var(--SplitButtonBorderBrushTop);
    border-bottom-color: var(--SplitButtonBorderBrushBottom);
  }

  html.theme-dark .win-split-button.is-checked.is-open,
  .example-theme-wrapper.theme-dark .win-split-button.is-checked.is-open,
  .win-theme-scope.theme-dark .win-split-button.is-checked.is-open,
  .example-theme-wrapper.theme-light .win-split-button.is-checked.is-open,
  .win-theme-scope.theme-light .win-split-button.is-checked.is-open {
    --ButtonBorderBrush: transparent;
    --ButtonBorderBrushTop: transparent;
    --ButtonBorderBrushBottom: transparent;
    --ButtonBorderBrushPointerOver: transparent;
    --ButtonBorderBrushPointerOverTop: transparent;
    --ButtonBorderBrushPointerOverBottom: transparent;
  }

  @media (prefers-color-scheme: dark) {
    html:not(.theme-light) .win-split-button.is-checked.is-open {
      --ButtonBorderBrush: transparent;
      --ButtonBorderBrushTop: transparent;
      --ButtonBorderBrushBottom: transparent;
      --ButtonBorderBrushPointerOver: transparent;
      --ButtonBorderBrushPointerOverTop: transparent;
      --ButtonBorderBrushPointerOverBottom: transparent;
    }
  }

</style>
