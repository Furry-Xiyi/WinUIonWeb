<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.standarduicommand')" role="heading" aria-level="1" />
        <TextBlock class="page-description" :Text="$t('text.standarduicommand-subtitle')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" @Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
          <ToggleButton class="header-action" :IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite">
            <TextBlock class="icon" :Text="isFavoriteState ? '\uE735' : '\uE734'" />
          </ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.standarduicommand.multiple-controls')"
          HorizontalContentAlignment="Stretch"
          :theme="pageTheme"
          :vue="exampleCode"
          :xaml="exampleXaml"
          :cSharp="exampleCSharp">
          <template #example>
            <StackPanel Width="100%">
              <TextBlock
                :Text="$t('sample.standarduicommand.description')"
                Margin="0,0,0,12"
                TextWrapping="Wrap" />

              <MenuBar :Items="menuItems" :Theme="pageTheme" />

              <ListView
                v-model:SelectedItems="selectedItems"
                :ItemsSource="listItems"
                :ItemContainerStyle="horizontalSwipeStyle"
                :IsItemClickEnabled="true"
                Height="500"
                SelectionMode="Single"
                :aria-label="$t('sample.standarduicommand.items')">
                <template #item="{ item }">
                  <SwipeControl
                    Width="100%"
                    Height="60"
                    :RightItems="getDeleteSwipeItems(item.Text)"
                    @ContextRequested="openContextMenu($event, item.Text)"
                    @PointerEntered="hoveredItem = item.Text"
                    @PointerExited="hoveredItem = ''">
                    <Grid class="standard-command-row" ColumnDefinitions="*,Auto" RowDefinitions="60">
                      <TextBlock class="standard-command-text" :Text="item.Text" Margin="10" FontSize="18" />
                      <AppBarButton
                        class="standard-command-delete"
                        :Command="deleteCommand"
                        :CommandParameter="item.Text"
                        :Visibility="hoveredItem === item.Text ? 'Visible' : 'Collapsed'"
                        HorizontalAlignment="Right"
                        v-bind="{ 'AutomationProperties.Name': deleteCommand.Label }"
                        @pointerdown.stop
                        @Click="onDeleteButtonClick(item.Text)" />
                    </Grid>
                  </SwipeControl>
                </template>
              </ListView>

              <MenuFlyout
                :Open="contextMenuOpen"
                :AnchorRect="contextMenuAnchor"
                :Items="contextMenuItems"
                :Theme="pageTheme"
                Placement="RightEdgeAlignedTop"
                @Close="contextMenuOpen = false" />
            </StackPanel>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import Grid from '../../components/Grid.vue';
import { useI18n } from '../../components/i18n/index';
import ListView from '../../components/ListView.vue';
import MenuBar from '../../components/MenuBar.vue';
import MenuFlyout from '../../components/MenuFlyout.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import SwipeControl from '../../components/SwipeControl.vue';
import type { SwipeItems } from '../../components/SwipeControl.types';
import { StandardUICommand } from '../../components/StandardUICommand';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject<{ value: string }>('currentPage');
const { t } = useI18n();
const pageKey = computed(() => currentPage?.value || 'standarduicommand');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const listItems = ref(Array.from({ length: 15 }, (_, index) => ({ Text: t('sample.standarduicommand.list-item', { index }) })));
const selectedItems = ref<{ Text: string }[]>([]);
const hoveredItem = ref('');
const contextMenuOpen = ref(false);
const contextMenuAnchor = ref<DOMRect>();
const contextMenuParameter = ref('');
let detachAccelerator: (() => void) | undefined;

const horizontalSwipeStyle = {
  Height: 60,
  Padding: 0,
  HorizontalContentAlignment: 'Stretch' as const,
  VerticalContentAlignment: 'Stretch' as const,
  BorderThickness: 0
};

const deleteCommand = new StandardUICommand('Delete', {
  ExecuteRequested: (_sender, args) => {
    executeDelete(args.Parameter);
  }
});

const executeDelete = (parameter?: unknown) => {
  const text = typeof parameter === 'string' ? parameter : selectedItems.value[0]?.Text;
  if (!text) return;
  listItems.value = listItems.value.filter((item) => item.Text !== text);
  selectedItems.value = selectedItems.value.filter((item) => item.Text !== text);
  contextMenuOpen.value = false;
};

// AppBarButton invokes Command before raising Click. Keep the explicit handler
// idempotent so a host that only forwards Click still executes the same command.
const onDeleteButtonClick = (text: string) => {
  if (listItems.value.some((item) => item.Text === text)) executeDelete(text);
};

const menuItems = computed(() => [
  {
    Title: t('text.file'),
    Items: [
      { Text: t('sample.standarduicommand.new') },
      { Text: t('sample.standarduicommand.open') },
      { Text: t('text.save') },
      { Text: t('sample.standarduicommand.exit') }
    ]
  },
  { Title: t('text.edit'), Items: [{ Command: deleteCommand }] },
  { Title: t('text.help'), Items: [{ Text: t('text.about') }] }
]);

const contextMenuItems = computed(() => [{ Command: deleteCommand, CommandParameter: contextMenuParameter.value }]);

const getDeleteSwipeItems = (parameter: string): SwipeItems => ({
  Mode: 'Execute',
  Items: [{ Background: 'Red', Command: deleteCommand, CommandParameter: parameter }]
});

const openContextMenu = (event: MouseEvent, parameter: string) => {
  const item = listItems.value.find((candidate) => candidate.Text === parameter);
  selectedItems.value = item ? [item] : [];
  contextMenuParameter.value = parameter;
  contextMenuAnchor.value = new DOMRect(event.clientX, event.clientY, 1, 1);
  contextMenuOpen.value = true;
};

onMounted(() => { detachAccelerator = deleteCommand.AttachKeyboardAccelerators(); });
onBeforeUnmount(() => detachAccelerator?.());

const exampleCode = computed(() => `<StackPanel Width="100%">
  <TextBlock
    Text="sample.standarduicommand.description"
    Margin="0,0,0,12"
    TextWrapping="Wrap" />

  <MenuBar Items="menuItems" />

  <ListView
    ItemsSource="listItems"
    ItemContainerStyle="horizontalSwipeStyle"
    IsItemClickEnabled="True"
    Height="500"
    SelectionMode="Single">
    <ListView.ItemTemplate>
      <DataTemplate>
        <SwipeControl
          Width="100%"
          Height="60"
          RightItems="getDeleteSwipeItems(item.Text)"
          ContextRequested="OpenContextMenu"
          PointerEntered="ListItem_PointerEntered"
          PointerExited="ListItem_PointerExited">
          <Grid ColumnDefinitions="*,Auto" RowDefinitions="60">
            <TextBlock Text="item.Text" Margin="10" FontSize="18" />
            <AppBarButton
              Command="deleteCommand"
              CommandParameter="item.Text"
              Visibility="Collapsed"
              HorizontalAlignment="Right"
              AutomationProperties.Name="Delete"
              Click="DeleteButton_Click" />
          </Grid>
        </SwipeControl>
      </DataTemplate>
    </ListView.ItemTemplate>
  </ListView>

  <MenuFlyout
    Open="contextMenuOpen"
    AnchorRect="contextMenuAnchor"
    Items="contextMenuItems"
    Placement="RightEdgeAlignedTop"
    Close="ContextMenu_Closed" />
</StackPanel>`);

const exampleXaml = `<SwipeItem x:Name="DeleteSwipeItem" Background="Red" Command="{x:Bind Command}" CommandParameter="{x:Bind Text}" />

<AppBarButton x:Name="HoverButton" IsTabStop="False" HorizontalAlignment="Right" Visibility="Collapsed"
 Command="{x:Bind Command}" CommandParameter="{x:Bind Text}" />`;

const exampleCSharp = `private void ControlExample_Loaded(object sender, RoutedEventArgs e)
{
    var deleteCommand = new StandardUICommand(StandardUICommandKind.Delete);
    deleteCommand.ExecuteRequested += DeleteCommand_ExecuteRequested;

    DeleteFlyoutItem.Command = deleteCommand;

    for (var i = 0; i < 15; i++)
    {
        collection.Add(new ListItemData { Text = "List item " + i.ToString(), Command = deleteCommand });
    }
}

private void ListViewRight_ContainerContentChanging(ListViewBase sender, ContainerContentChangingEventArgs args)
{
    MenuFlyout flyout = new MenuFlyout();
    ListItemData data = (ListItemData)args.Item;
    MenuFlyoutItem item = new MenuFlyoutItem() { Command = data.Command };
    flyout.Items.Add(item);
    args.ItemContainer.ContextFlyout = flyout;
}`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); font-size: 14px; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.standard-command-row { align-items: center; }
.standard-command-text { grid-column: 1; grid-row: 1; min-width: 0; align-self: center; }
.standard-command-delete { grid-column: 2; grid-row: 1; justify-self: end; align-self: center; }
</style>
