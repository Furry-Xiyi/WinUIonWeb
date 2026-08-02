<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      
      <div class="gallery-page-content">
        <WinTextBlock class="page-header" :Text="$t('text.settings')" />
          <WinTextBlock class="settings-section-title" :Text="$t('text.appearance')" />
          <div class="settings-controls">
            <WinExpander
              HeaderHeight="70"
              :Header="$t('text.theme')"
              :Description="$t('text.choose-your-app-color-mode')"
              HeaderIcon="">
              <WinRadioButtons :SelectedIndex="themeIndex" @SelectionChanged="onThemeSelectionChanged">
                <WinRadioButton :Content="$t('text.use-system-setting')" />
                <WinRadioButton :Content="$t('text.light')" />
                <WinRadioButton :Content="$t('text.dark')" />
              </WinRadioButtons>
            </WinExpander>
            <WinExpander
              v-if="isHostedInUwpWebView"
              HeaderHeight="70"
              :Header="$t('text.material')"
              :Description="$t('text.choose-the-app-background-material')"
              HeaderIcon="&#xE2B1;">
              <WinRadioButtons :SelectedIndex="materialIndex" @SelectionChanged="onMaterialSelectionChanged">
                <WinRadioButton :Content="$t('text.mica')" />
                <WinRadioButton :Content="$t('text.acrylic')" />
              </WinRadioButtons>
            </WinExpander>
            <WinExpander
              HeaderHeight="70"
              :Header="$t('text.page-transition')"
              :Description="$t('text.animation-style-when-switching-pages')"
              HeaderIcon="&#xE8AB;">
              <WinRadioButtons :SelectedIndex="animIndex" @SelectionChanged="onAnimSelectionChanged">
                <WinRadioButton :Content="$t('text.entrance-slide-up')" />
                <WinRadioButton :Content="$t('text.drill-left-right')" />
                <WinRadioButton :Content="$t('text.fade')" />
              </WinRadioButtons>
            </WinExpander>
            <WinSettingsCard
              :Header="$t('text.navigation-pane-position')"
              :Description="$t('text.select-the-navigation-bar-position')"
              :HeaderIcon="'\uF594'">
              <WinComboBox
                v-model:SelectedValue="navPosition"
                :ItemsSource="navPositionOptions"
                DisplayMemberPath="label"
                SelectedValuePath="value" />
            </WinSettingsCard>
          </div>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue';
import WinExpander from '../../components/WinExpander.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinRadioButtons from '../../components/WinRadioButtons.vue';
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
const themeOptions = ['system', 'light', 'dark'];
const materialOptions = ['mica', 'acrylic'];
const animOptions = ['entrance', 'drill', 'fade'];
const themeIndex = computed(() => themeOptions.indexOf(themeSetting.value));
const materialIndex = computed(() => materialOptions.indexOf(materialSetting.value));
const animIndex = computed(() => animOptions.indexOf(animSetting.value));
const onThemeSelectionChanged = ({ SelectedIndex }) => { themeSetting.value = themeOptions[SelectedIndex]; };
const onMaterialSelectionChanged = ({ SelectedIndex }) => { materialSetting.value = materialOptions[SelectedIndex]; };
const onAnimSelectionChanged = ({ SelectedIndex }) => { animSetting.value = animOptions[SelectedIndex]; };
const navPositionOptions = [
  { label: t('text.left'), value: 'Auto' },
  { label: t('text.top'), value: 'Top' }
];
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
  gap: 4px;
}

.settings-controls :deep(.win-expander),
.settings-controls :deep(.win-settings-card) {
  margin-bottom: 0;
}
</style>
