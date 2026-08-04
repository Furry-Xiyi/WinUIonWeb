<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.progressbar')" />
        <WinTextBlock
          class="page-description"
          :Text="$t('text.progressbar-description')"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
          <WinToggleButton
            :IsChecked="isFavoriteState"
            class="header-action"
            @update:IsChecked="toggleFavorite">
            <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
          </WinToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :theme="pageTheme"
          :vue="indeterminateExampleCode"
          :headerText="$t('sample.progressbar.indeterminate')">
          <template #example>
            <WinProgressBar
              Width="130"
              Margin="10,10,0,0"
              VerticalAlignment="Top"
              IsIndeterminate="True"
              :ShowError="ProgressBarState.ShowError"
              :ShowPaused="ProgressBarState.ShowPaused" />
          </template>
          <template #options>
            <WinRadioButtons
              v-model:SelectedIndex="progressStateIndex"
              :Header="$t('sample.progressbar.progress-state')"
              :ItemsSource="progressStateItems" />
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :theme="pageTheme"
          :vue="determinateExampleCode"
          :headerText="$t('sample.progressbar.determinate')">
          <template #example>
            <div class="determinate-example">
              <WinProgressBar
                Width="130"
                :Value="progressValue"
                AutomationProperties.Name="Determinate ProgressBar example" />
              <WinTextBlock
                Width="60"
                aria-hidden="true"
                style="width: 60px; min-width: 60px; flex: 0 0 60px;" />
              <WinTextBlock
                Margin="0,0,10,0"
                VerticalAlignment="Center"
                :Text="$t('sample.progressbar.progress')" />
              <WinNumberBox
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
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import WinProgressBar from '../../components/WinProgressBar.vue';
import WinRadioButtons from '../../components/WinRadioButtons.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
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

const indeterminateExampleCode = computed(() => `<WinProgressBar
  Width="130"
  Margin="10,10,0,0"
  VerticalAlignment="Top"
  IsIndeterminate="True"
  ShowPaused="${ProgressBarState.value.ShowPaused}"
  ShowError="${ProgressBarState.value.ShowError}" />`);

const determinateExampleCode = computed(() => `<WinProgressBar Width="130" :Value="progressValue" />`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.determinate-example { display: flex; align-items: center; flex-wrap: nowrap; gap: 0; width: 100%; }
</style>
