<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
          <h1 class="page-header">StandardUICommand</h1>
          <p class="page-description">
            StandardUICommand allows the sharing of the UX associated with a command across multiple controls.
            It provides a consistent icon, label, keyboard shortcut, and description for common commands like Delete, Copy, Paste, etc.
          </p>
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"
             >
              <span class="icon">&#xE793;</span>
            </WinButton>
            <WinToggleButton class="header-action" :IsChecked="isFavoriteState"
              @update:IsChecked="toggleFavorite"
             >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Example: Exposing a command in multiple controls -->
            <WinControlExample
              headerText="Exposing a command in multiple controls using StandardUICommand"
              :theme="pageTheme"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <div class="example-container">
                  <div class="description-text">
                    StandardUICommand allows the sharing of the UX associated with a command.
                    In this instance we are using a StandardUICommand to quickly place
                    the delete command in multiple controls. The StandardUICommand contains the icon, label,
                    keyboard shortcut, and a description.
                  </div>

                  <!-- Menu Bar -->
                  <div class="menu-bar">
                    <div class="menu-bar-item">
                      <button class="menu-button" @click="toggleFileMenu">File</button>
                      <div v-if="fileMenuOpen" class="menu-flyout">
                        <div class="menu-item">New</div>
                        <div class="menu-item">Open...</div>
                        <div class="menu-item">Save</div>
                        <div class="menu-item">Exit</div>
                      </div>
                    </div>
                    <div class="menu-bar-item">
                      <button class="menu-button" @click="toggleEditMenu">Edit</button>
                      <div v-if="editMenuOpen" class="menu-flyout">
                        <div class="menu-item" @click="executeDeleteCommand()">
                          <span class="icon">&#xE74D;</span>
                          Delete
                          <span class="accelerator">Delete</span>
                        </div>
                      </div>
                    </div>
                    <div class="menu-bar-item">
                      <button class="menu-button" @click="toggleHelpMenu">Help</button>
                      <div v-if="helpMenuOpen" class="menu-flyout">
                        <div class="menu-item">About</div>
                      </div>
                    </div>
                  </div>

                  <!-- List View -->
                  <div class="list-view">
                    <div
                      v-for="(item, index) in listItems"
                      :key="index"
                      class="list-item"
                      :class="{ 'selected': selectedIndex === index }"
                      @click="selectedIndex = index"
                      @contextmenu.prevent="showContextMenu($event, index)"
                      @mouseenter="hoveredIndex = index"
                      @mouseleave="hoveredIndex = -1">
                      <span class="list-item-text">{{ item }}</span>
                      <WinButton
                        v-if="hoveredIndex === index"
                        class="hover-delete-button"
                        @click.stop="executeDeleteCommand(item)">
                        <span class="icon">&#xE74D;</span>
                      </WinButton>
                    </div>
                  </div>

                  <!-- Context Menu -->
                  <div
                    v-if="contextMenuVisible"
                    class="context-menu"
                    :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }"
                    @click="hideContextMenu">
                    <div class="menu-item" @click="executeDeleteCommand(contextMenuItem)">
                      <span class="icon">&#xE74D;</span>
                      Delete
                      <span class="accelerator">Delete</span>
                    </div>
                  </div>
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'standarduicommand');

const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example 1: StandardUICommand with Delete
const listItems = ref([]);
const selectedIndex = ref(-1);
const hoveredIndex = ref(-1);

// Initialize list items
for (let i = 0; i < 15; i++) {
  listItems.value.push(`List item ${i}`);
}

// Menu states
const fileMenuOpen = ref(false);
const editMenuOpen = ref(false);
const helpMenuOpen = ref(false);

const toggleFileMenu = () => {
  fileMenuOpen.value = !fileMenuOpen.value;
  editMenuOpen.value = false;
  helpMenuOpen.value = false;
};

const toggleEditMenu = () => {
  editMenuOpen.value = !editMenuOpen.value;
  fileMenuOpen.value = false;
  helpMenuOpen.value = false;
};

const toggleHelpMenu = () => {
  helpMenuOpen.value = !helpMenuOpen.value;
  fileMenuOpen.value = false;
  editMenuOpen.value = false;
};

// Context menu
const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextMenuItem = ref('');

const showContextMenu = (event, index) => {
  selectedIndex.value = index;
  contextMenuItem.value = listItems.value[index];
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  contextMenuVisible.value = true;
};

const hideContextMenu = () => {
  contextMenuVisible.value = false;
};

// Delete command execution
const executeDeleteCommand = (item) => {
  if (item) {
    const index = listItems.value.indexOf(item);
    if (index !== -1) {
      listItems.value.splice(index, 1);
    }
  } else if (selectedIndex.value !== -1) {
    listItems.value.splice(selectedIndex.value, 1);
    selectedIndex.value = -1;
  }
  editMenuOpen.value = false;
  hideContextMenu();
};

// Code examples
const example1Template = `<div class="menu-bar">
  <div class="menu-bar-item">
    <button class="menu-button">Edit</button>
    <div class="menu-flyout">
      <div class="menu-item" @click="executeDeleteCommand()">
        <span class="icon">&#xE74D;</span>
        Delete
      </div>
    </div>
  </div>
</div>

<div class="list-view">
  <div
    v-for="(item, index) in listItems"
    :key="index"
    class="list-item"
    @contextmenu.prevent="showContextMenu($event, index)"
    @mouseenter="hoveredIndex = index"
    @mouseleave="hoveredIndex = -1">
    <span>{{ item }}</span>
    <WinButton v-if="hoveredIndex === index"
      @click.stop="executeDeleteCommand(item)">
      <span class="icon">&#xE74D;</span>
    </WinButton>
  </div>
</div>`;

const example1Vue = `const listItems = ref([]);
for (let i = 0; i < 15; i++) {
  listItems.value.push(\`List item \${i}\`);
}

const selectedIndex = ref(-1);
const hoveredIndex = ref(-1);

const executeDeleteCommand = (item) => {
  if (item) {
    const index = listItems.value.indexOf(item);
    if (index !== -1) {
      listItems.value.splice(index, 1);
    }
  } else if (selectedIndex.value !== -1) {
    listItems.value.splice(selectedIndex.value, 1);
    selectedIndex.value = -1;
  }
};

const showContextMenu = (event, index) => {
  selectedIndex.value = index;
  // Show context menu with delete option
};`;
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.icon {
  font-size: 16px;
}

.example-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.description-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}

/* Menu Bar */
.menu-bar {
  display: flex;
  gap: 0;
  background: var(--layer-fill-color-default);
  border: 1px solid var(--control-stroke-default);
  border-radius: 4px;
  padding: 4px;
}

.menu-bar-item {
  position: relative;
}

.menu-button {
  background: transparent;
  border: none;
  padding: 6px 12px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.1s;
}

.menu-button:hover {
  background: var(--subtle-fill-secondary);
}

.menu-flyout {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--control-stroke-default);
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  min-width: 150px;
  z-index: 1000;
  padding: 4px;
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
  backdrop-filter: var(--flyout-backdrop, blur(30px));
}

.menu-flyout::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--flyout-bg, var(--layer-fill-color-default));
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.1s;
}

.menu-item:hover {
  background: var(--subtle-fill-secondary);
}

.menu-item .icon {
  font-size: 16px;
}

.accelerator {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-secondary);
}

/* List View */
.list-view {
  border: 1px solid var(--control-stroke-default);
  border-radius: 4px;
  background: var(--layer-fill-color-default);
  max-height: 500px;
  overflow-y: auto;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  min-height: 60px;
  border-bottom: 1px solid var(--divider-stroke-default);
  cursor: pointer;
  transition: background 0.1s;
  position: relative;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background: var(--subtle-fill-secondary);
}

.list-item.selected {
  background: var(--subtle-fill-secondary);
}

.list-item-text {
  font-size: 18px;
  color: var(--text-primary);
}

.hover-delete-button {
  position: absolute;
  right: 16px;
}

/* Context Menu */
.context-menu {
  position: fixed;
  background: var(--layer-fill-color-default);
  border: 1px solid var(--control-stroke-default);
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  min-width: 150px;
  z-index: 1000;
  padding: 4px;
}
</style>
