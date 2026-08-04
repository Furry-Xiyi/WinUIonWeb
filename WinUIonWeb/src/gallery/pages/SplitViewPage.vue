<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.splitview')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-container-with-two-views-one-view-for-the-main')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('text.a-basic-splitview')" :theme="pageTheme" :vue="splitViewCode">
              <template #example>
                <div class="split-view-sample-host">
                  <WinSplitView
                    v-model:IsPaneOpen="isPaneOpen"
                    :CompactPaneLength="compactPaneLength"
                    :DisplayMode="displayMode"
                    :OpenPaneLength="openPaneLength"
                    :PaneBackground="paneBackground"
                    :PanePlacement="panePlacement"
                    :IsTabStop="false"
                    MaxWidth="400">
                    <template #Pane>
                      <div class="split-pane-layout">
                        <WinTextBlock class="pane-header" :Text="$t('sample.splitview.pane-content')" />
                        <WinScrollViewer class="nav-links-list" VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Disabled" HorizontalScrollBarVisibility="Disabled">
                          <div
                            v-for="item in navLinks"
                            :key="item.label"
                            class="nav-link-item"
                            :class="{ selected: selectedNavLabel === item.label, right: panePlacement === 'Right' }"
                            role="button"
                            tabindex="0"
                            @pointerup="selectedNavLabel = item.label"
                            @keydown.enter.prevent="selectedNavLabel = item.label"
                            @keydown.space.prevent="selectedNavLabel = item.label">
                            <span v-if="panePlacement === 'Left'" class="nav-symbol icon">{{ item.symbol }}</span>
                            <WinTextBlock class="nav-label" :Text="item.label" />
                            <span v-if="panePlacement === 'Right'" class="nav-symbol icon">{{ item.symbol }}</span>
                          </div>
                        </WinScrollViewer>
                      </div>
                    </template>
                    <div class="split-content-layout">
                      <WinTextBlock class="split-content-header" :Text="$t('sample.splitview.splitview-content')" />
                      <WinTextBlock class="split-content-text" :Text="selectedNavLabel ? `${selectedNavLabel} ${$t('sample.splitview.page')}` : ''" />
                    </div>
                  </WinSplitView>
                </div>
              </template>

              <template #options>
                <div class="split-options">
                  <WinToggleButton v-model:IsChecked="isPaneOpen">
                    <WinTextBlock :Text="$t('sample.splitview.is-pane-open')" />
                  </WinToggleButton>
                  <WinToggleSwitch v-model:IsOn="isRight" :Header="$t('sample.splitview.placement')" :OffContent="$t('sample.splitview.left')" :OnContent="$t('sample.splitview.right')" />
                  <WinComboBox v-model:SelectedIndex="displayModeIndex" :Header="$t('sample.splitview.display-mode')" Width="196" :ItemsSource="displayModeItems" DisplayMemberPath="Text" />
                  <WinComboBox v-model:SelectedIndex="paneBackgroundIndex" :Header="$t('sample.splitview.pane-background')" Width="196" :ItemsSource="paneBackgroundItems" DisplayMemberPath="Text" />
                  <WinSlider v-model:Value="openPaneLength" :Header="$t('sample.splitview.open-pane-length')" Width="196" :Minimum="128" :Maximum="500" :StepFrequency="8" />
                  <WinSlider v-model:Value="compactPaneLength" :Header="$t('sample.splitview.compact-pane-length')" Width="196" :Minimum="24" :Maximum="128" :StepFrequency="8" />
                </div>
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
import WinSlider from '../../components/WinSlider.vue';
import WinSplitView from '../../components/WinSplitView.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'splitview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const isPaneOpen = ref(true);
const isRight = ref(false);
const displayModeIndex = ref(0);
const paneBackgroundIndex = ref(0);
const openPaneLength = ref(256);
const compactPaneLength = ref(48);
const selectedNavLabel = ref('');
const displayModes = ['Inline', 'CompactInline', 'Overlay', 'CompactOverlay'];
const displayModeItems = displayModes.map((Text) => ({ Text }));
const paneBackgroundItems = [
  { Text: 'SystemControlBackgroundChromeMediumLowBrush', Value: 'var(--SystemControlBackgroundChromeMediumLowBrush, var(--layer-default))' },
  { Text: 'Red', Value: 'Red' },
  { Text: 'Blue', Value: 'Blue' },
  { Text: 'Green', Value: 'Green' }
];
const navLinks = computed(() => [
  { label: t('sample.splitview.people'), symbol: '\uE716' },
  { label: t('sample.splitview.globe'), symbol: '\uE774' },
  { label: t('sample.splitview.message'), symbol: '\uE8BD' },
  { label: t('sample.splitview.mail'), symbol: '\uE715' }
]);
const displayMode = computed(() => displayModes[displayModeIndex.value]);
const paneBackground = computed(() => paneBackgroundItems[paneBackgroundIndex.value]?.Value || '');
const panePlacement = computed(() => isRight.value ? 'Right' : 'Left');

const splitViewCode = computed(() => `<WinSplitView
  v-model:IsPaneOpen="isPaneOpen"
  PaneBackground="${paneBackgroundIndex.value === 0 ? '{ThemeResource SystemControlBackgroundChromeMediumLowBrush}' : paneBackground.value}"
  :OpenPaneLength="${openPaneLength.value}"
  :CompactPaneLength="${compactPaneLength.value}"
  DisplayMode="${displayMode.value}">
  <template #Pane>
    <WinTextBlock Text="${t('sample.splitview.pane-content')}" Margin="60,12,0,0" />
    <ListView ItemsSource="NavLinks" />
  </template>
  <WinTextBlock Text="${t('sample.splitview.splitview-content')}" Margin="12,12,0,0" />
</WinSplitView>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.split-view-sample-host { width: 400px; height: 300px; overflow: hidden; }
.split-pane-layout { height: 100%; display: grid; grid-template-rows: auto 1fr auto; overflow: hidden; }
.pane-header { margin: 12px 0 0 60px; font-size: 14px; line-height: 20px; color: var(--text-primary); }
.nav-links-list { margin: 12px 0 0; min-height: 0; }
.nav-link-item { width: 100%; min-height: 40px; padding: 0; display: grid; grid-template-columns: auto 1fr; align-items: center; border: 0; background: transparent; color: var(--text-primary); text-align: left; cursor: default; }
.nav-link-item.right { grid-template-columns: 1fr auto; text-align: right; }
.nav-link-item:hover { background: var(--subtle-secondary); }
.nav-link-item.selected { background: var(--subtle-tertiary); }
.nav-symbol { width: 20px; margin-left: 2px; text-align: center; }
.nav-link-item.right .nav-symbol { margin-left: 0; margin-right: 2px; }
.nav-label { min-width: 0; margin-left: 24px; line-height: 20px; }
.nav-link-item.right .nav-label { margin-left: 0; margin-right: 24px; }
.split-content-layout { height: 100%; display: grid; grid-template-rows: auto 1fr; }
.split-content-header { margin: 12px 0 0 12px; color: var(--text-primary); }
.split-content-text { margin: 12px 0 0 12px; color: var(--text-primary); }
.split-options { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
</style>
