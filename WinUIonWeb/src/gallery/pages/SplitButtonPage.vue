<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.splitbutton')" />
          <WinTextBlock class="page-description" :Text="$t('text.the-splitbutton-is-a-dropdown-button-but-with-an')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="splitButtonColorPickerVue" :headerText="$t('sample.splitbutton.color-picker')">
              <template #example>
                <WinSplitButton MinWidth="0" MinHeight="0" Padding="0" VerticalAlignment="Top" :Theme="pageTheme" AutomationProperties.Name="Font color" @Click="applyCurrentColor">
                  <div class="color-swatch current-swatch" :style="{ backgroundColor: currentColor }"></div>
                  <template #flyout="{ close }">
                    <div class="swatch-grid">
                      <WinButton v-for="color in colorOptions" :key="color.value" Padding="0" MinWidth="0" MinHeight="0" Margin="6" :AutomationProperties.Name="color.text" @Click="selectColor(color.value, close)">
                        <span class="color-swatch" :style="{ backgroundColor: color.value }"></span>
                      </WinButton>
                    </div>
                  </template>
                </WinSplitButton>
              </template>
              <template #options>
                <WinTextBox v-model:Text="richText" class="sample-editor" AcceptsReturn TextWrapping="Wrap" :PlaceholderText="$t('sample.type-something-here')" :Foreground="appliedColor" />
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="splitButtonTextVue" :headerText="$t('sample.splitbutton.text')">
              <template #example>
                <WinSplitButton MinWidth="0" MinHeight="0" Padding="5" VerticalAlignment="Top" :Theme="pageTheme" AutomationProperties.Name="Font color with text">
                  <WinTextBlock :Text="$t('sample.choose-color')" />
                  <template #flyout="{ close }">
                    <div class="swatch-grid">
                      <WinButton v-for="color in textColorOptions" :key="color.value" Padding="0" MinWidth="0" MinHeight="0" Margin="6" :AutomationProperties.Name="color.text" @Click="selectTextColor(color.value, close)">
                        <span class="color-swatch" :style="{ backgroundColor: color.value }"></span>
                      </WinButton>
                    </div>
                  </template>
                </WinSplitButton>
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
import WinSplitButton from '../../components/WinSplitButton.vue';
import WinTextBox from '../../components/WinTextBox.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'splitbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const currentColor = ref('Green');
const appliedColor = ref('Green');
const selectedTextColor = ref('Green');
const richText = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor commodo ullamcorper a lacus.');

const colorOptions = computed(() => [
  { text: t('text.red'), value: 'Red' },
  { text: t('sample.orange'), value: 'Orange' },
  { text: t('text.yellow'), value: 'Yellow' },
  { text: t('text.green'), value: 'Green' },
  { text: t('text.blue'), value: 'Blue' },
  { text: t('sample.indigo'), value: 'Indigo' },
  { text: t('sample.violet'), value: 'Violet' },
  { text: t('sample.gray'), value: 'Gray' }
]);
const textColorOptions = computed(() => [...colorOptions.value, { text: t('sample.black'), value: 'Black' }]);

const selectColor = (color, close) => {
  currentColor.value = color;
  appliedColor.value = color;
  close?.();
};

const selectTextColor = (color, close) => {
  selectedTextColor.value = color;
  close?.();
};

const applyCurrentColor = () => {
  appliedColor.value = currentColor.value;
};

const splitButtonColorPickerVue = `<WinSplitButton MinWidth="0" MinHeight="0" Padding="0" VerticalAlignment="Top" :Theme="pageTheme" AutomationProperties.Name="Font color" @Click="applyCurrentColor">
  <div class="color-swatch" :style="{ backgroundColor: currentColor }"></div>
  <template #flyout>
    <div class="swatch-grid">
      <WinButton v-for="color in colorOptions" :key="color.value" @Click="selectColor(color.value)">
        <span class="color-swatch" :style="{ backgroundColor: color.value }"></span>
      </WinButton>
    </div>
  </template>
</WinSplitButton>`;

const splitButtonTextVue = `<WinSplitButton MinWidth="0" MinHeight="0" Padding="5" VerticalAlignment="Top" :Theme="pageTheme" AutomationProperties.Name="Font color with text">
  Choose color
  <template #flyout>
    <div class="swatch-grid">
      <WinButton v-for="color in textColorOptions" :key="color.value" @Click="selectedTextColor = color.value">
        <span class="color-swatch" :style="{ backgroundColor: color.value }"></span>
      </WinButton>
    </div>
  </template>
</WinSplitButton>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.color-swatch { display: block; width: 32px; height: 32px; border-radius: 4px; }
.current-swatch { border-radius: 4px 0 0 4px; }
.swatch-grid { display: grid; grid-template-columns: repeat(3, 44px); gap: 0; padding: 4px; }
.sample-editor { width: 100%; min-width: 240px; min-height: 96px; }

.sample-editor :deep(.win-textbox-textarea) {
  min-height: 96px;
}
</style>
