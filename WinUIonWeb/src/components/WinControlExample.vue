<template>
  <section class="control-example-root">
    <WinTextBlock
      v-if="headerText"
      class="control-example-header"
      :Text="headerText"
      FontSize="14"
      FontWeight="600"
      LineHeight="20"
      Margin="0,12" />

    <div class="control-example-frame">
      <div class="example-container">
        <div
          class="example-display"
          :data-theme="theme"
          :style="displayStyle">
            <WinThemeWrapper :theme="themeValue">
            <slot name="example">
              <slot></slot>
            </slot>
          </WinThemeWrapper>
        </div>

        <aside v-if="hasOptions" class="example-options">
          <WinThemeWrapper :theme="themeValue">
            <slot name="options">{{ options }}</slot>
          </WinThemeWrapper>
        </aside>
      </div>

      <WinExpander
        v-if="showSourceCode"
        :IsExpanded="false"
        :Header="t('text.source-code')"
        class="code-expander">
        <div class="source-code-presenter">
          <WinSelectorBar
            v-if="codeTabItems.length > 1"
            :Items="codeTabItems"
            :SelectedItem="codeTabItems[selectedCodeTab]"
            @SelectionChanged="onCodeTabChanged" />
          <div class="sample-code-presenter">
            <WinScrollViewer
              class="source-code-scroll"
              VerticalScrollMode="Auto"
              VerticalScrollBarVisibility="Auto"
              HorizontalScrollMode="Auto"
              HorizontalScrollBarVisibility="Auto">
              <WinTextBlock
                class="code-block"
                :Text="activeCode"
                IsTextSelectionEnabled />
            </WinScrollViewer>
            <div class="copy-button-border">
              <WinButton
                class="copy-code-button"
                v-bind="{ 'tooltipservice.tooltip': t('text.copy') }"
                @Click="copyActiveCode">
                <WinTextBlock class="icon" Text="&#xE8C8;" />
              </WinButton>
            </div>
          </div>
        </div>
      </WinExpander>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, watch } from 'vue';
import WinExpander from './WinExpander.vue';
import WinButton from './WinButton.vue';
import WinSelectorBar from './WinSelectorBar.vue';
import WinScrollViewer from './WinScrollViewer.vue';
import WinTextBlock from './WinTextBlock.vue';
import WinThemeWrapper from './WinThemeWrapper.vue';

import { useI18n } from './i18n/index';

const { t } = useI18n();
defineSlots<{
  default?: () => unknown;
  example?: () => unknown;
  options?: () => unknown;
}>();
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

const themeValue = computed(() => props.theme as 'light' | 'dark' | 'system');

const selectedCodeTab = ref(0);
const slots = useSlots();

const hasSlottedContent = (slotName: string) => {
  const nodes = slots[slotName]?.() ?? [];
  return nodes.some((node) => {
    if (typeof node.children === 'string') {
      return node.children.trim().length > 0;
    }
    return node.children !== null || node.shapeFlag > 1;
  });
};

const normalizeCssLength = (value: unknown): string | undefined => {
  if (value === 'auto' || value === null || value === undefined || value === '') {
    return undefined;
  }
  return typeof value === 'number' ? `${value}px` : String(value);
};

const codeTabs = computed(() => {
  const tabs = [];
  if (props.vue) {
    tabs.push({ text: t('text.vue'), code: props.vue });
  }
  if (props.xaml || props.xamlSource) {
    tabs.push({ text: t('text.xaml'), code: props.xaml || props.xamlSource });
  }
  if (props.cSharp || props.cSharpSource) {
    tabs.push({ text: t('text.c'), code: props.cSharp || props.cSharpSource });
  }
  return tabs;
});

const codeTabItems = computed(() => codeTabs.value.map(({ text }) => ({ Text: text })));
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
  height: normalizeCssLength(props.exampleHeight),
  width: '100%',
  justifyContent: {
    Left: 'flex-start',
    Center: 'center',
    Right: 'flex-end',
    Stretch: 'stretch'
  }[props.horizontalContentAlignment] ?? 'flex-start',
  alignItems: 'flex-start'
}));

const onCodeTabChanged = (sender: { Items?: unknown[]; SelectedItem?: unknown }) => {
  const selectedIndex = sender?.Items?.indexOf(sender?.SelectedItem) ?? 0;
  selectedCodeTab.value = Math.max(0, selectedIndex);
};

const copyActiveCode = async () => {
  if (!activeCode.value) return;
  await navigator.clipboard?.writeText(activeCode.value);
};
</script>

<style scoped>
.control-example-root {
  margin: 16px 0 0;
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
  min-width: 0;
}

.example-container {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--card-stroke);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: transparent;
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
  backdrop-filter: var(--flyout-backdrop, blur(30px));
}

.example-container::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--card-bg);
}

.control-example-frame:not(:has(.code-expander)) .example-container {
  border-bottom: 1px solid var(--card-stroke);
  border-radius: 8px;
}

.example-display {
  padding: 12px;
  display: flex;
  width: 100%;
  min-width: 0;
  background: var(--control-example-display-bg, var(--SolidBackgroundFillColorBaseBrush, var(--ctrl-solid-fill)));
  color: var(--text-primary);
}

.example-options {
  width: min(320px, 32vw);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: stretch;
  background: transparent;
  border-left: 1px solid var(--stroke-divider);
  border-radius: 0 8px 0 0;
  color: var(--text-primary);
}

.code-expander {
  margin: 0;
  border-radius: 0 0 8px 8px;
  border-top: none;
  min-width: 0;
}

.code-expander :deep(.win-expander-header) {
  --win-expander-header-fill: var(--card-bg-secondary);
  border-radius: 0 0 8px 8px;
  background: transparent;
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
  position: relative;
  display: grid;
  row-gap: 16px;
  min-width: 0;
  overflow: hidden;
}

.sample-code-presenter {
  position: relative;
  min-height: 30px;
  min-width: 0;
  width: 100%;
  overflow: hidden;
}

.copy-button-border {
  position: absolute;
  top: 0;
  right: 8px;
  z-index: 2;
  border-radius: 4px;
  background: var(--control-on-image-fill-color-default, rgba(243, 243, 243, 0.85));
  color: var(--text-primary);
}

.copy-code-button {
  width: 32px;
  height: 32px;
  min-width: 0;
  padding: 6px;
}

.copy-code-button .icon {
  font-size: 14px;
}

.source-code-scroll {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: 0 0px 8px;
  box-sizing: border-box;
}

:global(html.theme-light) .copy-button-border {
  --control-on-image-fill-color-default: rgba(243, 243, 243, 0.85);
}

:global(html.theme-dark) .copy-button-border {
  --control-on-image-fill-color-default: rgba(32, 32, 32, 0.88);
}

@media (prefers-color-scheme: dark) {
  :global(html:not(.theme-light):not(.theme-dark)) .copy-button-border {
    --control-on-image-fill-color-default: rgba(32, 32, 32, 0.88);
  }
}

.source-code-presenter :deep(.win-selector-bar) {
  margin: 0 0 0 4px;
}

.source-code-presenter :deep(.code-block) {
  display: block;
  margin: 0;
  padding: 0;
  min-width: max-content;
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
