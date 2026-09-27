import { defineComponent, type VNode } from 'vue'

const property = (name: string, key: 'flyout' | 'content' | 'keyboardAccelerators') => defineComponent({
  name: `DropDownButton.${name}`, __dropDownButtonProperty: key, setup() { return () => null }
})
export const DropDownButtonFlyout = property('Flyout', 'flyout')
export const DropDownButtonContent = property('Content', 'content')
export const DropDownButtonKeyboardAccelerators = property('KeyboardAccelerators', 'keyboardAccelerators')
export const getDropDownButtonProperty = (node: VNode): 'flyout' | 'content' | 'keyboardAccelerators' | undefined => {
  const type = node.type as { name?: string; __name?: string; __dropDownButtonProperty?: 'flyout' | 'content' | 'keyboardAccelerators' } | string
  if (typeof type !== 'string' && type?.__dropDownButtonProperty) return type.__dropDownButtonProperty
  const name = typeof type === 'string' ? type : type?.name ?? type?.__name
  return ({ 'DropDownButton.Flyout': 'flyout', 'DropDownButton.Content': 'content', 'DropDownButton.KeyboardAccelerators': 'keyboardAccelerators' } as const)[name ?? '']
}
