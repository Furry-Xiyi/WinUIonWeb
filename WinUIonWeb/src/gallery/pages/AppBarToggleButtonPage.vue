<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.appbar-toggle-button')" />
        <TextBlock class="page-description" :Text="$t('text.appbar-toggle-button-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" @Click="toggleTheme"><span class="icon">&#xE793;</span></Button>
          <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
            <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
          </ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.appbartogglebutton.symbol')" :theme="pageTheme" :vue="symbolCode">
          <template #example>
            <div class="sample-row">
              <AppBarToggleButton Icon="Shuffle" Label="SymbolIcon" v-model:IsChecked="checked[0]" @Click="onClicked(0)" />
              <TextBlock class="output-text" :Text="outputs[0]" />
            </div>
          </template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.appbartogglebutton.bitmap')" :theme="pageTheme" :vue="bitmapCode">
          <template #example>
            <div class="sample-row">
              <AppBarToggleButton Label="BitmapIcon" v-model:IsChecked="checked[1]" @Click="onClicked(1)">
                <template #content><span class="bitmap-icon" :style="bitmapStyle" aria-hidden="true" /></template>
              </AppBarToggleButton>
              <TextBlock class="output-text" :Text="outputs[1]" />
            </div>
          </template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.appbartogglebutton.font')" :theme="pageTheme" :vue="fontCode">
          <template #example>
            <div class="sample-row">
              <AppBarToggleButton Label="FontIcon" v-model:IsChecked="checked[2]" @Click="onClicked(2)">
                <template #content><span class="font-icon" aria-hidden="true">&#x03A3;</span></template>
              </AppBarToggleButton>
              <TextBlock class="output-text" :Text="outputs[2]" />
            </div>
          </template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.appbartogglebutton.path')" :theme="pageTheme" :vue="pathCode">
          <template #example>
            <div class="sample-row">
              <AppBarToggleButton Label="PathIcon" IsThreeState="True" v-model:IsChecked="checked[3]" @Click="onClicked(3)">
                <template #content>
                  <svg class="path-icon" viewBox="4 9 21 16" aria-hidden="true"><path d="M20 20L24 10V24H5Z" /></svg>
                </template>
              </AppBarToggleButton>
              <TextBlock class="output-text" :Text="outputs[3]" />
            </div>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import TextBlock from '../../components/TextBlock.vue';
import AppBarToggleButton from '../../components/AppBarToggleButton.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const slicesImage = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices2.png';
const { t } = useI18n();
const currentPage = inject<{ value: string }>('currentPage');
const pageKey = computed(() => currentPage?.value || 'toggleappbarbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const checked = ref<Array<boolean | null>>([false, false, false, false]);
const outputs = ref(['', '', '', '']);

const onClicked = (index: number) => {
  const value = checked.value[index];
  const display = value === null ? 'Null' : value ? 'True' : 'False';
  outputs.value[index] = t('sample.appbartogglebutton.output', { value: display });
};

const bitmapStyle = computed(() => ({ '--bitmap-source': `url(${slicesImage})` }));

const symbolCode = `<AppBarToggleButton Icon="Shuffle" Label="SymbolIcon" Click="AppBarButton_Click" />`;
const bitmapCode = `<AppBarToggleButton Label="BitmapIcon" Click="AppBarButton_Click">
  <AppBarToggleButton.Icon>
    <BitmapIcon UriSource="/Assets/SampleMedia/Slices2.png" />
  </AppBarToggleButton.Icon>
</AppBarToggleButton>`;
const fontCode = `<AppBarToggleButton Label="FontIcon" Click="AppBarButton_Click">
  <AppBarToggleButton.Icon>
    <FontIcon FontFamily="Candara" Glyph="&#x03A3;" />
  </AppBarToggleButton.Icon>
</AppBarToggleButton>`;
const pathCode = `<AppBarToggleButton Label="PathIcon" Click="AppBarButton_Click" IsThreeState="True">
  <AppBarToggleButton.Content>
    <Viewbox Stretch="Uniform">
      <PathIcon Data="F1 M 20,20L 24,10L 24,24L 5,24" />
    </Viewbox>
  </AppBarToggleButton.Content>
</AppBarToggleButton>`;
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
