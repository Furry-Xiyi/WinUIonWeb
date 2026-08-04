<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.teachingtip')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-teaching-tip-is-a-notification-flyout-used-to')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.teachingtip.targeted')" :theme="pageTheme" :vue="targetedCode">
              <template #example>
                <WinButton ref="testButton1" @Click="testButton1TeachingTipOpen = true">
                  <WinTextBlock :Text="$t('text.show-teachingtip')" />
                </WinButton>
                <WinTeachingTip
                  v-model:IsOpen="testButton1TeachingTipOpen"
                  :Title="$t('sample.teachingtip.title')"
                  :Subtitle="$t('sample.teachingtip.subtitle')"
                  :Target="testButton1"
                  IconSource="Refresh" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.teachingtip.non-targeted')" :theme="pageTheme" :vue="nonTargetedCode">
              <template #example>
                <WinButton @Click="testButton2TeachingTipOpen = true">
                  <WinTextBlock :Text="$t('text.show-teachingtip')" />
                </WinButton>
                <WinTeachingTip
                  v-model:IsOpen="testButton2TeachingTipOpen"
                  :Title="$t('sample.teachingtip.title')"
                  :Subtitle="$t('sample.teachingtip.subtitle')"
                  :ActionButtonContent="$t('sample.teachingtip.action-button')"
                  :CloseButtonContent="$t('sample.teachingtip.close-button')"
                  :IsLightDismissEnabled="true"
                  :PlacementMargin="20"
                  PreferredPlacement="Auto" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.teachingtip.hero')" :theme="pageTheme" :vue="heroCode">
              <template #example>
                <WinButton ref="testButton3" @Click="testButton3TeachingTipOpen = true">
                  <WinTextBlock :Text="$t('text.show-teachingtip')" />
                </WinButton>
                <WinTeachingTip
                  v-model:IsOpen="testButton3TeachingTipOpen"
                  :Title="$t('sample.teachingtip.title')"
                  :Subtitle="$t('sample.teachingtip.subtitle')"
                  :Target="testButton3"
                  PreferredPlacement="Bottom">
                  <template #HeroContent>
                    <img class="hero-image" :src="sunsetImageUrl" :alt="$t('text.sunset')" />
                  </template>
                  <WinTextBlock class="tip-description" :Text="$t('sample.teachingtip.description')" TextWrapping="WrapWholeWords" />
                </WinTeachingTip>
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
import WinTeachingTip from '../../components/WinTeachingTip.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'teachingtip');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const testButton1 = ref(null);
const testButton3 = ref(null);
const testButton1TeachingTipOpen = ref(false);
const testButton2TeachingTipOpen = ref(false);
const testButton3TeachingTipOpen = ref(false);
const sunsetImageUrl = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/sunset.jpg';

const targetedCode = computed(() => `<WinButton ref="testButton1" @Click="testButton1TeachingTipOpen = true">
  <WinTextBlock Text="${t('text.show-teachingtip')}" />
</WinButton>
<WinTeachingTip
  v-model:IsOpen="testButton1TeachingTipOpen"
  Title="${t('sample.teachingtip.title')}"
  Subtitle="${t('sample.teachingtip.subtitle')}"
  :Target="testButton1"
  IconSource="Refresh" />`);

const nonTargetedCode = computed(() => `<WinButton @Click="testButton2TeachingTipOpen = true">
  <WinTextBlock Text="${t('text.show-teachingtip')}" />
</WinButton>
<WinTeachingTip
  v-model:IsOpen="testButton2TeachingTipOpen"
  Title="${t('sample.teachingtip.title')}"
  Subtitle="${t('sample.teachingtip.subtitle')}"
  ActionButtonContent="${t('sample.teachingtip.action-button')}"
  CloseButtonContent="${t('sample.teachingtip.close-button')}"
  :IsLightDismissEnabled="true"
  :PlacementMargin="20"
  PreferredPlacement="Auto" />`);

const heroCode = computed(() => `<WinButton ref="testButton3" @Click="testButton3TeachingTipOpen = true">
  <WinTextBlock Text="${t('text.show-teachingtip')}" />
</WinButton>
<WinTeachingTip
  v-model:IsOpen="testButton3TeachingTipOpen"
  Title="${t('sample.teachingtip.title')}"
  Subtitle="${t('sample.teachingtip.subtitle')}"
  :Target="testButton3"
  PreferredPlacement="Bottom">
  <template #HeroContent>
    <img src="${sunsetImageUrl}" alt="${t('text.sunset')}" />
  </template>
  <WinTextBlock Text="${t('sample.teachingtip.description')}" TextWrapping="WrapWholeWords" />
</WinTeachingTip>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.hero-image { width: 100%; height: 100%; object-fit: cover; display: block; }
.tip-description { margin-top: 16px; }
</style>
