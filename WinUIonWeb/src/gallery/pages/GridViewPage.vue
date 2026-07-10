<template>
  <WinTextBlock class="page-header" :Text="$t('text.gridview')" />
  <WinTextBlock class="page-description" :Text="$t('text.the-gridview-lets-people-browse-and-select-from')" TextWrapping="WrapWholeWords" />

  <WinTextBlock class="control-example-description" :Text="$t('text.single-selection')" />

  <WinControlExample>
    <template #example>
      <WinGridView :ItemsSource="items" SelectionMode="Single" IsItemClickEnabled v-model:SelectedItems="singleSel">
        <template #item="{ item }">
          <div class="grid-sample-item">
            <div class="grid-img" :style="{ background: item.color }"></div>
          </div>
        </template>
      </WinGridView>
    </template>
    <template #options>
      <WinTextBlock class="grid-output" :Text="`Selected: ${singleSel.length > 0 ? singleSel[0].title : 'None'}`" />
    </template>
  </WinControlExample>

  <WinTextBlock class="control-example-description" Text="Multiple Selection" />

  <WinControlExample>
    <template #example>
      <WinGridView :ItemsSource="multiItems" SelectionMode="Multiple" v-model:SelectedItems="multiSel">
        <template #item="{ item }">
          <div class="grid-sample-item">
            <div class="grid-img" :style="{ background: item.color }"></div>
          </div>
        </template>
      </WinGridView>

    </template>
    <template #options>
      <WinTextBlock class="grid-output" :Text="`Selected: ${multiSel.length > 0 ? multiSel.map(s => s.title).join(', ') : 'None'}`" />
    </template>
  </WinControlExample>

  <WinTextBlock class="control-example-description" Text="Customizable GridView" />

  <WinControlExample>
    <template #example>
      <WinGridView :ItemsSource="customItems"
                   :SelectionMode="selMode"
                   :IsItemClickEnabled="itemClick"
                   :CanDragItems="canDrag"
                   :CanReorderItems="canReorder"
                   :AllowDrop="allowDropVal"
                   v-model:SelectedItems="customSel"
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
                  <WinTextBlock class="layout-icon-text-title" :Text="item.title" />
                </div>
                <WinTextBlock class="layout-icon-text-desc" :Text="item.desc" />
              </div>
            </template>

            <template v-else-if="layout === 'Image/Text'">
              <div class="grid-img" :style="{ background: item.color, height: '100px', flex: 'none' }"></div>
              <div class="layout-imagetext-body">
                <WinTextBlock style="font-weight: 600;" :Text="item.title" />
                <WinTextBlock style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;" :Text="item.desc" />
              </div>
            </template>

            <template v-else-if="layout === 'Text'">
              <div class="layout-text-body">
                <WinTextBlock style="font-weight: 600;" :Text="item.title" />
                <WinTextBlock style="font-size: 13px; color: var(--text-secondary); margin-top: 6px;" :Text="item.desc" />
              </div>
            </template>
          </div>
        </template>
      </WinGridView>

      <div class="options-section">
        <WinTextBlock class="options-label" Text="ItemTemplate" />
        <div class="options-group">
          <WinRadioButton name="layout" value="Image" v-model="layout">Image</WinRadioButton>
          <WinRadioButton name="layout" value="Icon/Text" v-model="layout">Icon/Text</WinRadioButton>
          <WinRadioButton name="layout" value="Image/Text" v-model="layout">Image/Text</WinRadioButton>
          <WinRadioButton name="layout" value="Text" v-model="layout">Text</WinRadioButton>
        </div>
      </div>

      <div class="options-divider"></div>

      <div class="options-section">
        <WinTextBlock class="options-label" Text="Behaviors" />
        <div class="options-group">
          <WinCheckBox v-model="itemClick">IsItemClickEnabled</WinCheckBox>
          <WinCheckBox v-model="canDrag">CanDragItems</WinCheckBox>
          <WinCheckBox v-model="canReorder">CanReorderItems</WinCheckBox>
          <WinCheckBox v-model="allowDropVal">AllowDrop</WinCheckBox>
        </div>
      </div>

      <div class="options-divider"></div>

      <div class="options-section">
        <WinTextBlock class="options-label" Text="SelectionMode" />
        <WinComboBox :options="modeOptions" v-model="selModeIdx" style="width: 100%;" />
      </div>
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinGridView from '../../components/WinGridView.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinComboBox from '../../components/WinComboBox.vue';

import { useI18n } from '../../components/i18n/index';

const { t } = useI18n();
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
  { label: t('text.none'), value: 'None' },
  { label: t('text.single'), value: 'Single' },
  { label: t('text.multiple'), value: 'Multiple' },
  { label: t('text.extended'), value: 'Extended' }
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

  .grid-output {
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
.control-example-description {
  margin-top: 16px;
  font-weight: 600;
}
</style>
