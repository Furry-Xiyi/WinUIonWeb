<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.expander')" />
        <WinTextBlock
          class="page-description"
          :Text="$t('text.the-expander-control-lets-you-show-or-hide-less')"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
          <WinToggleButton
            :IsChecked="isFavoriteState"
            class="header-action"
            @update:IsChecked="toggleFavorite">
            <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
          </WinToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :exampleHeight="160"
          :headerText="$t('sample.expander.text-header-content')"
          :theme="pageTheme"
          :vue="example1Code">
          <template #example>
            <WinExpander
              v-model:IsExpanded="expander1Expanded"
              :ExpandDirection="expandDirection"
              :Header="$t('sample.expander.header-text')"
              :VerticalAlignment="verticalAlignment">
              <WinTextBlock :Text="$t('sample.expander.content-text')" />
            </WinExpander>
          </template>
          <template #options>
            <WinComboBox
              v-model:SelectedIndex="expandDirectionIndex"
              Header="ExpandDirection"
              Width="196"
              :ItemsSource="expandDirectionItems"
              DisplayMemberPath="Text" />
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.expander.content-alignment')"
          :theme="pageTheme"
          :vue="example2Code">
          <template #example>
            <WinExpander Width="500" MaxWidth="100%" Padding="0" HorizontalContentAlignment="Left">
              <template #Header>
                <WinTextBlock
                  class="centered-header-text"
                  HorizontalTextAlignment="Center"
                  :Text="$t('sample.expander.centered-header')" />
              </template>
              <WinTextBlock Margin="4" :Text="$t('sample.expander.left-aligned-content')" />
            </WinExpander>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinExpander from '../../components/WinExpander.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'expander');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const expander1Expanded = ref(false);
const expandDirectionIndex = ref(0);
const expandDirectionItems = computed(() => [
  { Text: t('text.down'), Value: 'Down' },
  { Text: t('text.up'), Value: 'Up' }
]);
const expandDirection = computed(() => expandDirectionItems.value[expandDirectionIndex.value]?.Value ?? 'Down');
const verticalAlignment = computed(() => expandDirection.value === 'Up' ? 'Bottom' : 'Top');

const example1Code = computed(() => `<WinExpander
  IsExpanded="${expander1Expanded.value ? 'True' : 'False'}"
  ExpandDirection="${expandDirection.value}"
  Header="${t('sample.expander.header-text')}"
  VerticalAlignment="${verticalAlignment.value}">
  <WinTextBlock Text="${t('sample.expander.content-text')}" />
</WinExpander>`);

const example2Code = computed(() => `<WinExpander Width="500" Padding="0" HorizontalContentAlignment="Left">
  <template #Header>
    <WinTextBlock HorizontalTextAlignment="Center" Text="${t('sample.expander.centered-header')}" />
  </template>
  <WinTextBlock Margin="4" Text="${t('sample.expander.left-aligned-content')}" />
</WinExpander>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.centered-header-text { width: 100%; }
</style>
