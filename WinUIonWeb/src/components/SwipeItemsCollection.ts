import { markRaw, reactive } from 'vue'
import type { SwipeItem, SwipeItems, SwipeMode } from './SwipeControl.types'

type ChangingHandler = (size: number, mode: SwipeMode) => void
const owners = new WeakMap<SwipeItemsCollection, Map<object, ChangingHandler>>()

/** Internal ownership checks run before a vector mutation commits. */
export const observeSwipeItemsChanging = (
  collection: SwipeItemsCollection, owner: object, handler: ChangingHandler
) => {
  let handlers = owners.get(collection)
  if (!handlers) {
    handlers = new Map()
    owners.set(collection, handlers)
  }
  handlers.set(owner, handler)
  return () => handlers.delete(owner)
}

export class SwipeItemsCollection implements SwipeItems {
  #state = reactive<{ mode: SwipeMode; entries: SwipeItem[] }>({ mode: 'Reveal', entries: [] })

  constructor() {
    markRaw(this)
  }

  get Mode(): SwipeMode {
    return this.#state.mode
  }

  set Mode(value: SwipeMode) {
    if (value !== 'Reveal' && value !== 'Execute') throw new TypeError('Invalid SwipeMode.')
    this.#validate(this.Size, value)
    this.#state.mode = value
  }

  get Size() {
    return this.#state.entries.length
  }

  get Count() {
    return this.Size
  }

  GetAt(index: number): SwipeItem {
    this.#checkIndex(index)
    return this.#state.entries[index]
  }

  SetAt(index: number, value: SwipeItem) {
    this.#checkIndex(index)
    const entries = [...this.#state.entries]
    entries[index] = value
    this.ReplaceAll(entries)
  }

  InsertAt(index: number, value: SwipeItem) {
    this.#checkIndex(index, true)
    const entries = [...this.#state.entries]
    entries.splice(index, 0, value)
    this.ReplaceAll(entries)
  }

  RemoveAt(index: number) {
    this.#checkIndex(index)
    const entries = [...this.#state.entries]
    entries.splice(index, 1)
    this.ReplaceAll(entries)
  }

  Append(value: SwipeItem) {
    this.InsertAt(this.Size, value)
  }

  RemoveAtEnd() {
    this.RemoveAt(this.Size - 1)
  }

  Clear() {
    this.ReplaceAll([])
  }

  ReplaceAll(values: Iterable<SwipeItem>) {
    const entries = Array.from(values)
    this.#validate(entries.length, this.Mode)
    if (entries.some(value => !value || typeof value !== 'object')) {
      throw new TypeError('SwipeItems can only contain SwipeItem values.')
    }
    this.#state.entries = entries
  }

  IndexOf(value: SwipeItem) {
    const index = this.#state.entries.indexOf(value)
    return { found: index >= 0, index: Math.max(0, index) }
  }

  GetView(): ReadonlyArray<SwipeItem> {
    return Object.freeze([...this.#state.entries])
  }

  [Symbol.iterator](): Iterator<SwipeItem> {
    return this.#state.entries[Symbol.iterator]()
  }

  #validate(size: number, mode: SwipeMode) {
    if (mode === 'Execute' && size > 1) {
      throw new RangeError('SwipeItems in Execute mode cannot contain more than one SwipeItem.')
    }
    for (const validate of owners.get(this)?.values() ?? []) validate(size, mode)
  }

  #checkIndex(index: number, allowEnd = false) {
    if (!Number.isInteger(index) || index < 0 || index >= this.Size + Number(allowEnd)) {
      throw new RangeError('SwipeItems index is out of bounds.')
    }
  }
}

export { SwipeItemsCollection as SwipeItems }
