<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">SelectorBar</h1>
      <p class="page-description">
        The SelectorBar control provides a simple way to navigate between items or views in your app. It is often used as a tab bar pattern to navigate between pages or change the active content of a view.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model="isFavoriteState"
          subtle
          @update:modelValue="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: A Basic SelectorBar -->
    <WinControlExample
      headerText="A Basic SelectorBar"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <WinSelectorBar
          :items="example1Items"
          v-model:selectedIndex="selectedIndex1"
          @selectionChanged="onExample1SelectionChanged" />
      </template>
      <template #options>
        <p class="output-text">Selected: {{ example1Items[selectedIndex1]?.text || 'None' }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: SelectorBar with Frame Slide Transitions -->
    <WinControlExample
      headerText="SelectorBar with Frame Slide Transitions"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <WinSelectorBar
            :items="example2Items"
            v-model:selectedIndex="selectedIndex2"
            @selectionChanged="onExample2SelectionChanged" />

          <div class="content-frame" :key="currentPageExample2">
            <div class="page-content" :style="{ animation: slideAnimation }">
              <h3>{{ currentPageExample2 }}</h3>
              <p>This is the content for {{ currentPageExample2 }}</p>
            </div>
          </div>
        </div>

        <p class="output-text">Current page: {{ currentPageExample2 }}</p>
      </template>
    </WinControlExample>

    <!-- Example 3: SelectorBar Displaying Different Collections -->
    <WinControlExample
      headerText="SelectorBar Displaying Different Collections Using ItemsView"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <WinSelectorBar v-model="selectedItem3" @selectionChanged="onExample3SelectionChanged">
            <WinSelectorBarItem text="Pink" :isSelected="true" />
            <WinSelectorBarItem text="Plum" />
            <WinSelectorBarItem text="PowderBlue" />
          </WinSelectorBar>

          <div class="color-grid">
            <div
              v-for="(color, index) in currentColors"
              :key="index"
              class="color-item"
              :style="{ backgroundColor: color }">
            </div>
          </div>
        </div>

        <p class="output-text">Selected collection: {{ selectedItem3?.text || 'None' }}</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinSelectorBar from '../components/WinSelectorBar.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'selectorbar');

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

// Example 1: Basic SelectorBar
const selectedIndex1 = ref(0);
const example1Items = ref([
  { text: 'Recent', icon: 'Clock' },
  { text: 'Shared', icon: 'Share' },
  { text: 'Favorites', icon: 'Favorite' }
]);

const onExample1SelectionChanged = (event) => {
  console.log('Selected:', event);
};

const example1Template = `<WinSelectorBar
  :items="items"
  v-model:selectedIndex="selectedIndex"
  @selectionChanged="onSelectionChanged" />`;

const example1Vue = `const selectedIndex = ref(0);
const items = ref([
  { text: 'Recent', icon: 'Clock' },
  { text: 'Shared', icon: 'Share' },
  { text: 'Favorites', icon: 'Favorite' }
]);

const onSelectionChanged = (event) => {
  console.log('Selected:', event);
};`;

// Example 2: SelectorBar with Frame Slide Transitions
const selectedIndex2 = ref(0);
const example2Items = ref([
  { text: 'Page1' },
  { text: 'Page2' },
  { text: 'Page3' },
  { text: 'Page4' },
  { text: 'Page5' }
]);
const currentPageExample2 = ref('Page1');
const slideAnimation = ref('slideFromRight 0.3s ease-out');
const previousPageIndex = ref(0);

const onExample2SelectionChanged = (event) => {
  const direction = event.selectedIndex > previousPageIndex.value ? 'slideFromRight' : 'slideFromLeft';
  slideAnimation.value = `${direction} 0.3s ease-out`;
  currentPageExample2.value = event.selectedItem.text;
  previousPageIndex.value = event.selectedIndex;
};

const example2Template = `<div style="display: flex; flex-direction: column; gap: 16px;">
  <WinSelectorBar v-model="selectedItem2" @selectionChanged="onSelectionChanged">
    <WinSelectorBarItem text="Page1" :isSelected="true" />
    <WinSelectorBarItem text="Page2" />
    <WinSelectorBarItem text="Page3" />
    <WinSelectorBarItem text="Page4" />
    <WinSelectorBarItem text="Page5" />
  </WinSelectorBar>

  <div class="content-frame">
    <h3>{{ currentPage }}</h3>
    <p>This is the content for {{ currentPage }}</p>
  </div>
</div>`;

const example2Vue = `const selectedItem2 = ref(null);
const currentPage = ref('Page1');
const previousPageIndex = ref(0);

const onSelectionChanged = (item, index) => {
  const direction = index > previousPageIndex.value ? 'right' : 'left';
  // Apply slide animation based on direction
  currentPage.value = item.text;
  previousPageIndex.value = index;
};`;

// Example 3: SelectorBar Displaying Different Collections
const selectedItem3 = ref(null);
const currentColors = ref([
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
  '#FFB3D9', '#FFC9BA', '#FFF5BA', '#C9FFBA', '#BAF3FF'
]);

const pinkColors = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
  '#FFB3D9', '#FFC9BA', '#FFF5BA', '#C9FFBA', '#BAF3FF'
];

const plumColors = [
  '#DDA0DD', '#E6A8D7', '#F0B0D1', '#F5C8E8', '#E0B0FF',
  '#D8BFD8', '#DDA0DD', '#E6A8D7', '#F0B0D1', '#F5C8E8'
];

const powderBlueColors = [
  '#B0E0E6', '#ADD8E6', '#87CEEB', '#87CEFA', '#B0C4DE',
  '#AFEEEE', '#B0E0E6', '#ADD8E6', '#87CEEB', '#87CEFA'
];

const onExample3SelectionChanged = (item) => {
  if (item.text === 'Pink') {
    currentColors.value = pinkColors;
  } else if (item.text === 'Plum') {
    currentColors.value = plumColors;
  } else if (item.text === 'PowderBlue') {
    currentColors.value = powderBlueColors;
  }
};

const example3Template = `<div style="display: flex; flex-direction: column; gap: 16px;">
  <WinSelectorBar v-model="selectedItem3" @selectionChanged="onSelectionChanged">
    <WinSelectorBarItem text="Pink" :isSelected="true" />
    <WinSelectorBarItem text="Plum" />
    <WinSelectorBarItem text="PowderBlue" />
  </WinSelectorBar>

  <div class="color-grid">
    <div
      v-for="(color, index) in currentColors"
      :key="index"
      class="color-item"
      :style="{ backgroundColor: color }">
    </div>
  </div>
</div>`;

const example3Vue = `const selectedItem3 = ref(null);
const currentColors = ref(pinkColors);

const pinkColors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', ...];
const plumColors = ['#DDA0DD', '#E6A8D7', '#F0B0D1', ...];
const powderBlueColors = ['#B0E0E6', '#ADD8E6', '#87CEEB', ...];

const onSelectionChanged = (item) => {
  if (item.text === 'Pink') {
    currentColors.value = pinkColors;
  } else if (item.text === 'Plum') {
    currentColors.value = plumColors;
  } else {
    currentColors.value = powderBlueColors;
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
  margin: 0;
}

.content-frame {
  min-height: 120px;
  padding: 16px;
  background: var(--control-fill-default);
  border-radius: 4px;
  border: 1px solid var(--control-stroke-default);
}

.page-content {
  animation-fill-mode: forwards;
}

.page-content h3 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.page-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

@keyframes slideFromRight {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideFromLeft {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 8px;
  padding: 8px;
}

.color-item {
  width: 112px;
  height: 82px;
  border-radius: 4px;
  border: 1px solid var(--control-stroke-default);
  transition: transform 0.1s ease;
}

.color-item:hover {
  transform: scale(1.05);
}
</style>
