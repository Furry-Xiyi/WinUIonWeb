<template>
  <div>
    <div style="position: relative;">
      <WinTextBlock class="page-header" :Text="$t('text.richeditbox')" />
      <WinTextBlock class="page-description" :Text="$t('text.the-richeditbox-control-lets-a-user-enter-format')" TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton @click="toggleTheme" style="width: 32px; height: 32px; padding: 0; min-width: 0;"><span class="icon"></span></WinButton>
        <WinToggleButton v-model:IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite" style="width: 32px; height: 32px; padding: 0; min-width: 0;"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></WinToggleButton>
      </div>
    </div>

    <WinTextBlock class="control-example-description" :Text="$t('text.a-simple-text-editor')" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" horizontalContentAlignment="Stretch" :vue="example1Template">
      <template #example>
        <WinRichEditBox v-model:Text="simpleText" :PlaceholderText="$t('text.enter-rich-text')" />
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="Customizing the RichEditBox command bar flyout by adding commands" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template">
      <template #example>
        <WinRichEditBox Header="Editor with custom menu" PlaceholderText="Select text and use the command menu." :Width="800" :Height="200" />
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A custom editor with formatting" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" horizontalContentAlignment="Stretch" :vue="example3Template">
      <template #example>
        <div class="custom-editor">
          <div class="custom-toolbar">
            <WinButton @click="showFileMessage('Open file')" title="Open file" style="width: 36px; height: 32px; padding: 0; min-width: 0;"><span class="icon">&#xE8E5;</span></WinButton>
            <WinButton @click="showFileMessage('Save file')" title="Save file" style="width: 36px; height: 32px; padding: 0; min-width: 0;"><span class="icon">&#xE74E;</span></WinButton>
            <span class="separator"></span>
            <WinButton @click="customEditor?.execCommand('bold')" title="Bold" style="width: 36px; height: 32px; padding: 0; min-width: 0;"><span class="icon">&#xE8DD;</span></WinButton>
            <WinButton @click="customEditor?.execCommand('italic')" title="Italic" style="width: 36px; height: 32px; padding: 0; min-width: 0;"><span class="icon">&#xE8DB;</span></WinButton>
            <button v-for="color in colors" :key="color" class="color-button" :style="{ background: color }" :title="color" @click="customEditor?.execCommand('foreColor', color)"></button>
          </div>
          <WinRichEditBox ref="customEditor" v-model:Html="customHtml" :ShowFormattingCommands="false" PlaceholderText="Compose formatted text" :Height="200" />
          <div class="find-row">
            <WinTextBlock Text="Find:" />
            <WinTextBox v-model:Text="findText" PlaceholderText="Enter search text" style="width: 224px;" />
          </div>
        </div>
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="RichEditBox in math mode" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example4Template">
      <template #example>
        <div class="stack-example">
          <WinTextBlock class="note-text" Text="Math mode enables users to have input automatically recognized and converted to math expressions while being received." TextWrapping="WrapWholeWords" />
          <WinTextBlock class="note-text" Text="For example, &quot;4^2&quot; is converted to &quot;4²&quot;, and &quot;\pi&quot; is converted to &quot;π&quot;." TextWrapping="WrapWholeWords" />
          <WinRichEditBox v-model:Text="mathText" PlaceholderText="Enter math expressions like: 4^2, \pi, \alpha, \beta" :ShowFormattingCommands="false" :Width="724" :Height="80" />
        </div>
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="Working with MathML in RichEditBox" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" horizontalContentAlignment="Stretch" :vue="example5Template">
      <template #example>
        <div class="stack-example">
          <WinTextBlock class="note-text" Text="The SetMathML method takes a MathML string and displays the equation in the RichEditBox." TextWrapping="WrapWholeWords" />
          <WinTextBlock class="note-text" Text="The GetMathML method retrieves the MathML string of the equation from the RichEditBox." TextWrapping="WrapWholeWords" />
          <WinRichEditBox v-model:Text="mathmlText" :ShowFormattingCommands="false" :Height="80" @TextChanged="updateMathmlOutput" />
          <WinTextBlock class="mathml-title" Text="MathML Code" />
          <pre class="mathml-output">{{ mathmlOutput }}</pre>
        </div>
      </template>
      <template #options>
        <WinButton @click="setSampleFormula"><WinTextBlock Text="Set sample formula" /></WinButton>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinRichEditBox from '../../components/WinRichEditBox.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinTextBox from '../../components/WinTextBox.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'richeditbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const simpleText = ref('');
const customHtml = ref('');
const findText = ref('');
const mathText = ref('');
const mathmlText = ref('');
const mathmlOutput = ref('<!-- No MathML content -->');
const customEditor = ref(null);
const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet', 'Gray'];

const showFileMessage = (action) => {
  console.log(`${action} clicked`);
};

const updateMathmlOutput = ({ text }) => {
  mathmlOutput.value = text.trim() ? `<!-- Web preview content -->\n${text}` : '<!-- No MathML content -->';
};

const setSampleFormula = () => {
  mathmlText.value = 'x ∈ P(A) ↔ x ⊆ A';
  mathmlOutput.value = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>x</mi>
  <mo>∈</mo>
  <mi>P</mi>
  <mfenced><mi>A</mi></mfenced>
  <mo>↔</mo>
  <mi>x</mi>
  <mo>⊆</mo>
  <mi>A</mi>
</math>`;
};

const example1Template = `<WinRichEditBox
  v-model:Text="simpleText"
  PlaceholderText="Enter rich text" />`;

const example2Template = `<WinRichEditBox
  Header="Editor with custom menu"
  PlaceholderText="Select text and use the command menu."
  :Width="800"
  :Height="200" />`;

const example3Template = `<div class="custom-editor">
  <div class="custom-toolbar">
    <WinButton @click="openFile"><span class="icon">&#xE8E5;</span></WinButton>
    <WinButton @click="saveFile"><span class="icon">&#xE74E;</span></WinButton>
    <WinButton @click="editor?.execCommand('bold')"><span class="icon">&#xE8DD;</span></WinButton>
    <WinButton @click="editor?.execCommand('italic')"><span class="icon">&#xE8DB;</span></WinButton>
  </div>
  <WinRichEditBox ref="editor" v-model:Html="customHtml" />
  <WinTextBox v-model:Text="findText" PlaceholderText="Enter search text" />
</div>`;

const example4Template = `<WinRichEditBox
  v-model:Text="mathText"
  PlaceholderText="Enter math expressions like: 4^2, \\pi"
  :ShowFormattingCommands="false"
  :Width="724"
  :Height="80" />`;

const example5Template = `<WinRichEditBox
  v-model:Text="mathmlText"
  :ShowFormattingCommands="false"
  :Height="80"
  @TextChanged="updateMathmlOutput" />
<pre>{{ mathmlOutput }}</pre>
<WinButton @click="setSampleFormula">
  <WinTextBlock Text="Set sample formula" />
</WinButton>`;
</script>

<style scoped>
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px 0; color: var(--text-primary); }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 0 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; align-items: center; }
.icon { font-size: 16px; font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets'; }
.custom-editor, .stack-example { width: 100%; display: flex; flex-direction: column; gap: 10px; }
.custom-toolbar { display: flex; align-items: center; gap: 4px; }
.separator { width: 1px; height: 24px; margin: 0 4px; background: var(--divider-stroke); }
.color-button { width: 24px; height: 24px; border: 1px solid var(--card-stroke); border-radius: 4px; cursor: pointer; }
.find-row { display: flex; align-items: center; gap: 10px; color: var(--text-primary); }
.note-text { color: var(--text-primary); font-size: 14px; line-height: 20px; }
.mathml-title { color: var(--text-primary); font-weight: 600; }
.mathml-output { margin: 0; padding: 8px; max-height: 450px; overflow: auto; border-radius: 4px; background: var(--card-bg-secondary); color: var(--text-primary); font-family: Consolas, 'Courier New', monospace; font-size: 12px; line-height: 18px; }
</style>
