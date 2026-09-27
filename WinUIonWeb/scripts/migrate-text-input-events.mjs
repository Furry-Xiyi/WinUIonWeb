import fs from 'node:fs'
const file = new URL('../src/components/TextBox.vue',import.meta.url)
const source = fs.readFileSync(file,'utf8')
fs.writeFileSync(file,source.replace(/emit\('(?!update:)([A-Z][A-Za-z]+)'/g,"dispatch('$1'"))
