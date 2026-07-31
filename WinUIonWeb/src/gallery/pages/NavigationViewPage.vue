<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.navigationview')" />
        <WinTextBlock
          class="page-description"
          :Text="$t('text.navigationview-description')"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton
            class="header-action"
            v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }"
            :aria-label="$t('sample.navigationview.change-theme')"
            @Click="toggleTheme">
            <WinTextBlock class="icon" Text="" />
          </WinButton>
          <WinToggleButton
            v-model:IsChecked="isFavoriteState"
            class="header-action"
            v-bind="{ 'tooltipservice.tooltip': favoriteActionLabel }"
            :aria-label="favoriteActionLabel"
            @update:IsChecked="toggleFavorite">
            <WinTextBlock class="icon" :Text="isFavoriteState ? '' : ''" />
          </WinToggleButton>
        </div>
      </div>

      <WinStackPanel class="gallery-page-content">
        <WinControlExample
          :headerText="$t('sample.navigationview.default-header')"
          :theme="pageTheme"
          :vue="example1Code"
          horizontalContentAlignment="Stretch"
          :webViewHeight="250">
          <template #example>
            <WinStackPanel class="sample-layout" Spacing="12">
              <WinTextBlock
                class="sample-description"
                :Text="$t('sample.navigationview.default-description')"
                TextWrapping="WrapWholeWords" />
              <WinNavigationView
                class="nav-view-sample"
                :SelectedItem="defaultSelectedItem"
                :MenuItems="defaultMenuItems"
                :Header="defaultContentTitle"
                PaneDisplayMode="Auto"
                @SelectionChanged="defaultSelectedItem = $event.SelectedItem">
                <WinStackPanel class="nav-frame-content" Padding="24">
                  <WinTextBlock class="nav-content-title" :Text="defaultContentTitle" />
                </WinStackPanel>
              </WinNavigationView>
            </WinStackPanel>
          </template>
        </WinControlExample>

        <WinControlExample
          :headerText="$t('sample.navigationview.top-header')"
          :theme="pageTheme"
          :vue="example2Code"
          horizontalContentAlignment="Stretch"
          :webViewHeight="200">
          <template #example>
            <WinStackPanel class="sample-layout" Spacing="12">
              <WinTextBlock
                class="sample-description"
                :Text="$t('sample.navigationview.top-description')"
                TextWrapping="WrapWholeWords" />
              <WinNavigationView
                class="nav-view-sample"
                :SelectedItem="topSelectedItem"
                :MenuItems="topMenuItems"
                :Header="$t('sample.navigationview.header-text')"
                PaneDisplayMode="Top"
                @SelectionChanged="topSelectedItem = $event.SelectedItem">
                <WinStackPanel class="nav-frame-content" Padding="24">
                  <WinTextBlock class="nav-content-title" :Text="topContentTitle" />
                </WinStackPanel>
              </WinNavigationView>
            </WinStackPanel>
          </template>
        </WinControlExample>

        <WinControlExample
          :headerText="$t('sample.navigationview.adaptive-header')"
          :theme="pageTheme"
          :vue="example3Code"
          horizontalContentAlignment="Stretch"
          :webViewHeight="450">
          <template #example>
            <WinStackPanel ref="adaptiveHostRef" class="sample-layout" Spacing="12">
              <WinTextBlock
                class="sample-description"
                :Text="$t('sample.navigationview.adaptive-description')"
                TextWrapping="WrapWholeWords" />
              <WinNavigationView
                class="nav-view-sample"
                :SelectedItem="adaptiveSelectedItem"
                :MenuItems="adaptiveMenuItems"
                :PaneDisplayMode="adaptivePaneMode"
                :IsPaneOpen="false"
                @SelectionChanged="adaptiveSelectedItem = $event.SelectedItem">
                <WinStackPanel class="nav-frame-content" Padding="24">
                  <WinTextBlock class="nav-content-title" :Text="adaptiveContentTitle" />
                </WinStackPanel>
              </WinNavigationView>
            </WinStackPanel>
          </template>
        </WinControlExample>

        <WinControlExample
          :headerText="$t('sample.navigationview.tabs-header')"
          :theme="pageTheme"
          :vue="example4Code"
          horizontalContentAlignment="Stretch"
          :webViewHeight="800">
          <template #example>
            <WinStackPanel class="sample-layout" Spacing="12">
              <WinTextBlock
                class="sample-description"
                :Text="$t('sample.navigationview.tabs-description')"
                TextWrapping="WrapWholeWords" />
              <WinNavigationView
                class="nav-view-sample"
                :SelectedItem="tabsSelectedItem"
                :MenuItems="tabsMenuItems"
                PaneDisplayMode="Top"
                IsBackButtonVisible="Collapsed"
                SelectionFollowsFocus="Enabled"
                @SelectionChanged="tabsSelectedItem = $event.SelectedItem">
                <WinStackPanel class="nav-frame-content" Padding="24">
                  <WinTextBlock class="nav-content-title" :Text="tabsContentTitle" />
                </WinStackPanel>
              </WinNavigationView>
            </WinStackPanel>
          </template>
        </WinControlExample>

        <WinControlExample
          :headerText="$t('sample.navigationview.data-binding-header')"
          :theme="pageTheme"
          :vue="example5Code"
          horizontalContentAlignment="Stretch"
          :webViewHeight="950">
          <template #example>
            <WinStackPanel class="sample-layout" Spacing="12">
              <WinTextBlock
                class="sample-description"
                :Text="$t('sample.navigationview.data-binding-description')"
                TextWrapping="WrapWholeWords" />
              <WinNavigationView
                class="nav-view-sample"
                :SelectedItem="dataSelectedItem"
                :MenuItemsSource="categories"
                :Header="dataContentTitle"
                @SelectionChanged="dataSelectedItem = $event.SelectedItem">
                <WinStackPanel class="nav-frame-content" Padding="24">
                  <WinTextBlock class="nav-content-title" :Text="dataContentTitle" />
                </WinStackPanel>
              </WinNavigationView>
            </WinStackPanel>
          </template>
        </WinControlExample>

        <WinControlExample
          :headerText="$t('sample.navigationview.footer-header')"
          :theme="pageTheme"
          :vue="example6Code"
          horizontalContentAlignment="Stretch">
          <template #example>
            <WinStackPanel class="sample-layout" Spacing="12">
              <WinTextBlock
                class="sample-description"
                :Text="$t('sample.navigationview.footer-description')"
                TextWrapping="WrapWholeWords" />
              <WinNavigationView
                class="nav-view-sample"
                :SelectedItem="footerSelectedItem"
                :MenuItems="footerMenuItems"
                :FooterMenuItems="footerBottomItems"
                :Header="$t('sample.navigationview.header-text')"
                :PaneDisplayMode="footerPaneMode"
                :IsSettingsVisible="false"
                @SelectionChanged="footerSelectedItem = $event.SelectedItem">
                <WinStackPanel class="nav-frame-content" Padding="24">
                  <WinTextBlock class="nav-content-title" :Text="footerContentTitle" />
                </WinStackPanel>
              </WinNavigationView>
            </WinStackPanel>
          </template>
          <template #options>
            <WinRadioButtons
              :Header="$t('sample.navigationview.pane-position')"
              :ItemsSource="footerPaneOptions"
              v-model:SelectedIndex="footerPaneIndex" />
          </template>
        </WinControlExample>

        <WinControlExample
          :headerText="$t('sample.navigationview.hierarchical-header')"
          :theme="pageTheme"
          :vue="example7Code"
          horizontalContentAlignment="Stretch">
          <template #example>
            <WinStackPanel class="sample-layout" Spacing="12">
              <WinStackPanel Spacing="8">
                <WinTextBlock
                  :Text="$t('sample.navigationview.hierarchy-description-1')"
                  TextWrapping="WrapWholeWords" />
                <WinTextBlock
                  :Text="$t('sample.navigationview.hierarchy-description-2')"
                  TextWrapping="WrapWholeWords" />
                <WinTextBlock
                  :Text="$t('sample.navigationview.hierarchy-description-3')"
                  TextWrapping="WrapWholeWords" />
                <WinTextBlock
                  :Text="$t('sample.navigationview.hierarchy-description-4')"
                  TextWrapping="WrapWholeWords" />
              </WinStackPanel>
              <WinNavigationView
                class="nav-view-sample"
                :SelectedItem="hierarchicalSelectedItem"
                :MenuItems="hierarchicalMenuItems"
                :Header="hierarchicalContentTitle"
                :PaneDisplayMode="hierarchicalPaneMode"
                :IsPaneOpen="hierarchicalPaneMode === 'Left'"
                @SelectionChanged="hierarchicalSelectedItem = $event.SelectedItem">
                <WinStackPanel class="nav-frame-content" Padding="24">
                  <WinTextBlock class="nav-content-title" :Text="hierarchicalContentTitle" />
                </WinStackPanel>
              </WinNavigationView>
            </WinStackPanel>
          </template>
          <template #options>
            <WinRadioButtons
              :Header="$t('sample.navigationview.pane-position')"
              :ItemsSource="hierarchicalPaneOptions"
              v-model:SelectedIndex="hierarchicalPaneIndex" />
          </template>
        </WinControlExample>

        <WinControlExample
          :headerText="$t('sample.navigationview.api-header')"
          :theme="pageTheme"
          :vue="example8Code"
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
              :IsPaneOpen="apiPaneMode === 'Left'"
              :SelectionFollowsFocus="apiSelectionFollowsFocus ? 'Enabled' : 'Disabled'"
              :ExpandedModeThresholdWidth="500"
              @SelectionChanged="onApiSelectionChanged">
              <template v-if="apiAutoSuggestVisible" #AutoSuggestBox>
                <WinAutoSuggestBox
                  QueryIcon="Find"
                  :PlaceholderText="$t('sample.navigationview.search')" />
              </template>
              <template v-if="apiPaneCustomVisible" #PaneCustomContent>
                <WinHyperlinkButton Margin="12,0">
                  <WinTextBlock :Text="$t('sample.navigationview.more-info')" />
                </WinHyperlinkButton>
              </template>
              <template v-if="apiPaneFooterVisible" #PaneFooter>
                <WinStackPanel
                  class="api-pane-footer"
                  :Orientation="apiPaneMode === 'Top' ? 'Horizontal' : 'Vertical'"
                  Spacing="4">
                  <WinButton
                    class="pane-footer-action"
                    Style="{StaticResource SubtleButtonStyle}"
                    v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.download') }"
                    :aria-label="$t('sample.navigationview.download')">
                    <WinTextBlock class="icon" Text="" />
                  </WinButton>
                  <WinButton
                    class="pane-footer-action"
                    Style="{StaticResource SubtleButtonStyle}"
                    v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.favorite') }"
                    :aria-label="$t('sample.navigationview.favorite')">
                    <WinTextBlock class="icon" Text="" />
                  </WinButton>
                </WinStackPanel>
              </template>
              <WinStackPanel class="nav-frame-content" Padding="24">
                <WinTextBlock class="nav-content-title" :Text="apiContentTitle" />
              </WinStackPanel>
            </WinNavigationView>
          </template>
          <template #options>
            <WinStackPanel class="api-options" Spacing="8">
              <WinCheckBox v-model:IsChecked="apiSettingsVisible">
                <WinTextBlock :Text="$t('sample.navigationview.settings-visible')" />
              </WinCheckBox>
              <WinCheckBox v-model:IsChecked="apiBackVisible">
                <WinTextBlock :Text="$t('sample.navigationview.back-visible')" />
              </WinCheckBox>
              <WinCheckBox v-model:IsChecked="apiBackEnabled">
                <WinTextBlock :Text="$t('sample.navigationview.back-enabled')" />
              </WinCheckBox>
              <WinCheckBox v-model:IsChecked="apiAutoSuggestVisible">
                <WinTextBlock :Text="$t('sample.navigationview.autosuggest-visible')" />
              </WinCheckBox>

              <WinTextBox v-model:Text="apiHeader" Margin="0,4,0,0">
                <template #header>
                  <WinTextBlock :Text="$t('sample.navigationview.header-label')" />
                </template>
              </WinTextBox>
              <WinCheckBox v-model:IsChecked="apiAlwaysShowHeader">
                <WinTextBlock :Text="$t('sample.navigationview.always-show-header')" />
              </WinCheckBox>

              <WinTextBox v-model:Text="apiPaneTitle" Margin="0,4,0,0">
                <template #header>
                  <WinTextBlock :Text="$t('sample.navigationview.pane-title-label')" />
                </template>
              </WinTextBox>
              <WinCheckBox v-model:IsChecked="apiPaneCustomVisible">
                <WinTextBlock :Text="$t('sample.navigationview.pane-custom-visible')" />
              </WinCheckBox>
              <WinCheckBox v-model:IsChecked="apiPaneFooterVisible">
                <WinTextBlock :Text="$t('sample.navigationview.pane-footer-visible')" />
              </WinCheckBox>

              <WinRadioButtons
                Margin="0,4,0,0"
                :Header="$t('sample.navigationview.pane-position')"
                :ItemsSource="apiPaneOptions"
                v-model:SelectedIndex="apiPaneIndex" />

              <WinCheckBox v-model:IsChecked="apiSelectionFollowsFocus">
                <WinTextBlock :Text="$t('sample.navigationview.keyboard-selection-follows-focus')" />
              </WinCheckBox>
              <WinCheckBox v-model:IsChecked="apiSuppressMenuItem2">
                <WinTextBlock :Text="$t('sample.navigationview.suppress-menu-item-2')" />
              </WinCheckBox>
            </WinStackPanel>
          </template>
        </WinControlExample>
      </WinStackPanel>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import WinAutoSuggestBox from '../../components/WinAutoSuggestBox.vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinHyperlinkButton from '../../components/WinHyperlinkButton.vue';
import WinNavigationView from '../../components/WinNavigationView.vue';
import WinRadioButtons from '../../components/WinRadioButtons.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinTextBox from '../../components/WinTextBox.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'navigationview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const favoriteActionLabel = computed(() => t(
  isFavoriteState.value
    ? 'sample.navigationview.remove-favorite'
    : 'sample.navigationview.add-favorite'
));

const menuItem = (number, icon = '') => ({
  Content: t(`sample.navigationview.menu-item-${number}`),
  Icon: icon,
  Tag: `SamplePage${number}`
});

const baseMenuItems = (withIcons = true) => [
  menuItem(1, withIcons ? '\uE768' : ''),
  menuItem(2, withIcons ? '\uE74E' : ''),
  menuItem(3, withIcons ? '\uE72C' : ''),
  menuItem(4, withIcons ? '\uE896' : '')
];

const selectedPageTitle = (selectedItem) => {
  if (selectedItem?.IsSettingsItem || selectedItem?.Tag === 'settings') {
    return t('text.settings');
  }
  const identity = selectedItem?.Tag ?? selectedItem?.Name ?? '';
  const pageNumber = String(identity).match(/(\d+)$/)?.[1];
  return pageNumber
    ? t('sample.navigationview.sample-page', { number: pageNumber })
    : (selectedItem?.Content ?? selectedItem?.Name ?? '');
};

const contentTitleFor = selectedItem => computed(() => selectedPageTitle(selectedItem.value));

const defaultMenuItems = baseMenuItems(true);
const defaultSelectedItem = ref(defaultMenuItems[0]);
const defaultContentTitle = contentTitleFor(defaultSelectedItem);

const topMenuItems = baseMenuItems(false);
const topSelectedItem = ref(topMenuItems[0]);
const topContentTitle = contentTitleFor(topSelectedItem);

const adaptiveMenuItems = baseMenuItems(false);
const adaptiveSelectedItem = ref(adaptiveMenuItems[0]);
const adaptiveContentTitle = contentTitleFor(adaptiveSelectedItem);
const adaptivePaneMode = ref('LeftMinimal');
const adaptiveHostRef = ref(null);
let adaptiveObserver = null;

const updateAdaptivePaneMode = (width) => {
  adaptivePaneMode.value = width >= 641 ? 'Top' : 'LeftMinimal';
};

onMounted(() => {
  const host = adaptiveHostRef.value?.$el ?? adaptiveHostRef.value;
  if (!host) return;
  updateAdaptivePaneMode(host.getBoundingClientRect().width);
  if (typeof ResizeObserver === 'undefined') return;
  adaptiveObserver = new ResizeObserver(([entry]) => {
    updateAdaptivePaneMode(entry.contentRect.width);
  });
  adaptiveObserver.observe(host);
});

onBeforeUnmount(() => {
  adaptiveObserver?.disconnect();
});

const tabsMenuItems = [1, 2, 3, 4].map(number => ({
  Content: t(`sample.navigationview.item-${number}`),
  Tag: `SamplePage${number}`
}));
const tabsSelectedItem = ref(tabsMenuItems[0]);
const tabsContentTitle = contentTitleFor(tabsSelectedItem);

const categories = [1, 2, 3, 4].map((number) => ({
  Name: t('sample.navigationview.category', { number }),
  Glyph: ['\uE80F', '\uE765', '\uE8F1', '\uE715'][number - 1],
  Tooltip: t('sample.navigationview.category-tooltip', { number })
}));
const dataSelectedItem = ref(categories[0]);
const dataContentTitle = contentTitleFor(dataSelectedItem);

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
const footerContentTitle = contentTitleFor(footerSelectedItem);
const footerPaneMode = ref('Left');
const footerPaneIndex = computed({
  get: () => footerPaneMode.value === 'Left' ? 0 : 1,
  set: value => { footerPaneMode.value = value === 0 ? 'Left' : 'Top'; }
});
const footerPaneOptions = [
  { Text: t('sample.navigationview.left-mode'), Value: 'Left' },
  { Text: t('sample.navigationview.top-mode'), Value: 'Top' }
];

const hierarchicalMenuItems = [
  {
    Content: t('sample.navigationview.home'),
    Icon: '\uE80F',
    Tag: 'SamplePage1',
    ToolTip: t('sample.navigationview.home')
  },
  {
    Content: t('sample.navigationview.account'),
    Icon: '\uE77B',
    Tag: 'SamplePage2',
    ToolTip: t('sample.navigationview.account'),
    MenuItems: [
      {
        Content: t('sample.navigationview.mail'),
        Icon: '\uE715',
        Tag: 'SamplePage3',
        ToolTip: t('sample.navigationview.mail')
      },
      {
        Content: t('sample.navigationview.calendar'),
        Icon: '\uE787',
        Tag: 'SamplePage4',
        ToolTip: t('sample.navigationview.calendar')
      }
    ]
  },
  {
    Content: t('sample.navigationview.document-options'),
    Icon: '\uE8A5',
    SelectsOnInvoked: false,
    ToolTip: t('sample.navigationview.document-options'),
    MenuItems: [
      {
        Content: t('sample.navigationview.create-new'),
        Icon: '\uE8F4',
        Tag: 'SamplePage5',
        ToolTip: t('sample.navigationview.create-new')
      },
      {
        Content: t('sample.navigationview.upload-file'),
        Icon: '\uE8E5',
        Tag: 'SamplePage6',
        ToolTip: t('sample.navigationview.upload-file')
      }
    ]
  }
];
const hierarchicalSelectedItem = ref(hierarchicalMenuItems[0]);
const hierarchicalContentTitle = contentTitleFor(hierarchicalSelectedItem);
const hierarchicalPaneMode = ref('Left');
const hierarchicalPaneIndex = computed({
  get: () => ({ Left: 0, Top: 1, LeftCompact: 2 })[hierarchicalPaneMode.value],
  set: value => {
    hierarchicalPaneMode.value = ['Left', 'Top', 'LeftCompact'][value] ?? 'Left';
  }
});
const hierarchicalPaneOptions = [
  { Text: t('sample.navigationview.left-mode'), Value: 'Left' },
  { Text: t('sample.navigationview.top-mode'), Value: 'Top' },
  { Text: t('sample.navigationview.left-compact-mode'), Value: 'LeftCompact' }
];

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
const apiSelectionFollowsFocus = ref(false);
const apiSuppressMenuItem2 = ref(false);
const apiMenuItems = computed(() => [
  menuItem(1, '\uE768'),
  {
    Type: 'Header',
    Content: t('sample.navigationview.actions')
  },
  {
    ...menuItem(2, '\uE74E'),
    SelectsOnInvoked: !apiSuppressMenuItem2.value
  },
  menuItem(3, '\uE72C')
]);
const apiSelectedItem = ref(apiMenuItems.value[0]);
const apiContentTitle = contentTitleFor(apiSelectedItem);
const apiPaneIndex = computed({
  get: () => apiPaneMode.value === 'Left' ? 0 : 1,
  set: value => { apiPaneMode.value = value === 0 ? 'Left' : 'Top'; }
});
const apiPaneOptions = [
  { Text: t('sample.navigationview.left'), Value: 'Left' },
  { Text: t('sample.navigationview.top'), Value: 'Top' }
];

const onApiSelectionChanged = (args) => {
  apiSelectedItem.value = args.SelectedItem;
  if (!args.IsSettingsSelected) {
    apiHeader.value = selectedPageTitle(args.SelectedItem);
  }
};

const example1Code = `<WinNavigationView
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  :Header="contentTitle"
  PaneDisplayMode="Auto"
  @SelectionChanged="onSelectionChanged">
  <WinTextBlock :Text="contentTitle" />
</WinNavigationView>`;

const example2Code = `<WinNavigationView
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  :Header="$t('sample.navigationview.header-text')"
  PaneDisplayMode="Top"
  @SelectionChanged="onSelectionChanged">
  <WinTextBlock :Text="contentTitle" />
</WinNavigationView>`;

const example3Code = `<WinNavigationView
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  :PaneDisplayMode="paneDisplayMode"
  :IsPaneOpen="false"
  @SelectionChanged="onSelectionChanged">
  <WinTextBlock :Text="contentTitle" />
</WinNavigationView>`;

const example4Code = `<WinNavigationView
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  PaneDisplayMode="Top"
  SelectionFollowsFocus="Enabled"
  IsBackButtonVisible="Collapsed"
  @SelectionChanged="onSelectionChanged">
  <WinTextBlock :Text="contentTitle" />
</WinNavigationView>`;

const example5Code = `<WinNavigationView
  :SelectedItem="selectedItem"
  :MenuItemsSource="categories"
  :Header="contentTitle"
  @SelectionChanged="onSelectionChanged">
  <WinTextBlock :Text="contentTitle" />
</WinNavigationView>`;

const example6Code = `<WinNavigationView
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  :FooterMenuItems="footerMenuItems"
  :Header="$t('sample.navigationview.header-text')"
  :PaneDisplayMode="paneDisplayMode"
  :IsSettingsVisible="false"
  @SelectionChanged="onSelectionChanged">
  <WinTextBlock :Text="contentTitle" />
</WinNavigationView>`;

const example7Code = `<WinNavigationView
  :SelectedItem="selectedItem"
  :MenuItems="hierarchicalMenuItems"
  :PaneDisplayMode="paneDisplayMode"
  @SelectionChanged="onSelectionChanged">
  <WinTextBlock :Text="contentTitle" />
</WinNavigationView>`;

const example8Code = `<WinNavigationView
  :SelectedItem="selectedItem"
  :MenuItems="menuItems"
  :IsSettingsVisible="isSettingsVisible"
  :IsBackButtonVisible="isBackButtonVisible"
  :IsBackEnabled="isBackEnabled"
  :Header="header"
  :AlwaysShowHeader="alwaysShowHeader"
  :PaneTitle="paneTitle"
  :PaneDisplayMode="paneDisplayMode"
  :SelectionFollowsFocus="selectionFollowsFocus"
  @SelectionChanged="onSelectionChanged">
  <template #AutoSuggestBox>
    <WinAutoSuggestBox QueryIcon="Find" />
  </template>
  <template #PaneCustomContent>
    <WinHyperlinkButton>
      <WinTextBlock :Text="$t('sample.navigationview.more-info')" />
    </WinHyperlinkButton>
  </template>
  <WinTextBlock :Text="contentTitle" />
</WinNavigationView>`;
</script>

<style scoped>
.page-heading {
  position: relative;
}

.page-header {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 600;
}

.page-description {
  margin: 0 72px 16px 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
}

.header-action {
  width: 32px;
  height: 32px;
  min-width: 0;
  padding: 0;
}

.icon {
  font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets";
  font-size: 16px;
  line-height: 16px;
}

.gallery-page-content,
.sample-layout {
  width: 100%;
  min-width: 0;
}

.sample-description {
  width: 100%;
  margin: 0;
}

.nav-view-sample {
  width: 100%;
  height: 460px;
  border: 1px solid var(--ctrl-border-rest);
  border-radius: 4px;
}

.nav-view-api {
  height: 540px;
  margin-top: 12px;
}

.nav-frame-content {
  width: 100%;
  box-sizing: border-box;
}

.nav-content-title {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.api-options {
  width: 100%;
}

.api-pane-footer {
  width: 100%;
}

.pane-footer-action {
  width: 40px;
  height: 36px;
  min-width: 0;
  padding: 0;
}
</style>
