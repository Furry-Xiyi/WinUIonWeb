<!-- DatePickerPage.vue -->
<template>
  <div class="page-container">
    <h1 class="page-header">DatePicker</h1>

    <div class="cards-layout">
      <WinSettingsCard>
        <template #header>
          A simple DatePicker with a header.
        </template>
        <WinDatePicker header="Date of birth" />
      </WinSettingsCard>

      <WinSettingsCard>
        <template #header>
          A DatePicker with day formatted and year hidden.
        </template>
        <WinDatePicker :yearVisible="false" :dayFormatted="true" />
      </WinSettingsCard>
    </div>
  </div>
</template>

<script setup>
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinDatePicker from '../components/WinDatePicker.vue';
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
