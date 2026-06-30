<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">NumberBox</h1>
      <p class="page-description">
        The NumberBox control allows users to enter numbers. It supports validation, stepping, and calculating inline expressions such as basic equations.
      </p>
      <div class="page-header-actions">
        <WinButton
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

    <!-- Example 1: NumberBox that evaluates expressions -->
    <WinControlExample
      headerText="A NumberBox that evaluates expressions"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div class="numberbox-wrapper">
          <label class="numberbox-label">Enter an expression:</label>
          <WinNumberBox
            v-model="expressionValue"
            :acceptsExpression="true"
            placeholder="1 + 2^2"
            class="example-numberbox" />
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: NumberBox with spin button -->
    <WinControlExample
      headerText="A NumberBox with a spin button"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div class="numberbox-wrapper">
          <label class="numberbox-label">Enter an integer:</label>
          <WinNumberBox
            v-model="spinValue"
            :spinButtonPlacementMode="spinPlacementMode"
            :smallChange="10"
            :largeChange="100"
            class="example-numberbox" />
        </div>
      </template>
      <template #options>
        <div class="options-group">
          <label class="options-label">SpinButton placement</label>
          <div class="radio-group">
            <WinRadioButton
              v-model="spinPlacementMode"
              value="Inline">
              Inline
            </WinRadioButton>
            <WinRadioButton
              v-model="spinPlacementMode"
              value="Compact">
              Compact
            </WinRadioButton>
          </div>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 3: Formatted NumberBox -->
    <WinControlExample
      headerText="A formatted NumberBox that rounds to the nearest 0.25"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div class="numberbox-wrapper">
          <label class="numberbox-label">Enter a dollar amount:</label>
          <WinNumberBox
            v-model="formattedValue"
            placeholder="0.00"
            :step="0.25"
            class="example-numberbox"
            @valueChanged="handleFormattedChange" />
        </div>

        <p class="output-text">{{ formattedOutput }}</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinNumberBox from '../components/WinNumberBox.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'numberbox');

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

// Example 1: Expression evaluation
const expressionValue = ref(NaN);

const example1Template = `<div class="numberbox-wrapper">
  <label class="numberbox-label">Enter an expression:</label>
  <WinNumberBox
    v-model="expressionValue"
    :acceptsExpression="true"
    placeholder="1 + 2^2" />
</div>`;

const example1Vue = `const expressionValue = ref(NaN);

// NumberBox with AcceptsExpression="True" can evaluate basic math expressions
// like "1 + 2^2" or "10 * 5 + 3"`;

// Example 2: Spin button
const spinValue = ref(10);
const spinPlacementMode = ref('Compact');

const example2Template = `<div class="numberbox-wrapper">
  <label class="numberbox-label">Enter an integer:</label>
  <WinNumberBox
    v-model="spinValue"
    :spinButtonPlacementMode="spinPlacementMode"
    :smallChange="10"
    :largeChange="100" />
</div>`;

const example2Vue = `const spinValue = ref(10);
const spinPlacementMode = ref('Compact');

// SmallChange: value change on single arrow click
// LargeChange: value change on shift + arrow click`;

// Example 3: Formatted NumberBox
const formattedValue = ref(0);
const formattedOutput = ref('Value: $0.00');

const roundToQuarter = (value) => {
  return Math.round(value * 4) / 4;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const handleFormattedChange = (value) => {
  const rounded = roundToQuarter(value);
  if (rounded !== value) {
    formattedValue.value = rounded;
  }
  formattedOutput.value = `Value: ${formatCurrency(rounded)}`;
};

watch(formattedValue, (newVal) => {
  if (newVal !== null && newVal !== undefined && !isNaN(newVal)) {
    const rounded = roundToQuarter(newVal);
    formattedOutput.value = `Value: ${formatCurrency(rounded)}`;
  }
});

const example3Template = `<div class="numberbox-wrapper">
  <label class="numberbox-label">Enter a dollar amount:</label>
  <WinNumberBox
    v-model="formattedValue"
    placeholder="0.00"
    :step="0.25"
    @valueChanged="handleFormattedChange" />
</div>`;

const example3Vue = `const formattedValue = ref(0);

const roundToQuarter = (value) => {
  return Math.round(value * 4) / 4;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const handleFormattedChange = (value) => {
  const rounded = roundToQuarter(value);
  if (rounded !== value) {
    formattedValue.value = rounded;
  }
  console.log(\`Value: \${formatCurrency(rounded)}\`);
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

.numberbox-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.numberbox-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.example-numberbox {
  width: 250px;
}

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}

.options-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.options-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'Segoe UI', system-ui, sans-serif;
  margin: 0;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
