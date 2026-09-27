<template>
  <Page>
    <Page.Resources>
      <ResourceDictionary>
        <ResourceDictionary.ThemeDictionaries>
          <ResourceDictionary x:Key="Default">
            <media:AcrylicBrush x:Key="CustomAcrylicInAppBrush" FallbackColor="Green" TintColor="Black" TintOpacity="0.8" />
            <media:AcrylicBrush x:Key="CustomAcrylicInAppLuminosity" FallbackColor="SkyBlue" TintColor="SkyBlue" TintOpacity="0.8" />
          </ResourceDictionary>
        </ResourceDictionary.ThemeDictionaries>
        <DataTemplate x:Key="ColorTemplate" x:DataType="SolidColorBrush">
          <StackPanel AutomationProperties.Name="{x:Bind Color}" Orientation="Horizontal">
            <Rectangle Width="20" Height="20" Fill="{x:Bind}" />
            <TextBlock Margin="4,0,0,0" Text="{x:Bind Color}" />
          </StackPanel>
        </DataTemplate>
      </ResourceDictionary>
    </Page.Resources>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Hidden" VerticalScrollMode="Auto" HorizontalScrollBarVisibility="Disabled" HorizontalScrollMode="Disabled">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" FontSize="28" FontWeight="SemiBold" Text="{x:Bind Labels.Title, Mode=OneWay}" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}">
              <FontIcon Glyph="&#xE793;" FontSize="16" />
            </Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}">
              <FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <RichTextBlock class="acrylic-description">
            <Paragraph>
              <Run Text="{x:Bind Labels.AdaptabilityDescription, Mode=OneWay}" />
              <Hyperlink NavigateUri="https://learn.microsoft.com/windows/apps/design/style/acrylic#usability-and-adaptability"><Run Text="{x:Bind Labels.AdaptabilityLink, Mode=OneWay}" /></Hyperlink>
              <Run Text="{x:Bind Labels.InAppDescription, Mode=OneWay}" />
              <Hyperlink Click="SystemBackdropLink_Click"><Run Text="{x:Bind Labels.SystemBackdropsLink, Mode=OneWay}" /></Hyperlink>
              <Run Text="{x:Bind Labels.BackgroundDescription, Mode=OneWay}" />
            </Paragraph>
          </RichTextBlock>
          <ControlExample x:Name="Example1" class="basic-input-example-theme" SampleDefinition="Acrylic\DefaultAppAcrylicBrush.txt" HeaderText="{x:Bind Labels.DefaultHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind DefaultXaml, Mode=OneWay}">
            <ControlExample.Example>
              <Grid x:Name="Example1Grid" class="acrylic-example-grid" Width="{x:Bind DefaultWidth, Mode=OneWay}" Height="{x:Bind DemoHeight, Mode=OneWay}" MinWidth="320">
                <Grid>
                  <Rectangle Width="100" Height="200" HorizontalAlignment="Left" VerticalAlignment="Top" Fill="Aqua" />
                  <Ellipse Width="152" Height="152" HorizontalAlignment="Center" VerticalAlignment="Center" Fill="Magenta" />
                  <Rectangle Width="80" Height="100" HorizontalAlignment="Right" VerticalAlignment="Bottom" Fill="Yellow" />
                </Grid>
                <Rectangle Margin="12" Fill="{ThemeResource AcrylicInAppFillColorDefaultBrush}" />
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>
          <ControlExample x:Name="Example3" class="basic-input-example-theme" SampleDefinition="Acrylic\CustomAcrylicAppBrush.txt" HeaderText="{x:Bind Labels.CustomHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind CustomXaml, Mode=OneWay}" CSharp="{x:Bind CustomCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid x:Name="Example3Grid" class="acrylic-example-grid acrylic-example-grid-with-options" Width="{x:Bind CustomWidth, Mode=OneWay}" MinWidth="320" MinHeight="{x:Bind DemoHeight, Mode=OneWay}">
                <Grid.ColumnDefinitions><ColumnDefinition Width="*" /><ColumnDefinition Width="252" /></Grid.ColumnDefinitions>
                <Grid>
                  <Rectangle Width="100" Height="200" HorizontalAlignment="Left" VerticalAlignment="Top" Fill="Aqua" />
                  <Ellipse Width="152" Height="152" HorizontalAlignment="Center" VerticalAlignment="Center" Fill="Magenta" />
                  <Rectangle Width="80" Height="100" HorizontalAlignment="Right" VerticalAlignment="Bottom" Fill="Yellow" />
                </Grid>
                <Rectangle x:Name="CustomAcrylicShapeInApp" Margin="12" Fill="{ThemeResource CustomAcrylicInAppBrush}" />
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel>
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Labels.TintOpacity, Mode=OneWay}" />
                <Slider x:Name="OpacitySliderInApp" Width="200" HorizontalAlignment="Left" AutomationProperties.Name="{x:Bind Labels.TintOpacityName, Mode=OneWay}" IsFocusEngagementEnabled="False" Maximum="1" Minimum="0" SmallChange="0.001" StepFrequency="0.001" ValueChanged="Slider_ValueChanged" />
                <TextBlock Margin="0,12" Text="{x:Bind Labels.TintColor, Mode=OneWay}" />
                <ComboBox x:Name="ColorSelectorInApp" AutomationProperties.Name="{x:Bind Labels.TintColorName, Mode=OneWay}" ItemTemplate="{StaticResource ColorTemplate}" SelectionChanged="ColorSelector_SelectionChanged"><SolidColorBrush Color="Black" /><SolidColorBrush Color="Red" /><SolidColorBrush Color="Blue" /></ComboBox>
                <TextBlock Margin="0,12,0,12" Text="{x:Bind Labels.FallbackColor, Mode=OneWay}" />
                <ComboBox x:Name="FallbackColorSelectorInApp" AutomationProperties.Name="{x:Bind Labels.FallbackColorName, Mode=OneWay}" ItemTemplate="{StaticResource ColorTemplate}" SelectionChanged="FallbackColorSelector_SelectionChanged"><SolidColorBrush Color="Green" /><SolidColorBrush Color="Yellow" /></ComboBox>
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="OpacitySlider" Value="{x:Bind OpacitySliderInApp.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="TintColor" Value="{x:Bind ColorSelectorInApp.SelectedItem, Mode=OneWay}" />
              <ControlExampleSubstitution Key="FallbackColor" Value="{x:Bind FallbackColorSelectorInApp.SelectedItem, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
          <ControlExample x:Name="Example4" class="basic-input-example-theme" SampleDefinition="Acrylic\LuminosityAppAcrylic.txt" HeaderText="{x:Bind Labels.LuminosityHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind LuminosityXaml, Mode=OneWay}" CSharp="{x:Bind LuminosityCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid x:Name="Example4Grid" class="acrylic-example-grid acrylic-example-grid-with-options" Width="{x:Bind CustomWidth, Mode=OneWay}" MinWidth="652" MinHeight="{x:Bind DemoHeight, Mode=OneWay}">
                <Grid.ColumnDefinitions><ColumnDefinition Width="*" /><ColumnDefinition Width="252" /></Grid.ColumnDefinitions>
                <Grid>
                  <Rectangle Width="100" Height="200" HorizontalAlignment="Left" VerticalAlignment="Top" Fill="Aqua" />
                  <Ellipse Width="152" Height="152" HorizontalAlignment="Center" VerticalAlignment="Center" Fill="Magenta" />
                  <Rectangle Width="80" Height="100" HorizontalAlignment="Right" VerticalAlignment="Bottom" Fill="Yellow" />
                </Grid>
                <Rectangle x:Name="CustomAcrylicShapeLumin" Margin="12" Fill="{ThemeResource CustomAcrylicInAppLuminosity}" />
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <StackPanel>
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Labels.TintOpacity, Mode=OneWay}" />
                <Slider x:Name="OpacitySliderLumin" Width="200" HorizontalAlignment="Left" AutomationProperties.Name="{x:Bind Labels.TintOpacityName, Mode=OneWay}" IsFocusEngagementEnabled="False" Maximum="1" Minimum="0" SmallChange="0.001" StepFrequency="0.001" ValueChanged="Slider_ValueChanged" />
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Labels.TintLuminosityOpacity, Mode=OneWay}" />
                <Slider x:Name="LuminositySlider" Width="200" HorizontalAlignment="Left" AutomationProperties.Name="{x:Bind Labels.TintLuminosityName, Mode=OneWay}" IsFocusEngagementEnabled="False" Maximum="1" Minimum="0" SmallChange="0.001" StepFrequency="0.001" ValueChanged="LuminositySlider_ValueChanged" />
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="OpacitySlider" Value="{x:Bind OpacitySliderLumin.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="TintLuminositySlider" Value="{x:Bind LuminositySlider.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, defineComponent, getCurrentInstance, h, inject, onBeforeUnmount, onMounted, provide, ref, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import ColumnDefinition from '../../components/ColumnDefinition.vue';
import ComboBox from '../../components/ComboBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties';
import { DataTemplate } from '../../components/CollectionProperties';
import Ellipse from '../../components/Ellipse.vue';
import FontIcon from '../../components/FontIcon.vue';
import Grid from '../../components/Grid.vue';
import Page from '../../components/Page.vue';
import Rectangle from '../../components/Rectangle.vue';
import RichTextBlock from '../../components/RichTextBlock.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import Slider from '../../components/Slider.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { Hyperlink, Run } from '../../components/TextInline';
import { useI18n } from '../../components/i18n/index';
import { ResourceDictionary, SolidColorBrush } from '../../components/xamlPrimitives';
import { normalizeXamlNodes, xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
const documentElement = (name, tag) => defineComponent({
  name,
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const instance = getCurrentInstance();
    return () => h(tag, attrs, normalizeXamlNodes(slots.default?.() ?? [], instance));
  }
});
const Paragraph = documentElement('Paragraph', 'p');
const { t } = useI18n();
const currentPage = inject('currentPage');
const navigate = inject('navigate');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'acrylicbrush');
const controls = shallowReactive({});
provide(xamlNameScopeKey, controls);
const Labels = computed(() => ({
  Title: t('text.acrylicbrush'), ToggleTheme: t('gallery.page-header.toggle-theme'),
  AdaptabilityDescription: t('sample.acrylic.adaptability-description'), AdaptabilityLink: t('sample.acrylic.adaptability-link'),
  InAppDescription: t('sample.acrylic.in-app-description'), SystemBackdropsLink: t('sample.acrylic.system-backdrops-link'),
  BackgroundDescription: t('sample.acrylic.background-description'), DefaultHeader: t('sample.acrylic.default-header'),
  CustomHeader: t('sample.acrylic.custom-header'), LuminosityHeader: t('sample.acrylic.luminosity-header'),
  TintOpacity: t('sample.acrylic.tint-opacity'), TintColor: t('sample.acrylic.tint-color'),
  FallbackColor: t('sample.acrylic.fallback-color'), TintLuminosityOpacity: t('sample.acrylic.tint-luminosity-opacity'),
  TintOpacityName: t('sample.acrylic.tint-opacity-name'), TintColorName: t('sample.acrylic.tint-color-name'),
  FallbackColorName: t('sample.acrylic.fallback-color-name'), TintLuminosityName: t('sample.acrylic.tint-luminosity-name')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const windowWidth = ref(typeof window === 'undefined' ? 800 : window.innerWidth);
const DefaultWidth = computed(() => windowWidth.value >= 500 ? 400 : 320);
const CustomWidth = computed(() => windowWidth.value >= 800 ? 652 : windowWidth.value >= 500 ? 500 : 320);
const DemoHeight = computed(() => windowWidth.value >= 500 ? 252 : 200);
const updateWindowWidth = () => { windowWidth.value = window.innerWidth; };
const Slider_ValueChanged = (sender, e) => {
  const shape = sender === controls.OpacitySliderLumin ? controls.CustomAcrylicShapeLumin : controls.CustomAcrylicShapeInApp;
  if (shape?.Fill) shape.Fill.TintOpacity = e.NewValue;
};
const ColorSelector_SelectionChanged = (_, e) => {
  const color = e?.AddedItems?.[0]?.Color;
  if (color !== undefined && controls.CustomAcrylicShapeInApp?.Fill) controls.CustomAcrylicShapeInApp.Fill.TintColor = color;
};
const FallbackColorSelector_SelectionChanged = (_, e) => {
  const color = e?.AddedItems?.[0]?.Color;
  if (color !== undefined && controls.CustomAcrylicShapeInApp?.Fill) controls.CustomAcrylicShapeInApp.Fill.FallbackColor = color;
};
const LuminositySlider_ValueChanged = (_, e) => {
  if (controls.CustomAcrylicShapeLumin?.Fill) controls.CustomAcrylicShapeLumin.Fill.TintLuminosityOpacity = e.NewValue;
};
const SystemBackdropLink_Click = () => { navigate?.('systembackdrops'); };
const DefaultXaml = '<Rectangle Fill="{ThemeResource AcrylicInAppFillColorDefaultBrush}" />';
const CustomXaml = `<Rectangle Fill="{ThemeResource CustomAcrylicInAppBrush}" />\n\n<ResourceDictionary x:Key="Default">\n    <media:AcrylicBrush x:Key="CustomAcrylicInAppBrush" TintOpacity="$(OpacitySlider)" TintColor="$(TintColor)" FallbackColor="$(FallbackColor)" />\n</ResourceDictionary>`;
const LuminosityXaml = `<Rectangle Fill="{ThemeResource CustomAcrylicInAppLuminosity}" />\n\n<ResourceDictionary x:Key="Default">\n    <media:AcrylicBrush x:Key="CustomAcrylicInAppLuminosity" TintOpacity="$(OpacitySlider)" TintLuminosityOpacity="$(TintLuminositySlider)" TintColor="SkyBlue" FallbackColor="SkyBlue" />\n</ResourceDictionary>`;
const SliderCSharp = `private void Slider_ValueChanged(object sender, RangeBaseValueChangedEventArgs e)
{
    Rectangle shape = CustomAcrylicShapeInApp;
    if ((Slider)sender == OpacitySliderLumin)
        shape = CustomAcrylicShapeLumin;

    ((AcrylicBrush)shape.Fill).TintOpacity = e.NewValue;
}`;
const CustomCSharp = `${SliderCSharp}

private void ColorSelector_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    Rectangle shape = CustomAcrylicShapeInApp;
    ((AcrylicBrush)shape.Fill).TintColor = ((SolidColorBrush)e.AddedItems.First()).Color;
}

private void FallbackColorSelector_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    Rectangle shape = CustomAcrylicShapeInApp;
    ((AcrylicBrush)shape.Fill).FallbackColor = ((SolidColorBrush)e.AddedItems.First()).Color;
}`;
const LuminosityCSharp = `${SliderCSharp}

private void LuminositySlider_ValueChanged(object sender, RangeBaseValueChangedEventArgs e)
{
    Rectangle shape = CustomAcrylicShapeLumin;
    ((AcrylicBrush)shape.Fill).TintLuminosityOpacity = e.NewValue;
}`;
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, DefaultWidth, CustomWidth, DemoHeight, DefaultXaml, CustomXaml, LuminosityXaml, CustomCSharp, LuminosityCSharp, Slider_ValueChanged, ColorSelector_SelectionChanged, FallbackColorSelector_SelectionChanged, LuminositySlider_ValueChanged, SystemBackdropLink_Click });
onMounted(() => {
  if (controls.ColorSelectorInApp) controls.ColorSelectorInApp.SelectedIndex = 0;
  if (controls.FallbackColorSelectorInApp) controls.FallbackColorSelectorInApp.SelectedIndex = 0;
  for (const name of ['OpacitySliderInApp', 'OpacitySliderLumin', 'LuminositySlider']) {
    if (controls[name]) controls[name].Value = 0.8;
  }
  window.addEventListener('resize', updateWindowWidth);
});
onBeforeUnmount(() => window.removeEventListener('resize', updateWindowWidth));
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { margin: 0 80px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-header-actions { position: absolute; top: 0; right: 0; }
.acrylic-description { margin-bottom: 24px; color: var(--text-primary); line-height: 20px; overflow-wrap: anywhere; }
.acrylic-description :deep(p) { margin: 0; }
.acrylic-example-grid { max-width: 100%; min-width: 0 !important; overflow: hidden; }
/* Release the official reserved column when its web display host narrows. */
.acrylic-example-grid-with-options { grid-template-columns: minmax(0, 1fr) clamp(0px, calc(100% - 400px), 252px) !important; }
.gallery-page-content :deep(.source-code-scroll > .viewer-scrollbar-host) { display: none; }
</style>
