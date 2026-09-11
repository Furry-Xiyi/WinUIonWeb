<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.progressbar')" />
        <TextBlock
          class="page-description"
          :Text="$t('text.progressbar-description')"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
          <ToggleButton
            :IsChecked="isFavoriteState"
            class="header-action"
            @update:IsChecked="toggleFavorite">
            <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
          </ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample
          class="basic-input-example-theme"
          :theme="pageTheme"
          :vue="indeterminateExampleCode"
          :headerText="$t('sample.progressbar.indeterminate')">
          <template #example>
            <ProgressBar
              Width="130"
              Margin="10,10,0,0"
              VerticalAlignment="Top"
              IsIndeterminate="True"
              :ShowError="ProgressBarState.ShowError"
              :ShowPaused="ProgressBarState.ShowPaused" />
          </template>
          <template #options>
            <RadioButtons
              v-model:SelectedIndex="progressStateIndex"
              :Header="$t('sample.progressbar.progress-state')"
              :ItemsSource="progressStateItems" />
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :theme="pageTheme"
          :vue="determinateExampleCode"
          :headerText="$t('sample.progressbar.determinate')">
          <template #example>
            <div class="determinate-example">
              <ProgressBar
                Width="130"
                :Value="progressValue"
                AutomationProperties.Name="Determinate ProgressBar example" />
              <TextBlock
                Width="60"
                aria-hidden="true"
                style="width: 60px; min-width: 60px; flex: 0 0 60px;" />
              <TextBlock
                Margin="0,0,10,0"
                VerticalAlignment="Center"
                :Text="$t('sample.progressbar.progress')" />
              <NumberBox
                v-model:Value="progressValue"
                AutomationProperties.LabeledBy="ProgressLabel"
                AutomationProperties.Name="NumberBox controlling ProgressBar2 value"
                :Maximum="100"
                :Minimum="0"
                SpinButtonPlacementMode="Inline"
                :Width="120"
                @ValueChanged="onProgressValueChanged" />
            </div>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import NumberBox from '../../components/NumberBox.vue';
import ProgressBar from '../../components/ProgressBar.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'progressbar');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const progressStateIndex = ref(0);
const progressStateItems = computed(() => [
  { Text: t('sample.progressbar.running'), Value: 'Running' },
  { Text: t('sample.progressbar.paused'), Value: 'Paused' },
  { Text: t('sample.progressbar.error'), Value: 'Error' }
]);
const ProgressBarState = computed(() => ({
  ShowPaused: progressStateIndex.value === 1 ? 'True' : 'False',
  ShowError: progressStateIndex.value === 2 ? 'True' : 'False'
}));

const progressValue = ref(0);

const onProgressValueChanged = ({ NewValue }) => {
  if (Number.isNaN(NewValue)) progressValue.value = 0;
};

const indeterminateExampleCode = computed(() => `<ProgressBar
  Width="130"
  Margin="10,10,0,0"
  VerticalAlignment="Top"
  IsIndeterminate="True"
  ShowPaused="${ProgressBarState.value.ShowPaused}"
  ShowError="${ProgressBarState.value.ShowError}" />`);

const determinateExampleCode = computed(() => `<ProgressBar Width="130" :Value="progressValue" />`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.determinate-example { display: flex; align-items: center; flex-wrap: nowrap; gap: 0; width: 100%; }
</style>
