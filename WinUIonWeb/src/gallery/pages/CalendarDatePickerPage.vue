<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.calendardatepicker')" />
          <TextBlock
            class="page-description"
            :Text="$t('text.the-calendardatepicker-is-a-drop-down-control-th')"
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
              :headerText="$t('text.calendardatepicker-with-a-header-and-placeholder')"
              :theme="pageTheme"
              :vue="example1Vue">
              <template #example>
                <CalendarDatePicker
                  :Header="$t('text.calendar')"
                  :PlaceholderText="$t('text.pick-a-date')" />
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue';
import Button from '../../components/Button.vue';
import CalendarDatePicker from '../../components/CalendarDatePicker.vue';
import ControlExample from '../../components/ControlExample.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'calendardatepicker');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const example1Vue = `<CalendarDatePicker
  Header="Calendar"
  PlaceholderText="Pick a date" />`;
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
