<template>
  <Grid class="win-page-header">
    <Grid.Resources>
      <x:String x:Key="GitHubIconPath">M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z</x:String>
    </Grid.Resources>
    <Grid.RowDefinitions><RowDefinition Height="Auto" /><RowDefinition Height="Auto" /></Grid.RowDefinitions>
    <StackPanel class="win-page-header-title-row" Orientation="Horizontal" Spacing="4">
      <TextBlock
        class="win-page-header-title"
        AutomationProperties.AutomationId="PageHeader"
        AutomationProperties.HeadingLevel="Level1"
        FontFamily="var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif)"
        FontSize="28"
        FontWeight="600"
        LineHeight="36"
        TextTrimming="CharacterEllipsis"
        TextWrapping="NoWrap"
        Text="{x:Bind itemTitle, Mode=OneWay}" />
      <Button
        Visibility="{x:Bind ApiButtonVisibility, Mode=OneWay}"
        ref="apiDetailsButton"
        class="win-page-header-api-button"
        Style="{StaticResource SubtleButtonStyle}"
        Padding="4"
        AutomationProperties.Name="{x:Bind ApiDetailsLabel, Mode=OneWay}"
        ToolTipService.ToolTip="{x:Bind ApiToolTip, Mode=OneWay}"
        Click="OnApiDetailsClick">
        <FontIcon FontSize="14" Glyph="&#xE946;" />
      </Button>
    </StackPanel>

    <Grid class="win-page-header-command-row" Grid.Row="1">
      <StackPanel class="win-page-header-left-actions" Orientation="Horizontal" Spacing="4">
        <DropDownButton
          Visibility="{x:Bind DocumentationVisibility, Mode=OneWay}"
          class="win-page-header-drop-down"
          AutomationProperties.Name="{x:Bind DocumentationLabel, Mode=OneWay}"
          ToolTipService.ToolTip="{x:Bind DocumentationLabel, Mode=OneWay}">
          <DropDownButton.Content>
            <StackPanel Orientation="Horizontal" Spacing="8">
              <FontIcon FontSize="16" Glyph="&#xE8A5;" />
              <TextBlock Text="{x:Bind DocumentationLabel, Mode=OneWay}" />
            </StackPanel>
          </DropDownButton.Content>
          <DropDownButton.Flyout>
            <Flyout Placement="Bottom">
              <ItemsControl x:Name="DocsList" Margin="-12" IsTabStop="False" ItemsSource="{x:Bind DocumentationLinks, Mode=OneWay}">
                <ItemsControl.ItemsPanel>
                  <ItemsPanelTemplate><StackPanel Orientation="Vertical" /></ItemsPanelTemplate>
                </ItemsControl.ItemsPanel>
                <ItemsControl.ItemTemplate>
                  <DataTemplate x:DataType="models:ControlInfoDocLink">
                    <HyperlinkButton HorizontalAlignment="Stretch" HorizontalContentAlignment="Left" NavigateUri="{x:Bind Uri}" ToolTipService.ToolTip="{x:Bind Uri}">
                      <TextBlock Text="{x:Bind Title}" />
                    </HyperlinkButton>
                  </DataTemplate>
                </ItemsControl.ItemTemplate>
              </ItemsControl>
            </Flyout>
          </DropDownButton.Flyout>
        </DropDownButton>

        <DropDownButton
          class="win-page-header-drop-down"
          AutomationProperties.Name="{x:Bind SourceCodeLabel, Mode=OneWay}"
          ToolTipService.ToolTip="{x:Bind SourceCodeToolTip, Mode=OneWay}">
          <DropDownButton.Content>
            <StackPanel Orientation="Horizontal" Spacing="8">
              <Viewbox Height="18"><PathIcon Data="{StaticResource GitHubIconPath}" /></Viewbox>
              <TextBlock Text="{x:Bind SourceLabel, Mode=OneWay}" />
            </StackPanel>
          </DropDownButton.Content>
          <DropDownButton.Flyout>
            <Flyout Placement="Bottom">
              <StackPanel x:Name="SourcePanel" Margin="0,-8,0,-12">
                <StackPanel x:Name="ControlSourcePanel" Margin="0,0,0,4" Visibility="{x:Bind ControlSourceVisibility, Mode=OneWay}">
                  <StackPanel Orientation="Horizontal" Spacing="8">
                    <TextBlock VerticalAlignment="Center" Foreground="{ThemeResource TextFillColorSecondaryBrush}" Style="{StaticResource CaptionTextBlockStyle}" Text="{x:Bind ControlSourceLabel, Mode=OneWay}" />
                    <Button Padding="6,5,6,6" AutomationProperties.HelpText="{x:Bind GetControlSourceInfoText(), Mode=OneWay}" AutomationProperties.Name="{x:Bind InfoLabel, Mode=OneWay}" Style="{ThemeResource SubtleButtonStyle}" ToolTipService.ToolTip="{x:Bind GetControlSourceInfoText(), Mode=OneWay}">
                      <FontIcon VerticalAlignment="Center" FontSize="14" Foreground="{ThemeResource AccentTextFillColorPrimaryBrush}" Glyph="&#xE946;" />
                    </Button>
                  </StackPanel>
                  <HyperlinkButton x:Name="ControlSourceLink" Margin="-12,4,-12,0" HorizontalAlignment="Stretch" HorizontalContentAlignment="Left" NavigateUri="{x:Bind effectiveControlSourceUri, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind effectiveControlSourceUri, Mode=OneWay}">
                    <TextBlock Text="{x:Bind itemTitle, Mode=OneWay}" />
                  </HyperlinkButton>
                </StackPanel>
                <MenuFlyoutSeparator x:Name="ControlSourceSeparator" Margin="-12" Visibility="{x:Bind ControlSourceVisibility, Mode=OneWay}" />
                <StackPanel Margin="0,8,0,0" Orientation="Horizontal" Spacing="8">
                  <TextBlock VerticalAlignment="Center" Foreground="{ThemeResource TextFillColorSecondaryBrush}" Style="{StaticResource CaptionTextBlockStyle}" Text="{x:Bind SampleSourceLabel, Mode=OneWay}" />
                  <Button Padding="6,5,6,6" AutomationProperties.HelpText="{x:Bind GetSamplePageSourceInfoText(), Mode=OneWay}" AutomationProperties.Name="{x:Bind InfoLabel, Mode=OneWay}" Style="{ThemeResource SubtleButtonStyle}" ToolTipService.ToolTip="{x:Bind GetSamplePageSourceInfoText(), Mode=OneWay}">
                    <FontIcon VerticalAlignment="Center" FontSize="14" Foreground="{ThemeResource AccentTextFillColorPrimaryBrush}" Glyph="&#xE946;" />
                  </Button>
                </StackPanel>
                <HyperlinkButton x:Name="PageMarkupGitHubLink" Margin="-12,4,-12,0" HorizontalAlignment="Stretch" HorizontalContentAlignment="Left" NavigateUri="{x:Bind effectivePageMarkupUri, Mode=OneWay}" IsEnabled="{x:Bind HasPageMarkupSource, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind effectivePageMarkupUri, Mode=OneWay}">
                  <TextBlock Text="{x:Bind XamlLabel, Mode=OneWay}" />
                </HyperlinkButton>
                <HyperlinkButton x:Name="PageCodeGitHubLink" Margin="-12,4,-12,0" HorizontalAlignment="Stretch" HorizontalContentAlignment="Left" NavigateUri="{x:Bind effectivePageCodeUri, Mode=OneWay}" IsEnabled="{x:Bind HasPageCodeSource, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind effectivePageCodeUri, Mode=OneWay}">
                  <TextBlock Text="{x:Bind CSharpLabel, Mode=OneWay}" />
                </HyperlinkButton>
              </StackPanel>
            </Flyout>
          </DropDownButton.Flyout>
        </DropDownButton>
      </StackPanel>

      <StackPanel class="win-page-header-right-actions" Orientation="Horizontal" Spacing="0" HorizontalAlignment="Right">
        <Button
          Visibility="{x:Bind ResolvedThemeButtonVisibility, Mode=OneWay}"
          class="win-page-header-action"
          Height="32"
          Margin="0,0,4,0"
          AutomationProperties.Name="{x:Bind ToggleThemeLabel, Mode=OneWay}"
          ToolTipService.ToolTip="{x:Bind ToggleThemeLabel, Mode=OneWay}"
          Click="OnThemeButtonClick">
          <FontIcon FontSize="16" Glyph="&#xE793;" />
        </Button>
        <AppBarSeparator
          class="win-page-header-separator"
          Visibility="{x:Bind ResolvedThemeButtonVisibility, Mode=OneWay}" />
        <Button
          ref="copyLinkButton"
          class="win-page-header-action win-page-header-copy-button"
          Height="32"
          Margin="4,0,4,0"
          Padding="11,2,11,0"
          AutomationProperties.Name="{x:Bind CopyLinkLabel, Mode=OneWay}"
          ToolTipService.ToolTip="{x:Bind CopyLinkLabel, Mode=OneWay}"
          Click="OnCopyLinkButtonClick">
          <FontIcon FontSize="16" Glyph="&#xE71B;" />
        </Button>
        <ToggleButton
          class="win-page-header-action win-page-header-favorite-button"
          Height="32"
          Margin="4,0,0,0"
          IsChecked="{x:Bind isFavorite, Mode=OneWay}"
          AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"
          ToolTipService.ToolTip="{x:Bind favoriteToolTip, Mode=OneWay}"
          Click="OnFavoriteButtonClick">
          <FontIcon FontSize="16" Glyph="{x:Bind favoriteGlyph, Mode=OneWay}" />
        </ToggleButton>
      </StackPanel>
    </Grid>

    <Flyout ref="apiFlyoutRef" Placement="Bottom" Closed="closeFlyouts">
      <Flyout.FlyoutPresenterStyle><Style TargetType="FlyoutPresenter"><Setter Property="MinWidth" Value="420" /></Style></Flyout.FlyoutPresenterStyle>
      <StackPanel class="win-page-header-flyout-panel" Spacing="16">
        <StackPanel Visibility="{x:Bind NamespaceVisibility, Mode=OneWay}" Spacing="8">
          <TextBlock class="win-page-header-secondary-label" Text="{x:Bind NamespaceLabel, Mode=OneWay}" />
          <TextBlock FontFamily="Consolas" IsTextSelectionEnabled="True" Text="{x:Bind item.ApiNamespace, Mode=OneWay}" />
        </StackPanel>
        <Border
          Visibility="{x:Bind ApiSeparatorVisibility, Mode=OneWay}"
          class="win-page-header-separator-line"
          Height="1"
          Background="{ThemeResource DividerStrokeColorDefaultBrush}" />
        <StackPanel Visibility="{x:Bind InheritanceVisibility, Mode=OneWay}" Spacing="4">
          <TextBlock class="win-page-header-secondary-label" Text="{x:Bind InheritanceLabel, Mode=OneWay}" />
          <BreadcrumbBar ItemsSource="{x:Bind item.BaseClasses, Mode=OneWay}" IsEnabled="False" />
        </StackPanel>
      </StackPanel>
    </Flyout>
  </Grid>
</template>

<script setup lang="ts">

import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import AppBarSeparator from '../../components/AppBarSeparator.vue';
import BreadcrumbBar from '../../components/BreadcrumbBar.vue';
import Border from '../../components/Border.vue';
import Button from '../../components/Button.vue';
import DropDownButton from '../../components/DropDownButton.vue';
import FontIcon from '../../components/FontIcon.vue';
import HyperlinkButton from '../../components/HyperlinkButton.vue';
import ItemsControl from '../../components/ItemsControl.vue';
import { DataTemplate, ItemsPanelTemplate } from '../../components/CollectionProperties';
import { MenuFlyoutSeparator } from '../../components/MenuFlyoutItems';
import Grid from '../../components/Grid.vue';
import Flyout from '../../components/Flyout.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import PathIcon from '../../components/PathIcon.vue';
import Viewbox from '../../components/Viewbox.vue';
import { useI18n } from '../../components/i18n/index';
import { resolveXamlValue } from '../../components/xamlRuntime';

const { t } = useI18n();
const ApiDetailsLabel = computed(() => t('gallery.page-header.api-details'));
const ApiToolTip = computed(() => t('gallery.page-header.api-tooltip'));
const ToggleThemeLabel = computed(() => t('gallery.page-header.toggle-theme'));
const CopyLinkLabel = computed(() => t('gallery.page-header.copy-link'));
const FavoriteLabel = computed(() => t('gallery.page-header.favorite'));
const DocumentationLabel = computed(() => t('gallery.page-header.documentation'));
const SourceLabel = computed(() => t('gallery.page-header.source'));
const SourceCodeLabel = computed(() => t('gallery.page-header.source-code'));
const SourceCodeToolTip = computed(() => t('gallery.page-header.source-code-tooltip'));
const ControlSourceLabel = computed(() => t('gallery.page-header.control-source'));
const SampleSourceLabel = computed(() => t('gallery.page-header.sample-page-source'));
const InfoLabel = computed(() => t('gallery.page-header.info'));
const XamlLabel = computed(() => t('gallery.page-header.xaml'));
const CSharpLabel = computed(() => t('gallery.page-header.csharp'));
const NamespaceLabel = computed(() => t('gallery.page-header.namespace'));
const InheritanceLabel = computed(() => t('gallery.page-header.inheritance'));
const OnApiDetailsClick = () => openFlyout('api');
const OnFavoriteButtonClick = () => FavoriteButton_Click();

interface GalleryDocLink {
  Title?: string;
  title?: string;
  Uri?: string;
  uri?: string;
}

interface GalleryItem {
  Title?: string;
  UniqueId?: string;
  ApiNamespace?: string;
  BaseClasses?: string[];
  Docs?: GalleryDocLink[];
  SourceLink?: string;
  PageMarkupUri?: string;
  PageCodeUri?: string;
}

type ElementWithRoot = HTMLElement | { $el?: HTMLElement; Element?: HTMLElement };

const props = withDefaults(defineProps<{
  ThemeButtonVisibility?: string;
  PageName?: string;
  CopyLinkAction?: (() => void) | string | null;
  ToggleThemeAction?: (() => void) | string | null;
  Item?: GalleryItem | string;
}>(), {
  ThemeButtonVisibility: 'Visible',
  PageName: '',
  CopyLinkAction: null,
  ToggleThemeAction: null,
  Item: () => ({ Title: '', UniqueId: '', ApiNamespace: '', BaseClasses: [], Docs: [] })
});

const apiDetailsButton = ref<ElementWithRoot | null>(null);
const instance = getCurrentInstance();
const resolve = (value: unknown) => resolveXamlValue(value, instance);
const ApiButtonVisibility = computed(() => hasApiDetails.value ? 'Visible' : 'Collapsed');
const ResolvedThemeButtonVisibility = computed(() => resolve(props.ThemeButtonVisibility) === 'Collapsed' || resolve(props.ThemeButtonVisibility) === 'Hidden' ? 'Collapsed' : 'Visible');
const apiFlyoutRef = ref<any>(null);
const copyLinkButton = ref<ElementWithRoot | null>(null);
const openFlyoutName = ref('');
const apiAnchorRect = ref<Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right' | 'width' | 'height'> | null>(null);
const isFavorite = ref(false);
const controlSourceUri = ref('');
const pageMarkupSourceUri = ref('');
const pageCodeSourceUri = ref('');

const item = computed(() => resolve(props.Item) as GalleryItem || {});
const itemTitle = computed(() => item.value.Title || resolve(props.PageName));
const hasApiDetails = computed(() => Boolean(item.value.ApiNamespace) || Boolean(item.value.BaseClasses?.length));
const NamespaceVisibility = computed(() => item.value.ApiNamespace ? 'Visible' : 'Collapsed');
const InheritanceVisibility = computed(() => item.value.BaseClasses?.length ? 'Visible' : 'Collapsed');
const ApiSeparatorVisibility = computed(() => item.value.ApiNamespace && item.value.BaseClasses?.length ? 'Visible' : 'Collapsed');
const hasDocs = computed(() => Array.isArray(item.value.Docs) && item.value.Docs.length > 0);
const DocumentationVisibility = computed(() => hasDocs.value ? 'Visible' : 'Collapsed');
const favoriteGlyph = computed(() => isFavorite.value ? '\uE735' : '\uE734');
const favoriteToolTip = computed(() => isFavorite.value
  ? t('sample.navigationview.remove-favorite')
  : t('sample.navigationview.add-favorite'));
const effectiveControlSourceUri = computed(() => controlSourceUri.value || item.value.SourceLink || '');
const effectivePageMarkupUri = computed(() => pageMarkupSourceUri.value || item.value.PageMarkupUri || '');
const effectivePageCodeUri = computed(() => pageCodeSourceUri.value || item.value.PageCodeUri || '');
const DocumentationLinks = computed(() => (item.value.Docs || []).map((doc) => ({
  Title: doc.Title || doc.title || doc.Uri || doc.uri || '',
  Uri: doc.Uri || doc.uri || ''
})));
const HasControlSource = computed(() => Boolean(effectiveControlSourceUri.value));
const ControlSourceVisibility = computed(() => HasControlSource.value ? 'Visible' : 'Collapsed');
const HasPageMarkupSource = computed(() => Boolean(effectivePageMarkupUri.value));
const HasPageCodeSource = computed(() => Boolean(effectivePageCodeUri.value));

const unwrap = (value: ElementWithRoot | null) => {
  const element = value instanceof HTMLElement ? value : value?.Element ?? value?.$el;
  return element instanceof HTMLElement ? element : null;
};

function closeFlyouts() {
  openFlyoutName.value = '';
  apiFlyoutRef.value?.Hide?.();
}

async function openFlyout(name: string) {
  const target = name === 'api' ? unwrap(apiDetailsButton.value) : unwrap(copyLinkButton.value);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  apiAnchorRect.value = { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width, height: rect.height };
  openFlyoutName.value = name;
  await nextTick();
  void apiFlyoutRef.value?.ShowAt?.(target);
}

function SetSamplePageSourceLinks(BaseUri: string, PageName: string) {
  pageMarkupSourceUri.value = `${BaseUri}${PageName}.xaml`;
  pageCodeSourceUri.value = `${BaseUri}${PageName}.xaml.cs`;
}

function SetControlSourceLink(BaseUri: string, SourceLink: string) {
  controlSourceUri.value = SourceLink ? `${BaseUri}${SourceLink}` : '';
}

function GetControlSourceInfoText() {
  const title = item.value.Title || t('gallery.page-header.this-control');
  return t('gallery.page-header.control-source-info', { 0: title });
}

function GetSamplePageSourceInfoText() {
  const title = item.value.Title ? t('gallery.page-header.sample-page-title', { 0: item.value.Title }) : t('gallery.page-header.this-sample-page');
  return t('gallery.page-header.sample-source-info', { 0: title });
}

function OnCopyLinkButtonClick() {
  const action = resolve(props.CopyLinkAction);
  if (typeof action === 'function') action();
  else void navigator.clipboard?.writeText(window.location.href);
}

function OnThemeButtonClick() {
  const action = resolve(props.ToggleThemeAction);
  if (typeof action === 'function') action();
}

function FavoriteButton_Click() {
  const key = item.value.UniqueId;
  if (!key) return;
  const current = readFavorites();
  const next = current.includes(key) ? current.filter((entry) => entry !== key) : [...current, key];
  isFavorite.value = next.includes(key);
  localStorage.setItem('winui-favorites', JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('winui-favorites-changed', { detail: next }));
}

function readFavorites(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('winui-favorites') || '[]');
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

function syncFavorite() {
  const key = item.value.UniqueId;
  isFavorite.value = Boolean(key && readFavorites().includes(key));
}

defineExpose({
  ThemeButtonVisibility: props.ThemeButtonVisibility,
  PageName: props.PageName,
  CopyLinkAction: props.CopyLinkAction,
  ToggleThemeAction: props.ToggleThemeAction,
  Item: props.Item,
  SetSamplePageSourceLinks,
  SetControlSourceLink,
  GetControlSourceInfoText,
  GetSamplePageSourceInfoText,
  OnCopyLinkButtonClick,
  OnThemeButtonClick,
  FavoriteButton_Click
});

onMounted(() => {
  syncFavorite();
  window.addEventListener('storage', syncFavorite);
  window.addEventListener('winui-favorites-changed', syncFavorite);
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', syncFavorite);
  window.removeEventListener('winui-favorites-changed', syncFavorite);
});

</script>

<style scoped>
.win-page-header {
  position: relative;
  z-index: 2;
  width: 100%;
  min-width: 0;
  padding: 24px 36px 0;
  color: var(--text-primary);
}

.win-page-header-title-row {
  min-width: 0;
  align-items: flex-end;
}

.win-page-header-title {
  min-width: 0;
  max-width: 100%;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
}

.win-page-header-api-button {
  align-self: flex-end;
  margin-bottom: 3px;
}

.win-page-header-command-row {
  position: relative;
  min-width: 0;
  margin: 12px 0;
}

.win-page-header-left-actions,
.win-page-header-right-actions {
  min-width: 0;
}

.win-page-header-right-actions {
  position: absolute;
  right: 0;
  top: 0;
}

.win-page-header-action {
  min-width: 32px;
  min-height: 32px;
  padding: 5px 11px 6px;
}

.win-page-header-favorite-button {
  padding: 5px 11px 6px;
}

.win-page-header-drop-down :deep(.win-dropdown-content-presenter) {
  min-width: 0;
}

.win-page-header-flyout-panel {
  min-width: 380px;
  max-width: min(760px, calc(100vw - 32px));
  padding: 4px;
}

.win-page-header-secondary-label {
  color: var(--text-secondary);
  font-size: 12px;
}

.win-page-header-separator-line {
  width: auto;
  min-width: 0;
  height: 1px;
  margin: 0 -12px;
}

@media (max-width: 640px) {
  .win-page-header {
    padding: 12px 16px 0;
  }

  .win-page-header-command-row {
    margin: 8px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .win-page-header-left-actions {
    max-width: 100%;
    flex-wrap: wrap;
  }

  .win-page-header-right-actions {
    position: static;
    margin-inline-start: auto;
  }

}
</style>
