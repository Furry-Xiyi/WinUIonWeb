<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.hyperlinkbutton')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-button-that-appears-as-a-hyperlink')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="hyperlinkButtonNavigateVue" :headerText="$t('sample.hyperlink.navigate')">
              <template #example>
                <WinHyperlinkButton
                  :Content="$t('text.microsoft-home-page')"
                  NavigateUri="https://www.microsoft.com"
                  :IsEnabled="DisableControl1 !== true" />
              </template>
              <template #options>
                <WinCheckBox v-model="DisableControl1">
                  <WinTextBlock :Text="$t('sample.disable-hyperlink-button')" />
                </WinCheckBox>
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="hyperlinkButtonClickVue" :headerText="$t('sample.hyperlink.click')">
              <template #example>
                <WinHyperlinkButton :Content="$t('sample.hyperlink.go-to-togglebutton')" @Click="GoToHyperlinkButton_Click" />
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinHyperlinkButton from '../../components/WinHyperlinkButton.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const navigate = inject('navigate', () => {});
const pageKey = computed(() => currentPage?.value || 'hyperlinkbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const DisableControl1 = ref(false);

const GoToHyperlinkButton_Click = () => {
  navigate('togglebutton');
};

const hyperlinkButtonNavigateVue = `<WinHyperlinkButton
  Content="Microsoft home page"
  NavigateUri="https://www.microsoft.com"
  :IsEnabled="DisableControl1 !== true" />`;
const hyperlinkButtonClickVue = `<WinHyperlinkButton Content="Go to ToggleButton" @Click="GoToHyperlinkButton_Click" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
