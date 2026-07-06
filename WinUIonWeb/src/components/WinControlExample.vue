<template>
  <section class="control-example-root">
    <WinTextBlock v-if="headerText" class="control-example-header" :Text="headerText" />

    <div class="control-example-frame">
      <div class="example-container">
        <div
          class="example-display"
          :data-theme="theme"
          :style="displayStyle">
          <WinThemeWrapper :theme="theme">
            <slot name="example">
              <slot></slot>
            </slot>
          </WinThemeWrapper>
        </div>

        <aside v-if="hasOptions" class="example-options">
          <slot name="options">{{ options }}</slot>
        </aside>
      </div>

      <WinExpander
        v-if="showSourceCode"
        :isExpanded="false"
        header="Source code"
        class="code-expander">
        <div class="source-code-presenter">
          <WinSelectorBar
            v-if="codeTabItems.length > 1"
            :items="codeTabItems"
            :selectedIndex="selectedCodeTab"
            @selectionChanged="onCodeTabChanged" />
          <WinTextBlock
            class="code-block"
            :Text="activeCode"
            IsTextSelectionEnabled />
        </div>
      </WinExpander>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, useSlots, watch } from 'vue';
import WinExpander from './WinExpander.vue';
import WinSelectorBar from './WinSelectorBar.vue';
import WinTextBlock from './WinTextBlock.vue';
import WinThemeWrapper from './WinThemeWrapper.vue';

const props = defineProps({
  headerText: { type: String, default: '' },
  exampleHeight: { type: [String, Number], default: 'auto' },
  webViewHeight: { type: Number, default: 400 },
  webViewWidth: { type: Number, default: 800 },
  horizontalContentAlignment: { type: String, default: 'Left' },
  sourceCodeVisibility: { type: [Boolean, String], default: true },
  theme: { type: String, default: 'light' },
  options: { type: [String, Number, Boolean, Object], default: null },
  xaml: { type: String, default: '' },
  cSharp: { type: String, default: '' },
  vue: { type: String, default: '' },
  xamlSource: { type: String, default: '' },
  cSharpSource: { type: String, default: '' },
  sampleDefinition: { type: String, default: '' },
  substitutions: { type: Array, default: () => [] }
});

const selectedCodeTab = ref(0);
const slots = useSlots();

const hasSlottedContent = (slotName) => {
  const nodes = slots[slotName]?.() ?? [];
  return nodes.some((node) => {
    if (typeof node.children === 'string') {
      return node.children.trim().length > 0;
    }
    return node.children !== null || node.shapeFlag > 1;
  });
};

const normalizeCssLength = (value) => {
  if (value === 'auto' || value === null || value === undefined || value === '') {
    return undefined;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const codeTabs = computed(() => {
  const tabs = [];
  if (props.vue) {
    tabs.push({ text: 'Vue', code: props.vue });
  }
  if (props.xaml || props.xamlSource) {
    tabs.push({ text: 'XAML', code: props.xaml || props.xamlSource });
  }
  if (props.cSharp || props.cSharpSource) {
    tabs.push({ text: 'C#', code: props.cSharp || props.cSharpSource });
  }
  return tabs;
});

const codeTabItems = computed(() => codeTabs.value.map(({ text }) => ({ text })));
const activeCode = computed(() => codeTabs.value[selectedCodeTab.value]?.code ?? '');

const showSourceCode = computed(() => {
  const visible = props.sourceCodeVisibility !== false && props.sourceCodeVisibility !== 'Collapsed';
  return visible && codeTabs.value.length > 0;
});

const hasOptions = computed(() => props.options !== null || hasSlottedContent('options'));

watch(codeTabs, (tabs) => {
  if (selectedCodeTab.value >= tabs.length) {
    selectedCodeTab.value = 0;
  }
});

const displayStyle = computed(() => ({
  justifyContent: {
    Left: 'flex-start',
    Center: 'center',
    Right: 'flex-end',
    Stretch: 'stretch'
  }[props.horizontalContentAlignment] ?? 'flex-start'
}));

const onCodeTabChanged = ({ selectedIndex }) => {
  selectedCodeTab.value = selectedIndex;
};
</script>

<style scoped>
.control-example-root {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
}

.control-example-header {
  margin: 12px 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.control-example-frame {
  border-radius: 8px;
  overflow: hidden;
}

.example-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid var(--card-stroke);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: var(--card-bg);
}

.control-example-frame:not(:has(.code-expander)) .example-container {
  border-bottom: 1px solid var(--card-stroke);
  border-radius: 8px;
}

.example-display {
  padding: 12px;
  display: flex;
  align-items: center;
  background: var(--control-example-display-bg, var(--ctrl-solid-fill));
  color: var(--text-primary);
}

.example-options {
  width: min(320px, 32vw);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: stretch;
  background: var(--card-bg);
  border-left: 1px solid var(--stroke-divider);
  border-radius: 0 8px 0 0;
  color: var(--text-primary);
}

.code-expander {
  margin: 0;
  border-radius: 0 0 8px 8px;
  border-top: none;
}

.code-expander :deep(.win-expander-header) {
  border-radius: 0 0 8px 8px;
  background: var(--card-bg-secondary);
  min-height: auto;
  padding: 8px 12px;
}

.code-expander :deep(.win-expander-chevron) {
  width: 32px;
  height: 32px;
}

.code-expander.is-expanded :deep(.win-expander-header) {
  border-radius: 0;
}

.code-expander.is-expanded :deep(.win-expander-content) {
  border-radius: 0 0 8px 8px;
}

.code-expander :deep(.win-expander-content) {
  padding: 0;
  gap: 0;
}

.source-code-presenter {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--card-bg-secondary);
}

.source-code-presenter :deep(.win-selector-bar) {
  margin: 0;
}

.source-code-presenter :deep(.code-block) {
  display: block;
  margin: 0;
  padding: 0;
  overflow: visible;
  color: var(--text-primary);
  background: transparent;
  font-family: 'Cascadia Code', Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
  tab-size: 2;
}

@media (max-width: 739px) {
  .example-container {
    grid-template-columns: minmax(0, 1fr);
  }

  .example-options {
    width: auto;
    border-left: 0;
    border-top: 1px solid var(--stroke-divider);
  }
}
</style>
