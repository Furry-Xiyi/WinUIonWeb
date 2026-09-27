import { defineComponent, getCurrentInstance, markRaw, watch } from 'vue'
import { DesktopAcrylicBackdrop as DesktopAcrylicBackdropValue, MicaBackdrop as MicaBackdropValue } from './systemBackdrop'
import { resolveXamlValue } from './xamlRuntime'
import type { XamlResourceFactoryContext } from './UICommandProperties'

export const createMicaBackdropResource = (read: (name: string) => unknown, context?: Pick<XamlResourceFactoryContext, 'Dispose'>): MicaBackdropValue => {
  const backdrop = markRaw(new MicaBackdropValue())
  const stop = watch(() => read('Kind'), value => { backdrop.Kind = value === 'BaseAlt' ? 'BaseAlt' : 'Base' }, { immediate: true })
  context?.Dispose(stop)
  return backdrop
}

export const createDesktopAcrylicBackdropResource = (): DesktopAcrylicBackdropValue => markRaw(new DesktopAcrylicBackdropValue())

export const MicaBackdrop = defineComponent({
  name: 'MicaBackdrop', __xamlDependencyObject: true, __systemBackdropDeclaration: true,
  __createXamlResource: createMicaBackdropResource,
  inheritAttrs: false,
  props: { Kind: { type: String, default: 'Base' } },
  setup(props, { expose }) {
    const instance = getCurrentInstance()
    expose(createMicaBackdropResource(name => resolveXamlValue(props[name as keyof typeof props], instance)))
    return () => null
  },
})

export const DesktopAcrylicBackdrop = defineComponent({
  name: 'DesktopAcrylicBackdrop', __xamlDependencyObject: true, __systemBackdropDeclaration: true,
  __createXamlResource: createDesktopAcrylicBackdropResource,
  inheritAttrs: false,
  setup(_props, { expose }) { expose(createDesktopAcrylicBackdropResource()); return () => null },
})

export const SystemBackdropElementSystemBackdrop = defineComponent({
  name: 'SystemBackdropElement.SystemBackdrop', __systemBackdropProperty: true,
  setup() { return () => null },
})
