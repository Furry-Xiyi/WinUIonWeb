<template>
  <div>
    <div class="page-heading">
      <WinTextBlock class="page-header" Text="ScrollView" />
      <WinTextBlock
        class="page-description"
        Text="The ScrollView control provides a viewport for viewing scrollable content. It supports horizontal and vertical scrolling, zooming, scroll velocity, and programmatic scroll animations."
        TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
        <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinControlExample
      headerText="Content inside of a ScrollView."
      :theme="pageTheme"
      :xaml="contentInsideScrollViewXaml"
      :vue="contentInsideScrollViewVue">
      <template #example>
        <div class="example-stack">
          <WinTextBlock
            class="example-copy"
            Text="This ScrollView allows horizontal and vertical scrolling, as well as zooming. Change the settings on the right to alter those capabilities or the built-in scrollbars' visibility."
            TextWrapping="WrapWholeWords" />

          <WinScrollViewer
            ref="scrollView1Ref"
            :Width="400"
            :Height="266"
            ContentOrientation="None"
            :ZoomMode="zoomMode"
            :ZoomFactor="zoomFactor"
            :HorizontalScrollMode="horizontalScrollMode"
            :VerticalScrollMode="verticalScrollMode"
            :HorizontalScrollBarVisibility="horizontalScrollBarVisibility"
            :VerticalScrollBarVisibility="verticalScrollBarVisibility"
            :IsTabStop="true"
            HorizontalAlignment="Left"
            VerticalAlignment="Top">
            <img
              class="scroll-image scroll-image-single"
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
              alt="cliff" />
          </WinScrollViewer>
        </div>
      </template>

      <template #options>
        <div class="options-grid options-grid-wide">
          <WinTextBlock Text="ZoomMode" />
          <WinComboBox v-model="zoomModeIndex" :options="zoomModeOptions" />

          <WinTextBlock Text="ZoomFactor" />
          <WinNumberBox
            v-model:Value="zoomFactor"
            :Minimum="0.1"
            :Maximum="10"
            :SmallChange="1"
            :LargeChange="10"
            SpinButtonPlacementMode="Inline"
            @ValueChanged="onZoomFactorChanged" />

          <WinTextBlock class="options-section-label" Text="ScrollMode" />

          <WinTextBlock Text="Horizontal" />
          <WinComboBox v-model="horizontalScrollModeIndex" :options="scrollModeOptions" />

          <WinTextBlock Text="Vertical" />
          <WinComboBox v-model="verticalScrollModeIndex" :options="scrollModeOptions" />

          <WinTextBlock class="options-section-label" Text="ScrollbarVisibility" />

          <WinTextBlock Text="Horizontal" />
          <WinComboBox v-model="horizontalScrollBarVisibilityIndex" :options="scrollBarVisibilityOptions" />

          <WinTextBlock Text="Vertical" />
          <WinComboBox v-model="verticalScrollBarVisibilityIndex" :options="scrollBarVisibilityOptions" />
        </div>
      </template>
    </WinControlExample>

    <WinControlExample
      headerText="Constant velocity scrolling."
      :theme="pageTheme"
      :xaml="constantVelocityXaml"
      :cSharp="constantVelocityCSharp"
      :vue="constantVelocityVue">
      <template #example>
        <div class="example-stack">
          <WinTextBlock
            class="example-copy"
            Text="Set the vertical velocity to a value greater than 30 to scroll down, or a value smaller than -30 to scroll up at a constant speed."
            TextWrapping="WrapWholeWords" />

          <WinScrollViewer
            ref="scrollView2Ref"
            :Width="400"
            :Height="300"
            :IsTabStop="true"
            HorizontalAlignment="Left"
            VerticalAlignment="Top">
            <div class="image-stack">
              <img v-for="image in velocityImages" :key="image.alt" class="scroll-image" :src="image.src" :alt="image.alt" />
            </div>
          </WinScrollViewer>
        </div>
      </template>

      <template #options>
        <div class="options-grid">
          <WinTextBlock Text="Vertical velocity" />
          <WinNumberBox
            v-model:Value="verticalVelocity"
            :Minimum="-200"
            :Maximum="200"
            :SmallChange="10"
            :LargeChange="30"
            SpinButtonPlacementMode="Inline"
            @ValueChanged="onVerticalVelocityChanged" />
        </div>
      </template>
    </WinControlExample>

    <WinControlExample
      headerText="Programmatic scroll with custom animation."
      :theme="pageTheme"
      :xaml="programmaticScrollXaml"
      :cSharp="programmaticScrollCSharp"
      :vue="programmaticScrollVue">
      <template #example>
        <div class="example-stack">
          <WinTextBlock
            class="example-copy"
            Text="Pick an animation type and its duration and then click the button on the right to launch a programmatic scroll."
            TextWrapping="WrapWholeWords" />

          <WinScrollViewer
            ref="scrollView3Ref"
            :Width="400"
            :Height="300"
            :IsTabStop="true"
            HorizontalAlignment="Left"
            VerticalAlignment="Top">
            <div class="image-stack">
              <img v-for="image in animationImages" :key="image.alt" class="scroll-image" :src="image.src" :alt="image.alt" />
            </div>
          </WinScrollViewer>
        </div>
      </template>

      <template #options>
        <div class="options-grid options-grid-animation">
          <WinTextBlock Text="Scroll with animation" />
          <WinComboBox v-model="verticalAnimationIndex" :options="animationOptions" />

          <WinTextBlock Text="Animation duration (msec)" />
          <WinNumberBox
            v-model:Value="animationDuration"
            :Minimum="1000"
            :Maximum="5000"
            :SmallChange="500"
            :LargeChange="1000"
            SpinButtonPlacementMode="Inline" />

          <WinButton class="options-span" Content="Scroll with animation" @click="scrollWithAnimation" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => {
  if (typeof currentPage === 'string') return currentPage;
  return currentPage?.value || 'scrollview';
});
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const scrollView1Ref = ref();
const scrollView2Ref = ref();
const scrollView3Ref = ref();

const zoomModeIndex = ref(0);
const zoomFactor = ref(4);
const horizontalScrollModeIndex = ref(2);
const verticalScrollModeIndex = ref(2);
const horizontalScrollBarVisibilityIndex = ref(0);
const verticalScrollBarVisibilityIndex = ref(0);
const verticalVelocity = ref(30);
const verticalAnimationIndex = ref(0);
const animationDuration = ref(1500);

const zoomModeOptions = [
  { label: 'Enabled', value: 'Enabled' },
  { label: 'Disabled', value: 'Disabled' }
];
const scrollModeOptions = [
  { label: 'Enabled', value: 'Enabled' },
  { label: 'Disabled', value: 'Disabled' },
  { label: 'Auto', value: 'Auto' }
];
const scrollBarVisibilityOptions = [
  { label: 'Auto', value: 'Auto' },
  { label: 'Visible', value: 'Visible' },
  { label: 'Hidden', value: 'Hidden' }
];
const animationOptions = [
  { label: 'Default', value: 'Default' },
  { label: 'Accordion', value: 'Accordion' },
  { label: 'Teleportation', value: 'Teleportation' }
];

const zoomMode = computed(() => zoomModeOptions[zoomModeIndex.value]?.value);
const horizontalScrollMode = computed(() => scrollModeOptions[horizontalScrollModeIndex.value]?.value);
const verticalScrollMode = computed(() => scrollModeOptions[verticalScrollModeIndex.value]?.value);
const horizontalScrollBarVisibility = computed(() => scrollBarVisibilityOptions[horizontalScrollBarVisibilityIndex.value]?.value);
const verticalScrollBarVisibility = computed(() => scrollBarVisibilityOptions[verticalScrollBarVisibilityIndex.value]?.value);
const verticalAnimation = computed(() => animationOptions[verticalAnimationIndex.value]?.value || 'Default');

const velocityImages = [
  { alt: 'grapes', src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' },
  { alt: 'rainier', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
  { alt: 'sunset', src: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800' },
  { alt: 'treetops', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800' },
  { alt: 'valley', src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800' },
  { alt: 'cliff', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' }
];
const animationImages = [
  { alt: 'leaves', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800' },
  { alt: 'carousel', src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' },
  { alt: 'bicycles', src: 'https://images.unsplash.com/photo-1507069009738-de3f6f155e3a?w=800' },
  { alt: 'pond', src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800' },
  { alt: 'marina', src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' },
  { alt: 'beach', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { alt: 'rampart', src: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800' },
  { alt: 'mountain', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' }
];

const onZoomFactorChanged = (args) => {
  scrollView1Ref.value?.ZoomTo?.(args.newValue);
};

const onVerticalVelocityChanged = (args) => {
  if (Number.isNaN(args.oldValue)) return;
  scrollView2Ref.value?.CancelScrollVelocity?.();
  if (args.newValue <= 30 && args.newValue >= -30) return;
  scrollView2Ref.value?.AddScrollVelocity?.({ x: 0, y: args.newValue });
};

const scrollWithAnimation = () => {
  const scrollView = scrollView3Ref.value;
  if (!scrollView) return;

  const startTop = scrollView.scrollTop ?? 0;
  const scrollableHeight = Math.max(0, (scrollView.scrollHeight ?? 0) - 300);
  const targetTop = startTop > scrollableHeight / 2 ? scrollableHeight / 5 : 4 * scrollableHeight / 5;
  const distance = targetTop - startTop;
  const duration = animationDuration.value;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = getAnimationProgress(progress);
    scrollView.ScrollTo?.(0, startTop + distance * easedProgress);
    if (progress < 1) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

const getAnimationProgress = (progress) => {
  if (verticalAnimation.value === 'Accordion') {
    return progress < 0.5
      ? 0.5 * Math.pow(2 * progress, 2)
      : 1 - 0.5 * Math.pow(2 * (1 - progress), 2);
  }
  if (verticalAnimation.value === 'Teleportation') {
    return progress < 0.5 ? progress * 0.2 : 0.8 + (progress - 0.5) * 0.4;
  }
  return progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
};

const contentInsideScrollViewXaml = computed(() => `<ScrollView Height="266" Width="400" ContentOrientation="None"
    ZoomMode="${zoomMode.value}" IsTabStop="True"
    VerticalAlignment="Top" HorizontalAlignment="Left"
    HorizontalScrollMode="${horizontalScrollMode.value}" HorizontalScrollBarVisibility="${horizontalScrollBarVisibility.value}"
    VerticalScrollMode="${verticalScrollMode.value}" VerticalScrollBarVisibility="${verticalScrollBarVisibility.value}">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" AutomationProperties.Name="cliff" Stretch="None"
        HorizontalAlignment="Center" VerticalAlignment="Center"/>
</ScrollView>`);
const constantVelocityXaml = `<ScrollView Height="300" Width="400" IsTabStop="True"
    VerticalAlignment="Top" HorizontalAlignment="Left">
    <Image Source="ms-appx:///Assets/SampleMedia/grapes.jpg" Stretch="Uniform" AutomationProperties.Name="grapes"/>
    <Image Source="ms-appx:///Assets/SampleMedia/rainier.jpg" Stretch="Uniform" AutomationProperties.Name="rainier"/>
    <Image Source="ms-appx:///Assets/SampleMedia/sunset.jpg" Stretch="Uniform" AutomationProperties.Name="sunset"/>
    <Image Source="ms-appx:///Assets/SampleMedia/treetops.jpg" Stretch="Uniform" AutomationProperties.Name="treetops"/>
    <Image Source="ms-appx:///Assets/SampleMedia/valley.jpg" Stretch="Uniform" AutomationProperties.Name="valley"/>
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" Stretch="Uniform" AutomationProperties.Name="cliff"/>
</ScrollView>`;
const programmaticScrollXaml = `<ScrollView Height="300" Width="400" IsTabStop="True"
    ScrollAnimationStarting="ScrollView_ScrollAnimationStarting"
    VerticalAlignment="Top" HorizontalAlignment="Left">
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage1.jpg" Stretch="Uniform" AutomationProperties.Name="leaves"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage2.jpg" Stretch="Uniform" AutomationProperties.Name="carousel"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage3.jpg" Stretch="Uniform" AutomationProperties.Name="bicycles"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage4.jpg" Stretch="Uniform" AutomationProperties.Name="pond"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage5.jpg" Stretch="Uniform" AutomationProperties.Name="marina"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage6.jpg" Stretch="Uniform" AutomationProperties.Name="beach"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage7.jpg" Stretch="Uniform" AutomationProperties.Name="rampart"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage8.jpg" Stretch="Uniform" AutomationProperties.Name="mountain"/>
</ScrollView>`;
const constantVelocityCSharp = `scrollView2.AddScrollVelocity(
    new Vector2(0f, verticalConstantVelocity),
    new Vector2() /*empty inertia decay rate for a constant velocity*/);`;
const programmaticScrollCSharp = `scrollView3.ScrollTo(
    scrollView3.HorizontalOffset,
    GetTargetVerticalOffset(),
    new ScrollingScrollOptions(ScrollingAnimationMode.Enabled, ScrollingSnapPointsMode.Ignore));`;
const contentInsideScrollViewVue = `<WinScrollViewer
  :Width="400"
  :Height="266"
  ContentOrientation="None"
  ZoomMode="Enabled"
  HorizontalScrollMode="Auto"
  VerticalScrollMode="Auto"
  HorizontalScrollBarVisibility="Auto"
  VerticalScrollBarVisibility="Auto"
  :IsTabStop="true"
  HorizontalAlignment="Left"
  VerticalAlignment="Top">
  <img src="cliff.jpg" alt="cliff" />
</WinScrollViewer>`;
const constantVelocityVue = `scrollViewRef.value?.AddScrollVelocity({ x: 0, y: verticalConstantVelocity });`;
const programmaticScrollVue = `scrollViewRef.value?.ScrollTo(0, targetVerticalOffset);`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets"; font-size: 16px; }
.example-stack { display: flex; flex-direction: column; gap: 16px; }
.example-copy { max-width: 600px; }
.image-stack { display: flex; flex-direction: column; }
.scroll-image { display: block; width: 100%; height: auto; }
.scroll-image-single { max-width: none; width: 800px; }
.options-grid { min-width: 200px; display: grid; grid-template-columns: auto minmax(120px, 1fr); gap: 12px; align-items: center; }
.options-grid-wide { gap: 12px 16px; }
.options-grid-animation { min-width: 320px; }
.options-section-label,
.options-span { grid-column: 1 / -1; }
.options-section-label { justify-self: center; margin-top: 8px; }
</style>
