<template>
  <div class="win-split-button" :class="[attrs.class, { 'is-open': isOpen }]" :style="rootStyle" ref="wrap">
    <slot name="main" :isDisabled="isDisabled" :onClick="onClick">
      <Button class="win-split-main-button" :IsEnabled="!isDisabled" @Click="onClick">
        <MainOutlet v-if="mainNodes.length" />
        <slot v-else>{{ resolvedContent }}</slot>
      </Button>
    </slot>
    <div class="win-btn-separator"></div>
    <Button class="win-btn-chevron"
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
            aria-hidden="true"
            @animationend="onChevronAnimEnd"></span>
    </Button>
    <MenuFlyout :Open="isOpen" :AnchorRect="anchorRect" :Items="flyoutItems" :Placement="flyoutPlacement" :Theme="menuTheme" @Close="isOpen = false" @Select="onSelect">
      <FlyoutOutlet v-if="flyoutNodes.length" />
      <slot v-else name="flyout" :close="closeFlyout"></slot>
    </MenuFlyout>
  </div>
</template>
<script lang="ts">
import { defineComponent, h, Fragment } from 'vue'

export const SplitButtonFlyout = defineComponent({
  name: 'SplitButton.Flyout',
  __splitButtonProperty: 'flyout',
  setup(_, { slots }) {
    return () => h('span', { class: 'split-button-property' }, slots.default?.())
  }
})

export default { Flyout: SplitButtonFlyout }
</script>
<script setup lang="ts">
import { ref, computed, defineComponent, Fragment, getCurrentInstance, h, onBeforeUnmount, onMounted, useAttrs, useSlots } from 'vue';
import Button from './Button.vue';
import MenuFlyout from './MenuFlyout.vue';
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  Flyout: { type: [Object, Array], default: () => ({ Items: [] }) },
  IsEnabled: { type: [Boolean, String], default: true },
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
const slots = useSlots();
const instance = getCurrentInstance();
const isFlyoutContainer = (node) => {
  const type = node?.type;
  if (!type || typeof type !== 'object') return false;
  const name = type.name || type.__name;
  return name === 'Flyout' || name === 'Flyout';
};
const propertyNodes = computed(() => {
  const main = [];
  const flyout = [];
  let placement = '';
  const appendFlyoutContent = (nodes) => {
    for (const node of nodes ?? []) {
      if (isFlyoutContainer(node)) {
        const requestedPlacement = node.props?.Placement;
        if (requestedPlacement) placement = requestedPlacement;
        const contentSlot = node.children && typeof node.children === 'object' ? node.children.default : undefined;
        if (contentSlot) appendFlyoutContent(contentSlot());
      } else {
        flyout.push(node);
      }
    }
  };
  for (const node of slots.default?.() ?? []) {
    const type = node.type;
    if (typeof type === 'object' && type?.__splitButtonProperty === 'flyout') {
      const propertySlot = node.children && typeof node.children === 'object' ? node.children.default : undefined;
      if (propertySlot) appendFlyoutContent(propertySlot());
    } else {
      main.push(node);
    }
  }
  return { main, flyout, placement };
});
const MainOutlet = defineComponent({ setup() { return () => h(Fragment, propertyNodes.value.main); } });
const FlyoutOutlet = defineComponent({ setup() { return () => h(Fragment, propertyNodes.value.flyout); } });
const mainNodes = computed(() => propertyNodes.value.main);
const flyoutNodes = computed(() => propertyNodes.value.flyout);
const wrap = ref(null);
const isOpen = ref(false);
const anchorRect = ref(null);
const chevronClass = ref('');
const anchorTheme = ref('');
let chevronPressed = false;
let chevronPressDone = false;
let themeObserver;

const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);
const isDisabled = computed(() => !resolvedIsEnabled.value);
const resolvedContent = computed(() => resolveXamlValue(props.Content, instance));
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
const flyoutPlacement = computed(() => propertyNodes.value.placement || flyoutDefinition.value.Placement || 'Bottom');
const sourceItems = computed(() => flyoutDefinition.value.Items?.length ? flyoutDefinition.value.Items : props.Options);
const flyoutItems = computed(() => sourceItems.value.map((item) => {
  if (typeof item === 'string') return { Text: item, Value: item };
  return { ...item, Text: item.Text ?? item.Content ?? item.label ?? String(item) };
}));
const rootStyle = computed(() => {
  const style = {};
  if (props.MinWidth !== '') {
    style.minWidth = cssLength(props.MinWidth);
    style['--SplitButtonMainMinWidth'] = cssLength(props.MinWidth);
  }
  if (props.MinHeight !== '') style.minHeight = cssLength(props.MinHeight);
  if (props.Padding) style['--SplitButtonPadding'] = xamlThickness(props.Padding);
  if (props.Margin) style.margin = xamlThickness(props.Margin);
  if (props.VerticalAlignment) style.alignSelf = props.VerticalAlignment.toLowerCase();
  return [attrs.style, style];
});
const menuTheme = computed(() => props.Theme || anchorTheme.value);

const resolveAnchorTheme = () => {
  const themeScope = wrap.value?.closest('.theme-light, .theme-dark');
  if (themeScope?.classList.contains('theme-dark')) return 'dark';
  if (themeScope?.classList.contains('theme-light')) return 'light';
  return '';
};

const observeAnchorTheme = () => {
  themeObserver?.disconnect();
  const themeScope = wrap.value?.closest('.theme-light, .theme-dark');
  anchorTheme.value = resolveAnchorTheme();
  if (!themeScope) return;

  themeObserver = new MutationObserver(() => {
    anchorTheme.value = resolveAnchorTheme();
  });
  themeObserver.observe(themeScope, { attributes: true, attributeFilter: ['class'] });
};

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
const onChevronAnimEnd = (event) => {
  if (chevronClass.value === 'pressing' && event.animationName === 'chevron-press') {
    chevronPressDone = true;
    if (!chevronPressed) chevronClass.value = 'releasing';
  } else if (chevronClass.value === 'releasing' && event.animationName === 'chevron-release') {
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
  resolveXamlHandler(attrs.Click, instance)?.(event);
};
const onSelect = (item) => {
  emit('Select', item);
  emit('select', item.Value ?? item);
  isOpen.value = false;
};

onMounted(observeAnchorTheme);
onBeforeUnmount(() => themeObserver?.disconnect());
</script>
<style>
  .win-split-button {
    position: relative;
    display: inline-flex;
    box-sizing: border-box;
    border-left: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushCurrent);
    border-top: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushTopCurrent);
    border-right: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushCurrent);
    border-bottom: var(--ButtonBorderThemeThickness) solid var(--ButtonBorderBrushBottomCurrent);
    border-radius: 4px;
    overflow: hidden;
    min-height: 32px;
    height: 32px;
    background: transparent;
    --ButtonBorderThemeThickness: 1px;
    --ButtonBorderBrush: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
    --ButtonBorderBrushTop: var(--ButtonBorderBrushDefaultTop, var(--ButtonBorderBrush));
    --ButtonBorderBrushBottom: var(--ButtonBorderBrushDefaultBottom, var(--ctrl-border-accent));
    --ButtonBorderBrushPointerOver: var(--ButtonBorderBrush);
    --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushTop);
    --ButtonBorderBrushPointerOverBottom: var(--ButtonBorderBrushBottom);
    --ButtonBorderBrushPressed: var(--ControlStrokeColorDefaultBrush);
    --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushPressedBottom: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushCurrent: var(--ButtonBorderBrush);
    --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushTop);
    --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushBottom);
    --SplitButtonPadding: 6px 11px 7px;
    --SplitButtonBorderBrushDivider: var(--ControlStrokeColorDefaultBrush);
    --SplitButtonBorderBrushCheckedDivider: rgba(0, 0, 0, 0.2157);
  }

  .win-split-button.is-checked {
    --ButtonBorderBrush: var(--AccentButtonBorderBrushDefault, var(--accent-border));
    --ButtonBorderBrushTop: var(--ButtonBorderBrush);
    --ButtonBorderBrushBottom: var(--AccentButtonBorderBrushDefaultBottom, var(--accent-border-accent));
    --ButtonBorderBrushPointerOver: var(--ButtonBorderBrush);
    --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushTop);
    --ButtonBorderBrushPointerOverBottom: var(--ButtonBorderBrushBottom);
    --ButtonBorderBrushPressed: var(--ControlFillColorTransparentBrush, transparent);
    --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushPressedBottom: var(--ButtonBorderBrushPressed);
    --SplitButtonBorderBrushDivider: var(--SplitButtonBorderBrushCheckedDivider);
  }

  .win-split-button:has(.win-btn:hover) {
    --ButtonBorderBrushCurrent: var(--ButtonBorderBrushPointerOver);
    --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushPointerOverTop);
    --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushPointerOverBottom);
  }

  .win-split-button:has(.win-btn:active),
  .win-split-button.is-open {
    --ButtonBorderBrushCurrent: var(--ButtonBorderBrushPressed);
    --ButtonBorderBrushTopCurrent: var(--ButtonBorderBrushPressedTop);
    --ButtonBorderBrushBottomCurrent: var(--ButtonBorderBrushPressedBottom);
  }

  .win-split-button .win-btn {
    border: none;
    border-radius: 0;
    min-height: 0;
    height: 100%;
    position: relative;
    padding: var(--SplitButtonPadding);
    --ButtonBorderThemeThickness: 0px;
  }

  .win-split-button .win-btn:not(.win-toggle-button) {
    --ButtonBackground: var(--ctrl-fill-default);
    --ButtonBackgroundPointerOver: var(--ctrl-fill-secondary);
    --ButtonBackgroundPressed: var(--ctrl-fill-tertiary);
    --ButtonBorderBrush: transparent;
    --ButtonBorderBrushPointerOver: transparent;
    --ButtonBorderBrushPressed: transparent;
    --ButtonBorderBrushDisabled: transparent;
  }

  .win-split-button .win-btn:hover {
    --ButtonBackgroundCurrent: var(--ButtonBackgroundPointerOver);
    --ButtonForegroundCurrent: var(--ButtonForeground);
  }

  .win-split-button .win-btn:active {
    --ButtonBackgroundCurrent: var(--ButtonBackgroundPressed);
    --ButtonForegroundCurrent: var(--ButtonForegroundPressed);
  }

  .win-split-button.is-open .win-btn:not(.win-toggle-button) {
    --ButtonBackground: var(--ctrl-fill-tertiary);
    --ButtonBackgroundPointerOver: var(--ctrl-fill-tertiary);
    --ButtonForeground: var(--text-secondary);
    --ButtonForegroundPointerOver: var(--text-secondary);
  }

  .win-split-button.is-checked .win-btn:not(.win-toggle-button) {
    --ButtonBackground: var(--accent-base);
    --ButtonBackgroundPointerOver: var(--accent-hover);
    --ButtonBackgroundPressed: var(--accent-pressed);
    --ButtonForeground: var(--accent-text);
    --ButtonForegroundPointerOver: var(--accent-text);
    --ButtonForegroundPressed: var(--accent-text-secondary);
  }

  .win-split-button.is-checked.is-open .win-btn:not(.win-toggle-button) {
    --ButtonBackground: var(--accent-pressed);
    --ButtonBackgroundPointerOver: var(--accent-pressed);
    --ButtonForeground: var(--accent-text-secondary);
    --ButtonForegroundPointerOver: var(--accent-text-secondary);
  }

  .win-split-button .win-split-main-button {
    min-width: var(--SplitButtonMainMinWidth, 35px);
  }

  .win-split-button .win-btn-separator {
    width: 1px;
    margin: 0;
    background: var(--SplitButtonBorderBrushDivider);
  }

  .win-split-button .win-btn-chevron {
    flex: 0 0 35px;
    width: 35px;
    min-width: 35px;
    padding: 0 12px 0 0;
    justify-content: flex-end;
  }

  .win-split-button .win-btn-chevron .icon {
    font-size: 0;
  }

</style>
