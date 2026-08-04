<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.commandbar')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-command-bar-with-labels-on-the-side-free-float')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('text.a-command-bar-with-labels-on-the-side-free-float')"
              :theme="pageTheme"
              :vue="exampleCode">
              <template #example>
                <div class="commandbar-sample">
                  <WinCommandBar
                    :isOpen="isOpen"
                    defaultLabelPosition="Right"
                    @update:isOpen="isOpen = $event">
                    <template #primary>
                      <WinAppBarButton icon="Add" :label="$t('text.add')" @click="onElementClicked('Add')" />
                      <WinAppBarButton icon="Edit" :label="$t('text.edit')" @click="onElementClicked('Edit')" />
                      <WinAppBarButton icon="Share" :label="$t('text.share')" @click="onElementClicked('Share')" />
                    </template>
                    <template #secondary>
                      <WinAppBarButton icon="Setting" label="Settings" :isCompact="true" labelPosition="Right" @click="onElementClicked('Settings')" />
                      <template v-if="hasExtraCommands">
                        <WinAppBarButton icon="Add" label="Button 1" :isCompact="true" labelPosition="Right" @click="onElementClicked('Button 1')" />
                        <WinAppBarButton icon="Delete" label="Button 2" :isCompact="true" labelPosition="Right" @click="onElementClicked('Button 2')" />
                        <div class="commandbar-separator"></div>
                        <WinAppBarButton icon="FontDecrease" label="Button 3" :isCompact="true" labelPosition="Right" @click="onElementClicked('Button 3')" />
                        <WinAppBarButton icon="FontIncrease" label="Button 4" :isCompact="true" labelPosition="Right" @click="onElementClicked('Button 4')" />
                      </template>
                    </template>
                  </WinCommandBar>
                </div>
              </template>
              <template #options>
                <div class="options-stack">
                  <WinTextBlock :Text="selectedOption || 'You clicked:'" TextWrapping="WrapWholeWords" />
                  <WinTextBlock class="options-title" Text="Show or hide" />
                  <WinButton @click="isOpen = true"><WinTextBlock Text="Open command bar" /></WinButton>
                  <WinButton @click="isOpen = false"><WinTextBlock Text="Close command bar" /></WinButton>
                  <WinTextBlock class="options-title" Text="Modify content" />
                  <WinButton @click="hasExtraCommands = true"><WinTextBlock Text="Add secondary commands" /></WinButton>
                  <WinButton @click="hasExtraCommands = false"><WinTextBlock Text="Remove secondary commands" /></WinButton>
                </div>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinAppBarButton from '../../components/WinAppBarButton.vue';
import WinButton from '../../components/WinButton.vue';
import WinCommandBar from '../../components/WinCommandBar.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'commandbar');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const isOpen = ref(false);
const hasExtraCommands = ref(false);
const selectedOption = ref('');

const onElementClicked = (name) => {
  selectedOption.value = `You clicked: ${name}`;
};

const exampleCode = `<WinCommandBar
  :isOpen="isOpen"
  defaultLabelPosition="Right"
  @update:isOpen="isOpen = $event">
  <template #primary>
    <WinAppBarButton icon="Add" label="Add" />
    <WinAppBarButton icon="Edit" label="Edit" />
    <WinAppBarButton icon="Share" label="Share" />
  </template>
  <template #secondary>
    <WinAppBarButton icon="Setting" label="Settings" :isCompact="true" labelPosition="Right" />
  </template>
</WinCommandBar>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.commandbar-sample { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.commandbar-separator { height: 1px; margin: 4px 0; background: var(--flyout-border, var(--stroke-divider)); }
.options-stack { display: flex; flex-direction: column; gap: 8px; }
.options-title { margin-top: 4px; font-weight: 600; }
</style>
