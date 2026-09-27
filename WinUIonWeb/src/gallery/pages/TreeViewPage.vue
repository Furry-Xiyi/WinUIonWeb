<template>
  <Page>
    <Page.Resources>
      <DataTemplate x:Key="FolderTemplate" x:DataType="controlpages:ExplorerItem">
        <TreeViewItem
          AutomationProperties.Name="{x:Bind Name}"
          IsExpanded="True"
          ItemsSource="{x:Bind Children}">
          <StackPanel Orientation="Horizontal">
            <Image
              Width="20"
              Source="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/folder.png" />
            <TextBlock Margin="0,0,10,0" />
            <TextBlock Text="{x:Bind Name}" />
          </StackPanel>
        </TreeViewItem>
      </DataTemplate>

      <DataTemplate x:Key="FileTemplate" x:DataType="controlpages:ExplorerItem">
        <TreeViewItem AutomationProperties.Name="{x:Bind Name}">
          <StackPanel Orientation="Horizontal">
            <FontIcon Glyph="&#xE8A5;" />
            <TextBlock Margin="0,0,10,0" />
            <TextBlock Text="{x:Bind Name}" />
          </StackPanel>
        </TreeViewItem>
      </DataTemplate>

      <ExplorerItemTemplateSelector
        x:Key="ExplorerItemTemplateSelector"
        FileTemplate="{StaticResource FileTemplate}"
        FolderTemplate="{StaticResource FolderTemplate}" />
    </Page.Resources>

    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button
              class="header-action"
              AutomationProperties.Name="{x:Bind themeButtonAutomationName, Mode=OneWay}"
              Click="toggleTheme">
              <TextBlock class="icon" Text="&#xE793;" />
            </Button>
            <ToggleButton
              class="header-action"
              AutomationProperties.Name="{x:Bind favoriteButtonAutomationName, Mode=OneWay}"
              IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}"
              Click="toggleFavorite">
              <TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample
            SampleDefinition="TreeView\SimpleTreeviewDragDrop.txt"
            HeaderText="{x:Bind dragDropHeader, Mode=OneWay}"
            Theme="{x:Bind pageTheme, Mode=OneWay}"
            Xaml="{x:Bind dragDropSample.xaml, Mode=OneWay}"
            CSharp="{x:Bind dragDropSample.cSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid Height="280" BorderBrush="{ThemeResource TextControlBorderBrush}" BorderThickness="1">
                <TreeView
                  x:Name="sampleTreeView"
                  MinWidth="345"
                  MaxHeight="400"
                  Margin="0,12,0,0"
                  HorizontalAlignment="Center"
                  VerticalAlignment="Top"
                  AllowDrop="True"
                  CanDragItems="True">
                  <TreeView.RootNodes>
                    <TreeViewNode Content="{x:Bind TreeText.WorkDocuments, Mode=OneWay}" IsExpanded="True">
                      <TreeViewNode.Children>
                        <TreeViewNode Content="{x:Bind TreeText.XyzFunctionalSpec, Mode=OneWay}" />
                        <TreeViewNode Content="{x:Bind TreeText.FeatureSchedule, Mode=OneWay}" />
                      </TreeViewNode.Children>
                    </TreeViewNode>
                    <TreeViewNode Content="{x:Bind TreeText.PersonalDocuments, Mode=OneWay}" IsExpanded="True">
                      <TreeViewNode.Children>
                        <TreeViewNode Content="{x:Bind TreeText.HomeRemodel, Mode=OneWay}" IsExpanded="True">
                          <TreeViewNode.Children>
                            <TreeViewNode Content="{x:Bind TreeText.ContractorContactInfo, Mode=OneWay}" />
                            <TreeViewNode Content="{x:Bind TreeText.PaintColorScheme, Mode=OneWay}" />
                          </TreeViewNode.Children>
                        </TreeViewNode>
                      </TreeViewNode.Children>
                    </TreeViewNode>
                  </TreeView.RootNodes>
                </TreeView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample
            SampleDefinition="TreeView\TreeviewMultiSelectionEnabled.txt"
            HeaderText="{x:Bind multiSelectionHeader, Mode=OneWay}"
            Theme="{x:Bind pageTheme, Mode=OneWay}"
            Xaml="{x:Bind multiSelectionSample.xaml, Mode=OneWay}"
            CSharp="{x:Bind multiSelectionSample.cSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid Height="280" BorderBrush="{ThemeResource TextControlBorderBrush}" BorderThickness="1">
                <TreeView
                  x:Name="sampleTreeView2"
                  MinWidth="345"
                  MaxHeight="400"
                  Margin="0,12,0,0"
                  HorizontalAlignment="Center"
                  VerticalAlignment="Top"
                  SelectionMode="Multiple">
                  <TreeView.RootNodes>
                    <TreeViewNode Content="{x:Bind TreeText.WorkDocuments, Mode=OneWay}" IsExpanded="True">
                      <TreeViewNode.Children>
                        <TreeViewNode Content="{x:Bind TreeText.XyzFunctionalSpec, Mode=OneWay}" />
                        <TreeViewNode Content="{x:Bind TreeText.FeatureSchedule, Mode=OneWay}" />
                      </TreeViewNode.Children>
                    </TreeViewNode>
                    <TreeViewNode Content="{x:Bind TreeText.PersonalDocuments, Mode=OneWay}" IsExpanded="True">
                      <TreeViewNode.Children>
                        <TreeViewNode Content="{x:Bind TreeText.HomeRemodel, Mode=OneWay}" IsExpanded="True">
                          <TreeViewNode.Children>
                            <TreeViewNode Content="{x:Bind TreeText.ContractorContactInfo, Mode=OneWay}" />
                            <TreeViewNode Content="{x:Bind TreeText.PaintColorScheme, Mode=OneWay}" />
                          </TreeViewNode.Children>
                        </TreeViewNode>
                      </TreeViewNode.Children>
                    </TreeViewNode>
                  </TreeView.RootNodes>
                </TreeView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample
            SampleDefinition="TreeView\TreeviewDatabindingItemsource.txt"
            HeaderText="{x:Bind dataBindingHeader, Mode=OneWay}"
            Theme="{x:Bind pageTheme, Mode=OneWay}"
            Xaml="{x:Bind dataBindingSample.xaml, Mode=OneWay}"
            CSharp="{x:Bind dataBindingSample.cSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid Height="200" BorderBrush="{ThemeResource TextControlBorderBrush}" BorderThickness="1">
                <TreeView
                  x:Name="TreeView1"
                  MinWidth="345"
                  MaxHeight="400"
                  Margin="0,12,0,0"
                  HorizontalAlignment="Center"
                  VerticalAlignment="Top"
                  ItemsSource="{x:Bind DataSource}">
                  <TreeView.ItemTemplate>
                    <DataTemplate x:DataType="controlpages:ExplorerItem">
                      <TreeViewItem
                        Content="{x:Bind Name}"
                        IsExpanded="True"
                        ItemsSource="{x:Bind Children}" />
                    </DataTemplate>
                  </TreeView.ItemTemplate>
                </TreeView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample
            SampleDefinition="TreeView\TreeviewItemtemplateselector.txt"
            HeaderText="{x:Bind templateSelectorHeader, Mode=OneWay}"
            Theme="{x:Bind pageTheme, Mode=OneWay}"
            Xaml="{x:Bind templateSelectorSample.xaml, Mode=OneWay}"
            CSharp="{x:Bind templateSelectorSample.cSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid Height="200" BorderBrush="{ThemeResource TextControlBorderBrush}" BorderThickness="1">
                <TreeView
                  x:Name="FileTree"
                  Grid.Column="2"
                  MinWidth="345"
                  MaxHeight="400"
                  Margin="0,12,0,0"
                  HorizontalAlignment="Center"
                  VerticalAlignment="Top"
                  ItemTemplateSelector="{StaticResource ExplorerItemTemplateSelector}"
                  ItemsSource="{x:Bind DataSource}" />
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import Button from '../../components/Button.vue'
import { DataTemplateSelector as ExplorerItemTemplateSelector } from '../../components/CollectionProperties'
import ControlExample from '../../components/ControlExample.vue'
import FontIcon from '../../components/FontIcon.vue'
import Grid from '../../components/Grid.vue'
import Image from '../../components/Image.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import TreeView from '../../components/TreeView.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
import dataBindingSampleDefinition from '../samples/TreeView/TreeviewDatabindingItemsource.txt?raw'
import dragDropSampleDefinition from '../samples/TreeView/SimpleTreeviewDragDrop.txt?raw'
import multiSelectionSampleDefinition from '../samples/TreeView/TreeviewMultiSelectionEnabled.txt?raw'
import templateSelectorSampleDefinition from '../samples/TreeView/TreeviewItemtemplateselector.txt?raw'

type SampleDefinition = {
  header: string
  xaml: string
  cSharp: string
}

const parseSampleDefinition = (source: string): SampleDefinition => {
  const sections: Record<string, string[]> = {}
  let currentSection = ''

  for (const rawLine of source.split(/\r?\n/)) {
    const marker = rawLine.match(/^---\s+(.+?)\s*$/)
    if (marker) {
      currentSection = marker[1].toLowerCase()
      sections[currentSection] = []
    } else if (currentSection) {
      sections[currentSection].push(rawLine)
    }
  }

  return {
    header: (sections.header ?? []).join('\n').trim(),
    xaml: (sections.xaml ?? []).join('\n').trim(),
    cSharp: (sections['c#'] ?? []).join('\n').trim()
  }
}

const dragDropSample = parseSampleDefinition(dragDropSampleDefinition)
const multiSelectionSample = parseSampleDefinition(multiSelectionSampleDefinition)
const dataBindingSample = parseSampleDefinition(dataBindingSampleDefinition)
const templateSelectorSample = parseSampleDefinition(templateSelectorSampleDefinition)

const { t } = useI18n()
const pageTitle = t('text.treeview')
const pageDescription = t('text.the-treeview-control-is-a-hierarchical-list-patt')
const dragDropHeader = t('sample.treeview.drag-drop')
const multiSelectionHeader = t('sample.treeview.multi-selection')
const dataBindingHeader = t('sample.treeview.databinding-itemsource')
const templateSelectorHeader = t('sample.treeview.item-template-selector')
const themeButtonAutomationName = t('sample.treeview.toggle-theme')
const currentPage = inject<{ value?: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'treeview')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const favoriteButtonAutomationName = computed(() => t(
  isFavoriteState.value
    ? 'sample.treeview.remove-from-favorites'
    : 'sample.treeview.add-to-favorites'
))

const TreeText = computed(() => ({
  WorkDocuments: t('sample.treeview.node.work-documents'),
  XyzFunctionalSpec: t('sample.treeview.node.xyz-functional-spec'),
  FeatureSchedule: t('sample.treeview.node.feature-schedule'),
  PersonalDocuments: t('sample.treeview.node.personal-documents'),
  HomeRemodel: t('sample.treeview.node.home-remodel'),
  ContractorContactInfo: t('sample.treeview.node.contractor-contact-info'),
  PaintColorScheme: t('sample.treeview.node.paint-color-scheme'),
  Documents: t('sample.treeview.node.documents'),
  ProjectProposal: t('sample.treeview.node.project-proposal'),
  BudgetReport: t('sample.treeview.node.budget-report'),
  Projects: t('sample.treeview.node.projects'),
  ProjectPlan: t('sample.treeview.node.project-plan')
}))

const DataSource = computed(() => [
  {
    Name: TreeText.value.Documents,
    Type: 'Folder',
    Children: [
      { Name: TreeText.value.ProjectProposal, Type: 'File', Children: [] },
      { Name: TreeText.value.BudgetReport, Type: 'File', Children: [] }
    ]
  },
  {
    Name: TreeText.value.Projects,
    Type: 'Folder',
    Children: [
      { Name: TreeText.value.ProjectPlan, Type: 'File', Children: [] }
    ]
  }
])
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
