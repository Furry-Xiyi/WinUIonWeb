<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">PipsPager</h1>
      <p class="page-description">
        The PipsPager provides a simple and visual way to navigate sequential content, such as a collection of images or slides. Each pip represents a single page, and the selected pip indicates the current page.
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

    <!-- Example 1: PipsPager integrated with a FlipView -->
    <WinControlExample
      headerText="PipsPager integrated with a FlipView"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <!-- FlipView simulation -->
          <div class="flipview-container">
            <button
              class="flipview-nav-button prev"
              :disabled="currentImageIndex === 0"
              @click="previousImage"
              aria-label="Previous image">
              <span class="icon">&#xE76B;</span>
            </button>
            <div class="flipview-content">
              <img
                :src="pictures[currentImageIndex]"
                alt="Gallery image"
                class="flipview-image" />
            </div>
            <button
              class="flipview-nav-button next"
              :disabled="currentImageIndex === pictures.length - 1"
              @click="nextImage"
              aria-label="Next image">
              <span class="icon">&#xE76C;</span>
            </button>
          </div>
          <!-- PipsPager -->
          <WinPipsPager
            :numberOfPages="pictures.length"
            :selectedPageIndex="currentImageIndex"
            @update:selectedPageIndex="currentImageIndex = $event" />
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: PipsPager with options to change its orientation and button visibility -->
    <WinControlExample
      headerText="PipsPager with options to change its orientation and button visibility"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <WinPipsPager
          :numberOfPages="10"
          :selectedPageIndex="selectedPageIndex"
          @update:selectedPageIndex="selectedPageIndex = $event"
          @selectedIndexChanged="onSelectedIndexChanged"
          :orientation="orientation"
          :previousButtonVisibility="previousButtonVisibility"
          :nextButtonVisibility="nextButtonVisibility" />
      </template>
      <template #options>
        <p class="output-text">{{ outputText }}</p>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label class="option-label">Orientation</label>
            <WinComboBox
              v-model="orientationIndex"
              :options="orientationOptions" />
          </div>
          <div>
            <label class="option-label">Previous Button Visibility</label>
            <WinComboBox
              v-model="prevButtonIndex"
              :options="buttonVisibilityOptions" />
          </div>
          <div>
            <label class="option-label">Next Button Visibility</label>
            <WinComboBox
              v-model="nextButtonIndex"
              :options="buttonVisibilityOptions" />
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinPipsPager from '../../components/WinPipsPager.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'pipspager');

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

// Example 1: PipsPager integrated with FlipView
const pictures = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop'
];

const currentImageIndex = ref(0);

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const nextImage = () => {
  if (currentImageIndex.value < pictures.length - 1) {
    currentImageIndex.value++;
  }
};

const example1Template = `<div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
  <!-- FlipView with images -->
  <div class="flipview-container">
    <img :src="pictures[currentImageIndex]" alt="Gallery image" />
  </div>
  <!-- PipsPager -->
  <WinPipsPager
    :numberOfPages="pictures.length"
    :selectedPageIndex="currentImageIndex"
    @update:selectedPageIndex="currentImageIndex = $event" />
</div>`;

const example1Vue = `const pictures = [
  'image1.jpg',
  'image2.jpg',
  'image3.jpg',
  'image4.jpg',
  'image5.jpg',
  'image6.jpg',
  'image7.jpg',
  'image8.jpg'
];

const currentImageIndex = ref(0);`;

// Example 2: PipsPager with options
const selectedPageIndex = ref(0);
const outputText = ref('Page 1 of 10 selected');

const orientationOptions = [
  { label: 'Horizontal' },
  { label: 'Vertical' }
];
const orientationIndex = ref(0);
const orientation = computed(() => orientationOptions[orientationIndex.value].label);

const buttonVisibilityOptions = [
  { label: 'Visible' },
  { label: 'VisibleOnPointerOver' },
  { label: 'Collapsed' }
];
const prevButtonIndex = ref(0);
const nextButtonIndex = ref(0);

const previousButtonVisibility = computed(() => buttonVisibilityOptions[prevButtonIndex.value].label);
const nextButtonVisibility = computed(() => buttonVisibilityOptions[nextButtonIndex.value].label);

const onSelectedIndexChanged = (args) => {
  const pageNumber = args.newIndex + 1;
  const totalPages = 10;
  outputText.value = `Page ${pageNumber} of ${totalPages} selected`;
};

const example2Template = `<WinPipsPager
  :numberOfPages="10"
  :selectedPageIndex="selectedPageIndex"
  @update:selectedPageIndex="selectedPageIndex = $event"
  @selectedIndexChanged="onSelectedIndexChanged"
  :orientation="orientation"
  :previousButtonVisibility="previousButtonVisibility"
  :nextButtonVisibility="nextButtonVisibility" />`;

const example2Vue = `const selectedPageIndex = ref(0);
const orientation = ref('Horizontal');
const previousButtonVisibility = ref('Visible');
const nextButtonVisibility = ref('Visible');

const onSelectedIndexChanged = (args) => {
  const pageNumber = args.newIndex + 1;
  const totalPages = 10;
  console.log(\`Page \${pageNumber} of \${totalPages} selected\`);
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

.option-label {
  display: block;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-weight: 500;
}

/* FlipView styling */
.flipview-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 270px;
  background: var(--ctrl-fill-default);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flipview-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flipview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.flipview-nav-button {
  position: absolute;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  z-index: 1;
}

.flipview-nav-button.prev {
  left: 8px;
}

.flipview-nav-button.next {
  right: 8px;
}

.flipview-nav-button:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.05);
}

.flipview-nav-button:active:not(:disabled) {
  transform: scale(0.95);
}

.flipview-nav-button:disabled {
  background: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
  opacity: 0.5;
}

.flipview-nav-button .icon {
  font-size: 16px;
}
</style>
