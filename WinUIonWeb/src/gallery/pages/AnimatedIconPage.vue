<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" AutomationProperties.Name="{x:Bind toggleThemeLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind toggleThemeLabel, Mode=OneWay}" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" FontFamily="{ThemeResource SymbolThemeFontFamily}" /></Button>
            <ToggleButton class="header-action" AutomationProperties.Name="{x:Bind favoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteLabel, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" FontFamily="{ThemeResource SymbolThemeFontFamily}" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="AnimatedIconExample1" HeaderText="{x:Bind buttonHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind buttonXaml, Mode=OneWay}" CSharp="{x:Bind buttonCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="animated-icon-example">
                <TextBlock TextWrapping="WrapWholeWords">
                  <Run Text="{x:Bind buttonDescription, Mode=OneWay}" /><Hyperlink NavigateUri="https://aka.ms/lottie"><Run Text="{x:Bind lottieLabel, Mode=OneWay}" /></Hyperlink><Run Text="{x:Bind animationGuidance, Mode=OneWay}" /><LineBreak />
                </TextBlock>
                <Button Width="75" HorizontalAlignment="Left" AutomationProperties.Name="{x:Bind exampleButtonName, Mode=OneWay}" Click="Button_Click" PointerEntered="Button_PointerEntered" PointerExited="Button_PointerExited" PointerPressed="Button_PointerPressed" PointerReleased="Button_PointerReleased" PointerCanceled="Button_PointerCanceled" PointerCaptureLost="Button_PointerCaptureLost">
                  <AnimatedIcon x:Name="SearchAnimatedIcon" Source="{x:Bind controlPages:AnimatedIconPage.GetAnimationSourceFromString(AnimatedVisualSourceSelection.SelectedItem.Tag), Mode=OneWay}" AnimatedIcon.State="{x:Bind initialAnimationState, Mode=OneWay}">
                    <AnimatedIcon.FallbackIconSource>
                      <SymbolIconSource Symbol="Find" />
                    </AnimatedIcon.FallbackIconSource>
                  </AnimatedIcon>
                </Button>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <ComboBox x:Name="AnimatedVisualSourceSelection" class="animated-icon-kind" MinWidth="340" VerticalAlignment="Center" Header="{x:Bind kindLabel, Mode=OneWay}" SelectedIndex="4">
                <ComboBoxItem Content="{x:Bind backLabel, Mode=OneWay}" Tag="AnimatedBackVisualSource" />
                <ComboBoxItem Content="{x:Bind downArrowLabel, Mode=OneWay}" Tag="AnimatedChevronDownSmallVisualSource" />
                <ComboBoxItem Content="{x:Bind rightDownArrowLabel, Mode=OneWay}" Tag="AnimatedChevronRightDownSmallVisualSource" />
                <ComboBoxItem Content="{x:Bind upDownArrowLabel, Mode=OneWay}" Tag="AnimatedChevronUpDownSmallVisualSource" />
                <ComboBoxItem Content="{x:Bind findLabel, Mode=OneWay}" Tag="AnimatedFindVisualSource" />
                <ComboBoxItem Content="{x:Bind navigationLabel, Mode=OneWay}" Tag="AnimatedGlobalNavigationButtonVisualSource" />
                <ComboBoxItem Content="{x:Bind settingsLabel, Mode=OneWay}" Tag="AnimatedSettingsVisualSource" />
              </ComboBox>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="AnimatedVisualSourceKind" Value="{x:Bind AnimatedVisualSourceSelection.SelectedItem.Tag, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
          <ControlExample x:Name="AnimatedIconExample2" HeaderText="{x:Bind navigationHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind navigationXaml, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel class="animated-icon-example">
                <TextBlock TextWrapping="WrapWholeWords">
                  <Run Text="{x:Bind navigationDescription, Mode=OneWay}" /><LineBreak /><LineBreak />
                  <Run Text="{x:Bind customAnimationDescription, Mode=OneWay}" /><LineBreak /><LineBreak />
                </TextBlock>
                <NavigationView class="animated-icon-navigation" Height="300" MinHeight="300" IsSettingsVisible="False">
                  <NavigationView.MenuItems>
                    <NavigationViewItem Content="{x:Bind gameSettingsLabel, Mode=OneWay}">
                      <NavigationViewItem.Icon>
                        <AnimatedIcon x:Name="GameSettingsIcon">
                          <AnimatedIcon.Source>
                            <animatedvisuals:AnimatedSettingsVisualSource />
                          </AnimatedIcon.Source>
                          <AnimatedIcon.FallbackIconSource>
                            <FontIconSource Glyph="&#xE713;" />
                          </AnimatedIcon.FallbackIconSource>
                        </AnimatedIcon>
                      </NavigationViewItem.Icon>
                    </NavigationViewItem>
                  </NavigationView.MenuItems>
                </NavigationView>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, provide, shallowReactive, watch } from 'vue'
import AnimatedIcon from '../../components/AnimatedIcon.vue'
import Button from '../../components/Button.vue'
import ComboBox from '../../components/ComboBox.vue'
import { ComboBoxItem } from '../../components/inlineControlProperties'
import ControlExample from '../../components/ControlExample.vue'
import NavigationView from '../../components/NavigationView.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import { NavigationViewItem } from '../../components/NavigationViewProperties'
import { AnimatedIcon as AnimatedIconApi } from '../../components/animatedIconRuntime'
import { getAnimatedIconVisualSource } from '../../components/animatedIconVisuals'
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
import buttonDefinition from '../samples/AnimatedIcon/AddingAnimatediconButton.txt?raw'
import directionalButtonDefinition from '../samples/AnimatedIcon/AddingAnimatediconDirectionalButton.txt?raw'
import navigationDefinition from '../samples/AnimatedIcon/AddingAnimatediconNavigationview.txt?raw'

const currentPage = inject<{ value: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'animatedicon')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const { t } = useI18n()
const pageTitle = computed(() => t('sample.animatedicon.page-title'))
const pageDescription = computed(() => t('sample.animatedicon.page-description'))
const buttonHeader = computed(() => t('sample.animatedicon.button-header'))
const navigationHeader = computed(() => t('sample.animatedicon.navigation-header'))
const buttonDescription = computed(() => t('sample.animatedicon.button-description'))
const lottieLabel = computed(() => t('sample.animatedicon.lottie'))
const animationGuidance = computed(() => t('sample.animatedicon.animation-guidance'))
const navigationDescription = computed(() => t('sample.animatedicon.navigation-description'))
const customAnimationDescription = computed(() => t('sample.animatedicon.custom-animation-description'))
const exampleButtonName = computed(() => t('sample.animatedicon.example-button-name'))
const kindLabel = computed(() => t('sample.animatedicon.kind'))
const gameSettingsLabel = computed(() => t('sample.animatedicon.game-settings'))
const toggleThemeLabel = computed(() => t('gallery.page-header.toggle-theme'))
const favoriteLabel = computed(() => t('gallery.page-header.favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const names = shallowReactive<Record<string, unknown>>({})
const backLabel = computed(() => t('sample.animatedicon.source.back'))
const downArrowLabel = computed(() => t('sample.animatedicon.source.chevron-down-small'))
const rightDownArrowLabel = computed(() => t('sample.animatedicon.source.chevron-right-down-small'))
const upDownArrowLabel = computed(() => t('sample.animatedicon.source.chevron-up-down-small'))
const findLabel = computed(() => t('sample.animatedicon.source.find'))
const navigationLabel = computed(() => t('sample.animatedicon.source.global-navigation-button'))
const settingsLabel = computed(() => t('sample.animatedicon.source.settings'))
const selectedSourceName = computed(() => {
  const selection = names.AnimatedVisualSourceSelection as { SelectedItem?: { Tag?: string } } | undefined
  return selection?.SelectedItem?.Tag ?? 'AnimatedFindVisualSource'
})
const isDirectionalArrow = computed(() => /AnimatedChevron(?:RightDown|UpDown)SmallVisualSource$/.test(selectedSourceName.value))
const initialAnimationState = computed(() => isDirectionalArrow.value ? 'NormalOff' : 'Normal')
let previewPointerOver = false
let previewDirectionOn = false

const animationSources = new Map<string, ReturnType<typeof getAnimatedIconVisualSource>>()
const GetAnimationSourceFromString = (animationSource: string) => {
  if (!animationSource) return null
  if (!animationSources.has(animationSource)) animationSources.set(animationSource, getAnimatedIconVisualSource(animationSource))
  return animationSources.get(animationSource) ?? null
}
const controlPages = { AnimatedIconPage: { GetAnimationSourceFromString } }
const directionalState = (state: 'Normal' | 'PointerOver' | 'Pressed') => state + (previewDirectionOn ? 'On' : 'Off')
const restoreDirectionalState = () => AnimatedIconApi.SetState(names.SearchAnimatedIcon, directionalState(previewPointerOver ? 'PointerOver' : 'Normal'))
const Button_PointerEntered = () => {
  previewPointerOver = true
  AnimatedIconApi.SetState(names.SearchAnimatedIcon, isDirectionalArrow.value ? directionalState('PointerOver') : 'PointerOver')
}
const Button_PointerExited = () => {
  previewPointerOver = false
  AnimatedIconApi.SetState(names.SearchAnimatedIcon, isDirectionalArrow.value ? directionalState('Normal') : 'Normal')
}
const Button_PointerPressed = () => {
  if (isDirectionalArrow.value) AnimatedIconApi.SetState(names.SearchAnimatedIcon, directionalState('Pressed'))
}
const Button_PointerReleased = () => {
  if (isDirectionalArrow.value) restoreDirectionalState()
}
const Button_PointerCanceled = Button_PointerExited
const Button_PointerCaptureLost = Button_PointerReleased
const Button_Click = () => {
  if (!isDirectionalArrow.value) return
  previewDirectionOn = !previewDirectionOn
  restoreDirectionalState()
}
watch(selectedSourceName, () => {
  previewPointerOver = false
  previewDirectionOn = false
  AnimatedIconApi.SetState(names.SearchAnimatedIcon, initialAnimationState.value)
}, { flush: 'post' })
const sampleSection = (definition: string, section: string) => {
  const match = definition.match(new RegExp('(?:^|\\r?\\n)--- ' + section + '\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)'))
  return match?.[1].trim() ?? ''
}
const buttonXaml = computed(() => sampleSection(isDirectionalArrow.value ? directionalButtonDefinition : buttonDefinition, 'xaml'))
const buttonCSharp = computed(() => sampleSection(isDirectionalArrow.value ? directionalButtonDefinition : buttonDefinition, 'c#'))
const navigationXaml = sampleSection(navigationDefinition, 'xaml')

provide(xamlNameScopeKey, names)
provide(xamlScopeKey, {
  pageTitle, pageDescription, buttonHeader, navigationHeader, buttonDescription,
  lottieLabel, animationGuidance, navigationDescription, customAnimationDescription,
  exampleButtonName, kindLabel, gameSettingsLabel, toggleThemeLabel, favoriteLabel,
  favoriteGlyph, isFavoriteState, pageTheme, buttonXaml, buttonCSharp, navigationXaml,
  toggleTheme, toggleFavorite, Button_Click, Button_PointerEntered, Button_PointerExited,
  Button_PointerPressed, Button_PointerReleased, Button_PointerCanceled, Button_PointerCaptureLost,
  initialAnimationState, backLabel, downArrowLabel, rightDownArrowLabel, upDownArrowLabel, findLabel, navigationLabel, settingsLabel,
  controlPages
})
</script>

<style scoped>
:deep(.page-heading) { position: relative; }
:deep(.page-header) { margin: 0 72px 8px 0; font-size: 28px; font-weight: 600; color: var(--text-primary); }
:deep(.page-description) { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
:deep(.page-header-actions) { position: absolute; top: 0; right: 0; gap: 4px; }
:deep(.animated-icon-example) { min-width: 0; max-width: 100%; }
:deep(.animated-icon-navigation) { width: 100%; min-width: 0; max-width: 100%; }
:deep(.animated-icon-kind) { width: 340px; min-width: min(340px, 100%) !important; max-width: 100%; }
:deep(.icon) { font-size: 16px; }
</style>
