<template>
  <div
    ref="rootRef"
    v-bind="rootAttrs"
    :class="['win-pivot', attrs.class, { 'is-locked': EffectiveIsLocked, 'is-disabled': !EffectiveIsEnabled }]"
    :style="[attrs.style, rootStyle]"
    role="presentation"
    :dir="effectiveFlowDirection"
    :aria-disabled="EffectiveIsEnabled ? undefined : 'true'">
    <div
      v-if="HasTitle"
      class="win-pivot-title-content-control">
      <slot name="TitleTemplate" :Title="EffectiveTitle">
        <component
          :is="EffectiveTitleTemplate"
          v-if="EffectiveTitleTemplate"
          :Title="EffectiveTitle" />
        <WinTextBlock
          v-else
          class="win-pivot-title"
          :Text="EffectiveTitle"
          FontSize="14"
          FontWeight="700"
          TextWrapping="NoWrap" />
      </slot>
    </div>

    <div
      class="win-pivot-template-grid"
      :style="templateGridStyle">
      <div class="win-pivot-layout-element">
        <div
          v-if="$slots.LeftHeader || LeftHeader || LeftHeaderTemplate"
          class="win-pivot-left-header-presenter">
          <slot name="LeftHeader">
            <component
              :is="LeftHeaderTemplate"
              v-if="LeftHeaderTemplate"
              :Content="LeftHeader" />
            <WinTextBlock
              v-else
              :Text="LeftHeader"
              TextWrapping="NoWrap" />
          </slot>
        </div>

        <div class="win-pivot-header-clipper">
          <WinScrollViewer
            ref="headerScrollerRef"
            class="win-pivot-header-scroll-viewer"
            HorizontalScrollMode="Auto"
            HorizontalScrollBarVisibility="Hidden"
            VerticalScrollMode="Disabled"
            VerticalScrollBarVisibility="Disabled"
            ZoomMode="Disabled"
            :IsTabStop="false"
            @ViewChanged="UpdateNavigationButtons">
            <div
              ref="headerPanelRef"
              class="win-pivot-header-panel"
              role="tablist">
              <WinButton
                v-for="(Item, Index) in Items"
                :key="GetItemKey(Item, Index)"
                :ref="(element) => SetHeaderRef(Index, element)"
                class="win-pivot-header-item"
                :class="GetHeaderClass(Item, Index)"
                :IsEnabled="EffectiveIsEnabled && !GetIsDisabled(Item)"
                :tabindex="Index === CurrentSelectedIndex ? 0 : -1"
                role="tab"
                :aria-selected="Index === CurrentSelectedIndex"
                :aria-disabled="GetIsDisabled(Item) || !EffectiveIsEnabled ? 'true' : undefined"
                @Click="ChangeSelection(Index, false, true)"
                @focus="OnHeaderGotFocus(Index)"
                @keydown="OnHeaderKeyDown($event, Index)">
                <slot name="HeaderTemplate" :Item="Item.Source" :Index="Index">
                  <component
                    :is="EffectiveHeaderTemplate"
                    v-if="EffectiveHeaderTemplate"
                    :Item="Item.Source"
                    :Index="Index" />
                  <WinTextBlock
                    v-else
                    class="win-pivot-header-content"
                    :Text="GetHeaderText(Item)"
                    FontSize="24"
                    FontWeight="300"
                    CharacterSpacing="-25"
                    TextWrapping="NoWrap"
                    OpticalMarginAlignment="TrimSideBearings" />
                </slot>
                <div
                  class="win-pivot-selected-pipe"
                  aria-hidden="true"></div>
              </WinButton>
            </div>
          </WinScrollViewer>

          <WinButton
            v-show="ShowPreviousButton"
            class="win-pivot-nav-button win-pivot-previous-button"
            :IsEnabled="EffectiveIsEnabled && CanScrollPrevious"
            :tabindex="-1"
            :aria-hidden="true"
            @Click="ScrollHeaders(-1)">
            <WinTextBlock
              class="win-pivot-nav-glyph"
              Text="&#xE76B;"
              FontFamily="var(--SymbolThemeFontFamily, 'Segoe Fluent Icons')"
              FontSize="12"
              :IsTextScaleFactorEnabled="false" />
          </WinButton>

          <WinButton
            v-show="ShowNextButton"
            class="win-pivot-nav-button win-pivot-next-button"
            :IsEnabled="EffectiveIsEnabled && CanScrollNext"
            :tabindex="-1"
            :aria-hidden="true"
            @Click="ScrollHeaders(1)">
            <WinTextBlock
              class="win-pivot-nav-glyph"
              Text="&#xE76C;"
              FontFamily="var(--SymbolThemeFontFamily, 'Segoe Fluent Icons')"
              FontSize="12"
              :IsTextScaleFactorEnabled="false" />
          </WinButton>
        </div>

        <div
          v-if="$slots.RightHeader || RightHeader || RightHeaderTemplate"
          class="win-pivot-right-header-presenter">
          <slot name="RightHeader">
            <component
              :is="RightHeaderTemplate"
              v-if="RightHeaderTemplate"
              :Content="RightHeader" />
            <WinTextBlock
              v-else
              :Text="RightHeader"
              TextWrapping="NoWrap" />
          </slot>
        </div>

        <div
          class="win-pivot-item-presenter"
          role="tabpanel">
          <div
            v-if="DisplayedSelectedItem"
            ref="itemHostRef"
            :key="DisplayedSelectedItem.Key"
            class="win-pivot-item-host">
            <component
              :is="RenderVNode"
              :vnode="DisplayedSelectedItem.VNode" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Comment, Fragment, Text, computed, defineComponent, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useSlots, watch } from 'vue';
import WinButton from './WinButton.vue';
import WinScrollViewer from './WinScrollViewer.vue';
import WinTextBlock from './WinTextBlock.vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  Title: { type: [String, Number], default: '' },
  SelectedIndex: { type: Number, default: undefined },
  SelectedItem: { type: [Object, String, Number], default: null },
  IsLocked: { type: Boolean, default: false },
  IsHeaderItemsCarouselEnabled: { type: Boolean, default: true },
  HeaderTemplate: { type: [Object, Function, String], default: null },
  TitleTemplate: { type: [Object, Function, String], default: null },
  LeftHeader: { type: [String, Number], default: '' },
  LeftHeaderTemplate: { type: [Object, Function, String], default: null },
  RightHeader: { type: [String, Number], default: '' },
  RightHeaderTemplate: { type: [Object, Function, String], default: null },
  HeaderFocusVisualPlacement: { type: String, default: 'SelectedItemHeader' },
  MinHeight: { type: [String, Number], default: '' },
  Padding: { type: [String, Number], default: '' },
  FlowDirection: { type: String, default: '' },
  IsEnabled: { type: Boolean, default: true }
});

const emit = defineEmits([
  'SelectionChanged',
  'PivotItemLoading',
  'PivotItemLoaded',
  'PivotItemUnloading',
  'PivotItemUnloaded',
  'update:SelectedIndex',
  'update:SelectedItem'
]);

const componentInstance = getCurrentInstance();
const slots = useSlots();
const attrs = useAttrs();
const rootRef = ref(null);
const headerScrollerRef = ref(null);
const headerPanelRef = ref(null);
const itemHostRef = ref(null);
const headerRefs = new Map();
const CurrentSelectedIndex = ref(props.SelectedIndex ?? 0);
const DisplayedSelectedIndex = ref(CurrentSelectedIndex.value);
const FocusedIndex = ref(CurrentSelectedIndex.value);
const SelectionAnimationState = ref('Idle');
const CanScrollPrevious = ref(false);
const CanScrollNext = ref(false);
const hasHeaderOverflow = ref(false);
const inheritedFlowDirection = ref('ltr');
let resizeObserver;
let navigationFrame = 0;
let loadToken = 0;
let activeContentAnimations = [];
let pendingSelectionRequest = null;
let nextStructureKeyId = 0;
const structureKeyIds = new Map();

const RenderVNode = defineComponent({
  name: 'WinPivotRenderVNode',
  props: {
    vnode: { type: Object, required: true }
  },
  setup(renderProps) {
    return () => renderProps.vnode;
  }
});

const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

const EffectiveTitle = computed(() => props.Title);
const HasTitle = computed(() => EffectiveTitle.value !== '' || slots.TitleTemplate || props.TitleTemplate);
const EffectiveTitleTemplate = computed(() => props.TitleTemplate);
const EffectiveHeaderTemplate = computed(() => props.HeaderTemplate);
const EffectiveIsLocked = computed(() => props.IsLocked);
const EffectiveIsEnabled = computed(() => props.IsEnabled !== false);
const EffectiveIsHeaderItemsCarouselEnabled = computed(() => props.IsHeaderItemsCarouselEnabled);
const SelectedItem = computed(() => Items.value[CurrentSelectedIndex.value] ?? null);
const DisplayedSelectedItem = computed(() => Items.value[DisplayedSelectedIndex.value] ?? null);
const ShowPreviousButton = computed(() => EffectiveIsHeaderItemsCarouselEnabled.value && hasHeaderOverflow.value && CanScrollPrevious.value);
const ShowNextButton = computed(() => EffectiveIsHeaderItemsCarouselEnabled.value && hasHeaderOverflow.value && CanScrollNext.value);
const effectiveFlowDirection = computed(() => {
  if (props.FlowDirection === 'RightToLeft') return 'rtl';
  if (props.FlowDirection === 'LeftToRight') return 'ltr';
  return inheritedFlowDirection.value;
});

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const rootStyle = computed(() => {
  const style = {};
  if (props.MinHeight !== '') style.minHeight = cssLength(props.MinHeight);
  return style;
});

const templateGridStyle = computed(() => ({
  margin: xamlThickness(props.Padding)
}));

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
  if (sourceProps[name] !== undefined) return sourceProps[name];
  return defaultValue;
};

const Items = computed(() => NormalizeChildren(slots.default?.() ?? [])
  .filter((vnode) => GetVNodeTypeName(vnode) === 'WinPivotItem' || GetProp(vnode.props, 'Header') !== undefined)
  .map((vnode, Index) => {
    const Header = GetProp(vnode.props, 'Header', '');
    const IsEnabled = GetProp(vnode.props, 'IsEnabled', true);
    const Source = vnode.props ?? { Header };
    return {
      Header,
      IsEnabled,
      Source,
      VNode: vnode,
      Key: GetItemKeyFromSource(vnode, Source, Index)
    };
  }));

const GetItemKeyFromSource = (vnode, Source, Index) => {
  const explicitKey = vnode.key ?? Source?.Key ?? Source?.Id ?? Source?.id;
  if (explicitKey !== undefined && explicitKey !== null) return explicitKey;
  return Index;
};

const GetItemKey = (Item, Index) => Item.Key ?? GetItemKeyFromSource(Item.VNode, Item.Source, Index);
const GetHeaderText = (Item) => Item.Header === null || Item.Header === undefined ? '' : String(Item.Header);
const GetIsDisabled = (Item) => Item.IsEnabled === false;
const GetStructureKey = (value) => {
  const valueType = typeof value;
  if (valueType === 'symbol' || valueType === 'object' || valueType === 'function') {
    if (!structureKeyIds.has(value)) structureKeyIds.set(value, ++nextStructureKeyId);
    return `${valueType}:${structureKeyIds.get(value)}`;
  }
  return `${valueType}:${String(value)}`;
};
const ItemsStructureKey = computed(() => Items.value.map((Item) => GetStructureKey(Item.Key)).join('\u001F'));

const GetHeaderClass = (Item, Index) => ({
  'is-selected': Index === CurrentSelectedIndex.value,
  'is-unselected': Index !== CurrentSelectedIndex.value,
  'is-disabled': GetIsDisabled(Item) || !EffectiveIsEnabled.value,
  'is-unselected-locked': EffectiveIsLocked.value && Index !== CurrentSelectedIndex.value
});

const UnwrapElement = (value) => value?.$el ?? value ?? null;

const SetHeaderRef = (Index, element) => {
  if (element) headerRefs.set(Index, UnwrapElement(element));
  else headerRefs.delete(Index);
};

const ClampSelectedIndex = () => {
  const itemCount = Items.value.length;
  if (!itemCount) {
    ++loadToken;
    CancelContentAnimations();
    SelectionAnimationState.value = 'Idle';
    pendingSelectionRequest = null;
    CurrentSelectedIndex.value = -1;
    DisplayedSelectedIndex.value = -1;
    FocusedIndex.value = -1;
    return;
  }

  const nextIndex = Math.min(Math.max(CurrentSelectedIndex.value, 0), itemCount - 1);
  CurrentSelectedIndex.value = nextIndex;
  if (DisplayedSelectedIndex.value < 0 || DisplayedSelectedIndex.value >= itemCount) {
    DisplayedSelectedIndex.value = nextIndex;
  }
  if (FocusedIndex.value < 0 || FocusedIndex.value >= itemCount) FocusedIndex.value = nextIndex;
};

const GetSender = () => componentInstance?.proxy;

const GetPivotItemArgs = (Item) => Object.freeze({ Item: Item?.Source ?? null });

const IsReducedMotionEnabled = () => typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const CancelContentAnimations = () => {
  for (const animation of activeContentAnimations) animation.cancel();
  activeContentAnimations = [];
};

const RunContentAnimations = async (
  translationKeyframes,
  opacityKeyframes,
  translationDuration,
  opacityDuration,
  translationEasing,
  opacityEasing,
  preserveFinalState = false
) => {
  const host = itemHostRef.value;
  if (!host || IsReducedMotionEnabled()) return true;
  if (typeof host.animate !== 'function') return true;

  CancelContentAnimations();
  const animations = [];

  try {
    animations.push(host.animate(translationKeyframes, {
      duration: translationDuration,
      easing: translationEasing,
      fill: 'both'
    }));
    animations.push(host.animate(opacityKeyframes, {
      duration: opacityDuration,
      easing: opacityEasing,
      fill: 'both'
    }));
    activeContentAnimations = animations;

    await Promise.all(animations.map((animation) => animation.finished));
    if (preserveFinalState) {
      for (const animation of animations) {
        try {
          animation.commitStyles?.();
        } catch {
          // The keyed host is replaced immediately after FlyOut completes.
        }
      }
    }
    return true;
  } catch {
    return false;
  } finally {
    for (const animation of animations) animation.cancel();
    if (activeContentAnimations === animations) activeContentAnimations = [];
  }
};

const AnimateOut = (direction) => RunContentAnimations(
  [
    { transform: 'translate3d(0, 0, 0)' },
    { transform: `translate3d(${direction === 'right' ? -7 : 7}px, 0, 0)` }
  ],
  [{ opacity: 1 }, { opacity: 0 }],
  83,
  67,
  'linear',
  'linear',
  true
);

const AnimateIn = (direction) => RunContentAnimations(
  [
    { transform: `translate3d(${direction === 'right' ? 20 : -20}px, 0, 0)` },
    { transform: 'translate3d(0, 0, 0)' }
  ],
  [{ opacity: 0 }, { opacity: 1 }],
  767,
  333,
  'cubic-bezier(0.1, 0.9, 0.2, 1)',
  'cubic-bezier(0.1, 0.9, 0.2, 1)'
);

const DetermineDirection = (Index, oldIndex, isFromHeaderNavigation) => {
  if (isFromHeaderNavigation || Items.value.length <= 2 || !EffectiveIsHeaderItemsCarouselEnabled.value) {
    return Index < oldIndex ? 'left' : 'right';
  }

  const previousIndex = (oldIndex - 1 + Items.value.length) % Items.value.length;
  return Index === previousIndex ? 'left' : 'right';
};

const CommitSelection = (Index, oldItem, newItem, sender) => {
  CurrentSelectedIndex.value = Index;
  DisplayedSelectedIndex.value = Index;
  FocusedIndex.value = Index;

  emit('update:SelectedIndex', Index);
  emit('update:SelectedItem', newItem.Source);
  emit('SelectionChanged', sender, Object.freeze({
    AddedItems: [newItem.Source],
    RemovedItems: oldItem ? [oldItem.Source] : []
  }));
};

const ChangeSelection = async (Index, shouldFocus = false, isUserInitiated = true) => {
  if (!EffectiveIsEnabled.value || (isUserInitiated && EffectiveIsLocked.value)) return;
  if (Index < 0 || Index >= Items.value.length) return;

  const newItem = Items.value[Index];
  if (!newItem || (isUserInitiated && GetIsDisabled(newItem))) return;

  if (SelectionAnimationState.value !== 'Idle') {
    if (SelectionAnimationState.value === 'FlyIn' && Index === CurrentSelectedIndex.value) {
      pendingSelectionRequest = null;
      if (shouldFocus) FocusHeader(Index);
      return;
    }

    pendingSelectionRequest = { Index, shouldFocus, isUserInitiated };
    return;
  }

  if (Index === CurrentSelectedIndex.value) {
    if (shouldFocus) FocusHeader(Index);
    return;
  }

  const oldIndex = CurrentSelectedIndex.value;
  const oldItem = Items.value[oldIndex] ?? null;
  const sender = GetSender();
  const token = ++loadToken;
  const direction = DetermineDirection(Index, oldIndex, isUserInitiated);

  emit('PivotItemUnloading', sender, GetPivotItemArgs(oldItem));
  emit('PivotItemLoading', sender, GetPivotItemArgs(newItem));

  if (IsReducedMotionEnabled()) {
    CommitSelection(Index, oldItem, newItem, sender);
    await nextTick();
    EnsureSelectedHeaderInView();
    if (shouldFocus) FocusHeader(Index);
    emit('PivotItemUnloaded', sender, GetPivotItemArgs(oldItem));
    emit('PivotItemLoaded', sender, GetPivotItemArgs(newItem));
    return;
  }

  SelectionAnimationState.value = 'FlyOut';

  try {
    if (!await AnimateOut(direction) || token !== loadToken) return;

    CommitSelection(Index, oldItem, newItem, sender);
    emit('PivotItemUnloaded', sender, GetPivotItemArgs(oldItem));

    await nextTick();
    if (token !== loadToken) return;
    EnsureSelectedHeaderInView();
    if (shouldFocus) FocusHeader(Index);

    SelectionAnimationState.value = 'FlyIn';
    if (!await AnimateIn(direction) || token !== loadToken) return;

    emit('PivotItemLoaded', sender, GetPivotItemArgs(newItem));
  } finally {
    if (token !== loadToken) return;

    CancelContentAnimations();
    SelectionAnimationState.value = 'Idle';
    const nextRequest = pendingSelectionRequest;
    pendingSelectionRequest = null;
    if (nextRequest && nextRequest.Index !== CurrentSelectedIndex.value) {
      void ChangeSelection(nextRequest.Index, nextRequest.shouldFocus, nextRequest.isUserInitiated);
    } else if (nextRequest?.shouldFocus) {
      FocusHeader(CurrentSelectedIndex.value);
    }
  }
};

const OnHeaderGotFocus = (Index) => {
  FocusedIndex.value = Index;
};

const GetEnabledHeaderIndices = () => Items.value
  .map((Item, Index) => (!GetIsDisabled(Item) && EffectiveIsEnabled.value ? Index : null))
  .filter((Index) => Index !== null);

const FocusHeader = (Index) => {
  nextTick(() => headerRefs.get(Index)?.focus());
};

const OnHeaderKeyDown = (event, Index) => {
  if (!EffectiveIsEnabled.value || EffectiveIsLocked.value) return;

  const forwardKey = effectiveFlowDirection.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const backwardKey = effectiveFlowDirection.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  const enabledIndices = GetEnabledHeaderIndices();
  const currentPosition = enabledIndices.indexOf(Index);
  if (currentPosition < 0) return;

  let nextPosition = currentPosition;
  if (event.key === forwardKey) nextPosition = Math.min(enabledIndices.length - 1, currentPosition + 1);
  else if (event.key === backwardKey) nextPosition = Math.max(0, currentPosition - 1);
  else if (event.key === 'Home') nextPosition = 0;
  else if (event.key === 'End') nextPosition = enabledIndices.length - 1;
  else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    ChangeSelection(Index, true, true);
    return;
  } else {
    return;
  }

  event.preventDefault();
  ChangeSelection(enabledIndices[nextPosition], true, true);
};

const GetHeaderScroller = () => {
  const scrollViewer = headerScrollerRef.value;
  const exposedScroller = scrollViewer?.scrollViewerRef;
  return exposedScroller?.value
    ?? exposedScroller
    ?? scrollViewer?.$el?.querySelector?.('.win-scroll-viewer-viewport')
    ?? null;
};

const UpdateNavigationButtons = () => {
  if (navigationFrame) cancelAnimationFrame(navigationFrame);
  navigationFrame = requestAnimationFrame(() => {
    navigationFrame = 0;
    const scroller = GetHeaderScroller();
    if (!scroller) {
      hasHeaderOverflow.value = false;
      CanScrollPrevious.value = false;
      CanScrollNext.value = false;
      return;
    }

    inheritedFlowDirection.value = getComputedStyle(rootRef.value ?? scroller).direction === 'rtl' ? 'rtl' : 'ltr';
    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const scrollLeft = Math.max(0, Math.min(maxScrollLeft, Math.abs(scroller.scrollLeft)));
    hasHeaderOverflow.value = maxScrollLeft > 1;
    CanScrollPrevious.value = scrollLeft > 1;
    CanScrollNext.value = scrollLeft < maxScrollLeft - 1;
  });
};

const ScrollHeaders = (direction) => {
  const scroller = GetHeaderScroller();
  if (!scroller) return;
  const logicalDirection = effectiveFlowDirection.value === 'rtl' ? -direction : direction;
  scroller.scrollBy({
    left: logicalDirection * Math.max(48, scroller.clientWidth * 0.8),
    behavior: 'smooth'
  });
};

const EnsureSelectedHeaderInView = () => {
  const scroller = GetHeaderScroller();
  const header = headerRefs.get(CurrentSelectedIndex.value);
  if (!scroller || !header || !EffectiveIsHeaderItemsCarouselEnabled.value) {
    UpdateNavigationButtons();
    return;
  }

  const scrollerRect = scroller.getBoundingClientRect();
  const headerRect = header.getBoundingClientRect();
  if (headerRect.left < scrollerRect.left) {
    scroller.scrollBy({ left: headerRect.left - scrollerRect.left - 20, behavior: 'smooth' });
  } else if (headerRect.right > scrollerRect.right) {
    scroller.scrollBy({ left: headerRect.right - scrollerRect.right + 20, behavior: 'smooth' });
  }
  UpdateNavigationButtons();
};

watch(() => props.SelectedIndex, (value) => {
  if (value !== undefined && value !== CurrentSelectedIndex.value) ChangeSelection(value, false, false);
});

watch(() => props.SelectedItem, (value) => {
  if (value === null || value === undefined) return;
  const index = Items.value.findIndex((Item) => Item.Source === value || Item.Header === value);
  if (index >= 0 && index !== CurrentSelectedIndex.value) ChangeSelection(index, false, false);
});

watch(ItemsStructureKey, async () => {
  ++loadToken;
  CancelContentAnimations();
  SelectionAnimationState.value = 'Idle';
  pendingSelectionRequest = null;
  ClampSelectedIndex();
  DisplayedSelectedIndex.value = CurrentSelectedIndex.value;
  await nextTick();
  UpdateNavigationButtons();
  EnsureSelectedHeaderInView();
});

onMounted(async () => {
  ClampSelectedIndex();
  resizeObserver = new ResizeObserver(UpdateNavigationButtons);
  await nextTick();
  if (rootRef.value) resizeObserver.observe(rootRef.value);
  if (GetHeaderScroller()) resizeObserver.observe(GetHeaderScroller());
  if (headerPanelRef.value) resizeObserver.observe(headerPanelRef.value);
  UpdateNavigationButtons();
  EnsureSelectedHeaderInView();
  document.fonts?.ready.then(UpdateNavigationButtons);
});

onBeforeUnmount(() => {
  ++loadToken;
  CancelContentAnimations();
  SelectionAnimationState.value = 'Idle';
  pendingSelectionRequest = null;
  resizeObserver?.disconnect();
  if (navigationFrame) cancelAnimationFrame(navigationFrame);
});

defineExpose({
  get SelectedIndex() {
    return CurrentSelectedIndex.value;
  },
  get SelectedItem() {
    return SelectedItem.value?.Source ?? null;
  },
  get Items() {
    return Items.value.map((Item) => Item.Source);
  }
});
</script>

<style scoped>
.win-pivot {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  background: var(--PivotBackground, transparent);
  color: var(--text-primary);
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
}

.win-pivot-title-content-control {
  margin: 14px 0 13px 12px;
  color: var(--text-primary);
}

.win-pivot-title {
  color: inherit;
  font-family: var(--PivotTitleFontFamily, var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif));
  line-height: 20px;
}

.win-pivot-template-grid,
.win-pivot-layout-element {
  min-width: 0;
}

.win-pivot-layout-element {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-rows: auto minmax(0, 1fr);
}

.win-pivot-left-header-presenter,
.win-pivot-right-header-presenter {
  align-self: stretch;
  justify-self: stretch;
}

.win-pivot-right-header-presenter {
  grid-column: 3;
}

.win-pivot-header-clipper {
  position: relative;
  grid-column: 2;
  min-width: 0;
  overflow: hidden;
  background: var(--PivotHeaderBackground, transparent);
}

.win-pivot-header-scroll-viewer {
  width: 100%;
  height: 48px;
  min-width: 0;
}

.win-pivot-header-scroll-viewer :deep(.win-scroll-viewer-viewport),
.win-pivot-header-scroll-viewer :deep(.scroll-content) {
  min-height: 48px;
}

.win-pivot-header-panel {
  display: flex;
  width: max-content;
  min-width: 100%;
  align-items: stretch;
}

.win-pivot-header-item {
  position: relative;
  min-width: 0;
  min-height: 48px;
  height: 48px;
  padding: 0 12px;
  flex: 0 0 auto;
  justify-content: flex-start;
  overflow: hidden;
  border-radius: var(--PivotHeaderItemSelectedPipeCornerRadius, 1.5px);
  font-family: var(--PivotHeaderItemFontFamily, var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif));
  font-size: 24px;
  font-weight: 300;
  letter-spacing: -0.025em;
  line-height: 32px;
  --ButtonBackground: var(--PivotHeaderItemBackgroundUnselected, transparent);
  --ButtonBackgroundPointerOver: var(--PivotHeaderItemBackgroundUnselectedPointerOver, transparent);
  --ButtonBackgroundPressed: var(--PivotHeaderItemBackgroundUnselectedPressed, transparent);
  --ButtonBackgroundDisabled: var(--PivotHeaderItemBackgroundDisabled, transparent);
  --ButtonForeground: var(--PivotHeaderItemForegroundUnselected, var(--SystemControlForegroundBaseMediumBrush));
  --ButtonForegroundPointerOver: var(--PivotHeaderItemForegroundUnselectedPointerOver, var(--SystemControlHighlightAltBaseMediumHighBrush));
  --ButtonForegroundPressed: var(--PivotHeaderItemForegroundUnselectedPressed, var(--SystemControlHighlightAltBaseMediumHighBrush));
  --ButtonForegroundDisabled: var(--PivotHeaderItemForegroundDisabled, var(--SystemControlDisabledBaseMediumLowBrush));
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
  --ButtonBorderThemeThickness: 0;
}

.win-pivot-header-item::after {
  display: none;
}

.win-pivot .win-pivot-header-item {
  transition: none;
}

.win-pivot-header-item.is-selected {
  --ButtonBackground: var(--PivotHeaderItemBackgroundSelected, transparent);
  --ButtonBackgroundPointerOver: var(--PivotHeaderItemBackgroundSelectedPointerOver, transparent);
  --ButtonBackgroundPressed: var(--PivotHeaderItemBackgroundSelectedPressed, transparent);
  --ButtonForeground: var(--PivotHeaderItemForegroundSelected, var(--SystemControlHighlightAltBaseHighBrush));
  --ButtonForegroundPointerOver: var(--PivotHeaderItemForegroundSelectedPointerOver, var(--SystemControlHighlightAltBaseMediumHighBrush));
  --ButtonForegroundPressed: var(--PivotHeaderItemForegroundSelectedPressed, var(--SystemControlHighlightAltBaseMediumHighBrush));
}

.win-pivot-header-item.is-unselected-locked {
  pointer-events: none;
}

.win-pivot.is-locked .win-pivot-header-item {
  pointer-events: none;
}

.win-pivot-header-item.is-unselected-locked .win-pivot-header-content {
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 330ms linear, transform 330ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

.win-pivot-header-content {
  color: inherit;
  line-height: 32px;
  transition: opacity 330ms linear, transform 330ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

.win-pivot-selected-pipe {
  position: absolute;
  right: 12px;
  bottom: 2px;
  left: 12px;
  height: 3px;
  border-radius: var(--PivotHeaderItemSelectedPipeCornerRadius, 1.5px);
  background: var(--PivotHeaderItemSelectedPipeFill, var(--accent-base));
  opacity: 0;
  pointer-events: none;
}

.win-pivot-header-item.is-selected .win-pivot-selected-pipe {
  opacity: 1;
}

.win-pivot-header-item.is-disabled .win-pivot-selected-pipe {
  opacity: 0;
}

.win-pivot-header-item:focus-visible {
  outline: 2px solid var(--PivotHeaderItemFocusPipeFill, var(--focus-stroke-outer, var(--text-primary)));
  outline-offset: -2px;
}

.win-pivot-nav-button {
  position: absolute;
  top: 6px;
  z-index: 1;
  width: 20px;
  min-width: 20px;
  height: 36px;
  min-height: 36px;
  padding: 0;
  border-radius: 0;
  --ButtonBackground: var(--PivotNextButtonBackground, color-mix(in srgb, var(--ctrl-fill-default) 65%, transparent));
  --ButtonBackgroundPointerOver: var(--PivotNextButtonBackgroundPointerOver, var(--ctrl-fill-secondary));
  --ButtonBackgroundPressed: var(--PivotNextButtonBackgroundPressed, var(--ctrl-fill-tertiary));
  --ButtonForeground: var(--PivotNextButtonForeground, var(--text-secondary));
  --ButtonForegroundPointerOver: var(--PivotNextButtonForegroundPointerOver, var(--text-primary));
  --ButtonForegroundPressed: var(--PivotNextButtonForegroundPressed, var(--text-primary));
  --ButtonBorderBrush: var(--PivotNextButtonBorderBrush, transparent);
  --ButtonBorderBrushTop: var(--ButtonBorderBrush);
  --ButtonBorderBrushPointerOver: var(--PivotNextButtonBorderBrushPointerOver, transparent);
  --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushPointerOver);
  --ButtonBorderBrushPressed: var(--PivotNextButtonBorderBrushPressed, transparent);
  --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
  --ButtonBorderBrushBottom: var(--PivotNextButtonBorderBrush, transparent);
  --ButtonBorderBrushPointerOverBottom: var(--PivotNextButtonBorderBrushPointerOver, transparent);
  --ButtonBorderBrushPressedBottom: var(--PivotNextButtonBorderBrushPressed, transparent);
  --ButtonBorderThemeThickness: var(--PivotNavButtonBorderThemeThickness, 0);
}

.win-pivot-nav-button::after {
  display: none;
}

.win-pivot-previous-button {
  left: 0;
  --ButtonBackground: var(--PivotPreviousButtonBackground, color-mix(in srgb, var(--ctrl-fill-default) 65%, transparent));
  --ButtonBackgroundPointerOver: var(--PivotPreviousButtonBackgroundPointerOver, var(--ctrl-fill-secondary));
  --ButtonBackgroundPressed: var(--PivotPreviousButtonBackgroundPressed, var(--ctrl-fill-tertiary));
  --ButtonForeground: var(--PivotPreviousButtonForeground, var(--text-secondary));
  --ButtonForegroundPointerOver: var(--PivotPreviousButtonForegroundPointerOver, var(--text-primary));
  --ButtonForegroundPressed: var(--PivotPreviousButtonForegroundPressed, var(--text-primary));
  --ButtonBorderBrush: var(--PivotPreviousButtonBorderBrush, transparent);
  --ButtonBorderBrushTop: var(--ButtonBorderBrush);
  --ButtonBorderBrushPointerOver: var(--PivotPreviousButtonBorderBrushPointerOver, transparent);
  --ButtonBorderBrushPointerOverTop: var(--ButtonBorderBrushPointerOver);
  --ButtonBorderBrushPressed: var(--PivotPreviousButtonBorderBrushPressed, transparent);
  --ButtonBorderBrushPressedTop: var(--ButtonBorderBrushPressed);
  --ButtonBorderBrushBottom: var(--PivotPreviousButtonBorderBrush, transparent);
  --ButtonBorderBrushPointerOverBottom: var(--PivotPreviousButtonBorderBrushPointerOver, transparent);
  --ButtonBorderBrushPressedBottom: var(--PivotPreviousButtonBorderBrushPressed, transparent);
}

.win-pivot-next-button {
  right: 0;
}

.win-pivot-nav-glyph {
  color: inherit;
  line-height: 12px;
}

.win-pivot-item-presenter {
  position: relative;
  grid-column: 1 / span 3;
  grid-row: 2;
  min-width: 0;
  margin: 0 12px;
  overflow: hidden;
  background: var(--PivotItemBackground, transparent);
}

.win-pivot-item-host {
  width: 100%;
  min-width: 0;
  background: var(--PivotItemBackground, transparent);
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .win-pivot-header-content {
    transition: none;
  }
}
</style>
