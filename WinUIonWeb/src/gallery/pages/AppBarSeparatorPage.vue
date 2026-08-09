<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.appbarseparator')" />
        <WinTextBlock class="page-description" :Text="$t('text.appbarseparator-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" @Click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
          <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
            <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
          </WinToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.appbarseparator.separated')"
          :theme="pageTheme"
          :vue="exampleCode">
          <template #example>
            <div class="separator-commandbar-host">
              <WinScrollViewer
                class="separator-scroll-viewer"
                HorizontalScrollBarVisibility="Hidden"
                HorizontalScrollMode="Auto"
                VerticalScrollBarVisibility="Hidden"
                VerticalScrollMode="Disabled">
                <WinCommandBar
                  class="separator-commandbar"
                  Background="Transparent"
                  HorizontalAlignment="Left"
                  :PrimaryCommands="commands"
                  :Theme="pageTheme" />
              </WinScrollViewer>
            </div>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import WinAppBarButton from '../../components/WinAppBarButton.vue';
import WinAppBarSeparator from '../../components/WinAppBarSeparator.vue';
import WinButton from '../../components/WinButton.vue';
import WinCommandBar from '../../components/WinCommandBar.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject<{ value: string }>('currentPage');
const pageKey = computed(() => currentPage?.value || 'appbarseparator');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const commands = computed(() => [
  {
    Key: 'AttachCamera',
    Component: WinAppBarButton,
    Props: { Icon: 'AttachCamera', Label: t('sample.appbarseparator.attach-camera') }
  },
  { Key: 'SeparatorOne', Component: WinAppBarSeparator, Props: {} },
  {
    Key: 'Like',
    Component: WinAppBarButton,
    Props: { Icon: 'Like', Label: t('sample.appbarseparator.like') }
  },
  {
    Key: 'Dislike',
    Component: WinAppBarButton,
    Props: { Icon: 'Dislike', Label: t('sample.appbarseparator.dislike') }
  },
  { Key: 'SeparatorTwo', Component: WinAppBarSeparator, Props: {} },
  {
    Key: 'Orientation',
    Component: WinAppBarButton,
    Props: { Icon: 'Orientation', Label: t('sample.appbarseparator.orientation') }
  }
]);

const exampleCode = `<WinCommandBar>
  <WinCommandBar.PrimaryCommands>
    <WinAppBarButton Icon="AttachCamera" Label="Attach Camera" />
    <WinAppBarSeparator />
    <WinAppBarButton Icon="Like" Label="Like" />
    <WinAppBarButton Icon="Dislike" Label="Dislike" />
    <WinAppBarSeparator />
    <WinAppBarButton Icon="Orientation" Label="Orientation" />
  </WinCommandBar.PrimaryCommands>
</WinCommandBar>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.basic-input-example-theme:deep(.control-example-frame),
.basic-input-example-theme:deep(.example-container) {
  overflow: visible;
}
.basic-input-example-theme:deep(.example-container) {
  position: relative;
  z-index: 2;
}
.basic-input-example-theme:deep(.code-expander) {
  position: relative;
  z-index: 1;
}
.separator-commandbar-host {
  position: relative;
  z-index: 30;
  width: 100%;
  height: 48px;
  min-width: 0;
}
.separator-scroll-viewer {
  width: 100%;
  height: 48px;
  min-width: 0;
  overflow: visible;
}
.separator-scroll-viewer :deep(.win-scroll-viewer-viewport),
.separator-scroll-viewer :deep(.scroll-content) {
  height: 48px;
  overflow: visible !important;
  contain: none;
}
.separator-commandbar { width: max-content; max-width: none; }
</style>
