<template>
  <SplitButton
    :class="[attrs.class, { 'is-checked': checkedState }]"
    :style="attrs.style"
    :Flyout="splitFlyout"
    :IsEnabled="IsEnabled"
    :Options="splitOptions"
    :Theme="Theme"
    :MinWidth="MinWidth"
    :MinHeight="MinHeight"
    :Padding="Padding"
    :Margin="Margin"
    :VerticalAlignment="VerticalAlignment"
    @Click="onSplitClick"
    @Select="onSelect">
    <MainOutlet />
    <template #flyout>
      <FlyoutOutlet v-if="flyoutNodes.length" />
    </template>
  </SplitButton>
</template>
<script lang="ts">
import { defineComponent, h } from 'vue'

export const ToggleSplitButtonFlyout = defineComponent({
  name: 'ToggleSplitButton.Flyout',
  __splitButtonProperty: 'flyout',
  setup(_, { slots }) {
    return () => h('span', { class: 'split-button-property' }, slots.default?.())
  }
})

export default { Flyout: ToggleSplitButtonFlyout }
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, useAttrs, useSlots, type VNode } from 'vue';
import SplitButton from './SplitButton.vue';
import { resolveXamlValue } from './xamlRuntime';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  IsChecked: { type: [Boolean, String], default: undefined },
  Flyout: { type: [Object, Array], default: () => ({ Items: [] }) },
  IsEnabled: { type: [Boolean, String], default: true },
  modelValue: { type: [Boolean, String], default: false },
  options: { type: Array, default: () => [] },
  Options: { type: Array, default: () => [] },
  Theme: { type: String, default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  Padding: { type: String, default: '' },
  Margin: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'update:IsChecked', 'Click', 'IsCheckedChanged', 'Select', 'click', 'optionClick']);
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const resolvedContent = computed(() => resolveXamlValue(props.Content, instance));

const isFlyoutProperty = (node: VNode) => {
  const type = node.type as { __splitButtonProperty?: string } | undefined;
  return type?.__splitButtonProperty === 'flyout';
};

const isFlyoutContainer = (node: VNode) => {
  const type = node?.type as { name?: string; __name?: string } | undefined;
  const name = type?.name || type?.__name;
  return name === 'Flyout' || name === 'Flyout';
};

const propertyNodes = computed(() => {
  const main: VNode[] = [];
  const flyout: VNode[] = [];

  const collect = (nodes: VNode[]) => {
    for (const node of nodes) {
      if (isFlyoutProperty(node)) {
        const propertySlot = node.children && typeof node.children === 'object'
          ? (node.children as { default?: () => VNode[] }).default
          : undefined;
        if (propertySlot) {
          for (const child of propertySlot()) {
            if (isFlyoutContainer(child)) {
              const contentSlot = child.children && typeof child.children === 'object'
                ? (child.children as { default?: () => VNode[] }).default
                : undefined;
              if (contentSlot) flyout.push(...contentSlot());
            } else {
              flyout.push(child);
            }
          }
        }
        continue;
      }

      // Vue can add a Fragment around template content.  A Fragment is only
      // compiler structure; it is not XAML content and must not hide a
      // ToggleSplitButton.Flyout property element from the parser.
      if (node.type === Fragment && Array.isArray(node.children)) {
        collect(node.children as VNode[]);
        continue;
      }

      main.push(node);
    }
  };

  collect(slots.default?.() ?? []);
  return { main, flyout };
});

const mainNodes = computed(() => propertyNodes.value.main);
const flyoutNodes = computed(() => propertyNodes.value.flyout);
const MainOutlet = defineComponent({
  name: 'ToggleSplitButtonMainOutlet',
  setup() {
    return () => mainNodes.value.length
      ? h(Fragment, mainNodes.value)
      : String(resolvedContent.value ?? '');
  }
});
const FlyoutOutlet = defineComponent({
  name: 'ToggleSplitButtonFlyoutOutlet',
  setup() {
    return () => h(Fragment, flyoutNodes.value);
  }
});

const resolvedIsChecked = computed(() => resolveXamlValue(props.IsChecked, instance));
const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);
const resolvedModelValue = computed(() => resolveXamlValue(props.modelValue, instance));
const checkedState = computed(() => resolvedIsChecked.value ?? resolvedModelValue.value);
const isDisabled = computed(() => !resolvedIsEnabled.value);
const flyoutDefinition = computed(() => Array.isArray(props.Flyout) ? { Items: props.Flyout } : props.Flyout || { Items: [] });
const sourceItems = computed(() => flyoutDefinition.value.Items?.length ? flyoutDefinition.value.Items : props.Options.length ? props.Options : props.options);
const splitOptions = computed(() => sourceItems.value.map((item, idx) => {
  if (typeof item === 'string') return { Text: item, Value: idx };
  return { ...item, Text: item.Text ?? item.Content ?? item.label ?? String(item), Value: item.Value ?? idx };
}));
const splitFlyout = computed(() => ({ ...flyoutDefinition.value, Items: splitOptions.value }));

const setChecked = (next, event) => {
  if (isDisabled.value) return;
  emit('update:modelValue', next);
  emit('update:IsChecked', next);
  emit('Click', event);
  emit('click', event);
  emit('IsCheckedChanged', { IsChecked: next });
};

const onSplitClick = (event) => {
  setChecked(!checkedState.value, event);
};

const onSelect = (item) => {
  emit('Select', item);
  emit('optionClick', item.Value);
};
</script>
