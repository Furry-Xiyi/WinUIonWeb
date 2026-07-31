<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
          <h1 class="page-header">RichTextBlock</h1>
          <p class="page-description">
            RichTextBlock provides a rich text display container that supports formatted text, hyperlinks, inline images, and other rich content.
          </p>
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
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Example 1: Simple RichTextBlock -->
            <p class="control-example-description">Simple RichTextBlock</p>
            <WinControlExample class="basic-input-example-theme"
              :theme="pageTheme"
              :xaml="example1Template"
              :cSharp="example1Vue">
              <template #example>
                <div class="rich-text-block">
                  <p>I am a RichTextBlock.</p>
                </div>
              </template>
            </WinControlExample>

            <!-- Example 2: RichTextBlock with custom selection highlight -->
            <p class="control-example-description">RichTextBlock with custom selection highlight</p>
            <WinControlExample class="basic-input-example-theme"
              :theme="pageTheme"
              :xaml="example2Template"
              :cSharp="example2Vue">
              <template #example>
                <div class="rich-text-block" :class="{ 'green-selection': true }">
                  <p>
                    RichTextBlock provides a rich text display container that supports
                    <span style="font-style: italic; font-weight: bold;">formatted text</span>,
                    <a href="https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink" target="_blank" class="hyperlink">hyperlinks</a>,
                    inline images, and other rich content.
                  </p>
                  <p>RichTextBlock also supports a built-in overflow model.</p>
                </div>
              </template>
            </WinControlExample>

            <!-- Example 3: RichTextBlock overflow -->
            <p class="control-example-description">RichTextBlock overflow</p>
            <WinControlExample class="basic-input-example-theme"
              :theme="pageTheme"
              :xaml="example3Template"
              :cSharp="example3Vue">
              <template #example>
                <div class="overflow-container">
                  <div class="overflow-column">
                    <div class="rich-text-block overflow-text">
                      <p>Linked text containers allow text which does not fit in one element to overflow into a different element on the page. Creative use of linked text containers enables basic multicolumn support and other advanced page layouts.</p>
                      <p>
                        Duis sed nulla metus, id hendrerit velit. Curabitur dolor purus, bibendum eu cursus lacinia, interdum vel augue. Aenean euismod eros et sapien vehicula dictum. Duis ullamcorper, turpis nec feugiat tincidunt, dui erat luctus risus, aliquam accumsan lacus est vel quam. Nunc lacus massa, varius eget accumsan id, congue sed orci. Duis dignissim hendrerit egestas. Proin ut turpis magna, sit amet porta erat. Nunc semper metus nec magna imperdiet nec vestibulum dui fringilla. Sed sed ante libero, nec porttitor mi. Ut luctus, neque vitae placerat egestas, urna leo auctor magna, sit amet ultricies ipsum felis quis sapien. Proin eleifend varius dui, at vestibulum nunc consectetur nec. Mauris nulla elit, ultrices a sodales non, aliquam ac est. Quisque sit amet risus nulla. Quisque vestibulum posuere velit, vitae vestibulum eros scelerisque sit amet. In in risus est, at laoreet dolor. Nullam aliquet pellentesque convallis. Ut vel tincidunt nulla. Mauris auctor tincidunt auctor.
                        Aenean orci ante, vulputate ac sagittis sit amet, consequat at mi. Morbi elementum purus consectetur nisi adipiscing vitae blandit sapien placerat. Aliquam adipiscing tortor non sem lobortis consectetur mattis felis rhoncus. Nunc eu nunc rhoncus arcu sollicitudin ultrices. In vulputate eros in mauris aliquam id dignissim nisl laoreet.
                      </p>
                    </div>
                  </div>
                  <div class="overflow-column">
                    <div class="rich-text-block overflow-text"></div>
                  </div>
                  <div class="overflow-column">
                    <div class="rich-text-block overflow-text"></div>
                  </div>
                </div>
              </template>
            </WinControlExample>

            <!-- Example 4: Custom text highlighting -->
            <p class="control-example-description">Custom text highlighting</p>
            <WinControlExample class="basic-input-example-theme"
              :theme="pageTheme"
              :xaml="example4Template"
              :cSharp="example4Vue">
              <template #example>
                <div class="rich-text-block">
                  <p>
                    Lorem ipsum dolor sit amet, <span :class="`highlight-${highlightColor}`">consectetur</span> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
                  </p>
                </div>
              </template>
              <template #options>
                <WinComboBox
                  v-model:SelectedValue="highlightColor"
                  Header="Text highlighting color"
                  :ItemsSource="highlightOptions"
                  DisplayMemberPath="label"
                  SelectedValuePath="value"
                  style="min-width: 200px;" />
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';
import WinComboBox from '../../components/WinComboBox.vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'richtextblock');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example 1: Simple RichTextBlock
const example1Template = `<div class="rich-text-block">
  <p>I am a RichTextBlock.</p>
</div>`;

const example1Vue = `// Simple text display in a RichTextBlock container`;

// Example 2: Custom selection highlight
const example2Template = `<div class="rich-text-block green-selection">
  <p>
    RichTextBlock provides a rich text display container that supports
    <span style="font-style: italic; font-weight: bold;">formatted text</span>,
    <a href="..." class="hyperlink">hyperlinks</a>,
    inline images, and other rich content.
  </p>
  <p>RichTextBlock also supports a built-in overflow model.</p>
</div>`;

const example2Vue = `// Custom selection highlight color using CSS
.green-selection::selection {
  background-color: green;
}`;

// Example 3: Overflow
const example3Template = `<div class="overflow-container">
  <div class="overflow-column">
    <div class="rich-text-block overflow-text">
      <p>Linked text containers allow text which does not fit...</p>
      <p>Long text content...</p>
    </div>
  </div>
  <div class="overflow-column">
    <div class="rich-text-block overflow-text"></div>
  </div>
  <div class="overflow-column">
    <div class="rich-text-block overflow-text"></div>
  </div>
</div>`;

const example3Vue = `// Multi-column layout with overflow
.overflow-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 300px;
}

.overflow-text {
  text-align: justify;
}`;

// Example 4: Custom text highlighting
const highlightColor = ref('yellow');
const highlightOptions = [
  { label: 'Yellow', value: 'yellow' },
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' }
];

const example4Template = `<div class="rich-text-block">
  <p>
    Lorem ipsum dolor sit amet,
    <span :class="\`highlight-\${highlightColor}\`">consectetur</span>
    adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
  </p>
</div>`;

const example4Vue = `const highlightColor = ref('yellow');

// CSS for highlighting
.highlight-yellow { background-color: yellow; }
.highlight-red { background-color: red; }
.highlight-blue { background-color: blue; }`;
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

.rich-text-block {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
}

.rich-text-block p {
  margin: 0 0 12px 0;
}

.rich-text-block p:last-child {
  margin-bottom: 0;
}

.green-selection::selection {
  background-color: green;
  color: white;
}

.hyperlink {
  color: #0078D4;
  text-decoration: none;
}

.hyperlink:hover {
  text-decoration: underline;
}

.overflow-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  height: 300px;
  overflow: hidden;
}

.overflow-column {
  overflow: hidden;
}

.overflow-text {
  text-align: justify;
  height: 100%;
  overflow: hidden;
}

.highlight-yellow {
  background-color: yellow;
  padding: 2px 4px;
}

.highlight-red {
  background-color: red;
  color: white;
  padding: 2px 4px;
}

.highlight-blue {
  background-color: blue;
  color: white;
  padding: 2px 4px;
}
</style>

