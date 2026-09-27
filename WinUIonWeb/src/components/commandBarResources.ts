const brush = (resource: string) => `var(--${resource})`

// Values from CommonStyles/CommandBar_themeresources.xaml and
// CommandBarFlyout/CommandBarFlyout_themeresources.xaml.
const resources: Record<string, string | number> = {
  AppBarThemeMinHeight: 64,
  AppBarThemeCompactHeight: 48,
  AppBarMoreButtonColumnMinWidth: 6,
  AppBarEllipsisButtonInnerBorderMargin: '2,6,6,6',
  CommandBarOverflowMinWidth: 160,
  CommandBarOverflowTouchMinWidth: 240,
  CommandBarOverflowMaxWidth: 480,
  CommandBarOverflowMaxHeight: 198,
  CommandBarBorderThicknessOpen: '1',
  CommandBarOverflowPresenterBorderThickness: '1',
  CommandBarOverflowPresenterBorderDownThickness: '0,0,0,1',
  CommandBarOverflowPresenterBorderUpThickness: '0,1,0,0',
  CommandBarOverflowPresenterBorderPadding: '0',
  CommandBarOverflowPresenterBorderDownPadding: '0',
  CommandBarOverflowPresenterBorderUpPadding: '0',
  CommandBarOverflowPresenterMargin: '0,4,0,4',
  CommandBarFlyoutAppBarButtonInnerBorderMargin: '2',
  CommandBarFlyoutAppBarEllipsisButtonInnerBorderMargin: '2,2,6,2',
  CommandBarFlyoutBorderThemeThickness: '1',
  CommandBarFlyoutBorderUpThemeThickness: '1,1,1,0',
  CommandBarFlyoutBorderDownThemeThickness: '1,0,1,1',
  CommandBarBackground: brush('ControlFillColorTransparentBrush'),
  CommandBarBackgroundOpen: brush('AcrylicInAppFillColorDefaultBrush'),
  CommandBarBorderBrushOpen: brush('CardStrokeColorDefaultSolidBrush'),
  CommandBarForeground: brush('TextFillColorPrimaryBrush'),
  CommandBarHighContrastBorder: brush('ControlFillColorTransparentBrush'),
  CommandBarEllipsisIconForegroundDisabled: brush('TextFillColorDisabledBrush'),
  CommandBarOverflowPresenterBackground: brush('AcrylicInAppFillColorDefaultBrush'),
  CommandBarOverflowPresenterBorderBrush: brush('SystemControlTransientBorderBrush'),
  CommandBarLightDismissOverlayBackground: brush('SystemControlPageBackgroundMediumAltMediumBrush'),
  CommandBarFlyoutBackground: brush('DesktopAcrylicTransparentBrush'),
  CommandBarFlyoutForeground: brush('TextFillColorPrimaryBrush'),
  CommandBarFlyoutBorderBrush: brush('ControlStrokeColorDefaultBrush'),
  CommandBarFlyoutButtonBackground: brush('SystemControlTransparentBrush'),
  CommandBarFlyoutAppBarButtonBorderBrush: brush('SubtleFillColorTransparentBrush')
}
for (const [state, fill, text] of [
  ['', 'SubtleFillColorTransparentBrush', 'TextFillColorPrimaryBrush'],
  ['PointerOver', 'SubtleFillColorSecondaryBrush', 'TextFillColorPrimaryBrush'],
  ['Pressed', 'SubtleFillColorTertiaryBrush', 'TextFillColorSecondaryBrush'],
  ['Disabled', 'SubtleFillColorDisabledBrush', 'TextFillColorDisabledBrush']
]) {
  resources[`CommandBarFlyoutAppBarButtonBackground${state}`] = brush(fill!)
  resources[`CommandBarFlyoutAppBarButtonForeground${state}`] = brush(text!)
}
for (const [state, fill, text] of [
  ['', 'AccentFillColorDefaultBrush', 'TextOnAccentFillColorPrimaryBrush'],
  ['PointerOver', 'AccentFillColorSecondaryBrush', 'TextOnAccentFillColorPrimaryBrush'],
  ['Pressed', 'AccentFillColorTertiaryBrush', 'TextOnAccentFillColorSecondaryBrush'],
  ['Disabled', 'AccentFillColorDisabledBrush', 'TextOnAccentFillColorDisabledBrush']
]) {
  resources[`CommandBarFlyoutAppBarButtonBackgroundChecked${state}`] = brush(fill!)
  resources[`CommandBarFlyoutAppBarButtonForegroundChecked${state}`] = brush(text!)
}
for (const state of ['', 'PointerOver', 'Pressed']) resources[`CommandBarFlyoutAppBarButtonKeyboardTextLabelForeground${state}`] = brush(state === 'Pressed' ? 'TextFillColorTertiaryBrush' : 'TextFillColorSecondaryBrush')
for (const state of ['', 'PointerOver', 'Pressed', 'SubMenuOpened', 'Disabled']) resources[`CommandBarFlyoutAppBarButtonSubItemChevron${state ? `${state}Foreground` : 'Foreground'}`] = brush(state === 'Disabled' ? 'TextFillColorDisabledBrush' : state === 'Pressed' ? 'TextFillColorTertiaryBrush' : 'TextFillColorSecondaryBrush')
export const commandBarResources: Readonly<Record<string, string | number>> = Object.freeze(resources)
