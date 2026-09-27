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
          <ControlExample x:Name="Example1" SampleDefinition="Border\BorderAroundTextblock.txt" HeaderText="{x:Bind sampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind borderSource, Mode=OneWay}">
            <ControlExample.Example>
              <Border x:Name="Control1" VerticalAlignment="Top" Background="{x:Bind backgroundColor, Mode=OneWay}" BorderBrush="{x:Bind borderBrushColor, Mode=OneWay}" BorderThickness="{x:Bind borderThickness, Mode=OneWay}">
                <TextBlock Margin="8,5" FontSize="18" Foreground="Black" Text="{x:Bind borderText, Mode=OneWay}" />
              </Border>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel>
                <Slider x:Name="ThicknessSlider" Header="{x:Bind optionText.Thickness, Mode=OneWay}" IsFocusEngagementEnabled="False" Maximum="10" Minimum="0" StepFrequency="1" ValueChanged="ThicknessSlider_ValueChanged" Value="2" />
                <Grid>
                  <Grid.ColumnDefinitions>
                    <ColumnDefinition />
                    <ColumnDefinition />
                  </Grid.ColumnDefinitions>
                  <RadioButtons Header="{x:Bind optionText.Background, Mode=OneWay}">
                    <RadioButton Checked="BGRadioButton_Checked" Content="{x:Bind optionText.Green, Mode=OneWay}" Tag="Green" GroupName="BGColor" />
                    <RadioButton Checked="BGRadioButton_Checked" Content="{x:Bind optionText.Yellow, Mode=OneWay}" Tag="Yellow" GroupName="BGColor" />
                    <RadioButton Checked="BGRadioButton_Checked" Content="{x:Bind optionText.Blue, Mode=OneWay}" Tag="Blue" GroupName="BGColor" />
                    <RadioButton Checked="BGRadioButton_Checked" Content="{x:Bind optionText.White, Mode=OneWay}" Tag="White" GroupName="BGColor" IsChecked="True" />
                  </RadioButtons>
                  <RadioButtons Grid.Column="1" Header="{x:Bind optionText.BorderBrush, Mode=OneWay}">
                    <RadioButton Checked="RadioButton_Checked" Content="{x:Bind optionText.Green, Mode=OneWay}" Tag="Green" GroupName="BorderBrush" />
                    <RadioButton Checked="RadioButton_Checked" Content="{x:Bind optionText.Yellow, Mode=OneWay}" Tag="Yellow" GroupName="BorderBrush" IsChecked="True" />
                    <RadioButton Checked="RadioButton_Checked" Content="{x:Bind optionText.Blue, Mode=OneWay}" Tag="Blue" GroupName="BorderBrush" />
                    <RadioButton Checked="RadioButton_Checked" Content="{x:Bind optionText.White, Mode=OneWay}" Tag="White" GroupName="BorderBrush" />
                  </RadioButtons>
                </Grid>
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
import Border from '../../components/Border.vue';
import Button from '../../components/Button.vue';
import ColumnDefinition from '../../components/ColumnDefinition.vue';
import ControlExample from '../../components/ControlExample.vue';
import Grid from '../../components/Grid.vue';
import Page from '../../components/Page.vue';
import RadioButton from '../../components/RadioButton.vue';
import RadioButtons from '../../components/RadioButtons.vue';
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
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'border');
const pageTitle = computed(() => t('text.border'));
const pageDescription = computed(() => t('text.border-description'));
const sampleHeader = computed(() => t('sample.border.around-textblock'));
const borderText = computed(() => t('sample.border.inside-text'));
const themeButtonName = computed(() => t('gallery.toggle-theme'));
const favoriteButtonName = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const optionText = computed(() => ({
  Thickness: t('sample.border.thickness'),
  Background: t('sample.border.background'),
  BorderBrush: t('sample.border.brush'),
  Green: t('sample.layout.color-green'),
  Yellow: t('sample.layout.color-yellow'),
  Blue: t('sample.layout.color-blue'),
  White: t('sample.layout.color-white')
}));

const borderThickness = ref(2);
const backgroundColor = ref('#FFFFFFFF');
const borderBrushColor = ref('#FFFFD700');
const backgroundColors = { Green: '#FF008000', Yellow: '#FFFFFF00', Blue: '#FF0000FF', White: '#FFFFFFFF' };
const borderColors = { Green: '#FF006400', Yellow: '#FFFFD700', Blue: '#FF00008B', White: '#FFFFFFFF' };
const ThicknessSlider_ValueChanged = (_sender, args) => {
  borderThickness.value = args.NewValue;
};
const BGRadioButton_Checked = (sender) => {
  const color = backgroundColors[sender.Tag];
  if (color) backgroundColor.value = color;
};
const RadioButton_Checked = (sender) => {
  const color = borderColors[sender.Tag];
  if (color) borderBrushColor.value = color;
};
const borderSource = computed(() => `<Border BorderThickness="${borderThickness.value}" BorderBrush="${borderBrushColor.value}" Background="${backgroundColor.value}">
    <TextBlock Text="${borderText.value}" FontSize="18" Foreground="Black" />
</Border>`);

provide(xamlScopeKey, {
  pageTitle, pageDescription, sampleHeader, borderText, optionText,
  themeButtonName, favoriteButtonName, favoriteGlyph,
  isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  borderThickness, backgroundColor, borderBrushColor, borderSource,
  ThicknessSlider_ValueChanged, BGRadioButton_Checked, RadioButton_Checked
});
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 80px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif; font-size: 16px; }
</style>
