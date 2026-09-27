import { computed, defineComponent } from 'vue'

export interface CollectionViewGroup { Group: unknown; GroupItems: unknown[] }
export type GroupedCollectionView = unknown[] & { CollectionGroups: CollectionViewGroup[]; Groups: unknown[] }

// An object resource, rather than a visual element. Page.Resources creates
// this once and publishes x:Name in the page namescope.
export default defineComponent({
  name: 'CollectionViewSource',
  __createXamlResource(read: (name: string) => unknown) {
    const view = computed<GroupedCollectionView>(() => {
      const source = read('Source')
      const groups = Array.isArray(source) ? source : []
      const grouped = read('IsSourceGrouped') === true
      const path = String(read('ItemsPath') ?? 'Items')
      const itemsOf = (group: unknown): unknown[] => {
        let value = group
        for (const part of path.split('.')) value = (value as Record<string, unknown> | undefined)?.[part]
        return Array.isArray(value) ? value : []
      }
      const collectionGroups = grouped ? groups.map(Group => ({ Group, GroupItems: itemsOf(Group) })) : []
      return Object.assign(grouped ? collectionGroups.flatMap(group => group.GroupItems) : [...groups], {
        CollectionGroups: collectionGroups, Groups: grouped ? groups : []
      })
    })
    return {
      get View() { return view.value },
      get Source() { return read('Source') },
      get IsSourceGrouped() { return read('IsSourceGrouped') === true },
      get ItemsPath() { return read('ItemsPath') }
    }
  },
  setup() { return () => null }
})
