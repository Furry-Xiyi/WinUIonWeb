<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.canvas')" />
          <WinTextBlock class="page-description" :Text="$t('text.canvas-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.canvas.control')" :theme="pageTheme" :vue="canvasCode">
              <template #example>
                <WinCanvas Width="140" Height="140" Background="Gray" VerticalAlignment="Top">
                  <div class="layout-rectangle red" :style="{ left: `${leftValue}px`, top: `${topValue}px`, zIndex: zIndexValue }" />
                  <div class="layout-rectangle blue" style="left: 20px; top: 20px; z-index: 1;" />
                  <div class="layout-rectangle green" style="left: 40px; top: 40px; z-index: 2;" />
                  <div class="layout-rectangle yellow" style="left: 60px; top: 60px; z-index: 3;" />
                </WinCanvas>
              </template>
              <template #options>
                <div class="canvas-options">
                  <WinSlider v-model:Value="topValue" Height="110" Header="Canvas.Top" Orientation="Vertical" :Maximum="100" :Minimum="0" :StepFrequency="1" />
                  <div class="options-stack">
                    <WinSlider v-model:Value="leftValue" Width="100" Header="Canvas.Left" :Maximum="100" :Minimum="0" :StepFrequency="1" />
                    <WinSlider v-model:Value="zIndexValue" Width="100" Header="Canvas.ZIndex" :Maximum="4" :Minimum="0" :StepFrequency="1" />
                  </div>
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
import WinCanvas from '../../components/WinCanvas.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'canvas');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const leftValue = ref(0);
const topValue = ref(0);
const zIndexValue = ref(0);

const canvasCode = computed(() => `<WinCanvas Width="120" Height="120" Background="Gray">
  <Rectangle Fill="Red" Canvas.Left="${leftValue.value}" Canvas.Top="${topValue.value}" Canvas.ZIndex="${zIndexValue.value}" />
  <Rectangle Fill="Blue" Canvas.Left="20" Canvas.Top="20" Canvas.ZIndex="1" />
  <Rectangle Fill="Green" Canvas.Left="40" Canvas.Top="40" Canvas.ZIndex="2" />
  <Rectangle Fill="Yellow" Canvas.Left="60" Canvas.Top="60" Canvas.ZIndex="3" />
</WinCanvas>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.layout-rectangle { position: absolute; width: 40px; height: 40px; }
.red { background: Red; }
.blue { background: Blue; }
.green { background: Green; }
.yellow { background: Yellow; }
.canvas-options { display: flex; gap: 16px; align-items: flex-start; }
.options-stack { display: flex; flex-direction: column; gap: 8px; }
</style>
