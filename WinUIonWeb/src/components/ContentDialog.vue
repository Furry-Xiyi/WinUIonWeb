<template>
  <Teleport to="body">
    <Transition name="win-content-dialog" :duration="{ enter: 250, leave: 167 }">
      <div
        v-if="effectiveIsOpen"
        class="win-content-dialog-overlay win-theme-scope"
        :class="dialogThemeClass"
        @pointerdown.self="onOverlayPointerDown">
        <section class="win-content-dialog" role="dialog" aria-modal="true" :aria-labelledby="Title ? titleId : undefined">
          <WinScrollViewer
            class="win-content-dialog-content"
            VerticalScrollMode="Auto"
            VerticalScrollBarVisibility="Auto"
            HorizontalScrollMode="Disabled"
            HorizontalScrollBarVisibility="Disabled">
            <WinTextBlock
              v-if="Title"
              :id="titleId"
              class="win-content-dialog-title"
              :Text="Title"
              :FontSize="20"
              :FontWeight="600"
              TextWrapping="WrapWholeWords" />
            <div class="win-content-dialog-body">
              <slot></slot>
            </div>
          </WinScrollViewer>
          <div v-if="hasCommandButtons" class="win-content-dialog-command-space" :class="commandSpaceClass">
            <WinButton
              v-if="PrimaryButtonText"
              class="win-content-dialog-button win-content-dialog-primary"
              :Style="DefaultButton === 'Primary' ? '{StaticResource AccentButtonStyle}' : '{StaticResource DefaultButtonStyle}'"
              :IsEnabled="IsPrimaryButtonEnabled"
              @Click="closeWithResult('Primary')">
              <WinTextBlock :Text="PrimaryButtonText" :FontSize="14" :FontWeight="400" />
            </WinButton>
            <WinButton
              v-if="SecondaryButtonText"
              class="win-content-dialog-button win-content-dialog-secondary"
              :Style="DefaultButton === 'Secondary' ? '{StaticResource AccentButtonStyle}' : '{StaticResource DefaultButtonStyle}'"
              :IsEnabled="IsSecondaryButtonEnabled"
              @Click="closeWithResult('Secondary')">
              <WinTextBlock :Text="SecondaryButtonText" :FontSize="14" :FontWeight="400" />
            </WinButton>
            <WinButton
              v-if="CloseButtonText"
              class="win-content-dialog-button win-content-dialog-close"
              :Style="DefaultButton === 'Close' ? '{StaticResource AccentButtonStyle}' : '{StaticResource DefaultButtonStyle}'"
              @Click="closeWithResult('None')">
              <WinTextBlock :Text="CloseButtonText" :FontSize="14" :FontWeight="400" />
            </WinButton>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue';
import WinButton from './WinButton.vue';
import WinScrollViewer from './WinScrollViewer.vue';
import WinTextBlock from './WinTextBlock.vue';

const props = defineProps({
  IsOpen: { type: Boolean, default: undefined },
  visible: { type: Boolean, default: undefined },
  Title: { type: String, default: '' },
  title: { type: String, default: '' },
  Content: { type: [String, Number], default: '' },
  PrimaryButtonText: { type: String, default: '' },
  primaryText: { type: String, default: '' },
  SecondaryButtonText: { type: String, default: '' },
  secondaryText: { type: String, default: '' },
  CloseButtonText: { type: String, default: '' },
  closeText: { type: String, default: '' },
  DefaultButton: { type: String, default: 'None' },
  defaultButton: { type: String, default: '' },
  IsPrimaryButtonEnabled: { type: Boolean, default: true },
  IsSecondaryButtonEnabled: { type: Boolean, default: true },
  FullSizeDesired: { type: Boolean, default: false },
  IsLightDismissEnabled: { type: Boolean, default: false },
  Theme: { type: String, default: '' },
  theme: { type: String, default: '' }
});

const emit = defineEmits([
  'update:IsOpen',
  'update:visible',
  'PrimaryButtonClick',
  'SecondaryButtonClick',
  'CloseButtonClick',
  'Closed',
  'Opened',
  'primary',
  'secondary',
  'close'
]);

const localIsOpen = ref(false);
const titleId = `content-dialog-title-${Math.random().toString(36).slice(2)}`;

const effectiveIsOpen = computed(() => props.IsOpen ?? props.visible ?? localIsOpen.value);
const Title = computed(() => props.Title || props.title);
const PrimaryButtonText = computed(() => props.PrimaryButtonText || props.primaryText);
const SecondaryButtonText = computed(() => props.SecondaryButtonText || props.secondaryText);
const CloseButtonText = computed(() => props.CloseButtonText || props.closeText);
const IsPrimaryButtonEnabled = computed(() => props.IsPrimaryButtonEnabled);
const IsSecondaryButtonEnabled = computed(() => props.IsSecondaryButtonEnabled);
const dialogThemeClass = computed(() => {
  const theme = props.Theme || props.theme;
  return theme === 'light' || theme === 'dark' ? `theme-${theme}` : '';
});
const DefaultButton = computed(() => {
  if (props.DefaultButton && props.DefaultButton !== 'None') return props.DefaultButton;
  if (props.defaultButton === 'primary') return 'Primary';
  if (props.defaultButton === 'secondary') return 'Secondary';
  if (props.defaultButton === 'close') return 'Close';
  return props.DefaultButton || 'None';
});
const hasPrimaryButton = computed(() => Boolean(PrimaryButtonText.value));
const hasSecondaryButton = computed(() => Boolean(SecondaryButtonText.value));
const hasCloseButton = computed(() => Boolean(CloseButtonText.value));
const hasCommandButtons = computed(() => hasPrimaryButton.value || hasSecondaryButton.value || hasCloseButton.value);
const commandSpaceClass = computed(() => ({
  'all-visible': hasPrimaryButton.value && hasSecondaryButton.value && hasCloseButton.value,
  'primary-visible': hasPrimaryButton.value && !hasSecondaryButton.value && !hasCloseButton.value,
  'secondary-visible': !hasPrimaryButton.value && hasSecondaryButton.value && !hasCloseButton.value,
  'close-visible': !hasPrimaryButton.value && !hasSecondaryButton.value && hasCloseButton.value,
  'primary-secondary-visible': hasPrimaryButton.value && hasSecondaryButton.value && !hasCloseButton.value,
  'primary-close-visible': hasPrimaryButton.value && !hasSecondaryButton.value && hasCloseButton.value,
  'secondary-close-visible': !hasPrimaryButton.value && hasSecondaryButton.value && hasCloseButton.value
}));

const setOpen = (value) => {
  localIsOpen.value = value;
  emit('update:IsOpen', value);
  emit('update:visible', value);
  if (value) emit('Opened');
};

const showAsync = () => {
  setOpen(true);
  return new Promise((resolve) => {
    pendingResolve = resolve;
  });
};

let pendingResolve = null;

const closeWithResult = (result) => {
  if (result === 'Primary') {
    emit('PrimaryButtonClick');
    emit('primary');
  } else if (result === 'Secondary') {
    emit('SecondaryButtonClick');
    emit('secondary');
  } else {
    emit('CloseButtonClick');
    emit('close');
  }
  setOpen(false);
  emit('Closed', result);
  pendingResolve?.(result);
  pendingResolve = null;
};

const onOverlayPointerDown = () => {
  if (props.IsLightDismissEnabled) closeWithResult('None');
};

defineExpose({
  ShowAsync: showAsync,
  showAsync,
  hide: () => closeWithResult('None')
});
</script>

<style>
.win-content-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--dialog-overlay);
}

.win-content-dialog {
  width: min(100%, 548px);
  min-width: min(100%, 320px);
  min-height: 184px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--text-primary);
  background: var(--dialog-background);
  border: 1px solid var(--flyout-border);
  border-radius: 8px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.28);
}

.win-content-dialog-content {
  min-height: 0;
  flex: 1 1 auto;
  padding: 24px;
  background: var(--dialog-content-bg);
  border-bottom: 1px solid var(--dialog-divider);
}

.win-content-dialog-title {
  margin: 0 0 12px;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.win-content-dialog-body {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 20px;
}

.win-content-dialog-command-space {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 0 0 8px minmax(0, 1fr);
  column-gap: 0;
  padding: 24px;
  background: var(--dialog-button-bg);
}

.win-content-dialog-command-space.all-visible {
  grid-template-columns: minmax(0, 1fr) 8px minmax(0, 1fr) 8px minmax(0, 1fr);
}

.win-content-dialog-button {
  width: 100%;
  min-width: 0;
}

.win-content-dialog-primary {
  grid-column: 1;
}

.win-content-dialog-secondary {
  grid-column: 1;
}

.win-content-dialog-close {
  grid-column: 5;
}

.win-content-dialog-command-space.all-visible .win-content-dialog-secondary {
  grid-column: 3;
}

.win-content-dialog-command-space.primary-visible .win-content-dialog-primary,
.win-content-dialog-command-space.secondary-visible .win-content-dialog-secondary,
.win-content-dialog-command-space.primary-secondary-visible .win-content-dialog-secondary {
  grid-column: 5;
}

.win-content-dialog-enter-active {
  transition: opacity 83ms linear;
}

.win-content-dialog-leave-active {
  transition: opacity 83ms linear;
  pointer-events: none;
}

.win-content-dialog-enter-active .win-content-dialog {
  animation: win-content-dialog-enter 250ms cubic-bezier(0, 0, 0, 1) both;
}

.win-content-dialog-leave-active .win-content-dialog {
  animation: win-content-dialog-exit 167ms cubic-bezier(0, 0, 0, 1) both;
}

.win-content-dialog-enter-from,
.win-content-dialog-leave-to {
  opacity: 0;
}

@keyframes win-content-dialog-enter {
  from {
    transform: scale(1.05);
  }
  to {
    transform: scale(1);
  }
}

@keyframes win-content-dialog-exit {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}
</style>
