<template>
  <nav
    ref="menuBarRef"
    class="win-menu-bar"
    role="menubar"
    :aria-label="props['AutomationProperties.Name']">
    <div
      v-for="(item, index) in Items"
      :key="index"
      class="win-menu-bar-item"
      :class="{
        'is-open': openIndex === index,
        'is-pointer-over': hoverIndex === index,
        'is-pressed': pressedIndex === index,
        'is-disabled': isItemDisabled(item)
      }"
      role="none">
      <button
        class="win-menu-bar-button"
        type="button"
        role="menuitem"
        :aria-haspopup="true"
        :aria-expanded="openIndex === index"
        :aria-disabled="isItemDisabled(item)"
        :disabled="isItemDisabled(item)"
        :tabindex="focusedIndex === index ? 0 : -1"
        @pointerenter="onItemPointerEnter($event, index)"
        @pointerleave="onItemPointerLeave(index)"
        @pointerdown="onItemPointerDown($event, index)"
        @pointerup="pressedIndex = null"
        @pointercancel="pressedIndex = null"
        @keydown="onMenuBarKeyDown($event, index)"
        @focus="focusedIndex = index">
        <WinTextBlock :Text="item.Title" />
      </button>
    </div>
  </nav>

  <WinMenuFlyout
    :Open="openIndex !== null"
    :AnchorRect="anchorRect"
    :Items="openMenuItem?.Items || []"
    :MinWidth="menuMinWidth"
    :Theme="Theme"
    :Gap="0"
    OverlayInputPassThroughElement
    Placement="BottomEdgeAlignedLeft"
    @Close="closeMenu"
    @Select="invokeItem" />
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';
import WinTextBlock from './WinTextBlock.vue';

const props = defineProps({
  Items: { type: Array, required: true },
  'AutomationProperties.Name': { type: String, default: 'Menu' },
  Theme: { type: String, default: '' }
});

const emit = defineEmits(['ItemClick']);

const menuBarRef = ref(null);
const openIndex = ref(null);
const focusedIndex = ref(0);
const hoverOpenedIndex = ref(null);
const hoverIndex = ref(null);
const pressedIndex = ref(null);
const anchorRect = ref(null);
const menuMinWidth = ref(96);

const Items = computed(() => props.Items);
const openMenuItem = computed(() => openIndex.value === null ? null : Items.value[openIndex.value]);

const isItemDisabled = (item) => item?.IsEnabled === false || item?.Command?.CanExecute?.(item.CommandParameter) === false;

const updateAnchor = (index) => {
  const button = menuBarRef.value?.querySelectorAll('.win-menu-bar-button')[index];
  if (!button) return;
  const rect = button.getBoundingClientRect();
  anchorRect.value = rect;
  menuMinWidth.value = Math.max(rect.width, 96);
};

const openMenu = async (index) => {
  const item = Items.value[index];
  if (!item || isItemDisabled(item) || !item.Items?.length) return;
  const wasOpenIndex = openIndex.value;
  openIndex.value = index;
  focusedIndex.value = index;
  await nextTick();
  if (wasOpenIndex !== index || !anchorRect.value) {
    updateAnchor(index);
  }
};

const closeMenu = () => {
  openIndex.value = null;
  hoverOpenedIndex.value = null;
  pressedIndex.value = null;
};

const onItemPointerEnter = (event, index) => {
  hoverIndex.value = index;
  if (event.pointerType !== 'touch' && openIndex.value !== null && openIndex.value !== index) {
    hoverOpenedIndex.value = index;
    void openMenu(index);
  }
};

const onItemPointerLeave = (index) => {
  if (hoverIndex.value === index) hoverIndex.value = null;
  if (hoverOpenedIndex.value === index) hoverOpenedIndex.value = null;
};

const onItemPointerDown = (event, index) => {
  event.preventDefault();
  pressedIndex.value = index;
  if (openIndex.value === index) {
    if (hoverOpenedIndex.value === index) {
      hoverOpenedIndex.value = null;
      updateAnchor(index);
    } else {
      closeMenu();
    }
    return;
  }
  hoverOpenedIndex.value = null;
  void openMenu(index);
};

const updateRadioGroup = (item) => {
  if (!item?.GroupName || !openMenuItem.value) return;
  const update = (items) => {
    items.forEach((candidate) => {
      if (candidate.GroupName === item.GroupName) candidate.IsChecked = candidate === item;
      if (candidate.Items) update(candidate.Items);
    });
  };
  update(openMenuItem.value.Items);
};

const invokeItem = (item) => {
  if (isItemDisabled(item)) return;
  updateRadioGroup(item);
  emit('ItemClick', { Item: item });
  closeMenu();
};

const focusMenuBarItem = (direction) => {
  const count = Items.value.length;
  let next = focusedIndex.value;
  do {
    next = (next + direction + count) % count;
  } while (isItemDisabled(Items.value[next]) && next !== focusedIndex.value);
  focusedIndex.value = next;
  menuBarRef.value?.querySelectorAll('.win-menu-bar-button')[next]?.focus();
  if (openIndex.value !== null) void openMenu(next);
};

const onMenuBarKeyDown = (event, index) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    focusMenuBarItem(1);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    focusMenuBarItem(-1);
  } else if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    void openMenu(index);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu();
  }
};

const getKeyboardAccelerator = (item) => item?.KeyboardAccelerators?.[0] ?? null;

const handleGlobalKeyDown = (event) => {
  if (openIndex.value !== null) return;
  Items.value.forEach((menuItem) => {
    menuItem.Items?.forEach((item) => {
      const accelerator = getKeyboardAccelerator(item);
      if (!accelerator) return;
      const { Key, Modifiers = [] } = accelerator;
      const matches =
        event.key.toUpperCase() === String(Key).toUpperCase() &&
        Modifiers.includes('Control') === event.ctrlKey &&
        Modifiers.includes('Shift') === event.shiftKey &&
        Modifiers.includes('Alt') === event.altKey;
      if (matches) {
        event.preventDefault();
        emit('ItemClick', { Item: item });
      }
    });
  });
};

const handleDocumentPointerDown = (event) => {
  if (openIndex.value === null) return;
  const target = event.target;
  if (menuBarRef.value?.contains(target)) return;
  if (target instanceof Element && target.closest('.win-menu-flyout-wrap')) return;
  closeMenu();
  hoverIndex.value = null;
};

watch(openIndex, (index) => {
  if (index !== null) void nextTick(() => updateAnchor(index));
});

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeyDown);
  document.addEventListener('pointerdown', handleDocumentPointerDown, true);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown);
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true);
});
</script>

<style scoped>
.win-menu-bar {
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 0;
  min-height: 40px;
  background: var(--MenuBarBackground, var(--SubtleFillColorTransparentBrush, transparent));
}

.win-menu-bar-item {
  display: flex;
  align-items: stretch;
  margin: 4px;
  border-radius: var(--ControlCornerRadius, 4px);
  border: var(--MenuBarItemBorderThickness, 0) solid var(--MenuBarItemBorderBrush, var(--ControlAltFillColorTertiaryBrush, transparent));
  background: var(--MenuBarItemBackground, var(--SubtleFillColorTransparentBrush, transparent));
}

.win-menu-bar-button {
  min-height: 0;
  height: 100%;
  padding: 4px 10px;
  border: 0;
  border-radius: inherit;
  background: transparent;
  color: inherit;
  cursor: default;
  font: inherit;
  font-size: 14px;
  line-height: 20px;
}

.win-menu-bar-item.is-pointer-over {
  background: var(--MenuBarItemBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
  border-color: var(--MenuBarItemBorderBrushPointerOver, var(--ControlStrokeColorDefaultBrush, transparent));
}

.win-menu-bar-item.is-pressed {
  background: var(--MenuBarItemBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
  border-color: var(--MenuBarItemBorderBrushPressed, var(--ControlStrokeColorDefaultBrush, transparent));
}

.win-menu-bar-item.is-open .win-menu-bar-button {
  background: transparent;
}

.win-menu-bar-item.is-open {
  background: var(--MenuBarItemBackgroundSelected, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
  border-color: var(--MenuBarItemBorderBrushSelected, var(--ControlStrokeColorDefaultBrush, transparent));
}

.win-menu-bar-button:disabled {
  color: var(--TextFillColorDisabledBrush, var(--text-disabled));
  cursor: default;
}

.win-menu-bar-button:focus-visible {
  outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary));
  outline-offset: -3px;
}

.win-menu-bar-button :deep(.win-text-block) {
  color: inherit;
}
</style>
