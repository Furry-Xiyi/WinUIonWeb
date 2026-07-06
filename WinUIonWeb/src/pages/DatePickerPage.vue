<template>
  <div>
    <div style="position: relative;">
      <WinTextBlock class="page-header" Text="DatePicker" />
      <WinTextBlock
        class="page-description"
        Text="Use a DatePicker to let users set a date in your app, for example to schedule an appointment. The DatePicker displays three controls for month, date, and year. These controls are easy to use with touch or mouse, and they can be styled and configured in several different ways."
        TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton @click="toggleTheme" style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinTextBlock class="control-example-description" Text="A simple DatePicker with a header." />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Vue" :xaml="example1Xaml">
      <template #example>
        <WinDatePicker Header="Pick a date" />
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A DatePicker with day formatted and year hidden." />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Vue" :xaml="example2Xaml">
      <template #example>
        <WinDatePicker
          v-model:Date="control2Date"
          DayFormat="{}{day.integer} ({dayofweek.abbreviated})"
          :YearVisible="false"
          :MinYear="control2MinYear"
          :MaxYear="control2MaxYear" />
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinDatePicker from '../components/WinDatePicker.vue';
import WinTextBlock from '../components/WinTextBlock.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { createPageState } from '../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'datepicker');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const now = new Date();
const control2Date = ref(new Date(now.getFullYear(), now.getMonth() + 2, now.getDate()));
const control2MinYear = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const control2MaxYear = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());

const example1Vue = `<WinDatePicker Header="Pick a date" />`;
const example1Xaml = `<DatePicker Header="Pick a date" />`;

const example2Vue = `<WinDatePicker
  v-model:Date="control2Date"
  DayFormat="{}{day.integer} ({dayofweek.abbreviated})"
  :YearVisible="false"
  :MinYear="control2MinYear"
  :MaxYear="control2MaxYear" />`;
const example2Xaml = `<DatePicker DayFormat="{}{day.integer} ({dayofweek.abbreviated})" YearVisible="False" />`;
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
