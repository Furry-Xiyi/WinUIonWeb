此文件解释 Visual Studio 如何创建项目。

以下工具用于生成此项目:
- create-vite

以下为生成此项目的步骤:
- 使用 create-vite: `npm init --yes vue@latest winuionweb -- --eslint  --typescript ` 创建 vue 项目。
- 正在使用端口更新 `vite.config.ts`。
- 为基本类型添加 `shims-vue.d.ts`。
- 创建项目文件 (`winuionweb.esproj`)。
- 创建 `launch.json` 以启用调试。
- 向解决方案添加项目。
- 写入此文件。
