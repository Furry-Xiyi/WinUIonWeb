<template>
  <h1 class="page-header">FlipView</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Horizontal FlipView
    </template>
    <template #description>
      Navigate items left and right.
    </template>
    <div style="width: 100%; max-width: 400px; height: 270px; border: 1px solid var(--card-stroke);">
      <WinFlipView :items="items" orientation="horizontal">
        <template #item="{ item }">
          <div :style="{ background: item.color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px' }">
            {{ item.name }}
          </div>
        </template>
      </WinFlipView>
    </div>
  </WinSettingsCard>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Vertical FlipView
    </template>
    <template #description>
      Navigate items up and down.
    </template>
    <div style="width: 100%; max-width: 400px; height: 270px; border: 1px solid var(--card-stroke);">
      <WinFlipView :items="items" orientation="vertical">
        <template #item="{ item }">
          <div :style="{ background: item.color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px' }">
            {{ item.name }}
          </div>
        </template>
      </WinFlipView>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import WinFlipView from '../components/WinFlipView.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const items = [
  { name: 'Cliff', color: '#516a73' },
  { name: 'Grapes', color: '#6a5173' },
  { name: 'Rainier', color: '#51735a' },
  { name: 'Sunset', color: '#735a51' },
  { name: 'Valley', color: '#5a7351' }
];
</script>
