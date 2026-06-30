<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">CommandBar</h1>
      <p class="page-description">
        A command bar with labels on the side free floating in a page
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model="isFavoriteState"
          subtle
          @update:modelValue="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example: CommandBar with labels on the side -->
    <WinControlExample
      headerText="CommandBar with labels on the side"
      :theme="pageTheme"
      :templateCode="exampleTemplate"
      :vueCode="exampleVue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <WinCommandBar
            ref="commandBarRef"
            :isOpen="isOpen"
            :isSticky="isSticky"
            defaultLabelPosition="Right"
            @update:isOpen="isOpen = $event">
            <template #primary>
              <WinAppBarButton
                icon="Add"
                label="Add"
                @click="onElementClicked('Add')" />
              <WinAppBarButton
                icon="Edit"
                label="Edit"
                @click="onElementClicked('Edit')" />
              <WinAppBarButton
                icon="Share"
                label="Share"
                @click="onElementClicked('Share')" />
            </template>
            <template #secondary>
              <WinAppBarButton
                icon="Setting"
                label="Settings"
                :isCompact="true"
                labelPosition="Right"
                @click="onElementClicked('Settings')" />
              <template v-if="showMultipleSecondaryCommands">
                <WinAppBarButton
                  icon="Add"
                  label="Button 1"
                  :isCompact="true"
                  labelPosition="Right"
                  @click="onElementClicked('Button 1')" />
                <WinAppBarButton
                  icon="Delete"
                  label="Button 2"
                  :isCompact="true"
                  labelPosition="Right"
                  @click="onElementClicked('Button 2')" />
                <div class="commandbar-separator"></div>
                <WinAppBarButton
                  icon="FontDecrease"
                  label="Button 3"
                  :isCompact="true"
                  labelPosition="Right"
                  @click="onElementClicked('Button 3')" />
                <WinAppBarButton
                  icon="FontIncrease"
                  label="Button 4"
                  :isCompact="true"
                  labelPosition="Right"
                  @click="onElementClicked('Button 4')" />
              </template>
            </template>
          </WinCommandBar>
          <p v-if="selectedOption" class="output-text" style="margin-top: 8px;">
            {{ selectedOption }}
          </p>
        </div>
      </template>
      <template #options>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <p style="font-weight: 600; margin-bottom: 8px;">Show or hide</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <WinButton @click="openCommandBar">
                Open command bar
              </WinButton>
              <WinButton @click="closeCommandBar">
                Close command bar
              </WinButton>
            </div>
          </div>
          <div>
            <p style="font-weight: 600; margin-bottom: 8px;">Modify content</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <WinButton @click="addSecondaryCommands">
                Add secondary commands
              </WinButton>
              <WinButton @click="removeSecondaryCommands">
                Remove secondary commands
              </WinButton>
            </div>
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinCommandBar from '../components/WinCommandBar.vue';
import WinAppBarButton from '../components/WinAppBarButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'commandbar');

const { isFavorite: checkFavorite, toggleFavorite: toggleFav } = useFavorites();
const isFavorite = computed(() => checkFavorite(pageKey.value));
const isFavoriteState = ref(isFavorite.value);

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal;
});

const toggleFavorite = () => {
  toggleFav(pageKey.value);
};

const { pageTheme, toggleTheme: doToggleTheme } = usePageTheme('system');
const toggleTheme = () => doToggleTheme();

// CommandBar state
const commandBarRef = ref(null);
const isOpen = ref(false);
const isSticky = ref(false);
const showMultipleSecondaryCommands = ref(false);
const selectedOption = ref('');

// Event handlers
const onElementClicked = (buttonName) => {
  selectedOption.value = `You clicked: ${buttonName}`;
};

const openCommandBar = () => {
  isOpen.value = true;
};

const closeCommandBar = () => {
  isOpen.value = false;
};

const addSecondaryCommands = () => {
  showMultipleSecondaryCommands.value = true;
};

const removeSecondaryCommands = () => {
  showMultipleSecondaryCommands.value = false;
};

// Code examples
const exampleTemplate = `<WinCommandBar
  :isOpen="isOpen"
  :isSticky="isSticky"
  defaultLabelPosition="Right"
  @update:isOpen="isOpen = $event">
  <template #primary>
    <WinAppBarButton
      icon="Add"
      label="Add"
      @click="onElementClicked('Add')" />
    <WinAppBarButton
      icon="Edit"
      label="Edit"
      @click="onElementClicked('Edit')" />
    <WinAppBarButton
      icon="Share"
      label="Share"
      @click="onElementClicked('Share')" />
  </template>
  <template #secondary>
    <WinAppBarButton
      icon="Setting"
      label="Settings"
      :isCompact="true"
      labelPosition="Right"
      @click="onElementClicked('Settings')" />
  </template>
</WinCommandBar>`;

const exampleVue = `import { ref } from 'vue';
import WinCommandBar from '../components/WinCommandBar.vue';
import WinAppBarButton from '../components/WinAppBarButton.vue';

const isOpen = ref(false);
const isSticky = ref(false);
const selectedOption = ref('');

const onElementClicked = (buttonName) => {
  selectedOption.value = \`You clicked: \${buttonName}\`;
};

const openCommandBar = () => {
  isOpen.value = true;
};

const closeCommandBar = () => {
  isOpen.value = false;
};`;
</script>

<style scoped>
.page-header {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 12px 0;
  font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
}

.page-description {
  font-size: 14px;
  line-height: 20px;
  color: var(--text-secondary, #605E5C);
  margin: 0 0 24px 0;
  max-width: 800px;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
}

.icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 16px;
}

.output-text {
  font-size: 14px;
  color: var(--text-primary, #000000);
  margin: 0;
}

.commandbar-separator {
  height: 1px;
  background: var(--stroke-surface-flyout, rgba(0, 0, 0, 0.08));
  margin: 4px 0;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  .page-description {
    color: var(--text-secondary, #C8C6C4);
  }

  .output-text {
    color: var(--text-primary, #FFFFFF);
  }

  .commandbar-separator {
    background: var(--stroke-surface-flyout, rgba(255, 255, 255, 0.08));
  }
}

html.theme-dark .page-description {
  color: var(--text-secondary, #C8C6C4);
}

html.theme-dark .output-text {
  color: var(--text-primary, #FFFFFF);
}

html.theme-dark .commandbar-separator {
  background: var(--stroke-surface-flyout, rgba(255, 255, 255, 0.08));
}
</style>
