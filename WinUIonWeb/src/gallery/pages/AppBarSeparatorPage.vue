<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.appbarseparator')" />
        <TextBlock class="page-description" :Text="$t('text.appbarseparator-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" @Click="toggleTheme"><span class="icon">&#xE793;</span></Button>
          <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
            <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
          </ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.appbarseparator.separated')"
          :theme="pageTheme"
          :vue="exampleCode">
          <template #example>
            <div class="separator-commandbar-host">
              <ScrollViewer
                class="separator-scroll-viewer"
                HorizontalScrollBarVisibility="Hidden"
                HorizontalScrollMode="Auto"
                VerticalScrollBarVisibility="Hidden"
                VerticalScrollMode="Disabled">
                <CommandBar
                  class="separator-commandbar"
                  Background="Transparent"
                  HorizontalAlignment="Left"
                  :PrimaryCommands="commands"
                  :Theme="pageTheme" />
              </ScrollViewer>
            </div>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import AppBarSeparator from '../../components/AppBarSeparator.vue';
import Button from '../../components/Button.vue';
import CommandBar from '../../components/CommandBar.vue';
import ControlExample from '../../components/ControlExample.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject<{ value: string }>('currentPage');
const pageKey = computed(() => currentPage?.value || 'appbarseparator');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const commands = computed(() => [
  {
    Key: 'AttachCamera',
    Component: AppBarButton,
    Props: { Icon: 'AttachCamera', Label: t('sample.appbarseparator.attach-camera') }
  },
  { Key: 'SeparatorOne', Component: AppBarSeparator, Props: {} },
  {
    Key: 'Like',
    Component: AppBarButton,
    Props: { Icon: 'Like', Label: t('sample.appbarseparator.like') }
  },
  {
    Key: 'Dislike',
    Component: AppBarButton,
    Props: { Icon: 'Dislike', Label: t('sample.appbarseparator.dislike') }
  },
  { Key: 'SeparatorTwo', Component: AppBarSeparator, Props: {} },
  {
    Key: 'Orientation',
    Component: AppBarButton,
    Props: { Icon: 'Orientation', Label: t('sample.appbarseparator.orientation') }
  }
]);

const exampleCode = `<CommandBar>
  <CommandBar.PrimaryCommands>
    <AppBarButton Icon="AttachCamera" Label="Attach Camera" />
    <AppBarSeparator />
    <AppBarButton Icon="Like" Label="Like" />
    <AppBarButton Icon="Dislike" Label="Dislike" />
    <AppBarSeparator />
    <AppBarButton Icon="Orientation" Label="Orientation" />
  </CommandBar.PrimaryCommands>
</CommandBar>`;
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
