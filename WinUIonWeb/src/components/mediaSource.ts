import MediaDecodeWorker from './mediaDecode.worker.ts?worker&inline';

const cacheName = 'WinUIonWeb.media.vc1-h264-aac.v1';
const maximumInputSize = 32 * 1024 * 1024;
const convertedSources = new Map<string, Promise<Blob>>();
let decodeQueue: Promise<unknown> = Promise.resolve();
let decodeWorker: Worker | null = null;
let workerIdleTimer: ReturnType<typeof setTimeout> | undefined;
let requestId = 0;

const downloadSource = async (source: string): Promise<ArrayBuffer> => {
  const addresses = [source];
  const official = source.match(/^https:\/\/raw\.githubusercontent\.com\/microsoft\/WinUI-Gallery\/(main|[a-f0-9]{40})\/(.+)$/i);
  if (official) addresses.push(`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@${official[1]}/${official[2]}`);
  for (const address of addresses) {
    try {
      const response = await fetch(address, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) continue;
      const declaredSize = Number(response.headers.get('Content-Length'));
      if (declaredSize > maximumInputSize) throw new Error('Media source is too large for software decoding.');
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength > 0 && bytes.byteLength <= maximumInputSize) return bytes;
    } catch {
      // The official GitHub CDN mirror serves the same source bytes.
    }
  }
  throw new Error('Media source download failed.');
};

const decode = (bytes: ArrayBuffer): Promise<Blob> => new Promise((resolve, reject) => {
  if (workerIdleTimer) clearTimeout(workerIdleTimer);
  const worker = decodeWorker ||= new MediaDecodeWorker();
  const id = ++requestId;
  const finish = (error?: Error, result?: Blob) => {
    clearTimeout(timeout);
    worker.removeEventListener('message', onMessage);
    worker.removeEventListener('error', onError);
    if (error) {
      worker.terminate();
      if (decodeWorker === worker) decodeWorker = null;
      reject(error);
    } else {
      resolve(result!);
      // Keep the loaded core for the second Gallery video, then free its heap.
      workerIdleTimer = setTimeout(() => {
        worker.terminate();
        if (decodeWorker === worker) decodeWorker = null;
      }, 15000);
    }
  };
  const onMessage = (event: MessageEvent<{ id: number; bytes?: ArrayBuffer; error?: boolean }>) => {
    if (event.data.id !== id) return;
    if (event.data.error || !event.data.bytes) finish(new Error('Media conversion failed.'));
    else finish(undefined, new Blob([event.data.bytes], { type: 'video/mp4' }));
  };
  const onError = () => finish(new Error('Media decoder failed.'));
  const timeout = setTimeout(() => finish(new Error('Media decoder timed out.')), 90000);
  worker.addEventListener('message', onMessage);
  worker.addEventListener('error', onError);
  worker.postMessage({ id, bytes }, [bytes]);
});

export const needsSoftwareMediaDecoder = (source: string, video: HTMLVideoElement) =>
  /\.wmv(?:[?#]|$)/i.test(source) && !video.canPlayType('video/x-ms-wmv');

// Preserve the public Source URI. Only the HTML media presenter consumes this
// generated representation of that source, including its original audio.
export const getBrowserMediaSource = (source: string): Promise<Blob> => {
  const existing = convertedSources.get(source);
  if (existing) return existing;
  const conversion = async () => {
    let cache: Cache | null = null;
    try {
      cache = await caches.open(cacheName);
      const cached = await cache.match(source);
      if (cached?.ok) return await cached.blob();
    } catch { /* In-memory playback also works when persistent storage is unavailable. */ }
    const bytes = await downloadSource(source);
    const result = await decode(bytes);
    if (cache) {
      try { await cache.put(source, new Response(result, { headers: { 'Content-Type': 'video/mp4' } })); }
      catch { /* A storage quota failure must not prevent playback. */ }
    }
    return result;
  };
  const result = decodeQueue.then(conversion);
  decodeQueue = result.catch(() => {});
  convertedSources.set(source, result);
  void result.catch(() => { if (convertedSources.get(source) === result) convertedSources.delete(source); });
  return result;
};
