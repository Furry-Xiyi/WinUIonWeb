<template>
  <Page x:Name="compactPage">
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
        <Grid class="gallery-page-content">
          <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="Auto" />
          </Grid.RowDefinitions>
          <RichTextBlock Margin="0,24,0,0">
            <Paragraph>
              <Run FontWeight="SemiBold" Text="{x:Bind Labels.SupportedControls, Mode=OneWay}" />
              <LineBreak />
              <Run Text="{x:Bind Labels.ListView, Mode=OneWay}" />
              <LineBreak />
              <Run Text="{x:Bind Labels.TextBox, Mode=OneWay}" />
              <LineBreak />
              <Run Text="{x:Bind Labels.PasswordBox, Mode=OneWay}" />
              <LineBreak />
              <Run Text="{x:Bind Labels.AutoSuggestBox, Mode=OneWay}" />
              <LineBreak />
              <Run Text="{x:Bind Labels.ComboBox, Mode=OneWay}" />
              <LineBreak />
              <Run Text="{x:Bind Labels.DatePicker, Mode=OneWay}" />
              <LineBreak />
              <Run Text="{x:Bind Labels.TimePicker, Mode=OneWay}" />
              <LineBreak />
              <Run Text="{x:Bind Labels.TreeView, Mode=OneWay}" />
              <LineBreak />
              <Run Text="{x:Bind Labels.NavigationView, Mode=OneWay}" />
              <LineBreak />
              <Run Text="{x:Bind Labels.MenuBar, Mode=OneWay}" />
            </Paragraph>
          </RichTextBlock>
          <ControlExample
            x:Name="Example1"
            Grid.Row="1"
            SampleDefinition="CompactSizing\CompactSizingControls.txt"
            HeaderText="{x:Bind Labels.SampleHeader, Mode=OneWay}"
            HorizontalContentAlignment="Stretch"
            Theme="{x:Bind pageTheme, Mode=OneWay}"
            Loaded="Example1_Loaded"
            Xaml="{x:Bind ExampleXaml}">
            <ControlExample.Example>
              <Frame x:Name="ContentFrame" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <RadioButtons Header="{x:Bind Labels.SizingHeader, Mode=OneWay}">
                <RadioButton Checked="Standard_Checked" Content="{x:Bind Labels.Standard, Mode=OneWay}" GroupName="ControlSize" IsChecked="True" Tag="StandardSize" />
                <RadioButton Checked="Compact_Checked" Content="{x:Bind Labels.Compact, Mode=OneWay}" GroupName="ControlSize" Tag="CompactSize" />
              </RadioButtons>
            </ControlExample.Options>
          </ControlExample>
        </Grid>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, provide, shallowReactive, type Component } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import Frame from '../../components/Frame.vue';
import Grid from '../../components/Grid.vue';
import { useI18n } from '../../components/i18n/index';
import Page from '../../components/Page.vue';
import RadioButton from '../../components/RadioButton.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import RichTextBlock from '../../components/RichTextBlock.vue';
import RowDefinition from '../../components/RowDefinition.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import { LineBreak, Paragraph, Run } from '../../components/TextInline';
import ToggleButton from '../../components/ToggleButton.vue';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import SampleCompactSizingPage from './SampleCompactSizingPage.vue';
import SampleStandardSizingPage from './SampleStandardSizingPage.vue';

interface SamplePage {
  FirstName: { Text: string };
  LastName: { Text: string };
  Password: { Password: string };
  ConfirmPassword: { Password: string };
  ChosenDate: { Date: Date };
  CopyState: (page: SamplePage) => void;
}
interface FrameApi { Content: SamplePage | null; Navigate: (page: Component, parameter?: unknown, transitionInfo?: unknown) => boolean }

const { t } = useI18n();
const currentPage = inject<{ value: string }>('currentPage');
const { pageTheme, isFavoriteState, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'compactsizing');
const Names = shallowReactive<Record<string, unknown>>({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  Title: t('text.compact-sizing'), Description: t('sample.compactsizing.description'),
  ToggleTheme: t('gallery.page-header.toggle-theme'), SupportedControls: t('sample.compactsizing.supported-controls'),
  ListView: t('sample.compactsizing.supported-listview'), TextBox: t('sample.compactsizing.supported-textbox'),
  PasswordBox: t('sample.compactsizing.supported-passwordbox'), AutoSuggestBox: t('sample.compactsizing.supported-autosuggestbox'),
  ComboBox: t('sample.compactsizing.supported-combobox'), DatePicker: t('sample.compactsizing.supported-datepicker'),
  TimePicker: t('sample.compactsizing.supported-timepicker'), TreeView: t('sample.compactsizing.supported-treeview'),
  NavigationView: t('sample.compactsizing.supported-navigationview'), MenuBar: t('sample.compactsizing.supported-menubar'),
  SampleHeader: t('sample.compactsizing.header'), SizingHeader: t('sample.compactsizing.options-header'),
  Standard: t('sample.compactsizing.standard'), Compact: t('sample.compactsizing.compact')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const ExampleXaml = `<Page.Resources>
    <ResourceDictionary Source="ms-appx:///Microsoft.UI.Xaml/DensityStyles/Compact.xaml" />
</Page.Resources>`;

let navigationVersion = 0;
const navigate = async (pageType: Component, copyState: boolean) => {
  const frame = Names.ContentFrame as FrameApi | undefined;
  if (!frame) return;
  const oldPage = frame.Content;
  // Vue commits navigation on the next tick. Capture the dependency-property
  // values before the old Page's namescope is disposed.
  const previous = oldPage && copyState ? {
    FirstName: { Text: oldPage.FirstName.Text }, LastName: { Text: oldPage.LastName.Text },
    Password: { Password: oldPage.Password.Password }, ConfirmPassword: { Password: oldPage.ConfirmPassword.Password },
    ChosenDate: { Date: oldPage.ChosenDate.Date }, CopyState: oldPage.CopyState
  } : null;
  const version = ++navigationVersion;
  if (!frame.Navigate(pageType, null, { Type: 'SuppressNavigationTransitionInfo' })) return;
  await nextTick();
  if (version === navigationVersion && previous && frame.Content) frame.Content.CopyState(previous);
};
const Example1_Loaded = () => { void navigate(SampleStandardSizingPage, false); };
const Standard_Checked = () => { void navigate(SampleStandardSizingPage, true); };
const Compact_Checked = () => { void navigate(SampleCompactSizingPage, true); };
provide(xamlScopeKey, {
  Labels, FavoriteLabel, FavoriteGlyph, pageTheme, isFavoriteState, toggleTheme, toggleFavorite,
  ExampleXaml, Example1_Loaded, Standard_Checked, Compact_Checked
});
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { margin: 0 72px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-item-page, .gallery-page-content { min-width: 0; max-width: 100%; }
</style>
