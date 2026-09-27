<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" AutomationProperties.Name="{x:Bind toggleThemeLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind toggleThemeLabel, Mode=OneWay}" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
            <ToggleButton class="header-action" AutomationProperties.Name="{x:Bind favoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteLabel, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" HeaderText="{x:Bind exampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind viewboxXaml, Mode=OneWay}">
            <ControlExample.Example>
              <Viewbox x:Name="Control1" Width="{x:Bind SizeSlider.Value, Mode=OneWay}" Height="{x:Bind SizeSlider.Value, Mode=OneWay}" VerticalAlignment="Top" Stretch="{x:Bind stretch, Mode=OneWay}" StretchDirection="{x:Bind stretchDirection, Mode=OneWay}">
                <Border BorderBrush="Gray" BorderThickness="15">
                  <StackPanel Background="DarkGray">
                    <StackPanel Orientation="Horizontal">
                      <Rectangle Width="40" Height="10" Fill="Blue" />
                      <Rectangle Width="40" Height="10" Fill="Green" />
                      <Rectangle Width="40" Height="10" Fill="Red" />
                      <Rectangle Width="40" Height="10" Fill="Yellow" />
                    </StackPanel>
                    <Image Source="{x:Bind sliceImage}" />
                    <TextBlock HorizontalAlignment="Center" Text="{x:Bind sampleText, Mode=OneWay}" />
                  </StackPanel>
                </Border>
              </Viewbox>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel Width="200">
                <Slider x:Name="SizeSlider" Header="{x:Bind sizeLabel, Mode=OneWay}" Maximum="300" Minimum="20" Value="{x:Bind size, Mode=TwoWay}" />
                <RadioButtons Header="{x:Bind stretchLabel, Mode=OneWay}" SelectionChanged="Stretch_SelectionChanged">
                  <RadioButton Content="{x:Bind noneLabel, Mode=OneWay}" Tag="None" />
                  <RadioButton Content="{x:Bind fillLabel, Mode=OneWay}" Tag="Fill" />
                  <RadioButton Content="{x:Bind uniformLabel, Mode=OneWay}" Tag="Uniform" IsChecked="True" />
                  <RadioButton Content="{x:Bind uniformToFillLabel, Mode=OneWay}" Tag="UniformToFill" />
                </RadioButtons>
                <RadioButtons Header="{x:Bind stretchDirectionLabel, Mode=OneWay}" SelectionChanged="StretchDirection_SelectionChanged">
                  <RadioButton Content="{x:Bind upOnlyLabel, Mode=OneWay}" GroupName="StretchDirection" Tag="UpOnly" />
                  <RadioButton Content="{x:Bind downOnlyLabel, Mode=OneWay}" GroupName="StretchDirection" Tag="DownOnly" />
                  <RadioButton Content="{x:Bind bothLabel, Mode=OneWay}" GroupName="StretchDirection" Tag="Both" IsChecked="True" />
                </RadioButtons>
              </StackPanel>
            </ControlExample.Options>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import Border from '../../components/Border.vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import Image from '../../components/Image.vue'
import Page from '../../components/Page.vue'
import RadioButton from '../../components/RadioButton.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import Rectangle from '../../components/Rectangle.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import Viewbox from '../../components/Viewbox.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'viewbox')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const toggleThemeLabel = computed(() => t('gallery.page-header.toggle-theme'))
const favoriteLabel = computed(() => t('gallery.page-header.favorite'))
const pageTitle = computed(() => t('text.viewbox'))
const pageDescription = computed(() => t('text.viewbox-description'))
const exampleHeader = computed(() => t('sample.viewbox.content'))
const sampleText = computed(() => t('sample.viewbox.text'))
const sizeLabel = computed(() => t('sample.viewbox.size'))
const stretchLabel = computed(() => t('sample.viewbox.stretch'))
const stretchDirectionLabel = computed(() => t('sample.viewbox.stretch-direction'))
const noneLabel = computed(() => t('sample.viewbox.none'))
const fillLabel = computed(() => t('sample.viewbox.fill'))
const uniformLabel = computed(() => t('sample.viewbox.uniform'))
const uniformToFillLabel = computed(() => t('sample.viewbox.uniform-to-fill'))
const upOnlyLabel = computed(() => t('sample.viewbox.up-only'))
const downOnlyLabel = computed(() => t('sample.viewbox.down-only'))
const bothLabel = computed(() => t('sample.viewbox.both'))
const sliceImage = 'https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/Slices.png'
const size = ref(200)
const stretch = ref('Uniform')
const stretchDirection = ref('Both')
const stretchValues = ['None', 'Fill', 'Uniform', 'UniformToFill']
const directionValues = ['UpOnly', 'DownOnly', 'Both']
const selectedTag = (args, values) => args?.SelectedItem?.Tag ?? values[args?.SelectedIndex]
const Stretch_SelectionChanged = (args) => {
  const value = selectedTag(args, stretchValues)
  if (stretchValues.includes(value)) stretch.value = value
}
const StretchDirection_SelectionChanged = (args) => {
  const value = selectedTag(args, directionValues)
  if (directionValues.includes(value)) stretchDirection.value = value
}
const xmlText = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const viewboxXaml = computed(() => `<Viewbox Height="${size.value}" Width="${size.value}" Stretch="${stretch.value}" StretchDirection="${stretchDirection.value}">
    <Border BorderBrush="Gray" BorderThickness="15">
        <StackPanel Background="DarkGray">
            <StackPanel Orientation="Horizontal">
                <Rectangle Fill="Blue" Height="10" Width="40" />
                <Rectangle Fill="Green" Height="10" Width="40" />
                <Rectangle Fill="Red" Height="10" Width="40" />
                <Rectangle Fill="Yellow" Height="10" Width="40" />
            </StackPanel>
            <Image Source="ms-appx:///Assets/SampleMedia/Slices.png" />
            <TextBlock Text="${xmlText(sampleText.value)}" HorizontalAlignment="Center" />
        </StackPanel>
    </Border>
</Viewbox>`)
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
