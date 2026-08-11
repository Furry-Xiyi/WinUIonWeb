<template>
  <WinGrid class="win-page-header" RowDefinitions="Auto,Auto">
    <WinStackPanel class="win-page-header-title-row" Orientation="Horizontal" Spacing="4">
      <WinTextBlock
        class="win-page-header-title"
        AutomationProperties.AutomationId="PageHeader"
        AutomationProperties.HeadingLevel="Level1"
        FontFamily="var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif)"
        FontSize="28"
        FontWeight="600"
        LineHeight="36"
        TextTrimming="CharacterEllipsis"
        TextWrapping="NoWrap"
        :Text="itemTitle" />
      <WinButton
        v-if="hasApiDetails"
        ref="apiDetailsButton"
        class="win-page-header-api-button"
        Style="{StaticResource SubtleButtonStyle}"
        Padding="4"
        v-bind="{ 'automationproperties.name': t('gallery.page-header.api-details'), 'tooltipservice.tooltip': t('gallery.page-header.api-tooltip') }"
        @Click="openFlyout('api')">
        <WinTextBlock class="icon" FontSize="14" Text="&#xE946;" />
      </WinButton>
    </WinStackPanel>

    <WinGrid class="win-page-header-command-row" RowDefinitions="Auto" Grid.Row="1">
      <WinStackPanel class="win-page-header-left-actions" Orientation="Horizontal" Spacing="4">
        <WinDropDownButton
          v-if="hasDocs"
          class="win-page-header-drop-down"
          v-bind="{ 'automationproperties.name': t('gallery.page-header.documentation'), 'tooltipservice.tooltip': t('gallery.page-header.documentation') }"
          :Flyout="docsFlyout"
          @Select="onDocumentationSelected">
          <WinStackPanel Orientation="Horizontal" Spacing="8">
            <WinTextBlock class="icon" FontSize="16" Text="&#xE8A5;" />
            <WinTextBlock :Text="t('gallery.page-header.documentation')" />
          </WinStackPanel>
        </WinDropDownButton>

        <WinDropDownButton
          class="win-page-header-drop-down"
          v-bind="{ 'automationproperties.name': t('gallery.page-header.source-code'), 'tooltipservice.tooltip': t('gallery.page-header.source-code-tooltip') }"
          :Flyout="sourceFlyout"
          @Select="onSourceSelected">
          <WinStackPanel Orientation="Horizontal" Spacing="8">
            <WinTextBlock class="icon" FontSize="16" Text="&#xE8A5;" />
            <WinTextBlock :Text="t('gallery.page-header.source')" />
          </WinStackPanel>
        </WinDropDownButton>
      </WinStackPanel>

      <WinStackPanel class="win-page-header-right-actions" Orientation="Horizontal" Spacing="0" HorizontalAlignment="Right">
        <WinButton
          v-if="ThemeButtonVisibility !== 'Collapsed' && ThemeButtonVisibility !== 'Hidden'"
          class="win-page-header-action"
          Height="32"
          Margin="0,0,4,0"
          v-bind="{ 'automationproperties.name': t('gallery.page-header.toggle-theme'), 'tooltipservice.tooltip': t('gallery.page-header.toggle-theme') }"
          @Click="OnThemeButtonClick">
          <WinTextBlock class="icon" FontSize="16" Text="&#xE793;" />
        </WinButton>
        <WinAppBarSeparator
          v-if="ThemeButtonVisibility !== 'Collapsed' && ThemeButtonVisibility !== 'Hidden'"
          class="win-page-header-separator"
          Visibility="Visible" />
        <WinButton
          ref="copyLinkButton"
          class="win-page-header-action win-page-header-copy-button"
          Height="32"
          Margin="4,0,4,0"
          Padding="11,2,11,0"
          v-bind="{ 'automationproperties.name': t('gallery.page-header.copy-link'), 'tooltipservice.tooltip': t('gallery.page-header.copy-link') }"
          @Click="OnCopyLinkButtonClick">
          <WinTextBlock class="icon" FontSize="16" Text="&#xE71B;" />
        </WinButton>
        <WinToggleButton
          class="win-page-header-action win-page-header-favorite-button"
          Height="32"
          Margin="4,0,0,0"
          :IsChecked="isFavorite"
          v-bind="{ 'automationproperties.name': t('gallery.page-header.favorite'), 'tooltipservice.tooltip': favoriteToolTip }"
          @update:IsChecked="FavoriteButton_Click">
          <WinTextBlock class="icon" FontSize="16" :Text="favoriteGlyph" />
        </WinToggleButton>
      </WinStackPanel>
    </WinGrid>

    <WinMenuFlyout
      :Open="openFlyoutName === 'api'"
      :AnchorRect="apiAnchorRect"
      :MinWidth="420"
      @Close="closeFlyouts">
      <WinStackPanel class="win-page-header-flyout-panel" Spacing="16">
        <WinStackPanel v-if="item.ApiNamespace" Spacing="8">
          <WinTextBlock class="win-page-header-secondary-label" :Text="t('gallery.page-header.namespace')" />
          <WinTextBlock FontFamily="Consolas" IsTextSelectionEnabled :Text="item.ApiNamespace" />
        </WinStackPanel>
        <WinAppBarSeparator
          v-if="item.ApiNamespace && item.BaseClasses?.length"
          class="win-page-header-separator-line is-horizontal"
          UseOverflowStyle="True" />
        <WinStackPanel v-if="item.BaseClasses?.length" Spacing="4">
          <WinTextBlock class="win-page-header-secondary-label" :Text="t('gallery.page-header.inheritance')" />
          <WinBreadcrumbBar :ItemsSource="item.BaseClasses" IsEnabled="false" />
        </WinStackPanel>
      </WinStackPanel>
    </WinMenuFlyout>
  </WinGrid>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import WinAppBarSeparator from '../../components/WinAppBarSeparator.vue';
import WinBreadcrumbBar from '../../components/WinBreadcrumbBar.vue';
import WinButton from '../../components/WinButton.vue';
import WinDropDownButton from '../../components/WinDropDownButton.vue';
import WinGrid from '../../components/WinGrid.vue';
import WinMenuFlyout from '../../components/WinMenuFlyout.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';

const { t } = useI18n();

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

interface FlyoutEntry {
  Text?: string;
  Value?: string;
  Kind?: string;
  IsEnabled?: boolean;
  Foreground?: string;
}

type ElementWithRoot = HTMLElement | { $el?: HTMLElement };

const props = withDefaults(defineProps<{
  ThemeButtonVisibility?: string;
  PageName?: string;
  CopyLinkAction?: (() => void) | null;
  ToggleThemeAction?: (() => void) | null;
  Item?: GalleryItem;
}>(), {
  ThemeButtonVisibility: 'Visible',
  PageName: '',
  CopyLinkAction: null,
  ToggleThemeAction: null,
  Item: () => ({ Title: '', UniqueId: '', ApiNamespace: '', BaseClasses: [], Docs: [] })
});

const apiDetailsButton = ref<ElementWithRoot | null>(null);
const copyLinkButton = ref<ElementWithRoot | null>(null);
const openFlyoutName = ref('');
const apiAnchorRect = ref<Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right' | 'width' | 'height'> | null>(null);
const isFavorite = ref(false);
const controlSourceUri = ref('');
const samplePageSourceUri = ref('');

const item = computed(() => props.Item || {});
const itemTitle = computed(() => item.value.Title || props.PageName);
const hasApiDetails = computed(() => Boolean(item.value.ApiNamespace) || Boolean(item.value.BaseClasses?.length));
const hasDocs = computed(() => Array.isArray(item.value.Docs) && item.value.Docs.length > 0);
const favoriteGlyph = computed(() => isFavorite.value ? '\uE735' : '\uE734');
const favoriteToolTip = computed(() => isFavorite.value
  ? t('sample.navigationview.remove-favorite')
  : t('sample.navigationview.add-favorite'));
const effectiveControlSourceUri = computed(() => controlSourceUri.value || item.value.SourceLink || '');
const effectiveSamplePageSourceUri = computed(() => samplePageSourceUri.value || item.value.PageMarkupUri || item.value.PageCodeUri || '');
const docsFlyout = computed(() => (item.value.Docs || []).map((doc) => ({
  Text: doc.Title || doc.title || doc.Uri || doc.uri || '',
  Value: doc.Uri || doc.uri || '',
  Foreground: 'var(--accent-text-fill-color-primary)'
})));
const sourceFlyout = computed(() => [
  {
    Text: t('gallery.page-header.control-source'),
    Value: 'control-source',
    IsEnabled: Boolean(effectiveControlSourceUri.value),
    Foreground: 'var(--accent-text-fill-color-primary)'
  },
  { Kind: 'MenuFlyoutSeparator' },
  {
    Text: t('gallery.page-header.sample-page-source'),
    Value: 'page-source',
    IsEnabled: Boolean(effectiveSamplePageSourceUri.value),
    Foreground: 'var(--accent-text-fill-color-primary)'
  }
]);

const unwrap = (value: ElementWithRoot | null) => {
  const element = value instanceof HTMLElement ? value : value?.$el;
  return element instanceof HTMLElement ? element : null;
};

function closeFlyouts() {
  openFlyoutName.value = '';
}

async function openFlyout(name: string) {
  const target = name === 'api' ? unwrap(apiDetailsButton.value) : unwrap(copyLinkButton.value);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  apiAnchorRect.value = { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width, height: rect.height };
  openFlyoutName.value = name;
  await nextTick();
}

function SetSamplePageSourceLinks(BaseUri: string, PageName: string) {
  samplePageSourceUri.value = `${BaseUri}${PageName}.vue`;
}

function SetControlSourceLink(BaseUri: string, SourceLink: string) {
  controlSourceUri.value = SourceLink ? `${BaseUri}${SourceLink}` : '';
}

function GetControlSourceInfoText() {
  const title = item.value.Title || t('gallery.page-header.this-control');
  return `${t('gallery.page-header.source-code-of')} ${title}`;
}

function GetSamplePageSourceInfoText() {
  const title = item.value.Title || t('gallery.page-header.this-sample-page');
  return `${t('gallery.page-header.source-code-of')} ${title}`;
}

function OnCopyLinkButtonClick() {
  if (props.CopyLinkAction) props.CopyLinkAction();
  else void navigator.clipboard?.writeText(window.location.href);
}

function OnThemeButtonClick() {
  props.ToggleThemeAction?.();
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

function onDocumentationSelected(entry: FlyoutEntry | null) {
  const uri = entry?.Value;
  if (uri) window.open(uri, '_blank', 'noopener,noreferrer');
}

function onSourceSelected(entry: FlyoutEntry | null) {
  const value = entry?.Value;
  const uri = value === 'control-source'
    ? effectiveControlSourceUri.value
    : effectiveSamplePageSourceUri.value;
  if (uri) window.open(uri, '_blank', 'noopener,noreferrer');
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

.win-page-header-drop-down :deep(.win-dropdown-content) {
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
  }

}
</style>
