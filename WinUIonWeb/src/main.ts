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
app.provide(i18nKey, i18n)
app.config.globalProperties.$t = i18n.t
app.mount('#app')

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
