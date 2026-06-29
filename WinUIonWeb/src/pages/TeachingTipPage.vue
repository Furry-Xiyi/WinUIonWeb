<template>
  <div class="control-page">
    <h1 class="page-header">TeachingTip</h1>
    <p class="page-description">
      A teaching tip is a notification flyout used to provide contextually relevant information. It supports rich content (including titles, subtitles, icons, images, and text) and can be configured for either explicit or light-dismiss.
    </p>

    <!-- Example 1: Targeted TeachingTip -->
    <WinSettingsCard
      header="Show a targeted TeachingTip on a button."
      description="A teaching tip anchored to the target element with a tail pointing to it.">
      <template #default>
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
    </WinSettingsCard>

    <!-- Example 2: Non-targeted TeachingTip -->
    <WinSettingsCard
      header="Show a non-targeted TeachingTip with buttons."
      description="A floating teaching tip that appears at the center of the screen without a target.">
      <template #default>
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
    </WinSettingsCard>

    <!-- Example 3: TeachingTip with Hero Content -->
    <WinSettingsCard
      header="Show a targeted TeachingTip with hero content on a button."
      description="A teaching tip with an image area at the top (hero content).">
      <template #default>
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
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinButton from '../components/WinButton.vue';
import WinTeachingTip from '../components/WinTeachingTip.vue';

const targetButton1 = ref(null);
const targetButton3 = ref(null);
const showTip1 = ref(false);
const showTip2 = ref(false);
const showTip3 = ref(false);
</script>

<style scoped>
.control-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.tip-container {
  position: relative;
  display: inline-block;
}
</style>
