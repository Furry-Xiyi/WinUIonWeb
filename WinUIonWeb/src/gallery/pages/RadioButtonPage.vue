<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.radiobuttons')" />
          <WinTextBlock
            class="page-description"
            :Text="$t('text.radiobutton-description')"
            TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.radiobutton.group')"
              :theme="pageTheme"
              :vue="radioButtonGroupVue">
              <template #example>
                <WinRadioButtons :Header="$t('sample.options-colon')" @SelectionChanged="onOptionSelectionChanged">
                  <WinRadioButton AutomationId="Option1RadioButton" :Content="$t('text.option-1')" />
                  <WinRadioButton AutomationId="Option2RadioButton" :Content="$t('text.option-2')" />
                  <WinRadioButton AutomationId="Option3RadioButton" :Content="$t('text.option-3')" />
                </WinRadioButtons>
              </template>
              <template #options>
                <WinTextBlock :Text="control1Output" />
              </template>
            </WinControlExample>

            <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.radiobutton.strings')"
              :theme="pageTheme"
              :vue="radioButtonStringsVue">
              <template #example>
                <div class="radio-stack">
                  <WinRadioButtons
                    :Header="$t('sample.background')"
                    MaxColumns="3"
                    :SelectedIndex="backgroundSelectedIndex"
                    :ItemsSource="colorItems"
                    @SelectionChanged="BackgroundColor_SelectionChanged" />
                  <WinRadioButtons
                    :Header="$t('sample.border')"
                    MaxColumns="3"
                    :SelectedIndex="borderSelectedIndex"
                    :ItemsSource="colorItems"
                    @SelectionChanged="BorderBrush_SelectionChanged" />
                  <div
                    class="control-output"
                    :style="{
                      backgroundColor: controlOutputBackground,
                      borderColor: controlOutputBorder
                    }" />
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
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinRadioButtons from '../../components/WinRadioButtons.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'radiobutton');

const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const control1Output = ref('Select an option.');
const colorItems = ['Green', 'Yellow', 'White'];
const backgroundSelectedIndex = ref(0);
const borderSelectedIndex = ref(1);
const controlOutputBackground = ref('#FFFFFFFF');
const controlOutputBorder = ref('#FFFFD700');

const colors = {
  Green: '#008000',
  Yellow: '#FFFF00',
  White: '#FFFFFF',
  Gold: '#FFD700',
  DarkGreen: '#006400'
};

const onOptionSelectionChanged = ({ SelectedIndex }) => {
  control1Output.value = `You selected Option ${SelectedIndex + 1}.`;
};

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

const radioButtonGroupVue = `<WinRadioButtons Header="Options:">
  <WinRadioButton Content="Option 1" />
  <WinRadioButton Content="Option 2" />
  <WinRadioButton Content="Option 3" />
</WinRadioButtons>`;

const radioButtonStringsVue = `<WinRadioButtons Header="Background" MaxColumns="3" :SelectedIndex="0" :ItemsSource="['Green', 'Yellow', 'White']" />
<WinRadioButtons Header="Border" MaxColumns="3" :SelectedIndex="1" :ItemsSource="['Green', 'Yellow', 'White']" />

<div
  style="height: 50px; margin: 10px 0; border: 10px solid #FFD700; background: #FFFFFF;" />`;
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
