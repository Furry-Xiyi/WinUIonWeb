<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">MenuFlyout</h1>
      <p class="page-description">
        A MenuFlyout displays a lightweight menu of commands that can be attached to buttons and other controls. Use MenuFlyout to show options, actions, or commands related to a specific UI element.
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

    <!-- Example 1: AppBarButton with MenuFlyout -->
    <WinControlExample
      headerText="AppBarButton with MenuFlyout"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div style="display: flex; align-items: center; gap: 16px;">
          <WinAppBarButton
            icon="&#xE8CB;"
            label="Sort"
            :isCompact="true"
            @click="toggleSortMenu">
          </WinAppBarButton>
          <WinMenuFlyout
            :open="sortMenuOpen"
            :anchorRect="sortAnchorRect"
            :items="sortItems"
            @close="sortMenuOpen = false"
            @select="onSortSelect">
          </WinMenuFlyout>
          <p class="output-text">{{ sortOutput }}</p>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: MenuFlyout with ToggleMenuFlyoutItem and Separator -->
    <WinControlExample
      headerText="MenuFlyout with toggle items"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <WinButton @click="toggleOptionsMenu">
            Options
          </WinButton>
          <WinMenuFlyout
            :open="optionsMenuOpen"
            :anchorRect="optionsAnchorRect"
            @close="optionsMenuOpen = false">
            <div class="win-menu-flyout-item" @click="onResetClick">
              <span>Reset</span>
            </div>
            <div class="win-menu-flyout-separator"></div>
            <div class="win-menu-flyout-item toggle-item" @click="repeatChecked = !repeatChecked">
              <span class="icon toggle-icon">{{ repeatChecked ? '&#xE73E;' : '' }}</span>
              <span>Repeat</span>
            </div>
            <div class="win-menu-flyout-item toggle-item" @click="shuffleChecked = !shuffleChecked">
              <span class="icon toggle-icon">{{ shuffleChecked ? '&#xE73E;' : '' }}</span>
              <span>Shuffle</span>
            </div>
          </WinMenuFlyout>
          <p class="output-text">Repeat: {{ repeatChecked }}, Shuffle: {{ shuffleChecked }}</p>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 3: MenuFlyout with cascading submenus -->
    <WinControlExample
      headerText="MenuFlyout with cascading menus"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <WinButton @click="toggleFileMenu">
            File Options
          </WinButton>
          <WinMenuFlyout
            :open="fileMenuOpen"
            :anchorRect="fileAnchorRect"
            @close="closeAllMenus">
            <div class="win-menu-flyout-item" @click="onFileAction('Open')">
              <span>Open</span>
            </div>
            <div
              class="win-menu-flyout-item submenu-item"
              @click="toggleSendToMenu"
              @mouseenter="onSendToHover">
              <span>Send to</span>
              <span class="icon chevron-right">&#xE76C;</span>
            </div>
          </WinMenuFlyout>

          <!-- Send to submenu -->
          <WinMenuFlyout
            :open="sendToMenuOpen"
            :anchorRect="sendToAnchorRect"
            alignment="right"
            @close="sendToMenuOpen = false">
            <div class="win-menu-flyout-item" @click="onFileAction('Bluetooth')">
              <span>Bluetooth</span>
            </div>
            <div class="win-menu-flyout-item" @click="onFileAction('Desktop (shortcut)')">
              <span>Desktop (shortcut)</span>
            </div>
            <div
              class="win-menu-flyout-item submenu-item"
              @click="toggleCompressMenu"
              @mouseenter="onCompressHover">
              <span>Compressed file</span>
              <span class="icon chevron-right">&#xE76C;</span>
            </div>
          </WinMenuFlyout>

          <!-- Compress submenu -->
          <WinMenuFlyout
            :open="compressMenuOpen"
            :anchorRect="compressAnchorRect"
            alignment="right"
            @close="compressMenuOpen = false">
            <div class="win-menu-flyout-item" @click="onFileAction('Compress and email')">
              <span>Compress and email</span>
            </div>
            <div class="win-menu-flyout-item" @click="onFileAction('Compress to .7z')">
              <span>Compress to .7z</span>
            </div>
            <div class="win-menu-flyout-item" @click="onFileAction('Compress to .zip')">
              <span>Compress to .zip</span>
            </div>
          </WinMenuFlyout>

          <p class="output-text">{{ fileOutput }}</p>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 4: MenuFlyout with icons -->
    <WinControlExample
      headerText="MenuFlyout with icons"
      :theme="pageTheme"
      :templateCode="example4Template"
      :vueCode="example4Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <WinButton @click="toggleEditMenu">
            Edit Options
          </WinButton>
          <WinMenuFlyout
            :open="editMenuOpen"
            :anchorRect="editAnchorRect"
            @close="editMenuOpen = false">
            <div class="win-menu-flyout-item" @click="onEditAction('Share')">
              <span class="icon win-menu-flyout-icon">&#xE72D;</span>
              <span>Share</span>
            </div>
            <div class="win-menu-flyout-item" @click="onEditAction('Copy')">
              <span class="icon win-menu-flyout-icon">&#xE8C8;</span>
              <span>Copy</span>
            </div>
            <div class="win-menu-flyout-item" @click="onEditAction('Delete')">
              <span class="icon win-menu-flyout-icon">&#xE74D;</span>
              <span>Delete</span>
            </div>
            <div class="win-menu-flyout-separator"></div>
            <div class="win-menu-flyout-item" @click="onEditAction('Rename')">
              <span>Rename</span>
            </div>
            <div class="win-menu-flyout-item" @click="onEditAction('Select')">
              <span>Select</span>
            </div>
          </WinMenuFlyout>
          <p class="output-text">{{ editOutput }}</p>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 5: MenuFlyout with keyboard accelerators -->
    <WinControlExample
      headerText="MenuFlyout with keyboard accelerators"
      :theme="pageTheme"
      :templateCode="example5Template"
      :vueCode="example5Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <WinButton @click="toggleAccelMenu">
            Edit Options
          </WinButton>
          <WinMenuFlyout
            :open="accelMenuOpen"
            :anchorRect="accelAnchorRect"
            @close="accelMenuOpen = false">
            <div class="win-menu-flyout-item" @click="onAccelAction('Share')">
              <span class="icon win-menu-flyout-icon">&#xE72D;</span>
              <span style="flex: 1;">Share</span>
              <span class="accelerator">Ctrl+S</span>
            </div>
            <div class="win-menu-flyout-item" @click="onAccelAction('Copy')">
              <span class="icon win-menu-flyout-icon">&#xE8C8;</span>
              <span style="flex: 1;">Copy</span>
              <span class="accelerator">Ctrl+C</span>
            </div>
            <div class="win-menu-flyout-item" @click="onAccelAction('Delete')">
              <span class="icon win-menu-flyout-icon">&#xE74D;</span>
              <span style="flex: 1;">Delete</span>
              <span class="accelerator">Delete</span>
            </div>
            <div class="win-menu-flyout-separator"></div>
            <div class="win-menu-flyout-item" @click="onAccelAction('Rename')">
              <span>Rename</span>
            </div>
            <div class="win-menu-flyout-item" @click="onAccelAction('Select')">
              <span>Select</span>
            </div>
          </WinMenuFlyout>
          <p class="output-text">{{ accelOutput }}</p>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 6: MenuFlyout with RadioMenuFlyoutItem -->
    <WinControlExample
      headerText="MenuFlyout with radio items"
      :theme="pageTheme"
      :templateCode="example6Template"
      :vueCode="example6Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <WinButton @click="toggleRadioMenu">
            Options
          </WinButton>
          <WinMenuFlyout
            :open="radioMenuOpen"
            :anchorRect="radioAnchorRect"
            @close="radioMenuOpen = false">
            <div class="win-menu-flyout-item radio-item" @click="orientation = 'Landscape'">
              <span class="icon radio-icon">{{ orientation === 'Landscape' ? '&#xE73E;' : '&#xE739;' }}</span>
              <span>Landscape</span>
            </div>
            <div class="win-menu-flyout-item radio-item" @click="orientation = 'Portrait'">
              <span class="icon radio-icon">{{ orientation === 'Portrait' ? '&#xE73E;' : '&#xE739;' }}</span>
              <span>Portrait</span>
            </div>
            <div class="win-menu-flyout-separator"></div>
            <div class="win-menu-flyout-item radio-item" @click="iconSize = 'Small'">
              <span class="icon radio-icon">{{ iconSize === 'Small' ? '&#xE73E;' : '&#xE739;' }}</span>
              <span>Small icons</span>
            </div>
            <div class="win-menu-flyout-item radio-item" @click="iconSize = 'Medium'">
              <span class="icon radio-icon">{{ iconSize === 'Medium' ? '&#xE73E;' : '&#xE739;' }}</span>
              <span>Medium icons</span>
            </div>
            <div class="win-menu-flyout-item radio-item" @click="iconSize = 'Large'">
              <span class="icon radio-icon">{{ iconSize === 'Large' ? '&#xE73E;' : '&#xE739;' }}</span>
              <span>Large icons</span>
            </div>
          </WinMenuFlyout>
          <p class="output-text">Orientation: {{ orientation }}, Icon size: {{ iconSize }}</p>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, nextTick } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinAppBarButton from '../components/WinAppBarButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinMenuFlyout from '../components/WinMenuFlyout.vue';
import WinControlExample from '../components/WinControlExample.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'menuflyout');

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

// Example 1: Sort menu
const sortMenuOpen = ref(false);
const sortAnchorRect = ref(null);
const sortOutput = ref('');
const sortItems = [
  { label: 'By rating', value: 'rating' },
  { label: 'By match', value: 'match' },
  { label: 'By distance', value: 'distance' }
];

const toggleSortMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  sortAnchorRect.value = rect;
  sortMenuOpen.value = !sortMenuOpen.value;
};

const onSortSelect = (item) => {
  sortOutput.value = `Sorted by ${item.label.toLowerCase()}`;
  sortMenuOpen.value = false;
};

const example1Template = `<WinAppBarButton
  icon="&#xE8CB;"
  label="Sort"
  :isCompact="true"
  @click="toggleSortMenu">
</WinAppBarButton>
<WinMenuFlyout
  :open="sortMenuOpen"
  :anchorRect="sortAnchorRect"
  :items="sortItems"
  @close="sortMenuOpen = false"
  @select="onSortSelect">
</WinMenuFlyout>`;

const example1Vue = `const sortMenuOpen = ref(false);
const sortAnchorRect = ref(null);
const sortItems = [
  { label: 'By rating', value: 'rating' },
  { label: 'By match', value: 'match' },
  { label: 'By distance', value: 'distance' }
];

const toggleSortMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  sortAnchorRect.value = rect;
  sortMenuOpen.value = !sortMenuOpen.value;
};

const onSortSelect = (item) => {
  console.log('Sorted by', item.label);
  sortMenuOpen.value = false;
};`;

// Example 2: Options menu with toggles
const optionsMenuOpen = ref(false);
const optionsAnchorRect = ref(null);
const repeatChecked = ref(true);
const shuffleChecked = ref(true);

const toggleOptionsMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  optionsAnchorRect.value = rect;
  optionsMenuOpen.value = !optionsMenuOpen.value;
};

const onResetClick = () => {
  repeatChecked.value = false;
  shuffleChecked.value = false;
  optionsMenuOpen.value = false;
};

const example2Template = `<WinButton @click="toggleOptionsMenu">
  Options
</WinButton>
<WinMenuFlyout
  :open="optionsMenuOpen"
  :anchorRect="optionsAnchorRect"
  @close="optionsMenuOpen = false">
  <div class="win-menu-flyout-item" @click="onResetClick">
    <span>Reset</span>
  </div>
  <div class="win-menu-flyout-separator"></div>
  <div class="win-menu-flyout-item toggle-item" @click="repeatChecked = !repeatChecked">
    <span class="icon">{{ repeatChecked ? '&#xE73E;' : '' }}</span>
    <span>Repeat</span>
  </div>
  <div class="win-menu-flyout-item toggle-item" @click="shuffleChecked = !shuffleChecked">
    <span class="icon">{{ shuffleChecked ? '&#xE73E;' : '' }}</span>
    <span>Shuffle</span>
  </div>
</WinMenuFlyout>`;

const example2Vue = `const optionsMenuOpen = ref(false);
const optionsAnchorRect = ref(null);
const repeatChecked = ref(true);
const shuffleChecked = ref(true);

const toggleOptionsMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  optionsAnchorRect.value = rect;
  optionsMenuOpen.value = !optionsMenuOpen.value;
};

const onResetClick = () => {
  repeatChecked.value = false;
  shuffleChecked.value = false;
  optionsMenuOpen.value = false;
};`;

// Example 3: Cascading menus
const fileMenuOpen = ref(false);
const fileAnchorRect = ref(null);
const sendToMenuOpen = ref(false);
const sendToAnchorRect = ref(null);
const compressMenuOpen = ref(false);
const compressAnchorRect = ref(null);
const fileOutput = ref('');

const toggleFileMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  fileAnchorRect.value = rect;
  fileMenuOpen.value = !fileMenuOpen.value;
};

const toggleSendToMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  sendToAnchorRect.value = rect;
  sendToMenuOpen.value = !sendToMenuOpen.value;
};

const onSendToHover = (event) => {
  const rect = event.target.getBoundingClientRect();
  sendToAnchorRect.value = rect;
  sendToMenuOpen.value = true;
  compressMenuOpen.value = false;
};

const toggleCompressMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  compressAnchorRect.value = rect;
  compressMenuOpen.value = !compressMenuOpen.value;
};

const onCompressHover = (event) => {
  const rect = event.target.getBoundingClientRect();
  compressAnchorRect.value = rect;
  compressMenuOpen.value = true;
};

const onFileAction = (action) => {
  fileOutput.value = `Action: ${action}`;
  closeAllMenus();
};

const closeAllMenus = () => {
  fileMenuOpen.value = false;
  sendToMenuOpen.value = false;
  compressMenuOpen.value = false;
};

const example3Template = `<WinButton @click="toggleFileMenu">
  File Options
</WinButton>
<WinMenuFlyout
  :open="fileMenuOpen"
  :anchorRect="fileAnchorRect"
  @close="closeAllMenus">
  <div class="win-menu-flyout-item" @click="onFileAction('Open')">
    <span>Open</span>
  </div>
  <div class="win-menu-flyout-item submenu-item"
       @mouseenter="onSendToHover">
    <span>Send to</span>
    <span class="icon chevron-right">&#xE76C;</span>
  </div>
</WinMenuFlyout>`;

const example3Vue = `const fileMenuOpen = ref(false);
const fileAnchorRect = ref(null);
const sendToMenuOpen = ref(false);
const sendToAnchorRect = ref(null);

const toggleFileMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  fileAnchorRect.value = rect;
  fileMenuOpen.value = !fileMenuOpen.value;
};

const onSendToHover = (event) => {
  const rect = event.target.getBoundingClientRect();
  sendToAnchorRect.value = rect;
  sendToMenuOpen.value = true;
};

const onFileAction = (action) => {
  console.log('Action:', action);
  fileMenuOpen.value = false;
  sendToMenuOpen.value = false;
};`;

// Example 4: Menu with icons
const editMenuOpen = ref(false);
const editAnchorRect = ref(null);
const editOutput = ref('');

const toggleEditMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  editAnchorRect.value = rect;
  editMenuOpen.value = !editMenuOpen.value;
};

const onEditAction = (action) => {
  editOutput.value = `Action: ${action}`;
  editMenuOpen.value = false;
};

const example4Template = `<WinButton @click="toggleEditMenu">
  Edit Options
</WinButton>
<WinMenuFlyout
  :open="editMenuOpen"
  :anchorRect="editAnchorRect"
  @close="editMenuOpen = false">
  <div class="win-menu-flyout-item" @click="onEditAction('Share')">
    <span class="icon win-menu-flyout-icon">&#xE72D;</span>
    <span>Share</span>
  </div>
  <div class="win-menu-flyout-item" @click="onEditAction('Copy')">
    <span class="icon win-menu-flyout-icon">&#xE8C8;</span>
    <span>Copy</span>
  </div>
  <div class="win-menu-flyout-separator"></div>
  <div class="win-menu-flyout-item" @click="onEditAction('Rename')">
    <span>Rename</span>
  </div>
</WinMenuFlyout>`;

const example4Vue = `const editMenuOpen = ref(false);
const editAnchorRect = ref(null);

const toggleEditMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  editAnchorRect.value = rect;
  editMenuOpen.value = !editMenuOpen.value;
};

const onEditAction = (action) => {
  console.log('Action:', action);
  editMenuOpen.value = false;
};`;

// Example 5: Menu with keyboard accelerators
const accelMenuOpen = ref(false);
const accelAnchorRect = ref(null);
const accelOutput = ref('');

const toggleAccelMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  accelAnchorRect.value = rect;
  accelMenuOpen.value = !accelMenuOpen.value;
};

const onAccelAction = (action) => {
  accelOutput.value = `Action: ${action}`;
  accelMenuOpen.value = false;
};

const example5Template = `<WinButton @click="toggleAccelMenu">
  Edit Options
</WinButton>
<WinMenuFlyout
  :open="accelMenuOpen"
  :anchorRect="accelAnchorRect"
  @close="accelMenuOpen = false">
  <div class="win-menu-flyout-item" @click="onAccelAction('Share')">
    <span class="icon win-menu-flyout-icon">&#xE72D;</span>
    <span style="flex: 1;">Share</span>
    <span class="accelerator">Ctrl+S</span>
  </div>
  <div class="win-menu-flyout-item" @click="onAccelAction('Copy')">
    <span class="icon win-menu-flyout-icon">&#xE8C8;</span>
    <span style="flex: 1;">Copy</span>
    <span class="accelerator">Ctrl+C</span>
  </div>
</WinMenuFlyout>`;

const example5Vue = `const accelMenuOpen = ref(false);
const accelAnchorRect = ref(null);

const toggleAccelMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  accelAnchorRect.value = rect;
  accelMenuOpen.value = !accelMenuOpen.value;
};

const onAccelAction = (action) => {
  console.log('Action:', action);
  accelMenuOpen.value = false;
};`;

// Example 6: Radio menu items
const radioMenuOpen = ref(false);
const radioAnchorRect = ref(null);
const orientation = ref('Portrait');
const iconSize = ref('Medium');

const toggleRadioMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  radioAnchorRect.value = rect;
  radioMenuOpen.value = !radioMenuOpen.value;
};

const example6Template = `<WinButton @click="toggleRadioMenu">
  Options
</WinButton>
<WinMenuFlyout
  :open="radioMenuOpen"
  :anchorRect="radioAnchorRect"
  @close="radioMenuOpen = false">
  <div class="win-menu-flyout-item radio-item" @click="orientation = 'Landscape'">
    <span class="icon radio-icon">{{ orientation === 'Landscape' ? '&#xE73E;' : '&#xE739;' }}</span>
    <span>Landscape</span>
  </div>
  <div class="win-menu-flyout-item radio-item" @click="orientation = 'Portrait'">
    <span class="icon radio-icon">{{ orientation === 'Portrait' ? '&#xE73E;' : '&#xE739;' }}</span>
    <span>Portrait</span>
  </div>
  <div class="win-menu-flyout-separator"></div>
  <div class="win-menu-flyout-item radio-item" @click="iconSize = 'Small'">
    <span class="icon radio-icon">{{ iconSize === 'Small' ? '&#xE73E;' : '&#xE739;' }}</span>
    <span>Small icons</span>
  </div>
</WinMenuFlyout>`;

const example6Vue = `const radioMenuOpen = ref(false);
const radioAnchorRect = ref(null);
const orientation = ref('Portrait');
const iconSize = ref('Medium');

const toggleRadioMenu = (event) => {
  const rect = event.target.getBoundingClientRect();
  radioAnchorRect.value = rect;
  radioMenuOpen.value = !radioMenuOpen.value;
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

.submenu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chevron-right {
  margin-left: 12px;
  font-size: 12px;
  opacity: 0.6;
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-icon {
  width: 16px;
  min-width: 16px;
  text-align: center;
  font-size: 12px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-icon {
  width: 16px;
  min-width: 16px;
  text-align: center;
  font-size: 12px;
}

.accelerator {
  margin-left: 24px;
  font-size: 12px;
  opacity: 0.6;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
</style>
