<template>
  <nav class="win-menu-bar" role="menubar" :aria-label="ariaLabel">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="win-menu-bar-item"
      :class="{ 'is-open': openIndex === index, 'is-disabled': item.isDisabled }"
      role="none"
    >
      <button
        class="win-menu-bar-button"
        role="menuitem"
        :aria-haspopup="true"
        :aria-expanded="openIndex === index"
        :aria-disabled="item.isDisabled"
        :disabled="item.isDisabled"
        :tabindex="focusedIndex === index ? 0 : -1"
        @click="toggleMenu(index)"
        @mouseenter="handleMouseEnter(index)"
        @keydown="handleMenuBarKeyDown($event, index)"
        @focus="focusedIndex = index"
      >
        {{ item.title }}
      </button>

      <!-- MenuFlyout -->
      <Teleport to="body">
        <div
          v-if="openIndex === index"
          class="win-menu-flyout-overlay"
          @click="closeMenu"
          @contextmenu.prevent="closeMenu"
        ></div>
        <div
          v-if="openIndex === index"
          ref="flyoutRef"
          class="win-menu-flyout"
          role="menu"
          :aria-label="item.title"
          :style="flyoutStyle"
          @keydown="handleFlyoutKeyDown"
        >
          <template v-for="(child, childIndex) in item.items" :key="childIndex">
            <!-- MenuFlyoutSeparator -->
            <div
              v-if="child.type === 'separator'"
              class="win-menu-flyout-separator"
              role="separator"
            ></div>

            <!-- MenuFlyoutSubItem -->
            <div
              v-else-if="child.type === 'submenu'"
              class="win-menu-flyout-item win-menu-flyout-submenu"
              :class="{ 'is-open': submenuOpenIndex === childIndex, 'is-disabled': child.isDisabled }"
              role="menuitem"
              :aria-haspopup="true"
              :aria-expanded="submenuOpenIndex === childIndex"
              :aria-disabled="child.isDisabled"
              :tabindex="flyoutFocusedIndex === childIndex ? 0 : -1"
              @mouseenter="openSubmenu(childIndex)"
              @mouseleave="scheduleCloseSubmenu"
              @focus="flyoutFocusedIndex = childIndex"
            >
              <span class="win-menu-flyout-item-text">{{ child.text }}</span>
              <span class="win-menu-flyout-chevron icon">&#xE76C;</span>

              <!-- Submenu Flyout -->
              <div
                v-if="submenuOpenIndex === childIndex"
                class="win-menu-submenu-flyout"
                role="menu"
                :aria-label="child.text"
                @mouseenter="cancelCloseSubmenu"
                @mouseleave="scheduleCloseSubmenu"
              >
                <template v-for="(subChild, subIndex) in child.items" :key="subIndex">
                  <!-- Separator in submenu -->
                  <div
                    v-if="subChild.type === 'separator'"
                    class="win-menu-flyout-separator"
                    role="separator"
                  ></div>

                  <!-- Regular item in submenu -->
                  <div
                    v-else
                    class="win-menu-flyout-item"
                    :class="{ 'is-disabled': subChild.isDisabled, 'is-checked': subChild.isChecked }"
                    role="menuitem"
                    :aria-disabled="subChild.isDisabled"
                    tabindex="-1"
                    @click="handleSubmenuItemClick(subChild, $event)"
                  >
                    <span class="win-menu-flyout-item-text">{{ subChild.text }}</span>
                    <span v-if="subChild.keyboardAccelerator" class="win-menu-flyout-accelerator">
                      {{ formatAccelerator(subChild.keyboardAccelerator) }}
                    </span>
                  </div>
                </template>
              </div>
            </div>

            <!-- RadioMenuFlyoutItem -->
            <div
              v-else-if="child.type === 'radio'"
              class="win-menu-flyout-item win-menu-flyout-radio"
              :class="{ 'is-disabled': child.isDisabled, 'is-checked': child.isChecked }"
              role="menuitemradio"
              :aria-checked="child.isChecked"
              :aria-disabled="child.isDisabled"
              :tabindex="flyoutFocusedIndex === childIndex ? 0 : -1"
              @click="handleRadioItemClick(item, child, childIndex, $event)"
              @focus="flyoutFocusedIndex = childIndex"
            >
              <span class="win-menu-flyout-radio-indicator">
                <span v-if="child.isChecked" class="win-menu-flyout-radio-dot"></span>
              </span>
              <span class="win-menu-flyout-item-text">{{ child.text }}</span>
              <span v-if="child.keyboardAccelerator" class="win-menu-flyout-accelerator">
                {{ formatAccelerator(child.keyboardAccelerator) }}
              </span>
            </div>

            <!-- Regular MenuFlyoutItem -->
            <div
              v-else
              class="win-menu-flyout-item"
              :class="{ 'is-disabled': child.isDisabled }"
              role="menuitem"
              :aria-disabled="child.isDisabled"
              :tabindex="flyoutFocusedIndex === childIndex ? 0 : -1"
              @click="handleItemClick(child, $event)"
              @focus="flyoutFocusedIndex = childIndex"
            >
              <span class="win-menu-flyout-item-text">{{ child.text }}</span>
              <span v-if="child.keyboardAccelerator" class="win-menu-flyout-accelerator">
                {{ formatAccelerator(child.keyboardAccelerator) }}
              </span>
            </div>
          </template>
        </div>
      </Teleport>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // items: [{ title: 'File', items: [{ text: 'New', type?: 'item'|'radio'|'separator'|'submenu', isDisabled?, isChecked?, groupName?, keyboardAccelerator?: { key, modifiers }, items?: [...] }] }]
  },
  ariaLabel: {
    type: String,
    default: 'Menu'
  }
});

const emit = defineEmits(['itemClick']);

// State
const openIndex = ref(null);
const focusedIndex = ref(0);
const flyoutFocusedIndex = ref(0);
const submenuOpenIndex = ref(null);
const flyoutStyle = ref({});
const flyoutRef = ref(null);
const isMouseMode = ref(false);
let submenuCloseTimer = null;

// Toggle menu
const toggleMenu = async (index) => {
  if (props.items[index]?.isDisabled) return;

  if (openIndex.value === index) {
    closeMenu();
  } else {
    openIndex.value = index;
    focusedIndex.value = index;
    flyoutFocusedIndex.value = 0;
    submenuOpenIndex.value = null;
    isMouseMode.value = true;

    await nextTick();
    positionFlyout(index);
  }
};

// Position flyout
const positionFlyout = (index) => {
  const button = document.querySelectorAll('.win-menu-bar-button')[index];
  if (!button) return;

  const rect = button.getBoundingClientRect();
  flyoutStyle.value = {
    top: `${rect.bottom + 2}px`,
    left: `${rect.left}px`,
    minWidth: `${Math.max(rect.width, 200)}px`
  };
};

// Mouse interactions
const handleMouseEnter = (index) => {
  if (openIndex.value !== null && openIndex.value !== index && !props.items[index]?.isDisabled) {
    openIndex.value = index;
    focusedIndex.value = index;
    flyoutFocusedIndex.value = 0;
    submenuOpenIndex.value = null;
    isMouseMode.value = true;
    nextTick(() => positionFlyout(index));
  }
};

// Submenu handling
const openSubmenu = (index) => {
  cancelCloseSubmenu();
  submenuOpenIndex.value = index;
};

const scheduleCloseSubmenu = () => {
  submenuCloseTimer = setTimeout(() => {
    submenuOpenIndex.value = null;
  }, 200);
};

const cancelCloseSubmenu = () => {
  if (submenuCloseTimer) {
    clearTimeout(submenuCloseTimer);
    submenuCloseTimer = null;
  }
};

// Close menu
const closeMenu = () => {
  openIndex.value = null;
  submenuOpenIndex.value = null;
  cancelCloseSubmenu();
};

// Item click handlers
const handleItemClick = (item, event) => {
  if (item.isDisabled) {
    event.stopPropagation();
    return;
  }

  emit('itemClick', { item, type: 'item' });
  closeMenu();
};

const handleRadioItemClick = (menuBarItem, radioItem, childIndex, event) => {
  if (radioItem.isDisabled) {
    event.stopPropagation();
    return;
  }

  // Update isChecked for items in the same group
  if (radioItem.groupName) {
    menuBarItem.items.forEach((child) => {
      if (child.type === 'radio' && child.groupName === radioItem.groupName) {
        child.isChecked = false;
      }
    });
    radioItem.isChecked = true;
  }

  emit('itemClick', { item: radioItem, type: 'radio' });
  closeMenu();
};

const handleSubmenuItemClick = (item, event) => {
  if (item.isDisabled) {
    event.stopPropagation();
    return;
  }

  emit('itemClick', { item, type: 'submenu-item' });
  closeMenu();
};

// Keyboard navigation - MenuBar level
const handleMenuBarKeyDown = (event, index) => {
  const key = event.key;

  if (key === 'ArrowRight') {
    event.preventDefault();
    focusNextMenuBarItem(1);
  } else if (key === 'ArrowLeft') {
    event.preventDefault();
    focusNextMenuBarItem(-1);
  } else if (key === 'ArrowDown' || key === 'Enter' || key === ' ') {
    event.preventDefault();
    if (openIndex.value !== index) {
      toggleMenu(index);
    } else {
      focusFlyoutItem(0);
    }
  } else if (key === 'Escape') {
    event.preventDefault();
    closeMenu();
  }
};

// Keyboard navigation - Flyout level
const handleFlyoutKeyDown = (event) => {
  const key = event.key;
  const currentMenu = props.items[openIndex.value];
  if (!currentMenu) return;

  const navigableItems = currentMenu.items.filter(
    (item) => item.type !== 'separator' && !item.isDisabled
  );

  if (key === 'ArrowDown') {
    event.preventDefault();
    focusNextFlyoutItem(1, navigableItems);
  } else if (key === 'ArrowUp') {
    event.preventDefault();
    focusNextFlyoutItem(-1, navigableItems);
  } else if (key === 'ArrowRight') {
    event.preventDefault();
    const currentItem = navigableItems[flyoutFocusedIndex.value];
    if (currentItem?.type === 'submenu') {
      openSubmenu(currentMenu.items.indexOf(currentItem));
    } else {
      focusNextMenuBarItem(1);
    }
  } else if (key === 'ArrowLeft') {
    event.preventDefault();
    if (submenuOpenIndex.value !== null) {
      submenuOpenIndex.value = null;
    } else {
      focusNextMenuBarItem(-1);
    }
  } else if (key === 'Enter' || key === ' ') {
    event.preventDefault();
    const currentItem = navigableItems[flyoutFocusedIndex.value];
    const actualIndex = currentMenu.items.indexOf(currentItem);

    if (currentItem?.type === 'submenu') {
      openSubmenu(actualIndex);
    } else if (currentItem?.type === 'radio') {
      handleRadioItemClick(currentMenu, currentItem, actualIndex, event);
    } else if (currentItem) {
      handleItemClick(currentItem, event);
    }
  } else if (key === 'Escape') {
    event.preventDefault();
    closeMenu();
    // Return focus to menu bar
    const buttons = document.querySelectorAll('.win-menu-bar-button');
    buttons[focusedIndex.value]?.focus();
  }
};

// Focus navigation helpers
const focusNextMenuBarItem = (direction) => {
  const totalItems = props.items.length;
  let nextIndex = focusedIndex.value;

  do {
    nextIndex = (nextIndex + direction + totalItems) % totalItems;
  } while (props.items[nextIndex]?.isDisabled && nextIndex !== focusedIndex.value);

  if (!props.items[nextIndex]?.isDisabled) {
    if (openIndex.value !== null) {
      openIndex.value = nextIndex;
      positionFlyout(nextIndex);
      flyoutFocusedIndex.value = 0;
      submenuOpenIndex.value = null;
    }
    focusedIndex.value = nextIndex;
    const buttons = document.querySelectorAll('.win-menu-bar-button');
    buttons[nextIndex]?.focus();
  }
};

const focusNextFlyoutItem = (direction, navigableItems) => {
  const totalItems = navigableItems.length;
  if (totalItems === 0) return;

  flyoutFocusedIndex.value = (flyoutFocusedIndex.value + direction + totalItems) % totalItems;
  isMouseMode.value = false;
  focusFlyoutItem(flyoutFocusedIndex.value);
};

const focusFlyoutItem = (index) => {
  nextTick(() => {
    const items = flyoutRef.value?.querySelectorAll('.win-menu-flyout-item:not(.is-disabled)');
    items?.[index]?.focus();
  });
};

// Format keyboard accelerator
const formatAccelerator = (accelerator) => {
  if (!accelerator) return '';

  const { key, modifiers } = accelerator;
  const parts = [];

  if (modifiers?.includes('Control')) parts.push('Ctrl');
  if (modifiers?.includes('Shift')) parts.push('Shift');
  if (modifiers?.includes('Alt')) parts.push('Alt');
  if (key) parts.push(key.toUpperCase());

  return parts.join('+');
};

// Global keyboard accelerators
const handleGlobalKeyDown = (event) => {
  if (openIndex.value !== null) return; // Only trigger when menu is closed

  props.items.forEach((menuBarItem) => {
    menuBarItem.items?.forEach((item) => {
      if (item.keyboardAccelerator && matchesAccelerator(event, item.keyboardAccelerator)) {
        event.preventDefault();
        if (item.type === 'radio') {
          // Handle radio item
          if (item.groupName) {
            menuBarItem.items.forEach((child) => {
              if (child.type === 'radio' && child.groupName === item.groupName) {
                child.isChecked = false;
              }
            });
            item.isChecked = true;
          }
        }
        emit('itemClick', { item, type: item.type || 'item' });
      }
    });
  });
};

const matchesAccelerator = (event, accelerator) => {
  if (!accelerator) return false;

  const { key, modifiers = [] } = accelerator;
  const keyMatch = event.key.toUpperCase() === key.toUpperCase();
  const ctrlMatch = modifiers.includes('Control') === event.ctrlKey;
  const shiftMatch = modifiers.includes('Shift') === event.shiftKey;
  const altMatch = modifiers.includes('Alt') === event.altKey;

  return keyMatch && ctrlMatch && shiftMatch && altMatch;
};

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown);
  cancelCloseSubmenu();
});

// Watch for open state changes
watch(openIndex, (newVal) => {
  if (newVal !== null) {
    flyoutFocusedIndex.value = 0;
  }
});
</script>

<style scoped>
.win-menu-bar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  background: var(--layer-alt);
  border-bottom: 1px solid var(--stroke-surface-flyout);
  height: 40px;
}

.win-menu-bar-item {
  position: relative;
}

.win-menu-bar-button {
  background: transparent;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  font-family: var(--font-family);
  color: var(--text-fill-color-primary);
  cursor: pointer;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
  user-select: none;
  white-space: nowrap;
}

.win-menu-bar-button:hover {
  background: var(--subtle-fill-color-secondary);
}

.win-menu-bar-button:active,
.win-menu-bar-item.is-open .win-menu-bar-button {
  background: var(--subtle-tertiary);
  color: var(--text-fill-color-secondary);
}

.win-menu-bar-button:focus-visible {
  outline: 2px solid var(--accent-fill-color-default);
  outline-offset: -2px;
}

.win-menu-bar-button:disabled {
  color: var(--text-fill-color-disabled);
  cursor: not-allowed;
}

.win-menu-bar-item.is-disabled .win-menu-bar-button:hover {
  background: transparent;
}

/* Flyout overlay */
.win-menu-flyout-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
}

/* MenuFlyout */
.win-menu-flyout {
  position: fixed;
  border: 1px solid var(--stroke-surface-flyout);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  background: var(--flyout-bg);
  background-image: var(--flyout-material-overlay);
  backdrop-filter: var(--flyout-backdrop);
  -webkit-backdrop-filter: var(--flyout-backdrop);
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: menu-flyout-enter 0.167s var(--fast-out-slow-in);
  z-index: 1000;
  min-width: 200px;
}

@keyframes menu-flyout-enter {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* MenuFlyoutItem */
.win-menu-flyout-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  color: var(--text-fill-color-primary);
  font-size: 14px;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
  user-select: none;
  gap: 24px;
  min-height: 32px;
}

.win-menu-flyout-item:hover:not(.is-disabled) {
  background: var(--subtle-fill-color-secondary);
}

.win-menu-flyout-item:active:not(.is-disabled) {
  background: var(--subtle-tertiary);
  color: var(--text-fill-color-secondary);
}

.win-menu-flyout-item:focus-visible {
  outline: 2px solid var(--accent-fill-color-default);
  outline-offset: -2px;
}

.win-menu-flyout-item.is-disabled {
  color: var(--text-fill-color-disabled);
  cursor: not-allowed;
}

.win-menu-flyout-item-text {
  flex: 1;
}

.win-menu-flyout-accelerator {
  font-size: 12px;
  color: var(--text-fill-color-secondary);
  margin-left: auto;
}

/* MenuFlyoutSeparator */
.win-menu-flyout-separator {
  height: 1px;
  background: var(--divider-stroke);
  margin: 4px 0;
}

/* RadioMenuFlyoutItem */
.win-menu-flyout-radio {
  padding-left: 8px;
  gap: 8px;
}

.win-menu-flyout-radio-indicator {
  width: 16px;
  height: 16px;
  border: 1px solid var(--control-stroke-color-default);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--control-fill-color-default);
  transition: border-color var(--fast-duration);
}

.win-menu-flyout-radio:hover:not(.is-disabled) .win-menu-flyout-radio-indicator {
  border-color: var(--ctrl-border-hover);
}

.win-menu-flyout-radio.is-checked .win-menu-flyout-radio-indicator {
  border-color: var(--accent-base);
}

.win-menu-flyout-radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-base);
}

/* MenuFlyoutSubItem */
.win-menu-flyout-submenu {
  position: relative;
}

.win-menu-flyout-chevron {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 12px;
  margin-left: auto;
  color: var(--text-fill-color-secondary);
}

.win-menu-submenu-flyout {
  position: absolute;
  left: 100%;
  top: -4px;
  border: 1px solid var(--stroke-surface-flyout);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  background: var(--flyout-bg);
  background-image: var(--flyout-material-overlay);
  backdrop-filter: var(--flyout-backdrop);
  -webkit-backdrop-filter: var(--flyout-backdrop);
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: submenu-flyout-enter 0.15s var(--fast-out-slow-in);
  z-index: 1001;
  min-width: 180px;
  margin-left: 2px;
}

@keyframes submenu-flyout-enter {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
