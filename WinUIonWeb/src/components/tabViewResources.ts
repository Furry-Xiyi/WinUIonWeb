/** Brush aliases and metrics from controls/dev/TabView/TabView_themeresources.xaml. */
const aliases: Record<string, string | number> = {
  // SystemThemingInterop.cpp stable variant palette when the browser host
  // has not supplied its own Windows accent-color resource values.
  SystemAccentColor: 'var(--accent-base, #0078D7)',
  SystemAccentColorDark1: 'var(--SystemAccentColorDark1, #005A9E)', SystemAccentColorDark2: 'var(--SystemAccentColorDark2, #004275)', SystemAccentColorDark3: 'var(--SystemAccentColorDark3, #002642)',
  SystemAccentColorLight1: 'var(--SystemAccentColorLight1, #429CE3)', SystemAccentColorLight2: 'var(--SystemAccentColorLight2, #76B9ED)', SystemAccentColorLight3: 'var(--SystemAccentColorLight3, #A6D8FF)',
  TabViewHeaderPadding: '0,8,0,0', TabViewItemHeaderPadding: '8,3,4,3', TabViewSelectedItemHeaderPadding: '9,3,5,4',
  TabViewItemMinHeight: 32, TabViewItemMaxWidth: 240, TabViewItemMinWidth: 100, TabViewItemHeaderFontSize: 12,
  TabViewItemHeaderIconSize: 16, TabViewItemHeaderIconMargin: '0,0,10,0', TabViewItemHeaderCloseButtonHeight: 24,
  TabViewItemHeaderCloseButtonWidth: 32, TabViewItemHeaderCloseButtonSize: 16, TabViewItemHeaderCloseFontSize: 12,
  TabViewItemHeaderCloseMargin: '4,0,0,0', TabViewItemHeaderPaddingWithCloseButton: '8,3,4,3', TabViewItemHeaderPaddingWithoutCloseButton: '8,3,8,3',
  TabViewItemScrollButtonWidth: 32, TabViewItemScrollButtonHeight: 24, TabViewItemScrollButonFontSize: 8,
  TabViewItemScrollButtonPadding: '7,3,7,3', TabViewItemLeftScrollButtonContainerPadding: '8,0,3,3', TabViewItemRightScrollButtonContainerPadding: '3,0,8,3',
  TabViewItemAddButtonWidth: 32, TabViewItemAddButtonHeight: 24, TabViewItemAddButtonFontSize: 12, TabViewItemAddButtonContainerPadding: '3,0,0,3',
  TabViewShadowDepth: 16, TabViewItemSeparatorMargin: '0,8,0,8', TabViewItemBorderThickness: 1,
  TabViewSelectedItemBorderThickness: '1,1,1,0', TabViewSelectedItemHeaderMargin: '-1,0,-1,1',
  TabViewButtonBorderThickness: 0, TabViewItemHeaderCloseButtonBorderThickness: 0,
  TabViewBackground: 'var(--SubtleFillColorTransparentBrush, transparent)',
  TabViewItemHeaderBackground: 'var(--LayerOnMicaBaseAltFillColorTransparentBrush, transparent)',
  TabViewItemHeaderBackgroundSelected: 'var(--SolidBackgroundFillColorTertiaryBrush, var(--background-solid-tertiary, var(--background-layer)))',
  TabViewItemHeaderDragBackground: 'var(--SolidBackgroundFillColorTertiaryBrush, var(--background-solid-tertiary, var(--background-layer)))',
  TabViewItemHeaderBackgroundPointerOver: 'var(--LayerOnMicaBaseAltFillColorSecondaryBrush, var(--subtle-secondary))',
  TabViewItemHeaderBackgroundPressed: 'var(--LayerOnMicaBaseAltFillColorDefaultBrush, var(--subtle-tertiary))',
  TabViewItemHeaderBackgroundDisabled: 'transparent', TabViewItemSeparator: 'var(--DividerStrokeColorDefaultBrush, var(--stroke-divider))',
  TabViewBorderBrush: 'var(--CardStrokeColorDefaultBrush, var(--card-stroke))', TabViewItemBorderBrush: 'transparent'
}
for (const prefix of ['TabViewItemHeaderForeground', 'TabViewItemIconForeground']) {
  for (const [state, brush] of Object.entries({ '': 'Secondary', Pressed: 'Tertiary', Selected: 'Primary', PointerOver: 'Secondary', Disabled: 'Disabled' })) aliases[`${prefix}${state}`] = `var(--TextFillColor${brush}Brush, var(--text-${brush.toLowerCase()}))`
}
for (const prefix of ['TabViewButton', 'TabViewScrollButton', 'TabViewItemHeaderCloseButton']) {
  for (const [state, brush] of Object.entries({ '': 'Transparent', PointerOver: 'Secondary', Pressed: 'Tertiary', Disabled: 'Transparent' })) {
    aliases[`${prefix}Background${state}`] = `var(--SubtleFillColor${brush}Brush, ${brush === 'Transparent' ? 'transparent' : `var(--subtle-${brush.toLowerCase()})`})`
    aliases[`${prefix}Foreground${state}`] = `var(--TextFillColor${state === 'Disabled' ? 'Disabled' : state === 'Pressed' || prefix === 'TabViewScrollButton' ? 'Secondary' : 'Primary'}Brush, var(--text-${state === 'Disabled' ? 'disabled' : state === 'Pressed' || prefix === 'TabViewScrollButton' ? 'secondary' : 'primary'}))`
    aliases[`${prefix}BorderBrush${state}`] = 'transparent'
  }
}
for (const state of ['Pressed', 'PointerOver', 'Selected', 'Disabled']) {
  aliases[`TabViewItemHeader${state}CloseButtonBackground`] = 'transparent'
  aliases[`TabViewItemHeader${state}CloseButtonForeground`] = `var(--TextFillColor${state === 'Disabled' ? 'Disabled' : 'Primary'}Brush, var(--text-${state === 'Disabled' ? 'disabled' : 'primary'}))`
}
export const tabViewResources: Readonly<Record<string, string | number>> = Object.freeze(Object.fromEntries(Object.entries(aliases).map(([name, value]) => [name, typeof value === 'string' && /var\(|transparent/.test(value) ? `var(--${name}, ${value})` : value])))
