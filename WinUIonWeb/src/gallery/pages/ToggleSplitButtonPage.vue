<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.togglesplitbutton'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.a-button-that-can-be-toggled-on-off-with-additio'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="ToggleSplitButton\ToggleSplitButtonBulletList.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind toggleSplitButtonVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.togglesplitbutton.bullet-list'), Mode=OneWay}">
              <ToggleSplitButton IsChecked="{x:Bind myListButton, Mode=TwoWay}" VerticalAlignment="Top" AutomationProperties.Name="{x:Bind automationName, Mode=OneWay}" IsCheckedChanged="MyListButton_IsCheckedChanged">
                  <SymbolIcon Symbol="{x:Bind listType, Mode=OneWay}" />
                  <ToggleSplitButton.Flyout>
                    <Flyout Placement="Bottom">
                      <StackPanel Orientation="Horizontal">
                        <Button Padding="4" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Bulleted list" Click="List_Click">
                          <SymbolIcon Symbol="List" />
                        </Button>
                        <Button Padding="4" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Roman numerals list" Click="Bullets_Click">
                          <SymbolIcon Symbol="Bullets" />
                        </Button>
                      </StackPanel>
                    </Flyout>
                  </ToggleSplitButton.Flyout>
              </ToggleSplitButton>
              <ControlExample.Options>
                <RichEditBox
                  ref="richEditBox"
                  Width="{x:Bind 240, Mode=OneWay}"
                  MinHeight="{x:Bind 96, Mode=OneWay}"
                  AutomationProperties.Name="{x:Bind $t('text.enter-rich-text'), Mode=OneWay}" />
              </ControlExample.Options>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, nextTick, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import RichEditBox from '../../components/RichEditBox.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import ToggleSplitButton from '../../components/ToggleSplitButton.vue';
import Flyout from '../../components/Flyout.vue';
import StackPanel from '../../components/StackPanel.vue';
import SymbolIcon from '../../components/SymbolIcon.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
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

const listCommand = computed(() => listType.value === 'List' ? 'insertUnorderedList' : 'insertOrderedList');
const otherListCommand = computed(() => listType.value === 'List' ? 'insertOrderedList' : 'insertUnorderedList');

const applyListState = async (isChecked = myListButton.value) => {
  await nextTick();
  const editor = richEditBox.value;
  if (!editor) return;
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
const List_Click = () => BulletButton_Click('List');
const Bullets_Click = () => BulletButton_Click('Bullets');

const MyListButton_IsCheckedChanged = (args) => {
  applyListState(Boolean(args?.IsChecked));
};

const toggleSplitButtonVue = `<ToggleSplitButton IsChecked="{x:Bind myListButton, Mode=TwoWay}" VerticalAlignment="Top" Theme="{x:Bind pageTheme, Mode=OneWay}" AutomationProperties.Name="Bullets" IsCheckedChanged="MyListButton_IsCheckedChanged">
  <SymbolIcon Symbol="{x:Bind listType, Mode=OneWay}" />
  <ToggleSplitButton.Flyout>
    <Flyout Placement="Bottom">
      <StackPanel Orientation="Horizontal">
        <Button Padding="4" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Bulleted list" Click="List_Click">
          <SymbolIcon Symbol="List" />
        </Button>
        <Button Padding="4" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Roman numerals list" Click="Bullets_Click">
          <SymbolIcon Symbol="Bullets" />
        </Button>
      </StackPanel>
    </Flyout>
  </ToggleSplitButton.Flyout>
</ToggleSplitButton>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.bullet-flyout { display: flex; padding: 4px; }
</style>
