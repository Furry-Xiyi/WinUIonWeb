import { defineComponent, h, provide, type Ref, type VNode } from 'vue'
import MenuFlyout from './MenuFlyout.vue'
import { MenuFlyoutItem, MenuFlyoutSeparator, MenuFlyoutSubItem, SplitMenuFlyoutItem, ToggleMenuFlyoutItem, RadioMenuFlyoutItem } from './MenuFlyoutItems'

// Internal command owners create the same MenuFlyoutItem elements as XAML.
// MenuFlyout itself accepts its official item collection, not command records.
export const menuFlyoutCommandNodes = (commands: readonly any[], invoke?: (command: any) => void): VNode[] => commands.map((command, index) => {
  const source = typeof command === 'string' ? { Text: command } : command
  const types: Record<string, any> = { MenuFlyoutItem, MenuFlyoutSeparator, MenuFlyoutSubItem, SplitMenuFlyoutItem, ToggleMenuFlyoutItem, RadioMenuFlyoutItem }
  const kind = source.Kind || (source.Items?.length ? 'MenuFlyoutSubItem' : 'MenuFlyoutItem')
  const type = types[kind] || MenuFlyoutItem
  if (type === MenuFlyoutSeparator || source.Kind === 'Separator') return h(MenuFlyoutSeparator, { key: source.Key ?? index })
  const props = Object.fromEntries(['Text', 'Icon', 'Tag', 'Command', 'CommandParameter', 'IsEnabled', 'IsChecked', 'GroupName', 'KeyboardAccelerators', 'KeyboardAcceleratorTextOverride', 'Foreground', 'FontFamily', 'FontSize', 'FontWeight', 'Visibility'].filter(name => source[name] !== undefined).map(name => [name, source[name]]))
  props.Text ??= source.Command?.Label ?? ''
  return h(type, { ...props, key: source.Key ?? index, Click: (sender: any, args: any) => {
    if (kind === 'ToggleMenuFlyoutItem' || kind === 'RadioMenuFlyoutItem') source.IsChecked = sender.IsChecked
    source.Click?.(sender, args)
    invoke?.(command)
  } }, source.Items?.length ? { default: () => menuFlyoutCommandNodes(source.Items, invoke) } : undefined)
})

export const commandOwnerMenu = (control: Ref<any>, commands: () => readonly any[], invoke?: (command: any) => void, closed?: () => void, properties: () => Record<string, unknown> = () => ({})) => defineComponent({
  name: 'CommandOwnerMenuFlyout',
  setup() {
    // Command owners call ShowAt explicitly; an enclosing Button.Flyout must
    // keep its controller and click listener for its own attached flyout.
    provide('buttonFlyoutAnchor', null)
    provide('buttonFlyoutController', null)
    return () => h(MenuFlyout, { ...properties(), ref: control, onClosed: closed }, { default: () => menuFlyoutCommandNodes(commands(), invoke) })
  }
})
