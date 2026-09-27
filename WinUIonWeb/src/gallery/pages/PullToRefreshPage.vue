<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind themeButtonLabel, Mode=OneWay}">
              <FontIcon Glyph="&#xE793;" />
            </Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind favoriteButtonLabel, Mode=OneWay}">
              <FontIcon Glyph="{x:Bind favoriteGlyph, Mode=OneWay}" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" HeaderText="{x:Bind basicHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}"
            Xaml="{x:Bind basicXaml}" CSharp="{x:Bind basicCSharp}">
            <ControlExample.Example>
              <Grid>
                <RefreshContainer x:Name="rc" HorizontalAlignment="Center" VerticalAlignment="Center" RefreshRequested="rc_RefreshRequested">
                  <ListView x:Name="lv" Height="200" MinWidth="200" ItemsSource="{x:Bind items1, Mode=OneWay}"
                    BorderBrush="{ThemeResource TextControlBorderBrush}" BorderThickness="1" />
                </RefreshContainer>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output>
              <StackPanel Spacing="8">
                <TextBlock Text="{x:Bind basicStatus, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Text="{x:Bind refreshCountText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              </StackPanel>
            </ControlExample.Output>
            <ControlExample.Options>
              <StackPanel Spacing="12">
                <TextBlock Text="{x:Bind gestureDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <Button Content="{x:Bind refreshButtonLabel, Mode=OneWay}" Click="rc.RequestRefresh" IsEnabled="{x:Bind canRefreshBasic, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Options>
          </ControlExample>

          <ControlExample x:Name="Example2" HeaderText="{x:Bind customHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}"
            Xaml="{x:Bind customXaml}" CSharp="{x:Bind customCSharp}">
            <ControlExample.Example>
              <Grid x:Name="Ex2Grid">
                <Grid.RowDefinitions>
                  <RowDefinition Height="Auto" />
                  <RowDefinition />
                </Grid.RowDefinitions>
                <RefreshContainer x:Name="rc2" Grid.Row="1" RefreshRequested="rc2_RefreshRequested">
                  <RefreshContainer.Visualizer>
                    <RefreshVisualizer x:Name="rv2" RefreshStateChanged="rv2_RefreshStateChanged">
                      <RefreshVisualizer.Content>
                        <SymbolIcon Symbol="AddFriend" />
                      </RefreshVisualizer.Content>
                    </RefreshVisualizer>
                  </RefreshContainer.Visualizer>
                  <ListView x:Name="lv2" Grid.Row="1" Width="200" Height="200" HorizontalAlignment="Center"
                    ItemsSource="{x:Bind items2, Mode=OneWay}" BorderBrush="{ThemeResource TextControlBorderBrush}" BorderThickness="1" />
                </RefreshContainer>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output>
              <StackPanel Spacing="8">
                <TextBlock Text="{x:Bind customStatus, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Text="{x:Bind syncCountText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <TextBlock Text="{x:Bind visualizerStateText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              </StackPanel>
            </ControlExample.Output>
            <ControlExample.Options>
              <StackPanel Spacing="12">
                <TextBlock Text="{x:Bind gestureDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <Button Content="{x:Bind refreshButtonLabel, Mode=OneWay}" Click="rc2.RequestRefresh" IsEnabled="{x:Bind canRefreshCustom, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Options>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, type Ref } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import FontIcon from '../../components/FontIcon.vue'
import Grid from '../../components/Grid.vue'
import ListView from '../../components/ListView.vue'
import Page from '../../components/Page.vue'
import RefreshContainer from '../../components/RefreshContainer.vue'
import RefreshVisualizer from '../../components/RefreshVisualizer.vue'
import RowDefinition from '../../components/RowDefinition.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import SymbolIcon from '../../components/SymbolIcon.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import type { RefreshRequestedEventArgs, RefreshStateChangedEventArgs } from '../../components/refreshRuntime'
import { createPageState } from '../../utils/pageState'
import basicSample from '../samples/PullToRefresh/BasicPulltorefresh.txt?raw'
import customSample from '../samples/PullToRefresh/CustomIconPulltorefresh.txt?raw'

const { t } = useI18n()
const currentPage = inject<Ref<string> | null>('currentPage', null)
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'pulltorefresh')
const pageTitle = computed(() => t('text.pulltorefresh'))
const pageDescription = computed(() => t('text.a-container-that-allows-users-to-refresh-content'))
const basicHeader = computed(() => t('sample.pulltorefresh.basic'))
const customHeader = computed(() => t('sample.pulltorefresh.custom-icon'))
const themeButtonLabel = computed(() => t('gallery.page-header.toggle-theme'))
const favoriteButtonLabel = computed(() => t('gallery.page-header.favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const gestureDescription = computed(() => t('sample.pulltorefresh.gesture-description'))
const refreshButtonLabel = computed(() => t('sample.pulltorefresh.request-refresh'))

// PullToRefreshPage.xaml.cs: the same ordered collections, 500/800ms timers,
// and zero-based item counters. Display strings belong to the resource bundle.
const controlKeys = ['acrylicbrush', 'colorpicker', 'navigationview', 'parallaxview', 'personpicture', 'pulltorefreshpage', 'ratingscontrol', 'revealbrush', 'treeview']
const friendKeys = ['mike', 'ben', 'barbra', 'claire', 'justin', 'shawn', 'drew', 'lili']
const items1 = ref(controlKeys.map(key => t(`sample.pulltorefresh.control.${key}`)))
const items2 = ref(friendKeys.map(key => t(`sample.pulltorefresh.friend.${key}`)))
const completed1 = ref(0)
const completed2 = ref(0)
const refreshing1 = ref(false)
const refreshing2 = ref(false)
const visualizerState = ref<RefreshStateChangedEventArgs['NewState']>('Idle')
const canRefreshBasic = computed(() => !refreshing1.value)
const canRefreshCustom = computed(() => !refreshing2.value)
const refreshCountText = computed(() => t('sample.pulltorefresh.refresh-count', { count: completed1.value }))
const syncCountText = computed(() => t('sample.pulltorefresh.sync-count', { count: completed2.value }))
const basicStatus = computed(() => t(refreshing1.value ? 'sample.pulltorefresh.refreshing' : 'sample.pulltorefresh.ready'))
const customStatus = computed(() => t(refreshing2.value ? 'sample.pulltorefresh.refreshing' : 'sample.pulltorefresh.ready'))
const visualizerStateText = computed(() => t('sample.pulltorefresh.state-value', {
  state: t(`sample.pulltorefresh.state.${visualizerState.value.toLowerCase()}`)
}))

const pending = new Map<number, ReturnType<RefreshRequestedEventArgs['GetDeferral']>>()
const runRefresh = (args: RefreshRequestedEventArgs, collection: Ref<string[]>, count: Ref<number>, refreshing: Ref<boolean>, key: string, delay: number) => {
  const deferral = args.GetDeferral()
  refreshing.value = true
  const timer = window.setTimeout(() => {
    pending.delete(timer)
    try {
      collection.value.unshift(t(key, { count: count.value }))
      count.value += 1
    } finally {
      refreshing.value = false
      deferral.Complete()
    }
  }, delay)
  pending.set(timer, deferral)
}
const rc_RefreshRequested = (_sender: unknown, args: RefreshRequestedEventArgs) =>
  runRefresh(args, items1, completed1, refreshing1, 'sample.pulltorefresh.new-control', 500)
const rc2_RefreshRequested = (_sender: unknown, args: RefreshRequestedEventArgs) =>
  runRefresh(args, items2, completed2, refreshing2, 'sample.pulltorefresh.new-friend', 800)
const rv2_RefreshStateChanged = (_sender: unknown, args: RefreshStateChangedEventArgs) => {
  visualizerState.value = args.NewState
}
onBeforeUnmount(() => {
  for (const [timer, deferral] of pending) {
    window.clearTimeout(timer)
    deferral.Complete()
  }
  pending.clear()
})

// Gallery examples, with the custom symbol using the default rotation.
const sourcePart = (source: string, section: string) => source.split(`--- ${section}`)[1]?.split(/\r?\n--- /)[0]?.trim() ?? ''
const basicXaml = sourcePart(basicSample, 'xaml')
const basicCSharp = sourcePart(basicSample, 'c#')
const customXaml = sourcePart(customSample, 'xaml')
const customCSharp = sourcePart(customSample, 'c#')
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { margin: 0 80px 8px 0; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
/* Status text wraps within a stable output column instead of moving the list
   when the refreshing or pending label changes. */
:deep(.example-output) { width: 112px; max-width: 112px; box-sizing: border-box; }
</style>
