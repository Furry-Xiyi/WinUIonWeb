<template>
  <div class="win-color-picker" :class="{ 'cp-has-preview': IsColorPreviewVisible, 'cp-no-preview': !IsColorPreviewVisible }">
    <div class="cp-spectrum-grid">
      <div class="cp-spectrum-area" :class="{ 'cp-ring': isRing }">
        <canvas ref="spectrumCanvas" class="cp-spectrum"
                :width="spectrumSize" :height="spectrumSize"
                tabindex="0"
                @pointerdown="onSpectrumDown" @pointermove="onSpectrumMove" @pointerup="onSpectrumUp"
                @pointercancel="onSpectrumCancel" @focus="onSpectrumFocus" @blur="onSpectrumBlur"></canvas>
        <div ref="spectrumThumbRef" class="cp-spectrum-thumb" :style="spectrumThumbStyle"></div>
      </div>

      <div class="cp-preview-bar" v-if="IsColorPreviewVisible">
        <div class="cp-preview-current" :style="{ background: currentHex }"></div>
        <div class="cp-preview-previous" v-if="previousColor" :style="{ background: previousColor }"></div>
      </div>
    </div>

    <div class="cp-sliders" v-if="IsColorSliderVisible">
      <div class="cp-slider-row" @pointerdown="onValueDown">
        <div class="cp-value-track" ref="valueTrack" :style="{ background: valueGradient }">
          <div class="cp-slider-thumb" :style="{ left: hsv.v * 100 + '%' }"></div>
        </div>
      </div>
      <div class="cp-slider-row" v-if="IsAlphaEnabled && IsAlphaSliderVisible" @pointerdown="onAlphaDown">
        <div class="cp-alpha-track" ref="alphaTrack" :style="{ '--alpha-color': hsvToRgbStr(hsv.h, hsv.s, 1) }">
          <div class="cp-slider-thumb" :style="{ left: alpha * 100 + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="IsMoreButtonVisible" class="cp-more-row">
      <WinButton class="cp-more-button" Style="SubtleButtonStyle" @Click="moreExpanded = !moreExpanded">
        <WinTextBlock class="cp-more-label" :Text="t('text.more')" />
        <span class="icon">{{ moreGlyph }}</span>
      </WinButton>
    </div>

    <div v-if="detailsVisible" class="cp-details-grid">
      <WinComboBox Width="120" :ItemsSource="colorModelItems" :SelectedIndex="selectedColorModelIndex" @update:SelectedIndex="onColorModelChanged" />
      <WinTextBox
        v-if="IsHexInputVisible"
        class="cp-hex-box"
        :Text="hexInputText"
        :MaxWidth="132"
        :MaxLength="IsAlphaEnabled ? 9 : 7"
        @update:Text="onHexTextChanged" />

      <template v-if="IsColorChannelTextInputVisible && selectedColorModel === 'RGB'">
        <WinNumberBox Width="120" :Value="rgb.r" :Minimum="0" :Maximum="255" @update:Value="onRgbValueInput('r', $event)" />
        <WinTextBlock :Text="t('text.red')" />
        <WinNumberBox Width="120" :Value="rgb.g" :Minimum="0" :Maximum="255" @update:Value="onRgbValueInput('g', $event)" />
        <WinTextBlock :Text="t('text.green')" />
        <WinNumberBox Width="120" :Value="rgb.b" :Minimum="0" :Maximum="255" @update:Value="onRgbValueInput('b', $event)" />
        <WinTextBlock :Text="t('text.blue')" />
      </template>

      <template v-if="IsColorChannelTextInputVisible && selectedColorModel === 'HSV'">
        <WinNumberBox Width="120" :Value="hsvHue" :Minimum="0" :Maximum="359" @update:Value="onHsvValueInput('h', $event)" />
        <WinTextBlock :Text="t('text.hue')" />
        <WinNumberBox Width="120" :Value="hsvSaturation" :Minimum="0" :Maximum="100" @update:Value="onHsvValueInput('s', $event)" />
        <WinTextBlock :Text="t('text.saturation')" />
        <WinNumberBox Width="120" :Value="hsvValue" :Minimum="0" :Maximum="100" @update:Value="onHsvValueInput('v', $event)" />
        <WinTextBlock :Text="t('text.value')" />
      </template>

      <template v-if="IsAlphaEnabled && IsAlphaTextInputVisible">
        <WinNumberBox Width="120" :Value="opacityPercent" :Minimum="0" :Maximum="100" @update:Value="onOpacityInput" />
        <WinTextBlock :Text="t('sample.opacity')" />
      </template>
    </div>

    <WinToolTip
      ref="spectrumToolTipRef"
      IsServiceHost
      :IsOpen="spectrumToolTipOpen"
      :Content="spectrumToolTipContent"
      Placement="Top"
      :PlacementTarget="spectrumThumbRef" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import WinButton from './WinButton.vue';
import WinComboBox from './WinComboBox.vue';
import WinNumberBox from './WinNumberBox.vue';
import WinTextBlock from './WinTextBlock.vue';
import WinTextBox from './WinTextBox.vue';
import WinToolTip from './WinToolTip.vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();

const props = defineProps({
  Color: { type: String, default: undefined },
  ColorSpectrumShape: { type: String, default: undefined },
  IsMoreButtonVisible: { type: Boolean, default: false },
  IsColorPreviewVisible: { type: Boolean, default: undefined },
  IsColorSliderVisible: { type: Boolean, default: undefined },
  IsColorChannelTextInputVisible: { type: Boolean, default: undefined },
  IsHexInputVisible: { type: Boolean, default: undefined },
  IsAlphaEnabled: { type: Boolean, default: undefined },
  IsAlphaSliderVisible: { type: Boolean, default: undefined },
  IsAlphaTextInputVisible: { type: Boolean, default: undefined },
  modelValue: { type: String, default: '#0067C0' },
  isColorPreviewVisible: { type: Boolean, default: true },
  isColorSliderVisible: { type: Boolean, default: true },
  isColorChannelTextInputVisible: { type: Boolean, default: true },
  isHexInputVisible: { type: Boolean, default: true },
  isAlphaEnabled: { type: Boolean, default: false },
  isAlphaSliderVisible: { type: Boolean, default: true },
  previousColor: { type: String, default: null },
  colorSpectrumShape: { type: String, default: 'Box' }
});

const emit = defineEmits(['update:modelValue', 'update:Color', 'ColorChanged']);

const spectrumSize = 256;
const spectrumCanvas = ref(null);
const spectrumThumbRef = ref(null);
const spectrumToolTipRef = ref(null);
const valueTrack = ref(null);
const alphaTrack = ref(null);

const hsv = reactive({ h: 0, s: 1, v: 1 });
const alpha = ref(1);
const moreExpanded = ref(false);
const hexInputText = ref('');
const selectedColorModelIndex = ref(0);
const lastEmittedColor = ref(props.Color ?? props.modelValue);
let draggingSpectrum = false;
let draggingValue = false;
let draggingAlpha = false;
const spectrumToolTipOpen = ref(false);

const ColorSpectrumShape = computed(() => props.ColorSpectrumShape ?? props.colorSpectrumShape);
const IsColorPreviewVisible = computed(() => props.IsColorPreviewVisible ?? props.isColorPreviewVisible);
const IsColorSliderVisible = computed(() => props.IsColorSliderVisible ?? props.isColorSliderVisible);
const IsColorChannelTextInputVisible = computed(() => props.IsColorChannelTextInputVisible ?? props.isColorChannelTextInputVisible);
const IsHexInputVisible = computed(() => props.IsHexInputVisible ?? props.isHexInputVisible);
const IsAlphaEnabled = computed(() => props.IsAlphaEnabled ?? props.isAlphaEnabled);
const IsAlphaSliderVisible = computed(() => props.IsAlphaSliderVisible ?? props.isAlphaSliderVisible);
const IsAlphaTextInputVisible = computed(() => props.IsAlphaTextInputVisible ?? props.isAlphaTextInputVisible);
const detailsVisible = computed(() => !props.IsMoreButtonVisible || moreExpanded.value);
const colorModelItems = computed(() => ['RGB', 'HSV']);
const selectedColorModel = computed(() => selectedColorModelIndex.value === 1 ? 'HSV' : 'RGB');
const isRing = computed(() => ColorSpectrumShape.value === 'Ring');
const moreGlyph = computed(() => moreExpanded.value ? '\uE70E' : '\uE70D');

const rgb = computed(() => {
  const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v);
  return { r, g, b };
});

const currentHex = computed(() => {
  const { r, g, b } = rgb.value;
  const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  if (IsAlphaEnabled.value && alpha.value < 1) {
    return hex + Math.round(alpha.value * 255).toString(16).padStart(2, '0');
  }
  return hex;
});

const hexDisplay = computed(() => currentHex.value.toUpperCase());
const spectrumToolTipContent = computed(() => hexDisplay.value);
const opacityPercent = computed(() => Math.round(alpha.value * 100));
const hsvHue = computed(() => Math.round(hsv.h) % 360);
const hsvSaturation = computed(() => Math.round(hsv.s * 100));
const hsvValue = computed(() => Math.round(hsv.v * 100));

const valueGradient = computed(() => {
  const black = 'rgb(0,0,0)';
  const full = hsvToRgbStr(hsv.h, hsv.s, 1);
  return `linear-gradient(to right, ${black}, ${full})`;
});

const spectrumThumbStyle = computed(() => {
  const dark = hsv.v > 0.6 && hsv.s < 0.4;
  const thumbColor = (hsv.v > 0.5 && hsv.s < 0.5) ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)';
  if (isRing.value) {
    const cx = spectrumSize / 2;
    const cy = spectrumSize / 2;
    const radius = spectrumSize / 2 - 2;
    const angle = (hsv.h - 90) * Math.PI / 180;
    const dist = hsv.s * radius;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    return { left: x + 'px', top: y + 'px', '--spectrum-thumb-color': thumbColor };
  }
  const x = (hsv.h / 360) * spectrumSize;
  const y = (1 - hsv.s) * spectrumSize;
  return { left: x + 'px', top: y + 'px', '--spectrum-thumb-color': thumbColor };
});

function hsvToRgb(h, s, v) {
  let r, g, b;
  const i = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function hsvToRgbStr(h, s, v) {
  const { r, g, b } = hsvToRgb(h, s, v);
  return `rgb(${r},${g},${b})`;
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0, s = max === 0 ? 0 : d / max, v = max;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return { h, s, v };
}

function parseColor(hex) {
  let str = hex.replace('#', '');
  if (str.length === 3) str = str.split('').map(c => c + c).join('');
  const r = parseInt(str.slice(0, 2), 16) || 0;
  const g = parseInt(str.slice(2, 4), 16) || 0;
  const b = parseInt(str.slice(4, 6), 16) || 0;
  let a = 1;
  if (str.length === 8) a = (parseInt(str.slice(6, 8), 16) || 0) / 255;
  return { r, g, b, a };
}

function drawSpectrum() {
  const canvas = spectrumCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = spectrumSize, h = spectrumSize;
  ctx.clearRect(0, 0, w, h);

  if (isRing.value) {
    drawRingSpectrum(ctx, w, h);
  } else {
    drawBoxSpectrum(ctx, w, h);
  }
}

function drawBoxSpectrum(ctx, w, h) {
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;
  for (let y = 0; y < h; y++) {
    const sat = 1 - y / (h - 1);
    for (let x = 0; x < w; x++) {
      const hue = (x / (w - 1)) * 360;
      const { r, g, b } = hsvToRgb(hue, sat, hsv.v);
      const idx = (y * w + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function drawRingSpectrum(ctx, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = w / 2 - 1;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * w + x) * 4;

      if (dist <= radius) {
        let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        if (angle < 0) angle += 360;
        const sat = Math.min(1, dist / radius);
        const { r, g, b } = hsvToRgb(angle % 360, sat, hsv.v);
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      } else {
        data[idx + 3] = 0;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function emitColor() {
  emit('update:modelValue', currentHex.value);
  emit('update:Color', currentHex.value);
  emit('ColorChanged', { OldColor: lastEmittedColor.value, NewColor: currentHex.value });
  lastEmittedColor.value = currentHex.value;
}

watch(hexDisplay, (value) => {
  hexInputText.value = value;
}, { immediate: true });

function onSpectrumDown(e) {
  draggingSpectrum = true;
  e.currentTarget.focus?.({ preventScroll: true });
  e.currentTarget.setPointerCapture(e.pointerId);
  updateSpectrumFromEvent(e);
  spectrumToolTipOpen.value = true;
}

function onSpectrumMove(e) {
  if (!draggingSpectrum) return;
  updateSpectrumFromEvent(e);
}

function onSpectrumUp(e) {
  draggingSpectrum = false;
  if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
}

function onSpectrumCancel(e) {
  draggingSpectrum = false;
  if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
}

function onSpectrumFocus() {
  spectrumToolTipOpen.value = true;
}

function onSpectrumBlur() {
  draggingSpectrum = false;
  spectrumToolTipOpen.value = false;
}

function updateSpectrumFromEvent(e) {
  const rect = spectrumCanvas.value.getBoundingClientRect();
  const ex = e.clientX - rect.left;
  const ey = e.clientY - rect.top;

  if (isRing.value) {
    const cx = spectrumSize / 2;
    const cy = spectrumSize / 2;
    const radius = spectrumSize / 2 - 2;
    const dx = ex - cx;
    const dy = ey - cy;
    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;
    const dist = Math.min(radius, Math.sqrt(dx * dx + dy * dy));
    hsv.h = angle % 360;
    hsv.s = dist / radius;
  } else {
    const x = Math.max(0, Math.min(spectrumSize - 1, ex));
    const y = Math.max(0, Math.min(spectrumSize - 1, ey));
    hsv.h = (x / (spectrumSize - 1)) * 360;
    hsv.s = 1 - y / (spectrumSize - 1);
  }
  emitColor();
}

function onValueDown(e) {
  draggingValue = true;
  e.currentTarget.setPointerCapture(e.pointerId);
  updateValueFromEvent(e);
  const el = e.currentTarget;
  el.onpointermove = (ev) => { if (draggingValue) updateValueFromEvent(ev); };
  el.onpointerup = () => { draggingValue = false; el.onpointermove = null; };
}

function updateValueFromEvent(e) {
  const rect = valueTrack.value.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
  hsv.v = x / rect.width;
  drawSpectrum();
  emitColor();
}

function onAlphaDown(e) {
  draggingAlpha = true;
  e.currentTarget.setPointerCapture(e.pointerId);
  updateAlphaFromEvent(e);
  const el = e.currentTarget;
  el.onpointermove = (ev) => { if (draggingAlpha) updateAlphaFromEvent(ev); };
  el.onpointerup = () => { draggingAlpha = false; el.onpointermove = null; };
}

function updateAlphaFromEvent(e) {
  const rect = alphaTrack.value.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
  alpha.value = x / rect.width;
  emitColor();
}

function applyRgbValue(channel, value) {
  let val = parseInt(value) || 0;
  val = Math.max(0, Math.min(255, val));
  const r = channel === 'r' ? val : rgb.value.r;
  const g = channel === 'g' ? val : rgb.value.g;
  const b = channel === 'b' ? val : rgb.value.b;
  const newHsv = rgbToHsv(r, g, b);
  hsv.h = newHsv.h;
  hsv.s = newHsv.s;
  hsv.v = newHsv.v;
  drawSpectrum();
  emitColor();
}

function onRgbValueInput(channel, value) {
  applyRgbValue(channel, value);
}

function onHsvValueInput(channel, value) {
  const numeric = Number(value) || 0;
  if (channel === 'h') hsv.h = Math.max(0, Math.min(359, numeric));
  if (channel === 's') hsv.s = Math.max(0, Math.min(100, numeric)) / 100;
  if (channel === 'v') hsv.v = Math.max(0, Math.min(100, numeric)) / 100;
  drawSpectrum();
  emitColor();
}

function onColorModelChanged(value) {
  selectedColorModelIndex.value = value ?? 0;
}

function onOpacityInput(value) {
  const percent = Math.max(0, Math.min(100, Number(value) || 0));
  alpha.value = percent / 100;
  emitColor();
}

function onHexTextChanged(value) {
  hexInputText.value = value;
  if (value.replace('#', '').trim().length >= 6) {
    onHexInput(value);
  }
}

function onHexInput(source) {
  let val = String(source).replace('#', '').trim();
  if (val.length >= 6) {
    const { r, g, b, a } = parseColor(val);
    const newHsv = rgbToHsv(r, g, b);
    hsv.h = newHsv.h;
    hsv.s = newHsv.s;
    hsv.v = newHsv.v;
    if (IsAlphaEnabled.value) alpha.value = a;
    drawSpectrum();
    emitColor();
  }
}

function syncFromProp(hex) {
  const { r, g, b, a } = parseColor(hex);
  const newHsv = rgbToHsv(r, g, b);
  hsv.h = newHsv.h;
  hsv.s = newHsv.s;
  hsv.v = newHsv.v;
  if (IsAlphaEnabled.value) alpha.value = a;
  nextTick(() => drawSpectrum());
}

watch(() => props.Color ?? props.modelValue, (val) => {
  if (val && val.toLowerCase() !== currentHex.value.toLowerCase()) {
    syncFromProp(val);
    lastEmittedColor.value = val;
  }
});

watch(ColorSpectrumShape, () => {
  nextTick(() => drawSpectrum());
});

watch(() => hsv.v, () => {});

watch([spectrumToolTipContent, spectrumThumbStyle], () => {
  if (spectrumToolTipOpen.value) nextTick(() => spectrumToolTipRef.value?.updatePosition?.());
}, { deep: true });

onMounted(() => {
  syncFromProp(props.Color ?? props.modelValue);
  lastEmittedColor.value = currentHex.value;
});
</script>

<style>
  .win-color-picker {
    --cp-spectrum-size: 256px;
    --cp-preview-width: 44px;
    --cp-preview-gap: 12px;
    --cp-total-width: calc(var(--cp-spectrum-size) + var(--cp-preview-gap) + var(--cp-preview-width));
    display: inline-flex;
    flex-direction: column;
    gap: 0;
    min-width: 312px;
    max-width: 392px;
    padding: 0 4px;
    user-select: none;
  }

  .win-color-picker.cp-no-preview {
    --cp-total-width: var(--cp-spectrum-size);
  }

  .cp-spectrum-grid {
    display: grid;
    grid-template-columns: var(--cp-spectrum-size) auto;
    column-gap: var(--cp-preview-gap);
    width: var(--cp-total-width);
    margin: 0 0 16px;
  }

  .cp-spectrum-area {
    position: relative;
    width: var(--cp-spectrum-size);
    height: var(--cp-spectrum-size);
    border-radius: 4px;
    overflow: hidden;
  }

    .cp-spectrum-area.cp-ring {
      border-radius: 50%;
    }

  .cp-spectrum {
    display: block;
    width: var(--cp-spectrum-size);
    height: var(--cp-spectrum-size);
    cursor: crosshair;
  }

  .cp-ring .cp-spectrum {
    border-radius: 50%;
  }

  .cp-spectrum-thumb {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid var(--spectrum-thumb-color, white);
    box-shadow: 0 0 2px rgba(0,0,0,0.6);
    pointer-events: none;
    transform: translate(-50%, -50%);
  }

    .cp-spectrum-thumb::after {
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--thumb-inner, rgba(255,255,255,0.9));
    }

  .cp-preview-bar {
    display: flex;
    flex-direction: column;
    width: var(--cp-preview-width);
    gap: 0;
    align-self: stretch;
  }

  .cp-preview-current {
    flex: 1;
    border-radius: 4px;
    border: 1px solid var(--card-stroke);
    min-height: 44px;
  }

  .cp-preview-previous {
    flex: 1;
    border-radius: 4px;
    border: 1px solid var(--card-stroke);
  }

  .cp-sliders {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: var(--cp-total-width);
    margin: 0 0 16px;
  }

  .cp-slider-row {
    display: flex;
    align-items: center;
    position: relative;
    height: 20px;
    cursor: pointer;
    touch-action: none;
  }

  .cp-value-track {
    position: relative;
    width: 100%;
    height: 12px;
    border-radius: 8px;
    cursor: pointer;
    touch-action: none;
  }

  .cp-alpha-track {
    position: relative;
    width: 100%;
    height: 12px;
    border-radius: 8px;
    background: linear-gradient(to right, transparent, var(--alpha-color, #000)), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px;
    cursor: pointer;
    touch-action: none;
  }

  .cp-slider-thumb {
    position: absolute;
    top: 50%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--ctrl-solid-fill);
    border: 1px solid var(--ctrl-elevation-bottom);
    border-top-color: var(--ctrl-elevation-top);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    transform: translate(-50%, -50%);
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

    .cp-slider-thumb::after {
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--text-primary);
      transition: transform var(--fast-duration) var(--fast-out-slow-in);
    }

  .cp-details-grid {
    width: var(--cp-total-width);
    display: grid;
    grid-template-columns: 120px 8px 1fr;
    column-gap: 0;
    row-gap: 12px;
    align-items: center;
  }

  .cp-details-grid > .win-combo-box {
    grid-column: 1;
  }

  .cp-details-grid > .win-number-box {
    grid-column: 1;
  }

  .cp-details-grid > .win-text-block {
    grid-column: 3;
    align-self: center;
  }

  .cp-hex-box {
    grid-column: 3;
    justify-self: end;
    width: 132px;
  }

  .cp-more-row {
    width: var(--cp-total-width);
    display: flex;
    justify-content: flex-end;
    margin: 0 0 12px;
  }

  .cp-more-button {
    min-width: 120px;
    height: 32px;
    padding: 0;
    justify-content: flex-end;
    gap: 0;
    background: transparent;
    border-color: transparent;
  }

  .cp-more-button::after {
    display: none;
  }

  .cp-more-button:hover {
    background: transparent;
    color: var(--text-secondary);
  }

  .cp-more-button:active {
    background: transparent;
    color: var(--text-tertiary);
  }

  .cp-more-label {
    margin: 0 8px 0 0;
    line-height: 20px;
  }

  .cp-more-button .icon {
    font-size: 12px;
  }
</style>
