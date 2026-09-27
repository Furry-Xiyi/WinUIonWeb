<template>
  <div class="page-header-actions">
    <Button
      Visibility="{x:Bind ThemeButtonVisibility, Mode=OneWay}"
      class="header-action"
      ToolTipService.ToolTip="{x:Bind themeTooltip, Mode=OneWay}"
      AutomationProperties.Name="{x:Bind themeTooltip, Mode=OneWay}"
      Click="OnThemeButtonClick">
      <FontIcon class="icon" Glyph="&#xe793;" />
    </Button>

    <ToggleButton
      Visibility="{x:Bind FavoriteButtonVisibility, Mode=OneWay}"
      class="header-action"
      IsChecked="{x:Bind isFavorite, Mode=OneWay}"
      ToolTipService.ToolTip="{x:Bind favoriteTooltip, Mode=OneWay}"
      AutomationProperties.Name="{x:Bind favoriteTooltip, Mode=OneWay}"
      Click="OnFavoriteButtonClick">
      <FontIcon class="icon" Glyph="{x:Bind ButtonContent1, Mode=OneWay}" />
    </ToggleButton>
  </div>
</template>

<script setup lang="ts">
import FontIcon from './FontIcon.vue';
import { computed as ButtonContentComputed, unref as ButtonContentUnref } from 'vue';
import { computed } from 'vue';
import Button from './Button.vue';
import ToggleButton from './ToggleButton.vue';
import { useI18n } from './i18n/index';

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

const { t } = useI18n();
const themeTooltip = computed(() => t('gallery.page-header.toggle-theme'));
const favoriteTooltip = computed(() => t(props.isFavorite ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const ThemeButtonVisibility = computed(() => props.showThemeButton ? 'Visible' : 'Collapsed');
const FavoriteButtonVisibility = computed(() => props.showFavoriteButton ? 'Visible' : 'Collapsed');
const OnThemeButtonClick = () => emit('theme-toggle');
const OnFavoriteButtonClick = () => emit('favorite-toggle');
const ButtonContent1 = ButtonContentComputed(() => props.isFavorite ? '' : '');
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
