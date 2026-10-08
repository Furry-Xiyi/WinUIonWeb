import { Comment, defineComponent, Fragment, getCurrentInstance, h, onBeforeUnmount, ref, type ComponentInternalInstance, type ComponentObjectPropsOptions, type CSSProperties, type VNode } from 'vue'
import { cssLength, xamlThickness } from './layout'
import { cssColor, isSolidColorBrush } from './brushCore'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue } from './xamlRuntime'

export const textProperty = (owner: string, property: string) => defineComponent({
  name: `${owner}.${property}`,
  __textProperty: property,
  setup: () => () => null
})
export const TextBlockInlines = textProperty('TextBlock', 'Inlines')
export const TextBlockTextHighlighters = textProperty('TextBlock', 'TextHighlighters')
export const RichTextBlockBlocks = textProperty('RichTextBlock', 'Blocks')
export const RichTextBlockTextHighlighters = textProperty('RichTextBlock', 'TextHighlighters')
export const SpanInlines = textProperty('Span', 'Inlines')
export const ParagraphInlines = textProperty('Paragraph', 'Inlines')
export const InlineUIContainerChild = textProperty('InlineUIContainer', 'Child')
export const TextHighlighterRanges = textProperty('TextHighlighter', 'Ranges')
export const TextHighlighter = defineComponent({ name: 'TextHighlighter', Ranges:TextHighlighterRanges, __textHighlighter: true, setup: () => () => null })
export const TextRange = defineComponent({ name: 'TextRange', __textRange: true, setup: () => () => null })

export const textNodeChildren = (node: VNode): VNode[] => {
  if (Array.isArray(node.children)) return node.children as VNode[]
  const slot = (node.children as { default?: () => VNode[] } | null)?.default
  return typeof slot === 'function' ? slot() : []
}
export const textPropertyName = (node: VNode): string | undefined =>
  (node.type as { __textProperty?: string })?.__textProperty
  ?? (typeof node.type === 'string' ? node.type.match(/^(?:TextBlock|RichTextBlock|Span|Bold|Italic|Underline|Hyperlink|Paragraph|InlineUIContainer|TextHighlighter)\.(\w+)$/)?.[1] : undefined)

export const textContentNodes = (nodes: VNode[], property: 'Inlines' | 'Blocks' | 'Child'): VNode[] => nodes.flatMap(node => {
  if (node.type === Comment) return []
  if (node.type === Fragment) return textContentNodes(textNodeChildren(node), property)
  const name = textPropertyName(node)
  if (name) return name === property ? textNodeChildren(node) : []
  return [node]
})

export const textBrush = (value: unknown): string => {
  if (isSolidColorBrush(value)) {
    const color = cssColor(value.Color)
    return value.Opacity === 1 ? color : `color-mix(in srgb, ${color} ${value.Opacity * 100}%, transparent)`
  }
  return value === undefined || value === null || value === '' ? '' : cssColor(value)
}
export const textFontWeight = (value: unknown): string | number => ({
  Thin: 100, ExtraLight: 200, Light: 300, SemiLight: 350, Normal: 400, Regular: 400,
  Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800, Black: 900, ExtraBlack: 950
} as Record<string, number>)[String(value)] ?? String(value ?? '')

const formattingProps = {
  CharacterSpacing: [String, Number], FontFamily: String, FontSize: [String, Number], FontStretch: String,
  FontStyle: String, FontWeight: [String, Number], Foreground: [String, Object], TextDecorations: String,
  FlowDirection: String, Language: String, IsTextScaleFactorEnabled: [String, Boolean]
}
const inlineStyle = (props: Record<string, unknown>, instance: ComponentInternalInstance | null): CSSProperties => {
  const value = (name: string) => resolveXamlValue(props[name], instance)
  const family = value('FontFamily')
  return {
    fontFamily: family === 'XamlAutoFontFamily' ? 'var(--ContentControlThemeFontFamily)' : family as string,
    fontSize: cssLength(value('FontSize')), fontStretch: String(value('FontStretch') ?? '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    fontStyle: String(value('FontStyle') ?? '').toLowerCase(), fontWeight: textFontWeight(value('FontWeight')),
    color: textBrush(value('Foreground')),
    letterSpacing: value('CharacterSpacing') === undefined ? undefined : `${Number(value('CharacterSpacing')) / 1000}em`,
    textDecorationLine: String(value('TextDecorations') ?? '').replace('Strikethrough', 'line-through').toLowerCase(),
    direction: value('FlowDirection') === 'RightToLeft' ? 'rtl' : value('FlowDirection') === 'LeftToRight' ? 'ltr' : undefined,
    ...(value('IsTextScaleFactorEnabled') === false ? { textSizeAdjust: 'none', WebkitTextSizeAdjust: 'none' } : {})
  }
}
const inline = (name: string, tag: string, extra: ComponentObjectPropsOptions = {}) => defineComponent({
  name, inheritAttrs: false,
  Inlines:name === 'Paragraph' ? ParagraphInlines : SpanInlines,
  props: { ...formattingProps, ...extra },
  setup(props, { slots, attrs }) {
    const instance = getCurrentInstance()
    const properties: Record<string, unknown> = props
    return () => h(tag, {
      lang: resolveXamlValue(properties.Language, instance) as string,
      style: [inlineStyle(props, instance), name === 'Paragraph' ? {
        margin: xamlThickness(resolveXamlValue(properties.Margin, instance) ?? 0),
        textIndent: cssLength(resolveXamlValue(properties.TextIndent, instance)),
        textAlign: String(resolveXamlValue(properties.TextAlignment, instance) ?? '').toLowerCase(),
        lineHeight: Number(resolveXamlValue(properties.LineHeight, instance)) > 0 ? cssLength(resolveXamlValue(properties.LineHeight, instance)) : undefined
      } : undefined, attrs.style]
    }, normalizeXamlNodes(textContentNodes(slots.default?.() ?? [], 'Inlines'), instance))
  }
})
export const Run = defineComponent({
  name: 'Run', inheritAttrs: false,
  props: { ...formattingProps, Text: { type: [String, Number], default: '' } },
  setup(props, { slots, attrs }) {
    const instance = getCurrentInstance()
    return () => h('span', { lang: resolveXamlValue(props.Language, instance), style: [inlineStyle(props, instance), attrs.style] },
      props.Text !== '' ? String(resolveXamlValue(props.Text, instance, undefined, true) ?? '') : normalizeXamlNodes(slots.default?.() ?? [], instance))
  }
})
export const Span = inline('Span', 'span')
export const Bold = inline('Bold', 'b')
export const Italic = inline('Italic', 'i')
export const Underline = inline('Underline', 'u')
export const Paragraph = inline('Paragraph', 'p', { Margin: [String, Number], TextIndent: [String, Number], TextAlignment: String, LineHeight: [String, Number], LineStackingStrategy: String })
export const LineBreak = defineComponent({ name: 'LineBreak', setup: () => () => h('br') })
export const InlineUIContainer = defineComponent({
  name: 'InlineUIContainer', inheritAttrs: false,
  Child:InlineUIContainerChild,
  setup(_, { slots }) {
    const instance = getCurrentInstance()
    return () => h('span', { class: 'win-inline-ui-container', style: { display: 'inline-block', maxWidth: '100%', verticalAlign: 'baseline', overflow: 'hidden' } },
      normalizeXamlNodes(textContentNodes(slots.default?.() ?? [], 'Child'), instance))
  }
})

// Linked containers clone only the measured document fragment. Reattach the
// inline event callbacks so a Hyperlink keeps its original XAML sender.
const inlineRegistry = globalThis as typeof globalThis & { [key: symbol]: Map<string, (event: MouseEvent) => void> }
const hyperlinkCallbacks = inlineRegistry[Symbol.for('WinUIonWeb.TextInlineInteractions')] ??= new Map<string, (event: MouseEvent) => void>()
export const restoreInlineInteractions = (root: ParentNode) => {
  root.querySelectorAll<HTMLElement>('[data-text-inline-id]').forEach(element => {
    const callback = hyperlinkCallbacks.get(element.dataset.textInlineId ?? '')
    if (callback) element.addEventListener('click', callback)
  })
}
export const Hyperlink = defineComponent({
  name: 'Hyperlink', inheritAttrs: false,
  Inlines:SpanInlines,
  props: { ...formattingProps, NavigateUri: { type: String, default: '' }, Click: { type: [String, Function], default: undefined }, UnderlineStyle: { type: String, default: 'Single' } },
  emits: ['Click'],
  setup(props, { slots, expose }) {
    const instance = getCurrentInstance()
    const element = ref<HTMLElement | null>(null)
    const key = `hyperlink-${instance?.uid}`
    const sender = { Element: element, get NavigateUri() { return resolveXamlValue(props.NavigateUri, instance) } }
    expose(sender)
    const click = (event: MouseEvent) => {
      if (!sender.NavigateUri) event.preventDefault()
      const args = { OriginalSource: event.target, Handled: false }
      resolveXamlHandler(props.Click, instance)?.(sender, args)
      const listeners = instance?.vnode.props?.onClick
      for (const listener of Array.isArray(listeners) ? listeners : [listeners]) if(typeof listener === 'function') listener(sender,args)
      if (args.Handled) event.preventDefault()
    }
    hyperlinkCallbacks.set(key, click)
    onBeforeUnmount(() => hyperlinkCallbacks.delete(key))
    return () => h('a', {
      ref: element, href: String(sender.NavigateUri || '#'), class: 'win-text-hyperlink', 'data-text-inline-id': key,
      onClick: click, style: [inlineStyle(props, instance), { textDecorationLine: resolveXamlValue(props.UnderlineStyle, instance) === 'None' ? 'none' : 'underline' }]
    }, normalizeXamlNodes(textContentNodes(slots.default?.() ?? [], 'Inlines'), instance))
  }
})

export type TextHighlighterValue = { Background?: unknown; Foreground?: unknown; Ranges: { StartIndex: number; Length: number }[] }
export const textPosition = (root: Node, index: number): [Node, number] => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  index = Math.max(0, index)
  while (node) {
    const length = node.textContent?.length ?? 0
    if (index <= length) return [node, index]
    index -= length
    const next = walker.nextNode()
    if (!next) return [node, length]
    node = next
  }
  return [root, 0]
}
export const readTextHighlighters = (nodes: VNode[], instance: ComponentInternalInstance | null): TextHighlighterValue[] =>
  nodes.filter(node => textPropertyName(node) === 'TextHighlighters').flatMap(node => textNodeChildren(node)).map(node => ({
    Background: resolveXamlValue(node.props?.Background, instance), Foreground: resolveXamlValue(node.props?.Foreground, instance),
    Ranges: textNodeChildren(node).flatMap(child => textPropertyName(child) === 'Ranges' ? textNodeChildren(child) : [child])
      .filter(child => (child.type as { __textRange?: boolean })?.__textRange || child.type === 'TextRange')
      .map(child => ({ StartIndex: Number(resolveXamlValue(child.props?.StartIndex, instance)), Length: Number(resolveXamlValue(child.props?.Length, instance)) }))
  }))

export const createTextHighlights = (key: string) => {
  let stylesheet: HTMLStyleElement | undefined
  const keys = new Set<string>()
  const clear = () => {
    const registry = typeof CSS === 'undefined' ? undefined : (CSS as any).highlights
    keys.forEach(name => registry?.delete(name))
    keys.clear()
    stylesheet?.remove()
    stylesheet = undefined
  }
  return {
    Clear: clear,
    Update: (roots: { Element: HTMLElement; Start: number }[], highlighters: TextHighlighterValue[]) => {
      clear()
      if (typeof CSS === 'undefined' || !('highlights' in CSS) || !('Highlight' in window)) return
      const rules: string[] = []
      highlighters.forEach((highlighter, index) => {
        const ranges: Range[] = []
        roots.forEach(({ Element, Start }) => {
          const length = Element.textContent?.length ?? 0
          highlighter.Ranges.forEach(item => {
            if (!Number.isFinite(item.StartIndex) || !Number.isFinite(item.Length) || item.Length <= 0) return
            const start = Math.max(0, item.StartIndex - Start), end = Math.min(length, item.StartIndex + item.Length - Start)
            if (start >= end || start >= length) return
            const range = document.createRange()
            range.setStart(...textPosition(Element, start)); range.setEnd(...textPosition(Element, end)); ranges.push(range)
          })
        })
        if (!ranges.length) return
        const name = `${key}-${index}`
        ;(CSS as any).highlights.set(name, new (window as any).Highlight(...ranges)); keys.add(name)
        const declarations = document.createElement('span').style
        declarations.backgroundColor = textBrush(highlighter.Background) || 'var(--TextControlHighlighterBackground, Yellow)'
        declarations.color = textBrush(highlighter.Foreground) || 'var(--TextControlHighlighterForeground, #000000)'
        rules.push(`::highlight(${name}) { ${declarations.cssText} }`)
      })
      if (rules.length) { stylesheet = document.createElement('style'); stylesheet.textContent = rules.join('\n'); document.head.append(stylesheet) }
    }
  }
}
