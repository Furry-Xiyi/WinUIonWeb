import { shallowRef, unref, type CSSProperties } from 'vue'

export interface ThemeShadowReceivers extends Iterable<unknown> {
  readonly Count: number
  readonly Size: number
  Add(element: unknown): void
  Append(element: unknown): void
  Insert(index: number, element: unknown): void
  InsertAt(index: number, element: unknown): void
  GetAt(index: number): unknown
  SetAt(index: number, element: unknown): void
  IndexOf(element: unknown): number
  Remove(element: unknown): boolean
  RemoveAt(index: number): void
  RemoveAtEnd(): void
  Clear(): void
}

export interface ThemeShadowValue {
  readonly __xamlShadow: 'ThemeShadow'
  readonly Receivers: ThemeShadowReceivers
  readonly IsDisposed: boolean
  AttachCaster(element: HTMLElement): () => void
  Dispose(): void
}

export const resolveShadowElement = (value: unknown): HTMLElement | null => {
  if (typeof HTMLElement === 'undefined') return null
  if (value instanceof HTMLElement) return value
  if (!value || typeof value !== 'object') return null
  const source = value as { Element?: unknown; $el?: unknown }
  const element = unref(source.Element) ?? source.$el
  return element instanceof HTMLElement ? element : null
}

export const isThemeShadow = (value: unknown): value is ThemeShadowValue => Boolean(value && typeof value === 'object'
  && (value as ThemeShadowValue).__xamlShadow === 'ThemeShadow')

// Reference UIElementWeakCollection keeps expired slots and permits duplicates.
export const createThemeShadow = (): ThemeShadowValue => {
  const items = shallowRef<WeakRef<object>[]>([])
  const casters = new Set<WeakRef<HTMLElement>>()
  const disposed = shallowRef(false)
  const bounds = (index: number, insert = false) => {
    if (!Number.isInteger(index) || index < 0 || index >= items.value.length + (insert ? 1 : 0)) {
      throw new RangeError('UIElementWeakCollection index is out of bounds.')
    }
  }
  const validate = (value: unknown, additionalCaster?: HTMLElement) => {
    if (disposed.value) throw new Error('ThemeShadow has been disposed.')
    const element = resolveShadowElement(value)
    if (!element) throw new TypeError('ThemeShadow.Receivers requires a UIElement.')
    const validateAncestor = (caster: HTMLElement | undefined) => {
      if (caster && (element === caster || element.contains(caster))) {
        throw new TypeError('An ancestor element cannot be a ThemeShadow receiver.')
      }
    }
    if (additionalCaster) validateAncestor(additionalCaster)
    for (const reference of casters) {
      const caster = reference.deref()
      if (caster) validateAncestor(caster)
      else casters.delete(reference)
    }
    return new WeakRef(value as object)
  }
  const getAt = (index: number) => { bounds(index); return items.value[index]!.deref() ?? null }
  const insert = (index: number, value: unknown) => {
    bounds(index, true)
    const reference = validate(value)
    const next = [...items.value]
    next.splice(index, 0, reference)
    items.value = next
  }
  const indexOf = (value: unknown) => {
    const element = resolveShadowElement(value)
    return items.value.findIndex(reference => {
      const item = reference.deref()
      return item === value || Boolean(element && resolveShadowElement(item) === element)
    })
  }
  const removeAt = (index: number) => {
    bounds(index)
    const next = [...items.value]
    next.splice(index, 1)
    items.value = next
  }
  const receivers: ThemeShadowReceivers = {
    get Count() { return items.value.length },
    get Size() { return items.value.length },
    Add: value => insert(items.value.length, value),
    Append: value => insert(items.value.length, value),
    Insert: insert,
    InsertAt: insert,
    GetAt: getAt,
    SetAt(index, value) {
      bounds(index)
      const reference = validate(value)
      const next = [...items.value]
      next[index] = reference
      items.value = next
    },
    IndexOf: indexOf,
    Remove(value) {
      const index = indexOf(value)
      if (index < 0) return false
      removeAt(index)
      return true
    },
    RemoveAt: removeAt,
    RemoveAtEnd: () => removeAt(items.value.length - 1),
    Clear: () => { items.value = [] },
    *[Symbol.iterator]() { for (const reference of items.value) yield reference.deref() ?? null }
  }
  return Object.freeze({
    __xamlShadow: 'ThemeShadow' as const,
    Receivers: Object.freeze(receivers),
    get IsDisposed() { return disposed.value },
    AttachCaster(element: HTMLElement) {
      if (disposed.value) throw new Error('ThemeShadow has been disposed.')
      for (const item of receivers) if (item) validate(item, element)
      const reference = new WeakRef(element)
      casters.add(reference)
      return () => { casters.delete(reference) }
    },
    Dispose() {
      disposed.value = true
      items.value = []
      casters.clear()
    }
  })
}

export interface ThemeShadowRecipe {
  Elevation: number
  AmbientBlurRadius: number
  DirectionalBlurRadius: number
  AmbientYOffset: number
  DirectionalYOffset: number
  AmbientOpacity: number
  DirectionalOpacity: number
  AmbientAlpha: number
  DirectionalAlpha: number
  Insets: { Left: number; Top: number; Right: number; Bottom: number }
}

// WinUI-Reference DropShadowRecipe.h, including its byte alpha conversion.
export const getThemeShadowRecipe = (translationZ: unknown, theme: unknown): ThemeShadowRecipe => {
  const z = Number(translationZ)
  const elevation = Math.min(64, Number.isFinite(z) ? z / 2 : 0)
  const dark = String(theme).toLowerCase() === 'dark'
  const ambientBlurRadius = elevation > 16 ? elevation / 3 : 2
  const ambientYOffset = elevation > 16 ? 2 : 0
  const ambientOpacity = elevation > 16 ? dark ? .37 : .15 : 0
  const directionalOpacity = elevation < 2 ? 0 : elevation <= 16
    ? dark ? .26 : Math.min(elevation / 100 + .06, .14)
    : dark ? .37 : .19
  const directionalYOffset = elevation * .5
  const maxBlurRadius = Math.ceil(Math.max(ambientBlurRadius, elevation))
  return {
    Elevation: elevation,
    AmbientBlurRadius: ambientBlurRadius,
    DirectionalBlurRadius: elevation,
    AmbientYOffset: ambientYOffset,
    DirectionalYOffset: directionalYOffset,
    AmbientOpacity: ambientOpacity,
    DirectionalOpacity: directionalOpacity,
    AmbientAlpha: Math.trunc(ambientOpacity * 255) / 255,
    DirectionalAlpha: Math.trunc(directionalOpacity * 255) / 255,
    Insets: {
      Left: maxBlurRadius, Right: maxBlurRadius,
      Top: Math.ceil(Math.max(ambientBlurRadius - ambientYOffset, elevation - directionalYOffset)),
      Bottom: Math.ceil(Math.max(ambientBlurRadius + ambientYOffset, elevation + directionalYOffset))
    }
  }
}

export const shadowCornerRadius = (value: unknown): number => {
  const values = typeof value === 'number' ? [value] : String(value ?? 0).split(/[\s,]+/).map(Number)
  return Math.max(0, ...values.filter(Number.isFinite))
}

// CreateDropShadowVisual uses a one-pixel inset caster and a hollow nine-grid.
export const themeShadowVisualStyle = (recipe: ThemeShadowRecipe, cornerRadius: number): CSSProperties => {
  if (recipe.DirectionalOpacity === 0) return { display: 'none' }
  const radius = Math.max(0, cornerRadius)
  const casterSize = Math.max(64, Math.round(radius * 2))
  const { Left: left, Top: top, Right: right, Bottom: bottom } = recipe.Insets
  const width = casterSize + left + right
  const height = casterSize + top + bottom
  const roundedRect = `x="${left + 1}" y="${top + 1}" width="${casterSize - 2}" height="${casterSize - 2}" rx="${radius}"`
  const layer = (id: string, blur: number, offset: number, alpha: number) => alpha <= 0 ? ''
    : `<filter id="${id}" x="0" y="0" width="${width}" height="${height}" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="${(blur + 1) / 3}"/><feOffset dy="${offset}"/></filter>`
  const ambient = layer('a', recipe.AmbientBlurRadius, recipe.AmbientYOffset, recipe.AmbientAlpha)
  const directional = layer('d', recipe.DirectionalBlurRadius, recipe.DirectionalYOffset, recipe.DirectionalAlpha)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs>${ambient}${directional}<mask id="h" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="white"/><rect ${roundedRect} fill="black"/></mask></defs><g mask="url(#h)">${ambient ? `<rect ${roundedRect} fill="black" fill-opacity="${recipe.AmbientAlpha}" filter="url(#a)"/>` : ''}<rect ${roundedRect} fill="black" fill-opacity="${recipe.DirectionalAlpha}" filter="url(#d)"/></g></svg>`
  const slices = [top, right, bottom, left].map(inset => inset + radius + 1)
  return {
    position: 'absolute', pointerEvents: 'none', boxSizing: 'border-box',
    left: `${-left}px`, top: `${-top}px`,
    width: `calc(100% + ${left + right}px)`, height: `calc(100% + ${top + bottom}px)`,
    borderStyle: 'solid', borderColor: 'transparent', borderWidth: slices.map(value => `${value}px`).join(' '),
    borderImageSource: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    borderImageSlice: slices.join(' '), borderImageWidth: '1', borderImageRepeat: 'stretch'
  }
}
