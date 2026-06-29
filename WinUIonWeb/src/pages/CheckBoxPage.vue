<template>
  <div class="control-page">
    <h1 class="page-header">CheckBox</h1>
    <p class="page-description">
      CheckBox controls let the user select a combination of binary options. In contrast, RadioButton controls allow the user to select from mutually exclusive options. The indeterminate state is used to indicate that an option is set for some, but not all, child options.
    </p>

    <!-- Example 1: Two-state CheckBox -->
    <WinSettingsCard
      header="A two-state CheckBox."
      description="Use a two-state CheckBox for a single option that the user can switch on or off.">
      <template #default>
        <WinCheckBox
          v-model="twoStateChecked"
          @change="onTwoStateChanged">
          Two-state CheckBox
        </WinCheckBox>
      </template>
      <template #output>
        <div v-if="twoStateOutput" class="output-text">{{ twoStateOutput }}</div>
      </template>
    </WinSettingsCard>

    <!-- Example 2: Three-state CheckBox -->
    <WinSettingsCard
      header="A three-state CheckBox."
      description="Use a three-state CheckBox to represent an option that can be checked, unchecked, or indeterminate.">
      <template #default>
        <WinCheckBox
          v-model="threeStateValue"
          :three-state="true"
          @change="onThreeStateChanged">
          Three-state CheckBox
        </WinCheckBox>
      </template>
      <template #output>
        <div v-if="threeStateOutput" class="output-text">{{ threeStateOutput }}</div>
      </template>
    </WinSettingsCard>

    <!-- Example 3: Select All CheckBox -->
    <WinSettingsCard
      header="Using indeterminate state to represent a collection"
      description="Use a three-state CheckBox to represent a collection with partial selection.">
      <template #default>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <WinCheckBox
            :modelValue="selectAllChecked"
            :indeterminate="selectAllIndeterminate"
            @change="onSelectAllChanged">
            Select all
          </WinCheckBox>
          <div style="margin-left: 24px; display: flex; flex-direction: column; gap: 8px;">
            <WinCheckBox
              v-model="option1Checked"
              @change="onOptionChanged">
              Option 1
            </WinCheckBox>
            <WinCheckBox
              v-model="option2Checked"
              @change="onOptionChanged">
              Option 2
            </WinCheckBox>
            <WinCheckBox
              v-model="option3Checked"
              @change="onOptionChanged">
              Option 3
            </WinCheckBox>
          </div>
        </div>
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

// Two-state example
const twoStateChecked = ref(false);
const twoStateOutput = ref('');

const onTwoStateChanged = () => {
  twoStateOutput.value = twoStateChecked.value ? 'Checked' : 'Unchecked';
};

// Three-state example
const threeStateValue = ref(null); // null = indeterminate, true = checked, false = unchecked
const threeStateOutput = ref('');

const onThreeStateChanged = () => {
  if (threeStateValue.value === null) {
    threeStateOutput.value = 'Indeterminate';
  } else if (threeStateValue.value === true) {
    threeStateOutput.value = 'Checked';
  } else {
    threeStateOutput.value = 'Unchecked';
  }
};

// Select all example
const option1Checked = ref(false);
const option2Checked = ref(true);
const option3Checked = ref(false);

const selectAllChecked = computed(() =>
  option1Checked.value && option2Checked.value && option3Checked.value
);

const selectAllIndeterminate = computed(() => {
  const checkedCount = [option1Checked.value, option2Checked.value, option3Checked.value].filter(Boolean).length;
  return checkedCount > 0 && checkedCount < 3;
});

const onSelectAllChanged = (newValue) => {
  option1Checked.value = newValue;
  option2Checked.value = newValue;
  option3Checked.value = newValue;
};

const onOptionChanged = () => {
  // This function is called when individual options change
  // The computed properties will automatically update selectAll state
};
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

.output-text {
  padding: 8px 12px;
  background: var(--card-background-secondary);
  border-radius: 4px;
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 13px;
  margin-top: 12px;
}
</style>
