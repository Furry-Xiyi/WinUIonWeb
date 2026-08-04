<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.infobadge')" />
        <WinTextBlock
          class="page-description"
          :Text="$t('sample.infobadge.description')"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton
            class="header-action"
            v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }"
            @Click="toggleTheme">
            <WinTextBlock class="icon" Text="&#xE793;" />
          </WinButton>
          <WinToggleButton
            class="header-action"
            :IsChecked="isFavoriteState"
            v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }"
            @update:IsChecked="toggleFavorite">
            <WinTextBlock class="icon" :Text="isFavoriteState ? '&#xE735;' : '&#xE734;'" />
          </WinToggleButton>
        </div>
      </div>

      <WinStackPanel class="gallery-page-content" Spacing="0">
        <WinControlExample
          class="basic-input-example-theme"
          horizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobadge.embedded-navigationview')"
          :theme="pageTheme"
          :vue="example1Code">
          <template #example>
            <WinGrid
              Width="100%"
              RowDefinitions="Auto"
              HorizontalAlignment="Stretch">
              <WinNavigationView
                Height="300"
                :MenuItems="navigationMenuItems"
                :PaneDisplayMode="navigationPaneDisplayMode"
                :IsPaneOpen="navigationIsPaneOpen"
                HorizontalAlignment="Stretch">
                <WinGrid />
              </WinNavigationView>
            </WinGrid>
          </template>
          <template #options>
            <WinStackPanel Width="160">
              <WinToggleSwitch
                v-model:IsOn="infoBadgeOpacityOn"
                :Header="$t('sample.infobadge.opacity')" />
              <WinComboBox
                v-model:SelectedValue="navigationDisplayMode"
                :Header="$t('sample.infobadge.display-mode')"
                :ItemsSource="navigationDisplayModeItems"
                DisplayMemberPath="Text"
                SelectedValuePath="Value" />
            </WinStackPanel>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          horizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobadge.different-styles')"
          :theme="pageTheme"
          :vue="example2Code">
          <template #example>
            <WinStackPanel
              HorizontalAlignment="Center"
              Orientation="Horizontal"
              Spacing="20">
              <WinInfoBadge
                HorizontalAlignment="Right"
                :Style="iconInfoBadgeStyle" />
              <WinInfoBadge
                HorizontalAlignment="Right"
                :Style="valueInfoBadgeStyle"
                :Value="10" />
              <WinInfoBadge
                VerticalAlignment="Center"
                :Style="dotInfoBadgeStyle" />
            </WinStackPanel>
          </template>
          <template #options>
            <WinStackPanel Width="160">
              <WinComboBox
                v-model:SelectedValue="infoBadgeStyle"
                :Header="$t('sample.infobadge.styles')"
                :ItemsSource="infoBadgeStyleItems"
                DisplayMemberPath="Text"
                SelectedValuePath="Value" />
            </WinStackPanel>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          horizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobadge.inside-another-control')"
          :theme="pageTheme"
          :vue="example3Code">
          <template #example>
            <WinButton
              Width="200"
              Height="60"
              Padding="0"
              HorizontalAlignment="Center"
              HorizontalContentAlignment="Stretch"
              VerticalContentAlignment="Stretch"
              v-bind="{ 'tooltipservice.tooltip': $t('sample.infobadge.refresh-required') }">
              <WinGrid
                class="badge-button-grid"
                Width="Auto"
                Height="Auto"
                HorizontalAlignment="Stretch"
                VerticalAlignment="Stretch">
                <WinTextBlock
                  class="sample-sync-icon icon"
                  Text="&#xE895;"
                  FontFamily="WinUIonWebIcons"
                  HorizontalTextAlignment="Center" />
                <WinInfoBadge
                  Background="#C42B1C"
                  HorizontalAlignment="Right"
                  VerticalAlignment="Top"
                  :IconSource="{ Glyph: '\uF13C', FontFamily: 'WinUIOnWebIcons' }" />
              </WinGrid>
            </WinButton>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          horizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobadge.dynamic-value')"
          :theme="pageTheme"
          :vue="example4Code">
          <template #example>
            <WinInfoBadge HorizontalAlignment="Center" :Value="dynamicValue" />
          </template>
          <template #options>
            <WinStackPanel Width="160">
              <WinNumberBox
                v-model:Value="dynamicValue"
                :Header="$t('sample.infobadge.value')"
                :Minimum="-1"
                SpinButtonPlacementMode="Inline"
                @ValueChanged="onDynamicValueChanged" />
            </WinStackPanel>
          </template>
        </WinControlExample>
      </WinStackPanel>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinGrid from '../../components/WinGrid.vue';
import WinInfoBadge from '../../components/WinInfoBadge.vue';
import WinNavigationView from '../../components/WinNavigationView.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'infobadge');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const infoBadgeOpacityOn = ref(true);
const navigationDisplayMode = ref('LeftExpanded');
const navigationDisplayModeItems = computed(() => [
  { Text: t('sample.infobadge.left-expanded'), Value: 'LeftExpanded' },
  { Text: t('sample.infobadge.left-compact'), Value: 'LeftCompact' },
  { Text: t('sample.infobadge.top'), Value: 'Top' }
]);
const navigationPaneDisplayMode = computed(() => {
  if (navigationDisplayMode.value === 'LeftCompact') return 'LeftCompact';
  if (navigationDisplayMode.value === 'Top') return 'Top';
  return 'Left';
});
const navigationIsPaneOpen = computed(() => navigationDisplayMode.value !== 'LeftCompact');
const infoBadgeOpacity = computed(() => infoBadgeOpacityOn.value ? 1 : 0);
const navigationMenuItems = computed(() => [
  { Content: t('text.home'), Icon: '\uE80F', Tag: 'Home' },
  { Content: t('text.account'), Icon: '\uE77B', Tag: 'Account' },
  {
    Content: t('sample.infobadge.inbox'),
    Icon: '\uE715',
    Tag: 'Inbox',
    'AutomationProperties.Name': t('sample.infobadge.inbox-notifications', { value: 5 }),
    InfoBadge: {
      Value: 5,
      Opacity: infoBadgeOpacity.value
    }
  }
]);

const infoBadgeStyle = ref('Attention');
const infoBadgeStyleItems = computed(() => [
  { Text: t('sample.infobadge.attention'), Value: 'Attention' },
  { Text: t('sample.infobadge.informational'), Value: 'Informational' },
  { Text: t('sample.infobadge.success'), Value: 'Success' },
  { Text: t('sample.infobadge.critical'), Value: 'Critical' }
]);
const iconInfoBadgeStyle = computed(() => `{StaticResource ${infoBadgeStyle.value}IconInfoBadgeStyle}`);
const valueInfoBadgeStyle = computed(() => `{StaticResource ${infoBadgeStyle.value}ValueInfoBadgeStyle}`);
const dotInfoBadgeStyle = computed(() => `{StaticResource ${infoBadgeStyle.value}DotInfoBadgeStyle}`);
const dynamicValue = ref(1);

const onDynamicValueChanged = (args) => {
  if (args.NewValue < -1) {
    dynamicValue.value = -1;
  }
};

const example1Code = computed(() => `<WinGrid
  Width="100%"
  RowDefinitions="Auto"
  HorizontalAlignment="Stretch">
  <WinNavigationView
    Height="300"
    PaneDisplayMode="${navigationPaneDisplayMode.value}"
    :IsPaneOpen="${navigationIsPaneOpen.value}"
    :MenuItems="[
      { Content: '${t('text.home')}', Icon: '\\uE80F', Tag: 'Home' },
      { Content: '${t('text.account')}', Icon: '\\uE77B', Tag: 'Account' },
      {
        Content: '${t('sample.infobadge.inbox')}',
        Icon: '\\uE715',
        Tag: 'Inbox',
         'AutomationProperties.Name': '${t('sample.infobadge.inbox-notifications', { value: 5 })}',
         InfoBadge: { Value: 5, Opacity: ${infoBadgeOpacity.value} }
       }
     ]"
     HorizontalAlignment="Stretch">
    <WinGrid />
  </WinNavigationView>
</WinGrid>`);

const example2Code = computed(() => `<WinStackPanel
  HorizontalAlignment="Center"
  Orientation="Horizontal"
  Spacing="20">
  <WinInfoBadge
    Style="{StaticResource ${infoBadgeStyle.value}IconInfoBadgeStyle}"
    HorizontalAlignment="Right" />
  <WinInfoBadge
    Style="{StaticResource ${infoBadgeStyle.value}ValueInfoBadgeStyle}"
    HorizontalAlignment="Right"
    :Value="10" />
  <WinInfoBadge
    Style="{StaticResource ${infoBadgeStyle.value}DotInfoBadgeStyle}"
    VerticalAlignment="Center" />
</WinStackPanel>`);

const example3Code = computed(() => `<WinButton
  Padding="0"
  Width="200"
  Height="60"
  HorizontalAlignment="Center"
  HorizontalContentAlignment="Stretch"
  VerticalContentAlignment="Stretch"
  ToolTipService.ToolTip="${t('sample.infobadge.refresh-required')}">
  <WinGrid
    Width="Auto"
    Height="Auto"
    HorizontalAlignment="Stretch"
    VerticalAlignment="Stretch">
    <WinTextBlock
      Text="&#xE895;"
      FontFamily="WinUIOnWebIcons"
      HorizontalTextAlignment="Center" />
    <WinInfoBadge
      Background="#C42B1C"
      HorizontalAlignment="Right"
      VerticalAlignment="Top"
      :IconSource="{ Glyph: '\\uF13C', FontFamily: 'WinUIOnWebIcons' }" />
  </WinGrid>
</WinButton>`);

const example4Code = computed(() => `<WinInfoBadge
  HorizontalAlignment="Center"
  :Value="dynamicValue" />

<WinNumberBox
  v-model:Value="dynamicValue"
  Header="${t('sample.infobadge.value')}"
  :Minimum="-1"
  SpinButtonPlacementMode="Inline"
  @ValueChanged="onDynamicValueChanged" />`);
</script>

<style scoped>
.page-heading {
  position: relative;
}

.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-primary);
}

.page-description {
  color: var(--text-secondary);
  margin: 0 72px 16px 0;
  line-height: 20px;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
}

.icon {
  font-size: 16px;
}

:deep(.example-display > .example-theme-wrapper > .win-stack-panel),
:deep(.example-display > .example-theme-wrapper > .win-btn),
:deep(.example-display > .example-theme-wrapper > .win-infobadge) {
  margin-inline: auto;
}

.badge-button-grid :deep(.sample-sync-icon) {
  align-self: center;
  justify-self: center;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  font-size: 20px;
  line-height: 20px;
  color: var(--text-primary);
}

.badge-button-grid {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  grid-auto-flow: initial;
  align-self: stretch;
}

.badge-button-grid > * {
  grid-column: 1;
  grid-row: 1;
}

</style>
