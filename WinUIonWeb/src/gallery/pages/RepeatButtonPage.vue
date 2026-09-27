<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind Labels.PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
        <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions"><Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button><ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton></div>
      </div>
      <StackPanel class="gallery-page-content">
        <ControlExample SampleDefinition="RepeatButton\RepeatButtonSimple.txt" HeaderText="{x:Bind Labels.SimpleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind RepeatXaml, Mode=OneWay}" CSharp="{x:Bind RepeatCSharp}">
          <ControlExample.Example><StackPanel class="repeat-example" Orientation="Horizontal"><RepeatButton x:Name="Control1" Click="RepeatButton_Click" Content="{x:Bind Labels.ClickAndHold, Mode=OneWay}" IsEnabled="{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}" /><TextBlock x:Name="Control1Output" Margin="8,0,0,0" VerticalAlignment="Center" AutomationProperties.LiveSetting="Polite" AutomationProperties.Name="{x:Bind Labels.ControlOutput, Mode=OneWay}" Text="{x:Bind Output, Mode=OneWay}" TextWrapping="Wrap" /></StackPanel></ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options><CheckBox x:Name="DisableControl1" Content="{x:Bind Labels.DisableRepeatButton, Mode=OneWay}" IsChecked="{x:Bind IsRepeatDisabled, Mode=TwoWay}" /></ControlExample.Options>
          <ControlExample.Substitutions><ControlExampleSubstitution Key="IsEnabled" IsEnabled="{x:Bind DisableControl1.IsChecked.Value, Mode=OneWay}" Value="IsEnabled=&quot;False&quot; " /></ControlExample.Substitutions>
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script>
let repeatClickCount = 0;
export default {};
</script>

<script setup>
import { computed, inject, provide, ref, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import CheckBox from '../../components/CheckBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import RepeatButton from '../../components/RepeatButton.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import repeatDefinition from '../samples/RepeatButton/RepeatButtonSimple.txt?raw';
import RepeatCSharp from '../samples/RepeatButton/RepeatButtonPage.xaml.cs?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'repeatbutton');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({ PageTitle: t('text.repeatbutton'), Description: t('text.a-button-that-raises-its-click-event-repeatedly-ecf7f2'), ToggleTheme: t('gallery.page-header.toggle-theme'), SimpleHeader: t('sample.repeat.simple'), ClickAndHold: t('text.click-and-hold'), ControlOutput: t('sample.button.control-output'), DisableRepeatButton: t('sample.disable-repeatbutton') }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const IsRepeatDisabled = ref(false), clicks = ref(0);
const Output = computed(() => clicks.value ? t('sample.number-of-clicks', { count: clicks.value }) : '');
const RepeatButton_Click = (sender, args) => { clicks.value = ++repeatClickCount; };
const RepeatXaml = computed(() => (repeatDefinition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '').replace('$(IsEnabled)', IsRepeatDisabled.value ? 'IsEnabled="False" ' : ''));
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, IsRepeatDisabled, Output, RepeatButton_Click, RepeatXaml, RepeatCSharp });
</script>

<style scoped>
.gallery-item-page, .page-heading { min-width: 0; width: 100%; }
.page-heading { position: relative; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.repeat-example { min-width: 0; max-width: 100%; }
.repeat-example :deep(> .win-repeat-button) { flex-shrink: 0; }
.repeat-example :deep(> .win-text-block) { min-width: 0; }
</style>
