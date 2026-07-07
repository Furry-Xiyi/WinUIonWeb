<template>
  <div>
    <div style="position: relative;">
      <WinTextBlock class="page-header" :Text="$t('text.timepicker')" />
      <WinTextBlock
        class="page-description"
        :Text="$t('text.use-a-timepicker-to-let-users-set-a-time-in-your')"
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

    <WinTextBlock class="control-example-description" :Text="$t('text.a-simple-timepicker')" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Vue" :xaml="example1Xaml">
      <template #example>
        <WinTimePicker />
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A TimePicker with a header and minute increments specified." />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Vue" :xaml="example2Xaml">
      <template #example>
        <WinTimePicker Header="Arrival time" :MinuteIncrement="15" />
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A TimePicker using a 24-hour clock, initialized to current time." />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example3Vue" :xaml="example3Xaml">
      <template #example>
        <WinTimePicker
          v-model:SelectedTime="selectedTime"
          ClockIdentifier="24HourClock"
          Header="24 hour clock" />
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinTimePicker from '../../components/WinTimePicker.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'timepicker');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const now = new Date();
const selectedTime = ref({ hour: now.getHours(), minute: now.getMinutes() });

const example1Vue = `<WinTimePicker />`;
const example1Xaml = `<TimePicker />`;

const example2Vue = `<WinTimePicker Header="Arrival time" :MinuteIncrement="15" />`;
const example2Xaml = `<TimePicker Header="Arrival time" MinuteIncrement="15" />`;

const example3Vue = `<WinTimePicker
  v-model:SelectedTime="selectedTime"
  ClockIdentifier="24HourClock"
  Header="24 hour clock" />`;
const example3Xaml = `<TimePicker ClockIdentifier="24HourClock" Header="24 hour clock" SelectedTime="{x:Bind sys:DateTime.Now.TimeOfDay}" />`;
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
