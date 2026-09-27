<template>
  <Page>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind PageTitle, Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind PageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind ThemeButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind ThemeButtonLabel, Mode=OneWay}">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteButtonLabel, Mode=OneWay}">
            <TextBlock class="icon" Text="{x:Bind FavoriteGlyph, Mode=OneWay}" />
          </ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" SampleDefinition="ToolTip\ButtonSimpleTooltip.txt" HeaderText="{x:Bind SimpleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SimpleXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Button Content="{x:Bind ButtonContent, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind SimpleToolTipContent, Mode=OneWay}" />
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>

        <ControlExample SampleDefinition="ToolTip\TextblockOffsetTooltip.txt" HeaderText="{x:Bind OffsetHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind OffsetXaml, Mode=OneWay}">
          <ControlExample.Example>
            <TextBlock Text="{x:Bind OffsetTargetText, Mode=OneWay}">
              <ToolTipService.ToolTip>
                <ToolTip Content="{x:Bind OffsetToolTipContent, Mode=OneWay}" VerticalOffset="-80" />
              </ToolTipService.ToolTip>
            </TextBlock>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>

        <ControlExample SampleDefinition="ToolTip\ImageTooltipPlacementrect.txt" HeaderText="{x:Bind ImageHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind ImageXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Image x:Name="textBoxToPlace" Width="400" Height="266" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg" AutomationProperties.Name="{x:Bind ImageDescription, Mode=OneWay}">
              <ToolTipService.ToolTip>
                <ToolTip PlacementRect="0,0,400,266" AutomationProperties.FullDescription="{x:Bind NonOccludingDescription, Mode=OneWay}" Content="{x:Bind ImageToolTipContent, Mode=OneWay}" Placement="Right" />
              </ToolTipService.ToolTip>
            </Image>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import Image from '../../components/Image.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ToolTip from '../../components/ToolTip.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import simpleSample from '../samples/ToolTip/ButtonSimpleTooltip.txt?raw'
import offsetSample from '../samples/ToolTip/TextblockOffsetTooltip.txt?raw'
import imageSample from '../samples/ToolTip/ImageTooltipPlacementrect.txt?raw'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'tooltip')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)

const resource = key => computed(() => t(key))
const PageTitle = resource('text.tooltip')
const PageDescription = resource('text.tooltip-description')
const SimpleHeader = resource('sample.tooltip.simple')
const OffsetHeader = resource('sample.tooltip.attached')
const ImageHeader = resource('sample.tooltip.image')
const ButtonContent = resource('sample.tooltip.button-content')
const SimpleToolTipContent = resource('sample.tooltip.simple-content')
const OffsetTargetText = resource('sample.tooltip.textblock-target')
const OffsetToolTipContent = resource('sample.tooltip.service-content')
const ImageToolTipContent = resource('sample.tooltip.image-content')
const ImageDescription = resource('sample.tooltip.image-alt')
const NonOccludingDescription = resource('sample.tooltip.image-description')
const ThemeButtonLabel = resource('gallery.toggle-theme')
const FavoriteButtonLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const sampleXaml = source => source.split(/--- xaml\s*\r?\n/)[1]?.trim() ?? ''
const escapeXaml = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const SimpleXaml = computed(() => sampleXaml(simpleSample)
  .replace('Button with a simple ToolTip.', escapeXaml(ButtonContent.value))
  .replace('Simple ToolTip', escapeXaml(SimpleToolTipContent.value)))
const OffsetXaml = computed(() => sampleXaml(offsetSample)
  .replace('TextBlock with an offset ToolTip.', escapeXaml(OffsetTargetText.value))
  .replace('Offset ToolTip.', escapeXaml(OffsetToolTipContent.value)))
const ImageXaml = computed(() => sampleXaml(imageSample)
  .replace('Non-occluding ToolTip.', escapeXaml(ImageToolTipContent.value))
  .replace('/Assets/SampleMedia/cliff.jpg', 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg'))

provide(xamlScopeKey, {
  PageTitle, PageDescription, SimpleHeader, OffsetHeader, ImageHeader,
  ButtonContent, SimpleToolTipContent, OffsetTargetText, OffsetToolTipContent,
  ImageToolTipContent, ImageDescription, NonOccludingDescription,
  ThemeButtonLabel, FavoriteButtonLabel, FavoriteGlyph,
  SimpleXaml, OffsetXaml, ImageXaml,
  isFavoriteState, pageTheme, toggleTheme, toggleFavorite
})
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
