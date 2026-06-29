<template>
  <div>
    <h1 class="page-header">CalendarDatePicker</h1>
    <p class="page-description">
      The CalendarDatePicker is a drop down control that's optimized for picking a single date from a calendar view where contextual information like the day of the week or fullness of the calendar is important. You can modify the calendar to provide additional context or to limit available dates.
    </p>

    <WinControlExample
      headerText="A simple CalendarDatePicker with a header and placeholder text.">
      <template #example>
        <WinCalendarDatePicker
          v-model="selectedDate"
          header="Calendar"
          placeholder="Pick a date" />
      </template>
      <template #output>
        <div v-if="selectedDate" class="output-text">Selected: {{ selectedDate }}</div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinCalendarDatePicker from '../components/WinCalendarDatePicker.vue';
import WinControlExample from '../components/WinControlExample.vue';

const selectedDate = ref(null);
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
