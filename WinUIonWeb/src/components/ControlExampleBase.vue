<template>
  <section class="control-example-root" :class="{ 'has-fixed-height': hasFixedHeight }" :style="rootStyle">
    <TextBlock
      v-if="headerText"
      class="control-example-header"
      Text="{x:Bind ControlExampleHeaderText, Mode=OneWay}"
      Style="{ThemeResource BodyStrongTextBlockStyle}"
      AutomationProperties.HeadingLevel="Level3"
      Margin="0,12" />

    <div class="control-example-frame">
      <ThemeWrapper :theme="themeValue" class="control-example-theme">
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
            <TextBlock Text="{x:Bind t('sample.menubar.output'), Mode=OneWay}" />
            <slot name="output" />
          </aside>

          <aside v-if="hasOptions" class="example-options">
            <slot name="options">{{ options }}</slot>
          </aside>
        </div>
      <Expander
        v-if="showSourceCode"
        Padding="0"
        HorizontalAlignment="Stretch"
        HorizontalContentAlignment="Stretch"
        Background="{ThemeResource CardBackgroundFillColorSecondaryBrush}"
        CornerRadius="0,0,8,8"
        class="code-expander">
        <Expander.Header>
          <TextBlock Text="{x:Bind t('text.source-code'), Mode=OneWay}" />
        </Expander.Header>
        <Expander.Content>
        <Grid class="source-code-presenter" RowSpacing="16">
          <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition />
          </Grid.RowDefinitions>
          <SelectorBar
            Grid.Row="0"
            Grid.Column="0"
            Margin="4,0,0,0"
            Items="{x:Bind codeTabItems, Mode=OneWay}"
            SelectedItem="{x:Bind codeTabItems[selectedCodeTab], Mode=OneWay}"
            SelectionChanged="onCodeTabChanged" />
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
                <SampleCodePresenter
                  Code="{x:Bind activeCode, Mode=OneWay}"
                  SampleType="{x:Bind activeCodeKind, Mode=OneWay}" />
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
                <FontIcon Glyph="&#xE8C8;" FontSize="16" />
              </Button>
            </Border>
          </Grid>
        </Grid>
        </Expander.Content>
      </Expander>
      </ThemeWrapper>
      </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, h, markRaw, provide, useSlots, watch } from 'vue';
import Expander from './Expander.vue';
import FontIcon from './FontIcon.vue';
import Button from './Button.vue';
import Border from './Border.vue';
import ContentPresenter from './ContentPresenter.vue';
import Grid from './Grid.vue';
import RowDefinition from './RowDefinition.vue';
import SelectorBar from './SelectorBar.vue';
import SelectorBarItem from './SelectorBarItem.vue';
import { createSelectorBarItem } from './selectorBarRuntime';
import ScrollViewer from './ScrollViewer.vue';
import SampleCodePresenter from './SampleCodePresenter.vue';
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
  height: { type: [String, Number], default: 'auto' },
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
const ownerInstance = getCurrentInstance();

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
  if (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value.trim())) return `${value.trim()}px`;
  return typeof value === 'number' ? `${value}px` : String(value);
};

const codeTabs = computed(() => {
  const tabs = [];
  const substitute = (source: string) => source.replace(/\$\((\w+)\)/g, (marker, key) => {
    const item = props.substitutions.find(value => value && typeof value === 'object' && value.Key === key);
    if (!item) return marker;
    if (item.IsEnabled === false || item.Value === undefined || item.Value === null) return '';
    const value = item.Value && typeof item.Value === 'object' && 'Color' in item.Value ? item.Value.Color : item.Value;
    return typeof value === 'boolean' ? value ? 'True' : 'False' : String(value);
  });
  if (props.vue) {
    tabs.push({ kind: 'vue', text: t('text.vue'), code: props.vue });
  }
  if (props.xaml || props.xamlSource) {
    tabs.push({ kind: 'xaml', text: t('text.xaml'), code: substitute(props.xaml || props.xamlSource) });
  }
  if (props.cSharp || props.cSharpSource) {
    tabs.push({ kind: 'csharp', text: t('text.c'), code: substitute(props.cSharp || props.cSharpSource) });
  }
  return tabs;
});

// Source substitutions change the code, while each tab remains the same
// SelectorBarItem. SelectedItem must belong to the actual Items collection.
const sourceTabItems = new Map<string, { text: string; item: ReturnType<typeof createSelectorBarItem> }>();
const codeTabItems = computed(() => codeTabs.value.map(({ kind, text }) => {
  let entry = sourceTabItems.get(kind);
  if (!entry) {
    const item = markRaw(createSelectorBarItem(h(SelectorBarItem, { Text: text }), ownerInstance, (_selectedItem, selected) => {
      if (selected) selectedCodeTab.value = Math.max(0, codeTabs.value.findIndex(tab => tab.kind === kind));
    }));
    entry = { text, item };
    sourceTabItems.set(kind, entry);
  } else if (entry.text !== text) {
    (entry.item.UpdateNode as (node: ReturnType<typeof h>) => void)(h(SelectorBarItem, { Text: text }));
    entry.text = text;
  }
  return entry.item;
}));
const activeCode = computed(() => codeTabs.value[selectedCodeTab.value]?.code ?? '');
const activeCodeKind = computed(() => codeTabs.value[selectedCodeTab.value]?.kind === 'csharp' ? 'CSharp' : 'XAML');

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

const hasFixedHeight = computed(() => Boolean(normalizeCssLength(props.height)));
const rootStyle = computed(() => ({ height: normalizeCssLength(props.height) }));

const displayStyle = computed(() => ({
  height: hasFixedHeight.value ? '100%' : normalizeCssLength(props.exampleHeight),
  width: '100%',
  justifyItems: {
    Left: 'start',
    Center: 'center',
    Right: 'end',
    Stretch: 'stretch'
  }[props.HorizontalContentAlignment] ?? 'start',
  alignItems: hasFixedHeight.value ? 'stretch' : 'start'
}));

const onCodeTabChanged = (sender: { Items?: unknown[]; SelectedItem?: unknown }) => {
  const selectedIndex = sender?.Items?.indexOf(sender?.SelectedItem) ?? 0;
  selectedCodeTab.value = Math.max(0, selectedIndex);
};

const copyActiveCode = async () => {
  if (!activeCode.value) return;
  await navigator.clipboard?.writeText(activeCode.value);
};

provide(xamlScopeKey, {
  ControlExampleHeaderText: computed(() => props.headerText),
  codeTabItems,
  selectedCodeTab,
  onCodeTabChanged,
  activeCode,
  activeCodeKind,
  t,
  CopyCodeButton_Click: copyActiveCode
});
</script>

<style scoped>
.control-example-root {
  margin: 16px 0 0;
  display: flex;
  flex-direction: column;
}

.control-example-header {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.control-example-frame {
  container: control-example / inline-size;
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
  border: 1px solid var(--GalleryBorderBrush, var(--CardStrokeColorDefaultBrush, var(--card-stroke)));
  box-sizing: border-box;
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
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  min-width: 0;
  min-height: 0;
  /* ContentPresenter is a drawing boundary, not an implicit scroll host. */
  overflow: clip;
  box-sizing: border-box;
  /* ControlExampleDisplayBrush is SolidBackgroundFillColorBaseBrush in the
     official ControlExample resources; it is not the card/options fill. */
  background: var(--ControlExampleDisplayBrush, var(--SolidBackgroundFillColorBaseBrush, var(--ctrl-solid-fill)));
  color: var(--text-primary);
  border: var(--ControlExampleDisplayBorderThickness, 0) solid var(--CardStrokeColorDefaultBrush, var(--card-stroke));
  border-radius: 8px 8px 0 0;
}

/* A ContentPresenter respects the sample root's FrameworkElement alignment. */
.example-display > :deep([horizontalalignment="Center"]) {
  justify-self: center;
}

.example-display > :deep([horizontalalignment="Right"]) {
  justify-self: end;
}

.example-display > :deep([horizontalalignment="Left"]) {
  justify-self: start;
}

.example-display > :deep([horizontalalignment="Stretch"]) {
  justify-self: stretch;
}

.example-options {
  grid-column: 3;
  grid-row: 1;
  width: auto;
  max-width: 320px;
  box-sizing: border-box;
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
  /* The official column's 320px maximum includes its 12px right margin. */
  max-width: 308px;
  width: auto;
  box-sizing: border-box;
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
  /* The secondary card fill is translucent. Keep its base surface in the
     example's theme when the surrounding Gallery page uses another theme. */
  background: var(--SolidBackgroundFillColorBaseBrush, var(--ctrl-solid-fill));
  border-radius: 0 0 8px 8px;
  border-top: none;
  min-width: 0;
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
  user-select: text;
  -webkit-user-select: text;
}

.code-content {
  /* Measure unwrapped code inside the viewport; padding is the XAML property. */
  width: max-content;
  min-width: 100%;
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
    max-width: 308px;
  }
}

/* Reflow the three regions using the example host's available width. The
   Gallery navigation can leave a narrow host even in a wider window. */
@container control-example (max-width: 600px) {
  .example-container {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto;
  }

  .example-display {
    grid-column: 1;
    grid-row: 1;
    width: 100%;
    min-width: 0;
  }

  .example-output {
    grid-column: 1;
    grid-row: 2;
    width: auto;
    max-width: none;
    margin: 12px;
    min-width: 0;
    border-radius: var(--OverlayCornerRadius, 8px);
  }

  .example-options {
    grid-column: 1;
    grid-row: 3;
    width: auto;
    max-width: none;
    margin: 0;
    border-top: 1px solid var(--DividerStrokeColorDefaultBrush, var(--stroke-divider));
  }
}
.control-example-root.has-fixed-height {
  min-height: 0;
}

.has-fixed-height .control-example-header {
  flex-shrink: 0;
}

.has-fixed-height .control-example-frame {
  display: flex;
  flex: 1 1 0;
  min-height: 0;
}

.has-fixed-height .control-example-theme {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.has-fixed-height .example-container {
  flex: 1 1 0;
  min-height: 0;
}

.has-fixed-height .example-display {
  min-height: 0;
}

.has-fixed-height .code-expander {
  flex: 0 0 auto;
}

@container control-example (max-width: 600px) {
  .has-fixed-height .example-container {
    grid-template-rows: minmax(0, 1fr) auto auto;
  }
}
</style>
