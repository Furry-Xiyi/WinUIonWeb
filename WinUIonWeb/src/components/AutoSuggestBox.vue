<template>
  <!-- 对应官方 Microsoft.UI.Xaml.Controls.AutoSuggestBox（ref/microsoft-ui-xaml-main/controls/dev/AutoSuggestBox） -->
  <div
    ref="rootRef"
    class="win-auto-suggest-box"
    :class="{ 'is-suggestion-open-down': isOpen && openDirection === 'down', 'is-suggestion-open-up': isOpen && openDirection === 'up' }"
    :style="rootStyle">
    <div v-if="resolvedHeader || propertyNodes.Header.length" class="win-asb-header">
      <HeaderOutlet />
    </div>
    <div ref="anchorRef" class="win-asb-anchor">
      <TextBoxTemplate>
      <TextBox
        class="win-asb-textbox"
        Background="{x:Bind TextBoxBackground, Mode=OneWay}"
        Text="{x:Bind AutoSuggestText, Mode=OneWay}"
        PlaceholderText="{x:Bind AutoSuggestPlaceholder, Mode=OneWay}"
        IsEnabled="{x:Bind AutoSuggestEnabled, Mode=OneWay}"
        DesiredCandidateWindowAlignment="{x:Bind AutoSuggestCandidateAlignment, Mode=OneWay}"
        TextChanged="OnTextBoxTextChanged"
        GotFocus="OnTextBoxGotFocus"
        LostFocus="OnTextBoxLostFocus"
        TextCompositionStarted="OnTextCompositionStarted"
        TextCompositionEnded="OnTextCompositionEnded" />
      </TextBoxTemplate>
    </div>
    <div v-if="resolvedDescription || propertyNodes.Description.length" class="win-asb-description">
      <DescriptionOutlet />
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen && suggestionItems.length"
        ref="popupRef"
        class="win-asb-popup win-theme-scope"
        :class="[openDirection === 'up' ? 'opens-up' : 'opens-down', popupThemeClass]"
        :style="[popupStyle, suggestionsBackgroundStyle]"
        v-acrylic-brush="suggestionsBackgroundStyle"
        v-theme-shadow="{ Translation: 32 }"
        :id="popupId"
        @pointerdown.prevent
        role="listbox">
        <ScrollViewer
          class="win-asb-popup-scroll"
          VerticalScrollMode="Auto"
          VerticalScrollBarVisibility="Auto"
          HorizontalScrollMode="Disabled"
          HorizontalScrollBarVisibility="Disabled">
            <div class="win-asb-results">
              <button
                v-for="(item, index) in suggestionItems"
                :key="`${getItemText(item)}-${index}`"
                class="win-asb-item"
                :class="{ 'is-highlighted': highlightedIndex === index, 'is-disabled': isNoResultsItem(item) }"
                type="button"
                role="option"
                :id="`${popupId}-${index}`"
                tabindex="-1"
                :disabled="isNoResultsItem(item)"
                :aria-selected="highlightedIndex === index"
                @click="onSuggestionClick(index)">
                <ItemRenderer v-if="hasItemTemplate" :Item="item" :Index="index" />
                <span v-else class="win-asb-item-title">{{ getItemLabel(item) }}</span>
              </button>
            </div>
        </ScrollViewer>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CollectionItemTemplate, CollectionItemTemplateSelector, CollectionResources } from './CollectionProperties'

const property = (name: string) => defineComponent({ name: `AutoSuggestBox.${name}`, __autoSuggestBoxProperty: name, setup() { return () => null } })
export const AutoSuggestBoxQueryIcon = property('QueryIcon')
export const AutoSuggestBoxHeader = property('Header')
export const AutoSuggestBoxDescription = property('Description')
export const AutoSuggestBoxHeaderTemplate = property('HeaderTemplate')
export const AutoSuggestBoxItemTemplate = CollectionItemTemplate
export const AutoSuggestBoxItemTemplateSelector = CollectionItemTemplateSelector
export const AutoSuggestBoxResources = CollectionResources
export default { QueryIcon: AutoSuggestBoxQueryIcon, Header: AutoSuggestBoxHeader, Description: AutoSuggestBoxDescription,
  HeaderTemplate: AutoSuggestBoxHeaderTemplate, ItemTemplate: AutoSuggestBoxItemTemplate,
  ItemTemplateSelector: AutoSuggestBoxItemTemplateSelector, Resources: AutoSuggestBoxResources }
</script>

<script setup lang="ts">
import { computed, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, proxyRefs, ref, useAttrs, useSlots, watch, watchPostEffect } from 'vue';
import { useI18n } from './i18n/index';
import type { ComputedRef, CSSProperties, VNode } from 'vue';
import ScrollViewer from './ScrollViewer.vue';
import TextBox from './TextBox.vue';
import FontIcon from './FontIcon.vue';
import ContentPresenter from './ContentPresenter.vue';
import { useAnimatedIconInput } from './animatedIconInput';
import { useFlyoutAnimation } from './useFlyoutAnimation';
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlItemContextKey, xamlScopeKey, xamlTemplateComponent } from './xamlRuntime';
import { textInputTemplateKey } from './textInputTemplate';
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties';
import { xamlResourceDictionaryKey } from './Page.vue';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBrush } from './acrylicBrushVisual';
import { vThemeShadow } from './themeShadowVisual';
import { boolValue, cssLength } from './layout';
import { collectXamlResources } from './xamlBrushResources';

const { t } = useI18n();

type Suggestion = string | number | Record<string, unknown>;
type TextChangedReason = 'UserInput' | 'ProgrammaticChange' | 'SuggestionChosen';

const props = withDefaults(defineProps<{
  Text?: string;
  PlaceholderText?: string;
  Header?: unknown;
  HeaderTemplate?: unknown;
  Description?: string;
  QueryIcon?: string | VNode;
  ItemsSource?: Suggestion[] | string;
  ItemTemplate?: unknown;
  ItemTemplateSelector?: unknown;
  DisplayMemberPath?: string;
  TextMemberPath?: string;
  UpdateTextOnSelect?: boolean | string;
  IsSuggestionListOpen?: boolean | string;
  MaxSuggestionListHeight?: number | string;
  AutoMaximizeSuggestionArea?: boolean | string;
  DesiredCandidateWindowAlignment?: string;
  LightDismissOverlayMode?: string;
  TextBoxStyle?: unknown | null;
  KeepInteriorCornersSquare?: boolean | string;
  IsEnabled?: boolean | string;
  Width?: number | string;
}>(), {
  Text: '',
  PlaceholderText: '',
  Header: () => '',
  HeaderTemplate: undefined,
  Description: '',
  QueryIcon: '',
  ItemsSource: () => [],
  ItemTemplate: undefined,
  ItemTemplateSelector: undefined,
  DisplayMemberPath: '',
  TextMemberPath: '',
  UpdateTextOnSelect: true,
  IsSuggestionListOpen: false,
  MaxSuggestionListHeight: 300,
  AutoMaximizeSuggestionArea: false,
  DesiredCandidateWindowAlignment: 'BottomEdge',
  LightDismissOverlayMode: 'Auto',
  TextBoxStyle: undefined,
  KeepInteriorCornersSquare: false,
  IsEnabled: true,
  Width: ''
});
const instance = getCurrentInstance();
const attrs = useAttrs();
const isEnabled = computed(() => boolValue(resolveXamlValue(props.IsEnabled, instance)));
const resolvedPlaceholder = computed(() => resolveXamlValue(props.PlaceholderText, instance));
const dispatchXamlEvent = (name: string, args: unknown) => {
  resolveXamlHandler(attrs[name], instance)?.(api, args);
};
const inheritedResources = inject<Record<string, unknown>>(xamlResourceDictionaryKey, {});
const TextBoxBackground = computed(() => {
  const style = resolveXamlValue(props.TextBoxStyle, instance);
  const key = typeof props.TextBoxStyle === 'string' ? props.TextBoxStyle.match(/^\{StaticResource\s+([^}]+)\}$/)?.[1] : undefined;
  const declaration = key ? resources[key] : style;
  if (declaration && typeof declaration === 'object' && 'type' in declaration) {
    const setter = getVNodeChildren(declaration as VNode).find(node => node.props?.Property === 'Background');
    return setter ? resolveXamlValue(setter.props?.Value, instance) : undefined;
  }
  if (style && typeof style === 'object' && 'Background' in style) return style.Background;
  return undefined;
});
const suggestionsBackgroundStyle = useAcrylicBrushStyle('{ThemeResource AutoSuggestBoxSuggestionsListBackground}', instance);
const slots = useSlots();
const propertyNodes = computed(() => {
  const result: Record<string, VNode[]> = { Header: [], Description: [], HeaderTemplate: [], QueryIcon: [], itemTemplate: [], itemTemplateSelector: [], resources: [] };
  const visit = (nodes: VNode[]) => { for (const node of nodes) {
    if (node.type === Fragment) { visit(getVNodeChildren(node)); continue; }
    const type = node.type as { __autoSuggestBoxProperty?: string } | string;
    const propertyName = typeof type === 'string' ? type.match(/^AutoSuggestBox\.(Header|Description|HeaderTemplate|QueryIcon)$/)?.[1] : type?.__autoSuggestBoxProperty;
    const name = propertyName ?? getCollectionProperty(node);
    if (name && name in result) result[name].push(...getVNodeChildren(node));
  } };
  visit(slots.default?.() ?? []);
  return result;
});
const localResources = computed(() => {
  const dictionary: Record<string, VNode> = {};
  const visit = (nodes: VNode[]) => { for (const node of nodes) {
    const typeName = typeof node.type === 'string' ? node.type : (node.type as { name?: string }).name;
    if (node.type === Fragment || typeName === 'ResourceDictionary') visit(getVNodeChildren(node));
    else collectXamlResources([node], dictionary);
  } };
  visit(propertyNodes.value.resources);
  return dictionary;
});
const resources = new Proxy(inheritedResources, { get: (source, key: string) => localResources.value[key] ?? source[key] });
provide(xamlResourceDictionaryKey, resources);
const templateValue = (source: unknown) => {
  const key = typeof source === 'string' ? source.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] : undefined;
  return key && resources[key] ? resources[key] : resolveXamlValue(source, instance);
};
const templateNodes = (value: unknown): VNode[] => isVNode(value)
  ? getVNodeChildren(value).length ? getVNodeChildren(value) : [value] : Array.isArray(value) ? value : [];
const propertyOverrides = ref<Record<string, unknown>>({});
const propertyValue = (name: 'ItemTemplate' | 'ItemTemplateSelector' | 'Header' | 'Description' | 'HeaderTemplate' | 'DisplayMemberPath') => name in propertyOverrides.value ? propertyOverrides.value[name] : props[name];
const resolvedItemTemplate = computed(() => propertyNodes.value.itemTemplate.length ? propertyNodes.value.itemTemplate : templateValue(propertyValue('ItemTemplate')));
const resolvedHeaderTemplate = computed(() => propertyNodes.value.HeaderTemplate.length ? propertyNodes.value.HeaderTemplate : templateValue(propertyValue('HeaderTemplate')));
const hasItemTemplate = computed(() => Boolean(resolvedItemTemplate.value) || Boolean(propertyValue('ItemTemplateSelector')) || propertyNodes.value.itemTemplateSelector.length > 0);
const selectedItemTemplate = (item: Suggestion) => {
  const selector = templateValue(propertyValue('ItemTemplateSelector')) ?? propertyNodes.value.itemTemplateSelector[0];
  if (selector && typeof selector === 'object') {
    const typed = selector as { SelectTemplate?: (item: Suggestion, owner: unknown) => unknown; SelectTemplateCore?: (item: Suggestion, owner: unknown) => unknown };
    const select = typed.SelectTemplate ?? typed.SelectTemplateCore;
    if (select) return templateValue(select.call(selector, item, api));
  }
  return resolvedItemTemplate.value;
};
const ItemRenderer = defineComponent({
  name: 'AutoSuggestBoxItemTemplate', props: { Item: { type: null }, Index: { type: Number, default: 0 } },
  setup(itemProps) {
    provide(xamlItemContextKey, computed(() => itemProps.Item));
    provide(textInputTemplateKey, {});
    return () => {
      const template = selectedItemTemplate(itemProps.Item as Suggestion);
      return typeof template === 'function' ? template(itemProps.Item)
        : xamlTemplateComponent(templateNodes(template), itemProps.Item, instance);
    };
  }
});
const HeaderOutlet = defineComponent({ setup() {
  provide(textInputTemplateKey, {});
  return () => propertyNodes.value.Header.length ? h(Fragment, normalizeXamlNodes(propertyNodes.value.Header, instance))
    : Array.isArray(resolvedHeaderTemplate.value) ? xamlTemplateComponent(resolvedHeaderTemplate.value, resolvedHeader.value, instance)
      : h(ContentPresenter, { Content: resolvedHeader.value, ContentTemplate: resolvedHeaderTemplate.value });
} });
const DescriptionOutlet = defineComponent({ setup() { return () => propertyNodes.value.Description.length
  ? h(Fragment, normalizeXamlNodes(propertyNodes.value.Description, instance)) : String(resolvedDescription.value ?? ''); } });
const queryIconNodes = computed(() => {
  if (propertyNodes.value.QueryIcon.length) return propertyNodes.value.QueryIcon;
  const value = resolveXamlValue(props.QueryIcon, instance);
  return isVNode(value) ? [value] : [];
});
const hasQueryIcon = computed(() => queryIconNodes.value.length > 0 || Boolean(resolveXamlValue(props.QueryIcon, instance)));
const QueryIconOutlet = defineComponent({
  setup() { return () => h(Fragment, normalizeXamlNodes(queryIconNodes.value, instance)); }
});
const TextBoxTemplate = defineComponent({
  setup(_, { slots: templateSlots }) {
    const templateInstance = getCurrentInstance();
    return () => h(Fragment, normalizeXamlNodes(templateSlots.default?.() ?? [], templateInstance));
  }
});
const AnimatedQueryInput = useAnimatedIconInput();
watch(() => props.IsEnabled, AnimatedQueryInput.Refresh, { flush: 'post' });
const resolvedHeader = computed(() => resolveXamlValue(propertyValue('Header'), instance));
const resolvedDescription = computed(() => resolveXamlValue(propertyValue('Description'), instance));

const emit = defineEmits<{
  'update:Text': [value: string];
  'update:IsSuggestionListOpen': [value: boolean];
  TextChanged: [sender: unknown, args: { Reason: TextChangedReason }];
  SuggestionChosen: [sender: unknown, args: { SelectedItem: Suggestion }];
  QuerySubmitted: [sender: unknown, args: { QueryText: string; ChosenSuggestion: Suggestion | null }];
}>();

const rootRef = ref<HTMLElement | null>(null);
const anchorRef = ref<HTMLElement | null>(null);
const popupRef = ref<HTMLElement | null>(null);
const localText = ref(String(resolveXamlValue(props.Text, instance) ?? ''));
const localOpen = ref(boolValue(resolveXamlValue(props.IsSuggestionListOpen, instance)));
const isTextBoxFocused = ref(false);
const shouldOpenForUserInput = ref(false);
const highlightedIndex = ref(-1);
const originalQuery = ref(localText.value);
const popupId = `autosuggestbox-${instance?.uid ?? 0}-suggestions`;
const popupStyle = ref<CSSProperties & Record<string, string>>({});
const openDirection = ref<'up' | 'down'>('down');
const isComposing = ref(false);
const flyoutAnimation = useFlyoutAnimation(popupRef, {
  Origin: 'edge',
  Direction: () => (openDirection.value === 'up' ? 'bottom' : 'top'),
  StripSize: 32
});
const inheritedTheme = inject<ComputedRef<'light' | 'dark'> | null>('winuiTheme', null);
const anchorTheme = ref<'light' | 'dark' | ''>('');

const isOpen = computed(() => localOpen.value && isEnabled.value);
const sourceItems = computed<Suggestion[]>(() => {
  const source = resolveXamlValue(props.ItemsSource, instance);
  return Array.isArray(source) ? source : [];
});
const localItems = ref<Suggestion[]>();
const suggestionItems = computed(() => localItems.value ?? sourceItems.value);
watch(sourceItems, () => { localItems.value = undefined; });
const currentText = computed(() => localText.value);
const resolvedQueryIcon = computed(() => props.QueryIcon === 'Find' ? '\uE721' : props.QueryIcon);
provide(xamlScopeKey, {
  AutoSuggestQueryIconGlyph: resolvedQueryIcon, TextBoxBackground,
  AutoSuggestText: currentText,
  AutoSuggestPlaceholder: resolvedPlaceholder, AutoSuggestEnabled: isEnabled,
  AutoSuggestCandidateAlignment: computed(() => props.DesiredCandidateWindowAlignment),
  OnTextBoxTextChanged: (sender: { Text: string }) => onTextInput(sender.Text),
  OnTextBoxGotFocus: () => onFocus(), OnTextBoxLostFocus: () => onBlur(),
  OnTextCompositionStarted: () => onCompositionStart(), OnTextCompositionEnded: () => onCompositionEnd()
});
provide(textInputTemplateKey, {
  KeyDown: event => onKeydown(event),
  Actions: () => hasQueryIcon.value ? h('button', {
    ref: AnimatedQueryInput.Attach, class: 'win-textbox-action-button win-textbox-action-query win-asb-query-button',
    type: 'button', disabled: !isEnabled.value, 'aria-label': t('text.submit-query'),
    'ToolTipService.ToolTip': t('text.submit-query'),
    onPointerenter: AnimatedQueryInput.PointerEntered, onPointerleave: AnimatedQueryInput.PointerExited,
    onPointerdown: (event: PointerEvent) => { event.preventDefault(); AnimatedQueryInput.PointerPressed(event); },
    onPointerup: AnimatedQueryInput.PointerReleased, onPointercancel: AnimatedQueryInput.PointerExited,
    onLostpointercapture: AnimatedQueryInput.PointerReleased, onKeydown: AnimatedQueryInput.KeyDown,
    onKeyup: AnimatedQueryInput.KeyUp, onBlur: AnimatedQueryInput.LostFocus, onClick: () => submitQuery()
  }, h('span', { class: 'win-asb-query-content' }, queryIconNodes.value.length ? h(QueryIconOutlet) : h(FontIcon, { class: 'win-asb-icon', Glyph: String(resolvedQueryIcon.value ?? ''), FontSize: 12 }))) : null
});
const localizedNoResultsText = computed(() => t('text.no-results-found'));
const popupThemeClass = computed(() => {
  const theme = inheritedTheme?.value || anchorTheme.value;
  return theme === 'light' || theme === 'dark' ? `theme-${theme}` : '';
});
const rootStyle = computed<CSSProperties & Record<string, string | undefined>>(() => ({
  width: cssLength(resolveXamlValue(props.Width, instance)),
  '--asb-input-bottom-radius': isOpen.value && openDirection.value === 'down' ? '0' : '4px'
}));

const getItemText = (item: Suggestion) => {
  if (item && typeof item === 'object') {
    const key = String(resolveXamlValue(props.TextMemberPath, instance) ?? '');
    return String((key ? item[key] : undefined) ?? item.Title ?? item.title ?? item.text ?? item.name ?? '');
  }
  return String(item ?? '');
};
const getItemLabel = (item: Suggestion) => {
  const path = String(resolveXamlValue(propertyValue('DisplayMemberPath'), instance) ?? '');
  if (!path) return getItemText(item);
  const value = path.split('.').reduce<unknown>((current, property) => current && typeof current === 'object' ? (current as Record<string, unknown>)[property] : undefined, item);
  return String(value ?? '');
};


const isNoResultsItem = (item: Suggestion) => {
  if (item && typeof item === 'object' && item.noResults === true) return true;
  const text = getItemText(item).trim();
  return text.toLowerCase() === 'no results found'
    || text === localizedNoResultsText.value.trim();
};

const selectableIndexes = computed(() => suggestionItems.value
  .map((item, index) => isNoResultsItem(item) ? -1 : index)
  .filter((index) => index >= 0));

const setOpen = async (value: boolean) => {
  const wasOpen = localOpen.value;
  const nextOpen = value && suggestionItems.value.length > 0;
  if (nextOpen) {
    if (!wasOpen) highlightedIndex.value = -1;
    // 打开前先按当前锚点尺寸定位，弹层首帧就带正确宽度
    updatePopupPosition();
    localOpen.value = true;
    emit('update:IsSuggestionListOpen', true);
    updateXamlBinding(props.IsSuggestionListOpen, true, instance);
    await nextTick();
    // 弹层挂载后再校正一次位置/宽度
    updatePopupPosition();
    // 等样式真正刷到 DOM 再读取矩形，避免首次打开宽度不对
    await nextTick();
    // 展开动画只在弹层真正打开时播放；已打开后内容更新不重放。
    if (!wasOpen) flyoutAnimation.play();
  } else {
    localOpen.value = false;
    emit('update:IsSuggestionListOpen', false);
    updateXamlBinding(props.IsSuggestionListOpen, false, instance);
    flyoutAnimation.cancel();
  }
};

const onTextInput = (value: string) => {
  if (value === localText.value) return;
  localText.value = value;
  originalQuery.value = value;
  highlightedIndex.value = -1;
  updateXamlBinding(props.Text, value, instance);
  emit('update:Text', value);
  emit('TextChanged', api, { Reason: 'UserInput' });
  dispatchXamlEvent('TextChanged', { Reason: 'UserInput' });
  shouldOpenForUserInput.value = true;
  // Like the native control, update visibility after TextChanged consumers
  // have had a chance to replace ItemsSource.
  void nextTick(() => {
    if (isTextBoxFocused.value && shouldOpenForUserInput.value) {
      void setOpen(suggestionItems.value.length > 0);
    }
  });
};

const onFocus = () => {
  isTextBoxFocused.value = true;
};

const onBlur = () => {
  isTextBoxFocused.value = false;
  shouldOpenForUserInput.value = false;
  isComposing.value = false;
  void setOpen(false);
};

const chooseSuggestion = (index: number, submit = false) => {
  const item = suggestionItems.value[index];
  if (item === undefined || isNoResultsItem(item)) return;
  const text = getItemText(item);
  if (boolValue(resolveXamlValue(props.UpdateTextOnSelect, instance))) {
    localText.value = text;
    updateXamlBinding(props.Text, text, instance);
    emit('update:Text', text);
    emit('TextChanged', api, { Reason: 'SuggestionChosen' });
    dispatchXamlEvent('TextChanged', { Reason: 'SuggestionChosen' });
  }
  emit('SuggestionChosen', api, { SelectedItem: item });
  dispatchXamlEvent('SuggestionChosen', { SelectedItem: item });
  if (submit) submitQuery(item, currentText.value);
};

const onSuggestionClick = (index: number) => {
  highlightedIndex.value = index;
  chooseSuggestion(index, true);
  anchorRef.value?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')?.focus();
};

const submitQuery = (chosenSuggestion: Suggestion | null = null, queryText = currentText.value) => {
  shouldOpenForUserInput.value = false;
  emit('QuerySubmitted', api, { QueryText: queryText, ChosenSuggestion: chosenSuggestion });
  dispatchXamlEvent('QuerySubmitted', { QueryText: queryText, ChosenSuggestion: chosenSuggestion });
  void setOpen(false);
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.isComposing || isComposing.value || !isEnabled.value) return;
  if (!isOpen.value || !suggestionItems.value.length) {
    if (event.key === 'Enter') { event.preventDefault(); submitQuery(); }
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    const indexes = selectableIndexes.value;
    const current = indexes.indexOf(highlightedIndex.value);
    const nextIndex = indexes[Math.min(current + 1, indexes.length - 1)] ?? -1;
    if (nextIndex !== highlightedIndex.value) { highlightedIndex.value = nextIndex; if (nextIndex >= 0) chooseSuggestion(nextIndex); }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    const indexes = selectableIndexes.value;
    const current = indexes.indexOf(highlightedIndex.value);
    const nextIndex = indexes[Math.max(current - 1, 0)] ?? -1;
    if (nextIndex !== highlightedIndex.value) { highlightedIndex.value = nextIndex; if (nextIndex >= 0) chooseSuggestion(nextIndex); }
  } else if (event.key === 'Enter') {
    event.preventDefault();
    submitQuery(highlightedIndex.value >= 0 ? suggestionItems.value[highlightedIndex.value] : null);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    shouldOpenForUserInput.value = false;
    setProgrammaticText(originalQuery.value);
    void setOpen(false);
  } else if (event.key === 'Tab') {
    shouldOpenForUserInput.value = false;
    void setOpen(false);
  }
};

const resolveAnchorTheme = () => {
  const themeScope = rootRef.value?.closest('.theme-light, .theme-dark');
  if (themeScope?.classList.contains('theme-dark')) return 'dark';
  if (themeScope?.classList.contains('theme-light')) return 'light';
  return '';
};

const updatePopupPosition = () => {
  anchorTheme.value = resolveAnchorTheme();
  const textBoxBorder = anchorRef.value?.querySelector<HTMLElement>('.win-textbox-border');
  const rect = textBoxBorder?.getBoundingClientRect()
    ?? anchorRef.value?.getBoundingClientRect()
    ?? rootRef.value?.getBoundingClientRect();
  if (!rect) return;
  const visualViewport = window.visualViewport;
  const viewportTop = visualViewport?.offsetTop ?? 0;
  const viewportBottom = viewportTop + (visualViewport?.height ?? window.innerHeight);
  const maxHeight = Number(resolveXamlValue(props.MaxSuggestionListHeight, instance)) || 300;
  const alignCandidateWindowToBottom = isComposing.value && props.DesiredCandidateWindowAlignment === 'BottomEdge';
  const candidateWindowGap = alignCandidateWindowToBottom ? 40 : 0;
  const spaceBelow = viewportBottom - rect.bottom - candidateWindowGap - 8;
  const spaceAbove = rect.top - viewportTop - candidateWindowGap - 8;
  openDirection.value = alignCandidateWindowToBottom
    ? 'down'
    : (spaceBelow >= Math.min(maxHeight, 160) || spaceBelow >= spaceAbove ? 'down' : 'up');

  if (openDirection.value === 'up') {
    popupStyle.value = {
      left: `${rect.left}px`,
      bottom: `${window.innerHeight - rect.top + candidateWindowGap}px`,
      width: `${rect.width}px`,
      maxHeight: `${boolValue(resolveXamlValue(props.AutoMaximizeSuggestionArea, instance)) ? Math.max(0, spaceAbove) : Math.min(maxHeight, Math.max(0, spaceAbove))}px`,
      '--asb-input-bottom-radius': '4px',
      '--asb-popup-radius': '8px 8px 0 0'
    };
    return;
  }

  popupStyle.value = {
    left: `${rect.left}px`,
    top: `${rect.bottom + candidateWindowGap}px`,
    width: `${rect.width}px`,
    maxHeight: `${boolValue(resolveXamlValue(props.AutoMaximizeSuggestionArea, instance)) ? Math.max(0, spaceBelow) : Math.min(maxHeight, Math.max(0, spaceBelow))}px`,
    '--asb-input-bottom-radius': localOpen.value ? '0' : '4px',
    '--asb-popup-radius': '0 0 8px 8px'
  };
};

const onCompositionStart = () => {
  isComposing.value = true;
  if (isOpen.value) updatePopupPosition();
};

const onCompositionEnd = () => {
  isComposing.value = false;
  if (isOpen.value) requestAnimationFrame(updatePopupPosition);
};

const onDocumentPointerDown = (event: PointerEvent) => {
  const target = event.target as Node;
  if (rootRef.value?.contains(target) || popupRef.value?.contains(target)) return;
  shouldOpenForUserInput.value = false;
  void setOpen(false);
};

const setProgrammaticText = (value: string) => {
  if (value === localText.value) return;
  localText.value = value;
  emit('update:Text', value);
  updateXamlBinding(props.Text, value, instance);
  emit('TextChanged', api, { Reason: 'ProgrammaticChange' });
  dispatchXamlEvent('TextChanged', { Reason: 'ProgrammaticChange' });
};
watch(() => resolveXamlValue(props.Text, instance), value => setProgrammaticText(String(value ?? '')));

watch(() => resolveXamlValue(props.IsSuggestionListOpen, instance), value => setOpen(boolValue(value)));
watch(suggestionItems, () => {
  if (isOpen.value || (isTextBoxFocused.value && shouldOpenForUserInput.value)) {
    if (highlightedIndex.value >= suggestionItems.value.length) highlightedIndex.value = -1;
    void setOpen(suggestionItems.value.length > 0);
  }
}, { deep: true });
watch(isEnabled, enabled => { if (!enabled) { isTextBoxFocused.value = false; shouldOpenForUserInput.value = false; void setOpen(false); } });
watch(highlightedIndex, () => { void nextTick(() => popupRef.value?.querySelector<HTMLElement>('.is-highlighted')?.scrollIntoView({ block: 'nearest' })); });
watchPostEffect(() => {
  const field = anchorRef.value?.querySelector<HTMLInputElement>('input');
  if (!field) return;
  field.setAttribute('role', 'combobox');
  field.setAttribute('aria-autocomplete', 'list');
  field.setAttribute('aria-expanded', String(isOpen.value));
  field.setAttribute('aria-controls', popupId);
  const label = resolveXamlValue(attrs['AutomationProperties.Name'], instance);
  if (label) field.setAttribute('aria-label', String(label));
  if (highlightedIndex.value >= 0) field.setAttribute('aria-activedescendant', `${popupId}-${highlightedIndex.value}`);
  else field.removeAttribute('aria-activedescendant');
});

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown);
  window.addEventListener('resize', updatePopupPosition);
  window.addEventListener('scroll', updatePopupPosition, true);
  window.visualViewport?.addEventListener('resize', updatePopupPosition);
  window.visualViewport?.addEventListener('scroll', updatePopupPosition);
});

onBeforeUnmount(() => {
  flyoutAnimation.cancel();
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  window.removeEventListener('resize', updatePopupPosition);
  window.removeEventListener('scroll', updatePopupPosition, true);
  window.visualViewport?.removeEventListener('resize', updatePopupPosition);
  window.visualViewport?.removeEventListener('scroll', updatePopupPosition);
});

const api = proxyRefs({
  Text: computed({ get: () => currentText.value, set: (value: string) => setProgrammaticText(String(value)) }),
  ItemsSource: computed({ get: () => suggestionItems.value, set: (value: Suggestion[]) => { localItems.value = value; updateXamlBinding(props.ItemsSource, value, instance); } }),
  IsSuggestionListOpen: computed({ get: () => isOpen.value, set: (value: boolean) => { void setOpen(value); } }),
  ItemTemplate: computed({ get: () => propertyValue('ItemTemplate'), set: value => { propertyOverrides.value.ItemTemplate = value; updateXamlBinding(props.ItemTemplate, value, instance); } }),
  ItemTemplateSelector: computed({ get: () => propertyValue('ItemTemplateSelector'), set: value => { propertyOverrides.value.ItemTemplateSelector = value; updateXamlBinding(props.ItemTemplateSelector, value, instance); } }),
  DisplayMemberPath: computed({ get: () => propertyValue('DisplayMemberPath'), set: value => { propertyOverrides.value.DisplayMemberPath = value; updateXamlBinding(props.DisplayMemberPath, value, instance); } }),
  Header: computed({ get: () => resolvedHeader.value, set: value => { propertyOverrides.value.Header = value; updateXamlBinding(props.Header, value, instance); } }),
  HeaderTemplate: computed({ get: () => propertyValue('HeaderTemplate'), set: value => { propertyOverrides.value.HeaderTemplate = value; updateXamlBinding(props.HeaderTemplate, value, instance); } }),
  Description: computed({ get: () => resolvedDescription.value, set: value => { propertyOverrides.value.Description = value; updateXamlBinding(props.Description, value, instance); } }),
  Element: rootRef, Focus: () => { anchorRef.value?.querySelector<HTMLInputElement>('input')?.focus(); return true; }
});
defineExpose(api);
</script>

<style scoped>
.win-auto-suggest-box {
  display: inline-flex;
  flex-direction: column;
  min-width: 64px;
  max-width: 100%;
}

.win-asb-header {
  margin: var(--AutoSuggestBoxTopHeaderMargin, 0 0 8px 0);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 20px;
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.win-asb-anchor { display: flex; min-width: 0; width: 100%; }

.win-asb-textbox {
  width: 100%;
}

.win-auto-suggest-box :deep(.win-asb-query-button) {
  display: grid;
  place-items: center;
  appearance: none;
  width: 32px;
  min-width: 32px;
  height: auto;
  min-height: 0;
  flex: 0 0 32px;
  align-self: stretch;
  margin: 0 0 0 2px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--TextControlButtonForeground, var(--text-secondary));
  cursor: default;
}

.win-auto-suggest-box :deep(.win-asb-query-content) { position: absolute; inset: 3px 1px; display: flex; align-items: center; justify-content: center; border-radius: 4px; background: var(--TextControlButtonBackground, transparent); }
.win-auto-suggest-box :deep(.win-asb-query-button:hover:not(:disabled) .win-asb-query-content) { background: var(--TextControlButtonBackgroundPointerOver, var(--subtle-fill-color-secondary, var(--subtle-secondary))); color: var(--TextControlButtonForegroundPointerOver, var(--text-primary)); }
.win-auto-suggest-box :deep(.win-asb-query-button:active:not(:disabled) .win-asb-query-content) { background: var(--TextControlButtonBackgroundPressed, var(--subtle-fill-color-tertiary, var(--subtle-tertiary))); color: var(--TextControlButtonForegroundPressed, var(--text-secondary)); }
.win-auto-suggest-box :deep(.win-asb-query-button:disabled) { color: var(--text-disabled); }

.win-asb-textbox :deep(.win-textbox-delete-button) {
  width: 40px;
  min-width: 40px;
  flex-basis: 40px;
}

.win-asb-textbox :deep(.win-textbox-delete-button-layout) {
  inset: 4px;
}

.win-auto-suggest-box.is-suggestion-open-down :deep(.win-textbox-border),
.win-auto-suggest-box.is-suggestion-open-up :deep(.win-textbox-border) {
  border-radius: 4px;
}

.win-auto-suggest-box.is-suggestion-open-down :deep(.win-textbox-border) {
  border-bottom-left-radius: var(--asb-input-bottom-radius, 0);
  border-bottom-right-radius: var(--asb-input-bottom-radius, 0);
}

.win-auto-suggest-box.is-suggestion-open-up :deep(.win-textbox-border) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.win-asb-icon {
  font-size: 13px;
}

.win-asb-description {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 16px;
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.win-asb-popup {
  position: fixed;
  z-index: 1000;
  overflow: visible;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--flyout-border, var(--surface-stroke-color-flyout, var(--card-stroke)));
  border-radius: var(--asb-popup-radius, 8px);
}

.win-asb-popup-scroll {
  width: 100%;
  min-height: 0;
  max-height: inherit;
  flex: 1 1 auto;
  overflow: hidden;
  border-radius: inherit;
}

.win-asb-popup-scroll :deep(.win-scroll-viewer-viewport) {
  height: 100%;
  max-height: inherit;
}

.win-asb-popup-scroll :deep(.scroll-content) {
  display: flex;
  flex-direction: column;
}

.win-asb-results {
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  display: flex;
  flex-direction: column;
}

.win-asb-item {
  box-sizing: border-box;
  width: 100%;
  min-height: 32px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font: inherit;
  text-align: left;
  overflow: hidden;
}

.win-asb-item-title { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.win-asb-item > :deep(*) { min-width: 0; max-width: 100%; }

.win-asb-item:hover,
.win-asb-item.is-highlighted {
  background: var(--subtle-fill-color-secondary, var(--subtle-secondary));
}

.win-asb-item.is-disabled {
  color: var(--text-secondary);
  cursor: default;
}

.win-asb-item.is-disabled:hover {
  background: transparent;
}

.win-asb-item-subtitle {
  color: var(--text-secondary);
  font-size: 12px;
}
</style>
