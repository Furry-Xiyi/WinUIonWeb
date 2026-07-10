<template>
  <div class="gallery-item-page">
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
          <WinTextBlock class="page-header" :Text="$t('text.settings')" />
          <WinTextBlock class="settings-section-title" :Text="$t('text.appearance')" />
          <div class="settings-controls">
            <WinExpander
              :Header="$t('text.theme')"
              :Description="$t('text.choose-your-app-color-mode')"
              HeaderIcon="">
              <WinRadioButton value="system" v-model="themeSetting"><WinTextBlock :Text="$t('text.use-system-setting')" /></WinRadioButton>
              <WinRadioButton value="light" v-model="themeSetting"><WinTextBlock :Text="$t('text.light')" /></WinRadioButton>
              <WinRadioButton value="dark" v-model="themeSetting"><WinTextBlock :Text="$t('text.dark')" /></WinRadioButton>
            </WinExpander>
            <WinExpander
              v-if="isHostedInUwpWebView"
              :Header="$t('text.material')"
              :Description="$t('text.choose-the-app-background-material')"
              HeaderIcon="&#xE2B1;">
              <WinRadioButton value="mica" v-model="materialSetting"><WinTextBlock :Text="$t('text.mica')" /></WinRadioButton>
              <WinRadioButton value="acrylic" v-model="materialSetting"><WinTextBlock :Text="$t('text.acrylic')" /></WinRadioButton>
            </WinExpander>
            <WinExpander
              :Header="$t('text.page-transition')"
              :Description="$t('text.animation-style-when-switching-pages')"
              HeaderIcon="&#xE8AB;">
              <WinRadioButton value="entrance" v-model="animSetting"><WinTextBlock :Text="$t('text.entrance-slide-up')" /></WinRadioButton>
              <WinRadioButton value="drill" v-model="animSetting"><WinTextBlock :Text="$t('text.drill-left-right')" /></WinRadioButton>
              <WinRadioButton value="fade" v-model="animSetting"><WinTextBlock :Text="$t('text.fade')" /></WinRadioButton>
            </WinExpander>
            <WinSettingsCard
              :Header="$t('text.navigation-pane-position')"
              :Description="$t('text.select-the-navigation-bar-position')"
              :HeaderIcon="'\uF594'">
              <WinComboBox :options="navPositionOptions" :modelValue="navPositionIndex" @update:modelValue="v => navPosition = navPositionValues[v]" />
            </WinSettingsCard>
          </div>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import WinExpander from '../../components/WinExpander.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinSettingsCard from '../../components/WinSettingsCard.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import { useI18n } from '../../components/i18n/index';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const themeSetting = inject('themeSetting');
const materialSetting = inject('materialSetting');
const animSetting = inject('animSetting');
const navPosition = inject('navPosition');
const isHostedInUwpWebView = inject('isHostedInUwpWebView');
const navPositionOptions = [
  { label: t('text.left'), value: 'Auto' },
  { label: t('text.top'), value: 'Top' }
];
const navPositionValues = navPositionOptions.map(option => option.value);
const navPositionIndex = computed(() => Math.max(0, navPositionValues.indexOf(navPosition.value)));
</script>

<style scoped>
.settings-section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.settings-controls {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.settings-controls :deep(.win-expander),
.settings-controls :deep(.win-settings-card) {
  margin-bottom: 0;
}
</style>
