<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.viewbox')" />
          <WinTextBlock class="page-description" :Text="$t('text.viewbox-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.viewbox.content')" :theme="pageTheme" :vue="viewboxCode">
              <template #example>
                <WinViewbox :Width="size" :Height="size" :Stretch="stretch" :StretchDirection="stretchDirection" VerticalAlignment="Top">
                  <div class="viewbox-border">
                    <WinStackPanel Background="DarkGray">
                      <WinStackPanel Orientation="Horizontal">
                        <div class="bar blue" />
                        <div class="bar green" />
                        <div class="bar red" />
                        <div class="bar yellow" />
                      </WinStackPanel>
                      <img class="slice-image" :src="sliceImage" alt="" />
                      <WinTextBlock HorizontalAlignment="Center" :Text="$t('sample.viewbox.text')" />
                    </WinStackPanel>
                  </div>
                </WinViewbox>
              </template>
              <template #options>
                <div class="options-stack">
                  <WinSlider v-model:Value="size" Header="Width/Height" :Maximum="300" :Minimum="20" />
                  <WinRadioButtons Header="Stretch" :ItemsSource="stretchItems" :SelectedIndex="stretchIndex" @SelectionChanged="onStretchChanged" />
                  <WinRadioButtons Header="StretchDirection" :ItemsSource="stretchDirectionItems" :SelectedIndex="stretchDirectionIndex" @SelectionChanged="onStretchDirectionChanged" />
                </div>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinRadioButtons from '../../components/WinRadioButtons.vue';
import WinSlider from '../../components/WinSlider.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinViewbox from '../../components/WinViewbox.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'viewbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const sliceImage = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices.png';
const size = ref(200);
const stretchItems = [{ Text: 'None' }, { Text: 'Fill' }, { Text: 'Uniform' }, { Text: 'UniformToFill' }];
const stretchDirectionItems = [{ Text: 'UpOnly' }, { Text: 'DownOnly' }, { Text: 'Both' }];
const stretchIndex = ref(2);
const stretchDirectionIndex = ref(2);
const stretch = computed(() => stretchItems[stretchIndex.value]?.Text || 'Uniform');
const stretchDirection = computed(() => stretchDirectionItems[stretchDirectionIndex.value]?.Text || 'Both');

const onStretchChanged = ({ SelectedIndex }) => {
  stretchIndex.value = SelectedIndex;
};

const onStretchDirectionChanged = ({ SelectedIndex }) => {
  stretchDirectionIndex.value = SelectedIndex;
};

const viewboxCode = computed(() => `<WinViewbox Height="${size.value}" Width="${size.value}" Stretch="${stretch.value}" StretchDirection="${stretchDirection.value}">
  <Border BorderBrush="Gray" BorderThickness="15">
    <WinStackPanel Background="DarkGray">
      <WinStackPanel Orientation="Horizontal">
        <Rectangle Fill="Blue" Height="10" Width="40" />
        <Rectangle Fill="Green" Height="10" Width="40" />
        <Rectangle Fill="Red" Height="10" Width="40" />
        <Rectangle Fill="Yellow" Height="10" Width="40" />
      </WinStackPanel>
      <Image Source="${sliceImage}" />
      <WinTextBlock Text="${t('sample.viewbox.text')}" HorizontalTextAlignment="Center" />
    </WinStackPanel>
  </Border>
</WinViewbox>`);

</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.viewbox-border { border: 15px solid Gray; }
.bar { width: 40px; height: 10px; }
.blue { background: Blue; }
.green { background: Green; }
.red { background: Red; }
.yellow { background: Yellow; }
.slice-image { display: block; width: auto; height: auto; max-width: none; }
.options-stack { width: 200px; display: flex; flex-direction: column; gap: 0; align-items: stretch; }
</style>
