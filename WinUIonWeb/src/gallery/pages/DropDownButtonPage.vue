<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.dropdownbutton')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-dropdownbutton-is-a-button-that-displays-a-che')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="dropDownButtonSimpleVue" :headerText="$t('sample.dropdown.simple')">
              <template #example>
                <WinDropDownButton :Content="$t('text.email')" :Flyout="emailFlyout" />
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="dropDownButtonIconVue" :headerText="$t('sample.dropdown.icons')">
              <template #example>
                <WinDropDownButton AutomationProperties.Name="Email" :Flyout="emailIconFlyout">
                  <span class="icon">&#xE715;</span>
                </WinDropDownButton>
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
import WinDropDownButton from '../../components/WinDropDownButton.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'dropdownbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const emailFlyout = {
  Placement: 'BottomEdgeAlignedLeft',
  Items: [
    { Text: t('text.send') },
    { Text: t('text.reply') },
    { Text: t('text.reply-all') }
  ]
};

const emailIconFlyout = {
  Placement: 'BottomEdgeAlignedLeft',
  Items: [
    { Text: t('text.send'), Icon: '\uE725' },
    { Text: t('text.reply'), Icon: '\uE8CA' },
    { Text: t('text.reply-all'), Icon: '\uE8C2' }
  ]
};

const dropDownButtonSimpleVue = `<WinDropDownButton Content="Email" :Flyout="{
  Placement: 'BottomEdgeAlignedLeft',
  Items: [
    { Text: 'Send' },
    { Text: 'Reply' },
    { Text: 'Reply All' }
  ]
}" />`;
const dropDownButtonIconVue = `<WinDropDownButton AutomationProperties.Name="Email" :Flyout="{
  Placement: 'BottomEdgeAlignedLeft',
  Items: [
    { Text: 'Send', Icon: '\\uE725' },
    { Text: 'Reply', Icon: '\\uE8CA' },
    { Text: 'Reply All', Icon: '\\uE8C2' }
  ]
}">
  <span class="icon">&#xE715;</span>
</WinDropDownButton>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
