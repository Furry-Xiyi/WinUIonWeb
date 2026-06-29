<template>
  <div>
    <h1 class="page-header">DatePicker</h1>
    <p class="page-description">
      Use a DatePicker to let users set a date in your app, for example to schedule an appointment. The DatePicker displays three controls for month, date, and year. These controls are easy to use with touch or mouse, and they can be styled and configured in several different ways.
    </p>

    <!-- Example 1: A simple DatePicker with a header -->
    <WinControlExample headerText="A simple DatePicker with a header">
      <template #example>
        <WinDatePicker
          v-model="selectedDate1"
          header="Pick a date" />
      </template>
    </WinControlExample>

    <!-- Example 2: A DatePicker with day formatted and year hidden -->
    <WinControlExample headerText="A DatePicker with day formatted and year hidden">
      <template #example>
        <WinDatePicker
          v-model="selectedDate2"
          :yearVisible="false"
          :dayFormatted="true" />
      </template>
      <template #output>
        <p class="output-text" v-if="selectedDate2">
          Selected: {{ formatDate(selectedDate2) }}
        </p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinDatePicker from '../components/WinDatePicker.vue';
import WinControlExample from '../components/WinControlExample.vue';

const selectedDate1 = ref(null);
const selectedDate2 = ref(null);

const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
