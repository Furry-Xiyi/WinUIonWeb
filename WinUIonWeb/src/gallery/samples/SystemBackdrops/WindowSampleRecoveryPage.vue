<template>
  <Grid class="window-sample-recovery">
    <Grid.RowDefinitions><RowDefinition Height="32" /><RowDefinition Height="*" /></Grid.RowDefinitions>
    <TitleBar Height="32" Margin="8,0,0,0" Title="{x:Bind Labels.title, Mode=OneWay}">
      <TitleBar.IconSource><BitmapIconSource UriSource="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/Tiles/GalleryIcon.ico" ShowAsMonochrome="False" /></TitleBar.IconSource>
    </TitleBar>
    <StackPanel Grid.Row="1" MaxWidth="640" Padding="32,24" Spacing="16">
      <TextBlock Text="{x:Bind Labels.failure, Mode=OneWay}" TextWrapping="WrapWholeWords" />
      <Button Content="{x:Bind Labels.retry, Mode=OneWay}" Click="Retry_Click" HorizontalAlignment="Left" />
    </StackPanel>
  </Grid>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import Button from '../../../components/Button.vue'
import Grid from '../../../components/Grid.vue'
import RowDefinition from '../../../components/RowDefinition.vue'
import StackPanel from '../../../components/StackPanel.vue'
import TextBlock from '../../../components/TextBlock.vue'
import TitleBar from '../../../components/TitleBar.vue'
import { BitmapIconSource } from '../../../components/IconSource'
import { useI18n } from '../../../components/i18n/index'
import { xamlScopeKey } from '../../../components/xamlRuntime'
import type { WindowSampleRecoveryFailure } from './mountSystemBackdropsWindow'
const props = defineProps<{ context: WindowSampleRecoveryFailure }>()
const { t } = useI18n()
const Labels = computed(() => ({
  title: t(props.context.Kind === 'TitleBarDragRegions' ? 'sample.titlebar.drag-window-title' : props.context.Kind === 'TitleBarEndToEnd' ? 'sample.titlebar.end-window-title' : 'sample.systembackdrops.window-title'),
  failure: t('sample.systembackdrops.window-recovery-failed'), retry: t('sample.systembackdrops.retry-connection'),
}))
const Retry_Click = () => window.location.reload()
provide(xamlScopeKey, { Labels, Retry_Click })
</script>

<style>
.window-sample-recovery { width: 100%; height: 100%; color: var(--text-primary); background: var(--app-bg); }
</style>
