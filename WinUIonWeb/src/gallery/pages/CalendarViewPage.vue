<template>
  <div>
    <div style="position: relative;">
      <WinTextBlock class="page-header" :Text="$t('text.calendarview')" />
      <WinTextBlock
        class="page-description"
        :Text="$t('text.the-calendarview-gives-a-standardized-way-to-let')"
        TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton @click="toggleTheme" style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon"></span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinTextBlock class="control-example-description" :Text="$t('text.a-basic-calendar-view')" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Vue" :xaml="example1Xaml">
      <template #example>
        <WinCalendarView
          v-model:SelectedDates="SelectedDates"
          :CalendarIdentifier="CalendarIdentifier"
          :IsGroupLabelVisible="IsGroupLabelVisible"
          :IsOutOfScopeEnabled="IsOutOfScopeEnabled"
          :SelectionMode="SelectionMode"
          :Language="Language" />
      </template>

      <template #options>
        <div class="options-panel">
          <WinCheckBox v-model="IsGroupLabelVisible">IsGroupLabelVisible</WinCheckBox>
          <WinCheckBox v-model="IsOutOfScopeEnabled">IsOutOfScopeEnabled</WinCheckBox>

          <div class="option-group">
            <label class="option-label">SelectionMode</label>
            <WinComboBox :options="selectionModes" v-model="selectionModeIndex" style="width: 220px;" />
          </div>

          <div class="option-group">
            <label class="option-label">CalendarIdentifier</label>
            <WinComboBox :options="calendarIdentifiers" v-model="calendarIdentifierIndex" style="width: 220px;" />
          </div>

          <div class="option-group">
            <label class="option-label">Language</label>
            <WinComboBox :options="languages" v-model="languageIndex" style="width: 220px;" />
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCalendarView from '../../components/WinCalendarView.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import { useI18n } from '../../components/i18n/index';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'calendarview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const SelectedDates = ref([new Date()]);
const IsGroupLabelVisible = ref(true);
const IsOutOfScopeEnabled = ref(true);

const selectionModes = [
  { label: t('text.none') },
  { label: t('text.single') },
  { label: t('text.multiple') }
];
const selectionModeIndex = ref(1);
const SelectionMode = computed(() => selectionModes[selectionModeIndex.value].label);

const calendarIdentifiers = [
  { label: t('text.gregoriancalendar') },
  { label: t('text.hebrewcalendar') },
  { label: t('text.hijricalendar') },
  { label: t('text.japanesecalendar') },
  { label: t('text.juliancalendar') },
  { label: t('text.koreancalendar') },
  { label: t('text.persiancalendar') },
  { label: t('text.taiwancalendar') },
  { label: t('text.thaicalendar') },
  { label: t('text.umalquracalendar') }
];
const calendarIdentifierIndex = ref(0);
const CalendarIdentifier = computed(() => calendarIdentifiers[calendarIdentifierIndex.value].label);

const languages = [
  { label: t('text.english-en-us'), value: 'en-US' },
  { label: t('text.chinese-zh-cn'), value: 'zh-CN' },
  { label: t('text.spanish-es-es'), value: 'es-ES' },
  { label: t('text.french-fr-fr'), value: 'fr-FR' },
  { label: t('text.german-de-de'), value: 'de-DE' },
  { label: t('text.japanese-ja-jp'), value: 'ja-JP' },
  { label: t('text.arabic-ar-sa'), value: 'ar-SA' },
  { label: t('text.hebrew-he-il'), value: 'he-IL' }
];
const languageIndex = ref(0);
const Language = computed(() => languages[languageIndex.value].value);

watch(selectionModeIndex, () => {
  if (SelectionMode.value === 'None') {
    SelectedDates.value = [];
  } else if (SelectionMode.value === 'Single' && SelectedDates.value.length > 1) {
    SelectedDates.value = [SelectedDates.value[0]];
  } else if (SelectionMode.value !== 'None' && SelectedDates.value.length === 0) {
    SelectedDates.value = [new Date()];
  }
});

const example1Vue = `<WinCalendarView
  v-model:SelectedDates="SelectedDates"
  :CalendarIdentifier="CalendarIdentifier"
  :IsGroupLabelVisible="IsGroupLabelVisible"
  :IsOutOfScopeEnabled="IsOutOfScopeEnabled"
  :SelectionMode="SelectionMode"
  :Language="Language" />`;

const example1Xaml = `<CalendarView
    SelectionMode="$(SelectionMode)"
    IsGroupLabelVisible="$(IsGroupLabelVisible)"
    IsOutOfScopeEnabled="$(IsOutOfScopeEnabled)"
    Language="$(Language)"
    CalendarIdentifier="$(CalendarIdentifier)" />`;
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

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.control-example-description {
  margin: 12px 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.options-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-label {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.icon {
  font-size: 16px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}
</style>
