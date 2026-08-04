<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.progressring')" />
        <WinTextBlock
          class="page-description"
          :Text="$t('text.progressring-description')"
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
          :headerText="$t('sample.progressring.indeterminate')">
          <template #example>
            <WinProgressRing
              Width="60"
              Height="60"
              Margin="10,10,0,0"
              VerticalAlignment="Top"
              AutomationProperties.Name="Progress image"
              :IsActive="isActive"
              :Background="backgroundBrush(selectedBackground1)" />
          </template>
          <template #options>
            <div class="progress-ring-options">
              <WinToggleSwitch
                v-model:IsOn="isActive"
                :Header="$t('sample.progressring.progress-options')"
                :OnContent="$t('sample.progressring.working')"
                :OffContent="$t('sample.progressring.do-work')" />
              <WinComboBox
                v-model:SelectedValue="selectedBackground1"
                Width="200"
                :Header="$t('sample.progressring.background-color')"
                :PlaceholderText="$t('sample.progressring.pick-color')"
                :ItemsSource="backgroundOptions" />
            </div>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :theme="pageTheme"
          :vue="determinateExampleCode"
          :headerText="$t('sample.progressring.determinate')">
          <template #example>
            <div class="determinate-example">
              <WinProgressRing
                Width="60"
                Height="60"
                Margin="0,0,60,0"
                AutomationProperties.Name="Progress image"
                IsIndeterminate="False"
                :Value="progressValue"
                :Background="backgroundBrush(selectedBackground2)" />
              <WinNumberBox
                MinWidth="120"
                VerticalAlignment="Center"
                AutomationProperties.Name="Progress amount"
                :Header="$t('sample.progressring.progress')"
                Maximum="100"
                Minimum="0"
                SpinButtonPlacementMode="Inline"
                v-model:Value="progressValue"
                @ValueChanged="onProgressValueChanged" />
            </div>
          </template>
          <template #options>
            <div class="progress-ring-options">
              <WinComboBox
                v-model:SelectedValue="selectedBackground2"
                Width="200"
                :Header="$t('sample.progressring.background-color')"
                :PlaceholderText="$t('sample.progressring.pick-color')"
                :ItemsSource="backgroundOptions" />
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
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import WinProgressRing from '../../components/WinProgressRing.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'progressring');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const backgroundOptions = ['Transparent', 'LightGray'];
const selectedBackground1 = ref();
const selectedBackground2 = ref();
const isActive = ref(true);
const progressValue = ref(0);

const backgroundBrush = (value) => value === 'LightGray' ? 'LightGray' : 'Transparent';
const backgroundMarkup = (value) => value ? `\n  Background="${value}"` : '';

const onProgressValueChanged = ({ NewValue }) => {
  if (Number.isNaN(NewValue)) progressValue.value = 0;
};

const indeterminateExampleCode = computed(() => `<WinProgressRing
  Width="60"
  Height="60"
  Margin="10,10,0,0"
  VerticalAlignment="Top"
  IsActive="${isActive.value ? 'True' : 'False'}"${backgroundMarkup(selectedBackground1.value)}
  />`);

const determinateExampleCode = computed(() => `<WinProgressRing
  Width="60"
  Height="60"
  Margin="0,0,60,0"
  IsIndeterminate="False"
  :Value="progressValue"${backgroundMarkup(selectedBackground2.value)}
  />`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.progress-ring-options { display: flex; flex-direction: column; gap: 12px; }
.determinate-example { display: flex; align-items: center; flex-wrap: nowrap; width: 100%; }
</style>
