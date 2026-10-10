import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist-lib/', import.meta.url))
const forbiddenComponent = /(?:^|[/\\])(?:ControlExample(?:Base|Properties)?|HorizontalScrollContainer|PageHeader|SampleCodePresenter|ThemeWrapper|TypographyRow)(?:\.vue)?(?:\.|[/\\]|$)/i

for (const required of ['index.js', 'style.css', 'types/index.d.ts']) {
  await access(path.join(root, required))
}

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const children = await Promise.all(entries.map(entry => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? filesIn(fullPath) : [fullPath]
  }))
  return children.flat()
}

for (const file of await filesIn(root)) {
  const relative = path.relative(root, file).replaceAll('\\', '/')
  if (/\.(?:ttf|otf|woff2?)$/i.test(relative) || forbiddenComponent.test(relative)) {
    throw new Error(`Non-library file found in npm build: ${relative}`)
  }
  if (relative.endsWith('.map')) {
    const map = JSON.parse(await readFile(file, 'utf8'))
    for (const source of map.sources ?? []) {
      if (/(?:^|[/\\])gallery[/\\]/i.test(source) || forbiddenComponent.test(source)) {
        throw new Error(`Gallery source found in npm build: ${source}`)
      }
    }
  }
  if (relative.endsWith('.css')) {
    const css = await readFile(file, 'utf8')
    if (/SEGOEICONS\.TTF/i.test(css)) {
      throw new Error(`Windows font URL found in npm build: ${relative}`)
    }
  }
  if (relative.endsWith('.d.ts')) {
    const declaration = await readFile(file, 'utf8')
    if (/^import[ \t]+['"][^'"\r\n]+\.css['"];?/m.test(declaration)) {
      throw new Error(`Unpublished CSS import found in declaration: ${relative}`)
    }
  }
  if (relative.endsWith('.js') && !relative.endsWith('.worker.js')) {
    const source = await readFile(file, 'utf8')
    if (/\/assets\/mediaDecode\.worker/i.test(source)) {
      throw new Error(`Root-relative Worker URL found in npm build: ${relative}`)
    }
  }
}

console.log('Library artifact has its entry points and contains no Gallery components, Windows font files, unresolved CSS declarations, or root-relative media Worker URL.')
