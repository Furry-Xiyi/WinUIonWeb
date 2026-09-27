import { computed, onScopeDispose, ref, watch } from 'vue'
import type { CommandIconSource, KeyboardAccelerator, UICommand } from './XamlUICommand'

export interface UICommandMetadata extends UICommand {
  Label?: string
  Description?: string
  AccessKey?: string
  IconSource?: string | CommandIconSource
  KeyboardAccelerators?: KeyboardAccelerator[]
  addEventListener?: (name: 'CanExecuteChanged' | 'PropertyChanged', handler: (...args: any[]) => void) => void
  removeEventListener?: (name: 'CanExecuteChanged' | 'PropertyChanged', handler: (...args: any[]) => void) => void
}

/** Command notifications invalidate hosts even when the command is not a Vue proxy. */
export const useUICommand = (read: () => unknown) => {
  const revision = ref(0)
  let detach = () => {}
  watch(read, source => {
    detach()
    const command = source as UICommandMetadata | undefined
    const invalidate = () => { revision.value += 1 }
    command?.addEventListener?.('CanExecuteChanged', invalidate)
    command?.addEventListener?.('PropertyChanged', invalidate)
    detach = () => {
      command?.removeEventListener?.('CanExecuteChanged', invalidate)
      command?.removeEventListener?.('PropertyChanged', invalidate)
    }
    invalidate()
  }, { immediate: true, flush: 'sync' })
  onScopeDispose(() => detach())
  return computed(() => {
    void revision.value
    const command = read() as UICommandMetadata | undefined
    return command && new Proxy(command, {
      get: (target, property) => {
        const value = Reflect.get(target, property, target)
        return typeof value === 'function' ? value.bind(target) : value
      }
    })
  })
}
