<template>
  <SplitButton
    :class="[attrs.class, { 'is-checked': checkedState }]"
    :style="attrs.style"
    Flyout="{x:Bind splitFlyout, Mode=OneWay}"
    IsEnabled="{x:Bind resolvedIsEnabled, Mode=OneWay}"
    Theme="{x:Bind Theme, Mode=OneWay}"
    MinWidth="{x:Bind MinWidth, Mode=OneWay}"
    MinHeight="{x:Bind MinHeight, Mode=OneWay}"
    Padding="{x:Bind Padding, Mode=OneWay}"
    Margin="{x:Bind Margin, Mode=OneWay}"
    VerticalAlignment="{x:Bind VerticalAlignment, Mode=OneWay}"
    Click="OnSplitClick"
    Select="OnSelect">
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
import { computed, defineComponent, Fragment, getCurrentInstance, h, provide, ref, useAttrs, useSlots, watch, type VNode } from 'vue';
import SplitButton from './SplitButton.vue';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  IsChecked: { type: [Boolean, String], default: undefined },
  Flyout: { type: [Object, Array], default: () => ({ Items: [] }) },
  IsEnabled: { type: [Boolean, String], default: true },
  Theme: { type: String, default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  Padding: { type: String, default: '' },
  Margin: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const emit = defineEmits(['update:IsChecked', 'Click', 'IsCheckedChanged', 'Select']);
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
const localIsChecked = ref<boolean | undefined>(undefined);
const isUpdatingChecked = ref(false);
watch(resolvedIsChecked, (value) => {
  if (!isUpdatingChecked.value) localIsChecked.value = value === true;
}, { immediate: true });
const checkedState = computed(() => localIsChecked.value !== undefined
  ? localIsChecked.value
  : resolvedIsChecked.value === true);
const isDisabled = computed(() => !resolvedIsEnabled.value);
const flyoutDefinition = computed(() => Array.isArray(props.Flyout) ? { Items: props.Flyout } : props.Flyout || { Items: [] });
const sourceItems = computed(() => flyoutDefinition.value.Items ?? []);
const splitOptions = computed(() => sourceItems.value.map((item, idx) => {
  if (typeof item === 'string') return { Text: item, Value: idx };
  return { ...item, Text: item.Text ?? item.Content ?? item.label ?? String(item), Value: item.Value ?? idx };
}));
const splitFlyout = computed(() => ({ ...flyoutDefinition.value, Items: splitOptions.value }));

const setChecked = (next, event) => {
  if (isDisabled.value) return;
  localIsChecked.value = next;
  isUpdatingChecked.value = true;
  emit('update:IsChecked', next);
  updateXamlBinding(props.IsChecked, next, instance);
  isUpdatingChecked.value = false;
  emit('Click', event);
  resolveXamlHandler(attrs.Click, instance)?.(event);
  emit('IsCheckedChanged', { IsChecked: next });
  resolveXamlHandler(attrs.IsCheckedChanged, instance)?.({ IsChecked: next });
};

const onSplitClick = (event) => {
  setChecked(!checkedState.value, event);
};

const onSelect = (item) => {
  emit('Select', item);
  resolveXamlHandler(attrs.Select, instance)?.(item);
};

provide(xamlScopeKey, {
  splitFlyout,
  resolvedIsEnabled,
  Theme: computed(() => props.Theme),
  MinWidth: computed(() => props.MinWidth),
  MinHeight: computed(() => props.MinHeight),
  Padding: computed(() => props.Padding),
  Margin: computed(() => props.Margin),
  VerticalAlignment: computed(() => props.VerticalAlignment),
  OnSplitClick: onSplitClick,
  OnSelect: onSelect
});
</script>
