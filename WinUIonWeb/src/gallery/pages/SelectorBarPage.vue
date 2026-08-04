<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.selectorbar')" />
        <WinTextBlock
          class="page-description"
          :Text="$t('text.selectorbar-description')"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" @Click="toggleTheme">
            <WinTextBlock class="icon" Text="&#xE793;" />
          </WinButton>
          <WinToggleButton
            :IsChecked="isFavoriteState"
            class="header-action"
            @update:IsChecked="toggleFavorite">
            <WinTextBlock class="icon" :Text="isFavoriteState ? '\uE735' : '\uE734'" />
          </WinToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :theme="pageTheme"
          :vue="BasicSelectorBarVue"
          :headerText="$t('sample.selectorbar.basic')">
          <template #example>
            <WinSelectorBar>
              <WinSelectorBarItem :Text="$t('text.recent')" Icon="Clock" />
              <WinSelectorBarItem :Text="$t('text.shared')" Icon="Share" />
              <WinSelectorBarItem :Text="$t('text.favorites')" Icon="Favorite" />
            </WinSelectorBar>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :theme="pageTheme"
          :vue="FrameSlideTransitionsVue"
          :headerText="$t('sample.selectorbar.frame-slide-transitions')">
          <template #example>
            <div class="selectorbar-sample-stack">
              <WinSelectorBar @SelectionChanged="SelectorBar2_SelectionChanged">
                <WinSelectorBarItem :Text="$t('sample.selectorbar.page-1')" IsSelected />
                <WinSelectorBarItem :Text="$t('sample.selectorbar.page-2')" />
                <WinSelectorBarItem :Text="$t('sample.selectorbar.page-3')" />
                <WinSelectorBarItem :Text="$t('sample.selectorbar.page-4')" />
                <WinSelectorBarItem :Text="$t('sample.selectorbar.page-5')" />
              </WinSelectorBar>

              <div class="selectorbar-content-frame">
                <div
                  :key="CurrentFramePage.Name"
                  class="selectorbar-sample-page"
                  :class="[CurrentFramePage.ClassName, FrameTransitionClass]">
                  <div
                    v-for="Tile in CurrentFramePage.Tiles"
                    :key="Tile.Key"
                    class="sample-page-tile"
                    :class="Tile.Shape"
                    :style="Tile.Style"></div>
                  <div
                    v-if="CurrentFramePage.Body"
                    class="sample-page-copy"
                    :class="CurrentFramePage.CopyClass">
                    <WinTextBlock
                      v-if="CurrentFramePage.Title"
                      class="sample-page-title"
                      :Text="CurrentFramePage.Title"
                      TextWrapping="WrapWholeWords" />
                    <WinTextBlock
                      class="sample-page-body"
                      :Text="CurrentFramePage.Body"
                      TextWrapping="WrapWholeWords" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :theme="pageTheme"
          :vue="DisplayingDifferentCollectionsVue"
          :headerText="$t('sample.selectorbar.collections')">
          <template #example>
            <div class="selectorbar-sample-stack">
              <WinSelectorBar @SelectionChanged="SelectorBar3_SelectionChanged">
                <WinSelectorBarItem :Text="$t('sample.selectorbar.pink')" IsSelected />
                <WinSelectorBarItem :Text="$t('sample.selectorbar.plum')" />
                <WinSelectorBarItem :Text="$t('sample.selectorbar.powder-blue')" />
              </WinSelectorBar>

              <WinItemsView
                class="selectorbar-colors-view"
                :ItemsSource="ItemsView3ItemsSource"
                :Layout="ColorsLayout">
                <template #item="{ item }">
                  <div class="color-item-container" :style="{ background: item }"></div>
                </template>
              </WinItemsView>
            </div>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinItemsView from '../../components/WinItemsView.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinSelectorBar from '../../components/WinSelectorBar.vue';
import WinSelectorBarItem from '../../components/WinSelectorBarItem.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';
import {
  DefaultNavigationTransitionInfo,
  createSlideNavigationTransitionInfo,
  getNavigationTransitionInfoClassName
} from '../../utils/navigationTransitionInfo';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'selectorbar');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const LoremIpsumTitle = t('sample.navigationview.lorem-title');
const LoremIpsum = t('sample.navigationview.lorem-body');
const previousSelectedIndex = ref(0);
const selectedFramePageIndex = ref(0);
const FrameTransitionClass = ref(getNavigationTransitionInfoClassName(DefaultNavigationTransitionInfo));

const PinkColorCollection = Array.from({ length: 5 }, () => 'Pink');
const PlumColorCollection = Array.from({ length: 7 }, () => 'Plum');
const PowderBlueColorCollection = Array.from({ length: 4 }, () => 'PowderBlue');
const ItemsView3ItemsSource = ref(PinkColorCollection);
const ColorsLayout = { Type: 'StackLayout', Orientation: 'Horizontal', Spacing: 0 };

const SamplePages = [
  {
    Name: 'Page1',
    ClassName: 'sample-page-one',
    Body: LoremIpsum,
    CopyClass: 'page-one-copy',
    Tiles: [
      { Key: 'source', Shape: 'rectangle', Style: { gridColumn: '1', gridRow: '2 / span 2', minWidth: '250px', minHeight: '150px', margin: '5px', background: 'var(--AccentFillColorDefaultBrush, var(--accent-base))' } },
      { Key: 'dark-1', Shape: 'rectangle', Style: { gridColumn: '2', gridRow: '2', minHeight: '150px', margin: '6px', background: 'DarkGray' } },
      { Key: 'light-1', Shape: 'rectangle', Style: { gridColumn: '3', gridRow: '2', minHeight: '150px', margin: '6px', background: 'LightGray' } },
      { Key: 'light-2', Shape: 'rectangle', Style: { gridColumn: '2', gridRow: '3', minHeight: '150px', margin: '6px', background: 'LightGray' } },
      { Key: 'dark-2', Shape: 'rectangle', Style: { gridColumn: '3', gridRow: '3', minHeight: '150px', margin: '6px', background: 'DarkGray' } }
    ]
  },
  {
    Name: 'Page2',
    Title: LoremIpsumTitle,
    ClassName: 'sample-page-two',
    Body: LoremIpsum,
    CopyClass: 'page-two-copy',
    Tiles: [
      { Key: 'destination', Shape: 'rectangle', Style: { gridColumn: '1', gridRow: '2', width: '150px', height: '200px', minHeight: '150px', margin: '12px', alignSelf: 'start', background: 'var(--AccentFillColorDefaultBrush, var(--accent-base))' } }
    ]
  },
  {
    Name: 'Page3',
    ClassName: 'sample-page-three',
    Body: LoremIpsum,
    CopyClass: 'page-three-copy',
    Tiles: [
      { Key: 'wide', Shape: 'rectangle', Style: { gridColumn: '1', gridRow: '2 / span 2', minHeight: '150px', margin: '5px', background: 'LightGray' } },
      { Key: 'dark', Shape: 'rectangle', Style: { gridColumn: '2', gridRow: '2', minHeight: '150px', margin: '5px', background: 'DarkGray' } },
      { Key: 'gray', Shape: 'rectangle', Style: { gridColumn: '2', gridRow: '3', minHeight: '150px', margin: '5px', background: 'Gray' } },
      { Key: 'light', Shape: 'rectangle', Style: { gridColumn: '3', gridRow: '2', minHeight: '150px', margin: '5px', background: 'LightGray' } },
      { Key: 'dark-2', Shape: 'rectangle', Style: { gridColumn: '3', gridRow: '3', minHeight: '150px', margin: '5px', background: 'DarkGray' } }
    ]
  },
  {
    Name: 'Page4',
    ClassName: 'sample-page-four',
    Body: LoremIpsum,
    CopyClass: 'page-four-copy',
    Tiles: [
      { Key: 'wide', Shape: 'rectangle', Style: { gridColumn: '1', gridRow: '1', minHeight: '150px', margin: '5px', background: 'DarkSalmon' } },
      { Key: 'dark', Shape: 'rectangle', Style: { gridColumn: '2', gridRow: '1', minHeight: '150px', margin: '5px', background: 'DarkRed' } },
      { Key: 'light', Shape: 'rectangle', Style: { gridColumn: '3', gridRow: '1', minHeight: '150px', margin: '5px', background: 'LightCoral' } },
      { Key: 'light-2', Shape: 'rectangle', Style: { gridColumn: '1', gridRow: '2', minHeight: '150px', margin: '5px', background: 'LightCoral' } },
      { Key: 'dark-2', Shape: 'rectangle', Style: { gridColumn: '2', gridRow: '2', minHeight: '150px', margin: '5px', background: 'DarkRed' } },
      { Key: 'middle', Shape: 'rectangle', Style: { gridColumn: '3', gridRow: '2', minHeight: '150px', margin: '5px', background: 'IndianRed' } }
    ]
  },
  {
    Name: 'Page5',
    ClassName: 'sample-page-five',
    Body: LoremIpsum,
    CopyClass: 'page-five-copy',
    Tiles: [
      { Key: 'khaki', Shape: 'rectangle', Style: { gridColumn: '1', gridRow: '1', minHeight: '150px', margin: '5px', background: 'Khaki' } },
      { Key: 'dark-khaki', Shape: 'rectangle', Style: { gridColumn: '2', gridRow: '1', minHeight: '150px', margin: '5px', background: 'DarkKhaki' } },
      { Key: 'ellipse-large', Shape: 'ellipse', Style: { gridColumn: '3', gridRow: '1', width: '150px', height: '150px', background: 'DarkSeaGreen' } },
      { Key: 'ellipse-small', Shape: 'ellipse', Style: { gridColumn: '1 / span 2', gridRow: '2', width: '75px', height: '75px', background: 'MediumSeaGreen' } },
      { Key: 'olive', Shape: 'rectangle', Style: { gridColumn: '3', gridRow: '2', minHeight: '150px', margin: '5px', background: 'DarkOliveGreen' } }
    ]
  }
];

const CurrentFramePage = computed(() => SamplePages[selectedFramePageIndex.value] ?? SamplePages[0]);

const GetSelectorBarSelectedIndex = (sender) => {
  const selectedItem = sender?.SelectedItem;
  const items = Array.isArray(sender?.Items) ? sender.Items : [];
  const selectedIndex = items.indexOf(selectedItem);
  return selectedIndex >= 0 ? selectedIndex : 0;
};

const SelectorBar2_SelectionChanged = (sender) => {
  const currentSelectedIndex = GetSelectorBarSelectedIndex(sender);
  const slideNavigationTransitionEffect = currentSelectedIndex - previousSelectedIndex.value > 0 ? 'FromRight' : 'FromLeft';

  FrameTransitionClass.value = getNavigationTransitionInfoClassName(
    createSlideNavigationTransitionInfo(slideNavigationTransitionEffect)
  );
  selectedFramePageIndex.value = currentSelectedIndex;
  previousSelectedIndex.value = currentSelectedIndex;
};

const SelectorBar3_SelectionChanged = (sender) => {
  const currentSelectedIndex = GetSelectorBarSelectedIndex(sender);
  if (currentSelectedIndex === 0) {
    ItemsView3ItemsSource.value = PinkColorCollection;
  } else if (currentSelectedIndex === 1) {
    ItemsView3ItemsSource.value = PlumColorCollection;
  } else {
    ItemsView3ItemsSource.value = PowderBlueColorCollection;
  }
};

const BasicSelectorBarVue = `<WinSelectorBar>
  <WinSelectorBarItem Text="Recent" Icon="Clock" />
  <WinSelectorBarItem Text="Shared" Icon="Share" />
  <WinSelectorBarItem Text="Favorites" Icon="Favorite" />
</WinSelectorBar>`;

const FrameSlideTransitionsVue = `<WinSelectorBar @SelectionChanged="SelectorBar2_SelectionChanged">
  <WinSelectorBarItem Text="Page1" IsSelected />
  <WinSelectorBarItem Text="Page2" />
  <WinSelectorBarItem Text="Page3" />
  <WinSelectorBarItem Text="Page4" />
  <WinSelectorBarItem Text="Page5" />
</WinSelectorBar>

<div class="selectorbar-content-frame">
  <div :key="CurrentFramePage.Name" :class="FrameTransitionClass">
    <component :is="CurrentFramePage" />
  </div>
</div>`;

const DisplayingDifferentCollectionsVue = `<WinSelectorBar @SelectionChanged="SelectorBar3_SelectionChanged">
  <WinSelectorBarItem Text="Pink" IsSelected />
  <WinSelectorBarItem Text="Plum" />
  <WinSelectorBarItem Text="PowderBlue" />
</WinSelectorBar>

<WinItemsView
  :ItemsSource="ItemsView3ItemsSource"
  :Layout="{ Type: 'StackLayout', Orientation: 'Horizontal' }">
  <template #item="{ item }">
    <div class="color-item-container" :style="{ background: item }" />
  </template>
</WinItemsView>`;
</script>

<style scoped>
.page-heading {
  position: relative;
}

.page-header {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 600;
}

.page-description {
  margin: 0 72px 16px 0;
  color: var(--text-secondary);
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
}

.icon {
  color: inherit;
  font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons');
  font-size: 16px;
  line-height: 16px;
}

.selectorbar-sample-stack {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
}

.selectorbar-content-frame {
  width: 100%;
  max-width: 780px;
  min-height: 260px;
  overflow: hidden;
}

.selectorbar-sample-page {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  grid-auto-rows: auto;
  align-content: start;
  justify-self: stretch;
  color: var(--text-primary);
  background: transparent;
  will-change: opacity, transform;
}

.sample-page-one {
  grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto auto auto 1fr;
}

.sample-page-two {
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: auto auto;
}

.sample-page-three {
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: auto auto auto 1fr;
}

.sample-page-four {
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: auto auto auto;
}

.sample-page-five {
  grid-template-columns: 1fr 1fr 4fr;
  grid-template-rows: auto auto auto auto;
}

.sample-page-tile {
  box-sizing: border-box;
  min-width: 0;
}

.sample-page-tile.ellipse {
  border-radius: 50%;
}

.sample-page-title {
  margin: 0 0 12px;
  width: auto;
  min-width: 0;
  max-width: none;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.sample-page-copy {
  width: auto;
  min-width: 0;
  max-width: none;
  justify-self: stretch;
  color: var(--text-primary);
}

.sample-page-body {
  margin: 0;
  width: auto;
  min-width: 0;
  max-width: none;
  line-height: 20px;
}

.page-one-copy {
  grid-column: 1 / span 3;
  grid-row: 4;
  margin: 12px 6px;
}

.page-two-copy {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  min-height: 200px;
  flex-direction: column;
  align-items: stretch;
  margin: 12px;
}

.page-three-copy {
  grid-column: 1 / span 3;
  grid-row: 4;
  margin: 5px;
}

.page-four-copy {
  grid-column: 1 / span 3;
  grid-row: 3;
  margin: 5px;
}

.page-five-copy {
  grid-column: 1 / span 3;
  grid-row: 4;
  margin: 5px;
}

.selectorbar-colors-view {
  width: 100%;
  max-width: 100%;
  min-height: 92px;
}

.selectorbar-colors-view :deep(.win-scroll-viewer-viewport) {
  overflow-y: hidden;
}

.selectorbar-colors-view :deep(.layout-stacklayout.orientation-horizontal) {
  flex-direction: row;
}

.selectorbar-colors-view :deep(.win-items-view-item) {
  border: 0;
  border-radius: 0;
  background: transparent;
}

.selectorbar-colors-view :deep(.win-items-view-item:hover),
.selectorbar-colors-view :deep(.win-items-view-item:active) {
  background: transparent;
}

.color-item-container {
  width: 112px;
  height: 82px;
  margin: 4px;
}
</style>
