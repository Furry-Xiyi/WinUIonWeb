<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.appbarbutton')" />
        <WinTextBlock class="page-description" :Text="$t('text.appbarbutton-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" @Click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
          <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
            <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
          </WinToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.appbarbutton.symbol')" :theme="pageTheme" :vue="symbolCode">
          <template #example>
            <div class="sample-row">
              <WinAppBarButton Icon="Like" :Label="$t('sample.appbarbutton.symbol-label')" @Click="onClicked('Button1', 0)" />
              <WinTextBlock class="output-text" :Text="outputs[0]" />
            </div>
          </template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.appbarbutton.bitmap')" :theme="pageTheme" :vue="bitmapCode">
          <template #example>
            <div class="sample-row">
              <WinAppBarButton :Label="$t('sample.appbarbutton.bitmap-label')" @Click="onClicked('Button2', 1)">
                <template #content><span class="bitmap-icon" :style="bitmapStyle" aria-hidden="true" /></template>
              </WinAppBarButton>
              <WinTextBlock class="output-text" :Text="outputs[1]" />
            </div>
          </template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.appbarbutton.font')" :theme="pageTheme" :vue="fontCode">
          <template #example>
            <div class="sample-row">
              <WinAppBarButton :Label="$t('sample.appbarbutton.font-label')" @Click="onClicked('Button3', 2)">
                <template #content><span class="font-icon">&#x03A3;</span></template>
              </WinAppBarButton>
              <WinTextBlock class="output-text" :Text="outputs[2]" />
            </div>
          </template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.appbarbutton.path')" :theme="pageTheme" :vue="pathCode">
          <template #example>
            <div class="sample-row">
              <WinAppBarButton :Label="$t('sample.appbarbutton.path-label')" @Click="onClicked('Button4', 3)">
                <template #content>
                  <svg class="path-icon" viewBox="4 9 21 16" aria-hidden="true">
                    <path d="M20 20L24 10V24H5Z" />
                  </svg>
                </template>
              </WinAppBarButton>
              <WinTextBlock class="output-text" :Text="outputs[3]" />
            </div>
          </template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.appbarbutton.keyboard')" :theme="pageTheme" :vue="keyboardCode">
          <template #example>
            <div class="sample-row">
              <WinAppBarButton
                Icon="Save"
                :Label="$t('text.save')"
                :KeyboardAccelerators="[{ Key: 'S', Modifiers: ['Control'] }]"
                @Click="onClicked('Button5', 4)" />
              <WinTextBlock class="output-text" :Text="outputs[4]" />
            </div>
          </template>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.appbarbutton.flyout')" :theme="pageTheme" :vue="flyoutCode">
          <template #example>
            <div class="sample-row">
              <WinFlyout Placement="Bottom" :Theme="pageTheme">
                <template #trigger="{ Flyout }">
                  <WinAppBarButton
                    AllowFocusOnInteraction
                    :Flyout="Flyout"
                    Icon="Edit"
                    :Label="$t('text.edit')" />
                </template>
                <WinTextBox MinWidth="240" :PlaceholderText="$t('sample.appbarbutton.input-placeholder')" />
              </WinFlyout>
            </div>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import WinAppBarButton from '../../components/WinAppBarButton.vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinFlyout from '../../components/WinFlyout.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinTextBox from '../../components/WinTextBox.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const slicesImage = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices2.png';
const { t } = useI18n();
const currentPage = inject<{ value: string }>('currentPage');
const pageKey = computed(() => currentPage?.value || 'appbarbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const outputs = ref(['', '', '', '', '']);
const bitmapStyle = computed(() => ({ '--bitmap-source': `url(${slicesImage})` }));

const onClicked = (name: string, index: number) => {
  outputs.value[index] = t('sample.you-clicked', { name });
};

const symbolCode = `<WinAppBarButton Icon="Like" Label="SymbolIcon" Click="AppBarButton_Click" />`;
const bitmapCode = `<WinAppBarButton Label="BitmapIcon" Click="AppBarButton_Click">
  <WinAppBarButton.Icon>
    <WinBitmapIcon UriSource="/Assets/SampleMedia/Slices2.png" />
  </WinAppBarButton.Icon>
</WinAppBarButton>`;
const fontCode = `<WinAppBarButton Label="FontIcon" Click="AppBarButton_Click">
  <WinAppBarButton.Icon>
    <WinFontIcon FontFamily="Candara" Glyph="&#x03A3;" />
  </WinAppBarButton.Icon>
</WinAppBarButton>`;
const pathCode = `<WinAppBarButton Label="PathIcon" Click="AppBarButton_Click">
  <WinAppBarButton.Content>
    <WinViewbox Stretch="Uniform">
      <WinPathIcon Data="F1 M 20,20L 24,10L 24,24L 5,24" />
    </WinViewbox>
  </WinAppBarButton.Content>
</WinAppBarButton>`;
const keyboardCode = `<WinAppBarButton
  Icon="Save"
  Label="Save"
  Click="AppBarButton_Click">
  <WinAppBarButton.KeyboardAccelerators>
    <WinKeyboardAccelerator Key="S" Modifiers="Control" />
  </WinAppBarButton.KeyboardAccelerators>
</WinAppBarButton>`;
const flyoutCode = `<WinAppBarButton AllowFocusOnInteraction="True" Icon="Edit" Label="Edit">
  <WinAppBarButton.Flyout>
    <WinFlyout>
      <WinTextBox MinWidth="240" PlaceholderText="Input text here" />
    </WinFlyout>
  </WinAppBarButton.Flyout>
</WinAppBarButton>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-row { display: flex; align-items: center; }
.output-text { margin-left: 8px; }
.bitmap-icon { display: block; width: 20px; height: 20px; background: currentColor; -webkit-mask: var(--bitmap-source) center / contain no-repeat; mask: var(--bitmap-source) center / contain no-repeat; }
.font-icon { font-family: Candara, sans-serif; font-size: 20px; line-height: 20px; }
.path-icon { width: 20px; height: 20px; fill: currentColor; }
</style>
