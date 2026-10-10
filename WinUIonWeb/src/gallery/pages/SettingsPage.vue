<template>
  <Grid class="settings-page-root">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto" />
      <RowDefinition Height="*" />
    </Grid.RowDefinitions>
    <div class="settings-page-header" Grid.Row="0">
      <BreadcrumbBar
        class="settings-page-breadcrumb"
        Height="36"
        ItemsSource="{x:Bind SettingsBreadcrumbItems, Mode=OneWay}" />
    </div>
    <ScrollViewer
      class="settings-page-scroll"
      Grid.Row="1"
      VerticalScrollBarVisibility="Auto"
      VerticalScrollMode="Auto">
      <div class="gallery-item-page settings-page-body">
        <div class="gallery-page-content">
          <TextBlock class="settings-section-title" Text="{x:Bind AppearanceLabel}" />
          <div class="settings-controls">
            <Expander
              Height="70"
              Header="{x:Bind ThemeLabel}"
              Description="{x:Bind ThemeDescription}"
              HeaderIcon="">
              <RadioButtons SelectedIndex="{x:Bind ThemeIndex, Mode=OneWay}" SelectionChanged="onThemeSelectionChanged">
                <RadioButton Content="{x:Bind SystemThemeLabel}" />
                <RadioButton Content="{x:Bind LightThemeLabel}" />
                <RadioButton Content="{x:Bind DarkThemeLabel}" />
              </RadioButtons>
            </Expander>
            <Grid Visibility="{x:Bind MaterialVisibility}">
              <Expander
                Height="70"
                Header="{x:Bind MaterialLabel}"
                Description="{x:Bind MaterialDescription}"
                HeaderIcon="&#xE2B1;">
                <RadioButtons SelectedIndex="{x:Bind MaterialIndex, Mode=OneWay}" SelectionChanged="onMaterialSelectionChanged">
                  <RadioButton Content="{x:Bind MicaLabel}" />
                  <RadioButton Content="{x:Bind AcrylicLabel}" />
                </RadioButtons>
              </Expander>
            </Grid>
            <Expander
              Height="70"
              Header="{x:Bind PageTransitionLabel}"
              Description="{x:Bind PageTransitionDescription}"
              HeaderIcon="&#xE8AB;">
              <RadioButtons
                SelectedIndex="{x:Bind NavigationTransitionInfoIndex, Mode=OneWay}"
                ItemsSource="{x:Bind NavigationTransitionOptions, Mode=OneWay}"
                DisplayMemberPath="Label"
                SelectionChanged="OnNavigationTransitionInfoSelectionChanged" />
            </Expander>
            <SettingsCard
              Header="{x:Bind NavigationPanePositionLabel}"
              Description="{x:Bind NavigationPanePositionDescription}"
              HeaderIcon="&#xF594;"
              Height="70">
              <ComboBox
                SelectedValue="{x:Bind navPosition, Mode=TwoWay}"
                ItemsSource="{x:Bind navPositionOptions, Mode=OneWay}"
                DisplayMemberPath="label"
                SelectedValuePath="value" />
            </SettingsCard>
          </div>
          <TextBlock class="about-section-title" Text="{x:Bind AboutLabel}" />
          <div class="about-controls">
            <Expander
              Header="{x:Bind AppTitle}"
              Description="{x:Bind CopyrightText}"
              Height="70">
              <Expander.HeaderIcon>
                <Image class="about-app-icon" Source="{x:Bind AppIcon}" Width="20" Height="20" Stretch="Uniform" AutomationProperties.Name="{x:Bind AppTitle}" />
              </Expander.HeaderIcon>
              <Expander.HeaderControls>
                <Button
                  Click="openRepository"
                  Content="{x:Bind OpenRepositoryLabel, Mode=OneWay}" />
                <TextBlock Text="{x:Bind VersionText}" FontSize="14.4" Foreground="{ThemeResource TextFillColorSecondaryBrush}" />
              </Expander.HeaderControls>
              <Expander.Content>
                <StackPanel class="about-content" Orientation="Vertical" Spacing="8">
                  <TextBlock Text="{x:Bind LegalHeading}" FontWeight="SemiBold" TextWrapping="Wrap" />
                  <TextBlock Text="{x:Bind LegalNonOfficial}" TextWrapping="Wrap" IsTextSelectionEnabled="True" />
                  <TextBlock Text="{x:Bind LegalAttribution}" TextWrapping="Wrap" IsTextSelectionEnabled="True" />
                  <TextBlock Text="{x:Bind LegalLicenses}" TextWrapping="Wrap" IsTextSelectionEnabled="True" />
                  <TextBlock Text="{x:Bind LegalTrademarks}" TextWrapping="Wrap" IsTextSelectionEnabled="True" />
                  <TextBlock Text="{x:Bind LegalWarranty}" TextWrapping="Wrap" IsTextSelectionEnabled="True" />
                  <StackPanel class="legal-links" Orientation="Vertical" Spacing="2">
                    <HyperlinkButton NavigateUri="https://aka.ms/winui-gallery" TargetName="_blank" HorizontalAlignment="Left" Content="{x:Bind OfficialGalleryLabel}" />
                    <HyperlinkButton NavigateUri="https://learn.microsoft.com/windows/apps/winui/winui3/" TargetName="_blank" HorizontalAlignment="Left" Content="{x:Bind WinUIDocsLabel}" />
                    <HyperlinkButton NavigateUri="https://github.com/microsoft/WinUI-Gallery" TargetName="_blank" HorizontalAlignment="Left" Content="{x:Bind GallerySourceLabel}" />
                    <HyperlinkButton NavigateUri="https://github.com/microsoft/microsoft-ui-xaml/tree/winui3/main" TargetName="_blank" HorizontalAlignment="Left" Content="{x:Bind WinUISourceLabel}" />
                    <HyperlinkButton NavigateUri="https://github.com/microsoft/WinUI-Gallery/blob/main/LICENSE" TargetName="_blank" HorizontalAlignment="Left" Content="{x:Bind GalleryLicenseLabel}" />
                    <HyperlinkButton NavigateUri="https://github.com/microsoft/microsoft-ui-xaml/blob/winui3/main/LICENSE" TargetName="_blank" HorizontalAlignment="Left" Content="{x:Bind WinUILicenseLabel}" />
                    <HyperlinkButton NavigateUri="https://github.com/microsoft/microsoft-ui-xaml/blob/winui3/main/NOTICE.md" TargetName="_blank" HorizontalAlignment="Left" Content="{x:Bind WinUINoticesLabel}" />
                    <HyperlinkButton NavigateUri="https://github.com/Furry-Xiyi/WinUIonWeb/blob/master/LICENSE" TargetName="_blank" HorizontalAlignment="Left" Content="{x:Bind ProjectLicenseLabel}" />
                  </StackPanel>
                  <Border class="about-divider" Height="1" Background="{ThemeResource DividerStrokeColorDefaultBrush}" />
                  <StackPanel class="community-links" Orientation="Vertical" Spacing="2">
                    <HyperlinkButton NavigateUri="https://qm.qq.com/q/UPnTGW164m" TargetName="_blank" HorizontalAlignment="Left" Content="{x:Bind QQGroupLabel, Mode=OneWay}" />
                    <HyperlinkButton NavigateUri="https://discord.gg/4NScc8sEzw" TargetName="_blank" HorizontalAlignment="Left" Content="{x:Bind DiscordGroupLabel, Mode=OneWay}" />
                  </StackPanel>
                </StackPanel>
              </Expander.Content>
            </Expander>
          </div>
        </div>
      </div>
    </ScrollViewer>
  </Grid>
</template>

<script setup>
import { computed, inject } from 'vue';
import BreadcrumbBar from '../../components/BreadcrumbBar.vue';
import Expander from '../../components/Expander.vue';
import RadioButton from '../../components/RadioButton.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import SettingsCard from '../../components/SettingsCard.vue';
import ComboBox from '../../components/ComboBox.vue';
import TextBlock from '../../components/TextBlock.vue';
import Button from '../../components/Button.vue';
import HyperlinkButton from '../../components/HyperlinkButton.vue';
import Image from '../../components/Image.vue';
import StackPanel from '../../components/StackPanel.vue';
import Border from '../../components/Border.vue';
import Grid from '../../components/Grid.vue';
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

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const SettingsBreadcrumbItems = computed(() => [t('text.settings')]);
const OpenRepositoryLabel = computed(() => t('text.open-code-repository'));
const QQGroupLabel = computed(() => t('text.qq-group'));
const DiscordGroupLabel = computed(() => t('text.discord-group'));
const themeSetting = inject('themeSetting');
const materialSetting = inject('materialSetting');
const navigationTransitionInfo = inject('navigationTransitionInfo');
const navPosition = inject('navPosition');
const isHostedInUwpWebView = inject('isHostedInUwpWebView');
const AppearanceLabel = computed(() => t('text.appearance'));
const ThemeLabel = computed(() => t('text.theme'));
const ThemeDescription = computed(() => t('text.choose-your-app-color-mode'));
const SystemThemeLabel = computed(() => t('text.use-system-setting'));
const LightThemeLabel = computed(() => t('text.light'));
const DarkThemeLabel = computed(() => t('text.dark'));
const MaterialLabel = computed(() => t('text.material'));
const MaterialDescription = computed(() => t('text.choose-the-app-background-material'));
const MicaLabel = computed(() => t('text.mica'));
const AcrylicLabel = computed(() => t('text.acrylic'));
const MaterialVisibility = computed(() => isHostedInUwpWebView.value ? 'Visible' : 'Collapsed');
const PageTransitionLabel = computed(() => t('text.page-transition'));
const PageTransitionDescription = computed(() => t('text.animation-style-when-switching-pages'));
const NavigationPanePositionLabel = computed(() => t('text.navigation-pane-position'));
const NavigationPanePositionDescription = computed(() => t('text.select-the-navigation-bar-position'));
const AboutLabel = computed(() => t('text.about'));
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
const ThemeIndex = computed(() => themeOptions.indexOf(themeSetting.value));
const MaterialIndex = computed(() => materialOptions.indexOf(materialSetting.value));
const NavigationTransitionOptions = computed(() => NavigationTransitionInfoOptions.map(option => ({
  ...option,
  Label: t(option.LabelKey)
})));
const NavigationTransitionInfoIndex = computed(() => {
  const index = NavigationTransitionInfoOptions.findIndex((Option) => (
    navigationTransitionInfoEquals(navigationTransitionInfo.value, Option.NavigationTransitionInfo)
  ));
  return index >= 0 ? index : 0;
});
const onThemeSelectionChanged = (_sender, args) => {
  const next = themeOptions[args.SelectedIndex];
  if (next) themeSetting.value = next;
};
const onMaterialSelectionChanged = (_sender, args) => {
  const next = materialOptions[args.SelectedIndex];
  if (next) materialSetting.value = next;
};
const OnNavigationTransitionInfoSelectionChanged = (_sender, args) => {
  const Option = NavigationTransitionInfoOptions[args.SelectedIndex];
  if (Option) navigationTransitionInfo.value = Option.NavigationTransitionInfo;
};
const navPositionOptions = computed(() => [
  { label: t('text.left'), value: 'Auto' },
  { label: t('text.top'), value: 'Top' }
]);
const AppIcon = appIcon;
const AppTitle = computed(() => t('app.title'));
const currentYear = new Date().getFullYear();
const CopyrightText = computed(() => t('text.about-copyright', {
  year: currentYear,
  author: t(appManifest.author ?? 'app.author'),
  rights: t('text.all-rights-reserved')
}));
const VersionText = computed(() => t(appManifest.version ?? 'app.version'));
const LegalHeading = computed(() => t('settings.legal.heading'));
const LegalNonOfficial = computed(() => t('settings.legal.nonofficial'));
const LegalAttribution = computed(() => t('settings.legal.attribution'));
const LegalLicenses = computed(() => t('settings.legal.licenses'));
const LegalTrademarks = computed(() => t('settings.legal.trademarks'));
const LegalWarranty = computed(() => t('settings.legal.warranty'));
const OfficialGalleryLabel = computed(() => t('settings.legal.official-gallery'));
const WinUIDocsLabel = computed(() => t('settings.legal.winui-docs'));
const GallerySourceLabel = computed(() => t('settings.legal.gallery-source'));
const WinUISourceLabel = computed(() => t('settings.legal.winui-source'));
const GalleryLicenseLabel = computed(() => t('settings.legal.gallery-license'));
const WinUILicenseLabel = computed(() => t('settings.legal.winui-license'));
const WinUINoticesLabel = computed(() => t('settings.legal.winui-notices'));
const ProjectLicenseLabel = computed(() => t('settings.legal.project-license'));
const openRepository = () => {
  window.open('https://github.com/Furry-Xiyi/WinUIonWeb/', '_blank', 'noopener,noreferrer');
};
</script>

<style scoped>
.settings-page-root {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.settings-page-header {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 24px 36px 30px;
}

.settings-page-scroll {
  grid-row: 2;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 640px) {
  .settings-page-header {
    padding: 12px 16px 16px;
  }
}

.settings-page-body {
  padding-top: 0;
}

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
  flex: 0 0 20px;
}

.about-controls :deep(.win-expander-header-controls .win-btn) {
  white-space: nowrap;
}

.about-content {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  align-items: stretch;
  text-align: left;
}

.about-content :deep(.win-text-block) {
  max-width: 100%;
  overflow-wrap: anywhere;
}

.legal-links,
.community-links {
  min-width: 0;
  align-items: flex-start;
}

.legal-links :deep(.win-hyperlink-button),
.community-links :deep(.win-hyperlink-button) {
  align-self: flex-start;
  max-width: 100%;
  text-align: left;
  white-space: normal;
  overflow-wrap: anywhere;
}

.about-divider {
  width: 100%;
  margin: 8px 0;
}

</style>

<style>
.settings-page-breadcrumb {
  max-width: 1064px;
  --BreadcrumbBarItemThemeFontSize: 28px;
}

.settings-page-breadcrumb .win-breadcrumb-layout-root,
.settings-page-breadcrumb .win-breadcrumb-current-item,
.settings-page-breadcrumb .win-breadcrumb-item-content {
  font-size: 28px !important;
  font-weight: 600 !important;
  line-height: 36px !important;
}

.settings-page-breadcrumb .win-breadcrumb-current-item {
  min-height: 36px;
  padding: 0 !important;
}

.settings-page-root .legal-links .win-hyperlink-button,
.settings-page-root .community-links .win-hyperlink-button {
  max-width: 100%;
  white-space: normal;
  text-align: left;
}

.settings-page-root .legal-links .win-button-default-text,
.settings-page-root .community-links .win-button-default-text {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
}
</style>
