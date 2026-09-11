import { defineComponent, h, type VNode } from 'vue'

export const DropDownButtonFlyout = defineComponent({
  name: 'DropDownButton.Flyout',
  __dropDownButtonProperty: 'flyout',
  setup(_, { slots }) {
    return () => h('span', { class: 'dropdown-button-property' }, slots.default?.())
  }
})

export const DropDownButtonContent = defineComponent({
  name: 'DropDownButton.Content',
  __dropDownButtonProperty: 'content',
  setup(_, { slots }) {
    return () => h('span', { class: 'dropdown-button-property' }, slots.default?.())
  }
})

export const MenuFlyout = defineComponent({
  name: 'MenuFlyout',
  __menuFlyoutDefinition: true,
  props: {
    Placement: { type: String, default: 'Bottom' },
    Theme: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () => h('span', { class: 'menu-flyout-definition', 'data-placement': props.Placement }, slots.default?.())
  }
})

export const MenuFlyoutItem = defineComponent({
  name: 'MenuFlyoutItem',
  __menuFlyoutItem: true,
  props: {
    Text: { type: String, default: '' },
    Icon: { type: [String, Object], default: '' },
    Value: { type: [String, Number, Boolean], default: undefined },
    IsEnabled: { type: Boolean, default: true }
  },
  setup() {
    return () => null
  }
})

export const MenuFlyoutItemIcon = defineComponent({
  name: 'MenuFlyoutItem.Icon',
  __menuFlyoutItemProperty: 'icon',
  setup(_, { slots }) {
    return () => h('span', { class: 'menu-flyout-item-property' }, slots.default?.())
  }
})

export const getDropDownButtonProperty = (node: VNode): 'flyout' | 'content' | undefined => {
  const type = node.type as { __dropDownButtonProperty?: 'flyout' | 'content' } | undefined
  return type?.__dropDownButtonProperty
}
