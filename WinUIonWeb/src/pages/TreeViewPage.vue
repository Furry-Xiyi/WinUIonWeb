<template>
  <div class="control-page">
    <h1 class="page-header">TreeView</h1>
    <p class="page-description">
      The TreeView control is a hierarchical list pattern with expanding and collapsing nodes that contain nested items. It can be used to illustrate a folder structure or nested relationships in your UI.
    </p>

    <!-- Example 1: Simple TreeView with drag and drop -->
    <WinSettingsCard
      header="A simple TreeView with drag and drop enabled."
      description="Drag items to reorder them within the tree.">
      <template #default>
        <div style="min-height: 280px; border: 1px solid var(--control-stroke-default); border-radius: 4px; padding: 12px;">
          <WinTreeView
            v-model:items="simpleTree"
            selectionMode="Single"
            :canDragItems="true"
            :allowDrop="true">
            <template #item="{ item }">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';">
                  {{ item.children?.length ? '' : '' }}
                </span>
                {{ item.label }}
              </div>
            </template>
          </WinTreeView>
        </div>
      </template>
    </WinSettingsCard>

    <!-- Example 2: TreeView with multiple selection -->
    <WinSettingsCard
      header="A TreeView with multiple selection enabled."
      description="Select multiple items using checkboxes.">
      <template #default>
        <div style="min-height: 280px; border: 1px solid var(--control-stroke-default); border-radius: 4px; padding: 12px;">
          <WinTreeView
            v-model:items="multiSelectTree"
            selectionMode="Multiple">
            <template #item="{ item }">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';">
                  {{ item.children?.length ? '' : '' }}
                </span>
                {{ item.label }}
              </div>
            </template>
          </WinTreeView>
        </div>
      </template>
    </WinSettingsCard>

    <!-- Example 3: Data-bound TreeView -->
    <WinSettingsCard
      header="A TreeView using data binding with ItemsSource."
      description="TreeView populated from a hierarchical data source.">
      <template #default>
        <div style="min-height: 200px; border: 1px solid var(--control-stroke-default); border-radius: 4px; padding: 12px;">
          <WinTreeView
            v-model:items="dataSource"
            selectionMode="Single">
            <template #item="{ item }">
              {{ item.name }}
            </template>
          </WinTreeView>
        </div>
      </template>
    </WinSettingsCard>

    <!-- Example 4: TreeView with ItemTemplateSelector -->
    <WinSettingsCard
      header="A TreeView using an ItemTemplateSelector."
      description="Different templates for folders and files.">
      <template #default>
        <div style="min-height: 200px; border: 1px solid var(--control-stroke-default); border-radius: 4px; padding: 12px;">
          <WinTreeView
            v-model:items="fileTree"
            selectionMode="Single">
            <template #item="{ item }">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span v-if="item.type === 'folder'" style="font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';">
                  📁
                </span>
                <span v-else style="font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';">
                  
                </span>
                {{ item.name }}
              </div>
            </template>
          </WinTreeView>
        </div>
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinTreeView from '../components/WinTreeView.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

// Example 1: Simple tree with drag and drop
const simpleTree = ref([
  {
    label: 'Workgroup',
    expanded: true,
    children: [
      { label: 'Mark' },
      { label: 'Sue' },
      { label: 'Mary', expanded: true, children: [
        { label: 'Adam' },
        { label: 'Eve' }
      ]}
    ]
  }
]);

// Example 2: Multi-select tree
const multiSelectTree = ref([
  {
    label: 'Workgroup',
    expanded: true,
    selected: false,
    children: [
      { label: 'Mark', selected: false },
      { label: 'Sue', selected: false },
      { label: 'Mary', selected: false, expanded: true, children: [
        { label: 'Adam', selected: false },
        { label: 'Eve', selected: false }
      ]}
    ]
  }
]);

// Example 3: Data-bound tree
const dataSource = ref([
  {
    name: 'Work Documents',
    expanded: true,
    children: [
      { name: 'Project Proposal.docx' },
      { name: 'Budget.xlsx' },
      { name: 'Functional Specifications',
        expanded: true,
        children: [
          { name: 'Requirements.docx' },
          { name: 'Wireframes.pdf' }
        ]
      }
    ]
  },
  {
    name: 'Personal Documents',
    children: [
      { name: 'Resume.docx' },
      { name: 'Recipes',
        children: [
          { name: 'Pasta.txt' },
          { name: 'Cookies.txt' }
        ]
      }
    ]
  }
]);

// Example 4: File tree with different templates
const fileTree = ref([
  {
    name: 'Flavors',
    type: 'folder',
    expanded: true,
    children: [
      { name: 'Vanilla.txt', type: 'file' },
      { name: 'Chocolate.txt', type: 'file' },
      { name: 'Strawberry.txt', type: 'file' }
    ]
  },
  {
    name: 'Spices',
    type: 'folder',
    children: [
      { name: 'Cinnamon.txt', type: 'file' },
      { name: 'Nutmeg.txt', type: 'file' }
    ]
  }
]);
</script>

<style scoped>
.control-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
}
</style>
