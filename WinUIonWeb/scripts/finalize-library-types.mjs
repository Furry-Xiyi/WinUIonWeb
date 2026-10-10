import { existsSync } from 'node:fs'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const typesRoot = fileURLToPath(new URL('../dist-lib/types/', import.meta.url))
const entry = path.join(typesRoot, 'index.d.ts')
const original = await readFile(entry, 'utf8')

// vue-tsc cannot emit declarations for a few JavaScript SFCs, and some
// generated Vue internals are not portable across consumer TS configurations.
// Preserve the detailed declarations that work and use Vue's Component type
// for the remaining named exports.
const genericTypes = new Set(['MenuBar', 'MenuBarItem', 'ThemeShadow'])
let replacements = 0
const declaration = original.replace(
  /^export \{ default as (\w+) \} from '(\.\/components\/[^']+\.vue)';$/gm,
  (line, name, modulePath) => {
    const emitted = path.join(typesRoot, `${modulePath}.d.ts`)
    if (existsSync(emitted) && !genericTypes.has(name)) return line
    replacements++
    return `export declare const ${name}: import('vue').Component;`
  }
)
if (replacements === 0) throw new Error('No library component declarations were finalized')
await writeFile(entry, declaration, 'utf8')

// CSS is shipped as the separate style.css export. Declaration-only output
// does not include the source CSS paths, so strict consumers must not resolve
// these side-effect imports from .d.ts files.
async function* declarationFiles(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name)
    if (item.isDirectory()) yield* declarationFiles(file)
    else if (item.name.endsWith('.d.ts')) yield file
  }
}

let cssImportsRemoved = 0
for await (const file of declarationFiles(typesRoot)) {
  const content = await readFile(file, 'utf8')
  const cleaned = content.replace(/^import[ \t]+['"][^'"\r\n]+\.css['"];?\r?\n?/gm, () => {
    cssImportsRemoved++
    return ''
  })
  if (cleaned !== content) await writeFile(file, cleaned, 'utf8')
}
if (cssImportsRemoved === 0) throw new Error('No CSS-only declaration imports were removed')
console.log(`Finalized ${replacements} component declarations and removed ${cssImportsRemoved} CSS imports for npm consumers.`)
