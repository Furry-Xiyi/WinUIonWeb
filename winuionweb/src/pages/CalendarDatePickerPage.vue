<!-- CalendarDatePickerPage.vue -->
<template>
  <div class="page-container page-transition-fade">
    <h1 class="page-header">CalendarDatePicker</h1>
    <WinSettingsCard>
      <template #header>
        CalendarDatePicker
      </template>
      <template #description>
        A control that lets users pick a date from a calendar flyout.
      </template>
      <WinCalendarDatePicker v-model="selectedDate" />
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinCalendarDatePicker from '../components/WinCalendarDatePicker.vue';

const selectedDate = ref(null);
</script>

<style scoped>
  .page-container {
    padding: 24px;
    height: 100%;
    overflow-y: auto;
  }

  .page-header {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 24px;
  }
</style>
