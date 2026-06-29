<template>
  <div>
    <h1 class="page-header">CheckBox</h1>
    <p class="page-description">
      CheckBox controls let the user select a combination of binary options. In contrast, RadioButton controls allow the user to select from mutually exclusive options. The indeterminate state is used to indicate that an option is set for some, but not all, child options. Don't allow users to set an indeterminate state directly to indicate a third option.
    </p>

    <!-- Example 1: A 2-state CheckBox -->
    <WinControlExample headerText="A 2-state CheckBox">
      <template #example>
        <WinCheckBox v-model="twoStateChecked" @change="onTwoStateChanged">
          Two-state CheckBox
        </WinCheckBox>
      </template>
      <template #output>
        <p class="output-text">{{ twoStateOutput }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: A 3-state CheckBox -->
    <WinControlExample headerText="A 3-state CheckBox">
      <template #example>
        <WinCheckBox v-model="threeStateValue" :three-state="true" @change="onThreeStateChanged">
          Three-state CheckBox
        </WinCheckBox>
      </template>
      <template #output>
        <p class="output-text">{{ threeStateOutput }}</p>
      </template>
    </WinControlExample>

    <!-- Example 3: Using a 3-state CheckBox for a collection -->
    <WinControlExample headerText="Using a 3-state CheckBox">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <WinCheckBox
            :modelValue="selectAllChecked"
            :indeterminate="selectAllIndeterminate"
            @change="onSelectAllChanged">
            Select all
          </WinCheckBox>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-left: 24px;">
            <WinCheckBox v-model="option1Checked" @change="updateSelectAllState">
              Option 1
            </WinCheckBox>
            <WinCheckBox v-model="option2Checked" @change="updateSelectAllState">
              Option 2
            </WinCheckBox>
            <WinCheckBox v-model="option3Checked" @change="updateSelectAllState">
              Option 3
            </WinCheckBox>
          </div>
        </div>
      </template>
      <template #output>
        <p class="output-text">{{ selectAllOutput }}</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinControlExample from '../components/WinControlExample.vue';

// Example 1: 2-state CheckBox
const twoStateChecked = ref(false);
const twoStateOutput = ref('CheckBox is unchecked');

const onTwoStateChanged = () => {
  twoStateOutput.value = twoStateChecked.value ? 'CheckBox is checked' : 'CheckBox is unchecked';
};

// Example 2: 3-state CheckBox
const threeStateValue = ref(null); // null = indeterminate, true = checked, false = unchecked
const threeStateOutput = ref('CheckBox is indeterminate');

const onThreeStateChanged = () => {
  if (threeStateValue.value === null) {
    threeStateOutput.value = 'CheckBox is indeterminate';
  } else if (threeStateValue.value === true) {
    threeStateOutput.value = 'CheckBox is checked';
  } else {
    threeStateOutput.value = 'CheckBox is unchecked';
  }
};

// Example 3: Select all
const option1Checked = ref(false);
const option2Checked = ref(false);
const option3Checked = ref(false);

const selectAllChecked = computed(() =>
  option1Checked.value && option2Checked.value && option3Checked.value
);

const selectAllIndeterminate = computed(() => {
  const checkedCount = [option1Checked.value, option2Checked.value, option3Checked.value].filter(Boolean).length;
  return checkedCount > 0 && checkedCount < 3;
});

const selectAllOutput = computed(() => {
  const checkedCount = [option1Checked.value, option2Checked.value, option3Checked.value].filter(Boolean).length;
  if (checkedCount === 0) return 'Nothing is checked';
  if (checkedCount === 3) return 'All options are checked';
  return `${checkedCount} option${checkedCount > 1 ? 's' : ''} checked`;
});

const onSelectAllChanged = (newValue) => {
  option1Checked.value = newValue;
  option2Checked.value = newValue;
  option3Checked.value = newValue;
};

const updateSelectAllState = () => {
  // Computed properties automatically handle this
};
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
