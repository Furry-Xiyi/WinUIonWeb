<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">ToggleSwitch</h1>
      <p class="page-description">
        Use ToggleSwitch controls to present users with exactly two mutually exclusive options (like on/off), where choosing an option results in an immediate commit. A toggle switch should have a single label.
      </p>
      <div class="page-header-actions">
        <WinButton
          subtle
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

    <!-- Example 1: Simple ToggleSwitch -->
    <WinControlExample headerText="A simple ToggleSwitch." :theme="pageTheme">
      <template #example>
        <WinToggleSwitch v-model="simpleToggle" />
      </template>
    </WinControlExample>

    <!-- Example 2: ToggleSwitch with Custom Content -->
    <WinControlExample headerText="A ToggleSwitch with custom labels." :theme="pageTheme">
      <template #example>
        <div style="display: flex; align-items: center; gap: 16px;">
          <WinToggleSwitch
            v-model="workToggle"
            header="Toggle work"
            onContent="Working"
            offContent="Do work" />
          <WinProgressRing
            v-if="workToggle"
            style="width: 32px; height: 32px; color: var(--accent-default);" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinProgressRing from '../components/WinProgressRing.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'toggleswitch');

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

// Example 1: Simple ToggleSwitch
const simpleToggle = ref(false);

// Example 2: ToggleSwitch with custom content
const workToggle = ref(true);
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
