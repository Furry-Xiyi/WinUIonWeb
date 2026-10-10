# WinUI on Web 组件库

面向 Vue 3 的 WinUI 风格控件。npm 包只包含控件、控件运行时和样式；Gallery 页面、示例组件、路由与 PWA 窗口宿主不在包中。

```sh
npm install winuionweb
```

在应用入口安装插件并导入样式。插件会注册 `Button`、`TextBlock` 等基础控件，以及 `Button.Flyout`、`Grid.RowDefinitions` 等 Gallery 风格的属性元素。

```ts
// src/main.ts
import { createApp } from 'vue'
import WinUIOnWeb from 'winuionweb'
import 'winuionweb/style.css'
import App from './App.vue'

createApp(App).use(WinUIOnWeb, { locale: 'zh-CN' }).mount('#app')
```

```vue
<template>
  <StackPanel Spacing="12">
    <TextBlock Text="欢迎使用 WinUI on Web" FontSize="20" />
    <Button Content="确定" />
    <ToggleSwitch Header="接收通知" />
  </StackPanel>
</template>
```

也可以按需局部导入控件：`import { Button, TextBlock } from 'winuionweb'`。仍需导入 `winuionweb/style.css`，并根据所用控件注册相应的属性元素；完整的 Gallery 风格标签推荐使用插件。

点号属性标签在 Vue 模板中会被当成组件成员访问。若项目启用了 `vue-tsc`，请像 Gallery 页面一样在使用该标签的 `<script setup>` 中导入基础控件；插件仍负责运行时全局注册：

```vue
<script setup lang="ts">
import { Button } from 'winuionweb'
</script>

<template>
  <Button Content="更多选项">
    <Button.Flyout>
      <MenuFlyout>
        <MenuFlyoutItem Text="打开" />
      </MenuFlyout>
    </Button.Flyout>
  </Button>
</template>
```

Gallery 的 Vue 页面还使用 `{x:Bind ...}`、`x:Name` 和 `Click="处理函数名"`。这些字符串绑定需要宿主组件提供作用域，不能仅靠安装插件自动取得页面的变量。下面是与 Gallery 相同的用法：

```vue
<script setup lang="ts">
import { provide, ref, shallowReactive } from 'vue'
import { xamlNameScopeKey, xamlScopeKey } from 'winuionweb'

const message = ref('请点击按钮')
const onConfirm = () => { message.value = '已确认' }
provide(xamlScopeKey, { message, onConfirm })
provide(xamlNameScopeKey, shallowReactive({}))
</script>

<template>
  <StackPanel Spacing="8">
    <TextBlock Text="{x:Bind message, Mode=OneWay}" />
    <Button Content="确定" Click="onConfirm" />
  </StackPanel>
</template>
```

在 Vite 生产构建中使用这些绑定时，建议沿用 Gallery 的 Vue 插件配置，使控件内部的 setup 状态对绑定运行时可见：

```ts
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue({ features: { prodDevtools: true } })]
}
```

Gallery 中 `samples/**/*.txt` 展示的是原生 WinUI XAML 和部分 C#，不能直接粘贴到 Vue 项目。Vue 写法可参考[源码仓库](https://github.com/Furry-Xiyi/WinUIonWeb)的 `WinUIonWeb/src/gallery/pages/*.vue` 页面及其状态和事件处理逻辑；这些页面和 `ControlExample`、`SampleCodePresenter` 等示例组件不随包发布。

控件样式使用主题 CSS 变量，可在容器上设置 `class="win-theme-scope theme-dark"` 或 `class="win-theme-scope theme-light"`。图标默认使用客户端本机安装的 `Segoe Fluent Icons`。若你有合法可分发的字体文件，可把它放在自己的应用 `public/fonts/` 目录，再调用 `loadWinUIIconFont(url)` 加载。具体路径、代码和授权限制见 [图标字体接入文档](docs/icon-font.md)。npm 包不包含从 Windows 提取的字体文件；法律信息见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

本包提供 ESM 入口。本仓库维护者发布新版本时，在 `WinUIonWeb/` 目录执行：

```sh
npm ci
npm run build:lib
npm pack --dry-run
npm login
npm publish --access public
```

发布前先递增 `package.json` 的版本，并核对 `npm pack --dry-run` 清单。`npm run build` 仍用于构建 Gallery 站点；`npm run build:lib` 只构建可发布的组件库。许可证为 [GPL-3.0-only](LICENSE)。
