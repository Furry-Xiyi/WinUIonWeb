<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">{{ $t('text.checkbox') }}</h1>
      <p class="page-description">
        {{ $t('text.checkbox-controls-let-the-user-select-a-combinat') }}
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon"></span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: A 2-state CheckBox -->
    <p class="control-example-description">{{ $t('text.a-2-state-checkbox') }}</p>
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :xaml="example1Template"
      :cSharp="example1Vue">
      <template #example>
        <WinCheckBox
          v-model="twoStateChecked"
          @checked="onTwoStateChecked"
          @unchecked="onTwoStateUnchecked">
          {{ $t('text.two-state-checkbox') }}
        </WinCheckBox>
      </template>
      <template #options>
        <p class="output-text">{{ twoStateOutput }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: A 3-state CheckBox -->
    <p class="control-example-description">A 3-state CheckBox</p>
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :xaml="example2Template"
      :cSharp="example2Vue">
      <template #example>
        <WinCheckBox
          v-model="threeStateValue"
          :isThreeState="true"
          @checked="onThreeStateChecked"
          @unchecked="onThreeStateUnchecked"
          @indeterminate="onThreeStateIndeterminate">
          Three-state CheckBox
        </WinCheckBox>
      </template>
      <template #options>
        <p class="output-text">{{ threeStateOutput }}</p>
      </template>
    </WinControlExample>

    <!-- Example 3: Using a 3-state CheckBox for a collection -->
    <p class="control-example-description">Using a 3-state CheckBox</p>
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :xaml="example3Template"
      :cSharp="example3Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <WinCheckBox
            :modelValue="selectAllChecked"
            :indeterminate="selectAllIndeterminate"
            @checked="onSelectAllChecked"
            @unchecked="onSelectAllUnchecked">
            Select all
          </WinCheckBox>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-left: 24px;">
            <WinCheckBox v-model="option1Checked" @checked="updateSelectAllState" @unchecked="updateSelectAllState">
              Option 1
            </WinCheckBox>
            <WinCheckBox v-model="option2Checked" @checked="updateSelectAllState" @unchecked="updateSelectAllState">
              Option 2
            </WinCheckBox>
            <WinCheckBox v-model="option3Checked" @checked="updateSelectAllState" @unchecked="updateSelectAllState">
              Option 3
            </WinCheckBox>
          </div>
        </div>
      </template>
      <template #options>
        <p class="output-text">{{ selectAllOutput }}</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'checkbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example 1: 2-state CheckBox
const twoStateChecked = ref(false);
const twoStateOutput = ref('CheckBox is unchecked');

const onTwoStateChecked = () => {
  twoStateOutput.value = 'CheckBox is checked';
};

const onTwoStateUnchecked = () => {
  twoStateOutput.value = 'CheckBox is unchecked';
};

// 示例1代码
const example1Template = `<WinCheckBox
  v-model="twoStateChecked"
  @checked="onTwoStateChecked"
  @unchecked="onTwoStateUnchecked">
  Two-state CheckBox
</WinCheckBox>`;

const example1Vue = `const twoStateChecked = ref(false);

const onTwoStateChecked = () => {
  console.log('CheckBox is checked');
};

const onTwoStateUnchecked = () => {
  console.log('CheckBox is unchecked');
};`;

// Example 2: 3-state CheckBox
const threeStateValue = ref(null); // null = indeterminate, true = checked, false = unchecked
const threeStateOutput = ref('CheckBox is indeterminate');

const onThreeStateChecked = () => {
  threeStateOutput.value = 'CheckBox is checked';
};

const onThreeStateUnchecked = () => {
  threeStateOutput.value = 'CheckBox is unchecked';
};

const onThreeStateIndeterminate = () => {
  threeStateOutput.value = 'CheckBox is indeterminate';
};

// 示例2代码
const example2Template = `<WinCheckBox
  v-model="threeStateValue"
  :isThreeState="true"
  @checked="onThreeStateChecked"
  @unchecked="onThreeStateUnchecked"
  @indeterminate="onThreeStateIndeterminate">
  Three-state CheckBox
</WinCheckBox>`;

const example2Vue = `const threeStateValue = ref(null);

const onThreeStateChecked = () => {
  console.log('CheckBox is checked');
};

const onThreeStateUnchecked = () => {
  console.log('CheckBox is unchecked');
};

const onThreeStateIndeterminate = () => {
  console.log('CheckBox is indeterminate');
};`;

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

const onSelectAllChecked = () => {
  option1Checked.value = true;
  option2Checked.value = true;
  option3Checked.value = true;
};

const onSelectAllUnchecked = () => {
  option1Checked.value = false;
  option2Checked.value = false;
  option3Checked.value = false;
};

const updateSelectAllState = () => {
  // Computed properties automatically handle this
};

// 示例3代码
const example3Template = `<div style="display: flex; flex-direction: column; gap: 8px;">
  <WinCheckBox
    :modelValue="selectAllChecked"
    :indeterminate="selectAllIndeterminate"
    @checked="onSelectAllChecked"
    @unchecked="onSelectAllUnchecked">
    Select all
  </WinCheckBox>
  <div style="margin-left: 24px;">
    <WinCheckBox v-model="option1Checked">Option 1</WinCheckBox>
    <WinCheckBox v-model="option2Checked">Option 2</WinCheckBox>
    <WinCheckBox v-model="option3Checked">Option 3</WinCheckBox>
  </div>
</div>`;

const example3Vue = `const option1Checked = ref(false);
const option2Checked = ref(false);
const option3Checked = ref(false);

const selectAllChecked = computed(() =>
  option1Checked.value && option2Checked.value && option3Checked.value
);

const selectAllIndeterminate = computed(() => {
  const count = [option1Checked, option2Checked, option3Checked]
    .filter(Boolean).length;
  return count > 0 && count < 3;
});

const onSelectAllChecked = () => {
  option1Checked.value = true;
  option2Checked.value = true;
  option3Checked.value = true;
};

const onSelectAllUnchecked = () => {
  option1Checked.value = false;
  option2Checked.value = false;
  option3Checked.value = false;
};`;
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

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.icon {
  font-size: 16px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>




