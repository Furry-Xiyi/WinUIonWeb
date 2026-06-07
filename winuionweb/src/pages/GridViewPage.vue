<template>
  <h1 class="page-header">GridView</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Single Selection
    </template>
    <template #description>
      Click to select one item at a time.
    </template>
    <WinGridView :items="items" selectionMode="Single" isItemClickEnabled v-model:selectedItems="singleSel">
      <template #item="{ item }">
        <div class="grid-sample-item">
          <div class="grid-img" :style="{ background: item.color }"></div>
          <span style="padding: 4px; font-size: 12px;">{{ item.title }}</span>
        </div>
      </template>
    </WinGridView>
  </WinSettingsCard>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Multiple Selection
    </template>
    <template #description>
      Use checkboxes to select multiple items.
    </template>
    <WinGridView :items="items" selectionMode="Multiple" v-model:selectedItems="multiSel">
      <template #item="{ item }">
        <div class="grid-sample-item">
          <div class="grid-img" :style="{ background: item.color }"></div>
          <span style="padding: 4px; font-size: 12px;">{{ item.title }}</span>
        </div>
      </template>
    </WinGridView>
  </WinSettingsCard>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Drag & Reorder
    </template>
    <template #description>
      Drag items to rearrange their position.
    </template>
    <WinGridView :items="dragItems" selectionMode="None" canDragItems canReorderItems allowDrop @reorder="v => dragItems = v">
      <template #item="{ item }">
        <div class="grid-sample-item">
          <div class="grid-img" :style="{ background: item.color }"></div>
          <span style="padding: 4px; font-size: 12px;">{{ item.title }}</span>
        </div>
      </template>
    </WinGridView>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinGridView from '../components/WinGridView.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const items = Array.from({length: 8}, (_, i) => ({ title: `Item ${i+1}`, color: `hsl(${i*45}, 60%, 50%)` }));
const singleSel = ref([]);
const multiSel = ref([]);
const dragItems = ref(Array.from({length: 6}, (_, i) => ({ title: `Drag ${i+1}`, color: `hsl(${i*60}, 55%, 55%)` })));
</script>

<style scoped>
  .grid-sample-item {
    width: 190px;
    height: 160px;
    background: var(--card-bg-secondary);
    display: flex;
    flex-direction: column;
  }

  .grid-img {
    width: 100%;
    height: 130px;
  }
</style>
