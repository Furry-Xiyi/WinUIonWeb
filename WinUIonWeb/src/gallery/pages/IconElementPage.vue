<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto" HorizontalScrollBarVisibility="Disabled" HorizontalScrollMode="Disabled">
    <StackPanel class="gallery-item-page icon-element-page">
      <StackPanel class="gallery-page-content">
      <ControlExample x:Name="Example1" SampleDefinition="IconElement\IconElementBitmapiconMulticolorBitmapImage.txt" HeaderText="{x:Bind Labels.BitmapHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind BitmapXaml}">
        <ControlExample.Example>
          <StackPanel>
            <TextBlock Margin="0,0,0,12" Style="{ThemeResource BodyTextBlockStyle}" TextWrapping="Wrap" Text="{x:Bind Labels.BitmapDescription, Mode=OneWay}" />
            <BitmapIcon x:Name="SlicesIcon" Width="50" HorizontalAlignment="Left" ShowAsMonochrome="False" UriSource="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/Slices.png" />
          </StackPanel>
        </ControlExample.Example>
        <ControlExample.Output />
        <ControlExample.Options>
          <CheckBox x:Name="MonochromeButton" Checked="MonochromeButton_CheckedChanged" Unchecked="MonochromeButton_CheckedChanged" Content="{x:Bind Labels.Monochrome, Mode=OneWay}" />
        </ControlExample.Options>
        <ControlExample.Substitutions>
          <ControlExampleSubstitution Key="ShowAsMonochrome" Value="{x:Bind MonochromeButton.IsChecked.Value, Mode=OneWay}" />
        </ControlExample.Substitutions>
      </ControlExample>

      <ControlExample x:Name="Example2" SampleDefinition="IconElement\IconElementFonticonGlyphSpecificFont.txt" HeaderText="{x:Bind Labels.FontHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind FontXaml}">
        <ControlExample.Example>
          <StackPanel>
            <TextBlock Margin="0,0,0,12" Style="{ThemeResource BodyTextBlockStyle}" TextWrapping="Wrap" Text="{x:Bind Labels.FontDescription, Mode=OneWay}" />
            <Button x:Name="ExampleButton1" AutomationProperties.Name="ExampleButton1">
              <FontIcon FontFamily="Segoe MDL2 Assets" Glyph="&#xE790;" />
            </Button>
          </StackPanel>
        </ControlExample.Example>
        <ControlExample.Output />
        <ControlExample.Options />
      </ControlExample>

      <ControlExample x:Name="Example3" SampleDefinition="IconElement\IconElementImageiconBitmapImageButton.txt" HeaderText="{x:Bind Labels.BitmapImageHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind BitmapImageXaml}">
        <ControlExample.Example>
          <StackPanel>
            <TextBlock Margin="0,0,0,12" Style="{ThemeResource BodyTextBlockStyle}" TextWrapping="Wrap" Text="{x:Bind Labels.ImageDescription, Mode=OneWay}" />
            <Button x:Name="ImageExample1" Width="100" AutomationProperties.Name="ImageExample1">
              <ImageIcon>
                <ImageIcon.Source>
                  <BitmapImage UriSource="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/Slices.png" />
                </ImageIcon.Source>
              </ImageIcon>
            </Button>
          </StackPanel>
        </ControlExample.Example>
        <ControlExample.Output />
        <ControlExample.Options />
      </ControlExample>

      <ControlExample x:Name="Example4" SampleDefinition="IconElement\IconElementImageiconSvgImageButton.txt" HeaderText="{x:Bind Labels.SvgImageHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SvgImageXaml}">
        <ControlExample.Example>
          <Button x:Name="ImageExample2" AutomationProperties.Name="ImageExample2">
            <ImageIcon Width="50">
              <ImageIcon.Source>
                <SvgImageSource UriSource="https://cdn.jsdelivr.net/gh/DiemenDesign/LibreICONS@master/svg-color/libre-camera-panorama.svg" />
              </ImageIcon.Source>
            </ImageIcon>
          </Button>
        </ControlExample.Example>
        <ControlExample.Output />
        <ControlExample.Options />
      </ControlExample>

      <ControlExample x:Name="Example5" SampleDefinition="IconElement\IconElementPathiconButton.txt" HeaderText="{x:Bind Labels.PathHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind PathXaml}">
        <ControlExample.Example>
          <StackPanel>
            <TextBlock Margin="0,0,0,12" Style="{ThemeResource BodyTextBlockStyle}" TextWrapping="Wrap" Text="{x:Bind Labels.PathDescription, Mode=OneWay}" />
            <Button x:Name="Example1Button" AutomationProperties.Name="Example1Button">
              <PathIcon HorizontalAlignment="Center" Data="F1 M 16,12 20,2L 20,16 1,16" />
            </Button>
          </StackPanel>
        </ControlExample.Example>
        <ControlExample.Output />
        <ControlExample.Options />
      </ControlExample>

      <ControlExample x:Name="Example6" SampleDefinition="IconElement\IconElementSymboliconButton.txt" HeaderText="{x:Bind Labels.SymbolHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SymbolXaml}">
        <ControlExample.Example>
          <StackPanel>
            <TextBlock Margin="0,0,0,12" Style="{ThemeResource BodyTextBlockStyle}" TextWrapping="Wrap" Text="{x:Bind Labels.SymbolDescription, Mode=OneWay}" />
            <Button x:Name="AcceptButton" AutomationProperties.Name="AcceptButton">
              <StackPanel>
                <SymbolIcon Symbol="Accept" />
                <TextBlock Text="{x:Bind Labels.Accept, Mode=OneWay}" />
              </StackPanel>
            </Button>
          </StackPanel>
        </ControlExample.Example>
        <ControlExample.Output />
        <ControlExample.Options />
      </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue';
import BitmapIcon from '../../components/BitmapIcon.vue';
import BitmapImage from '../../components/BitmapImage.vue';
import Button from '../../components/Button.vue';
import CheckBox from '../../components/CheckBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties';
import FontIcon from '../../components/FontIcon.vue';
import ImageIcon from '../../components/ImageIcon.vue';
import PathIcon from '../../components/PathIcon.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import SvgImageSource from '../../components/SvgImageSource.vue';
import SymbolIcon from '../../components/SymbolIcon.vue';
import TextBlock from '../../components/TextBlock.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import bitmapDefinition from '../samples/IconElement/IconElementBitmapiconMulticolorBitmapImage.txt?raw';
import fontDefinition from '../samples/IconElement/IconElementFonticonGlyphSpecificFont.txt?raw';
import bitmapImageDefinition from '../samples/IconElement/IconElementImageiconBitmapImageButton.txt?raw';
import svgImageDefinition from '../samples/IconElement/IconElementImageiconSvgImageButton.txt?raw';
import pathDefinition from '../samples/IconElement/IconElementPathiconButton.txt?raw';
import symbolDefinition from '../samples/IconElement/IconElementSymboliconButton.txt?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { pageTheme } = createPageState(currentPage?.value || 'iconelement');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  BitmapHeader: t('sample.iconelement.bitmap-header'),
  FontHeader: t('sample.iconelement.font-header'),
  BitmapImageHeader: t('sample.iconelement.bitmap-image-header'),
  SvgImageHeader: t('sample.iconelement.svg-image-header'),
  PathHeader: t('sample.iconelement.path-header'),
  SymbolHeader: t('sample.iconelement.symbol-header'),
  BitmapDescription: t('sample.iconelement.bitmap-description'),
  FontDescription: t('sample.iconelement.font-description'),
  ImageDescription: t('sample.iconelement.image-description'),
  PathDescription: t('sample.iconelement.path-description'),
  SymbolDescription: t('sample.iconelement.symbol-description'),
  Monochrome: t('sample.iconelement.monochrome'),
  Accept: t('sample.iconelement.accept')
}));
const sampleXaml = source => source.split(/--- xaml\s*\r?\n/)[1]?.split(/\r?\n--- /)[0].trim() ?? '';
const BitmapXaml = sampleXaml(bitmapDefinition);
const FontXaml = sampleXaml(fontDefinition);
const BitmapImageXaml = sampleXaml(bitmapImageDefinition);
const SvgImageXaml = sampleXaml(svgImageDefinition);
const PathXaml = sampleXaml(pathDefinition);
const SymbolXaml = sampleXaml(symbolDefinition);

const MonochromeButton_CheckedChanged = () => {
  Names.SlicesIcon.ShowAsMonochrome = Names.MonochromeButton.IsChecked === true;
  Names.SlicesIcon.UriSource = 'https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/Slices.png';
};

provide(xamlScopeKey, {
  Labels, pageTheme, BitmapXaml, FontXaml, BitmapImageXaml, SvgImageXaml,
  PathXaml, SymbolXaml, MonochromeButton_CheckedChanged
});
</script>

<style scoped>
.icon-element-page { min-width: 0; width: 100%; }
.icon-element-page :deep(.control-example-header) { white-space: normal !important; overflow-wrap: anywhere; }
</style>
