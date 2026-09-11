<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.viewbox')" />
          <TextBlock class="page-description" :Text="$t('text.viewbox-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.viewbox.content')" :theme="pageTheme" :vue="viewboxCode">
              <template #example>
                <Viewbox :Width="size" :Height="size" :Stretch="stretch" :StretchDirection="stretchDirection" VerticalAlignment="Top">
                  <div class="viewbox-border">
                    <StackPanel Background="DarkGray">
                      <StackPanel Orientation="Horizontal">
                        <div class="bar blue" />
                        <div class="bar green" />
                        <div class="bar red" />
                        <div class="bar yellow" />
                      </StackPanel>
                      <img class="slice-image" :src="sliceImage" alt="" />
                      <TextBlock HorizontalAlignment="Center" :Text="$t('sample.viewbox.text')" />
                    </StackPanel>
                  </div>
                </Viewbox>
              </template>
              <template #options>
                <div class="options-stack">
                  <Slider v-model:Value="size" Header="Width/Height" :Maximum="300" :Minimum="20" />
                  <RadioButtons Header="Stretch" :ItemsSource="stretchItems" :SelectedIndex="stretchIndex" @SelectionChanged="onStretchChanged" />
                  <RadioButtons Header="StretchDirection" :ItemsSource="stretchDirectionItems" :SelectedIndex="stretchDirectionIndex" @SelectionChanged="onStretchDirectionChanged" />
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
import RadioButtons from '../../components/RadioButtons.vue';
import Slider from '../../components/Slider.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import Viewbox from '../../components/Viewbox.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
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

const viewboxCode = computed(() => `<Viewbox Height="${size.value}" Width="${size.value}" Stretch="${stretch.value}" StretchDirection="${stretchDirection.value}">
  <Border BorderBrush="Gray" BorderThickness="15">
    <StackPanel Background="DarkGray">
      <StackPanel Orientation="Horizontal">
        <Rectangle Fill="Blue" Height="10" Width="40" />
        <Rectangle Fill="Green" Height="10" Width="40" />
        <Rectangle Fill="Red" Height="10" Width="40" />
        <Rectangle Fill="Yellow" Height="10" Width="40" />
      </StackPanel>
      <Image Source="${sliceImage}" />
      <TextBlock Text="${t('sample.viewbox.text')}" HorizontalTextAlignment="Center" />
    </StackPanel>
  </Border>
</Viewbox>`);

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
