<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
          <h1 class="page-header">SwipeControl</h1>
          <p class="page-description">
            The SwipeControl provides a touch-optimized context menu. It wraps around list items or other content, and allows the user to reveal actions by swiping left or right.
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
            <!-- Example 1: Swipe Right to Reveal Actions -->
            <WinControlExample
              headerText="Swipe Right to Reveal Actions"
              :theme="pageTheme"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <div class="swipe-placeholder">
                  <div class="placeholder-content">
                    <p style="margin: 0;">⚠️ WinSwipeControl component needs to be created</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-secondary);">
                      Should support: leftItems (Reveal mode), Accept and Flag actions
                    </p>
                  </div>
                </div>
              </template>
              <template #options>
                <p class="output-text">{{ example1Output }}</p>
              </template>
            </WinControlExample>

            <!-- Example 2: Swipe Left to Execute Action -->
            <WinControlExample
              headerText="Swipe Left to Execute Action"
              :theme="pageTheme"
              :templateCode="example2Template"
              :vueCode="example2Vue">
              <template #example>
                <div class="swipe-placeholder">
                  <div class="placeholder-content">
                    <p style="margin: 0;">⚠️ WinSwipeControl component needs to be created</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-secondary);">
                      Should support: rightItems (Execute mode), Archive action
                    </p>
                  </div>
                </div>

                <p class="output-text">{{ example2Output }}</p>
              </template>
            </WinControlExample>

            <!-- Example 3: Custom Swipe in ListView -->
            <WinControlExample
              headerText="Custom Swipe in ListView"
              :theme="pageTheme"
              :templateCode="example3Template"
              :vueCode="example3Vue">
              <template #example>
                <WinListView
                  :items="listItems"
                  style="width: 800px; max-width: 100%; height: 300px; min-width: 200px;">
                  <template #item="{ item }">
                    <div class="swipe-placeholder" style="height: 68px; width: 100%;">
                      <div class="placeholder-content">
                        <span style="font-size: 24px;">{{ item }}</span>
                        <span style="font-size: 11px; color: var(--text-secondary); margin-left: 8px;">
                          (Swipe actions: Reply All, Open, Delete)
                        </span>
                      </div>
                    </div>
                  </template>
                </WinListView>
              </template>
            </WinControlExample>

            <!-- Example 4: Gradient Background Swipe -->
            <WinControlExample
              headerText="Gradient Background Swipe"
              :theme="pageTheme"
              :templateCode="example4Template"
              :vueCode="example4Vue">
              <template #example>
                <div class="swipe-placeholder">
                  <div class="placeholder-content">
                    <p style="margin: 0;">⚠️ WinSwipeControl component needs to be created</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-secondary);">
                      Should support: rightItems with gradient background (Execute mode), Lock action
                    </p>
                  </div>
                </div>
              </template>
            </WinControlExample>

            <!-- Example 5: Custom Icons -->
            <WinControlExample
              headerText="Custom Icons"
              :theme="pageTheme"
              :templateCode="example5Template"
              :vueCode="example5Vue">
              <template #example>
                <div class="swipe-placeholder">
                  <div class="placeholder-content">
                    <p style="margin: 0;">⚠️ WinSwipeControl component needs to be created</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-secondary);">
                      Should support: leftItems with custom bitmap icons (Coffee icon)
                    </p>
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
import WinListView from '../../components/WinListView.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'swipecontrol');

const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example 1: Swipe Right Reveal
const example1Output = ref('Swipe right to reveal Accept and Flag actions');

const example1Template = `<WinSwipeControl
  :leftItems="leftRevealItems"
  width="500"
  height="68">
  <template #content>
    <div style="text-align: center; padding: 12px;">
      Swipe Right
    </div>
  </template>
</WinSwipeControl>`;

const example1Vue = `const leftRevealItems = ref([
  {
    text: 'Accept',
    icon: '\\uE8FB',
    background: 'var(--button-background)',
    foreground: 'var(--text-primary)',
    onInvoked: () => console.log('Accept invoked')
  },
  {
    text: 'Flag',
    icon: '\\uE7C1',
    background: 'var(--button-background)',
    foreground: 'var(--text-primary)',
    onInvoked: () => console.log('Flag invoked')
  }
]);`;

// Example 2: Swipe Left Execute
const example2Output = ref('Swipe left to execute Archive action');

const example2Template = `<WinSwipeControl
  :rightItems="rightExecuteItems"
  width="500"
  height="68">
  <template #content>
    <div style="text-align: center; padding: 12px;">
      Swipe Left
    </div>
  </template>
</WinSwipeControl>`;

const example2Vue = `const rightExecuteItems = ref([
  {
    text: 'Archive',
    icon: '\\uE7B8',
    mode: 'Execute',
    behaviorOnInvoked: 'Close',
    onInvoked: () => console.log('Archive invoked')
  }
]);`;

// Example 3: ListView with Swipe
const listItems = ref([
  'Adriana Giorgi',
  'Amelia Bruno',
  'Blake McMillan-Katsu',
  'Brandi Porter',
  'Bruce Wayne',
  'Clark Kent'
]);

const example3Template = `<WinListView :items="listItems">
  <template #item="{ item }">
    <WinSwipeControl
      :leftItems="leftRevealItems"
      :rightItems="rightDeleteItems"
      height="68">
      <template #content>
        <div style="padding: 12px; font-size: 24px;">
          {{ item }}
        </div>
      </template>
    </WinSwipeControl>
  </template>
</WinListView>`;

const example3Vue = `const listItems = ref([
  'Adriana Giorgi',
  'Amelia Bruno',
  'Blake McMillan-Katsu'
]);

const leftRevealItems = ref([
  { text: 'Reply All', icon: '\\uE8C2', background: '#3e6fa7', foreground: 'white' },
  { text: 'Open', icon: '\\uE8C3', background: '#ff9501', foreground: 'white' }
]);

const rightDeleteItems = ref([
  {
    text: 'Delete',
    icon: '\\uE74D',
    background: 'red',
    mode: 'Execute',
    onInvoked: (item) => {
      const index = listItems.value.indexOf(item);
      if (index > -1) listItems.value.splice(index, 1);
    }
  }
]);`;

// Example 4: Gradient Background
const example4Template = `<WinSwipeControl
  :rightItems="gradientItems"
  width="500"
  height="68">
  <template #content>
    <div style="text-align: center; padding: 12px;">
      Swipe Left
    </div>
  </template>
</WinSwipeControl>`;

const example4Vue = `const gradientItems = ref([
  {
    text: 'Lock',
    icon: '\\uE72E',
    background: 'linear-gradient(90deg, #ff8990f9 0%, #ff5b66fb 50%, #ff5c1df4 100%)',
    mode: 'Execute',
    behaviorOnInvoked: 'Close'
  }
]);`;

// Example 5: Custom Icons
const example5Template = `<WinSwipeControl
  :leftItems="customIconItems"
  width="500"
  height="68">
  <template #content>
    <div style="text-align: center; padding: 12px;">
      Swipe Right
    </div>
  </template>
</WinSwipeControl>`;

const example5Vue = `const customIconItems = ref([
  {
    text: 'Coffee',
    iconSource: '/assets/CoffeeCup.png', // BitmapIconSource
    background: 'var(--button-background)',
    foreground: 'var(--text-primary)'
  }
]);`;
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

.swipe-placeholder {
  width: 500px;
  max-width: 100%;
  height: 68px;
  margin: 12px 0;
  border: 1px solid var(--control-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-background);
}

.placeholder-content {
  text-align: center;
  padding: 12px;
  font-size: 13px;
  color: var(--text-primary);
}
</style>
