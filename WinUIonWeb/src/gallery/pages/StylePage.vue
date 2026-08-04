<template>
  <div class="gallery-item-page">
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- 页面标题区域 -->
            <div class="page-header">
              <div class="header-content">
                <h1 class="page-title">Style</h1>
                <p class="page-description">
                  Styles are reusable collections of property settings that define the appearance and behavior of controls.
                </p>
              </div>
              <div class="header-actions">
                <WinButton class="header-action" @Click="toggleTheme">
                  <span class="icon">&#xE793;</span>
                </WinButton>
                <WinToggleButton :IsChecked="isFavorite" class="header-action" @update:IsChecked="toggleFavorite">
                  <span class="icon">{{ isFavorite ? '&#xE735;' : '&#xE734;' }}</span>
                </WinToggleButton>
              </div>
            </div>

            <!-- 简介区域 -->
            <div class="page-intro">
              <p class="intro-text">
                The definition of styles is similar to other resources: app-level, page-level, control-level.
              </p>
              <ul class="intro-list">
                <li><strong>Styles</strong> are reusable collections of property settings for a specific control type.</li>
                <li>A <strong>keyed style</strong> is used for explicit application, while an <strong>implicit style</strong> is used for automatic application to all controls of a type.</li>
                <li>Styles improve maintainability, consistency, and reduce repetition in XAML code.</li>
              </ul>
            </div>

            <!-- 示例1: 创建和应用样式 -->
            <WinControlExample
              headerText="Creating and applying a style"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <div class="example-layout">
                  <WinButton>Default button</WinButton>
                  <WinButton :class="'styled-button'">Styled button</WinButton>
                  <WinButton :class="'styled-button override-bg'">Styled button (overridden)</WinButton>
                </div>
              </template>
            </WinControlExample>

            <!-- 示例2: 隐式样式 (无key) -->
            <WinControlExample
              headerText="Style without a key (implicit style)"
              :templateCode="example2Template"
              :vueCode="example2Vue">
              <template #example>
                <div class="implicit-style-demo">
                  <p class="styled-text">This style is applied automatically!</p>
                  <p class="styled-text">No need to set a key.</p>
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const isFavorite = ref(false);

const toggleTheme = () => {
  const root = document.documentElement;
  const isLight = root.classList.contains('theme-light') || root.getAttribute('data-theme') === 'light';
  const nextTheme = isLight ? 'dark' : 'light';
  root.classList.remove('theme-light', 'theme-dark');
  root.classList.add(`theme-${nextTheme}`);
  root.setAttribute('data-theme', nextTheme);
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

// 示例1代码
const example1Template = `<StackPanel Spacing="8">
    <StackPanel.Resources>
        <Style x:Key="CustomButtonStyle" TargetType="Button" BasedOn="{StaticResource ButtonRevealStyle}">
            <Setter Property="Background" Value="{ThemeResource AccentAcrylicBackgroundFillColorDefaultBrush}" />
            <Setter Property="MinWidth" Value="200" />
        </Style>
    </StackPanel.Resources>
    <Button Content="Default button" />
    <Button Content="Styled button" Style="{StaticResource CustomButtonStyle}" />
    <Button Content="Styled button (overridden)" Style="{StaticResource CustomButtonStyle}"
            Background="{ThemeResource SystemFillColorCriticalBackgroundBrush}" />
</StackPanel>`;

const example1Vue = `<template>
  <div class="example-layout">
    <WinButton>Default button</WinButton>
    <WinButton :class="'styled-button'">Styled button</WinButton>
    <WinButton :class="'styled-button override-bg'">Styled button (overridden)</WinButton>
  </div>
</template>

<style scoped>
.styled-button {
  background: var(--accent-default);
  min-width: 200px;
}

.override-bg {
  background: var(--system-fill-critical);
}
</style>`;

// 示例2代码
const example2Template = `<StackPanel>
    <StackPanel.Resources>
        <Style TargetType="TextBlock">
            <Setter Property="FontSize" Value="16" />
            <Setter Property="FontFamily" Value="Consolas" />
            <Setter Property="FontWeight" Value="Bold" />
        </Style>
    </StackPanel.Resources>

    <TextBlock Text="This style is applied automatically!" />
    <TextBlock Text="No need to set a key." />
</StackPanel>`;

const example2Vue = `<template>
  <div class="implicit-style-demo">
    <p class="styled-text">This style is applied automatically!</p>
    <p class="styled-text">No need to set a key.</p>
  </div>
</template>

<style scoped>
.styled-text {
  font-size: 16px;
  font-family: 'Consolas', monospace;
  font-weight: bold;
}
</style>`;
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--divider-default);
}

.header-content {
  flex: 1;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
}

.page-description {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.page-intro {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--card-bg-default);
  border-radius: 8px;
  border: 1px solid var(--ctrl-border-rest);
}

.intro-text {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
}

.intro-list {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.intro-list li {
  position: relative;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  padding-left: 8px;
}

.intro-list li::before {
  content: '•';
  position: absolute;
  left: -12px;
  color: var(--text-secondary);
}

.intro-list li:last-child {
  margin-bottom: 0;
}

/* 示例1样式 */
.example-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.example-layout :deep(.styled-button) {
  background: var(--accent-default);
  min-width: 200px;
}

.example-layout :deep(.override-bg) {
  background: #d13438;
}

/* 示例2样式 */
.implicit-style-demo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.styled-text {
  margin: 0;
  font-size: 16px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-weight: bold;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    align-self: flex-end;
  }
}
</style>
