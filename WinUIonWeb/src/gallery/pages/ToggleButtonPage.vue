<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind Labels.PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
        <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions"><Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button><ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton></div>
      </div>
      <StackPanel class="gallery-page-content">
        <ControlExample SampleDefinition="ToggleButton\ToggleButtonSimple.txt" HeaderText="{x:Bind Labels.SimpleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind ToggleXaml, Mode=OneWay}" CSharp="{x:Bind ToggleCSharp}">
          <ControlExample.Example><StackPanel VerticalAlignment="Top" Orientation="Horizontal"><ToggleButton x:Name="Toggle1" Checked="ToggleButton_Checked" Content="{x:Bind Labels.PageTitle, Mode=OneWay}" IsEnabled="{x:Bind DisableToggle1.IsChecked.Value.Equals(x:False), Mode=OneWay}" Unchecked="ToggleButton_Unchecked" /></StackPanel></ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control1Output" Text="{x:Bind Output, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options><StackPanel><CheckBox x:Name="DisableToggle1" Content="{x:Bind Labels.DisableToggleButton, Mode=OneWay}" IsChecked="{x:Bind IsToggleDisabled, Mode=TwoWay}" /></StackPanel></ControlExample.Options>
          <ControlExample.Substitutions><ControlExampleSubstitution Key="IsEnabled" IsEnabled="{x:Bind DisableToggle1.IsChecked.Value, Mode=OneWay}" Value="IsEnabled=&quot;False&quot; " /></ControlExample.Substitutions>
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
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import toggleDefinition from '../samples/ToggleButton/ToggleButtonSimple.txt?raw';
import ToggleCSharp from '../samples/ToggleButton/ToggleButtonPage.xaml.cs?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'togglebutton');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({ PageTitle: t('text.togglebutton'), Description: t('text.a-togglebutton-looks-like-a-button-but-works-lik'), ToggleTheme: t('gallery.page-header.toggle-theme'), SimpleHeader: t('sample.togglebutton.simple'), DisableToggleButton: t('sample.disable-togglebutton') }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const IsToggleDisabled = ref(false), IsToggleChecked = ref(false);
const Output = computed(() => t(IsToggleChecked.value ? 'sample.togglebutton.on' : 'sample.togglebutton.off'));
const ToggleButton_Checked = (sender, args) => { IsToggleChecked.value = true; };
const ToggleButton_Unchecked = (sender, args) => { IsToggleChecked.value = false; };
const ToggleXaml = computed(() => (toggleDefinition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '').replace('$(IsEnabled)', IsToggleDisabled.value ? 'IsEnabled="False" ' : ''));
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, IsToggleDisabled, Output, ToggleButton_Checked, ToggleButton_Unchecked, ToggleXaml, ToggleCSharp });
</script>

<style scoped>
.gallery-item-page, .page-heading { min-width: 0; width: 100%; }
.page-heading { position: relative; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
</style>
