<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind $t('text.itemsview'), Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind $t('text.itemsview-description'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
        </StackPanel>
      </StackPanel>
      <StackPanel class="gallery-page-content">
        <ControlExample HeaderText="{x:Bind $t('sample.itemsview.basic'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind basicXaml, Mode=OneWay}" CSharp="{x:Bind basicCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind $t('sample.itemsview.basic-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ItemsView Width="220" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind items, Mode=OneWay}" IsItemInvokedEnabled="True" ItemInvoked="BasicItemsView_ItemInvoked">
                <ItemsView.ItemTemplate><DataTemplate><Grid Width="200" Height="140" HorizontalAlignment="Left"><Image Margin="4" HorizontalAlignment="Center" VerticalAlignment="Center" Source="{x:Bind ImageLocation}" Stretch="UniformToFill" /></Grid></DataTemplate></ItemsView.ItemTemplate>
              </ItemsView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Text="{x:Bind basicInvokeOutput, Mode=OneWay}" /></ControlExample.Output>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.itemsview.swappable-layouts'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind layoutsXaml, Mode=OneWay}" CSharp="{x:Bind layoutsCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind $t('sample.itemsview.layout-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ItemsView Width="500" Height="400" HorizontalAlignment="Left" Layout="{x:Bind layoutSelection, Mode=OneWay}" ItemsSource="{x:Bind items, Mode=OneWay}">
                <ItemsView.Layout><LinedFlowLayout ItemsStretch="Fill" LineHeight="160" LineSpacing="5" MinItemSpacing="5" /></ItemsView.Layout>
                <ItemsView.ItemTemplate><DataTemplate><Grid Width="150" Height="150"><Image Source="{x:Bind ImageLocation}" Stretch="UniformToFill" /><StackPanel Height="40" Padding="5,1,5,1" VerticalAlignment="Bottom" Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}" Opacity=".75"><TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Title}" /></StackPanel></Grid></DataTemplate></ItemsView.ItemTemplate>
              </ItemsView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Options>
            <StackPanel MinWidth="260" Spacing="12">
              <RadioButtons Header="{x:Bind $t('sample.layout'), Mode=OneWay}" ItemsSource="{x:Bind layoutOptions, Mode=OneWay}" DisplayMemberPath="Text" SelectedIndex="{x:Bind layoutSelectedIndex, Mode=TwoWay}" />
              <StackPanel Visibility="{x:Bind linedFlowVisibility, Mode=OneWay}" Spacing="8">
                <TextBlock FontWeight="SemiBold" Text="{x:Bind $t('sample.itemsview.linedflow-settings'), Mode=OneWay}" />
                <NumberBox Header="{x:Bind $t('sample.space-between-lines'), Mode=OneWay}" Minimum="0" Maximum="100" Value="{x:Bind lineSpacing, Mode=TwoWay}" />
                <NumberBox Header="{x:Bind $t('sample.minimum-space-between-items-on-line'), Mode=OneWay}" Minimum="0" Maximum="100" Value="{x:Bind minItemSpacing, Mode=TwoWay}" />
                <RadioButtons Header="{x:Bind $t('sample.line-height'), Mode=OneWay}" ItemsSource="{x:Bind lineHeightOptions, Mode=OneWay}" DisplayMemberPath="Text" SelectedIndex="{x:Bind lineHeightSelectedIndex, Mode=TwoWay}" />
              </StackPanel>
              <StackPanel Visibility="{x:Bind stackVisibility, Mode=OneWay}" Spacing="8">
                <TextBlock FontWeight="SemiBold" Text="{x:Bind $t('sample.itemsview.stack-settings'), Mode=OneWay}" />
                <NumberBox Header="{x:Bind $t('sample.space-between-rows'), Mode=OneWay}" Minimum="0" Maximum="100" Value="{x:Bind stackSpacing, Mode=TwoWay}" />
              </StackPanel>
              <StackPanel Visibility="{x:Bind uniformGridVisibility, Mode=OneWay}" Spacing="8">
                <TextBlock FontWeight="SemiBold" Text="{x:Bind $t('sample.itemsview.uniformgrid-settings'), Mode=OneWay}" />
                <NumberBox Header="{x:Bind $t('sample.minimum-space-between-columns'), Mode=OneWay}" Minimum="0" Maximum="100" Value="{x:Bind minColumnSpacing, Mode=TwoWay}" />
                <NumberBox Header="{x:Bind $t('sample.minimum-space-between-rows'), Mode=OneWay}" Minimum="0" Maximum="100" Value="{x:Bind minRowSpacing, Mode=TwoWay}" />
                <NumberBox Header="{x:Bind $t('sample.maximum-items-per-row-before-wrapping'), Mode=OneWay}" Minimum="1" Maximum="8" Value="{x:Bind maximumRowsOrColumns, Mode=TwoWay}" />
              </StackPanel>
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.itemsview.item-invocation-selection'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind selectionXaml, Mode=OneWay}" CSharp="{x:Bind selectionCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <Grid RowDefinitions="Auto,*,Auto">
              <StackPanel Spacing="4">
                <TextBlock Text="{x:Bind $t('sample.itemsview.selection-note-1'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Text="{x:Bind $t('sample.itemsview.selection-note-none'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Text="{x:Bind $t('sample.itemsview.selection-note-single'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Text="{x:Bind $t('sample.itemsview.selection-note-multiple'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Text="{x:Bind $t('sample.itemsview.selection-note-extended'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              </StackPanel>
              <ItemsView Grid.Row="1" Width="500" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind items, Mode=OneWay}" SelectionMode="{x:Bind selectionMode, Mode=OneWay}" IsItemInvokedEnabled="{x:Bind isItemInvokedEnabled, Mode=OneWay}" SelectedItems="{x:Bind selectedItems, Mode=TwoWay}" ItemInvoked="SwappableSelectionModesItemsView_ItemInvoked" SelectionChanged="SwappableSelectionModesItemsView_SelectionChanged">
                <ItemsView.ItemTemplate><DataTemplate><Grid Width="150" Height="150"><Image Source="{x:Bind ImageLocation}" Stretch="UniformToFill" /><StackPanel Height="40" Padding="5,1,5,1" VerticalAlignment="Bottom" Background="{ThemeResource SystemControlBackgroundBaseMediumBrush}" Opacity=".75"><TextBlock Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Title}" /></StackPanel></Grid></DataTemplate></ItemsView.ItemTemplate>
                <ItemsView.Layout><UniformGridLayout MaximumRowsOrColumns="3" MinColumnSpacing="5" MinRowSpacing="5" /></ItemsView.Layout>
              </ItemsView>
              <StackPanel Grid.Row="2">
                <TextBlock Text="{x:Bind invocationOutput, Mode=OneWay}" />
                <TextBlock Text="{x:Bind selectionOutput, Mode=OneWay}" />
              </StackPanel>
            </Grid>
          </ControlExample.Example>
          <ControlExample.Options>
            <Grid MinWidth="220" ColumnDefinitions="Auto,*" RowDefinitions="Auto,Auto" ColumnSpacing="8" RowSpacing="8">
              <TextBlock VerticalAlignment="Center" Text="{x:Bind $t('sample.selection-mode'), Mode=OneWay}" />
              <ComboBox Grid.Column="1" ItemsSource="{x:Bind selectionModeOptions, Mode=OneWay}" DisplayMemberPath="Text" SelectedIndex="{x:Bind selectionModeSelectedIndex, Mode=TwoWay}" />
              <TextBlock Grid.Row="1" VerticalAlignment="Center" Text="{x:Bind $t('sample.is-item-invoked-enabled'), Mode=OneWay}" />
              <CheckBox Grid.Row="1" Grid.Column="1" IsChecked="{x:Bind isItemInvokedEnabled, Mode=TwoWay}" />
            </Grid>
          </ControlExample.Options>
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue'
import Button from '../../components/Button.vue'
import CheckBox from '../../components/CheckBox.vue'
import ComboBox from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import Image from '../../components/Image.vue'
import ItemsView from '../../components/ItemsView.vue'
import NumberBox from '../../components/NumberBox.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'itemsview')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const mediaBase = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia'
const items = [
  { Title: 'Cliff', ImageLocation: `${mediaBase}/cliff.jpg`, Likes: 12, Description: 'A cliff by the sea.' },
  { Title: 'Grapes', ImageLocation: `${mediaBase}/grapes.jpg`, Likes: 18, Description: 'A bunch of grapes.' },
  { Title: 'Rainier', ImageLocation: `${mediaBase}/rainier.jpg`, Likes: 27, Description: 'Mount Rainier.' },
  { Title: 'Sunset', ImageLocation: `${mediaBase}/sunset.jpg`, Likes: 31, Description: 'A sunset over water.' },
  { Title: 'Valley', ImageLocation: `${mediaBase}/valley.jpg`, Likes: 44, Description: 'A green valley.' },
  { Title: 'Cliff 2', ImageLocation: `${mediaBase}/cliff.jpg`, Likes: 52, Description: 'Another cliff.' },
  { Title: 'Grapes 2', ImageLocation: `${mediaBase}/grapes.jpg`, Likes: 67, Description: 'More grapes.' },
  { Title: 'Rainier 2', ImageLocation: `${mediaBase}/rainier.jpg`, Likes: 73, Description: 'Another mountain view.' }
]
const basicInvokeOutput = ref('')
const BasicItemsView_ItemInvoked = ({ InvokedItem }) => { basicInvokeOutput.value = t('sample.itemsview.invoked-output', { item: InvokedItem.Title }) }
const imageTemplate = [{ Type: 'Grid', Props: { Width: '200', Height: '140', HorizontalAlignment: 'Left' }, Children: [
  { Type: 'Image', Props: { Margin: '4', HorizontalAlignment: 'Center', VerticalAlignment: 'Center', Source: '{x:Bind ImageLocation}', Stretch: 'UniformToFill' } }
] }]

const layoutOptions = computed(() => [
  { Text: t('sample.itemsview.layout-linedflow'), Value: 'LinedFlowLayout' },
  { Text: t('sample.itemsview.layout-uniformgrid'), Value: 'UniformGridLayout' },
  { Text: t('sample.itemsview.layout-stack'), Value: 'StackLayout' }
])
const layoutValues = computed(() => layoutOptions.value.map(option => option.Value))
const layoutSelectedIndex = ref(0)
const layoutSelection = computed(() => {
  const layout = layoutValues.value[layoutSelectedIndex.value]
  if (layout === 'UniformGridLayout') return { Type: layout, MinItemWidth: 150, MinItemHeight: 150, MinColumnSpacing: minColumnSpacing.value, MinRowSpacing: minRowSpacing.value, MaximumRowsOrColumns: maximumRowsOrColumns.value }
  if (layout === 'StackLayout') return { Type: layout, Spacing: stackSpacing.value }
  return { Type: layout, ItemsStretch: 'Fill', LineHeight: lineHeight.value, LineSpacing: lineSpacing.value, MinItemSpacing: minItemSpacing.value }
})
const layoutTemplate = computed(() => [
  { Type: 'Grid', Props: { Width: '150', Height: '150' }, Children: [
    { Type: 'Image', Props: { Source: '{x:Bind ImageLocation}', Stretch: 'UniformToFill' } },
    { Type: 'StackPanel', Props: { Height: '40', Padding: '5,1,5,1', VerticalAlignment: 'Bottom', Background: '{ThemeResource SystemControlBackgroundBaseMediumBrush}', Opacity: '.75' }, Children: [
      { Type: 'TextBlock', Props: { Foreground: '{ThemeResource SystemControlForegroundAltHighBrush}', Text: '{x:Bind Title}' } }
    ] }
  ] }
])
const lineSpacing = ref(5)
const minItemSpacing = ref(5)
const lineHeightOptions = computed(() => [{ Text: t('sample.small'), Value: 'Small' }, { Text: t('sample.large'), Value: 'Large' }])
const lineHeightSelectedIndex = ref(1)
const stackSpacing = ref(5)
const minColumnSpacing = ref(5)
const minRowSpacing = ref(5)
const maximumRowsOrColumns = ref(3)
const lineHeight = computed(() => lineHeightSelectedIndex.value === 0 ? 80 : 160)
const linedFlowVisibility = computed(() => layoutValues.value[layoutSelectedIndex.value] === 'LinedFlowLayout' ? 'Visible' : 'Collapsed')
const stackVisibility = computed(() => layoutValues.value[layoutSelectedIndex.value] === 'StackLayout' ? 'Visible' : 'Collapsed')
const uniformGridVisibility = computed(() => layoutValues.value[layoutSelectedIndex.value] === 'UniformGridLayout' ? 'Visible' : 'Collapsed')
const selectionModeOptions = [{ Text: t('text.none'), Value: 'None' }, { Text: t('text.single'), Value: 'Single' }, { Text: t('text.multiple'), Value: 'Multiple' }, { Text: t('text.extended'), Value: 'Extended' }]
const selectionModeValues = selectionModeOptions.map(option => option.Value)
const selectionModeSelectedIndex = ref(2)
const selectionMode = computed(() => selectionModeValues[selectionModeSelectedIndex.value])
const isItemInvokedEnabled = ref(false)
const selectedItems = ref([])
const selectionTemplate = [
  { Type: 'Grid', Props: { Width: '150', Height: '150' }, Children: [
    { Type: 'Image', Props: { Source: '{x:Bind ImageLocation}', Stretch: 'UniformToFill' } },
    { Type: 'StackPanel', Props: { Height: '40', Padding: '5,1,5,1', VerticalAlignment: 'Bottom', Background: '{ThemeResource SystemControlBackgroundBaseMediumBrush}', Opacity: '.75' }, Children: [
      { Type: 'TextBlock', Props: { Foreground: '{ThemeResource SystemControlForegroundAltHighBrush}', Text: '{x:Bind Title}' } }
    ] }
  ] }
]
const invocationOutput = ref('')
const selectionOutput = ref('')
const SwappableSelectionModesItemsView_ItemInvoked = ({ InvokedItem }) => { invocationOutput.value = t('sample.itemsview.invoked-output', { item: InvokedItem.Title }) }
const SwappableSelectionModesItemsView_SelectionChanged = () => { selectionOutput.value = t('sample.itemsview.selection-output', { count: selectedItems.value.length }) }
watch(selectionModeSelectedIndex, () => { selectedItems.value = []; selectionOutput.value = ''; invocationOutput.value = '' })

const basicXaml = '<ItemsView Width="220" Height="400" IsItemInvokedEnabled="True" ItemInvoked="BasicItemsView_ItemInvoked" ItemTemplate="{StaticResource ImageTemplate}" />'
const basicCSharp = 'private void BasicItemsView_ItemInvoked(ItemsView sender, ItemsViewItemInvokedEventArgs args)\n{\n    var item = (ControlInfoDataItem)args.InvokedItem;\n    tblBasicInvokeOutput.Text = $"You invoked {item.Title}.";\n}'
const layoutsXaml = computed(() => {
  const layoutName = layoutValues.value[layoutSelectedIndex.value]
  const layout = layoutSelection.value
  const properties = Object.entries(layout).filter(([key]) => key !== 'Type').map(([key, value]) => `${key}="${value}"`).join(' ')
  return `<ItemsView Width="500" Height="400" ItemTemplate="{StaticResource ${layoutName}ItemTemplate}"><ItemsView.Layout><${layoutName} ${properties} /></ItemsView.Layout></ItemsView>`
})
const layoutsCSharp = computed(() => {
  const layoutName = layoutValues.value[layoutSelectedIndex.value]
  return `private void RbLayout_Checked(object sender, RoutedEventArgs e)\n{\n    SwappableLayoutsItemsView.Layout = new ${layoutName}();\n}`
})
const selectionXaml = '<ItemsView ItemsSource="{x:Bind Items}" SelectionMode="{x:Bind SelectionMode}" IsItemInvokedEnabled="{x:Bind chkIsItemInvokedEnabled.IsChecked}" ItemInvoked="SwappableSelectionModesItemsView_ItemInvoked" SelectionChanged="SwappableSelectionModesItemsView_SelectionChanged"><ItemsView.Layout><UniformGridLayout MaximumRowsOrColumns="3" MinColumnSpacing="5" MinRowSpacing="5" /></ItemsView.Layout></ItemsView>'
const selectionCSharp = 'private void SwappableSelectionModesItemsView_SelectionChanged(ItemsView sender, ItemsViewSelectionChangedEventArgs args)\n{\n    tblSelectionOutput.Text = $"You have selected {sender.SelectedItems.Count} item(s).";\n}'
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
