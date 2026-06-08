<!-- CalendarViewPage.vue -->
<template>
  <div class="page-container page-transition-fade">
    <h1 class="page-header">CalendarView</h1>
    <div class="content-split">
      <div class="left-pane">
        <WinCalendarView v-model="selectedDate"
                         :selectionMode="selectionModes[selectionModeIndex].value"
                         :isOutOfScopeEnabled="isOutOfScopeEnabled"
                         :isGroupLabelVisible="isGroupLabelVisible"
                         :language="languages[languageIndex].value"
                         :calendarIdentifier="calendars[calendarIndex].value" />
      </div>
      <div class="right-pane">
        <WinSettingsCard contentPlacement="bottom">
          <template #header>
            Options
          </template>
          <div class="options-list">
            <WinCheckBox v-model="isGroupLabelVisible">IsGroupLabelVisible</WinCheckBox>
            <WinCheckBox v-model="isOutOfScopeEnabled">IsOutOfScopeEnabled</WinCheckBox>

            <div class="combo-group">
              <label>SelectionMode</label>
              <WinComboBox :options="selectionModes" v-model="selectionModeIndex" />
            </div>

            <div class="combo-group">
              <label>CalendarIdentifier</label>
              <WinComboBox :options="calendars" v-model="calendarIndex" />
            </div>

            <div class="combo-group">
              <label>Language</label>
              <WinComboBox :options="languages" v-model="languageIndex" />
            </div>
          </div>
        </WinSettingsCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinCalendarView from '../components/WinCalendarView.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinComboBox from '../components/WinComboBox.vue';

const selectedDate = ref(new Date());

const isGroupLabelVisible = ref(true);
const isOutOfScopeEnabled = ref(true);

const selectionModes = [
  { label: 'None', value: 'None' },
  { label: 'Single', value: 'Single' },
  { label: 'Multiple', value: 'Multiple' }
];
const selectionModeIndex = ref(1);

const calendars = [
  { label: 'GregorianCalendar', value: 'Gregorian' }
];
const calendarIndex = ref(0);

const languages = [
  { label: 'English', value: 'English' },
  { label: 'Chinese', value: 'Chinese' }
];
const languageIndex = ref(0);
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

  .content-split {
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }

  .left-pane {
    flex: 0 0 auto;
  }

  .right-pane {
    flex: 1;
    max-width: 400px;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 0;
  }

  .combo-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

    .combo-group label {
      font-size: 14px;
      color: var(--text-secondary);
    }
</style>
