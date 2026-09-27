<template>
  <Page>
    <Page.Resources>
      <Style x:Key="HorizontalSwipe" BasedOn="{StaticResource ListViewItemRevealStyle}" TargetType="ListViewItem">
        <Setter Property="Height" Value="60" />
        <Setter Property="Padding" Value="0" />
        <Setter Property="HorizontalContentAlignment" Value="Stretch" />
        <Setter Property="VerticalContentAlignment" Value="Stretch" />
        <Setter Property="BorderThickness" Value="0" />
      </Style>
      <XamlUICommand x:Name="CustomXamlUICommand" Description="{x:Bind Labels.CommandDescription, Mode=OneWay}" ExecuteRequested="CustomXamlUICommand_ExecuteRequested" Label="{x:Bind Labels.CommandLabel, Mode=OneWay}">
        <XamlUICommand.IconSource>
          <SymbolIconSource Symbol="Favorite" />
        </XamlUICommand.IconSource>
        <XamlUICommand.KeyboardAccelerators>
          <KeyboardAccelerator Key="D" Modifiers="Control" />
        </XamlUICommand.KeyboardAccelerators>
      </XamlUICommand>
    </Page.Resources>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.Title, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" TextWrapping="Wrap" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}">
              <FontIcon Glyph="&#xE793;" FontSize="16" />
            </Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}">
              <FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample
            SampleDefinition="XamlUICommand\CreatingReusableCommandXamluicommand.txt"
            HeaderText="{x:Bind Labels.SampleHeader, Mode=OneWay}"
            HorizontalContentAlignment="Stretch"
            Theme="{x:Bind pageTheme, Mode=OneWay}"
            Xaml="{x:Bind ExampleXaml}"
            CSharp="{x:Bind ExampleCSharp}">
            <ControlExample.Example>
              <Grid x:Name="rootGrid">
                <Grid.RowDefinitions>
                  <RowDefinition Height="Auto" />
                  <RowDefinition Height="Auto" />
                  <RowDefinition Height="*" />
                </Grid.RowDefinitions>
                <TextBlock Margin="0,0,0,12" TextWrapping="Wrap" Text="{x:Bind Labels.SampleDescription, Mode=OneWay}" />
                <RelativePanel Grid.Row="1">
                  <AppBarButton x:Name="CustomButton" Command="{StaticResource CustomXamlUICommand}" />
                  <TextBlock x:Name="XamlUICommandOutput" Margin="8,0,0,0" FontFamily="Global User Interface" RelativePanel.AlignVerticalCenterWith="CustomButton" RelativePanel.RightOf="CustomButton" Text="{x:Bind CommandOutput, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" />
                </RelativePanel>
              </Grid>
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
import { computed, inject, provide, ref, shallowReactive } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import Button from '../../components/Button.vue';
import { XamlSetter as Setter, XamlStyle as Style } from '../../components/CollectionProperties';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import Grid from '../../components/Grid.vue';
import { SymbolIconSource } from '../../components/IconSource';
import { useI18n } from '../../components/i18n/index';
import { KeyboardAccelerator } from '../../components/MenuFlyoutItems';
import Page from '../../components/Page.vue';
import RelativePanel from '../../components/RelativePanel.vue';
import RowDefinition from '../../components/RowDefinition.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { XamlUICommandElement as XamlUICommand } from '../../components/UICommandProperties';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import ExampleXaml from '../samples/XamlUICommand/XamlUICommandSample1_xaml.txt?raw';
import ExampleCSharp from '../samples/XamlUICommand/XamlUICommandSample1_cs.txt?raw';

const { t } = useI18n();
const currentPage = inject<{ value: string }>('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'xamluicommand');
const Names = shallowReactive<Record<string, any>>({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  Title: t('text.xamluicommand'), Description: t('text.xamluicommand-subtitle'),
  ToggleTheme: t('gallery.page-header.toggle-theme'),
  SampleHeader: t('sample.xamluicommand.reusable-command'), SampleDescription: t('sample.xamluicommand.description'),
  CommandLabel: t('sample.xamluicommand.custom-label'), CommandDescription: t('sample.xamluicommand.custom-description')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const fired = ref(false);
const CommandOutput = computed(() => fired.value ? t('sample.xamluicommand.executed') : '');
const CustomXamlUICommand_ExecuteRequested = () => { fired.value = true; };
provide(xamlScopeKey, {
  Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  CommandOutput, CustomXamlUICommand_ExecuteRequested, ExampleXaml, ExampleCSharp
});
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { margin: 0 72px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-item-page, .gallery-page-content { min-width: 0; max-width: 100%; }
</style>
