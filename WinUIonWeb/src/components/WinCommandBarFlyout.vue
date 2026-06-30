<template>
  <Teleport to="body">
    <Transition :name="transitionName">
      <div
        v-if="isVisible"
        ref="flyoutRef"
        class="win-commandbarflyout"
        :class="flyoutClasses"
        :style="flyoutStyle"
        role="menu"
        :aria-label="ariaLabel"
        @keydown="handleKeyDown"
      >
        <!-- Primary Commands Toolbar -->
        <div class="commandbarflyout-primary" role="toolbar">
          <slot name="primary">
            <component
              v-for="(command, index) in primaryCommandsList"
              :key="command.key || `primary-${index}`"
              :is="command.component"
              v-bind="command.props"
              :is-compact="true"
              label-position="Collapsed"
              @click="(e) => handleCommandClick(command, e)"
            />
          </slot>
        </div>

        <!-- Secondary Commands Dropdown -->
        <Transition name="commandbarflyout-secondary">
          <div
            v-if="showSecondary"
            class="commandbarflyout-secondary"
            role="menu"
          >
            <slot name="secondary">
              <component
                v-for="(command, index) in secondaryCommandsList"
                :key="command.key || `secondary-${index}`"
                :is="command.component"
                v-bind="command.props"
                :is-compact="true"
                label-position="Right"
                @click="(e) => handleCommandClick(command, e)"
              />
            </slot>
          </div>
        </Transition>

        <!-- More Button (for secondary commands) -->
        <button
          v-if="hasSecondaryCommands"
          class="commandbarflyout-more-button"
          :class="{ 'active': showSecondary }"
          :aria-label="showSecondary ? 'Close menu' : 'More options'"
          :aria-expanded="showSecondary"
          @click.stop="toggleSecondary"
        >
          <span class="symbol-icon"></span>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

export interface CommandBarFlyoutCommand {
  component: any
  props: Record<string, any>
  key?: string
}

export interface FlyoutShowOptions {
  showMode?: 'Standard' | 'Transient'
  placement?: string // FlyoutPlacementMode
}

export interface CommandBarFlyoutProps {
  placement?: string // 'Auto' | 'Top' | 'Bottom' | 'Left' | 'Right' | 'TopEdgeAlignedLeft' | 'TopEdgeAlignedRight' | 'BottomEdgeAlignedLeft' | 'BottomEdgeAlignedRight' | 'LeftEdgeAlignedTop' | 'LeftEdgeAlignedBottom' | 'RightEdgeAlignedTop' | 'RightEdgeAlignedBottom'
  primaryCommands?: CommandBarFlyoutCommand[]
  secondaryCommands?: CommandBarFlyoutCommand[]
  ariaLabel?: string
}

const props = withDefaults(defineProps<CommandBarFlyoutProps>(), {
  placement: 'Auto',
  primaryCommands: () => [],
  secondaryCommands: () => [],
  ariaLabel: 'Command bar flyout'
})

const emit = defineEmits<{
  opening: []
  opened: []
  closing: []
  closed: []
}>()

// State
const isVisible = ref(false)
const showSecondary = ref(false)
const flyoutRef = ref<HTMLElement>()
const targetElement = ref<HTMLElement>()
const position = ref({ top: 0, left: 0 })
const actualPlacement = ref('Bottom')
const showMode = ref<'Standard' | 'Transient'>('Standard')
const isAnimating = ref(false)
const focusedIndex = ref(-1)

// Computed
const primaryCommandsList = computed(() => props.primaryCommands)
const secondaryCommandsList = computed(() => props.secondaryCommands)
const hasSecondaryCommands = computed(() => secondaryCommandsList.value.length > 0)

const flyoutClasses = computed(() => {
  const classes = []
  classes.push(`placement-${actualPlacement.value.toLowerCase()}`)
  if (showMode.value === 'Transient') classes.push('transient')
  if (showSecondary.value) classes.push('secondary-open')
  if (isAnimating.value) classes.push('animating')
  return classes
})

const transitionName = computed(() => {
  // Different animations based on placement
  if (actualPlacement.value.includes('Top')) return 'commandbarflyout-top'
  if (actualPlacement.value.includes('Bottom')) return 'commandbarflyout-bottom'
  if (actualPlacement.value.includes('Left')) return 'commandbarflyout-left'
  if (actualPlacement.value.includes('Right')) return 'commandbarflyout-right'
  return 'commandbarflyout-bottom'
})

const flyoutStyle = computed(() => {
  return {
    top: `${position.value.top}px`,
    left: `${position.value.left}px`
  }
})

// Methods
const computePlacement = (target: HTMLElement, options?: FlyoutShowOptions) => {
  const placement = options?.placement || props.placement

  if (placement !== 'Auto') {
    actualPlacement.value = placement
    return
  }

  // Auto placement: determine best position based on available space
  const rect = target.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const spaceRight = window.innerWidth - rect.right
  const spaceLeft = rect.left

  // Prefer bottom, then top, then right, then left
  if (spaceBelow >= 150) {
    actualPlacement.value = 'Bottom'
  } else if (spaceAbove >= 150) {
    actualPlacement.value = 'Top'
  } else if (spaceRight >= 200) {
    actualPlacement.value = 'Right'
  } else if (spaceLeft >= 200) {
    actualPlacement.value = 'Left'
  } else {
    actualPlacement.value = 'Bottom' // Fallback
  }
}

const computePosition = (target: HTMLElement) => {
  if (!target) return

  const rect = target.getBoundingClientRect()
  const scrollX = window.scrollX || window.pageXOffset
  const scrollY = window.scrollY || window.pageYOffset

  let top = 0
  let left = 0

  switch (actualPlacement.value) {
    case 'Top':
    case 'TopEdgeAlignedLeft':
    case 'TopEdgeAlignedRight':
      top = rect.top + scrollY - 8
      left = rect.left + scrollX
      break

    case 'Bottom':
    case 'BottomEdgeAlignedLeft':
    case 'BottomEdgeAlignedRight':
      top = rect.bottom + scrollY + 8
      left = rect.left + scrollX
      break

    case 'Left':
    case 'LeftEdgeAlignedTop':
    case 'LeftEdgeAlignedBottom':
      top = rect.top + scrollY
      left = rect.left + scrollX - 8
      break

    case 'Right':
    case 'RightEdgeAlignedTop':
    case 'RightEdgeAlignedBottom':
      top = rect.top + scrollY
      left = rect.right + scrollX + 8
      break

    default:
      top = rect.bottom + scrollY + 8
      left = rect.left + scrollX
  }

  // Edge alignment adjustments
  if (actualPlacement.value.includes('AlignedRight')) {
    left = rect.right + scrollX
  } else if (actualPlacement.value.includes('AlignedBottom')) {
    top = rect.bottom + scrollY
  }

  position.value = { top, left }
}

const adjustPosition = () => {
  if (!flyoutRef.value || !targetElement.value) return

  const flyoutRect = flyoutRef.value.getBoundingClientRect()
  const currentPos = position.value

  // Adjust for Top placement (need to offset by flyout height)
  if (actualPlacement.value.includes('Top')) {
    position.value.top = currentPos.top - flyoutRect.height
  }

  // Adjust for Left placement (need to offset by flyout width)
  if (actualPlacement.value.includes('Left')) {
    position.value.left = currentPos.left - flyoutRect.width
  }

  // Adjust for Right alignment
  if (actualPlacement.value.includes('AlignedRight')) {
    position.value.left = currentPos.left - flyoutRect.width
  }

  // Keep within viewport bounds
  const viewportPadding = 8
  if (position.value.left < viewportPadding) {
    position.value.left = viewportPadding
  }
  if (position.value.left + flyoutRect.width > window.innerWidth - viewportPadding) {
    position.value.left = window.innerWidth - flyoutRect.width - viewportPadding
  }
  if (position.value.top < viewportPadding) {
    position.value.top = viewportPadding
  }
  if (position.value.top + flyoutRect.height > window.innerHeight - viewportPadding) {
    position.value.top = window.innerHeight - flyoutRect.height - viewportPadding
  }
}

const showAt = async (target: HTMLElement, options?: FlyoutShowOptions) => {
  if (isVisible.value) return

  targetElement.value = target
  showMode.value = options?.showMode || 'Standard'

  emit('opening')
  isAnimating.value = true

  // Compute placement and position
  computePlacement(target, options)
  computePosition(target)

  isVisible.value = true

  await nextTick()

  // Adjust position after render
  adjustPosition()

  setTimeout(() => {
    isAnimating.value = false
    emit('opened')

    // Focus flyout in Standard mode
    if (showMode.value === 'Standard' && flyoutRef.value) {
      flyoutRef.value.focus()
    }
  }, 250)
}

const hide = async () => {
  if (!isVisible.value) return

  emit('closing')
  isAnimating.value = true

  setTimeout(() => {
    isVisible.value = false
    showSecondary.value = false
    isAnimating.value = false
    focusedIndex.value = -1
    emit('closed')

    // Return focus to target in Standard mode
    if (showMode.value === 'Standard' && targetElement.value) {
      targetElement.value.focus()
    }
  }, 150)
}

const toggleSecondary = () => {
  showSecondary.value = !showSecondary.value
}

const handleCommandClick = (command: CommandBarFlyoutCommand, event: MouseEvent) => {
  // Command's own click handler is called via v-bind

  // Close flyout after command execution (unless in Transient mode with secondary open)
  if (showMode.value === 'Standard' || !showSecondary.value) {
    setTimeout(() => {
      hide()
    }, 100)
  }
}

// Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    if (showSecondary.value) {
      showSecondary.value = false
    } else {
      hide()
    }
    return
  }

  // Arrow navigation in primary toolbar
  if (!showSecondary.value && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault()
    navigatePrimary(event.key === 'ArrowRight' ? 1 : -1)
  }

  // Arrow navigation in secondary menu
  if (showSecondary.value && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault()
    navigateSecondary(event.key === 'ArrowDown' ? 1 : -1)
  }
}

const navigatePrimary = (direction: number) => {
  if (!flyoutRef.value) return

  const buttons = flyoutRef.value.querySelectorAll('.commandbarflyout-primary button')
  if (buttons.length === 0) return

  let currentIndex = Array.from(buttons).findIndex(btn => btn === document.activeElement)
  if (currentIndex === -1) currentIndex = direction > 0 ? -1 : buttons.length

  const nextIndex = (currentIndex + direction + buttons.length) % buttons.length
  ;(buttons[nextIndex] as HTMLElement).focus()
}

const navigateSecondary = (direction: number) => {
  if (!flyoutRef.value) return

  const buttons = flyoutRef.value.querySelectorAll('.commandbarflyout-secondary button')
  if (buttons.length === 0) return

  focusedIndex.value = (focusedIndex.value + direction + buttons.length) % buttons.length
  ;(buttons[focusedIndex.value] as HTMLElement).focus()
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (!isVisible.value) return

  const target = event.target as Node
  if (flyoutRef.value && !flyoutRef.value.contains(target)) {
    // In Transient mode, clicking outside keeps the flyout (focus remains on target)
    if (showMode.value === 'Standard') {
      hide()
    }
  }
}

// Update position on scroll/resize
const updatePosition = () => {
  if (isVisible.value && targetElement.value) {
    computePosition(targetElement.value)
    nextTick(() => adjustPosition())
  }
}

watch(isVisible, (newVal) => {
  if (newVal) {
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
  } else {
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
  }
})

onMounted(() => {
  document.addEventListener('pointerdown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleClickOutside)
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})

// Public API
defineExpose({
  showAt,
  hide,
  isVisible
})
</script>

<style scoped>
.win-commandbarflyout {
  position: absolute;
  z-index: 9100;
  background: var(--layer-fill-color-default);
  background-image: var(--flyout-material-overlay);
  backdrop-filter: var(--flyout-backdrop);
  -webkit-backdrop-filter: var(--flyout-backdrop);
  border: 1px solid var(--surface-stroke-color-flyout);
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  min-width: fit-content;
  outline: none;
}

/* Primary Commands Toolbar */
.commandbarflyout-primary {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 4px;
  position: relative;
}

.commandbarflyout-primary :deep(.win-appbar-button) {
  min-width: 40px;
  min-height: 40px;
  padding: 8px;
}

/* More Button */
.commandbarflyout-more-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--text-fill-color-primary);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.1s ease;
  margin: 4px;
  padding: 8px;
}

.commandbarflyout-more-button:hover {
  background-color: var(--subtle-fill-color-secondary);
}

.commandbarflyout-more-button:active,
.commandbarflyout-more-button.active {
  background-color: var(--subtle-fill-color-tertiary);
}

.commandbarflyout-more-button:focus-visible {
  outline: 2px solid var(--accent-base);
  outline-offset: -2px;
}

.commandbarflyout-more-button .symbol-icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 16px;
  display: inline-block;
}

.commandbarflyout-more-button .symbol-icon::before {
  content: ''; /* More icon */
}

.commandbarflyout-more-button.active .symbol-icon::before {
  content: ''; /* ChevronUp icon */
}

/* Secondary Commands Dropdown */
.commandbarflyout-secondary {
  min-width: 200px;
  background: var(--layer-fill-color-default);
  border-top: 1px solid var(--surface-stroke-color-flyout);
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.commandbarflyout-secondary :deep(.win-appbar-button) {
  width: 100%;
  justify-content: flex-start;
  min-height: 40px;
  padding: 8px 12px;
  text-align: left;
}

/* Transient mode styling */
.win-commandbarflyout.transient {
  pointer-events: auto;
}

/* Placement-specific transform origins */
.win-commandbarflyout.placement-top,
.win-commandbarflyout.placement-topedgealignedleft,
.win-commandbarflyout.placement-topedgealignedright {
  transform-origin: bottom center;
}

.win-commandbarflyout.placement-bottom,
.win-commandbarflyout.placement-bottomedgealignedleft,
.win-commandbarflyout.placement-bottomedgealignedright {
  transform-origin: top center;
}

.win-commandbarflyout.placement-left,
.win-commandbarflyout.placement-leftedgealignedtop,
.win-commandbarflyout.placement-leftedgealignedbottom {
  transform-origin: center right;
}

.win-commandbarflyout.placement-right,
.win-commandbarflyout.placement-rightedgealignedtop,
.win-commandbarflyout.placement-rightedgealignedbottom {
  transform-origin: center left;
}

/* Animations - Bottom */
.commandbarflyout-bottom-enter-active {
  transition: opacity 0.250s cubic-bezier(0, 0, 0, 1), transform 0.250s cubic-bezier(0, 0, 0, 1);
}

.commandbarflyout-bottom-leave-active {
  transition: opacity 0.150s ease, transform 0.150s ease;
}

.commandbarflyout-bottom-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

.commandbarflyout-bottom-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}

/* Animations - Top */
.commandbarflyout-top-enter-active {
  transition: opacity 0.250s cubic-bezier(0, 0, 0, 1), transform 0.250s cubic-bezier(0, 0, 0, 1);
}

.commandbarflyout-top-leave-active {
  transition: opacity 0.150s ease, transform 0.150s ease;
}

.commandbarflyout-top-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}

.commandbarflyout-top-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}

/* Animations - Right */
.commandbarflyout-right-enter-active {
  transition: opacity 0.250s cubic-bezier(0, 0, 0, 1), transform 0.250s cubic-bezier(0, 0, 0, 1);
}

.commandbarflyout-right-leave-active {
  transition: opacity 0.150s ease, transform 0.150s ease;
}

.commandbarflyout-right-enter-from {
  opacity: 0;
  transform: scale(0.95) translateX(-8px);
}

.commandbarflyout-right-leave-to {
  opacity: 0;
  transform: scale(0.95) translateX(-4px);
}

/* Animations - Left */
.commandbarflyout-left-enter-active {
  transition: opacity 0.250s cubic-bezier(0, 0, 0, 1), transform 0.250s cubic-bezier(0, 0, 0, 1);
}

.commandbarflyout-left-leave-active {
  transition: opacity 0.150s ease, transform 0.150s ease;
}

.commandbarflyout-left-enter-from {
  opacity: 0;
  transform: scale(0.95) translateX(8px);
}

.commandbarflyout-left-leave-to {
  opacity: 0;
  transform: scale(0.95) translateX(4px);
}

/* Secondary dropdown animation */
.commandbarflyout-secondary-enter-active {
  transition: opacity 0.15s ease, max-height 0.15s ease;
}

.commandbarflyout-secondary-leave-active {
  transition: opacity 0.1s ease, max-height 0.1s ease;
}

.commandbarflyout-secondary-enter-from,
.commandbarflyout-secondary-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

/* Dark Theme */
html.theme-dark .win-commandbarflyout {
  background: var(--layer-fill-color-default);
  border-color: var(--surface-stroke-color-flyout);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

html.theme-dark .commandbarflyout-more-button {
  color: var(--text-fill-color-primary);
}

html.theme-dark .commandbarflyout-more-button:hover {
  background-color: var(--subtle-fill-color-secondary);
}

html.theme-dark .commandbarflyout-more-button:active,
html.theme-dark .commandbarflyout-more-button.active {
  background-color: var(--subtle-fill-color-tertiary);
}

html.theme-dark .commandbarflyout-secondary {
  background: var(--layer-fill-color-default);
  border-top-color: var(--surface-stroke-color-flyout);
}

@media (prefers-color-scheme: dark) {
  html:not(.theme-light) .win-commandbarflyout {
    background: var(--layer-fill-color-default);
    border-color: var(--surface-stroke-color-flyout);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  }

  html:not(.theme-light) .commandbarflyout-more-button {
    color: var(--text-fill-color-primary);
  }

  html:not(.theme-light) .commandbarflyout-more-button:hover {
    background-color: var(--subtle-fill-color-secondary);
  }

  html:not(.theme-light) .commandbarflyout-more-button:active,
  html:not(.theme-light) .commandbarflyout-more-button.active {
    background-color: var(--subtle-fill-color-tertiary);
  }

  html:not(.theme-light) .commandbarflyout-secondary {
    background: var(--layer-fill-color-default);
    border-top-color: var(--surface-stroke-color-flyout);
  }
}

html.theme-dark .win-commandbarflyout {
  background: var(--layer-fill-color-default);
  border-color: var(--surface-stroke-color-flyout);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

html.theme-dark .commandbarflyout-more-button {
  color: var(--text-fill-color-primary);
}

html.theme-dark .commandbarflyout-more-button:hover {
  background-color: var(--subtle-fill-color-secondary);
}

html.theme-dark .commandbarflyout-more-button:active,
html.theme-dark .commandbarflyout-more-button.active {
  background-color: var(--subtle-fill-color-tertiary);
}

html.theme-dark .commandbarflyout-secondary {
  background: var(--layer-fill-color-default);
  border-top-color: var(--surface-stroke-color-flyout);
}
</style>
