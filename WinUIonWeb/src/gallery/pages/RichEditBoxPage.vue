<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.richeditbox')" />
          <WinTextBlock class="page-description" :Text="$t('text.the-richeditbox-control-lets-a-user-enter-format')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }" @click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton class="header-action" :IsChecked="isFavoriteState" v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" horizontalContentAlignment="Stretch" :vue="example1Template" :headerText="$t('text.a-simple-text-editor')">
              <template #example>
                <WinRichEditBox v-model:Text="simpleText" :PlaceholderText="$t('text.enter-rich-text')" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template" :headerText="$t('sample.richeditbox.custom-command-flyout')">
              <template #example>
                <WinRichEditBox
                  :PrimaryCommands="customFlyoutPrimaryCommands"
                  :Width="800"
                  :Height="200" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" horizontalContentAlignment="Stretch" :vue="example3Template" :headerText="$t('sample.richeditbox.custom-formatting-editor')">
              <template #example>
                <div class="official-custom-editor">
                  <div class="official-toolbar">
                    <div class="toolbar-start">
                      <WinButton class="toolbar-icon-button" @click="showFileMessage($t('sample.richeditbox.open-file'))" v-bind="{ 'tooltipservice.tooltip': $t('sample.richeditbox.open-file') }"><span class="icon">&#xE8E5;</span></WinButton>
                      <WinButton class="toolbar-icon-button" @click="showFileMessage($t('sample.richeditbox.save-file'))" v-bind="{ 'tooltipservice.tooltip': $t('sample.richeditbox.save-file') }"><span class="icon">&#xE74E;</span></WinButton>
                    </div>
                    <div class="toolbar-end">
                      <WinButton class="toolbar-icon-button" @click="customEditor?.execCommand('bold')" v-bind="{ 'tooltipservice.tooltip': $t('sample.richeditbox.bold') }"><span class="icon">&#xE8DD;</span></WinButton>
                      <WinButton class="toolbar-icon-button" @click="customEditor?.execCommand('italic')" v-bind="{ 'tooltipservice.tooltip': $t('sample.richeditbox.italic') }"><span class="icon">&#xE8DB;</span></WinButton>
                      <WinFlyout ref="fontColorFlyout" Placement="Bottom" :Theme="pageTheme">
                        <template #trigger>
                          <WinButton class="toolbar-icon-button" @click="fontColorFlyout?.toggle()" v-bind="{ 'tooltipservice.tooltip': $t('sample.richeditbox.font-color') }"><span class="icon">&#xE790;</span></WinButton>
                        </template>
                        <div class="font-color-flyout">
                          <button
                            v-for="color in colors"
                            :key="color.value"
                            class="color-menu-button"
                            :aria-label="color.label"
                            v-bind="{ 'tooltipservice.tooltip': color.label }"
                            @click="applyEditorColor(color.value)">
                            <span class="color-swatch" :style="{ background: color.value }"></span>
                          </button>
                        </div>
                      </WinFlyout>
                    </div>
                  </div>
                  <WinRichEditBox ref="customEditor" v-model:Html="customHtml" :ShowFormattingCommands="false" :Height="200" />
                  <div class="official-find-row">
                    <WinTextBlock :Text="$t('sample.richeditbox.find-label')" />
                    <WinTextBox v-model:Text="findText" :PlaceholderText="$t('sample.richeditbox.search-placeholder')" style="width: 224px;" />
                  </div>
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example4Template" :headerText="$t('sample.richeditbox.math-mode')">
              <template #example>
                <div class="stack-example">
                  <WinTextBlock class="note-text" :Text="$t('sample.richeditbox.math-note')" TextWrapping="WrapWholeWords" />
                  <WinTextBlock class="note-text" :Text="$t('sample.richeditbox.math-example')" TextWrapping="WrapWholeWords" />
                  <WinRichEditBox v-model:Text="mathText" :PlaceholderText="$t('sample.richeditbox.math-placeholder')" :ShowFormattingCommands="false" :Width="724" :Height="80" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" horizontalContentAlignment="Stretch" :vue="example5Template" :headerText="$t('sample.richeditbox.mathml')">
              <template #example>
                <div class="stack-example">
                  <WinTextBlock class="note-text" :Text="$t('sample.richeditbox.mathml-set-note')" TextWrapping="WrapWholeWords" />
                  <WinTextBlock class="note-text" :Text="$t('sample.richeditbox.mathml-get-note')" TextWrapping="WrapWholeWords" />
                  <WinRichEditBox v-model:Text="mathmlText" :ShowFormattingCommands="false" :Height="80" @TextChanged="updateMathmlOutput" />
                  <WinTextBlock class="mathml-title" :Text="$t('sample.richeditbox.mathml-code')" />
                  <WinScrollViewer class="mathml-output" VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" HorizontalScrollBarVisibility="Auto">
                    <pre class="mathml-output-pre">{{ mathmlOutput }}</pre>
                  </WinScrollViewer>
                </div>
              </template>
              <template #options>
                <WinButton @click="setSampleFormula"><WinTextBlock :Text="$t('sample.richeditbox.set-sample-formula')" /></WinButton>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinFlyout from '../../components/WinFlyout.vue';
import WinRichEditBox from '../../components/WinRichEditBox.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinTextBox from '../../components/WinTextBox.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'richeditbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const simpleText = ref('');
const customHtml = ref('');
const findText = ref('');
const mathText = ref('');
const mathmlText = ref('');
const mathmlOutput = ref(`<!-- ${t('sample.richeditbox.no-mathml')} -->`);
const customEditor = ref(null);
const fontColorFlyout = ref(null);
const colors = computed(() => [
  { value: 'Red', label: t('text.red') },
  { value: 'Orange', label: t('sample.orange') },
  { value: 'Yellow', label: t('text.yellow') },
  { value: 'Green', label: t('text.green') },
  { value: 'Blue', label: t('text.blue') },
  { value: 'Indigo', label: t('sample.indigo') },
  { value: 'Violet', label: t('sample.violet') },
  { value: 'Gray', label: t('sample.gray') }
]);

const customFlyoutPrimaryCommands = computed(() => [
  {
    Label: t('sample.richeditbox.share-command'),
    Icon: 'Share',
    'ToolTipService.ToolTip': t('sample.richeditbox.share-command'),
    Click: onCustomFlyoutCommand
  }
]);

const showFileMessage = (action) => {
  console.log(`${action} clicked`);
};

const onCustomFlyoutCommand = () => {
  console.log(t('sample.richeditbox.share-clicked'));
};

const applyEditorColor = (color) => {
  customEditor.value?.execCommand('foreColor', color);
  fontColorFlyout.value?.hide?.();
};

const updateMathmlOutput = () => {
  const text = mathmlText.value;
  mathmlOutput.value = text.trim() ? `<!-- ${t('sample.richeditbox.web-preview')} -->\n${text}` : `<!-- ${t('sample.richeditbox.no-mathml')} -->`;
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

const example1Template = computed(() => `<WinRichEditBox
  v-model:Text="simpleText"
  PlaceholderText="${t('text.enter-rich-text')}" />`);

const example2Template = computed(() => `<WinRichEditBox
  :PrimaryCommands="customFlyoutPrimaryCommands"
  :Width="800"
  :Height="200" />`);

const example3Template = computed(() => `<div class="official-custom-editor">
  <div class="official-toolbar">
    <div class="toolbar-start">
      <WinButton class="toolbar-icon-button" @click="openFile"><span class="icon">&#xE8E5;</span></WinButton>
      <WinButton class="toolbar-icon-button" @click="saveFile"><span class="icon">&#xE74E;</span></WinButton>
    </div>
    <div class="toolbar-end">
      <WinButton class="toolbar-icon-button" @click="editor?.execCommand('bold')"><span class="icon">&#xE8DD;</span></WinButton>
      <WinButton class="toolbar-icon-button" @click="editor?.execCommand('italic')"><span class="icon">&#xE8DB;</span></WinButton>
      <WinFlyout ref="fontColorFlyout" Placement="Bottom" :Theme="pageTheme">
        <template #trigger>
          <WinButton class="toolbar-icon-button" @click="fontColorFlyout?.toggle()"><span class="icon">&#xE790;</span></WinButton>
        </template>
        <div class="font-color-flyout">
          <button v-for="color in colors" :key="color.value" class="color-menu-button" @click="applyEditorColor(color.value)">
            <span class="color-swatch" :style="{ background: color.value }"></span>
          </button>
        </div>
      </WinFlyout>
    </div>
  </div>
  <WinRichEditBox ref="editor" v-model:Html="customHtml" :Height="200" />
  <WinTextBox v-model:Text="findText" PlaceholderText="${t('sample.richeditbox.search-placeholder')}" />
</div>`);

const example4Template = computed(() => `<WinRichEditBox
  v-model:Text="mathText"
  PlaceholderText="${t('sample.richeditbox.math-placeholder')}"
  :ShowFormattingCommands="false"
  :Width="724"
  :Height="80" />`);

const example5Template = computed(() => `<WinRichEditBox
  v-model:Text="mathmlText"
  :ShowFormattingCommands="false"
  :Height="80"
  @TextChanged="updateMathmlOutput" />
<pre>{{ mathmlOutput }}</pre>
<WinButton @click="setSampleFormula">
  <WinTextBlock Text="${t('sample.richeditbox.set-sample-formula')}" />
</WinButton>`);
</script>

<style scoped>
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px 0; color: var(--text-primary); }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 0 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; align-items: center; }
.icon { font-size: 16px; }
.official-custom-editor, .stack-example { width: 100%; display: flex; flex-direction: column; gap: 10px; }
.official-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.toolbar-start, .toolbar-end { display: flex; align-items: center; gap: 8px; }
.toolbar-icon-button { width: 36px; height: 32px; padding: 0; min-width: 0; border-width: 0; background: transparent; }
.font-color-flyout { display: grid; grid-template-columns: repeat(3, 32px); gap: 12px; padding: 6px; }
.color-menu-button { width: 32px; height: 32px; min-width: 0; padding: 0; border: 0; background: transparent; border-radius: 4px; cursor: pointer; }
.color-menu-button:hover { background: var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)); }
.color-menu-button:active { background: var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)); }
.color-swatch { display: block; width: 32px; height: 32px; border-radius: 2px; box-shadow: inset 0 0 0 1px var(--card-stroke); }
.official-find-row { display: flex; align-items: center; gap: 10px; color: var(--text-primary); }
.note-text { color: var(--text-primary); font-size: 14px; line-height: 20px; }
.mathml-title { color: var(--text-primary); font-weight: 600; }
.mathml-output { margin: 0; padding: 8px; max-height: 450px; border-radius: 4px; background: var(--card-bg-secondary); color: var(--text-primary); }
.mathml-output-pre { margin: 0; min-width: max-content; color: inherit; font-family: Consolas, 'Courier New', monospace; font-size: 12px; line-height: 18px; }
</style>
