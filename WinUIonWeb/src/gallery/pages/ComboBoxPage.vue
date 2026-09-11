<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.combobox'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.use-a-combobox-also-known-as-a-drop-down-list-to'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="ComboBox\ComboBoxInline.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind comboBoxInlineVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.combobox.inline'), Mode=OneWay}">
              <ControlExample.Example>
                <StackPanel>
                  <ComboBox
                    Width="200"
                    Header="{x:Bind $t('text.colors'), Mode=OneWay}"
                    PlaceholderText="{x:Bind $t('sample.combobox.pick-a-color'), Mode=OneWay}"
                    SelectionChanged="ColorComboBox_SelectionChanged">
                    <x:String>Blue</x:String>
                    <x:String>Green</x:String>
                    <x:String>Red</x:String>
                    <x:String>Yellow</x:String>
                  </ComboBox>
                  <Border class="color-output" Background="{x:Bind selectedColor, Mode=OneWay}" />
                </StackPanel>
              </ControlExample.Example>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="ComboBox\ComboBoxItemsSource.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind comboBoxItemsSourceVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.combobox.itemssource'), Mode=OneWay}">
              <ControlExample.Example>
                <StackPanel>
                  <ComboBox
                    SelectedIndex="{x:Bind Combo2, Mode=TwoWay}"
                    MinWidth="200"
                    Header="{x:Bind $t('sample.combobox.font'), Mode=OneWay}"
                    ItemsSource="{x:Bind fonts, Mode=OneWay}"
                    DisplayMemberPath="Name" />
                  <TextBlock class="output-text" FontFamily="{x:Bind fonts[Combo2]?.Font, Mode=OneWay}" Text="{x:Bind $t('sample.combobox.font-text'), Mode=OneWay}" />
                </StackPanel>
              </ControlExample.Example>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="ComboBox\ComboBoxEditable.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind comboBoxEditableVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.combobox.editable'), Mode=OneWay}">
              <ControlExample.Example>
                <StackPanel>
                  <ComboBox
                    SelectedItem="{x:Bind Combo3SelectedItem, Mode=TwoWay}"
                    Text="{x:Bind Combo3Text, Mode=TwoWay}"
                    Width="200"
                    Header="{x:Bind $t('sample.combobox.font-size'), Mode=OneWay}"
                    IsEditable="True"
                    ItemsSource="{x:Bind FontSizes, Mode=OneWay}"
                    TextSubmitted="Combo3_TextSubmitted" />
                  <TextBlock class="output-text" FontFamily="Segoe UI" FontSize="{x:Bind Combo3SelectedItem, Mode=OneWay}" Text="{x:Bind $t('sample.combobox.font-size-text'), Mode=OneWay}" />
                </StackPanel>
              </ControlExample.Example>
            </ControlExample>

            <ContentDialog
              IsOpen="{x:Bind showInvalidFontSizeDialog, Mode=TwoWay}"
              Theme="{x:Bind pageTheme, Mode=OneWay}"
              Content="{x:Bind $t('sample.combobox.invalid-font-size'), Mode=OneWay}"
              CloseButtonText="{x:Bind $t('sample.combobox.close'), Mode=OneWay}"
              DefaultButton="Close" />
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ComboBox from '../../components/ComboBox.vue';
import ContentDialog from '../../components/ContentDialog.vue';
import ControlExample from '../../components/ControlExample.vue';
import Border from '../../components/Border.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
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

const Combo3_TextSubmitted = (sender, args) => {
  const value = Number(sender.Text);
  const isDouble = Number.isFinite(value);

  if (isDouble && (FontSizes.includes(value) || (value < 100 && value > 8))) {
    sender.SelectedItem = value;
  } else {
    sender.Text = String(sender.SelectedValue);
    showInvalidFontSizeDialog.value = true;
  }

  args.Handled = true;
};

const comboBoxInlineVue = `<ComboBox
  Width="200"
  Header="{x:Bind $t('text.colors'), Mode=OneWay}"
  PlaceholderText="{x:Bind $t('sample.combobox.pick-a-color'), Mode=OneWay}"
  SelectionChanged="ColorComboBox_SelectionChanged">
  <x:String>Blue</x:String>
  <x:String>Green</x:String>
  <x:String>Red</x:String>
  <x:String>Yellow</x:String>
</ComboBox>`;
const comboBoxItemsSourceVue = `<ComboBox
  MinWidth="200"
  Header="{x:Bind $t('sample.combobox.font'), Mode=OneWay}"
  SelectedIndex="{x:Bind 2, Mode=OneWay}"
  ItemsSource="{x:Bind fonts, Mode=OneWay}"
  DisplayMemberPath="Name" />`;
const comboBoxEditableVue = `<ComboBox
  SelectedItem="{x:Bind selectedFontSize, Mode=TwoWay}"
  Text="{x:Bind fontSizeText, Mode=TwoWay}"
  Width="200"
  Header="{x:Bind $t('sample.combobox.font-size'), Mode=OneWay}"
  IsEditable="True"
  ItemsSource="{x:Bind FontSizes, Mode=OneWay}"
  TextSubmitted="Combo3_TextSubmitted" />`;
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
