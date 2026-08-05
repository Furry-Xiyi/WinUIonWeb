<template>
  <div
    ref="rootRef"
    class="win-image-host"
    :class="{ 'has-nine-grid': Boolean(nineGrid) }"
    :style="hostStyle"
    role="img"
    :aria-label="automationName">
    <canvas
      v-if="!sourceConfig.AutoPlay && isAnimatedSource && !isPlaying && !nineGrid"
      ref="canvasRef"
      class="win-image"
      :class="stretchClass"
      :style="imageStyle"
      aria-hidden="true" />
    <img
      v-if="!nineGrid"
      ref="imageRef"
      class="win-image"
      :class="[stretchClass, { 'is-hidden': !sourceConfig.AutoPlay && isAnimatedSource && !isPlaying }]"
      :src="sourceUri"
      :alt="automationName"
      :style="imageStyle"
      decoding="async"
      @load="onImageOpened"
      @error="onImageFailed" />
    <div v-else class="win-image-nine-grid" :style="nineGridStyle" aria-hidden="true">
      <img class="win-image-nine-grid-image" :src="sourceUri" alt="" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useAttrs } from 'vue';

const props = defineProps({
  Source: { type: [String, Object], default: '' },
  Stretch: { type: String, default: 'Uniform' },
  NineGrid: { type: [String, Number], default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' },
  Margin: { type: [String, Number], default: '' },
  Opacity: { type: [String, Number], default: '' }
});

const emit = defineEmits(['ImageOpened', 'ImageFailed']);
const attrs = useAttrs();
const rootRef = ref(null);
const imageRef = ref(null);
const canvasRef = ref(null);
const isPlaying = ref(false);

const sourceUri = computed(() => {
  if (typeof props.Source === 'string') return props.Source;
  if (props.Source && typeof props.Source === 'object') {
    return props.Source.UriSource || '';
  }
  return '';
});
const sourceConfig = computed(() => ({
  UriSource: typeof props.Source === 'object' ? props.Source.UriSource || '' : sourceUri.value,
  AutoPlay: typeof props.Source === 'object' ? props.Source.AutoPlay !== false : true
}));

const automationName = computed(() => {
  const value = attrs['AutomationProperties.Name'];
  return typeof value === 'string' ? value : '';
});
const isAnimatedSource = computed(() => /\.gif(?:$|[?#])/i.test(sourceUri.value));

const cssLength = (value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  if (typeof value === 'number' || /^-?\d+(\.\d+)?$/.test(String(value).trim())) return `${value}px`;
  return String(value);
};

const alignment = {
  Left: 'flex-start',
  Center: 'center',
  Right: 'flex-end',
  Stretch: 'stretch'
};

const parseNineGrid = computed(() => {
  const values = String(props.NineGrid || '')
    .split(',')
    .map((part) => Number.parseFloat(part.trim()))
    .filter((value) => Number.isFinite(value));
  return values.length === 4 ? values : null;
});

const nineGrid = computed(() => parseNineGrid.value?.map((value) => `${value}px`).join(' ') || '');
const nineGridSlice = computed(() => parseNineGrid.value?.join(' ') || '');

const hostStyle = computed(() => ({
  width: nineGrid.value ? cssLength(props.Width || props.Height) : cssLength(props.Width),
  height: cssLength(props.Height),
  margin: cssLength(props.Margin),
  opacity: props.Opacity === '' ? undefined : Number(props.Opacity),
  alignSelf: alignment[props.HorizontalAlignment] || undefined
}));

const stretchClass = computed(() => `stretch-${String(props.Stretch || 'Uniform').toLowerCase()}`);
const isStretchNone = computed(() => String(props.Stretch || 'Uniform').toLowerCase() === 'none');

const imageStyle = computed(() => ({
  width: isStretchNone.value ? 'auto' : cssLength(props.Width) || 'auto',
  height: isStretchNone.value ? 'auto' : cssLength(props.Height) || 'auto',
  maxWidth: isStretchNone.value ? 'none' : props.Width || props.Height ? '100%' : undefined,
  maxHeight: isStretchNone.value ? 'none' : props.Width || props.Height ? '100%' : undefined,
  objectPosition: 'center'
}));

const nineGridStyle = computed(() => ({
  width: '100%',
  height: '100%',
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderWidth: nineGrid.value,
  borderImageSource: `url(${sourceUri.value})`,
  borderImageSlice: `${nineGridSlice.value} fill`,
  borderImageWidth: nineGrid.value,
  borderImageRepeat: 'stretch',
  backgroundImage: `url(${sourceUri.value})`,
  backgroundSize: '100% 100%',
  boxSizing: 'border-box'
}));

const onImageOpened = (event) => {
  emit('ImageOpened', event);
  requestAnimationFrame(freezeFrame);
};
const onImageFailed = (event) => emit('ImageFailed', event);

const freezeFrame = () => {
  const image = imageRef.value;
  const canvas = canvasRef.value;
  if (!image || !canvas || !isAnimatedSource.value) return;
  canvas.width = image.naturalWidth || 1;
  canvas.height = image.naturalHeight || 1;
  canvas.getContext('2d')?.drawImage(image, 0, 0);
};

const Play = () => {
  const image = imageRef.value;
  if (!image || sourceConfig.value.AutoPlay || !isAnimatedSource.value) return;
  isPlaying.value = true;
};

const Stop = () => {
  const image = imageRef.value;
  if (!image || sourceConfig.value.AutoPlay || !isAnimatedSource.value) return;
  isPlaying.value = false;
  image.src = '';
  requestAnimationFrame(() => { image.src = sourceUri.value; });
};

defineExpose({ Play, Stop, rootRef, imageRef, canvasRef });
</script>

<style>
.win-image-host {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.win-image {
  display: block;
  flex: 0 0 auto;
  background: transparent;
}

.win-image.stretch-none { object-fit: none; }
.win-image.stretch-fill { object-fit: fill; }
.win-image.stretch-uniform { object-fit: contain; }
.win-image.stretch-uniformtofill { object-fit: cover; }
.win-image.is-hidden { position: absolute; inset: 0; visibility: hidden; pointer-events: none; }
.win-image-host.has-nine-grid { display: block; }
.win-image-nine-grid { position: relative; }
.win-image-nine-grid-image { position: absolute; inset: 0; z-index: 0; display: block; width: 100%; height: 100%; object-fit: fill; }
</style>
