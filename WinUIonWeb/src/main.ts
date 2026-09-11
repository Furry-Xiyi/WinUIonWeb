import { createApp } from 'vue'
import App from './gallery/App.vue'
import router from './gallery/router'
import './styles/theme.css'
import manifestTemplate from './manifest.json'
import appIconUrl from './assets/AppIcon.ico?url'
import appIcon180Url from './assets/AppIcon-180.png?url'
import appIcon192Url from './assets/AppIcon-192.png?url'
import appIcon512Url from './assets/AppIcon-512.png?url'
import { createI18n, i18nKey } from './components/i18n/index'
import galleryEnUS from './gallery/Strings/en-US/Resources'
import galleryZhCN from './gallery/Strings/zh-CN/Resources'
import Canvas from './components/Canvas.vue'
import { ButtonFlyout } from './components/Button.vue'
import ControlExample from './components/ControlExample.vue'
import ColumnDefinition from './components/ColumnDefinition.vue'
import Grid from './components/Grid.vue'
import GridColumnDefinitions from './components/GridColumnDefinitions.vue'
import GridRowDefinitions from './components/GridRowDefinitions.vue'
import RelativePanel from './components/RelativePanel.vue'
import RowDefinition from './components/RowDefinition.vue'
import StackPanel from './components/StackPanel.vue'
import VariableSizedWrapGrid from './components/VariableSizedWrapGrid.vue'
import Border from './components/Border.vue'
import Rectangle from './components/Rectangle.vue'
import Image from './components/Image.vue'
import FontIcon from './components/FontIcon.vue'
import SymbolIcon from './components/SymbolIcon.vue'
import Flyout from './components/Flyout.vue'
import ContentDialog from './components/ContentDialog.vue'
import Popup from './components/Popup.vue'
import TeachingTip from './components/TeachingTip.vue'
import ToolTip from './components/ToolTip.vue'
import { SplitButtonFlyout } from './components/SplitButton.vue'
import { ToolTipServiceToolTip } from './components/ToolTipServiceProperties'
import { ToggleSplitButtonFlyout } from './components/ToggleSplitButton.vue'
import Expander from './components/Expander.vue'
import { DropDownButtonContent, DropDownButtonFlyout, MenuFlyout, MenuFlyoutItem, MenuFlyoutItemIcon } from './components/DropDownButtonProperties'
import {
  ControlExampleExample,
  ControlExampleOptions,
  ControlExampleOutput
} from './components/ControlExampleProperties'
import {
  ExpanderContent,
  ExpanderDescription,
  ExpanderHeader,
  ExpanderHeaderControls,
  ExpanderHeaderIcon
} from './components/ExpanderProperties'

const i18n = createI18n(navigator.language, {
  'en-US': galleryEnUS,
  'zh-CN': galleryZhCN
})

const manifestResources = manifestTemplate.resources ?? {}
const appTitleKey = manifestResources.title ?? 'app.title'
const appAuthorKey = manifestTemplate.author ?? 'app.author'
const appVersionKey = manifestTemplate.version ?? 'app.version'
document.documentElement.lang = i18n.locale
document.title = i18n.t(appTitleKey)

// The manifest is served from a blob URL, so root-relative values would be
// resolved against the blob and rejected by browsers. Resolve every URL
// against the page URL before serializing the manifest.
const resolveManifestUrl = (value: string) => new URL(value, window.location.href).href
const manifestIconUrls: Record<string, string> = {
  '@app-icon': appIconUrl,
  '@app-icon-180': appIcon180Url,
  '@app-icon-192': appIcon192Url,
  '@app-icon-512': appIcon512Url
}

const resolvedManifest = {
  ...manifestTemplate,
  name: i18n.t(manifestResources.name ?? appTitleKey),
  short_name: i18n.t(manifestResources.shortName ?? 'app.shortTitle'),
  author: i18n.t(appAuthorKey),
  version: i18n.t(appVersionKey),
  start_url: resolveManifestUrl(import.meta.env.BASE_URL),
  icons: manifestTemplate.icons.map((icon) => ({
    ...icon,
    src: resolveManifestUrl(manifestIconUrls[icon.src] ?? icon.src)
  }))
}

const manifestLink = document.createElement('link')
manifestLink.rel = 'manifest'
manifestLink.href = URL.createObjectURL(new Blob(
  [JSON.stringify(resolvedManifest)],
  { type: 'application/manifest+json' }
))
document.head.appendChild(manifestLink)

const app = createApp(App)
app.use(router)
// Layout controls use their XAML type names at the application boundary.
app.component('Grid', Grid)
app.component('Button.Flyout', ButtonFlyout)
app.component('StackPanel', StackPanel)
app.component('Canvas', Canvas)
app.component('RelativePanel', RelativePanel)
app.component('VariableSizedWrapGrid', VariableSizedWrapGrid)
app.component('Border', Border)
app.component('Rectangle', Rectangle)
app.component('Image', Image)
app.component('FontIcon', FontIcon)
app.component('SymbolIcon', SymbolIcon)
app.component('SymbolIconSource', SymbolIcon)
app.component('Flyout', Flyout)
app.component('ContentDialog', ContentDialog)
app.component('Popup', Popup)
app.component('TeachingTip', TeachingTip)
app.component('ToolTip', ToolTip)
app.component('ToolTipService.ToolTip', ToolTipServiceToolTip)
app.component('ControlExample', ControlExample)
app.component('ControlExample.Example', ControlExampleExample)
app.component('ControlExample.Output', ControlExampleOutput)
app.component('ControlExample.Options', ControlExampleOptions)
app.component('Expander', Expander)
app.component('Expander.Header', ExpanderHeader)
app.component('Expander.Content', ExpanderContent)
app.component('Expander.Description', ExpanderDescription)
app.component('Expander.HeaderIcon', ExpanderHeaderIcon)
app.component('Expander.HeaderControls', ExpanderHeaderControls)
app.component('DropDownButton.Flyout', DropDownButtonFlyout)
app.component('DropDownButton.Content', DropDownButtonContent)
app.component('MenuFlyout', MenuFlyout)
app.component('MenuFlyoutItem', MenuFlyoutItem)
app.component('MenuFlyoutItem.Icon', MenuFlyoutItemIcon)
app.component('SplitButton.Flyout', SplitButtonFlyout)
app.component('ToggleSplitButton.Flyout', ToggleSplitButtonFlyout)
app.component('ColumnDefinition', ColumnDefinition)
app.component('RowDefinition', RowDefinition)
app.component('Grid.ColumnDefinitions', GridColumnDefinitions)
app.component('Grid.RowDefinitions', GridRowDefinitions)
app.provide(i18nKey, i18n)
app.config.globalProperties.$t = i18n.t
app.mount('#app')

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
