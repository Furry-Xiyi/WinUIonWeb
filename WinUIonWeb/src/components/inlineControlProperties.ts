import { defineComponent } from 'vue'

export const ComboBoxItem = defineComponent({
  name: 'ComboBoxItem',
  __xamlComboBoxItem: true,
  setup() { return () => null }
})

export const XamlString = defineComponent({
  name: 'x:String',
  __xamlString: true,
  setup() { return () => null }
})

export const SliderHeaderProperty = defineComponent({
  name: 'Slider.Header',
  __sliderHeaderProperty: true,
  setup() { return () => null }
})
