<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind themeLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind themeLabel, Mode=OneWay}">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind favoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteLabel, Mode=OneWay}">
            <TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" />
          </ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample
          x:Name="Example1"
          SampleDefinition="ContentDialog\BasicContentDialogContent.txt"
          HeaderText="{x:Bind basicHeader, Mode=OneWay}"
          Theme="{x:Bind pageTheme, Mode=OneWay}"
          Xaml="{x:Bind basicSample.xaml, Mode=OneWay}"
          CSharp="{x:Bind basicSample.cSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel class="contentdialog-example-row" Orientation="Horizontal">
              <Button x:Name="ShowDialog" Click="ShowDialog_Click" Content="{x:Bind showDialogText, Mode=OneWay}" />
              <TextBlock x:Name="DialogResult" Style="{StaticResource OutputTextBlockStyle}" Text="{x:Bind dialogResult, Mode=OneWay}" aria-live="polite" aria-atomic="true" />
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>

        <ControlExample
          x:Name="Example2"
          SampleDefinition="ContentDialog\ContentDialogWithoutDefault.txt"
          HeaderText="{x:Bind noDefaultHeader, Mode=OneWay}"
          Theme="{x:Bind pageTheme, Mode=OneWay}"
          Xaml="{x:Bind noDefaultSample.xaml, Mode=OneWay}"
          CSharp="{x:Bind noDefaultSample.cSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel class="contentdialog-example-row" Orientation="Horizontal">
              <Button x:Name="ShowDialogNoDefault" Click="ShowDialogNoDefault_Click" Content="{x:Bind showNoDefaultText, Mode=OneWay}" />
              <TextBlock x:Name="DialogResultNoDefault" Style="{StaticResource OutputTextBlockStyle}" Text="{x:Bind dialogResultNoDefault, Mode=OneWay}" aria-live="polite" aria-atomic="true" />
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>

      <ContentDialog
        x:Name="SaveDialog"
        Loaded="SaveDialog_Loaded"
        RequestedTheme="{x:Bind pageTheme, Mode=OneWay}"
        Style="{StaticResource DefaultContentDialogStyle}"
        Title="{x:Bind saveTitle, Mode=OneWay}"
        PrimaryButtonText="{x:Bind saveText, Mode=OneWay}"
        SecondaryButtonText="{x:Bind dontSaveText, Mode=OneWay}"
        CloseButtonText="{x:Bind cancelText, Mode=OneWay}"
        DefaultButton="Primary">
        <StackPanel HorizontalAlignment="Stretch" VerticalAlignment="Stretch">
          <TextBlock Text="{x:Bind contentText, Mode=OneWay}" TextWrapping="Wrap" />
          <CheckBox Content="{x:Bind uploadText, Mode=OneWay}" />
        </StackPanel>
      </ContentDialog>

      <ContentDialog
        x:Name="ReplaceDialog"
        Loaded="ReplaceDialog_Loaded"
        RequestedTheme="{x:Bind pageTheme, Mode=OneWay}"
        Style="{StaticResource DefaultContentDialogStyle}"
        Title="{x:Bind replaceTitle, Mode=OneWay}"
        PrimaryButtonText="{x:Bind replaceText, Mode=OneWay}"
        SecondaryButtonText="{x:Bind keepText, Mode=OneWay}"
        CloseButtonText="{x:Bind cancelText, Mode=OneWay}"
        DefaultButton="None">
        <StackPanel HorizontalAlignment="Stretch" VerticalAlignment="Stretch">
          <TextBlock Text="{x:Bind contentText, Mode=OneWay}" TextWrapping="Wrap" />
          <CheckBox Content="{x:Bind uploadText, Mode=OneWay}" />
        </StackPanel>
      </ContentDialog>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import Button from '../../components/Button.vue'
import CheckBox from '../../components/CheckBox.vue'
import ContentDialog from '../../components/ContentDialog.vue'
import ControlExample from '../../components/ControlExample.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
import basicSampleDefinition from '../samples/ContentDialog/BasicContentDialogContent.txt?raw'
import noDefaultSampleDefinition from '../samples/ContentDialog/ContentDialogWithoutDefault.txt?raw'

type DialogResult = 'Primary' | 'Secondary' | 'None'
type DialogControl = { ShowAsync: () => Promise<DialogResult> }

const parseSampleDefinition = (source: string) => {
  const sections: Record<string, string[]> = {}
  let currentSection = ''
  for (const line of source.split(/\r?\n/)) {
    const marker = line.match(/^---\s+(.+?)\s*$/)
    if (marker) {
      currentSection = marker[1].toLowerCase()
      sections[currentSection] = []
    } else if (currentSection) {
      sections[currentSection].push(line)
    }
  }
  return {
    xaml: (sections.xaml ?? []).join('\n').trim(),
    cSharp: (sections['c#'] ?? []).join('\n').trim()
  }
}

const basicSample = parseSampleDefinition(basicSampleDefinition)
const noDefaultSample = parseSampleDefinition(noDefaultSampleDefinition)
const { t } = useI18n()
const pageTitle = t('text.contentdialog')
const pageDescription = t('text.use-a-contentdialog-to-show-relevant-information')
const basicHeader = t('text.a-basic-content-dialog-with-content')
const noDefaultHeader = t('sample.contentdialog.no-default')
const showDialogText = t('text.show-dialog')
const showNoDefaultText = t('sample.contentdialog.show-no-default')
const saveTitle = t('sample.contentdialog.save-title')
const replaceTitle = t('sample.contentdialog.replace-title')
const saveText = t('sample.contentdialog.save')
const dontSaveText = t('sample.contentdialog.dont-save')
const cancelText = t('sample.contentdialog.cancel')
const replaceText = t('sample.contentdialog.replace')
const keepText = t('sample.contentdialog.keep')
const contentText = t('sample.contentdialog.body')
const uploadText = t('sample.contentdialog.upload')
const themeLabel = t('gallery.page-header.toggle-theme')
const favoriteLabel = t('gallery.page-header.favorite')
const currentPage = inject<{ value?: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'contentdialog')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')

let saveDialog: DialogControl | undefined
let replaceDialog: DialogControl | undefined
const SaveDialog_Loaded = (sender: DialogControl) => { saveDialog = sender }
const ReplaceDialog_Loaded = (sender: DialogControl) => { replaceDialog = sender }
const dialogResult = ref('')
const dialogResultNoDefault = ref('')
let dialogPending = false

const ShowDialog_Click = async () => {
  if (!saveDialog || dialogPending) return
  dialogPending = true
  try {
    const result = await saveDialog.ShowAsync()
    dialogResult.value = t(result === 'Primary'
      ? 'sample.contentdialog.saved'
      : result === 'Secondary' ? 'sample.contentdialog.not-saved' : 'sample.contentdialog.cancelled')
  } finally {
    dialogPending = false
  }
}

const ShowDialogNoDefault_Click = async () => {
  if (!replaceDialog || dialogPending) return
  dialogPending = true
  try {
    const result = await replaceDialog.ShowAsync()
    dialogResultNoDefault.value = t(result === 'Primary'
      ? 'sample.contentdialog.replaced'
      : result === 'Secondary' ? 'sample.contentdialog.kept' : 'sample.contentdialog.cancelled')
  } finally {
    dialogPending = false
  }
}
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 72px 8px 0; font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
.contentdialog-example-row { min-width: 0; max-width: 100%; }
.contentdialog-example-row > :deep(.win-btn) { max-width: 100%; white-space: normal; }
.contentdialog-example-row > :deep(.win-text-block) { min-width: 0; overflow-wrap: anywhere; }

@media (max-width: 479px) {
  .contentdialog-example-row { flex-wrap: wrap; row-gap: 12px; }
}
</style>
