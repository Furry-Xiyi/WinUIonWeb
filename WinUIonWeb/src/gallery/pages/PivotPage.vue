<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
          <h1 class="page-header">Pivot</h1>
          <p class="page-description">
            The Pivot control and related tabs pattern are used for navigating frequently accessed, distinct content categories. Pivots allow for navigation between two or more content panes and relies on text headers to articulate the different sections of content.
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
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Example 1: A basic Pivot -->
            <WinControlExample
              headerText="A basic pivot."
              :theme="pageTheme"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <WinPivot title="EMAIL" :minHeight="400">
                  <WinPivotItem header="All">
                    <p style="margin: 0; color: var(--text-primary);">all emails go here.</p>
                  </WinPivotItem>
                  <WinPivotItem header="Unread">
                    <p style="margin: 0; color: var(--text-primary);">unread emails go here.</p>
                  </WinPivotItem>
                  <WinPivotItem header="Flagged">
                    <p style="margin: 0; color: var(--text-primary);">flagged emails go here.</p>
                  </WinPivotItem>
                  <WinPivotItem header="Urgent">
                    <p style="margin: 0; color: var(--text-primary);">urgent emails go here.</p>
                  </WinPivotItem>
                </WinPivot>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinPivot from '../../components/WinPivot.vue';
import WinPivotItem from '../../components/WinPivotItem.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'pivot');

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

// Example 1: Basic Pivot
const example1Template = `<WinPivot title="EMAIL" :minHeight="400">
  <WinPivotItem header="All">
    <p>all emails go here.</p>
  </WinPivotItem>
  <WinPivotItem header="Unread">
    <p>unread emails go here.</p>
  </WinPivotItem>
  <WinPivotItem header="Flagged">
    <p>flagged emails go here.</p>
  </WinPivotItem>
  <WinPivotItem header="Urgent">
    <p>urgent emails go here.</p>
  </WinPivotItem>
</WinPivot>`;

const example1Vue = `import { ref } from 'vue';

// Pivot automatically manages tab selection
// Use v-model:selectedIndex to control programmatically
const selectedIndex = ref(0);`;
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
</style>
