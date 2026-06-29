<template>
  <div class="win-expander" :class="{ 'is-expanded': isExpandedState, 'expand-up': expandDirection === 'Up' }">
    <button
      class="win-expander-header"
      @click="toggleExpanded"
      :aria-expanded="isExpandedState"
      type="button">
      <slot name="header">
        <span v-if="header">{{ header }}</span>
      </slot>
      <span class="win-expander-chevron">
        <span class="icon win-expander-arrow">&#xE70D;</span>
      </span>
    </button>
    <div class="win-expander-grid">
      <div class="win-expander-inner">
        <div class="win-expander-content"><slot></slot></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isExpanded: { type: Boolean, default: false },
  header: { type: String, default: '' },
  expandDirection: { type: String, default: 'Down' } // 'Down' | 'Up' - 对齐官方ExpandDirection
});

const emit = defineEmits(['update:isExpanded', 'expanded', 'collapsed']);

const isExpandedState = ref(props.isExpanded);

watch(() => props.isExpanded, (newVal) => {
  isExpandedState.value = newVal;
});

const toggleExpanded = () => {
  isExpandedState.value = !isExpandedState.value;
  emit('update:isExpanded', isExpandedState.value);

  if (isExpandedState.value) {
    emit('expanded');
  } else {
    emit('collapsed');
  }
};
</script>

<style scoped>
.win-expander {
  border: 1px solid var(--card-stroke);
  border-radius: 4px;
  margin-bottom: 4px;
}

.win-expander-header {
  width: 100%;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: var(--card-bg);
  border: none;
  border-radius: 4px;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
  color: var(--text-primary);
  font-size: 14px;
  text-align: left;
}

/* ExpandDirection: Down (默认) */
.win-expander.is-expanded .win-expander-header {
  border-radius: 4px 4px 0 0;
}

/* ExpandDirection: Up - 箭头在底部，内容在上方 */
.win-expander.expand-up {
  display: flex;
  flex-direction: column-reverse;
}

.win-expander.expand-up.is-expanded .win-expander-header {
  border-radius: 0 0 4px 4px;
}

.win-expander-chevron {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
  flex-shrink: 0;
}

.win-expander-header:hover .win-expander-chevron {
  background: var(--subtle-secondary);
}

.win-expander-header:active .win-expander-chevron {
  background: var(--subtle-tertiary);
}

.win-expander-arrow {
  font-size: 12px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  display: block;
  transition: transform var(--fast-duration) var(--fast-out-slow-in);
}

/* Down模式：展开时箭头向下 */
.win-expander:not(.expand-up).is-expanded .win-expander-arrow {
  transform: rotate(180deg);
}

/* Up模式：展开时箭头向上 */
.win-expander.expand-up.is-expanded .win-expander-arrow {
  transform: rotate(0deg);
}

.win-expander.expand-up:not(.is-expanded) .win-expander-arrow {
  transform: rotate(180deg);
}

.win-expander-grid {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--normal-duration) var(--fast-out-slow-in);
}

.win-expander.is-expanded .win-expander-grid {
  grid-template-rows: 1fr;
}

.win-expander-inner {
  min-height: 0;
  overflow: hidden;
}

.win-expander.is-expanded .win-expander-inner {
  border-top: 1px solid var(--stroke-divider);
}

/* Up模式：边框在底部 */
.win-expander.expand-up.is-expanded .win-expander-inner {
  border-top: none;
  border-bottom: 1px solid var(--stroke-divider);
}

.win-expander-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: var(--card-bg-secondary);
  border-radius: 0 0 3px 3px;
}

/* Up模式：圆角在上方 */
.win-expander.expand-up .win-expander-content {
  border-radius: 3px 3px 0 0;
}
</style>
