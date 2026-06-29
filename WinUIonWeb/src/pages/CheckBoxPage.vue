<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">CheckBox</h1>
      <p class="page-description">
        CheckBox controls let the user select a combination of binary options. In contrast, RadioButton controls allow the user to select from mutually exclusive options. The indeterminate state is used to indicate that an option is set for some, but not all, child options. Don't allow users to set an indeterminate state directly to indicate a third option.
      </p>
      <div class="page-header-actions">
        <WinButton
          subtle
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model="isFavoriteState"
          subtle
          @update:modelValue="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: A 2-state CheckBox -->
    <WinControlExample
      headerText="A 2-state CheckBox"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <WinCheckBox
          v-model="twoStateChecked"
          @checked="onTwoStateChecked"
          @unchecked="onTwoStateUnchecked">
          Two-state CheckBox
        </WinCheckBox>
      </template>
      <template #output>
        <p class="output-text">{{ twoStateOutput }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: A 3-state CheckBox -->
    <WinControlExample
      headerText="A 3-state CheckBox"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
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
      <template #output>
        <p class="output-text">{{ threeStateOutput }}</p>
      </template>
    </WinControlExample>

    <!-- Example 3: Using a 3-state CheckBox for a collection -->
    <WinControlExample
      headerText="Using a 3-state CheckBox"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
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
      <template #output>
        <p class="output-text">{{ selectAllOutput }}</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'checkbox');

const { isFavorite: checkFavorite, toggleFavorite: toggleFav } = useFavorites();
const isFavorite = computed(() => checkFavorite(pageKey.value));
const isFavoriteState = ref(isFavorite.value);

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal;
});

const toggleFavorite = () => {
  toggleFav(pageKey.value);
};

const { pageTheme, toggleTheme: doToggleTheme } = usePageTheme('system');
const toggleTheme = () => doToggleTheme();

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
