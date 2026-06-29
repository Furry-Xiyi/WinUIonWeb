<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">RepeatButton</h1>
      <p class="page-description">
        A button that raises its Click event repeatedly from the time it's pressed until it's released.
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

    <WinControlExample headerText="A simple RepeatButton" :theme="pageTheme">
      <template #example>
        <WinRepeatButton :disabled="!isEnabled" @click="onRepeatClick">
          Click and hold
        </WinRepeatButton>
      </template>
      <template #output>
        <p class="output-text">Click count: {{ clickCount }}</p>
      </template>
      <template #options>
        <WinCheckBox v-model="isEnabled">
          Enable button
        </WinCheckBox>
      </template>
    </WinControlExample>

    <WinControlExample headerText="RepeatButton with custom delay and interval" :theme="pageTheme">
      <template #example>
        <div style="display: flex; gap: 16px; align-items: center;">
          <WinRepeatButton
            :delay="500"
            :interval="100"
            @click="decrementValue">
            <span class="icon">&#xE74B;</span>
          </WinRepeatButton>
          <span style="font-size: 24px; font-weight: 600; min-width: 60px; text-align: center;">
            {{ value }}
          </span>
          <WinRepeatButton
            :delay="500"
            :interval="100"
            @click="incrementValue">
            <span class="icon">&#xE74A;</span>
          </WinRepeatButton>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import WinRepeatButton from '../components/WinRepeatButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'repeatbutton');

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

const isEnabled = ref(true);
const clickCount = ref(0);
const value = ref(0);

const onRepeatClick = () => {
  clickCount.value++;
};

const incrementValue = () => {
  value.value++;
};

const decrementValue = () => {
  value.value--;
};
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}

.icon {
  font-size: 16px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}
</style>
