<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.textbox')" />
          <TextBlock class="page-description" :Text="$t('text.use-a-textbox-to-let-a-user-enter-simple-text-in')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @click="toggleTheme"
             >
              <span class="icon"></span>
            </Button>
            <ToggleButton class="header-action" :IsChecked="isFavoriteState"
              @update:IsChecked="toggleFavorite"
             >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <!-- Example 1: A simple TextBox -->
            <ControlExample class="basic-input-example-theme"
              :headerText="$t('text.a-simple-textbox')"
              :theme="pageTheme"
              :vue="example1Template">
              <template #example>
                <TextBox v-model:Text="simpleText" />
              </template>
            </ControlExample>

            <!-- Example 2: A TextBox with a header and placeholder text -->
            <ControlExample class="basic-input-example-theme"
              :headerText="$t('sample.textbox.header-placeholder')"
              :theme="pageTheme"
              :vue="example2Template">
              <template #example>
                <TextBox
                  v-model:Text="nameText"
                  :Header="$t('sample.textbox.enter-your-name')"
                  :PlaceholderText="$t('sample.textbox.name-placeholder')" />
              </template>
            </ControlExample>

            <!-- Example 3: A read-only TextBox with various properties set -->
            <ControlExample class="basic-input-example-theme"
              :headerText="$t('sample.textbox.readonly-properties')"
              :theme="pageTheme"
              :vue="example3Template">
              <template #example>
                <TextBox
                  :Text="$t('sample.common.excited-text')"
                  :IsReadOnly="true"
                  FontFamily="Arial"
                  :FontSize="24"
                  FontStyle="Italic"
                  :CharacterSpacing="200"
                  Foreground="#5178BE" />
              </template>
            </ControlExample>

            <!-- Example 4: A multi-line TextBox with spell checking and custom selection highlight color -->
            <ControlExample class="basic-input-example-theme"
              :headerText="$t('sample.textbox.multiline-spellcheck-selection')"
              :theme="pageTheme"
              :vue="example4Template">
              <template #example>
                <TextBox
                  :MinWidth="400"
                  :AcceptsReturn="true"
                  TextWrapping="Wrap"
                  :IsSpellCheckEnabled="true"
                  SelectionHighlightColor="Green" />
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import TextBox from '../../components/TextBox.vue';
import TextBlock from '../../components/TextBlock.vue';
import ControlExample from '../../components/ControlExample.vue';
import Button from '../../components/Button.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'textbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

// Example 1: Simple TextBox
const simpleText = ref('');

const example1Template = `<TextBox v-model:Text="simpleText" />`;

// Example 2: TextBox with header and placeholder
const nameText = ref('');

const example2Template = computed(() => `<TextBox
  v-model:Text="nameText"
  Header="${t('sample.textbox.enter-your-name')}"
  PlaceholderText="${t('sample.textbox.name-placeholder')}" />`);

// Example 3: Read-only styled TextBox
const example3Template = computed(() => `<TextBox
  Text="${t('sample.common.excited-text')}"
  :IsReadOnly="true"
  FontFamily="Arial"
  :FontSize="24"
  FontStyle="Italic"
  :CharacterSpacing="200"
  Foreground="#5178BE" />`);

const example4Template = `<TextBox
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
}
</style>

