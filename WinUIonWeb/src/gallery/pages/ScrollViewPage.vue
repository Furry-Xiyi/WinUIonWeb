<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page" Spacing="0">
      <StackPanel class="page-heading">
        <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords"/>
      </StackPanel>
      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" class="scrollview-example" HeaderText="{x:Bind Labels.ContentHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind ContentXaml, Mode=OneWay}" CSharp="{x:Bind ScrollViewCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel Spacing="16">
              <TextBlock Text="{x:Bind Labels.ContentNote, Mode=OneWay}" TextWrapping="Wrap"/>
              <ScrollView x:Name="scrollView1" Width="400" Height="266" HorizontalAlignment="Left" VerticalAlignment="Top" ContentOrientation="None" IsTabStop="True" ZoomMode="Enabled" Loaded="ScrollViewPage_Loaded">
                <Image HorizontalAlignment="Center" VerticalAlignment="Center" AutomationProperties.Name="{x:Bind Labels.Cliff, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg" Stretch="Uniform"/>
              </ScrollView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output>
            <TextBlock Text="{x:Bind Output1, Mode=OneWay}" TextWrapping="Wrap"/>
          </ControlExample.Output>
          <ControlExample.Options>
            <Grid MinWidth="200" ColumnSpacing="12" RowSpacing="16">
              <Grid.ColumnDefinitions>
                <ColumnDefinition Width="Auto"/>
                <ColumnDefinition Width="*"/>
              </Grid.ColumnDefinitions>
              <Grid.RowDefinitions>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="Auto"/>
              </Grid.RowDefinitions>
              <TextBlock VerticalAlignment="Center" Text="{x:Bind Labels.ZoomMode, Mode=OneWay}"/>
              <ComboBox x:Name="cmbZoomMode" Grid.Column="1" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind Labels.ZoomModeName, Mode=OneWay}" SelectedIndex="0" SelectionChanged="CmbZoomMode_SelectionChanged">
                <ComboBoxItem Content="{x:Bind Labels.Enabled, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Disabled, Mode=OneWay}"/>
              </ComboBox>
              <TextBlock Grid.Row="1" VerticalAlignment="Center" Text="{x:Bind Labels.ZoomFactor, Mode=OneWay}"/>
              <NumberBox x:Name="nbZoomFactor" Grid.Row="1" Grid.Column="1" AutomationProperties.Name="{x:Bind Labels.ZoomFactorName, Mode=OneWay}" LargeChange="10" Maximum="10" Minimum="0.1" SmallChange="1" SpinButtonPlacementMode="Inline" ValueChanged="NbZoomFactor_ValueChanged" Value="{x:Bind ZoomFactorValue, Mode=TwoWay}" NumberFormatter="{x:Bind ZoomFactorFormatter}"/>
              <TextBlock Grid.Row="2" Grid.ColumnSpan="2" HorizontalAlignment="Center" Text="{x:Bind Labels.ScrollMode, Mode=OneWay}"/>
              <TextBlock Grid.Row="3" VerticalAlignment="Center" Text="{x:Bind Labels.Horizontal, Mode=OneWay}"/>
              <ComboBox x:Name="cmbHorizontalScrollMode" Grid.Row="3" Grid.Column="1" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind Labels.HorizontalScrollModeName, Mode=OneWay}" SelectedIndex="2" SelectionChanged="CmbHorizontalScrollMode_SelectionChanged">
                <ComboBoxItem Content="{x:Bind Labels.Enabled, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Disabled, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Auto, Mode=OneWay}"/>
              </ComboBox>
              <TextBlock Grid.Row="4" VerticalAlignment="Center" Text="{x:Bind Labels.Vertical, Mode=OneWay}"/>
              <ComboBox x:Name="cmbVerticalScrollMode" Grid.Row="4" Grid.Column="1" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind Labels.VerticalScrollModeName, Mode=OneWay}" SelectedIndex="2" SelectionChanged="CmbVerticalScrollMode_SelectionChanged">
                <ComboBoxItem Content="{x:Bind Labels.Enabled, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Disabled, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Auto, Mode=OneWay}"/>
              </ComboBox>
              <TextBlock Grid.Row="5" Grid.ColumnSpan="2" HorizontalAlignment="Center" Text="{x:Bind Labels.ScrollbarVisibility, Mode=OneWay}"/>
              <TextBlock Grid.Row="6" VerticalAlignment="Center" Text="{x:Bind Labels.Horizontal, Mode=OneWay}"/>
              <ComboBox x:Name="cmbHorizontalScrollBarVisibility" Grid.Row="6" Grid.Column="1" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind Labels.HorizontalScrollBarName, Mode=OneWay}" SelectedIndex="0" SelectionChanged="CmbHorizontalScrollBarVisibility_SelectionChanged">
                <ComboBoxItem Content="{x:Bind Labels.Auto, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Visible, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Hidden, Mode=OneWay}"/>
              </ComboBox>
              <TextBlock Grid.Row="7" VerticalAlignment="Center" Text="{x:Bind Labels.Vertical, Mode=OneWay}"/>
              <ComboBox x:Name="cmbVerticalScrollBarVisibility" Grid.Row="7" Grid.Column="1" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind Labels.VerticalScrollBarName, Mode=OneWay}" SelectedIndex="0" SelectionChanged="CmbVerticalScrollBarVisibility_SelectionChanged">
                <ComboBoxItem Content="{x:Bind Labels.Auto, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Visible, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Hidden, Mode=OneWay}"/>
              </ComboBox>
            </Grid>
          </ControlExample.Options>
        </ControlExample>
        <ControlExample x:Name="Example2" class="scrollview-example" HeaderText="{x:Bind Labels.VelocityHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind VelocityXaml, Mode=OneWay}" CSharp="{x:Bind ScrollViewCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel Spacing="16">
              <TextBlock Text="{x:Bind Labels.VelocityNote, Mode=OneWay}" TextWrapping="Wrap"/>
              <ScrollView x:Name="scrollView2" Width="400" Height="300" HorizontalAlignment="Left" VerticalAlignment="Top" IsTabStop="True">
                <StackPanel>
                  <Image AutomationProperties.Name="{x:Bind Labels.Grapes, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/grapes.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Rainier, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Sunset, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/sunset.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Treetops, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/treetops.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Valley, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/valley.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Cliff, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg" Stretch="Uniform"/>
                </StackPanel>
              </ScrollView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output>
            <TextBlock Text="{x:Bind Output2, Mode=OneWay}" TextWrapping="Wrap"/>
          </ControlExample.Output>
          <ControlExample.Options>
            <Grid MinWidth="200" ColumnSpacing="12" RowSpacing="16">
              <Grid.ColumnDefinitions>
                <ColumnDefinition Width="Auto"/>
                <ColumnDefinition Width="*"/>
              </Grid.ColumnDefinitions>
              <Grid.RowDefinitions>
                <RowDefinition Height="Auto"/>
              </Grid.RowDefinitions>
              <TextBlock VerticalAlignment="Center" Text="{x:Bind Labels.VerticalVelocity, Mode=OneWay}"/>
              <NumberBox x:Name="nbVerticalVelocity" Grid.Column="1" AutomationProperties.Name="{x:Bind Labels.VerticalVelocityName, Mode=OneWay}" LargeChange="30" Maximum="200" Minimum="-200" SmallChange="10" SpinButtonPlacementMode="Inline" ValueChanged="NbVerticalVelocity_ValueChanged" Value="{x:Bind VerticalVelocityValue, Mode=TwoWay}"/>
            </Grid>
          </ControlExample.Options>
        </ControlExample>
        <ControlExample x:Name="Example3" class="scrollview-example" HeaderText="{x:Bind Labels.AnimationHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind AnimationXaml, Mode=OneWay}" CSharp="{x:Bind AnimationCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel Spacing="16">
              <TextBlock Text="{x:Bind Labels.AnimationNote, Mode=OneWay}" TextWrapping="Wrap"/>
              <ScrollView x:Name="scrollView3" Width="400" Height="300" HorizontalAlignment="Left" VerticalAlignment="Top" IsTabStop="True" ScrollAnimationStarting="ScrollView_ScrollAnimationStarting">
                <StackPanel>
                  <Image AutomationProperties.Name="{x:Bind Labels.Leaves, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage1.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Carousel, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage2.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Bicycles, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage3.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Pond, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage4.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Marina, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage5.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Beach, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage6.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Rampart, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage7.jpg" Stretch="Uniform"/>
                  <Image AutomationProperties.Name="{x:Bind Labels.Mountain, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage8.jpg" Stretch="Uniform"/>
                </StackPanel>
              </ScrollView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output>
            <TextBlock Text="{x:Bind Output3, Mode=OneWay}" TextWrapping="Wrap"/>
          </ControlExample.Output>
          <ControlExample.Options>
            <Grid MinWidth="320" ColumnSpacing="12" RowSpacing="16">
              <Grid.ColumnDefinitions>
                <ColumnDefinition Width="Auto"/>
                <ColumnDefinition Width="*"/>
              </Grid.ColumnDefinitions>
              <Grid.RowDefinitions>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="Auto"/>
              </Grid.RowDefinitions>
              <TextBlock VerticalAlignment="Center" Text="{x:Bind Labels.ScrollWithAnimation, Mode=OneWay}"/>
              <ComboBox x:Name="cmbVerticalAnimation" Grid.Column="1" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind Labels.VerticalAnimationName, Mode=OneWay}" SelectedIndex="{x:Bind AnimationSelectedIndex, Mode=TwoWay}" SelectionChanged="cmbVerticalAnimation_SelectionChanged">
                <ComboBoxItem Content="{x:Bind Labels.Default, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Accordion, Mode=OneWay}"/>
                <ComboBoxItem Content="{x:Bind Labels.Teleportation, Mode=OneWay}"/>
              </ComboBox>
              <TextBlock Grid.Row="1" VerticalAlignment="Center" Text="{x:Bind Labels.Duration, Mode=OneWay}"/>
              <NumberBox x:Name="nbAnimationDuration" Grid.Row="1" Grid.Column="1" AutomationProperties.Name="{x:Bind Labels.DurationName, Mode=OneWay}" LargeChange="1000" Maximum="5000" Minimum="1000" SmallChange="500" SpinButtonPlacementMode="Inline" ValueChanged="nbAnimationDuration_ValueChanged" Value="{x:Bind AnimationDurationValue, Mode=TwoWay}"/>
              <Button x:Name="btnScrollWithAnimation" Grid.Row="2" Grid.ColumnSpan="2" HorizontalAlignment="Stretch" AutomationProperties.Name="{x:Bind Labels.ScrollWithAnimationName, Mode=OneWay}" Click="BtnScrollWithAnimation_Click" Content="{x:Bind Labels.ScrollWithAnimation, Mode=OneWay}"/>
            </Grid>
          </ControlExample.Options>
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>
<script setup lang="ts">
import { computed, inject, provide, ref, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import ComboBox from '../../components/ComboBox.vue'
import { ComboBoxItem } from '../../components/inlineControlProperties'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import ColumnDefinition from '../../components/ColumnDefinition.vue'
import RowDefinition from '../../components/RowDefinition.vue'
import Image from '../../components/Image.vue'
import NumberBox from '../../components/NumberBox.vue'
import ScrollView from '../../components/ScrollView.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import contentDefinition from '../samples/ScrollView/ContentInsideScrollview.txt?raw'
import velocityDefinition from '../samples/ScrollView/ScrollViewConstantVelocityScrolling.txt?raw'
import animationDefinition from '../samples/ScrollView/ScrollViewProgrammaticScrollCustomAnimation.txt?raw'
import ScrollViewCSharp from '../samples/ScrollView/ScrollViewPage.xaml.cs?raw'
import defaultAnimation from '../samples/ScrollView/ScrollViewSample3_DefaultAnimation_cs.txt?raw'
import accordionAnimation from '../samples/ScrollView/ScrollViewSample3_AccordionAnimation_cs.txt?raw'
import teleportationAnimation from '../samples/ScrollView/ScrollViewSample3_TeleportationAnimation_cs.txt?raw'
const { t } = useI18n()
const currentPage = inject<{ value: string }>('currentPage')
const { pageTheme } = createPageState(currentPage?.value || 'scrollview')
const Names = shallowReactive<Record<string, any>>({})
provide(xamlNameScopeKey, Names)
const Labels = computed(() => ({
  Description: t('text.scrollview-description'),
  ContentHeader: t('sample.scrollview.content'), VelocityHeader: t('sample.scrollview.constant-velocity'), AnimationHeader: t('sample.scrollview.programmatic-animation'),
  ContentNote: t('sample.scrollview.content-note'), VelocityNote: t('sample.scrollview.velocity-note'), AnimationNote: t('sample.scrollview.animation-note'),
  ZoomMode: t('text.zoom-mode'), ZoomFactor: t('text.zoom-factor'), ScrollMode: t('text.scroll-mode'), ScrollbarVisibility: t('text.scrollbar-visibility'), Horizontal: t('text.horizontal'), Vertical: t('text.vertical'), VerticalVelocity: t('text.vertical-velocity'), Duration: t('text.animation-duration-msec'), ScrollWithAnimation: t('text.scroll-with-animation'),
  ZoomModeName: t('text.zoom-mode-automation-name'), ZoomFactorName: t('text.zoom-factor-automation-name'), HorizontalScrollModeName: t('text.horizontal-scroll-mode-automation-name'), VerticalScrollModeName: t('text.vertical-scroll-mode-automation-name'), HorizontalScrollBarName: t('text.horizontal-scrollbar-visibility-automation-name'), VerticalScrollBarName: t('text.vertical-scrollbar-visibility-automation-name'), VerticalVelocityName: t('text.vertical-velocity-automation-name'), VerticalAnimationName: t('text.vertical-animation-options-automation-name'), DurationName: t('text.animation-duration-automation-name'), ScrollWithAnimationName: t('text.scroll-with-animation-automation-name'),
  Enabled: t('text.enabled'), Disabled: t('text.disabled'), Auto: t('text.auto'), Visible: t('text.visible'), Hidden: t('text.hidden'), Default: t('text.default'), Accordion: t('text.accordion'), Teleportation: t('text.teleportation'),
  Cliff: t('text.cliff'), Grapes: t('sample.scrollview.image.grapes'), Rainier: t('sample.scrollview.image.rainier'), Sunset: t('sample.scrollview.image.sunset'), Treetops: t('sample.scrollview.image.treetops'), Valley: t('sample.scrollview.image.valley'), Leaves: t('sample.scrollview.image.leaves'), Carousel: t('sample.scrollview.image.carousel'), Bicycles: t('sample.scrollview.image.bicycles'), Pond: t('sample.scrollview.image.pond'), Marina: t('sample.scrollview.image.marina'), Beach: t('sample.scrollview.image.beach'), Rampart: t('sample.scrollview.image.rampart'), Mountain: t('sample.scrollview.image.mountain')
}))
const ZoomFactorValue = ref(4)
const VerticalVelocityValue = ref(30)
const AnimationDurationValue = ref(1500)
const AnimationSelectedIndex = ref(0)
const ZoomFactorFormatter = { format: (value: number) => (Math.round(value * 10) / 10).toFixed(1).padStart(4, '0') }
const ScrollViewPage_Loaded = () => Names.scrollView1?.ZoomTo(4, null, { AnimationMode: 'Enabled', SnapPointsMode: 'Ignore' })
const selectionIndex = (sender: any) => Number(sender?.SelectedIndex ?? 0)
const CmbZoomMode_SelectionChanged = (sender: any) => { if (Names.scrollView1) Names.scrollView1.ZoomMode = ['Enabled', 'Disabled'][selectionIndex(sender)] }
const CmbHorizontalScrollMode_SelectionChanged = (sender: any) => { if (Names.scrollView1) Names.scrollView1.HorizontalScrollMode = ['Enabled', 'Disabled', 'Auto'][selectionIndex(sender)] }
const CmbVerticalScrollMode_SelectionChanged = (sender: any) => { if (Names.scrollView1) Names.scrollView1.VerticalScrollMode = ['Enabled', 'Disabled', 'Auto'][selectionIndex(sender)] }
const CmbHorizontalScrollBarVisibility_SelectionChanged = (sender: any) => { if (Names.scrollView1) Names.scrollView1.HorizontalScrollBarVisibility = ['Auto', 'Visible', 'Hidden'][selectionIndex(sender)] }
const CmbVerticalScrollBarVisibility_SelectionChanged = (sender: any) => { if (Names.scrollView1) Names.scrollView1.VerticalScrollBarVisibility = ['Auto', 'Visible', 'Hidden'][selectionIndex(sender)] }
const NbZoomFactor_ValueChanged = (_sender: unknown, args: { NewValue: number }) => { if (Number.isFinite(args.NewValue)) Names.scrollView1?.ZoomTo(args.NewValue, null) }
const NbVerticalVelocity_ValueChanged = (_sender: unknown, args: { OldValue: number; NewValue: number }) => {
  const view = Names.scrollView2
  if (!view || !Number.isFinite(args.OldValue) || !Number.isFinite(args.NewValue)) return
  view.ScrollBy(0, 0, { AnimationMode: 'Disabled', SnapPointsMode: 'Ignore' })
  let velocity = args.NewValue
  if (velocity <= 30 && velocity >= -30) velocity = args.NewValue < args.OldValue ? view.VerticalOffset === 0 ? 30 : -30 : view.VerticalOffset === view.ScrollableHeight ? -30 : 30
  else if (velocity < 30 && view.VerticalOffset === 0) velocity = 30
  else if (velocity > 30 && view.VerticalOffset === view.ScrollableHeight) velocity = -30
  VerticalVelocityValue.value = velocity
  view.AddScrollVelocity({ x: 0, y: velocity }, { x: 0, y: 0 })
}
const GetTargetVerticalOffset = () => { const view = Names.scrollView3; return !view ? 0 : view.VerticalOffset > view.ScrollableHeight / 2 ? view.ScrollableHeight / 5 : 4 * view.ScrollableHeight / 5 }
const BtnScrollWithAnimation_Click = () => { const view = Names.scrollView3; view?.ScrollTo(view.HorizontalOffset, GetTargetVerticalOffset(), { AnimationMode: 'Enabled', SnapPointsMode: 'Ignore' }) }
const ScrollView_ScrollAnimationStarting = (_sender: unknown, args: any) => {
  const stock = args.Animation
  if (!stock || !Names.scrollView3) return
  if (AnimationSelectedIndex.value === 0) { stock.Duration = AnimationDurationValue.value; return }
  const view = Names.scrollView3, target = args.EndPosition.y, delta = target - args.StartPosition.y
  const custom = stock.Compositor.CreateVector3KeyFrameAnimation()
  if (AnimationSelectedIndex.value === 1) {
    let overshoot = 0.1 * delta
    for (let step = 0; step < 3; step++) { custom.InsertKeyFrame(1 - 0.4 / 2 ** step, { x: view.HorizontalOffset, y: target + overshoot, z: 0 }); overshoot /= -2 }
    custom.InsertKeyFrame(1, { x: view.HorizontalOffset, y: target, z: 0 })
  } else {
    const start = stock.Compositor.CreateCubicBezierEasingFunction({ x: 1, y: 0 }, { x: 1, y: 0 }), end = stock.Compositor.CreateCubicBezierEasingFunction({ x: 0, y: 1 }, { x: 0, y: 1 }), step = stock.Compositor.CreateStepEasingFunction(1)
    custom.InsertKeyFrame(0.499999, { x: view.HorizontalOffset, y: target - 0.9 * delta, z: 0 }, start)
    custom.InsertKeyFrame(0.5, { x: view.HorizontalOffset, y: target - 0.1 * delta, z: 0 }, step)
    custom.InsertKeyFrame(1, { x: view.HorizontalOffset, y: target, z: 0 }, end)
  }
  custom.Duration = AnimationDurationValue.value
  args.Animation = custom
}
const cmbVerticalAnimation_SelectionChanged = (sender: any) => { AnimationSelectedIndex.value = selectionIndex(sender) }
const nbAnimationDuration_ValueChanged = (_sender: unknown, args: { NewValue: number }) => { if (Number.isFinite(args.NewValue)) AnimationDurationValue.value = args.NewValue }
const codePart = (definition: string) => definition.split('--- xaml')[1]?.trim() ?? ''
const ContentXaml = computed(() => codePart(contentDefinition).replace(/\$\((\w+)\)/g, (_whole, key) => String(Names.scrollView1?.[key] ?? ({ ZoomMode: 'Enabled', HorizontalScrollMode: 'Auto', VerticalScrollMode: 'Auto', HorizontalScrollBarVisibility: 'Auto', VerticalScrollBarVisibility: 'Auto' } as Record<string, string>)[key])))
const VelocityXaml = codePart(velocityDefinition)
const AnimationXaml = codePart(animationDefinition)
const AnimationCSharp = computed(() => [defaultAnimation, accordionAnimation, teleportationAnimation][AnimationSelectedIndex.value]?.replaceAll('nbAnimationDuration.Value', String(AnimationDurationValue.value)) ?? defaultAnimation)
const output = (name: string) => { const view = Names[name]; return t('sample.scrollview.output', { horizontal: Number(view?.HorizontalOffset ?? 0).toFixed(1), vertical: Number(view?.VerticalOffset ?? 0).toFixed(1), zoom: Number(view?.ZoomFactor ?? 1).toFixed(1), state: t(`sample.scrollview.state.${String(view?.State ?? 'Idle').toLowerCase()}`) }) }
const Output1 = computed(() => output('scrollView1')), Output2 = computed(() => output('scrollView2')), Output3 = computed(() => output('scrollView3'))
</script>

<style scoped>
.page-description { margin: 0 0 16px; color: var(--text-secondary); flex: 1; min-width: 0; }
.gallery-item-page { width: 100%; min-width: 0; }
.gallery-item-page :deep(.scrollview-example .example-container.has-output.has-options) { grid-template-columns: minmax(0,1fr) 320px; grid-template-rows: auto auto; }
.gallery-item-page :deep(.scrollview-example .example-options) { grid-column: 2; grid-row: 1 / span 2; }
.gallery-item-page :deep(.scrollview-example .example-output) { grid-column: 1; grid-row: 2; justify-self: stretch; max-width: none; width: auto; margin: 0; padding: 12px; border-radius: 0; }
.gallery-item-page :deep(.scrollview-example .example-display) { min-width: 0; overflow: hidden; }
.gallery-item-page :deep(.scrollview-example .example-output) { min-width: 0; overflow-wrap: anywhere; }
.gallery-item-page :deep(.scrollview-example .example-options) { min-width: 0; }
.gallery-item-page :deep(.scrollview-example .example-options > .win-grid) { max-width: 100%; }
.gallery-item-page :deep(.scrollview-example .example-options .win-text-block) { white-space: normal; overflow-wrap: anywhere; }
.gallery-item-page :deep(.scrollview-example .example-options .win-combo-box), .gallery-item-page :deep(.scrollview-example .example-options .win-number-box) { min-width: 0; max-width: 100%; }
@media (max-width: 1100px) { .gallery-item-page :deep(.scrollview-example .example-container.has-output.has-options) { grid-template-columns: minmax(0,1fr); } .gallery-item-page :deep(.scrollview-example .example-options) { grid-column: 1; grid-row: 3; width: auto; max-width: none; border-left: 0; border-top: 1px solid var(--DividerStrokeColorDefaultBrush); }
 .gallery-item-page :deep(.scrollview-example .example-options > .win-grid) { min-width: 0 !important; width: 100%; } }
</style>
