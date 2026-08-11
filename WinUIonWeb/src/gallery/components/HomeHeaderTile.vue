<template>
  <div class="win-home-header-tile">
    <WinHyperlinkButton
      class="win-home-header-tile-link"
      :NavigateUri="Link"
      TargetName="_blank">
      <span class="win-home-header-tile-content">
        <span v-if="Icon" class="win-home-header-tile-source icon" aria-hidden="true">
          <span v-if="isIconMarkup" v-html="Icon"></span>
          <template v-else>{{ Icon }}</template>
        </span>
        <span class="win-home-header-tile-text">
          <WinTextBlock
            class="win-home-header-tile-title"
            :Text="Title"
            FontSize="14"
            FontWeight="600"
            LineHeight="20"
            TextWrapping="Wrap" />
          <WinTextBlock
            class="win-home-header-tile-description"
            :Text="Description"
            FontSize="12"
            LineHeight="16"
            Foreground="var(--TextFillColorSecondaryBrush, var(--text-secondary))"
            TextWrapping="Wrap" />
        </span>
        <span class="win-home-header-tile-open-icon icon" aria-hidden="true">&#xE8A7;</span>
      </span>
    </WinHyperlinkButton>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import WinHyperlinkButton from '../../components/WinHyperlinkButton.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';

const props = defineProps({
  Title: { type: [String, Number], default: '' },
  Description: { type: [String, Number], default: '' },
  Icon: { type: String, default: '' },
  Link: { type: String, default: '' }
});

const isIconMarkup = computed(() => props.Icon.trim().startsWith('<'));
</script>

<style scoped>
.win-home-header-tile {
  position: relative;
  width: 232px;
  height: 172px;
  flex: 0 0 232px;
  box-sizing: border-box;
  overflow: hidden;
  color: var(--text-primary);
  background: transparent;
  border-radius: 8px;
  isolation: isolate;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
}

.win-home-header-tile::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: color-mix(in srgb, rgba(252, 252, 252, 1) 80%, transparent);
}

:global(html.theme-dark .win-home-header-tile),
:global(html[data-theme='dark'] .win-home-header-tile) {
  --home-header-tile-fill: rgba(44, 44, 44, 0.8);
}

.win-home-header-tile::before {
  background: var(--home-header-tile-fill, rgba(252, 252, 252, 0.8));
}

.win-home-header-tile :deep(.win-hyperlink-button) {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  display: block;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid var(--control-stroke-color-default, var(--ctrl-border, var(--card-stroke)));
  border-radius: 7px;
  text-decoration: none;
  transition: background var(--faster-duration, 83ms) linear;
}

.win-home-header-tile :deep(.win-hyperlink-button:hover:not(:active)) {
  color: var(--text-primary);
  background: var(--subtle-fill-color-secondary, var(--subtle-secondary));
  border-color: var(--control-stroke-color-secondary, var(--ctrl-border-accent));
  text-decoration: none;
}

.win-home-header-tile :deep(.win-hyperlink-button:active) {
  color: var(--text-secondary);
  background: var(--subtle-fill-color-tertiary, var(--subtle-tertiary));
  border-color: var(--control-stroke-color-default, var(--ctrl-border, var(--card-stroke)));
}

.win-home-header-tile-content {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  display: grid;
  grid-template-rows: 36px minmax(0, 1fr);
  row-gap: 16px;
  text-align: left;
}

.win-home-header-tile-source {
  width: 36px;
  height: 36px;
  max-width: 36px;
  max-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  color: var(--text-primary);
  font-size: 24px;
  line-height: 36px;
}

.win-home-header-tile-source :deep(img) {
  display: block;
  max-width: 36px;
  max-height: 36px;
}

.win-home-header-tile-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.win-home-header-tile-title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.win-home-header-tile-description {
  display: -webkit-box;
  max-height: 48px;
  overflow: hidden;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.win-home-header-tile-open-icon {
  position: absolute;
  right: 12px;
  bottom: 12px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 14px;
  pointer-events: none;
}

@media (prefers-color-scheme: dark) {
  :global(html:not(.theme-light):not([data-theme='light']) .win-home-header-tile) {
    --home-header-tile-fill: rgba(44, 44, 44, 0.8);
  }
}
</style>
