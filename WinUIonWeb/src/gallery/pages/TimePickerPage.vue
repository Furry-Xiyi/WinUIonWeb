<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.timepicker')" />
          <TextBlock
            class="page-description"
            :Text="$t('text.use-a-timepicker-to-let-users-set-a-time-in-your')"
            TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @click="toggleTheme">
              <span class="icon"></span>
            </Button>
            <ToggleButton class="header-action" :IsChecked="isFavoriteState"
              @update:IsChecked="toggleFavorite"
             >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample
              class="basic-input-example-theme"
              :headerText="$t('text.a-simple-timepicker')"
              :theme="pageTheme"
              :vue="example1Vue">
              <template #example>
                <TimePicker />
              </template>
            </ControlExample>

            <ControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.timepicker.header-minute-increment')"
              :theme="pageTheme"
              :vue="example2Vue">
              <template #example>
                <TimePicker :Header="$t('sample.timepicker.arrival-time')" :MinuteIncrement="15" />
              </template>
            </ControlExample>

            <ControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.timepicker.24-hour-clock')"
              :theme="pageTheme"
              :vue="example3Vue">
              <template #example>
                <TimePicker
                  ClockIdentifier="24HourClock"
                  :Header="$t('sample.timepicker.24-hour-clock-header')" />
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import TextBlock from '../../components/TextBlock.vue';
import TimePicker from '../../components/TimePicker.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'timepicker');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const example1Vue = `<TimePicker />`;

const example2Vue = `<TimePicker Header="Arrival time" :MinuteIncrement="15" />`;

const example3Vue = `<TimePicker
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
