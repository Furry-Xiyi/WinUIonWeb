<template>
  <div>
    <h1 class="page-header">TeachingTip</h1>
    <p class="page-description">
      A teaching tip is a notification flyout used to provide contextually relevant information. It supports rich content (including titles, subtitles, icons, images, and text) and can be configured for either explicit or light-dismiss.
    </p>

    <!-- Example 1: Targeted TeachingTip -->
    <WinControlExample headerText="Show a targeted TeachingTip on a button.">
      <template #example>
        <div class="tip-container">
          <WinButton ref="targetButton1" @click="showTip1 = !showTip1">
            Show TeachingTip
          </WinButton>
          <WinTeachingTip
            :visible="showTip1"
            :target="targetButton1"
            title="This is the title"
            subtitle="And this is the subtitle"
            @close="showTip1 = false">
            <template #icon>
              <span style="font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets'; font-size: 16px;"></span>
            </template>
          </WinTeachingTip>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: Non-targeted TeachingTip -->
    <WinControlExample headerText="Show a non-targeted TeachingTip with buttons.">
      <template #example>
        <WinButton @click="showTip2 = !showTip2">
          Show TeachingTip
        </WinButton>
        <WinTeachingTip
          :visible="showTip2"
          :isTargeted="false"
          title="This is the title"
          subtitle="And this is the subtitle"
          actionButtonText="Action button"
          closeButtonText="Close button"
          :isLightDismissEnabled="true"
          @action="showTip2 = false"
          @close="showTip2 = false" />
      </template>
    </WinControlExample>

    <!-- Example 3: TeachingTip with Hero Content -->
    <WinControlExample headerText="Show a targeted TeachingTip with hero content on a button.">
      <template #example>
        <div class="tip-container">
          <WinButton ref="targetButton3" @click="showTip3 = !showTip3">
            Show TeachingTip
          </WinButton>
          <WinTeachingTip
            :visible="showTip3"
            :target="targetButton3"
            title="This is the title"
            subtitle="And this is the subtitle"
            preferredPlacement="Bottom"
            @close="showTip3 = false">
            <template #hero>
              <img
                src="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/sunset.jpg"
                alt="Sunset"
                style="width: 100%; height: 100%; object-fit: cover;" />
            </template>
            <template #default>
              <p style="margin: 16px 0 0; font-size: 14px; line-height: 1.5;">
                Description can go here
              </p>
            </template>
          </WinTeachingTip>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinTeachingTip from '../components/WinTeachingTip.vue';

const targetButton1 = ref(null);
const targetButton3 = ref(null);
const showTip1 = ref(false);
const showTip2 = ref(false);
const showTip3 = ref(false);
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.tip-container {
  position: relative;
  display: inline-block;
}
</style>
