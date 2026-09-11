<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.datepicker')" />
          <TextBlock
            class="page-description"
            :Text="$t('text.use-a-datepicker-to-let-users-set-a-date-in-your')"
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
              :headerText="$t('text.a-simple-datepicker-with-a-header')"
              :theme="pageTheme"
              :vue="example1Vue">
              <template #example>
                <DatePicker :Header="$t('text.pick-a-date')" />
              </template>
            </ControlExample>

            <ControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.datepicker.day-formatted-year-hidden')"
              :theme="pageTheme"
              :vue="example2Vue">
              <template #example>
                <div class="horizontal-example">
                  <DatePicker
                    :Date="control2Date"
                    DayFormat="{}{day.integer} ({dayofweek.abbreviated})"
                    :YearVisible="false"
                    :MinYear="control2MinYear"
                    :MaxYear="control2MaxYear" />
                  <TextBlock Text="" />
                </div>
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
import DatePicker from '../../components/DatePicker.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'datepicker');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const now = new Date();
const control2Date = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
const control2MinYear = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const control2MaxYear = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());

const example1Vue = `<DatePicker Header="Pick a date" />`;

const example2Vue = `<DatePicker
  DayFormat="{}{day.integer} ({dayofweek.abbreviated})"
  :YearVisible="false"
  :MinYear="control2MinYear"
  :MaxYear="control2MaxYear" />`;
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

.horizontal-example {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 16px;
}
</style>
