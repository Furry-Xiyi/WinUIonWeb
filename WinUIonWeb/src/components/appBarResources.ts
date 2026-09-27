const brush = (resource: string) => `var(--${resource})`
const resources: Record<string, string | number> = {
  AppBarThemeMinHeight: 64, AppBarThemeCompactHeight: 48, AppBarButtonContentHeight: 16,
  AppBarButtonContentViewboxMargin: '12,16,0,10', AppBarButtonContentViewboxCompactMargin: '0,12,0,12', AppBarButtonContentViewboxCollapsedMargin: '0,16,0,2',
  AppBarButtonOverflowTextTouchMargin: '0,9,0,12', AppBarButtonOverflowTextLabelPadding: '0,5,0,8',
  AppBarButtonTextLabelMargin: '2,0,2,8', AppBarButtonTextLabelOnRightMargin: '8,16,12,10',
  AppBarButtonInnerBorderMargin: '2,6,2,6', AppBarButtonInnerBorderCompactMargin: '2,6,2,22', AppBarButtonInnerBorderOverflowMargin: '4,0,4,0',
  AppBarButtonHasFlyoutChevronVisibility: 'Visible', AppBarButtonFlyoutGlyph: '\uE974', AppBarButtonOverflowFlyoutGlyph: '\uE974',
  AppBarButtonSubItemChevronFontSize: 8, AppBarButtonSecondarySubItemChevronFontSize: 12,
  AppBarButtonSubItemChevronMargin: '-23,20,12,0', AppBarButtonSubItemChevronLabelOnRightMargin: '-7,20,12,0', AppBarButtonSecondarySubItemChevronMargin: '0,0,16,0',
  AppBarToggleButtonBorderThemeThickness: '1', AppBarToggleButtonOverflowTextTouchMargin: '0,9,0,12',
  AppBarToggleButtonOverflowCheckTouchMargin: '12,10,12,10', AppBarToggleButtonOverflowCheckMargin: '12,4,12,4',
  AppBarToggleButtonTextLabelMargin: '2,0,2,8', AppBarToggleButtonTextLabelOnRightMargin: '8,16,12,10', AppBarToggleButtonOverflowTextLabelPadding: '0,5,0,8',
  AppBarSeparatorMargin: '2,8,2,8', AppBarOverflowSeparatorMargin: '0,4,0,4',
  AppBarSeparatorWidth: 1, AppBarOverflowSeparatorHeight: 1, AppBarSeparatorCornerRadius: 0.5, AppBarSeparatorForeground: brush('DividerStrokeColorDefaultBrush')
}
for (const owner of ['AppBarButton', 'AppBarToggleButton']) {
  for (const [state, fill, text] of [
    ['', 'SubtleFillColorTransparentBrush', 'TextFillColorPrimaryBrush'],
    ['PointerOver', 'SubtleFillColorSecondaryBrush', 'TextFillColorPrimaryBrush'],
    ['Pressed', 'SubtleFillColorTertiaryBrush', 'TextFillColorSecondaryBrush'],
    ['Disabled', 'SubtleFillColorDisabledBrush', 'TextFillColorDisabledBrush']
  ]) {
    resources[`${owner}Background${state}`] = brush(fill!)
    resources[`${owner}Foreground${state}`] = brush(text!)
    resources[`${owner}BorderBrush${state}`] = brush('ControlFillColorTransparentBrush')
    resources[`${owner}KeyboardAcceleratorTextForeground${state}`] = brush(state === 'Disabled' ? 'TextFillColorDisabledBrush' : state === 'Pressed' ? 'TextFillColorTertiaryBrush' : 'TextFillColorSecondaryBrush')
  }
}
for (const [state, fill, text] of [
  ['', 'AccentFillColorDefaultBrush', 'TextOnAccentFillColorPrimaryBrush'],
  ['PointerOver', 'AccentFillColorSecondaryBrush', 'TextOnAccentFillColorPrimaryBrush'],
  ['Pressed', 'AccentFillColorTertiaryBrush', 'TextOnAccentFillColorSecondaryBrush'],
  ['Disabled', 'AccentFillColorDisabledBrush', 'TextOnAccentFillColorDisabled']
]) {
  resources[`AppBarToggleButtonBackgroundChecked${state}`] = brush(fill!)
  resources[`AppBarToggleButtonForegroundChecked${state}`] = brush(text!)
  resources[`AppBarToggleButtonBorderBrushChecked${state}`] = brush(state === 'Pressed' || state === 'Disabled' ? 'ControlFillColorTransparentBrush' : 'AccentControlElevationBorderBrush')
  resources[`AppBarToggleButtonCheckGlyphForegroundChecked${state}`] = brush(text!)
  resources[`AppBarToggleButtonKeyboardAcceleratorTextForegroundChecked${state}`] = brush(state === 'Disabled' ? 'TextFillColorDisabledBrush' : state === 'Pressed' ? 'TextFillColorTertiaryBrush' : 'TextFillColorSecondaryBrush')
}
for (const state of ['', 'PointerOver', 'Pressed', 'Disabled', 'SubMenuOpened']) resources[`AppBarButtonSubItemChevronForeground${state}`] = brush(state === 'Disabled' ? 'TextFillColorDisabledBrush' : state === 'Pressed' ? 'TextFillColorTertiaryBrush' : 'TextFillColorSecondaryBrush')
for (const state of ['PointerOver', 'Pressed', 'Disabled']) {
  const text = state === 'Disabled' ? 'TextFillColorDisabledBrush' : state === 'Pressed' ? 'TextFillColorSecondaryBrush' : 'TextFillColorPrimaryBrush'
  resources[`AppBarToggleButtonOverflowLabelForeground${state}`] = brush(text)
  resources[`AppBarToggleButtonOverflowLabelForegroundChecked${state}`] = brush(text)
  resources[`AppBarToggleButtonCheckGlyphForeground${state}`] = brush(text)
}
resources.AppBarToggleButtonCheckGlyphForeground = brush('TextFillColorPrimaryBrush')
for (const state of ['', 'PointerOver', 'Pressed', 'CheckedPointerOver', 'CheckedPressed']) resources[`AppBarToggleButtonBackgroundHighLightOverlay${state}`] = brush(state.endsWith('Pressed') ? 'SubtleFillColorTertiaryBrush' : state.endsWith('PointerOver') ? 'SubtleFillColorSecondaryBrush' : 'SubtleFillColorTransparentBrush')
resources.AppBarButtonBackgroundSubMenuOpened = brush('SubtleFillColorSecondaryBrush')
resources.AppBarButtonForegroundSubMenuOpened = brush('TextFillColorPrimaryBrush')
resources.AppBarButtonKeyboardAcceleratorTextForegroundSubMenuOpened = brush('TextFillColorSecondaryBrush')
resources.AppBarButtonBorderBrushSubMenuOpened = brush('ControlFillColorTransparentBrush')
export const appBarResources: Readonly<Record<string, string | number>> = Object.freeze(resources)
