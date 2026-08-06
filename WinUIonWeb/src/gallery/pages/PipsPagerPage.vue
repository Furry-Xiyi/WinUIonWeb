<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock
          class="page-description"
          :Text="$t('text.pipspager-description')"
          TextWrapping="WrapWholeWords" />
      </div>
      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.pipspager.integrated-flipview')"
          :theme="pageTheme"
          :vue="integratedFlipViewCode">
          <template #example>
            <WinStackPanel class="pips-gallery-stack">
              <WinFlipView
                v-model:SelectedIndex="currentImageIndex"
                class="pips-flip-view"
                Height="270"
                MaxWidth="400"
                :ItemsSource="Pictures">
                <!-- @vue-ignore the legacy JS component does not expose slot types -->
                <template #item="slotProps">
                  <WinImage class="gallery-image" :Source="getPictureFromSlot(slotProps)" Stretch="Uniform" />
                </template>
              </WinFlipView>
              <WinPipsPager
                HorizontalAlignment="Center"
                Margin="0,12,0,0"
                :NumberOfPages="Pictures.length"
                :SelectedPageIndex="currentImageIndex"
                @update:SelectedPageIndex="currentImageIndex = $event" />
            </WinStackPanel>
          </template>
        </WinControlExample>

        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.pipspager.options')"
          :theme="pageTheme"
          :vue="optionsCode">
          <template #example>
            <WinPipsPager
              v-model:SelectedPageIndex="SelectedPageIndex"
              :NumberOfPages="10"
              :Orientation="Orientation"
              :PreviousButtonVisibility="PreviousButtonVisibility"
              :NextButtonVisibility="NextButtonVisibility"
              @SelectedIndexChanged="onSelectedIndexChanged" />
          </template>
          <template #options>
            <WinStackPanel>
              <WinComboBox
                v-model:SelectedIndex="OrientationSelectedIndex"
                :Header="$t('text.orientation')"
                :ItemsSource="OrientationItems" />
              <WinComboBox
                v-model:SelectedIndex="PreviousButtonVisibilitySelectedIndex"
                :Header="$t('text.previous-button-visibility')"
                :ItemsSource="ButtonVisibilityItems" />
              <WinComboBox
                v-model:SelectedIndex="NextButtonVisibilitySelectedIndex"
                :Header="$t('text.next-button-visibility')"
                :ItemsSource="ButtonVisibilityItems" />
            </WinStackPanel>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import WinComboBox from '../../components/WinComboBox.vue'
import WinControlExample from '../../components/WinControlExample.vue'
import WinFlipView from '../../components/WinFlipView.vue'
import WinImage from '../../components/WinImage.vue'
import WinPipsPager from '../../components/WinPipsPager.vue'
import WinScrollViewer from '../../components/WinScrollViewer.vue'
import WinStackPanel from '../../components/WinStackPanel.vue'
import WinTextBlock from '../../components/WinTextBlock.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const currentPage = inject<{ value: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'pipspager')
const { pageTheme } = createPageState(pageKey.value)
const { t } = useI18n()

const sampleMedia = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia'
const Pictures = Array.from({ length: 8 }, (_, index) => `${sampleMedia}/LandscapeImage${index + 1}.jpg`)
const currentImageIndex = ref(0)
const getPictureFromSlot = (slotProps: unknown) => (slotProps as { item: string }).item

const OrientationValues = ['Horizontal', 'Vertical'] as const
const ButtonVisibilityValues = ['Visible', 'VisibleOnPointerOver', 'Collapsed'] as const
const OrientationItems = computed(() => [t('text.horizontal'), t('text.vertical')])
const ButtonVisibilityItems = computed(() => [
  t('text.visible'),
  t('text.visible-on-pointer-over'),
  t('text.collapsed')
])
const OrientationSelectedIndex = ref(0)
const PreviousButtonVisibilitySelectedIndex = ref(0)
const NextButtonVisibilitySelectedIndex = ref(0)
const SelectedPageIndex = ref(0)
const Orientation = computed(() => OrientationValues[OrientationSelectedIndex.value] ?? 'Horizontal')
const PreviousButtonVisibility = computed(() => ButtonVisibilityValues[PreviousButtonVisibilitySelectedIndex.value] ?? 'Visible')
const NextButtonVisibility = computed(() => ButtonVisibilityValues[NextButtonVisibilitySelectedIndex.value] ?? 'Visible')

const onSelectedIndexChanged = () => {
  const pageNumber = SelectedPageIndex.value + 1
  const announcement = t('text.page-selection-announcement', { page: pageNumber, total: 10 })
  window.dispatchEvent(new CustomEvent('winui-announce', { detail: announcement }))
}

const integratedFlipViewCode = `<WinStackPanel>
  <WinFlipView
    v-model:SelectedIndex="currentImageIndex"
    MaxWidth="400"
    Height="270"
    :ItemsSource="Pictures">
    <template #item="{ item }">
      <WinImage :Source="item" Stretch="Uniform" />
    </template>
  </WinFlipView>
  <WinPipsPager
    HorizontalAlignment="Center"
    Margin="0,12,0,0"
    :NumberOfPages="Pictures.length"
    :SelectedPageIndex="currentImageIndex"
    @update:SelectedPageIndex="currentImageIndex = $event" />
</WinStackPanel>`

const optionsCode = computed(() => `<WinPipsPager
  :NumberOfPages="10"
  Orientation="${Orientation.value}"
  PreviousButtonVisibility="${PreviousButtonVisibility.value}"
  NextButtonVisibility="${NextButtonVisibility.value}" />`)
</script>

<style scoped>
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); }
.pips-gallery-stack { width: min(400px, 100%); }
.pips-flip-view { width: 100%; height: 270px; max-width: 400px; }
.gallery-image { display: block; width: 100%; height: 100%; }
.gallery-image :deep(.win-image) { width: 100%; height: 100%; object-fit: contain; }
</style>
