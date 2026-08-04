<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <h1 class="page-header">SemanticZoom</h1>
          <p class="page-description">
            The SemanticZoom control lets the user zoom between two different semantic views of the same content. One view is the main view of the content. The second view is a way to quickly navigate that content. For example, when viewing an address book, the user could zoom out to quickly jump to a letter, and zoom in to see the names associated with that letter.
          </p>
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"
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
      <div class="gallery-page-content">
        <!-- Example 1: A simple SemanticZoom -->
            <WinControlExample
              headerText="A simple SemanticZoom"
              :theme="pageTheme"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <WinSemanticZoom
                  v-model:isZoomedInViewActive="isZoomedIn"
                  :canChangeViews="canChangeViews"
                  :isZoomOutButtonEnabled="true"
                  @viewChangeStarted="onViewChangeStarted"
                  @viewChangeCompleted="onViewChangeCompleted"
                  style="height: 500px; border: 1px solid var(--stroke-divider); border-radius: 8px;">

                  <!-- Zoomed In View - GridView with grouped items -->
                  <template #zoomedInView>
                    <div style="padding: 16px; height: 100%;">
                      <div v-for="(group, gIdx) in groupedData" :key="gIdx" style="margin-bottom: 24px;">
                        <h3 class="group-header">{{ group.title }}</h3>
                        <WinGridView
                          :items="group.items"
                          :selectionMode="'None'"
                          :isItemClickEnabled="true"
                          @itemClick="onItemClick">
                          <template #item="{ item }">
                            <div class="grid-item-card">
                              <div class="item-title">{{ item.title }}</div>
                              <div class="item-subtitle">{{ item.subtitle }}</div>
                            </div>
                          </template>
                        </WinGridView>
                      </div>
                    </div>
                  </template>

                  <!-- Zoomed Out View - ListView with group headers -->
                  <template #zoomedOutView>
                    <div style="padding: 24px; height: 100%;">
                      <WinListView
                        :items="groupHeaders"
                        :selectionMode="'None'"
                        :isItemClickEnabled="true"
                        @itemClick="onGroupClick">
                        <template #item="{ item }">
                          <div class="group-item">
                            <span class="group-icon">&#xE71D;</span>
                            <span class="group-title">{{ item.title }}</span>
                            <span class="group-count">{{ item.count }} items</span>
                          </div>
                        </template>
                      </WinListView>
                    </div>
                  </template>
                </WinSemanticZoom>
              </template>
              <template #options>
                <p class="output-text">{{ outputText }}</p>

                <div class="options-container">
                  <WinCheckBox v-model="canChangeViews">
                    Can change views
                  </WinCheckBox>
                </div>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import WinSemanticZoom from '../../components/WinSemanticZoom.vue';
import WinGridView from '../../components/WinGridView.vue';
import WinListView from '../../components/WinListView.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'semanticzoom');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example 1: Simple SemanticZoom
const isZoomedIn = ref(true);
const canChangeViews = ref(true);
const outputText = ref('SemanticZoom is in zoomed-in view');

// Sample data - grouped control information
const groupedData = ref([
  {
    title: 'Basic Input',
    items: [
      { id: 1, title: 'Button', subtitle: 'A control that responds to user input' },
      { id: 2, title: 'CheckBox', subtitle: 'A control for selecting options' },
      { id: 3, title: 'RadioButton', subtitle: 'A control for exclusive selection' },
      { id: 4, title: 'Slider', subtitle: 'A control for selecting a value from a range' }
    ]
  },
  {
    title: 'Collections',
    items: [
      { id: 5, title: 'ListView', subtitle: 'A control for displaying a collection' },
      { id: 6, title: 'GridView', subtitle: 'A control for displaying items in a grid' },
      { id: 7, title: 'TreeView', subtitle: 'A control for displaying hierarchical data' },
      { id: 8, title: 'FlipView', subtitle: 'A control for flipping through items' }
    ]
  },
  {
    title: 'Text',
    items: [
      { id: 9, title: 'TextBlock', subtitle: 'A lightweight control for displaying text' },
      { id: 10, title: 'TextBox', subtitle: 'A control for entering text' },
      { id: 11, title: 'RichEditBox', subtitle: 'A control for rich text editing' },
      { id: 12, title: 'PasswordBox', subtitle: 'A control for password entry' }
    ]
  },
  {
    title: 'Navigation',
    items: [
      { id: 13, title: 'NavigationView', subtitle: 'A control for app navigation' },
      { id: 14, title: 'Pivot', subtitle: 'A control for quick navigation' },
      { id: 15, title: 'TabView', subtitle: 'A control for tabbed content' },
      { id: 16, title: 'BreadcrumbBar', subtitle: 'A control for hierarchical navigation' }
    ]
  },
  {
    title: 'Media',
    items: [
      { id: 17, title: 'Image', subtitle: 'A control for displaying images' },
      { id: 18, title: 'MediaPlayerElement', subtitle: 'A control for playing media' },
      { id: 19, title: 'WebView', subtitle: 'A control for displaying web content' },
      { id: 20, title: 'MapControl', subtitle: 'A control for displaying maps' }
    ]
  }
]);

const groupHeaders = computed(() => {
  return groupedData.value.map(group => ({
    title: group.title,
    count: group.items.length
  }));
});

const onViewChangeStarted = (event) => {
  outputText.value = event.targetIsZoomedInView
    ? 'Zooming in...'
    : 'Zooming out...';
};

const onViewChangeCompleted = (event) => {
  outputText.value = event.targetIsZoomedInView
    ? 'SemanticZoom is in zoomed-in view'
    : 'SemanticZoom is in zoomed-out view';
};

const onItemClick = (item) => {
  outputText.value = `Clicked: ${item.title}`;
};

const onGroupClick = (group) => {
  isZoomedIn.value = true;
  outputText.value = `Navigating to ${group.title} section`;
};

// Example 1 code
const example1Template = `<WinSemanticZoom
  v-model:isZoomedInViewActive="isZoomedIn"
  :canChangeViews="canChangeViews"
  :isZoomOutButtonEnabled="true"
  @viewChangeStarted="onViewChangeStarted"
  @viewChangeCompleted="onViewChangeCompleted"
  style="height: 500px;">

  <template #zoomedInView>
    <div v-for="group in groupedData" :key="group.title">
      <h3>{{ group.title }}</h3>
      <WinGridView
        :items="group.items"
        :selectionMode="'None'"
        :isItemClickEnabled="true">
        <template #item="{ item }">
          <div>{{ item.title }}</div>
        </template>
      </WinGridView>
    </div>
  </template>

  <template #zoomedOutView>
    <WinListView
      :items="groupHeaders"
      :selectionMode="'None'"
      :isItemClickEnabled="true">
      <template #item="{ item }">
        <div>{{ item.title }}</div>
      </template>
    </WinListView>
  </template>
</WinSemanticZoom>`;

const example1Vue = `const isZoomedIn = ref(true);
const canChangeViews = ref(true);

const groupedData = ref([
  {
    title: 'Basic Input',
    items: [
      { id: 1, title: 'Button', subtitle: 'A control that responds' },
      { id: 2, title: 'CheckBox', subtitle: 'A control for selecting' }
    ]
  },
  {
    title: 'Collections',
    items: [
      { id: 3, title: 'ListView', subtitle: 'A control for displaying' },
      { id: 4, title: 'GridView', subtitle: 'A control for items' }
    ]
  }
]);

const groupHeaders = computed(() => {
  return groupedData.value.map(group => ({
    title: group.title,
    count: group.items.length
  }));
});

const onViewChangeStarted = (event) => {
  console.log(event.targetIsZoomedInView ? 'Zooming in...' : 'Zooming out...');
};

const onViewChangeCompleted = (event) => {
  console.log(event.targetIsZoomedInView ? 'Zoomed in' : 'Zoomed out');
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Group header in zoomed-in view */
.group-header {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

/* Grid item card styling */
.grid-item-card {
  width: 200px;
  min-height: 80px;
  padding: 16px;
  background: var(--layer-fill-default);
  border: 1px solid var(--stroke-divider);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.15s ease;
}

.grid-item-card:hover {
  background: var(--subtle-secondary);
  border-color: var(--accent-base);
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.item-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Group item in zoomed-out view */
.group-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 0;
}

.group-icon {
  font-size: 32px;
  color: var(--accent-base);
  flex-shrink: 0;
}

.group-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  flex-grow: 1;
}

.group-count {
  font-size: 14px;
  color: var(--text-secondary);
  flex-shrink: 0;
}
</style>
