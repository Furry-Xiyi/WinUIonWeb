<template>
  <div>
    <div class="page-heading">
      <WinTextBlock class="page-header" Text="MenuFlyout" />
      <WinTextBlock class="page-description" Text="A MenuFlyout displays a lightweight menu of commands that can be attached to buttons and other controls." TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
        <WinToggleButton v-model="isFavoriteState" class="header-action" subtle @update:modelValue="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout attached to an AppBarButton" :theme="pageTheme" :vue="sortCode">
      <template #example>
        <div class="sample-row">
          <WinAppBarButton icon="&#xE8CB;" label="Sort" :isCompact="true" @click="openMenu($event, sortMenu)" />
          <WinTextBlock :Text="sortOutput" />
        </div>
      </template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with toggle items" :theme="pageTheme" :vue="toggleCode">
      <template #example>
        <div class="sample-stack">
          <WinButton @click="openMenu($event, optionsMenu)"><WinTextBlock Text="Options" /></WinButton>
          <WinTextBlock :Text="`Repeat: ${repeatChecked}, Shuffle: ${shuffleChecked}`" />
        </div>
      </template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with cascading submenus" :theme="pageTheme" :vue="cascadeCode">
      <template #example>
        <div class="sample-stack">
          <WinButton @click="openMenu($event, fileMenu)"><WinTextBlock Text="File Options" /></WinButton>
          <WinTextBlock :Text="fileOutput" />
        </div>
      </template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with split menu items" :theme="pageTheme" :vue="splitCode">
      <template #example>
        <div class="sample-stack">
          <WinSplitButton :options="['Save', 'Share']" :theme="pageTheme" @click="splitOutput = 'You clicked: Save'" @select="splitOutput = `You clicked: ${$event}`">
            <WinTextBlock Text="Save" />
          </WinSplitButton>
          <WinTextBlock :Text="splitOutput" />
        </div>
      </template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with icons" :theme="pageTheme" :vue="iconCode">
      <template #example>
        <div class="sample-stack">
          <WinButton @click="openMenu($event, editMenu)"><WinTextBlock Text="Edit Options" /></WinButton>
          <WinTextBlock :Text="editOutput" />
        </div>
      </template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with keyboard accelerators" :theme="pageTheme" :vue="acceleratorCode">
      <template #example>
        <div class="sample-stack">
          <WinButton @click="openMenu($event, accelMenu)"><WinTextBlock Text="Edit Options" /></WinButton>
          <WinTextBlock :Text="accelOutput" />
        </div>
      </template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with radio items" :theme="pageTheme" :vue="radioCode">
      <template #example>
        <div class="sample-stack">
          <WinButton @click="openMenu($event, radioMenu)"><WinTextBlock Text="Options" /></WinButton>
          <WinTextBlock :Text="`Orientation: ${orientation}, Icon size: ${iconSize}`" />
        </div>
      </template>
    </WinControlExample>

    <WinMenuFlyout :open="sortMenu.open" :anchorRect="sortMenu.anchor" :items="sortItems" :theme="pageTheme" @close="sortMenu.open = false" @select="onSortSelect" />

    <WinMenuFlyout :open="optionsMenu.open" :anchorRect="optionsMenu.anchor" :theme="pageTheme" @close="optionsMenu.open = false">
      <button class="menu-item-button" @click="resetOptions"><WinTextBlock Text="Reset" /></button>
      <div class="menu-separator"></div>
      <button class="menu-item-button" @click="repeatChecked = !repeatChecked"><span class="icon check-icon">{{ repeatChecked ? '&#xE73E;' : '' }}</span><WinTextBlock Text="Repeat" /></button>
      <button class="menu-item-button" @click="shuffleChecked = !shuffleChecked"><span class="icon check-icon">{{ shuffleChecked ? '&#xE73E;' : '' }}</span><WinTextBlock Text="Shuffle" /></button>
    </WinMenuFlyout>

    <WinMenuFlyout :open="fileMenu.open" :anchorRect="fileMenu.anchor" :theme="pageTheme" @close="closeCascade">
      <button class="menu-item-button" @mouseenter="closeCascadeBelow(1)" @click="chooseFile('Open')"><WinTextBlock Text="Open" /></button>
      <button class="menu-item-button" @mouseenter="openSubmenu($event, sendToMenu, compressMenu)" @click="openSubmenu($event, sendToMenu, compressMenu)">
        <WinTextBlock Text="Send to" /><span class="icon chevron">&#xE76C;</span>
      </button>
    </WinMenuFlyout>
    <WinMenuFlyout :open="sendToMenu.open" :anchorRect="sendToMenu.anchor" alignment="left" :theme="pageTheme" @close="closeCascade">
      <button class="menu-item-button" @mouseenter="closeCascadeBelow(2)" @click="chooseFile('Bluetooth')"><WinTextBlock Text="Bluetooth" /></button>
      <button class="menu-item-button" @mouseenter="closeCascadeBelow(2)" @click="chooseFile('Desktop (shortcut)')"><WinTextBlock Text="Desktop (shortcut)" /></button>
      <button class="menu-item-button" @mouseenter="openSubmenu($event, compressMenu)" @click="openSubmenu($event, compressMenu)">
        <WinTextBlock Text="Compressed file" /><span class="icon chevron">&#xE76C;</span>
      </button>
    </WinMenuFlyout>
    <WinMenuFlyout :open="compressMenu.open" :anchorRect="compressMenu.anchor" alignment="left" :theme="pageTheme" @close="closeCascade">
      <button class="menu-item-button" @click="chooseFile('Compress and email')"><WinTextBlock Text="Compress and email" /></button>
      <button class="menu-item-button" @click="chooseFile('Compress to .7z')"><WinTextBlock Text="Compress to .7z" /></button>
      <button class="menu-item-button" @click="chooseFile('Compress to .zip')"><WinTextBlock Text="Compress to .zip" /></button>
    </WinMenuFlyout>

    <WinMenuFlyout :open="editMenu.open" :anchorRect="editMenu.anchor" :theme="pageTheme" @close="editMenu.open = false">
      <template v-for="item in iconItems" :key="item.label || 'separator'">
        <div v-if="item.type === 'separator'" class="menu-separator"></div>
        <button v-else class="menu-item-button" @click="chooseEdit(item.label)">
          <span v-if="item.icon" class="icon flyout-icon">{{ item.icon }}</span><WinTextBlock :Text="item.label" />
        </button>
      </template>
    </WinMenuFlyout>

    <WinMenuFlyout :open="accelMenu.open" :anchorRect="accelMenu.anchor" :theme="pageTheme" @close="accelMenu.open = false">
      <template v-for="item in accelItems" :key="item.label || 'separator'">
        <div v-if="item.type === 'separator'" class="menu-separator"></div>
        <button v-else class="menu-item-button" @click="chooseAccel(item.label)">
          <span v-if="item.icon" class="icon flyout-icon">{{ item.icon }}</span><WinTextBlock class="menu-label" :Text="item.label" /><WinTextBlock v-if="item.key" class="accelerator" :Text="item.key" />
        </button>
      </template>
    </WinMenuFlyout>

    <WinMenuFlyout :open="radioMenu.open" :anchorRect="radioMenu.anchor" :theme="pageTheme" @close="radioMenu.open = false">
      <button class="menu-item-button" @click="orientation = 'Landscape'"><span class="icon check-icon">{{ orientation === 'Landscape' ? '&#xE73E;' : '' }}</span><WinTextBlock Text="Landscape" /></button>
      <button class="menu-item-button" @click="orientation = 'Portrait'"><span class="icon check-icon">{{ orientation === 'Portrait' ? '&#xE73E;' : '' }}</span><WinTextBlock Text="Portrait" /></button>
      <div class="menu-separator"></div>
      <button class="menu-item-button" @click="iconSize = 'Small'"><span class="icon check-icon">{{ iconSize === 'Small' ? '&#xE73E;' : '' }}</span><WinTextBlock Text="Small icons" /></button>
      <button class="menu-item-button" @click="iconSize = 'Medium'"><span class="icon check-icon">{{ iconSize === 'Medium' ? '&#xE73E;' : '' }}</span><WinTextBlock Text="Medium icons" /></button>
      <button class="menu-item-button" @click="iconSize = 'Large'"><span class="icon check-icon">{{ iconSize === 'Large' ? '&#xE73E;' : '' }}</span><WinTextBlock Text="Large icons" /></button>
    </WinMenuFlyout>
  </div>
</template>

<script setup>
import { computed, inject, reactive, ref } from 'vue';
import WinAppBarButton from '../components/WinAppBarButton.vue';
import WinButton from '../components/WinButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinMenuFlyout from '../components/WinMenuFlyout.vue';
import WinSplitButton from '../components/WinSplitButton.vue';
import WinTextBlock from '../components/WinTextBlock.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { createPageState } from '../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'menuflyout');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const makeMenu = () => reactive({ open: false, anchor: null });
const sortMenu = makeMenu();
const optionsMenu = makeMenu();
const fileMenu = makeMenu();
const sendToMenu = makeMenu();
const compressMenu = makeMenu();
const editMenu = makeMenu();
const accelMenu = makeMenu();
const radioMenu = makeMenu();

const sortOutput = ref('');
const fileOutput = ref('');
const splitOutput = ref('');
const editOutput = ref('');
const accelOutput = ref('');
const repeatChecked = ref(true);
const shuffleChecked = ref(true);
const orientation = ref('Portrait');
const iconSize = ref('Medium');

const sortItems = [{ label: 'By rating' }, { label: 'By match' }, { label: 'By distance' }];
const iconItems = [
  { label: 'Share', icon: '\uE72D' },
  { label: 'Copy', icon: '\uE8C8' },
  { label: 'Delete', icon: '\uE74D' },
  { type: 'separator' },
  { label: 'Rename' },
  { label: 'Select' }
];
const accelItems = [
  { label: 'Share', icon: '\uE72D', key: 'Ctrl+S' },
  { label: 'Copy', icon: '\uE8C8', key: 'Ctrl+C' },
  { label: 'Delete', icon: '\uE74D', key: 'Delete' },
  { type: 'separator' },
  { label: 'Rename' },
  { label: 'Select' }
];

const allMenus = [sortMenu, optionsMenu, fileMenu, sendToMenu, compressMenu, editMenu, accelMenu, radioMenu];
const openMenu = (event, menu) => {
  allMenus.forEach((item) => { if (item !== menu) item.open = false; });
  menu.anchor = event.currentTarget.getBoundingClientRect();
  menu.open = !menu.open;
};
const openSubmenu = (event, menu, closeMenu) => {
  if (closeMenu) closeMenu.open = false;
  const rect = event.currentTarget.getBoundingClientRect();
  menu.anchor = {
    top: rect.top,
    bottom: rect.top,
    left: rect.right,
    right: rect.right,
    width: 0,
    height: 0
  };
  menu.open = true;
};
const closeCascade = () => {
  fileMenu.open = false;
  sendToMenu.open = false;
  compressMenu.open = false;
};
const closeCascadeBelow = (level) => {
  if (level <= 1) sendToMenu.open = false;
  if (level <= 2) compressMenu.open = false;
};
const onSortSelect = (item) => {
  sortOutput.value = `Sorted by ${item.label.toLowerCase()}`;
  sortMenu.open = false;
};
const resetOptions = () => {
  repeatChecked.value = false;
  shuffleChecked.value = false;
  optionsMenu.open = false;
};
const chooseFile = (label) => {
  fileOutput.value = `Action: ${label}`;
  closeCascade();
};
const chooseEdit = (label) => {
  editOutput.value = `Action: ${label}`;
  editMenu.open = false;
};
const chooseAccel = (label) => {
  accelOutput.value = `Action: ${label}`;
  accelMenu.open = false;
};

const sortCode = `<WinAppBarButton icon="&#xE8CB;" label="Sort" :isCompact="true" />`;
const toggleCode = `<WinButton><WinTextBlock Text="Options" /></WinButton>`;
const cascadeCode = `<WinButton><WinTextBlock Text="File Options" /></WinButton>`;
const splitCode = `<WinSplitButton :options="['Save', 'Share']">
  <WinTextBlock Text="Save" />
</WinSplitButton>`;
const iconCode = `<WinButton><WinTextBlock Text="Edit Options" /></WinButton>`;
const acceleratorCode = `<WinButton><WinTextBlock Text="Edit Options" /></WinButton>`;
const radioCode = `<WinButton><WinTextBlock Text="Options" /></WinButton>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets"; font-size: 16px; }
.sample-row { display: flex; align-items: center; gap: 16px; }
.sample-stack { display: flex; flex-direction: column; gap: 8px; }
.menu-item-button { width: 100%; min-height: 32px; padding: 6px 12px; border: 0; border-radius: 4px; background: transparent; color: var(--text-primary); display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer; }
.menu-item-button:hover { background: var(--subtle-secondary); }
.menu-item-button:active { background: var(--subtle-tertiary); color: var(--text-secondary); }
.menu-label { flex: 1; }
.flyout-icon, .check-icon { width: 16px; min-width: 16px; text-align: center; }
.accelerator { margin-left: 24px; color: var(--text-secondary); font-size: 12px; }
.chevron { margin-left: auto; font-size: 12px; }
.menu-separator { height: 1px; margin: 4px 0; background: var(--flyout-border, var(--stroke-divider)); }
</style>
