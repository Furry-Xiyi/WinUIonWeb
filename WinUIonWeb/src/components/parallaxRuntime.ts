import type { ComponentInternalInstance, InjectionKey, Ref } from 'vue'

export interface ParallaxSize { width: number; height: number }

export interface ParallaxChildLayout {
  availableSize: Ref<ParallaxSize>
  arrangedSize: Ref<ParallaxSize | null>
  isDirectChild(instance: ComponentInternalInstance | null): boolean
  reportDesiredSize(size: ParallaxSize): void
}

export const parallaxChildLayoutKey: InjectionKey<ParallaxChildLayout> = Symbol('ParallaxView.ChildLayout')

export function measureParallaxAxis(availableSize: number, childDesiredSize: number, minSize: number, maxSize: number) {
  const minimum = Math.max(0, minSize)
  const maximum = Math.max(minimum, maxSize)
  const available = Math.min(maximum, Math.max(minimum, availableSize))
  return {
    availableSize: available,
    desiredSize: Math.min(maximum, Math.max(minimum, Number.isFinite(available) ? available : childDesiredSize))
  }
}

export interface ParallaxOffsetsInput {
  kind: 'Absolute' | 'Relative'
  startOffset: number
  endOffset: number
  viewportSize: number
  contentSize: number
  zoomFactor: number
  underpan: number
  overpan: number
  insideSource: boolean
  parallaxOffset: number
  parallaxSize: number
}

// ParallaxView.cpp: UpdateStartOffsetExpression / UpdateEndOffsetExpression.
export function resolveParallaxOffsets(input: ParallaxOffsetsInput) {
  const { kind, startOffset, endOffset, viewportSize, contentSize, zoomFactor, underpan, overpan, insideSource, parallaxOffset, parallaxSize } = input
  if (kind === 'Relative') {
    return {
      startOffset: (insideSource ? parallaxOffset + startOffset : startOffset) * zoomFactor - (insideSource ? viewportSize : 0) - underpan,
      endOffset: (insideSource
        ? (parallaxOffset + parallaxSize + endOffset) * zoomFactor
        : Math.max(0, (contentSize + endOffset) * zoomFactor - viewportSize)) + overpan
    }
  }
  const start = startOffset > 0 ? startOffset * zoomFactor : startOffset
  let end: number
  if (contentSize > viewportSize) {
    end = endOffset <= contentSize - viewportSize
      ? Math.max(0, endOffset * zoomFactor)
      : Math.max(0, (contentSize - viewportSize) * zoomFactor) + endOffset - contentSize + viewportSize
  } else {
    end = endOffset <= 0
      ? Math.max(0, (contentSize + endOffset) * zoomFactor - viewportSize)
      : Math.max(0, contentSize * zoomFactor - viewportSize) + endOffset
  }
  return { startOffset: start, endOffset: end }
}

export interface ParallaxTranslationInput {
  position: number
  startOffset: number
  endOffset: number
  shift: number
  maxRatio: number
  clamped: boolean
}

// Preserve the official branches, including zero and reversed offset ranges.
export function computeParallaxTranslation(input: ParallaxTranslationInput): number {
  const { position, startOffset, endOffset, shift, clamped } = input
  if (shift === 0) return 0
  const maxRatio = Math.max(0, input.maxRatio)
  const range = endOffset - startOffset
  if (clamped) {
    const endpoint = -Math.min(maxRatio * Math.max(0, range), Math.abs(shift))
    if (shift > 0) {
      if (position <= startOffset) return 0
      if (position < endOffset) return -Math.min(maxRatio, shift / range) * (position - startOffset)
      return endpoint
    }
    if (position <= startOffset) return endpoint
    if (position < endOffset) return Math.min(maxRatio, -shift / range) * (position - endOffset)
    return 0
  }
  if (range === 0) return 0
  return shift > 0
    ? -Math.min(maxRatio, shift / range) * (position - startOffset)
    : Math.min(maxRatio, -shift / range) * (position - endOffset)
}

export interface ParallaxArrangeInput {
  width: number
  height: number
  desiredWidth: number
  desiredHeight: number
  horizontalShift: number
  verticalShift: number
  horizontalAlignment: string
  verticalAlignment: string
  autoWidth: boolean
  autoHeight: boolean
}

// ParallaxView.cpp: ArrangeOverride, with Border's child alignment behavior.
export function arrangeParallaxChild(input: ParallaxArrangeInput) {
  let width = input.desiredWidth
  let height = input.desiredHeight
  const shiftedWidth = input.width + Math.abs(input.horizontalShift)
  const shiftedHeight = input.height + Math.abs(input.verticalShift)
  if (input.horizontalShift !== 0 && width < shiftedWidth) {
    const ratio = width > 0 ? shiftedWidth / width : 0
    width = shiftedWidth
    if (ratio !== 0 && input.autoHeight && input.verticalAlignment === 'Stretch') height *= ratio
  }
  if (input.verticalShift !== 0 && height < shiftedHeight) {
    const ratio = height > 0 ? shiftedHeight / height : 0
    height = shiftedHeight
    if (ratio !== 0 && input.autoWidth && input.horizontalAlignment === 'Stretch') width *= ratio
  }
  const x = input.horizontalAlignment === 'Center' || (input.horizontalAlignment === 'Stretch' && width < input.width)
    ? (input.width - width) / 2 : input.horizontalAlignment === 'Right' ? input.width - width : 0
  const y = input.verticalAlignment === 'Center' || (input.verticalAlignment === 'Stretch' && height < input.height)
    ? (input.height - height) / 2 : input.verticalAlignment === 'Bottom' ? input.height - height : 0
  return { x, y, width, height }
}
