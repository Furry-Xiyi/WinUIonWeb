<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">ToolTip</h1>
      <p class="page-description">
        A ToolTip shows more information about a UI element. You might show information about what the element does, or what the user should do. The ToolTip is shown when a user hovers over or presses and holds the UI element.
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

    <!-- Example 1: A button with a simple ToolTip -->
    <WinControlExample
      headerText="A button with a simple ToolTip."
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <WinButton
          tooltip="Simple ToolTip">
          Button with a simple ToolTip.
        </WinButton>
      </template>
    </WinControlExample>

    <!-- Example 2: A TextBlock with an offset ToolTip -->
    <WinControlExample
      headerText="A TextBlock with an offset ToolTip."
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <span
          class="textblock-with-tooltip"
          :title="tooltipText"
          @mouseenter="showOffsetTooltip"
          @mouseleave="hideOffsetTooltip">
          TextBlock with an offset ToolTip.
        </span>
        <div
          v-if="showOffset"
          class="offset-tooltip"
          :style="{ top: offsetTop + 'px' }">
          Offset ToolTip.
        </div>
      </template>
    </WinControlExample>

    <!-- Example 3: An Image with a ToolTip using PlacementRect -->
    <WinControlExample
      headerText="An Image with a ToolTip using PlacementRect."
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div style="position: relative; display: inline-block;">
          <img
            src="/assets/cliff.jpg"
            alt="Cliff landscape"
            style="width: 400px; height: 266px; display: block;"
            @mouseenter="showImageTooltip = true"
            @mouseleave="showImageTooltip = false">
          <div
            v-if="showImageTooltip"
            class="placement-tooltip">
            Non-occluding ToolTip.
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'tooltip');

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

// Example 1: Simple ToolTip
const example1Template = `<WinButton tooltip="Simple ToolTip">
  Button with a simple ToolTip.
</WinButton>`;

const example1Vue = `// ToolTip is set via the tooltip prop
// The button automatically shows the tooltip on hover`;

// Example 2: Offset ToolTip
const tooltipText = ref('Offset ToolTip.');
const showOffset = ref(false);
const offsetTop = ref(-80);

const showOffsetTooltip = () => {
  showOffset.value = true;
};

const hideOffsetTooltip = () => {
  showOffset.value = false;
};

const example2Template = `<span
  class="textblock-with-tooltip"
  @mouseenter="showOffsetTooltip"
  @mouseleave="hideOffsetTooltip">
  TextBlock with an offset ToolTip.
</span>
<div
  v-if="showOffset"
  class="offset-tooltip"
  :style="{ top: offsetTop + 'px' }">
  Offset ToolTip.
</div>`;

const example2Vue = `const showOffset = ref(false);
const offsetTop = ref(-80);

const showOffsetTooltip = () => {
  showOffset.value = true;
};

const hideOffsetTooltip = () => {
  showOffset.value = false;
};`;

// Example 3: PlacementRect ToolTip
const showImageTooltip = ref(false);

const example3Template = `<div style="position: relative; display: inline-block;">
  <img
    src="/assets/cliff.jpg"
    alt="Cliff landscape"
    style="width: 400px; height: 266px;"
    @mouseenter="showImageTooltip = true"
    @mouseleave="showImageTooltip = false">
  <div
    v-if="showImageTooltip"
    class="placement-tooltip">
    Non-occluding ToolTip.
  </div>
</div>`;

const example3Vue = `const showImageTooltip = ref(false);

// The tooltip is positioned to the right of the image
// using absolute positioning within a relative container`;
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

.textblock-with-tooltip {
  cursor: default;
  color: var(--text-primary);
  font-size: 14px;
}

.offset-tooltip {
  position: absolute;
  background: var(--flyout-background);
  border: 1px solid var(--control-stroke-default);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-primary);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
}

.placement-tooltip {
  position: absolute;
  top: 0;
  left: 100%;
  margin-left: 8px;
  background: var(--flyout-background);
  border: 1px solid var(--control-stroke-default);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-primary);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
}
</style>
