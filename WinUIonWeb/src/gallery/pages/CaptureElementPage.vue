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
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind favoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteLabel, Mode=OneWay}">
            <TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" />
          </ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" class="capture-gallery-example" HeaderText="{x:Bind exampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind captureXaml, Mode=OneWay}" CSharp="{x:Bind captureCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <ScrollViewer class="capture-display-boundary" Height="300" HorizontalScrollMode="Enabled" HorizontalScrollBarVisibility="Auto" VerticalScrollMode="Disabled" VerticalScrollBarVisibility="Disabled">
              <Grid class="capture-preview-grid" MinWidth="400" MinHeight="300" RowSpacing="10" ColumnSpacing="4">
                <Grid.RowDefinitions>
                  <RowDefinition Height="Auto" />
                  <RowDefinition Height="*" />
                </Grid.RowDefinitions>
                <Grid.ColumnDefinitions>
                  <ColumnDefinition Width="*" />
                  <ColumnDefinition Width="100" />
                </Grid.ColumnDefinitions>
                <TextBlock x:Name="frameSourceName" Grid.Row="0" Grid.Column="0" VerticalAlignment="Center" Text="{x:Bind frameSourceText, Mode=OneWay}" TextTrimming="CharacterEllipsis" />
                <Grid class="capture-preview-host" Grid.Row="1" Grid.Column="0">
                  <MediaPlayerElement x:Name="captureElement" class="capture-live-preview" AutoPlay="True" Stretch="Uniform" Source="{x:Bind mediaCapture, Mode=OneWay}" RenderTransform="{x:Bind mirrorTransform, Mode=OneWay}" RenderTransformOrigin="0.5,0.5" Loaded="CaptureElement_Loaded" />
                  <Button x:Name="switchCameraButton" class="capture-camera-switch" Width="32" Height="32" MinWidth="32" Padding="0" Margin="8" HorizontalAlignment="Right" VerticalAlignment="Top" HorizontalContentAlignment="Center" VerticalContentAlignment="Center" Click="SwitchCamera_Click" Visibility="{x:Bind cameraSwitchVisibility, Mode=OneWay}" IsEnabled="{x:Bind canSwitchCamera, Mode=OneWay}" AutomationProperties.Name="{x:Bind switchCameraLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind switchCameraLabel, Mode=OneWay}">
                    <FontIcon Glyph="&#xE89E;" FontSize="16" Width="16" Height="16" HorizontalAlignment="Center" VerticalAlignment="Center" />
                  </Button>
                </Grid>
                <TextBlock x:Name="capturedText" Grid.Row="0" Grid.Column="1" VerticalAlignment="Center" Text="{x:Bind capturedLabel, Mode=OneWay}" Visibility="{x:Bind capturedVisibility, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <Grid x:Name="captureContainer" class="capture-container" Grid.Row="1" Grid.Column="1">
                  <Grid class="capture-expand-to-fill">
                    <ScrollViewer class="capture-snapshots-scroll" VerticalScrollMode="Enabled" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Disabled" HorizontalScrollBarVisibility="Disabled">
                      <StackPanel x:Name="snapshots" class="capture-snapshots" Spacing="2">
                        <SnapshotImages />
                      </StackPanel>
                    </ScrollViewer>
                  </Grid>
                </Grid>
              </Grid>
            </ScrollViewer>
          </ControlExample.Example>
          <ControlExample.Output>
            <TextBlock class="capture-output" Text="{x:Bind outputText, Mode=OneWay}" TextWrapping="WrapWholeWords" AutomationProperties.LiveSetting="Polite" />
          </ControlExample.Output>
          <ControlExample.Options>
            <StackPanel class="capture-options">
              <ToggleSwitch x:Name="mirrorSwitch" Header="{x:Bind mirrorLabel, Mode=OneWay}" IsOn="{x:Bind mirrorPreview, Mode=TwoWay}" Toggled="MirrorToggleSwitch_Toggled" ToolTipService.ToolTip="{x:Bind mirrorTooltip, Mode=OneWay}" />
              <ToggleSwitch x:Name="cameraSwitchingSwitch" Header="{x:Bind cameraSwitchingLabel, Mode=OneWay}" IsOn="{x:Bind cameraSwitchingEnabled, Mode=TwoWay}" IsEnabled="{x:Bind allowsCameraSwitching, Mode=OneWay}" Toggled="CameraSwitching_Toggled" />
              <Button x:Name="captureButton" Click="CapturePhoto_Click" Content="{x:Bind captureLabel, Mode=OneWay}" IsEnabled="{x:Bind canCapture, Mode=OneWay}" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>
      </StackPanel>
      <ContentDialog x:Name="CameraAccessDialog" Loaded="CameraDialog_Loaded" Title="{x:Bind cameraDialogTitle, Mode=OneWay}" Content="{x:Bind cameraDialogContent, Mode=OneWay}" PrimaryButtonText="{x:Bind cameraDialogPrimaryText, Mode=OneWay}" CloseButtonText="{x:Bind cameraDialogCloseText, Mode=OneWay}" DefaultButton="{x:Bind cameraDialogDefaultButton, Mode=OneWay}" RequestedTheme="{x:Bind pageTheme, Mode=OneWay}" />
    </StackPanel>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, h, inject, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import Button from '../../components/Button.vue'
import ColumnDefinition from '../../components/ColumnDefinition.vue'
import ContentDialog from '../../components/ContentDialog.vue'
import ControlExample from '../../components/ControlExample.vue'
import FontIcon from '../../components/FontIcon.vue'
import Grid from '../../components/Grid.vue'
import Image from '../../components/Image.vue'
import MediaPlayerElement from '../../components/MediaPlayerElement.vue'
import RowDefinition from '../../components/RowDefinition.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ToggleSwitch from '../../components/ToggleSwitch.vue'
import { useI18n } from '../../components/i18n/index'
import { resolveXamlValue } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import captureXamlSource from '../samples/CaptureElement/CaptureElementPreviewSample_xaml.txt?raw'
import captureCSharpSource from '../samples/CaptureElement/CaptureElementPreviewSample_cs.txt?raw'
import cameraSwitchingXamlSource from '../samples/CaptureElement/CaptureElementCameraSwitchingSample_xaml.txt?raw'
import cameraSwitchingCSharpSource from '../samples/CaptureElement/CaptureElementCameraSwitchingSample_cs.txt?raw'

const props = defineProps({
  IsCameraSwitchingEnabled: { type: [Boolean, String], default: true }
})
const instance = getCurrentInstance()
const allowsCameraSwitching = computed(() => {
  const value = resolveXamlValue(props.IsCameraSwitchingEnabled, instance)
  return value === true || (typeof value === 'string' && value.trim().toLowerCase() === 'true')
})
const cameraSwitchingEnabled = ref(true)
watch(allowsCameraSwitching, (value) => { cameraSwitchingEnabled.value = value }, { immediate: true })

const { t } = useI18n()
const pageTitle = t('text.capture-element-camera-preview')
const pageDescription = t('text.capture-element-description')
const exampleHeader = t('sample.capture.preview')
const themeLabel = t('gallery.page-header.toggle-theme')
const favoriteLabel = t('gallery.page-header.favorite')
const capturedLabel = t('sample.capture.captured-label')
const mirrorLabel = t('sample.capture.mirror-preview')
const mirrorTooltip = t('sample.capture.mirror-tooltip')
const captureLabel = t('sample.capture.capture-photo')
const cameraSwitchingLabel = t('sample.capture.enable-camera-switching')
const switchCameraLabel = t('sample.capture.switch-camera')
const cameraDialogTitle = ref('')
const cameraDialogContent = ref('')
const cameraDialogPrimaryText = ref('')
const cameraDialogCloseText = ref('')
const cameraDialogDefaultButton = ref('None')
let cameraDialog: { ShowAsync: () => Promise<string>; Hide: () => void } | null = null
const CameraDialog_Loaded = (sender: { ShowAsync: () => Promise<string>; Hide: () => void }) => { cameraDialog = sender }
const currentPage = inject<{ value: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'captureelement')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const mirrorPreview = ref(false)
const mirrorTransform = computed(() => mirrorPreview.value ? { ScaleX: -1, ScaleY: 1 } : null)
const mediaCapture = shallowRef<MediaStream | null>(null)
const activeVideo = shallowRef<HTMLVideoElement | null>(null)
const previewReady = ref(false)
const sourceState = ref('')
const sourceName = ref('')
const outputText = ref('')
const takingPhoto = ref(false)
const startingCapture = ref(false)
const cameraDevices = shallowRef<MediaDeviceInfo[]>([])
const currentCameraDeviceId = ref('')
const showCameraSwitch = computed(() => allowsCameraSwitching.value && cameraSwitchingEnabled.value && cameraDevices.value.length > 1)
const cameraSwitchVisibility = computed(() => showCameraSwitch.value ? 'Visible' : 'Collapsed')
const canSwitchCamera = computed(() => showCameraSwitch.value && !startingCapture.value && !takingPhoto.value)
const photos = ref<{ id: number; source: string }[]>([])
const capturedVisibility = computed(() => photos.value.length ? 'Visible' : 'Collapsed')
const canCapture = computed(() => Boolean(mediaCapture.value && previewReady.value && !takingPhoto.value && !startingCapture.value))
const frameSourceText = computed(() => sourceState.value === 'viewing'
  ? t('sample.capture.viewing', { name: sourceName.value })
  : sourceState.value ? t(`sample.capture.${sourceState.value}`) : '')
const MirrorTextReplacement = computed(() => mirrorPreview.value
  ? '\n        // Mirror the preview\n        captureElement.RenderTransform = new ScaleTransform() { ScaleX = -1 };\n        captureElement.RenderTransformOrigin = new Point(0.5, 0.5);\n'
  : '')
const captureXaml = computed(() => captureXamlSource + '\n\n' + cameraSwitchingXamlSource.replaceAll('$(CameraSwitchingEnabled)', cameraSwitchingEnabled.value ? 'True' : 'False'))
const captureCSharp = computed(() => captureCSharpSource.replaceAll('$(MirrorPreview)', MirrorTextReplacement.value) + '\n\n' + cameraSwitchingCSharpSource.replaceAll('$(CameraSwitchingEnabled)', cameraSwitchingEnabled.value ? 'true' : 'false'))
const MirrorToggleSwitch_Toggled = (args: { IsOn: boolean }) => { mirrorPreview.value = args.IsOn }
const CameraSwitching_Toggled = (args: { IsOn: boolean }) => { cameraSwitchingEnabled.value = allowsCameraSwitching.value && args.IsOn }
const onPreviewLoaded = () => {
  previewReady.value = Boolean(mediaCapture.value && activeVideo.value?.srcObject === mediaCapture.value && activeVideo.value.readyState >= 2 && activeVideo.value.videoWidth)
}
const onPreviewFailed = () => {
  if (!mediaCapture.value || activeVideo.value?.srcObject !== mediaCapture.value) return
  sourceState.value = 'start-failed'
  outputText.value = t('sample.capture.start-failed')
  StopCaptureElement()
}
const detachPreviewEvents = () => {
  activeVideo.value?.removeEventListener('loadeddata', onPreviewLoaded)
  activeVideo.value?.removeEventListener('playing', onPreviewLoaded)
  activeVideo.value?.removeEventListener('error', onPreviewFailed)
}
const CaptureElement_Loaded = (sender: { MediaPlayer: HTMLVideoElement }) => {
  detachPreviewEvents()
  activeVideo.value = sender.MediaPlayer
  activeVideo.value.addEventListener('loadeddata', onPreviewLoaded)
  activeVideo.value.addEventListener('playing', onPreviewLoaded)
  activeVideo.value.addEventListener('error', onPreviewFailed)
  onPreviewLoaded()
}
const SnapshotImages = defineComponent({
  name: 'CaptureSnapshotImages',
  inheritAttrs: false,
  setup: () => () => photos.value.map((photo, index) => h(Image, {
    key: photo.id,
    Source: photo.source,
    Width: 100,
    MaxWidth: 100,
    Stretch: 'Uniform',
    'AutomationProperties.Name': t('sample.capture.captured-photo', { number: photos.value.length - index })
  }))
})

let unloaded = false
let startVersion = 0
let deviceEnumerationVersion = 0
let photoId = 0
const StopCaptureElement = () => {
  ++startVersion
  mediaCapture.value?.getTracks().forEach((track) => track.stop())
  mediaCapture.value = null
  previewReady.value = false
  startingCapture.value = false
  currentCameraDeviceId.value = ''
  if (activeVideo.value) {
    activeVideo.value.pause()
    activeVideo.value.srcObject = null
  }
}
const RefreshCameraDevices = async () => {
  const version = ++deviceEnumerationVersion
  if (!navigator.mediaDevices?.enumerateDevices) return
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    if (unloaded || version !== deviceEnumerationVersion) return
    cameraDevices.value = [...new Map(devices
      .filter((device) => device.kind === 'videoinput' && device.deviceId)
      .map((device) => [device.deviceId, device])).values()]
  } catch {
    if (!unloaded && version === deviceEnumerationVersion) cameraDevices.value = []
  }
}
const CameraDevices_Changed = () => { void RefreshCameraDevices() }
const ShowCameraError = async (denied: boolean) => {
  cameraDialogTitle.value = denied ? t('sample.capture.access-denied-title') : t('sample.capture.error-title')
  cameraDialogContent.value = denied ? t('sample.capture.privacy-message') : t('sample.capture.start-failed')
  cameraDialogPrimaryText.value = denied ? t('sample.capture.privacy-settings') : ''
  cameraDialogCloseText.value = denied ? t('sample.capture.cancel') : t('sample.capture.ok')
  cameraDialogDefaultButton.value = denied ? 'Primary' : 'None'
  const result = await cameraDialog?.ShowAsync()
  if (!unloaded && result === 'Primary') window.location.href = 'ms-settings:privacy-webcam'
}
const StartCaptureElement = async (deviceId?: string) => {
  StopCaptureElement()
  currentCameraDeviceId.value = deviceId || ''
  const version = ++startVersion
  startingCapture.value = true
  if (!navigator.mediaDevices?.getUserMedia) {
    sourceState.value = 'no-devices'
    outputText.value = t('sample.capture.no-devices')
    startingCapture.value = false
    return
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: deviceId ? { deviceId: { exact: deviceId } } : true, audio: false })
    if (unloaded || version !== startVersion) {
      stream.getTracks().forEach((track) => track.stop())
      return
    }
    const track = stream.getVideoTracks()[0]
    if (!track) {
      stream.getTracks().forEach((entry) => entry.stop())
      sourceState.value = 'no-devices'
      outputText.value = t('sample.capture.no-devices')
      return
    }
    track.addEventListener('ended', () => {
      if (mediaCapture.value !== stream || unloaded) return
      sourceState.value = 'start-failed'
      outputText.value = t('sample.capture.start-failed')
      StopCaptureElement()
    }, { once: true })
    sourceName.value = track.label || t('sample.capture.integrated-camera')
    currentCameraDeviceId.value = track.getSettings().deviceId || deviceId || ''
    sourceState.value = 'viewing'
    mediaCapture.value = stream
    if (deviceId) outputText.value = t('sample.capture.viewing', { name: sourceName.value })
    void RefreshCameraDevices()
  } catch (error) {
    if (unloaded || version !== startVersion) return
    const name = error instanceof DOMException ? error.name : ''
    sourceState.value = name === 'NotAllowedError' || name === 'SecurityError' ? 'access-denied'
      : name === 'NotFoundError' || name === 'DevicesNotFoundError' ? 'no-devices' : 'start-failed'
    outputText.value = t(`sample.capture.${sourceState.value}`)
    if (sourceState.value !== 'no-devices') void ShowCameraError(sourceState.value === 'access-denied')
  } finally {
    if (!unloaded && version === startVersion) startingCapture.value = false
  }
}
const SwitchCamera_Click = () => {
  if (!canSwitchCamera.value) return
  const currentIndex = cameraDevices.value.findIndex((device) => device.deviceId === currentCameraDeviceId.value)
  const nextCamera = cameraDevices.value[(currentIndex + 1) % cameraDevices.value.length]
  if (nextCamera) void StartCaptureElement(nextCamera.deviceId)
}
const CapturePhoto_Click = async () => {
  const video = activeVideo.value
  if (!canCapture.value || !video) return
  const stream = mediaCapture.value
  takingPhoto.value = true
  try {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('CanvasUnavailable')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    if (!blob) throw new Error('PhotoUnavailable')
    if (unloaded || mediaCapture.value !== stream) return
    photos.value.unshift({ id: ++photoId, source: URL.createObjectURL(blob) })
    outputText.value = t('sample.capture.photo-captured')
  } catch {
    if (!unloaded) outputText.value = t('sample.capture.capture-failed')
  } finally {
    takingPhoto.value = false
  }
}
onMounted(() => {
  navigator.mediaDevices?.addEventListener('devicechange', CameraDevices_Changed)
  void StartCaptureElement()
})
onBeforeUnmount(() => {
  unloaded = true
  ++deviceEnumerationVersion
  navigator.mediaDevices?.removeEventListener('devicechange', CameraDevices_Changed)
  cameraDialog?.Hide()
  cameraDialog = null
  detachPreviewEvents()
  StopCaptureElement()
  activeVideo.value = null
  photos.value.forEach((photo) => URL.revokeObjectURL(photo.source))
})
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.capture-display-boundary { width: 100%; min-width: 0; overflow: hidden; }
.capture-preview-grid { width: 100%; height: 300px; flex: none; }
.capture-container { position: relative; min-width: 0; min-height: 0; overflow: hidden; }
.capture-expand-to-fill { position: absolute; inset: 0; overflow: hidden; }
.capture-snapshots-scroll { width: 100%; height: 100%; min-height: 0; }
.capture-snapshots-scroll :deep(.win-scroll-viewer-viewport) { height: 100%; }
.capture-snapshots { width: 100%; min-height: 0; }
.capture-snapshots :deep(.win-image-host) { width: 100%; flex: none; }
.capture-snapshots :deep(.win-image-surface) { width: 100%; height: 100%; max-width: 100%; }
.capture-preview-host { position: relative; min-width: 0; min-height: 0; overflow: hidden; }
.capture-live-preview { height: 100%; min-width: 0; min-height: 0; aspect-ratio: auto; overflow: hidden; }
.capture-preview-host :deep(.capture-camera-switch) { position: absolute; top: 0; right: 0; z-index: 3; }
.capture-live-preview :deep(.win-media-player-surface) { height: 100%; border: 0; }
.capture-live-preview :deep(.win-media-player-video) { height: 100%; min-height: 0; aspect-ratio: auto; }
.capture-output { min-width: 0; overflow-wrap: anywhere; }
.capture-gallery-example :deep(.example-display) { overflow: hidden; }
.capture-gallery-example :deep(.example-container) { grid-template-columns: minmax(0, 1fr) 320px; grid-template-rows: auto auto; }
.capture-gallery-example :deep(.example-options) { grid-column: 2; grid-row: 1 / span 2; }
.capture-gallery-example :deep(.example-output) { grid-column: 1; grid-row: 2; justify-self: stretch; width: auto; max-width: none; min-height: 72px; margin: 0; padding: 12px; border-radius: 0; }
.capture-options { align-items: flex-start; }
.capture-options :deep(.win-switch-header) { white-space: normal; overflow-wrap: anywhere; }
@media (max-width: 739px) {
  .capture-gallery-example :deep(.example-container) { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto auto; }
  .capture-gallery-example :deep(.example-output) { grid-column: 1; grid-row: 2; }
  .capture-gallery-example :deep(.example-options) { grid-column: 1; grid-row: 3; width: auto; max-width: none; margin-top: 0; }
}
@media (max-width: 520px) {
  .page-header { padding-right: 72px; font-size: 24px; line-height: 32px; }
  .page-description { margin-right: 0; }
}
</style>
