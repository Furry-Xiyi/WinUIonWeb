<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.timepicker')" />
          <WinTextBlock
            class="page-description"
            :Text="$t('text.use-a-timepicker-to-let-users-set-a-time-in-your')"
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
              :headerText="$t('text.a-simple-timepicker')"
              :theme="pageTheme"
              :vue="example1Vue">
              <template #example>
                <WinTimePicker />
              </template>
            </WinControlExample>

            <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.timepicker.header-minute-increment')"
              :theme="pageTheme"
              :vue="example2Vue">
              <template #example>
                <WinTimePicker :Header="$t('sample.timepicker.arrival-time')" :MinuteIncrement="15" />
              </template>
            </WinControlExample>

            <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.timepicker.24-hour-clock')"
              :theme="pageTheme"
              :vue="example3Vue">
              <template #example>
                <WinTimePicker
                  ClockIdentifier="24HourClock"
                  :Header="$t('sample.timepicker.24-hour-clock-header')" />
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinTimePicker from '../../components/WinTimePicker.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'timepicker');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const example1Vue = `<WinTimePicker />`;

const example2Vue = `<WinTimePicker Header="Arrival time" :MinuteIncrement="15" />`;

const example3Vue = `<WinTimePicker
  ClockIdentifier="24HourClock"
  Header="24 hour clock" />`;
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

.icon {
  font-size: 16px;
}
</style>
