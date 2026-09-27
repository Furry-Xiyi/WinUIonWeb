export interface SwipeTrackerBounds {
  minimum: number
  maximum: number
}

const clamp = (position: number, bounds: SwipeTrackerBounds) =>
  Math.max(bounds.minimum, Math.min(bounds.maximum, position))

// Windows supplies InteractionTracker inertia internally. These decay and
// spring parameters are a browser adapter, not constants from SwipeControl.
const browserDecay = -Math.log(0.9) / (1000 / 60)
const browserSpringFrequency = 0.024
const positionTolerance = 0.05
const velocityTolerance = 0.001

export class BrowserSwipeInteractionTracker {
  private frame = 0
  private generation = 0
  private finish: ((completed: boolean) => void) | undefined

  constructor(
    private readonly readPosition: () => number,
    private readonly writePosition: (position: number) => void
  ) {}

  get Position() {
    return this.readPosition()
  }

  NaturalRestingPosition(velocity: number) {
    return this.Position + velocity / browserDecay
  }

  TryUpdatePosition(position: number, bounds: SwipeTrackerBounds) {
    this.writePosition(clamp(position, bounds))
  }

  Cancel() {
    this.generation += 1
    cancelAnimationFrame(this.frame)
    const finish = this.finish
    this.finish = undefined
    finish?.(false)
  }

  Settle(position: number, velocity: number, bounds: SwipeTrackerBounds): Promise<boolean> {
    this.Cancel()
    const generation = this.generation
    const target = clamp(position, bounds)
    const displacement = this.Position - target
    const started = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    return new Promise(resolve => {
      this.finish = resolve
      const complete = () => {
        this.writePosition(target)
        this.finish = undefined
        resolve(true)
      }

      const tick = (time: number) => {
        if (generation !== this.generation) return
        if (reducedMotion) {
          complete()
          return
        }

        const elapsed = Math.max(0, time - started)
        const frequency = browserSpringFrequency
        const decay = Math.exp(-frequency * elapsed)
        const coefficient = velocity + frequency * displacement
        const distance = (displacement + coefficient * elapsed) * decay
        const speed = (velocity - frequency * coefficient * elapsed) * decay
        this.writePosition(clamp(target + distance, bounds))

        if (Math.abs(distance) <= positionTolerance && Math.abs(speed) <= velocityTolerance) {
          complete()
        } else {
          this.frame = requestAnimationFrame(tick)
        }
      }

      this.frame = requestAnimationFrame(tick)
    })
  }
}
