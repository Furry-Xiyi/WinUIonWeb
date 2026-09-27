<template>
  <Page>
    <Page.Resources>
      <DataTemplate x:Key="ImageTemplate">
        <Image
          Width="190"
          Height="130"
          AutomationProperties.AccessibilityView="Raw"
          AutomationProperties.Name="{x:Bind Title}"
          Source="{x:Bind ImageLocation}"
          Stretch="UniformToFill" />
      </DataTemplate>
      <DataTemplate x:Key="IconTextTemplate">
        <RelativePanel Width="280" MinHeight="160" AutomationProperties.Name="{x:Bind Title}">
          <Image x:Name="image" Width="18" Margin="0,4,0,0" RelativePanel.AlignLeftWithPanel="True" RelativePanel.AlignTopWithPanel="True" Source="{x:Bind ImageLocation}" Stretch="Uniform" />
          <TextBlock x:Name="title" Margin="8,0,0,0" RelativePanel.AlignTopWithPanel="True" RelativePanel.RightOf="image" Style="{StaticResource BaseTextBlockStyle}" Text="{x:Bind Title}" />
          <TextBlock Margin="0,4,8,0" RelativePanel.Below="title" Style="{StaticResource CaptionTextBlockStyle}" Text="{x:Bind Description}" TextWrapping="Wrap" TextTrimming="WordEllipsis" />
        </RelativePanel>
      </DataTemplate>
      <DataTemplate x:Key="ImageTextTemplate">
        <Grid Width="280" AutomationProperties.Name="{x:Bind Title}">
          <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
          <Image Height="100" VerticalAlignment="Top" Source="{x:Bind ImageLocation}" Stretch="Fill" />
          <StackPanel Grid.Column="1" Margin="8,0,0,8">
            <TextBlock Margin="0,0,0,8" Style="{ThemeResource SubtitleTextBlockStyle}" Text="{x:Bind Title}" />
            <StackPanel Orientation="Horizontal"><TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Views}" /><TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind ViewsLabel}" /></StackPanel>
            <StackPanel Orientation="Horizontal"><TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Likes}" /><TextBlock Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind LikesLabel}" /></StackPanel>
          </StackPanel>
        </Grid>
      </DataTemplate>
      <DataTemplate x:Key="TextTemplate">
        <StackPanel Width="240" Orientation="Horizontal"><TextBlock Margin="8,0,0,0" Style="{StaticResource TitleTextBlockStyle}" Text="{x:Bind Title}" /></StackPanel>
      </DataTemplate>
      <DataTemplate x:Key="ImageOverlayTemplate">
        <Grid Width="100" Height="100" AutomationProperties.Name="{x:Bind Title}">
          <Image Width="100" Height="100" Source="{x:Bind ImageLocation}" Stretch="UniformToFill" />
          <StackPanel Height="40" Padding="5,1,5,1" VerticalAlignment="Bottom" Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}" Opacity=".75" Orientation="Vertical">
            <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Title}" />
            <StackPanel Orientation="Horizontal">
              <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Likes}" />
              <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind LikesLabel}" />
            </StackPanel>
          </StackPanel>
        </Grid>
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
              <GridView ItemsSource="{x:Bind items, Mode=OneWay}" ItemTemplate="{StaticResource ImageTemplate}" IsItemClickEnabled="True" ItemClick="onBasicItemClick" SelectionMode="Single">
                <GridView.ItemsPanel>
                  <ItemsPanelTemplate>
                    <ItemsWrapGrid Orientation="Horizontal" />
                  </ItemsPanelTemplate>
                </GridView.ItemsPanel>
              </GridView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Text="{x:Bind basicOutput, Mode=OneWay}" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>

        <ControlExample HeaderText="{x:Bind layoutHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind layoutXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind layoutNote, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <GridView ItemsSource="{x:Bind items, Mode=OneWay}" ItemTemplate="{StaticResource ImageOverlayTemplate}">
                <GridView.ItemContainerStyle>
                  <Style TargetType="GridViewItem">
                    <Setter Property="Margin" Value="{x:Bind itemMargin, Mode=OneWay}" />
                  </Style>
                </GridView.ItemContainerStyle>
                <GridView.ItemsPanel>
                  <ItemsPanelTemplate><ItemsWrapGrid MaximumRowsOrColumns="{x:Bind wrapItemCount, Mode=OneWay}" Orientation="Horizontal" /></ItemsPanelTemplate>
                </GridView.ItemsPanel>
              </GridView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options>
            <StackPanel>
              <NumberBox Header="{x:Bind columnSpaceLabel, Mode=OneWay}" Minimum="0" Maximum="100" SmallChange="1" SpinButtonPlacementMode="Inline" MaxWidth="250" HorizontalAlignment="Stretch" Margin="0,0,0,16" Value="{x:Bind columnSpace, Mode=TwoWay}" ValueChanged="onColumnSpaceChanged" />
              <NumberBox Header="{x:Bind rowSpaceLabel, Mode=OneWay}" Minimum="0" Maximum="100" SmallChange="1" SpinButtonPlacementMode="Inline" MaxWidth="250" HorizontalAlignment="Stretch" Margin="0,0,0,16" Value="{x:Bind rowSpace, Mode=TwoWay}" ValueChanged="onRowSpaceChanged" />
              <NumberBox Header="{x:Bind wrapCountLabel, Mode=OneWay}" Minimum="1" Maximum="8" SmallChange="1" SpinButtonPlacementMode="Inline" MaxWidth="250" HorizontalAlignment="Stretch" Margin="0,0,0,16" Value="{x:Bind wrapItemCount, Mode=TwoWay}" ValueChanged="onWrapItemCountChanged" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind contentHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind contentXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Grid>
              <Grid.RowDefinitions>
                <RowDefinition Height="*" />
                <RowDefinition Height="Auto" />
              </Grid.RowDefinitions>
              <GridView
                Grid.Row="0"
                ItemsSource="{x:Bind contentItems, Mode=TwoWay}"
                ItemTemplate="{x:Bind selectedTemplate, Mode=OneWay}"
                IsItemClickEnabled="{x:Bind isItemClickEnabled, Mode=OneWay}"
                CanDragItems="{x:Bind canDragItems, Mode=OneWay}"
                CanReorderItems="{x:Bind canReorderItems, Mode=OneWay}"
                AllowDrop="{x:Bind allowDrop, Mode=OneWay}"
                SelectionMode="{x:Bind selectionMode, Mode=OneWay}"
                ItemClick="onContentItemClick"
                SelectionChanged="onContentSelectionChanged"
                 FlowDirection="{x:Bind flowDirection, Mode=OneWay}" />
              <StackPanel Grid.Row="1">
                <TextBlock Text="{x:Bind clickOutput, Mode=OneWay}" />
                <TextBlock Text="{x:Bind selectionOutput, Mode=OneWay}" />
              </StackPanel>
            </Grid>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options>
            <StackPanel>
              <RadioButtons Header="{x:Bind itemTemplateLabel, Mode=OneWay}" ItemsSource="{x:Bind templateOptions, Mode=OneWay}" DisplayMemberPath="Text" SelectedIndex="{x:Bind templateIndex, Mode=TwoWay}" SelectionChanged="onTemplateSelectionChanged" />
              <TextBlock Margin="0,18,0,10" Text="{x:Bind propertiesLabel, Mode=OneWay}" />
              <TextBlock MaxWidth="150" FontSize="13" Text="{x:Bind dragDropNote, Mode=OneWay}" TextWrapping="Wrap" />
              <TextBlock MaxWidth="150" FontSize="13" Text="{x:Bind itemClickNote, Mode=OneWay}" TextWrapping="Wrap" />
              <CheckBox IsChecked="{x:Bind isItemClickEnabled, Mode=TwoWay}" Checked="onItemClickEnabledChanged" Unchecked="onItemClickEnabledChanged"><TextBlock Text="{x:Bind itemClickEnabledLabel, Mode=OneWay}" /></CheckBox>
              <CheckBox IsChecked="{x:Bind canDragItems, Mode=TwoWay}" Checked="onCanDragItemsChanged" Unchecked="onCanDragItemsChanged"><TextBlock Text="{x:Bind canDragItemsLabel, Mode=OneWay}" /></CheckBox>
              <CheckBox IsChecked="{x:Bind canReorderItems, Mode=TwoWay}" Checked="onCanReorderItemsChanged" Unchecked="onCanReorderItemsChanged"><TextBlock Text="{x:Bind canReorderItemsLabel, Mode=OneWay}" /></CheckBox>
              <CheckBox IsChecked="{x:Bind allowDrop, Mode=TwoWay}" Checked="onAllowDropChanged" Unchecked="onAllowDropChanged"><TextBlock Text="{x:Bind allowDropLabel, Mode=OneWay}" /></CheckBox>
              <ToggleButton Margin="0,8,0,0" IsChecked="{x:Bind isRightToLeft, Mode=TwoWay}" Checked="onFlowDirectionChanged" Unchecked="onFlowDirectionChanged"><TextBlock Text="{x:Bind reverseFlowLabel, Mode=OneWay}" /></ToggleButton>
              <ComboBox Margin="0,12,0,0" Header="{x:Bind selectionModeLabel, Mode=OneWay}" ItemsSource="{x:Bind selectionModeOptions, Mode=OneWay}" DisplayMemberPath="Text" SelectedIndex="{x:Bind selectionModeIndex, Mode=TwoWay}" SelectionChanged="onSelectionModeChanged" />
            </StackPanel>
          </ControlExample.Options>
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
import Grid from '../../components/Grid.vue'
import GridView from '../../components/GridView.vue'
import Image from '../../components/Image.vue'
import NumberBox from '../../components/NumberBox.vue'
import Page from '../../components/Page.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import RelativePanel from '../../components/RelativePanel.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import { createPageState } from '../../utils/pageState'
import { useI18n } from '../../components/i18n/index'

const { t } = useI18n()
const pageTitle = t('text.gridview')
const pageDescription = t('text.the-gridview-lets-people-browse-and-select-from')
const basicHeader = t('sample.gridview.basic-simple-datatemplate')
const basicNote = t('sample.gridview.basic-note')
const layoutHeader = t('sample.gridview.layout-customization')
const layoutNote = t('sample.gridview.layout-note')
const contentHeader = t('sample.gridview.content-inside')
const columnSpaceLabel = t('sample.space-between-columns')
const rowSpaceLabel = t('sample.space-between-rows')
const wrapCountLabel = t('sample.maximum-items-before-wrapping')
const itemTemplateLabel = t('sample.item-template')
const propertiesLabel = t('sample.gridview.properties')
const dragDropNote = t('sample.gridview.drag-drop-note')
const itemClickNote = t('sample.gridview.item-click-note')
const itemClickEnabledLabel = t('sample.is-item-click-enabled')
const canDragItemsLabel = t('sample.can-drag-items')
const canReorderItemsLabel = t('sample.can-reorder-items')
const allowDropLabel = t('sample.allow-drop')
const reverseFlowLabel = t('sample.reverse-flow-direction')
const selectionModeLabel = t('sample.selection-mode')
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'gridview')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const media = name => `https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/${name}`
const items = ref(['cliff.jpg', 'grapes.jpg', 'rainier.jpg', 'sunset.jpg', 'valley.jpg'].map((name, index) => ({
  Title: name.split('.')[0],
  Description: t('text.the-gridview-lets-people-browse-and-select-from'),
  ImageLocation: media(name),
  Views: `${12 + index * 7}K`,
  Likes: `${2 + index * 3}K`,
  ViewsLabel: t('sample.listview.views'),
  LikesLabel: t('sample.listview.likes')
})))
const contentItems = ref([...items.value])
const basicOutput = ref('')
const clickOutput = ref('')
const selectionOutput = ref('')
const columnSpace = ref(5)
const rowSpace = ref(5)
const wrapItemCount = ref(3)
const isItemClickEnabled = ref(false)
const canDragItems = ref(false)
const canReorderItems = ref(false)
const allowDrop = ref(false)
const selectionModes = ['None', 'Single', 'Multiple', 'Extended']
const selectionModeOptions = computed(() => [
  { Text: t('sample.selection-none'), Value: 'None' },
  { Text: t('sample.selection-single'), Value: 'Single' },
  { Text: t('sample.selection-multiple'), Value: 'Multiple' },
  { Text: t('sample.selection-extended'), Value: 'Extended' }
])
const selectionModeIndex = ref(1)
const selectionMode = computed(() => selectionModes[selectionModeIndex.value])
const isRightToLeft = ref(false)
const flowDirection = computed(() => isRightToLeft.value ? 'RightToLeft' : 'LeftToRight')
const templateOptions = computed(() => [
  { Text: t('sample.template-image'), Value: 'Image' },
  { Text: t('sample.template-icon-text'), Value: 'Icon/Text' },
  { Text: t('sample.template-image-text'), Value: 'Image/Text' },
  { Text: t('sample.template-text'), Value: 'Text' }
])
const templateIndex = ref(0)
const templateKeys = ['ImageTemplate', 'IconTextTemplate', 'ImageTextTemplate', 'TextTemplate']
const selectedTemplate = computed(() => `{StaticResource ${templateKeys[templateIndex.value]}}`)
const itemMargin = computed(() => `${columnSpace.value},${rowSpace.value},${columnSpace.value},${rowSpace.value}`)
const onBasicItemClick = (sender, args) => { basicOutput.value = t('sample.gridview.clicked-output', { item: args?.ClickedItem?.Title ?? '' }) }
const onContentItemClick = (sender, args) => { clickOutput.value = t('sample.gridview.clicked-output', { item: args?.ClickedItem?.Title ?? '' }) }
const onContentSelectionChanged = (_sender, args) => { selectionOutput.value = t('sample.gridview.selection-output', { count: (args?.SelectedItems ?? []).length }) }
// Keep the live controls authoritative even when a host renders an XAML
// binding as a one-way prop before its TwoWay update callback is attached.
const onTemplateSelectionChanged = args => {
  const index = Number(args?.SelectedIndex)
  if (Number.isInteger(index) && index >= 0) templateIndex.value = index
}
const onSelectionModeChanged = sender => {
  const index = Number(sender.SelectedIndex)
  if (Number.isInteger(index) && index >= 0 && index < selectionModes.length) selectionModeIndex.value = index
}
const boolValue = value => value === true
const onItemClickEnabledChanged = value => { isItemClickEnabled.value = boolValue(value) }
const onCanDragItemsChanged = value => { canDragItems.value = boolValue(value) }
const onCanReorderItemsChanged = value => { canReorderItems.value = boolValue(value) }
const onAllowDropChanged = value => { allowDrop.value = boolValue(value) }
const onFlowDirectionChanged = () => { isRightToLeft.value = Boolean(isRightToLeft.value) }
const numberValue = args => Number(args?.NewValue ?? args?.Value)
const onColumnSpaceChanged = args => { if (Number.isFinite(numberValue(args))) columnSpace.value = numberValue(args) }
const onRowSpaceChanged = args => { if (Number.isFinite(numberValue(args))) rowSpace.value = numberValue(args) }
const onWrapItemCountChanged = args => { if (Number.isFinite(numberValue(args))) wrapItemCount.value = numberValue(args) }
// WinUI clears the selection output when selection is disabled and no longer
// reports item clicks after IsItemClickEnabled is turned off. Keep the output
// surface in sync with those live option changes as the controls update their
// TwoWay x:Bind sources.
watch(selectionMode, mode => {
  if (mode === 'None') selectionOutput.value = ''
})
watch(isItemClickEnabled, enabled => {
  if (!enabled) clickOutput.value = ''
})
const basicXaml = `<!-- XAML Code -->

<GridView
    x:Name="BasicGridView"
    ItemTemplate="{StaticResource ImageTemplate}"
    IsItemClickEnabled="True"
    ItemClick="BasicGridView_ItemClick"
    SelectionMode="Single" />

<DataTemplate x:Key="ImageTemplate" x:DataType="local:CustomDataObject">
    <Image
        AutomationProperties.AccessibilityView="Raw"
        AutomationProperties.Name="{x:Bind Title}"
        Stretch="UniformToFill"
        Source="{x:Bind ImageLocation}"
        Width="190"
        Height="130" />
</DataTemplate>`
const basicCSharp = `// C# Code

public class CustomDataObject
{
    public string Title { get; set; } = string.Empty;
    public string ImageLocation { get; set; } = string.Empty;
    public string Views { get; set; } = string.Empty;
    public string Likes { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ViewsLabel { get; set; } = string.Empty;
    public string LikesLabel { get; set; } = string.Empty;

    public CustomDataObject()
    {
    }
}`
const layoutXaml = computed(() => `<!-- GridView layout customization -->
<GridView
    x:Name="StyledGrid"
    ItemTemplate="{StaticResource ImageOverlayTemplate}">
    <GridView.ItemContainerStyle>
        <Style TargetType="GridViewItem" BasedOn="{StaticResource DefaultGridViewItemStyle}">
            <Setter Property="Margin" Value="${columnSpace.value}, ${rowSpace.value}, ${columnSpace.value}, ${rowSpace.value}" />
        </Style>
    </GridView.ItemContainerStyle>
    <GridView.ItemsPanel>
        <ItemsPanelTemplate>
            <ItemsWrapGrid MaximumRowsOrColumns="${wrapItemCount.value}" Orientation="Horizontal" />
        </ItemsPanelTemplate>
    </GridView.ItemsPanel>
</GridView>

<DataTemplate x:Key="ImageOverlayTemplate" x:DataType="local:CustomDataObject">
    <Grid Width="100" Height="100">
        <Image Width="100" Height="100" Source="{x:Bind ImageLocation}" Stretch="UniformToFill" />
        <StackPanel Height="40" VerticalAlignment="Bottom" Padding="5,1,5,1" Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}" Opacity=".75" Orientation="Vertical">
            <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Title}" />
            <StackPanel Orientation="Horizontal">
                <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Likes}" Style="{ThemeResource CaptionTextBlockStyle}" />
                <TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind LikesLabel}" Style="{ThemeResource CaptionTextBlockStyle}" />
            </StackPanel>
        </StackPanel>
    </Grid>
</DataTemplate>`)
const contentTemplateSource = computed(() => {
  const key = templateKeys[templateIndex.value]
  const snippets = {
    ImageTemplate: `<DataTemplate x:Key="ImageTemplate" x:DataType="local:CustomDataObject"><Image AutomationProperties.AccessibilityView="Raw" AutomationProperties.Name="{x:Bind Title}" Stretch="UniformToFill" Source="{x:Bind ImageLocation}" Width="190" Height="130" /></DataTemplate>`,
    IconTextTemplate: `<DataTemplate x:Key="IconTextTemplate" x:DataType="local:CustomDataObject"><RelativePanel AutomationProperties.Name="{x:Bind Title}" Width="280" MinHeight="160"><Image x:Name="image" Width="18" Margin="0,4,0,0" RelativePanel.AlignLeftWithPanel="True" RelativePanel.AlignTopWithPanel="True" Source="{x:Bind ImageLocation}" Stretch="Uniform" /><TextBlock x:Name="title" Style="{StaticResource BaseTextBlockStyle}" Margin="8,0,0,0" Text="{x:Bind Title}" RelativePanel.RightOf="image" RelativePanel.AlignTopWithPanel="True" /><TextBlock Text="{x:Bind Description}" Style="{StaticResource CaptionTextBlockStyle}" TextWrapping="Wrap" Margin="0,4,8,0" RelativePanel.Below="title" TextTrimming="WordEllipsis" /></RelativePanel></DataTemplate>`,
    ImageTextTemplate: `<DataTemplate x:Key="ImageTextTemplate" x:DataType="local:CustomDataObject"><Grid AutomationProperties.Name="{x:Bind Title}" Width="280"><Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions><Image Source="{x:Bind ImageLocation}" Height="100" Stretch="Fill" VerticalAlignment="Top" /><StackPanel Grid.Column="1" Margin="8,0,0,8"><TextBlock Text="{x:Bind Title}" Style="{ThemeResource SubtitleTextBlockStyle}" Margin="0,0,0,8" /><StackPanel Orientation="Horizontal"><TextBlock Text="{x:Bind Views}" Style="{ThemeResource CaptionTextBlockStyle}" /><TextBlock Text="{x:Bind ViewsLabel}" Style="{ThemeResource CaptionTextBlockStyle}" /></StackPanel><StackPanel Orientation="Horizontal"><TextBlock Text="{x:Bind Likes}" Style="{ThemeResource CaptionTextBlockStyle}" /><TextBlock Text="{x:Bind LikesLabel}" Style="{ThemeResource CaptionTextBlockStyle}" /></StackPanel></StackPanel></Grid></DataTemplate>`,
    TextTemplate: `<DataTemplate x:Key="TextTemplate" x:DataType="local:CustomDataObject"><StackPanel Width="240" Orientation="Horizontal"><TextBlock Style="{StaticResource TitleTextBlockStyle}" Margin="8,0,0,0" Text="{x:Bind Title}" /></StackPanel></DataTemplate>`
  }
  return snippets[key] || snippets.ImageTemplate
})
const contentXaml = computed(() => `<Grid>
    <Grid.RowDefinitions>
        <RowDefinition />
        <RowDefinition Height="Auto" />
    </Grid.RowDefinitions>
<GridView Grid.Row="0"
    x:Name="ContentGridView"
    ItemsSource="{x:Bind Items}"
    ItemTemplate="{StaticResource ${templateKeys[templateIndex.value]}}"
    IsItemClickEnabled="${isItemClickEnabled.value ? 'True' : 'False'}"
    CanDragItems="${canDragItems.value ? 'True' : 'False'}"
    AllowDrop="${allowDrop.value ? 'True' : 'False'}"
    CanReorderItems="${canReorderItems.value ? 'True' : 'False'}"
    SelectionMode="${selectionMode.value}"
    SelectionChanged="ContentGridView_SelectionChanged"
    ItemClick="ContentGridView_ItemClick"
    FlowDirection="${flowDirection.value}" />
<StackPanel Grid.Row="1">
    <TextBlock Text="{x:Bind ClickOutput, Mode=OneWay}" />
    <TextBlock Text="{x:Bind SelectionOutput, Mode=OneWay}" />
</StackPanel>
</Grid>

${contentTemplateSource.value}`)
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
