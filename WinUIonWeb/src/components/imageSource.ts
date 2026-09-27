import { defineComponent, Fragment, h, isVNode, reactive, type ComponentInternalInstance, type InjectionKey, type VNode } from 'vue'
import { resolveXamlResourceObject, resolveXamlValue } from './xamlRuntime'

export type ImageSourceKind = 'BitmapImage' | 'SvgImageSource'
export type ImageSourceModel = {
  UriSource: string
  AutoPlay: boolean
  DecodePixelWidth: number
  DecodePixelHeight: number
  DecodePixelType: string
  RasterizePixelWidth: number
  RasterizePixelHeight: number
  readonly PixelWidth: number
  readonly PixelHeight: number
  readonly IsAnimatedBitmap: boolean
  readonly IsPlaying: boolean
  Play: () => void
  Stop: () => void
  __kind: ImageSourceKind
  __state: { pixelWidth: number; pixelHeight: number; animated: boolean; playing: boolean }
  __play?: () => void
  __stop?: () => void
}

export type ImageEventArgs = { OriginalSource: unknown; PixelWidth?: number; PixelHeight?: number; ErrorMessage?: string; BrowserEvent?: Event }
export type ImageSourceRegistration = {
  model: ImageSourceModel
  opened: (args: ImageEventArgs) => void
  failed: (args: ImageEventArgs) => void
}
export const imageSourceContextKey: InjectionKey<(registration: ImageSourceRegistration | null) => void> = Symbol('winui-image-source')

export const ImageSourceProperty = defineComponent({
  name: 'Image.Source',
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

export const imageNumber = (value: unknown) => {
  const result = Number(value)
  return Number.isFinite(result) && result > 0 ? result : 0
}
export const imageBoolean = (value: unknown) => value === true || value === 'True'

export const imageUri = (input: unknown, instance: ComponentInternalInstance | null, resources?: Record<string, VNode> | null): string => {
  if (typeof input === 'string') {
    const key = input.match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}$/)?.[1]
    if (key) {
      const resource = resolveXamlResourceObject(key, instance) ?? resources?.[key]
      if (isVNode(resource)) return typeof resource.children === 'string' ? resource.children : String(resource.props?.Value ?? '')
      return typeof resource === 'string' ? resource : ''
    }
  }
  const resolved = resolveXamlValue(input, instance)
  return typeof resolved === 'string' ? resolved : ''
}

/** ImageSource's public dependency properties retain their official casing. */
export const createImageSourceModel = (kind: ImageSourceKind = 'BitmapImage'): ImageSourceModel => {
  const state = reactive({ pixelWidth: 0, pixelHeight: 0, animated: false, playing: false })
  const model: ImageSourceModel = reactive({
    UriSource: '', AutoPlay: true, DecodePixelWidth: 0, DecodePixelHeight: 0,
    DecodePixelType: 'Physical', RasterizePixelWidth: 0, RasterizePixelHeight: 0,
    get PixelWidth() { return state.pixelWidth },
    get PixelHeight() { return state.pixelHeight },
    get IsAnimatedBitmap() { return state.animated },
    get IsPlaying() { return state.playing },
    Play: () => model.__play?.(),
    Stop: () => model.__stop?.(),
    __kind: kind,
    __state: state
  })
  return model
}

/** A single decode dimension preserves aspect ratio, as WinUI does. */
export const imageDecodeSize = (width: number, height: number, requestedWidth: number, requestedHeight: number) => {
  if (!requestedWidth && !requestedHeight) return { width, height }
  const ratio = width / Math.max(1, height)
  return {
    width: Math.max(1, Math.round(requestedWidth || requestedHeight * ratio)),
    height: Math.max(1, Math.round(requestedHeight || requestedWidth / ratio))
  }
}

export const imageStretchSize = (width: number, height: number, availableWidth: number, availableHeight: number, stretch: string) => {
  if (stretch === 'None' || (!Number.isFinite(availableWidth) && !Number.isFinite(availableHeight))) return { width, height }
  let sx = availableWidth / Math.max(1, width)
  let sy = availableHeight / Math.max(1, height)
  if (!Number.isFinite(sx)) sx = sy
  else if (!Number.isFinite(sy)) sy = sx
  else if (stretch === 'Uniform') sx = sy = Math.min(sx, sy)
  else if (stretch === 'UniformToFill') sx = sy = Math.max(sx, sy)
  return { width: Math.max(0, width * sx), height: Math.max(0, height * sy) }
}
