<template>
  <div class="control-page">
    <h1 class="page-header">CalendarDatePicker</h1>
    <p class="page-description">
      The CalendarDatePicker is a drop down control that's optimized for picking a single date from a calendar view where contextual information like the day of the week or fullness of the calendar is important. You can modify the calendar to provide additional context or to limit available dates.
    </p>

    <WinSettingsCard
      header="A simple CalendarDatePicker with a header and placeholder text."
      description="The CalendarDatePicker opens a calendar flyout for date selection.">
      <template #default>
        <WinCalendarDatePicker
          v-model="selectedDate"
          header="Calendar"
          placeholder="Pick a date" />
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinCalendarDatePicker from '../components/WinCalendarDatePicker.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const selectedDate = ref(null);
</script>

<style scoped>
.control-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
}
</style>
