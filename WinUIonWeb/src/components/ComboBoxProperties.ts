import { defineComponent, type VNode } from 'vue'
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties'

export type ComboBoxPropertyName = 'Header' | 'HeaderTemplate' | 'Description'
const property = (name: ComboBoxPropertyName) => defineComponent({
  name: `ComboBox.${name}`,
  __comboBoxProperty: name,
  setup() { return () => null }
})

export const ComboBoxHeader = property('Header')
export const ComboBoxHeaderTemplate = property('HeaderTemplate')
export const ComboBoxDescription = property('Description')
export const getComboBoxProperty = (node: VNode): ComboBoxPropertyName | undefined => {
  const type = node.type as { __comboBoxProperty?: ComboBoxPropertyName; name?: string } | string
  if (typeof type !== 'string' && type?.__comboBoxProperty) return type.__comboBoxProperty
  return (typeof type === 'string' ? type : type?.name)?.match(/^ComboBox\.(Header|HeaderTemplate|Description)$/)?.[1] as ComboBoxPropertyName | undefined
}
export const comboBoxPropertyChildren = (node: VNode) => getVNodeChildren(node)
export const isComboBoxProperty = (node: VNode) => getComboBoxProperty(node) || getCollectionProperty(node)
