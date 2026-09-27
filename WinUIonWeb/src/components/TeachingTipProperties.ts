import { defineComponent, Fragment, h, type VNode } from 'vue'

export type TeachingTipPropertyName = 'heroContent' | 'content' | 'iconSource' | 'actionButtonContent' | 'closeButtonContent'

const property = (name: TeachingTipPropertyName) => defineComponent({
  name: `TeachingTip.${name[0].toUpperCase()}${name.slice(1)}`,
  __teachingTipProperty: name,
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

export const TeachingTipHeroContent = property('heroContent')
export const TeachingTipContent = property('content')
export const TeachingTipIconSource = property('iconSource')
export const TeachingTipActionButtonContent = property('actionButtonContent')
export const TeachingTipCloseButtonContent = property('closeButtonContent')

export const getTeachingTipProperty = (node: VNode): TeachingTipPropertyName | undefined =>
  (node.type as { __teachingTipProperty?: TeachingTipPropertyName })?.__teachingTipProperty
