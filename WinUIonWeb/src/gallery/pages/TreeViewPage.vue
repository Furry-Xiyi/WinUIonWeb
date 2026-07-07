<template>
  <div>
    <h1 class="page-header">{{ $t('text.treeview') }}</h1>
    <p class="page-description">
      {{ $t('text.the-treeview-control-is-a-hierarchical-list-patt') }}
    </p>

    <WinControlExample :headerText="$t('text.a-simple-treeview-with-drag-and-drop-enabled')">
      <template #example>
        <WinTreeView
          v-model:items="simpleTree"
          selectionMode="Single"
          :canDragItems="true"
          :allowDrop="true"
          style="min-height: 280px;">
          <template #item="{ item }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';">
                {{ item.children?.length ? '' : '' }}
              </span>
              {{ item.label }}
            </div>
          </template>
        </WinTreeView>
      </template>
    </WinControlExample>

    <WinControlExample headerText="A TreeView with multiple selection enabled.">
      <template #example>
        <WinTreeView
          v-model:items="multiSelectTree"
          selectionMode="Multiple"
          style="min-height: 280px;">
          <template #item="{ item }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';">
                {{ item.children?.length ? '' : '' }}
              </span>
              {{ item.label }}
            </div>
          </template>
        </WinTreeView>
      </template>
    </WinControlExample>

    <WinControlExample headerText="A TreeView using data binding with ItemsSource.">
      <template #example>
        <WinTreeView
          v-model:items="dataSource"
          selectionMode="Single"
          style="min-height: 200px;">
          <template #item="{ item }">
            {{ item.name }}
          </template>
        </WinTreeView>
      </template>
    </WinControlExample>

    <WinControlExample headerText="A TreeView using an ItemTemplateSelector.">
      <template #example>
        <WinTreeView
          v-model:items="fileTree"
          selectionMode="Single"
          style="min-height: 200px;">
          <template #item="{ item }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span v-if="item.type === 'folder'" style="font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';">
                📁
              </span>
              <span v-else style="font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';">

              </span>
              {{ item.name }}
            </div>
          </template>
        </WinTreeView>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinTreeView from '../../components/WinTreeView.vue';
import WinControlExample from '../../components/WinControlExample.vue';

import { useI18n } from '../../components/i18n/index';

const { t } = useI18n();
// Example 1: Simple tree with drag and drop
const simpleTree = ref([
  {
    label: t('text.workgroup'),
    expanded: true,
    children: [
      { label: t('text.mark') },
      { label: t('text.sue') },
      { label: t('text.mary'), expanded: true, children: [
        { label: t('text.adam') },
        { label: t('text.eve') }
      ]}
    ]
  }
]);

// Example 2: Multi-select tree
const multiSelectTree = ref([
  {
    label: t('text.workgroup'),
    expanded: true,
    selected: false,
    children: [
      { label: t('text.mark'), selected: false },
      { label: t('text.sue'), selected: false },
      { label: t('text.mary'), selected: false, expanded: true, children: [
        { label: t('text.adam'), selected: false },
        { label: t('text.eve'), selected: false }
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
</style>
