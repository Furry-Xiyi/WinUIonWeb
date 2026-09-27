import { computed, defineComponent, getCurrentInstance, h, ref, watch, type VNode } from 'vue'
import { resolveXamlValue, updateXamlBinding } from './xamlRuntime'

export type ControlExamplePropertyName = 'example' | 'output' | 'options' | 'substitutions'

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
export const ControlExampleSubstitutions = property('substitutions')
export const ControlExampleSubstitution = defineComponent({
  name: 'ControlExampleSubstitution',
  props: {
    Key: String,
    Value: { type: null, default: undefined },
    IsEnabled: { type: [Boolean, String], default: true }
  },
  emits: ['update:Value', 'update:IsEnabled'],
  setup(props, { emit, expose }) {
    const instance = getCurrentInstance()
    const sourceValue = computed(() => resolveXamlValue(props.Value, instance, undefined, true))
    const sourceEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false)
    const localValue = ref(sourceValue.value)
    const localEnabled = ref(sourceEnabled.value)
    watch(sourceValue, value => { localValue.value = value }, { flush: 'sync' })
    watch(sourceEnabled, value => { localEnabled.value = value }, { flush: 'sync' })
    const Value = computed({
      get: () => localValue.value,
      set: value => {
        localValue.value = value
        updateXamlBinding(props.Value, value, instance)
        emit('update:Value', value)
      }
    })
    const IsEnabled = computed({
      get: () => localEnabled.value,
      set: value => {
        localEnabled.value = resolveXamlValue(value, instance) !== false
        updateXamlBinding(props.IsEnabled, localEnabled.value, instance)
        emit('update:IsEnabled', localEnabled.value)
      }
    })
    const ValueAsString = () => {
      if (!IsEnabled.value) return ''
      const value = Value.value
      if (value && typeof value === 'object' && 'Color' in value) return String(value.Color)
      return typeof value === 'boolean' ? value ? 'True' : 'False' : String(value ?? '')
    }
    expose({ Value, IsEnabled, ValueAsString })
    return () => null
  }
})

export const getControlExampleProperty = (node: VNode): ControlExamplePropertyName | undefined => {
  const type = node.type as { __controlExampleProperty?: ControlExamplePropertyName } | undefined
  return type?.__controlExampleProperty
}
