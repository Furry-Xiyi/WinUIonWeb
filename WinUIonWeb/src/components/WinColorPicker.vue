<template>
  <div class="win-color-picker" :class="{ 'cp-has-preview': isColorPreviewVisible }">
    <div class="cp-main-row">
      <div class="cp-spectrum-area" :class="{ 'cp-ring': isRing }">
        <canvas ref="spectrumCanvas" class="cp-spectrum"
                :width="spectrumSize" :height="spectrumSize"
                @pointerdown="onSpectrumDown" @pointermove="onSpectrumMove" @pointerup="onSpectrumUp"></canvas>
        <div class="cp-spectrum-thumb" :style="spectrumThumbStyle"></div>
      </div>

      <div class="cp-preview-bar" v-if="isColorPreviewVisible">
        <div class="cp-preview-current" :style="{ background: currentHex }"></div>
        <div class="cp-preview-previous" v-if="previousColor" :style="{ background: previousColor }"></div>
      </div>
    </div>

    <div class="cp-sliders" v-if="isColorSliderVisible">
      <div class="cp-slider-row" @pointerdown="onValueDown">
        <div class="cp-value-track" ref="valueTrack" :style="{ background: valueGradient }">
          <div class="cp-slider-thumb" :style="{ left: hsv.v * 100 + '%' }"></div>
        </div>
      </div>
      <div class="cp-slider-row" v-if="isAlphaEnabled && isAlphaSliderVisible" @pointerdown="onAlphaDown">
        <div class="cp-alpha-track" ref="alphaTrack" :style="{ '--alpha-color': hsvToRgbStr(hsv.h, hsv.s, 1) }">
          <div class="cp-slider-thumb" :style="{ left: alpha * 100 + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="cp-inputs" v-if="isColorChannelTextInputVisible">
      <div class="cp-input-group">
        <label>R</label>
        <input type="number" min="0" max="255" :value="rgb.r" @change="onRgbInput('r', $event)">
      </div>
      <div class="cp-input-group">
        <label>G</label>
        <input type="number" min="0" max="255" :value="rgb.g" @change="onRgbInput('g', $event)">
      </div>
      <div class="cp-input-group">
        <label>B</label>
        <input type="number" min="0" max="255" :value="rgb.b" @change="onRgbInput('b', $event)">
      </div>
    </div>

    <div class="cp-hex-row" v-if="isHexInputVisible">
      <label class="cp-hex-label">#</label>
      <input class="cp-hex-input" type="text" maxlength="8" :value="hexDisplay" @change="onHexInput">
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
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

const emit = defineEmits(['update:modelValue', 'colorChanged']);

const spectrumSize = 256;
const spectrumCanvas = ref(null);
const valueTrack = ref(null);
const alphaTrack = ref(null);

const hsv = reactive({ h: 0, s: 1, v: 1 });
const alpha = ref(1);
let draggingSpectrum = false;
let draggingValue = false;
let draggingAlpha = false;

const isRing = computed(() => props.colorSpectrumShape === 'Ring');

const rgb = computed(() => {
  const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v);
  return { r, g, b };
});

const currentHex = computed(() => {
  const { r, g, b } = rgb.value;
  const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  if (props.isAlphaEnabled && alpha.value < 1) {
    return hex + Math.round(alpha.value * 255).toString(16).padStart(2, '0');
  }
  return hex;
});

const hexDisplay = computed(() => currentHex.value.slice(1).toUpperCase());

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
  emit('colorChanged', { color: currentHex.value, r: rgb.value.r, g: rgb.value.g, b: rgb.value.b, a: alpha.value });
}

function onSpectrumDown(e) {
  draggingSpectrum = true;
  e.currentTarget.setPointerCapture(e.pointerId);
  updateSpectrumFromEvent(e);
}

function onSpectrumMove(e) {
  if (!draggingSpectrum) return;
  updateSpectrumFromEvent(e);
}

function onSpectrumUp(e) {
  draggingSpectrum = false;
  e.currentTarget.releasePointerCapture(e.pointerId);
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

function onRgbInput(channel, e) {
  let val = parseInt(e.target.value) || 0;
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

function onHexInput(e) {
  let val = e.target.value.replace('#', '').trim();
  if (val.length >= 6) {
    const { r, g, b, a } = parseColor(val);
    const newHsv = rgbToHsv(r, g, b);
    hsv.h = newHsv.h;
    hsv.s = newHsv.s;
    hsv.v = newHsv.v;
    if (props.isAlphaEnabled) alpha.value = a;
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
  if (props.isAlphaEnabled) alpha.value = a;
  nextTick(() => drawSpectrum());
}

watch(() => props.modelValue, (val) => {
  if (val && val.toLowerCase() !== currentHex.value.toLowerCase()) {
    syncFromProp(val);
  }
});

watch(() => props.colorSpectrumShape, () => {
  nextTick(() => drawSpectrum());
});

watch(() => hsv.v, () => {});

onMounted(() => {
  syncFromProp(props.modelValue);
});
</script>

<style>
  .win-color-picker {
    display: inline-flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    background: var(--flyout-bg);
    border: 1px solid var(--stroke-surface-flyout);
    border-radius: 8px;
    user-select: none;
  }

  .cp-main-row {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  .cp-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cp-spectrum-area {
    position: relative;
    width: 256px;
    height: 256px;
    border-radius: 4px;
    overflow: hidden;
  }

    .cp-spectrum-area.cp-ring {
      border-radius: 50%;
    }

  .cp-spectrum {
    display: block;
    width: 256px;
    height: 256px;
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
    width: 32px;
    gap: 4px;
    align-self: stretch;
  }

  .cp-preview-current {
    flex: 1;
    border-radius: 4px;
    border: 1px solid var(--card-stroke);
  }

  .cp-preview-previous {
    flex: 1;
    border-radius: 4px;
    border: 1px solid var(--card-stroke);
  }

  .cp-sliders {
    display: flex;
    flex-direction: column;
    gap: 30px;
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

  .cp-inputs {
    display: flex;
    gap: 6px;
  }

  .cp-input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex: 1;
  }

    .cp-input-group label {
      font-size: 11px;
      color: var(--text-secondary);
    }

    .cp-input-group input {
      width: 100%;
      height: 28px;
      border-radius: 4px;
      border: 1px solid var(--ctrl-border-rest);
      background: var(--ctrl-fill-default);
      color: var(--text-primary);
      text-align: center;
      font-size: 12px;
      outline: none;
      transition: border-color var(--fast-duration);
    }

      .cp-input-group input:focus {
        border-color: var(--accent-base);
      }

  .cp-hex-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cp-hex-label {
    font-size: 14px;
    color: var(--text-primary);
  }

  .cp-hex-input {
    flex: 1;
    height: 28px;
    border-radius: 4px;
    border: 1px solid var(--ctrl-border-rest);
    background: var(--ctrl-fill-default);
    color: var(--text-primary);
    padding: 0 8px;
    font-size: 12px;
    font-family: 'Cascadia Code', 'Consolas', monospace;
    outline: none;
    transition: border-color var(--fast-duration);
  }

    .cp-hex-input:focus {
      border-color: var(--accent-base);
    }
</style>
