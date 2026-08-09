// 官方对应：WinUIGallery/Helpers/ControlInfoDataSource.cs + SampleSupport/Data/ControlInfoData.json（控件数据源）。
// Web 版用静态索引实现搜索。
import enUS from './Strings/en-US/Resources';
import zhCN from './Strings/zh-CN/Resources';
import type { Locale } from '../components/i18n/index';

export interface SearchItem {
  tag: string;
  en: string;
  zh: string;
}

const LABEL_KEYS: Record<string, string> = {
  radiobutton: 'text.radiobuttons',
  rating: 'text.ratingcontrol',
  captureelement: 'text.capture-element-camera',
  xamlresources: 'text.resources',
  xamlstyles: 'text.style',
  animatedicon: 'text.animated-icon',
  compactsizing: 'text.compact-sizing',
  iconelement: 'text.icon-element',
  radialgradientbrush: 'text.radial-gradient-brush',
  systembackdrops: 'text.system-backdrops',
  themeshadow: 'text.theme-shadow'
};

const TAGS = [
  'home', 'button', 'calendardatepicker', 'calendarview', 'datepicker',
  'dropdownbutton', 'hyperlinkbutton', 'repeatbutton', 'togglebutton',
  'splitbutton', 'togglesplitbutton', 'checkbox', 'colorpicker', 'combobox',
  'radiobutton', 'rating', 'slider', 'timepicker', 'toggleswitch', 'border',
  'canvas', 'expander', 'grid', 'parallaxview', 'relativepanel', 'scrollview',
  'scrollviewer', 'splitview', 'stackpanel', 'variablesizedwrapgrid', 'viewbox',
  'flipview', 'gridview', 'itemsrepeater', 'itemsview', 'listbox', 'listview',
  'pulltorefresh', 'treeview', 'pipspager', 'semanticzoom',
  'animatedvisualplayer', 'captureelement', 'image', 'mediaplayerelement',
  'personpicture', 'appbarbutton', 'appbarseparator', 'toggleappbarbutton', 'commandbar', 'contentdialog', 'commandbarflyout', 'flyout',
  'menubar', 'menuflyout', 'swipecontrol', 'standarduicommand',
  'xamluicommand', 'popup', 'teachingtip', 'tooltip', 'infobadge', 'infobar',
  'progressbar', 'progressring', 'breadcrumbbar', 'navigationview', 'pivot',
  'selectorbar', 'autosuggestbox', 'numberbox', 'passwordbox', 'richeditbox',
  'richtextblock', 'textbox', 'textblock', 'settings', 'xamlresources',
  'xamlstyles', 'geometry', 'iconography', 'typography', 'acrylic',
  'animatedicon', 'compactsizing', 'iconelement', 'line',
  'radialgradientbrush', 'systembackdrops', 'themeshadow', 'colors'
];

const resolveLabel = (resources: Record<string, string>, tag: string) => (
  resources[LABEL_KEYS[tag] ?? `text.${tag}`] ?? tag
);

const enLabels: Record<string, string> = enUS;
const zhLabels: Record<string, string> = zhCN;

export const searchIndex: SearchItem[] = TAGS.map((tag) => ({
  tag,
  en: resolveLabel(enLabels, tag),
  zh: resolveLabel(zhLabels, tag)
}));

const makeCollator = (locale: Locale) => new Intl.Collator(
  locale === 'zh-CN' ? 'zh-CN-u-co-pinyin' : 'en-US',
  { sensitivity: 'base' }
);

export const searchAll = (query: string, locale: Locale): SearchItem[] => {
  const normalizedQuery = query.trim().toLowerCase();
  const collator = makeCollator(locale);
  const nameKey = locale === 'zh-CN' ? 'zh' : 'en';
  const compare = (a: SearchItem, b: SearchItem) => (
    collator.compare(a[nameKey], b[nameKey]) || a.tag.localeCompare(b.tag)
  );

  if (!normalizedQuery) return [...searchIndex].sort(compare);

  return searchIndex
    .filter((item) => (
      item.en.toLowerCase().includes(normalizedQuery) ||
      item.zh.toLowerCase().includes(normalizedQuery) ||
      item.tag.toLowerCase().includes(normalizedQuery)
    ))
    .sort(compare);
};
