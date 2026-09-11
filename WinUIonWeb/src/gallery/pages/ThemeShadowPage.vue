<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
          <h1 class="page-header">ThemeShadow</h1>
          <p class="page-description">
            ThemeShadow is a pre-configured shadow effect that can be applied to any XAML element to draw appropriate shadows based on x, y, z coordinates.
          </p>
          <div class="page-header-actions">
            <Button class="header-action" @click="toggleTheme"
             >
              <span class="icon">&#xE793;</span>
            </Button>
            <ToggleButton class="header-action" :IsChecked="isFavoriteState"
              @update:IsChecked="toggleFavorite"
             >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Example 1: ThemeShadow applied to a Border -->
            <ControlExample
              headerText="ThemeShadow applied to a Border"
              :theme="pageTheme"
              exampleHeight="320px"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <div class="shadow-container">
                  <div ref="shadowReceiver" class="shadow-receiver"></div>
                  <div
                    ref="shadowCaster"
                    class="shadow-caster"
                    :style="{
                      transform: `translateZ(${zTranslation}px)`,
                      boxShadow: computedShadow
                    }">
                  </div>
                </div>
              </template>
              <template #options>
                <Slider
                  v-model="zTranslation"
                  header="Z-translation"
                  :min="0"
                  :max="64"
                  :stepFrequency="1"
                  style="width: 200px;"
                />
              </template>
            </ControlExample>
      </div>
    </ScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import ControlExample from '../../components/ControlExample.vue';
import Button from '../../components/Button.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import Slider from '../../components/Slider.vue';

import ScrollViewer from '../../components/ScrollViewer.vue';
import { createPageState } from '../../utils/pageState';
// Theme management
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'themeshadow');
const { pageTheme, isFavoriteState, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Shadow state
const zTranslation = ref(32);
const shadowReceiver = ref(null);
const shadowCaster = ref(null);

// Computed shadow based on z-translation
const computedShadow = computed(() => {
  const depth = zTranslation.value;
  const blur = Math.max(8, depth * 0.5);
  const spread = 0;
  const offsetY = Math.max(4, depth * 0.3);
  const opacity = Math.min(0.26, 0.13 + (depth / 64) * 0.13);

  return `0 ${offsetY}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`;
});

onMounted(() => {
  // Initialize shadow receiver (equivalent to shadow.Receivers.Add(ShadowCastGrid))
  if (shadowReceiver.value && shadowCaster.value) {
    // In WinUI, ThemeShadow.Receivers determines what elements receive the shadow
    // In web implementation, this is handled by CSS positioning and z-index
  }
});

// Code examples
const example1Template = `<div class="shadow-container">
  <div class="shadow-receiver"></div>
  <div
    class="shadow-caster"
    :style="{
      transform: \`translateZ(\${zTranslation}px)\`,
      boxShadow: computedShadow
    }">
  </div>
</div>

<Slider
  v-model="zTranslation"
  header="Z-translation"
  :min="0"
  :max="64"
  :stepFrequency="1"
/>`;

const example1Vue = `import { ref, computed } from 'vue';

const zTranslation = ref(32);

const computedShadow = computed(() => {
  const depth = zTranslation.value;
  const blur = Math.max(8, depth * 0.5);
  const offsetY = Math.max(4, depth * 0.3);
  const opacity = Math.min(0.26, 0.13 + (depth / 64) * 0.13);

  return \`0 \${offsetY}px \${blur}px 0px rgba(0, 0, 0, \${opacity})\`;
});`;
</script>

<style scoped>
.page-header {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
}

.page-description {
  margin: 0 0 24px 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--text-secondary);
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
  font-size: 16px;
  display: inline-block;
  line-height: 1;
}

.shadow-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36px;
}

.shadow-receiver {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.shadow-caster {
  width: 200px;
  height: 200px;
  background: var(--card-bg-default);
  border-radius: 8px;
  position: relative;
  z-index: 1;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
</style>
