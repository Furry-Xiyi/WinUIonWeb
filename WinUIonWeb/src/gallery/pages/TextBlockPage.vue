<template>
  <div class="gallery-item-page">
    <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.textblock')" />
          <WinTextBlock class="page-description" :Text="$t('text.the-textblock-control-provides-flexible-text-dis')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template" :headerText="$t('text.a-simple-textblock')">
              <template #example><WinTextBlock :Text="$t('text.i-am-a-textblock')" /></template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template" :headerText="$t('sample.textblock.style-applied')">
              <template #example><WinTextBlock Style="{StaticResource CustomTextBlockStyle}" Text="I am a styled TextBlock." /></template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example3Template" :headerText="$t('sample.textblock.properties')">
              <template #example>
                <WinTextBlock CharacterSpacing="200" FontFamily="Arial" FontSize="24" FontStyle="Italic" Foreground="CornflowerBlue" Text="I am super excited to be here!" TextWrapping="WrapWholeWords" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example4Template" :headerText="$t('sample.textblock.inline-elements')">
              <template #example>
                <WinTextBlock>
                  <span style="font-family: 'Times New Roman'; color: DarkGray;">Text in a TextBlock doesn't have to be a simple string.</span>
                  <br>
                  <span>Text can be <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>.</span>
                </WinTextBlock>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example5Template" :headerText="$t('sample.textblock.selectable')">
              <template #example>
                <WinTextBlock :IsTextSelectionEnabled="selectionEnabled" SelectionHighlightColor="DarkOrange" Text="I am a selectable TextBlock with custom SelectionHighlightColor." />
              </template>
              <template #options>
                <WinToggleSwitch v-model="selectionEnabled"><WinTextBlock Text="IsTextSelectionEnabled" /></WinToggleSwitch>
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'textblock');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const selectionEnabled = ref(false);

const example1Template = `<WinTextBlock Text="I am a TextBlock." />`;
const example2Template = `<WinTextBlock Style="{StaticResource CustomTextBlockStyle}" Text="I am a styled TextBlock." />`;
const example3Template = `<WinTextBlock CharacterSpacing="200" FontFamily="Arial" FontSize="24" FontStyle="Italic" Foreground="CornflowerBlue" Text="I am super excited to be here!" TextWrapping="WrapWholeWords" />`;
const example4Template = `<WinTextBlock>
  <span style="font-family: 'Times New Roman'; color: DarkGray;">Text in a TextBlock doesn't have to be a simple string.</span>
  <br>
  <span>Text can be <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>.</span>
</WinTextBlock>`;
const example5Template = `<WinTextBlock
  :IsTextSelectionEnabled="selectionEnabled"
  SelectionHighlightColor="DarkOrange"
  Text="I am a selectable TextBlock with custom SelectionHighlightColor." />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets"; font-size: 16px; }
</style>
