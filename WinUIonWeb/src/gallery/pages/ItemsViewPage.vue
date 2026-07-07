<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">ItemsView</h1>
      <p class="page-description">
        The ItemsView control displays a data collection with customizable layout and selection behavior. It supports different layout types including StackLayout, UniformGridLayout, and LinedFlowLayout.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Basic ItemsView -->
    <WinControlExample
      headerText="Basic ItemsView"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: var(--text-secondary);">
            This is a basic ItemsView which uses its default StackLayout layout and a simple ItemTemplate.<br />
            Hit the Enter key, double-click or double-tap an item to invoke it.
          </p>
          <div class="items-view-container basic-view">
            <div
              v-for="item in basicItems"
              :key="item.id"
              class="item-card basic-item"
              tabindex="0"
              @click="onBasicItemInvoked(item)"
              @dblclick="onBasicItemInvoked(item)"
              @keydown.enter="onBasicItemInvoked(item)">
              <img :src="item.imageSrc" :alt="item.title" class="item-image" />
            </div>
          </div>
        </div>
      </template>
      <template #options>
        <p class="output-text">{{ basicInvokeOutput }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: ItemsView with Swappable Layouts -->
    <WinControlExample
      headerText="ItemsView with swappable layouts"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: var(--text-secondary);">
            Use the options on the right to control different layout customizations to the ItemsView below.
          </p>
          <div
            class="items-view-container swappable-view"
            :class="layoutType">
            <div
              v-for="item in layoutItems"
              :key="item.id"
              class="item-card layout-item"
              :class="layoutType"
              tabindex="0">
              <img :src="item.imageSrc" :alt="item.title" class="item-image" />
              <div class="item-overlay">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-likes">{{ item.likes }} Likes</div>
              </div>
            </div>
          </div>
        </div>

        <div style="min-width: 300px;">
          <div style="margin-bottom: 16px;">
            <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">Layout</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input
                  type="radio"
                  value="linedflow"
                  v-model="layoutType"
                  @change="onLayoutChanged"
                  style="margin: 0;" />
                <span style="font-size: 13px;">LinedFlowLayout</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input
                  type="radio"
                  value="uniformgrid"
                  v-model="layoutType"
                  @change="onLayoutChanged"
                  style="margin: 0;" />
                <span style="font-size: 13px;">UniformGridLayout</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input
                  type="radio"
                  value="stack"
                  v-model="layoutType"
                  @change="onLayoutChanged"
                  style="margin: 0;" />
                <span style="font-size: 13px;">StackLayout</span>
              </label>
            </div>
          </div>

          <div v-if="layoutType === 'linedflow'" style="min-height: 300px;">
            <div style="font-weight: 600; margin: 15px 0 10px 0; font-size: 14px;">LinedFlowLayout settings</div>
            <WinNumberBox
              v-model="lineSpacing"
              header="Space between lines"
              :minimum="0"
              :maximum="100"
              :smallChange="1"
              style="margin-bottom: 16px;" />
            <WinNumberBox
              v-model="minItemSpacing"
              header="Minimum space between items on a line"
              :minimum="0"
              :maximum="100"
              :smallChange="1"
              style="margin-bottom: 16px;" />
            <div style="margin-bottom: 8px;">
              <div style="font-size: 13px; margin-bottom: 8px;">Line height</div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input
                    type="radio"
                    value="small"
                    v-model="lineHeight"
                    style="margin: 0;" />
                  <span style="font-size: 13px;">Small</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input
                    type="radio"
                    value="large"
                    v-model="lineHeight"
                    style="margin: 0;" />
                  <span style="font-size: 13px;">Large</span>
                </label>
              </div>
            </div>
          </div>

          <div v-if="layoutType === 'stack'" style="min-height: 300px;">
            <div style="font-weight: 600; margin: 15px 0 10px 0; font-size: 14px;">StackLayout settings</div>
            <WinNumberBox
              v-model="stackSpacing"
              header="Space between rows"
              :minimum="0"
              :maximum="100"
              :smallChange="1"
              style="margin-bottom: 16px;" />
          </div>

          <div v-if="layoutType === 'uniformgrid'" style="min-height: 300px;">
            <div style="font-weight: 600; margin: 15px 0 10px 0; font-size: 14px;">UniformGridLayout settings</div>
            <WinNumberBox
              v-model="minColumnSpacing"
              header="Minimum space between columns"
              :minimum="0"
              :maximum="100"
              :smallChange="1"
              style="margin-bottom: 16px;" />
            <WinNumberBox
              v-model="minRowSpacing"
              header="Minimum space between rows"
              :minimum="0"
              :maximum="100"
              :smallChange="1"
              style="margin-bottom: 16px;" />
            <WinNumberBox
              v-model="maximumRowsOrColumns"
              header="Maximum number of items per row before wrapping"
              :minimum="1"
              :maximum="8"
              :smallChange="1"
              style="margin-bottom: 16px;" />
          </div>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 3: Selection and Invocation -->
    <WinControlExample
      headerText="Item invocation and selection"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div>
          <div style="margin: 0 0 15px 0; font-size: 14px; color: var(--text-secondary); line-height: 1.6;">
            <p style="margin: 0 0 8px 0;">You can enable four different selection modes on the right.</p>
            <p style="margin: 0 0 8px 0;"><strong>None</strong> disables selection all together.</p>
            <p style="margin: 0 0 8px 0;"><strong>Single</strong> allows for only one item to be selected in the collection.</p>
            <p style="margin: 0 0 8px 0;"><strong>Multiple</strong> causes checkboxes to appear within the items, so that multiple items can be chosen from the collection.</p>
            <p style="margin: 0 0 8px 0;"><strong>Extended</strong> allows the user to select multiple items by using Ctrl+Click to select the individual items they want, or Shift+Click to select a range of contiguous items.</p>
          </div>
          <div
            class="items-view-container selection-view"
            :class="{ 'multiple-mode': selectionMode === 'Multiple' }">
            <div
              v-for="(item, index) in selectionItems"
              :key="item.id"
              class="item-card selection-item"
              :class="{
                selected: selectedIndices.includes(index),
                'show-checkbox': selectionMode === 'Multiple'
              }"
              tabindex="0"
              @click="onSelectionItemClick(index, $event)"
              @dblclick="onSelectionItemInvoked(item)"
              @keydown.enter="onSelectionItemInvoked(item)">
              <div v-if="selectionMode === 'Multiple'" class="item-checkbox">
                <WinCheckBox :modelValue="selectedIndices.includes(index)" @click.stop />
              </div>
              <img :src="item.imageSrc" :alt="item.title" class="item-image" />
              <div class="item-overlay">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-likes">{{ item.likes }} Likes</div>
              </div>
            </div>
          </div>
        </div>

        <p class="output-text">{{ invocationOutput }}</p>
        <p class="output-text">{{ selectionOutput }}</p>

        <div style="min-width: 200px; display: flex; flex-direction: column; gap: 16px;">
          <div>
            <div style="font-size: 13px; margin-bottom: 8px;">SelectionMode</div>
            <WinComboBox
              v-model="selectionMode"
              :options="selectionModeOptions"
              style="width: 100%;" />
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 13px; margin-right: 10px;">IsItemInvokedEnabled</span>
            <WinCheckBox
              v-model="isItemInvokedEnabled"
              @checked="onInvokedEnabledChanged"
              @unchecked="onInvokedEnabledChanged" />
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'itemsview');

const { isFavorite: checkFavorite, toggleFavorite: toggleFav } = useFavorites();
const isFavorite = computed(() => checkFavorite(pageKey.value));
const isFavoriteState = ref(isFavorite.value);

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal;
});

const toggleFavorite = () => {
  toggleFav(pageKey.value);
};

const { pageTheme, toggleTheme: doToggleTheme } = usePageTheme('system');
const toggleTheme = () => doToggleTheme();

// Sample data
const generateItems = (count, prefix = 'Item') => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${prefix} ${i + 1}`,
    imageSrc: `https://picsum.photos/seed/${prefix}${i + 1}/300/200`,
    likes: Math.floor(Math.random() * 1000),
    description: `Description for ${prefix} ${i + 1}`
  }));
};

// Example 1: Basic ItemsView
const basicItems = ref(generateItems(8, 'Photo'));
const basicInvokeOutput = ref('');

const onBasicItemInvoked = (item) => {
  basicInvokeOutput.value = `You invoked ${item.title}`;
};

const example1Template = `<div class="items-view-container">
  <div
    v-for="item in items"
    :key="item.id"
    class="item-card"
    @click="onItemInvoked(item)">
    <img :src="item.imageSrc" :alt="item.title" />
  </div>
</div>`;

const example1Vue = `const items = ref(generateItems(8));
const invokeOutput = ref('');

const onItemInvoked = (item) => {
  invokeOutput.value = \`You invoked \${item.title}\`;
};`;

// Example 2: Swappable Layouts
const layoutItems = ref(generateItems(12, 'Image'));
const layoutType = ref('linedflow');
const lineSpacing = ref(5);
const minItemSpacing = ref(5);
const lineHeight = ref('large');
const stackSpacing = ref(5);
const minColumnSpacing = ref(5);
const minRowSpacing = ref(5);
const maximumRowsOrColumns = ref(3);

const onLayoutChanged = () => {
  // Layout change handled by reactive class binding
};

const example2Template = `<div class="items-view-container" :class="layoutType">
  <div
    v-for="item in items"
    :key="item.id"
    class="item-card">
    <img :src="item.imageSrc" :alt="item.title" />
    <div class="item-overlay">
      <div class="item-title">{{ item.title }}</div>
      <div class="item-likes">{{ item.likes }} Likes</div>
    </div>
  </div>
</div>`;

const example2Vue = `const layoutType = ref('linedflow');
const lineSpacing = ref(5);
const minItemSpacing = ref(5);
const lineHeight = ref('large');

// Layout parameters dynamically control CSS grid/flex properties`;

// Example 3: Selection and Invocation
const selectionItems = ref(generateItems(12, 'Photo'));
const selectionMode = ref('Multiple');
const selectionModeOptions = ref(['None', 'Single', 'Multiple', 'Extended']);
const isItemInvokedEnabled = ref(false);
const selectedIndices = ref([]);
const invocationOutput = ref('');
const selectionOutput = ref('');

const onSelectionItemClick = (index, event) => {
  if (selectionMode.value === 'None') return;

  if (selectionMode.value === 'Single') {
    selectedIndices.value = [index];
    updateSelectionOutput();
  } else if (selectionMode.value === 'Multiple') {
    const idx = selectedIndices.value.indexOf(index);
    if (idx > -1) {
      selectedIndices.value.splice(idx, 1);
    } else {
      selectedIndices.value.push(index);
    }
    updateSelectionOutput();
  } else if (selectionMode.value === 'Extended') {
    if (event.ctrlKey) {
      const idx = selectedIndices.value.indexOf(index);
      if (idx > -1) {
        selectedIndices.value.splice(idx, 1);
      } else {
        selectedIndices.value.push(index);
      }
    } else if (event.shiftKey && selectedIndices.value.length > 0) {
      const lastIndex = selectedIndices.value[selectedIndices.value.length - 1];
      const start = Math.min(lastIndex, index);
      const end = Math.max(lastIndex, index);
      selectedIndices.value = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    } else {
      selectedIndices.value = [index];
    }
    updateSelectionOutput();
  }
};

const onSelectionItemInvoked = (item) => {
  if (isItemInvokedEnabled.value) {
    invocationOutput.value = `You invoked ${item.title}`;
  }
};

const onInvokedEnabledChanged = () => {
  // Checkbox state automatically updates isItemInvokedEnabled
};

const updateSelectionOutput = () => {
  if (selectedIndices.value.length === 0) {
    selectionOutput.value = 'No items selected';
  } else if (selectedIndices.value.length === 1) {
    const item = selectionItems.value[selectedIndices.value[0]];
    selectionOutput.value = `Selected: ${item.title}`;
  } else {
    selectionOutput.value = `${selectedIndices.value.length} items selected`;
  }
};

watch(selectionMode, () => {
  selectedIndices.value = [];
  selectionOutput.value = '';
  invocationOutput.value = '';
});

const example3Template = `<div class="items-view-container">
  <div
    v-for="(item, index) in items"
    :key="item.id"
    class="item-card"
    :class="{ selected: selectedIndices.includes(index) }"
    @click="onItemClick(index, $event)">
    <div v-if="selectionMode === 'Multiple'" class="item-checkbox">
      <WinCheckBox :modelValue="selectedIndices.includes(index)" />
    </div>
    <img :src="item.imageSrc" :alt="item.title" />
  </div>
</div>`;

const example3Vue = `const selectionMode = ref('Multiple');
const isItemInvokedEnabled = ref(false);
const selectedIndices = ref([]);

const onItemClick = (index, event) => {
  if (selectionMode.value === 'Single') {
    selectedIndices.value = [index];
  } else if (selectionMode.value === 'Multiple') {
    const idx = selectedIndices.value.indexOf(index);
    if (idx > -1) {
      selectedIndices.value.splice(idx, 1);
    } else {
      selectedIndices.value.push(index);
    }
  } else if (selectionMode.value === 'Extended') {
    if (event.ctrlKey) {
      // Toggle selection
    } else if (event.shiftKey) {
      // Range selection
    } else {
      selectedIndices.value = [index];
    }
  }
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
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.items-view-container {
  width: 500px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--control-border);
  border-radius: 4px;
  padding: 8px;
  background: var(--control-fill-secondary);
}

.items-view-container.basic-view {
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.items-view-container.swappable-view {
  display: grid;
  gap: 5px;
}

.items-view-container.swappable-view.linedflow {
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  grid-auto-rows: 160px;
}

.items-view-container.swappable-view.uniformgrid {
  grid-template-columns: repeat(v-bind(maximumRowsOrColumns), 1fr);
  column-gap: v-bind(minColumnSpacing + 'px');
  row-gap: v-bind(minRowSpacing + 'px');
}

.items-view-container.swappable-view.stack {
  display: flex;
  flex-direction: column;
  gap: v-bind(stackSpacing + 'px');
}

.items-view-container.selection-view {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

.item-card {
  position: relative;
  background: var(--control-fill-default);
  border: 1px solid var(--control-border);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s ease;
}

.item-card:hover {
  background: var(--control-fill-secondary);
  border-color: var(--control-stroke-default);
  transform: translateY(-1px);
}

.item-card:focus {
  outline: 2px solid var(--accent-default);
  outline-offset: 2px;
}

.item-card.basic-item {
  width: 200px;
  height: 140px;
}

.item-card.layout-item {
  position: relative;
}

.item-card.layout-item.stack {
  width: 480px;
  min-height: 80px;
  max-height: 100px;
  display: flex;
  align-items: center;
  padding: 8px;
}

.item-card.layout-item.stack .item-image {
  width: 24px;
  height: 16px;
  flex-shrink: 0;
  margin-right: 8px;
}

.item-card.layout-item.stack .item-overlay {
  position: static;
  background: transparent;
  opacity: 1;
  padding: 0;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.item-card.layout-item.stack .item-title {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.item-card.layout-item.stack .item-likes {
  font-size: 12px;
  color: var(--text-secondary);
}

.item-card.selection-item {
  aspect-ratio: 3/2;
}

.item-card.selected {
  border-color: var(--accent-default);
  box-shadow: 0 0 0 1px var(--accent-default);
}

.item-checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 4px;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-title {
  font-size: 13px;
  color: #ffffff;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-likes {
  font-size: 11px;
  color: #e0e0e0;
  margin-top: 2px;
}
</style>
