<template>
  <nav
    ref="menuBarRef"
    class="win-menu-bar"
    role="menubar"
    :aria-label="AutomationPropertiesName"
    @pointerenter="onMenuBarEnter"
    @pointerleave="onMenuBarLeave">
    <div
      v-for="(item, index) in Items"
      :key="index"
      class="win-menu-bar-item"
      :class="{ 'is-open': openIndex === index, 'is-disabled': isItemDisabled(item) }"
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
        @pointerenter="onItemPointerEnter(index)"
        @pointerdown="onItemPointerDown(index)"
        @pointerup="pressedIndex = null"
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
    @Select="invokeItem"
    @PointerEnter="onFlyoutEnter"
    @PointerLeave="onFlyoutLeave" />
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';
import WinTextBlock from './WinTextBlock.vue';

const props = defineProps({
  Items: { type: Array, required: true },
  AutomationPropertiesName: { type: String, default: 'Menu' },
  Theme: { type: String, default: '' }
});

const emit = defineEmits(['ItemClick']);

const menuBarRef = ref(null);
const openIndex = ref(null);
const focusedIndex = ref(0);
const pressedIndex = ref(null);
const isPointerInBar = ref(false);
const isPointerInFlyout = ref(false);
const anchorRect = ref(null);
const menuMinWidth = ref(200);
let closeTimer = null;

const Items = computed(() => props.Items);
const openMenuItem = computed(() => openIndex.value === null ? null : Items.value[openIndex.value]);

const isItemDisabled = (item) => item?.IsEnabled === false;

const updateAnchor = (index) => {
  const button = menuBarRef.value?.querySelectorAll('.win-menu-bar-button')[index];
  if (!button) return;
  const rect = button.getBoundingClientRect();
  anchorRect.value = rect;
  menuMinWidth.value = Math.max(rect.width, 200);
};

const openMenu = async (index) => {
  const item = Items.value[index];
  if (!item || isItemDisabled(item) || !item.Items?.length) return;
  const wasOpenIndex = openIndex.value;
  openIndex.value = index;
  focusedIndex.value = index;
  cancelCloseMenu();
  await nextTick();
  if (wasOpenIndex !== index || !anchorRect.value) {
    updateAnchor(index);
  }
};

const closeMenu = () => {
  openIndex.value = null;
  pressedIndex.value = null;
  cancelCloseMenu();
};

const scheduleCloseMenu = () => {
  cancelCloseMenu();
  closeTimer = window.setTimeout(() => {
    if (!isPointerInBar.value && !isPointerInFlyout.value && pressedIndex.value === null) {
      closeMenu();
    }
  }, 180);
};

const cancelCloseMenu = () => {
  if (closeTimer) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const onMenuBarEnter = () => {
  isPointerInBar.value = true;
  cancelCloseMenu();
};

const onMenuBarLeave = () => {
  isPointerInBar.value = false;
  scheduleCloseMenu();
};

const onFlyoutEnter = () => {
  isPointerInFlyout.value = true;
  cancelCloseMenu();
};

const onFlyoutLeave = () => {
  isPointerInFlyout.value = false;
  scheduleCloseMenu();
};

const onItemPointerEnter = (index) => {
  cancelCloseMenu();
  if (openIndex.value !== null) {
    void openMenu(index);
  }
};

const onItemPointerDown = (index) => {
  pressedIndex.value = index;
  cancelCloseMenu();
  if (openIndex.value === null || openIndex.value !== index) {
    void openMenu(index);
  } else {
    updateAnchor(index);
  }
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
  cancelCloseMenu();
});
</script>

<style scoped>
.win-menu-bar {
  position: relative;
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  min-height: 40px;
  background: var(--layer-alt, transparent);
}

.win-menu-bar-button {
  min-height: 32px;
  padding: 5px 12px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
}

.win-menu-bar-button:hover {
  background: var(--subtle-secondary);
}

.win-menu-bar-button:active,
.win-menu-bar-item.is-open .win-menu-bar-button {
  background: var(--subtle-tertiary);
  color: var(--text-secondary);
}

.win-menu-bar-button:disabled {
  color: var(--text-disabled);
  cursor: default;
}
</style>
