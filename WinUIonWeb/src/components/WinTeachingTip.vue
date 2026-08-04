<template>
  <Teleport to="body">
    <Transition name="win-teaching-tip">
      <section
        v-if="effectiveIsOpen"
        ref="tipRef"
        class="win-teaching-tip"
        :class="[isTargeted ? 'is-targeted' : 'is-untargeted', `placement-${actualPlacement.toLowerCase()}`]"
        :style="tipStyle"
        role="dialog"
        @pointerdown.stop>
        <div v-if="$slots.HeroContent || $slots.hero" class="win-teaching-tip-hero">
          <slot name="HeroContent"><slot name="hero"></slot></slot>
        </div>
        <div class="win-teaching-tip-main">
          <div v-if="$slots.IconSource || $slots.icon || IconSource" class="win-teaching-tip-icon">
            <slot name="IconSource"><slot name="icon">{{ iconGlyph }}</slot></slot>
          </div>
          <div class="win-teaching-tip-text">
            <WinTextBlock v-if="Title" class="win-teaching-tip-title" :Text="Title" TextWrapping="WrapWholeWords" />
            <WinTextBlock v-if="Subtitle" class="win-teaching-tip-subtitle" :Text="Subtitle" TextWrapping="WrapWholeWords" />
            <div v-if="$slots.default || Content" class="win-teaching-tip-content">
              <slot>{{ Content }}</slot>
            </div>
          </div>
          <button
            v-if="ShowAlternateCloseButton"
            class="win-teaching-tip-close"
            type="button"
            :aria-label="t('text.close')"
            v-bind="{ 'tooltipservice.tooltip': t('text.close') }"
            @click="close">
            <span class="icon" aria-hidden="true">&#xE711;</span>
          </button>
        </div>
        <div
          v-if="ActionButtonContent || CloseButtonContent || $slots.actions"
          class="win-teaching-tip-actions"
          :class="{ 'both-buttons-visible': ActionButtonContent && CloseButtonContent }">
          <slot name="actions">
            <WinButton v-if="ActionButtonContent" class="win-teaching-tip-action-button" @Click="onAction">
              <WinTextBlock :Text="ActionButtonContent" />
            </WinButton>
            <WinButton v-if="CloseButtonContent" class="win-teaching-tip-close-button" @Click="close">
              <WinTextBlock :Text="CloseButtonContent" />
            </WinButton>
          </slot>
        </div>
        <span v-if="isTargeted" class="win-teaching-tip-tail" aria-hidden="true"></span>
      </section>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WinButton from './WinButton.vue';
import WinTextBlock from './WinTextBlock.vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();

const props = defineProps({
  IsOpen: { type: Boolean, default: undefined },
  visible: { type: Boolean, default: undefined },
  Target: { type: Object, default: null },
  target: { type: Object, default: null },
  Title: { type: String, default: '' },
  title: { type: String, default: '' },
  Subtitle: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  Content: { type: [String, Number], default: '' },
  PreferredPlacement: { type: String, default: 'Auto' },
  preferredPlacement: { type: String, default: '' },
  PlacementMargin: { type: Number, default: 8 },
  IsLightDismissEnabled: { type: Boolean, default: true },
  ActionButtonContent: { type: String, default: '' },
  CloseButtonContent: { type: String, default: '' },
  ShouldShowCloseButton: { type: Boolean, default: true },
  IconSource: { type: [String, Object], default: '' },
  isTargeted: { type: Boolean, default: undefined }
});

const emit = defineEmits(['update:IsOpen', 'update:visible', 'ActionButtonClick', 'CloseButtonClick', 'Opened', 'Closed', 'action', 'close']);

const tipRef = ref(null);
const localIsOpen = ref(false);
const position = ref({ top: 0, left: 0, tailLeft: 168 });
const actualPlacement = ref('Bottom');

const effectiveIsOpen = computed(() => props.IsOpen ?? props.visible ?? localIsOpen.value);
const targetValue = computed(() => props.Target || props.target);
const isTargeted = computed(() => props.isTargeted ?? Boolean(targetElement()));
const Title = computed(() => props.Title || props.title);
const Subtitle = computed(() => props.Subtitle || props.subtitle);
const PreferredPlacement = computed(() => props.PreferredPlacement || props.preferredPlacement || 'Auto');
const ActionButtonContent = computed(() => props.ActionButtonContent);
const CloseButtonContent = computed(() => props.CloseButtonContent);
const ShouldShowCloseButton = computed(() => props.ShouldShowCloseButton);
const ShowAlternateCloseButton = computed(() => ShouldShowCloseButton.value && !CloseButtonContent.value);
const IconSource = computed(() => props.IconSource);
const Content = computed(() => props.Content);
const iconGlyph = computed(() => IconSource.value === 'Refresh' ? '\uE72C' : IconSource.value);
const tipStyle = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  '--teaching-tip-tail-left': `${position.value.tailLeft}px`
}));

function targetElement() {
  const value = targetValue.value;
  if (!value) return null;
  if (value instanceof HTMLElement) return value;
  if (value.$el instanceof HTMLElement) return value.$el;
  if (value.value instanceof HTMLElement) return value.value;
  if (value.value?.$el instanceof HTMLElement) return value.value.$el;
  return null;
}

const setOpen = (value) => {
  localIsOpen.value = value;
  emit('update:IsOpen', value);
  emit('update:visible', value);
  emit(value ? 'Opened' : 'Closed');
};

const close = () => {
  if (!effectiveIsOpen.value) return;
  emit('CloseButtonClick');
  emit('close');
  setOpen(false);
};

const onAction = () => {
  emit('ActionButtonClick');
  emit('action');
  setOpen(false);
};

const updatePosition = async () => {
  await nextTick();
  const tip = tipRef.value;
  if (!tip) return;
  const tipRect = tip.getBoundingClientRect();
  const margin = Number(props.PlacementMargin) || 0;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const target = targetElement();

  if (!target) {
    const edgeMargin = 24;
    const offset = margin;
    const bottomTop = viewportHeight - tipRect.height - edgeMargin - offset;
    const topTop = edgeMargin + offset;
    const fitsBottom = bottomTop >= edgeMargin;
    const fitsTop = topTop + tipRect.height <= viewportHeight - edgeMargin;
    actualPlacement.value = fitsBottom || !fitsTop ? 'Bottom' : 'Top';
    position.value = {
      top: clamp(actualPlacement.value === 'Bottom' ? bottomTop : topTop, edgeMargin, viewportHeight - tipRect.height - edgeMargin),
      left: clamp((viewportWidth - tipRect.width) / 2, edgeMargin, viewportWidth - tipRect.width - edgeMargin),
      tailLeft: tipRect.width / 2
    };
    return;
  }

  const rect = target.getBoundingClientRect();
  const preferred = normalizePlacement(PreferredPlacement.value);
  const tailInset = 8;
  const verticalExtent = tipRect.height + tailInset;
  const spaceBelow = viewportHeight - rect.bottom - margin;
  const spaceAbove = rect.top - margin;
  const placement = choosePlacement(preferred, verticalExtent, spaceAbove, spaceBelow);
  actualPlacement.value = placement;

  let top = placement === 'Top' ? rect.top - tipRect.height - margin : rect.bottom + margin;
  let left = rect.left + rect.width / 2 - tipRect.width / 2;
  top = clamp(top, margin, viewportHeight - tipRect.height - margin);
  left = clamp(left, margin, viewportWidth - tipRect.width - margin);
  const targetCenter = rect.left + rect.width / 2;
  const tailLeft = clamp(targetCenter - left, 18, tipRect.width - 18);
  position.value = { top, left, tailLeft };
};

function normalizePlacement(value) {
  const placement = String(value || 'Auto').toLowerCase();
  if (placement === 'top') return 'Top';
  if (placement === 'bottom') return 'Bottom';
  return 'Auto';
}

function choosePlacement(preferred, tipExtent, spaceAbove, spaceBelow) {
  const fitsTop = spaceAbove >= tipExtent;
  const fitsBottom = spaceBelow >= tipExtent;
  if (preferred === 'Top') return fitsTop || !fitsBottom ? 'Top' : 'Bottom';
  if (preferred === 'Bottom') return fitsBottom || !fitsTop ? 'Bottom' : 'Top';
  if (fitsTop) return 'Top';
  if (fitsBottom) return 'Bottom';
  return spaceAbove >= spaceBelow ? 'Top' : 'Bottom';
}

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.max(min, Math.min(max, value));
}

watch(effectiveIsOpen, (value) => {
  if (value) void updatePosition();
});

const onViewportChanged = () => {
  if (effectiveIsOpen.value) void updatePosition();
};

onMounted(() => {
  window.addEventListener('resize', onViewportChanged);
  window.addEventListener('scroll', onViewportChanged, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportChanged);
  window.removeEventListener('scroll', onViewportChanged, true);
});

defineExpose({ close, updatePosition });
</script>

<style>
.win-teaching-tip {
  position: fixed;
  z-index: var(--win-teaching-tip-z-index, var(--win-tip-z-index, 2147483647));
  width: max-content;
  min-width: min(320px, calc(100vw - 16px));
  max-width: min(336px, calc(100vw - 16px));
  min-height: 40px;
  max-height: min(520px, calc(100vh - 16px));
  overflow: visible;
  color: var(--text-primary);
  --win-acrylic-fill: var(--flyout-background, var(--flyout-bg));
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--surface-stroke-color-flyout, var(--flyout-border));
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  -webkit-backdrop-filter: var(--flyout-backdrop);
  backdrop-filter: var(--flyout-backdrop);
}

.win-teaching-tip-hero {
  height: 100px;
  overflow: hidden;
  border-radius: 7px 7px 0 0;
}

.win-teaching-tip-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
}

.win-teaching-tip-icon {
  flex: 0 0 auto;
  width: 20px;
  color: var(--text-primary);
  font-size: 16px;
  line-height: 20px;
  text-align: center;
}

.win-teaching-tip-text {
  min-width: 0;
  flex: 1;
}

.win-teaching-tip-title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.win-teaching-tip-subtitle,
.win-teaching-tip-content {
  margin-top: 0;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 20px;
}

.win-teaching-tip-close {
  width: 40px;
  height: 40px;
  margin: -12px -12px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 16px;
}

.win-teaching-tip-close:hover {
  background: var(--subtle-secondary);
}

.win-teaching-tip-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-content: stretch;
  gap: 0;
  padding: 0 12px 12px;
}

.win-teaching-tip-actions.both-buttons-visible {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 8px;
}

.win-teaching-tip-action-button,
.win-teaching-tip-close-button {
  width: 100%;
  margin-top: 12px;
}

.win-teaching-tip-tail {
  position: absolute;
  left: var(--teaching-tip-tail-left, 50%);
  width: 16px;
  height: 16px;
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--surface-stroke-color-flyout, var(--flyout-border));
  transform: translateX(-50%) rotate(45deg);
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
  backdrop-filter: var(--flyout-backdrop, blur(30px));
}

.win-teaching-tip-tail::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: var(--win-acrylic-fill, var(--flyout-background, var(--flyout-bg)));
}

.win-teaching-tip.placement-bottom .win-teaching-tip-tail {
  top: -8px;
  border-right: 0;
  border-bottom: 0;
}

.win-teaching-tip.placement-bottom {
  transform-origin: var(--teaching-tip-tail-left, 50%) 0;
}

.win-teaching-tip.placement-top .win-teaching-tip-tail {
  bottom: -8px;
  border-left: 0;
  border-top: 0;
}

.win-teaching-tip.placement-top {
  transform-origin: var(--teaching-tip-tail-left, 50%) 100%;
}

.win-teaching-tip-enter-active {
  animation: win-teaching-tip-enter 167ms cubic-bezier(0, 0, 0, 1) both;
}

.win-teaching-tip-leave-active {
  animation: win-teaching-tip-exit 167ms cubic-bezier(0.7, 0, 1, 0.5) both;
}

@keyframes win-teaching-tip-enter {
  from {
    opacity: 0;
    transform: scale(0.08);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes win-teaching-tip-exit {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.08);
  }
}
</style>
