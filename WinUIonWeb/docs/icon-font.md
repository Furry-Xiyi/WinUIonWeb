# 图标字体接入

组件继续使用 `Segoe Fluent Icons` 和 `WinUIOnWebIcons` 等原有字体家族名。npm 包不包含字体文件；Windows 11 上浏览器可直接使用系统已安装的 Segoe Fluent Icons，无需额外操作。

如果你**另外取得了允许在目标网站或应用中分发的字体文件许可**，可在 Vite 项目的 `public/fonts/` 放置该文件。例如：

```text
your-vue-app/
├─ public/
│  └─ fonts/
│     └─ SegoeIcons.ttf
└─ src/
   └─ main.ts
```

Vite 会将 `public/fonts/SegoeIcons.ttf` 原样复制到网站的 `fonts/SegoeIcons.ttf`。应用启动时，在挂载控件之前调用字体加载接口：

```ts
import { createApp } from 'vue'
import WinUIOnWeb, { loadWinUIIconFont } from 'winuionweb'
import 'winuionweb/style.css'
import App from './App.vue'

await loadWinUIIconFont(`${import.meta.env.BASE_URL}fonts/SegoeIcons.ttf`)
createApp(App).use(WinUIOnWeb).mount('#app')
```

上例适用于 Vite 的绝对 `base` 路径（如 `/` 或 `/my-app/`）。若使用相对 `base: './'`，请传入在所有页面路由下都能访问的字体绝对 URL。

其他构建工具只需把文件放在其静态资源目录，并将生成的可访问 URL 传给 `loadWinUIIconFont(url)`。接口还接受 `File`、`Blob` 和 `ArrayBuffer`，可供用户在本机选择字体文件后加载。函数返回清理函数，用于从当前 `document.fonts` 移除已注册的字体。

**Windows 系统字体文件的普通使用权不包括再分发权。** 微软的[字体再分发 FAQ](https://learn.microsoft.com/en-us/typography/fonts/font-faq)明确禁止从 Windows 安装目录复制字体文件到 Web 服务器；[Segoe Fluent Icons 说明](https://learn.microsoft.com/en-us/windows/apps/design/iconography/segoe-fluent-icons-font)也说明该字体不能随应用发送到其他平台。因此不要仅凭本机 Windows 授权，把从系统提取或网上下载的 `SegoeIcons.ttf` 放进公开网站、应用或 npm 包。上述静态资源方式只适用于已取得相应分发许可的文件。包的法律信息见 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)。
