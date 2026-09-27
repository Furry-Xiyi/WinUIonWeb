<template>
  <div
    ref="rootRef"
    class="win-media-player-element"
    :class="{ 'is-full-window': isFullWindowActive, 'is-disabled': !isEnabled }"
    :style="rootStyle"
    @pointermove="showControls"
    @pointerleave="onRootExited"
    @pointerdown.capture="onRootPressed"
    @pointerup="onRootReleased"
    @pointercancel="onRootReleased"
    @keydown="onTransportKeyDown"
    @keyup="onTransportKeyUp"
    @lostpointercapture="onRootCaptureLost">
    <Grid class="win-media-player-surface" data-template-part="LayoutRoot">
      <Border class="win-media-player-transparent-border" Background="Transparent" data-template-part="BackgroundBorder" />
      <img v-if="posterUri" class="win-media-player-poster-fallback" :src="posterUri" :style="videoStyle" data-template-part="PosterImage" alt="" />
      <video
        :ref="setVideoElement"
        class="win-media-player-video"
        data-template-part="MediaPlayerPresenter"
        :class="{ 'is-media-error': mediaError }"
        :poster="posterUri"
        :src="playbackUri || undefined"
        :autoplay="autoPlayEnabled"
        crossorigin="anonymous"
        preload="metadata"
        :style="videoStyle"
        playsinline
        @loadedmetadata="syncFromVideo"
        @timeupdate="syncFromVideo"
        @durationchange="syncFromVideo"
        @volumechange="syncFromVideo"
        @ratechange="syncOptionalPlaybackState"
        @emptied="onMediaEmptied"
        @loadeddata="onMediaLoaded"
        @error="onMediaError"
        @waiting="onBufferingStarted"
        @canplay="onBufferingEnded"
        @playing="onBufferingEnded"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded">
      </video>
      <TransportControls>
        <Grid
          v-if="areTransportControlsEnabled"
          class="win-media-transport-controls"
          data-template-part="TransportControlsPresenter"
          :class="{ visible: controlsVisible, 'is-media-loading': isMediaLoading, 'is-media-error': mediaError, 'is-media-buffering': isBuffering, 'is-compact': isCompact }">
          <Border
            :ref="setControlPanelElement"
            class="win-media-transport-panel"
            data-template-part="ControlPanel_ControlPanelVisibilityStates_Border"
            Background="{ThemeResource MediaTransportControlsPanelBackground}"
            BorderBrush="{ThemeResource MediaTransportControlsBorderBrush}"
            BorderThickness="1"
            CornerRadius="{ThemeResource OverlayCornerRadius}"
            Margin="12"
            PointerEntered="onControlPanelEntered"
            PointerExited="onControlPanelExited"
            PointerPressed="onControlPanelPressed"
            PointerReleased="onControlPanelReleased"
            PointerCanceled="onControlPanelReleased"
            PointerCaptureLost="onControlPanelCaptureLost"
            GotFocus="onControlPanelFocusEntered"
            LostFocus="onControlPanelFocusExited">
            <Grid
              class="win-media-control-panel-grid"
              data-template-part="ControlPanelGrid"
              Height="{x:Bind controlPanelHeight, Mode=OneWay}"
              Padding="{x:Bind controlPanelPadding, Mode=OneWay}">
              <Grid.ColumnDefinitions>
                <ColumnDefinition Width="Auto" />
                <ColumnDefinition Width="*" />
                <ColumnDefinition Width="Auto" />
              </Grid.ColumnDefinitions>
              <Grid.RowDefinitions>
                <RowDefinition Height="Auto" />
                <RowDefinition Height="*" />
                <RowDefinition Height="Auto" />
              </Grid.RowDefinitions>
              <Border
                class="win-media-error"
                :class="{ visible: mediaError }"
                data-template-part="ErrorBorder"
                Grid.ColumnSpan="3"
                Width="320"
                Height="96"
                HorizontalAlignment="Center"
                Background="{ThemeResource MediaTransportControlsPanelBackground}"
                role="alert">
                <TextBlock
                  data-template-part="ErrorTextBlock"
                  Text="{x:Bind mediaErrorText, Mode=OneWay}"
                  Style="{StaticResource CaptionTextBlockStyle}"
                  TextWrapping="WrapWholeWords"
                  Margin="12" />
              </Border>
              <Border
                v-if="isSeekBarVisible"
                class="win-media-timeline-border"
                data-template-part="MediaTransportControls_Timeline_Border"
                Grid.Column="1"
                Grid.Row="1">
                <Grid class="win-media-timeline-grid" data-template-part="MediaTransportControls_Timeline_Grid">
                  <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*" />
                  </Grid.ColumnDefinitions>
                  <Grid.RowDefinitions>
                    <RowDefinition Height="*" />
                    <RowDefinition Height="Auto" />
                  </Grid.RowDefinitions>
                  <Grid class="win-media-progress-host">
                    <Border class="win-media-progress-slider" Margin="{x:Bind progressSliderMargin, Mode=OneWay}">
                      <Slider
                        data-template-part="ProgressSlider"
                        Value="{x:Bind currentTime, Mode=OneWay}"
                        Minimum="0"
                        Maximum="{x:Bind seekMaximum, Mode=OneWay}"
                        SmallChange="1"
                        StepFrequency="0.01"
                        IsThumbToolTipEnabled="False"
                        IsEnabled="{x:Bind canSeek, Mode=OneWay}"
                        MinWidth="80"
                        HorizontalAlignment="Stretch"
                        Height="32"
                        VerticalAlignment="Center"
                        ValueChanged="seekTo" />
                    </Border>
                    <Border v-if="isBuffering || isMediaLoading" class="win-media-loading-progress">
                      <ProgressBar
                        data-template-part="BufferingProgressBar"
                        IsIndeterminate="True"
                        ShowPaused="False"
                        IsHitTestVisible="False"
                        HorizontalAlignment="Stretch"
                        Height="4" />
                    </Border>
                  </Grid>
                  <Grid
                    class="win-media-time-text-grid"
                    data-template-part="TimeTextGrid"
                    Grid.Row="1"
                    Height="16"
                    Margin="7,0,7,2"
                    Visibility="{x:Bind timeTextVisibility, Mode=OneWay}">
                    <TextBlock data-template-part="TimeElapsedElement" Text="{x:Bind elapsedTimeText, Mode=OneWay}" Style="{StaticResource CaptionTextBlockStyle}" Margin="0" HorizontalAlignment="Left" VerticalAlignment="Bottom" />
                    <TextBlock data-template-part="TimeRemainingElement" Text="{x:Bind remainingTimeText, Mode=OneWay}" Style="{StaticResource CaptionTextBlockStyle}" HorizontalAlignment="Right" VerticalAlignment="Bottom" />
                  </Grid>
                </Grid>
              </Border>
              <Border
                class="win-media-left-side-play-border"
                data-template-part="LeftSidePlayBorder"
                Grid.Column="0"
                Grid.Row="1"
                Visibility="{x:Bind compactPlayVisibility, Mode=OneWay}">
                <AppBarButton
                  class="win-media-appbar-button"
                  data-template-part="PlayPauseButtonOnLeft"
                  Style="{StaticResource AppBarButtonStyle}"
                  Margin="0"
                  VerticalAlignment="Center"
                  IsEnabled="{x:Bind canPlay, Mode=OneWay}"
                  AutomationProperties.Name="{x:Bind playLabel, Mode=OneWay}"
                  ToolTipService.ToolTip="{x:Bind playLabel, Mode=OneWay}"
                  Click="togglePlay" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="{x:Bind playGlyph, Mode=OneWay}" />
                      </AppBarButton.Icon>
                </AppBarButton>
              </Border>
              <Border
                class="win-media-command-border"
                data-template-part="MediaTransportControls_Command_Border"
                Grid.Column="{x:Bind commandColumn, Mode=OneWay}"
                Grid.Row="{x:Bind commandRow, Mode=OneWay}">
                <Grid
                  class="win-media-command-bar"
                  data-template-part="MediaControlsCommandBar"
                  Margin="{x:Bind commandBarMargin, Mode=OneWay}"
                  role="toolbar"
                  AutomationProperties.Name="{x:Bind transportControlsLabel, Mode=OneWay}">
                  <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto" />
                    <ColumnDefinition Width="*" />
                    <ColumnDefinition Width="Auto" />
                  </Grid.ColumnDefinitions>
                  <StackPanel class="win-media-command-left" Orientation="Horizontal">
                    <AppBarButton
                      v-if="isVolumeButtonVisible"
                      class="win-media-appbar-button"
                      data-template-part="VolumeMuteButton"
                      Style="{StaticResource AppBarButtonStyle}"
                      IsEnabled="{x:Bind canChangeVolume, Mode=OneWay}"
                      AutomationProperties.Name="{x:Bind volumeLabel, Mode=OneWay}"
                      ToolTipService.ToolTip="{x:Bind volumeLabel, Mode=OneWay}" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="{x:Bind volumeGlyph, Mode=OneWay}" />
                      </AppBarButton.Icon>
                      <AppBarButton.Flyout>
                        <Flyout ref="volumeFlyoutRef" Placement="Top" ShouldConstrainToRootBounds="False" Opened="onVolumeFlyoutOpened" Closed="onVolumeFlyoutClosed">
                          <Flyout.FlyoutPresenterStyle>
                            <Style TargetType="FlyoutPresenter" BasedOn="{StaticResource DefaultFlyoutPresenterStyle}">
                              <Setter Property="Background" Value="{ThemeResource MediaTransportControlsFlyoutBackground}" />
                              <Setter Property="BorderBrush" Value="{ThemeResource MediaTransportControlsBorderBrush}" />
                              <Setter Property="Padding" Value="0" />
                            </Style>
                          </Flyout.FlyoutPresenterStyle>
                          <StackPanel class="win-media-volume-panel" Orientation="Horizontal">
                            <AppBarButton
                              class="win-media-appbar-button"
                              data-template-part="AudioMuteButton"
                              Style="{StaticResource AppBarButtonStyle}"
                              HorizontalAlignment="Center"
                              VerticalAlignment="Center"
                              Margin="12"
                              IsEnabled="{x:Bind canChangeVolume, Mode=OneWay}"
                              AutomationProperties.Name="{x:Bind muteLabel, Mode=OneWay}"
                              ToolTipService.ToolTip="{x:Bind muteLabel, Mode=OneWay}"
                              Click="toggleMute" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="{x:Bind volumeGlyph, Mode=OneWay}" />
                      </AppBarButton.Icon>
                            </AppBarButton>
                            <Slider
                                class="win-media-volume-slider"
                                data-template-part="VolumeSlider"
                                Value="{x:Bind volumePercent, Mode=OneWay}"
                                Minimum="0"
                                Maximum="100"
                                SmallChange="1"
                                StepFrequency="1"
                                IsThumbToolTipEnabled="False"
                                IsEnabled="{x:Bind canChangeVolume, Mode=OneWay}"
                                Width="{ThemeResource MTCHorizontalVolumeSliderWidth}"
                                Height="32"
                                HorizontalAlignment="Center"
                                VerticalAlignment="Center"
                                Margin="0"
                                ValueChanged="setVolume" />
                            <TextBlock class="win-media-volume-value" data-template-part="VolumeValue" Style="{StaticResource MediaTextBlockStyle}" Text="{x:Bind volumePercent, Mode=OneWay}" HorizontalAlignment="Center" VerticalAlignment="Center" Width="24" Margin="12" IsTextScaleFactorEnabled="False" />
                          </StackPanel>
                        </Flyout>
                      </AppBarButton.Flyout>
                    </AppBarButton>
                  </StackPanel>
                  <StackPanel class="win-media-command-center" Grid.Column="0" Grid.ColumnSpan="3" Orientation="Horizontal">
                    <AppBarButton v-if="isStopButtonVisible" class="win-media-appbar-button" data-template-part="StopButton" Style="{StaticResource AppBarButtonStyle}" IsEnabled="{x:Bind canStop, Mode=OneWay}" AutomationProperties.Name="{x:Bind stopLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind stopLabel, Mode=OneWay}" Click="stopPlayback" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="&#xE71A;" />
                      </AppBarButton.Icon>
                    </AppBarButton>
                    <AppBarButton v-if="isSkipBackwardButtonVisible" class="win-media-appbar-button" data-template-part="SkipBackwardButton" Style="{StaticResource AppBarButtonStyle}" IsEnabled="{x:Bind canSkipBackward, Mode=OneWay}" AutomationProperties.Name="{x:Bind skipBackwardLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind skipBackwardLabel, Mode=OneWay}" Click="skipBackward" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="&#xED3C;" />
                      </AppBarButton.Icon>
                    </AppBarButton>
                    <AppBarButton v-if="isPreviousTrackButtonVisible" class="win-media-appbar-button" data-template-part="PreviousTrackButton" Style="{StaticResource AppBarButtonStyle}" IsEnabled="{x:Bind canMovePrevious, Mode=OneWay}" AutomationProperties.Name="{x:Bind previousTrackLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind previousTrackLabel, Mode=OneWay}" Click="movePreviousTrack" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="&#xF8AC;" />
                      </AppBarButton.Icon>
                    </AppBarButton>
                    <AppBarButton v-if="isFastRewindButtonVisible" class="win-media-appbar-button" data-template-part="RewindButton" Style="{StaticResource AppBarButtonStyle}" IsEnabled="{x:Bind canFastRewind, Mode=OneWay}" AutomationProperties.Name="{x:Bind fastRewindLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind fastRewindLabel, Mode=OneWay}" Click="fastRewind" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="&#xE627;" />
                      </AppBarButton.Icon>
                    </AppBarButton>
                    <AppBarButton
                      class="win-media-appbar-button"
                      data-template-part="PlayPauseButton"
                      Visibility="{x:Bind normalPlayVisibility, Mode=OneWay}"
                      Style="{StaticResource AppBarButtonStyle}"
                      IsEnabled="{x:Bind canPlay, Mode=OneWay}"
                      AutomationProperties.Name="{x:Bind playLabel, Mode=OneWay}"
                      ToolTipService.ToolTip="{x:Bind playLabel, Mode=OneWay}"
                      Click="togglePlay" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="{x:Bind playGlyph, Mode=OneWay}" />
                      </AppBarButton.Icon>
                    </AppBarButton>
                    <AppBarButton v-if="isFastForwardButtonVisible" class="win-media-appbar-button" data-template-part="FastForwardButton" Style="{StaticResource AppBarButtonStyle}" IsEnabled="{x:Bind canFastForward, Mode=OneWay}" AutomationProperties.Name="{x:Bind fastForwardLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind fastForwardLabel, Mode=OneWay}" Click="fastForward" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="&#xE628;" />
                      </AppBarButton.Icon>
                    </AppBarButton>
                    <AppBarButton v-if="isNextTrackButtonVisible" class="win-media-appbar-button" data-template-part="NextTrackButton" Style="{StaticResource AppBarButtonStyle}" IsEnabled="{x:Bind canMoveNext, Mode=OneWay}" AutomationProperties.Name="{x:Bind nextTrackLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind nextTrackLabel, Mode=OneWay}" Click="moveNextTrack" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="&#xF8AD;" />
                      </AppBarButton.Icon>
                    </AppBarButton>
                    <AppBarButton v-if="isSkipForwardButtonVisible" class="win-media-appbar-button" data-template-part="SkipForwardButton" Style="{StaticResource AppBarButtonStyle}" IsEnabled="{x:Bind canSkipForward, Mode=OneWay}" AutomationProperties.Name="{x:Bind skipForwardLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind skipForwardLabel, Mode=OneWay}" Click="skipForward" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="&#xED3D;" />
                      </AppBarButton.Icon>
                    </AppBarButton>
                  </StackPanel>
                  <StackPanel class="win-media-command-right" Grid.Column="2" Orientation="Horizontal">
                    <AppBarToggleButton v-if="isRepeatButtonVisible" class="win-media-appbar-button" data-template-part="RepeatButton" Style="{StaticResource AppBarToggleButtonStyle}" IsEnabled="{x:Bind canRepeat, Mode=OneWay}" IsChecked="{x:Bind isLooping, Mode=OneWay}" AutomationProperties.Name="{x:Bind repeatLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind repeatLabel, Mode=OneWay}" Click="toggleRepeat" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarToggleButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="{x:Bind repeatGlyph, Mode=OneWay}" />
                      </AppBarToggleButton.Icon>
                    </AppBarToggleButton>
                    <AppBarButton v-if="isPlaybackRateButtonVisible" class="win-media-appbar-button" data-template-part="PlaybackRateButton" Style="{StaticResource AppBarButtonStyle}" IsEnabled="{x:Bind canChangePlaybackRate, Mode=OneWay}" AutomationProperties.Name="{x:Bind playbackRateLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind playbackRateLabel, Mode=OneWay}" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon><FontIcon class="win-media-glyph" Glyph="&#xEC57;" /></AppBarButton.Icon>
                      <AppBarButton.Flyout>
                        <Flyout ref="rateFlyoutRef" Opened="onRateFlyoutOpened" Closed="onRateFlyoutClosed">
                          <StackPanel data-template-part="PlaybackRateMenu" Spacing="0">
                            <RadioButton Content="{x:Bind quarterSpeedLabel, Mode=OneWay}" IsChecked="{x:Bind isQuarterSpeed, Mode=OneWay}" GroupName="PlaybackRate" Checked="setQuarterSpeed" />
                            <RadioButton Content="{x:Bind halfSpeedLabel, Mode=OneWay}" IsChecked="{x:Bind isHalfSpeed, Mode=OneWay}" GroupName="PlaybackRate" Checked="setHalfSpeed" />
                            <RadioButton Content="{x:Bind normalSpeedLabel, Mode=OneWay}" IsChecked="{x:Bind isNormalSpeed, Mode=OneWay}" GroupName="PlaybackRate" Checked="setNormalSpeed" />
                            <RadioButton Content="{x:Bind oneAndHalfSpeedLabel, Mode=OneWay}" IsChecked="{x:Bind isOneAndHalfSpeed, Mode=OneWay}" GroupName="PlaybackRate" Checked="setOneAndHalfSpeed" />
                            <RadioButton Content="{x:Bind doubleSpeedLabel, Mode=OneWay}" IsChecked="{x:Bind isDoubleSpeed, Mode=OneWay}" GroupName="PlaybackRate" Checked="setDoubleSpeed" />
                          </StackPanel>
                        </Flyout>
                      </AppBarButton.Flyout>
                    </AppBarButton>
                    <AppBarButton
                      v-if="isZoomButtonVisible"
                      class="win-media-appbar-button"
                      data-template-part="ZoomButton"
                      Style="{StaticResource AppBarButtonStyle}"
                      IsEnabled="{x:Bind canZoom, Mode=OneWay}"
                      AutomationProperties.Name="{x:Bind zoomLabel, Mode=OneWay}"
                      ToolTipService.ToolTip="{x:Bind zoomLabel, Mode=OneWay}"
                      Click="toggleStretch" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="&#xE799;" />
                      </AppBarButton.Icon>
                    </AppBarButton>
                    <AppBarButton
                      v-if="isCastButtonVisible"
                      class="win-media-appbar-button"
                      data-template-part="CastButton"
                      Style="{StaticResource AppBarButtonStyle}"
                      IsEnabled="{x:Bind canRequestCast, Mode=OneWay}"
                      AutomationProperties.Name="{x:Bind castLabel, Mode=OneWay}"
                      ToolTipService.ToolTip="{x:Bind castLabel, Mode=OneWay}"
                      Click="onCastRequested" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <FontIcon class="win-media-glyph" Glyph="&#xEC15;" />
                      </AppBarButton.Icon>
                      <AppBarButton.Flyout v-if="castFeedbackText">
                        <Flyout ref="castFeedbackFlyoutRef" Placement="Top" Closed="onCastFeedbackClosed">
                          <TextBlock class="win-media-cast-feedback" data-template-part="CastFeedback" Text="{x:Bind castFeedbackText, Mode=OneWay}" TextWrapping="Wrap" MaxWidth="280" />
                        </Flyout>
                      </AppBarButton.Flyout>
                    </AppBarButton>
                    <AppBarButton
                      v-if="isFullWindowButtonVisible"
                      class="win-media-appbar-button"
                      data-template-part="FullWindowButton"
                      Style="{StaticResource AppBarButtonStyle}"
                      IsEnabled="{x:Bind canChangeFullWindow, Mode=OneWay}"
                      AutomationProperties.Name="{x:Bind fullWindowLabel, Mode=OneWay}"
                      ToolTipService.ToolTip="{x:Bind fullWindowLabel, Mode=OneWay}"
                      Click="toggleFullWindow" Width="40" Height="40" MinWidth="40" MinHeight="40" LabelPosition="Collapsed" AllowFocusOnInteraction="True">
                      <AppBarButton.Icon>
                        <SymbolIcon class="win-media-glyph" data-template-part="FullWindowSymbol" Symbol="{x:Bind fullWindowSymbol, Mode=OneWay}" FontSize="16" />
                      </AppBarButton.Icon>
                    </AppBarButton>
                  </StackPanel>
                </Grid>
              </Border>
            </Grid>
          </Border>
        </Grid>
      </TransportControls>
      <Grid class="win-media-timed-text-source-presenter" data-template-part="TimedTextSourcePresenter" />
    </Grid>
  </div>
</template>


<script lang="ts">
import { defineComponent as defineProperty } from 'vue';
export const MediaPlayerTransportControlsProperty = defineProperty({
  name: 'MediaPlayerElement.TransportControls',
  __mediaTransportControlsProperty: true,
  setup() { return () => null; }
});
export default { TransportControls: MediaPlayerTransportControlsProperty };
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, provide, ref, useSlots, watch } from 'vue';
import AppBarButton from './AppBarButton.vue';
import Border from './Border.vue';
import Grid from './Grid.vue';
import ColumnDefinition from './ColumnDefinition.vue';
import RowDefinition from './RowDefinition.vue';
import StackPanel from './StackPanel.vue';
import TextBlock from './TextBlock.vue';
import FontIcon from './FontIcon.vue';
import SymbolIcon from './SymbolIcon.vue';
import AppBarToggleButton from './AppBarToggleButton.vue';
import RadioButton from './RadioButton.vue';
import Flyout from './Flyout.vue';
import ProgressBar from './ProgressBar.vue';
import Slider from './Slider.vue';
import { mediaTransportControlDefaults } from './MediaTransportControls.vue';
import { useI18n } from './i18n/index';
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';
import { xamlThickness } from './layout';
import { getBrowserMediaSource, needsSoftwareMediaDecoder } from './mediaSource';

const props = defineProps({
  Source: { type: [String, Object], default: '' },
  AreTransportControlsEnabled: { type: [Boolean, String], default: false },
  PosterSource: { type: [String, Object], default: '' },
  Stretch: { type: String, default: 'Uniform' },
  AutoPlay: { type: [Boolean, String], default: false },
  RenderTransform: { type: [String, Object], default: null },
  RenderTransformOrigin: { type: [String, Object], default: '0,0' },
  IsFullWindow: { type: [Boolean, String], default: false },
  TransportControls: { type: Object, default: null },
  IsEnabled: { type: [Boolean, String], default: true },
  Margin: { type: [String, Number], default: '' },
  Visibility: { type: String, default: 'Visible' },
  MaxWidth: { type: [String, Number], default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const emit = defineEmits(['Loaded', 'update:IsFullWindow']);
const { t } = useI18n();
const instance = getCurrentInstance();
const slots = useSlots();
const rootRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const setVideoElement = (element: unknown) => { videoRef.value = element instanceof HTMLVideoElement ? element : null; };
const controlPanelRef = ref<HTMLElement | { $el: HTMLElement } | null>(null);
const setControlPanelElement = (element: unknown) => { controlPanelRef.value = element as HTMLElement | { $el: HTMLElement } | null; };
const controlPanelElement = () => {
  const panel = controlPanelRef.value;
  return panel && '$el' in panel ? panel.$el : panel;
};
const activeStretch = ref(String(resolveXamlValue(props.Stretch, instance)));
const isPlaying = ref(false);
const muted = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volumePercent = ref(50);
const mediaError = ref(false);
const isBuffering = ref(false);
const isMediaLoading = ref(false);
const isSourcePreparing = ref(false);
const playbackUri = ref('');
const isVolumeFlyoutOpen = ref(false);
const fullWindowState = ref(false);
const castRequestPending = ref(false);
const castFeedbackKey = ref('');
const castFeedbackOpen = ref(false);
const controlsVisible = ref(true);
const isEnabled = computed(() => {
  const value = resolveXamlValue(props.IsEnabled, instance);
  return value !== false && value !== 'False' && value !== 'false';
});
const hasVideoFrame = ref(false);
const seekMaximum = computed(() => duration.value || 1);
const transportLoading = computed(() => isBuffering.value || isMediaLoading.value);
const volumeLabel = computed(() => t('text.volume'));
const muteLabel = computed(() => muted.value ? t('text.unmute') : t('text.mute'));
const playLabel = computed(() => isPlaying.value ? t('text.pause') : t('text.play'));
const zoomLabel = computed(() => t('text.aspect-ratio'));
const castLabel = computed(() => t('text.cast'));
const castFeedbackText = computed(() => castFeedbackKey.value ? t(castFeedbackKey.value) : '');
const fullWindowLabel = computed(() => t(fullWindowState.value ? 'text.exit-full-screen' : 'text.full-screen'));
const fullWindowSymbol = computed(() => fullWindowState.value ? 'BackToWindow' : 'FullScreen');
const mediaErrorText = computed(() => t('text.media-failed'));
const elapsedTimeText = computed(() => formatTime(currentTime.value));
const remainingTimeText = computed(() => duration.value > 0 ? formatTime(Math.floor(duration.value) - Math.floor(currentTime.value)) : '');
const transportControlsLabel = computed(() => t('text.media-transport-controls'));
const TransportControls = defineComponent({
  name: 'MediaPlayerTransportControls',
  setup(_, { slots }) {
    const templateInstance = getCurrentInstance();
    return () => h(Fragment, normalizeXamlNodes(slots.default?.() ?? [], templateInstance));
  }
});
const controlPanelPointerOver = ref(false);
const controlPanelPointerPressed = ref(false);
const controlPanelHasFocus = ref(false);
const rootPointerPressed = ref(false);
let hideControlsTimer: number | null = null;
let pointerMoveEndTimer: number | null = null;
let mediaLoadTimer: number | null = null;
let castRequestVersion = 0;
let remotePlayback: RemotePlayback | null = null;
let transportSizeObserver: ResizeObserver | null = null;
let commandArrangeFrame = 0;
const commandDropoutOrder: Record<string, number> = {
  RewindButton: 1, FastForwardButton: 1, RepeatButton: 1,
  PreviousTrackButton: 3, NextTrackButton: 3,
  SkipBackwardButton: 5, SkipForwardButton: 5, StopButton: 7,
  ZoomButton: 9, PlaybackRateButton: 10, CastButton: 11,
  FullWindowButton: 17, VolumeMuteButton: 19, PlayPauseButton: 23
};
const arrangeTransportCommands = () => {
  commandArrangeFrame = 0;
  const bar = rootRef.value?.querySelector<HTMLElement>('.win-media-command-bar');
  if (!bar) return;
  const buttons = Array.from(bar.querySelectorAll<HTMLElement>('button[data-template-part]'));
  for (const button of buttons) button.removeAttribute('data-media-dropout');
  const visible = () => buttons.filter((button) => getComputedStyle(button).display !== 'none');
  const fits = () => {
    const shown = visible();
    const total = shown.reduce((width, button) => width + button.getBoundingClientRect().width, 0);
    if (isCompact.value) return total <= bar.clientWidth;
    const center = shown.filter((button) => button.closest('.win-media-command-center')).length * 40;
    const left = shown.filter((button) => button.closest('.win-media-command-left')).length * 40;
    const right = shown.filter((button) => button.closest('.win-media-command-right')).length * 40;
    return total <= bar.clientWidth && center <= bar.clientWidth - 2 * Math.max(left, right);
  };
  for (const order of [...new Set(Object.values(commandDropoutOrder))].sort((a, b) => a - b)) {
    if (fits()) break;
    for (const button of visible()) {
      if (commandDropoutOrder[button.dataset.templatePart || ''] === order) button.setAttribute('data-media-dropout', 'true');
    }
  }
};
const scheduleCommandArrangement = () => {
  if (commandArrangeFrame) cancelAnimationFrame(commandArrangeFrame);
  commandArrangeFrame = requestAnimationFrame(arrangeTransportCommands);
};
let scrubbing = false;
let resumeAfterScrubbing = false;
const isProgressSliderTarget = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest('.win-media-progress-slider'));
const beginScrubbing = () => {
  if (scrubbing || !canSeek.value) return;
  scrubbing = true;
  resumeAfterScrubbing = Boolean(videoRef.value && !videoRef.value.paused);
  videoRef.value?.pause();
};
const endScrubbing = () => {
  if (!scrubbing) return;
  scrubbing = false;
  if (resumeAfterScrubbing && canPlay.value) videoRef.value?.play().catch(() => {});
  resumeAfterScrubbing = false;
};
const onTransportKeyDown = (event: KeyboardEvent) => {
  if (isProgressSliderTarget(event.target) && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) beginScrubbing();
};
const onTransportKeyUp = (event: KeyboardEvent) => {
  if (isProgressSliderTarget(event.target)) endScrubbing();
};
const clearPointerState = () => {
  rootPointerPressed.value = false;
  controlPanelPointerPressed.value = false;
  endScrubbing();
  startControlPanelHideTimer();
};

const cssLength = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return undefined;
  return typeof value === 'number' || /^-?\d+(\.\d+)?$/.test(String(value).trim())
    ? `${value}px`
    : String(value);
};

const mediaUri = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const source = value as { UriSource?: unknown; Uri?: unknown; Source?: unknown; CurrentItem?: unknown };
    if (source.CurrentItem && source.CurrentItem !== value) return mediaUri(source.CurrentItem);
    if (source.Source && source.Source !== value) return mediaUri(source.Source);
    return String(source.UriSource || source.Uri || '');
  }
  return '';
};

const sourceValue = computed(() => resolveXamlValue(props.Source, instance));
const sourceStream = computed(() => {
  const value = sourceValue.value;
  return value && typeof value === 'object' && typeof (value as MediaStream).getVideoTracks === 'function'
    ? value as MediaStream
    : null;
});
const sourceUri = computed(() => sourceStream.value ? '' : mediaUri(sourceValue.value));
const posterUri = computed(() => mediaUri(resolveXamlValue(props.PosterSource, instance)));
const autoPlayEnabled = computed(() => {
  const value = resolveXamlValue(props.AutoPlay, instance);
  return value === true || value === 'True' || value === 'true';
});
const nestedTransportControls = computed(() => {
  const result: Record<string, unknown> = {};
  const visit = (nodes: unknown[]) => {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue;
      const vnode = node as { type?: { __mediaTransportControlsProperty?: boolean }; props?: Record<string, unknown>; children?: { default?: () => unknown[] } };
      if (vnode.type?.__mediaTransportControlsProperty) {
        const children = vnode.children?.default?.() ?? [];
        const child = children.find((item) => item && typeof item === 'object' && (item as { type?: { __mediaTransportControls?: boolean } }).type?.__mediaTransportControls) as { props?: Record<string, unknown> } | undefined;
        Object.assign(result, child?.props ?? vnode.props ?? {});
      } else if (vnode.type === Fragment && Array.isArray(vnode.children)) {
        visit(vnode.children as unknown[]);
      }
    }
  };
  visit(slots.default?.() ?? []);
  return result;
});
const transport = computed(() => Object.fromEntries(Object.entries({
  ...mediaTransportControlDefaults, ...nestedTransportControls.value, ...(resolveXamlValue(props.TransportControls, instance) as Record<string, unknown> || {})
}).map(([name, value]) => [name, resolveXamlValue(value, instance)])));
const isSeekBarVisible = computed(() => transport.value.IsSeekBarVisible !== false);
const isVolumeButtonVisible = computed(() => transport.value.IsVolumeButtonVisible !== false);
const isZoomButtonVisible = computed(() => transport.value.IsZoomButtonVisible !== false);
const isFullWindowButtonVisible = computed(() => transport.value.IsFullWindowButtonVisible !== false);
const isCompact = computed(() => transport.value.IsCompact === true);
const controlPanelHeight = computed(() => isCompact.value ? '48' : '');
const controlPanelPadding = computed(() => isCompact.value ? '3' : '0');
const progressSliderMargin = computed(() => isCompact.value ? '12,-1,8,1' : '7,2,7,1');
const timeTextVisibility = computed(() => isCompact.value ? 'Collapsed' : 'Visible');
const compactPlayVisibility = computed(() => isCompact.value ? 'Visible' : 'Collapsed');
const normalPlayVisibility = computed(() => isCompact.value ? 'Collapsed' : 'Visible');
const commandColumn = computed(() => isCompact.value ? 2 : 1);
const commandRow = computed(() => isCompact.value ? 1 : 2);
const commandBarMargin = computed(() => isCompact.value ? '0' : '0,3');
// Device discovery can return false even when the platform provides a casting
// picker. Keep the command available and let that picker report availability.
const isCastButtonVisible = computed(() => !sourceStream.value);
const areTransportControlsEnabled = computed(() => {
  const value = resolveXamlValue(props.AreTransportControlsEnabled, instance);
  return value === true || value === 'True' || value === 'true';
});
const canPlay = computed(() => Boolean((sourceUri.value || sourceStream.value) && !mediaError.value && !isSourcePreparing.value && isEnabled.value));
const canSeek = computed(() => Boolean(canPlay.value && duration.value > 0 && transport.value.IsSeekEnabled));
const canChangeVolume = computed(() => Boolean(canPlay.value && transport.value.IsVolumeEnabled));
const canZoom = computed(() => Boolean(canPlay.value && transport.value.IsZoomEnabled));
const canRequestCast = computed(() => canPlay.value && !sourceStream.value && !castRequestPending.value);
const canChangeFullWindow = computed(() => isEnabled.value && transport.value.IsFullWindowEnabled !== false
  && Boolean(rootRef.value?.requestFullscreen) && document.fullscreenEnabled !== false);
const transportFlag = (name: string) => transport.value[name] === true;
const supportsNativePlaybackRate = (rate: number) => {
  if (typeof document === 'undefined') return false;
  const probe = document.createElement('video');
  try { probe.playbackRate = rate; return probe.playbackRate === rate; }
  catch { return false; }
};
const supportsForwardRate = supportsNativePlaybackRate(2);
const supportsReverseRate = supportsNativePlaybackRate(-2);
const allowsRateFallback = computed(() => transport.value.FastPlayFallbackBehaviour === 'Skip');
const isStopButtonVisible = computed(() => transportFlag('IsStopButtonVisible'));
const isSkipBackwardButtonVisible = computed(() => transportFlag('IsSkipBackwardButtonVisible'));
const isSkipForwardButtonVisible = computed(() => transportFlag('IsSkipForwardButtonVisible'));
const isFastRewindButtonVisible = computed(() => transportFlag('IsFastRewindButtonVisible') && (supportsReverseRate || transport.value.FastPlayFallbackBehaviour !== 'Hide'));
const isFastForwardButtonVisible = computed(() => transportFlag('IsFastForwardButtonVisible') && (supportsForwardRate || transport.value.FastPlayFallbackBehaviour !== 'Hide'));
const isPreviousTrackButtonVisible = computed(() => transportFlag('IsPreviousTrackButtonVisible'));
const isNextTrackButtonVisible = computed(() => transportFlag('IsNextTrackButtonVisible'));
const isPlaybackRateButtonVisible = computed(() => transportFlag('IsPlaybackRateButtonVisible'));
const isRepeatButtonVisible = computed(() => transportFlag('IsRepeatButtonVisible'));
const canStop = computed(() => canPlay.value && transportFlag('IsStopEnabled'));
const canSkipBackward = computed(() => canPlay.value && duration.value > 0 && transportFlag('IsSkipBackwardEnabled'));
const canSkipForward = computed(() => canPlay.value && duration.value > 0 && transportFlag('IsSkipForwardEnabled'));
const canFastRewind = computed(() => canPlay.value && isPlaying.value && duration.value > 0 && transportFlag('IsFastRewindEnabled') && (supportsReverseRate || allowsRateFallback.value));
const canFastForward = computed(() => canPlay.value && isPlaying.value && duration.value > 0 && transportFlag('IsFastForwardEnabled') && (supportsForwardRate || allowsRateFallback.value));
const canChangePlaybackRate = computed(() => canPlay.value && !sourceStream.value && transportFlag('IsPlaybackRateEnabled'));
const canRepeat = computed(() => canPlay.value && !sourceStream.value && transportFlag('IsRepeatEnabled'));
type PlaybackListSource = {
  MoveNext?: () => unknown;
  MovePrevious?: () => unknown;
  CurrentItemIndex?: number;
  CurrentItem?: unknown;
  Items?: unknown[];
  AutoRepeatEnabled?: boolean;
};
const playbackList = computed(() => {
  const value = sourceValue.value;
  return value && typeof value === 'object' ? value as PlaybackListSource : null;
});
const canMoveNext = computed(() => canPlay.value && typeof playbackList.value?.MoveNext === 'function'
  && (!playbackList.value.Items || playbackList.value.AutoRepeatEnabled || Number(playbackList.value.CurrentItemIndex ?? 0) < playbackList.value.Items.length - 1));
const canMovePrevious = computed(() => canPlay.value && typeof playbackList.value?.MovePrevious === 'function'
  && (!playbackList.value.Items || playbackList.value.AutoRepeatEnabled || Number(playbackList.value.CurrentItemIndex ?? 0) > 0));
const playbackRate = ref(1);
const trickPlaybackRate = ref(0);
let originalPlaybackRate = 1;
const repeatMode = ref<'None' | 'One' | 'All'>('None');
const isLooping = computed(() => repeatMode.value !== 'None');
const repeatGlyph = computed(() => repeatMode.value === 'One' ? '\uE8ED' : '\uE8EE');
const isRateFlyoutOpen = ref(false);
type AttachedFlyout = { ShowAt: (target?: unknown) => void; Hide: () => void };
const rateFlyoutRef = ref<AttachedFlyout | null>(null);
const volumeFlyoutRef = ref<AttachedFlyout | null>(null);
const castFeedbackFlyoutRef = ref<AttachedFlyout | null>(null);
const stopLabel = computed(() => t('media.stop'));
const skipBackwardLabel = computed(() => t('media.skip-backward'));
const skipForwardLabel = computed(() => t('media.skip-forward'));
const previousTrackLabel = computed(() => t('media.previous-track'));
const nextTrackLabel = computed(() => t('media.next-track'));
const fastRewindLabel = computed(() => trickPlaybackRate.value < 0 ? t('media.rewind-rate', { rate: Math.abs(trickPlaybackRate.value) }) : t('media.rewind'));
const fastForwardLabel = computed(() => trickPlaybackRate.value > 0 ? t('media.fast-forward-rate', { rate: trickPlaybackRate.value }) : t('media.fast-forward'));
const repeatLabel = computed(() => t(`media.repeat-${repeatMode.value.toLowerCase()}`));
const playbackRateLabel = computed(() => t('media.playback-rate'));
const playbackRateText = computed(() => t('media.playback-rate-value', { rate: playbackRate.value }));
const quarterSpeedLabel = computed(() => t('media.playback-rate-value', { rate: 0.25 }));
const halfSpeedLabel = computed(() => t('media.playback-rate-value', { rate: 0.5 }));
const normalSpeedLabel = computed(() => t('media.playback-rate-normal'));
const oneAndHalfSpeedLabel = computed(() => t('media.playback-rate-value', { rate: 1.5 }));
const doubleSpeedLabel = computed(() => t('media.playback-rate-value', { rate: 2 }));
const isQuarterSpeed = computed(() => playbackRate.value === 0.25);
const isHalfSpeed = computed(() => playbackRate.value === 0.5);
const isNormalSpeed = computed(() => playbackRate.value === 1);
const isOneAndHalfSpeed = computed(() => playbackRate.value === 1.5);
const isDoubleSpeed = computed(() => playbackRate.value === 2);
const syncOptionalPlaybackState = () => {
  const video = videoRef.value;
  if (!video) return;
  playbackRate.value = video.playbackRate;
  if (video.loop) repeatMode.value = 'One';
  else if (repeatMode.value === 'One') repeatMode.value = 'None';
};
const resetTrickPlayback = () => {
  const video = videoRef.value;
  if (trickPlaybackRate.value && video) video.playbackRate = originalPlaybackRate;
  trickPlaybackRate.value = 0;
};
const stopPlayback = () => {
  const video = videoRef.value;
  if (!video || !canStop.value) return;
  resetTrickPlayback();
  video.pause();
  if (Number.isFinite(video.duration)) video.currentTime = 0;
  syncFromVideo();
  showControls();
};
const skipBy = (seconds: number) => {
  const video = videoRef.value;
  if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
  video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  syncFromVideo();
  showControls();
};
const skipBackward = () => { if (canSkipBackward.value) skipBy(-10); };
const skipForward = () => { if (canSkipForward.value) skipBy(30); };
const enterTrickPlayback = (direction: -1 | 1) => {
  const video = videoRef.value;
  if (!video || !(direction > 0 ? canFastForward.value : canFastRewind.value)) return;
  const rates = [2, 4, 8, 16];
  if (!trickPlaybackRate.value) originalPlaybackRate = video.playbackRate;
  const previous = trickPlaybackRate.value * direction > 0 ? Math.abs(trickPlaybackRate.value) : 0;
  const rate = rates[(rates.indexOf(previous) + 1) % rates.length] * direction;
  try {
    video.playbackRate = rate;
    trickPlaybackRate.value = rate;
    video.play().catch(() => {});
  } catch {
    // Browsers that reject reverse/fast rates use WinUI's documented Skip
    // fallback. Disable and Hide are applied to the button beforehand.
    if (transport.value.FastPlayFallbackBehaviour === 'Skip') skipBy(direction > 0 ? 30 : -10);
  }
  syncOptionalPlaybackState();
  showControls();
};
const fastRewind = () => enterTrickPlayback(-1);
const fastForward = () => enterTrickPlayback(1);
const setPlaybackSpeed = (rate: number) => {
  const video = videoRef.value;
  if (!video || !canChangePlaybackRate.value) return;
  resetTrickPlayback();
  video.playbackRate = rate;
  playbackRate.value = rate;
  rateFlyoutRef.value?.Hide();
};
const setQuarterSpeed = () => setPlaybackSpeed(0.25);
const setHalfSpeed = () => setPlaybackSpeed(0.5);
const setNormalSpeed = () => setPlaybackSpeed(1);
const setOneAndHalfSpeed = () => setPlaybackSpeed(1.5);
const setDoubleSpeed = () => setPlaybackSpeed(2);
const onRateFlyoutOpened = () => { isRateFlyoutOpen.value = true; isVolumeFlyoutOpen.value = true; };
const onRateFlyoutClosed = () => { isRateFlyoutOpen.value = false; isVolumeFlyoutOpen.value = false; };
const toggleRepeat = () => {
  const video = videoRef.value;
  if (!video || !canRepeat.value) return;
  const list = playbackList.value;
  const hasPlaylist = typeof list?.MoveNext === 'function';
  repeatMode.value = repeatMode.value === 'None' ? 'One' : repeatMode.value === 'One' && hasPlaylist ? 'All' : 'None';
  video.loop = repeatMode.value === 'One';
  if (hasPlaylist && list) list.AutoRepeatEnabled = repeatMode.value === 'All';
};
const movePlaybackTrack = (direction: -1 | 1) => {
  const list = playbackList.value;
  const method = direction > 0 ? list?.MoveNext : list?.MovePrevious;
  if (!list || typeof method !== 'function' || !(direction > 0 ? canMoveNext.value : canMovePrevious.value)) return;
  resetTrickPlayback();
  method.call(list);
  void applySource();
  showControls();
};
const movePreviousTrack = () => movePlaybackTrack(-1);
const moveNextTrack = () => movePlaybackTrack(1);
watch(sourceValue, () => {
  resetTrickPlayback();
  repeatMode.value = videoRef.value?.loop ? 'One' : 'None';
});
onBeforeUnmount(resetTrickPlayback);
const showAndHideAutomatically = computed(() => transport.value.ShowAndHideAutomatically !== false);
const stretchValue = computed(() => ({
  None: 'none',
  Fill: 'fill',
  Uniform: 'contain',
  UniformToFill: 'cover'
}[activeStretch.value] || 'contain'));
const videoStyle = computed(() => ({ objectFit: stretchValue.value as 'none' | 'fill' | 'contain' | 'cover' }));
const isFullWindowActive = computed(() => fullWindowState.value);
const rootStyle = computed(() => {
  const transform = resolveXamlValue(props.RenderTransform, instance) as { ScaleX?: number; ScaleY?: number } | null;
  const origin = resolveXamlValue(props.RenderTransformOrigin, instance);
  const point = typeof origin === 'string' ? origin.split(',').map(Number) : [Number((origin as { X?: number })?.X || 0), Number((origin as { Y?: number })?.Y || 0)];
  return {
    width: cssLength(resolveXamlValue(props.Width, instance)),
    height: cssLength(resolveXamlValue(props.Height, instance)),
    minWidth: cssLength(resolveXamlValue(props.MinWidth, instance)),
    minHeight: cssLength(resolveXamlValue(props.MinHeight, instance)),
    maxWidth: isFullWindowActive.value ? undefined : cssLength(resolveXamlValue(props.MaxWidth, instance)),
    maxHeight: cssLength(resolveXamlValue(props.MaxHeight, instance)),
    margin: xamlThickness(resolveXamlValue(props.Margin, instance)),
    display: resolveXamlValue(props.Visibility, instance) === 'Collapsed' ? 'none' : undefined,
    justifySelf: ({ Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' })[String(resolveXamlValue(props.HorizontalAlignment, instance))] || undefined,
    alignSelf: ({ Top: 'start', Center: 'center', Bottom: 'end', Stretch: 'stretch' })[String(resolveXamlValue(props.VerticalAlignment, instance))] || undefined,
    transform: transform ? `scale(${Number(transform.ScaleX ?? 1)}, ${Number(transform.ScaleY ?? 1)})` : undefined,
    transformOrigin: `${(point[0] || 0) * 100}% ${(point[1] || 0) * 100}%`
  };
});
const playGlyph = computed(() => isPlaying.value ? '\uF8AE' : '\uF5B0');
const volumeGlyph = computed(() => muted.value || volumePercent.value === 0 ? '\uE74F' : '\uE767');

const syncFromVideo = (event?: Event) => {
  const current = event?.currentTarget;
  if (current instanceof HTMLVideoElement && videoRef.value !== current) videoRef.value = current;
  const video = videoRef.value || (current instanceof HTMLVideoElement ? current : null);
  if (!video) return;
  currentTime.value = video.currentTime || 0;
  duration.value = Number.isFinite(video.duration) ? video.duration : 0;
  hasVideoFrame.value = video.readyState >= 2 && !mediaError.value;
  muted.value = video.muted;
  volumePercent.value = Math.round((video.volume || 0) * 100);
};

const clearMediaLoadTimer = () => {
  if (mediaLoadTimer) window.clearTimeout(mediaLoadTimer);
  mediaLoadTimer = null;
};

const onMediaLoaded = (event?: Event) => {
  syncFromVideo(event);
  clearMediaLoadTimer();
  mediaError.value = false;
  isBuffering.value = false;
  isMediaLoading.value = false;
  syncFromVideo();
};

const onBufferingStarted = () => {
  isBuffering.value = true;
  const video = videoRef.value;
  if (video && video.readyState >= 2) isMediaLoading.value = false;
  showControls();
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
};

const onMediaEmptied = () => {
  hasVideoFrame.value = false;
  currentTime.value = 0;
  duration.value = 0;
  isPlaying.value = false;
};

const onBufferingEnded = () => {
  clearMediaLoadTimer();
  isBuffering.value = false;
  isMediaLoading.value = false;
  startControlPanelHideTimer();
};

const onMediaError = () => {
  if (mediaError.value || isSourcePreparing.value) return;
  clearMediaLoadTimer();
  mediaError.value = true;
  hasVideoFrame.value = false;
  isPlaying.value = false;
  isBuffering.value = false;
  isMediaLoading.value = false;
  showControls();
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
  hideControlsTimer = null;
};

const onPlay = () => {
  isPlaying.value = true;
  showControls();
};

const onPause = () => {
  isPlaying.value = false;
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
  hideControlsTimer = null;
  controlsVisible.value = true;
};

const togglePlay = () => {
  const video = videoRef.value;
  if (!video || !canPlay.value) return;
  if (trickPlaybackRate.value) {
    resetTrickPlayback();
    video.play().catch(() => {});
    return;
  }
  if (video.paused) video.play().catch(() => {});
  else video.pause();
};

const onVolumeFlyoutOpened = () => { isVolumeFlyoutOpen.value = true; };
const onVolumeFlyoutClosed = () => { isVolumeFlyoutOpen.value = false; };

const toggleMute = () => {
  const video = videoRef.value;
  if (!video || !canChangeVolume.value) return;
  video.muted = !video.muted;
  muted.value = video.muted;
  if (!video.muted && video.volume === 0) {
    video.volume = 1;
    volumePercent.value = 100;
  }
};

const setVolume = (_sender: unknown, args: { NewValue: number }) => {
  const video = videoRef.value;
  if (!video || !canChangeVolume.value || !Number.isFinite(args?.NewValue)) return;
  const nextValue = Math.max(0, Math.min(100, args.NewValue));
  video.volume = nextValue / 100;
  video.muted = nextValue === 0;
  volumePercent.value = nextValue;
  muted.value = video.muted;
};

const isRootFullscreen = () => {
  const root = rootRef.value;
  return Boolean(root && (document.fullscreenElement === root || root.matches(':fullscreen')));
};

const syncFullscreenState = () => {
  const nextState = isRootFullscreen();
  const changed = fullWindowState.value !== nextState;
  fullWindowState.value = nextState;
  if (!nextState) isVolumeFlyoutOpen.value = false;
  if (changed) emit('update:IsFullWindow', nextState);
  updateXamlBinding(props.IsFullWindow, nextState, instance);
};

const enterFullWindow = async () => {
  const root = rootRef.value;
  if (!root?.requestFullscreen) return;
  try {
    await root.requestFullscreen();
  } catch {
    // Keep the actual browser fullscreen element authoritative on rejection.
  } finally {
    syncFullscreenState();
  }
};

const exitFullWindow = async () => {
  try {
    if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
  } catch {
    // The browser may already have left fullscreen (for example through Esc).
  } finally {
    syncFullscreenState();
  }
};

const onFullscreenChanged = () => syncFullscreenState();
const toggleFullWindow = () => {
  if (!canChangeFullWindow.value) return;
  if (isRootFullscreen()) void exitFullWindow();
  else void enterFullWindow();
};

const seekTo = (_sender: unknown, args: { NewValue: number }) => {
  const video = videoRef.value;
  if (!video || !canSeek.value || !Number.isFinite(args?.NewValue)) return;
  video.currentTime = Math.max(0, Math.min(duration.value, args.NewValue));
  syncFromVideo();
};

const toggleStretch = () => {
  const values = ['Uniform', 'UniformToFill'];
  activeStretch.value = values[(values.indexOf(activeStretch.value) + 1) % values.length];
};

const postCastRequestToWebView = () => {
  const hostWindow = window as Window & {
    chrome?: { webview?: { postMessage?: (message: unknown) => void } };
  };
  const webview = hostWindow.chrome?.webview;
  if (!webview?.postMessage) return false;
  webview.postMessage({
    source: 'WinUIonWeb',
    type: 'mediaCastRequested',
    sourceUri: sourceUri.value || videoRef.value?.currentSrc
  });
  return true;
};

const onCastRequested = async () => {
  const video = videoRef.value;
  if (!video || !canRequestCast.value) return;
  const requestVersion = ++castRequestVersion;
  castRequestPending.value = true;
  castFeedbackKey.value = '';
  let failureKey = 'text.browser-does-not-support-casting';
  try {
    const policyDocument = document as Document & {
      permissionsPolicy?: { features?: () => string[]; allowsFeature: (feature: string) => boolean };
      featurePolicy?: { features?: () => string[]; allowsFeature: (feature: string) => boolean };
    };
    const policy = policyDocument.permissionsPolicy || policyDocument.featurePolicy;
    if (policy?.features?.().includes('remote-playback') && policy.allowsFeature('remote-playback') === false) {
      failureKey = 'text.casting-permission-denied';
    } else if (navigator.userActivation && !navigator.userActivation.isActive) {
      failureKey = 'text.casting-user-activation-required';
    } else {
      const remote = video.remote;
      if (remote?.prompt) {
        try {
          await remote.prompt();
          return;
        } catch (error) {
          if (requestVersion !== castRequestVersion) return;
          const name = (error as { name?: string })?.name;
          // User cancellation must not start another casting request in a host.
          if (name === 'AbortError') return;
          if (name === 'SecurityError') {
            failureKey = 'text.casting-permission-denied';
          } else if (name === 'NotAllowedError') {
            // RemotePlayback also reports dismissing the native picker as
            // NotAllowedError; it does not identify a missing permission grant.
            failureKey = 'text.casting-request-not-approved';
          } else if (name === 'InvalidAccessError') {
            failureKey = 'text.casting-user-activation-required';
          } else {
            failureKey = name === 'NotFoundError' ? 'text.no-casting-devices-found' : 'text.casting-is-not-available';
            if (postCastRequestToWebView()) return;
          }
        }
      } else {
        const airplayVideo = video as HTMLVideoElement & { webkitShowPlaybackTargetPicker?: () => void };
        if (airplayVideo.webkitShowPlaybackTargetPicker) {
          airplayVideo.webkitShowPlaybackTargetPicker();
          return;
        }
        if (postCastRequestToWebView()) return;
      }
    }
  } catch {
    failureKey = 'text.casting-is-not-available';
  } finally {
    if (requestVersion === castRequestVersion) castRequestPending.value = false;
  }
  // Create the feedback flyout only after the native request fails. Its
  // attachment must not open an empty flyout ahead of the system picker.
  await nextTick();
  if (requestVersion === castRequestVersion) castFeedbackKey.value = failureKey;
};
const onCastFeedbackClosed = () => { castFeedbackKey.value = ''; };
watch(castFeedbackKey, async (key) => {
  castFeedbackOpen.value = false;
  if (!key) return;
  // Mount the attached flyout before transitioning to its open state so its
  // normal positioning pass measures the casting button and rendered content.
  await nextTick();
  if (castFeedbackKey.value === key) {
    castFeedbackOpen.value = true;
    castFeedbackFlyoutRef.value?.ShowAt();
  }
});

const attachRemotePlayback = () => {
  const video = videoRef.value;
  if (!video || !('remote' in video)) return;
  remotePlayback = video.remote;
  remotePlayback.onconnecting = () => showControls();
  remotePlayback.onconnect = () => showControls();
  remotePlayback.ondisconnect = () => showControls();
};

const detachRemotePlayback = () => {
  if (!remotePlayback) return;
  remotePlayback.onconnecting = null;
  remotePlayback.onconnect = null;
  remotePlayback.ondisconnect = null;
  remotePlayback = null;
};

const showControls = () => {
  controlsVisible.value = true;
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
  if (pointerMoveEndTimer) window.clearTimeout(pointerMoveEndTimer);
  pointerMoveEndTimer = window.setTimeout(() => {
    pointerMoveEndTimer = null;
    startControlPanelHideTimer();
  }, 0);
};

const startControlPanelHideTimer = () => {
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
  hideControlsTimer = null;
  if (!showAndHideAutomatically.value || !isPlaying.value || isBuffering.value || mediaError.value || controlPanelPointerOver.value || controlPanelPointerPressed.value || controlPanelHasFocus.value || rootPointerPressed.value || isVolumeFlyoutOpen.value || castRequestPending.value || castFeedbackKey.value) return;
  hideControlsTimer = window.setTimeout(() => {
    controlsVisible.value = false;
    hideControlsTimer = null;
  }, 3000);
};

const onControlPanelEntered = () => {
  controlPanelPointerOver.value = true;
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
};

const onControlPanelExited = () => {
  controlPanelPointerOver.value = false;
  startControlPanelHideTimer();
};

const onControlPanelPressed = () => {
  controlPanelPointerPressed.value = true;
  controlPanelHasFocus.value = false;
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
};

const onControlPanelReleased = () => {
  controlPanelPointerPressed.value = false;
  startControlPanelHideTimer();
};

const onControlPanelCaptureLost = (event: PointerEvent) => {
  rootPointerPressed.value = false;
  controlPanelPointerPressed.value = false;
  const point = event && Number.isFinite(event.clientX) && Number.isFinite(event.clientY) ? event : null;
  const hit = point ? document.elementFromPoint(point.clientX, point.clientY) : null;
  controlPanelPointerOver.value = Boolean(hit && controlPanelElement()?.contains(hit));
  if (!controlPanelPointerOver.value) startControlPanelHideTimer();
};

const onControlPanelFocusEntered = () => {
  if (controlPanelPointerPressed.value) return;
  controlPanelHasFocus.value = true;
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
};

const onControlPanelFocusExited = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget;
  if (nextTarget instanceof Node && (event.currentTarget as HTMLElement).contains(nextTarget)) return;
  controlPanelHasFocus.value = false;
  endScrubbing();
  startControlPanelHideTimer();
};

const onRootPressed = (event: PointerEvent) => {
  rootPointerPressed.value = true;
  controlPanelHasFocus.value = false;
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
  showControls();
  if (isProgressSliderTarget(event.target)) beginScrubbing();
};

const onRootReleased = () => {
  rootPointerPressed.value = false;
  endScrubbing();
  startControlPanelHideTimer();
};

const onRootCaptureLost = () => {
  rootPointerPressed.value = false;
  startControlPanelHideTimer();
};

const onRootExited = () => {
  rootPointerPressed.value = false;
  controlPanelPointerOver.value = false;
  startControlPanelHideTimer();
};

const onEnded = () => {
  isPlaying.value = false;
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
  hideControlsTimer = null;
  controlsVisible.value = true;
};

const formatTime = (value: unknown) => {
  const safe = Math.max(0, Math.floor(Number(value) || 0)) % 86400;
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = String(safe % 60).padStart(2, '0');
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${seconds}`;
};

let sourceVersion = 0;
let decodedObjectUrl = '';
const applySource = async () => {
  const version = ++sourceVersion;
  scrubbing = false;
  resumeAfterScrubbing = false;
  clearMediaLoadTimer();
  mediaError.value = false;
  hasVideoFrame.value = false;
  currentTime.value = 0;
  duration.value = 0;
  isPlaying.value = false;
  isBuffering.value = Boolean(sourceUri.value || sourceStream.value);
  isMediaLoading.value = Boolean(sourceUri.value || sourceStream.value);
  isSourcePreparing.value = false;
  showControls();
  await nextTick();
  const video = videoRef.value;
  if (!video || version !== sourceVersion) return;
  video.pause();
  playbackUri.value = '';
  const stream = sourceStream.value;
  video.removeAttribute('src');
  video.srcObject = stream;
  if (decodedObjectUrl) URL.revokeObjectURL(decodedObjectUrl);
  decodedObjectUrl = '';
  video.muted = stream ? true : muted.value;
  if (!stream && sourceUri.value) {
    let uri = sourceUri.value;
    if (needsSoftwareMediaDecoder(uri, video)) {
      isSourcePreparing.value = true;
      try {
        const media = await getBrowserMediaSource(uri);
        if (version !== sourceVersion) return;
        decodedObjectUrl = URL.createObjectURL(media);
        uri = decodedObjectUrl;
      } catch {
        if (version !== sourceVersion) return;
        // Let the native element report a real failure if its compatibility
        // source could not be prepared, rather than simulating media events.
      } finally {
        if (version === sourceVersion) isSourcePreparing.value = false;
      }
    }
    if (version !== sourceVersion) return;
    playbackUri.value = uri;
    video.src = uri;
    video.load();
  } else if (!stream) video.load();
  if (autoPlayEnabled.value && (sourceStream.value || sourceUri.value)) {
    video.play().catch((error) => {
      if (version !== sourceVersion) return;
      if (error?.name === 'NotAllowedError') {
        video.muted = true;
        muted.value = true;
        video.play().catch(() => {});
        return;
      }
      if (version === sourceVersion && sourceStream.value && error?.name !== 'AbortError') video.dispatchEvent(new Event('error'));
    });
  }
};
let loadedElement: HTMLVideoElement | null = null;
const notifyLoaded = () => {
  if (!videoRef.value || loadedElement === videoRef.value) return;
  loadedElement = videoRef.value;
  videoRef.value.volume = 0.5;
  attachRemotePlayback();
  void applySource();
  const sender = { MediaPlayer: videoRef.value };
  emit('Loaded', sender, { OriginalSource: sender });
};
watch([sourceUri, sourceStream], applySource);
watch([sourceUri, sourceStream], () => {
  ++castRequestVersion;
  castRequestPending.value = false;
  castFeedbackKey.value = '';
});
watch(videoRef, (video) => {
  if (video) notifyLoaded();
}, { flush: 'post' });

watch(autoPlayEnabled, (value: boolean) => {
  if (value) videoRef.value?.play().catch(() => {});
  else videoRef.value?.pause();
});

watch(() => resolveXamlValue(props.IsFullWindow, instance), (value) => {
  if (value && !isRootFullscreen()) void enterFullWindow();
  else if (!value && isRootFullscreen()) void exitFullWindow();
});

watch(isVolumeFlyoutOpen, (isOpen) => {
  if (isOpen) showControls();
  else {
    volumeFlyoutRef.value?.Hide();
    startControlPanelHideTimer();
  }
});
watch([castRequestPending, castFeedbackKey], ([pending, feedback]) => {
  if (pending || feedback) showControls();
  else startControlPanelHideTimer();
});

watch(showAndHideAutomatically, (enabled) => {
  if (!enabled) {
    if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
    hideControlsTimer = null;
    controlsVisible.value = true;
  } else {
    startControlPanelHideTimer();
  }
});

watch(() => resolveXamlValue(props.Stretch, instance), (value) => {
  activeStretch.value = String(value);
});

onMounted(() => {
  transportSizeObserver = new ResizeObserver(scheduleCommandArrangement);
  if (rootRef.value) transportSizeObserver.observe(rootRef.value);
  window.addEventListener('pointerup', clearPointerState);
  window.addEventListener('pointercancel', clearPointerState);
  window.addEventListener('blur', clearPointerState);
  document.addEventListener('fullscreenchange', onFullscreenChanged);
  document.addEventListener('webkitfullscreenchange', onFullscreenChanged as EventListener);
  if (videoRef.value) {
    videoRef.value.muted = false;
    videoRef.value.volume = 0.5;
    notifyLoaded();
  }
  if (resolveXamlValue(props.IsFullWindow, instance) === true) void enterFullWindow();
});

onBeforeUnmount(() => {
  transportSizeObserver?.disconnect();
  if (commandArrangeFrame) cancelAnimationFrame(commandArrangeFrame);
  ++sourceVersion;
  ++castRequestVersion;
  window.removeEventListener('pointerup', clearPointerState);
  window.removeEventListener('pointercancel', clearPointerState);
  window.removeEventListener('blur', clearPointerState);
  if (videoRef.value) {
    videoRef.value.pause();
    videoRef.value.srcObject = null;
  }
  if (decodedObjectUrl) URL.revokeObjectURL(decodedObjectUrl);
  document.removeEventListener('fullscreenchange', onFullscreenChanged);
  document.removeEventListener('webkitfullscreenchange', onFullscreenChanged as EventListener);
  detachRemotePlayback();
  if (hideControlsTimer) window.clearTimeout(hideControlsTimer);
  if (pointerMoveEndTimer) window.clearTimeout(pointerMoveEndTimer);
  clearMediaLoadTimer();
});

provide(xamlScopeKey, {
  currentTime, seekMaximum, transportLoading, mediaError, volumePercent, volumeLabel, muteLabel, playLabel, zoomLabel, castLabel, castFeedbackText, castFeedbackOpen, fullWindowLabel, fullWindowSymbol,
  canPlay, canSeek, canChangeVolume, canZoom, canRequestCast, canChangeFullWindow,
  isCompact, isVolumeFlyoutOpen,
  controlPanelHeight, controlPanelPadding, progressSliderMargin, timeTextVisibility, compactPlayVisibility, normalPlayVisibility, commandColumn, commandRow, commandBarMargin,
  mediaErrorText, elapsedTimeText, remainingTimeText, transportControlsLabel, volumeGlyph, playGlyph,
  onControlPanelEntered, onControlPanelExited, onControlPanelPressed, onControlPanelReleased,
  onControlPanelCaptureLost, onControlPanelFocusEntered, onControlPanelFocusExited,
  isStopButtonVisible, isSkipBackwardButtonVisible, isSkipForwardButtonVisible, isFastRewindButtonVisible, isFastForwardButtonVisible,
  isPreviousTrackButtonVisible, isNextTrackButtonVisible, isPlaybackRateButtonVisible, isRepeatButtonVisible,
  canStop, canSkipBackward, canSkipForward, canFastRewind, canFastForward, canMovePrevious, canMoveNext, canChangePlaybackRate, canRepeat,
  stopLabel, skipBackwardLabel, skipForwardLabel, previousTrackLabel, nextTrackLabel, fastRewindLabel, fastForwardLabel, repeatLabel, playbackRateLabel, playbackRateText,
  quarterSpeedLabel, halfSpeedLabel, normalSpeedLabel, oneAndHalfSpeedLabel, doubleSpeedLabel,
  isLooping, repeatGlyph, isQuarterSpeed, isHalfSpeed, isNormalSpeed, isOneAndHalfSpeed, isDoubleSpeed,
  seekTo, setVolume, toggleMute, togglePlay, toggleStretch, toggleFullWindow, onCastRequested, onCastFeedbackClosed, onVolumeFlyoutOpened, onVolumeFlyoutClosed,
  stopPlayback, skipBackward, skipForward, fastRewind, fastForward, movePreviousTrack, moveNextTrack, toggleRepeat,
  setQuarterSpeed, setHalfSpeed, setNormalSpeed, setOneAndHalfSpeed, setDoubleSpeed, onRateFlyoutOpened, onRateFlyoutClosed
});
watch([transport, isCastButtonVisible, areTransportControlsEnabled], () => { void nextTick(scheduleCommandArrangement); }, { deep: true, flush: 'post' });
defineExpose({ MediaPlayer: videoRef });
</script>

<style>
.win-media-player-element,
.flyout-presenter:has(.win-media-volume-panel),
.flyout-presenter:has(.win-media-rate-panel) {
  --MediaTransportControlsPanelBackground: var(--AcrylicInAppFillColorDefaultBrush);
  --MediaTransportControlsFlyoutBackground: var(--AcrylicBackgroundFillColorDefaultBrush);
  --MediaTransportControlsBorderBrush: var(--SurfaceStrokeColorFlyoutBrush);
  --MediaTransportControlsFillMediaText: var(--TextFillColorPrimaryBrush);
  --MediaTransportControlsFillTimeElapsedText: var(--TextFillColorSecondaryBrush);
  --MTCHorizontalVolumeSliderWidth: 180px;
}

@font-face {
  font-family: 'WinUIOnWebIcons';
  src: url('../assets/Fonts/SEGOEICONS.TTF') format('truetype');
  font-display: block;
}

.win-media-player-element {
  position: relative;
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  box-sizing: border-box;
}

.win-media-player-element:fullscreen {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: block;
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
  background: #000;
}

.win-media-player-surface {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
  box-sizing: border-box;
}

.win-media-player-element:fullscreen .win-media-player-surface {
  width: 100%;
  height: 100%;
}

.win-media-player-video {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
  background: transparent;
}

.win-media-player-element:fullscreen .win-media-player-video {
  width: 100%;
  height: 100%;
  min-height: 0;
  aspect-ratio: auto;
}

.win-media-player-video.is-media-error { opacity: 0; }

.win-media-player-poster-fallback {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.win-media-player-element .win-media-transport-controls {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: flex !important;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 700ms linear;
}

.win-media-transport-controls.visible {
  opacity: 1;
  transition-duration: 300ms;
}

.win-media-transport-controls.visible .win-media-transport-panel { pointer-events: auto; }

.win-media-transport-panel {
  position: relative;
  isolation: isolate;
  width: min(720px, calc(100% - 24px));
  flex: 0 1 auto;
  align-self: auto !important;
  height: auto !important;
  min-width: min(296px, calc(100% - 24px)) !important;
  margin: 0 12px 12px;
  overflow: hidden;
  color: var(--MediaTransportControlsFillMediaText, var(--text-primary, currentColor));
  background: transparent;
  border: 1px solid var(--MediaTransportControlsBorderBrush, var(--surface-stroke-color-flyout, var(--stroke-surface-flyout, transparent)));
  border-radius: var(--overlay-corner-radius, 8px);
  box-sizing: border-box;
  transform: translateY(50px);
  transition: transform 700ms linear;
  display: block;
}

.win-media-control-panel-grid {
  display: grid;
  min-width: 0;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-rows: auto auto auto;
}

.win-media-transport-panel::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  content: '';
  background: var(--MediaTransportControlsPanelBackground, var(--flyout-bg, var(--layer-default, transparent)));
  border-radius: inherit;
}

.win-media-transport-controls.visible .win-media-transport-panel { transform: translateY(.5px); transition-duration: 300ms; }

.win-media-error {
  display: none !important;
  grid-column: 1 / -1;
  grid-row: 1;
  width: 320px;
  max-width: 100%;
  height: 96px;
  justify-self: center;
  align-self: center;
  box-sizing: border-box;
  padding: 12px;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
}

.win-media-error.visible { display: grid !important; }

.win-media-timeline-border {
  grid-column: 2;
  grid-row: 2;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.win-media-timeline-grid {
  display: grid;
  grid-template-rows: 35px 16px;
  width: 100%;
}

.win-media-progress-host {
  position: relative;
  width: 100%;
  height: 35px;
  padding: 0;
  box-sizing: border-box;
}

.win-media-progress-slider {
  display: block;
  width: auto;
  height: 32px;
  margin: 2px 7px 1px;
  box-sizing: border-box;
  /* The thumb extends past the track at both endpoints. The player panel
     owns the display boundary; this template border must not clip it. */
  overflow: visible;
}

.win-media-progress-slider > .win-slider-root { display: block; width: 100%; }
.win-media-progress-slider .win-slider { width: 100% !important; height: 32px !important; }

.win-media-loading-progress {
  position: absolute;
  top: 2px;
  left: 0;
  width: 100%;
  height: 4px;
  pointer-events: none;
}

.win-media-loading-progress > .win-progress-bar {
  display: block;
  width: 100%;
  height: 4px;
}

.win-media-time-text-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  height: 16px;
  margin: 0 7px 2px;
  color: var(--MediaTransportControlsFillTimeElapsedText, var(--text-secondary, currentColor));
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  line-height: 16px;
}

.win-media-time-text-grid [data-template-part='TimeElapsedElement'] { justify-self: start; }
.win-media-time-text-grid [data-template-part='TimeElapsedElement'],
.win-media-time-text-grid [data-template-part='TimeRemainingElement'] {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.win-media-time-text-grid [data-template-part='TimeElapsedElement'] { grid-column: 1; }
.win-media-time-text-grid [data-template-part='TimeRemainingElement'] { grid-column: 2; justify-self: end; text-align: right; }

.win-media-command-border {
  grid-column: 2;
  grid-row: 3;
  width: 100%;
  box-sizing: border-box;
}

.win-media-command-bar {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  min-height: 40px;
  margin: 3px 0;
  padding: 0;
  box-sizing: border-box;
}

.win-media-transport-controls.is-media-loading .win-media-progress-slider,
.win-media-transport-controls.is-media-loading .win-media-command-bar {
  opacity: 0;
  pointer-events: none;
}

.win-media-command-left,
.win-media-command-center,
.win-media-command-right {
  display: flex;
  align-items: center;
  min-width: 0;
}

.win-media-command-center {
  position: absolute;
  left: 50%;
  justify-content: center;
  transform: translateX(-50%);
}
.win-media-command-right { justify-content: flex-end; }
.win-media-compact-play { align-self: center; }
.win-media-transport-controls.is-compact .win-media-command-bar { min-height: 40px; }
.win-media-transport-controls.is-compact .win-media-progress-host { height: 40px; }
.win-media-transport-controls.is-compact .win-media-timeline-grid { align-self: center; }

.win-media-appbar-button,
.win-media-appbar-button.win-appbar-button {
  position: relative;
  display: inline-grid;
  place-items: stretch;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  margin: 0;
  padding: 0;
  color: inherit;
  background: transparent;
  border: 0;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
}

.win-media-appbar-button.win-appbar-button .appbar-button-inner-border {
  inset: 5px;
  border-radius: 4px;
}

.win-media-appbar-button.win-appbar-button .appbar-button-content-root {
  min-height: 40px;
  height: 40px;
  grid-template-columns: 1fr;
  grid-template-rows: 40px;
  align-content: center;
  align-items: center;
  justify-items: center;
}

.win-media-appbar-button.win-appbar-button .appbar-button-icon,
.win-media-appbar-button.win-appbar-button.label-collapsed .appbar-button-icon {
  grid-column: 1;
  grid-row: 1;
  width: 20px;
  height: 16px;
  margin: 0;
  place-self: center;
}
.win-media-appbar-button.win-appbar-button.label-collapsed,
.win-media-appbar-button.win-appbar-button.label-collapsed .appbar-button-content-root,
.win-media-appbar-button.win-appbar-button.compact,
.win-media-appbar-button.win-appbar-button.compact .appbar-button-content-root {
  min-height: 40px;
  height: 40px;
}
.win-media-appbar-button.win-appbar-button:focus-visible { outline: 2px solid currentColor; outline-offset: -2px; }
.win-media-appbar-button[data-media-dropout='true'] { display: none !important; }
.win-media-appbar-button[visibility='Collapsed'] { display: none !important; }

.win-media-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 16px;
  font-family: 'WinUIOnWebIcons';
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
}

.win-media-cast-feedback {
  max-width: min(280px, calc(100vw - 48px)) !important;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.win-media-volume-panel {
  display: flex;
  height: 64px;
  padding: 0;
  box-sizing: border-box;
  background: transparent;
}

.win-media-volume-slider {
  display: block;
  flex: 0 0 var(--MTCHorizontalVolumeSliderWidth, 180px);
  width: var(--MTCHorizontalVolumeSliderWidth, 180px);
  height: 32px;
  margin: 0;
}

.win-media-volume-slider .win-slider { width: 100% !important; height: 32px !important; }

.win-media-volume-value.win-text-block {
  display: block;
  flex: 0 0 24px;
  width: 24px;
  height: 16px;
  margin: 12px;
  color: var(--MediaTransportControlsFillMediaText, var(--text-primary, currentColor));
  font-size: 12px;
  line-height: 16px;
}

.flyout-presenter:has(.win-media-volume-panel) {
  min-width: 0;
  color: var(--text-primary);
  background: var(--MediaTransportControlsFlyoutBackground, var(--AcrylicBackgroundFillColorDefaultBrush));
  border-radius: var(--overlay-corner-radius, 8px);
}

.flyout-presenter:has(.win-media-volume-panel) .flyout-content-presenter { margin: 0; }
.flyout-presenter:has(.win-media-volume-panel) .flyout-scroll-viewer { max-height: none; }

</style>
