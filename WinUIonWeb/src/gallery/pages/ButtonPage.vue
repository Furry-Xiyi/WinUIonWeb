<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.button')" />
          <WinTextBlock class="page-description" :Text="$t('text.the-button-control-provides-a-click-event-to-res')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="buttonSimpleVue" :headerText="$t('text.a-simple-button-with-text-content')">
              <template #example>
                <WinButton AutomationProperties.Name="Standard XAML"
                  :Content="$t('sample.button.standard-xaml')"
                  :IsEnabled="DisableButton1 !== true"
                  @Click="Button_Click('Button1')" />
              </template>
              <template #options>
                <WinTextBlock FontFamily="Global User Interface" :Text="Control1Output" />
                <WinCheckBox v-model="DisableButton1">
                  <WinTextBlock :Text="$t('sample.button.disable')" />
                </WinCheckBox>
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="buttonWithImageVue" :headerText="$t('sample.button.with-image')">
              <template #example>
                <WinButton Width="50" Height="50" AutomationProperties.Name="Pie" Padding="4" @Click="Button_Click('Button2')">
                  <img class="pie-image" :src="pieSliceImageUrl" alt="Slice" />
                </WinButton>
              </template>
              <template #options>
                <WinTextBlock :Text="Control2Output" />
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="buttonBuiltInStylesVue" :headerText="$t('sample.button.built-in-styles')">
              <template #example>
                <div class="horizontal-stack">
                  <WinButton AutomationProperties.Name="Accent style" :Content="$t('sample.button.accent-style')" Style="{StaticResource AccentButtonStyle}" />
                  <WinButton AutomationProperties.Name="Subtle style" :Content="$t('sample.button.subtle-style')" Style="{StaticResource SubtleButtonStyle}" />
                </div>
              </template>
            </WinControlExample>
            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="buttonWrappingVue" :headerText="$t('sample.button.wrapping')">
              <template #example>
                <div class="vertical-stack stretch-stack">
                  <WinTextBlock Margin="0,0,0,8" :Text="$t('sample.button.wrapping-note-1')" TextWrapping="Wrap" />
                  <WinTextBlock Margin="0,0,0,8" :Text="$t('sample.button.wrapping-note-2')" TextWrapping="Wrap" />
                  <WinButton HorizontalAlignment="Stretch" Margin="0,0,0,5"><WinTextBlock :Text="$t('sample.button.long-text-1')" /></WinButton>
                  <WinButton HorizontalAlignment="Stretch"><WinTextBlock :Text="$t('sample.button.long-text-2')" /></WinButton>
                  <WinTextBlock Margin="0,8,0,8" :Text="$t('sample.button.wrapping-note-3')" />
                  <div class="horizontal-stack centered-stack">
                    <WinButton MaxWidth="240" Margin="0,0,8,0">
                      <WinTextBlock :Text="$t('sample.button.long-text-1-wrapping')" TextWrapping="WrapWholeWords" />
                    </WinButton>
                    <WinButton MaxWidth="240">
                      <WinTextBlock :Text="$t('sample.button.long-text-2-wrapping')" TextWrapping="WrapWholeWords" />
                    </WinButton>
                  </div>
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
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'button');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const DisableButton1 = ref(false);
const Control1Output = ref('');
const Control2Output = ref('');
const pieSliceImageUrl = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices.png';

const Button_Click = (name) => {
  if (name === 'Button1') Control1Output.value = t('sample.you-clicked', { name });
  if (name === 'Button2') Control2Output.value = t('sample.you-clicked', { name });
};

const buttonSimpleVue = `<WinButton AutomationProperties.Name="Standard XAML"
  Content="Standard XAML button"
  :IsEnabled="DisableButton1 !== true"
  @Click="Button_Click('Button1')" />`;
const buttonWithImageVue = `<WinButton Width="50" Height="50" AutomationProperties.Name="Pie" @Click="Button_Click('Button2')">
  <img src="${pieSliceImageUrl}" alt="Slice" />
</WinButton>`;

const buttonBuiltInStylesVue = `<WinButton Style="{StaticResource AccentButtonStyle}" Content="Accent style button" />
<WinButton Style="{StaticResource SubtleButtonStyle}" Content="Subtle style button" />`;

const buttonWrappingVue = `<div>
  <WinTextBlock Text="The following buttons' content may get clipped if we don't pay careful attention to their layout containers." Margin="0,0,0,8" TextWrapping="Wrap" />
  <WinTextBlock Text="One option to mitigate clipped content is to place Buttons underneath each other, allowing for more space to grow horizontally:" Margin="0,0,0,8" TextWrapping="Wrap" />
  <WinButton HorizontalAlignment="Stretch" Margin="0,0,0,5">This is some text that is too long and will get cut off</WinButton>
  <WinButton HorizontalAlignment="Stretch">This is another text that would result in being cut off</WinButton>

  <WinTextBlock Text="Another option is to explicitly wrap the Button's content" Margin="0,8,0,8" />
  <div>
    <WinButton MaxWidth="240" Margin="0,0,8,0">
      <WinTextBlock Text="This is some text that is too long and will get cut off" TextWrapping="WrapWholeWords" />
    </WinButton>
    <WinButton MaxWidth="240">
      <WinTextBlock Text="This is another text that would result in being cut off" TextWrapping="WrapWholeWords" />
    </WinButton>
  </div>
</div>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.pie-image { width: 100%; height: 100%; object-fit: contain; }
.horizontal-stack { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.vertical-stack { display: flex; flex-direction: column; }
.stretch-stack { width: 100%; align-items: stretch; }
.centered-stack { justify-content: center; gap: 8px; }
</style>
