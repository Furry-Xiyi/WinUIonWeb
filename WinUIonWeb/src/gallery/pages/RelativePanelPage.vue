<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.relativepanel')" />
          <TextBlock class="page-description" :Text="$t('text.relativepanel-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="RelativePanel\RelativepanelControl.txt" :HeaderText="$t('sample.relativepanel.control')" :Theme="pageTheme" :Vue="relativePanelCode">
              <ControlExample.Example>
                <RelativePanel Width="300" Height="108">
                  <div class="layout-rectangle red" style="left: 0; top: 0;" />
                  <div class="layout-rectangle blue" style="left: 58px; top: 0;" />
                  <div class="layout-rectangle green" style="right: 0; top: 0;" />
                  <div class="layout-rectangle yellow" style="right: 0; top: 58px;" />
                </RelativePanel>
              </ControlExample.Example>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import RelativePanel from '../../components/RelativePanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'relativepanel');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const relativePanelCode = `<RelativePanel Width="300">
  <Rectangle x:Name="Rectangle1" Fill="Red" Height="50" Width="50" />
  <Rectangle x:Name="Rectangle2" Fill="Blue" Height="50" Width="50" RelativePanel.RightOf="Rectangle1" Margin="8,0,0,0" />
  <Rectangle x:Name="Rectangle3" Fill="Green" Height="50" Width="50" RelativePanel.AlignRightWithPanel="True" />
  <Rectangle x:Name="Rectangle4" Fill="Yellow" Height="50" Width="50" RelativePanel.Below="Rectangle3" RelativePanel.AlignHorizontalCenterWith="Rectangle3" Margin="0,8,0,0" />
</RelativePanel>`;
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
