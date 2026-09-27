<script lang="ts">
import { defineComponent } from 'vue'

/**
 * MediaPlayerElement owns the transport-control template. This declaration
 * carries the official XAML dependency properties into that template without
 * adding an extra element to the media visual tree.
 *
 * Defaults follow MediaTransportControls::SetupDefaultProperties in
 * WinUI-Reference/dxaml/xcp/dxaml/lib/MediaTransportControls_partial.cpp.
 */
export const mediaTransportControlDefaults = {
  IsZoomButtonVisible: true,
  IsZoomEnabled: true,
  IsFullWindowButtonVisible: true,
  IsFullWindowEnabled: true,
  IsFastForwardButtonVisible: false,
  IsFastForwardEnabled: false,
  IsFastRewindButtonVisible: false,
  IsFastRewindEnabled: false,
  IsStopButtonVisible: false,
  IsStopEnabled: false,
  IsVolumeButtonVisible: true,
  IsVolumeEnabled: true,
  IsPlaybackRateButtonVisible: false,
  IsPlaybackRateEnabled: false,
  IsSeekBarVisible: true,
  IsSeekEnabled: true,
  IsCompact: false,
  IsSkipForwardButtonVisible: false,
  IsSkipForwardEnabled: false,
  IsSkipBackwardButtonVisible: false,
  IsSkipBackwardEnabled: false,
  IsNextTrackButtonVisible: false,
  IsPreviousTrackButtonVisible: false,
  FastPlayFallbackBehaviour: 'Skip',
  ShowAndHideAutomatically: true,
  IsRepeatEnabled: false,
  IsRepeatButtonVisible: false
} as const

export type MediaTransportControlProperty = keyof typeof mediaTransportControlDefaults

export default defineComponent({
  name: 'MediaTransportControls',
  __mediaTransportControls: true,
  inheritAttrs: false,
  props: Object.fromEntries(
    Object.entries(mediaTransportControlDefaults).map(([name, value]) => [
      name,
      { type: typeof value === 'boolean' ? [Boolean, String] : String, default: value }
    ])
  ),
  setup() {
    return () => null
  }
})
</script>
