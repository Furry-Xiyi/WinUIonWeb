<template>
  <Page>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind Labels.PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
        <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4" HorizontalAlignment="Right">
          <Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <StackPanel.Resources>
          <Style TargetType="ListViewItem"><Setter Property="Padding" Value="0" /></Style>
        </StackPanel.Resources>

        <StackPanel>
          <ControlExample x:Name="Example1" class="swipe-example" SampleDefinition="SwipeControl\SwipeControlSwipeRightRevealActions.txt" HeaderText="{x:Bind Labels.RevealHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind RevealXaml}" CSharp="{x:Bind SwipeControlCSharp}">
            <ControlExample.Example>
              <ScrollViewer class="swipe-example-host" HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" VerticalScrollBarVisibility="Disabled" VerticalScrollMode="Disabled" Padding="0">
              <Border>
                <Border.Resources>
                  <FontIconSource x:Key="AcceptIcon" Glyph="{x:Bind AcceptGlyph, Mode=OneWay}" />
                  <FontIconSource x:Key="FlagIcon" Glyph="{x:Bind FlagGlyph, Mode=OneWay}" />
                  <SwipeItems x:Key="left" Mode="Reveal">
                    <SwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" IconSource="{StaticResource AcceptIcon}" Invoked="Accept_ItemInvoked" Text="{x:Bind AcceptText, Mode=OneWay}" />
                    <SwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" IconSource="{StaticResource FlagIcon}" Invoked="Flag_ItemInvoked" Text="{x:Bind FlagText, Mode=OneWay}" />
                  </SwipeItems>
                </Border.Resources>
                <SwipeControl Width="500" Height="68" Margin="12" BorderBrush="{ThemeResource ButtonBackground}" BorderThickness="1" LeftItems="{StaticResource left}">
                  <TextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="{x:Bind RevealText, Mode=OneWay}" TextWrapping="Wrap" />
                </SwipeControl>
              </Border>
              </ScrollViewer>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind RevealText, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example2" class="swipe-example" SampleDefinition="SwipeControl\SwipeControlSwipeLeftInvokeExecute.txt" HeaderText="{x:Bind Labels.ExecuteHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind ExecuteXaml}" CSharp="{x:Bind SwipeControlCSharp}">
            <ControlExample.Example>
              <ScrollViewer class="swipe-example-host" HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" VerticalScrollBarVisibility="Disabled" VerticalScrollMode="Disabled" Padding="0">
              <Border>
                <Border.Resources>
                  <FontIconSource x:Key="ArchiveIcon" Glyph="&#xE7B8;" />
                  <SwipeItems x:Key="right" Mode="Execute">
                    <SwipeItem BehaviorOnInvoked="Close" IconSource="{StaticResource ArchiveIcon}" Invoked="DeleteOne_ItemInvoked" Text="{x:Bind Labels.Archive, Mode=OneWay}" />
                  </SwipeItems>
                </Border.Resources>
                <SwipeControl Width="500" Height="68" Margin="12" BorderBrush="{ThemeResource ButtonBackground}" BorderThickness="1" RightItems="{StaticResource right}">
                  <TextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="{x:Bind ArchiveText, Mode=OneWay}" TextWrapping="Wrap" />
                </SwipeControl>
              </Border>
              </ScrollViewer>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind ArchiveText, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example3" class="swipe-example" SampleDefinition="SwipeControl\SwipeControlCustomSwipeListview.txt" HeaderText="{x:Bind Labels.ListHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind ListXaml}" CSharp="{x:Bind SwipeControlCSharp}">
            <ControlExample.Example>
              <ScrollViewer class="swipe-example-host" HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" VerticalScrollBarVisibility="Disabled" VerticalScrollMode="Disabled" Padding="0">
              <ListView x:Name="lv" class="swipe-list" Width="800" Height="300" MinWidth="200" Margin="12" ItemsSource="{x:Bind items, Mode=OneWay}">
                <ListView.Resources>
                  <FontIconSource x:Key="ReplyAllIcon" Glyph="&#xE8C2;" />
                  <FontIconSource x:Key="ReadIcon" Glyph="&#xE8C3;" />
                  <FontIconSource x:Key="DeleteIcon" Glyph="&#xE74D;" />
                  <SwipeItems x:Key="left" Mode="Reveal">
                    <SwipeItem Background="#FF3e6fa7" Foreground="White" IconSource="{StaticResource ReplyAllIcon}" Invoked="ReplyAll_ItemInvoked" Text="{x:Bind Labels.ReplyAll, Mode=OneWay}" />
                    <SwipeItem Background="#FFff9501" Foreground="White" IconSource="{StaticResource ReadIcon}" Invoked="Open_ItemInvoked" Text="{x:Bind Labels.Open, Mode=OneWay}" />
                  </SwipeItems>
                  <SwipeItems x:Key="right" Mode="Execute">
                    <SwipeItem Background="Red" IconSource="{StaticResource DeleteIcon}" Invoked="DeleteItem_ItemInvoked" Text="{x:Bind Labels.Delete, Mode=OneWay}" />
                  </SwipeItems>
                </ListView.Resources>
                <ListView.ItemTemplate>
                  <DataTemplate>
                    <SwipeControl Height="68" MinWidth="200" BorderBrush="{ThemeResource ButtonBackground}" BorderThickness="0,1,0,0" LeftItems="{StaticResource left}" RightItems="{StaticResource right}">
                      <TextBlock Margin="12" HorizontalAlignment="Stretch" VerticalAlignment="Center" FontSize="24" Text="{Binding}" TextTrimming="CharacterEllipsis" />
                    </SwipeControl>
                  </DataTemplate>
                </ListView.ItemTemplate>
              </ListView>
              </ScrollViewer>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind ListOutput, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example4" class="swipe-example" SampleDefinition="SwipeControl\SwipeControlGradientBackground.txt" HeaderText="{x:Bind Labels.GradientHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind GradientXaml}" CSharp="{x:Bind SwipeControlCSharp}">
            <ControlExample.Example>
              <ScrollViewer class="swipe-example-host" HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" VerticalScrollBarVisibility="Disabled" VerticalScrollMode="Disabled" Padding="0">
              <Border>
                <Border.Resources>
                  <FontIconSource x:Key="LockIcon" Glyph="&#xE72E;" />
                  <LinearGradientBrush x:Key="PurpleGradient" StartPoint="0,0.5" EndPoint="1,0.5">
                    <GradientStop Offset="0.0" Color="#ff8990f9" />
                    <GradientStop Offset="0.5" Color="#ff5b66fb" />
                    <GradientStop Offset="1.0" Color="#ff5c1df4" />
                  </LinearGradientBrush>
                  <SwipeItems x:Key="right" Mode="Execute">
                    <SwipeItem Background="{StaticResource PurpleGradient}" BehaviorOnInvoked="Close" IconSource="{StaticResource LockIcon}" Invoked="Lock_ItemInvoked" Text="{x:Bind Labels.Lock, Mode=OneWay}" />
                  </SwipeItems>
                </Border.Resources>
                <SwipeControl Width="500" Height="68" Margin="12" BorderBrush="{ThemeResource ButtonBackground}" BorderThickness="1" RightItems="{StaticResource right}">
                  <TextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="{x:Bind Labels.SwipeLeft, Mode=OneWay}" TextWrapping="Wrap" />
                </SwipeControl>
              </Border>
              </ScrollViewer>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind LockOutput, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example5" class="swipe-example" SampleDefinition="SwipeControl\SwipeControlCustomIcons.txt" HeaderText="{x:Bind Labels.IconsHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind IconsXaml}" CSharp="{x:Bind SwipeControlCSharp}">
            <ControlExample.Example>
              <ScrollViewer class="swipe-example-host" HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" VerticalScrollBarVisibility="Disabled" VerticalScrollMode="Disabled" Padding="0">
              <Border>
                <Border.Resources>
                  <SwipeItems x:Key="left" Mode="Reveal">
                    <SwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" Invoked="Coffee_ItemInvoked" Text="{x:Bind Labels.Coffee, Mode=OneWay}">
                      <SwipeItem.IconSource><BitmapIconSource UriSource="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/CoffeeCup.png" /></SwipeItem.IconSource>
                    </SwipeItem>
                  </SwipeItems>
                </Border.Resources>
                <SwipeControl Width="500" Height="68" Margin="12" BorderBrush="{ThemeResource ButtonBackground}" BorderThickness="1" LeftItems="{StaticResource left}">
                  <TextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="{x:Bind Labels.SwipeRight, Mode=OneWay}" TextWrapping="Wrap" />
                </SwipeControl>
              </Border>
              </ScrollViewer>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Text="{x:Bind CoffeeOutput, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, provide, ref, shallowReactive, shallowRef, watch } from 'vue';
import Border from '../../components/Border.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import ListView from '../../components/ListView.vue';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import SwipeControl from '../../components/SwipeControl.vue';
import type { SwipeControlApi, SwipeItem, SwipeItemInvokedEventArgs } from '../../components/SwipeControl.types';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import revealDefinition from '../samples/SwipeControl/SwipeControlSwipeRightRevealActions.txt?raw';
import executeDefinition from '../samples/SwipeControl/SwipeControlSwipeLeftInvokeExecute.txt?raw';
import listDefinition from '../samples/SwipeControl/SwipeControlCustomSwipeListview.txt?raw';
import gradientDefinition from '../samples/SwipeControl/SwipeControlGradientBackground.txt?raw';
import iconsDefinition from '../samples/SwipeControl/SwipeControlCustomIcons.txt?raw';
import SwipeControlCSharp from '../samples/SwipeControl/SwipeControlPage.xaml.cs?raw';

const { t } = useI18n();
const currentPage = inject<{ value: string }>('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'swipecontrol');
provide(xamlNameScopeKey, shallowReactive({}));

const Labels = computed(() => ({
  PageTitle: t('text.swipecontrol'), Description: t('text.swipecontrol-subtitle'), ToggleTheme: t('gallery.page-header.toggle-theme'),
  RevealHeader: t('sample.swipecontrol.reveal-actions'), ExecuteHeader: t('sample.swipecontrol.execute'), ListHeader: t('sample.swipecontrol.custom-list'), GradientHeader: t('sample.swipecontrol.gradient'), IconsHeader: t('sample.swipecontrol.custom-icons'),
  SwipeRight: t('sample.swipecontrol.swipe-right'), SwipeLeft: t('sample.swipecontrol.swipe-left'),
  Archive: t('sample.swipecontrol.archive'), ReplyAll: t('sample.swipecontrol.reply-all'), Open: t('sample.swipecontrol.open'), Delete: t('sample.swipecontrol.delete'), Lock: t('sample.swipecontrol.lock'), Coffee: t('sample.swipecontrol.coffee')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const isArchived = ref(false), isAccepted = ref(false), isFlagged = ref(false);
const hasAccepted = ref(false), hasFlagged = ref(false);
const itemNumbers = ref([1, 2, 3, 4]);
const items = computed(() => itemNumbers.value.map(index => t('sample.swipecontrol.list-item', { index })));
const AcceptText = computed(() => t(isAccepted.value ? 'sample.swipecontrol.cancel' : 'sample.swipecontrol.accept'));
const FlagText = computed(() => t(isFlagged.value ? 'sample.swipecontrol.unmark' : 'sample.swipecontrol.flag'));
const AcceptGlyph = computed(() => isAccepted.value ? '\uE711' : hasAccepted.value ? '\uE10B' : '\uE8FB');
const FlagGlyph = computed(() => isFlagged.value ? '\uEB4B' : hasFlagged.value ? '\uE129' : '\uE7C1');
const RevealText = computed(() => t(isAccepted.value
  ? isFlagged.value ? 'sample.swipecontrol.accepted-flagged' : 'sample.swipecontrol.accepted'
  : isFlagged.value ? 'sample.swipecontrol.flagged' : 'sample.swipecontrol.swipe-right'));
const ArchiveText = computed(() => t(isArchived.value ? 'sample.swipecontrol.archived' : 'sample.swipecontrol.swipe-left'));
const revealControl = shallowRef<SwipeControlApi>(), archiveControl = shallowRef<SwipeControlApi>();
const invokedAcceptItem = shallowRef<SwipeItem>(), invokedFlagItem = shallowRef<SwipeItem>();
watch(RevealText, text => { if (revealControl.value) (revealControl.value.Content as { Text: string }).Text = text; });
watch(ArchiveText, text => { if (archiveControl.value) (archiveControl.value.Content as { Text: string }).Text = text; });
watch(AcceptText, text => { if (invokedAcceptItem.value) invokedAcceptItem.value.Text = text; });
watch(FlagText, text => { if (invokedFlagItem.value) invokedFlagItem.value.Text = text; });

function Accept_ItemInvoked(sender: SwipeItem, args: SwipeItemInvokedEventArgs) {
  revealControl.value = args.SwipeControl;
  invokedAcceptItem.value = sender;
  isAccepted.value = !isAccepted.value;
  hasAccepted.value = true;
  (args.SwipeControl.Content as { Text: string }).Text = RevealText.value;
  sender.IconSource = { Glyph: AcceptGlyph.value };
  sender.Text = AcceptText.value;
}

function Flag_ItemInvoked(sender: SwipeItem, args: SwipeItemInvokedEventArgs) {
  revealControl.value = args.SwipeControl;
  invokedFlagItem.value = sender;
  isFlagged.value = !isFlagged.value;
  hasFlagged.value = true;
  (args.SwipeControl.Content as { Text: string }).Text = RevealText.value;
  sender.IconSource = { Glyph: FlagGlyph.value };
  sender.Text = FlagText.value;
}

function DeleteOne_ItemInvoked(_sender: SwipeItem, args: SwipeItemInvokedEventArgs) {
  archiveControl.value = args.SwipeControl;
  isArchived.value = !isArchived.value;
  (args.SwipeControl.Content as { Text: string }).Text = ArchiveText.value;
}

type ListAction = 'reply-all' | 'open' | 'delete';
const lastListAction = ref<{ action: ListAction; index: number } | null>(null);
function listItemInvoked(action: ListAction, args: SwipeItemInvokedEventArgs) {
  const position = items.value.indexOf(args.SwipeControl.DataContext as string);
  if (position < 0) return;
  lastListAction.value = { action, index: itemNumbers.value[position]! };
  if (action === 'delete') itemNumbers.value.splice(position, 1);
}
function DeleteItem_ItemInvoked(_sender: SwipeItem, args: SwipeItemInvokedEventArgs) { listItemInvoked('delete', args); }
function ReplyAll_ItemInvoked(_sender: SwipeItem, args: SwipeItemInvokedEventArgs) { listItemInvoked('reply-all', args); }
function Open_ItemInvoked(_sender: SwipeItem, args: SwipeItemInvokedEventArgs) { listItemInvoked('open', args); }
const ListOutput = computed(() => lastListAction.value
  ? t('sample.swipecontrol.item-action-output', {
    action: t(`sample.swipecontrol.${lastListAction.value.action}`),
    item: t('sample.swipecontrol.list-item', { index: lastListAction.value.index }),
    count: items.value.length
  })
  : t('sample.swipecontrol.remaining-items', { count: items.value.length }));

const lockInvoked = ref(false), coffeeInvoked = ref(false);
function Lock_ItemInvoked() { lockInvoked.value = true; }
function Coffee_ItemInvoked() { coffeeInvoked.value = true; }
const LockOutput = computed(() => lockInvoked.value ? t('sample.swipecontrol.lock-invoked') : '');
const CoffeeOutput = computed(() => coffeeInvoked.value ? t('sample.swipecontrol.coffee-invoked') : '');

const codePart = (definition: string) => definition.split('--- xaml')[1]?.split(/\r?\n--- /)[0]?.trim() ?? '';
const RevealXaml = codePart(revealDefinition), ExecuteXaml = codePart(executeDefinition), ListXaml = codePart(listDefinition), GradientXaml = codePart(gradientDefinition), IconsXaml = codePart(iconsDefinition);
</script>

<style scoped>
.gallery-item-page { min-width: 0; width: 100%; }
.page-heading { position: relative; min-width: 0; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.swipe-example :deep(.example-display), .swipe-example :deep(.example-output) { min-width: 0; }
.swipe-example :deep(.example-output) { overflow-wrap: anywhere; }
.swipe-example-host { min-width: 0; max-width: 100%; }
</style>
