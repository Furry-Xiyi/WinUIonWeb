<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" Text="PipsPager" />
          <WinTextBlock class="page-description" Text="The PipsPager provides a simple and visual way to navigate sequential content." TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" headerText="PipsPager integrated with a FlipView" :theme="pageTheme" :vue="example1Code">
              <template #example>
                <WinStackPanel>
                  <WinFlipView
                    v-model:SelectedIndex="currentImageIndex"
                    class="gallery-flipview"
                    :ItemsSource="pictures">
                    <template #item="{ item }">
                      <img class="gallery-image" :src="item" alt="" />
                    </template>
                  </WinFlipView>
                  <WinPipsPager
                    class="flipview-pips"
                    :NumberOfPages="pictures.length"
                    :SelectedPageIndex="currentImageIndex"
                    @update:SelectedPageIndex="currentImageIndex = $event" />
                </WinStackPanel>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" headerText="PipsPager with options to change its orientation and button visibility" :theme="pageTheme" :vue="example2Code">
              <template #example>
                <WinPipsPager
                  :NumberOfPages="10"
                  :SelectedPageIndex="selectedPageIndex"
                  :Orientation="orientation"
                  :PreviousButtonVisibility="previousButtonVisibility"
                  :NextButtonVisibility="nextButtonVisibility"
                  @update:SelectedPageIndex="selectedPageIndex = $event"
                  @SelectedIndexChanged="onSelectedIndexChanged" />
              </template>
              <template #options>
                <WinStackPanel>
                  <WinTextBlock :Text="outputText" />
                  <WinComboBox Header="Orientation" :SelectedIndex="orientationIndex" :ItemsSource="orientationItems" DisplayMemberPath="Text" @update:SelectedIndex="orientationIndex = $event" />
                  <WinComboBox Header="Previous Button Visibility" :SelectedIndex="previousButtonVisibilityIndex" :ItemsSource="buttonVisibilityItems" DisplayMemberPath="Text" @update:SelectedIndex="previousButtonVisibilityIndex = $event" />
                  <WinComboBox Header="Next Button Visibility" :SelectedIndex="nextButtonVisibilityIndex" :ItemsSource="buttonVisibilityItems" DisplayMemberPath="Text" @update:SelectedIndex="nextButtonVisibilityIndex = $event" />
                </WinStackPanel>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinFlipView from '../../components/WinFlipView.vue';
import WinPipsPager from '../../components/WinPipsPager.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'pipspager');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const raw = (name) => `https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/${name}`;
const pictures = Array.from({ length: 8 }, (_, index) => raw(`LandscapeImage${index + 1}.jpg`));
const currentImageIndex = ref(0);

const selectedPageIndex = ref(0);
const outputText = ref('Page 1 of 10 selected');
const orientationIndex = ref(0);
const previousButtonVisibilityIndex = ref(0);
const nextButtonVisibilityIndex = ref(0);
const orientationItems = [{ Text: 'Horizontal' }, { Text: 'Vertical' }];
const buttonVisibilityItems = [{ Text: 'Visible' }, { Text: 'VisibleOnPointerOver' }, { Text: 'Collapsed' }];
const orientation = computed(() => orientationItems[orientationIndex.value].Text);
const previousButtonVisibility = computed(() => buttonVisibilityItems[previousButtonVisibilityIndex.value].Text);
const nextButtonVisibility = computed(() => buttonVisibilityItems[nextButtonVisibilityIndex.value].Text);

const onSelectedIndexChanged = (args) => {
  outputText.value = `Page ${args.newIndex + 1} of 10 selected`;
};

const example1Code = computed(() => `<WinStackPanel>
  <WinFlipView Height="270" MaxWidth="400" ItemsSource="Pictures" />
  <WinPipsPager Margin="0,12,0,0"
    HorizontalAlignment="Center"
    NumberOfPages="${pictures.length}"
    SelectedPageIndex="${currentImageIndex.value}" />
</WinStackPanel>`);

const example2Code = computed(() => `<WinPipsPager
  NumberOfPages="10"
  Orientation="${orientation.value}"
  PreviousButtonVisibility="${previousButtonVisibility.value}"
  NextButtonVisibility="${nextButtonVisibility.value}" />`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.gallery-flipview { width: min(400px, 100%); height: 270px; max-width: 400px; }
.gallery-image { width: 100%; height: 100%; object-fit: cover; display: block; }
.flipview-pips { margin: 12px 0 0; align-self: center; }
</style>
