<!-- TimePickerPage.vue -->
<template>
  <div class="page-container page-transition-left">
    <h1 class="page-header">TimePicker</h1>

    <div class="cards-layout">
      <WinSettingsCard>
        <template #header>
          A simple TimePicker.
        </template>
        <WinTimePicker />
      </WinSettingsCard>

      <WinSettingsCard>
        <template #header>
          A TimePicker with a header and minute increments specified.
        </template>
        <WinTimePicker header="Meeting time" :minuteIncrement="15" />
      </WinSettingsCard>

      <WinSettingsCard>
        <template #header>
          A TimePicker using a 24-hour clock.
        </template>
        <WinTimePicker clockIdentifier="24HourClock" />
      </WinSettingsCard>
    </div>
  </div>
</template>

<script setup>
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinTimePicker from '../components/WinTimePicker.vue';
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

  .cards-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
