import { ref } from 'vue';

// 检测当前实际生效的主题
function detectCurrentTheme(): 'light' | 'dark' {
  const html = document.documentElement;

  // 检查手动设置的主题
  if (html.classList.contains('theme-light')) return 'light';
  if (html.classList.contains('theme-dark')) return 'dark';

  // 检查系统主题
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

// 每个页面实例独立的主题状态
export function usePageTheme(initialTheme: 'light' | 'dark' | 'system' = 'system') {
  const pageTheme = ref<'light' | 'dark' | 'system'>(initialTheme);

  // 切换主题 - 检查当前实际主题再切换
  function toggleTheme() {
    const currentActual = detectCurrentTheme();

    if (pageTheme.value === 'system') {
      // 从system切换：根据当前实际主题切换到相反的
      pageTheme.value = currentActual === 'light' ? 'dark' : 'light';
    } else if (pageTheme.value === 'light') {
      pageTheme.value = 'dark';
    } else {
      // dark -> system
      pageTheme.value = 'system';
    }
  }

  // 设置主题
  function setTheme(theme: 'light' | 'dark' | 'system') {
    pageTheme.value = theme;
  }

  // 获取实际应用的主题（解析system）
  function getResolvedTheme(): 'light' | 'dark' {
    if (pageTheme.value === 'system') {
      return detectCurrentTheme();
    }
    return pageTheme.value;
  }

  return {
    pageTheme,
    toggleTheme,
    setTheme,
    getResolvedTheme
  };
}
