<template>
  <div>
    <div class="page-heading">
      <WinTextBlock class="page-header" Text="MenuBar" />
      <WinTextBlock class="page-description" Text="The MenuBar simplifies the creation of basic menu systems for apps. It works out of the box with little customization, supports keyboard accelerators, and automatically adjusts UI for different input types and devices." TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
        <WinToggleButton v-model="isFavoriteState" class="header-action" subtle @update:modelValue="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinControlExample class="basic-input-example-theme" headerText="A simple MenuBar" :theme="pageTheme" :vue="simpleCode">
      <template #example>
        <div class="sample-stack">
          <WinTextBlock :Text="simpleOutput" />
          <WinMenuBar :items="simpleItems" :theme="pageTheme" @itemClick="simpleOutput = `You clicked: ${$event.item.text}`" />
        </div>
      </template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuBar with keyboard accelerators" :theme="pageTheme" :vue="acceleratorCode">
      <template #example>
        <div class="sample-stack">
          <WinTextBlock :Text="acceleratorOutput" />
          <WinMenuBar :items="acceleratorItems" :theme="pageTheme" @itemClick="acceleratorOutput = `You clicked: ${$event.item.text}`" />
        </div>
      </template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuBar with submenus, separators, and radio menu items" :theme="pageTheme" :vue="submenuCode">
      <template #example>
        <div class="sample-stack">
          <WinTextBlock :Text="submenuOutput" />
          <WinMenuBar :items="submenuItems" :theme="pageTheme" @itemClick="submenuOutput = `You clicked: ${$event.item.text}`" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinMenuBar from '../components/WinMenuBar.vue';
import WinTextBlock from '../components/WinTextBlock.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { createPageState } from '../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'menubar');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const simpleOutput = ref('You clicked:');
const acceleratorOutput = ref('You clicked:');
const submenuOutput = ref('You clicked:');

const baseMenus = [
  { title: 'File', items: [{ text: 'New' }, { text: 'Open' }, { text: 'Save' }, { text: 'Exit' }] },
  { title: 'Edit', items: [{ text: 'Undo' }, { text: 'Cut' }, { text: 'Copy' }, { text: 'Paste' }] },
  { title: 'Help', items: [{ text: 'About' }] }
];

const simpleItems = baseMenus;
const acceleratorItems = [
  { title: 'File', items: [{ text: 'New', keyboardAccelerator: { key: 'N', modifiers: ['Control'] } }, { text: 'Open', keyboardAccelerator: { key: 'O', modifiers: ['Control'] } }, { text: 'Save', keyboardAccelerator: { key: 'S', modifiers: ['Control'] } }, { text: 'Exit', keyboardAccelerator: { key: 'E', modifiers: ['Control'] } }] },
  { title: 'Edit', items: [{ text: 'Undo', keyboardAccelerator: { key: 'Z', modifiers: ['Control'] } }, { text: 'Cut', keyboardAccelerator: { key: 'X', modifiers: ['Control'] } }, { text: 'Copy', keyboardAccelerator: { key: 'C', modifiers: ['Control'] } }, { text: 'Paste', keyboardAccelerator: { key: 'V', modifiers: ['Control'] } }] },
  { title: 'Help', items: [{ text: 'About', keyboardAccelerator: { key: 'I', modifiers: ['Control'] } }] }
];
const submenuItems = ref([
  {
    title: 'File',
    items: [
      { type: 'submenu', text: 'New', items: [{ text: 'Plain Text Document' }, { text: 'Rich Text Document' }, { text: 'Other Formats' }] },
      { text: 'Open' },
      { text: 'Save' },
      { type: 'separator' },
      { text: 'Exit' }
    ]
  },
  { title: 'Edit', items: [{ text: 'Undo' }, { text: 'Cut' }, { text: 'Copy' }, { text: 'Paste' }] },
  {
    title: 'View',
    items: [
      { text: 'Output' },
      { type: 'separator' },
      { type: 'radio', text: 'Landscape', groupName: 'orientation', isChecked: false },
      { type: 'radio', text: 'Portrait', groupName: 'orientation', isChecked: true },
      { type: 'separator' },
      { type: 'radio', text: 'Small icons', groupName: 'size', isChecked: false },
      { type: 'radio', text: 'Medium icons', groupName: 'size', isChecked: true },
      { type: 'radio', text: 'Large icons', groupName: 'size', isChecked: false }
    ]
  },
  { title: 'Help', items: [{ text: 'About' }] }
]);

const simpleCode = `<WinTextBlock :Text="output" />
<WinMenuBar :items="menuItems" @itemClick="output = \`You clicked: \${$event.item.text}\`" />`;
const acceleratorCode = `<WinMenuBar :items="menuItemsWithKeyboardAccelerators" />`;
const submenuCode = `<WinMenuBar :items="menuItemsWithSubmenusAndRadioItems" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets"; font-size: 16px; }
.sample-stack { width: 100%; display: flex; flex-direction: column; gap: 8px; }
</style>
