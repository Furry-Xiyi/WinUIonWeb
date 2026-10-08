<template>
  <UserControl ref="root" v-bind="attrs" class="win-horizontal-scroll-container">
    <Grid class="win-horizontal-scroll-layout">
      <ScrollViewer
        ref="scroller"
        class="win-horizontal-scroll-scroller"
        HorizontalScrollMode="Enabled"
        HorizontalScrollBarVisibility="Hidden"
        VerticalScrollMode="Disabled"
        VerticalScrollBarVisibility="Hidden"
        ZoomMode="Disabled"
        IsTabStop="False"
        ViewChanging="Scroller_ViewChanging"
        ViewChanged="Scroller_ViewChanged">
        <Grid class="win-horizontal-scroll-content" Margin="36,0,36,0">
          <ContentPresenter Content="{x:Bind Source, Mode=OneWay}" />
        </Grid>
      </ScrollViewer>

      <Button
        ref="scrollBackButton"
        :style="scrollBackButtonStyle"
        class="win-horizontal-scroll-button scroll-back"
        Width="16"
        Height="38"
        Margin="8,0,0,0"
        Padding="0"
        HorizontalAlignment="Left"
        VerticalAlignment="Center"
        BackgroundSizing="InnerBorderEdge"
        BorderThickness="1"
        CornerRadius="{ThemeResource ControlCornerRadius}"
        UseSystemFocusVisuals="True"
        FocusVisualMargin="-3"
        AutomationProperties.Name="{x:Bind ScrollLeftLabel, Mode=OneWay}"
        ToolTipService.ToolTip="{x:Bind ScrollLeftLabel, Mode=OneWay}"
        Visibility="{x:Bind ScrollBackVisibility, Mode=OneWay}"
        Click="ScrollBackBtn_Click">
        <FontIcon FontSize="{ThemeResource FlipViewButtonFontSize}" Glyph="&#xEDD9;" />
      </Button>

      <Button
        ref="scrollForwardButton"
        :style="scrollForwardButtonStyle"
        class="win-horizontal-scroll-button scroll-forward"
        Width="16"
        Height="38"
        Margin="0,0,8,0"
        Padding="0"
        HorizontalAlignment="Right"
        VerticalAlignment="Center"
        BackgroundSizing="InnerBorderEdge"
        BorderThickness="1"
        CornerRadius="{ThemeResource ControlCornerRadius}"
        UseSystemFocusVisuals="True"
        FocusVisualMargin="-3"
        AutomationProperties.Name="{x:Bind ScrollRightLabel, Mode=OneWay}"
        ToolTipService.ToolTip="{x:Bind ScrollRightLabel, Mode=OneWay}"
        Visibility="{x:Bind ScrollForwardVisibility, Mode=OneWay}"
        Click="ScrollForwardBtn_Click">
        <FontIcon FontSize="{ThemeResource FlipViewButtonFontSize}" Glyph="&#xEDDA;" />
      </Button>
    </Grid>
  </UserControl>
</template>

<script>
import { defineComponent } from 'vue';
const HorizontalScrollSource = defineComponent({ name: 'HorizontalScrollContainer.Source', __horizontalScrollProperty: 'Source', setup: () => () => null });
export default { Source: HorizontalScrollSource };
</script>

<script setup>
import { computed, Fragment, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, useAttrs, useSlots, watch } from 'vue';
import Button from './Button.vue';
import ContentPresenter from './ContentPresenter.vue';
import FontIcon from './FontIcon.vue';
import Grid from './Grid.vue';
import ScrollViewer from './ScrollViewer.vue';
import UserControl from './UserControl';
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import { getVNodeChildren } from './CollectionProperties';
import { useI18n } from './i18n/index';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBrush } from './acrylicBrushVisual';

defineOptions({ inheritAttrs: false });
const props = defineProps({ Source: { type: null, default: undefined } });
const { t } = useI18n();
const instance = getCurrentInstance();
const attrs = useAttrs(), slots = useSlots();
const SourceOutlet = defineComponent({
  setup() { return () => {
    const nodes = slots.default?.() ?? [];
    const property = nodes.find(node => node.type?.__horizontalScrollProperty === 'Source');
    return h(Fragment, normalizeXamlNodes(property ? getVNodeChildren(property) : [], instance));
  }; }
});
const resolvedSource = computed(() => resolveXamlValue(props.Source, instance));
const localSource = shallowRef(undefined);
watch(resolvedSource, () => { localSource.value = undefined; });
const Source = computed({
  get: () => localSource.value === undefined ? resolvedSource.value ?? h(SourceOutlet) : localSource.value,
  set: value => { localSource.value = value; updateXamlBinding(props.Source, value, instance); }
});
defineExpose({ Source });

const root = ref(null);
const scroller = ref(null);
const scrollBackButton = ref(null);
const scrollForwardButton = ref(null);
const buttonState = button => button.value?.IsPressed ? 'Pressed' : button.value?.IsPointerOver ? 'PointerOver' : '';
const backButtonState = computed(() => buttonState(scrollBackButton));
const forwardButtonState = computed(() => buttonState(scrollForwardButton));
const scrollBackButtonStyle = useAcrylicBrushStyle(() => `{ThemeResource FlipViewNextPreviousButtonBackground${backButtonState.value}}`, instance);
const scrollForwardButtonStyle = useAcrylicBrushStyle(() => `{ThemeResource FlipViewNextPreviousButtonBackground${forwardButtonState.value}}`, instance);

const canScrollBack = ref(false);
const canScrollForward = ref(false);
const ScrollBackVisibility = computed(() => canScrollBack.value ? 'Visible' : 'Collapsed');
const ScrollForwardVisibility = computed(() => canScrollForward.value ? 'Visible' : 'Collapsed');
const ScrollLeftLabel = computed(() => t('text.scroll-left'));
const ScrollRightLabel = computed(() => t('text.scroll-right'));
let resizeObserver = null;
const brushVisuals = new Set();
const edgeTolerance = 1;
let pendingFocus = null;
let wheelHost = null;
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}),
  Source, ScrollBackVisibility, ScrollForwardVisibility, ScrollLeftLabel, ScrollRightLabel,
  ScrollBackBtn_Click: () => scrollBack(),
  ScrollForwardBtn_Click: () => scrollForward(),
  Scroller_ViewChanging: () => updateScrollButtonsVisibility(),
  Scroller_ViewChanged: () => updateScrollButtonsVisibility()
});
const viewport = () => scroller.value?.scrollViewerRef?.value ?? scroller.value?.scrollViewerRef ?? null;

const forwardOverlayWheel = event => {
  const el = viewport();
  if (event.defaultPrevented || !el || el.contains(event.target)) return;
  // The overlaid arrows and gutter use the same ScrollViewer input path.
  // Only the original event may chain to the outer page at an edge.
  const forwarded = new WheelEvent('wheel', {
    cancelable: true,
    deltaX: event.deltaX, deltaY: event.deltaY, deltaMode: event.deltaMode,
    ctrlKey: event.ctrlKey, shiftKey: event.shiftKey, altKey: event.altKey, metaKey: event.metaKey,
    clientX: event.clientX, clientY: event.clientY
  });
  el.dispatchEvent(forwarded);
  if (forwarded.defaultPrevented) {
    event.preventDefault();
    event.stopPropagation();
  }
};

const getScrollableWidth = () => {
  const el = viewport();
  if (!el) return 0;
  return Math.max(0, el.scrollWidth - el.clientWidth);
};

const updateScrollButtonsVisibility = () => {
  const el = viewport();
  if (!el) {
    canScrollBack.value = false;
    canScrollForward.value = false;
    return;
  }

  const scrollableWidth = getScrollableWidth();
  const horizontalOffset = el.scrollLeft;
  canScrollBack.value = horizontalOffset > edgeTolerance;
  canScrollForward.value = scrollableWidth > edgeTolerance && horizontalOffset < scrollableWidth - edgeTolerance;
  focusOppositeButton();
};

const focusOppositeButton = () => {
  const control = pendingFocus === 'back' && canScrollBack.value ? scrollBackButton
    : pendingFocus === 'forward' && canScrollForward.value ? scrollForwardButton : null;
  if (!control) return;
  pendingFocus = null;
  nextTick(() => control.value?.Focus());
};

const ChangeView = (offset) => {
  const el = viewport();
  if (!el) return;

  scroller.value?.ChangeView(el.scrollLeft + offset, null, null);
};

const scrollBack = () => {
  const el = viewport();
  if (!el) return;

  pendingFocus = 'forward';
  ChangeView(-el.clientWidth);
  focusOppositeButton();
};

const scrollForward = () => {
  const el = viewport();
  if (!el) return;

  pendingFocus = 'back';
  ChangeView(el.clientWidth);
  focusOppositeButton();
};

// Button owns input state; its material is painted behind its existing presenter.
for (const [button, style] of [[scrollBackButton, scrollBackButtonStyle], [scrollForwardButton, scrollForwardButtonStyle]]) {
  watch([button, style], ([control, value]) => {
    const element = control?.Element;
    if (!element) return;
    const binding = { value, modifiers: {} };
    if (brushVisuals.has(element)) vAcrylicBrush.updated(element, binding);
    else { vAcrylicBrush.mounted(element, binding); brushVisuals.add(element); }
  }, { immediate: true, flush: 'post' });
}

onMounted(async () => {
  await nextTick();
  updateScrollButtonsVisibility();
  wheelHost = root.value?.Element ?? root.value?.$el;
  wheelHost?.addEventListener('wheel', forwardOverlayWheel, { passive: false });

  resizeObserver = new ResizeObserver(updateScrollButtonsVisibility);
  const el = viewport();
  if (el) {
    resizeObserver.observe(el);
    const contents = el.querySelector('.win-horizontal-scroll-content');
    if (contents) resizeObserver.observe(contents);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  wheelHost?.removeEventListener('wheel', forwardOverlayWheel);
  for (const element of brushVisuals) vAcrylicBrush.beforeUnmount(element);
  brushVisuals.clear();
});
</script>

<style scoped>
.win-horizontal-scroll-container {
  position: relative;
  min-width: 0;
}

.win-horizontal-scroll-layout {
  min-width: 0;
  grid-template-columns: minmax(0, 1fr);
  justify-content: stretch;
}

.win-horizontal-scroll-scroller {
  min-width: 0;
  max-width: 100%;
}

.win-horizontal-scroll-content {
  width: max-content;
  height: 100%;
  align-content: stretch;
}

.win-horizontal-scroll-scroller :deep(> .win-scroll-viewer-viewport > .scroll-content) {
  height: 100%;
}

.win-horizontal-scroll-container :deep(.win-horizontal-scroll-button) {
  --ButtonBorderThemeThickness: 0px;
  --ButtonBackground: transparent;
  --ButtonBackgroundPointerOver: transparent;
  --ButtonBackgroundPressed: transparent;
  --ButtonForegroundPointerOver: var(--FlipViewNextPreviousArrowForegroundPointerOver);
  --ButtonForegroundPressed: var(--FlipViewNextPreviousArrowForegroundPressed);
  --ButtonBorderBrush: var(--FlipViewNextPreviousButtonBorderBrush);
  --ButtonBorderBrushTop: var(--FlipViewNextPreviousButtonBorderBrush);
  --ButtonBorderBrushBottom: var(--FlipViewNextPreviousButtonBorderBrush);
  --ButtonBorderBrushPointerOver: var(--FlipViewNextPreviousButtonBorderBrushPointerOver);
  --ButtonBorderBrushPointerOverTop: var(--FlipViewNextPreviousButtonBorderBrushPointerOver);
  --ButtonBorderBrushPointerOverBottom: var(--FlipViewNextPreviousButtonBorderBrushPointerOver);
  --ButtonBorderBrushPressed: var(--FlipViewNextPreviousButtonBorderBrushPressed);
  --ButtonBorderBrushPressedTop: var(--FlipViewNextPreviousButtonBorderBrushPressed);
  --ButtonBorderBrushPressedBottom: var(--FlipViewNextPreviousButtonBorderBrushPressed);
  isolation: isolate;
  z-index: 2;
  transition: background-color 83ms linear;
}

.win-horizontal-scroll-container :deep(.win-horizontal-scroll-button > .win-button-content-presenter) {
  width: 100%;
  height: 100%;
  padding: 0;
}

.win-horizontal-scroll-container :deep(.win-horizontal-scroll-button > .win-acrylic-visual) {
  inset: 1px !important;
  border-radius: max(0px, calc(var(--ButtonCornerRadius) - 1px)) !important;
}

.win-horizontal-scroll-container :deep(.win-horizontal-scroll-button .win-font-icon) {
  color: inherit;
}
</style>
