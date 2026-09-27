<template>
  <Page>
    <Page.Resources>
      <Style x:Key="CustomTextBlockStyle" TargetType="TextBlock">
        <Setter Property="FontFamily" Value="Comic Sans MS" />
        <Setter Property="FontStyle" Value="Italic" />
      </Style>
    </Page.Resources>
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
          <ControlExample x:Name="Example1" SampleDefinition="TextBlock\SimpleTextblock.txt" HeaderText="{x:Bind Labels.Header0, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[0].Xaml}" CSharp="{x:Bind Sources[0].CSharp}">
            <ControlExample.Example>
              <TextBlock Text="{x:Bind Labels.Text4, Mode=OneWay}" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample x:Name="Example2" SampleDefinition="TextBlock\TextblockStyleApplied.txt" HeaderText="{x:Bind Labels.Header1, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[1].Xaml}" CSharp="{x:Bind Sources[1].CSharp}">
            <ControlExample.Example>
              <TextBlock Style="{StaticResource CustomTextBlockStyle}" Text="{x:Bind Labels.Text6, Mode=OneWay}" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample x:Name="Example3" SampleDefinition="TextBlock\TextblockVariousProperties.txt" HeaderText="{x:Bind Labels.Header2, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[2].Xaml}" CSharp="{x:Bind Sources[2].CSharp}">
            <ControlExample.Example>
              <TextBlock CharacterSpacing="200" FontFamily="Arial" FontSize="24" FontStyle="Italic" Foreground="CornflowerBlue" Text="{x:Bind Labels.Text8, Mode=OneWay}" TextWrapping="WrapWholeWords" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample x:Name="Example4" SampleDefinition="TextBlock\TextblockInlineTextElements.txt" HeaderText="{x:Bind Labels.Header3, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[3].Xaml}" CSharp="{x:Bind Sources[3].CSharp}">
            <ControlExample.Example>
              <TextBlock>
                <Run FontFamily="Times New Roman" Foreground="DarkGray" Text="{x:Bind Labels.Text10, Mode=OneWay}" />
                <LineBreak />
                <Span>
                  <Run Text="{x:Bind Labels.Text11, Mode=OneWay}" />
                  <Bold>
                    <Run Text="{x:Bind Labels.Text12, Mode=OneWay}" />
                  </Bold>
                  <Run Text="{x:Bind Labels.Text13, Mode=OneWay}" />
                  <Italic>
                    <Run Text="{x:Bind Labels.Text14, Mode=OneWay}" />
                  </Italic>
                  <Run Text="{x:Bind Labels.Text15, Mode=OneWay}" />
                  <Underline>
                    <Run Text="{x:Bind Labels.Text16, Mode=OneWay}" />
                  </Underline>
                  <Run Text="{x:Bind Labels.Text17, Mode=OneWay}" />
                </Span>
              </TextBlock>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample x:Name="Example5" SampleDefinition="TextBlock\SelectableTextblock.txt" HeaderText="{x:Bind Labels.Header4, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[4].Xaml}" CSharp="{x:Bind Sources[4].CSharp}">
            <ControlExample.Example>
              <TextBlock IsTextSelectionEnabled="{x:Bind SelectionEnabledSwitch.IsOn, Mode=OneWay}" SelectionHighlightColor="DarkOrange" Text="{x:Bind Labels.Text19, Mode=OneWay}" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <ToggleSwitch x:Name="SelectionEnabledSwitch" Header="{x:Bind Labels.Text20, Mode=OneWay}" />
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="IsTextSelectionEnabled" Value="{x:Bind SelectionEnabledSwitch.IsOn, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
        </StackPanel>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>

  </Page>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import FontIcon from '../../components/FontIcon.vue';
import ControlExample from '../../components/ControlExample.vue';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleSwitch from '../../components/ToggleSwitch.vue';
import { Run, Span, Bold, Italic, Underline, LineBreak } from '../../components/TextInline';
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties';
import { XamlStyle as Style, XamlSetter as Setter } from '../../components/CollectionProperties';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import Sample0 from '../samples/TextBlock/SimpleTextblock.txt?raw';
import Sample1 from '../samples/TextBlock/TextblockStyleApplied.txt?raw';
import Sample2 from '../samples/TextBlock/TextblockVariousProperties.txt?raw';
import Sample3 from '../samples/TextBlock/TextblockInlineTextElements.txt?raw';
import Sample4 from '../samples/TextBlock/SelectableTextblock.txt?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'textblock');
const controls = shallowReactive({});
provide(xamlNameScopeKey, controls);
const Labels = computed(() => ({ Title: t('text.textblock'), Description: t('text.the-textblock-control-provides-flexible-text-dis'), ToggleTheme: t('gallery.page-header.toggle-theme'), Header0: t('text.a-simple-textblock'), Text4: t('text.i-am-a-textblock'), Header1: t('sample.textblock.style-applied'), Text6: t('sample.textblock.styled-text'), Header2: t('sample.textblock.properties'), Text8: t('sample.common.excited-text'), Header3: t('sample.textblock.inline-elements'), Text10: t('sample.textblock.inline-first'), Text11: t('sample.textblock.inline-prefix'), Text12: t('sample.textblock.inline-bold'), Text13: t('TextControls.TextBlock.Label1'), Text14: t('sample.textblock.inline-italic'), Text15: t('TextControls.TextBlock.Label2'), Text16: t('sample.textblock.inline-underlined'), Text17: t('TextControls.TextBlock.Label3'), Header4: t('sample.textblock.selectable'), Text19: t('sample.textblock.selectable-text'), Text20: t('sample.textblock.selection-toggle') }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const Sources = [Sample0,Sample1,Sample2,Sample3,Sample4].map(sample => ({ Xaml: sample.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim() ?? '', CSharp: sample.split(/^--- c#\r?\n/m)[1]?.trim() ?? '' }));
// Correct the upstream sample's closing-tag typos in the displayed source.
Sources[1].Xaml = Sources[1].Xaml.replace(/(<\/Style>\s*)<Page\.Resources>/,'$1</Page.Resources>');
Sources[4].Xaml = Sources[4].Xaml.replace(/>\s*$/,' />');


provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, Sources, toggleTheme, toggleFavorite });
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 80px 8px 0; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-page-content { min-width: 0; }
</style>
