<template>
  <Grid class="system-backdrop-window" Background="{x:Bind windowBackground, Mode=OneWay}">
    <Grid.RowDefinitions>
      <RowDefinition Height="32" />
      <RowDefinition Height="*" />
    </Grid.RowDefinitions>
    <TitleBar x:Name="titleBar" Height="32" Margin="8,0,0,0" Title="{x:Bind Labels.windowTitle, Mode=OneWay}" IsBackButtonVisible="False" IsPaneToggleButtonVisible="False">
      <TitleBar.IconSource>
        <BitmapIconSource UriSource="https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/Tiles/GalleryIcon.ico" ShowAsMonochrome="False" />
      </TitleBar.IconSource>
    </TitleBar>
    <StackPanel
      Grid.Row="1"
      HorizontalAlignment="Center"
      VerticalAlignment="Center"
      Spacing="20">
      <TextBlock x:Name="tbChangeStatus" HorizontalAlignment="Center" TextWrapping="WrapWholeWords" Text="{x:Bind statusText, Mode=OneWay}" />
      <ComboBox
        x:Name="backdropComboBox"
        HorizontalAlignment="Stretch"
        Header="{x:Bind Labels.currentBackdrop, Mode=OneWay}"
        SelectedIndex="{x:Bind selectedBackdropIndex, Mode=TwoWay}"
        SelectionChanged="BackdropComboBox_SelectionChanged">
        <ComboBoxItem Content="{x:Bind Labels.mica, Mode=OneWay}" />
        <ComboBoxItem Content="{x:Bind Labels.micaAlt, Mode=OneWay}" />
        <ComboBoxItem Content="{x:Bind Labels.acrylic, Mode=OneWay}" />
        <ComboBoxItem Content="{x:Bind Labels.none, Mode=OneWay}" />
      </ComboBox>
      <ComboBox
        x:Name="themeComboBox"
        HorizontalAlignment="Stretch"
        Header="{x:Bind Labels.windowTheme, Mode=OneWay}"
        SelectedIndex="{x:Bind selectedThemeIndex, Mode=TwoWay}"
        SelectionChanged="ThemeComboBox_SelectionChanged">
        <ComboBoxItem Content="{x:Bind Labels.defaultTheme, Mode=OneWay}" />
        <ComboBoxItem Content="{x:Bind Labels.lightTheme, Mode=OneWay}" />
        <ComboBoxItem Content="{x:Bind Labels.darkTheme, Mode=OneWay}" />
      </ComboBox>
    </StackPanel>
  </Grid>
</template>

<script setup lang="ts">
import ComboBox from '../../../components/ComboBox.vue'
import { ComboBoxItem } from '../../../components/inlineControlProperties'
import Grid from '../../../components/Grid.vue'
import RowDefinition from '../../../components/RowDefinition.vue'
import StackPanel from '../../../components/StackPanel.vue'
import TextBlock from '../../../components/TextBlock.vue'
import TitleBar from '../../../components/TitleBar.vue'
import { BitmapIconSource } from '../../../components/IconSource'
import type { SystemBackdropWindowHandle } from '../../../components/systemBackdropHostAdapter'
import type { SampleBackdropType } from './mountSystemBackdropsWindow'
import { useSystemBackdropSampleWindow } from './useSystemBackdropSampleWindow'

const props = defineProps<{ handle: SystemBackdropWindowHandle; allowedBackdrops: SampleBackdropType[] }>()
const { Labels, statusText, windowBackground, backdropItems, selectedBackdropIndex, selectedThemeIndex, BackdropComboBox_SelectionChanged, ThemeComboBox_SelectionChanged } = useSystemBackdropSampleWindow(props)
</script>

<style>
.system-backdrop-window { width: 100%; height: 100%; min-width: 0; min-height: 240px; color: var(--text-primary); }
.system-backdrop-window > .win-stack-panel { width: min(420px, calc(100% - 40px)); min-width: min(280px, calc(100% - 40px)) !important; max-width: calc(100% - 40px); }
.system-backdrop-window .win-textblock { overflow-wrap: anywhere; }
</style>
