<template>
  <h1 class="page-header">CheckBox</h1>

  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      CheckBox States
    </template>
    <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 4px;">
      <WinCheckBox v-model="val">Normal CheckBox</WinCheckBox>
      <!-- 补齐演示：已选禁用和未选禁用 -->
      <WinCheckBox :modelValue="true" disabled>Checked disabled</WinCheckBox>
      <WinCheckBox :modelValue="false" disabled>Unchecked disabled</WinCheckBox>
    </div>
  </WinSettingsCard>

  <WinSettingsCard contentPlacement="bottom" style="margin-top: 16px;">
    <template #header>
      Three-state CheckBox
    </template>
    <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 4px;">
      <WinCheckBox :modelValue="parentChecked"
                   :indeterminate="parentIndeterminate"
                   @change="onParentChange">
        Select All (Cover Item)
      </WinCheckBox>

      <WinCheckBox v-model="child1" style="margin-left: 32px;">Option 1</WinCheckBox>
      <WinCheckBox v-model="child2" style="margin-left: 32px;">Option 2</WinCheckBox>
      <WinCheckBox v-model="child3" style="margin-left: 32px;">Option 3</WinCheckBox>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const val = ref(true);
const child1 = ref(false);
const child2 = ref(true); // 默认选一个触发横杠
const child3 = ref(false);

const parentChecked = computed(() => child1.value && child2.value && child3.value);

const parentIndeterminate = computed(() => {
  const list = [child1.value, child2.value, child3.value];
  const checkedCount = list.filter(Boolean).length;
  return checkedCount > 0 && checkedCount < list.length;
});

const onParentChange = (newVal) => {
  // 这里的 newVal 是由组件内部逻辑处理过的
  // 如果之前是横杠，newVal 会被强制传回 false
  child1.value = newVal;
  child2.value = newVal;
  child3.value = newVal;
};
</script>
