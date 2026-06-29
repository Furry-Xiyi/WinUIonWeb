<template>
  <h1 class="page-header">GridView</h1>
  <p class="page-description">The GridView lets people browse and select from a collection of items arranged in a grid layout.</p>

  <WinControlExample headerText="Single Selection">
    <template #example>
      <WinGridView :items="items" selectionMode="Single" isItemClickEnabled v-model:selectedItems="singleSel">
        <template #item="{ item }">
          <div class="grid-sample-item">
            <div class="grid-img" :style="{ background: item.color }"></div>
          </div>
        </template>
      </WinGridView>
    </template>
    <template #output>
      <div class="example-output">
        Selected: {{ singleSel.length > 0 ? singleSel[0].title : 'None' }}
      </div>
    </template>
  </WinControlExample>

  <WinControlExample headerText="Multiple Selection">
    <template #example>
      <WinGridView :items="multiItems" selectionMode="Multiple" v-model:selectedItems="multiSel">
        <template #item="{ item }">
          <div class="grid-sample-item">
            <div class="grid-img" :style="{ background: item.color }"></div>
          </div>
        </template>
      </WinGridView>
    </template>
    <template #output>
      <div class="example-output">
        Selected: {{ multiSel.length > 0 ? multiSel.map(s => s.title).join(', ') : 'None' }}
      </div>
    </template>
  </WinControlExample>

  <WinControlExample headerText="Customizable GridView">
    <template #example>
      <WinGridView :items="customItems"
                   :selectionMode="selMode"
                   :isItemClickEnabled="itemClick"
                   :canDragItems="canDrag"
                   :canReorderItems="canReorder"
                   :allowDrop="allowDropVal"
                   v-model:selectedItems="customSel"
                   @reorder="v => customItems = v">

        <template #item="{ item }">
          <div class="grid-sample-item">
            <template v-if="layout === 'Image'">
              <div class="grid-img" :style="{ background: item.color }"></div>
            </template>

            <template v-else-if="layout === 'Icon/Text'">
              <div class="layout-icon-text">
                <div class="layout-icon-text-header">
                  <span class="icon" style="font-size: 16px;">{{ item.icon }}</span>
                  <span class="layout-icon-text-title">{{ item.title }}</span>
                </div>
                <div class="layout-icon-text-desc">{{ item.desc }}</div>
              </div>
            </template>

            <template v-else-if="layout === 'Image/Text'">
              <div class="grid-img" :style="{ background: item.color, height: '100px', flex: 'none' }"></div>
              <div class="layout-imagetext-body">
                <div style="font-weight: 600;">{{ item.title }}</div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">{{ item.desc }}</div>
              </div>
            </template>

            <template v-else-if="layout === 'Text'">
              <div class="layout-text-body">
                <div style="font-weight: 600;">{{ item.title }}</div>
                <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px;">{{ item.desc }}</div>
              </div>
            </template>
          </div>
        </template>
      </WinGridView>
    </template>
    <template #options>
      <div class="options-section">
        <div class="options-label">ItemTemplate</div>
        <div class="options-group">
          <WinRadioButton name="layout" value="Image" v-model="layout">Image</WinRadioButton>
          <WinRadioButton name="layout" value="Icon/Text" v-model="layout">Icon/Text</WinRadioButton>
          <WinRadioButton name="layout" value="Image/Text" v-model="layout">Image/Text</WinRadioButton>
          <WinRadioButton name="layout" value="Text" v-model="layout">Text</WinRadioButton>
        </div>
      </div>

      <div class="options-divider"></div>

      <div class="options-section">
        <div class="options-label">Behaviors</div>
        <div class="options-group">
          <WinCheckBox v-model="itemClick">IsItemClickEnabled</WinCheckBox>
          <WinCheckBox v-model="canDrag">CanDragItems</WinCheckBox>
          <WinCheckBox v-model="canReorder">CanReorderItems</WinCheckBox>
          <WinCheckBox v-model="allowDropVal">AllowDrop</WinCheckBox>
        </div>
      </div>

      <div class="options-divider"></div>

      <div class="options-section">
        <div class="options-label">SelectionMode</div>
        <WinComboBox :options="modeOptions" v-model="selModeIdx" style="width: 100%;" />
      </div>
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinGridView from '../components/WinGridView.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinComboBox from '../components/WinComboBox.vue';

const items = ref(Array.from({ length: 4 }, (_, i) => ({ id: `single-${i}`, title: `Item ${i + 1}`, color: `hsl(${i * 45}, 60%, 50%)` })));
const multiItems = ref(Array.from({ length: 4 }, (_, i) => ({ id: `multi-${i}`, title: `Item ${i + 1}`, color: `hsl(${i * 90 + 30}, 55%, 50%)` })));
const singleSel = ref([]);
const multiSel = ref([]);

const icons = ['', '', '', '', '', ''];
const customItems = ref(Array.from({length: 6}, (_, i) => ({
  id: `custom-${i}`,
  title: `Item ${i+1}`,
  desc: `Description for item ${i+1}`,
  color: `hsl(${i*60}, 55%, 55%)`,
  icon: icons[i % icons.length]
})));
const customSel = ref([]);

const layout = ref('Image');
const itemClick = ref(true);
const canDrag = ref(false);
const canReorder = ref(false);
const allowDropVal = ref(false);

const modeOptions = [
  { label: 'None', value: 'None' },
  { label: 'Single', value: 'Single' },
  { label: 'Multiple', value: 'Multiple' },
  { label: 'Extended', value: 'Extended' }
];
const selModeIdx = ref(0);
const selMode = computed(() => modeOptions[selModeIdx.value].value);
</script>

<style scoped>
  .grid-sample-item {
    width: 190px;
    height: 160px;
    background: var(--card-bg-secondary);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .grid-img {
    width: 100%;
    flex: 1;
  }

  .layout-icon-text {
    display: flex;
    flex-direction: column;
    padding: 12px;
    height: 100%;
    box-sizing: border-box;
  }

  .layout-icon-text-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .layout-icon-text-title {
    font-weight: 600;
    font-size: 14px;
  }

  .layout-icon-text-desc {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 8px;
    flex: 1;
  }

  .layout-imagetext-body {
    padding: 8px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .layout-text-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
  }

  .example-output {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .options-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .options-label {
    font-weight: 600;
    font-size: 14px;
  }

  .options-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .options-divider {
    height: 1px;
    background: var(--stroke-divider);
    margin: 8px 0;
  }
</style>
