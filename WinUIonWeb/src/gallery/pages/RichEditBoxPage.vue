<template>
  <Page Theme="{x:Bind pageTheme, Mode=OneWay}">

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
          <ControlExample VerticalAlignment="Top" HorizontalContentAlignment="Stretch" SampleDefinition="RichEditBox\SimpleTextEditorRicheditbox.txt" HeaderText="{x:Bind Labels.Header0, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[0].Xaml}" CSharp="{x:Bind Sources[0].CSharp}">
            <ControlExample.Example>
              <RichEditBox AutomationProperties.Name="{x:Bind Labels.Text4, Mode=OneWay}" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample SampleDefinition="RichEditBox\CustomizingRicheditboxCommandbarflyoutAdding.txt" HeaderText="{x:Bind Labels.Header1, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[1].Xaml}" CSharp="{x:Bind Sources[1].CSharp}">
            <ControlExample.Example>
              <RichEditBox x:Name="REBCustom" Width="800" Height="200" AutomationProperties.Name="{x:Bind Labels.Text6, Mode=OneWay}" Loaded="REBCustom_Loaded" Unloaded="REBCustom_Unloaded" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample VerticalAlignment="Top" HorizontalContentAlignment="Stretch" SampleDefinition="RichEditBox\CustomEditorRicheditbox.txt" HeaderText="{x:Bind Labels.Header2, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[2].Xaml}" CSharp="{x:Bind Sources[2].CSharp}">
            <ControlExample.Example>
              <RelativePanel Margin="0,0,0,20" HorizontalAlignment="Stretch">
                <RelativePanel.Resources>
                  <ResourceDictionary>
                    <Style TargetType="Button">
                      <Setter Property="BorderThickness" Value="0" />
                      <Setter Property="Background" Value="Transparent" />
                      <Setter Property="Margin" Value="0,0,8,0" />
                    </Style>
                    <ResourceDictionary.ThemeDictionaries>
                      <ResourceDictionary x:Key="HighContrast">
                        <StaticResource x:Key="ButtonBackgroundPointerOver" ResourceKey="SystemColorHighlightColor" />
                      </ResourceDictionary>
                    </ResourceDictionary.ThemeDictionaries>
                  </ResourceDictionary>
                </RelativePanel.Resources>
                <Button x:Name="openFileButton" AutomationProperties.Name="{x:Bind Labels.Text8, Mode=OneWay}" Click="OpenButton_Click" ToolTipService.ToolTip="{x:Bind Labels.Text9, Mode=OneWay}">
                  <Button.Content>
                    <FontIcon Glyph="&#xE8E5;" />
                  </Button.Content>
                </Button>
                <Button AutomationProperties.Name="{x:Bind Labels.Text10, Mode=OneWay}" Click="SaveButton_Click" RelativePanel.RightOf="openFileButton" ToolTipService.ToolTip="{x:Bind Labels.Text11, Mode=OneWay}">
                  <Button.Content>
                    <FontIcon Glyph="&#xE74E;" />
                  </Button.Content>
                </Button>
                <Button AutomationProperties.Name="{x:Bind Labels.Text12, Mode=OneWay}" Click="BoldButton_Click" RelativePanel.LeftOf="italicButton" ToolTipService.ToolTip="{x:Bind Labels.Text13, Mode=OneWay}">
                  <Button.Content>
                    <FontIcon Glyph="&#xE8DD;" />
                  </Button.Content>
                </Button>
                <Button x:Name="italicButton" AutomationProperties.Name="{x:Bind Labels.Text14, Mode=OneWay}" Click="ItalicButton_Click" RelativePanel.LeftOf="fontColorButton" ToolTipService.ToolTip="{x:Bind Labels.Text15, Mode=OneWay}">
                  <Button.Content>
                    <FontIcon Glyph="&#xE8DB;" />
                  </Button.Content>
                </Button>
                <DropDownButton x:Name="fontColorButton" AutomationProperties.Name="{x:Bind Labels.Text16, Mode=OneWay}" Background="Transparent" BorderThickness="0" RelativePanel.AlignRightWithPanel="True" ToolTipService.ToolTip="{x:Bind Labels.Text17, Mode=OneWay}">
                  <SymbolIcon Symbol="FontColor" />
                  <DropDownButton.Flyout>
                    <Flyout Placement="Bottom">
                      <VariableSizedWrapGrid MaximumRowsOrColumns="3" Orientation="Horizontal">
                        <VariableSizedWrapGrid.Resources>
                          <Style TargetType="Rectangle">
                            <Setter Property="Width" Value="32" />
                            <Setter Property="Height" Value="32" />
                          </Style>
                          <Style TargetType="Button">
                            <Setter Property="Padding" Value="0" />
                            <Setter Property="MinWidth" Value="0" />
                            <Setter Property="MinHeight" Value="0" />
                            <Setter Property="Margin" Value="6" />
                          </Style>
                        </VariableSizedWrapGrid.Resources>
                        <Button AutomationProperties.Name="{x:Bind Labels.Text18, Mode=OneWay}" Click="ColorButton_Click" CommandParameter="Red">
                          <Button.Content>
                            <Rectangle Fill="Red" />
                          </Button.Content>
                        </Button>
                        <Button AutomationProperties.Name="{x:Bind Labels.Text19, Mode=OneWay}" Click="ColorButton_Click" CommandParameter="Orange">
                          <Button.Content>
                            <Rectangle Fill="Orange" />
                          </Button.Content>
                        </Button>
                        <Button AutomationProperties.Name="{x:Bind Labels.Text20, Mode=OneWay}" Click="ColorButton_Click" CommandParameter="Yellow">
                          <Button.Content>
                            <Rectangle Fill="Yellow" />
                          </Button.Content>
                        </Button>
                        <Button AutomationProperties.Name="{x:Bind Labels.Text21, Mode=OneWay}" Click="ColorButton_Click" CommandParameter="Green">
                          <Button.Content>
                            <Rectangle Fill="Green" />
                          </Button.Content>
                        </Button>
                        <Button AutomationProperties.Name="{x:Bind Labels.Text22, Mode=OneWay}" Click="ColorButton_Click" CommandParameter="Blue">
                          <Button.Content>
                            <Rectangle Fill="Blue" />
                          </Button.Content>
                        </Button>
                        <Button AutomationProperties.Name="{x:Bind Labels.Text23, Mode=OneWay}" Click="ColorButton_Click" CommandParameter="Indigo">
                          <Button.Content>
                            <Rectangle Fill="Indigo" />
                          </Button.Content>
                        </Button>
                        <Button AutomationProperties.Name="{x:Bind Labels.Text24, Mode=OneWay}" Click="ColorButton_Click" CommandParameter="Violet">
                          <Button.Content>
                            <Rectangle Fill="Violet" />
                          </Button.Content>
                        </Button>
                        <Button AutomationProperties.Name="{x:Bind Labels.Text25, Mode=OneWay}" Click="ColorButton_Click" CommandParameter="Gray">
                          <Button.Content>
                            <Rectangle Fill="Gray" />
                          </Button.Content>
                        </Button>
                      </VariableSizedWrapGrid>
                    </Flyout>
                  </DropDownButton.Flyout>
                </DropDownButton>
                <RichEditBox x:Name="editor" Height="200" MinWidth="300" AutomationProperties.Name="{x:Bind Labels.Text26, Mode=OneWay}" GotFocus="Editor_GotFocus" RelativePanel.AlignLeftWithPanel="True" RelativePanel.AlignRightWithPanel="True" RelativePanel.Below="openFileButton" TextChanged="Editor_TextChanged" />
                <StackPanel Margin="0,10,0,0" Orientation="Horizontal" RelativePanel.AlignLeftWith="editor" RelativePanel.Below="editor">
                  <TextBlock x:Name="findBoxLabel" Margin="0,0,0,4" VerticalAlignment="Center" Text="{x:Bind Labels.Text27, Mode=OneWay}" />
                  <TextBox x:Name="findBox" Width="224" Margin="10,0,0,0" GotFocus="{x:Bind FindBoxHighlightMatches}" LostFocus="{x:Bind FindBoxRemoveHighlights}" PlaceholderText="{x:Bind Labels.Text28, Mode=OneWay}" TextChanged="{x:Bind FindBoxHighlightMatches}" />
                </StackPanel>
              </RelativePanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample x:Name="MathModeExample" SampleDefinition="RichEditBox\RichEditBoxMath.txt" HeaderText="{x:Bind Labels.Header3, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[3].Xaml}" CSharp="{x:Bind Sources[3].CSharp}">
            <ControlExample.Example>
              <StackPanel Spacing="8">
                <RichTextBlock>
                  <Paragraph Margin="0,0,0,4">
                    <Run Text="{x:Bind Labels.Text30, Mode=OneWay}" />
                  </Paragraph>
                  <Paragraph Margin="0,0,0,4">
                    <Run Text="{x:Bind Labels.Text31, Mode=OneWay}" />
                    <Hyperlink NavigateUri="https://www.unicode.org/notes/tn28/">
                      <Run Text="{x:Bind Labels.Text32, Mode=OneWay}" />
                    </Hyperlink>
                    <Run Text="{x:Bind Labels.Text33, Mode=OneWay}" />
                  </Paragraph>
                  <Paragraph Margin="0,0,0,4">
                    <Run Text="{x:Bind Labels.Text34, Mode=OneWay}" />
                  </Paragraph>
                  <Paragraph>
                    <Run Text="{x:Bind Labels.Text35, Mode=OneWay}" />
                  </Paragraph>
                </RichTextBlock>
                <RichEditBox x:Name="MathEditor" Height="80" Width="724" FontSize="16" HorizontalAlignment="Left" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample SampleDefinition="RichEditBox\WorkingMathmlRicheditbox.txt" HorizontalContentAlignment="Stretch" HeaderText="{x:Bind Labels.Header4, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[4].Xaml}" CSharp="{x:Bind Sources[4].CSharp}">
            <ControlExample.Example>
              <StackPanel Spacing="16">
                <RichTextBlock>
                  <Paragraph Margin="0,0,0,4">
                    <Run Text="{x:Bind Labels.Text37, Mode=OneWay}" />
                    <Run FontWeight="SemiBold" Text="{x:Bind Labels.Text38, Mode=OneWay}" />
                    <Run Text="{x:Bind Labels.Text39, Mode=OneWay}" />
                    <Hyperlink NavigateUri="https://www.w3.org/Math/">
                      <Run Text="{x:Bind Labels.Text40, Mode=OneWay}" />
                    </Hyperlink>
                    <Run Text="{x:Bind Labels.Text41, Mode=OneWay}" />
                    <Run FontWeight="SemiBold" Text="{x:Bind Labels.Text42, Mode=OneWay}" />
                    <Run Text="{x:Bind Labels.Text43, Mode=OneWay}" />
                  </Paragraph>
                  <Paragraph Margin="0,0,0,4">
                    <Run Text="{x:Bind Labels.Text44, Mode=OneWay}" />
                    <Run FontWeight="SemiBold" Text="{x:Bind Labels.Text45, Mode=OneWay}" />
                    <Run Text="{x:Bind Labels.Text46, Mode=OneWay}" />
                    <Run FontWeight="SemiBold" Text="{x:Bind Labels.Text47, Mode=OneWay}" />
                    <Run Text="{x:Bind Labels.Text48, Mode=OneWay}" />
                  </Paragraph>
                  <Paragraph Margin="0,0,0,4">
                    <Run Text="{x:Bind Labels.Text49, Mode=OneWay}" />
                    <Run FontWeight="SemiBold" Text="{x:Bind Labels.Text50, Mode=OneWay}" />
                    <Run Text="{x:Bind Labels.Text51, Mode=OneWay}" />
                    <Run FontFamily="Consolas" Text="{x:Bind Labels.Text52, Mode=OneWay}" />
                    <Run Text="{x:Bind Labels.Text53, Mode=OneWay}" />
                  </Paragraph>
                  <Paragraph>
                    <Run FontWeight="SemiBold" Text="{x:Bind Labels.Text54, Mode=OneWay}" />
                    <Run Text="{x:Bind Labels.Text55, Mode=OneWay}" />
                    <Run FontWeight="SemiBold" Text="{x:Bind Labels.Text56, Mode=OneWay}" />
                    <Run Text="{x:Bind Labels.Text57, Mode=OneWay}" />
                  </Paragraph>
                </RichTextBlock>
                <RichEditBox x:Name="mathEditor2" FontSize="16" Height="80" Width="724" HorizontalAlignment="Left" TextChanged="mathEditor2_TextChanged" />
                <TextBlock FontWeight="SemiBold" Text="{x:Bind Labels.Text58, Mode=OneWay}" Margin="0,0,0,-8" />
                <ScrollViewer MaxHeight="450" HorizontalScrollMode="Disabled" VerticalScrollMode="Auto" Background="{ThemeResource CardBackgroundFillColorDefaultBrush}" CornerRadius="4" HorizontalAlignment="Stretch" Padding="0,8,8,0">
                  <SampleCodePresenter x:Name="MathmlPresenter" SampleType="XAML" Code="{x:Bind MathmlCode, Mode=OneWay}" />
                </ScrollViewer>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel>
                <Button x:Name="SetMathmlFormulaBtn" Click="SetMathmlFormulaBtn_Click" Content="{x:Bind Labels.Text59, Mode=OneWay}" Style="{StaticResource AccentButtonStyle}" />
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
import { computed, h, inject, onMounted, provide, ref, shallowReactive, watch } from 'vue';
import Button from '../../components/Button.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import FontIcon from '../../components/FontIcon.vue';
import ControlExample from '../../components/ControlExample.vue';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import TextBox from '../../components/TextBox.vue';
import RichEditBox from '../../components/RichEditBox.vue';
import RichTextBlock from '../../components/RichTextBlock.vue';
import RelativePanel from '../../components/RelativePanel.vue';
import DropDownButton from '../../components/DropDownButton.vue';
import Flyout from '../../components/Flyout.vue';
import VariableSizedWrapGrid from '../../components/VariableSizedWrapGrid.vue';
import Rectangle from '../../components/Rectangle.vue';
import SymbolIcon from '../../components/SymbolIcon.vue';
import SampleCodePresenter from '../../components/SampleCodePresenter.vue';
import AppBarButton from '../../components/AppBarButton.vue';
import { StandardUICommand } from '../../components/StandardUICommand';
import { Run, Hyperlink, Paragraph } from '../../components/TextInline';
import { XamlStyle as Style, XamlSetter as Setter } from '../../components/CollectionProperties';
import { ResourceDictionary } from '../../components/xamlPrimitives';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import Sample0 from '../samples/RichEditBox/SimpleTextEditorRicheditbox.txt?raw';
import Sample1 from '../samples/RichEditBox/CustomizingRicheditboxCommandbarflyoutAdding.txt?raw';
import Sample2 from '../samples/RichEditBox/CustomEditorRicheditbox.txt?raw';
import Sample3 from '../samples/RichEditBox/RichEditBoxMath.txt?raw';
import Sample4 from '../samples/RichEditBox/WorkingMathmlRicheditbox.txt?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'richeditbox');
const controls = shallowReactive({});
provide(xamlNameScopeKey, controls);
const Labels = computed(() => ({ Title: t('text.richeditbox'), Description: t('text.the-richeditbox-control-lets-a-user-enter-format'), ToggleTheme: t('gallery.page-header.toggle-theme'), Header0: t('text.a-simple-text-editor-with-richeditbox'), Text4: t('TextControls.RichEditBox.Label1'), Header1: t('sample.richeditbox.custom-command-flyout'), Text6: t('TextControls.RichEditBox.Label2'), Header2: t('sample.richeditbox.custom-formatting-editor'), Text8: t('sample.richeditbox.open-file'), Text9: t('sample.richeditbox.open-file'), Text10: t('sample.richeditbox.save-file'), Text11: t('sample.richeditbox.save-file'), Text12: t('sample.richeditbox.bold'), Text13: t('sample.richeditbox.bold'), Text14: t('sample.richeditbox.italic'), Text15: t('sample.richeditbox.italic'), Text16: t('sample.splitbutton.font-color'), Text17: t('sample.splitbutton.font-color'), Text18: t('text.red'), Text19: t('sample.orange'), Text20: t('text.yellow'), Text21: t('text.green'), Text22: t('text.blue'), Text23: t('sample.indigo'), Text24: t('sample.violet'), Text25: t('sample.gray'), Text26: t('sample.richeditbox.custom-editor'), Text27: t('sample.richeditbox.find-label'), Text28: t('sample.richeditbox.search-placeholder'), Header3: t('sample.richeditbox.math-mode'), Text30: t('sample.richeditbox.math-note'), Text31: t('TextControls.RichEditBox.Label3'), Text32: t('TextControls.RichEditBox.Label4'), Text33: t('TextControls.RichEditBox.Label5'), Text34: t('sample.richeditbox.math-example'), Text35: t('TextControls.RichEditBox.Label6'), Header4: t('sample.richeditbox.mathml'), Text37: t('TextControls.RichEditBox.Label7'), Text38: t('TextControls.RichEditBox.Label8'), Text39: t('TextControls.RichEditBox.Label9'), Text40: t('TextControls.RichEditBox.Label10'), Text41: t('TextControls.RichEditBox.Label11'), Text42: t('text.richeditbox'), Text43: t('TextControls.RichEditBox.Label12'), Text44: t('TextControls.RichEditBox.Label13'), Text45: t('TextControls.RichEditBox.Label14'), Text46: t('TextControls.RichEditBox.Label15'), Text47: t('text.richeditbox'), Text48: t('TextControls.RichEditBox.Label16'), Text49: t('TextControls.RichEditBox.Label17'), Text50: t('text.richeditbox'), Text51: t('TextControls.RichEditBox.Label18'), Text52: t('TextControls.RichEditBox.Label19'), Text53: t('TextControls.RichEditBox.Label20'), Text54: t('TextControls.RichEditBox.Label21'), Text55: t('TextControls.RichEditBox.Label22'), Text56: t('TextControls.RichEditBox.Label23'), Text57: t('TextControls.RichEditBox.Label24'), Text58: t('sample.richeditbox.mathml-code'), Text59: t('sample.richeditbox.set-sample-formula') }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const Sources = [Sample0,Sample1,Sample2,Sample3,Sample4].map(sample => ({ Xaml: sample.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim() ?? '', CSharp: sample.split(/^--- c#\r?\n/m)[1]?.trim() ?? '' }));
const OpenButton_Click = () => {
  const picker = document.createElement('input');
  picker.type = 'file'; picker.accept = '.rtf';
  picker.addEventListener('change', async () => {
    const file = picker.files?.[0];
    if (file) await controls.editor.Document.LoadFromStream('FormatRtf', file);
  }, { once: true });
  picker.click();
};
const SaveButton_Click = () => {
  const blob = controls.editor.Document.SaveToStream('FormatRtf');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `${t('TextControls.RichEditBox.NewDocument')}.rtf`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const BoldButton_Click = () => { controls.editor.Document.Selection.CharacterFormat.Bold = 'Toggle'; };
const ItalicButton_Click = () => { controls.editor.Document.Selection.CharacterFormat.Italic = 'Toggle'; };
let currentColor = 'Green';
let updatingFormat = false;
const ColorButton_Click = sender => {
  const color = sender.Content?.Fill ?? sender.CommandParameter;
  if (typeof color !== 'string') return;
  currentColor = color;
  controls.editor.Document.Selection.CharacterFormat.ForegroundColor = color;
  controls.fontColorButton.Flyout.Hide(); controls.editor.Focus('Keyboard');
};
const FindBoxRemoveHighlights = () => {
  if (!controls.editor) return;
  const documentRange = controls.editor.Document.GetRange(0, Number.MAX_SAFE_INTEGER);
  updatingFormat = true;
  try { documentRange.CharacterFormat.BackgroundColor = controls.editor.Background; documentRange.CharacterFormat.ForegroundColor = controls.editor.Foreground; }
  finally { updatingFormat = false; }
};
const FindBoxHighlightMatches = () => {
  FindBoxRemoveHighlights();
  const query = controls.findBox?.Text ?? '';
  if (!query) return;
  const searchRange = controls.editor.Document.GetRange(0, 0);
  updatingFormat = true;
  try {
    while (searchRange.FindText(query, Number.MAX_SAFE_INTEGER, 'None') > 0) {
      searchRange.CharacterFormat.BackgroundColor = 'Highlight';
      searchRange.CharacterFormat.ForegroundColor = 'HighlightText';
    }
  } finally { updatingFormat = false; }
};
const Editor_GotFocus = () => {
  if (!controls.editor) return;
  updatingFormat = true;
  try { controls.editor.Document.GetRange(0, Number.MAX_SAFE_INTEGER).CharacterFormat.BackgroundColor = controls.editor.Background; }
  finally { updatingFormat = false; }
};
const Editor_TextChanged = () => {
  if (updatingFormat || !controls.editor) return;
  updatingFormat = true;
  try { controls.editor.Document.Selection.CharacterFormat.ForegroundColor = currentColor; }
  finally { updatingFormat = false; }
};
const shareCommand = new StandardUICommand('Share');
const Menu_Opening = sender => {
  if (sender.Target !== controls.REBCustom || sender.PrimaryCommands.some(command => command.key === 'Share')) return;
  sender.PrimaryCommands.push(h(AppBarButton, { key: 'Share', Command: shareCommand }));
};
const REBCustom_Loaded = sender => {
  sender.SelectionFlyout.addEventListener('Opening', Menu_Opening);
  sender.ContextFlyout.addEventListener('Opening', Menu_Opening);
};
const REBCustom_Unloaded = sender => {
  sender.SelectionFlyout.removeEventListener('Opening', Menu_Opening);
  sender.ContextFlyout.removeEventListener('Opening', Menu_Opening);
};
const MathmlCode = ref('');
const mathEditor2_TextChanged = sender => {
  if (sender.Document.GetMathMode() !== 'MathOnly') return;
  const value = sender.Document.GetMathML();
  MathmlCode.value = value || t('TextControls.NoMathML');
};
const SetMathmlFormulaBtn_Click = () => {
  controls.mathEditor2.Document.SetMathML('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>x</mi><mo>\u2208</mo><mi>P</mi><mfenced><mrow><mi>A</mi></mrow></mfenced><mo>\u2194</mo><mi>x</mi><mo>\u2286</mo><mi>A</mi></math>');
};
onMounted(() => { controls.MathEditor.Document.SetMathMode('MathOnly'); controls.mathEditor2.Document.SetMathMode('MathOnly'); MathmlCode.value = t('TextControls.NoMathML'); });
watch(() => t('TextControls.NoMathML'), value => { if (!controls.mathEditor2?.Document.GetMathML()) MathmlCode.value = value; });
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, Sources, MathmlCode, toggleTheme, toggleFavorite, OpenButton_Click, SaveButton_Click, BoldButton_Click, ItalicButton_Click, ColorButton_Click, FindBoxHighlightMatches, FindBoxRemoveHighlights, Editor_GotFocus, Editor_TextChanged, REBCustom_Loaded, REBCustom_Unloaded, mathEditor2_TextChanged, SetMathmlFormulaBtn_Click });
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 80px 8px 0; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-page-content { min-width: 0; }
</style>
