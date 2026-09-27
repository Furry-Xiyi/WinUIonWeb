<template>
  <Page>
    <Page.Resources>
      <CommandBarFlyout x:Name="CommandBarFlyout1" Placement="Right">
        <CommandBarFlyout.PrimaryCommands>
          <AppBarButton Click="OnElementClicked" Icon="Share" Label="{x:Bind Labels.Share, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.Share, Mode=OneWay}" />
          <AppBarButton Click="OnElementClicked" Icon="Save" Label="{x:Bind Labels.Save, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.Save, Mode=OneWay}" />
          <AppBarButton Click="OnElementClicked" Icon="Delete" Label="{x:Bind Labels.Delete, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.Delete, Mode=OneWay}" />
        </CommandBarFlyout.PrimaryCommands>
        <CommandBarFlyout.SecondaryCommands>
          <AppBarButton Click="OnElementClicked" Label="{x:Bind Labels.Resize, Mode=OneWay}" />
          <AppBarButton Click="OnElementClicked" Label="{x:Bind Labels.Move, Mode=OneWay}" />
        </CommandBarFlyout.SecondaryCommands>
      </CommandBarFlyout>
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
          <ControlExample class="commandbar-flyout-example" SampleDefinition="CommandBarFlyout\CommandbarflyoutCommandsAppObject.txt" HeaderText="{x:Bind Labels.Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind CommandBarFlyoutXaml}" CSharp="{x:Bind CommandBarFlyoutCSharp}">
            <ControlExample.Example>
              <StackPanel>
                <TextBlock Text="{x:Bind Labels.ImageHint, Mode=OneWay}" TextWrapping="Wrap" />
                <Button x:Name="myImageButton" Margin="0,12" Padding="0" AutomationProperties.Name="{x:Bind Labels.Mountain, Mode=OneWay}" Click="MyImageButton_Click" ContextRequested="MyImageButton_ContextRequested">
                  <Image x:Name="Image1" Height="300" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg" />
                </Button>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock x:Name="SelectedOptionText" Text="{x:Bind SelectedOptionOutput, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </div>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, ref, shallowReactive } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import Button from '../../components/Button.vue';
import CommandBarFlyout from '../../components/CommandBarFlyout.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import Image from '../../components/Image.vue';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import commandBarFlyoutDefinition from '../samples/CommandBarFlyout/CommandbarflyoutCommandsAppObject.txt?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'commandbarflyout');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  PageTitle: t('text.commandbarflyout'), Description: t('text.the-commandbarflyout-lets-you-provide-users-with'), ToggleTheme: t('gallery.page-header.toggle-theme'), Header: t('sample.commandbarflyout.object'),
  Share: t('text.share'), Save: t('text.save'), Delete: t('text.delete'), Resize: t('sample.commandbarflyout.resize'), Move: t('sample.commandbarflyout.move'), ImageHint: t('sample.commandbarflyout.open-hint'), Mountain: t('sample.commandbarflyout.mountain')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const clickedLabel = ref('');
const OnElementClicked = (sender) => { clickedLabel.value = sender?.Label || ''; };
const SelectedOptionOutput = computed(() => clickedLabel.value ? t('sample.you-clicked', { name: clickedLabel.value }) : '');
const ShowMenu = (isTransient) => Names.CommandBarFlyout1?.ShowAt(Names.Image1, { ShowMode: isTransient ? 'Transient' : 'Standard', Placement: 'RightEdgeAlignedTop' });
const MyImageButton_Click = () => ShowMenu(true);
const MyImageButton_ContextRequested = (_sender, args) => { ShowMenu(false); if (args) args.Handled = true; };
const CommandBarFlyoutXaml = commandBarFlyoutDefinition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '';
const CommandBarFlyoutCSharp = commandBarFlyoutDefinition.split('--- c#')[1]?.split(/\r?\n--- /)[0].trim() ?? '';
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.gallery-item-page { min-width: 0; width: 100%; }
.commandbar-flyout-example :deep(.example-display), .commandbar-flyout-example :deep(.example-output) { min-width: 0; max-width: 100%; }
.commandbar-flyout-example :deep(.example-display .win-btn) { max-width: 100%; overflow: hidden; }
.commandbar-flyout-example :deep(.example-display .win-image) { max-width: 100%; }
.commandbar-flyout-example :deep(.example-output) { overflow-wrap: anywhere; }
</style>
