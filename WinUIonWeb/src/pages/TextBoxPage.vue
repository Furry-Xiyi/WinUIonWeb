<template>
  <div>
    <div style="position: relative;">
      <WinTextBlock class="page-header" Text="TextBox" />
      <WinTextBlock class="page-description" Text="Use a TextBox to let a user enter simple text input in your app. You can customize the TextBox in a number of ways to fit your needs." TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: A simple TextBox -->
    <WinTextBlock class="control-example-description" Text="A simple TextBox" />
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :vue="example1Template">
      <template #example>
        <WinTextBox v-model:Text="simpleText" />
      </template>
    </WinControlExample>

    <!-- Example 2: A TextBox with a header and placeholder text -->
    <WinTextBlock class="control-example-description" Text="A TextBox with a header and placeholder text" />
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :vue="example2Template">
      <template #example>
        <WinTextBox
          v-model:Text="nameText"
          Header="Enter your name:"
          PlaceholderText="Name" />
      </template>
    </WinControlExample>

    <!-- Example 3: A read-only TextBox with various properties set -->
    <WinTextBlock class="control-example-description" Text="A read-only TextBox with various properties set" />
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :vue="example3Template">
      <template #example>
        <WinTextBox
          Text="I am super excited to be here!"
          :IsReadOnly="true"
          FontFamily="Arial"
          :FontSize="24"
          FontStyle="Italic"
          :CharacterSpacing="200"
          Foreground="#5178BE" />
      </template>
    </WinControlExample>

    <!-- Example 4: A multi-line TextBox with spell checking and custom selection highlight color -->
    <WinTextBlock class="control-example-description" Text="A multi-line TextBox with spell checking and custom selection highlight color" />
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :vue="example4Template">
      <template #example>
        <WinTextBox
          :MinWidth="400"
          :AcceptsReturn="true"
          TextWrapping="Wrap"
          :IsSpellCheckEnabled="true"
          SelectionHighlightColor="Green" />
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import WinTextBox from '../components/WinTextBox.vue';
import WinTextBlock from '../components/WinTextBlock.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { createPageState } from '../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'textbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example 1: Simple TextBox
const simpleText = ref('');

const example1Template = `<WinTextBox v-model:Text="simpleText" />`;

// Example 2: TextBox with header and placeholder
const nameText = ref('');

const example2Template = `<WinTextBox
  v-model:Text="nameText"
  Header="Enter your name:"
  PlaceholderText="Name" />`;

// Example 3: Read-only styled TextBox
const example3Template = `<WinTextBox
  Text="I am super excited to be here!"
  :IsReadOnly="true"
  FontFamily="Arial"
  :FontSize="24"
  FontStyle="Italic"
  :CharacterSpacing="200"
  Foreground="#5178BE" />`;

const example4Template = `<WinTextBox
  :MinWidth="400"
  :AcceptsReturn="true"
  TextWrapping="Wrap"
  :IsSpellCheckEnabled="true"
  SelectionHighlightColor="Green" />`;

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


