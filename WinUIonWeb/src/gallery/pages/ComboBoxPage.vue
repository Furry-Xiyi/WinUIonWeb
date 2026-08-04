<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.combobox')" />
          <WinTextBlock class="page-description" :Text="$t('text.use-a-combobox-also-known-as-a-drop-down-list-to')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="comboBoxInlineVue" :headerText="$t('sample.combobox.inline')">
              <template #example>
                <div class="vertical-stack">
                  <WinComboBox
                    Width="200"
                    :Header="$t('text.colors')"
                    :PlaceholderText="$t('sample.combobox.pick-a-color')"
                    :ItemsSource="colors"
                    @SelectionChanged="ColorComboBox_SelectionChanged" />
                  <div class="color-output" :style="{ backgroundColor: selectedColor }"></div>
                </div>
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="comboBoxItemsSourceVue" :headerText="$t('sample.combobox.itemssource')">
              <template #example>
                <div class="vertical-stack">
                  <WinComboBox
                    v-model:SelectedIndex="Combo2"
                    MinWidth="200"
                    :Header="$t('sample.combobox.font')"
                    :ItemsSource="fonts"
                    DisplayMemberPath="Name" />
                  <WinTextBlock class="output-text" :FontFamily="fonts[Combo2]?.Font" :Text="$t('sample.combobox.font-text')" />
                </div>
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="comboBoxEditableVue" :headerText="$t('sample.combobox.editable')">
              <template #example>
                <div class="vertical-stack">
                  <WinComboBox
                    v-model:SelectedItem="Combo3SelectedItem"
                    v-model:Text="Combo3Text"
                    Width="200"
                    :Header="$t('sample.combobox.font-size')"
                    IsEditable
                    :ItemsSource="FontSizes"
                    @TextSubmitted="Combo3_TextSubmitted" />
                  <WinTextBlock class="output-text" FontFamily="Segoe UI" :FontSize="Combo3SelectedItem" :Text="$t('sample.combobox.font-size-text')" />
                </div>
              </template>
            </WinControlExample>

            <WinContentDialog
              v-model:IsOpen="showInvalidFontSizeDialog"
              :Theme="pageTheme"
              Content="The font size must be a number between 8 and 100."
              CloseButtonText="Close"
              DefaultButton="Close">
              <WinTextBlock Text="The font size must be a number between 8 and 100." TextWrapping="WrapWholeWords" />
            </WinContentDialog>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinContentDialog from '../../components/WinContentDialog.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'combobox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const colors = ['Blue', 'Green', 'Red', 'Yellow'];
const fonts = [
  { Name: 'Arial', Font: 'Arial' },
  { Name: 'Comic Sans MS', Font: 'Comic Sans MS' },
  { Name: 'Courier New', Font: 'Courier New' },
  { Name: 'Segoe UI', Font: 'Segoe UI' },
  { Name: 'Times New Roman', Font: 'Times New Roman' }
];
const FontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72];

const Combo2 = ref(2);
const Combo3SelectedItem = ref(FontSizes[2]);
const Combo3Text = ref(String(Combo3SelectedItem.value));
const selectedColor = ref('transparent');
const showInvalidFontSizeDialog = ref(false);

const ColorComboBox_SelectionChanged = ({ AddedItems }) => {
  const colorName = AddedItems[0];
  switch (colorName) {
    case 'Yellow':
      selectedColor.value = 'Yellow';
      break;
    case 'Green':
      selectedColor.value = 'Green';
      break;
    case 'Blue':
      selectedColor.value = 'Blue';
      break;
    case 'Red':
      selectedColor.value = 'Red';
      break;
    default:
      throw new Error(`Invalid argument: ${colorName}`);
  }
};

const Combo3_TextSubmitted = (args) => {
  const value = Number(args.Text);
  const isDouble = Number.isFinite(value);

  if (isDouble && (FontSizes.includes(value) || (value < 100 && value > 8))) {
    Combo3SelectedItem.value = value;
    Combo3Text.value = String(value);
  } else {
    Combo3Text.value = String(Combo3SelectedItem.value);
    showInvalidFontSizeDialog.value = true;
  }

  args.Handled = true;
};

const comboBoxInlineVue = `<WinComboBox
  Width="200"
  Header="Colors"
  PlaceholderText="Pick a color"
  :ItemsSource="['Blue', 'Green', 'Red', 'Yellow']"
  @SelectionChanged="ColorComboBox_SelectionChanged" />`;
const comboBoxItemsSourceVue = `<WinComboBox
  MinWidth="200"
  Header="Font"
  :SelectedIndex="2"
  :ItemsSource="fonts"
  DisplayMemberPath="Name" />`;
const comboBoxEditableVue = `<WinComboBox
  v-model:SelectedItem="selectedFontSize"
  v-model:Text="fontSizeText"
  Width="200"
  Header="Font Size"
  IsEditable
  :ItemsSource="FontSizes"
  @TextSubmitted="Combo3_TextSubmitted" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.vertical-stack { display: flex; flex-direction: column; align-items: flex-start; }
.color-output { width: 100px; height: 30px; margin-top: 8px; }
.output-text { margin: 8px 0 0 8px; }
</style>
