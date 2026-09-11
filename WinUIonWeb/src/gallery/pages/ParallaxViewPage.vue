<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.parallaxview')" />
          <TextBlock class="page-description" :Text="$t('text.parallaxview-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme parallax-example" :exampleHeight="750" :headerText="$t('sample.parallaxview.listview')" :theme="pageTheme" :vue="listViewCode">
              <template #example>
                <div class="parallax-host">
                  <ParallaxView :Source="() => listSourceRef" :VerticalShift="500">
                    <template #child>
                      <img class="parallax-image" :src="cliffImage" alt="" />
                    </template>
                  </ParallaxView>
                  <div class="parallax-source">
                    <ListView
                      ref="listSourceRef"
                      :ItemsSource="sampleItems"
                      Background="rgba(0, 0, 0, 0.50)"
                      Height="100%">
                      <template #header>
                        <TextBlock
                          class="parallax-heading"
                          :Text="$t('sample.parallaxview.list-heading')"
                          Foreground="White"
                          FontSize="28"
                          TextWrapping="WrapWholeWords" />
                      </template>
                      <template #item="{ item }">
                        <TextBlock :Text="item" Foreground="White" />
                      </template>
                    </ListView>
                  </div>
                </div>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme parallax-example" :exampleHeight="750" :headerText="$t('sample.parallaxview.scrollview')" :theme="pageTheme" :vue="scrollViewCode">
              <template #example>
                <div class="parallax-host">
                  <ParallaxView :Source="() => scrollSourceRef" :VerticalShift="500">
                    <template #child>
                      <img class="parallax-image" :src="cliffImage" alt="" />
                    </template>
                  </ParallaxView>
                  <div class="parallax-scroll-example">
                    <TextBlock class="parallax-heading top-heading" :Text="$t('sample.parallaxview.rectangles-heading')" TextWrapping="WrapWholeWords" />
                    <ScrollViewer
                      ref="scrollSourceRef"
                      class="parallax-rect-scroll"
                      Width="150"
                      HorizontalAlignment="Left"
                      VerticalScrollBarVisibility="Auto"
                      VerticalScrollMode="Auto">
                      <StackPanel>
                        <div v-for="color in rectangleColors" :key="color" class="color-rectangle" :style="{ background: color }" />
                      </StackPanel>
                    </ScrollViewer>
                  </div>
                </div>
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import ListView from '../../components/ListView.vue';
import ParallaxView from '../../components/ParallaxView.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'parallaxview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const listSourceRef = ref(null);
const scrollSourceRef = ref(null);

const cliffImage = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg';

// Official sample binds the ListView to every control in the gallery, ordered by title.
const sampleItems = [
  'AcrylicBrush', 'AnimatedIcon', 'AnimatedVisualPlayer', 'Animation interop', 'AnnotatedScrollBar',
  'App notifications', 'AppBarButton', 'AppBarSeparator', 'AppBarToggleButton', 'AppWindow',
  'AppWindowTitleBar', 'AutoSuggestBox', 'Badge notifications', 'Binding', 'Border', 'BreadcrumbBar',
  'Button', 'CalendarDatePicker', 'CalendarView', 'Canvas', 'Capture Element / Camera Preview',
  'CheckBox', 'Clipboard', 'Color', 'Color Contrast', 'ColorPicker', 'ComboBox', 'CommandBar',
  'CommandBarFlyout', 'Compact Sizing', 'Connected Animation', 'ContentDialog', 'ContentIsland',
  'Custom & User Controls', 'DatePicker', 'DropDownButton', 'Easing Functions', 'Expander', 'FlipView',
  'Flyout', 'Geometry', 'Grid', 'GridView', 'HyperlinkButton', 'IconElement', 'Iconography', 'Image',
  'Implicit Transitions', 'InfoBadge', 'InfoBar', 'ItemsRepeater', 'ItemsView', 'JumpList',
  'Keyboard Navigation', 'Line', 'ListView', 'MapControl', 'MediaPlayerElement', 'MenuBar', 'MenuFlyout',
  'Multiple windows', 'NavigationView', 'NumberBox', 'Page Transitions', 'ParallaxView', 'PasswordBox',
  'PersonPicture', 'PipsPager', 'Pivot', 'Popup', 'ProgressBar', 'ProgressRing', 'PullToRefresh',
  'RadialGradientBrush', 'RadioButton', 'RatingControl', 'RelativePanel', 'RepeatButton', 'Resources',
  'RichEditBox', 'RichTextBlock', 'Scratch Pad', 'Screen Reader', 'ScrollView', 'ScrollViewer',
  'SelectorBar', 'SemanticZoom', 'Shape', 'Slider', 'Sound', 'Spacing', 'SplitButton', 'SplitView',
  'StackPanel', 'StandardUICommand', 'Storage pickers', 'Style', 'SwipeControl',
  'System Backdrops (Mica/Acrylic)', 'SystemBackdropElement', 'TabView', 'TeachingTip', 'Templates',
  'TextBlock', 'TextBox', 'Theme Transitions', 'ThemeShadow', 'TimePicker', 'TitleBar', 'ToggleButton',
  'ToggleSplitButton', 'ToggleSwitch', 'ToolTip', 'TreeView', 'Typography', 'VariableSizedWrapGrid',
  'Viewbox', 'WebView2', 'XAML Conditions', 'XamlUICommand'
];

const rectangleColors = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'BlanchedAlmond', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan'];

const listViewCode = computed(() => `<ParallaxView Source="listView" VerticalShift="500">
  <template #child>
    <Image Source="${cliffImage}" />
  </template>
</ParallaxView>
<ListView x:Name="listView" Background="#80000000" ItemsSource="Items">
  <ListView.Header>
    <TextBlock Text="${t('sample.parallaxview.list-heading')}" Foreground="White" FontSize="28" TextWrapping="WrapWholeWords" />
  </ListView.Header>
</ListView>`);

const scrollViewCode = computed(() => `<ParallaxView Source="scrollView" VerticalShift="500">
  <template #child>
    <Image Source="${cliffImage}" />
  </template>
</ParallaxView>
<TextBlock Text="${t('sample.parallaxview.rectangles-heading')}" Foreground="White" FontSize="28" TextWrapping="WrapWholeWords" />
<ScrollViewer x:Name="scrollView" Width="150">
  <StackPanel>
    <Rectangle Height="150" Fill="AliceBlue" />
    <Rectangle Height="150" Fill="AntiqueWhite" />
    <Rectangle Height="150" Fill="Aqua" />
  </StackPanel>
</ScrollViewer>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.parallax-example :deep(.example-display) { padding: 0; align-items: stretch; }
.parallax-host { width: 100%; height: 100%; overflow: hidden; position: relative; }
.parallax-image { width: 100%; height: 100%; object-fit: cover; display: block; }
.parallax-source { position: absolute; inset: 0; z-index: 1; }
.parallax-heading { max-width: 280px; margin: 24px auto; color: White; font-size: 28px; line-height: 36px; text-align: center; }
.parallax-example :deep(.win-list-view) { width: 100%; height: 100%; }
.parallax-example :deep(.win-list-header) { margin: 24px auto; padding: 0; background: transparent; min-height: 0; }
.parallax-example :deep(.win-list-header .win-text-block) { max-width: 280px; margin: 0 auto; text-align: center; }
.parallax-scroll-example { width: 100%; height: 100%; position: relative; }
.top-heading { position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 2; margin-top: 24px; }
.parallax-rect-scroll { height: 100%; }
.color-rectangle { width: 150px; height: 150px; }
</style>
