<template>
  <Page>
    <Page.Resources>
      <CollectionViewSource x:Name="cvsGroups" IsSourceGrouped="True" ItemsPath="Items" Source="{x:Bind Groups, Mode=OneWay}" />
      <DataTemplate x:Key="ZoomedInTemplate" x:DataType="models:ControlInfoDataItem">
        <StackPanel MinWidth="200" Margin="12,6,12,6">
          <TextBlock Style="{StaticResource BaseTextBlockStyle}" Text="{x:Bind Title}" />
          <TextBlock Width="300" HorizontalAlignment="Left" Style="{StaticResource BodyTextBlockStyle}" Text="{x:Bind Subtitle}" TextWrapping="Wrap" />
        </StackPanel>
      </DataTemplate>
      <DataTemplate x:Key="ZoomedInGroupHeaderTemplate" x:DataType="models:ControlInfoDataGroup">
        <TextBlock Foreground="{ThemeResource ApplicationForegroundThemeBrush}" Style="{StaticResource SubtitleTextBlockStyle}" Text="{x:Bind Title}" />
      </DataTemplate>
      <DataTemplate x:Key="ZoomedOutTemplate" x:DataType="wuxdata:ICollectionViewGroup">
        <TextBlock Style="{StaticResource SubtitleTextBlockStyle}" Text="{x:Bind ((models:ControlInfoDataGroup)Group).Title}" TextWrapping="Wrap" />
      </DataTemplate>
    </Page.Resources>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind themeLabel, Mode=OneWay}"><FontIcon Glyph="&#xE793;" /></Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind favoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" HeaderText="{x:Bind sampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind sampleXaml}" CSharp="{x:Bind sampleCSharp}">
            <ControlExample.Example>
              <SemanticZoom x:Name="Control1" Height="500">
                <SemanticZoom.ZoomedInView>
                  <GridView GotFocus="List_GotFocus" ItemTemplate="{StaticResource ZoomedInTemplate}" ItemsSource="{x:Bind cvsGroups.View, Mode=OneWay}" ScrollViewer.IsHorizontalScrollChainingEnabled="False" SelectionMode="None">
                    <GridView.GroupStyle><GroupStyle HeaderTemplate="{StaticResource ZoomedInGroupHeaderTemplate}" /></GridView.GroupStyle>
                  </GridView>
                </SemanticZoom.ZoomedInView>
                <SemanticZoom.ZoomedOutView>
                  <ListView GotFocus="List_GotFocus" ItemTemplate="{StaticResource ZoomedOutTemplate}" ItemsSource="{x:Bind cvsGroups.View.CollectionGroups, Mode=OneWay}" SelectionMode="None" />
                </SemanticZoom.ZoomedOutView>
              </SemanticZoom>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import Button from '../../components/Button.vue'
import CollectionViewSource from '../../components/CollectionViewSource'
import ControlExample from '../../components/ControlExample.vue'
import FontIcon from '../../components/FontIcon.vue'
import GridView from '../../components/GridView.vue'
import ListView from '../../components/ListView.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import SemanticZoom from '../../components/SemanticZoom.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { CollectionGroupStyle as GroupStyle, DataTemplate } from '../../components/CollectionProperties'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
import officialGroups from '../samples/SemanticZoom/ControlInfoGroups.json'
import sample from '../samples/SemanticZoom/SimpleSemanticzoom.txt?raw'
import codeBehind from '../samples/SemanticZoom/SemanticZoomPage.xaml.cs?raw'
const { t } = useI18n()
const currentPage = inject<{ value: string }>('currentPage')
const { pageTheme, isFavoriteState, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'semanticzoom')
const pageTitle = computed(() => t('text.semanticzoom'))
const pageDescription = computed(() => t('text.semanticzoom-description'))
const sampleHeader = computed(() => t('sample.semanticzoom.simple'))
const themeLabel = computed(() => t('gallery.page-header.toggle-theme'))
const favoriteLabel = computed(() => t('gallery.page-header.favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
// The ordering and stable identities are copied from the local official
// ControlInfoData.json; all visible titles and descriptions live in resources.
const Groups = computed(() => officialGroups.map(group => ({
  UniqueId: group.UniqueId, Title: t(group.TitleKey), Items: group.Items.map(item => ({
    UniqueId: item.UniqueId, Title: t(item.TitleKey), Subtitle: t(item.SubtitleKey)
  }))
})))
const sampleXaml = sample.split('--- xaml')[1]?.trim() ?? ''
const sampleCSharp = codeBehind
const List_GotFocus = (sender: { SemanticZoomOwner?: { StartBringIntoView?: () => void } }) => sender?.SemanticZoomOwner?.StartBringIntoView?.()
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
</style>
