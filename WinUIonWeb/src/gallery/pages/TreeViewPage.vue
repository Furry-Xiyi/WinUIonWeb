<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.treeview')" />
          <TextBlock class="page-description" :Text="$t('text.the-treeview-control-is-a-hierarchical-list-patt')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.treeview.drag-drop')" :theme="pageTheme" :vue="simpleTreeViewVue">
              <template #example>
                <TreeView
                  v-model:ItemsSource="simpleTree"
                  SelectionMode="Single"
                  :CanDragItems="true"
                  :AllowDrop="true"
                  style="min-height: 280px;">
                  <template #item="{ item }">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <TextBlock :Text="item.Content" />
                    </div>
                  </template>
                </TreeView>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.treeview.multi-selection')" :theme="pageTheme" :vue="multiSelectionTreeViewVue">
              <template #example>
                <TreeView
                  v-model:ItemsSource="multiSelectTree"
                  SelectionMode="Multiple"
                  style="min-height: 280px;">
                  <template #item="{ item }">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <TextBlock :Text="item.Content" />
                    </div>
                  </template>
                </TreeView>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.treeview.databinding-itemsource')" :theme="pageTheme" :vue="dataBindingTreeViewVue">
              <template #example>
                <TreeView
                  v-model:ItemsSource="dataSource"
                  SelectionMode="Single"
                  style="min-height: 200px;">
                  <template #item="{ item }">
                    <TextBlock :Text="item.Name" />
                  </template>
                </TreeView>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.treeview.item-template-selector')" :theme="pageTheme" :vue="templateSelectorTreeViewVue">
              <template #example>
                <TreeView
                  v-model:ItemsSource="fileTree"
                  SelectionMode="Single"
                  style="min-height: 200px;">
                  <template #item="{ item }">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="tree-icon" :class="item.Type === 'Folder' ? 'folder' : 'file'" aria-hidden="true"></span>
                      <TextBlock :Text="item.Name" />
                    </div>
                  </template>
                </TreeView>
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import TreeView from '../../components/TreeView.vue';
import ControlExample from '../../components/ControlExample.vue';
import Button from '../../components/Button.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'treeview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
// Example 1: Simple tree with drag and drop
const simpleTree = ref([
  {
    Content: 'Work Documents',
    expanded: true,
    children: [
      { Content: 'XYZ Functional Spec' },
      { Content: 'Feature Schedule' }
    ]
  },
  {
    Content: 'Personal Documents',
    expanded: true,
    children: [
      {
        Content: 'Home Remodel',
        expanded: true,
        children: [
          { Content: 'Contractor Contact Info' },
          { Content: 'Paint Color Scheme' }
        ]
      }
    ]
  }
]);

// Example 2: Multi-select tree
const multiSelectTree = ref([
  {
    Content: 'Work Documents',
    expanded: true,
    selected: false,
    children: [
      { Content: 'XYZ Functional Spec', selected: false },
      { Content: 'Feature Schedule', selected: false }
    ]
  },
  {
    Content: 'Personal Documents',
    expanded: true,
    selected: false,
    children: [
      {
        Content: 'Home Remodel',
        expanded: true,
        selected: false,
        children: [
          { Content: 'Contractor Contact Info', selected: false },
          { Content: 'Paint Color Scheme', selected: false }
        ]
      }
    ]
  }
]);

// Example 3: Data-bound tree
const dataSource = ref([
  {
    Name: 'Documents',
    Type: 'Folder',
    expanded: true,
    children: [
      { Name: 'ProjectProposal', Type: 'File' },
      { Name: 'BudgetReport', Type: 'File' }
    ]
  },
  {
    Name: 'Projects',
    Type: 'Folder',
    children: [
      { Name: 'Project Plan', Type: 'File' }
    ]
  }
]);

// Example 4: File tree with different templates
const fileTree = ref([
  {
    Name: 'Documents',
    Type: 'Folder',
    expanded: true,
    children: [
      { Name: 'ProjectProposal', Type: 'File' },
      { Name: 'BudgetReport', Type: 'File' }
    ]
  },
  {
    Name: 'Projects',
    Type: 'Folder',
    children: [
      { Name: 'Project Plan', Type: 'File' }
    ]
  }
]);

const simpleTreeViewVue = `<TreeView v-model:ItemsSource="simpleTree" SelectionMode="Single" CanDragItems AllowDrop>
  <template #item="{ item }">
    <TextBlock :Text="item.Content" />
  </template>
</TreeView>`;
const multiSelectionTreeViewVue = `<TreeView v-model:ItemsSource="multiSelectTree" SelectionMode="Multiple">
  <template #item="{ item }">
    <TextBlock :Text="item.Content" />
  </template>
</TreeView>`;
const dataBindingTreeViewVue = `<TreeView v-model:ItemsSource="dataSource" SelectionMode="Single">
  <template #item="{ item }">
    <TextBlock :Text="item.Name" />
  </template>
</TreeView>`;
const templateSelectorTreeViewVue = `<TreeView v-model:ItemsSource="fileTree" SelectionMode="Single">
  <template #item="{ item }">
    <TextBlock :Text="item.Name" />
  </template>
</TreeView>`;
</script>

<style scoped>
.page-heading {
  position: relative;
}

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
}

.icon {
  font-size: 16px;
}
.tree-icon {
  width: 20px;
}
.tree-icon.folder::before { content: "\E8B7"; }
.tree-icon.file::before { content: "\E8A5"; }
</style>
