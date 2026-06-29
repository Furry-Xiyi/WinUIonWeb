<template>
  <div>
    <h1 class="page-header">RatingControl</h1>
    <p class="page-description">
      The RatingControl allows users to view and set ratings that reflect degrees of satisfaction with content and services.
    </p>

    <!-- Example 1: A simple RatingControl -->
    <WinControlExample headerText="A simple RatingControl">
      <template #example>
        <WinRating v-model="rating1" />
      </template>
      <template #output>
        <p class="output-text">Rating: {{ rating1 }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: A RatingControl with custom max value -->
    <WinControlExample headerText="A RatingControl with custom maximum">
      <template #example>
        <WinRating v-model="rating2" :max="10" />
      </template>
      <template #output>
        <p class="output-text">Rating: {{ rating2 }} / 10</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinRating from '../components/WinRating.vue';
import WinControlExample from '../components/WinControlExample.vue';

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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
