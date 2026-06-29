<template>
  <div>
    <h1 class="page-header">CalendarView</h1>
    <p class="page-description">
      The CalendarView gives a standardized way to let users view and interact with a calendar. If you just need to let a user select a date, consider using a CalendarDatePicker. If you need to let users select multiple dates, you must use a CalendarView.
    </p>

    <WinControlExample headerText="A basic CalendarView.">
      <template #example>
        <WinCalendarView
          v-model="selectedDate"
          :selectionMode="currentSelectionMode"
          :isOutOfScopeEnabled="isOutOfScopeEnabled"
          :isGroupLabelVisible="isGroupLabelVisible"
          :language="currentLanguage"
          :calendarIdentifier="currentCalendar" />
      </template>

      <template #options>
        <WinCheckBox v-model="isGroupLabelVisible">
          IsGroupLabelVisible
        </WinCheckBox>
        <WinCheckBox v-model="isOutOfScopeEnabled">
          IsOutOfScopeEnabled
        </WinCheckBox>

        <div class="option-group">
          <label class="option-label">SelectionMode</label>
          <WinComboBox
            :options="selectionModes"
            v-model="selectionModeIndex"
            style="width: 100%;" />
        </div>

        <div class="option-group">
          <label class="option-label">CalendarIdentifier</label>
          <WinComboBox
            :options="calendars"
            v-model="calendarIndex"
            style="width: 100%;" />
        </div>

        <div class="option-group">
          <label class="option-label">Language</label>
          <WinComboBox
            :options="languages"
            v-model="languageIndex"
            style="width: 100%;" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import WinCalendarView from '../components/WinCalendarView.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinComboBox from '../components/WinComboBox.vue';

const selectedDate = ref(new Date());

const isGroupLabelVisible = ref(true);
const isOutOfScopeEnabled = ref(true);

const selectionModes = [
  { label: 'None' },
  { label: 'Single' },
  { label: 'Multiple' }
];
const selectionModeIndex = ref(1);
const currentSelectionMode = computed(() => selectionModes[selectionModeIndex.value].label);

const calendars = [
  { label: 'GregorianCalendar' },
  { label: 'HebrewCalendar' },
  { label: 'HijriCalendar' },
  { label: 'JapaneseCalendar' },
  { label: 'KoreanCalendar' },
  { label: 'TaiwanCalendar' },
  { label: 'ThaiCalendar' },
  { label: 'UmAlQuraCalendar' }
];
const calendarIndex = ref(0);
const currentCalendar = computed(() => calendars[calendarIndex.value].label);

const languages = [
  { label: 'English (en-US)' },
  { label: 'Chinese (zh-CN)' },
  { label: 'Spanish (es-ES)' },
  { label: 'French (fr-FR)' },
  { label: 'German (de-DE)' },
  { label: 'Japanese (ja-JP)' },
  { label: 'Arabic (ar-SA)' },
  { label: 'Hebrew (he-IL)' }
];
const languageIndex = ref(0);
const currentLanguage = computed(() => languages[languageIndex.value].label);

watch(selectionModeIndex, (newIdx) => {
  const mode = selectionModes[newIdx].label;
  if (mode === 'Multiple') {
    selectedDate.value = Array.isArray(selectedDate.value)
      ? selectedDate.value
      : selectedDate.value ? [selectedDate.value] : [];
  } else if (mode === 'Single') {
    selectedDate.value = Array.isArray(selectedDate.value)
      ? (selectedDate.value[0] || new Date())
      : (selectedDate.value || new Date());
  } else {
    selectedDate.value = null;
  }
});
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

.option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  font-weight: 600;
}
</style>
