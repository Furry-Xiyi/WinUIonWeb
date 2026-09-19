<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind $t('text.pulltorefresh'), Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind $t('text.a-container-that-allows-users-to-refresh-content'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
        </StackPanel>
      </StackPanel>
      <StackPanel class="gallery-page-content">
        <ControlExample HeaderText="{x:Bind $t('sample.pulltorefresh.basic'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind basicXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Grid>
              <RefreshContainer x:Name="rc" MinWidth="200" HorizontalAlignment="Center" VerticalAlignment="Center" RefreshRequested="rc_RefreshRequested">
                <RefreshContainer.Content>
                  <ListView x:Name="lv" Width="200" Height="200" ItemsSource="{x:Bind items, Mode=OneWay}" BorderThickness="1" BorderBrush="{ThemeResource TextControlBorderBrush}">
                  <ListView.ItemTemplate><DataTemplate><TextBlock Text="{x:Bind}" /></DataTemplate></ListView.ItemTemplate>
                  </ListView>
                </RefreshContainer.Content>
              </RefreshContainer>
            </Grid>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Text="{x:Bind refreshCountText, Mode=OneWay}" /></ControlExample.Output>
        </ControlExample>
        <ControlExample HeaderText="{x:Bind $t('sample.pulltorefresh.custom-icon'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind customXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Grid RowDefinitions="Auto,*">
              <RefreshContainer Grid.Row="1" x:Name="rc2" MinWidth="200" HorizontalAlignment="Center" VerticalAlignment="Top" RefreshRequested="rc2_RefreshRequested">
                <RefreshContainer.Visualizer>
                  <RefreshVisualizer x:Name="rv2" RefreshStateChanged="rv2_RefreshStateChanged">
                    <RefreshVisualizer.Content><SymbolIcon Symbol="AddFriend" /></RefreshVisualizer.Content>
                  </RefreshVisualizer>
                </RefreshContainer.Visualizer>
                <RefreshContainer.Content>
                  <ListView x:Name="lv2" Width="200" Height="200" ItemsSource="{x:Bind customItems, Mode=OneWay}" BorderThickness="1" BorderBrush="{ThemeResource TextControlBorderBrush}">
                  <ListView.ItemTemplate><DataTemplate><TextBlock Text="{x:Bind}" /></DataTemplate></ListView.ItemTemplate>
                  </ListView>
                </RefreshContainer.Content>
              </RefreshContainer>
            </Grid>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Text="{x:Bind syncCountText, Mode=OneWay}" /></ControlExample.Output>
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import ListView from '../../components/ListView.vue'
import RefreshContainer from '../../components/PullToRefresh.vue'
import RefreshVisualizer from '../../components/RefreshVisualizer.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import SymbolIcon from '../../components/SymbolIcon.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
const { t } = useI18n()
const currentPage = inject<any>('currentPage')
const pageKey = computed(() => currentPage?.value || 'pulltorefresh')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const items = ref(['AcrylicBrush', 'ColorPicker', 'NavigationView'])
const customItems = ref(['Mike', 'Ben', 'Barbra', 'Claire'])
const refreshCount = ref(0)
const syncCount = ref(0)
const refreshCountText = computed(() => t('sample.pulltorefresh.refresh-count', { count: refreshCount.value }))
const syncCountText = computed(() => t('sample.pulltorefresh.sync-count', { count: syncCount.value }))
const refreshAfter = (args: any, collection: typeof items, prefix: string, delay: number) => {
  const deferral = args?.GetDeferral?.()
  window.setTimeout(() => { collection.value.unshift(`${prefix}${collection.value.length + 1}`); deferral?.Complete?.() }, delay)
}
const rc_RefreshRequested = (args: any) => { refreshCount.value++; refreshAfter(args, items, 'NewControl ', 500) }
const rc2_RefreshRequested = (args: any) => { syncCount.value++; refreshAfter(args, customItems, 'New Friend ', 800) }
const rv2_RefreshStateChanged = () => undefined
const basicXaml = '<RefreshContainer x:Name="rc" RefreshRequested="rc_RefreshRequested"><RefreshContainer.Content><ListView x:Name="lv" Width="200" Height="200" BorderThickness="1" BorderBrush="{ThemeResource TextControlBorderBrush}" /></RefreshContainer.Content></RefreshContainer>'
const customXaml = '<RefreshContainer x:Name="rc2" RefreshRequested="rc2_RefreshRequested"><RefreshContainer.Visualizer><RefreshVisualizer x:Name="rv2" RefreshStateChanged="rv2_RefreshStateChanged"><RefreshVisualizer.Content><SymbolIcon Symbol="AddFriend" /></RefreshVisualizer.Content></RefreshVisualizer></RefreshContainer.Visualizer><RefreshContainer.Content><ListView x:Name="lv2" Width="200" Height="200" BorderThickness="1" BorderBrush="{ThemeResource TextControlBorderBrush}" /></RefreshContainer.Content></RefreshContainer>'
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
