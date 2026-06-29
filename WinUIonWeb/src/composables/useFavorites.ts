import { ref, computed } from 'vue';

// 持久化收藏列表
const FAVORITES_STORAGE_KEY = 'winui-favorites';

// 全局收藏状态
const favoritesSet = ref<Set<string>>(new Set());

// 从localStorage加载收藏
function loadFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      const arr = JSON.parse(stored) as string[];
      favoritesSet.value = new Set(arr);
    }
  } catch (e) {
    console.error('Failed to load favorites:', e);
  }
}

// 保存收藏到localStorage
function saveFavorites() {
  try {
    const arr = Array.from(favoritesSet.value);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
}

// 初始化时加载
loadFavorites();

export function useFavorites() {
  // 获取所有收藏的页面键
  const favorites = computed(() => Array.from(favoritesSet.value));

  // 检查某个页面是否被收藏
  function isFavorite(pageKey: string): boolean {
    return favoritesSet.value.has(pageKey);
  }

  // 切换收藏状态
  function toggleFavorite(pageKey: string): boolean {
    if (favoritesSet.value.has(pageKey)) {
      favoritesSet.value.delete(pageKey);
    } else {
      favoritesSet.value.add(pageKey);
    }
    saveFavorites();
    return favoritesSet.value.has(pageKey);
  }

  // 添加收藏
  function addFavorite(pageKey: string) {
    if (!favoritesSet.value.has(pageKey)) {
      favoritesSet.value.add(pageKey);
      saveFavorites();
    }
  }

  // 移除收藏
  function removeFavorite(pageKey: string) {
    if (favoritesSet.value.has(pageKey)) {
      favoritesSet.value.delete(pageKey);
      saveFavorites();
    }
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite
  };
}
