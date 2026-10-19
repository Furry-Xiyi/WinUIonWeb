<template>
  <Grid
    x:Name="PART_LayoutRoot"
    :ref="registerRoot"
    v-bind="rootAttrs"
    class="win-titlebar"
    :class="rootClasses"
    :style="rootStyle"
    :data-titlebar-height-option="resolvedCaptionHeightOption"
    :data-titlebar-caption-hit-test="nativeCaptionHitTestEnabled ? 'NativeSnap' : 'Web'"
    :dir="FlowDirection === 'RightToLeft' ? 'rtl' : 'ltr'">
    <Grid.ColumnDefinitions>
      <ColumnDefinition x:Name="LeftPaddingColumn" Width="{ThemeResource TitleBarLeftPaddingWidth}" />
      <ColumnDefinition Width="Auto" /><ColumnDefinition Width="Auto" /><ColumnDefinition Width="Auto" />
      <ColumnDefinition Width="{x:Bind HeaderInset, Mode=OneWay}" />
      <ColumnDefinition Width="Auto" /><ColumnDefinition Width="Auto" /><ColumnDefinition Width="Auto" />
      <ColumnDefinition Width="*" /><ColumnDefinition Width="Auto" />
      <ColumnDefinition Width="{ThemeResource TitleBarMinDragRegionWidth}" />
      <ColumnDefinition v-if="!captionControlsVisible" x:Name="RightPaddingColumn" Width="{ThemeResource TitleBarRightPaddingWidth}" />
      <template v-else>
        <ColumnDefinition Width="46" /><ColumnDefinition Width="46" /><ColumnDefinition Width="46" />
        <ColumnDefinition Width="0" />
      </template>
    </Grid.ColumnDefinitions>
    <div Grid.Column="0" class="win-titlebar-left-padding" aria-hidden="true"></div>

    <Button
      v-if="IsBackButtonVisible"
      x:Name="PART_BackButton"
      Grid.Column="1"
      class="win-titlebar-back-button"
      Style="{ThemeResource TitleBarBackButtonStyle}"
      VerticalAlignment="Stretch" HorizontalContentAlignment="Center" VerticalContentAlignment="Center" FontSize="16"
      IsEnabled="{x:Bind BackButtonEnabled, Mode=OneWay}"
      AutomationProperties.Name="{x:Bind BackLabel, Mode=OneWay}"
      ToolTipService.ToolTip="{x:Bind BackLabel, Mode=OneWay}"
      Click="requestBack">
      <AnimatedIcon class="icon" Width="16" Height="16" HorizontalAlignment="Center" VerticalAlignment="Center">
        <AnimatedIcon.Source><animatedvisuals:AnimatedBackVisualSource /></AnimatedIcon.Source>
        <AnimatedIcon.FallbackIconSource><FontIconSource Glyph="&#xE72B;" /></AnimatedIcon.FallbackIconSource>
      </AnimatedIcon>
    </Button>

    <Button
      v-if="IsPaneToggleButtonVisible"
      x:Name="PART_PaneToggleButton"
      Grid.Column="2"
      class="win-titlebar-pane-toggle-button"
      Style="{ThemeResource TitleBarPaneToggleButtonStyle}"
      VerticalAlignment="Stretch" HorizontalContentAlignment="Center" VerticalContentAlignment="Center" FontSize="16"
      IsEnabled="{x:Bind IsEnabled, Mode=OneWay}"
      data-nav-pane-toggle
      :aria-expanded="IsPaneOpen"
      AutomationProperties.Name="{x:Bind PaneLabel, Mode=OneWay}"
      ToolTipService.ToolTip="{x:Bind PaneLabel, Mode=OneWay}"
      Click="requestPaneToggle">
      <AnimatedIcon class="icon" Width="16" Height="16" HorizontalAlignment="Center" VerticalAlignment="Center">
        <AnimatedIcon.Source><animatedvisuals:AnimatedGlobalNavigationButtonVisualSource /></AnimatedIcon.Source>
        <AnimatedIcon.FallbackIconSource><FontIconSource Glyph="&#xE700;" /></AnimatedIcon.FallbackIconSource>
      </AnimatedIcon>
    </Button>

    <ContentPresenter v-if="hasLeftHeader" x:Name="PART_LeftHeaderPresenter" Grid.Column="3" class="win-titlebar-left-header" HorizontalAlignment="{ThemeResource TitleBarLeftHeaderHorizontalAlignment}" VerticalAlignment="{ThemeResource TitleBarLeftHeaderVerticalAlignment}"><LeftHeaderOutlet /></ContentPresenter>

    <div Grid.Column="4" class="win-titlebar-left-header-padding" aria-hidden="true"></div>

    <Viewbox v-if="hasIcon" x:Name="PART_Icon" Grid.Column="5" class="win-titlebar-icon" MaxWidth="{ThemeResource TitleBarIconMaxWidth}" MaxHeight="{ThemeResource TitleBarIconMaxHeight}" Margin="{ThemeResource TitleBarIconMargin}" VerticalAlignment="Center">
      <IconElementOutlet />
    </Viewbox>

    <TextBlock
      v-if="showTitle"
      x:Name="PART_TitleText"
      Grid.Column="6"
      class="win-titlebar-title"
      Text="{x:Bind Title, Mode=OneWay}"
      Style="{StaticResource CaptionTextBlockStyle}"
      Margin="{ThemeResource TitleBarTitleMargin}" MinWidth="{ThemeResource TitleBarTitleMinWidth}"
      HorizontalAlignment="Left" VerticalAlignment="Center"
      TextTrimming="CharacterEllipsis"
      TextWrapping="NoWrap" />

    <TextBlock
      v-if="showSubtitle"
      x:Name="PART_SubtitleText"
      Grid.Column="7"
      class="win-titlebar-subtitle"
      Text="{x:Bind Subtitle, Mode=OneWay}"
      Style="{StaticResource CaptionTextBlockStyle}"
      Foreground="{ThemeResource TitleBarSubtitleForegroundBrush}" Margin="{ThemeResource TitleBarSubtitleMargin}" MinWidth="{ThemeResource TitleBarSubtitleMinWidth}"
      HorizontalAlignment="Left" VerticalAlignment="Center"
      TextTrimming="CharacterEllipsis"
      TextWrapping="NoWrap" />

    <Grid
      v-if="hasContent"
      x:Name="PART_ContentPresenterGrid"
      Grid.Column="8"
      :ref="registerContentArea"
      class="win-titlebar-content"
      :class="{ 'is-compact': isCompact }">
      <ContentPresenter x:Name="PART_ContentPresenter" class="win-titlebar-content-presenter"
        HorizontalAlignment="{x:Bind ContentAlignment, Mode=OneWay}" VerticalAlignment="{x:Bind ContentVerticalAlignment, Mode=OneWay}"
        Margin="{x:Bind ContentMargin, Mode=OneWay}"><ContentOutlet /></ContentPresenter>
    </Grid>

    <ContentPresenter v-if="hasRightHeader" x:Name="PART_RightHeaderPresenter" Grid.Column="9" class="win-titlebar-right-header" HorizontalAlignment="{ThemeResource TitleBarRightHeaderHorizontalAlignment}" VerticalAlignment="{ThemeResource TitleBarRightHeaderVerticalAlignment}" :Margin="hasContent ? (FlowDirection === 'RightToLeft' ? '0,0,16,0' : '16,0,0,0') : 0"><RightHeaderOutlet /></ContentPresenter>

    <div Grid.Column="10" class="win-titlebar-min-drag-region" aria-hidden="true"></div>
    <!-- Caption buttons can escape a fixed/stacked application header when the
         owning window opens a modal dialog. Nested Gallery examples keep them
         in the card so its rounded clipping remains effective. -->
    <Teleport to="body" :disabled="!captionButtonsPortaled">
      <div v-if="captionControlsVisible" class="win-titlebar-caption-host" :class="{ 'is-portal': captionButtonsPortaled, 'is-deactivated': isDeactivated }" :style="captionButtonHostStyle">
        <div ref="minimizeCaptionButton" class="win-titlebar-caption-button win-titlebar-caption-button-minimize" data-titlebar-caption-button="minimize" role="button" tabindex="-1" :aria-label="captionLabels.minimize" :aria-disabled="captionActionInFlight !== null" :data-state="captionButtonState('minimize')" @click.stop="activateCaptionButton('minimize')" @keydown.enter.prevent="activateCaptionButton('minimize')" @keydown.space.prevent @keyup.space.prevent="activateCaptionButton('minimize')" @pointerenter="setCaptionButtonPointer('minimize', 'pointerOver', $event)" @pointerleave="setCaptionButtonPointer('minimize', 'normal', $event)" @pointerdown="setCaptionButtonPointer('minimize', 'pressed', $event)" @pointerup="setCaptionButtonPointer('minimize', 'pointerOver', $event)" @pointercancel="setCaptionButtonPointer('minimize', 'normal', $event)">
          <FontIcon class="win-titlebar-caption-glyph" Glyph="&#xE921;" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="10" IsTextScaleFactorEnabled="False" HorizontalAlignment="Center" VerticalAlignment="Center" aria-hidden="true" />
        </div>
        <div ref="maximizeCaptionButton" class="win-titlebar-caption-button win-titlebar-caption-button-maximize" data-titlebar-caption-button="maximize" role="button" tabindex="-1" :aria-label="captionLabels.maximize" :aria-pressed="windowIsMaximized" :aria-disabled="captionActionInFlight !== null" :data-state="captionButtonState('maximize')" @click.stop="activateCaptionButton('maximize')" @keydown.enter.prevent="activateCaptionButton('maximize')" @keydown.space.prevent @keyup.space.prevent="activateCaptionButton('maximize')" @pointerenter="setCaptionButtonPointer('maximize', 'pointerOver', $event)" @pointerleave="setCaptionButtonPointer('maximize', 'normal', $event)" @pointerdown="setCaptionButtonPointer('maximize', 'pressed', $event)" @pointerup="setCaptionButtonPointer('maximize', 'pointerOver', $event)" @pointercancel="setCaptionButtonPointer('maximize', 'normal', $event)">
          <FontIcon v-if="!windowIsMaximized" class="win-titlebar-caption-glyph" Glyph="&#xE922;" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="10" IsTextScaleFactorEnabled="False" HorizontalAlignment="Center" VerticalAlignment="Center" aria-hidden="true" />
          <FontIcon v-else class="win-titlebar-caption-glyph" Glyph="&#xE923;" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="10" IsTextScaleFactorEnabled="False" HorizontalAlignment="Center" VerticalAlignment="Center" aria-hidden="true" />
        </div>
        <div ref="closeCaptionButton" class="win-titlebar-caption-button win-titlebar-caption-button-close" data-titlebar-caption-button="close" role="button" tabindex="-1" :aria-label="captionLabels.close" :aria-disabled="captionActionInFlight !== null" :data-state="captionButtonState('close')" @click.stop="activateCaptionButton('close')" @keydown.enter.prevent="activateCaptionButton('close')" @keydown.space.prevent @keyup.space.prevent="activateCaptionButton('close')" @pointerenter="setCaptionButtonPointer('close', 'pointerOver', $event)" @pointerleave="setCaptionButtonPointer('close', 'normal', $event)" @pointerdown="setCaptionButtonPointer('close', 'pressed', $event)" @pointerup="setCaptionButtonPointer('close', 'pointerOver', $event)" @pointercancel="setCaptionButtonPointer('close', 'normal', $event)">
          <FontIcon class="win-titlebar-caption-glyph" Glyph="&#xE8BB;" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="10" IsTextScaleFactorEnabled="False" HorizontalAlignment="Center" VerticalAlignment="Center" aria-hidden="true" />
        </div>
      </div>
    </Teleport>
    <div v-if="captionControlsVisible" Grid.Column="14" class="win-titlebar-right-padding" aria-hidden="true"></div>
    <div v-else Grid.Column="11" class="win-titlebar-right-padding" aria-hidden="true"></div>
    <ToolTip v-if="captionControlsVisible" :IsOpen="tooltipButton === 'minimize'" :PlacementTarget="minimizeCaptionButton" Placement="Bottom" :Content="captionLabels.minimize" />
    <ToolTip v-if="captionControlsVisible" :IsOpen="tooltipButton === 'maximize'" :PlacementTarget="maximizeCaptionButton" Placement="Bottom" :Content="captionLabels.maximize" />
    <ToolTip v-if="captionControlsVisible" :IsOpen="tooltipButton === 'close'" :PlacementTarget="closeCaptionButton" Placement="Bottom" :Content="captionLabels.close" />
  </Grid>
</template>

<script lang="ts">
import { TitleBarIconSource, TitleBarLeftHeader, TitleBarContent, TitleBarRightHeader, TitleBarResources } from './TitleBarProperties'
import { getIsDragRegion, setIsDragRegion, IsDragRegionProperty } from './TitleBarDragRegion'
import { animatedIconVisualSourceComponents } from './animatedIconVisuals'
export default { components: { 'animatedvisuals:AnimatedBackVisualSource': animatedIconVisualSourceComponents.AnimatedBackVisualSource, 'animatedvisuals:AnimatedGlobalNavigationButtonVisualSource': animatedIconVisualSourceComponents.AnimatedGlobalNavigationButtonVisualSource }, IconSource: TitleBarIconSource, LeftHeader: TitleBarLeftHeader, Content: TitleBarContent, RightHeader: TitleBarRightHeader, Resources: TitleBarResources, GetIsDragRegion: getIsDragRegion, SetIsDragRegion: setIsDragRegion, IsDragRegionProperty }
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, proxyRefs, ref, shallowRef, Text, useAttrs, useSlots, watch, type ComponentPublicInstance, type CSSProperties, type PropType, type VNode } from 'vue';
import Grid from './Grid.vue';
import Button from './Button.vue';
import ColumnDefinition from './ColumnDefinition.vue';
import ContentPresenter from './ContentPresenter.vue';
import Viewbox from './Viewbox.vue';
import IconSourceElement from './IconSourceElement.vue';
import { primitiveResourceScope, xamlPrimitiveResourceKey } from './xamlPrimitives';
import { titleBarResources, titleBarBrushAliases, titleBarHighContrastBrushAliases } from './titleBarResources';
import { uiSettings } from './uiSettings';
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import TextBlock from './TextBlock.vue';
import AnimatedIcon from './AnimatedIcon.vue';
import FontIcon from './FontIcon.vue';
import { FontIconSource } from './IconSource';
import { useI18n } from './i18n/index';
import { findTitleBarInteractableElements } from './TitleBarDragRegion';
import { connectTitleBarWindowHost, createFrameworkTitleBarWindowHost, getTitleBarHostPadding, titleBarHostAdapterKey, type TitleBarCaptionButton, type TitleBarCaptionButtonState, type TitleBarCaptionButtonsFramework, type TitleBarHostAdapter, type TitleBarInsets, type TitleBarRegion, type TitleBarWindowHost } from './titleBarHostAdapter';

defineOptions({ inheritAttrs: false });
const { t } = useI18n();
const slots = useSlots();
const hostAdapter = inject<TitleBarHostAdapter | null>(titleBarHostAdapterKey, null);
const forcedHighContrast = ref(false);
const highContrast = computed(() => forcedHighContrast.value || uiSettings.IsHighContrast);
const brushAliases = computed(() => highContrast.value ? titleBarHighContrastBrushAliases : titleBarBrushAliases);
const highContrastColors: Record<string, string> = { SystemControlForegroundBaseHighBrush: 'CanvasText', SystemControlHighlightAltBaseHighBrush: 'HighlightText', SystemControlDisabledBaseMediumLowBrush: 'GrayText', SystemControlBackgroundBaseLowBrush: 'Canvas', SystemControlHighlightListLowBrush: 'Highlight', SystemControlHighlightListMediumBrush: 'Highlight' };

const xamlProps = defineProps({
  Title: { type: String, default: '' },
  Subtitle: { type: String, default: '' },
  IconSource: { type: [String, Object], default: null },
  IsBackButtonVisible: { type: [Boolean, String], default: false },
  IsBackButtonEnabled: { type: [Boolean, String], default: true },
  IsPaneToggleButtonVisible: { type: [Boolean, String], default: false },
  /** Used to keep the navigation toggle label aligned with NavigationView state. */
  IsPaneOpen: { type: [Boolean, String], default: true },
  /** Adds Web-rendered minimize, maximize/restore and close buttons. */
  IsCaptionButtonsVisible: { type: [Boolean, String], default: false },
  /** Optional built-in host bridge; read only while IsCaptionButtonsVisible is true. */
  CaptionButtonsFramework: { type: String, default: '' },
  LeftHeader: { type: null as unknown as PropType<unknown>, default: null }, Content: { type: null as unknown as PropType<unknown>, default: null }, RightHeader: { type: null as unknown as PropType<unknown>, default: null },
  IsEnabled: { type: [Boolean, String], default: true }, FlowDirection: { type: String, default: 'LeftToRight' }, Visibility: { type: String, default: 'Visible' },
  AutoRefreshDragRegions: { type: [Boolean, String], default: false },
  /** The control owns its Standard/Tall variant; hosts translate it to window geometry. */
  PreferredHeightOption: { type: String, default: 'Standard' },
  Background: { type: String, default: '' },
  Foreground: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const emit = defineEmits(['BackRequested', 'PaneToggleRequested', 'LayoutUpdated', 'CaptionButtonRequested', 'MinimizeRequested', 'MaximizeRequested', 'CloseRequested']);
const instance = getCurrentInstance(), attrs = useAttrs();
const overrides = shallowRef<Record<PropertyKey, unknown>>({});
const props = new Proxy(xamlProps, { get: (target, key) => resolveXamlValue(key in overrides.value ? overrides.value[key] : Reflect.get(target, key), instance) });
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => !['BackRequested', 'PaneToggleRequested', 'LayoutUpdated', 'CaptionButtonRequested', 'MinimizeRequested', 'MaximizeRequested', 'CloseRequested'].includes(name))));
const slotNodes = computed(() => flatten(slots.default?.() ?? []));
const children = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[] : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? [];
const flatten = (nodes: VNode[]): VNode[] => nodes.flatMap(node => node.type === Fragment ? flatten(children(node)) : node.type === Comment || node.type === Text && !String(node.children ?? '').trim() ? [] : [node]);
const property = (node: VNode) => (node.type as { __titleBarProperty?: string })?.__titleBarProperty;
const propertyNodes = (name: string) => slotNodes.value.filter(node => property(node) === name).flatMap(children);
const defaultContent = () => slotNodes.value.filter(node => !property(node));
const inheritedResources = inject(xamlPrimitiveResourceKey, null);
const localResources = primitiveResourceScope(() => slotNodes.value.filter(node => property(node) === 'Resources'), inheritedResources);
const resources = computed(() => ({ ...titleBarResources, ...localResources.value }));
provide(xamlPrimitiveResourceKey, resources);
const resource = (name: string) => {
  if (resources.value[name] !== undefined) return resources.value[name];
  const alias = brushAliases.value[name] ?? name;
  const value = resolveXamlValue(`{ThemeResource ${alias}}`, instance);
  return highContrast.value && value === `var(--${alias})` ? highContrastColors[alias] ?? value : value;
};
const IconSource = computed(() => props.IconSource);
const FlowDirection = computed(() => props.FlowDirection);
const IsEnabled = computed(() => props.IsEnabled !== false);
const hasProperty = (name: keyof typeof xamlProps) => name in overrides.value ? props[name] !== null : propertyNodes(name).length > 0 || props[name] !== null;
const hasIcon = computed(() => hasProperty('IconSource'));
const hasLeftHeader = computed(() => hasProperty('LeftHeader'));
const hasRightHeader = computed(() => hasProperty('RightHeader'));
const IconElementOutlet = defineComponent({ setup: () => () => h(IconSourceElement, { ref: iconElementRef, IconSource: props.IconSource }, {
  default: () => props.IconSource || 'IconSource' in overrides.value ? [] : normalizeXamlNodes(propertyNodes('IconSource'), instance)
}) });
const ElementOutlet = defineComponent({ props: { element: { type: Object, required: true } }, setup(value) {
  const host = ref<HTMLElement | null>(null);
  let element: HTMLElement | undefined, parent: Node | null = null, sibling: Node | null = null;
  const release = () => {
    if (element && element.parentNode === host.value) {
      if (parent) parent.insertBefore(element, sibling?.parentNode === parent ? sibling : null);
      else element.remove();
    }
    element = undefined; parent = sibling = null;
  };
  const adopt = () => {
    const next = value.element as HTMLElement;
    if (!host.value || next === element) return;
    release(); element = next; parent = next.parentNode; sibling = next.nextSibling;
    host.value.appendChild(next);
  };
  onMounted(adopt); watch(() => value.element, adopt, { flush: 'post' }); onBeforeUnmount(release);
  return () => h('span', { ref: host, style: { display: 'contents' } });
} });
const outlet = (name: 'LeftHeader' | 'RightHeader' | 'Content') => defineComponent({ setup: () => () => {
  const nodes = name in overrides.value ? [] : name === 'Content' ? propertyNodes('Content').length ? propertyNodes('Content') : defaultContent() : propertyNodes(name);
  if (nodes.length) return h(Fragment, normalizeXamlNodes(nodes.map(node => cloneVNode(node)), instance));
  const value = props[name];
  const candidate = value as { nodeType?: number; Element?: HTMLElement; $el?: HTMLElement } | null;
  const element = candidate?.nodeType === 1 ? candidate : candidate?.Element ?? candidate?.$el;
  if (element?.nodeType === 1) return h(ElementOutlet, { element });
  return isVNode(value) ? h(Fragment, normalizeXamlNodes([value], instance)) : typeof value === 'string' || typeof value === 'number' ? String(value) : null;
} });
const LeftHeaderOutlet = outlet('LeftHeader'), RightHeaderOutlet = outlet('RightHeader'), ContentOutlet = outlet('Content');
const HeaderInset = computed(() => {
  // When neither a leading icon nor a left header exists, there is no
  // presenter boundary to separate from the title. Keeping the 14px header
  // gap in that case creates a phantom block and consumes caption width.
  if (!hasIcon.value && !hasLeftHeader.value) return 0;
  return resource(IsBackButtonVisible.value !== IsPaneToggleButtonVisible.value ? 'TitleBarHeaderNegativeInsetPaddingWidth' : 'TitleBarLeftHeaderPaddingWidth');
});
const Title = computed(() => props.Title);
const Subtitle = computed(() => props.Subtitle);
const IsBackButtonVisible = computed(() => props.IsBackButtonVisible === true);
const IsBackButtonEnabled = computed(() => props.IsBackButtonEnabled === true);
const IsPaneToggleButtonVisible = computed(() => props.IsPaneToggleButtonVisible === true);
const IsCaptionButtonsVisible = computed(() => props.IsCaptionButtonsVisible === true
  || typeof props.IsCaptionButtonsVisible === 'string' && props.IsCaptionButtonsVisible.toLowerCase() === 'true');
const configuredCaptionButtonsFramework = computed<TitleBarCaptionButtonsFramework | null>(() => {
  // Short-circuit before reading the optional framework field when captions
  // are hidden, so unrelated host metadata never activates this adapter.
  if (!IsCaptionButtonsVisible.value) return null;
  const value = props.CaptionButtonsFramework;
  return value === 'Tauri' || value === 'Electron' ? value : null;
});
const IsPaneOpen = computed(() => props.IsPaneOpen !== false);
const BackButtonEnabled = computed(() => IsEnabled.value && IsBackButtonEnabled.value);
const BackLabel = computed(() => t('text.back'));
const PaneLabel = computed(() => t(IsPaneOpen.value ? 'text.close-navigation' : 'text.open-navigation'));
// Responsive mode collapses the title/subtitle, but it must not override the
// alignment explicitly chosen for Content. Gallery uses Stretch so its search
// field stays centered in the remaining title-bar lane at every width.
const ContentAlignment = computed(() => resource('TitleBarContentHorizontalAlignment'));
const ContentVerticalAlignment = computed(() => isCompact.value ? 'Stretch' : resource('TitleBarContentVerticalAlignment'));
const ContentMargin = computed(() => isCompact.value ? resource('TitleBarCompactContentMargin') : 0);
const requestBack = () => {
  if (!IsEnabled.value || !IsBackButtonEnabled.value || !IsBackButtonVisible.value) return;
  emit('BackRequested', publicApi, null);
  if (!instance?.vnode.props?.onBackRequested) resolveXamlHandler(attrs.BackRequested, instance)?.(publicApi, null);
};
const requestPaneToggle = () => {
  if (!IsEnabled.value || !IsPaneToggleButtonVisible.value) return;
  emit('PaneToggleRequested', publicApi, null);
  if (!instance?.vnode.props?.onPaneToggleRequested) resolveXamlHandler(attrs.PaneToggleRequested, instance)?.(publicApi, null);
};
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), Title, Subtitle, IconSource, HeaderInset, IsEnabled, IsPaneOpen, BackButtonEnabled, BackLabel, PaneLabel, ContentAlignment, ContentVerticalAlignment, ContentMargin, requestBack, requestPaneToggle });

type HostedElement = Element | ComponentPublicInstance | null;
const elementFromRef = (value: HostedElement): HTMLElement | null => {
  const unwrap = (candidate: unknown): HTMLElement | null => {
    if (candidate && typeof candidate === 'object' && (candidate as Node).nodeType === 1) return candidate as HTMLElement;
    if (!candidate || typeof candidate !== 'object') return null;
    const record = candidate as { Element?: unknown; $el?: unknown };
    return unwrap(record.Element) ?? unwrap(record.$el);
  };
  return unwrap(value);
};
const rootRef = ref<HTMLElement | null>(null);
const registerRoot = (value: HostedElement) => { rootRef.value = elementFromRef(value); };
const iconElementRef = ref<InstanceType<typeof IconSourceElement> | null>(null);
const contentAreaRef = ref<HTMLElement | null>(null);
const registerContentArea = (value: HostedElement) => { contentAreaRef.value = elementFromRef(value); };
const isDeactivated = ref(false);
const isCompact = ref(false);
const isNarrow = ref(false);
const captionPadding = ref<TitleBarInsets | null>(null);
const captionControlsVisible = IsCaptionButtonsVisible;
const nativeCaptionHitTestEnabled = ref(false);
const windowIsMaximized = ref(false);
const captionPointerState = ref<TitleBarCaptionButtonState>({ Button: null, State: 'normal' });
const nativeCaptionPointerState = ref<TitleBarCaptionButtonState>({ Button: null, State: 'normal' });
const captionActionInFlight = ref<TitleBarCaptionButton | null>(null);
const minimizeCaptionButton = ref<HTMLElement | null>(null);
const maximizeCaptionButton = ref<HTMLElement | null>(null);
const closeCaptionButton = ref<HTMLElement | null>(null);
const tooltipButton = ref<TitleBarCaptionButton | null>(null);
const captionButtonsPortaled = ref(false);
const captionButtonHostStyle = shallowRef<CSSProperties>({});
const effectiveCaptionPointerState = computed<TitleBarCaptionButtonState>(() =>
  captionPointerState.value.State !== 'normal' ? captionPointerState.value : nativeCaptionPointerState.value);
const hoveredCaptionButton = computed<TitleBarCaptionButton | null>(() => effectiveCaptionPointerState.value.State !== 'pointerOver'
  ? null : effectiveCaptionPointerState.value.Button);
const captionLabels = computed(() => ({
  minimize: t('text.minimize'),
  maximize: windowIsMaximized.value ? t('text.restore') : t('text.maximize'),
  close: t('text.close'),
}));
const updateCaptionButtonHost = () => {
  const root = rootRef.value;
  if (!captionButtonsPortaled.value || !root || !ownerWindow) return;
  const rect = root.getBoundingClientRect();
  const hostStyle: CSSProperties & Record<`--${string}`, string | number | undefined> = {
    left: `${rect.right - 138}px`, top: `${rect.top}px`, height: `${rect.height}px`
  };
  const computedStyle = ownerWindow.getComputedStyle(root);
  for (const name of [
    '--TitleBarCaptionButtonForeground', '--TitleBarCaptionButtonPressedForeground', '--TitleBarCaptionButtonInactiveForeground',
    '--SubtleFillColorSecondaryBrush', '--SubtleFillColorTertiaryBrush', '--subtle-secondary', '--subtle-tertiary'
  ] as const) {
    const value = computedStyle.getPropertyValue(name).trim();
    if (value) hostStyle[name] = value;
  }
  captionButtonHostStyle.value = hostStyle;
};
const dragRegionRevision = ref(0);

const NARROW_TITLEBAR_WIDTH = 480;
let defaultDocumentTitle = '';
let lastAppliedTitle = '';
let focusHandler: (() => void) | null = null;
let blurHandler: (() => void) | null = null;
let resizeObserver: ResizeObserver | null = null;
let contentObserver: MutationObserver | null = null;
let attachedPropertyObserver: MutationObserver | undefined;
let interactableElements: HTMLElement[] = [];
let observedIcon: Element | null = null;
let compactMeasureFrame = 0;
let compactModeThresholdWidth = 0;
let lastMeasuredWidth = -1;
let lastMeasuredContentAvailableWidth = -1;
let lastMeasuredContentDesiredWidth = -1;
let ownerWindow: (Window & typeof globalThis) | null = null;
let windowHost: TitleBarWindowHost | null = null;
let captionActionHost: TitleBarWindowHost | null = null;
let unsubscribeActivation: (() => void) | undefined;
let unsubscribeWindowState: (() => void) | undefined;
let unsubscribeCaptionState: (() => void) | undefined;
let unsubscribeCaptionAction: (() => void) | undefined;
let unsubscribeInsets: (() => void) | undefined;
let tooltipTimer: number | undefined;
let preferredHeightRevision = 0;
let captionHostRevision = 0;
let insetResizeHandler: (() => void) | undefined;
let contrastQuery: MediaQueryList | undefined;
const contrastChanged = () => { forcedHighContrast.value = Boolean(contrastQuery?.matches) };
let disposed = false;

const hasContent = computed(() => 'Content' in overrides.value ? props.Content !== null : propertyNodes('Content').length > 0 || defaultContent().length > 0 || props.Content !== null);
const hasExpandedHeight = computed(() => hasContent.value || hasLeftHeader.value || hasRightHeader.value);
const explicitHeight = computed<number | null>(() => {
  const value = props.Height;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const match = value.match(/^\s*(-?(?:\d+(?:\.\d*)?|\.\d+))(?:px)?\s*$/i);
    if (match) return Number(match[1]);
  }
  return null;
});
// The component selects the caption variant. A native host may read this from
// the exposed property or the root attribute when it configures its window.
const resolvedCaptionHeightOption = computed<'Standard' | 'Tall'>(() => explicitHeight.value === 32
  ? 'Standard' : explicitHeight.value === 46 ? 'Tall' : props.PreferredHeightOption === 'Tall' ? 'Tall' : 'Standard');
// Compact matches the official DisplayModeGroup: title and subtitle collapse.
// Keep the title nodes mounted while the display mode changes. Measuring a
// compact title bar clones the current DOM and removes its compact class; if
// these nodes were removed with v-if, the clone could never measure the
// expanded layout and the resize observer would continually flip modes.
const showTitle = computed(() => props.Title !== '');
const showSubtitle = computed(() => props.Subtitle !== '');
const isNegativeInsetSpacing = computed(() => props.IsBackButtonVisible !== props.IsPaneToggleButtonVisible);

const rootClasses = computed(() => {
  return ({
  'is-expanded-height': hasExpandedHeight.value,
  'is-compact-height': !hasExpandedHeight.value,
  'is-compact': isCompact.value,
  'is-deactivated': isDeactivated.value,
  'is-narrow': isNarrow.value,
  'has-caption-controls': captionControlsVisible.value,
  'is-negative-inset-spacing': isNegativeInsetSpacing.value
}); });

const cssLength = (value: unknown): string => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : String(value);
};

const xamlThickness = (value: unknown): string => {
  if (value === '' || value === undefined || value === null) return '';
  const parts = String(value).split(',').map((part) => cssLength(part.trim()));
  if (parts.length === 1) return parts[0] ?? '';
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const alignment = (value: string) => ({
  Left: 'start',
  Center: 'center',
  Right: 'end',
  Stretch: 'stretch'
} as Record<string, string>)[value] ?? 'center';

const verticalAlignment = (value: string) => ({
  Top: 'start',
  Center: 'center',
  Bottom: 'end',
  Stretch: 'stretch'
} as Record<string, string>)[value] ?? 'center';

const rootStyle = computed(() => {
  const style: CSSProperties & Record<`--${string}`, string | number | undefined> = {};
  for (const name of Object.keys(brushAliases.value)) style[`--${name}`] = resource(name) as string | number | undefined;
  style['--TitleBarCaptionButtonForeground'] = String(resource('TitleBarBackButtonForeground'));
  style['--TitleBarCaptionButtonPressedForeground'] = String(resource('TitleBarBackButtonForegroundPressed'));
  style['--TitleBarCaptionButtonInactiveForeground'] = String(resource('TitleBarDeactivatedForegroundBrush'));
  for (const name of ['TitleBarLeftPaddingWidth', 'TitleBarRightPaddingWidth', 'TitleBarMinDragRegionWidth', 'TitleBarBackButtonWidth', 'TitleBarPaneToggleButtonWidth']) {
    if (localResources.value[name] !== undefined) style[`--${name}`] = cssLength(localResources.value[name]);
  }
  if (captionPadding.value) {
    const { LeftInset, RightInset } = captionPadding.value;
    const rtl = props.FlowDirection === 'RightToLeft';
    style['--TitleBarLeftPaddingWidth'] = cssLength(rtl ? RightInset : LeftInset);
    style['--TitleBarRightPaddingWidth'] = cssLength(rtl ? LeftInset : RightInset);
    // When the host exposes window actions, this control lays out its own
    // caption buttons. Do not clip them by the host's old right inset.
    if (!captionControlsVisible.value) style.clipPath = `inset(0 ${RightInset}px 0 ${LeftInset}px)`;
  }
  style['--TitleBarLeftHeaderPaddingWidth'] = cssLength(HeaderInset.value);
  for (const name of ['TitleBarIconMaxWidth', 'TitleBarIconMaxHeight', 'TitleBarTitleMinWidth', 'TitleBarSubtitleMinWidth']) style[`--${name}`] = cssLength(resource(name));
  for (const name of ['TitleBarIconMargin', 'TitleBarTitleMargin', 'TitleBarSubtitleMargin', 'TitleBarCompactContentMargin']) style[`--${name}`] = xamlThickness(resource(name));
  style['--TitleBarDeactivatedOpacity'] = String(resource('TitleBarDeactivatedOpacity'));
  // The resource values include the native caption band's edges: Standard is
  // 32px and Tall is 46px. Content/header presence does not select the variant.
  style.height = cssLength(props.Height !== '' && props.Height !== undefined && props.Height !== null
    ? props.Height : resource(resolvedCaptionHeightOption.value === 'Tall' ? 'TitleBarExpandedHeight' : 'TitleBarCompactHeight'));
  style.gridTemplateColumns = captionControlsVisible.value
    ? 'var(--TitleBarLeftPaddingWidth, 2px) auto auto auto var(--TitleBarLeftHeaderPaddingWidth, 14px) auto auto auto minmax(0, 1fr) auto var(--TitleBarMinDragRegionWidth, 48px) 46px 46px 46px 0px'
    : 'var(--TitleBarLeftPaddingWidth, 2px) auto auto auto var(--TitleBarLeftHeaderPaddingWidth, 14px) auto auto auto minmax(0, 1fr) auto var(--TitleBarMinDragRegionWidth, 48px) var(--TitleBarRightPaddingWidth, 0px)';
  // Keep all caption contents and the draggable area in one full-height row.
  style.gridTemplateRows = 'minmax(0, 1fr)';
  if (captionControlsVisible.value) style['--TitleBarRightPaddingWidth'] = '0px';
  // The dir attribute handles content direction. The caption grid stays in
  // physical left-to-right order so the buttons remain at the right edge.
  if (props.FlowDirection === 'RightToLeft' && !captionControlsVisible.value) style.direction = 'rtl';
  if (props.Visibility === 'Collapsed') style.display = 'none';
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MinHeight !== '') style.minHeight = cssLength(props.MinHeight);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.MaxHeight !== '') style.maxHeight = cssLength(props.MaxHeight);
  if (props.Margin !== '') style.margin = xamlThickness(props.Margin);
  if (props.HorizontalAlignment !== '') style.justifySelf = alignment(props.HorizontalAlignment);
  if (props.VerticalAlignment !== '') style.alignSelf = verticalAlignment(props.VerticalAlignment);
  if (props.Background !== '') style.background = props.Background;
  if (props.Foreground !== '') {
    style.color = props.Foreground;
    style['--TitleBarForegroundBrush'] = props.Foreground;
  }
  return style;
});


const updateWindowTitle = () => {
  if (!windowHost || props.Title === '') return;
  if (windowHost.GetTitle() !== props.Title) {
    lastAppliedTitle = props.Title;
    windowHost.SetTitle(props.Title);
  }
};

const resetWindowTitle = () => {
  if (windowHost && lastAppliedTitle && windowHost.GetTitle() === lastAppliedTitle) {
    windowHost.SetTitle(defaultDocumentTitle);
  }
  lastAppliedTitle = '';
};

const updateCompactMode = () => {
  const root = rootRef.value;
  const content = contentAreaRef.value;
  if (!root || !content) return;

  const presenter = content.querySelector<HTMLElement>('.win-titlebar-content-presenter');
  const rootWidth = root.getBoundingClientRect().width;
  const previousCompact = isCompact.value;
  const previousNarrow = isNarrow.value;
  // 标题栏实际宽度过窄时标记 is-narrow（不依赖视口媒体查询），
  // 让 PWA overlay / WebView2 里标题栏区域比视口窄的情况也能隐藏搜索框、保住标题。
  isNarrow.value = rootWidth < NARROW_TITLEBAR_WIDTH;
  if (rootWidth <= 0) return;
  // WinUI compares the presenter's DesiredSize with the content column's
  // arranged width. In the DOM, scrollWidth exposes the desired width without
  // cloning the TitleBar and forcing a second synchronous layout on every
  // resize frame.
  const available = content.clientWidth;
  // The content grid is deliberately stretched to the TitleBar's available
  // width, so its own scrollWidth is normally equal to clientWidth even when
  // its child needs much less space. Compare the presenter itself, as WinUI
  // compares Content.DesiredSize with the arranged content column.
  const desired = presenter?.scrollWidth ?? content.scrollWidth;
  // SizeChanged is the primary trigger in the WinUI implementation, but the
  // web content can also resize in place (for example when a search field
  // changes its minimum width). Keep the same threshold state while allowing
  // those layout-only changes to be observed instead of returning solely on
  // the outer width.
  const measurementsChanged = rootWidth !== lastMeasuredWidth
    || Math.abs(available - lastMeasuredContentAvailableWidth) > 0.5
    || Math.abs(desired - lastMeasuredContentDesiredWidth) > 0.5;
  if (!measurementsChanged) return previousCompact !== isCompact.value || previousNarrow !== isNarrow.value;
  const widthChanged = lastMeasuredWidth < 0 || Math.abs(rootWidth - lastMeasuredWidth) > 0.5;
  lastMeasuredWidth = rootWidth;
  lastMeasuredContentAvailableWidth = available;
  lastMeasuredContentDesiredWidth = desired;
  // WinUI keeps the width where compact mode began as its exit threshold, so
  // small layout fluctuations at the boundary cannot switch modes repeatedly.
  // A stretched ContentPresenter reports scrollWidth === clientWidth even
  // when it has no overflow. Equality (or an initial zero-width arrange)
  // must not latch the TitleBar into Compact mode: the Gallery's centered
  // search field would otherwise stay left-aligned after the first layout.
  if (!compactModeThresholdWidth && available > 0 && desired > available + 1) {
    compactModeThresholdWidth = rootWidth;
    isCompact.value = true;
  // WinUI exits Compact when a later SizeChanged reports that the TitleBar
  // has grown back to the width where Compact began. Internal content/layout
  // changes at the same width must not immediately undo the state transition.
  } else if (isCompact.value && widthChanged && rootWidth >= compactModeThresholdWidth) {
    compactModeThresholdWidth = 0;
    isCompact.value = false;
  }
  return previousCompact !== isCompact.value || previousNarrow !== isNarrow.value;
};

const scheduleCompactModeUpdate = () => {
  if (disposed || compactMeasureFrame) return;
  const view = ownerWindow ?? window;
  compactMeasureFrame = view.requestAnimationFrame(() => {
    compactMeasureFrame = 0;
    if (disposed) return;
    const compactLayoutChanged = updateCompactMode();
    updateCaptionButtonHost();
    // Resizing changes the native drag rectangles, but not the set of
    // interactable elements. Re-scan the subtree only for DOM changes.
    updateDragRegions();
    if (compactLayoutChanged) notifyLayoutUpdated();
  });
};

const updatePadding = () => {
  const root = rootRef.value;
  if (!root || disposed) return;
  updateCaptionButtonHost();
  const rect = root.getBoundingClientRect();
  const insets = windowHost?.GetTitleBarInsets?.() ?? null;
  const next = getTitleBarHostPadding({ X: rect.x, Y: rect.y, Width: rect.width, Height: rect.height }, ownerWindow?.innerWidth ?? 0, insets);
  if (captionPadding.value?.LeftInset === next?.LeftInset && captionPadding.value?.RightInset === next?.RightInset) return;
  captionPadding.value = next;
  compactModeThresholdWidth = 0;
  lastMeasuredWidth = -1;
  lastMeasuredContentAvailableWidth = -1;
  lastMeasuredContentDesiredWidth = -1;
  isCompact.value = false;
  void nextTick(scheduleCompactModeUpdate);
};

const stopContentObserver = () => {
  if (contentObserver) {
    contentObserver.disconnect();
    contentObserver = null;
  }
};

const startContentObserver = () => {
  stopContentObserver();
  const content = contentAreaRef.value;
  if (!content) return;
  contentObserver = new (ownerWindow?.MutationObserver ?? MutationObserver)((records) => {
    if (props.AutoRefreshDragRegions && records.some(record => record.type === 'childList')) {
      recomputeDragRegions();
    }
  });
  contentObserver.observe(content, {
    childList: true,
    subtree: true,
    characterData: true
  });
};

const recomputeDragRegions = () => {
  const root = rootRef.value;
  if (!root) return;
  const elements = findTitleBarInteractableElements(root);
  interactableElements = elements;
  const interactive = new Set(elements);
  for (const element of root.querySelectorAll<HTMLElement>('[data-titlebar-passthrough]')) {
    if (!interactive.has(element)) element.removeAttribute('data-titlebar-passthrough');
  }
  for (const element of elements) {
    if (!element.hasAttribute('data-titlebar-passthrough')) element.setAttribute('data-titlebar-passthrough', '');
  }
  updateDragRegions();
  dragRegionRevision.value += 1;
};
const updateDragRegions = () => {
  // Ordinary browser/PWA title bars have no native drag-region bridge. Their
  // drag passthrough markers are maintained by recomputeDragRegions; avoid
  // measuring every interactive descendant on every resize frame.
  if (!windowHost?.SetDragRegions) return;
  const root = rootRef.value;
  if (!root) return;
  const bounds = root.getBoundingClientRect();
  const region = (element: Element): TitleBarRegion => {
    const rect = element.getBoundingClientRect();
    const left = Math.max(bounds.left + (captionPadding.value?.LeftInset ?? 0), rect.left), top = Math.max(bounds.top, rect.top);
    const rightInset = captionControlsVisible.value ? 0 : (captionPadding.value?.RightInset ?? 0);
    return { X: left, Y: top, Width: Math.max(0, Math.min(bounds.right - rightInset, rect.right) - left), Height: Math.max(0, Math.min(bounds.bottom, rect.bottom) - top) };
  };
  const icon = root.querySelector('.win-titlebar-icon');
  if (resizeObserver && observedIcon !== icon) {
    if (observedIcon) resizeObserver.unobserve(observedIcon);
    if (icon) resizeObserver.observe(icon);
    observedIcon = icon;
  }
  const captionButtons = captionControlsVisible.value ? {
    ...(minimizeCaptionButton.value ? { minimize: region(minimizeCaptionButton.value) } : {}),
    ...(maximizeCaptionButton.value ? { maximize: region(maximizeCaptionButton.value) } : {}),
    ...(closeCaptionButton.value ? { close: region(closeCaptionButton.value) } : {}),
  } : undefined;
  windowHost?.SetDragRegions?.({
    Caption: region(root),
    Passthrough: interactableElements.filter(element => element.isConnected).map(region).filter(rect => rect.Width > 0 && rect.Height > 0),
    Icon: icon ? region(icon) : null,
    CaptionButtons: captionButtons,
  });
};
const notifyLayoutUpdated = () => {
  if (disposed) return;
  emit('LayoutUpdated', publicApi, null);
  if (!instance?.vnode.props?.onLayoutUpdated) resolveXamlHandler(attrs.LayoutUpdated, instance)?.(publicApi, null);
};

const onFocus = () => {
  isDeactivated.value = false;
  updateDragRegions();
};

const onBlur = () => {
  isDeactivated.value = true;
  updateDragRegions();
};

const captionButtonState = (button: TitleBarCaptionButton) => effectiveCaptionPointerState.value.Button === button
  ? effectiveCaptionPointerState.value.State : 'normal';
const setCaptionButtonPointer = (button: TitleBarCaptionButton, state: 'normal' | 'pointerOver' | 'pressed', event?: PointerEvent) => {
  if (event?.pointerType === 'touch') {
    if (state === 'pressed') captionPointerState.value = { Button: button, State: 'pressed' };
    else if (captionPointerState.value.Button === button) captionPointerState.value = { Button: null, State: 'normal' };
    return;
  }
  if (state !== 'normal') captionPointerState.value = { Button: button, State: state };
  else if (captionPointerState.value.Button === button) captionPointerState.value = { Button: null, State: 'normal' };
};
const refreshWindowMaximized = async () => {
  if (!captionActionHost?.IsMaximized) return;
  try { windowIsMaximized.value = await captionActionHost.IsMaximized(); }
  catch (error) { ownerWindow?.console.error('Unable to read window maximize state:', error); }
};
const syncCaptionActionHost = () => {
  const revision = ++captionHostRevision;
  unsubscribeWindowState?.(); unsubscribeWindowState = undefined;
  unsubscribeCaptionState?.(); unsubscribeCaptionState = undefined;
  unsubscribeCaptionAction?.(); unsubscribeCaptionAction = undefined;
  const previousHost = captionActionHost;
  const framework = configuredCaptionButtonsFramework.value;
  const nextHost = IsCaptionButtonsVisible.value && framework && ownerWindow
    ? createFrameworkTitleBarWindowHost(ownerWindow, framework, windowHost)
    : null;
  captionActionHost = nextHost;
  nativeCaptionPointerState.value = { Button: null, State: 'normal' };
  nativeCaptionHitTestEnabled.value = false;
  if (previousHost?.SetCaptionButtonHitTestMode && previousHost !== nextHost) {
    void Promise.resolve(previousHost.SetCaptionButtonHitTestMode('Web')).catch(error => ownerWindow?.console.error('Unable to clear title bar Snap Layout hit testing:', error));
  }
  if (!nextHost) return;

  void refreshWindowMaximized();
  if (nextHost.SubscribeStateChanged) {
    void Promise.resolve(nextHost.SubscribeStateChanged(() => { void refreshWindowMaximized(); })).then(stop => {
      if (disposed || revision !== captionHostRevision) stop(); else unsubscribeWindowState = stop;
    }).catch(error => ownerWindow?.console.error('Unable to watch caption button state:', error));
  }
  if (nextHost.SubscribeCaptionButtonState) {
    void Promise.resolve(nextHost.SubscribeCaptionButtonState(state => {
      if (disposed || revision !== captionHostRevision) return;
      captionPointerState.value = { Button: null, State: 'normal' };
      nativeCaptionPointerState.value = state;
    })).then(stop => {
      if (disposed || revision !== captionHostRevision) stop(); else unsubscribeCaptionState = stop;
    }).catch(error => ownerWindow?.console.error('Unable to watch native caption pointer state:', error));
  }
  if (nextHost.SubscribeCaptionButtonAction) {
    void Promise.resolve(nextHost.SubscribeCaptionButtonAction(button => {
      if (!disposed && revision === captionHostRevision) void activateCaptionButton(button);
    })).then(stop => {
      if (disposed || revision !== captionHostRevision) stop(); else unsubscribeCaptionAction = stop;
    }).catch(error => ownerWindow?.console.error('Unable to watch native caption actions:', error));
  }
  if (nextHost.SetCaptionButtonHitTestMode) {
    const nativeSnapEnabled = Boolean(nextHost.SubscribeCaptionButtonAction);
    void Promise.resolve(nextHost.SetCaptionButtonHitTestMode(nativeSnapEnabled ? 'NativeSnap' : 'Web')).then(() => {
      if (!disposed && revision === captionHostRevision) nativeCaptionHitTestEnabled.value = nativeSnapEnabled;
    }).catch(error => ownerWindow?.console.error('Unable to enable title bar Snap Layout hit testing:', error));
  }
};
let preferredHeightTask: Promise<void> = Promise.resolve();
const syncPreferredHeightOption = () => {
  const host = windowHost;
  if (!host?.SetPreferredHeightOption) return;
  const option = resolvedCaptionHeightOption.value;
  const revision = ++preferredHeightRevision;
  preferredHeightTask = preferredHeightTask.catch(() => undefined).then(async () => {
    if (disposed || revision !== preferredHeightRevision) return;
    await host.SetPreferredHeightOption?.(option);
  }).catch(error => ownerWindow?.console.error('Unable to set title bar height:', error));
};
const activateCaptionButton = async (button: TitleBarCaptionButton) => {
  if (!captionControlsVisible.value || captionActionInFlight.value) return;
  captionActionInFlight.value = button;
  tooltipButton.value = null;
  try {
    if (button === 'minimize') {
      if (captionActionHost?.Minimize) await captionActionHost.Minimize();
      else {
        emit('MinimizeRequested', publicApi, null);
        if (!instance?.vnode.props?.onMinimizeRequested) resolveXamlHandler(attrs.MinimizeRequested, instance)?.(publicApi, null);
      }
    } else if (button === 'maximize') {
      if (captionActionHost?.ToggleMaximize) await captionActionHost.ToggleMaximize();
      else {
        emit('MaximizeRequested', publicApi, null);
        if (!instance?.vnode.props?.onMaximizeRequested) resolveXamlHandler(attrs.MaximizeRequested, instance)?.(publicApi, null);
      }
      await refreshWindowMaximized();
    } else {
      if (captionActionHost?.Close) await captionActionHost.Close();
      else {
        emit('CloseRequested', publicApi, null);
        if (!instance?.vnode.props?.onCloseRequested) resolveXamlHandler(attrs.CloseRequested, instance)?.(publicApi, null);
      }
    }
    if (!captionActionHost) {
      emit('CaptionButtonRequested', button, publicApi, null);
      if (!instance?.vnode.props?.onCaptionButtonRequested) resolveXamlHandler(attrs.CaptionButtonRequested, instance)?.(button, publicApi, null);
    }
  } catch (error) {
    ownerWindow?.console.error(`Unable to ${button} the window:`, error);
  } finally {
    captionActionInFlight.value = null;
  }
};

watch(hoveredCaptionButton, button => {
  if (tooltipTimer !== undefined) ownerWindow?.clearTimeout(tooltipTimer);
  tooltipTimer = undefined;
  tooltipButton.value = null;
  if (button) tooltipTimer = (ownerWindow ?? window).setTimeout(() => {
    tooltipButton.value = hoveredCaptionButton.value === button ? button : null;
    tooltipTimer = undefined;
  }, 600);
});

onMounted(async () => {
  if (!rootRef.value) return;
  ownerWindow = rootRef.value.ownerDocument.defaultView ?? window;
  contrastQuery = ownerWindow.matchMedia?.('(forced-colors: active)');
  contrastChanged();
  contrastQuery?.addEventListener('change', contrastChanged);
  const connectedHost = connectTitleBarWindowHost(rootRef.value, hostAdapter);
  windowHost = connectedHost;
  captionButtonsPortaled.value = Boolean(windowHost && captionControlsVisible.value);
  updateCaptionButtonHost();
  syncPreferredHeightOption();
  syncCaptionActionHost();
  updatePadding();
  unsubscribeInsets = windowHost?.SubscribeTitleBarInsets?.(updatePadding);
  if (windowHost?.GetTitleBarInsets && !unsubscribeInsets) {
    insetResizeHandler = updatePadding;
    ownerWindow.addEventListener('resize', insetResizeHandler);
  }
  isDeactivated.value = !(windowHost?.IsInputActive?.() ?? rootRef.value.ownerDocument.hasFocus());
  defaultDocumentTitle = windowHost?.GetTitle() ?? '';
  updateWindowTitle();
  unsubscribeActivation = windowHost?.SubscribeActivation?.(active => { if (active) onFocus(); else onBlur(); });
  if (!unsubscribeActivation) {
    focusHandler = onFocus; blurHandler = onBlur;
    ownerWindow.addEventListener('focus', focusHandler);
    ownerWindow.addEventListener('blur', blurHandler);
  }
  rootRef.value.addEventListener('winui-titlebar-drag-region-changed', recomputeDragRegions);
  attachedPropertyObserver = new ownerWindow.MutationObserver(recomputeDragRegions);
  attachedPropertyObserver.observe(rootRef.value, { attributes: true, subtree: true, attributeFilter: ['titlebar.isdragregion'] });

  await nextTick();
  if (disposed) return;
  updateCompactMode();
  recomputeDragRegions();
  notifyLayoutUpdated();
  if (contentAreaRef.value) startContentObserver();

  if (ownerWindow?.ResizeObserver) {
    resizeObserver = new ownerWindow.ResizeObserver(scheduleCompactModeUpdate);
    if (rootRef.value) resizeObserver.observe(rootRef.value);
    updateDragRegions();
  }
});

watch([IsCaptionButtonsVisible, configuredCaptionButtonsFramework], () => {
  if (!ownerWindow || !windowHost) return;
  syncCaptionActionHost();
  void nextTick(recomputeDragRegions);
}, { flush: 'post' });

onBeforeUnmount(() => {
  disposed = true;
  if (tooltipTimer !== undefined) ownerWindow?.clearTimeout(tooltipTimer);
  if (focusHandler) ownerWindow?.removeEventListener('focus', focusHandler);
  if (blurHandler) ownerWindow?.removeEventListener('blur', blurHandler);
  if (resizeObserver) resizeObserver.disconnect();
  unsubscribeActivation?.();
  unsubscribeWindowState?.();
  unsubscribeCaptionState?.();
  unsubscribeCaptionAction?.();
  unsubscribeInsets?.();
  if (insetResizeHandler) ownerWindow?.removeEventListener('resize', insetResizeHandler);
  contrastQuery?.removeEventListener('change', contrastChanged);
  attachedPropertyObserver?.disconnect();
  rootRef.value?.removeEventListener('winui-titlebar-drag-region-changed', recomputeDragRegions);
  windowHost?.ClearDragRegions?.();
  captionHostRevision += 1;
  if (captionControlsVisible.value && captionActionHost?.SetCaptionButtonHitTestMode) void Promise.resolve(captionActionHost.SetCaptionButtonHitTestMode('Web'))
    .catch(error => ownerWindow?.console.error('Unable to clear title bar Snap Layout hit testing:', error));
  nativeCaptionHitTestEnabled.value = false;
  preferredHeightRevision += 1;
  ownerWindow?.cancelAnimationFrame(compactMeasureFrame);
  stopContentObserver();
  resetWindowTitle();
});

watch(() => props.Title, (newTitle, oldTitle) => {
  if (oldTitle !== '' && newTitle === '') {
    resetWindowTitle();
  } else {
    updateWindowTitle();
  }
});


watch(() => props.AutoRefreshDragRegions, (autoRefresh) => {
  if (contentAreaRef.value) startContentObserver();
  if (autoRefresh) recomputeDragRegions();
});

watch(hasContent, (has) => {
  if (has) {
    lastMeasuredWidth = -1;
    lastMeasuredContentAvailableWidth = -1;
    lastMeasuredContentDesiredWidth = -1;
    void nextTick(() => {
      updateCompactMode();
      startContentObserver();
    });
  } else {
    stopContentObserver();
    compactModeThresholdWidth = 0;
    lastMeasuredWidth = -1;
    lastMeasuredContentAvailableWidth = -1;
    lastMeasuredContentDesiredWidth = -1;
    isCompact.value = false;
  }
});
// Content controls can become visible when the measured title-bar region
// collapses (for example the Gallery's compact search button). Rebuild the
// native drag passthrough regions after that visibility change so the newly
// visible control remains clickable inside an app-region: drag surface.
watch(isCompact, () => { void nextTick(recomputeDragRegions); }, { flush: 'post' });
watch([Title, Subtitle, IsBackButtonVisible, IsBackButtonEnabled, IsPaneToggleButtonVisible, hasLeftHeader, hasRightHeader, hasIcon], () => {
  void nextTick(() => {
    scheduleCompactModeUpdate();
    recomputeDragRegions();
  });
}, { flush: 'post' });
watch(() => props.FlowDirection, () => { void nextTick(scheduleCompactModeUpdate); });
watch(resolvedCaptionHeightOption, () => { syncPreferredHeightOption(); void nextTick(scheduleCompactModeUpdate); });

const dependencyProperty = (name: keyof typeof xamlProps) => computed({ get: () => name in overrides.value || props[name] !== null ? props[name] : name === 'IconSource' ? iconElementRef.value?.IconSource ?? null : propertyNodes(name)[0] ?? props[name], set: value => { overrides.value = { ...overrides.value, [name]: value }; updateXamlBinding(xamlProps[name], value, instance); } });
for (const name of Object.keys(xamlProps) as (keyof typeof xamlProps)[]) watch(() => resolveXamlValue(xamlProps[name], instance), () => { if (name in overrides.value) { const next = { ...overrides.value }; delete next[name]; overrides.value = next; } });
const publicApi = proxyRefs({
  Element: rootRef,
  isCompact,
  isNarrow,
  ...Object.fromEntries((['Title', 'Subtitle', 'IconSource', 'LeftHeader', 'Content', 'RightHeader', 'IsBackButtonVisible', 'IsBackButtonEnabled', 'IsPaneToggleButtonVisible', 'IsPaneOpen', 'IsCaptionButtonsVisible', 'CaptionButtonsFramework', 'AutoRefreshDragRegions', 'PreferredHeightOption', 'FlowDirection'] as const).map(name => [name, dependencyProperty(name)])),
  ResolvedHeightOption: resolvedCaptionHeightOption,
  TemplateSettings: computed(() => ({ IconElement: hasIcon.value ? iconElementRef.value : null })),
  RecomputeDragRegions: recomputeDragRegions
});
defineExpose(publicApi);
</script>

<style scoped>
  .win-titlebar {
    --TitleBarCompactHeight: 32px;
    --TitleBarExpandedHeight: 46px;
    --TitleBarBackButtonWidth: 40px;
    --TitleBarPaneToggleButtonWidth: 40px;
    --TitleBarLeftPaddingWidth: 2px;
    --TitleBarRightPaddingWidth: 0px;
    --TitleBarLeftHeaderPaddingWidth: 14px;
    --TitleBarHeaderNegativeInsetPaddingWidth: 2px;
    --TitleBarMinDragRegionWidth: 48px;
    --TitleBarDeactivatedOpacity: 0.5;
    --TitleBarCaptionButtonForeground: var(--TextFillColorPrimaryBrush, var(--text-primary, #191919));
    --TitleBarCaptionButtonPressedForeground: var(--TextFillColorSecondaryBrush, var(--text-secondary, #606060));
    --TitleBarCaptionButtonInactiveForeground: var(--TextFillColorTertiaryBrush, var(--text-tertiary, #9b9b9b));
    --TitleBarCompactContentMargin: 0 16px 0 0;
    --TitleBarIconMaxWidth: 16px;
    --TitleBarIconMaxHeight: 16px;
    --TitleBarIconMargin: 0 16px 0 0;
    --TitleBarTitleMargin: 0 8px 0 0;
    --TitleBarSubtitleMargin: 0 16px 0 0;
    --TitleBarForegroundBrush: var(--text-primary);
    --TitleBarDeactivatedForegroundBrush: var(--text-tertiary);
    --TitleBarSubtitleForegroundBrush: var(--text-secondary);
    --TitleBarSubtitleDeactivatedForegroundBrush: var(--text-tertiary);
    --TitleBarBackButtonBackground: transparent;
    --TitleBarBackButtonBackgroundPointerOver: var(--subtle-secondary);
    --TitleBarBackButtonBackgroundPressed: var(--subtle-tertiary);
    --TitleBarBackButtonForegroundDisabled: var(--text-disabled);
    --TitleBarPaneToggleButtonBackground: transparent;
    --TitleBarPaneToggleButtonBackgroundPointerOver: var(--subtle-secondary);
    --TitleBarPaneToggleButtonBackgroundPressed: var(--subtle-tertiary);

    position: relative;
    width: 100%;
    height: var(--TitleBarExpandedHeight);
    box-sizing: border-box;
    display: grid;
    grid-template-columns:
      var(--TitleBarLeftPaddingWidth)
      auto
      auto
      auto
      var(--TitleBarLeftHeaderPaddingWidth)
      auto
      auto
      auto
      1fr
      auto
      var(--TitleBarMinDragRegionWidth)
      var(--TitleBarRightPaddingWidth);
    /* Match the height of the caption controls and drag surface. */
    grid-template-rows: minmax(0, 1fr);
    align-items: stretch;
    overflow: hidden;
    background: transparent;
    color: var(--TitleBarForegroundBrush);
    font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
    user-select: none;
    app-region: drag;
    -webkit-app-region: drag;
  }

  .win-titlebar.is-compact-height {
    height: var(--TitleBarCompactHeight);
  }

  .win-titlebar.is-compact :deep(.win-titlebar-title),
  .win-titlebar.is-compact :deep(.win-titlebar-subtitle) {
    display: none;
  }

  .win-titlebar.is-negative-inset-spacing {
    --TitleBarLeftHeaderPaddingWidth: var(--TitleBarHeaderNegativeInsetPaddingWidth);
  }

  .win-titlebar-left-padding {
    grid-column: 1;
  }

  .win-titlebar :deep(.win-titlebar-back-button) {
    grid-column: 2;
  }

  .win-titlebar :deep(.win-titlebar-pane-toggle-button) {
    grid-column: 3;
  }

  .win-titlebar-left-header {
    grid-column: 4;
  }

  .win-titlebar-left-header-padding {
    grid-column: 5;
  }

  .win-titlebar-icon {
    forced-color-adjust: none;
    grid-column: 6;
  }

  .win-titlebar-title {
    grid-column: 7;
  }

  .win-titlebar-subtitle {
    grid-column: 8;
  }

  .win-titlebar-content {
    grid-column: 9;
  }

  .win-titlebar-right-header {
    grid-column: 10;
  }

  .win-titlebar-min-drag-region {
    grid-column: 11;
  }

  .win-titlebar-right-padding {
    grid-column: 12;
  }

  .win-titlebar.has-caption-controls {
    /* Caption controls stay on the physical right edge, including RTL. */
    direction: ltr;
  }

  .win-titlebar.has-caption-controls .win-titlebar-right-padding {
    grid-column: 15;
  }

  .win-titlebar-caption-button {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    width: 46px;
    height: 100%;
    min-width: 46px;
    min-height: 0;
    padding: 0;
    margin: 0;
    border: 0;
    border-radius: 0;
    outline-offset: -3px;
    appearance: none;
    color: var(--TitleBarCaptionButtonForeground, #191919);
    background: transparent;
    font: inherit;
    cursor: default;
    transition: color 83ms linear, background-color 83ms linear;
    user-select: none;
    touch-action: manipulation;
    pointer-events: auto;
    app-region: no-drag;
    -webkit-app-region: no-drag;
  }

  .win-titlebar-caption-host:not(.is-portal) { display: contents; }
  .win-titlebar-caption-host.is-portal {
    position: fixed;
    z-index: 2147483645;
    display: grid;
    grid-template-columns: 46px 46px 46px;
    grid-template-rows: minmax(0, 1fr);
    width: 138px;
    min-width: 138px;
    height: 46px;
    min-height: 0;
    pointer-events: none;
    direction: ltr;
  }

  .win-titlebar-caption-host.is-portal .win-titlebar-caption-button {
    width: 46px;
    min-width: 46px;
    pointer-events: auto;
  }

  .win-titlebar-caption-host.is-portal .win-titlebar-caption-button-minimize { grid-column: 1; }
  .win-titlebar-caption-host.is-portal .win-titlebar-caption-button-maximize { grid-column: 2; }
  .win-titlebar-caption-host.is-portal .win-titlebar-caption-button-close { grid-column: 3; }
  .win-titlebar-caption-host.is-deactivated .win-titlebar-caption-button {
    color: var(--TitleBarCaptionButtonInactiveForeground, #9b9b9b);
  }

  .win-titlebar-caption-button-minimize { grid-column: 12; }
  .win-titlebar-caption-button-maximize { grid-column: 13; }
  .win-titlebar-caption-button-close { grid-column: 14; }

  .win-titlebar-caption-glyph {
    display: inline-grid;
    place-items: center;
    width: 10px;
    height: 10px;
    min-width: 10px;
    min-height: 10px;
    justify-self: center;
    align-self: center;
    flex: none;
  }

  .win-titlebar-caption-button[data-state="pointerOver"] {
    background: var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary));
  }

  .win-titlebar-caption-button[data-state="pressed"] {
    color: var(--TitleBarCaptionButtonPressedForeground, #606060);
    background: var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary));
  }

  .win-titlebar-caption-button-close[data-state="pointerOver"] {
    color: #fff;
    background: #c42b1c;
  }

  .win-titlebar-caption-button-close[data-state="pressed"] {
    color: #fff;
    background: #a82216;
  }

  .win-titlebar.is-deactivated .win-titlebar-caption-button {
    color: var(--TitleBarCaptionButtonInactiveForeground, #9b9b9b);
  }

  .win-titlebar-caption-host.is-deactivated .win-titlebar-caption-button[data-state="pointerOver"],
  .win-titlebar.is-deactivated .win-titlebar-caption-button[data-state="pointerOver"] {
    color: var(--TitleBarCaptionButtonForeground, #191919);
  }

  .win-titlebar-caption-host.is-deactivated .win-titlebar-caption-button-close[data-state="pointerOver"],
  .win-titlebar.is-deactivated .win-titlebar-caption-button-close[data-state="pointerOver"] {
    color: #fff;
  }

  .win-titlebar-caption-button:focus-visible {
    outline: 1px solid currentColor;
    outline-offset: -3px;
  }

  @media (forced-colors: active) {
    .win-titlebar-caption-button,
    .win-titlebar.is-deactivated .win-titlebar-caption-button {
      color: CanvasText;
      forced-color-adjust: none;
    }
    .win-titlebar-caption-button[data-state="pointerOver"] { color: HighlightText; background: Highlight; }
    .win-titlebar-caption-button[data-state="pressed"] { color: HighlightText; background: Highlight; }
    .win-titlebar-caption-button-close[data-state="pointerOver"],
    .win-titlebar-caption-button-close[data-state="pressed"] { color: HighlightText; background: Highlight; }
    .win-titlebar-caption-host.is-deactivated .win-titlebar-caption-button[data-state="pointerOver"],
    .win-titlebar.is-deactivated .win-titlebar-caption-button[data-state="pointerOver"] { color: HighlightText; }
    .win-titlebar-caption-host.is-deactivated .win-titlebar-caption-button-close[data-state="pointerOver"],
    .win-titlebar.is-deactivated .win-titlebar-caption-button-close[data-state="pointerOver"] { color: HighlightText; }
  }

  .win-titlebar :deep(.win-titlebar-back-button),
  .win-titlebar :deep(.win-titlebar-pane-toggle-button) {
    box-sizing: border-box;
    width: var(--TitleBarBackButtonWidth);
    margin: 2px;
    padding: 0;
    border: 0;
    border-radius: var(--ControlCornerRadius, 4px);
    display: flex;
    align-self: stretch;
    height: calc(100% - 4px);
    min-height: 0;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--ButtonForegroundCurrent);
    background: transparent;
    cursor: default;
    font-family: var(--SymbolThemeFontFamily, 'WinUIOnWebIcons');
    font-size: 16px;
    transition: none;
  }

  .win-titlebar :deep(.win-titlebar-pane-toggle-button) {
    width: var(--TitleBarPaneToggleButtonWidth);
  }

  /* WinUI's inactive visual state changes the back and navigation button
     foregrounds independently from the icon. The Button template writes its
     state brushes on the button element, so mirror the visual-state setter
     with important custom-property overrides rather than dimming the whole
     title bar. Disabled buttons keep their own disabled-state resources. */
  .win-titlebar.is-deactivated :deep(.win-titlebar-back-button:not(:disabled)),
  .win-titlebar.is-deactivated :deep(.win-titlebar-pane-toggle-button:not(:disabled)) {
    --ButtonForeground: var(--TitleBarDeactivatedForegroundBrush) !important;
    --ButtonForegroundPointerOver: var(--TitleBarDeactivatedForegroundBrush) !important;
    --ButtonForegroundPressed: var(--TitleBarDeactivatedForegroundBrush) !important;
    color: var(--TitleBarDeactivatedForegroundBrush) !important;
  }

  .win-titlebar :deep(.win-titlebar-back-button .icon),
  .win-titlebar :deep(.win-titlebar-pane-toggle-button .icon) {
    width: 16px;
    height: 16px;
    font-size: 16px;
    line-height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }


  .win-titlebar-left-header,
  .win-titlebar-right-header {
    min-width: 0;
    min-height: 0;
    display: flex;
    align-items: center;
  }

  .win-titlebar.is-deactivated .win-titlebar-left-header,
  .win-titlebar.is-deactivated .win-titlebar-right-header,
  .win-titlebar.is-deactivated .win-titlebar-content {
    opacity: var(--TitleBarDeactivatedOpacity);
  }

  .win-titlebar-icon,
  .win-titlebar.is-deactivated .win-titlebar-icon {
    opacity: 1;
    filter: none;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    min-width: var(--TitleBarIconMaxWidth);
    min-height: var(--TitleBarIconMaxHeight);
    max-width: var(--TitleBarIconMaxWidth);
    max-height: var(--TitleBarIconMaxHeight);
    margin: var(--TitleBarIconMargin);
    overflow: hidden;
    flex-shrink: 0;
  }

  .win-titlebar-icon img,
  .win-titlebar-icon-glyph {
    max-width: 100%;
    max-height: 100%;
    display: block;
    font-size: 16px;
    line-height: 1;
  }

  .win-titlebar-icon-glyph {
    font-family: 'WinUIonWebIcons';
  }

  .win-titlebar :deep(.win-titlebar-title),
  .win-titlebar :deep(.win-titlebar-subtitle) {
    min-width: 0;
    max-width: 100%;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .win-titlebar :deep(.win-titlebar-title) {
    margin: var(--TitleBarTitleMargin);
    color: var(--TitleBarForegroundBrush);
  }

  .win-titlebar :deep(.win-titlebar-subtitle) {
    margin: var(--TitleBarSubtitleMargin);
    color: var(--TitleBarSubtitleForegroundBrush);
  }

  .win-titlebar.is-deactivated :deep(.win-titlebar-title) {
    color: var(--TitleBarDeactivatedForegroundBrush);
  }

  .win-titlebar.is-deactivated :deep(.win-titlebar-subtitle) {
    color: var(--TitleBarSubtitleDeactivatedForegroundBrush);
  }

  .win-titlebar-content {
    position: relative;
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    align-items: center;
    overflow: hidden;
  }

  .win-titlebar-content-presenter { min-width: 0; min-height: 0; max-width: 100%; overflow: hidden; }

  .win-titlebar-min-drag-region {
    min-width: var(--TitleBarMinDragRegionWidth);
  }

  .win-titlebar :deep([data-titlebar-passthrough]) {
    app-region: no-drag;
    -webkit-app-region: no-drag;
  }
</style>
