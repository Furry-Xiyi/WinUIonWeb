<template>
  <div class="control-page">
    <h1 class="page-header">DatePicker</h1>
    <p class="page-description">
      Use a DatePicker to let users set a date in your app, for example to schedule an appointment. The DatePicker displays three controls for month, date, and year. These controls are easy to use with touch or mouse, and they can be styled and configured in several different ways.
    </p>

    <!-- Example 1: Simple DatePicker -->
    <WinSettingsCard
      header="A simple DatePicker with a header."
      description="The DatePicker is used to pick a known date, such as a date of birth.">
      <template #default>
        <WinDatePicker
          v-model="selectedDate1"
          header="Pick a date" />
      </template>
    </WinSettingsCard>

    <!-- Example 2: DatePicker with custom format -->
    <WinSettingsCard
      header="A DatePicker with day formatted and year hidden."
      description="Customize the DatePicker's display format.">
      <template #default>
        <div style="display: flex; align-items: center; gap: 16px;">
          <WinDatePicker
            v-model="selectedDate2"
            :yearVisible="false"
            :dayFormatted="true" />
          <div v-if="selectedDate2" class="output-text">
            Selected: {{ formatDate(selectedDate2) }}
          </div>
        </div>
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinDatePicker from '../components/WinDatePicker.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

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

.output-text {
  padding: 8px 12px;
  background: var(--card-background-secondary);
  border-radius: 4px;
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 13px;
}
</style>
