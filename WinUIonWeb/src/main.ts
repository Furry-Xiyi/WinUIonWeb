import { createApp } from 'vue'
import App from './gallery/App.vue'
import './styles/theme.css'
import manifestTemplate from './manifest.json'
import appIconUrl from './assets/AppIcon.ico?url'
import { createI18n, i18nKey } from './components/i18n/index'
import galleryEnUS from './gallery/Strings/en-US/Resources'
import galleryZhCN from './gallery/Strings/zh-CN/Resources'

const i18n = createI18n(navigator.language, {
  'en-US': galleryEnUS,
  'zh-CN': galleryZhCN
})

const manifestResources = manifestTemplate.resources ?? {}
const appTitleKey = manifestResources.title ?? 'app.title'
document.title = i18n.t(appTitleKey)

const resolvedManifest = {
  ...manifestTemplate,
  name: i18n.t(manifestResources.name ?? appTitleKey),
  short_name: i18n.t(manifestResources.shortName ?? 'app.shortTitle'),
  start_url: import.meta.env.BASE_URL,
  icons: manifestTemplate.icons.map((icon) => ({
    ...icon,
    src: icon.src === '@app-icon' ? appIconUrl : icon.src
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
app.provide(i18nKey, i18n)
app.config.globalProperties.$t = i18n.t
app.mount('#app')

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
