<template>
  <button
    :class="[
      'win-appbar-toggle-button',
      {
        'is-checked': isChecked === true,
        'is-indeterminate': isChecked === null,
        'is-compact': isCompact
      }
    ]"
    :disabled="disabled"
    :aria-label="ariaLabel || label"
    :aria-pressed="isChecked === null ? 'mixed' : isChecked"
    role="button"
    @click="handleClick"
    @mouseenter="isPointerOver = true"
    @mouseleave="isPointerOver = false"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
  >
    <span class="win-appbar-toggle-button__content">
      <span v-if="icon || $slots.icon" class="win-appbar-toggle-button__icon">
        <slot name="icon">
          <span v-if="icon" :class="['win-symbol-icon', `icon-${icon}`]" aria-hidden="true">
            {{ getSymbolIcon(icon) }}
          </span>
        </slot>
      </span>
      <slot v-if="$slots.default" />
    </span>
    <span v-if="label" class="win-appbar-toggle-button__label">
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props - 完全对齐官方API
const props = withDefaults(defineProps<{
  icon?: string
  label?: string
  isChecked?: boolean | null
  isThreeState?: boolean
  content?: any
  disabled?: boolean
  isCompact?: boolean
  ariaLabel?: string
}>(), {
  icon: undefined,
  label: '',
  isChecked: false,
  isThreeState: false,
  content: null,
  disabled: false,
  isCompact: false,
  ariaLabel: undefined
})

// Emits - 完全对齐官方事件
const emit = defineEmits<{
  click: [event: MouseEvent]
  checked: []
  unchecked: []
  indeterminate: []
  'update:isChecked': [value: boolean | null]
}>()

// State
const isPointerOver = ref(false)
const isPressed = ref(false)
const internalChecked = ref<boolean | null>(props.isChecked)

// Sync internal state with prop
watch(() => props.isChecked, (newVal) => {
  internalChecked.value = newVal
})

// Visual state - 完全对齐官方VisualStates
const visualState = computed(() => {
  if (props.disabled) {
    if (internalChecked.value === true) return 'CheckedDisabled'
    if (internalChecked.value === null) return 'IndeterminateDisabled'
    return 'Disabled'
  }

  if (isPressed.value) {
    if (internalChecked.value === true) return 'CheckedPressed'
    if (internalChecked.value === null) return 'IndeterminatePressed'
    return 'Pressed'
  }

  if (isPointerOver.value) {
    if (internalChecked.value === true) return 'CheckedPointerOver'
    if (internalChecked.value === null) return 'IndeterminatePointerOver'
    return 'PointerOver'
  }

  if (internalChecked.value === true) return 'Checked'
  if (internalChecked.value === null) return 'Indeterminate'
  return 'Normal'
})

// Click handler - 完全对齐官方逻辑
const handleClick = (event: MouseEvent) => {
  if (props.disabled) return

  // 触发Click事件（每次点击都触发）
  emit('click', event)

  const oldValue = internalChecked.value

  // 状态切换逻辑
  if (props.isThreeState) {
    // 三段式：null → true → false → null
    if (oldValue === null) {
      internalChecked.value = true
    } else if (oldValue === true) {
      internalChecked.value = false
    } else {
      internalChecked.value = null
    }
  } else {
    // 二段式：false ⇄ true
    internalChecked.value = !oldValue
  }

  // 触发状态变更事件
  if (oldValue !== internalChecked.value) {
    emit('update:isChecked', internalChecked.value)

    if (internalChecked.value === true) {
      emit('checked')
    } else if (internalChecked.value === false) {
      emit('unchecked')
    } else if (internalChecked.value === null) {
      emit('indeterminate')
    }
  }
}

// Symbol icon mapping (Segoe MDL2 Assets)
const getSymbolIcon = (icon: string): string => {
  const iconMap: Record<string, string> = {
    'Accept': '',
    'Add': '',
    'Cancel': '',
    'Delete': '',
    'Edit': '',
    'Favorite': '',
    'FavoriteOutline': '',
    'More': '',
    'Refresh': '',
    'Save': '',
    'Share': '',
    'Stop': '',
    'Play': '',
    'Pause': '',
    'Forward': '',
    'Back': '',
    'Volume': '',
    'Mute': '',
    'Camera': '',
    'Attach': '',
    'Send': '',
    'OpenFile': '',
    'Clock': '',
    'Download': '',
    'Upload': ''
  }
  return iconMap[icon] || ''
}
</script>

<style scoped>
/* Base button structure */
.win-appbar-toggle-button {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  min-height: 68px;
  padding: 12px 12px 16px;
  margin: 0;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--text-fill-color-primary, rgba(0, 0, 0, 0.9));
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.1s ease, border-color 0.1s ease, color 0.1s ease;
  position: relative;
  box-sizing: border-box;
}

.win-appbar-toggle-button__content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.win-appbar-toggle-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 16px;
  line-height: 1;
}

.win-symbol-icon {
  font-family: 'Segoe MDL2 Assets', 'Segoe UI Symbol';
  font-weight: normal;
  font-style: normal;
}

.win-appbar-toggle-button__label {
  display: block;
  margin-top: 4px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Compact mode */
.win-appbar-toggle-button.is-compact {
  min-width: 40px;
  min-height: 40px;
  padding: 8px;
  flex-direction: row;
  gap: 8px;
}

.win-appbar-toggle-button.is-compact .win-appbar-toggle-button__label {
  margin-top: 0;
}

/* Visual States - Normal */
.win-appbar-toggle-button:hover {
  background-color: var(--control-fill-color-secondary, rgba(0, 0, 0, 0.0373));
}

.win-appbar-toggle-button:active {
  background-color: var(--control-fill-color-tertiary, rgba(0, 0, 0, 0.0241));
  color: var(--text-fill-color-secondary, rgba(0, 0, 0, 0.6));
}

/* Visual States - Checked */
.win-appbar-toggle-button.is-checked {
  background-color: var(--accent-fill-color-default, #0078D4);
  color: var(--text-on-accent-primary, #FFFFFF);
  border-color: var(--accent-fill-color-default, #0078D4);
}

.win-appbar-toggle-button.is-checked:hover {
  background-color: var(--accent-fill-secondary, #106EBE);
  border-color: var(--accent-fill-secondary, #106EBE);
}

.win-appbar-toggle-button.is-checked:active {
  background-color: var(--accent-fill-tertiary, #005A9E);
  border-color: var(--accent-fill-tertiary, #005A9E);
  color: var(--text-on-accent-secondary, rgba(255, 255, 255, 0.7));
}

/* Visual States - Indeterminate (three-state mode) */
.win-appbar-toggle-button.is-indeterminate {
  background-color: var(--control-fill-color-secondary, rgba(0, 0, 0, 0.0373));
  border-color: var(--control-stroke-color-default, rgba(0, 0, 0, 0.0578));
}

.win-appbar-toggle-button.is-indeterminate::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 2px;
  background-color: currentColor;
}

.win-appbar-toggle-button.is-indeterminate:hover {
  background-color: var(--control-fill-color-tertiary, rgba(0, 0, 0, 0.0241));
}

.win-appbar-toggle-button.is-indeterminate:active {
  background-color: var(--control-fill-quaternary, rgba(0, 0, 0, 0.0326));
}

/* Visual States - Disabled */
.win-appbar-toggle-button:disabled {
  background-color: transparent;
  color: var(--text-fill-color-disabled, rgba(0, 0, 0, 0.3614));
  border-color: transparent;
  cursor: not-allowed;
  pointer-events: none;
}

.win-appbar-toggle-button.is-checked:disabled {
  background-color: var(--accent-fill-disabled, rgba(0, 0, 0, 0.0373));
  border-color: var(--accent-fill-disabled, rgba(0, 0, 0, 0.0373));
  color: var(--text-fill-color-disabled, rgba(0, 0, 0, 0.3614));
}

.win-appbar-toggle-button.is-indeterminate:disabled {
  background-color: transparent;
  border-color: transparent;
}

/* Focus visible */
.win-appbar-toggle-button:focus-visible {
  outline: 2px solid var(--focus-stroke-outer, #000000);
  outline-offset: 2px;
}

/* High contrast mode adjustments */
@media (prefers-contrast: high) {
  .win-appbar-toggle-button {
    border: 1px solid ButtonText;
  }

  .win-appbar-toggle-button.is-checked {
    background-color: Highlight;
    color: HighlightText;
    border-color: Highlight;
  }

  .win-appbar-toggle-button:disabled {
    border-color: GrayText;
    color: GrayText;
  }
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  .win-appbar-toggle-button {
    color: var(--text-fill-color-primary, rgba(255, 255, 255, 0.9));
  }

  .win-appbar-toggle-button:hover {
    background-color: var(--control-fill-secondary, rgba(255, 255, 255, 0.0837));
  }

  .win-appbar-toggle-button:active {
    background-color: var(--control-fill-tertiary, rgba(255, 255, 255, 0.0326));
    color: var(--text-fill-color-secondary, rgba(255, 255, 255, 0.6));
  }

  .win-appbar-toggle-button.is-indeterminate {
    background-color: var(--control-fill-secondary, rgba(255, 255, 255, 0.0837));
    border-color: var(--control-stroke-default, rgba(255, 255, 255, 0.0837));
  }

  .win-appbar-toggle-button:disabled {
    color: var(--text-disabled, rgba(255, 255, 255, 0.3628));
  }
}
</style>
