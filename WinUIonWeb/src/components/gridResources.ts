import { defineComponent } from 'vue'

export const GridResources = defineComponent({
  name: 'Grid.Resources',
  __gridResourcesProperty: true,
  setup: () => () => null
})

export const Style = defineComponent({
  name: 'Style',
  __gridStyleDefinition: true,
  setup: () => () => null
})

export const Setter = defineComponent({
  name: 'Setter',
  __gridStyleSetter: true,
  setup: () => () => null
})
