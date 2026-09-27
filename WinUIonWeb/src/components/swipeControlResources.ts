export const swipeControlResources: Readonly<Record<string, string>> = Object.freeze({
  ButtonBackground: 'var(--ButtonBackground, var(--ControlFillColorDefaultBrush, var(--ctrl-fill-default)))',
  ButtonBackgroundThemeBrush: 'var(--ButtonBackground, var(--ctrl-fill-default))',
  AppBarItemForegroundThemeBrush: 'var(--TextFillColorPrimaryBrush, var(--text-primary))',
  SwipeItemBackground: 'var(--SwipeItemBackground, var(--ControlFillColorTertiaryBrush, var(--ctrl-fill-tertiary)))',
  SwipeItemForeground: 'var(--SwipeItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)))',
  SwipeItemBackgroundPressed: 'var(--SwipeItemBackgroundPressed, var(--ControlAltFillColorQuarternaryBrush))',
  SwipeItemPreThresholdExecuteForeground: 'var(--SwipeItemPreThresholdExecuteForeground, var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill)))',
  SwipeItemPreThresholdExecuteBackground: 'var(--SwipeItemPreThresholdExecuteBackground, var(--ControlFillColorTertiaryBrush, var(--ctrl-fill-tertiary)))',
  SwipeItemPostThresholdExecuteForeground: 'var(--SwipeItemPostThresholdExecuteForeground, var(--TextOnAccentFillColorPrimaryBrush))',
  SwipeItemPostThresholdExecuteBackground: 'var(--SwipeItemPostThresholdExecuteBackground, var(--AccentFillColorDefaultBrush, var(--accent-base)))'
})
