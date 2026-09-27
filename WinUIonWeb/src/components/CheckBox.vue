<template>
  <div
    ref="checkboxElement"
    class="win-checkbox"
    :class="stateClasses"
    :style="checkboxStyle"
    :tabindex="isTabStop ? (isDisabled ? -1 : 0) : -1"
    role="checkbox"
    :aria-checked="ariaChecked"
    :aria-disabled="isDisabled"
    v-bind="forwardedAttrs"
    @click="toggle"
    @pointerenter="iconInput.PointerEntered"
    @pointerleave="iconInput.PointerExited"
    @pointerdown="iconInput.PointerPressed"
    @pointerup="iconInput.PointerReleased"
    @pointercancel="iconInput.PointerExited"
    @lostpointercapture="iconInput.PointerExited"
    @keydown="onKeyDown"
    @keyup="onKeyUp"
    @focusout="onLostFocus">
    <span class="checkbox-box" aria-hidden="true">
      <AnimatedIcon class="checkbox-glyph" Width="18" Height="18" HorizontalAlignment="Center" VerticalAlignment="Center" Margin="{x:Bind CheckGlyphMargin, Mode=OneWay}">
        <AnimatedIcon.Source><animatedvisuals:AnimatedAcceptVisualSource /></AnimatedIcon.Source>
        <AnimatedIcon.FallbackIconSource><FontIconSource Glyph="&#xE73E;" FontSize="12" /></AnimatedIcon.FallbackIconSource>
      </AnimatedIcon>
    </span>
    <span class="checkbox-content">
      <slot>{{ resolvedContent }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, provide, ref, useAttrs, watch } from 'vue';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import AnimatedIcon from './AnimatedIcon.vue';
import { useAnimatedIconInput } from './animatedIconInput';

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  IsChecked: { type: [Boolean, String, null], default: undefined },
  IsThreeState: { type: [Boolean, String], default: undefined },
  IsEnabled: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: true },
  Margin: { type: String, default: '' }
});
const instance = getCurrentInstance();
const attrs = useAttrs();
const forwardedAttrs = computed(() => {
  const { class: _class, style: _style, Click: _click, onClick: _onClick, onPointerdown: _onPointerdown, ...rest } = attrs;
  return rest;
});
const resolvedContent = computed(() => resolveXamlValue(props.Content, instance));
const resolvedIsChecked = computed(() => resolveXamlValue(props.IsChecked, instance));
const resolvedIsThreeState = computed(() => resolveXamlValue(props.IsThreeState, instance));
const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false);

const emit = defineEmits([
  'Click',
  'update:IsChecked',
  'Checked',
  'Unchecked',
  'Indeterminate'
]);

const localChecked = ref(false);
const boundChecked = ref<boolean | null | undefined>(undefined);
const isThreeState = computed(() => resolvedIsThreeState.value === true);
// XAML's IsTabStop="False" removes the control from the tab order without
// disabling it, which is what ItemContainer's selection checkbox uses.
const isTabStop = computed(() => resolveXamlValue(props.IsTabStop, instance) !== false);
const isDisabled = computed(() => !resolvedIsEnabled.value);

const currentValue = computed(() => {
  if (boundChecked.value !== undefined) return boundChecked.value;
  return localChecked.value;
});

watch(resolvedIsChecked, isChecked => {
  if (isChecked !== undefined) {
    // A three-state XAML binding uses null for Indeterminate. Do not coerce it
    // to false when the page's TwoWay source sends the value back down.
    boundChecked.value = isChecked === null ? null : isChecked === true;
  }
  else boundChecked.value = undefined;
}, { immediate: true });

const isChecked = computed(() => currentValue.value === true);
const isIndeterminate = computed(() => isThreeState.value && currentValue.value === null);
const ariaChecked = computed(() => isIndeterminate.value ? 'mixed' : String(isChecked.value));

const stateClasses = computed(() => ({
  'is-checked': isChecked.value,
  'is-unchecked': !isChecked.value && !isIndeterminate.value,
  'is-indeterminate': isIndeterminate.value,
  'is-disabled': isDisabled.value
}));

const checkboxElement = ref<HTMLElement | null>(null);
const iconInput = useAnimatedIconInput(false, state => `${state === 'Disabled' ? 'Normal' : state}${isIndeterminate.value ? 'Indeterminate' : isChecked.value ? 'On' : 'Off'}`);
watch(checkboxElement, element => iconInput.Attach(element), { flush: 'post' });
watch([isChecked, isIndeterminate, isDisabled], () => iconInput.Refresh(), { flush: 'post' });
provide(xamlScopeKey, {
  ...inject(xamlScopeKey, {}),
  CheckGlyphMargin: computed(() => isIndeterminate.value ? '0' : '0,1,0,-1')
});

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (!value) return '';
  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return value;
};

const checkboxStyle = computed(() => props.Margin ? { margin: xamlThickness(props.Margin) } : {});

const emitState = (value, originalEvent?: MouseEvent | KeyboardEvent) => {
  if (value === currentValue.value) return;
  // XAML OneWay bindings still allow the control to change its target value.
  // Keep a local value until the source sends a newer value back down.
  boundChecked.value = value;
  localChecked.value = value === true;
  emit('update:IsChecked', value);
  updateXamlBinding(props.IsChecked, value, instance);
  const args = { OriginalSource: publicApi, OriginalEvent: originalEvent, Handled: false };

  const name = value === true ? 'Checked' : value === null ? 'Indeterminate' : 'Unchecked';
  const listener = instance?.vnode.props?.[`on${name}`];
  if (listener) {
    for (const handler of Array.isArray(listener) ? listener : [listener]) if (typeof handler === 'function') handler(publicApi, args);
  } else {
    emit(name, publicApi, args);
    resolveXamlHandler(attrs[name], instance)?.(publicApi, args);
  }
};

const publicApi = {
  get IsChecked() { return currentValue.value; },
  set IsChecked(value: boolean | null) { emitState(value); },
  get IsEnabled() { return !isDisabled.value; },
  get Content() { return resolvedContent.value; },
  get Element() { return checkboxElement.value; }
};
defineExpose(publicApi);

const toggle = (originalEvent?: MouseEvent | KeyboardEvent) => {
  if (isDisabled.value || (originalEvent instanceof KeyboardEvent && originalEvent.repeat)) return;
  if (isThreeState.value) {
    if (currentValue.value === false) emitState(true, originalEvent);
    else if (currentValue.value === true) emitState(null, originalEvent);
    else emitState(false, originalEvent);
  } else emitState(!isChecked.value, originalEvent);
  const args = { OriginalEvent: originalEvent, Handled: false };
  emit('Click', publicApi, args);
  if (!instance?.vnode.props?.onClick) resolveXamlHandler(attrs.Click, instance)?.(publicApi, args);
};
let spacePressed = false;
const onKeyDown = (event: KeyboardEvent) => {
  iconInput.KeyDown(event);
  if (event.key !== ' ' && event.key !== 'Spacebar') return;
  event.preventDefault();
  if (!event.repeat && !isDisabled.value) spacePressed = true;
};
const onKeyUp = (event: KeyboardEvent) => {
  iconInput.KeyUp(event);
  if (event.key !== ' ' && event.key !== 'Spacebar') return;
  event.preventDefault();
  const invoke = spacePressed && !isDisabled.value;
  spacePressed = false;
  if (invoke) toggle(event);
};
const onLostFocus = (event: FocusEvent) => { spacePressed = false; iconInput.LostFocus(event); };
watch(isDisabled, disabled => { if (disabled) spacePressed = false; });
</script>

<style>
.win-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0;
  width: fit-content;
  align-self: flex-start;
  color: var(--CheckBoxForeground, var(--text-primary));
  background: transparent;
  border: 0;
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
  user-select: none;
}

.win-checkbox:focus-visible {
  outline: 2px solid var(--focus-stroke-outer, var(--text-primary));
  outline-offset: 2px;
  border-radius: 2px;
}

.checkbox-box {
  width: 20px;
  height: 20px;
  min-width: 20px;
  position: relative;
  box-sizing: border-box;
  border: 1px solid var(--CheckBoxCheckBackgroundStroke, var(--ctrl-strong-stroke));
  border-radius: 4px;
  background: var(--CheckBoxCheckBackgroundFill, var(--ctrl-fill-default));
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.checkbox-glyph {
  font-size: 12px;
  line-height: 1;
  color: var(--CheckBoxCheckGlyphForeground, var(--TextOnAccentFillColorPrimaryBrush, var(--accent-text)));
}

.checkbox-content {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.win-checkbox.is-unchecked {
  --CheckBoxCheckBackgroundFill: var(--ctrl-fill-default);
  --CheckBoxCheckBackgroundStroke: var(--ctrl-strong-stroke);
}

.win-checkbox.is-unchecked:hover {
  --CheckBoxCheckBackgroundFill: var(--ctrl-fill-secondary);
  --CheckBoxCheckBackgroundStroke: var(--ctrl-strong-stroke);
}

.win-checkbox.is-unchecked:active {
  --CheckBoxCheckBackgroundFill: var(--ctrl-fill-tertiary);
  --CheckBoxCheckBackgroundStroke: var(--ctrl-strong-stroke-disabled);
}

.win-checkbox.is-checked,
.win-checkbox.is-indeterminate {
  --CheckBoxCheckBackgroundFill: var(--accent-base);
  --CheckBoxCheckBackgroundStroke: var(--accent-base);
  --CheckBoxCheckGlyphForeground: var(--accent-text);
}

.win-checkbox.is-checked:hover,
.win-checkbox.is-indeterminate:hover {
  --CheckBoxCheckBackgroundFill: var(--accent-hover);
  --CheckBoxCheckBackgroundStroke: var(--accent-hover);
}

.win-checkbox.is-checked:active,
.win-checkbox.is-indeterminate:active {
  --CheckBoxCheckBackgroundFill: var(--accent-pressed);
  --CheckBoxCheckBackgroundStroke: var(--accent-pressed);
  --CheckBoxCheckGlyphForeground: var(--accent-text-secondary);
}

.win-checkbox.is-disabled {
  pointer-events: none;
  cursor: default;
  color: var(--text-disabled);
}

.win-checkbox.is-disabled .checkbox-box {
  background: var(--ctrl-fill-disabled);
  border-color: var(--ctrl-strong-stroke-disabled);
}

.win-checkbox.is-disabled.is-checked .checkbox-box,
.win-checkbox.is-disabled.is-indeterminate .checkbox-box {
  background: var(--accent-fill-disabled);
  border-color: var(--accent-fill-disabled);
}

.win-checkbox.is-disabled .checkbox-glyph {
  color: var(--text-disabled);
}
</style>
