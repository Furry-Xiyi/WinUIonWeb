type SecondaryTouch = {
  pointerId: number
  dragPointerId: number
  clientY: number
  scrollChain: HTMLElement[]
  scrollTops: number[]
}

const scrollableAncestors = (target: EventTarget | null): HTMLElement[] => {
  let element: HTMLElement | null = null
  if (target instanceof HTMLElement) element = target
  else if (target instanceof Element || target instanceof Node) element = target.parentElement
  const chain: HTMLElement[] = []

  for (let current = element; current; current = current.parentElement) {
    const overflowY = getComputedStyle(current).overflowY
    if (!/^(auto|scroll|overlay)$/.test(overflowY)) continue
    if (current.scrollHeight > current.clientHeight) chain.push(current)
  }

  const pageScroller = document.scrollingElement
  if (pageScroller instanceof HTMLElement
    && !chain.includes(pageScroller)
    && pageScroller.scrollHeight > pageScroller.clientHeight) {
    chain.push(pageScroller)
  }

  return chain
}

const scrollByTouchDelta = (chain: HTMLElement[], deltaY: number) => {
  let remaining = deltaY

  for (const element of chain) {
    if (Math.abs(remaining) < 0.5) break
    const previous = element.scrollTop
    const maximum = Math.max(0, element.scrollHeight - element.clientHeight)
    element.scrollTop = Math.max(0, Math.min(maximum, previous + remaining))
    remaining -= element.scrollTop - previous
  }
}

/**
 * Keeps a secondary touch scrolling while the primary touch is captured by a
 * drag interaction. `touch-action: none` is needed for the drag pointer, so
 * native touch panning is unavailable on the same surface during that drag.
 */
export const attachSecondaryTouchScrollDuringDrag = (
  isDragging: () => boolean,
  getDragPointerId: () => number | null | undefined
) => {
  let secondaryTouch: SecondaryTouch | null = null

  const clearSecondaryTouch = (event?: PointerEvent) => {
    if (!event || secondaryTouch?.pointerId === event.pointerId) secondaryTouch = null
  }

  const beginSecondaryTouch = (event: PointerEvent) => {
    const dragPointerId = getDragPointerId()
    if (!isDragging() || dragPointerId == null || event.pointerType !== 'touch'
      || event.pointerId === dragPointerId || secondaryTouch) return

    secondaryTouch = {
      pointerId: event.pointerId,
      dragPointerId,
      clientY: event.clientY,
      scrollChain: scrollableAncestors(event.target),
      scrollTops: []
    }
    secondaryTouch.scrollTops = secondaryTouch.scrollChain.map(element => element.scrollTop)
  }

  const onPointerDown = (event: PointerEvent) => beginSecondaryTouch(event)
  const onPointerMove = (event: PointerEvent) => {
    if (!isDragging()) {
      secondaryTouch = null
      return
    }

    const dragPointerId = getDragPointerId()
    if (dragPointerId == null || event.pointerType !== 'touch' || event.pointerId === dragPointerId) return
    if (!secondaryTouch || secondaryTouch.pointerId !== event.pointerId
      || secondaryTouch.dragPointerId !== dragPointerId) {
      secondaryTouch = null
      beginSecondaryTouch(event)
      return
    }

    const fingerDelta = secondaryTouch.clientY - event.clientY
    secondaryTouch.clientY = event.clientY
    if (Math.abs(fingerDelta) < 0.5) return

    // Some browsers may still scroll a target outside the dragged row. Account
    // for that movement first so manual forwarding never doubles the scroll.
    let browserScrollDelta = 0
    secondaryTouch.scrollChain.forEach((element, index) => {
      browserScrollDelta += element.scrollTop - secondaryTouch!.scrollTops[index]
    })
    const remainingDelta = fingerDelta - browserScrollDelta
    if (Math.abs(remainingDelta) >= 0.5) {
      scrollByTouchDelta(secondaryTouch.scrollChain, remainingDelta)
      if (event.cancelable) event.preventDefault()
    }
    secondaryTouch.scrollTops = secondaryTouch.scrollChain.map(element => element.scrollTop)
  }
  const onPointerEnd = (event: PointerEvent) => clearSecondaryTouch(event)

  document.addEventListener('pointerdown', onPointerDown, true)
  document.addEventListener('pointermove', onPointerMove, { capture: true, passive: false })
  document.addEventListener('pointerup', onPointerEnd, true)
  document.addEventListener('pointercancel', onPointerEnd, true)

  return () => {
    document.removeEventListener('pointerdown', onPointerDown, true)
    document.removeEventListener('pointermove', onPointerMove, true)
    document.removeEventListener('pointerup', onPointerEnd, true)
    document.removeEventListener('pointercancel', onPointerEnd, true)
    secondaryTouch = null
  }
}
