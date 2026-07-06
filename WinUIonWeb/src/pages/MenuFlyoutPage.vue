<template>
  <div>
    <div class="page-heading">
      <WinTextBlock class="page-header" Text="MenuFlyout" />
      <WinTextBlock class="page-description" Text="A MenuFlyout displays a lightweight menu of commands that can be attached to buttons and other controls." TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
        <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout attached to an AppBarButton" :theme="pageTheme" :vue="sortCode">
      <template #example>
        <div class="sample-row">
          <WinAppBarButton icon="&#xE8CB;" label="Sort" :isCompact="true" @click="openMenu($event, sortMenu)" />
        </div>
      </template>
      <template #options><WinTextBlock :Text="sortOutput" TextWrapping="WrapWholeWords" /></template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with toggle items" :theme="pageTheme" :vue="toggleCode">
      <template #example>
        <div class="sample-stack">
          <WinButton @click="openMenu($event, optionsMenu)"><WinTextBlock Text="Options" /></WinButton>
        </div>
      </template>
      <template #options><WinTextBlock :Text="`Repeat: ${repeatChecked}, Shuffle: ${shuffleChecked}`" TextWrapping="WrapWholeWords" /></template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with cascading submenus" :theme="pageTheme" :vue="cascadeCode">
      <template #example>
        <div class="sample-stack">
          <WinButton @click="openMenu($event, fileMenu)"><WinTextBlock Text="File Options" /></WinButton>
        </div>
      </template>
      <template #options><WinTextBlock :Text="fileOutput" TextWrapping="WrapWholeWords" /></template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with split menu items" :theme="pageTheme" :vue="splitCode">
      <template #example>
        <div class="sample-stack">
          <WinSplitButton :Options="['Save', 'Share']" :Theme="pageTheme" @click="splitOutput = 'You clicked: Save'" @select="splitOutput = `You clicked: ${$event}`">
            <WinTextBlock Text="Save" />
          </WinSplitButton>
        </div>
      </template>
      <template #options><WinTextBlock :Text="splitOutput" TextWrapping="WrapWholeWords" /></template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with icons" :theme="pageTheme" :vue="iconCode">
      <template #example>
        <div class="sample-stack">
          <WinButton @click="openMenu($event, editMenu)"><WinTextBlock Text="Edit Options" /></WinButton>
        </div>
      </template>
      <template #options><WinTextBlock :Text="editOutput" TextWrapping="WrapWholeWords" /></template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with keyboard accelerators" :theme="pageTheme" :vue="acceleratorCode">
      <template #example>
        <div class="sample-stack">
          <WinButton @click="openMenu($event, accelMenu)"><WinTextBlock Text="Edit Options" /></WinButton>
        </div>
      </template>
      <template #options><WinTextBlock :Text="accelOutput" TextWrapping="WrapWholeWords" /></template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" headerText="A MenuFlyout with radio items" :theme="pageTheme" :vue="radioCode">
      <template #example>
        <div class="sample-stack">
          <WinButton @click="openMenu($event, radioMenu)"><WinTextBlock Text="Options" /></WinButton>
        </div>
      </template>
      <template #options><WinTextBlock :Text="`Orientation: ${orientation}, Icon size: ${iconSize}`" TextWrapping="WrapWholeWords" /></template>
    </WinControlExample>

    <WinMenuFlyout :Open="sortMenu.open" :AnchorRect="sortMenu.anchor" :Items="sortItems" :Theme="pageTheme" @Close="sortMenu.open = false" @Select="onSortSelect" />

    <WinMenuFlyout :Open="optionsMenu.open" :AnchorRect="optionsMenu.anchor" :Items="optionsItems" :Theme="pageTheme" @Close="optionsMenu.open = false" @Select="onOptionsSelect" />

    <WinMenuFlyout :Open="fileMenu.open" :AnchorRect="fileMenu.anchor" :Items="fileItems" :Theme="pageTheme" @Close="fileMenu.open = false" @Select="onFileSelect" />

    <WinMenuFlyout :Open="editMenu.open" :AnchorRect="editMenu.anchor" :Items="iconItems" :Theme="pageTheme" @Close="editMenu.open = false" @Select="onEditSelect" />

    <WinMenuFlyout :Open="accelMenu.open" :AnchorRect="accelMenu.anchor" :Items="accelItems" :Theme="pageTheme" @Close="accelMenu.open = false" @Select="onAccelSelect" />

    <WinMenuFlyout :Open="radioMenu.open" :AnchorRect="radioMenu.anchor" :Items="radioItems" :Theme="pageTheme" @Close="radioMenu.open = false" @Select="onRadioSelect" />
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

const sortItems = [{ Text: 'By rating' }, { Text: 'By match' }, { Text: 'By distance' }];
const optionsItems = [
  { Text: 'Reset' },
  { Kind: 'MenuFlyoutSeparator' },
  { Text: 'Repeat', IsChecked: repeatChecked.value },
  { Text: 'Shuffle', IsChecked: shuffleChecked.value }
];
const fileItems = [
  { Text: 'Open' },
  {
    Kind: 'MenuFlyoutSubItem',
    Text: 'Send to',
    Items: [
      { Text: 'Bluetooth' },
      { Text: 'Desktop (shortcut)' },
      {
        Kind: 'MenuFlyoutSubItem',
        Text: 'Compressed file',
        Items: [
          { Text: 'Compress and email' },
          { Text: 'Compress to .7z' },
          { Text: 'Compress to .zip' }
        ]
      }
    ]
  }
];
const iconItems = [
  { Text: 'Share', Icon: '\uE72D' },
  { Text: 'Copy', Icon: '\uE8C8' },
  { Text: 'Delete', Icon: '\uE74D' },
  { Kind: 'MenuFlyoutSeparator' },
  { Text: 'Rename' },
  { Text: 'Select' }
];
const accelItems = [
  { Text: 'Share', Icon: '\uE72D', KeyboardAccelerators: [{ Key: 'S', Modifiers: ['Control'] }], KeyboardAcceleratorTextOverride: 'Ctrl+S' },
  { Text: 'Copy', Icon: '\uE8C8', KeyboardAccelerators: [{ Key: 'C', Modifiers: ['Control'] }], KeyboardAcceleratorTextOverride: 'Ctrl+C' },
  { Text: 'Delete', Icon: '\uE74D', KeyboardAccelerators: [{ Key: 'Delete', Modifiers: [] }], KeyboardAcceleratorTextOverride: 'Delete' },
  { Kind: 'MenuFlyoutSeparator' },
  { Text: 'Rename' },
  { Text: 'Select' }
];
const radioItems = [
  { Text: 'Landscape', GroupName: 'OrientationGroup', IsChecked: false },
  { Text: 'Portrait', GroupName: 'OrientationGroup', IsChecked: true },
  { Kind: 'MenuFlyoutSeparator' },
  { Text: 'Small icons', GroupName: 'SizeGroup', IsChecked: false },
  { Text: 'Medium icons', GroupName: 'SizeGroup', IsChecked: true },
  { Text: 'Large icons', GroupName: 'SizeGroup', IsChecked: false }
];

const allMenus = [sortMenu, optionsMenu, fileMenu, editMenu, accelMenu, radioMenu];
const openMenu = (event, menu) => {
  allMenus.forEach((item) => { if (item !== menu) item.open = false; });
  menu.anchor = event.currentTarget.getBoundingClientRect();
  menu.open = !menu.open;
};
const onSortSelect = (item) => {
  sortOutput.value = `Sorted by ${item.Text.toLowerCase()}`;
  sortMenu.open = false;
};
const onOptionsSelect = (item) => {
  if (item.Text === 'Reset') {
    repeatChecked.value = false;
    shuffleChecked.value = false;
    optionsItems[2].IsChecked = false;
    optionsItems[3].IsChecked = false;
  } else if (item.Text === 'Repeat') {
    repeatChecked.value = !repeatChecked.value;
    item.IsChecked = repeatChecked.value;
  } else if (item.Text === 'Shuffle') {
    shuffleChecked.value = !shuffleChecked.value;
    item.IsChecked = shuffleChecked.value;
  }
  optionsMenu.open = false;
};
const onFileSelect = (item) => {
  fileOutput.value = `Action: ${item.Text}`;
  fileMenu.open = false;
};
const onEditSelect = (item) => {
  editOutput.value = `Action: ${item.Text}`;
  editMenu.open = false;
};
const onAccelSelect = (item) => {
  accelOutput.value = `Action: ${item.Text}`;
  accelMenu.open = false;
};
const onRadioSelect = (item) => {
  if (item.GroupName === 'OrientationGroup') orientation.value = item.Text.replace(' icons', '');
  if (item.GroupName === 'SizeGroup') iconSize.value = item.Text.replace(' icons', '');
  radioMenu.open = false;
};

const sortCode = `<WinAppBarButton
  icon="&#xE8CB;"
  label="Sort"
  :isCompact="true"
  @click="openMenu($event, sortMenu)" />

<WinMenuFlyout
  :Open="sortMenu.open"
  :AnchorRect="sortMenu.anchor"
  :Items="[
    { Text: 'By rating' },
    { Text: 'By match' },
    { Text: 'By distance' }
  ]"
  @Close="sortMenu.open = false" />`;
const toggleCode = `<WinButton @click="openMenu($event, optionsMenu)">
  <WinTextBlock Text="Options" />
</WinButton>

<WinMenuFlyout
  :Open="optionsMenu.open"
  :AnchorRect="optionsMenu.anchor"
  :Items="[
    { Text: 'Reset' },
    { Kind: 'MenuFlyoutSeparator' },
    { Text: 'Repeat', IsChecked: true },
    { Text: 'Shuffle', IsChecked: true }
  ]"
  @Close="optionsMenu.open = false" />`;
const cascadeCode = `<WinButton @click="openMenu($event, fileMenu)">
  <WinTextBlock Text="File Options" />
</WinButton>

<WinMenuFlyout
  :Open="fileMenu.open"
  :AnchorRect="fileMenu.anchor"
  :Items="[
    { Text: 'Open' },
    {
      Kind: 'MenuFlyoutSubItem',
      Text: 'Send to',
      Items: [
        { Text: 'Bluetooth' },
        { Text: 'Desktop (shortcut)' },
        {
          Kind: 'MenuFlyoutSubItem',
          Text: 'Compressed file',
          Items: [
            { Text: 'Compress and email' },
            { Text: 'Compress to .7z' },
            { Text: 'Compress to .zip' }
          ]
        }
      ]
    }
  ]"
  @Close="fileMenu.open = false" />`;
const splitCode = `<WinSplitButton
  :Options="['Save', 'Share']"
  @click="output = 'You clicked: Save'"
  @select="output = \`You clicked: \${$event}\`">
  <WinTextBlock Text="Save" />
</WinSplitButton>`;
const iconCode = `<WinButton @click="openMenu($event, editMenu)">
  <WinTextBlock Text="Edit Options" />
</WinButton>

<WinMenuFlyout
  :Open="editMenu.open"
  :AnchorRect="editMenu.anchor"
  :Items="[
    { Text: 'Share', Icon: '\\uE72D' },
    { Text: 'Copy', Icon: '\\uE8C8' },
    { Text: 'Delete', Icon: '\\uE74D' },
    { Kind: 'MenuFlyoutSeparator' },
    { Text: 'Rename' },
    { Text: 'Select' }
  ]"
  @Close="editMenu.open = false" />`;
const acceleratorCode = `<WinButton @click="openMenu($event, accelMenu)">
  <WinTextBlock Text="Edit Options" />
</WinButton>

<WinMenuFlyout
  :Open="accelMenu.open"
  :AnchorRect="accelMenu.anchor"
  :Items="[
    {
      Text: 'Share',
      Icon: '\\uE72D',
      KeyboardAccelerators: [{ Key: 'S', Modifiers: ['Control'] }],
      KeyboardAcceleratorTextOverride: 'Ctrl+S'
    },
    {
      Text: 'Copy',
      Icon: '\\uE8C8',
      KeyboardAccelerators: [{ Key: 'C', Modifiers: ['Control'] }],
      KeyboardAcceleratorTextOverride: 'Ctrl+C'
    },
    {
      Text: 'Delete',
      Icon: '\\uE74D',
      KeyboardAccelerators: [{ Key: 'Delete', Modifiers: [] }],
      KeyboardAcceleratorTextOverride: 'Delete'
    }
  ]"
  @Close="accelMenu.open = false" />`;
const radioCode = `<WinButton @click="openMenu($event, radioMenu)">
  <WinTextBlock Text="Options" />
</WinButton>

<WinMenuFlyout
  :Open="radioMenu.open"
  :AnchorRect="radioMenu.anchor"
  :Items="[
    { Text: 'Landscape', GroupName: 'OrientationGroup' },
    { Text: 'Portrait', GroupName: 'OrientationGroup', IsChecked: true },
    { Kind: 'MenuFlyoutSeparator' },
    { Text: 'Small icons', GroupName: 'SizeGroup' },
    { Text: 'Medium icons', GroupName: 'SizeGroup', IsChecked: true },
    { Text: 'Large icons', GroupName: 'SizeGroup' }
  ]"
  @Close="radioMenu.open = false" />`;
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
</style>
