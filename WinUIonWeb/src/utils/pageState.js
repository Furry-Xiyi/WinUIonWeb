import { computed, onUnmounted, ref, watch } from 'vue';

const FAVORITES_KEY = 'winui-favorites';

const readFavorites = () => {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const writeFavorites = (favorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent('winui-favorites-changed', { detail: favorites }));
};

export const createPageState = (pageKey) => {
  const favorites = ref(readFavorites());
  const isFavoriteState = ref(favorites.value.includes(pageKey));
  const appThemeSetting = localStorage.getItem('winui-theme-setting');
  const resolvedAppTheme = appThemeSetting === 'dark' || appThemeSetting === 'light'
    ? appThemeSetting
    : window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const pageTheme = ref(resolvedAppTheme);

  const toggleTheme = () => {
    pageTheme.value = pageTheme.value === 'dark' ? 'light' : 'dark';
  };

  const toggleFavorite = () => {
    const current = readFavorites();
    const next = current.includes(pageKey)
      ? current.filter((key) => key !== pageKey)
      : [...current, pageKey];

    favorites.value = next;
    isFavoriteState.value = next.includes(pageKey);
    writeFavorites(next);
  };

  const syncFavorites = () => {
    favorites.value = readFavorites();
    isFavoriteState.value = favorites.value.includes(pageKey);
  };

  window.addEventListener('storage', syncFavorites);
  window.addEventListener('winui-favorites-changed', syncFavorites);

  onUnmounted(() => {
    window.removeEventListener('storage', syncFavorites);
    window.removeEventListener('winui-favorites-changed', syncFavorites);
  });

  watch(favorites, () => {
    isFavoriteState.value = favorites.value.includes(pageKey);
  });

  return {
    favorites,
    isFavoriteState,
    pageTheme,
    toggleTheme,
    toggleFavorite
  };
};

export const getStoredFavorites = readFavorites;
export const favoritesStorageKey = FAVORITES_KEY;
