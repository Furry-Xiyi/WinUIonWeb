<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.scrollview')" />
          <WinTextBlock class="page-description" :Text="$t('text.scrollview-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.scrollview.content')" :theme="pageTheme" :vue="contentInsideScrollViewCode">
              <template #example>
                <div class="example-stack">
                  <WinTextBlock :Text="$t('sample.scrollview.content-note')" TextWrapping="Wrap" />
                  <WinScrollViewer
                    ref="scrollView1Ref"
                    Width="400"
                    Height="266"
                    HorizontalAlignment="Left"
                    VerticalAlignment="Top"
                    :IsTabStop="true"
                    :ZoomMode="zoomMode"
                    :ZoomFactor="zoomFactor"
                    :HorizontalScrollMode="horizontalScrollMode"
                    :VerticalScrollMode="verticalScrollMode"
                    :HorizontalScrollBarVisibility="horizontalScrollBarVisibility"
                    :VerticalScrollBarVisibility="verticalScrollBarVisibility">
                    <img class="scroll-image single" :src="cliffImage" alt="" />
                  </WinScrollViewer>
                </div>
              </template>
              <template #options>
                <WinGrid MinWidth="200" ColumnDefinitions="Auto,*" ColumnSpacing="12" RowDefinitions="Auto,Auto,Auto,Auto,Auto,Auto,Auto,Auto" RowSpacing="16">
                  <WinTextBlock VerticalAlignment="Center" Text="ZoomMode" style="grid-column: 1; grid-row: 1;" />
                  <WinComboBox v-model:SelectedIndex="zoomModeIndex" Width="130" :ItemsSource="scrollViewZoomModeItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 1;" />
                  <WinTextBlock VerticalAlignment="Center" Text="ZoomFactor" style="grid-column: 1; grid-row: 2;" />
                  <WinNumberBox v-model:Value="zoomFactor" :Minimum="0.1" :Maximum="10" :SmallChange="1" :LargeChange="10" SpinButtonPlacementMode="Inline" style="grid-column: 2; grid-row: 2;" />
                  <WinTextBlock HorizontalTextAlignment="Center" Text="ScrollMode" style="grid-column: 1 / span 2; grid-row: 3;" />
                  <WinTextBlock VerticalAlignment="Center" Text="Horizontal" style="grid-column: 1; grid-row: 4;" />
                  <WinComboBox v-model:SelectedIndex="horizontalScrollModeIndex" Width="130" :ItemsSource="scrollModeItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 4;" />
                  <WinTextBlock VerticalAlignment="Center" Text="Vertical" style="grid-column: 1; grid-row: 5;" />
                  <WinComboBox v-model:SelectedIndex="verticalScrollModeIndex" Width="130" :ItemsSource="scrollModeItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 5;" />
                  <WinTextBlock HorizontalTextAlignment="Center" Text="ScrollbarVisibility" style="grid-column: 1 / span 2; grid-row: 6;" />
                  <WinTextBlock VerticalAlignment="Center" Text="Horizontal" style="grid-column: 1; grid-row: 7;" />
                  <WinComboBox v-model:SelectedIndex="horizontalScrollBarVisibilityIndex" Width="130" :ItemsSource="scrollViewScrollBarVisibilityItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 7;" />
                  <WinTextBlock VerticalAlignment="Center" Text="Vertical" style="grid-column: 1; grid-row: 8;" />
                  <WinComboBox v-model:SelectedIndex="verticalScrollBarVisibilityIndex" Width="130" :ItemsSource="scrollViewScrollBarVisibilityItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 8;" />
                </WinGrid>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.scrollview.constant-velocity')" :theme="pageTheme" :vue="constantVelocityCode">
              <template #example>
                <div class="example-stack">
                  <WinTextBlock :Text="$t('sample.scrollview.velocity-note')" TextWrapping="Wrap" />
                  <WinScrollViewer ref="scrollView2Ref" Width="400" Height="300" HorizontalAlignment="Left" VerticalAlignment="Top" :IsTabStop="true">
                    <WinStackPanel>
                      <img v-for="image in velocityImages" :key="image.alt" class="scroll-image" :src="image.src" :alt="image.alt" />
                    </WinStackPanel>
                  </WinScrollViewer>
                </div>
              </template>
              <template #options>
                <WinGrid MinWidth="200" ColumnDefinitions="Auto,*" ColumnSpacing="12" RowDefinitions="Auto">
                  <WinTextBlock VerticalAlignment="Center" Text="Vertical velocity" style="grid-column: 1; grid-row: 1;" />
                  <WinNumberBox v-model:Value="verticalVelocity" :Minimum="-200" :Maximum="200" :SmallChange="10" :LargeChange="30" SpinButtonPlacementMode="Inline" @ValueChanged="onVerticalVelocityChanged" style="grid-column: 2; grid-row: 1;" />
                </WinGrid>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.scrollview.programmatic-animation')" :theme="pageTheme" :vue="programmaticScrollCode">
              <template #example>
                <div class="example-stack">
                  <WinTextBlock :Text="$t('sample.scrollview.animation-note')" TextWrapping="Wrap" />
                  <WinScrollViewer ref="scrollView3Ref" Width="400" Height="300" HorizontalAlignment="Left" VerticalAlignment="Top" :IsTabStop="true">
                    <WinStackPanel>
                      <img v-for="image in animationImages" :key="image.alt" class="scroll-image" :src="image.src" :alt="image.alt" />
                    </WinStackPanel>
                  </WinScrollViewer>
                </div>
              </template>
              <template #options>
                <WinGrid MinWidth="320" ColumnDefinitions="Auto,*" ColumnSpacing="12" RowDefinitions="Auto,Auto,Auto" RowSpacing="16">
                  <WinTextBlock VerticalAlignment="Center" Text="Scroll with animation" style="grid-column: 1; grid-row: 1;" />
                  <WinComboBox v-model:SelectedIndex="verticalAnimationIndex" Width="160" :ItemsSource="animationItems" DisplayMemberPath="Text" style="grid-column: 2; grid-row: 1;" />
                  <WinTextBlock VerticalAlignment="Center" Text="Animation duration (msec)" style="grid-column: 1; grid-row: 2;" />
                  <WinNumberBox v-model:Value="animationDuration" :Minimum="1000" :Maximum="5000" :SmallChange="500" :LargeChange="1000" SpinButtonPlacementMode="Inline" style="grid-column: 2; grid-row: 2;" />
                  <WinButton HorizontalAlignment="Stretch" @Click="scrollWithAnimation" style="grid-column: 1 / span 2; grid-row: 3;">
                    <WinTextBlock :Text="$t('sample.scrollview.scroll-with-animation')" />
                  </WinButton>
                </WinGrid>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinGrid from '../../components/WinGrid.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'scrollview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const raw = (name) => `https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/${name}`;
const cliffImage = raw('cliff.jpg');
const velocityImages = [
  { alt: 'grapes', src: raw('grapes.jpg') },
  { alt: 'rainier', src: raw('rainier.jpg') },
  { alt: 'sunset', src: raw('sunset.jpg') },
  { alt: 'treetops', src: raw('treetops.jpg') },
  { alt: 'valley', src: raw('valley.jpg') },
  { alt: 'cliff', src: raw('cliff.jpg') }
];
const animationImages = Array.from({ length: 8 }, (_, index) => ({
  alt: ['leaves', 'carousel', 'bicycles', 'pond', 'marina', 'beach', 'rampart', 'mountain'][index],
  src: raw(`LandscapeImage${index + 1}.jpg`)
}));

const scrollView1Ref = ref();
const scrollView2Ref = ref();
const scrollView3Ref = ref();
const scrollViewZoomModeItems = [{ Text: 'Enabled' }, { Text: 'Disabled' }];
const scrollModeItems = [{ Text: 'Enabled' }, { Text: 'Disabled' }, { Text: 'Auto' }];
const scrollViewScrollBarVisibilityItems = [{ Text: 'Auto' }, { Text: 'Visible' }, { Text: 'Hidden' }];
const animationItems = [{ Text: 'Default' }, { Text: 'Accordion' }, { Text: 'Teleportation' }];
const zoomModeIndex = ref(0);
const zoomFactor = ref(4);
const horizontalScrollModeIndex = ref(2);
const verticalScrollModeIndex = ref(2);
const horizontalScrollBarVisibilityIndex = ref(0);
const verticalScrollBarVisibilityIndex = ref(0);
const verticalVelocity = ref(30);
const verticalAnimationIndex = ref(0);
const animationDuration = ref(1500);
const zoomMode = computed(() => scrollViewZoomModeItems[zoomModeIndex.value]?.Text || 'Enabled');
const horizontalScrollMode = computed(() => scrollModeItems[horizontalScrollModeIndex.value]?.Text || 'Auto');
const verticalScrollMode = computed(() => scrollModeItems[verticalScrollModeIndex.value]?.Text || 'Auto');
const horizontalScrollBarVisibility = computed(() => scrollViewScrollBarVisibilityItems[horizontalScrollBarVisibilityIndex.value]?.Text || 'Auto');
const verticalScrollBarVisibility = computed(() => scrollViewScrollBarVisibilityItems[verticalScrollBarVisibilityIndex.value]?.Text || 'Auto');
const verticalAnimation = computed(() => animationItems[verticalAnimationIndex.value]?.Text || 'Default');

const onVerticalVelocityChanged = ({ NewValue }) => {
  scrollView2Ref.value?.CancelScrollVelocity?.();
  if (NewValue > 30 || NewValue < -30) {
    scrollView2Ref.value?.AddScrollVelocity?.({ x: 0, y: NewValue });
  }
};

const scrollWithAnimation = () => {
  const exposed = scrollView3Ref.value?.scrollViewerRef;
  const scrollView = exposed?.value ?? exposed;
  if (!scrollView) return;

  const start = scrollView.scrollTop;
  const target = start > (scrollView.scrollHeight - scrollView.clientHeight) / 2
    ? (scrollView.scrollHeight - scrollView.clientHeight) / 5
    : 4 * (scrollView.scrollHeight - scrollView.clientHeight) / 5;
  const duration = animationDuration.value;
  const started = performance.now();

  const defaultEase = (t) => 1 - Math.pow(1 - t, 3);
  const accordion = (t) => {
    if (t < 0.6) return defaultEase(t / 0.6) * 1.1;
    if (t < 0.8) return 1.1 - defaultEase((t - 0.6) / 0.2) * 0.15;
    return 0.95 + defaultEase((t - 0.8) / 0.2) * 0.05;
  };
  const teleport = (t) => {
    if (t < 0.5) return 0.1 * defaultEase(t / 0.5);
    return 0.9 + 0.1 * defaultEase((t - 0.5) / 0.5);
  };
  const easing = verticalAnimation.value === 'Accordion' ? accordion : verticalAnimation.value === 'Teleportation' ? teleport : defaultEase;

  const frame = (now) => {
    const progress = Math.min(1, (now - started) / duration);
    scrollView.scrollTop = start + (target - start) * easing(progress);
    if (progress < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
};

const contentInsideScrollViewCode = computed(() => `<WinScrollViewer Height="266" Width="400"
  ZoomMode="${zoomMode.value}" IsTabStop="True"
  HorizontalScrollMode="${horizontalScrollMode.value}" HorizontalScrollBarVisibility="${horizontalScrollBarVisibility.value}"
  VerticalScrollMode="${verticalScrollMode.value}" VerticalScrollBarVisibility="${verticalScrollBarVisibility.value}">
  <Image Source="${cliffImage}" AutomationProperties.Name="cliff" Stretch="Uniform" />
</WinScrollViewer>`);

const constantVelocityCode = computed(() => `<WinScrollViewer Height="300" Width="400" IsTabStop="True">
  <WinStackPanel>
    <Image Source="${velocityImages[0].src}" Stretch="Uniform" AutomationProperties.Name="grapes" />
    <Image Source="${velocityImages[1].src}" Stretch="Uniform" AutomationProperties.Name="rainier" />
    <Image Source="${velocityImages[2].src}" Stretch="Uniform" AutomationProperties.Name="sunset" />
  </WinStackPanel>
</WinScrollViewer>`);

const programmaticScrollCode = computed(() => `<WinScrollViewer Height="300" Width="400" IsTabStop="True">
  <WinStackPanel>
    <Image Source="${animationImages[0].src}" Stretch="Uniform" AutomationProperties.Name="leaves" />
    <Image Source="${animationImages[1].src}" Stretch="Uniform" AutomationProperties.Name="carousel" />
  </WinStackPanel>
</WinScrollViewer>
<WinButton Content="${t('sample.scrollview.scroll-with-animation')}" />`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.example-stack { display: flex; flex-direction: column; gap: 16px; max-width: 600px; }
.scroll-image { display: block; width: 400px; height: auto; }
.scroll-image.single { width: auto; max-width: none; }
</style>
