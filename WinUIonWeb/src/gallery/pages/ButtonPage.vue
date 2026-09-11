<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.button'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.the-button-control-provides-a-click-event-to-res'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
            <ControlExample class="basic-input-example-theme" SampleDefinition="Button\ButtonSimple.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind buttonSimpleVue, Mode=OneWay}" HeaderText="{x:Bind $t('text.a-simple-button-with-text-content'), Mode=OneWay}">
              <ControlExample.Example>
                <Button AutomationProperties.Name="Standard XAML"
                  Content="{x:Bind $t('sample.button.standard-xaml'), Mode=OneWay}"
                  IsEnabled="{x:Bind DisableButton1.IsChecked.Value.Equals(x:False), Mode=OneWay}"
                  Click="Button1_Click" />
              </ControlExample.Example>
              <ControlExample.Output>
                <TextBlock FontFamily="Global User Interface" Text="{x:Bind Control1Output, Mode=OneWay}" />
              </ControlExample.Output>
              <ControlExample.Options>
                <StackPanel>
                  <CheckBox IsChecked="{x:Bind DisableButton1, Mode=TwoWay}">
                    <TextBlock Text="{x:Bind $t('sample.button.disable'), Mode=OneWay}" />
                  </CheckBox>
                </StackPanel>
              </ControlExample.Options>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="Button\ButtonWithImage.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind buttonWithImageVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.button.with-image'), Mode=OneWay}">
              <ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                  <Button Width="50" Height="50" AutomationProperties.Name="Pie" Padding="4" Click="Button2_Click">
                    <Image Width="42" Height="42" Source="{x:Bind pieSliceImageUrl, Mode=OneWay}" AutomationProperties.Name="Slice" Stretch="Uniform" />
                  </Button>
                </StackPanel>
              </ControlExample.Example>
              <ControlExample.Output>
                <TextBlock Text="{x:Bind Control2Output, Mode=OneWay}" />
              </ControlExample.Output>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="Button\ButtonBuiltInStyles.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind buttonBuiltInStylesVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.button.built-in-styles'), Mode=OneWay}">
              <ControlExample.Example>
                <StackPanel Orientation="Horizontal" Spacing="16">
                  <Button AutomationProperties.Name="Accent style" Content="{x:Bind $t('sample.button.accent-style'), Mode=OneWay}" Style="{StaticResource AccentButtonStyle}" />
                  <Button AutomationProperties.Name="Subtle style" Content="{x:Bind $t('sample.button.subtle-style'), Mode=OneWay}" Style="{StaticResource SubtleButtonStyle}" />
                </StackPanel>
              </ControlExample.Example>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="Button\ButtonWrapping.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind buttonWrappingVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.button.wrapping'), Mode=OneWay}">
                <StackPanel>
                  <TextBlock Margin="0,0,0,8" Text="{x:Bind $t('sample.button.wrapping-note-1'), Mode=OneWay}" TextWrapping="Wrap" />
                  <TextBlock Margin="0,0,0,8" Text="{x:Bind $t('sample.button.wrapping-note-2'), Mode=OneWay}" TextWrapping="Wrap" />
                  <Button HorizontalAlignment="Stretch" Margin="0,0,0,5"><TextBlock Text="{x:Bind $t('sample.button.long-text-1'), Mode=OneWay}" /></Button>
                  <Button HorizontalAlignment="Stretch"><TextBlock Text="{x:Bind $t('sample.button.long-text-2'), Mode=OneWay}" /></Button>
                  <TextBlock Margin="0,8,0,8" Text="{x:Bind $t('sample.button.wrapping-note-3'), Mode=OneWay}" />
                  <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
                    <Button MaxWidth="240" Margin="0,0,8,0">
                      <TextBlock Text="{x:Bind $t('sample.button.long-text-1-wrapping'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
                    </Button>
                    <Button MaxWidth="240">
                      <TextBlock Text="{x:Bind $t('sample.button.long-text-2-wrapping'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
                    </Button>
                  </StackPanel>
                </StackPanel>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import Image from '../../components/Image.vue';
import CheckBox from '../../components/CheckBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
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
const Button1_Click = () => Button_Click('Button1');
const Button2_Click = () => Button_Click('Button2');

const buttonSimpleVue = `<Button AutomationProperties.Name="Standard XAML"
                  Content="{x:Bind $t('sample.button.standard-xaml'), Mode=OneWay}"
  IsEnabled="{x:Bind DisableButton1.IsChecked.Value.Equals(x:False), Mode=OneWay}"
  Click="Button1_Click" />`;
const buttonWithImageVue = `<Button Width="50" Height="50" AutomationProperties.Name="Pie" Padding="4" Click="Button2_Click">
  <Image Width="42" Height="42" AutomationProperties.Name="Slice" Source="{x:Bind pieSliceImageUrl, Mode=OneWay}" Stretch="Uniform" />
</Button>`;

const buttonBuiltInStylesVue = `<Button Style="{StaticResource AccentButtonStyle}" Content="{x:Bind $t('sample.button.accent-style'), Mode=OneWay}" />
<Button Style="{StaticResource SubtleButtonStyle}" Content="{x:Bind $t('sample.button.subtle-style'), Mode=OneWay}" />`;

const buttonWrappingVue = `<StackPanel>
  <TextBlock Text="{x:Bind $t('sample.button.wrapping-note-1'), Mode=OneWay}" Margin="0,0,0,8" TextWrapping="Wrap" />
  <TextBlock Text="{x:Bind $t('sample.button.wrapping-note-2'), Mode=OneWay}" Margin="0,0,0,8" TextWrapping="Wrap" />
  <Button HorizontalAlignment="Stretch" Margin="0,0,0,5"><TextBlock Text="{x:Bind $t('sample.button.long-text-1'), Mode=OneWay}" /></Button>
  <Button HorizontalAlignment="Stretch"><TextBlock Text="{x:Bind $t('sample.button.long-text-2'), Mode=OneWay}" /></Button>

  <TextBlock Text="{x:Bind $t('sample.button.wrapping-note-3'), Mode=OneWay}" Margin="0,8,0,8" />
  <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
    <Button MaxWidth="240" Margin="0,0,8,0">
      <TextBlock Text="{x:Bind $t('sample.button.long-text-1-wrapping'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
    </Button>
    <Button MaxWidth="240">
      <TextBlock Text="{x:Bind $t('sample.button.long-text-2-wrapping'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
    </Button>
  </StackPanel>
</StackPanel>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.horizontal-stack { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.vertical-stack { display: flex; flex-direction: column; }
.stretch-stack { width: 100%; align-items: stretch; }
.centered-stack { justify-content: center; gap: 8px; }
</style>
