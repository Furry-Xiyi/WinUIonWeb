<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.calendarview')" />
          <WinTextBlock
            class="page-description"
            :Text="$t('text.the-calendarview-gives-a-standardized-way-to-let')"
            TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme">
              <span class="icon"></span>
            </WinButton>
            <WinToggleButton class="header-action" :IsChecked="isFavoriteState"
              @update:IsChecked="toggleFavorite"
             >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('text.a-basic-calendar-view')"
              :theme="pageTheme"
              :vue="example1Vue">
              <template #example>
                <WinCalendarView
                  :CalendarIdentifier="CalendarIdentifier"
                  :IsGroupLabelVisible="IsGroupLabelVisible"
                  :IsOutOfScopeEnabled="IsOutOfScopeEnabled"
                  :SelectionMode="SelectionMode"
                  :Language="Language" />
              </template>

              <template #options>
                <div class="options-panel">
                  <WinCheckBox v-model="IsGroupLabelVisible"><WinTextBlock Text="IsGroupLabelVisible" /></WinCheckBox>
                  <WinCheckBox v-model="IsOutOfScopeEnabled"><WinTextBlock Text="IsOutOfScopeEnabled" /></WinCheckBox>

                  <div class="option-group">
                    <WinComboBox v-model:SelectedIndex="selectionModeIndex" Header="SelectionMode" :ItemsSource="selectionModes" style="width: 220px;" />
                  </div>

                  <div class="option-group">
                    <WinComboBox v-model:SelectedIndex="calendarIdentifierIndex" Header="CalendarIdentifier" :ItemsSource="calendarIdentifiers" DisplayMemberPath="label" style="width: 220px;" />
                  </div>

                  <div class="option-group">
                    <WinComboBox v-model:SelectedIndex="languageIndex" Header="Language" :ItemsSource="languages" DisplayMemberPath="label" style="width: 220px;" />
                  </div>
                </div>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCalendarView from '../../components/WinCalendarView.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import { useI18n } from '../../components/i18n/index';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'calendarview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const IsGroupLabelVisible = ref(true);
const IsOutOfScopeEnabled = ref(true);

const selectionModes = [
  'None',
  'Single',
  'Multiple'
];
const selectionModeIndex = ref(1);
const SelectionMode = computed(() => selectionModes[selectionModeIndex.value]);

const calendarIdentifiers = [
  { label: t('text.gregoriancalendar'), value: 'GregorianCalendar' },
  { label: t('text.hebrewcalendar'), value: 'HebrewCalendar' },
  { label: t('text.hijricalendar'), value: 'HijriCalendar' },
  { label: t('text.japanesecalendar'), value: 'JapaneseCalendar' },
  { label: t('text.juliancalendar'), value: 'JulianCalendar' },
  { label: t('text.koreancalendar'), value: 'KoreanCalendar' },
  { label: t('text.persiancalendar'), value: 'PersianCalendar' },
  { label: t('text.taiwancalendar'), value: 'TaiwanCalendar' },
  { label: t('text.thaicalendar'), value: 'ThaiCalendar' },
  { label: t('text.umalquracalendar'), value: 'UmAlQuraCalendar' }
];
const calendarIdentifierIndex = ref(0);
const CalendarIdentifier = computed(() => calendarIdentifiers[calendarIdentifierIndex.value].value);

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Afrikaans', value: 'af' },
  { label: 'Albanian', value: 'sq' },
  { label: 'Amharic', value: 'am' },
  { label: 'Armenian', value: 'hy' },
  { label: 'Assamese', value: 'as' },
  { label: 'Azerbaijani', value: 'az' },
  { label: 'Basque', value: 'eu' },
  { label: 'Belarusian', value: 'be' },
  { label: 'Bangla', value: 'bn' },
  { label: 'Bosnian', value: 'bs' },
  { label: 'Bulgarian', value: 'bg' },
  { label: 'Catalan', value: 'ca' },
  { label: 'Chinese (Simplified)', value: 'zh' },
  { label: 'Croatian', value: 'hr' },
  { label: 'Czech', value: 'cs' },
  { label: 'Danish', value: 'da' },
  { label: 'Dari', value: 'prs' },
  { label: 'Dutch', value: 'nl' },
  { label: 'Estonian', value: 'et' },
  { label: 'Filipino', value: 'fil' },
  { label: 'Finnish', value: 'fi' },
  { label: 'French', value: 'fr' },
  { label: 'Galician', value: 'gl' },
  { label: 'Georgian', value: 'ka' },
  { label: 'German', value: 'de' },
  { label: 'Greek', value: 'el' },
  { label: 'Gujarati', value: 'gu' },
  { label: 'Hausa', value: 'ha' },
  { label: 'Hebrew', value: 'he' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Icelandic', value: 'is' },
  { label: 'Indonesian', value: 'id' },
  { label: 'Irish', value: 'ga' },
  { label: 'isiXhosa', value: 'xh' },
  { label: 'isiZulu', value: 'zu' },
  { label: 'Italian', value: 'it' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Kazakh', value: 'kk' },
  { label: 'Khmer', value: 'km' },
  { label: 'Kinyarwanda', value: 'rw' },
  { label: 'KiSwahili', value: 'sw' },
  { label: 'Konkani', value: 'kok' },
  { label: 'Korean', value: 'ko' },
  { label: 'Lao', value: 'lo' },
  { label: 'Latvian', value: 'lv' },
  { label: 'Lithuanian', value: 'lt' },
  { label: 'Luxembourgish', value: 'lb' },
  { label: 'Macedonian', value: 'mk' },
  { label: 'Malay', value: 'ms' },
  { label: 'Malayalam', value: 'ml' },
  { label: 'Maltese', value: 'mt' },
  { label: 'Maori', value: 'mi' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Nepali', value: 'ne' },
  { label: 'Norwegian', value: 'nb' },
  { label: 'Odia', value: 'or' },
  { label: 'Persian', value: 'fa' },
  { label: 'Polish', value: 'pl' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Punjabi', value: 'pa' },
  { label: 'Quechua', value: 'quz' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Russian', value: 'ru' },
  { label: 'Serbian (Latin)', value: 'sr' },
  { label: 'Sesotho sa Leboa', value: 'nso' },
  { label: 'Setswana', value: 'tn' },
  { label: 'Sinhala', value: 'si' },
  { label: 'Slovak', value: 'sk' },
  { label: 'Slovenian', value: 'sl' },
  { label: 'Spanish', value: 'es' },
  { label: 'Swedish', value: 'sv' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
  { label: 'Thai', value: 'th' },
  { label: 'Tigrinya', value: 'ti' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Ukrainian', value: 'uk' },
  { label: 'Urdu', value: 'ur' },
  { label: 'Uzbek (Latin)', value: 'uz' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Welsh', value: 'cy' },
  { label: 'Wolof', value: 'wo' }
];
const languageIndex = ref(0);
const Language = computed(() => languages[languageIndex.value].value);

const example1Vue = `<WinCalendarView
  :CalendarIdentifier="CalendarIdentifier"
  :IsGroupLabelVisible="IsGroupLabelVisible"
  :IsOutOfScopeEnabled="IsOutOfScopeEnabled"
  :SelectionMode="SelectionMode"
  :Language="Language" />`;

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

.icon {
  font-size: 16px;
}
</style>
