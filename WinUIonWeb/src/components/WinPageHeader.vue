<template>
  <div class="page-header-actions">
    <WinButton
      v-if="showThemeButton"
      class="header-action"
      v-bind="{ 'tooltipservice.tooltip': themeTooltip }"
      @Click="$emit('theme-toggle')">
      <span class="icon">&#xE793;</span>
    </WinButton>

    <WinToggleButton
      v-if="showFavoriteButton"
      class="header-action"
      :IsChecked="isFavorite"
      v-bind="{ 'tooltipservice.tooltip': isFavorite ? 'Remove from favorites' : 'Add to favorites' }"
      @update:IsChecked="$emit('favorite-toggle')">
      <span class="icon">{{ isFavorite ? '&#xE735;' : '&#xE734;' }}</span>
    </WinToggleButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import WinButton from './WinButton.vue';
import WinToggleButton from './WinToggleButton.vue';

const props = withDefaults(defineProps<{
  isFavorite?: boolean;
  currentTheme?: 'light' | 'dark' | 'system';
  showFavoriteButton?: boolean;
  showThemeButton?: boolean;
}>(), {
  isFavorite: false,
  currentTheme: 'system',
  showFavoriteButton: true,
  showThemeButton: true
});

const emit = defineEmits<{
  'theme-toggle': [];
  'favorite-toggle': [];
}>();

const themeTooltip = computed(() => {
  const theme = props.currentTheme;
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
}
</style>
