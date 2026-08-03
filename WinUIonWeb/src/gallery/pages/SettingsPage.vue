<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      
      <div class="gallery-page-content">
        <WinTextBlock class="page-header" :Text="$t('text.settings')" />
          <WinTextBlock class="settings-section-title" :Text="$t('text.appearance')" />
          <div class="settings-controls">
            <WinExpander
              Height="70"
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
              Height="70"
              :Header="$t('text.material')"
              :Description="$t('text.choose-the-app-background-material')"
              HeaderIcon="&#xE2B1;">
              <WinRadioButtons :SelectedIndex="materialIndex" @SelectionChanged="onMaterialSelectionChanged">
                <WinRadioButton :Content="$t('text.mica')" />
                <WinRadioButton :Content="$t('text.acrylic')" />
              </WinRadioButtons>
            </WinExpander>
            <WinExpander
              Height="70"
              :Header="$t('text.page-transition')"
              :Description="$t('text.animation-style-when-switching-pages')"
              HeaderIcon="&#xE8AB;">
              <WinRadioButtons :SelectedIndex="NavigationTransitionInfoIndex" @SelectionChanged="OnNavigationTransitionInfoSelectionChanged">
                <WinRadioButton
                  v-for="Option in NavigationTransitionInfoOptions"
                  :key="Option.Key"
                  :Content="$t(Option.LabelKey)" />
              </WinRadioButtons>
            </WinExpander>
            <WinSettingsCard
              :Header="$t('text.navigation-pane-position')"
              :Description="$t('text.select-the-navigation-bar-position')"
              :HeaderIcon="'\uF594'"
              :Height="70">
              <WinComboBox
                v-model:SelectedValue="navPosition"
                :ItemsSource="navPositionOptions"
                DisplayMemberPath="label"
                SelectedValuePath="value" />
            </WinSettingsCard>
          </div>
          <WinTextBlock class="about-section-title" :Text="$t('text.about')" />
          <div class="about-controls">
            <WinExpander
              Height="70">
              <template #HeaderIcon>
                <img class="about-app-icon" :src="appIcon" alt="App Icon" />
              </template>
              <template #Header>
                <div class="about-header-container">
                  <div class="about-header-text">
                    <WinTextBlock :Text="appTitle" FontSize="14.4" />
                    <WinTextBlock :Text="copyrightText" FontSize="12" Foreground="var(--TextFillColorSecondaryBrush, var(--text-secondary))" />
                  </div>
                  <WinTextBlock :Text="versionText" FontSize="14.4" Foreground="var(--TextFillColorSecondaryBrush, var(--text-secondary))" />
                </div>
              </template>
              <div class="about-content">
                <WinHyperlinkButton
                  NavigateUri="https://qm.qq.com/q/UPnTGW164m"
                  TargetName="_blank"
                  HorizontalAlignment="Left"
                  :Content="$t('text.qq-group')" />
                <WinHyperlinkButton
                  NavigateUri="https://discord.gg/4NScc8sEzw"
                  TargetName="_blank"
                  HorizontalAlignment="Left"
                  :Content="$t('text.discord-group')" />
              </div>
            </WinExpander>
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
import WinHyperlinkButton from '../../components/WinHyperlinkButton.vue';
import appManifest from '../../manifest.json';
import appIcon from '../../assets/AppIcon.ico';
import { useI18n } from '../../components/i18n/index';
import {
  DefaultNavigationTransitionInfo,
  createCommonNavigationTransitionInfo,
  createContinuumNavigationTransitionInfo,
  createDrillInNavigationTransitionInfo,
  createEntranceNavigationTransitionInfo,
  createSlideNavigationTransitionInfo,
  createSuppressNavigationTransitionInfo,
  navigationTransitionInfoEquals
} from '../../utils/navigationTransitionInfo';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const themeSetting = inject('themeSetting');
const materialSetting = inject('materialSetting');
const navigationTransitionInfo = inject('navigationTransitionInfo');
const navPosition = inject('navPosition');
const isHostedInUwpWebView = inject('isHostedInUwpWebView');
const themeOptions = ['system', 'light', 'dark'];
const materialOptions = ['mica', 'acrylic'];
const NavigationTransitionInfoOptions = [
  {
    Key: 'DefaultNavigationTransitionInfo',
    LabelKey: 'text.default-navigation-transition-info',
    NavigationTransitionInfo: DefaultNavigationTransitionInfo
  },
  {
    Key: 'EntranceNavigationTransitionInfo',
    LabelKey: 'text.entrance-navigation-transition-info',
    NavigationTransitionInfo: createEntranceNavigationTransitionInfo()
  },
  {
    Key: 'DrillInNavigationTransitionInfo',
    LabelKey: 'text.drill-in-navigation-transition-info',
    NavigationTransitionInfo: createDrillInNavigationTransitionInfo()
  },
  {
    Key: 'SuppressNavigationTransitionInfo',
    LabelKey: 'text.suppress-navigation-transition-info',
    NavigationTransitionInfo: createSuppressNavigationTransitionInfo()
  },
  {
    Key: 'SlideNavigationTransitionInfoFromRight',
    LabelKey: 'text.slide-navigation-transition-info-from-right',
    NavigationTransitionInfo: createSlideNavigationTransitionInfo('FromRight')
  },
  {
    Key: 'SlideNavigationTransitionInfoFromLeft',
    LabelKey: 'text.slide-navigation-transition-info-from-left',
    NavigationTransitionInfo: createSlideNavigationTransitionInfo('FromLeft')
  },
  {
    Key: 'CommonNavigationTransitionInfo',
    LabelKey: 'text.common-navigation-transition-info',
    NavigationTransitionInfo: createCommonNavigationTransitionInfo()
  },
  {
    Key: 'ContinuumNavigationTransitionInfo',
    LabelKey: 'text.continuum-navigation-transition-info',
    NavigationTransitionInfo: createContinuumNavigationTransitionInfo()
  }
];
const themeIndex = computed(() => themeOptions.indexOf(themeSetting.value));
const materialIndex = computed(() => materialOptions.indexOf(materialSetting.value));
const NavigationTransitionInfoIndex = computed(() => {
  const index = NavigationTransitionInfoOptions.findIndex((Option) => (
    navigationTransitionInfoEquals(navigationTransitionInfo.value, Option.NavigationTransitionInfo)
  ));
  return index >= 0 ? index : 0;
});
const onThemeSelectionChanged = ({ SelectedIndex }) => { themeSetting.value = themeOptions[SelectedIndex]; };
const onMaterialSelectionChanged = ({ SelectedIndex }) => { materialSetting.value = materialOptions[SelectedIndex]; };
const OnNavigationTransitionInfoSelectionChanged = ({ SelectedIndex }) => {
  const Option = NavigationTransitionInfoOptions[SelectedIndex];
  if (Option) navigationTransitionInfo.value = Option.NavigationTransitionInfo;
};
const navPositionOptions = [
  { label: t('text.left'), value: 'Auto' },
  { label: t('text.top'), value: 'Top' }
];
const appTitle = t('app.title');
const currentYear = new Date().getFullYear();
const copyrightText = computed(() => t('text.about-copyright', {
  year: currentYear,
  author: t(appManifest.author ?? 'app.author'),
  rights: t('text.all-rights-reserved')
}));
const versionText = t(appManifest.version ?? 'app.version');
</script>

<style scoped>
.settings-section-title {
  font-size: 14px;
  font-weight: 600;
}

  .settings-controls {
    display: flex;
    flex-direction: column;
    margin-top: 6px;
    margin-bottom: 32px;
  }

.settings-controls :deep(.win-expander),
.settings-controls :deep(.win-settings-card) {
  margin-bottom: 4px;
}

.about-section-title {
  font-size: 14px;
  font-weight: 600;
  margin-top: 32px;
}

.about-controls {
  display: flex;
  flex-direction: column;
  margin-top: 6px;
}

.about-app-icon {
  width: 20px;
  height: 20px;
}

.about-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
}

.about-header-text {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  min-width: 0;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
