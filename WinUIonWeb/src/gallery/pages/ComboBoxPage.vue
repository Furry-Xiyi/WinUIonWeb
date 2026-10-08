<template>
  <Page xmlns:helper="using:WinUIGallery.Helpers">
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" AutomationProperties.Name="{x:Bind themeButtonName, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind themeButtonName, Mode=OneWay}" Click="toggleTheme">
              <FontIcon Glyph="&#xE793;" FontSize="16" />
            </Button>
            <ToggleButton class="header-action" AutomationProperties.Name="{x:Bind favoriteButtonName, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteButtonName, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite">
              <FontIcon Glyph="{x:Bind favoriteGlyph, Mode=OneWay}" FontSize="16" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample class="combobox-example" SampleDefinition="ComboBox\ComboBoxInline.txt" HeaderText="{x:Bind inlineHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind inlineXaml, Mode=OneWay}" CSharp="{x:Bind comboBoxCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="combobox-sample">
                <ComboBox
                  x:Name="Combo1"
                  Width="200"
                  Header="{x:Bind colorsHeader, Mode=OneWay}"
                  PlaceholderText="{x:Bind colorPlaceholder, Mode=OneWay}"
                  SelectionChanged="ColorComboBox_SelectionChanged">
                  <x:String x:Uid="text.blue" />
                  <x:String x:Uid="text.green" />
                  <x:String x:Uid="text.red" />
                  <x:String x:Uid="text.yellow" />
                </ComboBox>
                <Rectangle x:Name="Control1Output" Width="100" Height="30" Margin="0,8,0,0" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample class="combobox-example" SampleDefinition="ComboBox\ComboBoxItemsSource.txt" HeaderText="{x:Bind itemsSourceHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind itemsSourceXaml, Mode=OneWay}" CSharp="{x:Bind comboBoxCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="combobox-sample">
                <ComboBox
                  x:Name="Combo2"
                  MinWidth="200"
                  Header="{x:Bind fontHeader, Mode=OneWay}"
                  SelectedIndex="2"
                  ItemsSource="{x:Bind helper:FontHelper.Fonts}">
                  <ComboBox.ItemTemplate>
                    <DataTemplate x:DataType="helper:FontItem">
                      <TextBlock Text="{x:Bind Name}" />
                    </DataTemplate>
                  </ComboBox.ItemTemplate>
                </ComboBox>
                <TextBlock
                  x:Name="Control2Output"
                  FontFamily="{x:Bind ((helper:FontItem)Combo2.SelectedItem).Font, Mode=OneWay}"
                  Style="{StaticResource OutputTextBlockStyle}"
                  Text="{x:Bind fontOutputText, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample class="combobox-example" SampleDefinition="ComboBox\ComboBoxEditable.txt" HeaderText="{x:Bind editableHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind editableXaml, Mode=OneWay}" CSharp="{x:Bind comboBoxCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="combobox-sample">
                <ComboBox
                  x:Name="Combo3"
                  Width="200"
                  Header="{x:Bind fontSizeHeader, Mode=OneWay}"
                  IsEditable="True"
                  ItemsSource="{x:Bind FontSizes}"
                  Loaded="Combo3_Loaded"
                  TextSubmitted="Combo3_TextSubmitted" />
                <TextBlock
                  x:Name="Control3Output"
                  FontFamily="Segoe UI"
                  FontSize="{x:Bind (x:Double)Combo3.SelectedValue, Mode=OneWay}"
                  Style="{StaticResource OutputTextBlockStyle}"
                  Text="{x:Bind fontSizeOutputText, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ContentDialog
            Loaded="InvalidFontSizeDialog_Loaded"
            RequestedTheme="{x:Bind pageTheme, Mode=OneWay}"
            Content="{x:Bind invalidFontSizeMessage, Mode=OneWay}"
            CloseButtonText="{x:Bind closeDialogLabel, Mode=OneWay}"
            DefaultButton="Close" />
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import ComboBox from '../../components/ComboBox.vue'
import { XamlString } from '../../components/inlineControlProperties'
import ContentDialog from '../../components/ContentDialog.vue'
import ControlExample from '../../components/ControlExample.vue'
import FontIcon from '../../components/FontIcon.vue'
import Page from '../../components/Page.vue'
import Rectangle from '../../components/Rectangle.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import inlineSample from '../samples/ComboBox/ComboBoxInline.txt?raw'
import itemsSourceSample from '../samples/ComboBox/ComboBoxItemsSource.txt?raw'
import editableSample from '../samples/ComboBox/ComboBoxEditable.txt?raw'
import comboBoxCSharp from '../samples/ComboBox/ComboBoxPage.xaml.cs?raw'

defineOptions({ components: { 'x:String': XamlString } })

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage && currentPage.value ? currentPage.value : 'combobox')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const namescope = shallowReactive({})
provide(xamlNameScopeKey, namescope)

const pageTitle = computed(() => t('text.combobox'))
const pageDescription = computed(() => t('text.use-a-combobox-also-known-as-a-drop-down-list-to'))
const themeButtonName = computed(() => t('gallery.page-header.toggle-theme'))
const favoriteButtonName = computed(() => t('gallery.page-header.favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const inlineHeader = computed(() => t('sample.combobox.inline'))
const itemsSourceHeader = computed(() => t('sample.combobox.itemssource'))
const editableHeader = computed(() => t('sample.combobox.editable'))
const colorsHeader = computed(() => t('text.colors'))
const colorPlaceholder = computed(() => t('sample.combobox.pick-a-color'))
const fontHeader = computed(() => t('sample.combobox.font'))
const fontSizeHeader = computed(() => t('sample.combobox.font-size'))
const fontOutputText = computed(() => t('sample.combobox.font-text'))
const fontSizeOutputText = computed(() => t('sample.combobox.font-size-text'))
const invalidFontSizeMessage = computed(() => t('sample.combobox.invalid-font-size'))
const closeDialogLabel = computed(() => t('sample.combobox.close'))

// Keep the official FontItem collection stable while resource names update.
// A language change updates each item name without replacing the selection.
const FontItem = (resourceKey, family) => shallowReactive({
  get Name() { return t(resourceKey) },
  Font: family
})
const helper = {
  FontHelper: {
    Fonts: [
      FontItem('text.arial', 'Arial'),
      FontItem('text.comic-sans-ms', 'Comic Sans MS'),
      FontItem('text.courier-new', 'Courier New'),
      FontItem('text.segoe-ui', 'Segoe UI'),
      FontItem('text.times-new-roman', 'Times New Roman')
    ]
  }
}
const FontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72]

const ColorComboBox_SelectionChanged = (sender, args) => {
  if (!args.AddedItems || !args.AddedItems.length) return
  const colorName = String(args.AddedItems[0])
  const color = [
    ['text.blue', 'Blue'],
    ['text.green', 'Green'],
    ['text.red', 'Red'],
    ['text.yellow', 'Yellow']
  ].find(([resourceKey, value]) => colorName === t(resourceKey) || colorName === value)
  if (color && namescope.Control1Output) namescope.Control1Output.Fill = color[1]
}

const Combo3_Loaded = (sender) => { sender.SelectedIndex = 2 }
let invalidFontSizeDialog
let invalidFontSizeDialogTask
const InvalidFontSizeDialog_Loaded = (sender) => { invalidFontSizeDialog = sender }

const Combo3_TextSubmitted = (sender, args) => {
  const text = String(sender.Text).trim()
  const isDouble = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(text)
  const value = isDouble ? Number(text) : NaN
  if (Number.isFinite(value) && (FontSizes.includes(value) || (value < 100 && value > 8))) {
    sender.SelectedItem = value
  } else {
    sender.Text = String(sender.SelectedValue)
    if (invalidFontSizeDialog && !invalidFontSizeDialogTask) {
      invalidFontSizeDialogTask = invalidFontSizeDialog.ShowAsync().finally(() => {
        invalidFontSizeDialogTask = undefined
      })
    }
  }
  args.Handled = true
}

const sampleXaml = (sample) => {
  const sections = sample.split(/--- xaml\s*\r?\n/)
  return sections.length > 1 ? sections[1].trim() : ''
}
const inlineXaml = sampleXaml(inlineSample)
const itemsSourceXaml = sampleXaml(itemsSourceSample)
const editableXaml = sampleXaml(editableSample)
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
.combobox-sample { min-width: 0; max-width: 100%; }
.combobox-sample :deep(.OutputTextBlockStyle) { max-width: 100%; overflow-wrap: anywhere; }
</style>
