<template>
  <Grid class="multiple-windows-sample-window">
    <Grid.RowDefinitions><RowDefinition Height="Auto" /><RowDefinition Height="*" /></Grid.RowDefinitions>
    <TitleBar Grid.Row="0" PreferredHeightOption="Standard" IsCaptionButtonsVisible="True" CaptionButtonsFramework="Tauri" Title="{x:Bind Labels.title, Mode=OneWay}">
      <TitleBar.IconSource><BitmapIconSource UriSource="{x:Bind AppIconUri, Mode=OneWay}" ShowAsMonochrome="False" /></TitleBar.IconSource>
    </TitleBar>
    <Page Grid.Row="1" RequestedTheme="{x:Bind WindowTheme, Mode=OneWay}">
      <TextBlock HorizontalAlignment="Center" VerticalAlignment="Center" Text="{x:Bind Labels.childContent, Mode=OneWay}" />
    </Page>
  </Grid>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, shallowReactive, shallowRef } from 'vue'
import appIconUrl from '../../../assets/AppIcon.ico'
import Page from '../../../components/Page.vue'
import Grid from '../../../components/Grid.vue'
import RowDefinition from '../../../components/RowDefinition.vue'
import TextBlock from '../../../components/TextBlock.vue'
import TitleBar from '../../../components/TitleBar.vue'
import { BitmapIconSource } from '../../../components/IconSource'
import { useI18n } from '../../../components/i18n/index'
import type { SystemBackdropWindowHandle } from '../../../components/systemBackdropHostAdapter'
import { xamlNameScopeKey, xamlScopeKey } from '../../../components/xamlRuntime'

const props = defineProps<{ handle: SystemBackdropWindowHandle }>()
const { t } = useI18n()
const state = shallowRef(props.handle.State)
const unsubscribe = props.handle.Subscribe(value => { state.value = value })
const WindowTheme = computed(() => state.value.Theme)
const Labels = computed(() => ({ title: t('sample.multiplewindows.child-window-title'), childContent: t('sample.multiplewindows.child-content') }))
onMounted(() => { document.title = t('sample.multiplewindows.child-window-title') })
onBeforeUnmount(unsubscribe)
provide(xamlNameScopeKey, shallowReactive({}))
provide(xamlScopeKey, { Labels, AppIconUri: appIconUrl, WindowTheme })
</script>

<style>
.multiple-windows-sample-window { display: grid; width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; color: var(--text-primary); }
</style>
