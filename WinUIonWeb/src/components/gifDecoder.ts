/** Browser equivalent of the composited GIF frames used by WinUI's imaging service. */
export type GifFrame = { image: CanvasImageSource; duration: number }
export type GifImage = { width: number; height: number; frames: GifFrame[]; repetitions: number; dispose: () => void }

type DecoderFrame = CanvasImageSource & { duration?: number; close?: () => void }
type BrowserImageDecoder = {
  tracks: { ready: Promise<void>; selectedTrack?: { frameCount: number; repetitionCount: number } }
  decode: (options: { frameIndex: number; completeFramesOnly: boolean }) => Promise<{ image: DecoderFrame }>
  close: () => void
}

const canvas = (width: number, height: number): HTMLCanvasElement => {
  const result = document.createElement('canvas')
  result.width = width
  result.height = height
  return result
}

async function decodeWithBrowser(data: ArrayBuffer): Promise<GifImage | null> {
  const Decoder = (globalThis as unknown as { ImageDecoder?: new (options: Record<string, unknown>) => BrowserImageDecoder }).ImageDecoder
  if (!Decoder) return null
  const decoder = new Decoder({ data: data.slice(0), type: 'image/gif', preferAnimation: true })
  const frames: GifFrame[] = []
  try {
    await decoder.tracks.ready
    const track = decoder.tracks.selectedTrack
    if (!track?.frameCount) return null
    let width = 0
    let height = 0
    for (let index = 0; index < track.frameCount; index += 1) {
      const { image } = await decoder.decode({ frameIndex: index, completeFramesOnly: true })
      const frameWidth = Number((image as unknown as { displayWidth?: number; width?: number }).displayWidth ?? (image as unknown as { width?: number }).width)
      const frameHeight = Number((image as unknown as { displayHeight?: number; height?: number }).displayHeight ?? (image as unknown as { height?: number }).height)
      const surface = canvas(frameWidth, frameHeight)
      surface.getContext('2d')?.drawImage(image, 0, 0)
      frames.push({ image: surface, duration: Math.max(20, Number(image.duration ?? 100000) / 1000) })
      width = frameWidth
      height = frameHeight
      image.close?.()
    }
    return { width, height, frames, repetitions: Number.isFinite(track.repetitionCount) ? Math.max(1, track.repetitionCount + 1) : Infinity, dispose: () => frames.splice(0) }
  } finally {
    decoder.close()
  }
}

const readLzw = (bytes: Uint8Array, minimumSize: number, length: number): Uint8Array => {
  const clear = 1 << minimumSize
  const end = clear + 1
  const dictionary: number[][] = []
  let size = minimumSize + 1
  let bits = 0
  let previous: number[] | undefined
  const output: number[] = []
  const reset = () => {
    dictionary.length = 0
    for (let index = 0; index < clear; index += 1) dictionary.push([index])
    dictionary.push([], [])
    size = minimumSize + 1
    previous = undefined
  }
  const readCode = () => {
    let code = 0
    for (let index = 0; index < size; index += 1) {
      const bit = bits++
      code |= (((bytes[bit >> 3] ?? 0) >> (bit & 7)) & 1) << index
    }
    return code
  }
  reset()
  while (bits + size <= bytes.length * 8 && output.length < length) {
    const code = readCode()
    if (code === clear) { reset(); continue }
    if (code === end) break
    const entry = dictionary[code] ?? (code === dictionary.length && previous ? [...previous, previous[0]!] : undefined)
    if (!entry?.length) throw new Error('Invalid GIF LZW data')
    output.push(...entry)
    if (previous && dictionary.length < 4096) {
      dictionary.push([...previous, entry[0]!])
      if (dictionary.length === 1 << size && size < 12) size += 1
    }
    previous = entry
  }
  return Uint8Array.from(output.slice(0, length))
}

/**
 * Safari and Firefox do not expose ImageDecoder. Read the same palette, LZW,
 * transparency, interlace and disposal data there so Stop freezes an actual
 * frame and Play resumes from that frame rather than restarting an <img> URL.
 */
export function decodeGifData(data: ArrayBuffer): GifImage {
  const bytes = new Uint8Array(data)
  let offset = 0
  const byte = () => {
    if (offset >= bytes.length) throw new Error('Incomplete GIF data')
    return bytes[offset++]!
  }
  const word = () => byte() | byte() << 8
  const take = (count: number) => {
    if (offset + count > bytes.length) throw new Error('Incomplete GIF data')
    const result = bytes.slice(offset, offset + count)
    offset += count
    return result
  }
  const blocks = () => {
    const parts: Uint8Array[] = []
    for (let count = byte(); count > 0; count = byte()) parts.push(take(count))
    return Uint8Array.from(parts.flatMap(part => Array.from(part)))
  }
  const header = String.fromCharCode(...take(6))
  if (header !== 'GIF87a' && header !== 'GIF89a') throw new Error('The source is not a GIF')
  const width = word()
  const height = word()
  if (!width || !height) throw new Error('Invalid GIF dimensions')
  const packed = byte()
  const backgroundIndex = byte()
  byte()
  const globalPalette = packed & 0x80 ? take(3 * (1 << ((packed & 7) + 1))) : new Uint8Array()
  const composite = new Uint8ClampedArray(width * height * 4)
  const frames: GifFrame[] = []
  let disposal = 0
  let delay = 100
  let transparent: number | undefined
  let repetitions = 1
  let previous: { disposal: number; left: number; top: number; width: number; height: number; snapshot?: Uint8ClampedArray; transparent?: number } | undefined

  while (offset < bytes.length) {
    const marker = byte()
    if (marker === 0x3b) break
    if (marker === 0x21) {
      const label = byte()
      if (label === 0xf9) {
        const length = byte()
        if (length !== 4) throw new Error('Invalid GIF control extension')
        const flags = byte()
        disposal = flags >> 2 & 7
        const centiseconds = word()
        delay = centiseconds < 2 ? 100 : centiseconds * 10
        const index = byte()
        transparent = flags & 1 ? index : undefined
        byte()
      } else if (label === 0xff) {
        const application = String.fromCharCode(...take(byte()))
        const extension = blocks()
        if ((application === 'NETSCAPE2.0' || application === 'ANIMEXTS1.0') && extension[0] === 1) {
          const loops = (extension[1] ?? 0) | (extension[2] ?? 0) << 8
          repetitions = loops === 0 ? Infinity : loops + 1
        }
      } else blocks()
      continue
    }
    if (marker !== 0x2c) throw new Error('Invalid GIF block')
    if (previous?.disposal === 2) {
      for (let y = previous.top; y < Math.min(height, previous.top + previous.height); y += 1) {
        for (let x = previous.left; x < Math.min(width, previous.left + previous.width); x += 1) {
          const index = (y * width + x) * 4
          if (previous.transparent !== undefined) composite.fill(0, index, index + 4)
          else {
            composite[index] = globalPalette[backgroundIndex * 3] ?? 0
            composite[index + 1] = globalPalette[backgroundIndex * 3 + 1] ?? 0
            composite[index + 2] = globalPalette[backgroundIndex * 3 + 2] ?? 0
            composite[index + 3] = 255
          }
        }
      }
    } else if (previous?.disposal === 3 && previous.snapshot) composite.set(previous.snapshot)

    const left = word()
    const top = word()
    const frameWidth = word()
    const frameHeight = word()
    const descriptor = byte()
    const palette = descriptor & 0x80 ? take(3 * (1 << ((descriptor & 7) + 1))) : globalPalette
    const minimum = byte()
    const indices = readLzw(blocks(), minimum, frameWidth * frameHeight)
    if (indices.length !== frameWidth * frameHeight) throw new Error('Incomplete GIF frame')
    if (!frames.length && transparent === undefined) {
      for (let index = 0; index < composite.length; index += 4) {
        composite[index] = globalPalette[backgroundIndex * 3] ?? 0
        composite[index + 1] = globalPalette[backgroundIndex * 3 + 1] ?? 0
        composite[index + 2] = globalPalette[backgroundIndex * 3 + 2] ?? 0
        composite[index + 3] = 255
      }
    }
    const snapshot = disposal === 3 ? composite.slice() : undefined
    const rows: number[] = []
    if (descriptor & 0x40) {
      for (const [start, step] of [[0, 8], [4, 8], [2, 4], [1, 2]] as const) {
        for (let y = start; y < frameHeight; y += step) rows.push(y)
      }
    } else for (let y = 0; y < frameHeight; y += 1) rows.push(y)
    for (let y = 0; y < frameHeight; y += 1) {
      const targetY = top + rows[y]!
      for (let x = 0; x < frameWidth; x += 1) {
        const color = indices[y * frameWidth + x]
        if (color === undefined || color === transparent || left + x >= width || targetY >= height) continue
        const target = (targetY * width + left + x) * 4
        composite[target] = palette[color * 3] ?? 0
        composite[target + 1] = palette[color * 3 + 1] ?? 0
        composite[target + 2] = palette[color * 3 + 2] ?? 0
        composite[target + 3] = 255
      }
    }
    const surface = canvas(width, height)
    surface.getContext('2d')?.putImageData(new ImageData(composite.slice(), width, height), 0, 0)
    frames.push({ image: surface, duration: delay })
    previous = { disposal, left, top, width: frameWidth, height: frameHeight, snapshot, transparent }
    disposal = 0
    delay = 100
    transparent = undefined
  }
  if (!frames.length) throw new Error('The GIF has no image frames')
  return { width, height, frames, repetitions, dispose: () => frames.splice(0) }
}

export async function decodeGif(data: ArrayBuffer): Promise<GifImage> {
  try {
    const decoded = await decodeWithBrowser(data)
    if (decoded) return decoded
  } catch {
    // A valid GIF may use a feature absent from a browser's decoder. The
    // deterministic decoder is also needed in browsers without WebCodecs.
  }
  return decodeGifData(data)
}
