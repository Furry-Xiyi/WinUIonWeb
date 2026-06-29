<template>
  <div class="control-example-wrapper">
    <div class="control-example">
      <div class="example-header" v-if="headerText">
        <h3 class="example-title">{{ headerText }}</h3>
      </div>
      <div class="example-content" :style="contentStyle">
        <div class="example-display" :style="displayStyle" :class="themeClass" :data-theme="theme">
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

    <!-- Expander作为独立组件放在下方 -->
    <WinExpander
      v-if="vueCode || templateCode"
      :isExpanded="false"
      header="Source code"
      class="code-expander">
      <div class="code-section">
        <WinSelectorBar
          :items="codeTabItems"
          :selectedIndex="selectedCodeTab"
          @selectionChanged="onCodeTabChanged"
          class="code-selector" />
        <div class="code-display">
          <pre v-if="selectedCodeTab === 0" class="code-block"><code>{{ templateCode }}</code></pre>
          <pre v-else class="code-block"><code>{{ vueCode }}</code></pre>
        </div>
      </div>
    </WinExpander>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinExpander from './WinExpander.vue';
import WinSelectorBar from './WinSelectorBar.vue';

const props = defineProps({
  headerText: { type: String, default: '' },
  exampleHeight: { type: String, default: 'auto' },
  theme: { type: String, default: 'system' },
  templateCode: { type: String, default: '' },
  vueCode: { type: String, default: '' }
});

const contentStyle = computed(() => ({
  minHeight: props.exampleHeight !== 'auto' ? props.exampleHeight : undefined
}));

const displayStyle = computed(() => ({
  height: props.exampleHeight !== 'auto' ? props.exampleHeight : undefined
}));

const themeClass = computed(() => {
  if (props.theme === 'light') return 'theme-light';
  if (props.theme === 'dark') return 'theme-dark';
  return '';
});

const codeTabItems = [
  { text: 'Template' },
  { text: 'Vue' }
];

const selectedCodeTab = ref(0);

const onCodeTabChanged = ({ selectedIndex }) => {
  selectedCodeTab.value = selectedIndex;
};
</script>

<style scoped>
.control-example-wrapper {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
}

  .control-example {
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    background: var(--ctrl-fill-default);
    border: 1px solid var(--ctrl-border-rest);
    border-bottom: none;
  }

.control-example:first-child {
  margin-top: 0;
}

/* 当没有Expander时，恢复下圆角和边框 */
.control-example-wrapper:not(:has(.code-expander)) .control-example {
  border-radius: 8px;
  border-bottom: 1px solid var(--ctrl-border-rest);
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
    border-left: 1px solid var(--layer-default);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

/* Expander样式调整 - 贴合上方 */
.code-expander {
  margin-top: 0;
  margin-bottom: 4px;
  border-radius: 0 0 8px 8px;
  border-top: none;
}

.code-expander :deep(.win-expander-header) {
  border-radius: 0;
}

.code-expander :deep(.win-expander.is-expanded .win-expander-header) {
  border-radius: 0;
}

.code-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.code-selector {
  margin-left: 4px;
}

.code-display {
  background: var(--card-bg-default);
  border-radius: 4px;
  overflow: auto;
  max-height: 400px;
}

.code-block {
  margin: 0;
  padding: 16px;
  font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-primary);
  background: transparent;
  overflow-x: auto;
  white-space: pre;
  tab-size: 2;
}

/* 响应式 */
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

.control-example :deep(.output-text) {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
