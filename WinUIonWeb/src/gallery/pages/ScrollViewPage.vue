<template>
  <WinScrollViewer
    class="gallery-page-scroll"
    Width="100%"
    Height="100%"
    VerticalScrollBarVisibility="Auto"
    VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock
          class="page-description"
          :Text="$t('text.scrollview-description')"
          TextWrapping="WrapWholeWords" />
      </div>
      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.scrollview.content')"
          :theme="pageTheme"
          :vue="contentInsideScrollViewCode">
          <template #example>
            <WinStackPanel Spacing="16">
              <WinTextBlock
                :Text="$t('sample.scrollview.content-note')"
                TextWrapping="Wrap" />
              <WinScrollView
                ref="scrollView1Ref"
                Width="400"
                Height="266"
                HorizontalAlignment="Left"
                VerticalAlignment="Top"
                ContentOrientation="None"
                :IsTabStop="true"
                :ZoomMode="ZoomMode"
                :ZoomFactor="ZoomFactor"
                :HorizontalScrollMode="HorizontalScrollMode"
                :VerticalScrollMode="VerticalScrollMode"
                :HorizontalScrollBarVisibility="HorizontalScrollBarVisibility"
                :VerticalScrollBarVisibility="VerticalScrollBarVisibility">
                <WinImage
                  HorizontalAlignment="Center"
                  VerticalAlignment="Center"
                  v-bind="{ 'AutomationProperties.Name': $t('text.cliff') }"
                  :Source="cliffImage"
                  Stretch="Uniform" />
              </WinScrollView>
            </WinStackPanel>
          </template>
          <template #options>
            <WinGrid
              Width="100%"
              MinWidth="200"
              ColumnDefinitions="Auto,*"
              ColumnSpacing="12"
              RowDefinitions="Auto,Auto,Auto,Auto,Auto,Auto,Auto,Auto"
              RowSpacing="16">
              <WinTextBlock VerticalAlignment="Center" :Text="$t('text.zoom-mode')" style="grid-column: 1; grid-row: 1;" />
                <WinComboBox
                  v-model:SelectedIndex="ZoomModeSelectedIndex"
                  Width="100%"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.zoom-mode-automation-name') }"
                :ItemsSource="ZoomModeItems"
                style="grid-column: 2; grid-row: 1;" />

              <WinTextBlock VerticalAlignment="Center" :Text="$t('text.zoom-factor')" style="grid-column: 1; grid-row: 2;" />
              <WinNumberBox
                v-model:Value="ZoomFactor"
                Width="100%"
                v-bind="{ 'AutomationProperties.Name': $t('text.zoom-factor-automation-name') }"
                :LargeChange="10"
                :Maximum="10"
                :Minimum="0.1"
                :SmallChange="1"
                SpinButtonPlacementMode="Inline"
                style="grid-column: 2; grid-row: 2;" />

              <WinTextBlock HorizontalAlignment="Center" :Text="$t('text.scroll-mode')" style="grid-column: 1 / span 2; grid-row: 3;" />
              <WinTextBlock VerticalAlignment="Center" :Text="$t('text.horizontal')" style="grid-column: 1; grid-row: 4;" />
              <WinComboBox
                v-model:SelectedIndex="HorizontalScrollModeSelectedIndex"
                Width="100%"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.horizontal-scroll-mode-automation-name') }"
                :ItemsSource="ScrollModeItems"
                style="grid-column: 2; grid-row: 4;" />
              <WinTextBlock VerticalAlignment="Center" :Text="$t('text.vertical')" style="grid-column: 1; grid-row: 5;" />
              <WinComboBox
                v-model:SelectedIndex="VerticalScrollModeSelectedIndex"
                Width="100%"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.vertical-scroll-mode-automation-name') }"
                :ItemsSource="ScrollModeItems"
                style="grid-column: 2; grid-row: 5;" />

              <WinTextBlock HorizontalAlignment="Center" :Text="$t('text.scrollbar-visibility')" style="grid-column: 1 / span 2; grid-row: 6;" />
              <WinTextBlock VerticalAlignment="Center" :Text="$t('text.horizontal')" style="grid-column: 1; grid-row: 7;" />
              <WinComboBox
                v-model:SelectedIndex="HorizontalScrollBarVisibilitySelectedIndex"
                Width="100%"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.horizontal-scrollbar-visibility-automation-name') }"
                :ItemsSource="ScrollBarVisibilityItems"
                style="grid-column: 2; grid-row: 7;" />
              <WinTextBlock VerticalAlignment="Center" :Text="$t('text.vertical')" style="grid-column: 1; grid-row: 8;" />
              <WinComboBox
                v-model:SelectedIndex="VerticalScrollBarVisibilitySelectedIndex"
                Width="100%"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.vertical-scrollbar-visibility-automation-name') }"
                :ItemsSource="ScrollBarVisibilityItems"
                style="grid-column: 2; grid-row: 8;" />
            </WinGrid>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.scrollview.constant-velocity')"
          :theme="pageTheme"
          :vue="constantVelocityCode">
          <template #example>
            <WinStackPanel Spacing="16">
              <WinTextBlock
                :Text="$t('sample.scrollview.velocity-note')"
                TextWrapping="Wrap" />
              <WinScrollView
                ref="scrollView2Ref"
                Width="400"
                Height="300"
                HorizontalAlignment="Left"
                VerticalAlignment="Top"
                :IsTabStop="true">
                <WinStackPanel>
                  <WinImage
                    v-for="image in velocityImages"
                    :key="image.name"
                    v-bind="{ 'AutomationProperties.Name': image.name }"
                    :Source="image.source"
                    Stretch="Uniform" />
                </WinStackPanel>
              </WinScrollView>
            </WinStackPanel>
          </template>
          <template #options>
            <WinGrid
              Width="100%"
              MinWidth="200"
              ColumnDefinitions="Auto,*"
              ColumnSpacing="12"
              RowDefinitions="Auto"
              RowSpacing="16">
              <WinTextBlock VerticalAlignment="Center" :Text="$t('text.vertical-velocity')" style="grid-column: 1; grid-row: 1;" />
              <WinNumberBox
                v-model:Value="VerticalVelocity"
                Width="100%"
                v-bind="{ 'AutomationProperties.Name': $t('text.vertical-velocity-automation-name') }"
                :LargeChange="30"
                :Maximum="200"
                :Minimum="-200"
                :SmallChange="10"
                SpinButtonPlacementMode="Inline"
                style="grid-column: 2; grid-row: 1;"
                @ValueChanged="onVerticalVelocityChanged" />
            </WinGrid>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.scrollview.programmatic-animation')"
          :theme="pageTheme"
          :vue="programmaticScrollCode">
          <template #example>
            <WinStackPanel Spacing="16">
              <WinTextBlock
                :Text="$t('sample.scrollview.animation-note')"
                TextWrapping="Wrap" />
              <WinScrollView
                ref="scrollView3Ref"
                Width="400"
                Height="300"
                HorizontalAlignment="Left"
                VerticalAlignment="Top"
                :IsTabStop="true">
                <WinStackPanel>
                  <WinImage
                    v-for="image in animationImages"
                    :key="image.name"
                    v-bind="{ 'AutomationProperties.Name': image.name }"
                    :Source="image.source"
                    Stretch="Uniform" />
                </WinStackPanel>
              </WinScrollView>
            </WinStackPanel>
          </template>
          <template #options>
            <WinGrid
              Width="100%"
              MinWidth="320"
              ColumnDefinitions="Auto,*"
              ColumnSpacing="12"
              RowDefinitions="Auto,Auto,Auto"
              RowSpacing="16">
              <WinTextBlock VerticalAlignment="Center" :Text="$t('text.scroll-with-animation')" style="grid-column: 1; grid-row: 1;" />
              <WinComboBox
                v-model:SelectedIndex="VerticalAnimationSelectedIndex"
                Width="100%"
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.vertical-animation-options-automation-name') }"
                :ItemsSource="AnimationItems"
                style="grid-column: 2; grid-row: 1;" />
              <WinTextBlock VerticalAlignment="Center" :Text="$t('text.animation-duration-msec')" style="grid-column: 1; grid-row: 2;" />
              <WinNumberBox
                v-model:Value="AnimationDuration"
                Width="100%"
                v-bind="{ 'AutomationProperties.Name': $t('text.animation-duration-automation-name') }"
                :LargeChange="1000"
                :Maximum="5000"
                :Minimum="1000"
                :SmallChange="500"
                SpinButtonPlacementMode="Inline"
                style="grid-column: 2; grid-row: 2;" />
              <WinButton
                HorizontalAlignment="Stretch"
                v-bind="{ 'AutomationProperties.Name': $t('text.scroll-with-animation-automation-name') }"
                style="grid-column: 1 / span 2; grid-row: 3;"
                @Click="scrollWithAnimation">
                {{ $t('text.scroll-with-animation') }}
              </WinButton>
            </WinGrid>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import WinButton from '../../components/WinButton.vue'
import WinComboBox from '../../components/WinComboBox.vue'
import WinControlExample from '../../components/WinControlExample.vue'
import WinGrid from '../../components/WinGrid.vue'
import WinImage from '../../components/WinImage.vue'
import WinNumberBox from '../../components/WinNumberBox.vue'
import WinScrollView from '../../components/WinScrollView.vue'
import WinScrollViewer from '../../components/WinScrollViewer.vue'
import WinStackPanel from '../../components/WinStackPanel.vue'
import WinTextBlock from '../../components/WinTextBlock.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const currentPage = inject<{ value: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'scrollview')
const { pageTheme } = createPageState(pageKey.value)
const { t } = useI18n()

const sampleMedia = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia'
const cliffImage = `${sampleMedia}/cliff.jpg`
const velocityNames = ['grapes', 'rainier', 'sunset', 'treetops', 'valley', 'cliff']
const velocityImages = velocityNames.map(name => ({ name, source: `${sampleMedia}/${name}.jpg` }))
const animationNames = ['leaves', 'carousel', 'bicycles', 'pond', 'marina', 'beach', 'rampart', 'mountain']
const animationImages = animationNames.map((name, index) => ({ name, source: `${sampleMedia}/LandscapeImage${index + 1}.jpg` }))

const scrollView1Ref = ref<InstanceType<typeof WinScrollView>>()
const scrollView2Ref = ref<InstanceType<typeof WinScrollView>>()
const scrollView3Ref = ref<InstanceType<typeof WinScrollView>>()
const ZoomModeValues = ['Enabled', 'Disabled'] as const
const ScrollModeValues = ['Enabled', 'Disabled', 'Auto'] as const
const ScrollBarVisibilityValues = ['Auto', 'Visible', 'Hidden'] as const
const AnimationValues = ['Default', 'Accordion', 'Teleportation'] as const
const ZoomModeItems = computed(() => [t('text.enabled'), t('text.disabled')])
const ScrollModeItems = computed(() => [t('text.enabled'), t('text.disabled'), t('text.auto')])
const ScrollBarVisibilityItems = computed(() => [t('text.auto'), t('text.visible'), t('text.hidden')])
const AnimationItems = computed(() => [t('text.default'), t('text.accordion'), t('text.teleportation')])
const ZoomModeSelectedIndex = ref(0)
const ZoomFactor = ref(4)
const HorizontalScrollModeSelectedIndex = ref(2)
const VerticalScrollModeSelectedIndex = ref(2)
const HorizontalScrollBarVisibilitySelectedIndex = ref(0)
const VerticalScrollBarVisibilitySelectedIndex = ref(0)
const VerticalVelocity = ref(30)
const VerticalAnimationSelectedIndex = ref(0)
const AnimationDuration = ref(1500)
const ZoomMode = computed(() => ZoomModeValues[ZoomModeSelectedIndex.value] ?? 'Enabled')
const HorizontalScrollMode = computed(() => ScrollModeValues[HorizontalScrollModeSelectedIndex.value] ?? 'Auto')
const VerticalScrollMode = computed(() => ScrollModeValues[VerticalScrollModeSelectedIndex.value] ?? 'Auto')
const HorizontalScrollBarVisibility = computed(() => ScrollBarVisibilityValues[HorizontalScrollBarVisibilitySelectedIndex.value] ?? 'Auto')
const VerticalScrollBarVisibility = computed(() => ScrollBarVisibilityValues[VerticalScrollBarVisibilitySelectedIndex.value] ?? 'Auto')
const VerticalAnimation = computed(() => AnimationValues[VerticalAnimationSelectedIndex.value] ?? 'Default')

const onVerticalVelocityChanged = ({ OldValue, NewValue }: { OldValue: number; NewValue: number }) => {
  if (Number.isNaN(OldValue) || !scrollView2Ref.value) return
  scrollView2Ref.value.CancelScrollVelocity()

  const verticalOffset = Number(scrollView2Ref.value.VerticalOffset ?? 0)
  const scrollableHeight = Number(scrollView2Ref.value.ScrollableHeight ?? 0)
  let verticalConstantVelocity = NewValue

  if (NewValue <= 30 && NewValue >= -30) {
    if (NewValue < OldValue) verticalConstantVelocity = verticalOffset === 0 ? 30 : -30
    else verticalConstantVelocity = verticalOffset === scrollableHeight ? -30 : 30
  } else if (NewValue < 30 && verticalOffset === 0) {
    verticalConstantVelocity = 30
  } else if (NewValue > 30 && verticalOffset === scrollableHeight) {
    verticalConstantVelocity = -30
  }

  VerticalVelocity.value = verticalConstantVelocity
  scrollView2Ref.value.AddScrollVelocity({ x: 0, y: verticalConstantVelocity }, 1)
}

const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => (progress: number) => {
  const sample = (a: number, b: number, t: number) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3
  let parameter = progress
  for (let iteration = 0; iteration < 6; iteration += 1) {
    const x = sample(x1, x2, parameter) - progress
    const derivative = 3 * x1 * (1 - parameter) ** 2 + 6 * (x2 - x1) * (1 - parameter) * parameter + 3 * (1 - x2) * parameter ** 2
    if (Math.abs(derivative) < 0.0001) break
    parameter = Math.min(1, Math.max(0, parameter - x / derivative))
  }
  return sample(y1, y2, parameter)
}

const defaultEase = cubicBezier(0.1, 0.9, 0.2, 1)
const teleportStartEase = cubicBezier(1, 0, 1, 0)
const teleportEndEase = cubicBezier(0, 1, 0, 1)
const interpolate = (from: number, to: number, progress: number) => from + (to - from) * progress

const getAnimatedOffset = (animation: string, start: number, target: number, progress: number) => {
  const delta = target - start
  if (animation === 'Accordion') {
    const frames = [
      { progress: 0, value: start },
      { progress: 0.6, value: target + 0.1 * delta },
      { progress: 0.8, value: target - 0.05 * delta },
      { progress: 0.9, value: target + 0.025 * delta },
      { progress: 1, value: target }
    ]
    const nextFrameIndex = frames.findIndex(frame => frame.progress >= progress)
    const nextFrame = frames[Math.max(1, nextFrameIndex)]
    const previousFrame = frames[Math.max(0, nextFrameIndex - 1)]
    return interpolate(previousFrame.value, nextFrame.value, (progress - previousFrame.progress) / (nextFrame.progress - previousFrame.progress))
  }
  if (animation === 'Teleportation') {
    if (progress < 0.5) return interpolate(start, target - 0.9 * delta, teleportStartEase(progress * 2))
    return interpolate(target - 0.1 * delta, target, teleportEndEase((progress - 0.5) * 2))
  }
  return interpolate(start, target, defaultEase(progress))
}

const scrollWithAnimation = () => {
  const scrollView = scrollView3Ref.value
  if (!scrollView) return
  const start = Number(scrollView.VerticalOffset ?? 0)
  const scrollableHeight = Number(scrollView.ScrollableHeight ?? 0)
  const target = start > scrollableHeight / 2 ? scrollableHeight / 5 : 4 * scrollableHeight / 5
  const started = performance.now()

  const animate = (timestamp: number) => {
    const progress = Math.min(1, (timestamp - started) / AnimationDuration.value)
    scrollView.ScrollTo(Number(scrollView.HorizontalOffset ?? 0), getAnimatedOffset(VerticalAnimation.value, start, target, progress))
    if (progress < 1) requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}

const contentInsideScrollViewCode = computed(() => `<WinScrollView
  Height="266"
  Width="400"
  ContentOrientation="None"
  ZoomMode="${ZoomMode.value}"
  :ZoomFactor="${ZoomFactor.value}"
  :IsTabStop="true"
  VerticalAlignment="Top"
  HorizontalAlignment="Left"
  HorizontalScrollMode="${HorizontalScrollMode.value}"
  HorizontalScrollBarVisibility="${HorizontalScrollBarVisibility.value}"
  VerticalScrollMode="${VerticalScrollMode.value}"
  VerticalScrollBarVisibility="${VerticalScrollBarVisibility.value}">
  <WinImage
    Source="${cliffImage}"
    AutomationProperties.Name="cliff"
    Stretch="Uniform"
    HorizontalAlignment="Center"
    VerticalAlignment="Center" />
</WinScrollView>`)

const constantVelocityCode = `<WinScrollView
  ref="scrollView"
  Height="300"
  Width="400"
  :IsTabStop="true"
  VerticalAlignment="Top"
  HorizontalAlignment="Left">
  <WinStackPanel>
    <WinImage
      v-for="image in velocityImages"
      :key="image.name"
      :Source="image.source"
      :AutomationProperties.Name="image.name"
      Stretch="Uniform" />
  </WinStackPanel>
</WinScrollView>`

const programmaticScrollCode = computed(() => `<WinScrollView
  ref="scrollView"
  Height="300"
  Width="400"
  :IsTabStop="true"
  VerticalAlignment="Top"
  HorizontalAlignment="Left">
  <WinStackPanel>
    <WinImage
      v-for="image in animationImages"
      :key="image.name"
      :Source="image.source"
      :AutomationProperties.Name="image.name"
      Stretch="Uniform" />
  </WinStackPanel>
</WinScrollView>

<WinButton @Click="scrollWithAnimation">
  Scroll with animation
</WinButton>

// Animation: ${VerticalAnimation.value}
// Duration: ${AnimationDuration.value} ms`)
</script>

<style scoped>
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); }
</style>
