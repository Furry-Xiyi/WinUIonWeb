<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.infobadge')" />
        <TextBlock
          class="page-description"
          :Text="$t('sample.infobadge.description')"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button
            class="header-action"
            v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }"
            @Click="toggleTheme">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton
            class="header-action"
            :IsChecked="isFavoriteState"
            v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }"
            @update:IsChecked="toggleFavorite">
            <TextBlock class="icon" :Text="isFavoriteState ? '&#xE735;' : '&#xE734;'" />
          </ToggleButton>
        </div>
      </div>

      <StackPanel class="gallery-page-content" Spacing="0">
        <ControlExample
          class="basic-input-example-theme"
          HorizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobadge.embedded-navigationview')"
          :theme="pageTheme"
          :vue="example1Code">
          <template #example>
            <Grid
              Width="100%"
              RowDefinitions="Auto"
              HorizontalAlignment="Stretch">
              <NavigationView
                Height="300"
                :MenuItems="navigationMenuItems"
                :PaneDisplayMode="navigationPaneDisplayMode"
                :IsPaneOpen="navigationIsPaneOpen"
                HorizontalAlignment="Stretch">
                <Grid />
              </NavigationView>
            </Grid>
          </template>
          <template #options>
            <StackPanel Width="160">
              <ToggleSwitch
                v-model:IsOn="infoBadgeOpacityOn"
                :Header="$t('sample.infobadge.opacity')" />
              <ComboBox
                v-model:SelectedValue="navigationDisplayMode"
                :Header="$t('sample.infobadge.display-mode')"
                :ItemsSource="navigationDisplayModeItems"
                DisplayMemberPath="Text"
                SelectedValuePath="Value" />
            </StackPanel>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          HorizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobadge.different-styles')"
          :theme="pageTheme"
          :vue="example2Code">
          <template #example>
            <StackPanel
              HorizontalAlignment="Center"
              Orientation="Horizontal"
              Spacing="20">
              <InfoBadge
                HorizontalAlignment="Right"
                :Style="iconInfoBadgeStyle" />
              <InfoBadge
                HorizontalAlignment="Right"
                :Style="valueInfoBadgeStyle"
                :Value="10" />
              <InfoBadge
                VerticalAlignment="Center"
                :Style="dotInfoBadgeStyle" />
            </StackPanel>
          </template>
          <template #options>
            <StackPanel Width="160">
              <ComboBox
                v-model:SelectedValue="infoBadgeStyle"
                :Header="$t('sample.infobadge.styles')"
                :ItemsSource="infoBadgeStyleItems"
                DisplayMemberPath="Text"
                SelectedValuePath="Value" />
            </StackPanel>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          HorizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobadge.inside-another-control')"
          :theme="pageTheme"
          :vue="example3Code">
          <template #example>
            <Button
              Width="200"
              Height="60"
              Padding="0"
              HorizontalAlignment="Center"
              HorizontalContentAlignment="Stretch"
              VerticalContentAlignment="Stretch"
              v-bind="{ 'tooltipservice.tooltip': $t('sample.infobadge.refresh-required') }">
              <Grid
                class="badge-button-grid"
                Width="Auto"
                Height="Auto"
                HorizontalAlignment="Stretch"
                VerticalAlignment="Stretch">
                <TextBlock
                  class="sample-sync-icon icon"
                  Text="&#xE895;"
                  FontFamily="WinUIonWebIcons"
                  HorizontalTextAlignment="Center" />
                <InfoBadge
                  Background="#C42B1C"
                  HorizontalAlignment="Right"
                  VerticalAlignment="Top"
                  :IconSource="{ Glyph: '\uF13C', FontFamily: 'WinUIOnWebIcons' }" />
              </Grid>
            </Button>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          HorizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobadge.dynamic-value')"
          :theme="pageTheme"
          :vue="example4Code">
          <template #example>
            <InfoBadge HorizontalAlignment="Center" :Value="dynamicValue" />
          </template>
          <template #options>
            <StackPanel Width="160">
              <NumberBox
                v-model:Value="dynamicValue"
                :Header="$t('sample.infobadge.value')"
                :Minimum="-1"
                SpinButtonPlacementMode="Inline"
                @ValueChanged="onDynamicValueChanged" />
            </StackPanel>
          </template>
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ComboBox from '../../components/ComboBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import Grid from '../../components/Grid.vue';
import InfoBadge from '../../components/InfoBadge.vue';
import NavigationView from '../../components/NavigationView.vue';
import NumberBox from '../../components/NumberBox.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import ToggleSwitch from '../../components/ToggleSwitch.vue';
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

const example1Code = computed(() => `<Grid
  Width="100%"
  RowDefinitions="Auto"
  HorizontalAlignment="Stretch">
  <NavigationView
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
    <Grid />
  </NavigationView>
</Grid>`);

const example2Code = computed(() => `<StackPanel
  HorizontalAlignment="Center"
  Orientation="Horizontal"
  Spacing="20">
  <InfoBadge
    Style="{StaticResource ${infoBadgeStyle.value}IconInfoBadgeStyle}"
    HorizontalAlignment="Right" />
  <InfoBadge
    Style="{StaticResource ${infoBadgeStyle.value}ValueInfoBadgeStyle}"
    HorizontalAlignment="Right"
    :Value="10" />
  <InfoBadge
    Style="{StaticResource ${infoBadgeStyle.value}DotInfoBadgeStyle}"
    VerticalAlignment="Center" />
</StackPanel>`);

const example3Code = computed(() => `<Button
  Padding="0"
  Width="200"
  Height="60"
  HorizontalAlignment="Center"
  HorizontalContentAlignment="Stretch"
  VerticalContentAlignment="Stretch"
  ToolTipService.ToolTip="${t('sample.infobadge.refresh-required')}">
  <Grid
    Width="Auto"
    Height="Auto"
    HorizontalAlignment="Stretch"
    VerticalAlignment="Stretch">
    <TextBlock
      Text="&#xE895;"
      FontFamily="WinUIOnWebIcons"
      HorizontalTextAlignment="Center" />
    <InfoBadge
      Background="#C42B1C"
      HorizontalAlignment="Right"
      VerticalAlignment="Top"
      :IconSource="{ Glyph: '\\uF13C', FontFamily: 'WinUIOnWebIcons' }" />
  </Grid>
</Button>`);

const example4Code = computed(() => `<InfoBadge
  HorizontalAlignment="Center"
  :Value="dynamicValue" />

<NumberBox
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
