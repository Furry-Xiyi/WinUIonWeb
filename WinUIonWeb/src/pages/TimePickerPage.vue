<template>
  <div class="control-page">
    <h1 class="page-header">TimePicker</h1>
    <p class="page-description">
      Use a TimePicker to let users set a time in your app, for example to set a reminder. The TimePicker displays three controls for hour, minute, and AM/PM. These controls are easy to use with touch or mouse, and they can be styled and configured in several different ways.
    </p>

    <!-- Example 1: Simple TimePicker -->
    <WinSettingsCard
      header="A simple TimePicker."
      description="Use a TimePicker to let a user enter a single time value.">
      <template #default>
        <WinTimePicker v-model="selectedTime1" />
      </template>
    </WinSettingsCard>

    <!-- Example 2: TimePicker with header and minute increments -->
    <WinSettingsCard
      header="A TimePicker with a header and minute increments specified."
      description="Set the MinuteIncrement property to specify the time increments shown in the minute picker.">
      <template #default>
        <WinTimePicker
          v-model="selectedTime2"
          header="Arrival time"
          :minuteIncrement="15" />
      </template>
    </WinSettingsCard>

    <!-- Example 3: 24-hour clock TimePicker -->
    <WinSettingsCard
      header="A TimePicker using a 24-hour clock."
      description="Set ClockIdentifier to 24HourClock to show a 24-hour clock.">
      <template #default>
        <WinTimePicker
          v-model="selectedTime3"
          header="24 hour clock"
          clockIdentifier="24HourClock" />
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinTimePicker from '../components/WinTimePicker.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const selectedTime1 = ref(null);
const selectedTime2 = ref(null);

// Set default time to current time for 24-hour clock example
const now = new Date();
const selectedTime3 = ref({
  hour: now.getHours(),
  minute: now.getMinutes()
});
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
