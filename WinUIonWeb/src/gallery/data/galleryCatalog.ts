import enUS from '../Strings/en-US/CatalogResources';

export type GalleryTranslator = (key: string) => string;

export interface GalleryItem {
  UniqueId: string;
  Title: string;
  Subtitle: string;
  ImagePath: string;
  IsNew: boolean;
  IsUpdated: boolean;
  Icon: string;
}

export interface GalleryGroup {
  UniqueId: string;
  Title: string;
  Items: GalleryItem[];
  Icon: string;
}

export interface HomeHeaderTile {
  UniqueId: string;
  Title: string;
  Description: string;
  Link: string;
  ImagePath: string;
  Icon: string;
}

interface ItemDefinition {
  UniqueId: string;
  Image: string;
  Icon: string;
  IsNew: boolean;
  IsUpdated: boolean;
}

interface GroupDefinition {
  UniqueId: string;
  Icon: string;
  Items: ItemDefinition[];
}

export const GALLERY_ASSET_ROOT = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets';
export const HOME_HEADER_IMAGE = `${GALLERY_ASSET_ROOT}/GalleryHeaderImage.png`;
export const HOME_FAVORITES_IMAGE = `${GALLERY_ASSET_ROOT}/ControlImages/RatingControl.png`;
export const CONTROL_IMAGE_FALLBACK = `${GALLERY_ASSET_ROOT}/ControlImages/Placeholder.png`;
export const GITHUB_ICON_PATH = 'M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z';

// Gallery SectionPage orders by the official title, including in localized views.
const groupDefinitions: GroupDefinition[] = [
  {
    UniqueId: 'buttons',
    Icon: '\uE73A',
    Items: [
      { UniqueId: 'button', Image: 'Button.png', Icon: '\uE71A', IsNew: false, IsUpdated: false },
      { UniqueId: 'checkbox', Image: 'Checkbox.png', Icon: '\uE73D', IsNew: false, IsUpdated: false },
      { UniqueId: 'colorpicker', Image: 'ColorPicker.png', Icon: '\uEF3C', IsNew: false, IsUpdated: false },
      { UniqueId: 'combobox', Image: 'ComboBox.png', Icon: '\uE7FB', IsNew: false, IsUpdated: false },
      { UniqueId: 'dropdownbutton', Image: 'DropDownButton.png', Icon: '\uE70D', IsNew: false, IsUpdated: false },
      { UniqueId: 'hyperlinkbutton', Image: 'HyperlinkButton.png', Icon: '\uE71B', IsNew: false, IsUpdated: false },
      { UniqueId: 'radiobutton', Image: 'RadioButton.png', Icon: '\uECCB', IsNew: false, IsUpdated: false },
      { UniqueId: 'rating', Image: 'RatingControl.png', Icon: '\uE734', IsNew: false, IsUpdated: false },
      { UniqueId: 'repeatbutton', Image: 'RepeatButton.png', Icon: '\uE8AB', IsNew: false, IsUpdated: false },
      { UniqueId: 'slider', Image: 'Slider.png', Icon: '\uE9E9', IsNew: false, IsUpdated: false },
      { UniqueId: 'splitbutton', Image: 'SplitButton.png', Icon: '\uE90D', IsNew: false, IsUpdated: false },
      { UniqueId: 'togglebutton', Image: 'ToggleButton.png', Icon: '\uEF1F', IsNew: false, IsUpdated: false },
      { UniqueId: 'togglesplitbutton', Image: 'ToggleSplitButton.png', Icon: '\uE90D', IsNew: false, IsUpdated: false },
      { UniqueId: 'toggleswitch', Image: 'ToggleSwitch.png', Icon: '\uF19F', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'collections',
    Icon: '\uE80A',
    Items: [
      { UniqueId: 'flipview', Image: 'FlipView.png', Icon: '\uF1CB', IsNew: false, IsUpdated: false },
      { UniqueId: 'gridview', Image: 'GridView.png', Icon: '\uF0E2', IsNew: false, IsUpdated: false },
      { UniqueId: 'itemsrepeater', Image: 'ListView.png', Icon: '\uE8FD', IsNew: false, IsUpdated: false },
      { UniqueId: 'itemsview', Image: 'ItemsView.png', Icon: '\uF0E2', IsNew: false, IsUpdated: false },
      { UniqueId: 'listview', Image: 'ListView.png', Icon: '\uE8FD', IsNew: false, IsUpdated: false },
      { UniqueId: 'pulltorefresh', Image: 'PullToRefresh.png', Icon: '\uE72C', IsNew: false, IsUpdated: false },
      { UniqueId: 'treeview', Image: 'TreeView.png', Icon: '\uED41', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'dateandtime',
    Icon: '\uEC92',
    Items: [
      { UniqueId: 'calendardatepicker', Image: 'CalendarDatePicker.png', Icon: '\uE787', IsNew: false, IsUpdated: false },
      { UniqueId: 'calendarview', Image: 'CalendarView.png', Icon: '\uF763', IsNew: false, IsUpdated: false },
      { UniqueId: 'datepicker', Image: 'DatePicker.png', Icon: '\uE8BF', IsNew: false, IsUpdated: false },
      { UniqueId: 'timepicker', Image: 'TimePicker.png', Icon: '\uE823', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'dialogsandflyouts',
    Icon: '\uE15F',
    Items: [
      { UniqueId: 'contentdialog', Image: 'ContentDialog.png', Icon: '\uE8F2', IsNew: false, IsUpdated: false },
      { UniqueId: 'flyout', Image: 'Flyout.png', Icon: '\uE8A8', IsNew: false, IsUpdated: false },
      { UniqueId: 'popup', Image: 'Popup.png', Icon: '\uE7C4', IsNew: true, IsUpdated: false },
      { UniqueId: 'teachingtip', Image: 'TeachingTip.png', Icon: '\uEC42', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'layout',
    Icon: '\uE8A1',
    Items: [
      { UniqueId: 'border', Image: 'Border.png', Icon: '\uE8A1', IsNew: false, IsUpdated: false },
      { UniqueId: 'canvas', Image: 'Canvas.png', Icon: '\uE7C3', IsNew: false, IsUpdated: false },
      { UniqueId: 'expander', Image: 'Expander.png', Icon: '\uE8C4', IsNew: false, IsUpdated: false },
      { UniqueId: 'grid', Image: 'Grid.png', Icon: '\uECA5', IsNew: false, IsUpdated: false },
      { UniqueId: 'relativepanel', Image: 'RelativePanel.png', Icon: '\uE8A1', IsNew: false, IsUpdated: false },
      { UniqueId: 'splitview', Image: 'SplitView.png', Icon: '\uE8BC', IsNew: false, IsUpdated: false },
      { UniqueId: 'stackpanel', Image: 'StackPanel.png', Icon: '\uE8FD', IsNew: false, IsUpdated: false },
      { UniqueId: 'variablesizedwrapgrid', Image: 'VariableSizedWrapGrid.png', Icon: '\uE8A9', IsNew: false, IsUpdated: false },
      { UniqueId: 'viewbox', Image: 'Viewbox.png', Icon: '\uE8A7', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'media',
    Icon: '\uE173',
    Items: [
      { UniqueId: 'captureelement', Image: 'CaptureElement.png', Icon: '\uE722', IsNew: true, IsUpdated: false },
      { UniqueId: 'image', Image: 'Image.png', Icon: '\uE8B9', IsNew: false, IsUpdated: false },
      { UniqueId: 'mediaplayerelement', Image: 'MediaPlayerElement.png', Icon: '\uE714', IsNew: false, IsUpdated: false },
      { UniqueId: 'personpicture', Image: 'PersonPicture.png', Icon: '\uE77B', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'menusandtoolbars',
    Icon: '\uE74E',
    Items: [
      { UniqueId: 'appbarbutton', Image: 'AppBarButton.png', Icon: '\uE76F', IsNew: false, IsUpdated: false },
      { UniqueId: 'appbarseparator', Image: 'AppBarSeparator.png', Icon: '\uF464', IsNew: false, IsUpdated: false },
      { UniqueId: 'toggleappbarbutton', Image: 'AppBarToggleButton.png', Icon: '\uE76F', IsNew: false, IsUpdated: false },
      { UniqueId: 'commandbar', Image: 'CommandBar.png', Icon: '\uE76F', IsNew: false, IsUpdated: false },
      { UniqueId: 'commandbarflyout', Image: 'CommandBarFlyout.png', Icon: '\uF0E2', IsNew: false, IsUpdated: false },
      { UniqueId: 'menubar', Image: 'MenuBar.png', Icon: '\uE76F', IsNew: false, IsUpdated: false },
      { UniqueId: 'menuflyout', Image: 'MenuFlyout.png', Icon: '\uF0E2', IsNew: false, IsUpdated: false },
      { UniqueId: 'standarduicommand', Image: 'AppBarSeparator.png', Icon: '\uE756', IsNew: false, IsUpdated: false },
      { UniqueId: 'swipecontrol', Image: 'SwipeControl.png', Icon: '\uE927', IsNew: false, IsUpdated: false },
      { UniqueId: 'xamluicommand', Image: 'AppBarSeparator.png', Icon: '\uE756', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'motion',
    Icon: '\uE945',
    Items: [
      { UniqueId: 'pagetransition', Image: 'PageTransition.png', Icon: '\uE8AB', IsNew: false, IsUpdated: false },
      { UniqueId: 'parallaxview', Image: 'ParallaxView.png', Icon: '\uE7F4', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'navigation',
    Icon: '\uE700',
    Items: [
      { UniqueId: 'breadcrumbbar', Image: 'BreadcrumbBar.png', Icon: '\uE76C', IsNew: false, IsUpdated: false },
      { UniqueId: 'navigationview', Image: 'NavigationView.png', Icon: '\uE700', IsNew: false, IsUpdated: false },
      { UniqueId: 'pivot', Image: 'Pivot.png', Icon: '\uE8F9', IsNew: false, IsUpdated: false },
      { UniqueId: 'selectorbar', Image: 'Pivot.png', Icon: '\uE8AB', IsNew: true, IsUpdated: false },
      { UniqueId: 'tabview', Image: 'TabView.png', Icon: '\uE7EA', IsNew: false, IsUpdated: true }
    ]
  },
  {
    UniqueId: 'scrolling',
    Icon: '\uE174',
    Items: [
      { UniqueId: 'pipspager', Image: 'PipsPager.png', Icon: '\uE712', IsNew: false, IsUpdated: false },
      { UniqueId: 'scrollview', Image: 'ScrollView.png', Icon: '\uECE7', IsNew: false, IsUpdated: false },
      { UniqueId: 'scrollviewer', Image: 'ScrollViewer.png', Icon: '\uEC8F', IsNew: false, IsUpdated: false },
      { UniqueId: 'semanticzoom', Image: 'SemanticZoom.png', Icon: '\uE773', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'statusandinfo',
    Icon: '\uE8F2',
    Items: [
      { UniqueId: 'infobadge', Image: 'InfoBadge.png', Icon: '\uEDAF', IsNew: false, IsUpdated: false },
      { UniqueId: 'infobar', Image: 'InfoBar.png', Icon: '\uF167', IsNew: false, IsUpdated: false },
      { UniqueId: 'progressbar', Image: 'ProgressBar.png', Icon: '\uE76F', IsNew: false, IsUpdated: false },
      { UniqueId: 'progressring', Image: 'ProgressRing.png', Icon: '\uF16A', IsNew: false, IsUpdated: false },
      { UniqueId: 'tooltip', Image: 'ToolTip.png', Icon: '\uE946', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'styles',
    Icon: '\uE2B1',
    Items: [
      { UniqueId: 'acrylic', Image: 'Acrylic.png', Icon: '\uE790', IsNew: false, IsUpdated: true },
      { UniqueId: 'animatedicon', Image: 'AnimatedIcon.png', Icon: '\uE768', IsNew: false, IsUpdated: false },
      { UniqueId: 'compactsizing', Image: 'CompactSizing.png', Icon: '\uE740', IsNew: false, IsUpdated: true },
      { UniqueId: 'iconelement', Image: 'Image.png', Icon: '\uE8B9', IsNew: false, IsUpdated: false },
      { UniqueId: 'line', Image: 'Line.png', Icon: '\uE921', IsNew: false, IsUpdated: false },
      { UniqueId: 'radialgradientbrush', Image: 'Canvas.png', Icon: '\uE790', IsNew: false, IsUpdated: false },
      { UniqueId: 'systembackdrops', Image: 'Acrylic.png', Icon: '\uE790', IsNew: false, IsUpdated: false },
      { UniqueId: 'systembackdropelement', Image: 'Acrylic.png', Icon: '\uE790', IsNew: true, IsUpdated: false },
      { UniqueId: 'themeshadow', Image: 'ThemeShadow.png', Icon: '\uE790', IsNew: true, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'text',
    Icon: '\uE8D2',
    Items: [
      { UniqueId: 'autosuggestbox', Image: 'AutoSuggestBox.png', Icon: '\uE721', IsNew: false, IsUpdated: false },
      { UniqueId: 'numberbox', Image: 'NumberBox.png', Icon: '\uF261', IsNew: false, IsUpdated: false },
      { UniqueId: 'passwordbox', Image: 'PasswordBox.png', Icon: '\uE7B3', IsNew: false, IsUpdated: false },
      { UniqueId: 'richeditbox', Image: 'RichEditBox.png', Icon: '\uE8D3', IsNew: false, IsUpdated: true },
      { UniqueId: 'richtextblock', Image: 'RichTextBlock.png', Icon: '\uE8D2', IsNew: false, IsUpdated: false },
      { UniqueId: 'textblock', Image: 'TextBlock.png', Icon: '\uE8E4', IsNew: false, IsUpdated: false },
      { UniqueId: 'textbox', Image: 'TextBox.png', Icon: '\uE8AC', IsNew: false, IsUpdated: false }
    ]
  },
  {
    UniqueId: 'windowing',
    Icon: '\uE7C4',
    Items: [
      { UniqueId: 'createmultiplewindows', Image: 'CreateMultipleWindows.png', Icon: '\uE8A7', IsNew: false, IsUpdated: false },
      { UniqueId: 'titlebar', Image: 'TitleBar.png', Icon: '\uE7C4', IsNew: false, IsUpdated: true }
    ]
  }
];

const englishResources: Record<string, string> = enUS;
const officialTitle = (item: GalleryItem) => englishResources[`catalog.item.${item.UniqueId}.title`] ?? item.UniqueId;
const compareItems = (left: GalleryItem, right: GalleryItem) => officialTitle(left).localeCompare(officialTitle(right), 'en-US');

export const getGalleryGroups = (t: GalleryTranslator): GalleryGroup[] => groupDefinitions.map(group => ({
  UniqueId: group.UniqueId,
  Title: t(`catalog.group.${group.UniqueId}`),
  Icon: group.Icon,
  Items: group.Items.map(item => ({
    UniqueId: item.UniqueId,
    Title: t(`catalog.item.${item.UniqueId}.title`),
    Subtitle: t(`catalog.item.${item.UniqueId}.subtitle`),
    ImagePath: `${GALLERY_ASSET_ROOT}/ControlImages/${item.Image}`,
    IsNew: item.IsNew,
    IsUpdated: item.IsUpdated,
    Icon: item.Icon
  })).sort(compareItems)
}));

export const getGalleryItems = (t: GalleryTranslator): GalleryItem[] => getGalleryGroups(t)
  .flatMap(group => group.Items)
  .sort(compareItems);

const headerTileDefinitions = [
  { UniqueId: 'getting-started', Link: 'https://aka.ms/winui-getstarted', Image: 'Header-WinUI.png', Icon: '' },
  { UniqueId: 'design', Link: 'https://learn.microsoft.com/windows/apps/design/', Image: 'Header-WindowsDesign.png', Icon: '' },
  { UniqueId: 'github', Link: 'https://github.com/Furry-Xiyi/WinUIonWeb', Image: '', Icon: 'GitHub' },
  { UniqueId: 'toolkit', Link: 'https://apps.microsoft.com/store/detail/windows-community-toolkit-sample-app/9NBLGGH4TLCQ', Image: 'Header-Toolkit.png', Icon: '' },
  { UniqueId: 'samples', Link: 'https://learn.microsoft.com/windows/apps/get-started/samples', Image: '', Icon: '\uE943' },
  { UniqueId: 'store', Link: 'https://developer.microsoft.com/windows/', Image: '', Icon: '' }
];

export const getHomeHeaderTiles = (t: GalleryTranslator, isDark = false): HomeHeaderTile[] => headerTileDefinitions.map(tile => ({
  UniqueId: tile.UniqueId,
  Title: t(`catalog.home.tile.${tile.UniqueId}.title`),
  Description: t(`catalog.home.tile.${tile.UniqueId}.description`),
  Link: tile.Link,
  ImagePath: tile.UniqueId === 'store'
    ? `${GALLERY_ASSET_ROOT}/HomeHeaderTiles/Header-Store.${isDark ? 'dark' : 'light'}.png`
    : tile.Image ? `${GALLERY_ASSET_ROOT}/HomeHeaderTiles/${tile.Image}` : '',
  Icon: tile.Icon
}));
