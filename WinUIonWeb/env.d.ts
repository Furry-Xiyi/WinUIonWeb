/// <reference types="vite/client" />

declare module 'vue' {
  interface ComponentInternalInstance {
    provides: Record<string | symbol, unknown>
    setupState: Record<string, unknown>
  }

  interface ComponentCustomProperties {
    $t: (key: string, values?: Record<string, string | number | boolean | null | undefined>) => string
    Grid: typeof import('./src/components/Grid.vue').default
    TabViewItem: typeof import('./src/components/TabViewItem.vue').default
    TreeViewNode: typeof import('./src/components/TreeView.vue').XamlTreeViewNode
    SwipeItem: typeof import('./src/components/SwipeControlProperties').SwipeItem
    ResourceDictionary: typeof import('./src/components/xamlPrimitives').ResourceDictionary
  }
}

export {}
