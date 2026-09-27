export type SelectorBarStyle = Readonly<{
  Key: string
  TargetType: 'SelectorBar' | 'SelectorBarItem'
  Setters: Readonly<Record<string, unknown>>
}>

// WinUI-Gallery/Styles/SelectorBar.xaml. Local property values override these setters.
export const tokenViewSelectorBarStyle: SelectorBarStyle = Object.freeze({
  Key: 'TokenViewSelectorBarStyle', TargetType: 'SelectorBar',
  Setters: Object.freeze({
    HorizontalAlignment: 'Left', VerticalAlignment: 'Top', IsTabStop: false,
    TabNavigation: 'Once', Padding: '{ThemeResource SelectorBarPadding}'
  })
})
export const tokenViewSelectorBarItemStyle: SelectorBarStyle = Object.freeze({
  Key: 'TokenViewSelectorBarItemStyle', TargetType: 'SelectorBarItem',
  Setters: Object.freeze({
    BackgroundSizing: 'OuterBorderEdge', Background: '{ThemeResource TokenItemBackground}',
    Foreground: '{ThemeResource TokenItemForeground}', BorderBrush: '{ThemeResource TokenItemBorderBrush}',
    BorderThickness: '{ThemeResource TokenItemBorderThickness}', Padding: '23,5,23,6', CornerRadius: 16,
    HorizontalAlignment: 'Left', VerticalAlignment: 'Center',
    FocusVisualMargin: '{ThemeResource SelectorBarItemFocusVisualMargin}',
    FontFamily: '{ThemeResource ContentControlThemeFontFamily}', FontWeight: 'Normal',
    FontSize: '{ThemeResource ControlContentThemeFontSize}', UseSystemFocusVisuals: '{StaticResource UseSystemFocusVisuals}'
  })
})

export const selectorBarStyleSetter = (style: unknown, property: string, targetType: SelectorBarStyle['TargetType']) => {
  if (style && typeof style === 'object' && (style as SelectorBarStyle).TargetType === targetType) {
    return (style as SelectorBarStyle).Setters?.[property]
  }
  return undefined
}

// SelectorBar.xaml and SelectorBar_themeresources.xaml in WinUI-Reference,
// plus the TokenItem aliases shared by the Gallery's three theme dictionaries.
export const selectorBarResources: Readonly<Record<string, unknown>> = Object.freeze({
  TokenViewSelectorBarStyle: tokenViewSelectorBarStyle,
  TokenViewSelectorBarItemStyle: tokenViewSelectorBarItemStyle,
  TokenItemBackground: 'var(--ControlFillColorDefaultBrush)',
  TokenItemBackgroundPointerOver: 'var(--ControlFillColorSecondaryBrush)',
  TokenItemBackgroundPressed: 'var(--ControlFillColorSecondaryBrush)',
  TokenItemBackgroundSelected: 'var(--AccentFillColorDefaultBrush)',
  TokenItemBackgroundPointerOverSelected: 'var(--AccentFillColorSecondaryBrush)',
  TokenItemBackgroundPressedSelected: 'var(--AccentFillColorTertiaryBrush)',
  TokenItemBorderBrush: 'var(--ControlStrokeColorDefaultBrush)',
  TokenItemBorderBrushPointerOver: 'var(--ControlStrokeColorDefaultBrush)',
  TokenItemBorderBrushPressed: 'var(--ControlStrokeColorDefaultBrush)',
  TokenItemBorderBrushSelected: 'var(--AccentFillColorDefaultBrush)',
  TokenItemBorderBrushPointerOverSelected: 'var(--AccentFillColorSecondaryBrush)',
  TokenItemBorderBrushPressedSelected: 'var(--AccentFillColorTertiaryBrush)',
  TokenItemForeground: 'var(--TextFillColorPrimaryBrush)',
  TokenItemForegroundPointerOver: 'var(--TextFillColorPrimaryBrush)',
  TokenItemForegroundPressed: 'var(--TextFillColorSecondaryBrush)',
  TokenItemForegroundSelected: 'var(--TextOnAccentFillColorPrimaryBrush)',
  TokenItemForegroundPointerOverSelected: 'var(--TextOnAccentFillColorPrimaryBrush)',
  TokenItemForegroundPressedSelected: 'var(--TextOnAccentFillColorSecondaryBrush)',
  TokenItemBorderThickness: 1,
  ControlContentThemeFontSize: 'var(--ControlContentThemeFontSize, 14px)',
  UseSystemFocusVisuals: true,
  SelectorBarBackground: 'var(--SelectorBarBackground)',
  SelectorBarItemPillFill: 'var(--SelectorBarItemPillFill)',
  SelectorBarItemDisabledPillFill: 'var(--SelectorBarItemDisabledPillFill)',
  SelectorBarItemBorderBrush: 'var(--SelectorBarItemBorderBrush)',
  SelectorBarItemBorderBrushPointerOver: 'var(--SelectorBarItemBorderBrushPointerOver)',
  SelectorBarItemBorderBrushSelected: 'var(--SelectorBarItemBorderBrushSelected)',
  SelectorBarItemBorderBrushPressed: 'var(--SelectorBarItemBorderBrushPressed)',
  SelectorBarItemBorderBrushDisabled: 'var(--SelectorBarItemBorderBrushDisabled)',
  SelectorBarItemForeground: 'var(--SelectorBarItemForeground)',
  SelectorBarItemForegroundPointerOver: 'var(--SelectorBarItemForegroundPointerOver)',
  SelectorBarItemForegroundSelected: 'var(--SelectorBarItemForegroundSelected)',
  SelectorBarItemForegroundPressed: 'var(--SelectorBarItemForegroundPressed)',
  SelectorBarItemForegroundDisabled: 'var(--SelectorBarItemForegroundDisabled)',
  SelectorBarItemBackground: 'var(--SelectorBarItemBackground)',
  SelectorBarItemBackgroundPointerOver: 'var(--SelectorBarItemBackgroundPointerOver)',
  SelectorBarItemBackgroundSelected: 'var(--SelectorBarItemBackgroundSelected)',
  SelectorBarItemBackgroundPressed: 'var(--SelectorBarItemBackgroundPressed)',
  SelectorBarItemBackgroundDisabled: 'var(--SelectorBarItemBackgroundDisabled)',
  SelectorBarPadding: '0,4',
  SelectorBarBorderThickness: 1,
  SelectorBarItemBorderThickness: 1,
  SelectorBarSelectedInnerThickness: 1,
  SelectorBarItemIconVisualMargin: '-2,0',
  SelectorBarItemTextVisualMargin: 0,
  SelectorBarItemPadding: '12,10,12,7',
  SelectorBarItemSelectionVisualMargin: 0,
  SelectorBarItemFocusVisualMargin: -2,
  SelectorBarItemPillHeight: 3,
  SelectorBarItemPillWidth: 4,
  SelectorBarItemIconScale: 0.8,
  SelectorBarItemSpacing: 8,
  SelectorBarItemPill: Object.freeze({ TargetType: 'Rectangle', Fill: '{ThemeResource SelectorBarItemPillFill}', Width: 4, Height: 3 }),
  ComboBoxItemScaleAnimationDuration: 167
})
