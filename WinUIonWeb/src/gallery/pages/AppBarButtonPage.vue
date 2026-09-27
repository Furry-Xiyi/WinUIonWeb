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
        <ControlExample x:Name="Example1" class="appbar-example" SampleDefinition="AppBarButton\AppbarbuttonSymbolIcon.txt" HeaderText="{x:Bind Labels.SymbolHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SymbolXaml}">
          <ControlExample.Example><StackPanel Orientation="Horizontal"><AppBarButton x:Name="Button1" Click="AppBarButton_Click" Icon="Like" Label="{x:Bind Labels.SymbolLabel, Mode=OneWay}" /></StackPanel></ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control1Output" Text="{x:Bind Output1, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
        <ControlExample x:Name="Example2" class="appbar-example" SampleDefinition="AppBarButton\AppbarbuttonBitmapIcon.txt" HeaderText="{x:Bind Labels.BitmapHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind BitmapXaml}">
          <ControlExample.Example>
            <StackPanel Orientation="Horizontal"><AppBarButton x:Name="Button2" Click="AppBarButton_Click" Label="{x:Bind Labels.BitmapLabel, Mode=OneWay}"><AppBarButton.Icon><BitmapIcon UriSource="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices2.png" /></AppBarButton.Icon></AppBarButton></StackPanel>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control2Output" Text="{x:Bind Output2, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
        <ControlExample x:Name="Example3" class="appbar-example" SampleDefinition="AppBarButton\AppbarbuttonFontIcon.txt" HeaderText="{x:Bind Labels.FontHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind FontXaml}">
          <ControlExample.Example>
            <StackPanel Orientation="Horizontal"><AppBarButton x:Name="Button3" Click="AppBarButton_Click" Label="{x:Bind Labels.FontLabel, Mode=OneWay}"><AppBarButton.Icon><FontIcon FontFamily="Candara" Glyph="&#x03A3;" /></AppBarButton.Icon></AppBarButton></StackPanel>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control3Output" Text="{x:Bind Output3, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
        <ControlExample x:Name="Example4" class="appbar-example" SampleDefinition="AppBarButton\AppbarbuttonPathIcon.txt" HeaderText="{x:Bind Labels.PathHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind PathXaml}">
          <ControlExample.Example>
            <StackPanel Orientation="Horizontal"><AppBarButton x:Name="Button4" Click="AppBarButton_Click" Label="{x:Bind Labels.PathLabel, Mode=OneWay}"><AppBarButton.Content><Viewbox Stretch="Uniform"><PathIcon Data="F1 M 20,20L 24,10L 24,24L 5,24" /></Viewbox></AppBarButton.Content></AppBarButton></StackPanel>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control4Output" Text="{x:Bind Output4, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
        <ControlExample x:Name="Example5" class="appbar-example" SampleDefinition="AppBarButton\AppbarbuttonKeyboardaccelerator.txt" HeaderText="{x:Bind Labels.KeyboardHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind KeyboardXaml}">
          <ControlExample.Example>
            <StackPanel Orientation="Horizontal"><AppBarButton x:Name="Button5" Click="AppBarButton_Click" Icon="Save" Label="{x:Bind Labels.Save, Mode=OneWay}"><AppBarButton.KeyboardAccelerators><KeyboardAccelerator Key="S" Modifiers="Control" /></AppBarButton.KeyboardAccelerators></AppBarButton></StackPanel>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control5Output" Text="{x:Bind Output5, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
        <ControlExample x:Name="Example6" class="appbar-example" SampleDefinition="AppBarButton\AppbarbuttonOpensFlyoutContaining.txt" HeaderText="{x:Bind Labels.FlyoutHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind FlyoutXaml}">
          <ControlExample.Example>
            <StackPanel Orientation="Horizontal"><AppBarButton AllowFocusOnInteraction="True" Icon="Edit" Label="{x:Bind Labels.Edit, Mode=OneWay}"><AppBarButton.Flyout><Flyout><TextBox MinWidth="240" PlaceholderText="{x:Bind Labels.InputPlaceholder, Mode=OneWay}" /></Flyout></AppBarButton.Flyout></AppBarButton></StackPanel>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, provide, ref, shallowReactive } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import BitmapIcon from '../../components/BitmapIcon.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import Flyout from '../../components/Flyout.vue';
import FontIcon from '../../components/FontIcon.vue';
import PathIcon from '../../components/PathIcon.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import TextBox from '../../components/TextBox.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import Viewbox from '../../components/Viewbox.vue';
import { KeyboardAccelerator } from '../../components/MenuFlyoutItems';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import symbolDefinition from '../samples/AppBarButton/AppbarbuttonSymbolIcon.txt?raw';
import bitmapDefinition from '../samples/AppBarButton/AppbarbuttonBitmapIcon.txt?raw';
import fontDefinition from '../samples/AppBarButton/AppbarbuttonFontIcon.txt?raw';
import pathDefinition from '../samples/AppBarButton/AppbarbuttonPathIcon.txt?raw';
import keyboardDefinition from '../samples/AppBarButton/AppbarbuttonKeyboardaccelerator.txt?raw';
import flyoutDefinition from '../samples/AppBarButton/AppbarbuttonOpensFlyoutContaining.txt?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'appbarbutton');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  PageTitle: t('text.appbarbutton'), Description: t('text.appbarbutton-description'), ToggleTheme: t('gallery.page-header.toggle-theme'),
  SymbolHeader: t('sample.appbarbutton.symbol'), BitmapHeader: t('sample.appbarbutton.bitmap'), FontHeader: t('sample.appbarbutton.font'), PathHeader: t('sample.appbarbutton.path'), KeyboardHeader: t('sample.appbarbutton.keyboard'), FlyoutHeader: t('sample.appbarbutton.flyout'),
  SymbolLabel: t('sample.appbarbutton.symbol-label'), BitmapLabel: t('sample.appbarbutton.bitmap-label'), FontLabel: t('sample.appbarbutton.font-label'), PathLabel: t('sample.appbarbutton.path-label'), Save: t('text.save'), Edit: t('text.edit'), InputPlaceholder: t('sample.appbarbutton.input-placeholder')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const clickedNames = ref(['', '', '', '', '']);
const AppBarButton_Click = (sender) => {
  const name = sender?.Name;
  const index = Number(String(name).replace('Button', '')) - 1;
  if (index >= 0 && index < clickedNames.value.length) clickedNames.value[index] = name;
};
const output = (index) => clickedNames.value[index] ? t('sample.you-clicked', { name: clickedNames.value[index] }) : '';
const Output1 = computed(() => output(0)), Output2 = computed(() => output(1)), Output3 = computed(() => output(2)), Output4 = computed(() => output(3)), Output5 = computed(() => output(4));
const codePart = (definition) => definition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '';
const SymbolXaml = codePart(symbolDefinition), BitmapXaml = codePart(bitmapDefinition), FontXaml = codePart(fontDefinition), PathXaml = codePart(pathDefinition), KeyboardXaml = codePart(keyboardDefinition), FlyoutXaml = codePart(flyoutDefinition);
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
