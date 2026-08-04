<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
          <h1 class="page-header">XamlUICommand</h1>
          <p class="page-description">
            XamlUICommand allows the sharing of the UX associated with a command. Define a command once with label, icon, keyboard accelerators, and description, then use it across multiple controls without repeating those properties.
          </p>
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"
             >
              <span class="icon">&#xE793;</span>
            </WinButton>
            <WinToggleButton class="header-action" :IsChecked="isFavoriteState"
              @update:IsChecked="toggleFavorite"
             >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Example: Creating a reusable command with XamlUICommand -->
            <WinControlExample
              headerText="Creating a reusable command with XamlUICommand"
              :theme="pageTheme"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <p style="margin: 0; color: var(--text-secondary); font-size: 14px; line-height: 1.5;">
                    XamlUICommand allows the sharing of the UX associated with a command.
                    In this instance we create a simple Custom Command with a label, icon, shortcut, and description.
                    It's defined as a resource and could be used in many controls, like this AppBarButton.
                    The button (and other controls) automatically gets all these UI properties, without the need to define the properties again.
                  </p>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <WinAppBarButton
                      icon="Favorite"
                      label="Custom XamlUICommand"
                      :tooltip="commandTooltip"
                      @click="executeCustomCommand"
                    />
                    <p class="output-text">{{ commandOutput }}</p>
                  </div>
                </div>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import WinAppBarButton from '../../components/WinAppBarButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'xamluicommand');

const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example: XamlUICommand
const commandOutput = ref('');
const commandTooltip = 'This is a custom command (Ctrl+D)';

const executeCustomCommand = () => {
  commandOutput.value = 'You fired the custom command';
};

// 示例代码
const example1Template = `<div style="display: flex; align-items: center; gap: 8px;">
  <WinAppBarButton
    icon="Favorite"
    label="Custom XamlUICommand"
    tooltip="This is a custom command (Ctrl+D)"
    @click="executeCustomCommand"
  />
  <p>{{ commandOutput }}</p>
</div>`;

const example1Vue = `const commandOutput = ref('');

const executeCustomCommand = () => {
  commandOutput.value = 'You fired the custom command';
};

// In a real WinUI app, XamlUICommand would be defined as:
// <XamlUICommand x:Name="CustomCommand"
//   Label="Custom XamlUICommand"
//   Description="This is a custom command"
//   ExecuteRequested="ExecuteHandler">
//   <XamlUICommand.IconSource>
//     <SymbolIconSource Symbol="Favorite" />
//   </XamlUICommand.IconSource>
//   <XamlUICommand.KeyboardAccelerators>
//     <KeyboardAccelerator Key="D" Modifiers="Control"/>
//   </XamlUICommand.KeyboardAccelerators>
// </XamlUICommand>`;
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
