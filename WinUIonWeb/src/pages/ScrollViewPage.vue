<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">ScrollView</h1>
      <p class="page-description">
        The ScrollView control provides a viewport for viewing scrollable content, with optional zoom capabilities. It offers precise control over scrolling behavior, custom scroll animations, and programmatic scrolling with velocity-based motion.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Content inside ScrollView -->
    <WinControlExample
      headerText="Content inside ScrollView"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <p style="max-width: 600px;">
            This ScrollView allows horizontal and vertical scrolling, as well as zooming. Change the settings on the right to alter those capabilities or the built-in scrollbars' visibility.
          </p>

          <WinScrollViewer
            ref="scrollView1Ref"
            :width="400"
            :height="266"
            :zoomMode="zoomMode"
            :zoomFactor="zoomFactor"
            :horizontalScrollMode="horizontalScrollMode"
            :verticalScrollMode="verticalScrollMode"
            :horizontalScrollBarVisibility="horizontalScrollBarVisibility"
            :verticalScrollBarVisibility="verticalScrollBarVisibility"
            :isTabStop="true"
            horizontalAlignment="Left"
            verticalAlignment="Top">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
              alt="cliff"
              style="display: block; max-width: 100%; height: auto;" />
          </WinScrollViewer>
        </div>
      </template>
      <template #options>
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 12px 12px; align-items: center; min-width: 200px;">
          <span>ZoomMode</span>
          <WinComboBox
            v-model="zoomMode"
            :options="zoomModeOptions"
            style="width: 100%;" />

          <span>ZoomFactor</span>
          <WinNumberBox
            v-model="zoomFactor"
            :minimum="0.1"
            :maximum="10"
            :smallChange="1"
            :largeChange="10"
            spinButtonPlacementMode="Inline" />

          <span style="grid-column: 1 / -1; text-align: center; margin-top: 8px;">ScrollMode</span>

          <span>Horizontal</span>
          <WinComboBox
            v-model="horizontalScrollMode"
            :options="scrollModeOptions"
            style="width: 100%;" />

          <span>Vertical</span>
          <WinComboBox
            v-model="verticalScrollMode"
            :options="scrollModeOptions"
            style="width: 100%;" />

          <span style="grid-column: 1 / -1; text-align: center; margin-top: 8px;">ScrollbarVisibility</span>

          <span>Horizontal</span>
          <WinComboBox
            v-model="horizontalScrollBarVisibility"
            :options="scrollBarVisibilityOptions"
            style="width: 100%;" />

          <span>Vertical</span>
          <WinComboBox
            v-model="verticalScrollBarVisibility"
            :options="scrollBarVisibilityOptions"
            style="width: 100%;" />
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: Constant velocity scrolling -->
    <WinControlExample
      headerText="ScrollView constant velocity scrolling"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <p style="max-width: 600px;">
            Set the vertical velocity to a value greater than 30 to scroll down, or a value smaller than -30 to scroll up at a constant speed.
          </p>

          <WinScrollViewer
            ref="scrollView2Ref"
            :width="400"
            :height="300"
            :isTabStop="true"
            horizontalAlignment="Left"
            verticalAlignment="Top">
            <div style="display: flex; flex-direction: column;">
              <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800" alt="grapes" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" alt="rainier" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800" alt="sunset" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800" alt="treetops" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800" alt="valley" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" alt="cliff" style="display: block; width: 100%; height: auto;" />
            </div>
          </WinScrollViewer>
        </div>

        <div style="display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center; min-width: 200px;">
          <span>Vertical velocity</span>
          <WinNumberBox
            v-model="verticalVelocity"
            :minimum="-200"
            :maximum="200"
            :smallChange="10"
            :largeChange="30"
            spinButtonPlacementMode="Inline"
            @update:modelValue="onVerticalVelocityChanged" />
        </div>
      </template>
    </WinControlExample>

    <!-- Example 3: Programmatic scroll with custom animation -->
    <WinControlExample
      headerText="ScrollView programmatic scroll with custom animation"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <p style="max-width: 600px;">
            Pick an animation type and its duration and then click the button on the right to launch a programmatic scroll.
          </p>

          <WinScrollViewer
            ref="scrollView3Ref"
            :width="400"
            :height="300"
            :isTabStop="true"
            horizontalAlignment="Left"
            verticalAlignment="Top">
            <div style="display: flex; flex-direction: column;">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800" alt="leaves" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800" alt="carousel" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1507069009738-de3f6f155e3a?w=800" alt="bicycles" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800" alt="pond" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800" alt="marina" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" alt="beach" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800" alt="rampart" style="display: block; width: 100%; height: auto;" />
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" alt="mountain" style="display: block; width: 100%; height: auto;" />
            </div>
          </WinScrollViewer>
        </div>

        <div style="display: grid; grid-template-columns: auto 1fr; gap: 12px 16px; align-items: center; min-width: 320px;">
          <span>Scroll with animation</span>
          <WinComboBox
            v-model="verticalAnimation"
            :options="animationOptions"
            style="width: 100%;" />

          <span>Animation duration (msec)</span>
          <WinNumberBox
            v-model="animationDuration"
            :minimum="1000"
            :maximum="5000"
            :smallChange="500"
            :largeChange="1000"
            spinButtonPlacementMode="Inline" />

          <div style="grid-column: 1 / -1;">
            <WinButton
              @click="scrollWithAnimation"
              style="width: 100%;">
              Scroll with animation
            </WinButton>
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue'
import WinButton from '../components/WinButton.vue'
import WinToggleButton from '../components/WinToggleButton.vue'
import WinControlExample from '../components/WinControlExample.vue'
import WinComboBox from '../components/WinComboBox.vue'
import WinNumberBox from '../components/WinNumberBox.vue'
import WinScrollViewer from '../components/WinScrollViewer.vue'
import { usePageTheme } from '../composables/usePageTheme'
import { useFavorites } from '../composables/useFavorites'

// Get current page info
const currentPage = inject<{ key: string, title: string }>('currentPage')

// Theme and favorites
const { theme: pageTheme, toggleTheme } = usePageTheme()
const { isFavorite, toggleFavorite } = useFavorites(currentPage?.key || 'ScrollView')
const isFavoriteState = ref(isFavorite.value)

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal
})

// Example 1: Content inside ScrollView
const scrollView1Ref = ref<InstanceType<typeof WinScrollViewer>>()
const zoomMode = ref<'Enabled' | 'Disabled'>('Enabled')
const zoomFactor = ref(4)
const horizontalScrollMode = ref<'Enabled' | 'Disabled' | 'Auto'>('Auto')
const verticalScrollMode = ref<'Enabled' | 'Disabled' | 'Auto'>('Auto')
const horizontalScrollBarVisibility = ref<'Auto' | 'Visible' | 'Hidden'>('Auto')
const verticalScrollBarVisibility = ref<'Auto' | 'Visible' | 'Hidden'>('Auto')

const zoomModeOptions = [
  { value: 'Enabled', label: 'Enabled' },
  { value: 'Disabled', label: 'Disabled' }
]

const scrollModeOptions = [
  { value: 'Enabled', label: 'Enabled' },
  { value: 'Disabled', label: 'Disabled' },
  { value: 'Auto', label: 'Auto' }
]

const scrollBarVisibilityOptions = [
  { value: 'Auto', label: 'Auto' },
  { value: 'Visible', label: 'Visible' },
  { value: 'Hidden', label: 'Hidden' }
]

// Example 2: Constant velocity scrolling
const scrollView2Ref = ref<InstanceType<typeof WinScrollViewer>>()
const verticalVelocity = ref(30)
let velocityAnimationFrame: number | null = null

function onVerticalVelocityChanged(value: number) {
  // Stop previous animation
  if (velocityAnimationFrame !== null) {
    cancelAnimationFrame(velocityAnimationFrame)
    velocityAnimationFrame = null
  }

  // Only start scrolling if velocity is significant
  if (Math.abs(value) >= 30 && scrollView2Ref.value) {
    const scroll = () => {
      const el = (scrollView2Ref.value as any)?.scrollViewerRef
      if (el) {
        el.scrollTop += value / 60 // Approximate 60fps

        // Continue animation if velocity is still significant
        if (Math.abs(verticalVelocity.value) >= 30) {
          velocityAnimationFrame = requestAnimationFrame(scroll)
        }
      }
    }
    velocityAnimationFrame = requestAnimationFrame(scroll)
  }
}

// Example 3: Programmatic scroll with custom animation
const scrollView3Ref = ref<InstanceType<typeof WinScrollViewer>>()
const verticalAnimation = ref('Default')
const animationDuration = ref(1500)

const animationOptions = [
  { value: 'Default', label: 'Default' },
  { value: 'Accordion', label: 'Accordion' },
  { value: 'Teleportation', label: 'Teleportation' }
]

function scrollWithAnimation() {
  if (!scrollView3Ref.value) return

  const el = (scrollView3Ref.value as any)?.scrollViewerRef
  if (!el) return

  const startTop = el.scrollTop
  const targetTop = el.scrollHeight / 2 // Scroll to middle
  const distance = targetTop - startTop
  const duration = animationDuration.value
  const startTime = performance.now()

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    let easedProgress: number
    switch (verticalAnimation.value) {
      case 'Accordion':
        // Elastic easing
        easedProgress = progress < 0.5
          ? 0.5 * Math.pow(2 * progress, 2)
          : 1 - 0.5 * Math.pow(2 * (1 - progress), 2)
        break
      case 'Teleportation':
        // Step function - instant jump at midpoint
        easedProgress = progress < 0.5 ? 0 : 1
        break
      default:
        // Default smooth easing
        easedProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
    }

    el.scrollTop = startTop + distance * easedProgress

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

// Code examples
const example1Template = `<WinScrollViewer
  :width="400"
  :height="266"
  zoomMode="Enabled"
  horizontalScrollMode="Auto"
  verticalScrollMode="Auto"
  horizontalScrollBarVisibility="Auto"
  verticalScrollBarVisibility="Auto"
  :isTabStop="true">
  <img src="image.jpg" alt="cliff" />
</WinScrollViewer>`

const example1Vue = `<script setup>
import { ref } from 'vue'
import WinScrollViewer from '../components/WinScrollViewer.vue'

const zoomMode = ref('Enabled')
const zoomFactor = ref(4)
const horizontalScrollMode = ref('Auto')
const verticalScrollMode = ref('Auto')
const horizontalScrollBarVisibility = ref('Auto')
const verticalScrollBarVisibility = ref('Auto')
<\/script>`

const example2Template = `<WinScrollViewer
  :width="400"
  :height="300"
  :isTabStop="true">
  <div style="display: flex; flex-direction: column;">
    <img src="image1.jpg" />
    <img src="image2.jpg" />
    <img src="image3.jpg" />
  </div>
</WinScrollViewer>`

const example2Vue = `<script setup>
import { ref } from 'vue'
import WinScrollViewer from '../components/WinScrollViewer.vue'
import WinNumberBox from '../components/WinNumberBox.vue'

const scrollViewRef = ref()
const verticalVelocity = ref(30)

function onVerticalVelocityChanged(value) {
  // Implement constant velocity scrolling
  const el = scrollViewRef.value?.scrollViewerRef
  if (el && Math.abs(value) >= 30) {
    const scroll = () => {
      el.scrollTop += value / 60
      if (Math.abs(verticalVelocity.value) >= 30) {
        requestAnimationFrame(scroll)
      }
    }
    requestAnimationFrame(scroll)
  }
}
<\/script>`

const example3Template = `<WinScrollViewer
  :width="400"
  :height="300"
  :isTabStop="true">
  <div style="display: flex; flex-direction: column;">
    <img src="image1.jpg" />
    <img src="image2.jpg" />
    <!-- More images -->
  </div>
</WinScrollViewer>`

const example3Vue = `<script setup>
import { ref } from 'vue'
import WinScrollViewer from '../components/WinScrollViewer.vue'
import WinButton from '../components/WinButton.vue'

const scrollViewRef = ref()
const animationDuration = ref(1500)
const verticalAnimation = ref('Default')

function scrollWithAnimation() {
  const el = scrollViewRef.value?.scrollViewerRef
  if (!el) return

  const startTop = el.scrollTop
  const targetTop = el.scrollHeight / 2
  const distance = targetTop - startTop
  const duration = animationDuration.value
  const startTime = performance.now()

  function animate(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Apply easing based on animation type
    let easedProgress
    switch (verticalAnimation.value) {
      case 'Accordion':
        easedProgress = progress < 0.5
          ? 0.5 * Math.pow(2 * progress, 2)
          : 1 - 0.5 * Math.pow(2 * (1 - progress), 2)
        break
      case 'Teleportation':
        easedProgress = progress < 0.5 ? 0 : 1
        break
      default:
        easedProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
    }

    el.scrollTop = startTop + distance * easedProgress

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}
<\/script>`
</script>

<style scoped>
.page-header {
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
}

.page-description {
  margin: 0 0 32px 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--text-fill-color-secondary);
  max-width: 800px;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
}

.icon {
  font-family: 'Segoe MDL2 Assets', 'Segoe Fluent Icons', 'Segoe UI Symbol';
  font-size: 16px;
  line-height: 1;
}

.output-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-fill-color-secondary);
}
</style>
