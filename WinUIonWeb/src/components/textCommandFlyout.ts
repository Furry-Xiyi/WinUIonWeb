import { defineComponent, h, provide, type Ref, type VNode } from 'vue'
import AppBarButton from './AppBarButton.vue'
import CommandBarFlyout from './CommandBarFlyout.vue'

export type TextFlyoutCommand = {
  Text?: string
  Icon?: string
  Value?: string
  IsEnabled?: boolean
}

const symbols: Record<string, string> = {
  cut: 'Cut', copy: 'Copy', paste: 'Paste', undo: 'Undo', redo: 'Redo', selectAll: 'SelectAll'
}

// TextCommandBarFlyout uses AppBarButton commands, including its expanded
// secondary-command presenter for mouse context menus.
export const textCommandFlyout = <T extends TextFlyoutCommand>(
  control: Ref<any>, commands: () => readonly T[], invoke: (command: T) => void,
  closed?: () => void, properties: () => Record<string, unknown> = () => ({})
) => defineComponent({
  name: 'TextCommandBarFlyout',
  setup() {
    provide('buttonFlyoutAnchor', null)
    provide('buttonFlyoutController', null)
    return () => {
      const settings = properties()
      const transient = settings.ShowMode === 'Transient'
      const nodes = (primary: boolean): VNode[] => commands()
        .filter(command => (transient && ['cut', 'copy', 'paste'].includes(command.Value ?? '')) === primary)
        .map(command => h(AppBarButton, {
          key: command.Value, Label: command.Text, Icon: symbols[command.Value ?? ''] ?? command.Icon,
          LabelPosition: 'Collapsed',
          IsEnabled: command.IsEnabled ?? true, Click: () => invoke(command)
        }))
      return h(CommandBarFlyout, { Placement: 'BottomEdgeAlignedLeft', ...settings, ref: control, onClosed: closed }, {
        default: () => [
          h(CommandBarFlyout.PrimaryCommands, null, { default: () => nodes(true) }),
          h(CommandBarFlyout.SecondaryCommands, null, { default: () => nodes(false) })
        ]
      })
    }
  }
})
