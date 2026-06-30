<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">RichEditBox</h1>
      <p class="page-description">
        The RichEditBox control lets a user enter formatted text such as bold, italic, and underlined. RichEditBox can also display and edit Rich Text Format (.rtf) files.
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

    <!-- Example 1: Simple Text Editor -->
    <p class="control-example-description">A simple text editor</p>
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :xaml="example1Template"
      :cSharp="example1Vue">
      <template #example>
        <WinRichEditBox
          v-model="simpleEditorContent"
          :showToolbar="true"
          ariaLabel="simple text editor"
          style="width: 100%;" />
      </template>
    </WinControlExample>

    <!-- Example 2: Custom Editor with Formatting Toolbar -->
    <p class="control-example-description">A custom editor with formatting</p>
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :xaml="example2Template"
      :cSharp="example2Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          <!-- Custom Toolbar -->
          <div class="custom-toolbar">
            <WinButton
              Style="{StaticResource SubtleButtonStyle}"
              @click="openFile"
              style="width: 40px; height: 32px; padding: 0; min-width: 0;"
              title="Open file">
              <span class="icon">&#xE8E5;</span>
            </WinButton>
            <WinButton
              Style="{StaticResource SubtleButtonStyle}"
              @click="saveFile"
              style="width: 40px; height: 32px; padding: 0; min-width: 0;"
              title="Save file">
              <span class="icon">&#xE74E;</span>
            </WinButton>

            <div class="toolbar-separator"></div>

            <WinButton
              Style="{StaticResource SubtleButtonStyle}"
              @click="toggleBold"
              :class="{ 'format-active': isBold }"
              style="width: 40px; height: 32px; padding: 0; min-width: 0;"
              title="Bold">
              <span class="icon">&#xE8DD;</span>
            </WinButton>
            <WinButton
              Style="{StaticResource SubtleButtonStyle}"
              @click="toggleItalic"
              :class="{ 'format-active': isItalic }"
              style="width: 40px; height: 32px; padding: 0; min-width: 0;"
              title="Italic">
              <span class="icon">&#xE8DB;</span>
            </WinButton>

            <div class="toolbar-separator"></div>

            <div class="color-picker-container">
              <WinButton
                Style="{StaticResource SubtleButtonStyle}"
                @click="showColorPicker = !showColorPicker"
                style="width: 40px; height: 32px; padding: 0; min-width: 0;"
                title="Font color">
                <span class="icon">&#xE790;</span>
              </WinButton>
              <div v-if="showColorPicker" class="color-picker-flyout">
                <div class="color-grid">
                  <button
                    v-for="color in fontColors"
                    :key="color.name"
                    class="color-button"
                    :style="{ background: color.value }"
                    :title="color.name"
                    @click="applyColor(color.value)">
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Editor -->
          <WinRichEditBox
            ref="customEditorRef"
            v-model="customEditorContent"
            :showToolbar="false"
            ariaLabel="Custom editor"
            @textChanged="onEditorTextChanged"
            @gotFocus="onEditorGotFocus"
            style="width: 100%; min-height: 200px;" />

          <!-- Find Box -->
          <div class="find-container">
            <span class="find-label">Find:</span>
            <WinTextBox
              v-model:Text="findText"
              PlaceholderText="Enter search text"
              @TextChanged="onFindTextChanged"
              @GotFocus="highlightMatches"
              @LostFocus="removeHighlights"
              style="width: 224px; margin-left: 10px;" />
          </div>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 3: Math Mode -->
    <p class="control-example-description">Rich edit box in math mode</p>
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :xaml="example3Template"
      :cSharp="example3Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          <div class="math-description">
            <p><strong>Math mode</strong> enables users to have input automatically recognized and converted to math expressions while being received.</p>
            <p>It uses <a href="https://www.unicode.org/notes/tn28/" target="_blank">Unicode Nearly Plain-Text Encoding of Mathematics</a>, which allows mathematical notation to be represented in a linear format and automatically converted into proper math equations.</p>
            <p>For example, "4^2" is converted to "4²", and "\pi" is converted to "π".</p>
            <p><em>Note: Math mode would use Cambria Math font and specialized rendering in the full WinUI implementation. This is a simplified web representation.</em></p>
          </div>

          <WinRichEditBox
            v-model="mathEditorContent"
            :showToolbar="false"
            placeholderText="Enter math expressions like: 4^2, \pi, \alpha, \beta"
            ariaLabel="Math editor"
            style="width: 724px; max-width: 100%; height: 80px; font-size: 16px;" />
        </div>
      </template>
    </WinControlExample>

    <!-- Example 4: Working with MathML -->
    <p class="control-example-description">Working with MathML in RichEditBox</p>
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :xaml="example4Template"
      :cSharp="example4Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
          <div class="math-description">
            <p>The <strong>SetMathML</strong> method takes a <a href="https://www.w3.org/Math/" target="_blank">MathML</a> string and displays the equation in the RichEditBox. It replaces any existing equation with the new one.</p>
            <p>The <strong>GetMathML</strong> method retrieves the MathML string of the equation from the RichEditBox. However, it only works if the equation is in a single line. If the text spans multiple lines, it returns an empty string, but the equation will still be rendered correctly.</p>
            <p>Setting the math mode in the RichEditBox is necessary to use these methods. It can be enabled using <code>SetMathMode(RichEditMathMode.MathOnly)</code>.</p>
            <p><strong>SetMathML</strong> and <strong>GetMathML</strong> can be used to restore and save equations.</p>
            <p><em>Note: This is a web simulation. Full MathML rendering requires specialized libraries.</em></p>
          </div>

          <WinRichEditBox
            ref="mathEditor2Ref"
            v-model="mathEditor2Content"
            :showToolbar="false"
            @textChanged="onMathEditor2Changed"
            ariaLabel="MathML editor"
            style="width: 724px; max-width: 100%; height: 80px; font-size: 16px;" />

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-weight: 600; color: var(--text-primary);">MathML Code</span>
            <div class="mathml-output">
              <pre style="margin: 0; padding: 8px; font-size: 12px; line-height: 1.4; overflow-x: auto;">{{ mathmlOutput }}</pre>
            </div>
          </div>
        </div>
      </template>
      <template #options>
        <WinButton
          @click="setSampleFormula"
          style="min-width: 140px;">
          Set sample formula
        </WinButton>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import WinRichEditBox from '../components/WinRichEditBox.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { createPageState } from '../utils/pageState';
import WinTextBox from '../components/WinTextBox.vue';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'richeditbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example 1: Simple Text Editor
const simpleEditorContent = ref('');

const example1Template = `<WinRichEditBox
  v-model="simpleEditorContent"
  :showToolbar="true"
  ariaLabel="simple text editor"
  style="width: 100%;" />`;

const example1Vue = `const simpleEditorContent = ref('');`;

// Example 2: Custom Editor
const customEditorContent = ref('');
const customEditorRef = ref(null);
const findText = ref('');
const showColorPicker = ref(false);
const isBold = ref(false);
const isItalic = ref(false);

const fontColors = [
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Violet', value: 'violet' },
  { name: 'Gray', value: 'gray' }
];

const openFile = () => {
  console.log('Open file clicked (file picker not available in web)');
  alert('File operations are not available in the web version. In WinUI, this would open a file picker.');
};

const saveFile = () => {
  console.log('Save file clicked');
  alert('File operations are not available in the web version. In WinUI, this would save to a .rtf file.');
};

const toggleBold = () => {
  customEditorRef.value?.execCommand('bold');
  // In a real implementation, we'd check the actual state
  isBold.value = !isBold.value;
};

const toggleItalic = () => {
  customEditorRef.value?.execCommand('italic');
  isItalic.value = !isItalic.value;
};

const applyColor = (color) => {
  customEditorRef.value?.execCommand('foreColor', color);
  showColorPicker.value = false;
  customEditorRef.value?.focus();
};

const onEditorTextChanged = () => {
  // Handle text changed
};

const onEditorGotFocus = () => {
  // Reset to default state on focus
};

const onFindTextChanged = () => {
  if (findText.value) {
    highlightMatches();
  } else {
    removeHighlights();
  }
};

const highlightMatches = () => {
  // In a full implementation, this would highlight matching text
  console.log('Highlighting matches for:', findText.value);
};

const removeHighlights = () => {
  // Remove all highlights
  console.log('Removing highlights');
};

const example2Template = `<div style="display: flex; flex-direction: column; gap: 8px;">
  <!-- Custom Toolbar -->
  <div class="toolbar">
    <WinButton @click="openFile" title="Open file">
      <span class="icon">&#xE8E5;</span>
    </WinButton>
    <WinButton @click="saveFile" title="Save file">
      <span class="icon">&#xE74E;</span>
    </WinButton>
    <WinButton @click="toggleBold" title="Bold">
      <span class="icon">&#xE8DD;</span>
    </WinButton>
    <WinButton @click="toggleItalic" title="Italic">
      <span class="icon">&#xE8DB;</span>
    </WinButton>
  </div>

  <!-- Editor -->
  <WinRichEditBox
    ref="customEditorRef"
    v-model="customEditorContent"
    :showToolbar="false"
    @textChanged="onEditorTextChanged" />

  <!-- Find Box -->
  <div class="find-container">
    <span>Find:</span>
    <WinTextBox
      v-model:Text="findText"
      PlaceholderText="Enter search text"
      @TextChanged="onFindTextChanged" />
  </div>
</div>`;

const example2Vue = `const customEditorContent = ref('');
const customEditorRef = ref(null);
const findText = ref('');

const toggleBold = () => {
  customEditorRef.value?.execCommand('bold');
};

const toggleItalic = () => {
  customEditorRef.value?.execCommand('italic');
};

const applyColor = (color) => {
  customEditorRef.value?.execCommand('foreColor', color);
};`;

// Example 3: Math Mode
const mathEditorContent = ref('');

const example3Template = `<WinRichEditBox
  v-model="mathEditorContent"
  :showToolbar="false"
  placeholderText="Enter math expressions"
  style="height: 80px; font-size: 16px;" />`;

const example3Vue = `const mathEditorContent = ref('');

// In WinUI, math mode would be enabled with:
// mathEditor.TextDocument.SetMathMode(RichEditMathMode.MathOnly);`;

// Example 4: MathML
const mathEditor2Content = ref('');
const mathEditor2Ref = ref(null);
const mathmlOutput = ref('<!-- No MathML content -->');

const onMathEditor2Changed = () => {
  // In a real implementation, this would extract MathML
  if (mathEditor2Content.value.trim()) {
    mathmlOutput.value = '<!-- MathML extraction not available in web version -->\n' +
                        '<!-- Content: ' + mathEditor2Content.value.substring(0, 50) + '... -->';
  } else {
    mathmlOutput.value = '<!-- No MathML content -->';
  }
};

const setSampleFormula = () => {
  const formulaMathML = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>x</mi>
  <mo>∈</mo>
  <mi>P</mi>
  <mfenced>
    <mrow>
      <mi>A</mi>
    </mrow>
  </mfenced>
  <mo>↔</mo>
  <mi>x</mi>
  <mo>⊆</mo>
  <mi>A</mi>
</math>`;

  mathmlOutput.value = formulaMathML;
  mathEditor2Content.value = 'x ∈ P(A) ↔ x ⊆ A';
  alert('In WinUI, this would use SetMathML() to render the formula. Web version shows a simplified representation.');
};

const example4Template = `<WinRichEditBox
  ref="mathEditor2Ref"
  v-model="mathEditor2Content"
  :showToolbar="false"
  @textChanged="onMathEditor2Changed"
  style="height: 80px; font-size: 16px;" />

<div class="mathml-output">
  <pre>{{ mathmlOutput }}</pre>
</div>

<!-- Options: Button to set sample formula -->
<WinButton @click="setSampleFormula">
  Set sample formula
</WinButton>`;

const example4Vue = `const mathEditor2Content = ref('');
const mathmlOutput = ref('<!-- No MathML content -->');

const onMathEditor2Changed = () => {
  // Extract MathML content
  let extractedMathML;
  mathEditor2.Document.GetMathML(out extractedMathML);

  if (!string.IsNullOrEmpty(extractedMathML)) {
    mathmlOutput.value = FormatMathML(extractedMathML);
  } else {
    mathmlOutput.value = '<!-- No MathML content -->';
  }
};

const setSampleFormula = () => {
  const formulaMathML = \`<math>
    <mi>x</mi><mo>∈</mo><mi>P</mi>
    <mfenced><mi>A</mi></mfenced>
    <mo>↔</mo><mi>x</mi><mo>⊆</mo><mi>A</mi>
  </math>\`;

  mathEditor2.Document.SetMathML(formulaMathML);
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

/* Custom Toolbar */
.custom-toolbar {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 8px;
  background: var(--layer-fill-alt);
  border: 1px solid var(--divider-stroke);
  border-radius: 4px;
}

.toolbar-separator {
  width: 1px;
  height: 24px;
  background: var(--divider-stroke);
  margin: 0 4px;
}

.format-active {
  background: var(--subtle-fill-secondary) !important;
  color: var(--accent-base) !important;
}

/* Color Picker */
.color-picker-container {
  position: relative;
}

.color-picker-flyout {
  position: absolute;
  top: 40px;
  left: 0;
  background: var(--layer-fill);
  border: 1px solid var(--ctrl-strong-stroke);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  z-index: 1000;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.color-button {
  width: 32px;
  height: 32px;
  border: 1px solid var(--divider-stroke);
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.color-button:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.color-button:active {
  transform: scale(0.95);
}

/* Find Container */
.find-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.find-label {
  font-size: 14px;
  color: var(--text-primary);
}

/* Math Description */
.math-description {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
}

.math-description p {
  margin: 0;
}

.math-description a {
  color: var(--accent-base);
  text-decoration: none;
}

.math-description a:hover {
  text-decoration: underline;
}

.math-description code {
  font-family: 'Consolas', 'Courier New', monospace;
  background: var(--subtle-fill-secondary);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.math-description em {
  color: var(--text-secondary);
  font-style: italic;
}

/* MathML Output */
.mathml-output {
  background: var(--layer-fill-alt);
  border: 1px solid var(--divider-stroke);
  border-radius: 4px;
  padding: 8px;
  max-height: 450px;
  overflow-y: auto;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  color: var(--text-primary);
}
</style>


