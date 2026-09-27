<template>
  <Page>
    <Page.Resources>
      <Style x:Key="HorizontalSwipe" BasedOn="{StaticResource DefaultListViewItemStyle}" TargetType="ListViewItem">
        <Setter Property="Height" Value="60" />
        <Setter Property="Padding" Value="0" />
        <Setter Property="HorizontalContentAlignment" Value="Stretch" />
        <Setter Property="VerticalContentAlignment" Value="Stretch" />
        <Setter Property="BorderThickness" Value="0" />
      </Style>
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
            SampleDefinition="StandardUICommand\StandardUICommandExposingCommandMultipleControls.txt"
            HeaderText="{x:Bind Labels.SampleHeader, Mode=OneWay}"
            HorizontalContentAlignment="Stretch"
            Theme="{x:Bind pageTheme, Mode=OneWay}"
            Loaded="ControlExample_Loaded"
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
                <MenuBar Grid.Row="1">
                  <MenuBarItem Title="{x:Bind Labels.File, Mode=OneWay}">
                    <MenuFlyoutItem Text="{x:Bind Labels.New, Mode=OneWay}" />
                    <MenuFlyoutItem Text="{x:Bind Labels.Open, Mode=OneWay}" />
                    <MenuFlyoutItem Text="{x:Bind Labels.Save, Mode=OneWay}" />
                    <MenuFlyoutItem Text="{x:Bind Labels.Exit, Mode=OneWay}" />
                  </MenuBarItem>
                  <MenuBarItem Title="{x:Bind Labels.Edit, Mode=OneWay}">
                    <MenuFlyoutItem x:Name="DeleteFlyoutItem" />
                  </MenuBarItem>
                  <MenuBarItem Title="{x:Bind Labels.Help, Mode=OneWay}">
                    <MenuFlyoutItem Text="{x:Bind Labels.About, Mode=OneWay}" />
                  </MenuBarItem>
                </MenuBar>
                <ListView
                  x:Name="ListViewRight"
                  Grid.Row="2"
                  Height="500"
                  ContainerContentChanging="ListViewRight_ContainerContentChanging"
                  IsItemClickEnabled="True"
                  ItemContainerStyle="{StaticResource HorizontalSwipe}"
                  Loaded="ListView_Loaded"
                  SelectionMode="Single"
                  AutomationProperties.Name="{x:Bind Labels.Items, Mode=OneWay}">
                  <ListView.ItemTemplate>
                    <DataTemplate x:DataType="local:ListItemData">
                      <UserControl PointerEntered="ListViewSwipeContainer_PointerEntered" PointerExited="ListViewSwipeContainer_PointerExited">
                        <Grid AutomationProperties.Name="{x:Bind Text}">
                          <SwipeControl x:Name="ListViewSwipeContainer">
                            <SwipeControl.RightItems>
                              <SwipeItems Mode="Execute">
                                <SwipeItem x:Name="DeleteSwipeItem" Background="Red" Command="{x:Bind Command}" CommandParameter="{x:Bind Text}" />
                              </SwipeItems>
                            </SwipeControl.RightItems>
                            <Grid VerticalAlignment="Center">
                              <TextBlock Margin="10" HorizontalAlignment="Left" VerticalAlignment="Center" FontSize="18" Text="{x:Bind Text}" />
                              <AppBarButton x:Name="HoverButton" HorizontalAlignment="Right" Command="{x:Bind Command}" CommandParameter="{x:Bind Text}" IsTabStop="False" Visibility="Collapsed" />
                            </Grid>
                          </SwipeControl>
                          <VisualStateManager.VisualStateGroups>
                            <VisualStateGroup x:Name="HoveringStates">
                              <VisualState x:Name="HoverButtonsHidden" />
                              <VisualState x:Name="HoverButtonsShown">
                                <VisualState.Setters>
                                  <Setter Target="HoverButton.Visibility" Value="Visible" />
                                </VisualState.Setters>
                              </VisualState>
                            </VisualStateGroup>
                          </VisualStateManager.VisualStateGroups>
                        </Grid>
                      </UserControl>
                    </DataTemplate>
                  </ListView.ItemTemplate>
                </ListView>
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
import { computed, h, inject, markRaw, onBeforeUnmount, provide, shallowReactive, watch } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import Button from '../../components/Button.vue';
import { DataTemplate, XamlSetter as Setter, XamlStyle as Style } from '../../components/CollectionProperties';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import Grid from '../../components/Grid.vue';
import { useI18n } from '../../components/i18n/index';
import ListView from '../../components/ListView.vue';
import MenuBar from '../../components/MenuBar.vue';
import MenuBarItem from '../../components/MenuBarItem.vue';
import MenuFlyout from '../../components/MenuFlyout.vue';
import { MenuFlyoutItem } from '../../components/MenuFlyoutItems';
import Page from '../../components/Page.vue';
import RowDefinition from '../../components/RowDefinition.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import { StandardUICommand } from '../../components/StandardUICommand';
import SwipeControl from '../../components/SwipeControl.vue';
import { SwipeItem, SwipeItems } from '../../components/SwipeControlProperties';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import UserControl from '../../components/UserControl';
import { VisualState, VisualStateGroup, VisualStateManager, type VisualStateControl } from '../../components/VisualStateManager';
import type { ExecuteRequestedEventArgs, XamlUICommand } from '../../components/XamlUICommand';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import ExampleXaml from '../samples/StandardUICommand/StandardUICommandSample1_xaml.txt?raw';
import ExampleCSharp from '../samples/StandardUICommand/StandardUICommandSample1_cs.txt?raw';

interface ListItemData { Index: number; Text: string; Command: StandardUICommand }
interface ListViewApi { ItemsSource: ListItemData[]; SelectedIndex: number }
interface ItemContainer { IsSelected: boolean; ContextFlyout: ReturnType<typeof h> }

const { t } = useI18n();
const currentPage = inject<{ value: string }>('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'standarduicommand');
const Names = shallowReactive<Record<string, any>>({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  Title: t('text.standarduicommand'), Description: t('text.standarduicommand-subtitle'),
  ToggleTheme: t('gallery.page-header.toggle-theme'),
  SampleHeader: t('sample.standarduicommand.multiple-controls'), SampleDescription: t('sample.standarduicommand.description'),
  File: t('MenuBarSample_File.Title'), Edit: t('MenuBarSample_Edit.Title'), Help: t('MenuBarSample_Help.Title'),
  New: t('sample.standarduicommand.new'), Open: t('sample.standarduicommand.open'), Save: t('text.save'),
  Exit: t('sample.standarduicommand.exit'), About: t('text.about'), Items: t('sample.standarduicommand.items')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const collection = shallowReactive<ListItemData[]>([]);
let deleteCommand: StandardUICommand | undefined;
let detachAccelerator: (() => void) | undefined;

const DeleteCommand_ExecuteRequested = (_sender: XamlUICommand, args: ExecuteRequestedEventArgs) => {
  const parameterIndex = args.Parameter == null ? -1 : collection.findIndex(item => item.Text === args.Parameter);
  const selectedIndex = Number(Names.ListViewRight?.SelectedIndex ?? -1);
  const index = parameterIndex >= 0 ? parameterIndex : selectedIndex;
  if (index >= 0 && index < collection.length) collection.splice(index, 1);
};
const ListView_Loaded = (sender: ListViewApi) => { sender.ItemsSource = collection; };
const ControlExample_Loaded = () => {
  if (deleteCommand) return;
  deleteCommand = markRaw(new StandardUICommand('Delete'));
  deleteCommand.addEventListener('ExecuteRequested', DeleteCommand_ExecuteRequested);
  Names.DeleteFlyoutItem.Command = deleteCommand;
  for (let index = 0; index < 15; index += 1) {
    collection.push(shallowReactive({ Index: index, Text: t('sample.standarduicommand.list-item', { index }), Command: deleteCommand }));
  }
  detachAccelerator = deleteCommand.AttachKeyboardAccelerators();
};
const ListViewRight_ContainerContentChanging = (_sender: ListViewApi, args: { Item: ListItemData; ItemContainer: ItemContainer }) => {
  args.ItemContainer.ContextFlyout = h(MenuFlyout, {
    onOpened: () => { args.ItemContainer.IsSelected = true; }
  }, { default: () => [h(MenuFlyoutItem, { Command: args.Item.Command })] });
};
const ListViewSwipeContainer_PointerEntered = (sender: VisualStateControl, args: { Pointer: { PointerDeviceType: string } }) => {
  if (args.Pointer.PointerDeviceType === 'Mouse' || args.Pointer.PointerDeviceType === 'Pen') {
    VisualStateManager.GoToState(sender, 'HoverButtonsShown', true);
  }
};
const ListViewSwipeContainer_PointerExited = (sender: VisualStateControl) => {
  VisualStateManager.GoToState(sender, 'HoverButtonsHidden', true);
};
watch(() => t('sample.standarduicommand.list-item', { index: 0 }), () => {
  collection.forEach(item => { item.Text = t('sample.standarduicommand.list-item', { index: item.Index }); });
});
onBeforeUnmount(() => {
  detachAccelerator?.();
  deleteCommand?.removeEventListener('ExecuteRequested', DeleteCommand_ExecuteRequested);
});
provide(xamlScopeKey, {
  Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  ExampleXaml, ExampleCSharp, ControlExample_Loaded, ListView_Loaded, ListViewRight_ContainerContentChanging,
  ListViewSwipeContainer_PointerEntered, ListViewSwipeContainer_PointerExited
});
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { margin: 0 72px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-item-page, .gallery-page-content { min-width: 0; max-width: 100%; }
</style>
