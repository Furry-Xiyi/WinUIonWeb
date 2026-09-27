<template>
  <div ref="rootRef" v-bind="rootAttrs" class="win-selector-bar" :class="attrs.class"
    :style="[attrs.style, rootStyle]" :dir="flowDirection === 'RightToLeft' ? 'rtl' : 'ltr'"
    :aria-disabled="!isEnabled || undefined" @focusin="onGotFocus">
    <ItemsOutlet />
  </div>
</template>

<script>
import { SelectorBarItems } from './selectorBarRuntime'
export default { Items: SelectorBarItems }
</script>

<script setup>
import { Comment, Fragment, Text, computed, defineComponent, getCurrentInstance, h, markRaw, ref, shallowReactive, toRaw, useAttrs, useSlots, watch } from 'vue'
import ItemsView from './ItemsView.vue'
import SelectorBarItem from './SelectorBarItem.vue'
import { StackLayout } from './CollectionProperties'
import { frameworkLayoutStyle } from './frameworkLayout'
import { createSelectorBarItem, selectorBarItemKey, selectorBarPointerFocusKey } from './selectorBarRuntime'
import { selectorBarStyleSetter } from './selectorBarResources'
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Style: { type: [String, Object], default: null },
  Items: { type: [Array, String], default: undefined },
  SelectedItem: { type: null, default: undefined },
  Padding: { type: [String, Number], default: '{ThemeResource SelectorBarPadding}' },
  Background: { type: String, default: 'Transparent' }, BorderBrush: { type: String, default: 'Transparent' },
  CornerRadius: { type: [String, Number], default: 0 },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Top' },
  TabNavigation: { type: String, default: 'Once' }, IsTabStop: { type: [Boolean, String], default: false },
  IsEnabled: { type: [Boolean, String], default: true }, FlowDirection: { type: String, default: 'LeftToRight' }
})
const emit = defineEmits(['SelectionChanged', 'update:SelectedItem'])
const attrs = useAttrs(), slots = useSlots(), instance = getCurrentInstance()
const rootRef = ref(null), itemsViewRef = ref(null)
const items = shallowReactive([]), selectedItem = ref(null)
const localEnabled = ref(undefined), localDirection = ref(undefined), localStyle = ref(undefined)
const appliedStyle = computed(() => localStyle.value ?? resolveXamlValue(props.Style, instance))
const isTokenStyle = computed(() => appliedStyle.value?.Key === 'TokenViewSelectorBarStyle')
const read = name => resolveXamlValue(instance?.vnode.props?.[name] !== undefined ? props[name]
  : selectorBarStyleSetter(appliedStyle.value, name, 'SelectorBar') ?? props[name], instance)
const isEnabled = computed(() => localEnabled.value ?? resolveXamlValue(props.IsEnabled, instance) !== false)
const flowDirection = computed(() => localDirection.value ?? resolveXamlValue(props.FlowDirection, instance))
const rootStyle = computed(() => {
  // Padding belongs to PART_ItemsView, as in DefaultSelectorBarStyle.
  const values = Object.fromEntries(Object.keys(props).map(name => [name, read(name)]))
  const style = frameworkLayoutStyle({ ...values, Padding: undefined }, instance)
  return { ...style, direction: flowDirection.value === 'RightToLeft' ? 'rtl' : 'ltr' }
})
const rootAttrs = computed(() => {
  const { class: _class, style: _style, SelectionChanged: _selection, ...rest } = attrs
  return rest
})
const same = (left, right) => toRaw(left) === toRaw(right)
let ready = false
const publishSelection = value => {
  if (same(selectedItem.value, value)) return
  selectedItem.value?.SynchronizeSelection?.(false)
  selectedItem.value = value
  for (const item of items) item.SynchronizeSelection?.(same(item, value))
  updateXamlBinding(props.SelectedItem, value, instance)
  emit('update:SelectedItem', value)
  const args = Object.freeze({}) // SelectorBarSelectionChangedEventArgs has no fields.
  emit('SelectionChanged', publicApi, args)
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(publicApi, args)
}
const setSelectedItem = value => {
  // A markup-bound Items vector is materialized into control objects. Resolve
  // a binding's original item through that element factory before validation.
  const realized = value && typeof value === 'object' ? sourceItems.get(toRaw(value)) : null
  const item = value == null ? null : items.find(candidate => same(candidate, value) || same(candidate, realized))
  if (value != null && !item) throw new TypeError('SelectedItem must be an element of Items.')
  if (same(selectedItem.value, item)) return
  if (itemsViewRef.value) {
    if (item === null) itemsViewRef.value.DeselectAll()
    else itemsViewRef.value.Select(items.indexOf(item))
  } else publishSelection(item)
}
const onItemSelected = (item, selected) => {
  if (!ready) return
  if (selected) setSelectedItem(item)
  else if (same(selectedItem.value, item)) setSelectedItem(null)
}
const publicApi = {
  get Style() { return appliedStyle.value }, set Style(value) { localStyle.value = resolveXamlValue(value, instance); updateXamlBinding(props.Style, value, instance) },
  get Items() { return items },
  get SelectedItem() { return selectedItem.value }, set SelectedItem(value) { setSelectedItem(value) },
  get IsEnabled() { return isEnabled.value }, set IsEnabled(value) { localEnabled.value = value !== false && value !== 'False' },
  get FlowDirection() { return flowDirection.value }, set FlowDirection(value) { localDirection.value = value }
}
// IVector operations are aliases of the same observable collection, rather
// than a second selection/index API.
Object.defineProperties(items, {
  Size: { get: () => items.length }, Count: { get: () => items.length },
  GetAt: { value: index => items[index] }, IndexOf: { value: item => items.findIndex(candidate => same(candidate, item)) },
  Append: { value: item => items.push(item) }, Add: { value: item => items.push(item) },
  InsertAt: { value: (index, item) => items.splice(index, 0, item) },
  RemoveAt: { value: index => items.splice(index, 1) }, Clear: { value: () => items.splice(0) }
})

const flatten = nodes => (nodes ?? []).flatMap(node => {
  if (!node || node.type === Comment || node.type === Text) return []
  if (node.type === Fragment) return flatten(node.children)
  if (node.type?.__selectorBarProperty === 'Items') return flatten(node.children?.default?.() ?? node.children)
  return [node]
})
const slotItems = new Map(), sourceItems = new WeakMap()
let lastKeys = [], lastSource
const ItemsOutlet = defineComponent({
  name: 'SelectorBarTemplate',
  setup() {
    return () => {
      const bound = resolveXamlValue(props.Items, instance)
      const source = Array.isArray(bound) ? bound : null
      const nodes = source ? [] : flatten(slots.default?.()).filter(node => (node.type?.name || node.type?.__name) === 'SelectorBarItem')
      const keys = source ?? nodes.map((node, index) => node.key ?? node.props?.['data-xaml-ref'] ?? node.props?.['x:Name'] ?? index)
      const next = source ? source.map(item => {
        if (item?.[selectorBarItemKey]) return item
        if (!item || typeof item !== 'object') throw new TypeError('Items must contain SelectorBarItem elements.')
        let control = sourceItems.get(toRaw(item))
        if (!control) { control = markRaw(createSelectorBarItem(h(SelectorBarItem, item), instance, onItemSelected)); sourceItems.set(toRaw(item), control) }
        else control.UpdateNode(h(SelectorBarItem, item))
        return control
      }) : nodes.map((node, index) => {
        const key = keys[index]
        let control = slotItems.get(key)
        if (!control) { control = markRaw(createSelectorBarItem(node, instance, onItemSelected)); slotItems.set(key, control) }
        else control.UpdateNode(node)
        return control
      })
      if (lastSource !== source || keys.length !== lastKeys.length || keys.some((key, index) => !same(key, lastKeys[index]))) {
        items.splice(0, items.length, ...next)
        lastKeys = [...keys]; lastSource = source
      }
      return h(ItemsView, {
        ref: itemsViewRef, class: 'win-selector-bar-items-view', 'data-template-part': 'PART_ItemsView',
        ItemsSource: items, IsEnabled: isEnabled.value, FlowDirection: flowDirection.value,
        TabNavigation: read('TabNavigation'),
        MaxWidth: resolveXamlValue(props.MaxWidth, instance), MaxHeight: resolveXamlValue(props.MaxHeight, instance),
        Padding: read('Padding'),
        onSelectionChanged: args => publishSelection(args.SelectedItems[0] ?? null),
        onVnodeMounted: () => {
          ready = true
          const boundSelection = resolveXamlValue(props.SelectedItem, instance)
          if (boundSelection !== undefined) setSelectedItem(boundSelection)
          else {
            const initial = items.find(item => item.IsSelected === true)
            if (initial) setSelectedItem(initial)
          }
        }
      }, { default: () => [h(ItemsView.Layout, null, { default: () => [h(StackLayout, {
        Orientation: 'Horizontal', ...(isTokenStyle.value ? { Spacing: 8 } : {})
      })] })] })
    }
  }
})
// Realize a simultaneously updated Items vector before validating its bound
// SelectedItem. The public setter still validates immediately.
watch(() => resolveXamlValue(props.SelectedItem, instance), value => { if (ready) setSelectedItem(value) }, { flush: 'post' })
watch(() => resolveXamlValue(props.IsEnabled, instance), () => { localEnabled.value = undefined })
watch(() => resolveXamlValue(props.FlowDirection, instance), () => { localDirection.value = undefined })
watch(() => resolveXamlValue(props.Style, instance), () => { localStyle.value = undefined })
const focusable = item => item.IsEnabled !== false && item.IsTabStop !== false && item.Visibility !== 'Collapsed'
const onGotFocus = event => {
  if (event.target?.[selectorBarPointerFocusKey]) return
  if (!isEnabled.value || (selectedItem.value && focusable(selectedItem.value))) return
  const current = items[itemsViewRef.value?.CurrentItemIndex ?? -1]
  const target = current && focusable(current) ? current : items.find(focusable)
  if (target) setSelectedItem(target)
}
defineExpose(publicApi)
</script>

<style scoped>
.win-selector-bar {
  display: inline-grid;
  grid-template-columns: minmax(0, auto);
  grid-template-rows: auto;
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', sans-serif);
}
.win-selector-bar :deep(.win-selector-bar-items-view) {
  width: max-content;
  max-width: 100%;
  height: auto;
  border-radius: 0;
}
.win-selector-bar :deep(.win-selector-bar-items-view.disabled) { opacity: 1; }
.win-selector-bar :deep(.win-items-view-repeater.orientation-horizontal) { align-items: center; }
</style>
