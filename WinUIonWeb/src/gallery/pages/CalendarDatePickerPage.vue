<template>
  <div>
    <div style="position: relative;">
      <WinTextBlock class="page-header" :Text="$t('text.calendardatepicker')" />
      <WinTextBlock
        class="page-description"
        :Text="$t('text.the-calendardatepicker-is-a-drop-down-control-th')"
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

    <WinTextBlock class="control-example-description" :Text="$t('text.calendardatepicker-with-a-header-and-placeholder')" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Vue" :xaml="example1Xaml">
      <template #example>
        <WinCalendarDatePicker
          v-model:Date="selectedDate"
          v-model:IsCalendarOpen="isCalendarOpen"
          :Header="$t('text.calendar')"
          :PlaceholderText="$t('text.pick-a-date')" />
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCalendarDatePicker from '../../components/WinCalendarDatePicker.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'calendardatepicker');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const selectedDate = ref(null);
const isCalendarOpen = ref(false);

const example1Vue = `<WinCalendarDatePicker
  v-model:Date="selectedDate"
  Header="Calendar"
  PlaceholderText="Pick a date" />`;
const example1Xaml = `<CalendarDatePicker PlaceholderText="Pick a date" Header="Calendar" />`;
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

.icon {
  font-size: 16px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}
</style>
