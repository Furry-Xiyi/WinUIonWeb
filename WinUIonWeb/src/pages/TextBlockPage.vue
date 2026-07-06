<template>
  <div>
    <div class="page-heading">
      <WinTextBlock class="page-header" Text="TextBlock" />
      <WinTextBlock class="page-description" Text="The TextBlock control provides flexible text display options for scenarios that don't require interactivity. It supports rich text formatting, inline elements like Bold and Italic, and text selection." TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
        <WinToggleButton v-model="isFavoriteState" class="header-action" @update:modelValue="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinTextBlock class="control-example-description" Text="A simple TextBlock." />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template">
      <template #example><WinTextBlock Text="I am a TextBlock." /></template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A TextBlock with a style applied." />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template">
      <template #example><WinTextBlock Style="{StaticResource CustomTextBlockStyle}" Text="I am a styled TextBlock." /></template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A TextBlock with various properties set." />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example3Template">
      <template #example>
        <WinTextBlock CharacterSpacing="200" FontFamily="Arial" FontSize="24" FontStyle="Italic" Foreground="CornflowerBlue" Text="I am super excited to be here!" TextWrapping="WrapWholeWords" />
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A TextBlock with inline text elements." />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example4Template">
      <template #example>
        <WinTextBlock>
          <span style="font-family: 'Times New Roman'; color: DarkGray;">Text in a TextBlock doesn't have to be a simple string.</span>
          <br>
          <span>Text can be <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>.</span>
        </WinTextBlock>
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A selectable TextBlock" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example5Template">
      <template #example>
        <WinTextBlock :IsTextSelectionEnabled="selectionEnabled" SelectionHighlightColor="DarkOrange" Text="I am a selectable TextBlock with custom SelectionHighlightColor." />
      </template>
      <template #options>
        <WinToggleSwitch v-model="selectionEnabled"><WinTextBlock Text="IsTextSelectionEnabled" /></WinToggleSwitch>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinTextBlock from '../components/WinTextBlock.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';
import { createPageState } from '../utils/pageState';

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
.control-example-description { margin-top: 16px; }
</style>
