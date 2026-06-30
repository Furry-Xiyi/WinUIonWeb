<template>
  <div class="win-number-box" :class="{ 'has-spinner': spinButtonPlacementMode === 'Inline' }">
    <input
      ref="inputRef"
      type="number"
      class="number-input"
      :value="modelValue"
      :min="minimum"
      :max="maximum"
      :step="step"
      :disabled="disabled"
      @input="handleInput"
      @change="handleChange"
      @blur="handleBlur" />

    <div v-if="spinButtonPlacementMode === 'Inline'" class="spin-buttons">
      <button
        type="button"
        class="spin-button spin-up"
        :disabled="disabled || (maximum !== undefined && modelValue >= maximum)"
        @click="increment"
        tabindex="-1">
        <span class="icon">&#xE70E;</span>
      </button>
      <button
        type="button"
        class="spin-button spin-down"
        :disabled="disabled || (minimum !== undefined && modelValue <= minimum)"
        @click="decrement"
        tabindex="-1">
        <span class="icon">&#xE70D;</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  // 官方属性：Value - 当前值
  modelValue: {
    type: Number,
    default: 0
  },
  // 官方属性：Minimum - 最小值
  minimum: {
    type: Number,
    default: undefined
  },
  // 官方属性：Maximum - 最大值
  maximum: {
    type: Number,
    default: undefined
  },
  // 官方属性：SmallChange - 步进值
  step: {
    type: Number,
    default: 1
  },
  // 官方属性：SpinButtonPlacementMode - 按钮位置 ("Inline" | "Compact" | "Hidden")
  spinButtonPlacementMode: {
    type: String,
    default: 'Hidden'
  },
  // 官方属性：IsEnabled
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'valueChanged']);

const inputRef = ref(null);

const handleInput = (event) => {
  const value = event.target.value === '' ? 0 : parseFloat(event.target.value);
  if (!isNaN(value)) {
    updateValue(value);
  }
};

const handleChange = (event) => {
  const value = event.target.value === '' ? 0 : parseFloat(event.target.value);
  if (!isNaN(value)) {
    updateValue(value);
    emit('valueChanged', value);
  }
};

const handleBlur = () => {
  // 确保值在范围内
  let value = props.modelValue;
  if (props.minimum !== undefined && value < props.minimum) {
    value = props.minimum;
  }
  if (props.maximum !== undefined && value > props.maximum) {
    value = props.maximum;
  }
  if (value !== props.modelValue) {
    updateValue(value);
  }
};

const updateValue = (value) => {
  let newValue = value;
  if (props.minimum !== undefined) {
    newValue = Math.max(props.minimum, newValue);
  }
  if (props.maximum !== undefined) {
    newValue = Math.min(props.maximum, newValue);
  }
  emit('update:modelValue', newValue);
};

const increment = () => {
  const newValue = props.modelValue + props.step;
  if (props.maximum === undefined || newValue <= props.maximum) {
    updateValue(newValue);
    emit('valueChanged', newValue);
  }
};

const decrement = () => {
  const newValue = props.modelValue - props.step;
  if (props.minimum === undefined || newValue >= props.minimum) {
    updateValue(newValue);
    emit('valueChanged', newValue);
  }
};
</script>

<style scoped>
.win-number-box {
  display: inline-flex;
  align-items: center;
  position: relative;
  background: var(--control-fill-color-default);
  border: 1px solid var(--control-stroke-color-default);
  border-radius: 4px;
  transition: all var(--fast-duration) var(--fast-out-slow-in);
  min-height: 32px;
}

.win-number-box:hover {
  background: var(--control-fill-color-secondary);
  border-color: var(--control-stroke-secondary);
}

.win-number-box:focus-within {
  background: var(--control-fill-input-active);
  border-color: var(--control-stroke-focus);
  outline: 2px solid var(--control-stroke-focus-outer);
  outline-offset: 1px;
}

.number-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 4px 8px;
  font-size: 14px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: var(--text-fill-color-primary);
  min-width: 0;
}

.number-input:disabled {
  color: var(--text-fill-color-disabled);
  cursor: not-allowed;
}

/* Hide default number spinners */
.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input[type=number] {
  -moz-appearance: textfield;
}

.win-number-box.has-spinner .number-input {
  padding-right: 4px;
}

.spin-buttons {
  display: flex;
  flex-direction: column;
  margin-right: 4px;
}

.spin-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--text-fill-color-secondary);
  transition: all var(--fast-duration) var(--fast-out-slow-in);
}

.spin-button:hover:not(:disabled) {
  background: var(--subtle-fill-color-secondary);
  color: var(--text-fill-color-primary);
}

.spin-button:active:not(:disabled) {
  background: var(--subtle-tertiary);
}

.spin-button:disabled {
  color: var(--text-fill-color-disabled);
  cursor: not-allowed;
}

.spin-button .icon {
  font-size: 10px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  line-height: 1;
}

.spin-up {
  border-bottom: 1px solid var(--control-stroke-color-default);
}

@media (prefers-color-scheme: dark) {
  .win-number-box {
    background: rgba(255, 255, 255, 0.05);
  }

  .win-number-box:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>
