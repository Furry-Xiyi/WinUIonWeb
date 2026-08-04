<template>
  <WinScrollViewer class="gallery-home-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-home-page">
      <div class="home-page">
          <section class="home-page-header">
            <div class="home-header-image-mask">
              <div class="home-header-image-grid">
                <img class="home-header-image" :src="heroImage" alt="" />
              </div>
            </div>

            <div class="home-header-copy">
              <WinTextBlock class="home-header-subtitle" :Text="$t(appManifest.version ?? 'app.version')" :FontSize="18" />
              <WinTextBlock class="home-header-title" :Text="$t('app.title')" :FontSize="40" FontWeight="600" :LineHeight="52" />
            </div>

            <WinHorizontalScrollContainer class="home-header-tiles-scroll">
              <div class="home-header-tiles">
                <WinHomeHeaderTile
                  v-for="tile in headerTiles"
                  :key="tile.Title"
                  :Title="tile.Title"
                  :Description="tile.Description"
                  :Icon="tile.Icon"
                  :Link="tile.Link" />
              </div>
            </WinHorizontalScrollContainer>
          </section>

          <WinSelectorBar
            :class="['filter-bar', 'token-filter-bar', { 'is-cjk-locale': locale === 'zh-CN' }]"
            HorizontalAlignment="Center"
            :Items="filterItems"
            :SelectedItem="filterItems[selectedFilterIndex]"
            @SelectionChanged="OnFilterChanged" />

          <main class="switch-presenter">
            <section v-if="selectedFilter === 'Recent'" key="Recent" class="sample-panel EntranceNavigationTransitionInfo">
              <template v-if="RecentlyVisitedSamplesList.length > 0">
                <WinTextBlock class="sample-panel-title" :Text="$t('text.recently-visited')" />
                <WinHorizontalScrollContainer class="recently-visited-container">
                  <div class="single-row-grid-view">
                    <button
                      v-for="item in RecentlyVisitedSamplesList"
                      :key="item.UniqueId"
                      class="control-item single-row"
                      type="button"
                      @click="OnItemGridViewItemClick(item)">
                      <span class="control-item-surface">
                        <img class="control-item-image" :src="item.ImagePath" :alt="item.Title" />
                        <span class="control-item-text">
                          <WinTextBlock class="control-item-title" :Text="item.Title" />
                          <WinTextBlock class="control-item-subtitle" :Text="item.Subtitle" TextWrapping="Wrap" />
                        </span>
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
                  <span class="control-item-surface">
                    <img class="control-item-image" :src="item.ImagePath" :alt="item.Title" />
                    <span class="control-item-text">
                      <WinTextBlock class="control-item-title" :Text="item.Title" />
                      <WinTextBlock class="control-item-subtitle" :Text="item.Subtitle" TextWrapping="Wrap" />
                    </span>
                  </span>
                </button>
              </div>
            </section>

            <section v-else key="Favorites" class="sample-panel EntranceNavigationTransitionInfo">
              <div v-if="FavoriteSamplesList.length > 0" class="grid-view">
                <button
                  v-for="item in FavoriteSamplesList"
                  :key="item.UniqueId"
                  class="control-item"
                  type="button"
                  @click="OnItemGridViewItemClick(item)">
                  <span class="control-item-surface">
                    <img class="control-item-image" :src="item.ImagePath" :alt="item.Title" />
                    <span class="control-item-text">
                      <WinTextBlock class="control-item-title" :Text="item.Title" />
                      <WinTextBlock class="control-item-subtitle" :Text="item.Subtitle" TextWrapping="Wrap" />
                    </span>
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
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import WinHomeHeaderTile from '../components/WinHomeHeaderTile.vue';
import WinHorizontalScrollContainer from '../../components/WinHorizontalScrollContainer.vue';
import WinSelectorBar from '../../components/WinSelectorBar.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import appIcon from '../../assets/AppIcon.ico';
import splashDark from '../../assets/HomePage/Splash-Dark.png';
import splashLight from '../../assets/HomePage/Splash-Light.png';
import appManifest from '../../manifest.json';
import { favoritesStorageKey, getStoredFavorites } from '../../utils/pageState';

import { useI18n } from '../../components/i18n/index';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t, locale } = useI18n();
const navigate = inject('navigate', () => {});
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
  { Icon: 'Clock', Text: t('text.recent'), Tag: 'Recent' },
  { Icon: 'Favorite', Text: t('text.favorites'), Tag: 'Favorites' }
];

const headerTiles = computed(() => [
  {
    Title: t('text.getting-started'),
    Description: t('text.get-started-with-winui-and-explore-detailed-docu'),
    Link: 'https://aka.ms/winui-getstarted',
    Icon: imageIcon(homeHeaderTileImage('Header-WinUI.png'))
  },
  {
    Title: t('text.design'),
    Description: t('text.guidelines-and-toolkits-for-creating-stunning-wi'),
    Link: 'https://learn.microsoft.com/windows/apps/design/',
    Icon: imageIcon(homeHeaderTileImage('Header-WindowsDesign.png'))
  },
  {
    Title: t('text.winui-on-web-on-github'),
    Description: t('text.explore-the-winui-on-web-source-code-and-reposit'),
    Link: 'http://github.com/Furry-Xiyi/WinUIonWeb/',
    Icon: imageIcon(appIcon)
  },
  {
    Title: t('text.community-toolkit'),
    Description: t('text.a-collection-of-helper-functions-controls-and-ap'),
    Link: 'https://apps.microsoft.com/store/detail/windows-community-toolkit-sample-app/9NBLGGH4TLCQ',
    Icon: imageIcon(homeHeaderTileImage('Header-Toolkit.png'))
  },
  {
    Title: t('text.code-samples'),
    Description: t('text.find-samples-that-demonstrate-specific-tasks-fea'),
    Link: 'https://learn.microsoft.com/windows/apps/get-started/samples',
    Icon: glyphIcon('\uE943')
  },
  {
    Title: t('text.partner-center'),
    Description: t('text.upload-your-app-to-the-store'),
    Link: 'https://developer.microsoft.com/windows/',
    Icon: imageIcon(homeHeaderTileImage(isDark.value ? 'Header-Store.dark.png' : 'Header-Store.light.png'))
  }
]);

const controlItems = [
  { UniqueId: 'button', ImageName: 'Button', Title: t('text.button'), Subtitle: t('text.a-control-that-responds-to-user-input-and-trigge') },
  { UniqueId: 'dropdownbutton', ImageName: 'DropDownButton', Title: t('text.dropdownbutton'), Subtitle: t('text.a-button-that-displays-a-flyout-of-choices-when') },
  { UniqueId: 'hyperlinkbutton', ImageName: 'HyperlinkButton', Title: t('text.hyperlinkbutton'), Subtitle: t('text.a-button-that-appears-as-a-hyperlink') },
  { UniqueId: 'repeatbutton', ImageName: 'RepeatButton', Title: t('text.repeatbutton'), Subtitle: t('text.a-button-that-raises-its-click-event-repeatedly') },
  { UniqueId: 'togglebutton', ImageName: 'ToggleButton', Title: t('text.togglebutton'), Subtitle: t('text.a-button-that-can-be-on-or-off') },
  { UniqueId: 'splitbutton', ImageName: 'SplitButton', Title: t('text.splitbutton'), Subtitle: t('text.a-button-with-a-primary-action-and-a-secondary-m') },
  { UniqueId: 'togglesplitbutton', ImageName: 'ToggleSplitButton', Title: t('text.togglesplitbutton'), Subtitle: t('text.a-toggleable-split-button') },
  { UniqueId: 'checkbox', ImageName: 'CheckBox', Title: t('text.checkbox'), Subtitle: t('text.a-control-that-a-user-can-select-or-clear') },
  { UniqueId: 'colorpicker', ImageName: 'ColorPicker', Title: t('text.colorpicker'), Subtitle: t('text.lets-the-user-pick-a-color') },
  { UniqueId: 'combobox', ImageName: 'ComboBox', Title: t('text.combobox'), Subtitle: t('text.lets-users-pick-one-item-from-a-list') },
  { UniqueId: 'radiobutton', ImageName: 'RadioButton', Title: t('text.radiobuttons'), Subtitle: t('text.a-control-that-allows-a-user-to-select-a-single') },
  { UniqueId: 'rating', ImageName: 'RatingControl', Title: t('text.ratingcontrol'), Subtitle: t('text.allows-users-to-view-and-set-ratings') },
  { UniqueId: 'slider', ImageName: 'Slider', Title: t('text.slider'), Subtitle: t('text.lets-users-select-from-a-range-of-values') },
  { UniqueId: 'toggleswitch', ImageName: 'ToggleSwitch', Title: t('text.toggleswitch'), Subtitle: t('text.switch-that-can-be-toggled-between-two-states') },
  { UniqueId: 'flipview', ImageName: 'FlipView', Title: t('text.flipview'), Subtitle: t('text.lets-people-browse-images-or-other-items-one-at') },
  { UniqueId: 'gridview', ImageName: 'GridView', Title: t('text.gridview'), Subtitle: t('text.items-in-a-flexible-grid') },
  { UniqueId: 'itemsrepeater', ImageName: 'ItemsRepeater', Title: t('text.itemsrepeater'), Subtitle: t('text.displays-repeating-data') },
  { UniqueId: 'itemsview', ImageName: 'ItemsView', Title: t('text.itemsview'), Subtitle: t('text.displays-a-collection-of-data-items') },
  { UniqueId: 'listview', ImageName: 'ListView', Title: t('text.listview'), Subtitle: t('text.a-control-that-presents-a-collection-of-items-in') },
  { UniqueId: 'pulltorefresh', ImageName: 'PullToRefresh', Title: t('text.pulltorefresh'), Subtitle: t('text.refresh-content-with-a-pulling-gesture') },
  { UniqueId: 'treeview', ImageName: 'TreeView', Title: t('text.treeview'), Subtitle: t('text.display-hierarchical-data') },
  { UniqueId: 'calendardatepicker', ImageName: 'CalendarDatePicker', Title: t('text.calendardatepicker'), Subtitle: t('text.a-control-that-lets-users-pick-a-date-from-a-cal') },
  { UniqueId: 'calendarview', ImageName: 'CalendarView', Title: t('text.calendarview'), Subtitle: t('text.shows-a-calendar-that-lets-a-user-choose-a-date') },
  { UniqueId: 'datepicker', ImageName: 'DatePicker', Title: t('text.datepicker'), Subtitle: t('text.a-control-that-lets-users-pick-a-date-value') },
  { UniqueId: 'timepicker', ImageName: 'TimePicker', Title: t('text.timepicker'), Subtitle: t('text.a-control-that-lets-users-pick-a-time-value') },
  { UniqueId: 'expander', ImageName: 'Expander', Title: t('text.expander'), Subtitle: t('text.a-control-with-a-header-that-shows-or-hides-cont') },
  { UniqueId: 'splitview', ImageName: 'SplitView', Title: t('text.splitview'), Subtitle: t('text.a-container-with-two-views-one-for-primary-conte') },
  { UniqueId: 'animatedvisualplayer', ImageName: 'AnimatedVisualPlayer', Title: t('text.animatedvisualplayer'), Subtitle: t('text.plays-animated-content') },
  { UniqueId: 'captureelement', ImageName: 'CaptureElement', Title: t('text.capture-element-camera'), Subtitle: t('text.captures-media-from-a-camera') },
  { UniqueId: 'image', ImageName: 'Image', Title: t('text.image'), Subtitle: t('text.displays-an-image') },
  { UniqueId: 'mediaplayerelement', ImageName: 'MediaPlayerElement', Title: t('text.mediaplayerelement'), Subtitle: t('text.plays-media-content') },
  { UniqueId: 'personpicture', ImageName: 'PersonPicture', Title: t('text.personpicture'), Subtitle: t('text.displays-a-persons-picture') },
  { UniqueId: 'commandbar', ImageName: 'CommandBar', Title: t('text.commandbar'), Subtitle: t('text.a-toolbar-for-commands') },
  { UniqueId: 'commandbarflyout', ImageName: 'CommandBarFlyout', Title: t('text.commandbarflyout'), Subtitle: t('text.a-contextual-command-bar-in-a-flyout') },
  { UniqueId: 'menubar', ImageName: 'MenuBar', Title: t('text.menubar'), Subtitle: t('text.a-horizontal-menu-of-app-commands') },
  { UniqueId: 'menuflyout', ImageName: 'MenuFlyout', Title: t('text.menuflyout'), Subtitle: t('text.a-flyout-that-displays-menu-commands') },
  { UniqueId: 'contentdialog', ImageName: 'ContentDialog', Title: t('text.contentdialog'), Subtitle: t('text.a-dialog-that-can-contain-custom-ui-content') },
  { UniqueId: 'flyout', ImageName: 'Flyout', Title: t('text.flyout'), Subtitle: t('text.a-lightweight-popup-container') },
  { UniqueId: 'popup', ImageName: 'Popup', Title: t('text.popup'), Subtitle: t('text.displays-content-on-top-of-existing-content') },
  { UniqueId: 'teachingtip', ImageName: 'TeachingTip', Title: t('text.teachingtip'), Subtitle: t('text.a-flyout-like-control-used-to-deliver-contextual') },
  { UniqueId: 'autosuggestbox', ImageName: 'AutoSuggestBox', Title: t('text.autosuggestbox'), Subtitle: t('text.a-text-box-that-makes-suggestions-as-the-user-ty') },
  { UniqueId: 'numberbox', ImageName: 'NumberBox', Title: t('text.numberbox'), Subtitle: t('text.a-control-for-numeric-input') },
  { UniqueId: 'passwordbox', ImageName: 'PasswordBox', Title: t('text.passwordbox'), Subtitle: t('text.a-control-for-password-input') },
  { UniqueId: 'richeditbox', ImageName: 'RichEditBox', Title: t('text.richeditbox'), Subtitle: t('text.lets-users-edit-rich-formatted-text') },
  { UniqueId: 'textbox', ImageName: 'TextBox', Title: t('text.textbox'), Subtitle: t('text.lets-users-enter-simple-text-input') },
  { UniqueId: 'textblock', ImageName: 'TextBlock', Title: t('text.textblock'), Subtitle: t('text.displays-read-only-text') }
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

const OnFilterChanged = (sender) => {
  const selectedItem = sender?.SelectedItem;
  const selectedIndex = Math.max(0, sender?.Items?.indexOf(selectedItem) ?? 0);
  selectedFilterIndex.value = selectedIndex;
  selectedFilter.value = selectedItem.Tag;
};

const OnItemGridViewItemClick = (item) => {
  if (item?.UniqueId) navigate(item.UniqueId);
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
  width: 100%;
  min-width: 0;
  margin: 0;
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
  mask-image: linear-gradient(to bottom, #000 0%, #000 88%, rgba(0, 0, 0, 0) 96%, transparent 100%);
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

.filter-bar {
  justify-self: center;
  align-self: center;
  width: max-content;
  max-width: 100%;
  margin: 24px 0 16px 0;
}

.token-filter-bar {
  --SelectorBarItemSpacing: 8px;
  --SelectorBarItemIconScale: 0.8;
  --ControlContentThemeFontSize: 14px;
  --TokenViewSelectorBarTextFontFamily: 'Segoe UI Variable Text', 'Segoe UI Variable', 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', system-ui, sans-serif;
  gap: 8px;
}

.token-filter-bar.is-cjk-locale {
  --TokenViewSelectorBarTextFontFamily: 'Microsoft YaHei UI', 'Microsoft YaHei', 'Segoe UI Variable Text', 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif;
}

.token-filter-bar :deep(.win-selector-bar-items-view) {
  gap: 8px;
  padding: 4px 0;
}

.token-filter-bar :deep(.win-selector-bar-item) {
  box-sizing: border-box;
  width: auto;
  height: 32px;
  min-height: 32px;
  padding: 0;
  grid-template-rows: auto;
  align-items: center;
  justify-items: center;
  color: var(--text-primary);
  background: var(--control-fill-color-default, var(--ctrl-fill-default));
  border: 1px solid var(--control-stroke-color-default, var(--ctrl-border));
  border-radius: 16px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  font-family: var(--TokenViewSelectorBarTextFontFamily);
}

.token-filter-bar :deep(.win-selector-bar-item-content) {
  grid-row: 1;
  grid-column: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: max-content;
  height: 20px;
  margin: 5px 23px 5px;
  line-height: 1;
}

.token-filter-bar :deep(.win-selector-bar-item-text) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  font-family: var(--TokenViewSelectorBarTextFontFamily);
  transform: none;
  vertical-align: top;
}

.token-filter-bar :deep(.win-selector-bar-item-icon) {
  width: 20px;
  height: 20px;
  margin: 0 -2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 20px;
  font-size: 20px;
  line-height: 20px;
}

.token-filter-bar :deep(.win-selector-bar-item-icon-glyph) {
  width: 20px;
  height: 20px;
  font-size: inherit;
  line-height: inherit;
}

.token-filter-bar :deep(.win-selector-bar-item:hover) {
  color: var(--text-primary);
  background: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
}

.token-filter-bar :deep(.win-selector-bar-item:active) {
  color: var(--text-secondary);
  background: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
}

.token-filter-bar :deep(.win-selector-bar-item.is-selected) {
  color: var(--accent-text);
  background: var(--accent-base);
  border-color: var(--accent-base);
  font-weight: 400;
}

.token-filter-bar :deep(.win-selector-bar-item.is-selected:hover) {
  color: var(--accent-text);
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.token-filter-bar :deep(.win-selector-bar-item.is-selected:active) {
  color: var(--accent-text-secondary);
  background: var(--accent-pressed);
  border-color: var(--accent-pressed);
}

.token-filter-bar :deep(.win-selector-bar-item-selection-visual) {
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
  padding: 0;
  display: block;
  text-align: left;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid var(--card-stroke);
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
}

.control-item-surface {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 8px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 0;
  color: inherit;
  background: transparent;
  border-radius: 8px;
}

.control-item-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--control-item-fill, var(--CardBackgroundFillColorDefaultBrush, var(--card-bg)));
  transition: background var(--faster-duration, 83ms) linear;
}

.control-item.single-row {
  width: 300px;
  flex: 0 0 300px;
}

.control-item:hover:not(:active) {
  color: var(--text-primary);
}

.control-item:hover:not(:active) .control-item-surface {
  --control-item-fill: var(--control-fill-color-secondary, var(--ctrl-fill-secondary));
}

.control-item:active {
  color: var(--text-secondary);
}

.control-item:active .control-item-surface {
  --control-item-fill: var(--control-fill-color-tertiary, var(--ctrl-fill-tertiary));
}

.control-item-image {
  position: relative;
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
  color: inherit;
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
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }

  .home-header-copy {
    margin-left: 24px;
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
