<template>
  <div class="win-flyout-anchor" ref="anchorRef">
    <slot name="trigger"></slot>
    <Teleport to="body">
      <Transition :name="transitionName">
        <div v-if="visible" ref="flyoutRef" class="win-flyout" :class="flyoutClasses" :style="flyoutStyle">
          <slot></slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';

const props = defineProps({
  placement: { type: String, default: 'bottom' }, // 保留向后兼容
  direction: { type: String, default: 'auto' }, // 'down' | 'up' | 'auto'
  align: { type: String, default: 'left' } // 'left' | 'center' | 'right'
});

const visible = ref(false);
const anchorRef = ref(null);
const flyoutRef = ref(null);
const actualDirection = ref('down');
const position = ref({ top: 0, left: 0 });

const computeDirection = () => {
  if (props.direction !== 'auto') {
    actualDirection.value = props.direction;
    return;
  }

  // Auto: 根据窗口剩余空间判断
  if (!anchorRef.value) {
    actualDirection.value = 'down';
    return;
  }

  const rect = anchorRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  // 如果下方空间不足300px且上方空间更大，则向上弹出
  actualDirection.value = (spaceBelow < 300 && spaceAbove > spaceBelow) ? 'up' : 'down';
};

const computePosition = () => {
  if (!anchorRef.value) return;

  const rect = anchorRef.value.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  let top = 0;
  let left = 0;

  // 计算垂直位置
  if (actualDirection.value === 'down') {
    top = rect.bottom + scrollY + 8;
  } else {
    // 向上弹出时，需要等flyout渲染后才能获取高度
    top = rect.top + scrollY - 8;
  }

  // 计算水平位置
  if (props.align === 'left') {
    left = rect.left + scrollX;
  } else if (props.align === 'center') {
    left = rect.left + scrollX + rect.width / 2;
  } else if (props.align === 'right') {
    left = rect.right + scrollX;
  }

  position.value = { top, left };
};

const flyoutClasses = computed(() => {
  return [
    'direction-' + actualDirection.value,
    'align-' + props.align
  ];
});

const flyoutStyle = computed(() => {
  const style = {
    top: position.value.top + 'px',
    left: position.value.left + 'px'
  };

  // 向上弹出时需要向上偏移自身高度
  if (actualDirection.value === 'up' && flyoutRef.value) {
    const height = flyoutRef.value.offsetHeight;
    style.top = (position.value.top - height) + 'px';
  }

  return style;
});

const transitionName = computed(() => {
  return 'flyout-anim-' + actualDirection.value;
});

const show = () => {
  computeDirection();
  computePosition();
  visible.value = true;
  nextTick(() => {
    computePosition(); // 再次计算以处理向上弹出的高度
  });
};

const hide = () => {
  visible.value = false;
};

const toggle = () => {
  if (visible.value) hide();
  else show();
};

const onDocClick = (e) => {
  if (!visible.value) return;
  // 检查点击是否在anchor或flyout内部
  const clickedInAnchor = anchorRef.value && anchorRef.value.contains(e.target);
  const clickedInFlyout = flyoutRef.value && flyoutRef.value.contains(e.target);

  if (!clickedInAnchor && !clickedInFlyout) {
    hide();
  }
};

const updatePosition = () => {
  if (visible.value) {
    computePosition();
  }
};

watch(visible, (newVal) => {
  if (newVal) {
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
  } else {
    window.removeEventListener('scroll', updatePosition, true);
    window.removeEventListener('resize', updatePosition);
  }
});

onMounted(() => document.addEventListener('pointerdown', onDocClick));
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocClick);
  window.removeEventListener('scroll', updatePosition, true);
  window.removeEventListener('resize', updatePosition);
});

defineExpose({ show, hide, toggle, visible });
</script>

<style>
.win-flyout-anchor {
  position: relative;
  display: inline-flex;
}

.win-flyout {
  position: absolute;
  z-index: 9000;
  background: var(--flyout-bg);
  backdrop-filter: var(--flyout-backdrop);
  border: 1px solid var(--stroke-surface-flyout);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
  min-width: 200px;
}

/* Align: Center */
.win-flyout.align-center {
  transform: translateX(-50%);
}

/* Align: Right */
.win-flyout.align-right {
  transform: translateX(-100%);
}

/* Transform origin for animations */
.win-flyout.direction-down.align-left {
  transform-origin: top left;
}

.win-flyout.direction-down.align-center {
  transform-origin: top center;
}

.win-flyout.direction-down.align-right {
  transform-origin: top right;
}

.win-flyout.direction-up.align-left {
  transform-origin: bottom left;
}

.win-flyout.direction-up.align-center {
  transform-origin: bottom center;
}

.win-flyout.direction-up.align-right {
  transform-origin: bottom right;
}

/* 向下弹出动画 */
.flyout-anim-down-enter-active {
  transition: opacity 0.250s cubic-bezier(0, 0, 0, 1), transform 0.250s cubic-bezier(0, 0, 0, 1);
}

.flyout-anim-down-leave-active {
  transition: opacity 0.083s ease, transform 0.083s ease;
}

.flyout-anim-down-enter-from {
  opacity: 0;
}

.flyout-anim-down-enter-from.align-left {
  transform: scaleY(0.9) translateY(-4px);
}

.flyout-anim-down-enter-from.align-center {
  transform: translateX(-50%) scaleY(0.9) translateY(-4px);
}

.flyout-anim-down-enter-from.align-right {
  transform: translateX(-100%) scaleY(0.9) translateY(-4px);
}

.flyout-anim-down-leave-to {
  opacity: 0;
}

.flyout-anim-down-leave-to.align-left {
  transform: scaleY(0.9) translateY(-4px);
}

.flyout-anim-down-leave-to.align-center {
  transform: translateX(-50%) scaleY(0.9) translateY(-4px);
}

.flyout-anim-down-leave-to.align-right {
  transform: translateX(-100%) scaleY(0.9) translateY(-4px);
}

/* 向上弹出动画 */
.flyout-anim-up-enter-active {
  transition: opacity 0.250s cubic-bezier(0, 0, 0, 1), transform 0.250s cubic-bezier(0, 0, 0, 1);
}

.flyout-anim-up-leave-active {
  transition: opacity 0.083s ease, transform 0.083s ease;
}

.flyout-anim-up-enter-from {
  opacity: 0;
}

.flyout-anim-up-enter-from.align-left {
  transform: scaleY(0.9) translateY(4px);
}

.flyout-anim-up-enter-from.align-center {
  transform: translateX(-50%) scaleY(0.9) translateY(4px);
}

.flyout-anim-up-enter-from.align-right {
  transform: translateX(-100%) scaleY(0.9) translateY(4px);
}

.flyout-anim-up-leave-to {
  opacity: 0;
}

.flyout-anim-up-leave-to.align-left {
  transform: scaleY(0.9) translateY(4px);
}

.flyout-anim-up-leave-to.align-center {
  transform: translateX(-50%) scaleY(0.9) translateY(4px);
}

.flyout-anim-up-leave-to.align-right {
  transform: translateX(-100%) scaleY(0.9) translateY(4px);
}

/* 保留旧的placement API用于向后兼容 */
.win-flyout.placement-bottom {
  transform-origin: top center;
}

.win-flyout.placement-top {
  transform-origin: bottom center;
}

.flyout-anim-enter-active {
  transition: opacity 0.250s cubic-bezier(0, 0, 0, 1), transform 0.250s cubic-bezier(0, 0, 0, 1);
}

.flyout-anim-leave-active {
  transition: opacity 0.083s ease, transform 0.083s ease;
}

.flyout-anim-enter-from {
  opacity: 0;
  transform: scaleY(0.9) translateY(-4px);
}

.flyout-anim-leave-to {
  opacity: 0;
  transform: scaleY(0.9) translateY(-4px);
}
</style>
