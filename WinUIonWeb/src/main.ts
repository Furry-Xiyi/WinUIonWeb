import { createApp } from 'vue'
import App from './gallery/App.vue'
import './styles/theme.css'
import manifestTemplate from './manifest.json'
import { createI18n, i18nKey } from './components/i18n'
import galleryEnUS from './gallery/Strings/en-US/Resources'
import galleryZhCN from './gallery/Strings/zh-CN/Resources'

const i18n = createI18n(navigator.language, {
  'en-US': galleryEnUS,
  'zh-CN': galleryZhCN
})

const manifestResources = manifestTemplate.resources ?? {}
const appTitleKey = manifestResources.title ?? 'app.title'
document.title = i18n.t(appTitleKey)

const app = createApp(App)
app.provide(i18nKey, i18n)
app.config.globalProperties.$t = i18n.t
app.mount('#app')

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
