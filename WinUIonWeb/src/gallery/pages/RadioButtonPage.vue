<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.radiobuttons'), Mode=OneWay}" />
          <TextBlock
            class="page-description"
            Text="{x:Bind $t('text.radiobutton-description'), Mode=OneWay}"
            TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon">&#xE793;</span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <StackPanel>
        <ControlExample
              class="basic-input-example-theme"
              SampleDefinition="RadioButton\RadioButtonGroup.txt"
              HeaderText="{x:Bind $t('sample.radiobutton.group'), Mode=OneWay}"
              Theme="{x:Bind pageTheme, Mode=OneWay}"
              Vue="{x:Bind radioButtonGroupVue, Mode=OneWay}">
              <StackPanel>
                <RadioButtons Header="{x:Bind $t('sample.options-colon'), Mode=OneWay}" SelectionChanged="onOptionSelectionChanged">
                  <RadioButton AutomationProperties.AutomationId="Option1RadioButton" Checked="RadioButton_Checked" Content="{x:Bind $t('text.option-1'), Mode=OneWay}" />
                  <RadioButton AutomationProperties.AutomationId="Option2RadioButton" Checked="RadioButton_Checked" Content="{x:Bind $t('text.option-2'), Mode=OneWay}" />
                  <RadioButton AutomationProperties.AutomationId="Option3RadioButton" Checked="RadioButton_Checked" Content="{x:Bind $t('text.option-3'), Mode=OneWay}" />
                </RadioButtons>
              </StackPanel>
              <ControlExample.Output>
                <TextBlock Text="{x:Bind control1Output, Mode=OneWay}" />
              </ControlExample.Output>
            </ControlExample>

            <ControlExample
              class="basic-input-example-theme"
              SampleDefinition="RadioButton\RadioButtonStrings.txt"
              HeaderText="{x:Bind $t('sample.radiobutton.strings'), Mode=OneWay}"
              Theme="{x:Bind pageTheme, Mode=OneWay}"
              Vue="{x:Bind radioButtonStringsVue, Mode=OneWay}">
              <StackPanel>
                <RadioButtons
                  Header="{x:Bind $t('sample.background'), Mode=OneWay}"
                  MaxColumns="3"
                  SelectedIndex="{x:Bind backgroundSelectedIndex, Mode=OneWay}"
                  SelectionChanged="BackgroundColor_SelectionChanged">
                  <x:String>Green</x:String>
                  <x:String>Yellow</x:String>
                  <x:String>White</x:String>
                </RadioButtons>
                <RadioButtons
                  Header="{x:Bind $t('sample.border'), Mode=OneWay}"
                  MaxColumns="3"
                  SelectedIndex="{x:Bind borderSelectedIndex, Mode=OneWay}"
                  SelectionChanged="BorderBrush_SelectionChanged">
                  <x:String>Green</x:String>
                  <x:String>Yellow</x:String>
                  <x:String>White</x:String>
                </RadioButtons>
                <Border
                  class="control-output"
                  Background="{x:Bind controlOutputBackground, Mode=OneWay}"
                  BorderBrush="{x:Bind controlOutputBorder, Mode=OneWay}"
                  BorderThickness="10" />
              </StackPanel>
            </ControlExample>
        </StackPanel>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import Border from '../../components/Border.vue';
import ControlExample from '../../components/ControlExample.vue';
import RadioButton from '../../components/RadioButton.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'radiobutton');

const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const { t } = useI18n();
const control1Output = ref(t('sample.select-an-option'));
const colorItems = ['Green', 'Yellow', 'White'];
const backgroundSelectedIndex = ref(0);
const borderSelectedIndex = ref(1);
const controlOutputBackground = ref('#008000');
// Keep the runtime style value as CSS while the XAML sample remains ARGB.
const controlOutputBorder = ref('#FFD700');

const colors = {
  Green: '#008000',
  Yellow: '#FFFF00',
  White: '#FFFFFF',
  Gold: '#FFD700',
  DarkGreen: '#006400'
};

const onOptionSelectionChanged = ({ SelectedIndex }) => {
  const option = t(`text.option-${SelectedIndex + 1}`);
  control1Output.value = t('sample.you-selected', { option });
};

const RadioButton_Checked = () => {};

const BackgroundColor_SelectionChanged = ({ SelectedIndex, SelectedItem }) => {
  backgroundSelectedIndex.value = SelectedIndex;
  controlOutputBackground.value = colors[SelectedItem] ?? colors.White;
};

const BorderBrush_SelectionChanged = ({ SelectedIndex, SelectedItem }) => {
  borderSelectedIndex.value = SelectedIndex;
  if (SelectedItem === 'Yellow') controlOutputBorder.value = colors.Gold;
  else if (SelectedItem === 'Green') controlOutputBorder.value = colors.DarkGreen;
  else controlOutputBorder.value = colors.White;
};

const radioButtonGroupVue = `<RadioButtons Header="{x:Bind $t('sample.options-colon'), Mode=OneWay}">
  <RadioButton Checked="RadioButton_Checked" Content="{x:Bind $t('text.option-1'), Mode=OneWay}" />
  <RadioButton Checked="RadioButton_Checked" Content="{x:Bind $t('text.option-2'), Mode=OneWay}" />
  <RadioButton Checked="RadioButton_Checked" Content="{x:Bind $t('text.option-3'), Mode=OneWay}" />
</RadioButtons>`;

const radioButtonStringsVue = `<StackPanel>
<RadioButtons Header="{x:Bind $t('sample.background'), Mode=OneWay}" MaxColumns="3" SelectedIndex="0">
  <x:String>Green</x:String>
  <x:String>Yellow</x:String>
  <x:String>White</x:String>
</RadioButtons>
<RadioButtons Header="{x:Bind $t('sample.border'), Mode=OneWay}" MaxColumns="3" SelectedIndex="1">
  <x:String>Green</x:String>
  <x:String>Yellow</x:String>
  <x:String>White</x:String>
</RadioButtons>

<Border
  Height="50"
  Margin="0,10"
  Background="#FFFFFFFF"
  BorderBrush="#FFFFD700"
  BorderThickness="10" />
</StackPanel>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.radio-stack { display: flex; flex-direction: column; gap: 12px; }
.control-output { height: 50px; margin: 10px 0; border-width: 10px; border-style: solid; box-sizing: border-box; }
</style>
