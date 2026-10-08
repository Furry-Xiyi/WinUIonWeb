<template>
  <div
    ref="rootRef"
    v-bind="rootAttrs"
    class="win-image-host"
    :class="attrs.class"
    :style="hostStyle"
    role="img"
    :aria-label="automationName || undefined"
    @dragstart.prevent>
    <canvas v-if="usesCanvas" ref="canvasRef" class="win-image-surface" aria-hidden="true" />
    <img
      v-else-if="uri && loaded"
      class="win-image-surface"
      :src="uri"
      :style="surfaceStyle"
      :alt="automationName"
      draggable="false"
      decoding="async" />
    <SourceOutlet />
  </div>
</template>

<script lang="ts">
import { ImageSourceProperty } from './imageSource'
export { ImageSourceProperty }
export default { Source: ImageSourceProperty }
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, shallowRef, useAttrs, useSlots, watch, type CSSProperties, type PropType, type StyleValue, type VNode } from 'vue'
import { alignment, cssLength, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlResourceObject, resolveXamlValue } from './xamlRuntime'
import { xamlResourceDictionaryKey } from './Page.vue'
import { createImageSourceModel, imageBoolean, imageDecodeSize, imageNumber, imageSourceContextKey, imageStretchSize, imageUri, type ImageEventArgs, type ImageSourceModel, type ImageSourceRegistration } from './imageSource'
import { decodeGif, type GifImage } from './gifDecoder'
import { parallaxChildLayoutKey } from './parallaxRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Source: { type: [String, Object] as PropType<unknown>, default: '' as unknown },
  Stretch: { type: String, default: 'Uniform' },
  NineGrid: { type: [String, Number, Object], default: '0' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  Margin: { type: [String, Number], default: 0 }, Opacity: { type: [String, Number], default: 1 },
  Visibility: { type: String, default: 'Visible' }, IsHitTestVisible: { type: [Boolean, String], default: true }
})
const emit = defineEmits<{ ImageOpened: [sender: unknown, args: ImageEventArgs]; ImageFailed: [sender: unknown, args: ImageEventArgs] }>()
const instance = getCurrentInstance()
const inheritedParallaxLayout = inject(parallaxChildLayoutKey, null)
const parallaxLayout = inheritedParallaxLayout?.isDirectChild(instance) ? inheritedParallaxLayout : null
const attrs = useAttrs()
const slots = useSlots()
const value = (input: unknown) => resolveXamlValue(input, instance)
const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const directSource = createImageSourceModel()
const registeredSource = shallowRef<ImageSourceRegistration | null>(null)
provide(imageSourceContextKey, registration => { registeredSource.value = registration })
// ImageSource is a DependencyObject, so its object element adds no content
// presenter or wrapper to Image's visual tree.
const sourceOverride = ref<unknown>()
const resources = inject<Record<string, VNode> | null>(xamlResourceDictionaryKey, null)
const sourceResource = computed(() => {
  const input = sourceOverride.value === undefined ? props.Source : sourceOverride.value
  if (typeof input !== 'string') return undefined
  const key = input.match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}$/)?.[1]
  return key ? resolveXamlResourceObject(key, instance) ?? resources?.[key] : undefined
})
const SourceOutlet = defineComponent({ setup: () => () => {
  if (isVNode(sourceResource.value)) return h(Fragment, normalizeXamlNodes([cloneVNode(sourceResource.value)], instance))
  return sourceOverride.value === undefined ? h(Fragment, slots.default?.()) : null
} })
const sourceInput = computed(() => {
  if (sourceResource.value !== undefined) {
    if (isVNode(sourceResource.value)) {
      const node = sourceResource.value
      // ImageSource object elements are instantiated by SourceOutlet; string
      // resources can be converted directly to Image's URI shorthand.
      return typeof node.children === 'string' ? node.children : ''
    }
    return sourceResource.value
  }
  const input = sourceOverride.value === undefined ? props.Source : sourceOverride.value
  return typeof input === 'string' && /^\{(?:StaticResource|ThemeResource)\s/.test(input) ? '' : value(input)
})
watch(sourceInput, input => {
  if (input && typeof input === 'object' && '__kind' in input) return
  const config = input && typeof input === 'object' ? input as Record<string, unknown> : {}
  directSource.UriSource = typeof input === 'string' ? input : imageUri(config.UriSource, instance, resources)
  directSource.AutoPlay = config.AutoPlay === undefined ? true : imageBoolean(value(config.AutoPlay))
  directSource.DecodePixelWidth = Math.floor(imageNumber(value(config.DecodePixelWidth)))
  directSource.DecodePixelHeight = Math.floor(imageNumber(value(config.DecodePixelHeight)))
  directSource.DecodePixelType = config.DecodePixelType === 'Logical' ? 'Logical' : 'Physical'
  directSource.RasterizePixelWidth = imageNumber(value(config.RasterizePixelWidth))
  directSource.RasterizePixelHeight = imageNumber(value(config.RasterizePixelHeight))
}, { immediate: true, deep: true })
const source = computed<ImageSourceModel>(() => registeredSource.value?.model
  ?? (sourceInput.value && typeof sourceInput.value === 'object' && '__kind' in sourceInput.value ? sourceInput.value as ImageSourceModel : directSource))
const uri = computed(() => source.value.UriSource)
const stretchOverride = ref<string>()
const stretch = computed(() => {
  const candidate = stretchOverride.value ?? value(props.Stretch)
  return ['None', 'Fill', 'Uniform', 'UniformToFill'].includes(String(candidate)) ? String(candidate) : 'Uniform'
})
watch(() => props.Stretch, () => { stretchOverride.value = undefined })
watch(() => props.Source, () => { sourceOverride.value = undefined })
const automationName = computed(() => String(value(attrs['AutomationProperties.Name']) ?? ''))
const rootAttrs = computed(() => ({
  ...Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style', 'ImageOpened', 'ImageFailed', 'AutomationProperties.Name'].includes(name))),
  HorizontalAlignment: value(props.HorizontalAlignment),
  VerticalAlignment: value(props.VerticalAlignment)
}))
const naturalSize = ref({ width: 0, height: 0 })
const actualSize = ref({ width: 0, height: 0 })
const parentAvailableSize = ref({ width: Infinity, height: Infinity })
const loaded = ref(false)
const gif = shallowRef<GifImage | null>(null)
const rasterSource = shallowRef<CanvasImageSource | null>(null)
let loadGeneration = 0
let request: AbortController | null = null
let imageLoader: HTMLImageElement | null = null
let observer: ResizeObserver | null = null
let animationFrame: number | null = null
let frameIndex = 0
let completedLoops = 0
let frameElapsed = 0
let lastFrameTime = 0
let disposed = false
let attachedModel: ImageSourceModel | null = null

const finiteSize = (input: unknown) => {
  const resolved = value(input)
  if (resolved === '' || resolved === undefined || resolved === null || resolved === 'Auto') return Infinity
  const number = Number(resolved)
  return Number.isFinite(number) && number >= 0 ? number : Infinity
}
const nineGrid = computed(() => {
  const input = value(props.NineGrid)
  if (input && typeof input === 'object') {
    const object = input as Record<string, unknown>
    return ['Left', 'Top', 'Right', 'Bottom'].map(name => Math.max(0, Number(object[name]) || 0))
  }
  const parts = String(input ?? '0').split(',').map(part => Math.max(0, Number(part.trim()) || 0))
  if (parts.length === 1) return [parts[0]!, parts[0]!, parts[0]!, parts[0]!]
  if (parts.length === 2) return [parts[0]!, parts[1]!, parts[0]!, parts[1]!]
  return parts.length === 4 ? parts : [0, 0, 0, 0]
})
const hasNineGrid = computed(() => nineGrid.value.some(part => part > 0))
const usesCanvas = computed(() => Boolean(gif.value || hasNineGrid.value || source.value.DecodePixelWidth || source.value.DecodePixelHeight || source.value.RasterizePixelWidth || source.value.RasterizePixelHeight))
// CMediaBase::ComputeScaleFactor: an unconstrained dimension follows the
// constrained dimension; None retains source dimensions; Uniform uses min
// scale and UniformToFill uses max scale. The host is the clipping boundary.
const desiredSize = computed(() => {
  const width = finiteSize(props.Width)
  const height = finiteSize(props.Height)
  const parentWidth = Number.isFinite(parentAvailableSize.value.width) ? parentAvailableSize.value.width : Infinity
  const parentHeight = Number.isFinite(parentAvailableSize.value.height) ? parentAvailableSize.value.height : Infinity
  const available = parallaxLayout?.availableSize.value
  const desired = imageStretchSize(naturalSize.value.width, naturalSize.value.height,
    Math.min(width, finiteSize(props.MaxWidth), available?.width ?? parentWidth),
    Math.min(height, finiteSize(props.MaxHeight), available?.height ?? parentHeight), stretch.value)
  return {
    width: Number.isFinite(width) ? width : Math.min(finiteSize(props.MaxWidth), Math.max(imageNumber(value(props.MinWidth)), desired.width)),
    height: Number.isFinite(height) ? height : Math.min(finiteSize(props.MaxHeight), Math.max(imageNumber(value(props.MinHeight)), desired.height))
  }
})
const hostStyle = computed<StyleValue>(() => [attrs.style as StyleValue, {
  flex: '0 0 auto',
  width: `${parallaxLayout?.arrangedSize.value?.width ?? desiredSize.value.width}px`, height: `${parallaxLayout?.arrangedSize.value?.height ?? desiredSize.value.height}px`,
  minWidth: cssLength(value(props.MinWidth)), minHeight: cssLength(value(props.MinHeight)),
  maxWidth: cssLength(value(props.MaxWidth)) || undefined, maxHeight: cssLength(value(props.MaxHeight)) || undefined,
  margin: xamlThickness(value(props.Margin)), opacity: Number(value(props.Opacity)),
  justifySelf: value(props.HorizontalAlignment) === 'Stretch' && !Number.isFinite(finiteSize(props.Width)) ? 'center' : alignment(value(props.HorizontalAlignment), 'horizontal'),
  alignSelf: value(props.VerticalAlignment) === 'Stretch' && !Number.isFinite(finiteSize(props.Height)) ? 'center' : alignment(value(props.VerticalAlignment), 'vertical'),
  display: value(props.Visibility) === 'Collapsed' ? 'none' : undefined,
  pointerEvents: imageBoolean(value(props.IsHitTestVisible)) ? undefined : 'none'
}])
if (parallaxLayout) watch(desiredSize, size => parallaxLayout.reportDesiredSize(size), { immediate: true })
const surfaceStyle = computed<CSSProperties>(() => ({ objectFit: ({ None: 'none', Fill: 'fill', Uniform: 'contain', UniformToFill: 'cover' } as Record<string, CSSProperties['objectFit']>)[stretch.value] }))

function cancelPlayback() {
  if (animationFrame !== null) cancelAnimationFrame(animationFrame)
  animationFrame = null
  lastFrameTime = 0
}

function draw() {
  const surface = canvasRef.value
  const image = gif.value?.frames[frameIndex]?.image ?? rasterSource.value
  if (!surface || !image || !loaded.value) return
  const width = actualSize.value.width || desiredSize.value.width
  const height = actualSize.value.height || desiredSize.value.height
  const scale = window.devicePixelRatio || 1
  surface.width = Math.max(1, Math.round(width * scale))
  surface.height = Math.max(1, Math.round(height * scale))
  const context = surface.getContext('2d')
  if (!context) return
  context.scale(scale, scale)
  context.clearRect(0, 0, width, height)
  const pixelWidth = source.value.PixelWidth
  const pixelHeight = source.value.PixelHeight
  const fitted = imageStretchSize(naturalSize.value.width, naturalSize.value.height, width, height, stretch.value)
  const left = (width - fitted.width) / 2
  const top = (height - fitted.height) / 2
  if (!hasNineGrid.value) {
    context.drawImage(image, left, top, fitted.width, fitted.height)
    return
  }
  // XAML Thickness is left, top, right, bottom. Corners retain their source
  // pixels; only edge centers and the middle are stretched. If the arranged
  // region is too small, all corner dimensions scale together to fit.
  const [l, t, r, b] = nineGrid.value as [number, number, number, number]
  const sourceScale = Math.min(1, pixelWidth / Math.max(1, l + r), pixelHeight / Math.max(1, t + b))
  const destinationScale = Math.min(1, fitted.width / Math.max(1, l + r), fitted.height / Math.max(1, t + b))
  const sx = [0, l * sourceScale, pixelWidth - r * sourceScale, pixelWidth]
  const sy = [0, t * sourceScale, pixelHeight - b * sourceScale, pixelHeight]
  const dx = [left, left + l * destinationScale, left + fitted.width - r * destinationScale, left + fitted.width]
  const dy = [top, top + t * destinationScale, top + fitted.height - b * destinationScale, top + fitted.height]
  for (let row = 0; row < 3; row += 1) for (let column = 0; column < 3; column += 1) {
    const sw = sx[column + 1]! - sx[column]!
    const sh = sy[row + 1]! - sy[row]!
    const dw = dx[column + 1]! - dx[column]!
    const dh = dy[row + 1]! - dy[row]!
    if (sw > 0 && sh > 0 && dw > 0 && dh > 0) context.drawImage(image, sx[column]!, sy[row]!, sw, sh, dx[column]!, dy[row]!, dw, dh)
  }
}

function play() {
  if (!gif.value || gif.value.frames.length < 2 || source.value.IsPlaying) return
  source.value.__state.playing = true
  if (completedLoops >= gif.value.repetitions) { completedLoops = 0; frameIndex = 0; frameElapsed = 0 }
  const tick = (time: number) => {
    if (!gif.value || !source.value.IsPlaying || disposed) return
    if (lastFrameTime) frameElapsed += Math.max(0, time - lastFrameTime)
    lastFrameTime = time
    let changed = false
    while (frameElapsed >= (gif.value.frames[frameIndex]?.duration ?? 100)) {
      frameElapsed -= gif.value.frames[frameIndex]?.duration ?? 100
      if (frameIndex + 1 === gif.value.frames.length) {
        completedLoops += 1
        if (completedLoops >= gif.value.repetitions) { stop(); break }
      }
      frameIndex = (frameIndex + 1) % gif.value.frames.length
      changed = true
    }
    if (changed) draw()
    if (source.value.IsPlaying) animationFrame = requestAnimationFrame(tick)
  }
  animationFrame = requestAnimationFrame(tick)
}
function stop() {
  cancelPlayback()
  source.value.__state.playing = false
  // BitmapImage.Stop stops animation playback at its current frame; the
  // remaining frame delay is retained when Play resumes.
}

const publicApi = reactive({
  Element: computed(() => rootRef.value),
  Source: computed({ get: () => source.value, set: input => { sourceOverride.value = input } }),
  Stretch: computed({ get: () => stretch.value, set: input => { stretchOverride.value = input } }),
  NineGrid: computed(() => value(props.NineGrid)),
  ActualWidth: computed(() => actualSize.value.width), ActualHeight: computed(() => actualSize.value.height)
})
defineExpose(publicApi)

const raiseOpened = (model: ImageSourceModel) => {
  const args: ImageEventArgs = { OriginalSource: publicApi, PixelWidth: model.PixelWidth, PixelHeight: model.PixelHeight }
  if (registeredSource.value?.model === model) registeredSource.value.opened({ ...args, OriginalSource: model })
  emit('ImageOpened', publicApi, args)
  resolveXamlHandler(attrs.ImageOpened, instance)?.(publicApi, args)
}
const raiseFailed = (model: ImageSourceModel, error: unknown) => {
  const args: ImageEventArgs = { OriginalSource: publicApi, ErrorMessage: error instanceof Error ? error.message : error instanceof Event ? 'ImageFailed' : String(error ?? ''), BrowserEvent: error instanceof Event ? error : undefined }
  if (registeredSource.value?.model === model) registeredSource.value.failed({ ...args, OriginalSource: model })
  emit('ImageFailed', publicApi, args)
  resolveXamlHandler(attrs.ImageFailed, instance)?.(publicApi, args)
}

async function load() {
  const generation = ++loadGeneration
  stop()
  if (attachedModel && attachedModel !== source.value) {
    attachedModel.__state.playing = false
    attachedModel.__play = undefined
    attachedModel.__stop = undefined
  }
  request?.abort()
  request = new AbortController()
  if (imageLoader) { imageLoader.onload = null; imageLoader.onerror = null; imageLoader.src = '' }
  gif.value?.dispose()
  gif.value = null
  rasterSource.value = null
  loaded.value = false
  frameIndex = 0
  frameElapsed = 0
  completedLoops = 0
  const model = source.value
  attachedModel = model
  model.__state.pixelWidth = model.__state.pixelHeight = 0
  model.__state.animated = false
  model.__play = play
  model.__stop = stop
  if (!model.UriSource) { naturalSize.value = { width: 0, height: 0 }; return }
  try {
    const image = new window.Image()
    imageLoader = image
    // Only canvas-backed sources require an origin-clean decode. Ordinary
    // Image URIs retain the browser's normal cross-origin image behavior.
    if (usesCanvas.value || /\.gif(?:$|[?#])/i.test(model.UriSource)) image.crossOrigin = 'anonymous'
    const imageReady = new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = model.UriSource
    })
    const loadedImage = await imageReady
    if (generation !== loadGeneration || disposed) return
    const natural = { width: loadedImage.naturalWidth, height: loadedImage.naturalHeight }
    const decodeWidth = model.__kind === 'SvgImageSource' ? model.RasterizePixelWidth : model.DecodePixelWidth
    const decodeHeight = model.__kind === 'SvgImageSource' ? model.RasterizePixelHeight : model.DecodePixelHeight
    const density = model.DecodePixelType === 'Logical' ? window.devicePixelRatio || 1 : 1
    const decoded = imageDecodeSize(natural.width, natural.height, decodeWidth * density, decodeHeight * density)
    model.__state.pixelWidth = decoded.width
    model.__state.pixelHeight = decoded.height
    naturalSize.value = natural
    if (/\.gif(?:$|[?#])/i.test(model.UriSource)) {
      const response = await fetch(model.UriSource, { signal: request.signal, mode: 'cors' })
      if (!response.ok) throw new Error(String(response.status))
      const decodedGif = await decodeGif(await response.arrayBuffer())
      if (generation !== loadGeneration || disposed) { decodedGif.dispose(); return }
      if (decodeWidth || decodeHeight) {
        for (const frame of decodedGif.frames) {
          const frameSurface = document.createElement('canvas')
          frameSurface.width = decoded.width
          frameSurface.height = decoded.height
          frameSurface.getContext('2d')?.drawImage(frame.image, 0, 0, decoded.width, decoded.height)
          frame.image = frameSurface
        }
        decodedGif.width = decoded.width
        decodedGif.height = decoded.height
      }
      gif.value = decodedGif
      model.__state.animated = decodedGif.frames.length > 1
      model.__state.pixelWidth = decodedGif.width
      model.__state.pixelHeight = decodedGif.height
    } else if (decodeWidth || decodeHeight) {
      const decodedSurface = document.createElement('canvas')
      decodedSurface.width = decoded.width
      decodedSurface.height = decoded.height
      decodedSurface.getContext('2d')?.drawImage(loadedImage, 0, 0, decoded.width, decoded.height)
      rasterSource.value = decodedSurface
    } else rasterSource.value = loadedImage
    loaded.value = true
    await nextTick()
    draw()
    if (model.AutoPlay) play()
    raiseOpened(model)
  } catch (error) {
    if (generation !== loadGeneration || disposed) return
    raiseFailed(model, error)
  }
}
watch(() => [source.value, source.value.UriSource, source.value.DecodePixelWidth, source.value.DecodePixelHeight, source.value.DecodePixelType, source.value.RasterizePixelWidth, source.value.RasterizePixelHeight], () => { void load() }, { immediate: true })
watch(() => source.value.AutoPlay, autoPlay => { if (autoPlay) play(); else stop() })
watch([stretch, nineGrid, desiredSize, usesCanvas], () => { void nextTick(draw) }, { deep: true })
onMounted(() => {
  const parent = rootRef.value?.parentElement
  const measureAxis = (axis: 'width' | 'height') => {
    let chrome = 0
    for (let element = parent; element; element = element.parentElement) {
      // CViewbox measures its child at infinity. IconSourceElement adds a
      // Grid between ImageIcon and Viewbox, so honor the measurement boundary
      // through that visual tree before observing the Viewbox's arranged size.
      if (element.classList.contains('win-viewbox-container')) return Infinity
      const explicit = element.style[axis]
      const style = getComputedStyle(element)
      chrome += axis === 'width'
        ? (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0) + (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.borderRightWidth) || 0)
        : (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0) + (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0)
      const maximum = style[axis === 'width' ? 'maxWidth' : 'maxHeight']
      const limit = Math.min(explicit.endsWith('px') ? element.getBoundingClientRect()[axis] : Infinity, maximum.endsWith('px') ? parseFloat(maximum) : Infinity)
      if (Number.isFinite(limit)) return Math.max(0, limit - chrome)
      if (style.display === 'flex' && (axis === 'height' ? style.flexDirection.startsWith('column') : style.flexDirection.startsWith('row'))) return Infinity
    }
    return Infinity
  }
  const measureParent = () => {
    if (!parent) return
    parentAvailableSize.value = {
      width: measureAxis('width'), height: measureAxis('height')
    }
  }
  const measure = () => {
    if (!rootRef.value) return
    measureParent()
    const bounds = rootRef.value.getBoundingClientRect()
    actualSize.value = { width: bounds.width, height: bounds.height }
    draw()
  }
  measure()
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    observer = new ResizeObserver(measure)
    observer.observe(rootRef.value)
    if (parent) observer.observe(parent)
  }
  measureParent()
})
onBeforeUnmount(() => {
  disposed = true
  loadGeneration += 1
  stop()
  request?.abort()
  observer?.disconnect()
  gif.value?.dispose()
  if (imageLoader) { imageLoader.onload = null; imageLoader.onerror = null; imageLoader.src = '' }
  source.value.__play = undefined
  source.value.__stop = undefined
})
</script>

<style>
.win-image-host { display: block; position: relative; flex-shrink: 0; box-sizing: border-box; min-width: 0; min-height: 0; overflow: hidden; background: transparent; }
.win-image-surface { position: absolute; inset: 0; display: block; width: 100%; height: 100%; max-width: none; max-height: none; object-position: center; user-select: none; -webkit-user-drag: none; }
</style>
