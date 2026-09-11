<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.navigationview')" />
        <TextBlock class="page-description" :Text="$t('text.navigationview-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" @Click="toggleTheme"><TextBlock class="icon" Text="" /></Button>
          <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
            <TextBlock class="icon" :Text="isFavoriteState ? '\uE735' : '\uE734'" />
          </ToggleButton>
        </div>
      </div>

      <StackPanel class="gallery-page-content" Spacing="0">
        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.default-header')"
          :theme="pageTheme"
          :vue="defaultExampleCode"
          HorizontalContentAlignment="Stretch"
          :webViewHeight="250">
          <template #example>
            <Grid class="sample-layout" RowDefinitions="Auto,Auto">
              <TextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.default-description')" TextWrapping="WrapWholeWords" />
              <NavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="defaultSelectedItem"
                :MenuItems="defaultMenuItems"
                :Header="defaultHeader"
                PaneDisplayMode="Auto"
                @SelectionChanged="NavigationView_SelectionChanged5">
                <NavigationViewSamplePage :Page="defaultPage" :NavigationVersion="defaultNavigationVersion" :NavigationTransitionInfo="defaultNavigationTransitionInfo" />
              </NavigationView>
            </Grid>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.top-header')"
          :theme="pageTheme"
          :vue="topExampleCode"
          HorizontalContentAlignment="Stretch"
          :webViewHeight="200">
          <template #example>
            <Grid class="sample-layout" RowDefinitions="Auto,Auto">
              <TextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.top-description')" TextWrapping="WrapWholeWords" />
              <NavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="topSelectedItem"
                :MenuItems="topMenuItems"
                :Header="$t('sample.navigationview.header-text')"
                PaneDisplayMode="Top"
                @SelectionChanged="NavigationView_SelectionChanged6">
                <NavigationViewSamplePage :Page="topPage" :NavigationVersion="topNavigationVersion" :NavigationTransitionInfo="topNavigationTransitionInfo" />
              </NavigationView>
            </Grid>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.adaptive-header')"
          :theme="pageTheme"
          :vue="adaptiveExampleCode"
          HorizontalContentAlignment="Stretch"
          :webViewHeight="450">
          <template #example>
            <Grid class="sample-layout" RowDefinitions="Auto,Auto">
              <TextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.adaptive-description')" TextWrapping="WrapWholeWords" />
              <NavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="adaptiveSelectedItem"
                :MenuItems="adaptiveMenuItems"
                :PaneDisplayMode="adaptivePaneMode"
                @SelectionChanged="NavigationView_SelectionChanged2">
                <NavigationViewSamplePage :Page="adaptivePage" :NavigationVersion="adaptiveNavigationVersion" :NavigationTransitionInfo="adaptiveNavigationTransitionInfo" />
              </NavigationView>
            </Grid>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.tabs-header')"
          :theme="pageTheme"
          :vue="tabsExampleCode"
          :cSharp="tabsCodeBehind"
          HorizontalContentAlignment="Stretch"
          :webViewHeight="800">
          <template #example>
            <Grid class="sample-layout" RowDefinitions="Auto,Auto">
              <TextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.tabs-description')" TextWrapping="WrapWholeWords" />
              <NavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="tabsSelectedItem"
                :MenuItems="tabsMenuItems"
                PaneDisplayMode="Top"
                SelectionFollowsFocus="Enabled"
                IsBackButtonVisible="Collapsed"
                @SelectionChanged="NavigationView_SelectionChanged7">
                <NavigationViewSamplePage :Page="tabsPage" :NavigationVersion="tabsNavigationVersion" :NavigationTransitionInfo="tabsNavigationTransitionInfo" />
              </NavigationView>
            </Grid>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.data-binding-header')"
          :theme="pageTheme"
          :vue="dataBindingExampleCode"
          HorizontalContentAlignment="Stretch"
          :webViewHeight="950">
          <template #example>
            <Grid class="sample-layout" RowDefinitions="Auto,Auto">
              <TextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.data-binding-description')" TextWrapping="WrapWholeWords" />
              <NavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="dataSelectedItem"
                :MenuItemsSource="categories"
                :Header="dataHeader"
                :MenuItemTemplateSelector="categoryTemplateSelector"
                @SelectionChanged="NavigationView_SelectionChanged4">
                <NavigationViewSamplePage :Page="dataPage" :NavigationVersion="dataNavigationVersion" :NavigationTransitionInfo="dataNavigationTransitionInfo" />
              </NavigationView>
            </Grid>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.footer-header')"
          :theme="pageTheme"
          :vue="footerExampleCode"
          HorizontalContentAlignment="Stretch">
          <template #example>
            <Grid class="sample-layout" RowDefinitions="Auto,Auto">
              <TextBlock style="grid-row: 1;" Margin="0,0,0,12" :Text="$t('sample.navigationview.footer-description')" TextWrapping="WrapWholeWords" />
              <NavigationView
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
                <NavigationViewSamplePage :Page="footerPage" :NavigationVersion="footerNavigationVersion" :NavigationTransitionInfo="footerNavigationTransitionInfo" />
              </NavigationView>
            </Grid>
          </template>
          <template #options>
            <RadioButtons
              :Header="$t('sample.navigationview.pane-position')"
              :ItemsSource="footerPaneOptions"
              v-model:SelectedIndex="footerPaneIndex" />
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.hierarchical-header')"
          :theme="pageTheme"
          :vue="hierarchicalExampleCode"
          HorizontalContentAlignment="Stretch">
          <template #example>
            <Grid class="sample-layout" RowDefinitions="Auto,Auto">
              <StackPanel style="grid-row: 1;" Margin="0,0,0,15">
                <TextBlock :Text="$t('sample.navigationview.hierarchy-description-1')" TextWrapping="WrapWholeWords" />
                <TextBlock :Text="$t('sample.navigationview.hierarchy-description-2')" TextWrapping="WrapWholeWords" />
                <TextBlock :Text="$t('sample.navigationview.hierarchy-description-3')" TextWrapping="WrapWholeWords" />
                <TextBlock :Text="$t('sample.navigationview.hierarchy-description-4')" TextWrapping="WrapWholeWords" />
              </StackPanel>
              <NavigationView
                style="grid-row: 2;"
                class="nav-view-sample"
                :SelectedItem="hierarchicalSelectedItem"
                :MenuItems="hierarchicalMenuItems"
                :PaneDisplayMode="hierarchicalPaneMode"
                v-model:IsPaneOpen="hierarchicalIsPaneOpen"
                @SelectionChanged="NavigationView_SelectionChanged8">
                <NavigationViewSamplePage :Page="hierarchicalPage" :NavigationVersion="hierarchicalNavigationVersion" :NavigationTransitionInfo="hierarchicalNavigationTransitionInfo" />
              </NavigationView>
            </Grid>
          </template>
          <template #options>
            <StackPanel>
              <TextBlock Margin="0,12,0,0" :Text="$t('sample.navigationview.pane-position-property')" />
               <RadioButton GroupName="hierarchicalGroup" :Content="$t('sample.navigationview.left-mode')" :IsChecked="hierarchicalPaneMode === 'Left'" @Checked="panePositionLeft_Checked('nvSample8')" />
               <RadioButton GroupName="hierarchicalGroup" :Content="$t('sample.navigationview.top-mode')" :IsChecked="hierarchicalPaneMode === 'Top'" @Checked="panePositionTop_Checked('nvSample8')" />
               <RadioButton GroupName="hierarchicalGroup" :Content="$t('sample.navigationview.left-compact-mode')" :IsChecked="hierarchicalPaneMode === 'LeftCompact'" @Checked="panePositionLeftCompact_Checked('nvSample8')" />
            </StackPanel>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.navigationview.api-header')"
          :theme="pageTheme"
          :vue="apiExampleCode"
          HorizontalContentAlignment="Stretch"
          :webViewHeight="250">
          <template #example>
            <NavigationView
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
                <AutoSuggestBox :AutomationProperties.Name="$t('sample.navigationview.search')" QueryIcon="Find" />
              </template>
              <template v-if="apiPaneCustomVisible" #PaneCustomContent>
                <HyperlinkButton Margin="12,0" :Content="$t('sample.navigationview.more-info')" />
              </template>
              <template v-if="apiPaneFooterVisible" #PaneFooter>
                <StackPanel class="api-pane-footer" :Orientation="apiPaneMode === 'Top' ? 'Horizontal' : 'Vertical'">
                  <Button class="pane-footer-action" Style="{StaticResource SubtleButtonStyle}" :AutomationProperties.Name="$t('sample.navigationview.download')">
                    <TextBlock class="icon" Text="" />
                  </Button>
                  <Button class="pane-footer-action" Style="{StaticResource SubtleButtonStyle}" :AutomationProperties.Name="$t('sample.navigationview.favorite')">
                    <TextBlock class="icon" Text="" />
                  </Button>
                </StackPanel>
              </template>
              <NavigationViewSamplePage :Page="apiPage" :NavigationVersion="apiNavigationVersion" :NavigationTransitionInfo="apiNavigationTransitionInfo" />
            </NavigationView>
          </template>
          <template #options>
            <StackPanel class="api-options">
              <CheckBox v-model:IsChecked="apiSettingsVisible"><TextBlock :Text="$t('sample.navigationview.settings-visible')" /></CheckBox>
              <CheckBox v-model:IsChecked="apiBackVisible"><TextBlock :Text="$t('sample.navigationview.back-visible')" /></CheckBox>
              <CheckBox v-model:IsChecked="apiBackEnabled"><TextBlock :Text="$t('sample.navigationview.back-enabled')" /></CheckBox>
              <CheckBox v-model:IsChecked="apiAutoSuggestVisible"><TextBlock :Text="$t('sample.navigationview.autosuggest-visible')" /></CheckBox>
              <TextBlock Margin="0,12,0,0" :Text="$t('sample.navigationview.header-label')" />
              <TextBox v-model:Text="apiHeader" :AutomationProperties.Name="$t('sample.navigationview.header-label')" />
              <CheckBox v-model:IsChecked="apiAlwaysShowHeader"><TextBlock :Text="$t('sample.navigationview.always-show-header')" /></CheckBox>
              <TextBlock Margin="0,12,0,0" :Text="$t('sample.navigationview.pane-title-label')" />
              <TextBox v-model:Text="apiPaneTitle" :AutomationProperties.Name="$t('sample.navigationview.pane-title-label')" />
              <CheckBox v-model:IsChecked="apiPaneCustomVisible"><TextBlock :Text="$t('sample.navigationview.pane-custom-visible')" /></CheckBox>
              <CheckBox v-model:IsChecked="apiPaneFooterVisible"><TextBlock :Text="$t('sample.navigationview.pane-footer-visible')" /></CheckBox>
              <TextBlock Margin="0,12,0,0" :Text="$t('sample.navigationview.pane-position-property')" />
               <RadioButton GroupName="apiPanePosition" :Content="$t('sample.navigationview.left')" :IsChecked="apiPaneMode === 'Left'" @Checked="panePositionLeft_Checked('nvSample')" />
               <RadioButton GroupName="apiPanePosition" Margin="0,0,0,12" :Content="$t('sample.navigationview.top')" :IsChecked="apiPaneMode === 'Top'" @Checked="panePositionTop_Checked('nvSample')" />
              <CheckBox v-model:IsChecked="apiSelectionFollowsFocus"><TextBlock :Text="$t('sample.navigationview.keyboard-selection-follows-focus')" /></CheckBox>
              <CheckBox v-model:IsChecked="apiSuppressMenuItem2"><TextBlock :Text="$t('sample.navigationview.suppress-menu-item-2')" /></CheckBox>
            </StackPanel>
          </template>
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import AutoSuggestBox from '../../components/AutoSuggestBox.vue';
import Button from '../../components/Button.vue';
import CheckBox from '../../components/CheckBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import HyperlinkButton from '../../components/HyperlinkButton.vue';
import Grid from '../../components/Grid.vue';
import NavigationView from '../../components/NavigationView.vue';
import RadioButton from '../../components/RadioButton.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import TextBox from '../../components/TextBox.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import NavigationViewSamplePage from '../components/NavigationViewSamplePage.vue';
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

const defaultExampleCode = `<NavigationView
  Height="460"
  :Header="$t('sample.navigationview.header-text')"
  PaneDisplayMode="Auto"
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  @SelectionChanged="NavigationView_SelectionChanged5">
  <NavigationViewSamplePage :Page="page" />
</NavigationView>`;

const topExampleCode = `<NavigationView
  Height="460"
  :Header="$t('sample.navigationview.header-text')"
  PaneDisplayMode="Top"
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  @SelectionChanged="NavigationView_SelectionChanged6">
  <NavigationViewSamplePage :Page="page" />
</NavigationView>`;

const adaptiveExampleCode = `<NavigationView
  Height="460"
  :PaneDisplayMode="paneDisplayMode"
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  @SelectionChanged="NavigationView_SelectionChanged2">
  <NavigationViewSamplePage :Page="page" />
</NavigationView>`;

const tabsExampleCode = `<NavigationView
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
  <NavigationViewSamplePage :Page="page" />
</NavigationView>`;

const tabsCodeBehind = `const NavigationView_SelectionChanged7 = (sender, args) => {
  const page = args.SelectedItem.Tag;
  navigate(page, args.RecommendedNavigationTransitionInfo);
};`;

const dataBindingExampleCode = `<NavigationView
  Height="460"
  :SelectedItem="selectedItem"
  :MenuItemsSource="categories"
  :MenuItemTemplateSelector="categoryTemplateSelector"
  :Header="header"
  @SelectionChanged="NavigationView_SelectionChanged4">
  <NavigationViewSamplePage Page="SamplePage1" />
</NavigationView>`;

const footerExampleCode = `<NavigationView
  Height="460"
  :Header="$t('sample.navigationview.header-text')"
  :PaneDisplayMode="paneDisplayMode"
  :IsSettingsVisible="false"
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  :FooterMenuItems="footerMenuItems"
  @SelectionChanged="NavigationView_SelectionChanged9">
  <NavigationViewSamplePage :Page="page" />
</NavigationView>`;

const hierarchicalExampleCode = `<NavigationView
  Height="460"
  :PaneDisplayMode="paneDisplayMode"
  :SelectedItem="selectedItem"
  :MenuItems="hierarchicalMenuItems"
  @SelectionChanged="NavigationView_SelectionChanged8">
  <NavigationViewSamplePage :Page="page" />
</NavigationView>`;

const apiExampleCode = computed(() => `<NavigationView
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
  ${apiAutoSuggestVisible.value ? `<template #AutoSuggestBox><AutoSuggestBox QueryIcon="Find" AutomationProperties.Name="${t('sample.navigationview.search')}" /></template>` : ''}
  ${apiPaneCustomVisible.value ? `<template #PaneCustomContent><HyperlinkButton Content="${t('sample.navigationview.more-info')}" /></template>` : ''}
  ${apiPaneFooterVisible.value ? '<template #PaneFooter><StackPanel><Button /><Button /></StackPanel></template>' : ''}
  <NavigationViewSamplePage :Page="page" />
</NavigationView>`);
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
