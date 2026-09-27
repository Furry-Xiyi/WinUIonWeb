<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind Labels.PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
        <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton>
        </div>
      </div>
      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" class="appbar-example" SampleDefinition="AppBarToggleButton\AppbartogglebuttonSymbolIcon.txt" HeaderText="{x:Bind Labels.SymbolHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SymbolXaml}">
          <ControlExample.Example><StackPanel Orientation="Horizontal"><AppBarToggleButton x:Name="Button1" Click="AppBarButton_Click" Icon="Shuffle" Label="{x:Bind Labels.SymbolLabel, Mode=OneWay}" /></StackPanel></ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control1Output" Text="{x:Bind Output1, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
        <ControlExample x:Name="Example2" class="appbar-example" SampleDefinition="AppBarToggleButton\AppbartogglebuttonBitmapIcon.txt" HeaderText="{x:Bind Labels.BitmapHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind BitmapXaml}">
          <ControlExample.Example><StackPanel Orientation="Horizontal"><AppBarToggleButton x:Name="Button2" Click="AppBarButton_Click" Label="{x:Bind Labels.BitmapLabel, Mode=OneWay}"><AppBarToggleButton.Icon><BitmapIcon UriSource="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices2.png" /></AppBarToggleButton.Icon></AppBarToggleButton></StackPanel></ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control2Output" Text="{x:Bind Output2, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
        <ControlExample x:Name="Example3" class="appbar-example" SampleDefinition="AppBarToggleButton\AppbartogglebuttonFontIcon.txt" HeaderText="{x:Bind Labels.FontHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind FontXaml}">
          <ControlExample.Example><StackPanel Orientation="Horizontal"><AppBarToggleButton x:Name="Button3" Click="AppBarButton_Click" Label="{x:Bind Labels.FontLabel, Mode=OneWay}"><AppBarToggleButton.Icon><FontIcon FontFamily="Candara" Glyph="&#x03A3;" /></AppBarToggleButton.Icon></AppBarToggleButton></StackPanel></ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control3Output" Text="{x:Bind Output3, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
        <ControlExample x:Name="Example4" class="appbar-example" SampleDefinition="AppBarToggleButton\ThreeStateAppbartogglebuttonPath.txt" HeaderText="{x:Bind Labels.PathHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind PathXaml}">
          <ControlExample.Example><StackPanel Orientation="Horizontal"><AppBarToggleButton x:Name="Button4" Click="AppBarButton_Click" IsThreeState="True" Label="{x:Bind Labels.PathLabel, Mode=OneWay}"><AppBarToggleButton.Content><Viewbox><PathIcon Data="F1 M 20,20L 24,10L 24,24L 5,24" /></Viewbox></AppBarToggleButton.Content></AppBarToggleButton></StackPanel></ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control4Output" Text="{x:Bind Output4, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, provide, ref, shallowReactive } from 'vue';
import AppBarToggleButton from '../../components/AppBarToggleButton.vue';
import BitmapIcon from '../../components/BitmapIcon.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import PathIcon from '../../components/PathIcon.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import Viewbox from '../../components/Viewbox.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import symbolDefinition from '../samples/AppBarToggleButton/AppbartogglebuttonSymbolIcon.txt?raw';
import bitmapDefinition from '../samples/AppBarToggleButton/AppbartogglebuttonBitmapIcon.txt?raw';
import fontDefinition from '../samples/AppBarToggleButton/AppbartogglebuttonFontIcon.txt?raw';
import pathDefinition from '../samples/AppBarToggleButton/ThreeStateAppbartogglebuttonPath.txt?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'toggleappbarbutton');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  PageTitle: t('text.appbar-toggle-button'), Description: t('text.appbar-toggle-button-description'), ToggleTheme: t('gallery.page-header.toggle-theme'),
  SymbolHeader: t('sample.appbartogglebutton.symbol'), BitmapHeader: t('sample.appbartogglebutton.bitmap'), FontHeader: t('sample.appbartogglebutton.font'), PathHeader: t('sample.appbartogglebutton.path'),
  SymbolLabel: t('sample.appbarbutton.symbol-label'), BitmapLabel: t('sample.appbarbutton.bitmap-label'), FontLabel: t('sample.appbarbutton.font-label'), PathLabel: t('sample.appbarbutton.path-label')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const clicked = ref([false, false, false, false]);
const AppBarButton_Click = (sender) => {
  const index = Number(String(sender?.Name).replace('Button', '')) - 1;
  if (index >= 0 && index < clicked.value.length) clicked.value[index] = true;
};
const output = (index) => {
  if (!clicked.value[index]) return '';
  const value = Names[`Button${index + 1}`]?.IsChecked;
  return t('sample.appbartogglebutton.output', { value: value === null ? '' : t(value ? 'sample.appbartogglebutton.state.true' : 'sample.appbartogglebutton.state.false') });
};
const Output1 = computed(() => output(0)), Output2 = computed(() => output(1)), Output3 = computed(() => output(2)), Output4 = computed(() => output(3));
const codePart = (definition) => definition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '';
const SymbolXaml = codePart(symbolDefinition), BitmapXaml = codePart(bitmapDefinition), FontXaml = codePart(fontDefinition), PathXaml = codePart(pathDefinition);
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.gallery-item-page { min-width: 0; width: 100%; }
.appbar-example :deep(.example-display), .appbar-example :deep(.example-output) { min-width: 0; }
.appbar-example :deep(.example-output) { overflow-wrap: anywhere; }
</style>
