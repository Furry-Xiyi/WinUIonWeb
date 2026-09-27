<template>
<Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind PageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind PageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind ThemeButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind ThemeButtonLabel, Mode=OneWay}"><FontIcon Glyph="&#xE793;" /></Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteButtonLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" /></ToggleButton>
          </StackPanel>
        </StackPanel>


    <StackPanel class="gallery-page-content">

        <!--  LINE SAMPLE  -->
        <ControlExample x:Name="Example4" SampleDefinition="Line\Line.txt" HeaderText="{x:Bind LineHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind LineXaml, Mode=OneWay}">
            <ControlExample.Example>
            <Canvas Width="100" Height="200">
                <Line
                    x:Name="SampleLine"
                    Canvas.Top="50"
                    Stroke="SteelBlue"
                    StrokeThickness="{x:Bind lineSlider5.Value, Mode=TwoWay}"
                    X1="{x:Bind lineSlider1.Value, Mode=TwoWay}"
                    X2="{x:Bind lineSlider3.Value, Mode=TwoWay}"
                    Y1="{x:Bind lineSlider2.Value, Mode=TwoWay}"
                    Y2="{x:Bind lineSlider4.Value, Mode=TwoWay}" />
            </Canvas>
            </ControlExample.Example>
            <ControlExample.Output>
                <TextBlock Text="{x:Bind LineOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>


            <ControlExample.Options>
                <StackPanel Width="220">
                    <Slider
                        x:Name="lineSlider1"
                        Header="{x:Bind StartPointX, Mode=OneWay}"
                        IsFocusEngagementEnabled="False"
                        Maximum="100"
                        Minimum="0"
                        SmallChange="1"
                        StepFrequency="0.5" />
                    <Slider
                        x:Name="lineSlider2"
                        Header="{x:Bind StartPointY, Mode=OneWay}"
                        IsFocusEngagementEnabled="False"
                        Maximum="100"
                        Minimum="0"
                        SmallChange="1"
                        StepFrequency="0.5" />
                    <Slider
                        x:Name="lineSlider3"
                        Header="{x:Bind EndPointX, Mode=OneWay}"
                        IsFocusEngagementEnabled="False"
                        Maximum="300"
                        Minimum="200"
                        SmallChange="1"
                        StepFrequency="0.5" />
                    <Slider
                        x:Name="lineSlider4"
                        Header="{x:Bind EndPointY, Mode=OneWay}"
                        IsFocusEngagementEnabled="False"
                        Maximum="100"
                        Minimum="0"
                        SmallChange="1"
                        StepFrequency="0.5" />
                    <Slider
                        x:Name="lineSlider5"
                        Header="{x:Bind StrokeThicknessText, Mode=OneWay}"
                        IsFocusEngagementEnabled="False"
                        Maximum="10"
                        Minimum="5"
                        SmallChange="1"
                        StepFrequency="0.5" />
                </StackPanel>
            </ControlExample.Options>

            <ControlExample.Substitutions>
                <ControlExampleSubstitution Key="Slider1" Value="{x:Bind lineSlider1.Value, Mode=OneWay}" />
                <ControlExampleSubstitution Key="Slider2" Value="{x:Bind lineSlider2.Value, Mode=OneWay}" />
                <ControlExampleSubstitution Key="Slider3" Value="{x:Bind lineSlider3.Value, Mode=OneWay}" />
                <ControlExampleSubstitution Key="Slider4" Value="{x:Bind lineSlider4.Value, Mode=OneWay}" />
                <ControlExampleSubstitution Key="Slider5" Value="{x:Bind lineSlider5.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>


        </ControlExample>

        <!--  POLYLINE SAMPLE  -->
        <ControlExample x:Name="Example5" SampleDefinition="Line\Polyline.txt" HeaderText="{x:Bind PolylineHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind PolylineXaml, Mode=OneWay}">
            <ControlExample.Example>

            <Canvas Width="320" Height="170">
                <StackPanel>
                    <TextBlock Margin="0,0,0,10" Text="{x:Bind PolylineDescription, Mode=OneWay}" />
                    <Polyline
                        x:Name="SamplePolyline"
                        Canvas.ZIndex="0"
                        Points="10,100 60,40 200,40 250,100"
                        Stroke="Black"
                        StrokeThickness="{x:Bind polyLineSlider1.Value, Mode=TwoWay}" />
                </StackPanel>

                <TextBlock
                    Canvas.Left="0"
                    Canvas.Top="140"
                    Canvas.ZIndex="1"
                    Text="{x:Bind Point1, Mode=OneWay}"
                    TextWrapping="NoWrap"
                    Visibility="{x:Bind ToggleSwitch2.IsOn, Mode=OneWay}" />
                <TextBlock
                    Canvas.Left="50"
                    Canvas.Top="40"
                    Canvas.ZIndex="1"
                    Text="{x:Bind PolylinePoint2, Mode=OneWay}"
                    TextWrapping="NoWrap"
                    Visibility="{x:Bind ToggleSwitch2.IsOn, Mode=OneWay}" />
                <TextBlock
                    Canvas.Left="200"
                    Canvas.Top="40"
                    Canvas.ZIndex="1"
                    Text="{x:Bind PolylinePoint3, Mode=OneWay}"
                    TextWrapping="NoWrap"
                    Visibility="{x:Bind ToggleSwitch2.IsOn, Mode=OneWay}" />
                <TextBlock
                    Canvas.Left="240"
                    Canvas.Top="140"
                    Canvas.ZIndex="1"
                    Text="{x:Bind PolylinePoint4, Mode=OneWay}"
                    TextWrapping="NoWrap"
                    Visibility="{x:Bind ToggleSwitch2.IsOn, Mode=OneWay}" />
            </Canvas>
            </ControlExample.Example>
            <ControlExample.Output>
                <TextBlock Text="{x:Bind PolylineOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>

            <ControlExample.Options>
                <StackPanel Width="220">
                    <ToggleSwitch
                        x:Name="ToggleSwitch2"
                        Header="{x:Bind ShowPointsText, Mode=OneWay}"
                        IsOn="False" />
                    <Slider
                        x:Name="polyLineSlider1"
                        Header="{x:Bind StrokeThicknessText, Mode=OneWay}"
                        IsFocusEngagementEnabled="False"
                        Maximum="10"
                        Minimum="2"
                        SmallChange="1"
                        StepFrequency="0.5" />
                </StackPanel>
            </ControlExample.Options>

            <ControlExample.Substitutions>
                <ControlExampleSubstitution Key="Slider1" Value="{x:Bind polyLineSlider1.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>

        </ControlExample>

        <!--  PATH SAMPLE  -->
        <ControlExample x:Name="Example6" SampleDefinition="Line\LinePath.txt" HeaderText="{x:Bind PathHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind PathXaml, Mode=OneWay}">
            <ControlExample.Example>

            <Canvas Width="320" Height="200">
                <StackPanel>
                    <TextBlock Text="{x:Bind PathDescription, Mode=OneWay}" />
                    <Path
                        x:Name="SamplePath"
                        Data="M 10,100 C 100,25 300,250 400,75 H 200"
                        Stroke="DarkGoldenRod"
                        StrokeThickness="{x:Bind pathSlider1.Value, Mode=TwoWay}" />
                </StackPanel>

                <TextBlock
                    Canvas.Left="0"
                    Canvas.Top="130"
                    Canvas.ZIndex="1"
                    Text="{x:Bind Point1, Mode=OneWay}"
                    TextWrapping="NoWrap"
                    Visibility="{x:Bind ToggleSwitch.IsOn, Mode=OneWay}" />
                <TextBlock
                    Canvas.Left="40"
                    Canvas.Top="75"
                    Canvas.ZIndex="1"
                    Text="{x:Bind PathPoint2, Mode=OneWay}"
                    TextWrapping="NoWrap"
                    Visibility="{x:Bind ToggleSwitch.IsOn, Mode=OneWay}" />
                <TextBlock
                    Canvas.Left="280"
                    Canvas.Top="175"
                    Canvas.ZIndex="1"
                    Text="{x:Bind PathPoint3, Mode=OneWay}"
                    TextWrapping="NoWrap"
                    Visibility="{x:Bind ToggleSwitch.IsOn, Mode=OneWay}" />
                <TextBlock
                    Canvas.Left="360"
                    Canvas.Top="60"
                    Canvas.ZIndex="1"
                    Text="{x:Bind PathPoint4, Mode=OneWay}"
                    TextWrapping="NoWrap"
                    Visibility="{x:Bind ToggleSwitch.IsOn, Mode=OneWay}" />
                <TextBlock
                    Canvas.Left="170"
                    Canvas.Top="60"
                    Canvas.ZIndex="1"
                    Text="{x:Bind PathPoint5, Mode=OneWay}"
                    TextWrapping="NoWrap"
                    Visibility="{x:Bind ToggleSwitch.IsOn, Mode=OneWay}" />
            </Canvas>
            </ControlExample.Example>
            <ControlExample.Output>
                <TextBlock Text="{x:Bind PathOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>

            <ControlExample.Options>
                <StackPanel Width="220">
                    <ToggleSwitch
                        x:Name="ToggleSwitch"
                        Header="{x:Bind ShowPointsText, Mode=OneWay}"
                        IsOn="False" />
                    <Slider
                        x:Name="pathSlider1"
                        Header="{x:Bind StrokeThicknessText, Mode=OneWay}"
                        IsFocusEngagementEnabled="False"
                        Maximum="10"
                        Minimum="2"
                        SmallChange="1"
                        StepFrequency="0.5" />
                </StackPanel>
            </ControlExample.Options>

            <ControlExample.Substitutions>
                <ControlExampleSubstitution Key="Slider1" Value="{x:Bind pathSlider1.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>
        </ControlExample>

        <!--  GEOMETRY GROUP SAMPLE  -->
        <ControlExample x:Name="Example7" SampleDefinition="Line\LineGeometrygroup.txt" HeaderText="{x:Bind GeometryHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind GeometryXaml, Mode=OneWay}">
            <ControlExample.Example>
            <Canvas Width="100" Height="170">
                <StackPanel>
                    <TextBlock Margin="0,0,0,15" Text="{x:Bind GeometryDescription, Mode=OneWay}" />
                    <Path
                        Fill="#CCCCFF"
                        Stroke="Black"
                        StrokeThickness="4">
                        <Path.Data>
                            <!--  Creates a composite shape from three geometries.  -->
                            <GeometryGroup FillRule="EvenOdd">
                                <LineGeometry StartPoint="10,10" EndPoint="50,30" />
                                <EllipseGeometry
                                    x:Name="SampleEllipseGeometry"
                                    Center="40,70"
                                    RadiusX="{x:Bind geogroupslider1.Value, Mode=TwoWay}"
                                    RadiusY="{x:Bind geogroupslider2.Value, Mode=TwoWay}" />
                                <RectangleGeometry Rect="30,55 100 30" />
                            </GeometryGroup>
                        </Path.Data>
                    </Path>
                </StackPanel>
            </Canvas>
            </ControlExample.Example>
            <ControlExample.Output>
                <TextBlock Text="{x:Bind GeometryOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>

            <ControlExample.Options>
                <StackPanel Width="220">
                    <Slider
                        x:Name="geogroupslider1"
                        Header="{x:Bind RadiusXText, Mode=OneWay}"
                        IsFocusEngagementEnabled="False"
                        Maximum="40"
                        Minimum="30"
                        SmallChange="1"
                        StepFrequency="0.5" />
                    <Slider
                        x:Name="geogroupslider2"
                        Header="{x:Bind RadiusYText, Mode=OneWay}"
                        IsFocusEngagementEnabled="False"
                        Maximum="50"
                        Minimum="30"
                        SmallChange="1"
                        StepFrequency="0.5" />
                </StackPanel>
            </ControlExample.Options>

            <ControlExample.Substitutions>
                <ControlExampleSubstitution Key="Slider1" Value="{x:Bind geogroupslider1.Value, Mode=OneWay}" />
                <ControlExampleSubstitution Key="Slider2" Value="{x:Bind geogroupslider2.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>


        </ControlExample>

    </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import Canvas from '../../components/Canvas.vue'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import FontIcon from '../../components/FontIcon.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import { EllipseGeometry, GeometryGroup, Line, LineGeometry, Path, Polyline, RectangleGeometry } from '../../components/Shapes'
import Slider from '../../components/Slider.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ToggleSwitchControl from '../../components/ToggleSwitch.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import lineSample from '../samples/Line/Line.txt?raw'
import polylineSample from '../samples/Line/Polyline.txt?raw'
import pathSample from '../samples/Line/LinePath.txt?raw'
import geometrySample from '../samples/Line/LineGeometrygroup.txt?raw'

defineOptions({ components: { ToggleSwitch: ToggleSwitchControl } })

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'line')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const names = shallowReactive({})
provide(xamlNameScopeKey, names)
const resource = key => computed(() => t(key))
const PageTitle = resource('text.line')
const PageDescription = resource('sample.line.description')
const LineHeader = resource('sample.line.line')
const PolylineHeader = resource('sample.line.polyline')
const PathHeader = resource('sample.line.path')
const GeometryHeader = resource('sample.line.geometry-group')
const PolylineDescription = resource('sample.line.polyline-description')
const PathDescription = resource('sample.line.path-description')
const GeometryDescription = resource('sample.line.geometry-description')
const StartPointX = resource('sample.line.start-point-x')
const StartPointY = resource('sample.line.start-point-y')
const EndPointX = resource('sample.line.end-point-x')
const EndPointY = resource('sample.line.end-point-y')
const StrokeThicknessText = resource('sample.line.stroke-thickness')
const ShowPointsText = resource('sample.line.show-points')
const RadiusXText = resource('sample.line.radius-x')
const RadiusYText = resource('sample.line.radius-y')
const Point1 = resource('sample.line.point-1')
const PolylinePoint2 = resource('sample.line.polyline-point-2')
const PolylinePoint3 = resource('sample.line.polyline-point-3')
const PolylinePoint4 = resource('sample.line.polyline-point-4')
const PathPoint2 = resource('sample.line.path-point-2')
const PathPoint3 = resource('sample.line.path-point-3')
const PathPoint4 = resource('sample.line.path-point-4')
const PathPoint5 = resource('sample.line.path-point-5')
const ThemeButtonLabel = resource('gallery.toggle-theme')
const FavoriteButtonLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const numericProperty = (name, property) => Number(names[name]?.[property] ?? 0)
const pointsState = name => t(names[name]?.IsOn ? 'sample.line.points-visible' : 'sample.line.points-hidden')
const LineOutput = computed(() => t('sample.line.line-output', {
  x1: numericProperty('SampleLine', 'X1'), y1: numericProperty('SampleLine', 'Y1'),
  x2: numericProperty('SampleLine', 'X2'), y2: numericProperty('SampleLine', 'Y2'),
  thickness: numericProperty('SampleLine', 'StrokeThickness')
}))
const PolylineOutput = computed(() => t('sample.line.polyline-output', {
  points: names.SamplePolyline?.Points ?? '', thickness: numericProperty('SamplePolyline', 'StrokeThickness'),
  visibility: pointsState('ToggleSwitch2')
}))
const PathOutput = computed(() => t('sample.line.path-output', {
  data: names.SamplePath?.Data ?? '', thickness: numericProperty('SamplePath', 'StrokeThickness'),
  visibility: pointsState('ToggleSwitch')
}))
const GeometryOutput = computed(() => t('sample.line.geometry-output', {
  radiusX: numericProperty('SampleEllipseGeometry', 'RadiusX'),
  radiusY: numericProperty('SampleEllipseGeometry', 'RadiusY')
}))
const sampleXaml = source => source.split(/--- xaml\s*\r?\n/)[1]?.trim() ?? ''
const LineXaml = sampleXaml(lineSample)
const PolylineXaml = sampleXaml(polylineSample)
const PathXaml = computed(() => {
  let index = 0
  return sampleXaml(pathSample).replace(/<!--[\s\S]*?-->/g, () => '<!-- ' + t('sample.line.path-comment-' + (++index)) + ' -->')
})
const GeometryXaml = computed(() => sampleXaml(geometrySample).replace(/<!--[\s\S]*?-->/, '<!-- ' + t('sample.line.geometry-comment') + ' -->'))
provide(xamlScopeKey, {
  PageTitle, PageDescription, LineHeader, PolylineHeader, PathHeader, GeometryHeader, PolylineDescription, PathDescription, GeometryDescription, StartPointX, StartPointY, EndPointX, EndPointY, StrokeThicknessText, ShowPointsText, RadiusXText, RadiusYText, Point1, PolylinePoint2, PolylinePoint3, PolylinePoint4, PathPoint2, PathPoint3, PathPoint4, PathPoint5, ThemeButtonLabel,
  FavoriteButtonLabel, FavoriteGlyph, LineXaml, PolylineXaml, PathXaml, GeometryXaml,
  LineOutput, PolylineOutput, PathOutput, GeometryOutput,
  isFavoriteState, pageTheme, toggleTheme, toggleFavorite
})
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.gallery-page-content :deep(.example-display > .win-canvas) { flex: 0 0 auto; max-width: none; }
.gallery-page-content :deep(.win-canvas > .win-stack-panel) { width: max-content; }
.gallery-page-content :deep(.example-container) { grid-template-columns: minmax(0, 1fr) 260px 252px; }
.gallery-page-content :deep(.example-output) { width: 248px; max-width: 248px; }
.gallery-page-content :deep(.example-options) { width: 252px; max-width: 252px; }
@media (max-width: 1199px) {
  .gallery-page-content :deep(.example-container) { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto auto; }
  .gallery-page-content :deep(.example-display) { grid-column: 1; grid-row: 1; }
  .gallery-page-content :deep(.example-output) { grid-column: 1; grid-row: 2; width: calc(100% - 24px); max-width: none; min-height: 100px; margin: 12px; }
  .gallery-page-content :deep(.example-options) { grid-column: 1; grid-row: 3; width: 100%; max-width: none; margin: 0; border-left: 0; border-top: 1px solid var(--DividerStrokeColorDefaultBrush); }
  .gallery-page-content :deep(.control-example-root:nth-child(3) .example-output) { min-height: 136px; }
}
</style>
