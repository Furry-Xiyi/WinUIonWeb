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
      <span class="win-dropdown-content">
        <ContentOutlet v-if="contentNodes.length" />
        <span v-else>{{ resolvedContent }}</span>
      </span>
      <span class="icon win-dd-chevron chevron-animate"
            :class="[chevronClass, { open: isOpen }]"
            aria-hidden="true"
            @animationend="onChevronAnimEnd"></span>
    </button>
    <MenuFlyout
      :Open="isOpen"
      :AnchorRect="anchorRect"
      :Items="flyoutItems"
      :Placement="flyoutPlacement"
      @Close="isOpen = false"
      @Select="onSelect" />
  </div>
</template>
<script lang="ts">
import { DropDownButtonContent, DropDownButtonFlyout } from './DropDownButtonProperties'

// Vue compiles XAML property elements as static members on the owner
// component (for example, DropDownButton.Flyout).
export default {
  Flyout: DropDownButtonFlyout,
  Content: DropDownButtonContent
}
</script>
<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, ref, useAttrs, useSlots } from 'vue';
import MenuFlyout from './MenuFlyout.vue';
import { getDropDownButtonProperty } from './DropDownButtonProperties';
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  Flyout: { type: [Object, Array], default: () => ({ Items: [] }) },
  IsEnabled: { type: [Boolean, String], default: true },
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
const slots = useSlots();
const instance = getCurrentInstance();
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

const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);
const isDisabled = computed(() => !resolvedIsEnabled.value);
const resolvedContent = computed(() => resolveXamlValue(props.Content, instance));

const propertyNodes = computed(() => {
  const content = [];
  const flyout = [];
  const collect = (nodes) => {
    for (const node of nodes) {
      // Vue may wrap multiple XAML property elements in a Fragment. It is
      // compiler structure, so inspect its children before classifying them.
      if (node?.type === Fragment && Array.isArray(node.children)) {
        collect(node.children);
        continue;
      }
    const property = getDropDownButtonProperty(node)
      ?? (typeof node?.type === 'string' && node.type.endsWith('.Flyout') ? 'flyout' : undefined)
      ?? (typeof node?.type === 'string' && node.type.endsWith('.Content') ? 'content' : undefined);
    if (!property) {
      content.push(node);
      continue;
    }
    const propertySlot = node.children && typeof node.children === 'object' ? node.children.default : undefined;
    if (propertySlot) (property === 'content' ? content : flyout).push(...propertySlot());
    }
  }
  collect(slots.default?.() ?? []);
  return { content, flyout };
});
const contentNodes = computed(() => propertyNodes.value.content);
const flyoutNodes = computed(() => propertyNodes.value.flyout);
const ContentOutlet = defineComponent({ setup() { return () => h(Fragment, contentNodes.value); } });

// Property elements are compiled as component VNodes in normal templates,
// but sample content can also be normalized through a Fragment or a global
// component name. Keep the XAML property-element lookup independent of that
// compiler detail.
const hasVNodeMarker = (node, marker, componentName) => {
  const type = node?.type;
  if (type && (typeof type === 'object' || typeof type === 'function') && type[marker]) return true;
  return typeof type === 'string' && (type === componentName || type.endsWith(`.${componentName.split('.').pop()}`));
};
const flattenVNodes = (nodes) => {
  const result = [];
  for (const node of nodes || []) {
    if (node?.type === Fragment && Array.isArray(node.children)) result.push(...flattenVNodes(node.children));
    else if (node) result.push(node);
  }
  return result;
};
const slotVNodes = (node) => {
  if (Array.isArray(node?.children)) return flattenVNodes(node.children);
  const slot = node?.children && typeof node.children === 'object' ? node.children.default : undefined;
  return typeof slot === 'function' ? flattenVNodes(slot()) : [];
};
const childVNodes = (node) => {
  if (!node) return [];
  if (Array.isArray(node)) return flattenVNodes(node);
  const children = node.children;
  if (Array.isArray(children)) return flattenVNodes(children);
  if (children && typeof children === 'object') {
    const slots = Object.values(children).filter((value) => typeof value === 'function');
    return flattenVNodes(slots.flatMap((slot) => {
      try { return slot(); } catch { return []; }
    }));
  }
  return [];
};
const readIconValue = (node) => {
  if (!node) return undefined;
  const props = node.props ?? {};
  for (const key of ['Glyph', 'Symbol', 'Text', 'Icon']) {
    if (props[key] !== undefined) return resolveXamlValue(props[key], instance);
  }
  const nested = childVNodes(node);
  return nested.length ? readIconValue(nested[0]) : undefined;
};
const findIconValue = (nodes) => {
  for (const node of flattenVNodes(nodes)) {
    const value = readIconValue(node);
    if (value !== undefined) return value;
    const nested = childVNodes(node);
    const nestedValue = findIconValue(nested);
    if (nestedValue !== undefined) return nestedValue;
  }
  return undefined;
};

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

const propertyFlyout = computed(() => {
  const menuNode = flyoutNodes.value.find((node) => {
    return hasVNodeMarker(node, '__menuFlyoutDefinition', 'MenuFlyout');
  });
  if (!menuNode) return null;
  const menuProps = (menuNode.props ?? {}) as Record<string, unknown>;
  const itemNodes = slotVNodes(menuNode);
  const items = itemNodes.flatMap((node) => {
    if (!hasVNodeMarker(node, '__menuFlyoutItem', 'MenuFlyoutItem')) return [];
    const itemProps = { ...((node.props ?? {}) as Record<string, unknown>) };
    const itemChildren = slotVNodes(node);
    const iconNode = itemChildren.find((child) => hasVNodeMarker(child, '__menuFlyoutItemProperty', 'MenuFlyoutItem.Icon'));
    // Depending on whether the property element was compiled locally or
    // resolved globally, Vue may retain or flatten the MenuFlyoutItem.Icon
    // wrapper. Search the complete property subtree so the FontIcon glyph is
    // preserved in either compiler shape.
    const iconValue = readIconValue(iconNode) ?? findIconValue(itemChildren);
    if (iconValue !== undefined) itemProps.Icon = iconValue;
    return [{
      ...itemProps,
      Text: resolveXamlValue(itemProps.Text ?? '', instance),
      Value: resolveXamlValue(itemProps.Value ?? itemProps.Text, instance),
      IsEnabled: resolveXamlValue(itemProps.IsEnabled ?? true, instance) !== false
    }];
  });
  return { ...menuProps, Items: items };
});
const flyoutDefinition = computed(() => {
  if (propertyFlyout.value) return propertyFlyout.value;
  return Array.isArray(props.Flyout) ? { Items: props.Flyout } : props.Flyout || { Items: [] };
});
const flyoutPlacement = computed(() => flyoutDefinition.value.Placement || 'Bottom');
const flyoutItems = computed(() => (flyoutDefinition.value.Items || []).map((item) => {
  if (typeof item === 'string') {
    const text = resolveXamlValue(item, instance);
    return { Text: text, Value: text };
  }
  const text = resolveXamlValue(item.Text ?? item.Content ?? item.label ?? String(item), instance);
  const icon = item.Icon === undefined ? undefined : resolveXamlValue(item.Icon, instance);
  return { ...item, Text: text, ...(icon === undefined ? {} : { Icon: icon }) };
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

const toggle = (event) => {
  if (isDisabled.value) return;
  emit('Click', event);
  resolveXamlHandler(attrs.Click, instance)?.(event);
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
