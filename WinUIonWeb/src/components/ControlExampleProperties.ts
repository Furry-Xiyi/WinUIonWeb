import { defineComponent, h, type VNode } from 'vue'

export type ControlExamplePropertyName = 'example' | 'output' | 'options'

const property = (name: ControlExamplePropertyName) => defineComponent({
  name: `ControlExample.${name[0].toUpperCase()}${name.slice(1)}`,
  __controlExampleProperty: name,
  setup(_, { slots }) {
    return () => h('span', { class: 'control-example-property' }, slots.default?.())
  }
})

export const ControlExampleExample = property('example')
export const ControlExampleOutput = property('output')
export const ControlExampleOptions = property('options')

export const getControlExampleProperty = (node: VNode): ControlExamplePropertyName | undefined => {
  const type = node.type as { __controlExampleProperty?: ControlExamplePropertyName } | undefined
  return type?.__controlExampleProperty
}
