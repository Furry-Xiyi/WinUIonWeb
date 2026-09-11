<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.pivot')" />
        <TextBlock
          class="page-description"
          :Text="$t('text.pivot-description')"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" @Click="toggleTheme">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton
            :IsChecked="isFavoriteState"
            class="header-action"
            @update:IsChecked="toggleFavorite">
            <TextBlock class="icon" :Text="isFavoriteState ? '\uE735' : '\uE734'" />
          </ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample
          class="basic-input-example-theme"
          :theme="pageTheme"
          :vue="BasicPivotVue"
          :headerText="$t('sample.pivot.basic')">
          <template #example>
            <Pivot :Title="$t('sample.pivot.email')" MinHeight="400">
              <PivotItem :Header="$t('sample.pivot.all')">
                <TextBlock :Text="$t('sample.pivot.all-content')" />
              </PivotItem>
              <PivotItem :Header="$t('sample.pivot.unread')">
                <TextBlock :Text="$t('sample.pivot.unread-content')" />
              </PivotItem>
              <PivotItem :Header="$t('sample.pivot.flagged')">
                <TextBlock :Text="$t('sample.pivot.flagged-content')" />
              </PivotItem>
              <PivotItem :Header="$t('sample.pivot.urgent')">
                <TextBlock :Text="$t('sample.pivot.urgent-content')" />
              </PivotItem>
            </Pivot>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import Pivot from '../../components/Pivot.vue';
import PivotItem from '../../components/PivotItem.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'pivot');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const EscapeAttribute = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;');

const BasicPivotVue = computed(() => `<Pivot Title="${EscapeAttribute(t('sample.pivot.email'))}" MinHeight="400">
  <PivotItem Header="${EscapeAttribute(t('sample.pivot.all'))}">
    <TextBlock Text="${EscapeAttribute(t('sample.pivot.all-content'))}" />
  </PivotItem>
  <PivotItem Header="${EscapeAttribute(t('sample.pivot.unread'))}">
    <TextBlock Text="${EscapeAttribute(t('sample.pivot.unread-content'))}" />
  </PivotItem>
  <PivotItem Header="${EscapeAttribute(t('sample.pivot.flagged'))}">
    <TextBlock Text="${EscapeAttribute(t('sample.pivot.flagged-content'))}" />
  </PivotItem>
  <PivotItem Header="${EscapeAttribute(t('sample.pivot.urgent'))}">
    <TextBlock Text="${EscapeAttribute(t('sample.pivot.urgent-content'))}" />
  </PivotItem>
</Pivot>`);
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
