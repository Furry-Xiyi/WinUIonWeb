<template>
  <h1 class="page-header">TeachingTip</h1>

  <WinSettingsCard contentPlacement="bottom">
    <template #header>Show a targeted TeachingTip on a button.</template>
    <template #description>A teaching tip anchored above the target element with a tail.</template>
    <div class="tip-anchor">
      <WinButton @click="showTip1 = !showTip1">Show TeachingTip</WinButton>
      <WinTeachingTip :visible="showTip1"
                      title="This is the title"
                      subtitle="And this is the subtitle"
                      @close="showTip1 = false">
        <template #icon>
          <span class="icon">&#xE72C;</span>
        </template>
      </WinTeachingTip>
    </div>
  </WinSettingsCard>

  <WinSettingsCard contentPlacement="bottom">
    <template #header>Show a non-targeted TeachingTip with buttons.</template>
    <template #description>A floating teaching tip at the bottom center of the window.</template>
    <WinButton @click="showTip2 = !showTip2">Show TeachingTip</WinButton>
    <WinTeachingTip :visible="showTip2"
                    :isTargeted="false"
                    title="This is the title"
                    subtitle="And this is the subtitle"
                    @close="showTip2 = false">
      <template #actions>
        <WinButton @click="showTip2 = false">Action button</WinButton>
        <WinButton @click="showTip2 = false">Close button</WinButton>
      </template>
    </WinTeachingTip>
  </WinSettingsCard>

  <WinSettingsCard contentPlacement="bottom">
    <template #header>Show a targeted TeachingTip with hero content on a button.</template>
    <template #description>A teaching tip with an image area at the top.</template>
    <div class="tip-anchor">
      <WinButton @click="showTip3 = !showTip3">Show Teaching Tip</WinButton>
      <WinTeachingTip :visible="showTip3"
                      hasHero
                      title="This is the title"
                      subtitle="And this is the subtitle"
                      :showCloseButton="true"
                      @close="showTip3 = false">
        <template #hero>
          <div class="hero-placeholder"></div>
        </template>
        <p class="tip-description">Description can go here</p>
      </WinTeachingTip>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinButton from '../components/WinButton.vue';
import WinTeachingTip from '../components/WinTeachingTip.vue';

const showTip1 = ref(false);
const showTip2 = ref(false);
const showTip3 = ref(false);
</script>

<style scoped>
.tip-anchor {
  position: relative;
  display: inline-flex;
}

.hero-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--accent-base) 0%, #9C27B0 100%);
}

.tip-description {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
