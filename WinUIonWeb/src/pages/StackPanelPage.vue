<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">StackPanel</h1>
        <p class="page-description">
          The StackPanel control is a layout panel that arranges child elements into a single line that can be oriented horizontally or vertically.
        </p>
      </div>
      <div class="header-actions">
        <button class="icon-button" @click="toggleTheme" :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'">
          <svg v-if="isDark" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zm0 1c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM8 0a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 0zm0 13a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 13zm8-5a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM3 8a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2A.5.5 0 013 8zm9.743-5.157a.5.5 0 010 .707l-1.414 1.414a.5.5 0 11-.707-.707l1.414-1.414a.5.5 0 01.707 0zM5.086 11.914a.5.5 0 010 .707l-1.414 1.414a.5.5 0 11-.707-.707l1.414-1.414a.5.5 0 01.707 0zM2.843 2.843a.5.5 0 01.707 0l1.414 1.414a.5.5 0 11-.707.707L2.843 3.55a.5.5 0 010-.707zm8.828 8.828a.5.5 0 01.707 0l1.414 1.414a.5.5 0 01-.707.707l-1.414-1.414a.5.5 0 010-.707z"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 108 8 8 8 0 00-8-8zm0 15V1a7 7 0 010 14z"/>
          </svg>
        </button>
        <button class="icon-button" @click="toggleFavorite" :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'">
          <svg width="16" height="16" viewBox="0 0 16 16" :fill="isFavorite ? 'currentColor' : 'none'" :stroke="isFavorite ? 'none' : 'currentColor'" stroke-width="1">
            <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 示例：基本 StackPanel -->
    <WinControlExample
      headerText="A StackPanel control."
      :templateCode="templateCode"
      :vueCode="vueCode">
      <template #example>
        <div :style="stackPanelStyle">
          <div v-for="(color, index) in rectangleColors" :key="index" :style="getRectangleStyle(color)"></div>
        </div>
      </template>
      <template #options>
        <WinRadioButton
          header="Orientation"
          :options="orientationOptions"
          :selectedValue="orientation"
          @selectionChanged="onOrientationChanged" />
        <WinSlider
          header="Spacing"
          :minimum="0"
          :maximum="16"
          :stepFrequency="1"
          :value="spacing"
          @valueChanged="onSpacingChanged" />
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import WinSlider from '../components/WinSlider.vue';

// 主题状态
const isDark = ref(false);
const isFavorite = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

// StackPanel 配置
const orientation = ref('Vertical');
const spacing = ref(8);

const rectangleColors = ['Red', 'Blue', 'Green', 'Yellow'];

const orientationOptions = [
  { content: 'Horizontal', value: 'Horizontal' },
  { content: 'Vertical', value: 'Vertical' }
];

const onOrientationChanged = ({ value }) => {
  orientation.value = value;
};

const onSpacingChanged = ({ value }) => {
  spacing.value = value;
};

// 样式计算
const stackPanelStyle = computed(() => ({
  display: 'flex',
  flexDirection: orientation.value === 'Vertical' ? 'column' : 'row',
  gap: `${spacing.value}px`,
  alignItems: 'flex-start'
}));

const getRectangleStyle = (color) => ({
  width: '40px',
  height: '40px',
  backgroundColor: color.toLowerCase()
});

// 代码示例
const templateCode = computed(() => `<StackPanel
  Orientation="${orientation.value}"
  Spacing="${spacing.value}">
  <Rectangle Fill="Red"/>
  <Rectangle Fill="Blue"/>
  <Rectangle Fill="Green"/>
  <Rectangle Fill="Yellow"/>
</StackPanel>`);

const vueCode = computed(() => `<template>
  <div :style="stackPanelStyle">
    <div v-for="(color, index) in rectangleColors"
         :key="index"
         :style="getRectangleStyle(color)">
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const orientation = '${orientation.value}';
const spacing = ${spacing.value};
const rectangleColors = ['Red', 'Blue', 'Green', 'Yellow'];

const stackPanelStyle = computed(() => ({
  display: 'flex',
  flexDirection: orientation === 'Vertical' ? 'column' : 'row',
  gap: \`\${spacing}px\`,
  alignItems: 'flex-start'
}));

const getRectangleStyle = (color) => ({
  width: '40px',
  height: '40px',
  backgroundColor: color.toLowerCase()
});
<\/script>`);
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
  gap: 16px;
}

.header-content {
  flex: 1;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
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
  gap: 8px;
}

.icon-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ctrl-fill-default);
  border: 1px solid var(--ctrl-border-rest);
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.15s ease;
}

.icon-button:hover {
  background: var(--ctrl-fill-secondary);
  border-color: var(--ctrl-border-hover);
}

.icon-button:active {
  background: var(--ctrl-fill-tertiary);
  border-color: var(--ctrl-border-pressed);
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-header {
    flex-direction: column;
  }

  .header-actions {
    align-self: flex-end;
  }
}
</style>
