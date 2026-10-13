<template>
  <span class="win-focus-visual" aria-hidden="true" :style="focusStyle">
    <span class="win-focus-visual-secondary" />
  </span>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

const props = withDefaults(defineProps<{
  Margin?: string | number
  CornerRadius?: string | number
  TargetBorderThickness?: string | number
  PrimaryThickness?: string | number
  SecondaryThickness?: string | number
}>(), {
  Margin: -3,
  CornerRadius: 4,
  TargetBorderThickness: 1,
  PrimaryThickness: 2,
  SecondaryThickness: 1,
})

const numbers = (input: string | number | undefined, fallback: number): number[] => {
  const values = String(input ?? '').split(/[ ,]+/).filter(Boolean).map(value => Number.parseFloat(value))
  if (!values.length || values.some(value => !Number.isFinite(value))) return [fallback]
  return values
}

const expandQuad = (values: number[], kind: 'thickness' | 'radius'): [number, number, number, number] => {
  if (values.length === 1) return [values[0], values[0], values[0], values[0]]
  if (values.length === 2) return kind === 'radius'
    ? [values[0], values[1], values[0], values[1]]
    : [values[1], values[0], values[1], values[0]]
  if (kind === 'radius') return values.length >= 4
    ? [values[0], values[1], values[2], values[3]]
    : [values[0], values[0], values[0], values[0]]
  // XAML Thickness order is left, top, right, bottom; CSS order is top, right, bottom, left.
  return values.length >= 4 ? [values[1], values[2], values[3], values[0]] : [values[0], values[0], values[0], values[0]]
}

const px = (value: number) => `${Number(value.toFixed(3))}px`
const focusStyle = computed<CSSProperties>(() => {
  const [marginTop, marginRight, marginBottom, marginLeft] = expandQuad(numbers(props.Margin, -3), 'thickness')
  const [radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft] = expandQuad(numbers(props.CornerRadius, 4), 'radius')
  const [targetTop, targetRight, targetBottom, targetLeft] = expandQuad(numbers(props.TargetBorderThickness, 1), 'thickness')
  const [primaryTop, primaryRight, primaryBottom, primaryLeft] = expandQuad(numbers(props.PrimaryThickness, 2), 'thickness')
  const [secondaryTop, secondaryRight, secondaryBottom, secondaryLeft] = expandQuad(numbers(props.SecondaryThickness, 1), 'thickness')
  const adjusted = (radius: number, first: number, second: number) => Math.max(0, radius - (first + second) / 2)
  const outer = [
    adjusted(radiusTopLeft, marginTop, marginLeft),
    adjusted(radiusTopRight, marginTop, marginRight),
    adjusted(radiusBottomRight, marginBottom, marginRight),
    adjusted(radiusBottomLeft, marginBottom, marginLeft),
  ].map(px).join(' ')
  const inner = [radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft].map(px).join(' ')

  return {
    // Absolute children are positioned from the button's padding box. Remove
    // its border thickness so WinUI's focus margin is measured from the same
    // outer edge as FocusVisualMargin.
    inset: `${px(marginTop - targetTop)} ${px(marginRight - targetRight)} ${px(marginBottom - targetBottom)} ${px(marginLeft - targetLeft)}`,
    borderWidth: `${px(primaryTop)} ${px(primaryRight)} ${px(primaryBottom)} ${px(primaryLeft)}`,
    borderRadius: outer,
    // The child is positioned against the focus rectangle's padding box, so
    // subtract its primary stroke as well as the negative XAML margin to align
    // the secondary stroke with the button's outer border edge.
    '--focus-visual-inner-inset': `${px(-marginTop - primaryTop)} ${px(-marginRight - primaryRight)} ${px(-marginBottom - primaryBottom)} ${px(-marginLeft - primaryLeft)}`,
    '--focus-visual-inner-border-width': `${px(secondaryTop)} ${px(secondaryRight)} ${px(secondaryBottom)} ${px(secondaryLeft)}`,
    '--focus-visual-inner-radius': inner,
  } as CSSProperties
})
</script>

<style>
.win-focus-visual {
  position: absolute;
  z-index: 2;
  display: block;
  box-sizing: border-box;
  pointer-events: none;
  border-style: solid;
  border-color: var(--SystemControlFocusVisualPrimaryBrush, var(--FocusStrokeColorOuterBrush, #000000));
  opacity: 0;
  transition: none;
}

.win-focus-visual-secondary {
  position: absolute;
  inset: var(--focus-visual-inner-inset);
  box-sizing: border-box;
  border-style: solid;
  border-width: var(--focus-visual-inner-border-width);
  border-color: var(--SystemControlFocusVisualSecondaryBrush, var(--FocusStrokeColorInnerBrush, #FFFFFF));
  border-radius: var(--focus-visual-inner-radius);
}

.win-btn:focus-visible > .win-focus-visual {
  opacity: 1;
}

@media (forced-colors: active) {
  .win-focus-visual { border-color: CanvasText; }
  .win-focus-visual-secondary { border-color: Canvas; }
}
</style>
