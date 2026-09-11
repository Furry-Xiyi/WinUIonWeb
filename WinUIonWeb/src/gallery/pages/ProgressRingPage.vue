<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.progressring')" />
        <TextBlock
          class="page-description"
          :Text="$t('text.progressring-description')"
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
          :headerText="$t('sample.progressring.indeterminate')">
          <template #example>
            <ProgressRing
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
              <ToggleSwitch
                v-model:IsOn="isActive"
                :Header="$t('sample.progressring.progress-options')"
                :OnContent="$t('sample.progressring.working')"
                :OffContent="$t('sample.progressring.do-work')" />
              <ComboBox
                v-model:SelectedValue="selectedBackground1"
                Width="200"
                :Header="$t('sample.progressring.background-color')"
                :PlaceholderText="$t('sample.progressring.pick-color')"
                :ItemsSource="backgroundOptions" />
            </div>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :theme="pageTheme"
          :vue="determinateExampleCode"
          :headerText="$t('sample.progressring.determinate')">
          <template #example>
            <div class="determinate-example">
              <ProgressRing
                Width="60"
                Height="60"
                Margin="0,0,60,0"
                AutomationProperties.Name="Progress image"
                IsIndeterminate="False"
                :Value="progressValue"
                :Background="backgroundBrush(selectedBackground2)" />
              <NumberBox
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
              <ComboBox
                v-model:SelectedValue="selectedBackground2"
                Width="200"
                :Header="$t('sample.progressring.background-color')"
                :PlaceholderText="$t('sample.progressring.pick-color')"
                :ItemsSource="backgroundOptions" />
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
import ComboBox from '../../components/ComboBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import NumberBox from '../../components/NumberBox.vue';
import ProgressRing from '../../components/ProgressRing.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import ToggleSwitch from '../../components/ToggleSwitch.vue';
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

const indeterminateExampleCode = computed(() => `<ProgressRing
  Width="60"
  Height="60"
  Margin="10,10,0,0"
  VerticalAlignment="Top"
  IsActive="${isActive.value ? 'True' : 'False'}"${backgroundMarkup(selectedBackground1.value)}
  />`);

const determinateExampleCode = computed(() => `<ProgressRing
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
