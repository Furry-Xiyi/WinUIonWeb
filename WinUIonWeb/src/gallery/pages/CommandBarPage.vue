<template>
  <Page>
    <Page.Resources>
      <x:String x:Key="MultipleButtonsSecondaryCommands" xml:space="preserve">
        &lt;AppBarButton Icon="Add" Label="Button 1"&gt;
            &lt;AppBarButton.KeyboardAccelerators&gt;
                &lt;KeyboardAccelerator Modifiers="Control" Key="N" /&gt;
            &lt;/AppBarButton.KeyboardAccelerators&gt;
        &lt;/AppBarButton&gt;
        &lt;AppBarButton Icon="Delete" Label="Button 2"&gt;
            &lt;AppBarButton.KeyboardAccelerators&gt;
                &lt;KeyboardAccelerator Key="Delete" /&gt;
            &lt;/AppBarButton.KeyboardAccelerators&gt;
        &lt;/AppBarButton&gt;
        &lt;AppBarSeparator /&gt;
        &lt;AppBarButton Icon="FontDecrease" Label="Button 3"&gt;
            &lt;AppBarButton.KeyboardAccelerators&gt;
                &lt;KeyboardAccelerator Modifiers="Control" Key="Subtract" /&gt;
            &lt;/AppBarButton.KeyboardAccelerators&gt;
        &lt;/AppBarButton&gt;
        &lt;AppBarButton Icon="FontIncrease" Label="Button 4"&gt;
            &lt;AppBarButton.KeyboardAccelerators&gt;
                &lt;KeyboardAccelerator Modifiers="Control" Key="Add" /&gt;
            &lt;/AppBarButton.KeyboardAccelerators&gt;
        &lt;/AppBarButton&gt;
      </x:String>
    </Page.Resources>
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
        <ControlExample x:Name="Example3" class="commandbar-example" SampleDefinition="CommandBar\CommandBarLabelsSide.txt" HeaderText="{x:Bind Labels.Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind CommandBarXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <CommandBar x:Name="PrimaryCommandBar" DefaultLabelPosition="Right" IsOpen="False">
                <CommandBar.PrimaryCommands>
                  <AppBarButton x:Name="addButton" Click="OnElementClicked" Icon="Add" Label="{x:Bind Labels.Add, Mode=OneWay}"><AppBarButton.KeyboardAccelerators><KeyboardAccelerator Key="A" Modifiers="Control" /></AppBarButton.KeyboardAccelerators></AppBarButton>
                  <AppBarButton x:Name="editButton" Click="OnElementClicked" Icon="Edit" Label="{x:Bind Labels.Edit, Mode=OneWay}"><AppBarButton.KeyboardAccelerators><KeyboardAccelerator Key="E" Modifiers="Control" /></AppBarButton.KeyboardAccelerators></AppBarButton>
                  <AppBarButton x:Name="shareButton" Click="OnElementClicked" Icon="Share" Label="{x:Bind Labels.Share, Mode=OneWay}"><AppBarButton.KeyboardAccelerators><KeyboardAccelerator Key="F4" /></AppBarButton.KeyboardAccelerators></AppBarButton>
                </CommandBar.PrimaryCommands>
                <CommandBar.SecondaryCommands>
                  <AppBarButton x:Name="settingsButton" Click="OnElementClicked" Icon="Setting" Label="{x:Bind Labels.Settings, Mode=OneWay}"><AppBarButton.KeyboardAccelerators><KeyboardAccelerator Key="I" Modifiers="Control" /></AppBarButton.KeyboardAccelerators></AppBarButton>
                </CommandBar.SecondaryCommands>
              </CommandBar>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="SelectedOptionText" Text="{x:Bind SelectedOptionOutput, Mode=OneWay}" Padding="0,8,0,0" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options>
            <StackPanel>
              <TextBlock Text="{x:Bind Labels.ShowOrHide, Mode=OneWay}" TextWrapping="Wrap" />
              <Button Margin="0,12,0,0" Click="OpenButton_Click" Content="{x:Bind Labels.Open, Mode=OneWay}" />
              <Button Margin="0,12,0,0" Click="CloseButton_Click" Content="{x:Bind Labels.Close, Mode=OneWay}" />
              <TextBlock Margin="0,16,0,0" Text="{x:Bind Labels.ModifyContent, Mode=OneWay}" TextWrapping="Wrap" />
              <Button Margin="0,12,0,0" Click="AddSecondaryCommands_Click" Content="{x:Bind Labels.AddSecondary, Mode=OneWay}" />
              <Button Margin="0,12,0,0" Click="RemoveSecondaryCommands_Click" Content="{x:Bind Labels.RemoveSecondary, Mode=OneWay}" />
            </StackPanel>
          </ControlExample.Options>
          <ControlExample.Substitutions>
            <ControlExampleSubstitution Key="IsOpen" IsEnabled="True" Value="{x:Bind PrimaryCommandBar.IsOpen, Mode=OneWay}" />
            <ControlExampleSubstitution Key="IsSticky" IsEnabled="{x:Bind PrimaryCommandBar.IsSticky, Mode=OneWay}" Value=" IsSticky=&quot;True&quot; " />
            <ControlExampleSubstitution Key="MultipleButtonsSecondaryCommands" IsEnabled="{x:Bind MultipleButtons, Mode=OneWay}" Value="{StaticResource MultipleButtonsSecondaryCommands}" />
          </ControlExample.Substitutions>
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, h, inject, onBeforeUnmount, provide, ref, shallowReactive } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import AppBarSeparator from '../../components/AppBarSeparator.vue';
import Button from '../../components/Button.vue';
import CommandBar from '../../components/CommandBar.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { KeyboardAccelerator } from '../../components/MenuFlyoutItems';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import commandBarDefinition from '../samples/CommandBar/CommandBarLabelsSide.txt?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'commandbar');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  PageTitle: t('text.commandbar'), Description: t('text.commandbar-subtitle'), ToggleTheme: t('gallery.page-header.toggle-theme'), Header: t('text.a-command-bar-with-labels-on-the-side-free-float'),
  Add: t('text.add'), Edit: t('text.edit'), Share: t('text.share'), Settings: t('text.settings'),
  ShowOrHide: t('sample.commandbar.show-or-hide'), Open: t('sample.commandbar.open'), Close: t('sample.commandbar.close'), ModifyContent: t('sample.commandbar.modify-content'), AddSecondary: t('sample.commandbar.add-secondary'), RemoveSecondary: t('sample.commandbar.remove-secondary'),
  SecondaryButton1: t('sample.commandbar.button-1'), SecondaryButton2: t('sample.commandbar.button-2'), SecondaryButton3: t('sample.commandbar.button-3'), SecondaryButton4: t('sample.commandbar.button-4')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const clickedLabel = ref('');
const MultipleButtons = ref(false);
const OnElementClicked = (sender) => { clickedLabel.value = sender?.Label || ''; };
const SelectedOptionOutput = computed(() => clickedLabel.value ? t('sample.you-clicked', { name: clickedLabel.value }) : '');
const OpenButton_Click = () => { if (Names.PrimaryCommandBar) { Names.PrimaryCommandBar.IsOpen = true; Names.PrimaryCommandBar.IsSticky = true; } };
const CloseButton_Click = () => { if (Names.PrimaryCommandBar) { Names.PrimaryCommandBar.IsOpen = false; Names.PrimaryCommandBar.IsSticky = false; } };
const extraSpecs = [{ Icon: 'Add', Key: 'N', Modifiers: 'Control' }, { Icon: 'Delete', Key: 'Delete' }, { Icon: 'FontDecrease', Key: 'Subtract', Modifiers: 'Control' }, { Icon: 'FontIncrease', Key: 'Add', Modifiers: 'Control' }];
const extraNode = (spec, index) => h(AppBarButton, { key: `secondaryButton${index + 1}`, Icon: spec.Icon, Label: `{x:Bind Labels.SecondaryButton${index + 1}, Mode=OneWay}`, KeyboardAccelerators: [{ Key: spec.Key, Modifiers: spec.Modifiers || '' }] });
const AddSecondaryCommands_Click = () => {
  const bar = Names.PrimaryCommandBar;
  if (!bar) return;
  if (bar.SecondaryCommands.Count === 1) {
    bar.SecondaryCommands.Add(extraNode(extraSpecs[0], 0));
    bar.SecondaryCommands.Add(extraNode(extraSpecs[1], 1));
    bar.SecondaryCommands.Add(h(AppBarSeparator));
    bar.SecondaryCommands.Add(extraNode(extraSpecs[2], 2));
    bar.SecondaryCommands.Add(extraNode(extraSpecs[3], 3));
  }
  MultipleButtons.value = true;
};
const RemoveSecondaryCommands = () => {
  const commands = Names.PrimaryCommandBar?.SecondaryCommands;
  while (commands?.Count > 1) commands.RemoveAt(commands.Count - 1);
  MultipleButtons.value = false;
};
const RemoveSecondaryCommands_Click = () => RemoveSecondaryCommands();
onBeforeUnmount(RemoveSecondaryCommands);
const codePart = (definition) => definition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '';
const CommandBarXaml = codePart(commandBarDefinition);
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.gallery-item-page { min-width: 0; width: 100%; }
.commandbar-example :deep(.example-display), .commandbar-example :deep(.example-output), .commandbar-example :deep(.example-options) { min-width: 0; }
:global(.commandbar-example .example-display > .win-stack-panel) {
  justify-self: start !important;
  width: max-content !important;
  max-width: 100%;
}
:global(.commandbar-example .example-display > .win-stack-panel .win-commandbar) {
  justify-self: start !important;
  width: max-content !important;
  max-width: 100%;
}
.commandbar-example :deep(.example-options .win-button) { max-width: 100%; white-space: normal; }
.commandbar-example :deep(.example-output) { overflow-wrap: anywhere; }
</style>
