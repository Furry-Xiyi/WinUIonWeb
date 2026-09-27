<template>
  <div
    ref="rootRef"
    class="win-item-container"
    :class="stateClasses"
    :style="rootStyle"
    :tabindex="tabIndex"
    :aria-selected="selectionEnabled ? isSelected : undefined"
    :aria-disabled="!isEnabled || undefined"
    role="option"
    @pointerenter="isPointerOver = true"
    @pointerleave="isPointerOver = false"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
    @lostpointercapture="onPointerCancel"
    @click="onClick"
    @dblclick="onDoubleClick"
    @keydown="onKeyDown"
    @focus="onFocus">
    <!-- ItemContainer's ControlTemplate: a single Grid that hosts the Child at
         index 0, then the paint-only state visuals and the selection CheckBox. -->
    <div class="win-item-container-root" :style="rootChromeStyle" v-acrylic-brush="backgroundStyle">
      <div class="win-item-container-child"><slot /></div>
      <div class="win-item-container-selection-visual" aria-hidden="true"></div>
      <div class="win-item-container-common-visual" aria-hidden="true"></div>
      <CheckBox
        v-if="showsSelectionCheckbox"
        class="win-item-container-checkbox"
        IsChecked="{x:Bind isSelected, Mode=OneWay}"
        IsTabStop="False"
        IsHitTestVisible="False"
        @click.stop
        @pointerdown.stop
        @keydown.stop />
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, inject, ref } from 'vue';
import CheckBox from './CheckBox.vue';
import { itemContainerControllerKey, itemsViewItemContextKey } from './ItemsViewState';
import { resolveXamlValue, xamlItemContextKey } from './xamlRuntime';
import { useAcrylicBrushStyle } from './AcrylicBrush';
import { vAcrylicBrush } from './acrylicBrushVisual';

const props = defineProps({
  IsSelected: { type: [Boolean, String], default: false },
  IsEnabled: { type: [Boolean, String], default: true },
  Width: { type: [String, Number], default: undefined },
  Height: { type: [String, Number], default: undefined },
  MinWidth: { type: [String, Number], default: undefined },
  MinHeight: { type: [String, Number], default: undefined },
  MaxWidth: { type: [String, Number], default: undefined },
  MaxHeight: { type: [String, Number], default: undefined },
  Margin: { type: [String, Number], default: '' },
  Background: { type: [String, Object], default: '' },
  CornerRadius: { type: [String, Number], default: '' }
});

const instance = getCurrentInstance();
const rootRef = ref(null);

// ItemsView assigns selection, multi-select, and invoke state onto each realized
// container, exactly as it does through the ItemContainer dependency properties.
const controller = inject(itemContainerControllerKey, null);
const itemContext = inject(itemsViewItemContextKey, null);
const dataItem = inject(xamlItemContextKey, undefined);

const isEnabled = computed(() => controller?.isEnabled?.() ?? resolveXamlValue(props.IsEnabled, instance) !== false);
const isSelected = computed(() => {
  if (controller && dataItem !== undefined) return controller.isSelected(dataItem);
  return resolveXamlValue(props.IsSelected, instance) === true;
});
const multiSelectMode = computed(() => controller?.multiSelectMode?.() ?? 'Single');
const selectionEnabled = computed(() => (controller?.selectionMode?.() ?? 'Single') !== 'None');
const tabIndex = computed(() => itemContext?.tabIndex?.() ?? -1);

// MultiSelectStates: Single hides PART_SelectionCheckbox; Multiple and Extended
// reveal it.
const showsSelectionCheckbox = computed(() => multiSelectMode.value === 'Multiple' || multiSelectMode.value === 'Extended');

const isPointerOver = ref(false);
const isPressed = ref(false);

// CombinedStates follows UpdateVisualState: disabled wins, then pressed,
// pointer-over, and finally the plain selected/unselected states.
const combinedState = computed(() => {
  if (!isEnabled.value) return isSelected.value ? 'SelectedNormal' : 'UnselectedNormal';
  if (isPressed.value) return isSelected.value ? 'SelectedPressed' : 'UnselectedPressed';
  if (isPointerOver.value) return isSelected.value ? 'SelectedPointerOver' : 'UnselectedPointerOver';
  return isSelected.value ? 'SelectedNormal' : 'UnselectedNormal';
});
const stateClasses = computed(() => [combinedState.value, {
  'multi-select': showsSelectionCheckbox.value,
  disabled: !isEnabled.value
}]);

const cssLength = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  return typeof value === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(value)) ? `${value}px` : String(value);
};
const xamlThickness = (value) => {
  const parts = String(value ?? '').split(',').map((part) => cssLength(part.trim())).filter(Boolean);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return undefined;
};

// The active layout owns the realized element's box. LinedFlowLayout assigns an
// explicit width and height per item; the other layouts let the element keep the
// size its own Width/Height/Margin declare.
const resolvedCornerRadius = computed(() => cssLength(resolveXamlValue(props.CornerRadius, instance)));
const rootStyle = computed(() => {
  const geometry = itemContext?.geometry?.();
  return {
    width: geometry?.width ?? cssLength(resolveXamlValue(props.Width, instance)),
    height: geometry?.height ?? cssLength(resolveXamlValue(props.Height, instance)),
    minWidth: cssLength(resolveXamlValue(props.MinWidth, instance)),
    minHeight: cssLength(resolveXamlValue(props.MinHeight, instance)),
    maxWidth: cssLength(resolveXamlValue(props.MaxWidth, instance)),
    maxHeight: cssLength(resolveXamlValue(props.MaxHeight, instance)),
    margin: xamlThickness(resolveXamlValue(props.Margin, instance)),
    flex: geometry?.flex
  };
});
const backgroundStyle = useAcrylicBrushStyle(() => props.Background || undefined, instance);
const rootChromeStyle = computed(() => ({
  borderRadius: resolvedCornerRadius.value,
  ...backgroundStyle.value
}));

const canRaiseItemInvoked = () => Boolean(controller?.canUserInvoke?.() || controller?.canUserSelect?.());

// CanRaiseItemInvoked gates the container's own ItemInvoked event; ItemsView
// then decides which triggers reach its public ItemInvoked handler and when the
// interaction also moves focus and selection.
const raiseItemInvoked = (trigger, event) => {
  if (!isEnabled.value || !canRaiseItemInvoked()) return false;
  controller?.itemInvoked?.(dataItem, trigger, event);
  return true;
};

const onPointerDown = (event) => {
  if (!isEnabled.value) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  isPressed.value = true;
};
const onPointerUp = (event) => {
  if (!isPressed.value) return;
  isPressed.value = false;
  raiseItemInvoked('PointerReleased', event);
};
const onPointerCancel = () => { isPressed.value = false; };

const onClick = (event) => { raiseItemInvoked('Tap', event); };
const onDoubleClick = (event) => { raiseItemInvoked('DoubleTap', event); };
const onKeyDown = (event) => {
  if (!isEnabled.value) return;
  if (event.key === 'Enter') raiseItemInvoked('EnterKey', event);
  else if (event.key === ' ') {
    event.preventDefault();
    raiseItemInvoked('SpaceKey', event);
  }
};
const onFocus = () => { controller?.setCurrent?.(dataItem); };

defineExpose({ IsSelected: isSelected });
</script>

<style scoped>
.win-item-container {
  position: relative;
  display: block;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  outline: none;
  border-radius: var(--ControlCornerRadius, 4px);
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
  user-select: none;
  -webkit-user-drag: none;
}

.win-item-container:focus-visible {
  outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary));
  outline-offset: 1px;
}

/* PART_ContainerRoot */
.win-item-container-root {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  background: var(--ItemContainerBackground, var(--SubtleFillColorTransparentBrush, transparent));
  transition: background-color var(--faster-duration, 83ms) linear;
}

.win-item-container-child {
  position: relative;
  z-index: 1;
  display: block;
  min-width: 0;
  min-height: 0;
}

/* PART_SelectionVisual: the 3px accent frame revealed while selected. */
.win-item-container-selection-visual {
  position: absolute;
  inset: 0;
  z-index: 3;
  box-sizing: border-box;
  border: 3px solid transparent;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--faster-duration, 83ms) linear, border-color var(--faster-duration, 83ms) linear;
}

/* PART_CommonVisual: ItemContainer's 1px outline, inset by
   ItemContainerSelectedInnerMargin while selected. */
.win-item-container-common-visual {
  position: absolute;
  inset: 0;
  z-index: 2;
  box-sizing: border-box;
  border: var(--ItemContainerSelectedInnerThickness, 1px) solid var(--ItemContainerBorderBrush, var(--SubtleFillColorTransparentBrush, transparent));
  border-radius: inherit;
  pointer-events: none;
  transition: inset var(--faster-duration, 83ms) linear, border-color var(--faster-duration, 83ms) linear;
}

.win-item-container.UnselectedPointerOver .win-item-container-root {
  background: var(--ItemContainerPointerOverBackground, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
}

.win-item-container.UnselectedPointerOver .win-item-container-common-visual {
  border-color: var(--ItemContainerPointerOverBorderBrush, var(--SubtleFillColorTransparentBrush, transparent));
}

.win-item-container.UnselectedPressed .win-item-container-root {
  background: var(--ItemContainerPressedBackground, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
}

.win-item-container.UnselectedPressed .win-item-container-common-visual {
  border-color: var(--ItemContainerPressedBorderBrush, var(--SubtleFillColorTransparentBrush, transparent));
}

.win-item-container.SelectedNormal .win-item-container-root {
  background: var(--ItemContainerSelectedBackground, var(--SubtleFillColorTransparentBrush, transparent));
}

.win-item-container.SelectedNormal .win-item-container-selection-visual,
.win-item-container.SelectedPointerOver .win-item-container-selection-visual,
.win-item-container.SelectedPressed .win-item-container-selection-visual {
  opacity: 1;
  border-color: var(--ItemContainerSelectionVisualBackground, var(--AccentFillColorDefaultBrush, var(--accent-base)));
}

.win-item-container.SelectedNormal .win-item-container-common-visual,
.win-item-container.SelectedPointerOver .win-item-container-common-visual,
.win-item-container.SelectedPressed .win-item-container-common-visual {
  inset: var(--ItemContainerSelectedInnerMargin, 2px);
  border-color: var(--ItemContainerSelectedInnerBorderBrush, var(--ControlSolidFillColorDefaultBrush, #FFFFFF));
}

.win-item-container.SelectedPointerOver .win-item-container-root {
  background: var(--ItemContainerSelectedPointerOverBackground, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
}

.win-item-container.SelectedPointerOver .win-item-container-selection-visual {
  border-color: var(--ItemContainerSelectionVisualPointerOverBackground, var(--AccentFillColorDefaultBrush, var(--accent-base)));
}

.win-item-container.SelectedPressed .win-item-container-root {
  background: var(--ItemContainerSelectedPressedBackground, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
}

.win-item-container.SelectedPressed .win-item-container-selection-visual {
  border-color: var(--ItemContainerSelectionVisualPressedBackground, var(--AccentFillColorDefaultBrush, var(--accent-base)));
}

/* DisabledStates dims PART_ContainerRoot and collapses PART_SelectionVisual. */
.win-item-container.disabled .win-item-container-root {
  opacity: var(--ItemContainerDisabledOpacity, .3);
}

.win-item-container.disabled .win-item-container-selection-visual {
  opacity: 0;
}

/* ItemContainerSelectionCheckboxStyle */
.win-item-container .win-item-container-checkbox {
  position: absolute;
  top: -2px;
  right: 4px;
  z-index: 4;
  width: var(--CheckBoxSize, 20px);
  min-width: var(--ItemContainerCheckboxMinWidth, 0);
  height: var(--CheckBoxSize, 20px);
  min-height: 0;
  margin: 0;
  padding: 0;
  gap: 0;
  pointer-events: none;
  opacity: 0;
  --CheckBoxCheckBackgroundFill: var(--ItemContainerCheckboxBackgroundUnchecked, var(--ControlOnImageFillColorDefaultBrush, #C9FFFFFF));
  --CheckBoxCheckBackgroundStroke: var(--CheckBoxCheckBackgroundStrokeUnchecked, var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke)));
  --CheckBoxCheckGlyphForeground: var(--TextOnAccentFillColorPrimaryBrush, #FFFFFF);
}

.win-item-container.multi-select .win-item-container-checkbox {
  opacity: 1;
}

.win-item-container .win-item-container-checkbox :deep(.checkbox-content) {
  display: none;
}

.win-item-container .win-item-container-checkbox :deep(.checkbox-box) {
  width: var(--CheckBoxSize, 20px);
  min-width: var(--CheckBoxSize, 20px);
  height: var(--CheckBoxSize, 20px);
  border-width: var(--CheckBoxBorderThickness, 1px);
  border-radius: var(--ControlCornerRadius, 4px);
}

@media (prefers-reduced-motion: reduce) {
  .win-item-container-root,
  .win-item-container-selection-visual,
  .win-item-container-common-visual {
    transition-duration: 0ms;
  }
}
</style>
