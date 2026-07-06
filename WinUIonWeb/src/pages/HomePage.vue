<template>
  <div class="home-page">
    <section class="home-page-header">
      <div class="home-header-image-mask">
        <div class="home-header-image-grid">
          <img class="home-header-image" :src="heroImage" alt="" />
        </div>
      </div>

      <div class="home-header-copy">
        <WinTextBlock class="home-header-subtitle" Text="WinUI on Web 1.0-Insider" :FontSize="18" />
        <WinTextBlock class="home-header-title" Text="WinUI on Web Gallery" :FontSize="40" FontWeight="600" :LineHeight="52" />
      </div>

      <WinHorizontalScrollContainer class="home-header-tiles-scroll">
        <div class="home-header-tiles">
          <WinSettingsCard
            v-for="tile in headerTiles"
            :key="tile.Title"
            class="home-header-tile"
            :header="tile.Title"
            :description="tile.Description"
            :headerIcon="tile.Icon"
            :isClickEnabled="true"
            role="link"
            tabindex="0"
            @click="openTile(tile)"
            @keydown.enter="openTile(tile)"
            @keydown.space.prevent="openTile(tile)" />
        </div>
      </WinHorizontalScrollContainer>
    </section>

    <WinSelectorBar
      class="filter-bar token-filter-bar"
      :items="filterItems"
      :selectedIndex="selectedFilterIndex"
      @selectionChanged="OnFilterChanged" />

    <main class="switch-presenter">
      <section v-if="selectedFilter === 'Recent'" key="Recent" class="sample-panel page-transition-up">
        <template v-if="RecentlyVisitedSamplesList.length > 0">
          <WinTextBlock class="sample-panel-title" Text="Recently visited" />
            <WinHorizontalScrollContainer class="recently-visited-container">
              <div class="single-row-grid-view">
                <button
                  v-for="item in RecentlyVisitedSamplesList"
                :key="item.UniqueId"
                class="control-item single-row"
                type="button"
                @click="OnItemGridViewItemClick(item)">
                <img class="control-item-image" :src="item.ImagePath" :alt="item.Title" />
                <span class="control-item-text">
                  <WinTextBlock class="control-item-title" :Text="item.Title" />
                  <WinTextBlock class="control-item-subtitle" :Text="item.Subtitle" TextWrapping="Wrap" />
                </span>
                </button>
              </div>
            </WinHorizontalScrollContainer>
        </template>

        <WinTextBlock class="sample-panel-title recently-added-title" Text="Recently added or updated" />
        <div class="grid-view">
          <button
            v-for="item in RecentlyAddedOrUpdatedSamplesList"
            :key="item.UniqueId"
            class="control-item"
            type="button"
            @click="OnItemGridViewItemClick(item)">
            <img class="control-item-image" :src="item.ImagePath" :alt="item.Title" />
            <span class="control-item-text">
              <WinTextBlock class="control-item-title" :Text="item.Title" />
              <WinTextBlock class="control-item-subtitle" :Text="item.Subtitle" TextWrapping="Wrap" />
            </span>
          </button>
        </div>
      </section>

      <section v-else key="Favorites" class="sample-panel page-transition-up">
        <div v-if="FavoriteSamplesList.length > 0" class="grid-view">
          <button
            v-for="item in FavoriteSamplesList"
            :key="item.UniqueId"
            class="control-item"
            type="button"
            @click="OnItemGridViewItemClick(item)">
            <img class="control-item-image" :src="item.ImagePath" :alt="item.Title" />
            <span class="control-item-text">
              <WinTextBlock class="control-item-title" :Text="item.Title" />
              <WinTextBlock class="control-item-subtitle" :Text="item.Subtitle" TextWrapping="Wrap" />
            </span>
          </button>
        </div>
        <div v-else class="favorite-samples-fallback-message">
          <img class="favorite-samples-fallback-image" :src="controlImage('RatingControl')" alt="" />
          <WinTextBlock class="favorite-samples-fallback-title" Text="No favorites yet" />
          <WinTextBlock
            class="favorite-samples-fallback-description"
            Text="Favorite samples by clicking the star icon on the sample page."
            TextAlignment="Center" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import WinHorizontalScrollContainer from '../components/WinHorizontalScrollContainer.vue';
import WinSelectorBar from '../components/WinSelectorBar.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinTextBlock from '../components/WinTextBlock.vue';
import appIcon from '../assets/AppIcon.ico';
import splashDark from '../assets/HomePage/Splash-Dark.png';
import splashLight from '../assets/HomePage/Splash-Light.png';
import { favoritesStorageKey, getStoredFavorites } from '../utils/pageState';

const currentPage = inject('currentPage');
const favorites = ref(getStoredFavorites());
const selectedFilterIndex = ref(0);
const selectedFilter = ref('Recent');
const isDark = ref(false);
let mediaQueryList = null;
let themeObserver = null;

const galleryAssetRoot = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets';
const controlImage = (name) => `${galleryAssetRoot}/ControlImages/${name}.png`;
const homeHeaderTileImage = (name) => `${galleryAssetRoot}/HomeHeaderTiles/${name}`;
const imageIcon = (src) => `<img src="${src}" alt="">`;
const glyphIcon = (glyph) => glyph;

const filterItems = [
  { icon: 'Clock', text: 'Recent', Tag: 'Recent' },
  { icon: 'Favorite', text: 'Favorites', Tag: 'Favorites' }
];

const headerTiles = computed(() => [
  {
    Title: 'Getting started',
    Description: 'Get started with WinUI and explore detailed documentation.',
    Link: 'https://aka.ms/winui-getstarted',
    Icon: imageIcon(homeHeaderTileImage('Header-WinUI.png'))
  },
  {
    Title: 'Design',
    Description: 'Guidelines and toolkits for creating stunning WinUI experiences.',
    Link: 'https://learn.microsoft.com/windows/apps/design/',
    Icon: imageIcon(homeHeaderTileImage('Header-WindowsDesign.png'))
  },
  {
    Title: 'WinUI on Web on GitHub',
    Description: 'Explore the WinUI on Web source code and repository.',
    Link: 'http://github.com/Furry-Xiyi/WinUIonWeb/',
    Icon: imageIcon(appIcon)
  },
  {
    Title: 'Community Toolkit',
    Description: 'A collection of helper functions, controls, and app services.',
    Link: 'https://apps.microsoft.com/store/detail/windows-community-toolkit-sample-app/9NBLGGH4TLCQ',
    Icon: imageIcon(homeHeaderTileImage('Header-Toolkit.png'))
  },
  {
    Title: 'Code samples',
    Description: 'Find samples that demonstrate specific tasks, features, and APIs.',
    Link: 'https://learn.microsoft.com/windows/apps/get-started/samples',
    Icon: glyphIcon('\uE943')
  },
  {
    Title: 'Partner Center',
    Description: 'Upload your app to the Store.',
    Link: 'https://developer.microsoft.com/windows/',
    Icon: imageIcon(homeHeaderTileImage(isDark.value ? 'Header-Store.dark.png' : 'Header-Store.light.png'))
  }
]);

const controlItems = [
  { UniqueId: 'button', ImageName: 'Button', Title: 'Button', Subtitle: 'A control that responds to user input and triggers an event.' },
  { UniqueId: 'dropdownbutton', ImageName: 'DropDownButton', Title: 'DropDownButton', Subtitle: 'A button that displays a flyout of choices when clicked.' },
  { UniqueId: 'hyperlinkbutton', ImageName: 'HyperlinkButton', Title: 'HyperlinkButton', Subtitle: 'A button that appears as a hyperlink.' },
  { UniqueId: 'repeatbutton', ImageName: 'RepeatButton', Title: 'RepeatButton', Subtitle: 'A button that raises its click event repeatedly while pressed.' },
  { UniqueId: 'togglebutton', ImageName: 'ToggleButton', Title: 'ToggleButton', Subtitle: 'A button that can be on or off.' },
  { UniqueId: 'splitbutton', ImageName: 'SplitButton', Title: 'SplitButton', Subtitle: 'A button with a primary action and a secondary menu.' },
  { UniqueId: 'togglesplitbutton', ImageName: 'ToggleSplitButton', Title: 'ToggleSplitButton', Subtitle: 'A toggleable split button.' },
  { UniqueId: 'checkbox', ImageName: 'CheckBox', Title: 'CheckBox', Subtitle: 'A control that a user can select or clear.' },
  { UniqueId: 'colorpicker', ImageName: 'ColorPicker', Title: 'ColorPicker', Subtitle: 'Lets the user pick a color.' },
  { UniqueId: 'combobox', ImageName: 'ComboBox', Title: 'ComboBox', Subtitle: 'Lets users pick one item from a list.' },
  { UniqueId: 'radiobuttons', ImageName: 'RadioButton', Title: 'RadioButtons', Subtitle: 'A control that allows a user to select a single option from a group of options.' },
  { UniqueId: 'rating', ImageName: 'RatingControl', Title: 'RatingControl', Subtitle: 'Allows users to view and set ratings.' },
  { UniqueId: 'slider', ImageName: 'Slider', Title: 'Slider', Subtitle: 'Lets users select from a range of values.' },
  { UniqueId: 'toggleswitch', ImageName: 'ToggleSwitch', Title: 'ToggleSwitch', Subtitle: 'Switch that can be toggled between two states.' },
  { UniqueId: 'flipview', ImageName: 'FlipView', Title: 'FlipView', Subtitle: 'Lets people browse images or other items, one at a time.' },
  { UniqueId: 'gridview', ImageName: 'GridView', Title: 'GridView', Subtitle: 'Items in a flexible grid.' },
  { UniqueId: 'listbox', ImageName: 'ListView', Title: 'ListBox', Subtitle: 'A control that presents an inline list of selectable items.' },
  { UniqueId: 'listview', ImageName: 'ListView', Title: 'ListView', Subtitle: 'A control that presents a collection of items in a vertical list.' },
  { UniqueId: 'pulltorefresh', ImageName: 'PullToRefresh', Title: 'PullToRefresh', Subtitle: 'Refresh content with a pulling gesture.' },
  { UniqueId: 'treeview', ImageName: 'TreeView', Title: 'TreeView', Subtitle: 'Display hierarchical data.' },
  { UniqueId: 'calendardatepicker', ImageName: 'CalendarDatePicker', Title: 'CalendarDatePicker', Subtitle: 'A control that lets users pick a date from a calendar.' },
  { UniqueId: 'calendarview', ImageName: 'CalendarView', Title: 'CalendarView', Subtitle: 'Shows a calendar that lets a user choose a date.' },
  { UniqueId: 'datepicker', ImageName: 'DatePicker', Title: 'DatePicker', Subtitle: 'A control that lets users pick a date value.' },
  { UniqueId: 'timepicker', ImageName: 'TimePicker', Title: 'TimePicker', Subtitle: 'A control that lets users pick a time value.' },
  { UniqueId: 'expander', ImageName: 'Expander', Title: 'Expander', Subtitle: 'A control with a header that shows or hides content.' },
  { UniqueId: 'splitview', ImageName: 'SplitView', Title: 'SplitView', Subtitle: 'A container with two views: one for primary content and one for navigation.' },
  { UniqueId: 'animatedvisualplayer', ImageName: 'AnimatedVisualPlayer', Title: 'AnimatedVisualPlayer', Subtitle: 'Plays animated content.' },
  { UniqueId: 'captureelement', ImageName: 'CaptureElement', Title: 'Capture Element / Camera', Subtitle: 'Captures media from a camera.' },
  { UniqueId: 'image', ImageName: 'Image', Title: 'Image', Subtitle: 'Displays an image.' },
  { UniqueId: 'mediaplayerelement', ImageName: 'MediaPlayerElement', Title: 'MediaPlayerElement', Subtitle: 'Plays media content.' },
  { UniqueId: 'personpicture', ImageName: 'PersonPicture', Title: 'PersonPicture', Subtitle: 'Displays a person\'s picture.' },
  { UniqueId: 'commandbar', ImageName: 'CommandBar', Title: 'CommandBar', Subtitle: 'A toolbar for commands.' },
  { UniqueId: 'commandbarflyout', ImageName: 'CommandBarFlyout', Title: 'CommandBarFlyout', Subtitle: 'A contextual command bar in a flyout.' },
  { UniqueId: 'menubar', ImageName: 'MenuBar', Title: 'MenuBar', Subtitle: 'A horizontal menu of app commands.' },
  { UniqueId: 'menuflyout', ImageName: 'MenuFlyout', Title: 'MenuFlyout', Subtitle: 'A flyout that displays menu commands.' },
  { UniqueId: 'contentdialog', ImageName: 'ContentDialog', Title: 'ContentDialog', Subtitle: 'A dialog that can contain custom UI content.' },
  { UniqueId: 'flyout', ImageName: 'Flyout', Title: 'Flyout', Subtitle: 'A lightweight popup container.' },
  { UniqueId: 'popup', ImageName: 'Popup', Title: 'Popup', Subtitle: 'Displays content on top of existing content.' },
  { UniqueId: 'teachingtip', ImageName: 'TeachingTip', Title: 'TeachingTip', Subtitle: 'A flyout-like control used to deliver contextual information.' },
  { UniqueId: 'autosuggestbox', ImageName: 'AutoSuggestBox', Title: 'AutoSuggestBox', Subtitle: 'A text box that makes suggestions as the user types.' },
  { UniqueId: 'numberbox', ImageName: 'NumberBox', Title: 'NumberBox', Subtitle: 'A control for numeric input.' },
  { UniqueId: 'passwordbox', ImageName: 'PasswordBox', Title: 'PasswordBox', Subtitle: 'A control for password input.' },
  { UniqueId: 'richeditbox', ImageName: 'RichEditBox', Title: 'RichEditBox', Subtitle: 'Lets users edit rich formatted text.' },
  { UniqueId: 'textbox', ImageName: 'TextBox', Title: 'TextBox', Subtitle: 'Lets users enter simple text input.' },
  { UniqueId: 'textblock', ImageName: 'TextBlock', Title: 'TextBlock', Subtitle: 'Displays read-only text.' }
].map((item) => ({
  ...item,
  ImagePath: controlImage(item.ImageName)
}));

const recentlyVisitedIds = ['button', 'combobox', 'slider', 'toggleswitch', 'splitview'];
const recentlyAddedOrUpdatedIds = [
  'colorpicker',
  'expander',
  'rating',
  'flipview',
  'pulltorefresh',
  'treeview',
  'splitbutton',
  'calendarview',
  'teachingtip',
  'contentdialog',
  'gridview'
];

const itemMap = computed(() => new Map(controlItems.map((item) => [item.UniqueId, item])));

const getValidControlItems = (ids, isFavorite = false) => {
  const validItems = [];
  const validIds = [];

  for (const id of ids ?? []) {
    const item = itemMap.value.get(id);
    if (item) {
      validItems.push(item);
      validIds.push(id);
    }
  }

  if (isFavorite && validIds.length !== (ids ?? []).length) {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(validIds));
    favorites.value = validIds;
    window.dispatchEvent(new CustomEvent('winui-favorites-changed', { detail: validIds }));
  }

  return validItems;
};

const RecentlyVisitedSamplesList = computed(() => getValidControlItems(recentlyVisitedIds));
const RecentlyAddedOrUpdatedSamplesList = computed(() => getValidControlItems(recentlyAddedOrUpdatedIds));
const FavoriteSamplesList = computed(() => getValidControlItems(favorites.value, true));

const detectTheme = () => {
  const html = document.documentElement;
  const isManualLight = html.classList.contains('theme-light') || html.getAttribute('data-theme') === 'light';
  const isManualDark = html.classList.contains('theme-dark') || html.getAttribute('data-theme') === 'dark';

  if (isManualLight) {
    isDark.value = false;
  } else if (isManualDark) {
    isDark.value = true;
  } else {
    isDark.value = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
};

const onSystemThemeChange = () => {
  detectTheme();
};

const heroImage = computed(() => isDark.value ? splashDark : splashLight);

const OnFilterChanged = ({ selectedIndex, selectedItem }) => {
  selectedFilterIndex.value = selectedIndex;
  selectedFilter.value = selectedItem.Tag;
};

const OnItemGridViewItemClick = (item) => {
  if (currentPage?.value) {
    currentPage.value = item.UniqueId;
  }
};

const openTile = (tile) => {
  window.open(tile.Link, '_blank', 'noopener');
};

const syncFavorites = () => {
  favorites.value = getStoredFavorites();
};

onMounted(() => {
  detectTheme();

  themeObserver = new MutationObserver(detectTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'theme', 'class'] });

  if (window.matchMedia) {
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryList.addEventListener('change', onSystemThemeChange);
  }

  window.addEventListener('storage', syncFavorites);
  window.addEventListener('winui-favorites-changed', syncFavorites);
});

onUnmounted(() => {
  themeObserver?.disconnect();
  mediaQueryList?.removeEventListener('change', onSystemThemeChange);
  window.removeEventListener('storage', syncFavorites);
  window.removeEventListener('winui-favorites-changed', syncFavorites);
});
</script>

<style scoped>
.home-page {
  display: grid;
  grid-template-rows: auto auto 1fr;
  width: calc(100% + 64px);
  min-width: 0;
  margin: -24px -32px 0 -32px;
  overflow-x: hidden;
}

.home-page-header {
  position: relative;
  min-height: 400px;
  overflow: hidden;
}

.home-header-image-mask {
  position: absolute;
  inset: 0;
  height: 400px;
  mask-image: linear-gradient(to bottom, #000 0%, #000 75%, rgba(0, 0, 0, 0) 85%, transparent 100%);
  overflow: hidden;
}

.home-header-image-grid {
  position: absolute;
  inset: -100px 0 0 0;
  height: 500px;
  background: #CED8E4;
}

:global(html.theme-dark) .home-header-image-grid {
  background: #020B20;
}

.home-header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  opacity: 1;
}

:global(html.theme-dark) .home-header-image {
  opacity: 1;
}

@media (prefers-color-scheme: dark) {
  :global(html:not(.theme-light)) .home-header-image-grid {
    background: #020B20;
  }

  :global(html:not(.theme-light)) .home-header-image {
    opacity: 1;
  }
}

.home-header-copy {
  position: relative;
  z-index: 1;
  margin: 48px 0 0 36px;
  display: flex;
  flex-direction: column;
}

.home-header-subtitle {
  color: var(--text-primary);
}

.home-header-title {
  color: var(--text-primary);
}

.home-header-tiles-scroll {
  position: relative;
  z-index: 1;
  margin-top: 68px;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  padding-bottom: 16px;
}

.home-header-tiles {
  display: flex;
  gap: 12px;
  width: max-content;
}

.home-header-tile {
  position: relative;
  width: 232px;
  flex: 0 0 232px;
  height: 172px;
  min-height: 172px;
  box-sizing: border-box;
  margin-bottom: 0;
  padding: 24px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 0;
  overflow: hidden;
  isolation: isolate;
  background: transparent;
  border-color: var(--flyout-border);
  border-radius: 8px;
}

.home-header-tile::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: color-mix(in srgb, var(--flyout-bg) 78%, transparent);
  backdrop-filter: var(--flyout-backdrop);
  -webkit-backdrop-filter: var(--flyout-backdrop);
}

.home-header-tile::after {
  content: "\E8A7";
  position: absolute;
  right: 12px;
  bottom: 10px;
  color: var(--text-secondary);
  font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets";
  font-size: 14px;
  z-index: 1;
}

.home-header-tile :deep(.win-settings-card-header) {
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.home-header-tile :deep(.win-settings-card-icon) {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 24px;
  line-height: 36px;
  color: var(--text-primary);
}

.home-header-tile :deep(.win-settings-card-icon img) {
  max-width: 36px;
  max-height: 36px;
  display: block;
}

.home-header-tile :deep(.win-settings-card-title) {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.home-header-tile :deep(.win-settings-card-desc) {
  display: -webkit-box;
  margin-top: 4px;
  max-height: 48px;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.home-header-tile :deep(.win-settings-card-content) {
  display: none;
}

.filter-bar {
  justify-self: center;
  width: max-content;
  max-width: 100%;
  margin: 24px 0 16px 0;
}

.token-filter-bar {
  gap: 8px;
}

.token-filter-bar :deep(.selector-bar-item) {
  box-sizing: border-box;
  padding: 5px 23px 6px;
  gap: 8px;
  color: var(--text-primary);
  background: var(--control-fill-color-default, var(--ctrl-fill-default));
  border: 1px solid var(--control-stroke-color-default, var(--ctrl-border));
  border-radius: 16px;
  line-height: 20px;
}

.token-filter-bar :deep(.item-text) {
  line-height: 20px;
}

.token-filter-bar :deep(.item-icon .icon) {
  font-size: 16px;
  line-height: 16px;
}

.token-filter-bar :deep(.selector-bar-item:hover) {
  color: var(--text-primary);
  background: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
}

.token-filter-bar :deep(.selector-bar-item:active) {
  color: var(--text-secondary);
  background: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
}

.token-filter-bar :deep(.selector-bar-item.is-selected) {
  color: var(--accent-text);
  background: var(--accent-base);
  border-color: var(--accent-base);
  font-weight: 400;
}

.token-filter-bar :deep(.selector-bar-item.is-selected:hover) {
  color: var(--accent-text);
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.token-filter-bar :deep(.selector-bar-item.is-selected:active) {
  color: var(--accent-text-secondary);
  background: var(--accent-pressed);
  border-color: var(--accent-pressed);
}

.token-filter-bar :deep(.selector-indicator) {
  display: none;
}

.switch-presenter {
  min-width: 0;
  margin: 0 36px 36px 36px;
}

.sample-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sample-panel-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--text-primary);
}

.recently-added-title {
  margin-top: 12px;
}

.recently-visited-container {
  margin: 0 -36px 12px -36px;
  padding-bottom: 12px;
  min-width: 0;
  max-width: calc(100% + 72px);
  box-sizing: border-box;
}

.single-row-grid-view {
  display: flex;
  gap: 12px;
  width: max-content;
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  gap: 12px;
  justify-content: start;
  min-width: 0;
}

.control-item {
  width: 300px;
  height: 96px;
  box-sizing: border-box;
  padding: 8px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 0;
  text-align: left;
  color: var(--text-primary);
  background: var(--control-fill-color-default, var(--ctrl-fill-default));
  border: 1px solid var(--card-stroke);
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
}

.control-item.single-row {
  width: 300px;
  flex: 0 0 300px;
}

.control-item:hover {
  background: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
}

.control-item:active {
  background: var(--control-fill-color-tertiary, var(--ctrl-fill-tertiary));
}

.control-item-image {
  width: 32px;
  margin: 12px 16px 0 8px;
  align-self: start;
  object-fit: contain;
}

.control-item-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.control-item-title {
  margin-top: 12px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.control-item-subtitle {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-samples-fallback-message {
  margin: 36px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.favorite-samples-fallback-image {
  height: 36px;
  width: auto;
}

.favorite-samples-fallback-title {
  margin: 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.favorite-samples-fallback-description {
  max-width: 360px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 20px;
}

@media (max-width: 640px) {
  .home-page {
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;
  }

  .home-header-copy {
    margin-left: 24px;
  }

  .home-header-tiles-scroll {
    padding-left: 24px;
    padding-right: 24px;
  }

  .filter-bar {
    margin-left: 0;
  }

  .switch-presenter {
    margin-left: 24px;
    margin-right: 24px;
  }

  .recently-visited-container {
    margin-left: -24px;
    margin-right: -24px;
  }

  .grid-view {
    grid-template-columns: minmax(0, 1fr);
  }

  .control-item {
    width: auto;
    height: 120px;
  }
}
</style>
