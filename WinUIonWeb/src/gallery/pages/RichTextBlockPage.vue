<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
      <h1 class="page-header">{{ $t('text.richtextblock') }}</h1>
      <p class="page-description">{{ $t('sample.richtextblock.description') }}</p>
      <div class="page-header-actions">
        <Button class="header-action" v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }"
          @click="toggleTheme"
         >
          <span class="icon">&#xE793;</span>
        </Button>
        <ToggleButton class="header-action" :IsChecked="isFavoriteState"
          v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }"
          @update:IsChecked="toggleFavorite"
         >
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </ToggleButton>
      </div>
    </div>

    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template" :headerText="$t('sample.richtextblock.simple')">
          <template #example>
            <RichTextBlock>
              <p>{{ $t('sample.richtextblock.simple-text') }}</p>
            </RichTextBlock>
          </template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template" :headerText="$t('sample.richtextblock.selection-highlight')">
          <template #example>
            <RichTextBlock class="green-selection" IsTextSelectionEnabled>
              <p>
                {{ $t('sample.richtextblock.rich-container-supports') }}
                <span style="font-style: italic; font-weight: bold;">{{ $t('sample.richtextblock.formatted-text') }}</span>,
                <a href="https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink" target="_blank" class="hyperlink">{{ $t('sample.richtextblock.hyperlinks') }}</a>,
                {{ $t('sample.richtextblock.inline-images-and-rich-content') }}
              </p>
              <p>{{ $t('sample.richtextblock.overflow-support') }}</p>
            </RichTextBlock>
          </template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example3Template" :headerText="$t('sample.richtextblock.overflow')">
          <template #example>
            <div class="overflow-container">
              <div class="overflow-column">
                <RichTextBlock class="overflow-text">
                  <p>{{ $t('sample.richtextblock.overflow-paragraph') }}</p>
                  <p>{{ $t('sample.richtextblock.overflow-long') }}</p>
                </RichTextBlock>
              </div>
              <div class="overflow-column">
                <RichTextBlock class="overflow-text"></RichTextBlock>
              </div>
              <div class="overflow-column">
                <RichTextBlock class="overflow-text"></RichTextBlock>
              </div>
            </div>
          </template>
        </ControlExample>

        <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example4Template" :headerText="$t('sample.richtextblock.custom-highlighting')">
          <template #example>
            <RichTextBlock>
              <p>
                {{ $t('sample.richtextblock.highlight-prefix') }}
                <span :class="`highlight-${highlightColor}`">{{ $t('sample.richtextblock.highlight-word') }}</span>
                {{ $t('sample.richtextblock.highlight-suffix') }}
              </p>
            </RichTextBlock>
          </template>
          <template #options>
            <ComboBox
              v-model:SelectedValue="highlightColor"
              :Header="$t('sample.richtextblock.highlighting-color')"
              :ItemsSource="highlightOptions"
              DisplayMemberPath="label"
              SelectedValuePath="value"
              style="min-width: 200px;" />
          </template>
        </ControlExample>
      </div>
    </ScrollViewer>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ComboBox from '../../components/ComboBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import RichTextBlock from '../../components/RichTextBlock.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'richtextblock');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const highlightColor = ref('yellow');
const highlightOptions = computed(() => [
  { label: t('text.yellow'), value: 'yellow' },
  { label: t('text.red'), value: 'red' },
  { label: t('text.blue'), value: 'blue' }
]);

const example1Template = computed(() => `<RichTextBlock>
  <p>${t('sample.richtextblock.simple-text')}</p>
</RichTextBlock>`);

const example2Template = computed(() => `<RichTextBlock class="green-selection" IsTextSelectionEnabled>
  <p>
    ${t('sample.richtextblock.rich-container-supports')}
    <span style="font-style: italic; font-weight: bold;">${t('sample.richtextblock.formatted-text')}</span>,
    <a href="..." class="hyperlink">${t('sample.richtextblock.hyperlinks')}</a>,
    ${t('sample.richtextblock.inline-images-and-rich-content')}
  </p>
  <p>${t('sample.richtextblock.overflow-support')}</p>
</RichTextBlock>`);

const example3Template = computed(() => `<div class="overflow-container">
  <div class="overflow-column">
    <RichTextBlock class="overflow-text">
      <p>${t('sample.richtextblock.overflow-paragraph')}</p>
      <p>${t('sample.richtextblock.overflow-long')}</p>
    </RichTextBlock>
  </div>
  <div class="overflow-column">
    <RichTextBlock class="overflow-text"></RichTextBlock>
  </div>
  <div class="overflow-column">
    <RichTextBlock class="overflow-text"></RichTextBlock>
  </div>
</div>`);

const example4Template = computed(() => `<RichTextBlock>
  <p>
    ${t('sample.richtextblock.highlight-prefix')}
    <span :class="\`highlight-\${highlightColor}\`">${t('sample.richtextblock.highlight-word')}</span>
    ${t('sample.richtextblock.highlight-suffix')}
  </p>
</RichTextBlock>`);
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

.green-selection {
  --TextBlockSelectionHighlightColor: green;
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
