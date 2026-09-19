<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind $t('text.gridview'), Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind $t('text.the-gridview-lets-people-browse-and-select-from'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample HeaderText="{x:Bind $t('sample.gridview.basic-simple-datatemplate'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind basicXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind $t('sample.gridview.basic-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <GridView ItemsSource="{x:Bind items, Mode=OneWay}" IsItemClickEnabled="True" ItemClick="onBasicItemClick" SelectionMode="Single">
                <GridView.ItemTemplate>
                  <DataTemplate>
                    <Image Width="190" Height="130" AutomationProperties.Name="{x:Bind Title}" Source="{x:Bind ImageLocation}" Stretch="UniformToFill" />
                  </DataTemplate>
                </GridView.ItemTemplate>
              </GridView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Text="{x:Bind basicOutput, Mode=OneWay}" /></ControlExample.Output>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.gridview.layout-customization'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind layoutXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind $t('sample.gridview.layout-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <GridView ItemsSource="{x:Bind items, Mode=OneWay}">
                <GridView.ItemTemplate>
                  <DataTemplate>
                    <Grid Width="100">
                      <Image Source="{x:Bind ImageLocation}" Stretch="UniformToFill" />
                      <StackPanel Height="40" Padding="5,1,5,1" VerticalAlignment="Bottom" Background="LightGray" Opacity="0.75">
                        <TextBlock Text="{x:Bind Title}" />
                        <StackPanel Orientation="Horizontal">
                          <TextBlock Text="{x:Bind Likes}" />
                          <TextBlock Text=" Likes" />
                        </StackPanel>
                      </StackPanel>
                    </Grid>
                  </DataTemplate>
                </GridView.ItemTemplate>
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
          <ControlExample.Options>
            <StackPanel>
              <NumberBox Header="{x:Bind $t('sample.space-between-columns'), Mode=OneWay}" Minimum="0" Maximum="100" Value="{x:Bind columnSpace, Mode=TwoWay}" />
              <NumberBox Header="{x:Bind $t('sample.space-between-rows'), Mode=OneWay}" Minimum="0" Maximum="100" Value="{x:Bind rowSpace, Mode=TwoWay}" />
              <NumberBox Header="{x:Bind $t('sample.maximum-items-before-wrapping'), Mode=OneWay}" Minimum="1" Maximum="8" Value="{x:Bind wrapItemCount, Mode=TwoWay}" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.gridview.content-inside'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind contentXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Grid>
              <Grid.RowDefinitions><RowDefinition /><RowDefinition Height="Auto" /></Grid.RowDefinitions>
              <GridView ItemsSource="{x:Bind contentItems, Mode=OneWay}" ItemTemplate="{x:Bind selectedTemplate, Mode=OneWay}" IsItemClickEnabled="{x:Bind isItemClickEnabled, Mode=OneWay}" CanDragItems="{x:Bind canDragItems, Mode=OneWay}" CanReorderItems="{x:Bind canReorderItems, Mode=OneWay}" AllowDrop="{x:Bind allowDrop, Mode=OneWay}" SelectionMode="{x:Bind selectionMode, Mode=OneWay}" ItemClick="onContentItemClick" SelectionChanged="onContentSelectionChanged" FlowDirection="{x:Bind flowDirection, Mode=OneWay}">
                <GridView.ItemTemplateSelector>
                  <DataTemplateSelector>
                    <DataTemplate x:Key="ImageTemplate"><Image Width="190" Height="130" AutomationProperties.Name="{x:Bind Title}" Source="{x:Bind ImageLocation}" Stretch="UniformToFill" /></DataTemplate>
                    <DataTemplate x:Key="IconTextTemplate"><RelativePanel Width="280" MinHeight="160" AutomationProperties.Name="{x:Bind Title}"><Image x:Name="image" Width="18" Margin="0,4,0,0" RelativePanel.AlignLeftWithPanel="True" RelativePanel.AlignTopWithPanel="True" Source="{x:Bind ImageLocation}" Stretch="Uniform" /><TextBlock x:Name="title" Margin="8,0,0,0" RelativePanel.AlignTopWithPanel="True" RelativePanel.RightOf="image" Text="{x:Bind Title}" /><TextBlock Margin="0,4,8,0" RelativePanel.Below="title" Text="{x:Bind Description}" TextWrapping="Wrap" TextTrimming="WordEllipsis" /></RelativePanel></DataTemplate>
                    <DataTemplate x:Key="ImageTextTemplate"><Grid Width="280"><Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions><Image Height="100" VerticalAlignment="Top" Source="{x:Bind ImageLocation}" Stretch="Fill" /><StackPanel Grid.Column="1" Margin="8,0,0,8"><TextBlock Margin="0,0,0,8" Text="{x:Bind Title}" /><StackPanel Orientation="Horizontal"><TextBlock Text="{x:Bind Views}" /><TextBlock Text=" Views " /></StackPanel><StackPanel Orientation="Horizontal"><TextBlock Text="{x:Bind Likes}" /><TextBlock Text=" Likes" /></StackPanel></StackPanel></Grid></DataTemplate>
                    <DataTemplate x:Key="TextTemplate"><StackPanel Width="240" Orientation="Horizontal"><TextBlock Margin="8,0,0,0" Text="{x:Bind Title}" /></StackPanel></DataTemplate>
                  </DataTemplateSelector>
                </GridView.ItemTemplateSelector>
              </GridView>
              <StackPanel Grid.Row="1"><TextBlock Text="{x:Bind clickOutput, Mode=OneWay}" /><TextBlock Text="{x:Bind selectionOutput, Mode=OneWay}" /></StackPanel>
            </Grid>
          </ControlExample.Example>
          <ControlExample.Options>
            <StackPanel>
              <RadioButtons Header="{x:Bind $t('sample.item-template'), Mode=OneWay}" ItemsSource="{x:Bind templateOptions, Mode=OneWay}" SelectedIndex="{x:Bind templateIndex, Mode=TwoWay}" />
              <TextBlock Margin="0,18,0,10" Text="{x:Bind $t('sample.gridview.properties'), Mode=OneWay}" />
              <TextBlock MaxWidth="150" FontSize="13" Text="{x:Bind $t('sample.gridview.drag-drop-note'), Mode=OneWay}" TextWrapping="Wrap" />
              <TextBlock MaxWidth="150" FontSize="13" Text="{x:Bind $t('sample.gridview.item-click-note'), Mode=OneWay}" TextWrapping="Wrap" />
              <CheckBox IsChecked="{x:Bind isItemClickEnabled, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.is-item-click-enabled'), Mode=OneWay}" /></CheckBox>
              <CheckBox IsChecked="{x:Bind canDragItems, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.can-drag-items'), Mode=OneWay}" /></CheckBox>
              <CheckBox IsChecked="{x:Bind canReorderItems, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.can-reorder-items'), Mode=OneWay}" /></CheckBox>
              <CheckBox IsChecked="{x:Bind allowDrop, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.allow-drop'), Mode=OneWay}" /></CheckBox>
              <ToggleButton Margin="0,8,0,0" IsChecked="{x:Bind isRightToLeft, Mode=TwoWay}"><TextBlock Text="{x:Bind $t('sample.reverse-flow-direction'), Mode=OneWay}" /></ToggleButton>
              <ComboBox Margin="0,12,0,0" Header="{x:Bind $t('sample.selection-mode'), Mode=OneWay}" SelectedIndex="{x:Bind selectionModeIndex, Mode=TwoWay}"><x:String>None</x:String><x:String>Single</x:String><x:String>Multiple</x:String><x:String>Extended</x:String></ComboBox>
            </StackPanel>
          </ControlExample.Options>
          <ControlExample.Output><StackPanel><TextBlock Text="{x:Bind clickOutput, Mode=OneWay}" /><TextBlock Text="{x:Bind selectionOutput, Mode=OneWay}" /></StackPanel></ControlExample.Output>
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import Button from '../../components/Button.vue'
import CheckBox from '../../components/CheckBox.vue'
import ComboBox from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import ColumnDefinition from '../../components/ColumnDefinition.vue'
import GridColumnDefinitions from '../../components/GridColumnDefinitions.vue'
import GridView from '../../components/GridView.vue'
import Image from '../../components/Image.vue'
import NumberBox from '../../components/NumberBox.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import RelativePanel from '../../components/RelativePanel.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import { DataTemplateSelector } from '../../components/CollectionProperties'
import { createPageState } from '../../utils/pageState'
import { useI18n } from '../../components/i18n/index'

const { t } = useI18n()
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
  Likes: `${2 + index * 3}K`
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
const onBasicItemClick = args => { basicOutput.value = t('sample.gridview.clicked-output', { item: args?.ClickedItem?.Title ?? '' }) }
const onContentItemClick = args => { clickOutput.value = t('sample.gridview.clicked-output', { item: args?.ClickedItem?.Title ?? '' }) }
const onContentSelectionChanged = args => { selectionOutput.value = t('sample.gridview.selection-output', { count: (args?.SelectedItems ?? []).length }) }
const basicXaml = '<GridView x:Name="BasicGridView" ItemTemplate="{StaticResource ImageTemplate}" IsItemClickEnabled="True" ItemClick="BasicGridView_ItemClick" SelectionMode="Single" />'
const layoutXaml = '<GridView x:Name="StyledGrid" ItemTemplate="{StaticResource ImageOverlayTemplate}"><GridView.ItemContainerStyle><Style TargetType="GridViewItem" BasedOn="{StaticResource DefaultGridViewItemStyle}"><Setter Property="Margin" Value="$(ColMargin), $(RowMargin), $(ColMargin), $(RowMargin)" /></Style></GridView.ItemContainerStyle><GridView.ItemsPanel><ItemsPanelTemplate><ItemsWrapGrid MaximumRowsOrColumns="$(MaxItems)" Orientation="Horizontal" /></ItemsPanelTemplate></GridView.ItemsPanel></GridView>'
const contentXaml = '<GridView x:Name="ContentGridView" ItemsSource="{x:Bind Items}" ItemTemplate="{StaticResource $(ItemTemplate)}" IsItemClickEnabled="$(IsItemClickEnabled)" CanDragItems="$(CanDragItems)" AllowDrop="$(CanDropItems)" CanReorderItems="$(CanReorderItems)" SelectionMode="$(SelectionMode)" SelectionChanged="ContentGridView_SelectionChanged" ItemClick="ContentGridView_ItemClick" FlowDirection="$(FlowDirection)" />'
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
