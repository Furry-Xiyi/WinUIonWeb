<template>
  <div class="gallery-item-page">
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Page Header -->
            <div class="page-header">
              <div class="page-title-section">
                <h1 class="page-title">Geometry</h1>
                <p class="page-description">
                  Geometry describes the shape, size and position of UI elements on screen.
                  These fundamental design elements help experiences feel coherent across the entire design system.
                  WinUI uses three levels of rounding depending on what UI component is being rounded and how that component is arranged relative to neighboring elements.
                </p>
                <p class="page-description">
                  You can reference built-in corner radii styles using:
                  <code class="inline-code">CornerRadius="{StaticResource ControlCornerRadius}"</code>.
                </p>
              </div>
              <div class="page-actions">
                <WinButton class="header-action" v-bind="{ 'tooltipservice.tooltip': themeButtonTitle }" @Click="toggleTheme">
                  <span class="icon">&#xE793;</span>
                </WinButton>
                <WinToggleButton :IsChecked="isFavorite" class="header-action" v-bind="{ 'tooltipservice.tooltip': favoriteButtonTitle }" @update:IsChecked="toggleFavorite">
                  <span class="icon">{{ isFavorite ? '&#xE735;' : '&#xE734;' }}</span>
                </WinToggleButton>
              </div>
            </div>

            <!-- Main Example -->
            <WinControlExample
              headerText="Corner radius examples"
              :templateCode="templateCode"
              :vueCode="vueCode">
              <template #example>
                <div class="geometry-container">
                  <!-- Image Canvas with Interactive Hotspots -->
                  <div class="canvas-container">
                    <div class="canvas">
                      <img
                        :src="geometryImage"
                        alt="Geometry examples showing corner radius in context"
                        class="geometry-image" />

                      <!-- Overlay Teaching Tip Button (8px) -->
                      <WinButton
                        class="geometry-button"
                        style="left: 16px; top: 16px;"
                        @click="toggleTooltip1"
                        v-bind="{ 'tooltipservice.tooltip': '8px' }">
                        <span class="icon">&#xE946;</span>
                      </WinButton>
                      <div
                        v-if="tooltip1Open"
                        class="teaching-tip"
                        style="left: 52px; top: 16px;">
                        <div class="teaching-tip-title">8px</div>
                        <div class="teaching-tip-subtitle">OverlayCornerRadius</div>
                      </div>

                      <!-- Body Teaching Tip Button (0px) -->
                      <WinButton
                        class="geometry-button"
                        style="left: 16px; top: 148px;"
                        @click="toggleTooltip2"
                        v-bind="{ 'tooltipservice.tooltip': 'Body' }">
                        <span class="icon">&#xE946;</span>
                      </WinButton>
                      <div
                        v-if="tooltip2Open"
                        class="teaching-tip"
                        style="left: 52px; top: 148px;">
                        <div class="teaching-tip-title">0px</div>
                      </div>

                      <!-- Control Teaching Tip Button (4px) -->
                      <WinButton
                        class="geometry-button"
                        style="left: 240px; top: 168px;"
                        @click="toggleTooltip3"
                        v-bind="{ 'tooltipservice.tooltip': '4px' }">
                        <span class="icon">&#xE946;</span>
                      </WinButton>
                      <div
                        v-if="tooltip3Open"
                        class="teaching-tip"
                        style="left: 276px; top: 168px;">
                        <div class="teaching-tip-title">4px</div>
                        <div class="teaching-tip-subtitle">ControlCornerRadius</div>
                      </div>
                    </div>
                  </div>

                  <!-- Corner Radius Reference Table -->
                  <div class="radius-table">
                    <!-- Table Header -->
                    <div class="table-header">
                      <div class="header-cell radius-col">Corner radius</div>
                      <div class="header-cell usage-col">Usage</div>
                      <div class="header-cell style-col">Style</div>
                    </div>

                    <!-- 8px - OverlayCornerRadius -->
                    <div class="table-row light-row">
                      <div class="cell radius-col">
                        <div class="radius-visual">
                          <div class="radius-sample" style="border-radius: 8px;"></div>
                          <span>8px</span>
                        </div>
                      </div>
                      <div class="cell usage-col">
                        Top-level containers such as app windows, flyouts, cards and dialogs.
                      </div>
                      <div class="cell style-col">
                        <code class="code-text">OverlayCornerRadius</code>
                      </div>
                      <div class="cell copy-col">
                        <WinButton
                          class="copy-button"
                          @click="copyToClipboard('OverlayCornerRadius')"
                          ToolTipService.ToolTip="Copy to clipboard">
                          <span class="icon">&#xE8C8;</span>
                        </WinButton>
                      </div>
                    </div>

                    <!-- 4px - ControlCornerRadius -->
                    <div class="table-row">
                      <div class="cell radius-col">
                        <div class="radius-visual">
                          <div class="radius-sample" style="border-radius: 4px;"></div>
                          <span>4px</span>
                        </div>
                      </div>
                      <div class="cell usage-col">
                        In-page elements such as controls and list backplates.
                      </div>
                      <div class="cell style-col">
                        <code class="code-text">ControlCornerRadius</code>
                      </div>
                      <div class="cell copy-col">
                        <WinButton
                          class="copy-button"
                          @click="copyToClipboard('ControlCornerRadius')"
                          ToolTipService.ToolTip="Copy to clipboard">
                          <span class="icon">&#xE8C8;</span>
                        </WinButton>
                      </div>
                    </div>

                    <!-- 0px - No rounding -->
                    <div class="table-row light-row">
                      <div class="cell radius-col">
                        <div class="radius-visual">
                          <div class="radius-sample" style="border-radius: 0;"></div>
                          <span>0px</span>
                        </div>
                      </div>
                      <div class="cell usage-col">
                        Straight edges that intersect with other straight edges.
                      </div>
                      <div class="cell style-col">
                        <code class="code-text">N/a</code>
                      </div>
                      <div class="cell copy-col"></div>
                    </div>
                  </div>
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
// Theme management
const currentTheme = ref('light');

const themeButtonTitle = computed(() => `Switch to ${currentTheme.value === 'light' ? 'dark' : 'light'} theme`);

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
};

// Favorite management
const isFavorite = ref(false);
const favoriteButtonTitle = computed(() => isFavorite.value ? 'Remove from favorites' : 'Add to favorites');

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

// Geometry image based on theme
const geometryImage = computed(() => {
  return currentTheme.value === 'light'
    ? '/assets/design/geometry-light.png'
    : '/assets/design/geometry-dark.png';
});

// Teaching tip states
const tooltip1Open = ref(false);
const tooltip2Open = ref(false);
const tooltip3Open = ref(false);

const toggleTooltip1 = () => {
  tooltip1Open.value = !tooltip1Open.value;
  if (tooltip1Open.value) {
    tooltip2Open.value = false;
    tooltip3Open.value = false;
  }
};

const toggleTooltip2 = () => {
  tooltip2Open.value = !tooltip2Open.value;
  if (tooltip2Open.value) {
    tooltip1Open.value = false;
    tooltip3Open.value = false;
  }
};

const toggleTooltip3 = () => {
  tooltip3Open.value = !tooltip3Open.value;
  if (tooltip3Open.value) {
    tooltip1Open.value = false;
    tooltip2Open.value = false;
  }
};

// Copy to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    // Could show a confirmation toast here
    console.log('Copied:', text);
  });
};

// Code examples
const templateCode = `<Grid CornerRadius="{StaticResource OverlayCornerRadius}"/>
<Grid CornerRadius="{StaticResource ControlCornerRadius}"/>`;

const vueCode = `<div style="border-radius: 8px;">
  <!-- OverlayCornerRadius: 8px -->
</div>

<div style="border-radius: 4px;">
  <!-- ControlCornerRadius: 4px -->
</div>

<div style="border-radius: 0;">
  <!-- No rounding -->
</div>`;
</script>

<style scoped>
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title-section {
  flex: 1;
}

.page-title {
  margin: 0 0 12px 0;
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
}

.page-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 800px;
}

.inline-code {
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 13px;
  font-style: italic;
  background: var(--subtle-fill-secondary);
  padding: 2px 6px;
  border-radius: 3px;
}

.page-actions {
  display: flex;
  gap: 4px;
}

.icon {
  font-size: 16px;
}

.geometry-container {
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
}

.canvas-container {
  width: 100%;
  overflow-x: auto;
}

.canvas {
  position: relative;
  width: 505px;
  height: 271px;
  margin: 0 auto;
}

.geometry-image {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 8px;
}

.geometry-button {
  position: absolute;
  padding: 4px;
  min-width: unset;
  width: 32px;
  height: 32px;
  z-index: 10;
}

.teaching-tip {
  position: absolute;
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--ctrl-border-rest);
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  z-index: 20;
  min-width: 200px;
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
  backdrop-filter: var(--flyout-backdrop, blur(30px));
}

.teaching-tip::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--flyout-bg);
}

.teaching-tip-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.teaching-tip-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
}

.radius-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.table-header {
  display: grid;
  grid-template-columns: 148px 1fr 160px;
  gap: 0;
  margin-bottom: 24px;
}

.header-cell {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 16px;
}

.table-row {
  display: grid;
  grid-template-columns: 148px 1fr 160px auto;
  gap: 0;
  padding: 12px 0;
  border-radius: 4px;
  background: var(--card-bg-default);
  align-items: center;
}

.light-row {
  background: var(--subtle-fill-secondary);
}

.cell {
  padding: 0 16px;
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
}

.radius-col {
  width: 148px;
}

.usage-col {
  max-width: 400px;
}

.style-col {
  width: 160px;
}

.copy-col {
  width: auto;
  padding-right: 8px;
}

.radius-visual {
  display: flex;
  align-items: center;
  gap: 12px;
}

.radius-sample {
  width: 20px;
  height: 20px;
  background: var(--accent-fill-default);
  flex-shrink: 0;
}

.code-text {
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 12px;
  color: var(--text-primary);
}

.copy-button {
  min-width: unset;
  width: 32px;
  height: 32px;
  padding: 4px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .header-cell,
  .cell {
    padding: 8px 16px;
  }

  .radius-col,
  .usage-col,
  .style-col {
    width: auto;
    max-width: none;
  }
}
</style>
