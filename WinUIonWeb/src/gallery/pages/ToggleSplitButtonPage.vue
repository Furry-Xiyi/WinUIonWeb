<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.togglesplitbutton')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-button-that-can-be-toggled-on-off-with-additio')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="toggleSplitButtonVue" :headerText="$t('sample.togglesplitbutton.bullet-list')">
              <template #example>
                <WinToggleSplitButton v-model:IsChecked="myListButton" VerticalAlignment="Top" AutomationProperties.Name="Bullets" @IsCheckedChanged="MyListButton_IsCheckedChanged">
                  <span class="icon">{{ listIcon }}</span>
                  <template #flyout="{ close }">
                    <div class="bullet-flyout">
                      <WinButton Padding="4" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Bulleted list" @Click="BulletButton_Click('List', close)">
                        <span class="icon">&#xEA37;</span>
                      </WinButton>
                      <WinButton Padding="4" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Roman numerals list" @Click="BulletButton_Click('Bullets', close)">
                        <span class="icon">&#xF0E2;</span>
                      </WinButton>
                    </div>
                  </template>
                </WinToggleSplitButton>
              </template>
              <template #options>
                <textarea v-model="richText" class="sample-editor" :class="{ 'as-list': myListButton }" :aria-label="$t('sample.type-something-here')"></textarea>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSplitButton from '../../components/WinToggleSplitButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'togglesplitbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const myListButton = ref(false);
const listType = ref('List');
const listIcon = computed(() => listType.value === 'List' ? '\uEA37' : '\uF0E2');
const richText = ref('Lorem ipsum dolor sit amet\nTempor commodo ullamcorper');

const BulletButton_Click = (symbol, close) => {
  listType.value = symbol;
  myListButton.value = true;
  close?.();
};

const MyListButton_IsCheckedChanged = () => {};

const toggleSplitButtonVue = `<WinToggleSplitButton v-model:IsChecked="myListButton" VerticalAlignment="Top" AutomationProperties.Name="Bullets" @IsCheckedChanged="MyListButton_IsCheckedChanged">
  <span class="icon">{{ listIcon }}</span>
  <template #flyout>
    <div class="bullet-flyout">
      <WinButton AutomationProperties.Name="Bulleted list" @Click="BulletButton_Click('List')">
        <span class="icon">&#xEA37;</span>
      </WinButton>
      <WinButton AutomationProperties.Name="Roman numerals list" @Click="BulletButton_Click('Bullets')">
        <span class="icon">&#xF0E2;</span>
      </WinButton>
    </div>
  </template>
</WinToggleSplitButton>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets", "WinUIOnWebIcons"; font-size: 16px; }
.bullet-flyout { display: flex; padding: 4px; }
.sample-editor { width: 240px; min-height: 96px; padding: 8px; border: 1px solid var(--ctrl-border); border-radius: 4px; background: var(--ctrl-fill-default); color: var(--text-primary); font: 14px "Segoe UI", system-ui, sans-serif; resize: vertical; }
.sample-editor.as-list { padding-left: 28px; }
</style>
