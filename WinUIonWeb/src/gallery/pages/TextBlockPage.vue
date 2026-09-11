<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.textblock')" />
          <TextBlock class="page-description" :Text="$t('text.the-textblock-control-provides-flexible-text-dis')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template" :headerText="$t('text.a-simple-textblock')">
              <template #example><TextBlock :Text="$t('text.i-am-a-textblock')" /></template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template" :headerText="$t('sample.textblock.style-applied')">
              <template #example><TextBlock Style="{StaticResource CustomTextBlockStyle}" :Text="$t('sample.textblock.styled-text')" /></template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example3Template" :headerText="$t('sample.textblock.properties')">
              <template #example>
                <TextBlock CharacterSpacing="200" FontFamily="Arial" FontSize="24" FontStyle="Italic" Foreground="CornflowerBlue" :Text="$t('sample.common.excited-text')" TextWrapping="WrapWholeWords" />
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example4Template" :headerText="$t('sample.textblock.inline-elements')">
              <template #example>
                <TextBlock>
                  <span style="font-family: 'Times New Roman'; color: DarkGray;">{{ $t('sample.textblock.inline-first') }}</span>
                  <br>
                  <span>{{ $t('sample.textblock.inline-prefix') }} <strong>{{ $t('sample.textblock.inline-bold') }}</strong>, <em>{{ $t('sample.textblock.inline-italic') }}</em>, {{ $t('sample.textblock.inline-or') }} <u>{{ $t('sample.textblock.inline-underlined') }}</u>.</span>
                </TextBlock>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example5Template" :headerText="$t('sample.textblock.selectable')">
              <template #example>
                <TextBlock :IsTextSelectionEnabled="selectionEnabled" SelectionHighlightColor="DarkOrange" :Text="$t('sample.textblock.selectable-text')" />
              </template>
              <template #options>
                <ToggleSwitch v-model="selectionEnabled"><TextBlock :Text="$t('sample.textblock.selection-toggle')" /></ToggleSwitch>
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import ToggleSwitch from '../../components/ToggleSwitch.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'textblock');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const selectionEnabled = ref(false);

const example1Template = computed(() => `<TextBlock Text="${t('text.i-am-a-textblock')}" />`);
const example2Template = computed(() => `<TextBlock Style="{StaticResource CustomTextBlockStyle}" Text="${t('sample.textblock.styled-text')}" />`);
const example3Template = computed(() => `<TextBlock CharacterSpacing="200" FontFamily="Arial" FontSize="24" FontStyle="Italic" Foreground="CornflowerBlue" Text="${t('sample.common.excited-text')}" TextWrapping="WrapWholeWords" />`);
const example4Template = computed(() => `<TextBlock>
  <span style="font-family: 'Times New Roman'; color: DarkGray;">${t('sample.textblock.inline-first')}</span>
  <br>
  <span>${t('sample.textblock.inline-prefix')} <strong>${t('sample.textblock.inline-bold')}</strong>, <em>${t('sample.textblock.inline-italic')}</em>, ${t('sample.textblock.inline-or')} <u>${t('sample.textblock.inline-underlined')}</u>.</span>
</TextBlock>`);
const example5Template = computed(() => `<TextBlock
  :IsTextSelectionEnabled="selectionEnabled"
  SelectionHighlightColor="DarkOrange"
  Text="${t('sample.textblock.selectable-text')}" />`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
