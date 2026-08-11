<template>
  <WinAppBarButton
    v-bind="$attrs"
    :class="{
      'win-appbar-toggle-button': true,
      'appbar-toggle-button-checked': isChecked === true || isChecked === null,
      'appbar-toggle-button-indeterminate': isChecked === null
    }"
    :aria-pressed="isChecked === null ? 'mixed' : isChecked"
    @Click="handleClick">
    <template v-if="$slots.content || $slots.default" #content>
      <slot name="content"><slot /></slot>
    </template>
  </WinAppBarButton>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import WinAppBarButton from './WinAppBarButton.vue';

defineOptions({ inheritAttrs: false });

type CheckedValue = boolean | null;
type XamlBoolean = boolean | string;

const props = withDefaults(defineProps<{
  IsChecked?: CheckedValue | string;
  IsThreeState?: XamlBoolean;
}>(), {
  IsChecked: false,
  IsThreeState: false
});

const emit = defineEmits<{
  Click: [event: MouseEvent];
  Checked: [event: MouseEvent];
  Unchecked: [event: MouseEvent];
  Indeterminate: [event: MouseEvent];
  'update:IsChecked': [value: CheckedValue];
}>();

const isTrue = (value: unknown) => value === true || value === 'True' || value === 'true';
const isNull = (value: unknown) => value === null || value === 'Null' || value === 'null';
const normalizeChecked = (value: unknown): CheckedValue => isNull(value) ? null : isTrue(value);
const isThreeState = () => isTrue(props.IsThreeState);
const isChecked = ref<CheckedValue>(normalizeChecked(props.IsChecked));

watch(() => props.IsChecked, (value) => {
  isChecked.value = normalizeChecked(value);
});

const nextChecked = (): CheckedValue => {
  if (!isThreeState()) return isChecked.value !== true;
  if (isChecked.value === false) return true;
  if (isChecked.value === true) return null;
  return false;
};

const handleClick = (event: MouseEvent) => {
  const nextValue = nextChecked();
  isChecked.value = nextValue;
  emit('update:IsChecked', nextValue);
  if (nextValue === true) emit('Checked', event);
  else if (nextValue === false) emit('Unchecked', event);
  else emit('Indeterminate', event);
  emit('Click', event);
};
</script>

<style>
/* AppBarToggleButton reuses AppBarButton's layout and interaction states.
   These are the toggle-only checked resources from the WinUI theme. */
.win-appbar-button.win-appbar-toggle-button {
  --AppBarButtonBorderThickness: 1px;
}

.win-appbar-button.win-appbar-toggle-button.appbar-toggle-button-checked {
  color: var(--AppBarToggleButtonForegroundChecked, var(--TextOnAccentFillColorPrimaryBrush, var(--accent-text)));
}

.win-appbar-button.win-appbar-toggle-button.appbar-toggle-button-checked .appbar-button-inner-border {
  background: var(--AppBarToggleButtonBackgroundChecked, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  border-color: var(--AppBarToggleButtonBorderBrushChecked, var(--AccentControlElevationBorderBrush, var(--accent-base)));
}

.win-appbar-button.win-appbar-toggle-button.appbar-toggle-button-checked.pointer-over {
  color: var(--AppBarToggleButtonForegroundCheckedPointerOver, var(--TextOnAccentFillColorPrimaryBrush, var(--accent-text)));
}

.win-appbar-button.win-appbar-toggle-button.appbar-toggle-button-checked.pointer-over .appbar-button-inner-border {
  background: var(--AppBarToggleButtonBackgroundCheckedPointerOver, var(--AccentFillColorSecondaryBrush, var(--accent-hover)));
  border-color: var(--AppBarToggleButtonBorderBrushCheckedPointerOver, var(--AccentControlElevationBorderBrush, var(--accent-base)));
}

.win-appbar-button.win-appbar-toggle-button.appbar-toggle-button-checked.pressed {
  color: var(--AppBarToggleButtonForegroundCheckedPressed, var(--TextOnAccentFillColorSecondaryBrush, var(--accent-text)));
}

.win-appbar-button.win-appbar-toggle-button.appbar-toggle-button-checked.pressed .appbar-button-inner-border {
  background: var(--AppBarToggleButtonBackgroundCheckedPressed, var(--AccentFillColorTertiaryBrush, var(--accent-pressed)));
  border-color: var(--AppBarToggleButtonBorderBrushCheckedPressed, transparent);
}

.win-appbar-button.win-appbar-toggle-button.appbar-toggle-button-checked:disabled {
  color: var(--AppBarToggleButtonForegroundCheckedDisabled, var(--TextOnAccentFillColorDisabled, var(--text-disabled)));
}

.win-appbar-button.win-appbar-toggle-button.appbar-toggle-button-checked:disabled .appbar-button-inner-border {
  background: var(--AppBarToggleButtonBackgroundCheckedDisabled, var(--AccentFillColorDisabledBrush, var(--accent-fill-disabled)));
  border-color: var(--AppBarToggleButtonBorderBrushCheckedDisabled, transparent);
}
</style>
