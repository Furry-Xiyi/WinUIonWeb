import { defineComponent } from 'vue'

const property = (name: string) => defineComponent({
  name: `TitleBar.${name}`,
  __titleBarProperty: name,
  setup: () => () => null,
})

export const TitleBarIconSource = property('IconSource')
export const TitleBarLeftHeader = property('LeftHeader')
export const TitleBarContent = property('Content')
export const TitleBarRightHeader = property('RightHeader')
export const TitleBarResources = property('Resources')
