<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.pivot')" />
        <WinTextBlock
          class="page-description"
          :Text="$t('text.pivot-description')"
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
          :vue="BasicPivotVue"
          :headerText="$t('sample.pivot.basic')">
          <template #example>
            <WinPivot :Title="$t('sample.pivot.email')" MinHeight="400">
              <WinPivotItem :Header="$t('sample.pivot.all')">
                <WinTextBlock :Text="$t('sample.pivot.all-content')" />
              </WinPivotItem>
              <WinPivotItem :Header="$t('sample.pivot.unread')">
                <WinTextBlock :Text="$t('sample.pivot.unread-content')" />
              </WinPivotItem>
              <WinPivotItem :Header="$t('sample.pivot.flagged')">
                <WinTextBlock :Text="$t('sample.pivot.flagged-content')" />
              </WinPivotItem>
              <WinPivotItem :Header="$t('sample.pivot.urgent')">
                <WinTextBlock :Text="$t('sample.pivot.urgent-content')" />
              </WinPivotItem>
            </WinPivot>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinPivot from '../../components/WinPivot.vue';
import WinPivotItem from '../../components/WinPivotItem.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'pivot');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const EscapeAttribute = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;');

const BasicPivotVue = computed(() => `<WinPivot Title="${EscapeAttribute(t('sample.pivot.email'))}" MinHeight="400">
  <WinPivotItem Header="${EscapeAttribute(t('sample.pivot.all'))}">
    <WinTextBlock Text="${EscapeAttribute(t('sample.pivot.all-content'))}" />
  </WinPivotItem>
  <WinPivotItem Header="${EscapeAttribute(t('sample.pivot.unread'))}">
    <WinTextBlock Text="${EscapeAttribute(t('sample.pivot.unread-content'))}" />
  </WinPivotItem>
  <WinPivotItem Header="${EscapeAttribute(t('sample.pivot.flagged'))}">
    <WinTextBlock Text="${EscapeAttribute(t('sample.pivot.flagged-content'))}" />
  </WinPivotItem>
  <WinPivotItem Header="${EscapeAttribute(t('sample.pivot.urgent'))}">
    <WinTextBlock Text="${EscapeAttribute(t('sample.pivot.urgent-content'))}" />
  </WinPivotItem>
</WinPivot>`);
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

</style>
