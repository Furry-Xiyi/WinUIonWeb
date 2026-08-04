<template>
  <div class="gallery-item-page">
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <div class="page-header">
              <div class="header-left">
                <h1 class="page-title">Typography</h1>
              </div>
              <div class="header-actions">
                <WinButton class="header-action" v-bind="{ 'tooltipservice.tooltip': 'Toggle theme' }" @Click="toggleTheme">
                  <span class="icon">&#xE793;</span>
                </WinButton>
                <WinToggleButton :IsChecked="isFavoriteState" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? 'Remove from favorites' : 'Add to favorites' }" @update:IsChecked="toggleFavorite">
                  <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
                </WinToggleButton>
              </div>
            </div>

            <div class="page-description">
              <p>
                Typography helps provide structure and hierarchy to UI. The default font for Windows is
                <a href="https://learn.microsoft.com/windows/apps/design/downloads/#fonts" target="_blank" class="link">Segoe UI Variable</a>.
                Best practice is to use Regular weight for most text, use Semibold for titles. The minimum values should be 12px Regular, 14px Semibold.
              </p>
            </div>

            <p class="control-example-description">Type ramp</p>
            <WinControlExample class="basic-input-example-theme"
              :theme="pageTheme"
              :xaml="xamlCode"
              :cSharp="cSharpCode">
              <template #example>
                <div class="typography-demo">
                  <!-- Visual demonstration image area -->
                  <div class="hero-image-container">
                    <div class="hero-image" :class="{ 'dark-theme': isDarkTheme }">
                      <div class="typography-showcase">
                        <div class="showcase-item display-text">
                          <span class="text-sample">Display</span>
                          <button class="info-button" aria-label="Show Display info" v-bind="{ 'tooltipservice.tooltip': 'Show Display info' }" @click="showInfo('Display')">
                            <span class="icon">ℹ️</span>
                          </button>
                        </div>
                        <div class="showcase-item title-text">
                          <span class="text-sample">Title</span>
                          <button class="info-button" aria-label="Show Title info" v-bind="{ 'tooltipservice.tooltip': 'Show Title info' }" @click="showInfo('Title')">
                            <span class="icon">ℹ️</span>
                          </button>
                        </div>
                        <div class="showcase-item body-strong-text">
                          <span class="text-sample">Body Strong</span>
                          <button class="info-button" aria-label="Show Body Strong info" v-bind="{ 'tooltipservice.tooltip': 'Show Body Strong info' }" @click="showInfo('Body Strong')">
                            <span class="icon">ℹ️</span>
                          </button>
                        </div>
                        <div class="showcase-item body-text">
                          <span class="text-sample">Body</span>
                          <button class="info-button" aria-label="Show Body info" v-bind="{ 'tooltipservice.tooltip': 'Show Body info' }" @click="showInfo('Body')">
                            <span class="icon">ℹ️</span>
                          </button>
                        </div>
                        <div class="showcase-item caption-text">
                          <span class="text-sample">Caption</span>
                          <button class="info-button" aria-label="Show Caption info" v-bind="{ 'tooltipservice.tooltip': 'Show Caption info' }" @click="showInfo('Caption')">
                            <span class="icon">ℹ️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Type ramp table -->
                  <div class="type-ramp-table">
                    <div class="table-header">
                      <div class="column example-column">Example</div>
                      <div class="column font-column">Variable Font</div>
                      <div class="column size-column">Size/Line height</div>
                      <div class="column style-column">Style</div>
                    </div>

                    <TypographyRow
                      example="Caption"
                      variableFont="Small, Regular"
                      sizeLineHeight="12/16 epx"
                      resourceName="CaptionTextBlockStyle"
                      styleClass="caption"
                      :background="true" />

                    <TypographyRow
                      example="Body"
                      variableFont="Text, Regular"
                      sizeLineHeight="14/20 epx"
                      resourceName="BodyTextBlockStyle"
                      styleClass="body"
                      :background="false" />

                    <TypographyRow
                      example="Body Strong"
                      variableFont="Text, SemiBold"
                      sizeLineHeight="14/20 epx"
                      resourceName="BodyStrongTextBlockStyle"
                      styleClass="body-strong"
                      :background="true" />

                    <TypographyRow
                      example="Body Large"
                      variableFont="Text, Regular"
                      sizeLineHeight="18/24 epx"
                      resourceName="BodyLargeTextBlockStyle"
                      styleClass="body-large"
                      :background="false" />

                    <TypographyRow
                      example="Body Large Strong"
                      variableFont="Text, SemiBold"
                      sizeLineHeight="18/24 epx"
                      resourceName="BodyLargeStrongTextBlockStyle"
                      styleClass="body-large-strong"
                      :background="true" />

                    <TypographyRow
                      example="Subtitle"
                      variableFont="Display, SemiBold"
                      sizeLineHeight="20/28 epx"
                      resourceName="SubtitleTextBlockStyle"
                      styleClass="subtitle"
                      :background="false" />

                    <TypographyRow
                      example="Title"
                      variableFont="Display, SemiBold"
                      sizeLineHeight="28/36 epx"
                      resourceName="TitleTextBlockStyle"
                      styleClass="title"
                      :background="true" />

                    <TypographyRow
                      example="Title Large"
                      variableFont="Display, SemiBold"
                      sizeLineHeight="40/52 epx"
                      resourceName="TitleLargeTextBlockStyle"
                      styleClass="title-large"
                      :background="false" />

                    <TypographyRow
                      example="Display"
                      variableFont="Display, SemiBold"
                      sizeLineHeight="68/92 epx"
                      resourceName="DisplayTextBlockStyle"
                      styleClass="display"
                      :background="true" />
                  </div>
                </div>
              </template>
            </WinControlExample>

            <!-- Info tooltip -->
            <div v-if="activeInfo" class="info-tooltip" :style="tooltipStyle">
              <div class="tooltip-content">
                <div class="tooltip-title">{{ activeInfo }}</div>
              </div>
            </div>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import TypographyRow from '../../components/TypographyRow.vue';
import { createPageState } from '../../utils/pageState';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'typography');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const isDarkTheme = computed(() => pageTheme.value === 'dark');
const activeInfo = ref(null);
const tooltipStyle = ref({});

const showInfo = (typeName) => {
  activeInfo.value = typeName;
  setTimeout(() => {
    activeInfo.value = null;
  }, 2000);
};

const xamlCode = `<TextBlock Text="Caption" Style="{StaticResource CaptionTextBlockStyle}"/>
<TextBlock Text="Body" Style="{StaticResource BodyTextBlockStyle}"/>
<TextBlock Text="Body Strong" Style="{StaticResource BodyStrongTextBlockStyle}"/>
<TextBlock Text="Body Large" Style="{StaticResource BodyLargeTextBlockStyle}"/>
<TextBlock Text="Body Large Strong" Style="{StaticResource BodyLargeStrongTextBlockStyle}"/>
<TextBlock Text="Subtitle" Style="{StaticResource SubtitleTextBlockStyle}"/>
<TextBlock Text="Title" Style="{StaticResource TitleTextBlockStyle}"/>
<TextBlock Text="Title Large" Style="{StaticResource TitleLargeTextBlockStyle}"/>
<TextBlock Text="Display" Style="{StaticResource DisplayTextBlockStyle}"/>`;

const cSharpCode = `<div class="typography-samples">
  <div class="text-caption">Caption</div>
  <div class="text-body">Body</div>
  <div class="text-body-strong">Body Strong</div>
  <div class="text-body-large">Body Large</div>
  <div class="text-body-large-strong">Body Large Strong</div>
  <div class="text-subtitle">Subtitle</div>
  <div class="text-title">Title</div>
  <div class="text-title-large">Title Large</div>
  <div class="text-display">Display</div>
</div>`;
</script>

<style scoped>
.page-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 4px;
}

.icon {
  font-size: 16px;
}

.page-description {
  margin-bottom: 24px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 20px;
}

.page-description p {
  margin: 0;
}

.link {
  color: var(--accent-default);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.typography-demo {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.hero-image-container {
  width: 100%;
  overflow: auto;
}

.hero-image {
  min-width: 750px;
  height: 450px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.hero-image.dark-theme {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.typography-showcase {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 40px;
}

.showcase-item {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
}

.showcase-item.display-text {
  top: 110px;
  left: 80px;
}

.showcase-item.title-text {
  top: 20px;
  left: 180px;
}

.showcase-item.body-strong-text {
  top: 245px;
  left: 20px;
}

.showcase-item.body-text {
  top: 280px;
  left: 100px;
}

.showcase-item.caption-text {
  top: 60px;
  right: 80px;
}

.text-sample {
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.display-text .text-sample {
  font-size: 68px;
  font-weight: 600;
  line-height: 92px;
}

.title-text .text-sample {
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
}

.body-strong-text .text-sample {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.body-text .text-sample {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.caption-text .text-sample {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.info-button {
  position: relative;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  --typography-info-fill: rgba(255, 255, 255, 0.2);
  isolation: isolate;
  background: transparent;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  padding: 4px;
}

.info-button::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--typography-info-fill);
  transition: background 0.2s;
}

.info-button:hover {
  --typography-info-fill: rgba(255, 255, 255, 0.3);
  background: transparent;
}

.info-button .icon {
  font-size: 16px;
}

.type-ramp-table {
  width: 100%;
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 272px 136px 112px 194px;
  gap: 0;
  padding: 0 0 12px 0;
  border-bottom: 1px solid var(--divider-default);
  margin-bottom: 0;
}

.column {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
  line-height: 16px;
}

.example-column {
  padding-left: 16px;
}

.info-tooltip {
  position: fixed;
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--ctrl-border-rest);
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: var(--win-tooltip-z-index, var(--win-tip-z-index, 2147483647));
  pointer-events: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
  backdrop-filter: var(--flyout-backdrop, blur(30px));
}

.info-tooltip::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--flyout-bg);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tooltip-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .table-header {
    grid-template-columns: 200px 120px 100px 150px;
  }
}
</style>
