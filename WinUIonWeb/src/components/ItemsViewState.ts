/**
 * ItemContainer is the element an ItemsView realizes for each item; WinUI drives
 * it through dependency properties (IsSelected, MultiSelectMode, CanUserInvoke,
 * CanUserSelect) rather than through markup. The browser renderer therefore
 * shares the owning ItemsView's live state with every realized container through
 * these injection keys, and the container calls back for ItemInvoked, matching
 * ItemsView::OnItemsViewItemContainerItemInvoked.
 *
 * `itemContainerControllerKey` exposes the ItemsView itself.
 * `itemsViewItemContextKey` exposes the per-realized-element geometry the active
 * layout computed for one item (LinedFlowLayout assigns each element an explicit
 * width and height).
 */
export const itemContainerControllerKey = Symbol('WinUIonWeb.itemContainerController')
export const itemsViewItemContextKey = Symbol('WinUIonWeb.itemsViewItemContext')

// The default ItemsView factory reuses UIElement items directly. This hook
// keeps ItemsSource/SelectedItem values as the actual control objects.
export const itemsViewElementKey = Symbol('WinUIonWeb.itemsViewElement')
