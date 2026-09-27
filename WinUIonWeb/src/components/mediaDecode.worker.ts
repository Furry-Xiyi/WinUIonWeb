type FFmpegCore = {
  FS: {
    writeFile: (name: string, data: Uint8Array) => void;
    readFile: (name: string) => Uint8Array;
    unlink: (name: string) => void;
  };
  exec: (...arguments_: string[]) => void;
  ret: number;
  reset: () => void;
  setTimeout: (milliseconds: number) => void;
};

const decoderVersion = '0.12.10';
const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<{ id: number; bytes: ArrayBuffer }>) => void) | null;
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
};
let corePromise: Promise<FFmpegCore> | null = null;

const loadCore = async (): Promise<FFmpegCore> => {
  for (const provider of ['https://cdn.jsdelivr.net/npm', 'https://unpkg.com']) {
    const directory = `${provider}/@ffmpeg/core@${decoderVersion}/dist/esm`;
    let scriptUrl = '';
    try {
      const [scriptResponse, wasmResponse] = await Promise.all([
        fetch(`${directory}/ffmpeg-core.js`, { signal: AbortSignal.timeout(45000) }),
        fetch(`${directory}/ffmpeg-core.wasm`, { signal: AbortSignal.timeout(45000) })
      ]);
      if (!scriptResponse.ok || !wasmResponse.ok) throw new Error('Media decoder download failed.');
      const [script, wasmBinary] = await Promise.all([scriptResponse.blob(), wasmResponse.arrayBuffer()]);
      scriptUrl = URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));
      const { default: createFFmpegCore } = await import(/* @vite-ignore */ scriptUrl);
      return await createFFmpegCore({
        wasmBinary: new Uint8Array(wasmBinary),
        // Emscripten resolves companion files relative to this module marker.
        mainScriptUrlOrBlob: `${directory}/ffmpeg-core.js#${btoa(JSON.stringify({ wasmURL: `${directory}/ffmpeg-core.wasm` }))}`
      });
    } catch {
      // Try the other host for the same pinned upstream package.
    } finally {
      if (scriptUrl) URL.revokeObjectURL(scriptUrl);
    }
  }
  throw new Error('Media decoder is unavailable.');
};

workerScope.onmessage = async ({ data }) => {
  const input = 'source.wmv';
  const output = 'playback.mp4';
  let core: FFmpegCore | null = null;
  try {
    corePromise ||= loadCore();
    core = await corePromise;
    core.FS.writeFile(input, new Uint8Array(data.bytes));
    core.setTimeout(60000);
    core.exec('-i', input, '-map', '0:v:0', '-map', '0:a:0?',
      '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '20', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '128k', '-fps_mode', 'vfr', '-movflags', '+faststart', '-threads', '1', output);
    if (core.ret !== 0) throw new Error('Media conversion failed.');
    const converted = core.FS.readFile(output);
    const bytes = converted.slice().buffer;
    workerScope.postMessage({ id: data.id, bytes }, [bytes]);
  } catch {
    workerScope.postMessage({ id: data.id, error: true });
    if (!core) corePromise = null;
  } finally {
    if (core) {
      for (const name of [input, output]) {
        try { core.FS.unlink(name); } catch { /* An unsuccessful conversion may not create its output. */ }
      }
      core.reset();
    }
  }
};

export {};
