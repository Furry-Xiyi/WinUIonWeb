<template>
  <div
    ref="comboRef"
    v-bind="rootAttrs"
    class="win-combo-box win-theme-scope"
    :class="[attrs.class, themeClass, {
      'is-disabled': !resolvedIsEnabled,
      'is-drop-down-open': isOpen,
      'is-editable': resolvedIsEditable
    }]"
    :style="rootStyle"
    :aria-disabled="!resolvedIsEnabled"
    @keydown.capture="onInputKeyDown"
    @pointerdown.capture="onPointerDown"
    @pointerenter="AnimatedGlyphInput.PointerEntered"
    @pointerleave="AnimatedGlyphInput.PointerExited"
    @pointerdown="AnimatedGlyphInput.PointerPressed"
    @pointerup="AnimatedGlyphInput.PointerReleased"
    @pointercancel="AnimatedGlyphInput.PointerExited"
    @lostpointercapture="AnimatedGlyphInput.PointerReleased"
    @keydown="AnimatedGlyphInput.KeyDown"
    @keyup="AnimatedGlyphInput.KeyUp"
    @focusout="AnimatedGlyphInput.LostFocus">
    <ContentPresenter v-if="resolvedHeader" x:Name="HeaderContentPresenter" class="win-combo-header" Content="{x:Bind resolvedHeader, Mode=OneWay}" ContentTemplate="{x:Bind resolvedHeaderTemplate, Mode=OneWay}" Margin="{ThemeResource ComboBoxTopHeaderMargin}" Foreground="{ThemeResource ComboBoxHeaderForeground}" VerticalAlignment="Top" />

    <div v-if="resolvedIsEditable" ref="backgroundRef" class="win-combo-editable">
      <button
        v-if="!isEditing"
        class="win-combo-btn win-combo-edit-display"
        type="button"
        role="combobox"
        :aria-controls="listBoxId"
        :aria-expanded="isOpen"
        :aria-label="resolvedHeader || resolvedPlaceholderText"
        :disabled="!resolvedIsEnabled"
        :tabindex="resolvedIsTabStop ? undefined : -1"
        @click="beginEditing"
        @keydown="onEditableDisplayKeyDown">
        <span class="win-combo-background" aria-hidden="true" />
        <span class="win-combo-content" :class="{ 'is-placeholder': !currentText && currentSelectedItem === undefined }" :style="selectionBoxStyle">
          {{ editableDisplayLabel }}
        </span>
      </button>
      <TextBox
        v-else
        ref="inputRef"
        class="win-combo-textbox"
        role="combobox"
        :aria-controls="listBoxId"
        :aria-expanded="isOpen"
        :aria-label="resolvedHeader || resolvedPlaceholderText"
        x:Name="EditableText"
        IsEnabled="{x:Bind resolvedIsEnabled, Mode=OneWay}"
        Padding="{ThemeResource ComboBoxEditableTextPadding}"
        PlaceholderText="{x:Bind resolvedPlaceholderText, Mode=OneWay}"
        ShowDeleteButton="False"
        Text="{x:Bind currentText, Mode=TwoWay}"
        LostFocus="onEditableLostFocus"
        TextChanged="onEditableTextChanged" />
      <button
        class="win-combo-drop-down-button"
        type="button"
        tabindex="-1"
        :aria-label="t('text.select')"
        :disabled="!resolvedIsEnabled"
        @click="toggleEditableDropDown"
        @pointerdown.prevent>
      </button>
      <AnimatedIcon class="win-combo-chevron" x:Name="DropDownGlyph" Width="12" Height="12" Margin="0,0,14,0" HorizontalAlignment="Right" VerticalAlignment="Center" Foreground="{ThemeResource ComboBoxDropDownGlyphForeground}" IsHitTestVisible="False" AutomationProperties.AccessibilityView="Raw">
        <AnimatedIcon.Source><animatedvisuals:AnimatedChevronDownSmallVisualSource /></AnimatedIcon.Source>
        <AnimatedIcon.FallbackIconSource><FontIconSource Foreground="{ThemeResource ComboBoxDropDownGlyphForeground}" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="12" Glyph="&#xE70D;" /></AnimatedIcon.FallbackIconSource>
      </AnimatedIcon>
    </div>

    <button
      v-else
      ref="backgroundRef"
      class="win-combo-btn"
      type="button"
      role="combobox"
      :aria-controls="listBoxId"
      :aria-expanded="isOpen"
        :aria-label="resolvedHeader || resolvedPlaceholderText"
        :disabled="!resolvedIsEnabled"
      :tabindex="resolvedIsTabStop ? undefined : -1"
      @click="toggle"
      @keydown="onButtonKeyDown"
      @wheel="onPointerWheelChanged">
      <span class="win-combo-background" aria-hidden="true" />
      <ContentPresenter x:Name="ContentPresenter" class="win-combo-content" :class="{ 'is-placeholder': currentSelectedIndex < 0 && currentSelectedItem === undefined }" Margin="{x:Bind SelectionBoxPadding, Mode=OneWay}" Opacity="{x:Bind SelectionBoxOpacity, Mode=OneWay}" HorizontalAlignment="{x:Bind props.HorizontalContentAlignment, Mode=OneWay}" VerticalAlignment="{x:Bind props.VerticalContentAlignment, Mode=OneWay}">
        <SelectionBoxRenderer />
      </ContentPresenter>
      <span class="win-combo-focus-pill" aria-hidden="true" />
      <AnimatedIcon class="win-combo-chevron" x:Name="DropDownGlyph" Width="12" Height="12" Margin="0,0,14,0" HorizontalAlignment="Right" VerticalAlignment="Center" Foreground="{ThemeResource ComboBoxDropDownGlyphForeground}" IsHitTestVisible="False" AutomationProperties.AccessibilityView="Raw">
        <AnimatedIcon.Source><animatedvisuals:AnimatedChevronDownSmallVisualSource /></AnimatedIcon.Source>
        <AnimatedIcon.FallbackIconSource><FontIconSource Foreground="{ThemeResource ComboBoxDropDownGlyphForeground}" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="12" Glyph="&#xE70D;" /></AnimatedIcon.FallbackIconSource>
      </AnimatedIcon>
    </button>

    <ContentPresenter v-if="resolvedDescription" x:Name="DescriptionPresenter" class="win-combo-description" Content="{x:Bind resolvedDescription, Mode=OneWay}" />

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="win-combo-overlay"
        :class="[themeClass, { 'is-visible': isOverlayVisible }]"
        @contextmenu.prevent="close"
        @pointerdown="close">
      </div>
      <div
        v-if="popupVisible"
        :id="listBoxId"
        ref="flyoutRef"
        class="win-combo-flyout win-theme-scope"
        :class="[themeClass, {
          'is-positioned': flyoutReady,
          'is-closing': isClosing,
          'opens-up': openedUp,
          'touch-input': inputDeviceTypeUsedToOpen === 'Touch',
          'edge-square-top': resolvedIsEditable && !openedUp,
          'edge-square-bottom': resolvedIsEditable && openedUp
        }]"
        :style="[flyoutStyle, dropDownBackgroundStyle]"
        v-acrylic-brush="dropDownBackgroundStyle"
        v-theme-shadow="{ Translation: 32, Enabled: defaultShadowEnabled }"
        role="listbox"
        @keydown="onFlyoutKeyDown"
        @pointerdown.stop>
        <div
          class="win-combo-flyout-hit-root"
          @pointermove="onFlyoutPointerMove"
          @click="onFlyoutClick">
        <ScrollViewer
          ref="scrollViewerRef"
          class="win-combo-scroll-viewer"
          HorizontalScrollMode="{x:Bind ComboBoxScrollSettings.HorizontalScrollMode, Mode=OneWay}"
          HorizontalScrollBarVisibility="{x:Bind ComboBoxScrollSettings.HorizontalScrollBarVisibility, Mode=OneWay}"
          VerticalScrollMode="{x:Bind ComboBoxScrollSettings.VerticalScrollMode, Mode=OneWay}"
          VerticalScrollBarVisibility="{x:Bind ComboBoxScrollSettings.VerticalScrollBarVisibility, Mode=OneWay}"
          IsHorizontalRailEnabled="{x:Bind ComboBoxScrollSettings.IsHorizontalRailEnabled, Mode=OneWay}"
          IsVerticalRailEnabled="{x:Bind ComboBoxScrollSettings.IsVerticalRailEnabled, Mode=OneWay}"
          IsDeferredScrollingEnabled="{x:Bind ComboBoxScrollSettings.IsDeferredScrollingEnabled, Mode=OneWay}"
          ZoomMode="Disabled"
          IsVerticalScrollChainingEnabled="False"
          IsTabStop="False">
          <div ref="itemsPresenterRef" class="win-combo-items-presenter">
            <button
              v-for="(item, index) in resolvedItemsSource"
              :key="getItemKey(item, index)"
              :ref="(element) => setItemRef(element, index)"
              class="win-combo-item"
              :class="{ selected: visualSelectedIndex === index, hovered: hoveredIndex === index, 'is-disabled': !IsItemEnabled(item) }"
              type="button"
              role="option"
              :aria-selected="currentSelectedIndex === index"
              :disabled="!IsItemEnabled(item)"
              :style="itemContainerStyle(item)"
              :tabindex="currentSelectedIndex === index ? 0 : -1"
              @click="select(index)">
              <span class="win-combo-item-layout">
                <span v-if="visualSelectedIndex === index" class="win-combo-item-pill"></span>
                <ContentPresenter class="win-combo-item-content" Margin="{ThemeResource ComboBoxItemThemePadding}" HorizontalAlignment="Stretch" VerticalAlignment="Top">
                  <ItemRenderer v-if="hasItemTemplate" :item="item" :index="index" />
                  <InlineItemRenderer v-else :item="item" />
                </ContentPresenter>
              </span>
            </button>
          </div>
        </ScrollViewer>
        </div>
      </div>
      <div
        v-if="isOpen && isFlyoutAnimating"
        class="win-combo-flyout-hit-overlay"
        :style="flyoutStyle"
        @pointerdown.stop
        @pointermove="onFlyoutPointerMove"
        @click="onFlyoutClick" />
    </Teleport>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { CollectionItemTemplate, CollectionItems, CollectionResources, CollectionItemContainerStyle } from './CollectionProperties';
import { ComboBoxHeader, ComboBoxHeaderTemplate, ComboBoxDescription } from './ComboBoxProperties';

export const ComboBoxItem = defineComponent({
  name: 'ComboBoxItem',
  __xamlComboBoxItem: true,
  setup() { return () => null; }
});

// XAML's x:String is a structural inline item marker. Registering it as a
// component lets Vue resolve the official `<x:String>` element without
// creating a wrapper node; ComboBox.inlineItems reads its text/UID directly
// from the vnode when materializing the ItemsSource.
export const XamlString = defineComponent({
  name: 'x:String',
  __xamlString: true,
  setup() { return () => null; }
});

export default {
  ItemTemplate: CollectionItemTemplate,
  Items: CollectionItems,
  Resources: CollectionResources,
  ItemContainerStyle: CollectionItemContainerStyle,
  Header: ComboBoxHeader,
  HeaderTemplate: ComboBoxHeaderTemplate,
  Description: ComboBoxDescription
};
</script>

<script setup>
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowReactive, shallowRef, useAttrs, useSlots, watch } from 'vue';
import { useI18n } from './i18n/index';
import ScrollViewer from './ScrollViewer.vue';
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties';
import { xamlResourceDictionaryKey } from './Page.vue';
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlItemContextKey, xamlScopeKey, xamlTemplateComponent } from './xamlRuntime';
import { scrollViewerTemplateBindings } from './scrollViewerTemplateBindings';
import TextBlock from './TextBlock.vue';
import TextBoxControl from './TextBox.vue';
import ContentPresenter from './ContentPresenter.vue';
import { boolValue, xamlThickness, alignment } from './layout';
import { getComboBoxProperty, isComboBoxProperty } from './ComboBoxProperties';
import { collectXamlResources, useXamlBrushResources } from './xamlBrushResources';
import { useBrushProperty, isBrushProperty } from './brushProperties';
import './comboBoxResources.css';
import { useFlyoutAnimation } from './useFlyoutAnimation';
import AnimatedIcon from './AnimatedIcon.vue';
import { useAnimatedIconInput } from './animatedIconInput';
import { colorString, createSolidColorBrush } from './brushCore';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBrush } from './acrylicBrushVisual';
import { vThemeShadow } from './themeShadowVisual';
import { primitiveResourceScope } from './xamlPrimitives';

const ComboBoxPopupMaxNumberOfItems = 15;
const ComboBoxPopupMaxNumberOfItemsThatCanBeShownOnOneSide = 7;
const ComboBoxDropdownContentMargin = { Top: 4, Bottom: 4 };
const DefaultComboBoxItemHeight = 36;

const { t } = useI18n();
defineOptions({ name: 'ComboBox', inheritAttrs: false });
const props = defineProps({
  ItemsSource: { type: [Array, String], default: undefined },
  ItemTemplate: { type: [String, Object, Function], default: undefined },
  Header: { type: null, default: '' },
  HeaderTemplate: { type: null, default: undefined },
  Description: { type: null, default: '' },
  ItemContainerStyle: { type: null, default: undefined },
  PlaceholderText: { type: [String, Number], default: '' },
  IsEditable: { type: [Boolean, String], default: false },
  IsEnabled: { type: [Boolean, String], default: true },
  IsDropDownOpen: { type: [Boolean, String], default: undefined },
  SelectedIndex: { type: [Number, String], default: undefined },
  SelectedItem: { type: null, default: undefined },
  SelectedValue: { type: null, default: undefined },
  SelectedValuePath: { type: [String, Number], default: '' },
  DisplayMemberPath: { type: [String, Number], default: '' },
  Text: { type: [String, Number], default: undefined },
  IsTextSearchEnabled: { type: [Boolean, String], default: true },
  SelectionChangedTrigger: { type: String, default: 'Committed' },
  LightDismissOverlayMode: { type: String, default: 'Auto' },
  IsTabStop: { type: [Boolean, String], default: true },
  RequestedTheme: { type: String, default: 'Default' },
  Visibility: { type: String, default: 'Visible' },
  Background: { type: [String, Object], default: '' },
  Foreground: { type: String, default: '' },
  BorderBrush: { type: [String, Object], default: '' },
  BorderThickness: { type: [String, Number], default: 1 },
  CornerRadius: { type: [String, Number], default: 4 },
  Padding: { type: [String, Number], default: '' },
  PlaceholderForeground: { type: String, default: '' },
  FontFamily: { type: String, default: '' },
  FontSize: { type: [String, Number], default: '' },
  FontWeight: { type: [String, Number], default: '' },
  HorizontalContentAlignment: { type: String, default: 'Stretch' },
  VerticalContentAlignment: { type: String, default: 'Top' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Left' },
  VerticalAlignment: { type: String, default: 'Top' },
  MaxDropDownHeight: { type: [Number, String], default: 504 }
});
const instance = getCurrentInstance();
const dropDownBackgroundStyle = useAcrylicBrushStyle('{ThemeResource ComboBoxDropDownBackground}', instance);
const AnimatedGlyphInput = useAnimatedIconInput(false, state => state === 'Disabled' ? 'Normal' : state);
const attrs = useAttrs();
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style', 'SelectionChanged', 'TextSubmitted', 'DropDownOpened', 'DropDownClosed', 'Loaded'].includes(name) && !name.startsWith('on'))));
const ComboBoxScrollSettings = scrollViewerTemplateBindings(name => attrs[name], instance, {
  VerticalScrollMode: 'Auto', IsDeferredScrollingEnabled: false
});
const slots = useSlots();
// ComboBox::OpenDropDown checks this control's local Resources dictionary.
const localPrimitiveResources = primitiveResourceScope(() => slots.default?.() ?? []);
const defaultShadowEnabled = computed(() => boolValue(localPrimitiveResources.value.IsDefaultShadowEnabled ?? true));
const backgroundBrush = useBrushProperty('Background', () => props.Background, () => slots.default?.() ?? [], instance);
const inheritedResources = inject(xamlResourceDictionaryKey, {});
const propertyNodes = computed(() => {
  const result = { Header: [], HeaderTemplate: [], Description: [], resources: [], items: [], itemTemplate: [], itemContainerStyle: [] };
  const collect = nodes => { for (const node of nodes) {
    if (node.type === Fragment && Array.isArray(node.children)) { collect(node.children); continue; }
    const name = getComboBoxProperty(node) || getCollectionProperty(node);
    if (name && name in result) result[name].push(...getVNodeChildren(node));
  } };
  collect(slots.default?.() ?? []);
  return result;
});
const resourceNodes = computed(() => {
  const dictionary = {};
  const collect = nodes => { for (const node of nodes) {
    const type = typeof node.type === 'string' ? node.type : node.type?.name;
    if (node.type === Fragment || type === 'ResourceDictionary') collect(getVNodeChildren(node));
    else collectXamlResources([node], dictionary);
  } };
  collect(propertyNodes.value.resources);
  return dictionary;
});
const resources = new Proxy(inheritedResources, { get: (source, key) => resourceNodes.value[key] ?? source[key] });
provide(xamlResourceDictionaryKey, resources);
const brushResources = useXamlBrushResources(instance);
const templateValue = value => {
  const key = typeof value === 'string' ? value.match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}/)?.[1] : undefined;
  return key && resources[key] ? resources[key] : resolveXamlValue(value, instance);
};
const itemTemplateNodes = computed(() => {
  const value = templateValue(props.ItemTemplate);
  if (value && typeof value === 'object' && value.type) return getVNodeChildren(value);
  return propertyNodes.value.itemTemplate;
});
const hasItemTemplate = computed(() => itemTemplateNodes.value.length > 0 || typeof templateValue(props.ItemTemplate) === 'function');
const ItemRenderer = defineComponent({
  name: 'ComboBoxItemTemplate',
  props: {
    item: { type: null, default: undefined },
    index: { type: Number, default: 0 }
  },
  setup(itemProps) {
    provide(xamlItemContextKey, computed(() => itemProps.item));
    return () => typeof templateValue(props.ItemTemplate) === 'function' ? templateValue(props.ItemTemplate)(itemProps.item)
      : xamlTemplateComponent(itemTemplateNodes.value, itemProps.item, instance);
  }
});
const InlineItemRenderer = defineComponent({
  props: { item: { type: null, default: undefined } },
  setup(itemProps) { return () => itemProps.item?.__contentNodes?.length
    ? h(Fragment, normalizeXamlNodes(itemProps.item.__contentNodes, instance))
    : isVNode(itemProps.item?.Content) ? h(Fragment, normalizeXamlNodes([itemProps.item.Content], instance))
      : GetItemLabel(itemProps.item); }
});
const SelectionBoxRenderer = defineComponent({ setup() { return () => {
  if (currentSelectedItem.value === undefined) return h(TextBlock, { Text: resolvedPlaceholderText.value, class: 'win-combo-placeholder', Foreground: 'var(--ComboBoxPlaceholderCurrent)' });
  return hasItemTemplate.value ? h(ItemRenderer, { item: currentSelectedItem.value, index: currentSelectedIndex.value })
    : h(InlineItemRenderer, { item: currentSelectedItem.value });
} } });
// A XAML ComboBoxItem remains the same container when its Content binding
// changes. Keep that identity across slot renders so a label/resource update
// cannot replace the selected item or replay the initial SelectedIndex.
const inlineItemContainers = new Map();
let inlineStringKeys = new Map();
let previousInlineStringKeys = new Map();
const inlineItems = computed(() => {
  const items = [];
  const containerKeys = new Set();
  const stringKeys = new Map();
  const textFromNode = (node) => {
    if (node === null || node === undefined) return '';
    if (Array.isArray(node)) return node.map(textFromNode).join('');
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (typeof node !== 'object') return '';
    const children = node.children;
    if (typeof children === 'string' || typeof children === 'number') return String(children);
    if (children && typeof children === 'object' && typeof children.default === 'function') {
      try {
        return textFromNode(children.default());
      } catch {
        return '';
      }
    }
    return textFromNode(children);
  };
  const visit = (node) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node === 'object') {
      const type = node.type;
      const typeName = typeof type === 'string' ? type : type?.name || type?.__name || '';
      if (getCollectionProperty(node) === 'items') { visit(getVNodeChildren(node)); }
      else if (isComboBoxProperty(node) || isBrushProperty(node)) return;
      else if (typeName === 'x:String') {
        const uid = node.props?.['x:Uid'];
        const text = uid ? t(uid) : textFromNode(node.children).trim();
        if (text) {
          stringKeys.set(node.key ?? uid ?? items.length, items.length);
          items.push(text);
        }
      } else if (typeName === 'SolidColorBrush') {
        const key = node.key ?? items.length;
        containerKeys.add(key);
        let brush = inlineItemContainers.get(key);
        if (!brush || brush.__xamlBrush !== 'SolidColorBrush') {
          brush = createSolidColorBrush();
          inlineItemContainers.set(key, brush);
        }
        brush.Color = colorString(resolveXamlValue(node.props?.Color, instance));
        brush.Opacity = Number(resolveXamlValue(node.props?.Opacity ?? 1, instance));
        items.push(brush);
      } else if (type?.__xamlComboBoxItem || typeName === 'ComboBoxItem') {
        const content = node.props?.Content === undefined ? undefined : resolveXamlValue(node.props.Content, instance);
        const contentNodes = node.props?.Content === undefined ? getVNodeChildren(node) : [];
        const tag = node.props?.Tag;
        const key = node.key ?? items.length;
        containerKeys.add(key);
        let container = inlineItemContainers.get(key);
        if (!container) {
          container = shallowReactive({ Content: undefined, Tag: undefined, IsEnabled: true, __contentNodes: [] });
          inlineItemContainers.set(key, container);
        }
        container.Content = content ?? textFromNode(node).trim();
        container.__contentNodes = contentNodes;
        container.IsEnabled = boolValue(resolveXamlValue(node.props?.IsEnabled ?? true, instance));
        container.Tag = typeof tag === 'string' && tag.startsWith('{}') ? tag.slice(2) : resolveXamlValue(tag, instance);
        items.push(container);
      } else if (typeof type === 'symbol') {
        visit(node.children);
      }
    }
  };
  visit(slots.default?.());
  for (const key of inlineItemContainers.keys()) {
    if (!containerKeys.has(key)) inlineItemContainers.delete(key);
  }
  previousInlineStringKeys = inlineStringKeys;
  inlineStringKeys = stringKeys;
  return items;
});
let isUsingInlineItems = true;
const resolvedItemsSource = computed(() => {
  const value = resolveXamlValue(props.ItemsSource, instance);
  if (Array.isArray(value)) {
    isUsingInlineItems = false;
    return value;
  }
  isUsingInlineItems = true;
  return inlineItems.value;
});
const resolvedHeader = computed(() => propertyNodes.value.Header[0] ?? resolveXamlValue(props.Header, instance));
const resolvedHeaderTemplate = computed(() => propertyNodes.value.HeaderTemplate[0] ?? templateValue(props.HeaderTemplate));
const resolvedDescription = computed(() => propertyNodes.value.Description[0] ?? resolveXamlValue(props.Description, instance));
const resolvedPlaceholderText = computed(() => resolveXamlValue(props.PlaceholderText, instance));
const resolvedIsEditable = computed(() => boolValue(resolveXamlValue(props.IsEditable, instance)));
const localIsEnabled = ref(undefined);
const sourceIsEnabled = computed(() => boolValue(resolveXamlValue(props.IsEnabled, instance)));
watch(sourceIsEnabled, () => { localIsEnabled.value = undefined; });
const resolvedIsEnabled = computed(() => localIsEnabled.value ?? sourceIsEnabled.value);
const resolvedIsTabStop = computed(() => boolValue(resolveXamlValue(props.IsTabStop, instance)));
const resolvedIsDropDownOpen = computed(() => {
  const value = resolveXamlValue(props.IsDropDownOpen, instance);
  return value === undefined ? undefined : boolValue(value);
});
const resolvedSelectedIndex = computed(() => {
  const value = resolveXamlValue(props.SelectedIndex, instance);
  return value === undefined || value === '' ? undefined : Number(value);
});
const resolvedSelectedItem = computed(() => resolveXamlValue(props.SelectedItem, instance));
const resolvedSelectedValue = computed(() => resolveXamlValue(props.SelectedValue, instance));
const resolvedText = computed(() => resolveXamlValue(props.Text, instance));
const resolvedWidth = computed(() => resolveXamlValue(props.Width, instance));
const resolvedMinWidth = computed(() => resolveXamlValue(props.MinWidth, instance));
const resolvedMaxWidth = computed(() => resolveXamlValue(props.MaxWidth, instance));
const resolvedMaxDropDownHeight = computed(() => Number(resolveXamlValue(props.MaxDropDownHeight, instance)) || 504);

const emit = defineEmits([
  'DropDownOpened',
  'DropDownClosed',
  'SelectionChanged',
  'TextSubmitted',
  'Loaded'
]);

const comboRef = ref(null);
const backgroundRef = ref(null);
const inputRef = ref(null);
const TextBox = defineComponent({
  name: 'ComboBoxEditableText', inheritAttrs: false,
  setup(_, { attrs: textAttrs, expose }) {
    const templateInstance = getCurrentInstance();
    const control = ref(null);
    const api = { Focus: () => control.value?.Focus(), SelectAll: () => control.value?.SelectAll() };
    Object.defineProperty(api, 'Text', { get: () => control.value?.Text });
    expose(api);
    return () => {
      const node = normalizeXamlNodes([h(TextBoxControl, { ...textAttrs, ref: control })], templateInstance)[0];
      for (const name of ['IsEnabled', 'ShowDeleteButton']) {
        if (node.props?.[name] !== undefined) node.props[name] = boolValue(resolveXamlValue(node.props[name], templateInstance));
      }
      return node;
    };
  }
});
const flyoutRef = ref(null);
const scrollViewerRef = ref(null);
const itemsPresenterRef = ref(null);
const itemRefs = ref([]);
const hoveredIndex = ref(-1);
const focusedIndex = ref(-1);
const visualSelectedIndex = computed(() => isOpen.value && focusedIndex.value >= 0 ? focusedIndex.value : currentSelectedIndex.value);
const isOpen = ref(Boolean(resolvedIsDropDownOpen.value));
const SelectionBoxOpacity = computed(() => isOpen.value ? 0.5 : 1);
const isClosing = ref(false);
const popupVisible = computed(() => isOpen.value || isClosing.value);
const isEditing = ref(false);
const flyoutReady = ref(false);
const openedUp = ref(false);
const flyoutStyle = ref({ visibility: 'hidden' });
const inputDeviceTypeUsedToOpen = ref('Mouse');
const isOverlayVisible = computed(() => resolveXamlValue(props.LightDismissOverlayMode, instance) === 'On');
const currentSelectedIndex = ref(-1);
const currentSelectedItem = shallowRef(undefined);
const currentText = ref(resolvedText.value === undefined ? '' : String(resolvedText.value));
const anchorTheme = ref('');
const inheritedTheme = inject('winuiTheme', null);
const listBoxId = `win-combo-box-${Math.random().toString(36).slice(2)}`;

const flyoutAnimation = useFlyoutAnimation(flyoutRef, {
  Duration: () => isClosing.value ? 167 : 250,
  Easing: 'cubic-bezier(0,0,0,1)',
  Origin: 'rect',
  StartRect: targetRect => {
    const faceRect = backgroundRef.value?.getBoundingClientRect();
    const center = faceRect ? faceRect.top + faceRect.height / 2 - targetRect.top : targetRect.height / 2;
    const offset = Math.abs(center - targetRect.height / 2);
    const ratio = isClosing.value ? 0.15 : 0.5;
    const maxOffset = targetRect.height * (1 - ratio) / 2;
    const clipHeight = targetRect.height * ratio + Math.max(0, offset - maxOffset) * 2;
    return { left: 0, right: targetRect.width, top: center - clipHeight / 2, bottom: center + clipHeight / 2 };
  },
  Direction: () => (openedUp.value ? 'bottom' : 'top'),
  StripSize: DefaultComboBoxItemHeight
});
const isFlyoutAnimating = computed(() => flyoutAnimation.isPlaying.value);
let opacityAnimations = [];
const cancelOpacityAnimations = () => {
  opacityAnimations.forEach(animation => animation.cancel());
  opacityAnimations = [];
};
const playOpacityAnimations = closing => {
  cancelOpacityAnimations();
  if (!flyoutAnimation.isPlaying.value) return;
  if (closing && flyoutRef.value?.animate) {
    opacityAnimations.push(flyoutRef.value.animate(
      [{ opacity: 1 }, { opacity: 1, offset: 84 / 167 }, { opacity: 0 }],
      { duration: 167, easing: 'linear', fill: 'none' }
    ));
  }
  const face = !resolvedIsEditable.value && backgroundRef.value?.querySelector('.win-combo-content');
  if (face?.animate) opacityAnimations.push(face.animate(
    closing ? [{ opacity: 0 }, { opacity: 0, offset: 84 / 167 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0.5 }],
    { duration: closing ? 167 : 83, easing: 'linear', fill: 'none' }
  ));
};
watch(isFlyoutAnimating, playing => {
  if (!playing && isClosing.value) {
    cancelOpacityAnimations();
    isClosing.value = false;
    flyoutReady.value = false;
  }
});

let resizeObserver = null;
let themeObserver = null;
let positionFrame = 0;
let lastInputDeviceType = 'Mouse';
let isCustomSelection = false;
let editingRestoreItem;
let editingRestoreText = '';
let submittingText = false;

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const rootStyle = computed(() => {
  const style = {};
  brushResources.sync(resourceNodes.value);
  if (resolvedWidth.value !== '') style.width = cssLength(resolvedWidth.value);
  if (resolvedMinWidth.value !== '') style.minWidth = cssLength(resolvedMinWidth.value);
  if (resolvedMaxWidth.value !== '') style.maxWidth = cssLength(resolvedMaxWidth.value);
  const margin = String(resolveXamlValue(props.Margin, instance) ?? '').split(',').map((part) => cssLength(part.trim()));
  if (props.Margin !== '') style.margin = margin.length === 4 ? `${margin[1]} ${margin[2]} ${margin[3]} ${margin[0]}` : margin.length === 2 ? `${margin[1]} ${margin[0]}` : margin[0];
  for (const name of ['Height', 'MinHeight', 'MaxHeight']) if (props[name] !== '') style[name[0].toLowerCase() + name.slice(1)] = cssLength(resolveXamlValue(props[name], instance));
  style.alignSelf = alignment(resolveXamlValue(props.VerticalAlignment, instance), 'vertical');
  style.justifySelf = alignment(resolveXamlValue(props.HorizontalAlignment, instance), 'horizontal');
  if (resolveXamlValue(props.HorizontalAlignment, instance) === 'Stretch' && resolvedWidth.value === '') style.width = '100%';
  for (const name of ['Background', 'Foreground', 'BorderBrush']) if (props[name]) style[`--ComboBox${name}`] = resolveXamlValue(props[name], instance);
  if (backgroundBrush.value.value && typeof backgroundBrush.value.value !== 'object') style['--ComboBoxBackground'] = backgroundBrush.value.value;
  if (props.PlaceholderForeground) style['--ComboBoxPlaceHolderForeground'] = resolveXamlValue(props.PlaceholderForeground, instance);
  style['--ComboBoxBorderThemeThickness'] = xamlThickness(resolveXamlValue(props.BorderThickness, instance));
  if (props.Padding !== '') style['--ComboBoxPadding'] = xamlThickness(resolveXamlValue(props.Padding, instance));
  style['--ComboBoxCornerRadius'] = xamlThickness(resolveXamlValue(props.CornerRadius, instance));
  for (const name of ['FontFamily', 'FontSize', 'FontWeight']) if (props[name] !== '') style[name[0].toLowerCase() + name.slice(1)] = name === 'FontSize' ? cssLength(resolveXamlValue(props[name], instance)) : resolveXamlValue(props[name], instance);
  if (resolveXamlValue(props.Visibility, instance) === 'Collapsed') style.display = 'none';
  return [attrs.style, style];
});
const SelectionBoxPadding = computed(() => props.Padding === '' ? 'var(--combo-selection-padding)' : resolveXamlValue(props.Padding, instance));
const selectionBoxStyle = computed(() => ({
  margin: xamlThickness(SelectionBoxPadding.value),
  justifySelf: alignment(resolveXamlValue(props.HorizontalContentAlignment, instance), 'horizontal'),
  alignSelf: alignment(resolveXamlValue(props.VerticalContentAlignment, instance), 'vertical')
}));

const themeClass = computed(() => {
  const requested = String(resolveXamlValue(props.RequestedTheme, instance)).toLowerCase();
  const theme = requested !== 'default' ? requested : inheritedTheme?.value || anchorTheme.value;
  return theme === 'light' || theme === 'dark' ? `theme-${theme}` : '';
});

const GetPathValue = (item, path) => {
  if (!path) return item;
  return path.split('.').reduce((value, key) => value?.[key], item);
};

const GetItemLabel = (item) => {
  const displayMemberPath = resolveXamlValue(props.DisplayMemberPath, instance);
  const value = displayMemberPath ? GetPathValue(item, displayMemberPath) : item;
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);
  if (value.Content !== undefined) return typeof value.Content === 'string' || typeof value.Content === 'number' ? String(value.Content) : '';
  return typeof value.toString === 'function' && value.toString !== Object.prototype.toString ? String(value) : '';
};
const IsItemEnabled = item => item?.IsEnabled !== false;
const itemContainerStyle = item => {
  const node = propertyNodes.value.itemContainerStyle[0] ?? templateValue(props.ItemContainerStyle);
  const style = {};
  for (const setter of isVNode(node) ? getVNodeChildren(node) : []) {
    const name = setter.props?.Property;
    const value = resolveXamlValue(setter.props?.Value, instance);
    if (['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight', 'FontSize'].includes(name)) style[name[0].toLowerCase() + name.slice(1)] = cssLength(value);
    if (name === 'Foreground') style.color = value;
    if (name === 'Padding') style['--ComboBoxItemPadding'] = xamlThickness(value);
  }
  return style;
};
const raiseEvent = (name, args = {}) => {
  args.OriginalSource ??= controlSender;
  const listener = instance?.vnode.props?.[`on${name}`];
  if (name === 'Loaded' && listener) {
    for (const handler of Array.isArray(listener) ? listener : [listener]) handler(controlSender, args);
    return;
  }
  emit(name, controlSender, args);
  if (!listener) resolveXamlHandler(attrs[name], instance)?.(controlSender, args);
};

const GetItemValue = (item) => {
  const selectedValuePath = resolveXamlValue(props.SelectedValuePath, instance);
  if (selectedValuePath) return GetPathValue(item, selectedValuePath);
  return item;
};

const getItemKey = (item, index) => {
  if (item && typeof item === 'object') return item.Key ?? item.Id ?? item.id ?? index;
  return `${String(item)}-${index}`;
};

const FindItemIndex = (item) => resolvedItemsSource.value.findIndex((candidate) => Object.is(candidate, item));
const FindValueIndex = (value) => resolvedItemsSource.value.findIndex((item) => Object.is(GetItemValue(item), value));

const selectedLabel = computed(() => {
  if (currentSelectedItem.value !== undefined) return GetItemLabel(currentSelectedItem.value);
  return resolvedPlaceholderText.value || '';
});

const editableDisplayLabel = computed(() => currentText.value || selectedLabel.value);

const SetCurrentSelection = (index, selectedItem, updateText = true) => {
  currentSelectedIndex.value = index;
  currentSelectedItem.value = selectedItem;
  isCustomSelection = resolvedIsEditable.value && selectedItem !== undefined && index < 0;
  if (updateText) currentText.value = selectedItem === undefined ? '' : GetItemLabel(selectedItem);
};

const GetSelectionProperties = () => [resolvedSelectedIndex.value, resolvedSelectedItem.value, resolvedSelectedValue.value];
let lastSelectionProperties;
let pendingSelectionFromProperties = false;
const HaveSelectionPropertiesChanged = (values) => !lastSelectionProperties
  || values.some((value, index) => !Object.is(value, lastSelectionProperties[index]));

const SyncSelectionFromProperties = () => {
  let selectedIndex;
  let selectedItem;
  const values = GetSelectionProperties();
  const changedProperty = lastSelectionProperties ? values.findIndex((value, index) => !Object.is(value, lastSelectionProperties[index])) : -1;
  const request = changedProperty >= 0 ? changedProperty : values.findIndex(value => value !== undefined);
  lastSelectionProperties = values;
  pendingSelectionFromProperties = false;

  if (request === 0) {
    selectedIndex = resolvedSelectedIndex.value >= 0 && resolvedSelectedIndex.value < resolvedItemsSource.value.length ? resolvedSelectedIndex.value : -1;
    selectedItem = selectedIndex >= 0 ? resolvedItemsSource.value[selectedIndex] : undefined;
    pendingSelectionFromProperties = resolvedSelectedIndex.value >= 0 && selectedIndex < 0;
  } else if (request === 1) {
    selectedIndex = FindItemIndex(resolvedSelectedItem.value);
    selectedItem = resolvedSelectedItem.value === null ? undefined : resolvedSelectedItem.value;
    pendingSelectionFromProperties = selectedItem !== undefined && selectedIndex < 0 && !resolvedIsEditable.value;
  } else if (request === 2) {
    selectedIndex = FindValueIndex(resolvedSelectedValue.value);
    selectedItem = selectedIndex >= 0 ? resolvedItemsSource.value[selectedIndex] : undefined;
    pendingSelectionFromProperties = selectedIndex < 0;
  } else {
    return;
  }

  const oldItem = currentSelectedItem.value;
  const selectionChanged = selectedIndex !== currentSelectedIndex.value || !Object.is(oldItem, selectedItem);
  SetCurrentSelection(selectedIndex, selectedItem, resolvedText.value === undefined);
  if (selectionChanged && !pendingSelectionFromProperties) RaiseSelectionChanged(oldItem, selectedItem, selectedIndex);
};

const RaiseSelectionChanged = (oldItem, selectedItem, selectedIndex) => {
  pendingSelectionFromProperties = false;
  updateXamlBinding(props.SelectedIndex, selectedIndex, instance);
  updateXamlBinding(props.SelectedItem, selectedItem, instance);
  updateXamlBinding(props.SelectedValue, selectedItem === undefined ? undefined : GetItemValue(selectedItem), instance);
  updateXamlBinding(props.Text, currentText.value, instance);
  lastSelectionProperties = GetSelectionProperties();
  raiseEvent('SelectionChanged', {
    AddedItems: selectedItem === undefined ? [] : [selectedItem],
    RemovedItems: oldItem === undefined ? [] : [oldItem],
    Handled: false
  });
};

const SetSelectedIndex = (index) => {
  const selectedIndex = index >= 0 && index < resolvedItemsSource.value.length ? index : -1;
  const selectedItem = selectedIndex >= 0 ? resolvedItemsSource.value[selectedIndex] : undefined;
  const oldItem = currentSelectedItem.value;
  pendingSelectionFromProperties = false;
  if (selectedIndex === currentSelectedIndex.value && Object.is(selectedItem, oldItem)) return;

  SetCurrentSelection(selectedIndex, selectedItem);
  RaiseSelectionChanged(oldItem, selectedItem, selectedIndex);
};

const SetSelectedItem = (item) => {
  const selectedItem = item === null ? undefined : item;
  const selectedIndex = FindItemIndex(selectedItem);
  if (selectedItem !== undefined && selectedIndex < 0 && !resolvedIsEditable.value) return;
  const oldItem = currentSelectedItem.value;
  pendingSelectionFromProperties = false;
  if (selectedIndex === currentSelectedIndex.value && Object.is(selectedItem, oldItem)) return;
  SetCurrentSelection(selectedIndex, selectedItem);
  RaiseSelectionChanged(oldItem, selectedItem, selectedIndex);
};

const SetText = (value) => {
  currentText.value = value === null || value === undefined ? '' : String(value);
  updateXamlBinding(props.Text, currentText.value, instance);
};

const SetSelectedValue = (value) => SetSelectedIndex(FindValueIndex(value));


const ResolveAnchorTheme = () => {
  // The ComboBox mirrors its inherited theme onto its own root so a
  // teleported flyout shares that theme. Read from the parent to avoid
  // locking inheritance to the control's previous class.
  const themeScope = comboRef.value?.parentElement?.closest('.theme-light, .theme-dark, [data-theme="light"], [data-theme="dark"]');
  if (themeScope?.classList.contains('theme-dark')) return 'dark';
  if (themeScope?.classList.contains('theme-light')) return 'light';
  return themeScope?.getAttribute('data-theme') || '';
};

const ObserveAnchorTheme = () => {
  themeObserver?.disconnect();
  const themeScope = comboRef.value?.parentElement?.closest('.theme-light, .theme-dark, [data-theme="light"], [data-theme="dark"]');
  anchorTheme.value = ResolveAnchorTheme();
  if (!themeScope) return;

  themeObserver = new MutationObserver(() => {
    anchorTheme.value = ResolveAnchorTheme();
    schedulePositionFlyout();
  });
  themeObserver.observe(themeScope, { attributes: true, attributeFilter: ['class', 'data-theme'] });
};

const GetItemLayoutHeight = (index) => {
  const element = itemRefs.value[index];
  if (!element) return DefaultComboBoxItemHeight;
  const style = window.getComputedStyle(element);
  return element.getBoundingClientRect().height
    + Number.parseFloat(style.marginTop || '0')
    + Number.parseFloat(style.marginBottom || '0');
};

const GetNonPannablePopupLayout = (
  centerItemIndex,
  itemCount,
  cbY,
  cbHeight,
  cbPopupContentMargin,
  rootWindowSize,
  initialPopupMaxHeight
) => {
  let popupMaxHeight = initialPopupMaxHeight;
  let offset = 0;

  if (itemCount < centerItemIndex || centerItemIndex < 0) {
    centerItemIndex = Math.floor(itemCount / 2);
  }

  if (itemCount === 0) {
    return { popupY: cbY, popupMaxHeight: cbHeight, offset };
  }

  let currentItemHeight = GetItemLayoutHeight(centerItemIndex);

  if ((cbY + cbHeight) >= rootWindowSize.Height) {
    cbY = rootWindowSize.Height - cbHeight;
  }

  const calculatedLayoutLocationAbove = cbY + cbHeight / 2 - currentItemHeight / 2 - cbPopupContentMargin.Top;
  let layoutLocationAbove = Math.max(calculatedLayoutLocationAbove, 0);
  const upperLimit = Math.max(cbY + cbHeight / 2 - popupMaxHeight / 2, 0);
  const calculatedLayoutLocationBelow = layoutLocationAbove + currentItemHeight + cbPopupContentMargin.Top + cbPopupContentMargin.Bottom;
  let layoutLocationBelow = Math.min(calculatedLayoutLocationBelow, rootWindowSize.Height);
  const lowerLimit = Math.min(upperLimit + popupMaxHeight, rootWindowSize.Height);
  let itemIndexAbove = centerItemIndex - 1;
  let itemIndexBelow = centerItemIndex + 1;
  let totalItemsLayed = 1;
  const maxNumberOfItemsAllowedOnOneSide = Math.min(ComboBoxPopupMaxNumberOfItemsThatCanBeShownOnOneSide, itemCount);
  const maxNumberOfItemsAllowed = Math.min(ComboBoxPopupMaxNumberOfItems, itemCount);

  if (calculatedLayoutLocationBelow > rootWindowSize.Height) {
    layoutLocationAbove = Math.max(layoutLocationAbove - calculatedLayoutLocationBelow + rootWindowSize.Height, 0);
  }

  if (itemIndexAbove >= 0) {
    currentItemHeight = GetItemLayoutHeight(itemIndexAbove);

    while (itemIndexAbove >= 0
      && layoutLocationAbove - currentItemHeight >= upperLimit
      && totalItemsLayed < maxNumberOfItemsAllowedOnOneSide) {
      layoutLocationAbove -= currentItemHeight;
      totalItemsLayed++;
      itemIndexAbove--;
      if (itemIndexAbove >= 0) currentItemHeight = GetItemLayoutHeight(itemIndexAbove);
    }
  }

  if (itemIndexBelow < itemCount) {
    currentItemHeight = GetItemLayoutHeight(itemIndexBelow);

    while (itemIndexBelow < itemCount
      && layoutLocationBelow + currentItemHeight < lowerLimit
      && layoutLocationBelow - layoutLocationAbove < popupMaxHeight
      && totalItemsLayed < maxNumberOfItemsAllowed) {
      layoutLocationBelow += currentItemHeight;
      totalItemsLayed++;
      itemIndexBelow++;
      if (itemIndexBelow < itemCount) currentItemHeight = GetItemLayoutHeight(itemIndexBelow);
    }
  }

  if (itemIndexAbove >= 0 || itemIndexBelow < itemCount) {
    let isAbove = itemIndexAbove >= 0;
    let currentItemIndex = isAbove ? itemIndexAbove : itemIndexBelow;
    currentItemHeight = GetItemLayoutHeight(currentItemIndex);

    while (layoutLocationBelow - layoutLocationAbove + currentItemHeight <= popupMaxHeight
      && (layoutLocationBelow + currentItemHeight < rootWindowSize.Height || layoutLocationAbove - currentItemHeight >= 0)
      && totalItemsLayed < maxNumberOfItemsAllowed) {
      if (isAbove) itemIndexAbove--;
      else itemIndexBelow++;

      if (layoutLocationAbove - currentItemHeight <= 0) layoutLocationBelow += currentItemHeight;
      else layoutLocationAbove -= currentItemHeight;

      totalItemsLayed++;
      if (itemIndexAbove >= 0 || itemIndexBelow < itemCount) {
        isAbove = itemIndexAbove >= 0;
        currentItemIndex = isAbove ? itemIndexAbove : itemIndexBelow;
        currentItemHeight = GetItemLayoutHeight(currentItemIndex);
      }
    }
  }

  offset = itemIndexAbove + 1;
  const popupY = layoutLocationAbove;
  popupMaxHeight = layoutLocationBelow - layoutLocationAbove;
  return { popupY, popupMaxHeight, offset };
};

const GetEditableComboBoxPopupLayout = (
  itemCount,
  cbY,
  cbHeight,
  cbPopupContentMargin,
  rootWindowSize
) => {
  if (itemCount === 0) {
    return { popupY: cbY, popupMaxHeight: cbHeight, offset: 0, openedUp: false };
  }

  const calculatedLayoutLocationAbove = cbY + cbHeight;
  const layoutLocationAbove = Math.max(calculatedLayoutLocationAbove, 0);
  let layoutLocationBelow = layoutLocationAbove + cbPopupContentMargin.Top + cbPopupContentMargin.Bottom;
  let currentIndex = 0;
  let totalItemsLayed = 0;
  const maxNumberOfItemsAllowed = Math.min(ComboBoxPopupMaxNumberOfItems, itemCount);

  while (currentIndex < itemCount && totalItemsLayed < maxNumberOfItemsAllowed) {
    layoutLocationBelow += GetItemLayoutHeight(currentIndex);
    totalItemsLayed++;
    currentIndex++;
  }

  let popupY = layoutLocationAbove;
  const popupMaxHeight = layoutLocationBelow - layoutLocationAbove;
  let opensUp = false;

  if (popupY + popupMaxHeight > rootWindowSize.Height) {
    if (cbY - popupMaxHeight >= 0) {
      popupY = Math.max(cbY - popupMaxHeight, 0);
      opensUp = true;
    }
  }

  return { popupY, popupMaxHeight, offset: 0, openedUp: opensUp };
};

const GetPannablePopupLayout = (
  centerItemIndex,
  itemCount,
  cbY,
  cbHeight,
  childHeight,
  rootWindowSize,
  initialPopupMaxHeight
) => {
  let popupMaxHeight = initialPopupMaxHeight;

  if (itemCount < centerItemIndex || centerItemIndex < 0) {
    centerItemIndex = Math.floor(itemCount / 2);
  }

  let popupSize = GetItemLayoutHeight(centerItemIndex);
  let roomAvailableAbove = Math.min((popupMaxHeight - cbHeight) / 2, cbY);
  let roomAvailableBelow = Math.min(
    popupMaxHeight - roomAvailableAbove - cbHeight,
    Math.max(0, rootWindowSize.Height - cbY - popupSize)
  );

  const maxItemsAllowedAbove = Math.floor(Math.min(
    ComboBoxPopupMaxNumberOfItemsThatCanBeShownOnOneSide,
    (itemCount - 1) / 2
  ));
  const maxItemsAllowedBelow = Math.floor(Math.min(
    ComboBoxPopupMaxNumberOfItemsThatCanBeShownOnOneSide,
    (itemCount - 1) / 2
  ));

  let itemsAddedAbove = 0;
  let nextItemHeight = 0;
  let nextItemIndex = centerItemIndex - 1 >= 0 ? centerItemIndex - 1 : itemCount - 1;
  if (nextItemIndex >= 0) nextItemHeight = GetItemLayoutHeight(nextItemIndex);

  let popupY = Math.max(Math.min(cbY, rootWindowSize.Height - popupSize), 0);

  while (popupSize + nextItemHeight <= popupMaxHeight
    && itemsAddedAbove < maxItemsAllowedAbove
    && roomAvailableAbove - nextItemHeight > 0) {
    itemsAddedAbove++;
    popupSize += nextItemHeight;
    roomAvailableAbove -= nextItemHeight;
    popupY -= nextItemHeight;
    nextItemIndex = nextItemIndex - 1 >= 0 ? nextItemIndex - 1 : itemCount - 1;
    if (nextItemIndex >= 0) nextItemHeight = GetItemLayoutHeight(nextItemIndex);
  }

  let offset = centerItemIndex - itemsAddedAbove;
  let itemsAddedBelow = 0;
  nextItemHeight = 0;
  nextItemIndex = centerItemIndex + 1 < itemCount ? centerItemIndex + 1 : 0;
  if (nextItemIndex < itemCount) nextItemHeight = GetItemLayoutHeight(nextItemIndex);

  while (popupSize + nextItemHeight <= popupMaxHeight
    && itemsAddedBelow < maxItemsAllowedBelow
    && roomAvailableBelow - nextItemHeight > 0) {
    itemsAddedBelow++;
    popupSize += nextItemHeight;
    roomAvailableBelow -= nextItemHeight;
    nextItemIndex = nextItemIndex + 1 < itemCount ? nextItemIndex + 1 : 0;
    if (nextItemIndex < itemCount) nextItemHeight = GetItemLayoutHeight(nextItemIndex);
  }

  if (roomAvailableAbove >= nextItemHeight / 2) {
    popupSize += nextItemHeight / 2;
    popupY -= nextItemHeight / 2;
    offset -= 0.5;
  }

  popupMaxHeight = Math.min(popupMaxHeight, popupSize);
  while (offset < 0) offset += itemCount + 1;
  while (offset >= itemCount + 1) offset -= itemCount + 1;

  return { popupY, popupMaxHeight, offset, childHeight };
};

const UpdateIsPopupPannable = (itemCount, maxAllowedPopupHeight, availableSize, contentMargin = ComboBoxDropdownContentMargin) => {
  if (itemCount <= 0) return false;
  if (itemCount > ComboBoxPopupMaxNumberOfItems) return true;

  maxAllowedPopupHeight = Math.min(maxAllowedPopupHeight, availableSize.Height);
  const childHeight = resolvedItemsSource.value.reduce(
    (height, _item, index) => height + GetItemLayoutHeight(index),
    contentMargin.Top + contentMargin.Bottom
  );
  return childHeight > maxAllowedPopupHeight;
};

const positionFlyout = async () => {
  if (!isOpen.value || !backgroundRef.value || !flyoutRef.value) return;
  // A re-position (scroll/resize) must not leave the enter clip at stale
  // coordinates or sizes; cancel it so the flyout shows fully again.
  flyoutAnimation.cancel();

  await nextTick();
  const comboBoxRect = backgroundRef.value.getBoundingClientRect();
  const rootWindowSize = { Width: window.innerWidth, Height: window.innerHeight };
  if (rootWindowSize.Width === 0 || rootWindowSize.Height === 0 || comboBoxRect.width === 0 || comboBoxRect.height === 0) return;

  const maximumDropDownHeight = Math.min(resolvedMaxDropDownHeight.value, rootWindowSize.Height);
  const touchInput = inputDeviceTypeUsedToOpen.value === 'Touch';
  const popupContentMargin = touchInput ? { Top: 0, Bottom: 0 } : ComboBoxDropdownContentMargin;
  const popupMinWidth = Math.max(touchInput ? 240 : 80, comboBoxRect.width);
  flyoutReady.value = false;
  flyoutStyle.value = {
    top: '0px',
    left: '0px',
    minWidth: `${popupMinWidth}px`,
    maxWidth: `${rootWindowSize.Width}px`,
    maxHeight: `${maximumDropDownHeight}px`,
    visibility: 'hidden'
  };

  await nextTick();
  const childWidth = Math.max(comboBoxRect.width, Math.min(flyoutRef.value.getBoundingClientRect().width, rootWindowSize.Width));
  const flowDirection = window.getComputedStyle(backgroundRef.value).direction;
  const alignedPopupLeft = flowDirection === 'rtl' ? comboBoxRect.right - childWidth : comboBoxRect.left;
  const popupLeft = Math.round(Math.max(0, Math.min(alignedPopupLeft, rootWindowSize.Width - childWidth)));

  const isPopupPannable = UpdateIsPopupPannable(resolvedItemsSource.value.length, maximumDropDownHeight, rootWindowSize, popupContentMargin);
  const layout = resolvedIsEditable.value
    ? GetEditableComboBoxPopupLayout(
      resolvedItemsSource.value.length,
      comboBoxRect.top,
      comboBoxRect.height,
      popupContentMargin,
      rootWindowSize
    )
    : touchInput && isPopupPannable
      ? GetPannablePopupLayout(
        currentSelectedIndex.value,
        resolvedItemsSource.value.length,
        comboBoxRect.top,
        comboBoxRect.height,
        flyoutRef.value.getBoundingClientRect().height,
        rootWindowSize,
        maximumDropDownHeight
      )
      : GetNonPannablePopupLayout(
        currentSelectedIndex.value,
        resolvedItemsSource.value.length,
        comboBoxRect.top,
        comboBoxRect.height,
        popupContentMargin,
        rootWindowSize,
        maximumDropDownHeight
      );

  let popupY = layout.popupY;
  const popupMaxHeight = Math.max(comboBoxRect.height, Math.min(layout.popupMaxHeight, maximumDropDownHeight));
  if (popupY + popupMaxHeight > rootWindowSize.Height) {
    popupY = Math.max(popupY - (popupY + popupMaxHeight - rootWindowSize.Height), 0);
  }

  const popupTop = Math.round(popupY);
  openedUp.value = layout.openedUp ?? popupTop < comboBoxRect.top;
  flyoutStyle.value = {
    top: `${popupTop}px`,
    left: `${popupLeft}px`,
    width: `${Math.ceil(childWidth)}px`,
    minWidth: `${popupMinWidth}px`,
    maxWidth: `${rootWindowSize.Width}px`,
    height: `${Math.ceil(popupMaxHeight + 2)}px`,
    maxHeight: `${Math.ceil(popupMaxHeight + 2)}px`,
    visibility: 'visible'
  };

  await nextTick();
  if (itemsPresenterRef.value) {
    const firstItemIndex = Math.floor(layout.offset);
    const fractionalOffset = layout.offset - firstItemIndex;
    const verticalOffset = Array.from({ length: firstItemIndex }, (_, index) => GetItemLayoutHeight(index))
      .reduce((total, height) => total + height, 0)
      + (fractionalOffset > 0 ? GetItemLayoutHeight(firstItemIndex) * fractionalOffset : 0);
    scrollViewerRef.value?.ChangeView(null, verticalOffset, null);
  }
  flyoutReady.value = true;
  if (resolvedItemsSource.value.length > 0) {
    flyoutAnimation.play();
    playOpacityAnimations(false);
  }
};

const schedulePositionFlyout = () => {
  if (!isOpen.value || positionFrame) return;
  positionFrame = window.requestAnimationFrame(() => {
    positionFrame = 0;
    positionFlyout();
  });
};

const onWindowScroll = (event) => {
  if (flyoutRef.value?.contains(event.target)) return;
  schedulePositionFlyout();
};

const setOpen = async (value) => {
  if (value === isOpen.value || (value && !resolvedIsEnabled.value)) return;
  isOpen.value = value;
  updateXamlBinding(props.IsDropDownOpen, value, instance);

  if (value) {
    flyoutAnimation.cancel();
    cancelOpacityAnimations();
    isClosing.value = false;
    inputDeviceTypeUsedToOpen.value = lastInputDeviceType;
    anchorTheme.value = ResolveAnchorTheme();
    flyoutReady.value = false;
    focusedIndex.value = currentSelectedIndex.value;
    openingSelectedItem = currentSelectedItem.value;
    raiseEvent('DropDownOpened');
    await nextTick();
    await positionFlyout();
  } else {
    flyoutAnimation.cancel();
    if (flyoutReady.value && flyoutRef.value) {
      isClosing.value = true;
      flyoutAnimation.playReverse();
      playOpacityAnimations(true);
      if (!flyoutAnimation.isPlaying.value) { isClosing.value = false; flyoutReady.value = false; }
    } else flyoutReady.value = false;
    focusedIndex.value = -1;
    hoveredIndex.value = -1;
    raiseEvent('DropDownClosed');
  }
};

const open = () => setOpen(true);
const close = () => setOpen(false);
const toggle = () => setOpen(!isOpen.value);

const focusCombo = () => {
  if (!resolvedIsEditable.value) {
    backgroundRef.value?.focus();
    return;
  }

  if (isEditing.value) {
    inputRef.value?.Focus();
  } else {
    backgroundRef.value?.querySelector('.win-combo-edit-display')?.focus();
  }
};

const focusEditableText = (selectText = false) => {
  inputRef.value?.Focus();
  if (selectText) inputRef.value?.SelectAll();
};

const beginEditing = () => {
  if (!resolvedIsEnabled.value) return;
  if (!isEditing.value) {
    editingRestoreItem = currentSelectedItem.value;
    editingRestoreText = currentText.value;
  }
  isEditing.value = true;
  nextTick(() => focusEditableText(true));
};

const endEditing = (restoreFocus = false) => {
  if (!isEditing.value) return;
  isEditing.value = false;
  if (restoreFocus) nextTick(focusCombo);
};

const toggleEditableDropDown = () => {
  if (isOpen.value) {
    SubmitText();
    return;
  }

  beginEditing();
  open();
};

const select = (index) => {
  if (!resolvedIsEnabled.value || !IsItemEnabled(resolvedItemsSource.value[index])) return;
  SetSelectedIndex(index);
  isEditing.value = false;
  close();
  nextTick(focusCombo);
};

const itemIndexAtPoint = (event) => {
  const x = event.clientX;
  const y = event.clientY;
  for (let index = 0; index < itemRefs.value.length; index += 1) {
    const item = itemRefs.value[index];
    if (!item) continue;
    const rect = item.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return index;
  }
  return -1;
};

const onFlyoutPointerMove = (event) => {
  const index = itemIndexAtPoint(event);
  hoveredIndex.value = index;
};

const onFlyoutClick = (event) => {
  if ((event.target instanceof Element) && event.target.closest('.win-combo-item')) return;
  const index = itemIndexAtPoint(event);
  if (index >= 0) select(index);
};

const onEditableTextChanged = () => {
  SetText(inputRef.value?.Text ?? currentText.value);
  if (isOpen.value && boolValue(resolveXamlValue(props.IsTextSearchEnabled, instance))) {
    const text = currentText.value.toLocaleLowerCase();
    const index = resolvedItemsSource.value.findIndex(item => IsItemEnabled(item) && GetItemLabel(item).toLocaleLowerCase().startsWith(text));
    focusedIndex.value = text ? index : -1;
    if (index >= 0 && resolveXamlValue(props.SelectionChangedTrigger, instance) === 'Always') SetSelectedIndex(index);
  }
};

const commitEditableText = () => {
  const text = currentText.value;
  const selectedIndex = resolvedItemsSource.value.findIndex((item) => GetItemLabel(item) === text);
  if (selectedIndex >= 0) {
    if (selectedIndex !== currentSelectedIndex.value) SetSelectedIndex(selectedIndex);
    isCustomSelection = false;
    return true;
  }

  if (!text.trim()) {
    if (currentSelectedItem.value !== undefined) SetSelectedItem(undefined);
    return true;
  }

  if (isCustomSelection && GetItemLabel(currentSelectedItem.value) === text) return true;

  const args = { Text: text, Handled: false };
  submittingText = true;
  try {
    raiseEvent('TextSubmitted', args);
  } finally {
    submittingText = false;
  }
  if (args.Handled) return true;

  // WinUI keeps an unmatched editable value as a custom SelectedItem. It is
  // intentionally outside ItemsSource and therefore has SelectedIndex -1.
  SetSelectedItem(text);
  return true;
};

const onEditableLostFocus = () => {
  nextTick(() => {
    if (!isEditing.value || submittingText) return;
    const activeElement = document.activeElement;
    if (backgroundRef.value?.contains(activeElement) || flyoutRef.value?.contains(activeElement)) return;
    commitEditableText();
    endEditing();
  });
};

// All ComboBox events carry the same dependency-property-shaped sender.
const controlSender = {};
Object.defineProperties(controlSender, {
  Element: { get: () => comboRef.value },
  Name: { get: () => attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? '' },
  IsEnabled: { get: () => resolvedIsEnabled.value, set: value => { localIsEnabled.value = boolValue(value); updateXamlBinding(props.IsEnabled, boolValue(value), instance); } },
  Text: {
    get: () => currentText.value,
    set: SetText
  },
  SelectedIndex: {
    get: () => currentSelectedIndex.value,
    set: (value) => SetSelectedIndex(Number(value))
  },
  SelectedItem: {
    get: () => currentSelectedItem.value,
    set: SetSelectedItem
  },
  SelectedValue: {
    get: () => currentSelectedItem.value === undefined ? undefined : GetItemValue(currentSelectedItem.value),
    set: SetSelectedValue
  },
  IsDropDownOpen: {
    get: () => isOpen.value,
    set: (value) => setOpen(boolValue(value))
  },
  Items: { get: () => resolvedItemsSource.value },
  ItemsSource: { get: () => resolvedItemsSource.value },
  SelectionBoxItem: { get: () => currentSelectedItem.value },
  SelectionBoxItemTemplate: { get: () => templateValue(props.ItemTemplate) },
  Focus: { value: () => { focusCombo(); return resolvedIsEnabled.value; } }
});

const SubmitText = () => {
  commitEditableText();
  close();
  endEditing(true);
};

const CancelEditableText = (restoreFocus = true) => {
  if (isEditing.value) {
    SetSelectedItem(editingRestoreItem);
    SetText(editingRestoreText);
  }
  close();
  endEditing(restoreFocus);
};

const MoveSelection = (delta) => {
  if (resolvedItemsSource.value.length === 0) return;
  const nextIndex = Math.min(
    resolvedItemsSource.value.length - 1,
    Math.max(0, currentSelectedIndex.value < 0 ? (delta > 0 ? 0 : resolvedItemsSource.value.length - 1) : currentSelectedIndex.value + delta)
  );
  let enabledIndex = nextIndex;
  while (enabledIndex >= 0 && enabledIndex < resolvedItemsSource.value.length && !IsItemEnabled(resolvedItemsSource.value[enabledIndex])) enabledIndex += delta;
  if (enabledIndex >= 0 && enabledIndex < resolvedItemsSource.value.length) SetSelectedIndex(enabledIndex);
};

const FocusItem = (index, direction = 1) => {
  if (resolvedItemsSource.value.length === 0) return;
  let boundedIndex = Math.min(resolvedItemsSource.value.length - 1, Math.max(0, index));
  while (boundedIndex >= 0 && boundedIndex < resolvedItemsSource.value.length && !IsItemEnabled(resolvedItemsSource.value[boundedIndex])) boundedIndex += direction;
  if (boundedIndex < 0 || boundedIndex >= resolvedItemsSource.value.length) return;
  focusedIndex.value = boundedIndex;
  if (resolveXamlValue(props.SelectionChangedTrigger, instance) === 'Always') SetSelectedIndex(boundedIndex);
  itemRefs.value[boundedIndex]?.focus();
  itemRefs.value[boundedIndex]?.scrollIntoView({ block: 'nearest' });
};

const onButtonKeyDown = (event) => {
  if (!resolvedIsEnabled.value || event.defaultPrevented) return;
  if (ProcessTextSearch(event)) return;
  if (event.key === 'ArrowDown' && !event.altKey && !isOpen.value) {
    event.preventDefault();
    MoveSelection(1);
  } else if (event.key === 'ArrowUp' && !isOpen.value) {
    event.preventDefault();
    MoveSelection(-1);
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    SetSelectedIndex(event.key === 'Home' ? 0 : resolvedItemsSource.value.length - 1);
  } else if (event.key === 'ArrowDown' || event.key === 'F4' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    open();
    nextTick(() => FocusItem(currentSelectedIndex.value < 0 ? 0 : currentSelectedIndex.value));
  }
};

const onEditableDisplayKeyDown = (event) => {
  if (!resolvedIsEnabled.value || event.defaultPrevented) return;
  if (event.key === 'Enter' || event.key === 'F2' || event.key === ' ') {
    event.preventDefault();
    beginEditing();
  } else if (event.key === 'F4' || (event.altKey && event.key === 'ArrowDown')) {
    event.preventDefault();
    open();
    nextTick(() => FocusItem(currentSelectedIndex.value < 0 ? 0 : currentSelectedIndex.value));
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    beginEditing();
    open();
  } else if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
    event.preventDefault();
    beginEditing();
    SetText(event.key);
  }
};

const onEditableKeyDown = (event) => {
  if (event.defaultPrevented || event.isComposing || !resolvedIsEnabled.value) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    SubmitText();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    CancelEditableText();
  } else if (event.key === 'F4' || (event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp'))) {
    event.preventDefault();
    if (isOpen.value) SubmitText(); else open();
  } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !isOpen.value) {
    event.preventDefault();
    open();
  } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && isOpen.value) {
    event.preventDefault();
    const next = Math.max(0, Math.min(resolvedItemsSource.value.length - 1, (focusedIndex.value >= 0 ? focusedIndex.value : currentSelectedIndex.value) + (event.key === 'ArrowDown' ? 1 : -1)));
    focusedIndex.value = next;
    if (next >= 0 && IsItemEnabled(resolvedItemsSource.value[next])) {
      SetText(GetItemLabel(resolvedItemsSource.value[next]));
      if (resolveXamlValue(props.SelectionChangedTrigger, instance) === 'Always') SetSelectedIndex(next);
      itemRefs.value[next]?.scrollIntoView({ block: 'nearest' });
    }
  } else if (event.key === 'Tab') {
    commitEditableText();
    close();
    endEditing();
  }
};

const onFlyoutKeyDown = (event) => {
  const activeIndex = itemRefs.value.indexOf(document.activeElement);
  if (ProcessTextSearch(event)) return;
  if (event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault();
    close();
    nextTick(focusCombo);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    if (resolvedIsEditable.value) CancelEditableText();
    else { if (resolveXamlValue(props.SelectionChangedTrigger, instance) === 'Always') SetSelectedItem(openingSelectedItem); close(); }
    nextTick(focusCombo);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    FocusItem(activeIndex < 0 ? 0 : activeIndex + 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    FocusItem(activeIndex < 0 ? resolvedItemsSource.value.length - 1 : activeIndex - 1, -1);
  } else if (event.key === 'Home') {
    event.preventDefault();
    FocusItem(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    FocusItem(resolvedItemsSource.value.length - 1, -1);
  } else if (event.key === 'PageDown' || event.key === 'PageUp') {
    event.preventDefault();
    const delta = event.key === 'PageDown' ? 1 : -1;
    const page = Math.max(1, Math.floor((flyoutRef.value?.clientHeight ?? 252) / DefaultComboBoxItemHeight));
    FocusItem(Math.max(0, activeIndex) + delta * page, delta);
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (activeIndex >= 0) select(activeIndex);
  } else if (event.key === 'F4' || (event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp'))) {
    event.preventDefault();
    close();
    nextTick(focusCombo);
  } else if (event.key === 'Tab') {
    if (focusedIndex.value >= 0) SetSelectedIndex(focusedIndex.value);
    focusCombo();
    close();
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
};
let openingSelectedItem;
let searchText = '';
let searchTimestamp = 0;
const ProcessTextSearch = event => {
  if (!boolValue(resolveXamlValue(props.IsTextSearchEnabled, instance)) || event.isComposing || event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1 || event.key === ' ' && !searchText) return false;
  const now = Date.now();
  searchText = now - searchTimestamp > 1000 ? event.key : searchText + event.key;
  searchTimestamp = now;
  let index = resolvedItemsSource.value.findIndex(item => IsItemEnabled(item) && GetItemLabel(item).toLocaleLowerCase().startsWith(searchText.toLocaleLowerCase()));
  if (index < 0 && [...searchText].every(key => key.toLocaleLowerCase() === event.key.toLocaleLowerCase())) {
    searchText = event.key;
    const start = isOpen.value ? focusedIndex.value : currentSelectedIndex.value;
    for (let offset = 1; offset <= resolvedItemsSource.value.length; offset += 1) {
      const candidate = (Math.max(-1, start) + offset) % resolvedItemsSource.value.length;
      if (IsItemEnabled(resolvedItemsSource.value[candidate]) && GetItemLabel(resolvedItemsSource.value[candidate]).toLocaleLowerCase().startsWith(searchText.toLocaleLowerCase())) { index = candidate; break; }
    }
  }
  if (index >= 0) { if (isOpen.value) FocusItem(index); else SetSelectedIndex(index); }
  event.preventDefault();
  return true;
};
const onPointerWheelChanged = event => {
  if (!resolvedIsEnabled.value || isOpen.value || document.activeElement !== backgroundRef.value || event.deltaY === 0) return;
  event.preventDefault();
  MoveSelection(event.deltaY > 0 ? 1 : -1);
};

const setItemRef = (element, index) => {
  itemRefs.value[index] = element;
};

const onPointerDown = (event) => {
  lastInputDeviceType = event.pointerType === 'touch' ? 'Touch' : 'Mouse';
};

const onInputKeyDown = (event) => {
  lastInputDeviceType = 'Keyboard';
  // Handle the embedded TextBox's native keys at the ComboBox boundary;
  // TextBox's multi-root template cannot inherit a DOM key listener.
  if (isEditing.value && event.target instanceof Element && event.target.closest('.win-textbox')) {
    onEditableKeyDown(event);
  } else if (event.key === 'Escape' && (isOpen.value || isEditing.value)) {
    event.preventDefault();
    if (resolvedIsEditable.value) CancelEditableText();
    else { if (resolveXamlValue(props.SelectionChangedTrigger, instance) === 'Always') SetSelectedItem(openingSelectedItem); close(); nextTick(focusCombo); }
  }
};

const onDocumentPointerDown = (event) => {
  const isInsideComboBox = comboRef.value?.contains(event.target);
  const isInsideFlyout = flyoutRef.value?.contains(event.target)
    || (isOpen.value && event.target instanceof Element && event.target.closest('.win-combo-flyout-hit-overlay'));

  if (isEditing.value && !isInsideComboBox && !isInsideFlyout && !submittingText) {
    commitEditableText();
    endEditing();
  }
  if (!isOpen.value || isInsideComboBox || isInsideFlyout) return;
  close();
};

watch(
  GetSelectionProperties,
  (values) => {
    if (HaveSelectionPropertiesChanged(values)) SyncSelectionFromProperties();
  },
  { immediate: true }
);

watch(
  () => resolvedItemsSource.value.slice(),
  (items, oldItems) => {
    // A collection update and a TwoWay selection request can arrive in either
    // order within the same tick. Apply the latest request before an old item
    // removal can write an empty selection back over it. Retry only unresolved
    // property requests, never a literal initial value after user selection.
    if (HaveSelectionPropertiesChanged(GetSelectionProperties()) || pendingSelectionFromProperties) SyncSelectionFromProperties();
    if (pendingSelectionFromProperties) {
      if (isOpen.value) nextTick(schedulePositionFlyout);
      return;
    }
    const selectedItem = currentSelectedItem.value;
    if (selectedItem !== undefined) {
      const index = items.findIndex((item) => Object.is(item, selectedItem));
      if (index < 0) {
        // Resource localization updates an inline x:String's content in the
        // same logical item position. Preserve the chosen item through its
        // XAML UID/key rather than treating the new label as a removed item.
        const oldIndex = oldItems?.findIndex((item) => Object.is(item, selectedItem));
        const inlineKey = isUsingInlineItems ? [...previousInlineStringKeys].find(([, itemIndex]) => itemIndex === oldIndex)?.[0] : undefined;
        const updatedIndex = inlineKey === undefined ? undefined : inlineStringKeys.get(inlineKey);
        if (updatedIndex !== undefined && items[updatedIndex] !== undefined) {
          SetCurrentSelection(updatedIndex, items[updatedIndex], resolvedText.value === undefined);
          RaiseSelectionChanged(selectedItem, items[updatedIndex], updatedIndex);
        } else if (!isCustomSelection) {
          SetCurrentSelection(-1, undefined, resolvedText.value === undefined);
          RaiseSelectionChanged(selectedItem, undefined, -1);
        }
      } else {
        const indexChanged = index !== currentSelectedIndex.value;
        SetCurrentSelection(index, selectedItem, resolvedText.value === undefined);
        if (indexChanged) {
          updateXamlBinding(props.SelectedIndex, index, instance);
        }
      }
    }
    if (isOpen.value) nextTick(schedulePositionFlyout);
  }
);

watch(resolvedText, (value) => {
  if (value !== undefined) currentText.value = String(value);
});

watch(resolvedIsDropDownOpen, (value) => {
  if (value !== undefined) setOpen(value);
});

watch(resolvedIsEnabled, (value) => {
  if (!value) {
    endEditing();
    close();
  }
});

watch(resolvedIsEditable, (value) => {
  if (!value) endEditing();
});

onMounted(() => {
  AnimatedGlyphInput.Attach(comboRef.value);
  resizeObserver = new ResizeObserver(schedulePositionFlyout);
  if (backgroundRef.value) resizeObserver.observe(backgroundRef.value);
  ObserveAnchorTheme();
  window.addEventListener('resize', schedulePositionFlyout);
  window.addEventListener('scroll', onWindowScroll, true);
  document.addEventListener('pointerdown', onDocumentPointerDown);
  nextTick(() => {
    // Vue's case-insensitive emit diagnostic mistakes official Loaded for
    // an in-DOM listener. Dispatch the canonical handler without lowercasing.
    raiseEvent('Loaded');
  });
});

watch(resolvedIsEnabled, AnimatedGlyphInput.Refresh, { flush: 'post' });

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  themeObserver?.disconnect();
  flyoutAnimation.cancel();
  cancelOpacityAnimations();
  window.removeEventListener('resize', schedulePositionFlyout);
  window.removeEventListener('scroll', onWindowScroll, true);
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  if (positionFrame) window.cancelAnimationFrame(positionFrame);
});

provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), props, ComboBoxScrollSettings, SelectionBoxPadding, SelectionBoxOpacity, currentText, resolvedIsEnabled, resolvedPlaceholderText, resolvedHeader, resolvedHeaderTemplate, resolvedDescription, onEditableTextChanged, onEditableLostFocus });
defineExpose(controlSender);

</script>

<style>
.win-combo-box {
  --combo-selection-padding: var(--ComboBoxPadding, 5px 0 7px 12px);
  position: relative;
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto minmax(var(--ComboBoxMinHeight, 32px), 1fr) auto;
  box-sizing: border-box;
  max-width: 100%;
  min-width: 64px;
  vertical-align: top;
  color: var(--text-primary);
  font-family: var(--ContentControlThemeFontFamily, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif);
  font-size: var(--ControlContentThemeFontSize, 14px);
}

.win-combo-header {
  grid-row: 1;
  display: block;
  color: var(--ComboBoxHeaderForeground);
  font-size: 14px;
  line-height: 20px;
}
.win-combo-description { grid-row: 3; color: var(--SystemControlDescriptionTextForegroundBrush, var(--text-secondary)); font-size: 12px; line-height: 16px; }

.win-combo-btn {
  grid-row: 2;
  grid-column: 1;
  position: relative;
  appearance: none;
  box-sizing: border-box;
  width: 100%;
  min-width: var(--ComboBoxThemeMinWidth, 64px);
  min-height: var(--ComboBoxMinHeight, 32px);
  height: auto;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px;
  gap: 0;
  align-items: stretch;
  text-align: left;
  font: inherit;
  color: var(--ComboBoxForeground, var(--text-primary));
  background: transparent;
  border: 0;
  border-radius: var(--ComboBoxCornerRadius, 4px);
  cursor: pointer;
  user-select: none;
  outline: none;
  transition: none;
  --ComboBoxBorderCurrent: var(--ComboBoxBorderBrush);
  --ComboBoxBackgroundCurrent: var(--ComboBoxBackground);
  --ComboBoxPlaceholderCurrent: var(--ComboBoxPlaceHolderForeground);
}
.win-combo-background { position: absolute; inset: 0; border: var(--ComboBoxBorderThemeThickness, 1px) solid transparent; border-radius: inherit; background: var(--ComboBoxBackgroundCurrent); background-clip: padding-box; pointer-events: none; }
.win-combo-btn::after { content: ''; position: absolute; inset: 0; padding: var(--ComboBoxBorderThemeThickness, 1px); border-radius: inherit; background: var(--ComboBoxBorderCurrent); pointer-events: none; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; }

.win-combo-btn:hover {
  --ComboBoxBorderCurrent: var(--ComboBoxBorderBrushPointerOver);
  --ComboBoxPlaceholderCurrent: var(--ComboBoxPlaceHolderForegroundPointerOver);
  --ComboBoxBackgroundCurrent: var(--ComboBoxBackgroundPointerOver);
  color: var(--ComboBoxForegroundPointerOver, var(--text-primary));
}

.win-combo-btn:active {
  --ComboBoxBorderCurrent: var(--ComboBoxBorderBrushPressed);
  --ComboBoxPlaceholderCurrent: var(--ComboBoxPlaceHolderForegroundPressed);
  --ComboBoxBackgroundCurrent: var(--ComboBoxBackgroundPressed);
  color: var(--ComboBoxForegroundPressed, var(--text-secondary));
}

.win-combo-btn:disabled {
  --ComboBoxBorderCurrent: var(--ComboBoxBorderBrushDisabled);
  --ComboBoxPlaceholderCurrent: var(--ComboBoxPlaceHolderForegroundDisabled);
  --ComboBoxBackgroundCurrent: var(--ComboBoxBackgroundDisabled);
  color: var(--ComboBoxForegroundDisabled, var(--text-disabled));
  pointer-events: none;
}

/* HighlightBackground belongs to the background row, not the header. An
   absolutely positioned visual keeps all focus transitions out of measure. */
.win-combo-btn::before {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid var(--ComboBoxBackgroundBorderBrushFocused, var(--FocusStrokeColorOuterBrush, var(--text-primary)));
  border-radius: var(--ComboBoxHiglightBorderCornerRadius, 7px);
  opacity: 0;
  pointer-events: none;
}

.win-combo-btn:focus-visible::before {
  opacity: 1;
}

.win-combo-box.is-drop-down-open .win-combo-btn::before {
  opacity: 0;
}
.win-combo-focus-pill { position: absolute; top: 50%; left: 1px; width: 3px; height: 16px; border-radius: 1.5px; background: var(--ComboBoxItemPillFillBrush); transform: translateY(-50%); opacity: 0; pointer-events: none; }
.win-combo-btn:focus-visible .win-combo-focus-pill { opacity: 1; }
.win-combo-box.is-drop-down-open .win-combo-focus-pill { opacity: 0; }

.win-combo-btn:active .win-combo-content.is-placeholder {
  color: var(--ComboBoxPlaceHolderForegroundPressed, var(--text-tertiary));
}

.win-combo-content {
  grid-row: 1;
  grid-column: 1;
  min-width: 0;
  position: relative;
  padding: 0;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.win-combo-content.is-placeholder {
  color: var(--ComboBoxPlaceholderCurrent);
}
.win-combo-placeholder { color: inherit; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.win-combo-content > * { min-width: 0; max-width: 100%; }

.win-combo-editable {
  grid-row: 2;
  grid-column: 1;
  width: 100%;
  min-width: var(--ComboBoxThemeMinWidth, 64px);
  height: auto;
  min-height: var(--ComboBoxMinHeight, 32px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px;
  align-items: stretch;
  box-sizing: border-box;
  overflow: hidden;
}

.win-combo-edit-display {
  grid-row: 1;
  grid-column: 1 / -1;
}

.win-combo-textbox {
  grid-row: 1;
  grid-column: 1 / -1;
  width: 100%;
  min-width: 0;
  height: var(--ComboBoxMinHeight, 32px);
  min-height: var(--ComboBoxMinHeight, 32px);
}
.win-combo-textbox .win-textbox-header { display: none; }

.win-combo-textbox .win-textbox-border {
  height: var(--ComboBoxMinHeight, 32px);
  min-height: var(--ComboBoxMinHeight, 32px);
}

.win-combo-textbox .win-textbox-content {
  height: calc(var(--ComboBoxMinHeight, 32px) - 2px);
  min-height: calc(var(--ComboBoxMinHeight, 32px) - 2px);
}

.win-combo-textbox .win-textbox-field {
  height: calc(var(--ComboBoxMinHeight, 32px) - 2px);
  min-height: 0;
  padding: var(--ComboBoxEditableTextPadding, 5px 38px 6px 11px);
  line-height: 19px;
}

.win-combo-drop-down-button {
  grid-row: 1;
  grid-column: 2;
  z-index: 1;
  appearance: none;
  width: 30px;
  min-width: 30px;
  height: auto;
  min-height: 0;
  margin: 4px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: 4px;
}

.win-combo-drop-down-button:hover {
  background: var(--ComboBoxDropDownBackgroundPointerOver);
}

.win-combo-drop-down-button:active {
  background: var(--ComboBoxDropDownBackgroundPointerPressed);
}
.win-combo-textbox:focus-within ~ .win-combo-drop-down-button:active { background: var(--ComboBoxFocusedDropDownBackgroundPointerPressed); }

.win-combo-chevron {
  grid-row: 1;
  grid-column: 2;
  z-index: 2;
  width: 12px;
  height: 12px;
  margin: 0 14px 0 0;
  place-self: center end;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: var(--text-secondary);
  font-size: 0;
  line-height: 12px;
}

.win-combo-box.is-disabled {
  --ComboBoxHeaderForeground: var(--ComboBoxHeaderForegroundDisabled);
  color: var(--text-disabled);
}

.win-combo-box.is-disabled .win-combo-header,
.win-combo-box.is-disabled .win-combo-btn,
.win-combo-box.is-disabled .win-combo-chevron {
  color: var(--ComboBoxForegroundDisabled);
}
.win-combo-box.is-disabled .win-combo-header { color: var(--ComboBoxHeaderForegroundDisabled); }

.win-combo-box.is-disabled .win-combo-content.is-placeholder {
  color: var(--ComboBoxPlaceHolderForegroundDisabled, var(--text-disabled));
}

.win-combo-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;
}
.win-combo-overlay.is-visible { background: var(--ComboBoxLightDismissOverlayBackground, rgba(0, 0, 0, 0.2)); pointer-events: auto; }

.win-combo-flyout {
  position: fixed;
  z-index: 10001;
  width: max-content;
  min-width: 80px;
  box-sizing: border-box;
  overflow: visible;
  color: var(--ComboBoxDropDownForeground, var(--text-primary));
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--ComboBoxDropDownBorderBrush, var(--stroke-surface-flyout));
  border-radius: var(--OverlayCornerRadius, 8px);
}
.win-combo-flyout-hit-root { height: 100%; max-height: inherit; overflow: hidden; border-radius: inherit; }
.win-combo-flyout.is-closing { pointer-events: none; }

/* The reveal clip belongs to the presenter for visual fidelity. During that
   short interval this sibling keeps the already-visible options hit-testable
   when the pointer was positioned over the popup before it finished opening. */
.win-combo-flyout-hit-overlay {
  position: fixed;
  z-index: 10002;
  box-sizing: border-box;
  pointer-events: auto;
  background: transparent;
}

.win-combo-flyout.edge-square-top {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.win-combo-flyout.edge-square-bottom {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.win-combo-scroll-viewer {
  width: 100%;
  height: 100%;
  max-height: inherit;
}

.win-combo-scroll-viewer .win-scroll-viewer-viewport {
  max-height: inherit;
}

.win-combo-scroll-viewer .scroll-content {
  min-width: 100%;
}

.win-combo-items-presenter {
  width: 100%;
  box-sizing: border-box;
  padding: 4px 0;
}

.win-combo-flyout.touch-input .win-combo-items-presenter {
  padding-top: 0;
  padding-bottom: 0;
}

.win-combo-item {
  appearance: none;
  position: relative;
  width: 100%;
  min-width: max-content;
  margin: 0;
  padding: 0;
  display: flex;
  box-sizing: border-box;
  color: var(--ComboBoxItemForeground);
  background: transparent;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
  font: inherit;
  line-height: 20px;
  text-align: left;
  white-space: nowrap;
}

.win-combo-item-layout {
  position: relative;
  width: calc(100% - 10px);
  min-height: 32px;
  margin: 2px 5px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  box-sizing: border-box;
  border-radius: 3px;
  background: var(--ComboBoxItemBackground);
}

.win-combo-item-content {
  min-width: 0;
  padding: 0;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}

.win-combo-flyout.touch-input .win-combo-item-layout {
  min-height: 44px;
}

.win-combo-flyout.touch-input { --ComboBoxItemThemePadding: 11px 11px 13px 11px; }

.win-combo-item:hover .win-combo-item-layout {
  color: var(--ComboBoxItemForegroundPointerOver);
  background: var(--ComboBoxItemBackgroundPointerOver);
}

.win-combo-item.hovered .win-combo-item-layout {
  color: var(--ComboBoxItemForegroundPointerOver);
  background: var(--ComboBoxItemBackgroundPointerOver);
}

.win-combo-item:active .win-combo-item-layout {
  color: var(--ComboBoxItemForegroundPressed);
  background: var(--ComboBoxItemBackgroundPressed);
}

.win-combo-item.selected .win-combo-item-layout {
  color: var(--ComboBoxItemForegroundSelected);
  background: var(--ComboBoxItemBackgroundSelected);
}

.win-combo-item.selected:hover .win-combo-item-layout {
  color: var(--ComboBoxItemForegroundSelectedPointerOver);
  background: var(--ComboBoxItemBackgroundSelectedPointerOver);
}
.win-combo-item.selected:active .win-combo-item-layout { color: var(--ComboBoxItemForegroundSelectedPressed); background: var(--ComboBoxItemBackgroundSelectedPressed); }
.win-combo-item.is-disabled .win-combo-item-layout { color: var(--ComboBoxItemForegroundDisabled); background: var(--ComboBoxItemBackgroundDisabled); }
.win-combo-item.is-disabled.selected .win-combo-item-layout { color: var(--ComboBoxItemForegroundSelectedDisabled); background: var(--ComboBoxItemBackgroundSelectedDisabled); }

.win-combo-item:focus-visible {
  outline: 2px solid var(--text-primary);
  outline-offset: -2px;
}

.win-combo-item-pill {
  position: absolute;
  left: 1px;
  top: 50%;
  width: 3px;
  height: 16px;
  border-radius: 1.5px;
  background: var(--ComboBoxItemPillFillBrush);
  transform: translateY(-50%);
  transition: transform 167ms cubic-bezier(0, 0, 0, 1);
}

.win-combo-item.selected:active .win-combo-item-pill {
  transform: translateY(-50%) scaleY(0.625);
}

</style>
