<template>
  <div class="control-example">
    <div class="example-header" v-if="headerText">
      <h3 class="example-title">{{ headerText }}</h3>
    </div>
    <div class="example-content" :style="contentStyle">
      <div class="example-display" :style="displayStyle">
        <slot name="example"></slot>
      </div>
      <div v-if="$slots.output || $slots.options" class="example-sidebar">
        <div v-if="$slots.output" class="example-output">
          <slot name="output"></slot>
        </div>
        <div v-if="$slots.options" class="example-options">
          <slot name="options"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  headerText: { type: String, default: '' },
  exampleHeight: { type: String, default: 'auto' }
});

const contentStyle = computed(() => ({
  minHeight: props.exampleHeight !== 'auto' ? props.exampleHeight : undefined
}));

const displayStyle = computed(() => ({
  height: props.exampleHeight !== 'auto' ? props.exampleHeight : undefined
}));
</script>

<style scoped>
.control-example {
  margin-top: 16px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  background: var(--card-bg-default);
  border: 1px solid var(--ctrl-border-rest);
}

.control-example:first-child {
  margin-top: 0;
}

.example-header {
  padding: 16px 16px 8px 16px;
  background: var(--card-bg-default);
}

.example-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.example-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0;
}

.example-display {
  padding: 12px;
  background: var(--card-bg-secondary);
  display: flex;
  align-items: center;
  min-height: 80px;
}

.example-sidebar {
  display: flex;
  flex-direction: column;
  max-width: 320px;
  min-width: 220px;
  background: var(--card-bg-default);
}

.example-output {
  padding: 16px;
  border-left: 1px solid var(--ctrl-border-rest);
  border-bottom: 1px solid var(--ctrl-border-rest);
}

.example-output:last-child {
  border-bottom: none;
}

.example-options {
  padding: 16px;
  border-left: 1px solid var(--ctrl-border-rest);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 响应式：小屏幕时侧边栏移到下方 */
@media (max-width: 768px) {
  .example-content {
    grid-template-columns: 1fr;
  }

  .example-sidebar {
    max-width: none;
    border-left: none;
    border-top: 1px solid var(--ctrl-border-rest);
  }

  .example-output {
    border-left: none;
    border-top: 1px solid var(--ctrl-border-rest);
  }

  .example-options {
    border-left: none;
  }
}

/* 输出文本样式 */
.control-example :deep(.output-text) {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
