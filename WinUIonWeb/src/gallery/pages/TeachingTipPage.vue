<template>
  <Page>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind PageTitle}" />
        <TextBlock class="page-description" Text="{x:Bind PageDescription}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" AutomationProperties.Name="{x:Bind ThemeButtonLabel}" ToolTipService.ToolTip="{x:Bind ThemeButtonLabel}" Click="toggleTheme">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteButtonLabel}" ToolTipService.ToolTip="{x:Bind FavoriteButtonLabel}" Click="toggleFavorite">
            <TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" />
          </ToggleButton>
        </div>
      </div>
      <StackPanel class="gallery-page-content">
        <ControlExample class="teaching-tip-example" SampleDefinition="TeachingTip\ShowTargetedTeachingtipButton.txt" HeaderText="{x:Bind TargetedHeader}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind TargetedXaml}" CSharp="{x:Bind TargetedCSharp}">
          <ControlExample.Example>
            <Grid>
              <Button x:Name="TestButton1" Click="TestButton1Click" Content="{x:Bind ShowTipLabel}" />
              <TeachingTip x:Name="TestButton1TeachingTip" Title="{x:Bind TipTitle}" Subtitle="{x:Bind TipSubtitle}" Target="{x:Bind TestButton1}">
                <TeachingTip.IconSource>
                  <SymbolIconSource Symbol="Refresh" />
                </TeachingTip.IconSource>
              </TeachingTip>
            </Grid>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
        <ControlExample class="teaching-tip-example" SampleDefinition="TeachingTip\ShowNonTargetedTeachingtip.txt" HeaderText="{x:Bind NonTargetedHeader}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind NonTargetedXaml}" CSharp="{x:Bind NonTargetedCSharp}">
          <ControlExample.Example>
            <Grid>
              <Button Click="TestButton2Click" Content="{x:Bind ShowTipLabel}" />
              <TeachingTip x:Name="TestButton2TeachingTip" Title="{x:Bind TipTitle}" ActionButtonContent="{x:Bind ActionButtonLabel}" CloseButtonContent="{x:Bind CloseButtonLabel}" IsLightDismissEnabled="True" PlacementMargin="20" PreferredPlacement="Auto" Subtitle="{x:Bind TipSubtitle}" />
            </Grid>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
        <ControlExample class="teaching-tip-example teaching-tip-hero-example" SampleDefinition="TeachingTip\ShowTargetedTeachingtipHero.txt" HeaderText="{x:Bind HeroHeader}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind HeroXaml}" CSharp="{x:Bind HeroCSharp}">
          <ControlExample.Example>
            <Grid>
              <Button x:Name="TestButton3" Click="TestButton3Click" Content="{x:Bind ShowTipLabel}" />
              <TeachingTip x:Name="TestButton3TeachingTip" Title="{x:Bind TipTitle}" PreferredPlacement="Bottom" Subtitle="{x:Bind TipSubtitle}" Target="{x:Bind TestButton3}">
                <TeachingTip.HeroContent>
                  <Image AutomationProperties.Name="{x:Bind SunsetLabel}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/sunset.jpg" />
                </TeachingTip.HeroContent>
                <TeachingTip.Content>
                  <TextBlock Margin="0,16,0,0" Text="{x:Bind TipDescription}" TextWrapping="WrapWholeWords" />
                </TeachingTip.Content>
              </TeachingTip>
            </Grid>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, provide, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import Image from '../../components/Image.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import SymbolIconSource from '../../components/SymbolIcon.vue'
import TeachingTip from '../../components/TeachingTip.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'
import targetedXamlSource from '../samples/TeachingTip/TeachingTipSample1_xaml.txt?raw'
import targetedCSharpSource from '../samples/TeachingTip/TeachingTipSample1_cs.txt?raw'
import nonTargetedXamlSource from '../samples/TeachingTip/TeachingTipSample2_xaml.txt?raw'
import nonTargetedCSharpSource from '../samples/TeachingTip/TeachingTipSample2_cs.txt?raw'
import heroXamlSource from '../samples/TeachingTip/TeachingTipSample3_xaml.txt?raw'
import heroCSharpSource from '../samples/TeachingTip/TeachingTipSample3_cs.txt?raw'

const { t } = useI18n()
const TargetedXaml = targetedXamlSource
const TargetedCSharp = targetedCSharpSource
const NonTargetedXaml = nonTargetedXamlSource
const NonTargetedCSharp = nonTargetedCSharpSource
const HeroXaml = heroXamlSource
const HeroCSharp = heroCSharpSource
const PageTitle = computed(() => t('text.teachingtip'))
const PageDescription = computed(() => t('text.a-teaching-tip-is-a-notification-flyout-used-to'))
const TargetedHeader = computed(() => t('sample.teachingtip.targeted'))
const NonTargetedHeader = computed(() => t('sample.teachingtip.non-targeted'))
const HeroHeader = computed(() => t('sample.teachingtip.hero'))
const TipTitle = computed(() => t('sample.teachingtip.title'))
const TipSubtitle = computed(() => t('sample.teachingtip.subtitle'))
const TipDescription = computed(() => t('sample.teachingtip.description'))
const ShowTipLabel = computed(() => t('text.show-teachingtip'))
const ActionButtonLabel = computed(() => t('sample.teachingtip.action-button'))
const CloseButtonLabel = computed(() => t('sample.teachingtip.close-button'))
const SunsetLabel = computed(() => t('sample.teachingtip.sunset'))
const ThemeButtonLabel = computed(() => t('sample.navigationview.change-theme'))
const currentPage = inject<{ value?: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'teachingtip')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const FavoriteButtonLabel = computed(() => t(isFavoriteState.value ? 'sample.navigationview.remove-favorite' : 'sample.navigationview.add-favorite'))
const namescope = shallowReactive<Record<string, { IsOpen: boolean }>>({})
provide(xamlNameScopeKey, namescope)
const TestButton1Click = () => { namescope.TestButton1TeachingTip.IsOpen = true }
const TestButton2Click = () => { namescope.TestButton2TeachingTip.IsOpen = true }
const TestButton3Click = () => { namescope.TestButton3TeachingTip.IsOpen = true }
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
