import { defineComponent, h, type VNode } from 'vue'

export type TeachingTipPropertyName = 'heroContent' | 'content' | 'iconSource'

const property = (name: TeachingTipPropertyName) => defineComponent({
  name: `TeachingTip.${name[0].toUpperCase()}${name.slice(1)}`,
  __teachingTipProperty: name,
  setup(_, { slots }) {
    return () => h('span', { class: 'teaching-tip-property' }, slots.default?.())
  }
})

export const TeachingTipHeroContent = property('heroContent')
export const TeachingTipContent = property('content')
export const TeachingTipIconSource = property('iconSource')

export const getTeachingTipProperty = (node: VNode): TeachingTipPropertyName | undefined => {
  const type = node.type as { __teachingTipProperty?: TeachingTipPropertyName } | undefined
  return type?.__teachingTipProperty
}
