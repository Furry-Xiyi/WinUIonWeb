<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.togglesplitbutton')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-button-that-can-be-toggled-on-off-with-additio')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="toggleSplitButtonVue" :headerText="$t('sample.togglesplitbutton.bullet-list')">
              <template #example>
                <WinToggleSplitButton v-model:IsChecked="myListButton" VerticalAlignment="Top" :Theme="pageTheme" v-bind="{ 'AutomationProperties.Name': automationName }" @IsCheckedChanged="MyListButton_IsCheckedChanged">
                  <span class="icon">{{ listIcon }}</span>
                  <template #flyout="{ close }">
                    <div class="bullet-flyout">
                      <WinButton class="bullet-option-button" Padding="4" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Bulleted list" @Click="BulletButton_Click('List', close)">
                        <span class="icon">{{ listSymbolGlyph }}</span>
                      </WinButton>
                      <WinButton class="bullet-option-button" Padding="4" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Roman numerals list" @Click="BulletButton_Click('Bullets', close)">
                        <span class="icon">{{ bulletsSymbolGlyph }}</span>
                      </WinButton>
                    </div>
                  </template>
                </WinToggleSplitButton>
              </template>
              <template #options>
                <WinRichEditBox
                  ref="richEditBox"
                  v-model:Text="richText"
                  :Width="240"
                  :MinHeight="96"
                  :ShowFormattingCommands="false" />
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, nextTick, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinRichEditBox from '../../components/WinRichEditBox.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSplitButton from '../../components/WinToggleSplitButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'togglesplitbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const myListButton = ref(false);
const listType = ref('List');
const richEditBox = ref(null);
const listSymbolGlyph = '\uE14C';
const bulletsSymbolGlyph = '\uE133';
const listIcon = computed(() => listType.value === 'List' ? listSymbolGlyph : bulletsSymbolGlyph);
const automationName = computed(() => listType.value === 'List' ? 'Bullets' : 'Roman Numerals');
const richText = ref('Lorem ipsum dolor sit amet\nTempor commodo ullamcorper');

const listCommand = computed(() => listType.value === 'List' ? 'insertUnorderedList' : 'insertOrderedList');
const otherListCommand = computed(() => listType.value === 'List' ? 'insertOrderedList' : 'insertUnorderedList');

const applyListState = async (isChecked = myListButton.value) => {
  await nextTick();
  const editor = richEditBox.value;
  if (!editor) return;
  if (!editor.hasSelection?.()) editor.execCommand?.('selectAll');

  if (isChecked) {
    if (editor.queryCommandState?.(otherListCommand.value)) editor.execCommand?.(otherListCommand.value);
    if (!editor.queryCommandState?.(listCommand.value)) editor.execCommand?.(listCommand.value);
    editor.setListStyleType?.(listType.value === 'Bullets' ? 'upper-roman' : 'disc');
  } else {
    if (editor.queryCommandState?.(listCommand.value)) editor.execCommand?.(listCommand.value);
    if (editor.queryCommandState?.(otherListCommand.value)) editor.execCommand?.(otherListCommand.value);
  }

  editor.focus?.();
};

const BulletButton_Click = async (symbol, close) => {
  listType.value = symbol;
  myListButton.value = true;
  await applyListState(true);
  close?.();
};

const MyListButton_IsCheckedChanged = (args) => {
  applyListState(Boolean(args?.IsChecked));
};

const toggleSplitButtonVue = `<WinToggleSplitButton v-model:IsChecked="myListButton" VerticalAlignment="Top" :Theme="pageTheme" AutomationProperties.Name="Bullets" @IsCheckedChanged="MyListButton_IsCheckedChanged">
  <span class="icon">{{ listIcon }}</span>
  <template #flyout>
    <div class="bullet-flyout">
      <WinButton Padding="4" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Bulleted list" @Click="BulletButton_Click('List')">
        <span class="icon">&#xE14C;</span>
      </WinButton>
      <WinButton Padding="4" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Roman numerals list" @Click="BulletButton_Click('Bullets')">
        <span class="icon">&#xE133;</span>
      </WinButton>
    </div>
  </template>
</WinToggleSplitButton>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.bullet-flyout { display: flex; padding: 4px; }
.bullet-option-button { line-height: 20px; }
.bullet-option-button :deep(.icon) {
  display: block;
  width: 20px;
  height: 20px;
  font-size: 20px;
  line-height: 20px;
}
</style>
