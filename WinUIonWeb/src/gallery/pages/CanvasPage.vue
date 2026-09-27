<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" AutomationProperties.Name="{x:Bind themeButtonName, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind themeButtonName, Mode=OneWay}" Click="toggleTheme">
              <TextBlock class="icon" Text="&#xE793;" />
            </Button>
            <ToggleButton class="header-action" AutomationProperties.Name="{x:Bind favoriteButtonName, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteButtonName, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite">
              <TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" SampleDefinition="Canvas\CanvasControl.txt" HeaderText="{x:Bind sampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind canvasSource, Mode=OneWay}">
            <ControlExample.Example>
              <Canvas x:Name="Control1" Width="140" Height="140" VerticalAlignment="Top" Background="Gray">
                <Canvas.Resources>
                  <Style TargetType="Rectangle">
                    <Setter Property="Height" Value="40" />
                    <Setter Property="Width" Value="40" />
                  </Style>
                </Canvas.Resources>
                <Rectangle Canvas.Left="{x:Bind LeftSlider.Value, Mode=OneWay}" Canvas.Top="{x:Bind TopSlider.Value, Mode=OneWay}" Canvas.ZIndex="{x:Bind (x:Int32)ZSlider.Value, Mode=OneWay}" Fill="Red" />
                <Rectangle Canvas.Left="20" Canvas.Top="20" Canvas.ZIndex="1" Fill="Blue" />
                <Rectangle Canvas.Left="40" Canvas.Top="40" Canvas.ZIndex="2" Fill="Green" />
                <Rectangle Canvas.Left="60" Canvas.Top="60" Canvas.ZIndex="3" Fill="Yellow" />
              </Canvas>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel Orientation="Horizontal">
                <Slider x:Name="TopSlider" Height="110" VerticalAlignment="Top" IsDirectionReversed="True" Maximum="100" Minimum="0" Orientation="Vertical" StepFrequency="1" Value="{x:Bind topValue, Mode=TwoWay}">
                  <Slider.Header>
                    <TextBlock Margin="0,0,0,10" Text="{x:Bind optionText.Top, Mode=OneWay}" />
                  </Slider.Header>
                </Slider>
                <StackPanel Margin="16,0,0,0">
                  <Slider x:Name="LeftSlider" Width="100" Header="{x:Bind optionText.Left, Mode=OneWay}" Maximum="100" Minimum="0" StepFrequency="1" Value="{x:Bind leftValue, Mode=TwoWay}" />
                  <Slider x:Name="ZSlider" Width="100" Header="{x:Bind optionText.ZIndex, Mode=OneWay}" Maximum="4" Minimum="0" StepFrequency="1" Value="{x:Bind zIndexValue, Mode=TwoWay}" />
                </StackPanel>
              </StackPanel>
            </ControlExample.Options>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, ref } from 'vue';
import Button from '../../components/Button.vue';
import Canvas from '../../components/Canvas.vue';
import { XamlStyle as Style, XamlSetter as Setter } from '../../components/CollectionProperties';
import ControlExample from '../../components/ControlExample.vue';
import Page from '../../components/Page.vue';
import Rectangle from '../../components/Rectangle.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import Slider from '../../components/Slider.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'canvas');
const pageTitle = computed(() => t('text.canvas'));
const pageDescription = computed(() => t('text.canvas-description'));
const sampleHeader = computed(() => t('sample.canvas.control'));
const themeButtonName = computed(() => t('gallery.toggle-theme'));
const favoriteButtonName = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const optionText = computed(() => ({
  Top: t('sample.canvas.top'),
  Left: t('sample.canvas.left'),
  ZIndex: t('sample.canvas.z-index')
}));
const leftValue = ref(0);
const topValue = ref(0);
const zIndexValue = ref(0);
const canvasSource = computed(() => `<Canvas Width="120" Height="120" Background="Gray">
    <Rectangle Fill="Red" Canvas.Left="${leftValue.value}" Canvas.Top="${topValue.value}" Canvas.ZIndex="${zIndexValue.value}" />
    <Rectangle Fill="Blue" Canvas.Left="20" Canvas.Top="20" Canvas.ZIndex="1" />
    <Rectangle Fill="Green" Canvas.Left="40" Canvas.Top="40" Canvas.ZIndex="2" />
    <Rectangle Fill="Yellow" Canvas.Left="60" Canvas.Top="60" Canvas.ZIndex="3" />
</Canvas>`);

provide(xamlScopeKey, {
  pageTitle, pageDescription, sampleHeader, optionText,
  themeButtonName, favoriteButtonName, favoriteGlyph,
  isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  leftValue, topValue, zIndexValue, canvasSource
});
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 80px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif; font-size: 16px; }
</style>
