<template>
  <div
    ref="rootRef"
    v-bind="rootAttrs"
    :class="['win-selector-bar', attrs.class, { 'is-disabled': !EffectiveIsEnabled }]"
    :style="[attrs.style, rootStyle]"
    role="tablist"
    :aria-disabled="EffectiveIsEnabled ? undefined : 'true'">
    <div class="win-selector-bar-items-view" :style="itemsViewStyle">
      <button
        v-for="(Item, Index) in Items"
        :key="GetItemKey(Item, Index)"
        :ref="(element) => SetItemRef(Index, element)"
        class="win-selector-bar-item"
        :class="GetItemClass(Item, Index)"
        :style="GetItemStyle(Item)"
        :disabled="!EffectiveIsEnabled || !GetIsEnabled(Item)"
        :tabindex="GetItemTabIndex(Item, Index)"
        role="tab"
        type="button"
        :aria-selected="Index === CurrentSelectedIndex"
        :aria-disabled="!EffectiveIsEnabled || !GetIsEnabled(Item) ? 'true' : undefined"
        @click="ChangeSelection(Index, true)"
        @focus="FocusedIndex = Index"
        @keydown="OnItemKeyDown($event, Index)">
        <span class="win-selector-bar-item-content">
          <span
            v-if="HasIcon(Item)"
            class="win-selector-bar-item-icon"
            aria-hidden="true">
            <span
              v-if="IsIconMarkup(Item.Icon)"
              class="win-selector-bar-item-icon-glyph icon"
              v-html="GetIconContent(Item.Icon)"></span>
            <span v-else class="win-selector-bar-item-icon-glyph icon">{{ GetIconContent(Item.Icon) }}</span>
          </span>
          <span
            v-if="HasText(Item)"
            class="win-selector-bar-item-text">
            {{ GetText(Item) }}
          </span>
        </span>
        <span class="win-selector-bar-item-selection-visual" aria-hidden="true"></span>
        <span class="win-selector-bar-item-common-visual" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Comment, Fragment, Text, computed, nextTick, onMounted, ref, toRaw, useAttrs, useSlots, watch } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  Items: { type: Array, default: undefined },
  SelectedItem: { type: null, default: undefined },
  Padding: { type: [String, Number], default: '0,4' },
  Background: { type: String, default: 'transparent' },
  BorderBrush: { type: String, default: 'transparent' },
  CornerRadius: { type: [String, Number], default: '0' },
  TabNavigation: { type: String, default: 'Once' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Left' },
  VerticalAlignment: { type: String, default: 'Top' },
  IsEnabled: { type: Boolean, default: true }
});

const emit = defineEmits([
  'SelectionChanged',
  'update:SelectedItem'
]);

const slots = useSlots();
const attrs = useAttrs();
const rootRef = ref(null);
const itemRefs = new Map();
const CurrentSelectedIndex = ref(-1);
const FocusedIndex = ref(-1);

let nextObjectKey = 0;
const objectKeys = new WeakMap();

const iconMap = {
  Accept: '\uE8FB',
  Add: '\uE710',
  Back: '\uE72B',
  Calendar: '\uE787',
  Cancel: '\uE711',
  Clock: '\uE823',
  Contact: '\uE77B',
  Delete: '\uE74D',
  Edit: '\uE70F',
  Favorite: '\uE734',
  Filter: '\uE71C',
  Home: '\uE80F',
  Mail: '\uE715',
  More: '\uE712',
  Play: '\uE768',
  Refresh: '\uE72C',
  Save: '\uE74E',
  Search: '\uE721',
  Setting: '\uE713',
  Settings: '\uE713',
  Share: '\uE72D',
  Sort: '\uE8CB',
  Star: '\uE734',
  Sync: '\uE895'
};

const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

const EffectiveIsEnabled = computed(() => props.IsEnabled !== false);

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (value === '' || value === undefined || value === null) return '';

  const parts = String(value)
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      return cssLength(Number.isNaN(Number(trimmed)) ? trimmed : Number(trimmed));
    });

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const selfAlignment = (value) => ({
  Left: 'start',
  Center: 'center',
  Right: 'end',
  Stretch: 'stretch',
  Top: 'start',
  Bottom: 'end'
}[value] ?? undefined);

const flexAlignment = (value) => ({
  Left: 'flex-start',
  Center: 'center',
  Right: 'flex-end',
  Stretch: 'stretch'
}[value] ?? 'center');

const flexVerticalAlignment = (value) => ({
  Top: 'flex-start',
  Center: 'center',
  Bottom: 'flex-end',
  Stretch: 'stretch'
}[value] ?? 'center');

const coerceBoolean = (value, fallback = false) => {
  if (value === undefined || value === null) return fallback;
  if (value === '') return true;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes'].includes(normalized)) return true;
  if (['false', '0', 'no'].includes(normalized)) return false;
  return Boolean(value);
};

const isSameItem = (left, right) => toRaw(left) === toRaw(right);

const NormalizeChildren = (children) => {
  const result = [];
  for (const vnode of children ?? []) {
    if (!vnode || vnode.type === Comment || vnode.type === Text) continue;
    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      result.push(...NormalizeChildren(vnode.children));
      continue;
    }
    result.push(vnode);
  }
  return result;
};

const GetVNodeTypeName = (vnode) => {
  if (!vnode || typeof vnode.type === 'string') return '';
  return vnode.type?.name || vnode.type?.__name || '';
};

const GetProp = (sourceProps, name, defaultValue = undefined) => {
  if (!sourceProps) return defaultValue;
  return sourceProps[name] !== undefined ? sourceProps[name] : defaultValue;
};

const GetItemKeyFromSource = (source, index, vnode = null) => {
  const explicitKey = vnode?.key ?? source?.Key ?? source?.Id ?? source?.Name;
  if (explicitKey !== undefined && explicitKey !== null) return explicitKey;
  if (vnode && source?.Text !== undefined && source?.Text !== null) return `slot:${index}:${String(source.Text)}`;
  if (source && typeof source === 'object') {
    const rawSource = toRaw(source);
    if (!objectKeys.has(rawSource)) objectKeys.set(rawSource, ++nextObjectKey);
    return `object:${objectKeys.get(rawSource)}`;
  }
  return `${index}:${String(source ?? '')}`;
};

const NormalizeItem = (source, index, vnode = null) => ({
  Source: source,
  Key: GetItemKeyFromSource(source, index, vnode),
  Text: GetProp(source, 'Text', ''),
  Icon: GetProp(source, 'Icon', ''),
  IsSelected: coerceBoolean(GetProp(source, 'IsSelected', false)),
  IsEnabled: coerceBoolean(GetProp(source, 'IsEnabled', true), true),
  Padding: GetProp(source, 'Padding', '12,10,12,7'),
  Width: GetProp(source, 'Width', ''),
  Height: GetProp(source, 'Height', ''),
  MinWidth: GetProp(source, 'MinWidth', ''),
  MaxWidth: GetProp(source, 'MaxWidth', ''),
  HorizontalContentAlignment: GetProp(source, 'HorizontalContentAlignment', 'Center'),
  VerticalContentAlignment: GetProp(source, 'VerticalContentAlignment', 'Center')
});

const SlotItems = computed(() => NormalizeChildren(slots.default?.() ?? [])
  .filter((vnode) => GetVNodeTypeName(vnode) === 'WinSelectorBarItem' || GetProp(vnode.props, 'Text') !== undefined)
  .map((vnode, index) => NormalizeItem(vnode.props ?? {}, index, vnode)));

const Items = computed(() => {
  if (Array.isArray(props.Items)) {
    return props.Items.map((item, index) => NormalizeItem(item, index));
  }
  return SlotItems.value;
});

const rootStyle = computed(() => {
  const style = {
    background: props.Background,
    borderColor: props.BorderBrush,
    borderRadius: cssLength(props.CornerRadius)
  };

  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MinHeight !== '') style.minHeight = cssLength(props.MinHeight);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.MaxHeight !== '') style.maxHeight = cssLength(props.MaxHeight);
  if (props.HorizontalAlignment) style.justifySelf = selfAlignment(props.HorizontalAlignment);
  if (props.VerticalAlignment) style.alignSelf = selfAlignment(props.VerticalAlignment);

  return style;
});

const itemsViewStyle = computed(() => {
  const style = {
    padding: xamlThickness(props.Padding)
  };
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.MaxHeight !== '') style.maxHeight = cssLength(props.MaxHeight);
  return style;
});

const SelectedItem = computed(() => Items.value[CurrentSelectedIndex.value] ?? null);
const GetItemKey = (Item, Index) => Item.Key ?? GetItemKeyFromSource(Item.Source, Index);
const GetText = (Item) => Item.Text === undefined || Item.Text === null ? '' : String(Item.Text);
const HasText = (Item) => GetText(Item).length > 0;
const HasIcon = (Item) => Item.Icon !== undefined && Item.Icon !== null && String(Item.Icon).length > 0;
const GetIsEnabled = (Item) => Item.IsEnabled !== false;
const IsIconMarkup = (Icon) => String(Icon ?? '').trim().startsWith('<') || String(Icon ?? '').trim().startsWith('&');
const GetIconContent = (Icon) => {
  const value = String(Icon ?? '');
  return iconMap[value] ?? value;
};

const GetItemClass = (Item, Index) => ({
  'is-selected': Index === CurrentSelectedIndex.value,
  'is-unselected': Index !== CurrentSelectedIndex.value,
  'is-disabled': !EffectiveIsEnabled.value || !GetIsEnabled(Item),
  'has-icon': HasIcon(Item),
  'has-text': HasText(Item)
});

const GetItemStyle = (Item) => {
  const style = {
    '--win-selector-bar-item-padding': xamlThickness(Item.Padding),
    justifyContent: flexAlignment(Item.HorizontalContentAlignment),
    alignItems: flexVerticalAlignment(Item.VerticalContentAlignment)
  };
  if (Item.Width !== '') style.width = cssLength(Item.Width);
  if (Item.Height !== '') style.height = cssLength(Item.Height);
  if (Item.MinWidth !== '') style.minWidth = cssLength(Item.MinWidth);
  if (Item.MaxWidth !== '') style.maxWidth = cssLength(Item.MaxWidth);
  return style;
};

const FirstEnabledIndex = () => Items.value.findIndex((Item) => GetIsEnabled(Item));
const GetItemTabIndex = (Item, Index) => {
  if (!EffectiveIsEnabled.value || !GetIsEnabled(Item)) return -1;
  if (CurrentSelectedIndex.value >= 0) return Index === CurrentSelectedIndex.value ? 0 : -1;
  return Index === FirstEnabledIndex() ? 0 : -1;
};

const SetItemRef = (Index, element) => {
  if (element) itemRefs.set(Index, element);
  else itemRefs.delete(Index);
};

const ResolveSelectedIndex = () => {
  const itemCount = Items.value.length;
  if (!itemCount) return -1;

  if (props.SelectedItem !== undefined && props.SelectedItem !== null) {
    const selectedItemIndex = Items.value.findIndex((Item) => isSameItem(Item.Source, props.SelectedItem));
    if (selectedItemIndex < 0) {
      throw new Error('SelectedItem must be an element of Items.');
    }
    return selectedItemIndex;
  }

  if (props.SelectedItem === null) return -1;

  return Items.value.findIndex((Item) => Item.IsSelected);
};

const SyncSelectionFromProps = () => {
  const nextIndex = ResolveSelectedIndex();
  if (nextIndex !== CurrentSelectedIndex.value) {
    CurrentSelectedIndex.value = nextIndex;
    FocusedIndex.value = nextIndex;
  }
};

const SyncSelectionFromItems = () => {
  if (props.SelectedItem !== undefined) {
    SyncSelectionFromProps();
    return;
  }

  if (CurrentSelectedIndex.value >= Items.value.length) {
    CurrentSelectedIndex.value = -1;
    FocusedIndex.value = -1;
  }

  if (CurrentSelectedIndex.value < 0) {
    SyncSelectionFromProps();
  }
};

const ChangeSelection = async (Index, isUserInitiated = false) => {
  if (!EffectiveIsEnabled.value) return;
  if (Index < 0 || Index >= Items.value.length) return;

  const nextItem = Items.value[Index];
  if (!nextItem || !GetIsEnabled(nextItem)) return;
  if (Index === CurrentSelectedIndex.value) return;

  CurrentSelectedIndex.value = Index;
  FocusedIndex.value = Index;

  emit('update:SelectedItem', nextItem.Source);
  emit('SelectionChanged', GetSender(), Object.freeze({}));

  if (isUserInitiated) {
    await nextTick();
    itemRefs.get(Index)?.focus?.({ preventScroll: true });
  }
};

const GetPublicItems = () => Items.value.map((Item) => Item.Source);
const GetPublicSelectedItem = () => SelectedItem.value?.Source ?? null;
const SetPublicSelectedItem = (value) => {
  const index = Items.value.findIndex((Item) => isSameItem(Item.Source, value));
  if (index < 0 && value !== null && value !== undefined) {
    throw new Error('SelectedItem must be an element of Items.');
  }
  if (index === CurrentSelectedIndex.value) return;

  CurrentSelectedIndex.value = index;
  FocusedIndex.value = index;
  emit('update:SelectedItem', value ?? null);
  emit('SelectionChanged', GetSender(), Object.freeze({}));
};

const PublicSelectorBar = {
  get Items() {
    return GetPublicItems();
  },
  get SelectedItem() {
    return GetPublicSelectedItem();
  },
  set SelectedItem(value) {
    SetPublicSelectedItem(value);
  }
};

const GetSender = () => PublicSelectorBar;

const GetEnabledIndices = () => Items.value
  .map((Item, Index) => (GetIsEnabled(Item) && EffectiveIsEnabled.value ? Index : null))
  .filter((Index) => Index !== null);

const OnItemKeyDown = (event, Index) => {
  const enabledIndices = GetEnabledIndices();
  const currentPosition = enabledIndices.indexOf(Index);
  if (currentPosition < 0) return;

  let nextPosition = currentPosition;
  if (event.key === 'ArrowRight') nextPosition = Math.min(enabledIndices.length - 1, currentPosition + 1);
  else if (event.key === 'ArrowLeft') nextPosition = Math.max(0, currentPosition - 1);
  else if (event.key === 'Home') nextPosition = 0;
  else if (event.key === 'End') nextPosition = enabledIndices.length - 1;
  else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    ChangeSelection(Index, true);
    return;
  } else {
    return;
  }

  event.preventDefault();
  ChangeSelection(enabledIndices[nextPosition], true);
};

watch(() => props.SelectedItem, SyncSelectionFromProps);

watch(Items, SyncSelectionFromItems, { immediate: true });

onMounted(() => {
  SyncSelectionFromProps();
});

defineExpose({
  get Items() {
    return GetPublicItems();
  },
  get SelectedItem() {
    return GetPublicSelectedItem();
  },
  set SelectedItem(value) {
    SetPublicSelectedItem(value);
  }
});
</script>

<style scoped>
.win-selector-bar {
  display: inline-grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  min-width: 0;
  border: 0 solid transparent;
  color: var(--SelectorBarItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
}

.win-selector-bar-items-view {
  display: flex;
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.win-selector-bar-items-view::-webkit-scrollbar {
  display: none;
}

.win-selector-bar-item {
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  position: relative;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 3px;
  min-width: 0;
  min-height: 40px;
  margin: 0;
  padding: 0;
  flex: 0 0 auto;
  color: var(--SelectorBarItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  background: var(--SelectorBarItemBackground, transparent);
  background-image: none;
  border: 1px solid var(--SelectorBarItemBorderBrush, transparent);
  border-style: solid;
  border-radius: var(--ControlCornerRadius, 4px);
  box-shadow: none;
  outline: none;
  font: inherit;
  line-height: normal;
  text-align: inherit;
  text-decoration: none;
  text-transform: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}

.win-selector-bar-item:disabled {
  cursor: default;
}

.win-selector-bar-item-content {
  position: relative;
  z-index: 1;
  grid-row: 1;
  grid-column: 1;
  display: flex;
  align-items: center;
  justify-content: inherit;
  gap: var(--SelectorBarItemSpacing, 8px);
  min-width: 0;
  margin: var(--win-selector-bar-item-padding, 10px 12px 7px 12px);
  color: inherit;
  text-align: left;
}

.win-selector-bar-item-icon {
  width: 20px;
  height: 20px;
  margin: 0 -2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font-size: 20px;
  line-height: 20px;
  transform: scale(var(--SelectorBarItemIconScale, 0.8));
  transform-origin: 50% 50%;
  flex: 0 0 20px;
}

.win-selector-bar-item-icon-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}

.win-selector-bar-item-icon-glyph :deep(img),
.win-selector-bar-item-icon-glyph img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.win-selector-bar-item-text {
  min-width: 0;
  color: inherit;
  font-size: var(--ControlContentThemeFontSize, 14px);
  font-weight: 400;
  line-height: 20px;
  white-space: normal;
}

.win-selector-bar-item-selection-visual {
  position: relative;
  z-index: 1;
  grid-row: 2;
  grid-column: 1;
  justify-self: center;
  align-self: end;
  width: var(--SelectorBarItemPillWidth, 4px);
  height: var(--SelectorBarItemPillHeight, 3px);
  opacity: 0;
  background: var(--SelectorBarItemPillFill, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  border-radius: var(--SelectorBarItemPillCornerRadius, 2px);
  transition: none;
  pointer-events: none;
}

.win-selector-bar-item-common-visual {
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 1px solid var(--SelectorBarItemBorderBrush, transparent);
  border-radius: inherit;
  background: transparent;
  pointer-events: none;
}

.win-selector-bar-item:hover:not(:disabled) {
  color: var(--SelectorBarItemForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
  background: var(--SelectorBarItemBackgroundPointerOver, transparent);
}

.win-selector-bar-item:active:not(:disabled) {
  color: var(--SelectorBarItemForegroundPressed, var(--text-tertiary));
  background: var(--SelectorBarItemBackgroundPressed, transparent);
}

.win-selector-bar-item.is-selected {
  color: var(--SelectorBarItemForegroundSelected, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  background: var(--SelectorBarItemBackgroundSelected, transparent);
}

.win-selector-bar-item.is-selected:hover:not(:disabled),
.win-selector-bar-item.is-selected:active:not(:disabled) {
  color: var(--SelectorBarItemForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
}

.win-selector-bar-item.is-selected .win-selector-bar-item-selection-visual {
  opacity: 1;
  width: var(--SelectorBarItemPillSelectedWidth, 16px);
  animation: win-selector-bar-selection-visual-show var(--ComboBoxItemScaleAnimationDuration, 0.167s) var(--fast-out-slow-in, cubic-bezier(0, 0, 0, 1)) both;
}

.win-selector-bar-item.is-disabled {
  color: var(--SelectorBarItemForegroundDisabled, var(--TextFillColorDisabledBrush, var(--text-disabled)));
  background: var(--SelectorBarItemBackgroundDisabled, transparent);
}

.win-selector-bar-item.is-disabled .win-selector-bar-item-selection-visual {
  background: var(--SelectorBarItemDisabledPillFill, var(--AccentFillColorDisabledBrush, var(--accent-fill-disabled)));
}

.win-selector-bar-item:focus-visible {
  outline: 2px solid var(--focus-stroke-outer, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  outline-offset: var(--SelectorBarItemFocusVisualMargin, -2px);
}

@media (prefers-reduced-motion: reduce) {
  .win-selector-bar-item.is-selected .win-selector-bar-item-selection-visual {
    animation: none;
  }
}

@keyframes win-selector-bar-selection-visual-show {
  from {
    width: var(--SelectorBarItemPillWidth, 4px);
    opacity: 0;
  }
  to {
    width: var(--SelectorBarItemPillSelectedWidth, 16px);
    opacity: 1;
  }
}
</style>
