<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind ImageLabels.PageTitle, Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind ImageLabels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind ImageLabels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind ImageLabels.ToggleTheme, Mode=OneWay}">
            <FontIcon Glyph="&#xE793;" FontSize="16" />
          </Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}">
            <FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" />
          </ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample x:Name="Example1" class="basic-input-example-theme" SampleDefinition="Image\BasicImageLocalFile.txt" HeaderText="{x:Bind ImageLabels.Basic, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind BasicXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Image x:Name="BasicImage" Height="100" Source="{x:Bind Media.Treetops, Mode=OneWay}" AutomationProperties.Name="{x:Bind ImageLabels.Treetops, Mode=OneWay}" ImageOpened="BasicImage_ImageOpened" ImageFailed="BasicImage_ImageFailed" />
          </ControlExample.Example>
          <ControlExample.Output>
            <TextBlock class="image-output" Text="{x:Bind BasicOutput, Mode=OneWay}" TextWrapping="Wrap" />
          </ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>

        <ControlExample x:Name="Example2" class="basic-input-example-theme" SampleDefinition="Image\ImageDecodedRenderingSize.txt" HeaderText="{x:Bind ImageLabels.Decoded, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind DecodedXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Image x:Name="DecodedImage" Height="100" AutomationProperties.Name="{x:Bind ImageLabels.Treetops, Mode=OneWay}" ImageOpened="DecodedImage_ImageOpened" ImageFailed="DecodedImage_ImageFailed">
              <Image.Source>
                <BitmapImage DecodePixelHeight="100" UriSource="{x:Bind Media.Treetops, Mode=OneWay}" />
              </Image.Source>
            </Image>
          </ControlExample.Example>
          <ControlExample.Output>
            <TextBlock class="image-output" Text="{x:Bind DecodedOutput, Mode=OneWay}" TextWrapping="Wrap" />
          </ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>

        <ControlExample x:Name="Example3" class="basic-input-example-theme" SampleDefinition="Image\ImageStretching.txt" HeaderText="{x:Bind ImageLabels.Stretching, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind StretchXaml, Mode=OneWay}" CSharp="{x:Bind StretchCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <Image x:Name="StretchImage" Width="100" Height="100" Source="{x:Bind Media.Valley, Mode=OneWay}" Stretch="{x:Bind StretchMode, Mode=OneWay}" AutomationProperties.Name="{x:Bind ImageLabels.Valley, Mode=OneWay}" ImageOpened="StretchImage_ImageOpened" ImageFailed="StretchImage_ImageFailed" />
          </ControlExample.Example>
          <ControlExample.Output>
            <TextBlock class="image-output" Text="{x:Bind StretchOutput, Mode=OneWay}" TextWrapping="Wrap" />
          </ControlExample.Output>
          <ControlExample.Options>
            <RadioButtons Header="{x:Bind ImageLabels.StretchMode, Mode=OneWay}">
              <RadioButton x:Name="StretchNone" Checked="ImageStretch_Checked" Content="{x:Bind ImageLabels.StretchNone, Mode=OneWay}" Tag="None" GroupName="ImageStretch" IsChecked="True" />
              <RadioButton x:Name="StretchFill" Checked="ImageStretch_Checked" Content="{x:Bind ImageLabels.StretchFill, Mode=OneWay}" Tag="Fill" GroupName="ImageStretch" />
              <RadioButton x:Name="StretchUniform" Checked="ImageStretch_Checked" Content="{x:Bind ImageLabels.StretchUniform, Mode=OneWay}" Tag="Uniform" GroupName="ImageStretch" />
              <RadioButton x:Name="StretchUniformToFill" Checked="ImageStretch_Checked" Content="{x:Bind ImageLabels.StretchUniformToFill, Mode=OneWay}" Tag="UniformToFill" GroupName="ImageStretch" />
            </RadioButtons>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample x:Name="Example4" class="basic-input-example-theme" SampleDefinition="Image\NineGridImages.txt" HeaderText="{x:Bind ImageLabels.NineGrid, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind NineGridXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel class="image-stack">
              <TextBlock Text="{x:Bind ImageLabels.NormalImage, Mode=OneWay}" TextWrapping="Wrap" />
              <Image Height="82" Source="{x:Bind Media.NineGrid, Mode=OneWay}" AutomationProperties.Name="{x:Bind ImageLabels.NormalImage, Mode=OneWay}" ImageOpened="NineGridNormal_ImageOpened" ImageFailed="NineGridNormal_ImageFailed" />
              <TextBlock Text="{x:Bind ImageLabels.StretchedEvenly, Mode=OneWay}" TextWrapping="Wrap" />
              <Image Height="164" NineGrid="3,3,3,3" Source="{x:Bind Media.NineGrid, Mode=OneWay}" AutomationProperties.Name="{x:Bind ImageLabels.StretchedEvenly, Mode=OneWay}" ImageOpened="NineGridEvenly_ImageOpened" ImageFailed="NineGridEvenly_ImageFailed" />
              <TextBlock Text="{x:Bind ImageLabels.StretchedNineGrid, Mode=OneWay}" TextWrapping="Wrap" />
              <Image Height="164" NineGrid="30,20,30,20" Source="{x:Bind Media.NineGrid, Mode=OneWay}" AutomationProperties.Name="{x:Bind ImageLabels.StretchedNineGrid, Mode=OneWay}" ImageOpened="NineGridStretched_ImageOpened" ImageFailed="NineGridStretched_ImageFailed" />
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output>
            <StackPanel Spacing="4" class="image-output">
              <TextBlock Text="{x:Bind NineGridNormalOutput, Mode=OneWay}" TextWrapping="Wrap" />
              <TextBlock Text="{x:Bind NineGridEvenlyOutput, Mode=OneWay}" TextWrapping="Wrap" />
              <TextBlock Text="{x:Bind NineGridStretchedOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </StackPanel>
          </ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>

        <ControlExample x:Name="Example5" class="basic-input-example-theme" SampleDefinition="Image\SvgImage.txt" HeaderText="{x:Bind ImageLabels.Svg, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SvgXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Image x:Name="SvgImage" Height="100" Source="{x:Bind Media.Svg, Mode=OneWay}" AutomationProperties.Name="{x:Bind ImageLabels.SvgName, Mode=OneWay}" ImageOpened="SvgImage_ImageOpened" ImageFailed="SvgImage_ImageFailed" />
          </ControlExample.Example>
          <ControlExample.Output>
            <TextBlock class="image-output" Text="{x:Bind SvgOutput, Mode=OneWay}" TextWrapping="Wrap" />
          </ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>

        <ControlExample x:Name="Example6" class="basic-input-example-theme" SampleDefinition="Image\AnimatedGif.txt" HeaderText="{x:Bind ImageLabels.AnimatedGif, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind GifXaml, Mode=OneWay}" CSharp="{x:Bind GifCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel Spacing="12" class="image-stack">
              <TextBlock Text="{x:Bind ImageLabels.GifAuto, Mode=OneWay}" TextWrapping="Wrap" />
              <Image Height="40" HorizontalAlignment="Left" Source="{x:Bind Media.AnimatedGif, Mode=OneWay}" AutomationProperties.Name="{x:Bind ImageLabels.GifAutoName, Mode=OneWay}" ImageOpened="AutoGif_ImageOpened" ImageFailed="AutoGif_ImageFailed" />

              <TextBlock Text="{x:Bind ImageLabels.GifAutoPlayFalse, Mode=OneWay}" TextWrapping="Wrap" />
              <Image Height="40" HorizontalAlignment="Left" AutomationProperties.Name="{x:Bind ImageLabels.GifPausedName, Mode=OneWay}" ImageOpened="PausedGif_ImageOpened" ImageFailed="PausedGif_ImageFailed">
                <Image.Source>
                  <BitmapImage AutoPlay="False" UriSource="{x:Bind Media.AnimatedGif, Mode=OneWay}" />
                </Image.Source>
              </Image>

              <TextBlock Text="{x:Bind ImageLabels.GifManual, Mode=OneWay}" TextWrapping="Wrap" />
              <Image Height="40" HorizontalAlignment="Left" AutomationProperties.Name="{x:Bind ImageLabels.GifManualName, Mode=OneWay}" ImageOpened="ManualGif_ImageOpened" ImageFailed="ManualGif_ImageFailed">
                <Image.Source>
                  <BitmapImage x:Name="ClickToPlaySource" AutoPlay="False" ImageOpened="ClickToPlaySource_ImageOpened" UriSource="{x:Bind Media.AnimatedGif, Mode=OneWay}" />
                </Image.Source>
              </Image>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output>
            <StackPanel Spacing="4" class="image-output">
              <TextBlock Text="{x:Bind AutoGifOutput, Mode=OneWay}" TextWrapping="Wrap" />
              <TextBlock Text="{x:Bind PausedGifOutput, Mode=OneWay}" TextWrapping="Wrap" />
              <TextBlock Text="{x:Bind ManualGifOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </StackPanel>
          </ControlExample.Output>
          <ControlExample.Options>
            <StackPanel x:Name="PlaybackButtons" Spacing="8" Visibility="{x:Bind PlaybackVisibility, Mode=OneWay}">
              <Button Click="{x:Bind ClickToPlaySource.Play}" Content="{x:Bind ImageLabels.Play, Mode=OneWay}" />
              <Button Click="{x:Bind ClickToPlaySource.Stop}" Content="{x:Bind ImageLabels.Stop, Mode=OneWay}" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref, shallowRef } from 'vue';
import BitmapImage from '../../components/BitmapImage.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import Image from '../../components/Image.vue';
import RadioButton from '../../components/RadioButton.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'image');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const mediaRoot = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia';
const Media = Object.freeze({
  Treetops: mediaRoot + '/treetops.jpg',
  Valley: mediaRoot + '/valley.jpg',
  NineGrid: mediaRoot + '/ninegrid.gif',
  Svg: mediaRoot + '/MirrorPCConsent.svg',
  AnimatedGif: mediaRoot + '/animated.gif'
});

const ImageLabels = computed(() => ({
  PageTitle: t('text.image'), Description: t('text.image-description'),
  ToggleTheme: t('gallery.page-header.toggle-theme'),
  Basic: t('sample.image.basic-local-file'), Decoded: t('sample.image.decoded-rendering-size'),
  Stretching: t('sample.image.stretching'), StretchMode: t('sample.image.stretch-mode'),
  StretchNone: t('sample.image.stretch-none'), StretchFill: t('sample.image.stretch-fill'),
  StretchUniform: t('sample.image.stretch-uniform'), StretchUniformToFill: t('sample.image.stretch-uniform-to-fill'),
  NineGrid: t('sample.image.nine-grid'), Svg: t('sample.image.svg'), AnimatedGif: t('sample.image.animated-gif'),
  Treetops: t('sample.image.treetops'), Valley: t('sample.image.valley'),
  NormalImage: t('sample.image.normal-image'), StretchedEvenly: t('sample.image.stretched-evenly'),
  StretchedNineGrid: t('sample.image.stretched-nine-grid'), SvgName: t('sample.image.svg-name'),
  GifAuto: t('sample.image.gif-auto'), GifAutoPlayFalse: t('sample.image.gif-autoplay-false'),
  GifManual: t('sample.image.gif-manual'), GifAutoName: t('sample.image.gif-auto-name'),
  GifPausedName: t('sample.image.gif-paused-name'), GifManualName: t('sample.image.gif-manual-name'),
  Play: t('text.play'), Stop: t('text.stop')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'sample.image.remove-favorite' : 'sample.image.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const StretchMode = ref('None');
const ManualGifSource = shallowRef(null);
const PlaybackVisibility = computed(() => ManualGifSource.value?.IsAnimatedBitmap ? 'Visible' : 'Collapsed');

// Retain the actual public Image models supplied by ImageOpened. Reading their
// dependency properties keeps dimensions and playback outputs in sync with the controls.
const imageStates = Object.fromEntries(['basic', 'decoded', 'stretch', 'nineNormal', 'nineEvenly', 'nineStretched', 'svg', 'autoGif', 'pausedGif', 'manualGif'].map((key) => [key, { image: shallowRef(null), failed: ref(false) }]));
const opened = (key, sender) => {
  imageStates[key].image.value = sender;
  imageStates[key].failed.value = false;
};
const failed = (key) => {
  imageStates[key].image.value = null;
  imageStates[key].failed.value = true;
};
const BasicImage_ImageOpened = (sender) => opened('basic', sender);
const BasicImage_ImageFailed = () => failed('basic');
const DecodedImage_ImageOpened = (sender) => opened('decoded', sender);
const DecodedImage_ImageFailed = () => failed('decoded');
const StretchImage_ImageOpened = (sender) => opened('stretch', sender);
const StretchImage_ImageFailed = () => failed('stretch');
const NineGridNormal_ImageOpened = (sender) => opened('nineNormal', sender);
const NineGridNormal_ImageFailed = () => failed('nineNormal');
const NineGridEvenly_ImageOpened = (sender) => opened('nineEvenly', sender);
const NineGridEvenly_ImageFailed = () => failed('nineEvenly');
const NineGridStretched_ImageOpened = (sender) => opened('nineStretched', sender);
const NineGridStretched_ImageFailed = () => failed('nineStretched');
const SvgImage_ImageOpened = (sender) => opened('svg', sender);
const SvgImage_ImageFailed = () => failed('svg');
const AutoGif_ImageOpened = (sender) => opened('autoGif', sender);
const AutoGif_ImageFailed = () => failed('autoGif');
const PausedGif_ImageOpened = (sender) => opened('pausedGif', sender);
const PausedGif_ImageFailed = () => failed('pausedGif');
const ManualGif_ImageOpened = (sender) => opened('manualGif', sender);
const ManualGif_ImageFailed = () => { failed('manualGif'); ManualGifSource.value = null; };
const ClickToPlaySource_ImageOpened = (sender) => { ManualGifSource.value = sender; };
const ImageStretch_Checked = (sender) => {
  if (['None', 'Fill', 'Uniform', 'UniformToFill'].includes(sender?.Tag)) StretchMode.value = sender.Tag;
};

const dimensions = (image) => ({
  sourceWidth: Math.round(Number(image.Source?.PixelWidth) || 0),
  sourceHeight: Math.round(Number(image.Source?.PixelHeight) || 0),
  width: Math.round(Number(image.ActualWidth) || 0),
  height: Math.round(Number(image.ActualHeight) || 0)
});
const imageOutput = (key) => {
  const state = imageStates[key];
  if (state.failed.value) return t('sample.image.output.failed');
  const image = state.image.value;
  return image ? t('sample.image.output.ready', dimensions(image)) : t('sample.image.output.loading');
};
const BasicOutput = computed(() => imageOutput('basic'));
const DecodedOutput = computed(() => {
  const image = imageStates.decoded.image.value;
  return image ? t('sample.image.output.decoded', { ...dimensions(image), decodeHeight: image.Source?.DecodePixelHeight ?? 0 }) : imageOutput('decoded');
});
const StretchOutput = computed(() => {
  const image = imageStates.stretch.image.value;
  return image ? t('sample.image.output.stretch', { ...dimensions(image), mode: t({ None: 'sample.image.stretch-none', Fill: 'sample.image.stretch-fill', Uniform: 'sample.image.stretch-uniform', UniformToFill: 'sample.image.stretch-uniform-to-fill' }[image.Stretch] || 'sample.image.stretch-none') }) : imageOutput('stretch');
});
const nineGridOutput = (key, label) => {
  const image = imageStates[key].image.value;
  return t('sample.image.output.named', { name: label, result: image ? t('sample.image.output.nine-grid', { ...dimensions(image), inset: image.NineGrid || t('sample.image.stretch-none') }) : imageOutput(key) });
};
const NineGridNormalOutput = computed(() => nineGridOutput('nineNormal', ImageLabels.value.NormalImage));
const NineGridEvenlyOutput = computed(() => nineGridOutput('nineEvenly', ImageLabels.value.StretchedEvenly));
const NineGridStretchedOutput = computed(() => nineGridOutput('nineStretched', ImageLabels.value.StretchedNineGrid));
const SvgOutput = computed(() => imageOutput('svg'));
const gifOutput = (key, label) => {
  const image = imageStates[key].image.value;
  const result = image ? t('sample.image.output.gif', {
    ...dimensions(image),
    animated: t(image.Source?.IsAnimatedBitmap ? 'sample.image.output.yes' : 'sample.image.output.no'),
    playback: t(image.Source?.IsPlaying ? 'sample.image.output.playing' : 'sample.image.output.stopped')
  }) : imageOutput(key);
  return t('sample.image.output.named', { name: label, result });
};
const AutoGifOutput = computed(() => gifOutput('autoGif', ImageLabels.value.GifAutoName));
const PausedGifOutput = computed(() => gifOutput('pausedGif', ImageLabels.value.GifPausedName));
const ManualGifOutput = computed(() => gifOutput('manualGif', ImageLabels.value.GifManualName));

const BasicXaml = computed(() => t('sample.image.source.basic', { source: Media.Treetops }));
const DecodedXaml = computed(() => t('sample.image.source.decoded', { source: Media.Treetops }));
const StretchXaml = computed(() => t('sample.image.source.stretch', { source: Media.Valley, stretch: StretchMode.value }));
const StretchCSharp = computed(() => t('sample.image.source.stretch-csharp'));
const NineGridXaml = computed(() => t('sample.image.source.nine-grid', { source: Media.NineGrid }));
const SvgXaml = computed(() => t('sample.image.source.svg', { source: Media.Svg }));
const GifXaml = computed(() => t('sample.image.source.gif', {
  source: Media.AnimatedGif, auto: ImageLabels.value.GifAuto, paused: ImageLabels.value.GifAutoPlayFalse,
  manual: ImageLabels.value.GifManual, play: ImageLabels.value.Play, stop: ImageLabels.value.Stop
}));
const GifCSharp = computed(() => t('sample.image.source.gif-csharp'));
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { margin: 0 72px 8px 0; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.gallery-page-content { container-type: inline-size; container-name: image-gallery; }
.image-stack { min-width: 0; max-width: 100%; }
.image-output { min-width: 0; max-width: 100%; overflow-wrap: anywhere; }

@container image-gallery (max-width: 739px) {
  :deep(.example-container) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto;
  }

  :deep(.example-display) {
    grid-column: 1;
    grid-row: 1;
  }

  :deep(.example-output) {
    grid-column: 1;
    grid-row: 2;
    width: auto;
    max-width: none;
    margin: 0 12px 12px;
    box-sizing: border-box;
    justify-self: stretch;
  }

  :deep(.example-options) {
    grid-column: 1;
    grid-row: 3;
    width: auto;
    max-width: none;
    margin: 0;
    border-left: 0;
    border-top: 1px solid var(--DividerStrokeColorDefaultBrush, var(--stroke-divider));
    border-radius: 0;
    box-sizing: border-box;
    justify-self: stretch;
  }
}
</style>
