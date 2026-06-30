<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">CommandBarFlyout</h1>
      <p class="page-description">
        The CommandBarFlyout lets you provide users with easy access to common tasks by showing commands in a floating toolbar related to an element on your UI canvas.
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

    <!-- Example: CommandBarFlyout for commands on an in-app object -->
    <WinControlExample
      headerText="CommandBarFlyout for commands on an in-app object"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <p style="margin: 0; font-size: 14px; color: var(--text-secondary);">
            Click or right click the image to open a CommandBarFlyout
          </p>
          <div style="position: relative; display: inline-block; width: fit-content;">
            <button
              ref="imageButton"
              @click="handleImageClick"
              @contextmenu.prevent="handleImageContextMenu"
              style="padding: 0; border: none; background: none; cursor: pointer;">
              <img
                src="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/Rainier.jpg"
                alt="Mountain"
                style="height: 300px; display: block; border-radius: 4px;" />
            </button>
            <WinCommandBarFlyout
              v-if="showFlyout"
              :target="imageButton"
              :placement="flyoutPlacement"
              :isTransient="isTransient"
              @closed="handleFlyoutClosed">
              <template #primaryCommands>
                <WinAppBarButton
                  icon="&#xE72D;"
                  label="Share"
                  @click="handleCommand('Share')" />
                <WinAppBarButton
                  icon="&#xE74E;"
                  label="Save"
                  @click="handleCommand('Save')" />
                <WinAppBarButton
                  icon="&#xE74D;"
                  label="Delete"
                  @click="handleCommand('Delete')" />
              </template>
              <template #secondaryCommands>
                <WinAppBarButton
                  label="Resize"
                  @click="handleCommand('Resize')" />
                <WinAppBarButton
                  label="Move"
                  @click="handleCommand('Move')" />
              </template>
            </WinCommandBarFlyout>
          </div>
        </div>
      </template>
      <template #options>
        <p class="output-text">{{ selectedOption }}</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinCommandBarFlyout from '../components/WinCommandBarFlyout.vue';
import WinAppBarButton from '../components/WinAppBarButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'commandbarflyout');

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

// Example: CommandBarFlyout
const imageButton = ref(null);
const showFlyout = ref(false);
const isTransient = ref(true);
const flyoutPlacement = ref('right');
const selectedOption = ref('');

const handleImageClick = () => {
  // Show in transient mode (focus stays on image)
  isTransient.value = true;
  showFlyout.value = true;
};

const handleImageContextMenu = () => {
  // Show in standard mode (focus moves to menu)
  isTransient.value = false;
  showFlyout.value = true;
};

const handleCommand = (command) => {
  selectedOption.value = `You clicked: ${command}`;
  showFlyout.value = false;
};

const handleFlyoutClosed = () => {
  showFlyout.value = false;
};

const example1Template = `<button
  ref="imageButton"
  @click="handleImageClick"
  @contextmenu.prevent="handleImageContextMenu"
  style="padding: 0; border: none; background: none; cursor: pointer;">
  <img
    src="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/Rainier.jpg"
    alt="Mountain"
    style="height: 300px; display: block;" />
</button>

<WinCommandBarFlyout
  v-if="showFlyout"
  :target="imageButton"
  :placement="flyoutPlacement"
  :isTransient="isTransient"
  @closed="handleFlyoutClosed">
  <template #primaryCommands>
    <WinAppBarButton
      icon="&#xE72D;"
      label="Share"
      @click="handleCommand('Share')" />
    <WinAppBarButton
      icon="&#xE74E;"
      label="Save"
      @click="handleCommand('Save')" />
    <WinAppBarButton
      icon="&#xE74D;"
      label="Delete"
      @click="handleCommand('Delete')" />
  </template>
  <template #secondaryCommands>
    <WinAppBarButton
      label="Resize"
      @click="handleCommand('Resize')" />
    <WinAppBarButton
      label="Move"
      @click="handleCommand('Move')" />
  </template>
</WinCommandBarFlyout>`;

const example1Vue = `const imageButton = ref(null);
const showFlyout = ref(false);
const isTransient = ref(true);
const selectedOption = ref('');

const handleImageClick = () => {
  // Transient mode - focus stays on image
  isTransient.value = true;
  showFlyout.value = true;
};

const handleImageContextMenu = () => {
  // Standard mode - focus moves to menu
  isTransient.value = false;
  showFlyout.value = true;
};

const handleCommand = (command) => {
  selectedOption.value = \`You clicked: \${command}\`;
  showFlyout.value = false;
};

const handleFlyoutClosed = () => {
  showFlyout.value = false;
};`;
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
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
