<template>
  <Page class="multiple-windows-sample-window" RequestedTheme="{x:Bind WindowTheme, Mode=OneWay}">
    <TextBlock HorizontalAlignment="Center" VerticalAlignment="Center" Text="{x:Bind Labels.childContent, Mode=OneWay}" />
  </Page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, shallowReactive, shallowRef } from 'vue'
import Page from '../../../components/Page.vue'
import TextBlock from '../../../components/TextBlock.vue'
import { useI18n } from '../../../components/i18n/index'
import type { SystemBackdropWindowHandle } from '../../../components/systemBackdropHostAdapter'
import { xamlNameScopeKey, xamlScopeKey } from '../../../components/xamlRuntime'

const props = defineProps<{ handle: SystemBackdropWindowHandle }>()
const { t } = useI18n()
const state = shallowRef(props.handle.State)
const unsubscribe = props.handle.Subscribe(value => { state.value = value })
const WindowTheme = computed(() => state.value.Theme)
const Labels = computed(() => ({ childContent: t('sample.multiplewindows.child-content') }))
onMounted(() => { document.title = t('sample.multiplewindows.child-window-title') })
onBeforeUnmount(unsubscribe)
provide(xamlNameScopeKey, shallowReactive({}))
provide(xamlScopeKey, { Labels, WindowTheme })
</script>

<style>
.multiple-windows-sample-window { display: grid; width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; color: var(--text-primary); }
</style>
