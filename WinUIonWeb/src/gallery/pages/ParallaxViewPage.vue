<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.parallaxview')" />
          <WinTextBlock class="page-description" :Text="$t('text.parallaxview-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme parallax-example" :exampleHeight="750" :headerText="$t('sample.parallaxview.listview')" :theme="pageTheme" :vue="listViewCode">
              <template #example>
                <div class="parallax-host">
                  <WinParallaxView :VerticalShift="500">
                    <template #child>
                      <img class="parallax-image" :src="cliffImage" alt="" />
                    </template>
                    <div class="parallax-list">
                      <WinTextBlock class="parallax-heading" :Text="$t('sample.parallaxview.list-heading')" TextWrapping="WrapWholeWords" />
                      <div v-for="item in sampleItems" :key="item" class="parallax-list-item">
                        <WinTextBlock Foreground="White" :Text="item" />
                      </div>
                    </div>
                  </WinParallaxView>
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme parallax-example" :exampleHeight="750" :headerText="$t('sample.parallaxview.scrollview')" :theme="pageTheme" :vue="scrollViewCode">
              <template #example>
                <div class="parallax-host">
                  <WinParallaxView :VerticalShift="500">
                    <template #child>
                      <img class="parallax-image" :src="cliffImage" alt="" />
                    </template>
                    <div class="parallax-scroll-example">
                      <WinTextBlock class="parallax-heading top-heading" :Text="$t('sample.parallaxview.rectangles-heading')" TextWrapping="WrapWholeWords" />
                      <WinScrollViewer Width="150" Height="750" HorizontalAlignment="Left">
                        <WinStackPanel>
                          <div v-for="color in rectangleColors" :key="color" class="color-rectangle" :style="{ background: color }" />
                        </WinStackPanel>
                      </WinScrollViewer>
                    </div>
                  </WinParallaxView>
                </div>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinParallaxView from '../../components/WinParallaxView.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'parallaxview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const cliffImage = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg';
const sampleItems = ['AppBarButton', 'AppBarSeparator', 'AppBarToggleButton', 'AutoSuggestBox', 'Button', 'CalendarDatePicker', 'CheckBox', 'ComboBox', 'CommandBar', 'DatePicker', 'DropDownButton', 'FlipView', 'GridView', 'HyperlinkButton', 'ListView', 'MenuBar', 'NavigationView', 'PasswordBox', 'ProgressBar', 'ProgressRing', 'RadioButton', 'Slider', 'SplitButton', 'TextBox', 'TimePicker', 'ToggleButton', 'ToggleSwitch'];
const rectangleColors = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'BlanchedAlmond', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan'];

const listViewCode = computed(() => `<WinParallaxView VerticalShift="500">
  <template #child>
    <Image Source="${cliffImage}" />
  </template>
  <ListView Background="#80000000" ItemsSource="Items">
    <ListView.Header>
      <WinTextBlock Text="${t('sample.parallaxview.list-heading')}" Foreground="White" FontSize="28" TextWrapping="WrapWholeWords" />
    </ListView.Header>
  </ListView>
</WinParallaxView>`);

const scrollViewCode = computed(() => `<WinParallaxView VerticalShift="500">
  <template #child>
    <Image Source="${cliffImage}" />
  </template>
  <WinTextBlock Text="${t('sample.parallaxview.rectangles-heading')}" Foreground="White" FontSize="28" TextWrapping="WrapWholeWords" />
  <WinScrollViewer Width="150">
    <WinStackPanel>
      <Rectangle Height="150" Fill="AliceBlue" />
      <Rectangle Height="150" Fill="AntiqueWhite" />
      <Rectangle Height="150" Fill="Aqua" />
    </WinStackPanel>
  </WinScrollViewer>
</WinParallaxView>`);
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
.parallax-list { width: 100%; min-height: 100%; background: rgba(0, 0, 0, 0.50); }
.parallax-heading { max-width: 280px; margin: 24px auto; color: White; font-size: 28px; line-height: 36px; text-align: center; }
.parallax-list-item { min-height: 40px; padding: 10px 16px; }
.parallax-scroll-example { width: 100%; height: 100%; position: relative; }
.top-heading { position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 2; margin-top: 24px; }
.color-rectangle { width: 150px; height: 150px; }
</style>
