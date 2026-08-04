<template>
  <div class="gallery-item-page">
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- 页面头部 -->
            <div class="page-header">
              <div class="header-content">
                <h1 class="page-title">Compact Sizing</h1>
                <p class="page-description">
                  Controls can be displayed in a more compact density to enable more content to be shown in limited space.
                </p>
              </div>
              <div class="header-actions">
                <WinButton class="header-action" v-bind="{ 'tooltipservice.tooltip': `Switch to ${theme === 'light' ? 'dark' : 'light'} theme` }" @Click="toggleTheme">
                  <span class="icon">&#xE793;</span>
                </WinButton>
                <WinToggleButton :IsChecked="isFavorite" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavorite ? 'Remove from favorites' : 'Add to favorites' }" @update:IsChecked="toggleFavorite">
                  <span class="icon">{{ isFavorite ? '&#xE735;' : '&#xE734;' }}</span>
                </WinToggleButton>
              </div>
            </div>

            <!-- 支持的控件列表 -->
            <div class="supported-controls">
              <p class="controls-title"><strong>Controls that support compact styling:</strong></p>
              <ul class="controls-list">
                <li>ListView</li>
                <li>TextBox</li>
                <li>PasswordBox</li>
                <li>AutoSuggestBox</li>
                <li>ComboBox</li>
                <li>DatePicker</li>
                <li>TimePicker</li>
                <li>TreeView</li>
                <li>NavigationView</li>
                <li>MenuBar</li>
              </ul>
            </div>

            <!-- 示例 -->
            <WinControlExample
              headerText="Compact Sizing for controls"
              :templateCode="templateCode"
              :vueCode="vueCode">
              <template #example>
                <div class="sizing-demo" :class="{ 'compact-mode': isCompact }">
                  <div class="demo-form">
                    <p class="demo-header">{{ isCompact ? 'Compact Size' : 'Standard Size' }}</p>
                    <WinTextBox
                      v-model:Text="firstName"
                      Header="First Name:"
                      PlaceholderText="Enter first name" />
                    <WinTextBox
                      v-model:Text="lastName"
                      Header="Last Name:"
                      PlaceholderText="Enter last name" />
                    <WinPasswordBox
                      v-model="password"
                      Header="Password:"
                      placeholder="Enter password" />
                    <WinPasswordBox
                      v-model="confirmPassword"
                      Header="Confirm Password:"
                      placeholder="Confirm password" />
                    <WinDatePicker
                      v-model:Date="chosenDate"
                      Header="Pick a date" />
                  </div>
                </div>
              </template>
              <template #options>
                <div class="options-group">
                  <p class="options-header">Fluent Standard and Compact Sizing</p>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input
                        type="radio"
                        name="sizing"
                        value="standard"
                        v-model="sizingMode"
                        @change="onSizingChanged" />
                      <span>Standard</span>
                    </label>
                    <label class="radio-option">
                      <input
                        type="radio"
                        name="sizing"
                        value="compact"
                        v-model="sizingMode"
                        @change="onSizingChanged" />
                      <span>Compact</span>
                    </label>
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
import WinTextBox from '../../components/WinTextBox.vue';
import WinPasswordBox from '../../components/WinPasswordBox.vue';
import WinDatePicker from '../../components/WinDatePicker.vue';

const theme = ref('light');
const isFavorite = ref(false);
const sizingMode = ref('standard');
const isCompact = computed(() => sizingMode.value === 'compact');

// 表单数据
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const confirmPassword = ref('');
const chosenDate = ref(new Date());

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

const onSizingChanged = () => {
  // 切换时保留表单状态（数据已通过v-model保持）
};

const templateCode = `<div class="sizing-demo" :class="{ 'compact-mode': isCompact }">
  <div class="demo-form">
    <p class="demo-header">{{ isCompact ? 'Compact Size' : 'Standard Size' }}</p>
    <WinTextBox
      v-model:Text="firstName"
      Header="First Name:"
      PlaceholderText="Enter first name" />
    <WinTextBox
      v-model:Text="lastName"
      Header="Last Name:"
      PlaceholderText="Enter last name" />
    <WinPasswordBox
      v-model="password"
      Header="Password:"
      placeholder="Enter password" />
    <WinPasswordBox
      v-model="confirmPassword"
      Header="Confirm Password:"
      placeholder="Confirm password" />
    <WinDatePicker
      v-model:Date="chosenDate"
      Header="Pick a date" />
  </div>
</div>`;

const vueCode = `import { ref, computed } from 'vue';
import WinTextBox from '../../components/WinTextBox.vue';
import WinPasswordBox from '../../components/WinPasswordBox.vue';
import WinDatePicker from '../../components/WinDatePicker.vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const sizingMode = ref('standard');
const isCompact = computed(() => sizingMode.value === 'compact');

const firstName = ref('');
const lastName = ref('');
const password = ref('');
const confirmPassword = ref('');
const chosenDate = ref(new Date());`;
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
  padding-bottom: 16px;
  border-bottom: 1px solid var(--divider-stroke-default);
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

.icon {
  font-size: 16px;
}

.supported-controls {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--card-bg-default);
  border: 1px solid var(--ctrl-border-rest);
  border-radius: 8px;
}

.controls-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-primary);
}

.controls-list {
  margin: 0;
  padding-left: 20px;
  columns: 2;
  column-gap: 32px;
}

.controls-list li {
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.sizing-demo {
  width: 100%;
  padding: 16px;
  transition: all 0.2s ease;
}

.demo-form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}

/* Standard模式 - 16px间距 */
.sizing-demo:not(.compact-mode) .demo-form {
  gap: 16px;
}

/* Compact模式 - 8px间距 */
.sizing-demo.compact-mode .demo-form {
  gap: 8px;
}

.demo-header {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

/* Compact模式 - 减小控件间距 */
.sizing-demo.compact-mode :deep(.win-textbox),
.sizing-demo.compact-mode :deep(.win-passwordbox),
.sizing-demo.compact-mode :deep(.win-datepicker) {
  margin-bottom: 0;
}

/* Compact模式 - 减小header间距 */
.sizing-demo.compact-mode :deep(.textbox-header),
.sizing-demo.compact-mode :deep(.passwordbox-header),
.sizing-demo.compact-mode :deep(.datepicker-header) {
  margin-bottom: 2px;
}

.options-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.options-header {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background 0.15s ease;
}

.radio-option:hover {
  background: var(--subtle-fill-secondary);
}

.radio-option input[type="radio"] {
  width: 20px;
  height: 20px;
  margin: 0;
  cursor: pointer;
  accent-color: var(--accent-default);
}

.radio-option span {
  font-size: 14px;
  color: var(--text-primary);
  user-select: none;
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
    width: 100%;
    justify-content: flex-end;
  }

  .controls-list {
    columns: 1;
  }
}
</style>
