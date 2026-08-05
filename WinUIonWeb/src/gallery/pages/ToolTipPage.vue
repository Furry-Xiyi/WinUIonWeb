<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.tooltip')" />
        <WinTextBlock class="page-description" :Text="$t('text.tooltip-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinToolTip :Content="$t('text.theme')" :Theme="pageTheme">
            <WinButton class="header-action" @Click="toggleTheme"><WinTextBlock class="icon" Text="&#xE793;" /></WinButton>
          </WinToolTip>
          <WinToolTip :Content="$t('text.favorites')" :Theme="pageTheme">
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <WinTextBlock class="icon" :Text="isFavoriteState ? '&#xE735;' : '&#xE734;'" />
            </WinToggleButton>
          </WinToolTip>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="simpleToolTipCode" :headerText="$t('sample.tooltip.simple')">
          <WinButton ToolTipService.ToolTip="Simple ToolTip">
            <WinTextBlock :Text="$t('sample.tooltip.button-content')" />
          </WinButton>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="serviceToolTipCode" :headerText="$t('sample.tooltip.attached')">
          <WinToolTip
            :Content="$t('sample.tooltip.service-content')"
            VerticalOffset="-80"
            :Theme="pageTheme">
            <WinTextBlock class="sample-text" :Text="$t('sample.tooltip.textblock-target')" TextWrapping="WrapWholeWords" />
          </WinToolTip>
        </WinControlExample>

        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="imageToolTipCode" :headerText="$t('sample.tooltip.image')">
          <WinToolTip
            :Content="$t('sample.tooltip.image-content')"
            Placement="Right"
            PlacementRect="0,0,400,266"
            :Theme="pageTheme">
            <WinImage
              :Source="cliffImage"
              :Width="400"
              :Height="266"
              Stretch="UniformToFill"
              :alt="$t('sample.tooltip.image-alt')" />
          </WinToolTip>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinImage from '../../components/WinImage.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToolTip from '../../components/WinToolTip.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject<Ref<string>>('currentPage');
const pageKey = computed(() => currentPage?.value || 'tooltip');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const cliffImage = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg';

const simpleToolTipCode = `<WinButton ToolTipService.ToolTip="Simple ToolTip">
  <WinTextBlock Text="Button with a simple ToolTip." />
</WinButton>`;

const serviceToolTipCode = `<WinToolTip Content="Offset ToolTip." VerticalOffset="-80">
  <WinTextBlock Text="TextBlock with an offset ToolTip." />
</WinToolTip>`;

const imageToolTipCode = `<WinToolTip Content="Non-occluding ToolTip." Placement="Right" PlacementRect="0,0,400,266">
  <WinImage Source="${cliffImage}" Width="400" Height="266" />
</WinToolTip>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-text { max-width: 280px; color: var(--text-primary); }
</style>
