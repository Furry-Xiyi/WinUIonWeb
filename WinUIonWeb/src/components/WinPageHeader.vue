<template>
  <div class="page-header-actions">
    <!-- 主题切换按钮 -->
    <WinButton
      subtle
      :title="themeTooltip"
      @click="$emit('theme-toggle')"
      style="width: 32px; height: 32px; padding: 0; min-width: 0;">
      <span class="icon">&#xE793;</span>
    </WinButton>

    <!-- 收藏按钮 -->
    <WinToggleButton
      v-model="favoriteState"
      subtle
      :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      @update:modelValue="$emit('favorite-toggle')"
      style="width: 32px; height: 32px; padding: 0; min-width: 0;">
      <span class="icon">{{ isFavorite ? '&#xE735;' : '&#xE734;' }}</span>
    </WinToggleButton>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import WinButton from './WinButton.vue';
import WinToggleButton from './WinToggleButton.vue';

const props = defineProps<{
  isFavorite?: boolean;
  currentTheme?: 'light' | 'dark' | 'system';
}>();

const emit = defineEmits<{
  'theme-toggle': [];
  'favorite-toggle': [];
}>();

const favoriteState = ref(props.isFavorite || false);

watch(() => props.isFavorite, (newVal) => {
  favoriteState.value = newVal || false;
});

const themeTooltip = computed(() => {
  const theme = props.currentTheme || 'system';
  if (theme === 'light') return 'Switch to dark theme';
  if (theme === 'dark') return 'Switch to system theme';
  return 'Switch to light theme';
});
</script>

<style scoped>
.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.icon {
  font-size: 16px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}
</style>
