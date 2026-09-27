<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.checkbox'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.checkbox-controls-let-the-user-select-a-combinat'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><FontIcon class="icon" Glyph="&#xe793;" /></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <FontIcon class="icon" Glyph="{x:Bind ButtonContent1, Mode=OneWay}" />
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
            <ControlExample class="basic-input-example-theme" SampleDefinition="CheckBox\CheckBoxTwoState.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind checkBoxTwoStateVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.checkbox.two-state'), Mode=OneWay}">
              <ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                  <CheckBox IsChecked="{x:Bind twoStateChecked, Mode=TwoWay}" AutomationProperties.Name="Two-state" Checked="TwoState_Checked" Unchecked="TwoState_Unchecked">
                    <TextBlock Text="{x:Bind $t('sample.checkbox.two-state-content'), Mode=OneWay}" />
                  </CheckBox>
                </StackPanel>
              </ControlExample.Example>
              <ControlExample.Output>
                <TextBlock AutomationProperties.AutomationId="Control1Output" Text="{x:Bind TwoStateOutput, Mode=OneWay}" />
              </ControlExample.Output>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="CheckBox\CheckBoxThreeState.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind checkBoxThreeStateVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.checkbox.three-state'), Mode=OneWay}">
              <ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                  <CheckBox IsChecked="{x:Bind threeStateChecked, Mode=TwoWay}" AutomationProperties.Name="Three-state" IsThreeState Checked="ThreeState_Checked" Unchecked="ThreeState_Unchecked" Indeterminate="ThreeState_Indeterminate">
                    <TextBlock Text="{x:Bind $t('sample.checkbox.three-state-content'), Mode=OneWay}" />
                  </CheckBox>
                </StackPanel>
              </ControlExample.Example>
              <ControlExample.Output>
                <TextBlock AutomationProperties.AutomationId="Control2Output" Text="{x:Bind ThreeStateOutput, Mode=OneWay}" />
              </ControlExample.Output>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="CheckBox\CheckBoxSelectAll.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind checkBoxSelectAllVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.checkbox.select-all'), Mode=OneWay}">
              <ControlExample.Example>
                <StackPanel>
                  <CheckBox IsChecked="{x:Bind OptionsAllCheckBox, Mode=OneWay}" IsThreeState Checked="SelectAll_Checked" Unchecked="SelectAll_Unchecked" Indeterminate="SelectAll_Indeterminate">
                    <TextBlock Text="{x:Bind $t('sample.select-all'), Mode=OneWay}" />
                  </CheckBox>
                  <CheckBox IsChecked="{x:Bind Option1CheckBox, Mode=TwoWay}" Margin="24,0,0,0" Checked="Option_Checked" Unchecked="Option_Unchecked">
                    <TextBlock Text="{x:Bind $t('text.option-1'), Mode=OneWay}" />
                  </CheckBox>
                  <CheckBox IsChecked="{x:Bind Option2CheckBox, Mode=TwoWay}" Margin="24,0,0,0" Checked="Option_Checked" Unchecked="Option_Unchecked">
                    <TextBlock Text="{x:Bind $t('text.option-2'), Mode=OneWay}" />
                  </CheckBox>
                  <CheckBox IsChecked="{x:Bind Option3CheckBox, Mode=TwoWay}" Margin="24,0,0,0" Checked="Option_Checked" Unchecked="Option_Unchecked">
                    <TextBlock Text="{x:Bind $t('text.option-3'), Mode=OneWay}" />
                  </CheckBox>
                </StackPanel>
              </ControlExample.Example>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import FontIcon from '../../components/FontIcon.vue';
import { computed as ButtonContentComputed, unref as ButtonContentUnref } from 'vue';
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import CheckBox from '../../components/CheckBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
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

const TwoState_Checked = (sender, _args) => { twoStateChecked.value = sender.IsChecked; TwoStateOutput.value = t('sample.checkbox.you-checked'); };
const TwoState_Unchecked = (sender, _args) => { twoStateChecked.value = sender.IsChecked; TwoStateOutput.value = t('sample.checkbox.you-unchecked'); };
const ThreeState_Checked = (sender, _args) => { threeStateChecked.value = sender.IsChecked; ThreeStateOutput.value = t('sample.checkbox.checked'); };
const ThreeState_Unchecked = (sender, _args) => { threeStateChecked.value = sender.IsChecked; ThreeStateOutput.value = t('sample.checkbox.unchecked'); };
const ThreeState_Indeterminate = (sender, _args) => { threeStateChecked.value = sender.IsChecked; ThreeStateOutput.value = t('sample.checkbox.indeterminate'); };
const SelectAll_Checked = (_sender, _args) => { Option1CheckBox.value = Option2CheckBox.value = Option3CheckBox.value = true; };
const SelectAll_Unchecked = (_sender, _args) => { Option1CheckBox.value = Option2CheckBox.value = Option3CheckBox.value = false; };
const SelectAll_Indeterminate = (_sender, _args) => {
  if (OptionsAllCheckBox.value === true) SelectAll_Unchecked();
};
const Option_Checked = (_sender, _args) => {};
const Option_Unchecked = (_sender, _args) => {};

const checkBoxTwoStateVue = `<CheckBox IsChecked="{x:Bind twoStateChecked, Mode=TwoWay}" AutomationProperties.Name="Two-state" Checked="TwoState_Checked" Unchecked="TwoState_Unchecked">
                  <TextBlock Text="{x:Bind $t('sample.checkbox.two-state-content'), Mode=OneWay}" />
</CheckBox>`;
const checkBoxThreeStateVue = `<CheckBox IsChecked="{x:Bind threeStateChecked, Mode=TwoWay}" AutomationProperties.Name="Three-state" IsThreeState Checked="ThreeState_Checked" Unchecked="ThreeState_Unchecked" Indeterminate="ThreeState_Indeterminate">
                  <TextBlock Text="{x:Bind $t('sample.checkbox.three-state-content'), Mode=OneWay}" />
</CheckBox>`;
const checkBoxSelectAllVue = `<StackPanel>
  <CheckBox IsChecked="{x:Bind OptionsAllCheckBox, Mode=OneWay}" IsThreeState Checked="SelectAll_Checked" Unchecked="SelectAll_Unchecked" Indeterminate="SelectAll_Indeterminate">
                  <TextBlock Text="{x:Bind $t('sample.select-all'), Mode=OneWay}" />
  </CheckBox>
                  <CheckBox IsChecked="{x:Bind Option1CheckBox, Mode=TwoWay}" Margin="24,0,0,0"><TextBlock Text="{x:Bind $t('text.option-1'), Mode=OneWay}" /></CheckBox>
                  <CheckBox IsChecked="{x:Bind Option2CheckBox, Mode=TwoWay}" Margin="24,0,0,0"><TextBlock Text="{x:Bind $t('text.option-2'), Mode=OneWay}" /></CheckBox>
                  <CheckBox IsChecked="{x:Bind Option3CheckBox, Mode=TwoWay}" Margin="24,0,0,0"><TextBlock Text="{x:Bind $t('text.option-3'), Mode=OneWay}" /></CheckBox>
</StackPanel>`;
const ButtonContent1 = ButtonContentComputed(() => ButtonContentUnref(isFavoriteState) ? '' : '');
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.vertical-stack { display: flex; flex-direction: column; gap: 8px; }
</style>
