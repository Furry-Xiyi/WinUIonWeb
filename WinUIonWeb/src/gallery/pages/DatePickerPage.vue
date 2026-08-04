<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.datepicker')" />
          <WinTextBlock
            class="page-description"
            :Text="$t('text.use-a-datepicker-to-let-users-set-a-date-in-your')"
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
              :headerText="$t('text.a-simple-datepicker-with-a-header')"
              :theme="pageTheme"
              :vue="example1Vue">
              <template #example>
                <WinDatePicker :Header="$t('text.pick-a-date')" />
              </template>
            </WinControlExample>

            <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.datepicker.day-formatted-year-hidden')"
              :theme="pageTheme"
              :vue="example2Vue">
              <template #example>
                <div class="horizontal-example">
                  <WinDatePicker
                    :Date="control2Date"
                    DayFormat="{}{day.integer} ({dayofweek.abbreviated})"
                    :YearVisible="false"
                    :MinYear="control2MinYear"
                    :MaxYear="control2MaxYear" />
                  <WinTextBlock Text="" />
                </div>
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
import WinDatePicker from '../../components/WinDatePicker.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'datepicker');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const now = new Date();
const control2Date = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
const control2MinYear = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const control2MaxYear = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());

const example1Vue = `<WinDatePicker Header="Pick a date" />`;

const example2Vue = `<WinDatePicker
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
