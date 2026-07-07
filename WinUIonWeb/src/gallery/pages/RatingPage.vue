<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">{{ $t('text.ratingcontrol') }}</h1>
      <p class="page-description">
        {{ $t('text.the-ratingcontrol-allows-users-to-view-and-set-r') }}
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon"></span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: A simple RatingControl -->
    <p class="control-example-description">{{ $t('text.a-simple-ratingcontrol') }}</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
      <template #example>
        <WinRating v-model="rating1" />
      </template>
      <template #options>
        <p class="output-text">Rating: {{ rating1 }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: A RatingControl with custom max value -->
    <p class="control-example-description">A RatingControl with custom maximum</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
      <template #example>
        <WinRating v-model="rating2" :max="10" />
      </template>
      <template #options>
        <p class="output-text">Rating: {{ rating2 }} / 10</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinRating from '../../components/WinRating.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'rating');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const rating1 = ref(3);
const rating2 = ref(5);
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
</style>



