import type { ComponentInternalInstance } from 'vue'
import { resolveXamlValue } from './xamlRuntime'

// Control templates bind the ScrollViewer attached dependency properties to
// their shared ScrollViewer. Geometry, indicators and theme resources remain
// owned by ScrollViewer instead of being restyled by each consuming control.
export const scrollViewerTemplateBindings = (
  readProperty: (name: string) => unknown,
  instance: ComponentInternalInstance | null,
  defaults: Record<string, unknown> = {}
) => {
  const values = {
    HorizontalScrollMode: 'Disabled', HorizontalScrollBarVisibility: 'Disabled',
    VerticalScrollMode: 'Enabled', VerticalScrollBarVisibility: 'Auto',
    IsHorizontalRailEnabled: true, IsVerticalRailEnabled: true,
    IsHorizontalScrollChainingEnabled: true, IsVerticalScrollChainingEnabled: true,
    ZoomMode: 'Disabled', ...defaults
  }
  const settings: Record<string, unknown> = {}
  for (const [name, fallback] of Object.entries(values)) Object.defineProperty(settings, name, {
    enumerable: true,
    get: () => {
      const declared = readProperty(`ScrollViewer.${name}`)
      return declared === undefined ? fallback : resolveXamlValue(declared, instance)
    }
  })
  return settings
}
