<template>
  <ScrollViewer class="win-list-box"
    Width="{x:Bind TemplateWidth, Mode=OneWay}" Height="{x:Bind TemplateHeight, Mode=OneWay}"
    Padding="{x:Bind TemplatePadding, Mode=OneWay}"
    VerticalScrollMode="{x:Bind ScrollSettings.VerticalScrollMode, Mode=OneWay}"
    VerticalScrollBarVisibility="{x:Bind ScrollSettings.VerticalScrollBarVisibility, Mode=OneWay}"
    HorizontalScrollMode="{x:Bind ScrollSettings.HorizontalScrollMode, Mode=OneWay}"
    HorizontalScrollBarVisibility="{x:Bind ScrollSettings.HorizontalScrollBarVisibility, Mode=OneWay}"
    IsHorizontalRailEnabled="{x:Bind ScrollSettings.IsHorizontalRailEnabled, Mode=OneWay}"
    IsVerticalRailEnabled="{x:Bind ScrollSettings.IsVerticalRailEnabled, Mode=OneWay}"
    IsHorizontalScrollChainingEnabled="{x:Bind ScrollSettings.IsHorizontalScrollChainingEnabled, Mode=OneWay}"
    IsVerticalScrollChainingEnabled="{x:Bind ScrollSettings.IsVerticalScrollChainingEnabled, Mode=OneWay}"
    ZoomMode="{x:Bind ScrollSettings.ZoomMode, Mode=OneWay}"
    IsEnabled="{x:Bind ScrollTemplateIsEnabled, Mode=OneWay}" IsTabStop="False">
    <div class="win-list-box-items" role="listbox" :aria-disabled="!isEnabled" :aria-multiselectable="isMultiple || undefined">
      <div v-for="(item, index) in items" :key="itemKey(item, index)" class="win-list-box-item"
        :class="{ selected: isSelected(item, index) }" role="option" :aria-selected="isSelected(item, index)"
        :aria-disabled="!isEnabled" :tabindex="isEnabled ? (isSelected(item, index) ? 0 : -1) : -1"
        @click="select(index)" @keydown="onItemKeyDown($event, index)">
        <ItemContent :Item="item" />
      </div>
    </div>
  </ScrollViewer>
</template>

<script>
import { CollectionItemTemplate } from './CollectionProperties';
export default { ItemTemplate: CollectionItemTemplate };
</script>

<script setup>
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, provide, ref, toRaw, useAttrs, useSlots, watch } from 'vue';
import ScrollViewer from './ScrollViewer.vue';
import TextBlock from './TextBlock.vue';
import { scrollViewerTemplateBindings } from './scrollViewerTemplateBindings';
import { materializeXamlVNode, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlItemContextKey, xamlScopeKey } from './xamlRuntime';
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties';
import { xamlResourceDictionaryKey } from './Page.vue';

const props = defineProps({
  ItemsSource: { type: [Array, String, Object], default: () => [] }, SelectedIndex: { type: [Number, String], default: undefined },
  SelectedItem: { type: null, default: undefined }, SelectedItems: { type: [Array, String], default: undefined },
  ItemTemplate: { type: [String, Object, Function], default: undefined },
  SelectionMode: { type: String, default: 'Single' }, IsEnabled: { type: [Boolean, String], default: true },
  Padding: { type: [String, Number], default: 0 }, Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' }
});
const emit = defineEmits(['SelectionChanged', 'update:SelectedIndex', 'update:SelectedItem', 'update:SelectedItems']);
const attrs = useAttrs(), slots = useSlots(), instance = getCurrentInstance(), inheritedScope = inject(xamlScopeKey, {});
const ScrollSettings = scrollViewerTemplateBindings(name => attrs[name], instance);
const isEnabled = computed(() => { const value = resolveXamlValue(props.IsEnabled, instance); return value !== false && value !== 'False'; });
provide(xamlScopeKey, { ...inheritedScope, ScrollSettings,
  get TemplateWidth() { return resolveXamlValue(props.Width, instance); }, get TemplateHeight() { return resolveXamlValue(props.Height, instance); },
  get TemplatePadding() { return resolveXamlValue(props.Padding, instance); }, get ScrollTemplateIsEnabled() { return isEnabled.value; }
});
const resources = inject(xamlResourceDictionaryKey, null);
const propertyNodes = slots.default?.() ?? [];
const itemTemplate = computed(() => {
  const value = resolveXamlValue(props.ItemTemplate, instance);
  const resource = typeof value === 'string' ? resources?.[value.match(/^\{StaticResource\s+([^}]+)\}$/)?.[1] ?? value] : value;
  if (resource && typeof resource === 'object') return getVNodeChildren(resource);
  const node = propertyNodes.find(node => getCollectionProperty(node) === 'itemTemplate');
  return node ? getVNodeChildren(node) : [];
});
const ItemContent = defineComponent({ props: { Item: { type: null, default: null } }, setup(itemProps) {
  provide(xamlItemContextKey, computed(() => itemProps.Item));
  return () => itemTemplate.value.length ? h(Fragment, materializeXamlVNode(itemTemplate.value, itemProps.Item, instance)) : h(TextBlock, { Text: String(itemProps.Item ?? '') });
} });
const items = computed(() => { const source = resolveXamlValue(props.ItemsSource, instance); return Array.isArray(source) ? source : []; });
const mode = computed(() => String(resolveXamlValue(props.SelectionMode, instance) ?? 'Single'));
const isMultiple = computed(() => mode.value === 'Multiple' || mode.value === 'Extended');
const initialIndex = Number(resolveXamlValue(props.SelectedIndex, instance));
const initialItem = resolveXamlValue(props.SelectedItem, instance);
const localIndex = ref(Number.isFinite(initialIndex) ? initialIndex : items.value.findIndex(item => toRaw(item) === toRaw(initialItem))), localItems = ref(undefined);
const selectedItems = computed(() => { const bound = resolveXamlValue(props.SelectedItems, instance); if (isMultiple.value) return localItems.value ?? (Array.isArray(bound) ? bound : []); return localIndex.value >= 0 && localIndex.value < items.value.length ? [items.value[localIndex.value]] : []; });
const itemKey = (item, index) => item && typeof item === 'object' ? item.Key ?? item.Id ?? index : index;
const same = (a, b) => toRaw(a) === toRaw(b);
const isSelected = (item, index) => isMultiple.value ? selectedItems.value.some(selected => same(selected, item)) : index === localIndex.value;
const sender = { get SelectedIndex() { return localIndex.value; }, get SelectedItem() { return items.value[localIndex.value] ?? null; }, get SelectedItems() { return selectedItems.value; } };
const raise = (args) => { emit('SelectionChanged', sender, args); if (!instance.vnode.props?.onSelectionChanged) resolveXamlHandler(attrs.SelectionChanged, instance)?.(sender, args); };
const select = index => {
  if (!isEnabled.value || mode.value === 'None') return;
  if (!Number.isInteger(index) || index < -1 || index >= items.value.length || (!isMultiple.value && index === localIndex.value) || (isMultiple.value && index < 0)) return;
  const item = index < 0 ? null : items.value[index];
  if (isMultiple.value) { const next = [...selectedItems.value], found = next.findIndex(selected => same(selected, item)); if (found >= 0) next.splice(found, 1); else next.push(item); localItems.value = next; updateXamlBinding(props.SelectedItems, next, instance); emit('update:SelectedItems', next); raise({ AddedItems: found < 0 ? [item] : [], RemovedItems: found >= 0 ? [item] : [], SelectedItems: next }); return; }
  const previous = items.value[localIndex.value]; localIndex.value = index; updateXamlBinding(props.SelectedIndex, index, instance); updateXamlBinding(props.SelectedItem, item, instance); emit('update:SelectedIndex', index); emit('update:SelectedItem', item); raise({ AddedItems: index < 0 ? [] : [item], RemovedItems: previous == null ? [] : [previous], SelectedIndex: index, SelectedItem: item });
};
const onItemKeyDown = (event, index) => {
  if (!isEnabled.value) return;
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(index); return; }
  const next = event.key === 'ArrowDown' ? Math.min(items.value.length - 1, index + 1) : event.key === 'ArrowUp' ? Math.max(0, index - 1) : event.key === 'Home' ? 0 : event.key === 'End' ? items.value.length - 1 : -1;
  if (next < 0) return;
  event.preventDefault();
  if (!isMultiple.value) select(next);
  const target = event.currentTarget?.parentElement?.children[next];
  target?.focus({ preventScroll: true });
  target?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
};
watch(() => resolveXamlValue(props.SelectedIndex, instance), value => { const index = Number(value); localIndex.value = Number.isFinite(index) ? index : -1; });
watch(() => resolveXamlValue(props.SelectedItem, instance), value => { if (value !== undefined) localIndex.value = items.value.findIndex(item => same(item, value)); });
watch(() => resolveXamlValue(props.SelectedItems, instance), () => { localItems.value = undefined; });
defineExpose({
  get SelectedIndex() { return localIndex.value; }, set SelectedIndex(index) { select(Number(index)); },
  get SelectedItem() { return items.value[localIndex.value] ?? null; }, set SelectedItem(item) { select(items.value.findIndex(candidate => same(candidate, item))); },
  SelectedItems: selectedItems, Select: select
});
</script>

<style scoped>
.win-list-box { position: relative; isolation: isolate; min-width: 0; min-height: 0; background: var(--ListBoxBackground, transparent); color: var(--ListBoxForeground, var(--text-primary)); border: var(--ListBoxBorderThemeThickness, 1px) solid var(--ListBoxBorder, var(--ctrl-border)); border-radius: 0; }
.win-list-box-items { display: flex; flex-direction: column; min-width: 0; }
.win-list-box-item { min-width: 0; padding: 8px 12px; border-radius: 0; cursor: default; outline: none; }
.win-list-box-item:hover { background: var(--ListBoxItemBackgroundPointerOver, var(--subtle-fill-secondary)); }
.win-list-box-item.selected { background: var(--ListBoxItemBackgroundSelected, var(--accent-base)); color: var(--ListBoxItemForegroundSelected, var(--accent-text)); }
.win-list-box-item:focus-visible { outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary)); outline-offset: -2px; }
</style>
