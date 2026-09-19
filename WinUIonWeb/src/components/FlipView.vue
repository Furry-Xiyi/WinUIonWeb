<!-- components/FlipView.vue -->
<template>
  <div class="win-flip-view" :class="[orientationClass, { disabled: !isEnabled }]" :style="rootStyle"
       @mouseenter="hover = true" @mouseleave="hover = false"
       @wheel.prevent="onWheel"
       @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div class="flip-view-track" :style="trackStyle">
      <div v-for="(item, index) in items" :key="getItemKey(item, index)" class="flip-view-item">
        <component :is="itemComponent(item, index)" />
      </div>
    </div>
    <button v-show="hover && selectedIndex > 0" class="flip-btn prev" @click="prev">
      <span class="icon flip-arrow">{{ orientationClass === 'vertical' ? '\uEDDB' : '\uEDD9' }}</span>
    </button>
    <button v-show="hover && selectedIndex < items.length - 1" class="flip-btn next" @click="next">
      <span class="icon flip-arrow">{{ orientationClass === 'vertical' ? '\uEDDC' : '\uEDDA' }}</span>
    </button>
  </div>
</template>
<script>
import { CollectionItemTemplate, CollectionItemsPanel } from './CollectionProperties'

export default {
  ItemTemplate: CollectionItemTemplate,
  ItemsPanel: CollectionItemsPanel
}
</script>
<script setup>
import { computed, defineComponent, Fragment, h, getCurrentInstance, ref, useAttrs, useSlots } from 'vue';
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties';
import { materializeXamlVNode, resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: null },
  SelectedIndex: { type: [Number, String], default: undefined },
  SelectedItem: { type: [Object, String, Number, Boolean], default: undefined },
  Orientation: { type: String, default: undefined },
  IsEnabled: { type: [Boolean, String], default: true },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  Padding: { type: [String, Number], default: '' },
  Background: { type: [String, Object], default: '' },
  BorderBrush: { type: [String, Object], default: '' },
  BorderThickness: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' }
});
const emit = defineEmits(['SelectionChanged', 'update:SelectedIndex', 'update:SelectedItem']);

const hover = ref(false);
const currentIndex = ref(0);
let touchStart = 0;
const instance = getCurrentInstance();
const slots = useSlots();
const attrs = useAttrs();

const templateNodes = computed(() => {
  const result = [];
  for (const node of slots.default?.() ?? []) {
    const property = getCollectionProperty(node);
    if (property === 'itemTemplate') result.push(...getVNodeChildren(node));
  }
  return result;
});
const declaredNodes = computed(() => (slots.default?.() ?? []).filter((node) => !getCollectionProperty(node)));

const sourceItems = computed(() => {
  const bound = resolveXamlValue(props.ItemsSource, instance);
  if (Array.isArray(bound)) return bound;
  return [];
});
const items = computed(() => sourceItems.value.length || resolveXamlValue(props.ItemsSource, instance) ? sourceItems.value : declaredNodes.value);
const orientation = computed(() => resolveXamlValue(props.Orientation, instance) || 'Horizontal');
const panelOrientation = computed(() => {
  const panelElement = (slots.default?.() ?? []).find((node) => getCollectionProperty(node) === 'itemsPanel');
  const panel = panelElement ? getVNodeChildren(panelElement)[0] : null;
  return resolveXamlValue(panel?.props?.Orientation, instance);
});
const orientationClass = computed(() => String(panelOrientation.value || orientation.value).toLowerCase());
const selectedIndex = computed(() => Number(resolveXamlValue(props.SelectedIndex, instance) ?? currentIndex.value));
const isEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);
const cssLength = (value) => {
  const resolved = resolveXamlValue(value, instance);
  if (resolved === '' || resolved === null || resolved === undefined) return undefined;
  if (typeof resolved === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(resolved).trim())) return String(resolved) + 'px';
  return String(resolved);
};
const xamlThickness = (value) => {
  const resolved = resolveXamlValue(value, instance);
  if (resolved === '' || resolved === null || resolved === undefined) return undefined;
  const parts = String(resolved).split(',').map((part) => cssLength(part.trim()));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts[1] + ' ' + parts[0];
  if (parts.length === 4) return parts[1] + ' ' + parts[2] + ' ' + parts[3] + ' ' + parts[0];
  return String(resolved);
};
const rootStyle = computed(() => {
  const background = resolveXamlValue(props.Background, instance);
  const borderBrush = resolveXamlValue(props.BorderBrush, instance);
  const borderThickness = xamlThickness(props.BorderThickness);
  return {
    width: cssLength(props.Width), height: cssLength(props.Height),
    minWidth: cssLength(props.MinWidth), minHeight: cssLength(props.MinHeight),
    maxWidth: cssLength(props.MaxWidth), maxHeight: cssLength(props.MaxHeight),
    margin: xamlThickness(props.Margin), padding: xamlThickness(props.Padding),
    background: background || undefined, borderColor: borderBrush || undefined,
    borderWidth: borderThickness, borderStyle: borderBrush || borderThickness ? 'solid' : undefined,
    borderRadius: cssLength(props.CornerRadius)
  };
});

function getItemKey(item, index) { return item?.id ?? item?.title ?? item?.alt ?? index; }

function setSelectedIndex(index) {
  const bounded = Math.max(0, Math.min(Math.max(0, items.value.length - 1), index));
  if (bounded === selectedIndex.value) return;
  const oldItem = items.value[selectedIndex.value];
  const selectedItem = items.value[bounded];
  currentIndex.value = bounded;
  emit('update:SelectedIndex', bounded);
  emit('update:SelectedItem', selectedItem);
  const args = { AddedItems: selectedItem === undefined ? [] : [selectedItem], RemovedItems: oldItem === undefined ? [] : [oldItem], SelectedIndex: bounded, SelectedItem: selectedItem };
  emit('SelectionChanged', args);
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(args);
}

function prev() { if (isEnabled.value && selectedIndex.value > 0) setSelectedIndex(selectedIndex.value - 1); }
function next() { if (isEnabled.value && selectedIndex.value < items.value.length - 1) setSelectedIndex(selectedIndex.value + 1); }

function onWheel(e) {
  if (!isEnabled.value) return;
  const delta = orientationClass.value === 'vertical' ? e.deltaY : (e.deltaX || e.deltaY);
  if (delta > 0) next();
  else if (delta < 0) prev();
}

function onTouchStart(e) {
  const touch = e.touches[0];
  if (!isEnabled.value) return;
  touchStart = orientationClass.value === 'vertical' ? touch.clientY : touch.clientX;
}

function onTouchEnd(e) {
  const touch = e.changedTouches[0];
  if (!isEnabled.value) return;
  const end = orientationClass.value === 'vertical' ? touch.clientY : touch.clientX;
  const diff = touchStart - end;
  if (diff > 30) next();
  else if (diff < -30) prev();
}

const itemComponent = (item, index) => defineComponent({
  name: 'FlipViewItemTemplate',
  setup() {
    return () => {
      if (templateNodes.value.length) return h(Fragment, materializeXamlVNode(templateNodes.value, item, instance));
      if (declaredNodes.value.length && !resolveXamlValue(props.ItemsSource, instance)) return h(Fragment, [declaredNodes.value[index]]);
      const slot = slots.item;
      return slot ? h(Fragment, slot({ item, index })) : h(Fragment, [h('span', String(item ?? ''))]);
    };
  }
});

const trackStyle = computed(() => {
  if (orientationClass.value === 'vertical') {
    return { transform: `translateY(-${selectedIndex.value * 100}%)` };
  }
  return { transform: `translateX(-${selectedIndex.value * 100}%)` };
});
</script>
<style>
  /* styles/flipview.css */
  .win-flip-view {
    position: relative;
    overflow: hidden;
    border-radius: var(--ControlCornerRadius, 4px);
    display: flex;
    width: 100%;
    height: 100%;
    touch-action: none;
    background: var(--FlipViewBackground, var(--SolidBackgroundFillColorBaseBrush, var(--ctrl-solid-fill)));
    border: var(--FlipViewButtonBorderThemeThickness, 0) solid var(--FlipViewNextPreviousButtonBorderBrush, var(--ControlStrokeColorDefaultBrush, transparent));
    box-sizing: border-box;
  }

  .flip-view-track {
    display: flex;
    width: 100%;
    height: 100%;
    flex: 0 0 100%;
    transition: transform var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-flip-view.vertical .flip-view-track {
    flex-direction: column;
  }

  .flip-view-item {
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-sizing: border-box;
  }

  .win-flip-view :deep(img) {
    max-width: 100%;
    max-height: 100%;
  }

  .flip-btn {
    position: absolute;
    isolation: isolate;
    background: var(--FlipViewNextPreviousButtonBackground, var(--AcrylicInAppFillColorDefaultBrush, rgba(255,255,255,.72)));
    -webkit-backdrop-filter: var(--flyout-backdrop);
    backdrop-filter: var(--flyout-backdrop);
    border: 0;
    border-radius: 4px;
    color: var(--FlipViewNextPreviousArrowForeground, var(--ctrl-strong-fill));
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background var(--faster-duration, 83ms) linear, border-color var(--faster-duration, 83ms) linear;
  }

    .flip-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      border-radius: inherit;
      background: var(--FlipViewNextPreviousButtonBackground, var(--AcrylicInAppFillColorDefaultBrush, rgba(255,255,255,.72)));
    }

    .flip-btn .flip-arrow {
      font-size: 8px;
      transition: transform 0.1s ease, color var(--fast-duration);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .flip-btn:hover {
      background: var(--FlipViewNextPreviousButtonBackgroundPointerOver, var(--AcrylicInAppFillColorDefaultBrush, rgba(255,255,255,.84)));
    }

      .flip-btn:hover .flip-arrow {
        color: var(--FlipViewNextPreviousArrowForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
      }

    .flip-btn:active {
      background: var(--FlipViewNextPreviousButtonBackgroundPressed, var(--AcrylicInAppFillColorDefaultBrush, rgba(255,255,255,.92)));
    }

      .flip-btn:active .flip-arrow {
        color: var(--FlipViewNextPreviousArrowForegroundPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
        transform: scale(.875);
      }

  .win-flip-view.horizontal .flip-btn {
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 38px;
    margin: 1px;
  }

    .win-flip-view.horizontal .flip-btn.prev {
      left: 0;
    }

    .win-flip-view.horizontal .flip-btn.next {
      right: 0;
    }

  .win-flip-view.vertical .flip-btn {
    left: 50%;
    transform: translateX(-50%);
    width: 38px;
    height: 16px;
    margin: 1px;
  }

    .win-flip-view.vertical .flip-btn.prev {
      top: 0;
    }

    .win-flip-view.vertical .flip-btn.next {
      bottom: 0;
    }
  .win-flip-view.disabled { opacity: var(--ControlDisabledOpacity, .36); pointer-events: none; }
</style>
