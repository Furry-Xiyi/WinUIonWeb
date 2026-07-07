<template>
  <div
    ref="commandBarRoot"
    :class="commandBarClasses"
    role="toolbar"
    :aria-label="resolvedAriaLabel"
    :aria-expanded="isOpen"
    @keydown="handleKeyDown"
  >
    <!-- Primary Commands Area -->
    <div class="commandbar-primary" ref="primaryContainer">
      <div class="commandbar-primary-content" ref="primaryContent">
        <slot name="primary">
          <component
            v-for="(command, index) in visiblePrimaryCommands"
            :key="command.key || index"
            :is="command.component"
            v-bind="command.props"
            :label-position="effectiveLabelPosition"
            @click="(e: MouseEvent) => handleCommandClick(command, e)"
          />
        </slot>
      </div>

      <!-- Overflow Button (More) -->
      <button
        v-if="showOverflowButton"
        class="commandbar-overflow-button"
        :class="{ 'active': isOpen }"
        :aria-label="isOpen ? t('text.close-overflow-menu') : t('text.more-options')"
        :aria-expanded="isOpen"
        @click="toggleOverflow"
      >
        <span class="symbol-icon"></span>
      </button>
    </div>

    <!-- Secondary Commands Overflow -->
    <Transition name="commandbar-overflow">
      <div
        v-if="isOpen"
        class="commandbar-secondary-overlay"
        @click.self="closeOverflow"
      >
        <div
          class="commandbar-secondary"
          ref="secondaryContainer"
          role="menu"
          @click="handleSecondaryClick"
        >
          <!-- Overflow Primary Commands (if dynamic overflow is enabled) -->
          <template v-if="overflowPrimaryCommands.length > 0">
            <component
              v-for="(command, index) in overflowPrimaryCommands"
              :key="command.key || `overflow-${index}`"
              :is="command.component"
              v-bind="command.props"
              :is-compact="true"
              label-position="Right"
              @click="(e: MouseEvent) => handleCommandClick(command, e)"
            />
            <div v-if="hasSecondaryCommands" class="commandbar-separator"></div>
          </template>

          <!-- Secondary Commands -->
          <slot name="secondary">
            <component
              v-for="(command, index) in secondaryCommandsList"
              :key="command.key || `secondary-${index}`"
              :is="command.component"
              v-bind="command.props"
              :is-compact="true"
              label-position="Right"
              @click="(e: MouseEvent) => handleCommandClick(command, e)"
            />
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, useSlots } from 'vue'
import { useI18n } from './i18n/index'

const { t } = useI18n()

export interface CommandBarCommand {
  component: any
  props: Record<string, any>
  key?: string
}

export interface CommandBarProps {
  isOpen?: boolean
  isSticky?: boolean
  defaultLabelPosition?: 'Bottom' | 'Right' | 'Collapsed'
  primaryCommands?: CommandBarCommand[]
  secondaryCommands?: CommandBarCommand[]
  isDynamicOverflowEnabled?: boolean
  overflowButtonVisibility?: 'Auto' | 'Visible' | 'Collapsed'
  ariaLabel?: string
}

const props = withDefaults(defineProps<CommandBarProps>(), {
  isOpen: false,
  isSticky: false,
  defaultLabelPosition: 'Bottom',
  primaryCommands: () => [],
  secondaryCommands: () => [],
  isDynamicOverflowEnabled: true,
  overflowButtonVisibility: 'Auto',
  ariaLabel: ''
})

const emit = defineEmits<{
  opening: []
  opened: []
  closing: []
  closed: []
  dynamicOverflowItemsChanging: []
  'update:isOpen': [value: boolean]
}>()

const slots = useSlots()
const resolvedAriaLabel = computed(() => props.ariaLabel || t('text.command-bar'))

// Refs
const commandBarRoot = ref<HTMLElement>()
const primaryContainer = ref<HTMLElement>()
const primaryContent = ref<HTMLElement>()
const secondaryContainer = ref<HTMLElement>()

// State
const internalIsOpen = ref(props.isOpen)
const isAnimating = ref(false)
const overflowPrimaryCommands = ref<CommandBarCommand[]>([])
const visiblePrimaryCommands = ref<CommandBarCommand[]>([...props.primaryCommands])
const focusedIndex = ref(-1)
const resizeObserver = ref<ResizeObserver>()

// Computed
const isOpen = computed({
  get: () => internalIsOpen.value,
  set: (val) => {
    internalIsOpen.value = val
    emit('update:isOpen', val)
  }
})

const commandBarClasses = computed(() => {
  const classes = ['win-commandbar']
  if (isOpen.value) classes.push('open')
  if (isAnimating.value) classes.push('animating')
  if (!hasSecondaryCommands.value && overflowPrimaryCommands.value.length === 0) {
    classes.push('no-overflow')
  }
  return classes
})

const effectiveLabelPosition = computed(() => {
  // Map WinUI names to component prop format
  const positionMap = {
    'Bottom': 'Default',
    'Right': 'Right',
    'Collapsed': 'Collapsed'
  }
  return positionMap[props.defaultLabelPosition] || 'Default'
})

const secondaryCommandsList = computed(() => {
  return props.secondaryCommands
})

const hasSecondaryCommands = computed(() => {
  return secondaryCommandsList.value.length > 0 || !!slots.secondary
})

const showOverflowButton = computed(() => {
  if (props.overflowButtonVisibility === 'Collapsed') return false
  if (props.overflowButtonVisibility === 'Visible') return true

  // Auto: show if there are secondary commands or overflow items
  return hasSecondaryCommands.value || overflowPrimaryCommands.value.length > 0
})

// Methods
const toggleOverflow = () => {
  if (isOpen.value) {
    closeOverflow()
  } else {
    openOverflow()
  }
}

const openOverflow = async () => {
  if (isOpen.value) return

  emit('opening')
  isAnimating.value = true
  isOpen.value = true

  await nextTick()

  setTimeout(() => {
    isAnimating.value = false
    emit('opened')
  }, 200)
}

const closeOverflow = async () => {
  if (!isOpen.value) return
  if (props.isSticky) return // Don't close if sticky

  emit('closing')
  isAnimating.value = true

  setTimeout(() => {
    isOpen.value = false
    isAnimating.value = false
    emit('closed')
  }, 150)
}

const handleCommandClick = (command: CommandBarCommand, event: MouseEvent) => {
  // Command's own click handler will be called via v-bind

  // Close overflow after click unless sticky
  if (isOpen.value && !props.isSticky) {
    closeOverflow()
  }
}

const handleSecondaryClick = (event: MouseEvent) => {
  // Close overflow when clicking on secondary area (unless sticky)
  if (!props.isSticky) {
    // Small delay to allow button click to register
    setTimeout(() => {
      closeOverflow()
    }, 100)
  }
}

// Dynamic Overflow Logic
const calculateOverflow = () => {
  if (!props.isDynamicOverflowEnabled) return
  if (!primaryContainer.value || !primaryContent.value) return

  const containerWidth = primaryContainer.value.offsetWidth
  const contentWidth = primaryContent.value.scrollWidth
  const overflowButtonWidth = 68 // Approximate width of overflow button

  // If content fits, show all commands
  if (contentWidth <= containerWidth - overflowButtonWidth) {
    if (overflowPrimaryCommands.value.length > 0) {
      emit('dynamicOverflowItemsChanging')
      overflowPrimaryCommands.value = []
      visiblePrimaryCommands.value = [...props.primaryCommands]
    }
    return
  }

  // Need to move items to overflow
  const availableWidth = containerWidth - overflowButtonWidth
  let totalWidth = 0
  let visibleCount = 0

  // Measure each command (approximate 68px per button)
  const commandWidth = 68
  for (let i = 0; i < props.primaryCommands.length; i++) {
    if (totalWidth + commandWidth <= availableWidth) {
      totalWidth += commandWidth
      visibleCount++
    } else {
      break
    }
  }

  // Update visible/overflow arrays
  if (visibleCount < props.primaryCommands.length) {
    emit('dynamicOverflowItemsChanging')
    visiblePrimaryCommands.value = props.primaryCommands.slice(0, visibleCount)
    overflowPrimaryCommands.value = props.primaryCommands.slice(visibleCount)
  }
}

// Keyboard Navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    closeOverflow()
    return
  }

  if (event.key === 'Tab') {
    // Allow natural tab navigation
    return
  }

  // Arrow key navigation in overflow
  if (isOpen.value && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault()
    handleArrowNavigation(event.key === 'ArrowDown' ? 1 : -1)
  }
}

const handleArrowNavigation = (direction: number) => {
  const totalItems = overflowPrimaryCommands.value.length + secondaryCommandsList.value.length
  if (totalItems === 0) return

  focusedIndex.value = (focusedIndex.value + direction + totalItems) % totalItems

  // Focus the appropriate element in the secondary container
  if (secondaryContainer.value) {
    const buttons = secondaryContainer.value.querySelectorAll('button')
    if (buttons[focusedIndex.value]) {
      buttons[focusedIndex.value].focus()
    }
  }
}

// Watch for prop changes
watch(() => props.isOpen, (newVal) => {
  if (newVal !== internalIsOpen.value) {
    if (newVal) {
      openOverflow()
    } else {
      closeOverflow()
    }
  }
})

watch(() => props.primaryCommands, () => {
  visiblePrimaryCommands.value = [...props.primaryCommands]
  nextTick(() => {
    calculateOverflow()
  })
}, { deep: true })

// Lifecycle
onMounted(() => {
  // Set up resize observer for dynamic overflow
  if (props.isDynamicOverflowEnabled && primaryContainer.value) {
    resizeObserver.value = new ResizeObserver(() => {
      calculateOverflow()
    })
    resizeObserver.value.observe(primaryContainer.value)
  }

  // Initial overflow calculation
  nextTick(() => {
    calculateOverflow()
  })

  // Close overflow on click outside
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value || props.isSticky) return

  const target = event.target as Node
  if (commandBarRoot.value && !commandBarRoot.value.contains(target)) {
    closeOverflow()
  }
}

// Public methods (expose for parent component access)
defineExpose({
  open: openOverflow,
  close: closeOverflow,
  toggle: toggleOverflow
})
</script>

<style scoped>
.win-commandbar {
  display: flex;
  flex-direction: column;
  background: var(--muxc-layer-fill-default, #F9F9F9);
  border-bottom: 1px solid var(--muxc-control-stroke-default, rgba(0, 0, 0, 0.0578));
  min-height: 48px;
  font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
  position: relative;
  z-index: 100;
}

/* Primary Commands Area */
.commandbar-primary {
  display: flex;
  align-items: center;
  height: 48px;
  overflow: hidden;
  position: relative;
}

.commandbar-primary-content {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  gap: 0;
}

/* Overflow Button */
.commandbar-overflow-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  border: none;
  background: var(--muxc-subtle-fill-transparent, transparent);
  color: var(--text-fill-color-primary, rgba(0, 0, 0, 0.8956));
  cursor: pointer;
  transition: background-color 0.1s ease;
  flex-shrink: 0;
  padding: 0 12px;
}

.commandbar-overflow-button:hover {
  background: var(--muxc-subtle-fill-secondary, rgba(0, 0, 0, 0.0373));
}

.commandbar-overflow-button:active,
.commandbar-overflow-button.active {
  background: var(--muxc-subtle-fill-tertiary, rgba(0, 0, 0, 0.0241));
}

.commandbar-overflow-button:focus-visible {
  outline: 2px solid var(--muxc-accent-fill-default, #005FB8);
  outline-offset: -2px;
}

.commandbar-overflow-button .symbol-icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 16px;
  display: inline-block;
}

.commandbar-overflow-button .symbol-icon::before {
  content: ''; /* More icon */
}

/* Secondary Commands Overlay */
.commandbar-secondary-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
}

.commandbar-secondary {
  position: absolute;
  top: 48px;
  right: 0;
  min-width: 200px;
  max-width: 400px;
  background: var(--muxc-layer-fill-default, #F9F9F9);
  border: 1px solid var(--muxc-control-stroke-default, rgba(0, 0, 0, 0.0578));
  border-radius: var(--muxc-overlay-corner-radius, 8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  padding: 4px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 60vh;
}

.commandbar-secondary :deep(.win-appbar-button) {
  width: 100%;
  justify-content: flex-start;
  min-height: 40px;
  padding: 8px 12px;
  text-align: left;
}

.commandbar-separator {
  height: 1px;
  background: var(--muxc-control-stroke-default, rgba(0, 0, 0, 0.0578));
  margin: 4px 0;
}

/* Transitions */
.commandbar-overflow-enter-active,
.commandbar-overflow-leave-active {
  transition: opacity 0.15s ease;
}

.commandbar-overflow-enter-active .commandbar-secondary,
.commandbar-overflow-leave-active .commandbar-secondary {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.commandbar-overflow-enter-from,
.commandbar-overflow-leave-to {
  opacity: 0;
}

.commandbar-overflow-enter-from .commandbar-secondary {
  transform: translateY(-8px);
  opacity: 0;
}

.commandbar-overflow-leave-to .commandbar-secondary {
  transform: translateY(-4px);
  opacity: 0;
}

/* Dark Theme */
html.theme-dark .win-commandbar {
  background: var(--muxc-layer-fill-default, #2C2C2C);
  border-bottom-color: var(--muxc-control-stroke-default, rgba(255, 255, 255, 0.0837));
}

@media (prefers-color-scheme: dark) {
  html:not(.theme-light) .win-commandbar {
    background: var(--muxc-layer-fill-default, #2C2C2C);
    border-bottom-color: var(--muxc-control-stroke-default, rgba(255, 255, 255, 0.0837));
  }

  html:not(.theme-light) .commandbar-overflow-button {
    color: var(--text-fill-color-primary, rgba(255, 255, 255, 1));
  }

  html:not(.theme-light) .commandbar-overflow-button:hover {
    background: var(--muxc-subtle-fill-secondary, rgba(255, 255, 255, 0.0605));
  }

  html:not(.theme-light) .commandbar-overflow-button:active,
  html:not(.theme-light) .commandbar-overflow-button.active {
    background: var(--muxc-subtle-fill-tertiary, rgba(255, 255, 255, 0.0419));
  }

  html:not(.theme-light) .commandbar-secondary {
    background: var(--muxc-layer-fill-default, #2C2C2C);
    border-color: var(--muxc-control-stroke-default, rgba(255, 255, 255, 0.0837));
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  }

  html:not(.theme-light) .commandbar-separator {
    background: var(--muxc-control-stroke-default, rgba(255, 255, 255, 0.0837));
  }
}

html.theme-dark .win-commandbar {
  background: var(--muxc-layer-fill-default, #2C2C2C);
  border-bottom-color: var(--muxc-control-stroke-default, rgba(255, 255, 255, 0.0837));
}

html.theme-dark .commandbar-overflow-button {
  color: var(--text-fill-color-primary, rgba(255, 255, 255, 1));
}

html.theme-dark .commandbar-overflow-button:hover {
  background: var(--muxc-subtle-fill-secondary, rgba(255, 255, 255, 0.0605));
}

html.theme-dark .commandbar-overflow-button:active,
html.theme-dark .commandbar-overflow-button.active {
  background: var(--muxc-subtle-fill-tertiary, rgba(255, 255, 255, 0.0419));
}

html.theme-dark .commandbar-secondary {
  background: var(--muxc-layer-fill-default, #2C2C2C);
  border-color: var(--muxc-control-stroke-default, rgba(255, 255, 255, 0.0837));
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

html.theme-dark .commandbar-separator {
  background: var(--muxc-control-stroke-default, rgba(255, 255, 255, 0.0837));
}

/* No overflow state */
.win-commandbar.no-overflow .commandbar-overflow-button {
  display: none;
}
</style>
