<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.swipecontrol')" role="heading" aria-level="1" />
        <WinTextBlock class="page-description" :Text="$t('text.swipecontrol-subtitle')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" @Click="toggleTheme"><WinTextBlock class="icon" Text="&#xE793;" /></WinButton>
          <WinToggleButton class="header-action" :IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite">
            <WinTextBlock class="icon" :Text="isFavoriteState ? '\uE735' : '\uE734'" />
          </WinToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.swipecontrol.reveal-actions')"
          :theme="pageTheme"
          :vue="example1Code">
          <template #example>
            <WinSwipeControl
              BorderThickness="1"
              BorderBrush="var(--ButtonBackground, var(--ctrl-fill-default))"
              Width="500"
              Height="68"
              Margin="12"
              :LeftItems="leftRevealItems">
              <WinGrid class="swipe-demo-content">
                <WinTextBlock :Text="revealOutput" />
              </WinGrid>
            </WinSwipeControl>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.swipecontrol.execute')"
          :theme="pageTheme"
          :vue="example2Code">
          <template #example>
            <WinSwipeControl
              BorderThickness="1"
              BorderBrush="var(--ButtonBackground, var(--ctrl-fill-default))"
              Width="500"
              Height="68"
              Margin="12"
              :RightItems="rightExecuteItems">
              <WinGrid class="swipe-demo-content">
                <WinTextBlock :Text="executeOutput" />
              </WinGrid>
            </WinSwipeControl>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.swipecontrol.custom-list')"
          :theme="pageTheme"
          :vue="example3Code">
          <template #example>
            <WinListView
              class="swipe-list"
              :ItemsSource="listItems"
              Width="800"
              Height="300"
              MinWidth="200"
              Margin="12">
              <!-- @vue-ignore WinListView is currently a JavaScript component without typed slots. -->
              <template #item="{ item }">
                <WinSwipeControl
                  BorderThickness="0,1,0,0"
                  BorderBrush="var(--ButtonBackground, var(--ctrl-fill-default))"
                  Height="68"
                  MinWidth="200"
                  :LeftItems="listLeftItems"
                  :RightItems="deleteItems(item)">
                  <WinTextBlock class="list-item-content" :Text="item" FontSize="24" />
                </WinSwipeControl>
              </template>
            </WinListView>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.swipecontrol.gradient')"
          :theme="pageTheme"
          :vue="example4Code">
          <template #example>
            <WinSwipeControl
              BorderThickness="1"
              BorderBrush="var(--ButtonBackground, var(--ctrl-fill-default))"
              Width="500"
              Height="68"
              Margin="12"
              :RightItems="gradientItems">
              <WinGrid class="swipe-demo-content">
                <WinTextBlock :Text="$t('sample.swipecontrol.swipe-left')" />
              </WinGrid>
            </WinSwipeControl>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.swipecontrol.custom-icons')"
          :theme="pageTheme"
          :vue="example5Code">
          <template #example>
            <WinSwipeControl
              BorderThickness="1"
              BorderBrush="var(--ButtonBackground, var(--ctrl-fill-default))"
              Width="500"
              Height="68"
              Margin="12"
              :LeftItems="customIconItems">
              <WinGrid class="swipe-demo-content">
                <WinTextBlock :Text="$t('sample.swipecontrol.swipe-right')" />
              </WinGrid>
            </WinSwipeControl>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinGrid from '../../components/WinGrid.vue';
import WinListView from '../../components/WinListView.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinSwipeControl from '../../components/WinSwipeControl.vue';
import type { SwipeItems, SwipeItem } from '../../components/WinSwipeControl.types';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
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

const example1Code = computed(() => `<WinSwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <WinSwipeControl.LeftItems>
    <WinSwipeItems Mode="Reveal">
      <WinSwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" IconSource="Accept" Text="Accept" Invoked="Accept_ItemInvoked" />
      <WinSwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" IconSource="Flag" Text="Flag" Invoked="Flag_ItemInvoked" />
    </WinSwipeItems>
  </WinSwipeControl.LeftItems>
  <WinTextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Right" />
</WinSwipeControl>`);

const example2Code = computed(() => `<WinSwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <WinSwipeControl.RightItems>
    <WinSwipeItems Mode="Execute">
      <WinSwipeItem BehaviorOnInvoked="Close" IconSource="Archive" Text="Archive" Invoked="DeleteOne_ItemInvoked" />
    </WinSwipeItems>
  </WinSwipeControl.RightItems>
  <WinTextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Left" />
</WinSwipeControl>`);

const example3Code = computed(() => `<WinListView ItemsSource="listItems" Width="800" Height="300" MinWidth="200" Margin="12">
  <WinListView.ItemTemplate>
    <WinDataTemplate>
      <WinSwipeControl
        Height="68"
        MinWidth="200"
        BorderBrush="{ThemeResource ButtonBackground}"
        BorderThickness="0,1,0,0">
        <WinSwipeControl.LeftItems>
          <WinSwipeItems Mode="Reveal">
            <WinSwipeItem Background="#FF3e6fa7" Foreground="White" IconSource="ReplyAll" Text="Reply All" />
            <WinSwipeItem Background="#FFff9501" Foreground="White" IconSource="Read" Text="Open" />
          </WinSwipeItems>
        </WinSwipeControl.LeftItems>
        <WinSwipeControl.RightItems>
          <WinSwipeItems Mode="Execute">
            <WinSwipeItem Background="Red" IconSource="Delete" Text="Delete" Invoked="DeleteItem_ItemInvoked" />
          </WinSwipeItems>
        </WinSwipeControl.RightItems>
        <WinTextBlock Margin="12" HorizontalAlignment="Stretch" VerticalAlignment="Center" FontSize="24" Text="{Binding}" />
      </WinSwipeControl>
    </WinDataTemplate>
  </WinListView.ItemTemplate>
</WinListView>`);

const example4Code = computed(() => `<WinSwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <WinSwipeControl.RightItems>
    <WinSwipeItems Mode="Execute">
      <WinSwipeItem BehaviorOnInvoked="Close" IconSource="Lock" Text="Lock">
        <WinSwipeItem.Background>
          <WinLinearGradientBrush StartPoint="0,0.5" EndPoint="1,0.5">
            <WinGradientStop Offset="0.0" Color="#ff8990f9" />
            <WinGradientStop Offset="0.5" Color="#ff5b66fb" />
            <WinGradientStop Offset="1.0" Color="#ff5c1df4" />
          </WinLinearGradientBrush>
        </WinSwipeItem.Background>
      </WinSwipeItem>
    </WinSwipeItems>
  </WinSwipeControl.RightItems>
  <WinTextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Left" />
</WinSwipeControl>`);

const example5Code = computed(() => `<WinSwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <WinSwipeControl.LeftItems>
    <WinSwipeItems Mode="Reveal">
      <WinSwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" Text="Coffee">
        <WinSwipeItem.IconSource>
          <WinBitmapIconSource UriSource="/Assets/SampleMedia/CoffeeCup.png" />
        </WinSwipeItem.IconSource>
      </WinSwipeItem>
    </WinSwipeItems>
  </WinSwipeControl.LeftItems>
  <WinTextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Right" />
</WinSwipeControl>`);
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
