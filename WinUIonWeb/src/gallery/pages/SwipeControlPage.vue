<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.swipecontrol')" role="heading" aria-level="1" />
        <TextBlock class="page-description" :Text="$t('text.swipecontrol-subtitle')" TextWrapping="WrapWholeWords" />
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
          :headerText="$t('sample.swipecontrol.reveal-actions')"
          :theme="pageTheme"
          :vue="example1Code">
          <template #example>
            <SwipeControl
              BorderThickness="1"
              BorderBrush="var(--ButtonBackground, var(--ctrl-fill-default))"
              Width="500"
              Height="68"
              Margin="12"
              :LeftItems="leftRevealItems">
              <Grid class="swipe-demo-content">
                <TextBlock :Text="revealOutput" />
              </Grid>
            </SwipeControl>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.swipecontrol.execute')"
          :theme="pageTheme"
          :vue="example2Code">
          <template #example>
            <SwipeControl
              BorderThickness="1"
              BorderBrush="var(--ButtonBackground, var(--ctrl-fill-default))"
              Width="500"
              Height="68"
              Margin="12"
              :RightItems="rightExecuteItems">
              <Grid class="swipe-demo-content">
                <TextBlock :Text="executeOutput" />
              </Grid>
            </SwipeControl>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.swipecontrol.custom-list')"
          :theme="pageTheme"
          :vue="example3Code">
          <template #example>
            <ListView
              class="swipe-list"
              :ItemsSource="listItems"
              Width="800"
              Height="300"
              MinWidth="200"
              Margin="12">
              <!-- @vue-ignore ListView is currently a JavaScript component without typed slots. -->
              <template #item="{ item }">
                <SwipeControl
                  BorderThickness="0,1,0,0"
                  BorderBrush="var(--ButtonBackground, var(--ctrl-fill-default))"
                  Height="68"
                  MinWidth="200"
                  :LeftItems="listLeftItems"
                  :RightItems="deleteItems(item)">
                  <TextBlock class="list-item-content" :Text="item" FontSize="24" />
                </SwipeControl>
              </template>
            </ListView>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.swipecontrol.gradient')"
          :theme="pageTheme"
          :vue="example4Code">
          <template #example>
            <SwipeControl
              BorderThickness="1"
              BorderBrush="var(--ButtonBackground, var(--ctrl-fill-default))"
              Width="500"
              Height="68"
              Margin="12"
              :RightItems="gradientItems">
              <Grid class="swipe-demo-content">
                <TextBlock :Text="$t('sample.swipecontrol.swipe-left')" />
              </Grid>
            </SwipeControl>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.swipecontrol.custom-icons')"
          :theme="pageTheme"
          :vue="example5Code">
          <template #example>
            <SwipeControl
              BorderThickness="1"
              BorderBrush="var(--ButtonBackground, var(--ctrl-fill-default))"
              Width="500"
              Height="68"
              Margin="12"
              :LeftItems="customIconItems">
              <Grid class="swipe-demo-content">
                <TextBlock :Text="$t('sample.swipecontrol.swipe-right')" />
              </Grid>
            </SwipeControl>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import Grid from '../../components/Grid.vue';
import ListView from '../../components/ListView.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import SwipeControl from '../../components/SwipeControl.vue';
import type { SwipeItems, SwipeItem } from '../../components/SwipeControl.types';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const coffeeCupUrl = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/CoffeeCup.png';

const currentPage = inject<{ value: string }>('currentPage');
const pageKey = computed(() => currentPage?.value || 'swipecontrol');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const { t } = useI18n();

const revealOutput = ref(t('sample.swipecontrol.swipe-right'));
const executeOutput = ref(t('sample.swipecontrol.swipe-left'));
const listItems = ref(Array.from({ length: 4 }, (_, index) => t('sample.swipecontrol.list-item', { index: index + 1 })));
const isAccepted = ref(false);
const isFlagged = ref(false);
const isArchived = ref(false);

const updateRevealOutput = () => {
  if (isAccepted.value && isFlagged.value) revealOutput.value = t('sample.swipecontrol.accepted-flagged');
  else if (isAccepted.value) revealOutput.value = t('sample.swipecontrol.accepted');
  else if (isFlagged.value) revealOutput.value = t('sample.swipecontrol.flagged');
  else revealOutput.value = t('sample.swipecontrol.swipe-right');
};

const acceptItem = reactive<SwipeItem>({
  Text: t('sample.swipecontrol.accept'),
  IconSource: '\uE8FB',
  Background: 'var(--ButtonBackgroundThemeBrush, var(--ctrl-fill-default))',
  Foreground: 'var(--AppBarItemForegroundThemeBrush, var(--text-primary))',
  Invoked: (sender) => {
    isAccepted.value = !isAccepted.value;
    updateRevealOutput();
    sender.IconSource = isAccepted.value ? '\uE711' : '\uE10B';
    sender.Text = t(isAccepted.value ? 'sample.swipecontrol.cancel' : 'sample.swipecontrol.accept');
  }
});
const flagItem = reactive<SwipeItem>({
  Text: t('sample.swipecontrol.flag'),
  IconSource: '\uE7C1',
  Background: 'var(--ButtonBackgroundThemeBrush, var(--ctrl-fill-default))',
  Foreground: 'var(--AppBarItemForegroundThemeBrush, var(--text-primary))',
  Invoked: (sender) => {
    isFlagged.value = !isFlagged.value;
    updateRevealOutput();
    sender.IconSource = isFlagged.value ? '\uEB4B' : '\uE129';
    sender.Text = t(isFlagged.value ? 'sample.swipecontrol.unmark' : 'sample.swipecontrol.flag');
  }
});
const leftRevealItems = reactive<SwipeItems>({ Mode: 'Reveal', Items: [acceptItem, flagItem] });

const rightExecuteItems: SwipeItems = {
  Mode: 'Execute',
  Items: [{
    Text: t('sample.swipecontrol.archive'),
    IconSource: '\uE7B8',
    BehaviorOnInvoked: 'Close',
    Invoked: () => {
      isArchived.value = !isArchived.value;
      executeOutput.value = t(isArchived.value ? 'sample.swipecontrol.archived' : 'sample.swipecontrol.swipe-left');
    }
  }]
};

const listLeftItems: SwipeItems = {
  Mode: 'Reveal',
  Items: [
    { Text: t('sample.swipecontrol.reply-all'), IconSource: '\uE8C2', Background: '#3e6fa7', Foreground: 'white' },
    { Text: t('sample.swipecontrol.open'), IconSource: '\uE8C3', Background: '#ff9501', Foreground: 'white' }
  ]
};

const deleteItems = (item: string): SwipeItems => ({
  Mode: 'Execute',
  Items: [{
    Text: t('sample.swipecontrol.delete'),
    IconSource: '\uE74D',
    Background: 'Red',
    BehaviorOnInvoked: 'Close',
    Invoked: () => { listItems.value = listItems.value.filter((candidate) => candidate !== item); }
  }]
});

const gradientItems: SwipeItems = {
  Mode: 'Execute',
  Items: [{
    Text: t('sample.swipecontrol.lock'),
    IconSource: '\uE72E',
    Background: 'linear-gradient(90deg, #8990f9 0%, #5b66fb 50%, #5c1df4 100%)',
    BehaviorOnInvoked: 'Close'
  }]
};

const customIconItems: SwipeItems = {
  Mode: 'Reveal',
  Items: [{
    Text: t('sample.swipecontrol.coffee'),
    IconSource: { UriSource: coffeeCupUrl },
    Background: 'var(--ButtonBackgroundThemeBrush, var(--ctrl-fill-default))',
    Foreground: 'var(--AppBarItemForegroundThemeBrush, var(--text-primary))'
  }]
};

const example1Code = computed(() => `<SwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <SwipeControl.LeftItems>
    <SwipeItems Mode="Reveal">
      <SwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" IconSource="Accept" Text="Accept" Invoked="Accept_ItemInvoked" />
      <SwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" IconSource="Flag" Text="Flag" Invoked="Flag_ItemInvoked" />
    </SwipeItems>
  </SwipeControl.LeftItems>
  <TextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Right" />
</SwipeControl>`);

const example2Code = computed(() => `<SwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <SwipeControl.RightItems>
    <SwipeItems Mode="Execute">
      <SwipeItem BehaviorOnInvoked="Close" IconSource="Archive" Text="Archive" Invoked="DeleteOne_ItemInvoked" />
    </SwipeItems>
  </SwipeControl.RightItems>
  <TextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Left" />
</SwipeControl>`);

const example3Code = computed(() => `<ListView ItemsSource="listItems" Width="800" Height="300" MinWidth="200" Margin="12">
  <ListView.ItemTemplate>
    <DataTemplate>
      <SwipeControl
        Height="68"
        MinWidth="200"
        BorderBrush="{ThemeResource ButtonBackground}"
        BorderThickness="0,1,0,0">
        <SwipeControl.LeftItems>
          <SwipeItems Mode="Reveal">
            <SwipeItem Background="#FF3e6fa7" Foreground="White" IconSource="ReplyAll" Text="Reply All" />
            <SwipeItem Background="#FFff9501" Foreground="White" IconSource="Read" Text="Open" />
          </SwipeItems>
        </SwipeControl.LeftItems>
        <SwipeControl.RightItems>
          <SwipeItems Mode="Execute">
            <SwipeItem Background="Red" IconSource="Delete" Text="Delete" Invoked="DeleteItem_ItemInvoked" />
          </SwipeItems>
        </SwipeControl.RightItems>
        <TextBlock Margin="12" HorizontalAlignment="Stretch" VerticalAlignment="Center" FontSize="24" Text="{Binding}" />
      </SwipeControl>
    </DataTemplate>
  </ListView.ItemTemplate>
</ListView>`);

const example4Code = computed(() => `<SwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <SwipeControl.RightItems>
    <SwipeItems Mode="Execute">
      <SwipeItem BehaviorOnInvoked="Close" IconSource="Lock" Text="Lock">
        <SwipeItem.Background>
          <LinearGradientBrush StartPoint="0,0.5" EndPoint="1,0.5">
            <GradientStop Offset="0.0" Color="#ff8990f9" />
            <GradientStop Offset="0.5" Color="#ff5b66fb" />
            <GradientStop Offset="1.0" Color="#ff5c1df4" />
          </LinearGradientBrush>
        </SwipeItem.Background>
      </SwipeItem>
    </SwipeItems>
  </SwipeControl.RightItems>
  <TextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Left" />
</SwipeControl>`);

const example5Code = computed(() => `<SwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <SwipeControl.LeftItems>
    <SwipeItems Mode="Reveal">
      <SwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" Text="Coffee">
        <SwipeItem.IconSource>
          <BitmapIconSource UriSource="/Assets/SampleMedia/CoffeeCup.png" />
        </SwipeItem.IconSource>
      </SwipeItem>
    </SwipeItems>
  </SwipeControl.LeftItems>
  <TextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Right" />
</SwipeControl>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); font-size: 14px; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif; font-size: 16px; }
.swipe-demo-content { display: grid; place-items: center; width: 100%; height: 100%; padding: 12px; box-sizing: border-box; text-align: center; }
.list-item-content { display: flex; align-items: center; width: calc(100% - 24px); height: calc(100% - 24px); margin: 12px; box-sizing: border-box; }
.swipe-list { width: min(800px, calc(100% - 24px)); height: 300px; min-width: 200px; }
.swipe-list :deep(.win-list-item) { align-items: stretch; padding: 0; border-radius: 0; gap: 0; }
.swipe-list :deep(.win-list-item > .win-swipe-control) { flex: 1 1 100%; width: 100%; }
</style>
