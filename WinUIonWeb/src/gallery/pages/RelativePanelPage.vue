<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.relativepanel')" />
          <WinTextBlock class="page-description" :Text="$t('text.relativepanel-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.relativepanel.control')" :theme="pageTheme" :vue="relativePanelCode">
              <template #example>
                <WinRelativePanel Width="300" Height="108">
                  <div class="layout-rectangle red" style="left: 0; top: 0;" />
                  <div class="layout-rectangle blue" style="left: 58px; top: 0;" />
                  <div class="layout-rectangle green" style="right: 0; top: 0;" />
                  <div class="layout-rectangle yellow" style="right: 0; top: 58px;" />
                </WinRelativePanel>
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
import WinRelativePanel from '../../components/WinRelativePanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'relativepanel');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const relativePanelCode = `<WinRelativePanel Width="300">
  <Rectangle x:Name="Rectangle1" Fill="Red" Height="50" Width="50" />
  <Rectangle x:Name="Rectangle2" Fill="Blue" Height="50" Width="50" RelativePanel.RightOf="Rectangle1" Margin="8,0,0,0" />
  <Rectangle x:Name="Rectangle3" Fill="Green" Height="50" Width="50" RelativePanel.AlignRightWithPanel="True" />
  <Rectangle x:Name="Rectangle4" Fill="Yellow" Height="50" Width="50" RelativePanel.Below="Rectangle3" RelativePanel.AlignHorizontalCenterWith="Rectangle3" Margin="0,8,0,0" />
</WinRelativePanel>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.layout-rectangle { position: absolute; width: 50px; height: 50px; }
.red { background: Red; }
.blue { background: Blue; }
.green { background: Green; }
.yellow { background: Yellow; }
</style>
