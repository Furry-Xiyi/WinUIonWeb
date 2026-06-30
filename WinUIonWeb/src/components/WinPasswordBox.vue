<template>
  <div class="password-box-container" :class="{ 'disabled': disabled }">
    <label v-if="header" class="password-box-header">{{ header }}</label>
    <div class="password-box-wrapper">
      <input
        ref="inputRef"
        :type="revealMode === 'Visible' ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholderText"
        :disabled="disabled"
        :maxlength="maxLength"
        class="password-box-input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <button
        v-if="passwordRevealMode !== 'Hidden'"
        class="reveal-button"
        :class="{ 'revealed': revealMode === 'Visible' }"
        @mousedown.prevent="handleRevealMouseDown"
        @mouseup.prevent="handleRevealMouseUp"
        @mouseleave="handleRevealMouseLeave"
        :disabled="disabled"
        type="button"
        tabindex="-1">
        <span class="reveal-icon">{{ revealMode === 'Visible' ? '&#xED1A;' : '&#xED1B;' }}</span>
      </button>
    </div>
    <p v-if="description" class="password-box-description">{{ description }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  header: {
    type: String,
    default: ''
  },
  placeholderText: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  passwordChar: {
    type: String,
    default: '●'
  },
  passwordRevealMode: {
    type: String,
    default: 'Peek', // 'Peek', 'Hidden', 'Visible'
    validator: (value) => ['Peek', 'Hidden', 'Visible'].includes(value)
  },
  maxLength: {
    type: Number,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'passwordChanged']);

const inputRef = ref(null);
const revealMode = ref(props.passwordRevealMode === 'Visible' ? 'Visible' : 'Hidden');

// Watch for external passwordRevealMode changes
watch(() => props.passwordRevealMode, (newMode) => {
  if (newMode === 'Visible') {
    revealMode.value = 'Visible';
  } else {
    revealMode.value = 'Hidden';
  }
});

const handleInput = (e) => {
  const value = e.target.value;
  emit('update:modelValue', value);
  emit('passwordChanged', value);
};

const handleFocus = () => {
  // Focus handling if needed
};

const handleBlur = () => {
  // Blur handling if needed
};

const handleRevealMouseDown = () => {
  if (props.passwordRevealMode === 'Peek') {
    revealMode.value = 'Visible';
  }
};

const handleRevealMouseUp = () => {
  if (props.passwordRevealMode === 'Peek') {
    revealMode.value = 'Hidden';
  }
};

const handleRevealMouseLeave = () => {
  if (props.passwordRevealMode === 'Peek') {
    revealMode.value = 'Hidden';
  }
};
</script>

<style scoped>
.password-box-container {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
}

.password-box-header {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-fill-color-primary);
  margin: 0;
  padding: 0 0 4px 0;
}

.password-box-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.password-box-input {
  height: 32px;
  min-width: 64px;
  padding: 5px 36px 5px 11px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-fill-color-primary);
  background: var(--control-fill-color-default);
  border: 1px solid var(--control-stroke-color-default);
  border-radius: 4px;
  outline: none;
  transition: all 0.1s ease;
}

.password-box-input::placeholder {
  color: var(--text-placeholder);
}

.password-box-input:hover:not(:disabled) {
  background: var(--control-fill-color-secondary);
  border-color: var(--control-stroke-secondary);
}

.password-box-input:focus {
  background: var(--control-fill-input-active);
  border-color: var(--accent-default);
  border-width: 2px;
  padding: 4px 35px 4px 10px;
}

.password-box-input:disabled {
  background: var(--control-fill-color-disabled);
  border-color: var(--control-stroke-color-default);
  color: var(--text-fill-color-disabled);
  cursor: not-allowed;
}

.reveal-button {
  position: absolute;
  right: 1px;
  top: 1px;
  bottom: 1px;
  width: 32px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 0 3px 3px 0;
  cursor: pointer;
  color: var(--text-fill-color-secondary);
  transition: background 0.1s ease;
  padding: 0;
}

.reveal-button:hover:not(:disabled) {
  background: var(--subtle-fill-color-secondary);
  color: var(--text-fill-color-primary);
}

.reveal-button:active:not(:disabled) {
  background: var(--subtle-fill-tertiary);
}

.reveal-button:disabled {
  color: var(--text-fill-color-disabled);
  cursor: not-allowed;
}

.reveal-icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 12px;
  line-height: 1;
  user-select: none;
}

.password-box-description {
  font-size: 12px;
  color: var(--text-fill-color-secondary);
  margin: 0;
  padding: 0;
}

.password-box-container.disabled {
  opacity: 0.5;
}
</style>
