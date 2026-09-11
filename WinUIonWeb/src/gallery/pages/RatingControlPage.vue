<template>
  <div class="gallery-item-page">
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <h1 class="page-header">RatingControl</h1>
            <p class="page-description">
              Rate something 1 to 5 stars.
            </p>

            <!-- Example 1: A simple RatingControl -->
            <ControlExample :theme="pageTheme" headerText="A simple RatingControl.">
              <template #example>
                <Rating v-model="rating1" />
              </template>
              <template #options>
                <p class="output-text">{{ rating1 ? `You rated ${rating1} star${rating1 !== 1 ? 's' : ''}` : 'Rate something' }}</p>
              </template>
            </ControlExample>

            <!-- Example 2: RatingControl with custom max value -->
            <ControlExample :theme="pageTheme" headerText="A RatingControl with custom maximum rating.">
              <template #example>
                <Rating v-model="rating2" :max="10" />

                <p class="output-text">{{ rating2 ? `Rating: ${rating2}/10` : 'Rate from 1 to 10' }}</p>
              </template>
            </ControlExample>

            <!-- Example 3: Read-only RatingControl -->
            <ControlExample :theme="pageTheme" headerText="A RatingControl with read-only option.">
              <template #example>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <Rating v-model="rating3" :disabled="isReadOnly" />
                </div>

                <p class="output-text">{{ rating3 ? `Current rating: ${rating3} star${rating3 !== 1 ? 's' : ''}` : 'No rating set' }}</p>

                <CheckBox v-model="isReadOnly">
                  Read-only
                </CheckBox>
              </template>
            </ControlExample>

            <!-- Example 4: Multiple RatingControls -->
            <ControlExample :theme="pageTheme" headerText="Multiple RatingControls with different initial values.">
              <template #example>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="min-width: 80px; font-size: 14px; color: var(--text-secondary);">Quality:</span>
                    <Rating v-model="qualityRating" />
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="min-width: 80px; font-size: 14px; color: var(--text-secondary);">Value:</span>
                    <Rating v-model="valueRating" />
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="min-width: 80px; font-size: 14px; color: var(--text-secondary);">Service:</span>
                    <Rating v-model="serviceRating" />
                  </div>
                </div>

                <p class="output-text">
                  Average: {{ averageRating ? averageRating.toFixed(1) : 'N/A' }} stars
                </p>
              </template>
            </ControlExample>
      </div>
    </ScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import Rating from '../../components/Rating.vue';
import ControlExample from '../../components/ControlExample.vue';
import CheckBox from '../../components/CheckBox.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'ratingcontrol');
const { pageTheme, isFavoriteState, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const rating1 = ref(0);
const rating2 = ref(0);
const rating3 = ref(3);
const isReadOnly = ref(false);

const qualityRating = ref(4);
const valueRating = ref(3);
const serviceRating = ref(5);

const averageRating = computed(() => {
  const ratings = [qualityRating.value, valueRating.value, serviceRating.value].filter(r => r > 0);
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
});
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
