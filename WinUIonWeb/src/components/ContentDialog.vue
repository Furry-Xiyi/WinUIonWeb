<template>
  <Teleport to="body">
    <Transition
      appear
      name="content-dialog"
      :duration="{ enter: 250, leave: 167 }">
      <div
        v-if="effectiveIsOpen"
        class="content-dialog-overlay win-theme-scope"
        :class="dialogThemeClass"
        :style="dialogThemeStyle"
        @pointerdown.self="onOverlayPointerDown">
        <section class="content-dialog" role="dialog" aria-modal="true" :aria-labelledby="Title ? titleId : undefined">
          <ScrollViewer
            class="content-dialog-content"
            VerticalScrollMode="Auto"
            VerticalScrollBarVisibility="Auto"
            HorizontalScrollMode="Disabled"
            HorizontalScrollBarVisibility="Disabled">
            <TextBlock
              v-if="Title"
              :id="titleId"
              class="content-dialog-title"
              Text="{x:Bind DialogTitle}"
              FontSize="20"
              FontWeight="600"
              TextWrapping="WrapWholeWords" />
            <div class="content-dialog-body">
              <slot v-if="hasContentSlot"></slot>
              <TextBlock v-else-if="Content" Text="{x:Bind DialogContent}" TextWrapping="WrapWholeWords" />
            </div>
          </ScrollViewer>
          <div v-if="hasCommandButtons" class="content-dialog-command-space" :class="commandSpaceClass">
            <Button
              v-if="PrimaryButtonText"
              class="content-dialog-button content-dialog-primary"
              Style="{x:Bind PrimaryButtonStyle}"
              IsEnabled="{x:Bind IsPrimaryButtonEnabled}"
              Click="OnPrimaryButtonClick">
              <TextBlock Text="{x:Bind PrimaryButtonText}" FontSize="14" FontWeight="400" />
            </Button>
            <Button
              v-if="SecondaryButtonText"
              class="content-dialog-button content-dialog-secondary"
              Style="{x:Bind SecondaryButtonStyle}"
              IsEnabled="{x:Bind IsSecondaryButtonEnabled}"
              Click="OnSecondaryButtonClick">
              <TextBlock Text="{x:Bind SecondaryButtonText}" FontSize="14" FontWeight="400" />
            </Button>
            <Button
              v-if="CloseButtonText"
              class="content-dialog-button content-dialog-close"
              Style="{x:Bind CloseButtonStyle}"
              Click="OnCloseButtonClick">
              <TextBlock Text="{x:Bind CloseButtonText}" FontSize="14" FontWeight="400" />
            </Button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, getCurrentInstance, inject, provide, ref, unref, useAttrs, useSlots } from 'vue';
import Button from './Button.vue';
import ScrollViewer from './ScrollViewer.vue';
import TextBlock from './TextBlock.vue';
import { resolveXamlHandler, resolveXamlValue, xamlScopeKey } from './xamlRuntime';

defineOptions({ name: 'ContentDialog' });

const props = defineProps({
  IsOpen: { type: [Boolean, String], default: undefined },
  Title: { type: [String, Number], default: '' },
  Content: { type: [String, Number], default: '' },
  PrimaryButtonText: { type: [String, Number], default: '' },
  SecondaryButtonText: { type: [String, Number], default: '' },
  CloseButtonText: { type: [String, Number], default: '' },
  DefaultButton: { type: String, default: 'None' },
  IsPrimaryButtonEnabled: { type: [Boolean, String], default: true },
  IsSecondaryButtonEnabled: { type: [Boolean, String], default: true },
  FullSizeDesired: { type: [Boolean, String], default: false },
  IsLightDismissEnabled: { type: [Boolean, String], default: false },
  Theme: { type: String, default: '' }
});

const emit = defineEmits([
  'update:IsOpen',
  'PrimaryButtonClick',
  'SecondaryButtonClick',
  'CloseButtonClick',
  'Closed',
  'Opened',
]);

const localIsOpen = ref(false);
const instance = getCurrentInstance();
const attrs = useAttrs();
const slots = useSlots();
const inheritedTheme = inject('winuiTheme', null);
const titleId = `content-dialog-title-${Math.random().toString(36).slice(2)}`;

const resolve = (value) => resolveXamlValue(value, instance);
const effectiveIsOpen = computed(() => resolve(props.IsOpen) ?? localIsOpen.value);
const Title = computed(() => resolve(props.Title));
const Content = computed(() => resolve(props.Content));
const DialogTitle = computed(() => Title.value);
const DialogContent = computed(() => Content.value);
const PrimaryButtonText = computed(() => resolve(props.PrimaryButtonText));
const SecondaryButtonText = computed(() => resolve(props.SecondaryButtonText));
const CloseButtonText = computed(() => resolve(props.CloseButtonText));
const IsPrimaryButtonEnabled = computed(() => resolve(props.IsPrimaryButtonEnabled) !== false);
const IsSecondaryButtonEnabled = computed(() => resolve(props.IsSecondaryButtonEnabled) !== false);
const dialogThemeClass = computed(() => {
  const explicit = String(resolve(props.Theme) || '').toLowerCase();
  const provided = String(unref(inheritedTheme) || '').toLowerCase();
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  const system = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = explicit === 'light' || explicit === 'dark'
    ? explicit
    : provided === 'light' || provided === 'dark'
      ? provided
      : root?.classList.contains('theme-dark') || root?.dataset.theme === 'dark'
        ? 'dark'
        : root?.classList.contains('theme-light') || root?.dataset.theme === 'light'
          ? 'light'
          : system;
  return theme === 'light' || theme === 'dark' ? `theme-${theme}` : '';
});
const dialogThemeStyle = computed(() => {
  const theme = dialogThemeClass.value === 'theme-dark' ? 'dark' : 'light';
  return theme === 'dark'
    ? {
        '--ContentDialogBackground': '#2C2C2C',
        '--ContentDialogTopOverlay': 'rgba(43, 43, 43, 0)',
        '--ContentDialogCommandSpaceBackground': '#202020',
        '--ContentDialogForeground': '#FFFFFF',
        '--TextFillColorPrimaryBrush': '#FFFFFF',
        '--LayerFillColorAltBrush': 'rgba(255, 255, 255, 0.051)',
        '--SolidBackgroundFillColorBaseBrush': '#202020',
        '--content-dialog-content-bg': 'rgba(43, 43, 43, 0)',
        '--content-dialog-command-bg': '#202020'
      }
    : {
        '--ContentDialogBackground': '#F3F3F3',
        '--ContentDialogTopOverlay': '#FFFFFF',
        '--ContentDialogCommandSpaceBackground': '#F3F3F3',
        '--ContentDialogForeground': 'rgba(0, 0, 0, 0.8956)',
        '--TextFillColorPrimaryBrush': 'rgba(0, 0, 0, 0.8956)',
        '--LayerFillColorAltBrush': '#FFFFFF',
        '--SolidBackgroundFillColorBaseBrush': '#F3F3F3',
        '--content-dialog-content-bg': '#FFFFFF',
        '--content-dialog-command-bg': '#F3F3F3'
      };
});
const DefaultButton = computed(() => {
  return resolve(props.DefaultButton) || 'None';
});
const PrimaryButtonStyle = computed(() => DefaultButton.value === 'Primary' ? 'AccentButtonStyle' : 'DefaultButtonStyle');
const SecondaryButtonStyle = computed(() => DefaultButton.value === 'Secondary' ? 'AccentButtonStyle' : 'DefaultButtonStyle');
const CloseButtonStyle = computed(() => DefaultButton.value === 'Close' ? 'AccentButtonStyle' : 'DefaultButtonStyle');
const hasPrimaryButton = computed(() => Boolean(PrimaryButtonText.value));
const hasSecondaryButton = computed(() => Boolean(SecondaryButtonText.value));
const hasCloseButton = computed(() => Boolean(CloseButtonText.value));
const hasContentSlot = computed(() => Boolean(slots.default));
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
  const binding = typeof props.IsOpen === 'string' ? props.IsOpen.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/) : null;
  if (binding) resolveXamlHandler(`${binding[1].replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, '').trim()} = $event`, instance)?.(value);
  if (value) {
    emit('Opened');
    resolveXamlHandler(attrs.Opened, instance)?.();
  }
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
    resolveXamlHandler(attrs.PrimaryButtonClick, instance)?.();
  } else if (result === 'Secondary') {
    emit('SecondaryButtonClick');
    resolveXamlHandler(attrs.SecondaryButtonClick, instance)?.();
  } else {
    emit('CloseButtonClick');
    resolveXamlHandler(attrs.CloseButtonClick, instance)?.();
  }
  setOpen(false);
  emit('Closed', result);
  resolveXamlHandler(attrs.Closed, instance)?.(result);
  pendingResolve?.(result);
  pendingResolve = null;
};

const OnPrimaryButtonClick = () => closeWithResult('Primary');
const OnSecondaryButtonClick = () => closeWithResult('Secondary');
const OnCloseButtonClick = () => closeWithResult('None');
provide(xamlScopeKey, {
  OnPrimaryButtonClick,
  OnSecondaryButtonClick,
  OnCloseButtonClick,
  PrimaryButtonText,
  SecondaryButtonText,
  CloseButtonText,
  IsPrimaryButtonEnabled,
  IsSecondaryButtonEnabled,
  PrimaryButtonStyle,
  SecondaryButtonStyle,
  CloseButtonStyle,
  DialogTitle,
  DialogContent
});

const onOverlayPointerDown = () => {
  if (resolve(props.IsLightDismissEnabled)) closeWithResult('None');
};

defineExpose({
  ShowAsync: showAsync,
  showAsync,
  hide: () => closeWithResult('None')
});
</script>

<style>
.content-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--SmokeFillColorDefaultBrush, var(--dialog-overlay, rgba(0, 0, 0, 0.30)));
}

.content-dialog {
  width: min(100%, var(--ContentDialogMaxWidth, 548px));
  min-width: min(100%, var(--ContentDialogMinWidth, 320px));
  min-height: var(--ContentDialogMinHeight, 184px);
  max-height: min(var(--ContentDialogMaxHeight, 756px), calc(100vh - 48px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--ContentDialogForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  background: var(--ContentDialogBackground, var(--SolidBackgroundFillColorBaseBrush, var(--dialog-background)));
  border: var(--ContentDialogBorderWidth, 1px) solid var(--ContentDialogBorderBrush, var(--SurfaceStrokeColorDefaultBrush, var(--flyout-border)));
  border-radius: var(--OverlayCornerRadius, 8px);
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.28);
}

.content-dialog-content {
  min-height: 0;
  flex: 1 1 auto;
  padding: var(--ContentDialogPadding, 24px);
  background: var(--content-dialog-content-bg, var(--ContentDialogTopOverlay, var(--LayerFillColorAltBrush, var(--dialog-content-bg))));
  border-bottom: var(--ContentDialogSeparatorThickness, 1px) solid var(--ContentDialogSeparatorBorderBrush, var(--CardStrokeColorDefaultBrush, var(--dialog-divider)));
}

.content-dialog-title {
  margin: 0 0 12px;
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.content-dialog-body {
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
  font-size: 14px;
  line-height: 20px;
}

.content-dialog-command-space {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 0 0 8px minmax(0, 1fr);
  column-gap: 0;
  padding: var(--ContentDialogPadding, 24px);
  background: var(--content-dialog-command-bg, var(--ContentDialogCommandSpaceBackground, var(--SolidBackgroundFillColorBaseBrush, var(--dialog-button-bg))));
}

.content-dialog-command-space.all-visible {
  grid-template-columns: minmax(0, 1fr) 8px minmax(0, 1fr) 8px minmax(0, 1fr);
}

.content-dialog-button {
  width: 100%;
  min-width: 0;
}

.content-dialog-primary {
  grid-column: 1;
}

.content-dialog-secondary {
  grid-column: 1;
}

.content-dialog-close {
  grid-column: 5;
}

.content-dialog-command-space.all-visible .content-dialog-secondary {
  grid-column: 3;
}

.content-dialog-command-space.primary-visible .content-dialog-primary,
.content-dialog-command-space.secondary-visible .content-dialog-secondary,
.content-dialog-command-space.primary-secondary-visible .content-dialog-secondary {
  grid-column: 5;
}

.content-dialog-enter-active {
  transition: opacity 83ms linear;
}

.content-dialog-leave-active {
  transition: opacity 83ms linear;
  pointer-events: none;
}

.content-dialog-enter-active .content-dialog {
  animation: content-dialog-enter 250ms cubic-bezier(0, 0, 0, 1) both;
}

.content-dialog-leave-active .content-dialog {
  animation: content-dialog-exit 167ms cubic-bezier(0, 0, 0, 1) both;
}

.content-dialog-appear-active .content-dialog {
  animation: content-dialog-enter 250ms cubic-bezier(0, 0, 0, 1) both;
}

.content-dialog-enter-from,
.content-dialog-leave-to {
  opacity: 0;
}

@keyframes content-dialog-enter {
  from {
    transform: scale(1.05);
  }

  to {
    transform: scale(1);
  }
}

@keyframes content-dialog-exit {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.05);
  }
}
</style>
