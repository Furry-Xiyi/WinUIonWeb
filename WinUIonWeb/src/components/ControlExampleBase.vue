<template>
  <section class="control-example-root">
    <TextBlock
      v-if="headerText"
      class="control-example-header"
      :Text="headerText"
      FontSize="14"
      FontWeight="600"
      LineHeight="20"
      Margin="0,12" />

    <div class="control-example-frame">
      <ThemeWrapper :theme="themeValue">
        <div class="example-container" :class="{ 'has-output': hasOutput, 'has-options': hasOptions }">
          <div
            class="example-display"
            :data-theme="theme"
            :style="displayStyle">
            <slot name="example">
              <slot></slot>
            </slot>
          </div>

          <aside v-if="hasOutput" class="example-output">
            <TextBlock :Text="t('sample.menubar.output')" />
            <slot name="output" />
          </aside>

          <aside v-if="hasOptions" class="example-options">
            <slot name="options">{{ options }}</slot>
          </aside>
        </div>
      </ThemeWrapper>
      <Expander
        v-if="showSourceCode"
        Padding="0"
        HorizontalAlignment="Stretch"
        HorizontalContentAlignment="Stretch"
        class="code-expander">
        <Expander.Header>
          <TextBlock Text="{x:Bind t('text.source-code'), Mode=OneWay}" />
        </Expander.Header>
        <Grid class="source-code-presenter" RowSpacing="16">
          <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition />
          </Grid.RowDefinitions>
          <SelectorBar
            Grid.Row="0"
            Grid.Column="0"
            Margin="4,0,0,0"
            :Items="codeTabItems"
            :SelectedItem="codeTabItems[selectedCodeTab]"
            @SelectionChanged="onCodeTabChanged" />
          <Grid Grid.Row="1" Grid.Column="0" class="sample-code-presenter">
            <ScrollViewer
              Grid.Row="0"
              Grid.Column="0"
              class="source-code-scroll"
              VerticalAlignment="Top"
              VerticalScrollMode="Auto"
              VerticalScrollBarVisibility="Auto"
              HorizontalScrollMode="Auto"
              HorizontalScrollBarVisibility="Auto">
              <ContentPresenter class="code-content" Padding="16,0,16,16" MinHeight="30">
                <TextBlock
                  class="code-block"
                  Text="{x:Bind activeCode, Mode=OneWay}"
                  IsTextSelectionEnabled="True" />
              </ContentPresenter>
            </ScrollViewer>
            <Border
              Grid.Row="0"
              Grid.Column="0"
              class="copy-button-border"
              Margin="0,0,8,0"
              HorizontalAlignment="Right"
              VerticalAlignment="Top"
              Background="{ThemeResource ControlOnImageFillColorDefaultBrush}"
              CornerRadius="{ThemeResource ControlCornerRadius}">
              <Button
                class="copy-code-button"
                Width="30"
                Height="30"
                MinWidth="0"
                MinHeight="0"
                Padding="6"
                ToolTipService.ToolTip="{x:Bind t('text.copy'), Mode=OneWay}"
                Click="CopyCodeButton_Click">
                <TextBlock class="icon" Text="&#xE8C8;" FontSize="16" LineHeight="16" />
              </Button>
            </Border>
          </Grid>
        </Grid>
      </Expander>
      </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, provide, useSlots, watch } from 'vue';
import Expander from './Expander.vue';
import Button from './Button.vue';
import Border from './Border.vue';
import ContentPresenter from './ContentPresenter.vue';
import Grid from './Grid.vue';
import RowDefinition from './RowDefinition.vue';
import SelectorBar from './SelectorBar.vue';
import ScrollViewer from './ScrollViewer.vue';
import TextBlock from './TextBlock.vue';
import ThemeWrapper from './ThemeWrapper.vue';
import { xamlScopeKey } from './xamlRuntime';

import { useI18n } from './i18n/index';

const { t } = useI18n();
defineSlots<{
  default?: () => unknown;
  example?: () => unknown;
  output?: () => unknown;
  options?: () => unknown;
}>();
const props = defineProps({
  headerText: { type: String, default: '' },
  exampleHeight: { type: [String, Number], default: 'auto' },
  webViewHeight: { type: Number, default: 400 },
  webViewWidth: { type: Number, default: 800 },
  HorizontalContentAlignment: { type: String, default: 'Left' },
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
const hasOutput = computed(() => hasSlottedContent('output'));

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
  }[props.HorizontalContentAlignment] ?? 'flex-start',
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

provide(xamlScopeKey, { activeCode, t, CopyCodeButton_Click: copyActiveCode });
</script>

<style scoped>
.control-example-root {
  margin: 0;
  display: flex;
  flex-direction: column;
}

.control-example-header {
  margin: 0 0 12px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.control-example-frame {
  border-radius: var(--OverlayCornerRadius, 8px);
  overflow: hidden;
  min-width: 0;
  color: var(--text-primary);
}

.example-container {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, auto) minmax(0, auto);
  grid-template-rows: minmax(0, 1fr) auto;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 0;
  border-radius: 8px 8px 0 0;
  background: var(--GalleryBackgroundBrush, var(--SolidBackgroundFillColorBaseBrush, var(--ctrl-solid-fill)));
}

.control-example-frame:not(:has(.code-expander)) .example-container {
  border-radius: 8px;
}

.example-display {
  grid-column: 1;
  grid-row: 1;
  padding: 12px;
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  box-sizing: border-box;
  /* ControlExampleDisplayBrush is SolidBackgroundFillColorBaseBrush in the
     official ControlExample resources; it is not the card/options fill. */
  background: var(--ControlExampleDisplayBrush, var(--SolidBackgroundFillColorBaseBrush, var(--ctrl-solid-fill)));
  color: var(--text-primary);
  border: var(--ControlExampleDisplayBorderThickness, 0) solid var(--CardStrokeColorDefaultBrush, var(--card-stroke));
  border-radius: 8px 8px 0 0;
}

.example-options {
  grid-column: 3;
  grid-row: 1;
  width: 320px;
  max-width: 320px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  align-self: stretch;
  background: var(--CardBackgroundFillColorDefaultBrush, var(--card-bg));
  border-left: 1px solid var(--DividerStrokeColorDefaultBrush, var(--stroke-divider));
  border-radius: 0 8px 0 0;
  color: var(--text-primary);
}

.example-output {
  grid-column: 2;
  grid-row: 1;
  max-width: 320px;
  width: auto;
  margin: 12px 12px 12px 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  align-self: stretch;
  justify-self: end;
  background: var(--ControlExampleDisplayBrush, var(--SolidBackgroundFillColorBaseBrush, var(--ctrl-solid-fill)));
  border: 0;
  border-radius: var(--OverlayCornerRadius, 8px);
  color: var(--text-primary);
}

.example-display > :deep(*) {
  min-width: 0;
  max-width: 100%;
}

.example-options :deep(*) {
  max-width: 100%;
  min-width: 0;
}

.example-options :deep(.win-text-block),
.example-output :deep(.win-text-block) {
  overflow-wrap: anywhere;
  white-space: normal;
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
  gap: 0;
}

.source-code-presenter {
  position: relative;
  grid-template-columns: minmax(0, 1fr);
}

.sample-code-presenter {
  position: relative;
  isolation: isolate;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
}

/* SampleCodePresenter.xaml overlays the copy button in the same Grid cell
   as the ScrollViewer, outside the padded, scrolling CodePresenter. */
.copy-button-border {
  --ControlCornerRadius: 4px;
  --ControlOnImageFillColorDefaultBrush: var(--control-on-image-fill-color-default, #ffffffc9);
  z-index: 2;
  color: var(--text-primary);
}

.source-code-scroll {
  z-index: 0;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: 0;
  box-sizing: border-box;
}

.code-content {
  /* Measure unwrapped code inside the viewport; padding is the XAML property. */
  width: max-content;
  min-width: 100%;
}

:global(html.theme-light .copy-button-border),
:global(.example-theme-wrapper.theme-light .copy-button-border),
:global(.win-theme-scope.theme-light .copy-button-border) {
  --control-on-image-fill-color-default: #ffffffc9;
}

:global(html.theme-dark .copy-button-border),
:global(.example-theme-wrapper.theme-dark .copy-button-border),
:global(.win-theme-scope.theme-dark .copy-button-border) {
  --control-on-image-fill-color-default: #1c1c1cb3;
}

@media (prefers-color-scheme: dark) {
  :global(html:not(.theme-light):not(.theme-dark) .copy-button-border),
  :global(.example-theme-wrapper:not(.theme-light) .copy-button-border),
  :global(.win-theme-scope:not(.theme-light) .copy-button-border) {
    --control-on-image-fill-color-default: #1c1c1cb3;
  }
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
    grid-template-columns: minmax(0, 1fr) minmax(0, auto);
    grid-template-rows: minmax(0, 1fr) auto;
  }

  .example-options {
    grid-column: 1 / span 2;
    grid-row: 2;
    max-width: none;
    width: auto;
    border-left: 0;
    border-top: 1px solid var(--DividerStrokeColorDefaultBrush, var(--stroke-divider));
    border-radius: 0;
    margin: 24px 0 0;
    justify-self: stretch;
  }

  .example-output {
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
    margin: 12px 12px 12px 0;
    width: auto;
    max-width: min(320px, 100%);
  }
}
</style>
