<template>
  <Page>
    <Page.Resources>
      <DataTemplate x:Key="ImageTemplate" x:DataType="local:CustomDataObject">
        <ItemContainer Width="200" Height="140" HorizontalAlignment="Left" AutomationProperties.Name="{x:Bind Title}">
          <Image Margin="4" HorizontalAlignment="Center" VerticalAlignment="Center" AutomationProperties.AccessibilityView="Raw" Source="{x:Bind ImageLocation}" Stretch="UniformToFill" />
        </ItemContainer>
      </DataTemplate>
      <DataTemplate x:Key="LinedFlowLayoutItemTemplate" x:DataType="local:CustomDataObject">
        <ItemContainer AutomationProperties.Name="{x:Bind Title}">
          <Grid>
            <Image MinWidth="70" HorizontalAlignment="Center" VerticalAlignment="Center" Source="{x:Bind ImageLocation}" Stretch="UniformToFill" />
            <StackPanel Height="40" Padding="5,1,5,1" VerticalAlignment="Bottom" Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}" Opacity=".75" Orientation="Vertical">
              <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Title}" />
              <StackPanel Orientation="Horizontal">
                <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Likes}" />
                <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind LikesLabel}" />
              </StackPanel>
            </StackPanel>
          </Grid>
        </ItemContainer>
      </DataTemplate>
      <DataTemplate x:Key="StackLayoutItemTemplate" x:DataType="local:CustomDataObject">
        <ItemContainer AutomationProperties.Name="{x:Bind Title}">
          <RelativePanel Width="480" MinHeight="80" MaxHeight="100">
            <Image x:Name="image" Width="24" Height="16" Margin="0,4,0,0" HorizontalAlignment="Center" VerticalAlignment="Center" RelativePanel.AlignLeftWithPanel="True" RelativePanel.AlignTopWithPanel="True" Source="{x:Bind ImageLocation}" Stretch="UniformToFill" />
            <TextBlock x:Name="title" Margin="8,0,0,0" RelativePanel.AlignTopWithPanel="True" RelativePanel.RightOf="image" Style="{StaticResource BaseTextBlockStyle}" Text="{x:Bind Title}" />
            <TextBlock Margin="0,4,8,4" RelativePanel.Below="title" Style="{StaticResource CaptionTextBlockStyle}" Text="{x:Bind Description}" TextTrimming="WordEllipsis" TextWrapping="Wrap" />
          </RelativePanel>
        </ItemContainer>
      </DataTemplate>
      <DataTemplate x:Key="UniformGridLayoutItemTemplate" x:DataType="local:CustomDataObject">
        <ItemContainer AutomationProperties.Name="{x:Bind Title}">
          <Grid Width="150">
            <Image HorizontalAlignment="Center" VerticalAlignment="Center" Source="{x:Bind ImageLocation}" Stretch="UniformToFill" />
            <StackPanel Height="40" Padding="5,1,5,1" VerticalAlignment="Bottom" Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}" Opacity=".75" Orientation="Vertical">
              <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Title}" />
              <StackPanel Orientation="Horizontal">
                <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Likes}" />
                <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind LikesLabel}" />
              </StackPanel>
            </StackPanel>
          </Grid>
        </ItemContainer>
      </DataTemplate>
    </Page.Resources>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample HeaderText="{x:Bind basicHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind basicXaml, Mode=OneWay}" CSharp="{x:Bind basicCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel>
                <TextBlock Margin="0,0,0,15" Text="{x:Bind basicNote, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <ItemsView Width="220" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind items, Mode=OneWay}" IsItemInvokedEnabled="True" ItemInvoked="BasicItemsView_ItemInvoked" ItemTemplate="{StaticResource ImageTemplate}" />
                <TextBlock Text="{x:Bind basicInvokeOutput, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample class="itemsview-layouts-example" HeaderText="{x:Bind layoutsHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind layoutsXaml, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel>
                <TextBlock Margin="0,0,0,15" Text="{x:Bind layoutsNote, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <ItemsView Width="500" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind items, Mode=OneWay}" ItemTemplate="{x:Bind selectedTemplate, Mode=OneWay}" Layout="{x:Bind selectedLayout, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel MinWidth="300">
                <RadioButtons FontWeight="SemiBold" Header="{x:Bind layoutLabel, Mode=OneWay}" SelectedIndex="{x:Bind layoutSelectedIndex, Mode=TwoWay}" SelectionChanged="RbLayout_Checked">
                  <RadioButton Content="{x:Bind layoutLinedFlow, Mode=OneWay}" FontWeight="Normal" GroupName="ItemsViewLayouts" IsChecked="True" />
                  <RadioButton Content="{x:Bind layoutUniformGrid, Mode=OneWay}" FontWeight="Normal" GroupName="ItemsViewLayouts" />
                  <RadioButton Content="{x:Bind layoutStack, Mode=OneWay}" FontWeight="Normal" GroupName="ItemsViewLayouts" />
                </RadioButtons>
                <StackPanel Visibility="{x:Bind linedFlowVisibility, Mode=OneWay}" MinHeight="300">
                  <TextBlock Margin="0,15,0,10" FontWeight="SemiBold" Text="{x:Bind linedFlowSettingsLabel, Mode=OneWay}" />
                  <NumberBox AutomationProperties.Name="{x:Bind spaceBetweenLinesLabel, Mode=OneWay}" Header="{x:Bind spaceBetweenLinesLabel, Mode=OneWay}" Maximum="100" Minimum="0" SpinButtonPlacementMode="Inline" SmallChange="1" HorizontalAlignment="Stretch" MaxWidth="250" Margin="0,0,0,16" Value="{x:Bind lineSpacing, Mode=TwoWay}" ValueChanged="NbLinedFlowLayoutOptions_ValueChanged" />
                  <NumberBox AutomationProperties.Name="{x:Bind minItemSpacingLabel, Mode=OneWay}" Header="{x:Bind minItemSpacingLabel, Mode=OneWay}" Maximum="100" Minimum="0" SpinButtonPlacementMode="Inline" SmallChange="1" HorizontalAlignment="Stretch" MaxWidth="250" Margin="0,0,0,16" Value="{x:Bind minItemSpacing, Mode=TwoWay}" ValueChanged="NbLinedFlowLayoutOptions_ValueChanged" />
                  <RadioButtons Header="{x:Bind lineHeightLabel, Mode=OneWay}" SelectedIndex="{x:Bind lineHeightSelectedIndex, Mode=TwoWay}" SelectionChanged="RbLineHeight_Checked">
                    <RadioButton Content="{x:Bind smallLabel, Mode=OneWay}" FontWeight="Normal" GroupName="LinedFlowLayoutLineHeights" />
                    <RadioButton Content="{x:Bind largeLabel, Mode=OneWay}" FontWeight="Normal" GroupName="LinedFlowLayoutLineHeights" IsChecked="True" />
                  </RadioButtons>
                </StackPanel>
                <StackPanel Visibility="{x:Bind stackVisibility, Mode=OneWay}" MinHeight="300">
                  <TextBlock Margin="0,15,0,10" FontWeight="SemiBold" Text="{x:Bind stackSettingsLabel, Mode=OneWay}" />
                  <NumberBox AutomationProperties.Name="{x:Bind spaceBetweenRowsLabel, Mode=OneWay}" Header="{x:Bind spaceBetweenRowsLabel, Mode=OneWay}" Maximum="100" Minimum="0" SpinButtonPlacementMode="Inline" SmallChange="1" HorizontalAlignment="Stretch" MaxWidth="250" Margin="0,0,0,16" Value="{x:Bind stackSpacing, Mode=TwoWay}" ValueChanged="NbStackLayoutOptions_ValueChanged" />
                </StackPanel>
                <StackPanel Visibility="{x:Bind uniformGridVisibility, Mode=OneWay}" MinHeight="300">
                  <TextBlock Margin="0,15,0,10" FontWeight="SemiBold" Text="{x:Bind uniformGridSettingsLabel, Mode=OneWay}" />
                  <NumberBox AutomationProperties.Name="{x:Bind minColumnSpacingLabel, Mode=OneWay}" Header="{x:Bind minColumnSpacingLabel, Mode=OneWay}" Maximum="100" Minimum="0" SpinButtonPlacementMode="Inline" SmallChange="1" HorizontalAlignment="Stretch" MaxWidth="250" Margin="0,0,0,16" Value="{x:Bind minColumnSpacing, Mode=TwoWay}" ValueChanged="NbUniformGridLayoutOptions_ValueChanged" />
                  <NumberBox AutomationProperties.Name="{x:Bind minRowSpacingLabel, Mode=OneWay}" Header="{x:Bind minRowSpacingLabel, Mode=OneWay}" Maximum="100" Minimum="0" SpinButtonPlacementMode="Inline" SmallChange="1" HorizontalAlignment="Stretch" MaxWidth="250" Margin="0,0,0,16" Value="{x:Bind minRowSpacing, Mode=TwoWay}" ValueChanged="NbUniformGridLayoutOptions_ValueChanged" />
                  <NumberBox AutomationProperties.Name="{x:Bind maxRowsOrColumnsLabel, Mode=OneWay}" Header="{x:Bind maxRowsOrColumnsLabel, Mode=OneWay}" Maximum="8" Minimum="1" SpinButtonPlacementMode="Inline" SmallChange="1" HorizontalAlignment="Stretch" MaxWidth="250" Margin="0,0,0,16" Value="{x:Bind maximumRowsOrColumns, Mode=TwoWay}" ValueChanged="NbUniformGridLayoutOptions_ValueChanged" />
                </StackPanel>
              </StackPanel>
            </ControlExample.Options>
          </ControlExample>

          <ControlExample HeaderText="{x:Bind selectionHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind selectionXaml, Mode=OneWay}" CSharp="{x:Bind selectionCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid>
                <Grid.RowDefinitions><RowDefinition Height="Auto" /><RowDefinition Height="*" /><RowDefinition Height="Auto" /></Grid.RowDefinitions>
                <RichTextBlock Margin="0,0,0,15" TextWrapping="Wrap">
                  <Paragraph><Run Text="{x:Bind selectionNoteIntro, Mode=OneWay}" /></Paragraph>
                  <Paragraph><Bold><Run Text="{x:Bind selectionNone, Mode=OneWay}" /></Bold><Run Text="{x:Bind selectionNoteNone, Mode=OneWay}" /></Paragraph>
                  <Paragraph><Bold><Run Text="{x:Bind selectionSingle, Mode=OneWay}" /></Bold><Run Text="{x:Bind selectionNoteSingle, Mode=OneWay}" /></Paragraph>
                  <Paragraph><Bold><Run Text="{x:Bind selectionMultiple, Mode=OneWay}" /></Bold><Run Text="{x:Bind selectionNoteMultiple, Mode=OneWay}" /></Paragraph>
                  <Paragraph><Bold><Run Text="{x:Bind selectionExtended, Mode=OneWay}" /></Bold><Run Text="{x:Bind selectionNoteExtended, Mode=OneWay}" /></Paragraph>
                </RichTextBlock>
                <ItemsView Grid.Row="1" Width="500" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind items, Mode=OneWay}" SelectionMode="{x:Bind selectionMode, Mode=OneWay}" IsItemInvokedEnabled="{x:Bind isItemInvokedEnabled, Mode=OneWay}" ItemInvoked="SwappableSelectionModesItemsView_ItemInvoked" ItemTemplate="{StaticResource UniformGridLayoutItemTemplate}" SelectionChanged="SwappableSelectionModesItemsView_SelectionChanged">
                  <ItemsView.Layout><UniformGridLayout MaximumRowsOrColumns="3" MinColumnSpacing="5" MinRowSpacing="5" /></ItemsView.Layout>
                </ItemsView>
                <StackPanel Grid.Row="2">
                  <TextBlock Text="{x:Bind invocationOutput, Mode=OneWay}" />
                  <TextBlock Text="{x:Bind selectionOutput, Mode=OneWay}" />
                </StackPanel>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <Grid MinWidth="200" ColumnSpacing="10">
                <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
                <Grid.RowDefinitions><RowDefinition Height="Auto" /><RowDefinition Height="Auto" /></Grid.RowDefinitions>
                <TextBlock Margin="0,0,10,0" VerticalAlignment="Center" Text="{x:Bind selectionModeLabel, Mode=OneWay}" />
                <ComboBox Grid.Column="1" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind selectionModeLabel, Mode=OneWay}" ItemsSource="{x:Bind selectionModeOptions, Mode=OneWay}" DisplayMemberPath="Text" SelectedIndex="{x:Bind selectionModeSelectedIndex, Mode=TwoWay}" SelectionChanged="CmbSelectionMode_SelectionChanged" />
                <TextBlock Grid.Row="1" Margin="0,0,10,0" VerticalAlignment="Center" Text="{x:Bind isItemInvokedEnabledLabel, Mode=OneWay}" />
                <CheckBox Grid.Row="1" Grid.Column="1" AutomationProperties.Name="{x:Bind isItemInvokedEnabledLabel, Mode=OneWay}" IsChecked="{x:Bind isItemInvokedEnabled, Mode=TwoWay}" />
              </Grid>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="SelectionMode" Value="{x:Bind selectionMode, Mode=OneWay}" />
              <ControlExampleSubstitution Key="IsItemInvokedEnabled" Value="{x:Bind isItemInvokedEnabledSource, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue'
import Button from '../../components/Button.vue'
import CheckBox from '../../components/CheckBox.vue'
import ComboBox from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import Grid from '../../components/Grid.vue'
import ColumnDefinition from '../../components/ColumnDefinition.vue'
import RowDefinition from '../../components/RowDefinition.vue'
import Image from '../../components/Image.vue'
import ItemContainer from '../../components/ItemContainer.vue'
import ItemsView from '../../components/ItemsView.vue'
import NumberBox from '../../components/NumberBox.vue'
import Page from '../../components/Page.vue'
import RadioButton from '../../components/RadioButton.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import RelativePanel from '../../components/RelativePanel.vue'
import RichTextBlock from '../../components/RichTextBlock.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { Bold, Paragraph, Run } from '../../components/TextInline'
import { createPageState } from '../../utils/pageState'
import { useI18n } from '../../components/i18n/index'
import basicSampleDefinition from '../samples/ItemsView/BasicItemsview.txt?raw'
import layoutsSampleDefinition from '../samples/ItemsView/ItemsviewSwappableLayouts.txt?raw'
import selectionSampleDefinition from '../samples/ItemsView/ItemsviewItemInvocationSelection.txt?raw'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'itemsview')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '' : '')

const pageTitle = t('text.itemsview')
const pageDescription = t('text.itemsview-description')
const basicHeader = t('sample.itemsview.basic')
const basicNote = t('sample.itemsview.basic-note')
const layoutsHeader = t('sample.itemsview.swappable-layouts')
const layoutsNote = t('sample.itemsview.layout-note')
const selectionHeader = t('sample.itemsview.item-invocation-selection')
const layoutLabel = t('sample.layout')
const layoutLinedFlow = t('sample.itemsview.layout-linedflow')
const layoutUniformGrid = t('sample.itemsview.layout-uniformgrid')
const layoutStack = t('sample.itemsview.layout-stack')
const linedFlowSettingsLabel = t('sample.itemsview.linedflow-settings')
const stackSettingsLabel = t('sample.itemsview.stack-settings')
const uniformGridSettingsLabel = t('sample.itemsview.uniformgrid-settings')
const spaceBetweenLinesLabel = t('sample.space-between-lines')
const spaceBetweenRowsLabel = t('sample.space-between-rows')
const minItemSpacingLabel = t('sample.minimum-space-between-items-on-line')
const minColumnSpacingLabel = t('sample.minimum-space-between-columns')
const minRowSpacingLabel = t('sample.minimum-space-between-rows')
const maxRowsOrColumnsLabel = t('sample.maximum-items-per-row-before-wrapping')
const lineHeightLabel = t('sample.line-height')
const smallLabel = t('sample.small')
const largeLabel = t('sample.large')
const selectionModeLabel = t('sample.selection-mode')
const isItemInvokedEnabledLabel = t('sample.is-item-invoked-enabled')
const selectionNoteIntro = t('sample.itemsview.selection-note-1')
const selectionNone = t('sample.selection-none')
const selectionSingle = t('sample.selection-single')
const selectionMultiple = t('sample.selection-multiple')
const selectionExtended = t('sample.selection-extended')
const selectionNoteNone = t('sample.listview.selection-none-description')
const selectionNoteSingle = t('sample.itemsview.selection-single-description')
const selectionNoteMultiple = t('sample.itemsview.selection-multiple-description')
const selectionNoteExtended = t('sample.listview.selection-extended-description')

// CustomDataObject.GetDataObjects(includeAllItems: true) supplies 13 items whose
// ImageLocation points at the Gallery's LandscapeImage assets.
const mediaBase = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia'
const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id facilisis lectus. Cras nec convallis ante, quis pulvinar tellus. Integer dictum accumsan pulvinar. Pellentesque eget enim sodales sapien vestibulum consequat.',
  'Nullam eget mattis metus. Donec pharetra, tellus in mattis tincidunt, magna ipsum gravida nibh, vitae lobortis ante odio vel quam.',
  'Quisque accumsan pretium ligula in faucibus. Mauris sollicitudin augue vitae lorem cursus condimentum quis ac mauris. Pellentesque quis turpis non nunc pretium sagittis. Nulla facilisi. Maecenas eu lectus ante. Proin eleifend vel lectus non tincidunt. Fusce condimentum luctus nisi, in elementum ante tincidunt nec.',
  'Aenean in nisl at elit venenatis blandit ut vitae lectus. Praesent in sollicitudin nunc. Pellentesque justo augue, pretium at sem lacinia, scelerisque semper erat. Ut cursus tortor at metus lacinia dapibus.',
  'Ut consequat magna luctus justo egestas vehicula. Integer pharetra risus libero, et posuere justo mattis et.',
  'Proin malesuada, libero vitae aliquam venenatis, diam est faucibus felis, vitae efficitur erat nunc non mauris. Suspendisse at sodales erat.',
  'Aenean vulputate, turpis non tincidunt ornare, metus est sagittis erat, id lobortis orci odio eget quam. Suspendisse ex purus, lobortis quis suscipit a, volutpat vitae turpis.',
  'Duis facilisis, quam ut laoreet commodo, elit ex aliquet massa, non varius tellus lectus et nunc. Donec vitae risus ut ante pretium semper. Phasellus consectetur volutpat orci, eu dapibus turpis. Fusce varius sapien eu mattis pharetra.'
]
const likesLabel = t('sample.likes-suffix')
const items = Array.from({ length: 13 }, (_, index) => ({
  Title: t('sample.itemsview.item-title', { number: index + 1 }),
  ImageLocation: `${mediaBase}/LandscapeImage${index + 1}.jpg`,
  Views: String(100 + ((index * 37) % 899)),
  Likes: String(10 + ((index * 11) % 89)),
  LikesLabel: likesLabel,
  Description: descriptions[index % descriptions.length]
}))

const basicInvokeOutput = ref('')
const BasicItemsView_ItemInvoked = (_sender, { InvokedItem }) => {
  basicInvokeOutput.value = t('sample.itemsview.invoked-output', { item: InvokedItem?.Title ?? '' })
}

// Example 2 — swappable layouts. Each layout keeps its own instance so the
// option controls mutate the live layout the ItemsView is using.
const layoutKeys = ['LinedFlowLayout', 'UniformGridLayout', 'StackLayout']
const layoutSelectedIndex = ref(0)
const linedFlowVisibility = computed(() => layoutSelectedIndex.value === 0 ? 'Visible' : 'Collapsed')
const stackVisibility = computed(() => layoutSelectedIndex.value === 2 ? 'Visible' : 'Collapsed')
const uniformGridVisibility = computed(() => layoutSelectedIndex.value === 1 ? 'Visible' : 'Collapsed')
const lineSpacing = ref(5)
const minItemSpacing = ref(5)
const lineHeightSelectedIndex = ref(1)
const lineHeight = computed(() => lineHeightSelectedIndex.value === 0 ? 80 : 160)
const stackSpacing = ref(5)
const minColumnSpacing = ref(5)
const minRowSpacing = ref(5)
const maximumRowsOrColumns = ref(3)

// The option pane owns one live layout object per layout kind; the ItemsView's
// Layout binding follows the selected radio button, exactly as
// RbLayout_Checked reassigns SwappableLayoutsItemsView.Layout.
const linedFlowLayout = computed(() => ({ Type: 'LinedFlowLayout', ItemsStretch: 'Fill', LineHeight: lineHeight.value, LineSpacing: lineSpacing.value, MinItemSpacing: minItemSpacing.value }))
const uniformGridLayout = computed(() => ({ Type: 'UniformGridLayout', MinRowSpacing: minRowSpacing.value, MinColumnSpacing: minColumnSpacing.value, MaximumRowsOrColumns: maximumRowsOrColumns.value }))
const stackLayout = computed(() => ({ Type: 'StackLayout', Spacing: stackSpacing.value }))
const selectedLayout = computed(() => [linedFlowLayout.value, uniformGridLayout.value, stackLayout.value][layoutSelectedIndex.value])
const layoutTemplates = ['LinedFlowLayoutItemTemplate', 'UniformGridLayoutItemTemplate', 'StackLayoutItemTemplate']
const selectedTemplate = computed(() => layoutTemplates[layoutSelectedIndex.value] ?? layoutTemplates[0])

const RbLayout_Checked = (args) => {
  const index = Number(args?.SelectedIndex)
  if (Number.isInteger(index) && index >= 0 && index < layoutKeys.length) layoutSelectedIndex.value = index
}
const RbLineHeight_Checked = (args) => {
  const index = Number(args?.SelectedIndex)
  if (Number.isInteger(index) && index >= 0) lineHeightSelectedIndex.value = index
}
// The three NumberBox option groups all mutate the layout the ItemsView holds.
// ItemsView reads them from the x:Bind sources, so the option pane only has to
// keep those refs current.
const numberValue = (args) => Number(args?.NewValue ?? args?.Value)
const NbLinedFlowLayoutOptions_ValueChanged = () => {}
const NbStackLayoutOptions_ValueChanged = () => {}
const NbUniformGridLayoutOptions_ValueChanged = () => {}

const sourcePart = (definition, section) => definition
  .split(new RegExp(`^--- ${section}\\s*$`, 'm'))[1]?.split(/^--- /m)[0].trim() ?? ''
const basicXaml = sourcePart(basicSampleDefinition, 'xaml')
const basicCSharp = sourcePart(basicSampleDefinition, 'c#')
const layoutsXaml = sourcePart(layoutsSampleDefinition, 'xaml')
const selectionXaml = sourcePart(selectionSampleDefinition, 'xaml')
const selectionCSharp = sourcePart(selectionSampleDefinition, 'c#')

// Example 3 — item invocation and selection.
const selectionModes = ['None', 'Single', 'Multiple', 'Extended']
const selectionModeOptions = computed(() => [
  { Text: t('sample.selection-none'), Value: 'None' },
  { Text: t('sample.selection-single'), Value: 'Single' },
  { Text: t('sample.selection-multiple'), Value: 'Multiple' },
  { Text: t('sample.selection-extended'), Value: 'Extended' }
])
const selectionModeSelectedIndex = ref(2)
const selectionMode = computed(() => selectionModes[selectionModeSelectedIndex.value] ?? 'Multiple')
const isItemInvokedEnabled = ref(false)
const isItemInvokedEnabledSource = computed(() => isItemInvokedEnabled.value ? 'True' : 'False')
const invocationOutput = ref('')
const selectionOutput = ref('')
const SwappableSelectionModesItemsView_ItemInvoked = (_sender, { InvokedItem }) => {
  invocationOutput.value = t('sample.itemsview.invoked-output', { item: InvokedItem?.Title ?? '' })
}
const SwappableSelectionModesItemsView_SelectionChanged = (_sender, args) => {
  selectionOutput.value = t('sample.itemsview.selection-output', { count: (args?.SelectedItems ?? []).length })
}
// CmbSelectionMode_SelectionChanged and ChkIsItemInvokedEnabled_IsCheckedChanged
// both clear the invocation output in the official page.
const CmbSelectionMode_SelectionChanged = (sender) => {
  const index = Number(sender.SelectedIndex)
  if (Number.isInteger(index) && index >= 0 && index < selectionModes.length) selectionModeSelectedIndex.value = index
  invocationOutput.value = ''
}
watch(isItemInvokedEnabled, () => { invocationOutput.value = '' })
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }

.gallery-page-content :deep(.example-display .win-items-view) {
  max-width: 100%;
}

/* The swappable-layout option pane is fixed width, so the ItemsView must not
   let it participate in the example's measured width. */
.itemsview-layouts-example :deep(.example-display) {
  min-width: 0;
}

.itemsview-layouts-example :deep(.example-options) {
  min-width: 0;
  overflow: hidden;
}

@media (max-width: 739px) {
  .itemsview-layouts-example :deep(.example-display) {
    overflow-x: hidden;
  }
}
</style>
