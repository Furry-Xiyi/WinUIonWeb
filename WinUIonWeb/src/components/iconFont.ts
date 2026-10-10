/** Font families referenced by the controls' existing CSS. */
const iconFontFamilies = [
  'Segoe Fluent Icons',
  'WinUIOnWebIcons',
  'WinUIOnWebFontIcons',
  'WinUIOnWebNavigationIcons',
  'WinUIOnWebSymbolIcons'
] as const

export type WinUIIconFontSource = string | URL | Blob | ArrayBuffer

/**
 * Load an icon font supplied by the host application. The npm package does not
 * contain a font file; callers must have the right to use and distribute it.
 * Returns a function that removes the registered faces from the document.
 */
export async function loadWinUIIconFont(
  source: WinUIIconFontSource,
  targetDocument?: Document
): Promise<() => void> {
  const host = targetDocument ?? (typeof document === 'undefined' ? undefined : document)
  if (!host || typeof FontFace === 'undefined' || !host.fonts) {
    throw new Error('FontFace API is not available in this environment')
  }

  const data = typeof source === 'string' || source instanceof URL
    ? `url(${JSON.stringify(new URL(String(source), host.baseURI).href)})`
    : source instanceof Blob ? await source.arrayBuffer() : source
  const faces = iconFontFamilies.map(family => new FontFace(family, data, { display: 'block' }))
  await Promise.all(faces.map(face => face.load()))
  for (const face of faces) host.fonts.add(face)
  return () => { for (const face of faces) host.fonts.delete(face) }
}
