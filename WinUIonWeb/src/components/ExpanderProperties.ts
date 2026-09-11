import { defineComponent, h, type VNode } from 'vue'

export type ExpanderPropertyName = 'header' | 'content' | 'description' | 'headerIcon' | 'headerControls'

const property = (name: ExpanderPropertyName) => defineComponent({
  name: `Expander.${name[0].toUpperCase()}${name.slice(1)}`,
  __expanderProperty: name,
  setup(_, { slots }) {
    return () => h('span', { class: 'expander-property' }, slots.default?.())
  }
})

export const ExpanderHeader = property('header')
export const ExpanderContent = property('content')
export const ExpanderDescription = property('description')
export const ExpanderHeaderIcon = property('headerIcon')
export const ExpanderHeaderControls = property('headerControls')

export const getExpanderProperty = (node: VNode): ExpanderPropertyName | undefined => {
  const type = node.type as { __expanderProperty?: ExpanderPropertyName } | undefined
  return type?.__expanderProperty
}
