<template>
  <nav
    ref="rootRef"
    v-bind="rootAttrs"
    :class="['win-breadcrumb-bar', attrs.class]"
    :style="attrs.style"
    role="navigation"
    :aria-disabled="IsEnabled ? undefined : 'true'"
    :dir="effectiveFlowDirection">
    <div class="win-breadcrumb-items-repeater">
      <div
        ref="ellipsisLayoutRef"
        class="win-breadcrumb-layout-root win-breadcrumb-ellipsis-item"
        :class="{ 'is-crumbled': !ellipsisIsRendered }"
        :aria-hidden="ellipsisIsRendered ? undefined : 'true'"
        :inert="ellipsisIsRendered ? undefined : ''">
        <WinButton
          ref="ellipsisButtonRef"
          class="win-breadcrumb-item-button win-breadcrumb-ellipsis-button"
          :IsEnabled="IsEnabled"
          :tabindex="getTabIndex(ELLIPSIS_INDEX)"
          :aria-label="t('text.more')"
          @focus="OnItemGotFocus(ELLIPSIS_INDEX)"
          @Click="OpenFlyout"
          @keydown="OnItemKeyDown($event, ELLIPSIS_INDEX)">
          <WinTextBlock
            class="win-breadcrumb-ellipsis-glyph icon"
            Text="&#xE712;"
            FontFamily="var(--SymbolThemeFontFamily, 'Segoe Fluent Icons')"
            :IsTextScaleFactorEnabled="false" />
        </WinButton>
        <WinTextBlock
          class="win-breadcrumb-chevron icon"
          :Text="ChevronGlyph"
          FontFamily="var(--SymbolThemeFontFamily, 'Segoe Fluent Icons')"
          FontSize="12"
          :IsTextScaleFactorEnabled="false"
          aria-hidden="true" />
      </div>

      <div
        v-for="(Item, Index) in Items"
        :key="GetItemKey(Item, Index)"
        :ref="(element) => SetItemLayoutRef(Index, element)"
        class="win-breadcrumb-layout-root"
        :class="{
          'is-current': Index === Items.length - 1,
          'is-crumbled': IsItemCrumbled(Index),
          'is-disabled': !GetIsEnabled(Item)
        }"
        :aria-hidden="IsItemCrumbled(Index) ? 'true' : undefined"
        :inert="IsItemCrumbled(Index) ? '' : undefined">
        <WinButton
          v-if="Index < Items.length - 1"
          :ref="(element) => SetItemControlRef(Index, element)"
          class="win-breadcrumb-item-button"
          :IsEnabled="GetIsEnabled(Item)"
          :tabindex="IsItemCrumbled(Index) ? -1 : getTabIndex(Index)"
          :aria-posinset="IsItemCrumbled(Index) ? undefined : Index - firstRenderedItemIndex + 1"
          :aria-setsize="IsItemCrumbled(Index) ? undefined : visibleItemsCount"
          @focus="OnItemGotFocus(Index)"
          @Click="RaiseItemClickedEvent(Item, Index)"
          @keydown="OnItemKeyDown($event, Index)">
          <slot name="ItemTemplate" :Item="Item" :Index="Index">
            <component
              :is="ItemTemplate"
              v-if="ItemTemplate"
              :Item="Item"
              :Index="Index" />
            <WinTextBlock
              v-else
              class="win-breadcrumb-item-content"
              :Text="GetItemText(Item)"
              LineHeight="20"
              TextWrapping="NoWrap" />
          </slot>
        </WinButton>

        <div
          v-else
          :ref="(element) => SetItemControlRef(Index, element)"
          class="win-breadcrumb-current-item"
          :class="{ 'is-disabled': !GetIsEnabled(Item) }"
          role="button"
          :aria-disabled="GetIsEnabled(Item) ? undefined : 'true'"
          :tabindex="IsItemCrumbled(Index) ? -1 : getTabIndex(Index)"
          :aria-posinset="IsItemCrumbled(Index) ? undefined : Index - firstRenderedItemIndex + 1"
          :aria-setsize="IsItemCrumbled(Index) ? undefined : visibleItemsCount"
          @focus="OnItemGotFocus(Index)"
          @keydown="OnItemKeyDown($event, Index)">
          <slot name="ItemTemplate" :Item="Item" :Index="Index">
            <component
              :is="ItemTemplate"
              v-if="ItemTemplate"
              :Item="Item"
              :Index="Index" />
            <WinTextBlock
              v-else
              class="win-breadcrumb-item-content"
              :Text="GetItemText(Item)"
              LineHeight="20"
              TextWrapping="NoWrap" />
          </slot>
        </div>

        <WinTextBlock
          v-if="Index < Items.length - 1"
          class="win-breadcrumb-chevron icon"
          :Text="ChevronGlyph"
          FontFamily="var(--SymbolThemeFontFamily, 'Segoe Fluent Icons')"
          FontSize="12"
          :IsTextScaleFactorEnabled="false"
          aria-hidden="true" />
      </div>
    </div>
  </nav>

  <WinMenuFlyout
    :Open="ellipsisFlyoutIsOpen"
    :AnchorRect="ellipsisAnchorRect"
    Placement="Bottom"
    :MinWidth="20"
    @Close="CloseFlyout">
    <div class="win-breadcrumb-flyout-items" role="menu">
      <WinButton
        v-for="({ Item, Index }, FlyoutIndex) in HiddenItems"
        :key="GetItemKey(Item, Index)"
        :ref="(element) => SetFlyoutItemRef(FlyoutIndex, element)"
        class="win-breadcrumb-flyout-item"
        Style="{StaticResource SubtleButtonStyle}"
        :IsEnabled="GetIsEnabled(Item)"
        role="menuitem"
        :data-breadcrumb-owner="instanceId"
        :aria-posinset="FlyoutIndex + 1"
        :aria-setsize="HiddenItems.length"
        @Click="OnEllipsisDropDownItemClick(Item, Index)"
        @keydown="OnFlyoutItemKeyDown($event, FlyoutIndex)">
        <slot name="ItemTemplate" :Item="Item" :Index="Index">
          <component
            :is="ItemTemplate"
            v-if="ItemTemplate"
            :Item="Item"
            :Index="Index" />
          <WinTextBlock
            v-else
            class="win-breadcrumb-flyout-item-content"
            :Text="GetItemText(Item)"
            LineHeight="20"
            TextWrapping="NoWrap" />
        </slot>
      </WinButton>
    </div>
  </WinMenuFlyout>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import WinButton from './WinButton.vue';
import WinMenuFlyout from './WinMenuFlyout.vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';

const ELLIPSIS_INDEX = -1;

defineOptions({
  inheritAttrs: false
});

const componentInstance = getCurrentInstance();
const props = defineProps({
  ItemsSource: { type: [Array, Object], default: null },
  ItemTemplate: { type: [Object, Function, String], default: null },
  FlowDirection: { type: String, default: '' },
  IsEnabled: { type: Boolean, default: true }
});

const emit = defineEmits(['ItemClicked']);
const { t } = useI18n();
const attrs = useAttrs();
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const instanceId = `breadcrumb-${componentInstance?.uid ?? 0}`;
const rootRef = ref(null);
const ellipsisLayoutRef = ref(null);
const ellipsisButtonRef = ref(null);
const itemLayoutRefs = new Map();
const itemControlRefs = new Map();
const flyoutItemRefs = new Map();
const firstRenderedItemIndex = ref(0);
const ellipsisIsRendered = ref(false);
const ellipsisFlyoutIsOpen = ref(false);
const ellipsisAnchorRect = ref(null);
const focusedIndex = ref(null);
const inheritedFlowDirection = ref('ltr');
let resizeObserver;
let measureFrame = 0;
let nextObjectKey = 0;
const objectKeys = new WeakMap();

const Items = computed(() => {
  if (Array.isArray(props.ItemsSource)) return props.ItemsSource;
  if (props.ItemsSource && typeof props.ItemsSource[Symbol.iterator] === 'function') {
    return Array.from(props.ItemsSource);
  }
  return [];
});

const effectiveFlowDirection = computed(() => {
  if (props.FlowDirection === 'RightToLeft') return 'rtl';
  if (props.FlowDirection === 'LeftToRight') return 'ltr';
  return inheritedFlowDirection.value;
});

const ChevronGlyph = computed(() => effectiveFlowDirection.value === 'rtl' ? '\uE973' : '\uE974');
const visibleItemsCount = computed(() => Math.max(0, Items.value.length - firstRenderedItemIndex.value));
const HiddenItems = computed(() => Items.value
  .slice(0, firstRenderedItemIndex.value)
  .map((Item, Index) => ({ Item, Index }))
  .reverse());

const UnwrapElement = (value) => value?.$el ?? value ?? null;

const GetItemKey = (Item, Index) => {
  if (Item && typeof Item === 'object') {
    const explicitKey = Item.Key ?? Item.Id ?? Item.id;
    if (explicitKey !== undefined && explicitKey !== null) return explicitKey;
    if (!objectKeys.has(Item)) objectKeys.set(Item, ++nextObjectKey);
    return `object:${objectKeys.get(Item)}`;
  }
  return `${Index}:${String(Item)}`;
};

const GetItemText = (Item) => {
  if (Item === null || Item === undefined) return '';
  return String(Item);
};

const GetIsEnabled = (Item) => props.IsEnabled && Item?.IsEnabled !== false;
const IsItemCrumbled = (Index) => ellipsisIsRendered.value && Index < firstRenderedItemIndex.value;

const SetItemLayoutRef = (Index, element) => {
  if (element) itemLayoutRefs.set(Index, UnwrapElement(element));
  else itemLayoutRefs.delete(Index);
};

const SetItemControlRef = (Index, element) => {
  if (element) itemControlRefs.set(Index, UnwrapElement(element));
  else itemControlRefs.delete(Index);
};

const SetFlyoutItemRef = (Index, element) => {
  if (element) flyoutItemRefs.set(Index, UnwrapElement(element));
  else flyoutItemRefs.delete(Index);
};

const GetDefaultFocusIndex = () => {
  if (!props.IsEnabled || !Items.value.length) return null;
  if (ellipsisIsRendered.value) return ELLIPSIS_INDEX;
  const firstEnabledIndex = Items.value.findIndex((Item) => GetIsEnabled(Item));
  return firstEnabledIndex >= 0 ? firstEnabledIndex : null;
};

const getTabIndex = (Index) => {
  const effectiveFocusedIndex = focusedIndex.value ?? GetDefaultFocusIndex();
  return effectiveFocusedIndex === Index ? 0 : -1;
};

const GetFocusableIndices = () => {
  const indices = [];
  if (props.IsEnabled && ellipsisIsRendered.value) indices.push(ELLIPSIS_INDEX);
  for (let Index = firstRenderedItemIndex.value; Index < Items.value.length; Index += 1) {
    if (GetIsEnabled(Items.value[Index])) indices.push(Index);
  }
  return indices;
};

const GetControlElement = (Index) => {
  if (Index === ELLIPSIS_INDEX) return UnwrapElement(ellipsisButtonRef.value);
  return itemControlRefs.get(Index) ?? null;
};

const FocusItem = (Index) => {
  focusedIndex.value = Index;
  nextTick(() => GetControlElement(Index)?.focus());
};

const EnsureValidFocusIndex = () => {
  const focusableIndices = GetFocusableIndices();
  if (!focusableIndices.length) {
    focusedIndex.value = null;
    return;
  }

  if (!focusableIndices.includes(focusedIndex.value)) {
    focusedIndex.value = focusableIndices[0];
  }
};

const MeasureBreadcrumbs = () => {
  measureFrame = 0;
  const root = rootRef.value;
  if (!root || !Items.value.length) {
    ellipsisIsRendered.value = false;
    firstRenderedItemIndex.value = 0;
    EnsureValidFocusIndex();
    return;
  }

  inheritedFlowDirection.value = getComputedStyle(root).direction === 'rtl' ? 'rtl' : 'ltr';
  const availableWidth = root.clientWidth;
  const itemWidths = Items.value.map((_, Index) => itemLayoutRefs.get(Index)?.getBoundingClientRect().width ?? 0);
  const totalWidth = itemWidths.reduce((sum, width) => sum + width, 0);
  const shouldRenderEllipsis = totalWidth > availableWidth;

  ellipsisIsRendered.value = shouldRenderEllipsis;
  if (!shouldRenderEllipsis) {
    firstRenderedItemIndex.value = 0;
    EnsureValidFocusIndex();
    return;
  }

  const ellipsisWidth = UnwrapElement(ellipsisLayoutRef.value)?.getBoundingClientRect().width ?? 0;
  let firstIndex = Items.value.length - 1;
  let accumulatedWidth = (itemWidths[firstIndex] ?? 0) + ellipsisWidth;

  for (let Index = Items.value.length - 2; Index >= 0; Index -= 1) {
    const nextWidth = accumulatedWidth + (itemWidths[Index] ?? 0);
    if (nextWidth > availableWidth) break;
    accumulatedWidth = nextWidth;
    firstIndex = Index;
  }

  firstRenderedItemIndex.value = firstIndex;
  EnsureValidFocusIndex();
};

const RequestMeasure = () => {
  if (measureFrame) cancelAnimationFrame(measureFrame);
  measureFrame = requestAnimationFrame(MeasureBreadcrumbs);
};

const ObserveLayoutElements = () => {
  if (!resizeObserver) return;
  resizeObserver.disconnect();
  if (rootRef.value) resizeObserver.observe(rootRef.value);
  if (UnwrapElement(ellipsisLayoutRef.value)) resizeObserver.observe(UnwrapElement(ellipsisLayoutRef.value));
  itemLayoutRefs.forEach((element) => resizeObserver.observe(element));
};

const RaiseItemClickedEvent = (Item, Index) => {
  if (!GetIsEnabled(Item)) return;
  emit('ItemClicked', componentInstance?.proxy, Object.freeze({ Index, Item }));
};

const OnItemGotFocus = (Index) => {
  focusedIndex.value = Index;
};

const OpenFlyout = async () => {
  if (!props.IsEnabled || !ellipsisIsRendered.value || !HiddenItems.value.length) return;
  const ellipsisButton = GetControlElement(ELLIPSIS_INDEX);
  if (!ellipsisButton) return;

  ellipsisAnchorRect.value = ellipsisButton.getBoundingClientRect();
  ellipsisFlyoutIsOpen.value = true;
  await nextTick();
  requestAnimationFrame(() => {
    const firstFocusableIndex = HiddenItems.value.findIndex(({ Item }) => GetIsEnabled(Item));
    if (firstFocusableIndex >= 0) flyoutItemRefs.get(firstFocusableIndex)?.focus();
  });
};

const CloseFlyout = () => {
  ellipsisFlyoutIsOpen.value = false;
};

const OnEllipsisDropDownItemClick = (Item, Index) => {
  if (!GetIsEnabled(Item)) return;
  CloseFlyout();
  RaiseItemClickedEvent(Item, Index);
};

const OnItemKeyDown = (event, Index) => {
  const forwardKey = effectiveFlowDirection.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const backwardKey = effectiveFlowDirection.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

  if (event.key === 'Enter' || event.key === ' ') {
    if (Index === Items.value.length - 1) {
      event.preventDefault();
      RaiseItemClickedEvent(Items.value[Index], Index);
    }
    return;
  }

  if (event.key !== forwardKey && event.key !== backwardKey) return;
  const focusableIndices = GetFocusableIndices();
  const currentPosition = focusableIndices.indexOf(Index);
  if (currentPosition < 0) return;

  const direction = event.key === forwardKey ? 1 : -1;
  const nextPosition = currentPosition + direction;
  if (nextPosition < 0 || nextPosition >= focusableIndices.length) return;
  event.preventDefault();
  FocusItem(focusableIndices[nextPosition]);
};

const OnFlyoutItemKeyDown = (event, FlyoutIndex) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    CloseFlyout();
    FocusItem(ELLIPSIS_INDEX);
    return;
  }

  const focusableIndices = HiddenItems.value
    .map(({ Item }, Index) => GetIsEnabled(Item) ? Index : null)
    .filter((Index) => Index !== null);
  const currentPosition = focusableIndices.indexOf(FlyoutIndex);
  if (currentPosition < 0) return;

  let nextPosition = currentPosition;
  if (event.key === 'ArrowDown') nextPosition = Math.min(focusableIndices.length - 1, currentPosition + 1);
  else if (event.key === 'ArrowUp') nextPosition = Math.max(0, currentPosition - 1);
  else if (event.key === 'Home') nextPosition = 0;
  else if (event.key === 'End') nextPosition = focusableIndices.length - 1;
  else return;

  event.preventDefault();
  flyoutItemRefs.get(focusableIndices[nextPosition])?.focus();
};

watch(
  () => props.ItemsSource,
  async () => {
    CloseFlyout();
    await nextTick();
    ObserveLayoutElements();
    RequestMeasure();
  },
  { deep: true }
);

watch(() => props.ItemTemplate, async () => {
  await nextTick();
  ObserveLayoutElements();
  RequestMeasure();
});

onMounted(async () => {
  resizeObserver = new ResizeObserver(RequestMeasure);
  await nextTick();
  ObserveLayoutElements();
  RequestMeasure();
  document.fonts?.ready.then(RequestMeasure);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (measureFrame) cancelAnimationFrame(measureFrame);
});
</script>

<style scoped>
.win-breadcrumb-bar {
  width: 100%;
  min-width: 0;
  display: block;
  overflow: hidden;
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
}

.win-breadcrumb-items-repeater {
  position: relative;
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  white-space: nowrap;
}

.win-breadcrumb-layout-root {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  border-radius: var(--ControlCornerRadius, 4px);
  color: var(--text-primary);
}

.win-breadcrumb-layout-root.is-crumbled {
  position: fixed;
  top: -10000px;
  left: -10000px;
  visibility: hidden;
  pointer-events: none;
}

.win-breadcrumb-item-button {
  min-width: 0;
  min-height: 0;
  height: auto;
  padding: 3px 1px;
  gap: 0;
  justify-content: flex-start;
  border-radius: var(--ControlCornerRadius, 4px);
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
  font-weight: normal;
  line-height: 20px;
  --ButtonBackground: transparent;
  --ButtonBackgroundPointerOver: transparent;
  --ButtonBackgroundPressed: transparent;
  --ButtonBackgroundDisabled: transparent;
  --ButtonForeground: var(--text-primary);
  --ButtonForegroundPointerOver: var(--text-secondary);
  --ButtonForegroundPressed: var(--text-tertiary);
  --ButtonForegroundDisabled: var(--text-disabled);
  --ButtonBorderBrush: transparent;
  --ButtonBorderBrushTop: var(--ButtonBorderBrush);
  --ButtonBorderBrushPointerOver: transparent;
  --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushPointerOver);
  --ButtonBorderBrushPressed: transparent;
  --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
  --ButtonBorderBrushDisabled: transparent;
  --ButtonBorderBrushDisabledTop: var(--ButtonBorderBrushDisabled);
  --ButtonBorderBrushBottom: transparent;
  --ButtonBorderBrushPointerOverBottom: transparent;
  --ButtonBorderBrushPressedBottom: transparent;
  --ButtonBorderBrushDisabledBottom: transparent;
}

.win-breadcrumb-item-button::after {
  display: none;
}

.win-breadcrumb-item-button:disabled,
.win-breadcrumb-flyout-item:disabled {
  cursor: default;
}

.win-breadcrumb-item-button:focus-visible,
.win-breadcrumb-current-item:focus-visible {
  outline: 2px solid var(--focus-stroke-outer, var(--text-primary));
  outline-offset: -1px;
}

.win-breadcrumb-item-content,
.win-breadcrumb-flyout-item-content {
  color: inherit;
  font-size: inherit;
  font-weight: normal;
  line-height: 20px;
  white-space: nowrap;
}

.win-breadcrumb-current-item {
  min-width: 0;
  min-height: 26px;
  padding: 3px 1px;
  display: flex;
  align-items: center;
  border-radius: var(--ControlCornerRadius, 4px);
  color: var(--text-primary);
  font-size: var(--ControlContentThemeFontSize, 14px);
  font-weight: normal;
  line-height: 20px;
  outline: none;
}

.win-breadcrumb-current-item.is-disabled {
  color: var(--text-disabled);
}

.win-breadcrumb-chevron {
  align-self: center;
  padding: 0 2px;
  color: var(--text-primary);
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
}

.win-breadcrumb-ellipsis-glyph {
  padding: 3px;
  color: inherit;
  font-size: var(--ControlContentThemeFontSize, 14px);
  line-height: 20px;
}
</style>

<style>
.win-menu-flyout:has(.win-breadcrumb-flyout-items) {
  min-height: 40px;
  max-width: min(320px, calc(100vw - 16px));
  padding: 2px 0;
}

.win-breadcrumb-flyout-items {
  min-width: max-content;
  display: flex;
  flex-direction: column;
}

.win-breadcrumb-flyout-item {
  width: calc(100% - 10px);
  min-height: 36px;
  margin: 3px 5px;
  padding: 7px 11px 9px;
  justify-content: flex-start;
  gap: 0;
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
  font-weight: normal;
  line-height: 20px;
  --SubtleButtonForegroundPressed: var(--text-primary);
}

.win-breadcrumb-flyout-item::after {
  display: none;
}
</style>
