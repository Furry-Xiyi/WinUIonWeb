<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">BreadcrumbBar</h1>
      <p class="page-description">
        The BreadcrumbBar control provides the direct path of pages or folders to the current location. It is often used for navigation in file systems, hierarchies, and nested structures.
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

    <!-- Example 1: A BreadcrumbBar control -->
    <WinControlExample
      headerText="A BreadcrumbBar control"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <WinBreadcrumbBar :itemsSource="foldersString" />
      </template>
    </WinControlExample>

    <!-- Example 2: BreadcrumbBar Control with Custom DataTemplate -->
    <WinControlExample
      headerText="BreadcrumbBar Control with Custom DataTemplate"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <WinBreadcrumbBar
          :itemsSource="folders"
          @itemClicked="onBreadcrumbItemClicked">
          <template #item="{ item }">
            <span>{{ item.name }}</span>
          </template>
        </WinBreadcrumbBar>
      </template>
      <template #options>
        <WinButton @click="resetSample">
          Reset sample
        </WinButton>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinBreadcrumbBar from '../components/WinBreadcrumbBar.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'breadcrumbbar');

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

// Example 1: Simple string array
const foldersString = ref(['Home', 'Documents', 'Design', 'Northwind', 'Images', 'Folder1', 'Folder2', 'Folder3']);

const example1Template = `<WinBreadcrumbBar :itemsSource="foldersString" />`;

const example1Vue = `const foldersString = ref([
  'Home', 'Documents', 'Design', 'Northwind',
  'Images', 'Folder1', 'Folder2', 'Folder3'
]);`;

// Example 2: Object array with custom template
const initialFolders = [
  { name: 'Home' },
  { name: 'Folder1' },
  { name: 'Folder2' },
  { name: 'Folder3' }
];

const folders = ref([...initialFolders]);

const onBreadcrumbItemClicked = ({ index }) => {
  // Remove all items after the clicked index
  folders.value = folders.value.slice(0, index + 1);
};

const resetSample = () => {
  folders.value = [...initialFolders];
};

const example2Template = `<WinBreadcrumbBar
  :itemsSource="folders"
  @itemClicked="onBreadcrumbItemClicked">
  <template #item="{ item }">
    <span>{{ item.name }}</span>
  </template>
</WinBreadcrumbBar>`;

const example2Vue = `const folders = ref([
  { name: 'Home' },
  { name: 'Folder1' },
  { name: 'Folder2' },
  { name: 'Folder3' }
]);

const onBreadcrumbItemClicked = ({ index }) => {
  // Remove all items after the clicked index
  folders.value = folders.value.slice(0, index + 1);
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
</style>
