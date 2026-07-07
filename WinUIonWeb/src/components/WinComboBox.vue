<template>
  <div class="win-combo-box" ref="comboRef">
    <WinTextBlock v-if="Header" class="win-combo-header" :Text="Header" />
    <input
      v-if="IsEditable"
      class="win-btn win-combo-btn win-combo-input"
      :style="buttonStyle"
      :value="editableText"
      @focus="open"
      @input="onEditableInput"
      @keydown.enter="onTextSubmitted"
      @mousedown="onChevronDown"
      @mouseup="onChevronUp"
      @mouseleave="onChevronLeave">
    <button class="win-btn win-combo-btn"
            v-else
            :style="buttonStyle"
            @click="toggle"
            @mousedown="onChevronDown"
            @mouseup="onChevronUp"
            @mouseleave="onChevronLeave">
      <span>{{ selectedLabel }}</span>
      <span class="icon chevron chevron-animate"
            :class="chevronClass"
            @animationend="onChevronAnimEnd"></span>
    </button>
    <Teleport to="body">
      <div v-if="isOpen" class="win-combo-overlay" @click.stop="close" @contextmenu.prevent="close"></div>
      <div v-if="isOpen" class="win-combo-flyout" :style="flyoutStyle">
        <div class="win-flyout-item" v-for="(opt, i) in normalizedItems" :key="i" :class="{ selected: selectedIndex === i }" @click="select(i)">
          <div v-if="selectedIndex === i" class="flyout-indicator"></div>
          {{ opt.label }}
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { useI18n } from './i18n/index';
import WinTextBlock from './WinTextBlock.vue';

const { t } = useI18n();
const props = defineProps({
  ItemsSource: { type: Array, default: undefined },
  Header: { type: String, default: '' },
  PlaceholderText: { type: String, default: '' },
  IsEditable: { type: Boolean, default: false },
  SelectedIndex: { type: Number, default: undefined },
  SelectedItem: { type: null, default: undefined },
  Width: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  modelValue: { type: Number, default: undefined },
  placeholder: { type: String, default: '' },
  header: { type: String, default: '' },
  editable: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'update:SelectedIndex', 'SelectionChanged', 'TextSubmitted']);
const isOpen = ref(false); const comboRef = ref(null); const flyoutStyle = ref({}); const flyoutOrigin = ref('center');
const selectedIndex = computed({
  get: () => props.SelectedIndex ?? props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
    emit('update:SelectedIndex', val);
  }
});
const Header = computed(() => props.Header || props.header);
const IsEditable = computed(() => props.IsEditable || props.editable);
const normalizedItems = computed(() => (props.ItemsSource ?? props.options ?? []).map((item) => {
  if (typeof item === 'string' || typeof item === 'number') return { label: String(item), value: item };
  return { ...item, label: item.label ?? item.Text ?? item.Name ?? String(item), value: item.value ?? item.Value ?? item };
}));
const selectedLabel = computed(() => normalizedItems.value[selectedIndex.value]?.label || props.PlaceholderText || props.placeholder || t('text.select'));
const editableText = ref('');
const chevronClass = ref('');
let chevronPressed = false;
let chevronPressDone = false;

const onChevronDown = () => {
  chevronPressed = true;
  chevronPressDone = false;
  chevronClass.value = 'pressing';
};
const onChevronUp = () => {
  if (!chevronPressed) return;
  chevronPressed = false;
  if (chevronPressDone) chevronClass.value = 'releasing';
};
const onChevronLeave = () => { chevronPressed = false; };
const onChevronAnimEnd = () => {
  if (chevronClass.value === 'pressing') {
    chevronPressDone = true;
    if (!chevronPressed) chevronClass.value = 'releasing';
  } else if (chevronClass.value === 'releasing') {
    chevronClass.value = '';
    chevronPressDone = false;
  }
};
const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};
const buttonStyle = computed(() => {
  const style = {};
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  return style;
});

watch(selectedLabel, (label) => { editableText.value = label; }, { immediate: true });

const positionFlyout = async () => {
  if (isOpen.value) {
    await nextTick();
    const rect = comboRef.value.getBoundingClientRect();
    const itemH = 34;
    const index = selectedIndex.value ?? 0;
    const topOffset = rect.top - (index * itemH) - 4;
    let origin = 'center center';
    if (index === 0) {
      origin = 'top center';
    } else if (index === normalizedItems.value.length - 1) {
      origin = 'bottom center';
    }
    flyoutOrigin.value = origin;
    flyoutStyle.value = { top: `${Math.max(10, topOffset)}px`, left: `${rect.left}px`, minWidth: `${rect.width}px`, transformOrigin: origin };
  }
};
const open = async () => { isOpen.value = true; await positionFlyout(); };
const toggle = async () => {
  isOpen.value = !isOpen.value;
  await positionFlyout();
};
const select = (idx) => {
  const oldItem = normalizedItems.value[selectedIndex.value];
  selectedIndex.value = idx;
  editableText.value = normalizedItems.value[idx]?.label ?? '';
  emit('SelectionChanged', { SelectedIndex: idx, SelectedItem: normalizedItems.value[idx], AddedItems: [normalizedItems.value[idx]], RemovedItems: oldItem ? [oldItem] : [] });
  isOpen.value = false;
};
const onEditableInput = (event) => {
  editableText.value = event.target.value;
};
const onTextSubmitted = () => {
  emit('TextSubmitted', { Text: editableText.value });
};
const close = () => { isOpen.value = false; };
</script>
<style>
  .win-combo-box {
    position: relative;
    display: inline-block;
  }

  .win-combo-header {
    margin: 0 0 4px;
  }

  .win-combo-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 120px;
  }

  .win-combo-input {
    justify-content: flex-start;
    text-align: left;
  }

  .win-combo-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
  }

  .win-combo-flyout {
    position: absolute;
    border: 1px solid var(--stroke-surface-flyout);
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.14);
    background: var(--flyout-bg);
    background-image: var(--flyout-material-overlay);
    backdrop-filter: var(--flyout-backdrop);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    display: flex;
    flex-direction: column;
    gap: 2px;
    animation: picker-flyout-enter var(--fast-duration) var(--fast-out-slow-in);
    transform-origin: center center;
    min-width: 100%;
    width: max-content;
    z-index: 1000;
  }

    .win-combo-flyout .win-flyout-item {
      position: relative;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      background: transparent;
      color: var(--text-primary);
      transition: background var(--fast-duration) var(--fast-out-slow-in);
    }

      .win-combo-flyout .win-flyout-item:hover {
        background: var(--subtle-secondary);
      }

      .win-combo-flyout .win-flyout-item:active {
        background: var(--subtle-tertiary);
        color: var(--text-secondary);
      }

      .win-combo-flyout .win-flyout-item.selected {
        background: var(--subtle-secondary);
      }

        .win-combo-flyout .win-flyout-item.selected:hover {
          background: var(--subtle-tertiary);
        }

      .win-combo-flyout .win-flyout-item .flyout-indicator {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 16px;
        background: var(--accent-base);
        border-radius: 3px;
        transition: height var(--fast-duration) var(--fast-out-slow-in);
      }

      .win-combo-flyout .win-flyout-item.selected:active .flyout-indicator {
        height: 10px;
      }
</style>
