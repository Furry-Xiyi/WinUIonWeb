<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind Labels.PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
        <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions"><Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button><ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton></div>
      </div>
      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" SampleDefinition="HyperlinkButton\HyperlinkButtonNavigate.txt" HeaderText="{x:Bind Labels.NavigateHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind NavigateXaml, Mode=OneWay}">
          <ControlExample.Example><HyperlinkButton x:Name="Control1" Content="{x:Bind Labels.MicrosoftHome, Mode=OneWay}" IsEnabled="{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}" NavigateUri="https://www.microsoft.com" /></ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options><StackPanel><CheckBox x:Name="DisableControl1" Content="{x:Bind Labels.DisableHyperlinkButton, Mode=OneWay}" IsChecked="{x:Bind IsHyperlinkDisabled, Mode=TwoWay}" /></StackPanel></ControlExample.Options>
          <ControlExample.Substitutions><ControlExampleSubstitution Key="IsEnabled" IsEnabled="{x:Bind DisableControl1.IsChecked.Value, Mode=OneWay}" Value="IsEnabled=&quot;False&quot; " /></ControlExample.Substitutions>
        </ControlExample>
        <ControlExample SampleDefinition="HyperlinkButton\HyperlinkButtonClick.txt" HeaderText="{x:Bind Labels.ClickHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind ClickXaml}" CSharp="{x:Bind HyperlinkCSharp}">
          <ControlExample.Example><HyperlinkButton x:Name="Control2" Click="GoToHyperlinkButton_Click" Content="{x:Bind Labels.GoToToggleButton, Mode=OneWay}" /></ControlExample.Example>
          <ControlExample.Output /><ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, provide, ref, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import CheckBox from '../../components/CheckBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import HyperlinkButton from '../../components/HyperlinkButton.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import navigateDefinition from '../samples/HyperlinkButton/HyperlinkButtonNavigate.txt?raw';
import clickDefinition from '../samples/HyperlinkButton/HyperlinkButtonClick.txt?raw';
import HyperlinkCSharp from '../samples/HyperlinkButton/HyperlinkButtonPage.xaml.cs?raw';
const { t } = useI18n();
const currentPage = inject('currentPage'), navigate = inject('navigate', () => {});
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'hyperlinkbutton');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({ PageTitle: t('text.hyperlinkbutton'), Description: t('text.a-button-that-appears-as-a-hyperlink'), ToggleTheme: t('gallery.page-header.toggle-theme'), NavigateHeader: t('sample.hyperlink.navigate'), ClickHeader: t('sample.hyperlink.click'), MicrosoftHome: t('text.microsoft-home-page'), DisableHyperlinkButton: t('sample.disable-hyperlink-button'), GoToToggleButton: t('sample.hyperlink.go-to-togglebutton') }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const IsHyperlinkDisabled = ref(false);
const GoToHyperlinkButton_Click = (sender, args) => navigate('togglebutton');
const codePart = definition => definition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '';
const NavigateXaml = computed(() => codePart(navigateDefinition).replace('$(IsEnabled)', IsHyperlinkDisabled.value ? 'IsEnabled="False" ' : ''));
const ClickXaml = codePart(clickDefinition);
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, IsHyperlinkDisabled, GoToHyperlinkButton_Click, NavigateXaml, ClickXaml, HyperlinkCSharp });
</script>

<style scoped>
.gallery-item-page, .page-heading { min-width: 0; width: 100%; }
.page-heading { position: relative; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
</style>
