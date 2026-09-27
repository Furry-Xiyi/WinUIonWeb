import { computed, ref, watch, type ComponentInternalInstance } from 'vue'
import { resolveXamlValue, updateXamlBinding } from './xamlRuntime'

/** A writable dependency property for both XAML bindings and named controls. */
export const useProgressProperty = (
  props: Record<string, unknown>,
  name: string,
  instance: ComponentInternalInstance | null,
  publish: (name: string, value: unknown) => void
) => {
  const source = computed(() => resolveXamlValue(props[name], instance))
  const current = ref(source.value)
  watch(source, value => { current.value = value }, { flush: 'sync' })
  return computed({
    get: () => current.value,
    set: value => {
      const next = resolveXamlValue(value, instance)
      current.value = next
      updateXamlBinding(props[name], next, instance)
      publish(name, next)
    }
  })
}

export const progressNumber = (value: unknown, fallback = 0): number => {
  if (value === undefined || value === null || value === '') return fallback
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export const progressBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string' && /^(True|False)$/i.test(value.trim())) return /^True$/i.test(value.trim())
  return fallback
}

/** WinUI coerces the opposite endpoint when Minimum or Maximum changes. */
export const useProgressRange = (
  props: Record<string, unknown>,
  instance: ComponentInternalInstance | null,
  publish: (name: string, value: unknown) => void
) => {
  const Value = useProgressProperty(props, 'Value', instance, publish)
  const Minimum = useProgressProperty(props, 'Minimum', instance, publish)
  const Maximum = useProgressProperty(props, 'Maximum', instance, publish)
  const minimum = computed(() => progressNumber(Minimum.value, 0))
  const maximum = computed(() => Math.max(minimum.value, progressNumber(Maximum.value, 100)))
  const clamp = (value: unknown) => Math.min(maximum.value, Math.max(minimum.value, progressNumber(value, minimum.value)))
  const coercedValue = computed(() => clamp(Value.value))
  const fraction = computed(() => maximum.value > minimum.value ? (coercedValue.value - minimum.value) / (maximum.value - minimum.value) : 0)
  watch(Value, value => {
    const next = clamp(value)
    if (!Object.is(progressNumber(value, minimum.value), next)) Value.value = next
  }, { flush: 'sync' })
  watch(() => progressNumber(Minimum.value, 0), value => {
    if (value > progressNumber(Maximum.value, 100)) Maximum.value = value
    if (!Object.is(Value.value, clamp(Value.value))) Value.value = clamp(Value.value)
  }, { flush: 'sync' })
  watch(() => progressNumber(Maximum.value, 100), value => {
    if (value < progressNumber(Minimum.value, 0)) Minimum.value = value
    if (!Object.is(Value.value, clamp(Value.value))) Value.value = clamp(Value.value)
  }, { flush: 'sync' })
  if (progressNumber(Maximum.value, 100) < minimum.value) Maximum.value = minimum.value
  if (!Object.is(progressNumber(Value.value, minimum.value), clamp(Value.value))) Value.value = clamp(Value.value)
  const exposedValue = computed({ get: () => coercedValue.value, set: value => { Value.value = clamp(value) } })
  const exposedMinimum = computed({ get: () => minimum.value, set: value => { Minimum.value = progressNumber(value, minimum.value) } })
  const exposedMaximum = computed({ get: () => maximum.value, set: value => { Maximum.value = progressNumber(value, maximum.value) } })
  return { Value: exposedValue, Minimum: exposedMinimum, Maximum: exposedMaximum, minimum, maximum, fraction, coercedValue }
}

export const progressBrush = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value || undefined
  if (value && typeof value === 'object' && 'Color' in value) return String(value.Color)
  return undefined
}

export const progressThickness = (value: unknown) => {
  const parts = String(value || 0).split(',').map(part => progressNumber(part.trim(), 0))
  if (parts.length === 4) return { left: parts[0], top: parts[1], right: parts[2], bottom: parts[3] }
  if (parts.length === 2) return { left: parts[0], top: parts[1], right: parts[0], bottom: parts[1] }
  return { left: parts[0], top: parts[0], right: parts[0], bottom: parts[0] }
}

export const progressCornerRadius = (value: unknown): string | undefined => {
  if (value === undefined || value === null || value === '') return undefined
  const parts = String(value).split(',').map(part => `${progressNumber(part.trim(), 0)}px`)
  return parts.length === 4 ? parts.join(' ') : parts[0]
}

// ProgressRingDeterminate.cpp uses a 2-second source. The player's progress
// mapping preserves the source's small leading/trailing trim intervals.
export const determinateRingTrim = (progress: number): number => {
  const points = [[0, 0.0001], [0.00833333377, 0.0001], [0.25, 0.25], [0.5, 0.5], [0.75, 0.75], [0.983333349, 0.96666666], [0.991666675, 1], [1, 1]]
  for (let index = 1; index < points.length; index++) {
    const [endProgress, endValue] = points[index]
    if (progress <= endProgress) {
      const [startProgress, startValue] = points[index - 1]
      return startValue + (endValue - startValue) * Math.max(0, (progress - startProgress) / (endProgress - startProgress))
    }
  }
  return 1
}
