<template>
  <Grid class="titlebar-sample-window">
    <Grid.RowDefinitions><RowDefinition Height="Auto" /><RowDefinition Height="*" /></Grid.RowDefinitions>
    <TitleBar x:Name="titleBar" Title="{x:Bind Labels.title, Mode=OneWay}" Subtitle="{x:Bind Labels.subtitle, Mode=OneWay}">
      <TitleBar.Resources><HorizontalAlignment x:Key="TitleBarContentHorizontalAlignment">Stretch</HorizontalAlignment></TitleBar.Resources>
      <TitleBar.IconSource><ImageIconSource ImageSource="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/Tiles/GalleryIcon.ico" /></TitleBar.IconSource>
      <TitleBar.Content>
        <Grid ColumnSpacing="8" HorizontalAlignment="Stretch">
          <Grid.ColumnDefinitions><ColumnDefinition Width="*" /><ColumnDefinition Width="Auto" /></Grid.ColumnDefinitions>
          <AutoSuggestBox MaxWidth="580" HorizontalAlignment="Stretch" VerticalAlignment="Center" PlaceholderText="{x:Bind Labels.search, Mode=OneWay}" QueryIcon="Find" />
          <StackPanel x:Name="RightHeaderPanel" Grid.Column="1" Orientation="Horizontal" Spacing="8" VerticalAlignment="Center">
            <ExtraButtonsOutlet />
            <Button x:Name="StatusBadge" VerticalAlignment="Center" Click="StatusBadge_Click" Content="{x:Bind Labels.status, Mode=OneWay}" Style="{StaticResource AccentButtonStyle}" />
          </StackPanel>
        </Grid>
      </TitleBar.Content>
    </TitleBar>
    <ScrollViewer Grid.Row="1" Padding="32,24">
      <StackPanel MaxWidth="640" Spacing="16">
        <TextBlock Style="{ThemeResource SubtitleTextBlockStyle}" Text="{x:Bind Labels.heading, Mode=OneWay}" />
        <TextBlock TextWrapping="WrapWholeWords" Text="{x:Bind Labels.guidance, Mode=OneWay}" />
        <TextBlock Style="{ThemeResource BodyStrongTextBlockStyle}" Text="{x:Bind Labels.badgeHeading, Mode=OneWay}" />
        <TextBlock Foreground="{ThemeResource TextFillColorSecondaryBrush}" Text="{x:Bind Labels.badgeGuidance, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <RadioButtons x:Name="BadgeIsDragRegionRadios" SelectedIndex="{x:Bind badgeDragRegionIndex, Mode=TwoWay}" SelectionChanged="BadgeIsDragRegionRadios_SelectionChanged">
          <x:String x:Uid="sample.titlebar.badge-unset" /><x:String x:Uid="sample.titlebar.badge-true" /><x:String x:Uid="sample.titlebar.badge-false" />
        </RadioButtons>
        <TextBlock Style="{ThemeResource BodyStrongTextBlockStyle}" Text="{x:Bind Labels.dynamicHeading, Mode=OneWay}" />
        <TextBlock Foreground="{ThemeResource TextFillColorSecondaryBrush}" Text="{x:Bind Labels.dynamicGuidance, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel Orientation="Horizontal" Spacing="8"><Button Click="ToggleExtraButton_Click" Content="{x:Bind Labels.toggleExtra, Mode=OneWay}" /><Button Click="RecomputeDragRegions_Click" Content="{x:Bind Labels.recompute, Mode=OneWay}" /></StackPanel>
        <TextBlock x:Name="StatusText" Foreground="{ThemeResource TextFillColorSecondaryBrush}" Text="{x:Bind statusText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <TextBlock Foreground="{ThemeResource TextFillColorSecondaryBrush}" Text="{x:Bind hostNotice, Mode=OneWay}" TextWrapping="WrapWholeWords" />
      </StackPanel>
    </ScrollViewer>
  </Grid>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onBeforeUnmount, onMounted, provide, ref, shallowReactive } from 'vue'
import AutoSuggestBox from '../../../components/AutoSuggestBox.vue'
import Button from '../../../components/Button.vue'
import ColumnDefinition from '../../../components/ColumnDefinition.vue'
import Grid from '../../../components/Grid.vue'
import RadioButtons from '../../../components/RadioButtons.vue'
import RowDefinition from '../../../components/RowDefinition.vue'
import ScrollViewer from '../../../components/ScrollViewer.vue'
import StackPanel from '../../../components/StackPanel.vue'
import TextBlock from '../../../components/TextBlock.vue'
import TitleBar from '../../../components/TitleBar.vue'
import { ImageIconSource } from '../../../components/IconSource'
import { XamlString } from '../../../components/inlineControlProperties'
import { useI18n } from '../../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../../components/xamlRuntime'
import type { SystemBackdropWindowHandle } from '../../../components/systemBackdropHostAdapter'
import { readWindowSampleState, writeWindowSampleState } from '../SystemBackdrops/mountSystemBackdropsWindow'
const HorizontalAlignment = defineComponent({ name: 'HorizontalAlignment', __xamlPrimitive: 'HorizontalAlignment', setup: () => () => null })
const props = defineProps<{ handle: SystemBackdropWindowHandle }>()
const { t } = useI18n()
const Labels = computed(() => ({ title: t('sample.titlebar.drag-title'), subtitle: t('sample.titlebar.drag-subtitle'), search: t('sample.titlebar.search'), status: t('sample.titlebar.status-badge'), heading: t('sample.titlebar.custom-drag-title'), guidance: t('sample.titlebar.drag-guidance'), badgeHeading: t('sample.titlebar.badge-heading'), badgeGuidance: t('sample.titlebar.badge-guidance'), badgeUnset: t('sample.titlebar.badge-unset'), badgeTrue: t('sample.titlebar.badge-true'), badgeFalse: t('sample.titlebar.badge-false'), dynamicHeading: t('sample.titlebar.dynamic-heading'), dynamicGuidance: t('sample.titlebar.dynamic-guidance'), toggleExtra: t('sample.titlebar.toggle-extra'), recompute: t('sample.titlebar.recompute') }))
const names = shallowReactive<Record<string, any>>({})
const restored = readWindowSampleState<{ BadgeDragRegionIndex: number; ExtraButton: boolean; StatusText: string }>()
const badgeDragRegionIndex = ref([0, 1, 2].includes(restored.BadgeDragRegionIndex as number) ? restored.BadgeDragRegionIndex as number : 0)
const statusText = ref(typeof restored.StatusText === 'string' ? restored.StatusText : ''), hostNotice = ref('')
const extraButtons = ref<Array<{ Content: string }>>(restored.ExtraButton ? [{ Content: t('sample.titlebar.extra') }] : [])
const saveState = () => writeWindowSampleState({ BadgeDragRegionIndex: badgeDragRegionIndex.value, ExtraButton: extraButtons.value.length > 0, StatusText: statusText.value })
const ExtraButtonsOutlet = defineComponent({ setup: () => () => extraButtons.value.map(item => h(Button, { Content: item.Content, VerticalAlignment: 'Center' })) })
const BadgeIsDragRegionRadios_SelectionChanged = (sender: { SelectedIndex: number }) => {
  badgeDragRegionIndex.value = sender.SelectedIndex
  if (sender.SelectedIndex === 0) names.StatusBadge?.ClearValue(TitleBar.IsDragRegionProperty)
  else TitleBar.SetIsDragRegion(names.StatusBadge, sender.SelectedIndex === 1)
  saveState()
}
const StatusBadge_Click = () => { statusText.value = t('sample.titlebar.badge-clicked'); saveState() }
const ToggleExtraButton_Click = () => { const add = !extraButtons.value.length; extraButtons.value = add ? [{ Content: t('sample.titlebar.extra') }] : []; statusText.value = t(add ? 'sample.titlebar.extra-added' : 'sample.titlebar.extra-removed'); saveState() }
const RecomputeDragRegions_Click = () => { names.titleBar?.RecomputeDragRegions(); statusText.value = t('sample.titlebar.recomputed'); saveState() }
let stop: (() => void) | undefined
onMounted(() => { stop = props.handle.Subscribe(state => { hostNotice.value = state.Reason === 'NativeBackdropUnavailable' ? t('sample.titlebar.browser-host-unavailable') : '' }) })
onBeforeUnmount(() => { saveState(); stop?.() })
provide(xamlNameScopeKey, names)
provide(xamlScopeKey, { Labels, statusText, hostNotice, badgeDragRegionIndex, BadgeIsDragRegionRadios_SelectionChanged, StatusBadge_Click, ToggleExtraButton_Click, RecomputeDragRegions_Click })
</script>

<style>
.titlebar-sample-window { width: 100%; height: 100%; min-width: 0; min-height: 0; color: var(--text-primary); }
.titlebar-sample-window .win-textblock { overflow-wrap: anywhere; }
.titlebar-sample-window .win-stack-panel { max-width: 100%; min-width: 0; }
</style>
