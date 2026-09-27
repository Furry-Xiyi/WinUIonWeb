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
        <ControlExample x:Name="Example1" class="media-player-gallery-example" HeaderText="{x:Bind transportHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind transportXaml, Mode=OneWay}" CSharp="{x:Bind transportCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <MediaPlayerElement x:Name="Player1" MaxWidth="400" AreTransportControlsEnabled="True" AutoPlay="False" Source="{x:Bind Player1Source, Mode=OneWay}" Loaded="Player1_Loaded" />
          </ControlExample.Example>
          <ControlExample.Output>
            <StackPanel Spacing="8" class="media-player-output">
              <TextBlock Height="40" Text="{x:Bind Player1StatusText, Mode=OneWay}" TextWrapping="WrapWholeWords" AutomationProperties.LiveSetting="Polite" />
              <TextBlock Text="{x:Bind Player1PositionText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <TextBlock Text="{x:Bind Player1FileText, Mode=OneWay}" TextTrimming="CharacterEllipsis" ToolTipService.ToolTip="{x:Bind Player1FileText, Mode=OneWay}" />
            </StackPanel>
          </ControlExample.Output>
          <ControlExample.Options>
            <Button x:Name="OpenFileButton" AutomationProperties.Name="{x:Bind openFileAutomationName, Mode=OneWay}" Content="{x:Bind openFileLabel, Mode=OneWay}" Click="OpenFileButton_Click" />
          </ControlExample.Options>
        </ControlExample>

        <ControlExample x:Name="Example2" class="media-player-gallery-example" HeaderText="{x:Bind autoplayHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind autoplayXaml, Mode=OneWay}">
          <ControlExample.Example>
            <MediaPlayerElement x:Name="Player2" MaxWidth="400" AutoPlay="True" Source="{x:Bind Player2Source, Mode=OneWay}" Loaded="Player2_Loaded" />
          </ControlExample.Example>
          <ControlExample.Output>
            <StackPanel Spacing="8" class="media-player-output">
              <TextBlock Height="40" Text="{x:Bind Player2StatusText, Mode=OneWay}" TextWrapping="WrapWholeWords" AutomationProperties.LiveSetting="Polite" />
              <TextBlock Text="{x:Bind Player2PositionText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
            </StackPanel>
          </ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, reactive, shallowRef, type Ref } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import MediaPlayerElement from '../../components/MediaPlayerElement.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
import transportXamlSource from '../samples/MediaPlayerElement/MediaplayerelementTransportControls_xaml.txt?raw'
import transportCSharpSource from '../samples/MediaPlayerElement/MediaplayerelementTransportControls_cs.txt?raw'
import autoplayXamlSource from '../samples/MediaPlayerElement/MediaplayerelementAutoplaysVideo_xaml.txt?raw'

const transportXaml = transportXamlSource
const transportCSharp = transportCSharpSource
const autoplayXaml = autoplayXamlSource

const { t } = useI18n()
const pageTitle = t('text.mediaplayerelement')
const pageDescription = t('text.mediaplayerelement-description')
const transportHeader = t('sample.media.transport-controls')
const autoplayHeader = t('sample.media.autoplay-video')
const themeLabel = t('gallery.page-header.toggle-theme')
const openFileLabel = t('sample.media.open-file')
const openFileAutomationName = t('sample.media.open-file-automation-name')
const currentPage = inject<Ref<string | undefined>>('currentPage')
const pageKey = computed(() => currentPage?.value || 'mediaplayerelement')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteLabel = computed(() => t(isFavoriteState.value ? 'sample.navigationview.remove-favorite' : 'sample.navigationview.add-favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')

const officialGalleryMediaRoot = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia'
const Player1Source = shallowRef(`${officialGalleryMediaRoot}/ladybug.wmv`)
const Player2Source = `${officialGalleryMediaRoot}/fishes.wmv`
type PlaybackState = 'opening' | 'ready' | 'playing' | 'paused' | 'buffering' | 'ended' | 'failed'
type PlayerState = { playback: PlaybackState; position: number; duration: number; fileName: string }
const player1 = reactive<PlayerState>({ playback: 'opening', position: 0, duration: 0, fileName: '' })
const player2 = reactive<PlayerState>({ playback: 'opening', position: 0, duration: 0, fileName: '' })
const Player1StatusText = computed(() => t(`sample.media.state.${player1.playback}`))
const Player2StatusText = computed(() => t(`sample.media.state.${player2.playback}`))
const timeText = (seconds: number) => {
  const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
const positionText = (state: PlayerState) => state.duration > 0
  ? t('sample.media.position', { current: timeText(state.position), duration: timeText(state.duration) })
  : ''
const Player1PositionText = computed(() => positionText(player1))
const Player2PositionText = computed(() => positionText(player2))
const Player1FileText = computed(() => player1.fileName ? t('sample.media.selected-file', { name: player1.fileName }) : '')

type PlayerSender = { MediaPlayer: HTMLVideoElement }
const videos = new Map<PlayerState, HTMLVideoElement>()
const detachListeners = new Map<PlayerState, () => void>()
let fileInput: HTMLInputElement | null = null
let objectUrl = ''
let unloaded = false
const attachPlayer = (sender: PlayerSender, state: PlayerState) => {
  detachListeners.get(state)?.()
  const video = sender.MediaPlayer
  if (!video) return
  videos.set(state, video)
  const syncPosition = () => {
    state.position = video.currentTime || 0
    state.duration = Number.isFinite(video.duration) ? video.duration : 0
  }
  const opened = () => {
    syncPosition()
    if (state.playback !== 'playing') state.playback = video.paused ? 'ready' : 'playing'
  }
  const listeners: Record<string, EventListener> = {
    loadstart: () => { state.playback = 'opening'; state.position = 0; state.duration = 0 },
    loadedmetadata: opened,
    loadeddata: opened,
    play: () => { state.playback = 'playing' },
    playing: () => { state.playback = 'playing'; syncPosition() },
    pause: () => { if (!video.ended && state.playback !== 'failed') state.playback = 'paused'; syncPosition() },
    waiting: () => { state.playback = 'buffering' },
    canplay: () => { if (state.playback === 'buffering') state.playback = video.paused ? 'paused' : 'playing' },
    timeupdate: syncPosition,
    durationchange: syncPosition,
    ended: () => { state.playback = 'ended'; syncPosition() },
    error: () => { state.playback = 'failed' }
  }
  Object.entries(listeners).forEach(([name, handler]) => video.addEventListener(name, handler))
  detachListeners.set(state, () => Object.entries(listeners).forEach(([name, handler]) => video.removeEventListener(name, handler)))
  if (video.readyState >= 1) opened()
}
const Player1_Loaded = (sender: PlayerSender) => attachPlayer(sender, player1)
const Player2_Loaded = (sender: PlayerSender) => attachPlayer(sender, player2)

const OpenFileButton_Click = () => {
  if (unloaded) return
  if (fileInput) fileInput.onchange = null
  const pickerInput = document.createElement('input')
  fileInput = pickerInput
  pickerInput.type = 'file'
  pickerInput.onchange = () => {
    const file = pickerInput.files?.[0]
    if (!file || unloaded) return
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    objectUrl = URL.createObjectURL(file)
    player1.fileName = file.name
    player1.playback = 'opening'
    player1.position = 0
    player1.duration = 0
    Player1Source.value = objectUrl
  }
  pickerInput.click()
}

onBeforeUnmount(() => {
  unloaded = true
  videos.forEach((video) => video.pause())
  detachListeners.forEach((detach) => detach())
  detachListeners.clear()
  videos.clear()
  if (fileInput) fileInput.onchange = null
  fileInput = null
  if (objectUrl) URL.revokeObjectURL(objectUrl)
})
</script>

<style scoped>
.page-heading { position: relative; }
.media-player-output { width: 160px; height: 112px; max-width: 100%; min-width: 0; overflow: hidden; }
@media (max-width: 739px) {
  .media-player-gallery-example :deep(.example-container) { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto auto; }
  .media-player-gallery-example :deep(.example-display) { grid-column: 1; grid-row: 1; }
  .media-player-gallery-example :deep(.example-output) { grid-column: 1; grid-row: 2; width: auto; max-width: none; justify-self: stretch; margin: 0 12px 12px; }
  .media-player-gallery-example :deep(.example-options) { grid-column: 1; grid-row: 3; margin-top: 0; }
  .media-player-output { width: 100%; }
}
</style>
