<template>
  <div
    class="win-scrollbar"
    :class="[orientationClass, indicatorModeClass, { 'auto-hide': !isHovered && !isDragging }]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    ref="scrollbar"
  >
    <div
      class="win-scrollbar-track"
      @pointerdown="onTrackDown"
    >
      <div
        class="win-scrollbar-thumb"
        :style="thumbStyle"
        @pointerdown.stop="onThumbDown"
        ref="thumb"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  // Official WinUI ScrollBar properties
  orientation: {
    type: String,
    default: 'Vertical', // 'Vertical' | 'Horizontal'
    validator: (value) => ['Vertical', 'Horizontal'].includes(value)
  },
  indicatorMode: {
    type: String,
    default: 'MouseIndicator', // 'None' | 'TouchIndicator' | 'MouseIndicator'
    validator: (value) => ['None', 'TouchIndicator', 'MouseIndicator'].includes(value)
  },
  viewportSize: {
    type: Number,
    default: 0
  },
  value: {
    type: Number,
    default: 0
  },
  minimum: {
    type: Number,
    default: 0
  },
  maximum: {
    type: Number,
    default: 100
  },
  smallChange: {
    type: Number,
    default: 1
  },
  largeChange: {
    type: Number,
    default: 10
  },
  // Visual mode
  visualMode: {
    type: String,
    default: 'Normal', // 'Thin' | 'Normal'
    validator: (value) => ['Thin', 'Normal'].includes(value)
  }
});

const emit = defineEmits(['update:value', 'scroll']);

const scrollbar = ref(null);
const thumb = ref(null);
const isHovered = ref(false);
const isDragging = ref(false);
const dragStartValue = ref(0);
const dragStartPos = ref(0);

const isVertical = computed(() => props.orientation === 'Vertical');
const orientationClass = computed(() => isVertical.value ? 'vertical' : 'horizontal');
const indicatorModeClass = computed(() => `mode-${props.indicatorMode.toLowerCase()}`);

// Calculate thumb size as percentage of track
const thumbSizePercent = computed(() => {
  const range = props.maximum - props.minimum;
  if (range === 0) return 100;
  const size = (props.viewportSize / (range + props.viewportSize)) * 100;
  return Math.max(10, Math.min(100, size)); // Min 10%, max 100%
});

// Calculate thumb position as percentage of available space
const thumbPositionPercent = computed(() => {
  const range = props.maximum - props.minimum;
  if (range === 0) return 0;
  const availableSpace = 100 - thumbSizePercent.value;
  return (props.value / range) * availableSpace;
});

const thumbStyle = computed(() => {
  if (isVertical.value) {
    return {
      height: thumbSizePercent.value + '%',
      top: thumbPositionPercent.value + '%'
    };
  } else {
    return {
      width: thumbSizePercent.value + '%',
      left: thumbPositionPercent.value + '%'
    };
  }
});

const onMouseEnter = () => {
  isHovered.value = true;
};

const onMouseLeave = () => {
  isHovered.value = false;
};

const onTrackDown = (e) => {
  if (!scrollbar.value) return;

  const rect = scrollbar.value.getBoundingClientRect();
  let clickPosition;

  if (isVertical.value) {
    clickPosition = (e.clientY - rect.top) / rect.height;
  } else {
    clickPosition = (e.clientX - rect.left) / rect.width;
  }

  // Calculate available space for thumb movement
  const availableSpace = 1 - (thumbSizePercent.value / 100);
  const targetPosition = Math.max(0, Math.min(availableSpace, clickPosition - (thumbSizePercent.value / 200)));

  const range = props.maximum - props.minimum;
  const newValue = (targetPosition / availableSpace) * range;
  const clampedValue = Math.max(props.minimum, Math.min(props.maximum, newValue));

  emit('update:value', clampedValue);
  emit('scroll', clampedValue);
};

const onThumbDown = (e) => {
  isDragging.value = true;
  dragStartValue.value = props.value;

  if (isVertical.value) {
    dragStartPos.value = e.clientY;
  } else {
    dragStartPos.value = e.clientX;
  }

  const el = scrollbar.value;
  el.setPointerCapture(e.pointerId);

  const onMove = (evt) => {
    if (!isDragging.value || !scrollbar.value) return;

    const rect = scrollbar.value.getBoundingClientRect();
    let delta;

    if (isVertical.value) {
      delta = (evt.clientY - dragStartPos.value) / rect.height;
    } else {
      delta = (evt.clientX - dragStartPos.value) / rect.width;
    }

    const availableSpace = 1 - (thumbSizePercent.value / 100);
    const range = props.maximum - props.minimum;
    const valueDelta = (delta / availableSpace) * range;

    const newValue = dragStartValue.value + valueDelta;
    const clampedValue = Math.max(props.minimum, Math.min(props.maximum, newValue));

    emit('update:value', clampedValue);
    emit('scroll', clampedValue);
  };

  const onUp = () => {
    isDragging.value = false;
    el.onpointermove = null;
    el.onpointerup = null;
    el.releasePointerCapture(e.pointerId);
  };

  el.onpointermove = onMove;
  el.onpointerup = onUp;
};
</script>

<style scoped>
.win-scrollbar {
  position: relative;
  transition: opacity 0.2s var(--standard-easing);
}

/* Vertical orientation */
.win-scrollbar.vertical {
  width: 17px;
  min-height: 100px;
}

.win-scrollbar.vertical.mode-mouseindicator {
  width: 12px;
}

/* Horizontal orientation */
.win-scrollbar.horizontal {
  height: 17px;
  min-width: 100px;
}

.win-scrollbar.horizontal.mode-mouseindicator {
  height: 12px;
}

/* Auto-hide behavior */
.win-scrollbar.auto-hide {
  opacity: 0.3;
}

.win-scrollbar:hover,
.win-scrollbar:active {
  opacity: 1;
}

/* Track */
.win-scrollbar-track {
  position: absolute;
  background: transparent;
  border-radius: 8px;
  transition: background 0.1s var(--standard-easing);
}

.win-scrollbar.vertical .win-scrollbar-track {
  width: 100%;
  height: 100%;
}

.win-scrollbar.horizontal .win-scrollbar-track {
  width: 100%;
  height: 100%;
}

.win-scrollbar:hover .win-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
}

/* Thumb */
.win-scrollbar-thumb {
  position: absolute;
  background: rgba(99, 99, 99, 0.6);
  border-radius: 8px;
  transition:
    background 0.1s var(--standard-easing),
    width 0.1s var(--standard-easing),
    height 0.1s var(--standard-easing);
  cursor: pointer;
}

.win-scrollbar.vertical .win-scrollbar-thumb {
  width: 6px;
  left: 50%;
  transform: translateX(-50%);
  min-height: 40px;
}

.win-scrollbar.horizontal .win-scrollbar-thumb {
  height: 6px;
  top: 50%;
  transform: translateY(-50%);
  min-width: 40px;
}

/* Hover state - expand thumb */
.win-scrollbar:hover .win-scrollbar-thumb {
  background: rgba(99, 99, 99, 0.8);
}

.win-scrollbar.vertical:hover .win-scrollbar-thumb {
  width: 10px;
}

.win-scrollbar.horizontal:hover .win-scrollbar-thumb {
  height: 10px;
}

/* Active/Dragging state */
.win-scrollbar-thumb:active,
.win-scrollbar.dragging .win-scrollbar-thumb {
  background: rgba(66, 66, 66, 0.9);
}

/* Mouse indicator mode - thinner */
.win-scrollbar.mode-mouseindicator .win-scrollbar-thumb {
  background: rgba(99, 99, 99, 0.5);
}

.win-scrollbar.mode-mouseindicator.vertical .win-scrollbar-thumb {
  width: 4px;
}

.win-scrollbar.mode-mouseindicator.horizontal .win-scrollbar-thumb {
  height: 4px;
}

.win-scrollbar.mode-mouseindicator:hover.vertical .win-scrollbar-thumb {
  width: 8px;
}

.win-scrollbar.mode-mouseindicator:hover.horizontal .win-scrollbar-thumb {
  height: 8px;
}

/* Touch indicator mode - thicker, more visible */
.win-scrollbar.mode-touchindicator .win-scrollbar-thumb {
  background: rgba(99, 99, 99, 0.7);
}

.win-scrollbar.mode-touchindicator.vertical .win-scrollbar-thumb {
  width: 8px;
}

.win-scrollbar.mode-touchindicator.horizontal .win-scrollbar-thumb {
  height: 8px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .win-scrollbar:hover .win-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .win-scrollbar-thumb {
    background: rgba(159, 159, 159, 0.6);
  }

  .win-scrollbar:hover .win-scrollbar-thumb {
    background: rgba(159, 159, 159, 0.8);
  }

  .win-scrollbar-thumb:active,
  .win-scrollbar.dragging .win-scrollbar-thumb {
    background: rgba(189, 189, 189, 0.9);
  }

  .win-scrollbar.mode-mouseindicator .win-scrollbar-thumb {
    background: rgba(159, 159, 159, 0.5);
  }

  .win-scrollbar.mode-touchindicator .win-scrollbar-thumb {
    background: rgba(159, 159, 159, 0.7);
  }
}
</style>
