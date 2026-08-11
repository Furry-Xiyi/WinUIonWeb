<template>
  <div ref="rootRef" class="win-viewbox" :style="rootStyle">
    <div ref="contentRef" class="win-viewbox-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  Stretch: { type: String, default: 'Uniform' },
  StretchDirection: { type: String, default: 'Both' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const rootRef = ref(null);
const contentRef = ref(null);
const naturalWidth = ref(1);
const naturalHeight = ref(1);
let resizeObserver;
const imageLoadHandlers = [];

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const rootStyle = computed(() => {
  const style = {};
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.HorizontalAlignment) style.justifySelf = props.HorizontalAlignment.toLowerCase();
  if (props.VerticalAlignment) style.alignSelf = props.VerticalAlignment.toLowerCase();
  return style;
});

const constrainedScale = (scale) => {
  if (props.StretchDirection === 'UpOnly') return Math.max(1, scale);
  if (props.StretchDirection === 'DownOnly') return Math.min(1, scale);
  return scale;
};

const contentStyle = computed(() => {
  const root = rootRef.value;
  const width = root?.clientWidth || Number(props.Width) || naturalWidth.value;
  const height = root?.clientHeight || Number(props.Height) || naturalHeight.value;
  const scaleX = width / naturalWidth.value;
  const scaleY = height / naturalHeight.value;
  let transform = 'none';

  if (props.Stretch === 'Fill') {
    transform = `scale(${constrainedScale(scaleX)}, ${constrainedScale(scaleY)})`;
  } else if (props.Stretch === 'Uniform') {
    transform = `scale(${constrainedScale(Math.min(scaleX, scaleY))})`;
  } else if (props.Stretch === 'UniformToFill') {
    transform = `scale(${constrainedScale(Math.max(scaleX, scaleY))})`;
  }

  return {
    width: `${naturalWidth.value}px`,
    height: `${naturalHeight.value}px`,
    transform,
    transformOrigin: '0 0'
  };
});

const measure = () => {
  const content = contentRef.value;
  if (!content) return;
  const previousTransform = content.style.transform;
  content.style.transform = 'none';
  naturalWidth.value = Math.max(1, content.scrollWidth || content.offsetWidth);
  naturalHeight.value = Math.max(1, content.scrollHeight || content.offsetHeight);
  content.style.transform = previousTransform;
};

const attachImageLoadHandlers = () => {
  const images = contentRef.value?.querySelectorAll?.('img') ?? [];
  images.forEach((image) => {
    const handler = () => void nextTick(measure);
    image.addEventListener('load', handler, { once: true });
    imageLoadHandlers.push([image, handler]);
  });
};

onMounted(async () => {
  await nextTick();
  measure();
  attachImageLoadHandlers();
  resizeObserver = new ResizeObserver(measure);
  if (contentRef.value) resizeObserver.observe(contentRef.value);
  if (rootRef.value) resizeObserver.observe(rootRef.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  imageLoadHandlers.forEach(([image, handler]) => image.removeEventListener('load', handler));
});

watch(() => [props.Stretch, props.StretchDirection, props.Width, props.Height], () => {
  void nextTick(measure);
});
</script>

<style scoped>
.win-viewbox {
  overflow: hidden;
  position: relative;
}

.win-viewbox-content {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
