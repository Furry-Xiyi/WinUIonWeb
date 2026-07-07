<template>
  <div
    ref="rootRef"
    class="win-auto-suggest-box"
    :class="{ 'is-suggestion-open-down': isOpen && openDirection === 'down', 'is-suggestion-open-up': isOpen && openDirection === 'up' }"
    :style="rootStyle">
    <div v-if="Header || $slots.header" class="win-asb-header">
      <slot name="header">{{ Header }}</slot>
    </div>

    <div ref="anchorRef" class="win-asb-anchor">
      <WinTextBox
        class="win-asb-textbox"
        :Text="currentText"
        :PlaceholderText="PlaceholderText"
        :IsEnabled="IsEnabled"
        :Description="''"
        @update:Text="onTextInput"
        @GotFocus="onFocus"
        @LostFocus="onBlur"
        @keydown.capture="onKeydown"
        @TextCompositionStarted="onCompositionStart"
        @TextCompositionEnded="onCompositionEnd">
        <template #actions>
          <button
            v-if="QueryIcon"
            class="win-textbox-action-button win-textbox-action-query win-asb-query-button"
            type="button"
            :disabled="!IsEnabled"
            :aria-label="t('text.submit-query')"
            @pointerdown.prevent
            @click="submitQuery()">
            <span class="win-asb-icon">{{ resolvedQueryIcon }}</span>
          </button>
        </template>
      </WinTextBox>
    </div>

    <div v-if="Description || $slots.description" class="win-asb-description">
      <slot name="description">{{ Description }}</slot>
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen && suggestionItems.length"
        ref="popupRef"
        class="win-asb-popup"
        :class="openDirection === 'up' ? 'opens-up' : 'opens-down'"
        :style="popupStyle"
        role="listbox">
        <button
          v-for="(item, index) in suggestionItems"
          :key="`${getItemText(item)}-${index}`"
          class="win-asb-item"
          :class="{ 'is-highlighted': highlightedIndex === index, 'is-disabled': isNoResultsItem(item) }"
          type="button"
          role="option"
          :disabled="isNoResultsItem(item)"
          :aria-selected="highlightedIndex === index"
          @mouseenter="highlightedIndex = isNoResultsItem(item) ? highlightedIndex : index"
          @pointerdown.prevent
          @click="chooseSuggestion(index)">
          <span class="win-asb-item-title">{{ getItemText(item) }}</span>
          <span v-if="getItemSubtitle(item)" class="win-asb-item-subtitle">{{ getItemSubtitle(item) }}</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();
import type { CSSProperties } from 'vue';
import WinTextBox from './WinTextBox.vue';

type Suggestion = string | number | Record<string, unknown>;
type TextChangedReason = 'UserInput' | 'ProgrammaticChange' | 'SuggestionChosen';

const props = withDefaults(defineProps<{
  Text?: string;
  PlaceholderText?: string;
  Header?: string;
  Description?: string;
  QueryIcon?: string;
  ItemsSource?: Suggestion[];
  TextMemberPath?: string;
  UpdateTextOnSelect?: boolean;
  IsSuggestionListOpen?: boolean;
  MaxSuggestionListHeight?: number | string;
  AutoMaximizeSuggestionArea?: boolean;
  DesiredCandidateWindowAlignment?: 'Default' | 'BottomEdge';
  LightDismissOverlayMode?: string;
  TextBoxStyle?: unknown | null;
  KeepInteriorCornersSquare?: boolean;
  IsEnabled?: boolean;
  Width?: number | string;
}>(), {
  Text: '',
  PlaceholderText: '',
  Header: '',
  Description: '',
  QueryIcon: '',
  ItemsSource: () => [],
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

const emit = defineEmits<{
  'update:Text': [value: string];
  'update:IsSuggestionListOpen': [value: boolean];
  TextChanged: [args: { text: string; reason: TextChangedReason }];
  SuggestionChosen: [args: { selectedItem: Suggestion }];
  QuerySubmitted: [args: { queryText: string; chosenSuggestion: Suggestion | null }];
}>();

const rootRef = ref<HTMLElement | null>(null);
const anchorRef = ref<HTMLElement | null>(null);
const popupRef = ref<HTMLElement | null>(null);
const localText = ref(props.Text);
const localOpen = ref(props.IsSuggestionListOpen);
const highlightedIndex = ref(-1);
const popupStyle = ref<CSSProperties & Record<string, string>>({});
const openDirection = ref<'up' | 'down'>('down');
const candidateWindowGap = ref(0);

const isOpen = computed(() => localOpen.value && props.IsEnabled);
const suggestionItems = computed(() => props.ItemsSource ?? []);
const currentText = computed(() => props.Text ?? localText.value);
const resolvedQueryIcon = computed(() => props.QueryIcon === 'Find' ? '\uE721' : props.QueryIcon);
const rootStyle = computed<CSSProperties & Record<string, string | undefined>>(() => ({
  width: props.Width === '' ? undefined : typeof props.Width === 'number' ? `${props.Width}px` : props.Width,
  '--asb-input-bottom-radius': isOpen.value && openDirection.value === 'down' ? '0' : '4px'
}));

const getItemText = (item: Suggestion) => {
  if (item && typeof item === 'object') {
    const key = props.TextMemberPath || 'title';
    return String(item[key] ?? item.text ?? item.name ?? '');
  }
  return String(item ?? '');
};

const getItemSubtitle = (item: Suggestion) => {
  if (item && typeof item === 'object') return String(item.subtitle ?? '');
  return '';
};

const isNoResultsItem = (item: Suggestion) => getItemText(item).trim().toLowerCase() === 'no results found';

const selectableIndexes = computed(() => suggestionItems.value
  .map((item, index) => isNoResultsItem(item) ? -1 : index)
  .filter((index) => index >= 0));

const setOpen = async (value: boolean) => {
  localOpen.value = value && suggestionItems.value.length > 0;
  emit('update:IsSuggestionListOpen', localOpen.value);
  if (localOpen.value) {
    highlightedIndex.value = -1;
    await nextTick();
    updatePopupPosition();
  }
};

const onTextInput = (value: string) => {
  localText.value = value;
  emit('update:Text', value);
  emit('TextChanged', { text: value, reason: 'UserInput' });
  void setOpen(suggestionItems.value.length > 0);
};

const onFocus = () => {
  if (suggestionItems.value.length) void setOpen(true);
};

const onBlur = () => {
  window.setTimeout(() => setOpen(false), 120);
};

const chooseSuggestion = (index: number) => {
  const item = suggestionItems.value[index];
  if (item === undefined || isNoResultsItem(item)) return;
  const text = getItemText(item);
  emit('SuggestionChosen', { selectedItem: item });
  if (props.UpdateTextOnSelect) {
    localText.value = text;
    emit('update:Text', text);
    emit('TextChanged', { text, reason: 'SuggestionChosen' });
  }
  submitQuery(item, text);
};

const submitQuery = (chosenSuggestion: Suggestion | null = null, queryText = currentText.value) => {
  emit('QuerySubmitted', { queryText, chosenSuggestion });
  void setOpen(false);
};

const onKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value || !suggestionItems.value.length) {
    if (event.key === 'Enter') submitQuery();
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    const indexes = selectableIndexes.value;
    const current = indexes.indexOf(highlightedIndex.value);
    highlightedIndex.value = indexes[Math.min(current + 1, indexes.length - 1)] ?? -1;
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    const indexes = selectableIndexes.value;
    const current = indexes.indexOf(highlightedIndex.value);
    highlightedIndex.value = indexes[Math.max(current - 1, 0)] ?? -1;
  } else if (event.key === 'Enter') {
    event.preventDefault();
    highlightedIndex.value >= 0 ? chooseSuggestion(highlightedIndex.value) : submitQuery();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    void setOpen(false);
  }
};

const updatePopupPosition = () => {
  const rect = anchorRef.value?.getBoundingClientRect() ?? rootRef.value?.getBoundingClientRect();
  if (!rect) return;
  const maxHeight = typeof props.MaxSuggestionListHeight === 'number' ? props.MaxSuggestionListHeight : Number(props.MaxSuggestionListHeight) || 300;
  const estimatedImeHeight = candidateWindowGap.value;
  const gap = estimatedImeHeight;
  const spaceBelow = window.innerHeight - rect.bottom - gap - 8;
  const spaceAbove = rect.top - gap - 8;
  openDirection.value = spaceBelow >= Math.min(maxHeight, 160) || spaceBelow >= spaceAbove ? 'down' : 'up';

  if (openDirection.value === 'up') {
    popupStyle.value = {
      left: `${rect.left}px`,
      bottom: `${window.innerHeight - rect.top + gap}px`,
      width: `${rect.width}px`,
      maxHeight: `${props.AutoMaximizeSuggestionArea ? Math.max(120, spaceAbove) : Math.min(maxHeight, Math.max(80, spaceAbove))}px`,
      '--asb-input-bottom-radius': '4px',
      '--asb-popup-radius': '8px 8px 0 0'
    };
    return;
  }

  popupStyle.value = {
    left: `${rect.left}px`,
    top: `${rect.bottom + gap}px`,
    width: `${rect.width}px`,
    maxHeight: `${props.AutoMaximizeSuggestionArea ? Math.max(120, spaceBelow) : Math.min(maxHeight, Math.max(80, spaceBelow))}px`,
    '--asb-input-bottom-radius': localOpen.value ? '0' : '4px',
    '--asb-popup-radius': '0 0 8px 8px'
  };
};

const updateCandidateWindowGap = () => {
  if (!window.visualViewport) {
    candidateWindowGap.value = 0;
    return;
  }
  const occluded = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop;
  candidateWindowGap.value = Math.max(0, Math.min(occluded, 96));
  if (isOpen.value) updatePopupPosition();
};

const onCompositionStart = () => {
  candidateWindowGap.value = Math.max(candidateWindowGap.value, 40);
  if (isOpen.value) updatePopupPosition();
};

const onCompositionEnd = () => {
  window.setTimeout(() => {
    updateCandidateWindowGap();
    if (candidateWindowGap.value === 0 && isOpen.value) updatePopupPosition();
  }, 180);
};

const onDocumentPointerDown = (event: PointerEvent) => {
  const target = event.target as Node;
  if (rootRef.value?.contains(target) || popupRef.value?.contains(target)) return;
  void setOpen(false);
};

watch(() => props.Text, (value) => {
  localText.value = value ?? '';
  emit('TextChanged', { text: localText.value, reason: 'ProgrammaticChange' });
});

watch(() => props.IsSuggestionListOpen, (value) => setOpen(Boolean(value)));
watch(() => props.ItemsSource, () => {
  if (isOpen.value) void setOpen(suggestionItems.value.length > 0);
}, { deep: true });

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown);
  window.addEventListener('resize', updatePopupPosition);
  window.addEventListener('scroll', updatePopupPosition, true);
  window.visualViewport?.addEventListener('resize', updateCandidateWindowGap);
  window.visualViewport?.addEventListener('scroll', updateCandidateWindowGap);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  window.removeEventListener('resize', updatePopupPosition);
  window.removeEventListener('scroll', updatePopupPosition, true);
  window.visualViewport?.removeEventListener('resize', updateCandidateWindowGap);
  window.visualViewport?.removeEventListener('scroll', updateCandidateWindowGap);
});
</script>

<style scoped>
.win-auto-suggest-box {
  display: inline-flex;
  flex-direction: column;
  min-width: 64px;
}

.win-asb-header {
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 20px;
}

.win-asb-anchor { display: flex; }

.win-asb-textbox {
  width: 100%;
}

.win-asb-query-button {
  display: grid;
  place-items: center;
}

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
  font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets", sans-serif;
  font-size: 13px;
}

.win-asb-description {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 16px;
}

.win-asb-popup {
  position: fixed;
  z-index: 1000;
  overflow: auto;
  padding: 4px;
  box-sizing: border-box;
  background: var(--flyout-background, var(--layer-fill-color-default));
  border: 1px solid var(--flyout-border, var(--surface-stroke-color-flyout, var(--card-stroke)));
  border-radius: var(--asb-popup-radius, 8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  backdrop-filter: var(--flyout-backdrop, blur(30px));
  animation: asb-open-down 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both, asb-opacity 83ms linear both;
}

.win-asb-popup.opens-up {
  animation-name: asb-open-up, asb-opacity;
}

@keyframes asb-opacity {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes asb-open-down {
  from { clip-path: inset(0 0 calc(100% - 1px) 0); transform: translateY(-16px); }
  to { clip-path: inset(0 0 0 0); transform: translateY(0); }
}

@keyframes asb-open-up {
  from { clip-path: inset(calc(100% - 1px) 0 0 0); transform: translateY(16px); }
  to { clip-path: inset(0 0 0 0); transform: translateY(0); }
}

.win-asb-item {
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
}

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
