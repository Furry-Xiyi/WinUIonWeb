<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="gallery-page-content">
          <TextBlock
            class="page-transition-description"
            Text="{x:Bind Labels.Description, Mode=OneWay}"
            TextWrapping="WrapWholeWords" />
          <ControlExample
            x:Name="Example1"
            class="page-transition-example"
            HorizontalAlignment="Stretch"
            HorizontalContentAlignment="Stretch"
            SampleDefinition="PageTransition\PageTransitions.txt"
            HeaderText="{x:Bind Labels.Header, Mode=OneWay}"
            Theme="{x:Bind pageTheme, Mode=OneWay}"
            Xaml="{x:Bind SampleXaml, Mode=OneWay}"
            CSharp="{x:Bind SampleCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Frame
                x:Name="ContentFrame"
                class="page-transition-content-frame"
                MinHeight="600"
                HorizontalAlignment="Stretch"
                Navigated="ContentFrame_Navigated">
                <Frame.ContentTransitions>
                  <TransitionCollection>
                    <NavigationThemeTransition />
                  </TransitionCollection>
                </Frame.ContentTransitions>
              </Frame>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind NavigationOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" />
            </ControlExample.Output>
            <ControlExample.Options>
              <StackPanel>
                <RadioButtons Header="{x:Bind Labels.Modes, Mode=OneWay}">
                  <RadioButton x:Name="DefaultRB" AutomationProperties.Name="{x:Bind Labels.DefaultAccessible, Mode=OneWay}" Checked="TransitionRadioButton_Checked" Content="{x:Bind Labels.Default, Mode=OneWay}" IsChecked="True" />
                  <RadioButton x:Name="EntranceRB" AutomationProperties.Name="{x:Bind Labels.EntranceAccessible, Mode=OneWay}" Checked="TransitionRadioButton_Checked" Content="{x:Bind Labels.Entrance, Mode=OneWay}" />
                  <RadioButton x:Name="DrillRB" AutomationProperties.Name="{x:Bind Labels.DrillInAccessible, Mode=OneWay}" Checked="TransitionRadioButton_Checked" Content="{x:Bind Labels.DrillIn, Mode=OneWay}" />
                  <RadioButton x:Name="SuppressRB" AutomationProperties.Name="{x:Bind Labels.SuppressAccessible, Mode=OneWay}" Checked="TransitionRadioButton_Checked" Content="{x:Bind Labels.Suppress, Mode=OneWay}" />
                  <RadioButton x:Name="SlideFromRightRB" AutomationProperties.Name="{x:Bind Labels.SlideRightAccessible, Mode=OneWay}" Checked="TransitionRadioButton_Checked" Content="{x:Bind Labels.SlideRight, Mode=OneWay}" />
                  <RadioButton x:Name="SlideFromLeftRB" AutomationProperties.Name="{x:Bind Labels.SlideLeftAccessible, Mode=OneWay}" Checked="TransitionRadioButton_Checked" Content="{x:Bind Labels.SlideLeft, Mode=OneWay}" />
                  <RadioButton x:Name="Common" AutomationProperties.Name="{x:Bind Labels.CommonAccessible, Mode=OneWay}" Checked="TransitionRadioButton_Checked" Content="{x:Bind Labels.Common, Mode=OneWay}" />
                  <RadioButton x:Name="Continuum" AutomationProperties.Name="{x:Bind Labels.ContinuumAccessible, Mode=OneWay}" Checked="TransitionRadioButton_Checked" Content="{x:Bind Labels.Continuum, Mode=OneWay}" />
                </RadioButtons>
                <TextBlock Margin="0,12,0,8" Text="{x:Bind Labels.Navigate, Mode=OneWay}" />
                <Button Margin="0,0,0,4" HorizontalAlignment="Stretch" Click="ForwardButton1_Click" Content="{x:Bind Labels.Forward, Mode=OneWay}" />
                <Button HorizontalAlignment="Stretch" Click="BackwardButton1_Click" Content="{x:Bind Labels.Backward, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="TransitionParameter" x:Name="TransitionValue" Value="{x:Bind TransitionParameter, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, provide, ref, shallowReactive, type Component } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import Frame from '../../components/Frame.vue'
import { NavigationThemeTransition, TransitionCollection } from '../../components/NavigationTransitionProperties'
import Page from '../../components/Page.vue'
import RadioButton from '../../components/RadioButton.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import {
  createCommonNavigationTransitionInfo,
  createContinuumNavigationTransitionInfo,
  createDrillInNavigationTransitionInfo,
  createEntranceNavigationTransitionInfo,
  createSlideNavigationTransitionInfo,
  createSuppressNavigationTransitionInfo
} from '../../utils/navigationTransitionInfo'
import { createPageState } from '../../utils/pageState'
import SamplePage1 from '../components/navigationview/SamplePage1.vue'
import SamplePage2 from '../components/navigationview/SamplePage2.vue'
import sampleDefinition from '../samples/PageTransition/PageTransitions.txt?raw'

defineOptions({ name: 'PageTransitionPage' })
const { t } = useI18n()
const { pageTheme } = createPageState('pagetransition')
const namescope = shallowReactive<Record<string, unknown>>({})
provide(xamlNameScopeKey, namescope)

const Labels = computed(() => ({
  Header: t('sample.page-transition.header'), Description: t('sample.page-transition.description'), Modes: t('sample.page-transition.modes'),
  Default: t('sample.page-transition.default'), Entrance: t('sample.page-transition.entrance'),
  DrillIn: t('sample.page-transition.drill-in'), Suppress: t('sample.page-transition.suppress'),
  SlideRight: t('sample.page-transition.slide-right'), SlideLeft: t('sample.page-transition.slide-left'),
  Common: t('sample.page-transition.common'), Continuum: t('sample.page-transition.continuum'),
  Navigate: t('sample.page-transition.navigate'), Forward: t('sample.page-transition.forward'),
  Backward: t('sample.page-transition.backward'),
  DefaultAccessible: t('text.default-navigation-transition-info'), EntranceAccessible: t('text.entrance-navigation-transition-info'),
  DrillInAccessible: t('text.drill-in-navigation-transition-info'), SuppressAccessible: t('text.suppress-navigation-transition-info'),
  SlideRightAccessible: t('text.slide-navigation-transition-info-from-right'), SlideLeftAccessible: t('text.slide-navigation-transition-info-from-left'),
  CommonAccessible: t('text.common-navigation-transition-info'), ContinuumAccessible: t('text.continuum-navigation-transition-info')
}))
const TransitionParameter = ref('')
const currentPageNumber = ref(1)
const backStackDepth = ref(0)
const NavigationOutput = computed(() => t('sample.page-transition.output', {
  page: t(`sample.selectorbar.page-${currentPageNumber.value}`),
  depth: backStackDepth.value
}))

interface ContentFrameApi {
  BackStackDepth: number
  CurrentSourcePageType: Component | null
  Navigate: (pageType: Component, parameter?: unknown, transitionInfo?: unknown) => boolean
  GoBack: () => boolean
}
let transitionInfo: unknown = null
const contentFrame = () => namescope.ContentFrame as ContentFrameApi | undefined
const ContentFrame_Navigated = (sender: ContentFrameApi) => {
  currentPageNumber.value = sender.CurrentSourcePageType === SamplePage1 ? 1 : 2
  backStackDepth.value = sender.BackStackDepth
}
const ForwardButton1_Click = () => {
  const frame = contentFrame()
  if (!frame) return
  const pageToNavigateTo = frame.BackStackDepth % 2 === 1 ? SamplePage1 : SamplePage2
  if (transitionInfo === null) frame.Navigate(pageToNavigateTo, null)
  else frame.Navigate(pageToNavigateTo, null, transitionInfo)
}
const BackwardButton1_Click = () => {
  const frame = contentFrame()
  if (frame && frame.BackStackDepth > 0) frame.GoBack()
}
const TransitionRadioButton_Checked = (sender: { Name: string }) => {
  switch (sender.Name) {
    case 'EntranceRB':
      transitionInfo = createEntranceNavigationTransitionInfo()
      TransitionParameter.value = ', new EntranceNavigationTransitionInfo()'
      break
    case 'DrillRB':
      transitionInfo = createDrillInNavigationTransitionInfo()
      TransitionParameter.value = ', new DrillInNavigationTransitionInfo()'
      break
    case 'SuppressRB':
      transitionInfo = createSuppressNavigationTransitionInfo()
      TransitionParameter.value = ', new SuppressNavigationTransitionInfo()'
      break
    case 'SlideFromRightRB':
      transitionInfo = createSlideNavigationTransitionInfo('FromRight')
      TransitionParameter.value = ', new SlideNavigationTransitionInfo() { Effect = SlideNavigationTransitionEffect.FromRight }'
      break
    case 'SlideFromLeftRB':
      transitionInfo = createSlideNavigationTransitionInfo('FromLeft')
      TransitionParameter.value = ', new SlideNavigationTransitionInfo() { Effect = SlideNavigationTransitionEffect.FromLeft }'
      break
    case 'Common':
      transitionInfo = createCommonNavigationTransitionInfo()
      TransitionParameter.value = ', new CommonNavigationTransitionInfo()'
      break
    case 'Continuum':
      transitionInfo = createContinuumNavigationTransitionInfo()
      TransitionParameter.value = ', new ContinuumNavigationTransitionInfo()'
      break
    default:
      transitionInfo = null
      TransitionParameter.value = ''
  }
}

const sampleSection = (section: string) => {
  const match = sampleDefinition.match(new RegExp('(?:^|\\r?\\n)--- ' + section + '\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)'))
  return match?.[1].trim() ?? ''
}
const SampleXaml = sampleSection('xaml')
const SampleCSharp = sampleSection('c#')
provide(xamlScopeKey, {
  Labels, pageTheme, SampleXaml, SampleCSharp, TransitionParameter, NavigationOutput,
  ContentFrame_Navigated, ForwardButton1_Click, BackwardButton1_Click, TransitionRadioButton_Checked
})
onMounted(async () => {
  await nextTick()
  const frame = contentFrame()
  if (frame && !frame.CurrentSourcePageType) frame.Navigate(SamplePage1)
})
</script>

<style scoped>
:global(.page-transition-example .example-container) {
  grid-template-columns: minmax(0, 1fr) minmax(0, auto);
  grid-template-rows: minmax(0, 1fr) auto;
}
.page-transition-description { margin: 0 0 12px; color: var(--text-secondary); line-height: 20px; }
:global(.page-transition-example .example-display) { grid-column: 1; grid-row: 1; }
:global(.page-transition-example .example-output) {
  grid-column: 1;
  grid-row: 2;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 12px;
  border-radius: 0;
  border-top: 1px solid var(--DividerStrokeColorDefaultBrush, var(--stroke-divider));
  justify-self: stretch;
}
:global(.page-transition-example .example-options) { grid-column: 2; grid-row: 1 / span 2; }
:global(.page-transition-example .page-transition-content-frame) { width: 100%; height: 600px; min-width: 0; max-width: 100%; }
@media (max-width: 739px) {
  :global(.page-transition-example .example-container) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto;
  }
  :global(.page-transition-example .example-options) {
    grid-column: 1;
    grid-row: 3;
    margin: 0;
    border-left: 0;
    border-top: 1px solid var(--DividerStrokeColorDefaultBrush, var(--stroke-divider));
  }
}
</style>
