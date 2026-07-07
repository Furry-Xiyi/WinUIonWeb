<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="flyoutRef"
      class="win-commandbar-flyout"
      :class="[themeClass, `placement-${actualPlacement.toLowerCase()}`, { 'is-expanded': secondaryOpen, 'opens-up': opensUp }]"
      :style="flyoutStyle"
      role="menu"
      @keydown="onKeydown"
      @pointerdown.stop>
      <div class="win-cbf-top">
        <div v-if="primaryCommands.length" class="win-cbf-primary" role="toolbar">
          <button
            v-for="command in primaryCommands"
            :key="commandKey(command)"
            class="win-cbf-appbar-button"
            :class="{ 'is-toggle': command.IsToggle, 'is-checked': command.IsChecked }"
            type="button"
            role="menuitem"
            :aria-pressed="command.IsToggle ? Boolean(command.IsChecked) : undefined"
            :title="command.ToolTipServiceToolTip || command.ToolTip || command.Label"
            :disabled="command.IsEnabled === false"
            @click="invoke(command)">
            <span v-if="command.Icon" class="win-cbf-icon">{{ iconGlyph(command.Icon) }}</span>
            <span v-if="showPrimaryLabels" class="win-cbf-primary-label">{{ command.Label }}</span>
          </button>
        </div>

        <button
          v-if="secondaryCommands.length"
          class="win-cbf-more-button"
          type="button"
          :aria-label="t('text.more')"
          :aria-expanded="secondaryOpen"
          @click="secondaryOpen = !secondaryOpen">
          <span class="win-cbf-icon"></span>
        </button>
      </div>

      <div v-if="secondaryOpen && secondaryCommands.length" class="win-cbf-secondary" role="menu">
        <button
          v-for="command in secondaryCommands"
          :key="commandKey(command)"
          class="win-cbf-overflow-button"
          type="button"
          role="menuitem"
          :disabled="command.IsEnabled === false"
          @click="invoke(command)">
          <span v-if="command.Icon" class="win-cbf-overflow-icon">{{ iconGlyph(command.Icon) }}</span>
          <span class="win-cbf-overflow-label">{{ command.Label }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();
import type { CSSProperties } from 'vue';

type Placement =
  | 'Auto'
  | 'Top'
  | 'Bottom'
  | 'Left'
  | 'Right'
  | 'TopEdgeAlignedLeft'
  | 'TopEdgeAlignedRight'
  | 'BottomEdgeAlignedLeft'
  | 'BottomEdgeAlignedRight'
  | 'LeftEdgeAlignedTop'
  | 'LeftEdgeAlignedBottom'
  | 'RightEdgeAlignedTop'
  | 'RightEdgeAlignedBottom';

type ShowMode = 'Standard' | 'Transient';
type AnchorRect = DOMRect | { top: number; bottom: number; left: number; right: number; width: number; height: number; x?: number; y?: number };
type CommandBarFlyoutCommand = {
  Label: string;
  Icon?: string;
  Name?: string;
  Command?: string;
  ToolTip?: string;
  ToolTipServiceToolTip?: string;
  IsEnabled?: boolean;
  IsToggle?: boolean;
  IsChecked?: boolean;
};

const props = withDefaults(defineProps<{
  Open?: boolean;
  AnchorRect?: AnchorRect | null;
  PrimaryCommands?: CommandBarFlyoutCommand[];
  SecondaryCommands?: CommandBarFlyoutCommand[];
  AlwaysExpanded?: boolean;
  Placement?: Placement;
  ShowMode?: ShowMode;
  MinWidth?: number;
  ShowPrimaryLabels?: boolean;
  Theme?: string;
}>(), {
  Open: false,
  AnchorRect: null,
  PrimaryCommands: () => [],
  SecondaryCommands: () => [],
  AlwaysExpanded: false,
  Placement: 'Auto',
  ShowMode: 'Standard',
  MinWidth: 0,
  ShowPrimaryLabels: false,
  Theme: ''
});

const emit = defineEmits<{
  Close: [];
  Command: [command: CommandBarFlyoutCommand];
  Opening: [];
  Opened: [];
  Closing: [];
  Closed: [];
}>();

const flyoutRef = ref<HTMLElement | null>(null);
const isOpen = ref(props.Open);
const secondaryOpen = ref(props.AlwaysExpanded);
const anchorRect = ref<AnchorRect | null>(props.AnchorRect);
const actualPlacement = ref<Placement>(props.Placement);
const position = ref({ top: 0, left: 0 });
const opensUp = computed(() => actualPlacement.value.includes('Top'));
const primaryCommands = computed(() => props.PrimaryCommands ?? []);
const secondaryCommands = computed(() => props.SecondaryCommands ?? []);
const showPrimaryLabels = computed(() => props.ShowPrimaryLabels);
const themeClass = computed(() => props.Theme === 'light' || props.Theme === 'dark' ? `win-theme-scope theme-${props.Theme}` : '');

const flyoutStyle = computed<CSSProperties>(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  minWidth: props.MinWidth ? `${props.MinWidth}px` : undefined
}));

const iconMap: Record<string, string> = {
  Share: '\uE72D',
  Save: '\uE74E',
  Delete: '\uE74D',
  Cut: '\uE8C6',
  Copy: '\uE8C8',
  Paste: '\uE77F',
  Undo: '\uE7A7',
  Redo: '\uE7A6',
  SelectAll: '\uE8B3',
  Bold: '\uE8DD',
  Italic: '\uE8DB',
  Underline: '\uE8DC'
};

const commandKey = (command: CommandBarFlyoutCommand) => command.Name || command.Command || command.Label;
const iconGlyph = (icon: string) => iconMap[icon] ?? icon;

const choosePlacement = (rect: AnchorRect, requested: Placement) => {
  if (requested !== 'Auto') return requested;
  const below = window.innerHeight - rect.bottom;
  const above = rect.top;
  const right = window.innerWidth - rect.right;
  const left = rect.left;
  if (below >= 120) return 'Bottom';
  if (above >= 120) return 'Top';
  if (right >= 180) return 'Right';
  if (left >= 180) return 'Left';
  return 'Bottom';
};

const updatePosition = async () => {
  const rect = anchorRect.value;
  if (!rect) return;
  actualPlacement.value = choosePlacement(rect, props.Placement);

  const gap = 0;
  let top = rect.bottom + gap;
  let left = rect.left;

  if (actualPlacement.value.includes('Top')) top = rect.top - gap;
  if (actualPlacement.value.includes('Bottom')) top = rect.bottom + gap;
  if (actualPlacement.value.includes('Left')) {
    top = rect.top;
    left = rect.left - gap;
  }
  if (actualPlacement.value.includes('Right')) {
    top = rect.top;
    left = rect.right + gap;
  }
  if (actualPlacement.value.includes('AlignedBottom')) top = rect.bottom;
  if (actualPlacement.value.includes('AlignedRight')) left = rect.right;

  position.value = { top, left };
  await nextTick();

  const flyout = flyoutRef.value;
  if (!flyout) return;
  const flyoutRect = flyout.getBoundingClientRect();
  let nextTop = position.value.top;
  let nextLeft = position.value.left;

  if (actualPlacement.value.includes('Top')) nextTop -= flyoutRect.height;
  if (actualPlacement.value.includes('Left')) nextLeft -= flyoutRect.width;
  if (actualPlacement.value.includes('AlignedRight')) nextLeft -= flyoutRect.width;

  nextLeft = Math.max(8, Math.min(window.innerWidth - flyoutRect.width - 8, nextLeft));
  nextTop = Math.max(8, Math.min(window.innerHeight - flyoutRect.height - 8, nextTop));
  position.value = { top: nextTop, left: nextLeft };
};

const openAt = async (rect: AnchorRect, options: { Placement?: Placement; ShowMode?: ShowMode } = {}) => {
  anchorRect.value = rect;
  actualPlacement.value = options.Placement ?? props.Placement;
  secondaryOpen.value = props.AlwaysExpanded;
  emit('Opening');
  isOpen.value = true;
  await nextTick();
  await updatePosition();
  emit('Opened');
};

const showAt = async (target: HTMLElement, options: { Placement?: Placement; ShowMode?: ShowMode } = {}) => {
  await openAt(target.getBoundingClientRect(), {
    Placement: options.Placement,
    ShowMode: options.ShowMode
  });
};

const hide = () => {
  if (!isOpen.value) return;
  emit('Closing');
  isOpen.value = false;
  secondaryOpen.value = props.AlwaysExpanded;
  emit('Close');
  emit('Closed');
};

const invoke = (command: CommandBarFlyoutCommand) => {
  emit('Command', command);
  hide();
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    hide();
  }
};

const onPointerDown = (event: PointerEvent) => {
  if (!isOpen.value) return;
  if (flyoutRef.value?.contains(event.target as Node)) return;
  hide();
};

watch(() => props.Open, (value) => {
  if (value && props.AnchorRect) void openAt(props.AnchorRect);
  else if (!value) hide();
});

watch(() => props.AnchorRect, (value) => {
  anchorRect.value = value;
  if (isOpen.value) void updatePosition();
});

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
});

defineExpose({ showAt, hide, openAt, isOpen });
</script>

<style scoped>
.win-commandbar-flyout {
  position: fixed;
  z-index: 9100;
  display: flex;
  flex-direction: column;
  color: var(--text-primary);
  background: var(--flyout-background, var(--layer-fill-color-default));
  background-image: var(--flyout-material-overlay);
  border: 1px solid var(--flyout-border, var(--surface-stroke-color-flyout, var(--control-stroke-color-default)));
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  backdrop-filter: var(--flyout-backdrop, blur(30px));
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
  overflow: hidden;
  animation: cbf-open-down 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both, cbf-fade 83ms linear both;
}

.win-commandbar-flyout.opens-up {
  animation-name: cbf-open-up, cbf-fade;
}

.win-cbf-top {
  display: flex;
  align-items: stretch;
  min-height: 46px;
}

.win-cbf-primary {
  min-height: 40px;
  margin: 3px 0 3px 3px;
  display: flex;
  align-items: stretch;
}

.win-cbf-more-button {
  min-width: 40px;
  height: 40px;
  margin: 3px 3px 3px 0;
}

.win-cbf-appbar-button,
.win-cbf-more-button,
.win-cbf-overflow-button {
  appearance: none;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.win-cbf-appbar-button {
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.win-commandbar-flyout:has(.win-cbf-primary-label) .win-cbf-appbar-button {
  min-width: 64px;
  height: 52px;
  flex-direction: column;
  gap: 2px;
  padding: 4px 8px;
}

.win-commandbar-flyout:has(.win-cbf-primary-label) .win-cbf-top {
  min-height: 58px;
}

.win-commandbar-flyout:has(.win-cbf-primary-label) .win-cbf-more-button {
  height: 52px;
  min-width: 52px;
}

.win-cbf-more-button {
  display: grid;
  place-items: center;
}

.win-cbf-appbar-button:hover,
.win-cbf-more-button:hover,
.win-cbf-overflow-button:hover {
  background: var(--subtle-fill-color-secondary, var(--subtle-secondary));
}

.win-cbf-appbar-button.is-checked {
  background: var(--accent-base);
  color: var(--accent-text);
}

.win-cbf-appbar-button.is-checked:hover {
  background: var(--accent-hover, var(--accent-base));
}

.win-cbf-appbar-button:active,
.win-cbf-more-button:active,
.win-cbf-overflow-button:active {
  background: var(--subtle-fill-color-tertiary, var(--subtle-tertiary));
  color: var(--text-secondary);
}

.win-cbf-appbar-button:disabled,
.win-cbf-overflow-button:disabled {
  color: var(--text-disabled);
  cursor: default;
}

.win-cbf-icon,
.win-cbf-overflow-icon {
  font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets", "WinUIOnWebIcons", sans-serif;
  font-size: 16px;
  line-height: 1;
}

.win-cbf-primary-label {
  font-size: 12px;
  line-height: 14px;
}

.win-cbf-secondary {
  min-width: 200px;
  padding: 4px;
  border-top: 1px solid var(--flyout-border, var(--surface-stroke-color-flyout, var(--divider-stroke)));
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.win-cbf-overflow-button {
  min-height: 32px;
  width: 100%;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.win-cbf-overflow-icon {
  width: 16px;
  text-align: center;
}

.win-cbf-overflow-label {
  flex: 1;
  min-width: 0;
  font-size: 14px;
}

@keyframes cbf-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes cbf-open-down {
  from { clip-path: inset(0 0 calc(100% - 1px) 0); transform: translateY(-8px); }
  to { clip-path: inset(0); transform: translateY(0); }
}

@keyframes cbf-open-up {
  from { clip-path: inset(calc(100% - 1px) 0 0 0); transform: translateY(8px); }
  to { clip-path: inset(0); transform: translateY(0); }
}
</style>
