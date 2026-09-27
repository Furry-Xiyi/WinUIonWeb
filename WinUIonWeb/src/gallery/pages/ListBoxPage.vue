<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
      </StackPanel>
      <StackPanel class="gallery-page-content">
        <ControlExample HeaderText="{x:Bind sampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind sampleXaml}" CSharp="{x:Bind sampleCSharp}">
          <ControlExample.Example>
            <ListBox x:Name="ColorsListBox" Width="200" ItemsSource="{x:Bind colors, Mode=OneWay}" SelectedIndex="{x:Bind selectedIndex, Mode=TwoWay}" SelectionChanged="ColorsListBox_SelectionChanged">
              <ListBox.ItemTemplate><DataTemplate><TextBlock Text="{x:Bind Label}" /></DataTemplate></ListBox.ItemTemplate>
            </ListBox>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Text="{x:Bind selectionOutput, Mode=OneWay}" TextWrapping="Wrap" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import ListBox from '../../components/ListBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import TextBlock from '../../components/TextBlock.vue';
import StackPanel from '../../components/StackPanel.vue';
import { DataTemplate } from '../../components/CollectionProperties';
import { useI18n } from '../../components/i18n';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'listbox');
const { pageTheme } = createPageState(pageKey.value);
const { t } = useI18n();
const pageDescription = computed(() => t('text.a-control-that-presents-an-inline-list-of-items'));
const sampleHeader = computed(() => t('text.a-simple-listbox'));
const colors = computed(() => ['blue', 'green', 'red', 'yellow'].map(key => ({ Label: t(`text.${key}`) })));
const selectedIndex = ref(0);
const selectionOutput = computed(() => t('sample.listbox.selected-color', { color: colors.value[selectedIndex.value]?.Label ?? t('text.none') }));
const ColorsListBox_SelectionChanged = sender => { selectedIndex.value = sender.SelectedIndex; };
const sampleXaml = `<ListBox x:Name="ColorsListBox" Width="200" ItemsSource="{x:Bind Colors}"
    SelectedIndex="{x:Bind SelectedColorIndex, Mode=TwoWay}"
    SelectionChanged="ColorsListBox_SelectionChanged">
    <ListBox.ItemTemplate>
        <DataTemplate><TextBlock Text="{x:Bind Label}" /></DataTemplate>
    </ListBox.ItemTemplate>
</ListBox>`;
const sampleCSharp = `private void ColorsListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    SelectedColorIndex = ((ListBox)sender).SelectedIndex;
}`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
