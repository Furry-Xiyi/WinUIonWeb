/** Default metrics and brush aliases from Pivot_themeresources.xaml. */
const referenceResources: Readonly<Record<string, string | number>> = Object.freeze({
  PivotHeaderItemFontFamily: 'var(--ContentControlThemeFontFamily, "Segoe UI Variable", "Segoe UI", sans-serif)',
  PivotTitleFontFamily: 'var(--ContentControlThemeFontFamily, "Segoe UI Variable", "Segoe UI", sans-serif)',
  PivotHeaderItemFontSize: 24, PivotHeaderItemLockedTranslation: 40, PivotTitleFontSize: 14,
  PivotHeaderItemCharacterSpacing: -25, PivotHeaderItemMargin: '12,0,12,0', PivotItemMargin: '12,0,12,0',
  PivotLandscapeThemePadding: '12,14,0,13', PivotPortraitThemePadding: '12,14,0,13',
  PivotNavButtonBorderThemeThickness: 0, PivotNavButtonMargin: '0,6,0,0',
  PivotHeaderItemThemeFontWeight: 350, PivotTitleThemeFontWeight: 700, PivotHeaderItemSelectedPipeCornerRadius: 1.5,
  PivotBackground: 'var(--SystemControlTransparentBrush, transparent)',
  PivotHeaderBackground: 'var(--SystemControlTransparentBrush, transparent)',
  PivotItemBackground: 'var(--SystemControlTransparentBrush, transparent)',
  PivotHeaderItemBackgroundUnselected: 'transparent', PivotHeaderItemBackgroundUnselectedPointerOver: 'transparent',
  PivotHeaderItemBackgroundUnselectedPressed: 'transparent', PivotHeaderItemBackgroundSelected: 'transparent',
  PivotHeaderItemBackgroundSelectedPointerOver: 'transparent', PivotHeaderItemBackgroundSelectedPressed: 'transparent', PivotHeaderItemBackgroundDisabled: 'transparent',
  PivotHeaderItemForegroundUnselected: 'var(--SystemControlForegroundBaseMediumBrush, var(--text-secondary))',
  PivotHeaderItemForegroundUnselectedPointerOver: 'var(--SystemControlHighlightAltBaseMediumHighBrush, var(--text-primary))',
  PivotHeaderItemForegroundUnselectedPressed: 'var(--SystemControlHighlightAltBaseMediumHighBrush, var(--text-primary))',
  PivotHeaderItemForegroundSelected: 'var(--SystemControlHighlightAltBaseHighBrush, var(--text-primary))',
  PivotHeaderItemForegroundSelectedPointerOver: 'var(--SystemControlHighlightAltBaseMediumHighBrush, var(--text-primary))',
  PivotHeaderItemForegroundSelectedPressed: 'var(--SystemControlHighlightAltBaseMediumHighBrush, var(--text-primary))',
  PivotHeaderItemForegroundDisabled: 'var(--SystemControlDisabledBaseMediumLowBrush, var(--text-disabled))',
  PivotHeaderItemFocusPipeFill: 'var(--SystemControlHighlightAltAccentBrush, var(--accent-default))',
  PivotHeaderItemSelectedPipeFill: 'var(--AccentFillColorDefaultBrush, var(--accent-default))',
  ...Object.fromEntries(['Next', 'Previous'].flatMap(direction => [
    [`Pivot${direction}ButtonBackground`, 'var(--SystemControlBackgroundBaseMediumLowBrush, var(--control-fill-secondary))'],
    [`Pivot${direction}ButtonBackgroundPointerOver`, 'var(--SystemControlHighlightBaseMediumBrush, var(--control-fill-tertiary))'],
    [`Pivot${direction}ButtonBackgroundPressed`, 'var(--SystemControlHighlightBaseMediumHighBrush, var(--control-fill-disabled))'],
    [`Pivot${direction}ButtonBorderBrush`, 'transparent'], [`Pivot${direction}ButtonBorderBrushPointerOver`, 'transparent'], [`Pivot${direction}ButtonBorderBrushPressed`, 'transparent'],
    [`Pivot${direction}ButtonForeground`, 'var(--SystemControlForegroundAltMediumHighBrush, var(--text-primary))'],
    [`Pivot${direction}ButtonForegroundPointerOver`, 'var(--SystemControlHighlightAltAltMediumHighBrush, var(--text-primary))'],
    [`Pivot${direction}ButtonForegroundPressed`, 'var(--SystemControlHighlightAltAltMediumHighBrush, var(--text-primary))']
  ]))
})
export const pivotResources: Readonly<Record<string, string | number>> = Object.freeze(Object.fromEntries(Object.entries(referenceResources).map(([name, resource]) => [name, typeof resource === 'string' && /var\(|transparent/.test(resource) ? `var(--${name}, ${resource})` : resource])))
