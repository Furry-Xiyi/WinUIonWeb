const clickedItems = new Map<string, string>();

export const rememberGalleryItem = (page: string, id: string) => clickedItems.set(page, id);
export const getLastGalleryItem = (page: string) => clickedItems.get(page);
