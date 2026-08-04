<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.navigationview')" />
        <WinTextBlock class="page-description" :Text="$t('text.navigationview-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" @Click="toggleTheme"><WinTextBlock class="icon" Text="" /></WinButton>
          <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
            <WinTextBlock class="icon" :Text="isFavoriteState ? '\uE735' : '\uE734'" />
          </WinToggleButton>
        </div>
      </div>

      <WinStackPanel class="gallery-page-content" Spacing="0">
        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.default-header')"
          :theme="pageTheme"
          :vue="defaultExampleCode"
          horizontalContentAlignment="Stretch"
          :webViewHeight="250">
          <template #example>
            <WinGrid class="sample-layout" RowDefinitions="Auto,Auto">
              <WinTextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.default-description')" TextWrapping="WrapWholeWords" />
              <WinNavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="defaultSelectedItem"
                :MenuItems="defaultMenuItems"
                :Header="defaultHeader"
                PaneDisplayMode="Auto"
                @SelectionChanged="NavigationView_SelectionChanged5">
                <WinNavigationViewSamplePage :Page="defaultPage" :NavigationVersion="defaultNavigationVersion" :NavigationTransitionInfo="defaultNavigationTransitionInfo" />
              </WinNavigationView>
            </WinGrid>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.top-header')"
          :theme="pageTheme"
          :vue="topExampleCode"
          horizontalContentAlignment="Stretch"
          :webViewHeight="200">
          <template #example>
            <WinGrid class="sample-layout" RowDefinitions="Auto,Auto">
              <WinTextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.top-description')" TextWrapping="WrapWholeWords" />
              <WinNavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="topSelectedItem"
                :MenuItems="topMenuItems"
                :Header="$t('sample.navigationview.header-text')"
                PaneDisplayMode="Top"
                @SelectionChanged="NavigationView_SelectionChanged6">
                <WinNavigationViewSamplePage :Page="topPage" :NavigationVersion="topNavigationVersion" :NavigationTransitionInfo="topNavigationTransitionInfo" />
              </WinNavigationView>
            </WinGrid>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.adaptive-header')"
          :theme="pageTheme"
          :vue="adaptiveExampleCode"
          horizontalContentAlignment="Stretch"
          :webViewHeight="450">
          <template #example>
            <WinGrid class="sample-layout" RowDefinitions="Auto,Auto">
              <WinTextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.adaptive-description')" TextWrapping="WrapWholeWords" />
              <WinNavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="adaptiveSelectedItem"
                :MenuItems="adaptiveMenuItems"
                :PaneDisplayMode="adaptivePaneMode"
                @SelectionChanged="NavigationView_SelectionChanged2">
                <WinNavigationViewSamplePage :Page="adaptivePage" :NavigationVersion="adaptiveNavigationVersion" :NavigationTransitionInfo="adaptiveNavigationTransitionInfo" />
              </WinNavigationView>
            </WinGrid>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.tabs-header')"
          :theme="pageTheme"
          :vue="tabsExampleCode"
          :cSharp="tabsCodeBehind"
          horizontalContentAlignment="Stretch"
          :webViewHeight="800">
          <template #example>
            <WinGrid class="sample-layout" RowDefinitions="Auto,Auto">
              <WinTextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.tabs-description')" TextWrapping="WrapWholeWords" />
              <WinNavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="tabsSelectedItem"
                :MenuItems="tabsMenuItems"
                PaneDisplayMode="Top"
                SelectionFollowsFocus="Enabled"
                IsBackButtonVisible="Collapsed"
                @SelectionChanged="NavigationView_SelectionChanged7">
                <WinNavigationViewSamplePage :Page="tabsPage" :NavigationVersion="tabsNavigationVersion" :NavigationTransitionInfo="tabsNavigationTransitionInfo" />
              </WinNavigationView>
            </WinGrid>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.data-binding-header')"
          :theme="pageTheme"
          :vue="dataBindingExampleCode"
          horizontalContentAlignment="Stretch"
          :webViewHeight="950">
          <template #example>
            <WinGrid class="sample-layout" RowDefinitions="Auto,Auto">
              <WinTextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.data-binding-description')" TextWrapping="WrapWholeWords" />
              <WinNavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="dataSelectedItem"
                :MenuItemsSource="categories"
                :Header="dataHeader"
                :MenuItemTemplateSelector="categoryTemplateSelector"
                @SelectionChanged="NavigationView_SelectionChanged4">
                <WinNavigationViewSamplePage :Page="dataPage" :NavigationVersion="dataNavigationVersion" :NavigationTransitionInfo="dataNavigationTransitionInfo" />
              </WinNavigationView>
            </WinGrid>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.footer-header')"
          :theme="pageTheme"
          :vue="footerExampleCode"
          horizontalContentAlignment="Stretch">
          <template #example>
            <WinGrid class="sample-layout" RowDefinitions="Auto,Auto">
              <WinTextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.footer-description')" TextWrapping="WrapWholeWords" />
              <WinNavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="footerSelectedItem"
                :MenuItems="footerMenuItems"
                :FooterMenuItems="footerBottomItems"
                :Header="$t('sample.navigationview.header-text')"
                :PaneDisplayMode="footerPaneMode"
                v-model:IsPaneOpen="footerIsPaneOpen"
                :IsSettingsVisible="false"
                @SelectionChanged="NavigationView_SelectionChanged9">
                <WinNavigationViewSamplePage :Page="footerPage" :NavigationVersion="footerNavigationVersion" :NavigationTransitionInfo="footerNavigationTransitionInfo" />
              </WinNavigationView>
            </WinGrid>
          </template>
          <template #options>
            <WinRadioButtons
              :Header="$t('sample.navigationview.pane-position')"
              :ItemsSource="footerPaneOptions"
              v-model:SelectedIndex="footerPaneIndex" />
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.hierarchical-header')"
          :theme="pageTheme"
          :vue="hierarchicalExampleCode"
          horizontalContentAlignment="Stretch">
          <template #example>
            <WinGrid class="sample-layout" RowDefinitions="Auto,Auto">
              <WinStackPanel style="grid-row: 1;" Margin="0,0,0,15">
                <WinTextBlock :Text="$t('sample.navigationview.hierarchy-description-1')" TextWrapping="WrapWholeWords" />
                <WinTextBlock :Text="$t('sample.navigationview.hierarchy-description-2')" TextWrapping="WrapWholeWords" />
                <WinTextBlock :Text="$t('sample.navigationview.hierarchy-description-3')" TextWrapping="WrapWholeWords" />
                <WinTextBlock :Text="$t('sample.navigationview.hierarchy-description-4')" TextWrapping="WrapWholeWords" />
              </WinStackPanel>
              <WinNavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="hierarchicalSelectedItem"
                :MenuItems="hierarchicalMenuItems"
                :PaneDisplayMode="hierarchicalPaneMode"
                v-model:IsPaneOpen="hierarchicalIsPaneOpen"
                @SelectionChanged="NavigationView_SelectionChanged8">
                <WinNavigationViewSamplePage :Page="hierarchicalPage" :NavigationVersion="hierarchicalNavigationVersion" :NavigationTransitionInfo="hierarchicalNavigationTransitionInfo" />
              </WinNavigationView>
            </WinGrid>
          </template>
          <template #options>
            <WinStackPanel>
              <WinTextBlock Margin="0,12,0,0" :Text="$t('sample.navigationview.pane-position-property')" />
               <WinRadioButton GroupName="hierarchicalGroup" :Content="$t('sample.navigationview.left-mode')" :IsChecked="hierarchicalPaneMode === 'Left'" @Checked="panePositionLeft_Checked('nvSample8')" />
               <WinRadioButton GroupName="hierarchicalGroup" :Content="$t('sample.navigationview.top-mode')" :IsChecked="hierarchicalPaneMode === 'Top'" @Checked="panePositionTop_Checked('nvSample8')" />
               <WinRadioButton GroupName="hierarchicalGroup" :Content="$t('sample.navigationview.left-compact-mode')" :IsChecked="hierarchicalPaneMode === 'LeftCompact'" @Checked="panePositionLeftCompact_Checked('nvSample8')" />
            </WinStackPanel>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.api-header')"
          :theme="pageTheme"
          :vue="apiExampleCode"
          horizontalContentAlignment="Stretch"
          :webViewHeight="250">
          <template #example>
            <WinNavigationView
              class="nav-view-sample nav-view-api"
              :SelectedItem="apiSelectedItem"
              :MenuItems="apiMenuItems"
              :Header="apiHeader"
              :PaneTitle="apiPaneTitle"
              :IsSettingsVisible="apiSettingsVisible"
              :IsBackButtonVisible="apiBackVisible ? 'Visible' : 'Collapsed'"
              :IsBackEnabled="apiBackEnabled"
              :AlwaysShowHeader="apiAlwaysShowHeader"
              :PaneDisplayMode="apiPaneMode"
              v-model:IsPaneOpen="apiIsPaneOpen"
              :SelectionFollowsFocus="apiSelectionFollowsFocus ? 'Enabled' : 'Disabled'"
              :ExpandedModeThresholdWidth="500"
              @SelectionChanged="NavigationView_SelectionChanged">
              <template v-if="apiAutoSuggestVisible" #AutoSuggestBox>
                <WinAutoSuggestBox :AutomationProperties.Name="$t('sample.navigationview.search')" QueryIcon="Find" />
              </template>
              <template v-if="apiPaneCustomVisible" #PaneCustomContent>
                <WinHyperlinkButton Margin="12,0" :Content="$t('sample.navigationview.more-info')" />
              </template>
              <template v-if="apiPaneFooterVisible" #PaneFooter>
                <WinStackPanel class="api-pane-footer" :Orientation="apiPaneMode === 'Top' ? 'Horizontal' : 'Vertical'">
                  <WinButton class="pane-footer-action" Style="{StaticResource SubtleButtonStyle}" :AutomationProperties.Name="$t('sample.navigationview.download')">
                    <WinTextBlock class="icon" Text="" />
                  </WinButton>
                  <WinButton class="pane-footer-action" Style="{StaticResource SubtleButtonStyle}" :AutomationProperties.Name="$t('sample.navigationview.favorite')">
                    <WinTextBlock class="icon" Text="" />
                  </WinButton>
                </WinStackPanel>
              </template>
              <WinNavigationViewSamplePage :Page="apiPage" :NavigationVersion="apiNavigationVersion" :NavigationTransitionInfo="apiNavigationTransitionInfo" />
            </WinNavigationView>
          </template>
          <template #options>
            <WinStackPanel class="api-options">
              <WinCheckBox v-model:IsChecked="apiSettingsVisible"><WinTextBlock :Text="$t('sample.navigationview.settings-visible')" /></WinCheckBox>
              <WinCheckBox v-model:IsChecked="apiBackVisible"><WinTextBlock :Text="$t('sample.navigationview.back-visible')" /></WinCheckBox>
              <WinCheckBox v-model:IsChecked="apiBackEnabled"><WinTextBlock :Text="$t('sample.navigationview.back-enabled')" /></WinCheckBox>
              <WinCheckBox v-model:IsChecked="apiAutoSuggestVisible"><WinTextBlock :Text="$t('sample.navigationview.autosuggest-visible')" /></WinCheckBox>
              <WinTextBlock Margin="0,12,0,0" :Text="$t('sample.navigationview.header-label')" />
              <WinTextBox v-model:Text="apiHeader" :AutomationProperties.Name="$t('sample.navigationview.header-label')" />
              <WinCheckBox v-model:IsChecked="apiAlwaysShowHeader"><WinTextBlock :Text="$t('sample.navigationview.always-show-header')" /></WinCheckBox>
              <WinTextBlock Margin="0,12,0,0" :Text="$t('sample.navigationview.pane-title-label')" />
              <WinTextBox v-model:Text="apiPaneTitle" :AutomationProperties.Name="$t('sample.navigationview.pane-title-label')" />
              <WinCheckBox v-model:IsChecked="apiPaneCustomVisible"><WinTextBlock :Text="$t('sample.navigationview.pane-custom-visible')" /></WinCheckBox>
              <WinCheckBox v-model:IsChecked="apiPaneFooterVisible"><WinTextBlock :Text="$t('sample.navigationview.pane-footer-visible')" /></WinCheckBox>
              <WinTextBlock Margin="0,12,0,0" :Text="$t('sample.navigationview.pane-position-property')" />
               <WinRadioButton GroupName="apiPanePosition" :Content="$t('sample.navigationview.left')" :IsChecked="apiPaneMode === 'Left'" @Checked="panePositionLeft_Checked('nvSample')" />
               <WinRadioButton GroupName="apiPanePosition" Margin="0,0,0,12" :Content="$t('sample.navigationview.top')" :IsChecked="apiPaneMode === 'Top'" @Checked="panePositionTop_Checked('nvSample')" />
              <WinCheckBox v-model:IsChecked="apiSelectionFollowsFocus"><WinTextBlock :Text="$t('sample.navigationview.keyboard-selection-follows-focus')" /></WinCheckBox>
              <WinCheckBox v-model:IsChecked="apiSuppressMenuItem2"><WinTextBlock :Text="$t('sample.navigationview.suppress-menu-item-2')" /></WinCheckBox>
            </WinStackPanel>
          </template>
        </WinControlExample>
      </WinStackPanel>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WinAutoSuggestBox from '../../components/WinAutoSuggestBox.vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinHyperlinkButton from '../../components/WinHyperlinkButton.vue';
import WinGrid from '../../components/WinGrid.vue';
import WinNavigationView from '../../components/WinNavigationView.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinRadioButtons from '../../components/WinRadioButtons.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinTextBox from '../../components/WinTextBox.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinNavigationViewSamplePage from '../components/WinNavigationViewSamplePage.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';
import { createEntranceNavigationTransitionInfo } from '../../utils/navigationTransitionInfo';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'navigationview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const menuItem = (number, icon = '') => ({
  Content: t(`sample.navigationview.menu-item-${number}`),
  Icon: icon,
  Tag: `SamplePage${number}`
});

const pageForArgs = args => args.IsSettingsSelected
  ? 'SampleSettingsPage'
  : (args.SelectedItem?.Tag || 'SamplePage1');
const pageTitle = page => page === 'SampleSettingsPage'
  ? t('sample.navigationview.settings-page')
  : t('sample.navigationview.sample-page', { number: String(page).match(/(\d+)$/)?.[1] || 1 });
const RecommendedNavigationTransitionInfo = (args) => (
  args?.RecommendedNavigationTransitionInfo ?? createEntranceNavigationTransitionInfo()
);

const defaultMenuItems = [
  menuItem(1, '\uE768'),
  menuItem(2, '\uE74E'),
  menuItem(3, '\uE72C'),
  menuItem(4, '\uE896')
];
const defaultSelectedItem = ref(defaultMenuItems[0]);
const defaultPage = ref('SamplePage1');
const defaultHeader = ref(pageTitle('SamplePage1'));
const defaultNavigationVersion = ref(0);
const defaultNavigationTransitionInfo = ref(createEntranceNavigationTransitionInfo());
const NavigationView_SelectionChanged5 = (args) => {
  defaultNavigationVersion.value += 1;
  defaultNavigationTransitionInfo.value = RecommendedNavigationTransitionInfo(args);
  defaultSelectedItem.value = args.SelectedItem;
  defaultPage.value = pageForArgs(args);
  if (!args.IsSettingsSelected) defaultHeader.value = pageTitle(defaultPage.value);
};

const topMenuItems = [
  menuItem(1),
  menuItem(2),
  menuItem(3),
  { ...menuItem(4), Tag: 'SamplePage3' }
];
const topSelectedItem = ref(topMenuItems[0]);
const topPage = ref('SamplePage1');
const topNavigationVersion = ref(0);
const topNavigationTransitionInfo = ref(createEntranceNavigationTransitionInfo());
const NavigationView_SelectionChanged6 = (args) => {
  topNavigationVersion.value += 1;
  topNavigationTransitionInfo.value = RecommendedNavigationTransitionInfo(args);
  topSelectedItem.value = args.SelectedItem;
  topPage.value = pageForArgs(args);
};

const adaptiveMenuItems = [menuItem(1), menuItem(2), menuItem(3), menuItem(4)];
const adaptiveSelectedItem = ref(adaptiveMenuItems[0]);
const adaptivePage = ref('SamplePage1');
const adaptiveNavigationVersion = ref(0);
const adaptiveNavigationTransitionInfo = ref(createEntranceNavigationTransitionInfo());
const adaptivePaneMode = ref(typeof window !== 'undefined' && window.innerWidth >= 641 ? 'Top' : 'Auto');
const updateAdaptivePaneMode = () => {
  adaptivePaneMode.value = window.innerWidth >= 641 ? 'Top' : 'Auto';
};
const NavigationView_SelectionChanged2 = (args) => {
  adaptiveNavigationVersion.value += 1;
  adaptiveNavigationTransitionInfo.value = RecommendedNavigationTransitionInfo(args);
  adaptiveSelectedItem.value = args.SelectedItem;
  adaptivePage.value = pageForArgs(args);
};

onMounted(() => {
  updateAdaptivePaneMode();
  window.addEventListener('resize', updateAdaptivePaneMode);
});
onBeforeUnmount(() => window.removeEventListener('resize', updateAdaptivePaneMode));

const tabsMenuItems = [1, 2, 3, 4].map(number => ({
  Content: t(`sample.navigationview.item-${number}`),
  Tag: `SamplePage${number}`
}));
const tabsSelectedItem = ref(tabsMenuItems[0]);
const tabsPage = ref('SamplePage1');
const tabsNavigationVersion = ref(0);
const tabsNavigationTransitionInfo = ref(createEntranceNavigationTransitionInfo());
const NavigationView_SelectionChanged7 = (args) => {
  tabsNavigationVersion.value += 1;
  tabsNavigationTransitionInfo.value = RecommendedNavigationTransitionInfo(args);
  tabsSelectedItem.value = args.SelectedItem;
  tabsPage.value = pageForArgs(args);
};

const categories = [1, 2, 3, 4].map((number) => ({
  Name: t('sample.navigationview.category', { number }),
  Glyph: ['\uE80F', '\uE765', '\uE8F1', '\uE715'][number - 1],
  Tooltip: t('sample.navigationview.category-tooltip', { number })
}));
const categoryTemplateSelector = Object.freeze({ Name: 'CategoryTemplateSelector' });
const dataSelectedItem = ref(categories[0]);
const dataHeader = ref(pageTitle('SamplePage1'));
const dataPage = ref('SamplePage1');
const dataNavigationVersion = ref(0);
const dataNavigationTransitionInfo = ref(createEntranceNavigationTransitionInfo());
const NavigationView_SelectionChanged4 = (args) => {
  dataNavigationVersion.value += 1;
  dataNavigationTransitionInfo.value = RecommendedNavigationTransitionInfo(args);
  dataSelectedItem.value = args.SelectedItem;
  if (args.IsSettingsSelected) {
    dataPage.value = 'SampleSettingsPage';
    return;
  }
  const number = String(args.SelectedItem?.Name || '').match(/(\d+)$/)?.[1] || 1;
  dataHeader.value = t('sample.navigationview.sample-page', { number });
  dataPage.value = 'SamplePage1';
};

const footerMenuItems = [
  { Content: t('sample.navigationview.browse'), Icon: '\uE8F1', Tag: 'SamplePage1' },
  { Content: t('sample.navigationview.track-order'), Icon: '\uE707', Tag: 'SamplePage2' },
  { Content: t('sample.navigationview.order-history'), Icon: '\uE8EC', Tag: 'SamplePage3' }
];
const footerBottomItems = [
  { Content: t('sample.navigationview.account'), Icon: '\uE77B', Tag: 'SamplePage4' },
  { Content: t('sample.navigationview.your-cart'), Icon: '\uE7BF', Tag: 'SamplePage5' },
  { Content: t('sample.navigationview.help'), Icon: '\uE897', Tag: 'SamplePage5' }
];
const footerSelectedItem = ref(footerMenuItems[0]);
const footerPage = ref('SamplePage1');
const footerNavigationVersion = ref(0);
const footerNavigationTransitionInfo = ref(createEntranceNavigationTransitionInfo());
const footerPaneMode = ref('Left');
const footerIsPaneOpen = ref(true);
const panePositionLeft_Checked = (sampleName) => {
  if (sampleName === 'nvSample') {
    apiPaneMode.value = 'Left';
    apiIsPaneOpen.value = true;
  } else if (sampleName === 'nvSample8') {
    hierarchicalPaneMode.value = 'Left';
    hierarchicalIsPaneOpen.value = true;
  } else if (sampleName === 'nvSample9') {
    footerPaneMode.value = 'Left';
    footerIsPaneOpen.value = true;
  }
};
const panePositionTop_Checked = (sampleName) => {
  if (sampleName === 'nvSample') {
    apiPaneMode.value = 'Top';
    apiIsPaneOpen.value = false;
  } else if (sampleName === 'nvSample8') {
    hierarchicalPaneMode.value = 'Top';
    hierarchicalIsPaneOpen.value = false;
  } else if (sampleName === 'nvSample9') {
    footerPaneMode.value = 'Top';
    footerIsPaneOpen.value = false;
  }
};
const panePositionLeftCompact_Checked = (sampleName) => {
  if (sampleName === 'nvSample8') {
    hierarchicalPaneMode.value = 'LeftCompact';
    hierarchicalIsPaneOpen.value = false;
  }
};
const footerPaneIndex = computed({
  get: () => footerPaneMode.value === 'Left' ? 0 : 1,
  set: value => {
    if (value === 0) panePositionLeft_Checked('nvSample9');
    else panePositionTop_Checked('nvSample9');
  }
});
const footerPaneOptions = [
  { Text: t('sample.navigationview.left-mode'), Value: 'Left' },
  { Text: t('sample.navigationview.top-mode'), Value: 'Top' }
];
const NavigationView_SelectionChanged9 = (args) => {
  footerNavigationVersion.value += 1;
  footerNavigationTransitionInfo.value = RecommendedNavigationTransitionInfo(args);
  footerSelectedItem.value = args.SelectedItem;
  footerPage.value = pageForArgs(args);
};

const hierarchicalMenuItems = [
  { Content: t('sample.navigationview.home'), Icon: '\uE80F', Tag: 'SamplePage1', ToolTip: t('sample.navigationview.home') },
  {
    Content: t('sample.navigationview.account'), Icon: '\uE77B', Tag: 'SamplePage2', ToolTip: t('sample.navigationview.account'),
    MenuItems: [
      { Content: t('sample.navigationview.mail'), Icon: '\uE715', Tag: 'SamplePage3', ToolTip: t('sample.navigationview.mail') },
      { Content: t('sample.navigationview.calendar'), Icon: '\uE787', Tag: 'SamplePage4', ToolTip: t('sample.navigationview.calendar') }
    ]
  },
  {
    Content: t('sample.navigationview.document-options'), Icon: '\uE8A5', SelectsOnInvoked: false, ToolTip: t('sample.navigationview.document-options'),
    MenuItems: [
      { Content: t('sample.navigationview.create-new'), Icon: '\uE8F4', Tag: 'SamplePage5', ToolTip: t('sample.navigationview.create-new') },
      { Content: t('sample.navigationview.upload-file'), Icon: '\uE8E5', Tag: 'SamplePage6', ToolTip: t('sample.navigationview.upload-file') }
    ]
  }
];
const hierarchicalSelectedItem = ref(hierarchicalMenuItems[0]);
const hierarchicalPage = ref('SamplePage1');
const hierarchicalNavigationVersion = ref(0);
const hierarchicalNavigationTransitionInfo = ref(createEntranceNavigationTransitionInfo());
const hierarchicalPaneMode = ref('Left');
const hierarchicalIsPaneOpen = ref(true);
const NavigationView_SelectionChanged8 = (args) => {
  hierarchicalNavigationVersion.value += 1;
  hierarchicalNavigationTransitionInfo.value = RecommendedNavigationTransitionInfo(args);
  hierarchicalSelectedItem.value = args.SelectedItem;
  hierarchicalPage.value = pageForArgs(args);
};

const apiSettingsVisible = ref(true);
const apiBackVisible = ref(true);
const apiBackEnabled = ref(false);
const apiAutoSuggestVisible = ref(true);
const apiHeader = ref(t('sample.navigationview.header-value'));
const apiAlwaysShowHeader = ref(true);
const apiPaneTitle = ref(t('sample.navigationview.pane-title-value'));
const apiPaneCustomVisible = ref(false);
const apiPaneFooterVisible = ref(false);
const apiPaneMode = ref('Left');
const apiIsPaneOpen = ref(true);
const apiSelectionFollowsFocus = ref(false);
const apiSuppressMenuItem2 = ref(false);
const apiMenuItems = ref([
  menuItem(1, '\uE768'),
  { Type: 'NavigationViewItemHeader', Content: t('sample.navigationview.actions') },
  { ...menuItem(2, '\uE74E'), SelectsOnInvoked: true },
  menuItem(3, '\uE72C')
]);
const apiSelectedItem = ref(apiMenuItems.value[0]);
const apiPage = ref('SamplePage1');
const apiNavigationVersion = ref(0);
const apiNavigationTransitionInfo = ref(createEntranceNavigationTransitionInfo());
watch(apiSuppressMenuItem2, (suppressed) => {
  const menuItem2 = apiMenuItems.value[2];
  if (menuItem2) menuItem2.SelectsOnInvoked = !suppressed;
}, { immediate: true });
const NavigationView_SelectionChanged = (args) => {
  apiNavigationVersion.value += 1;
  apiNavigationTransitionInfo.value = RecommendedNavigationTransitionInfo(args);
  apiSelectedItem.value = args.SelectedItem;
  apiPage.value = pageForArgs(args);
  if (!args.IsSettingsSelected) apiHeader.value = pageTitle(apiPage.value);
};

const defaultExampleCode = `<WinNavigationView
  Height="460"
  :Header="$t('sample.navigationview.header-text')"
  PaneDisplayMode="Auto"
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  @SelectionChanged="NavigationView_SelectionChanged5">
  <WinNavigationViewSamplePage :Page="page" />
</WinNavigationView>`;

const topExampleCode = `<WinNavigationView
  Height="460"
  :Header="$t('sample.navigationview.header-text')"
  PaneDisplayMode="Top"
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  @SelectionChanged="NavigationView_SelectionChanged6">
  <WinNavigationViewSamplePage :Page="page" />
</WinNavigationView>`;

const adaptiveExampleCode = `<WinNavigationView
  Height="460"
  :PaneDisplayMode="paneDisplayMode"
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  @SelectionChanged="NavigationView_SelectionChanged2">
  <WinNavigationViewSamplePage :Page="page" />
</WinNavigationView>`;

const tabsExampleCode = `<WinNavigationView
  Height="460"
  PaneDisplayMode="Top"
  SelectionFollowsFocus="Enabled"
  IsBackButtonVisible="Collapsed"
  :SelectedItem="selectedItem"
  :MenuItems="[
    { Content: $t('sample.navigationview.item-1'), Tag: 'SamplePage1' },
    { Content: $t('sample.navigationview.item-2'), Tag: 'SamplePage2' },
    { Content: $t('sample.navigationview.item-3'), Tag: 'SamplePage3' },
    { Content: $t('sample.navigationview.item-4'), Tag: 'SamplePage4' }
  ]"
  @SelectionChanged="NavigationView_SelectionChanged7">
  <WinNavigationViewSamplePage :Page="page" />
</WinNavigationView>`;

const tabsCodeBehind = `const NavigationView_SelectionChanged7 = (sender, args) => {
  const page = args.SelectedItem.Tag;
  navigate(page, args.RecommendedNavigationTransitionInfo);
};`;

const dataBindingExampleCode = `<WinNavigationView
  Height="460"
  :SelectedItem="selectedItem"
  :MenuItemsSource="categories"
  :MenuItemTemplateSelector="categoryTemplateSelector"
  :Header="header"
  @SelectionChanged="NavigationView_SelectionChanged4">
  <WinNavigationViewSamplePage Page="SamplePage1" />
</WinNavigationView>`;

const footerExampleCode = `<WinNavigationView
  Height="460"
  :Header="$t('sample.navigationview.header-text')"
  :PaneDisplayMode="paneDisplayMode"
  :IsSettingsVisible="false"
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  :FooterMenuItems="footerMenuItems"
  @SelectionChanged="NavigationView_SelectionChanged9">
  <WinNavigationViewSamplePage :Page="page" />
</WinNavigationView>`;

const hierarchicalExampleCode = `<WinNavigationView
  Height="460"
  :PaneDisplayMode="paneDisplayMode"
  :SelectedItem="selectedItem"
  :MenuItems="hierarchicalMenuItems"
  @SelectionChanged="NavigationView_SelectionChanged8">
  <WinNavigationViewSamplePage :Page="page" />
</WinNavigationView>`;

const apiExampleCode = computed(() => `<WinNavigationView
  :IsSettingsVisible="${apiSettingsVisible.value}"
  IsBackButtonVisible="${apiBackVisible.value ? 'Visible' : 'Collapsed'}"
  :IsBackEnabled="${apiBackEnabled.value}"
  Header="${apiHeader.value}"
  :AlwaysShowHeader="${apiAlwaysShowHeader.value}"
  PaneTitle="${apiPaneTitle.value}"
  PaneDisplayMode="${apiPaneMode.value}"
  ExpandedModeThresholdWidth="500"
  SelectionFollowsFocus="${apiSelectionFollowsFocus.value ? 'Enabled' : 'Disabled'}"
  :MenuItems="menuItems"
  @SelectionChanged="NavigationView_SelectionChanged">
  ${apiAutoSuggestVisible.value ? `<template #AutoSuggestBox><WinAutoSuggestBox QueryIcon="Find" AutomationProperties.Name="${t('sample.navigationview.search')}" /></template>` : ''}
  ${apiPaneCustomVisible.value ? `<template #PaneCustomContent><WinHyperlinkButton Content="${t('sample.navigationview.more-info')}" /></template>` : ''}
  ${apiPaneFooterVisible.value ? '<template #PaneFooter><WinStackPanel><WinButton /><WinButton /></WinStackPanel></template>' : ''}
  <WinNavigationViewSamplePage :Page="page" />
</WinNavigationView>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; line-height: 16px; }
.gallery-page-content,
.sample-layout { width: 100%; min-width: 0; }
.nav-view-sample { width: 100%; height: 460px; }
.nav-view-api { height: 540px; margin-top: 12px; }
.api-options,
.api-pane-footer { width: 100%; }

@media (max-width: 739px) {
  .gallery-page-content > :deep(.control-example-root) { margin-top: 20px; }
  .nav-view-sample { min-width: 0; }
}
</style>
