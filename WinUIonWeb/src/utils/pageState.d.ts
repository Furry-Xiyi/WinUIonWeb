import type { Ref } from 'vue';

export declare const favoritesStorageKey: string;

export declare const getStoredFavorites: () => string[];

export declare const createPageState: (pageKey: string) => {
  favorites: Ref<string[]>;
  isFavoriteState: Ref<boolean>;
  pageTheme: Ref<'light' | 'dark' | string>;
  toggleTheme: () => void;
  toggleFavorite: () => void;
};
