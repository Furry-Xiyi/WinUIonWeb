<template>
  <div>
    <h1 class="page-header">TimePicker</h1>
    <p class="page-description">
      Use a TimePicker to let users set a time in your app, for example to set a reminder. The TimePicker displays three controls for hour, minute, and AM/PM. These controls are easy to use with touch or mouse, and they can be styled and configured in several different ways.
    </p>

    <WinControlExample headerText="A simple TimePicker">
      <template #example>
        <WinTimePicker v-model="selectedTime1" />
      </template>
      <template #output>
        <p class="output-text">Selected time: {{ formatTime(selectedTime1) }}</p>
      </template>
    </WinControlExample>

    <WinControlExample headerText="A TimePicker with a header and minute increments specified">
      <template #example>
        <WinTimePicker
          v-model="selectedTime2"
          header="Arrival time"
          :minuteIncrement="15" />
      </template>
      <template #output>
        <p class="output-text">Selected time: {{ formatTime(selectedTime2) }}</p>
      </template>
    </WinControlExample>

    <WinControlExample headerText="A TimePicker using a 24-hour clock">
      <template #example>
        <WinTimePicker
          v-model="selectedTime3"
          header="24 hour clock"
          clockIdentifier="24HourClock" />
      </template>
      <template #output>
        <p class="output-text">Selected time: {{ formatTime24Hour(selectedTime3) }}</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinTimePicker from '../components/WinTimePicker.vue';
import WinControlExample from '../components/WinControlExample.vue';

const selectedTime1 = ref(null);
const selectedTime2 = ref(null);

// Set default time to current time for 24-hour clock example
const now = new Date();
const selectedTime3 = ref({
  hour: now.getHours(),
  minute: now.getMinutes()
});

// Format time for 12-hour clock
const formatTime = (time) => {
  if (!time || typeof time.hour === 'undefined') return 'No time selected';

  const hour = time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour;
  const minute = String(time.minute).padStart(2, '0');
  const period = time.hour >= 12 ? 'PM' : 'AM';

  return `${hour}:${minute} ${period}`;
};

// Format time for 24-hour clock
const formatTime24Hour = (time) => {
  if (!time || typeof time.hour === 'undefined') return 'No time selected';

  const hour = String(time.hour).padStart(2, '0');
  const minute = String(time.minute).padStart(2, '0');

  return `${hour}:${minute}`;
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
