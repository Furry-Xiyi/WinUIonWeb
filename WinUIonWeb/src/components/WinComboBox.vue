<template>
  <div
    ref="comboRef"
    class="win-combo-box"
    :class="{
      'is-disabled': !IsEnabled,
      'is-drop-down-open': isOpen,
      'is-editable': IsEditable
    }"
    :style="rootStyle"
    @keydown.capture="onInputKeyDown"
    @pointerdown.capture="onPointerDown">
    <WinTextBlock v-if="Header" class="win-combo-header" :Text="Header" />

    <div v-if="IsEditable" ref="backgroundRef" class="win-combo-editable">
      <button
        v-if="!isEditing"
        class="win-btn DefaultButtonStyle win-combo-btn win-combo-edit-display"
        type="button"
        role="combobox"
        :aria-controls="listBoxId"
        :aria-expanded="isOpen"
        :aria-label="Header || PlaceholderText"
        :disabled="!IsEnabled"
        @click="beginEditing"
        @keydown="onEditableDisplayKeyDown">
        <span class="win-combo-content" :class="{ 'is-placeholder': !currentText && currentSelectedItem === undefined }">
          {{ editableDisplayLabel }}
        </span>
      </button>
      <WinTextBox
        v-else
        ref="inputRef"
        class="win-combo-textbox"
        role="combobox"
        :aria-controls="listBoxId"
        :aria-expanded="isOpen"
        :aria-label="Header || PlaceholderText"
        :IsEnabled="IsEnabled"
        :PlaceholderText="PlaceholderText"
        :ShowDeleteButton="false"
        :Text="currentText"
        @LostFocus="onEditableLostFocus"
        @update:Text="onEditableTextChanged"
        @keydown="onEditableKeyDown" />
      <button
        class="win-combo-drop-down-button"
        type="button"
        tabindex="-1"
        :aria-label="t('text.select')"
        :disabled="!IsEnabled"
        @click="toggleEditableDropDown"
        @pointerdown.prevent="onChevronDown"
        @pointerup="onChevronUp"
        @pointercancel="onChevronLeave"
        @pointerleave="onChevronLeave">
      </button>
      <span
        class="icon chevron chevron-animate win-combo-chevron"
        :class="chevronClass"
        aria-hidden="true"
        @animationend="onChevronAnimEnd"></span>
    </div>

    <button
      v-else
      ref="backgroundRef"
      class="win-btn DefaultButtonStyle win-combo-btn"
      type="button"
      role="combobox"
      :aria-controls="listBoxId"
      :aria-expanded="isOpen"
      :aria-label="Header || PlaceholderText"
      :disabled="!IsEnabled"
      @click="toggle"
      @keydown="onButtonKeyDown"
      @pointerdown="onChevronDown"
      @pointerup="onChevronUp"
      @pointercancel="onChevronLeave"
      @pointerleave="onChevronLeave">
      <span class="win-combo-content" :class="{ 'is-placeholder': currentSelectedIndex < 0 && currentSelectedItem === undefined }">
        {{ selectedLabel }}
      </span>
      <span
        class="icon chevron chevron-animate win-combo-chevron"
        :class="chevronClass"
        aria-hidden="true"
        @animationend="onChevronAnimEnd"></span>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="win-combo-overlay"
        @contextmenu.prevent="close"
        @pointerdown="close">
      </div>
      <div
        v-if="isOpen"
        :id="listBoxId"
        ref="flyoutRef"
        class="win-combo-flyout win-theme-scope"
        :class="[themeClass, {
          'is-positioned': flyoutReady,
          'opens-up': openedUp,
          'touch-input': inputDeviceTypeUsedToOpen === 'Touch',
          'edge-square-top': IsEditable && !openedUp,
          'edge-square-bottom': IsEditable && openedUp
        }]"
        :style="flyoutStyle"
        role="listbox"
        @keydown="onFlyoutKeyDown"
        @pointerdown.stop>
        <WinScrollViewer
          ref="scrollViewerRef"
          class="win-combo-scroll-viewer"
          HorizontalScrollMode="Disabled"
          HorizontalScrollBarVisibility="Disabled"
          VerticalScrollMode="Auto"
          VerticalScrollBarVisibility="Auto"
          :IsVerticalScrollChainingEnabled="false"
          :IsTabStop="false">
          <div ref="itemsPresenterRef" class="win-combo-items-presenter">
            <button
              v-for="(item, index) in ItemsSource"
              :key="getItemKey(item, index)"
              :ref="(element) => setItemRef(element, index)"
              class="win-combo-item"
              :class="{ selected: currentSelectedIndex === index }"
              type="button"
              role="option"
              :aria-selected="currentSelectedIndex === index"
              :tabindex="currentSelectedIndex === index ? 0 : -1"
              @click="select(index)">
              <span class="win-combo-item-layout">
                <span v-if="currentSelectedIndex === index" class="win-combo-item-pill"></span>
                <span class="win-combo-item-content">{{ GetItemLabel(item) }}</span>
              </span>
            </button>
          </div>
        </WinScrollViewer>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from './i18n/index';
import WinScrollViewer from './WinScrollViewer.vue';
import WinTextBlock from './WinTextBlock.vue';
import WinTextBox from './WinTextBox.vue';
import { useFlyoutAnimation } from './useFlyoutAnimation';

const ComboBoxPopupMaxNumberOfItems = 9;
const ComboBoxPopupMaxNumberOfItemsThatCanBeShownOnOneSide = 4;
const ComboBoxDropdownContentMargin = { Top: 4, Bottom: 4 };
const DefaultComboBoxItemHeight = 36;

const { t } = useI18n();
const props = defineProps({
  ItemsSource: { type: Array, default: () => [] },
  Header: { type: String, default: '' },
  PlaceholderText: { type: String, default: '' },
  IsEditable: { type: Boolean, default: false },
  IsEnabled: { type: Boolean, default: true },
  IsDropDownOpen: { type: Boolean, default: undefined },
  SelectedIndex: { type: Number, default: undefined },
  SelectedItem: { type: null, default: undefined },
  SelectedValue: { type: null, default: undefined },
  SelectedValuePath: { type: String, default: '' },
  DisplayMemberPath: { type: String, default: '' },
  Text: { type: [String, Number], default: undefined },
  Width: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxDropDownHeight: { type: Number, default: 504 },
  Theme: { type: String, default: '' }
});

const emit = defineEmits([
  'update:IsDropDownOpen',
  'update:SelectedIndex',
  'update:SelectedItem',
  'update:SelectedValue',
  'update:Text',
  'DropDownOpened',
  'DropDownClosed',
  'SelectionChanged',
  'TextSubmitted'
]);

const comboRef = ref(null);
const backgroundRef = ref(null);
const inputRef = ref(null);
const flyoutRef = ref(null);
const scrollViewerRef = ref(null);
const itemsPresenterRef = ref(null);
const itemRefs = ref([]);
const isOpen = ref(Boolean(props.IsDropDownOpen));
const isEditing = ref(false);
const flyoutReady = ref(false);
const openedUp = ref(false);
const flyoutStyle = ref({ visibility: 'hidden' });
const inputDeviceTypeUsedToOpen = ref('Mouse');
const currentSelectedIndex = ref(-1);
const currentSelectedItem = ref(undefined);
const currentText = ref(props.Text === undefined ? '' : String(props.Text));
const anchorTheme = ref('');
const inheritedTheme = inject('winuiTheme', null);
const listBoxId = `win-combo-box-${Math.random().toString(36).slice(2)}`;

const flyoutAnimation = useFlyoutAnimation(flyoutRef, {
  Origin: () => (props.IsEditable ? 'edge' : 'element'),
  OriginElement: () => {
    if (props.IsEditable || props.ItemsSource.length === 0) return null;
    const index = currentSelectedIndex.value >= 0 ? currentSelectedIndex.value : Math.floor(props.ItemsSource.length / 2);
    return itemRefs.value[index] ?? null;
  },
  Direction: () => (openedUp.value ? 'bottom' : 'top'),
  StripSize: DefaultComboBoxItemHeight
});

const chevronClass = ref('');
let chevronPressed = false;
let chevronPressDone = false;
let resizeObserver = null;
let themeObserver = null;
let positionFrame = 0;
let lastInputDeviceType = 'Mouse';

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const rootStyle = computed(() => {
  const style = {};
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  return style;
});

const themeClass = computed(() => {
  const theme = props.Theme || inheritedTheme?.value || anchorTheme.value;
  return theme === 'light' || theme === 'dark' ? `theme-${theme}` : '';
});

const GetPathValue = (item, path) => {
  if (!path) return item;
  return path.split('.').reduce((value, key) => value?.[key], item);
};

const GetItemLabel = (item) => {
  const value = props.DisplayMemberPath ? GetPathValue(item, props.DisplayMemberPath) : item;
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);
  return String(value.label ?? value.Text ?? value.Name ?? value.Content ?? value.Value ?? value.value ?? value);
};

const GetItemValue = (item) => {
  if (props.SelectedValuePath) return GetPathValue(item, props.SelectedValuePath);
  return item;
};

const getItemKey = (item, index) => {
  if (item && typeof item === 'object') return item.Key ?? item.Id ?? item.id ?? index;
  return `${String(item)}-${index}`;
};

const FindItemIndex = (item) => props.ItemsSource.findIndex((candidate) => Object.is(candidate, item));
const FindValueIndex = (value) => props.ItemsSource.findIndex((item) => Object.is(GetItemValue(item), value));

const selectedLabel = computed(() => {
  if (currentSelectedItem.value !== undefined) return GetItemLabel(currentSelectedItem.value);
  return props.PlaceholderText || t('text.select');
});

const editableDisplayLabel = computed(() => currentText.value || selectedLabel.value);

const SetCurrentSelection = (index, selectedItem, updateText = true) => {
  currentSelectedIndex.value = index;
  currentSelectedItem.value = selectedItem;
  if (updateText) currentText.value = selectedItem === undefined ? '' : GetItemLabel(selectedItem);
};

const SyncSelectionFromProperties = () => {
  let selectedIndex;
  let selectedItem;

  if (props.SelectedIndex !== undefined) {
    selectedIndex = props.SelectedIndex >= 0 && props.SelectedIndex < props.ItemsSource.length ? props.SelectedIndex : -1;
    selectedItem = selectedIndex >= 0 ? props.ItemsSource[selectedIndex] : undefined;
  } else if (props.SelectedItem !== undefined) {
    selectedIndex = FindItemIndex(props.SelectedItem);
    selectedItem = props.SelectedItem;
  } else if (props.SelectedValue !== undefined) {
    selectedIndex = FindValueIndex(props.SelectedValue);
    selectedItem = selectedIndex >= 0 ? props.ItemsSource[selectedIndex] : undefined;
  } else {
    return;
  }

  SetCurrentSelection(selectedIndex, selectedItem, props.Text === undefined);
};

const RaiseSelectionChanged = (oldItem, selectedItem, selectedIndex) => {
  emit('update:SelectedIndex', selectedIndex);
  emit('update:SelectedItem', selectedItem);
  emit('update:SelectedValue', selectedItem === undefined ? undefined : GetItemValue(selectedItem));
  emit('update:Text', currentText.value);
  emit('SelectionChanged', {
    AddedItems: selectedItem === undefined ? [] : [selectedItem],
    RemovedItems: oldItem === undefined ? [] : [oldItem]
  });
};

const SetSelectedIndex = (index) => {
  const selectedIndex = index >= 0 && index < props.ItemsSource.length ? index : -1;
  const selectedItem = selectedIndex >= 0 ? props.ItemsSource[selectedIndex] : undefined;
  const oldItem = currentSelectedItem.value;
  if (selectedIndex === currentSelectedIndex.value && Object.is(selectedItem, oldItem)) return;

  SetCurrentSelection(selectedIndex, selectedItem);
  RaiseSelectionChanged(oldItem, selectedItem, selectedIndex);
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

const ResolveAnchorTheme = () => {
  const themeScope = comboRef.value?.closest('.theme-light, .theme-dark');
  if (themeScope?.classList.contains('theme-dark')) return 'dark';
  if (themeScope?.classList.contains('theme-light')) return 'light';
  return '';
};

const ObserveAnchorTheme = () => {
  themeObserver?.disconnect();
  const themeScope = comboRef.value?.closest('.theme-light, .theme-dark');
  anchorTheme.value = ResolveAnchorTheme();
  if (!themeScope) return;

  themeObserver = new MutationObserver(() => {
    anchorTheme.value = ResolveAnchorTheme();
    schedulePositionFlyout();
  });
  themeObserver.observe(themeScope, { attributes: true, attributeFilter: ['class'] });
};

const GetItemLayoutHeight = (index) => {
  const element = itemRefs.value[index];
  if (!element) return DefaultComboBoxItemHeight;
  const style = window.getComputedStyle(element);
  return element.getBoundingClientRect().height
    + Number.parseFloat(style.marginTop || '0')
    + Number.parseFloat(style.marginBottom || '0');
};

const GetNonPannablePopupLayout = (
  centerItemIndex,
  itemCount,
  cbY,
  cbHeight,
  cbPopupContentMargin,
  rootWindowSize,
  initialPopupMaxHeight
) => {
  let popupMaxHeight = initialPopupMaxHeight;
  let offset = 0;

  if (itemCount < centerItemIndex || centerItemIndex < 0) {
    centerItemIndex = Math.floor(itemCount / 2);
  }

  if (itemCount === 0) {
    return { popupY: cbY, popupMaxHeight: cbHeight, offset };
  }

  let currentItemHeight = GetItemLayoutHeight(centerItemIndex);

  if ((cbY + cbHeight) >= rootWindowSize.Height) {
    cbY = rootWindowSize.Height - cbHeight;
  }

  const calculatedLayoutLocationAbove = cbY + cbHeight / 2 - currentItemHeight / 2 - cbPopupContentMargin.Top;
  let layoutLocationAbove = Math.max(calculatedLayoutLocationAbove, 0);
  const upperLimit = Math.max(cbY + cbHeight / 2 - popupMaxHeight / 2, 0);
  const calculatedLayoutLocationBelow = layoutLocationAbove + currentItemHeight + cbPopupContentMargin.Top + cbPopupContentMargin.Bottom;
  let layoutLocationBelow = Math.min(calculatedLayoutLocationBelow, rootWindowSize.Height);
  const lowerLimit = Math.min(upperLimit + popupMaxHeight, rootWindowSize.Height);
  let itemIndexAbove = centerItemIndex - 1;
  let itemIndexBelow = centerItemIndex + 1;
  let totalItemsLayed = 1;
  const maxNumberOfItemsAllowedOnOneSide = Math.min(ComboBoxPopupMaxNumberOfItemsThatCanBeShownOnOneSide, itemCount);
  const maxNumberOfItemsAllowed = Math.min(ComboBoxPopupMaxNumberOfItems, itemCount);

  if (calculatedLayoutLocationBelow > rootWindowSize.Height) {
    layoutLocationAbove = Math.max(layoutLocationAbove - calculatedLayoutLocationBelow + rootWindowSize.Height, 0);
  }

  if (itemIndexAbove >= 0) {
    currentItemHeight = GetItemLayoutHeight(itemIndexAbove);

    while (itemIndexAbove >= 0
      && layoutLocationAbove - currentItemHeight >= upperLimit
      && totalItemsLayed < maxNumberOfItemsAllowedOnOneSide) {
      layoutLocationAbove -= currentItemHeight;
      totalItemsLayed++;
      itemIndexAbove--;
      if (itemIndexAbove >= 0) currentItemHeight = GetItemLayoutHeight(itemIndexAbove);
    }
  }

  if (itemIndexBelow < itemCount) {
    currentItemHeight = GetItemLayoutHeight(itemIndexBelow);

    while (itemIndexBelow < itemCount
      && layoutLocationBelow + currentItemHeight < lowerLimit
      && layoutLocationBelow - layoutLocationAbove < popupMaxHeight
      && totalItemsLayed < maxNumberOfItemsAllowed) {
      layoutLocationBelow += currentItemHeight;
      totalItemsLayed++;
      itemIndexBelow++;
      if (itemIndexBelow < itemCount) currentItemHeight = GetItemLayoutHeight(itemIndexBelow);
    }
  }

  if (itemIndexAbove >= 0 || itemIndexBelow < itemCount) {
    let isAbove = itemIndexAbove >= 0;
    let currentItemIndex = isAbove ? itemIndexAbove : itemIndexBelow;
    currentItemHeight = GetItemLayoutHeight(currentItemIndex);

    while (layoutLocationBelow - layoutLocationAbove + currentItemHeight <= popupMaxHeight
      && (layoutLocationBelow + currentItemHeight < rootWindowSize.Height || layoutLocationAbove - currentItemHeight >= 0)
      && totalItemsLayed < maxNumberOfItemsAllowed) {
      if (isAbove) itemIndexAbove--;
      else itemIndexBelow++;

      if (layoutLocationAbove - currentItemHeight <= 0) layoutLocationBelow += currentItemHeight;
      else layoutLocationAbove -= currentItemHeight;

      totalItemsLayed++;
      if (itemIndexAbove >= 0 || itemIndexBelow < itemCount) {
        isAbove = itemIndexAbove >= 0;
        currentItemIndex = isAbove ? itemIndexAbove : itemIndexBelow;
        currentItemHeight = GetItemLayoutHeight(currentItemIndex);
      }
    }
  }

  offset = itemIndexAbove + 1;
  const popupY = layoutLocationAbove;
  popupMaxHeight = layoutLocationBelow - layoutLocationAbove;
  return { popupY, popupMaxHeight, offset };
};

const GetEditableComboBoxPopupLayout = (
  itemCount,
  cbY,
  cbHeight,
  cbPopupContentMargin,
  rootWindowSize
) => {
  if (itemCount === 0) {
    return { popupY: cbY, popupMaxHeight: cbHeight, offset: 0, openedUp: false };
  }

  const calculatedLayoutLocationAbove = cbY + cbHeight;
  const layoutLocationAbove = Math.max(calculatedLayoutLocationAbove, 0);
  let layoutLocationBelow = layoutLocationAbove + cbPopupContentMargin.Top + cbPopupContentMargin.Bottom;
  let currentIndex = 0;
  let totalItemsLayed = 0;
  const maxNumberOfItemsAllowed = Math.min(ComboBoxPopupMaxNumberOfItems, itemCount);

  while (currentIndex < itemCount && totalItemsLayed < maxNumberOfItemsAllowed) {
    layoutLocationBelow += GetItemLayoutHeight(currentIndex);
    totalItemsLayed++;
    currentIndex++;
  }

  let popupY = layoutLocationAbove;
  const popupMaxHeight = layoutLocationBelow - layoutLocationAbove;
  let opensUp = false;

  if (popupY + popupMaxHeight > rootWindowSize.Height) {
    if (cbY - popupMaxHeight >= 0) {
      popupY = Math.max(cbY - popupMaxHeight, 0);
      opensUp = true;
    }
  }

  return { popupY, popupMaxHeight, offset: 0, openedUp: opensUp };
};

const GetPannablePopupLayout = (
  centerItemIndex,
  itemCount,
  cbY,
  cbHeight,
  childHeight,
  rootWindowSize,
  initialPopupMaxHeight
) => {
  let popupMaxHeight = initialPopupMaxHeight;

  if (itemCount < centerItemIndex || centerItemIndex < 0) {
    centerItemIndex = Math.floor(itemCount / 2);
  }

  let popupSize = GetItemLayoutHeight(centerItemIndex);
  let roomAvailableAbove = Math.min((popupMaxHeight - cbHeight) / 2, cbY);
  let roomAvailableBelow = Math.min(
    popupMaxHeight - roomAvailableAbove - cbHeight,
    Math.max(0, rootWindowSize.Height - cbY - popupSize)
  );

  const maxItemsAllowedAbove = Math.floor(Math.min(
    ComboBoxPopupMaxNumberOfItemsThatCanBeShownOnOneSide,
    (itemCount - 1) / 2
  ));
  const maxItemsAllowedBelow = Math.floor(Math.min(
    ComboBoxPopupMaxNumberOfItemsThatCanBeShownOnOneSide,
    (itemCount - 1) / 2
  ));

  let itemsAddedAbove = 0;
  let nextItemHeight = 0;
  let nextItemIndex = centerItemIndex - 1 >= 0 ? centerItemIndex - 1 : itemCount - 1;
  if (nextItemIndex >= 0) nextItemHeight = GetItemLayoutHeight(nextItemIndex);

  let popupY = Math.max(Math.min(cbY, rootWindowSize.Height - popupSize), 0);

  while (popupSize + nextItemHeight <= popupMaxHeight
    && itemsAddedAbove < maxItemsAllowedAbove
    && roomAvailableAbove - nextItemHeight > 0) {
    itemsAddedAbove++;
    popupSize += nextItemHeight;
    roomAvailableAbove -= nextItemHeight;
    popupY -= nextItemHeight;
    nextItemIndex = nextItemIndex - 1 >= 0 ? nextItemIndex - 1 : itemCount - 1;
    if (nextItemIndex >= 0) nextItemHeight = GetItemLayoutHeight(nextItemIndex);
  }

  let offset = centerItemIndex - itemsAddedAbove;
  let itemsAddedBelow = 0;
  nextItemHeight = 0;
  nextItemIndex = centerItemIndex + 1 < itemCount ? centerItemIndex + 1 : 0;
  if (nextItemIndex < itemCount) nextItemHeight = GetItemLayoutHeight(nextItemIndex);

  while (popupSize + nextItemHeight <= popupMaxHeight
    && itemsAddedBelow < maxItemsAllowedBelow
    && roomAvailableBelow - nextItemHeight > 0) {
    itemsAddedBelow++;
    popupSize += nextItemHeight;
    roomAvailableBelow -= nextItemHeight;
    nextItemIndex = nextItemIndex + 1 < itemCount ? nextItemIndex + 1 : 0;
    if (nextItemIndex < itemCount) nextItemHeight = GetItemLayoutHeight(nextItemIndex);
  }

  if (roomAvailableAbove >= nextItemHeight / 2) {
    popupSize += nextItemHeight / 2;
    popupY -= nextItemHeight / 2;
    offset -= 0.5;
  }

  popupMaxHeight = Math.min(popupMaxHeight, popupSize);
  while (offset < 0) offset += itemCount + 1;
  while (offset >= itemCount + 1) offset -= itemCount + 1;

  return { popupY, popupMaxHeight, offset, childHeight };
};

const UpdateIsPopupPannable = (itemCount, maxAllowedPopupHeight, availableSize) => {
  if (itemCount <= 0) return false;
  if (itemCount > ComboBoxPopupMaxNumberOfItems) return true;

  maxAllowedPopupHeight = Math.min(maxAllowedPopupHeight, availableSize.Height);
  const childHeight = props.ItemsSource.reduce(
    (height, _item, index) => height + GetItemLayoutHeight(index),
    ComboBoxDropdownContentMargin.Top + ComboBoxDropdownContentMargin.Bottom
  );
  return childHeight > maxAllowedPopupHeight;
};

const positionFlyout = async () => {
  if (!isOpen.value || !backgroundRef.value || !flyoutRef.value) return;
  // A re-position (scroll/resize) must not leave the enter clip at stale
  // coordinates or sizes; cancel it so the flyout shows fully again.
  flyoutAnimation.cancel();

  await nextTick();
  const comboBoxRect = backgroundRef.value.getBoundingClientRect();
  const rootWindowSize = { Width: window.innerWidth, Height: window.innerHeight };
  if (rootWindowSize.Width === 0 || rootWindowSize.Height === 0 || comboBoxRect.width === 0 || comboBoxRect.height === 0) return;

  const maximumDropDownHeight = Math.min(props.MaxDropDownHeight, rootWindowSize.Height);
  const touchInput = inputDeviceTypeUsedToOpen.value === 'Touch';
  const popupMinWidth = Math.max(touchInput ? 240 : 80, comboBoxRect.width);
  flyoutReady.value = false;
  flyoutStyle.value = {
    top: '0px',
    left: '0px',
    minWidth: `${popupMinWidth}px`,
    maxWidth: `${rootWindowSize.Width}px`,
    maxHeight: `${maximumDropDownHeight}px`,
    visibility: 'hidden'
  };

  await nextTick();
  const childWidth = Math.max(comboBoxRect.width, Math.min(flyoutRef.value.getBoundingClientRect().width, rootWindowSize.Width));
  const flowDirection = window.getComputedStyle(backgroundRef.value).direction;
  const alignedPopupLeft = flowDirection === 'rtl' ? comboBoxRect.right - childWidth : comboBoxRect.left;
  const popupLeft = Math.round(Math.max(0, Math.min(alignedPopupLeft, rootWindowSize.Width - childWidth)));

  const isPopupPannable = UpdateIsPopupPannable(props.ItemsSource.length, maximumDropDownHeight, rootWindowSize);
  const layout = props.IsEditable
    ? GetEditableComboBoxPopupLayout(
      props.ItemsSource.length,
      comboBoxRect.top,
      comboBoxRect.height,
      ComboBoxDropdownContentMargin,
      rootWindowSize
    )
    : touchInput && isPopupPannable
      ? GetPannablePopupLayout(
        currentSelectedIndex.value,
        props.ItemsSource.length,
        comboBoxRect.top,
        comboBoxRect.height,
        flyoutRef.value.getBoundingClientRect().height,
        rootWindowSize,
        maximumDropDownHeight
      )
      : GetNonPannablePopupLayout(
        currentSelectedIndex.value,
        props.ItemsSource.length,
        comboBoxRect.top,
        comboBoxRect.height,
        ComboBoxDropdownContentMargin,
        rootWindowSize,
        maximumDropDownHeight
      );

  let popupY = layout.popupY;
  const popupMaxHeight = Math.max(comboBoxRect.height, Math.min(layout.popupMaxHeight, maximumDropDownHeight));
  if (popupY + popupMaxHeight > rootWindowSize.Height) {
    popupY = Math.max(popupY - (popupY + popupMaxHeight - rootWindowSize.Height), 0);
  }

  const popupTop = Math.round(popupY);
  openedUp.value = layout.openedUp ?? popupTop < comboBoxRect.top;
  flyoutStyle.value = {
    top: `${popupTop}px`,
    left: `${popupLeft}px`,
    minWidth: `${popupMinWidth}px`,
    maxWidth: `${rootWindowSize.Width}px`,
    height: `${Math.ceil(popupMaxHeight + 2)}px`,
    maxHeight: `${Math.ceil(popupMaxHeight + 2)}px`,
    visibility: 'visible'
  };

  await nextTick();
  if (itemsPresenterRef.value) {
    const firstItemIndex = Math.floor(layout.offset);
    const fractionalOffset = layout.offset - firstItemIndex;
    const verticalOffset = Array.from({ length: firstItemIndex }, (_, index) => GetItemLayoutHeight(index))
      .reduce((total, height) => total + height, 0)
      + (fractionalOffset > 0 ? GetItemLayoutHeight(firstItemIndex) * fractionalOffset : 0);
    scrollViewerRef.value?.ChangeView(null, verticalOffset, null);
  }
  flyoutReady.value = true;
  if (props.ItemsSource.length > 0) flyoutAnimation.play();
};

const schedulePositionFlyout = () => {
  if (!isOpen.value || positionFrame) return;
  positionFrame = window.requestAnimationFrame(() => {
    positionFrame = 0;
    positionFlyout();
  });
};

const onWindowScroll = (event) => {
  if (flyoutRef.value?.contains(event.target)) return;
  schedulePositionFlyout();
};

const setOpen = async (value) => {
  if (value === isOpen.value || (value && !props.IsEnabled)) return;
  isOpen.value = value;
  emit('update:IsDropDownOpen', value);

  if (value) {
    flyoutAnimation.cancel();
    inputDeviceTypeUsedToOpen.value = lastInputDeviceType;
    anchorTheme.value = ResolveAnchorTheme();
    flyoutReady.value = false;
    emit('DropDownOpened');
    await nextTick();
    await positionFlyout();
  } else {
    flyoutAnimation.cancel();
    flyoutReady.value = false;
    emit('DropDownClosed');
  }
};

const open = () => setOpen(true);
const close = () => setOpen(false);
const toggle = () => setOpen(!isOpen.value);

const focusCombo = () => {
  if (!props.IsEditable) {
    backgroundRef.value?.focus();
    return;
  }

  if (isEditing.value) {
    inputRef.value?.Focus();
  } else {
    backgroundRef.value?.querySelector('.win-combo-edit-display')?.focus();
  }
};

const focusEditableText = (selectText = false) => {
  inputRef.value?.Focus();
  if (selectText) inputRef.value?.SelectAll();
};

const beginEditing = () => {
  if (!props.IsEnabled) return;
  isEditing.value = true;
  nextTick(() => focusEditableText(true));
};

const endEditing = (restoreFocus = false) => {
  if (!isEditing.value) return;
  isEditing.value = false;
  if (restoreFocus) nextTick(focusCombo);
};

const toggleEditableDropDown = () => {
  if (isOpen.value) {
    close();
    endEditing(true);
    return;
  }

  beginEditing();
  open();
};

const select = (index) => {
  SetSelectedIndex(index);
  isEditing.value = false;
  close();
  nextTick(focusCombo);
};

const onEditableTextChanged = (text) => {
  currentText.value = text;
  emit('update:Text', currentText.value);
};

const onEditableLostFocus = () => {
  nextTick(() => {
    const activeElement = document.activeElement;
    if (backgroundRef.value?.contains(activeElement) || flyoutRef.value?.contains(activeElement)) return;
    endEditing();
  });
};

const SubmitText = () => {
  const args = { Text: currentText.value, Handled: false };
  emit('TextSubmitted', args);
  if (!args.Handled) {
    const selectedIndex = props.ItemsSource.findIndex((item) => GetItemLabel(item) === currentText.value);
    if (selectedIndex >= 0) SetSelectedIndex(selectedIndex);
  }
  close();
  endEditing(true);
};

const MoveSelection = (delta) => {
  if (props.ItemsSource.length === 0) return;
  const nextIndex = Math.min(
    props.ItemsSource.length - 1,
    Math.max(0, currentSelectedIndex.value < 0 ? (delta > 0 ? 0 : props.ItemsSource.length - 1) : currentSelectedIndex.value + delta)
  );
  SetSelectedIndex(nextIndex);
};

const FocusItem = (index) => {
  if (props.ItemsSource.length === 0) return;
  const boundedIndex = Math.min(props.ItemsSource.length - 1, Math.max(0, index));
  itemRefs.value[boundedIndex]?.focus();
  itemRefs.value[boundedIndex]?.scrollIntoView({ block: 'nearest' });
};

const onButtonKeyDown = (event) => {
  if (event.key === 'ArrowDown' && !event.altKey && !isOpen.value) {
    event.preventDefault();
    MoveSelection(1);
  } else if (event.key === 'ArrowUp' && !isOpen.value) {
    event.preventDefault();
    MoveSelection(-1);
  } else if (event.key === 'ArrowDown' || event.key === 'F4' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    open();
    nextTick(() => FocusItem(currentSelectedIndex.value < 0 ? 0 : currentSelectedIndex.value));
  }
};

const onEditableDisplayKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === 'F2' || event.key === ' ') {
    event.preventDefault();
    beginEditing();
  } else if (event.key === 'F4' || (event.altKey && event.key === 'ArrowDown')) {
    event.preventDefault();
    open();
    nextTick(() => FocusItem(currentSelectedIndex.value < 0 ? 0 : currentSelectedIndex.value));
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    MoveSelection(1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    MoveSelection(-1);
  }
};

const onEditableKeyDown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    SubmitText();
  } else if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault();
    close();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    endEditing(true);
  } else if (event.key === 'ArrowDown' && !isOpen.value) {
    event.preventDefault();
    open();
  }
};

const onFlyoutKeyDown = (event) => {
  const activeIndex = itemRefs.value.indexOf(document.activeElement);
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
    nextTick(focusCombo);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    FocusItem(activeIndex < 0 ? 0 : activeIndex + 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    FocusItem(activeIndex < 0 ? props.ItemsSource.length - 1 : activeIndex - 1);
  } else if (event.key === 'Home') {
    event.preventDefault();
    FocusItem(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    FocusItem(props.ItemsSource.length - 1);
  }
};

const setItemRef = (element, index) => {
  itemRefs.value[index] = element;
};

const onPointerDown = (event) => {
  lastInputDeviceType = event.pointerType === 'touch' ? 'Touch' : 'Mouse';
};

const onInputKeyDown = (event) => {
  lastInputDeviceType = 'Keyboard';
  if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault();
    close();
    if (props.IsEditable) endEditing(true);
  }
};

const onDocumentPointerDown = (event) => {
  const isInsideComboBox = comboRef.value?.contains(event.target);
  const isInsideFlyout = flyoutRef.value?.contains(event.target);

  if (isEditing.value && !isInsideComboBox && !isInsideFlyout) endEditing();
  if (!isOpen.value || isInsideComboBox || isInsideFlyout) return;
  close();
};

watch(
  () => [props.ItemsSource, props.SelectedIndex, props.SelectedItem, props.SelectedValue],
  () => {
    SyncSelectionFromProperties();
    if (isOpen.value) nextTick(schedulePositionFlyout);
  },
  { immediate: true }
);

watch(() => props.Text, (value) => {
  if (value !== undefined) currentText.value = String(value);
});

watch(() => props.IsDropDownOpen, (value) => {
  if (value !== undefined) setOpen(value);
});

watch(() => props.IsEnabled, (value) => {
  if (!value) {
    endEditing();
    close();
  }
});

watch(() => props.IsEditable, (value) => {
  if (!value) endEditing();
});

onMounted(() => {
  resizeObserver = new ResizeObserver(schedulePositionFlyout);
  if (backgroundRef.value) resizeObserver.observe(backgroundRef.value);
  ObserveAnchorTheme();
  window.addEventListener('resize', schedulePositionFlyout);
  window.addEventListener('scroll', onWindowScroll, true);
  document.addEventListener('pointerdown', onDocumentPointerDown);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  themeObserver?.disconnect();
  flyoutAnimation.cancel();
  window.removeEventListener('resize', schedulePositionFlyout);
  window.removeEventListener('scroll', onWindowScroll, true);
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  if (positionFrame) window.cancelAnimationFrame(positionFrame);
});

</script>

<style>
.win-combo-box {
  position: relative;
  display: inline-block;
  min-width: 64px;
  vertical-align: top;
  color: var(--text-primary);
  font-family: var(--ContentControlThemeFontFamily, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
}

.win-combo-header {
  display: block;
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 20px;
}

.win-combo-btn {
  width: 100%;
  min-width: 120px;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px;
  gap: 0;
  align-items: stretch;
  text-align: left;
}

.win-combo-content {
  min-width: 0;
  padding: 5px 0 7px 12px;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.win-combo-content.is-placeholder {
  color: var(--text-secondary);
}

.win-combo-editable {
  width: 100%;
  min-width: 120px;
  height: 32px;
  min-height: 32px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px;
  align-items: stretch;
  box-sizing: border-box;
  overflow: hidden;
}

.win-combo-edit-display {
  grid-row: 1;
  grid-column: 1 / -1;
}

.win-combo-textbox {
  grid-row: 1;
  grid-column: 1 / -1;
  width: 100%;
  min-width: 0;
  height: 32px;
  min-height: 32px;
}

.win-combo-textbox .win-textbox-border {
  height: 32px;
  min-height: 32px;
}

.win-combo-textbox .win-textbox-content {
  height: 30px;
  min-height: 30px;
}

.win-combo-textbox .win-textbox-field {
  height: 30px;
  min-height: 0;
  padding: 5px 38px 6px 11px;
  line-height: 19px;
}

.win-combo-drop-down-button {
  grid-row: 1;
  grid-column: 2;
  z-index: 1;
  appearance: none;
  width: 30px;
  min-width: 30px;
  height: 24px;
  margin: 4px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: 4px;
}

.win-combo-drop-down-button:hover {
  background: var(--subtle-secondary);
}

.win-combo-drop-down-button:active {
  background: var(--subtle-tertiary);
}

.win-combo-chevron {
  grid-row: 1;
  grid-column: 2;
  z-index: 2;
  width: 12px;
  height: 12px;
  margin: 0 14px 0 0;
  place-self: center end;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: var(--text-secondary);
  font-size: 0;
  line-height: 12px;
}

.win-combo-box.is-disabled {
  color: var(--text-disabled);
}

.win-combo-box.is-disabled .win-combo-header,
.win-combo-box.is-disabled .win-combo-btn,
.win-combo-box.is-disabled .win-combo-chevron {
  color: var(--text-disabled);
}

.win-combo-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;
}

.win-combo-flyout {
  position: fixed;
  z-index: 1000;
  width: max-content;
  min-width: 80px;
  box-sizing: border-box;
  overflow: hidden;
  color: var(--text-primary);
  --win-acrylic-fill: var(--flyout-bg);
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--stroke-surface-flyout);
  border-radius: 8px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  -webkit-backdrop-filter: var(--flyout-backdrop);
  backdrop-filter: var(--flyout-backdrop);
}

.win-combo-flyout.edge-square-top {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.win-combo-flyout.edge-square-bottom {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.win-combo-scroll-viewer {
  width: 100%;
  height: 100%;
  max-height: inherit;
}

.win-combo-scroll-viewer .win-scroll-viewer-viewport {
  max-height: inherit;
}

.win-combo-scroll-viewer .scroll-content {
  min-width: 100%;
}

.win-combo-items-presenter {
  width: 100%;
  box-sizing: border-box;
  padding: 4px 0;
}

.win-combo-flyout.touch-input .win-combo-items-presenter {
  padding-top: 0;
  padding-bottom: 0;
}

.win-combo-item {
  appearance: none;
  position: relative;
  width: 100%;
  min-width: max-content;
  margin: 0;
  padding: 0;
  display: flex;
  box-sizing: border-box;
  color: var(--text-primary);
  background: transparent;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
  font: inherit;
  line-height: 20px;
  text-align: left;
  white-space: nowrap;
}

.win-combo-item-layout {
  position: relative;
  width: calc(100% - 10px);
  min-height: 32px;
  margin: 2px 5px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 3px;
}

.win-combo-item-content {
  min-width: 0;
  padding: 5px 11px 7px;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}

.win-combo-flyout.touch-input .win-combo-item-layout {
  min-height: 44px;
}

.win-combo-flyout.touch-input .win-combo-item-content {
  padding: 11px 11px 13px;
}

.win-combo-item:hover .win-combo-item-layout {
  background: var(--subtle-secondary);
}

.win-combo-item:active .win-combo-item-layout {
  color: var(--text-secondary);
  background: var(--subtle-tertiary);
}

.win-combo-item.selected .win-combo-item-layout {
  background: var(--subtle-secondary);
}

.win-combo-item.selected:hover .win-combo-item-layout {
  background: var(--subtle-tertiary);
}

.win-combo-item:focus-visible {
  outline: 2px solid var(--text-primary);
  outline-offset: -2px;
}

.win-combo-item-pill {
  position: absolute;
  left: 1px;
  top: 50%;
  width: 3px;
  height: 16px;
  border-radius: 1.5px;
  background: var(--accent-base);
  transform: translateY(-50%);
  transition: height 167ms cubic-bezier(0, 0, 0, 1);
}

.win-combo-item.selected:active .win-combo-item-pill {
  height: 10px;
}

</style>
