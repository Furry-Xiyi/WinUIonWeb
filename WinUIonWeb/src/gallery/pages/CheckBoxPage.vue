<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.checkbox')" />
          <WinTextBlock class="page-description" :Text="$t('text.checkbox-controls-let-the-user-select-a-combinat')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="checkBoxTwoStateVue" :headerText="$t('sample.checkbox.two-state')">
              <template #example>
                <WinCheckBox v-model:IsChecked="twoStateChecked" AutomationProperties.Name="Two-state" @Checked="TwoState_Checked" @Unchecked="TwoState_Unchecked">
                  <WinTextBlock :Text="$t('sample.checkbox.two-state-content')" />
                </WinCheckBox>
              </template>
              <template #options>
                <WinTextBlock AutomationProperties.AutomationId="Control1Output" :Text="TwoStateOutput" />
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="checkBoxThreeStateVue" :headerText="$t('sample.checkbox.three-state')">
              <template #example>
                <WinCheckBox v-model:IsChecked="threeStateChecked" AutomationProperties.Name="Three-state" IsThreeState @Checked="ThreeState_Checked" @Unchecked="ThreeState_Unchecked" @Indeterminate="ThreeState_Indeterminate">
                  <WinTextBlock :Text="$t('sample.checkbox.three-state-content')" />
                </WinCheckBox>
              </template>
              <template #options>
                <WinTextBlock AutomationProperties.AutomationId="Control2Output" :Text="ThreeStateOutput" />
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="checkBoxSelectAllVue" :headerText="$t('sample.checkbox.select-all')">
              <template #example>
                <div class="vertical-stack">
                  <WinCheckBox :IsChecked="OptionsAllCheckBox" IsThreeState @Checked="SelectAll_Checked" @Unchecked="SelectAll_Unchecked" @Indeterminate="SelectAll_Indeterminate">
                    <WinTextBlock :Text="$t('sample.select-all')" />
                  </WinCheckBox>
                  <WinCheckBox v-model:IsChecked="Option1CheckBox" Margin="24,0,0,0" @Checked="Option_Checked" @Unchecked="Option_Unchecked">
                    <WinTextBlock :Text="$t('text.option-1')" />
                  </WinCheckBox>
                  <WinCheckBox v-model:IsChecked="Option2CheckBox" Margin="24,0,0,0" @Checked="Option_Checked" @Unchecked="Option_Unchecked">
                    <WinTextBlock :Text="$t('text.option-2')" />
                  </WinCheckBox>
                  <WinCheckBox v-model:IsChecked="Option3CheckBox" Margin="24,0,0,0" @Checked="Option_Checked" @Unchecked="Option_Unchecked">
                    <WinTextBlock :Text="$t('text.option-3')" />
                  </WinCheckBox>
                </div>
              </template>
              <template #options>
                <WinTextBlock :Text="selectAllOutput" />
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'checkbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const twoStateChecked = ref(false);
const TwoStateOutput = ref('');
const threeStateChecked = ref(false);
const ThreeStateOutput = ref('');
const Option1CheckBox = ref(false);
const Option2CheckBox = ref(true);
const Option3CheckBox = ref(false);

const OptionsAllCheckBox = computed(() => {
  const count = [Option1CheckBox.value, Option2CheckBox.value, Option3CheckBox.value].filter(Boolean).length;
  if (count === 3) return true;
  if (count === 0) return false;
  return null;
});

const selectAllOutput = computed(() => {
  const count = [Option1CheckBox.value, Option2CheckBox.value, Option3CheckBox.value].filter(Boolean).length;
  if (count === 0) return t('sample.nothing-checked');
  if (count === 3) return t('sample.all-options-checked');
  return t(count === 1 ? 'sample.option-checked-count' : 'sample.options-checked-count', { count });
});

const TwoState_Checked = () => { TwoStateOutput.value = t('sample.checkbox.you-checked'); };
const TwoState_Unchecked = () => { TwoStateOutput.value = t('sample.checkbox.you-unchecked'); };
const ThreeState_Checked = () => { ThreeStateOutput.value = t('sample.checkbox.checked'); };
const ThreeState_Unchecked = () => { ThreeStateOutput.value = t('sample.checkbox.unchecked'); };
const ThreeState_Indeterminate = () => { ThreeStateOutput.value = t('sample.checkbox.indeterminate'); };
const SelectAll_Checked = () => { Option1CheckBox.value = Option2CheckBox.value = Option3CheckBox.value = true; };
const SelectAll_Unchecked = () => { Option1CheckBox.value = Option2CheckBox.value = Option3CheckBox.value = false; };
const SelectAll_Indeterminate = () => {
  if (OptionsAllCheckBox.value === true) SelectAll_Unchecked();
};
const Option_Checked = () => {};
const Option_Unchecked = () => {};

const checkBoxTwoStateVue = `<WinCheckBox v-model:IsChecked="twoStateChecked" AutomationProperties.Name="Two-state" @Checked="TwoState_Checked" @Unchecked="TwoState_Unchecked">
  <WinTextBlock Text="Two-state CheckBox" />
</WinCheckBox>`;
const checkBoxThreeStateVue = `<WinCheckBox v-model:IsChecked="threeStateChecked" AutomationProperties.Name="Three-state" IsThreeState @Checked="ThreeState_Checked" @Unchecked="ThreeState_Unchecked" @Indeterminate="ThreeState_Indeterminate">
  <WinTextBlock Text="Three-state CheckBox" />
</WinCheckBox>`;
const checkBoxSelectAllVue = `<div>
  <WinCheckBox :IsChecked="OptionsAllCheckBox" IsThreeState @Checked="SelectAll_Checked" @Unchecked="SelectAll_Unchecked" @Indeterminate="SelectAll_Indeterminate">
    <WinTextBlock Text="Select all" />
  </WinCheckBox>
  <WinCheckBox v-model:IsChecked="Option1CheckBox" Margin="24,0,0,0"><WinTextBlock Text="Option 1" /></WinCheckBox>
  <WinCheckBox v-model:IsChecked="Option2CheckBox" Margin="24,0,0,0"><WinTextBlock Text="Option 2" /></WinCheckBox>
  <WinCheckBox v-model:IsChecked="Option3CheckBox" Margin="24,0,0,0"><WinTextBlock Text="Option 3" /></WinCheckBox>
</div>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.vertical-stack { display: flex; flex-direction: column; gap: 8px; }
</style>
