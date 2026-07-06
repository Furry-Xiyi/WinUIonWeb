<template>
  <button
    :class="buttonClasses"
    :disabled="!isEnabled"
    :aria-label="ariaLabel"
    :title="tooltip"
    @click="handleClick"
    @mouseenter="isPointerOver = true"
    @mouseleave="isPointerOver = false"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
  >
    <!-- Icon Content -->
    <span v-if="hasIconContent" class="appbar-button-icon">
      <!-- Custom Content Slot (alternative to Icon) -->
      <slot v-if="$slots.content" name="content"></slot>
      <!-- Symbol Icon (default icon rendering) -->
      <span v-else-if="icon" class="symbol-icon" :data-symbol="icon">{{ getSymbolGlyph(icon) }}</span>
    </span>

    <!-- Label -->
    <span v-if="!isCompact && label" class="appbar-button-label">{{ label }}</span>

    <!-- Flyout (if provided via slot) -->
    <Teleport v-if="$slots.flyout && showFlyout" to="body">
      <div class="appbar-button-flyout" :style="flyoutStyle">
        <slot name="flyout"></slot>
      </div>
    </Teleport>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import type { CSSProperties } from 'vue'

export interface AppBarButtonProps {
  icon?: string // SymbolIcon name (e.g., 'Save', 'Edit', 'Delete')
  label?: string
  isCompact?: boolean
  labelPosition?: 'Default' | 'Right' | 'Collapsed'
  isEnabled?: boolean
  visibility?: 'Visible' | 'Collapsed'
  tooltip?: string
  ariaLabel?: string
  allowFocusOnInteraction?: boolean
}

const props = withDefaults(defineProps<AppBarButtonProps>(), {
  icon: undefined,
  label: '',
  isCompact: false,
  labelPosition: 'Default',
  isEnabled: true,
  visibility: 'Visible',
  tooltip: undefined,
  ariaLabel: undefined,
  allowFocusOnInteraction: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = useSlots()

// Visual state tracking
const isPointerOver = ref(false)
const isPressed = ref(false)
const showFlyout = ref(false)

// Computed properties
const buttonClasses = computed(() => {
  const classes = ['win-appbar-button']

  if (!props.isEnabled) classes.push('disabled')
  if (props.isCompact) classes.push('compact')
  if (props.visibility === 'Collapsed') classes.push('collapsed')
  if (isPointerOver.value && props.isEnabled) classes.push('pointer-over')
  if (isPressed.value && props.isEnabled) classes.push('pressed')

  // Label position classes
  if (props.labelPosition === 'Right') classes.push('label-right')
  if (props.labelPosition === 'Collapsed' || props.isCompact) classes.push('label-collapsed')

  return classes
})

const hasIconContent = computed(() => {
  return slots.content || props.icon
})

// Symbol icon mapping (subset of common WinUI symbols)
const symbolGlyphs: Record<string, string> = {
  'Accept': '',
  'Add': '',
  'Back': '',
  'Cancel': '',
  'Delete': '',
  'Edit': '',
  'Forward': '',
  'Help': '',
  'More': '',
  'Refresh': '',
  'Save': '',
  'Send': '',
  'Setting': '',
  'Share': '',
  'Stop': '',
  'Sync': '',
  'Undo': '',
  'Redo': '',
  'Favorite': '',
  'UnFavorite': '',
  'Pin': '',
  'UnPin': '',
  'OpenFile': '',
  'SaveLocal': '',
  'Print': '',
  'Camera': '',
  'Attach': '',
  'Emoji': '',
  'MusicInfo': '',
  'MapPin': '',
  'Flag': '',
  'Home': '',
  'Play': '',
  'Pause': '',
  'Download': '',
  'Upload': ''
}

const getSymbolGlyph = (symbolName: string): string => {
  return symbolGlyphs[symbolName] || '' // Default to document icon
}

// Flyout positioning (basic implementation)
const flyoutStyle = computed<CSSProperties>(() => {
  return {
    position: 'absolute',
    top: '0px',
    left: '0px'
  }
})

// Event handlers
const handleClick = (event: MouseEvent) => {
  if (!props.isEnabled) return

  // Toggle flyout if slot exists
  if (slots.flyout) {
    showFlyout.value = !showFlyout.value
  }

  emit('click', event)
}
</script>

<style scoped>
.win-appbar-button {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  min-height: 68px;
  padding: 12px 16px;
  border: none;
  border-radius: var(--muxc-control-corner-radius, 4px);
  background: var(--muxc-subtle-fill-transparent, transparent);
  color: var(--text-fill-color-primary, rgba(0, 0, 0, 0.8956));
  font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
  font-size: var(--muxc-body-font-size, 14px);
  font-weight: var(--muxc-body-font-weight, 400);
  line-height: var(--muxc-body-line-height, 20px);
  cursor: pointer;
  transition: background-color 0.1s ease, transform 0.05s ease;
  user-select: none;
  position: relative;
  gap: 4px;
}

/* Icon */
.appbar-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 16px;
}

.symbol-icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 16px;
  display: inline-block;
}

/* Label */
.appbar-button-label {
  display: block;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Visual States */
.win-appbar-button.pointer-over {
  background: var(--muxc-subtle-fill-secondary, rgba(0, 0, 0, 0.0373));
}

.win-appbar-button.pressed {
  background: var(--muxc-subtle-fill-tertiary, rgba(0, 0, 0, 0.0241));
  transform: scale(0.98);
}

.win-appbar-button.disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

/* Compact Mode */
.win-appbar-button.compact {
  min-width: 40px;
  min-height: 40px;
  padding: 4px 12px;
}

.win-appbar-button.compact .appbar-button-label {
  display: none;
}

/* Label Position */
.win-appbar-button.label-right {
  flex-direction: row;
  gap: 8px;
}

.win-appbar-button.label-collapsed .appbar-button-label {
  display: none;
}

/* Visibility */
.win-appbar-button.collapsed {
  display: none;
}

/* Focus visible (keyboard navigation) */
.win-appbar-button:focus-visible {
  outline: 2px solid var(--muxc-accent-fill-default, #005FB8);
  outline-offset: 2px;
}

/* Flyout */
.appbar-button-flyout {
  z-index: 1000;
  background: var(--muxc-layer-fill-default, #FFFFFF);
  border: 1px solid var(--muxc-control-stroke-default, rgba(0, 0, 0, 0.0578));
  border-radius: var(--muxc-overlay-corner-radius, 8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  padding: 4px;
  min-width: 200px;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .win-appbar-button {
    color: var(--text-fill-color-primary, rgba(255, 255, 255, 1));
  }

  .win-appbar-button.pointer-over {
    background: var(--muxc-subtle-fill-secondary, rgba(255, 255, 255, 0.0605));
  }

  .win-appbar-button.pressed {
    background: var(--muxc-subtle-fill-tertiary, rgba(255, 255, 255, 0.0419));
  }

  .appbar-button-flyout {
    background: var(--muxc-layer-fill-default, #2C2C2C);
    border: 1px solid var(--muxc-control-stroke-default, rgba(255, 255, 255, 0.0837));
  }
}
</style>
