<template>
  <ScrollViewer class="gallery-home-scroll" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Disabled">
    <Grid class="gallery-home-page">
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto" />
        <RowDefinition Height="Auto" />
        <RowDefinition Height="*" />
      </Grid.RowDefinitions>
      <UserControl class="home-page-header">
        <Grid class="home-header-root" Margin="0">
          <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="Auto" />
            <RowDefinition Height="*" />
          </Grid.RowDefinitions>
          <Grid ref="headerRef" class="home-header-layout">
            <Grid.RowDefinitions>
              <RowDefinition Height="Auto" />
              <RowDefinition Height="Auto" />
              <RowDefinition Height="*" />
            </Grid.RowDefinitions>
            <Grid class="home-header-image-mask" Grid.RowSpan="3" Height="400">
              <Grid class="home-header-image-grid" Height="500" Margin="0,-100,0,0">
                <Image class="home-header-image" Source="{x:Bind HeaderImage}" Stretch="UniformToFill"
                       Width="{x:Bind HeaderImageWidth, Mode=OneWay}" Height="500"
                       Opacity="{x:Bind HeaderImageOpacity, Mode=OneWay}" />
              </Grid>
            </Grid>
            <TextBlock AutomationProperties.AutomationId="__ClickableAreaTextBlock" />
            <StackPanel class="home-header-copy" Margin="36,48,0,0" VerticalAlignment="Center">
              <TextBlock Text="{x:Bind VersionText}" FontSize="18" Foreground="{x:Bind HeaderForeground, Mode=OneWay}" />
              <TextBlock class="home-header-title" Text="{x:Bind TitleText}" FontSize="40" FontWeight="SemiBold"
                         Foreground="{x:Bind HeaderForeground, Mode=OneWay}"
                         TextWrapping="Wrap" AutomationProperties.HeadingLevel="Level1" />
            </StackPanel>
            <HorizontalScrollContainer Grid.Row="2" Margin="0,56,0,0">
              <HorizontalScrollContainer.Source>
                <StackPanel Orientation="Horizontal" Spacing="12">
                  <HomeHeaderTile Title="{x:Bind HeaderTiles[0].Title}" Description="{x:Bind HeaderTiles[0].Description}" Link="{x:Bind HeaderTiles[0].Link}">
                    <HomeHeaderTile.Source><Image Width="36" Height="36" Source="{x:Bind HeaderTiles[0].ImagePath}" /></HomeHeaderTile.Source>
                  </HomeHeaderTile>
                  <HomeHeaderTile Title="{x:Bind HeaderTiles[1].Title}" Description="{x:Bind HeaderTiles[1].Description}" Link="{x:Bind HeaderTiles[1].Link}">
                    <HomeHeaderTile.Source><Image Width="36" Height="36" Source="{x:Bind HeaderTiles[1].ImagePath}" /></HomeHeaderTile.Source>
                  </HomeHeaderTile>
                  <HomeHeaderTile Title="{x:Bind HeaderTiles[2].Title}" Description="{x:Bind HeaderTiles[2].Description}" Link="{x:Bind HeaderTiles[2].Link}">
                    <HomeHeaderTile.Source><Viewbox><PathIcon Data="{x:Bind GitHubIconPath}" Foreground="{ThemeResource TextFillColorPrimaryBrush}" /></Viewbox></HomeHeaderTile.Source>
                  </HomeHeaderTile>
                  <HomeHeaderTile Title="{x:Bind HeaderTiles[3].Title}" Description="{x:Bind HeaderTiles[3].Description}" Link="{x:Bind HeaderTiles[3].Link}">
                    <HomeHeaderTile.Source><Image Width="36" Height="36" Source="{x:Bind HeaderTiles[3].ImagePath}" /></HomeHeaderTile.Source>
                  </HomeHeaderTile>
                  <HomeHeaderTile Title="{x:Bind HeaderTiles[4].Title}" Description="{x:Bind HeaderTiles[4].Description}" Link="{x:Bind HeaderTiles[4].Link}">
                    <HomeHeaderTile.Source><FontIcon Margin="0,8,0,0" FontSize="24" Foreground="{ThemeResource TextFillColorPrimaryBrush}" Glyph="&#xE943;" /></HomeHeaderTile.Source>
                  </HomeHeaderTile>
                  <HomeHeaderTile Title="{x:Bind HeaderTiles[5].Title}" Description="{x:Bind HeaderTiles[5].Description}" Link="{x:Bind HeaderTiles[5].Link}">
                    <HomeHeaderTile.Source><Image Width="36" Height="36" Source="{x:Bind HeaderTiles[5].ImagePath, Mode=OneWay}" /></HomeHeaderTile.Source>
                  </HomeHeaderTile>
                </StackPanel>
              </HorizontalScrollContainer.Source>
            </HorizontalScrollContainer>
          </Grid>
        </Grid>
      </UserControl>
      <SelectorBar class="home-filter-bar" Grid.Row="1" Margin="36,24,0,16" HorizontalAlignment="Center"
                   Style="{StaticResource TokenViewSelectorBarStyle}" SelectionChanged="OnFilterChanged">
        <SelectorBarItem Icon="Clock" IsSelected="True" Tag="Recent" Text="{x:Bind RecentText}"
                         Style="{StaticResource TokenViewSelectorBarItemStyle}" />
        <SelectorBarItem Icon="Favorite" Tag="Favorites" Text="{x:Bind FavoritesText}"
                         Style="{StaticResource TokenViewSelectorBarItemStyle}" />
      </SelectorBar>
      <SwitchPresenter Grid.Row="2" class="home-switch-presenter" Margin="36,0,36,36"
                       Value="{x:Bind SelectedFilter, Mode=OneWay}">
        <Case Value="Recent">
          <StackPanel Spacing="12">
            <TextBlock Text="{x:Bind RecentlyVisitedText}" FontSize="16" FontWeight="SemiBold"
                       Visibility="{x:Bind RecentVisibility, Mode=OneWay}" AutomationProperties.HeadingLevel="Level2" />
            <HorizontalScrollContainer Margin="-36,0,-36,12" Visibility="{x:Bind RecentVisibility, Mode=OneWay}">
              <HorizontalScrollContainer.Source>
                <GalleryItemsGrid ItemsSource="{x:Bind RecentlyVisitedSamplesList, Mode=OneWay}" SingleRow="True"
                                  Padding="0,0,0,10"
                                  AccessibleName="{x:Bind RecentlyVisitedText}" ItemClick="OnItemGridViewItemClick" />
              </HorizontalScrollContainer.Source>
            </HorizontalScrollContainer>
            <TextBlock Margin="0,12,0,0" Text="{x:Bind RecentlyUpdatedText}" FontSize="16" FontWeight="SemiBold"
                       AutomationProperties.HeadingLevel="Level2" />
            <GalleryItemsGrid ItemsSource="{x:Bind RecentlyAddedOrUpdatedSamplesList, Mode=OneWay}"
                              AccessibleName="{x:Bind RecentlyUpdatedText}" ItemClick="OnItemGridViewItemClick" />
          </StackPanel>
        </Case>
        <Case Value="Favorites">
          <StackPanel>
            <GalleryItemsGrid ItemsSource="{x:Bind FavoriteSamplesList, Mode=OneWay}"
                              Visibility="{x:Bind FavoritesVisibility, Mode=OneWay}"
                              AccessibleName="{x:Bind FavoritesText}" ItemClick="OnItemGridViewItemClick" />
            <StackPanel Margin="24,36" Visibility="{x:Bind EmptyFavoritesVisibility, Mode=OneWay}">
              <Image Height="36" Source="{x:Bind FavoritesImage}" Stretch="Uniform" />
              <TextBlock Margin="0,8,0,8" HorizontalAlignment="Center" FontWeight="SemiBold" Text="{x:Bind NoFavoritesText}" />
              <TextBlock HorizontalAlignment="Center" Foreground="{ThemeResource TextFillColorSecondaryBrush}"
                         Text="{x:Bind FavoritesDescription}" TextWrapping="Wrap" TextAlignment="Center" />
            </StackPanel>
          </StackPanel>
        </Case>
      </SwitchPresenter>
    </Grid>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import SelectorBar from '../../components/SelectorBar.vue';
import TextBlock from '../../components/TextBlock.vue';
import Viewbox from '../../components/Viewbox.vue';
import SelectorBarItem from '../../components/SelectorBarItem.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import HorizontalScrollContainer from '../../components/HorizontalScrollContainer.vue';
import SwitchPresenter from '../../components/SwitchPresenter.vue';
import Case from '../../components/Case.vue';
import UserControl from '../../components/UserControl';
import HomeHeaderTile from '../components/HomeHeaderTile.vue';
import GalleryItemsGrid from '../components/GalleryItemsGrid.vue';
import { useI18n } from '../../components/i18n';
import { xamlScopeKey } from '../../components/xamlRuntime';
import { getGalleryItems, getHomeHeaderTiles, HOME_HEADER_IMAGE, HOME_FAVORITES_IMAGE, GITHUB_ICON_PATH, type GalleryItem } from '../data/galleryCatalog';
import { getRecentlyVisited, pruneRecentlyVisited, recentlyVisitedChangedEvent } from '../data/recentlyVisited';
import { getStoredFavorites, pruneStoredFavorites } from '../../utils/pageState';

const { t } = useI18n();
const navigate = inject<(tag: string) => unknown>('navigate', () => {});
const favorites = ref<string[]>(getStoredFavorites());
const recent = ref(getRecentlyVisited());
const SelectedFilter = ref('Recent');
const isDark = ref(false);
const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const headerRef = ref<{ $el: HTMLElement } | null>(null);
const HeaderImageWidth = ref(window.innerWidth);
const headerObserver = new ResizeObserver(entries => { HeaderImageWidth.value = entries[0]?.contentRect.width ?? window.innerWidth; });
const HeaderImageOpacity = computed(() => isDark.value ? .8 : .9);
const HeaderForeground = computed(() => isDark.value ? 'White' : 'Black');
const detectTheme = () => {
  const root = document.documentElement;
  isDark.value = root.classList.contains('theme-dark') || root.dataset.theme === 'dark'
    || (!root.classList.contains('theme-light') && root.dataset.theme !== 'light' && themeQuery.matches);
};
detectTheme();
const observer = new MutationObserver(detectTheme);
const Items = getGalleryItems(t);
const itemMap = new Map(Items.map(item => [item.UniqueId, item]));
const validItems = (ids: string[]) => [...new Set(ids)].map(id => itemMap.get(id)).filter((item): item is GalleryItem => Boolean(item));
const RecentlyVisitedSamplesList = computed(() => validItems(recent.value));
const RecentlyAddedOrUpdatedSamplesList = Items.filter(item => item.IsNew || item.IsUpdated);
const FavoriteSamplesList = computed(() => validItems(favorites.value));
const RecentVisibility = computed(() => RecentlyVisitedSamplesList.value.length ? 'Visible' : 'Collapsed');
const FavoritesVisibility = computed(() => FavoriteSamplesList.value.length ? 'Visible' : 'Collapsed');
const EmptyFavoritesVisibility = computed(() => FavoriteSamplesList.value.length ? 'Collapsed' : 'Visible');
const HeaderImage = HOME_HEADER_IMAGE;
const FavoritesImage = HOME_FAVORITES_IMAGE;
const GitHubIconPath = GITHUB_ICON_PATH;
const HeaderTiles = computed(() => getHomeHeaderTiles(t, isDark.value));
const TitleText = t('catalog.home.title'), VersionText = t('catalog.home.version');
const RecentText = t('catalog.home.recent'), FavoritesText = t('catalog.home.favorites');
const RecentlyVisitedText = t('catalog.home.recently-visited'), RecentlyUpdatedText = t('catalog.home.recently-updated');
const NoFavoritesText = t('catalog.home.no-favorites'), FavoritesDescription = t('catalog.home.favorites-description');
const OnFilterChanged = (sender: { SelectedItem?: { Tag?: string } }, args?: { SelectedItem?: { Tag?: string }; AddedItems?: Array<{ Tag?: string }> }) => {
  const selected = sender?.SelectedItem ?? args?.SelectedItem ?? args?.AddedItems?.[0];
  if (selected?.Tag) SelectedFilter.value = selected.Tag;
};
const OnItemGridViewItemClick = (_sender: unknown, args: { ClickedItem: GalleryItem }) => {
  if (args.ClickedItem?.UniqueId) navigate(args.ClickedItem.UniqueId);
};
const syncLists = () => { favorites.value = getStoredFavorites(); recent.value = getRecentlyVisited(); };
onMounted(() => {
  const validIds = new Set(Items.map(item => item.UniqueId));
  favorites.value = pruneStoredFavorites(validIds);
  recent.value = pruneRecentlyVisited(validIds);
  if (headerRef.value?.$el) headerObserver.observe(headerRef.value.$el);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  themeQuery.addEventListener('change', detectTheme);
  window.addEventListener('storage', syncLists);
  window.addEventListener('winui-favorites-changed', syncLists);
  window.addEventListener(recentlyVisitedChangedEvent, syncLists);
});
onBeforeUnmount(() => {
  headerObserver.disconnect();
  observer.disconnect();
  themeQuery.removeEventListener('change', detectTheme);
  window.removeEventListener('storage', syncLists);
  window.removeEventListener('winui-favorites-changed', syncLists);
  window.removeEventListener(recentlyVisitedChangedEvent, syncLists);
});
provide(xamlScopeKey, { HeaderImage, HeaderImageWidth, HeaderImageOpacity, HeaderForeground, FavoritesImage, GitHubIconPath, HeaderTiles, TitleText, VersionText,
  RecentText, FavoritesText, RecentlyVisitedText, RecentlyUpdatedText, NoFavoritesText, FavoritesDescription,
  SelectedFilter, RecentlyVisitedSamplesList, RecentlyAddedOrUpdatedSamplesList, FavoriteSamplesList,
  RecentVisibility, FavoritesVisibility, EmptyFavoritesVisibility, OnFilterChanged, OnItemGridViewItemClick });
</script>

<style scoped>
.gallery-home-scroll { width: 100%; height: 100%; min-width: 0; min-height: 0; }
.gallery-home-page { width: 100%; min-width: 0; overflow-x: clip; }
.home-page-header, .home-header-root, .home-header-layout { min-width: 0; overflow: hidden; }
.home-header-image-mask { mask-image: linear-gradient(#000 75%, transparent 85%); overflow: hidden; pointer-events: none; }
.home-header-image-grid { background: linear-gradient(#ced8e4, #d5dbe3); }
.home-header-image { max-width: 100%; }
html.theme-dark .home-header-image-grid,
html[data-theme="dark"] .home-header-image-grid { background: #020b20; }
@media (prefers-color-scheme: dark) {
  html:not(.theme-light):not(.theme-dark):not([data-theme="light"]) .home-header-image-grid { background: #020b20; }
}
.home-header-copy { position: relative; z-index: 1; }
.home-header-title { line-height: 52px; overflow-wrap: anywhere; max-width: calc(100% - 36px); }
.home-switch-presenter { position: relative; min-width: 0; margin: 0 36px 36px; }
.home-filter-bar { max-width: calc(100% - 36px); }
</style>
