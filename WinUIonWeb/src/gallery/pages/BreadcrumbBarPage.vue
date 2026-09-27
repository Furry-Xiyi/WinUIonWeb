<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.Title, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" TextWrapping="Wrap" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}">
              <FontIcon Glyph="&#xE793;" FontSize="16" />
            </Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}">
              <FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" SampleDefinition="BreadcrumbBar\BreadcrumbbarControl.txt" HeaderText="{x:Bind Labels.BasicHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind BasicXaml}" CSharp="{x:Bind BasicCSharp}">
            <ControlExample.Example>
              <BreadcrumbBar x:Name="BreadcrumbBar1" ItemsSource="{x:Bind FoldersString}" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example2" SampleDefinition="BreadcrumbBar\BreadcrumbbarControlCustomDatatemplate.txt" HeaderText="{x:Bind Labels.CustomHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind CustomXaml}" CSharp="{x:Bind CustomCSharp}">
            <ControlExample.Example>
              <BreadcrumbBar x:Name="BreadcrumbBar2" ItemsSource="{x:Bind Folders, Mode=OneWay}" ItemClicked="BreadcrumbBar2_ItemClicked">
                <BreadcrumbBar.ItemTemplate>
                  <DataTemplate x:DataType="l:Folder">
                    <BreadcrumbBarItem>
                      <BreadcrumbBarItem.ContentTemplate>
                        <DataTemplate x:DataType="l:Folder">
                          <TextBlock Text="{x:Bind Name}" AutomationProperties.Name="{x:Bind Name}" />
                        </DataTemplate>
                      </BreadcrumbBarItem.ContentTemplate>
                    </BreadcrumbBarItem>
                  </DataTemplate>
                </BreadcrumbBar.ItemTemplate>
              </BreadcrumbBar>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <Button x:Name="ResetSampleBtn" Click="ResetSampleButton_Click" Content="{x:Bind Labels.ResetSample, Mode=OneWay}" />
            </ControlExample.Options>
          </ControlExample>
        </StackPanel>

        <TextBlock class="accessibility-announcement" Text="{x:Bind ResetAnnouncement, Mode=OneWay}" AutomationProperties.LiveSetting="Polite" aria-live="polite" />
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, nextTick, provide, ref, shallowReactive } from 'vue';
import BreadcrumbBar from '../../components/BreadcrumbBar.vue';
import BreadcrumbBarItem from '../../components/BreadcrumbBarItem.vue';
import Button from '../../components/Button.vue';
import { DataTemplate } from '../../components/CollectionProperties';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import basicSample from '../samples/BreadcrumbBar/BreadcrumbbarControl.txt?raw';
import customSample from '../samples/BreadcrumbBar/BreadcrumbbarControlCustomDatatemplate.txt?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'breadcrumbbar');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);

const Labels = computed(() => ({
  Title: t('text.breadcrumbbar'),
  Description: t('text.breadcrumbbar-description'),
  ToggleTheme: t('gallery.page-header.toggle-theme'),
  BasicHeader: t('sample.breadcrumbbar.control'),
  CustomHeader: t('sample.breadcrumbbar.custom-data-template'),
  ResetSample: t('sample.breadcrumbbar.reset-sample')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const ResetAnnouncement = ref('');

const folderKeys = [
  'sample.breadcrumbbar.home',
  'sample.breadcrumbbar.folder-1',
  'sample.breadcrumbbar.folder-2',
  'sample.breadcrumbbar.folder-3'
];
// Preserve the original Folder identities, as the Gallery's ObservableCollection
// is trimmed in place and Reset adds back its missing original objects.
const _defaultFolders = folderKeys.map(key => ({ get Name() { return t(key); } }));
const Folders = ref([..._defaultFolders]);
const FoldersString = computed(() => [
  t('sample.breadcrumbbar.home'),
  t('sample.breadcrumbbar.documents'),
  t('sample.breadcrumbbar.design'),
  t('sample.breadcrumbbar.northwind'),
  t('sample.breadcrumbbar.images'),
  t('sample.breadcrumbbar.folder-1'),
  t('sample.breadcrumbbar.folder-2'),
  t('sample.breadcrumbbar.folder-3')
]);

const BreadcrumbBar2_ItemClicked = (sender, args) => {
  const items = sender?.ItemsSource;
  if (!Array.isArray(items)) return;
  for (let i = items.length - 1; i >= args.Index + 1; i -= 1) {
    items.splice(i, 1);
  }
};

const ResetSampleButton_Click = () => {
  const items = Names.BreadcrumbBar2?.ItemsSource;
  if (!Array.isArray(items)) return;
  for (const folder of _defaultFolders) {
    if (!items.includes(folder)) items.push(folder);
  }
  ResetAnnouncement.value = '';
  nextTick(() => {
    ResetAnnouncement.value = t('sample.breadcrumbbar.reset-success');
  });
};

const sampleSection = (source, section) => {
  const sections = source.split(/^--- /m);
  const content = sections.find(value => value.startsWith(`${section}\n`) || value.startsWith(`${section}\r\n`));
  return content?.slice(section.length).trim() ?? '';
};
const BasicXaml = sampleSection(basicSample, 'xaml');
const BasicCSharp = sampleSection(basicSample, 'c#');
const CustomXaml = sampleSection(customSample, 'xaml');
const CustomCSharp = sampleSection(customSample, 'c#');

provide(xamlScopeKey, {
  Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  FoldersString, Folders, ResetAnnouncement, BreadcrumbBar2_ItemClicked, ResetSampleButton_Click,
  BasicXaml, BasicCSharp, CustomXaml, CustomCSharp
});
</script>

<style scoped>
.page-heading {
  position: relative;
  min-width: 0;
}

.page-header {
  margin: 0 72px 8px 0;
  color: var(--text-primary);
  overflow-wrap: anywhere;
}

.page-description {
  margin: 0 0 16px;
  color: var(--text-secondary);
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
}

.gallery-page-content {
  min-width: 0;
  max-width: 100%;
}

.gallery-item-page :deep(.accessibility-announcement) {
  position: fixed;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
