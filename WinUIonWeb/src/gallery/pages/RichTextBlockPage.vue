<template>
  <Page>

    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.Title, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
        <StackPanel>
          <ControlExample x:Name="Example1" SampleDefinition="RichTextBlock\SimpleRichtextblock.txt" HeaderText="{x:Bind Labels.Header0, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[0].Xaml}" CSharp="{x:Bind Sources[0].CSharp}">
            <ControlExample.Example>
              <RichTextBlock>
                <Paragraph>
                  <Run Text="{x:Bind Labels.Text4, Mode=OneWay}" />
                </Paragraph>
              </RichTextBlock>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample x:Name="Example2" SampleDefinition="RichTextBlock\RichtextblockCustomSelectionHighlight.txt" HeaderText="{x:Bind Labels.Header1, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[1].Xaml}" CSharp="{x:Bind Sources[1].CSharp}">
            <ControlExample.Example>
              <RichTextBlock SelectionHighlightColor="Green">
                <Paragraph>
                  <Run Text="{x:Bind Labels.Text6, Mode=OneWay}" />
                  <Run FontStyle="Italic" FontWeight="Bold" Text="{x:Bind Labels.Text7, Mode=OneWay}" />
                  <Run Text="{x:Bind Labels.Text8, Mode=OneWay}" />
                  <Hyperlink NavigateUri="https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink">
                    <Run Text="{x:Bind Labels.Text9, Mode=OneWay}" />
                  </Hyperlink>
                  <Run Text="{x:Bind Labels.Text10, Mode=OneWay}" />
                </Paragraph>
                <Paragraph>
                  <Run Text="{x:Bind Labels.Text11, Mode=OneWay}" />
                </Paragraph>
              </RichTextBlock>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample x:Name="Example3" HorizontalContentAlignment="Stretch" SampleDefinition="RichTextBlock\RichtextblockOverflow.txt" HeaderText="{x:Bind Labels.Header2, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[2].Xaml}" CSharp="{x:Bind Sources[2].CSharp}">
            <ControlExample.Example>
              <Grid Height="300">
                <Grid.ColumnDefinitions>
                  <ColumnDefinition />
                  <ColumnDefinition />
                  <ColumnDefinition />
                </Grid.ColumnDefinitions>
                <RichTextBlock Grid.Column="0" Margin="12,0" OverflowContentTarget="{x:Bind firstOverflowContainer}" TextAlignment="Justify">
                  <Paragraph>
                    <Run Text="{x:Bind Labels.Text13, Mode=OneWay}" />
                  </Paragraph>
                  <Paragraph>
                    <Run Text="{x:Bind Labels.Text14, Mode=OneWay}" />
                  </Paragraph>
                </RichTextBlock>
                <RichTextBlockOverflow x:Name="firstOverflowContainer" Grid.Column="1" Margin="12,0" AutomationProperties.Name="{x:Bind Labels.Text15, Mode=OneWay}" OverflowContentTarget="{x:Bind secondOverflowContainer}" />
                <RichTextBlockOverflow x:Name="secondOverflowContainer" Grid.Column="2" Margin="12,0" AutomationProperties.Name="{x:Bind Labels.Text16, Mode=OneWay}" />
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample SampleDefinition="RichTextBlock\RichtextblockCustomTexthighlighting.txt" HeaderText="{x:Bind Labels.Header3, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[3].Xaml}" CSharp="{x:Bind Sources[3].CSharp}">
            <ControlExample.Example>
              <RichTextBlock x:Name="TextHighlightingRichTextBlock">
                <Paragraph>
                  <Run Text="{x:Bind Labels.Text18, Mode=OneWay}" />
                </Paragraph>
              </RichTextBlock>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel>
                <ComboBox Header="{x:Bind Labels.Text19, Mode=OneWay}" SelectionChanged="HighlightColorCombobox_SelectionChanged">
                  <ComboBoxItem Content="{x:Bind Labels.Text20, Mode=OneWay}" IsSelected="True" />
                  <ComboBoxItem Content="{x:Bind Labels.Text21, Mode=OneWay}" />
                  <ComboBoxItem Content="{x:Bind Labels.Text22, Mode=OneWay}" />
                </ComboBox>
              </StackPanel>
            </ControlExample.Options>

          </ControlExample>
        </StackPanel>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>

  </Page>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, provide, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import FontIcon from '../../components/FontIcon.vue';
import ControlExample from '../../components/ControlExample.vue';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import Grid from '../../components/Grid.vue';
import ColumnDefinition from '../../components/ColumnDefinition.vue';
import TextBlock from '../../components/TextBlock.vue';
import RichTextBlock from '../../components/RichTextBlock.vue';
import ComboBox from '../../components/ComboBox.vue';
import RichTextBlockOverflow from '../../components/RichTextBlockOverflow.vue';
import { Run, Hyperlink, Paragraph } from '../../components/TextInline';
import { ComboBoxItem } from '../../components/ComboBox.vue';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import Sample0 from '../samples/RichTextBlock/SimpleRichtextblock.txt?raw';
import Sample1 from '../samples/RichTextBlock/RichtextblockCustomSelectionHighlight.txt?raw';
import Sample2 from '../samples/RichTextBlock/RichtextblockOverflow.txt?raw';
import Sample3 from '../samples/RichTextBlock/RichtextblockCustomTexthighlighting.txt?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'richtextblock');
const controls = shallowReactive({});
provide(xamlNameScopeKey, controls);
const Labels = computed(() => ({ Title: t('text.richtextblock'), Description: t('sample.richtextblock.description'), ToggleTheme: t('gallery.page-header.toggle-theme'), Header0: t('sample.richtextblock.simple'), Text4: t('sample.richtextblock.simple-text'), Header1: t('sample.richtextblock.selection-highlight'), Text6: t('sample.richtextblock.rich-container-supports'), Text7: t('sample.richtextblock.formatted-text'), Text8: t('TextControls.RichTextBlock.Label1'), Text9: t('sample.richtextblock.hyperlinks'), Text10: t('TextControls.RichTextBlock.Label2'), Text11: t('sample.richtextblock.overflow-support'), Header2: t('sample.richtextblock.overflow'), Text13: t('sample.richtextblock.overflow-paragraph'), Text14: t('TextControls.RichTextBlock.Label3'), Text15: t('TextControls.RichTextBlock.Label4'), Text16: t('TextControls.RichTextBlock.Label5'), Header3: t('sample.richtextblock.custom-highlighting'), Text18: t('TextControls.RichTextBlock.Label6'), Text19: t('sample.richtextblock.highlighting-color'), Text20: t('text.yellow'), Text21: t('text.red'), Text22: t('text.blue') }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const Sources = [Sample0,Sample1,Sample2,Sample3].map(sample => ({ Xaml: sample.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim() ?? '', CSharp: sample.split(/^--- c#\r?\n/m)[1]?.trim() ?? '' }));
// Correct the upstream sample's property-element closing-tag typo.
Sources[2].Xaml = Sources[2].Xaml.replace(/(<ColumnDefinition\/>\s*)<Grid\.ColumnDefinitions>/,'$1</Grid.ColumnDefinitions>');
let selectedHighlightColor = 'Yellow';
const applyHighlight = () => {
  const highlighters = controls.TextHighlightingRichTextBlock?.TextHighlighters;
  if(!highlighters) return;
  highlighters.Clear();
  highlighters.Add({ Background:selectedHighlightColor, Ranges:[{ StartIndex:28, Length:11 }] });
};
const HighlightColorCombobox_SelectionChanged = sender => {
  selectedHighlightColor = ['Yellow','Red','Blue'][sender.SelectedIndex] ?? 'Yellow';
  applyHighlight();
};
onMounted(async () => { await nextTick(); applyHighlight(); });

provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, Sources, toggleTheme, toggleFavorite, HighlightColorCombobox_SelectionChanged });
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 80px 8px 0; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-page-content { min-width: 0; }
</style>
