import { defineComponent, type VNode } from 'vue'
export type InfoBarPropertyName = 'ActionButton' | 'Content' | 'ContentTemplate' | 'IconSource'
const property = (name: InfoBarPropertyName) => defineComponent({ name: `InfoBar.${name}`, __infoBarProperty: name, setup() { return () => null } })
export const InfoBarActionButton = property('ActionButton')
export const InfoBarContent = property('Content')
export const InfoBarContentTemplate = property('ContentTemplate')
export const InfoBarIconSource = property('IconSource')
export const getInfoBarProperty = (node: VNode) => (node.type as { __infoBarProperty?: InfoBarPropertyName })?.__infoBarProperty
