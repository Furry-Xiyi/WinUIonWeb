<template>
  <StackPanel Padding="12">
    <TextBlock Text="{x:Bind state.Title, Mode=OneWay}" Style="{ThemeResource TitleTextBlockStyle}" />
    <TextBlock Text="{x:Bind dragDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" Style="{ThemeResource SubtitleTextBlockStyle}" />
    <TextBlock Text="{x:Bind stateDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" Style="{ThemeResource BodyTextBlockStyle}" />
    <ToggleSwitch x:Name="ControlToggle" Header="{x:Bind progressHeader, Mode=OneWay}" IsOn="{x:Bind state.IsOn, Mode=TwoWay}" Margin="0,8" />
    <ProgressRing IsActive="{x:Bind state.IsOn, Mode=OneWay}" HorizontalAlignment="Left" />
    <StackPanel Spacing="8" Margin="0,16,0,0">
      <TextBlock Text="{x:Bind WindowInfo.CapabilityOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" />
      <TextBlock Text="{x:Bind WindowInfo.SelectionOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" />
      <TextBlock Text="{x:Bind WindowInfo.OperationOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" />
    </StackPanel>
  </StackPanel>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, reactive, type Ref } from 'vue'
import ProgressRing from '../../../components/ProgressRing.vue'
import StackPanel from '../../../components/StackPanel.vue'
import TextBlock from '../../../components/TextBlock.vue'
import ToggleSwitch from '../../../components/ToggleSwitch.vue'
import { useI18n } from '../../../components/i18n/index'
import { resolveXamlValue } from '../../../components/xamlRuntime'
import { tabViewWindowSampleInfoKey, type TabViewWindowSampleInfo } from './tabViewWindowStatus'

const props = defineProps<{ DataContext?: { Title: string; IsOn: boolean } | string }>()
const instance = getCurrentInstance()
const fallback = reactive({ Title: '', IsOn: false })
const state = computed(() => resolveXamlValue(props.DataContext, instance) as typeof fallback ?? fallback)
const { t } = useI18n()
const dragDescription = computed(() => t('sample.tabview.window-drag-description'))
const stateDescription = computed(() => t('sample.tabview.window-state-description'))
const progressHeader = computed(() => t('sample.tabview.window-progress-header'))
const windowInfo = inject<Ref<TabViewWindowSampleInfo> | null>(tabViewWindowSampleInfoKey, null)
const WindowInfo = computed(() => windowInfo?.value ?? { CapabilityOutput: '', SelectionOutput: '', OperationOutput: '' })
</script>
