<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.repeatbutton')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-button-that-raises-its-click-event-repeatedly-ecf7f2')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="repeatButtonSimpleVue" :headerText="$t('sample.repeat.simple')">
              <template #example>
                <div class="horizontal-stack">
                  <WinRepeatButton Content="Click and hold" :IsEnabled="DisableControl1 !== true" @Click="RepeatButton_Click" />
                  <WinTextBlock Margin="8,0,0,0" VerticalAlignment="Center" AutomationProperties.LiveSetting="Polite" AutomationProperties.Name="Control output" :Text="Control1Output" />
                </div>
              </template>
              <template #options>
                <WinCheckBox v-model="DisableControl1">
                  <WinTextBlock :Text="$t('sample.disable-repeatbutton')" />
                </WinCheckBox>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinRepeatButton from '../../components/WinRepeatButton.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'repeatbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const DisableControl1 = ref(false);
const clicks = ref(0);
const Control1Output = ref('');

const RepeatButton_Click = () => {
  clicks.value += 1;
  Control1Output.value = t('sample.number-of-clicks', { count: clicks.value });
};

const repeatButtonSimpleVue = `<div>
  <WinRepeatButton
    Content="Click and hold"
    :IsEnabled="DisableControl1 !== true"
    @Click="RepeatButton_Click" />
  <WinTextBlock
    Margin="8,0,0,0"
    VerticalAlignment="Center"
    AutomationProperties.LiveSetting="Polite"
    AutomationProperties.Name="Control output"
    :Text="Control1Output" />
</div>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.horizontal-stack { display: flex; align-items: center; }
.icon { font-size: 16px; }
</style>
